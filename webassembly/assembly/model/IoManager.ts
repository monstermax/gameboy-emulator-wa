// Gameboy Emulator - IO Manager

// https://gbdev.io/pandocs/Memory_Map.html#io-ranges
//
// I/O registers: 0xFF00-0xFF7F (relative: 0x00-0x7F)
//
//  Addr   | Name  | Description
//  -------+-------+-------------------------------------------
//  FF00   | JOYP  | Joypad input
//  FF01   | SB    | Serial transfer data
//  FF02   | SC    | Serial transfer control
//  FF04   | DIV   | Divider register
//  FF05   | TIMA  | Timer counter
//  FF06   | TMA   | Timer modulo
//  FF07   | TAC   | Timer control
//  FF0F   | IF    | Interrupt flag
//  FF10-26| NRxx  | Audio
//  FF30-3F|       | Wave pattern RAM
//  FF40   | LCDC  | LCD Control
//  FF41   | STAT  | LCD Status
//  FF42   | SCY   | Scroll Y
//  FF43   | SCX   | Scroll X
//  FF44   | LY    | LCD Y coordinate (scanline)
//  FF45   | LYC   | LY compare
//  FF46   | DMA   | OAM DMA transfer
//  FF47   | BGP   | BG palette data
//  FF48   | OBP0  | OBJ palette 0
//  FF49   | OBP1  | OBJ palette 1
//  FF4A   | WY    | Window Y position
//  FF4B   | WX    | Window X position + 7
//  FF50   |       | Boot ROM disable

import { Computer } from "./Computer";
import { toHex } from "../lib/lib_numbers";


// Relative addresses (offset from 0xFF00)
const IO_SIZE: u32 = 0x80;  // 128 registers

// Joypad
const JOYP: u16 = 0x00;   // FF00

// Serial
const SB: u16   = 0x01;   // FF01
const SC: u16   = 0x02;   // FF02

// Timer
const DIV: u16  = 0x04;   // FF04
const TIMA: u16 = 0x05;   // FF05
const TMA: u16  = 0x06;   // FF06
const TAC: u16  = 0x07;   // FF07

// Interrupts
const IF: u16   = 0x0F;   // FF0F

// LCD
const LCDC: u16 = 0x40;   // FF40
const STAT: u16 = 0x41;   // FF41
const SCY: u16  = 0x42;   // FF42
const SCX: u16  = 0x43;   // FF43
const LY: u16   = 0x44;   // FF44
const LYC: u16  = 0x45;   // FF45
const DMA: u16  = 0x46;   // FF46
const BGP: u16  = 0x47;   // FF47
const OBP0: u16 = 0x48;   // FF48
const OBP1: u16 = 0x49;   // FF49
const WY: u16   = 0x4A;   // FF4A
const WX: u16   = 0x4B;   // FF4B

// Boot ROM
const BOOT: u16 = 0x50;   // FF50


export class IoManager {
    private computer: Computer;
    private registers: StaticArray<u8> = new StaticArray<u8>(IO_SIZE);

    constructor(computer: Computer) {
        this.computer = computer;
        this.initRegisters();
    }


    /** Valeurs initiales post-boot (comme si le boot ROM avait déjà tourné) */
    private initRegisters(): void {
        // Joypad: tous les boutons relâchés (bits hauts = pas de sélection)
        this.registers[JOYP] = 0xCF;

        // Serial
        this.registers[SB] = 0x00;
        this.registers[SC] = 0x7E;

        // Timer
        this.registers[DIV]  = 0xAB;  // valeur arbitraire post-boot
        this.registers[TIMA] = 0x00;
        this.registers[TMA]  = 0x00;
        this.registers[TAC]  = 0xF8;

        // Interrupts
        this.registers[IF] = 0xE1;

        // LCD - valeurs post-boot DMG
        this.registers[LCDC] = 0x91;  // LCD ON, BG ON
        this.registers[STAT] = 0x85;
        this.registers[SCY]  = 0x00;
        this.registers[SCX]  = 0x00;
        this.registers[LY]   = 0x00;
        this.registers[LYC]  = 0x00;
        this.registers[BGP]  = 0xFC;  // palette par défaut
        this.registers[OBP0] = 0x00;
        this.registers[OBP1] = 0x00;
        this.registers[WY]   = 0x00;
        this.registers[WX]   = 0x00;

        // Boot ROM déjà désactivé
        this.registers[BOOT] = 0x01;
    }


