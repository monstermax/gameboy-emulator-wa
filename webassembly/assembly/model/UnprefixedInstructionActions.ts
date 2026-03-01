// Gameboy Emulator - Unprefixed instruction dispatcher

import { Cpu } from "./Cpu";
import { executeUnprefixed_0x00_0x7F } from "./UnprefixedInstructionActions_0x00_0x7F";
import { executeUnprefixed_0x80_0xFF } from "./UnprefixedInstructionActions_0x80_0xFF";


export function executeUnprefixed(cpu: Cpu, opcode: u8): void {
    if (opcode <= 0x7F) {
        executeUnprefixed_0x00_0x7F(cpu, opcode);

    } else {
        executeUnprefixed_0x80_0xFF(cpu, opcode);
    }
}
