import type { EffectType } from '@/types/app';

export interface EffectDefinition {
  id: EffectType;
  name: string;
  emoji: string;
  // Color used in the toolbar swatch + as the closed-shape stroke when this
  // effect is applied.
  primary_color: string;
  // CSS fill applied to the closed shape's interior (with 0.45 opacity).
  // Can be a gradient ID reference - we add the gradient defs to the SVG.
  fill: string;
  description: string;
}

export const EFFECTS: Record<EffectType, EffectDefinition> = {
  fire: {
    id: 'fire',
    name: 'Burning / Fire',
    emoji: '🔥',
    primary_color: '#ea580c', // orange-600
    fill: 'url(#effect-fire)',
    description:
      'Animated flickering orange-red. Use for Fireball, Wall of Fire, Flaming Sphere.',
  },
  smoke: {
    id: 'smoke',
    name: 'Black Mist / Smoke',
    emoji: '💨',
    primary_color: '#525252', // neutral-600
    fill: 'url(#effect-smoke)',
    description:
      'Dark smoky haze. Use for Fog Cloud, Stinking Cloud, smoke from a fire.',
  },
  poison: {
    id: 'poison',
    name: 'Poison Cloud',
    emoji: '☠️',
    primary_color: '#16a34a', // green-600
    fill: 'url(#effect-poison)',
    description: 'Sickly green vapor. Use for Cloudkill, poison gas.',
  },
  ice: {
    id: 'ice',
    name: 'Ice / Frost',
    emoji: '❄️',
    primary_color: '#0ea5e9', // sky-500
    fill: 'url(#effect-ice)',
    description: 'Frozen blue surface. Use for Ice Storm, Wall of Ice, Sleet.',
  },
  lightning: {
    id: 'lightning',
    name: 'Lightning',
    emoji: '⚡',
    primary_color: '#facc15', // yellow-400
    fill: 'url(#effect-lightning)',
    description: 'Crackling yellow energy. Use for Lightning Bolt, Call Lightning.',
  },
  web: {
    id: 'web',
    name: 'Web / Spider Web',
    emoji: '🕸️',
    primary_color: '#e5e7eb', // gray-200
    fill: 'url(#effect-web)',
    description:
      'White sticky strands. Use for Web spell, spider lairs, difficult terrain.',
  },
  acid: {
    id: 'acid',
    name: 'Acid',
    emoji: '🧪',
    primary_color: '#84cc16', // lime-500
    fill: 'url(#effect-acid)',
    description:
      'Bubbling yellow-green liquid. Use for Acid Splash, Vitriolic Sphere.',
  },
  holy: {
    id: 'holy',
    name: 'Holy / Radiant',
    emoji: '✨',
    primary_color: '#f59e0b', // amber-500
    fill: 'url(#effect-holy)',
    description:
      'Glowing golden light. Use for Spirit Guardians, Sacred Flame, divine spells.',
  },
  necrotic: {
    id: 'necrotic',
    name: 'Necrotic / Dark',
    emoji: '💀',
    primary_color: '#7c3aed', // violet-600
    fill: 'url(#effect-necrotic)',
    description:
      'Dark purple miasma. Use for Cloudkill (necrotic), Negative Energy Flood.',
  },
};

export const EFFECT_LIST: EffectDefinition[] = Object.values(EFFECTS);

/**
 * Returns the SVG <defs> block containing all gradient/pattern definitions
 * used by effects. Render this once inside the SVG that hosts effect shapes.
 */
