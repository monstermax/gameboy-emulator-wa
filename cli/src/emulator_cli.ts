
import { EmulatorCli } from './lib/EmulatorCli';


const romFilename = "SuperMarioLand.World.Rev1.gb";


async function main() {
    const emulator = new EmulatorCli(romFilename)

    await initEmulator(emulator);
}


async function initEmulator(emulator: EmulatorCli) {
    await emulator.init()

    if (!emulator.wasmExports) {
        console.error(`Cannot find wasmExports`)
        process.exit(1);
    }

    emulator.wasmExports.runEmulator()
}



main();

