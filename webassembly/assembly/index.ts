
import { Computer } from "./Computer";
import { Rom } from "./memory";
import { getRomHeader } from "./rom_utils";


const gameboy = new Computer;


export function runEmulator(): void {
    gameboy.cpu.registers.PC = 0x0150;
    gameboy.cpu.registers.SP = 0x0150;

    for (let i=0; i<100; i++) {
        gameboy.cpu.runCycle();
    }


    console.log('WASM Completed')
}



export function injectInstructionsSet(): void {

}


export function injectRom(data: Uint8Array): void {
    const romHeader = getRomHeader(data);romHeader
    //console.log('romHeader', romHeader);

    let romTitle = String.UTF8.decode(romHeader.romTitle.buffer);
    console.log('[INDEX] romTitle: ' + romTitle);

    let staticArr = changetype<StaticArray<u8>>(data.slice().buffer);
    gameboy.rom = new Rom(gameboy, staticArr);
}
