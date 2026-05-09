# Electron desktop app

This project can run as a Vite web app or as an Electron desktop app.

## Development / local desktop test

```bash
npm install
npm run electron:dev
```

`electron:dev` first builds the Vite app in Electron mode and then opens it in Electron.

## Build Windows app

```bash
npm install
npm run electron:build:win
```

The generated installer / portable app will be created in the `release` folder.

## Web build / GitHub Pages

```bash
npm run build
npm run deploy
```

The Vite config uses `/dnd-tracker/` for the web build and `./` for the Electron build, so the same code works in both places.
