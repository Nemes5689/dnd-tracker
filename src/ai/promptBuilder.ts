// Build prompts for monster tactics suggestions.

import type { Combatant, Encounter } from '@/types/app';
import type { Monster, MonsterSpeed } from '@/types/srd';

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

/**
 * System prompt: establish the AI's role and the EXACT output format.
 */
function buildSystemPrompt(language: 'magyar' | 'english'): string {
  if (language === 'magyar') {
    return `Te egy tapasztalt Dungeons & Dragons 2024 Dungeon Master vagy. Egy szörny köre alatt javasolsz taktikát és színes narratívát.

A válaszodat MINDIG pontosan ebben a formátumban add meg, két szekcióval:

**Akció:**
[Itt írd le rövid, konkrét mechanikus akciót — mozgás, akció, bonus akció. Például: "Mozog 30 lábat a wizard felé, megtámadja a greatsworddel +5 to hit, 2d6+3 slashing sebzéssel. Bonus akció: Second Wind."]

**Narratíva:**
[Itt 2-3 mondatban írd le színesen, mit tesz a szörny és miért. Atmoszférikus, dramatikus stílus.]

Fontos szabályok:
- A szörny intelligenciája számít: alacsony INT (alatt 8) = ösztönös, ragadozó, kiszámítható; magas INT (12+) = stratégiai, kiszámolt
- A sebzett szörny dühösebb vagy desperate-ebb lehet; sokat fejtegető szörnyek visszavonulhatnak
- A szörny természete fontos (zombi nem vonul vissza, ravasz goblin igen)
- Tartsd RÖVIDEN: Akció max 2 mondat, narratíva max 3 mondat

NE írj mást a két szekción kívül. NE adj több variációt egy válaszban. NE írj bevezetőt vagy összefoglalót.`;
  }

  return `You are an experienced Dungeons & Dragons 2024 Dungeon Master. During a monster's turn, you suggest tactics and colorful narration.

ALWAYS format your response in EXACTLY this structure with two sections:

**Action:**
[Short, concrete mechanical action — movement, action, bonus action. Example: "Move 30ft toward wizard, attack with greatsword +5 to hit, 2d6+3 slashing damage. Bonus action: Second Wind."]

**Narration:**
[2-3 sentences describing what the monster does and why, in atmospheric prose.]

Important rules:
- The monster's intelligence matters: low INT (under 8) = instinctual, predatory, predictable; high INT (12+) = strategic, calculating
- A wounded monster may be angrier or more desperate; intelligent monsters may retreat
- The monster's nature matters (a zombie won't retreat, a cunning goblin will)
- Keep it SHORT: Action max 2 sentences, Narration max 3 sentences

Do NOT write anything outside these two sections. Do NOT give multiple variations in one response. Do NOT write introductions or summaries.`;
}

/**
 * User prompt: monster details + combat context.
 */
