// Gameboy Emulator - CB Prefixed instruction dispatcher

import { Cpu } from "./Cpu";
import { executeCbPrefixed_0x00_0x7F } from "./CbPrefixedInstructionActions_0x00_0x7F";
import { executeCbPrefixed_0x80_0xFF } from "./CbPrefixedInstructionActions_0x80_0xFF";


export function executeCbPrefixed(cpu: Cpu, opcode: u8): void {
    if (opcode <= 0x7F) {
        executeCbPrefixed_0x00_0x7F(cpu, opcode);

    } else {
        executeCbPrefixed_0x80_0xFF(cpu, opcode);
    }
}
