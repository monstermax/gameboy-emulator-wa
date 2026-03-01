// Gameboy Emulator - Computer

import { Cpu } from "./Cpu";
import { IoManager } from "./IoManager";
import { Mbc } from "./Mbc";
import { MemoryBus } from "./Memory";
import { Ppu } from "./Ppu";

import { InstructionSet } from '../types/cpu_instructions.types';


export class Computer {
    public memoryBus: MemoryBus | null = null;
    public cpu: Cpu | null = null;
    public mbc: Mbc | null = null;
    public ioManager: IoManager | null = null;
    public ppu: Ppu | null = null;
    public instructionsSet: InstructionSet | null;
    public frames: i64 = 0;

    constructor() {
        this.memoryBus = new MemoryBus(this);
        this.cpu = new Cpu(this);
        this.ioManager = new IoManager(this);
        this.ppu = new Ppu(this);
        this.instructionsSet = null;
    }


    /**
     * Run the emulator for N instructions.
     * Each CPU instruction ticks the PPU by its cycle cost (in T-cycles).
     * Returns when a full frame has been rendered or when all cycles are done.
     */
    runCycles(cycles: i32): void {
        const cpu = this.cpu;
        if (!cpu) throw new Error(`Cpu not found`);

        const tsStart: i64 = Date.now();

        const ppu = this.ppu;
        let cyclesDone = 0;

        for (let i: i32 = 0; i < cycles; i++) {
            cpu.runCycle();

            // Tick the PPU with the T-cycle cost of the executed instruction
            // For now, use the instruction's cycle count from the JSON data
            // Default to 4 T-cycles if not available
            if (ppu) {
                const instruction = cpu.instruction;
                let tCycles: i32 = 4; // default: 1 M-cycle = 4 T-cycles

                if (instruction && instruction.cycles.length > 0) {
                    tCycles = instruction.cycles[0];
                }

                ppu.tick(tCycles);
            }

            cyclesDone++;
        }

        const tsEnd: i64 = Date.now();
        const duration: i64 = tsEnd - tsStart;

        const speed = Math.round((cyclesDone as f64) / (duration as f64) * 1000);

        console.log(`[WASM] WASM Completed (duration: ${duration} ms. for ${cyclesDone} cycles. => speed: ${speed} cycles/sec.)`)
    }


    /**
     * Run until the next frame is ready (PPU has completed a full frame).
     * Returns when frameReady is set by the PPU, or after maxCycles as safety.
     */
    runFrame(maxCycles: i32 = 70224): void {
        const cpu = this.cpu;
        if (!cpu) throw new Error(`Cpu not found`);

        const ppu = this.ppu;
        if (!ppu) throw new Error(`Ppu not found`);

        ppu.frameReady = false;

        let cyclesDone: i32 = 0;
        while (!ppu.frameReady && cyclesDone < maxCycles) {
            cpu.runCycle();

            const instruction = cpu.instruction;
            let tCycles: i32 = 4;
            if (instruction && instruction.cycles.length > 0) {
                tCycles = instruction.cycles[0];
            }

            ppu.tick(tCycles);
            cyclesDone += tCycles;
        }

        this.frames++
    }
}
