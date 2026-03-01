// Gameboy Emulator - CPU Registers

// Storage: StaticArray indexed by numeric constants (no Map, no string lookups)
// Public API unchanged: A, B, C, D, E, H, L, F, AF, BC, DE, HL, SP, PC, flags


// === 8-bit register indices ===
const REG_A: i32 = 0;
const REG_B: i32 = 1;
const REG_C: i32 = 2;
const REG_D: i32 = 3;
const REG_E: i32 = 4;
const REG_H: i32 = 5;
const REG_L: i32 = 6;
const REG_F: i32 = 7;
const REG8_COUNT: i32 = 8;

// Flag bit masks
const FLAG_Z: u8 = 0x80; // bit 7 - Zero
const FLAG_N: u8 = 0x40; // bit 6 - Subtraction
const FLAG_H: u8 = 0x20; // bit 5 - Half Carry
const FLAG_C: u8 = 0x10; // bit 4 - Carry


export class CpuRegisters {
    private r: StaticArray<u8> = new StaticArray<u8>(REG8_COUNT);

    // 16-bit registers stored directly (not in the array)
    private _sp: u16 = 0;
    private _pc: u16 = 0;


    constructor() {
        this.initRegisters();
    }

    initRegisters(): void {
        for (let i: i32 = 0; i < REG8_COUNT; i++) {
            unchecked(this.r[i] = 0);
        }
        this._sp = 0;
        this._pc = 0;
    }


    // === 8-bit registers ===

    get A(): u8 { return unchecked(this.r[REG_A]); }
    set A(v: u8) { unchecked(this.r[REG_A] = v); }

    get B(): u8 { return unchecked(this.r[REG_B]); }
    set B(v: u8) { unchecked(this.r[REG_B] = v); }

    get C(): u8 { return unchecked(this.r[REG_C]); }
    set C(v: u8) { unchecked(this.r[REG_C] = v); }

    get D(): u8 { return unchecked(this.r[REG_D]); }
    set D(v: u8) { unchecked(this.r[REG_D] = v); }

    get E(): u8 { return unchecked(this.r[REG_E]); }
    set E(v: u8) { unchecked(this.r[REG_E] = v); }

    get H(): u8 { return unchecked(this.r[REG_H]); }
    set H(v: u8) { unchecked(this.r[REG_H] = v); }

    get L(): u8 { return unchecked(this.r[REG_L]); }
    set L(v: u8) { unchecked(this.r[REG_L] = v); }

    get F(): u8 { return unchecked(this.r[REG_F]); }
    set F(v: u8) { unchecked(this.r[REG_F] = v & 0xF0); } // Lower 4 bits always 0


    // === Flag helpers ===

    get flagZ(): bool { return (unchecked(this.r[REG_F]) & FLAG_Z) != 0; }
    get flagN(): bool { return (unchecked(this.r[REG_F]) & FLAG_N) != 0; }
    get flagH(): bool { return (unchecked(this.r[REG_F]) & FLAG_H) != 0; }
    get flagC(): bool { return (unchecked(this.r[REG_F]) & FLAG_C) != 0; }

    set flagZ(on: bool) {
        const f = unchecked(this.r[REG_F]);
        unchecked(this.r[REG_F] = on ? (f | FLAG_Z) : (f & ~FLAG_Z));
    }
    set flagN(on: bool) {
        const f = unchecked(this.r[REG_F]);
        unchecked(this.r[REG_F] = on ? (f | FLAG_N) : (f & ~FLAG_N));
    }
    set flagH(on: bool) {
        const f = unchecked(this.r[REG_F]);
        unchecked(this.r[REG_F] = on ? (f | FLAG_H) : (f & ~FLAG_H));
    }
    set flagC(on: bool) {
        const f = unchecked(this.r[REG_F]);
        unchecked(this.r[REG_F] = on ? (f | FLAG_C) : (f & ~FLAG_C));
    }

    /** Set all 4 flags at once */
    setFlags(z: bool, n: bool, h: bool, c: bool): void {
        let f: u8 = 0;
        if (z) f |= FLAG_Z;
        if (n) f |= FLAG_N;
        if (h) f |= FLAG_H;
        if (c) f |= FLAG_C;
        unchecked(this.r[REG_F] = f);
    }


    // === 16-bit control registers ===

    get PC(): u16 { return this._pc; }
    set PC(v: u16) { this._pc = v; }

    get SP(): u16 { return this._sp; }
    set SP(v: u16) { this._sp = v; }


    // === 16-bit combined registers ===

    get AF(): u16 {
        return (<u16>unchecked(this.r[REG_A]) << 8) | <u16>unchecked(this.r[REG_F]);
    }
    set AF(v: u16) {
        unchecked(this.r[REG_A] = <u8>(v >> 8));
        unchecked(this.r[REG_F] = <u8>(v & 0xF0)); // Lower 4 bits of F always 0
    }

    get BC(): u16 {
        return (<u16>unchecked(this.r[REG_B]) << 8) | <u16>unchecked(this.r[REG_C]);
    }
    set BC(v: u16) {
        unchecked(this.r[REG_B] = <u8>(v >> 8));
        unchecked(this.r[REG_C] = <u8>(v & 0xFF));
    }

    get DE(): u16 {
        return (<u16>unchecked(this.r[REG_D]) << 8) | <u16>unchecked(this.r[REG_E]);
    }
    set DE(v: u16) {
        unchecked(this.r[REG_D] = <u8>(v >> 8));
        unchecked(this.r[REG_E] = <u8>(v & 0xFF));
    }

    get HL(): u16 {
        return (<u16>unchecked(this.r[REG_H]) << 8) | <u16>unchecked(this.r[REG_L]);
    }
    set HL(v: u16) {
        unchecked(this.r[REG_H] = <u8>(v >> 8));
        unchecked(this.r[REG_L] = <u8>(v & 0xFF));
    }
}
