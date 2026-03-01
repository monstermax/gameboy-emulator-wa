// Gameboy Emulator - APU (Audio Processing Unit)

// https://gbdev.io/pandocs/Audio.html
//
// 4 channels:
//   CH1: Pulse + sweep    (NR10-NR14)
//   CH2: Pulse            (NR21-NR24)
//   CH3: Wave             (NR30-NR34 + Wave RAM 0xFF30-0xFF3F)
//   CH4: Noise            (NR41-NR44)
//
// Global: NR50 (volume), NR51 (panning), NR52 (master enable)
//
// CPU clock: 4,194,304 Hz
// Sample rate: 44100 Hz => ~95.1 T-cycles per sample
// Frame sequencer: 512 Hz (8192 T-cycles per step)

import { Computer } from "./Computer";


// === Constants ===

const SAMPLE_RATE: i32 = 44100;
const CPU_CLOCK: i32 = 4194304;
const CYCLES_PER_SAMPLE: f64 = <f64>CPU_CLOCK / <f64>SAMPLE_RATE; // ~95.1

// Audio buffer: enough for ~2 frames at 44100 Hz / 60 FPS ≈ 1470 samples
// Double it for safety
const AUDIO_BUFFER_SIZE: i32 = 4096;

// Frame sequencer: 512 Hz = every 8192 T-cycles
const FRAME_SEQ_PERIOD: i32 = 8192;

// Duty cycle patterns for pulse channels (8 steps each)
// Index by duty (0-3), then step (0-7): 1 = high, 0 = low
const DUTY_TABLE: StaticArray<u8> = StaticArray.fromArray<u8>([
    0, 0, 0, 0, 0, 0, 0, 1,  // 12.5%
    1, 0, 0, 0, 0, 0, 0, 1,  // 25%
    1, 0, 0, 0, 0, 1, 1, 1,  // 50%
    0, 1, 1, 1, 1, 1, 1, 0,  // 75%
]);

// IO register offsets (relative to 0xFF00)
const NR10: u16 = 0x10;
const NR11: u16 = 0x11;
const NR12: u16 = 0x12;
const NR13: u16 = 0x13;
const NR14: u16 = 0x14;
const NR21: u16 = 0x16;
const NR22: u16 = 0x17;
const NR23: u16 = 0x18;
const NR24: u16 = 0x19;
const NR30: u16 = 0x1A;
const NR31: u16 = 0x1B;
const NR32: u16 = 0x1C;
const NR33: u16 = 0x1D;
const NR34: u16 = 0x1E;
const NR41: u16 = 0x20;
const NR42: u16 = 0x21;
const NR43: u16 = 0x22;
const NR44: u16 = 0x23;
const NR50: u16 = 0x24;
const NR51: u16 = 0x25;
const NR52: u16 = 0x26;


// ============================================================================
//  Channel state classes
// ============================================================================

class PulseChannel {
    enabled: bool = false;
    dacEnabled: bool = false;

    // Frequency timer
    frequencyTimer: i32 = 0;
    frequency: i32 = 0;        // 11-bit frequency value
    dutyPos: i32 = 0;          // 0-7 position in duty cycle
    duty: i32 = 0;             // 0-3 duty pattern

    // Length
    lengthCounter: i32 = 0;
    lengthEnabled: bool = false;

    // Envelope
    volume: i32 = 0;
    envelopeInitial: i32 = 0;
    envelopeDir: i32 = 0;      // 1 = increase, -1 = decrease
    envelopePeriod: i32 = 0;
    envelopeTimer: i32 = 0;

    // Sweep (CH1 only)
    sweepEnabled: bool = false;
    sweepPeriod: i32 = 0;
    sweepTimer: i32 = 0;
    sweepShift: i32 = 0;
    sweepNegate: bool = false;
    sweepShadow: i32 = 0;

    getOutput(): i32 {
        if (!this.enabled || !this.dacEnabled) return 0;
        const dutyIdx = this.duty * 8 + this.dutyPos;
        return unchecked(DUTY_TABLE[dutyIdx]) != 0 ? this.volume : 0;
    }
}


class WaveChannel {
    enabled: bool = false;
    dacEnabled: bool = false;

    frequencyTimer: i32 = 0;
    frequency: i32 = 0;
    samplePos: i32 = 0;        // 0-31 position in wave table
    sampleBuffer: u8 = 0;      // current sample nibble

    lengthCounter: i32 = 0;
    lengthEnabled: bool = false;

    volumeShift: i32 = 0;      // 0=mute, 1=100%, 2=50%, 3=25%

