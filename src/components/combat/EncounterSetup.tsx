import { useState, useMemo } from 'react';
import { useEncounterStore } from '@/store/encounterStore';
import { useSRDStore } from '@/store/srdStore';
import { useCustomMonsterStore } from '@/store/customMonsterStore';
import { useAlliesStore } from '@/store/alliesStore';
import { CustomMonsterForm } from '@/components/bestiary/CustomMonsterForm';
import { rollD20 } from '@/engine/dice';
import {
  characterToCombatant,
  monsterToCombatant,
  allyToCombatant,
} from '@/pages/CombatPage';
import type { Encounter, Campaign } from '@/types/app';

interface Props {
  encounter: Encounter;
  campaign: Campaign;
  onStart: () => void;
  onExit: () => void;
}

export function EncounterSetup({ encounter, campaign, onStart, onExit }: Props) {
  const { addCombatant, removeCombatant, updateCombatant } = useEncounterStore();
  const { monsters: srd_monsters } = useSRDStore();
  const { monsters: custom_monsters } = useCustomMonsterStore();
  const { allies } = useAlliesStore();
  const all_monsters = useMemo(
    () => [...custom_monsters, ...srd_monsters],
    [custom_monsters, srd_monsters]
  );

  const [monster_search, set_monster_search] = useState('');
  const [ally_search, set_ally_search] = useState('');
  const [show_custom_form, set_show_custom_form] = useState(false);

  // Characters not yet added
  const added_character_ids = useMemo(
    () =>
      new Set(
        encounter.combatants
          .filter((c) => c.source_type === 'character')
          .map((c) => c.source_id)
      ),
    [encounter.combatants]
  );

  const available_characters = campaign.characters.filter(
    (c) => !added_character_ids.has(c.id)
  );

  // Monster search results
  const monster_results = useMemo(() => {
    if (!monster_search.trim()) return [];
    const q = monster_search.toLowerCase();
    return all_monsters
      .filter((m) => m.name.toLowerCase().includes(q))
      .slice(0, 10);
  }, [all_monsters, monster_search]);

  // Ally search results
  const ally_results = useMemo(() => {
    if (!ally_search.trim()) return allies.slice(0, 10);
    const q = ally_search.toLowerCase();
    return allies.filter((a) => a.name.toLowerCase().includes(q)).slice(0, 10);
  }, [allies, ally_search]);

  const handleAddCharacter = (character_id: string) => {
    const character = campaign.characters.find((c) => c.id === character_id);
    if (!character) return;
    const init = rollD20(character.initiative_bonus).total;
    const combatant = characterToCombatant(character, init);
    addCombatant(encounter.id, combatant);
    // If character has avatar, save it as the token style
    if (character.avatar) {
      useEncounterStore.getState().setTokenStyle(encounter.id, {
        combatant_id: combatant.id,
        avatar: character.avatar,
      });
    }
  };

  const handleAddAllCharacters = () => {
    available_characters.forEach((c) => handleAddCharacter(c.id));
  };

  const handleAddMonster = (monster_id: string, count: number = 1) => {
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
      // If monster has avatar (custom monster), save it as the token style
      if (monster.avatar) {
        useEncounterStore.getState().setTokenStyle(encounter.id, {
          combatant_id: combatant.id,
          avatar: monster.avatar,
        });
      }
    }
  };

  const handleAddAlly = (ally_id: string, count: number = 1) => {
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
      // If ally has avatar, save it as the token style
      if (ally.avatar) {
        useEncounterStore.getState().setTokenStyle(encounter.id, {
          combatant_id: combatant.id,
          avatar: ally.avatar,
        });
      }
    }
  };

  const can_start =
    encounter.combatants.length >= 2 &&
    encounter.combatants.some((c) => c.is_player) &&
    encounter.combatants.some((c) => !c.is_player);

  return (
    <div className="p-8 max-w-[1100px]">
      <div className="flex items-center gap-3 mb-2">
        <button onClick={onExit} style={{ padding: '4px 10px', fontSize: '12px' }}>
          ← Back
        </button>
        <span className="text-[11px] text-text-tertiary">{campaign.name}</span>
      </div>
      <h2 className="mb-6">{encounter.name} — Setup</h2>

      <div
        className="grid gap-6"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}
      >
        {/* LEFT: Add party */}
        <div>
          <h3 className="mb-3">Add party</h3>
          {available_characters.length === 0 ? (
            <div className="text-text-tertiary text-[12px] italic">
              {campaign.characters.length === 0
                ? 'No characters in this campaign yet. Add some on the Characters page.'
                : 'All characters already added.'}
            </div>
          ) : (
            <>
              <button
                onClick={handleAddAllCharacters}
                className="mb-3 bg-accent-50 border-accent-300 text-accent-900"
                style={{ padding: '6px 12px', fontSize: '12px' }}
              >
                + Add all {available_characters.length} characters (auto-roll init)
              </button>
              <div className="flex flex-col gap-2">
                {available_characters.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleAddCharacter(c.id)}
                    className="text-left"
                    style={{
                      padding: '8px 12px',
                      fontSize: '12px',
                    }}
                  >
                    + {c.name}{' '}
                    <span className="text-text-tertiary">
                      ({c.class || 'PC'}, HP {c.hp_max}, AC {c.ac})
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}

          <div className="flex justify-between items-center mt-6 mb-3">
            <h3 className="m-0">Add monsters</h3>
            <button
              onClick={() => set_show_custom_form(true)}
              style={{ fontSize: '11px', padding: '4px 10px' }}
            >
              + Create custom
            </button>
          </div>
          <input
            type="text"
            placeholder="Search SRD + custom monsters..."
            value={monster_search}
            onChange={(e) => set_monster_search(e.target.value)}
            className="w-full mb-2"
          />
          {monster_search && monster_results.length > 0 && (
            <div className="flex flex-col gap-1">
              {monster_results.map((m) => {
                const is_custom = m.source === 'Custom';
                return (
                  <div
                    key={m.id}
                    className="flex justify-between items-center"
                    style={{
                      padding: '8px 12px',
                      border: '0.5px solid var(--color-border-tertiary)',
                      borderRadius: 'var(--border-radius-md)',
                      background: 'var(--color-background-primary)',
                    }}
                  >
                    <div>
                      <div className={`text-[12px] ${is_custom ? 'italic' : ''}`}>
                        {is_custom && '★ '}
                        {m.name}
                      </div>
                      <div className="text-[10px] text-text-tertiary">
                        CR {m.cr} · HP {m.hp} · AC {m.ac}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleAddMonster(m.id, 1)}
                        style={{ fontSize: '11px', padding: '4px 8px' }}
                      >
                        +1
                      </button>
                      <button
                        onClick={() => handleAddMonster(m.id, 3)}
                        style={{ fontSize: '11px', padding: '4px 8px' }}
                      >
                        +3
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Add allies section */}
          <div className="flex justify-between items-center mt-6 mb-3">
            <h3 className="m-0">Add allies & summons</h3>
            <span className="text-[10px] text-text-tertiary">
              (manage in sidebar → Allies & Summons)
            </span>
          </div>
          {allies.length === 0 ? (
            <div className="text-[11px] text-text-tertiary italic px-2 py-2">
              No allies yet. Create some on the Allies & Summons page first.
            </div>
          ) : (
            <>
              <input
                type="text"
                placeholder="Search allies..."
                value={ally_search}
                onChange={(e) => set_ally_search(e.target.value)}
                className="w-full mb-2"
              />
              <div className="flex flex-col gap-1">
                {ally_results.map((a) => (
                  <div
                    key={a.id}
                    className="flex justify-between items-center"
                    style={{
                      padding: '8px 12px',
                      border: '0.5px solid var(--color-border-tertiary)',
                      borderRadius: 'var(--border-radius-md)',
                      background: 'var(--color-background-primary)',
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
                        <div className="text-[12px]">{a.name}</div>
                        <div className="text-[10px] text-text-tertiary">
                          CR {a.cr} · HP {a.hp} · AC {a.ac} · {a.size} {a.type}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleAddAlly(a.id, 1)}
                        style={{ fontSize: '11px', padding: '4px 8px' }}
                      >
                        +1
                      </button>
                      <button
                        onClick={() => handleAddAlly(a.id, 3)}
                        style={{ fontSize: '11px', padding: '4px 8px' }}
                      >
                        +3
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* RIGHT: Initiative list */}
        <div>
          <h3 className="mb-3">
            Combatants ({encounter.combatants.length})
          </h3>
          {encounter.combatants.length === 0 ? (
            <div className="text-text-tertiary text-[12px] italic">
              Add party members and monsters to get started.
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {[...encounter.combatants]
                .sort((a, b) => b.initiative - a.initiative)
                .map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center gap-2 min-w-0"
                    style={{
                      padding: '8px 12px',
                      border: '0.5px solid var(--color-border-tertiary)',
                      borderRadius: 'var(--border-radius-md)',
                      background: c.is_player
                        ? 'var(--color-background-info)'
                        : 'var(--color-background-secondary)',
                    }}
                  >
                    <input
                      type="number"
                      value={c.initiative}
                      onChange={(e) =>
                        updateCombatant(encounter.id, c.id, {
                          initiative: parseInt(e.target.value, 10) || 0,
                        })
                      }
                      className="shrink-0"
                      aria-label={`${c.name} initiative`}
                      style={{
                        width: '64px',
                        minWidth: '64px',
                        height: '34px',
                        boxSizing: 'border-box',
                        padding: '0 8px',
                        textAlign: 'center',
                        fontSize: '13px',
                        lineHeight: '34px',
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    />
                    <span className="text-[12px] flex-1">{c.name}</span>
                    <span className="text-[11px] text-text-tertiary">
                      HP {c.hp_max}
                    </span>
                    <button
                      onClick={() => removeCombatant(encounter.id, c.id)}
                      className="text-text-tertiary"
                      style={{
                        border: 'none',
                        background: 'transparent',
                        padding: '0 6px',
                        cursor: 'pointer',
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
            </div>
          )}

          <button
            onClick={onStart}
            disabled={!can_start}
            className="mt-6 w-full bg-accent-50 border-accent-300 text-accent-900 font-medium"
            style={{ padding: '12px', fontSize: '14px' }}
          >
            {can_start
              ? 'Start combat →'
              : 'Add at least 1 player and 1 monster'}
          </button>
        </div>
      </div>

      {show_custom_form && (
        <CustomMonsterForm
          onClose={() => set_show_custom_form(false)}
          onSaved={(id) => {
            // After saving, add 1 to the encounter
            handleAddMonster(id, 1);
          }}
        />
      )}
    </div>
  );
}
