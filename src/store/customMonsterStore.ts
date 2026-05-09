// Zustand store for custom (homebrew) monsters
// Persists to localStorage. Custom monsters are global by default
// (visible across all campaigns) but each one tracks an optional campaign_id.

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Monster } from '@/types/srd';

export interface CustomMonster extends Monster {
  is_custom: true;
  campaign_id?: string; // if set, only visible in that campaign
}

interface CustomMonsterStore {
  monsters: CustomMonster[];
  addMonster: (monster: Omit<CustomMonster, 'is_custom' | 'source'>) => string;
  updateMonster: (id: string, patch: Partial<CustomMonster>) => void;
  deleteMonster: (id: string) => void;
  duplicateFromSRD: (srdMonster: Monster, newName?: string) => string;
}

export const useCustomMonsterStore = create<CustomMonsterStore>()(
  persist(
    (set) => ({
      monsters: [],

      addMonster: (monster) => {
        const id = monster.id || `custom-${crypto.randomUUID().slice(0, 8)}`;
        const full: CustomMonster = {
          ...monster,
          id,
          is_custom: true,
          source: 'Custom',
        };
        set((s) => ({ monsters: [...s.monsters, full] }));
        return id;
      },

      updateMonster: (id, patch) =>
        set((s) => ({
          monsters: s.monsters.map((m) => (m.id === id ? { ...m, ...patch } : m)),
        })),

      deleteMonster: (id) =>
        set((s) => ({ monsters: s.monsters.filter((m) => m.id !== id) })),

      duplicateFromSRD: (srdMonster, newName) => {
        const id = `custom-${crypto.randomUUID().slice(0, 8)}`;
        const copy: CustomMonster = {
          ...srdMonster,
          id,
          name: newName || `${srdMonster.name} (custom)`,
          is_custom: true,
          source: 'Custom',
        };
        set((s) => ({ monsters: [...s.monsters, copy] }));
        return id;
      },
    }),
    { name: 'dnd-tracker-custom-monsters' }
  )
);
