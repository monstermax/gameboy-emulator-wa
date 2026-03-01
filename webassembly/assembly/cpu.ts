
import { Computer } from "./Computer";
import { high16, low16, toHex } from "./lib/lib_numbers";
import { asserts } from "./utils";


const registers8 = [
    'A', 'B', 'C', 'D', // Data 8-bit Registers
    'H', 'L',           // Data 8-bit Registers
    'F',                // Flags 8-bit Register ( bit7 = z = Zero flag | bit6 = n = Subtraction flag | bit5 = h = Half Carry flag | bit4 = c = Carry flag)
];

const registers16 = [
    'SP', 'PC', // Control 16-bit Registers
    'AF', 'BC', 'DE', 'HL', // 16-bit combined registers (each one is 2x 8-bit registers)
];



class Instrution {
    public opcode: u8 = 0;
    public prefixedOpcode: u8 = 0;
    public bytes: u16 = 0;

    constructor(opcode: u8) {
        this.opcode = opcode;
    }
}


class InstructionActions {
    public fetchData: (cpu: Cpu) => Uint8Array;
    public execute: (cpu: Cpu) => void;

    constructor(fetchData: (cpu: Cpu) => Uint8Array, execute: (cpu: Cpu) => void) {
        this.fetchData = fetchData;
        this.execute = execute;
    }
}


export class Cpu {
    private computer: Computer;
    public registers: CpuRegisters = new CpuRegisters;

    private instruction: Instrution = new Instrution(0);
    private actions: InstructionActions = new InstructionActions(() => new Uint8Array(0), () => {});
    private fetchedData: Uint8Array = new Uint8Array(0);


    constructor(computer: Computer) {
        this.computer = computer
    }


    runCycle(): void {
        this.fetchInstruction();
        this.fetchInstructionData();
        this.executeInstruction();
    }


    fetchInstruction(): void {
        const PC = this.registers.PC;
        const instructionCode = this.readMemory8(PC);

        this.instruction = new Instrution(instructionCode)

        this.loadInstructionActions()
    }


    loadInstructionActions(): void {
        let fetchData: (cpu: Cpu) => Uint8Array = () => new Uint8Array(0);
        let execute: (cpu: Cpu) => void = () => {};


        switch (this.instruction.opcode) {
            case 0x00: // NOP
                execute = function (cpu: Cpu) {
                    cpu.registers.PC = cpu.instruction.bytes;
                }
                break;

            default:
                console.warn(`Instruction "${toHex(this.instruction.opcode)}" not found`);
                break;
        }

        this.actions.fetchData = fetchData;
        this.actions.execute = execute;
    }

    fetchInstructionData(): void {
        this.fetchedData = this.actions.fetchData(this)
    }

    executeInstruction(): void {
        this.actions.execute(this)
    }


    readMemory8(address: u16): u8 {
        const value = this.computer.memoryBus.read(address);
        return value;
    }

    readMemory16(address: u16): u16 {
        const low = this.computer.memoryBus.read(address);
        const high = this.computer.memoryBus.read(address + 1);
        const value = low + high * 256;
        return value;
    }

    writeMemory8(address: u16, value: u8): void {
        this.computer.memoryBus.write(address, value);
    }

    writeMemory16(address: u16, value: u8): void {
        const low = low16(value);
        const high = high16(value);

        this.computer.memoryBus.write(address, low);
        this.computer.memoryBus.write(address + 1, high);
    }
}


class CpuRegisters {
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

    get A(): u8 {
        return this.readRegister8('A');
    }
    set A(value: u8) {
        this.writeRegister8('A', value);
    }

    get B(): u8 {
        return this.readRegister8('B');
    }
    set B(value: u8) {
        this.writeRegister8('B', value);
    }

    get C(): u8 {
        return this.readRegister8('C');
    }
    set C(value: u8) {
        this.writeRegister8('C', value);
    }

    get D(): u8 {
        return this.readRegister8('D');
    }
    set D(value: u8) {
        this.writeRegister8('D', value);
    }

    get H(): u8 {
        return this.readRegister8('H');
    }
    set H(value: u8) {
        this.writeRegister8('H', value);
    }

    get L(): u8 {
        return this.readRegister8('L');
    }
    set L(value: u8) {
        this.writeRegister8('L', value);
    }


    // Flag 8-bit Register

    get F(): u8 {
        return this.readRegister8('F');
    }
    set F(value: u8) {
        this.writeRegister8('F', value);
    }


    // Control 16-bit Registers

    get PC(): u16 {
        return this.readRegister16('PC');
    }
    set PC(value: u16) {
        this.writeRegister16('PC', value);
    }

    get SP(): u16 {
        return this.readRegister16('SP');
    }
    set SP(value: u16) {
        this.writeRegister16('SP', value);
    }


    // Combined 8-bit Registers

    // AF (Accumulator & Flags)
    get AF(): u16 {
        const high = this.readRegister8('A');
        const low = this.readRegister8('F');
        return low + high * 256;
    }
    set AF(value: u16) {
        const low = low16(value);
        const high = high16(value);
        this.writeRegister8('A', high);
        this.writeRegister8('F', low);
    }

    // BC
    get BC(): u16 {
        const high = this.readRegister8('B');
        const low = this.readRegister8('C');
        return low + high * 256;
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
        return low + high * 256;
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
        return low + high * 256;
    }
    set HL(value: u16) {
        const low = low16(value);
        const high = high16(value);
        this.writeRegister8('H', high);
        this.writeRegister8('L', low);
    }

}

