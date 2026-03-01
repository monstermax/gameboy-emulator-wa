// Gameboy Emulator - Unprefixed 0x00-0x7F

import { Cpu } from "./Cpu";


export function executeUnprefixed_0x00_0x7F(cpu: Cpu, opcode: u8): void {
    const r = cpu.registers;

    switch (opcode) {

        // 0x0X
        case 0x00: r.PC += 1; break; // NOP
        case 0x01: r.BC = cpu.readMemory16(r.PC + 1); r.PC += 3; break;
        case 0x02: cpu.writeMemory8(r.BC, r.A); r.PC += 1; break;
        case 0x03: r.BC = r.BC + 1; r.PC += 1; break;
        case 0x04: { const v = r.B; const res: u8 = v + 1; r.B = res; r.flagZ = res == 0; r.flagN = false; r.flagH = (v & 0x0F) == 0x0F; r.PC += 1; break; }
        case 0x05: { const v = r.B; const res: u8 = v - 1; r.B = res; r.flagZ = res == 0; r.flagN = true; r.flagH = (v & 0x0F) == 0x00; r.PC += 1; break; }
        case 0x06: r.B = cpu.readMemory8(r.PC + 1); r.PC += 2; break;
        case 0x07: { const a = r.A; const b7 = (a >> 7) & 1; r.A = (a << 1) | b7; r.setFlags(false, false, false, b7 == 1); r.PC += 1; break; }
        case 0x08: cpu.writeMemory16(cpu.readMemory16(r.PC + 1), r.SP); r.PC += 3; break;
        case 0x09: { const hl: u32 = <u32>r.HL; const v: u32 = <u32>r.BC; const res: u32 = hl + v; r.flagN = false; r.flagH = ((hl & 0x0FFF) + (v & 0x0FFF)) > 0x0FFF; r.flagC = res > 0xFFFF; r.HL = <u16>(res & 0xFFFF); r.PC += 1; break; }
        case 0x0A: r.A = cpu.readMemory8(r.BC); r.PC += 1; break;
        case 0x0B: r.BC = r.BC - 1; r.PC += 1; break;
        case 0x0C: { const v = r.C; const res: u8 = v + 1; r.C = res; r.flagZ = res == 0; r.flagN = false; r.flagH = (v & 0x0F) == 0x0F; r.PC += 1; break; }
        case 0x0D: { const v = r.C; const res: u8 = v - 1; r.C = res; r.flagZ = res == 0; r.flagN = true; r.flagH = (v & 0x0F) == 0x00; r.PC += 1; break; }
        case 0x0E: r.C = cpu.readMemory8(r.PC + 1); r.PC += 2; break;
        case 0x0F: { const a = r.A; const b0 = a & 1; r.A = (a >> 1) | (b0 << 7); r.setFlags(false, false, false, b0 == 1); r.PC += 1; break; }

        // 0x1X
        case 0x10: r.PC += 2; break; // STOP
        case 0x11: r.DE = cpu.readMemory16(r.PC + 1); r.PC += 3; break;
        case 0x12: cpu.writeMemory8(r.DE, r.A); r.PC += 1; break;
        case 0x13: r.DE = r.DE + 1; r.PC += 1; break;
        case 0x14: { const v = r.D; const res: u8 = v + 1; r.D = res; r.flagZ = res == 0; r.flagN = false; r.flagH = (v & 0x0F) == 0x0F; r.PC += 1; break; }
        case 0x15: { const v = r.D; const res: u8 = v - 1; r.D = res; r.flagZ = res == 0; r.flagN = true; r.flagH = (v & 0x0F) == 0x00; r.PC += 1; break; }
        case 0x16: r.D = cpu.readMemory8(r.PC + 1); r.PC += 2; break;
        case 0x17: { const a = r.A; const oc: u8 = r.flagC ? 1 : 0; const b7 = (a >> 7) & 1; r.A = (a << 1) | oc; r.setFlags(false, false, false, b7 == 1); r.PC += 1; break; }
        case 0x18: { const off = <i8>cpu.readMemory8(r.PC + 1); r.PC = <u16>(<i32>r.PC + 2 + <i32>off); break; }
        case 0x19: { const hl: u32 = <u32>r.HL; const v: u32 = <u32>r.DE; const res: u32 = hl + v; r.flagN = false; r.flagH = ((hl & 0x0FFF) + (v & 0x0FFF)) > 0x0FFF; r.flagC = res > 0xFFFF; r.HL = <u16>(res & 0xFFFF); r.PC += 1; break; }
        case 0x1A: r.A = cpu.readMemory8(r.DE); r.PC += 1; break;
        case 0x1B: r.DE = r.DE - 1; r.PC += 1; break;
        case 0x1C: { const v = r.E; const res: u8 = v + 1; r.E = res; r.flagZ = res == 0; r.flagN = false; r.flagH = (v & 0x0F) == 0x0F; r.PC += 1; break; }
        case 0x1D: { const v = r.E; const res: u8 = v - 1; r.E = res; r.flagZ = res == 0; r.flagN = true; r.flagH = (v & 0x0F) == 0x00; r.PC += 1; break; }
        case 0x1E: r.E = cpu.readMemory8(r.PC + 1); r.PC += 2; break;
        case 0x1F: { const a = r.A; const oc: u8 = r.flagC ? 1 : 0; const b0 = a & 1; r.A = (a >> 1) | (oc << 7); r.setFlags(false, false, false, b0 == 1); r.PC += 1; break; }

        // 0x2X
        case 0x20: { const off = <i8>cpu.readMemory8(r.PC + 1); r.PC += 2; if (!r.flagZ) r.PC = <u16>(<i32>r.PC + <i32>off); break; }
        case 0x21: r.HL = cpu.readMemory16(r.PC + 1); r.PC += 3; break;
        case 0x22: cpu.writeMemory8(r.HL, r.A); r.HL = r.HL + 1; r.PC += 1; break;
        case 0x23: r.HL = r.HL + 1; r.PC += 1; break;
        case 0x24: { const v = r.H; const res: u8 = v + 1; r.H = res; r.flagZ = res == 0; r.flagN = false; r.flagH = (v & 0x0F) == 0x0F; r.PC += 1; break; }
        case 0x25: { const v = r.H; const res: u8 = v - 1; r.H = res; r.flagZ = res == 0; r.flagN = true; r.flagH = (v & 0x0F) == 0x00; r.PC += 1; break; }
        case 0x26: r.H = cpu.readMemory8(r.PC + 1); r.PC += 2; break;
        case 0x27: { // DAA
            let a: i32 = <i32>r.A;
            if (!r.flagN) {
                if (r.flagH || (a & 0x0F) > 9) a += 0x06;
                if (r.flagC || a > 0x9F) { a += 0x60; r.flagC = true; }
            } else {
                if (r.flagH) { a -= 0x06; a &= 0xFF; }
                if (r.flagC) a -= 0x60;
            }
            r.A = <u8>(a & 0xFF); r.flagZ = r.A == 0; r.flagH = false; r.PC += 1; break;
        }
        case 0x28: { const off = <i8>cpu.readMemory8(r.PC + 1); r.PC += 2; if (r.flagZ) r.PC = <u16>(<i32>r.PC + <i32>off); break; }
        case 0x29: { const hl: u32 = <u32>r.HL; const res: u32 = hl + hl; r.flagN = false; r.flagH = ((hl & 0x0FFF) * 2) > 0x0FFF; r.flagC = res > 0xFFFF; r.HL = <u16>(res & 0xFFFF); r.PC += 1; break; }
        case 0x2A: r.A = cpu.readMemory8(r.HL); r.HL = r.HL + 1; r.PC += 1; break;
        case 0x2B: r.HL = r.HL - 1; r.PC += 1; break;
        case 0x2C: { const v = r.L; const res: u8 = v + 1; r.L = res; r.flagZ = res == 0; r.flagN = false; r.flagH = (v & 0x0F) == 0x0F; r.PC += 1; break; }
        case 0x2D: { const v = r.L; const res: u8 = v - 1; r.L = res; r.flagZ = res == 0; r.flagN = true; r.flagH = (v & 0x0F) == 0x00; r.PC += 1; break; }
        case 0x2E: r.L = cpu.readMemory8(r.PC + 1); r.PC += 2; break;
        case 0x2F: r.A = ~r.A; r.flagN = true; r.flagH = true; r.PC += 1; break;

        // 0x3X
        case 0x30: { const off = <i8>cpu.readMemory8(r.PC + 1); r.PC += 2; if (!r.flagC) r.PC = <u16>(<i32>r.PC + <i32>off); break; }
        case 0x31: r.SP = cpu.readMemory16(r.PC + 1); r.PC += 3; break;
        case 0x32: cpu.writeMemory8(r.HL, r.A); r.HL = r.HL - 1; r.PC += 1; break;
        case 0x33: r.SP = r.SP + 1; r.PC += 1; break;
        case 0x34: { const v = cpu.readMemory8(r.HL); const res: u8 = v + 1; cpu.writeMemory8(r.HL, res); r.flagZ = res == 0; r.flagN = false; r.flagH = (v & 0x0F) == 0x0F; r.PC += 1; break; }
        case 0x35: { const v = cpu.readMemory8(r.HL); const res: u8 = v - 1; cpu.writeMemory8(r.HL, res); r.flagZ = res == 0; r.flagN = true; r.flagH = (v & 0x0F) == 0x00; r.PC += 1; break; }
        case 0x36: cpu.writeMemory8(r.HL, cpu.readMemory8(r.PC + 1)); r.PC += 2; break;
        case 0x37: r.flagN = false; r.flagH = false; r.flagC = true; r.PC += 1; break;
        case 0x38: { const off = <i8>cpu.readMemory8(r.PC + 1); r.PC += 2; if (r.flagC) r.PC = <u16>(<i32>r.PC + <i32>off); break; }
        case 0x39: { const hl: u32 = <u32>r.HL; const v: u32 = <u32>r.SP; const res: u32 = hl + v; r.flagN = false; r.flagH = ((hl & 0x0FFF) + (v & 0x0FFF)) > 0x0FFF; r.flagC = res > 0xFFFF; r.HL = <u16>(res & 0xFFFF); r.PC += 1; break; }
        case 0x3A: r.A = cpu.readMemory8(r.HL); r.HL = r.HL - 1; r.PC += 1; break;
        case 0x3B: r.SP = r.SP - 1; r.PC += 1; break;
        case 0x3C: { const v = r.A; const res: u8 = v + 1; r.A = res; r.flagZ = res == 0; r.flagN = false; r.flagH = (v & 0x0F) == 0x0F; r.PC += 1; break; }
        case 0x3D: { const v = r.A; const res: u8 = v - 1; r.A = res; r.flagZ = res == 0; r.flagN = true; r.flagH = (v & 0x0F) == 0x00; r.PC += 1; break; }
        case 0x3E: r.A = cpu.readMemory8(r.PC + 1); r.PC += 2; break;
        case 0x3F: r.flagN = false; r.flagH = false; r.flagC = !r.flagC; r.PC += 1; break;

        // 0x4X - LD B/C, x
        case 0x40: r.PC += 1; break;
        case 0x41: r.B = r.C; r.PC += 1; break;
        case 0x42: r.B = r.D; r.PC += 1; break;
        case 0x43: r.B = r.E; r.PC += 1; break;
        case 0x44: r.B = r.H; r.PC += 1; break;
        case 0x45: r.B = r.L; r.PC += 1; break;
        case 0x46: r.B = cpu.readMemory8(r.HL); r.PC += 1; break;
        case 0x47: r.B = r.A; r.PC += 1; break;
        case 0x48: r.C = r.B; r.PC += 1; break;
        case 0x49: r.PC += 1; break;
        case 0x4A: r.C = r.D; r.PC += 1; break;
        case 0x4B: r.C = r.E; r.PC += 1; break;
        case 0x4C: r.C = r.H; r.PC += 1; break;
        case 0x4D: r.C = r.L; r.PC += 1; break;
        case 0x4E: r.C = cpu.readMemory8(r.HL); r.PC += 1; break;
        case 0x4F: r.C = r.A; r.PC += 1; break;

        // 0x5X - LD D/E, x
        case 0x50: r.D = r.B; r.PC += 1; break;
        case 0x51: r.D = r.C; r.PC += 1; break;
        case 0x52: r.PC += 1; break;
        case 0x53: r.D = r.E; r.PC += 1; break;
        case 0x54: r.D = r.H; r.PC += 1; break;
        case 0x55: r.D = r.L; r.PC += 1; break;
        case 0x56: r.D = cpu.readMemory8(r.HL); r.PC += 1; break;
        case 0x57: r.D = r.A; r.PC += 1; break;
        case 0x58: r.E = r.B; r.PC += 1; break;
        case 0x59: r.E = r.C; r.PC += 1; break;
        case 0x5A: r.E = r.D; r.PC += 1; break;
        case 0x5B: r.PC += 1; break;
        case 0x5C: r.E = r.H; r.PC += 1; break;
        case 0x5D: r.E = r.L; r.PC += 1; break;
        case 0x5E: r.E = cpu.readMemory8(r.HL); r.PC += 1; break;
        case 0x5F: r.E = r.A; r.PC += 1; break;

        // 0x6X - LD H/L, x
        case 0x60: r.H = r.B; r.PC += 1; break;
        case 0x61: r.H = r.C; r.PC += 1; break;
        case 0x62: r.H = r.D; r.PC += 1; break;
        case 0x63: r.H = r.E; r.PC += 1; break;
        case 0x64: r.PC += 1; break;
        case 0x65: r.H = r.L; r.PC += 1; break;
        case 0x66: r.H = cpu.readMemory8(r.HL); r.PC += 1; break;
        case 0x67: r.H = r.A; r.PC += 1; break;
        case 0x68: r.L = r.B; r.PC += 1; break;
        case 0x69: r.L = r.C; r.PC += 1; break;
        case 0x6A: r.L = r.D; r.PC += 1; break;
        case 0x6B: r.L = r.E; r.PC += 1; break;
        case 0x6C: r.L = r.H; r.PC += 1; break;
        case 0x6D: r.PC += 1; break;
        case 0x6E: r.L = cpu.readMemory8(r.HL); r.PC += 1; break;
        case 0x6F: r.L = r.A; r.PC += 1; break;

        // 0x7X - LD [HL]/A, x + HALT
        case 0x70: cpu.writeMemory8(r.HL, r.B); r.PC += 1; break;
        case 0x71: cpu.writeMemory8(r.HL, r.C); r.PC += 1; break;
        case 0x72: cpu.writeMemory8(r.HL, r.D); r.PC += 1; break;
        case 0x73: cpu.writeMemory8(r.HL, r.E); r.PC += 1; break;
        case 0x74: cpu.writeMemory8(r.HL, r.H); r.PC += 1; break;
        case 0x75: cpu.writeMemory8(r.HL, r.L); r.PC += 1; break;
        case 0x76: cpu.halted = true; r.PC += 1; break; // HALT
        case 0x77: cpu.writeMemory8(r.HL, r.A); r.PC += 1; break;
        case 0x78: r.A = r.B; r.PC += 1; break;
        case 0x79: r.A = r.C; r.PC += 1; break;
        case 0x7A: r.A = r.D; r.PC += 1; break;
        case 0x7B: r.A = r.E; r.PC += 1; break;
        case 0x7C: r.A = r.H; r.PC += 1; break;
        case 0x7D: r.A = r.L; r.PC += 1; break;
        case 0x7E: r.A = cpu.readMemory8(r.HL); r.PC += 1; break;
        case 0x7F: r.PC += 1; break;

        default: break;
    }
}