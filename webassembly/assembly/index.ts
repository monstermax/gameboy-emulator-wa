
import { Computer } from "./Computer";


export function runEmulator(): void {
    const gameboy = new Computer;

    gameboy.cpu.registers.PC = 0x0150;

    for (let i=0; i<10; i++) {
        gameboy.cpu.runCycle();
    }


    console.log('WASM Completed')
}

