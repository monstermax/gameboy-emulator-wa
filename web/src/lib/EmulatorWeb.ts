
import { fetchRom } from "./rom_reader";
import { getRomHeader } from "./rom_utils";
import { instructionsSet } from './cpu_instructions';
import { fetchWasmModule, loadWasmExports, type WasmExports } from "./wasm_utils";
import { asserts } from "./utils";

import type { __Internref8 } from "../../../webassembly/build/release";


type ComputerRef = __Internref8;


export class EmulatorWeb {
    romFilename: string;
    wasmExports: WasmExports | null = null;
    computer: ComputerRef | null = null;


    constructor(romFilename: string) {
        this.romFilename = romFilename;
    }


    async init(): Promise<void> {
        await this.mountWasm()

        asserts(this.wasmExports, "wasmExports required")

        this.computer = this.wasmExports.runEmulator();
        console.log(`[WEB] Computer initialized`)

        await this.loadintructionsSet()
        await this.loadRom()
    }


    private async mountWasm(): Promise<void> {
        const imports: { env: unknown } = {
            env: {

            },
        };

        const wasmModule = await fetchWasmModule(true);

        this.wasmExports = await loadWasmExports(wasmModule, imports);
    }


    private async loadintructionsSet(): Promise<void> {
        asserts(this.wasmExports, "wasmExports required");
        asserts(this.computer, "computer required");

        const json = JSON.stringify(instructionsSet);
        this.wasmExports.injectInstructionsSet(this.computer, json);

        //console.log('[WEB] InstructionsSet loaded');
    }


    private async loadRom(): Promise<void> {
        asserts(this.wasmExports, "wasmExports required");
        asserts(this.computer, "computer required");

        const romFile = await fetchRom(this.romFilename)

        const romHeader = getRomHeader(romFile);

        console.log('[WEB] romHeader', romHeader);
        //console.log('[WEB] Cartridge Type:', romHeader.cartridgeType.readUInt8());
        //console.log('[WEB] Rom Size:', romFile.byteLength);
        //console.log('[WEB] Rom Title:', romHeader.romTitle.toString('ascii'))

        const romFileArr: Uint8Array = new Uint8Array(romFile);
        this.wasmExports.injectRom(this.computer, romFileArr);
    }


    public runEmulatorCycles() {
        asserts(this.wasmExports, "wasmExports required");
        asserts(this.computer, "computer required");

        this.wasmExports.runCycles(this.computer, 100_000)
    }

}
