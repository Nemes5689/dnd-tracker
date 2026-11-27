import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import test from 'node:test';

const { chromium } = await import(process.env.TRACKER_PLAYWRIGHT_MODULE ?? 'playwright');

const base = process.env.TRACKER_URL ?? 'http://127.0.0.1:5192/dnd-tracker/';
const combatUrl = new URL('#/combat?encounter=area-encounter', base).href;
const templates = [
  { kind: 'circle', label: 'Circle', start: [125, 125], end: [225, 125], expected: { radius_ft: 10 } },
  { kind: 'cone', label: 'Cone', start: [325, 125], end: [475, 125], expected: { length_ft: 15, width_ft: 15 } },
  { kind: 'square', label: 'Square / Cube', start: [110, 260], end: [210, 360], expected: { side_ft: 10 } },
  { kind: 'line', label: 'Line', start: [325, 325], end: [525, 325], expected: { length_ft: 20, width_ft: 10 } },
];

async function openBattleMap(page) {
  await page.goto(combatUrl);
  await page.getByText('Combatants & map', { exact: true }).click();
  await page.getByRole('button', { name: /Open battle map/ }).click();
  const layer = page.locator('svg[data-map-drawing-layer]');
  await layer.waitFor();
  return layer;
}

function viewportPoints(layer, points) {
  return layer.evaluate((svg, coordinates) => {
    const matrix = svg.getScreenCTM();
    if (!matrix) throw new Error('The drawing layer has no viewport transform');
    return coordinates.map(([x, y]) => {
      const point = new DOMPoint(x, y).matrixTransform(matrix);
      return { x: point.x, y: point.y };
    });
  }, points);
}

function storedDrawings(page) {
  return page.evaluate(() => JSON.parse(localStorage.getItem('dnd-tracker-encounters'))
    .state.encounters.find(({ id }) => id === 'area-encounter')
    .maps.find(({ id }) => id === 'area-map').drawings);
}

function drawnShape(layer, { id, area_template }) {
  return layer.locator(`[data-drawing-id="${id}"][data-area-shape="${area_template.kind}"]`);
}