    public read(ioRelativeAddress: u16): u8 {
        if (ioRelativeAddress >= <u16>IO_SIZE) {
            console.log(`[IO] Read out of range: ${toHex(ioRelativeAddress + 0xFF00, 4)}`);
            return 0xFF;
        }

        // Registres avec comportement spécial en lecture
        switch (ioRelativeAddress) {
            case JOYP:
                return this.readJoypad();

            case LY:
                // TODO: implémenter le vrai compteur de scanline via le PPU
                // Pour l'instant, incrémenter LY à chaque lecture pour
                // débloquer les jeux qui attendent un V-Blank (LY >= 144)
                return this.readLY();

            case STAT: {
                // Bits 0-1: mode flag, bit 2: coincidence flag
                // TODO: implémenter via PPU
                return this.registers[STAT] | 0x80;  // bit 7 toujours 1
            }

            case DIV:
                return this.registers[DIV];

            default:
                return this.registers[ioRelativeAddress];
        }
    }


    public write(ioRelativeAddress: u16, value: u8): void {
        if (ioRelativeAddress >= <u16>IO_SIZE) {
            console.log(`[IO] Write out of range: ${toHex(ioRelativeAddress + 0xFF00, 4)} = ${toHex(value)}`);
            return;
        }

        // Registres avec comportement spécial en écriture
        switch (ioRelativeAddress) {
            case JOYP:
                // Seuls les bits 4-5 (sélection) sont écrivables
                this.registers[JOYP] = (value & 0x30) | (this.registers[JOYP] & 0xCF);
                break;

            case DIV:
                // Toute écriture remet DIV à 0
                this.registers[DIV] = 0;
                break;

            case STAT:
                // Bits 0-2 sont read-only (mode + coincidence flag)
                this.registers[STAT] = (value & 0xF8) | (this.registers[STAT] & 0x07);
                break;

            case LY:
                // LY est read-only, écriture ignorée
                break;

            case DMA:
                // OAM DMA transfer: copie 160 bytes depuis (value << 8) vers OAM
                this.registers[DMA] = value;
                this.executeDmaTransfer(value);
                break;

            case SC:
                this.registers[SC] = value;
                // TODO: si bit 7 set, initier un transfert série
                break;

            default:
                this.registers[ioRelativeAddress] = value;
                break;
        }
    }


    // === Joypad ===

    private readJoypad(): u8 {
        const select = this.registers[JOYP] & 0x30;

        // TODO: lire le vrai état des boutons depuis un input handler
        // Pour l'instant, aucun bouton pressé = tous les bits bas à 1
        let buttons: u8 = 0x0F;

        return select | buttons | 0xC0;  // bits 6-7 toujours 1
    }


    // === LCD ===

    private readLY(): u8 {
        // Stub: incrémenter LY à chaque lecture pour simuler le balayage
        // Un vrai PPU incrémenterait LY en fonction des T-cycles
        let ly = this.registers[LY];
        this.registers[LY] = (ly + 1) % 154;  // 0-153 (154 lignes par frame)
        return ly;
    }


    // === DMA ===

    private executeDmaTransfer(sourceHigh: u8): void {
        const memoryBus = this.computer.memoryBus;
        if (!memoryBus) return;

        const sourceAddr: u16 = <u16>sourceHigh << 8;

        // Copier 160 bytes de source vers OAM (0xFE00-0xFE9F)
        for (let i: u16 = 0; i < 0xA0; i++) {
            const value = memoryBus.read(sourceAddr + i);
            memoryBus.write(0xFE00 + i, value);
        }
    }
}



/*

$FF00		    DMG	Joypad input
$FF01	$FF02	DMG	Serial transfer
$FF04	$FF07	DMG	Timer and divider
$FF0F		    DMG	Interrupts
$FF10	$FF26	DMG	Audio
$FF30	$FF3F	DMG	Wave pattern
$FF40	$FF4B	DMG	LCD Control, Status, Position, Scrolling, and Palettes
$FF46		    DMG	OAM DMA transfer
$FF4C	$FF4D	CGB	KEY0 and KEY1
$FF4F		    CGB	VRAM Bank Select
$FF50		    DMG	Boot ROM mapping control
$FF51	$FF55	CGB	VRAM DMA
$FF56		    CGB	IR port
$FF68	$FF6B	CGB	BG / OBJ Palettes
$FF6C		    CGB	Object priority mode
$FF70		    CGB	WRAM Bank Select

*/
