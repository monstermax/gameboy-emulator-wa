// Gameboy Emulator - PPU (Pixel Processing Unit)

// https://gbdev.io/pandocs/pixel_fifo.html
// https://gbdev.io/pandocs/LCDC.html
//
// Screen: 160x144 pixels, 4 shades of gray
// Frame: 154 scanlines (144 visible + 10 VBlank)
// Scanline: 456 T-cycles
//
// Modes per scanline (for LY 0-143):
//   Mode 2 (OAM Scan):  80 T-cycles
//   Mode 3 (Drawing):  172 T-cycles (variable, simplified here)
//   Mode 0 (H-Blank):  204 T-cycles (variable, simplified here)
//
// For LY 144-153:
//   Mode 1 (V-Blank): entire scanline

import { Computer } from "./Computer";


// Screen dimensions
const SCREEN_W: i32 = 160;
const SCREEN_H: i32 = 144;
const FRAMEBUFFER_SIZE: i32 = SCREEN_W * SCREEN_H; // in pixels

// Timing (T-cycles)
const CYCLES_PER_SCANLINE: i32 = 456;
const SCANLINES_PER_FRAME: i32 = 154;
const OAM_SCAN_CYCLES: i32 = 80;
const DRAWING_CYCLES: i32 = 172;
// H-Blank fills the rest: 456 - 80 - 172 = 204

// PPU modes
const MODE_HBLANK: u8 = 0;
const MODE_VBLANK: u8 = 1;
const MODE_OAM_SCAN: u8 = 2;
const MODE_DRAWING: u8 = 3;

// LCDC bit flags (register FF40)
const LCDC_BG_ENABLE: u8       = 0x01; // bit 0
const LCDC_OBJ_ENABLE: u8     = 0x02; // bit 1
const LCDC_OBJ_SIZE: u8       = 0x04; // bit 2 (0=8x8, 1=8x16)
const LCDC_BG_TILE_MAP: u8    = 0x08; // bit 3 (0=9800, 1=9C00)
const LCDC_TILE_DATA: u8      = 0x10; // bit 4 (0=8800 signed, 1=8000 unsigned)
const LCDC_WIN_ENABLE: u8     = 0x20; // bit 5
const LCDC_WIN_TILE_MAP: u8   = 0x40; // bit 6 (0=9800, 1=9C00)
const LCDC_LCD_ENABLE: u8     = 0x80; // bit 7

// STAT bit flags (register FF41)
const STAT_LYC_INT: u8      = 0x40; // bit 6
const STAT_OAM_INT: u8      = 0x20; // bit 5
const STAT_VBLANK_INT: u8   = 0x10; // bit 4
const STAT_HBLANK_INT: u8   = 0x08; // bit 3

// IO register offsets (relative to 0xFF00)
const IO_LCDC: u16 = 0x40;
const IO_STAT: u16 = 0x41;
const IO_SCY: u16  = 0x42;
const IO_SCX: u16  = 0x43;
const IO_LY: u16   = 0x44;
const IO_LYC: u16  = 0x45;
const IO_BGP: u16  = 0x47;
const IO_OBP0: u16 = 0x48;
const IO_OBP1: u16 = 0x49;
const IO_WY: u16   = 0x4A;
const IO_WX: u16   = 0x4B;

// Interrupt flag bits (FF0F)
const IF_VBLANK: u8  = 0x01;
const IF_STAT: u8    = 0x02;

// DMG palette: color index (0-3) => shade (0=white, 3=black)
// Stored as 2-bit values packed in BGP/OBP registers
const DMG_COLORS: StaticArray<u8> = [255, 170, 85, 0]; // white, light, dark, black


export class Ppu {
    private computer: Computer;

    // Timing
    public cycleCounter: i32 = 0;
    public currentMode: u8 = MODE_OAM_SCAN;
    public ly: u8 = 0;

    // Framebuffer: 160x144 pixels, each pixel is a shade (0-255 grayscale)
    public framebuffer: StaticArray<u8> = new StaticArray<u8>(FRAMEBUFFER_SIZE);

    // Flag set when a full frame has been rendered
    public frameReady: bool = false;

    // Window internal line counter (increments only when window is actually drawn)
    private windowLineCounter: i32 = 0;


    constructor(computer: Computer) {
        this.computer = computer;
    }


