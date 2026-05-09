export type AbilityRollKey = 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha';

export interface AbilityRollResult {
  dice: number[];
  dropped: number;
  total: number;
}

export type AbilityRollSet = Record<AbilityRollKey, AbilityRollResult>;

export const ABILITY_ROLL_KEYS: AbilityRollKey[] = ['str', 'dex', 'con', 'int', 'wis', 'cha'];

export const ABILITY_ROLL_LABELS: Record<AbilityRollKey, string> = {
  str: 'STR',
  dex: 'DEX',
  con: 'CON',
  int: 'INT',
  wis: 'WIS',
  cha: 'CHA',
};

export function rollD6(): number {
  return Math.floor(Math.random() * 6) + 1;
}

export function rollAbilityScore(): AbilityRollResult {
  const dice = [rollD6(), rollD6(), rollD6(), rollD6()];
  const sorted = [...dice].sort((a, b) => a - b);
  const dropped = sorted[0];
  const total = sorted.slice(1).reduce((sum, die) => sum + die, 0);
  return { dice, dropped, total };
}

export function rollAbilitySet(): AbilityRollSet {
  return ABILITY_ROLL_KEYS.reduce((acc, key) => {
    acc[key] = rollAbilityScore();
    return acc;
  }, {} as AbilityRollSet);
}

export function formatAbilityRoll(result: AbilityRollResult): string {
  const kept = [...result.dice].sort((a, b) => a - b).slice(1);
  return `${result.dice.join(', ')} → drop ${result.dropped}; ${kept.join(' + ')} = ${result.total}`;
}

export function formatAbilityRollSet(rolls: AbilityRollSet): string {
  return ABILITY_ROLL_KEYS
    .map((key) => `${ABILITY_ROLL_LABELS[key]} ${formatAbilityRoll(rolls[key])}`)
    .join(' | ');
}
