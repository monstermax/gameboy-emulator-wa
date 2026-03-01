
import { EmulatorCli } from './lib/EmulatorCli';


const romFilename = "SuperMarioLand.World.Rev1.gb";


async function main() {
    const emulator = new EmulatorCli(romFilename)

    await initEmulator(emulator);

    emulator.runEmulatorCycles()
}


async function initEmulator(emulator: EmulatorCli): Promise<void> {
    await emulator.init()
    console.log(`[CLI] Emulator initialized`)
}





main();

