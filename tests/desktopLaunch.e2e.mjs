import assert from 'node:assert/strict';
import { execFileSync, spawn } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { createServer } from 'node:net';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

test('portable Windows build launches with isolated storage and survives reload', async (t) => {
  const executable = process.env.TRACKER_ELECTRON_EXE;
  if (!executable) return t.skip('Set TRACKER_ELECTRON_EXE to the packaged Windows executable');
  const modulePath = process.env.TRACKER_PLAYWRIGHT_MODULE ?? 'playwright';
  const { chromium } = await import(modulePath);
  const profile = await mkdtemp(join(tmpdir(), 'dnd-tracker-electron-'));
  const portServer = createServer();
  await new Promise((resolve) => portServer.listen(0, '127.0.0.1', resolve));
  const port = portServer.address().port;
  await new Promise((resolve, reject) => portServer.close((error) => error ? reject(error) : resolve()));
  let appProcess;
  let browser;
  try {
    appProcess = spawn(executable, [`--remote-debugging-port=${port}`, `--user-data-dir=${profile}`], { stdio: 'ignore' });
    let launchError;
    appProcess.on('error', (error) => { launchError = error; });
    const endpoint = `http://127.0.0.1:${port}/json/version`;
    let ready = false;
    const deadline = Date.now() + 30_000;
    while (!ready && Date.now() < deadline && appProcess.exitCode === null && !launchError) {
      try { ready = (await fetch(endpoint)).ok; } catch { await new Promise((resolve) => setTimeout(resolve, 200)); }
    }
    assert.equal(ready, true, `packaged EXE did not expose its local test endpoint (exit ${appProcess.exitCode}, error ${launchError?.message ?? 'none'})`);
    browser = await chromium.connectOverCDP(`http://127.0.0.1:${port}`);
    const context = browser.contexts()[0];
    const window = context.pages()[0];
    assert.ok(window, 'packaged app opened a browser window');
    const pageErrors = [];
    window.on('pageerror', (error) => pageErrors.push(error.message));
    await window.waitForSelector('#root > *', { timeout: 30_000 });
    const title = await window.title();
    assert.match(title, /D&D|Combat Tracker/i);
    await window.evaluate(() => localStorage.setItem('desktop-e2e-probe', 'persisted'));
    await window.reload();
    await window.waitForSelector('#root > *', { timeout: 30_000 });
    assert.equal(await window.evaluate(() => localStorage.getItem('desktop-e2e-probe')), 'persisted');
    assert.deepEqual(pageErrors, []);
  } finally {
    if (browser) await browser.close();
    if (appProcess && appProcess.exitCode === null) {
      if (process.platform === 'win32' && appProcess.pid) {
        try { execFileSync('taskkill', ['/PID', String(appProcess.pid), '/T', '/F'], { stdio: 'ignore' }); } catch {}
      } else appProcess.kill();
      await Promise.race([
        new Promise((resolve) => appProcess.once('exit', resolve)),
        new Promise((resolve) => setTimeout(resolve, 3_000)),
      ]);
    }
    await rm(profile, { recursive: true, force: true, maxRetries: 8, retryDelay: 250 });
  }
});
