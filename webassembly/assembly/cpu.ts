import { Computer } from "./Computer";
import { Operand } from "./cpu_instructions.types";
import { high16, low16, toHex } from "./lib/lib_numbers";
import { asserts } from "./utils";


// Gameboy Emulator


const registers8 = [
    'A', 'B', 'C', 'D', // Data 8-bit Registers
    'H', 'L',           // Data 8-bit Registers
    'F',                // Flags 8-bit Register ( bit7 = z = Zero flag | bit6 = n = Subtraction flag | bit5 = h = Half Carry flag | bit4 = c = Carry flag)
];

const registers16 = [
    'SP', 'PC', // Control 16-bit Registers
    'AF', 'BC', 'DE', 'HL', // 16-bit combined registers (each one is 2x 8-bit registers)
];



class CpuInstrution {
    public cpu: Cpu;
    public opcode: u8 = 0;
    public prefixedOpcode: u8 = 0;
    public bytes: u16 = 0;
    public cycles: i32[] = [];
    public prefixedInstruction: boolean = false;
    public mnemonic: string = '';
    public operands: Operand[] = [];


    constructor(cpu: Cpu, opcode: u8, prefixedInstruction: boolean = false, skipLoad: boolean = false) {
        this.cpu = cpu;

        this.opcode = opcode;
        this.prefixedInstruction = prefixedInstruction;

        const hexOpcode = toHex(opcode);

        const instructionsSet = this.cpu.computer.instructionsSet;

        if (skipLoad || !instructionsSet) {
            // instructionsSet not yet loaded

        } else {
            const instructionKnown = prefixedInstruction
                ? instructionsSet.cbprefixed.has(hexOpcode)
                : instructionsSet.unprefixed.has(hexOpcode);

            if (!instructionKnown) {
                throw new Error(`Ìnstruction "${hexOpcode}" (cb-prefixed=${prefixedInstruction ? "Y" : "N"}) not found`);
            }

            const instruction = prefixedInstruction
                ? instructionsSet.cbprefixed.get(hexOpcode)
                : instructionsSet.unprefixed.get(hexOpcode);

            if (! instruction) {
                throw new Error(`Ìnstruction "${hexOpcode}" (cb-prefixed=${prefixedInstruction ? "Y" : "N"}) not found in instructionsSet`);
            }

            this.mnemonic = instruction.mnemonic;
            this.bytes = instruction.bytes as u16;
            this.cycles = instruction.cycles;
            this.operands = instruction.operands;
        }
    }
}


class InstructionActions {
    public fetchData: (cpu: Cpu) => Uint8Array;
    public execute: (cpu: Cpu) => void;

    constructor(fetchData: (cpu: Cpu) => Uint8Array, execute: (cpu: Cpu) => void) {
        this.fetchData = fetchData;
        this.execute = execute;
    }
}


export class Cpu {
    public computer: Computer;
    public registers: CpuRegisters = new CpuRegisters;

    private instruction: CpuInstrution = new CpuInstrution(this, 0, false, true);
    private actions: InstructionActions = new InstructionActions(() => new Uint8Array(0), () => {});
    private fetchedData: Uint8Array = new Uint8Array(0);
    private currentInstructionUsePrefix: boolean = false;


    constructor(computer: Computer) {
        this.computer = computer
    }


    runCycle(): void {
        this.fetchInstruction();
        this.fetchInstructionData();
        this.executeInstruction();
    }


    fetchInstruction(): void {
        const PC = this.registers.PC;
        console.log(`[CPU] Current address : ${toHex(this.registers.PC, 4)}`)

        const instructionCode = this.readMemory8(PC);

        console.log(`[CPU] Current opcode : ${toHex(instructionCode)}`)

        const instructionsSet = this.computer.instructionsSet;
        this.instruction = new CpuInstrution(this, instructionCode, this.currentInstructionUsePrefix)

        if (this.currentInstructionUsePrefix) {
            this.loadPrefixedInstructionActions()

        } else {
            this.loadInstructionActions()
        }
    }



    loadInstructionActions(): void {
        let fetchData: (cpu: Cpu) => Uint8Array = () => new Uint8Array(0);
        let execute: (cpu: Cpu) => void = () => {};

        switch (this.instruction.opcode) {
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
                throw new Error(`Instruction "${toHex(this.instruction.opcode)}" not found`);
                break;
        }

        this.actions.fetchData = fetchData;
        this.actions.execute = execute;
    }


