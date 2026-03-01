// Gameboy Emulator - CPU

import { Computer } from "./Computer";

import { CpuRegisters } from "./CpuRegisters";
import { executeUnprefixed } from "./UnprefixedInstructionActions";
import { executeCbPrefixed } from "./CbPrefixedInstructionActions";
import { CYCLES_UNPREFIXED, CYCLES_CB_PREFIXED } from "./CycleTables";


// Interrupt vectors
const INT_VBLANK: u16  = 0x0040;
const INT_STAT: u16    = 0x0048;
const INT_TIMER: u16   = 0x0050;
const INT_SERIAL: u16  = 0x0058;
const INT_JOYPAD: u16  = 0x0060;

// Interrupt bit flags
const INT_BIT_VBLANK: u8 = 0x01;
const INT_BIT_STAT: u8   = 0x02;
const INT_BIT_TIMER: u8  = 0x04;
const INT_BIT_SERIAL: u8 = 0x08;
const INT_BIT_JOYPAD: u8 = 0x10;


export class Cpu {
    public computer: Computer;
    public registers: CpuRegisters = new CpuRegisters;

    public ime: bool = false;
    public imeScheduled: bool = false;
    public halted: bool = false;
    public cycles: i64 = 0;

    /** T-cycles consumed by the last executed instruction */
    public lastCycles: i32 = 4;


    constructor(computer: Computer) {
        this.computer = computer;
    }


    runCycle(): void {
        this.handleInterrupts();

        if (this.halted) {
            this.lastCycles = 4; // HALT burns 4 T-cycles
            return;
        }

        // Fetch opcode
        const opcode = this.readMemory8(this.registers.PC);

        if (opcode == 0xCB) {
            // CB prefix: advance PC, read next opcode, execute CB instruction
            this.registers.PC += 1;
            const cbOpcode = this.readMemory8(this.registers.PC);
            executeCbPrefixed(this, cbOpcode);
            this.lastCycles = <i32>unchecked(CYCLES_CB_PREFIXED[<i32>cbOpcode]);

        } else {
            executeUnprefixed(this, opcode);
            this.lastCycles = <i32>unchecked(CYCLES_UNPREFIXED[<i32>opcode]);
        }

        // EI takes effect after the next instruction
        if (this.imeScheduled) {
            this.imeScheduled = false;
            this.ime = true;
        }

        this.cycles++;
    }


    // =========================================================================
    //  Interrupts
    // =========================================================================

    private handleInterrupts(): void {
        const ifReg = this.readMemory8(0xFF0F);
        const ieReg = this.readMemory8(0xFFFF);
        const pending = ifReg & ieReg & 0x1F;

        if (pending != 0 && this.halted) {
            this.halted = false;
        }

        if (!this.ime || pending == 0) return;

        if (pending & INT_BIT_VBLANK)  { this.serviceInterrupt(INT_BIT_VBLANK, INT_VBLANK); return; }
        if (pending & INT_BIT_STAT)    { this.serviceInterrupt(INT_BIT_STAT, INT_STAT); return; }
        if (pending & INT_BIT_TIMER)   { this.serviceInterrupt(INT_BIT_TIMER, INT_TIMER); return; }
        if (pending & INT_BIT_SERIAL)  { this.serviceInterrupt(INT_BIT_SERIAL, INT_SERIAL); return; }
        if (pending & INT_BIT_JOYPAD)  { this.serviceInterrupt(INT_BIT_JOYPAD, INT_JOYPAD); return; }
    }

    private serviceInterrupt(bitFlag: u8, vector: u16): void {
        this.ime = false;
        const ifReg = this.readMemory8(0xFF0F);
        this.writeMemory8(0xFF0F, ifReg & ~bitFlag);
        this.pushStack(this.registers.PC);
        this.registers.PC = vector;
    }


    // =========================================================================
    //  Memory access
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
    //  Stack
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
