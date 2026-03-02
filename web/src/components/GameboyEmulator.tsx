
import { useEffect, useRef, useState } from 'react'

import { useEmulator } from '../hooks/useEmulator'
import { GameboyScreen } from './GameboyScreen'

import type { EmulatorWeb, StateDump } from '../lib/EmulatorWeb';
import { sleep } from '../lib/utils';
import { toHex } from '../lib/lib_numbers';


//const romFilename = "SuperMarioLand.World.Rev1.gb";
const romFilename = "Tetris.World.RevA.gb";
//const romFilename = "Double.Dragon.II.USA.Europe.gb";


export const GameboyEmulator: React.FC = () => {
    const { emulator, emulatorStart, emulatorStop, isRunning: emulatorIsRunning, canvasRef, ready } = useEmulator(romFilename)

    const lastIterationInfosRef = useRef({ cycles: 0n, frames: 0n, date: Date.now() });
    const [cyclesSpeed, setCyclesSpeed] = useState(0);
    const [framesSpeed, setFramesSpeed] = useState(0);

    const [selectedGame, setSelectedGame] = useState(romFilename);
    const [debuggerVisible, setDebuggerVisible] = useState(false);
    const [audioEnabled, setAudioEnabled] = useState(true);


    useEffect(() => {
        if (!ready) return;
        console.log('[WEB] Emulator ready, rendering started');
    }, [ready])

    useEffect(() => {
        //if (!emulatorIsRunning) return;

        const _do = () => {
            if (!emulatorIsRunning) {
                //return;
                clearInterval(timer);
            }

            const cyclesDiff = emulator.cycles - lastIterationInfosRef.current.cycles;
            const framesDiff = emulator.frames - lastIterationInfosRef.current.frames;

            const currentDate = Date.now();
            const durationDiff = (currentDate - lastIterationInfosRef.current.date) / 1000;

            const _cyclesSpeed = Number(cyclesDiff) / durationDiff;
            setCyclesSpeed(_cyclesSpeed)

            const _framesSpeed = Number(framesDiff) / durationDiff;
            setFramesSpeed(_framesSpeed)

            lastIterationInfosRef.current.cycles = emulator.cycles;
            lastIterationInfosRef.current.frames = emulator.frames;
            lastIterationInfosRef.current.date = currentDate;
        }

        const timer = setInterval(_do, 1000);
        return () => clearInterval(timer);
    }, [emulatorIsRunning])

    const handleLoadGame = async (filepath: string) => {
        console.log(`Loading game ${filepath}`)
        setSelectedGame(filepath);
        emulatorStop()
        await sleep(100)
        await emulator.loadRom(filepath)
        emulatorStart()
        emulator.reset()
    }

    const handleReset = () => {
        emulator.reset()
    }

    const toggleDisableSound = () => {
        emulator.audioEnabled = !emulator.audioEnabled;
        setAudioEnabled(emulator.audioEnabled)
    }

    const toggleShowDebugger = () => {
        setDebuggerVisible(b =>!b)
    }

    return (
        <div className="h-full bg-background flex items-center justify-center p-2 border">
            <div className="h-full flex flex-col bg-card border NO-border-border rounded-lg">

                {/* Header */}
                <div className="px-2 py-1 flex items-center justify-between mb-2 border-b NO-border-border border">
                    <h2 className="font-semibold text-lg">Game Boy Emulator</h2>

                    {emulatorIsRunning && (
                        <>
                            <div className="text-xs">
                                {Math.round(framesSpeed)} FPS
                            </div>

                            <span className="text-xs text-foreground/60">Running 🔴</span>
                        </>
                    )}

                    {!emulatorIsRunning && (
                        <>
                            <span className="text-xs text-foreground/60">⚫</span>
                        </>
                    )}
                </div>

                {/* Écran */}
                <div className="mb-2 p-1 flex-1 min-h-0">
                    <div className="h-full border-2 border-border rounded overflow-hidden">
                        <GameboyScreen canvasRef={canvasRef} debuggerVisible={debuggerVisible} />
                    </div>
                </div>

                {/* Contrôles */}
                <div className="p-1 space-y-4 border">
                    <div className="flex flex-col gap-2">

                        <div className={`size-full ${debuggerVisible ? "" : "hidden"}`}>
                            <Debugger emulator={emulator} emulatorIsRunning={emulatorIsRunning} />
                        </div>

                        <div className="flex justify-center gap-2">
                            <GameSelector
                                handleLoadGame={handleLoadGame}
                                selectedGame={selectedGame}
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
                                onClick={() => handleReset()}
                                disabled={!ready}
                                className="px-4 py-2 bg-muted text-foreground rounded hover:bg-muted/80 disabled:opacity-50 text-sm cursor-pointer"
                            >
                                Reset
                            </button>

                            <button
                                onClick={() => toggleDisableSound()}
                                disabled={!ready}
                                className="px-4 py-2 bg-muted text-foreground rounded hover:bg-muted/80 disabled:opacity-50 text-sm cursor-pointer"
                            >
                                {audioEnabled ? "Disable Sound" : "Enable Sound"}
                            </button>

                            <button
                                onClick={() => toggleShowDebugger()}
                                disabled={!ready}
                                className="px-4 py-2 bg-muted text-foreground rounded hover:bg-muted/80 disabled:opacity-50 text-sm cursor-pointer"
                            >
                                Debug
                            </button>
                        </div>
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

    const gamesListUrl = "/roms_list.json";

    useEffect(() => {
        fetch(gamesListUrl)
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



export type DebuggerProps = {
    emulator: EmulatorWeb;
    emulatorIsRunning: boolean;
}

export const Debugger: React.FC<DebuggerProps> = (props) => {
    const { emulator, emulatorIsRunning } = props;

    const instructionsSet = emulator.getInstructionsSet()

    const showCurrentRom = () => {
        console.log('currentRomFile:', emulator.currentRomFile)
    }

    const handleStepCycle = () => {
        emulator.runEmulatorCycles(1);

        const state = emulator.dumpState()
        showStateDump(state);
    }

    const handleStepFrame = () => {
        emulator.runEmulatorFrames(1);

        const state = emulator.dumpState()
        showStateDump(state);
    }

    const showStateDump = (state: StateDump) => {
        const opcode = toHex(Number(state.currentInstruction)) as keyof typeof instructionsSet['unprefixed']
        const ir = opcode ? instructionsSet.unprefixed[opcode] : null;
        console.log(state, ir)

        const PC = Number(state.PC)

        const currentExecutionZone = emulator.currentRomFile?.subarray(PC - 10, PC + 20);
        console.log('currentExecutionZone:', currentExecutionZone)
    }

    return (
        <>
            <h3>
                Debugger
            </h3>

            <div className="m-2 flex gap-2">
                <button
                    disabled={false}
                    onClick={() => showCurrentRom()}
                    className="bg-primary px-1 rounded"
                >
                    Show ROM
                </button>

                <button
                    disabled={emulatorIsRunning}
                    onClick={() => handleStepCycle()}
                    className={`px-4 py-2 text-foreground rounded disabled:opacity-50 text-sm cursor-pointer bg-yellow-950 hover:bg-yellow-900`}
                >
                    Step cycle
                </button>

                <button
                    disabled={emulatorIsRunning}
                    onClick={() => handleStepFrame()}
                    className={`px-4 py-2 text-foreground rounded disabled:opacity-50 text-sm cursor-pointer bg-yellow-950 hover:bg-yellow-900`}
                >
                    Step frame
                </button>
            </div>

            <div>

            </div>
        </>
    );
}

