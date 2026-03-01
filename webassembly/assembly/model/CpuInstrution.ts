// Gameboy Emulator - CPU Instructions

import { Cpu } from "./Cpu";
import { toHex } from "../lib/lib_numbers";

import { Operand } from "../types/cpu_instructions.types";


export class InstructionActions {
    public execute: (cpu: Cpu) => void;

    constructor(execute: (cpu: Cpu) => void) {
        this.execute = execute;
    }
}


export class CpuInstrution {
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
