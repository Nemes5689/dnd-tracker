import { useState, useMemo } from 'react';
import { useEncounterStore } from '@/store/encounterStore';
import { useSRDStore } from '@/store/srdStore';
import { useCustomMonsterStore } from '@/store/customMonsterStore';
import { useAlliesStore } from '@/store/alliesStore';
import { useCampaignStore } from '@/store/campaignStore';
import { CustomMonsterForm } from '@/components/bestiary/CustomMonsterForm';
import { rollD20 } from '@/engine/dice';
import {
  monsterToCombatant,
  allyToCombatant,
  characterToCombatant,
} from '@/pages/CombatPage';
import type { Encounter } from '@/types/app';

interface Props {
  encounter: Encounter;
  onClose: () => void;
  // Which tab to default to
  initial_tab?: 'monster' | 'ally' | 'character';
}

/**
 * Modal for adding monsters, allies, OR characters mid-combat. Has a tab
 * switcher. Monsters: red enemy. Allies: green friendly. Characters: blue PC.
 */
export function AddMonsterModal({ encounter, onClose, initial_tab = 'monster' }: Props) {
  const { addCombatant, log } = useEncounterStore();
  const { monsters: srd_monsters } = useSRDStore();
  const { monsters: custom_monsters } = useCustomMonsterStore();
  const { allies } = useAlliesStore();
  const { getActiveCampaign } = useCampaignStore();
  const campaign = getActiveCampaign();

  const [tab, set_tab] = useState<'monster' | 'ally' | 'character'>(initial_tab);
  const all_monsters = useMemo(
    () => [...custom_monsters, ...srd_monsters],
    [custom_monsters, srd_monsters]
  );

  const [search, set_search] = useState('');
  const [show_custom_form, set_show_custom_form] = useState(false);

  const monster_results = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return all_monsters.filter((m) => m.name.toLowerCase().includes(q)).slice(0, 12);
  }, [all_monsters, search]);

  const ally_results = useMemo(() => {
    if (!search.trim()) return allies.slice(0, 12);
    const q = search.toLowerCase();
    return allies.filter((a) => a.name.toLowerCase().includes(q)).slice(0, 12);
  }, [allies, search]);

  const handleAddMonster = (monster_id: string, count: number) => {
    const monster = all_monsters.find((m) => m.id === monster_id);
    if (!monster) return;
    const existing = encounter.combatants.filter(
      (c) => c.source_type === 'monster' && c.source_id === monster_id
    ).length;
    for (let i = 0; i < count; i++) {
      const init_mod = monster.initiative?.modifier ?? 0;
      const init = rollD20(init_mod).total;
      const combatant = monsterToCombatant(monster, existing + i, init);
      addCombatant(encounter.id, combatant);
      if (monster.avatar) {
        useEncounterStore.getState().setTokenStyle(encounter.id, {
          combatant_id: combatant.id,
          avatar: monster.avatar,
        });
      }
      log(encounter.id, `${combatant.name} joined combat (init ${init})`);
    }
    onClose();
  };

  const handleAddAlly = (ally_id: string, count: number) => {
    const ally = allies.find((a) => a.id === ally_id);
    if (!ally) return;
    const existing = encounter.combatants.filter(
      (c) => c.source_type === 'ally' && c.source_id === ally_id
    ).length;
    for (let i = 0; i < count; i++) {
      const init_mod = ally.initiative?.modifier ?? 0;
      const init = rollD20(init_mod).total;
      const combatant = allyToCombatant(ally, existing + i, init);
      addCombatant(encounter.id, combatant);
      if (ally.avatar) {
        useEncounterStore.getState().setTokenStyle(encounter.id, {
          combatant_id: combatant.id,
          avatar: ally.avatar,
        });
      }
      log(encounter.id, `${combatant.name} (ally) joined combat (init ${init})`);
    }
    onClose();
  };

  const handleAddCharacter = (character_id: string) => {
    if (!campaign) return;
    const character = campaign.characters.find((c) => c.id === character_id);
    if (!character) return;
    // Skip if already in combat
    const already_in = encounter.combatants.some(
      (c) => c.source_type === 'character' && c.source_id === character_id
    );
    if (already_in) {
      alert(`${character.name} is already in combat.`);
      return;
    }
    const init_mod = character.initiative_bonus ?? 0;
    const init = rollD20(init_mod).total;
    const combatant = characterToCombatant(character, init);
    addCombatant(encounter.id, combatant);
    if (character.avatar) {
      useEncounterStore.getState().setTokenStyle(encounter.id, {
        combatant_id: combatant.id,
        avatar: character.avatar,
      });
    }
    log(encounter.id, `${combatant.name} joined combat (init ${init})`);
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
    >
      <div
        className="bg-bg-primary"
        style={{
          width: '90%',
          maxWidth: '560px',
          maxHeight: '80vh',
          overflowY: 'auto',
          borderRadius: 'var(--border-radius-lg)',
          padding: '20px 22px',
          boxShadow: '0 12px 32px rgba(0,0,0,0.18)',
        }}
      >
        <div className="flex justify-between items-center mb-3">
          <h2>Add to combat</h2>
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

        {/* Tab switcher */}
        <div
          className="flex gap-1 mb-4"
          style={{ borderBottom: '0.5px solid var(--color-border-tertiary)' }}
        >
          <TabButton active={tab === 'monster'} onClick={() => set_tab('monster')}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#DC2626',
                  display: 'inline-block',
                }}
              />
              Monster (enemy)
            </span>
          </TabButton>
          <TabButton active={tab === 'ally'} onClick={() => set_tab('ally')}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#22C55E',
                  display: 'inline-block',
                }}
              />
              Ally / Summon
            </span>
          </TabButton>
          <TabButton active={tab === 'character'} onClick={() => set_tab('character')}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#3B82F6',
                  display: 'inline-block',
                }}
              />
              Character (PC)
            </span>
          </TabButton>
        </div>

        {/* Monster tab */}
        {tab === 'monster' && (
          <>
            <div className="flex gap-2 mb-3">
              <input
                placeholder="Search SRD + custom monsters..."
                value={search}
                onChange={(e) => set_search(e.target.value)}
                autoFocus
                style={{ flex: 1 }}
              />
              <button
                onClick={() => set_show_custom_form(true)}
                style={{ fontSize: '12px', padding: '0 14px' }}
              >
                + Create custom
              </button>
            </div>

            {!search.trim() ? (
              <div className="text-[12px] text-text-tertiary italic px-2 py-4 text-center">
                Type to search…
              </div>
            ) : monster_results.length === 0 ? (
              <div className="text-[12px] text-text-tertiary italic px-2 py-4 text-center">
                No matches.
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                {monster_results.map((m) => {
                  const is_custom = m.source === 'Custom';
                  return (
                    <div
                      key={m.id}
                      className="flex justify-between items-center"
                      style={{
                        padding: '10px 12px',
                        border: '0.5px solid var(--color-border-tertiary)',
                        borderRadius: 'var(--border-radius-md)',
                        background: 'var(--color-background-secondary)',
                      }}
                    >
                      <div>
                        <div className={`text-[13px] ${is_custom ? 'italic' : ''}`}>
                          {is_custom && '★ '}
                          {m.name}
                        </div>
                        <div className="text-[10px] text-text-tertiary">
                          CR {m.cr} · HP {m.hp} · AC {m.ac} · {m.size} {m.type}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleAddMonster(m.id, 1)}
                          style={{ fontSize: '11px', padding: '4px 10px' }}
                        >
                          +1
                        </button>
                        <button
                          onClick={() => handleAddMonster(m.id, 3)}
                          style={{ fontSize: '11px', padding: '4px 10px' }}
                        >
                          +3
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Ally tab */}
        {tab === 'ally' && (
          <>
            {allies.length === 0 ? (
              <div className="text-[12px] text-text-tertiary italic p-4 text-center">
                No allies created yet. Open the Allies & Summons page in the
                sidebar to create some first.
              </div>
            ) : (
              <>
                <input
                  placeholder="Search allies..."
                  value={search}
                  onChange={(e) => set_search(e.target.value)}
                  autoFocus
                  style={{ width: '100%', marginBottom: 12 }}
                />
                {ally_results.length === 0 ? (
                  <div className="text-[12px] text-text-tertiary italic px-2 py-4 text-center">
                    No matches.
                  </div>
                ) : (
                  <div className="flex flex-col gap-1">
                    {ally_results.map((a) => (
                      <div
                        key={a.id}
                        className="flex justify-between items-center"
                        style={{
                          padding: '10px 12px',
                          border: '0.5px solid var(--color-border-tertiary)',
                          borderRadius: 'var(--border-radius-md)',
                          background: 'var(--color-background-secondary)',
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              background: '#22C55E',
                              flexShrink: 0,
                            }}
                          />
                          <div>
                            <div className="text-[13px]">{a.name}</div>
                            <div className="text-[10px] text-text-tertiary">
                              CR {a.cr} · HP {a.hp} · AC {a.ac} · {a.size} {a.type}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleAddAlly(a.id, 1)}
                            style={{ fontSize: '11px', padding: '4px 10px' }}
                          >
                            +1
                          </button>
                          <button
                            onClick={() => handleAddAlly(a.id, 3)}
                            style={{ fontSize: '11px', padding: '4px 10px' }}
                          >
                            +3
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}

        {tab === 'character' && (
          <>
            {!campaign || campaign.characters.length === 0 ? (
              <div
                className="text-text-tertiary text-[12px] italic"
                style={{
                  padding: '24px 16px',
                  background: 'var(--color-background-secondary)',
                  borderRadius: 'var(--border-radius-md)',
                  textAlign: 'center',
                }}
              >
                No characters in this campaign yet. Add party members on the
                Characters page first.
              </div>
            ) : (
              <>
                <div className="text-[11px] text-text-tertiary mb-2">
                  Characters not yet in this combat:
                </div>
                {(() => {
                  const not_in_combat = campaign.characters.filter(
                    (c) =>
                      !encounter.combatants.some(
                        (x) =>
                          x.source_type === 'character' &&
                          x.source_id === c.id
                      )
                  );
                  const already_in = campaign.characters.filter((c) =>
                    encounter.combatants.some(
                      (x) =>
                        x.source_type === 'character' &&
                        x.source_id === c.id
                    )
                  );

                  return (
                    <>
                      {not_in_combat.length === 0 ? (
                        <div
                          className="text-text-tertiary text-[12px] italic"
                          style={{
                            padding: '16px',
                            background: 'var(--color-background-secondary)',
                            borderRadius: 'var(--border-radius-md)',
                            textAlign: 'center',
                          }}
                        >
                          All characters are already in combat.
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1 mb-3">
                          {not_in_combat.map((c) => (
                            <div
                              key={c.id}
                              className="flex justify-between items-center"
                              style={{
                                padding: '8px 12px',
                                background:
                                  'var(--color-background-secondary)',
                                borderRadius: 'var(--border-radius-md)',
                              }}
                            >
                              <div className="flex items-center gap-2">
                                <div
                                  style={{
                                    width: 28,
                                    height: 28,
                                    borderRadius: '50%',
                                    background: c.avatar
                                      ? `url(${c.avatar}) center/cover no-repeat`
                                      : '#3B82F6',
                                    border: '1.5px solid #1E40AF',
                                    color: '#fff',
                                    fontWeight: 700,
                                    fontSize: 12,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                  }}
                                >
                                  {!c.avatar && c.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div className="text-[12px] font-medium">
                                    {c.name}
                                  </div>
                                  <div className="text-[10px] text-text-tertiary">
                                    {c.class}
                                    {c.level ? ` ${c.level}` : ''}
                                    {c.species ? ` · ${c.species}` : ''}
                                  </div>
                                </div>
                              </div>
                              <button
                                onClick={() => handleAddCharacter(c.id)}
                                className="bg-accent-50 border-accent-300 text-accent-900"
                                style={{ fontSize: '11px', padding: '4px 12px' }}
                              >
                                + Add
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {already_in.length > 0 && (
                        <>
                          <div className="text-[11px] text-text-tertiary mb-2 mt-3">
                            Already in combat:
                          </div>
                          <div className="flex gap-1 flex-wrap">
                            {already_in.map((c) => (
                              <span
                                key={c.id}
                                style={{
                                  fontSize: 11,
                                  padding: '3px 10px',
                                  background:
                                    'var(--color-background-secondary)',
                                  borderRadius: 12,
                                  color: 'var(--color-text-tertiary)',
                                  borderLeft: '3px solid #3B82F6',
                                }}
                              >
                                ✓ {c.name}
                              </span>
                            ))}
                          </div>
                        </>
                      )}
                    </>
                  );
                })()}
              </>
            )}
          </>
        )}

        <div
          className="mt-4 pt-3 text-[11px] text-text-tertiary"
          style={{ borderTop: '0.5px solid var(--color-border-tertiary)' }}
        >
          New combatants get auto-rolled initiative and join the existing turn order.
        </div>
      </div>

      {show_custom_form && (
        <CustomMonsterForm
          onClose={() => set_show_custom_form(false)}
          onSaved={(id) => {
            handleAddMonster(id, 1);
          }}
        />
      )}
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
        padding: '8px 16px',
        fontSize: '12px',
        background: 'transparent',
        border: 'none',
        borderBottom: active
          ? '2px solid var(--color-text-primary)'
          : '2px solid transparent',
        marginBottom: '-0.5px',
        color: active
          ? 'var(--color-text-primary)'
          : 'var(--color-text-tertiary)',
        fontWeight: active ? 500 : 400,
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  );
}