function buildUserPrompt({
  monster,
  combatant,
  encounter,
  language,
}: BuildPromptArgs): string {
  const is_magyar = language === 'magyar';

  const hp_pct = Math.round((combatant.hp_current / combatant.hp_max) * 100);
  const hp_status = is_magyar
    ? hp_pct >= 75
      ? 'sértetlen'
      : hp_pct >= 50
      ? 'megsebesült'
      : hp_pct >= 25
      ? 'súlyosan sérült'
      : 'haldoklik'
    : hp_pct >= 75
    ? 'healthy'
    : hp_pct >= 50
    ? 'wounded'
    : hp_pct >= 25
    ? 'severely wounded'
    : 'near death';

  const ability_str = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA']
    .map((ab) => {
      const m = monster.abilities[ab.toLowerCase() as keyof typeof monster.abilities];
      return `${ab} ${m.score} (${m.modifier >= 0 ? '+' : ''}${m.modifier})`;
    })
    .join(', ');

  // Limit actions to top 6 to keep prompt size manageable
  const actions_summary = monster.actions
    .slice(0, 6)
    .map((a) => `- ${a.name}: ${truncate(a.description, 200)}`)
    .join('\n');

  const traits_summary =
    monster.traits.length > 0
      ? monster.traits
          .slice(0, 4)
          .map((t) => `- ${t.name}: ${truncate(t.description, 150)}`)
          .join('\n')
      : is_magyar
      ? '(nincs)'
      : '(none)';

  const spellcasting_summary = monster.spellcasting
    ? [
        monster.spellcasting.ability
          ? `${is_magyar ? 'varázslási képesség' : 'ability'} ${monster.spellcasting.ability.toUpperCase()}`
          : '',
        monster.spellcasting.save_dc !== undefined
          ? `${is_magyar ? 'mentő DC' : 'save DC'} ${monster.spellcasting.save_dc}`
          : '',
        monster.spellcasting.attack_bonus !== undefined
          ? `${is_magyar ? 'spell attack' : 'spell attack'} ${monster.spellcasting.attack_bonus >= 0 ? '+' : ''}${monster.spellcasting.attack_bonus}`
          : '',
        monster.spellcasting.caster_level !== undefined
          ? `${is_magyar ? 'caster level' : 'caster level'} ${monster.spellcasting.caster_level}`
          : '',
        monster.spellcasting.spell_ids.length > 0
          ? `${is_magyar ? 'spellek' : 'spells'}: ${monster.spellcasting.spell_ids.join(', ')}`
          : '',
        monster.spellcasting.notes
          ? `${is_magyar ? 'jegyzet' : 'notes'}: ${truncate(monster.spellcasting.notes, 250)}`
          : '',
      ]
        .filter(Boolean)
        .join('; ')
    : is_magyar
    ? '(nincs)'
    : '(none)';

  // Other combatants
  const sorted = [...encounter.combatants].sort(
    (a, b) => b.initiative - a.initiative
  );
  const others = sorted.filter((c) => c.id !== combatant.id);

  const enemies_text = others
    .map((c) => {
      const c_hp_pct = Math.round((c.hp_current / c.hp_max) * 100);
      const c_status = is_magyar
        ? c_hp_pct >= 75
          ? 'sértetlen'
          : c_hp_pct >= 50
          ? 'megsebesült'
          : c_hp_pct >= 25
          ? 'súlyosan sérült'
          : 'haldoklik'
        : c_hp_pct >= 75
        ? 'healthy'
        : c_hp_pct >= 50
        ? 'wounded'
        : c_hp_pct >= 25
        ? 'severely wounded'
        : 'near death';

      const tag = c.is_player
        ? is_magyar
          ? 'játékos karakter'
          : 'player character'
        : is_magyar
        ? 'szörny'
        : 'monster';

      const conditions =
        c.conditions.length > 0
          ? ` [${c.conditions.map((cnd) => cnd.condition_id).join(', ')}]`
          : '';

      return `- ${c.name} (${tag}, AC ${c.ac}, ${c_status})${conditions}`;
    })
    .join('\n');

  if (is_magyar) {
    return `## Cselekvő szörny: ${monster.name}

**Adatok:**
- ${monster.size} ${monster.type}, CR ${monster.cr}
- HP: ${combatant.hp_current}/${combatant.hp_max} (${hp_status})
- AC: ${combatant.ac}, Sebesség: ${formatSpeed(monster.speed, ' láb')}
- Képességek: ${ability_str}

**Tulajdonságok:**
${traits_summary}

**Akciók:**
${actions_summary}

**Spellcasting:**
${spellcasting_summary}

## Harcban (initiative szerint):
${enemies_text}

**Aktuális kör:** ${encounter.round}

Adj egy taktikát ${monster.name} számára. Csak a két szekciót írd: **Akció:** és **Narratíva:**`;
  }

  return `## Acting monster: ${monster.name}

**Stats:**
- ${monster.size} ${monster.type}, CR ${monster.cr}
- HP: ${combatant.hp_current}/${combatant.hp_max} (${hp_status})
- AC: ${combatant.ac}, Speed: ${formatSpeed(monster.speed, ' ft')}
- Abilities: ${ability_str}

**Traits:**
${traits_summary}

**Actions:**
${actions_summary}

**Spellcasting:**
${spellcasting_summary}

## In combat (initiative order):
${enemies_text}

**Current round:** ${encounter.round}

Suggest tactics for ${monster.name}. Write only the two sections: **Action:** and **Narration:**`;
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max) + '...';
}

export function buildTacticsMessages(args: BuildPromptArgs) {
  return [
    { role: 'system' as const, content: buildSystemPrompt(args.language) },
    { role: 'user' as const, content: buildUserPrompt(args) },
  ];
}
