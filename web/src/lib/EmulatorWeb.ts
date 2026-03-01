// Gameboy Emulator - React EmulatorWeb

import { fetchRom } from "./rom_reader";
import { getRomHeader } from "./rom_utils";
import { instructionsSet } from './cpu_instructions';
import { fetchWasmModule, loadWasmExports, type WasmExports } from "./wasm_utils";
import { asserts } from "./utils";

import type { __Internref9 } from "../../../webassembly/build/release";


/*
# Key Map:
 - A      = "z"
 - B      = "x"
 - Select = "Shift"
 - Start  = "Enter"
*/


type ComputerRef = __Internref9;

const SCREEN_WIDTH = 160;
const SCREEN_HEIGHT = 144;


export class EmulatorWeb {
    wasmExports: WasmExports | null = null;
    computer: ComputerRef | null = null;

    // Canvas rendering
    private canvas: HTMLCanvasElement | null = null;
    private ctx: CanvasRenderingContext2D | null = null;
    private imageData: ImageData | null = null;
    private animFrameId: number = 0;
    private running: boolean = false;
    public cycles: bigint = 0n;
    public frames: bigint = 0n;


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


    /**
     * Load a ROM file into the emulator.
     * Can be called multiple times to switch ROMs.
     */
    async loadRom(romFilename: string): Promise<void> {
        asserts(this.wasmExports, "wasmExports required — call init() first");
        asserts(this.computer, "computer required — call init() first");

        const romFile = await fetchRom(romFilename)

        const romHeader = getRomHeader(romFile);
        console.log('[WEB] romHeader', romHeader);

        const romFileArr: Uint8Array = new Uint8Array(romFile);
        this.wasmExports.injectRom(this.computer, romFileArr);
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
        this.wasmExports.injectInstructionsSet(this.computer, json);
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


    /**
     * Start the emulation loop (~60 FPS via requestAnimationFrame).
     */
    public start(): void {
        if (this.running) return;
        this.running = true;
        this.bindKeyboard();
        this.loop();
    }


    /**
     * Stop the emulation loop.
     */
    public stop(): void {
        this.running = false;
        this.unbindKeyboard();

        if (this.animFrameId) {
            cancelAnimationFrame(this.animFrameId);
            this.animFrameId = 0;
        }
    }


    private loop = (): void => {
        if (!this.running) return;
        asserts(this.wasmExports, "wasmExports required");
        asserts(this.computer, "computer required");

        this.stepFrame();
        this.drawFrame();

        this.animFrameId = requestAnimationFrame(this.loop);

        this.cycles = this.wasmExports.getEmulatorState(this.computer, 'cycles');
        this.frames = this.wasmExports.getEmulatorState(this.computer, 'frames');
        //console.log({ cycles: this.cycles, frames: this.frames })
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

    private onKeyDown = (e: KeyboardEvent): void => {
        const bit = this.keyMap[e.key];
        if (bit !== undefined) {
            e.preventDefault();
            this.joypadState |= bit;
            this.sendJoypad();
        }
    }

    private onKeyUp = (e: KeyboardEvent): void => {
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

    public runEmulatorCycles() {
        asserts(this.wasmExports, "wasmExports required");
        asserts(this.computer, "computer required");

        this.wasmExports.runCycles(this.computer, 100_000)
    }
}
