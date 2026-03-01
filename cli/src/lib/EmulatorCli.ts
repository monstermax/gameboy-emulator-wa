

import { fetchRom, readRom } from './rom_reader';
import { getRomHeader } from './rom_utils';
import { fetchWasmModule, loadWasmExports, loadWasmModule, type WasmExports } from "./wasm_utils";



export class EmulatorCli {
    romFilename: string;
    wasmExports: WasmExports | null = null;


    constructor(romFilename: string) {
        this.romFilename = romFilename;
    }


    async init() {
        await this.mountWasm()
        await this.loadRom()
    }


    private async mountWasm() {
        const imports: { env: unknown } = {
            env: {

            },
        };

        //const wasmModule = await loadWasmModule();
        const wasmModule = await fetchWasmModule();

        this.wasmExports = await loadWasmExports(wasmModule, imports);
    }


    private async loadRom() {
        const romFile = await readRom(this.romFilename)
        //const romFile = await fetchRom(this.romFilename)

        const romHeader = getRomHeader(romFile);

        console.log('romHeader', romHeader)
        console.log('romTitle:', romHeader.romTitle.toString('ascii'))
    }


}
