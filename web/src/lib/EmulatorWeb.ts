
import { fetchRom } from "./rom_reader";
import { getRomHeader } from "./rom_utils";
import { fetchWasmModule, loadWasmExports, type WasmExports } from "./wasm_utils";


export class EmulatorWeb {
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

        const wasmModule = await fetchWasmModule(true);

        this.wasmExports = await loadWasmExports(wasmModule, imports);
    }


    private async loadRom() {
        if (!this.wasmExports) return;

        const romFile = await fetchRom(this.romFilename)

        const romHeader = getRomHeader(romFile);

        console.log('romHeader', romHeader)
        console.log('romTitle:', romHeader.romTitle.toString('ascii'))
    }


}
