// Build prompts for monster / ally tactics suggestions.

import type { Combatant, Encounter, MovementSpeeds } from '@/types/app';
import type { Monster, MonsterFeature, MonsterSpeed } from '@/types/srd';
import { formatMovementSpeeds, getEffectiveMovementSpeeds } from '@/utils/movement';

interface BuildPromptArgs {
  monster: Monster;
  combatant: Combatant;
  encounter: Encounter;
  language: 'magyar' | 'english';
}

function formatSpeed(speed: MonsterSpeed | undefined, default_unit: string): string {
  if (typeof speed === 'string') return speed.trim() || `30${default_unit}`;
  if (!speed) return `30${default_unit}`;
  const parts: string[] = [];
  if (speed.walk !== undefined) parts.push(`${speed.walk}${default_unit}`);
  for (const [mode, val] of Object.entries(speed)) {
    if (mode === 'walk') continue;
    parts.push(`${mode} ${val}${default_unit}`);
  }
  return parts.length > 0 ? parts.join(', ') : `30${default_unit}`;
}

function mod(n: number | undefined): string {
  const v = Number(n ?? 0);
  return v >= 0 ? `+${v}` : String(v);
}

function yesNo(value: boolean, language: 'magyar' | 'english'): string {
  return value ? (language === 'magyar' ? 'igen' : 'yes') : (language === 'magyar' ? 'nem' : 'no');
}

function hpStatus(combatant: Combatant, language: 'magyar' | 'english'): string {
  const hp_pct = Math.round((combatant.hp_current / Math.max(1, combatant.hp_max)) * 100);
  if (language === 'magyar') {
    if (hp_pct >= 75) return 'sértetlen';
    if (hp_pct >= 50) return 'megsebesült';
    if (hp_pct >= 25) return 'súlyosan sérült';
    return 'haldoklik';
  }
  if (hp_pct >= 75) return 'healthy';
  if (hp_pct >= 50) return 'wounded';
  if (hp_pct >= 25) return 'severely wounded';
  return 'near death';
}

function formatFeatureList(label: string, features: MonsterFeature[] | undefined): string {
  const items = features ?? [];
  if (items.length === 0) return `${label}: none`;
  return `${label}:\n${items
    .map((f) => `- ${f.name || '(unnamed)'}: ${f.description || '(no description)'}`)
    .join('\n')}`;
}

function formatRecord(label: string, data: Record<string, number> | undefined): string {
  const entries = Object.entries(data ?? {});
  if (entries.length === 0) return `${label}: none`;
  return `${label}: ${entries.map(([k, v]) => `${k} ${mod(v)}`).join(', ')}`;
}

function formatList(label: string, data: string[] | undefined): string {
  const list = data ?? [];
  return `${label}: ${list.length ? list.join(', ') : 'none'}`;
}

function formatSpellcasting(monster: Monster): string {
  const sc = monster.spellcasting;
  if (!sc) return 'none';
  const parts: string[] = [];
  if (sc.ability) parts.push(`ability ${sc.ability.toUpperCase()}`);
  if (sc.save_dc !== undefined) parts.push(`save DC ${sc.save_dc}`);
  if (sc.attack_bonus !== undefined) parts.push(`spell attack ${mod(sc.attack_bonus)}`);
  if (sc.caster_level !== undefined) parts.push(`caster level ${sc.caster_level}`);
  if (sc.spell_ids?.length) parts.push(`spell ids/known: ${sc.spell_ids.join(', ')}`);
  if (sc.cantrips?.length) parts.push(`cantrips: ${sc.cantrips.join(', ')}`);
  if (sc.spells_known?.length) parts.push(`spells known: ${sc.spells_known.join(', ')}`);
  if (sc.slots?.length) parts.push(`slots: ${sc.slots.map((s) => `L${s.level} ${s.remaining}/${s.total}`).join(', ')}`);
  if (sc.notes) parts.push(`notes: ${sc.notes}`);
  return parts.length ? parts.join('; ') : 'none';
}

