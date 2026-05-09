// Dice rolling utilities

export interface RollResult {
  total: number;
  rolls: number[];
  modifier: number;
  formula: string;
  // For d20 tests:
  natural?: number; // The d20 natural roll (before advantage/disadvantage)
  is_critical?: boolean;
  is_fumble?: boolean;
}

export type Advantage = 'normal' | 'advantage' | 'disadvantage';

/**
 * Roll a single die.
 */
export function rollDie(sides: number): number {
  return Math.floor(Math.random() * sides) + 1;
}

/**
 * Parse and roll a formula like "2d6+3" or "1d20", "1d8-1".
 * Supports +/- modifier, single dice term.
 */
export function rollFormula(formula: string): RollResult {
  const match = formula.replace(/\s/g, '').match(/^(\d+)d(\d+)([+-]\d+)?$/i);
  if (!match) {
    throw new Error(`Invalid roll formula: ${formula}`);
  }
  const count = parseInt(match[1], 10);
  const sides = parseInt(match[2], 10);
  const modifier = match[3] ? parseInt(match[3], 10) : 0;

  const rolls: number[] = [];
  for (let i = 0; i < count; i++) {
    rolls.push(rollDie(sides));
  }
  const sum = rolls.reduce((a, b) => a + b, 0);

  return {
    total: sum + modifier,
    rolls,
    modifier,
    formula,
  };
}

/**
 * Roll a d20 test with optional advantage/disadvantage.
 * Returns the natural roll (the d20 before modifiers).
 */
export function rollD20(modifier: number, mode: Advantage = 'normal'): RollResult {
  let natural: number;
  let rolls: number[];
  if (mode === 'advantage') {
    const a = rollDie(20);
    const b = rollDie(20);
    rolls = [a, b];
    natural = Math.max(a, b);
  } else if (mode === 'disadvantage') {
    const a = rollDie(20);
    const b = rollDie(20);
    rolls = [a, b];
    natural = Math.min(a, b);
  } else {
    natural = rollDie(20);
    rolls = [natural];
  }
  return {
    total: natural + modifier,
    rolls,
    modifier,
    formula: `1d20${modifier >= 0 ? '+' : ''}${modifier}${mode !== 'normal' ? ` (${mode})` : ''}`,
    natural,
    is_critical: natural === 20,
    is_fumble: natural === 1,
  };
}

/**
 * Format a roll for display.
 */
export function formatRoll(r: RollResult): string {
  const rollsText = r.rolls.length > 1 ? `[${r.rolls.join(', ')}]` : `${r.rolls[0]}`;
  const modText = r.modifier === 0 ? '' : ` ${r.modifier >= 0 ? '+' : ''}${r.modifier}`;
  return `${rollsText}${modText} = ${r.total}`;
}
