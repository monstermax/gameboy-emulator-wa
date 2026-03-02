// Gameboy Emulator - Timer

// https://gbdev.io/pandocs/Timer_and_Divider_Registers.html
//
// DIV  (FF04): Increments at 16384 Hz (every 256 T-cycles). Reset to 0 on write.
//              Internally this is the upper 8 bits of a 16-bit system counter.
//
// TIMA (FF05): Timer counter. Increments at frequency set by TAC.
//              When it overflows (>0xFF), it reloads from TMA and fires INT Timer.
//
// TMA  (FF06): Timer modulo. Value loaded into TIMA on overflow.
//
// TAC  (FF07): Timer control.
//              Bit 2: Enable timer
//              Bits 0-1: Clock select
//                00 = 4096 Hz   (1024 T-cycles)
//                01 = 262144 Hz (16 T-cycles)
//                10 = 65536 Hz  (64 T-cycles)
//                11 = 16384 Hz  (256 T-cycles)

import { Computer } from "./Computer";


// IO register offsets
const IO_DIV: u16  = 0x04;
const IO_TIMA: u16 = 0x05;
const IO_TMA: u16  = 0x06;
const IO_TAC: u16  = 0x07;

// Timer interrupt bit (IF register)
const INT_TIMER: u8 = 0x04;

// Clock dividers: TAC bits 0-1 select the bit of the system counter to watch
// When that bit goes from 1→0, TIMA increments
const TAC_CLOCK_BITS: StaticArray<i32> = StaticArray.fromArray<i32>([
    9,  // 00: bit 9 of syscounter → 4096 Hz (every 1024 T-cycles)
    3,  // 01: bit 3 → 262144 Hz (every 16 T-cycles)
    5,  // 10: bit 5 → 65536 Hz (every 64 T-cycles)
    7,  // 11: bit 7 → 16384 Hz (every 256 T-cycles)
]);


export class Timer {
    private computer: Computer;

    // Internal 16-bit system counter (DIV = upper 8 bits = bits 15-8)
    private sysCounter: u16 = 0;


    constructor(computer: Computer) {
        this.computer = computer;
        // Post-boot DIV value (~0xAB in the upper byte)
        this.sysCounter = 0xAB00;
    }


    /** Tick the timer by tCycles T-cycles */
    tick(tCycles: i32): void {
        const io = this.computer.ioManager;
        if (!io) return;

        for (let i: i32 = 0; i < tCycles; i++) {
            const oldCounter = this.sysCounter;
            this.sysCounter = this.sysCounter + 1;

            // Update DIV register (upper 8 bits of sysCounter)
            io.registers[IO_DIV] = <u8>(this.sysCounter >> 8);

            // Check TIMA increment via falling edge detection
            const tac = io.registers[IO_TAC];
            const timerEnabled = (tac & 0x04) != 0;

            if (timerEnabled) {
                const clockBit = unchecked(TAC_CLOCK_BITS[tac & 0x03]);

                // Falling edge: old bit was 1, new bit is 0
                const oldBit = ((oldCounter as i32) >> (clockBit as i32)) & 1;
                const newBit = (((this.sysCounter as i32) >> (clockBit as i32)) & (1 as i32)) as i32;

                if (oldBit == 1 && newBit == 0) {
                    let tima: u16 = <u16>io.registers[IO_TIMA] + 1;

                    if (tima > 0xFF) {
                        // Overflow: reload from TMA, request timer interrupt
                        io.registers[IO_TIMA] = io.registers[IO_TMA];
                        const ifReg = io.registers[0x0F]; // IF
                        io.registers[0x0F] = ifReg | INT_TIMER;

                    } else {
                        io.registers[IO_TIMA] = <u8>tima;
                    }
                }
            }
        }
    }


    /** Called when DIV is written to — resets the entire system counter */
    resetDiv(): void {
        this.sysCounter = 0;
        const io = this.computer.ioManager;
        if (io) io.registers[IO_DIV] = 0;
    }
}
