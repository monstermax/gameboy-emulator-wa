// Gameboy Emulator - Computer

import { Cpu } from "./Cpu";
import { IoManager } from "./IoManager";
import { MemoryBus, Ram, Rom } from "./Memory";

import { InstructionSet } from '../types/cpu_instructions.types';


export class Computer {
    public memoryBus: MemoryBus | null = null;
    public cpu: Cpu | null = null;
    public rom: Rom | null;
    public ram: Ram | null;
    public ioManager: IoManager | null = null;
    public instructionsSet: InstructionSet | null;

    constructor() {
        this.memoryBus = new MemoryBus(this);
        this.cpu = new Cpu(this);
        this.rom = null;
        this.ram = null;
        this.ioManager = new IoManager(this);
        this.instructionsSet = null 
    }


    runCycles(cycles: i32): void {
        const cpu = this.cpu;
        if (!cpu) throw new Error(`Cpu not found`);

        const tsStart: i64 = Date.now();

        let cyclesDone: i64 = 0;
        for (cyclesDone=0; cyclesDone<cycles; cyclesDone++) {
            cpu.runCycle();
        }

        const tsEnd: i64 = Date.now();
        const duration: i64 = tsEnd - tsStart;

        const speed = Math.round((cyclesDone as f64) / (duration as f64) * 1000);

        console.log(`[WASM] WASM Completed (duration: ${duration} ms. for ${cyclesDone} cycles. => speed: ${speed} cycles/sec.)`)
    }

}
