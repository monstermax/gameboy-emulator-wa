// Gameboy Emulator - Memory Bank Controllers (MBC)

import { toHex } from "../lib/lib_numbers";


// ============================================================================
//  Constants
// ============================================================================

const ROM_BANK_SIZE: u32 = 0x4000;  // 16 KB par bank
const RAM_BANK_SIZE: u32 = 0x2000;  // 8 KB par bank

// Zones d'adresses cartouche
const ROM_BANK0_START: u16 = 0x0000;
const ROM_BANK0_END: u16   = 0x3FFF;
const ROM_BANKN_START: u16 = 0x4000;
const ROM_BANKN_END: u16   = 0x7FFF;
const EXT_RAM_START: u16   = 0xA000;
const EXT_RAM_END: u16     = 0xBFFF;


// ============================================================================
//  Abstract MBC
// ============================================================================

export abstract class Mbc {
    protected romData: StaticArray<u8>;
    protected extRam: StaticArray<u8> = new StaticArray<u8>(0);
    protected cartridgeType: u8;
    protected romBankCount: u32;
    protected ramBankCount: u32;
    protected hasRam: bool;
    protected hasBattery: bool;

    constructor(
        romData: StaticArray<u8>,
        cartridgeType: u8,
        romSizeCode: u8,
        ramSizeCode: u8,
    ) {
        this.romData = romData;
        this.cartridgeType = cartridgeType;
        this.romBankCount = getRomBankCount(romSizeCode);
        this.ramBankCount = getRamBankCount(ramSizeCode);
        this.hasRam = this.ramBankCount > 0;
        this.hasBattery = isBatteryType(cartridgeType);

        const extRamSize = this.ramBankCount * RAM_BANK_SIZE;
        this.extRam = new StaticArray<u8>(extRamSize);

        console.log(`[WASM] MBC | Type: ${toHex(cartridgeType)} | ROM Banks: ${this.romBankCount} | RAM Banks: ${this.ramBankCount} | Battery: ${this.hasBattery ? "Y" : "N"}`);
    }

    /** Lecture dans la zone cartouche (0x0000-0x7FFF ou 0xA000-0xBFFF) */
    abstract read(address: u16): u8;

    /** Écriture dans la zone cartouche (registres MBC ou External RAM) */
    abstract write(address: u16, value: u8): void;

    /** Lecture safe dans romData avec masquage si l'adresse dépasse */
    protected readRom(offset: u32): u8 {
        if (offset >= <u32>this.romData.length) {
            // Wrap autour de la taille réelle de la ROM
            return this.romData[offset % <u32>this.romData.length];
        }
        return this.romData[offset];
    }
}


// ============================================================================
//  NoMbc (Cartridge type 0x00 : ROM only, éventuellement + RAM)
// ============================================================================

export class NoMbc extends Mbc {
    constructor(
        romData: StaticArray<u8>,
        cartridgeType: u8,
        romSizeCode: u8,
        ramSizeCode: u8,
    ) {
        super(romData, cartridgeType, romSizeCode, ramSizeCode);
    }

    read(address: u16): u8 {
        // ROM: 0x0000-0x7FFF => accès direct
        if (address <= ROM_BANKN_END) {
            return this.readRom(<u32>address);
        }

        // External RAM: 0xA000-0xBFFF
        if (address >= EXT_RAM_START && address <= EXT_RAM_END) {
            if (!this.hasRam) return 0xFF;
            const offset = address - EXT_RAM_START;
            return this.extRam[offset];
        }

        return 0xFF;
    }

    write(address: u16, value: u8): void {
        // Pas de registres MBC — les écritures en zone ROM sont ignorées

        // External RAM: 0xA000-0xBFFF
        if (address >= EXT_RAM_START && address <= EXT_RAM_END) {
            if (!this.hasRam) return;
            const offset = address - EXT_RAM_START;
            this.extRam[offset] = value;
            return;
        }

        // Écriture en zone ROM => ignorée silencieusement
    }
}