    loadPrefixedInstructionActions(): void {
        let fetchData: (cpu: Cpu) => Uint8Array = () => new Uint8Array(0);
        let execute: (cpu: Cpu) => void = () => {};

        switch (this.instruction.opcode) {
            // === 0x0X === RLC / RRC
            case 0x00: // RLC B
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x01: // RLC C
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x02: // RLC D
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x03: // RLC E
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x04: // RLC H
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x05: // RLC L
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x06: // RLC [HL]
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x07: // RLC A
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x08: // RRC B
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x09: // RRC C
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x0A: // RRC D
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x0B: // RRC E
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x0C: // RRC H
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x0D: // RRC L
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x0E: // RRC [HL]
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x0F: // RRC A
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            // === 0x1X === RL / RR
            case 0x10: // RL B
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x11: // RL C
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x12: // RL D
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x13: // RL E
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x14: // RL H
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x15: // RL L
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x16: // RL [HL]
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x17: // RL A
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x18: // RR B
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x19: // RR C
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x1A: // RR D
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x1B: // RR E
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x1C: // RR H
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x1D: // RR L
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x1E: // RR [HL]
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x1F: // RR A
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            // === 0x2X === SLA / SRA
            case 0x20: // SLA B
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x21: // SLA C
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x22: // SLA D
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x23: // SLA E
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x24: // SLA H
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x25: // SLA L
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x26: // SLA [HL]
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x27: // SLA A
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x28: // SRA B
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x29: // SRA C
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x2A: // SRA D
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x2B: // SRA E
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x2C: // SRA H
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x2D: // SRA L
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x2E: // SRA [HL]
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x2F: // SRA A
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            // === 0x3X === SWAP / SRL
            case 0x30: // SWAP B
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x31: // SWAP C
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x32: // SWAP D
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x33: // SWAP E
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x34: // SWAP H
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x35: // SWAP L
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x36: // SWAP [HL]
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x37: // SWAP A
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x38: // SRL B
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x39: // SRL C
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x3A: // SRL D
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x3B: // SRL E
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x3C: // SRL H
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x3D: // SRL L
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x3E: // SRL [HL]
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x3F: // SRL A
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            // === 0x4X === BIT 0/1
            case 0x40: // BIT 0, B
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x41: // BIT 0, C
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x42: // BIT 0, D
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x43: // BIT 0, E
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x44: // BIT 0, H
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x45: // BIT 0, L
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x46: // BIT 0, [HL]
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x47: // BIT 0, A
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x48: // BIT 1, B
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x49: // BIT 1, C
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x4A: // BIT 1, D
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x4B: // BIT 1, E
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x4C: // BIT 1, H
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x4D: // BIT 1, L
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x4E: // BIT 1, [HL]
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x4F: // BIT 1, A
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            // === 0x5X === BIT 2/3
            case 0x50: // BIT 2, B
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x51: // BIT 2, C
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x52: // BIT 2, D
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x53: // BIT 2, E
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x54: // BIT 2, H
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x55: // BIT 2, L
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x56: // BIT 2, [HL]
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x57: // BIT 2, A
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x58: // BIT 3, B
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x59: // BIT 3, C
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x5A: // BIT 3, D
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x5B: // BIT 3, E
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x5C: // BIT 3, H
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x5D: // BIT 3, L
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x5E: // BIT 3, [HL]
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x5F: // BIT 3, A
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            // === 0x6X === BIT 4/5
            case 0x60: // BIT 4, B
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x61: // BIT 4, C
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x62: // BIT 4, D
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x63: // BIT 4, E
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x64: // BIT 4, H
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x65: // BIT 4, L
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x66: // BIT 4, [HL]
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x67: // BIT 4, A
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x68: // BIT 5, B
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x69: // BIT 5, C
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x6A: // BIT 5, D
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x6B: // BIT 5, E
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x6C: // BIT 5, H
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x6D: // BIT 5, L
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x6E: // BIT 5, [HL]
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x6F: // BIT 5, A
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            // === 0x7X === BIT 6/7
            case 0x70: // BIT 6, B
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x71: // BIT 6, C
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x72: // BIT 6, D
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x73: // BIT 6, E
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x74: // BIT 6, H
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x75: // BIT 6, L
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x76: // BIT 6, [HL]
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x77: // BIT 6, A
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x78: // BIT 7, B
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x79: // BIT 7, C
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x7A: // BIT 7, D
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x7B: // BIT 7, E
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x7C: // BIT 7, H
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x7D: // BIT 7, L
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x7E: // BIT 7, [HL]
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x7F: // BIT 7, A
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            // === 0x8X === RES 0/1
            case 0x80: // RES 0, B
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x81: // RES 0, C
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x82: // RES 0, D
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x83: // RES 0, E
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x84: // RES 0, H
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x85: // RES 0, L
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x86: // RES 0, [HL]
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x87: // RES 0, A
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x88: // RES 1, B
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x89: // RES 1, C
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x8A: // RES 1, D
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x8B: // RES 1, E
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x8C: // RES 1, H
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x8D: // RES 1, L
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x8E: // RES 1, [HL]
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x8F: // RES 1, A
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            // === 0x9X === RES 2/3
            case 0x90: // RES 2, B
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x91: // RES 2, C
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x92: // RES 2, D
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x93: // RES 2, E
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x94: // RES 2, H
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x95: // RES 2, L
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x96: // RES 2, [HL]
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x97: // RES 2, A
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x98: // RES 3, B
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x99: // RES 3, C
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x9A: // RES 3, D
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x9B: // RES 3, E
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x9C: // RES 3, H
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x9D: // RES 3, L
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x9E: // RES 3, [HL]
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0x9F: // RES 3, A
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            // === 0xAX === RES 4/5
            case 0xA0: // RES 4, B
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xA1: // RES 4, C
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xA2: // RES 4, D
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xA3: // RES 4, E
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xA4: // RES 4, H
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xA5: // RES 4, L
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xA6: // RES 4, [HL]
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xA7: // RES 4, A
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xA8: // RES 5, B
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xA9: // RES 5, C
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xAA: // RES 5, D
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xAB: // RES 5, E
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xAC: // RES 5, H
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xAD: // RES 5, L
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xAE: // RES 5, [HL]
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xAF: // RES 5, A
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            // === 0xBX === RES 6/7
            case 0xB0: // RES 6, B
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xB1: // RES 6, C
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xB2: // RES 6, D
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xB3: // RES 6, E
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xB4: // RES 6, H
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xB5: // RES 6, L
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xB6: // RES 6, [HL]
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xB7: // RES 6, A
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xB8: // RES 7, B
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xB9: // RES 7, C
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xBA: // RES 7, D
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xBB: // RES 7, E
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xBC: // RES 7, H
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xBD: // RES 7, L
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xBE: // RES 7, [HL]
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xBF: // RES 7, A
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            // === 0xCX === SET 0/1
            case 0xC0: // SET 0, B
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xC1: // SET 0, C
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xC2: // SET 0, D
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xC3: // SET 0, E
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xC4: // SET 0, H
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xC5: // SET 0, L
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xC6: // SET 0, [HL]
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xC7: // SET 0, A
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xC8: // SET 1, B
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xC9: // SET 1, C
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xCA: // SET 1, D
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xCB: // SET 1, E
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xCC: // SET 1, H
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xCD: // SET 1, L
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xCE: // SET 1, [HL]
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xCF: // SET 1, A
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            // === 0xDX === SET 2/3
            case 0xD0: // SET 2, B
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xD1: // SET 2, C
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xD2: // SET 2, D
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xD3: // SET 2, E
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xD4: // SET 2, H
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xD5: // SET 2, L
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xD6: // SET 2, [HL]
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xD7: // SET 2, A
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xD8: // SET 3, B
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xD9: // SET 3, C
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xDA: // SET 3, D
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xDB: // SET 3, E
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xDC: // SET 3, H
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xDD: // SET 3, L
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xDE: // SET 3, [HL]
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xDF: // SET 3, A
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            // === 0xEX === SET 4/5
            case 0xE0: // SET 4, B
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xE1: // SET 4, C
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xE2: // SET 4, D
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xE3: // SET 4, E
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xE4: // SET 4, H
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xE5: // SET 4, L
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xE6: // SET 4, [HL]
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xE7: // SET 4, A
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xE8: // SET 5, B
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xE9: // SET 5, C
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xEA: // SET 5, D
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xEB: // SET 5, E
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xEC: // SET 5, H
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xED: // SET 5, L
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xEE: // SET 5, [HL]
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xEF: // SET 5, A
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            // === 0xFX === SET 6/7
            case 0xF0: // SET 6, B
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xF1: // SET 6, C
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xF2: // SET 6, D
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xF3: // SET 6, E
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xF4: // SET 6, H
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xF5: // SET 6, L
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xF6: // SET 6, [HL]
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xF7: // SET 6, A
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xF8: // SET 7, B
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xF9: // SET 7, C
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xFA: // SET 7, D
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xFB: // SET 7, E
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xFC: // SET 7, H
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xFD: // SET 7, L
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xFE: // SET 7, [HL]
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            case 0xFF: // SET 7, A
                execute = function (cpu: Cpu) {
                    cpu.registers.PC += cpu.instruction.bytes - 1;
                }
                break;

            default:
                throw new Error(`Instruction (0xCB prefixed) "${toHex(this.instruction.opcode)}" not found`);
                break;
        }

        this.actions.fetchData = fetchData;
        this.actions.execute = execute;
        this.currentInstructionUsePrefix = false;
    }


