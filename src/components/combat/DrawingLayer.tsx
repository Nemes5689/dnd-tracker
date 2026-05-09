import { useRef, useState, useCallback, useEffect } from 'react';
import type { MapDrawing, EffectType } from '@/types/app';
import { EFFECTS, EFFECT_LIST, EffectDefs } from './effectDefs';

interface DrawingLayerProps {
  // Map-space dimensions (pixels of the underlying map image)
  width: number;
  height: number;
  // Existing drawings to render
  drawings: MapDrawing[];
  // True if the user is in draw mode (pointer events captured)
  drawing_enabled: boolean;
  // Currently selected stroke color (hex string)
  current_color: string;
  // Stroke width in image pixels
  stroke_width: number;
  // Distance (image px) within which last point closes the shape
  close_threshold?: number;
  // Called when a new stroke is finished (open or closed). The drawing has no
  // effect yet — for closed shapes the parent should open the picker.
  onAddDrawing: (drawing: MapDrawing) => void;
  // Called when a drawing is updated (e.g. effect set/changed)
  onUpdateDrawing: (drawing_id: string, patch: Partial<MapDrawing>) => void;
  // Called when a drawing is deleted
  onDeleteDrawing: (drawing_id: string) => void;
  // True if the current view is in projector mode (no editing UI, just render)
  read_only?: boolean;
}

/**
 * Drawing layer: an SVG positioned absolutely over the map image. Lets the user
 * draw freehand strokes; when a stroke "closes" (last point near first point),
 * the parent is notified so it can prompt for an effect.
 *
 * All coordinates here are in the underlying image's pixel space, so the
 * drawing scales naturally with the map's CSS transform.
 */
