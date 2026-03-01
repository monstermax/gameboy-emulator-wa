
import { useEffect, useState } from "react";

import { EmulatorWeb } from "../lib/EmulatorWeb";


export const useEmulator = (romFilename: string): EmulatorHook => {
    const [emulator] = useState(() => new EmulatorWeb(romFilename))


    useEffect(() => {
        if (!emulator) return;

        const _init = async () => {
            await emulator.init()
            console.log(`[WEB] Emulator initialized`)

            emulator.runEmulatorCycles()
        }

        const timer = setTimeout(_init, 1);
        return () => clearTimeout(timer);
    }, [])


    const emulatorHook: EmulatorHook = {
        emulator,
    }

    return emulatorHook;
}


export type EmulatorHook = {
    emulator: EmulatorWeb;
}



