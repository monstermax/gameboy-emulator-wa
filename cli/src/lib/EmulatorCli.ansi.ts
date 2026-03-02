// Gameboy Emulator - NodeJS EmulatorCli (ANSI terminal rendering)

import { readRom } from './rom_reader';
import { instructionsSet } from './cpu_instructions'
import { fetchWasmModule, loadWasmExports, type WasmExports } from "./wasm_utils";
import { asserts } from './utils';

import type { __Internref8 } from '../../../webassembly/build/release';


type ComputerRef = __Internref8;

const SCREEN_WIDTH = 160;
const SCREEN_HEIGHT = 144;
const ROWS = SCREEN_HEIGHT / 2; // 72 rows of half-block pairs
const TARGET_FPS = 60;
const FRAME_INTERVAL = 1000 / TARGET_FPS;


export class EmulatorCli {
    wasmExports: WasmExports | null = null;
    computer: ComputerRef | null = null;

    private running: boolean = false;
    private loopTimer: ReturnType<typeof setInterval> | null = null;

    // ANSI rendering: previous frame for diff-based updates
    private prevGrid: Uint8Array = new Uint8Array(ROWS * SCREEN_WIDTH * 2);

    // Joypad state (same bit layout as WASM setJoypad)
    private joypadState: number = 0x00;

    // FPS tracking
    private frameCount: number = 0;
    private lastFpsTime: number = 0;
    private currentFps: number = 0;


    constructor() {
        // Force full redraw on first frame
        this.prevGrid.fill(255);
    }


    async init(): Promise<void> {
        await this.mountWasm();

        asserts(this.wasmExports, "wasmExports required");

        this.computer = this.wasmExports.runEmulator();
        console.log(`[CLI] Computer initialized`);

        await this.loadInstructionsSet();
    }


    private async mountWasm(): Promise<void> {
        const imports: { env: unknown } = { env: {} };
        const wasmModule = await fetchWasmModule();
        this.wasmExports = await loadWasmExports(wasmModule, imports);
    }


    private async loadInstructionsSet(): Promise<void> {
        asserts(this.wasmExports, "wasmExports required");
        asserts(this.computer, "computer required");

        const json = JSON.stringify(instructionsSet);
        //this.wasmExports.injectInstructionsSet(this.computer, json); // DEPRECATED
    }


    async loadRom(romFilename: string): Promise<Buffer<ArrayBuffer>> {
        asserts(this.wasmExports, "wasmExports required");
        asserts(this.computer, "computer required");

        const romFile = await readRom(romFilename);
        const romFileArr: Uint8Array = new Uint8Array(romFile);
        this.wasmExports.injectRom(this.computer, romFileArr);

        return romFile;
    }


    // =========================================================================
    //  Start / Stop
    // =========================================================================

    public start(): void {
        if (this.running) return;
        this.running = true;

        // Setup terminal
        process.stdout.write("\x1b[2J\x1b[?25l"); // clear + hide cursor
        this.bindKeyboard();
        this.initAudio();

        this.lastFpsTime = Date.now();
        this.frameCount = 0;

        // Main loop via setInterval
        this.loopTimer = setInterval(() => this.loop(), FRAME_INTERVAL);
    }


    public stop(): void {
        this.running = false;
        this.unbindKeyboard();
        this.destroyAudio();

        if (this.loopTimer) {
            clearInterval(this.loopTimer);
            this.loopTimer = null;
        }

        // Restore terminal
        process.stdout.write("\x1b[?25h\x1b[0m\n"); // show cursor + reset colors
    }


    private loop(): void {
        if (!this.running) return;

        this.stepFrame();
        this.drawFrame();
        this.queueAudio();
        this.updateFps();
    }


    // =========================================================================
    //  Emulation
    // =========================================================================

    private stepFrame(): void {
        asserts(this.wasmExports, "wasmExports required");
        asserts(this.computer, "computer required");

        this.wasmExports.runFrame(this.computer);
    }


    // =========================================================================
    //  ANSI Rendering (half-blocks, diff-based)
    // =========================================================================

    private drawFrame(): void {
        if (!this.wasmExports || !this.computer) return;

        const grayscale: Uint8Array = this.wasmExports.getFramebuffer(this.computer);

        let buffer = "";

        for (let row = 0; row < ROWS; row++) {
            const y = row * 2;

            for (let x = 0; x < SCREEN_WIDTH; x++) {
                const top = shadeToAnsi(grayscale[y * SCREEN_WIDTH + x] ?? 0);
                const bot = (y + 1 < SCREEN_HEIGHT)
                    ? shadeToAnsi(grayscale[(y + 1) * SCREEN_WIDTH + x] ?? 0)
                    : 232;

                const idx = (row * SCREEN_WIDTH + x) * 2;
                if (this.prevGrid[idx] !== top || this.prevGrid[idx + 1] !== bot) {
                    this.prevGrid[idx] = top;
                    this.prevGrid[idx + 1] = bot;

                    // Move cursor + set colors + draw half-block
                    buffer += `\x1b[${row + 1};${x + 1}H\x1b[38;5;${top};48;5;${bot}m▀`;
                }
            }
        }

        if (buffer.length > 0) {
            buffer += "\x1b[0m";
            process.stdout.write(buffer);
        }
    }


    private updateFps(): void {
        this.frameCount++;
        const now = Date.now();
        const elapsed = now - this.lastFpsTime;

        if (elapsed >= 1000) {
            this.currentFps = Math.round((this.frameCount / elapsed) * 1000);
            this.frameCount = 0;
            this.lastFpsTime = now;

            // Draw FPS in top-right corner (outside the game area)
            const fpsStr = `${this.currentFps} FPS`;
            process.stdout.write(`\x1b[1;${SCREEN_WIDTH + 2}H\x1b[0;33m${fpsStr}\x1b[0m`);
        }
    }


