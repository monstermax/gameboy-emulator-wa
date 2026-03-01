// Gameboy Emulator - Unprefixed 0x80-0xFF

import { Cpu } from "./Cpu";


export function executeUnprefixed_0x80_0xFF(cpu: Cpu, opcode: u8): void {
    const r = cpu.registers;

    switch (opcode) {

        // 0x8X - ADD A / ADC A
        case 0x80: addA(cpu, r.B); r.PC += 1; break;
        case 0x81: addA(cpu, r.C); r.PC += 1; break;
        case 0x82: addA(cpu, r.D); r.PC += 1; break;
        case 0x83: addA(cpu, r.E); r.PC += 1; break;
        case 0x84: addA(cpu, r.H); r.PC += 1; break;
        case 0x85: addA(cpu, r.L); r.PC += 1; break;
        case 0x86: addA(cpu, cpu.readMemory8(r.HL)); r.PC += 1; break;
        case 0x87: addA(cpu, r.A); r.PC += 1; break;
        case 0x88: adcA(cpu, r.B); r.PC += 1; break;
        case 0x89: adcA(cpu, r.C); r.PC += 1; break;
        case 0x8A: adcA(cpu, r.D); r.PC += 1; break;
        case 0x8B: adcA(cpu, r.E); r.PC += 1; break;
        case 0x8C: adcA(cpu, r.H); r.PC += 1; break;
        case 0x8D: adcA(cpu, r.L); r.PC += 1; break;
        case 0x8E: adcA(cpu, cpu.readMemory8(r.HL)); r.PC += 1; break;
        case 0x8F: adcA(cpu, r.A); r.PC += 1; break;

        // 0x9X - SUB A / SBC A
        case 0x90: subA(cpu, r.B); r.PC += 1; break;
        case 0x91: subA(cpu, r.C); r.PC += 1; break;
        case 0x92: subA(cpu, r.D); r.PC += 1; break;
        case 0x93: subA(cpu, r.E); r.PC += 1; break;
        case 0x94: subA(cpu, r.H); r.PC += 1; break;
        case 0x95: subA(cpu, r.L); r.PC += 1; break;
        case 0x96: subA(cpu, cpu.readMemory8(r.HL)); r.PC += 1; break;
        case 0x97: subA(cpu, r.A); r.PC += 1; break;
        case 0x98: sbcA(cpu, r.B); r.PC += 1; break;
        case 0x99: sbcA(cpu, r.C); r.PC += 1; break;
        case 0x9A: sbcA(cpu, r.D); r.PC += 1; break;
        case 0x9B: sbcA(cpu, r.E); r.PC += 1; break;
        case 0x9C: sbcA(cpu, r.H); r.PC += 1; break;
        case 0x9D: sbcA(cpu, r.L); r.PC += 1; break;
        case 0x9E: sbcA(cpu, cpu.readMemory8(r.HL)); r.PC += 1; break;
        case 0x9F: sbcA(cpu, r.A); r.PC += 1; break;

        // 0xAX - AND / XOR
        case 0xA0: andA(cpu, r.B); r.PC += 1; break;
        case 0xA1: andA(cpu, r.C); r.PC += 1; break;
        case 0xA2: andA(cpu, r.D); r.PC += 1; break;
        case 0xA3: andA(cpu, r.E); r.PC += 1; break;
        case 0xA4: andA(cpu, r.H); r.PC += 1; break;
        case 0xA5: andA(cpu, r.L); r.PC += 1; break;
        case 0xA6: andA(cpu, cpu.readMemory8(r.HL)); r.PC += 1; break;
        case 0xA7: andA(cpu, r.A); r.PC += 1; break;
        case 0xA8: xorA(cpu, r.B); r.PC += 1; break;
        case 0xA9: xorA(cpu, r.C); r.PC += 1; break;
        case 0xAA: xorA(cpu, r.D); r.PC += 1; break;
        case 0xAB: xorA(cpu, r.E); r.PC += 1; break;
        case 0xAC: xorA(cpu, r.H); r.PC += 1; break;
        case 0xAD: xorA(cpu, r.L); r.PC += 1; break;
        case 0xAE: xorA(cpu, cpu.readMemory8(r.HL)); r.PC += 1; break;
        case 0xAF: xorA(cpu, r.A); r.PC += 1; break;

        // 0xBX - OR / CP
        case 0xB0: orA(cpu, r.B); r.PC += 1; break;
        case 0xB1: orA(cpu, r.C); r.PC += 1; break;
        case 0xB2: orA(cpu, r.D); r.PC += 1; break;
        case 0xB3: orA(cpu, r.E); r.PC += 1; break;
        case 0xB4: orA(cpu, r.H); r.PC += 1; break;
        case 0xB5: orA(cpu, r.L); r.PC += 1; break;
        case 0xB6: orA(cpu, cpu.readMemory8(r.HL)); r.PC += 1; break;
        case 0xB7: orA(cpu, r.A); r.PC += 1; break;
        case 0xB8: cpA(cpu, r.B); r.PC += 1; break;
        case 0xB9: cpA(cpu, r.C); r.PC += 1; break;
        case 0xBA: cpA(cpu, r.D); r.PC += 1; break;
        case 0xBB: cpA(cpu, r.E); r.PC += 1; break;
        case 0xBC: cpA(cpu, r.H); r.PC += 1; break;
        case 0xBD: cpA(cpu, r.L); r.PC += 1; break;
        case 0xBE: cpA(cpu, cpu.readMemory8(r.HL)); r.PC += 1; break;
        case 0xBF: cpA(cpu, r.A); r.PC += 1; break;

        // 0xCX
        case 0xC0: if (!r.flagZ) { r.PC = cpu.popStack(); } else { r.PC += 1; } break;
        case 0xC1: r.BC = cpu.popStack(); r.PC += 1; break;
        case 0xC2: { const addr = cpu.readMemory16(r.PC + 1); if (!r.flagZ) r.PC = addr; else r.PC += 3; break; }
        case 0xC3: r.PC = cpu.readMemory16(r.PC + 1); break;
        case 0xC4: { const addr = cpu.readMemory16(r.PC + 1); r.PC += 3; if (!r.flagZ) { cpu.pushStack(r.PC); r.PC = addr; } break; }
        case 0xC5: cpu.pushStack(r.BC); r.PC += 1; break;
        case 0xC6: addA(cpu, cpu.readMemory8(r.PC + 1)); r.PC += 2; break;
        case 0xC7: cpu.pushStack(r.PC + 1); r.PC = 0x0000; break;
        case 0xC8: if (r.flagZ) { r.PC = cpu.popStack(); } else { r.PC += 1; } break;
        case 0xC9: r.PC = cpu.popStack(); break;
        case 0xCA: { const addr = cpu.readMemory16(r.PC + 1); if (r.flagZ) r.PC = addr; else r.PC += 3; break; }
        case 0xCB: r.PC += 1; break; // Should not reach here (handled in Cpu.runCycle)
        case 0xCC: { const addr = cpu.readMemory16(r.PC + 1); r.PC += 3; if (r.flagZ) { cpu.pushStack(r.PC); r.PC = addr; } break; }
        case 0xCD: { const addr = cpu.readMemory16(r.PC + 1); r.PC += 3; cpu.pushStack(r.PC); r.PC = addr; break; }
        case 0xCE: adcA(cpu, cpu.readMemory8(r.PC + 1)); r.PC += 2; break;
        case 0xCF: cpu.pushStack(r.PC + 1); r.PC = 0x0008; break;

        // 0xDX
        case 0xD0: if (!r.flagC) { r.PC = cpu.popStack(); } else { r.PC += 1; } break;
        case 0xD1: r.DE = cpu.popStack(); r.PC += 1; break;
        case 0xD2: { const addr = cpu.readMemory16(r.PC + 1); if (!r.flagC) r.PC = addr; else r.PC += 3; break; }
        case 0xD3: r.PC += 1; break;
        case 0xD4: { const addr = cpu.readMemory16(r.PC + 1); r.PC += 3; if (!r.flagC) { cpu.pushStack(r.PC); r.PC = addr; } break; }
        case 0xD5: cpu.pushStack(r.DE); r.PC += 1; break;
        case 0xD6: subA(cpu, cpu.readMemory8(r.PC + 1)); r.PC += 2; break;
        case 0xD7: cpu.pushStack(r.PC + 1); r.PC = 0x0010; break;
        case 0xD8: if (r.flagC) { r.PC = cpu.popStack(); } else { r.PC += 1; } break;
        case 0xD9: r.PC = cpu.popStack(); cpu.ime = true; break; // RETI
        case 0xDA: { const addr = cpu.readMemory16(r.PC + 1); if (r.flagC) r.PC = addr; else r.PC += 3; break; }
        case 0xDB: r.PC += 1; break;
        case 0xDC: { const addr = cpu.readMemory16(r.PC + 1); r.PC += 3; if (r.flagC) { cpu.pushStack(r.PC); r.PC = addr; } break; }
        case 0xDD: r.PC += 1; break;
        case 0xDE: sbcA(cpu, cpu.readMemory8(r.PC + 1)); r.PC += 2; break;
        case 0xDF: cpu.pushStack(r.PC + 1); r.PC = 0x0018; break;

        // 0xEX
        case 0xE0: cpu.writeMemory8(0xFF00 + <u16>cpu.readMemory8(r.PC + 1), r.A); r.PC += 2; break;
        case 0xE1: r.HL = cpu.popStack(); r.PC += 1; break;
        case 0xE2: cpu.writeMemory8(0xFF00 + <u16>r.C, r.A); r.PC += 1; break;
        case 0xE3: r.PC += 1; break;
        case 0xE4: r.PC += 1; break;
        case 0xE5: cpu.pushStack(r.HL); r.PC += 1; break;
        case 0xE6: andA(cpu, cpu.readMemory8(r.PC + 1)); r.PC += 2; break;
        case 0xE7: cpu.pushStack(r.PC + 1); r.PC = 0x0020; break;
        case 0xE8: { // ADD SP, e8
            const sp: i32 = <i32>r.SP; const off: i32 = <i32><i8>cpu.readMemory8(r.PC + 1);
            const res: i32 = sp + off;
            r.setFlags(false, false, ((sp & 0x0F) + (off & 0x0F)) > 0x0F, ((sp & 0xFF) + (off & 0xFF)) > 0xFF);
            r.SP = <u16>(res & 0xFFFF); r.PC += 2; break;
        }
        case 0xE9: r.PC = r.HL; break;
        case 0xEA: cpu.writeMemory8(cpu.readMemory16(r.PC + 1), r.A); r.PC += 3; break;
        case 0xEB: r.PC += 1; break;
        case 0xEC: r.PC += 1; break;
        case 0xED: r.PC += 1; break;
        case 0xEE: xorA(cpu, cpu.readMemory8(r.PC + 1)); r.PC += 2; break;
        case 0xEF: cpu.pushStack(r.PC + 1); r.PC = 0x0028; break;

        // 0xFX
        case 0xF0: r.A = cpu.readMemory8(0xFF00 + <u16>cpu.readMemory8(r.PC + 1)); r.PC += 2; break;
        case 0xF1: r.AF = cpu.popStack(); r.PC += 1; break;
        case 0xF2: r.A = cpu.readMemory8(0xFF00 + <u16>r.C); r.PC += 1; break;
        case 0xF3: cpu.ime = false; r.PC += 1; break; // DI
        case 0xF4: r.PC += 1; break;
        case 0xF5: cpu.pushStack(r.AF); r.PC += 1; break;
        case 0xF6: orA(cpu, cpu.readMemory8(r.PC + 1)); r.PC += 2; break;
        case 0xF7: cpu.pushStack(r.PC + 1); r.PC = 0x0030; break;
        case 0xF8: { // LD HL, SP+e8
            const sp: i32 = <i32>r.SP; const off: i32 = <i32><i8>cpu.readMemory8(r.PC + 1);
            const res: i32 = sp + off;
            r.setFlags(false, false, ((sp & 0x0F) + (off & 0x0F)) > 0x0F, ((sp & 0xFF) + (off & 0xFF)) > 0xFF);
            r.HL = <u16>(res & 0xFFFF); r.PC += 2; break;
        }
        case 0xF9: r.SP = r.HL; r.PC += 1; break;
        case 0xFA: r.A = cpu.readMemory8(cpu.readMemory16(r.PC + 1)); r.PC += 3; break;
        case 0xFB: cpu.imeScheduled = true; r.PC += 1; break; // EI
        case 0xFC: r.PC += 1; break;
        case 0xFD: r.PC += 1; break;
        case 0xFE: cpA(cpu, cpu.readMemory8(r.PC + 1)); r.PC += 2; break;
        case 0xFF: cpu.pushStack(r.PC + 1); r.PC = 0x0038; break;

        default: break;
    }
}


