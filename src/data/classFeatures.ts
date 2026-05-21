import type { ActivatedFeatureState, ResourceState } from '@/types/app';

/**
 * Class-specific resources and activated features.
 *
 * These templates are used in Step 4 (the "From Class" auto-fill flow) to
 * generate the initial set of resources & activated_features for a character
 * based on class + level. For now this module just provides the data — the
 * UI integration happens in CharactersPage / AlliesPage.
 *
 * Each function returns a fresh array (with appropriate totals for the given
 * level) — callers may concat / customize.
 */

// =============================================================================
// Helpers
// =============================================================================

/** Charisma modifier (lazy: ability scores not threaded yet, default 3). */
function defaultCharismaMod(): number {
  return 3;
}
/** Default Constitution modifier (used as a baseline). */
function defaultConMod(): number {
  return 3;
}

// =============================================================================
// Barbarian — Rage
// =============================================================================

function barbarianRageUses(level: number): number {
  if (level >= 20) return 99; // unlimited
  if (level >= 17) return 6;
  if (level >= 12) return 5;
  if (level >= 6) return 4;
  if (level >= 3) return 3;
  return 2;
}

export function barbarianResources(level: number): ResourceState[] {
  return [
    {
      id: 'rage',
      name: 'Rage',
      total: barbarianRageUses(level),
      remaining: barbarianRageUses(level),
      recharge: 'long_rest',
      description:
        'On your turn, enter a Rage as a bonus action. While raging: advantage on Strength checks/saves, bonus damage on Strength melee attacks (1d4 increasing with level), resistance to bludgeoning/piercing/slashing damage. Lasts 10 rounds (1 minute) unless ended early, KO\'d, or Concentration broken by spell-like effects.',
    },
  ];
}

export function barbarianActivatedFeatures(level: number): ActivatedFeatureState[] {
  const features: ActivatedFeatureState[] = [];
  if (level >= 2) {
    features.push({
      id: 'reckless-attack',
      name: 'Reckless Attack',
      total: 0, // unlimited use, no tracker
      remaining: 0,
      recharge: 'turn',
      action_type: 'no_action',
      source: `Barbarian ${level}`,
      description:
        'On your first attack of the turn, declare Reckless Attack: gain advantage on melee Strength-based attack rolls this turn, but attack rolls against you have advantage until your next turn.',
    });
  }
  if (level >= 7) {
    features.push({
      id: 'feral-instinct',
      name: 'Feral Instinct',
      total: 0,
      remaining: 0,
      recharge: 'manual',
      action_type: 'no_action',
      source: `Barbarian ${level}`,
      description: 'Advantage on initiative rolls. Can act normally on a surprised turn if you enter a Rage as a free action at the start of it.',
    });
  }
  return features;
}

// =============================================================================
// Monk — Ki Points
// =============================================================================

export function monkResources(level: number): ResourceState[] {
  if (level < 2) return [];
  return [
    {
      id: 'ki',
      name: 'Ki Points',
      total: level,
      remaining: level,
      recharge: 'short_rest',
      description:
        'Ki Points fuel Monk features: Flurry of Blows (1 Ki, bonus action → 2 unarmed strikes), Patient Defense (1 Ki, bonus action → Dodge), Step of the Wind (1 Ki, bonus action → Disengage or Dash, double jump), Stunning Strike (1 Ki, on melee hit force a Con save vs Stun).',
    },
  ];
}

// =============================================================================
// Sorcerer — Sorcery Points
// =============================================================================

export function sorcererResources(level: number): ResourceState[] {
  if (level < 2) return [];
  return [
    {
      id: 'sorcery_points',
      name: 'Sorcery Points',
      total: level,
      remaining: level,
      recharge: 'long_rest',
      description:
        'Sorcery Points fuel Metamagic options (Careful, Distant, Empowered, Extended, Heightened, Quickened, Seeking, Subtle, Transmuted, Twinned Spell). You may also convert points to spell slots or vice versa via Flexible Casting.',
    },
  ];
}

// =============================================================================
// Fighter — Action Surge, Second Wind, Indomitable
// =============================================================================

function fighterActionSurgeUses(level: number): number {
  if (level >= 17) return 2;
  if (level >= 2) return 1;
  return 0;
}
function fighterIndomitableUses(level: number): number {
  if (level >= 17) return 3;
  if (level >= 13) return 2;
  if (level >= 9) return 1;
  return 0;
}

