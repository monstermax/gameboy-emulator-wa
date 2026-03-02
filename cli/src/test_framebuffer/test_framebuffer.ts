// Animated pixel art demo — character jump + coin catch
// Uses ANSI half-blocks rendering (160x144, Game Boy resolution)
// Run: npx ts-node test_animation.ts

const W = 160;
const H = 144;

// === Color palette (Game Boy-ish) ===
const COL_SKY = 200;
const COL_GROUND = 80;
const COL_GRASS = 120;
const COL_BRICK = 60;
const COL_BLACK = 0;
const COL_WHITE = 255;
const COL_DARK = 50;
const COL_MID = 140;
const COL_COIN = 230;
const COL_COIN_DARK = 170;
const COL_SKIN = 210;
const COL_HAT = 40;
const COL_SHIRT = 100;
const COL_SHOE = 30;

// === Sprite definitions (pixel art, top-left origin) ===

// Character: 10x14 pixel sprite
// Standing pose
const CHAR_STAND: number[][] = [
    //  0  1  2  3  4  5  6  7  8  9
    [ 0, 0, 0, -1,-1,-1,-1, 0, 0, 0],  // 0  hat
    [ 0, 0,-1,-1,-1,-1,-1,-1, 0, 0],  // 1  hat
    [ 0, 0, 3, 3, 4, 3, 4, 0, 0, 0],  // 2  face
    [ 0, 3, 3, 4, 3, 4, 4, 3, 0, 0],  // 3  face
    [ 0, 0, 3, 3, 3, 3, 3, 0, 0, 0],  // 4  hair
    [ 0, 0, 2, 2, 2, 2, 2, 0, 0, 0],  // 5  shirt
    [ 0, 2, 2, 2, 2, 2, 2, 2, 0, 0],  // 6  shirt
    [ 0, 2, 5, 2, 2, 2, 5, 2, 0, 0],  // 7  shirt+hands
    [ 0, 0, 5, 2, 2, 2, 5, 0, 0, 0],  // 8  shirt+hands
    [ 0, 0, 0, 2, 2, 2, 0, 0, 0, 0],  // 9  belt
    [ 0, 0,-1,-1, 0,-1,-1, 0, 0, 0],  // 10 pants
    [ 0, 0,-1,-1, 0,-1,-1, 0, 0, 0],  // 11 pants
    [ 0, 0, 6, 6, 0, 6, 6, 0, 0, 0],  // 12 shoes
    [ 0, 6, 6, 6, 0, 6, 6, 6, 0, 0],  // 13 shoes
];

// Jumping pose (arms up)
const CHAR_JUMP: number[][] = [
    //  0  1  2  3  4  5  6  7  8  9
    [ 0, 5, 0,-1,-1,-1,-1, 0, 5, 0],  // 0  hands up + hat
    [ 0, 5,-1,-1,-1,-1,-1,-1, 5, 0],  // 1  hands up + hat
    [ 0, 0, 3, 3, 4, 3, 4, 0, 0, 0],  // 2  face
    [ 0, 3, 3, 4, 3, 4, 4, 3, 0, 0],  // 3  face
    [ 0, 0, 3, 3, 3, 3, 3, 0, 0, 0],  // 4  hair
    [ 0, 0, 2, 2, 2, 2, 2, 0, 0, 0],  // 5  shirt
    [ 0, 0, 2, 2, 2, 2, 2, 0, 0, 0],  // 6  shirt
    [ 0, 0, 2, 2, 2, 2, 2, 0, 0, 0],  // 7  shirt
    [ 0, 0, 0, 2, 2, 2, 0, 0, 0, 0],  // 8  belt
    [ 0, 0,-1,-1, 0,-1,-1, 0, 0, 0],  // 9  pants
    [ 0, 0,-1,-1, 0,-1,-1, 0, 0, 0],  // 10 pants
    [ 0, 0, 6, 6, 0, 6, 6, 0, 0, 0],  // 11 shoes
    [ 0, 0, 0, 6, 0, 6, 0, 0, 0, 0],  // 12 shoes
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],  // 13
];

// Coin: 8x8 sprite (animated, 2 frames)
const COIN_1: number[][] = [
    [ 0, 0, 7, 7, 7, 7, 0, 0],
    [ 0, 7, 8, 7, 7, 8, 7, 0],
    [ 7, 8, 7, 7, 7, 7, 8, 7],
    [ 7, 7, 7, 8, 8, 7, 7, 7],
    [ 7, 7, 7, 8, 8, 7, 7, 7],
    [ 7, 8, 7, 7, 7, 7, 8, 7],
    [ 0, 7, 8, 7, 7, 8, 7, 0],
    [ 0, 0, 7, 7, 7, 7, 0, 0],
];

