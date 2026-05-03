import type { Combatant, CombatantTokenStyle } from '@/types/app';

interface Props {
  combatants: Combatant[]; // already in initiative order (sorted)
  active_index: number;
  round: number;
  variant?: 'dm' | 'projector'; // projector = larger, more visible
  token_styles?: CombatantTokenStyle[]; // optional avatars/colors
}

/**
 * Horizontal bar showing the turn order with active + upcoming combatants.
 */
export function TurnOrderBar({
  combatants,
  active_index,
  round,
  variant = 'dm',
  token_styles = [],
}: Props) {
  if (combatants.length === 0) return null;

  // Build a window of turns: active + next 4
  const visible_count = variant === 'projector' ? 6 : 5;
  const visible: { combatant: Combatant; relative: 'active' | 'upcoming' }[] = [];

  for (let i = 0; i < visible_count; i++) {
    const idx = (active_index + i) % combatants.length;
    visible.push({
      combatant: combatants[idx],
      relative: i === 0 ? 'active' : 'upcoming',
    });
  }

  // Look up token style by combatant id
  const style_map: Record<string, CombatantTokenStyle> = {};
  token_styles.forEach((s) => {
    style_map[s.combatant_id] = s;
  });

  const is_proj = variant === 'projector';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: is_proj ? 12 : 8,
        padding: is_proj ? '14px 20px' : '8px 12px',
        background: is_proj
          ? 'rgba(0, 0, 0, 0.85)'
          : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(8px)',
        borderRadius: is_proj ? 12 : 8,
        border: is_proj ? '1px solid rgba(255,255,255,0.2)' : '0.5px solid var(--color-border-tertiary)',
        boxShadow: is_proj ? '0 4px 16px rgba(0,0,0,0.5)' : '0 2px 6px rgba(0,0,0,0.1)',
      }}
    >
      <div
        style={{
          fontSize: is_proj ? 13 : 10,
          textTransform: 'uppercase',
          letterSpacing: 1,
          color: is_proj ? 'rgba(255,255,255,0.7)' : 'var(--color-text-tertiary)',
          fontWeight: 600,
          paddingRight: is_proj ? 14 : 8,
          borderRight: is_proj
            ? '1px solid rgba(255,255,255,0.2)'
            : '0.5px solid var(--color-border-tertiary)',
        }}
      >
        Round {round}
      </div>

      {visible.map((entry, i) => (
        <TurnEntry
          key={`${entry.combatant.id}-${i}`}
          combatant={entry.combatant}
          style={style_map[entry.combatant.id]}
          is_active={entry.relative === 'active'}
          is_proj={is_proj}
          position={i}
        />
      ))}
    </div>
  );
}

function TurnEntry({
  combatant,
  style,
  is_active,
  is_proj,
  position,
}: {
  combatant: Combatant;
  style?: CombatantTokenStyle;
  is_active: boolean;
  is_proj: boolean;
  position: number;
}) {
  // Color by type: PC blue, ally green, monster red
  const colors = combatant.is_player
    ? { bg: '#3B82F6', border: '#1E40AF' }
    : combatant.is_ally
    ? { bg: '#22C55E', border: '#15803D' }
    : { bg: '#DC2626', border: '#7F1D1D' };
  const initial = style?.initial ?? combatant.name.charAt(0).toUpperCase();
  const has_avatar = !!style?.avatar;

  // Fade upcoming entries based on distance from active
  const opacity = is_active ? 1 : Math.max(0.4, 1 - position * 0.15);

  const dot_size = is_proj ? (is_active ? 36 : 28) : is_active ? 28 : 22;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: is_proj ? 10 : 6,
        opacity,
        transition: 'opacity 0.2s, transform 0.2s',
        transform: is_active ? 'scale(1.05)' : 'scale(1)',
      }}
    >
      <div
        style={{
          width: dot_size,
          height: dot_size,
          borderRadius: '50%',
          background: has_avatar
            ? `url(${style!.avatar}) center/cover no-repeat`
            : (style?.color ?? colors.bg),
          color: '#fff',
          fontWeight: 700,
          fontSize: is_active ? (is_proj ? 16 : 13) : is_proj ? 13 : 11,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: is_active ? '3px solid #FBBF24' : `2px solid ${colors.border}`,
          boxShadow: is_active ? '0 0 12px rgba(251, 191, 36, 0.7)' : 'none',
          flexShrink: 0,
        }}
      >
        {!has_avatar && initial}
      </div>
      <div
        style={{
          fontSize: is_proj ? (is_active ? 16 : 13) : is_active ? 13 : 11,
          fontWeight: is_active ? 600 : 400,
          color: is_proj ? '#fff' : 'var(--color-text-primary)',
          maxWidth: is_proj ? 160 : 110,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {combatant.name}
      </div>
    </div>
  );
}
