export interface MetamagicOption {
  id: string;
  name: string;
  cost: string;
  description: string;
}

/**
 * Sorcerer Metamagic Options from D&D 2024 SRD.
 * A sorcerer can spend Sorcery Points to apply these to their spells.
 *
 * At level 2, you choose 2 options. You gain 2 more at level 10 and 2 more
 * at level 17 (total of 6 known by level 17). You can only use one Metamagic
 * option per spell unless a feature says otherwise.
 */
export const SORCERER_METAMAGIC: MetamagicOption[] = [
  {
    id: 'careful-spell',
    name: 'Careful Spell',
    cost: '1 Sorcery Point',
    description:
      "When you cast a spell that forces other creatures to make a saving throw, you can protect some of those creatures from the spell's full force. To do so, spend 1 Sorcery Point and choose a number of those creatures up to your Charisma modifier (minimum of 1 creature). A chosen creature automatically succeeds on its saving throw against the spell, and it takes no damage if it would normally take half damage on a successful save.",
  },
  {
    id: 'distant-spell',
    name: 'Distant Spell',
    cost: '1 Sorcery Point',
    description:
      "When you cast a spell that has a range of 5 feet or greater, you can spend 1 Sorcery Point to double the range of the spell. When you cast a spell that has a range of touch, you can spend 1 Sorcery Point to make the range of the spell 30 feet.",
  },
  {
    id: 'empowered-spell',
    name: 'Empowered Spell',
    cost: '1 Sorcery Point',
    description:
      "When you roll damage for a spell, you can spend 1 Sorcery Point to reroll a number of the damage dice up to your Charisma modifier (minimum of 1). You must use the new rolls. You can use Empowered Spell even if you have already used a different Metamagic option during the casting of the spell.",
  },
  {
    id: 'extended-spell',
    name: 'Extended Spell',
    cost: '1 Sorcery Point',
    description:
      "When you cast a spell that has a duration of 1 minute or longer, you can spend 1 Sorcery Point to double its duration, to a maximum duration of 24 hours.",
  },
  {
    id: 'heightened-spell',
    name: 'Heightened Spell',
    cost: '2 Sorcery Points',
    description:
      "When you cast a spell that forces a creature to make a saving throw to resist its effects, you can spend 2 Sorcery Points to give one target of the spell disadvantage on its first saving throw made against the spell.",
  },
  {
    id: 'quickened-spell',
    name: 'Quickened Spell',
    cost: '2 Sorcery Points',
    description:
      "When you cast a spell that has a casting time of an action, you can spend 2 Sorcery Points to change the casting time to a Bonus Action for this casting. You can't modify a spell in this way if you've already cast a level 1+ spell on the current turn, nor can you cast a level 1+ spell on this turn after modifying a spell in this way.",
  },
  {
    id: 'seeking-spell',
    name: 'Seeking Spell',
    cost: '1 Sorcery Point',
    description:
      "If you make an attack roll for a spell and miss, you can spend 1 Sorcery Point to reroll the d20, and you must use the new roll. You can use Seeking Spell even if you have already used a different Metamagic option during the casting of the spell.",
  },
  {
    id: 'subtle-spell',
    name: 'Subtle Spell',
    cost: '1 Sorcery Point',
    description:
      "When you cast a spell, you can spend 1 Sorcery Point to cast it without any Somatic or Verbal components.",
  },
  {
    id: 'transmuted-spell',
    name: 'Transmuted Spell',
    cost: '1 Sorcery Point',
    description:
      "When you cast a spell that deals a type of damage from the following list, you can spend 1 Sorcery Point to change that damage type to one of the other listed types: Acid, Cold, Fire, Lightning, Poison, Thunder.",
  },
  {
    id: 'twinned-spell',
    name: 'Twinned Spell',
    cost: 'Sorcery Points equal to spell level (1 SP for cantrips)',
    description:
      "When you cast a spell that targets only one creature and doesn't have a range of self, you can spend a number of Sorcery Points equal to 1 + the spell's level to target a second creature in range with the same spell (1 Sorcery Point if the spell is a cantrip). To be eligible, a spell must be incapable of targeting more than one creature at the spell's current level.",
  },
];