export function fighterActivatedFeatures(level: number): ActivatedFeatureState[] {
  const features: ActivatedFeatureState[] = [];
  if (level >= 1) {
    features.push({
      id: 'second-wind',
      name: 'Second Wind',
      total: 1,
      remaining: 1,
      recharge: 'short_rest',
      action_type: 'bonus_action',
      source: `Fighter ${level}`,
      description: `Regain 1d10 + ${level} hit points as a bonus action. Recharges on a short or long rest.`,
    });
  }
  if (level >= 2) {
    features.push({
      id: 'action-surge',
      name: 'Action Surge',
      total: fighterActionSurgeUses(level),
      remaining: fighterActionSurgeUses(level),
      recharge: 'short_rest',
      action_type: 'free',
      source: `Fighter ${level}`,
      description:
        'On your turn, take one additional action (not a bonus action) and possibly move. Recharges on a short or long rest.',
    });
  }
  if (level >= 9) {
    features.push({
      id: 'indomitable',
      name: 'Indomitable',
      total: fighterIndomitableUses(level),
      remaining: fighterIndomitableUses(level),
      recharge: 'long_rest',
      action_type: 'reaction',
      source: `Fighter ${level}`,
      description:
        'Reroll a failed saving throw. You must use the new roll. Recharges on a long rest.',
    });
  }
  return features;
}

// =============================================================================
// Cleric — Channel Divinity
// =============================================================================

function clericChannelDivinityUses(level: number): number {
  if (level >= 18) return 3;
  if (level >= 6) return 2;
  if (level >= 2) return 1;
  return 0;
}

export function clericActivatedFeatures(level: number): ActivatedFeatureState[] {
  const features: ActivatedFeatureState[] = [];
  if (level >= 2) {
    features.push({
      id: 'channel-divinity',
      name: 'Channel Divinity',
      total: clericChannelDivinityUses(level),
      remaining: clericChannelDivinityUses(level),
      recharge: 'short_rest',
      action_type: 'action',
      source: `Cleric ${level}`,
      description:
        'Channel divine energy directly from your deity. All clerics know Turn Undead (presents a holy symbol; each undead within 30 ft makes a Wis save or is frightened/turned for 1 minute). Subclass-specific Channel Divinity options also use these uses.',
    });
  }
  return features;
}

// =============================================================================
// Paladin — Channel Divinity, Lay on Hands, Divine Sense
// =============================================================================

export function paladinResources(level: number): ResourceState[] {
  if (level < 1) return [];
  return [
    {
      id: 'lay-on-hands',
      name: 'Lay on Hands (HP pool)',
      total: level * 5,
      remaining: level * 5,
      recharge: 'long_rest',
      description: `Your healing pool is ${level * 5} HP. As an action, touch a creature and spend any amount of HP from the pool to heal them. Or, spend 5 HP to cure one disease or neutralize one poison.`,
    },
  ];
}

export function paladinActivatedFeatures(level: number): ActivatedFeatureState[] {
  const features: ActivatedFeatureState[] = [];
  if (level >= 1) {
    features.push({
      id: 'divine-sense',
      name: 'Divine Sense',
      total: 1 + defaultCharismaMod(),
      remaining: 1 + defaultCharismaMod(),
      recharge: 'long_rest',
      action_type: 'action',
      source: `Paladin ${level}`,
      description:
        'Open your awareness to detect strong evil and good. Within 60 feet, you know location and type of any celestial, fiend, or undead that isn\'t behind total cover. You also detect any consecrated or desecrated places or objects. Uses = 1 + CHA mod.',
    });
  }
  if (level >= 3) {
    features.push({
      id: 'channel-divinity-paladin',
      name: 'Channel Divinity',
      total: 1,
      remaining: 1,
      recharge: 'short_rest',
      action_type: 'action',
      source: `Paladin ${level}`,
      description:
        'Channel Divinity to power a subclass-specific effect (e.g. Sacred Weapon, Turn the Unholy). Recharges on a short or long rest.',
    });
  }
  return features;
}

// =============================================================================
// Bard — Bardic Inspiration
// =============================================================================

export function bardActivatedFeatures(level: number): ActivatedFeatureState[] {
  const features: ActivatedFeatureState[] = [];
  if (level >= 1) {
    const die = level >= 15 ? 'd12' : level >= 10 ? 'd10' : level >= 5 ? 'd8' : 'd6';
    features.push({
      id: 'bardic-inspiration',
      name: `Bardic Inspiration (${die})`,
      total: Math.max(1, defaultCharismaMod()),
      remaining: Math.max(1, defaultCharismaMod()),
      // 5th level and later it recharges on short rest; before that on long rest.
      recharge: level >= 5 ? 'short_rest' : 'long_rest',
      action_type: 'bonus_action',
      source: `Bard ${level}`,
      description: `As a bonus action, give another creature within 60 ft a Bardic Inspiration die (${die}). The creature can add the rolled value to one ability check, attack roll, or saving throw it makes within the next 10 minutes. Uses per rest = CHA mod (minimum 1).`,
    });
  }
  if (level >= 2) {
    features.push({
      id: 'song-of-rest',
      name: 'Song of Rest',
      total: 0,
      remaining: 0,
      recharge: 'manual',
      action_type: 'no_action',
      source: `Bard ${level}`,
      description:
        'During a short rest, you and friendly creatures who spend Hit Dice regain extra HP from a soothing performance. Extra die scales with level (1d6 → 1d8 → 1d10 → 1d12).',
    });
  }
  return features;
}

