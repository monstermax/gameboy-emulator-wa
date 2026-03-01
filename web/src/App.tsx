
import { useEffect } from 'react'

import { useEmulator } from './hooks/useEmulator'
import { GameboyScreen } from './components/GameboyScreen'


//const romFilename = "SuperMarioLand.World.Rev1.gb";
const romFilename = "Tetris.World.RevA.gb";
//const romFilename = "DuckTales.USA.gb";


function App() {
    const { emulator, canvasRef, ready } = useEmulator(romFilename)

    useEffect(() => {
        if (!ready) return;
        console.log('[WEB] Emulator ready, rendering started');
    }, [ready])

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: 32 }}>
            <h2>Game Boy</h2>

            <GameboyScreen canvasRef={canvasRef} scale={3} />

            {!ready && <p>Loading...</p>}
        </div>
    )
}


export default App
