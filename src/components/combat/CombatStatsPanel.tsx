import { useEncounterStore } from '@/store/encounterStore';
import { rollD20, rollFormula, formatRoll } from '@/engine/dice';
import { SKILLS, ABILITIES, abilityMod, formatMod, proficiencyBonusForLevel } from '@/data/skills';
import type {
  Character,
  Combatant,
  CharacterSpellcasting,
} from '@/types/app';
import type {
  Monster,
  MonsterWeaponAttack,
  MonsterSpellcasting,
} from '@/types/srd';

interface Props {
  encounter_id: string;
  combatant: Combatant;
  character?: Character | null;
  monster?: Monster | null;
}

/**
 * Combat-time stats panel: weapon attack rolls, ability/skill rolls,
 * saves, spellcasting, and generic resources. Works for any combatant
 * with structured data (PC, ally, or custom monster).
 */
export function CombatStatsPanel({
  encounter_id,
  combatant,
  character,
  monster,
}: Props) {
  const { setSpellSlotRemaining, setResourceRemaining, restCombatant } =
    useEncounterStore();

  const weapons = character?.weapons ?? monster?.weapon_attacks ?? [];
  const spellcasting: CharacterSpellcasting | MonsterSpellcasting | undefined =
    character?.spellcasting ?? monster?.spellcasting ?? undefined;

  // Abilities
  const ability_scores: Record<string, { score: number; modifier: number }> = (() => {
    if (character?.abilities) {
      const out: Record<string, { score: number; modifier: number }> = {};
      for (const k of ['str', 'dex', 'con', 'int', 'wis', 'cha'] as const) {
        const score = character.abilities[k];
        out[k] = { score, modifier: abilityMod(score) };
      }
      return out;
    }
    if (monster?.abilities) {
      const out: Record<string, { score: number; modifier: number }> = {};
      for (const k of ['str', 'dex', 'con', 'int', 'wis', 'cha'] as const) {
        out[k] = monster.abilities[k];
      }
      return out;
    }
    return {};
  })();

  const proficiency_bonus =
    character?.proficiency_bonus ??
    monster?.proficiency_bonus ??
    (character?.level ? proficiencyBonusForLevel(character.level) : 2);

  const save_profs: Set<string> = new Set(
    character?.save_proficiencies ?? Object.keys(monster?.saves ?? {})
  );

  const skill_profs: Set<string> = new Set(character?.skill_proficiencies ?? []);
  const skill_expertise: Set<string> = new Set(
    character?.skill_expertise ?? monster?.skill_expertise ?? []
  );
  if (monster?.skills) {
    for (const skill_key of Object.keys(monster.skills)) {
      skill_profs.add(skill_key);
    }
  }

  function saveBonus(ability_key: string): number {
    if (monster?.saves?.[ability_key] !== undefined) {
      return monster.saves[ability_key];
    }
    const ab = ability_scores[ability_key];
    const base = ab?.modifier ?? 0;
    return save_profs.has(ability_key) ? base + proficiency_bonus : base;
  }

  function skillBonus(skill_id: string, ability_key: string): number {
    if (monster?.skills?.[skill_id] !== undefined) {
      return monster.skills[skill_id];
    }
    const ab = ability_scores[ability_key];
    const base = ab?.modifier ?? 0;
    if (skill_expertise.has(skill_id)) return base + proficiency_bonus * 2;
    if (skill_profs.has(skill_id)) return base + proficiency_bonus;
    return base;
  }

  const has_resources = (combatant.resources_remaining ?? []).length > 0;
  const has_structured_data =
    weapons.length > 0 ||
    spellcasting !== undefined ||
    has_resources ||
    Object.keys(ability_scores).length > 0;

  if (!has_structured_data) return null;

  return (
    <div className="mt-6 flex flex-col gap-5">
      {/* Rest buttons */}
      {(has_resources || spellcasting) && (
        <div
          className="flex gap-2 items-center"
          style={{
            padding: '8px 12px',
            background: 'var(--color-background-secondary)',
            borderRadius: 'var(--border-radius-md)',
          }}
        >
          <span className="text-[12px] text-text-secondary">Rest:</span>
          <button
            onClick={() => restCombatant(encounter_id, combatant.id, 'short')}
            title="Short rest: restores short-rest resources"
            style={{ fontSize: 11, padding: '4px 10px' }}
          >
            ⏸ Short rest
          </button>
          <button
            onClick={() => restCombatant(encounter_id, combatant.id, 'long')}
            title="Long rest: restores HP, spell slots, and all resources"
            style={{ fontSize: 11, padding: '4px 10px' }}
          >
            🌙 Long rest
          </button>
        </div>
      )}

      {/* Resources (Rage, Ki, Sorcery Points, etc.) */}
      {has_resources && (
        <ResourcesPanel
          combatant={combatant}
          onSetRemaining={(rid, n) =>
            setResourceRemaining(encounter_id, combatant.id, rid, n)
          }
        />
      )}

      {/* Abilities + Saves */}
      {Object.keys(ability_scores).length > 0 && (
        <AbilitiesAndSaves
          combatant_name={combatant.name}
          ability_scores={ability_scores}
          save_profs={save_profs}
          encounter_id={encounter_id}
          saveBonus={saveBonus}
        />
      )}

      {/* Skills */}
      {Object.keys(ability_scores).length > 0 && (
        <Skills
          combatant_name={combatant.name}
          encounter_id={encounter_id}
          skill_profs={skill_profs}
          skill_expertise={skill_expertise}
          skillBonus={skillBonus}
        />
      )}

      {/* Weapons */}
      {weapons.length > 0 && (
        <Weapons
          combatant_name={combatant.name}
          encounter_id={encounter_id}
          weapons={weapons}
        />
      )}

      {/* Spellcasting */}
      {spellcasting && (
        <Spellcasting
          encounter_id={encounter_id}
          combatant={combatant}
          spellcasting={spellcasting}
          onSetSlotRemaining={(level, n) =>
            setSpellSlotRemaining(encounter_id, combatant.id, level, n)
          }
        />
      )}
    </div>
  );
}

