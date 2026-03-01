
import * as releaseModule from "../../../webassembly/build/release";


const wasmBaseUrl = "/webassembly"; // Load Wasm Module from HTTP endpoint


export type WasmExports = typeof releaseModule.__AdaptedExports;


export async function fetchWasmModule(useDebugModule=true): Promise<WebAssembly.Module> {
    const wasmFileUrl = useDebugModule
        ? `${wasmBaseUrl}/debug.wasm`
        : `${wasmBaseUrl}/release.wasm`;

    console.log(`Fetching Wasm Module from ${wasmFileUrl}`);

    const _module = await globalThis.WebAssembly.compileStreaming(globalThis.fetch(wasmFileUrl));
    return _module
}


export async function loadWasmExports(wasmModule: WebAssembly.Module, imports: { env: unknown }): Promise<WasmExports> {
    const wasmExports = await releaseModule.instantiate(wasmModule, imports);
    return wasmExports;
}


