import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import type { BattleMap, Combatant, CombatantTokenStyle, MapDrawing, MovementMode } from '@/types/app';
import { stylizedHPLabel } from '@/utils/projectorBus';
import { tokenCellSize } from '@/utils/tokenSize';
import { DrawingLayer } from './DrawingLayer';
import { getMovementSpeed, getRemainingMovementSpeed, MOVEMENT_LABELS } from '@/utils/movement';

export interface BattleMapProps {
  map: BattleMap;
  combatants: Combatant[];
  active_combatant_id?: string;
  token_styles?: CombatantTokenStyle[];
  onMoveToken?: (combatant_id: string, x: number, y: number) => void;
  onDamageMonster?: (combatant_id: string, amount: number) => void;
  onHealMonster?: (combatant_id: string, amount: number) => void;
  show_grid: boolean;
  fullscreen?: boolean;
  projector_mode?: boolean;
  show_token_names?: boolean;
  hide_monster_hp_numbers?: boolean;
  movement_mode?: MovementMode;
  // In projector mode: allow token movement, but disable HP popups
  allow_token_movement?: boolean;
  // Drawing layer props (optional)
  drawing_enabled?: boolean;
  drawing_color?: string;
  drawing_stroke_width?: number;
  onAddDrawing?: (drawing: MapDrawing) => void;
  onUpdateDrawing?: (drawing_id: string, patch: Partial<MapDrawing>) => void;
  onDeleteDrawing?: (drawing_id: string) => void;
}

// Min/max zoom levels relative to fit-to-screen scale
const MIN_ZOOM = 0.3;
const MAX_ZOOM = 4;

const FEET_PER_GRID_SQUARE = 5;

function gridMoveDistanceFeet(from_x: number, from_y: number, to_x: number, to_y: number): number {
  // D&D-style grid movement for now: one orthogonal or diagonal square = 5 ft.
  return Math.max(Math.abs(to_x - from_x), Math.abs(to_y - from_y)) * FEET_PER_GRID_SQUARE;
}


