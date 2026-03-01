
import fs from 'fs';

import * as releaseModule from "../../../webassembly/build/release";


const wasmDir = `${__dirname}/../../../webassembly/build`; // Load Wasm Module from local filesystem
const wasmBaseUrl = "http://localhost:3240/webassembly";   // Load Wasm Module from HTTP endpoint


export type WasmExports = typeof releaseModule.__AdaptedExports;


export async function loadWasmModule(useDebugModule=true): Promise<WebAssembly.Module> {
    const wasmFileUrl = useDebugModule
        ? `${wasmDir}/debug.wasm`
        : `${wasmDir}/release.wasm`;

    const _module = fs.readFileSync(wasmFileUrl) as WebAssembly.Module;
    return _module;
}


export async function fetchWasmModule(useDebugModule=true): Promise<WebAssembly.Module> {
    const wasmFileUrl = useDebugModule
        ? `${wasmBaseUrl}/debug.wasm`
        : `${wasmBaseUrl}/release.wasm`;

    console.log(`Fetching Wasm Module from ${wasmFileUrl}`);

    const _module = await globalThis.WebAssembly.compileStreaming(globalThis.fetch(wasmFileUrl));
    return _module
}


export async function loadWasmExports(wasmModule: WebAssembly.Module, imports: { env: unknown }, debug=true): Promise<WasmExports> {
    const wasmExports = await releaseModule.instantiate(wasmModule, imports);
    return wasmExports;
}

