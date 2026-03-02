// Test 5: ANSI half-blocks — 24-shade grayscale, batched string build
// Best visual quality without diff complexity
// Uses ANSI-256 grayscale ramp (232-255)

const { generateFramebuffer, W, H } = require("./fake_framebuffer");

const TARGET_FPS = 30;

function shadeToAnsi(shade) {
    return 232 + Math.floor((shade / 255) * 23);
}

let frame = 0;

function render() {
    const fb = generateFramebuffer(frame);

    // Build entire frame as one string, batching consecutive same-color cells
    let out = "\x1b[H";
    let lastTop = -1;
    let lastBot = -1;

    for (let y = 0; y < H; y += 2) {
        for (let x = 0; x < W; x++) {
            const top = shadeToAnsi(fb[y * W + x]);
            const bot = (y + 1 < H) ? shadeToAnsi(fb[(y + 1) * W + x]) : 232;

            if (top !== lastTop || bot !== lastBot) {
                out += `\x1b[38;5;${top};48;5;${bot}m`;
                lastTop = top;
                lastBot = bot;
            }
            out += "▀";
        }
        out += "\x1b[0m\n";
        lastTop = -1;
        lastBot = -1;
    }

    process.stdout.write(out);
    frame++;
}

process.stdout.write("\x1b[2J\x1b[?25l");

const interval = setInterval(render, 1000 / TARGET_FPS);

setTimeout(() => {
    clearInterval(interval);
    process.stdout.write("\x1b[?25h\x1b[2J\x1b[H");
    console.log(`ANSI 24-shade batched: rendered ${frame} frames in 5s = ${(frame / 5).toFixed(1)} FPS`);
    process.exit(0);
}, 5000);
