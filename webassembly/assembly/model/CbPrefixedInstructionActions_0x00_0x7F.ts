// Gameboy Emulator - CB Prefixed 0x00-0x7F

import { Cpu } from "./Cpu";


export function executeCbPrefixed_0x00_0x7F(cpu: Cpu, opcode: u8): void {
    const r = cpu.registers;

    switch (opcode) {

        // RLC (0x00-0x07)
        case 0x00: r.B = rlc(cpu, r.B); r.PC += 1; break;
        case 0x01: r.C = rlc(cpu, r.C); r.PC += 1; break;
        case 0x02: r.D = rlc(cpu, r.D); r.PC += 1; break;
        case 0x03: r.E = rlc(cpu, r.E); r.PC += 1; break;
        case 0x04: r.H = rlc(cpu, r.H); r.PC += 1; break;
        case 0x05: r.L = rlc(cpu, r.L); r.PC += 1; break;
        case 0x06: { const v = rlc(cpu, cpu.readMemory8(r.HL)); cpu.writeMemory8(r.HL, v); r.PC += 1; break; }
        case 0x07: r.A = rlc(cpu, r.A); r.PC += 1; break;

        // RRC (0x08-0x0F)
        case 0x08: r.B = rrc(cpu, r.B); r.PC += 1; break;
        case 0x09: r.C = rrc(cpu, r.C); r.PC += 1; break;
        case 0x0A: r.D = rrc(cpu, r.D); r.PC += 1; break;
        case 0x0B: r.E = rrc(cpu, r.E); r.PC += 1; break;
        case 0x0C: r.H = rrc(cpu, r.H); r.PC += 1; break;
        case 0x0D: r.L = rrc(cpu, r.L); r.PC += 1; break;
        case 0x0E: { const v = rrc(cpu, cpu.readMemory8(r.HL)); cpu.writeMemory8(r.HL, v); r.PC += 1; break; }
        case 0x0F: r.A = rrc(cpu, r.A); r.PC += 1; break;

        // RL (0x10-0x17)
        case 0x10: r.B = rl(cpu, r.B); r.PC += 1; break;
        case 0x11: r.C = rl(cpu, r.C); r.PC += 1; break;
        case 0x12: r.D = rl(cpu, r.D); r.PC += 1; break;
        case 0x13: r.E = rl(cpu, r.E); r.PC += 1; break;
        case 0x14: r.H = rl(cpu, r.H); r.PC += 1; break;
        case 0x15: r.L = rl(cpu, r.L); r.PC += 1; break;
        case 0x16: { const v = rl(cpu, cpu.readMemory8(r.HL)); cpu.writeMemory8(r.HL, v); r.PC += 1; break; }
        case 0x17: r.A = rl(cpu, r.A); r.PC += 1; break;

        // RR (0x18-0x1F)
        case 0x18: r.B = rr(cpu, r.B); r.PC += 1; break;
        case 0x19: r.C = rr(cpu, r.C); r.PC += 1; break;
        case 0x1A: r.D = rr(cpu, r.D); r.PC += 1; break;
        case 0x1B: r.E = rr(cpu, r.E); r.PC += 1; break;
        case 0x1C: r.H = rr(cpu, r.H); r.PC += 1; break;
        case 0x1D: r.L = rr(cpu, r.L); r.PC += 1; break;
        case 0x1E: { const v = rr(cpu, cpu.readMemory8(r.HL)); cpu.writeMemory8(r.HL, v); r.PC += 1; break; }
        case 0x1F: r.A = rr(cpu, r.A); r.PC += 1; break;

        // SLA (0x20-0x27)
        case 0x20: r.B = sla(cpu, r.B); r.PC += 1; break;
        case 0x21: r.C = sla(cpu, r.C); r.PC += 1; break;
        case 0x22: r.D = sla(cpu, r.D); r.PC += 1; break;
        case 0x23: r.E = sla(cpu, r.E); r.PC += 1; break;
        case 0x24: r.H = sla(cpu, r.H); r.PC += 1; break;
        case 0x25: r.L = sla(cpu, r.L); r.PC += 1; break;
        case 0x26: { const v = sla(cpu, cpu.readMemory8(r.HL)); cpu.writeMemory8(r.HL, v); r.PC += 1; break; }
        case 0x27: r.A = sla(cpu, r.A); r.PC += 1; break;

        // SRA (0x28-0x2F)
        case 0x28: r.B = sra(cpu, r.B); r.PC += 1; break;
        case 0x29: r.C = sra(cpu, r.C); r.PC += 1; break;
        case 0x2A: r.D = sra(cpu, r.D); r.PC += 1; break;
        case 0x2B: r.E = sra(cpu, r.E); r.PC += 1; break;
        case 0x2C: r.H = sra(cpu, r.H); r.PC += 1; break;
        case 0x2D: r.L = sra(cpu, r.L); r.PC += 1; break;
        case 0x2E: { const v = sra(cpu, cpu.readMemory8(r.HL)); cpu.writeMemory8(r.HL, v); r.PC += 1; break; }
        case 0x2F: r.A = sra(cpu, r.A); r.PC += 1; break;

        // SWAP (0x30-0x37)
        case 0x30: r.B = swap(cpu, r.B); r.PC += 1; break;
        case 0x31: r.C = swap(cpu, r.C); r.PC += 1; break;
        case 0x32: r.D = swap(cpu, r.D); r.PC += 1; break;
        case 0x33: r.E = swap(cpu, r.E); r.PC += 1; break;
        case 0x34: r.H = swap(cpu, r.H); r.PC += 1; break;
        case 0x35: r.L = swap(cpu, r.L); r.PC += 1; break;
        case 0x36: { const v = swap(cpu, cpu.readMemory8(r.HL)); cpu.writeMemory8(r.HL, v); r.PC += 1; break; }
        case 0x37: r.A = swap(cpu, r.A); r.PC += 1; break;

        // SRL (0x38-0x3F)
        case 0x38: r.B = srl(cpu, r.B); r.PC += 1; break;
        case 0x39: r.C = srl(cpu, r.C); r.PC += 1; break;
        case 0x3A: r.D = srl(cpu, r.D); r.PC += 1; break;
        case 0x3B: r.E = srl(cpu, r.E); r.PC += 1; break;
        case 0x3C: r.H = srl(cpu, r.H); r.PC += 1; break;
        case 0x3D: r.L = srl(cpu, r.L); r.PC += 1; break;
        case 0x3E: { const v = srl(cpu, cpu.readMemory8(r.HL)); cpu.writeMemory8(r.HL, v); r.PC += 1; break; }
        case 0x3F: r.A = srl(cpu, r.A); r.PC += 1; break;

        // BIT 0 (0x40-0x47)
        case 0x40: bit(cpu, 0, r.B); r.PC += 1; break;
        case 0x41: bit(cpu, 0, r.C); r.PC += 1; break;
        case 0x42: bit(cpu, 0, r.D); r.PC += 1; break;
        case 0x43: bit(cpu, 0, r.E); r.PC += 1; break;
        case 0x44: bit(cpu, 0, r.H); r.PC += 1; break;
        case 0x45: bit(cpu, 0, r.L); r.PC += 1; break;
        case 0x46: bit(cpu, 0, cpu.readMemory8(r.HL)); r.PC += 1; break;
        case 0x47: bit(cpu, 0, r.A); r.PC += 1; break;

        // BIT 1 (0x48-0x4F)
        case 0x48: bit(cpu, 1, r.B); r.PC += 1; break;
        case 0x49: bit(cpu, 1, r.C); r.PC += 1; break;
        case 0x4A: bit(cpu, 1, r.D); r.PC += 1; break;
        case 0x4B: bit(cpu, 1, r.E); r.PC += 1; break;
        case 0x4C: bit(cpu, 1, r.H); r.PC += 1; break;
        case 0x4D: bit(cpu, 1, r.L); r.PC += 1; break;
        case 0x4E: bit(cpu, 1, cpu.readMemory8(r.HL)); r.PC += 1; break;
        case 0x4F: bit(cpu, 1, r.A); r.PC += 1; break;

        // BIT 2-7 (0x50-0x7F)
        case 0x50: bit(cpu, 2, r.B); r.PC += 1; break;
        case 0x51: bit(cpu, 2, r.C); r.PC += 1; break;
        case 0x52: bit(cpu, 2, r.D); r.PC += 1; break;
        case 0x53: bit(cpu, 2, r.E); r.PC += 1; break;
        case 0x54: bit(cpu, 2, r.H); r.PC += 1; break;
        case 0x55: bit(cpu, 2, r.L); r.PC += 1; break;
        case 0x56: bit(cpu, 2, cpu.readMemory8(r.HL)); r.PC += 1; break;
        case 0x57: bit(cpu, 2, r.A); r.PC += 1; break;
        case 0x58: bit(cpu, 3, r.B); r.PC += 1; break;
        case 0x59: bit(cpu, 3, r.C); r.PC += 1; break;
        case 0x5A: bit(cpu, 3, r.D); r.PC += 1; break;
        case 0x5B: bit(cpu, 3, r.E); r.PC += 1; break;
        case 0x5C: bit(cpu, 3, r.H); r.PC += 1; break;
        case 0x5D: bit(cpu, 3, r.L); r.PC += 1; break;
        case 0x5E: bit(cpu, 3, cpu.readMemory8(r.HL)); r.PC += 1; break;
        case 0x5F: bit(cpu, 3, r.A); r.PC += 1; break;
        case 0x60: bit(cpu, 4, r.B); r.PC += 1; break;
        case 0x61: bit(cpu, 4, r.C); r.PC += 1; break;
        case 0x62: bit(cpu, 4, r.D); r.PC += 1; break;
        case 0x63: bit(cpu, 4, r.E); r.PC += 1; break;
        case 0x64: bit(cpu, 4, r.H); r.PC += 1; break;
        case 0x65: bit(cpu, 4, r.L); r.PC += 1; break;
        case 0x66: bit(cpu, 4, cpu.readMemory8(r.HL)); r.PC += 1; break;
        case 0x67: bit(cpu, 4, r.A); r.PC += 1; break;
        case 0x68: bit(cpu, 5, r.B); r.PC += 1; break;
        case 0x69: bit(cpu, 5, r.C); r.PC += 1; break;
        case 0x6A: bit(cpu, 5, r.D); r.PC += 1; break;
        case 0x6B: bit(cpu, 5, r.E); r.PC += 1; break;
        case 0x6C: bit(cpu, 5, r.H); r.PC += 1; break;
        case 0x6D: bit(cpu, 5, r.L); r.PC += 1; break;
        case 0x6E: bit(cpu, 5, cpu.readMemory8(r.HL)); r.PC += 1; break;
        case 0x6F: bit(cpu, 5, r.A); r.PC += 1; break;
        case 0x70: bit(cpu, 6, r.B); r.PC += 1; break;
        case 0x71: bit(cpu, 6, r.C); r.PC += 1; break;
        case 0x72: bit(cpu, 6, r.D); r.PC += 1; break;
        case 0x73: bit(cpu, 6, r.E); r.PC += 1; break;
        case 0x74: bit(cpu, 6, r.H); r.PC += 1; break;
        case 0x75: bit(cpu, 6, r.L); r.PC += 1; break;
        case 0x76: bit(cpu, 6, cpu.readMemory8(r.HL)); r.PC += 1; break;
        case 0x77: bit(cpu, 6, r.A); r.PC += 1; break;
        case 0x78: bit(cpu, 7, r.B); r.PC += 1; break;
        case 0x79: bit(cpu, 7, r.C); r.PC += 1; break;
        case 0x7A: bit(cpu, 7, r.D); r.PC += 1; break;
        case 0x7B: bit(cpu, 7, r.E); r.PC += 1; break;
        case 0x7C: bit(cpu, 7, r.H); r.PC += 1; break;
        case 0x7D: bit(cpu, 7, r.L); r.PC += 1; break;
        case 0x7E: bit(cpu, 7, cpu.readMemory8(r.HL)); r.PC += 1; break;
        case 0x7F: bit(cpu, 7, r.A); r.PC += 1; break;

        default: break;
    }
}


