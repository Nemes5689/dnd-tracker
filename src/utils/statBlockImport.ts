import type { Monster, MonsterFeature, MonsterAbilities } from '../types/srd';

/** Hard bounds apply before normalization or regular-expression work. */
export const MAX_STAT_BLOCK_LENGTH = 50_000;
export const ABILITIES = ['str', 'dex', 'con', 'int', 'wis', 'cha'] as const;
export const FEATURE_SECTIONS = ['traits', 'actions', 'bonus_actions', 'reactions', 'legendary_actions'] as const;
type Ability = typeof ABILITIES[number];
type Section = typeof FEATURE_SECTIONS[number];
export const TEXT_FIELDS = [
  'name', 'size', 'type', 'alignment', 'ac', 'hp', 'hp_formula', 'speed', 'initiative',
  'cr', 'xp', 'passive_perception', 'saves', 'skills', 'senses', 'languages',
  'damage_resistances', 'damage_immunities', 'damage_vulnerabilities', 'condition_immunities', 'gear',
] as const;
export type TextField = typeof TEXT_FIELDS[number];
export type ImportDraft = Record<TextField, string> & Record<Section, MonsterFeature[]> & {
  abilities: Record<Ability, string>;
  unparsed: string;
};
export interface ParseResult { original: string; draft: ImportDraft; warnings: string[]; errors: string[] }

export function emptyDraft(): ImportDraft {
  return {
    ...Object.fromEntries(TEXT_FIELDS.map(key => [key, ''])),
    ...Object.fromEntries(FEATURE_SECTIONS.map(key => [key, []])),
    abilities: Object.fromEntries(ABILITIES.map(key => [key, ''])), unparsed: '',
  } as ImportDraft;
}