// ============================================================================
//  MBC1 (Cartridge types 0x01, 0x02, 0x03)
// ============================================================================
//
//  Registres contrôlés par écriture en zone ROM :
//    0x0000-0x1FFF : RAM Enable       (0x0A = enable, autre = disable)
//    0x2000-0x3FFF : ROM Bank Number  (5 bits bas, valeur 0 traitée comme 1)
//    0x4000-0x5FFF : RAM Bank / Upper ROM bits (2 bits)
//    0x6000-0x7FFF : Banking Mode     (0 = ROM mode, 1 = RAM mode)
//
//  En mode 0 (ROM) :
//    - Bank 0 fixe en 0x0000-0x3FFF
//    - Bank N (5 bits + 2 bits upper) en 0x4000-0x7FFF
//    - RAM Bank toujours 0
//
//  En mode 1 (RAM) :
//    - Bank 0 area utilise les 2 bits upper pour sélectionner (0x00, 0x20, 0x40, 0x60)
//    - Bank N utilise les 5 bits bas seulement
//    - RAM Bank sélectionnable (0-3)
//

export class MBC1 extends Mbc {
    private ramEnabled: bool = false;
    private romBankLow: u8 = 1;     // 5 bits (1-31, 0 => 1)
    private romRamSelect: u8 = 0;   // 2 bits
    private bankingMode: u8 = 0;    // 0 = ROM mode, 1 = RAM mode

    constructor(
        romData: StaticArray<u8>,
        cartridgeType: u8,
        romSizeCode: u8,
        ramSizeCode: u8,
    ) {
        super(romData, cartridgeType, romSizeCode, ramSizeCode);
    }


    /** Calcule le numéro de ROM bank pour la zone 0x4000-0x7FFF */
    private getHighRomBank(): u32 {
        let bank: u32 = (<u32>this.romRamSelect << 5) | <u32>this.romBankLow;
        // Masquer selon le nombre réel de banks
        bank = bank % this.romBankCount;
        return bank;
    }

    /** Calcule le numéro de ROM bank pour la zone 0x0000-0x3FFF (mode 1 uniquement) */
    private getLowRomBank(): u32 {
        if (this.bankingMode == 0) {
            return 0;
        }
        // Mode 1: les 2 bits upper sélectionnent la bank (0x00, 0x20, 0x40, 0x60)
        let bank: u32 = <u32>this.romRamSelect << 5;
        bank = bank % this.romBankCount;
        return bank;
    }

    /** Calcule le numéro de RAM bank actif */
    private getRamBank(): u32 {
        if (this.bankingMode == 0) {
            return 0;
        }
        return <u32>this.romRamSelect % this.ramBankCount;
    }


    read(address: u16): u8 {
        // ROM Bank 0 area: 0x0000-0x3FFF
        if (address <= ROM_BANK0_END) {
            const bank = this.getLowRomBank();
            const offset = bank * ROM_BANK_SIZE + <u32>address;
            return this.readRom(offset);
        }

        // ROM Bank N area: 0x4000-0x7FFF
        if (address >= ROM_BANKN_START && address <= ROM_BANKN_END) {
            const bank = this.getHighRomBank();
            const offset = bank * ROM_BANK_SIZE + <u32>(address - ROM_BANKN_START);
            return this.readRom(offset);
        }

        // External RAM: 0xA000-0xBFFF
        if (address >= EXT_RAM_START && address <= EXT_RAM_END) {
            if (!this.ramEnabled || !this.hasRam) return 0xFF;
            const ramBank = this.getRamBank();
            const offset = ramBank * RAM_BANK_SIZE + <u32>(address - EXT_RAM_START);
            if (offset >= <u32>this.extRam.length) return 0xFF;
            return this.extRam[offset];
        }

        return 0xFF;
    }