    /** Called once per CPU T-cycle (4 T-cycles = 1 M-cycle) */
    tick(tCycles: i32): void {
        const lcdc = this.readIo(IO_LCDC);

        // LCD disabled => mode 0, LY=0, nothing to do
        if ((lcdc & LCDC_LCD_ENABLE) == 0) {
            this.cycleCounter = 0;
            this.ly = 0;
            this.currentMode = MODE_HBLANK;
            this.writeIo(IO_LY, 0);
            this.updateStat();
            return;
        }

        this.cycleCounter += tCycles;

        if (this.cycleCounter >= CYCLES_PER_SCANLINE) {
            this.cycleCounter -= CYCLES_PER_SCANLINE;
            this.advanceScanline();
        }

        this.updateMode();
    }


    /** Advance to the next scanline */
    private advanceScanline(): void {
        this.ly = <u8>((this.ly + 1) % SCANLINES_PER_FRAME);
        this.writeIo(IO_LY, this.ly);

        // LYC coincidence check
        this.checkLycCoincidence();

        if (this.ly < (SCREEN_H as u8)) {
            // Visible scanline => render it
            this.renderScanline();

        } else if (this.ly == SCREEN_H) {
            // Entering V-Blank
            this.frameReady = true;
            this.windowLineCounter = 0;

            // Request V-Blank interrupt
            this.requestInterrupt(IF_VBLANK);
        }
    }


    /** Update the current PPU mode based on cycle counter and LY */
    private updateMode(): void {
        let newMode: u8;

        if (this.ly >= (SCREEN_H as u8)) {
            newMode = MODE_VBLANK;

        } else if (this.cycleCounter < OAM_SCAN_CYCLES) {
            newMode = MODE_OAM_SCAN;

        } else if (this.cycleCounter < OAM_SCAN_CYCLES + DRAWING_CYCLES) {
            newMode = MODE_DRAWING;

        } else {
            newMode = MODE_HBLANK;
        }

        if (newMode != this.currentMode) {
            this.currentMode = newMode;
            this.updateStat();

            // STAT interrupt sources
            const stat = this.readIo(IO_STAT);
            let statIrq = false;
            if (newMode == MODE_HBLANK && (stat & STAT_HBLANK_INT) != 0) statIrq = true;
            if (newMode == MODE_VBLANK && (stat & STAT_VBLANK_INT) != 0) statIrq = true;
            if (newMode == MODE_OAM_SCAN && (stat & STAT_OAM_INT) != 0) statIrq = true;
            if (statIrq) this.requestInterrupt(IF_STAT);
        }
    }


    /** Update STAT register (mode bits + LYC coincidence flag) */
    private updateStat(): void {
        let stat = this.readIo(IO_STAT);
        // Clear mode bits (0-1) and coincidence flag (bit 2)
        stat = (stat & 0xF8) | this.currentMode;
        // LYC == LY flag
        if (this.ly == this.readIo(IO_LYC)) {
            stat |= 0x04;
        }
        // Bit 7 always 1
        stat |= 0x80;
        this.writeIo(IO_STAT, stat);
    }


    /** Check LYC coincidence and fire STAT interrupt if enabled */
    private checkLycCoincidence(): void {
        if (this.ly == this.readIo(IO_LYC)) {
            const stat = this.readIo(IO_STAT);
            if ((stat & STAT_LYC_INT) != 0) {
                this.requestInterrupt(IF_STAT);
            }
        }
    }


    // =========================================================================
    //  Rendering
    // =========================================================================

    /** Render one scanline (BG + Window + Sprites) */
    private renderScanline(): void {
        const lcdc = this.readIo(IO_LCDC);
        const ly = this.ly;
        const fbOffset: i32 = <i32>ly * SCREEN_W;

        // Clear scanline
        for (let x: i32 = 0; x < SCREEN_W; x++) {
            this.framebuffer[fbOffset + x] = DMG_COLORS[0]; // white
        }

        // BG
        if ((lcdc & LCDC_BG_ENABLE) != 0) {
            this.renderBgScanline(lcdc, ly, fbOffset);
        }

        // Window
        if ((lcdc & LCDC_WIN_ENABLE) != 0) {
            this.renderWindowScanline(lcdc, ly, fbOffset);
        }

        // Sprites (OBJ)
        if ((lcdc & LCDC_OBJ_ENABLE) != 0) {
            this.renderSpriteScanline(lcdc, ly, fbOffset);
        }
    }


