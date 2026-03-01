
import { Computer } from "./Computer";
import { getRomHeader } from "./rom_utils";


export function runEmulator(): void {
    const gameboy = new Computer;

    gameboy.cpu.registers.PC = 0x0150;

    for (let i=0; i<10; i++) {
        gameboy.cpu.runCycle();
    }


    console.log('WASM Completed')
}



export function injectInstructionsSet(): void {

}


export function injectRom(data: ArrayBuffer): void {
    const romHeader = getRomHeader(data);romHeader
    //console.log('romHeader', romHeader);
    console.log('[INDEX] romTitle:');
    console.log(romHeader.romTitle.toString());
}
