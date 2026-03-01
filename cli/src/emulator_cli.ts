
import { EmulatorCli } from './lib/EmulatorCli';


const romFilename = "SuperMarioLand.World.Rev1.gb";


async function main() {
    const emulator = new EmulatorCli(romFilename)

    await emulator.init()
    console.log(`[CLI] Emulator initialized`)

    emulator.runEmulatorCycles()
}



main();