function formatWeaponAttacks(monster: Monster): string {
  const attacks = monster.weapon_attacks ?? [];
  if (attacks.length === 0) return 'Structured weapon attacks: none';
  return `Structured weapon attacks:\n${attacks
    .map((a) => `- ${a.name}: ${mod(a.attack_bonus)} to hit, ${a.damage} ${a.damage_type}, range ${a.range}${a.notes ? `, notes: ${a.notes}` : ''}`)
    .join('\n')}`;
}

function formatResources(monster: Monster): string {
  const resources = monster.resources ?? [];
  if (resources.length === 0) return 'Resources: none';
  return `Resources: ${resources
    .map((r) => `${r.name} ${r.remaining}/${r.total} recharge ${r.recharge}${r.description ? ` (${r.description})` : ''}`)
    .join('; ')}`;
}

function sideOf(c: Combatant): 'party' | 'monsters' {
  return c.is_player || c.is_ally || c.source_type === 'ally' ? 'party' : 'monsters';
}

function sideLabel(c: Combatant, language: 'magyar' | 'english'): string {
  if (c.is_player) return language === 'magyar' ? 'játékos karakter / party' : 'player character / party';
  if (c.is_ally || c.source_type === 'ally') return language === 'magyar' ? 'ally/summon / party csapattárs' : 'ally/summon / party teammate';
  return language === 'magyar' ? 'ellenséges szörny' : 'enemy monster';
}

function formatConditions(c: Combatant): string {
  return c.conditions.length > 0
    ? c.conditions
        .map((cnd) => `${cnd.condition_id}${cnd.remaining_rounds !== undefined ? ` ${cnd.remaining_rounds}r` : ''}`)
        .join(', ')
    : 'none';
}

function formatCombatantLine(c: Combatant, language: 'magyar' | 'english'): string {
  const speeds = formatMovementSpeeds(getEffectiveMovementSpeeds(c));
  return `- ${c.name} [${sideLabel(c, language)}] AC ${c.ac}, HP ${c.hp_current}/${c.hp_max} + temp ${c.hp_temp}, ${hpStatus(c, language)}, init ${c.initiative}, speeds ${speeds}, movement used ${c.movement_used ?? 0} ft, conditions: ${formatConditions(c)}, action used ${yesNo(c.action_used, language)}, bonus used ${yesNo(c.bonus_action_used, language)}, reaction used ${yesNo(c.reaction_used, language)}`;
}

function formatMonsterFullStatblock(monster: Monster, combatant: Combatant): string {
  const ability_str = ['str', 'dex', 'con', 'int', 'wis', 'cha']
    .map((ab) => {
      const m = monster.abilities[ab as keyof typeof monster.abilities];
      return `${ab.toUpperCase()} ${m.score} (${mod(m.modifier)})`;
    })
    .join(', ');

  const base_speeds: MovementSpeeds = combatant.movement_speeds ?? {};
  const current_speeds = getEffectiveMovementSpeeds(combatant);

  return [
    `Name: ${monster.name}`,
    `Combat name: ${combatant.name}`,
    `Side: ${sideOf(combatant) === 'party' ? 'party / ally' : 'enemy monsters'}`,
    `Size/type/alignment: ${monster.size ?? 'unknown'} ${monster.type ?? 'unknown'}${monster.subtype ? ` (${monster.subtype})` : ''}, ${monster.alignment ?? 'unknown'}`,
    `CR/XP/source: ${monster.cr ?? 'unknown'} / ${monster.xp ?? 'unknown'} / ${monster.source ?? 'unknown'}`,
    `HP: ${combatant.hp_current}/${combatant.hp_max} + temp ${combatant.hp_temp}; statblock HP ${monster.hp ?? 'unknown'} (${monster.hp_formula ?? 'no formula'})`,
    `AC: ${combatant.ac}; statblock AC ${monster.ac ?? 'unknown'}`,
    `Initiative: combat ${combatant.initiative}; statblock ${monster.initiative ? `${mod(monster.initiative.modifier)}${monster.initiative.score !== null ? ` score ${monster.initiative.score}` : ''}` : 'unknown'}`,
    `Speed from statblock: ${formatSpeed(monster.speed, ' ft')}`,
    `Base combat speeds: ${formatMovementSpeeds(base_speeds)}`,
    `Current effective combat speeds: ${formatMovementSpeeds(current_speeds)}`,
    `Movement already used this turn: ${combatant.movement_used ?? 0} ft`,
    `Abilities: ${ability_str}`,
    formatRecord('Saving throws', monster.saves),
    formatRecord('Skills', monster.skills),
    formatRecord('Senses', monster.senses),
    `Passive Perception: ${monster.passive_perception ?? 'unknown'}`,
    formatList('Languages', monster.languages),
    formatList('Damage resistances', monster.damage_resistances),
    formatList('Damage immunities', monster.damage_immunities),
    formatList('Damage vulnerabilities', monster.damage_vulnerabilities),
    formatList('Condition immunities', monster.condition_immunities),
    formatList('Gear', monster.gear),
    formatFeatureList('Traits', monster.traits),
    formatFeatureList('Actions', monster.actions),
    formatFeatureList('Bonus actions', monster.bonus_actions),
    formatFeatureList('Reactions', monster.reactions),
    formatFeatureList('Legendary actions', monster.legendary_actions),
    `Spellcasting: ${formatSpellcasting(monster)}`,
    formatWeaponAttacks(monster),
    formatResources(monster),
    `Character-like mode: ${monster.statblock_mode ?? 'monster'}`,
    monster.character_build ? `Character build JSON: ${JSON.stringify(monster.character_build)}` : 'Character build: none',
    monster.origin_selection ? `Origin selection JSON: ${JSON.stringify(monster.origin_selection)}` : 'Origin selection: none',
  ].join('\n');
}

