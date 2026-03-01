// Gameboy Emulator - CPU Instructions - CB Prefixed 0x00-0x7F

// Rotations, shifts, BIT tests
//
// Register order per group of 8: B, C, D, E, H, L, [HL], A

import { CpuInstrution, InstructionActions } from "./CpuInstrution";
import { Cpu } from "./Cpu";
import { toHex } from "../lib/lib_numbers";


export function loadPrefixedInstructionActions_0x00_0x7F(instruction: CpuInstrution): InstructionActions {
    let execute: (cpu: Cpu) => void;

    switch (instruction.opcode) {

        // =====================================================================
        //  RLC r8 (0x00-0x07) - Rotate Left, old bit 7 to Carry
        // =====================================================================
        case 0x00: execute = function (cpu: Cpu): void { cpu.registers.B = rlc(cpu, cpu.registers.B); cpu.registers.PC += 1; }; break;
        case 0x01: execute = function (cpu: Cpu): void { cpu.registers.C = rlc(cpu, cpu.registers.C); cpu.registers.PC += 1; }; break;
        case 0x02: execute = function (cpu: Cpu): void { cpu.registers.D = rlc(cpu, cpu.registers.D); cpu.registers.PC += 1; }; break;
        case 0x03: execute = function (cpu: Cpu): void { cpu.registers.E = rlc(cpu, cpu.registers.E); cpu.registers.PC += 1; }; break;
        case 0x04: execute = function (cpu: Cpu): void { cpu.registers.H = rlc(cpu, cpu.registers.H); cpu.registers.PC += 1; }; break;
        case 0x05: execute = function (cpu: Cpu): void { cpu.registers.L = rlc(cpu, cpu.registers.L); cpu.registers.PC += 1; }; break;
        case 0x06: execute = function (cpu: Cpu): void { const v = rlc(cpu, cpu.readMemory8(cpu.registers.HL)); cpu.writeMemory8(cpu.registers.HL, v); cpu.registers.PC += 1; }; break;
        case 0x07: execute = function (cpu: Cpu): void { cpu.registers.A = rlc(cpu, cpu.registers.A); cpu.registers.PC += 1; }; break;

        // =====================================================================
        //  RRC r8 (0x08-0x0F) - Rotate Right, old bit 0 to Carry
        // =====================================================================
        case 0x08: execute = function (cpu: Cpu): void { cpu.registers.B = rrc(cpu, cpu.registers.B); cpu.registers.PC += 1; }; break;
        case 0x09: execute = function (cpu: Cpu): void { cpu.registers.C = rrc(cpu, cpu.registers.C); cpu.registers.PC += 1; }; break;
        case 0x0A: execute = function (cpu: Cpu): void { cpu.registers.D = rrc(cpu, cpu.registers.D); cpu.registers.PC += 1; }; break;
        case 0x0B: execute = function (cpu: Cpu): void { cpu.registers.E = rrc(cpu, cpu.registers.E); cpu.registers.PC += 1; }; break;
        case 0x0C: execute = function (cpu: Cpu): void { cpu.registers.H = rrc(cpu, cpu.registers.H); cpu.registers.PC += 1; }; break;
        case 0x0D: execute = function (cpu: Cpu): void { cpu.registers.L = rrc(cpu, cpu.registers.L); cpu.registers.PC += 1; }; break;
        case 0x0E: execute = function (cpu: Cpu): void { const v = rrc(cpu, cpu.readMemory8(cpu.registers.HL)); cpu.writeMemory8(cpu.registers.HL, v); cpu.registers.PC += 1; }; break;
        case 0x0F: execute = function (cpu: Cpu): void { cpu.registers.A = rrc(cpu, cpu.registers.A); cpu.registers.PC += 1; }; break;

        // =====================================================================
        //  RL r8 (0x10-0x17) - Rotate Left through Carry
        // =====================================================================
        case 0x10: execute = function (cpu: Cpu): void { cpu.registers.B = rl(cpu, cpu.registers.B); cpu.registers.PC += 1; }; break;
        case 0x11: execute = function (cpu: Cpu): void { cpu.registers.C = rl(cpu, cpu.registers.C); cpu.registers.PC += 1; }; break;
        case 0x12: execute = function (cpu: Cpu): void { cpu.registers.D = rl(cpu, cpu.registers.D); cpu.registers.PC += 1; }; break;
        case 0x13: execute = function (cpu: Cpu): void { cpu.registers.E = rl(cpu, cpu.registers.E); cpu.registers.PC += 1; }; break;
        case 0x14: execute = function (cpu: Cpu): void { cpu.registers.H = rl(cpu, cpu.registers.H); cpu.registers.PC += 1; }; break;
        case 0x15: execute = function (cpu: Cpu): void { cpu.registers.L = rl(cpu, cpu.registers.L); cpu.registers.PC += 1; }; break;
        case 0x16: execute = function (cpu: Cpu): void { const v = rl(cpu, cpu.readMemory8(cpu.registers.HL)); cpu.writeMemory8(cpu.registers.HL, v); cpu.registers.PC += 1; }; break;
        case 0x17: execute = function (cpu: Cpu): void { cpu.registers.A = rl(cpu, cpu.registers.A); cpu.registers.PC += 1; }; break;

        // =====================================================================
        //  RR r8 (0x18-0x1F) - Rotate Right through Carry
        // =====================================================================
        case 0x18: execute = function (cpu: Cpu): void { cpu.registers.B = rr(cpu, cpu.registers.B); cpu.registers.PC += 1; }; break;
        case 0x19: execute = function (cpu: Cpu): void { cpu.registers.C = rr(cpu, cpu.registers.C); cpu.registers.PC += 1; }; break;
        case 0x1A: execute = function (cpu: Cpu): void { cpu.registers.D = rr(cpu, cpu.registers.D); cpu.registers.PC += 1; }; break;
        case 0x1B: execute = function (cpu: Cpu): void { cpu.registers.E = rr(cpu, cpu.registers.E); cpu.registers.PC += 1; }; break;
        case 0x1C: execute = function (cpu: Cpu): void { cpu.registers.H = rr(cpu, cpu.registers.H); cpu.registers.PC += 1; }; break;
        case 0x1D: execute = function (cpu: Cpu): void { cpu.registers.L = rr(cpu, cpu.registers.L); cpu.registers.PC += 1; }; break;
        case 0x1E: execute = function (cpu: Cpu): void { const v = rr(cpu, cpu.readMemory8(cpu.registers.HL)); cpu.writeMemory8(cpu.registers.HL, v); cpu.registers.PC += 1; }; break;
        case 0x1F: execute = function (cpu: Cpu): void { cpu.registers.A = rr(cpu, cpu.registers.A); cpu.registers.PC += 1; }; break;

        // =====================================================================
        //  SLA r8 (0x20-0x27) - Shift Left Arithmetic (bit 0 = 0)
        // =====================================================================
        case 0x20: execute = function (cpu: Cpu): void { cpu.registers.B = sla(cpu, cpu.registers.B); cpu.registers.PC += 1; }; break;
        case 0x21: execute = function (cpu: Cpu): void { cpu.registers.C = sla(cpu, cpu.registers.C); cpu.registers.PC += 1; }; break;
        case 0x22: execute = function (cpu: Cpu): void { cpu.registers.D = sla(cpu, cpu.registers.D); cpu.registers.PC += 1; }; break;
        case 0x23: execute = function (cpu: Cpu): void { cpu.registers.E = sla(cpu, cpu.registers.E); cpu.registers.PC += 1; }; break;
        case 0x24: execute = function (cpu: Cpu): void { cpu.registers.H = sla(cpu, cpu.registers.H); cpu.registers.PC += 1; }; break;
        case 0x25: execute = function (cpu: Cpu): void { cpu.registers.L = sla(cpu, cpu.registers.L); cpu.registers.PC += 1; }; break;
        case 0x26: execute = function (cpu: Cpu): void { const v = sla(cpu, cpu.readMemory8(cpu.registers.HL)); cpu.writeMemory8(cpu.registers.HL, v); cpu.registers.PC += 1; }; break;
        case 0x27: execute = function (cpu: Cpu): void { cpu.registers.A = sla(cpu, cpu.registers.A); cpu.registers.PC += 1; }; break;

        // =====================================================================
        //  SRA r8 (0x28-0x2F) - Shift Right Arithmetic (bit 7 unchanged)
        // =====================================================================
        case 0x28: execute = function (cpu: Cpu): void { cpu.registers.B = sra(cpu, cpu.registers.B); cpu.registers.PC += 1; }; break;
        case 0x29: execute = function (cpu: Cpu): void { cpu.registers.C = sra(cpu, cpu.registers.C); cpu.registers.PC += 1; }; break;
        case 0x2A: execute = function (cpu: Cpu): void { cpu.registers.D = sra(cpu, cpu.registers.D); cpu.registers.PC += 1; }; break;
        case 0x2B: execute = function (cpu: Cpu): void { cpu.registers.E = sra(cpu, cpu.registers.E); cpu.registers.PC += 1; }; break;
        case 0x2C: execute = function (cpu: Cpu): void { cpu.registers.H = sra(cpu, cpu.registers.H); cpu.registers.PC += 1; }; break;
        case 0x2D: execute = function (cpu: Cpu): void { cpu.registers.L = sra(cpu, cpu.registers.L); cpu.registers.PC += 1; }; break;
        case 0x2E: execute = function (cpu: Cpu): void { const v = sra(cpu, cpu.readMemory8(cpu.registers.HL)); cpu.writeMemory8(cpu.registers.HL, v); cpu.registers.PC += 1; }; break;
        case 0x2F: execute = function (cpu: Cpu): void { cpu.registers.A = sra(cpu, cpu.registers.A); cpu.registers.PC += 1; }; break;

        // =====================================================================
        //  SWAP r8 (0x30-0x37) - Swap upper and lower nibbles
        // =====================================================================
        case 0x30: execute = function (cpu: Cpu): void { cpu.registers.B = swap(cpu, cpu.registers.B); cpu.registers.PC += 1; }; break;
        case 0x31: execute = function (cpu: Cpu): void { cpu.registers.C = swap(cpu, cpu.registers.C); cpu.registers.PC += 1; }; break;
        case 0x32: execute = function (cpu: Cpu): void { cpu.registers.D = swap(cpu, cpu.registers.D); cpu.registers.PC += 1; }; break;
        case 0x33: execute = function (cpu: Cpu): void { cpu.registers.E = swap(cpu, cpu.registers.E); cpu.registers.PC += 1; }; break;
        case 0x34: execute = function (cpu: Cpu): void { cpu.registers.H = swap(cpu, cpu.registers.H); cpu.registers.PC += 1; }; break;
        case 0x35: execute = function (cpu: Cpu): void { cpu.registers.L = swap(cpu, cpu.registers.L); cpu.registers.PC += 1; }; break;
        case 0x36: execute = function (cpu: Cpu): void { const v = swap(cpu, cpu.readMemory8(cpu.registers.HL)); cpu.writeMemory8(cpu.registers.HL, v); cpu.registers.PC += 1; }; break;
        case 0x37: execute = function (cpu: Cpu): void { cpu.registers.A = swap(cpu, cpu.registers.A); cpu.registers.PC += 1; }; break;

        // =====================================================================
        //  SRL r8 (0x38-0x3F) - Shift Right Logical (bit 7 = 0)
        // =====================================================================
        case 0x38: execute = function (cpu: Cpu): void { cpu.registers.B = srl(cpu, cpu.registers.B); cpu.registers.PC += 1; }; break;
        case 0x39: execute = function (cpu: Cpu): void { cpu.registers.C = srl(cpu, cpu.registers.C); cpu.registers.PC += 1; }; break;
        case 0x3A: execute = function (cpu: Cpu): void { cpu.registers.D = srl(cpu, cpu.registers.D); cpu.registers.PC += 1; }; break;
        case 0x3B: execute = function (cpu: Cpu): void { cpu.registers.E = srl(cpu, cpu.registers.E); cpu.registers.PC += 1; }; break;
        case 0x3C: execute = function (cpu: Cpu): void { cpu.registers.H = srl(cpu, cpu.registers.H); cpu.registers.PC += 1; }; break;
        case 0x3D: execute = function (cpu: Cpu): void { cpu.registers.L = srl(cpu, cpu.registers.L); cpu.registers.PC += 1; }; break;
        case 0x3E: execute = function (cpu: Cpu): void { const v = srl(cpu, cpu.readMemory8(cpu.registers.HL)); cpu.writeMemory8(cpu.registers.HL, v); cpu.registers.PC += 1; }; break;
        case 0x3F: execute = function (cpu: Cpu): void { cpu.registers.A = srl(cpu, cpu.registers.A); cpu.registers.PC += 1; }; break;


        // =====================================================================
        //  BIT 0, r8 (0x40-0x47)
        // =====================================================================
        case 0x40: execute = function (cpu: Cpu): void { bit(cpu, 0, cpu.registers.B); cpu.registers.PC += 1; }; break;
        case 0x41: execute = function (cpu: Cpu): void { bit(cpu, 0, cpu.registers.C); cpu.registers.PC += 1; }; break;
        case 0x42: execute = function (cpu: Cpu): void { bit(cpu, 0, cpu.registers.D); cpu.registers.PC += 1; }; break;
        case 0x43: execute = function (cpu: Cpu): void { bit(cpu, 0, cpu.registers.E); cpu.registers.PC += 1; }; break;
        case 0x44: execute = function (cpu: Cpu): void { bit(cpu, 0, cpu.registers.H); cpu.registers.PC += 1; }; break;
        case 0x45: execute = function (cpu: Cpu): void { bit(cpu, 0, cpu.registers.L); cpu.registers.PC += 1; }; break;
        case 0x46: execute = function (cpu: Cpu): void { bit(cpu, 0, cpu.readMemory8(cpu.registers.HL)); cpu.registers.PC += 1; }; break;
        case 0x47: execute = function (cpu: Cpu): void { bit(cpu, 0, cpu.registers.A); cpu.registers.PC += 1; }; break;

        // =====================================================================
        //  BIT 1, r8 (0x48-0x4F)
        // =====================================================================
        case 0x48: execute = function (cpu: Cpu): void { bit(cpu, 1, cpu.registers.B); cpu.registers.PC += 1; }; break;
        case 0x49: execute = function (cpu: Cpu): void { bit(cpu, 1, cpu.registers.C); cpu.registers.PC += 1; }; break;
        case 0x4A: execute = function (cpu: Cpu): void { bit(cpu, 1, cpu.registers.D); cpu.registers.PC += 1; }; break;
        case 0x4B: execute = function (cpu: Cpu): void { bit(cpu, 1, cpu.registers.E); cpu.registers.PC += 1; }; break;
        case 0x4C: execute = function (cpu: Cpu): void { bit(cpu, 1, cpu.registers.H); cpu.registers.PC += 1; }; break;
        case 0x4D: execute = function (cpu: Cpu): void { bit(cpu, 1, cpu.registers.L); cpu.registers.PC += 1; }; break;
        case 0x4E: execute = function (cpu: Cpu): void { bit(cpu, 1, cpu.readMemory8(cpu.registers.HL)); cpu.registers.PC += 1; }; break;
        case 0x4F: execute = function (cpu: Cpu): void { bit(cpu, 1, cpu.registers.A); cpu.registers.PC += 1; }; break;

        // =====================================================================
        //  BIT 2, r8 (0x50-0x57)
        // =====================================================================
        case 0x50: execute = function (cpu: Cpu): void { bit(cpu, 2, cpu.registers.B); cpu.registers.PC += 1; }; break;
        case 0x51: execute = function (cpu: Cpu): void { bit(cpu, 2, cpu.registers.C); cpu.registers.PC += 1; }; break;
        case 0x52: execute = function (cpu: Cpu): void { bit(cpu, 2, cpu.registers.D); cpu.registers.PC += 1; }; break;
        case 0x53: execute = function (cpu: Cpu): void { bit(cpu, 2, cpu.registers.E); cpu.registers.PC += 1; }; break;
        case 0x54: execute = function (cpu: Cpu): void { bit(cpu, 2, cpu.registers.H); cpu.registers.PC += 1; }; break;
        case 0x55: execute = function (cpu: Cpu): void { bit(cpu, 2, cpu.registers.L); cpu.registers.PC += 1; }; break;
        case 0x56: execute = function (cpu: Cpu): void { bit(cpu, 2, cpu.readMemory8(cpu.registers.HL)); cpu.registers.PC += 1; }; break;
        case 0x57: execute = function (cpu: Cpu): void { bit(cpu, 2, cpu.registers.A); cpu.registers.PC += 1; }; break;

        // =====================================================================
        //  BIT 3, r8 (0x58-0x5F)
        // =====================================================================
        case 0x58: execute = function (cpu: Cpu): void { bit(cpu, 3, cpu.registers.B); cpu.registers.PC += 1; }; break;
        case 0x59: execute = function (cpu: Cpu): void { bit(cpu, 3, cpu.registers.C); cpu.registers.PC += 1; }; break;
        case 0x5A: execute = function (cpu: Cpu): void { bit(cpu, 3, cpu.registers.D); cpu.registers.PC += 1; }; break;
        case 0x5B: execute = function (cpu: Cpu): void { bit(cpu, 3, cpu.registers.E); cpu.registers.PC += 1; }; break;
        case 0x5C: execute = function (cpu: Cpu): void { bit(cpu, 3, cpu.registers.H); cpu.registers.PC += 1; }; break;
        case 0x5D: execute = function (cpu: Cpu): void { bit(cpu, 3, cpu.registers.L); cpu.registers.PC += 1; }; break;
        case 0x5E: execute = function (cpu: Cpu): void { bit(cpu, 3, cpu.readMemory8(cpu.registers.HL)); cpu.registers.PC += 1; }; break;
        case 0x5F: execute = function (cpu: Cpu): void { bit(cpu, 3, cpu.registers.A); cpu.registers.PC += 1; }; break;

        // =====================================================================
        //  BIT 4, r8 (0x60-0x67)
        // =====================================================================
        case 0x60: execute = function (cpu: Cpu): void { bit(cpu, 4, cpu.registers.B); cpu.registers.PC += 1; }; break;
        case 0x61: execute = function (cpu: Cpu): void { bit(cpu, 4, cpu.registers.C); cpu.registers.PC += 1; }; break;
        case 0x62: execute = function (cpu: Cpu): void { bit(cpu, 4, cpu.registers.D); cpu.registers.PC += 1; }; break;
        case 0x63: execute = function (cpu: Cpu): void { bit(cpu, 4, cpu.registers.E); cpu.registers.PC += 1; }; break;
        case 0x64: execute = function (cpu: Cpu): void { bit(cpu, 4, cpu.registers.H); cpu.registers.PC += 1; }; break;
        case 0x65: execute = function (cpu: Cpu): void { bit(cpu, 4, cpu.registers.L); cpu.registers.PC += 1; }; break;
        case 0x66: execute = function (cpu: Cpu): void { bit(cpu, 4, cpu.readMemory8(cpu.registers.HL)); cpu.registers.PC += 1; }; break;
        case 0x67: execute = function (cpu: Cpu): void { bit(cpu, 4, cpu.registers.A); cpu.registers.PC += 1; }; break;

        // =====================================================================
        //  BIT 5, r8 (0x68-0x6F)
        // =====================================================================
        case 0x68: execute = function (cpu: Cpu): void { bit(cpu, 5, cpu.registers.B); cpu.registers.PC += 1; }; break;
        case 0x69: execute = function (cpu: Cpu): void { bit(cpu, 5, cpu.registers.C); cpu.registers.PC += 1; }; break;
        case 0x6A: execute = function (cpu: Cpu): void { bit(cpu, 5, cpu.registers.D); cpu.registers.PC += 1; }; break;
        case 0x6B: execute = function (cpu: Cpu): void { bit(cpu, 5, cpu.registers.E); cpu.registers.PC += 1; }; break;
        case 0x6C: execute = function (cpu: Cpu): void { bit(cpu, 5, cpu.registers.H); cpu.registers.PC += 1; }; break;
        case 0x6D: execute = function (cpu: Cpu): void { bit(cpu, 5, cpu.registers.L); cpu.registers.PC += 1; }; break;
        case 0x6E: execute = function (cpu: Cpu): void { bit(cpu, 5, cpu.readMemory8(cpu.registers.HL)); cpu.registers.PC += 1; }; break;
        case 0x6F: execute = function (cpu: Cpu): void { bit(cpu, 5, cpu.registers.A); cpu.registers.PC += 1; }; break;

        // =====================================================================
        //  BIT 6, r8 (0x70-0x77)
        // =====================================================================
        case 0x70: execute = function (cpu: Cpu): void { bit(cpu, 6, cpu.registers.B); cpu.registers.PC += 1; }; break;
        case 0x71: execute = function (cpu: Cpu): void { bit(cpu, 6, cpu.registers.C); cpu.registers.PC += 1; }; break;
        case 0x72: execute = function (cpu: Cpu): void { bit(cpu, 6, cpu.registers.D); cpu.registers.PC += 1; }; break;
        case 0x73: execute = function (cpu: Cpu): void { bit(cpu, 6, cpu.registers.E); cpu.registers.PC += 1; }; break;
        case 0x74: execute = function (cpu: Cpu): void { bit(cpu, 6, cpu.registers.H); cpu.registers.PC += 1; }; break;
        case 0x75: execute = function (cpu: Cpu): void { bit(cpu, 6, cpu.registers.L); cpu.registers.PC += 1; }; break;
        case 0x76: execute = function (cpu: Cpu): void { bit(cpu, 6, cpu.readMemory8(cpu.registers.HL)); cpu.registers.PC += 1; }; break;
        case 0x77: execute = function (cpu: Cpu): void { bit(cpu, 6, cpu.registers.A); cpu.registers.PC += 1; }; break;

        // =====================================================================
        //  BIT 7, r8 (0x78-0x7F)
        // =====================================================================
        case 0x78: execute = function (cpu: Cpu): void { bit(cpu, 7, cpu.registers.B); cpu.registers.PC += 1; }; break;
        case 0x79: execute = function (cpu: Cpu): void { bit(cpu, 7, cpu.registers.C); cpu.registers.PC += 1; }; break;
        case 0x7A: execute = function (cpu: Cpu): void { bit(cpu, 7, cpu.registers.D); cpu.registers.PC += 1; }; break;
        case 0x7B: execute = function (cpu: Cpu): void { bit(cpu, 7, cpu.registers.E); cpu.registers.PC += 1; }; break;
        case 0x7C: execute = function (cpu: Cpu): void { bit(cpu, 7, cpu.registers.H); cpu.registers.PC += 1; }; break;
        case 0x7D: execute = function (cpu: Cpu): void { bit(cpu, 7, cpu.registers.L); cpu.registers.PC += 1; }; break;
        case 0x7E: execute = function (cpu: Cpu): void { bit(cpu, 7, cpu.readMemory8(cpu.registers.HL)); cpu.registers.PC += 1; }; break;
        case 0x7F: execute = function (cpu: Cpu): void { bit(cpu, 7, cpu.registers.A); cpu.registers.PC += 1; }; break;


        default:
            throw new Error(`Unknown CB-prefixed opcode: ${toHex(instruction.opcode)}`);
    }

    return new InstructionActions(execute);
}


