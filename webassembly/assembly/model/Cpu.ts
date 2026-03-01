// Gameboy Emulator - CPU

import { Computer } from "./Computer";

import { CpuRegisters } from "./CpuRegisters";
import { CpuInstrution, InstructionActions } from "./CpuInstrution";
import { loadInstructionActions } from "./UnprefixedInstructionActions";
import { loadPrefixedInstructionActions } from "./CbPrefixedInstructionActions";


// Interrupt vectors
const INT_VBLANK: u16  = 0x0040;
const INT_STAT: u16    = 0x0048;
const INT_TIMER: u16   = 0x0050;
const INT_SERIAL: u16  = 0x0058;
const INT_JOYPAD: u16  = 0x0060;

// Interrupt bit flags (same for IF @ 0xFF0F and IE @ 0xFFFF)
const INT_BIT_VBLANK: u8 = 0x01;  // bit 0
const INT_BIT_STAT: u8   = 0x02;  // bit 1
const INT_BIT_TIMER: u8  = 0x04;  // bit 2
const INT_BIT_SERIAL: u8 = 0x08;  // bit 3
const INT_BIT_JOYPAD: u8 = 0x10;  // bit 4


export class Cpu {
    public computer: Computer;
    public registers: CpuRegisters = new CpuRegisters;

    public instruction: CpuInstrution = new CpuInstrution(this, 0, false, true);
    public actions: InstructionActions | null = null;
    public currentInstructionUsePrefix: boolean = false;

    public ime: bool = false;      // Interrupt Master Enable
    public imeScheduled: bool = false; // EI enables IME after the NEXT instruction
    public halted: bool = false;   // HALT state
    public cycles: i64 = 0;


    constructor(computer: Computer) {
        this.computer = computer
    }


    runCycle(): void {
        // Handle interrupts (before executing the next instruction)
        this.handleInterrupts();

        if (this.halted) {
            // CPU is halted, just burn a cycle
            // handleInterrupts above will wake us if needed
            return;
        }

        this.cycles++;

        this.fetchInstruction();
        this.executeInstruction();

        // EI takes effect after the instruction following EI
        if (this.imeScheduled) {
            this.imeScheduled = false;
            this.ime = true;
        }
    }


    // =========================================================================
    //  Interrupts
    // =========================================================================

    private handleInterrupts(): void {
        // Read IF (0xFF0F) and IE (0xFFFF)
        const ifReg = this.readMemory8(0xFF0F);
        const ieReg = this.readMemory8(0xFFFF);
        const pending = ifReg & ieReg & 0x1F;

        // If any interrupt is pending, wake from HALT regardless of IME
        if (pending != 0 && this.halted) {
            this.halted = false;
        }

        // Only dispatch if IME is enabled
        if (!this.ime || pending == 0) return;

        // Check interrupts in priority order (bit 0 = highest)
        if (pending & INT_BIT_VBLANK)  { this.serviceInterrupt(INT_BIT_VBLANK, INT_VBLANK); return; }
        if (pending & INT_BIT_STAT)    { this.serviceInterrupt(INT_BIT_STAT, INT_STAT); return; }
        if (pending & INT_BIT_TIMER)   { this.serviceInterrupt(INT_BIT_TIMER, INT_TIMER); return; }
        if (pending & INT_BIT_SERIAL)  { this.serviceInterrupt(INT_BIT_SERIAL, INT_SERIAL); return; }
        if (pending & INT_BIT_JOYPAD)  { this.serviceInterrupt(INT_BIT_JOYPAD, INT_JOYPAD); return; }
    }


    private serviceInterrupt(bitFlag: u8, vector: u16): void {
        // Disable IME (prevent nested interrupts)
        this.ime = false;

        // Clear the interrupt flag bit in IF
        const ifReg = this.readMemory8(0xFF0F);
        this.writeMemory8(0xFF0F, ifReg & ~bitFlag);

        // Push current PC onto the stack and jump to the vector
        this.pushStack(this.registers.PC);
        this.registers.PC = vector;
    }


    // =========================================================================
    //  Fetch / Execute
    // =========================================================================

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


    // =========================================================================
    //  Memory access helpers
    // =========================================================================

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


    // =========================================================================
    //  Stack helpers
    // =========================================================================

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