export function BattleMap({
  map,
  combatants,
  active_combatant_id,
  token_styles = [],
  onMoveToken,
  onDamageMonster,
  onHealMonster,
  show_grid,
  fullscreen = false,
  projector_mode = false,
  show_token_names = false,
  hide_monster_hp_numbers = false,
  movement_mode = 'walk',
  allow_token_movement = true,
  drawing_enabled = false,
  drawing_color = '#dc2626',
  drawing_stroke_width = 4,
  onAddDrawing,
  onUpdateDrawing,
  onDeleteDrawing,
}: BattleMapProps) {
  const container_ref = useRef<HTMLDivElement>(null);
  const inner_ref = useRef<HTMLDivElement>(null);
  const [base_scale, set_base_scale] = useState(1); // fit-to-screen
  const [zoom, set_zoom] = useState(1); // user zoom multiplier
  const [pan_offset, set_pan_offset] = useState({ x: 0, y: 0 });
  const [drag_state, set_drag_state] = useState<{
    type: 'token' | 'pan';
    combatant_id?: string;
    offset_x: number;
    offset_y: number;
  } | null>(null);
  const [hover_cell, set_hover_cell] = useState<{ x: number; y: number } | null>(
    null
  );
  const [hp_popup_id, set_hp_popup_id] = useState<string | null>(null);

  // Effective scale = base_scale * zoom
  const scale = base_scale * zoom;

  // Compute fit-to-screen scale (accounts for rotation: a rotated map has a
  // different bounding box that may not fit at the original scale).
  useEffect(() => {
    const compute = () => {
      if (!container_ref.current) return;
      const rect = container_ref.current.getBoundingClientRect();
      // After rotation, the AABB of the image is wider/taller. We compute the
      // rotated bounding box dimensions:
      const rad = ((map.rotation ?? 0) * Math.PI) / 180;
      const cos = Math.abs(Math.cos(rad));
      const sin = Math.abs(Math.sin(rad));
      const rotated_w = map.image_width * cos + map.image_height * sin;
      const rotated_h = map.image_width * sin + map.image_height * cos;
      const sx = rect.width / rotated_w;
      const sy = rect.height / rotated_h;
      set_base_scale(Math.min(sx, sy, 1));
    };
    compute();
    const ro = new ResizeObserver(compute);
    if (container_ref.current) ro.observe(container_ref.current);
    return () => ro.disconnect();
  }, [map.image_width, map.image_height, map.rotation]);

  // Wheel zoom
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      set_zoom((z) => Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, z * delta)));
    },
    []
  );

  useEffect(() => {
    const el = container_ref.current;
    if (!el) return;
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  // Reset zoom (on map change)
  useEffect(() => {
    set_zoom(1);
    set_pan_offset({ x: 0, y: 0 });
  }, [map.id]);

  const combatant_map: Record<string, Combatant> = {};
  combatants.forEach((c) => {
    combatant_map[c.id] = c;
  });
  const style_map: Record<string, CombatantTokenStyle> = {};
  token_styles.forEach((s) => {
    style_map[s.combatant_id] = s;
  });

  const positioned_ids = new Set(map.tokens.map((t) => t.combatant_id));
  const unplaced = combatants.filter((c) => !positioned_ids.has(c.id));

  const rotation = map.rotation ?? 0;

  const screenToImage = (clientX: number, clientY: number) => {
    if (!inner_ref.current) return null;
    const rect = inner_ref.current.getBoundingClientRect();
    // Center of the rendered (post-transform) box on screen
    const center_screen_x = rect.left + rect.width / 2;
    const center_screen_y = rect.top + rect.height / 2;
    // Vector from center to pointer
    let dx = clientX - center_screen_x;
    let dy = clientY - center_screen_y;
    // Inverse rotation (subtract the applied rotation)
    if (rotation) {
      const rad = (-rotation * Math.PI) / 180;
      const cos = Math.cos(rad);
      const sin = Math.sin(rad);
      const rx = dx * cos - dy * sin;
      const ry = dx * sin + dy * cos;
      dx = rx;
      dy = ry;
    }
    // Inverse scale and add image center
    const ix = dx / scale + map.image_width / 2;
    const iy = dy / scale + map.image_height / 2;
    return { x: ix, y: iy };
  };

  const imageToGrid = (ix: number, iy: number) => ({
    x: Math.floor((ix - map.grid_offset_x) / map.grid_size),
    y: Math.floor((iy - map.grid_offset_y) / map.grid_size),
  });

  const gridToImage = (gx: number, gy: number) => ({
    x: map.grid_offset_x + gx * map.grid_size,
    y: map.grid_offset_y + gy * map.grid_size,
  });

  // Token drag start.
  // We capture the pointer on the container (not the token) so that the
  // container's pointermove/pointerup handlers receive subsequent events
  // even if the cursor moves off the token. This is critical for snap-to-grid
  // dragging where the cursor may end up outside the token's original bounds.
  const handleTokenPointerDown = (
    e: React.PointerEvent,
    combatant_id: string,
    token_grid_x: number,
    token_grid_y: number
  ) => {
    if (!allow_token_movement) return;
    e.stopPropagation();
    e.preventDefault();

    if (container_ref.current) {
      try {
        container_ref.current.setPointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    }

    const img = screenToImage(e.clientX, e.clientY);
    if (!img) return;
    const tokenTopLeft = gridToImage(token_grid_x, token_grid_y);

    set_drag_state({
      type: 'token',
      combatant_id,
      offset_x: img.x - tokenTopLeft.x,
      offset_y: img.y - tokenTopLeft.y,
    });
    set_hp_popup_id(null);
  };

  // Drag-pan was removed because it interfered with token drag-and-drop.
  // Pan is now only available via the arrow buttons next to the zoom controls.
  const handleBackgroundPointerDown = (_e: React.PointerEvent) => {
    // Intentionally empty: clicks on the map background don't start a pan.
    // Token clicks are handled by the token's own handler.
  };

  // Pointer move - only handles token drag now (pan was removed)
  const handleContainerPointerMove = (e: React.PointerEvent) => {
    if (!drag_state) return;

    if (drag_state.type === 'token') {
      const img = screenToImage(e.clientX, e.clientY);
      if (!img) return;
      const tokenLeft = img.x - drag_state.offset_x;
      const tokenTop = img.y - drag_state.offset_y;
      const cell = imageToGrid(
        tokenLeft + map.grid_size / 2,
        tokenTop + map.grid_size / 2
      );
      set_hover_cell(cell);
    }
  };

  const handleContainerPointerUp = (e: React.PointerEvent) => {
    if (!drag_state) return;
    if (drag_state.type === 'token' && hover_cell && drag_state.combatant_id && onMoveToken) {
      onMoveToken(drag_state.combatant_id, hover_cell.x, hover_cell.y);
    }
    set_drag_state(null);
    set_hover_cell(null);
    try {
      (e.target as Element).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const [pending_placement, set_pending_placement] = useState<string | null>(
    null
  );

  const handleMapClick = (e: React.MouseEvent) => {
    if (!allow_token_movement) return;
    if (!pending_placement || drag_state) return;
    const img = screenToImage(e.clientX, e.clientY);
    if (!img || !onMoveToken) return;
    const cell = imageToGrid(img.x, img.y);
    onMoveToken(pending_placement, cell.x, cell.y);
    set_pending_placement(null);
  };

  const grid_cols = Math.ceil(
    (map.image_width - map.grid_offset_x) / map.grid_size
  );
  const grid_rows = Math.ceil(
    (map.image_height - map.grid_offset_y) / map.grid_size
  );

  const hp_popup_token = hp_popup_id
    ? map.tokens.find((t) => t.combatant_id === hp_popup_id)
    : null;
  const hp_popup_combatant = hp_popup_id ? combatant_map[hp_popup_id] : null;


  const active_combatant = active_combatant_id
    ? combatant_map[active_combatant_id]
    : undefined;
  const active_token = active_combatant_id
    ? map.tokens.find((t) => t.combatant_id === active_combatant_id)
    : undefined;
  const active_token_size_cells = active_combatant
    ? tokenCellSize(active_combatant.size)
    : 1;
  const active_movement_speed = getMovementSpeed(active_combatant, movement_mode);
  const remaining_walk_ft = getRemainingMovementSpeed(active_combatant, movement_mode);
  const remaining_walk_cells = Math.floor(remaining_walk_ft / FEET_PER_GRID_SQUARE);

  const movement_range_cells = useMemo(() => {
    if (!active_token || !active_combatant || remaining_walk_cells <= 0) return [];

    const highlighted = new Set<string>();
    const min_x = Math.max(0, active_token.x - remaining_walk_cells);
    const max_x = Math.min(
      grid_cols - active_token_size_cells,
      active_token.x + remaining_walk_cells
    );
    const min_y = Math.max(0, active_token.y - remaining_walk_cells);
    const max_y = Math.min(
      grid_rows - active_token_size_cells,
      active_token.y + remaining_walk_cells
    );

    for (let tx = min_x; tx <= max_x; tx += 1) {
      for (let ty = min_y; ty <= max_y; ty += 1) {
        if (gridMoveDistanceFeet(active_token.x, active_token.y, tx, ty) > remaining_walk_ft) {
          continue;
        }
        // For Large+ tokens, mark every grid square the token footprint could cover.
        for (let fx = 0; fx < active_token_size_cells; fx += 1) {
          for (let fy = 0; fy < active_token_size_cells; fy += 1) {
            highlighted.add(`${tx + fx},${ty + fy}`);
          }
        }
      }
    }

    return Array.from(highlighted).map((key) => {
      const [x, y] = key.split(',').map(Number);
      return { x, y };
    });
  }, [active_token, active_combatant, active_token_size_cells, grid_cols, grid_rows, remaining_walk_cells, remaining_walk_ft]);

  const resetZoom = () => {
    set_zoom(1);
    set_pan_offset({ x: 0, y: 0 });
  };

  const adjustZoom = (delta: number) => {
    set_zoom((z) => Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, z * delta)));
  };

  // Pan the map by a delta in screen pixels.
  // Positive dx moves the map right (we add to pan_offset.x).
  // We clamp to reasonable bounds based on the current map size.
  const panBy = (dx: number, dy: number) => {
    set_pan_offset((p) => {
      const max_x = (map.image_width * scale) / 2;
      const max_y = (map.image_height * scale) / 2;
      return {
        x: Math.max(-max_x, Math.min(max_x, p.x + dx)),
        y: Math.max(-max_y, Math.min(max_y, p.y + dy)),
      };
    });
  };

  return (
    <div
      ref={container_ref}
      className="relative w-full h-full overflow-hidden"
      style={{
        background: fullscreen || projector_mode ? '#000' : 'var(--color-background-tertiary)',
        cursor: drag_state?.type === 'token'
          ? 'grabbing'
          : pending_placement
          ? 'crosshair'
          : 'default',
        touchAction: 'none',
      }}
      onPointerDown={handleBackgroundPointerDown}
      onPointerMove={handleContainerPointerMove}
      onPointerUp={handleContainerPointerUp}
      onPointerCancel={handleContainerPointerUp}
    >
      <div
        ref={inner_ref}
        onClick={handleMapClick}
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: `translate(calc(-50% + ${pan_offset.x}px), calc(-50% + ${pan_offset.y}px)) rotate(${rotation}deg) scale(${scale})`,
          transformOrigin: 'center center',
          width: map.image_width,
          height: map.image_height,
        }}
      >
        <img
          src={map.image_data}
          alt={map.name}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: map.image_width,
            height: map.image_height,
            userSelect: 'none',
            pointerEvents: 'none',
          }}
          draggable={false}
        />

        {show_grid && (
          <svg
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: map.image_width,
              height: map.image_height,
              pointerEvents: 'none',
            }}
          >
            {Array.from({ length: grid_cols + 1 }, (_, i) => {
              const x = map.grid_offset_x + i * map.grid_size;
              return (
                <line
                  key={`v${i}`}
                  x1={x}
                  y1={map.grid_offset_y}
                  x2={x}
                  y2={map.grid_offset_y + grid_rows * map.grid_size}
                  stroke="rgba(0,0,0,0.35)"
                  strokeWidth={1}
                />
              );
            })}
            {Array.from({ length: grid_rows + 1 }, (_, i) => {
              const y = map.grid_offset_y + i * map.grid_size;
              return (
                <line
                  key={`h${i}`}
                  x1={map.grid_offset_x}
                  y1={y}
                  x2={map.grid_offset_x + grid_cols * map.grid_size}
                  y2={y}
                  stroke="rgba(0,0,0,0.35)"
                  strokeWidth={1}
                />
              );
            })}
          </svg>
        )}

        {movement_range_cells.length > 0 && !drawing_enabled && (
          <svg
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: map.image_width,
              height: map.image_height,
              pointerEvents: 'none',
              zIndex: 2,
            }}
          >
            {movement_range_cells.map((cell) => {
              const pt = gridToImage(cell.x, cell.y);
              return (
                <rect
                  key={`move-${cell.x}-${cell.y}`}
                  x={pt.x}
                  y={pt.y}
                  width={map.grid_size}
                  height={map.grid_size}
                  fill={projector_mode ? 'rgba(34, 197, 94, 0.24)' : 'rgba(34, 197, 94, 0.16)'}
                  stroke={projector_mode ? 'rgba(74, 222, 128, 0.58)' : 'rgba(22, 163, 74, 0.35)'}
                  strokeWidth={1}
                />
              );
            })}
          </svg>
        )}

        {/* Drawing layer (above grid, below tokens) */}
        {(map.drawings || drawing_enabled) && (
          <DrawingLayer
            width={map.image_width}
            height={map.image_height}
            drawings={map.drawings ?? []}
            drawing_enabled={drawing_enabled}
            current_color={drawing_color}
            stroke_width={drawing_stroke_width}
            onAddDrawing={onAddDrawing ?? (() => {})}
            onUpdateDrawing={onUpdateDrawing ?? (() => {})}
            onDeleteDrawing={onDeleteDrawing ?? (() => {})}
            read_only={projector_mode || !onAddDrawing}
          />
        )}

        {drag_state?.type === 'token' && hover_cell && drag_state.combatant_id && (() => {
          const c = combatant_map[drag_state.combatant_id];
          const cells = c ? tokenCellSize(c.size) : 1;
          const token = map.tokens.find((t) => t.combatant_id === drag_state.combatant_id);
          const over_budget = token && c.id === active_combatant_id
            ? gridMoveDistanceFeet(token.x, token.y, hover_cell.x, hover_cell.y) > remaining_walk_ft
            : false;
          return (
            <div
              style={{
                position: 'absolute',
                left: gridToImage(hover_cell.x, hover_cell.y).x,
                top: gridToImage(hover_cell.x, hover_cell.y).y,
                width: map.grid_size * cells,
                height: map.grid_size * cells,
                background: over_budget ? 'rgba(239, 68, 68, 0.22)' : 'rgba(83, 74, 183, 0.25)',
                border: over_budget ? '2px solid #EF4444' : '2px solid #534AB7',
                boxSizing: 'border-box',
                pointerEvents: 'none',
              }}
            />
          );
        })()}

        {map.tokens.map((tp) => {
          const c = combatant_map[tp.combatant_id];
          if (!c) return null;
          const px = gridToImage(tp.x, tp.y);
          const is_dragging =
            drag_state?.type === 'token' && drag_state.combatant_id === c.id;
          const cells = tokenCellSize(c.size);
          return (
            <Token
              key={tp.combatant_id}
              combatant={c}
              style={style_map[c.id]}
              x={px.x}
              y={px.y}
              size={map.grid_size * cells}
              is_active={c.id === active_combatant_id}
              is_dragging={is_dragging}
              show_name={show_token_names}
              hide_hp_numbers={hide_monster_hp_numbers}
              interactive={allow_token_movement}
              can_open_hp_popup={!projector_mode}
              map_rotation={rotation}
              movement_label={c.id === active_combatant_id ? `${remaining_walk_ft} ft` : undefined}
              onPointerDown={(e) =>
                handleTokenPointerDown(e, c.id, tp.x, tp.y)
              }
              onClick={(e) => {
                e.stopPropagation();
                if (drag_state) return;
                if (projector_mode) return;
                if (!c.is_player) {
                  set_hp_popup_id(c.id === hp_popup_id ? null : c.id);
                }
              }}
            />
          );
        })}

        {hp_popup_token && hp_popup_combatant && !projector_mode && (
          <HPPopup
            combatant={hp_popup_combatant}
            position_px={gridToImage(hp_popup_token.x, hp_popup_token.y)}
            grid_size={map.grid_size}
            grid_cols={grid_cols}
            cell_x={hp_popup_token.x}
            map_rotation={rotation}
            onDamage={(amount) => {
              if (onDamageMonster) onDamageMonster(hp_popup_combatant.id, amount);
              set_hp_popup_id(null);
            }}
            onHeal={(amount) => {
              if (onHealMonster) onHealMonster(hp_popup_combatant.id, amount);
              set_hp_popup_id(null);
            }}
            onClose={() => set_hp_popup_id(null)}
          />
        )}
      </div>

      {active_combatant && active_token && (
        <div
          style={{
            position: 'absolute',
            top: 12,
            left: '50%',
            transform: 'translateX(-50%)',
            background: projector_mode ? 'rgba(0,0,0,0.72)' : 'rgba(255,255,255,0.94)',
            border: projector_mode ? '1px solid rgba(74, 222, 128, 0.45)' : '0.5px solid var(--color-border-secondary)',
            borderRadius: 999,
            padding: '6px 12px',
            zIndex: 26,
            fontSize: projector_mode ? 14 : 12,
            color: projector_mode ? '#fff' : 'var(--color-text-primary)',
            boxShadow: projector_mode ? '0 4px 16px rgba(0,0,0,0.35)' : '0 2px 8px rgba(0,0,0,0.12)',
            pointerEvents: 'none',
          }}
        >
          <strong>{active_combatant.name}</strong> {MOVEMENT_LABELS[movement_mode].toLowerCase()} range:{' '}
          <span style={{ color: projector_mode ? '#4ADE80' : '#15803D', fontWeight: 700 }}>{remaining_walk_ft} ft</span>
          <span style={{ color: projector_mode ? 'rgba(255,255,255,0.65)' : 'var(--color-text-tertiary)' }}>
            {' '}of {active_movement_speed} ft
          </span>
        </div>
      )}

      {/* Unplaced tokens (only shown in DM mode) */}
      {!projector_mode && unplaced.length > 0 && (
        <div
          style={{
            position: 'absolute',
            top: 12,
            left: 12,
            background: 'rgba(255,255,255,0.95)',
            padding: '8px',
            borderRadius: 'var(--border-radius-md)',
            border: '0.5px solid var(--color-border-tertiary)',
            maxWidth: '200px',
            zIndex: 20,
          }}
        >
          <div className="text-[10px] text-text-tertiary mb-1">
            {pending_placement
              ? 'Click on map to place'
              : `Click a token, then on map (${unplaced.length})`}
          </div>
          <div className="flex flex-wrap gap-1">
            {unplaced.map((c) => (
              <UnplacedTokenButton
                key={c.id}
                combatant={c}
                style={style_map[c.id]}
                is_pending={pending_placement === c.id}
                onClick={() =>
                  set_pending_placement(
                    pending_placement === c.id ? null : c.id
                  )
                }
              />
            ))}
          </div>
        </div>
      )}

      {/* Map controls (bottom-right): pan arrows + zoom */}
      <div
        style={{
          position: 'absolute',
          bottom: 12,
          right: 12,
          display: 'flex',
          gap: 8,
          zIndex: 25,
          alignItems: 'flex-end',
        }}
      >
        {/* Pan arrows in a D-pad layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 36px)',
            gridTemplateRows: 'repeat(3, 36px)',
            gap: 2,
          }}
        >
          <div /> {/* top-left empty */}
          <ControlButton
            projector_mode={projector_mode}
            onClick={() => panBy(0, 80)}
            title="Pan up"
          >
            ↑
          </ControlButton>
          <div /> {/* top-right empty */}
          <ControlButton
            projector_mode={projector_mode}
            onClick={() => panBy(80, 0)}
            title="Pan left"
          >
            ←
          </ControlButton>
          <ControlButton
            projector_mode={projector_mode}
            onClick={() => set_pan_offset({ x: 0, y: 0 })}
            title="Center"
            small
          >
            ⊙
          </ControlButton>
          <ControlButton
            projector_mode={projector_mode}
            onClick={() => panBy(-80, 0)}
            title="Pan right"
          >
            →
          </ControlButton>
          <div /> {/* bottom-left empty */}
          <ControlButton
            projector_mode={projector_mode}
            onClick={() => panBy(0, -80)}
            title="Pan down"
          >
            ↓
          </ControlButton>
          <div /> {/* bottom-right empty */}
        </div>

        {/* Zoom column */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <ControlButton
            projector_mode={projector_mode}
            onClick={() => adjustZoom(1.25)}
            title="Zoom in"
            big_text
          >
            +
          </ControlButton>
          <ControlButton
            projector_mode={projector_mode}
            onClick={() => adjustZoom(0.8)}
            title="Zoom out"
            big_text
          >
            −
          </ControlButton>
          <ControlButton
            projector_mode={projector_mode}
            onClick={resetZoom}
            title="Reset zoom"
            small
          >
            {Math.round(zoom * 100)}%
          </ControlButton>
        </div>
      </div>
    </div>
  );
}

