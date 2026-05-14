import { useState, useRef, useEffect } from 'react';
import { useEncounterStore } from '@/store/encounterStore';
import { processImageFile, formatBytes } from '@/utils/imageUtils';
import { getProjectorBus } from '@/utils/projectorBus';
import { BattleMap } from './BattleMap';
import { TurnOrderBar } from './TurnOrderBar';
import type { Encounter, MovementMode } from '@/types/app';
import { getEffectiveMovementSpeeds, MOVEMENT_LABELS, MOVEMENT_MODES } from '@/utils/movement';

interface Props {
  encounter: Encounter;
  onExit: () => void;
}

export function BattleMapView({ encounter, onExit }: Props) {
  const {
    addMap,
    updateMap,
    deleteMap,
    setActiveMap,
    setTokenPosition,
    updateCombatant,
    damageCombatant,
    healCombatant,
    addMapDrawing,
    updateMapDrawing,
    deleteMapDrawing,
    clearMapDrawings,
    setMapRotation,
  } = useEncounterStore();

  const file_input_ref = useRef<HTMLInputElement>(null);
  const [is_fullscreen, set_is_fullscreen] = useState(false);
  const [is_uploading, set_is_uploading] = useState(false);
  const [show_settings, set_show_settings] = useState(false);
  const [movement_mode, set_movement_mode] = useState<MovementMode>('walk');
  const [projector_window, set_projector_window] = useState<Window | null>(
    null
  );

  // Drawing state
  const [drawing_enabled, set_drawing_enabled] = useState(false);
  const [drawing_color, set_drawing_color] = useState('#dc2626');
  const [drawing_stroke_width, set_drawing_stroke_width] = useState(4);

  const maps = encounter.maps ?? [];
  const active_map = maps.find((m) => m.id === encounter.active_map_id) ?? null;

  const sorted = [...encounter.combatants].sort(
    (a, b) => b.initiative - a.initiative
  );
  const active_combatant = sorted[encounter.turn_index];
  const active_movement_speeds = getEffectiveMovementSpeeds(active_combatant);

  useEffect(() => {
    if (!active_movement_speeds[movement_mode]) {
      set_movement_mode('walk');
    }
  }, [active_combatant?.id, active_movement_speeds, movement_mode]);

  // Broadcast encounter state to projector window whenever it changes
  useEffect(() => {
    const bus = getProjectorBus();
    bus.send({
      type: 'encounter_update',
      encounter,
      timestamp: Date.now(),
    });
  }, [encounter]);

  // Handle messages from projector window
  useEffect(() => {
    const bus = getProjectorBus();
    const unsub = bus.subscribe((msg) => {
      if (msg.type === 'request_state') {
        // Projector window asks for current state
        bus.send({
          type: 'encounter_update',
          encounter,
          timestamp: Date.now(),
        });
      } else if (msg.type === 'move_token') {
        // Projector window moved a token — apply it
        if (msg.encounter_id === encounter.id) {
          setTokenPosition(
            msg.encounter_id,
            msg.map_id,
            msg.combatant_id,
            msg.x,
            msg.y
          );
        }
      }
    });
    return () => {
      unsub();
    };
  }, [encounter, setTokenPosition]);

  // Pass interactivity flag to BattleMap below
  const allow_token_movement = true;

  // Track if projector window is closed (user closed it manually)
  useEffect(() => {
    if (!projector_window) return;
    const interval = setInterval(() => {
      if (projector_window.closed) {
        set_projector_window(null);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [projector_window]);

  // ESC exits fullscreen
  useEffect(() => {
    if (!is_fullscreen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') set_is_fullscreen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [is_fullscreen]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    set_is_uploading(true);
    try {
      const processed = await processImageFile(file);
      const name = file.name.replace(/\.[^.]+$/, '') || 'New map';
      addMap(encounter.id, {
        name,
        image_data: processed.data_url,
        image_width: processed.width,
        image_height: processed.height,
        grid_size: 50,
        grid_offset_x: 0,
        grid_offset_y: 0,
        show_grid: true,
      });
    } catch (err: any) {
      const msg = err?.message ?? String(err);
      if (msg.includes('quota') || msg.includes('QuotaExceeded')) {
        alert('Storage limit reached. Try deleting old maps, or use a smaller image.');
      } else {
        alert(`Failed to load image: ${msg}`);
      }
    } finally {
      set_is_uploading(false);
      if (file_input_ref.current) file_input_ref.current.value = '';
    }
  };

  const handleDeleteMap = (map_id: string) => {
    if (!confirm('Delete this map? Token positions will be lost.')) return;
    deleteMap(encounter.id, map_id);
  };

  const handleRenameMap = (map_id: string, current_name: string) => {
    const new_name = prompt('Map name?', current_name);
    if (new_name && new_name.trim()) {
      updateMap(encounter.id, map_id, { name: new_name.trim() });
    }
  };

  const handleMoveToken = (combatant_id: string, x: number, y: number) => {
    if (!active_map) return;

    const old_token = active_map.tokens.find((t) => t.combatant_id === combatant_id);
    const moving_combatant = encounter.combatants.find((c) => c.id === combatant_id);

    setTokenPosition(encounter.id, active_map.id, combatant_id, x, y);

    // Count walk movement only for the current turn's active combatant.
    // New placement does not spend movement; later drag moves do.
    if (old_token && moving_combatant?.id === active_combatant?.id) {
      const moved_ft = Math.max(Math.abs(x - old_token.x), Math.abs(y - old_token.y)) * 5;
      if (moved_ft > 0) {
        updateCombatant(encounter.id, combatant_id, {
          movement_used: (moving_combatant.movement_used ?? 0) + moved_ft,
        });
      }
    }
  };

  const handleDamageMonster = (combatant_id: string, amount: number) => {
    damageCombatant(encounter.id, combatant_id, amount);
  };

  const handleHealMonster = (combatant_id: string, amount: number) => {
    healCombatant(encounter.id, combatant_id, amount);
  };

  // Open projector window
  const handleCastToProjector = () => {
    if (projector_window && !projector_window.closed) {
      // Already open, focus it
      projector_window.focus();
      return;
    }
    // Use the same path with #/projector route
    const url = `${window.location.pathname}#/projector`;
    const win = window.open(url, 'dnd-projector', 'width=1280,height=800');
    if (!win) {
      alert(
        'Could not open projector window. Please allow pop-ups for this site.'
      );
      return;
    }
    set_projector_window(win);
  };

  const closeProjector = () => {
    if (projector_window && !projector_window.closed) {
      projector_window.close();
    }
    set_projector_window(null);
  };

  // === Render ===

  if (is_fullscreen && active_map) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: '#000',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Turn order at top */}
        {encounter.combatants.length > 0 && (
          <div
            style={{
              padding: '10px 14px',
              background: '#000',
              borderBottom: '1px solid rgba(255,255,255,0.15)',
              display: 'flex',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <TurnOrderBar
              combatants={sorted}
              active_index={encounter.turn_index}
              round={encounter.round}
              variant="dm"
              token_styles={encounter.token_styles}
            />
          </div>
        )}

        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          <BattleMap
            map={active_map}
            combatants={encounter.combatants}
            active_combatant_id={active_combatant?.id}
            token_styles={encounter.token_styles}
            onMoveToken={handleMoveToken}
            onDamageMonster={handleDamageMonster}
            onHealMonster={handleHealMonster}
            show_grid={active_map.show_grid}
            movement_mode={movement_mode}
            fullscreen
            show_token_names
            drawing_enabled={drawing_enabled}
            drawing_color={drawing_color}
            drawing_stroke_width={drawing_stroke_width}
            onAddDrawing={(d) =>
              addMapDrawing(encounter.id, active_map.id, d)
            }
            onUpdateDrawing={(id, patch) =>
              updateMapDrawing(encounter.id, active_map.id, id, patch)
            }
            onDeleteDrawing={(id) =>
              deleteMapDrawing(encounter.id, active_map.id, id)
            }
          />

          <div
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              display: 'flex',
              gap: 8,
              alignItems: 'center',
              background: 'rgba(0,0,0,0.6)',
              padding: '6px 10px',
              borderRadius: 8,
              zIndex: 30,
            }}
          >
            <RotationToolbar
              rotation={active_map.rotation ?? 0}
              onChange={(r) =>
                setMapRotation(encounter.id, active_map.id, r)
              }
              variant="dark"
            />
            <DrawingToolbar
              drawing_enabled={drawing_enabled}
              onToggle={() => set_drawing_enabled(!drawing_enabled)}
              color={drawing_color}
              onColorChange={set_drawing_color}
              stroke_width={drawing_stroke_width}
              onStrokeWidthChange={set_drawing_stroke_width}
              has_drawings={(active_map.drawings ?? []).length > 0}
              onClearAll={() => {
                if (
                  confirm(
                    `Clear all ${
                      (active_map.drawings ?? []).length
                    } drawings on this map?`
                  )
                ) {
                  clearMapDrawings(encounter.id, active_map.id);
                }
              }}
              variant="dark"
            />
            <span
              style={{
                color: '#fff',
                fontSize: 11,
                alignSelf: 'center',
                opacity: 0.7,
              }}
            >
              Press ESC to exit
            </span>
            <button
              onClick={() => set_is_fullscreen(false)}
              style={{
                fontSize: 12,
                padding: '4px 12px',
                background: '#fff',
              }}
            >
              Exit fullscreen
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div
        className="flex justify-between items-center bg-bg-primary"
        style={{
          padding: '12px 24px',
          borderBottom: '0.5px solid var(--color-border-tertiary)',
        }}
      >
        <div className="flex items-center gap-3">
          <button onClick={onExit} style={{ padding: '4px 10px', fontSize: '12px' }}>
            ← Back to combat
          </button>
          <div>
            <div className="text-[14px] font-medium">{encounter.name}</div>
            <div className="text-[11px] text-text-tertiary">
              Battle map · Round {encounter.round}
            </div>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          {/* Rotation toolbar (only when map exists) */}
          {active_map && (
            <RotationToolbar
              rotation={active_map.rotation ?? 0}
              onChange={(r) =>
                setMapRotation(encounter.id, active_map.id, r)
              }
            />
          )}
          {/* Drawing toolbar (only when map exists) */}
          {active_map && (
            <DrawingToolbar
              drawing_enabled={drawing_enabled}
              onToggle={() => set_drawing_enabled(!drawing_enabled)}
              color={drawing_color}
              onColorChange={set_drawing_color}
              stroke_width={drawing_stroke_width}
              onStrokeWidthChange={set_drawing_stroke_width}
              has_drawings={(active_map.drawings ?? []).length > 0}
              onClearAll={() => {
                if (
                  confirm(
                    `Clear all ${
                      (active_map.drawings ?? []).length
                    } drawings on this map?`
                  )
                ) {
                  clearMapDrawings(encounter.id, active_map.id);
                }
              }}
            />
          )}
          {projector_window && !projector_window.closed ? (
            <button
              onClick={closeProjector}
              style={{
                padding: '8px 16px',
                fontSize: '13px',
                background: 'var(--color-background-info)',
                borderColor: 'var(--color-border-info)',
                color: 'var(--color-text-info)',
              }}
            >
              📺 Projector ON · Close
            </button>
          ) : (
            <button
              onClick={handleCastToProjector}
              disabled={!active_map}
              style={{ padding: '8px 16px', fontSize: '13px' }}
            >
              📺 Cast to projector
            </button>
          )}
          {active_map && (
            <button
              onClick={() => set_is_fullscreen(true)}
              className="bg-accent-50 border-accent-300 text-accent-900 font-medium"
              style={{ padding: '8px 16px', fontSize: '13px' }}
            >
              ⛶ Fullscreen
            </button>
          )}
        </div>
      </div>

      <div
        className="flex-1 grid overflow-hidden"
        style={{ gridTemplateColumns: '260px 1fr' }}
      >
        {/* Sidebar */}
        <div
          className="bg-bg-primary overflow-y-auto flex flex-col"
          style={{
            padding: '16px 14px',
            borderRight: '0.5px solid var(--color-border-tertiary)',
          }}
        >
          <div className="flex justify-between items-center mb-3">
            <div className="text-[13px] font-medium">Maps ({maps.length})</div>
          </div>

          <input
            type="file"
            accept="image/*"
            ref={file_input_ref}
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <button
            onClick={() => file_input_ref.current?.click()}
            disabled={is_uploading}
            className="bg-accent-50 border-accent-300 text-accent-900 mb-3"
            style={{ padding: '8px', fontSize: '12px' }}
          >
            {is_uploading ? 'Uploading…' : '+ Upload map image'}
          </button>

          {maps.length === 0 ? (
            <div className="text-[12px] text-text-tertiary italic">
              No maps yet. Upload an image to get started.
            </div>
          ) : (
            <div className="flex flex-col gap-1 mb-4">
              {maps.map((m) => {
                const is_active = m.id === encounter.active_map_id;
                return (
                  <div
                    key={m.id}
                    onClick={() => setActiveMap(encounter.id, m.id)}
                    style={{
                      padding: '8px 10px',
                      borderRadius: 'var(--border-radius-md)',
                      cursor: 'pointer',
                      background: is_active
                        ? 'var(--color-background-info)'
                        : 'var(--color-background-secondary)',
                      border: is_active
                        ? '0.5px solid var(--color-border-info)'
                        : '0.5px solid var(--color-border-tertiary)',
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <div
                        className="text-[12px] flex-1 truncate"
                        style={{
                          fontWeight: is_active ? 500 : 400,
                          color: is_active ? 'var(--color-text-info)' : undefined,
                        }}
                      >
                        {m.name}
                      </div>
                      <div className="flex gap-1 ml-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRenameMap(m.id, m.name);
                          }}
                          style={{
                            fontSize: '10px',
                            padding: '2px 6px',
                            border: 'none',
                            background: 'transparent',
                            color: 'var(--color-text-tertiary)',
                          }}
                        >
                          ✎
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteMap(m.id);
                          }}
                          style={{
                            fontSize: '10px',
                            padding: '2px 6px',
                            border: 'none',
                            background: 'transparent',
                            color: 'var(--color-text-danger)',
                          }}
                        >
                          ×
                        </button>
                      </div>
                    </div>
                    <div className="text-[10px] text-text-tertiary mt-1">
                      {m.image_width}×{m.image_height} ·{' '}
                      {formatBytes(m.image_data.length)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {active_map && (
            <div className="mt-2">
              <button
                onClick={() => set_show_settings(!show_settings)}
                style={{
                  fontSize: '11px',
                  padding: '6px 10px',
                  width: '100%',
                  textAlign: 'left',
                }}
              >
                ⚙ Map settings {show_settings ? '▾' : '▸'}
              </button>

              {show_settings && (
                <div
                  className="mt-2"
                  style={{
                    padding: '10px',
                    background: 'var(--color-background-secondary)',
                    borderRadius: 'var(--border-radius-md)',
                  }}
                >
                  <div className="text-[10px] text-text-tertiary mb-1">
                    Grid size (pixels per square)
                  </div>
                  <input
                    type="number"
                    value={active_map.grid_size}
                    onChange={(e) =>
                      updateMap(encounter.id, active_map.id, {
                        grid_size: Math.max(
                          10,
                          parseInt(e.target.value, 10) || 50
                        ),
                      })
                    }
                    style={{ width: '100%', fontSize: '11px', height: '26px' }}
                  />

                  <div
                    className="grid gap-2 mt-2"
                    style={{ gridTemplateColumns: '1fr 1fr' }}
                  >
                    <div>
                      <div className="text-[10px] text-text-tertiary mb-1">
                        Offset X
                      </div>
                      <input
                        type="number"
                        value={active_map.grid_offset_x}
                        onChange={(e) =>
                          updateMap(encounter.id, active_map.id, {
                            grid_offset_x: parseInt(e.target.value, 10) || 0,
                          })
                        }
                        style={{ width: '100%', fontSize: '11px', height: '26px' }}
                      />
                    </div>
                    <div>
                      <div className="text-[10px] text-text-tertiary mb-1">
                        Offset Y
                      </div>
                      <input
                        type="number"
                        value={active_map.grid_offset_y}
                        onChange={(e) =>
                          updateMap(encounter.id, active_map.id, {
                            grid_offset_y: parseInt(e.target.value, 10) || 0,
                          })
                        }
                        style={{ width: '100%', fontSize: '11px', height: '26px' }}
                      />
                    </div>
                  </div>

                  <label
                    className="flex items-center gap-2 mt-3 cursor-pointer"
                    style={{ fontSize: '11px' }}
                  >
                    <input
                      type="checkbox"
                      checked={active_map.show_grid}
                      onChange={(e) =>
                        updateMap(encounter.id, active_map.id, {
                          show_grid: e.target.checked,
                        })
                      }
                    />
                    Show grid lines
                  </label>
                </div>
              )}
            </div>
          )}

          <div
            className="mt-auto pt-3 text-[10px] text-text-tertiary"
            style={{ borderTop: '0.5px solid var(--color-border-tertiary)' }}
          >
            <p className="leading-relaxed mb-2">
              💾 Maps stored in browser. Total:{' '}
              {formatBytes(maps.reduce((sum, m) => sum + m.image_data.length, 0))}
              .
            </p>
            <p className="leading-relaxed">
              📺 <strong>Projector tip</strong>: open projector window, then drag it to your
              second monitor. Use F11 in the new window for fullscreen.
            </p>
          </div>
        </div>

        {/* Map area with turn order above */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Turn order - dedicated row, not overlay */}
          {encounter.combatants.length > 0 && (
            <div
              style={{
                padding: '10px 14px',
                background: 'var(--color-background-secondary)',
                borderBottom: '0.5px solid var(--color-border-tertiary)',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <TurnOrderBar
                combatants={sorted}
                active_index={encounter.turn_index}
                round={encounter.round}
                variant="dm"
              token_styles={encounter.token_styles}
              />
            </div>
          )}

          <div className="flex-1 overflow-hidden relative">
            {active_map && active_combatant && (
              <div
                style={{
                  position: 'absolute',
                  top: 10,
                  right: 12,
                  zIndex: 35,
                  background: 'rgba(255,255,255,0.96)',
                  border: '0.5px solid var(--color-border-secondary)',
                  borderRadius: 'var(--border-radius-md)',
                  padding: '6px 8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                }}
              >
                <span className="text-[11px] text-text-tertiary">Move mode</span>
                <select
                  value={movement_mode}
                  onChange={(e) => set_movement_mode(e.target.value as MovementMode)}
                  className="text-[12px]"
                  style={{ padding: '4px 8px' }}
                >
                  {MOVEMENT_MODES.map((mode) => {
                    const value = active_movement_speeds[mode];
                    return (
                      <option key={mode} value={mode} disabled={!value}>
                        {MOVEMENT_LABELS[mode]} {value ? `${value} ft` : '—'}
                      </option>
                    );
                  })}
                </select>
              </div>
            )}
            {active_map ? (
              <BattleMap
                map={active_map}
                combatants={encounter.combatants}
                active_combatant_id={active_combatant?.id}
                token_styles={encounter.token_styles}
                onMoveToken={handleMoveToken}
                onDamageMonster={handleDamageMonster}
                onHealMonster={handleHealMonster}
                show_grid={active_map.show_grid}
                movement_mode={movement_mode}
                show_token_names
                drawing_enabled={drawing_enabled}
                drawing_color={drawing_color}
                drawing_stroke_width={drawing_stroke_width}
                onAddDrawing={(d) =>
                  addMapDrawing(encounter.id, active_map.id, d)
                }
                onUpdateDrawing={(id, patch) =>
                  updateMapDrawing(encounter.id, active_map.id, id, patch)
                }
                onDeleteDrawing={(id) =>
                  deleteMapDrawing(encounter.id, active_map.id, id)
                }
              />
            ) : (
              <div className="h-full flex items-center justify-center text-text-tertiary">
                <div className="text-center">
                  <p className="mb-3">No map selected.</p>
                  <p className="text-[12px]">
                    Upload a map image to start placing tokens.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


// =============================================================================
// Drawing toolbar (color picker + stroke width + draw toggle + clear)
// =============================================================================

const DRAWING_COLORS = [
  "#dc2626", // red-600
  "#ea580c", // orange-600
  "#facc15", // yellow-400
  "#16a34a", // green-600
  "#0ea5e9", // sky-500
  "#7c3aed", // violet-600
  "#ec4899", // pink-500
  "#1f2937", // gray-800
  "#ffffff", // white
];

function DrawingToolbar({
  drawing_enabled,
  onToggle,
  color,
  onColorChange,
  stroke_width,
  onStrokeWidthChange,
  has_drawings,
  onClearAll,
  variant = "light",
}: {
  drawing_enabled: boolean;
  onToggle: () => void;
  color: string;
  onColorChange: (c: string) => void;
  stroke_width: number;
  onStrokeWidthChange: (w: number) => void;
  has_drawings: boolean;
  onClearAll: () => void;
  variant?: "light" | "dark";
}) {
  const is_dark = variant === "dark";
  return (
    <div
      style={{
        display: "flex",
        gap: 6,
        alignItems: "center",
        background: drawing_enabled
          ? is_dark
            ? "rgba(124, 58, 237, 0.3)"
            : "var(--color-background-info)"
          : "transparent",
        border: drawing_enabled
          ? "0.5px solid var(--color-border-info)"
          : "0.5px solid transparent",
        borderRadius: 6,
        padding: drawing_enabled ? "4px 8px" : "0",
      }}
    >
      <button
        onClick={onToggle}
        title={drawing_enabled ? "Disable drawing mode" : "Enable drawing mode"}
        style={{
          fontSize: 13,
          padding: "6px 12px",
          background: drawing_enabled
            ? "var(--color-background-info)"
            : is_dark
            ? "rgba(255,255,255,0.85)"
            : "var(--color-background-primary)",
          color: drawing_enabled ? "var(--color-text-info)" : undefined,
          fontWeight: drawing_enabled ? 500 : 400,
          border: "0.5px solid var(--color-border-tertiary)",
          borderRadius: 4,
          cursor: "pointer",
          whiteSpace: "nowrap",
        }}
      >
        🖊 {drawing_enabled ? "Drawing ON" : "Draw"}
      </button>

      {drawing_enabled && (
        <>
          {/* Color swatches */}
          <div style={{ display: "flex", gap: 3 }}>
            {DRAWING_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => onColorChange(c)}
                title={c}
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: c,
                  border:
                    color === c
                      ? "2px solid var(--color-text-info)"
                      : "1px solid rgba(0,0,0,0.3)",
                  cursor: "pointer",
                  padding: 0,
                  boxShadow: color === c ? "0 0 0 1px white inset" : undefined,
                }}
              />
            ))}
          </div>

          {/* Stroke width */}
          <select
            value={stroke_width}
            onChange={(e) => onStrokeWidthChange(parseInt(e.target.value, 10))}
            title="Stroke width"
            style={{
              fontSize: 11,
              padding: "3px 6px",
              borderRadius: 4,
              background: is_dark ? "rgba(255,255,255,0.85)" : undefined,
            }}
          >
            <option value={2}>thin</option>
            <option value={4}>med</option>
            <option value={8}>thick</option>
            <option value={14}>extra</option>
          </select>

          {has_drawings && (
            <button
              onClick={onClearAll}
              title="Clear all drawings"
              style={{
                fontSize: 11,
                padding: "4px 8px",
                background: is_dark ? "rgba(255,255,255,0.85)" : undefined,
              }}
            >
              🗑
            </button>
          )}
        </>
      )}
    </div>
  );
}


// =============================================================================
// Rotation toolbar (90° step buttons + slider for fine control + reset)
// =============================================================================

function RotationToolbar({
  rotation,
  onChange,
  variant = 'light',
}: {
  rotation: number;
  onChange: (r: number) => void;
  variant?: 'light' | 'dark';
}) {
  const is_dark = variant === 'dark';
  const bg_input = is_dark ? 'rgba(255,255,255,0.85)' : undefined;
  return (
    <div
      style={{
        display: 'flex',
        gap: 4,
        alignItems: 'center',
        background:
          rotation !== 0
            ? is_dark
              ? 'rgba(124, 58, 237, 0.3)'
              : 'var(--color-background-info)'
            : 'transparent',
        border: rotation !== 0
          ? '0.5px solid var(--color-border-info)'
          : '0.5px solid transparent',
        borderRadius: 6,
        padding: rotation !== 0 ? '4px 8px' : '0',
      }}
    >
      <button
        onClick={() => onChange(rotation - 90)}
        title="Rotate left 90°"
        style={{
          fontSize: 14,
          padding: '4px 8px',
          background: is_dark ? 'rgba(255,255,255,0.85)' : 'var(--color-background-primary)',
          border: '0.5px solid var(--color-border-tertiary)',
          borderRadius: 4,
          cursor: 'pointer',
          lineHeight: 1,
        }}
      >
        ↺
      </button>
      <button
        onClick={() => onChange(rotation + 90)}
        title="Rotate right 90°"
        style={{
          fontSize: 14,
          padding: '4px 8px',
          background: is_dark ? 'rgba(255,255,255,0.85)' : 'var(--color-background-primary)',
          border: '0.5px solid var(--color-border-tertiary)',
          borderRadius: 4,
          cursor: 'pointer',
          lineHeight: 1,
        }}
      >
        ↻
      </button>
      <input
        type="range"
        min={0}
        max={359}
        step={1}
        value={rotation}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        title={`Free rotation: ${rotation}°`}
        style={{
          width: 90,
          background: bg_input,
        }}
      />
      <span
        style={{
          fontSize: 11,
          minWidth: 36,
          fontFamily: 'var(--font-mono)',
          textAlign: 'right',
          color: is_dark ? '#fff' : 'var(--color-text-secondary)',
        }}
      >
        {Math.round(rotation)}°
      </span>
      {rotation !== 0 && (
        <button
          onClick={() => onChange(0)}
          title="Reset rotation"
          style={{
            fontSize: 11,
            padding: '4px 8px',
            background: is_dark ? 'rgba(255,255,255,0.85)' : undefined,
            border: '0.5px solid var(--color-border-tertiary)',
            borderRadius: 4,
            cursor: 'pointer',
          }}
        >
          ⟲
        </button>
      )}
    </div>
  );
}
