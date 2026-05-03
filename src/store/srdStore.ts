// Zustand store for SRD reference data (monsters, spells, etc.)

import { create } from 'zustand';
import type { Monster, Spell, Condition, Rule, Equipment } from '@/types/srd';
import { loadSRDData } from '@/data/srdLoader';

interface SRDStore {
  loaded: boolean;
  loading: boolean;
  monsters: Monster[];
  spells: Spell[];
  conditions: Condition[];
  rules: Rule[];
  equipment: Equipment | null;
  load: () => Promise<void>;
}

export const useSRDStore = create<SRDStore>((set, get) => ({
  loaded: false,
  loading: false,
  monsters: [],
  spells: [],
  conditions: [],
  rules: [],
  equipment: null,
  load: async () => {
    if (get().loaded || get().loading) return;
    set({ loading: true });
    try {
      const data = await loadSRDData();
      set({ ...data, loaded: true, loading: false });
    } catch (e) {
      console.error('Failed to load SRD data:', e);
      set({ loading: false });
    }
  },
}));
