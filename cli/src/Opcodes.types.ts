

export type Hex = `0x${string}`;


export type Opcodes = {
    unprefixed: Record<Hex, Opcode>;
    cbprefixed: Record<Hex, Opcode>;
}


export type Opcode = {
      mnemonic: string,
      bytes: number,
      cycles: number[],
      operands: Operand[],
      immediate: boolean,
      flags: {
        "Z": "Z" | "0" | "1" | "-",
        "N": "N" | "0" | "1" | "-",
        "H": "H" | "0" | "1" | "-",
        "C": "C" | "0" | "1" | "-",
      }
}


export type Operand = {
    name: string,
    immediate: boolean,
    increment?: boolean,
    decrement?: boolean,
    bytes?: number,
}

