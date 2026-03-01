
import { Cpu } from "./cpu";
import { IoManager } from "./ioManager";
import { MemoryBus, Ram, Rom } from "./memory";



export class Computer {
    public memoryBus: MemoryBus = new MemoryBus(this);
    public cpu: Cpu = new Cpu(this);
    public rom: Rom = new Rom(this);
    public ram: Ram = new Ram(this);
    public ioManager: IoManager = new IoManager(this);

}


