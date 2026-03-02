// Test 2: ANSI half-blocks — zero dependency
// Uses ▀ (upper half block) with fg = top pixel, bg = bottom pixel
// 4 grayscale shades mapped to ANSI 256-color palette
// 160x144 → 160x72 chars (wide, may need small terminal font)

const { generateFramebuffer, W, H } = require("./fake_framebuffer");

const TARGET_FPS = 30;

// Map shade (0-255) to one of 4 grayscale ANSI-256 colors
//   0 (black)=232, 85 (dark)=240, 170 (light)=248, 255 (white)=255
function shadeToAnsi(shade) {
    if (shade < 64) return 232;   // black
    if (shade < 128) return 240;  // dark gray
    if (shade < 192) return 248;  // light gray
    return 255;                    // white
}

let frame = 0;
let buffer = "";

function render() {
    const fb = generateFramebuffer(frame);

    buffer = "\x1b[H"; // cursor home

    for (let y = 0; y < H; y += 2) {
        for (let x = 0; x < W; x++) {
            const top = shadeToAnsi(fb[y * W + x]);
            const bot = (y + 1 < H) ? shadeToAnsi(fb[(y + 1) * W + x]) : 232;

            // fg = top pixel color, bg = bottom pixel color, char = ▀
            buffer += `\x1b[38;5;${top};48;5;${bot}m▀`;
        }
        buffer += "\x1b[0m\n";
    }

    process.stdout.write(buffer);
    frame++;
}

process.stdout.write("\x1b[2J\x1b[?25l"); // clear + hide cursor

const interval = setInterval(render, 1000 / TARGET_FPS);

setTimeout(() => {
    clearInterval(interval);
    process.stdout.write("\x1b[?25h\x1b[2J\x1b[H"); // show cursor + clear
    console.log(`ANSI half-blocks: rendered ${frame} frames in 5s = ${(frame / 5).toFixed(1)} FPS`);
    process.exit(0);
}, 5000);