export function EffectDefs() {
  return (
    <defs>
      {/* Fire: radial gradient, animated via CSS */}
      <radialGradient id="effect-fire" cx="50%" cy="55%" r="60%">
        <stop offset="0%" stopColor="#fde047" stopOpacity="0.85">
          <animate
            attributeName="stop-opacity"
            values="0.85;0.6;0.85"
            dur="1.2s"
            repeatCount="indefinite"
          />
        </stop>
        <stop offset="40%" stopColor="#f97316" stopOpacity="0.7" />
        <stop offset="80%" stopColor="#dc2626" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#7f1d1d" stopOpacity="0.35" />
      </radialGradient>

      {/* Smoke: layered grays */}
      <radialGradient id="effect-smoke" cx="50%" cy="50%" r="55%">
        <stop offset="0%" stopColor="#a3a3a3" stopOpacity="0.55">
          <animate
            attributeName="stop-opacity"
            values="0.55;0.4;0.55"
            dur="3s"
            repeatCount="indefinite"
          />
        </stop>
        <stop offset="60%" stopColor="#525252" stopOpacity="0.65" />
        <stop offset="100%" stopColor="#262626" stopOpacity="0.55" />
      </radialGradient>

      {/* Poison cloud: greenish */}
      <radialGradient id="effect-poison" cx="50%" cy="50%" r="55%">
        <stop offset="0%" stopColor="#a3e635" stopOpacity="0.55">
          <animate
            attributeName="stop-opacity"
            values="0.55;0.35;0.55"
            dur="2.4s"
            repeatCount="indefinite"
          />
        </stop>
        <stop offset="60%" stopColor="#16a34a" stopOpacity="0.55" />
        <stop offset="100%" stopColor="#14532d" stopOpacity="0.5" />
      </radialGradient>

      {/* Ice: cool blue */}
      <radialGradient id="effect-ice" cx="50%" cy="40%" r="65%">
        <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.65" />
        <stop offset="50%" stopColor="#7dd3fc" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#0369a1" stopOpacity="0.5" />
      </radialGradient>

      {/* Lightning: animated yellow flash */}
      <radialGradient id="effect-lightning" cx="50%" cy="50%" r="55%">
        <stop offset="0%" stopColor="#fef9c3" stopOpacity="0.85">
          <animate
            attributeName="stop-opacity"
            values="0.85;0.4;0.85;0.5;0.85"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </stop>
        <stop offset="50%" stopColor="#facc15" stopOpacity="0.7" />
        <stop offset="100%" stopColor="#ca8a04" stopOpacity="0.45" />
      </radialGradient>

      {/* Web: white pattern */}
      <pattern
        id="effect-web"
        patternUnits="userSpaceOnUse"
        width="40"
        height="40"
      >
        <rect width="40" height="40" fill="#f3f4f6" fillOpacity="0.45" />
        <path
          d="M 0 20 L 40 20 M 20 0 L 20 40 M 0 0 L 40 40 M 0 40 L 40 0"
          stroke="#fafafa"
          strokeWidth="1"
          strokeOpacity="0.85"
          fill="none"
        />
        <circle cx="20" cy="20" r="3" fill="#fafafa" fillOpacity="0.85" />
      </pattern>

      {/* Acid: yellow-green bubbling */}
      <radialGradient id="effect-acid" cx="50%" cy="50%" r="55%">
        <stop offset="0%" stopColor="#ecfccb" stopOpacity="0.7" />
        <stop offset="50%" stopColor="#84cc16" stopOpacity="0.65" />
        <stop offset="100%" stopColor="#365314" stopOpacity="0.5" />
      </radialGradient>

      {/* Holy: golden radiance */}
      <radialGradient id="effect-holy" cx="50%" cy="50%" r="55%">
        <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.9">
          <animate
            attributeName="stop-opacity"
            values="0.9;0.55;0.9"
            dur="2s"
            repeatCount="indefinite"
          />
        </stop>
        <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.7" />
        <stop offset="100%" stopColor="#d97706" stopOpacity="0.45" />
      </radialGradient>

      {/* Necrotic: dark purple */}
      <radialGradient id="effect-necrotic" cx="50%" cy="50%" r="55%">
        <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.55">
          <animate
            attributeName="stop-opacity"
            values="0.55;0.3;0.55"
            dur="2.6s"
            repeatCount="indefinite"
          />
        </stop>
        <stop offset="50%" stopColor="#7c3aed" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#2e1065" stopOpacity="0.55" />
      </radialGradient>
    </defs>
  );
}
