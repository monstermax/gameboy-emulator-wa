
import { useEffect, useState } from "react";

import { EmulatorWeb } from "../lib/EmulatorWeb";


export const useEmulator = (romFilename: string): EmulatorHook => {
    const [emulator] = useState(() => new EmulatorWeb(romFilename))


    useEffect(() => {
        if (!emulator) return;

        const _init = async () => {
            await initEmulator(emulator);
            emulator.runEmulatorCycles()
        }

        const timer = setTimeout(_init, 1);
        return () => clearTimeout(timer);
    }, [])


    async function initEmulator(emulator: EmulatorWeb): Promise<void> {
        await emulator.init()
        console.log(`Emulator initialized`)
    }


    const emulatorHook: EmulatorHook = {
        emulator,
    }

    return emulatorHook;
}


export type EmulatorHook = {
    emulator: EmulatorWeb;
}



