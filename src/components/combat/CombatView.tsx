import { useState, useEffect } from 'react';
import { useEncounterStore } from '@/store/encounterStore';
import { useSRDStore } from '@/store/srdStore';
import { useCustomMonsterStore } from '@/store/customMonsterStore';
import { useAlliesStore } from '@/store/alliesStore';
import { useCampaignStore } from '@/store/campaignStore';
import { BattleMapView } from './BattleMapView';
import { AddMonsterModal } from './AddMonsterModal';
import { AddConditionModal } from './AddConditionModal';
import { AITacticsTab } from './AITacticsTab';
import { getProjectorBus } from '@/utils/projectorBus';
import type { Encounter, Combatant, Character, AppliedCondition } from '@/types/app';
import type { Monster, MonsterSpeed, Spell } from '@/types/srd';

interface Props {
  encounter: Encounter;
  onExit: () => void;
}

export function CombatView({ encounter, onExit }: Props) {
  const {
    endTurn,
    damageCombatant,
    healCombatant,
    removeCombatant,
    setTokenPosition,
    applyConditionToCombatant,
    removeConditionFromCombatant,
    setInitiative,
    endEncounter,
  } = useEncounterStore();
  const { loaded, monsters: srd_monsters, spells, load } = useSRDStore();
  const { monsters: custom_monsters } = useCustomMonsterStore();
  const { allies } = useAlliesStore();
  const all_monsters = [...custom_monsters, ...srd_monsters];
  const { getActiveCampaign } = useCampaignStore();
  const campaign = getActiveCampaign();

  useEffect(() => {
    if (!loaded) load();
  }, [loaded, load]);

  // Broadcast encounter state to projector whenever it changes
  useEffect(() => {
    const bus = getProjectorBus();
    bus.send({
      type: 'encounter_update',
      encounter,
      timestamp: Date.now(),
    });
  }, [encounter]);

  // Listen for projector-initiated token moves
  useEffect(() => {
    const bus = getProjectorBus();
    const unsub = bus.subscribe((msg) => {
      if (msg.type === 'request_state') {
        bus.send({
          type: 'encounter_update',
          encounter,
          timestamp: Date.now(),
        });
      } else if (msg.type === 'move_token') {
        if (msg.encounter_id === encounter.id) {
          setTokenPosition(
            msg.encounter_id,
            msg.map_id,
            msg.combatant_id,
            msg.x,
            msg.y
          );
        }
      }
    });
    return () => {
      unsub();
    };
  }, [encounter, setTokenPosition]);

  const sorted = [...encounter.combatants].sort(
    (a, b) => b.initiative - a.initiative
  );
  const active = sorted[encounter.turn_index] ?? null;

  const [active_tab, set_active_tab] = useState<'log' | 'notes' | 'ai'>('log');
  const [popup_combatant_id, set_popup_combatant_id] = useState<string | null>(null);
  const [show_battle_map, set_show_battle_map] = useState(false);
  const [show_add_combatant, set_show_add_combatant] = useState<'monster' | 'ally' | 'character' | null>(null);
  const [show_add_condition, set_show_add_condition] = useState(false);

  // Preview mode: when DM clicks on a combatant in the initiative list, show
  // their stats in the active panel instead of the actual active combatant.
  // null = no preview, show real active. Reset to null on turn change.
  const [preview_id, set_preview_id] = useState<string | null>(null);

  // Reset preview when the active combatant changes (e.g. End turn happens)
  useEffect(() => {
    set_preview_id(null);
  }, [encounter.turn_index, encounter.round]);

  // The "viewed" combatant is either the preview or the active one
  const viewed = preview_id
    ? sorted.find((c) => c.id === preview_id) ?? active
    : active;
  const is_previewing = !!preview_id && preview_id !== active?.id;

  // If battle map is open, route to it
  if (show_battle_map) {
    return (
      <BattleMapView
        encounter={encounter}
        onExit={() => set_show_battle_map(false)}
      />
    );
  }

  // Find source monster/character for viewed combatant (active or preview)
  const source_monster: Monster | null = viewed
    ? viewed.source_type === 'monster'
      ? all_monsters.find((m) => m.id === viewed.source_id) ?? null
      : viewed.source_type === 'ally'
      ? allies.find((a) => a.id === viewed.source_id) ?? null
      : null
    : null;
  const source_character: Character | null =
    viewed?.source_type === 'character' && campaign
      ? campaign.characters.find((c) => c.id === viewed.source_id) ?? null
      : null;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div
        className="flex justify-between items-center bg-bg-primary"
        style={{
          padding: '12px 24px',
          borderBottom: '0.5px solid var(--color-border-tertiary)',
        }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            style={{ padding: '4px 10px', fontSize: '12px' }}
          >
            ← Exit
          </button>
          <div>
            <div className="text-[14px] font-medium">{encounter.name}</div>
            <div className="text-[11px] text-text-tertiary">
              Round {encounter.round} · {encounter.combatants.length} combatants
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => set_show_add_combatant('monster')}
            style={{ padding: '8px 14px', fontSize: '13px' }}
            title="Add a monster (enemy)"
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: '#DC2626',
                  display: 'inline-block',
                }}
              />
              + Monster
            </span>
          </button>
          <button
            onClick={() => set_show_add_combatant('ally')}
            style={{ padding: '8px 14px', fontSize: '13px' }}
            title="Add an ally / summon"
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: '#22C55E',
                  display: 'inline-block',
                }}
              />
              + Ally
            </span>
          </button>
          <button
            onClick={() => set_show_add_combatant('character')}
            style={{ padding: '8px 14px', fontSize: '13px' }}
            title="Add a player character (PC)"
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: '#3B82F6',
                  display: 'inline-block',
                }}
              />
              + Character
            </span>
          </button>
          <button
            onClick={() => set_show_battle_map(true)}
            style={{ padding: '8px 14px', fontSize: '13px' }}
          >
            🗺 Open battle map
            {(encounter.maps?.length ?? 0) > 0 && (
              <span className="text-text-tertiary ml-1">
                ({encounter.maps?.length})
              </span>
            )}
          </button>
          <button
            onClick={() => endTurn(encounter.id)}
            className="bg-accent-50 border-accent-300 text-accent-900 font-medium"
            style={{ padding: '8px 16px', fontSize: '13px' }}
          >
            End turn →
          </button>
          <button
            onClick={() => {
              if (
                confirm(
                  'End this encounter? It will be marked as completed and you can replay it later from the Encounters page.'
                )
              ) {
                endEncounter(encounter.id);
                onExit();
              }
            }}
            style={{
              padding: '8px 14px',
              fontSize: '13px',
              color: 'var(--color-text-danger)',
              borderColor: 'var(--color-border-danger)',
            }}
            title="Mark this encounter as completed"
          >
            ⏹ End encounter
          </button>
        </div>
      </div>

      <div
        className="flex-1 grid overflow-hidden"
        style={{ gridTemplateColumns: '260px 1fr 320px' }}
      >
        {/* COL 1: Initiative list with click-to-damage */}
        <div
          className="bg-bg-primary overflow-y-auto"
          style={{
            padding: '16px 12px',
            borderRight: '0.5px solid var(--color-border-tertiary)',
          }}
        >
          <div className="flex justify-between items-center mb-3">
            <div className="text-[13px] font-medium">Initiative</div>
            <div className="text-[11px] text-text-tertiary">R{encounter.round}</div>
          </div>

          <div className="text-[11px] text-text-tertiary mb-2 px-1">
            Click any combatant for damage / heal
          </div>

          {sorted.map((c, i) => (
            <CombatantInitRow
              key={c.id}
              combatant={c}
              is_active={i === encounter.turn_index}
              is_previewed={preview_id === c.id}
              onClick={() =>
                set_popup_combatant_id(
                  popup_combatant_id === c.id ? null : c.id
                )
              }
              onPreview={() => {
                // Toggle: if already previewing this one (or it's the active),
                // clear; otherwise set preview
                if (preview_id === c.id || (i === encounter.turn_index && !preview_id)) {
                  set_preview_id(null);
                } else {
                  set_preview_id(c.id);
                }
              }}
              expanded={popup_combatant_id === c.id}
              onApplyDamage={(amount) => {
                damageCombatant(encounter.id, c.id, amount);
                set_popup_combatant_id(null);
              }}
              onApplyHeal={(amount) => {
                healCombatant(encounter.id, c.id, amount);
                set_popup_combatant_id(null);
              }}
              onSetInitiative={(new_value) =>
                setInitiative(encounter.id, c.id, new_value)
              }
            />
          ))}
        </div>

        {/* COL 2: Combatant detail (active OR previewed) */}
        <div className="bg-bg-primary overflow-y-auto" style={{ padding: '20px' }}>
          {viewed ? (
            <>
              {is_previewing && (
                <div
                  className="flex justify-between items-center mb-3"
                  style={{
                    padding: '8px 12px',
                    background: 'var(--color-background-info)',
                    border: '0.5px solid var(--color-border-info)',
                    borderRadius: 'var(--border-radius-md)',
                    color: 'var(--color-text-info)',
                  }}
                >
                  <span className="text-[12px]">
                    🔍 <strong>Preview:</strong> {viewed.name}
                    <span className="opacity-70 ml-2">(not their turn)</span>
                  </span>
                  <button
                    onClick={() => set_preview_id(null)}
                    style={{
                      fontSize: '11px',
                      padding: '4px 10px',
                      background: 'var(--color-background-primary)',
                    }}
                  >
                    ← Back to active turn
                  </button>
                </div>
              )}
              <ActiveCombatantPanel
                combatant={viewed}
                monster={source_monster}
                character={source_character}
                spells={spells}
                onDamage={(amount) =>
                  damageCombatant(encounter.id, viewed.id, amount)
                }
                onHeal={(amount) => healCombatant(encounter.id, viewed.id, amount)}
                onRemove={() => {
                  if (confirm(`Remove ${viewed.name} from combat?`)) {
                    removeCombatant(encounter.id, viewed.id);
                    if (preview_id === viewed.id) set_preview_id(null);
                  }
                }}
                onAddCondition={() => set_show_add_condition(true)}
                onRemoveCondition={(condition_id) =>
                  removeConditionFromCombatant(encounter.id, viewed.id, condition_id)
                }
                onSetInitiative={(new_value) =>
                  setInitiative(encounter.id, viewed.id, new_value)
                }
              />
            </>
          ) : (
            <div className="text-text-tertiary">No active combatant.</div>
          )}
        </div>

        {/* COL 3: Tabs */}
        <div
          className="bg-bg-secondary overflow-hidden flex flex-col"
          style={{ padding: '16px 14px' }}
        >
          <div
            className="flex gap-1 mb-3"
            style={{ borderBottom: '0.5px solid var(--color-border-tertiary)' }}
          >
            <TabButton active={active_tab === 'ai'} onClick={() => set_active_tab('ai')}>
              🤖 AI
            </TabButton>
            <TabButton active={active_tab === 'log'} onClick={() => set_active_tab('log')}>
              Log
            </TabButton>
            <TabButton active={active_tab === 'notes'} onClick={() => set_active_tab('notes')}>
              Notes
            </TabButton>
          </div>

          <div className="flex-1 overflow-y-auto">
            {active_tab === 'ai' && active ? (
              <AITacticsTab
                monster={source_monster}
                combatant={active}
                encounter={encounter}
              />
            ) : active_tab === 'log' ? (
              <LogTab encounter={encounter} />
            ) : (
              <div className="text-[12px] text-text-tertiary italic">
                Combat notes coming soon.
              </div>
            )}
          </div>
        </div>
      </div>

      {show_add_combatant && (
        <AddMonsterModal
          encounter={encounter}
          initial_tab={show_add_combatant}
          onClose={() => set_show_add_combatant(null)}
        />
      )}

      {show_add_condition && active && (
        <AddConditionModal
          combatant_name={active.name}
          onApply={(cond) => {
            applyConditionToCombatant(encounter.id, active.id, cond);
          }}
          onClose={() => set_show_add_condition(false)}
        />
      )}
    </div>
  );
}

