import { Computer } from "./Computer";



export class IoManager {
    private computer: Computer;
    private devices: IoDevices = new IoDevices;


    constructor(computer: Computer) {
        this.computer = computer;
    }


    public read(address: u16): u8 {
        console.warn(`Cannot read. No IO Device found at address ${address}`);
        return 0
    }


    public write(address: u16, value: u8): void {
        console.warn(`Cannot write. No IO Device found at address ${address}`);
        return
    }
}



export class IoDevices {

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