// =============================================================================
//  Rotation / Shift / BIT helper functions
// =============================================================================

function rlc(cpu: Cpu, val: u8): u8 {
    const bit7 = (val >> 7) & 1;
    const result: u8 = (val << 1) | bit7;
    cpu.registers.setFlags(result == 0, false, false, bit7 == 1);
    return result;
}

function rrc(cpu: Cpu, val: u8): u8 {
    const bit0 = val & 1;
    const result: u8 = (val >> 1) | (bit0 << 7);
    cpu.registers.setFlags(result == 0, false, false, bit0 == 1);
    return result;
}

function rl(cpu: Cpu, val: u8): u8 {
    const oldCarry: u8 = cpu.registers.flagC ? 1 : 0;
    const bit7 = (val >> 7) & 1;
    const result: u8 = (val << 1) | oldCarry;
    cpu.registers.setFlags(result == 0, false, false, bit7 == 1);
    return result;
}

function rr(cpu: Cpu, val: u8): u8 {
    const oldCarry: u8 = cpu.registers.flagC ? 1 : 0;
    const bit0 = val & 1;
    const result: u8 = (val >> 1) | (oldCarry << 7);
    cpu.registers.setFlags(result == 0, false, false, bit0 == 1);
    return result;
}

function sla(cpu: Cpu, val: u8): u8 {
    const bit7 = (val >> 7) & 1;
    const result: u8 = val << 1;
    cpu.registers.setFlags(result == 0, false, false, bit7 == 1);
    return result;
}

function sra(cpu: Cpu, val: u8): u8 {
    const bit0 = val & 1;
    const bit7 = val & 0x80; // preserve sign bit
    const result: u8 = (val >> 1) | bit7;
    cpu.registers.setFlags(result == 0, false, false, bit0 == 1);
    return result;
}

function swap(cpu: Cpu, val: u8): u8 {
    const result: u8 = ((val & 0x0F) << 4) | ((val & 0xF0) >> 4);
    cpu.registers.setFlags(result == 0, false, false, false);
    return result;
}

function srl(cpu: Cpu, val: u8): u8 {
    const bit0 = val & 1;
    const result: u8 = val >> 1;
    cpu.registers.setFlags(result == 0, false, false, bit0 == 1);
    return result;
}

function bit(cpu: Cpu, b: u8, val: u8): void {
    const result = val & (1 << b);
    cpu.registers.flagZ = result == 0;
    cpu.registers.flagN = false;
    cpu.registers.flagH = true;
    // flagC unchanged
}
