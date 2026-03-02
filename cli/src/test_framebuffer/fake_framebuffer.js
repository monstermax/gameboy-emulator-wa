// Shared: generates a fake 160x144 Game Boy framebuffer (grayscale 0-255)
// with a moving pattern to test animation

const W = 160;
const H = 144;

function generateFramebuffer(frame) {
    const fb = new Uint8Array(W * H);

    for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
            // Checkerboard + moving wave
            const checker = ((x >> 3) + (y >> 3)) & 1;
            const wave = Math.sin((x + frame * 2) * 0.05) * Math.cos((y + frame) * 0.07);
            const val = checker ? 200 : 50;
            const shade = Math.max(0, Math.min(255, val + wave * 80));
            fb[y * W + x] = shade;
        }
    }

    // Draw a moving "sprite" (filled square)
    const sx = Math.floor(60 + Math.sin(frame * 0.05) * 40);
    const sy = Math.floor(60 + Math.cos(frame * 0.07) * 30);
    for (let dy = 0; dy < 16; dy++) {
        for (let dx = 0; dx < 16; dx++) {
            const px = sx + dx;
            const py = sy + dy;
            if (px >= 0 && px < W && py >= 0 && py < H) {
                fb[py * W + px] = 0; // black sprite
            }
        }
    }

    return fb;
}

module.exports = { generateFramebuffer, W, H };
