
# Gameboy Emulator



## Technologies
- WebAssembly (AssemblyScript)
- TypeScript + React


## Project structure
- cli : emulator for nodejs. not yet functional
- roms : gameboy roms/games
- web : emulator for vitejs/react. Works almost perfectly (a few minor bugs, especially with the random number generator) 
- webassembly : core emulator



## Installation
```bash
git clone https://github.com/monstermax/gameboy-emulator-wa
cd gameboy-emulator-wa

## Core Emulator
cd webassembly
npm install
npm asbuild

cd ..

## Web GUI
cd web
npm install

npm build
# or
npm run dev

cd ..

## NodeJS Cli
cd cli
npm install
ts-node src/emulator_cli.ts # not yet functional

```


## Key Map:
 - A      = "z"
 - B      = "x"
 - Select = "Shift"
 - Start  = "Enter"




## Roadmap
- cli: missing screen+inputs+audio support


