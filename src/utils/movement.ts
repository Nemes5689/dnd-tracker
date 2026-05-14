import type { Combatant, MovementMode, MovementSpeeds, MovementSpeedOverride } from '@/types/app';
import type { MonsterSpeed } from '@/types/srd';

export const MOVEMENT_MODES: MovementMode[] = ['walk', 'climb', 'swim', 'fly', 'burrow'];

export const MOVEMENT_LABELS: Record<MovementMode, string> = {
  walk: 'Walk',
  climb: 'Climb',
  swim: 'Swim',
  fly: 'Fly',
  burrow: 'Burrow',
};

export function normalizeSpeedNumber(value: unknown, fallback = 0): number {
  const n = typeof value === 'number' ? value : parseInt(String(value ?? ''), 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

export function movementSpeedsFromMonsterSpeed(speed: MonsterSpeed | undefined): MovementSpeeds {
  if (!speed) return { walk: 30 };

  if (typeof speed === 'string') {
    const speeds: MovementSpeeds = {};
    const re = /(?:(walk|climb|swim|fly|burrow)\s*)?(\d+)\s*ft/gi;
    let match: RegExpExecArray | null;
    while ((match = re.exec(speed))) {
      const mode = (match[1]?.toLowerCase() ?? 'walk') as MovementMode;
      speeds[mode] = parseInt(match[2], 10);
    }
    return Object.keys(speeds).length ? speeds : { walk: 30 };
  }

  const speeds: MovementSpeeds = {};
  for (const mode of MOVEMENT_MODES) {
    const value = speed[mode];
    if (typeof value === 'number' && value > 0) speeds[mode] = value;
  }
  return Object.keys(speeds).length ? speeds : { walk: 30 };
}

export function formatMovementSpeeds(speeds: MovementSpeeds | undefined): string {
  const source = speeds && Object.keys(speeds).length ? speeds : { walk: 30 };
  const parts: string[] = [];
  for (const mode of MOVEMENT_MODES) {
    const value = source[mode];
    if (value !== undefined && value > 0) {
      parts.push(`${mode === 'walk' ? '' : `${MOVEMENT_LABELS[mode]} `}${value} ft`);
    }
  }
  return parts.length ? parts.join(', ') : '30 ft';
}

export function getBaseMovementSpeeds(combatant: Combatant | undefined): MovementSpeeds {
  if (!combatant) return { walk: 0 };
  const base = combatant.movement_speeds && Object.keys(combatant.movement_speeds).length
    ? combatant.movement_speeds
    : { walk: 30 };
  return { ...base };
}

export function getEffectiveMovementSpeeds(combatant: Combatant | undefined): MovementSpeeds {
  const base = getBaseMovementSpeeds(combatant);
  const override = combatant?.movement_speed_override?.speeds;
  if (!override) return base;
  return { ...base, ...override };
}

export function getMovementSpeed(combatant: Combatant | undefined, mode: MovementMode = 'walk'): number {
  const speeds = getEffectiveMovementSpeeds(combatant);
  return Math.max(0, speeds[mode] ?? (mode === 'walk' ? 30 : 0));
}

export function getRemainingMovementSpeed(
  combatant: Combatant | undefined,
  mode: MovementMode = 'walk'
): number {
  if (!combatant) return 0;
  return Math.max(0, getMovementSpeed(combatant, mode) - (combatant.movement_used ?? 0));
}

export function expireMovementOverrideOnTurnStart(
  combatant: Combatant,
): { combatant: Combatant; expired: MovementSpeedOverride | null } {
  const override = combatant.movement_speed_override;
  if (!override) return { combatant, expired: null };

  if (override.duration_type === 'manual') {
    return { combatant, expired: null };
  }

  if (override.duration_type === 'until_start_next_turn') {
    return {
      combatant: { ...combatant, movement_speed_override: undefined },
      expired: override,
    };
  }

  const remaining = Math.max(0, override.remaining_rounds ?? 1) - 1;
  if (remaining <= 0) {
    return {
      combatant: { ...combatant, movement_speed_override: undefined },
      expired: override,
    };
  }

  return {
    combatant: {
      ...combatant,
      movement_speed_override: { ...override, remaining_rounds: remaining },
    },
    expired: null,
  };
}
