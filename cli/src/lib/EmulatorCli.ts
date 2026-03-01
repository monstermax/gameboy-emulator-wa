// Gameboy Emulator - NodeJS EmulatorCli

import { fetchRom, readRom } from './rom_reader';
import { instructionsSet } from './cpu_instructions'
import { fetchWasmModule, loadWasmExports, type WasmExports } from "./wasm_utils";
import { asserts } from './utils';

import type { __Internref9 } from '../../../webassembly/build/release';


type ComputerRef = __Internref9;

const SCREEN_WIDTH = 160;
const SCREEN_HEIGHT = 144;



export class EmulatorCli {
    wasmExports: WasmExports | null = null;
    computer: ComputerRef | null = null;

    // Canvas rendering
    private canvas: HTMLCanvasElement | null = null;
    private ctx: CanvasRenderingContext2D | null = null;
    private imageData: ImageData | null = null;
    private animFrameId: number = 0;
    private running: boolean = false;


    constructor() {}


    async init(): Promise<void> {
        await this.mountWasm()

        asserts(this.wasmExports, "wasmExports required")

        this.computer = this.wasmExports.runEmulator();
        console.log(`[CLI] Computer initialized`)

        await this.loadintructionsSet()
    }


    private async mountWasm(): Promise<void> {
        const imports: { env: unknown } = {
            env: {

            },
        };

        //const wasmModule = await loadWasmModule();
        const wasmModule = await fetchWasmModule();

        this.wasmExports = await loadWasmExports(wasmModule, imports);
    }


    private async loadintructionsSet(): Promise<void> {
        asserts(this.wasmExports, "wasmExports required");
        asserts(this.computer, "computer required");

        const json = JSON.stringify(instructionsSet);
        this.wasmExports.injectInstructionsSet(this.computer, json);

        //console.log('[CLI] InstructionsSet loaded');
    }


    async loadRom(romFilename: string): Promise<void> {
        asserts(this.wasmExports, "wasmExports required");
        asserts(this.computer, "computer required");

        const romFile = await readRom(romFilename)
        //const romFile = await fetchRom(this.romFilename)

        //const romHeader = getRomHeader(romFile);
        //console.log('[CLI] romHeader', romHeader);
        //console.log('[CLI] Cartridge Type:', romHeader.cartridgeType.readUInt8());
        //console.log('[CLI] Rom Title:', romFile.byteLength);
        //console.log('[CLI] Rom Size:', romHeader.romTitle.toString('ascii'));

        const romFileArr: Uint8Array = new Uint8Array(romFile);
        this.wasmExports.injectRom(this.computer, romFileArr);
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
        this.loop();
    }


    /**
     * Stop the emulation loop.
     */
    public stop(): void {
        this.running = false;
        if (this.animFrameId) {
            cancelAnimationFrame(this.animFrameId);
            this.animFrameId = 0;
        }
    }


    private loop = (): void => {
        if (!this.running) return;

        this.stepFrame();
        this.drawFrame();

        //this.animFrameId = requestAnimationFrame(this.loop); // TODO
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
            const shade = grayscale[i] as number;
            const offset = (i * 4) as number;
            pixels[offset]     = shade; // R
            pixels[offset + 1] = shade; // G
            pixels[offset + 2] = shade; // B
            pixels[offset + 3] = 255;   // A
        }

        this.ctx.putImageData(this.imageData, 0, 0);
    }


    // =========================================================================
    //  Legacy (still works for testing without canvas)
    // =========================================================================



    public runEmulatorCycles() {
        asserts(this.wasmExports, "wasmExports required");
        asserts(this.computer, "computer required");

        this.wasmExports.runCycles(this.computer, 1_000_000)
    }

}
