// Gameboy Emulator - WebAssembly Entrypoint

//import { JSON } from 'json-as';

import { Computer } from "./model/Computer";
import { createMbc } from "./model/Mbc";
import { getRomHeader } from "./model/RomHeader";

//import { InstructionSet } from './types/cpu_instructions.types';


// Gameboy Emulator

// Screen constants (exported for the frontend)
export const SCREEN_WIDTH: i32 = 160;
export const SCREEN_HEIGHT: i32 = 144;


export function runEmulator(): Computer {
    const computer = new Computer;
    resetEmulator(computer);
    return computer;
}


export function resetEmulator(computer: Computer): void {
    const cpu = computer.cpu;
    if (!cpu) throw new Error(`Cpu not found`);

    cpu.registers.PC = 0x0150;
    cpu.registers.SP = 0xFFFE;  // Post-boot SP value
    cpu.registers.AF = 0x01B0;  // Post-boot AF (A=0x01, F=0xB0)
    cpu.registers.BC = 0x0013;
    cpu.registers.DE = 0x00D8;
    cpu.registers.HL = 0x014D;
}


export function runCycles(computer: Computer, cycles: i32): void {
    if (!computer) throw new Error(`Computer not found`);

    computer.runCycles(cycles);
}


export function runFrames(computer: Computer, frames: i32): void {
    if (!computer) throw new Error(`Computer not found`);

    computer.runFrames(frames);
}


/**
 * Run until the PPU produces a complete frame.
 * Call this at ~60 Hz from the frontend (requestAnimationFrame).
 */
export function runFrame(computer: Computer): void {
    if (!computer) throw new Error(`Computer not found`);

    computer.runFrame();
}


