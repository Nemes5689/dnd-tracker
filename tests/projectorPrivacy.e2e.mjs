import assert from 'node:assert/strict';
import test from 'node:test';

const { chromium } = await import(process.env.TRACKER_PLAYWRIGHT_MODULE ?? 'playwright');

test('projector receives a display-only snapshot without DM data or exact enemy HP', async () => {
  const browser = await chromium.launch({ executablePath: process.env.TRACKER_CHROME });
  const context = await browser.newContext();
  try {
    const monitor = await context.newPage();
    const dm = await context.newPage();
    const base = process.env.TRACKER_URL ?? 'http://127.0.0.1:5192/dnd-tracker/';
    await monitor.goto(new URL('#/projector', base).href);
    await monitor.evaluate(() => {
      window.projectorMessage = new Promise((resolve) => {
        const channel = new BroadcastChannel('dnd-tracker-projector');
        channel.onmessage = ({ data }) => {
          if (data.type === 'encounter_update') {
            window.projectorPayload = data;
            channel.close();
            resolve();
          }
        };
      });
    });

    await dm.addInitScript(() => {
      const campaign = {
        id: 'privacy-campaign', name: 'Private campaign', notes: [{ title: 'secret campaign note' }],
        custom_monsters: [], encounter_ids: ['privacy-encounter'], characters: [],
      };
      const combatants = [
        { id: 'enemy', name: 'Ogre', source_type: 'monster', source_id: 'private-ogre-source', is_player: false, hp_max: 59, hp_current: 23, hp_temp: 9, ac: 15, initiative: 18, conditions: [], action_used: true, bonus_action_used: false, reaction_used: false, movement_used: 10, movement_speeds: { walk: 40 }, has_flanking: false, cover: 'none', private_note: 'hide this' },
        { id: 'hidden-spy', name: 'Secret Spy', source_type: 'monster', source_id: 'private-spy-source', is_player: false, hidden_from_players: true, hp_max: 9, hp_current: 9, hp_temp: 0, ac: 12, initiative: 15, conditions: [], action_used: false, bonus_action_used: false, reaction_used: false, movement_used: 0, movement_speeds: { walk: 30 }, has_flanking: false, cover: 'none' },
        { id: 'hero', name: 'Aria', source_type: 'character', source_id: 'private-character-source', is_player: true, hp_max: 31, hp_current: 4, hp_temp: 12, ac: 18, initiative: 12, conditions: [], action_used: false, bonus_action_used: false, reaction_used: false, movement_used: 0, movement_speeds: { walk: 30 }, has_flanking: false, cover: 'none' },
      ];
      const map = (id, name) => ({ id, name, image_data: 'data:image/svg+xml,<svg/>', image_width: 100, image_height: 100, grid_size: 50, grid_offset_x: 0, grid_offset_y: 0, show_grid: true, tokens: [{ combatant_id: 'enemy', x: 1, y: 1 }, { combatant_id: 'hidden-spy', x: 2, y: 2 }], drawings: [{ id: 'public-fire-wall', points: [], color: '#000', stroke_width: 2, is_closed: false, created_at: 1 }] });
      const encounter = { id: 'privacy-encounter', name: 'Privacy test', campaign_id: campaign.id, status: 'active', combatants, round: 1, turn_index: 0, log: [{ round: 1, message: 'DM log secret', timestamp: 1 }], ai_knowledge: { secret: { per_target: {} } }, maps: [map('active-map', 'Public map'), map('inactive-map', 'DM map')], active_map_id: 'active-map', created_at: 1, updated_at: 1 };
      localStorage.setItem('dnd-tracker-campaigns', JSON.stringify({ state: { campaigns: [campaign], active_campaign_id: campaign.id }, version: 0 }));
      localStorage.setItem('dnd-tracker-encounters', JSON.stringify({ state: { encounters: [encounter] }, version: 0 }));
    });

    await dm.goto(new URL('#/combat?encounter=privacy-encounter', base).href);
    await monitor.evaluate(() => window.projectorMessage);
    const payload = await monitor.evaluate(() => window.projectorPayload);
    const projected = payload.encounter;
    assert.equal(projected.maps.length, 1);
    assert.equal(projected.maps[0].id, 'active-map');
    assert.equal(projected.maps[0].drawings[0].id, 'public-fire-wall');
    assert.deepEqual(projected.log, []);
    assert.equal(projected.ai_knowledge, undefined);
    assert.equal(projected.combatants[0].hp_max, 100);
    assert.equal(projected.combatants[0].hp_current, 40);
    assert.equal(projected.combatants[0].hp_temp, 0);
    assert.equal(projected.combatants[0].source_id, '');
    assert.equal(projected.combatants[0].private_note, undefined);
    assert.equal(projected.combatants.length, 2);
    assert.equal(projected.combatants[1].hp_current, 100);
    assert.equal(projected.combatants.some(({ name }) => name === 'Secret Spy'), false);
    assert.equal(projected.maps[0].tokens.some(({ combatant_id }) => combatant_id === 'hidden-spy'), false);
    const serialized = JSON.stringify(projected);
    for (const secret of ['secret campaign note', 'DM log secret', 'hide this', 'private-character-source', 'private-ogre-source', 'private-spy-source', 'Secret Spy', '59', '23', 'inactive-map']) {
      assert.equal(serialized.includes(secret), false, `projector payload leaked ${secret}`);
    }

    await monitor.evaluate(() => {
      window.nextProjectorMessage = new Promise((resolve) => {
        const channel = new BroadcastChannel('dnd-tracker-projector');
        channel.onmessage = ({ data }) => {
          if (data.type === 'encounter_update') {
            window.nextProjectorPayload = data;
            channel.close();
            resolve();
          }
        };
      });
    });
    await dm.getByRole('button', { name: 'Show Secret Spy on projector' }).click();
    await monitor.evaluate(() => window.nextProjectorMessage);
    assert.equal((await monitor.evaluate(() => window.nextProjectorPayload)).encounter.combatants.some(({ name }) => name === 'Secret Spy'), true);
    await monitor.evaluate(() => {
      window.nextProjectorMessage = new Promise((resolve) => {
        const channel = new BroadcastChannel('dnd-tracker-projector');
        channel.onmessage = ({ data }) => {
          if (data.type === 'encounter_update') {
            window.nextProjectorPayload = data;
            channel.close();
            resolve();
          }
        };
      });
    });
    await dm.getByRole('button', { name: 'Hide Secret Spy from projector' }).click();
    await monitor.evaluate(() => window.nextProjectorMessage);
    assert.equal((await monitor.evaluate(() => window.nextProjectorPayload)).encounter.combatants.some(({ name }) => name === 'Secret Spy'), false);
    const persisted = await dm.evaluate(() => JSON.parse(localStorage.getItem('dnd-tracker-encounters')).state.encounters[0].combatants.find(({ id }) => id === 'hidden-spy').hidden_from_players);
    assert.equal(persisted, true);
  } finally {
    await context.close();
    await browser.close();
  }
});
