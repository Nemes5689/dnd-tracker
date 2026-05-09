// Zustand store for ally/summon statblocks (friendly NPCs).
// Structurally identical to CustomMonster but conceptually friendly to PCs.

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Monster, MonsterAbilities, MonsterFeature, MonsterSpeed } from '@/types/srd';

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

const ability = (score = 10) => ({
  score,
  modifier: Math.floor((score - 10) / 2),
});

const default_abilities: MonsterAbilities = {
  str: ability(),
  dex: ability(),
  con: ability(),
  int: ability(),
  wis: ability(),
  cha: ability(),
};

const normalizeFeatureList = (value: unknown): MonsterFeature[] => {
  if (!Array.isArray(value)) return [];
  return value
    .filter(Boolean)
    .map((item: any) => ({
      name: typeof item?.name === 'string' ? item.name : '',
      description: typeof item?.description === 'string' ? item.description : '',
    }));
};

const normalizeStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === 'string');
};

const normalizeSpeed = (speed: unknown): MonsterSpeed => {
  if (typeof speed === 'string') return speed;
  if (typeof speed === 'number' && Number.isFinite(speed)) return { walk: speed };
  if (speed && typeof speed === 'object') return speed as MonsterSpeed;
  return { walk: 30 };
};

export const normalizeAlly = (raw: Partial<Ally> | Partial<Monster> | null | undefined): Ally => {
  const data: any = raw ?? {};
  const raw_abilities = data.abilities ?? {};
  const abilities: MonsterAbilities = {
    str: { ...default_abilities.str, ...(raw_abilities.str ?? {}) },
    dex: { ...default_abilities.dex, ...(raw_abilities.dex ?? {}) },
    con: { ...default_abilities.con, ...(raw_abilities.con ?? {}) },
    int: { ...default_abilities.int, ...(raw_abilities.int ?? {}) },
    wis: { ...default_abilities.wis, ...(raw_abilities.wis ?? {}) },
    cha: { ...default_abilities.cha, ...(raw_abilities.cha ?? {}) },
  };

  return {
    ...data,
    id:
      typeof data.id === 'string' && data.id.trim()
        ? data.id
        : `ally-${crypto.randomUUID().slice(0, 8)}`,
    name:
      typeof data.name === 'string' && data.name.trim()
        ? data.name
        : 'Unnamed ally',
    size: data.size ?? 'Medium',
    type: data.type ?? 'creature',
    subtype: data.subtype ?? null,
    alignment: data.alignment ?? null,
    ac: typeof data.ac === 'number' ? data.ac : 10,
    hp: typeof data.hp === 'number' ? data.hp : 1,
    hp_formula: data.hp_formula ?? null,
    speed: normalizeSpeed(data.speed),
    initiative: data.initiative ?? { modifier: 0, score: null },
    abilities,
    saves: data.saves ?? {},
    skills: data.skills ?? {},
    senses: data.senses ?? {},
    passive_perception:
      typeof data.passive_perception === 'number'
        ? data.passive_perception
        : 10 + abilities.wis.modifier,
    languages: normalizeStringArray(data.languages),
    cr: data.cr ?? '0',
    xp: typeof data.xp === 'number' ? data.xp : null,
    damage_resistances: normalizeStringArray(data.damage_resistances),
    damage_immunities: normalizeStringArray(data.damage_immunities),
    damage_vulnerabilities: normalizeStringArray(data.damage_vulnerabilities),
    condition_immunities: normalizeStringArray(data.condition_immunities),
    gear: normalizeStringArray(data.gear),
    traits: normalizeFeatureList(data.traits),
    actions: normalizeFeatureList(data.actions),
    bonus_actions: normalizeFeatureList(data.bonus_actions),
    reactions: normalizeFeatureList(data.reactions),
    legendary_actions: normalizeFeatureList(data.legendary_actions),
    source: 'Ally',
    is_ally: true,
    avatar: typeof data.avatar === 'string' ? data.avatar : undefined,
    gallery: normalizeStringArray(data.gallery),
    statblock_mode: data.statblock_mode === 'character' ? 'character' : 'monster',
    character_build: data.character_build,
    origin_selection: data.origin_selection && typeof data.origin_selection === 'object'
      ? {
          background_id: typeof data.origin_selection.background_id === 'string' ? data.origin_selection.background_id : undefined,
          species_id: typeof data.origin_selection.species_id === 'string' ? data.origin_selection.species_id : undefined,
          feat_ids: normalizeStringArray(data.origin_selection.feat_ids),
        }
      : undefined,
    spellcasting: data.spellcasting
      ? {
          ability: data.spellcasting.ability ?? 'wis',
          save_dc:
            typeof data.spellcasting.save_dc === 'number'
              ? data.spellcasting.save_dc
              : undefined,
          attack_bonus:
            typeof data.spellcasting.attack_bonus === 'number'
              ? data.spellcasting.attack_bonus
              : undefined,
          caster_level:
            typeof data.spellcasting.caster_level === 'number'
              ? data.spellcasting.caster_level
              : undefined,
          spell_ids: normalizeStringArray(data.spellcasting.spell_ids),
          notes:
            typeof data.spellcasting.notes === 'string'
              ? data.spellcasting.notes
              : undefined,
        }
      : undefined,
  };
};

export const useAlliesStore = create<AllyStore>()(
  persist(
    (set) => ({
      allies: [],

      addAlly: (ally) => {
        const id = ally.id || `ally-${crypto.randomUUID().slice(0, 8)}`;
        const full = normalizeAlly({ ...ally, id });
        set((s) => ({ allies: [...s.allies, full] }));
        return id;
      },

      updateAlly: (id, patch) =>
        set((s) => ({
          allies: s.allies.map((a) =>
            a.id === id ? normalizeAlly({ ...a, ...patch, id }) : a
          ),
        })),

      deleteAlly: (id) =>
        set((s) => ({ allies: s.allies.filter((a) => a.id !== id) })),

      duplicateFromMonster: (m, newName) => {
        const id = `ally-${crypto.randomUUID().slice(0, 8)}`;
        const copy = normalizeAlly({
          ...m,
          id,
          name: newName || `${m.name} (ally)`,
        });
        set((s) => ({ allies: [...s.allies, copy] }));
        return id;
      },
    }),
    {
      name: 'dnd-tracker-allies',
      version: 1,
      migrate: (persistedState: any) => ({
        ...persistedState,
        allies: Array.isArray(persistedState?.allies)
          ? persistedState.allies.map((ally: any) => normalizeAlly(ally))
          : [],
      }),
      merge: (persistedState: any, currentState) => ({
        ...currentState,
        ...persistedState,
        allies: Array.isArray(persistedState?.allies)
          ? persistedState.allies.map((ally: any) => normalizeAlly(ally))
          : currentState.allies,
      }),
    }
  )
);
