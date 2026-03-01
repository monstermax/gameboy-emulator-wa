// Gameboy Emulator - CPU Instructions - Unprefixed 0x80-0xFF
// ALU, control flow, stack, LDH, DI/EI, CB prefix

import { CpuInstrution, InstructionActions } from "./CpuInstrution";
import { Cpu } from "./Cpu";
import { toHex } from "../lib/lib_numbers";


export function loadInstructionActions_0x80_0xFF(instruction: CpuInstrution): InstructionActions {
    let execute: (cpu: Cpu) => void;

    switch (instruction.opcode) {

        // =====================================================================
        //  0x8X - ADD A, r8 / ADC A, r8
        // =====================================================================

        case 0x80: execute = function (cpu: Cpu): void { addA(cpu, cpu.registers.B); cpu.registers.PC += 1; }; break;
        case 0x81: execute = function (cpu: Cpu): void { addA(cpu, cpu.registers.C); cpu.registers.PC += 1; }; break;
        case 0x82: execute = function (cpu: Cpu): void { addA(cpu, cpu.registers.D); cpu.registers.PC += 1; }; break;
        case 0x83: execute = function (cpu: Cpu): void { addA(cpu, cpu.registers.E); cpu.registers.PC += 1; }; break;
        case 0x84: execute = function (cpu: Cpu): void { addA(cpu, cpu.registers.H); cpu.registers.PC += 1; }; break;
        case 0x85: execute = function (cpu: Cpu): void { addA(cpu, cpu.registers.L); cpu.registers.PC += 1; }; break;
        case 0x86: execute = function (cpu: Cpu): void { addA(cpu, cpu.readMemory8(cpu.registers.HL)); cpu.registers.PC += 1; }; break;
        case 0x87: execute = function (cpu: Cpu): void { addA(cpu, cpu.registers.A); cpu.registers.PC += 1; }; break;

        case 0x88: execute = function (cpu: Cpu): void { adcA(cpu, cpu.registers.B); cpu.registers.PC += 1; }; break;
        case 0x89: execute = function (cpu: Cpu): void { adcA(cpu, cpu.registers.C); cpu.registers.PC += 1; }; break;
        case 0x8A: execute = function (cpu: Cpu): void { adcA(cpu, cpu.registers.D); cpu.registers.PC += 1; }; break;
        case 0x8B: execute = function (cpu: Cpu): void { adcA(cpu, cpu.registers.E); cpu.registers.PC += 1; }; break;
        case 0x8C: execute = function (cpu: Cpu): void { adcA(cpu, cpu.registers.H); cpu.registers.PC += 1; }; break;
        case 0x8D: execute = function (cpu: Cpu): void { adcA(cpu, cpu.registers.L); cpu.registers.PC += 1; }; break;
        case 0x8E: execute = function (cpu: Cpu): void { adcA(cpu, cpu.readMemory8(cpu.registers.HL)); cpu.registers.PC += 1; }; break;
        case 0x8F: execute = function (cpu: Cpu): void { adcA(cpu, cpu.registers.A); cpu.registers.PC += 1; }; break;


        // =====================================================================
        //  0x9X - SUB A, r8 / SBC A, r8
        // =====================================================================

        case 0x90: execute = function (cpu: Cpu): void { subA(cpu, cpu.registers.B); cpu.registers.PC += 1; }; break;
        case 0x91: execute = function (cpu: Cpu): void { subA(cpu, cpu.registers.C); cpu.registers.PC += 1; }; break;
        case 0x92: execute = function (cpu: Cpu): void { subA(cpu, cpu.registers.D); cpu.registers.PC += 1; }; break;
        case 0x93: execute = function (cpu: Cpu): void { subA(cpu, cpu.registers.E); cpu.registers.PC += 1; }; break;
        case 0x94: execute = function (cpu: Cpu): void { subA(cpu, cpu.registers.H); cpu.registers.PC += 1; }; break;
        case 0x95: execute = function (cpu: Cpu): void { subA(cpu, cpu.registers.L); cpu.registers.PC += 1; }; break;
        case 0x96: execute = function (cpu: Cpu): void { subA(cpu, cpu.readMemory8(cpu.registers.HL)); cpu.registers.PC += 1; }; break;
        case 0x97: execute = function (cpu: Cpu): void { subA(cpu, cpu.registers.A); cpu.registers.PC += 1; }; break;

        case 0x98: execute = function (cpu: Cpu): void { sbcA(cpu, cpu.registers.B); cpu.registers.PC += 1; }; break;
        case 0x99: execute = function (cpu: Cpu): void { sbcA(cpu, cpu.registers.C); cpu.registers.PC += 1; }; break;
        case 0x9A: execute = function (cpu: Cpu): void { sbcA(cpu, cpu.registers.D); cpu.registers.PC += 1; }; break;
        case 0x9B: execute = function (cpu: Cpu): void { sbcA(cpu, cpu.registers.E); cpu.registers.PC += 1; }; break;
        case 0x9C: execute = function (cpu: Cpu): void { sbcA(cpu, cpu.registers.H); cpu.registers.PC += 1; }; break;
        case 0x9D: execute = function (cpu: Cpu): void { sbcA(cpu, cpu.registers.L); cpu.registers.PC += 1; }; break;
        case 0x9E: execute = function (cpu: Cpu): void { sbcA(cpu, cpu.readMemory8(cpu.registers.HL)); cpu.registers.PC += 1; }; break;
        case 0x9F: execute = function (cpu: Cpu): void { sbcA(cpu, cpu.registers.A); cpu.registers.PC += 1; }; break;


        // =====================================================================
        //  0xAX - AND A, r8 / XOR A, r8
        // =====================================================================

        case 0xA0: execute = function (cpu: Cpu): void { andA(cpu, cpu.registers.B); cpu.registers.PC += 1; }; break;
        case 0xA1: execute = function (cpu: Cpu): void { andA(cpu, cpu.registers.C); cpu.registers.PC += 1; }; break;
        case 0xA2: execute = function (cpu: Cpu): void { andA(cpu, cpu.registers.D); cpu.registers.PC += 1; }; break;
        case 0xA3: execute = function (cpu: Cpu): void { andA(cpu, cpu.registers.E); cpu.registers.PC += 1; }; break;
        case 0xA4: execute = function (cpu: Cpu): void { andA(cpu, cpu.registers.H); cpu.registers.PC += 1; }; break;
        case 0xA5: execute = function (cpu: Cpu): void { andA(cpu, cpu.registers.L); cpu.registers.PC += 1; }; break;
        case 0xA6: execute = function (cpu: Cpu): void { andA(cpu, cpu.readMemory8(cpu.registers.HL)); cpu.registers.PC += 1; }; break;
        case 0xA7: execute = function (cpu: Cpu): void { andA(cpu, cpu.registers.A); cpu.registers.PC += 1; }; break;

        case 0xA8: execute = function (cpu: Cpu): void { xorA(cpu, cpu.registers.B); cpu.registers.PC += 1; }; break;
        case 0xA9: execute = function (cpu: Cpu): void { xorA(cpu, cpu.registers.C); cpu.registers.PC += 1; }; break;
        case 0xAA: execute = function (cpu: Cpu): void { xorA(cpu, cpu.registers.D); cpu.registers.PC += 1; }; break;
        case 0xAB: execute = function (cpu: Cpu): void { xorA(cpu, cpu.registers.E); cpu.registers.PC += 1; }; break;
        case 0xAC: execute = function (cpu: Cpu): void { xorA(cpu, cpu.registers.H); cpu.registers.PC += 1; }; break;
        case 0xAD: execute = function (cpu: Cpu): void { xorA(cpu, cpu.registers.L); cpu.registers.PC += 1; }; break;
        case 0xAE: execute = function (cpu: Cpu): void { xorA(cpu, cpu.readMemory8(cpu.registers.HL)); cpu.registers.PC += 1; }; break;
        case 0xAF: execute = function (cpu: Cpu): void { xorA(cpu, cpu.registers.A); cpu.registers.PC += 1; }; break;


        // =====================================================================
        //  0xBX - OR A, r8 / CP A, r8
        // =====================================================================

        case 0xB0: execute = function (cpu: Cpu): void { orA(cpu, cpu.registers.B); cpu.registers.PC += 1; }; break;
        case 0xB1: execute = function (cpu: Cpu): void { orA(cpu, cpu.registers.C); cpu.registers.PC += 1; }; break;
        case 0xB2: execute = function (cpu: Cpu): void { orA(cpu, cpu.registers.D); cpu.registers.PC += 1; }; break;
        case 0xB3: execute = function (cpu: Cpu): void { orA(cpu, cpu.registers.E); cpu.registers.PC += 1; }; break;
        case 0xB4: execute = function (cpu: Cpu): void { orA(cpu, cpu.registers.H); cpu.registers.PC += 1; }; break;
        case 0xB5: execute = function (cpu: Cpu): void { orA(cpu, cpu.registers.L); cpu.registers.PC += 1; }; break;
        case 0xB6: execute = function (cpu: Cpu): void { orA(cpu, cpu.readMemory8(cpu.registers.HL)); cpu.registers.PC += 1; }; break;
        case 0xB7: execute = function (cpu: Cpu): void { orA(cpu, cpu.registers.A); cpu.registers.PC += 1; }; break;

        case 0xB8: execute = function (cpu: Cpu): void { cpA(cpu, cpu.registers.B); cpu.registers.PC += 1; }; break;
        case 0xB9: execute = function (cpu: Cpu): void { cpA(cpu, cpu.registers.C); cpu.registers.PC += 1; }; break;
        case 0xBA: execute = function (cpu: Cpu): void { cpA(cpu, cpu.registers.D); cpu.registers.PC += 1; }; break;
        case 0xBB: execute = function (cpu: Cpu): void { cpA(cpu, cpu.registers.E); cpu.registers.PC += 1; }; break;
        case 0xBC: execute = function (cpu: Cpu): void { cpA(cpu, cpu.registers.H); cpu.registers.PC += 1; }; break;
        case 0xBD: execute = function (cpu: Cpu): void { cpA(cpu, cpu.registers.L); cpu.registers.PC += 1; }; break;
        case 0xBE: execute = function (cpu: Cpu): void { cpA(cpu, cpu.readMemory8(cpu.registers.HL)); cpu.registers.PC += 1; }; break;
        case 0xBF: execute = function (cpu: Cpu): void { cpA(cpu, cpu.registers.A); cpu.registers.PC += 1; }; break;


        // =====================================================================
        //  0xCX
        // =====================================================================

        case 0xC0: // RET NZ
            execute = function (cpu: Cpu): void {
                if (!cpu.registers.flagZ) { cpu.registers.PC = cpu.popStack(); }
                else { cpu.registers.PC += 1; }
            }
            break;

        case 0xC1: // POP BC
            execute = function (cpu: Cpu): void {
                cpu.registers.BC = cpu.popStack();
                cpu.registers.PC += 1;
            }
            break;

        case 0xC2: // JP NZ, a16
            execute = function (cpu: Cpu): void {
                const addr = cpu.readMemory16(cpu.registers.PC + 1);
                if (!cpu.registers.flagZ) { cpu.registers.PC = addr; }
                else { cpu.registers.PC += 3; }
            }
            break;

        case 0xC3: // JP a16
            execute = function (cpu: Cpu): void {
                cpu.registers.PC = cpu.readMemory16(cpu.registers.PC + 1);
            }
            break;

        case 0xC4: // CALL NZ, a16
            execute = function (cpu: Cpu): void {
                const addr = cpu.readMemory16(cpu.registers.PC + 1);
                cpu.registers.PC += 3;
                if (!cpu.registers.flagZ) {
                    cpu.pushStack(cpu.registers.PC);
                    cpu.registers.PC = addr;
                }
            }
            break;

        case 0xC5: // PUSH BC
            execute = function (cpu: Cpu): void {
                cpu.pushStack(cpu.registers.BC);
                cpu.registers.PC += 1;
            }
            break;

        case 0xC6: // ADD A, n8
            execute = function (cpu: Cpu): void {
                addA(cpu, cpu.readMemory8(cpu.registers.PC + 1));
                cpu.registers.PC += 2;
            }
            break;

        case 0xC7: // RST 00H
            execute = function (cpu: Cpu): void {
                cpu.pushStack(cpu.registers.PC + 1);
                cpu.registers.PC = 0x0000;
            }
            break;

        case 0xC8: // RET Z
            execute = function (cpu: Cpu): void {
                if (cpu.registers.flagZ) { cpu.registers.PC = cpu.popStack(); }
                else { cpu.registers.PC += 1; }
            }
            break;

        case 0xC9: // RET
            execute = function (cpu: Cpu): void {
                cpu.registers.PC = cpu.popStack();
            }
            break;

        case 0xCA: // JP Z, a16
            execute = function (cpu: Cpu): void {
                const addr = cpu.readMemory16(cpu.registers.PC + 1);
                if (cpu.registers.flagZ) { cpu.registers.PC = addr; }
                else { cpu.registers.PC += 3; }
            }
            break;

        case 0xCB: // PREFIX CB
            execute = function (cpu: Cpu): void {
                cpu.currentInstructionUsePrefix = true;
                cpu.registers.PC += 1;
            }
            break;

        case 0xCC: // CALL Z, a16
            execute = function (cpu: Cpu): void {
                const addr = cpu.readMemory16(cpu.registers.PC + 1);
                cpu.registers.PC += 3;
                if (cpu.registers.flagZ) {
                    cpu.pushStack(cpu.registers.PC);
                    cpu.registers.PC = addr;
                }
            }
            break;

        case 0xCD: // CALL a16
            execute = function (cpu: Cpu): void {
                const addr = cpu.readMemory16(cpu.registers.PC + 1);
                cpu.registers.PC += 3;
                cpu.pushStack(cpu.registers.PC);
                cpu.registers.PC = addr;
            }
            break;

        case 0xCE: // ADC A, n8
            execute = function (cpu: Cpu): void {
                adcA(cpu, cpu.readMemory8(cpu.registers.PC + 1));
                cpu.registers.PC += 2;
            }
            break;

        case 0xCF: // RST 08H
            execute = function (cpu: Cpu): void {
                cpu.pushStack(cpu.registers.PC + 1);
                cpu.registers.PC = 0x0008;
            }
            break;


        // =====================================================================
        //  0xDX
        // =====================================================================

        case 0xD0: // RET NC
            execute = function (cpu: Cpu): void {
                if (!cpu.registers.flagC) { cpu.registers.PC = cpu.popStack(); }
                else { cpu.registers.PC += 1; }
            }
            break;

        case 0xD1: // POP DE
            execute = function (cpu: Cpu): void {
                cpu.registers.DE = cpu.popStack();
                cpu.registers.PC += 1;
            }
            break;

        case 0xD2: // JP NC, a16
            execute = function (cpu: Cpu): void {
                const addr = cpu.readMemory16(cpu.registers.PC + 1);
                if (!cpu.registers.flagC) { cpu.registers.PC = addr; }
                else { cpu.registers.PC += 3; }
            }
            break;

        case 0xD3: // [unused]
            execute = function (cpu: Cpu): void { cpu.registers.PC += 1; }
            break;

        case 0xD4: // CALL NC, a16
            execute = function (cpu: Cpu): void {
                const addr = cpu.readMemory16(cpu.registers.PC + 1);
                cpu.registers.PC += 3;
                if (!cpu.registers.flagC) {
                    cpu.pushStack(cpu.registers.PC);
                    cpu.registers.PC = addr;
                }
            }
            break;

        case 0xD5: // PUSH DE
            execute = function (cpu: Cpu): void {
                cpu.pushStack(cpu.registers.DE);
                cpu.registers.PC += 1;
            }
            break;

        case 0xD6: // SUB A, n8
            execute = function (cpu: Cpu): void {
                subA(cpu, cpu.readMemory8(cpu.registers.PC + 1));
                cpu.registers.PC += 2;
            }
            break;

        case 0xD7: // RST 10H
            execute = function (cpu: Cpu): void {
                cpu.pushStack(cpu.registers.PC + 1);
                cpu.registers.PC = 0x0010;
            }
            break;

        case 0xD8: // RET C
            execute = function (cpu: Cpu): void {
                if (cpu.registers.flagC) { cpu.registers.PC = cpu.popStack(); }
                else { cpu.registers.PC += 1; }
            }
            break;

        case 0xD9: // RETI
            execute = function (cpu: Cpu): void {
                cpu.registers.PC = cpu.popStack();
                cpu.ime = true;
            }
            break;

        case 0xDA: // JP C, a16
            execute = function (cpu: Cpu): void {
                const addr = cpu.readMemory16(cpu.registers.PC + 1);
                if (cpu.registers.flagC) { cpu.registers.PC = addr; }
                else { cpu.registers.PC += 3; }
            }
            break;

        case 0xDB: // [unused]
            execute = function (cpu: Cpu): void { cpu.registers.PC += 1; }
            break;

        case 0xDC: // CALL C, a16
            execute = function (cpu: Cpu): void {
                const addr = cpu.readMemory16(cpu.registers.PC + 1);
                cpu.registers.PC += 3;
                if (cpu.registers.flagC) {
                    cpu.pushStack(cpu.registers.PC);
                    cpu.registers.PC = addr;
                }
            }
            break;

        case 0xDD: // [unused]
            execute = function (cpu: Cpu): void { cpu.registers.PC += 1; }
            break;

        case 0xDE: // SBC A, n8
            execute = function (cpu: Cpu): void {
                sbcA(cpu, cpu.readMemory8(cpu.registers.PC + 1));
                cpu.registers.PC += 2;
            }
            break;

        case 0xDF: // RST 18H
            execute = function (cpu: Cpu): void {
                cpu.pushStack(cpu.registers.PC + 1);
                cpu.registers.PC = 0x0018;
            }
            break;


        // =====================================================================
        //  0xEX
        // =====================================================================

        case 0xE0: // LDH [a8], A  => LD [0xFF00+n8], A
            execute = function (cpu: Cpu): void {
                const offset = cpu.readMemory8(cpu.registers.PC + 1);
                cpu.writeMemory8(0xFF00 + <u16>offset, cpu.registers.A);
                cpu.registers.PC += 2;
            }
            break;

        case 0xE1: // POP HL
            execute = function (cpu: Cpu): void {
                cpu.registers.HL = cpu.popStack();
                cpu.registers.PC += 1;
            }
            break;

        case 0xE2: // LD [C], A  => LD [0xFF00+C], A
            execute = function (cpu: Cpu): void {
                cpu.writeMemory8(0xFF00 + <u16>cpu.registers.C, cpu.registers.A);
                cpu.registers.PC += 1;
            }
            break;

        case 0xE3: // [unused]
            execute = function (cpu: Cpu): void { cpu.registers.PC += 1; }
            break;

        case 0xE4: // [unused]
            execute = function (cpu: Cpu): void { cpu.registers.PC += 1; }
            break;

        case 0xE5: // PUSH HL
            execute = function (cpu: Cpu): void {
                cpu.pushStack(cpu.registers.HL);
                cpu.registers.PC += 1;
            }
            break;

        case 0xE6: // AND A, n8
            execute = function (cpu: Cpu): void {
                andA(cpu, cpu.readMemory8(cpu.registers.PC + 1));
                cpu.registers.PC += 2;
            }
            break;

        case 0xE7: // RST 20H
            execute = function (cpu: Cpu): void {
                cpu.pushStack(cpu.registers.PC + 1);
                cpu.registers.PC = 0x0020;
            }
            break;

        case 0xE8: // ADD SP, e8
            execute = function (cpu: Cpu): void {
                const r = cpu.registers;
                const sp: i32 = <i32>r.SP;
                const offset: i32 = <i32><i8>cpu.readMemory8(r.PC + 1);
                const result: i32 = sp + offset;
                r.setFlags(
                    false,
                    false,
                    ((sp & 0x0F) + (offset & 0x0F)) > 0x0F,
                    ((sp & 0xFF) + (offset & 0xFF)) > 0xFF,
                );
                r.SP = <u16>(result & 0xFFFF);
                r.PC += 2;
            }
            break;

        case 0xE9: // JP HL
            execute = function (cpu: Cpu): void {
                cpu.registers.PC = cpu.registers.HL;
            }
            break;

        case 0xEA: // LD [a16], A
            execute = function (cpu: Cpu): void {
                const addr = cpu.readMemory16(cpu.registers.PC + 1);
                cpu.writeMemory8(addr, cpu.registers.A);
                cpu.registers.PC += 3;
            }
            break;

        case 0xEB: // [unused]
            execute = function (cpu: Cpu): void { cpu.registers.PC += 1; }
            break;

        case 0xEC: // [unused]
            execute = function (cpu: Cpu): void { cpu.registers.PC += 1; }
            break;

        case 0xED: // [unused]
            execute = function (cpu: Cpu): void { cpu.registers.PC += 1; }
            break;

        case 0xEE: // XOR A, n8
            execute = function (cpu: Cpu): void {
                xorA(cpu, cpu.readMemory8(cpu.registers.PC + 1));
                cpu.registers.PC += 2;
            }
            break;

        case 0xEF: // RST 28H
            execute = function (cpu: Cpu): void {
                cpu.pushStack(cpu.registers.PC + 1);
                cpu.registers.PC = 0x0028;
            }
            break;


        // =====================================================================
        //  0xFX
        // =====================================================================

        case 0xF0: // LDH A, [a8]  => LD A, [0xFF00+n8]
            execute = function (cpu: Cpu): void {
                const offset = cpu.readMemory8(cpu.registers.PC + 1);
                cpu.registers.A = cpu.readMemory8(0xFF00 + <u16>offset);
                cpu.registers.PC += 2;
            }
            break;

        case 0xF1: // POP AF
            execute = function (cpu: Cpu): void {
                cpu.registers.AF = cpu.popStack();
                cpu.registers.PC += 1;
            }
            break;

        case 0xF2: // LD A, [C]  => LD A, [0xFF00+C]
            execute = function (cpu: Cpu): void {
                cpu.registers.A = cpu.readMemory8(0xFF00 + <u16>cpu.registers.C);
                cpu.registers.PC += 1;
            }
            break;

        case 0xF3: // DI
            execute = function (cpu: Cpu): void {
                cpu.ime = false;
                cpu.registers.PC += 1;
            }
            break;

        case 0xF4: // [unused]
            execute = function (cpu: Cpu): void { cpu.registers.PC += 1; }
            break;

        case 0xF5: // PUSH AF
            execute = function (cpu: Cpu): void {
                cpu.pushStack(cpu.registers.AF);
                cpu.registers.PC += 1;
            }
            break;

        case 0xF6: // OR A, n8
            execute = function (cpu: Cpu): void {
                orA(cpu, cpu.readMemory8(cpu.registers.PC + 1));
                cpu.registers.PC += 2;
            }
            break;

        case 0xF7: // RST 30H
            execute = function (cpu: Cpu): void {
                cpu.pushStack(cpu.registers.PC + 1);
                cpu.registers.PC = 0x0030;
            }
            break;

        case 0xF8: // LD HL, SP+e8
            execute = function (cpu: Cpu): void {
                const r = cpu.registers;
                const sp: i32 = <i32>r.SP;
                const offset: i32 = <i32><i8>cpu.readMemory8(r.PC + 1);
                const result: i32 = sp + offset;
                r.setFlags(
                    false,
                    false,
                    ((sp & 0x0F) + (offset & 0x0F)) > 0x0F,
                    ((sp & 0xFF) + (offset & 0xFF)) > 0xFF,
                );
                r.HL = <u16>(result & 0xFFFF);
                r.PC += 2;
            }
            break;

        case 0xF9: // LD SP, HL
            execute = function (cpu: Cpu): void {
                cpu.registers.SP = cpu.registers.HL;
                cpu.registers.PC += 1;
            }
            break;

        case 0xFA: // LD A, [a16]
            execute = function (cpu: Cpu): void {
                const addr = cpu.readMemory16(cpu.registers.PC + 1);
                cpu.registers.A = cpu.readMemory8(addr);
                cpu.registers.PC += 3;
            }
            break;

        case 0xFB: // EI
            execute = function (cpu: Cpu): void {
                cpu.ime = true;
                cpu.registers.PC += 1;
            }
            break;

        case 0xFC: // [unused]
            execute = function (cpu: Cpu): void { cpu.registers.PC += 1; }
            break;

        case 0xFD: // [unused]
            execute = function (cpu: Cpu): void { cpu.registers.PC += 1; }
            break;

        case 0xFE: // CP A, n8
            execute = function (cpu: Cpu): void {
                cpA(cpu, cpu.readMemory8(cpu.registers.PC + 1));
                cpu.registers.PC += 2;
            }
            break;

        case 0xFF: // RST 38H
            execute = function (cpu: Cpu): void {
                cpu.pushStack(cpu.registers.PC + 1);
                cpu.registers.PC = 0x0038;
            }
            break;


        default:
            throw new Error(`Unknown unprefixed opcode: ${toHex(instruction.opcode)}`);
    }

    return new InstructionActions(execute);
}


