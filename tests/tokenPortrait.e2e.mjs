import assert from 'node:assert/strict';
import test from 'node:test';

const { chromium } = await import(process.env.TRACKER_PLAYWRIGHT_MODULE ?? 'playwright');

test('DM map and projector render available portraits and missing-image emblems', async () => {
  const browser = await chromium.launch({ executablePath: process.env.TRACKER_CHROME });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    page.setDefaultTimeout(8_000);
    await page.addInitScript(() => {
      if (location.hash.startsWith('#/projector')) return;
      const canvas = document.createElement('canvas');
      canvas.width = 300;
      canvas.height = 200;
      const paint = canvas.getContext('2d');
      paint.fillStyle = '#275b69';
      paint.fillRect(0, 0, 300, 200);
      const image = canvas.toDataURL();
      const campaign = {
        id: 'portrait-campaign', name: 'Portrait campaign', notes: [], custom_monsters: [],
        encounter_ids: ['portrait-encounter'],
        characters: [{ id: 'paladin-source', name: 'Paladin', avatar: image }],
      };
      const actors = [
        { id: 'paladin', name: 'Paladin', source_id: 'paladin-source', source_type: 'character', is_player: true },
        { id: 'ogre', name: 'Ogre', source_id: 'ogre-source', source_type: 'monster', is_player: false },
        { id: 'wolf', name: 'Wolf', source_id: 'wolf-source', source_type: 'ally', is_player: false, is_ally: true },
      ];
      const encounter = {
        id: 'portrait-encounter', name: 'Portrait encounter', campaign_id: campaign.id,
        status: 'active', round: 1, turn_index: 0, log: [], created_at: 1, updated_at: 1,
        combatants: actors.map((actor, index) => ({
          ...actor, hp_max: 15, hp_current: 15, hp_temp: 0, ac: 12, initiative: 20 - index,
          conditions: [], movement_speeds: { walk: 30 },
        })),
        active_map_id: 'portrait-map',
        maps: [{
          id: 'portrait-map', name: 'Test map', image_data: image, image_width: 300, image_height: 200,
          grid_size: 50, grid_offset_x: 0, grid_offset_y: 0, show_grid: true,
          tokens: actors.map((actor, index) => ({ combatant_id: actor.id, x: index + 1, y: 2 })),
        }],
        token_styles: [{ combatant_id: 'wolf', avatar: 'data:image/png;base64,YmFk' }],
      };
      localStorage.setItem('dnd-tracker-campaigns', JSON.stringify({
        state: { campaigns: [campaign], active_campaign_id: campaign.id }, version: 0,
      }));
      localStorage.setItem('dnd-tracker-encounters', JSON.stringify({
        state: { encounters: [encounter] }, version: 0,
      }));
    });

    const base = process.env.TRACKER_URL ?? 'http://127.0.0.1:5192/dnd-tracker/';
    await page.goto(new URL('#/combat?encounter=portrait-encounter', base).href);
    await page.getByText('Combatants & map', { exact: true }).click();
    await page.getByRole('button', { name: /Open battle map/ }).click();
    const popupEvent = page.waitForEvent('popup');
    await page.getByRole('button', { name: /Cast to projector/ }).click();
    const projector = await popupEvent;
    projector.setDefaultTimeout(8_000);

    for (const view of [page, projector]) {
      const portrait = view.locator('[data-token-id="paladin"] img');
      await portrait.waitFor();
      await portrait.evaluate(image => image.decode());
      assert.ok(await portrait.evaluate(image => image.naturalWidth > 0));
      const enemyEmblem = view.locator('[data-token-id="ogre"] [data-token-emblem]');
      const allyEmblem = view.locator('[data-token-id="wolf"] [data-token-emblem]');
      await enemyEmblem.waitFor();
      await allyEmblem.waitFor();
      assert.notEqual(await enemyEmblem.textContent(), await allyEmblem.textContent());
      await view.locator('[data-token-id="wolf"] img').waitFor({ state: 'detached' });
    }
  } finally {
    await browser.close();
  }
});
