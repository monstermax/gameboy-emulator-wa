

import { fetchRom, readRom } from './rom_reader';
import { getRomHeader } from './rom_utils';
import { instructionsSet } from './cpu_instructions'
import { fetchWasmModule, loadWasmExports, loadWasmModule, type WasmExports } from "./wasm_utils";
import { asserts } from './utils';

import type { __Internref7 } from '../../../webassembly/build/release';


type ComputerRef = __Internref7;


export class EmulatorCli {
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
        console.log(`Computer initialized`)

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
        asserts(this.wasmExports, "wasmExports required");
        asserts(this.computer, "computer required");

        const json = JSON.stringify(instructionsSet);
        this.wasmExports.injectInstructionsSet(this.computer, json);

        console.log('[CLI] InstructionsSet loaded');
    }


    private async loadRom(): Promise<void> {
        asserts(this.wasmExports, "wasmExports required");
        asserts(this.computer, "computer required");

        const romFile = await readRom(this.romFilename)
        //const romFile = await fetchRom(this.romFilename)

        const romHeader = getRomHeader(romFile);
        //console.log('[CLI] romHeader', romHeader);
        console.log('[CLI] Rom Title:', romFile.byteLength);
        console.log('[CLI] Rom Size:', romHeader.romTitle.toString('ascii'));

        const romFileArr: Uint8Array = new Uint8Array(romFile);
        this.wasmExports.injectRom(this.computer, romFileArr);
    }


    public runEmulatorCycles() {
        asserts(this.wasmExports, "wasmExports required");
        asserts(this.computer, "computer required");

        this.wasmExports.runCycles(this.computer, 50_000)
    }

}