    getOutput(): i32 {
        if (!this.enabled || !this.dacEnabled) return 0;
        const sample = this.sampleBuffer >> (this.volumeShift as u8);
        return <i32>sample;
    }
}


class NoiseChannel {
    enabled: bool = false;
    dacEnabled: bool = false;

    frequencyTimer: i32 = 0;
    lfsr: i32 = 0x7FFF;        // 15-bit LFSR
    widthMode: bool = false;    // false = 15-bit, true = 7-bit

    divisorCode: i32 = 0;
    shiftAmount: i32 = 0;

    lengthCounter: i32 = 0;
    lengthEnabled: bool = false;

    volume: i32 = 0;
    envelopeInitial: i32 = 0;
    envelopeDir: i32 = 0;
    envelopePeriod: i32 = 0;
    envelopeTimer: i32 = 0;

    getOutput(): i32 {
        if (!this.enabled || !this.dacEnabled) return 0;
        return (~this.lfsr & 1) * this.volume;
    }
}


// ============================================================================
//  APU
// ============================================================================

export class Apu {
    private computer: Computer;

    // Channels
    private ch1: PulseChannel = new PulseChannel();
    private ch2: PulseChannel = new PulseChannel();
    private ch3: WaveChannel = new WaveChannel();
    private ch4: NoiseChannel = new NoiseChannel();

    // Wave RAM (16 bytes = 32 nibbles = 32 4-bit samples)
    public waveRam: StaticArray<u8> = new StaticArray<u8>(16);

    // Frame sequencer
    private frameSeqTimer: i32 = 0;
    private frameSeqStep: i32 = 0;

    // Sample generation
    private sampleTimer: f64 = 0;

    // Output buffer (float samples, interleaved L/R)
    public sampleBuffer: StaticArray<f32> = new StaticArray<f32>(AUDIO_BUFFER_SIZE * 2);
    public sampleCount: i32 = 0;
    public sampleBufferSize: i32 = AUDIO_BUFFER_SIZE;

    // Master enable
    private masterEnabled: bool = true;


    constructor(computer: Computer) {
        this.computer = computer;
    }


    // =========================================================================
    //  Tick (called per CPU instruction with T-cycle count)
    // =========================================================================

    tick(tCycles: i32): void {
        if (!this.masterEnabled) return;

        for (let t: i32 = 0; t < tCycles; t++) {
            // Tick frequency timers
            this.tickChannelTimers();

            // Frame sequencer
            this.frameSeqTimer++;
            if (this.frameSeqTimer >= FRAME_SEQ_PERIOD) {
                this.frameSeqTimer = 0;
                this.tickFrameSequencer();
            }

            // Sample generation
            this.sampleTimer += 1.0;
            if (this.sampleTimer >= CYCLES_PER_SAMPLE) {
                this.sampleTimer -= CYCLES_PER_SAMPLE;
                this.generateSample();
            }
        }
    }


    // =========================================================================
    //  Channel frequency timers
    // =========================================================================

    private tickChannelTimers(): void {
        // CH1 Pulse
        this.ch1.frequencyTimer--;
        if (this.ch1.frequencyTimer <= 0) {
            this.ch1.frequencyTimer = (2048 - this.ch1.frequency) * 4;
            this.ch1.dutyPos = (this.ch1.dutyPos + 1) & 7;
        }

        // CH2 Pulse
        this.ch2.frequencyTimer--;
        if (this.ch2.frequencyTimer <= 0) {
            this.ch2.frequencyTimer = (2048 - this.ch2.frequency) * 4;
            this.ch2.dutyPos = (this.ch2.dutyPos + 1) & 7;
        }

        // CH3 Wave
        this.ch3.frequencyTimer--;
        if (this.ch3.frequencyTimer <= 0) {
            this.ch3.frequencyTimer = (2048 - this.ch3.frequency) * 2;
            this.ch3.samplePos = (this.ch3.samplePos + 1) & 31;
            // Read nibble from wave RAM
            const byteIdx = this.ch3.samplePos >> 1;
            if ((this.ch3.samplePos & 1) == 0) {
                this.ch3.sampleBuffer = (unchecked(this.waveRam[byteIdx]) >> 4) & 0x0F;
            } else {
                this.ch3.sampleBuffer = unchecked(this.waveRam[byteIdx]) & 0x0F;
            }
        }

        // CH4 Noise
        this.ch4.frequencyTimer--;
        if (this.ch4.frequencyTimer <= 0) {
            const divisor = this.ch4.divisorCode == 0 ? 8 : <i32>this.ch4.divisorCode * 16;
            this.ch4.frequencyTimer = divisor << this.ch4.shiftAmount;

            // Clock LFSR
            const xorBit = (this.ch4.lfsr & 1) ^ ((this.ch4.lfsr >> 1) & 1);
            this.ch4.lfsr = (this.ch4.lfsr >> 1) | (xorBit << 14);
            if (this.ch4.widthMode) {
                this.ch4.lfsr = (this.ch4.lfsr & ~(1 << 6)) | (xorBit << 6);
            }
        }
    }


