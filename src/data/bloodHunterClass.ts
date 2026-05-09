import type { CharacterClassInfo } from './classData';

export const BLOOD_HUNTER_CLASS = {
  "id": "blood-hunter",
  "name": "Blood Hunter",
  "coreTraits": {
    "Source": "DND Beyond",
    "Primary Ability": "Intelligence or Wisdom; Strength or Dexterity also matters for multiclassing",
    "Hit Point Die": "D10 per Blood Hunter level",
    "Saving Throw Proficiencies": "Dexterity and Intelligence",
    "Skill Proficiencies": "Choose 3: Acrobatics, Arcana, Athletics, History, Insight, Investigation, Religion, or Survival",
    "Weapon Proficiencies": "Simple and Martial weapons",
    "Tool Proficiencies": "Alchemist's Supplies",
    "Armor Training": "Light armor, Medium armor, and Shields",
    "Multiclass Requirement": "Intelligence 13+ and Strength or Dexterity 13+",
    "Starting Equipment": "Choose martial/simple weapons, crossbow option, studded leather or scale mail, explorer's pack, and alchemist's supplies"
  },
  "progression": [
    {
      "level": 1,
      "features": [
        "Hunter's Bane",
        "Blood Maledict"
      ],
      "extras": {
        "Proficiency Bonus": "+2",
        "Hemocraft Die": "1d4",
        "Blood Curses Known": "1"
      }
    },
    {
      "level": 2,
      "features": [
        "Fighting Style",
        "Crimson Rite"
      ],
      "extras": {
        "Proficiency Bonus": "+2",
        "Hemocraft Die": "1d4",
        "Blood Curses Known": "1"
      }
    },
    {
      "level": 3,
      "features": [
        "Blood Hunter Subclass"
      ],
      "extras": {
        "Proficiency Bonus": "+2",
        "Hemocraft Die": "1d4",
        "Blood Curses Known": "1"
      }
    },
    {
      "level": 4,
      "features": [
        "Ability Score Improvement"
      ],
      "extras": {
        "Proficiency Bonus": "+2",
        "Hemocraft Die": "1d4",
        "Blood Curses Known": "1"
      }
    },
    {
      "level": 5,
      "features": [
        "Extra Attack"
      ],
      "extras": {
        "Proficiency Bonus": "+3",
        "Hemocraft Die": "1d6",
        "Blood Curses Known": "1"
      }
    },
    {
      "level": 6,
      "features": [
        "Brand of Castigation",
        "Blood Maledict (2/rest)"
      ],
      "extras": {
        "Proficiency Bonus": "+3",
        "Hemocraft Die": "1d6",
        "Blood Curses Known": "2"
      }
    },
    {
      "level": 7,
      "features": [
        "Subclass feature",
        "Crimson Rite Improvement"
      ],
      "extras": {
        "Proficiency Bonus": "+3",
        "Hemocraft Die": "1d6",
        "Blood Curses Known": "2"
      }
    },
    {
      "level": 8,
      "features": [
        "Ability Score Improvement"
      ],
      "extras": {
        "Proficiency Bonus": "+3",
        "Hemocraft Die": "1d6",
        "Blood Curses Known": "2"
      }
    },
    {
      "level": 9,
      "features": [
        "Grim Psychometry"
      ],
      "extras": {
        "Proficiency Bonus": "+4",
        "Hemocraft Die": "1d6",
        "Blood Curses Known": "2"
      }
    },
    {
      "level": 10,
      "features": [
        "Dark Augmentation"
      ],
      "extras": {
        "Proficiency Bonus": "+4",
        "Hemocraft Die": "1d6",
        "Blood Curses Known": "3"
      }
    },
    {
      "level": 11,
      "features": [
        "Subclass feature"
      ],
      "extras": {
        "Proficiency Bonus": "+4",
        "Hemocraft Die": "1d8",
        "Blood Curses Known": "3"
      }
    },
    {
      "level": 12,
      "features": [
        "Ability Score Improvement"
      ],
      "extras": {
        "Proficiency Bonus": "+4",
        "Hemocraft Die": "1d8",
        "Blood Curses Known": "3"
      }
    },
    {
      "level": 13,
      "features": [
        "Brand of Tethering",
        "Blood Maledict (3/rest)"
      ],
      "extras": {
        "Proficiency Bonus": "+5",
        "Hemocraft Die": "1d8",
        "Blood Curses Known": "3"
      }
    },
    {
      "level": 14,
      "features": [
        "Hardened Soul",
        "Crimson Rite Improvement"
      ],
      "extras": {
        "Proficiency Bonus": "+5",
        "Hemocraft Die": "1d8",
        "Blood Curses Known": "4"
      }
    },
    {
      "level": 15,
      "features": [
        "Subclass feature"
      ],
      "extras": {
        "Proficiency Bonus": "+5",
        "Hemocraft Die": "1d8",
        "Blood Curses Known": "4"
      }
    },
    {
      "level": 16,
      "features": [
        "Ability Score Improvement"
      ],
      "extras": {
        "Proficiency Bonus": "+5",
        "Hemocraft Die": "1d8",
        "Blood Curses Known": "4"
      }
    },
    {
      "level": 17,
      "features": [
        "Blood Maledict (4/rest)"
      ],
      "extras": {
        "Proficiency Bonus": "+6",
        "Hemocraft Die": "1d10",
        "Blood Curses Known": "4"
      }
    },
    {
      "level": 18,
      "features": [
        "Subclass feature"
      ],
      "extras": {
        "Proficiency Bonus": "+6",
        "Hemocraft Die": "1d10",
        "Blood Curses Known": "5"
      }
    },
    {
      "level": 19,
      "features": [
        "Ability Score Improvement"
      ],
      "extras": {
        "Proficiency Bonus": "+6",
        "Hemocraft Die": "1d10",
        "Blood Curses Known": "5"
      }
    },
    {
      "level": 20,
      "features": [
        "Sanguine Mastery"
      ],
      "extras": {
        "Proficiency Bonus": "+6",
        "Hemocraft Die": "1d10",
        "Blood Curses Known": "5"
      }
    }
  ],
  "features": [
    {
      "level": 1,
      "name": "Hunter's Bane",
      "description": "You have survived the Hunter’s Bane, a dangerous ritual that alters your life’s blood and hones your senses against evil. You have advantage on Wisdom (Survival) checks to track fey, fiends, or undead, and on Intelligence checks to recall information about them.\n\nHemocraft save DC = 8 + your proficiency bonus + your Hemocraft modifier (your choice between Intelligence and Wisdom)."
    },
    {
      "level": 1,
      "name": "Blood Maledict",
      "description": "You know one Blood Curse of your choice. You learn additional blood curses at levels 6, 10, 14, and 18. When you invoke a blood curse, you can amplify it by taking necrotic damage equal to one roll of your hemocraft die; the amplified curse gains an additional effect. Creatures without blood are immune to blood curses unless the curse is amplified. Uses refresh on a short or long rest and increase at levels 6, 13, and 17."
    },
    {
      "level": 2,
      "name": "Fighting Style",
      "description": "Choose Archery, Dueling, Great Weapon Fighting, or Two-Weapon Fighting. You can’t take the same Fighting Style option more than once."
    },
    {
      "level": 2,
      "name": "Crimson Rite",
      "description": "As a bonus action, activate a rite on one weapon you’re holding. You take necrotic damage equal to one roll of your hemocraft die. While active, attacks with that weapon are magical and deal extra damage equal to your hemocraft die. You learn one rite at level 2, another at level 7, and another at level 14.\n\nRites include Rite of the Flame (fire), Rite of the Frozen (cold), Rite of the Storm (lightning), and level 14 options: Rite of the Dead (necrotic), Rite of the Oracle (psychic), and Rite of the Roar (thunder)."
    },
    {
      "level": 3,
      "name": "Blood Hunter Subclass",
      "description": "At 3rd level, you commit to a blood hunter order.\n\n| Order | Source |\n|---|---|\n| Ghostslayer | DND Beyond |\n| Lycan | DND Beyond |\n| Mutant | DND Beyond |\n| Profane Soul | DND Beyond |"
    },
    {
      "level": 4,
      "name": "Ability Score Improvement",
      "description": "At levels 4, 8, 12, 16, and 19, increase one ability score by 2 or two ability scores by 1, or use the optional feat rule if your DM allows it."
    },
    {
      "level": 5,
      "name": "Extra Attack",
      "description": "You can attack twice, instead of once, whenever you take the Attack action on your turn."
    },
    {
      "level": 6,
      "name": "Brand of Castigation",
      "description": "When you damage a creature with a weapon for which you have an active crimson rite, you can brand it. You always know the direction to the branded creature while it is on the same plane. Each time the branded creature deals damage to you or a creature you can see within 5 feet of you, it takes psychic damage equal to your Hemocraft modifier (minimum 1)."
    },
    {
      "level": 9,
      "name": "Grim Psychometry",
      "description": "You have advantage on Intelligence (History) checks to recall sinister or tragic history connected to an object you are touching or your current location."
    },
    {
      "level": 10,
      "name": "Dark Augmentation",
      "description": "Your speed increases by 5 feet, and you gain a bonus to Strength, Dexterity, and Constitution saving throws equal to your Hemocraft modifier (minimum +1)."
    },
    {
      "level": 13,
      "name": "Brand of Tethering",
      "description": "The psychic damage from Brand of Castigation increases to twice your Hemocraft modifier (minimum 2). The branded creature can’t Dash, and if it tries to teleport or leave the plane, it takes 4d6 psychic damage and must make a Wisdom saving throw; on a failure, the attempt fails."
    },
    {
      "level": 14,
      "name": "Hardened Soul",
      "description": "You have advantage on saving throws against being charmed and frightened."
    },
    {
      "level": 20,
      "name": "Sanguine Mastery",
      "description": "Once per turn, whenever a blood hunter feature requires you to roll a hemocraft die, you can reroll the die and use either roll. Also, when you score a critical hit with a weapon with an active crimson rite, you regain one expended use of Blood Maledict."
    }
  ],
  "subclasses": [
    {
      "id": "order-of-the-ghostslayer",
      "name": "Order of the Ghostslayer",
      "features": [
        {
          "level": 3,
          "name": "Rite of the Dawn",
          "description": "You learn the Rite of the Dawn as part of Crimson Rite. Its extra damage is radiant. While active, your weapon sheds bright light in a 20-foot radius, you have resistance to necrotic damage, and when you hit an undead creature, you roll an additional hemocraft die for rite damage."
        },
        {
          "level": 3,
          "name": "Curse Specialist",
          "description": "You gain an additional use of Blood Maledict. Your blood curses can target any creature, whether it has blood or not."
        },
        {
          "level": 7,
          "name": "Aether Walk",
          "description": "At the start of your turn, you can step into the veil between planes if you aren’t incapacitated. You can move through creatures and objects as difficult terrain and can see and affect creatures and objects on the Ethereal Plane. The feature lasts for rounds equal to your Hemocraft modifier (minimum 1). Starting at level 15, you can use Aether Walk twice between rests."
        },
        {
          "level": 11,
          "name": "Brand of Sundering",
          "description": "Whenever you hit a creature with a weapon with an active crimson rite, you roll an additional hemocraft die for rite damage. A branded creature with Incorporeal Movement or a similar feature can’t move through creatures or objects while branded."
        },
        {
          "level": 15,
          "name": "Blood Curse of the Exorcist",
          "description": "You gain the Blood Curse of the Exorcist for Blood Maledict; it doesn’t count against your number of blood curses known."
        },
        {
          "level": 18,
          "name": "Rite Revival",
          "description": "If you have one or more crimson rites active and are reduced to 0 hit points but don’t die outright, you can end all active rites and drop to 1 hit point instead."
        }
      ]
    },
    {
      "id": "order-of-the-lycan",
      "name": "Order of the Lycan",
      "features": [
        {
          "level": 3,
          "name": "Heightened Senses",
          "description": "You have advantage on Wisdom (Perception) checks that rely on hearing or smell."
        },
        {
          "level": 3,
          "name": "Hybrid Transformation",
          "description": "As a bonus action, transform into a hybrid form for up to 1 hour. While transformed you gain Feral Might, Resilient Hide, Predatory Strikes, and Bloodlust. Feral Might grants advantage on Strength checks and saves and a melee damage bonus that increases at levels 11 and 18. Resilient Hide grants resistance to nonmagical bludgeoning, piercing, and slashing damage not made with silvered weapons, and +1 AC when not wearing heavy armor. Predatory Strikes lets your unarmed strikes use Crimson Rite and improves your unarmed strikes."
        },
        {
          "level": 7,
          "name": "Stalker's Prowess",
          "description": "Your speed increases by 10 feet, and your long jump and high jump improve. In hybrid form, Improved Predatory Strikes grants a bonus to attack rolls with unarmed strikes, increasing at levels 11 and 18; active crimson rite unarmed strikes count as magical."
        },
        {
          "level": 11,
          "name": "Advanced Transformation",
          "description": "You can use Hybrid Transformation twice between short or long rests. Your hybrid form also gains Lycan Regeneration, restoring hit points at the start of each turn when you are above 0 but below half hit points."
        },
        {
          "level": 15,
          "name": "Brand of the Voracious",
          "description": "You have advantage on Bloodlust saving throws while in hybrid form. While in hybrid form, you also have advantage on attack rolls against a creature branded by you."
        },
        {
          "level": 18,
          "name": "Hybrid Transformation Mastery",
          "description": "You can use Hybrid Transformation an unlimited number of times, and the form lasts until you revert, fall unconscious, or die. You also gain Blood Curse of the Howl, which doesn’t count against blood curses known."
        }
      ]
    },
    {
      "id": "order-of-the-mutant",
      "name": "Order of the Mutant",
      "features": [
        {
          "level": 3,
          "name": "Mutagencraft",
          "description": "You learn to create mutagens that temporarily alter your abilities. As a bonus action, you consume a mutagen; its effects and side effects last until you finish a short or long rest unless stated otherwise.\n\n| Blood Hunter Level | Mutagens Created | Formulas Known |\n|---|---:|---:|\n| 3rd | 1 | 4 |\n| 7th | 2 | 5 |\n| 11th | 2 | 6 |\n| 15th | 3 | 7 |\n| 18th | 3 | 8 |"
        },
        {
          "level": 7,
          "name": "Strange Metabolism",
          "description": "You gain immunity to poison damage and the poisoned condition. As a bonus action, you can ignore the negative side effect of one mutagen affecting you for 1 minute; once used, this benefit refreshes on a long rest."
        },
        {
          "level": 11,
          "name": "Brand of Axiom",
          "description": "When you brand a creature, any illusion or invisibility on it ends, and it can’t benefit from invisibility or illusion effects while branded. Shapechanging or polymorph-like effects can be disrupted by your Wisdom saving throw effect."
        },
        {
          "level": 15,
          "name": "Blood Curse of Corrosion",
          "description": "You gain Blood Curse of Corrosion for Blood Maledict; it doesn’t count against your blood curses known."
        },
        {
          "level": 18,
          "name": "Exalted Mutation",
          "description": "As a bonus action, choose one mutagen affecting you. Its effects and side effects end, and a mutagen whose formula you know immediately takes effect in its place. You can use this a number of times equal to your Hemocraft modifier (minimum once), refreshing on a long rest."
        }
      ]
    },
    {
      "id": "order-of-the-profane-soul",
      "name": "Order of the Profane Soul",
      "features": [
        {
          "level": 3,
          "name": "Profane Soul Spellcasting",
          "description": "You augment your combat techniques with pact magic from the Warlock spell list. Your Hemocraft ability is your spellcasting ability.\n\n| Blood Hunter Level | Cantrips Known | Spells Known | Spell Slots | Slot Level |\n|---|---:|---:|---:|---|\n| 3rd | 2 | 2 | 1 | 1st |\n| 4th | 2 | 2 | 1 | 1st |\n| 5th | 2 | 3 | 1 | 1st |\n| 6th | 2 | 3 | 2 | 1st |\n| 7th | 2 | 4 | 2 | 2nd |\n| 8th | 2 | 4 | 2 | 2nd |\n| 9th | 2 | 5 | 2 | 2nd |\n| 10th | 3 | 5 | 2 | 2nd |\n| 11th | 3 | 6 | 2 | 2nd |\n| 12th | 3 | 6 | 2 | 2nd |\n| 13th | 3 | 7 | 2 | 3rd |\n| 14th | 3 | 7 | 2 | 3rd |\n| 15th | 3 | 8 | 2 | 3rd |\n| 16th | 3 | 8 | 2 | 3rd |\n| 17th | 3 | 9 | 2 | 3rd |\n| 18th | 3 | 9 | 2 | 3rd |\n| 19th | 3 | 10 | 2 | 4th |\n| 20th | 3 | 11 | 2 | 4th |\n\nNote: the final two rows are 4th-level spell slots. At Blood Hunter levels 19 and 20, the Slot Level is 4th, not 3rd."
        },
        {
          "level": 3,
          "name": "Otherworldly Patron",
          "description": "Choose an otherworldly patron. Your choice augments some subclass features.\n\n| Otherworldly Patron | Source |\n|---|---|\n| The Archfey, the Fiend, or the Great Old One | PHB |\n| The Undying | SCAG |\n| The Celestial or the Hexblade | XGE |\n| The Fathomless or the Genie | TCE |\n| The Undead | VRGR |"
        },
        {
          "level": 3,
          "name": "Rite Focus",
          "description": "While you have an active crimson rite, you can use your weapon as a spellcasting focus for Warlock spells and gain a benefit based on your patron, such as Archfey revealing targets, Celestial healing, Fathomless underwater breathing and speed reduction, Fiend rite rerolls, Genie temporary flight, Great Old One fright on critical hits, Hexblade extra damage after a blood curse, Undead necrotic resistance reaction, or Undying healing when you reduce a hostile creature to 0 hit points."
        },
        {
          "level": 7,
          "name": "Mystic Frenzy",
          "description": "When you use your action to cast a cantrip, you can immediately make one weapon attack as a bonus action."
        },
        {
          "level": 7,
          "name": "Revealed Arcana",
          "description": "Your patron grants a distinctive spell you can cast using a pact magic spell slot, refreshing on a long rest. Examples include Blur for Archfey, Lesser Restoration for Celestial, Gust of Wind for Fathomless, Scorching Ray for Fiend, Phantasmal Force for Genie, Detect Thoughts for Great Old One, Branding Smite for Hexblade, Blindness/Deafness for Undead, and Silence for Undying."
        },
        {
          "level": 11,
          "name": "Brand of the Sapping Scar",
          "description": "A creature branded by you has disadvantage on saving throws against your Warlock spells."
        },
        {
          "level": 15,
          "name": "Unsealed Arcana",
          "description": "Your patron grants an additional spell you can cast without expending a spell slot, refreshing on a long rest. Examples include Slow, Revivify, Lightning Bolt, Fireball, Protection from Energy, Haste, Blink, Speak with Dead, or Bestow Curse depending on patron."
        },
        {
          "level": 18,
          "name": "Blood Curse of the Soul Eater",
          "description": "You gain Blood Curse of the Soul Eater for Blood Maledict; it doesn’t count against your number of blood curses known."
        }
      ]
    }
  ]
} satisfies CharacterClassInfo;

