import { JSON } from 'json-as';

import { Computer } from "./model/Computer";
import { createMbc } from "./model/Mbc";
import { getRomHeader } from "./model/RomHeader";

import { InstructionSet } from './types/cpu_instructions.types';


// Gameboy Emulator

export function runEmulator(): Computer {
    const computer = new Computer;

    const cpu = computer.cpu;
    if (!cpu) throw new Error(`Cpu not found`);

    cpu.registers.PC = 0x0150;

    return computer;
}


export function runCycles(computer: Computer, cycles: i32): void {
    if (!computer) throw new Error(`Computer not found`);

    computer.runCycles(cycles);
}


export function injectInstructionsSet(computer: Computer, json: string): void {
    if (!computer) throw new Error(`Computer not found`);

    computer.instructionsSet = JSON.parse<InstructionSet>(json);
}


export function injectRom(computer: Computer, romFile: Uint8Array): void {
    if (!computer) throw new Error(`Computer not found`);

    const romHeader = getRomHeader(romFile);

    let romTitle = String.UTF8.decode(romHeader.romTitle.buffer);
    const cartridgeType: u8 = romHeader.cartridgeType.at(0);
    const romSizeCode: u8 = romHeader.romSize.at(0);
    const ramSizeCode: u8 = romHeader.ramSize.at(0);

    console.log('[WASM] Cartridge Type: ' + cartridgeType.toString());
    console.log('[WASM] Rom Size Code: ' + romSizeCode.toString());
    console.log('[WASM] Ram Size Code: ' + ramSizeCode.toString());
    console.log('[WASM] Rom Size: ' + romFile.byteLength.toString());
    console.log('[WASM] Rom Title: ' + romTitle);

    let staticArr = changetype<StaticArray<u8>>(romFile.buffer);

    // Créer le MBC approprié selon le type de cartouche
    computer.mbc = createMbc(staticArr, cartridgeType, romSizeCode, ramSizeCode);

    console.log(`[WASM] Rom Loaded (${staticArr.length} bytes)`)
}

