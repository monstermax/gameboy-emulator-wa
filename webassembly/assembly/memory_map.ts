
export namespace MEMORY_MAP {

    // ## ROM ## (0x0000-0x7FFF)
    export const ROM_START: u16 = 0x0000;
    export const ROM_END: u16 = 0x7FFF;


    // ## RAM ## (0x8000-0xDFFF)
    export const RAM_START: u16 = 0x8000;
    export const RAM_END: u16 = 0xDFFF;

    // ## I/O Devices ## (0xFF00-0xFF7F)
    export const IO_START: u16 = 0xFF00;
    export const IO_END: u16 = 0xFF7F;

    // ## High RAM ## (0xFF80-0xFFFE)
    export const HRAM_START: u16 = 0xFF80;
    export const HRAM_END: u16 = 0xFFFE;

    export const INTERRUPT: u16 = 0xFFFF;

};



export function isRomAddress(address: u16): boolean {
    return address >= MEMORY_MAP.ROM_START && address <= MEMORY_MAP.ROM_END;
}


export function isRamAddress(address: u16): boolean {
    return address >= MEMORY_MAP.RAM_START && address <= MEMORY_MAP.RAM_END;
}


export function isIoAddress(address: u16): boolean {
    return address >= MEMORY_MAP.IO_START && address <= MEMORY_MAP.IO_END;
}