test('D&D area templates persist and appear live on the projector', { timeout: 55_000 }, async () => {
  const browser = await chromium.launch({ executablePath: process.env.TRACKER_CHROME });
  try {
    const dm = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    dm.setDefaultTimeout(8_000);
    await dm.addInitScript(() => {
      const encounterKey = 'dnd-tracker-encounters';
      if (location.hash.startsWith('#/projector') || localStorage.getItem(encounterKey)) return;
      const canvas = document.createElement('canvas');
      canvas.width = 600;
      canvas.height = 400;
      const context = canvas.getContext('2d');
      context.fillStyle = '#275b69';
      context.fillRect(0, 0, canvas.width, canvas.height);
      const campaign = {
        id: 'area-campaign', name: 'Area map campaign', notes: [], custom_monsters: [],
        characters: [], encounter_ids: ['area-encounter'],
      };
      const encounter = {
        id: 'area-encounter', name: 'Area template encounter', campaign_id: campaign.id,
        status: 'active', round: 1, turn_index: 0, log: [], created_at: 1, updated_at: 1,
        combatants: [{
          id: 'area-enemy', name: 'Test enemy', source_type: 'monster', source_id: 'fixture-monster',
          is_player: false, hp_max: 10, hp_current: 10, hp_temp: 0, ac: 12, initiative: 12,
          conditions: [], action_used: false, bonus_action_used: false, reaction_used: false,
          movement_used: 0, movement_speeds: { walk: 30 }, has_flanking: false, cover: 'none',
        }],
        active_map_id: 'area-map',
        maps: [{
          id: 'area-map', name: 'Area practice map', image_data: canvas.toDataURL(),
          image_width: canvas.width, image_height: canvas.height,
          grid_size: 50, grid_offset_x: 0, grid_offset_y: 0, show_grid: true,
          tokens: [{ combatant_id: 'area-enemy', x: 0, y: 0 }], drawings: [],
        }],
      };
      localStorage.setItem('dnd-tracker-campaigns', JSON.stringify({
        state: { campaigns: [campaign], active_campaign_id: campaign.id }, version: 0,
      }));
      localStorage.setItem(encounterKey, JSON.stringify({ state: { encounters: [encounter] }, version: 0 }));
    });

    const layer = await openBattleMap(dm);
    const popupEvent = dm.waitForEvent('popup');
    await dm.getByRole('button', { name: /Cast to projector/ }).click();
    const projector = await popupEvent;
    projector.setDefaultTimeout(8_000);
    const projectorLayer = projector.locator('svg[data-map-drawing-layer]');
    await projector.locator('[data-token-id="area-enemy"]').waitFor();
    await dm.getByRole('button', { name: /Draw$/ }).click();

    const evidenceDir = resolve('test-results/area-template-qa');
    await mkdir(evidenceDir, { recursive: true });
    for (const width of [375, 768, 1440]) {
      await dm.setViewportSize({ width, height: 900 });
      const circleButton = dm.getByRole('button', { name: 'Rajzeszköz: Circle', exact: true });
      await circleButton.waitFor();
      const toolbarBounds = await dm.locator('.drawing-toolbar').evaluate((toolbar) => {
        const rect = toolbar.getBoundingClientRect();
        return { left: rect.left, right: rect.right, viewport: document.documentElement.clientWidth };
      });
      assert.ok(toolbarBounds.left >= -1 && toolbarBounds.right <= toolbarBounds.viewport + 1, `drawing toolbar fits ${width}px viewport`);
      await dm.screenshot({ path: resolve(evidenceDir, `drawing-toolbar-${width}.png`), fullPage: true });
    }
    await dm.setViewportSize({ width: 1440, height: 900 });

    for (const [index, template] of templates.entries()) {
      const toolButton = dm.getByRole('button', { name: `Rajzeszköz: ${template.label}`, exact: true });
      if (index === 0) {
        await toolButton.focus();
        await dm.keyboard.press('Enter');
        assert.equal(await toolButton.getAttribute('aria-pressed'), 'true');
        assert.equal(await toolButton.evaluate((button) => button.matches(':focus-visible')), true, 'keyboard focus is visible');
      } else {
        await toolButton.click();
      }
      if (template.kind === 'line') {
        await dm.getByRole('combobox', { name: 'Vonal szélessége lábban' }).selectOption('10');
      }
      const [start, end] = await viewportPoints(layer, [template.start, template.end]);
      await dm.mouse.move(start.x, start.y);
      await dm.mouse.down();
      await dm.mouse.move(end.x, end.y, { steps: 10 });
      await layer.locator(`[data-area-preview="${template.kind}"]`).waitFor();
      await dm.mouse.up();
      await dm.getByRole('button', { name: /Skip.*outline only/ }).click();

      const drawings = await storedDrawings(dm);
      assert.equal(drawings.length, index + 1);
      const drawing = drawings[index];
      assert.equal(drawing.area_template.kind, template.kind);
      assert.equal(drawing.is_closed, true);
      assert.equal(drawing.effect, undefined);
      for (const [field, value] of Object.entries(template.expected)) {
        assert.equal(drawing.area_template[field], value, `${template.kind} ${field}`);
      }
      await drawnShape(layer, drawing).waitFor();
      await drawnShape(projectorLayer, drawing).waitFor();
    }

    const beforeReload = await storedDrawings(dm);
    await dm.reload();
    const reloadedLayer = await openBattleMap(dm);
    assert.deepEqual(await storedDrawings(dm), beforeReload);
    await projector.reload();
    for (const drawing of beforeReload) {
      await drawnShape(reloadedLayer, drawing).waitFor();
      await drawnShape(projectorLayer, drawing).waitFor();
    }
  } finally {
    await browser.close();
  }
});
