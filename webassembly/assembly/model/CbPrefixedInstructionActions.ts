// Gameboy Emulator - CPU Instructions - CB Prefixed (dispatcher)

import { CpuInstrution, InstructionActions } from "./CpuInstrution";
import { loadPrefixedInstructionActions_0x00_0x7F } from "./CbPrefixedInstructionActions_0x00_0x7F";
import { loadPrefixedInstructionActions_0x80_0xFF } from "./CbPrefixedInstructionActions_0x80_0xFF";


export function loadPrefixedInstructionActions(instruction: CpuInstrution): InstructionActions {
    if (instruction.opcode <= 0x7F) {
        return loadPrefixedInstructionActions_0x00_0x7F(instruction);

    } else {
        return loadPrefixedInstructionActions_0x80_0xFF(instruction);
    }
}
