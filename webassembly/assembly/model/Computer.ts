// Gameboy Emulator - Computer

import { Cpu } from "./Cpu";
import { IoManager } from "./IoManager";
import { Mbc } from "./Mbc";
import { MemoryBus } from "./Memory";
import { Ppu } from "./Ppu";
import { Apu } from "./Apu";

import { InstructionSet } from '../types/cpu_instructions.types';


export class Computer {
    public memoryBus: MemoryBus | null = null;
    public cpu: Cpu | null = null;
    public mbc: Mbc | null = null;
    public ioManager: IoManager | null = null;
    public ppu: Ppu | null = null;
    public apu: Apu | null = null;
    public instructionsSet: InstructionSet | null;
    public frames: i64 = 0;

    constructor() {
        this.memoryBus = new MemoryBus(this);
        this.cpu = new Cpu(this);
        this.ioManager = new IoManager(this);
        this.ppu = new Ppu(this);
        this.apu = new Apu(this);
        this.instructionsSet = null;
    }


    runCycles(cycles: i32): void {
        const cpu = this.cpu;
        if (!cpu) throw new Error(`Cpu not found`);

        const ppu = this.ppu;
        const apu = this.apu;

        for (let i: i32 = 0; i < cycles; i++) {
            cpu.runCycle();
            const tc = cpu.lastCycles;
            if (ppu) ppu.tick(tc);
            if (apu) apu.tick(tc);
        }
    }


    /**
     * Run until the PPU produces a complete frame (~70224 T-cycles).
     */
    runFrame(maxCycles: i32 = 70224): void {
        const cpu = this.cpu;
        if (!cpu) throw new Error(`Cpu not found`);

        const ppu = this.ppu;
        if (!ppu) throw new Error(`Ppu not found`);

        const apu = this.apu;

        // Reset audio sample count for this frame
        if (apu) apu.sampleCount = 0;

        ppu.frameReady = false;

        let cyclesDone: i32 = 0;
        while (!ppu.frameReady && cyclesDone < maxCycles) {
            cpu.runCycle();
            const tc = cpu.lastCycles;
            ppu.tick(tc);
            if (apu) apu.tick(tc);
            cyclesDone += tc;
        }

        this.frames++;
    }
}
