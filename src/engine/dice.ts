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
 * Parse and roll a formula like "2d6+3", "1d8-1", or compound "1d8+2d6+3".
 */
export function rollFormula(formula: string): RollResult {
  const cleaned = formula.replace(/\s/g, '').toLowerCase();
  if (!cleaned) throw new Error('Empty roll formula');
  const term_re = /([+-]?\d+(?:d\d+)?)/g;
  const tokens = cleaned.match(term_re)?.filter(Boolean) ?? [];
  if (tokens.length === 0) throw new Error(`Invalid roll formula: ${formula}`);

  const all_rolls: number[] = [];
  let modifier = 0;
  let total = 0;

  for (const tok of tokens) {
    if (tok.includes('d')) {
      const m = tok.match(/^([+-]?)(\d+)d(\d+)$/);
      if (!m) throw new Error(`Invalid dice term: ${tok}`);
      const sign = m[1] === '-' ? -1 : 1;
      const count = parseInt(m[2], 10);
      const sides = parseInt(m[3], 10);
      if (count <= 0 || sides <= 0) throw new Error(`Invalid dice term: ${tok}`);
      for (let i = 0; i < count; i++) {
        const r = rollDie(sides);
        all_rolls.push(r);
        total += sign * r;
      }
    } else {
      const v = parseInt(tok, 10);
      if (isNaN(v)) throw new Error(`Invalid modifier term: ${tok}`);
      modifier += v;
      total += v;
    }
  }

  return { total, rolls: all_rolls, modifier, formula };
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