// Helpers

function rlc(cpu: Cpu, val: u8): u8 {
    const b7 = (val >> 7) & 1; const res: u8 = (val << 1) | b7;
    cpu.registers.setFlags(res == 0, false, false, b7 == 1); return res;
}

function rrc(cpu: Cpu, val: u8): u8 {
    const b0 = val & 1; const res: u8 = (val >> 1) | (b0 << 7);
    cpu.registers.setFlags(res == 0, false, false, b0 == 1); return res;
}

function rl(cpu: Cpu, val: u8): u8 {
    const oc: u8 = cpu.registers.flagC ? 1 : 0; const b7 = (val >> 7) & 1;
    const res: u8 = (val << 1) | oc;
    cpu.registers.setFlags(res == 0, false, false, b7 == 1); return res;
}

function rr(cpu: Cpu, val: u8): u8 {
    const oc: u8 = cpu.registers.flagC ? 1 : 0; const b0 = val & 1;
    const res: u8 = (val >> 1) | (oc << 7);
    cpu.registers.setFlags(res == 0, false, false, b0 == 1); return res;
}

function sla(cpu: Cpu, val: u8): u8 {
    const b7 = (val >> 7) & 1; const res: u8 = val << 1;
    cpu.registers.setFlags(res == 0, false, false, b7 == 1); return res;
}

function sra(cpu: Cpu, val: u8): u8 {
    const b0 = val & 1; const res: u8 = (val >> 1) | (val & 0x80);
    cpu.registers.setFlags(res == 0, false, false, b0 == 1); return res;
}

function swap(cpu: Cpu, val: u8): u8 {
    const res: u8 = ((val & 0x0F) << 4) | ((val & 0xF0) >> 4);
    cpu.registers.setFlags(res == 0, false, false, false); return res;
}

function srl(cpu: Cpu, val: u8): u8 {
    const b0 = val & 1; const res: u8 = val >> 1;
    cpu.registers.setFlags(res == 0, false, false, b0 == 1); return res;
}

function bit(cpu: Cpu, b: u8, val: u8): void {
    cpu.registers.flagZ = (val & (1 << b)) == 0;
    cpu.registers.flagN = false;
    cpu.registers.flagH = true;
}
