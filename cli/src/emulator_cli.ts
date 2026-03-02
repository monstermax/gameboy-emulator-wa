// Gameboy Emulator - NodeJS cli

import { EmulatorCli } from './lib/EmulatorCli.ansi';
//import { EmulatorCli } from './lib/EmulatorCli.sdl';


//const romFilename = "SuperMarioLand.World.Rev1.gb";
const romFilename = "Tetris.World.RevA.gb";
//const romFilename = "DuckTales.USA.gb";


async function main() {

    const emulator = new EmulatorCli()

    await emulator.init()
    await emulator.loadRom(romFilename)
    console.log(`[CLI] Emulator initialized`)

    //emulator.runEmulatorCycles() // OLD


    //emulator.attachCanvas(canvas);

    // OR
    //emulator.attachStream(); // diffuse l'image via un flux mp4 (RTSP ?)

    // OR
    //emulator.attachWindow(); // Spawn a GUI Window (Electron ? SDL ?)


    //emulator.attachKeyboard();
    // AND/OR
    //emulator.attachGamepad();

    emulator.start()
}



main();

