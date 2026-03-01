// Gameboy Emulator - Memory

import { Computer } from "./Computer";
import { toHex } from "../lib/lib_numbers";
import {
    isRomAddress, isVramAddress, isExtRamAddress, isWramAddress,
    isEchoRamAddress, isOamAddress, isUnusableAddress,
    isIoAddress, isHramAddress, isIeAddress,
    MEMORY_MAP,
} from "../memory_map";

// https://gbdev.io/pandocs/Memory_Map.html


export class MemoryBus {
    private computer: Computer;
    private verbose: boolean = false;

    public vram: StaticArray<u8> = new StaticArray<u8>(MEMORY_MAP.VRAM_SIZE);   // 0x8000-0x9FFF (8 KB)
    public wram: StaticArray<u8> = new StaticArray<u8>(MEMORY_MAP.WRAM_SIZE);   // 0xC000-0xDFFF (8 KB)
    public oam: StaticArray<u8>  = new StaticArray<u8>(MEMORY_MAP.OAM_SIZE);    // 0xFE00-0xFE9F (160 bytes)
    public hram: StaticArray<u8> = new StaticArray<u8>(MEMORY_MAP.HRAM_SIZE);   // 0xFF80-0xFFFE (127 bytes)
    public ie: u8 = 0;                                                          // 0xFFFF (1 byte)

    constructor(computer: Computer) {
        this.computer = computer;
    }


    public read(address: u16): u8 {
        // ROM (0x0000-0x7FFF) => MBC
        if (isRomAddress(address)) {
            const mbc = this.computer.mbc;
            if (!mbc) throw new Error(`No MBC found. Cannot read at address ${toHex(address)}`);
            return mbc.read(address);
        }

        // VRAM (0x8000-0x9FFF)
        if (isVramAddress(address)) {
            return this.vram[address - MEMORY_MAP.VRAM_START];
        }

        // External RAM (0xA000-0xBFFF) => MBC
        if (isExtRamAddress(address)) {
            const mbc = this.computer.mbc;
            if (!mbc) throw new Error(`No MBC found. Cannot read ext RAM at address ${toHex(address)}`);
            return mbc.read(address);
        }

        // WRAM (0xC000-0xDFFF)
        if (isWramAddress(address)) {
            return this.wram[address - MEMORY_MAP.WRAM_START];
        }

        // Echo RAM (0xE000-0xFDFF) => miroir de WRAM
        if (isEchoRamAddress(address)) {
            const mirrorAddr = address - MEMORY_MAP.ECHO_RAM_START;  // 0x0000-0x1DFF
            return this.wram[mirrorAddr];
        }

        // OAM (0xFE00-0xFE9F)
        if (isOamAddress(address)) {
            return this.oam[address - MEMORY_MAP.OAM_START];
        }

        // Not Usable (0xFEA0-0xFEFF)
        if (isUnusableAddress(address)) {
            return 0xFF;
        }

        // I/O Registers (0xFF00-0xFF7F)
        if (isIoAddress(address)) {
            const ioManager = this.computer.ioManager;
            if (!ioManager) throw new Error(`No IO Manager found. Cannot read at address ${toHex(address)}`);
            const ioRelativeAddress = address - MEMORY_MAP.IO_START;
            return ioManager.read(ioRelativeAddress);
        }

        // HRAM (0xFF80-0xFFFE)
        if (isHramAddress(address)) {
            return this.hram[address - MEMORY_MAP.HRAM_START];
        }

        // IE Register (0xFFFF)
        if (isIeAddress(address)) {
            return this.ie;
        }

        throw new Error(`Address read out of memory range : ${toHex(address)}`);
    }


    public write(address: u16, value: u8): void {
        // ROM (0x0000-0x7FFF) => registres MBC (bank switching)
        if (isRomAddress(address)) {
            const mbc = this.computer.mbc;
            if (!mbc) throw new Error(`No MBC found. Cannot write at address ${toHex(address)}`);
            mbc.write(address, value);
            return;
        }

        // VRAM (0x8000-0x9FFF)
        if (isVramAddress(address)) {
            this.vram[address - MEMORY_MAP.VRAM_START] = value;
            return;
        }

        // External RAM (0xA000-0xBFFF) => MBC
        if (isExtRamAddress(address)) {
            const mbc = this.computer.mbc;
            if (!mbc) throw new Error(`No MBC found. Cannot write ext RAM at address ${toHex(address)}`);
            mbc.write(address, value);
            return;
        }

        // WRAM (0xC000-0xDFFF)
        if (isWramAddress(address)) {
            this.wram[address - MEMORY_MAP.WRAM_START] = value;
            return;
        }

        // Echo RAM (0xE000-0xFDFF) => miroir de WRAM
        if (isEchoRamAddress(address)) {
            const mirrorAddr = address - MEMORY_MAP.ECHO_RAM_START;
            this.wram[mirrorAddr] = value;
            return;
        }

        // OAM (0xFE00-0xFE9F)
        if (isOamAddress(address)) {
            this.oam[address - MEMORY_MAP.OAM_START] = value;
            return;
        }

        // Not Usable (0xFEA0-0xFEFF)
        if (isUnusableAddress(address)) {
            return; // Ignoré silencieusement
        }

        // I/O Registers (0xFF00-0xFF7F)
        if (isIoAddress(address)) {
            const ioManager = this.computer.ioManager;
            if (!ioManager) throw new Error(`No IO Manager found. Cannot write at address ${toHex(address)}`);
            const ioRelativeAddress = address - MEMORY_MAP.IO_START;
            ioManager.write(ioRelativeAddress, value);
            return;
        }

        // HRAM (0xFF80-0xFFFE)
        if (isHramAddress(address)) {
            this.hram[address - MEMORY_MAP.HRAM_START] = value;
            return;
        }

        // IE Register (0xFFFF)
        if (isIeAddress(address)) {
            this.ie = value;
            return;
        }

        throw new Error(`Address write out of memory range : ${toHex(address)}`);
    }
}
