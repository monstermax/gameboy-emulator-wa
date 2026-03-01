
import { useEffect, useState } from "react";

import { EmulatorWeb } from "../lib/EmulatorWeb";


export const useEmulator = (romFilename: string): EmulatorHook => {
    const [emulator] = useState(() => new EmulatorWeb(romFilename))


    useEffect(() => {
        if (!emulator) return;

        const _init = async () => {
            await initEmulator(emulator);
        }

        const timer = setTimeout(_init, 1);
        return () => clearTimeout(timer);
    }, [])


    const emulatorHook = {
        emulator,
    }

    return emulatorHook;
}


export type EmulatorHook = {
    emulator: EmulatorWeb;
}



async function initEmulator(emulator: EmulatorWeb) {
    await emulator.init()

    if (!emulator.wasmExports) {
        console.error(`Cannot find wasmExports`)
        process.exit(1);
    }

    emulator.wasmExports.runEmulator()
}

