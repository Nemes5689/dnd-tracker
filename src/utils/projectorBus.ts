// Projector window sync using BroadcastChannel.
// DM window broadcasts state; projector listens and re-renders.
// Projector also can broadcast token moves back to DM, which applies
// them to the store.

import type { Encounter } from '@/types/app';

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
    if (this.channel) {
      this.channel.postMessage(msg);
    } else {
      try {
        // Append timestamp suffix to ensure storage event triggers
        // (storage event only fires when value actually changes)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(msg));
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
