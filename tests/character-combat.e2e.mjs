import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import test from 'node:test';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.TRACKER_PLAYWRIGHT || 'playwright');
const url = process.env.TRACKER_URL || 'http://127.0.0.1:5192/dnd-tracker/';
const localChrome = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const executablePath = process.env.CHROME_PATH || (existsSync(localChrome) ? localChrome : undefined);

test('Class, Subclass and compound Quick Attacks reach Combat after restoring a backup', { timeout: 50_000 }, async () => {
  const browser = await chromium.launch({ executablePath });
  try {
    const source = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    source.setDefaultTimeout(8_000);
    await source.goto(url);
    await source.getByRole('button', { name: /No campaign/ }).click();
    source.once('dialog', dialog => dialog.accept('Character test campaign'));
    await source.getByRole('button', { name: /New campaign/ }).click();
    await source.getByRole('link', { name: 'Characters', exact: true }).click();
    await source.getByRole('button', { name: '+ Add character', exact: true }).click();
    await source.getByPlaceholder('Character name').fill('Ilyra Bridgewatch');
    await source.getByPlaceholder('60', { exact: true }).first().fill('35');
    await source.getByPlaceholder('15', { exact: true }).fill('17');
    await source.getByPlaceholder('+2', { exact: true }).fill('40');
    await source.getByRole('checkbox', { name: 'Use classes' }).check();
    const classSelections = source.getByRole('combobox', { name: 'Class', exact: true });
    const subclassSelections = source.getByRole('combobox', { name: 'Subclass', exact: true });
    await classSelections.first().selectOption('fighter');
    await subclassSelections.first().selectOption('champion');
    const levelInput = index => classSelections.nth(index).locator('../..').getByRole('textbox', { name: 'Level', exact: true });
    await levelInput(0).fill('5');
    await source.getByRole('button', { name: /Add multiclass/ }).click();
    await classSelections.nth(1).selectOption('wizard');
    await subclassSelections.nth(1).selectOption('evoker');
    await levelInput(1).fill('3');
    await source.getByRole('heading', { name: 'Quick Attacks' }).waitFor();
    await source.getByRole('button', { name: '+ Add weapon', exact: true }).click();
    await source.getByPlaceholder('Longsword').fill('Lantern blade');
    await source.getByPlaceholder('+5', { exact: true }).fill('6');
    await source.getByPlaceholder('1d8+3', { exact: true }).fill('1d8+1d6+3');
    await source.getByRole('button', { name: 'Save character', exact: true }).click();
    await source.getByText('Fighter 5 (Champion) / Wizard 3 (Evoker)', { exact: true }).first().waitFor();

    await source.getByRole('link', { name: 'Settings', exact: true }).click();
    const downloadPromise = source.waitForEvent('download');
    await source.getByRole('button', { name: 'Export full backup', exact: true }).click();
    const backup = await downloadPromise;
    const backupPath = await backup.path();
    assert.ok(backupPath);

    const restored = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    restored.setDefaultTimeout(8_000);
    await restored.goto(new URL('#/settings', url).href);
    restored.on('dialog', dialog => dialog.type() === 'prompt' ? dialog.accept('Quick Attacks encounter') : dialog.accept());
    await restored.locator('input[type="file"][accept*="json"]').setInputFiles(backupPath);
    await restored.getByRole('link', { name: 'Characters', exact: true }).click();
    await restored.getByText('Fighter 5 (Champion) / Wizard 3 (Evoker)', { exact: true }).first().waitFor();

    await restored.getByRole('link', { name: 'Combat', exact: true }).click();
    await restored.getByRole('button', { name: /New encounter/ }).click();
    await restored.getByRole('button', { name: /Add all 1 characters/ }).click();
    await restored.getByPlaceholder('Search SRD + custom monsters...').fill('Owlbear');
    const opponent = restored.getByText('Owlbear', { exact: true }).locator('../..');
    await opponent.getByRole('button', { name: '+1', exact: true }).click();
    await restored.getByRole('button', { name: /Start combat/i }).click();
    await restored.getByText('Lantern blade', { exact: true }).waitFor();
    await restored.getByTitle('Roll d20+6', { exact: true }).click();
    await restored.getByTitle('Roll 1d8+1d6+3', { exact: true }).click();
    await restored.getByTitle('Crit damage: doubles dice in 1d8+1d6+3', { exact: true }).click();
    await restored.getByRole('button', { name: 'Log', exact: true }).click();
    for (const line of [
      'Ilyra Bridgewatch attacks with Lantern blade:',
      'Ilyra Bridgewatch Lantern blade damage:',
      'Ilyra Bridgewatch Lantern blade CRITICAL damage (2d8+2d6+3):',
    ]) await restored.getByText(line, { exact: false }).waitFor();
  } finally {
    await browser.close();
  }
});
