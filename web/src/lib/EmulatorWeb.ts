// Gameboy Emulator - React EmulatorWeb

import { fetchRom } from "./rom_reader";
import { getRomHeader } from "./rom_utils";
import { instructionsSet, type Instruction } from './cpu_instructions';
import { fetchWasmModule, loadWasmExports, type WasmExports } from "./wasm_utils";
import { asserts } from "./utils";
import { toHex } from "./lib_numbers";

import type { __Internref8 } from "../../../webassembly/build/release";


/*
# Key Map:
 - A      = "z"
 - B      = "x"
 - Select = "Shift"
 - Start  = "Enter"
*/


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


export class EmulatorWeb {
    wasmExports: WasmExports | null = null;
    computer: ComputerRef | null = null;
    public currentRomFile: Buffer<ArrayBuffer> | null = null;

    // Canvas rendering
    private canvas: HTMLCanvasElement | null = null;
    private ctx: CanvasRenderingContext2D | null = null;
    private imageData: ImageData | null = null;
    private animFrameId: number = 0;
    private running: boolean = false;
    public cycles: bigint = 0n;
    public frames: bigint = 0n;
    public registers: { PC: bigint } = { PC: 0n };
    public audioEnabled  = true;


    constructor() {}


    /**
     * Initialize the WASM module and create the Computer instance.
     * Must be called before loadRom().
     */
    async init(): Promise<void> {
        await this.mountWasm()

        asserts(this.wasmExports, "wasmExports required")

        this.computer = this.wasmExports.runEmulator();
        console.log(`[WEB] Computer initialized`)

        await this.loadInstructionsSet()
    }


    reset(): void {
        asserts(this.wasmExports, "wasmExports required");
        asserts(this.computer, "computer required");

        this.wasmExports.resetEmulator(this.computer)
    }


    /**
     * Load a ROM file into the emulator.
     * Can be called multiple times to switch ROMs.
     */
    async loadRom(romFilename: string): Promise<Buffer<ArrayBuffer>> {
        asserts(this.wasmExports, "wasmExports required — call init() first");
        asserts(this.computer, "computer required — call init() first");

        const romFile = await fetchRom(romFilename)

        const romHeader = getRomHeader(romFile);
        console.log('[WEB] romHeader', romHeader);

        const romFileArr: Uint8Array = new Uint8Array(romFile);
        this.wasmExports.injectRom(this.computer, romFileArr);

        this.currentRomFile = romFile;

        return romFile;
    }


    private async mountWasm(): Promise<void> {
        const imports: { env: unknown } = {
            env: {},
        };

        const wasmModule = await fetchWasmModule(true);

        this.wasmExports = await loadWasmExports(wasmModule, imports);
    }


    private async loadInstructionsSet(): Promise<void> {
        asserts(this.wasmExports, "wasmExports required");
        asserts(this.computer, "computer required");

        const json = JSON.stringify(instructionsSet);
        //this.wasmExports.injectInstructionsSet(this.computer, json); // DEPRECATED
    }


    public getInstructionsSet() {
        return instructionsSet;
    }


    /**
     * Start the emulation loop (~60 FPS via requestAnimationFrame).
     */
    public start(): void {
        if (this.running) return;
        this.running = true;
        this.initAudio();
        this.bindKeyboard();
        this.loop();
    }


    /**
     * Stop the emulation loop.
     */
    public stop(): void {
        this.running = false;
        this.unbindKeyboard();
        this.destroyAudio();

        if (this.animFrameId) {
            cancelAnimationFrame(this.animFrameId);
            this.animFrameId = 0;
        }
    }