export function normalizeStatBlock(text: string): string[] {
  return text.replace(/\r\n?/g, '\n').replace(/\u00a0/g, ' ').split('\n')
    .map(line => line.trim().replace(/^#{1,6}\s+/, '').replace(/^[-*•]\s+/, '').replace(/\*\*|__/g, ''))
    .filter(line => line && !/^[-_*]{3,}$/.test(line));
}

const sizeLine = /^(Tiny|Small|Medium|Large|Huge|Gargantuan)\s+([^,]+)(?:,\s*(.*))?$/i;
const sectionNames: Record<string, Section> = {
  traits: 'traits', actions: 'actions', 'bonus actions': 'bonus_actions', reactions: 'reactions', 'legendary actions': 'legendary_actions',
};
const header = /^(Armor Class|AC|Hit Points|HP|Speed|Initiative|Saving Throws|Skills|Senses|Languages|Challenge|CR|Damage Resistances|Resistances|Damage Immunities|Condition Immunities|Immunities|Damage Vulnerabilities|Vulnerabilities|Gear|Equipment)\b\s*:?\s*(.*)$/i;
const fieldNames: Record<string, TextField> = {
  'armor class': 'ac', ac: 'ac', 'hit points': 'hp', hp: 'hp', speed: 'speed', initiative: 'initiative',
  'saving throws': 'saves', skills: 'skills', senses: 'senses', languages: 'languages', challenge: 'cr', cr: 'cr',
  'damage resistances': 'damage_resistances', resistances: 'damage_resistances', 'damage immunities': 'damage_immunities',
  'condition immunities': 'condition_immunities', 'damage vulnerabilities': 'damage_vulnerabilities', vulnerabilities: 'damage_vulnerabilities',
  gear: 'gear', equipment: 'gear',
};

/** Recognize bounded lines, not an unbounded document-wide backtracking regex. */
export function parseStatBlock(original: string): ParseResult {
  const result: ParseResult = { original, draft: emptyDraft(), warnings: [], errors: [] };
  if (!original.trim()) { result.errors.push('Paste one creature’s stat block first.'); return result; }
  if (original.length > MAX_STAT_BLOCK_LENGTH) { result.errors.push('The limit is 50,000 characters. Paste a shorter block.'); return result; }
  const lines = normalizeStatBlock(original);
  if (lines.length > 2000 || lines.some(line => line.length > 4000)) {
    result.errors.push('Use no more than 2,000 lines and 4,000 characters per line.'); return result;
  }
  if (lines.filter(line => sizeLine.test(line)).length > 1 ||
      (lines.filter(line => /^(?:Armor Class|AC)\b/i.test(line)).length > 1 &&
       lines.filter(line => /^(?:Hit Points|HP)\b/i.test(line)).length > 1)) {
    result.errors.push('Paste only one creature at a time; multiple creature headers were detected.'); return result;
  }
  const draft = result.draft;
  const leftovers: string[] = [];
  const seen = new Set<string>();
  const sources = new Map<string, string>();
  const warn = (message: string) => { if (!result.warnings.includes(message)) result.warnings.push(message); };
  const set = (key: TextField, value: string, source: string) => {
    if (seen.has(key)) {
      draft[key] = ''; leftovers.push(sources.get(key) ?? '', source); warn(`Repeated ${key.toUpperCase()} values: enter the intended value in review.`);
    } else { seen.add(key); sources.set(key, source); draft[key] = value.trim(); }
  };
  const setScore = (key: Ability, score: string, modifier?: string, save?: string) => {
    if (seen.has(`ability.${key}`)) {
      draft.abilities[key] = ''; warn(`Repeated ${key.toUpperCase()} score: review the original and enter one score.`);
    } else {
      seen.add(`ability.${key}`); draft.abilities[key] = score;
      if (modifier && Number(modifier) !== Math.floor((Number(score) - 10) / 2)) {
        warn(`${key.toUpperCase()} supplied modifier ${modifier} differs from the standard score modifier. Review the score; standard modifiers are calculated on save.`);
        leftovers.push(`${key.toUpperCase()} ${score} (${modifier})`);
      }
      if (save) draft.saves += `${draft.saves ? ', ' : ''}${key} ${save}`;
    }
  };
  let section: Section = 'traits';
  let readingFeatures = false;
  let unknownSection = false;
  let abilityTable = false;
  let saveColumns = false;

  for (let index = 0; index < lines.length; index++) {
    const line = lines[index];
    const scan = line.replace(/[−–—]/g, '-');
    const sectionKey = line.replace(/:$/, '').toLowerCase();
    if (Object.prototype.hasOwnProperty.call(sectionNames, sectionKey)) { section = sectionNames[sectionKey]; readingFeatures = true; unknownSection = false; continue; }
    if (/^(lair actions|regional effects|mythic actions|villain actions|ecology|description)\b/i.test(line)) {
      unknownSection = true; readingFeatures = true; leftovers.push(line); continue;
    }
    if (unknownSection) { leftovers.push(line); continue; }
    if (!readingFeatures) {
      const size = line.match(sizeLine);
      if (size) { draft.size = size[1]; draft.type = size[2]; draft.alignment = size[3] ?? ''; continue; }
      if (/^(?:STR\s+DEX\s+CON\s+INT\s+WIS\s+CHA|(?:MOD\s+SAVE\s*)+)$/i.test(scan)) {
        abilityTable = /^STR/i.test(scan); saveColumns = /SAVE/i.test(scan); continue;
      }
      if (abilityTable) {
        const cells = [...scan.matchAll(/(\d{1,2})\s*\(\s*([+-]?\d{1,2})\s*\)/g)];
        const scores = scan.split(/\s+/);
        if (cells.length === 6) { cells.forEach((cell, i) => setScore(ABILITIES[i], cell[1], cell[2])); abilityTable = false; continue; }
        if (scores.length === 6 && scores.every(v => /^\d{1,2}$/.test(v))) { scores.forEach((v, i) => setScore(ABILITIES[i], v)); abilityTable = false; continue; }
        abilityTable = false;
        warn('Ability table could not be read. Enter missing scores manually.');
      }
      if (/^(STR|DEX|CON|INT|WIS|CHA)\b/i.test(scan)) {
        const labels = [...scan.matchAll(/\b(STR|DEX|CON|INT|WIS|CHA)\b/gi)];
        let allRead = true;
        labels.forEach((label, i) => {
          const cell = scan.slice(label.index! + 3, labels[i + 1]?.index).trim();
          const match = cell.match(/^(\d{1,2})(?:\s*\(?([+-]\d{1,2})\)?)?(?:\s+([+-]\d{1,2}))?$/);
          if (match) setScore(label[1].toLowerCase() as Ability, match[1], match[2], saveColumns ? match[3] : undefined);
          else allRead = false;
          if (match?.[3] && !saveColumns) { allRead = false; warn('Extra ability columns are not labelled MOD SAVE; review them manually.'); }
        });
        if (!allRead) leftovers.push(line);
        continue;
      }
      const field = scan.match(header);
      if (field) {
        const label = field[1].toLowerCase();
        const key = fieldNames[label];
        const value = field[2];
        if (label === 'immunities') {
          leftovers.push(line); warn('Combined Immunities is ambiguous. Assign damage and condition immunities in review.'); continue;
        }
        if (key === 'ac' || key === 'hp') {
          const number = value.match(/^(\d+)\b/);
          const ambiguous = /\b(?:or|while|when|with|without)\b/i.test(value) || /^\d+\s*[/,-]\s*\d/.test(value);
          set(key, number && !ambiguous ? number[1] : '', line);
          if (!number || ambiguous) warn(`${key.toUpperCase()} is missing or conditional; enter the intended value.`);
          if (key === 'hp') draft.hp_formula = value.match(/\(([^)]+)\)/)?.[1] ?? '';
          // Armor qualifiers and conditional rules have no structured model field.
          if ((key === 'ac' && value !== number?.[1]) || ambiguous) leftovers.push(line);
          const initiative = value.match(/\bInitiative\s+([+-]?\d+)/i);
          if (initiative) set('initiative', initiative[1], line);
        } else if (key === 'initiative') {
          const initiative = value.match(/^([+-]?\d+)(?:\s*\(\d+\))?$/);
          set(key, initiative?.[1] ?? '', line);
          if (!initiative) warn('Initiative is unclear; enter the intended modifier.');
          if (!/^[+-]?\d+$/.test(value)) leftovers.push(line);
        } else if (key === 'cr') {
          const ambiguous = /\b(?:or|while|when|with|without)\b/i.test(value);
          set(key, ambiguous ? '' : value.match(/^(\d+(?:\/\d+)?)\b/)?.[1] ?? '', line);
          const xp = value.match(/(?:\bXP\s+([\d,]+)|([\d,]+)\s+XP\b)/i);
          if (xp) draft.xp = (xp[1] ?? xp[2]).replace(/,/g, '');
          if (ambiguous || /\bPB\b/i.test(value)) leftovers.push(line);
        } else {
          set(key, line.match(header)?.[2] ?? value, line);
          if (key === 'senses') draft.passive_perception = value.match(/passive\s+Perception\s+(\d+)/i)?.[1] ?? '';
        }
        continue;
      }
      if (index === 0 && !/[<>]/.test(line)) { draft.name = line; continue; }
    }
    // HTML-looking content and links stay plain and are never fetched.
    if (/[<>]|https?:\/\//i.test(line)) { leftovers.push(line); continue; }
    const feature = line.match(/^([^.!?:]{1,100})\.\s*(.*)$/);
    const title = feature?.[1];
    const titleLike = title && title.split(/\s+/).every(word => /^[A-Z0-9(]/.test(word) || /^(of|the|and|a|an|to|in|for|with|per|day|\d+\))$/i.test(word));
    if (feature && titleLike) {
      readingFeatures = true;
      draft[section].push({ name: feature[1], description: feature[2] });
    } else if (readingFeatures && draft[section].length) {
      const last = draft[section][draft[section].length - 1];
      last.description += `${last.description ? '\n' : ''}${line}`;
    } else if (readingFeatures) {
      draft[section].push({ name: 'Section notes', description: line });
    } else { leftovers.push(line); }
  }
  draft.unparsed = leftovers.join('\n');
  if (draft.unparsed) warn('Unparsed text or qualifiers need review. Keep them as Import notes when saving.');
  if (draft.traits.concat(draft.actions).some(f => /spellcasting/i.test(f.name))) warn('Spellcasting is preserved as rules text; spell IDs and casting automation are not inferred.');
  if (Object.keys(validateDraft(draft)).length) warn('Required or invalid fields are highlighted below. Nothing has been saved.');
  return result;
}

function numberRecord(value: string): Record<string, number> | null {
  const out: Record<string, number> = {};
  for (const item of value.split(/[,;\n]/).map(v => v.trim()).filter(Boolean)) {
    const match = item.replace(/[−–—]/g, '-').match(/^([a-z][a-z '’-]{0,60}?)\s*([+-]?\d{1,3})$/i);
    if (!match) return null;
    const key = match[1].trim().toLowerCase();
    if (['__proto__', 'constructor', 'prototype'].includes(key) || Object.prototype.hasOwnProperty.call(out, key)) return null;
    out[key] = Number(match[2]);
  }
  return out;
}

function senseRecord(value: string) {
  const senses: Record<string, number> = {};
  const notes: Record<string, string> = {};
  for (const item of value.split(/[,;\n]/).map(v => v.trim()).filter(Boolean)) {
    if (/^passive\s+Perception\s+\d+$/i.test(item) || /^[-—–]$/.test(item)) continue;
    const match = item.match(/^([a-z][a-z ]{0,50}?)\s+(\d+)\s*(?:ft\.?|feet)\s*(.*)$/i);
    if (!match) return null;
    const key = match[1].trim().toLowerCase().replace(/\s+/g, '_');
    if (['__proto__', 'constructor', 'prototype'].includes(key) || Object.prototype.hasOwnProperty.call(senses, key)) return null;
    senses[key] = Number(match[2]);
    if (match[3]) notes[key] = match[3];
  }
  return { senses, notes };
}

export function validateDraft(draft: ImportDraft): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const key of ['name', 'size', 'type', 'speed', 'cr'] as const) if (!draft[key].trim()) errors[key] = 'Required; no value was assumed.';
  if (draft.name.length > 250) errors.name = 'Use a name of at most 250 characters.';
  for (const [key, min, max] of [['ac', 0, 100], ['hp', 1, 1_000_000], ['initiative', -100, 100], ['passive_perception', 0, 100]] as const) {
    if (!/^[+-]?\d+$/.test(draft[key]) || Number(draft[key]) < min || Number(draft[key]) > max) errors[key] = `Enter a whole number from ${min} to ${max}; no default is supplied.`;
  }
  for (const key of ABILITIES) if (!/^\d+$/.test(draft.abilities[key]) || Number(draft.abilities[key]) < 1 || Number(draft.abilities[key]) > 30) errors[`abilities.${key}`] = 'Enter a score from 1 to 30 (not a modifier).';
  if (draft.cr && !/^(?:\d+|1\/[248])$/.test(draft.cr)) errors.cr = 'Use a whole-number CR or 1/2, 1/4, 1/8.';
  if (draft.xp && (!/^\d+$/.test(draft.xp) || !Number.isSafeInteger(Number(draft.xp)))) errors.xp = 'Enter a non-negative whole number.';
  if (!numberRecord(draft.saves)) errors.saves = 'Use comma-separated names and bonuses, e.g. Dex +5, Wis +4. No repeated names.';
  if (!numberRecord(draft.skills)) errors.skills = 'Use comma-separated names and bonuses, e.g. Stealth +5.';
  if (!senseRecord(draft.senses)) errors.senses = 'Use senses with ranges, e.g. darkvision 60 ft. Put other rules in Import notes.';
  if (JSON.stringify(draft).length > 150_000) errors.draft = 'Edited draft is too large. Shorten the text before saving.';
  return errors;
}

/** Conversion is pure: IDs and persistence belong exclusively to explicit save. */
export function draftToMonster(draft: ImportDraft, retainUnparsed: boolean): Monster {
  if (Object.keys(validateDraft(draft)).length) throw new Error('Correct invalid or missing fields before saving.');
  if (draft.unparsed.trim() && !retainUnparsed) throw new Error('Confirm retention of unparsed text before saving.');
  const abilities = Object.fromEntries(ABILITIES.map(key => [key, { score: Number(draft.abilities[key]), modifier: Math.floor((Number(draft.abilities[key]) - 10) / 2) }])) as unknown as MonsterAbilities;
  const sense = senseRecord(draft.senses)!;
  const list = (value: string) => value.split(/\n|;/).map(v => v.trim()).filter(Boolean);
  return {
    id: '', source: 'Custom', name: draft.name.trim(), size: draft.size.trim(), type: draft.type.trim(), subtype: null,
    alignment: draft.alignment.trim() || null, ac: Number(draft.ac), hp: Number(draft.hp), hp_formula: draft.hp_formula.trim() || null,
    speed: draft.speed.trim(), initiative: { modifier: Number(draft.initiative), score: null }, abilities,
    saves: numberRecord(draft.saves)!, skills: numberRecord(draft.skills)!, senses: sense.senses, senses_notes: sense.notes,
    passive_perception: Number(draft.passive_perception), languages: draft.languages.split(/[,;\n]/).map(v => v.trim()).filter(Boolean),
    cr: draft.cr, xp: draft.xp ? Number(draft.xp) : null,
    damage_resistances: list(draft.damage_resistances), damage_immunities: list(draft.damage_immunities),
    damage_vulnerabilities: list(draft.damage_vulnerabilities), condition_immunities: list(draft.condition_immunities), gear: list(draft.gear),
    traits: [...draft.traits.map(f => ({ ...f })), ...(draft.unparsed.trim() ? [{ name: 'Import notes', description: draft.unparsed }] : [])],
    actions: draft.actions.map(f => ({ ...f })), bonus_actions: draft.bonus_actions.map(f => ({ ...f })),
    reactions: draft.reactions.map(f => ({ ...f })), legendary_actions: draft.legendary_actions.map(f => ({ ...f })), statblock_mode: 'monster',
  };
}