// =============================================================================
//  ALU helper functions
// =============================================================================

function addA(cpu: Cpu, val: u8): void {
    const r = cpu.registers;
    const a = r.A;
    const result: u16 = <u16>a + <u16>val;
    r.A = <u8>(result & 0xFF);
    r.setFlags(r.A == 0, false, ((a & 0x0F) + (val & 0x0F)) > 0x0F, result > 0xFF);
}

function adcA(cpu: Cpu, val: u8): void {
    const r = cpu.registers;
    const a = r.A;
    const carry: u8 = r.flagC ? 1 : 0;
    const result: u16 = <u16>a + <u16>val + <u16>carry;
    r.A = <u8>(result & 0xFF);
    r.setFlags(r.A == 0, false, ((a & 0x0F) + (val & 0x0F) + carry) > 0x0F, result > 0xFF);
}

function subA(cpu: Cpu, val: u8): void {
    const r = cpu.registers;
    const a = r.A;
    const result: u8 = a - val;
    r.A = result;
    r.setFlags(result == 0, true, (a & 0x0F) < (val & 0x0F), a < val);
}

function sbcA(cpu: Cpu, val: u8): void {
    const r = cpu.registers;
    const a = r.A;
    const carry: u8 = r.flagC ? 1 : 0;
    const full: i32 = <i32>a - <i32>val - <i32>carry;
    r.A = <u8>(full & 0xFF);
    r.setFlags(r.A == 0, true, (<i32>(a & 0x0F) - <i32>(val & 0x0F) - <i32>carry) < 0, full < 0);
}

function andA(cpu: Cpu, val: u8): void {
    const r = cpu.registers;
    r.A = r.A & val;
    r.setFlags(r.A == 0, false, true, false);
}

function xorA(cpu: Cpu, val: u8): void {
    const r = cpu.registers;
    r.A = r.A ^ val;
    r.setFlags(r.A == 0, false, false, false);
}

function orA(cpu: Cpu, val: u8): void {
    const r = cpu.registers;
    r.A = r.A | val;
    r.setFlags(r.A == 0, false, false, false);
}

function cpA(cpu: Cpu, val: u8): void {
    const r = cpu.registers;
    const a = r.A;
    r.setFlags(a == val, true, (a & 0x0F) < (val & 0x0F), a < val);
}