    /** Render Background for one scanline */
    private renderBgScanline(lcdc: u8, ly: u8, fbOffset: i32): void {
        const scx = this.readIo(IO_SCX);
        const scy = this.readIo(IO_SCY);
        const bgp = this.readIo(IO_BGP);

        // Tile map base address (relative to VRAM start 0x8000)
        const tileMapBase: u16 = (lcdc & LCDC_BG_TILE_MAP) != 0 ? 0x1C00 : 0x1800;
        const useUnsigned: bool = (lcdc & LCDC_TILE_DATA) != 0;

        const yPos: u8 = scy + ly; // wraps naturally at 256

        for (let x: i32 = 0; x < SCREEN_W; x++) {
            const xPos: u8 = scx + <u8>x; // wraps naturally at 256

            // Which tile in the 32x32 grid?
            const tileCol: u16 = <u16>(xPos >> 3); // / 8
            const tileRow: u16 = <u16>(yPos >> 3);
            const tileMapAddr: u16 = tileMapBase + tileRow * 32 + tileCol;

            // Get tile index from tile map
            const tileIndex = this.readVram(tileMapAddr);

            // Get tile data address
            let tileDataAddr: u16;
            if (useUnsigned) {
                // 0x8000 method: unsigned, tile 0 at 0x8000 (VRAM offset 0x0000)
                tileDataAddr = <u16>tileIndex * 16;
            } else {
                // 0x8800 method: signed, tile 0 at 0x9000 (VRAM offset 0x1000)
                tileDataAddr = <u16>(0x1000 + <i16>(<i8>tileIndex) * 16);
            }

            // Which row within the tile (0-7)?
            const tileY: u16 = <u16>(yPos & 7);
            const byteOffset: u16 = tileDataAddr + tileY * 2;

            // Each row is 2 bytes: low byte and high byte
            const lo = this.readVram(byteOffset);
            const hi = this.readVram(byteOffset + 1);

            // Which bit within the byte (7 = leftmost pixel)
            const bitIdx: u8 = 7 - (xPos & 7);
            const colorIdx: u8 = ((hi >> bitIdx) & 1) << 1 | ((lo >> bitIdx) & 1);

            // Apply palette
            const shade = this.applyPalette(bgp, colorIdx);
            this.framebuffer[fbOffset + x] = shade;
        }
    }


    /** Render Window for one scanline */
    private renderWindowScanline(lcdc: u8, ly: u8, fbOffset: i32): void {
        const wy = this.readIo(IO_WY);
        const wx = this.readIo(IO_WX);

        // Window not visible on this scanline
        if (ly < wy) return;
        if (wx > 166) return; // WX=0..166 (WX=7 means left edge of screen)

        const bgp = this.readIo(IO_BGP);
        const tileMapBase: u16 = (lcdc & LCDC_WIN_TILE_MAP) != 0 ? 0x1C00 : 0x1800;
        const useUnsigned: bool = (lcdc & LCDC_TILE_DATA) != 0;

        const winY: i32 = this.windowLineCounter;
        let drewPixel = false;

        for (let x: i32 = 0; x < SCREEN_W; x++) {
            const screenX: i32 = x;
            const winX: i32 = screenX - (<i32>wx - 7);

            if (winX < 0) continue;

            const tileCol: u16 = <u16>(winX >> 3);
            const tileRow: u16 = <u16>(winY >> 3);
            const tileMapAddr: u16 = tileMapBase + tileRow * 32 + tileCol;

            const tileIndex = this.readVram(tileMapAddr);

            let tileDataAddr: u16;
            if (useUnsigned) {
                tileDataAddr = <u16>tileIndex * 16;
            } else {
                tileDataAddr = <u16>(0x1000 + <i16>(<i8>tileIndex) * 16);
            }

            const tileY: u16 = <u16>(winY & 7);
            const byteOffset: u16 = tileDataAddr + tileY * 2;

            const lo = this.readVram(byteOffset);
            const hi = this.readVram(byteOffset + 1);

            const bitIdx: u8 = 7 - <u8>(winX & 7);
            const colorIdx: u8 = ((hi >> bitIdx) & 1) << 1 | ((lo >> bitIdx) & 1);

            const shade = this.applyPalette(bgp, colorIdx);
            this.framebuffer[fbOffset + x] = shade;
            drewPixel = true;
        }

        if (drewPixel) {
            this.windowLineCounter++;
        }
    }