/**
 * System prompt: establish the AI's role and the EXACT output format.
 */
function buildSystemPrompt(language: 'magyar' | 'english'): string {
  if (language === 'magyar') {
    return `Te egy tapasztalt Dungeons & Dragons 2024 Dungeon Master vagy. Egy szörny vagy ally/summon köre alatt javasolsz taktikát és színes narratívát.

A válaszodat MINDIG pontosan ebben a formátumban add meg, két szekcióval:

**Akció:**
[Itt írd le rövid, konkrét mechanikus akciót — mozgás, akció, bonus akció. Például: "Mozog 30 lábat a wizard felé, megtámadja a greatsworddel +5 to hit, 2d6+3 slashing sebzéssel. Bonus akció: Second Wind."]

**Narratíva:**
[Itt 2-3 mondatban írd le színesen, mit tesz a lény és miért. Atmoszférikus, dramatikus stílus.]

Fontos szabályok:
- A party oldala: játékos karakterek + ally/summon lények. Ők csapattársak.
- Az ellenséges oldal: nem player és nem ally szörnyek.
- Ha az aktuális lény ally/summon, akkor a party-t segíti és az ellenséges szörnyeket támadja vagy akadályozza.
- Ha az aktuális lény ellenséges szörny, akkor a játékos karaktereket és/vagy ally/summon csapattársaikat támadja vagy akadályozza.
- Ne javasolj friendly fire-t, hacsak a statblock vagy a helyzet ezt nagyon erősen nem indokolja.
- A szörny intelligenciája számít: alacsony INT (8 alatt) = ösztönös, ragadozó, kiszámítható; magas INT (12+) = stratégiai, kiszámolt.
- A sebzett, intelligens lény visszavonulhat; az ösztönös vagy élőholt lény kevésbé.
- Használd a statblock minden releváns részét: akciók, bonus akciók, reakciók, legendary actionök, spellek, sebzés-immunitások/rezisztenciák, mozgásmódok.
- Tartsd RÖVIDEN: Akció max 2 mondat, narratíva max 3 mondat.

NE írj mást a két szekción kívül. NE adj több variációt egy válaszban. NE írj bevezetőt vagy összefoglalót.`;
  }

  return `You are an experienced Dungeons & Dragons 2024 Dungeon Master. During a monster or ally/summon turn, you suggest tactics and colorful narration.

ALWAYS format your response in EXACTLY this structure with two sections:

**Action:**
[Short, concrete mechanical action — movement, action, bonus action. Example: "Move 30ft toward wizard, attack with greatsword +5 to hit, 2d6+3 slashing damage. Bonus action: Second Wind."]

**Narration:**
[2-3 sentences describing what the creature does and why, in atmospheric prose.]

Important rules:
- Party side: player characters + ally/summon creatures. They are teammates.
- Enemy side: non-player and non-ally monsters.
- If the acting creature is an ally/summon, it supports the party and attacks or hinders enemy monsters.
- If the acting creature is an enemy monster, it attacks or hinders player characters and/or their ally/summon teammates.
- Do not suggest friendly fire unless the statblock or situation very strongly justifies it.
- The creature's intelligence matters: low INT (under 8) = instinctual, predatory, predictable; high INT (12+) = strategic, calculating.
- A wounded intelligent creature may retreat; instinctual or undead creatures are less likely to.
- Use all relevant statblock options: actions, bonus actions, reactions, legendary actions, spells, damage immunities/resistances, movement modes.
- Keep it SHORT: Action max 2 sentences, Narration max 3 sentences.

Do NOT write anything outside these two sections. Do NOT give multiple variations in one response. Do NOT write introductions or summaries.`;
}

