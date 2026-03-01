// Gameboy Emulator - React hook

import { useEffect, useRef, useState } from "react";

import { EmulatorWeb } from "../lib/EmulatorWeb";


export const useEmulator = (romFilename: string): EmulatorHook => {
    const [emulator] = useState(() => new EmulatorWeb())
    const [ready, setReady] = useState(false)
    const canvasRef = useRef<HTMLCanvasElement>(null)


    useEffect(() => {
        if (!emulator) return;

        const _init = async () => {
            await emulator.init()
            await emulator.loadRom(romFilename)
            console.log(`[WEB] Emulator initialized`)

            //emulator.runEmulatorCycles() // OLD

            setReady(true)
        }

        const timer = setTimeout(_init, 1);

        return () => {
            clearTimeout(timer);
            emulator.stop();
        }
    }, [])


    // Attach canvas and start rendering once both ready and canvas are available
    useEffect(() => {
        if (!ready || !canvasRef.current) return;
        console.log('started')

        emulator.attachCanvas(canvasRef.current)
        emulator.start()

        return () => {
            emulator.stop()
        }
    }, [ready])


    return {
        emulator,
        canvasRef,
        ready,
    }
}


export type EmulatorHook = {
    emulator: EmulatorWeb;
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
    ready: boolean;
}
