// SRD 5.2 data types

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
  speed: Record<string, number>;
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
}

export interface Rule {
  id: string;
  name: string;
  category: string;
  description: string;
  source: string;
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
