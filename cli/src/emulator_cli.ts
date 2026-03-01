// Gameboy Emulator - NodeJS cli

import { EmulatorCli } from './lib/EmulatorCli';


//const romFilename = "SuperMarioLand.World.Rev1.gb";
const romFilename = "Tetris.World.RevA.gb";
//const romFilename = "DuckTales.USA.gb";


async function main() {
    const emulator = new EmulatorCli()

    await emulator.init()
    await emulator.loadRom(romFilename)
    console.log(`[CLI] Emulator initialized`)

    //emulator.runEmulatorCycles() // OLD

     // TODO
    //let canvasRef: HTMLCanvasElement | null = null;
    //emulator.attachCanvas(canvasRef)

    emulator.start()
}



main();