export type BloodHunterBloodCurse = {
  id: string;
  name: string;
  prerequisite?: string;
  description: string;
  amplify?: string;
};

export const BLOOD_HUNTER_BLOOD_CURSES: BloodHunterBloodCurse[] = [
  {
    id: 'blood-curse-of-the-anxious',
    name: 'Blood Curse of the Anxious',
    description: 'As a bonus action, you harry the body or mind of a creature within 30 feet of you, making them susceptible to forceful influence. Until the end of your next turn, Charisma (Intimidation) checks made against the cursed creature have advantage.',
    amplify: 'The next Wisdom saving throw the cursed creature makes before this curse ends has disadvantage.',
  },
  {
    id: 'blood-curse-of-binding',
    name: 'Blood Curse of Binding',
    description: 'As a bonus action, you attempt to bind a Large or smaller creature you can see within 30 feet of you, which must make a Strength saving throw. On a failure, the cursed creature’s speed is reduced to 0 and it can’t use reactions until the end of your next turn.',
    amplify: 'This curse lasts for 1 minute and can affect any creature regardless of size. The cursed creature can repeat the saving throw at the end of each of its turns, ending the curse on itself on a success.',
  },
  {
    id: 'blood-curse-of-bloated-agony',
    name: 'Blood Curse of Bloated Agony',
    description: 'As a bonus action, you curse a creature that you can see within 30 feet of you, causing its body to swell until the end of your next turn. For the duration, the creature has disadvantage on Strength checks and Dexterity checks, and takes 1d8 necrotic damage if it makes more than one attack during its turn.',
    amplify: 'This curse lasts for 1 minute. The cursed creature can make a Constitution saving throw at the end of each of its turns, ending the curse on itself on a success.',
  },
  {
    id: 'blood-curse-of-corrosion',
    name: 'Blood Curse of Corrosion',
    prerequisite: '15th level, Order of the Mutant',
    description: 'As a bonus action, you cause a creature within 30 feet of you to become poisoned. The cursed creature can make a Constitution saving throw at the end of each of its turns, ending the curse on itself on a success.',
    amplify: 'The cursed creature takes 4d6 necrotic damage when you inflict this curse, and it takes this damage again each time it fails a Constitution saving throw to end the curse.',
  },
  {
    id: 'blood-curse-of-the-exorcist',
    name: 'Blood Curse of the Exorcist',
    prerequisite: '15th level, Order of the Ghostslayer',
    description: 'As a bonus action, you choose one creature you can see within 30 feet of you that is charmed or frightened, or which is under a possession effect. The target creature is no longer charmed, frightened, or possessed.',
    amplify: 'A creature that charmed, frightened, or possessed the target of your curse takes 3d6 psychic damage and must succeed on a Wisdom saving throw or be stunned until the end of your next turn.',
  },
  {
    id: 'blood-curse-of-exposure',
    name: 'Blood Curse of Exposure',
    description: 'When a creature you can see within 30 feet of you takes damage from an attack or spell, you can use your reaction to temporarily weaken its resilience. Until the end of the target’s next turn, it loses resistance to all the damage types dealt by the triggering attack or spell, including for that triggering effect.',
    amplify: 'The target instead loses invulnerability to the damage types of the triggering attack or spell, but has resistance to those damage types until the end of its next turn.',
  },
  {
    id: 'blood-curse-of-the-eyeless',
    name: 'Blood Curse of the Eyeless',
    description: 'When a creature you can see within 30 feet of you makes an attack, you can use your reaction to roll one hemocraft die and subtract the number rolled from the creature’s attack roll. You can choose to use this feature after the creature’s roll, but before the DM determines whether the attack hits or misses. The creature is immune to this curse if it is immune to the blinded condition.',
    amplify: 'You apply this curse to all the creature’s attack rolls until the end of the creature’s turn. You roll separately for each affected attack.',
  },
  {
    id: 'blood-curse-of-the-fallen-puppet',
    name: 'Blood Curse of the Fallen Puppet',
    description: 'When a creature you can see within 30 feet of you drops to 0 hit points, you can use your reaction to instill that creature with a final act of aggression. The creature immediately makes one weapon attack against a target of your choice within its range.',
    amplify: 'You can first cause the cursed creature to move up to half its speed, and you grant a bonus to its attack roll equal to your Hemocraft modifier, minimum +1.',
  },
  {
    id: 'blood-curse-of-the-howl',
    name: 'Blood Curse of the Howl',
    prerequisite: '18th level, Order of the Lycan',
    description: 'As an action, you unleash a bloodcurdling howl. Each creature within 30 feet of you that can hear you must succeed on a Wisdom saving throw or become frightened of you until the end of your next turn. If a creature fails by 5 or more, it is stunned while frightened in this way. You can choose any number of creatures you can see to be unaffected.',
    amplify: 'The range of this curse increases to 60 feet.',
  },
  {
    id: 'blood-curse-of-the-marked',
    name: 'Blood Curse of the Marked',
    description: 'As a bonus action, you mark a creature that you can see within 30 feet of you. Until the end of your turn, whenever you hit the cursed creature with a weapon for which you have an active crimson rite, you roll an additional hemocraft die when determining the extra damage from the rite.',
    amplify: 'The next attack roll you make against the target before the end of your turn has advantage.',
  },
  {
    id: 'blood-curse-of-the-muddled-mind',
    name: 'Blood Curse of the Muddled Mind',
    description: 'As a bonus action, you curse a creature that you can see within 30 feet of you that is concentrating on a spell or using a feature that requires concentration. That creature has disadvantage on the next Constitution saving throw it makes to maintain concentration before the end of your next turn.',
    amplify: 'The cursed creature has disadvantage on all Constitution saving throws made to maintain concentration until the end of your next turn.',
  },
  {
    id: 'blood-curse-of-the-soul-eater',
    name: 'Blood Curse of the Soul Eater',
    prerequisite: '18th level, Order of the Profane Soul',
    description: 'When a creature that isn’t a construct or undead is reduced to 0 hit points within 30 feet of you, you can use your reaction to offer their life energy to your patron in exchange for power. Until the end of your next turn, you make attacks with advantage and you have resistance to all damage.',
    amplify: 'Additionally, you regain an expended warlock spell slot. Once you’ve amplified this blood curse, you must finish a long rest before you can amplify it again.',
  },
];
