// Combat engine helpers: HP, conditions, action economy

import type { Combatant, AppliedCondition } from '@/types/app';

/**
 * Apply damage to a combatant. Damage hits temp HP first.
 */
export function applyDamage(c: Combatant, amount: number): Combatant {
  if (amount <= 0) return c;
  let remaining = amount;
  let new_temp = c.hp_temp;
  let new_hp = c.hp_current;

  if (new_temp > 0) {
    const absorbed = Math.min(new_temp, remaining);
    new_temp -= absorbed;
    remaining -= absorbed;
  }
  if (remaining > 0) {
    new_hp = Math.max(0, new_hp - remaining);
  }

  return { ...c, hp_current: new_hp, hp_temp: new_temp };
}

/**
 * Heal a combatant (cannot exceed hp_max).
 */
export function applyHealing(c: Combatant, amount: number): Combatant {
  if (amount <= 0) return c;
  const new_hp = Math.min(c.hp_max, c.hp_current + amount);
  return { ...c, hp_current: new_hp };
}

/**
 * Add temporary HP (does not stack — takes the higher value).
 */
export function applyTempHP(c: Combatant, amount: number): Combatant {
  return { ...c, hp_temp: Math.max(c.hp_temp, amount) };
}

/**
 * Reset action economy at the start of a combatant's turn.
 */
export function resetTurnActions(c: Combatant): Combatant {
  return {
    ...c,
    action_used: false,
    bonus_action_used: false,
    movement_used: 0,
    // Reactions reset at the start of YOUR turn (not used last turn).
    reaction_used: false,
  };
}

/**
 * Decrement condition durations at end of turn.
 * Returns: { combatant, expired_conditions[] }
 */
export function tickConditions(c: Combatant): {
  combatant: Combatant;
  expired: AppliedCondition[];
} {
  const expired: AppliedCondition[] = [];
  const remaining = c.conditions.filter((cond) => {
    if (cond.duration_type === 'fixed' && cond.remaining_rounds != null) {
      const new_remaining = cond.remaining_rounds - 1;
      if (new_remaining <= 0) {
        expired.push(cond);
        return false;
      }
      cond.remaining_rounds = new_remaining;
    }
    return true;
  });
  return { combatant: { ...c, conditions: remaining }, expired };
}

/**
 * Add a condition (no-op if already present).
 */
export function addCondition(c: Combatant, cond: AppliedCondition): Combatant {
  if (c.conditions.find((x) => x.condition_id === cond.condition_id)) {
    return c;
  }
  return { ...c, conditions: [...c.conditions, cond] };
}

/**
 * Remove a condition by id.
 */
export function removeCondition(c: Combatant, condition_id: string): Combatant {
  return { ...c, conditions: c.conditions.filter((x) => x.condition_id !== condition_id) };
}

/**
 * Sort combatants by initiative (descending), with stable order for ties.
 */
export function sortByInitiative(combatants: Combatant[]): Combatant[] {
  return [...combatants].sort((a, b) => {
    if (b.initiative !== a.initiative) return b.initiative - a.initiative;
    // Tie-break: players go first by default
    if (a.is_player !== b.is_player) return a.is_player ? -1 : 1;
    return 0;
  });
}
