
import { Cpu } from "./cpu";
import { IoManager } from "./ioManager";
import { MemoryBus, Ram, Rom } from "./memory";

import { InstructionSet } from './cpu_instructions.types';


// Gameboy Emulator - Computer


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
}