    // =========================================================================
    //  Frame sequencer (512 Hz, 8 steps)
    // =========================================================================

    private tickFrameSequencer(): void {
        const step = this.frameSeqStep;

        // Length counter: steps 0, 2, 4, 6
        if ((step & 1) == 0) {
            this.tickLength();
        }

        // Envelope: step 7
        if (step == 7) {
            this.tickEnvelopes();
        }

        // Sweep (CH1): steps 2, 6
        if (step == 2 || step == 6) {
            this.tickSweep();
        }

        this.frameSeqStep = (this.frameSeqStep + 1) & 7;
    }


    private tickLength(): void {
        // CH1
        if (this.ch1.lengthEnabled && this.ch1.lengthCounter > 0) {
            this.ch1.lengthCounter--;
            if (this.ch1.lengthCounter == 0) this.ch1.enabled = false;
        }
        // CH2
        if (this.ch2.lengthEnabled && this.ch2.lengthCounter > 0) {
            this.ch2.lengthCounter--;
            if (this.ch2.lengthCounter == 0) this.ch2.enabled = false;
        }
        // CH3
        if (this.ch3.lengthEnabled && this.ch3.lengthCounter > 0) {
            this.ch3.lengthCounter--;
            if (this.ch3.lengthCounter == 0) this.ch3.enabled = false;
        }
        // CH4
        if (this.ch4.lengthEnabled && this.ch4.lengthCounter > 0) {
            this.ch4.lengthCounter--;
            if (this.ch4.lengthCounter == 0) this.ch4.enabled = false;
        }
    }


    private tickEnvelopes(): void {
        // CH1
        if (this.ch1.envelopePeriod > 0) {
            this.ch1.envelopeTimer--;
            if (this.ch1.envelopeTimer <= 0) {
                this.ch1.envelopeTimer = this.ch1.envelopePeriod;
                const newVol = this.ch1.volume + this.ch1.envelopeDir;
                if (newVol >= 0 && newVol <= 15) this.ch1.volume = newVol;
            }
        }
        // CH2
        if (this.ch2.envelopePeriod > 0) {
            this.ch2.envelopeTimer--;
            if (this.ch2.envelopeTimer <= 0) {
                this.ch2.envelopeTimer = this.ch2.envelopePeriod;
                const newVol = this.ch2.volume + this.ch2.envelopeDir;
                if (newVol >= 0 && newVol <= 15) this.ch2.volume = newVol;
            }
        }
        // CH4
        if (this.ch4.envelopePeriod > 0) {
            this.ch4.envelopeTimer--;
            if (this.ch4.envelopeTimer <= 0) {
                this.ch4.envelopeTimer = this.ch4.envelopePeriod;
                const newVol = this.ch4.volume + this.ch4.envelopeDir;
                if (newVol >= 0 && newVol <= 15) this.ch4.volume = newVol;
            }
        }
    }


    private tickSweep(): void {
        if (!this.ch1.sweepEnabled || this.ch1.sweepPeriod == 0) return;

        this.ch1.sweepTimer--;
        if (this.ch1.sweepTimer <= 0) {
            this.ch1.sweepTimer = this.ch1.sweepPeriod;

            const newFreq = this.calcSweepFreq();
            if (newFreq <= 2047 && this.ch1.sweepShift > 0) {
                this.ch1.frequency = newFreq;
                this.ch1.sweepShadow = newFreq;

                // Overflow check again
                if (this.calcSweepFreq() > 2047) {
                    this.ch1.enabled = false;
                }
            } else if (newFreq > 2047) {
                this.ch1.enabled = false;
            }
        }
    }

    private calcSweepFreq(): i32 {
        let shifted = this.ch1.sweepShadow >> this.ch1.sweepShift;
        if (this.ch1.sweepNegate) shifted = -shifted;
        return this.ch1.sweepShadow + shifted;
    }


    // =========================================================================
    //  Sample generation
    // =========================================================================

