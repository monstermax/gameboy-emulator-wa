
import { useEffect, useState } from 'react'

import { useEmulator } from './hooks/useEmulator'


const romFilename = "SuperMarioLand.World.Rev1.gb";


function App() {
    const emulatorHook = useEmulator(romFilename)

    useEffect(() => {
        if (!emulatorHook.emulator) return;

        const _use = () => {
            console.log('[WEB] Emulator mounted by App');
        }

        const timer = setTimeout(_use, 1);
        return () => clearTimeout(timer);

    }, [emulatorHook.emulator])

    return (
        <>
            Ready
        </>
    )
}


export default App