// =============================================================================
// Druid — Wild Shape
// =============================================================================

function druidWildShapeUses(level: number): number {
  if (level >= 20) return 99;
  if (level >= 2) return 2;
  return 0;
}

export function druidActivatedFeatures(level: number): ActivatedFeatureState[] {
  const features: ActivatedFeatureState[] = [];
  if (level >= 2) {
    features.push({
      id: 'wild-shape',
      name: 'Wild Shape',
      total: druidWildShapeUses(level),
      remaining: druidWildShapeUses(level),
      recharge: 'short_rest',
      action_type: 'action',
      source: `Druid ${level}`,
      description:
        'Assume the shape of a Beast you have seen. CR limit and movement options scale with level (CR 1/4 → 1/2 → 1, can use swimming/flying speeds at higher levels). You retain your INT, WIS, CHA, mental features. Lasts up to half your druid level hours.',
    });
  }
  return features;
}

// =============================================================================
// Warlock — Eldritch Invocations (no uses, always-on)
// =============================================================================
// Warlock spell slots already tracked separately; nothing tracker-specific here.

// =============================================================================
// Wizard — Arcane Recovery
// =============================================================================

export function wizardActivatedFeatures(level: number): ActivatedFeatureState[] {
  if (level < 1) return [];
  return [
    {
      id: 'arcane-recovery',
      name: 'Arcane Recovery',
      total: 1,
      remaining: 1,
      recharge: 'long_rest',
      action_type: 'no_action',
      source: `Wizard ${level}`,
      description: `Once per day on a short rest, choose expended spell slots to recover with combined levels ≤ ⌈${level}/2⌉ = ${Math.ceil(level / 2)}, none of which can be 6th level or higher.`,
    },
  ];
}

// =============================================================================
// Rogue — Sneak Attack (passive), no use tracker; here for completeness.
// =============================================================================
// (Rogue features are mostly always-on or per turn passive — no tracker needed.)

// =============================================================================
// Ranger — Favored Foe / Hunter's Mark / Spell slots already tracked.
// =============================================================================
// Most uses are via spell slots; no extra tracker.

// =============================================================================
// Artificer — Flash of Genius
// =============================================================================

export function artificerActivatedFeatures(level: number): ActivatedFeatureState[] {
  const features: ActivatedFeatureState[] = [];
  if (level >= 7) {
    features.push({
      id: 'flash-of-genius',
      name: 'Flash of Genius',
      total: Math.max(1, defaultCharismaMod()), // actually INT mod, using default for now
      remaining: Math.max(1, defaultCharismaMod()),
      recharge: 'long_rest',
      action_type: 'reaction',
      source: `Artificer ${level}`,
      description:
        'When you or another creature you can see within 30 ft makes an ability check or saving throw, use your reaction to add your Intelligence modifier to the roll. Uses per long rest = INT mod (min 1).',
    });
  }
  if (level >= 11) {
    features.push({
      id: 'spell-storing-item',
      name: 'Spell-Storing Item',
      total: Math.max(2, defaultConMod() * 2),
      remaining: Math.max(2, defaultConMod() * 2),
      recharge: 'long_rest',
      action_type: 'action',
      source: `Artificer ${level}`,
      description:
        'After a long rest, store a 1st- or 2nd-level artificer spell in an item. A creature holding it can produce the spell\'s effect as an action. Uses per stored spell = 2 × your INT mod (minimum 2), until reused.',
    });
  }
  return features;
}

// =============================================================================
// Class lookup table
// =============================================================================

/**
 * For a given class ID and level, return the suggested resources + activated
 * features. Returns empty arrays for classes without trackable features.
 */
export function templateForClass(
  class_id: string,
  level: number
): { resources: ResourceState[]; activated_features: ActivatedFeatureState[] } {
  switch (class_id) {
    case 'barbarian':
      return {
        resources: barbarianResources(level),
        activated_features: barbarianActivatedFeatures(level),
      };
    case 'monk':
      return { resources: monkResources(level), activated_features: [] };
    case 'sorcerer':
      return { resources: sorcererResources(level), activated_features: [] };
    case 'fighter':
      return { resources: [], activated_features: fighterActivatedFeatures(level) };
    case 'cleric':
      return { resources: [], activated_features: clericActivatedFeatures(level) };
    case 'paladin':
      return {
        resources: paladinResources(level),
        activated_features: paladinActivatedFeatures(level),
      };
    case 'bard':
      return { resources: [], activated_features: bardActivatedFeatures(level) };
    case 'druid':
      return { resources: [], activated_features: druidActivatedFeatures(level) };
    case 'wizard':
      return { resources: [], activated_features: wizardActivatedFeatures(level) };
    case 'artificer':
      return { resources: [], activated_features: artificerActivatedFeatures(level) };
    default:
      return { resources: [], activated_features: [] };
  }
}