/**
 * User prompt: full monster details + combat context.
 */
function buildUserPrompt({
  monster,
  combatant,
  encounter,
  language,
}: BuildPromptArgs): string {
  const is_magyar = language === 'magyar';
  const sorted = [...encounter.combatants].sort(
    (a, b) => b.initiative - a.initiative
  );
  const acting_side = sideOf(combatant);
  const allies = sorted.filter((c) => c.id !== combatant.id && sideOf(c) === acting_side);
  const targets = sorted.filter((c) => c.id !== combatant.id && sideOf(c) !== acting_side);

  if (is_magyar) {
    return `## Aktuális cselekvő lény teljes statblockja és harci állapota
${formatMonsterFullStatblock(monster, combatant)}

## Oldalak
- Party oldal: játékos karakterek + ally/summon lények. Az ally/summon lények csapattársak, és a szörnyeket támadják/akadályozzák.
- Ellenséges oldal: nem player és nem ally szörnyek.
- Az aktuális lény oldala: ${acting_side === 'party' ? 'party / ally' : 'ellenséges szörny'}.

## Lehetséges célpontok / ellenségek az aktuális lény számára
${targets.length ? targets.map((c) => formatCombatantLine(c, language)).join('\n') : '(nincs látható ellenség)'}

## Csapattársak, akiket ne támadjon
${allies.length ? allies.map((c) => formatCombatantLine(c, language)).join('\n') : '(nincs csapattárs)'}

## Teljes initiative lista
${sorted.map((c) => formatCombatantLine(c, language)).join('\n')}

**Aktuális kör:** ${encounter.round}

Adj egy taktikát ${combatant.name} számára a fenti információk alapján. Csak a két szekciót írd: **Akció:** és **Narratíva:**`;
  }

  return `## Full statblock and combat state for acting creature
${formatMonsterFullStatblock(monster, combatant)}

## Sides
- Party side: player characters + ally/summon creatures. Ally/summon creatures are teammates and should attack/hinder monsters.
- Enemy side: non-player and non-ally monsters.
- Acting creature side: ${acting_side === 'party' ? 'party / ally' : 'enemy monster'}.

## Valid targets / enemies for the acting creature
${targets.length ? targets.map((c) => formatCombatantLine(c, language)).join('\n') : '(no visible enemies)'}

## Teammates not to attack
${allies.length ? allies.map((c) => formatCombatantLine(c, language)).join('\n') : '(no teammates)'}

## Full initiative list
${sorted.map((c) => formatCombatantLine(c, language)).join('\n')}

**Current round:** ${encounter.round}

Suggest tactics for ${combatant.name} using the information above. Write only the two sections: **Action:** and **Narration:**`;
}

export function buildTacticsMessages(args: BuildPromptArgs) {
  return [
    { role: 'system' as const, content: buildSystemPrompt(args.language) },
    { role: 'user' as const, content: buildUserPrompt(args) },
  ];
}
