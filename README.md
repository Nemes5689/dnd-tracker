# D&D 2024 Combat Tracker

A web-based combat tracker for Dungeons & Dragons 2024 (5.2 SRD). Built for DMs who want a single hub for combat, story, and prep.

## Features

- **Bestiary** — full Monster Manual 2024 (513 monsters) with custom monster support, avatar + gallery for each
- **Characters** — party roster with avatars, HP/AC tracking
- **Allies & Summons** — separate from monsters, with avatars and image galleries
- **Combat View** — full statblocks, conditions tracker, exhaustion levels, damage/heal application, inline initiative editing
- **Battle Map** — zoom, pan, sized tokens (Tiny→Gargantuan), projector mode (separate window for players, syncs in real-time)
- **AI Tactics** — three parallel AI suggestions (via OpenRouter, BYOK), supports Hungarian and English
- **Encounters management** — save, duplicate, reset, continue prior combats
- **Dashboard** — campaign tracker with sessions journal, plot threads, NPCs, quests, locations, in-game calendar, next session planner

## Local development

```bash
npm install
npm run dev
```

Then open `http://localhost:5173/dnd-tracker/`.

## Deployment to GitHub Pages

This repo is set up for auto-deploy via GitHub Actions.

### One-time setup

1. **Create a GitHub repo** (e.g. `your-username/dnd-tracker`)
2. **Push this code** to the `main` branch
3. **In GitHub repo Settings -> Pages**:
   - Source: **GitHub Actions** (not branch-based)
4. **(If your repo is named differently than `dnd-tracker`)**:
   - Edit `vite.config.ts`: change `base: '/dnd-tracker/'` to `base: '/your-repo-name/'`
   - Edit `public/404.html`: change `var basePath = '/dnd-tracker/'` to your repo name
5. **Push to main** — the workflow auto-runs and deploys

### Resulting URL

`https://your-username.github.io/your-repo-name/`

### Subsequent updates

Just push to `main`. The workflow rebuilds and redeploys within 1-2 minutes.

## Important: how data is shared

This app uses **localStorage only** — there is no backend.

- **Each browser stores its own campaign data**
- If you share the URL with friends, they'll see an empty tracker
- The **only** real-time data sharing is the **Projector View** (`/projector`), which uses `BroadcastChannel` — works across **tabs in the same browser**, not across machines

**Typical use:** the DM uses the tracker. Players don't need to. To show players the battle map, the DM opens `/projector` in a second window, drags it to a TV/monitor, and the two views sync automatically.

## OpenRouter API key (AI features)

The AI Tactics feature is opt-in. To use it:
1. Get a key at https://openrouter.ai/
2. In the app: **Settings -> OpenRouter API key**
3. The key is stored only in your browser's localStorage

The default model is `openrouter/auto`. You can change it in Settings.

## Tech stack

- React 18 + TypeScript + Vite
- Tailwind CSS
- Zustand (with persist middleware)
- React Router (HashRouter)
- BroadcastChannel API (for projector sync)
- Local storage for everything (no backend, no account)

## Windows indítás bash nélkül

- Electron app indítása: dupla kattintás a `START_ELECTRON_APP.bat` fájlra.
- Windows `.exe` készítése: dupla kattintás a `BUILD_WINDOWS_EXE.bat` fájlra.
- Webes fejlesztői mód: dupla kattintás a `START_WEB_DEV.bat` fájlra.

Részletek: `WINDOWS_START_HU.md`.