// ALU helpers (inlined by AssemblyScript optimizer in release builds)

function addA(cpu: Cpu, val: u8): void {
    const r = cpu.registers; const a = r.A;
    const result: u16 = <u16>a + <u16>val;
    r.A = <u8>(result & 0xFF);
    r.setFlags(r.A == 0, false, ((a & 0x0F) + (val & 0x0F)) > 0x0F, result > 0xFF);
}

function adcA(cpu: Cpu, val: u8): void {
    const r = cpu.registers; const a = r.A; const carry: u8 = r.flagC ? 1 : 0;
    const result: u16 = <u16>a + <u16>val + <u16>carry;
    r.A = <u8>(result & 0xFF);
    r.setFlags(r.A == 0, false, ((a & 0x0F) + (val & 0x0F) + carry) > 0x0F, result > 0xFF);
}

function subA(cpu: Cpu, val: u8): void {
    const r = cpu.registers; const a = r.A;
    const result: u8 = a - val;
    r.A = result;
    r.setFlags(result == 0, true, (a & 0x0F) < (val & 0x0F), a < val);
}

function sbcA(cpu: Cpu, val: u8): void {
    const r = cpu.registers; const a = r.A; const carry: u8 = r.flagC ? 1 : 0;
    const full: i32 = <i32>a - <i32>val - <i32>carry;
    r.A = <u8>(full & 0xFF);
    r.setFlags(r.A == 0, true, (<i32>(a & 0x0F) - <i32>(val & 0x0F) - <i32>carry) < 0, full < 0);
}

function andA(cpu: Cpu, val: u8): void {
    const r = cpu.registers; r.A = r.A & val; r.setFlags(r.A == 0, false, true, false);
}

function xorA(cpu: Cpu, val: u8): void {
    const r = cpu.registers; r.A = r.A ^ val; r.setFlags(r.A == 0, false, false, false);
}

function orA(cpu: Cpu, val: u8): void {
    const r = cpu.registers; r.A = r.A | val; r.setFlags(r.A == 0, false, false, false);
}

function cpA(cpu: Cpu, val: u8): void {
    const r = cpu.registers; const a = r.A;
    r.setFlags(a == val, true, (a & 0x0F) < (val & 0x0F), a < val);
}
