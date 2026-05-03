// Zustand store for ally/summon statblocks (friendly NPCs).
// Structurally identical to CustomMonster but conceptually friendly to PCs.

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Monster } from '@/types/srd';

export interface Ally extends Monster {
  is_ally: true;
}

interface AllyStore {
  allies: Ally[];
  addAlly: (ally: Omit<Ally, 'is_ally' | 'source'>) => string;
  updateAlly: (id: string, patch: Partial<Ally>) => void;
  deleteAlly: (id: string) => void;
  duplicateFromMonster: (m: Monster, newName?: string) => string;
}

export const useAlliesStore = create<AllyStore>()(
  persist(
    (set) => ({
      allies: [],

      addAlly: (ally) => {
        const id = ally.id || `ally-${crypto.randomUUID().slice(0, 8)}`;
        const full: Ally = {
          ...ally,
          id,
          is_ally: true,
          source: 'Ally',
        };
        set((s) => ({ allies: [...s.allies, full] }));
        return id;
      },

      updateAlly: (id, patch) =>
        set((s) => ({
          allies: s.allies.map((a) => (a.id === id ? { ...a, ...patch } : a)),
        })),

      deleteAlly: (id) =>
        set((s) => ({ allies: s.allies.filter((a) => a.id !== id) })),

      duplicateFromMonster: (m, newName) => {
        const id = `ally-${crypto.randomUUID().slice(0, 8)}`;
        const copy: Ally = {
          ...m,
          id,
          name: newName || `${m.name} (ally)`,
          is_ally: true,
          source: 'Ally',
        };
        set((s) => ({ allies: [...s.allies, copy] }));
        return id;
      },
    }),
    { name: 'dnd-tracker-allies' }
  )
);