    private generateSample(): void {
        if (this.sampleCount >= this.sampleBufferSize) return; // buffer full

        const io = this.computer.ioManager;
        if (!io) return;

        const nr50 = io.registers[NR50];
        const nr51 = io.registers[NR51];

        // Get channel outputs (0-15 each)
        const c1 = this.ch1.getOutput();
        const c2 = this.ch2.getOutput();
        const c3 = this.ch3.getOutput();
        const c4 = this.ch4.getOutput();

        // Mix to left and right based on NR51 panning
        let left: i32 = 0;
        let right: i32 = 0;

        if (nr51 & 0x10) left += c1;
        if (nr51 & 0x20) left += c2;
        if (nr51 & 0x40) left += c3;
        if (nr51 & 0x80) left += c4;

        if (nr51 & 0x01) right += c1;
        if (nr51 & 0x02) right += c2;
        if (nr51 & 0x04) right += c3;
        if (nr51 & 0x08) right += c4;

        // Master volume (0-7)
        const leftVol = ((nr50 >> 4) & 7) + 1;
        const rightVol = (nr50 & 7) + 1;

        left *= leftVol;
        right *= rightVol;

        // Normalize to -1.0 .. 1.0
        // Max per channel = 15, 4 channels = 60, * 8 (vol) = 480
        const scale: f32 = 1.0 / 480.0;

        const offset = this.sampleCount * 2;
        unchecked(this.sampleBuffer[offset]     = <f32>left * scale);
        unchecked(this.sampleBuffer[offset + 1] = <f32>right * scale);
        this.sampleCount++;
    }


    // =========================================================================
    //  Register writes (called by IoManager)
    // =========================================================================

    writeRegister(regOffset: u16, value: u8): void {
        switch (regOffset) {
            // === CH1 Pulse + Sweep ===
            case NR10: { // Sweep
                this.ch1.sweepPeriod = (value >> 4) & 7;
                this.ch1.sweepNegate = (value & 0x08) != 0;
                this.ch1.sweepShift = value & 7;
                break;
            }
            case NR11: { // Duty + Length
                this.ch1.duty = (value >> 6) & 3;
                this.ch1.lengthCounter = 64 - (value & 0x3F);
                break;
            }
            case NR12: { // Envelope
                this.ch1.envelopeInitial = (value >> 4) & 0x0F;
                this.ch1.envelopeDir = (value & 0x08) != 0 ? 1 : -1;
                this.ch1.envelopePeriod = value & 7;
                this.ch1.dacEnabled = (value & 0xF8) != 0;
                if (!this.ch1.dacEnabled) this.ch1.enabled = false;
                break;
            }
            case NR13: { // Frequency low
                this.ch1.frequency = (this.ch1.frequency & 0x700) | <i32>value;
                break;
            }
            case NR14: { // Trigger + Frequency high
                this.ch1.frequency = (this.ch1.frequency & 0xFF) | ((<i32>value & 7) << 8);
                this.ch1.lengthEnabled = (value & 0x40) != 0;
                if (value & 0x80) this.triggerCh1();
                break;
            }

            // === CH2 Pulse ===
            case NR21: {
                this.ch2.duty = (value >> 6) & 3;
                this.ch2.lengthCounter = 64 - (value & 0x3F);
                break;
            }
            case NR22: {
                this.ch2.envelopeInitial = (value >> 4) & 0x0F;
                this.ch2.envelopeDir = (value & 0x08) != 0 ? 1 : -1;
                this.ch2.envelopePeriod = value & 7;
                this.ch2.dacEnabled = (value & 0xF8) != 0;
                if (!this.ch2.dacEnabled) this.ch2.enabled = false;
                break;
            }
            case NR23: {
                this.ch2.frequency = (this.ch2.frequency & 0x700) | <i32>value;
                break;
            }
            case NR24: {
                this.ch2.frequency = (this.ch2.frequency & 0xFF) | ((<i32>value & 7) << 8);
                this.ch2.lengthEnabled = (value & 0x40) != 0;
                if (value & 0x80) this.triggerCh2();
                break;
            }

            // === CH3 Wave ===
            case NR30: {
                this.ch3.dacEnabled = (value & 0x80) != 0;
                if (!this.ch3.dacEnabled) this.ch3.enabled = false;
                break;
            }
            case NR31: {
                this.ch3.lengthCounter = 256 - <i32>value;
                break;
            }
            case NR32: {
                const shift = (value >> 5) & 3;
                // 0=mute(shift 4), 1=100%(shift 0), 2=50%(shift 1), 3=25%(shift 2)
                if (shift == 0) this.ch3.volumeShift = 4;
                else this.ch3.volumeShift = shift - 1;
                break;
            }
            case NR33: {
                this.ch3.frequency = (this.ch3.frequency & 0x700) | <i32>value;
                break;
            }
            case NR34: {
                this.ch3.frequency = (this.ch3.frequency & 0xFF) | ((<i32>value & 7) << 8);
                this.ch3.lengthEnabled = (value & 0x40) != 0;
                if (value & 0x80) this.triggerCh3();
                break;
            }

            // === CH4 Noise ===
            case NR41: {
                this.ch4.lengthCounter = 64 - (value & 0x3F);
                break;
            }
            case NR42: {
                this.ch4.envelopeInitial = (value >> 4) & 0x0F;
                this.ch4.envelopeDir = (value & 0x08) != 0 ? 1 : -1;
                this.ch4.envelopePeriod = value & 7;
                this.ch4.dacEnabled = (value & 0xF8) != 0;
                if (!this.ch4.dacEnabled) this.ch4.enabled = false;
                break;
            }
            case NR43: {
                this.ch4.shiftAmount = (value >> 4) & 0x0F;
                this.ch4.widthMode = (value & 0x08) != 0;
                this.ch4.divisorCode = value & 7;
                break;
            }
            case NR44: {
                this.ch4.lengthEnabled = (value & 0x40) != 0;
                if (value & 0x80) this.triggerCh4();
                break;
            }

            // === Global ===
            case NR52: {
                this.masterEnabled = (value & 0x80) != 0;
                if (!this.masterEnabled) {
                    this.ch1.enabled = false;
                    this.ch2.enabled = false;
                    this.ch3.enabled = false;
                    this.ch4.enabled = false;
                }
                break;
            }

            default: break;
        }
    }


