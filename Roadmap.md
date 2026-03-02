

**✅ Fait :**
- CPU : 512 instructions implémentées, interrupts, HALT
- Mémoire : MemoryBus complet, MBC1, VRAM/WRAM/OAM/HRAM
- PPU : BG + Window + Sprites, timing scanline, framebuffer 160×144
- APU : 4 canaux, frame sequencer, samples 44100Hz, WebAudio
- I/O : Joypad fonctionnel, DMA, registres LCD/audio
- Frontend : Canvas rendering 60fps, clavier, son
- Timer (DIV/TIMA/TMA/TAC) : certains jeux en dépendent pour le timing


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
