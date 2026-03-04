
import { useCallback, useEffect, useRef, useState } from 'react'
import Gamepad, { type Axis, type Button } from 'react-gamepad'


import { useEmulator } from '../hooks/useEmulator'
import { GameboyScreen } from './GameboyScreen'

import type { EmulatorWeb, StateDump } from '../lib/EmulatorWeb';
import { asserts, sleep } from '../lib/utils';
import { toHex } from '../lib/lib_numbers';
import type { Instruction, InstructionDebug } from '../lib/cpu_instructions';


//const romFilename = "gb/SuperMarioLand.World.Rev1.gb";
const romFilename = "gb/Tetris.World.RevA.gb";
//const romFilename = "gb/Double.Dragon.II.USA.Europe.gb";


export const GameboyEmulator: React.FC = () => {
    const { emulator, emulatorStart, emulatorStop, isRunning: emulatorIsRunning, canvasRef, ready } = useEmulator(romFilename)

    const lastIterationInfosRef = useRef({ cycles: 0n, frames: 0n, date: Date.now() });
    const [ emulatorState, setEmulatorState ] = useState<StateDump | null>(null);

    const [cyclesSpeed, setCyclesSpeed] = useState(0);
    const [framesSpeed, setFramesSpeed] = useState(0);

    const [selectedGame, setSelectedGame] = useState(romFilename);
    const [debuggerVisible, setDebuggerVisible] = useState(false);
    const [audioEnabled, setAudioEnabled] = useState(true);
    const [audioVolume, setAudioVolume] = useState(100);
    const [speed, setSpeed] = useState(1);
    const [audioVolumeSelectorVisible, setAudioVolumeSelectorVisible] = useState(false);
    const cursorRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
        if (!ready) return;
        console.log('[WEB] Emulator ready, rendering started');
        handleSetAudioVolume(100)
        //emulator.setSpeed(1)
    }, [ready])


    useEffect(() => {
        if (speed <= 0 || speed > 10) return;
        emulator.setSpeed(speed)
    }, [speed])


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

    const handleSetSpeed = (speed: number) => {
        if (!emulator) return;

        console.log('handleSetSpeed:', speed)
        setSpeed(speed)
        //emulator.setSpeed(speed)
    }


    const handleSetAudioVolume = (volume: number) => {
        setAudioVolume(volume)
        emulator.setAudioVolume(volume)

        if (cursorRef.current) {
            // Mettre à jour la position du curseur
            cursorRef.current.style.top = `${100 - volume}%`;
        }
    }

    const handleCursorMouseDown = useCallback((event: React.MouseEvent<Element, MouseEvent>) => {
        event.preventDefault();
    }, []);

    const handleCursorMouseMove = useCallback((event: React.MouseEvent<Element, MouseEvent>) => {
        if (event.buttons === 1) {
            const div = event.currentTarget as HTMLDivElement;

            //const container = div.parentElement?.parentElement;
            const container = cursorRef.current?.parentElement;
            if (!container) return;

            const rect = container.getBoundingClientRect();
            const padding = 4; // py-1 = 4px
            const availableHeight = rect.height - (padding * 2);

            let y = event.clientY - rect.top - padding;
            y = Math.max(0, Math.min(availableHeight, y));

            // Calculer le pourcentage (inversé car top=0% = volume max)
            let percentage = ((availableHeight - y) / availableHeight) * 100;
            console.log({ percentage })

            percentage = Math.max(0, Math.min(100, percentage));

            // Mettre à jour le volume
            handleSetAudioVolume(Math.round(percentage));
        }
    }, [])

    const toggleShowDebugger = () => {
        setDebuggerVisible(b => !b)
    }

    const handleGamepadConnect = (gamepadIndex: number) => {
        console.log('gamepad => onConnect', gamepadIndex)
    }

    const handleGamepadDisconnect = (gamepadIndex: number) => {
        console.log('gamepad => onDisconnect', gamepadIndex)
    }

    const handleGamepadAxisChange = (axisName: Axis, value: number, previousValue: number) => {
        console.log('gamepad => onAxisChange', axisName, value, previousValue)

        const key = (axisName === "LeftStickX")
            ? ((value || previousValue) === 1 ? "ArrowRight" : "ArrowLeft")
            : ((value || previousValue) === 1 ? "ArrowUp" : "ArrowDown");

        const evt = new KeyboardEvent('gamepad-button-change', { key });
        console.log('evt:', evt, (value !== 0 ? "DOWN" : "UP"))

        if (value !== 0) {
            emulator.onKeyDown(evt)

        } else {
            emulator.onKeyUp(evt)
        }
    }

    const handleGamepadButtonChange = (buttonName: Button, pressed: boolean) => {
        console.log('gamepad => onButtonChange', buttonName, pressed)

        const key = buttonName === "A"
            ? "x" // A
            : buttonName === "B"
                ? "z" // B
                : buttonName === "Back"
                    ? "Shift" // Select
                    : buttonName === "Start"
                        ? "Enter" // Start
                        : ""


        const evt = new KeyboardEvent('gamepad-button-change', { key });
        console.log('evt:', evt)

        if (pressed) {
            emulator.onKeyDown(evt)

        } else {
            emulator.onKeyUp(evt)
        }
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

                        <Gamepad
                            gamepadIndex={0}
                            onConnect={handleGamepadConnect}
                            onDisconnect={handleGamepadDisconnect}
                            onAxisChange={handleGamepadAxisChange}
                            onButtonChange={handleGamepadButtonChange}
                        >
                            <div></div>
                        </Gamepad>

                        <div className={`size-full ${debuggerVisible ? "" : "hidden"}`}>
                            <Debugger
                                emulator={emulator}
                                emulatorIsRunning={emulatorIsRunning}
                                emulatorState={emulatorState}
                                handleSetSpeed={handleSetSpeed}
                                setEmulatorState={setEmulatorState}
                            />
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
                                className="px-4 py-2 text-foreground rounded bg-yellow-950 hover:bg-yellow-900 disabled:opacity-50 text-sm cursor-pointer"
                            >
                                Debug
                            </button>

                            <div className="relative select-none">
                                <div className={`absolute w-8 h-20 bottom-10 -right-0.5 bg-background border rounded ${audioVolumeSelectorVisible ? "" : "hidden"}`}>
                                    <div className="size-full cursor-pointer py-1">
                                        <div
                                            onMouseDown={handleCursorMouseDown}
                                            onMouseMove={handleCursorMouseMove}
                                            onMouseLeave={() => { }}
                                            className="size-full relative"
                                        >
                                            {/* La barre verticale doit aussi tenir compte du padding */}
                                            <div className="absolute left-1/2 -translate-x-1/2 h-full w-[3px] bg-neutral-600 rounded my-1 -translate-y-1" />

                                            {/* Cursor - position relative au container avec padding */}
                                            <div
                                                ref={cursorRef}
                                                className="absolute left-1/2 -translate-x-1/2 size-3 rounded-full bg-neutral-300 -translate-y-1/2"
                                                style={{ top: `calc(${100 - audioVolume}% + 4px)` }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button className="p-2 select-none cursor-pointer" onClick={() => setAudioVolumeSelectorVisible(b => !b)}>
                                    {audioVolume === 0 ? "🔇" : audioVolume < 50 ? "🔉" : "🔊"}
                                </button>
                            </div>
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
            .then(games => games.filter((filepath: string) => !filepath.startsWith('gbc/'))) // exclude Gameboy Color games (do not works)
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
                    <option key={game} value={game}>{getGameName(game)}</option>
                )}
            </select>
        </div>
    );
}



