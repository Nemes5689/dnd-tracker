// SRD 5.2 data types
import type { CharacterBuild } from '@/types/app';
import type { CharacterOriginSelection } from '@/types/origins';


export type MonsterSpeed = Record<string, number> | string;

export interface AbilityScore {
  score: number;
  modifier: number;
}

export interface MonsterAbilities {
  str: AbilityScore;
  dex: AbilityScore;
  con: AbilityScore;
  int: AbilityScore;
  wis: AbilityScore;
  cha: AbilityScore;
}

export interface MonsterFeature {
  name: string;
  description: string;
}

export interface MonsterSpellcasting {
  ability?: 'int' | 'wis' | 'cha';
  save_dc?: number;
  attack_bonus?: number;
  caster_level?: number;
  spell_ids: string[];
  notes?: string;
  // Optional structured spellcasting data (for character-mode allies / custom)
  cantrips?: string[];
  spells_known?: string[];
  slots?: import('./app').SpellSlotState[];
}

export interface Monster {
  id: string;
  name: string;
  size: string | null;
  type: string | null;
  subtype: string | null;
  alignment: string | null;
  ac: number | null;
  hp: number | null;
  hp_formula: string | null;
  speed: MonsterSpeed;
  initiative: { modifier: number; score: number | null } | null;
  abilities: MonsterAbilities;
  saves: Record<string, number>;
  skills: Record<string, number>;
  senses: Record<string, number>;
  passive_perception: number | null;
  languages: string[];
  cr: string | null;
  xp: number | null;
  damage_resistances: string[];
  damage_immunities: string[];
  damage_vulnerabilities: string[];
  condition_immunities: string[];
  gear: string[];
  traits: MonsterFeature[];
  actions: MonsterFeature[];
  bonus_actions: MonsterFeature[];
  reactions: MonsterFeature[];
  legendary_actions: MonsterFeature[];
  source: string;
  // Optional UX fields (used by ally / custom monster, not by SRD entries)
  avatar?: string; // base64 data URL, square crop, max 256x256
  gallery?: string[]; // base64 data URLs, larger images for lore/reference
  spellcasting?: MonsterSpellcasting; // optional spellcasting setup for custom monsters/allies
  statblock_mode?: 'monster' | 'character'; // custom monsters/allies can optionally behave like a character sheet
  character_build?: CharacterBuild; // optional class/subclass/multiclass setup for character-like creatures
  origin_selection?: CharacterOriginSelection; // optional background/species/feat setup for character-like creatures
  // Structured weapon attacks for one-click roll in combat (used when
  // statblock_mode === 'character' or for any structured combat data).
  weapon_attacks?: MonsterWeaponAttack[];
  proficiency_bonus?: number;
  skill_expertise?: string[];
  // Class-defined resources (Rage, Ki, etc) for character-mode allies
  resources?: import('./app').ResourceState[];
}

export interface MonsterWeaponAttack {
  name: string;
  attack_bonus: number;
  damage: string; // e.g. "1d8+3"
  damage_type: string;
  range: string; // e.g. "5 ft." or "60/120 ft."
  notes?: string;
}

export interface Spell {
  id: string;
  name: string;
  level: number;
  school: string;
  classes: string[];
  casting_time: string | null;
  ritual: boolean;
  range: string | null;
  components: {
    verbal: boolean;
    somatic: boolean;
    material: string | null;
  };
  duration: string | null;
  concentration: boolean;
  description: string;
  higher_levels: string | null;
  cantrip_upgrade: string | null;
  source: string;
  is_custom?: boolean;
}

export interface ConditionEffect {
  name: string;
  description: string;
}

export interface Condition {
  id: string;
  name: string;
  summary: string;
  effects: ConditionEffect[];
  source: string;
  is_custom?: boolean;
}

export interface Rule {
  id: string;
  name: string;
  category: string;
  description: string;
  source: string;
  is_custom?: boolean;
}

export interface Weapon {
  id: string;
  name: string;
  category: string; // Simple, Martial
  ranged: boolean;
  damage: string;
  damage_type: string;
  properties: string[];
  mastery: string | null;
  weight: string;
  cost: string;
}

export interface Armor {
  id: string;
  name: string;
  category: string; // Light, Medium, Heavy, Shield
  ac: string;
  strength_requirement: string | null;
  stealth_disadvantage: boolean;
  weight: string;
  cost: string;
}

export interface Equipment {
  weapons: Weapon[];
  weapon_properties: { id: string; name: string; description: string }[];
  weapon_mastery: { id: string; name: string; description: string }[];
  armor: Armor[];
  shields: Armor[];
  extras: Record<string, string>;
}
