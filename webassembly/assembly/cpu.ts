// Gameboy Emulator - CPU

import { Computer } from "./Computer";
import { high16, low16, toHex } from "./lib/lib_numbers";

import { CpuRegisters } from "./model/CpuRegisters";
import { CpuInstrution, InstructionActions } from "./model/CpuInstrution";
import { loadInstructionActions } from "./model/UnprefixedInstructionActions";
import { loadPrefixedInstructionActions } from "./model/CbPrefixedInstructionActions";


export class Cpu {
    public computer: Computer;
    public registers: CpuRegisters = new CpuRegisters;

    public instruction: CpuInstrution = new CpuInstrution(this, 0, false, true);
    public actions: InstructionActions | null = null;
    public fetchedData: Uint8Array = new Uint8Array(0);
    public currentInstructionUsePrefix: boolean = false;


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
        //console.log(`[CPU] Current address : ${toHex(this.registers.PC, 4)}`)

        const instructionCode = this.readMemory8(PC);

        //console.log(`[CPU] Current opcode : ${toHex(instructionCode)}`)

        this.instruction = new CpuInstrution(this, instructionCode, this.currentInstructionUsePrefix)

        if (this.currentInstructionUsePrefix) {
            this.actions = loadPrefixedInstructionActions(this.instruction);
            this.currentInstructionUsePrefix = false;

        } else {
            this.actions = loadInstructionActions(this.instruction);
        }
    }


    fetchInstructionData(): void {
        const actions = this.actions;
        if (!actions) throw new Error(`Actions is not Found`);

        this.fetchedData = actions.fetchData(this)
    }


    executeInstruction(): void {
        const actions = this.actions;
        if (!actions) throw new Error(`Actions is not Found`);

        actions.execute(this)
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


