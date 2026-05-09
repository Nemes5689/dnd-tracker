import type { CharacterClassInfo } from './classData';

export interface ArtificerInfusion {
  id: string;
  name: string;
  prerequisite?: string;
  item: string;
  description: string;
}

/**
 * Artificer Infusions from Tasha's Cauldron of Everything (5e).
 * Each infusion turns a nonmagical item into a magical one.
 */
export const ARTIFICER_INFUSIONS: ArtificerInfusion[] = [
  {
    id: 'arcane-propulsion-armor',
    name: 'Arcane Propulsion Armor',
    prerequisite: '14th-level artificer',
    item: 'A suit of armor (requires attunement)',
    description:
      "Walking speed +5 ft. The armor includes magic gauntlets dealing 1d8 force damage on hit, with the thrown property (range 20/60 ft) — they fly back and reattach automatically. The armor can't be removed against the wearer's will. If the wearer is missing limbs, the armor replaces them, functioning identically to the body parts they replace.",
  },
  {
    id: 'armor-of-magical-strength',
    name: 'Armor of Magical Strength',
    item: 'A suit of armor (requires attunement)',
    description:
      "The armor has 6 charges. The wearer can spend charges as follows: when making a Strength check or save, expend 1 charge to add the wearer's Intelligence modifier to the roll; or use the reaction to spend 1 charge to avoid being knocked prone. Regains 1d6 expended charges daily at dawn.",
  },
  {
    id: 'boots-of-the-winding-path',
    name: 'Boots of the Winding Path',
    prerequisite: '6th-level artificer',
    item: 'A pair of boots (requires attunement)',
    description:
      "While wearing these boots, a creature can teleport up to 15 feet as a bonus action to an unoccupied space the creature can see. The creature must have occupied that space at some point during the current turn.",
  },
  {
    id: 'enhanced-arcane-focus',
    name: 'Enhanced Arcane Focus',
    item: 'A rod, staff, or wand (requires attunement)',
    description:
      "While holding this item, a creature gains a +1 bonus to spell attack rolls. In addition, the creature ignores half cover when making a spell attack. The bonus increases to +2 when you reach 10th level in this class.",
  },
  {
    id: 'enhanced-defense',
    name: 'Enhanced Defense',
    item: 'A suit of armor or a shield',
    description:
      "A creature gains a +1 bonus to AC while wearing (armor) or wielding (shield) the infused item. The bonus increases to +2 when you reach 10th level in this class.",
  },
  {
    id: 'enhanced-weapon',
    name: 'Enhanced Weapon',
    item: 'A simple or martial weapon',
    description:
      "This magic weapon grants a +1 bonus to attack and damage rolls made with it. The bonus increases to +2 when you reach 10th level in this class.",
  },
  {
    id: 'helm-of-awareness',
    name: 'Helm of Awareness',
    prerequisite: '10th-level artificer',
    item: 'A helmet (requires attunement)',
    description:
      "While wearing this helmet, a creature has advantage on initiative rolls. In addition, the wearer can't be surprised, provided it isn't incapacitated.",
  },
  {
    id: 'homunculus-servant',
    name: 'Homunculus Servant',
    item: 'A gem or crystal worth at least 100 gp',
    description:
      "You learn intricate methods for magically creating a special homunculus that serves you. The item you infuse serves as the creature's heart, around which the creature's body instantly forms. The homunculus is friendly to you and your companions and obeys your commands. (Tiny construct, AC 13, HP = 1 + your Intelligence modifier + your artificer level. Speed 20 ft., fly 30 ft. Force Strike: ranged spell attack, 30 ft, 1d4 + PB force. Channel Magic reaction: delivers a touch spell within 120 ft.)",
  },
  {
    id: 'mind-sharpener',
    name: 'Mind Sharpener',
    item: 'A suit of armor or robes',
    description:
      "The infused item can send a jolt to the wearer to refocus their mind. The item has 4 charges. When the wearer fails a Constitution saving throw to maintain concentration on a spell, the wearer can use its reaction to expend 1 of the item's charges to succeed instead. Regains 1d4 expended charges daily at dawn.",
  },
  {
    id: 'radiant-weapon',
    name: 'Radiant Weapon',
    prerequisite: '6th-level artificer',
    item: 'A simple or martial weapon (requires attunement)',
    description:
      "+1 bonus to attack and damage rolls. As a bonus action, shed bright light in a 30-ft radius and dim light another 30 ft (extinguish as a bonus action). 4 charges: as a reaction immediately after being hit by an attack, expend 1 charge to blind the attacker until the end of its next turn unless it succeeds on a Con save against your spell save DC. Regains 1d4 charges daily at dawn.",
  },
  {
    id: 'repeating-shot',
    name: 'Repeating Shot',
    item: 'A simple or martial weapon with the ammunition property (requires attunement)',
    description:
      "+1 bonus to attack and damage rolls when used to make a ranged attack, and ignores the loading property if it has it. If you load no ammunition in the weapon, it produces its own, automatically creating one piece of magic ammunition when you make a ranged attack with it. The created ammunition vanishes the instant after it hits or misses a target.",
  },
  {
    id: 'repulsion-shield',
    name: 'Repulsion Shield',
    prerequisite: '6th-level artificer',
    item: 'A shield (requires attunement)',
    description:
      "+1 bonus to AC while wielding this shield. The shield has 4 charges. While holding it, the wielder can use a reaction immediately after being hit by a melee attack to expend 1 of the shield's charges and push the attacker up to 15 feet away. Regains 1d4 expended charges daily at dawn.",
  },
  {
    id: 'resistant-armor',
    name: 'Resistant Armor',
    prerequisite: '6th-level artificer',
    item: 'A suit of armor (requires attunement)',
    description:
      "While wearing this armor, a creature has resistance to one of the following damage types, which you choose when you infuse the item: acid, cold, fire, force, lightning, necrotic, poison, psychic, radiant, or thunder.",
  },
  {
    id: 'returning-weapon',
    name: 'Returning Weapon',
    item: 'A simple or martial weapon with the thrown property',
    description:
      "+1 bonus to attack and damage rolls, and it returns to the wielder's hand immediately after it is used to make a ranged attack.",
  },
  {
    id: 'spell-refueling-ring',
    name: 'Spell-Refueling Ring',
    prerequisite: '6th-level artificer',
    item: 'A ring (requires attunement)',
    description:
      "While wearing this ring, the creature can recover one expended spell slot as an action. The recovered slot can be of 3rd level or lower. Once used, the ring can't be used again until the next dawn.",
  },
  {
    id: 'replicate-magic-item',
    name: 'Replicate Magic Item',
    item: 'Varies (see Replicable Items tables)',
    description:
      "Using this infusion, you replicate a particular magic item. You can learn this infusion multiple times; each time, choose a magic item you can make with it from the Replicable Items tables (Common items: Alchemy Jug, Bag of Holding, Cap of Water Breathing, Goggles of Night, Rope of Climbing, Sending Stones, Wand of Magic Detection, Wand of Secrets). Higher-level tables (6th, 10th, 14th) unlock more powerful items like Bag of Holding, Cloak of Protection, Boots of Speed, Ring of Protection, etc.",
  },
];

