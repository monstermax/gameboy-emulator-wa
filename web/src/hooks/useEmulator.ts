// Gameboy Emulator - React hook

import { useEffect, useRef, useState } from "react";

import { EmulatorWeb } from "../lib/EmulatorWeb";


export const useEmulator = (romFilename: string, autoStart=false): EmulatorHook => {
    const [emulator] = useState(() => new EmulatorWeb())
    const [ready, setReady] = useState(false)
    const [isRunning, setIsRunning] = useState(false)
    const canvasRef = useRef<HTMLCanvasElement>(null)


    useEffect(() => {
        if (!emulator) return;

        const _init = async () => {
            await emulator.init()
            await emulator.loadRom(romFilename)

            setReady(true)
            console.log(`[WEB] Emulator initialized`)
        }

        const timer = setTimeout(_init, 1);

        return () => {
            clearTimeout(timer);
            emulatorStop();
        }
    }, [])


    const emulatorStart = () => {
        emulator.start();
        setIsRunning(true);
    }


    const emulatorStop = () => {
        emulator.stop();
        setIsRunning(false);
    }


    // Attach canvas and start rendering once both ready and canvas are available
    useEffect(() => {
        if (!ready || !canvasRef.current) return;

        emulator.attachCanvas(canvasRef.current)

        if (autoStart) {
            emulatorStart();

            return () => {
                emulatorStop();
            }
        }
    }, [ready])


    return {
        emulator,
        canvasRef,
        ready,
        isRunning,
        emulatorStart,
        emulatorStop,
    }
}


export type EmulatorHook = {
    emulator: EmulatorWeb;
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
    ready: boolean;
    isRunning: boolean;
    emulatorStart: () => void;
    emulatorStop: () => void;
}
