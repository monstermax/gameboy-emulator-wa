
# Webassembly Gameboy Emulator

## webassembly

mkdir webassembly
cd webassembly
npm init -y
npm install --save-dev assemblyscript
npx asinit .


## cli

mkdir cli
cd cli
npm init -y
tsc --init

npm install -D @types/node


## web

mkdir web
cd web
npm create vite@latest . -- --template react-ts
npm install --save-dev vite-plugin-node-polyfills

