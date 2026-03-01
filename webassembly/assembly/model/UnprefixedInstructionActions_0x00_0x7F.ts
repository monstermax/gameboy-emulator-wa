// Gameboy Emulator - CPU Instructions - Unprefixed 0x00-0x7F
// NOP, LD r16/r8, INC, DEC, rotations, JR, DAA, CPL, SCF, CCF, LD r8,r8, HALT

import { CpuInstrution, InstructionActions } from "./CpuInstrution";
import { Cpu } from "./Cpu";
import { toHex } from "../lib/lib_numbers";


export function loadInstructionActions_0x00_0x7F(instruction: CpuInstrution): InstructionActions {
    let execute: (cpu: Cpu) => void;

    switch (instruction.opcode) {

        // =====================================================================
        //  0x0X
        // =====================================================================

        case 0x00: // NOP
            execute = function (cpu: Cpu): void {
                cpu.registers.PC += 1;
            }
            break;

        case 0x01: // LD BC, n16
            execute = function (cpu: Cpu): void {
                cpu.registers.BC = cpu.readMemory16(cpu.registers.PC + 1);
                cpu.registers.PC += 3;
            }
            break;

        case 0x02: // LD [BC], A
            execute = function (cpu: Cpu): void {
                cpu.writeMemory8(cpu.registers.BC, cpu.registers.A);
                cpu.registers.PC += 1;
            }
            break;

        case 0x03: // INC BC
            execute = function (cpu: Cpu): void {
                cpu.registers.BC = cpu.registers.BC + 1;
                cpu.registers.PC += 1;
            }
            break;

        case 0x04: // INC B
            execute = function (cpu: Cpu): void {
                const r = cpu.registers;
                const val = r.B;
                const result: u8 = val + 1;
                r.B = result;
                r.flagZ = result == 0;
                r.flagN = false;
                r.flagH = (val & 0x0F) == 0x0F;
                r.PC += 1;
            }
            break;

        case 0x05: // DEC B
            execute = function (cpu: Cpu): void {
                const r = cpu.registers;
                const val = r.B;
                const result: u8 = val - 1;
                r.B = result;
                r.flagZ = result == 0;
                r.flagN = true;
                r.flagH = (val & 0x0F) == 0x00;
                r.PC += 1;
            }
            break;

        case 0x06: // LD B, n8
            execute = function (cpu: Cpu): void {
                cpu.registers.B = cpu.readMemory8(cpu.registers.PC + 1);
                cpu.registers.PC += 2;
            }
            break;

        case 0x07: // RLCA
            execute = function (cpu: Cpu): void {
                const r = cpu.registers;
                const a = r.A;
                const bit7 = (a >> 7) & 1;
                r.A = (a << 1) | bit7;
                r.setFlags(false, false, false, bit7 == 1);
                r.PC += 1;
            }
            break;

        case 0x08: // LD [a16], SP
            execute = function (cpu: Cpu): void {
                const addr = cpu.readMemory16(cpu.registers.PC + 1);
                cpu.writeMemory16(addr, cpu.registers.SP);
                cpu.registers.PC += 3;
            }
            break;

        case 0x09: // ADD HL, BC
            execute = function (cpu: Cpu): void {
                const r = cpu.registers;
                const hl: u32 = <u32>r.HL;
                const val: u32 = <u32>r.BC;
                const result: u32 = hl + val;
                r.flagN = false;
                r.flagH = ((hl & 0x0FFF) + (val & 0x0FFF)) > 0x0FFF;
                r.flagC = result > 0xFFFF;
                r.HL = <u16>(result & 0xFFFF);
                r.PC += 1;
            }
            break;

        case 0x0A: // LD A, [BC]
            execute = function (cpu: Cpu): void {
                cpu.registers.A = cpu.readMemory8(cpu.registers.BC);
                cpu.registers.PC += 1;
            }
            break;

        case 0x0B: // DEC BC
            execute = function (cpu: Cpu): void {
                cpu.registers.BC = cpu.registers.BC - 1;
                cpu.registers.PC += 1;
            }
            break;

        case 0x0C: // INC C
            execute = function (cpu: Cpu): void {
                const r = cpu.registers;
                const val = r.C;
                const result: u8 = val + 1;
                r.C = result;
                r.flagZ = result == 0;
                r.flagN = false;
                r.flagH = (val & 0x0F) == 0x0F;
                r.PC += 1;
            }
            break;

        case 0x0D: // DEC C
            execute = function (cpu: Cpu): void {
                const r = cpu.registers;
                const val = r.C;
                const result: u8 = val - 1;
                r.C = result;
                r.flagZ = result == 0;
                r.flagN = true;
                r.flagH = (val & 0x0F) == 0x00;
                r.PC += 1;
            }
            break;

        case 0x0E: // LD C, n8
            execute = function (cpu: Cpu): void {
                cpu.registers.C = cpu.readMemory8(cpu.registers.PC + 1);
                cpu.registers.PC += 2;
            }
            break;

        case 0x0F: // RRCA
            execute = function (cpu: Cpu): void {
                const r = cpu.registers;
                const a = r.A;
                const bit0 = a & 1;
                r.A = (a >> 1) | (bit0 << 7);
                r.setFlags(false, false, false, bit0 == 1);
                r.PC += 1;
            }
            break;


        // =====================================================================
        //  0x1X
        // =====================================================================

        case 0x10: // STOP
            execute = function (cpu: Cpu): void {
                cpu.registers.PC += 2;
            }
            break;

        case 0x11: // LD DE, n16
            execute = function (cpu: Cpu): void {
                cpu.registers.DE = cpu.readMemory16(cpu.registers.PC + 1);
                cpu.registers.PC += 3;
            }
            break;

        case 0x12: // LD [DE], A
            execute = function (cpu: Cpu): void {
                cpu.writeMemory8(cpu.registers.DE, cpu.registers.A);
                cpu.registers.PC += 1;
            }
            break;

        case 0x13: // INC DE
            execute = function (cpu: Cpu): void {
                cpu.registers.DE = cpu.registers.DE + 1;
                cpu.registers.PC += 1;
            }
            break;

        case 0x14: // INC D
            execute = function (cpu: Cpu): void {
                const r = cpu.registers;
                const val = r.D;
                const result: u8 = val + 1;
                r.D = result;
                r.flagZ = result == 0;
                r.flagN = false;
                r.flagH = (val & 0x0F) == 0x0F;
                r.PC += 1;
            }
            break;

        case 0x15: // DEC D
            execute = function (cpu: Cpu): void {
                const r = cpu.registers;
                const val = r.D;
                const result: u8 = val - 1;
                r.D = result;
                r.flagZ = result == 0;
                r.flagN = true;
                r.flagH = (val & 0x0F) == 0x00;
                r.PC += 1;
            }
            break;

        case 0x16: // LD D, n8
            execute = function (cpu: Cpu): void {
                cpu.registers.D = cpu.readMemory8(cpu.registers.PC + 1);
                cpu.registers.PC += 2;
            }
            break;

        case 0x17: // RLA
            execute = function (cpu: Cpu): void {
                const r = cpu.registers;
                const a = r.A;
                const oldCarry: u8 = r.flagC ? 1 : 0;
                const bit7 = (a >> 7) & 1;
                r.A = (a << 1) | oldCarry;
                r.setFlags(false, false, false, bit7 == 1);
                r.PC += 1;
            }
            break;

        case 0x18: // JR e8
            execute = function (cpu: Cpu): void {
                const offset = <i8>cpu.readMemory8(cpu.registers.PC + 1);
                cpu.registers.PC = <u16>(<i32>cpu.registers.PC + 2 + <i32>offset);
            }
            break;

        case 0x19: // ADD HL, DE
            execute = function (cpu: Cpu): void {
                const r = cpu.registers;
                const hl: u32 = <u32>r.HL;
                const val: u32 = <u32>r.DE;
                const result: u32 = hl + val;
                r.flagN = false;
                r.flagH = ((hl & 0x0FFF) + (val & 0x0FFF)) > 0x0FFF;
                r.flagC = result > 0xFFFF;
                r.HL = <u16>(result & 0xFFFF);
                r.PC += 1;
            }
            break;

        case 0x1A: // LD A, [DE]
            execute = function (cpu: Cpu): void {
                cpu.registers.A = cpu.readMemory8(cpu.registers.DE);
                cpu.registers.PC += 1;
            }
            break;

        case 0x1B: // DEC DE
            execute = function (cpu: Cpu): void {
                cpu.registers.DE = cpu.registers.DE - 1;
                cpu.registers.PC += 1;
            }
            break;

        case 0x1C: // INC E
            execute = function (cpu: Cpu): void {
                const r = cpu.registers;
                const val = r.E;
                const result: u8 = val + 1;
                r.E = result;
                r.flagZ = result == 0;
                r.flagN = false;
                r.flagH = (val & 0x0F) == 0x0F;
                r.PC += 1;
            }
            break;

        case 0x1D: // DEC E
            execute = function (cpu: Cpu): void {
                const r = cpu.registers;
                const val = r.E;
                const result: u8 = val - 1;
                r.E = result;
                r.flagZ = result == 0;
                r.flagN = true;
                r.flagH = (val & 0x0F) == 0x00;
                r.PC += 1;
            }
            break;

        case 0x1E: // LD E, n8
            execute = function (cpu: Cpu): void {
                cpu.registers.E = cpu.readMemory8(cpu.registers.PC + 1);
                cpu.registers.PC += 2;
            }
            break;

        case 0x1F: // RRA
            execute = function (cpu: Cpu): void {
                const r = cpu.registers;
                const a = r.A;
                const oldCarry: u8 = r.flagC ? 1 : 0;
                const bit0 = a & 1;
                r.A = (a >> 1) | (oldCarry << 7);
                r.setFlags(false, false, false, bit0 == 1);
                r.PC += 1;
            }
            break;


        // =====================================================================
        //  0x2X
        // =====================================================================

        case 0x20: // JR NZ, e8
            execute = function (cpu: Cpu): void {
                const offset = <i8>cpu.readMemory8(cpu.registers.PC + 1);
                cpu.registers.PC += 2;
                if (!cpu.registers.flagZ) {
                    cpu.registers.PC = <u16>(<i32>cpu.registers.PC + <i32>offset);
                }
            }
            break;

        case 0x21: // LD HL, n16
            execute = function (cpu: Cpu): void {
                cpu.registers.HL = cpu.readMemory16(cpu.registers.PC + 1);
                cpu.registers.PC += 3;
            }
            break;

        case 0x22: // LD [HL+], A
            execute = function (cpu: Cpu): void {
                cpu.writeMemory8(cpu.registers.HL, cpu.registers.A);
                cpu.registers.HL = cpu.registers.HL + 1;
                cpu.registers.PC += 1;
            }
            break;

        case 0x23: // INC HL
            execute = function (cpu: Cpu): void {
                cpu.registers.HL = cpu.registers.HL + 1;
                cpu.registers.PC += 1;
            }
            break;

        case 0x24: // INC H
            execute = function (cpu: Cpu): void {
                const r = cpu.registers;
                const val = r.H;
                const result: u8 = val + 1;
                r.H = result;
                r.flagZ = result == 0;
                r.flagN = false;
                r.flagH = (val & 0x0F) == 0x0F;
                r.PC += 1;
            }
            break;

        case 0x25: // DEC H
            execute = function (cpu: Cpu): void {
                const r = cpu.registers;
                const val = r.H;
                const result: u8 = val - 1;
                r.H = result;
                r.flagZ = result == 0;
                r.flagN = true;
                r.flagH = (val & 0x0F) == 0x00;
                r.PC += 1;
            }
            break;

        case 0x26: // LD H, n8
            execute = function (cpu: Cpu): void {
                cpu.registers.H = cpu.readMemory8(cpu.registers.PC + 1);
                cpu.registers.PC += 2;
            }
            break;

        case 0x27: // DAA
            execute = function (cpu: Cpu): void {
                const r = cpu.registers;
                let a: i32 = <i32>r.A;

                if (!r.flagN) {
                    if (r.flagH || (a & 0x0F) > 9) a += 0x06;
                    if (r.flagC || a > 0x9F) { a += 0x60; r.flagC = true; }
                } else {
                    if (r.flagH) { a -= 0x06; a &= 0xFF; }
                    if (r.flagC) a -= 0x60;
                }

                r.A = <u8>(a & 0xFF);
                r.flagZ = r.A == 0;
                r.flagH = false;
                r.PC += 1;
            }
            break;

        case 0x28: // JR Z, e8
            execute = function (cpu: Cpu): void {
                const offset = <i8>cpu.readMemory8(cpu.registers.PC + 1);
                cpu.registers.PC += 2;
                if (cpu.registers.flagZ) {
                    cpu.registers.PC = <u16>(<i32>cpu.registers.PC + <i32>offset);
                }
            }
            break;

        case 0x29: // ADD HL, HL
            execute = function (cpu: Cpu): void {
                const r = cpu.registers;
                const hl: u32 = <u32>r.HL;
                const result: u32 = hl + hl;
                r.flagN = false;
                r.flagH = ((hl & 0x0FFF) * 2) > 0x0FFF;
                r.flagC = result > 0xFFFF;
                r.HL = <u16>(result & 0xFFFF);
                r.PC += 1;
            }
            break;

        case 0x2A: // LD A, [HL+]
            execute = function (cpu: Cpu): void {
                cpu.registers.A = cpu.readMemory8(cpu.registers.HL);
                cpu.registers.HL = cpu.registers.HL + 1;
                cpu.registers.PC += 1;
            }
            break;

        case 0x2B: // DEC HL
            execute = function (cpu: Cpu): void {
                cpu.registers.HL = cpu.registers.HL - 1;
                cpu.registers.PC += 1;
            }
            break;

        case 0x2C: // INC L
            execute = function (cpu: Cpu): void {
                const r = cpu.registers;
                const val = r.L;
                const result: u8 = val + 1;
                r.L = result;
                r.flagZ = result == 0;
                r.flagN = false;
                r.flagH = (val & 0x0F) == 0x0F;
                r.PC += 1;
            }
            break;

        case 0x2D: // DEC L
            execute = function (cpu: Cpu): void {
                const r = cpu.registers;
                const val = r.L;
                const result: u8 = val - 1;
                r.L = result;
                r.flagZ = result == 0;
                r.flagN = true;
                r.flagH = (val & 0x0F) == 0x00;
                r.PC += 1;
            }
            break;

        case 0x2E: // LD L, n8
            execute = function (cpu: Cpu): void {
                cpu.registers.L = cpu.readMemory8(cpu.registers.PC + 1);
                cpu.registers.PC += 2;
            }
            break;

        case 0x2F: // CPL
            execute = function (cpu: Cpu): void {
                cpu.registers.A = ~cpu.registers.A;
                cpu.registers.flagN = true;
                cpu.registers.flagH = true;
                cpu.registers.PC += 1;
            }
            break;


        // =====================================================================
        //  0x3X
        // =====================================================================

        case 0x30: // JR NC, e8
            execute = function (cpu: Cpu): void {
                const offset = <i8>cpu.readMemory8(cpu.registers.PC + 1);
                cpu.registers.PC += 2;
                if (!cpu.registers.flagC) {
                    cpu.registers.PC = <u16>(<i32>cpu.registers.PC + <i32>offset);
                }
            }
            break;

        case 0x31: // LD SP, n16
            execute = function (cpu: Cpu): void {
                cpu.registers.SP = cpu.readMemory16(cpu.registers.PC + 1);
                cpu.registers.PC += 3;
            }
            break;

        case 0x32: // LD [HL-], A
            execute = function (cpu: Cpu): void {
                cpu.writeMemory8(cpu.registers.HL, cpu.registers.A);
                cpu.registers.HL = cpu.registers.HL - 1;
                cpu.registers.PC += 1;
            }
            break;

        case 0x33: // INC SP
            execute = function (cpu: Cpu): void {
                cpu.registers.SP = cpu.registers.SP + 1;
                cpu.registers.PC += 1;
            }
            break;

        case 0x34: // INC [HL]
            execute = function (cpu: Cpu): void {
                const r = cpu.registers;
                const val = cpu.readMemory8(r.HL);
                const result: u8 = val + 1;
                cpu.writeMemory8(r.HL, result);
                r.flagZ = result == 0;
                r.flagN = false;
                r.flagH = (val & 0x0F) == 0x0F;
                r.PC += 1;
            }
            break;

        case 0x35: // DEC [HL]
            execute = function (cpu: Cpu): void {
                const r = cpu.registers;
                const val = cpu.readMemory8(r.HL);
                const result: u8 = val - 1;
                cpu.writeMemory8(r.HL, result);
                r.flagZ = result == 0;
                r.flagN = true;
                r.flagH = (val & 0x0F) == 0x00;
                r.PC += 1;
            }
            break;

        case 0x36: // LD [HL], n8
            execute = function (cpu: Cpu): void {
                cpu.writeMemory8(cpu.registers.HL, cpu.readMemory8(cpu.registers.PC + 1));
                cpu.registers.PC += 2;
            }
            break;

        case 0x37: // SCF
            execute = function (cpu: Cpu): void {
                cpu.registers.flagN = false;
                cpu.registers.flagH = false;
                cpu.registers.flagC = true;
                cpu.registers.PC += 1;
            }
            break;

        case 0x38: // JR C, e8
            execute = function (cpu: Cpu): void {
                const offset = <i8>cpu.readMemory8(cpu.registers.PC + 1);
                cpu.registers.PC += 2;
                if (cpu.registers.flagC) {
                    cpu.registers.PC = <u16>(<i32>cpu.registers.PC + <i32>offset);
                }
            }
            break;

        case 0x39: // ADD HL, SP
            execute = function (cpu: Cpu): void {
                const r = cpu.registers;
                const hl: u32 = <u32>r.HL;
                const val: u32 = <u32>r.SP;
                const result: u32 = hl + val;
                r.flagN = false;
                r.flagH = ((hl & 0x0FFF) + (val & 0x0FFF)) > 0x0FFF;
                r.flagC = result > 0xFFFF;
                r.HL = <u16>(result & 0xFFFF);
                r.PC += 1;
            }
            break;

        case 0x3A: // LD A, [HL-]
            execute = function (cpu: Cpu): void {
                cpu.registers.A = cpu.readMemory8(cpu.registers.HL);
                cpu.registers.HL = cpu.registers.HL - 1;
                cpu.registers.PC += 1;
            }
            break;

        case 0x3B: // DEC SP
            execute = function (cpu: Cpu): void {
                cpu.registers.SP = cpu.registers.SP - 1;
                cpu.registers.PC += 1;
            }
            break;

        case 0x3C: // INC A
            execute = function (cpu: Cpu): void {
                const r = cpu.registers;
                const val = r.A;
                const result: u8 = val + 1;
                r.A = result;
                r.flagZ = result == 0;
                r.flagN = false;
                r.flagH = (val & 0x0F) == 0x0F;
                r.PC += 1;
            }
            break;

        case 0x3D: // DEC A
            execute = function (cpu: Cpu): void {
                const r = cpu.registers;
                const val = r.A;
                const result: u8 = val - 1;
                r.A = result;
                r.flagZ = result == 0;
                r.flagN = true;
                r.flagH = (val & 0x0F) == 0x00;
                r.PC += 1;
            }
            break;

        case 0x3E: // LD A, n8
            execute = function (cpu: Cpu): void {
                cpu.registers.A = cpu.readMemory8(cpu.registers.PC + 1);
                cpu.registers.PC += 2;
            }
            break;

        case 0x3F: // CCF
            execute = function (cpu: Cpu): void {
                cpu.registers.flagN = false;
                cpu.registers.flagH = false;
                cpu.registers.flagC = !cpu.registers.flagC;
                cpu.registers.PC += 1;
            }
            break;


        // =====================================================================
        //  0x4X-0x7X : LD r8, r8 (+ HALT at 0x76)
        // =====================================================================

        // --- LD B, x ---
        case 0x40: execute = function (cpu: Cpu): void { cpu.registers.PC += 1; }; break; // LD B, B
        case 0x41: execute = function (cpu: Cpu): void { cpu.registers.B = cpu.registers.C; cpu.registers.PC += 1; }; break;
        case 0x42: execute = function (cpu: Cpu): void { cpu.registers.B = cpu.registers.D; cpu.registers.PC += 1; }; break;
        case 0x43: execute = function (cpu: Cpu): void { cpu.registers.B = cpu.registers.E; cpu.registers.PC += 1; }; break;
        case 0x44: execute = function (cpu: Cpu): void { cpu.registers.B = cpu.registers.H; cpu.registers.PC += 1; }; break;
        case 0x45: execute = function (cpu: Cpu): void { cpu.registers.B = cpu.registers.L; cpu.registers.PC += 1; }; break;
        case 0x46: execute = function (cpu: Cpu): void { cpu.registers.B = cpu.readMemory8(cpu.registers.HL); cpu.registers.PC += 1; }; break;
        case 0x47: execute = function (cpu: Cpu): void { cpu.registers.B = cpu.registers.A; cpu.registers.PC += 1; }; break;

        // --- LD C, x ---
        case 0x48: execute = function (cpu: Cpu): void { cpu.registers.C = cpu.registers.B; cpu.registers.PC += 1; }; break;
        case 0x49: execute = function (cpu: Cpu): void { cpu.registers.PC += 1; }; break; // LD C, C
        case 0x4A: execute = function (cpu: Cpu): void { cpu.registers.C = cpu.registers.D; cpu.registers.PC += 1; }; break;
        case 0x4B: execute = function (cpu: Cpu): void { cpu.registers.C = cpu.registers.E; cpu.registers.PC += 1; }; break;
        case 0x4C: execute = function (cpu: Cpu): void { cpu.registers.C = cpu.registers.H; cpu.registers.PC += 1; }; break;
        case 0x4D: execute = function (cpu: Cpu): void { cpu.registers.C = cpu.registers.L; cpu.registers.PC += 1; }; break;
        case 0x4E: execute = function (cpu: Cpu): void { cpu.registers.C = cpu.readMemory8(cpu.registers.HL); cpu.registers.PC += 1; }; break;
        case 0x4F: execute = function (cpu: Cpu): void { cpu.registers.C = cpu.registers.A; cpu.registers.PC += 1; }; break;

        // --- LD D, x ---
        case 0x50: execute = function (cpu: Cpu): void { cpu.registers.D = cpu.registers.B; cpu.registers.PC += 1; }; break;
        case 0x51: execute = function (cpu: Cpu): void { cpu.registers.D = cpu.registers.C; cpu.registers.PC += 1; }; break;
        case 0x52: execute = function (cpu: Cpu): void { cpu.registers.PC += 1; }; break; // LD D, D
        case 0x53: execute = function (cpu: Cpu): void { cpu.registers.D = cpu.registers.E; cpu.registers.PC += 1; }; break;
        case 0x54: execute = function (cpu: Cpu): void { cpu.registers.D = cpu.registers.H; cpu.registers.PC += 1; }; break;
        case 0x55: execute = function (cpu: Cpu): void { cpu.registers.D = cpu.registers.L; cpu.registers.PC += 1; }; break;
        case 0x56: execute = function (cpu: Cpu): void { cpu.registers.D = cpu.readMemory8(cpu.registers.HL); cpu.registers.PC += 1; }; break;
        case 0x57: execute = function (cpu: Cpu): void { cpu.registers.D = cpu.registers.A; cpu.registers.PC += 1; }; break;

        // --- LD E, x ---
        case 0x58: execute = function (cpu: Cpu): void { cpu.registers.E = cpu.registers.B; cpu.registers.PC += 1; }; break;
        case 0x59: execute = function (cpu: Cpu): void { cpu.registers.E = cpu.registers.C; cpu.registers.PC += 1; }; break;
        case 0x5A: execute = function (cpu: Cpu): void { cpu.registers.E = cpu.registers.D; cpu.registers.PC += 1; }; break;
        case 0x5B: execute = function (cpu: Cpu): void { cpu.registers.PC += 1; }; break; // LD E, E
        case 0x5C: execute = function (cpu: Cpu): void { cpu.registers.E = cpu.registers.H; cpu.registers.PC += 1; }; break;
        case 0x5D: execute = function (cpu: Cpu): void { cpu.registers.E = cpu.registers.L; cpu.registers.PC += 1; }; break;
        case 0x5E: execute = function (cpu: Cpu): void { cpu.registers.E = cpu.readMemory8(cpu.registers.HL); cpu.registers.PC += 1; }; break;
        case 0x5F: execute = function (cpu: Cpu): void { cpu.registers.E = cpu.registers.A; cpu.registers.PC += 1; }; break;

        // --- LD H, x ---
        case 0x60: execute = function (cpu: Cpu): void { cpu.registers.H = cpu.registers.B; cpu.registers.PC += 1; }; break;
        case 0x61: execute = function (cpu: Cpu): void { cpu.registers.H = cpu.registers.C; cpu.registers.PC += 1; }; break;
        case 0x62: execute = function (cpu: Cpu): void { cpu.registers.H = cpu.registers.D; cpu.registers.PC += 1; }; break;
        case 0x63: execute = function (cpu: Cpu): void { cpu.registers.H = cpu.registers.E; cpu.registers.PC += 1; }; break;
        case 0x64: execute = function (cpu: Cpu): void { cpu.registers.PC += 1; }; break; // LD H, H
        case 0x65: execute = function (cpu: Cpu): void { cpu.registers.H = cpu.registers.L; cpu.registers.PC += 1; }; break;
        case 0x66: execute = function (cpu: Cpu): void { cpu.registers.H = cpu.readMemory8(cpu.registers.HL); cpu.registers.PC += 1; }; break;
        case 0x67: execute = function (cpu: Cpu): void { cpu.registers.H = cpu.registers.A; cpu.registers.PC += 1; }; break;

        // --- LD L, x ---
        case 0x68: execute = function (cpu: Cpu): void { cpu.registers.L = cpu.registers.B; cpu.registers.PC += 1; }; break;
        case 0x69: execute = function (cpu: Cpu): void { cpu.registers.L = cpu.registers.C; cpu.registers.PC += 1; }; break;
        case 0x6A: execute = function (cpu: Cpu): void { cpu.registers.L = cpu.registers.D; cpu.registers.PC += 1; }; break;
        case 0x6B: execute = function (cpu: Cpu): void { cpu.registers.L = cpu.registers.E; cpu.registers.PC += 1; }; break;
        case 0x6C: execute = function (cpu: Cpu): void { cpu.registers.L = cpu.registers.H; cpu.registers.PC += 1; }; break;
        case 0x6D: execute = function (cpu: Cpu): void { cpu.registers.PC += 1; }; break; // LD L, L
        case 0x6E: execute = function (cpu: Cpu): void { cpu.registers.L = cpu.readMemory8(cpu.registers.HL); cpu.registers.PC += 1; }; break;
        case 0x6F: execute = function (cpu: Cpu): void { cpu.registers.L = cpu.registers.A; cpu.registers.PC += 1; }; break;

        // --- LD [HL], x ---
        case 0x70: execute = function (cpu: Cpu): void { cpu.writeMemory8(cpu.registers.HL, cpu.registers.B); cpu.registers.PC += 1; }; break;
        case 0x71: execute = function (cpu: Cpu): void { cpu.writeMemory8(cpu.registers.HL, cpu.registers.C); cpu.registers.PC += 1; }; break;
        case 0x72: execute = function (cpu: Cpu): void { cpu.writeMemory8(cpu.registers.HL, cpu.registers.D); cpu.registers.PC += 1; }; break;
        case 0x73: execute = function (cpu: Cpu): void { cpu.writeMemory8(cpu.registers.HL, cpu.registers.E); cpu.registers.PC += 1; }; break;
        case 0x74: execute = function (cpu: Cpu): void { cpu.writeMemory8(cpu.registers.HL, cpu.registers.H); cpu.registers.PC += 1; }; break;
        case 0x75: execute = function (cpu: Cpu): void { cpu.writeMemory8(cpu.registers.HL, cpu.registers.L); cpu.registers.PC += 1; }; break;

        case 0x76: // HALT
            execute = function (cpu: Cpu): void {
                cpu.halted = true;
                cpu.registers.PC += 1;
            }
            break;

        case 0x77: execute = function (cpu: Cpu): void { cpu.writeMemory8(cpu.registers.HL, cpu.registers.A); cpu.registers.PC += 1; }; break;

        // --- LD A, x ---
        case 0x78: execute = function (cpu: Cpu): void { cpu.registers.A = cpu.registers.B; cpu.registers.PC += 1; }; break;
        case 0x79: execute = function (cpu: Cpu): void { cpu.registers.A = cpu.registers.C; cpu.registers.PC += 1; }; break;
        case 0x7A: execute = function (cpu: Cpu): void { cpu.registers.A = cpu.registers.D; cpu.registers.PC += 1; }; break;
        case 0x7B: execute = function (cpu: Cpu): void { cpu.registers.A = cpu.registers.E; cpu.registers.PC += 1; }; break;
        case 0x7C: execute = function (cpu: Cpu): void { cpu.registers.A = cpu.registers.H; cpu.registers.PC += 1; }; break;
        case 0x7D: execute = function (cpu: Cpu): void { cpu.registers.A = cpu.registers.L; cpu.registers.PC += 1; }; break;
        case 0x7E: execute = function (cpu: Cpu): void { cpu.registers.A = cpu.readMemory8(cpu.registers.HL); cpu.registers.PC += 1; }; break;
        case 0x7F: execute = function (cpu: Cpu): void { cpu.registers.PC += 1; }; break; // LD A, A


        default:
            throw new Error(`Unknown unprefixed opcode: ${toHex(instruction.opcode)}`);
    }

    return new InstructionActions(execute);
}