const COIN_2: number[][] = [
    [ 0, 0, 0, 7, 7, 0, 0, 0],
    [ 0, 0, 7, 8, 8, 7, 0, 0],
    [ 0, 0, 7, 7, 7, 7, 0, 0],
    [ 0, 0, 7, 8, 8, 7, 0, 0],
    [ 0, 0, 7, 8, 8, 7, 0, 0],
    [ 0, 0, 7, 7, 7, 7, 0, 0],
    [ 0, 0, 7, 8, 8, 7, 0, 0],
    [ 0, 0, 0, 7, 7, 0, 0, 0],
];

// Sparkle (coin collected effect): 7x7
const SPARKLE: number[][] = [
    [ 0, 0, 0, 9, 0, 0, 0],
    [ 0, 0, 0, 9, 0, 0, 0],
    [ 0, 0, 0, 0, 0, 0, 0],
    [ 9, 9, 0, 9, 0, 9, 9],
    [ 0, 0, 0, 0, 0, 0, 0],
    [ 0, 0, 0, 9, 0, 0, 0],
    [ 0, 0, 0, 9, 0, 0, 0],
];

// Cloud: 16x6
const CLOUD: number[][] = [
    [ 0, 0, 0, 0, 9, 9, 9, 0, 0, 0, 0, 9, 9, 0, 0, 0],
    [ 0, 0, 9, 9, 9, 9, 9, 9, 0, 9, 9, 9, 9, 9, 0, 0],
    [ 0, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 0],
    [ 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
    [ 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
    [ 0, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 0],
];

// === Palette index to shade ===
const PALETTE: number[] = [
    0,         // 0: transparent (will be skipped)
    COL_HAT,   // 1: hat/pants (dark)  — referenced as -1 in sprite, we'll handle below
    COL_SHIRT, // 2: shirt
    COL_SKIN,  // 3: skin
    COL_BLACK, // 4: eyes
    COL_SKIN - 40, // 5: hands (slightly darker skin)
    COL_SHOE,  // 6: shoes
    COL_COIN,  // 7: coin bright
    COL_COIN_DARK, // 8: coin shadow
    COL_WHITE, // 9: white (cloud, sparkle)
];

function getColor(idx: number): number {
    if (idx === -1) return COL_HAT; // hat/pants
    if (idx === 0) return -1;       // transparent
    return PALETTE[idx] ?? 0;
}


// === Framebuffer ===
const fb = new Uint8Array(W * H);

function clearFb(): void {
    // Sky gradient
    for (let y = 0; y < H; y++) {
        const skyShade = Math.floor(COL_SKY - (y / H) * 40);
        for (let x = 0; x < W; x++) {
            fb[y * W + x] = skyShade;
        }
    }

    // Ground
    const groundY = 120;
    for (let y = groundY; y < H; y++) {
        for (let x = 0; x < W; x++) {
            fb[y * W + x] = y === groundY ? COL_GRASS : COL_GROUND;
        }
    }

    // Bricks
    for (let bx = 0; bx < W; bx += 16) {
        for (let by = groundY + 1; by < H; by++) {
            const brickRow = (by - groundY - 1) >> 3;
            const brickOff = (brickRow & 1) ? 8 : 0;
            const brickX = (bx + brickOff) % 16;
            if (brickX === 0 || (by - groundY - 1) % 8 === 0) {
                fb[by * W + bx] = COL_BRICK;
            }
        }
    }
}

function drawSprite(sprite: number[][], sx: number, sy: number): void {
    for (let row = 0; row < sprite.length; row++) {
        const spriteRow = sprite[row];
        if (!spriteRow) break; // ERROR à gérer
        for (let col = 0; col < spriteRow.length; col++) {
            const color = getColor(spriteRow[col] ?? 0);
            if (color < 0) continue; // transparent

            const px = Math.floor(sx) + col;
            const py = Math.floor(sy) + row;
            if (px >= 0 && px < W && py >= 0 && py < H) {
                fb[py * W + px] = color;
            }
        }
    }
}


// === ANSI rendering ===
function shadeToAnsi(shade: number): number {
    return 232 + Math.floor((shade / 255) * 23);
}

function renderFrame(): void {
    let out = "\x1b[H";
    let lastTop = -1;
    let lastBot = -1;

    for (let y = 0; y < H; y += 2) {
        for (let x = 0; x < W; x++) {
            const top = shadeToAnsi(fb[y * W + x] ?? 0);
            const bot = (y + 1 < H) ? shadeToAnsi(fb[(y + 1) * W + x] ?? 0) : 232;

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
}


// === Animation timeline ===
// Character walks right, jumps, catches coin mid-air, lands

const GROUND_Y = 120 - 14; // sprite is 14px tall, standing on ground line
const COIN_X = 95;
const COIN_Y = 60;

interface AnimState {
    frame: number;
    charX: number;
    charY: number;
    jumping: boolean;
    jumpT: number;
    coinVisible: boolean;
    coinCollected: boolean;
    collectFrame: number;
    walkCycle: number;
    done: boolean;
}

const state: AnimState = {
    frame: 0,
    charX: 20,
    charY: GROUND_Y,
    jumping: false,
    jumpT: 0,
    coinVisible: true,
    coinCollected: false,
    collectFrame: 0,
    walkCycle: 0,
    done: false,
};

function updateAnimation(): void {
    const s = state;
    s.frame++;
    s.walkCycle++;

    if (s.done) return;

    // Phase 1: walk right until under coin
    if (!s.jumping && !s.coinCollected && s.charX < COIN_X - 5) {
        s.charX += 1.2;
    }
    // Phase 2: jump
    else if (!s.jumping && !s.coinCollected && s.charX >= COIN_X - 5) {
        s.jumping = true;
        s.jumpT = 0;
    }

    // Jump physics (parabola)
    if (s.jumping) {
        s.jumpT++;
        const jumpDuration = 50;
        const jumpHeight = 55;
        const t = s.jumpT / jumpDuration;
        const parabola = -4 * jumpHeight * (t * t - t); // peaks at t=0.5

        s.charY = GROUND_Y - parabola;

        // Slight horizontal movement during jump
        s.charX += 0.3;

        // Check coin collision
        if (s.coinVisible && !s.coinCollected) {
            const dx = (s.charX + 5) - (COIN_X + 4);
            const dy = (s.charY + 4) - (COIN_Y + 4);
            if (Math.abs(dx) < 10 && Math.abs(dy) < 10) {
                s.coinCollected = true;
                s.coinVisible = false;
                s.collectFrame = s.frame;
            }
        }

        // Landing
        if (s.jumpT >= jumpDuration) {
            s.jumping = false;
            s.charY = GROUND_Y;
        }
    }

    // Phase 3: walk a bit more after landing, then stop
    if (!s.jumping && s.coinCollected && s.charX < 130) {
        s.charX += 1.0;
    } else if (!s.jumping && s.coinCollected && s.charX >= 130) {
        s.done = true;
    }
}

function drawScene(): void {
    clearFb();

    const s = state;

    // Draw clouds (static, slow scroll)
    drawSprite(CLOUD, (20 - s.frame * 0.1) % (W + 20), 15);
    drawSprite(CLOUD, (100 - s.frame * 0.15) % (W + 20), 25);
    drawSprite(CLOUD, (60 - s.frame * 0.08) % (W + 20), 10);

    // Draw coin (animated rotation)
    if (s.coinVisible) {
        const coinFrame = Math.floor(s.frame / 8) % 2;
        drawSprite(coinFrame === 0 ? COIN_1 : COIN_2, COIN_X, COIN_Y);
    }

    // Draw sparkle effect on collect
    if (s.coinCollected) {
        const elapsed = s.frame - s.collectFrame;
        if (elapsed < 15) {
            const spread = elapsed * 1.5;
            // Expanding sparkle
            for (let i = 0; i < 4; i++) {
                const angle = (i / 4) * Math.PI * 2 + elapsed * 0.2;
                const sx = COIN_X + 4 + Math.cos(angle) * spread;
                const sy = COIN_Y + 4 + Math.sin(angle) * spread;
                if (sx >= 0 && sx < W - 1 && sy >= 0 && sy < H - 1) {
                    fb[Math.floor(sy) * W + Math.floor(sx)] = COL_WHITE;
                }
            }
        }
    }

    // Draw character
    const isJumping = s.jumping;
    const sprite = isJumping ? CHAR_JUMP : CHAR_STAND;
    drawSprite(sprite, s.charX, s.charY);

    // Score display
    if (s.coinCollected) {
        const scoreText = "+100";
        const elapsed = s.frame - s.collectFrame;
        if (elapsed < 30) {
            const ty = COIN_Y - elapsed * 0.5;
            // Simple pixel text "+" at collection point
            for (let i = 0; i < 3; i++) {
                const px = COIN_X + 3;
                const py = Math.floor(ty) + i;
                if (py >= 0 && py < H) fb[py * W + px] = COL_WHITE;
            }
            for (let i = 0; i < 3; i++) {
                const px = COIN_X + 2 + i;
                const py = Math.floor(ty) + 1;
                if (px >= 0 && px < W && py >= 0 && py < H) fb[py * W + px] = COL_WHITE;
            }
        }
    }
}


// === Main loop ===
const FPS = 30;

process.stdout.write("\x1b[2J\x1b[?25l"); // clear + hide cursor

const interval = setInterval(() => {
    updateAnimation();
    drawScene();
    renderFrame();

    if (state.done && state.frame > state.collectFrame + 60) {
        clearInterval(interval);
        process.stdout.write("\x1b[?25h"); // show cursor
        process.stdout.write(`\x1b[${Math.floor(H / 2) + 2};1H`);
        console.log("\x1b[0m\n🎮 Animation complete!");
        process.exit(0);
    }
}, 1000 / FPS);

// Safety timeout
setTimeout(() => {
    clearInterval(interval);
    process.stdout.write("\x1b[?25h\x1b[2J\x1b[H\x1b[0m");
    console.log("Timeout — animation ended.");
    process.exit(0);
}, 15000);
