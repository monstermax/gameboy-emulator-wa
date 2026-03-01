
import { CpuInstrution, InstructionActions } from "./CpuInstrution";

import { Cpu } from "../cpu";
import { toHex } from "../lib/lib_numbers";



export function loadInstructionActions(instruction: CpuInstrution): InstructionActions {
    let fetchData: (cpu: Cpu) => Uint8Array = () => new Uint8Array(0);
    let execute: (cpu: Cpu) => void = () => {};

    switch (instruction.opcode) {
        // === 0x0X ===
        case 0x00: // NOP
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x01: // LD BC, n16
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x02: // LD [BC], A
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x03: // INC BC
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x04: // INC B
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x05: // DEC B
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x06: // LD B, n8
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x07: // RLCA
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x08: // LD [a16], SP
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x09: // ADD HL, BC
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x0A: // LD A, [BC]
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x0B: // DEC BC
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x0C: // INC C
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x0D: // DEC C
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x0E: // LD C, n8
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x0F: // RRCA
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        // === 0x1X ===
        case 0x10: // STOP n8
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x11: // LD DE, n16
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x12: // LD [DE], A
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x13: // INC DE
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x14: // INC D
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x15: // DEC D
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x16: // LD D, n8
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x17: // RLA
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x18: // JR e8
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x19: // ADD HL, DE
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x1A: // LD A, [DE]
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x1B: // DEC DE
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x1C: // INC E
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x1D: // DEC E
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x1E: // LD E, n8
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x1F: // RRA
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        // === 0x2X ===
        case 0x20: // JR NZ, e8
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x21: // LD HL, n16
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x22: // LD [HL+], A
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x23: // INC HL
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x24: // INC H
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x25: // DEC H
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x26: // LD H, n8
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x27: // DAA
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x28: // JR Z, e8
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x29: // ADD HL, HL
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x2A: // LD A, [HL+]
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x2B: // DEC HL
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x2C: // INC L
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x2D: // DEC L
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x2E: // LD L, n8
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x2F: // CPL
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        // === 0x3X ===
        case 0x30: // JR NC, e8
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x31: // LD SP, n16
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x32: // LD [HL-], A
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x33: // INC SP
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x34: // INC [HL]
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x35: // DEC [HL]
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x36: // LD [HL], n8
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x37: // SCF
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x38: // JR C, e8
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x39: // ADD HL, SP
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x3A: // LD A, [HL-]
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x3B: // DEC SP
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x3C: // INC A
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x3D: // DEC A
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x3E: // LD A, n8
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x3F: // CCF
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        // === 0x4X === LD B/C, r8
        case 0x40: // LD B, B
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x41: // LD B, C
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x42: // LD B, D
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x43: // LD B, E
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x44: // LD B, H
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x45: // LD B, L
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x46: // LD B, [HL]
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x47: // LD B, A
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x48: // LD C, B
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x49: // LD C, C
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x4A: // LD C, D
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x4B: // LD C, E
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x4C: // LD C, H
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x4D: // LD C, L
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x4E: // LD C, [HL]
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x4F: // LD C, A
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        // === 0x5X === LD D/E, r8
        case 0x50: // LD D, B
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x51: // LD D, C
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x52: // LD D, D
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x53: // LD D, E
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x54: // LD D, H
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x55: // LD D, L
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x56: // LD D, [HL]
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x57: // LD D, A
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x58: // LD E, B
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x59: // LD E, C
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x5A: // LD E, D
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x5B: // LD E, E
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x5C: // LD E, H
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x5D: // LD E, L
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x5E: // LD E, [HL]
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x5F: // LD E, A
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        // === 0x6X === LD H/L, r8
        case 0x60: // LD H, B
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x61: // LD H, C
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x62: // LD H, D
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x63: // LD H, E
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x64: // LD H, H
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x65: // LD H, L
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x66: // LD H, [HL]
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x67: // LD H, A
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x68: // LD L, B
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x69: // LD L, C
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x6A: // LD L, D
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x6B: // LD L, E
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x6C: // LD L, H
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x6D: // LD L, L
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x6E: // LD L, [HL]
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x6F: // LD L, A
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        // === 0x7X === LD [HL]/A, r8
        case 0x70: // LD [HL], B
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x71: // LD [HL], C
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x72: // LD [HL], D
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x73: // LD [HL], E
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x74: // LD [HL], H
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x75: // LD [HL], L
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x76: // HALT
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x77: // LD [HL], A
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x78: // LD A, B
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x79: // LD A, C
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x7A: // LD A, D
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x7B: // LD A, E
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x7C: // LD A, H
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x7D: // LD A, L
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x7E: // LD A, [HL]
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x7F: // LD A, A
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        // === 0x8X === ADD/ADC A, r8
        case 0x80: // ADD A, B
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x81: // ADD A, C
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x82: // ADD A, D
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x83: // ADD A, E
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x84: // ADD A, H
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x85: // ADD A, L
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x86: // ADD A, [HL]
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x87: // ADD A, A
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x88: // ADC A, B
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x89: // ADC A, C
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x8A: // ADC A, D
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x8B: // ADC A, E
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x8C: // ADC A, H
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x8D: // ADC A, L
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x8E: // ADC A, [HL]
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x8F: // ADC A, A
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        // === 0x9X === SUB/SBC A, r8
        case 0x90: // SUB A, B
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x91: // SUB A, C
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x92: // SUB A, D
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x93: // SUB A, E
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x94: // SUB A, H
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x95: // SUB A, L
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x96: // SUB A, [HL]
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x97: // SUB A, A
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x98: // SBC A, B
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x99: // SBC A, C
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x9A: // SBC A, D
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x9B: // SBC A, E
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x9C: // SBC A, H
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x9D: // SBC A, L
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x9E: // SBC A, [HL]
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0x9F: // SBC A, A
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        // === 0xAX === AND/XOR A, r8
        case 0xA0: // AND A, B
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xA1: // AND A, C
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xA2: // AND A, D
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xA3: // AND A, E
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xA4: // AND A, H
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xA5: // AND A, L
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xA6: // AND A, [HL]
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xA7: // AND A, A
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xA8: // XOR A, B
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xA9: // XOR A, C
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xAA: // XOR A, D
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xAB: // XOR A, E
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xAC: // XOR A, H
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xAD: // XOR A, L
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xAE: // XOR A, [HL]
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xAF: // XOR A, A
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        // === 0xBX === OR/CP A, r8
        case 0xB0: // OR A, B
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xB1: // OR A, C
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xB2: // OR A, D
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xB3: // OR A, E
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xB4: // OR A, H
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xB5: // OR A, L
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xB6: // OR A, [HL]
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xB7: // OR A, A
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xB8: // CP A, B
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xB9: // CP A, C
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xBA: // CP A, D
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xBB: // CP A, E
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xBC: // CP A, H
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xBD: // CP A, L
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xBE: // CP A, [HL]
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xBF: // CP A, A
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        // === 0xCX === Control / Misc
        case 0xC0: // RET NZ
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xC1: // POP BC
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xC2: // JP NZ, a16
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xC3: // JP a16
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xC4: // CALL NZ, a16
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xC5: // PUSH BC
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xC6: // ADD A, n8
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xC7: // RST $00
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xC8: // RET Z
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xC9: // RET
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xCA: // JP Z, a16
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xCB: // PREFIX
            execute = function (cpu: Cpu) {
                cpu.currentInstructionUsePrefix = true;
                cpu.registers.PC += 1;
            }
            break;

        case 0xCC: // CALL Z, a16
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xCD: // CALL a16
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xCE: // ADC A, n8
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xCF: // RST $08
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        // === 0xDX ===
        case 0xD0: // RET NC
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xD1: // POP DE
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xD2: // JP NC, a16
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xD3: // ILLEGAL_D3
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xD4: // CALL NC, a16
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xD5: // PUSH DE
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xD6: // SUB A, n8
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xD7: // RST $10
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xD8: // RET C
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xD9: // RETI
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xDA: // JP C, a16
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xDB: // ILLEGAL_DB
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xDC: // CALL C, a16
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xDD: // ILLEGAL_DD
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xDE: // SBC A, n8
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xDF: // RST $18
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        // === 0xEX ===
        case 0xE0: // LDH [a8], A
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xE1: // POP HL
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xE2: // LDH [C], A
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xE3: // ILLEGAL_E3
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xE4: // ILLEGAL_E4
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xE5: // PUSH HL
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xE6: // AND A, n8
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xE7: // RST $20
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xE8: // ADD SP, e8
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xE9: // JP HL
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xEA: // LD [a16], A
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xEB: // ILLEGAL_EB
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xEC: // ILLEGAL_EC
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xED: // ILLEGAL_ED
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xEE: // XOR A, n8
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xEF: // RST $28
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        // === 0xFX ===
        case 0xF0: // LDH A, [a8]
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xF1: // POP AF
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xF2: // LDH A, [C]
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xF3: // DI
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xF4: // ILLEGAL_F4
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xF5: // PUSH AF
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xF6: // OR A, n8
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xF7: // RST $30
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xF8: // LD HL, SP+e8
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xF9: // LD SP, HL
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xFA: // LD A, [a16]
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xFB: // EI
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xFC: // ILLEGAL_FC
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xFD: // ILLEGAL_FD
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xFE: // CP A, n8
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        case 0xFF: // RST $38
            execute = function (cpu: Cpu) {
                cpu.registers.PC += cpu.instruction.bytes;
            }
            break;

        default:
            throw new Error(`Instruction "${toHex(instruction.opcode)}" not found`);
            break;
    }

    const actions: InstructionActions = new InstructionActions(fetchData, execute);
    return actions
}