    // =========================================================================
    //  Audio (PCM pipe to system audio player)
    // =========================================================================

    //  Pipes raw PCM float32 samples to aplay/sox/ffplay via child_process.
    //  Auto-detects which player is available.
    //  If none found, audio is silently disabled.

    private audioProcess: import('child_process').ChildProcess | null = null;
    private audioEnabled: boolean = false;

    private initAudio(): void {
        const { execSync, spawn } = require('child_process') as typeof import('child_process');

        const players: { cmd: string; args: string[] }[] = [
            {
                cmd: "play",   // sox
                args: ["-t", "raw", "-r", "44100", "-e", "floating-point", "-b", "32", "-c", "2", "-q", "-"]
            },
            {
                cmd: "aplay",
                args: ["-f", "FLOAT_LE", "-r", "44100", "-c", "2", "-t", "raw", "-q", "-"]
            },
            {
                cmd: "ffplay",
                args: ["-f", "f32le", "-ar", "44100", "-ac", "2", "-nodisp", "-autoexit", "-loglevel", "quiet", "-i", "-"]
            },
        ];

        for (const player of players) {
            try {
                execSync(`which ${player.cmd}`, { stdio: "ignore" });

                this.audioProcess = spawn(player.cmd, player.args, {
                    stdio: ["pipe", "ignore", "ignore"],
                });

                this.audioProcess.on("error", () => {
                    this.audioEnabled = false;
                    this.audioProcess = null;
                });

                this.audioEnabled = true;
                break;
            } catch {
                // Player not found, try next
            }
        }
    }

    private queueAudio(): void {
        if (!this.audioEnabled || !this.audioProcess?.stdin || !this.wasmExports || !this.computer) return;

        const sampleCount = this.wasmExports.getAudioSampleCount(this.computer);
        if (sampleCount <= 0) return;

        const buffer: Float32Array = this.wasmExports.getAudioBuffer(this.computer);

        // Write raw PCM float32 to the audio player's stdin
        const nodeBuffer = Buffer.from(buffer.buffer, buffer.byteOffset, buffer.byteLength);

        try {
            this.audioProcess.stdin.write(nodeBuffer);
        } catch {
            // Pipe broken, disable audio
            this.audioEnabled = false;
        }
    }

    private destroyAudio(): void {
        if (this.audioProcess) {
            try {
                this.audioProcess.stdin?.end();
                this.audioProcess.kill();
            } catch { /* ignore */ }
            this.audioProcess = null;
        }
        this.audioEnabled = false;
    }


    // =========================================================================
    //  Keyboard Input (stdin raw mode)
    // =========================================================================

    //  Joypad bit mapping (same as WASM setJoypad):
    //    bit 0 = A        bit 4 = Right
    //    bit 1 = B        bit 5 = Left
    //    bit 2 = Select   bit 6 = Up
    //    bit 3 = Start    bit 7 = Down

    private keyMap: Record<string, number> = {
        "\x1b[C": 0x10,     // Right arrow
        "\x1b[D": 0x20,     // Left arrow
        "\x1b[A": 0x40,     // Up arrow
        "\x1b[B": 0x80,     // Down arrow
        "z":      0x01,     // A
        "x":      0x02,     // B
        "c":      0x04,     // Select
        "\r":     0x08,     // Start (Enter)
    };

    // For raw mode we only get keydown. We simulate keyup with a timeout.
    private keyTimers: Map<string, ReturnType<typeof setTimeout>> = new Map();
    private readonly KEY_RELEASE_DELAY = 100; // ms


    private onStdinData = (data: Buffer): void => {
        const key = data.toString();

        // Ctrl+C to quit
        if (key === "\x03") {
            this.stop();
            process.exit(0);
        }

        // Ctrl+Q / Escape to quit
        if (key === "\x1b" && data.length === 1) {
            this.stop();
            process.exit(0);
        }

        const bit = this.keyMap[key];
        if (bit === undefined) return;

        // Press
        this.joypadState |= bit;
        this.sendJoypad();

        // Auto-release after delay (stdin raw mode has no keyup events)
        const existing = this.keyTimers.get(key);
        if (existing) clearTimeout(existing);

        this.keyTimers.set(key, setTimeout(() => {
            this.joypadState &= ~bit;
            this.sendJoypad();
            this.keyTimers.delete(key);
        }, this.KEY_RELEASE_DELAY));
    }


    private sendJoypad(): void {
        if (!this.wasmExports || !this.computer) return;
        this.wasmExports.setJoypad(this.computer, this.joypadState);
    }


    private bindKeyboard(): void {
        if (process.stdin.isTTY) {
            process.stdin.setRawMode(true);
        }
        process.stdin.resume();
        process.stdin.on("data", this.onStdinData);
    }


    private unbindKeyboard(): void {
        process.stdin.off("data", this.onStdinData);
        if (process.stdin.isTTY) {
            process.stdin.setRawMode(false);
        }
        process.stdin.pause();

        // Clear all key timers
        for (const timer of this.keyTimers.values()) {
            clearTimeout(timer);
        }
        this.keyTimers.clear();
    }


    // =========================================================================
    //  Legacy
    // =========================================================================

    public runEmulatorCycles(): void {
        asserts(this.wasmExports, "wasmExports required");
        asserts(this.computer, "computer required");

        this.wasmExports.runCycles(this.computer, 1_000_000);
    }
}


// === Helpers ===

/** Map grayscale shade (0-255) to ANSI-256 grayscale (232-255) */
function shadeToAnsi(shade: number): number {
    return 232 + Math.floor((shade / 255) * 23);
}
