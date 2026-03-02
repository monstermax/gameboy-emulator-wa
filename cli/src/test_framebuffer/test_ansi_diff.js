// Test 3: ANSI half-blocks with DIFF rendering
// Same visual as test 2, but only redraws cells that changed
// Massive perf gain for typical emulator output (most pixels don't change per frame)

const { generateFramebuffer, W, H } = require("./fake_framebuffer");

const TARGET_FPS = 60;
const ROWS = H / 2; // 72 rows of half-block pairs

function shadeToAnsi(shade) {
    if (shade < 64) return 232;
    if (shade < 128) return 240;
    if (shade < 192) return 248;
    return 255;
}

// Previous frame's color grid (top+bot per cell)
let prevGrid = new Uint8Array(ROWS * W * 2); // [top, bot] for each cell
prevGrid.fill(255); // force full redraw on first frame

let frame = 0;

function render() {
    const fb = generateFramebuffer(frame);
    let buffer = "";
    let moves = 0;

    for (let row = 0; row < ROWS; row++) {
        const y = row * 2;
        for (let x = 0; x < W; x++) {
            const top = shadeToAnsi(fb[y * W + x]);
            const bot = (y + 1 < H) ? shadeToAnsi(fb[(y + 1) * W + x]) : 232;

            const idx = (row * W + x) * 2;
            if (prevGrid[idx] !== top || prevGrid[idx + 1] !== bot) {
                prevGrid[idx] = top;
                prevGrid[idx + 1] = bot;

                // Move cursor to (row+1, x+1) and draw
                buffer += `\x1b[${row + 1};${x + 1}H\x1b[38;5;${top};48;5;${bot}m▀`;
                moves++;
            }
        }
    }

    if (buffer.length > 0) {
        buffer += "\x1b[0m";
        process.stdout.write(buffer);
    }

    frame++;
}

process.stdout.write("\x1b[2J\x1b[?25l");

const interval = setInterval(render, 1000 / TARGET_FPS);

setTimeout(() => {
    clearInterval(interval);
    process.stdout.write("\x1b[?25h\x1b[2J\x1b[H");
    console.log(`ANSI half-blocks DIFF: rendered ${frame} frames in 5s = ${(frame / 5).toFixed(1)} FPS`);
    process.exit(0);
}, 5000);
