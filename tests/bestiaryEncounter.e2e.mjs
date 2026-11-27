import assert from 'node:assert/strict';
import test from 'node:test';
import { scout } from './fixtures/statBlocks.ts';

const { chromium } = await import(process.env.TRACKER_PLAYWRIGHT_MODULE ?? 'playwright');

test('Bestiary adds bundled and imported creatures to an explicit encounter', async () => {
  const browser = await chromium.launch({ executablePath: process.env.TRACKER_CHROME });
  try {
    const page = await browser.newPage();
    await page.addInitScript(() => {
      if (localStorage.getItem('dnd-tracker-campaigns')) return;
      const campaign = { id: 'test', name: 'North Road', encounter_ids: ['a', 'b', 'c'], characters: [], notes: [], custom_monsters: [] };
      const seeds = [
        ['a', 'Bridge', 'active', campaign.id], ['b', 'Ruins', 'planned', campaign.id],
        ['c', 'Aftermath', 'completed', campaign.id], ['d', 'Other Campaign', 'planned', 'different'],
      ];
      const encounters = seeds.map(([id, name, status, campaign_id]) => ({
        id, name, status, campaign_id, combatants: [], round: status === 'active' ? 1 : 0,
        turn_index: 0, log: [], created_at: 0, updated_at: 0,
      }));
      encounters[0].combatants.push({
        id: 'active-sentinel', name: 'Sentinel', source_type: 'monster', source_id: 'sentinel',
        initiative: 1, hp_current: 10, hp_max: 10, hp_temp: 0, ac: 10, conditions: [], is_player: false,
      });
      localStorage.setItem('dnd-tracker-campaigns', JSON.stringify({ state: { campaigns: [campaign], active_campaign_id: campaign.id }, version: 0 }));
      localStorage.setItem('dnd-tracker-encounters', JSON.stringify({ state: { encounters }, version: 0 }));
    });

    const base = process.env.TRACKER_URL ?? 'http://127.0.0.1:5192/dnd-tracker/';
    await page.goto(new URL('#/bestiary', base).href);
    await page.getByPlaceholder('Search monsters...').fill('Goblin Warrior');
    await page.getByText('Goblin Warrior', { exact: true }).first().click();
    const openPicker = page.getByRole('button', { name: 'Add to encounter', exact: true });
    await openPicker.click();
    const dialog = page.getByRole('dialog');
    const destination = dialog.locator('select').first();
    const add = dialog.getByRole('button', { name: 'Add creatures' });
    assert.equal(await add.isDisabled(), true);
    assert.deepEqual(await destination.locator('option').allTextContents(), ['Choose an encounter', 'Bridge (active)', 'Ruins (planned)']);
    await destination.selectOption('b');
    await dialog.locator('select').nth(1).selectOption('3');
    await add.click();
    await page.getByRole('status').getByRole('link', { name: 'Ruins' }).waitFor();
    assert.equal(await openPicker.evaluate(element => element === document.activeElement), true);

    await page.getByRole('button', { name: 'Paste stat block' }).click();
    await dialog.getByLabel('Stat block text').fill(scout);
    await dialog.getByRole('button', { name: 'Parse stat block' }).click();
    const keepNotes = dialog.getByRole('checkbox', { name: /Keep the reviewed unparsed text/ });
    if (await keepNotes.count()) await keepNotes.check();
    await dialog.getByRole('checkbox', { name: /I have reviewed the fields/ }).check();
    await dialog.getByRole('button', { name: 'Save to Monsters' }).click();
    await page.getByRole('heading', { name: /Ashfen Scout/ }).waitFor();
    await openPicker.click();
    await destination.selectOption('a');
    await add.click();
    await page.getByRole('status').getByRole('link', { name: 'Bridge' }).waitFor();

    await page.reload();
    const encounters = await page.evaluate(() => JSON.parse(localStorage.getItem('dnd-tracker-encounters')).state.encounters);
    assert.deepEqual(encounters.map(encounter => encounter.combatants.length), [2, 3, 0, 0]);
    assert.equal(encounters[0].round, 1);
    assert.equal(encounters[0].log.length, 1);
    assert.equal(encounters[0].combatants[encounters[0].turn_index].id, 'active-sentinel');
    assert.equal(encounters[0].combatants[0].name, 'Ashfen Scout');
    assert.equal(encounters[0].combatants[0].hp_current, 27);
    assert.equal(encounters[0].combatants[0].ac, 14);
    assert.match(encounters[0].combatants[0].source_id, /^import-/);
    const goblins = encounters[1].combatants;
    assert.equal(new Set(goblins.map(creature => creature.id)).size, 3);
    assert.equal(new Set(goblins.map(creature => creature.name)).size, 3);
    assert.ok(goblins.every(creature => creature.hp_max > 0 && creature.ac > 0 && Number.isInteger(creature.initiative)));
  } finally {
    await browser.close();
  }
});