    /** Render Sprites (OBJ) for one scanline */
    private renderSpriteScanline(lcdc: u8, ly: u8, fbOffset: i32): void {
        const tallSprites: bool = (lcdc & LCDC_OBJ_SIZE) != 0; // 8x16 if set
        const spriteH: i32 = tallSprites ? 16 : 8;

        const memoryBus = this.computer.memoryBus;
        if (!memoryBus) return;

        // Scan OAM for sprites on this scanline (max 10 per line)
        let spritesOnLine: i32 = 0;

        for (let i: i32 = 0; i < 40 && spritesOnLine < 10; i++) {
            const oamAddr: i32 = i * 4;

            const spriteY: i32 = <i32>memoryBus.oam[oamAddr] - 16;     // Y position - 16
            const spriteX: i32 = <i32>memoryBus.oam[oamAddr + 1] - 8;  // X position - 8
            const tileIdx: u8 = memoryBus.oam[oamAddr + 2];
            const attrs: u8 = memoryBus.oam[oamAddr + 3];

            // Is this sprite on the current scanline?
            if (<i32>ly < spriteY || <i32>ly >= spriteY + spriteH) continue;

            spritesOnLine++;

            const flipX: bool = (attrs & 0x20) != 0;
            const flipY: bool = (attrs & 0x40) != 0;
            const behindBg: bool = (attrs & 0x80) != 0;
            const palette = (attrs & 0x10) != 0 ? this.readIo(IO_OBP1) : this.readIo(IO_OBP0);

            // Which row of the sprite?
            let tileRow: i32 = <i32>ly - spriteY;
            if (flipY) tileRow = spriteH - 1 - tileRow;

            // For 8x16 sprites, bit 0 of tile index is ignored
            let actualTile: u8 = tileIdx;
            if (tallSprites) {
                actualTile = tileIdx & 0xFE;
                if (tileRow >= 8) {
                    actualTile += 1;
                    tileRow -= 8;
                }
            }

            // Sprite tiles always use unsigned addressing from 0x8000 (VRAM offset 0x0000)
            const tileDataAddr: u16 = <u16>actualTile * 16 + <u16>tileRow * 2;

            const lo = this.readVram(tileDataAddr);
            const hi = this.readVram(tileDataAddr + 1);

            for (let px: i32 = 0; px < 8; px++) {
                const screenX: i32 = spriteX + px;
                if (screenX < 0 || screenX >= SCREEN_W) continue;

                const bitIdx: u8 = flipX ? <u8>px : <u8>(7 - px);
                const colorIdx: u8 = ((hi >> bitIdx) & 1) << 1 | ((lo >> bitIdx) & 1);

                // Color 0 is transparent for sprites
                if (colorIdx == 0) continue;

                // BG priority: if set, sprite is behind non-zero BG pixels
                if (behindBg && this.framebuffer[fbOffset + screenX] != DMG_COLORS[0]) continue;

                const shade = this.applyPalette(palette, colorIdx);
                this.framebuffer[fbOffset + screenX] = shade;
            }
        }
    }


    // =========================================================================
    //  Helpers
    // =========================================================================

    /** Apply a DMG palette register to a 2-bit color index => grayscale shade */
    private applyPalette(palette: u8, colorIdx: u8): u8 {
        const mapped = (palette >> (colorIdx * 2)) & 0x03;
        return DMG_COLORS[mapped];
    }

    /** Read a VRAM byte (offset relative to 0x8000) */
    private readVram(offset: u16): u8 {
        const memoryBus = this.computer.memoryBus;
        if (!memoryBus) return 0;
        return memoryBus.vram[offset];
    }

    /** Read an IO register (relative offset from 0xFF00) */
    private readIo(offset: u16): u8 {
        const memoryBus = this.computer.memoryBus;
        if (!memoryBus) return 0;
        return memoryBus.read(0xFF00 + offset);
    }

    /** Write an IO register (relative offset from 0xFF00) */
    private writeIo(offset: u16, value: u8): void {
        const ioManager = this.computer.ioManager;
        if (!ioManager) return;
        // Write directly to avoid special write handling for LY/STAT
        // We access the registers array via a public method
        ioManager.writeRaw(offset, value);
    }

    /** Request an interrupt by setting a bit in IF (FF0F) */
    private requestInterrupt(flag: u8): void {
        const memoryBus = this.computer.memoryBus;
        if (!memoryBus) return;
        const ifReg = memoryBus.read(0xFF0F);
        memoryBus.write(0xFF0F, ifReg | flag);
    }
}
