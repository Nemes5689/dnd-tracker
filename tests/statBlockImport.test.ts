import { test } from 'node:test';
import assert from 'node:assert/strict';
import { scout, mage } from './fixtures/statBlocks.ts';
import { parseStatBlock, validateDraft, draftToMonster, MAX_STAT_BLOCK_LENGTH } from '../src/utils/statBlockImport.ts';

test('2014 block extracts scores, saves and wrapped actions without storage', () => {
  const result = parseStatBlock(scout);
  assert.deepEqual(result.errors, []);
  assert.equal(result.draft.name, 'Ashfen Scout');
  assert.equal(result.draft.abilities.dex, '16');
  assert.equal(result.draft.hp_formula, '6d8');
  assert.equal(result.draft.actions[0].description, 'Ranged Weapon Attack: +5 to hit, range 80/320 ft., one target.\nHit: 6 (1d6 + 3) piercing damage.');
  assert.deepEqual(validateDraft(result.draft), {});
  const monster = draftToMonster(result.draft, true);
  assert.equal(monster.abilities.dex.modifier, 3);
  assert.equal(monster.saves.dex, 5);
  assert.equal(monster.skills.perception, 4);
  assert.equal(monster.senses.darkvision, 60);
  assert.equal(monster.passive_perception, 14);
  assert.equal(monster.bonus_actions[0].name, 'Hide');
  assert.equal(monster.reactions[0].name, 'Duck');
  assert.equal(monster.id, '');
});

test('2024 rows keep scores separate from modifiers and saving throws', () => {
  const result = parseStatBlock(mage);
  assert.equal(result.draft.abilities.int, '19');
  assert.equal(draftToMonster(result.draft, true).saves.int, 7);
  assert.equal(result.draft.xp, '3900');
  assert.equal(result.draft.cr, '8');
  assert.match(result.draft.speed, /burrow 10/);
  assert.match(result.draft.traits.find(f => f.name === 'Spellcasting')!.description, /1\/day each: wall of fire/);
  assert.ok(result.draft.legendary_actions.some(f => f.name === 'Survey'));
  assert.match(result.draft.unparsed, /Lair Actions/);
  assert.ok(result.warnings.length > 0);
  assert.ok(draftToMonster(result.draft, true).traits.some(f => f.name === 'Import notes'));
  assert.throws(() => draftToMonster(result.draft, false), /unparsed/i);
});

test('missing fields stay blank and conversion cannot invent defaults', () => {
  const result = parseStatBlock('Nameless Watcher\nMedium undead, neutral\nActions\nWatch. It waits.');
  assert.equal(result.draft.ac, '');
  assert.equal(result.draft.hp, '');
  assert.equal(result.draft.abilities.str, '');
  assert.ok(validateDraft(result.draft).ac);
  assert.throws(() => draftToMonster(result.draft, true));
});

test('input limits and multiple creatures are blocking', () => {
  assert.ok(parseStatBlock('').errors.length);
  assert.ok(parseStatBlock('x'.repeat(MAX_STAT_BLOCK_LENGTH + 1)).errors.length);
  assert.ok(parseStatBlock(scout + '\n\n' + mage).errors.some(e => /one creature/i.test(e)));
});

test('duplicate and conditional numbers require review rather than choosing one', () => {
  const duplicate = parseStatBlock(scout.replace('Armor Class 14 (leather armor)', 'Armor Class 14\nAC 19'));
  assert.equal(duplicate.draft.ac, '');
  assert.ok(duplicate.warnings.some(w => /AC/i.test(w)));
  const conditional = parseStatBlock(scout.replace('Armor Class 14 (leather armor)', 'AC 14 or 18 while shielded'));
  assert.equal(conditional.draft.ac, '');
});

test('markup-like input is retained as plain text, not interpreted', () => {
  const result = parseStatBlock(scout + '\n<script>alert("unsafe")</script>\nhttps://example.invalid/statblock');
  const monster = draftToMonster(result.draft, true);
  assert.match(JSON.stringify(monster), /script/);
  assert.match(result.original, /example.invalid/);
});

test('simple markdown, bullets and unicode minus signs are accepted', () => {
  const result = parseStatBlock(scout.replace('Armor Class', '**Armor Class**').replace('Hit Points', '- **Hit Points**').replace('(-1)', '(−1)'));
  assert.equal(result.draft.ac, '14');
  assert.equal(result.draft.hp, '27');
  assert.equal(result.draft.abilities.cha, '8');
});

test('invalid edited numbers and records block saving', () => {
  const { draft } = parseStatBlock(scout);
  draft.hp = '12abc';
  draft.abilities.str = '-1';
  draft.saves = 'Dex maybe';
  const errors = validateDraft(draft);
  assert.ok(errors.hp && errors['abilities.str'] && errors.saves);
  assert.throws(() => draftToMonster(draft, true));
});

test('bounded hostile text cannot create prototype properties', () => {
  const { draft } = parseStatBlock(scout);
  draft.skills = '__proto__ +4';
  assert.ok(validateDraft(draft).skills);
  assert.ok(parseStatBlock('a'.repeat(MAX_STAT_BLOCK_LENGTH)).errors.length);
});

test('multiple blocks without size headers are not silently merged', () => {
  const block = scout.replace('Medium humanoid, neutral\n', '');
  assert.ok(parseStatBlock(block + '\n' + block).errors.length);
});

test('duplicate source values and initiative qualifiers remain available', () => {
  const duplicate = parseStatBlock(scout.replace('Armor Class 14 (leather armor)', 'AC 14\nAC 19'));
  assert.match(duplicate.draft.unparsed, /AC 14/);
  assert.match(duplicate.draft.unparsed, /AC 19/);
  assert.match(parseStatBlock(mage).draft.unparsed, /Initiative \+3 \(13\)/);
});

test('conversion and preview do not mutate drafts or share editable features', () => {
  const { draft } = parseStatBlock(scout);
  const before = JSON.stringify(draft);
  const first = draftToMonster(draft, true);
  first.actions[0].description = 'Changed preview';
  assert.equal(JSON.stringify(draft), before);
  assert.notEqual(draftToMonster(draft, true).actions[0].description, 'Changed preview');
});

test('vertical ability rows and line bounds are explicit', () => {
  const rows = 'STR 12 (+1)\nDEX 16 (+3)\nCON 10 (+0)\nINT 11 (+0)\nWIS 14 (+2)\nCHA 8 (-1)';
  const result = parseStatBlock(scout.replace(/STR DEX CON INT WIS CHA\n[^\n]+/, rows));
  assert.deepEqual(validateDraft(result.draft), {});
  assert.ok(parseStatBlock('x\n'.repeat(2001)).errors.length);
  assert.ok(parseStatBlock('x'.repeat(4001)).errors.length);
});

test('object property names are plain text, never section identifiers', () => {
  assert.doesNotThrow(() => parseStatBlock(scout + '\nconstructor\nWatch. Nothing happens.'));
  assert.doesNotThrow(() => parseStatBlock(scout + '\ntoString\nWatch. Nothing happens.'));
});

test('alternative AC, initiative and CR values stay unknown for review', () => {
  assert.equal(parseStatBlock(scout.replace('Armor Class 14 (leather armor)', 'AC 14/18')).draft.ac, '');
  assert.equal(parseStatBlock(scout.replace('Initiative +3', 'Initiative +3 or +5')).draft.initiative, '');
  const result = parseStatBlock(scout.replace('Challenge 1 (200 XP)', 'Challenge 1 or 2'));
  assert.equal(result.draft.cr, '');
  assert.match(result.draft.unparsed, /Challenge 1 or 2/);
});
