import { useEffect, useState } from 'react';
import { BattleMap } from '@/components/combat/BattleMap';
import { TurnOrderBar } from '@/components/combat/TurnOrderBar';
import { getProjectorBus, type ProjectorMessage } from '@/utils/projectorBus';
import type { Encounter } from '@/types/app';

/**
 * The projector window. Loads at /projector route, listens for state updates
 * from the DM window via BroadcastChannel.
 *
 * Token movement IS allowed here — moves are broadcast back to the DM window,
 * which applies them to the store and re-broadcasts the new state.
 */
export function ProjectorView() {
  const [encounter, set_encounter] = useState<Encounter | null>(null);
  const [last_update, set_last_update] = useState<number>(0);

  useEffect(() => {
    const bus = getProjectorBus();

    const unsubscribe = bus.subscribe((msg: ProjectorMessage) => {
      if (msg.type === 'encounter_update') {
        set_encounter(msg.encounter);
        set_last_update(msg.timestamp);
      }
    });

    bus.send({ type: 'request_state', timestamp: Date.now() });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    document.title = encounter ? `🗺 ${encounter.name}` : 'D&D Projector';
  }, [encounter]);

  if (!encounter) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: '#000',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 16,
          fontSize: 18,
        }}
      >
        <div>🗺 Waiting for DM window...</div>
        <div style={{ fontSize: 13, opacity: 0.5 }}>
          Make sure the DM window is open in this same browser.
        </div>
      </div>
    );
  }

  const sorted = [...encounter.combatants].sort(
    (a, b) => b.initiative - a.initiative
  );
  const active_combatant = sorted[encounter.turn_index];
  const active_map = (encounter.maps ?? []).find(
    (m) => m.id === encounter.active_map_id
  );

  if (!active_map) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: '#000',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 18,
        }}
      >
        <div>No map selected</div>
      </div>
    );
  }

  const handleMoveToken = (combatant_id: string, x: number, y: number) => {
    // Send move request back to DM window via the bus.
    // DM applies it to store, then re-broadcasts updated encounter.
    const bus = getProjectorBus();
    bus.send({
      type: 'move_token',
      encounter_id: encounter.id,
      map_id: active_map.id,
      combatant_id,
      x,
      y,
      timestamp: Date.now(),
    });

    // Optimistic local update so the projector responds instantly
    set_encounter({
      ...encounter,
      maps: (encounter.maps ?? []).map((m) =>
        m.id === active_map.id
          ? {
              ...m,
              tokens: m.tokens.find((t) => t.combatant_id === combatant_id)
                ? m.tokens.map((t) =>
                    t.combatant_id === combatant_id ? { ...t, x, y } : t
                  )
                : [...m.tokens, { combatant_id, x, y }],
            }
          : m
      ),
    });
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#000',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Turn order in dedicated row above the map */}
      <div
        style={{
          padding: '12px 16px',
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
          variant="projector"
          token_styles={encounter.token_styles}
        />
      </div>

      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <BattleMap
          map={active_map}
          combatants={encounter.combatants}
          active_combatant_id={active_combatant?.id}
          token_styles={encounter.token_styles}
          show_grid={active_map.show_grid}
          fullscreen
          projector_mode
          show_token_names
          hide_monster_hp_numbers
          allow_token_movement
          onMoveToken={handleMoveToken}
        />

        {/* Last update indicator */}
        <div
          style={{
            position: 'absolute',
            bottom: 16,
            left: 16,
            padding: '6px 12px',
            background: 'rgba(0,0,0,0.6)',
            color: 'rgba(255,255,255,0.5)',
            borderRadius: 6,
            fontSize: 10,
            fontFamily: 'var(--font-mono)',
            pointerEvents: 'none',
          }}
        >
          Synced: {new Date(last_update).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}