    write(address: u16, value: u8): void {
        // 0x0000-0x1FFF : RAM Enable
        if (address <= 0x1FFF) {
            this.ramEnabled = (value & 0x0F) == 0x0A;
            return;
        }

        // 0x2000-0x3FFF : ROM Bank Number (5 bits bas)
        if (address >= 0x2000 && address <= 0x3FFF) {
            let bankNum: u8 = value & 0x1F;
            if (bankNum == 0) bankNum = 1;  // Bank 0 n'est pas sélectionnable ici
            this.romBankLow = bankNum;
            return;
        }

        // 0x4000-0x5FFF : RAM Bank / Upper ROM bits (2 bits)
        if (address >= 0x4000 && address <= 0x5FFF) {
            this.romRamSelect = value & 0x03;
            return;
        }

        // 0x6000-0x7FFF : Banking Mode Select
        if (address >= 0x6000 && address <= 0x7FFF) {
            this.bankingMode = value & 0x01;
            return;
        }

        // External RAM: 0xA000-0xBFFF
        if (address >= EXT_RAM_START && address <= EXT_RAM_END) {
            if (!this.ramEnabled || !this.hasRam) return;
            const ramBank = this.getRamBank();
            const offset = ramBank * RAM_BANK_SIZE + <u32>(address - EXT_RAM_START);
            if (offset >= <u32>this.extRam.length) return;
            this.extRam[offset] = value;
            return;
        }
    }
}


// ============================================================================
//  Factory
// ============================================================================

export function createMbc(
    romData: StaticArray<u8>,
    cartridgeType: u8,
    romSizeCode: u8,
    ramSizeCode: u8,
): Mbc {
    if (cartridgeType == 0x00 || cartridgeType == 0x08 || cartridgeType == 0x09) {
        // ROM only (+ éventuellement RAM)
        return new NoMbc(romData, cartridgeType, romSizeCode, ramSizeCode);
    }

    if (cartridgeType >= 0x01 && cartridgeType <= 0x03) {
        // MBC1 / MBC1+RAM / MBC1+RAM+BATTERY
        return new MBC1(romData, cartridgeType, romSizeCode, ramSizeCode);
    }

    // TODO: MBC2, MBC3, MBC5...
    console.log(`[WASM] MBC | WARNING: Unsupported cartridge type ${toHex(cartridgeType)}, falling back to NoMbc`);
    return new NoMbc(romData, cartridgeType, romSizeCode, ramSizeCode);
}


// ============================================================================
//  Helpers
// ============================================================================

/** Nombre de ROM banks selon le code taille ROM dans le header (adresse 0x0148) */
function getRomBankCount(romSizeCode: u8): u32 {
    // 0x00 = 2 banks (32KB), 0x01 = 4, 0x02 = 8, ... 0x08 = 512
    if (romSizeCode <= 0x08) {
        return <u32>2 << <u32>romSizeCode;
    }
    return 2; // fallback
}

/** Nombre de RAM banks selon le code taille RAM dans le header (adresse 0x0149) */
function getRamBankCount(ramSizeCode: u8): u32 {
    switch (ramSizeCode) {
        case 0x00: return 0;   // No RAM
        case 0x01: return 0;   // Unused (listed but not standard)
        case 0x02: return 1;   // 8 KB  = 1 bank
        case 0x03: return 4;   // 32 KB = 4 banks
        case 0x04: return 16;  // 128 KB = 16 banks
        case 0x05: return 8;   // 64 KB = 8 banks
        default:   return 0;
    }
}

/** Vérifie si le type de cartouche inclut une batterie (sauvegarde) */
function isBatteryType(cartridgeType: u8): bool {
    // Types avec batterie: 0x03, 0x06, 0x09, 0x0D, 0x0F, 0x10, 0x13, 0x1B, 0x1E, 0x22, 0xFF
    if (cartridgeType == 0x03) return true;
    if (cartridgeType == 0x06) return true;
    if (cartridgeType == 0x09) return true;
    if (cartridgeType == 0x0D) return true;
    if (cartridgeType == 0x0F) return true;
    if (cartridgeType == 0x10) return true;
    if (cartridgeType == 0x13) return true;
    if (cartridgeType == 0x1B) return true;
    if (cartridgeType == 0x1E) return true;
    if (cartridgeType == 0x22) return true;
    if (cartridgeType == 0xFF) return true;
    return false;
}
