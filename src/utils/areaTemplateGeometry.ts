import type { AreaTemplateKind } from '@/types/app';

export interface ImagePoint {
  x: number;
  y: number;
}

export interface AreaTemplateOptions {
  kind: AreaTemplateKind;
  start: ImagePoint;
  end: ImagePoint;
  grid_size: number;
  grid_offset_x: number;
  grid_offset_y: number;
  line_width_ft: number;
}

export interface BuiltAreaTemplate {
  points: ImagePoint[];
  area_template: {
    kind: AreaTemplateKind;
    origin: ImagePoint;
    direction_deg?: number;
    radius_ft?: number;
    length_ft?: number;
    side_ft?: number;
    width_ft?: number;
  };
}

const FEET_PER_CELL = 5;
const MAX_DIMENSION_FT = 120;

function snapCellCenter(value: number, offset: number, gridSize: number): number {
  return offset + (Math.floor((value - offset) / gridSize) + 0.5) * gridSize;
}

function snapGridLine(value: number, offset: number, gridSize: number): number {
  return offset + Math.round((value - offset) / gridSize) * gridSize;
}

function boundedCells(distancePx: number, gridSize: number): number {
  const requested = Math.max(1, Math.round(distancePx / gridSize));
  return Math.min(requested, MAX_DIMENSION_FT / FEET_PER_CELL);
}

function direction(start: ImagePoint, end: ImagePoint): { radians: number; degrees: number } {
  const radians = Math.atan2(end.y - start.y, end.x - start.x);
  return { radians, degrees: (radians * 180 / Math.PI + 360) % 360 };
}

function polygonFromCircle(center: ImagePoint, radius: number, segments = 48): ImagePoint[] {
  return Array.from({ length: segments }, (_, index) => {
    const angle = index * Math.PI * 2 / segments;
    return { x: center.x + Math.cos(angle) * radius, y: center.y + Math.sin(angle) * radius };
  });
}

export function buildAreaTemplateGeometry(options: AreaTemplateOptions): BuiltAreaTemplate | null {
  const { kind, start, end, grid_offset_x, grid_offset_y } = options;
  const gridSize = Math.max(1, options.grid_size);
  const rawDx = end.x - start.x;
  const rawDy = end.y - start.y;
  const rawDistance = Math.hypot(rawDx, rawDy);
  if (!Number.isFinite(rawDistance) || rawDistance < 2 || !Number.isFinite(gridSize)) return null;

  if (kind === 'circle') {
    const origin = {
      x: snapCellCenter(start.x, grid_offset_x, gridSize),
      y: snapCellCenter(start.y, grid_offset_y, gridSize),
    };
    const radiusCells = boundedCells(rawDistance, gridSize);
    const radiusFt = radiusCells * FEET_PER_CELL;
    return {
      points: polygonFromCircle(origin, radiusCells * gridSize),
      area_template: { kind, origin, radius_ft: radiusFt },
    };
  }

  if (kind === 'square') {
    const origin = {
      x: snapGridLine(start.x, grid_offset_x, gridSize),
      y: snapGridLine(start.y, grid_offset_y, gridSize),
    };
    const sideCells = boundedCells(Math.max(Math.abs(rawDx), Math.abs(rawDy)), gridSize);
    const sideFt = sideCells * FEET_PER_CELL;
    const xDirection = rawDx < 0 ? -1 : 1;
    const yDirection = rawDy < 0 ? -1 : 1;
    const farX = origin.x + xDirection * sideCells * gridSize;
    const farY = origin.y + yDirection * sideCells * gridSize;
    return {
      points: [origin, { x: farX, y: origin.y }, { x: farX, y: farY }, { x: origin.x, y: farY }],
      area_template: { kind, origin, side_ft: sideFt },
    };
  }

  const origin = {
    x: snapCellCenter(start.x, grid_offset_x, gridSize),
    y: snapCellCenter(start.y, grid_offset_y, gridSize),
  };
  const bearing = direction(start, end);
  const lengthCells = boundedCells(rawDistance, gridSize);
  const lengthFt = lengthCells * FEET_PER_CELL;
  const lengthPx = lengthCells * gridSize;
  const endpoint = {
    x: origin.x + Math.cos(bearing.radians) * lengthPx,
    y: origin.y + Math.sin(bearing.radians) * lengthPx,
  };

  if (kind === 'cone') {
    // 2024 rules: the width at a point equals its distance from the origin.
    // Straight sides therefore produce a triangular template with 53.13° included angle.
    const perpendicular = { x: -Math.sin(bearing.radians) * lengthPx / 2, y: Math.cos(bearing.radians) * lengthPx / 2 };
    const points: ImagePoint[] = [
      origin,
      { x: endpoint.x + perpendicular.x, y: endpoint.y + perpendicular.y },
      { x: endpoint.x - perpendicular.x, y: endpoint.y - perpendicular.y },
    ];
    return {
      points,
      area_template: { kind, origin, direction_deg: bearing.degrees, length_ft: lengthFt, width_ft: lengthFt },
    };
  }

  const widthFt = Math.min(MAX_DIMENSION_FT, Math.max(FEET_PER_CELL, Math.round(options.line_width_ft / FEET_PER_CELL) * FEET_PER_CELL));
  const halfWidthPx = (widthFt / FEET_PER_CELL * gridSize) / 2;
  const perpendicular = { x: -Math.sin(bearing.radians) * halfWidthPx, y: Math.cos(bearing.radians) * halfWidthPx };
  return {
    points: [
      { x: origin.x + perpendicular.x, y: origin.y + perpendicular.y },
      { x: endpoint.x + perpendicular.x, y: endpoint.y + perpendicular.y },
      { x: endpoint.x - perpendicular.x, y: endpoint.y - perpendicular.y },
      { x: origin.x - perpendicular.x, y: origin.y - perpendicular.y },
    ],
    area_template: { kind, origin, direction_deg: bearing.degrees, length_ft: lengthFt, width_ft: widthFt },
  };
}