    /** Read NR52 status register */
    readNr52(): u8 {
        let status: u8 = this.masterEnabled ? 0x80 : 0;
        if (this.ch1.enabled) status |= 0x01;
        if (this.ch2.enabled) status |= 0x02;
        if (this.ch3.enabled) status |= 0x04;
        if (this.ch4.enabled) status |= 0x08;
        return status | 0x70; // bits 4-6 always 1
    }


    // =========================================================================
    //  Trigger
    // =========================================================================

    private triggerCh1(): void {
        this.ch1.enabled = this.ch1.dacEnabled;
        if (this.ch1.lengthCounter == 0) this.ch1.lengthCounter = 64;
        this.ch1.frequencyTimer = (2048 - this.ch1.frequency) * 4;
        this.ch1.volume = this.ch1.envelopeInitial;
        this.ch1.envelopeTimer = this.ch1.envelopePeriod;
        // Sweep
        this.ch1.sweepShadow = this.ch1.frequency;
        this.ch1.sweepTimer = this.ch1.sweepPeriod > 0 ? this.ch1.sweepPeriod : 8;
        this.ch1.sweepEnabled = this.ch1.sweepPeriod > 0 || this.ch1.sweepShift > 0;
        if (this.ch1.sweepShift > 0 && this.calcSweepFreq() > 2047) {
            this.ch1.enabled = false;
        }
    }

    private triggerCh2(): void {
        this.ch2.enabled = this.ch2.dacEnabled;
        if (this.ch2.lengthCounter == 0) this.ch2.lengthCounter = 64;
        this.ch2.frequencyTimer = (2048 - this.ch2.frequency) * 4;
        this.ch2.volume = this.ch2.envelopeInitial;
        this.ch2.envelopeTimer = this.ch2.envelopePeriod;
    }

    private triggerCh3(): void {
        this.ch3.enabled = this.ch3.dacEnabled;
        if (this.ch3.lengthCounter == 0) this.ch3.lengthCounter = 256;
        this.ch3.frequencyTimer = (2048 - this.ch3.frequency) * 2;
        this.ch3.samplePos = 0;
    }

    private triggerCh4(): void {
        this.ch4.enabled = this.ch4.dacEnabled;
        if (this.ch4.lengthCounter == 0) this.ch4.lengthCounter = 64;
        this.ch4.lfsr = 0x7FFF;
        this.ch4.volume = this.ch4.envelopeInitial;
        this.ch4.envelopeTimer = this.ch4.envelopePeriod;
        const divisor = this.ch4.divisorCode == 0 ? 8 : <i32>this.ch4.divisorCode * 16;
        this.ch4.frequencyTimer = divisor << this.ch4.shiftAmount;
    }
}
