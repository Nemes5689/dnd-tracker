// D&D 2024 SRD skills, with their associated ability score.

export const SKILLS = [
  { id: 'acrobatics', name: 'Acrobatics', ability: 'dex' },
  { id: 'animal_handling', name: 'Animal Handling', ability: 'wis' },
  { id: 'arcana', name: 'Arcana', ability: 'int' },
  { id: 'athletics', name: 'Athletics', ability: 'str' },
  { id: 'deception', name: 'Deception', ability: 'cha' },
  { id: 'history', name: 'History', ability: 'int' },
  { id: 'insight', name: 'Insight', ability: 'wis' },
  { id: 'intimidation', name: 'Intimidation', ability: 'cha' },
  { id: 'investigation', name: 'Investigation', ability: 'int' },
  { id: 'medicine', name: 'Medicine', ability: 'wis' },
  { id: 'nature', name: 'Nature', ability: 'int' },
  { id: 'perception', name: 'Perception', ability: 'wis' },
  { id: 'performance', name: 'Performance', ability: 'cha' },
  { id: 'persuasion', name: 'Persuasion', ability: 'cha' },
  { id: 'religion', name: 'Religion', ability: 'int' },
  { id: 'sleight_of_hand', name: 'Sleight of Hand', ability: 'dex' },
  { id: 'stealth', name: 'Stealth', ability: 'dex' },
  { id: 'survival', name: 'Survival', ability: 'wis' },
] as const;

export type SkillId = (typeof SKILLS)[number]['id'];
export type AbilityKey = 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha';

export const ABILITIES: { id: AbilityKey; name: string }[] = [
  { id: 'str', name: 'Strength' },
  { id: 'dex', name: 'Dexterity' },
  { id: 'con', name: 'Constitution' },
  { id: 'int', name: 'Intelligence' },
  { id: 'wis', name: 'Wisdom' },
  { id: 'cha', name: 'Charisma' },
];

/** Calculate ability modifier from score: floor((score - 10) / 2) */
export function abilityMod(score: number): number {
  return Math.floor((score - 10) / 2);
}

/** Format a modifier with explicit sign (+3, -1, +0) */
export function formatMod(mod: number): string {
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

/** Standard PB by character level */
export function proficiencyBonusForLevel(level: number): number {
  if (level >= 17) return 6;
  if (level >= 13) return 5;
  if (level >= 9) return 4;
  if (level >= 5) return 3;
  return 2;
}
