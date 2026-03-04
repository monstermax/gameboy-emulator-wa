// Gameboy Emulator - NodeJS EmulatorCli (ANSI terminal rendering)

import { readRom } from './rom_reader';
import { Instruction, instructionsSet } from './cpu_instructions'
import { fetchWasmModule, loadWasmExports, type WasmExports } from "./wasm_utils";
import { asserts } from './utils';

import type { __Internref8 } from '../../../webassembly/build/release';
import { toHex } from './lib_numbers';


type ComputerRef = __Internref8;

export type StateDump = {
    cycles: bigint;
    frames: bigint;
    PC: string;
    currentInstruction: Instruction | null;
    isCbPrefixed: boolean;
    opcode: `0x${string}`;
}


const SCREEN_WIDTH = 160;
const SCREEN_HEIGHT = 144;
const ROWS = SCREEN_HEIGHT / 2; // 72 rows of half-block pairs
const TARGET_FPS = 60;
const FRAME_INTERVAL = 1000 / TARGET_FPS;

const SPEED_STEPS = [0.25, 0.5, 1, 2, 4, 8];


export class EmulatorCli {
    wasmExports: WasmExports | null = null;
    computer: ComputerRef | null = null;
    public currentRomFile: Buffer<ArrayBuffer> | null = null;

    private running: boolean = false;
    public cycles: bigint = 0n;
    public frames: bigint = 0n;
    public registers: { PC: bigint } = { PC: 0n };

    private loopTimer: ReturnType<typeof setInterval> | null = null;

    // ANSI rendering: previous frame for diff-based updates
    private prevGrid: Uint8Array = new Uint8Array(ROWS * SCREEN_WIDTH * 2);

    // Joypad state (same bit layout as WASM setJoypad)
    private joypadState: number = 0x00;

    // FPS tracking
    private frameCount: number = 0;
    private lastFpsTime: number = 0;
    private currentFps: number = 0;

    // Speed control
    private speed: number = 1.0;
    private speedAccumulator: number = 0;


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


    reset(): void {
        asserts(this.wasmExports, "wasmExports required");
        asserts(this.computer, "computer required");

        this.wasmExports.resetEmulator(this.computer)
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

        this.currentRomFile = romFile;

        return romFile;
    }


    // =========================================================================
    //  Speed Control
    // =========================================================================

    /**
     * Set emulation speed multiplier.
     * 1.0 = normal (59.73 Hz), 2.0 = double, 0.5 = half, etc.
     */
    public setSpeed(speed: number): void {
        this.speed = Math.max(0.25, Math.min(8, speed));
        this.speedAccumulator = 0;
    }

    public getSpeed(): number {
        return this.speed;
    }

    private speedUp(): void {
        const idx = SPEED_STEPS.indexOf(this.speed);
        if (idx >= 0 && idx < SPEED_STEPS.length - 1) {
            this.speed = SPEED_STEPS[idx + 1] ?? 1;

        } else if (idx === -1) {
            const next = SPEED_STEPS.find(s => s > this.speed);
            if (next) this.speed = next;
        }
        this.speedAccumulator = 0;
    }

    private speedDown(): void {
        const idx = SPEED_STEPS.indexOf(this.speed);
        if (idx > 0) {
            this.speed = SPEED_STEPS[idx - 1] ?? 1;

        } else if (idx === -1) {
            const prev = [...SPEED_STEPS].reverse().find(s => s < this.speed);
            if (prev) this.speed = prev;
        }
        this.speedAccumulator = 0;
    }

    private speedReset(): void {
        this.speed = 1.0;
        this.speedAccumulator = 0;
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


    private loop(time?: DOMHighResTimeStamp, once=false): void {
        if (!this.running) return;

        // Speed control: accumulate fractional frames
        this.speedAccumulator += this.speed;
        const framesToRun = Math.floor(this.speedAccumulator);
        this.speedAccumulator -= framesToRun;

        for (let i = 0; i < framesToRun; i++) {
            this.stepFrame();

            // Only queue audio on the last sub-frame (avoids buffer overflow at turbo)
            if (i === framesToRun - 1) {
                this.queueAudio();
            }
        }

        // Only draw once per tick (even at high speed)
        if (framesToRun > 0) {
            this.drawFrame();
        }

        this.updateFps();

        if (!once) {
            //this.animFrameId = requestAnimationFrame(this.loop); // TODO
        }
    }


    public dumpState(): StateDump {
        asserts(this.wasmExports, "wasmExports required");
        asserts(this.computer, "computer required");

        this.cycles = this.wasmExports.getEmulatorState(this.computer, 'cycles');
        this.frames = this.wasmExports.getEmulatorState(this.computer, 'frames');
        this.registers.PC = this.wasmExports.getEmulatorState(this.computer, 'registers.PC');

        const PC = Number(this.registers.PC);

        const currentInstructionCode = (this.currentRomFile)
            ? toHex(this.currentRomFile.at(PC) ?? 0, 4)
            : null;

        const previousInstructionCode = (this.currentRomFile)
            ? toHex(this.currentRomFile.at(PC-1) ?? 0, 4)
            : null;


        let currentInstruction: Instruction | null = null;
        const opcode = toHex(Number(currentInstructionCode)) as keyof typeof instructionsSet['cbprefixed']
        const isCbPrefixed = previousInstructionCode === '0xCB';

        if (isCbPrefixed) {
            currentInstruction = instructionsSet['cbprefixed'][opcode]

        } else {
            currentInstruction = instructionsSet['unprefixed'][opcode]
        }

        return { 
            cycles: this.cycles,
            frames: this.frames,
            PC: toHex(PC),
            currentInstruction,
            isCbPrefixed,
            opcode,
         };
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

            // Draw FPS + speed in top-right corner (outside the game area)
            const speedStr = this.speed === 1 ? "" : ` x${this.speed}`;
            const fpsStr = `${this.currentFps} FPS${speedStr}`;
            process.stdout.write(`\x1b[1;${SCREEN_WIDTH + 2}H\x1b[0;33m${fpsStr}   \x1b[0m`);
        }
    }


    // =========================================================================
    //  Audio (PCM pipe to system audio player)
    // =========================================================================

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

        // Speed controls: + / - / 0
        if (key === "+" || key === "=") { this.speedUp(); return; }
        if (key === "-" || key === "_") { this.speedDown(); return; }
        if (key === "0")               { this.speedReset(); return; }

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

    public runEmulatorCycles(cyclesCount=1): void {
        asserts(this.wasmExports, "wasmExports required");
        asserts(this.computer, "computer required");

        this.wasmExports.runCycles(this.computer, cyclesCount);
    }
}


// === Helpers ===

/** Map grayscale shade (0-255) to ANSI-256 grayscale (232-255) */
function shadeToAnsi(shade: number): number {
    return 232 + Math.floor((shade / 255) * 23);
}