    fetchInstructionData(): void {
        this.fetchedData = this.actions.fetchData(this)
    }


    executeInstruction(): void {
        this.actions.execute(this)
    }


    readMemory8(address: u16): u8 {
        const memoryBus = this.computer.memoryBus;
        if (!memoryBus) throw new Error(`MemoryBus not found`);

        const value = memoryBus.read(address);
        return value;
    }

    readMemory16(address: u16): u16 {
        const memoryBus = this.computer.memoryBus;
        if (!memoryBus) throw new Error(`MemoryBus not found`);

        const low = memoryBus.read(address);
        const high = memoryBus.read(address + 1);
        const value = low + high * 256;
        return value;
    }

    writeMemory8(address: u16, value: u8): void {
        const memoryBus = this.computer.memoryBus;
        if (!memoryBus) throw new Error(`MemoryBus not found`);

        memoryBus.write(address, value);
    }

    writeMemory16(address: u16, value: u8): void {
        const memoryBus = this.computer.memoryBus;
        if (!memoryBus) throw new Error(`MemoryBus not found`);

        const low = low16(value);
        const high = high16(value);

        memoryBus.write(address, low);
        memoryBus.write(address + 1, high);
    }
}


class CpuRegisters {
    private registers8: Map<string, u8> = new Map
    private registers16: Map<string, u16> = new Map


