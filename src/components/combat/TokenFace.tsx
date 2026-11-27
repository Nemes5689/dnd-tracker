import { useState } from 'react';
import type { Combatant, CombatantTokenStyle } from '@/types/app';

export function tokenColors(combatant: Combatant): { bg: string; border: string } {
  if (combatant.is_player) return { bg: '#3B82F6', border: '#1E40AF' };
  if (combatant.is_ally) return { bg: '#22C55E', border: '#15803D' };
  return { bg: '#DC2626', border: '#7F1D1D' };
}

export function TokenFace({
  combatant,
  style,
}: {
  combatant: Combatant;
  style?: CombatantTokenStyle;
}) {
  const [failedAvatar, setFailedAvatar] = useState<string>();
  const [loadedAvatar, setLoadedAvatar] = useState<string>();
  const avatar = style?.avatar;
  const emblem = combatant.is_player ? '⛨' : combatant.is_ally ? '✦' : '⚔︎';
  const showAvatar = Boolean(avatar && avatar !== failedAvatar);

  return (
    <>
      {(!avatar || loadedAvatar !== avatar || !showAvatar) && (
        <span aria-hidden="true" data-token-emblem>{style?.initial || emblem}</span>
      )}
      {showAvatar && (
        <img
          key={avatar}
          src={avatar}
          alt=""
          draggable={false}
          onLoad={() => setLoadedAvatar(avatar)}
          onError={() => setFailedAvatar(avatar)}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            borderRadius: 'inherit',
            objectFit: 'cover',
            pointerEvents: 'none',
          }}
        />
      )}
    </>
  );
}
