// Gameboy Emulator - IO Manager

// https://gbdev.io/pandocs/Memory_Map.html#io-ranges

import { Computer } from "./Computer";
import { toHex } from "../lib/lib_numbers";


// Relative addresses (offset from 0xFF00)
const IO_SIZE: u32 = 0x80;  // 128 registers

// Joypad
const JOYP: u16 = 0x00;   // FF00

// Serial
const SB: u16   = 0x01;   // FF01
const SC: u16   = 0x02;   // FF02

// Timer
const DIV: u16  = 0x04;   // FF04
const TIMA: u16 = 0x05;   // FF05
const TMA: u16  = 0x06;   // FF06
const TAC: u16  = 0x07;   // FF07

// Interrupts
const IF: u16   = 0x0F;   // FF0F

// LCD
const LCDC: u16 = 0x40;   // FF40
const STAT: u16 = 0x41;   // FF41
const SCY: u16  = 0x42;   // FF42
const SCX: u16  = 0x43;   // FF43
const LY: u16   = 0x44;   // FF44
const LYC: u16  = 0x45;   // FF45
const DMA: u16  = 0x46;   // FF46
const BGP: u16  = 0x47;   // FF47
const OBP0: u16 = 0x48;   // FF48
const OBP1: u16 = 0x49;   // FF49
const WY: u16   = 0x4A;   // FF4A
const WX: u16   = 0x4B;   // FF4B

// Boot ROM
const BOOT: u16 = 0x50;   // FF50


export class IoManager {
    private computer: Computer;
    public registers: StaticArray<u8> = new StaticArray<u8>(IO_SIZE);

    constructor(computer: Computer) {
        this.computer = computer;
        this.initRegisters();
    }


    /** Valeurs initiales post-boot (comme si le boot ROM avait déjà tourné) */
    private initRegisters(): void {
        this.registers[JOYP] = 0xCF;
        this.registers[SB] = 0x00;
        this.registers[SC] = 0x7E;
        this.registers[DIV]  = 0xAB;
        this.registers[TIMA] = 0x00;
        this.registers[TMA]  = 0x00;
        this.registers[TAC]  = 0xF8;
        this.registers[IF] = 0xE1;
        this.registers[LCDC] = 0x91;
        this.registers[STAT] = 0x85;
        this.registers[SCY]  = 0x00;
        this.registers[SCX]  = 0x00;
        this.registers[LY]   = 0x00;
        this.registers[LYC]  = 0x00;
        this.registers[BGP]  = 0xFC;
        this.registers[OBP0] = 0x00;
        this.registers[OBP1] = 0x00;
        this.registers[WY]   = 0x00;
        this.registers[WX]   = 0x00;
        this.registers[BOOT] = 0x01;
    }


    public read(ioRelativeAddress: u16): u8 {
        if (ioRelativeAddress >= <u16>IO_SIZE) {
            return 0xFF;
        }

        switch (ioRelativeAddress) {
            case JOYP:
                return this.readJoypad();

            case LY:
                // LY is managed by the PPU via writeRaw
                return this.registers[LY];

            case STAT:
                // Bit 7 always 1
                return this.registers[STAT] | 0x80;

            case 0x26: { // NR52 - read channel status from APU
                const apu = this.computer.apu;
                if (apu) return apu.readNr52();
                return this.registers[ioRelativeAddress];
            }

            default:
                return this.registers[ioRelativeAddress];
        }
    }


    public write(ioRelativeAddress: u16, value: u8): void {
        if (ioRelativeAddress >= <u16>IO_SIZE) {
            return;
        }

        switch (ioRelativeAddress) {
            case JOYP:
                this.registers[JOYP] = (value & 0x30) | (this.registers[JOYP] & 0xCF);
                break;

            case DIV:
                // Writing any value resets DIV (and the internal system counter)
                this.registers[DIV] = 0;
                const timer = this.computer.timer;
                if (timer) timer.resetDiv();
                break;

            case STAT:
                // Bits 0-2 read-only (mode + coincidence), bit 7 always 1
                this.registers[STAT] = (value & 0x78) | (this.registers[STAT] & 0x07);
                break;

            case LY:
                // LY is read-only, writes ignored
                break;

            case DMA:
                this.registers[DMA] = value;
                this.executeDmaTransfer(value);
                break;

            default: {
                this.registers[ioRelativeAddress] = value;

                // Route audio registers to APU
                // NR10-NR14: 0x10-0x14, NR21-NR24: 0x16-0x19,
                // NR30-NR34: 0x1A-0x1E, NR41-NR44: 0x20-0x23,
                // NR50-NR52: 0x24-0x26
                if (ioRelativeAddress >= 0x10 && ioRelativeAddress <= 0x26) {
                    const apu = this.computer.apu;
                    if (apu) apu.writeRegister(ioRelativeAddress, value);
                }

                // Wave RAM: 0x30-0x3F
                if (ioRelativeAddress >= 0x30 && ioRelativeAddress <= 0x3F) {
                    const apu = this.computer.apu;
                    if (apu) {
                        unchecked(apu.waveRam[<i32>(ioRelativeAddress - 0x30)] = value);
                    }
                }

                break;
            }
        }
    }


    /** Raw write — used by PPU to set LY/STAT directly, bypassing write protections */
    public writeRaw(ioRelativeAddress: u16, value: u8): void {
        if (ioRelativeAddress < <u16>IO_SIZE) {
            this.registers[ioRelativeAddress] = value;
        }
    }


    // === Joypad ===

    //  Button state bits (active LOW on real GB, but we store active HIGH here):
    //    bit 0 = A        bit 4 = Right
    //    bit 1 = B        bit 5 = Left
    //    bit 2 = Select   bit 6 = Up
    //    bit 3 = Start    bit 7 = Down
    public joypadState: u8 = 0x00;  // no buttons pressed

    private readJoypad(): u8 {
        const select = this.registers[JOYP] & 0x30;
        let result: u8 = 0x0F; // all released (active LOW = 1)

        // P14 = bit 4: direction keys selected (active LOW)
        if ((select & 0x10) == 0) {
            // Read direction keys (bits 4-7 of joypadState)
            if (this.joypadState & 0x10) result &= ~0x01; // Right
            if (this.joypadState & 0x20) result &= ~0x02; // Left
            if (this.joypadState & 0x40) result &= ~0x04; // Up
            if (this.joypadState & 0x80) result &= ~0x08; // Down
        }

        // P15 = bit 5: button keys selected (active LOW)
        if ((select & 0x20) == 0) {
            // Read button keys (bits 0-3 of joypadState)
            if (this.joypadState & 0x01) result &= ~0x01; // A
            if (this.joypadState & 0x02) result &= ~0x02; // B
            if (this.joypadState & 0x04) result &= ~0x04; // Select
            if (this.joypadState & 0x08) result &= ~0x08; // Start
        }

        return select | result | 0xC0;
    }


    // === DMA ===

    private executeDmaTransfer(sourceHigh: u8): void {
        const memoryBus = this.computer.memoryBus;
        if (!memoryBus) return;

        const sourceAddr: u16 = <u16>sourceHigh << 8;

        for (let i: u16 = 0; i < 0xA0; i++) {
            const value = memoryBus.read(sourceAddr + i);
            memoryBus.write(0xFE00 + i, value);
        }
    }
}