export function DrawingLayer({
  width,
  height,
  drawings,
  drawing_enabled,
  current_color,
  stroke_width,
  close_threshold = 35,
  onAddDrawing,
  onUpdateDrawing,
  onDeleteDrawing,
  read_only = false,
}: DrawingLayerProps) {
  const svg_ref = useRef<SVGSVGElement>(null);
  const [active_stroke, set_active_stroke] = useState<
    { x: number; y: number }[] | null
  >(null);
  // ID of the drawing whose menu is open (for setting effect / deleting)
  const [menu_drawing_id, set_menu_drawing_id] = useState<string | null>(null);
  // ID of a freshly-completed CLOSED drawing waiting for effect choice
  const [pending_effect_drawing_id, set_pending_effect_drawing_id] = useState<
    string | null
  >(null);

  // Convert a pointer event's clientX/Y to image-pixel coordinates by inverting
  // the SVG's CTM. SVG handles all the scale/transform math automatically.
  const pointer_to_image = useCallback(
    (e: React.PointerEvent<SVGSVGElement>): { x: number; y: number } | null => {
      const svg = svg_ref.current;
      if (!svg) return null;
      const pt = svg.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      const ctm = svg.getScreenCTM();
      if (!ctm) return null;
      const inv = ctm.inverse();
      const transformed = pt.matrixTransform(inv);
      return { x: transformed.x, y: transformed.y };
    },
    []
  );

  const handle_pointer_down = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!drawing_enabled || read_only) return;
    if (e.button !== 0) return; // only primary button
    const pt = pointer_to_image(e);
    if (!pt) return;
    set_active_stroke([pt]);
    (e.target as Element).setPointerCapture?.(e.pointerId);
    e.stopPropagation();
  };

  const handle_pointer_move = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!active_stroke) return;
    const pt = pointer_to_image(e);
    if (!pt) return;
    // Throttle: only add if it moved at least 1.5 image-pixels
    const last = active_stroke[active_stroke.length - 1];
    const dx = pt.x - last.x;
    const dy = pt.y - last.y;
    if (dx * dx + dy * dy < 2.25) return;
    set_active_stroke([...active_stroke, pt]);
  };

  const handle_pointer_up = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!active_stroke) return;
    if (active_stroke.length < 3) {
      // Too short to be a stroke — discard
      set_active_stroke(null);
      return;
    }
    const first = active_stroke[0];
    const last = active_stroke[active_stroke.length - 1];
    const dx = last.x - first.x;
    const dy = last.y - first.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const is_closed = dist < close_threshold;

    const drawing: MapDrawing = {
      id: crypto.randomUUID(),
      points: active_stroke,
      color: current_color,
      stroke_width,
      is_closed,
      created_at: Date.now(),
    };
    onAddDrawing(drawing);
    set_active_stroke(null);

    // If closed, prompt for effect
    if (is_closed) {
      set_pending_effect_drawing_id(drawing.id);
    }
    e.stopPropagation();
  };

  // Auto-close menu when clicking elsewhere
  useEffect(() => {
    if (!menu_drawing_id) return;
    const handler = () => set_menu_drawing_id(null);
    // Delay so the click that opened the menu doesn't immediately close it
    const t = setTimeout(() => {
      window.addEventListener('click', handler);
    }, 0);
    return () => {
      clearTimeout(t);
      window.removeEventListener('click', handler);
    };
  }, [menu_drawing_id]);

  // Render path "d" attribute from points
  const points_to_path = (points: { x: number; y: number }[]): string => {
    if (points.length === 0) return '';
    let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
    for (let i = 1; i < points.length; i++) {
      d += ` L ${points[i].x.toFixed(1)} ${points[i].y.toFixed(1)}`;
    }
    return d;
  };

  return (
    <>
      <svg
        ref={svg_ref}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width,
          height,
          // Only capture pointer events when drawing mode is on; otherwise let
          // the map below handle clicks.
          pointerEvents: drawing_enabled && !read_only ? 'auto' : 'none',
          cursor: drawing_enabled && !read_only ? 'crosshair' : 'default',
        }}
        onPointerDown={handle_pointer_down}
        onPointerMove={handle_pointer_move}
        onPointerUp={handle_pointer_up}
        onPointerCancel={() => set_active_stroke(null)}
      >
        <EffectDefs />

        {/* Render stored drawings */}
        {drawings.map((d) => {
          const path_d = points_to_path(d.points);
          // For closed shapes with effect: fill with effect's gradient/pattern
          const has_effect = d.is_closed && d.effect;
          const effect_def = d.effect ? EFFECTS[d.effect] : null;
          return (
            <g
              key={d.id}
              style={{
                cursor: read_only ? 'default' : 'pointer',
                pointerEvents: read_only ? 'none' : 'auto',
              }}
              onClick={(e) => {
                if (read_only) return;
                e.stopPropagation();
                set_menu_drawing_id((cur) => (cur === d.id ? null : d.id));
              }}
            >
              {/* Filled interior (only for closed shapes) */}
              {d.is_closed && (
                <path
                  d={path_d + ' Z'}
                  fill={has_effect ? effect_def!.fill : 'rgba(0,0,0,0.05)'}
                  stroke="none"
                />
              )}
              {/* Outline */}
              <path
                d={path_d + (d.is_closed ? ' Z' : '')}
                fill="none"
                stroke={has_effect ? effect_def!.primary_color : d.color}
                strokeWidth={d.stroke_width}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={has_effect ? 0.9 : 1}
              />
            </g>
          );
        })}

        {/* Active stroke being drawn */}
        {active_stroke && (
          <path
            d={points_to_path(active_stroke)}
            fill="none"
            stroke={current_color}
            strokeWidth={stroke_width}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.95}
            pointerEvents="none"
          />
        )}
      </svg>

      {/* Inline menu for clicking on an existing drawing */}
      {menu_drawing_id &&
        (() => {
          const d = drawings.find((x) => x.id === menu_drawing_id);
          if (!d) return null;
          const last = d.points[d.points.length - 1];
          // Position menu at the last point of the stroke (image coords).
          // We place it via absolute styling on the SVG's parent, but the SVG
          // has the map's transform — so we render this menu inside an
          // abs-positioned wrapper that uses the same image-pixel coords.
          return (
            <DrawingMenu
              x={last.x}
              y={last.y}
              drawing={d}
              onChooseEffect={(effect) => {
                onUpdateDrawing(d.id, { effect });
                set_menu_drawing_id(null);
              }}
              onClearEffect={() => {
                onUpdateDrawing(d.id, { effect: undefined });
                set_menu_drawing_id(null);
              }}
              onDelete={() => {
                onDeleteDrawing(d.id);
                set_menu_drawing_id(null);
              }}
              onClose={() => set_menu_drawing_id(null)}
            />
          );
        })()}

      {/* Effect picker modal for fresh closed shape */}
      {pending_effect_drawing_id && (
        <EffectPickerModal
          onPick={(effect) => {
            onUpdateDrawing(pending_effect_drawing_id, { effect });
            set_pending_effect_drawing_id(null);
          }}
          onSkip={() => set_pending_effect_drawing_id(null)}
        />
      )}
    </>
  );
}

