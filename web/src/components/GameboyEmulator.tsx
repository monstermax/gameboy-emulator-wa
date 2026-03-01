
import { useEffect, useState } from 'react'

import { useEmulator } from '../hooks/useEmulator'
import { GameboyScreen } from './GameboyScreen'


//const romFilename = "SuperMarioLand.World.Rev1.gb";
const romFilename = "Tetris.World.RevA.gb";
//const romFilename = "Double.Dragon.II.USA.Europe.gb";


export const GameboyEmulator: React.FC = () => {
    const { emulator, emulatorStart, emulatorStop, isRunning: emulatorIsRunning, canvasRef, ready } = useEmulator(romFilename)

    useEffect(() => {
        if (!ready) return;
        console.log('[WEB] Emulator ready, rendering started');
    }, [ready])

    const handleLoadGame = (filepath: string) => {
        console.log(`Loading game ${filepath}`)
        emulatorStop()
        emulator.loadRom(filepath)
        emulatorStart()
    }

    return (
        <div className="h-full bg-background flex items-center justify-center p-2 border">
            <div className="h-full flex flex-col bg-card border NO-border-border rounded-lg">

                {/* Header */}
                <div className="px-2 py-1 flex items-center justify-between mb-2 border-b NO-border-border border">
                    <h2 className="font-semibold text-lg">Game Boy Emulator</h2>
                    {emulatorIsRunning && (
                        <span className="text-xs text-foreground/60">🔴 Running</span>
                    )}
                </div>

                {/* Écran */}
                <div className="mb-2 p-1 flex-1 min-h-0">
                    <div className="h-full border-2 border-border rounded overflow-hidden">
                        <GameboyScreen canvasRef={canvasRef} />
                    </div>
                </div>

                {/* Contrôles */}
                <div className="p-1 space-y-4 border">
                    <div className="flex justify-center gap-2">
                        <GameSelector
                            handleLoadGame={handleLoadGame}
                            selectedGame={romFilename}
                            disabled={!ready}
                        />

                        <button
                            onClick={() => emulatorIsRunning ? emulatorStop() : emulatorStart()}
                            disabled={!ready}
                            className={`px-4 py-2 text-foreground rounded disabled:opacity-50 text-sm cursor-pointer
                                ${emulatorIsRunning
                                    ? "bg-red-950 hover:bg-red-900"
                                    : "bg-green-950 hover:bg-green-900"
                                }
                            `}
                        >
                            {emulatorIsRunning ? "Stop" : "Start"}
                        </button>

                        <button
                            onClick={() => handleLoadGame(romFilename)}
                            disabled={!ready}
                            className="px-4 py-2 bg-muted text-foreground rounded hover:bg-muted/80 disabled:opacity-50 text-sm cursor-pointer"
                        >
                            Reset
                        </button>
                    </div>

                </div>

                {!ready && (
                    <p className="text-sm text-foreground/60 mt-4 text-center">Loading...</p>
                )}
            </div>
        </div>
    );
}


export type GameSelectorProps = {
    selectedGame?: string;
    handleLoadGame: (filepath: string) => void;
    disabled?: boolean;
}

const GameSelector: React.FC<GameSelectorProps> = (props) => {
    const { handleLoadGame, selectedGame, disabled } = props;
    const [gamesList, setGamesList] = useState<string[]>([]);

    useEffect(() => {
        fetch("/roms_list.json")
            .then(res => res.json())
            .then(setGamesList)
            .catch(console.error);
    }, []);

    return (
        <div>
            <select
                onChange={(e) => handleLoadGame(e.target.value)}
                value={selectedGame}
                disabled={disabled}
                className="w-full px-3 py-2 bg-muted border border-border rounded text-sm text-foreground disabled:opacity-50"
            >
                <option value="">Choose a game...</option>
                {gamesList.map(game =>
                    <option key={game} value={game}>{game}</option>
                )}
            </select>
        </div>
    );
}

