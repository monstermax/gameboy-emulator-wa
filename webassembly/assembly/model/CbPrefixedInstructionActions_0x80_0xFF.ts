// Gameboy Emulator - CB Prefixed 0x80-0xFF

// RES b, r8 (0x80-0xBF) and SET b, r8 (0xC0-0xFF)

import { Cpu } from "./Cpu";


export function executeCbPrefixed_0x80_0xFF(cpu: Cpu, opcode: u8): void {
    const r = cpu.registers;

    switch (opcode) {

        // RES 0 (0x80-0x87)
        case 0x80: r.B &= ~0x01; r.PC += 1; break;
        case 0x81: r.C &= ~0x01; r.PC += 1; break;
        case 0x82: r.D &= ~0x01; r.PC += 1; break;
        case 0x83: r.E &= ~0x01; r.PC += 1; break;
        case 0x84: r.H &= ~0x01; r.PC += 1; break;
        case 0x85: r.L &= ~0x01; r.PC += 1; break;
        case 0x86: cpu.writeMemory8(r.HL, cpu.readMemory8(r.HL) & ~0x01); r.PC += 1; break;
        case 0x87: r.A &= ~0x01; r.PC += 1; break;

        // RES 1 (0x88-0x8F)
        case 0x88: r.B &= ~0x02; r.PC += 1; break;
        case 0x89: r.C &= ~0x02; r.PC += 1; break;
        case 0x8A: r.D &= ~0x02; r.PC += 1; break;
        case 0x8B: r.E &= ~0x02; r.PC += 1; break;
        case 0x8C: r.H &= ~0x02; r.PC += 1; break;
        case 0x8D: r.L &= ~0x02; r.PC += 1; break;
        case 0x8E: cpu.writeMemory8(r.HL, cpu.readMemory8(r.HL) & ~0x02); r.PC += 1; break;
        case 0x8F: r.A &= ~0x02; r.PC += 1; break;

        // RES 2 (0x90-0x97)
        case 0x90: r.B &= ~0x04; r.PC += 1; break;
        case 0x91: r.C &= ~0x04; r.PC += 1; break;
        case 0x92: r.D &= ~0x04; r.PC += 1; break;
        case 0x93: r.E &= ~0x04; r.PC += 1; break;
        case 0x94: r.H &= ~0x04; r.PC += 1; break;
        case 0x95: r.L &= ~0x04; r.PC += 1; break;
        case 0x96: cpu.writeMemory8(r.HL, cpu.readMemory8(r.HL) & ~0x04); r.PC += 1; break;
        case 0x97: r.A &= ~0x04; r.PC += 1; break;

        // RES 3 (0x98-0x9F)
        case 0x98: r.B &= ~0x08; r.PC += 1; break;
        case 0x99: r.C &= ~0x08; r.PC += 1; break;
        case 0x9A: r.D &= ~0x08; r.PC += 1; break;
        case 0x9B: r.E &= ~0x08; r.PC += 1; break;
        case 0x9C: r.H &= ~0x08; r.PC += 1; break;
        case 0x9D: r.L &= ~0x08; r.PC += 1; break;
        case 0x9E: cpu.writeMemory8(r.HL, cpu.readMemory8(r.HL) & ~0x08); r.PC += 1; break;
        case 0x9F: r.A &= ~0x08; r.PC += 1; break;

        // RES 4 (0xA0-0xA7)
        case 0xA0: r.B &= ~0x10; r.PC += 1; break;
        case 0xA1: r.C &= ~0x10; r.PC += 1; break;
        case 0xA2: r.D &= ~0x10; r.PC += 1; break;
        case 0xA3: r.E &= ~0x10; r.PC += 1; break;
        case 0xA4: r.H &= ~0x10; r.PC += 1; break;
        case 0xA5: r.L &= ~0x10; r.PC += 1; break;
        case 0xA6: cpu.writeMemory8(r.HL, cpu.readMemory8(r.HL) & ~0x10); r.PC += 1; break;
        case 0xA7: r.A &= ~0x10; r.PC += 1; break;

        // RES 5 (0xA8-0xAF)
        case 0xA8: r.B &= ~0x20; r.PC += 1; break;
        case 0xA9: r.C &= ~0x20; r.PC += 1; break;
        case 0xAA: r.D &= ~0x20; r.PC += 1; break;
        case 0xAB: r.E &= ~0x20; r.PC += 1; break;
        case 0xAC: r.H &= ~0x20; r.PC += 1; break;
        case 0xAD: r.L &= ~0x20; r.PC += 1; break;
        case 0xAE: cpu.writeMemory8(r.HL, cpu.readMemory8(r.HL) & ~0x20); r.PC += 1; break;
        case 0xAF: r.A &= ~0x20; r.PC += 1; break;

        // RES 6 (0xB0-0xB7)
        case 0xB0: r.B &= ~0x40; r.PC += 1; break;
        case 0xB1: r.C &= ~0x40; r.PC += 1; break;
        case 0xB2: r.D &= ~0x40; r.PC += 1; break;
        case 0xB3: r.E &= ~0x40; r.PC += 1; break;
        case 0xB4: r.H &= ~0x40; r.PC += 1; break;
        case 0xB5: r.L &= ~0x40; r.PC += 1; break;
        case 0xB6: cpu.writeMemory8(r.HL, cpu.readMemory8(r.HL) & ~0x40); r.PC += 1; break;
        case 0xB7: r.A &= ~0x40; r.PC += 1; break;

        // RES 7 (0xB8-0xBF)
        case 0xB8: r.B &= ~0x80; r.PC += 1; break;
        case 0xB9: r.C &= ~0x80; r.PC += 1; break;
        case 0xBA: r.D &= ~0x80; r.PC += 1; break;
        case 0xBB: r.E &= ~0x80; r.PC += 1; break;
        case 0xBC: r.H &= ~0x80; r.PC += 1; break;
        case 0xBD: r.L &= ~0x80; r.PC += 1; break;
        case 0xBE: cpu.writeMemory8(r.HL, cpu.readMemory8(r.HL) & ~0x80); r.PC += 1; break;
        case 0xBF: r.A &= ~0x80; r.PC += 1; break;

        // SET 0 (0xC0-0xC7)
        case 0xC0: r.B |= 0x01; r.PC += 1; break;
        case 0xC1: r.C |= 0x01; r.PC += 1; break;
        case 0xC2: r.D |= 0x01; r.PC += 1; break;
        case 0xC3: r.E |= 0x01; r.PC += 1; break;
        case 0xC4: r.H |= 0x01; r.PC += 1; break;
        case 0xC5: r.L |= 0x01; r.PC += 1; break;
        case 0xC6: cpu.writeMemory8(r.HL, cpu.readMemory8(r.HL) | 0x01); r.PC += 1; break;
        case 0xC7: r.A |= 0x01; r.PC += 1; break;

        // SET 1 (0xC8-0xCF)
        case 0xC8: r.B |= 0x02; r.PC += 1; break;
        case 0xC9: r.C |= 0x02; r.PC += 1; break;
        case 0xCA: r.D |= 0x02; r.PC += 1; break;
        case 0xCB: r.E |= 0x02; r.PC += 1; break;
        case 0xCC: r.H |= 0x02; r.PC += 1; break;
        case 0xCD: r.L |= 0x02; r.PC += 1; break;
        case 0xCE: cpu.writeMemory8(r.HL, cpu.readMemory8(r.HL) | 0x02); r.PC += 1; break;
        case 0xCF: r.A |= 0x02; r.PC += 1; break;

        // SET 2 (0xD0-0xD7)
        case 0xD0: r.B |= 0x04; r.PC += 1; break;
        case 0xD1: r.C |= 0x04; r.PC += 1; break;
        case 0xD2: r.D |= 0x04; r.PC += 1; break;
        case 0xD3: r.E |= 0x04; r.PC += 1; break;
        case 0xD4: r.H |= 0x04; r.PC += 1; break;
        case 0xD5: r.L |= 0x04; r.PC += 1; break;
        case 0xD6: cpu.writeMemory8(r.HL, cpu.readMemory8(r.HL) | 0x04); r.PC += 1; break;
        case 0xD7: r.A |= 0x04; r.PC += 1; break;

        // SET 3 (0xD8-0xDF)
        case 0xD8: r.B |= 0x08; r.PC += 1; break;
        case 0xD9: r.C |= 0x08; r.PC += 1; break;
        case 0xDA: r.D |= 0x08; r.PC += 1; break;
        case 0xDB: r.E |= 0x08; r.PC += 1; break;
        case 0xDC: r.H |= 0x08; r.PC += 1; break;
        case 0xDD: r.L |= 0x08; r.PC += 1; break;
        case 0xDE: cpu.writeMemory8(r.HL, cpu.readMemory8(r.HL) | 0x08); r.PC += 1; break;
        case 0xDF: r.A |= 0x08; r.PC += 1; break;

        // SET 4 (0xE0-0xE7)
        case 0xE0: r.B |= 0x10; r.PC += 1; break;
        case 0xE1: r.C |= 0x10; r.PC += 1; break;
        case 0xE2: r.D |= 0x10; r.PC += 1; break;
        case 0xE3: r.E |= 0x10; r.PC += 1; break;
        case 0xE4: r.H |= 0x10; r.PC += 1; break;
        case 0xE5: r.L |= 0x10; r.PC += 1; break;
        case 0xE6: cpu.writeMemory8(r.HL, cpu.readMemory8(r.HL) | 0x10); r.PC += 1; break;
        case 0xE7: r.A |= 0x10; r.PC += 1; break;

        // SET 5 (0xE8-0xEF)
        case 0xE8: r.B |= 0x20; r.PC += 1; break;
        case 0xE9: r.C |= 0x20; r.PC += 1; break;
        case 0xEA: r.D |= 0x20; r.PC += 1; break;
        case 0xEB: r.E |= 0x20; r.PC += 1; break;
        case 0xEC: r.H |= 0x20; r.PC += 1; break;
        case 0xED: r.L |= 0x20; r.PC += 1; break;
        case 0xEE: cpu.writeMemory8(r.HL, cpu.readMemory8(r.HL) | 0x20); r.PC += 1; break;
        case 0xEF: r.A |= 0x20; r.PC += 1; break;

        // SET 6 (0xF0-0xF7)
        case 0xF0: r.B |= 0x40; r.PC += 1; break;
        case 0xF1: r.C |= 0x40; r.PC += 1; break;
        case 0xF2: r.D |= 0x40; r.PC += 1; break;
        case 0xF3: r.E |= 0x40; r.PC += 1; break;
        case 0xF4: r.H |= 0x40; r.PC += 1; break;
        case 0xF5: r.L |= 0x40; r.PC += 1; break;
        case 0xF6: cpu.writeMemory8(r.HL, cpu.readMemory8(r.HL) | 0x40); r.PC += 1; break;
        case 0xF7: r.A |= 0x40; r.PC += 1; break;

        // SET 7 (0xF8-0xFF)
        case 0xF8: r.B |= 0x80; r.PC += 1; break;
        case 0xF9: r.C |= 0x80; r.PC += 1; break;
        case 0xFA: r.D |= 0x80; r.PC += 1; break;
        case 0xFB: r.E |= 0x80; r.PC += 1; break;
        case 0xFC: r.H |= 0x80; r.PC += 1; break;
        case 0xFD: r.L |= 0x80; r.PC += 1; break;
        case 0xFE: cpu.writeMemory8(r.HL, cpu.readMemory8(r.HL) | 0x80); r.PC += 1; break;
        case 0xFF: r.A |= 0x80; r.PC += 1; break;

        default: break;
    }
}
