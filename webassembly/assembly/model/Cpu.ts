// Gameboy Emulator - CPU

import { Computer } from "./Computer";

import { CpuRegisters } from "./CpuRegisters";
import { CpuInstrution, InstructionActions } from "./CpuInstrution";
import { loadInstructionActions } from "./UnprefixedInstructionActions";
import { loadPrefixedInstructionActions } from "./CbPrefixedInstructionActions";


export class Cpu {
    public computer: Computer;
    public registers: CpuRegisters = new CpuRegisters;

    public instruction: CpuInstrution = new CpuInstrution(this, 0, false, true);
    public actions: InstructionActions | null = null;
    public currentInstructionUsePrefix: boolean = false;

    public ime: bool = false;      // Interrupt Master Enable
    public halted: bool = false;   // HALT state


    constructor(computer: Computer) {
        this.computer = computer
    }


    runCycle(): void {
        if (this.halted) {
            // TODO: check for pending interrupts to wake up
            return;
        }

        this.fetchInstruction();
        this.executeInstruction();
    }


    fetchInstruction(): void {
        const PC = this.registers.PC;
        const instructionCode = this.readMemory8(PC);

        this.instruction = new CpuInstrution(this, instructionCode, this.currentInstructionUsePrefix)

        if (this.currentInstructionUsePrefix) {
            this.actions = loadPrefixedInstructionActions(this.instruction);
            this.currentInstructionUsePrefix = false;
        } else {
            this.actions = loadInstructionActions(this.instruction);
        }
    }


    executeInstruction(): void {
        const actions = this.actions;
        if (!actions) throw new Error(`Actions not found`);

        actions.execute(this)
    }


    // === Memory access helpers ===

    readMemory8(address: u16): u8 {
        const memoryBus = this.computer.memoryBus;
        if (!memoryBus) throw new Error(`MemoryBus not found`);
        return memoryBus.read(address);
    }

    readMemory16(address: u16): u16 {
        const memoryBus = this.computer.memoryBus;
        if (!memoryBus) throw new Error(`MemoryBus not found`);

        const low: u16 = memoryBus.read(address);
        const high: u16 = memoryBus.read(address + 1);
        return low | (high << 8);
    }

    writeMemory8(address: u16, value: u8): void {
        const memoryBus = this.computer.memoryBus;
        if (!memoryBus) throw new Error(`MemoryBus not found`);
        memoryBus.write(address, value);
    }

    writeMemory16(address: u16, value: u16): void {
        const memoryBus = this.computer.memoryBus;
        if (!memoryBus) throw new Error(`MemoryBus not found`);

        memoryBus.write(address, <u8>(value & 0xFF));
        memoryBus.write(address + 1, <u8>((value >> 8) & 0xFF));
    }


    // === Stack helpers ===

    pushStack(value: u16): void {
        this.registers.SP -= 2;
        this.writeMemory16(this.registers.SP, value);
    }

    popStack(): u16 {
        const value = this.readMemory16(this.registers.SP);
        this.registers.SP += 2;
        return value;
    }
}
