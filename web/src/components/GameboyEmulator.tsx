
import { useEffect, useRef, useState } from 'react'
import Gamepad, { type Axis, type Button } from 'react-gamepad'


import { useEmulator } from '../hooks/useEmulator'
import { GameboyScreen } from './GameboyScreen'

import type { EmulatorWeb, StateDump } from '../lib/EmulatorWeb';
import { asserts, sleep } from '../lib/utils';
import { toHex } from '../lib/lib_numbers';
import type { Instruction, InstructionDebug } from '../lib/cpu_instructions';


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
                                className="px-4 py-2 text-foreground rounded bg-yellow-950 hover:bg-yellow-900 disabled:opacity-50 text-sm cursor-pointer"
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

    const [nextInstructions, setNextInstructions] = useState<InstructionDebug[]>([]);
    const [previousInstructions, setPreviousInstructions] = useState<{ address: number, value: number }[]>([]);

    const instructionsSet = emulator.getInstructionsSet()

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

        const PC = Number(state.PC)

        const currentExecutionZone = emulator.currentRomFile.subarray(PC - 5, PC + 20);
        //console.log('currentExecutionZone:', currentExecutionZone)

        let isCbPrefixed = state.isCbPrefixed;
        const _nextInstructions: Instruction[] = [];
        const _previousInstructions: { address: number, value: number }[] = [];


        for (let address = PC - 1; address > PC - 5; address--) {
            const opcode = currentExecutionZone.at(address - PC) ?? 0
            _previousInstructions.push({ address, value: opcode })
        }
        _previousInstructions.reverse()


        for (let address = PC; address < PC + 20; address++) {
            const addressHex = toHex(address, 4);
            const opcode = currentExecutionZone.at(address - PC) as number | undefined;
            asserts(opcode !== undefined, `Missing opcode at address ${addressHex} (prefixed=${isCbPrefixed ? "Y" : "N"})`)

            const opcodeHex = toHex(opcode) as keyof typeof instructionsSet['cbprefixed']

            let currentInstruction: InstructionDebug | null = null;

            if (isCbPrefixed) {
                currentInstruction = { ...instructionsSet['cbprefixed'][opcodeHex] }

            } else {
                currentInstruction = { ...instructionsSet['unprefixed'][opcodeHex] }
            }

            if (!currentInstruction) {
                throw new Error(`Missing currentInstruction at address ${addressHex} (opcode=${opcodeHex}  prefixed=${isCbPrefixed ? "Y" : "N"})`);
            }

            currentInstruction.address = address;
            currentInstruction.opcode = opcodeHex;
            currentInstruction.isCbPrefixed = isCbPrefixed;

            const data = new Array<number>(currentInstruction.bytes-1).fill(0);

            data.forEach((byte, idx) => {
                address++;
                data[idx] = currentExecutionZone.at(address - PC)?.valueOf() ?? -1
            })

            currentInstruction.data = data;

            _nextInstructions.push(currentInstruction);

            isCbPrefixed = false;

            if (_nextInstructions.length >= 5) {
                break;
            }

            if (!isCbPrefixed && opcodeHex === '0xCB') {
                isCbPrefixed = true;
                continue;
            }
        }

        //console.log('_previousInstructions:', _previousInstructions);
        //console.log('nextInstructions:', _nextInstructions);
        setPreviousInstructions(_previousInstructions)
        setNextInstructions(_nextInstructions)
    }


    return (
        <>
            <div className="flex gap-2">
                <h3 className="flex items-end">
                    Debugger
                </h3>

                <div className="flex gap-2 items-end">
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

                <div className="border border-amber-400 grow">
                    {previousInstructions.map((instruction, idx) => {
                        return (
                            <div
                                key={instruction.address}
                                className={`px-1 text-sm grid grid-cols-4 ${idx === 0 ? "bg-background/10" : "bg-background"}`}
                            >
                                <div>{toHex(instruction.address ?? 0, 4)}</div>
                                <div>{toHex(instruction.value)}</div>
                                <div>-</div>
                                <div>-</div>
                            </div>
                        );
                    })}

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