    constructor() {
        this.initRegisters()
    }


    initRegisters(): void {
        // Init 8-bit registers
        this.registers8.clear();

        for (let i=0; i<registers8.length; i++) {
            const registerName = registers8[i];
            this.registers8.set(registerName, 0);
        }

        // Init 16-bit registers
        this.registers16.clear();

        for (let i=0; i<registers16.length; i++) {
            const registerName = registers16[i];
            this.registers16.set(registerName, 0);
        }
    }


    private readRegister8(name: string): u8 {
        asserts(this.registers8.has(name), `Register ${name} is not found`)
        return this.registers8.get(name);
    }

    private readRegister16(name: string): u16 {
        asserts(this.registers16.has(name), `Register ${name} is not found`)
        return this.registers16.get(name);
    }


    private writeRegister8(name: string, value: u8): void {
        asserts(this.registers8.has(name), `Register ${name} is not found`)
        this.registers8.set(name, value);
    }

    private writeRegister16(name: string, value: u16): void {
        asserts(this.registers16.has(name), `Register ${name} is not found`)
        this.registers16.set(name, value);
    }


    // Data 8-bit Registers

    get A(): u8 {
        return this.readRegister8('A');
    }
    set A(value: u8) {
        this.writeRegister8('A', value);
    }

    get B(): u8 {
        return this.readRegister8('B');
    }
    set B(value: u8) {
        this.writeRegister8('B', value);
    }

    get C(): u8 {
        return this.readRegister8('C');
    }
    set C(value: u8) {
        this.writeRegister8('C', value);
    }

    get D(): u8 {
        return this.readRegister8('D');
    }
    set D(value: u8) {
        this.writeRegister8('D', value);
    }

    get H(): u8 {
        return this.readRegister8('H');
    }
    set H(value: u8) {
        this.writeRegister8('H', value);
    }

    get L(): u8 {
        return this.readRegister8('L');
    }
    set L(value: u8) {
        this.writeRegister8('L', value);
    }


    // Flag 8-bit Register

    get F(): u8 {
        return this.readRegister8('F');
    }
    set F(value: u8) {
        this.writeRegister8('F', value);
    }


    // Control 16-bit Registers

    get PC(): u16 {
        return this.readRegister16('PC');
    }
    set PC(value: u16) {
        this.writeRegister16('PC', value);
    }

    get SP(): u16 {
        return this.readRegister16('SP');
    }
    set SP(value: u16) {
        this.writeRegister16('SP', value);
    }


    // Combined 8-bit Registers

    // AF (Accumulator & Flags)
    get AF(): u16 {
        const high = this.readRegister8('A');
        const low = this.readRegister8('F');
        return low + high * 256;
    }
    set AF(value: u16) {
        const low = low16(value);
        const high = high16(value);
        this.writeRegister8('A', high);
        this.writeRegister8('F', low);
    }

    // BC
    get BC(): u16 {
        const high = this.readRegister8('B');
        const low = this.readRegister8('C');
        return low + high * 256;
    }
    set BC(value: u16) {
        const low = low16(value);
        const high = high16(value);
        this.writeRegister8('B', high);
        this.writeRegister8('C', low);
    }

    // DE
    get DE(): u16 {
        const high = this.readRegister8('D');
        const low = this.readRegister8('E');
        return low + high * 256;
    }
    set DE(value: u16) {
        const low = low16(value);
        const high = high16(value);
        this.writeRegister8('D', high);
        this.writeRegister8('E', low);
    }

    // HL
    get HL(): u16 {
        const high = this.readRegister8('H');
        const low = this.readRegister8('L');
        return low + high * 256;
    }
    set HL(value: u16) {
        const low = low16(value);
        const high = high16(value);
        this.writeRegister8('H', high);
        this.writeRegister8('L', low);
    }

}