export type DebuggerProps = {
    emulator: EmulatorWeb;
    emulatorIsRunning: boolean;
    emulatorState: StateDump | null;
    handleSetSpeed: (speed: number) => void;
    setEmulatorState: React.Dispatch<React.SetStateAction<StateDump | null>>;
}

export const Debugger: React.FC<DebuggerProps> = (props) => {
    const { emulator, emulatorIsRunning, emulatorState, handleSetSpeed, setEmulatorState } = props;

    const [nextInstructions, setNextInstructions] = useState<InstructionDebug[]>([]);

    useEffect(() => {
        if (!emulator.wasmExports) return;

        const _show = () => {
            const state = emulator.dumpState()
            showStateDump(state);
        }

        const timer = setTimeout(_show, 10);
        return () => clearTimeout(timer);
    }, [emulator.wasmExports]);


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
        if (!emulator.currentRomFile) return;

        console.log(state)

        const _nextInstructions = emulator.readNextInstructions(10);
        setNextInstructions(_nextInstructions)

        setEmulatorState(state);
    }


    return (
        <>
            <div className="flex gap-2">
                <div className="flex flex-col gap-2">
                    <h3 className="flex">
                        Debugger
                    </h3>

                    <div className="flex gap-2">
                        <button
                            disabled={false}
                            onClick={() => showCurrentRom()}
                            className={`px-4 py-1 text-foreground rounded disabled:opacity-50 text-sm cursor-pointer bg-blue-950 hover:bg-blue-900`}
                        >
                            Show ROM
                        </button>

                        <button
                            disabled={emulatorIsRunning}
                            onClick={() => handleStepCycle()}
                            className={`px-4 py-1 text-foreground rounded disabled:opacity-50 text-sm cursor-pointer bg-yellow-950 hover:bg-yellow-900`}
                        >
                            Step cycle
                        </button>

                        <button
                            disabled={emulatorIsRunning}
                            onClick={() => handleStepFrame()}
                            className={`px-4 py-1 text-foreground rounded disabled:opacity-50 text-sm cursor-pointer bg-yellow-950 hover:bg-yellow-900`}
                        >
                            Step frame
                        </button>
                    </div>

                    <div className="flex gap-1">
                        <button
                            disabled={false}
                            onClick={() => handleSetSpeed(0.5)}
                            className={`px-4 py-1 text-foreground rounded disabled:opacity-50 text-sm cursor-pointer bg-yellow-950 hover:bg-yellow-900`}
                        >
                            0.5x
                        </button>

                        <button
                            disabled={false}
                            onClick={() => handleSetSpeed(1)}
                            className={`px-4 py-1 text-foreground rounded disabled:opacity-50 text-sm cursor-pointer bg-yellow-950 hover:bg-yellow-900`}
                        >
                            1x
                        </button>

                        <button
                            disabled={false}
                            onClick={() => handleSetSpeed(2)}
                            className={`px-4 py-1 text-foreground rounded disabled:opacity-50 text-sm cursor-pointer bg-yellow-950 hover:bg-yellow-900`}
                        >
                            2x
                        </button>

                        <button
                            disabled={false}
                            onClick={() => handleSetSpeed(5)}
                            className={`px-4 py-1 text-foreground rounded disabled:opacity-50 text-sm cursor-pointer bg-yellow-950 hover:bg-yellow-900`}
                        >
                            5x
                        </button>
                    </div>
                </div>

                <div className="border border-yellow-700 flex flex-col">
                    <div>Registers</div>

                    <div className="flex flex-col gap-1">
                        <div>PC: {emulatorState?.registers.PC}</div>
                        <div>SP: {emulatorState?.registers.SP}</div>

                        <div className="grid grid-cols-2 gap-1">
                            <div>A: {emulatorState?.registers.A}</div>
                            <div>F: {emulatorState?.registers.F}</div>
                        </div>

                        <div className="grid grid-cols-2 gap-1">
                            <div>B: {emulatorState?.registers.B}</div>
                            <div>C: {emulatorState?.registers.C}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                            <div>D: {emulatorState?.registers.D}</div>
                            <div>E: {emulatorState?.registers.E}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                            <div>H: {emulatorState?.registers.H}</div>
                            <div>L: {emulatorState?.registers.L}</div>
                        </div>
                    </div>
                </div>


                <div className="border border-amber-400 grow">
                    {nextInstructions.map((instruction, idx) => {
                        const data = Array.from(instruction.data?.map(b => b.valueOf()) ?? []);
                        const instructionData = data.map(val => toHex(val, 2));

                        return (
                            <div
                                key={instruction.address}
                                className={`px-1 text-sm grid grid-cols-4 ${idx === 0 ? "bg-background/10" : "bg-background"}`}
                            >
                                <div>{toHex(instruction.address ?? 0, 4)}</div>
                                <div>{instruction.opcode}</div>
                                <div>{instruction.mnemonic}</div>
                                <div>{instructionData.join(' ')}</div>
                            </div>
                        );
                    })}
                </div>
                
            </div>
        </>
    );
}



function getGameName(filepath: string): string {
    const parts = filepath.split('/')
    const filename = parts.at(-1) ?? '';

    const parts2 = filename.split('.')
    parts2.pop();

    const gameName = parts2.join('.');
    return gameName
}

