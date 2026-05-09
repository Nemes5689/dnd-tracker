// Zustand store for SRD reference data (monsters, spells, etc.)

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Monster, Spell, Condition, Rule, Equipment } from '@/types/srd';
import { loadSRDData } from '@/data/srdLoader';

function uniqueSpells(spells: Spell[]): Spell[] {
  const seen = new Set<string>();
  const out: Spell[] = [];
  for (const spell of spells) {
    if (!spell?.id || seen.has(spell.id)) continue;
    seen.add(spell.id);
    out.push(spell);
  }
  return out.sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));
}

function combineSpells(base: Spell[], custom: Spell[]): Spell[] {
  return uniqueSpells([...base, ...custom]);
}

function slugifySpellName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

export type CustomSpellInput = Omit<Spell, 'id' | 'source' | 'is_custom'> & {
  id?: string;
  source?: string;
};

interface SRDStore {
  loaded: boolean;
  loading: boolean;
  monsters: Monster[];
  spells: Spell[];
  base_spells: Spell[];
  custom_spells: Spell[];
  conditions: Condition[];
  rules: Rule[];
  equipment: Equipment | null;
  load: () => Promise<void>;
  addCustomSpell: (input: CustomSpellInput) => string;
  updateCustomSpell: (id: string, patch: Partial<CustomSpellInput>) => void;
  deleteCustomSpell: (id: string) => void;
}

function normalizeCustomSpell(input: CustomSpellInput, existingId?: string): Spell {
  const id = existingId ?? input.id ?? `custom-spell-${slugifySpellName(input.name) || 'unnamed'}-${crypto.randomUUID().slice(0, 6)}`;
  return {
    id,
    name: input.name?.trim() || 'Unnamed Spell',
    level: Math.max(0, Math.min(9, Number(input.level) || 0)),
    school: input.school?.trim() || 'Unknown',
    classes: Array.isArray(input.classes) ? input.classes.map((c) => c.trim()).filter(Boolean) : [],
    casting_time: input.casting_time?.trim() || null,
    ritual: !!input.ritual,
    range: input.range?.trim() || null,
    components: {
      verbal: !!input.components?.verbal,
      somatic: !!input.components?.somatic,
      material: input.components?.material?.trim() || null,
    },
    duration: input.duration?.trim() || null,
    concentration: !!input.concentration,
    description: input.description?.trim() || '',
    higher_levels: input.higher_levels?.trim() || null,
    cantrip_upgrade: input.cantrip_upgrade?.trim() || null,
    source: input.source?.trim() || 'Custom',
    is_custom: true,
  };
}

export const useSRDStore = create<SRDStore>()(
  persist(
    (set, get) => ({
      loaded: false,
      loading: false,
      monsters: [],
      spells: [],
      base_spells: [],
      custom_spells: [],
      conditions: [],
      rules: [],
      equipment: null,
      load: async () => {
        if (get().loaded || get().loading) return;
        set({ loading: true });
        try {
          const data = await loadSRDData();
          const custom = get().custom_spells.map((spell) => ({ ...spell, is_custom: true }));
          set({
            ...data,
            base_spells: data.spells,
            custom_spells: custom,
            spells: combineSpells(data.spells, custom),
            loaded: true,
            loading: false,
          });
        } catch (e) {
          console.error('Failed to load SRD data:', e);
          set({ loading: false });
        }
      },
      addCustomSpell: (input) => {
        const spell = normalizeCustomSpell(input);
        set((state) => {
          const custom_spells = uniqueSpells([...state.custom_spells, spell]);
          return {
            custom_spells,
            spells: combineSpells(state.base_spells, custom_spells),
          };
        });
        return spell.id;
      },
      updateCustomSpell: (id, patch) => {
        set((state) => {
          const current = state.custom_spells.find((spell) => spell.id === id);
          if (!current) return state;
          const updated = normalizeCustomSpell({ ...current, ...patch }, id);
          const custom_spells = uniqueSpells(state.custom_spells.map((spell) => (spell.id === id ? updated : spell)));
          return {
            custom_spells,
            spells: combineSpells(state.base_spells, custom_spells),
          };
        });
      },
      deleteCustomSpell: (id) => {
        set((state) => {
          const custom_spells = state.custom_spells.filter((spell) => spell.id !== id);
          return {
            custom_spells,
            spells: combineSpells(state.base_spells, custom_spells),
          };
        });
      },
    }),
    {
      name: 'dnd-tracker-custom-spells',
      version: 1,
      partialize: (state) => ({ custom_spells: state.custom_spells }),
      merge: (persistedState: any, currentState) => ({
        ...currentState,
        custom_spells: Array.isArray(persistedState?.custom_spells)
          ? persistedState.custom_spells.map((spell: Spell) => ({ ...spell, is_custom: true }))
          : Array.isArray(persistedState?.state?.custom_spells)
            ? persistedState.state.custom_spells.map((spell: Spell) => ({ ...spell, is_custom: true }))
            : currentState.custom_spells,
      }),
    }
  )
);
