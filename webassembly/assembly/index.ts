
import { JSON } from 'json-as';

import { Computer } from "./Computer";
import { Rom } from "./memory";
import { getRomHeader } from "./rom_utils";

import { InstructionSet } from './cpu_instructions.types';


// Gameboy Emulator


export function runEmulator(): Computer {
    const computer = new Computer;

    const cpu = computer.cpu;
    if (!cpu) throw new Error(`Cpu not found`);

    cpu.registers.PC = 0x0150;
    //computer.cpu.registers.SP = 0x0000;

    return computer;
}


export function runCycles(computer: Computer, cycles: i32): void {
    const cpu = computer.cpu;
    if (!cpu) throw new Error(`Cpu not found`);

    const tsStart: i64 = Date.now();

    let cyclesDone: i64 = 0;
    for (cyclesDone=0; cyclesDone<cycles; cyclesDone++) {
        cpu.runCycle();
    }

    const tsEnd: i64 = Date.now();
    const duration: i64 = tsEnd - tsStart;

    const speed = Math.round((cyclesDone as f64) / (duration as f64) * 1000);

    console.log(`[WASM] WASM Completed (duration: ${duration} ms. for ${cyclesDone} cycles. => speed: ${speed} cycles/sec.)`)
}


export function injectInstructionsSet(computer: Computer, json: string): void {
    computer.instructionsSet = JSON.parse<InstructionSet>(json);

    console.log('[WASM] Instructions Loaded')
}


export function injectRom(computer: Computer, data: Uint8Array): void {
    const romHeader = getRomHeader(data);romHeader
    //console.log('romHeader', romHeader);

    let romTitle = String.UTF8.decode(romHeader.romTitle.buffer);
    console.log('[WASM] Rom Title: ' + romTitle);

    let staticArr = changetype<StaticArray<u8>>(data.buffer);
    computer.rom = new Rom(computer, staticArr);

    console.log(`[WASM] Rom Loaded (${staticArr.length} bytes)`)
}


