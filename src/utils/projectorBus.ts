// Projector window sync using BroadcastChannel.
// DM window broadcasts state; projector listens and re-renders.
// Projector also can broadcast token moves back to DM, which applies
// them to the store.

import type { Encounter } from '@/types/app';
import { resolveTokenStyles } from './tokenAppearance';

const CHANNEL_NAME = 'dnd-tracker-projector';
const STORAGE_KEY = 'dnd-tracker-projector-bus';

export type ProjectorMessage =
  | {
      type: 'encounter_update';
      encounter: Encounter;
      timestamp: number;
    }
  | {
      type: 'request_state';
      timestamp: number;
    }
  | {
      type: 'move_token';
      encounter_id: string;
      map_id: string;
      combatant_id: string;
      x: number;
      y: number;
      timestamp: number;
    };

/** Build the minimum encounter shape needed by the public projector UI.
 * Never send DM notes, source data, precise enemy HP, or inactive map images
 * across the window boundary. The view still receives coarse enemy health so
 * its existing status indicator can work without exposing exact totals.
 */
export function createProjectorSnapshot(encounter: Encounter): Encounter {
  const initiativeOrder = [...encounter.combatants].sort((a, b) => b.initiative - a.initiative);
  const visibleOrder = initiativeOrder.filter((combatant) => !combatant.hidden_from_players);
  const currentCombatant = initiativeOrder[encounter.turn_index];
  let projectedActiveId = currentCombatant && !currentCombatant.hidden_from_players
    ? currentCombatant.id
    : undefined;
  if (!projectedActiveId && initiativeOrder.length) {
    for (let offset = 1; offset <= initiativeOrder.length; offset += 1) {
      const candidate = initiativeOrder[(encounter.turn_index + offset) % initiativeOrder.length];
      if (!candidate.hidden_from_players) {
        projectedActiveId = candidate.id;
        break;
      }
    }
  }
  const projectedTurnIndex = projectedActiveId
    ? visibleOrder.findIndex(({ id }) => id === projectedActiveId)
    : 0;
  const visibleIds = new Set(visibleOrder.map(({ id }) => id));
  const combatants = visibleOrder.map((combatant) => {
    const hpRatio = combatant.hp_max > 0 ? combatant.hp_current / combatant.hp_max : 0;
    const coarseHp = combatant.hp_current <= 0 ? 0 : hpRatio >= 0.75 ? 100 : hpRatio >= 0.5 ? 70 : hpRatio >= 0.25 ? 40 : 10;
    return {
      id: combatant.id,
      name: combatant.name,
      source_type: combatant.source_type,
      source_id: '',
      hp_max: 100,
      hp_current: combatant.is_player || combatant.is_ally ? 100 : coarseHp,
      hp_temp: 0,
      ac: 0,
      initiative: combatant.initiative,
      conditions: [],
      is_player: combatant.is_player,
      is_ally: combatant.is_ally,
      size: combatant.size,
      action_used: false,
      bonus_action_used: false,
      reaction_used: false,
      movement_used: 0,
      movement_speeds: {},
      has_flanking: false,
      cover: 'none' as const,
    };
  });
  const activeMap = encounter.maps?.find((map) => map.id === encounter.active_map_id);
  const maps = activeMap ? [{
    ...activeMap,
    tokens: activeMap.tokens.filter((token) => visibleIds.has(token.combatant_id)),
    // Map drawings are intentional player-facing tactical overlays.
    drawings: activeMap.drawings ?? [],
  }] : [];

  return {
    id: encounter.id,
    campaign_id: '',
    name: encounter.name,
    status: encounter.status,
    combatants,
    round: encounter.round,
    turn_index: Math.max(0, projectedTurnIndex),
    log: [],
    maps,
    active_map_id: activeMap?.id ?? null,
    token_styles: resolveTokenStyles(encounter).filter(({ combatant_id }) => visibleIds.has(combatant_id)).map(({ combatant_id, color, avatar, initial }) => ({
      combatant_id, color, avatar, initial,
    })),
    created_at: encounter.created_at,
    updated_at: encounter.updated_at,
  };
}

class ProjectorBus {
  private channel: BroadcastChannel | null = null;
  private listeners = new Set<(msg: ProjectorMessage) => void>();

  constructor() {
    if (typeof BroadcastChannel !== 'undefined') {
      this.channel = new BroadcastChannel(CHANNEL_NAME);
      this.channel.onmessage = (e) => this.handle(e.data);
    } else {
      window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY && e.newValue) {
          try {
            this.handle(JSON.parse(e.newValue));
          } catch {
            // ignore
          }
        }
      });
    }
  }

  send(msg: ProjectorMessage) {
    const outgoing = msg.type === 'encounter_update'
      ? { ...msg, encounter: createProjectorSnapshot(msg.encounter) }
      : msg;
    if (this.channel) {
      this.channel.postMessage(outgoing);
    } else {
      try {
        // Append timestamp suffix to ensure storage event triggers
        // (storage event only fires when value actually changes)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(outgoing));
      } catch {
        // ignore
      }
    }
  }

  subscribe(fn: (msg: ProjectorMessage) => void) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private handle(msg: ProjectorMessage) {
    this.listeners.forEach((fn) => fn(msg));
  }
}

let bus_instance: ProjectorBus | null = null;

export function getProjectorBus(): ProjectorBus {
  if (!bus_instance) bus_instance = new ProjectorBus();
  return bus_instance;
}

/**
 * Categorize HP into a stylized label (for projector display).
 */
export function stylizedHPLabel(
  current: number,
  max: number
): {
  label: string;
  color: string;
} {
  if (current <= 0) return { label: 'Dead', color: '#374151' };
  const pct = current / max;
  if (pct >= 0.75) return { label: 'Healthy', color: '#22C55E' };
  if (pct >= 0.5) return { label: 'Wounded', color: '#F59E0B' };
  if (pct >= 0.25) return { label: 'Bloodied', color: '#EF4444' };
  return { label: 'Near death', color: '#991B1B' };
}
