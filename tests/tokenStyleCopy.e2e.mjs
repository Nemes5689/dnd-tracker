import assert from 'node:assert/strict';
import test from 'node:test';

const { chromium } = await import(process.env.TRACKER_PLAYWRIGHT_MODULE ?? 'playwright');

test('duplicating an encounter preserves token styles with fresh actor IDs', async () => {
  const browser = await chromium.launch({ executablePath: process.env.TRACKER_CHROME });
  try {
    const page = await browser.newPage();
    await page.addInitScript(() => {
      if (sessionStorage.getItem('token-copy-test-seeded')) return;
      sessionStorage.setItem('token-copy-test-seeded', '1');
      const campaign = {
        id: 'test-campaign', name: 'Test campaign', characters: [],
        notes: [], custom_monsters: [], encounter_ids: ['test-encounter'],
      };
      const encounter = {
        id: 'test-encounter', name: 'Token test', campaign_id: campaign.id,
        status: 'planned', round: 1, turn_index: 0, log: [], maps: [],
        created_at: 1, updated_at: 1,
        combatants: [{
          id: 'guard', name: 'Guard', source_id: 'guard-source', source_type: 'monster',
          hp_max: 10, hp_current: 5, hp_temp: 0, ac: 12, initiative: 8,
          conditions: [], is_player: false,
        }],
        token_styles: [{ combatant_id: 'guard', initial: 'G', color: '#aabbcc' }],
      };
      localStorage.setItem('dnd-tracker-campaigns', JSON.stringify({
        state: { campaigns: [campaign], active_campaign_id: campaign.id }, version: 0,
      }));
      localStorage.setItem('dnd-tracker-encounters', JSON.stringify({
        state: { encounters: [encounter] }, version: 0,
      }));
    });
    const base = process.env.TRACKER_URL ?? 'http://127.0.0.1:5192/dnd-tracker/';
    await page.goto(new URL('#/encounters', base).href);
    await page.getByTitle('More actions').click();
    await page.getByRole('button', { name: 'Duplicate', exact: true }).click();
    const encounters = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('dnd-tracker-encounters')).state.encounters,
    );
    const copy = encounters.find(encounter => encounter.name === 'Token test (copy)');
    assert.ok(copy);
    assert.notEqual(copy.combatants[0].id, 'guard');
    assert.deepEqual(copy.token_styles, [{
      combatant_id: copy.combatants[0].id, initial: 'G', color: '#aabbcc',
    }]);
    assert.equal(encounters.find(encounter => encounter.id === 'test-encounter').token_styles[0].combatant_id, 'guard');
  } finally {
    await browser.close();
  }
});