function ControlButton({
  children,
  onClick,
  title,
  projector_mode,
  small,
  big_text,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
  projector_mode: boolean;
  small?: boolean;
  big_text?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        width: 36,
        height: 36,
        fontSize: small ? 11 : big_text ? 18 : 16,
        background: projector_mode ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.95)',
        color: projector_mode ? '#fff' : 'var(--color-text-primary)',
        border: projector_mode
          ? '1px solid rgba(255,255,255,0.3)'
          : '0.5px solid var(--color-border-secondary)',
        borderRadius: 6,
        padding: 0,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {children}
    </button>
  );
}

function Token({
  combatant,
  style,
  x,
  y,
  size,
  is_active,
  is_dragging,
  show_name,
  hide_hp_numbers,
  interactive,
  can_open_hp_popup,
  map_rotation,
  movement_label,
  onPointerDown,
  onClick,
}: {
  combatant: Combatant;
  style?: CombatantTokenStyle;
  x: number;
  y: number;
  size: number;
  is_active: boolean;
  is_dragging: boolean;
  show_name: boolean;
  hide_hp_numbers: boolean;
  interactive: boolean;
  can_open_hp_popup: boolean;
  map_rotation: number;
  movement_label?: string;
  onPointerDown: (e: React.PointerEvent) => void;
  onClick: (e: React.MouseEvent) => void;
}) {
  const initial = style?.initial ?? combatant.name.charAt(0).toUpperCase();
  // Color by type: PC blue, ally green, monster red
  const colors = combatantColors(combatant);
  const bg_color = style?.color ?? colors.bg;
  const has_avatar = !!style?.avatar;

  const hp_pct =
    combatant.hp_max > 0 ? combatant.hp_current / combatant.hp_max : 1;

  const stylized = !combatant.is_player && !combatant.is_ally && hide_hp_numbers
    ? stylizedHPLabel(combatant.hp_current, combatant.hp_max)
    : null;

  const cursor = !interactive
    ? 'default'
    : is_dragging
    ? 'grabbing'
    : 'grab';

  return (
    <div
      onPointerDown={onPointerDown}
      onClick={onClick}
      data-token-id={combatant.id}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
        cursor,
        opacity: is_dragging ? 0.4 : 1,
        zIndex: is_active ? 10 : 5,
        touchAction: 'none',
        userSelect: 'none',
        // Counter-rotate so the token (avatar, name, HP) stays upright when
        // the map is rotated. Rotates around its own center.
        transform: map_rotation ? `rotate(${-map_rotation}deg)` : undefined,
        transformOrigin: 'center center',
      }}
    >
      <div
        style={{
          width: '90%',
          height: '90%',
          margin: '5%',
          borderRadius: '50%',
          background: has_avatar ? 'transparent' : bg_color,
          backgroundImage: has_avatar ? `url(${style!.avatar})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          border: is_active
            ? '3px solid #FBBF24'
            : `2px solid ${colors.border}`,
          boxShadow: is_active
            ? '0 0 12px rgba(251, 191, 36, 0.7)'
            : '0 2px 4px rgba(0,0,0,0.3)',
          color: '#fff',
          fontWeight: 700,
          fontSize: Math.max(12, size * 0.4),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textShadow: '0 1px 2px rgba(0,0,0,0.5)',
          position: 'relative',
        }}
      >
        {!has_avatar && initial}

        {!combatant.is_player && !hide_hp_numbers && (
          <svg
            style={{
              position: 'absolute',
              bottom: '-2px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '90%',
              height: '6px',
              pointerEvents: 'none',
            }}
            viewBox="0 0 100 6"
            preserveAspectRatio="none"
          >
            <rect x="0" y="0" width="100" height="6" fill="rgba(0,0,0,0.4)" rx="3" />
            <rect
              x="0"
              y="0"
              width={Math.max(0, hp_pct * 100)}
              height="6"
              fill={
                hp_pct > 0.6 ? '#22C55E' : hp_pct > 0.3 ? '#F59E0B' : '#EF4444'
              }
              rx="3"
            />
          </svg>
        )}
      </div>

      {movement_label && (
        <div
          style={{
            position: 'absolute',
            right: -4,
            top: -6,
            background: 'rgba(22, 163, 74, 0.95)',
            color: '#fff',
            fontSize: 10,
            fontWeight: 700,
            lineHeight: '16px',
            minWidth: 34,
            height: 16,
            padding: '0 5px',
            borderRadius: 999,
            boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
            textAlign: 'center',
            pointerEvents: 'none',
          }}
        >
          {movement_label}
        </div>
      )}

      {show_name && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginTop: 6,
            padding: '2px 8px',
            background: 'rgba(0,0,0,0.75)',
            color: '#fff',
            fontSize: Math.max(10, size * 0.22),
            fontWeight: 500,
            borderRadius: 4,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            textShadow: '0 1px 2px rgba(0,0,0,0.6)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
          }}
        >
          {combatant.name}
          {stylized && (
            <span style={{ color: stylized.color, marginLeft: 6 }}>
              · {stylized.label}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function UnplacedTokenButton({
  combatant,
  style,
  is_pending,
  onClick,
}: {
  combatant: Combatant;
  style?: CombatantTokenStyle;
  is_pending: boolean;
  onClick: () => void;
}) {
  const initial = style?.initial ?? combatant.name.charAt(0).toUpperCase();
  const colors = combatantColors(combatant);
  const bg_color = style?.color ?? colors.bg;

  return (
    <button
      onClick={onClick}
      title={combatant.name}
      style={{
        width: 28,
        height: 28,
        borderRadius: '50%',
        background: style?.avatar ? `url(${style.avatar})` : bg_color,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#fff',
        fontWeight: 700,
        fontSize: 12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        border: is_pending
          ? '2px solid #FBBF24'
          : `1.5px solid ${colors.border}`,
        boxShadow: is_pending ? '0 0 6px rgba(251, 191, 36, 0.7)' : undefined,
        padding: 0,
      }}
    >
      {!style?.avatar && initial}
    </button>
  );
}

/**
 * Compute the bg/border colors for a combatant token based on type:
 * - Player character: blue
 * - Ally / summon: green
 * - Monster: red
 */
function combatantColors(combatant: Combatant): { bg: string; border: string } {
  if (combatant.is_player) {
    return { bg: '#3B82F6', border: '#1E40AF' };
  }
  if (combatant.is_ally) {
    return { bg: '#22C55E', border: '#15803D' };
  }
  return { bg: '#DC2626', border: '#7F1D1D' };
}

function HPPopup({
  combatant,
  position_px,
  grid_size,
  grid_cols,
  cell_x,
  map_rotation,
  onDamage,
  onHeal,
  onClose,
}: {
  combatant: Combatant;
  position_px: { x: number; y: number };
  grid_size: number;
  grid_cols: number;
  cell_x: number;
  map_rotation: number;
  onDamage: (amount: number) => void;
  onHeal: (amount: number) => void;
  onClose: () => void;
}) {
  const [dmg, set_dmg] = useState('');
  const [heal, set_heal] = useState('');

  const handleDamage = () => {
    const n = parseInt(dmg, 10);
    if (n > 0) onDamage(n);
  };
  const handleHeal = () => {
    const n = parseInt(heal, 10);
    if (n > 0) onHeal(n);
  };

  const hp_pct = combatant.hp_max > 0 ? combatant.hp_current / combatant.hp_max : 1;
  const bar_color =
    hp_pct > 0.6 ? '#22C55E' : hp_pct > 0.3 ? '#F59E0B' : '#EF4444';

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
      style={{
        position: 'absolute',
        left: cell_x < grid_cols - 5 ? position_px.x + grid_size + 6 : position_px.x - 220,
        top: position_px.y,
        background: 'rgba(255,255,255,0.98)',
        border: '0.5px solid var(--color-border-secondary)',
        borderRadius: 'var(--border-radius-md)',
        padding: '12px 14px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        zIndex: 50,
        width: 210,
        // Counter-rotate so the popup stays upright
        transform: map_rotation ? `rotate(${-map_rotation}deg)` : undefined,
        transformOrigin: 'top left',
      }}
    >
      <div className="flex justify-between items-center mb-1">
        <div className="text-[12px] font-medium">{combatant.name}</div>
        <button
          onClick={onClose}
          style={{
            border: 'none',
            background: 'transparent',
            fontSize: '16px',
            padding: 0,
            cursor: 'pointer',
            color: 'var(--color-text-tertiary)',
          }}
        >
          ×
        </button>
      </div>

      <div className="mb-2">
        <div className="flex justify-between text-[10px] text-text-tertiary mb-1">
          <span>HP</span>
          <span>
            {combatant.hp_current}/{combatant.hp_max}
            {combatant.hp_temp > 0 && (
              <span style={{ color: '#534AB7' }}> +{combatant.hp_temp}</span>
            )}
          </span>
        </div>
        <div
          style={{
            height: 8,
            background: 'var(--color-background-secondary)',
            borderRadius: 4,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${Math.max(0, hp_pct * 100)}%`,
              height: '100%',
              background: bar_color,
              transition: 'width 0.2s',
            }}
          />
        </div>
      </div>

      <div className="flex gap-1 mb-1">
        <input
          type="number"
          placeholder="Damage"
          value={dmg}
          onChange={(e) => set_dmg(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleDamage()}
          style={{ flex: 1, fontSize: '11px', height: '26px' }}
          autoFocus
        />
        <button
          onClick={handleDamage}
          style={{
            fontSize: '11px',
            padding: '0 10px',
            background: '#FCEBEB',
            borderColor: '#F09595',
            color: '#501313',
          }}
        >
          Damage
        </button>
      </div>
      <div className="flex gap-1">
        <input
          type="number"
          placeholder="Heal"
          value={heal}
          onChange={(e) => set_heal(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleHeal()}
          style={{ flex: 1, fontSize: '11px', height: '26px' }}
        />
        <button
          onClick={handleHeal}
          style={{
            fontSize: '11px',
            padding: '0 10px',
            background: '#E5F4D8',
            borderColor: '#9AC56A',
            color: '#2F4F0F',
          }}
        >
          Heal
        </button>
      </div>
    </div>
  );
}
