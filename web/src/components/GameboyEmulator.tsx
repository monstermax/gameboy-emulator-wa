
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
        <div className="bg-background text-foreground flex flex-col justify-center items-center">
            <h2>Game Boy Emulator</h2>

            <GameboyScreen canvasRef={canvasRef} scale={3} />

            <EmulatorControl
                emulatorStart={emulatorStart}
                emulatorStop={emulatorStop}
                emulatorIsRunning={emulatorIsRunning}
            />

            <GameSelector handleLoadGame={handleLoadGame} selectedGame={romFilename} />

            {!ready && <p>Loading...</p>}
        </div>
    );
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


export type GameSelectorProps = {
    selectedGame?: string;
    handleLoadGame: (filepath: string) => void;
}

const GameSelector: React.FC<GameSelectorProps> = (props) => {
    const { handleLoadGame, selectedGame } = props;

    const [gamesList, setGamesList] = useState<string[]>([]);

    const gamesListUrl = "/roms_list.json";

    useEffect(() => {
        const _load = async () => {
            const response = await fetch(gamesListUrl)
            const _gamesList = await response.json() as string[];
            setGamesList(_gamesList);
        }

        const timer = setTimeout(_load, 1);
        return () => clearTimeout(timer);
    }, [])


    return (
        <>
            Select ROM

            <select onChange={(event) => handleLoadGame(event.target.value)}>
                <option value=""></option>

                {gamesList.map(gameFilepath => 
                    <option key={gameFilepath} value={gameFilepath} selected={gameFilepath === selectedGame}>
                        {gameFilepath}
                    </option>
                )}
            </select>
        </>
    );
}

