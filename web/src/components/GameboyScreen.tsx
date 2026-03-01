// Gameboy Emulator - Screen component

import { useEffect, useRef, type RefObject } from "react";

type GameboyScreenProps = {
    canvasRef: RefObject<HTMLCanvasElement | null>;
    scale?: number;
}

export function GameboyScreen({ canvasRef, scale = 3 }: GameboyScreenProps) {
    const containerRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
        const updateCanvasSize = () => {
            const canvas = canvasRef.current;
            const container = containerRef.current;
            if (!canvas || !container) return;

            // La résolution interne reste fixe (160x144)
            canvas.width = 160;
            canvas.height = 144;

            // La taille d'affichage CSS s'adapte au conteneur
            const containerWidth = container.clientWidth;
            const containerHeight = container.clientHeight;

            // On veut garder le ratio 160:144 = 10:9
            const ratio = 160 / 144;

            let displayWidth = containerWidth;
            let displayHeight = containerWidth / ratio;

            // Si la hauteur calculée dépasse le conteneur, on ajuste
            if (displayHeight > containerHeight) {
                displayHeight = containerHeight;
                displayWidth = containerHeight * ratio;
            }

            canvas.style.width = `${displayWidth}px`;
            canvas.style.height = `${displayHeight}px`;
        };

        window.addEventListener('resize', updateCanvasSize);

        setTimeout(updateCanvasSize, 150);

        return () => window.removeEventListener('resize', updateCanvasSize);
    }, [canvasRef]);


    return (
        <div className="w-full h-full p-1 flex items-center justify-center relative">
            <div ref={containerRef} className="size-full flex justify-center">
                <canvas
                    ref={canvasRef}
                    style={{
                        //width: 160 * scale,
                        //height: 144 * scale,
                        imageRendering: "pixelated",
                    }}
                    className="block bg-[#9bbc0f] rounded shadow-2xl"
                />
            </div>

            {/* Effet de réflection (purement décoratif) */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 right-0 h-1/3 bg-linear-to-b from-white/5 to-transparent rounded-t" />
                <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-linear-to-t from-black/20 to-transparent rounded-b" />
            </div>
        </div>
    );
}