/**
 * Initiative row. For monsters: shows HP bar. For PCs: hides HP/AC numbers.
 * Clicking the row expands a damage/heal popup below it.
 */
function CombatantInitRow({
  combatant,
  is_active,
  is_previewed,
  onClick,
  onPreview,
  expanded,
  onApplyDamage,
  onApplyHeal,
  onSetInitiative,
}: {
  combatant: Combatant;
  is_active: boolean;
  is_previewed: boolean;
  onClick: () => void;
  onPreview: () => void;
  expanded: boolean;
  onApplyDamage: (amount: number) => void;
  onApplyHeal: (amount: number) => void;
  onSetInitiative: (new_value: number) => void;
}) {
  const [dmg_input, set_dmg_input] = useState('');
  const [heal_input, set_heal_input] = useState('');
  const [editing_init, set_editing_init] = useState(false);
  const [init_input, set_init_input] = useState(String(combatant.initiative));

  const is_pc = combatant.is_player;
  const hp_pct = (combatant.hp_current / combatant.hp_max) * 100;
  const hp_color =
    combatant.hp_current === 0
      ? '#888'
      : hp_pct > 60
      ? '#639922'
      : hp_pct > 30
      ? '#BA7517'
      : '#A03333';

  return (
    <div className="mb-1">
      <div
        onClick={onPreview}
        className="w-full text-left"
        style={{
          padding: '10px',
          borderRadius: 'var(--border-radius-md)',
          background: is_active
            ? '#EEEDFE'
            : is_previewed
            ? 'rgba(83, 74, 183, 0.08)'
            : 'transparent',
          borderLeft: is_active
            ? '3px solid #534AB7'
            : is_previewed
            ? '3px solid rgba(83, 74, 183, 0.5)'
            : '3px solid transparent',
          cursor: 'pointer',
        }}
      >
        <div className="flex justify-between items-center mb-1">
          <span
            className="text-[12px]"
            style={{
              fontWeight: is_active ? 500 : 400,
              color: is_active ? '#26215C' : undefined,
            }}
          >
            {is_pc && '🛡 '}
            {combatant.name}
            {is_previewed && !is_active && (
              <span className="text-text-tertiary ml-1 text-[10px]">🔍</span>
            )}
          </span>
          <div className="flex items-center gap-1">
            <span
              onClick={(e) => {
                e.stopPropagation();
                set_init_input(String(combatant.initiative));
                set_editing_init(true);
              }}
              title="Click to change initiative"
              className="text-[11px]"
              style={{
                color: is_active ? '#534AB7' : 'var(--color-text-tertiary)',
                cursor: 'pointer',
                padding: '2px 6px',
                borderRadius: 4,
                background: editing_init ? 'transparent' : 'rgba(0, 0, 0, 0.04)',
                fontWeight: is_active ? 600 : 400,
                minWidth: 24,
                textAlign: 'center',
                display: 'inline-block',
              }}
            >
              {editing_init ? (
                <input
                type="number"
                autoFocus
                value={init_input}
                onChange={(e) => set_init_input(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                onBlur={() => {
                  const n = parseInt(init_input, 10);
                  if (!isNaN(n) && n !== combatant.initiative) {
                    onSetInitiative(n);
                  }
                  set_editing_init(false);
                }}
                onKeyDown={(e) => {
                  e.stopPropagation();
                  if (e.key === 'Enter') {
                    const n = parseInt(init_input, 10);
                    if (!isNaN(n) && n !== combatant.initiative) {
                      onSetInitiative(n);
                    }
                    set_editing_init(false);
                  } else if (e.key === 'Escape') {
                    set_init_input(String(combatant.initiative));
                    set_editing_init(false);
                  }
                }}
                style={{
                  width: 44,
                  height: 22,
                  fontSize: 11,
                  textAlign: 'center',
                  padding: '0 4px',
                  border: '1px solid #534AB7',
                  borderRadius: 3,
                }}
              />
            ) : (
              combatant.initiative
            )}
          </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
              title={expanded ? 'Close damage/heal' : 'Apply damage or heal'}
              style={{
                fontSize: '11px',
                padding: '2px 6px',
                lineHeight: 1,
                background: expanded
                  ? 'var(--color-background-info)'
                  : 'transparent',
                border: '0.5px solid var(--color-border-tertiary)',
                borderRadius: 4,
                cursor: 'pointer',
                minWidth: 22,
              }}
            >
              {expanded ? '×' : '±'}
            </button>
          </div>
        </div>

        {/* HP display: hide exact numbers for PCs */}
        {is_pc ? (
          <div className="text-[10px] text-text-tertiary italic">
            Player character — HP / AC private
          </div>
        ) : (
          <div className="flex gap-1.5 items-center">
            <div
              style={{
                height: '4px',
                background: 'var(--color-background-secondary)',
                borderRadius: '2px',
                flex: 1,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${hp_pct}%`,
                  height: '100%',
                  background: hp_color,
                  transition: 'width 0.2s',
                }}
              />
            </div>
            <span className="text-[10px] text-text-tertiary">
              {combatant.hp_current}/{combatant.hp_max}
            </span>
          </div>
        )}

        {combatant.conditions.length > 0 && (
          <div className="mt-1 flex gap-1 flex-wrap">
            {combatant.conditions.map((cnd) => (
              <span
                key={cnd.condition_id}
                style={{
                  padding: '1px 6px',
                  background: '#FAEEDA',
                  color: '#633806',
                  borderRadius: '3px',
                  fontSize: '9px',
                  textTransform: 'capitalize',
                }}
              >
                {cnd.condition_id}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Expanded damage/heal popup */}
      {expanded && (
        <div
          className="mt-1"
          style={{
            padding: '10px',
            background: 'var(--color-background-primary)',
            border: '0.5px solid var(--color-border-info)',
            borderRadius: 'var(--border-radius-md)',
            boxSizing: 'border-box',
            width: '100%',
            overflow: 'hidden',
          }}
        >
          <div className="text-[10px] text-text-tertiary mb-2">
            Apply to <strong>{combatant.name}</strong>
          </div>
          <div className="flex gap-1 mb-1" style={{ minWidth: 0 }}>
            <input
              type="number"
              placeholder="Damage"
              value={dmg_input}
              onChange={(e) => set_dmg_input(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const n = parseInt(dmg_input, 10);
                  if (n > 0) {
                    onApplyDamage(n);
                    set_dmg_input('');
                  }
                }
              }}
              style={{
                flex: 1,
                minWidth: 0,
                fontSize: '11px',
                height: '26px',
                boxSizing: 'border-box',
              }}
              autoFocus
            />
            <button
              onClick={() => {
                const n = parseInt(dmg_input, 10);
                if (n > 0) {
                  onApplyDamage(n);
                  set_dmg_input('');
                }
              }}
              style={{
                fontSize: '11px',
                padding: '0 10px',
                background: '#FCEBEB',
                borderColor: '#F09595',
                color: '#501313',
                flexShrink: 0,
                whiteSpace: 'nowrap',
              }}
            >
              Damage
            </button>
          </div>
          <div className="flex gap-1" style={{ minWidth: 0 }}>
            <input
              type="number"
              placeholder="Heal"
              value={heal_input}
              onChange={(e) => set_heal_input(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const n = parseInt(heal_input, 10);
                  if (n > 0) {
                    onApplyHeal(n);
                    set_heal_input('');
                  }
                }
              }}
              style={{
                flex: 1,
                minWidth: 0,
                fontSize: '11px',
                height: '26px',
                boxSizing: 'border-box',
              }}
            />
            <button
              onClick={() => {
                const n = parseInt(heal_input, 10);
                if (n > 0) {
                  onApplyHeal(n);
                  set_heal_input('');
                }
              }}
              style={{
                fontSize: '11px',
                padding: '0 10px',
                background: '#E5F4D8',
                borderColor: '#9AC56A',
                color: '#2F4F0F',
                flexShrink: 0,
                whiteSpace: 'nowrap',
              }}
            >
              Heal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Active combatant panel. For monsters: full statblock visible.
 * For PCs: only abilities/weapons shown, HP/AC hidden.
 */
function ActiveCombatantPanel({
  combatant,
  monster,
  character,
  spells,
  onDamage,
  onHeal,
  onRemove,
  onAddCondition,
  onRemoveCondition,
  onSetInitiative,
}: {
  combatant: Combatant;
  monster: Monster | null;
  character: Character | null;
  spells: Spell[];
  onDamage: (amount: number) => void;
  onHeal: (amount: number) => void;
  onRemove: () => void;
  onAddCondition: () => void;
  onRemoveCondition: (condition_id: string) => void;
  onSetInitiative: (new_value: number) => void;
}) {
  const [damage_input, set_damage_input] = useState('');
  const [heal_input, set_heal_input] = useState('');

  const is_pc = combatant.is_player;

  const handleDamage = () => {
    const n = parseInt(damage_input, 10);
    if (n > 0) {
      onDamage(n);
      set_damage_input('');
    }
  };

  const handleHeal = () => {
    const n = parseInt(heal_input, 10);
    if (n > 0) {
      onHeal(n);
      set_heal_input('');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="text-[11px] text-text-tertiary mb-1">Active turn</div>
          <h2>
            {is_pc && '🛡 '}
            {combatant.name}
          </h2>
          {monster && (
            <div className="text-[12px] text-text-secondary mt-1">
              {monster.size} {monster.type} · CR {monster.cr}
              {monster.alignment && ` · ${monster.alignment}`}
            </div>
          )}
          {character && (
            <div className="text-[12px] text-text-secondary mt-1">
              {character.species && `${character.species} `}
              {character.class}
              {character.level && ` ${character.level}`}
            </div>
          )}
        </div>
        <button
          onClick={onRemove}
          style={{
            fontSize: '11px',
            padding: '4px 10px',
            color: 'var(--color-text-danger)',
            borderColor: 'var(--color-border-danger)',
          }}
        >
          Remove
        </button>
      </div>

      {/* Stat row — only for monsters */}
      {!is_pc && (
        <div
          className="grid gap-2 mb-4"
          style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}
        >
          <div
            className="bg-bg-secondary"
            style={{ padding: '10px', borderRadius: 'var(--border-radius-md)' }}
          >
            <div className="text-[11px] text-text-secondary">HP</div>
            <div className="text-[18px] font-medium">
              {combatant.hp_current} / {combatant.hp_max}
              {combatant.hp_temp > 0 && (
                <span className="text-[12px] text-text-tertiary ml-2">
                  +{combatant.hp_temp} temp
                </span>
              )}
            </div>
          </div>
          <div
            className="bg-bg-secondary"
            style={{ padding: '10px', borderRadius: 'var(--border-radius-md)' }}
          >
            <div className="text-[11px] text-text-secondary">AC</div>
            <div className="text-[18px] font-medium">{combatant.ac}</div>
          </div>
          <div
            className="bg-bg-secondary"
            style={{ padding: '10px', borderRadius: 'var(--border-radius-md)' }}
          >
            <div className="text-[11px] text-text-secondary">Init</div>
            <EditableInit
              value={combatant.initiative}
              onSubmit={onSetInitiative}
            />
          </div>
        </div>
      )}

      {/* PC: privacy notice */}
      {is_pc && (
        <div
          className="mb-4"
          style={{
            padding: '12px 14px',
            background: 'var(--color-background-info)',
            borderRadius: 'var(--border-radius-md)',
            border: '0.5px solid var(--color-border-info)',
          }}
        >
          <div className="text-[12px] text-text-info">
            🔒 HP and AC are managed by the player. Capabilities and abilities
            are shown below for tactical reference.
          </div>
        </div>
      )}

      {/* Damage/Heal — works for both PCs (player tells DM what they did) and monsters */}
      <div
        className="mb-4"
        style={{
          padding: '12px',
          background: 'var(--color-background-secondary)',
          borderRadius: 'var(--border-radius-md)',
        }}
      >
        <div className="text-[11px] text-text-tertiary mb-2">
          {is_pc
            ? 'Player damage/heal (tracked silently — bar position only)'
            : 'Apply to this monster'}
        </div>
        <div className="flex gap-2">
          <div className="flex gap-1 flex-1">
            <input
              type="number"
              placeholder="Damage"
              value={damage_input}
              onChange={(e) => set_damage_input(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleDamage()}
              style={{ flex: 1 }}
            />
            <button
              onClick={handleDamage}
              style={{
                padding: '0 12px',
                fontSize: '12px',
                background: '#FCEBEB',
                borderColor: '#F09595',
                color: '#501313',
              }}
            >
              Damage
            </button>
          </div>
          <div className="flex gap-1 flex-1">
            <input
              type="number"
              placeholder="Heal"
              value={heal_input}
              onChange={(e) => set_heal_input(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleHeal()}
              style={{ flex: 1 }}
            />
            <button
              onClick={handleHeal}
              style={{
                padding: '0 12px',
                fontSize: '12px',
                background: '#E5F4D8',
                borderColor: '#9AC56A',
                color: '#2F4F0F',
              }}
            >
              Heal
            </button>
          </div>
        </div>
      </div>

      {/* Conditions */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <div className="text-[12px] text-text-secondary">Conditions</div>
          <button
            onClick={onAddCondition}
            style={{ fontSize: '11px', padding: '3px 10px' }}
          >
            + Add condition
          </button>
        </div>
        {combatant.conditions.length === 0 ? (
          <div className="text-[11px] text-text-tertiary italic">
            No active conditions.
          </div>
        ) : (
          <div className="flex gap-2 flex-wrap">
            {combatant.conditions.map((c) => (
              <ConditionChip
                key={c.condition_id}
                applied={c}
                onRemove={() => onRemoveCondition(c.condition_id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Monster reference */}
      {monster && (
        <div className="mt-6">
          {/* Full statblock for save/check rolling */}
          <MonsterFullStatblock monster={monster} />

          {monster.spellcasting && (
            <MonsterSpellList monster={monster} spells={spells} />
          )}

          {monster.traits.length > 0 && (
            <FeatureList title="Traits" features={monster.traits} />
          )}
          {monster.actions.length > 0 && (
            <FeatureList title="Actions" features={monster.actions} />
          )}
          {monster.bonus_actions.length > 0 && (
            <FeatureList title="Bonus actions" features={monster.bonus_actions} />
          )}
          {monster.reactions.length > 0 && (
            <FeatureList title="Reactions" features={monster.reactions} />
          )}
          {monster.legendary_actions.length > 0 && (
            <FeatureList
              title="Legendary actions"
              features={monster.legendary_actions}
            />
          )}
        </div>
      )}

      {/* Character capabilities (visible to DM) */}
      {character && (
        <div className="mt-6">
          {character.weapons && character.weapons.length > 0 && (
            <div className="mb-4">
              <h3 className="text-[13px] font-medium mb-2">Weapons</h3>
              <div className="flex flex-col gap-2">
                {character.weapons.map((w, i) => (
                  <div
                    key={i}
                    className="text-[12px] text-text-secondary"
                    style={{
                      padding: '8px 12px',
                      background: 'var(--color-background-secondary)',
                      borderRadius: 'var(--border-radius-sm)',
                    }}
                  >
                    <strong className="text-text-primary font-medium">
                      {w.name}
                    </strong>{' '}
                    — {w.attack_bonus >= 0 ? '+' : ''}
                    {w.attack_bonus} to hit, {w.damage} {w.damage_type}
                    {w.mastery && (
                      <span className="ml-2 text-[10px] text-text-info">
                        [{w.mastery}]
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          {character.spell_ids && character.spell_ids.length > 0 && (
            <CharacterSpellList spellIds={character.spell_ids} />
          )}
          {character.notes && (
            <div className="mb-4">
              <h3 className="text-[13px] font-medium mb-2">Features & notes</h3>
              <div
                className="text-[12px] leading-relaxed text-text-secondary"
                style={{ whiteSpace: 'pre-wrap' }}
              >
                {character.notes}
              </div>
            </div>
          )}
          {!character.weapons?.length && !character.spell_ids?.length && !character.notes && (
            <div className="text-[12px] text-text-tertiary italic">
              No detailed capabilities defined for this character. Add weapons,
              spells, and features in the Characters page.
            </div>
          )}
        </div>
      )}
    </div>
  );
}



function formatSpellLevel(level: number): string {
  return level === 0 ? 'Cantrip' : `Level ${level}`;
}

function MonsterSpellList({ monster, spells }: { monster: Monster; spells: Spell[] }) {
  const spellcasting = monster.spellcasting;
  if (!spellcasting) return null;
  const selected = spells
    .filter((spell) => spellcasting.spell_ids.includes(spell.id))
    .sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));
  const attack = spellcasting.attack_bonus;

  return (
    <div className="mb-4">
      <h3 className="text-[13px] font-medium mb-2">Spellcasting</h3>
      <div className="text-[12px] text-text-secondary mb-2">
        {spellcasting.ability && <span>Ability {spellcasting.ability.toUpperCase()}</span>}
        {spellcasting.save_dc !== undefined && <span> · Save DC {spellcasting.save_dc}</span>}
        {attack !== undefined && <span> · Spell attack {attack >= 0 ? '+' : ''}{attack}</span>}
        {spellcasting.caster_level !== undefined && <span> · Caster level {spellcasting.caster_level}</span>}
      </div>
      {spellcasting.notes && (
        <div className="text-[12px] text-text-secondary mb-2" style={{ whiteSpace: 'pre-wrap' }}>
          {spellcasting.notes}
        </div>
      )}
      {selected.length > 0 ? (
        <div className="flex flex-col gap-2">
          {selected.map((spell) => (
            <details
              key={spell.id}
              className="text-[12px] text-text-secondary"
              style={{
                padding: '8px 12px',
                background: 'var(--color-background-secondary)',
                borderRadius: 'var(--border-radius-sm)',
              }}
            >
              <summary style={{ cursor: 'pointer' }}>
                <strong className="text-text-primary font-medium">{spell.name}</strong>{' '}
                <span className="text-[10px] text-text-tertiary">
                  — {formatSpellLevel(spell.level)} · {spell.school}
                  {spell.concentration ? ' · Concentration' : ''}
                  {spell.ritual ? ' · Ritual' : ''}
                </span>
              </summary>
              <div className="mt-2 text-[11px] text-text-tertiary">
                {spell.casting_time ?? '—'} · {spell.range ?? '—'} · {spell.duration ?? '—'}
              </div>
              <div className="mt-2 text-[11px] leading-relaxed" style={{ whiteSpace: 'pre-wrap' }}>
                {spell.description}
              </div>
              {spell.higher_levels && (
                <div className="mt-2 text-[11px] leading-relaxed text-text-tertiary">
                  <strong>At higher levels:</strong> {spell.higher_levels}
                </div>
              )}
            </details>
          ))}
        </div>
      ) : (
        <div className="text-[12px] text-text-tertiary italic">No spells selected.</div>
      )}
    </div>
  );
}

function CharacterSpellList({ spellIds }: { spellIds: string[] }) {
  const { spells } = useSRDStore();
  const selected = spells
    .filter((spell) => spellIds.includes(spell.id))
    .sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));

  if (selected.length === 0) return null;

  return (
    <div className="mb-4">
      <h3 className="text-[13px] font-medium mb-2">Spells</h3>
      <div className="flex flex-col gap-2">
        {selected.map((spell) => (
          <details
            key={spell.id}
            className="text-[12px] text-text-secondary"
            style={{
              padding: '8px 12px',
              background: 'var(--color-background-secondary)',
              borderRadius: 'var(--border-radius-sm)',
            }}
          >
            <summary style={{ cursor: 'pointer' }}>
              <strong className="text-text-primary font-medium">{spell.name}</strong>{' '}
              <span className="text-[10px] text-text-tertiary">
                — {spell.level === 0 ? 'Cantrip' : `Level ${spell.level}`} · {spell.school}
                {spell.concentration ? ' · Concentration' : ''}
                {spell.ritual ? ' · Ritual' : ''}
              </span>
            </summary>
            <div className="mt-2 text-[11px] text-text-tertiary">
              {spell.casting_time ?? '—'} · {spell.range ?? '—'} · {spell.duration ?? '—'}
            </div>
            <div className="mt-2 text-[11px] leading-relaxed" style={{ whiteSpace: 'pre-wrap' }}>
              {spell.description}
            </div>
            {spell.higher_levels && (
              <div className="mt-2 text-[11px] leading-relaxed text-text-tertiary">
                <strong>At higher levels:</strong> {spell.higher_levels}
              </div>
            )}
          </details>
        ))}
      </div>
    </div>
  );
}

/**
 * A condition chip with hover-to-show description and X to remove.
 * Looks up the condition from SRD data for name and description.
 */
/**
 * Click-to-edit initiative number. Used in the active combatant panel.
 * Click the number to edit; Enter to save, Escape to cancel.
 */
function EditableInit({
  value,
  onSubmit,
}: {
  value: number;
  onSubmit: (new_value: number) => void;
}) {
  const [editing, set_editing] = useState(false);
  const [draft, set_draft] = useState(String(value));

  if (!editing) {
    return (
      <div
        onClick={() => {
          set_draft(String(value));
          set_editing(true);
        }}
        title="Click to change initiative"
        className="text-[18px] font-medium"
        style={{
          cursor: 'pointer',
          padding: '0 4px',
          marginLeft: -4,
          borderRadius: 4,
          display: 'inline-block',
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = 'rgba(83, 74, 183, 0.1)')
        }
        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
      >
        {value}
      </div>
    );
  }

  const submit = () => {
    const n = parseInt(draft, 10);
    if (!isNaN(n) && n !== value) {
      onSubmit(n);
    }
    set_editing(false);
  };

  return (
    <input
      type="number"
      autoFocus
      value={draft}
      onChange={(e) => set_draft(e.target.value)}
      onBlur={submit}
      onKeyDown={(e) => {
        if (e.key === 'Enter') submit();
        else if (e.key === 'Escape') set_editing(false);
      }}
      style={{
        width: 60,
        height: 28,
        fontSize: 16,
        textAlign: 'center',
        padding: '0 4px',
        border: '1.5px solid #534AB7',
        borderRadius: 4,
        fontWeight: 500,
      }}
    />
  );
}

function ConditionChip({
  applied,
  onRemove,
}: {
  applied: AppliedCondition;
  onRemove: () => void;
}) {
  const { conditions } = useSRDStore();
  const cond = conditions.find((c) => c.id === applied.condition_id);
  const [show_tooltip, set_show_tooltip] = useState(false);

  // Build duration text
  let duration_label = '';
  if (applied.duration_type === 'fixed' && applied.remaining_rounds != null) {
    duration_label = `${applied.remaining_rounds}r`;
  } else if (applied.duration_type === 'save_ends') {
    duration_label = `save ${applied.save_ability?.toUpperCase()} DC${applied.save_dc}`;
  }

  const display_name = cond?.name ?? applied.condition_id;
  const is_exhaustion = applied.condition_id === 'exhaustion';
  const lvl = applied.level ?? 1;

  // For exhaustion, append level to display
  const display_with_level = is_exhaustion
    ? `${display_name} ${lvl}${lvl >= 6 ? ' ☠' : ''}`
    : display_name;

  return (
    <span
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
      }}
      onMouseEnter={() => set_show_tooltip(true)}
      onMouseLeave={() => set_show_tooltip(false)}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          padding: '3px 4px 3px 10px',
          background: is_exhaustion && lvl >= 5 ? '#FCEBEB' : '#FAEEDA',
          color: is_exhaustion && lvl >= 5 ? '#501313' : '#633806',
          borderRadius: '12px',
          fontSize: '11px',
        }}
      >
        <span>{display_with_level}</span>
        {duration_label && (
          <span
            style={{
              fontSize: '10px',
              opacity: 0.7,
              marginLeft: 2,
            }}
          >
            {duration_label}
          </span>
        )}
        <button
          onClick={onRemove}
          title="Remove"
          style={{
            background: 'transparent',
            border: 'none',
            padding: '0 4px',
            fontSize: '14px',
            lineHeight: 1,
            cursor: 'pointer',
            color: 'inherit',
            opacity: 0.6,
          }}
        >
          ×
        </button>
      </span>

      {show_tooltip && cond && (
        <ConditionTooltip
          condition={cond}
          applied={applied}
        />
      )}
    </span>
  );
}

/**
 * Floating tooltip showing the full condition description on hover.
 */
function ConditionTooltip({
  condition,
  applied,
}: {
  condition: { name: string; summary: string; effects: { name: string; description: string }[] };
  applied: AppliedCondition;
}) {
  const is_exhaustion = applied.condition_id === 'exhaustion';
  const lvl = applied.level ?? 1;

  // For exhaustion, compute the actual numeric effects at this level
  const exhaustion_effects = is_exhaustion ? [
    `D20 Tests: ${-2 * lvl} penalty`,
    `Speed: -${5 * lvl} ft`,
    lvl >= 6 ? '☠ DEATH' : `Long rest: -1 level`,
  ] : null;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '100%',
        left: 0,
        marginBottom: 8,
        zIndex: 100,
        width: 320,
        padding: '10px 12px',
        background: 'rgba(20, 20, 20, 0.97)',
        color: '#fff',
        borderRadius: 8,
        boxShadow: '0 6px 16px rgba(0, 0, 0, 0.4)',
        fontSize: 11,
        lineHeight: 1.5,
        pointerEvents: 'none',
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 4, fontSize: 12 }}>
        {condition.name}
        {is_exhaustion && (
          <span style={{ marginLeft: 8, opacity: 0.8, fontSize: 11, fontWeight: 400 }}>
            Level {lvl}
            {lvl >= 6 && ' ☠'}
          </span>
        )}
      </div>
      <div style={{ opacity: 0.85, marginBottom: 6 }}>
        {condition.summary}
      </div>

      {is_exhaustion && exhaustion_effects && (
        <div
          style={{
            padding: '6px 8px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: 4,
            marginBottom: 6,
          }}
        >
          <div style={{ fontWeight: 500, marginBottom: 3 }}>At level {lvl}:</div>
          {exhaustion_effects.map((eff, i) => (
            <div key={i} style={{ opacity: 0.9 }}>
              • {eff}
            </div>
          ))}
        </div>
      )}

      {condition.effects.length > 0 && (
        <ul style={{ paddingLeft: 14, margin: 0, listStyle: 'disc' }}>
          {condition.effects.map((eff, i) => (
            <li key={i} style={{ marginBottom: 3, opacity: 0.85 }}>
              <strong style={{ opacity: 1 }}>{eff.name}:</strong> {eff.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/**
 * Full monster statblock for combat reference: abilities, saves, skills,
 * senses, languages, resistances/immunities. Shown inline in the active
 * combatant panel so the DM can quickly find save modifiers, skill bonuses,
 * etc. while running the monster's turn.
 */
function MonsterFullStatblock({ monster }: { monster: Monster }) {
  return (
    <div className="mb-5">
      {/* Ability scores + saves */}
      <div
        className="grid gap-2 mb-3"
        style={{ gridTemplateColumns: 'repeat(6, minmax(0, 1fr))' }}
      >
        {(['str', 'dex', 'con', 'int', 'wis', 'cha'] as const).map((ab) => {
          const a = monster.abilities[ab];
          const save = monster.saves[ab];
          const has_save_prof = save !== a.modifier;
          return (
            <div
              key={ab}
              style={{
                padding: '6px 4px',
                background: 'var(--color-background-primary)',
                border: '0.5px solid var(--color-border-tertiary)',
                borderRadius: 'var(--border-radius-md)',
                textAlign: 'center',
              }}
            >
              <div
                className="text-[10px] uppercase tracking-wider"
                style={{ color: 'var(--color-text-tertiary)' }}
              >
                {ab}
              </div>
              <div className="text-[13px] font-medium">
                {a.score}
              </div>
              <div className="text-[11px] text-text-secondary">
                ({a.modifier >= 0 ? '+' : ''}
                {a.modifier})
              </div>
              <div
                className="text-[10px] mt-1 pt-1"
                style={{
                  borderTop: '0.5px solid var(--color-border-tertiary)',
                  color: has_save_prof
                    ? 'var(--color-text-info)'
                    : 'var(--color-text-tertiary)',
                  fontWeight: has_save_prof ? 600 : 400,
                }}
                title={has_save_prof ? 'Save proficient' : 'No save proficiency'}
              >
                save {save >= 0 ? '+' : ''}
                {save}
              </div>
            </div>
          );
        })}
      </div>

      {/* Misc info: speed, skills, senses, languages, resistances */}
      <div className="text-[12px] leading-7 text-text-secondary">
        {/* Speed */}
        {hasSpeed(monster.speed) && (
          <div>
            <strong className="text-text-primary font-medium">Speed</strong>{' '}
            {formatSpeedFull(monster.speed)}
          </div>
        )}

        {/* Skills (shown prominently — useful for skill checks) */}
        {Object.keys(monster.skills).length > 0 && (
          <div>
            <strong className="text-text-primary font-medium">Skills</strong>{' '}
            {Object.entries(monster.skills)
              .map(([s, b]) => `${s} ${b >= 0 ? '+' : ''}${b}`)
              .join(', ')}
          </div>
        )}

        {/* Senses (incl. passive perception) */}
        {(Object.keys(monster.senses).length > 0 || monster.passive_perception) && (
          <div>
            <strong className="text-text-primary font-medium">Senses</strong>{' '}
            {Object.entries(monster.senses)
              .map(([k, v]) => `${k} ${v} ft`)
              .join(', ')}
            {monster.passive_perception !== null &&
              monster.passive_perception !== undefined && (
                <>
                  {Object.keys(monster.senses).length > 0 ? '; ' : ''}
                  Passive Perception {monster.passive_perception}
                </>
              )}
          </div>
        )}

        {monster.languages.length > 0 && (
          <div>
            <strong className="text-text-primary font-medium">Languages</strong>{' '}
            {monster.languages.join(', ')}
          </div>
        )}

        {monster.damage_resistances.length > 0 && (
          <div>
            <strong className="text-text-primary font-medium">Resistances</strong>{' '}
            {monster.damage_resistances.join(', ')}
          </div>
        )}

        {monster.damage_immunities.length > 0 && (
          <div>
            <strong className="text-text-primary font-medium">
              Damage Immunities
            </strong>{' '}
            {monster.damage_immunities.join(', ')}
          </div>
        )}

        {monster.damage_vulnerabilities.length > 0 && (
          <div>
            <strong className="text-text-primary font-medium">
              Vulnerabilities
            </strong>{' '}
            {monster.damage_vulnerabilities.join(', ')}
          </div>
        )}

        {monster.condition_immunities.length > 0 && (
          <div>
            <strong className="text-text-primary font-medium">
              Condition Immunities
            </strong>{' '}
            {monster.condition_immunities.join(', ')}
          </div>
        )}

        {monster.gear && monster.gear.length > 0 && (
          <div>
            <strong className="text-text-primary font-medium">Gear</strong>{' '}
            {monster.gear.join(', ')}
          </div>
        )}
      </div>
    </div>
  );
}

function hasSpeed(speed: MonsterSpeed | undefined): boolean {
  if (typeof speed === 'string') return speed.trim().length > 0;
  return !!speed && Object.keys(speed).length > 0;
}

function formatSpeedFull(speed: MonsterSpeed | undefined): string {
  if (typeof speed === 'string') return speed.trim() || '—';
  if (!speed) return '—';
  const parts: string[] = [];
  if (speed.walk !== undefined) parts.push(`${speed.walk} ft`);
  for (const [mode, val] of Object.entries(speed)) {
    if (mode === 'walk') continue;
    parts.push(`${mode} ${val} ft`);
  }
  return parts.length > 0 ? parts.join(', ') : '—';
}

function FeatureList({
  title,
  features,
}: {
  title: string;
  features: { name: string; description: string }[];
}) {
  return (
    <div className="mb-4">
      <h3 className="text-[13px] font-medium mb-2">{title}</h3>
      <div className="flex flex-col gap-2">
        {features.map((f) => (
          <div
            key={f.name}
            className="text-[12px] leading-relaxed text-text-secondary"
          >
            <strong className="text-text-primary font-medium">{f.name}.</strong>{' '}
            {f.description}
          </div>
        ))}
      </div>
    </div>
  );
}

function TabButton({
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
        padding: '6px 12px',
        fontSize: '12px',
        background: 'transparent',
        border: 'none',
        borderBottom: active
          ? '2px solid var(--color-text-primary)'
          : '2px solid transparent',
        marginBottom: '-1px',
        fontWeight: active ? 500 : 400,
        color: active ? undefined : 'var(--color-text-secondary)',
        borderRadius: 0,
      }}
    >
      {children}
    </button>
  );
}

function LogTab({ encounter }: { encounter: Encounter }) {
  if (encounter.log.length === 0) {
    return (
      <div className="text-[12px] text-text-tertiary italic">
        No events yet. Combat actions will appear here.
      </div>
    );
  }
  const reversed = [...encounter.log].reverse();
  return (
    <div className="flex flex-col gap-2">
      {reversed.map((entry, i) => (
        <div
          key={i}
          className="text-[12px]"
          style={{
            padding: '6px 10px',
            background: 'var(--color-background-primary)',
            border: '0.5px solid var(--color-border-tertiary)',
            borderRadius: 'var(--border-radius-sm)',
          }}
        >
          <span className="text-text-tertiary">[R{entry.round}]</span>{' '}
          <span className="text-text-secondary">{entry.message}</span>
        </div>
      ))}
    </div>
  );
}
