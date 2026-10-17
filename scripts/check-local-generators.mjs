import { spawn } from 'node:child_process';
import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

const profile = await mkdtemp(path.join(tmpdir(), 'tracker-generator-check-'));
const browser = spawn(process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe', [
  '--headless=new', '--no-first-run', '--no-default-browser-check',
  '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank',
], { windowsHide: true, stdio: 'ignore' });
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let socket;
try {
  let port;
  for (let attempt = 0; attempt < 50; attempt++) {
    try { port = (await readFile(path.join(profile, 'DevToolsActivePort'), 'utf8')).split('\n')[0]; break; } catch { await pause(200); }
  }
  if (!port) throw new Error('Browser did not start');
  const targets = await fetch(`http://127.0.0.1:${port}/json`).then((response) => response.json());
  socket = new WebSocket(targets.find((target) => target.type === 'page').webSocketDebuggerUrl);
  await new Promise((resolve) => socket.addEventListener('open', resolve, { once: true }));
  let nextId = 0;
  const pending = new Map();
  const contexts = new Map();
  let failures = [];
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++nextId;
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
  socket.addEventListener('message', async (event) => {
    const message = JSON.parse(event.data);
    if (message.id) {
      const request = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) request?.reject(new Error(message.error.message));
      else request?.resolve(message.result);
    }
    if (message.method === 'Runtime.executionContextCreated') contexts.set(message.params.context.id, message.params.context);
    if (message.method === 'Runtime.executionContextDestroyed') contexts.delete(message.params.executionContextId);
    if (message.method === 'Runtime.exceptionThrown') failures.push(message.params.exceptionDetails.exception?.description ?? message.params.exceptionDetails.text);
    if (message.method === 'Network.responseReceived' && message.params.response.status >= 400) failures.push(`${message.params.response.status} ${message.params.response.url}`);
    if (message.method === 'Log.entryAdded' && message.params.entry.level === 'error') failures.push(message.params.entry.text);
    if (message.method === 'Fetch.requestPaused') {
      const { requestId, request } = message.params;
      if (request.url.startsWith('http') && !request.url.startsWith('http://127.0.0.1:5173/')) {
        failures.push(`External request blocked: ${request.url}`);
        await send('Fetch.failRequest', { requestId, errorReason: 'InternetDisconnected' });
      } else await send('Fetch.continueRequest', { requestId });
    }
  });
  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  await send('Runtime.enable');
  await send('Network.enable');
  await send('Log.enable');
  await send('Network.setCacheDisabled', { cacheDisabled: true });
  await send('Fetch.enable', { patterns: [{ urlPattern: '*' }] });
  await send('Page.navigate', { url: 'http://127.0.0.1:5173/dnd-tracker/#/generator' });
  await pause(3000);
  for (const tool of ['realm', 'city', 'village', 'cave', 'dungeon', 'dwelling']) {
    failures = [];
    await send('Runtime.evaluate', { expression: `(() => { const select = document.querySelector('#generator-tool'); const setter = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value').set; setter.call(select, '${tool}'); select.dispatchEvent(new Event('change', {bubbles:true})); })()` });
    await pause(5000);
    const frames = await send('Page.getFrameTree');
    const frameId = frames.frameTree.childFrames?.[0]?.frame.id;
    const context = [...contexts.values()].find((item) => item.auxData?.frameId === frameId && item.auxData?.isDefault);
    const result = context ? await send('Runtime.evaluate', {
      contextId: context.id,
      expression: `JSON.stringify({ canvas: !!document.querySelector('canvas'), width: document.querySelector('canvas')?.width, height: document.querySelector('canvas')?.height, text: document.body.innerText.slice(0,200) })`,
      returnByValue: true,
    }) : null;
    console.log(JSON.stringify({ tool, rendered: result?.result.value, failures: [...new Set(failures)].slice(0, 15) }));
    if (!result || !JSON.parse(result.result.value).canvas || failures.length) process.exitCode = 1;
    if (tool === 'city') {
      const screenshot = await send('Page.captureScreenshot');
      await writeFile(path.join(profile, 'city.png'), Buffer.from(screenshot.data, 'base64'));
      console.log(`Screenshot: ${path.join(profile, 'city.png')}`);
    }
  }
} finally {
  socket?.close();
  browser.kill();
}
