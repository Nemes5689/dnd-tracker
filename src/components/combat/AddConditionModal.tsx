import { useState, useMemo } from 'react';
import { useSRDStore } from '@/store/srdStore';
import type { AppliedCondition } from '@/types/app';

interface Props {
  combatant_name: string;
  onApply: (cond: AppliedCondition) => void;
  onClose: () => void;
}

type DurationType = 'manual' | 'fixed' | 'save_ends';

export function AddConditionModal({ combatant_name, onApply, onClose }: Props) {
  const { conditions } = useSRDStore();

  const [selected_id, set_selected_id] = useState<string | null>(null);
  const [duration_type, set_duration_type] = useState<DurationType>('manual');
  const [duration_rounds, set_duration_rounds] = useState('1');
  const [save_ability, set_save_ability] = useState('con');
  const [save_dc, set_save_dc] = useState('15');
  const [exhaustion_level, set_exhaustion_level] = useState('1');

  const is_exhaustion = selected_id === 'exhaustion';

  // Selected condition for description
  const selected = useMemo(
    () => conditions.find((c) => c.id === selected_id) ?? null,
    [conditions, selected_id]
  );

  const handleApply = () => {
    if (!selected_id) return;
    const cond: AppliedCondition = {
      condition_id: selected_id,
      duration_type,
    };
    if (duration_type === 'fixed') {
      const rounds = parseInt(duration_rounds, 10);
      if (rounds > 0) {
        cond.duration_rounds = rounds;
        cond.remaining_rounds = rounds;
      }
    } else if (duration_type === 'save_ends') {
      cond.save_ability = save_ability;
      cond.save_dc = parseInt(save_dc, 10) || 10;
    }
    if (is_exhaustion) {
      const lvl = parseInt(exhaustion_level, 10);
      cond.level = Math.max(1, Math.min(6, lvl || 1));
    }
    onApply(cond);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-bg-primary"
        style={{
          width: '90%',
          maxWidth: '620px',
          maxHeight: '85vh',
          overflowY: 'auto',
          borderRadius: 'var(--border-radius-lg)',
          padding: '20px 22px',
          boxShadow: '0 12px 32px rgba(0,0,0,0.18)',
        }}
      >
        <div className="flex justify-between items-center mb-3">
          <h2>Apply condition to {combatant_name}</h2>
          <button
            onClick={onClose}
            style={{
              border: 'none',
              background: 'transparent',
              fontSize: '20px',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            ×
          </button>
        </div>

        {/* Condition picker grid */}
        <div className="text-[11px] text-text-tertiary mb-2">
          1. Pick a condition
        </div>
        <div
          className="grid gap-1 mb-4"
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))' }}
        >
          {conditions.map((c) => {
            const is_sel = c.id === selected_id;
            return (
              <button
                key={c.id}
                onClick={() => set_selected_id(c.id)}
                style={{
                  padding: '8px 10px',
                  fontSize: '12px',
                  textAlign: 'left',
                  background: is_sel
                    ? 'var(--color-background-info)'
                    : 'var(--color-background-secondary)',
                  border: is_sel
                    ? '0.5px solid var(--color-border-info)'
                    : '0.5px solid var(--color-border-tertiary)',
                  color: is_sel ? 'var(--color-text-info)' : undefined,
                  fontWeight: is_sel ? 500 : 400,
                  borderRadius: 'var(--border-radius-md)',
                  cursor: 'pointer',
                }}
              >
                {c.name}
              </button>
            );
          })}
        </div>

        {/* Selected condition description */}
        {selected && (
          <div
            className="mb-4"
            style={{
              padding: '10px 12px',
              background: 'var(--color-background-secondary)',
              borderRadius: 'var(--border-radius-md)',
              border: '0.5px solid var(--color-border-tertiary)',
            }}
          >
            <div className="text-[12px] font-medium mb-2">{selected.name}</div>
            <div className="text-[11px] text-text-secondary leading-relaxed">
              {selected.summary}
            </div>
            {selected.effects.length > 0 && (
              <ul
                className="text-[11px] text-text-secondary leading-relaxed mt-2"
                style={{ paddingLeft: '14px', listStyle: 'disc' }}
              >
                {selected.effects.map((eff, i) => (
                  <li key={i} className="mb-1">
                    <strong className="text-text-primary font-medium">
                      {eff.name}:
                    </strong>{' '}
                    {eff.description}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Exhaustion level (special) */}
        {is_exhaustion && (
          <div
            className="mb-4"
            style={{
              padding: '10px 12px',
              background: 'var(--color-background-info)',
              borderRadius: 'var(--border-radius-md)',
              border: '0.5px solid var(--color-border-info)',
            }}
          >
            <div className="text-[12px] font-medium mb-2" style={{ color: 'var(--color-text-info)' }}>
              Exhaustion level
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5, 6].map((lvl) => {
                const sel = parseInt(exhaustion_level, 10) === lvl;
                const is_death = lvl === 6;
                return (
                  <button
                    key={lvl}
                    onClick={() => set_exhaustion_level(String(lvl))}
                    style={{
                      flex: 1,
                      padding: '6px 8px',
                      fontSize: '13px',
                      fontWeight: sel ? 600 : 400,
                      background: sel
                        ? is_death
                          ? '#FCEBEB'
                          : '#534AB7'
                        : 'var(--color-background-primary)',
                      borderColor: sel
                        ? is_death
                          ? '#F09595'
                          : '#534AB7'
                        : 'var(--color-border-tertiary)',
                      color: sel
                        ? is_death
                          ? '#501313'
                          : '#fff'
                        : 'var(--color-text-primary)',
                    }}
                  >
                    {lvl}
                    {is_death && ' ☠'}
                  </button>
                );
              })}
            </div>
            <div className="text-[11px] text-text-secondary mt-2 leading-relaxed">
              Each level: −2 to D20 Tests, −5 ft Speed (per level, cumulative).
              Level 6 = death.
            </div>
          </div>
        )}

        {/* Duration */}
        {selected && (
          <>
            <div className="text-[11px] text-text-tertiary mb-2">2. Duration</div>
            <div className="flex gap-2 mb-3">
              <DurationButton
                active={duration_type === 'manual'}
                onClick={() => set_duration_type('manual')}
              >
                Manual
              </DurationButton>
              <DurationButton
                active={duration_type === 'fixed'}
                onClick={() => set_duration_type('fixed')}
              >
                Fixed rounds
              </DurationButton>
              <DurationButton
                active={duration_type === 'save_ends'}
                onClick={() => set_duration_type('save_ends')}
              >
                Save ends
              </DurationButton>
            </div>

            {duration_type === 'manual' && (
              <div className="text-[11px] text-text-tertiary mb-3 italic">
                You'll remove the condition manually when needed.
              </div>
            )}

            {duration_type === 'fixed' && (
              <div className="flex gap-2 items-center mb-3">
                <span className="text-[12px] text-text-secondary">Rounds:</span>
                <input
                  type="number"
                  value={duration_rounds}
                  onChange={(e) => set_duration_rounds(e.target.value)}
                  style={{ width: 60, height: 28, fontSize: 12 }}
                />
                <span className="text-[11px] text-text-tertiary">
                  Auto-removes after this many rounds (ticks at end of turn)
                </span>
              </div>
            )}

            {duration_type === 'save_ends' && (
              <div className="flex gap-2 items-center mb-3">
                <span className="text-[12px] text-text-secondary">Save:</span>
                <select
                  value={save_ability}
                  onChange={(e) => set_save_ability(e.target.value)}
                  style={{ height: 28, fontSize: 12 }}
                >
                  {['str', 'dex', 'con', 'int', 'wis', 'cha'].map((ab) => (
                    <option key={ab} value={ab}>
                      {ab.toUpperCase()}
                    </option>
                  ))}
                </select>
                <span className="text-[12px] text-text-secondary">DC:</span>
                <input
                  type="number"
                  value={save_dc}
                  onChange={(e) => set_save_dc(e.target.value)}
                  style={{ width: 60, height: 28, fontSize: 12 }}
                />
                <span className="text-[11px] text-text-tertiary">
                  Save at end of each turn
                </span>
              </div>
            )}
          </>
        )}

        {/* Action buttons */}
        <div
          className="flex gap-2 pt-3 mt-2"
          style={{ borderTop: '0.5px solid var(--color-border-tertiary)' }}
        >
          <button
            onClick={handleApply}
            disabled={!selected_id}
            className={
              selected_id
                ? 'bg-accent-50 border-accent-300 text-accent-900 font-medium'
                : ''
            }
            style={{ padding: '8px 18px', fontSize: '13px', flex: 1 }}
          >
            Apply condition
          </button>
          <button
            onClick={onClose}
            style={{ padding: '8px 18px', fontSize: '13px' }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function DurationButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '6px 14px',
        fontSize: '12px',
        background: active ? 'var(--color-background-info)' : undefined,
        borderColor: active ? 'var(--color-border-info)' : undefined,
        color: active ? 'var(--color-text-info)' : undefined,
        fontWeight: active ? 500 : 400,
      }}
    >
      {children}
    </button>
  );
}
