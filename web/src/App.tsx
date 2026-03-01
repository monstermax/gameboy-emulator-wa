
import { useEffect } from 'react'

import { useEmulator, type EmulatorHook } from './hooks/useEmulator'
import { GameboyScreen } from './components/GameboyScreen'
import type { EmulatorWeb } from './lib/EmulatorWeb';


//const romFilename = "SuperMarioLand.World.Rev1.gb";
const romFilename = "Tetris.World.RevA.gb";
//const romFilename = "Double.Dragon.II.USA.Europe.gb";


function App() {
    const { emulatorStart, emulatorStop, isRunning: emulatorIsRunning, canvasRef, ready } = useEmulator(romFilename)

    useEffect(() => {
        if (!ready) return;
        console.log('[WEB] Emulator ready, rendering started');
    }, [ready])

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: 10, justifyContent: "center" }}>
            <h2>Game Boy Emulator</h2>

            <GameboyScreen canvasRef={canvasRef} scale={3} />

            <EmulatorControl
                emulatorStart={emulatorStart}
                emulatorStop={emulatorStop}
                emulatorIsRunning={emulatorIsRunning}
            />

            <GameSelector />

            {!ready && <p>Loading...</p>}
        </div>
    )
}



export type EmulatorControlProps = {
    emulatorStart: () => void;
    emulatorStop: () => void;
    emulatorIsRunning: boolean;
}

const EmulatorControl: React.FC<EmulatorControlProps> = (props) => {
    const { emulatorStart, emulatorStop, emulatorIsRunning } = props;

    return (
        <>
            <button
                onClick={() => {
                    emulatorIsRunning
                        ? emulatorStop()
                        : emulatorStart()
                }}
            >
                {emulatorIsRunning ? "Stop" : "Start"}
            </button>
        </>
    );
}


const GameSelector: React.FC = () => {
    return (
        <>
            Select ROM
        </>
    );
}


export default App
