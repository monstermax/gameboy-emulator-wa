// Gameboy Emulator - CPU Instructions - CB Prefixed 0x80-0xFF

// RES b, r8 (0x80-0xBF) and SET b, r8 (0xC0-0xFF)
//
// Register order per group of 8: B, C, D, E, H, L, [HL], A

import { CpuInstrution, InstructionActions } from "./CpuInstrution";
import { Cpu } from "./Cpu";
import { toHex } from "../lib/lib_numbers";


export function loadPrefixedInstructionActions_0x80_0xFF(instruction: CpuInstrution): InstructionActions {
    let execute: (cpu: Cpu) => void;

    switch (instruction.opcode) {

        // =====================================================================
        //  RES 0, r8 (0x80-0x87)
        // =====================================================================
        case 0x80: execute = function (cpu: Cpu): void { cpu.registers.B = cpu.registers.B & ~(1 << 0); cpu.registers.PC += 1; }; break;
        case 0x81: execute = function (cpu: Cpu): void { cpu.registers.C = cpu.registers.C & ~(1 << 0); cpu.registers.PC += 1; }; break;
        case 0x82: execute = function (cpu: Cpu): void { cpu.registers.D = cpu.registers.D & ~(1 << 0); cpu.registers.PC += 1; }; break;
        case 0x83: execute = function (cpu: Cpu): void { cpu.registers.E = cpu.registers.E & ~(1 << 0); cpu.registers.PC += 1; }; break;
        case 0x84: execute = function (cpu: Cpu): void { cpu.registers.H = cpu.registers.H & ~(1 << 0); cpu.registers.PC += 1; }; break;
        case 0x85: execute = function (cpu: Cpu): void { cpu.registers.L = cpu.registers.L & ~(1 << 0); cpu.registers.PC += 1; }; break;
        case 0x86: execute = function (cpu: Cpu): void { cpu.writeMemory8(cpu.registers.HL, cpu.readMemory8(cpu.registers.HL) & ~(1 << 0)); cpu.registers.PC += 1; }; break;
        case 0x87: execute = function (cpu: Cpu): void { cpu.registers.A = cpu.registers.A & ~(1 << 0); cpu.registers.PC += 1; }; break;

        // =====================================================================
        //  RES 1, r8 (0x88-0x8F)
        // =====================================================================
        case 0x88: execute = function (cpu: Cpu): void { cpu.registers.B = cpu.registers.B & ~(1 << 1); cpu.registers.PC += 1; }; break;
        case 0x89: execute = function (cpu: Cpu): void { cpu.registers.C = cpu.registers.C & ~(1 << 1); cpu.registers.PC += 1; }; break;
        case 0x8A: execute = function (cpu: Cpu): void { cpu.registers.D = cpu.registers.D & ~(1 << 1); cpu.registers.PC += 1; }; break;
        case 0x8B: execute = function (cpu: Cpu): void { cpu.registers.E = cpu.registers.E & ~(1 << 1); cpu.registers.PC += 1; }; break;
        case 0x8C: execute = function (cpu: Cpu): void { cpu.registers.H = cpu.registers.H & ~(1 << 1); cpu.registers.PC += 1; }; break;
        case 0x8D: execute = function (cpu: Cpu): void { cpu.registers.L = cpu.registers.L & ~(1 << 1); cpu.registers.PC += 1; }; break;
        case 0x8E: execute = function (cpu: Cpu): void { cpu.writeMemory8(cpu.registers.HL, cpu.readMemory8(cpu.registers.HL) & ~(1 << 1)); cpu.registers.PC += 1; }; break;
        case 0x8F: execute = function (cpu: Cpu): void { cpu.registers.A = cpu.registers.A & ~(1 << 1); cpu.registers.PC += 1; }; break;

        // =====================================================================
        //  RES 2, r8 (0x90-0x97)
        // =====================================================================
        case 0x90: execute = function (cpu: Cpu): void { cpu.registers.B = cpu.registers.B & ~(1 << 2); cpu.registers.PC += 1; }; break;
        case 0x91: execute = function (cpu: Cpu): void { cpu.registers.C = cpu.registers.C & ~(1 << 2); cpu.registers.PC += 1; }; break;
        case 0x92: execute = function (cpu: Cpu): void { cpu.registers.D = cpu.registers.D & ~(1 << 2); cpu.registers.PC += 1; }; break;
        case 0x93: execute = function (cpu: Cpu): void { cpu.registers.E = cpu.registers.E & ~(1 << 2); cpu.registers.PC += 1; }; break;
        case 0x94: execute = function (cpu: Cpu): void { cpu.registers.H = cpu.registers.H & ~(1 << 2); cpu.registers.PC += 1; }; break;
        case 0x95: execute = function (cpu: Cpu): void { cpu.registers.L = cpu.registers.L & ~(1 << 2); cpu.registers.PC += 1; }; break;
        case 0x96: execute = function (cpu: Cpu): void { cpu.writeMemory8(cpu.registers.HL, cpu.readMemory8(cpu.registers.HL) & ~(1 << 2)); cpu.registers.PC += 1; }; break;
        case 0x97: execute = function (cpu: Cpu): void { cpu.registers.A = cpu.registers.A & ~(1 << 2); cpu.registers.PC += 1; }; break;

        // =====================================================================
        //  RES 3, r8 (0x98-0x9F)
        // =====================================================================
        case 0x98: execute = function (cpu: Cpu): void { cpu.registers.B = cpu.registers.B & ~(1 << 3); cpu.registers.PC += 1; }; break;
        case 0x99: execute = function (cpu: Cpu): void { cpu.registers.C = cpu.registers.C & ~(1 << 3); cpu.registers.PC += 1; }; break;
        case 0x9A: execute = function (cpu: Cpu): void { cpu.registers.D = cpu.registers.D & ~(1 << 3); cpu.registers.PC += 1; }; break;
        case 0x9B: execute = function (cpu: Cpu): void { cpu.registers.E = cpu.registers.E & ~(1 << 3); cpu.registers.PC += 1; }; break;
        case 0x9C: execute = function (cpu: Cpu): void { cpu.registers.H = cpu.registers.H & ~(1 << 3); cpu.registers.PC += 1; }; break;
        case 0x9D: execute = function (cpu: Cpu): void { cpu.registers.L = cpu.registers.L & ~(1 << 3); cpu.registers.PC += 1; }; break;
        case 0x9E: execute = function (cpu: Cpu): void { cpu.writeMemory8(cpu.registers.HL, cpu.readMemory8(cpu.registers.HL) & ~(1 << 3)); cpu.registers.PC += 1; }; break;
        case 0x9F: execute = function (cpu: Cpu): void { cpu.registers.A = cpu.registers.A & ~(1 << 3); cpu.registers.PC += 1; }; break;

        // =====================================================================
        //  RES 4, r8 (0xA0-0xA7)
        // =====================================================================
        case 0xA0: execute = function (cpu: Cpu): void { cpu.registers.B = cpu.registers.B & ~(1 << 4); cpu.registers.PC += 1; }; break;
        case 0xA1: execute = function (cpu: Cpu): void { cpu.registers.C = cpu.registers.C & ~(1 << 4); cpu.registers.PC += 1; }; break;
        case 0xA2: execute = function (cpu: Cpu): void { cpu.registers.D = cpu.registers.D & ~(1 << 4); cpu.registers.PC += 1; }; break;
        case 0xA3: execute = function (cpu: Cpu): void { cpu.registers.E = cpu.registers.E & ~(1 << 4); cpu.registers.PC += 1; }; break;
        case 0xA4: execute = function (cpu: Cpu): void { cpu.registers.H = cpu.registers.H & ~(1 << 4); cpu.registers.PC += 1; }; break;
        case 0xA5: execute = function (cpu: Cpu): void { cpu.registers.L = cpu.registers.L & ~(1 << 4); cpu.registers.PC += 1; }; break;
        case 0xA6: execute = function (cpu: Cpu): void { cpu.writeMemory8(cpu.registers.HL, cpu.readMemory8(cpu.registers.HL) & ~(1 << 4)); cpu.registers.PC += 1; }; break;
        case 0xA7: execute = function (cpu: Cpu): void { cpu.registers.A = cpu.registers.A & ~(1 << 4); cpu.registers.PC += 1; }; break;

        // =====================================================================
        //  RES 5, r8 (0xA8-0xAF)
        // =====================================================================
        case 0xA8: execute = function (cpu: Cpu): void { cpu.registers.B = cpu.registers.B & ~(1 << 5); cpu.registers.PC += 1; }; break;
        case 0xA9: execute = function (cpu: Cpu): void { cpu.registers.C = cpu.registers.C & ~(1 << 5); cpu.registers.PC += 1; }; break;
        case 0xAA: execute = function (cpu: Cpu): void { cpu.registers.D = cpu.registers.D & ~(1 << 5); cpu.registers.PC += 1; }; break;
        case 0xAB: execute = function (cpu: Cpu): void { cpu.registers.E = cpu.registers.E & ~(1 << 5); cpu.registers.PC += 1; }; break;
        case 0xAC: execute = function (cpu: Cpu): void { cpu.registers.H = cpu.registers.H & ~(1 << 5); cpu.registers.PC += 1; }; break;
        case 0xAD: execute = function (cpu: Cpu): void { cpu.registers.L = cpu.registers.L & ~(1 << 5); cpu.registers.PC += 1; }; break;
        case 0xAE: execute = function (cpu: Cpu): void { cpu.writeMemory8(cpu.registers.HL, cpu.readMemory8(cpu.registers.HL) & ~(1 << 5)); cpu.registers.PC += 1; }; break;
        case 0xAF: execute = function (cpu: Cpu): void { cpu.registers.A = cpu.registers.A & ~(1 << 5); cpu.registers.PC += 1; }; break;

        // =====================================================================
        //  RES 6, r8 (0xB0-0xB7)
        // =====================================================================
        case 0xB0: execute = function (cpu: Cpu): void { cpu.registers.B = cpu.registers.B & ~(1 << 6); cpu.registers.PC += 1; }; break;
        case 0xB1: execute = function (cpu: Cpu): void { cpu.registers.C = cpu.registers.C & ~(1 << 6); cpu.registers.PC += 1; }; break;
        case 0xB2: execute = function (cpu: Cpu): void { cpu.registers.D = cpu.registers.D & ~(1 << 6); cpu.registers.PC += 1; }; break;
        case 0xB3: execute = function (cpu: Cpu): void { cpu.registers.E = cpu.registers.E & ~(1 << 6); cpu.registers.PC += 1; }; break;
        case 0xB4: execute = function (cpu: Cpu): void { cpu.registers.H = cpu.registers.H & ~(1 << 6); cpu.registers.PC += 1; }; break;
        case 0xB5: execute = function (cpu: Cpu): void { cpu.registers.L = cpu.registers.L & ~(1 << 6); cpu.registers.PC += 1; }; break;
        case 0xB6: execute = function (cpu: Cpu): void { cpu.writeMemory8(cpu.registers.HL, cpu.readMemory8(cpu.registers.HL) & ~(1 << 6)); cpu.registers.PC += 1; }; break;
        case 0xB7: execute = function (cpu: Cpu): void { cpu.registers.A = cpu.registers.A & ~(1 << 6); cpu.registers.PC += 1; }; break;

        // =====================================================================
        //  RES 7, r8 (0xB8-0xBF)
        // =====================================================================
        case 0xB8: execute = function (cpu: Cpu): void { cpu.registers.B = cpu.registers.B & ~(1 << 7); cpu.registers.PC += 1; }; break;
        case 0xB9: execute = function (cpu: Cpu): void { cpu.registers.C = cpu.registers.C & ~(1 << 7); cpu.registers.PC += 1; }; break;
        case 0xBA: execute = function (cpu: Cpu): void { cpu.registers.D = cpu.registers.D & ~(1 << 7); cpu.registers.PC += 1; }; break;
        case 0xBB: execute = function (cpu: Cpu): void { cpu.registers.E = cpu.registers.E & ~(1 << 7); cpu.registers.PC += 1; }; break;
        case 0xBC: execute = function (cpu: Cpu): void { cpu.registers.H = cpu.registers.H & ~(1 << 7); cpu.registers.PC += 1; }; break;
        case 0xBD: execute = function (cpu: Cpu): void { cpu.registers.L = cpu.registers.L & ~(1 << 7); cpu.registers.PC += 1; }; break;
        case 0xBE: execute = function (cpu: Cpu): void { cpu.writeMemory8(cpu.registers.HL, cpu.readMemory8(cpu.registers.HL) & ~(1 << 7)); cpu.registers.PC += 1; }; break;
        case 0xBF: execute = function (cpu: Cpu): void { cpu.registers.A = cpu.registers.A & ~(1 << 7); cpu.registers.PC += 1; }; break;


        // =====================================================================
        //  SET 0, r8 (0xC0-0xC7)
        // =====================================================================
        case 0xC0: execute = function (cpu: Cpu): void { cpu.registers.B = cpu.registers.B | (1 << 0); cpu.registers.PC += 1; }; break;
        case 0xC1: execute = function (cpu: Cpu): void { cpu.registers.C = cpu.registers.C | (1 << 0); cpu.registers.PC += 1; }; break;
        case 0xC2: execute = function (cpu: Cpu): void { cpu.registers.D = cpu.registers.D | (1 << 0); cpu.registers.PC += 1; }; break;
        case 0xC3: execute = function (cpu: Cpu): void { cpu.registers.E = cpu.registers.E | (1 << 0); cpu.registers.PC += 1; }; break;
        case 0xC4: execute = function (cpu: Cpu): void { cpu.registers.H = cpu.registers.H | (1 << 0); cpu.registers.PC += 1; }; break;
        case 0xC5: execute = function (cpu: Cpu): void { cpu.registers.L = cpu.registers.L | (1 << 0); cpu.registers.PC += 1; }; break;
        case 0xC6: execute = function (cpu: Cpu): void { cpu.writeMemory8(cpu.registers.HL, cpu.readMemory8(cpu.registers.HL) | (1 << 0)); cpu.registers.PC += 1; }; break;
        case 0xC7: execute = function (cpu: Cpu): void { cpu.registers.A = cpu.registers.A | (1 << 0); cpu.registers.PC += 1; }; break;

        // =====================================================================
        //  SET 1, r8 (0xC8-0xCF)
        // =====================================================================
        case 0xC8: execute = function (cpu: Cpu): void { cpu.registers.B = cpu.registers.B | (1 << 1); cpu.registers.PC += 1; }; break;
        case 0xC9: execute = function (cpu: Cpu): void { cpu.registers.C = cpu.registers.C | (1 << 1); cpu.registers.PC += 1; }; break;
        case 0xCA: execute = function (cpu: Cpu): void { cpu.registers.D = cpu.registers.D | (1 << 1); cpu.registers.PC += 1; }; break;
        case 0xCB: execute = function (cpu: Cpu): void { cpu.registers.E = cpu.registers.E | (1 << 1); cpu.registers.PC += 1; }; break;
        case 0xCC: execute = function (cpu: Cpu): void { cpu.registers.H = cpu.registers.H | (1 << 1); cpu.registers.PC += 1; }; break;
        case 0xCD: execute = function (cpu: Cpu): void { cpu.registers.L = cpu.registers.L | (1 << 1); cpu.registers.PC += 1; }; break;
        case 0xCE: execute = function (cpu: Cpu): void { cpu.writeMemory8(cpu.registers.HL, cpu.readMemory8(cpu.registers.HL) | (1 << 1)); cpu.registers.PC += 1; }; break;
        case 0xCF: execute = function (cpu: Cpu): void { cpu.registers.A = cpu.registers.A | (1 << 1); cpu.registers.PC += 1; }; break;

        // =====================================================================
        //  SET 2, r8 (0xD0-0xD7)
        // =====================================================================
        case 0xD0: execute = function (cpu: Cpu): void { cpu.registers.B = cpu.registers.B | (1 << 2); cpu.registers.PC += 1; }; break;
        case 0xD1: execute = function (cpu: Cpu): void { cpu.registers.C = cpu.registers.C | (1 << 2); cpu.registers.PC += 1; }; break;
        case 0xD2: execute = function (cpu: Cpu): void { cpu.registers.D = cpu.registers.D | (1 << 2); cpu.registers.PC += 1; }; break;
        case 0xD3: execute = function (cpu: Cpu): void { cpu.registers.E = cpu.registers.E | (1 << 2); cpu.registers.PC += 1; }; break;
        case 0xD4: execute = function (cpu: Cpu): void { cpu.registers.H = cpu.registers.H | (1 << 2); cpu.registers.PC += 1; }; break;
        case 0xD5: execute = function (cpu: Cpu): void { cpu.registers.L = cpu.registers.L | (1 << 2); cpu.registers.PC += 1; }; break;
        case 0xD6: execute = function (cpu: Cpu): void { cpu.writeMemory8(cpu.registers.HL, cpu.readMemory8(cpu.registers.HL) | (1 << 2)); cpu.registers.PC += 1; }; break;
        case 0xD7: execute = function (cpu: Cpu): void { cpu.registers.A = cpu.registers.A | (1 << 2); cpu.registers.PC += 1; }; break;

        // =====================================================================
        //  SET 3, r8 (0xD8-0xDF)
        // =====================================================================
        case 0xD8: execute = function (cpu: Cpu): void { cpu.registers.B = cpu.registers.B | (1 << 3); cpu.registers.PC += 1; }; break;
        case 0xD9: execute = function (cpu: Cpu): void { cpu.registers.C = cpu.registers.C | (1 << 3); cpu.registers.PC += 1; }; break;
        case 0xDA: execute = function (cpu: Cpu): void { cpu.registers.D = cpu.registers.D | (1 << 3); cpu.registers.PC += 1; }; break;
        case 0xDB: execute = function (cpu: Cpu): void { cpu.registers.E = cpu.registers.E | (1 << 3); cpu.registers.PC += 1; }; break;
        case 0xDC: execute = function (cpu: Cpu): void { cpu.registers.H = cpu.registers.H | (1 << 3); cpu.registers.PC += 1; }; break;
        case 0xDD: execute = function (cpu: Cpu): void { cpu.registers.L = cpu.registers.L | (1 << 3); cpu.registers.PC += 1; }; break;
        case 0xDE: execute = function (cpu: Cpu): void { cpu.writeMemory8(cpu.registers.HL, cpu.readMemory8(cpu.registers.HL) | (1 << 3)); cpu.registers.PC += 1; }; break;
        case 0xDF: execute = function (cpu: Cpu): void { cpu.registers.A = cpu.registers.A | (1 << 3); cpu.registers.PC += 1; }; break;

        // =====================================================================
        //  SET 4, r8 (0xE0-0xE7)
        // =====================================================================
        case 0xE0: execute = function (cpu: Cpu): void { cpu.registers.B = cpu.registers.B | (1 << 4); cpu.registers.PC += 1; }; break;
        case 0xE1: execute = function (cpu: Cpu): void { cpu.registers.C = cpu.registers.C | (1 << 4); cpu.registers.PC += 1; }; break;
        case 0xE2: execute = function (cpu: Cpu): void { cpu.registers.D = cpu.registers.D | (1 << 4); cpu.registers.PC += 1; }; break;
        case 0xE3: execute = function (cpu: Cpu): void { cpu.registers.E = cpu.registers.E | (1 << 4); cpu.registers.PC += 1; }; break;
        case 0xE4: execute = function (cpu: Cpu): void { cpu.registers.H = cpu.registers.H | (1 << 4); cpu.registers.PC += 1; }; break;
        case 0xE5: execute = function (cpu: Cpu): void { cpu.registers.L = cpu.registers.L | (1 << 4); cpu.registers.PC += 1; }; break;
        case 0xE6: execute = function (cpu: Cpu): void { cpu.writeMemory8(cpu.registers.HL, cpu.readMemory8(cpu.registers.HL) | (1 << 4)); cpu.registers.PC += 1; }; break;
        case 0xE7: execute = function (cpu: Cpu): void { cpu.registers.A = cpu.registers.A | (1 << 4); cpu.registers.PC += 1; }; break;

        // =====================================================================
        //  SET 5, r8 (0xE8-0xEF)
        // =====================================================================
        case 0xE8: execute = function (cpu: Cpu): void { cpu.registers.B = cpu.registers.B | (1 << 5); cpu.registers.PC += 1; }; break;
        case 0xE9: execute = function (cpu: Cpu): void { cpu.registers.C = cpu.registers.C | (1 << 5); cpu.registers.PC += 1; }; break;
        case 0xEA: execute = function (cpu: Cpu): void { cpu.registers.D = cpu.registers.D | (1 << 5); cpu.registers.PC += 1; }; break;
        case 0xEB: execute = function (cpu: Cpu): void { cpu.registers.E = cpu.registers.E | (1 << 5); cpu.registers.PC += 1; }; break;
        case 0xEC: execute = function (cpu: Cpu): void { cpu.registers.H = cpu.registers.H | (1 << 5); cpu.registers.PC += 1; }; break;
        case 0xED: execute = function (cpu: Cpu): void { cpu.registers.L = cpu.registers.L | (1 << 5); cpu.registers.PC += 1; }; break;
        case 0xEE: execute = function (cpu: Cpu): void { cpu.writeMemory8(cpu.registers.HL, cpu.readMemory8(cpu.registers.HL) | (1 << 5)); cpu.registers.PC += 1; }; break;
        case 0xEF: execute = function (cpu: Cpu): void { cpu.registers.A = cpu.registers.A | (1 << 5); cpu.registers.PC += 1; }; break;

        // =====================================================================
        //  SET 6, r8 (0xF0-0xF7)
        // =====================================================================
        case 0xF0: execute = function (cpu: Cpu): void { cpu.registers.B = cpu.registers.B | (1 << 6); cpu.registers.PC += 1; }; break;
        case 0xF1: execute = function (cpu: Cpu): void { cpu.registers.C = cpu.registers.C | (1 << 6); cpu.registers.PC += 1; }; break;
        case 0xF2: execute = function (cpu: Cpu): void { cpu.registers.D = cpu.registers.D | (1 << 6); cpu.registers.PC += 1; }; break;
        case 0xF3: execute = function (cpu: Cpu): void { cpu.registers.E = cpu.registers.E | (1 << 6); cpu.registers.PC += 1; }; break;
        case 0xF4: execute = function (cpu: Cpu): void { cpu.registers.H = cpu.registers.H | (1 << 6); cpu.registers.PC += 1; }; break;
        case 0xF5: execute = function (cpu: Cpu): void { cpu.registers.L = cpu.registers.L | (1 << 6); cpu.registers.PC += 1; }; break;
        case 0xF6: execute = function (cpu: Cpu): void { cpu.writeMemory8(cpu.registers.HL, cpu.readMemory8(cpu.registers.HL) | (1 << 6)); cpu.registers.PC += 1; }; break;
        case 0xF7: execute = function (cpu: Cpu): void { cpu.registers.A = cpu.registers.A | (1 << 6); cpu.registers.PC += 1; }; break;

        // =====================================================================
        //  SET 7, r8 (0xF8-0xFF)
        // =====================================================================
        case 0xF8: execute = function (cpu: Cpu): void { cpu.registers.B = cpu.registers.B | (1 << 7); cpu.registers.PC += 1; }; break;
        case 0xF9: execute = function (cpu: Cpu): void { cpu.registers.C = cpu.registers.C | (1 << 7); cpu.registers.PC += 1; }; break;
        case 0xFA: execute = function (cpu: Cpu): void { cpu.registers.D = cpu.registers.D | (1 << 7); cpu.registers.PC += 1; }; break;
        case 0xFB: execute = function (cpu: Cpu): void { cpu.registers.E = cpu.registers.E | (1 << 7); cpu.registers.PC += 1; }; break;
        case 0xFC: execute = function (cpu: Cpu): void { cpu.registers.H = cpu.registers.H | (1 << 7); cpu.registers.PC += 1; }; break;
        case 0xFD: execute = function (cpu: Cpu): void { cpu.registers.L = cpu.registers.L | (1 << 7); cpu.registers.PC += 1; }; break;
        case 0xFE: execute = function (cpu: Cpu): void { cpu.writeMemory8(cpu.registers.HL, cpu.readMemory8(cpu.registers.HL) | (1 << 7)); cpu.registers.PC += 1; }; break;
        case 0xFF: execute = function (cpu: Cpu): void { cpu.registers.A = cpu.registers.A | (1 << 7); cpu.registers.PC += 1; }; break;


        default:
            throw new Error(`Unknown CB-prefixed opcode: ${toHex(instruction.opcode)}`);
    }

    return new InstructionActions(execute);
}
