// Gameboy Emulator - Screen component

import type { RefObject } from "react";


type GameboyScreenProps = {
    canvasRef: RefObject<HTMLCanvasElement | null>;
    scale?: number;
}


export function GameboyScreen({ canvasRef, scale = 3 }: GameboyScreenProps) {
    return (
        <canvas
            ref={canvasRef}
            style={{
                width: 160 * scale,
                height: 144 * scale,
                imageRendering: "pixelated",
                backgroundColor: "#9bbc0f",
                border: "2px solid #333",
            }}
        />
    )
}
