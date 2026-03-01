

import { fetchRom, readRom } from './rom_reader';
import { getRomHeader } from './rom_utils';
import { instructionsSet } from './cpu_instructions'
import { fetchWasmModule, loadWasmExports, loadWasmModule, type WasmExports } from "./wasm_utils";



export class EmulatorCli {
    romFilename: string;
    wasmExports: WasmExports | null = null;


    constructor(romFilename: string) {
        this.romFilename = romFilename;
    }


    async init(): Promise<void> {
        await this.mountWasm()
        await this.loadintructionsSet()
        await this.loadRom()
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
        if (!this.wasmExports) return;

        //this.wasmExports.injectInstructionsSet(instructionsSet);
    }


    private async loadRom(): Promise<void> {
        if (!this.wasmExports) return;

        const romFile = await readRom(this.romFilename)
        //const romFile = await fetchRom(this.romFilename)

        const romHeader = getRomHeader(romFile);
        console.log('[CLI] romHeader', romHeader);
        console.log('[CLI] romTitle:', romHeader.romTitle.toString('ascii'));

        this.wasmExports.injectRom(romFile.buffer);
    }


}
