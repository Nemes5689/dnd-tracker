import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DND_2024_BACKGROUNDS, DND_2024_FEATS, DND_2024_SPECIES } from '@/data/originData';
import type { BackgroundInfo, FeatInfo, SpeciesInfo } from '@/types/origins';

const slugify = (value: string) => value.trim().toLowerCase().replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '');

export type CustomBackgroundInput = Omit<BackgroundInfo, 'id' | 'is_custom'> & { id?: string };
export type CustomSpeciesInput = Omit<SpeciesInfo, 'id' | 'is_custom'> & { id?: string };
export type CustomFeatInput = Omit<FeatInfo, 'id' | 'is_custom'> & { id?: string };

interface OriginHomebrewStore {
  custom_backgrounds: BackgroundInfo[];
  custom_species: SpeciesInfo[];
  custom_feats: FeatInfo[];
  addCustomBackground: (input: CustomBackgroundInput) => string;
  updateCustomBackground: (id: string, patch: Partial<CustomBackgroundInput>) => void;
  deleteCustomBackground: (id: string) => void;
  addCustomSpecies: (input: CustomSpeciesInput) => string;
  updateCustomSpecies: (id: string, patch: Partial<CustomSpeciesInput>) => void;
  deleteCustomSpecies: (id: string) => void;
  addCustomFeat: (input: CustomFeatInput) => string;
  updateCustomFeat: (id: string, patch: Partial<CustomFeatInput>) => void;
  deleteCustomFeat: (id: string) => void;
}

function makeId(prefix: string, name: string, existing?: string) {
  return existing ?? `${prefix}-${slugify(name) || 'unnamed'}-${crypto.randomUUID().slice(0, 6)}`;
}

function normalizeBackground(input: CustomBackgroundInput, existingId?: string): BackgroundInfo {
  return {
    id: makeId('custom-background', input.name, existingId ?? input.id),
    name: input.name?.trim() || 'Unnamed Background',
    source: input.source?.trim() || 'Custom',
    description: input.description?.trim() || '',
    ability_scores: input.ability_scores?.trim() || '',
    feat: input.feat?.trim() || '',
    skill_proficiencies: input.skill_proficiencies?.trim() || '',
    tool_proficiency: input.tool_proficiency?.trim() || '',
    equipment: input.equipment?.trim() || '',
    is_custom: true,
  };
}

function normalizeSpecies(input: CustomSpeciesInput, existingId?: string): SpeciesInfo {
  return {
    id: makeId('custom-species', input.name, existingId ?? input.id),
    name: input.name?.trim() || 'Unnamed Species',
    source: input.source?.trim() || 'Custom',
    description: input.description?.trim() || '',
    creature_type: input.creature_type?.trim() || 'Humanoid',
    size: input.size?.trim() || '',
    speed: input.speed?.trim() || '',
    traits: input.traits?.trim() || '',
    is_custom: true,
  };
}

function normalizeFeat(input: CustomFeatInput, existingId?: string): FeatInfo {
  return {
    id: makeId('custom-feat', input.name, existingId ?? input.id),
    name: input.name?.trim() || 'Unnamed Feat',
    source: input.source?.trim() || 'Custom',
    prerequisite: input.prerequisite?.trim() || '',
    description: input.description?.trim() || '',
    is_custom: true,
  };
}

export const useOriginHomebrewStore = create<OriginHomebrewStore>()(
  persist(
    (set) => ({
      custom_backgrounds: [],
      custom_species: [],
      custom_feats: [],
      addCustomBackground: (input) => {
        const item = normalizeBackground(input);
        set((state) => ({ custom_backgrounds: [...state.custom_backgrounds, item] }));
        return item.id;
      },
      updateCustomBackground: (id, patch) => set((state) => ({
        custom_backgrounds: state.custom_backgrounds.map((item) => item.id === id ? normalizeBackground({ ...item, ...patch }, id) : item),
      })),
      deleteCustomBackground: (id) => set((state) => ({ custom_backgrounds: state.custom_backgrounds.filter((item) => item.id !== id) })),
      addCustomSpecies: (input) => {
        const item = normalizeSpecies(input);
        set((state) => ({ custom_species: [...state.custom_species, item] }));
        return item.id;
      },
      updateCustomSpecies: (id, patch) => set((state) => ({
        custom_species: state.custom_species.map((item) => item.id === id ? normalizeSpecies({ ...item, ...patch }, id) : item),
      })),
      deleteCustomSpecies: (id) => set((state) => ({ custom_species: state.custom_species.filter((item) => item.id !== id) })),
      addCustomFeat: (input) => {
        const item = normalizeFeat(input);
        set((state) => ({ custom_feats: [...state.custom_feats, item] }));
        return item.id;
      },
      updateCustomFeat: (id, patch) => set((state) => ({
        custom_feats: state.custom_feats.map((item) => item.id === id ? normalizeFeat({ ...item, ...patch }, id) : item),
      })),
      deleteCustomFeat: (id) => set((state) => ({ custom_feats: state.custom_feats.filter((item) => item.id !== id) })),
    }),
    {
      name: 'dnd-tracker-origin-homebrew',
      version: 1,
      partialize: (state) => ({
        custom_backgrounds: state.custom_backgrounds,
        custom_species: state.custom_species,
        custom_feats: state.custom_feats,
      }),
    }
  )
);

export function getCombinedBackgrounds(custom = readPersistedOriginHomebrew().custom_backgrounds) {
  return [...DND_2024_BACKGROUNDS, ...custom];
}
export function getCombinedSpecies(custom = readPersistedOriginHomebrew().custom_species) {
  return [...DND_2024_SPECIES, ...custom];
}
export function getCombinedFeats(custom = readPersistedOriginHomebrew().custom_feats) {
  return [...DND_2024_FEATS, ...custom];
}
export function getBackgroundInfo(id?: string, custom = readPersistedOriginHomebrew().custom_backgrounds) {
  return getCombinedBackgrounds(custom).find((item) => item.id === id);
}
export function getSpeciesInfo(id?: string, custom = readPersistedOriginHomebrew().custom_species) {
  return getCombinedSpecies(custom).find((item) => item.id === id);
}
export function getFeatInfo(id?: string, custom = readPersistedOriginHomebrew().custom_feats) {
  return getCombinedFeats(custom).find((item) => item.id === id);
}

export function readPersistedOriginHomebrew() {
  try {
    const raw = localStorage.getItem('dnd-tracker-origin-homebrew');
    const parsed = raw ? JSON.parse(raw) : null;
    const state = parsed?.state ?? parsed;
    return {
      custom_backgrounds: Array.isArray(state?.custom_backgrounds) ? state.custom_backgrounds as BackgroundInfo[] : [],
      custom_species: Array.isArray(state?.custom_species) ? state.custom_species as SpeciesInfo[] : [],
      custom_feats: Array.isArray(state?.custom_feats) ? state.custom_feats as FeatInfo[] : [],
    };
  } catch {
    return { custom_backgrounds: [], custom_species: [], custom_feats: [] };
  }
}
