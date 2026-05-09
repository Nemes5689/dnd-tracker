# Windows indítás bash nélkül

A projektet Windows CMD-ből vagy dupla kattintással is lehet indítani.

## 1. Electron app indítása fejlesztői módban

Dupla kattintás:

```text
START_ELECTRON_APP.bat
```

Ez automatikusan:

1. belép a projekt mappájába,
2. ellenőrzi az `npm` elérhetőségét,
3. ha nincs `node_modules`, futtatja az `npm install` parancsot,
4. elindítja az Electron appot.

Ugyanez CMD-ből:

```bat
START_ELECTRON_APP.bat
```

## 2. Windows `.exe` készítése

Dupla kattintás:

```text
BUILD_WINDOWS_EXE.bat
```

Ez elkészíti a Windowsos telepítőt és portable EXE-t a `release` mappába.

## 3. Webes fejlesztői indítás

Dupla kattintás:

```text
START_WEB_DEV.bat
```

Ez a böngészős Vite dev szervert indítja.

## Fontos

Első futtatáshoz kell a Node.js LTS verziója. Telepítés után zárd be és nyisd újra a CMD-t, majd futtasd újra a `.bat` fájlt.
