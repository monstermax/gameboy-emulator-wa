// Gameboy Emulator - CPU Instructions - Unprefixed (dispatcher)

import { CpuInstrution, InstructionActions } from "./CpuInstrution";
import { loadInstructionActions_0x00_0x7F } from "./UnprefixedInstructionActions_0x00_0x7F";
import { loadInstructionActions_0x80_0xFF } from "./UnprefixedInstructionActions_0x80_0xFF";


export function loadInstructionActions(instruction: CpuInstrution): InstructionActions {
    if (instruction.opcode <= 0x7F) {
        return loadInstructionActions_0x00_0x7F(instruction);

    } else {
        return loadInstructionActions_0x80_0xFF(instruction);
    }
}
