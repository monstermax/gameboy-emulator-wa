// Gameboy Emulator - CPU Registers

import { high16, low16 } from "../lib/lib_numbers";

import { asserts } from "../utils";


const registers8 = [
    'A', 'B', 'C', 'D', 'E', // Data 8-bit Registers
    'H', 'L',                 // Data 8-bit Registers
    'F',                      // Flags 8-bit Register ( bit7 = z = Zero flag | bit6 = n = Subtraction flag | bit5 = h = Half Carry flag | bit4 = c = Carry flag)
];

const registers16 = [
    'SP', 'PC', // Control 16-bit Registers
    'AF', 'BC', 'DE', 'HL', // 16-bit combined registers (each one is 2x 8-bit registers)
];


// Flag bit masks
const FLAG_Z: u8 = 0x80; // bit 7 - Zero
const FLAG_N: u8 = 0x40; // bit 6 - Subtraction
const FLAG_H: u8 = 0x20; // bit 5 - Half Carry
const FLAG_C: u8 = 0x10; // bit 4 - Carry


export class CpuRegisters {
    private registers8: Map<string, u8> = new Map
    private registers16: Map<string, u16> = new Map


    constructor() {
        this.initRegisters()
    }


    initRegisters(): void {
        // Init 8-bit registers
        this.registers8.clear();

        for (let i=0; i<registers8.length; i++) {
            const registerName = registers8[i];
            this.registers8.set(registerName, 0);
        }

        // Init 16-bit registers
        this.registers16.clear();

        for (let i=0; i<registers16.length; i++) {
            const registerName = registers16[i];
            this.registers16.set(registerName, 0);
        }
    }


    private readRegister8(name: string): u8 {
        asserts(this.registers8.has(name), `Register ${name} is not found`)
        return this.registers8.get(name);
    }

    private readRegister16(name: string): u16 {
        asserts(this.registers16.has(name), `Register ${name} is not found`)
        return this.registers16.get(name);
    }


    private writeRegister8(name: string, value: u8): void {
        asserts(this.registers8.has(name), `Register ${name} is not found`)
        this.registers8.set(name, value);
    }

    private writeRegister16(name: string, value: u16): void {
        asserts(this.registers16.has(name), `Register ${name} is not found`)
        this.registers16.set(name, value);
    }


    // Data 8-bit Registers

    get A(): u8 { return this.readRegister8('A'); }
    set A(value: u8) { this.writeRegister8('A', value); }

    get B(): u8 { return this.readRegister8('B'); }
    set B(value: u8) { this.writeRegister8('B', value); }

    get C(): u8 { return this.readRegister8('C'); }
    set C(value: u8) { this.writeRegister8('C', value); }

    get D(): u8 { return this.readRegister8('D'); }
    set D(value: u8) { this.writeRegister8('D', value); }

    get E(): u8 { return this.readRegister8('E'); }
    set E(value: u8) { this.writeRegister8('E', value); }

    get H(): u8 { return this.readRegister8('H'); }
    set H(value: u8) { this.writeRegister8('H', value); }

    get L(): u8 { return this.readRegister8('L'); }
    set L(value: u8) { this.writeRegister8('L', value); }


    // Flag 8-bit Register

    get F(): u8 { return this.readRegister8('F'); }
    set F(value: u8) { this.writeRegister8('F', value & 0xF0); } // Lower 4 bits always 0


    // === Flag helpers ===

    get flagZ(): bool { return (this.F & FLAG_Z) != 0; }
    get flagN(): bool { return (this.F & FLAG_N) != 0; }
    get flagH(): bool { return (this.F & FLAG_H) != 0; }
    get flagC(): bool { return (this.F & FLAG_C) != 0; }

    set flagZ(on: bool) { if (on) { this.F = this.F | FLAG_Z; } else { this.F = this.F & ~FLAG_Z; } }
    set flagN(on: bool) { if (on) { this.F = this.F | FLAG_N; } else { this.F = this.F & ~FLAG_N; } }
    set flagH(on: bool) { if (on) { this.F = this.F | FLAG_H; } else { this.F = this.F & ~FLAG_H; } }
    set flagC(on: bool) { if (on) { this.F = this.F | FLAG_C; } else { this.F = this.F & ~FLAG_C; } }

    /** Set all 4 flags at once */
    setFlags(z: bool, n: bool, h: bool, c: bool): void {
        let f: u8 = 0;
        if (z) f |= FLAG_Z;
        if (n) f |= FLAG_N;
        if (h) f |= FLAG_H;
        if (c) f |= FLAG_C;
        this.F = f;
    }


    // Control 16-bit Registers

    get PC(): u16 { return this.readRegister16('PC'); }
    set PC(value: u16) { this.writeRegister16('PC', value); }

    get SP(): u16 { return this.readRegister16('SP'); }
    set SP(value: u16) { this.writeRegister16('SP', value); }


    // Combined 8-bit Registers

    // AF (Accumulator & Flags)
    get AF(): u16 {
        const high = this.readRegister8('A');
        const low = this.readRegister8('F');
        return (low + high * 256) as u16;
    }
    set AF(value: u16) {
        const low = low16(value) & 0xF0; // Lower 4 bits of F always 0
        const high = high16(value);
        this.writeRegister8('A', high);
        this.writeRegister8('F', low);
    }

    // BC
    get BC(): u16 {
        const high = this.readRegister8('B');
        const low = this.readRegister8('C');
        return (low + high * 256) as u16;
    }
    set BC(value: u16) {
        const low = low16(value);
        const high = high16(value);
        this.writeRegister8('B', high);
        this.writeRegister8('C', low);
    }

    // DE
    get DE(): u16 {
        const high = this.readRegister8('D');
        const low = this.readRegister8('E');
        return (low + high * 256) as u16;
    }
    set DE(value: u16) {
        const low = low16(value);
        const high = high16(value);
        this.writeRegister8('D', high);
        this.writeRegister8('E', low);
    }

    // HL
    get HL(): u16 {
        const high = this.readRegister8('H');
        const low = this.readRegister8('L');
        return (low + high * 256) as u16;
    }
    set HL(value: u16) {
        const low = low16(value);
        const high = high16(value);
        this.writeRegister8('H', high);
        this.writeRegister8('L', low);
    }

}