export function getEmulatorState(computer: Computer, stateKey: string): i64 {
    if (!computer) throw new Error(`Computer not found`);

    const cpu = computer.cpu;
    if (!cpu) throw new Error(`Cpu not found`);

    if (stateKey === 'cycles') {
        return cpu.cycles;
    }

    if (stateKey === 'frames') {
        return computer.frames;
    }

    if (stateKey === 'registers.PC') {
        return cpu.registers.PC || 0;
    }

    if (stateKey === 'registers.SP') {
        return cpu.registers.SP || 0;
    }

    if (stateKey === 'registers.A') {
        return cpu.registers.A || 0;
    }

    if (stateKey === 'registers.B') {
        return cpu.registers.B || 0;
    }

    if (stateKey === 'registers.C') {
        return cpu.registers.C || 0;
    }

    if (stateKey === 'registers.D') {
        return cpu.registers.D || 0;
    }

    if (stateKey === 'registers.E') {
        return cpu.registers.E || 0;
    }

    if (stateKey === 'registers.F') {
        return cpu.registers.F || 0;
    }

    if (stateKey === 'registers.H') {
        return cpu.registers.H || 0;
    }

    if (stateKey === 'registers.L') {
        return cpu.registers.L || 0;
    }

    throw new Error(`Key "${stateKey}" not found`);

    return 0;
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


/**
 * Get the audio sample buffer (interleaved L/R float32 samples).
 * Call after runFrame(). sampleCount tells how many stereo samples were generated.
 */
export function getAudioBuffer(computer: Computer): Float32Array {
    if (!computer) throw new Error(`Computer not found`);

    const apu = computer.apu;
    if (!apu) throw new Error(`Apu not found`);

    const count = apu.sampleCount * 2; // stereo: L,R pairs
    const result = new Float32Array(count);
    for (let i = 0; i < count; i++) {
        result[i] = apu.sampleBuffer[i];
    }
    return result;
}


export function getAudioSampleCount(computer: Computer): i32 {
    if (!computer) throw new Error(`Computer not found`);

    const apu = computer.apu;
    if (!apu) throw new Error(`Apu not found`);

    return apu.sampleCount;
}


//export function injectInstructionsSet(computer: Computer, json: string): void {
//    if (!computer) throw new Error(`Computer not found`);
//
//    computer.instructionsSet = JSON.parse<InstructionSet>(json);
//}


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


// read memory at address ===
export function readMemory(computer: Computer, address: u16): u8 {
    const bus = computer.memoryBus;
    if (!bus) throw new Error("MemoryBus not found");
    return bus.read(address);
}



export function readNextInstructions(computer: Computer, count: i32): Uint8Array {
    const bus = computer.memoryBus;
    if (!bus) throw new Error("MemoryBus not found");
    const cpu = computer.cpu;
    if (!cpu) throw new Error("Cpu not found");

    // 6 bytes per entry: addr_lo, addr_hi, opcode, isCB, byte1, byte2
    const result = new Uint8Array(count * 6);
    let pc: u16 = cpu.registers.PC;
    let offset: i32 = 0;

    for (let i: i32 = 0; i < count; i++) {
        const addr = pc;
        let opcode = bus.read(pc);
        let isCB: u8 = 0;
        let byte1: u8 = 0;
        let byte2: u8 = 0;
        let instrLen: u16 = 1;

        if (opcode == 0xCB) {
            isCB = 1;
            opcode = bus.read(pc + 1);
            instrLen = 2;

        } else {
            instrLen = getInstructionLength(opcode);
            if (instrLen >= 2) byte1 = bus.read(pc + 1);
            if (instrLen >= 3) byte2 = bus.read(pc + 2);
        }

        result[offset]     = <u8>(addr & 0xFF);
        result[offset + 1] = <u8>((addr >> 8) & 0xFF);
        result[offset + 2] = opcode;
        result[offset + 3] = isCB;
        result[offset + 4] = byte1;
        result[offset + 5] = byte2;

        offset += 6;
        pc += instrLen;
    }

    return result;
}


function getInstructionLength(opcode: u8): u16 {
    switch (opcode) {
        // 3 bytes: LD rr,d16 / LD (a16),SP / JP / CALL
        case 0x01: case 0x08: case 0x11: case 0x21: case 0x31:
        case 0xC2: case 0xC3: case 0xC4: case 0xCA: case 0xCC: case 0xCD:
        case 0xD2: case 0xD4: case 0xDA: case 0xDC:
        case 0xEA: case 0xFA:
            return 3;

        // 2 bytes: LD r,d8 / JR / ALU d8 / LDH / ADD SP,e8 / CB prefix
        case 0x06: case 0x0E: case 0x16: case 0x1E:
        case 0x26: case 0x2E: case 0x36: case 0x3E:
        case 0x10: case 0x18: case 0x20: case 0x28: case 0x30: case 0x38:
        case 0xC6: case 0xCE: case 0xD6: case 0xDE:
        case 0xE0: case 0xE6: case 0xE8: case 0xEE:
        case 0xF0: case 0xF6: case 0xF8: case 0xFE:
            return 2;

        default:
            return 1;
    }
}


// Read stack contents: returns pairs [addr_lo, addr_hi, val_lo, val_hi] from SP up to 0xFFFE
export function readStack(computer: Computer, maxEntries: i32): Uint8Array {
    const cpu = computer.cpu;
    if (!cpu) throw new Error("Cpu not found");
    const bus = computer.memoryBus;
    if (!bus) throw new Error("MemoryBus not found");

    const sp = cpu.registers.SP;
    const stackBase: u16 = 0xCFFE;

    if (sp >= stackBase) {
        const result = new Uint8Array(2);
        result[0] = <u8>(sp & 0xFF);
        result[1] = <u8>((sp >> 8) & 0xFF);
        return result;
    }

    const bytesUsed: i32 = <i32>(1 + stackBase - sp);
    const count: i32 = bytesUsed < maxEntries ? bytesUsed : maxEntries;

    // 2 bytes SP + 3 bytes per entry (addr_lo, addr_hi, value)
    const result = new Uint8Array(2 + count * 3);

    result[0] = <u8>(sp & 0xFF);
    result[1] = <u8>((sp >> 8) & 0xFF);

    for (let i: i32 = 0; i < count; i++) {
        const addr: u16 = sp + <u16>i;
        const val = bus.read(addr);

        const off = 2 + i * 3;
        result[off]     = <u8>(addr & 0xFF);
        result[off + 1] = <u8>((addr >> 8) & 0xFF);
        result[off + 2] = val;
    }

    return result;
}