// =============================================================================
// Effect picker modal (fullscreen overlay shown right after closing a shape)
// =============================================================================

function EffectPickerModal({
  onPick,
  onSkip,
}: {
  onPick: (effect: EffectType) => void;
  onSkip: () => void;
}) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.55)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 250,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onSkip();
      }}
    >
      <div
        style={{
          background: 'var(--color-background-primary)',
          padding: 22,
          borderRadius: 'var(--border-radius-md)',
          maxWidth: 540,
          width: 'calc(100% - 40px)',
          boxShadow: '0 10px 40px rgba(0,0,0,0.35)',
        }}
      >
        <div className="flex justify-between items-center mb-3">
          <div className="text-[15px] font-medium">
            Choose an area effect
          </div>
          <div className="text-[11px] text-text-tertiary">
            (or skip to keep an outlined shape)
          </div>
        </div>

        <div
          className="grid gap-2 mb-3"
          style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}
        >
          {EFFECT_LIST.map((eff) => (
            <button
              key={eff.id}
              onClick={() => onPick(eff.id)}
              style={{
                padding: '10px 10px',
                background: 'var(--color-background-secondary)',
                border: '0.5px solid var(--color-border-tertiary)',
                borderRadius: 'var(--border-radius-md)',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
              title={eff.description}
            >
              <span
                style={{
                  fontSize: 22,
                  width: 28,
                  display: 'inline-block',
                  textAlign: 'center',
                }}
              >
                {eff.emoji}
              </span>
              <div className="flex-1 min-w-0">
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: eff.primary_color,
                  }}
                >
                  {eff.name}
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="flex justify-end">
          <button
            onClick={onSkip}
            style={{ fontSize: 12, padding: '6px 14px' }}
          >
            Skip — outline only
          </button>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// Inline menu for editing existing drawings
// =============================================================================

function DrawingMenu({
  drawing,
  onChooseEffect,
  onClearEffect,
  onDelete,
  onClose,
}: {
  x: number;
  y: number;
  drawing: MapDrawing;
  onChooseEffect: (effect: EffectType) => void;
  onClearEffect: () => void;
  onDelete: () => void;
  onClose: () => void;
}) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 250,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--color-background-primary)',
          padding: 18,
          borderRadius: 'var(--border-radius-md)',
          maxWidth: 480,
          width: 'calc(100% - 40px)',
        }}
      >
        <div className="text-[14px] font-medium mb-2">
          {drawing.is_closed ? 'Edit shape' : 'Edit stroke'}
        </div>

        {drawing.is_closed && (
          <>
            <div className="text-[11px] text-text-secondary mb-2">
              Apply or change effect:
            </div>
            <div
              className="grid gap-1 mb-3"
              style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}
            >
              {EFFECT_LIST.map((eff) => (
                <button
                  key={eff.id}
                  onClick={() => onChooseEffect(eff.id)}
                  style={{
                    padding: '6px 8px',
                    background:
                      drawing.effect === eff.id
                        ? 'var(--color-background-info)'
                        : 'var(--color-background-secondary)',
                    border: '0.5px solid var(--color-border-tertiary)',
                    borderRadius: 'var(--border-radius-sm)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: 11,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <span style={{ fontSize: 16 }}>{eff.emoji}</span>
                  <span style={{ color: eff.primary_color, fontWeight: 500 }}>
                    {eff.name}
                  </span>
                </button>
              ))}
            </div>
          </>
        )}

        <div className="flex justify-between gap-2">
          {drawing.is_closed && drawing.effect && (
            <button
              onClick={onClearEffect}
              style={{ fontSize: 11, padding: '5px 10px' }}
            >
              Clear effect
            </button>
          )}
          <div className="flex gap-2 ml-auto">
            <button
              onClick={onDelete}
              style={{
                fontSize: 11,
                padding: '5px 12px',
                color: 'var(--color-text-danger)',
                borderColor: 'var(--color-border-danger)',
              }}
            >
              Delete
            </button>
            <button
              onClick={onClose}
              style={{ fontSize: 11, padding: '5px 12px' }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
