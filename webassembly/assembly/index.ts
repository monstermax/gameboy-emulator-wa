
import { JSON } from 'json-as';

import { Computer } from "./model/Computer";
import { Ram, Rom } from "./model/Memory";
import { getRomHeader } from "./model/RomHeader";

import { InstructionSet } from './types/cpu_instructions.types';


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
    if (!computer) throw new Error(`Computer not found`);

    computer.runCycles(cycles);
}


export function injectInstructionsSet(computer: Computer, json: string): void {
    if (!computer) throw new Error(`Computer not found`);

    computer.instructionsSet = JSON.parse<InstructionSet>(json);

    console.log('[WASM] Instructions Loaded')
}


export function injectRom(computer: Computer, data: Uint8Array): void {
    if (!computer) throw new Error(`Computer not found`);

    const romHeader = getRomHeader(data);
    //console.log('romHeader', romHeader);

    let romTitle = String.UTF8.decode(romHeader.romTitle.buffer);
    console.log('[WASM] Rom Title: ' + romTitle);

    let staticArr = changetype<StaticArray<u8>>(data.buffer);
    computer.rom = new Rom(computer, staticArr);
    computer.ram = new Ram(computer);

    console.log(`[WASM] Rom Loaded (${staticArr.length} bytes)`)
}


