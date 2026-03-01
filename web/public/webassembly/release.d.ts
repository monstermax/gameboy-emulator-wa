declare namespace __AdaptedExports {
  /** Exported memory */
  export const memory: WebAssembly.Memory;
  /**
   * assembly/index/runEmulator
   */
  export function runEmulator(): void;
  /**
   * assembly/index/injectInstructionsSet
   */
  export function injectInstructionsSet(): void;
  /**
   * assembly/index/injectRom
   * @param data `~lib/typedarray/Uint8Array`
   */
  export function injectRom(data: Uint8Array): void;
}
/** Instantiates the compiled WebAssembly module with the given imports. */
export declare function instantiate(module: WebAssembly.Module, imports: {
  env: unknown,
}): Promise<typeof __AdaptedExports>;
