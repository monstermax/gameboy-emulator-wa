

**✅ Fait :**
- CPU : 512 instructions implémentées, interrupts, HALT
- Mémoire : MemoryBus complet, MBC1, VRAM/WRAM/OAM/HRAM
- PPU : BG + Window + Sprites, timing scanline, framebuffer 160×144
- APU : 4 canaux, frame sequencer, samples 44100Hz, WebAudio
- I/O : Joypad fonctionnel, DMA, registres LCD/audio
- Frontend : Canvas rendering 60fps, clavier, son
- Timer (DIV/TIMA/TMA/TAC) : certains jeux en dépendent pour le timing


**Next**
- Debugguer => Breakpoints + Décompiler
- Cli
- Emulator rewind (go back a few seconds)
- Touchpad


**🔧 Améliorations & bugs potentiels :**
- **MBC3/MBC5** — nécessaires pour beaucoup de jeux (Pokémon, Zelda...)
- **Cycle-accurate PPU** — le mode 3 est fixé à 172 cycles, en vrai il varie selon les sprites. Certains jeux ont des glitches visuels à cause de ça
- **Sprite priority** — la priorité inter-sprites (par position X) n'est pas gérée
- **HALT bug** — un edge case connu du DMG où HALT sans IME skip le prochain byte
- **EI delay edge cases** — quelques subtilités de timing
- **Audio fine-tuning** — zombie mode envelopes, DAC click, phase reset

**🚀 Fonctionnalités nouvelles :**
- **Save states** — snapshot/restore de tout l'état
- **Battery saves** — persistence de la RAM externe (localStorage)
- **Palette couleurs** — remplacer le gris par un thème vert DMG ou custom
- **Mobile** — touch controls pour jouer sur téléphone
- **Debugger** — step-by-step, breakpoints, visionneuse VRAM/tiles
- **Game Boy Color** — double speed, VRAM banks, palettes couleur (gros chantier)




---


Voici tes options réalistes en Node.js :

**Display :**

1. **Sixel / Kitty graphics** — le terminal affiche directement des images pixel par pixel. Marche dans iTerm2, WezTerm, Kitty, pas dans le Terminal macOS de base. Zéro dépendance native. ~15-30 FPS. Bonne option pour un mode "quick test".

2. **SDL via node-sdl2** (ou `@aspect-build/sdl2`) — ouvre une vraie fenêtre native avec accès direct au framebuffer. C'est ce que 95% des émulateurs CLI utilisent. Gère aussi les inputs clavier/gamepad nativement. La meilleure option pour jouer.

==> https://github.com/kmamal/node-sdl

3. **Electron** — overkill. Tu réutiliserais juste ton frontend web dans une fenêtre desktop. Autant rester sur le navigateur.

4. **Stream vidéo** (ffmpeg pipe → RTSP/HLS) — fun mais latence énorme, inutilisable pour jouer. Intéressant uniquement pour du spectacle/streaming.

**Inputs :**

1. **stdin raw mode** — `process.stdin.setRawMode(true)` capte les touches clavier directement. Marche partout, suffisant pour jouer.

2. **SDL input** — si tu prends SDL pour le display, tu as le clavier + gamepad gratuitement.

3. **Gamepad via `node-hid`** — accès USB direct aux manettes, mais complexe à setup.

**Ma recommandation :**

Fais **deux modes** :
- **`headless`** : stdin raw mode pour les inputs, sixel pour le display (ou pas de display du tout, juste pour les tests/benchmarks)
- **`sdl`** : fenêtre SDL2 native pour display + inputs — c'est ton mode "jouable"
