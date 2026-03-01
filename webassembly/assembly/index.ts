// Gameboy Emulator - WebAssembly Entrypoint

import { JSON } from 'json-as';

import { Computer } from "./model/Computer";
import { createMbc } from "./model/Mbc";
import { getRomHeader } from "./model/RomHeader";

import { InstructionSet } from './types/cpu_instructions.types';


// Gameboy Emulator

// Screen constants (exported for the frontend)
export const SCREEN_WIDTH: i32 = 160;
export const SCREEN_HEIGHT: i32 = 144;


export function runEmulator(): Computer {
    const computer = new Computer;

    const cpu = computer.cpu;
    if (!cpu) throw new Error(`Cpu not found`);

    cpu.registers.PC = 0x0150;
    cpu.registers.SP = 0xFFFE;  // Post-boot SP value
    cpu.registers.AF = 0x01B0;  // Post-boot AF (A=0x01, F=0xB0)
    cpu.registers.BC = 0x0013;
    cpu.registers.DE = 0x00D8;
    cpu.registers.HL = 0x014D;

    return computer;
}


export function runCycles(computer: Computer, cycles: i32): void {
    if (!computer) throw new Error(`Computer not found`);

    computer.runCycles(cycles);
}


/**
 * Run until the PPU produces a complete frame.
 * Call this at ~60 Hz from the frontend (requestAnimationFrame).
 */
export function runFrame(computer: Computer): void {
    if (!computer) throw new Error(`Computer not found`);

    computer.runFrame();
}


/**
 * Get the current framebuffer as a flat Uint8Array (160x144 grayscale pixels).
 * Each byte is a shade: 255=white, 170=light, 85=dark, 0=black.
 */
export function getFramebuffer(computer: Computer): Uint8Array {
    if (!computer) throw new Error(`Computer not found`);

    const ppu = computer.ppu;
    if (!ppu) throw new Error(`Ppu not found`);

    const fb = ppu.framebuffer;
    const size = fb.length;

    // Copy StaticArray to Uint8Array for JS interop
    const result = new Uint8Array(size);
    for (let i = 0; i < size; i++) {
        result[i] = fb[i];
    }
    return result;
}


export function injectInstructionsSet(computer: Computer, json: string): void {
    if (!computer) throw new Error(`Computer not found`);

    computer.instructionsSet = JSON.parse<InstructionSet>(json);
}


/**
 * Set joypad button state.
 * Bits (active HIGH — set bit = button pressed):
 *   bit 0 = A        bit 4 = Right
 *   bit 1 = B        bit 5 = Left
 *   bit 2 = Select   bit 6 = Up
 *   bit 3 = Start    bit 7 = Down
 */
export function setJoypad(computer: Computer, state: u8): void {
    if (!computer) throw new Error(`Computer not found`);

    const ioManager = computer.ioManager;
    if (!ioManager) throw new Error(`IoManager not found`);

    ioManager.joypadState = state;
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