// =============================================================================
// Resources (Rage, Ki, etc.) - generic tracker
// =============================================================================

function ResourcesPanel({
  combatant,
  onSetRemaining,
}: {
  combatant: Combatant;
  onSetRemaining: (resource_id: string, new_remaining: number) => void;
}) {
  const resources = combatant.resources_remaining ?? [];
  return (
    <div>
      <h3 className="text-[13px] font-medium mb-2">Resources</h3>
      <div className="flex flex-col gap-1">
        {resources.map((r) => (
          <div
            key={r.id}
            className="flex items-center justify-between"
            style={{
              padding: '6px 10px',
              background: 'var(--color-background-secondary)',
              borderRadius: 'var(--border-radius-sm)',
            }}
            title={r.description}
          >
            <span className="text-[12px]">
              <strong className="font-medium">{r.name}</strong>{' '}
              <span className="text-text-tertiary">
                ({r.remaining}/{r.total})
              </span>
              <span className="text-text-tertiary text-[10px] ml-2">
                · {r.recharge.replace('_', ' ')}
              </span>
            </span>
            <div className="flex gap-1 items-center">
              {/* Visual pips */}
              <div className="flex gap-0.5 mr-2">
                {Array.from({ length: r.total }).map((_, i) => (
                  <span
                    key={i}
                    style={{
                      display: 'inline-block',
                      width: 9,
                      height: 9,
                      borderRadius: '50%',
                      background:
                        i < r.remaining
                          ? 'var(--color-text-info)'
                          : 'transparent',
                      border: '1px solid var(--color-border-tertiary)',
                    }}
                  />
                ))}
              </div>
              <button
                onClick={() => onSetRemaining(r.id, r.remaining - 1)}
                disabled={r.remaining === 0}
                style={{ fontSize: 11, padding: '2px 8px', lineHeight: 1 }}
                title="Use one"
              >
                Use −
              </button>
              <button
                onClick={() => onSetRemaining(r.id, r.remaining + 1)}
                disabled={r.remaining === r.total}
                style={{ fontSize: 11, padding: '2px 8px', lineHeight: 1 }}
                title="Restore one"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// Abilities + Saves
// =============================================================================

function AbilitiesAndSaves({
  combatant_name,
  ability_scores,
  save_profs,
  encounter_id,
  saveBonus,
}: {
  combatant_name: string;
  ability_scores: Record<string, { score: number; modifier: number }>;
  save_profs: Set<string>;
  encounter_id: string;
  saveBonus: (ability_key: string) => number;
}) {
  const { log } = useEncounterStore();
  return (
    <div>
      <h3 className="text-[13px] font-medium mb-2">Abilities & Saves</h3>
      <div
        className="grid gap-1"
        style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}
      >
        {ABILITIES.map((ab) => {
          const score = ability_scores[ab.id];
          if (!score) return null;
          const check_mod = score.modifier;
          const save_mod = saveBonus(ab.id);
          const is_save_prof = save_profs.has(ab.id);
          return (
            <div
              key={ab.id}
              className="flex items-center justify-between"
              style={{
                padding: '6px 10px',
                background: 'var(--color-background-secondary)',
                borderRadius: 'var(--border-radius-sm)',
              }}
            >
              <div>
                <div className="text-[11px] font-medium uppercase tracking-wider text-text-tertiary">
                  {ab.id}
                </div>
                <div className="text-[12px]">
                  {score.score} ({formatMod(score.modifier)})
                </div>
              </div>
              <div className="flex gap-1">
                <RollButton
                  label="Check"
                  bonus={check_mod}
                  onRoll={(r) => {
                    log(
                      encounter_id,
                      `${combatant_name} ${ab.name} check: ${formatRoll(r)}${
                        r.is_critical ? ' (NAT 20!)' : r.is_fumble ? ' (NAT 1!)' : ''
                      }`
                    );
                  }}
                />
                <RollButton
                  label={is_save_prof ? 'Save ✓' : 'Save'}
                  bonus={save_mod}
                  highlighted={is_save_prof}
                  onRoll={(r) => {
                    log(
                      encounter_id,
                      `${combatant_name} ${ab.name} save: ${formatRoll(r)}${
                        r.is_critical ? ' (NAT 20!)' : r.is_fumble ? ' (NAT 1!)' : ''
                      }`
                    );
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// =============================================================================
// Skills
// =============================================================================

function Skills({
  combatant_name,
  encounter_id,
  skill_profs,
  skill_expertise,
  skillBonus,
}: {
  combatant_name: string;
  encounter_id: string;
  skill_profs: Set<string>;
  skill_expertise: Set<string>;
  skillBonus: (skill_id: string, ability_key: string) => number;
}) {
  const { log } = useEncounterStore();
  const proficient_skills = SKILLS.filter(
    (s) => skill_profs.has(s.id) || skill_expertise.has(s.id)
  );

  if (proficient_skills.length === 0) {
    return (
      <details>
        <summary
          className="text-[13px] font-medium cursor-pointer"
          style={{ marginBottom: 8 }}
        >
          Skills{' '}
          <span className="text-text-tertiary text-[11px] font-normal">
            (no proficiencies — click to roll any)
          </span>
        </summary>
        <SkillGrid
          skills={SKILLS as unknown as { id: string; name: string; ability: string }[]}
          combatant_name={combatant_name}
          encounter_id={encounter_id}
          skill_profs={skill_profs}
          skill_expertise={skill_expertise}
          skillBonus={skillBonus}
          log={log}
        />
      </details>
    );
  }

  return (
    <div>
      <h3 className="text-[13px] font-medium mb-2">Skills</h3>
      <SkillGrid
        skills={proficient_skills as unknown as { id: string; name: string; ability: string }[]}
        combatant_name={combatant_name}
        encounter_id={encounter_id}
        skill_profs={skill_profs}
        skill_expertise={skill_expertise}
        skillBonus={skillBonus}
        log={log}
      />
      <details className="mt-2">
        <summary className="text-[11px] cursor-pointer text-text-tertiary">
          Show all skills
        </summary>
        <div className="mt-2">
          <SkillGrid
            skills={
              SKILLS.filter(
                (s) => !skill_profs.has(s.id) && !skill_expertise.has(s.id)
              ) as unknown as { id: string; name: string; ability: string }[]
            }
            combatant_name={combatant_name}
            encounter_id={encounter_id}
            skill_profs={skill_profs}
            skill_expertise={skill_expertise}
            skillBonus={skillBonus}
            log={log}
          />
        </div>
      </details>
    </div>
  );
}

function SkillGrid({
  skills,
  combatant_name,
  encounter_id,
  skill_profs,
  skill_expertise,
  skillBonus,
  log,
}: {
  skills: { id: string; name: string; ability: string }[];
  combatant_name: string;
  encounter_id: string;
  skill_profs: Set<string>;
  skill_expertise: Set<string>;
  skillBonus: (skill_id: string, ability_key: string) => number;
  log: (encounter_id: string, message: string) => void;
}) {
  return (
    <div
      className="grid gap-1"
      style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}
    >
      {skills.map((s) => {
        const bonus = skillBonus(s.id, s.ability);
        const is_expert = skill_expertise.has(s.id);
        const is_prof = skill_profs.has(s.id);
        return (
          <div
            key={s.id}
            className="flex justify-between items-center"
            style={{
              padding: '5px 10px',
              background: 'var(--color-background-secondary)',
              borderRadius: 'var(--border-radius-sm)',
            }}
          >
            <div className="text-[11.5px]">
              <span
                style={{
                  color: is_expert
                    ? 'var(--color-text-info)'
                    : is_prof
                    ? 'var(--color-text-primary)'
                    : 'var(--color-text-tertiary)',
                  fontWeight: is_prof ? 500 : 400,
                }}
              >
                {is_expert ? '★ ' : is_prof ? '✓ ' : ''}
                {s.name}
              </span>
              <span className="text-text-tertiary text-[10px] ml-1">
                ({s.ability})
              </span>
            </div>
            <RollButton
              label={formatMod(bonus)}
              bonus={bonus}
              compact
              onRoll={(r) => {
                log(
                  encounter_id,
                  `${combatant_name} ${s.name}: ${formatRoll(r)}${
                    r.is_critical ? ' (NAT 20!)' : r.is_fumble ? ' (NAT 1!)' : ''
                  }`
                );
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

// =============================================================================
// Weapons
// =============================================================================

function Weapons({
  combatant_name,
  encounter_id,
  weapons,
}: {
  combatant_name: string;
  encounter_id: string;
  weapons: (NonNullable<Character['weapons']>[number] | MonsterWeaponAttack)[];
}) {
  const { log } = useEncounterStore();
  return (
    <div>
      <h3 className="text-[13px] font-medium mb-2">
        Weapon attacks
        <span className="text-text-tertiary text-[11px] font-normal ml-2">
          (click to roll)
        </span>
      </h3>
      <div className="flex flex-col gap-2">
        {weapons.map((w, i) => {
          const range = (w as MonsterWeaponAttack).range;
          const mastery = (w as NonNullable<Character['weapons']>[number]).mastery;
          return (
            <div
              key={i}
              style={{
                padding: '8px 12px',
                background: 'var(--color-background-secondary)',
                borderRadius: 'var(--border-radius-sm)',
              }}
            >
              <div className="flex items-baseline justify-between mb-2">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <strong className="text-[12px] font-medium">{w.name}</strong>
                  <span className="text-[10.5px] text-text-tertiary">
                    {formatMod(w.attack_bonus)} to hit · {w.damage}{' '}
                    {w.damage_type}
                    {range && ` · ${range}`}
                    {mastery && (
                      <span className="ml-1 text-text-info">[{mastery}]</span>
                    )}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const r = rollD20(w.attack_bonus);
                    log(
                      encounter_id,
                      `${combatant_name} attacks with ${w.name}: ${formatRoll(r)}${
                        r.is_critical ? ' (CRITICAL!)' : r.is_fumble ? ' (FUMBLE!)' : ''
                      }`
                    );
                  }}
                  style={{
                    flex: 1,
                    fontSize: 11,
                    padding: '5px 10px',
                    background: 'var(--color-background-primary)',
                  }}
                  title={`Roll d20${formatMod(w.attack_bonus)}`}
                >
                  ⚔ Attack
                </button>
                <button
                  onClick={() => {
                    try {
                      const r = rollFormula(w.damage);
                      log(
                        encounter_id,
                        `${combatant_name} ${w.name} damage: ${formatRoll(r)} ${w.damage_type}`
                      );
                    } catch {
                      alert(`Couldn't parse damage formula "${w.damage}".`);
                    }
                  }}
                  style={{
                    flex: 1,
                    fontSize: 11,
                    padding: '5px 10px',
                    background: 'var(--color-background-primary)',
                  }}
                  title={`Roll ${w.damage}`}
                >
                  🩸 Damage
                </button>
                <button
                  onClick={() => {
                    try {
                      const doubled = doubleDamageDice(w.damage);
                      const r = rollFormula(doubled);
                      log(
                        encounter_id,
                        `${combatant_name} ${w.name} CRITICAL damage (${doubled}): ${formatRoll(r)} ${w.damage_type}`
                      );
                    } catch {
                      alert(`Couldn't parse damage for crit: "${w.damage}"`);
                    }
                  }}
                  style={{
                    fontSize: 11,
                    padding: '5px 10px',
                    background: '#FCEBEB',
                    borderColor: '#F09595',
                    color: '#501313',
                  }}
                  title={`Crit damage: doubles dice in ${w.damage}`}
                >
                  💥 Crit
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function doubleDamageDice(formula: string): string {
  return formula.replace(/(\d+)d(\d+)/g, (_match, count, sides) => {
    return `${parseInt(count, 10) * 2}d${sides}`;
  });
}

// =============================================================================
// Spellcasting
// =============================================================================

function Spellcasting({
  encounter_id,
  combatant,
  spellcasting,
  onSetSlotRemaining,
}: {
  encounter_id: string;
  combatant: Combatant;
  spellcasting: CharacterSpellcasting | MonsterSpellcasting;
  onSetSlotRemaining: (level: number, n: number) => void;
}) {
  const { log } = useEncounterStore();
  const sc_slots = (spellcasting as CharacterSpellcasting).slots ?? [];
  const slots_state = combatant.spell_slots_remaining ?? sc_slots;
  const cantrips: string[] =
    (spellcasting as CharacterSpellcasting).cantrips ?? [];
  const spells_known: string[] =
    (spellcasting as CharacterSpellcasting).spells_known ?? [];
  const ability = (spellcasting.ability ?? 'int').toString();
  const save_dc = spellcasting.save_dc ?? 0;
  const attack_bonus = spellcasting.attack_bonus ?? 0;

  if (!save_dc && !attack_bonus && slots_state.length === 0 && cantrips.length === 0 && spells_known.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className="text-[13px] font-medium mb-2">
        Spellcasting
        <span className="text-text-tertiary text-[11px] font-normal ml-2">
          ({ability.toUpperCase()} · DC {save_dc} ·{' '}
          attack {formatMod(attack_bonus)})
        </span>
      </h3>

      <div
        className="flex gap-2 mb-3"
        style={{
          padding: '6px 10px',
          background: 'var(--color-background-secondary)',
          borderRadius: 'var(--border-radius-sm)',
        }}
      >
        <RollButton
          label={`Spell attack ${formatMod(attack_bonus)}`}
          bonus={attack_bonus}
          onRoll={(r) => {
            log(
              encounter_id,
              `${combatant.name} spell attack: ${formatRoll(r)}${
                r.is_critical ? ' (CRIT!)' : r.is_fumble ? ' (FUMBLE!)' : ''
              }`
            );
          }}
        />
        <span className="text-[11px] text-text-tertiary self-center">
          Save DC: <strong>{save_dc}</strong>
        </span>
      </div>

      {cantrips.length > 0 && (
        <div className="mb-3">
          <div className="text-[11px] font-medium text-text-secondary mb-1">
            Cantrips
          </div>
          <div className="flex flex-wrap gap-1">
            {cantrips.map((c: string, i: number) => (
              <span
                key={i}
                style={{
                  fontSize: 11,
                  padding: '2px 8px',
                  background: 'var(--color-background-info)',
                  color: 'var(--color-text-info)',
                  borderRadius: 12,
                }}
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      )}

      {slots_state.length > 0 && (
        <div className="mb-3">
          <div className="text-[11px] font-medium text-text-secondary mb-1">
            Spell slots
          </div>
          <div className="flex flex-col gap-1">
            {slots_state.map((slot: import('@/types/app').SpellSlotState) => (
              <div
                key={slot.level}
                className="flex items-center justify-between"
                style={{
                  padding: '5px 10px',
                  background: 'var(--color-background-secondary)',
                  borderRadius: 'var(--border-radius-sm)',
                }}
              >
                <span className="text-[11.5px]">
                  Level {slot.level}{' '}
                  <span className="text-text-tertiary">
                    ({slot.remaining}/{slot.total})
                  </span>
                </span>
                <div className="flex gap-1 items-center">
                  <div className="flex gap-0.5 mr-2">
                    {Array.from({ length: slot.total }).map((_, i) => (
                      <span
                        key={i}
                        style={{
                          display: 'inline-block',
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background:
                            i < slot.remaining
                              ? 'var(--color-text-info)'
                              : 'transparent',
                          border: '1px solid var(--color-border-tertiary)',
                        }}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => onSetSlotRemaining(slot.level, slot.remaining - 1)}
                    disabled={slot.remaining === 0}
                    style={{ fontSize: 11, padding: '2px 8px', lineHeight: 1 }}
                  >
                    Use −
                  </button>
                  <button
                    onClick={() => onSetSlotRemaining(slot.level, slot.remaining + 1)}
                    disabled={slot.remaining === slot.total}
                    style={{ fontSize: 11, padding: '2px 8px', lineHeight: 1 }}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {spells_known.length > 0 && (
        <div>
          <div className="text-[11px] font-medium text-text-secondary mb-1">
            Spells known / prepared
          </div>
          <div className="flex flex-wrap gap-1">
            {spells_known.map((s: string, i: number) => (
              <span
                key={i}
                style={{
                  fontSize: 11,
                  padding: '2px 8px',
                  background: 'var(--color-background-secondary)',
                  borderRadius: 12,
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// Roll button helper
// =============================================================================

function RollButton({
  label,
  bonus,
  highlighted,
  compact,
  onRoll,
}: {
  label: string;
  bonus: number;
  highlighted?: boolean;
  compact?: boolean;
  onRoll: (r: ReturnType<typeof rollD20>) => void;
}) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        const mode = e.shiftKey
          ? 'advantage'
          : e.altKey
          ? 'disadvantage'
          : 'normal';
        const r = rollD20(bonus, mode);
        onRoll(r);
      }}
      title={`Click: roll d20${formatMod(bonus)}\nShift+Click: advantage\nAlt+Click: disadvantage`}
      style={{
        fontSize: compact ? 10 : 11,
        padding: compact ? '2px 6px' : '3px 8px',
        minWidth: compact ? 36 : 56,
        background: highlighted
          ? 'var(--color-background-info)'
          : 'var(--color-background-primary)',
        color: highlighted ? 'var(--color-text-info)' : undefined,
        fontWeight: highlighted ? 500 : 400,
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </button>
  );
}
