// Gameboy Emulator - Memory Map
// https://gbdev.io/pandocs/Memory_Map.html
//
//  0x0000-0x3FFF  ROM Bank 0         (16 KB)  - Cartouche (MBC)
//  0x4000-0x7FFF  ROM Bank N         (16 KB)  - Cartouche (MBC)
//  0x8000-0x9FFF  VRAM               (8 KB)
//  0xA000-0xBFFF  External RAM       (8 KB)   - Cartouche (MBC)
//  0xC000-0xDFFF  WRAM               (8 KB)
//  0xE000-0xFDFF  Echo RAM           (miroir de 0xC000-0xDDFF)
//  0xFE00-0xFE9F  OAM                (160 bytes)
//  0xFEA0-0xFEFF  Not Usable
//  0xFF00-0xFF7F  I/O Registers
//  0xFF80-0xFFFE  HRAM               (127 bytes)
//  0xFFFF         IE Register


export namespace MEMORY_MAP {

    // ROM (cartouche, géré par MBC)
    export const ROM_START: u16 = 0x0000;
    export const ROM_END: u16   = 0x7FFF;

    // VRAM
    export const VRAM_START: u16 = 0x8000;
    export const VRAM_END: u16   = 0x9FFF;
    export const VRAM_SIZE: u32  = 0x2000;  // 8 KB

    // External RAM (cartouche, géré par MBC)
    export const EXT_RAM_START: u16 = 0xA000;
    export const EXT_RAM_END: u16   = 0xBFFF;

    // WRAM
    export const WRAM_START: u16 = 0xC000;
    export const WRAM_END: u16   = 0xDFFF;
    export const WRAM_SIZE: u32  = 0x2000;  // 8 KB

    // Echo RAM (miroir de WRAM)
    export const ECHO_RAM_START: u16 = 0xE000;
    export const ECHO_RAM_END: u16   = 0xFDFF;

    // OAM (Sprite attribute table)
    export const OAM_START: u16 = 0xFE00;
    export const OAM_END: u16   = 0xFE9F;
    export const OAM_SIZE: u32  = 0x00A0;  // 160 bytes

    // Not Usable
    export const UNUSABLE_START: u16 = 0xFEA0;
    export const UNUSABLE_END: u16   = 0xFEFF;

    // I/O Registers
    export const IO_START: u16 = 0xFF00;
    export const IO_END: u16   = 0xFF7F;

    // HRAM
    export const HRAM_START: u16 = 0xFF80;
    export const HRAM_END: u16   = 0xFFFE;
    export const HRAM_SIZE: u32  = 0x007F;  // 127 bytes

    // Interrupt Enable Register
    export const IE_REG: u16 = 0xFFFF;
}


// === Address range checkers ===

export function isRomAddress(address: u16): boolean {
    return address >= MEMORY_MAP.ROM_START && address <= MEMORY_MAP.ROM_END;
}

export function isVramAddress(address: u16): boolean {
    return address >= MEMORY_MAP.VRAM_START && address <= MEMORY_MAP.VRAM_END;
}

export function isExtRamAddress(address: u16): boolean {
    return address >= MEMORY_MAP.EXT_RAM_START && address <= MEMORY_MAP.EXT_RAM_END;
}

export function isWramAddress(address: u16): boolean {
    return address >= MEMORY_MAP.WRAM_START && address <= MEMORY_MAP.WRAM_END;
}

export function isEchoRamAddress(address: u16): boolean {
    return address >= MEMORY_MAP.ECHO_RAM_START && address <= MEMORY_MAP.ECHO_RAM_END;
}

export function isOamAddress(address: u16): boolean {
    return address >= MEMORY_MAP.OAM_START && address <= MEMORY_MAP.OAM_END;
}

export function isUnusableAddress(address: u16): boolean {
    return address >= MEMORY_MAP.UNUSABLE_START && address <= MEMORY_MAP.UNUSABLE_END;
}

export function isIoAddress(address: u16): boolean {
    return address >= MEMORY_MAP.IO_START && address <= MEMORY_MAP.IO_END;
}

export function isHramAddress(address: u16): boolean {
    return address >= MEMORY_MAP.HRAM_START && address <= MEMORY_MAP.HRAM_END;
}

export function isIeAddress(address: u16): boolean {
    return address == MEMORY_MAP.IE_REG;
}