    public loop = (time?: DOMHighResTimeStamp, once=false): void => {
        if (!this.running && !once) return;

        this.stepFrame();
        this.drawFrame();

        if (this.audioEnabled) {
            this.queueAudio();
        }

        this.dumpState()

        if (!once) {
            this.animFrameId = requestAnimationFrame(this.loop);
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


    /**
     * Execute one full Game Boy frame (~70224 T-cycles).
     */
    private stepFrame(): void {
        asserts(this.wasmExports, "wasmExports required");
        asserts(this.computer, "computer required");

        this.wasmExports.runFrame(this.computer);
    }


    /**
     * Read the PPU framebuffer and draw it onto the canvas.
     */
    private drawFrame(): void {
        if (!this.ctx || !this.imageData || !this.wasmExports || !this.computer) return;

        // Get the grayscale framebuffer from WASM (160*144 bytes)
        const grayscale: Uint8Array = this.wasmExports.getFramebuffer(this.computer);

        // Convert grayscale → RGBA
        const pixels = this.imageData.data;

        for (let i = 0; i < SCREEN_WIDTH * SCREEN_HEIGHT; i++) {
            const shade = grayscale[i];
            const offset = i * 4;
            pixels[offset]     = shade; // R
            pixels[offset + 1] = shade; // G
            pixels[offset + 2] = shade; // B
            pixels[offset + 3] = 255;   // A
        }

        this.ctx.putImageData(this.imageData, 0, 0);
    }


    // =========================================================================
    //  Canvas / Rendering
    // =========================================================================

    /**
     * Attach a <canvas> element for screen output.
     * The canvas should be at least 160x144. CSS-scale for zoom.
     */
    public attachCanvas(canvas: HTMLCanvasElement): void {
        this.canvas = canvas;
        this.canvas.width = SCREEN_WIDTH;
        this.canvas.height = SCREEN_HEIGHT;

        this.ctx = canvas.getContext("2d");
        if (!this.ctx) throw new Error("Could not get 2D context");

        // Pre-allocate ImageData (reused every frame)
        this.imageData = this.ctx.createImageData(SCREEN_WIDTH, SCREEN_HEIGHT);
        this.imageData.data.fill(255);
    }


    // =========================================================================
    //  Audio
    // =========================================================================

    private audioCtx: AudioContext | null = null;
    private audioScriptNode: ScriptProcessorNode | null = null;
    private audioQueue: Float32Array[] = [];
    private audioQueueSamples: number = 0;
    private readonly AUDIO_BUFFER_LIMIT = 8820; // ~200ms at 44100Hz

    private initAudio(): void {
        this.audioCtx = new AudioContext({ sampleRate: 44100 });
        // ScriptProcessorNode: 2048 frame buffer, 0 inputs, 2 outputs (stereo)
        this.audioScriptNode = this.audioCtx.createScriptProcessor(2048, 0, 2);

        this.audioScriptNode.onaudioprocess = (event: AudioProcessingEvent) => {
            const outL = event.outputBuffer.getChannelData(0);
            const outR = event.outputBuffer.getChannelData(1);
            let writePos = 0;
            const needed = outL.length;

            while (writePos < needed && this.audioQueue.length > 0) {
                const chunk = this.audioQueue[0];
                const chunkSamples = chunk.length / 2;
                const available = chunkSamples;
                const toCopy = Math.min(available, needed - writePos);

                for (let i = 0; i < toCopy; i++) {
                    outL[writePos + i] = chunk[i * 2];
                    outR[writePos + i] = chunk[i * 2 + 1];
                }

                writePos += toCopy;

                if (toCopy >= chunkSamples) {
                    this.audioQueue.shift();
                    this.audioQueueSamples -= chunkSamples;
                } else {
                    // Partial consume: keep remainder
                    this.audioQueue[0] = chunk.slice(toCopy * 2);
                    this.audioQueueSamples -= toCopy;
                }
            }

            // Fill remainder with silence
            for (let i = writePos; i < needed; i++) {
                outL[i] = 0;
                outR[i] = 0;
            }
        };

        this.audioScriptNode.connect(this.audioCtx.destination);
    }

    private queueAudio(): void {
        if (!this.audioCtx || !this.wasmExports || !this.computer) return;

        // Resume context if suspended (browsers require user gesture)
        if (this.audioCtx.state === "suspended") {
            this.audioCtx.resume();
        }

        const sampleCount = this.wasmExports.getAudioSampleCount(this.computer);
        if (sampleCount <= 0) return;

        // Drop audio if queue is too far ahead (avoid growing latency)
        if (this.audioQueueSamples > this.AUDIO_BUFFER_LIMIT) return;

        const buffer: Float32Array = this.wasmExports.getAudioBuffer(this.computer);
        this.audioQueue.push(buffer);
        this.audioQueueSamples += sampleCount;
    }


    private destroyAudio(): void {
        if (this.audioScriptNode) {
            this.audioScriptNode.disconnect();
            this.audioScriptNode = null;
        }
        if (this.audioCtx) {
            this.audioCtx.close();
            this.audioCtx = null;
        }
        this.audioQueue = [];
        this.audioQueueSamples = 0;
    }


    // =========================================================================
    //  Joypad Input
    // =========================================================================

    //  Bit mapping (active HIGH):
    //    bit 0 = A        bit 4 = Right
    //    bit 1 = B        bit 5 = Left
    //    bit 2 = Select   bit 6 = Up
    //    bit 3 = Start    bit 7 = Down
    private joypadState: number = 0x00;

    private keyMap: Record<string, number> = {
        "ArrowRight": 0x10,
        "ArrowLeft":  0x20,
        "ArrowUp":    0x40,
        "ArrowDown":  0x80,
        "z":          0x01,  // A
        "x":          0x02,  // B
        "Shift":      0x04,  // Select
        "Enter":      0x08,  // Start
    };

    public onKeyDown = (e: KeyboardEvent): void => {
        const bit = this.keyMap[e.key];
        if (bit !== undefined) {
            e.preventDefault();
            this.joypadState |= bit;
            this.sendJoypad();
        }
    }

    public onKeyUp = (e: KeyboardEvent): void => {
        const bit = this.keyMap[e.key];
        if (bit !== undefined) {
            e.preventDefault();
            this.joypadState &= ~bit;
            this.sendJoypad();
        }
    }

    private sendJoypad(): void {
        if (!this.wasmExports || !this.computer) return;
        this.wasmExports.setJoypad(this.computer, this.joypadState);
    }

    private bindKeyboard(): void {
        window.addEventListener("keydown", this.onKeyDown);
        window.addEventListener("keyup", this.onKeyUp);
    }

    private unbindKeyboard(): void {
        window.removeEventListener("keydown", this.onKeyDown);
        window.removeEventListener("keyup", this.onKeyUp);
    }


    // =========================================================================
    //  Legacy (still works for testing without canvas)
    // =========================================================================

    public runEmulatorCycles(cyclesCount=1) {
        asserts(this.wasmExports, "wasmExports required");
        asserts(this.computer, "computer required");

        this.wasmExports.runCycles(this.computer, cyclesCount)

        this.drawFrame()
    }

    public runEmulatorFrames(framesCount=1) {
        asserts(this.wasmExports, "wasmExports required");
        asserts(this.computer, "computer required");

        //this.wasmExports.runFrames(this.computer, framesCount)

        for (let i=0; i<framesCount; i++) {
            this.loop(undefined, true)
        }
    }

}