export const ARTIFICER_CLASS = {
  "id": "artificer",
  "name": "Artificer",
  "coreTraits": {
    "Source": "Tasha's Cauldron of Everything (5e)",
    "Primary Ability": "Intelligence",
    "Hit Point Die": "D8 per Artificer level",
    "Saving Throw Proficiencies": "Constitution and Intelligence",
    "Skill Proficiencies": "Choose 2 from Arcana, History, Investigation, Medicine, Nature, Perception, or Sleight of Hand",
    "Weapon Proficiencies": "Simple weapons (and firearms if DM allows)",
    "Tool Proficiencies": "Thieves' tools, tinker's tools, one type of artisan's tools of your choice",
    "Armor Training": "Light armor, medium armor, shields",
    "Multiclass Requirement": "Intelligence 13+",
    "Starting Equipment": "Choose: any two simple weapons, a light crossbow and 20 bolts, studded leather armor or scale mail, thieves' tools and a dungeoneer's pack"
  },
  "progression": [
    {
      "level": 1,
      "features": [
        "Magical Tinkering",
        "Spellcasting"
      ],
      "extras": {
        "Proficiency Bonus": "+2",
        "Infusions Known": "—",
        "Infused Items": "—",
        "Cantrips Known": "2",
        "1st": "2",
        "2nd": "—",
        "3rd": "—",
        "4th": "—",
        "5th": "—"
      }
    },
    {
      "level": 2,
      "features": [
        "Infuse Item"
      ],
      "extras": {
        "Proficiency Bonus": "+2",
        "Infusions Known": "4",
        "Infused Items": "2",
        "Cantrips Known": "2",
        "1st": "2",
        "2nd": "—",
        "3rd": "—",
        "4th": "—",
        "5th": "—"
      }
    },
    {
      "level": 3,
      "features": [
        "Artificer Subclass",
        "The Right Tool for the Job"
      ],
      "extras": {
        "Proficiency Bonus": "+2",
        "Infusions Known": "4",
        "Infused Items": "2",
        "Cantrips Known": "2",
        "1st": "3",
        "2nd": "—",
        "3rd": "—",
        "4th": "—",
        "5th": "—"
      }
    },
    {
      "level": 4,
      "features": [
        "Ability Score Improvement"
      ],
      "extras": {
        "Proficiency Bonus": "+2",
        "Infusions Known": "4",
        "Infused Items": "2",
        "Cantrips Known": "2",
        "1st": "3",
        "2nd": "—",
        "3rd": "—",
        "4th": "—",
        "5th": "—"
      }
    },
    {
      "level": 5,
      "features": [
        "Artificer Subclass feature"
      ],
      "extras": {
        "Proficiency Bonus": "+3",
        "Infusions Known": "4",
        "Infused Items": "2",
        "Cantrips Known": "2",
        "1st": "4",
        "2nd": "2",
        "3rd": "—",
        "4th": "—",
        "5th": "—"
      }
    },
    {
      "level": 6,
      "features": [
        "Tool Expertise"
      ],
      "extras": {
        "Proficiency Bonus": "+3",
        "Infusions Known": "6",
        "Infused Items": "3",
        "Cantrips Known": "2",
        "1st": "4",
        "2nd": "2",
        "3rd": "—",
        "4th": "—",
        "5th": "—"
      }
    },
    {
      "level": 7,
      "features": [
        "Flash of Genius"
      ],
      "extras": {
        "Proficiency Bonus": "+3",
        "Infusions Known": "6",
        "Infused Items": "3",
        "Cantrips Known": "2",
        "1st": "4",
        "2nd": "3",
        "3rd": "—",
        "4th": "—",
        "5th": "—"
      }
    },
    {
      "level": 8,
      "features": [
        "Ability Score Improvement"
      ],
      "extras": {
        "Proficiency Bonus": "+3",
        "Infusions Known": "6",
        "Infused Items": "3",
        "Cantrips Known": "2",
        "1st": "4",
        "2nd": "3",
        "3rd": "—",
        "4th": "—",
        "5th": "—"
      }
    },
    {
      "level": 9,
      "features": [
        "Artificer Subclass feature"
      ],
      "extras": {
        "Proficiency Bonus": "+4",
        "Infusions Known": "6",
        "Infused Items": "3",
        "Cantrips Known": "2",
        "1st": "4",
        "2nd": "3",
        "3rd": "2",
        "4th": "—",
        "5th": "—"
      }
    },
    {
      "level": 10,
      "features": [
        "Magic Item Adept"
      ],
      "extras": {
        "Proficiency Bonus": "+4",
        "Infusions Known": "8",
        "Infused Items": "4",
        "Cantrips Known": "3",
        "1st": "4",
        "2nd": "3",
        "3rd": "2",
        "4th": "—",
        "5th": "—"
      }
    },
    {
      "level": 11,
      "features": [
        "Spell-Storing Item"
      ],
      "extras": {
        "Proficiency Bonus": "+4",
        "Infusions Known": "8",
        "Infused Items": "4",
        "Cantrips Known": "3",
        "1st": "4",
        "2nd": "3",
        "3rd": "3",
        "4th": "—",
        "5th": "—"
      }
    },
    {
      "level": 12,
      "features": [
        "Ability Score Improvement"
      ],
      "extras": {
        "Proficiency Bonus": "+4",
        "Infusions Known": "8",
        "Infused Items": "4",
        "Cantrips Known": "3",
        "1st": "4",
        "2nd": "3",
        "3rd": "3",
        "4th": "—",
        "5th": "—"
      }
    },
    {
      "level": 13,
      "features": [],
      "extras": {
        "Proficiency Bonus": "+5",
        "Infusions Known": "8",
        "Infused Items": "4",
        "Cantrips Known": "3",
        "1st": "4",
        "2nd": "3",
        "3rd": "3",
        "4th": "1",
        "5th": "—"
      }
    },
    {
      "level": 14,
      "features": [
        "Magic Item Savant"
      ],
      "extras": {
        "Proficiency Bonus": "+5",
        "Infusions Known": "10",
        "Infused Items": "5",
        "Cantrips Known": "4",
        "1st": "4",
        "2nd": "3",
        "3rd": "3",
        "4th": "1",
        "5th": "—"
      }
    },
    {
      "level": 15,
      "features": [
        "Artificer Subclass feature"
      ],
      "extras": {
        "Proficiency Bonus": "+5",
        "Infusions Known": "10",
        "Infused Items": "5",
        "Cantrips Known": "4",
        "1st": "4",
        "2nd": "3",
        "3rd": "3",
        "4th": "2",
        "5th": "—"
      }
    },
    {
      "level": 16,
      "features": [
        "Ability Score Improvement"
      ],
      "extras": {
        "Proficiency Bonus": "+5",
        "Infusions Known": "10",
        "Infused Items": "5",
        "Cantrips Known": "4",
        "1st": "4",
        "2nd": "3",
        "3rd": "3",
        "4th": "2",
        "5th": "—"
      }
    },
    {
      "level": 17,
      "features": [],
      "extras": {
        "Proficiency Bonus": "+6",
        "Infusions Known": "10",
        "Infused Items": "5",
        "Cantrips Known": "4",
        "1st": "4",
        "2nd": "3",
        "3rd": "3",
        "4th": "3",
        "5th": "1"
      }
    },
    {
      "level": 18,
      "features": [
        "Magic Item Master"
      ],
      "extras": {
        "Proficiency Bonus": "+6",
        "Infusions Known": "12",
        "Infused Items": "6",
        "Cantrips Known": "4",
        "1st": "4",
        "2nd": "3",
        "3rd": "3",
        "4th": "3",
        "5th": "1"
      }
    },
    {
      "level": 19,
      "features": [
        "Ability Score Improvement"
      ],
      "extras": {
        "Proficiency Bonus": "+6",
        "Infusions Known": "12",
        "Infused Items": "6",
        "Cantrips Known": "4",
        "1st": "4",
        "2nd": "3",
        "3rd": "3",
        "4th": "3",
        "5th": "2"
      }
    },
    {
      "level": 20,
      "features": [
        "Soul of Artifice"
      ],
      "extras": {
        "Proficiency Bonus": "+6",
        "Infusions Known": "12",
        "Infused Items": "6",
        "Cantrips Known": "4",
        "1st": "4",
        "2nd": "3",
        "3rd": "3",
        "4th": "3",
        "5th": "2"
      }
    }
  ],
  "features": [
    {
      "level": 1,
      "name": "Magical Tinkering",
      "description": "You've learned how to invest a spark of magic into mundane objects. With thieves' tools or artisan's tools in hand, you can touch a Tiny nonmagical object as an action and give it one of these magical properties of your choice: shed bright light in a 5-ft. radius (and dim 5 ft. more); emit a recorded message (up to 6 seconds) when tapped; emit a chosen odor or nonverbal sound; or display a static visual effect (picture, text up to 25 words, or shapes). The chosen property lasts indefinitely. As an action you can end the effect early. The maximum number of objects you can affect at once equals your Intelligence modifier (minimum 1)."
    },
    {
      "level": 1,
      "name": "Spellcasting",
      "description": "You channel magic through tools. You must have a spellcasting focus — thieves' tools or some kind of artisan's tool — in hand when casting any spell with this Spellcasting feature. After 2nd level, you can use any infused item as a spellcasting focus. Intelligence is your spellcasting ability. Spell save DC = 8 + your Proficiency Bonus + your Intelligence modifier. Spell attack modifier = your Proficiency Bonus + your Intelligence modifier. You prepare a number of artificer spells equal to your Intelligence modifier + half your artificer level (rounded down, minimum 1). You can cast any prepared spell as a Ritual if it has the Ritual tag."
    },
    {
      "level": 2,
      "name": "Infuse Item",
      "description": "You can imbue mundane items with magical infusions, turning those objects into magic items. When you gain this feature, pick four artificer infusions to learn (see Artificer Infusions). Whenever you finish a long rest, you can touch a nonmagical object and imbue it with one of your infusions; if it requires attunement you can attune to it instantly. Your infusion remains in an item indefinitely (until you die — then it vanishes after a number of days equal to your Intelligence modifier, minimum 1)."
    },
    {
      "level": 3,
      "name": "Artificer Specialist",
      "description": "Choose your specialization: Alchemist, Armorer, Artillerist, or Battle Smith. Your choice grants you features at 3rd level and again at 5th, 9th, and 15th level."
    },
    {
      "level": 3,
      "name": "The Right Tool for the Job",
      "description": "With thieves' tools or artisan's tools in hand, you can magically create one set of artisan's tools in an unoccupied space within 5 feet of you. Creation requires 1 hour of uninterrupted work, which can coincide with a short or long rest. The created tools are nonmagical and vanish when you use this feature again."
    },
    {
      "level": 4,
      "name": "Ability Score Improvement",
      "description": "Increase one ability score by 2, or two ability scores by 1. You can't increase a score above 20 with this feature."
    },
    {
      "level": 6,
      "name": "Tool Expertise",
      "description": "Your proficiency bonus is now doubled for any ability check you make that uses your proficiency with a tool."
    },
    {
      "level": 7,
      "name": "Flash of Genius",
      "description": "When you or another creature you can see within 30 feet of you makes an ability check or a saving throw, you can use your reaction to add your Intelligence modifier to the roll. You can use this feature a number of times equal to your Intelligence modifier (minimum 1). You regain all expended uses when you finish a long rest."
    },
    {
      "level": 8,
      "name": "Ability Score Improvement",
      "description": "Increase one ability score by 2, or two ability scores by 1."
    },
    {
      "level": 10,
      "name": "Magic Item Adept",
      "description": "You can attune to up to four magic items at once. If you craft a magic item with a rarity of common or uncommon, it takes you a quarter of the normal time, and it costs you half as much of the usual gold."
    },
    {
      "level": 11,
      "name": "Spell-Storing Item",
      "description": "After a long rest, you can touch one simple or martial weapon or one item you can use as a spellcasting focus, and store a 1st- or 2nd-level artificer spell in it (the spell must require 1 action to cast; you needn't have it prepared). While holding the object, a creature can take an action to produce the spell's effect from it (using your spellcasting ability modifier). The spell remains stored until used a number of times equal to twice your Intelligence modifier (minimum 2), or until you use this feature again."
    },
    {
      "level": 12,
      "name": "Ability Score Improvement",
      "description": "Increase one ability score by 2, or two ability scores by 1."
    },
    {
      "level": 14,
      "name": "Magic Item Savant",
      "description": "You can attune to up to five magic items at once. You also ignore all class, race, spell, and level requirements on attuning to or using a magic item."
    },
    {
      "level": 16,
      "name": "Ability Score Improvement",
      "description": "Increase one ability score by 2, or two ability scores by 1."
    },
    {
      "level": 18,
      "name": "Magic Item Master",
      "description": "You can attune to up to six magic items at once."
    },
    {
      "level": 19,
      "name": "Ability Score Improvement",
      "description": "Increase one ability score by 2, or two ability scores by 1."
    },
    {
      "level": 20,
      "name": "Soul of Artifice",
      "description": "You gain a +1 bonus to all saving throws per magic item you are currently attuned to. If you're reduced to 0 HP but not killed outright, you can use your reaction to end one of your artificer infusions, dropping you to 1 HP instead of 0."
    }
  ],
  "subclasses": [
    {
      "id": "alchemist",
      "name": "Alchemist",
      "features": [
        {
          "level": 3,
          "name": "Tool Proficiency (Alchemist's Supplies)",
          "description": "You gain proficiency with alchemist's supplies. If you already have it, you gain proficiency with one other type of artisan's tools of your choice."
        },
        {
          "level": 3,
          "name": "Alchemist Spells",
          "description": "You always have certain spells prepared after you reach particular levels: 3rd – healing word, ray of sickness; 5th – flaming sphere, Melf's acid arrow; 9th – gaseous form, mass healing word; 13th – blight, death ward; 17th – cloudkill, raise dead. They count as artificer spells but don't count against your prepared total."
        },
        {
          "level": 3,
          "name": "Experimental Elixir",
          "description": "When you finish a long rest, you can magically produce an experimental elixir in an empty flask you touch. Roll on the Experimental Elixir table for its effect (Healing, Swiftness, Resilience, Boldness, Flight, or Transformation). As an action, a creature can drink the elixir or administer it. Creating an elixir requires alchemist's supplies. The elixir lasts until drunk or your next long rest. You can also create elixirs by spending a spell slot of 1st level or higher (your action; choose the effect from the table). At 6th level, two elixirs at once; at 15th level, three."
        },
        {
          "level": 5,
          "name": "Alchemical Savant",
          "description": "Whenever you cast a spell using your alchemist's supplies as the focus, you gain a bonus to one roll of the spell that restores hit points or deals acid, fire, necrotic, or poison damage. The bonus equals your Intelligence modifier (minimum +1)."
        },
        {
          "level": 9,
          "name": "Restorative Reagents",
          "description": "Whenever a creature drinks an experimental elixir you created, the creature gains temporary hit points equal to 2d6 + your Intelligence modifier (minimum 1). You can cast lesser restoration without a spell slot or preparation, provided you use alchemist's supplies as the focus, a number of times equal to your Intelligence modifier (minimum 1) per long rest."
        },
        {
          "level": 15,
          "name": "Chemical Mastery",
          "description": "You gain resistance to acid damage and poison damage, and immunity to the poisoned condition. You can cast greater restoration and heal without a spell slot, without preparation, and without material components, provided you use alchemist's supplies as the focus. Once cast either spell with this feature, you can't do so again with that spell until you finish a long rest."
        }
      ]
    },
    {
      "id": "armorer",
      "name": "Armorer",
      "features": [
        {
          "level": 3,
          "name": "Tools of the Trade (Heavy Armor & Smith's Tools)",
          "description": "You gain proficiency with heavy armor and smith's tools. If you already have smith's tools, gain proficiency with one other type of artisan's tools of your choice."
        },
        {
          "level": 3,
          "name": "Armorer Spells",
          "description": "Always-prepared spells: 3rd – magic missile, thunderwave; 5th – mirror image, shatter; 9th – hypnotic pattern, lightning bolt; 13th – fire shield, greater invisibility; 17th – passwall, wall of force."
        },
        {
          "level": 3,
          "name": "Arcane Armor",
          "description": "As an action, you can turn a suit of armor you are wearing into Arcane Armor (with smith's tools in hand). It removes any Strength requirement, can serve as your spellcasting focus, can't be removed against your will, expands to cover your body (helmet retract/deploy as bonus action), and replaces missing limbs. You can doff or don it as an action. Continues to be Arcane Armor until you don another suit or die."
        },
        {
          "level": 3,
          "name": "Armor Model (Guardian or Infiltrator)",
          "description": "Choose Guardian or Infiltrator. Each model has a special weapon that uses Intelligence (instead of Str/Dex) for attack and damage rolls. You can change the model after a short or long rest with smith's tools.\n\nGuardian: Thunder Gauntlets (1d8 thunder, gives disadvantage on attack rolls vs other targets); Defensive Field (bonus action to gain temp HP equal to your level; uses = PB per long rest).\n\nInfiltrator: Lightning Launcher (1d6 lightning, range 90/300, +1d6 lightning bonus once per turn); Powered Steps (+5 ft speed); Dampening Field (advantage on Stealth)."
        },
        {
          "level": 5,
          "name": "Extra Attack",
          "description": "You can attack twice, instead of once, whenever you take the Attack action on your turn."
        },
        {
          "level": 9,
          "name": "Armor Modifications",
          "description": "Your Arcane Armor counts as separate items for Infuse Item: armor (chest), boots, helmet, and the armor's special weapon. Each can bear an infusion, and the infusions transfer over when you change the model. Maximum infused items increases by 2, but those extra items must be part of your Arcane Armor."
        },
        {
          "level": 15,
          "name": "Perfected Armor",
          "description": "Guardian: When a Huge or smaller creature you can see ends its turn within 30 feet, you can use your reaction to force a Strength save vs your spell save DC; on failure, pull it up to 30 feet toward you. If you pull it within 5 feet, you can make a melee weapon attack against it as part of the reaction (uses = PB per long rest).\n\nInfiltrator: Any creature taking lightning damage from your Lightning Launcher glimmers (sheds dim light 5-ft, disadvantage on attacks against you, next attack against it has advantage and on hit deals extra 1d6 lightning) until your next turn."
        }
      ]
    },
    {
      "id": "artillerist",
      "name": "Artillerist",
      "features": [
        {
          "level": 3,
          "name": "Tool Proficiency (Woodcarver's Tools)",
          "description": "You gain proficiency with woodcarver's tools. If you already have it, you gain proficiency with one other type of artisan's tools of your choice."
        },
        {
          "level": 3,
          "name": "Artillerist Spells",
          "description": "Always-prepared spells: 3rd – shield, thunderwave; 5th – scorching ray, shatter; 9th – fireball, wind wall; 13th – ice storm, wall of fire; 17th – cone of cold, wall of force."
        },
        {
          "level": 3,
          "name": "Eldritch Cannon",
          "description": "As an action (using woodcarver's or smith's tools), magically create a Small or Tiny eldritch cannon in an unoccupied space within 5 feet. Once per long rest free; otherwise expend a spell slot to create. AC 18, HP = five times your artificer level. Choose its type: Flamethrower (15-ft cone, Dex save vs DC, 2d8 fire half on save), Force Ballista (ranged spell attack 120 ft, 2d8 force, push 5 ft on hit), or Protector (10-ft burst, 1d8 + Int mod temp HP to allies). Bonus action to activate or move 15 ft (within 60 ft). Lasts 1 hour, 0 HP, or until dismissed."
        },
        {
          "level": 5,
          "name": "Arcane Firearm",
          "description": "Carve sigils into a wand, staff, or rod (after a long rest, with woodcarver's tools) — it becomes your arcane firearm and can serve as a spellcasting focus. When you cast an artificer spell through it, roll a d8 and add the result as a bonus to one of the spell's damage rolls."
        },
        {
          "level": 9,
          "name": "Explosive Cannon",
          "description": "Your Eldritch Cannon's damage rolls increase by 1d8. As an action, you can detonate a cannon within 60 ft, destroying it; each creature within 20 feet must make a Dexterity save vs your spell save DC, taking 3d8 force damage on a failed save (half on success)."
        },
        {
          "level": 15,
          "name": "Fortified Position",
          "description": "You and your allies have half cover within 10 feet of a cannon you create. You can have two cannons at once (created with two separate actions/spell slots), and you can activate both with the same bonus action. Cannons can be identical or different. You can't create a third while two exist."
        }
      ]
    },
    {
      "id": "battle-smith",
      "name": "Battle Smith",
      "features": [
        {
          "level": 3,
          "name": "Tool Proficiency (Smith's Tools)",
          "description": "You gain proficiency with smith's tools. If you already have it, you gain proficiency with one other type of artisan's tools of your choice."
        },
        {
          "level": 3,
          "name": "Battle Smith Spells",
          "description": "Always-prepared spells: 3rd – heroism, shield; 5th – branding smite, warding bond; 9th – aura of vitality, conjure barrage; 13th – aura of purity, fire shield; 17th – banishing smite, mass cure wounds."
        },
        {
          "level": 3,
          "name": "Battle Ready",
          "description": "You gain proficiency with martial weapons. When you attack with a magic weapon, you can use your Intelligence modifier (instead of Strength or Dexterity) for attack and damage rolls."
        },
        {
          "level": 3,
          "name": "Steel Defender",
          "description": "Tinkering produces a steel defender — a Medium construct companion (AC 15, HP = 2 + Int mod + 5×artificer level, Speed 40 ft). It uses your PB. Force-Empowered Rend (melee attack: spell attack mod + PB force damage). Repair (3/day, 2d8 + PB HP). Reaction: Deflect Attack (impose disadvantage on attack vs an ally within 5 ft of it). It shares your initiative count, takes its turn after yours, and obeys your commands. After a long rest with smith's tools, you can create a new defender (the old one perishes)."
        },
        {
          "level": 5,
          "name": "Extra Attack",
          "description": "You can attack twice, rather than once, whenever you take the Attack action on your turn."
        },
        {
          "level": 9,
          "name": "Arcane Jolt",
          "description": "When you or your steel defender hits with a magic weapon attack, you can channel magic through the strike for one of these effects: extra 2d6 force damage to the target; or heal 2d6 HP to a creature/object within 30 feet of the target. Uses = your Intelligence modifier (minimum 1) per long rest, no more than once per turn."
        },
        {
          "level": 15,
          "name": "Improved Defender",
          "description": "Your Arcane Jolt extra damage and healing increase to 4d6. Your steel defender gains a +2 bonus to AC. Whenever the defender uses Deflect Attack, the attacker takes force damage equal to 1d4 + your Intelligence modifier."
        }
      ]
    }
  ]
} satisfies CharacterClassInfo;
