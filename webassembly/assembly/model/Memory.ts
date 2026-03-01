// Gameboy Emulator - Memory

import { Computer } from "./Computer";
import { toHex } from "../lib/lib_numbers";
import { isIoAddress, isRamAddress, isRomAddress, MEMORY_MAP } from "../memory_map";

// https://gbdev.io/pandocs/Memory_Map.html


export class MemoryBus {
    private computer: Computer;
    private verbose: boolean = false;

    constructor(computer: Computer) {
        this.computer = computer;
    }

    public read(address: u16): u8 {
        let value: u8 = 0;

        if (this.verbose) {
            console.log(`Reading Memory value at address "${toHex(address)} (${address})"`);
        }

        if (isRomAddress(address)) {
            const rom = this.computer.rom;

            if (!rom) {
                throw new Error(`No ROM found. Cannot read at address ${toHex(address)}`);
            }

            value = rom.read(address);

        } else if (isRamAddress(address)) {
            const ram = this.computer.ram;

            if (!ram) {
                throw new Error(`No RAM found. Cannot read at address ${toHex(address)}`);
            }

            const ramRelativeAddress = address - MEMORY_MAP.RAM_START;

            value = ram.read(ramRelativeAddress);

        } else if (isIoAddress(address)) {
            const ioManager = this.computer.ioManager;

            if (!ioManager) {
                throw new Error(`No IO Manager found. Cannot read at address ${toHex(address)}`);
            }

            const ioRelativeAddress = address - MEMORY_MAP.IO_START;

            value = ioManager.read(ioRelativeAddress);

        } else {
            throw new Error(`Address read out of memory range : ${toHex(address)}`);
        }

        if (this.verbose) {
            //console.log(`Read Memory value "${toHex(value)}" (${value}) at address "${toHex(address)} (${address})"`);
        }
        return value;
    }


    public write(address: u16, value: u8): void {
        if (this.verbose) {
            console.log(`Writing Memory value "${toHex(value)}" (${value}) at address "${toHex(address)} (${address})"`);
        }

        if (isRomAddress(address)) {
            const rom = this.computer.rom;

            if (!rom) {
                throw new Error(`No ROM found. Cannot write at address ${toHex(address)}`);
            }

            rom.write(address, value)
            return;
        }

        if (isRamAddress(address)) {
            const ram = this.computer.ram;

            if (!ram) {
                throw new Error(`No RAM found. Cannot write at address ${toHex(address)}`);
            }

            const ramRelativeAddress = address - MEMORY_MAP.RAM_START;

            ram.write(ramRelativeAddress, value);
            return
        }

        if (isIoAddress(address)) {
            const ioManager = this.computer.ioManager;

            if (!ioManager) {
                throw new Error(`No IO Manager found. Cannot write at address ${toHex(address)}`);
            }

            const ioRelativeAddress = address - MEMORY_MAP.IO_START;

            ioManager.write(ioRelativeAddress, value);
            return
        }

        throw new Error(`Address write out of memory range : ${toHex(address)}`);
    }
}


abstract class Memory {
    protected storage: StaticArray<u8>;
    protected size: u32;
    protected name: string;

    constructor(name: string, size: i32) {
        this.name = name;
        this.storage = new StaticArray<u8>(size);
        this.size = size;
    }

    public read(address: u16): u8 {
        if (address < 0 || address > <u16>this.storage.length - 1) {
            throw new Error(`Memory "${this.name}" Read Address out of range : ${toHex(address)}`);
        }

        return this.storage[address];
    }

    public write(address: u16, value: u8): void {
        if (address < 0 || address > <u16>this.storage.length - 1) {
            throw new Error(`Memory "${this.name}" Write Address out of range : ${toHex(address)}`);
        }

        this.storage[address] = value;
    }


    public reset(): void {
        this.storage = new StaticArray<u8>(this.size);
    }
}



export class Rom extends Memory {
    private computer: Computer;

    constructor(computer: Computer, storage: StaticArray<u8>) {
        super('ROM', 0xFFFF);
        this.computer = computer;
        this.storage = storage;
        //console.log(`ROM size (init): ${this.storage.length}`)
    }

    public read(address: u16): u8 {
        //console.log(`Reading ROM value at address "${toHex(address)} (${address})"`);
        //console.log(`Rom size (read): ${this.storage.length}`)
        let value: u8 = super.read(address);
        return value;
    }

    public write(address: u16, value: u8): void {
        //console.log(`Writing ROM value "${toHex(value)}" (${value}) at address "${toHex(address)} (${address})"`);
        super.write(address, value);
    }
}


export class Ram extends Memory {
    private computer: Computer;

    constructor(computer: Computer) {
        super('RAM', MEMORY_MAP.RAM_END - MEMORY_MAP.RAM_START);
        this.computer = computer;

        console.log(`RAM size (init): ${this.storage.length}`)
    }

    public read(ramRelativeAddress: u16): u8 {
        //console.log(`Reading RAM value at address "${toHex(address)} (${address})"`);
        let value: u8 = super.read(ramRelativeAddress);
        return value;
    }

    public write(ramRelativeAddress: u16, value: u8): void {
        //console.log(`Writing RAM value "${toHex(value)}" (${value}) at address "${toHex(address)} (${address})"`);
        super.write(ramRelativeAddress, value);
    }

}

