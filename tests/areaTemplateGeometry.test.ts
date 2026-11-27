import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildAreaTemplateGeometry } from '../src/utils/areaTemplateGeometry.ts';

const grid = { grid_size: 50, grid_offset_x: 0, grid_offset_y: 0 };

test('circle radius snaps to 5-foot grid increments', () => {
  const geometry = buildAreaTemplateGeometry({
    kind: 'circle',
    start: { x: 25, y: 25 },
    end: { x: 73, y: 27 },
    ...grid,
    line_width_ft: 5,
  });

  assert.ok(geometry);
  assert.equal(geometry.area_template.kind, 'circle');
  assert.deepEqual(geometry.area_template.origin, { x: 25, y: 25 });
  assert.equal(geometry.area_template.radius_ft, 5);
  assert.ok(geometry.points.length >= 12, 'circle outline is sampled smoothly');
});

test('square stores its snapped side length in feet', () => {
  const geometry = buildAreaTemplateGeometry({
    kind: 'square',
    start: { x: 25, y: 25 },
    end: { x: 174, y: 26 },
    ...grid,
    line_width_ft: 5,
  });

  assert.ok(geometry);
  assert.equal(geometry.area_template.kind, 'square');
  assert.equal(geometry.area_template.side_ft, 15);
  assert.equal(geometry.points.length, 4);
});

test('cone end width equals its length and its side lines are symmetric', () => {
  const geometry = buildAreaTemplateGeometry({
    kind: 'cone',
    start: { x: 25, y: 25 },
    end: { x: 225, y: 25 },
    ...grid,
    line_width_ft: 5,
  });

  assert.ok(geometry);
  assert.equal(geometry.area_template.kind, 'cone');
  assert.equal(geometry.area_template.length_ft, 20);
  assert.equal(geometry.area_template.direction_deg, 0);
  assert.equal(geometry.area_template.width_ft, geometry.area_template.length_ft);
  assert.ok(geometry.points.length >= 3);
  const origin = geometry.points[0];
  const firstEdge = geometry.points[1];
  const farEdge = geometry.points.at(-1)!;
  const near = 1e-6;
  assert.ok(Math.abs(firstEdge.x - farEdge.x) < near, 'edges are mirrored around the direction axis');
  assert.ok(Math.abs(firstEdge.y + farEdge.y - 2 * origin.y) < near, 'edges are symmetric around the origin axis');
  const endWidthPx = Math.hypot(firstEdge.x - farEdge.x, firstEdge.y - farEdge.y);
  assert.ok(Math.abs(endWidthPx - 200) < near, '20 feet spans four 50px grid cells at the cone end');
});

test('line stores independent snapped length and width', () => {
  const geometry = buildAreaTemplateGeometry({
    kind: 'line',
    start: { x: 25, y: 25 },
    end: { x: 225, y: 25 },
    ...grid,
    line_width_ft: 12,
  });

  assert.ok(geometry);
  assert.equal(geometry.area_template.kind, 'line');
  assert.equal(geometry.area_template.length_ft, 20);
  assert.equal(geometry.area_template.width_ft, 10);
  assert.equal(geometry.points.length, 4);
});

test('grid offsets are included when snapping the origin and measuring radius', () => {
  const geometry = buildAreaTemplateGeometry({
    kind: 'circle',
    start: { x: 35, y: 40 },
    end: { x: 85, y: 40 },
    grid_size: 50,
    grid_offset_x: 10,
    grid_offset_y: 15,
    line_width_ft: 5,
  });

  assert.ok(geometry);
  assert.deepEqual(geometry.area_template.origin, { x: 35, y: 40 });
  assert.equal(geometry.area_template.radius_ft, 5);
});

test('zero-length drag returns no template', () => {
  const geometry = buildAreaTemplateGeometry({
    kind: 'line',
    start: { x: 25, y: 25 },
    end: { x: 25, y: 25 },
    ...grid,
    line_width_ft: 5,
  });

  assert.equal(geometry, null);
});
