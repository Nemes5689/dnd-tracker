import { BLOOD_HUNTER_CLASS } from './bloodHunterClass';
import { ARTIFICER_CLASS } from './artificerClass';
// Generated from the uploaded D&D 2024 class markdown files.
// Kept local/offline so the app can show class/subclass choices without a network request.

export interface ClassFeatureInfo {
  level: number;
  name: string;
  description?: string;
}

export interface ClassProgressionRow {
  level: number;
  features: string[];
  extras: Record<string, string>;
}

export interface SubclassInfo {
  id: string;
  name: string;
  features: ClassFeatureInfo[];
}

export interface CharacterClassInfo {
  id: string;
  name: string;
  coreTraits: Record<string, string>;
  progression: ClassProgressionRow[];
  features: ClassFeatureInfo[];
  subclasses: SubclassInfo[];
}

export const DND_2024_CLASSES = [
  {
    "id": "barbarian",
    "name": "Barbarian",
    "coreTraits": {
      "Primary Ability": "Strength",
      "Hit Point Die": "D12 per Barbarian level",
      "Saving Throw Proficiencies": "Strength and Constitution",
      "Skill Proficiencies": "Choose 2: Animal Handling, Athletics, Intimidation, Nature, Perception, or Survival",
      "Weapon Proficiencies": "Simple and Martial weapons",
      "Armor Training": "Light and Medium armor and Shields",
      "Starting Equipment": "Choose A or B: (A) Greataxe, 4 Handaxes, Explorer's Pack, and 15 GP; or (B) 75 GP"
    },
    "progression": [
      {
        "level": 1,
        "features": [
          "Rage",
          "Unarmored Defense",
          "Weapon Mastery"
        ],
        "extras": {
          "Proficiency Bonus": "+2",
          "Rages": "2",
          "Rage Damage": "+2",
          "Weapon Mastery": "2"
        }
      },
      {
        "level": 2,
        "features": [
          "Danger Sense",
          "Reckless Attack"
        ],
        "extras": {
          "Proficiency Bonus": "+2",
          "Rages": "2",
          "Rage Damage": "+2",
          "Weapon Mastery": "2"
        }
      },
      {
        "level": 3,
        "features": [
          "Barbarian Subclass",
          "Primal Knowledge"
        ],
        "extras": {
          "Proficiency Bonus": "+2",
          "Rages": "3",
          "Rage Damage": "+2",
          "Weapon Mastery": "2"
        }
      },
      {
        "level": 4,
        "features": [
          "Ability Score Improvement"
        ],
        "extras": {
          "Proficiency Bonus": "+2",
          "Rages": "3",
          "Rage Damage": "+2",
          "Weapon Mastery": "3"
        }
      },
      {
        "level": 5,
        "features": [
          "Extra Attack",
          "Fast Movement"
        ],
        "extras": {
          "Proficiency Bonus": "+3",
          "Rages": "3",
          "Rage Damage": "+2",
          "Weapon Mastery": "3"
        }
      },
      {
        "level": 6,
        "features": [
          "Subclass feature"
        ],
        "extras": {
          "Proficiency Bonus": "+3",
          "Rages": "4",
          "Rage Damage": "+2",
          "Weapon Mastery": "3"
        }
      },
      {
        "level": 7,
        "features": [
          "Feral Instinct",
          "Instinctive Pounce"
        ],
        "extras": {
          "Proficiency Bonus": "+3",
          "Rages": "4",
          "Rage Damage": "+2",
          "Weapon Mastery": "3"
        }
      },
      {
        "level": 8,
        "features": [
          "Ability Score Improvement"
        ],
        "extras": {
          "Proficiency Bonus": "+3",
          "Rages": "4",
          "Rage Damage": "+2",
          "Weapon Mastery": "3"
        }
      },
      {
        "level": 9,
        "features": [
          "Brutal Strike"
        ],
        "extras": {
          "Proficiency Bonus": "+4",
          "Rages": "4",
          "Rage Damage": "+3",
          "Weapon Mastery": "3"
        }
      },
      {
        "level": 10,
        "features": [
          "Subclass feature"
        ],
        "extras": {
          "Proficiency Bonus": "+4",
          "Rages": "4",
          "Rage Damage": "+3",
          "Weapon Mastery": "4"
        }
      },
      {
        "level": 11,
        "features": [
          "Relentless Rage"
        ],
        "extras": {
          "Proficiency Bonus": "+4",
          "Rages": "4",
          "Rage Damage": "+3",
          "Weapon Mastery": "4"
        }
      },
      {
        "level": 12,
        "features": [
          "Ability Score Improvement"
        ],
        "extras": {
          "Proficiency Bonus": "+4",
          "Rages": "5",
          "Rage Damage": "+3",
          "Weapon Mastery": "4"
        }
      },
      {
        "level": 13,
        "features": [
          "Improved Brutal Strike"
        ],
        "extras": {
          "Proficiency Bonus": "+5",
          "Rages": "5",
          "Rage Damage": "+3",
          "Weapon Mastery": "4"
        }
      },
      {
        "level": 14,
        "features": [
          "Subclass feature"
        ],
        "extras": {
          "Proficiency Bonus": "+5",
          "Rages": "5",
          "Rage Damage": "+3",
          "Weapon Mastery": "4"
        }
      },
      {
        "level": 15,
        "features": [
          "Persistent Rage"
        ],
        "extras": {
          "Proficiency Bonus": "+5",
          "Rages": "5",
          "Rage Damage": "+3",
          "Weapon Mastery": "4"
        }
      },
      {
        "level": 16,
        "features": [
          "Ability Score Improvement"
        ],
        "extras": {
          "Proficiency Bonus": "+5",
          "Rages": "5",
          "Rage Damage": "+4",
          "Weapon Mastery": "4"
        }
      },
      {
        "level": 17,
        "features": [
          "Improved Brutal Strike"
        ],
        "extras": {
          "Proficiency Bonus": "+6",
          "Rages": "6",
          "Rage Damage": "+4",
          "Weapon Mastery": "4"
        }
      },
      {
        "level": 18,
        "features": [
          "Indomitable Might"
        ],
        "extras": {
          "Proficiency Bonus": "+6",
          "Rages": "6",
          "Rage Damage": "+4",
          "Weapon Mastery": "4"
        }
      },
      {
        "level": 19,
        "features": [
          "Epic Boon"
        ],
        "extras": {
          "Proficiency Bonus": "+6",
          "Rages": "6",
          "Rage Damage": "+4",
          "Weapon Mastery": "4"
        }
      },
      {
        "level": 20,
        "features": [
          "Primal Champion"
        ],
        "extras": {
          "Proficiency Bonus": "+6",
          "Rages": "6",
          "Rage Damage": "+4",
          "Weapon Mastery": "4"
        }
      }
    ],
    "features": [
      {
        "level": 1,
        "name": "Rage",
        "description": "You can imbue yourself with a primal power called Rage, a force that grants you extraordinary might and resilience. You can enter it as a Bonus Action if you aren't wearing Heavy armor. You can enter your Rage the number of times shown for your Barbarian level in the Rages column of the Barbarian Features table. You regain one expended use when you finish a Short Rest, and you regain all expended uses when you finish a Long Rest. While active, your Rage follows the rules below. *Damage Resistance.* You have Resistance to Bludgeoning, Piercing, and Slashing damage. Rage Damage. When you make an attack using Strength—with either a weapon or an Unarmed Strike—and deal damage to the target, you gain a bonus to the damage that increases as you gain levels as a Barbarian, as shown in the Rage Damage column of the Barbarian Features table. Strength Advantage. You have Advantage on Strength checks and Strength saving throws. No Concentration or Spells. You can't maintain Concentration, and you can't cast spells. Duration. The Rage lasts until the end of your next turn, and it ends early if you don Heavy armor or have the Incapacitated condition. If your Rage is still active on your next turn, you can extend the Rage for another round by doing one of the following: - Make an attack roll against an enemy. - Force an enemy to make a saving throw. - Take a Bonus Action to extend your Rage. Each time the Rage is extended, it lasts until the end of your next turn. You can maintain a Rage for up to 10 minutes."
      },
      {
        "level": 1,
        "name": "Unarmored Defense",
        "description": "While you aren't wearing any armor, your base Armor Class equals 10 plus your Dexterity and Constitution modifiers. You can use a Shield and still gain this benefit."
      },
      {
        "level": 1,
        "name": "Weapon Mastery",
        "description": "Your training with weapons allows you to use the mastery properties of two kinds of Simple or Martial Melee weapons of your choice, such as Greataxes and Handaxes. Whenever you finish a Long Rest, you can practice weapon drills and change one of those weapon choices. When you reach certain Barbarian levels, you gain the ability to use the mastery properties of more kinds of weapons, as shown in the Weapon Mastery column of the Barbarian Features table."
      },
      {
        "level": 2,
        "name": "Danger Sense",
        "description": "You gain an uncanny sense of when things aren't as they should be, giving you an edge when you dodge perils. You have Advantage on Dexterity saving throws unless you have the Incapacitated condition."
      },
      {
        "level": 2,
        "name": "Reckless Attack",
        "description": "You can throw aside all concern for defense to attack with increased ferocity. When you make your first attack roll on your turn, you can decide to attack recklessly. Doing so gives you Advantage on attack rolls using Strength until the start of your next turn, but attack rolls against you have Advantage during that time."
      },
      {
        "level": 3,
        "name": "Barbarian Subclass",
        "description": "You gain a Barbarian subclass of your choice. The Path of the Berserker subclass is detailed after this class's description. A subclass is a specialization that grants you features at certain Barbarian levels. For the rest of your career, you gain each of your subclass's features that are of your Barbarian level or lower."
      },
      {
        "level": 3,
        "name": "Primal Knowledge",
        "description": "You gain proficiency in another skill of your choice from the skill list available to Barbarians at level 1. In addition, while your Rage is active, you can channel primal power when you attempt certain tasks; whenever you make an ability check using one of the following skills, you can make it as a Strength check even if it normally uses a different ability: Acrobatics, Intimidation, Perception, Stealth, or Survival. When you use this ability, your Strength represents primal power coursing through you, honing your agility, bearing, and senses."
      },
      {
        "level": 4,
        "name": "Ability Score Improvement",
        "description": "You gain the Ability Score Improvement feat (see \"Feats\") or another feat of your choice for which you qualify. You gain this feature again at Barbarian levels 8, 12, and 16."
      },
      {
        "level": 5,
        "name": "Extra Attack",
        "description": "You can attack twice instead of once whenever you take the Attack action on your turn."
      },
      {
        "level": 5,
        "name": "Fast Movement",
        "description": "Your speed increases by 10 feet while you aren't wearing Heavy armor."
      },
      {
        "level": 7,
        "name": "Feral Instinct",
        "description": "Your instincts are so honed that you have Advantage on Initiative rolls."
      },
      {
        "level": 7,
        "name": "Instinctive Pounce",
        "description": "As part of the Bonus Action you take to enter your Rage, you can move up to half your Speed."
      },
      {
        "level": 9,
        "name": "Brutal Strike",
        "description": "If you use Reckless Attack, you can forgo any Advantage on one Strength-based attack roll of your choice on your turn. The chosen attack roll mustn't have Disadvantage. If the chosen attack roll hits, the target takes an extra 1d10 damage of the same type dealt by the weapon or Unarmed Strike, and you can cause one Brutal Strike effect of your choice. You have the following effect options. Forceful Blow. The target is pushed 15 feet straight away from you. You can then move up to half your Speed straight toward the target without provoking Opportunity Attacks. Hamstring Blow. The target's Speed is reduced by 15 feet until the start of your next turn. A target can be affected by only one Hamstring Blow at a time the most recent one."
      },
      {
        "level": 11,
        "name": "Relentless Rage",
        "description": "Your Rage can keep you fighting despite grievous wounds. If you drop to 0 Hit Points while your Rage is active and don't die outright, you can make a DC 10 Constitution saving throw. If you succeed, your Hit Points instead change to a number equal to twice your Barbarian level. Each time you use this feature after the first, the DC increases by 5. When you finish a Short or Long Rest, the DC resets to 10."
      },
      {
        "level": 13,
        "name": "Improved Brutal Strike",
        "description": "You have honed new ways to attack furiously. The following effects are now among your Brutal Strike options. Staggering Blow. The target has Disadvantage on the next saving throw it makes, and it can't make Opportunity Attacks until the start of your next turn. Sundering Blow. Before the start of your next turn, the next attack roll made by another creature against the target gains a +5 bonus to the roll. An attack roll can gain only one Sundering Blow bonus."
      },
      {
        "level": 15,
        "name": "Persistent Rage",
        "description": "When you roll Initiative, you can regain all expended uses of Rage. After you regain uses of Rage in this way, you can't do so again until you finish a Long Rest. In addition, your Rage is so fierce that it now lasts for 10 minutes without you needing to do anything to extend it from round to round. Your Rage ends early if you have the Unconscious condition (not just the Incapacitated condition) or don Heavy armor."
      },
      {
        "level": 17,
        "name": "Improved Brutal Strike",
        "description": "The extra damage of your Brutal Strike increases to 2d10. In addition, you can use two different Brutal Strike effects whenever you use your Brutal Strike feature."
      },
      {
        "level": 18,
        "name": "Indomitable Might",
        "description": "If your total for a Strength check or Strength saving throw is less than your Strength score, you can use that score in place of the total."
      },
      {
        "level": 19,
        "name": "Epic Boon",
        "description": "You gain an Epic Boon feat (see \"Feats\") or another feat of your choice for which you qualify. Boon of Irresistible Offense is recommended."
      },
      {
        "level": 20,
        "name": "Primal Champion",
        "description": "You embody primal power. Your Strength and Constitution scores increase by 4, to a maximum of 25."
      }
    ],
    "subclasses": [
      {
        "id": "path-of-the-berserker",
        "name": "Path of the Berserker",
        "features": [
          {
            "level": 3,
            "name": "Frenzy",
            "description": "If you use Reckless Attack while your Rage is active, you deal extra damage to the first target you hit on your turn with a Strength-based attack. To determine the extra damage, roll a number of d6s equal to your Rage Damage bonus, and add them together. The damage has the same type as the weapon or Unarmed Strike used for the attack."
          },
          {
            "level": 6,
            "name": "Mindless Rage",
            "description": "You have Immunity to the Charmed and Frightened conditions while your Rage is active. If you're Charmed or Frightened when you enter your Rage, the condition ends on you."
          },
          {
            "level": 10,
            "name": "Retaliation",
            "description": "When you take damage from a creature that is within 5 feet of you, you can take a Reaction to make one melee attack against that creature, using a weapon or an Unarmed Strike."
          },
          {
            "level": 14,
            "name": "Intimidating Presence",
            "description": "As a Bonus Action, you can strike terror into others with your menacing presence and primal power. When you do so, each creature of your choice in a 30-foot Emanation originating from you must make a Wisdom saving throw (DC 8 plus your Strength modifier and Proficiency Bonus). On a failed save, a creature has the Frightened condition for 1 minute. At the end of each of the Frightened creature's turns, the creature repeats the save, ending the effect on itself on a success. Once you use this feature, you can't use it again until you finish a Long Rest unless you expend a use of your Rage (no action required) to restore your use of it. --- ## Additional Subclasses"
          }
        ]
      },
      {
        "id": "path-of-the-wild-heart",
        "name": "Path of the Wild Heart",
        "features": [
          {
            "level": 3,
            "name": "Animal Speaker",
            "description": "You can cast the Beast Sense and Speak with Animals spells but only as Rituals. Wisdom is your spellcasting ability for them."
          },
          {
            "level": 3,
            "name": "Rage Of The Wilds",
            "description": "Your Rage taps into the primal power of animals. Whenever you activate your Rage, you gain one of the following options of your choice. Bear. While your Rage is active, you have Resistance to every damage type except Force, Necrotic, Psychic, and Radiant. Eagle. When you activate your Rage, you can take the Disengage and Dash actions as part of that Bonus Action. While your Rage is active, you can take a Bonus Action to take both of those actions. Wolf. While your Rage is active, your allies have Advantage on attack rolls against any enemy of yours within 5 feet of you."
          },
          {
            "level": 6,
            "name": "Aspect Of The Wilds",
            "description": "You gain one of the following options of your choice. Whenever you finish a Long Rest, you can change your choice. Owl. You have Darkvision with a range of 60 feet. If you already have Darkvision, its range increases by 60 feet. Panther. You have a Climb Speed equal to your Speed. Salmon. You have a Swim Speed equal to your Speed."
          },
          {
            "level": 10,
            "name": "Nature Speaker",
            "description": "You can cast the Commune with Nature spell but only as a Ritual. Wisdom is your spellcasting ability for it."
          },
          {
            "level": 14,
            "name": "Power Of The Wilds",
            "description": "Whenever you activate your Rage, you gain one of the following options of your choice. Falcon. While your Rage is active, you have a Fly Speed equal to your Speed if you aren't wearing any armor. Lion. While your Rage is active, any of your enemies within 5 feet of you have Disadvantage on attack rolls against targets other than you or another Barbarian who has this option active. Ram. While your Rage is active, you can cause a Large or smaller creature to have the Prone condition when you hit it with a melee attack."
          }
        ]
      },
      {
        "id": "path-of-the-world-tree",
        "name": "Path of the World Tree",
        "features": [
          {
            "level": 3,
            "name": "Vitality Of The Tree",
            "description": "Your Rage taps into the life force of the World Tree. You gain the following benefits. Vitality Surge. When you activate your Rage, you gain a number of Temporary Hit Points equal to your Barbarian level. Life-Giving Force. At the start of each of your turns while your Rage is active, you can choose another creature within 10 feet of yourself to gain Temporary Hit Points. To determine the number of Temporary Hit Points, roll a number of d6s equal to your Rage Damage bonus, and add them together. If any of these Temporary Hit Points remain when your Rage ends, they vanish."
          },
          {
            "level": 6,
            "name": "Branches Of The Tree",
            "description": "Whenever a creature you can see starts its turn within 30 feet of you while your Rage is active, you can take a Reaction to summon spectral branches of the World Tree around it. The target must succeed on a Strength saving throw (DC 8 plus your Strength modifier and Proficiency Bonus) or be teleported to an unoccupied space you can see within 5 feet of yourself or in the nearest unoccupied space you can see. After the target teleports, you can reduce its Speed to O until the end of the current turn."
          },
          {
            "level": 10,
            "name": "Battering Roots",
            "description": "During your turn, your reach is 10 feet greater with any Melee weapon that has the Heavy or Versatile property, as tendrils of the World Tree extend from you. When you hit with such a weapon on your turn, you can activate the Push or Topple mastery property in addition to a different mastery property you're using with that weapon."
          },
          {
            "level": 14,
            "name": "Travel Along The Tree",
            "description": "When you activate your Rage and as a Bonus Action while your Rage is active, you can teleport up to 60 feet to an unoccupied space you can see. In addition, once per Rage, you can increase the range of that teleport to 150 feet. When you do so, you can also bring up to six willing creatures who are within 10 feet of you. Each cFeature teleports to an unoccupied space of yom:i choice within 10 feet of your destination space."
          }
        ]
      },
      {
        "id": "path-of-the-zealot",
        "name": "Path of the Zealot",
        "features": [
          {
            "level": 3,
            "name": "Divine Fury",
            "description": "You can channel divine power into your strikes. On each of your turns while your Rage is active, the first creature you hit with a weapon or an Unarmed Strike takes extra damage equal to ld6 plus half your Barbarian level (round down). The extra damage is Necrotic or Radiant; you choose the type each time you deal the damage."
          },
          {
            "level": 3,
            "name": "Warrior Of The Gods",
            "description": "A divine entity helps ensure you can continue the fight. You have a pool of four dl2s that you can spend to heal yourself. As a Bonus Action, you can expend dice from the pool, roll them, and regain a number of Hit Points equal to the roll's total. Your pool regains all expended dice when you finish a Long Rest. The pool's maximum number of dice increases by one when you reach Barbarian levels 6 (5 dice), 12 (6 dice), and 17 (7 dice)."
          },
          {
            "level": 6,
            "name": "Fanatical Focus",
            "description": "Once per active Rage, if you fail a saving throw, you can reroll it with a bonus equal to your Rage Damage bonus, and you must use the new roll."
          },
          {
            "level": 10,
            "name": "Zealous Presence",
            "description": "As a Bonus Action, you unleash a battle cry infused with divine energy. Up to ten other creatures of your choice within 60 feet of you gain Advantage on attack rolls and saving throws until the start of your next turn. Once you use this feature, you can't use it again until you finish a Long Rest unless you expend a use of your Rage (no action required} to restore your use of it."
          },
          {
            "level": 14,
            "name": "Rage Of The Gods",
            "description": "When you activate your Rage, you can assume the form of a divine warrior. This form lasts for 1 minute or until you drop to O Hit Points. Once you use this feature, you can't do so again until you finish a Long Rest. While in this form, you gain the benefits below. Flight. You have a Fly Speed equal to your Speed and can hover. Resistance. You have Resistance to Necrotic, Psychic, and Radiant damage. Revivification. When a creature within 30 feet of you would drop to O Hit Points, you can take a Reaction to expend a use of your Rage to instead change the target's Hit Points to a number equal to your Barbarian level."
          }
        ]
      }
    ]
  },
  {
    "id": "bard",
    "name": "Bard",
    "coreTraits": {
      "Primary Ability": "Charisma",
      "Hit Point Die": "D8 per Bard level",
      "Saving Throw Proficiencies": "Dexterity and Charisma",
      "Skill Proficiencies": "Choose any 3 skills (see \"Playing the Game\")",
      "Weapon Proficiencies": "Simple weapons",
      "Tool Proficiencies": "Choose 3 Musical Instruments (see \"Equipment\")",
      "Armor Training": "Light armor",
      "Starting Equipment": "Choose A or B: (A) Leather Armor, 2 Daggers, Musical Instrument of your choice, En tertainer's Pack, and 19 GP; or (B) 90 GP"
    },
    "progression": [
      {
        "level": 1,
        "features": [
          "Bardic Inspiration",
          "Spellcasting"
        ],
        "extras": {
          "Proficiency Bonus": "+2",
          "Bardic Die": "D6",
          "Cantrips": "2",
          "Prepared Spells": "4",
          "1": "2"
        }
      },
      {
        "level": 2,
        "features": [
          "Expertise",
          "Jack of All Trades"
        ],
        "extras": {
          "Proficiency Bonus": "+2",
          "Bardic Die": "D6",
          "Cantrips": "2",
          "Prepared Spells": "5",
          "1": "3"
        }
      },
      {
        "level": 3,
        "features": [
          "Bard Subclass"
        ],
        "extras": {
          "Proficiency Bonus": "+2",
          "Bardic Die": "D6",
          "Cantrips": "2",
          "Prepared Spells": "6",
          "1": "4",
          "2": "2"
        }
      },
      {
        "level": 4,
        "features": [
          "Ability Score Improvement"
        ],
        "extras": {
          "Proficiency Bonus": "+2",
          "Bardic Die": "D6",
          "Cantrips": "3",
          "Prepared Spells": "7",
          "1": "4",
          "2": "3"
        }
      },
      {
        "level": 5,
        "features": [
          "Font of Inspiration"
        ],
        "extras": {
          "Proficiency Bonus": "+3",
          "Bardic Die": "D8",
          "Cantrips": "3",
          "Prepared Spells": "9",
          "1": "4",
          "2": "3",
          "3": "2"
        }
      },
      {
        "level": 6,
        "features": [
          "Subclass feature"
        ],
        "extras": {
          "Proficiency Bonus": "+3",
          "Bardic Die": "D8",
          "Cantrips": "3",
          "Prepared Spells": "10",
          "1": "4",
          "2": "3",
          "3": "3"
        }
      },
      {
        "level": 7,
        "features": [
          "Countercharm"
        ],
        "extras": {
          "Proficiency Bonus": "+3",
          "Bardic Die": "D8",
          "Cantrips": "3",
          "Prepared Spells": "11",
          "1": "4",
          "2": "3",
          "3": "3",
          "4": "1"
        }
      },
      {
        "level": 8,
        "features": [
          "Ability Score Improvement"
        ],
        "extras": {
          "Proficiency Bonus": "+3",
          "Bardic Die": "D8",
          "Cantrips": "3",
          "Prepared Spells": "12",
          "1": "4",
          "2": "3",
          "3": "3",
          "4": "2"
        }
      },
      {
        "level": 9,
        "features": [
          "Expertise"
        ],
        "extras": {
          "Proficiency Bonus": "+4",
          "Bardic Die": "D8",
          "Cantrips": "3",
          "Prepared Spells": "14",
          "1": "4",
          "2": "3",
          "3": "3",
          "4": "3",
          "5": "1"
        }
      },
      {
        "level": 10,
        "features": [
          "Magical Secrets"
        ],
        "extras": {
          "Proficiency Bonus": "+4",
          "Bardic Die": "D10",
          "Cantrips": "4",
          "Prepared Spells": "15",
          "1": "4",
          "2": "3",
          "3": "3",
          "4": "3",
          "5": "2"
        }
      },
      {
        "level": 11,
        "features": [],
        "extras": {
          "Proficiency Bonus": "+4",
          "Bardic Die": "D10",
          "Cantrips": "4",
          "Prepared Spells": "16",
          "1": "4",
          "2": "3",
          "3": "3",
          "4": "3",
          "5": "2",
          "6": "1"
        }
      },
      {
        "level": 12,
        "features": [
          "Ability Score Improvement"
        ],
        "extras": {
          "Proficiency Bonus": "+4",
          "Bardic Die": "D10",
          "Cantrips": "4",
          "Prepared Spells": "16",
          "1": "4",
          "2": "3",
          "3": "3",
          "4": "3",
          "5": "2",
          "6": "1"
        }
      },
      {
        "level": 13,
        "features": [],
        "extras": {
          "Proficiency Bonus": "+5",
          "Bardic Die": "D10",
          "Cantrips": "4",
          "Prepared Spells": "17",
          "1": "4",
          "2": "3",
          "3": "3",
          "4": "3",
          "5": "2",
          "6": "1",
          "7": "1"
        }
      },
      {
        "level": 14,
        "features": [
          "Subclass feature"
        ],
        "extras": {
          "Proficiency Bonus": "+5",
          "Bardic Die": "D10",
          "Cantrips": "4",
          "Prepared Spells": "17",
          "1": "4",
          "2": "3",
          "3": "3",
          "4": "3",
          "5": "2",
          "6": "1",
          "7": "1"
        }
      },
      {
        "level": 15,
        "features": [],
        "extras": {
          "Proficiency Bonus": "+5",
          "Bardic Die": "D12",
          "Cantrips": "4",
          "Prepared Spells": "18",
          "1": "4",
          "2": "3",
          "3": "3",
          "4": "3",
          "5": "2",
          "6": "1",
          "7": "1",
          "8": "1"
        }
      },
      {
        "level": 16,
        "features": [
          "Ability Score Improvement"
        ],
        "extras": {
          "Proficiency Bonus": "+5",
          "Bardic Die": "D12",
          "Cantrips": "4",
          "Prepared Spells": "18",
          "1": "4",
          "2": "3",
          "3": "3",
          "4": "3",
          "5": "2",
          "6": "1",
          "7": "1",
          "8": "1"
        }
      },
      {
        "level": 17,
        "features": [],
        "extras": {
          "Proficiency Bonus": "+6",
          "Bardic Die": "D12",
          "Cantrips": "4",
          "Prepared Spells": "19",
          "1": "4",
          "2": "3",
          "3": "3",
          "4": "3",
          "5": "2",
          "6": "1",
          "7": "1",
          "8": "1",
          "9": "1"
        }
      },
      {
        "level": 18,
        "features": [
          "Superior Inspiration"
        ],
        "extras": {
          "Proficiency Bonus": "+6",
          "Bardic Die": "D12",
          "Cantrips": "4",
          "Prepared Spells": "20",
          "1": "4",
          "2": "3",
          "3": "3",
          "4": "3",
          "5": "3",
          "6": "1",
          "7": "1",
          "8": "1",
          "9": "1"
        }
      },
      {
        "level": 19,
        "features": [
          "Epic Boon"
        ],
        "extras": {
          "Proficiency Bonus": "+6",
          "Bardic Die": "D12",
          "Cantrips": "4",
          "Prepared Spells": "21",
          "1": "4",
          "2": "3",
          "3": "3",
          "4": "3",
          "5": "3",
          "6": "2",
          "7": "1",
          "8": "1",
          "9": "1"
        }
      },
      {
        "level": 20,
        "features": [
          "Words of Creation"
        ],
        "extras": {
          "Proficiency Bonus": "+6",
          "Bardic Die": "D12",
          "Cantrips": "4",
          "Prepared Spells": "22",
          "1": "4",
          "2": "3",
          "3": "3",
          "4": "3",
          "5": "3",
          "6": "2",
          "7": "2",
          "8": "1",
          "9": "1"
        }
      }
    ],
    "features": [
      {
        "level": 1,
        "name": "Bardic Inspiration",
        "description": "You can supernaturally inspire others through words, music, or dance. This inspiration is represented by your Bardic Inspiration die, which is a d6. Using Bardic Inspiration. As a Bonus Action, you can inspire another creature within 60 feet of yourself who can see or hear you. That creature gains one of your Bardic Inspiration dice. A creature can have only one Bardic Inspiration die at a time. Once within the next hour when the creature fails a D20 Test, the creature can roll the Bardic Inspiration die and add the number rolled to the d20, potentially turning the failure into a success. A Bardic Inspiration die is expended when it's rolled. Number of Uses. You can confer a Bardic Inspiration die a number of times equal to your Charisma modifier (minimum of once), and you regain all expended uses when you finish a Long Rest. At Higher Levels. Your Bardic Inspiration die changes when you reach certain Bard levels, as shown in the Bardic Die column of the Bard Features table. The die becomes a d8 at level 5, a d10 at level 10, and a d12 at level 15."
      },
      {
        "level": 1,
        "name": "Spellcasting",
        "description": "You have learned to cast spells through your bardic arts. See \"Spells\" for the rules on spellcasting. The information below details how you use those rules with Bard spells, which appear in the Bard spell list later in the class's description. Cantrips. You know two cantrips of your choice from the Bard spell list. *Dancing Lights* and *Vicious Mockery* are recommended. Whenever you gain a Bard level, you can replace one of your cantrips with another cantrip of your choice from the Bard spell list. When you reach Bard levels 4 and 10, you learn another cantrip of your choice from the Bard spell list, as shown in the Cantrips column of the Bard Features table. Spell Slots. The Bard Features table shows how many spell slots you have to cast your level 1+ spells. You regain all expended slots when you finish a Long Rest. Prepared Spells of Level 1+. You prepare the list of level 1+ spells that are available for you to cast with this feature. To start, choose four level 1 spells from the Bard spell list. *Charm Person*, *Color Spray*, *Dissonant Whispers*, and *Healing Word* are recommended. The number of spells on your list increases as you gain Bard levels, as shown in the Prepared Spells column of the Bard Features table. Whenever that number increases, choose additional spells from the Bard spell list until the number of spells on your list matches the number on the table. The chosen spells must be of a level for which you have spell slots. For example, if you're a level 3 Bard, your list of prepared spells can include six spells of levels 1 and 2 in any combination. If another Bard feature gives you spells that you always have prepared, those spells don't count against the number of spells you can prepare with this feature, but those spells otherwise count as Bard…"
      },
      {
        "level": 2,
        "name": "Expertise",
        "description": "You gain Expertise (see \"Rules Glossary\") in two of your skill proficiencies of your choice. Performance and Persuasion are recommended if you have proficiency in them. At Bard level 9, you gain Expertise in two more of your skill proficiencies of your choice."
      },
      {
        "level": 2,
        "name": "Jack of All Trades",
        "description": "You can add half your Proficiency Bonus (round down) to any ability check you make that uses a skill proficiency you lack and that doesn't otherwise use your Proficiency Bonus. For example, if you make a Strength (Athletics) check and lack Athletics proficiency, you can add half your Proficiency Bonus to the check."
      },
      {
        "level": 3,
        "name": "Bard Subclass",
        "description": "You gain a Bard subclass of your choice. The College of Lore subclass is detailed after this class's description. A subclass is a specialization that grants you features at certain Bard levels. For the rest of your career, you gain each of your subclass's features that are of your Bard level or lower."
      },
      {
        "level": 4,
        "name": "Ability Score Improvement",
        "description": "You gain the Ability Score Improvement feat (see \"Feats\") or another feat of your choice for which you qualify. You gain this feature again at Bard levels 8, 12, and 16."
      },
      {
        "level": 5,
        "name": "Font of Inspiration",
        "description": "You now regain all your expended uses of Bardic Inspiration when you finish a Short or Long Rest. In addition, you can expend a spell slot (no action required) to regain one expended use of Bardic Inspiration."
      },
      {
        "level": 7,
        "name": "Countercharm",
        "description": "You can use musical notes or words of power to disrupt mind-influencing effects. If you or a creature within 30 feet of you fails a saving throw against an effect that applies the Charmed or Frightened condition, you can take a Reaction to cause the save to be rerolled, and the new roll has Advantage."
      },
      {
        "level": 10,
        "name": "Magical Secrets",
        "description": "You've learned secrets from various magical traditions. Whenever you reach a Bard level (including this level) and the Prepared Spells number in the Bard Features table increases, you can choose any of your new prepared spells from the Bard, Cleric, Druid, and Wizard spell lists, and the chosen spells count as Bard spells for you (see a class's section for its spell list). In addition, whenever you replace a spell prepared for this class, you can replace it with a spell from those lists."
      },
      {
        "level": 18,
        "name": "Superior Inspiration",
        "description": "When you roll Initiative, you regain expended uses of Bardic Inspiration until you have two if you have fewer than that."
      },
      {
        "level": 19,
        "name": "Epic Boon",
        "description": "You gain an Epic Boon feat (see \"Feats\") or another feat of your choice for which you qualify. Boon of Spell Recall is recommended."
      },
      {
        "level": 20,
        "name": "Words of Creation",
        "description": "You have mastered two of the Words of Creation: the words of life and death. You therefore always have the *Power Word Heal* and *Power Word Kill* spells prepared. When you cast either spell, you can target a second creature with it if that creature is within 10 feet of the first target."
      }
    ],
    "subclasses": [
      {
        "id": "college-of-lore",
        "name": "College of Lore",
        "features": [
          {
            "level": 3,
            "name": "Bonus Proficiencies",
            "description": "You gain proficiency with three skills of your choice."
          },
          {
            "level": 3,
            "name": "Cutting Words",
            "description": "You learn to use your wit to supernaturally distract, confuse, and otherwise sap the confidence and competence of others. When a creature that you can see within 60 feet of yourself makes a damage roll or succeeds on an ability check or attack roll, you can take a Reaction to expend one use of your Bardic Inspiration; roll your Bardic Inspiration die, and subtract the number rolled from the creature's roll, reducing the damage or potentially turning the success into a failure."
          },
          {
            "level": 6,
            "name": "Magical Discoveries",
            "description": "You learn two spells of your choice. These spells can come from the Cleric, Druid, or Wizard spell list or any combination thereof (see a class's section for its spell list). A spell you choose must be a cantrip or a spell for which you have spell slots, as shown in the Bard Features table. You always have the chosen spells prepared, and whenever you gain a Bard level, you can replace one of the spells with another spell that meets these requirements."
          },
          {
            "level": 14,
            "name": "Peerless Skill",
            "description": "When you make an ability check or attack roll and fail, you can expend one use of Bardic Inspiration; roll the Bardic Inspiration die, and add the number rolled to the d20, potentially turning a failure into a success. On a failure, the Bardic Inspiration isn't expended. --- ## Additional Subclasses"
          }
        ]
      },
      {
        "id": "college-of-dance",
        "name": "College of Dance",
        "features": [
          {
            "level": 3,
            "name": "Dazzling Footwork",
            "description": "While you aren't wearing armor or wielding a Shield, you gain the following benefits. Dance Virtuoso. You have Advantage on any Charisma (Performance) check you make that involves you dancing. Unarmored Defense. Your base Armor Class equals 10 plus your Dexterity and Charisma modifiers. Agile Strikes. When you expend a use of your Bardic Inspiration as part of an action, a Bonus Action, or a Reaction, you can make one Unarmed Strike as part of that action, Bonus Action, or Reaction. Bardic Damage. You can use Dexterity instead of Strength for the attack rolls of your Unarmed Strikes. When you deal damage with an Unarmed Strike, you can deal Bludgeoning damage equal to a roll of your Bardic Inspiration die plus your Dexterity modifier, instead of the strike's normal damage. This roll doesn't expend the die."
          },
          {
            "level": 6,
            "name": "Inspiring Movement",
            "description": "When an enemy you can see ends its turn within 5 feet of you, you can take a Reaction and expend one use of your Bardic Inspiration to move up to half your Speed. Then one ally of your choice within 30 feet of you can also move up to half their Speed using their Reaction. None of this feature's movement provokes Opportunity Attacks."
          },
          {
            "level": 6,
            "name": "Tandem Footwork",
            "description": "When you roll Initiative, you can expend one use of your Bardic Inspiration if you don't have the Incapacitated condition. When you do so, roll your Bardic Inspiration die; you and each ally within 30 feet of you who can see or hear you gains a bonus to Initiative equal to the number rolled."
          },
          {
            "level": 14,
            "name": "Leading Evasion",
            "description": "When you are subjected to an effect that allows you to make a Dexterity saving throw to take only half damage, you instead take no damage if you succeed on the saving throw and only half damage if you fail. If any creatures within 5 feet of you are making the same Dexterity saving throw, you can share this benefit with them for that save. You can't use this feature if you have the Incapacitated condition."
          }
        ]
      },
      {
        "id": "college-of-glamour",
        "name": "College of Glamour",
        "features": [
          {
            "level": 3,
            "name": "Beguiling Magic",
            "description": "You always have the Charm Person and Mirror Image spells prepared. In addition, immediately after you cast an Enchantment or Illusion spell using a spell slot, you can cause a creature you can see within 60 feet of yourself to make a Wisdom saving throw against your spell save DC. On a failed save, the target has the Charmed or Frightened condition (your choice) for 1 minute. The target repeats the save at the end of each of its turns, ending the effect on itself on a success. Once you use this benefit, you can't use it again until you finish a Long Rest. You can also restore your use of it by expending one use of your Bardic Inspiration (no action required)."
          },
          {
            "level": 3,
            "name": "Mantle Of Inspiration",
            "description": "You can weave fey magic into a song or dance to fill others with vigor. As a Bonus Action, you can expend a use of Bardic Inspiration, rolling a Bardic Inspiration die. When you do so, choose a number of other creatures within 60 feet of yourself, up to a number equal to your Charisma modifier (minimum of one creature). Each of those creatures gains a number of Temporary Hit Points equal to two times the number rolled on the Bardic Inspiration die, and then each can use its Reaction to move up to its Speed without provoking Opportunity Attacks."
          },
          {
            "level": 6,
            "name": "Mantle Of Majesty",
            "description": "You always have the Command spell prepared. As a Bonus Action, you cast Command without expending a spell slot, and you take on an unearthly appearance for 1 minute or until your Concentration ends. Durring this time, you can Cast Command as a Bonus Action without expending a Spell slot. Any Creature Cahrmed By you Automaticly Fails its saving throw against the Command you cast with this feature . Once you use this feature, you can't use it aga in until you finish a Long Rest. You can a lso restore your use of it by expending a level 3+ s pell slot (no action required)."
          },
          {
            "level": 14,
            "name": "Unbreakable Majesty",
            "description": "As a Bonus Action, you can assume a magically majestic presence for 1 minute or until you have the Incapacitated condition. For the dura tion, whenever any creature hits you with an attack roll for the first time on a turn, the attacker must succeed on a Charisma saving throw against your spell save DC, or the attack misses instead, as the creature recoils from your majesty. Once you assume this majestic presence, you can't do so again until you finish a Short or Long Rest."
          }
        ]
      },
      {
        "id": "college-of-valor",
        "name": "College of Valor",
        "features": [
          {
            "level": 3,
            "name": "Combat Inspiration",
            "description": "You can use your wit to turn the tide of battle. A creature that has a Bardic Inspiration die from you can use it for one of the following effects. Defense. When the creature is hit by an attack roll, that creature can use its Reaction to roll the Bardic Inspiration die and add the number rolled to its AC against that attack, potentially causing the attack to miss. Offense. Immediately after the creature hits a target with an attack roll, the creature can roll the Bardic Inspiration die and add the number rolled to the attack's damage against the target."
          },
          {
            "level": 3,
            "name": "Martial 'Training",
            "description": "You gain proficiency with Martial weapons and training with Medium armor and Shields. In addition, you can use a Simple or Martial weapon as a Spellcasting Focus to cast spells from your Bard spell list."
          },
          {
            "level": 6,
            "name": "Extra Attack",
            "description": "You can attack twice instead of once whenever you take the Attack action on your turn. In addition, you can cast one of your can trips that has a casting time of an action in place of one of those attacks."
          },
          {
            "level": 14,
            "name": "Battle Magic",
            "description": "After you cast a spell that has a casting time of an action, you can make one attack with a weapon as a Bonus Action."
          }
        ]
      }
    ]
  },
  {
    "id": "cleric",
    "name": "Cleric",
    "coreTraits": {
      "Primary Ability": "Wisdom",
      "Hit Point Die": "D8 per Cleric level",
      "Saving Throw Proficiencies": "Wisdom and Charisma",
      "Skill Proficiencies": "Choose 2: History, Insight, Medicine, Persuasion, or Religion",
      "Weapon Proficiencies": "Simple weapons",
      "Armor Training": "Light and Medium armor and Shields",
      "Starting Equipment": "Choose A or B: (A) Chain Shirt, Shield, Mace, Holy Symbol, Priest's Pack, and 7 GP; or (B) 110 GP"
    },
    "progression": [
      {
        "level": 1,
        "features": [
          "Spellcasting",
          "Divine Order"
        ],
        "extras": {
          "Proficiency Bonus": "+2",
          "Cantrips": "3",
          "Prepared Spells": "4",
          "1": "2"
        }
      },
      {
        "level": 2,
        "features": [
          "Channel Divinity"
        ],
        "extras": {
          "Proficiency Bonus": "+2",
          "Channel Divinity": "2",
          "Cantrips": "3",
          "Prepared Spells": "5",
          "1": "3"
        }
      },
      {
        "level": 3,
        "features": [
          "Cleric Subclass"
        ],
        "extras": {
          "Proficiency Bonus": "+2",
          "Channel Divinity": "2",
          "Cantrips": "3",
          "Prepared Spells": "6",
          "1": "4",
          "2": "2"
        }
      },
      {
        "level": 4,
        "features": [
          "Ability Score Improvement"
        ],
        "extras": {
          "Proficiency Bonus": "+2",
          "Channel Divinity": "2",
          "Cantrips": "4",
          "Prepared Spells": "7",
          "1": "4",
          "2": "3"
        }
      },
      {
        "level": 5,
        "features": [
          "Sear Undead"
        ],
        "extras": {
          "Proficiency Bonus": "+3",
          "Channel Divinity": "2",
          "Cantrips": "4",
          "Prepared Spells": "9",
          "1": "4",
          "2": "3",
          "3": "2"
        }
      },
      {
        "level": 6,
        "features": [
          "Subclass feature"
        ],
        "extras": {
          "Proficiency Bonus": "+3",
          "Channel Divinity": "3",
          "Cantrips": "4",
          "Prepared Spells": "10",
          "1": "4",
          "2": "3",
          "3": "3"
        }
      },
      {
        "level": 7,
        "features": [
          "Blessed Strikes"
        ],
        "extras": {
          "Proficiency Bonus": "+3",
          "Channel Divinity": "3",
          "Cantrips": "4",
          "Prepared Spells": "11",
          "1": "4",
          "2": "3",
          "3": "3",
          "4": "1"
        }
      },
      {
        "level": 8,
        "features": [
          "Ability Score Improvement"
        ],
        "extras": {
          "Proficiency Bonus": "+3",
          "Channel Divinity": "3",
          "Cantrips": "4",
          "Prepared Spells": "12",
          "1": "4",
          "2": "3",
          "3": "3",
          "4": "2"
        }
      },
      {
        "level": 9,
        "features": [],
        "extras": {
          "Proficiency Bonus": "+4",
          "Channel Divinity": "3",
          "Cantrips": "4",
          "Prepared Spells": "14",
          "1": "4",
          "2": "3",
          "3": "3",
          "4": "3",
          "5": "1"
        }
      },
      {
        "level": 10,
        "features": [
          "Divine Intervention"
        ],
        "extras": {
          "Proficiency Bonus": "+4",
          "Channel Divinity": "3",
          "Cantrips": "5",
          "Prepared Spells": "15",
          "1": "4",
          "2": "3",
          "3": "3",
          "4": "3",
          "5": "2"
        }
      },
      {
        "level": 11,
        "features": [],
        "extras": {
          "Proficiency Bonus": "+4",
          "Channel Divinity": "3",
          "Cantrips": "5",
          "Prepared Spells": "16",
          "1": "4",
          "2": "3",
          "3": "3",
          "4": "3",
          "5": "2",
          "6": "1"
        }
      },
      {
        "level": 12,
        "features": [
          "Ability Score Improvement"
        ],
        "extras": {
          "Proficiency Bonus": "+4",
          "Channel Divinity": "3",
          "Cantrips": "5",
          "Prepared Spells": "16",
          "1": "4",
          "2": "3",
          "3": "3",
          "4": "3",
          "5": "2",
          "6": "1"
        }
      },
      {
        "level": 13,
        "features": [],
        "extras": {
          "Proficiency Bonus": "+5",
          "Channel Divinity": "3",
          "Cantrips": "5",
          "Prepared Spells": "17",
          "1": "4",
          "2": "3",
          "3": "3",
          "4": "3",
          "5": "2",
          "6": "1",
          "7": "1"
        }
      },
      {
        "level": 14,
        "features": [
          "Improved Blessed Strikes"
        ],
        "extras": {
          "Proficiency Bonus": "+5",
          "Channel Divinity": "3",
          "Cantrips": "5",
          "Prepared Spells": "17",
          "1": "4",
          "2": "3",
          "3": "3",
          "4": "3",
          "5": "2",
          "6": "1",
          "7": "1"
        }
      },
      {
        "level": 15,
        "features": [],
        "extras": {
          "Proficiency Bonus": "+5",
          "Channel Divinity": "3",
          "Cantrips": "5",
          "Prepared Spells": "18",
          "1": "4",
          "2": "3",
          "3": "3",
          "4": "3",
          "5": "2",
          "6": "1",
          "7": "1",
          "8": "1"
        }
      },
      {
        "level": 16,
        "features": [
          "Ability Score Improvement"
        ],
        "extras": {
          "Proficiency Bonus": "+5",
          "Channel Divinity": "3",
          "Cantrips": "5",
          "Prepared Spells": "18",
          "1": "4",
          "2": "3",
          "3": "3",
          "4": "3",
          "5": "2",
          "6": "1",
          "7": "1",
          "8": "1"
        }
      },
      {
        "level": 17,
        "features": [
          "Subclass feature"
        ],
        "extras": {
          "Proficiency Bonus": "+6",
          "Channel Divinity": "3",
          "Cantrips": "5",
          "Prepared Spells": "19",
          "1": "4",
          "2": "3",
          "3": "3",
          "4": "3",
          "5": "2",
          "6": "1",
          "7": "1",
          "8": "1",
          "9": "1"
        }
      },
      {
        "level": 18,
        "features": [],
        "extras": {
          "Proficiency Bonus": "+6",
          "Channel Divinity": "4",
          "Cantrips": "5",
          "Prepared Spells": "20",
          "1": "4",
          "2": "3",
          "3": "3",
          "4": "3",
          "5": "3",
          "6": "1",
          "7": "1",
          "8": "1",
          "9": "1"
        }
      },
      {
        "level": 19,
        "features": [
          "Epic Boon"
        ],
        "extras": {
          "Proficiency Bonus": "+6",
          "Channel Divinity": "4",
          "Cantrips": "5",
          "Prepared Spells": "21",
          "1": "4",
          "2": "3",
          "3": "3",
          "4": "3",
          "5": "3",
          "6": "2",
          "7": "1",
          "8": "1",
          "9": "1"
        }
      },
      {
        "level": 20,
        "features": [
          "Greater Divine Intervention"
        ],
        "extras": {
          "Proficiency Bonus": "+6",
          "Channel Divinity": "4",
          "Cantrips": "5",
          "Prepared Spells": "22",
          "1": "4",
          "2": "3",
          "3": "3",
          "4": "3",
          "5": "3",
          "6": "2",
          "7": "2",
          "8": "1",
          "9": "1"
        }
      }
    ],
    "features": [
      {
        "level": 1,
        "name": "Spellcasting",
        "description": "You have learned to cast spells through prayer and meditation. See \"Spells\" for the rules on spellcasting. The information below details how you use those rules with Cleric spells, which appear on the Cleric spell list later in the class's description. Cantrips. You know three cantrips of your choice from the Cleric spell list. *Guidance*, *Sacred Flame*, and *Thaumaturgy* are recommended. Whenever you gain a Cleric level, you can replace one of your cantrips with another cantrip of your choice from the Cleric spell list. When you reach Cleric levels 4 and 10, you learn another cantrip of your choice from the Cleric spell list, as shown in the Cantrips column of the Cleric Features table. Spell Slots. The Cleric Features table shows how many spell slots you have to cast your level 1+ spells. You regain all expended slots when you finish a Long Rest. Prepared Spells of Level 1+. You prepare the list of level 1+ spells that are available for you to cast with this feature. To start, choose four level 1 spells from the Cleric spell list. *Bless*, *Cure Wounds*, *Guiding Bolt*, and *Shield of Faith* are recommended. The number of spells on your list increases as you gain Cleric levels, as shown in the Prepared Spells column of the Cleric Features table. Whenever that number increases, choose additional spells from the Cleric spell list until the number of spells on your list matches the number on the table. The chosen spells must be of a level for which you have spell slots. For example, if you're a level 3 Cleric, your list of prepared spells can include six spells of levels 1 and 2 in any combination. If another Cleric feature gives you spells that you always have prepared, those spells don't count against the number of spells you can prepare with this feature, but those…"
      },
      {
        "level": 1,
        "name": "Divine Order",
        "description": "You have dedicated yourself to one of the following sacred roles of your choice. Protector. Trained for battle, you gain proficiency with Martial weapons and training with Heavy armor. Thaumaturge. You know one extra cantrip from the Cleric spell list. In addition, your mystical connection to the divine gives you a bonus to your Intelligence (Arcana or Religion) checks. The bonus equals your Wisdom modifier (minimum of +1)."
      },
      {
        "level": 2,
        "name": "Channel Divinity",
        "description": "You can channel divine energy directly from the Outer Planes to fuel magical effects. You start with two such effects: Divine Spark and Turn Undead, each of which is described below. Each time you use this class's Channel Divinity, choose which Channel Divinity effect from this class to create. You gain additional effect options at higher Cleric levels. You can use this class's Channel Divinity twice. You regain one of its expended uses when you finish a Short Rest, and you regain all expended uses when you finish a Long Rest. You gain additional uses when you reach certain Cleric levels, as shown in the Channel Divinity column of the Cleric Features table. If a Channel Divinity effect requires a saving throw, the DC equals the spell save DC from this class's Spellcasting feature. Divine Spark. As a Magic action, you point your Holy Symbol at another creature you can see within 30 feet of yourself and focus divine energy at it. Roll 1d8 and add your Wisdom modifier. You either restore Hit Points to the creature equal to that total or force the creature to make a Constitution saving throw. On a failed save, the creature takes Necrotic or Radiant damage (your choice) equal to that total. On a successful save, the creature takes half as much damage (round down). You roll an additional d8 when you reach Cleric levels 7 (2d8), 13 (3d8), and 18 (4d8). Turn Undead. As a Magic action, you present your Holy Symbol and censure Undead creatures. Each Undead of your choice within 30 feet of you must make a Wisdom saving throw. If the creature fails its save, it has the Frightened and Incapacitated conditions for 1 minute. For that duration, it tries to move as far from you as it can on its turns. This effect ends early on the creature if it takes any damage, if you have the…"
      },
      {
        "level": 3,
        "name": "Cleric Subclass",
        "description": "You gain a Cleric subclass of your choice. The Life Domain subclass is detailed after this class's description. A subclass is a specialization that grants you features at certain Cleric levels. For the rest of your career, you gain each of your subclass's features that are of your Cleric level or lower."
      },
      {
        "level": 4,
        "name": "Ability Score Improvement",
        "description": "You gain the Ability Score Improvement feat (see \"Feats\") or another feat of your choice for which you qualify. You gain this feature again at Cleric levels 8, 12, and 16."
      },
      {
        "level": 5,
        "name": "Sear Undead",
        "description": "Whenever you use Turn Undead, you can roll a number of d8s equal to your Wisdom modifier (minimum of 1d8) and add the rolls together. Each Undead that fails its saving throw against that use of Turn Undead takes Radiant damage equal to the roll's total. This damage doesn't end the turn effect."
      },
      {
        "level": 7,
        "name": "Blessed Strikes",
        "description": "Divine power infuses you in battle. You gain one of the following options of your choice (if you get either option from a Cleric subclass in an older book, use only the option you choose for this feature). Divine Strike. Once on each of your turns when you hit a creature with an attack roll using a weapon, you can cause the target to take an extra 1d8 Necrotic or Radiant damage (your choice). Potent Spellcasting. Add your Wisdom modifier to the damage you deal with any Cleric cantrip."
      },
      {
        "level": 10,
        "name": "Divine Intervention",
        "description": "You can call on your deity or pantheon to intervene on your behalf. As a Magic action, choose any Cleric spell of level 5 or lower that doesn't require a Reaction to cast. As part of the same action, you cast that spell without expending a spell slot or needing Material components. You can't use this feature again until you finish a Long Rest."
      },
      {
        "level": 14,
        "name": "Improved Blessed Strikes",
        "description": "The option you chose for Blessed Strikes grows more powerful. Divine Strike. The extra damage of your Divine Strike increases to 2d8. Potent Spellcasting. When you cast a Cleric cantrip and deal damage to a creature with it, you can give vitality to yourself or another creature within 60 feet of yourself, granting a number of Temporary Hit Points equal to twice your Wisdom modifier."
      },
      {
        "level": 19,
        "name": "Epic Boon",
        "description": "You gain an Epic Boon feat (see \"Feats\") or another feat of your choice for which you qualify. Boon of Fate is recommended."
      },
      {
        "level": 20,
        "name": "Greater Divine Intervention",
        "description": "You can call on even more powerful divine intervention. When you use your Divine Intervention feature, you can choose *Wish* when you select a spell. If you do so, you can't use Divine Intervention again until you finish 2d4 Long Rests."
      }
    ],
    "subclasses": [
      {
        "id": "life-domain",
        "name": "Life Domain",
        "features": [
          {
            "level": 3,
            "name": "Disciple of Life",
            "description": "When a spell you cast with a spell slot restores Hit Points to a creature, that creature regains additional Hit Points on the turn you cast the spell. The additional Hit Points equal 2 plus the spell slot's level."
          },
          {
            "level": 3,
            "name": "Life Domain Spells",
            "description": "Your connection to this divine domain ensures you always have certain spells ready. When you reach a Cleric level specified in the Life Domain Spells table, you thereafter always have the listed spells prepared. Table: Life Domain Spells | Cleric Level | Prepared Spells | |-----------------|------------------------------------------------| | 3 | Aid, Bless, Cure Wounds, Lesser Restoration | | 5 | Mass Healing Word, Revivify | | 7 | Aura of Life, Death Ward | | 9 | Greater Restoration, Mass Cure Wounds |"
          },
          {
            "level": 3,
            "name": "Preserve Life",
            "description": "As a Magic action, you present your Holy Symbol and expend a use of your Channel Divinity to evoke healing energy that can restore a number of Hit Points equal to five times your Cleric level. Choose Bloodied creatures within 30 feet of yourself (which can include you), and divide those Hit Points among them. This feature can restore a creature to no more than half its Hit Point maximum."
          },
          {
            "level": 6,
            "name": "Blessed Healer",
            "description": "The healing spells you cast on others heal you as well. Immediately after you cast a spell with a spell slot that restores Hit Points to one or more creatures other than yourself, you regain Hit Points equal to 2 plus the spell slot's level."
          },
          {
            "level": 17,
            "name": "Supreme Healing",
            "description": "When you would normally roll one or more dice to restore Hit Points to a creature with a spell or Channel Divinity, don't roll those dice for the healing; instead use the highest number possible for each die. For example, instead of restoring 2d6 Hit Points to a creature with a spell, you restore 12. --- ## Additional Subclasses"
          }
        ]
      },
      {
        "id": "light-domain",
        "name": "Light Domain",
        "features": [
          {
            "level": 3,
            "name": "Light Domain Spells",
            "description": "Your connection to this divine domain ensures you always have certain spells ready. When you reach Table: a Cleric level specified in the Light Domain Spells table, you thereafter always have the listed spells prepared. Table: Light Domain Spells Table: Cleric Level Prepared Spells 3 Burning Hands, Faerie Fire , Scorching Ray, See Invisibility 5 Daylight, Fireball 7 Arcane Eye, Wall of Fire 9 Flame Strike, Scrying"
          },
          {
            "level": 3,
            "name": "Radiance Of The Dawn",
            "description": "As a Magic action, you present your Holy Symbol and expend a use of your Channel Divinity to emit a flash of light in a 30-foot Emanation originating from yourself. Any magical Darkness-such as that created by the Darkness spell-in that area is dispelled. Additionally, each creature of your choice in that area must make a Constitution saving throw, taking Radiant damage equal to 2d10 plus your Cleric level on a failed save or half as much damage on a successful one."
          },
          {
            "level": 3,
            "name": "Warding Flare",
            "description": "When a creature that you can see within 30 feet of yourself makes an attack roll, you can take a Reaction to impose Disadvantage on the attack roll, causing light toflare before it hits or misses. You can use this feature a number of times equal to your Wisdom modifier (minimum of once). You regain all expended uses when you finish a Long Rest."
          },
          {
            "level": 6,
            "name": "Improved Warding Flare",
            "description": "You Regain all expended uses of your Warding Flare when you finish a Short or Long Rest. In addition, whenever you use Warding Flare, you can give the target of the triggering attack a number of Temporary Hit Points equal to 2d6 plus your Wisdom modifier."
          },
          {
            "level": 17,
            "name": "Corona Of Light",
            "description": "As a Magic action, you cause yourself to emit an aura of sunlight that lasts for 1 minute or until you dismiss it (no action required). You emit Bright Light in a 60-foot radius and Dim Light for an additional 30 feet. Your enemies in the Bright Light have Disadvantage on saving throws against your Radiance of the Dawn and any spell that deals Fire or Radiant damage. You can use this feature a number of times equal to your Wisdom modifier (minimum of once), and you regain all expended uses when you finish a Long Rest."
          }
        ]
      },
      {
        "id": "trickery-domain",
        "name": "Trickery Domain",
        "features": [
          {
            "level": 3,
            "name": "Blessing Of The Trickster",
            "description": "As a Magic action, you can choose yourself or a willing creature within 30 feet of yourself to have Advantage on Dexterity {Stealth) checks. This blessing lasts until you finish a Long Rest or you use this feature again."
          },
          {
            "level": 3,
            "name": "Invoke Duplicity",
            "description": "As a Bonus Action, you can expend one use of your Channel Divinity to create a perfect visual illusion of yourself in an unoccupied space you can see within 30 feet of yourself. The illusion is intangible and doesn't occupy its space. It lasts for 1 minute, but it ends early if you dismiss it (no action required} or have the Incapacitated condition. The illusion is animated and mimics your expressions and gestures. While it persists, you ga in the following benefits. Cast Spells. You can cast spells as though you were in the illusion's space, but you must use your own senses. Distract. When both you and yo ur illusion are within 5 feet of a creature that can see the illusion you have Advantage on attack rolls aga inst that ' creature, given how distracting the illusion is to the target. Move. As a Bonus Action, you can move the illusion up to 30 feet to an unoccupied space you can see that is within 120 feet of yourself."
          },
          {
            "level": 3,
            "name": "Trickery Domain Spe Ll S",
            "description": "Your connection to this divine domain ensures you always have certain spells ready. When you reach a Table: Cleric level specified in the Trickery Domain Spells table, you thereafter always have the listed spells prepared Table: Trickery Domain Spells Table: Cleric Level Prepared Spells 3 Charm Person, Disguise Self, Invisibility, Pass without Trace 5 Hypnotic Pattern , Nondetection 7 Confusion, Dimension Door 9 Dominate Person, Modify Memory"
          },
          {
            "level": 6,
            "name": "Trickster'S Transposition",
            "description": "Whenever you take the Bonus Action to create or move the illusion of your Invoke Duplicity, you can teleport, swapping places with the illusion."
          },
          {
            "level": 17,
            "name": "Improved Duplicity",
            "description": "The illusion of your Invoke Duplicity has grown more powerful in the following ways. Shared Distraction. When you and your allies make attack rolls against a creature within 5 feet of the illusion, the attack rolls have Advantage. Healing Illusion. When the illusion ends, you or a creature of your choice within 5 feet of it regains a number of Hit Points equal to your Cleric level."
          }
        ]
      },
      {
        "id": "war-domain",
        "name": "War Domain",
        "features": [
          {
            "level": 3,
            "name": "Guided Strike",
            "description": "When you or a creature within 30 feet of you misses with an attack roll, you can expend one use of you r Channel Divinity and give that roll a +10 bonus, potentially causing it to hit. When you use this feature to benefit another creature's attack roll, you must take a Reaction to do so. LEVE L 3: WAR DOMAIN SPELLS Your connection to this divine domain ensures you always have certain spells ready. When you reach Table: a Cleric level specified in the War Domain Spells table, you thereafter always have the listed spells prepar ed. Table: War Domain Spells Table: Cleric Level Prepared Spells 3 Guiding Bolt, Magic Weapon, Shield of Faith, Spiritual Weapon 5 Crusader's Mantle, Spirit Guardians 7 Fire Shield, Freedom of Movement 9 Hold Monster, Steel Wind Strike"
          },
          {
            "level": 3,
            "name": "War Priest",
            "description": "As a Bonus Action, you can make one attack with a weapon or an Unarmed Strike. You can use this Bonus Action a number of times equal to your Wisdom modifier (minimum of once). You regain all expended uses when you finish a Short or Long Rest."
          },
          {
            "level": 6,
            "name": "War Goo'S Blessing",
            "description": "You can expend a use of your Channel Divinity to cast Shield of Faith or Spiritual Weapon rather than expending a spell slot. When you cast either spell in this way, the spell doesn't require Concentration. Instead the spell lasts for 1 minute, but it ends early if you cast that spell again, have the Incapacitated condition, or die."
          },
          {
            "level": 17,
            "name": "Avatar Of Battle",
            "description": "You gain Resistance to Bludgeoning, Piercing, and Slashing damage."
          }
        ]
      }
    ]
  },
  {
    "id": "druid",
    "name": "Druid",
    "coreTraits": {
      "Primary Ability": "Wisdom",
      "Hit Point Die": "D8 per Druid level",
      "Saving Throw Proficiencies": "Intelligence and Wisdom",
      "Skill Proficiencies": "Choose 2: Animal Handling, Arcana, Insight, Medicine, Na ture, Perception, Religion, or Survival",
      "Weapon Proficiencies": "Simple weapons",
      "Tool Proficiencies": "Herbalism Kit",
      "Armor Training": "Light armor and Shields",
      "Starting Equipment": "Choose A or B: (A) Leather Ar mor, Shield, Sickle, Druidic Fo cus (Quarterstaff), Explorer's Pack, Herbalism Kit, and 9 GP; or (B) 50 GP"
    },
    "progression": [
      {
        "level": 1,
        "features": [
          "Spellcasting",
          "Druidic",
          "Primal Order"
        ],
        "extras": {
          "Proficiency Bonus": "+2",
          "Cantrips": "2",
          "Prepared Spells": "4",
          "1": "2"
        }
      },
      {
        "level": 2,
        "features": [
          "Wild Shape",
          "Wild Companion"
        ],
        "extras": {
          "Proficiency Bonus": "+2",
          "Wild Shape": "2",
          "Cantrips": "2",
          "Prepared Spells": "5",
          "1": "3"
        }
      },
      {
        "level": 3,
        "features": [
          "Druid Subclass"
        ],
        "extras": {
          "Proficiency Bonus": "+2",
          "Wild Shape": "2",
          "Cantrips": "2",
          "Prepared Spells": "6",
          "1": "4",
          "2": "2"
        }
      },
      {
        "level": 4,
        "features": [
          "Ability Score Improvement"
        ],
        "extras": {
          "Proficiency Bonus": "+2",
          "Wild Shape": "2",
          "Cantrips": "3",
          "Prepared Spells": "7",
          "1": "4",
          "2": "3"
        }
      },
      {
        "level": 5,
        "features": [
          "Wild Resurgence"
        ],
        "extras": {
          "Proficiency Bonus": "+3",
          "Wild Shape": "2",
          "Cantrips": "3",
          "Prepared Spells": "9",
          "1": "4",
          "2": "3",
          "3": "2"
        }
      },
      {
        "level": 6,
        "features": [
          "Subclass feature"
        ],
        "extras": {
          "Proficiency Bonus": "+3",
          "Wild Shape": "3",
          "Cantrips": "3",
          "Prepared Spells": "10",
          "1": "4",
          "2": "3",
          "3": "3"
        }
      },
      {
        "level": 7,
        "features": [
          "Elemental Fury"
        ],
        "extras": {
          "Proficiency Bonus": "+3",
          "Wild Shape": "3",
          "Cantrips": "3",
          "Prepared Spells": "11",
          "1": "4",
          "2": "3",
          "3": "3",
          "4": "1"
        }
      },
      {
        "level": 8,
        "features": [
          "Ability Score Improvement"
        ],
        "extras": {
          "Proficiency Bonus": "+3",
          "Wild Shape": "3",
          "Cantrips": "3",
          "Prepared Spells": "12",
          "1": "4",
          "2": "3",
          "3": "3",
          "4": "2"
        }
      },
      {
        "level": 9,
        "features": [],
        "extras": {
          "Proficiency Bonus": "+4",
          "Wild Shape": "3",
          "Cantrips": "3",
          "Prepared Spells": "14",
          "1": "4",
          "2": "3",
          "3": "3",
          "4": "3",
          "5": "1"
        }
      },
      {
        "level": 10,
        "features": [
          "Subclass feature"
        ],
        "extras": {
          "Proficiency Bonus": "+4",
          "Wild Shape": "3",
          "Cantrips": "4",
          "Prepared Spells": "15",
          "1": "4",
          "2": "3",
          "3": "3",
          "4": "3",
          "5": "2"
        }
      },
      {
        "level": 11,
        "features": [],
        "extras": {
          "Proficiency Bonus": "+4",
          "Wild Shape": "3",
          "Cantrips": "4",
          "Prepared Spells": "16",
          "1": "4",
          "2": "3",
          "3": "3",
          "4": "3",
          "5": "2",
          "6": "1"
        }
      },
      {
        "level": 12,
        "features": [
          "Ability Score Improvement"
        ],
        "extras": {
          "Proficiency Bonus": "+4",
          "Wild Shape": "3",
          "Cantrips": "4",
          "Prepared Spells": "16",
          "1": "4",
          "2": "3",
          "3": "3",
          "4": "3",
          "5": "2",
          "6": "1"
        }
      },
      {
        "level": 13,
        "features": [],
        "extras": {
          "Proficiency Bonus": "+5",
          "Wild Shape": "3",
          "Cantrips": "4",
          "Prepared Spells": "17",
          "1": "4",
          "2": "3",
          "3": "3",
          "4": "3",
          "5": "2",
          "6": "1",
          "7": "1"
        }
      },
      {
        "level": 14,
        "features": [
          "Subclass feature"
        ],
        "extras": {
          "Proficiency Bonus": "+5",
          "Wild Shape": "3",
          "Cantrips": "4",
          "Prepared Spells": "17",
          "1": "4",
          "2": "3",
          "3": "3",
          "4": "3",
          "5": "2",
          "6": "1",
          "7": "1"
        }
      },
      {
        "level": 15,
        "features": [
          "Improved Elemental Fury"
        ],
        "extras": {
          "Proficiency Bonus": "+5",
          "Wild Shape": "3",
          "Cantrips": "4",
          "Prepared Spells": "18",
          "1": "4",
          "2": "3",
          "3": "3",
          "4": "3",
          "5": "2",
          "6": "1",
          "7": "1",
          "8": "1"
        }
      },
      {
        "level": 16,
        "features": [
          "Ability Score Improvement"
        ],
        "extras": {
          "Proficiency Bonus": "+5",
          "Wild Shape": "3",
          "Cantrips": "4",
          "Prepared Spells": "18",
          "1": "4",
          "2": "3",
          "3": "3",
          "4": "3",
          "5": "2",
          "6": "1",
          "7": "1",
          "8": "1"
        }
      },
      {
        "level": 17,
        "features": [],
        "extras": {
          "Proficiency Bonus": "+6",
          "Wild Shape": "4",
          "Cantrips": "4",
          "Prepared Spells": "19",
          "1": "4",
          "2": "3",
          "3": "3",
          "4": "3",
          "5": "2",
          "6": "1",
          "7": "1",
          "8": "1",
          "9": "1"
        }
      },
      {
        "level": 18,
        "features": [
          "Beast Spells"
        ],
        "extras": {
          "Proficiency Bonus": "+6",
          "Wild Shape": "4",
          "Cantrips": "4",
          "Prepared Spells": "20",
          "1": "4",
          "2": "3",
          "3": "3",
          "4": "3",
          "5": "3",
          "6": "1",
          "7": "1",
          "8": "1",
          "9": "1"
        }
      },
      {
        "level": 19,
        "features": [
          "Epic Boon"
        ],
        "extras": {
          "Proficiency Bonus": "+6",
          "Wild Shape": "4",
          "Cantrips": "4",
          "Prepared Spells": "21",
          "1": "4",
          "2": "3",
          "3": "3",
          "4": "3",
          "5": "3",
          "6": "2",
          "7": "1",
          "8": "1",
          "9": "1"
        }
      },
      {
        "level": 20,
        "features": [
          "Archdruid"
        ],
        "extras": {
          "Proficiency Bonus": "+6",
          "Wild Shape": "4",
          "Cantrips": "4",
          "Prepared Spells": "22",
          "1": "4",
          "2": "3",
          "3": "3",
          "4": "3",
          "5": "3",
          "6": "2",
          "7": "2",
          "8": "1",
          "9": "1"
        }
      }
    ],
    "features": [
      {
        "level": 1,
        "name": "Spellcasting",
        "description": "You have learned to cast spells through studying the mystical forces of nature. See \"Spells\" for the rules on spellcasting. The information below details how you use those rules with Druid spells, which appear on the Druid spell list later in the class's description. Cantrips. You know two cantrips of your choice from the Druid spell list. *Druidcraft* and *Produce Flame* are recommended. Whenever you gain a Druid level, you can replace one of your cantrips with another cantrip of your choice from the Druid spell list. When you reach Druid levels 4 and 10, you learn another cantrip of your choice from the Druid spell list, as shown in the Cantrips column of the Druid Features table. Spell Slots. The Druid Features table shows how many spell slots you have to cast your level 1+ spells. You regain all expended slots when you finish a Long Rest. Prepared Spells of Level 1+. You prepare the list of level 1+ spells that are available for you to cast with this feature. To start, choose four level 1 spells from the Druid spell list. *Animal Friendship*, *Cure Wounds*, *Faerie Fire*, and *Thunderwave* are recommended. The number of spells on your list increases as you gain Druid levels, as shown in the Prepared Spells column of the Druid Features table. Whenever that number increases, choose additional spells from the Druid spell list until the number of spells on your list matches the number on the table. The chosen spells must be of a level for which you have spell slots. For example, if you're a level 3 Druid, your list of prepared spells can include six spells of levels 1 and 2 in any combination. If another Druid feature gives you spells that you always have prepared, those spells don't count against the number of spells you can prepare with this feature, but those spells…"
      },
      {
        "level": 1,
        "name": "Druidic",
        "description": "You know Druidic, the secret language of Druids. While learning this ancient tongue, you also unlocked the magic of communicating with animals; you always have the *Speak with Animals* spell prepared. You can use Druidic to leave hidden messages. You and others who know Druidic automatically spot such a message. Others spot the message's presence with a successful DC 15 Intelligence (Investigation) check but can't decipher it without magic."
      },
      {
        "level": 1,
        "name": "Primal Order",
        "description": "You have dedicated yourself to one of the following sacred roles of your choice. Magician. You know one extra cantrip from the Druid spell list. In addition, your mystical connection to nature gives you a bonus to your Intelligence (Arcana or Nature) checks. The bonus equals your Wisdom modifier (minimum bonus of +1). Warden. Trained for battle, you gain proficiency with Martial weapons and training with Medium armor."
      },
      {
        "level": 2,
        "name": "Wild Shape",
        "description": "The power of nature allows you to assume the form of an animal. As a Bonus Action, you shape-shift into a Beast form that you have learned for this feature (see \"Known Forms\" below). You stay in that form for a number of hours equal to half your Druid level or until you use Wild Shape again, have the Incapacitated condition, or die. You can also leave the form early as a Bonus Action. Number of Uses. You can use Wild Shape twice. You regain one expended use when you finish a Short Rest, and you regain all expended uses when you finish a Long Rest. You gain additional uses when you reach certain Druid levels, as shown in the Wild Shape column of the Druid Features table. Known Forms. You know four Beast forms for this feature, chosen from among Beast stat blocks that have a maximum Challenge Rating of 1/4 and that lack a Fly Speed (see \"Animals\" in \"Monsters\" for stat block options). The Rat, Riding Horse, Spider, and Wolf are recommended. Whenever you finish a Long Rest, you can replace one of your known forms with another eligible form. When you reach certain Druid levels, your number of known forms and the maximum Challenge Rating for those forms increases, as shown in the Beast Shapes table. In addition, starting at level 8, you can adopt a form that has a Fly Speed. When choosing known forms, you may look in other sources for eligible Beasts if the Game Master permits you to do so. Table: Beast Shapes | Druid Level | Known Forms | Max CR | Fly Speed | |----------------|----------------|-----------|-----------| | 2 | 4 | 1/4 | No | | 4 | 6 | 1/2 | No | | 8 | 8 | 1 | Yes | Rules While Shape-Shifted. While in a form, you retain your personality, memories, and ability to speak, and the following rules apply: - Temporary Hit Points. When you assume a Wild Shape form,…"
      },
      {
        "level": 2,
        "name": "Wild Companion",
        "description": "You can summon a nature spirit that assumes an animal form to aid you. As a Magic action, you can expend a spell slot or a use of Wild Shape to cast the *Find Familiar* spell without Material components. When you cast the spell in this way, the familiar is Fey and disappears when you finish a Long Rest."
      },
      {
        "level": 3,
        "name": "Druid Subclass",
        "description": "You gain a Druid subclass of your choice. The Circle of the Land subclass is detailed after this class's description. A subclass is a specialization that grants you features at certain Druid levels. For the rest of your career, you gain each of your subclass's features that are of your Druid level or lower."
      },
      {
        "level": 4,
        "name": "Ability Score Improvement",
        "description": "You gain the Ability Score Improvement feat (see \"Feats\") or another feat of your choice for which you qualify. You gain this feature again at Druid levels 8, 12, and 16."
      },
      {
        "level": 5,
        "name": "Wild Resurgence",
        "description": "Once on each of your turns, if you have no uses of Wild Shape left, you can give yourself one use by expending a spell slot (no action required). In addition, you can expend one use of Wild Shape (no action required) to give yourself a level 1 spell slot, but you can't do so again until you finish a Long Rest."
      },
      {
        "level": 7,
        "name": "Elemental Fury",
        "description": "The might of the elements flows through you. You gain one of the following options of your choice. Potent Spellcasting. Add your Wisdom modifier to the damage you deal with any Druid cantrip. Primal Strike. Once on each of your turns when you hit a creature with an attack roll using a weapon or a Beast form's attack in Wild Shape, you can cause the target to take an extra 1d8 Cold, Fire, Lightning, or Thunder damage (choose when you hit)."
      },
      {
        "level": 15,
        "name": "Improved Elemental Fury",
        "description": "The option you chose for Elemental Fury grows more powerful, as detailed below. Potent Spellcasting. When you cast a Druid cantrip with a range of 10 feet or greater, the spell's range increases by 300 feet. Primal Strike. The extra damage of your Primal Strike increases to 2d8."
      },
      {
        "level": 18,
        "name": "Beast Spells",
        "description": "While using Wild Shape, you can cast spells in Beast form, except for any spell that has a Material component with a cost specified or that consumes its Material component."
      },
      {
        "level": 19,
        "name": "Epic Boon",
        "description": "You gain an Epic Boon feat (see \"Feats\") or another feat of your choice for which you qualify. Boon of Dimensional Travel is recommended."
      },
      {
        "level": 20,
        "name": "Archdruid",
        "description": "The vitality of nature constantly blooms within you, granting you the following benefits. Evergreen Wild Shape. Whenever you roll Initiative and have no uses of Wild Shape left, you regain one expended use of it. Nature Magician. You can convert uses of Wild Shape into a spell slot (no action required). Choose a number of your unexpended uses of Wild Shape and convert them into a single spell slot, with each use contributing 2 spell levels. For example, if you convert two uses of Wild Shape, you produce a level 4 spell slot. Once you use this benefit, you can't do so again until you finish a Long Rest. Longevity. The primal magic that you wield causes you to age more slowly. For every ten years that pass, your body ages only one year."
      }
    ],
    "subclasses": [
      {
        "id": "circle-of-the-land",
        "name": "Circle of the Land",
        "features": [
          {
            "level": 3,
            "name": "Circle of the Land Spells",
            "description": "Whenever you finish a Long Rest, choose one type of land: arid, polar, temperate, or tropical. Consult the table below that corresponds to the chosen type; you have the spells listed for your Druid level and lower prepared. Table: Arid Land | Druid Level | Circle Spells | |-------------|--------------------------------| | 3 | Blur, Burning Hands, Fire Bolt | | 5 | Fireball | | 7 | Blight | | 9 | Wall of Stone | Table: Polar Land | Druid Level | Circle Spells | |-------------|--------------------------------------| | 3 | Fog Cloud, Hold Person, Ray of Frost | | 5 | Sleet Storm | | 7 | Ice Storm | | 9 | Cone of Cold | Table: Temperate Land | Druid Level | Circle Spells | |-------------|-----------------------------------| | 3 | Misty Step, Shocking Grasp, Sleep | | 5 | Lightning Bolt | | 7 | Freedom of Movement | | 9 | Tree Stride | Table: Tropical Land | Druid Level | Circle Spells | |-------------|-----------------------------------| | 3 | Acid Splash, Ray of Sickness, Web | | 5 | Stinking Cloud | | 7 | Polymorph | | 9 | Insect Plague |"
          },
          {
            "level": 3,
            "name": "Land's Aid",
            "description": "As a Magic action, you can expend a use of your Wild Shape and choose a point within 60 feet of yourself. Vitality-giving flowers and life-draining thorns appear for a moment in a 10-foot-radius Sphere centered on that point. Each creature of your choice in the Sphere must make a Constitution saving throw against your spell save DC, taking 2d6 Necrotic damage on a failed save or half as much damage on a successful one. One creature of your choice in that area regains 2d6 Hit Points. The damage and healing increase by 1d6 when you reach Druid levels 10 (3d6) and 14 (4d6)."
          },
          {
            "level": 6,
            "name": "Natural Recovery",
            "description": "You can cast one of the level 1+ spells that you have prepared from your Circle Spells feature without expending a spell slot, and you must finish a Long Rest before you do so again. In addition, when you finish a Short Rest, you can choose expended spell slots to recover. The spell slots can have a combined level that is equal to or less than half your Druid level (round up), and none of them can be level 6+. For example, if you're a level 6 Druid, you can recover up to three levels' worth of spell slots. You can recover a level 3 spell slot, a level 2 and a level 1 spell slot, or three level 1 spell slots. Once you recover spell slots with this feature, you can't do so again until you finish a Long Rest."
          },
          {
            "level": 10,
            "name": "Nature's Ward",
            "description": "You are immune to the Poisoned condition, and you have Resistance to a damage type associated with your current land choice in the Circle Spells feature, as shown in the Nature's Ward table. Table: Nature's Ward | Land Type | Resistance | Land Type | Resistance | |-----------|------------|-----------|------------| | Arid | Fire | Temperate | Lightning | | Polar | Cold | Tropical | Poison |"
          },
          {
            "level": 14,
            "name": "Nature's Sanctuary",
            "description": "As a Magic action, you can expend a use of your Wild Shape and cause spectral trees and vines to appear in a 15-foot Cube on the ground within 120 feet of yourself. They last there for 1 minute or until you have the Incapacitated condition or die. You and your allies have Half Cover while in that area, and your allies gain the current Resistance of your Nature's Ward while there. As a Bonus Action, you can move the Cube up to 60 feet to ground within 120 feet of yourself. --- ## Additional Subclasses"
          }
        ]
      },
      {
        "id": "circle-of-the-moon",
        "name": "Circle of the Moon",
        "features": [
          {
            "level": 3,
            "name": "Circle Forms",
            "description": "You can channel lunar magic when you assume a Wild Shape form, granting you the benefits below. Challenge Rating. The maximum Challenge Rating for the form equals your Druid level divided by 3 (round down). Armor Class. Until you leave the form, your AC equals 13 plus your Wisdom modifier if that total is higher than the Beast’s AC. Temporary Hit Points. You gain a number of Temporary Hit Points equal to three times your Druid level."
          },
          {
            "level": 3,
            "name": "Circle Of The Moon Spells",
            "description": "When you reach a Druid level specified in the Circle of the Moon Spells table, you thereafter always have the listed spells prepared. In addition, you can cast the spells from this feature while you’re in a Wild Shape form. Table: Circle of the Moon Spells | Druid Level | Prepared Spells | | --- | --- | | 3 | Cure Wounds, Moonbeam, Starry Wisp | | 5 | Conjure Animals | | 7 | Fount of Moonlight | | 9 | Mass Cure Wounds |"
          },
          {
            "level": 6,
            "name": "Improved Circle Forms",
            "description": "While in a Wild Shape form, you gain the following benefits. Lunar Radiance. Each of your attacks in a Wild Shape form can deal its normal damage type or Radiant damage. You make this choice each time you hit with those attacks. Increased Toughness. You can add your Wisdom modifier to your Constitution saving throws."
          },
          {
            "level": 10,
            "name": "Moonlight Step",
            "description": "You magically transport yourself, reappearing amid a burst of moonlight. As a Bonus Action, you teleport up to 30 feet to an unoccupied space you can see, and you have Advantage on the next attack roll you make before the end of this turn. You can use this feature a number of times equal to your Wisdom modifier (minimum of once), and you regain all expended uses when you finish a Long Rest. You can also regain uses by expending a level 2+ spell slot for each use you want to restore (no action required)."
          },
          {
            "level": 14,
            "name": "Lunar Form",
            "description": "The power of the moon suffuses you, granting you the following benefits. Improved Lunar Radiance. Once per turn, you can deal an extra 2d10 Radiant damage to a target you hit with a Wild Shape form’s attack. Shared Moonlight. Whenever you use Moonlight Step, you can also teleport one willing creature. That creature must be within 10 feet of you, and you teleport it to an unoccupied space you can see within 10 feet of your destination space."
          }
        ]
      },
      {
        "id": "circle-of-the-sea",
        "name": "Circle of the Sea",
        "features": [
          {
            "level": 3,
            "name": "Circle Of The Sea Spells",
            "description": "When you reach a Druid level specified in the Circle of the Sea Spells table, you thereafter always have the listed spells prepared. Table: Circle of the Sea Spells | Druid Level | Prepared Spells | | --- | --- | | 3 | Fog Cloud, Gust of Wind, Ray of Frost, Thunderwave | | 5 | Lightning Bolt, Water Breathing | | 7 | Control Water, Ice Storm | | 9 | Conjure Elemental, Hold Monster |"
          },
          {
            "level": 3,
            "name": "Wrath Of The Sea",
            "description": "As a Bonus Action, you can expend a use of your Wild Shape to manifest a 5-foot Emanation that takes the form of ocean spray that surrounds you for 10 minutes. It ends early if you dismiss it (no action required), manifest it again, or have the Incapacitated condition. When you manifest the Emanation and as a Bonus Action on your subsequent turns, you can choose another creature you can see in the Emanation. The target must succeed on a Constitution saving throw against your spell save DC or take Cold damage and, if the creature is Large or smaller, be pushed up to 15 feet away from you. To determine this damage, roll a number of d6s equal to your Wisdom modifier (minimum of one die)."
          },
          {
            "level": 6,
            "name": "Aquatic Affinity",
            "description": "The size of the Emanation created by your Wrath of the Sea increases to 10 feet. In addition, you gain a Swim Speed equal to your Speed."
          },
          {
            "level": 10,
            "name": "Stormborn",
            "description": "Your Wrath of the Sea confers two more benefits while active, as detailed below. Flight. You gain a Fly Speed equal to your Speed. Resistance. You have Resistance to Cold, Lightning, and Thunder damage."
          },
          {
            "level": 14,
            "name": "Oceanic Gift",
            "description": "Instead of manifesting the Emanation of Wrath of the Sea around yourself, you can manifest it around one willing creature within 60 feet of yourself. That creature gains all the benefits of the Emanation and uses your spell save DC and Wisdom modifier for it. In addition, you can manifest the Emanation around both the other creature and yourself if you expend two uses of your Wild Shape instead of one when manifesting it."
          }
        ]
      },
      {
        "id": "circle-of-the-stars",
        "name": "Circle of the Stars",
        "features": [
          {
            "level": 3,
            "name": "Star Map",
            "description": "You’ve created a star chart as part of your heavenly studies. It is a Tiny object, and you can use it as a Spellcasting Focus for your Druid spells. You determine its form by rolling on the Star Map table or by choosing one. While holding the map, you have the Guidance and Guiding Bolt spells prepared, and you can cast Guiding Bolt without expending a spell slot. You can cast it in that way a number of times equal to your Wisdom modifier (minimum of once), and you regain all expended uses when you finish a Long Rest. If you lose the map, you can perform a 1-hour ceremony to magically create areplacement. This ceremony can be performed during a Short or Long Rest, and it destroys the previous map. Star Map | 1d6 | Map Form | | --- | --- | | 1 | A scroll bearing depictions of constellations | | 2 | A stone tablet with fine holes drilled through it | | 3 | An owlbear hide tooled with stellar symbols | | 4 | A collection of maps bound in an ebony cover | | 5 | A crystal engraved with starry patterns | | 6 | A glass disk etched with constellations |"
          },
          {
            "level": 3,
            "name": "Starry Form",
            "description": "As a Bonus Action, you can expend a use of your Wild Shape feature to take on a starry form rather than shape-shifting. While in your starry form, you retain your game statistics, but your body becomes luminous, your joints glimmer like stars, and glowing lines connect them as on a star chart. This form sheds Bright Light in a 10-foot radius and Dim Light for an additional 10 feet. The form lasts for 10 minutes. It ends early if you dismiss it (no action required), have the Incapacitated condition, or use this feature again. Whenever you assume your starry form, choose which of the following constellations glimmers on your body; your choice gives you certain benefits while in the form. Archer. A constellation of an archer appears on you. When you activate this form and as a Bonus Action on your subsequent turns while it lasts, you can make a ranged spell attack, hurling a luminous arrow that targets one creature within 60 feet of yourself. On a hit, the attack deals Radiant damage equal to 1d8 plus your Wisdom modifier. Chalice. A constellation of a life-giving goblet appears on you. Whenever you cast a spell using a spell slot that restores Hit Points to a creature, you or another creature within 30 feet of you can regain Hit Points equal to 1d8 plus your Wisdom modifier. Dragon. A constellation of a wise dragon appears on you. When you make an Intelligence or a Wisdom check or a Constitution saving throw to maintain Concentration, you can treat a roll of 9 or lower on the d20 as a 10."
          },
          {
            "level": 6,
            "name": "Cosmic Omen",
            "description": "Whenever you finish a Long Rest, you can consult your Star Map for omens and roll a die. Until you finish your next Long Rest, you gain access to a special Reaction based on whether you rolled an even or an odd number on the die: Weal (Even). Whenever a creature you can see within 30 feet of you is about to make a D20 Test, you can take a Reaction to roll 1d6 and add the number rolled to the total. Woe (Odd). Whenever a creature you can see within 30 feet of you is about to make a D20 Test, you can take a Reaction to roll 1d6 and subtract the number rolled from the total. You can use this Reaction a number of times equal to your Wisdom modifier (minimum of once), and you regain all expended uses when you finish a Long Rest."
          },
          {
            "level": 10,
            "name": "Twinkling Constellations",
            "description": "The constellations of your Starry Form improve. The 1d8 of the Archer and the Chalice becomes 2d8, and while the Dragon is active, you have a Fly Speed of 20 feet and can hover. Moreover, at the start of each of your turns while in your Starry Form, you can change which constellation glimmers on your body."
          },
          {
            "level": 14,
            "name": "Full Of Stars",
            "description": "While in your Starry Form, you become partially incorporeal, giving you Resistance to Bludgeoning, Piercing, and Slashing damage."
          }
        ]
      }
    ]
  },
  {
    "id": "fighter",
    "name": "Fighter",
    "coreTraits": {
      "Primary Ability": "Strength or Dexterity",
      "Hit Point Die": "D10 per Fighter level",
      "Saving Throw Proficiencies": "Strength and Constitution",
      "Skill Proficiencies": "Choose 2: Acrobatics, Animal Handling, Athletics, History, Insight, Intimidation, Persuasion, Perception, or Survival",
      "Weapon Proficiencies": "Simple and Martial weapons",
      "Armor Training": "Light, Medium, and Heavy armor and Shields",
      "Starting Equipment": "Choose A, B, or C: (A) Chain Mail, Greatsword, Flail, 8 Javelins, Dungeoneer's Pack, and 4 GP; (B) Studded Leather Armor, Scimitar, Shortsword, Longbow, 20 Arrows, Quiver, Dungeoneer's Pack, and 11 GP; or (C) 155 GP"
    },
    "progression": [
      {
        "level": 1,
        "features": [
          "Fighting Style",
          "Second Wind",
          "Weapon Mastery"
        ],
        "extras": {
          "Proficiency Bonus": "+2",
          "Second Wind": "2",
          "Weapon Mastery": "3"
        }
      },
      {
        "level": 2,
        "features": [
          "Action Surge (one use)",
          "Tactical Mind"
        ],
        "extras": {
          "Proficiency Bonus": "+2",
          "Second Wind": "2",
          "Weapon Mastery": "3"
        }
      },
      {
        "level": 3,
        "features": [
          "Fighter Subclass"
        ],
        "extras": {
          "Proficiency Bonus": "+2",
          "Second Wind": "2",
          "Weapon Mastery": "3"
        }
      },
      {
        "level": 4,
        "features": [
          "Ability Score Improvement"
        ],
        "extras": {
          "Proficiency Bonus": "+2",
          "Second Wind": "3",
          "Weapon Mastery": "4"
        }
      },
      {
        "level": 5,
        "features": [
          "Extra Attack",
          "Tactical Shift"
        ],
        "extras": {
          "Proficiency Bonus": "+3",
          "Second Wind": "3",
          "Weapon Mastery": "4"
        }
      },
      {
        "level": 6,
        "features": [
          "Ability Score Improvement"
        ],
        "extras": {
          "Proficiency Bonus": "+3",
          "Second Wind": "3",
          "Weapon Mastery": "4"
        }
      },
      {
        "level": 7,
        "features": [
          "Subclass feature"
        ],
        "extras": {
          "Proficiency Bonus": "+3",
          "Second Wind": "3",
          "Weapon Mastery": "4"
        }
      },
      {
        "level": 8,
        "features": [
          "Ability Score Improvement"
        ],
        "extras": {
          "Proficiency Bonus": "+3",
          "Second Wind": "3",
          "Weapon Mastery": "4"
        }
      },
      {
        "level": 9,
        "features": [
          "Indomitable (one use)",
          "Tactical Master"
        ],
        "extras": {
          "Proficiency Bonus": "+4",
          "Second Wind": "3",
          "Weapon Mastery": "4"
        }
      },
      {
        "level": 10,
        "features": [
          "Subclass feature"
        ],
        "extras": {
          "Proficiency Bonus": "+4",
          "Second Wind": "4",
          "Weapon Mastery": "5"
        }
      },
      {
        "level": 11,
        "features": [
          "Two Extra Attacks"
        ],
        "extras": {
          "Proficiency Bonus": "+4",
          "Second Wind": "4",
          "Weapon Mastery": "5"
        }
      },
      {
        "level": 12,
        "features": [
          "Ability Score Improvement"
        ],
        "extras": {
          "Proficiency Bonus": "+4",
          "Second Wind": "4",
          "Weapon Mastery": "5"
        }
      },
      {
        "level": 13,
        "features": [
          "Indomitable (two uses)",
          "Studied Attacks"
        ],
        "extras": {
          "Proficiency Bonus": "+5",
          "Second Wind": "4",
          "Weapon Mastery": "5"
        }
      },
      {
        "level": 14,
        "features": [
          "Ability Score Improvement"
        ],
        "extras": {
          "Proficiency Bonus": "+5",
          "Second Wind": "4",
          "Weapon Mastery": "5"
        }
      },
      {
        "level": 15,
        "features": [
          "Subclass feature"
        ],
        "extras": {
          "Proficiency Bonus": "+5",
          "Second Wind": "4",
          "Weapon Mastery": "5"
        }
      },
      {
        "level": 16,
        "features": [
          "Ability Score Improvement"
        ],
        "extras": {
          "Proficiency Bonus": "+5",
          "Second Wind": "4",
          "Weapon Mastery": "6"
        }
      },
      {
        "level": 17,
        "features": [
          "Action Surge (two uses)",
          "Indomitable (three uses)"
        ],
        "extras": {
          "Proficiency Bonus": "+6",
          "Second Wind": "4",
          "Weapon Mastery": "6"
        }
      },
      {
        "level": 18,
        "features": [
          "Subclass feature"
        ],
        "extras": {
          "Proficiency Bonus": "+6",
          "Second Wind": "4",
          "Weapon Mastery": "6"
        }
      },
      {
        "level": 19,
        "features": [
          "Epic Boon"
        ],
        "extras": {
          "Proficiency Bonus": "+6",
          "Second Wind": "4",
          "Weapon Mastery": "6"
        }
      },
      {
        "level": 20,
        "features": [
          "Three Extra Attacks"
        ],
        "extras": {
          "Proficiency Bonus": "+6",
          "Second Wind": "4",
          "Weapon Mastery": "6"
        }
      }
    ],
    "features": [
      {
        "level": 1,
        "name": "Fighting Style",
        "description": "You have honed your martial prowess and gain a Fighting Style feat of your choice (see \"Feats\"). Defense is recommended. Whenever you gain a Fighter level, you can replace the feat you chose with a different Fighting Style feat."
      },
      {
        "level": 1,
        "name": "Second Wind",
        "description": "You have a limited well of physical and mental stamina that you can draw on. As a Bonus Action, you can use it to regain Hit Points equal to 1d10 plus your Fighter level. You can use this feature twice. You regain one expended use when you finish a Short Rest, and you regain all expended uses when you finish a Long Rest. When you reach certain Fighter levels, you gain more uses of this feature, as shown in the Second Wind column of the Fighter Features table."
      },
      {
        "level": 1,
        "name": "Weapon Mastery",
        "description": "Your training with weapons allows you to use the mastery properties of three kinds of Simple or Martial weapons of your choice. Whenever you finish a Long Rest, you can practice weapon drills and change one of those weapon choices. When you reach certain Fighter levels, you gain the ability to use the mastery properties of more kinds of weapons, as shown in the Weapon Mastery column of the Fighter Features table."
      },
      {
        "level": 2,
        "name": "Action Surge",
        "description": "You can push yourself beyond your normal limits for a moment. On your turn, you can take one additional action, except the Magic action. Once you use this feature, you can't do so again until you finish a Short or Long Rest. Starting at level 17, you can use it twice before a rest but only once on a turn."
      },
      {
        "level": 2,
        "name": "Tactical Mind",
        "description": "You have a mind for tactics on and off the battlefield. When you fail an ability check, you can expend a use of your Second Wind to push yourself toward success. Rather than regaining Hit Points, you roll 1d10 and add the number rolled to the ability check, potentially turning it into a success. If the check still fails, this use of Second Wind isn't expended."
      },
      {
        "level": 3,
        "name": "Fighter Subclass",
        "description": "You gain a Fighter subclass of your choice. The Champion subclass is detailed after this class's description. A subclass is a specialization that grants you features at certain Fighter levels. For the rest of your career, you gain each of your subclass's features that are of your Fighter level or lower."
      },
      {
        "level": 4,
        "name": "Ability Score Improvement",
        "description": "You gain the Ability Score Improvement feat (see \"Feats\") or another feat of your choice for which you qualify. You gain this feature again at Fighter levels 6, 8, 12, 14, and 16."
      },
      {
        "level": 5,
        "name": "Extra Attack",
        "description": "You can attack twice instead of once whenever you take the Attack action on your turn."
      },
      {
        "level": 5,
        "name": "Tactical Shift",
        "description": "Whenever you activate your Second Wind with a Bonus Action, you can move up to half your Speed without provoking Opportunity Attacks."
      },
      {
        "level": 9,
        "name": "Indomitable",
        "description": "If you fail a saving throw, you can reroll it with a bonus equal to your Fighter level. You must use the new roll, and you can't use this feature again until you finish a Long Rest. You can use this feature twice before a Long Rest starting at level 13 and three times before a Long Rest starting at level 17."
      },
      {
        "level": 9,
        "name": "Tactical Master",
        "description": "When you attack with a weapon whose mastery property you can use, you can replace that property with the Push, Sap, or Slow property for that attack."
      },
      {
        "level": 11,
        "name": "Two Extra Attacks",
        "description": "You can attack three times instead of once whenever you take the Attack action on your turn."
      },
      {
        "level": 13,
        "name": "Studied Attacks",
        "description": "You study your opponents and learn from each attack you make. If you make an attack roll against a creature and miss, you have Advantage on your next attack roll against that creature before the end of your next turn."
      },
      {
        "level": 19,
        "name": "Epic Boon",
        "description": "You gain an Epic Boon feat (see \"Feats\") or another feat of your choice for which you qualify. Boon of Combat Prowess is recommended."
      },
      {
        "level": 20,
        "name": "Three Extra Attacks",
        "description": "You can attack four times instead of once whenever you take the Attack action on your turn."
      }
    ],
    "subclasses": [
      {
        "id": "champion",
        "name": "Champion",
        "features": [
          {
            "level": 3,
            "name": "Improved Critical",
            "description": "Your attack rolls with weapons and Unarmed Strikes can score a Critical Hit on a roll of 19 or 20 on the d20."
          },
          {
            "level": 3,
            "name": "Remarkable Athlete",
            "description": "Thanks to your athleticism, you have Advantage on Initiative rolls and Strength (Athletics) checks. In addition, immediately after you score a Critical Hit, you can move up to half your Speed without provoking Opportunity Attacks."
          },
          {
            "level": 7,
            "name": "Additional Fighting Style",
            "description": "You gain another Fighting Style feat of your choice."
          },
          {
            "level": 10,
            "name": "Heroic Warrior",
            "description": "The thrill of battle drives you toward victory. During combat, you can give yourself Heroic Inspiration whenever you start your turn without it."
          },
          {
            "level": 15,
            "name": "Superior Critical",
            "description": "Your attack rolls with weapons and Unarmed Strikes can now score a Critical Hit on a roll of 18–20 on the d20."
          },
          {
            "level": 18,
            "name": "Survivor",
            "description": "You attain the pinnacle of resilience in battle, giving you these benefits. Defy Death. You have Advantage on Death Saving Throws. Moreover, when you roll 18–20 on a Death Saving Throw, you gain the benefit of rolling a 20 on it. Heroic Rally. At the start of each of your turns, you regain Hit Points equal to 5 plus your Constitution modifier if you are Bloodied and have at least 1 Hit Point. --- ## Additional Subclasses"
          }
        ]
      },
      {
        "id": "banneret",
        "name": "Banneret",
        "features": [
          {
            "level": 3,
            "name": "Knightly Envoy",
            "description": "You know how to conduct yourself with grace as a noble ambassador. You gain the following benefits. Comprehension. You can cast the Comprehend Languages spell but only as a Ritual. Charisma is your spellcasting ability for it. Polyglot. You learn one language from the language tables in the Player’s Handbook or chapter 2 of this book. When you finish a Long Rest, you can replace a language learned from this benefit with another language you have heard, seen signed, or read in the past 24 hours. Well Spoken. You gain proficiency in one of the following skills of your choice: Insight, Intimidation, Persuasion, or Performance."
          },
          {
            "level": 3,
            "name": "Group Recovery",
            "description": "When you use your Second Wind to regain Hit Points, you can choose a number of allies within a 30-foot Emanation originating from yourself, up to a number of allies equal to your Charisma modifier (minimum of one). Each of those allies regains Hit Points equal to 1d4 plus your Fighter level. Once you use this ability, you can’t use it again until you finish a Short or Long Rest."
          },
          {
            "level": 7,
            "name": "Team Tactics",
            "description": "When you use Group Recovery, each chosen ally has Advantage on D20 Tests until the start of your next turn."
          },
          {
            "level": 10,
            "name": "Rallying Surge",
            "description": "When you use your Action Surge, you can choose allies within a 30-foot Emanation originating from yourself, up to a number of allies equal to your Charisma modifier (minimum of one). Each of those allies can immediately take a Reaction to use one of the following options. Attack. The ally makes one attack with a weapon or an Unarmed Strike. Move. The ally moves up to half its Speed without provoking Opportunity Attacks."
          },
          {
            "level": 15,
            "name": "Shared Resilience",
            "description": "When an ally you can see within 60 feet of yourself fails a saving throw, you can take a Reaction to expend a use of your Indomitable feature. The ally can immediately reroll the saving throw with a bonus equal to your Fighter level; the ally must use the new roll."
          },
          {
            "level": 18,
            "name": "Inspiring Commander",
            "description": "You gain the following benefits. Bolstered Rally. The area of effect for both Group Recovery and Rallying Surge is now a 60-foot Emanation. Unshakable Bravery. You have Immunity to the Charmed and Frightened conditions."
          }
        ]
      },
      {
        "id": "battle-master",
        "name": "Battle Master",
        "features": [
          {
            "level": 3,
            "name": "Combat Superiority",
            "description": "Your experience on the battlefield has refined your fighting techniques. You learn maneuvers that are fueled by special dice called Superiority Dice. Maneuvers. You learn three maneuvers of your choice from the “Maneuver Options” section later in this subclass’s description. Many maneuvers enhance an attack in some way. You can use only one maneuver per attack. You learn two additional maneuvers of your choice when you reach Fighter levels 7, 10, and 15. Each time you learn new maneuvers, you can also replace one maneuver you know with a different one. Superiority Dice. You have four Superiority Dice, which are d8s. A Superiority Die is expended when you use it. You regain all expended Superiority Dice when you finish a Short or Long Rest. You gain an additional Superiority Die when you reach Fighter levels 7 (five dice total) and 15 (six dice total). Saving Throws. If a maneuver requires a saving throw, the DC equals 8 plus your Strength or Dexterity modifier (your choice) and Proficiency Bonus."
          },
          {
            "level": 3,
            "name": "Student Of War",
            "description": "You gain proficiency with one type of Artisan’s Tools of your choice, and you gain proficiency in one skill of your choice from the skills available to Fighters at level 1."
          },
          {
            "level": 7,
            "name": "Know Your Enemy",
            "description": "As a Bonus Action, you can discern certain strengths and weaknesses of a creature you can see within 30 feet of yourself; you know whether that creature has any Immunities, Resistances, or Vulnerabilities, and if the creature has any, you know what they are. Once you use this feature, you can’t do so again until you finish a Long Rest. You can also restore a use of the feature by expending one Superiority Die (no action required)."
          },
          {
            "level": 10,
            "name": "Improved Combat Superiority",
            "description": "Your Superiority Die becomes a d10."
          },
          {
            "level": 15,
            "name": "Relentless",
            "description": "Once per turn, when you use a maneuver, you can roll 1d8 and use the number rolled instead of expending a Superiority Die."
          },
          {
            "level": 18,
            "name": "Ultimate Combat Superiority",
            "description": "Your Superiority Die becomes a d12. Maneuver Options The maneuvers are presented here in alphabetical order. Ambush. When you make a Dexterity (Stealth) check or an Initiative roll, you can expend one Superiority Die and add the die to the roll, unless you have the Incapacitated condition. Bait and Switch. When you’re within 5 feet of a creature on your turn, you can expend one Superiority Die and switch places with that creature, provided you spend at least 5 feet of movement and the creature is willing and doesn’t have the Incapacitated condition. This movement doesn’t provoke Opportunity Attacks. Roll the Superiority Die. Until the start of your next turn, you or the other creature (your choice) gains a bonus to AC equal to the number rolled. Commander’s Strike. When you take the Attack action on your turn, you can replace one of your attacks to direct one of your companions to strike. When you do so, choose a willing creature who can see or hear you and expend one Superiority Die. That creature can immediately use its Reaction to make one attack with a weapon or an Unarmed Strike, adding the Superiority Die to the attack’s damage roll on a hit. Commanding Presence. When you make a Charisma (Intimidation, Performance, or Persuasion) check, you can expend one Superiority Die and add that die to the roll. Disarming Attack. When you hit a creature with an attack roll, you can expend one Superiority Die to attempt to disarm the target. Add the Superiority Die roll to the attack’s damage roll. The target must succeed on a Strength saving throw or drop one object of your choice that it’s holding, with the object landing in its space. Distracting Strike. When you hit a creature with an attack roll, you can expend one Superiority Die to distract the target. Add the…"
          }
        ]
      },
      {
        "id": "eldritch-knight",
        "name": "Eldritch Knight",
        "features": [
          {
            "level": 3,
            "name": "Spellcasting",
            "description": "You have learned to cast spells. See chapter 7 for the rules on spellcasting. The information below details how you use those rules as an Eldritch Knight. Cantrips. You know two cantrips of your choice from the Wizard spell list (see that class’s section for its list). Ray of Frost and Shocking Grasp are recommended. Whenever you gain a Fighter level, you can replace one of these cantrips with another cantrip of your choice from the Wizard spell list. When you reach Fighter level 10, you learn another Wizard cantrip of your choice. Spell Slots. The Eldritch Knight Spellcasting table shows how many spell slots you have to cast your level 1+ spells. You regain all expended slots when you finish a Long Rest. Prepared Spells of Level 1+. You prepare the list of level 1+ spells that are available for you to cast with this feature. To start, choose three level 1 spells from the Wizard spell list. Burning Hands, Jump, and Shield are recommended. The number of spells on your list increases as you gain Fighter levels, as shown in the Prepared Spells column of the Eldritch Knight Spellcasting table. Whenever that number increases, choose additional spells from the Wizard spell list until the number of spells on your list matches the number on the table. The chosen spells must be of a level for which you have spell slots. For example, if you’re a level 7 Fighter, your list of prepared spells can include five Wizard spells of levels 1 and 2 in any combination. Changing Your Prepared Spells. Whenever you gain a Fighter level, you can replace one spell on your list with another Wizard spell for which you have spell slots. Spellcasting Ability. Intelligence is your spellcasting ability for your Wizard spells. Spellcasting Focus. You can use an Arcane Focus as a Spellcasting Focus for…"
          },
          {
            "level": 3,
            "name": "War Bond",
            "description": "You learn a ritual that creates a magical bond between yourself and one weapon. You perform the ritual over the course of 1 hour, which can be done during a Short Rest. The weapon must be within your reach throughout the ritual, at the conclusion of which you touch the weapon and forge the bond. The bond fails if another Fighter is bonded to the weapon or if the weapon is a magic item to which someone else is attuned. Once you have bonded a weapon to yourself, you can’t be disarmed of that weapon unless you have the Incapacitated condition. If it is on the same plane of existence, you can summon that weapon as a Bonus Action, causing it to teleport instantly to your hand. You can have up to two bonded weapons, but you can summon only one at a time with a Bonus Action. If you attempt to bond with a third weapon, you must break the bond with one of the other two."
          },
          {
            "level": 7,
            "name": "War Magic",
            "description": "When you take the Attack action on your turn, you can replace one of the attacks with a casting of one of your Wizard cantrips that has a casting time of an action."
          },
          {
            "level": 10,
            "name": "Eldritch Strike",
            "description": "You learn how to make your weapon strikes undercut a creature’s ability to withstand your spells. When you hit a creature with an attack using a weapon, that creature has Disadvantage on the next saving throw it makes against a spell you cast before the end of your next turn."
          },
          {
            "level": 15,
            "name": "Arcane Charge",
            "description": "When you use your Action Surge, you can teleport up to 30 feet to an unoccupied space you can see. You can teleport before or after the additional action."
          },
          {
            "level": 18,
            "name": "Improved War Magic",
            "description": "When you take the Attack action on your turn, you can replace two of the attacks with a casting of one of your level 1 or level 2 Wizard spells that has a casting time of an action."
          }
        ]
      },
      {
        "id": "psi-warrior",
        "name": "Psi Warrior",
        "features": [
          {
            "level": 3,
            "name": "Psionic Power",
            "description": "You harbor a wellspring of psionic energy within yourself. It is represented by your Psionic Energy Dice, which fuel powers you have from this subclass. The Psi Warrior Energy Dice table shows the die size and number of these dice you have when you reach certain Fighter levels. Table: Psi Warrior Energy Dice | Fighter Level | Die Size | Number | | --- | --- | --- | | 3 | D6 | 4 | | 5 | D8 | 6 | | 9 | D8 | 8 | | 11 | D10 | 8 | | 13 | D10 | 10 | | 17 | D12 | 12 | Any features in this subclass that use a Psionic Energy Die use only the dice from this subclass. Some of your powers expend the Psionic Energy Die, as specified in a power’s description, and you can’t use a power if it requires you to use a die when all your Psionic Energy Dice are expended. You regain one of your expended Psionic Energy Dice when you finish a Short Rest, and you regain all of them when you finish a Long Rest. Protective Field. When you or another creature you can see within 30 feet of you takes damage, you can take a Reaction to expend one Psionic Energy Die, roll the die, and reduce the damage taken by the number rolled plus your Intelligence modifier (minimum reduction of 1), as you create a momentary shield of telekinetic force. Psionic Strike. You can propel your weapons with psionic force. Once on each of your turns, immediately after you hit a target within 30 feet of yourself with an attack and deal damage to it with a weapon, you can expend one Psionic Energy Die, rolling it and dealing Force damage to the target equal to the number rolled plus your Intelligence modifier. Telekinetic Movement. You can move an object or a creature with your mind. As a Magic action, choose one target you can see within 30 feet of yourself; the target must be a loose object that is Large or smaller or one…"
          },
          {
            "level": 7,
            "name": "Telekinetic Adept",
            "description": "You have mastered new ways to use your telekinetic abilities, detailed below. Psi-Powered Leap. As a Bonus Action, you gain a Fly Speed equal to twice your Speed until the end of the current turn. Once you take this Bonus Action, you can’t do so again until you finish a Short or Long Rest unless you expend a Psionic Energy Die (no action required) to restore your use of it. Telekinetic Thrust. When you deal damage to a target with your Psionic Strike, you can force the target to make a Strength saving throw (DC 8 plus your Intelligence modifier and Proficiency Bonus). On a failed save, you can give the target the Prone condition or transport it up to 10 feet horizontally."
          },
          {
            "level": 10,
            "name": "Guarded Mind",
            "description": "You have Resistance to Psychic damage. Moreover, if you start your turn with the Charmed or Frightened condition, you can expend a Psionic Energy Die (no action required) and end every effect on yourself giving you those conditions."
          },
          {
            "level": 15,
            "name": "Bulwark Of Force",
            "description": "You can shield yourself and others with telekinetic force. As a Bonus Action, you can choose creatures, including yourself, within 30 feet of yourself, up to a number of creatures equal to your Intelligence modifier (minimum of one creature). Each of the chosen creatures has Half Cover for 1 minute or until you have the Incapacitated condition. Once you use this feature, you can’t do so again until you finish a Long Rest unless you expend a Psionic Energy Die (no action required) to restore your use of it."
          },
          {
            "level": 18,
            "name": "Telekinetic Master",
            "description": "You always have the telekinesis spell prepared. With this feature, you can cast it without a spell slot or components, and your spellcasting ability for it is Intelligence. On each of your turns while you maintain Concentration on it, including the turn when you cast it, you can make one attack with a weapon as a Bonus Action. Once you cast the spell with this feature, you can’t do so in this way again until you finish a Long Rest unless you expend a Psionic Energy Die (no action required) to restore your use of it."
          }
        ]
      }
    ]
  },
  {
    "id": "monk",
    "name": "Monk",
    "coreTraits": {
      "Primary Ability": "Dexterity and Wisdom",
      "Hit Point Die": "D8 per Monk level",
      "Saving Throw Proficiencies": "Strength and Dexterity",
      "Skill Proficiencies": "Choose 2: Acrobatics, Athletics, History, Insight, Religion, or Stealth",
      "Weapon Proficiencies": "Simple weapons and Martial weapons that have the Light property",
      "Tool Proficiencies": "Choose one type of Artisan's Tools or Musical Instrument (see \"Equipment\")",
      "Armor Training": "None",
      "Starting Equipment": "Choose A or B: (A) Spear, 5 Daggers, Artisan's Tools or Musical Instrument chosen for the tool proficiency above, Explorer's Pack, and 11 GP; or (B) 50 GP"
    },
    "progression": [
      {
        "level": 1,
        "features": [
          "Martial Arts",
          "Unarmored Defense"
        ],
        "extras": {
          "Proficiency Bonus": "+2",
          "Martial Arts": "1d6"
        }
      },
      {
        "level": 2,
        "features": [
          "Monk's Focus",
          "Unarmored Movement",
          "Uncanny Metabolism"
        ],
        "extras": {
          "Proficiency Bonus": "+2",
          "Martial Arts": "1d6",
          "Focus Points": "2",
          "Unarmored Movement": "+10 ft."
        }
      },
      {
        "level": 3,
        "features": [
          "Deflect Attacks",
          "Monk Subclass"
        ],
        "extras": {
          "Proficiency Bonus": "+2",
          "Martial Arts": "1d6",
          "Focus Points": "3",
          "Unarmored Movement": "+10 ft."
        }
      },
      {
        "level": 4,
        "features": [
          "Ability Score Improvement",
          "Slow Fall"
        ],
        "extras": {
          "Proficiency Bonus": "+2",
          "Martial Arts": "1d6",
          "Focus Points": "4",
          "Unarmored Movement": "+10 ft."
        }
      },
      {
        "level": 5,
        "features": [
          "Extra Attack",
          "Stunning Strike"
        ],
        "extras": {
          "Proficiency Bonus": "+3",
          "Martial Arts": "1d8",
          "Focus Points": "5",
          "Unarmored Movement": "+10 ft."
        }
      },
      {
        "level": 6,
        "features": [
          "Empowered Strikes",
          "Subclass feature"
        ],
        "extras": {
          "Proficiency Bonus": "+3",
          "Martial Arts": "1d8",
          "Focus Points": "6",
          "Unarmored Movement": "+15 ft."
        }
      },
      {
        "level": 7,
        "features": [
          "Evasion"
        ],
        "extras": {
          "Proficiency Bonus": "+3",
          "Martial Arts": "1d8",
          "Focus Points": "7",
          "Unarmored Movement": "+15 ft."
        }
      },
      {
        "level": 8,
        "features": [
          "Ability Score Improvement"
        ],
        "extras": {
          "Proficiency Bonus": "+3",
          "Martial Arts": "1d8",
          "Focus Points": "8",
          "Unarmored Movement": "+15 ft."
        }
      },
      {
        "level": 9,
        "features": [
          "Acrobatic Movement"
        ],
        "extras": {
          "Proficiency Bonus": "+4",
          "Martial Arts": "1d8",
          "Focus Points": "9",
          "Unarmored Movement": "+15 ft."
        }
      },
      {
        "level": 10,
        "features": [
          "Heightened Focus",
          "Self-Restoration"
        ],
        "extras": {
          "Proficiency Bonus": "+4",
          "Martial Arts": "1d8",
          "Focus Points": "10",
          "Unarmored Movement": "+20 ft."
        }
      },
      {
        "level": 11,
        "features": [
          "Subclass feature"
        ],
        "extras": {
          "Proficiency Bonus": "+4",
          "Martial Arts": "1d10",
          "Focus Points": "11",
          "Unarmored Movement": "+20 ft."
        }
      },
      {
        "level": 12,
        "features": [
          "Ability Score Improvement"
        ],
        "extras": {
          "Proficiency Bonus": "+4",
          "Martial Arts": "1d10",
          "Focus Points": "12",
          "Unarmored Movement": "+20 ft."
        }
      },
      {
        "level": 13,
        "features": [
          "Deflect Energy"
        ],
        "extras": {
          "Proficiency Bonus": "+5",
          "Martial Arts": "1d10",
          "Focus Points": "13",
          "Unarmored Movement": "+20 ft."
        }
      },
      {
        "level": 14,
        "features": [
          "Disciplined Survivor"
        ],
        "extras": {
          "Proficiency Bonus": "+5",
          "Martial Arts": "1d10",
          "Focus Points": "14",
          "Unarmored Movement": "+25 ft."
        }
      },
      {
        "level": 15,
        "features": [
          "Perfect Focus"
        ],
        "extras": {
          "Proficiency Bonus": "+5",
          "Martial Arts": "1d10",
          "Focus Points": "15",
          "Unarmored Movement": "+25 ft."
        }
      },
      {
        "level": 16,
        "features": [
          "Ability Score Improvement"
        ],
        "extras": {
          "Proficiency Bonus": "+5",
          "Martial Arts": "1d10",
          "Focus Points": "16",
          "Unarmored Movement": "+25 ft."
        }
      },
      {
        "level": 17,
        "features": [
          "Subclass feature"
        ],
        "extras": {
          "Proficiency Bonus": "+6",
          "Martial Arts": "1d12",
          "Focus Points": "17",
          "Unarmored Movement": "+25 ft."
        }
      },
      {
        "level": 18,
        "features": [
          "Superior Defense"
        ],
        "extras": {
          "Proficiency Bonus": "+6",
          "Martial Arts": "1d12",
          "Focus Points": "18",
          "Unarmored Movement": "+30 ft."
        }
      },
      {
        "level": 19,
        "features": [
          "Epic Boon"
        ],
        "extras": {
          "Proficiency Bonus": "+6",
          "Martial Arts": "1d12",
          "Focus Points": "19",
          "Unarmored Movement": "+30 ft."
        }
      },
      {
        "level": 20,
        "features": [
          "Body and Mind"
        ],
        "extras": {
          "Proficiency Bonus": "+6",
          "Martial Arts": "1d12",
          "Focus Points": "20",
          "Unarmored Movement": "+30 ft."
        }
      }
    ],
    "features": [
      {
        "level": 1,
        "name": "Martial Arts",
        "description": "Your practice of martial arts gives you mastery of combat styles that use your Unarmed Strike and Monk weapons, which are the following: - Simple Melee weapons - Martial Melee weapons that have the Light property You gain the following benefits while you are unarmed or wielding only Monk weapons and you aren't wearing armor or wielding a Shield. Bonus Unarmed Strike. You can make an Unarmed Strike as a Bonus Action. Martial Arts Die. You can roll 1d6 in place of the normal damage of your Unarmed Strike or Monk weapons. This die changes as you gain Monk levels, as shown in the Martial Arts column of the Monk Features table. Dexterous Attacks. You can use your Dexterity modifier instead of your Strength modifier for the attack and damage rolls of your Unarmed Strikes and Monk weapons. In addition, when you use the Grapple or Shove option of your Unarmed Strike, you can use your Dexterity modifier instead of your Strength modifier to determine the save DC."
      },
      {
        "level": 1,
        "name": "Unarmored Defense",
        "description": "While you aren't wearing armor or wielding a Shield, your base Armor Class equals 10 plus your Dexterity and Wisdom modifiers."
      },
      {
        "level": 2,
        "name": "Monk's Focus",
        "description": "Your focus and martial training allow you to harness a well of extraordinary energy within yourself. This energy is represented by Focus Points. Your Monk level determines the number of points you have, as shown in the Focus Points column of the Monk Features table. You can expend these points to enhance or fuel certain Monk features. You start knowing three such features: Flurry of Blows, Patient Defense, and Step of the Wind, each of which is detailed below. When you expend a Focus Point, it is unavailable until you finish a Short or Long Rest, at the end of which you regain all your expended points. Some features that use Focus Points require your target to make a saving throw. The save DC equals 8 plus your Wisdom modifier and Proficiency Bonus. Flurry of Blows. You can expend 1 Focus Point to make two Unarmed Strikes as a Bonus Action. Patient Defense. You can take the Disengage action as a Bonus Action. Alternatively, you can expend 1 Focus Point to take both the Disengage and the Dodge actions as a Bonus Action. Step of the Wind. You can take the Dash action as a Bonus Action. Alternatively, you can expend 1 Focus Point to take both the Disengage and Dash actions as a Bonus Action, and your jump distance is doubled for the turn."
      },
      {
        "level": 2,
        "name": "Unarmored Movement",
        "description": "Your speed increases by 10 feet while you aren't wearing armor or wielding a Shield. This bonus increases when you reach certain Monk levels, as shown on the Monk Features table."
      },
      {
        "level": 2,
        "name": "Uncanny Metabolism",
        "description": "When you roll Initiative, you can regain all expended Focus Points. When you do so, roll your Martial Arts die, and regain a number of Hit Points equal to your Monk level plus the number rolled. Once you use this feature, you can't use it again until you finish a Long Rest."
      },
      {
        "level": 3,
        "name": "Deflect Attacks",
        "description": "When an attack roll hits you and its damage includes Bludgeoning, Piercing, or Slashing damage, you can take a Reaction to reduce the attack's total damage against you. The reduction equals 1d10 plus your Dexterity modifier and Monk level. If you reduce the damage to 0, you can expend 1 Focus Point to redirect some of the attack's force. If you do so, choose a creature you can see within 5 feet of yourself if the attack was a melee attack or a creature you can see within 60 feet of yourself that isn't behind Total Cover if the attack was a ranged attack. That creature must succeed on a Dexterity saving throw or take damage equal to two rolls of your Martial Arts die plus your Dexterity modifier. The damage is the same type dealt by the attack."
      },
      {
        "level": 3,
        "name": "Monk Subclass",
        "description": "You gain a Monk subclass of your choice. The Warrior of the Open Hand subclass is detailed after this class's description. A subclass is a specialization that grants you features at certain Monk levels. For the rest of your career, you gain each of your subclass's features that are of your Monk level or lower."
      },
      {
        "level": 4,
        "name": "Ability Score Improvement",
        "description": "You gain the Ability Score Improvement feat (see \"Feats\") or another feat of your choice for which you qualify. You gain this feature again at Monk levels 8, 12, and 16."
      },
      {
        "level": 4,
        "name": "Slow Fall",
        "description": "You can take a Reaction when you fall to reduce any damage you take from the fall by an amount equal to five times your Monk level."
      },
      {
        "level": 5,
        "name": "Extra Attack",
        "description": "You can attack twice instead of once whenever you take the Attack action on your turn."
      },
      {
        "level": 5,
        "name": "Stunning Strike",
        "description": "Once per turn when you hit a creature with a Monk weapon or an Unarmed Strike, you can expend 1 Focus Point to attempt a stunning strike. The target must make a Constitution saving throw. On a failed save, the target has the Stunned condition until the start of your next turn. On a successful save, the target's Speed is halved until the start of your next turn, and the next attack roll made against the target before then has Advantage."
      },
      {
        "level": 6,
        "name": "Empowered Strikes",
        "description": "Whenever you deal damage with your Unarmed Strike, it can deal your choice of Force damage or its normal damage type."
      },
      {
        "level": 7,
        "name": "Evasion",
        "description": "When you're subjected to an effect that allows you to make a Dexterity saving throw to take only half damage, you instead take no damage if you succeed on the saving throw and only half damage if you fail. You don't benefit from this feature if you have the Incapacitated condition."
      },
      {
        "level": 9,
        "name": "Acrobatic Movement",
        "description": "While you aren't wearing armor or wielding a Shield, you gain the ability to move along vertical surfaces and across liquids on your turn without falling during the movement."
      },
      {
        "level": 10,
        "name": "Heightened Focus",
        "description": "Your Flurry of Blows, Patient Defense, and Step of the Wind gain the following benefits. Flurry of Blows. You can expend 1 Focus Point to use Flurry of Blows and make three Unarmed Strikes with it instead of two. Patient Defense. When you expend a Focus Point to use Patient Defense, you gain a number of Temporary Hit Points equal to two rolls of your Martial Arts die. Step of the Wind. When you expend a Focus Point to use Step of the Wind, you can choose a willing creature within 5 feet of yourself that is Large or smaller. You move the creature with you until the end of your turn. The creature's movement doesn't provoke Opportunity Attacks."
      },
      {
        "level": 10,
        "name": "Self-Restoration",
        "description": "Through sheer force of will, you can remove one of the following conditions from yourself at the end of each of your turns: Charmed, Frightened, or Poisoned. In addition, forgoing food and drink doesn't give you levels of Exhaustion."
      },
      {
        "level": 13,
        "name": "Deflect Energy",
        "description": "You can now use your Deflect Attacks feature against attacks that deal any damage type, not just Bludgeoning, Piercing, or Slashing."
      },
      {
        "level": 14,
        "name": "Disciplined Survivor",
        "description": "Your physical and mental discipline grant you proficiency in all saving throws. Additionally, whenever you make a saving throw and fail, you can expend 1 Focus Point to reroll it, and you must use the new roll."
      },
      {
        "level": 15,
        "name": "Perfect Focus",
        "description": "When you roll Initiative and don't use Uncanny Metabolism, you regain expended Focus Points until you have 4 if you have 3 or fewer."
      },
      {
        "level": 18,
        "name": "Superior Defense",
        "description": "At the start of your turn, you can expend 3 Focus Points to bolster yourself against harm for 1 minute or until you have the Incapacitated condition. During that time, you have Resistance to all damage except Force damage."
      },
      {
        "level": 19,
        "name": "Epic Boon",
        "description": "You gain an Epic Boon feat (see \"Feats\") or another feat of your choice for which you qualify. Boon of Irresistible Offense is recommended."
      },
      {
        "level": 20,
        "name": "Body and Mind",
        "description": "You have developed your body and mind to new heights. Your Dexterity and Wisdom scores increase by 4, to a maximum of 25."
      }
    ],
    "subclasses": [
      {
        "id": "warrior-of-the-open-hand",
        "name": "Warrior of the Open Hand",
        "features": [
          {
            "level": 3,
            "name": "Open Hand Technique",
            "description": "Whenever you hit a creature with an attack granted by your Flurry of Blows, you can impose one of the following effects on that target. Addle. The target can't make Opportunity Attacks until the start of its next turn. Push. The target must succeed on a Strength saving throw or be pushed up to 15 feet away from you. Topple. The target must succeed on a Dexterity saving throw or have the Prone condition."
          },
          {
            "level": 6,
            "name": "Wholeness of Body",
            "description": "You gain the ability to heal yourself. As a Bonus Action, you can roll your Martial Arts die. You regain a number of Hit Points equal to the number rolled plus your Wisdom modifier (minimum of 1 Hit Point regained). You can use this feature a number of times equal to your Wisdom modifier (minimum of once), and you regain all expended uses when you finish a Long Rest."
          },
          {
            "level": 11,
            "name": "Fleet Step",
            "description": "When you take a Bonus Action other than Step of the Wind, you can also use Step of the Wind immediately after that Bonus Action."
          },
          {
            "level": 17,
            "name": "Quivering Palm",
            "description": "You gain the ability to set up lethal vibrations in someone's body. When you hit a creature with an Unarmed Strike, you can expend 4 Focus Points to start these imperceptible vibrations, which last for a number of days equal to your Monk level. The vibrations are harmless unless you take an action to end them. Alternatively, when you take the Attack action on your turn, you can forgo one of the attacks to end the vibrations. To end them, you and the target must be on the same plane of existence. When you end them, the target must make a Constitution saving throw, taking 10d12 Force damage on a failed save or half as much damage on a successful one. You can have only one creature under the effect of this feature at a time. You can end the vibrations harmlessly (no action required). --- ## Additional Subclasses"
          }
        ]
      },
      {
        "id": "warrior-of-mercy",
        "name": "Warrior of Mercy",
        "features": [
          {
            "level": 3,
            "name": "Hand Of Harm",
            "description": "Once per turn when you hit a creature with an Unarmed Strike and deal damage, you can expend 1 Focus Point to deal extra Necrotic damage equal to one roll of your Martial Arts die plus your Wisdom modifier."
          },
          {
            "level": 3,
            "name": "Hand Of Healing",
            "description": "As a Magic action, you can expend 1 Focus Point to touch a creature and restore a number of Hit Points equal to a roll of your Martial Arts die plus your Wisdom modifier. When you use your Flurry of Blows, you can replace one of the Unarmed Strikes with a use of this feature without expending a Focus Point for the healing."
          },
          {
            "level": 3,
            "name": "Implements Of Mercy",
            "description": "You gain proficiency in the Insight and Medicine skills and proficiency with the Herbalism Kit."
          },
          {
            "level": 6,
            "name": "Physician’S Touch",
            "description": "Your Hand of Harm and Hand of Healing improve, as detailed below. Hand of Harm. When you use Hand of Harm on a creature, you can also give that creature the Poisoned condition until the end of your next turn. Hand of Healing. When you use Hand of Healing, you can also end one of the following conditions on the creature you heal: Blinded, Deafened, Paralyzed, Poisoned, or Stunned."
          },
          {
            "level": 11,
            "name": "Flurry Of Healing And Harm",
            "description": "When you use Flurry of Blows, you can replace each of the Unarmed Strikes with a use of Hand of Healing without expending Focus Points for the healing. In addition, when you make an Unarmed Strike with Flurry of Blows and deal damage, you can use Hand of Harm with that strike without expending a Focus Point for Hand of Harm. You can still use Hand of Harm only once per turn. You can use these benefits a total number of times equal to your Wisdom modifier (minimum of once). You regain all expended uses when you finish a Long Rest."
          },
          {
            "level": 17,
            "name": "Hand Of Ultimate Mercy",
            "description": "Your mastery of life energy opens the door to the ultimate mercy. As a Magic action, you can touch the corpse of a creature that died within the past 24 hours and expend 5 Focus Points. The creature then returns to life with a number of Hit Points equal to 4d10 plus your Wisdom modifier. If the creature died with any of the following conditions, the creature revives with the conditions removed: Blinded, Deafened, Paralyzed, Poisoned, and Stunned. Once you use this feature, you can’t use it again until you finish a Long Rest."
          }
        ]
      },
      {
        "id": "warrior-of-shadow",
        "name": "Warrior of Shadow",
        "features": [
          {
            "level": 3,
            "name": "Shadow Arts",
            "description": "You have learned to draw on the power of the Shadowfell, gaining the following benefits. Darkness. You can expend 1 Focus Point to cast the Darkness spell without spell components. You can see within the spell’s area when you cast it with this feature. While the spell persists, you can move its area of Darkness to a space within 60 feet of yourself at the start of each of your turns. Darkvision. You gain Darkvision with a range of 60 feet. If you already have Darkvision, its range increases by 60 feet. Shadowy Figments. You know the Minor Illusion spell. Wisdom is your spellcasting ability for it."
          },
          {
            "level": 6,
            "name": "Shadow Step",
            "description": "While entirely within Dim Light or Darkness, you can use a Bonus Action to teleport up to 60 feet to an unoccupied space you can see that is also in Dim Light or Darkness. You then have Advantage on the next melee attack you make before the end of the current turn."
          },
          {
            "level": 11,
            "name": "Improved Shadow Step",
            "description": "You can draw on your Shadowfell connection to empower your teleportation. When you use your Shadow Step, you can expend 1 Focus Point to remove the requirement that you must start and end in Dim Light or Darkness for that use of the feature. As part of this Bonus Action, you can make an Unarmed Strike immediately after you teleport."
          },
          {
            "level": 17,
            "name": "Cloak Of Shadows",
            "description": "As a Magic action while entirely within Dim Light or Darkness, you can expend 3 Focus Points to shroud yourself with shadows for 1 minute, until you have the Incapacitated condition, or until you end your turn in Bright Light. While shrouded by these shadows, you gain the following benefits. Invisibility. You have the Invisible condition. Partially Incorporeal. You can move through occupied spaces as if they were Difficult Terrain. If you end your turn in such a space, you are shunted to the last unoccupied space you were in. Shadow Flurry. You can use your Flurry of Blows without expending any Focus Points."
          }
        ]
      },
      {
        "id": "warrior-of-the-elements",
        "name": "Warrior of the Elements",
        "features": [
          {
            "level": 3,
            "name": "Elemental Attunement",
            "description": "At the start of your turn, you can expend 1 Focus Point to imbue yourself with elemental energy. The energy lasts for 10 minutes or until you have the Incapacitated condition. You gain the following benefits while this feature is active. Reach. When you make an Unarmed Strike, your reach is 10 feet greater than normal, as elemental energy extends from you. Elemental Strikes. Whenever you hit with your Unarmed Strike, you can cause it to deal your choice of Acid, Cold, Fire, Lightning, or Thunder damage rather than its normal damage type. When you deal one of these types with it, you can alsoforce the target to make a Strength saving throw. On a failed save, you can move the target up to 10 feet toward or away from you, as elemental energy swirls around it."
          },
          {
            "level": 3,
            "name": "Manipulate Elements",
            "description": "You know the Elementalism spell. Wisdom is your spellcasting ability for it."
          },
          {
            "level": 6,
            "name": "Elemental Burst",
            "description": "As a Magic action, you can expend 2 Focus Points to cause elemental energy to burst in a 20-foot-radius Sphere centered on a point within 120 feet of yourself. Choose a damage type: Acid, Cold, Fire, Lightning, or Thunder. Each creature in the Sphere must make a Dexterity saving throw. On a failed save, a creature takes damage of the chosen type equal to three rolls of your Martial Arts die. On a successful save, a creature takes half as much damage."
          },
          {
            "level": 11,
            "name": "Stride Of The Elements",
            "description": "While your Elemental Attunement is active, you also have a Fly Speed and a Swim Speed equal to your Speed."
          },
          {
            "level": 17,
            "name": "Elemental Epitome",
            "description": "While your Elemental Attunement is active, you also gain the following benefits. Damage Resistance. You gain Resistance to one of the following damage types of your choice: Acid, Cold, Fire, Lightning, or Thunder. At the start of each of your turns, you can change this choice. Destructive Stride. When you use your Step of the Wind, your Speed increases by 20 feet until the end of the turn. For that duration, any creature of your choice takes damage equal to one roll of your Martial Arts die when you enter a space within 5 feet of it. The damage type is your choice of Acid, Cold, Fire, Lightning, or Thunder. A creature can take this damage only once per turn. Empowered Strikes. Once on each of your turns, you can deal extra damage to a target equal to one roll of your Martial Arts die when you hit it with an Unarmed Strike. The extra damage is the same type dealt by that strike."
          }
        ]
      }
    ]
  },
  {
    "id": "paladin",
    "name": "Paladin",
    "coreTraits": {
      "Primary Ability": "Strength and Charisma",
      "Hit Point Die": "D10 per Paladin level",
      "Saving Throw Proficiencies": "Wisdom and Charisma",
      "Skill Proficiencies": "Choose 2: Athletics, Insight, Intimidation, Medicine, Persuasion, or Religion",
      "Weapon Proficiencies": "Simple and Martial weapons",
      "Armor Training": "Light, Medium, and Heavy armor and Shields",
      "Starting Equipment": "Choose A or B: (A) Chain Mail, Shield, Longsword, 6 Javelins, Holy Symbol, Priest's Pack, and 9 GP; or (B) 150 GP"
    },
    "progression": [
      {
        "level": 1,
        "features": [
          "Lay On Hands",
          "Spellcasting",
          "Weapon Mastery"
        ],
        "extras": {
          "Proficiency Bonus": "+2",
          "Prepared Spells": "2",
          "1": "2"
        }
      },
      {
        "level": 2,
        "features": [
          "Fighting Style",
          "Paladin's Smite"
        ],
        "extras": {
          "Proficiency Bonus": "+2",
          "Prepared Spells": "3",
          "1": "2"
        }
      },
      {
        "level": 3,
        "features": [
          "Channel Divinity",
          "Paladin Subclass"
        ],
        "extras": {
          "Proficiency Bonus": "+2",
          "Channel Divinity": "2",
          "Prepared Spells": "4",
          "1": "3"
        }
      },
      {
        "level": 4,
        "features": [
          "Ability Score Improvement"
        ],
        "extras": {
          "Proficiency Bonus": "+2",
          "Channel Divinity": "2",
          "Prepared Spells": "5",
          "1": "3"
        }
      },
      {
        "level": 5,
        "features": [
          "Extra Attack",
          "Faithful Steed"
        ],
        "extras": {
          "Proficiency Bonus": "+3",
          "Channel Divinity": "2",
          "Prepared Spells": "6",
          "1": "4",
          "2": "2"
        }
      },
      {
        "level": 6,
        "features": [
          "Aura of Protection"
        ],
        "extras": {
          "Proficiency Bonus": "+3",
          "Channel Divinity": "2",
          "Prepared Spells": "6",
          "1": "4",
          "2": "2"
        }
      },
      {
        "level": 7,
        "features": [
          "Subclass feature"
        ],
        "extras": {
          "Proficiency Bonus": "+3",
          "Channel Divinity": "2",
          "Prepared Spells": "7",
          "1": "4",
          "2": "3"
        }
      },
      {
        "level": 8,
        "features": [
          "Ability Score Improvement"
        ],
        "extras": {
          "Proficiency Bonus": "+3",
          "Channel Divinity": "2",
          "Prepared Spells": "7",
          "1": "4",
          "2": "3"
        }
      },
      {
        "level": 9,
        "features": [
          "Abjure Foes"
        ],
        "extras": {
          "Proficiency Bonus": "+4",
          "Channel Divinity": "2",
          "Prepared Spells": "9",
          "1": "4",
          "2": "3",
          "3": "2"
        }
      },
      {
        "level": 10,
        "features": [
          "Aura of Courage"
        ],
        "extras": {
          "Proficiency Bonus": "+4",
          "Channel Divinity": "2",
          "Prepared Spells": "9",
          "1": "4",
          "2": "3",
          "3": "2"
        }
      },
      {
        "level": 11,
        "features": [
          "Radiant Strikes"
        ],
        "extras": {
          "Proficiency Bonus": "+4",
          "Channel Divinity": "3",
          "Prepared Spells": "10",
          "1": "4",
          "2": "3",
          "3": "3"
        }
      },
      {
        "level": 12,
        "features": [
          "Ability Score Improvement"
        ],
        "extras": {
          "Proficiency Bonus": "+4",
          "Channel Divinity": "3",
          "Prepared Spells": "10",
          "1": "4",
          "2": "3",
          "3": "3"
        }
      },
      {
        "level": 13,
        "features": [],
        "extras": {
          "Proficiency Bonus": "+5",
          "Channel Divinity": "3",
          "Prepared Spells": "11",
          "1": "4",
          "2": "3",
          "3": "3",
          "4": "1"
        }
      },
      {
        "level": 14,
        "features": [
          "Restoring Touch"
        ],
        "extras": {
          "Proficiency Bonus": "+5",
          "Channel Divinity": "3",
          "Prepared Spells": "11",
          "1": "4",
          "2": "3",
          "3": "3",
          "4": "1"
        }
      },
      {
        "level": 15,
        "features": [
          "Subclass feature"
        ],
        "extras": {
          "Proficiency Bonus": "+5",
          "Channel Divinity": "3",
          "Prepared Spells": "12",
          "1": "4",
          "2": "3",
          "3": "3",
          "4": "2"
        }
      },
      {
        "level": 16,
        "features": [
          "Ability Score Improvement"
        ],
        "extras": {
          "Proficiency Bonus": "+5",
          "Channel Divinity": "3",
          "Prepared Spells": "12",
          "1": "4",
          "2": "3",
          "3": "3",
          "4": "2"
        }
      },
      {
        "level": 17,
        "features": [],
        "extras": {
          "Proficiency Bonus": "+6",
          "Channel Divinity": "3",
          "Prepared Spells": "14",
          "1": "4",
          "2": "3",
          "3": "3",
          "4": "3",
          "5": "1"
        }
      },
      {
        "level": 18,
        "features": [
          "Aura Expansion"
        ],
        "extras": {
          "Proficiency Bonus": "+6",
          "Channel Divinity": "3",
          "Prepared Spells": "14",
          "1": "4",
          "2": "3",
          "3": "3",
          "4": "3",
          "5": "1"
        }
      },
      {
        "level": 19,
        "features": [
          "Epic Boon"
        ],
        "extras": {
          "Proficiency Bonus": "+6",
          "Channel Divinity": "3",
          "Prepared Spells": "15",
          "1": "4",
          "2": "3",
          "3": "3",
          "4": "3",
          "5": "2"
        }
      },
      {
        "level": 20,
        "features": [
          "Subclass feature"
        ],
        "extras": {
          "Proficiency Bonus": "+6",
          "Channel Divinity": "3",
          "Prepared Spells": "15",
          "1": "4",
          "2": "3",
          "3": "3",
          "4": "3",
          "5": "2"
        }
      }
    ],
    "features": [
      {
        "level": 1,
        "name": "Lay On Hands",
        "description": "Your blessed touch can heal wounds. You have a pool of healing power that replenishes when you finish a Long Rest. With that pool, you can restore a total number of Hit Points equal to five times your Paladin level. As a Bonus Action, you can touch a creature (which could be yourself) and draw power from the pool of healing to restore a number of Hit Points to that creature, up to the maximum amount remaining in the pool. You can also expend 5 Hit Points from the pool of healing power to remove the Poisoned condition from the creature; those points don't also restore Hit Points to the creature."
      },
      {
        "level": 1,
        "name": "Spellcasting",
        "description": "You have learned to cast spells through prayer and meditation. See \"Spells\" for the rules on spellcasting. The information below details how you use those rules with Paladin spells, which appear in the Paladin spell list later in the class's description. Spell Slots. The Paladin Features table shows how many spell slots you have to cast your level 1+ spells. You regain all expended slots when you finish a Long Rest. Prepared Spells of Level 1+. You prepare the list of level 1+ spells that are available for you to cast with this feature. To start, choose two level 1 Paladin spells. *Heroism* and *Searing Smite* are recommended. The number of spells on your list increases as you gain Paladin levels, as shown in the Prepared Spells column of the Paladin Features table. Whenever that number increases, choose additional Paladin spells until the number of spells on your list matches the number in the Paladin Features table. The chosen spells must be of a level for which you have spell slots. For example, if you're a level 5 Paladin, your list of prepared spells can include six Paladin spells of level 1 or 2 in any combination. If another Paladin feature gives you spells that you always have prepared, those spells don't count against the number of spells you can prepare with this feature, but those spells otherwise count as Paladin spells for you. Changing Your Prepared Spells. Whenever you finish a Long Rest, you can replace one spell on your list with another Paladin spell for which you have spell slots. Spellcasting Ability. Charisma is your spellcasting ability for your Paladin spells. Spellcasting Focus. You can use a Holy Symbol as a Spellcasting Focus for your Paladin spells."
      },
      {
        "level": 1,
        "name": "Weapon Mastery",
        "description": "Your training with weapons allows you to use the mastery properties of two kinds of weapons of your choice with which you have proficiency, such as Longswords and Javelins. Whenever you finish a Long Rest, you can change the kinds of weapons you chose. For example, you could switch to using the mastery properties of Halberds and Flails."
      },
      {
        "level": 2,
        "name": "Fighting Style",
        "description": "You gain a Fighting Style feat of your choice (see \"Feats\" for feats). Instead of choosing one of those feats, you can choose the option below. Blessed Warrior. You learn two Cleric cantrips of your choice (see the Cleric class's section for a list of Cleric spells). *Guidance* and *Sacred Flame* are recommended. The chosen cantrips count as Paladin spells for you, and Charisma is your spellcasting ability for them. Whenever you gain a Paladin level, you can replace one of these cantrips with another Cleric cantrip."
      },
      {
        "level": 2,
        "name": "Paladin's Smite",
        "description": "You always have the *Divine Smite* spell prepared. In addition, you can cast it without expending a spell slot, but you must finish a Long Rest before you can cast it in this way again."
      },
      {
        "level": 3,
        "name": "Channel Divinity",
        "description": "You can channel divine energy directly from the Outer Planes, using it to fuel magical effects. You start with one such effect: Divine Sense, which is described below. Other Paladin features give additional Channel Divinity effect options. Each time you use this class's Channel Divinity, you choose which effect from this class to create. You can use this class's Channel Divinity twice. You regain one of its expended uses when you finish a Short Rest, and you regain all expended uses when you finish a Long Rest. You gain an additional use when you reach Paladin level 11. If a Channel Divinity effect requires a saving throw, the DC equals the spell save DC from this class's Spellcasting feature. Divine Sense. As a Bonus Action, you can open your awareness to detect Celestials, Fiends, and Undead. For the next 10 minutes or until you have the Incapacitated condition, you know the location of any creature of those types within 60 feet of yourself, and you know its creature type. Within the same radius, you also detect the presence of any place or object that has been consecrated or desecrated, as with the *Hallow* spell. > ### Breaking Your Oath > > A Paladin tries to hold to the highest standards of conduct, but even the most dedicated are fallible. Sometimes a Paladin transgresses their oath. > > A Paladin who has broken a vow typically seeks absolution, spending an all-night vigil as a sign of penitence or undertaking a fast. After a rite of forgiveness, the Paladin starts fresh. > > If your Paladin unrepentantly violates their oath, talk to your GM. Your Paladin should probably take a more appropriate subclass or even abandon the class and adopt another one."
      },
      {
        "level": 3,
        "name": "Paladin Subclass",
        "description": "You gain a Paladin subclass of your choice. The Oath of Devotion subclass is detailed after this class's description. A subclass is a specialization that grants you features at certain Paladin levels. For the rest of your career, you gain each of your subclass's features that are of your Paladin level or lower."
      },
      {
        "level": 4,
        "name": "Ability Score Improvement",
        "description": "You gain the Ability Score Improvement feat (see \"Feats\") or another feat of your choice for which you qualify. You gain this feature again at Paladin levels 8, 12, and 16."
      },
      {
        "level": 5,
        "name": "Extra Attack",
        "description": "You can attack twice instead of once whenever you take the Attack action on your turn."
      },
      {
        "level": 5,
        "name": "Faithful Steed",
        "description": "You can call on the aid of an otherworldly steed. You always have the *Find Steed* spell prepared. You can also cast the spell once without expending a spell slot, and you regain the ability to do so when you finish a Long Rest."
      },
      {
        "level": 6,
        "name": "Aura of Protection",
        "description": "You radiate a protective, unseeable aura in a 10-foot Emanation that originates from you. The aura is inactive while you have the Incapacitated condition. You and your allies in the aura gain a bonus to saving throws equal to your Charisma modifier (minimum bonus of +1). If another Paladin is present, a creature can benefit from only one Aura of Protection at a time; the creature chooses which aura while in them."
      },
      {
        "level": 9,
        "name": "Abjure Foes",
        "description": "As a Magic action, you can expend one use of this class's Channel Divinity to overwhelm foes with awe. As you present your Holy Symbol or weapon, you can target a number of creatures equal to your Charisma modifier (minimum of one creature) that you can see within 60 feet of yourself. Each target must succeed on a Wisdom saving throw or have the Frightened condition for 1 minute or until it takes any damage. While Frightened in this way, a target can do only one of the following on its turns: move, take an action, or take a Bonus Action."
      },
      {
        "level": 10,
        "name": "Aura of Courage",
        "description": "You and your allies have Immunity to the Frightened condition while in your Aura of Protection. If a Frightened ally enters the aura, that condition has no effect on that ally while there."
      },
      {
        "level": 11,
        "name": "Radiant Strikes",
        "description": "Your strikes now carry supernatural power. When you hit a target with an attack roll using a Melee weapon or an Unarmed Strike, the target takes an extra 1d8 Radiant damage."
      },
      {
        "level": 14,
        "name": "Restoring Touch",
        "description": "When you use Lay On Hands on a creature, you can also remove one or more of the following conditions from the creature: Blinded, Charmed, Deafened, Frightened, Paralyzed, or Stunned. You must expend 5 Hit Points from the healing pool of Lay On Hands for each of these conditions you remove; those points don't also restore Hit Points to the creature."
      },
      {
        "level": 18,
        "name": "Aura Expansion",
        "description": "Your Aura of Protection is now a 30-foot Emanation."
      },
      {
        "level": 19,
        "name": "Epic Boon",
        "description": "You gain an Epic Boon feat (see \"Feats\") or another feat of your choice for which you qualify. Boon of Truesight is recommended."
      }
    ],
    "subclasses": [
      {
        "id": "oath-of-devotion",
        "name": "Oath of Devotion",
        "features": [
          {
            "level": 3,
            "name": "Oath of Devotion Spells",
            "description": "The magic of your oath ensures you always have certain spells ready; when you reach a Paladin level specified in the Oath of Devotion Spells table, you thereafter always have the listed spells prepared. Table: Oath of Devotion Spells | Paladin Level | Spells | |---------------|---------------------------------------------------| | 3 | Protection from Evil and Good, Shield of Faith | | 5 | Aid, Zone of Truth | | 9 | Beacon of Hope, Dispel Magic | | 13 | Freedom of Movement, Guardian of Faith | | 17 | Commune, Flame Strike |"
          },
          {
            "level": 3,
            "name": "Sacred Weapon",
            "description": "When you take the Attack action, you can expend one use of your Channel Divinity to imbue one Melee weapon that you are holding with positive energy. For 10 minutes or until you use this feature again, you add your Charisma modifier to attack rolls you make with that weapon (minimum bonus of +1), and each time you hit with it, you cause it to deal its normal damage type or Radiant damage. The weapon also emits Bright Light in a 20-foot radius and Dim Light 20 feet beyond that. You can end this effect early (no action required). This effect also ends if you aren't carrying the weapon."
          },
          {
            "level": 7,
            "name": "Aura of Devotion",
            "description": "You and your allies have Immunity to the Charmed condition while in your Aura of Protection. If a Charmed ally enters the aura, that condition has no effect on that ally while there."
          },
          {
            "level": 15,
            "name": "Smite of Protection",
            "description": "Your magical smite now radiates protective energy. Whenever you cast *Divine Smite*, you and your allies have Half Cover while in your Aura of Protection. The aura has this benefit until the start of your next turn."
          },
          {
            "level": 20,
            "name": "Holy Nimbus",
            "description": "As a Bonus Action, you can imbue your Aura of Protection with holy power, granting the benefits below for 10 minutes or until you end them (no action required). Once you use this feature, you can't use it again until you finish a Long Rest. You can also restore your use of it by expending a level 5 spell slot (no action required). Holy Ward. You have Advantage on any saving throw you are forced to make by a Fiend or an Undead. Radiant Damage. Whenever an enemy starts its turn in the aura, that creature takes Radiant damage equal to your Charisma modifier plus your Proficiency Bonus. Sunlight. The aura is filled with Bright Light that is sunlight. --- ## Additional Subclasses"
          }
        ]
      },
      {
        "id": "oath-of-glory",
        "name": "Oath of Glory",
        "features": [
          {
            "level": 3,
            "name": "Inspiring Smite",
            "description": "Immediately after you cast Divine Smite, you can expend one use of your Channel Divinity and distribute Temporary Hit Points to creatures of your choice within 30 feet of yourself, which can include you. The total number of Temporary Hit Points equals 2d8 plus your Paladin level, divided among the chosen creatures however you like."
          },
          {
            "level": 3,
            "name": "Oath Of Glory Spells.",
            "description": "The magic of your oath ensures you always have certain spells ready; when you reach a Paladin level specified in the Oath of Glory Spells table, you thereafter always have the listed spells prepared. Table: Oath of Glory Spells | Paladin Level | Spells | | --- | --- | | 3 | Guiding Bolt, Heroism | | 5 | Enhance Ability, Magic Weapon | | 9 | Haste, Protection from Energy | | 13 | Compulsion, Freedom of Movement | | 17 | Legend Lore, Yolande's Regal Presence |"
          },
          {
            "level": 3,
            "name": "Peerless Athlete",
            "description": "As a Bonus Action, you can expend one use of your Channel Divinity to augment your athleticism. For 1 hour, you have Advantage on Strength (Athletics) and Dexterity (Acrobatics) checks, and the distance of your Long and High Jumps increases by 10 feet (this extra distance costs movement as normal)."
          },
          {
            "level": 7,
            "name": "Aura Of Alacrity",
            "description": "Your Speed increases by 10 feet. In addition, whenever an ally enters your Aura of Protection for the first time on a turn or starts their turn there, the ally's Speed increases by 10 feet until the end of their next turn."
          },
          {
            "level": 15,
            "name": "Glorious Defense",
            "description": "You can turn defense into a sudden strike. When you or another creature you can see within 10 feet of you is hit by an attack roll, you can take a Reaction to grant a bonus to the target's AC against that attack, potentially causing it to miss. The bonus equals your Charisma modifier (minimum of +1). If the attack misses, you can make one attack with a weapon against the attacker as part of this Reaction if the attacker is within your weapon's range. You can use this feature a number of times equal to your Charisma modifier (minimum of once), and you regain all expended uses when you finish a Long Rest."
          },
          {
            "level": 20,
            "name": "Living Legend",
            "description": "You can empower yourself with the legends - whether true or exaggerated - of your great deeds. As a Bonus Action, you gain the benefits below for 10 minutes. Once you use this feature, you can't use it again until you finish a Long Rest. You can also restore your use of it by expending a level 5 spell slot (no action required). Charismatic. You are blessed with an otherworldly presence and have Advantage on all Charisma checks. Saving Throw Reroll. If you fail a saving throw, you can take a Reaction to reroll it. You must use this new roll. Unerring Strike. Once on each of your turns when you make an attack roll with a weapon and miss, you can cause that attack to hit instead."
          }
        ]
      },
      {
        "id": "oath-of-the-ancients",
        "name": "Oath of the Ancients",
        "features": [
          {
            "level": 3,
            "name": "Nature'S Wrath",
            "description": "As a Magic action, you can expend one of your uses of Channel Divinity to conjure spectral vines around nearby creatures. Each creature of your choice that you can see within 15 feet of yourself must succeed on a Strength saving throw or have the Restrained condition for 1 minute. A Restrained creature repeats the save at the end of each of its turns, ending the effect on a success."
          },
          {
            "level": 3,
            "name": "Oath Of The Ancients Spells",
            "description": "The magic of your oath ensures you always have certain spells ready; when you reach a Paladin level specified in the Oath of the Ancients Spells table, you thereafter always have the listed spells prepared. Table: Oath of the Ancients Spells | Paladin Level | Spells | | --- | --- | | 3 | Ensnaring Strike, Speak with Animals | | 5 | Misty Step, Moonbeam | | 9 | Plant Growth, Protection from Energy | | 13 | Ice Storm, Stoneskin | | 17 | Commune with Nature, Tree Stride |"
          },
          {
            "level": 7,
            "name": "Aura Of Warding",
            "description": "Ancient magic lies so heavily upon you that it forms an eldritch ward, blunting energy from beyond the Material Plane; you and your allies have Resistance to Necrotic, Psychic and Radiant damage while in your Aura of Protection."
          },
          {
            "level": 15,
            "name": "Undying Sentinel",
            "description": "When you are reduced to 0 Hit Points and not killed outright, you can drop to 1 Hit Point instead, and regain a number of Hit Points equal to three times your Paladin level. Once you use this feature, you can't do so again until you finish a Long Rest. Additionally, you can't be aged magically, and you cease visibly aging."
          },
          {
            "level": 20,
            "name": "Elder Champion",
            "description": "As a Bonus Action, you can imbue your Aura of Protection with primal power, granting the benefits below for 1 minute or until you end them (no action required). Once you use this feature, you can't use it again until you finish a Long Rest. You can also restore your use of it by expending a level 5 spell slot (no action required). Diminish Defiance. Enemies in the aura have Disadvantage on saving throws against your spells and Channel Divinity options. Regeneration. At the start of each of your turns, you regain 10 Hit Points. Swift Spells. Whenever you cast a spell that has a casting time of an action, you can cast it using a Bonus Action instead."
          }
        ]
      },
      {
        "id": "oath-of-the-noble-genies",
        "name": "Oath of the Noble Genies",
        "features": [
          {
            "level": 3,
            "name": "Elemental Smite",
            "description": "Immediately after you cast Divine Smite, you can expend one use of your Channel Divinity and invoke one of the following effects. Dao’s Crush. Earth rises up around the target of your Divine Smite. The target has the Grappled condition (escape DC equal to your spell save DC). While Grappled, the target has the Restrained condition. Djinni’s Escape. You teleport to an unoccupied space you can see within 30 feet of yourself and take on a semi-incorporeal form, which lasts until the end of your next turn. While in this form, you have Resistance to Bludgeoning, Piercing, and Slashing damage, and you have Immunity to the Grappled, Prone, and Restrained conditions. Efreeti’s Fury. The target of your Divine Smite takes an extra 2d4 Fire damage, and fire jumps from the target to another creature you can see within 30 feet of yourself. The second creature also takes 2d4 Fire damage. Marid’s Surge. The target of your Divine Smite and each creature of your choice in a 10-foot Emanation originating from you make a Strength saving throw against your spell save DC. On a failed save, a creature is pushed 15 feet straight away from you and has the Prone condition."
          },
          {
            "level": 3,
            "name": "Genie Spells",
            "description": "When you reach a Paladin level specified in the Genie Spells table, you thereafter always have the listed spells prepared Table: Genie Spells | Paladin Level | Spells | | --- | --- | | 3 | Chromatic Orb, Elementalism, Thunderous Smite | | 5 | Mirror Image, Phantasmal Force | | 9 | Fly, Gaseous Form | | 13 | Conjure Minor Elementals, Summon Elemental | | 17 | Banishing Smite, Contact Other Plane |"
          },
          {
            "level": 3,
            "name": "Genie'S Splendor",
            "description": "When you aren’t wearing any armor, your base Armor Class equals 10 plus your Dexterity and Charisma modifiers. You can use a Shield and still gain this benefit. You also gain proficiency in one of the following skills of your choice: Acrobatics, Intimidation, Performance, or Persuasion."
          },
          {
            "level": 7,
            "name": "Aura Of Elemental Shielding",
            "description": "Choose one of the following damage types: Acid, Cold, Fire, Lightning, or Thunder. You and your allies have Resistance to that damage type while in your Aura of Protection. At the start of each of your turns, you can change the damage type affected by this feature to one of the other listed options (no action required)."
          },
          {
            "level": 15,
            "name": "Elemental Rebuke",
            "description": "When you are hit by an attack roll, you can take a Reaction to halve the attack’s damage against yourself (round down) and force the attacker to make a Dexterity saving throw against your spell save DC. On a failed save, the attacker takes damage equal to 2d10 plus your Charisma modifier of one of the following types (your choice): Acid, Cold, Fire, Lightning, or Thunder. On a successful save, the attacker takes half as much damage. You can use this feature a number of times equal to your Charisma modifier (minimum of once), and you regain all expended uses when you finish a Long Rest."
          },
          {
            "level": 20,
            "name": "Noble Scion",
            "description": "As a Bonus Action, you gain the benefits below for 10 minutes or until you end them (no action required). Once you use this feature, you can’t use it again until you finish a Long Rest. You can also restore your use of it by expending a level 5 spell slot (no action required). Flight. You have a Fly Speed of 60 feet and can hover. Minor Wish. When you or an ally in your Aura of Protection fails a D20 Test, you can take a Reaction to make you or that ally succeed instead."
          }
        ]
      },
      {
        "id": "oath-of-vengeance",
        "name": "Oath of Vengeance",
        "features": [
          {
            "level": 3,
            "name": "Oath Of Vengeance Spells",
            "description": "The magic of your oath ensures you always have certain spells ready; when you reach a Paladin level specified in the Oath of Vengeance Spells table, you thereafter always have the listed spells prepared. Table: Oath of Vengeance Spells | Paladin Level | Spells | | --- | --- | | 3 | Bane, Hunter's Mark | | 5 | Hold Person, Misty Step | | 9 | Haste, Protection from Energy | | 13 | Banishment, Dimension Door | | 17 | Hold Monster, Scrying |"
          },
          {
            "level": 3,
            "name": "Vow Of Enmity",
            "description": "When you take the Attack action, you can expend one use of your Channel Divinity to utter a vow of enmity against a creature you can see within 30 feet of yourself. You have Advantage on attack rolls against the creature for 1 minute or until you use this feature again. If the creature drops to 0 Hit Points before the vow ends, you can transfer the vow to a different creature within 30 feet of yourself (no action required)."
          },
          {
            "level": 7,
            "name": "Relentless Avenger",
            "description": "Your supernatural focus helps you close off a foe's retreat. When you hit a creature with an Opportunity Attack, you can reduce the creature's Speed to 0 until the end of the current turn. You can then move up to half your Speed as part of the same Reaction. This movement doesn't provoke Opportunity Attacks."
          },
          {
            "level": 15,
            "name": "Soul Of Vengeance",
            "description": "Immediately after a creature under the effect of your Vow of Enmity hits or misses with an attack roll, you can take a Reaction to make a melee attack against that creature if it's within range."
          },
          {
            "level": 20,
            "name": "Avenging Angel",
            "description": "As a Bonus Action, you gain the benefits below for 10 minutes or until you end them (no action required). Once you use this feature, you can't use it again until you finish a Long Rest. You can also restore your use of it by expending a level 5 spell slot (no action required). Flight. You sprout spectral wings on your back and have a Fly Speed of 60 feet, and can hover. Frightful Aura. Whenever an enemy starts its turn in your Aura of Protection, that creature must succeed on a Wisdom saving throw or have the Frightened condition for 1 minute or until it takes any damage. Attack rolls against the Frightened creature have Advantage."
          }
        ]
      }
    ]
  },
  {
    "id": "ranger",
    "name": "Ranger",
    "coreTraits": {
      "Primary Ability": "Dexterity and Wisdom",
      "Hit Point Die": "D10 per Ranger level",
      "Saving Throw Proficiencies": "Strength and Dexterity",
      "Skill Proficiencies": "Choose 3: Animal Handling, Athletics, Insight, Investigation, Nature, Perception, Stealth, or Survival",
      "Weapon Proficiencies": "Simple and Martial weapons",
      "Armor Training": "Light and Medium armor and Shields",
      "Starting Equipment": "Choose A or B: (A) Studded Leather Armor, Scimitar, Shortsword, Longbow, 20 Ar rows, Quiver, Druidic Focus (sprig of mistletoe), Explorer's Pack, and 7 GP; or (B) 150 GP"
    },
    "progression": [
      {
        "level": 1,
        "features": [
          "Spellcasting",
          "Favored Enemy",
          "Weapon Mastery"
        ],
        "extras": {
          "Proficiency Bonus": "+2",
          "Favored Enemy": "2",
          "Prepared Spells": "2",
          "1": "2"
        }
      },
      {
        "level": 2,
        "features": [
          "Deft Explorer",
          "Fighting Style"
        ],
        "extras": {
          "Proficiency Bonus": "+2",
          "Favored Enemy": "2",
          "Prepared Spells": "3",
          "1": "2"
        }
      },
      {
        "level": 3,
        "features": [
          "Ranger Subclass"
        ],
        "extras": {
          "Proficiency Bonus": "+2",
          "Favored Enemy": "2",
          "Prepared Spells": "4",
          "1": "3"
        }
      },
      {
        "level": 4,
        "features": [
          "Ability Score Improvement"
        ],
        "extras": {
          "Proficiency Bonus": "+2",
          "Favored Enemy": "2",
          "Prepared Spells": "5",
          "1": "3"
        }
      },
      {
        "level": 5,
        "features": [
          "Extra Attack"
        ],
        "extras": {
          "Proficiency Bonus": "+3",
          "Favored Enemy": "3",
          "Prepared Spells": "6",
          "1": "4",
          "2": "2"
        }
      },
      {
        "level": 6,
        "features": [
          "Roving"
        ],
        "extras": {
          "Proficiency Bonus": "+3",
          "Favored Enemy": "3",
          "Prepared Spells": "6",
          "1": "4",
          "2": "2"
        }
      },
      {
        "level": 7,
        "features": [
          "Subclass feature"
        ],
        "extras": {
          "Proficiency Bonus": "+3",
          "Favored Enemy": "3",
          "Prepared Spells": "7",
          "1": "4",
          "2": "3"
        }
      },
      {
        "level": 8,
        "features": [
          "Ability Score Improvement"
        ],
        "extras": {
          "Proficiency Bonus": "+3",
          "Favored Enemy": "3",
          "Prepared Spells": "7",
          "1": "4",
          "2": "3"
        }
      },
      {
        "level": 9,
        "features": [
          "Expertise"
        ],
        "extras": {
          "Proficiency Bonus": "+4",
          "Favored Enemy": "4",
          "Prepared Spells": "9",
          "1": "4",
          "2": "3",
          "3": "2"
        }
      },
      {
        "level": 10,
        "features": [
          "Tireless"
        ],
        "extras": {
          "Proficiency Bonus": "+4",
          "Favored Enemy": "4",
          "Prepared Spells": "9",
          "1": "4",
          "2": "3",
          "3": "2"
        }
      },
      {
        "level": 11,
        "features": [
          "Subclass feature"
        ],
        "extras": {
          "Proficiency Bonus": "+4",
          "Favored Enemy": "4",
          "Prepared Spells": "10",
          "1": "4",
          "2": "3",
          "3": "3"
        }
      },
      {
        "level": 12,
        "features": [
          "Ability Score Improvement"
        ],
        "extras": {
          "Proficiency Bonus": "+4",
          "Favored Enemy": "4",
          "Prepared Spells": "10",
          "1": "4",
          "2": "3",
          "3": "3"
        }
      },
      {
        "level": 13,
        "features": [
          "Relentless Hunter"
        ],
        "extras": {
          "Proficiency Bonus": "+5",
          "Favored Enemy": "5",
          "Prepared Spells": "11",
          "1": "4",
          "2": "3",
          "3": "3",
          "4": "1"
        }
      },
      {
        "level": 14,
        "features": [
          "Nature's Veil"
        ],
        "extras": {
          "Proficiency Bonus": "+5",
          "Favored Enemy": "5",
          "Prepared Spells": "11",
          "1": "4",
          "2": "3",
          "3": "3",
          "4": "1"
        }
      },
      {
        "level": 15,
        "features": [
          "Subclass feature"
        ],
        "extras": {
          "Proficiency Bonus": "+5",
          "Favored Enemy": "5",
          "Prepared Spells": "12",
          "1": "4",
          "2": "3",
          "3": "3",
          "4": "2"
        }
      },
      {
        "level": 16,
        "features": [
          "Ability Score Improvement"
        ],
        "extras": {
          "Proficiency Bonus": "+5",
          "Favored Enemy": "5",
          "Prepared Spells": "12",
          "1": "4",
          "2": "3",
          "3": "3",
          "4": "2"
        }
      },
      {
        "level": 17,
        "features": [
          "Precise Hunter"
        ],
        "extras": {
          "Proficiency Bonus": "+6",
          "Favored Enemy": "6",
          "Prepared Spells": "14",
          "1": "4",
          "2": "3",
          "3": "3",
          "4": "3",
          "5": "1"
        }
      },
      {
        "level": 18,
        "features": [
          "Feral Senses"
        ],
        "extras": {
          "Proficiency Bonus": "+6",
          "Favored Enemy": "6",
          "Prepared Spells": "14",
          "1": "4",
          "2": "3",
          "3": "3",
          "4": "3",
          "5": "1"
        }
      },
      {
        "level": 19,
        "features": [
          "Epic Boon"
        ],
        "extras": {
          "Proficiency Bonus": "+6",
          "Favored Enemy": "6",
          "Prepared Spells": "15",
          "1": "4",
          "2": "3",
          "3": "3",
          "4": "3",
          "5": "2"
        }
      },
      {
        "level": 20,
        "features": [
          "Foe Slayer"
        ],
        "extras": {
          "Proficiency Bonus": "+6",
          "Favored Enemy": "6",
          "Prepared Spells": "15",
          "1": "4",
          "2": "3",
          "3": "3",
          "4": "3",
          "5": "2"
        }
      }
    ],
    "features": [
      {
        "level": 1,
        "name": "Spellcasting",
        "description": "You have learned to channel the magical essence of nature to cast spells. See \"Spells\" for the rules on spellcasting. The information below details how you use those rules with Ranger spells, which appear in the Ranger spell list later in the class's description. Spell Slots. The Ranger Features table shows how many spell slots you have to cast your level 1+ spells. You regain all expended slots when you finish a Long Rest. Prepared Spells of Level 1+. You prepare the list of level 1+ spells that are available for you to cast with this feature. To start, choose two level 1 Ranger spells. *Cure Wounds* and *Ensnaring Strike* are recommended. The number of spells on your list increases as you gain Ranger levels, as shown in the Prepared Spells column of the Ranger Features table. Whenever that number increases, choose additional Ranger spells until the number of spells on your list matches the number in the Ranger Features table. The chosen spells must be of a level for which you have spell slots. For example, if you're a level 5 Ranger, your list of prepared spells can include six Ranger spells of level 1 or 2 in any combination. If another Ranger feature gives you spells that you always have prepared, those spells don't count against the number of spells you can prepare with this feature, but those spells otherwise count as Ranger spells for you. Changing Your Prepared Spells. Whenever you finish a Long Rest, you can replace one spell on your list with another Ranger spell for which you have spell slots. Spellcasting Ability. Wisdom is your spellcasting ability for your Ranger spells. Spellcasting Focus. You can use a Druidic Focus as a Spellcasting Focus for your Ranger spells."
      },
      {
        "level": 1,
        "name": "Favored Enemy",
        "description": "You always have the *Hunter's Mark* spell prepared. You can cast it twice without expending a spell slot, and you regain all expended uses of this ability when you finish a Long Rest. The number of times you can cast the spell without a spell slot increases when you reach certain Ranger levels, as shown in the Favored Enemy column of the Ranger Features table."
      },
      {
        "level": 1,
        "name": "Weapon Mastery",
        "description": "Your training with weapons allows you to use the mastery properties of two kinds of weapons of your choice with which you have proficiency, such as Longbows and Shortswords. Whenever you finish a Long Rest, you can change the kinds of weapons you chose. For example, you could switch to using the mastery properties of Scimitars and Longswords."
      },
      {
        "level": 2,
        "name": "Deft Explorer",
        "description": "Thanks to your travels, you gain the following benefits. Expertise. Choose one of your skill proficiencies with which you lack Expertise. You gain Expertise in that skill. Languages. You know two languages of your choice from the language tables in \"Character Creation.\""
      },
      {
        "level": 2,
        "name": "Fighting Style",
        "description": "You gain a Fighting Style feat of your choice (see \"Feats\"). Instead of choosing one of those feats, you can choose the option below. Druidic Warrior. You learn two Druid cantrips of your choice (see the Druid class's section for a list of Druid spells). *Guidance* and *Starry Wisp* are recommended. The chosen cantrips count as Ranger spells for you, and Wisdom is your spellcasting ability for them. Whenever you gain a Ranger level, you can replace one of these cantrips with another Druid cantrip."
      },
      {
        "level": 3,
        "name": "Ranger Subclass",
        "description": "You gain a Ranger subclass of your choice. The Hunter subclass is detailed after this class's description. A subclass is a specialization that grants you features at certain Ranger levels. For the rest of your career, you gain each of your subclass's features that are of your Ranger level or lower."
      },
      {
        "level": 4,
        "name": "Ability Score Improvement",
        "description": "You gain the Ability Score Improvement feat (see \"Feats\") or another feat of your choice for which you qualify. You gain this feature again at Ranger levels 8, 12, and 16."
      },
      {
        "level": 5,
        "name": "Extra Attack",
        "description": "You can attack twice instead of once whenever you take the Attack action on your turn."
      },
      {
        "level": 6,
        "name": "Roving",
        "description": "Your Speed increases by 10 feet while you aren't wearing Heavy armor. You also have a Climb Speed and a Swim Speed equal to your Speed."
      },
      {
        "level": 9,
        "name": "Expertise",
        "description": "Choose two of your skill proficiencies with which you lack Expertise. You gain Expertise in those skills."
      },
      {
        "level": 10,
        "name": "Tireless",
        "description": "Primal forces now help fuel you on your journeys, granting you the following benefits. Temporary Hit Points. As a Magic action, you can give yourself a number of Temporary Hit Points equal to 1d8 plus your Wisdom modifier (minimum of 1). You can use this action a number of times equal to your Wisdom modifier (minimum of once), and you regain all expended uses when you finish a Long Rest. Decrease Exhaustion. Whenever you finish a Short Rest, your Exhaustion level, if any, decreases by 1."
      },
      {
        "level": 13,
        "name": "Relentless Hunter",
        "description": "Taking damage can't break your Concentration on *Hunter's Mark*."
      },
      {
        "level": 14,
        "name": "Nature's Veil",
        "description": "You invoke spirits of nature to magically hide yourself. As a Bonus Action, you can give yourself the Invisible condition until the end of your next turn. You can use this feature a number of times equal to your Wisdom modifier (minimum of once), and you regain all expended uses when you finish a Long Rest."
      },
      {
        "level": 17,
        "name": "Precise Hunter",
        "description": "You have Advantage on attack rolls against the creature currently marked by your *Hunter's Mark*."
      },
      {
        "level": 18,
        "name": "Feral Senses",
        "description": "Your connection to the forces of nature grants you Blindsight with a range of 30 feet."
      },
      {
        "level": 19,
        "name": "Epic Boon",
        "description": "You gain an Epic Boon feat (see \"Feats\") or another feat of your choice for which you qualify. Boon of Dimensional Travel is recommended."
      },
      {
        "level": 20,
        "name": "Foe Slayer",
        "description": "The damage die of your *Hunter's Mark* is a d10 rather than a d6."
      }
    ],
    "subclasses": [
      {
        "id": "hunter",
        "name": "Hunter",
        "features": [
          {
            "level": 3,
            "name": "Hunter's Lore",
            "description": "You can call on the forces of nature to reveal certain strengths and weaknesses of your prey. While a creature is marked by your *Hunter's Mark*, you know whether that creature has any Immunities, Resistances, or Vulnerabilities, and if the creature has any, you know what they are."
          },
          {
            "level": 3,
            "name": "Hunter's Prey",
            "description": "You gain one of the following feature options of your choice. Whenever you finish a Short or Long Rest, you can replace the chosen option with the other one. Colossus Slayer. Your tenacity can wear down even the most resilient foes. When you hit a creature with a weapon, the weapon deals an extra 1d8 damage to the target if it's missing any of its Hit Points. You can deal this extra damage only once per turn. Horde Breaker. Once on each of your turns when you make an attack with a weapon, you can make another attack with the same weapon against a different creature that is within 5 feet of the original target, that is within the weapon's range, and that you haven't attacked this turn."
          },
          {
            "level": 7,
            "name": "Defensive Tactics",
            "description": "You gain one of the following feature options of your choice. Whenever you finish a Short or Long Rest, you can replace the chosen option with the other one. Escape the Horde. Opportunity Attacks have Disadvantage against you. Multiattack Defense. When a creature hits you with an attack roll, that creature has Disadvantage on all other attack rolls against you this turn."
          },
          {
            "level": 11,
            "name": "Superior Hunter's Prey",
            "description": "Once per turn when you deal damage to a creature marked by your *Hunter's Mark*, you can also deal that spell's extra damage to a different creature that you can see within 30 feet of the first creature."
          },
          {
            "level": 15,
            "name": "Superior Hunter's Defense",
            "description": "When you take damage, you can take a Reaction to give yourself Resistance to that damage and any other damage of the same type until the end of the current turn. --- ## Additional Subclasses"
          }
        ]
      },
      {
        "id": "beast-master",
        "name": "Beast Master",
        "features": [
          {
            "level": 3,
            "name": "Primal Companion",
            "description": "You magically summon a primal beast, which draws strength from your bond with nature. Choose its stat block: Beast of the Land, Beast of the Sea or Beast of the Sky. You also determine the kind of animal it is, choosing a kind appropriate for the stat block. Whatever beast you choose, it bears primal markings indicating its supernatural origin. The Beast in Combat. In Combat, the beast acts during your turn. It can move and use its Reaction on its own, but the only action it takes is the Dodge action unless you take a Bonus Action to command it to take an action in its stat block or some other action. You can also sacrifice one of your attacks when you take the Attack action to command the beast to take the Beast's Strike action. If you have the Incapacitated condition, the beast acts on its own and isn't limited to the dodge action. Restoring or Replacing the Beast. If the beast has died within the last hour, you can take a Magic action to touch it and expend a spell slot. The beast returns to life after 1 minute with all its Hit Points restored. Whenever you finish a Long Rest, you can summon a different primal beast, which appears in an unoccupied space within 5 feet of you. You choose its stat block and appearance. If you already have a beast from this feature, the old one vanishes when the new one appears. Beast of the Land Beast of the Land Medium Beast, Neutral Armor Class: 13 plus your Wisdom modifier Hit Points: 5 + five times your ranger level (the beast has a number of hit dice [d8s] equal to your ranger level) Speed: 40 ft., Climb 40 ft | STR (Mod/Save) | DEX (Mod/Save) | CON (Mod/Save) | INT (Mod/Save) | WIS (Mod/Save) | CHA (Mod/Save) | | --- | --- | --- | --- | --- | --- | | 14 (+2/+2) | 14 (+2/+2) | 15 (+2/+2) | 8 (−1/-1) | 14 (+2/+2) | 11 (+0/+0) |…"
          },
          {
            "level": 7,
            "name": "Exceptional Training",
            "description": "When you take a Bonus Action to command your Primal Companion beast to take an action, you can also command it to take the Dash, Disengage, Dodge, or Help action using its Bonus Action. In addition, whenever it hits with an attack roll and deals damage, it can deal your choice of Force damage or its normal damage type."
          },
          {
            "level": 11,
            "name": "Bestial Fury",
            "description": "When you command your Primal Companion beast to take the Beast's Strike action, the beast can use it twice. In addition, the first time each turn it hits a creature under the effect of your Hunter's Mark spell, the beast deals extra Force damage equal to the bonus damage of that spell."
          },
          {
            "level": 15,
            "name": "Share Spells",
            "description": "When you cast a spell targeting yourself, you can also affect your Primal Companion beast with the spell if the beast is within 30 feet of you."
          }
        ]
      },
      {
        "id": "fey-wanderer",
        "name": "Fey Wanderer",
        "features": [
          {
            "level": 3,
            "name": "Dreadful Strikes",
            "description": "You can augment your weapon strikes with mind-scarring magic drawn from the murky hollows of the Feywild. When you hit a creature with a weapon, you can deal an extra 1d4 Psychic damage to the target, which can take this extra damage only once per turn. The extra damage increases to 1d6 when you reach Ranger level 11."
          },
          {
            "level": 3,
            "name": "Fey Wanderer Spells",
            "description": "When you reach a Ranger level specified in the Fey Wanderer spells table, you thereafter always have the listed spells prepared. Table: Fey Wanderer Spells | Ranger Level | Spell | | --- | --- | | 3 | Charm Person | | 5 | Misty Step | | 9 | Summon Fey | | 13 | Dimension Door | | 17 | Mislead | You also possess a fey blessing. Choose it from the Feywild Gifts table or determine it randomly. Feywild Gifts | 1d6 | Gift | | --- | --- | | 1 | Illusory butterflies flutter around you while you take a Short or Long Rest. | | 2 | Flowers bloom from your hair each dawn. | | 3 | You faintly smell of cinnamon, lavender, nutmeg, or another comforting herb or spice. | | 4 | Your shadow dances while no one is looking directly at it. | | 5 | Horns or antlers sprout from your head. | | 6 | Your skin and hair change color each dawn. |"
          },
          {
            "level": 3,
            "name": "Otherworldly Glamour.",
            "description": "Whenever you make a Charisma check, you gain a bonus to the check equal to your Wisdom modifier (Minimum of +1). You also gain proficiency in one of these skills of your choice: Deception, Performance, or Persuasion."
          },
          {
            "level": 7,
            "name": "Beguiling Twist",
            "description": "The magic of the Feywild guards your mind. You have advantage on saving throws to avoid or end the Charmed or Frightened condition. In addition, whenever you or a creature you can see within 120 feet of you succeeds on a saving throw to avoid or end the Charmed or Frightened condition, you can take a Reaction toforce a different creature you can see within 120 feet of yourself to make a Wisdom save against your spell save DC. On a failed save, the target is charmed or frightened (your choice) for 1 minute. The target repeats the save at the end of each of its turns, ending the effect on itself on a success."
          },
          {
            "level": 11,
            "name": "Fey Reinforcements",
            "description": "You can cast Summon Fey without a Material component. You can also cast it once without a spell slot, and you regain the ability to cast it in this way when you finish a Long Rest. Whenever you start casting the spell, you can modify it so that it doesn't require Concentration. If you do so, the spell's duration becomes 1 minute for the casting."
          },
          {
            "level": 15,
            "name": "Misty Wanderer",
            "description": "You can cast Misty Step without expending a spell slot. You can do so a number of times equal to your Wisdom modifier (minimum of once), and you regain all expended uses when you finish a Long Rest. In addition, whenever you cast Misty Step, you can bring along one willing creature you can see within 5 feet of yourself. That creature teleports to an unoccupied space of your choice within 5 feet of your destination space."
          }
        ]
      },
      {
        "id": "gloom-stalker",
        "name": "Gloom Stalker",
        "features": [
          {
            "level": 3,
            "name": "Dread Ambusher",
            "description": "You have mastered the art of creating fearsome ambushes, granting you the following benefits. Ambusher's Leap. At the start of your first turn of each combat, your speed increases by 10 feet until the end of that turn. Dreadful Strike. When you attack a creature and hit it with a weapon, you can deal an extra 2d6 Psychic damage. You can use this benefit only once per turn, you can use it a number of times equal to your Wisdom modifier (minimum of once), and you regain all expended uses when you finish a Long Rest. Initiative Bonus. When you roll Initiative, you can add your Wisdom modifier to the roll."
          },
          {
            "level": 3,
            "name": "Gloom Stalker Spells",
            "description": "When you reach a Ranger level specified in the Gloom Stalker spells table, you thereafter always have the listed spells prepared. Table: Gloom Stalker Spells | Ranger Level | Spells | | --- | --- | | 3 | Disguise Self | | 5 | Rope Trick | | 9 | Fear | | 13 | Greater Invisibility | | 17 | Seeming |"
          },
          {
            "level": 3,
            "name": "Umbral Sight",
            "description": "You gain Darkvision with a range of 60 feet. If you already have Darkvision when you gain this feature, its range increases by 60 feet. You are also adept at evading creatures that rely on Darkvision. While entirely in Darkness, you have the Invisible condition to any creature that relies on Darkvision to see you in that Darkness."
          },
          {
            "level": 7,
            "name": "Iron Mind",
            "description": "You have honed your ability to resist mind-altering powers. You gain proficiency in Wisdom saving throws. If you already have this proficiency, you instead gain proficiency in Intelligence or Charisma saving throws (your choice)."
          },
          {
            "level": 11,
            "name": "Stalker'S Flurry",
            "description": "The Psychic damage of your Dreadful Strike becomes 2d8. In addition, when you use the Dreadful Strike effect of your Dread Ambusher feature, you can use one of the following additional effects. Sudden Strike. You can make another attack with the same weapon against a different creature that is within 5 feet of the original target and that is within the weapon's range. Mass Fear. The target and each creature within 10 feet of it must make a wisdom saving throw against your spell save DC. On a failed save, a creature has the Frightened condition until the start of your next turn."
          },
          {
            "level": 15,
            "name": "Shadowy Dodge",
            "description": "When a creature makes an attack roll against you, you can take a Reaction to impose Disadvantage on that roll. Whether the attack hits or misses, you can teleport up to 30 feet to an unoccupied space that you can see."
          }
        ]
      }
    ]
  },
  {
    "id": "rogue",
    "name": "Rogue",
    "coreTraits": {
      "Primary Ability": "Dexterity",
      "Hit Point Die": "D8 per Rogue level",
      "Saving Throw Proficiencies": "Dexterity and Intelligence",
      "Skill Proficiencies": "Choose 4: Acrobatics, Ath letics, Deception, Insight, Intimidation, Investigation, Perception, Persuasion, Sleight of Hand, or Stealth",
      "Weapon Proficiencies": "Simple weapons and Martial weapons that have the Finesse or Light property",
      "Tool Proficiencies": "Thieves' Tools",
      "Armor Training": "Light armor",
      "Starting Equipment": "Choose A or B: (A) Leather Ar mor, 2 Daggers, Shortsword, Shortbow, 20 Arrows, Quiver, Thieves' Tools, Burglar's Pack, and 8 GP; or (B) 100 GP"
    },
    "progression": [
      {
        "level": 1,
        "features": [
          "Expertise",
          "Sneak Attack",
          "Thieves' Cant",
          "Weapon Mastery"
        ],
        "extras": {
          "Proficiency Bonus": "+2",
          "Sneak Attack": "1d6"
        }
      },
      {
        "level": 2,
        "features": [
          "Cunning Action"
        ],
        "extras": {
          "Proficiency Bonus": "+2",
          "Sneak Attack": "1d6"
        }
      },
      {
        "level": 3,
        "features": [
          "Rogue Subclass",
          "Steady Aim"
        ],
        "extras": {
          "Proficiency Bonus": "+2",
          "Sneak Attack": "2d6"
        }
      },
      {
        "level": 4,
        "features": [
          "Ability Score Improvement"
        ],
        "extras": {
          "Proficiency Bonus": "+2",
          "Sneak Attack": "2d6"
        }
      },
      {
        "level": 5,
        "features": [
          "Cunning Strike",
          "Uncanny Dodge"
        ],
        "extras": {
          "Proficiency Bonus": "+3",
          "Sneak Attack": "3d6"
        }
      },
      {
        "level": 6,
        "features": [
          "Expertise"
        ],
        "extras": {
          "Proficiency Bonus": "+3",
          "Sneak Attack": "3d6"
        }
      },
      {
        "level": 7,
        "features": [
          "Evasion",
          "Reliable Talent"
        ],
        "extras": {
          "Proficiency Bonus": "+3",
          "Sneak Attack": "4d6"
        }
      },
      {
        "level": 8,
        "features": [
          "Ability Score Improvement"
        ],
        "extras": {
          "Proficiency Bonus": "+3",
          "Sneak Attack": "4d6"
        }
      },
      {
        "level": 9,
        "features": [
          "Subclass feature"
        ],
        "extras": {
          "Proficiency Bonus": "+4",
          "Sneak Attack": "5d6"
        }
      },
      {
        "level": 10,
        "features": [
          "Ability Score Improvement"
        ],
        "extras": {
          "Proficiency Bonus": "+4",
          "Sneak Attack": "5d6"
        }
      },
      {
        "level": 11,
        "features": [
          "Improved Cunning Strike"
        ],
        "extras": {
          "Proficiency Bonus": "+4",
          "Sneak Attack": "6d6"
        }
      },
      {
        "level": 12,
        "features": [
          "Ability Score Improvement"
        ],
        "extras": {
          "Proficiency Bonus": "+4",
          "Sneak Attack": "6d6"
        }
      },
      {
        "level": 13,
        "features": [
          "Subclass feature"
        ],
        "extras": {
          "Proficiency Bonus": "+5",
          "Sneak Attack": "7d6"
        }
      },
      {
        "level": 14,
        "features": [
          "Devious Strikes"
        ],
        "extras": {
          "Proficiency Bonus": "+5",
          "Sneak Attack": "7d6"
        }
      },
      {
        "level": 15,
        "features": [
          "Slippery Mind"
        ],
        "extras": {
          "Proficiency Bonus": "+5",
          "Sneak Attack": "8d6"
        }
      },
      {
        "level": 16,
        "features": [
          "Ability Score Improvement"
        ],
        "extras": {
          "Proficiency Bonus": "+5",
          "Sneak Attack": "8d6"
        }
      },
      {
        "level": 17,
        "features": [
          "Subclass feature"
        ],
        "extras": {
          "Proficiency Bonus": "+6",
          "Sneak Attack": "9d6"
        }
      },
      {
        "level": 18,
        "features": [
          "Elusive"
        ],
        "extras": {
          "Proficiency Bonus": "+6",
          "Sneak Attack": "9d6"
        }
      },
      {
        "level": 19,
        "features": [
          "Epic Boon"
        ],
        "extras": {
          "Proficiency Bonus": "+6",
          "Sneak Attack": "10d6"
        }
      },
      {
        "level": 20,
        "features": [
          "Stroke of Luck"
        ],
        "extras": {
          "Proficiency Bonus": "+6",
          "Sneak Attack": "10d6"
        }
      }
    ],
    "features": [
      {
        "level": 1,
        "name": "Expertise",
        "description": "You gain Expertise in two of your skill proficiencies of your choice. Sleight of Hand and Stealth are recommended if you have proficiency in them. At Rogue level 6, you gain Expertise in two more of your skill proficiencies of your choice."
      },
      {
        "level": 1,
        "name": "Sneak Attack",
        "description": "You know how to strike subtly and exploit a foe's distraction. Once per turn, you can deal an extra 1d6 damage to one creature you hit with an attack roll if you have Advantage on the roll and the attack uses a Finesse or a Ranged weapon. The extra damage's type is the same as the weapon's type. You don't need Advantage on the attack roll if at least one of your allies is within 5 feet of the target, the ally doesn't have the Incapacitated condition, and you don't have Disadvantage on the attack roll. The extra damage increases as you gain Rogue levels, as shown in the Sneak Attack column of the Rogue Features table."
      },
      {
        "level": 1,
        "name": "Thieves' Cant",
        "description": "You picked up various languages in the communities where you plied your roguish talents. You know Thieves' Cant and one other language of your choice, which you choose from the language tables in \"Character Creation.\""
      },
      {
        "level": 1,
        "name": "Weapon Mastery",
        "description": "Your training with weapons allows you to use the mastery properties of two kinds of weapons of your choice with which you have proficiency, such as Daggers and Shortbows. Whenever you finish a Long Rest, you can change the kinds of weapons you chose. For example, you could switch to using the mastery properties of Scimitars and Shortswords."
      },
      {
        "level": 2,
        "name": "Cunning Action",
        "description": "Your quick thinking and agility allow you to move and act quickly. On your turn, you can take one of the following actions as a Bonus Action: Dash, Disengage, or Hide."
      },
      {
        "level": 3,
        "name": "Rogue Subclass",
        "description": "You gain a Rogue subclass of your choice. The Thief subclass is detailed after this class's description. A subclass is a specialization that grants you features at certain Rogue levels. For the rest of your career, you gain each of your subclass's features that are of your Rogue level or lower."
      },
      {
        "level": 3,
        "name": "Steady Aim",
        "description": "As a Bonus Action, you give yourself Advantage on your next attack roll on the current turn. You can use this feature only if you haven't moved during this turn, and after you use it, your Speed is 0 until the end of the current turn."
      },
      {
        "level": 4,
        "name": "Ability Score Improvement",
        "description": "You gain the Ability Score Improvement feat (see \"Feats\") or another feat of your choice for which you qualify. You gain this feature again at Rogue levels 8, 10, 12, and 16."
      },
      {
        "level": 5,
        "name": "Cunning Strike",
        "description": "You've developed cunning ways to use your Sneak Attack. When you deal Sneak Attack damage, you can add one of the following Cunning Strike effects. Each effect has a die cost, which is the number of Sneak Attack damage dice you must forgo to add the effect. You remove the die before rolling, and the effect occurs immediately after the attack's damage is dealt. For example, if you add the Poison effect, remove 1d6 from the Sneak Attack's damage before rolling. If a Cunning Strike effect requires a saving throw, the DC equals 8 plus your Dexterity modifier and Proficiency Bonus. Poison (Cost: 1d6). You add a toxin to your strike, forcing the target to make a Constitution saving throw. On a failed save, the target has the Poisoned condition for 1 minute. At the end of each of its turns, the Poisoned target repeats the save, ending the effect on itself on a success. To use this effect, you must have a Poisoner's Kit on your person. Trip (Cost: 1d6). If the target is Large or smaller, it must succeed on a Dexterity saving throw or have the Prone condition. Withdraw (Cost: 1d6). Immediately after the attack, you move up to half your Speed without provoking Opportunity Attacks."
      },
      {
        "level": 5,
        "name": "Uncanny Dodge",
        "description": "When an attacker that you can see hits you with an attack roll, you can take a Reaction to halve the attack's damage against you (round down)."
      },
      {
        "level": 7,
        "name": "Evasion",
        "description": "You can nimbly dodge out of the way of certain dangers. When you're subjected to an effect that allows you to make a Dexterity saving throw to take only half damage, you instead take no damage if you succeed on the saving throw and only half damage if you fail. You can't use this feature if you have the Incapacitated condition."
      },
      {
        "level": 7,
        "name": "Reliable Talent",
        "description": "Whenever you make an ability check that uses one of your skill or tool proficiencies, you can treat a d20 roll of 9 or lower as a 10."
      },
      {
        "level": 11,
        "name": "Improved Cunning Strike",
        "description": "You can use up to two Cunning Strike effects when you deal Sneak Attack damage, paying the die cost for each effect."
      },
      {
        "level": 14,
        "name": "Devious Strikes",
        "description": "You've practiced new ways to use your Sneak Attack deviously. The following effects are now among your Cunning Strike options. Daze (Cost: 2d6). The target must succeed on a Constitution saving throw, or on its next turn, it can do only one of the following: move or take an action or a Bonus Action. Knock Out (Cost: 6d6). The target must succeed on a Constitution saving throw, or it has the Unconscious condition for 1 minute or until it takes any damage. The Unconscious target repeats the save at the end of each of its turns, ending the effect on itself on a success. Obscure (Cost: 3d6). The target must succeed on a Dexterity saving throw, or it has the Blinded condition until the end of its next turn."
      },
      {
        "level": 15,
        "name": "Slippery Mind",
        "description": "Your cunning mind is exceptionally difficult to control. You gain proficiency in Wisdom and Charisma saving throws."
      },
      {
        "level": 18,
        "name": "Elusive",
        "description": "You're so evasive that attackers rarely gain the upper hand against you. No attack roll can have Advantage against you unless you have the Incapacitated condition."
      },
      {
        "level": 19,
        "name": "Epic Boon",
        "description": "You gain an Epic Boon feat (see \"Feats\") or another feat of your choice for which you qualify. Boon of the Night Spirit is recommended."
      },
      {
        "level": 20,
        "name": "Stroke of Luck",
        "description": "You have a marvelous knack for succeeding when you need to. If you fail a D20 Test, you can turn the roll into a 20. Once you use this feature, you can't use it again until you finish a Short or Long Rest."
      }
    ],
    "subclasses": [
      {
        "id": "thief",
        "name": "Thief",
        "features": [
          {
            "level": 3,
            "name": "Fast Hands",
            "description": "As a Bonus Action, you can do one of the following. Sleight of Hand. Make a Dexterity (Sleight of Hand) check to pick a lock or disarm a trap with Thieves' Tools or to pick a pocket. Use an Object. Take the Utilize action, or take the Magic action to use a magic item that requires that action."
          },
          {
            "level": 3,
            "name": "Second-Story Work",
            "description": "You've trained to get into especially hard-to-reach places, granting you these benefits. Climber. You gain a Climb Speed equal to your Speed. Jumper. You can determine your jump distance using your Dexterity rather than your Strength."
          },
          {
            "level": 9,
            "name": "Supreme Sneak",
            "description": "You gain the following Cunning Strike option. *Stealth Attack (Cost: 1d6).* If you have the Hide action's Invisible condition, this attack doesn't end that condition on you if you end the turn behind Three-Quarters Cover or Total Cover."
          },
          {
            "level": 13,
            "name": "Use Magic Device",
            "description": "You've learned how to maximize use of magic items, granting you the following benefits. Attunement. You can attune to up to four magic items at once. Charges. Whenever you use a magic item property that expends charges, roll 1d6. On a roll of 6, you use the property without expending the charges. Scrolls. You can use any *Spell Scroll*, using Intelligence as your spellcasting ability for the spell. If the spell is a cantrip or a level 1 spell, you can cast it reliably. If the scroll contains a higher-level spell, you must first succeed on an Intelligence (Arcana) check (DC 10 plus the spell's level). On a successful check, you cast the spell from the scroll. On a failed check, the scroll disintegrates."
          },
          {
            "level": 17,
            "name": "Thief's Reflexes",
            "description": "You are adept at laying ambushes and quickly escaping danger. You can take two turns during the first round of any combat. You take your first turn at your normal Initiative and your second turn at your Initiative minus 10. --- ## Additional Subclasses"
          }
        ]
      },
      {
        "id": "arcane-trickster",
        "name": "Arcane Trickster",
        "features": [
          {
            "level": 3,
            "name": "Spellcasting",
            "description": "You have learned to cast spells. See chapter 7 for the rules on spellcasting. The information below details how you use those rules as an Arcane Trickster. Cantrips. You know three cantrips: Mage Hand and two other cantrips of your choice from the Wizard spell list (See that class's section for its list). Mind Sliver and Minor Illusion are recommended. Whenever you gain a Rogue level, you can replace one of your cantrips, except Mage Hand, with another Wizard cantrip of your choice. When you reach Rogue level 10, you learn another Wizard cantrip of your choice. Spell Slots. The Arcane Trickster Spellcasting table shows how many spell slots you have to cast your level 1+ spells. You regain all expended spell slots when you finish a Long Rest. Prepared Spells of Level 1+. You prepare a list of the level 1+ spells that are available for you to cast with this feature. To start, choose three level 1 Wizard spells. Charm Person, Disguise Self and Fog Cloud are recommended. The number of spells on your list increases as you gain Rogue levels, as shown in the Prepared Spells column of the Arcane Trickster Spellcasting table. Whenever that number increases, choose additional Wizard spells until the number of spells on your list matches the number in the Arcane Trickster Spellcasting table. The chosen spells must be of a level for which you have spell slots. For example, if you're a level 7 Rogue, your list of prepared spells can include five Wizard spells of level 1 or 2 in any combination. Changing Your Prepared Spells. Whenever you gain a Rogue level, you can replace one spell on your list with another Wizard spell for which you have spell slots. Spellcasting Ability. Intelligence is your Spellcasting ability for your Wizard Spells. Spellcasting Focus. You can use an Arcane…"
          },
          {
            "level": 3,
            "name": "Mage Hand Legerdemain",
            "description": "When you cast Mage Hand, you can cast it as a Bonus Action, and you can make the spectral hand Invisible. You can control the hand as a Bonus Action, and through it, you can make Dexterity (Sleight of Hand) checks."
          },
          {
            "level": 9,
            "name": "Magical Ambush",
            "description": "If you have the Invisible condition when you cast a spell on a creature, it has Disadvantage on any saving throw it makes against the spell on the same turn."
          },
          {
            "level": 13,
            "name": "Versatile Trickster",
            "description": "You gain the ability to distract targets with your Mage Hand. When you use the Trip option of your Cunning Strike on a creature, you can also use that option on another creature within 5 feet of the spectral hand."
          },
          {
            "level": 17,
            "name": "Spell Thief",
            "description": "You gain the ability to magically steal the knowledge of how to cast a spell from another spellcaster. Immediately after a creature casts a spell that targets you or includes you in its area of effect, you can take a Reaction toforce the creature to make an Intelligence saving throw. The DC equals your spell save DC. On a failed save, you negate the spell's effect against you, and you steal the knowledge of the spell if it is at least level 1 and of a level you can cast (it doesn't need to be a Wizard spell). For the next 8 hours, you have the spell prepared. The creature can't cast it until 8 hours have passed. Once you steal a spell with this feature, you can't use this feature again until you finish a Long Rest."
          }
        ]
      },
      {
        "id": "assassin",
        "name": "Assassin",
        "features": [
          {
            "level": 3,
            "name": "Assassinate",
            "description": "You're adept at ambushing a target, granting you the following benefits. Initiative. You have Advantage on Initiative rolls. Surprising Strikes. During the first round of each combat, you have Advantage on attack rolls against any creature that hasn't taken a turn. If your Sneak Attack hits any target during that round, the target takes extra damage of the weapon's type equal to your Rogue level."
          },
          {
            "level": 3,
            "name": "Assassin'S Tools",
            "description": "You gain a Disguise Kit and a Poisoner's Kit, and you have proficiency with them."
          },
          {
            "level": 9,
            "name": "Infiltration Expertise",
            "description": "You are an expert at the following techniques that aid your infiltrations. Masterful Mimicry. You can unerringly mimic another person's speech, handwriting or both if you have spent at least 1 hour studying them. Roving Aim. Your speed isn't reduced to 0 by using Steady Aim."
          },
          {
            "level": 13,
            "name": "Envenom Weapons",
            "description": "When you use the Poison option of your Cunning Strike, the target also takes 2d6 Poison damage whenever it fails the saving throw. This damage ignores Resistance to Poison damage."
          },
          {
            "level": 17,
            "name": "Death Strike",
            "description": "When you hit with your Sneak Attack on the first round of a combat, the target must succeed on a Constitution saving throw (DC 8 plus your Dexterity modifier and Proficiency Bonus), or the attack's damage is doubled against the target."
          }
        ]
      },
      {
        "id": "scion-of-the-three",
        "name": "Scion of the Three",
        "features": [
          {
            "level": 3,
            "name": "Bloodthirst",
            "description": "When an enemy you can see within 30 feet of yourself takes damage and is Bloodied after taking that damage but not killed outright, you can take a Reaction and teleport to an unoccupied space you can see within 5 feet of that enemy. You can then make one melee attack. You can use this feature a number of times equal to your Intelligence modifier (minimum of once), and you regain all expended uses when you finish a Long Rest."
          },
          {
            "level": 3,
            "name": "Dread Allegiance",
            "description": "Choose one of the Dead Three: Bane, Bhaal, or Myrkul. You gain Resistance to one type of damage and the ability to cast a cantrip, as detailed in the table below; Intelligence is your spellcasting ability for this cantrip. When you finish a Long Rest, you can change your choice. | God | Damage Resistance | Cantrip | | --- | --- | --- | | Bane | Psychic | Minor Illusion | | Bhaal | Poison | Blade Ward | | Myrkul | Necrotic | Chill Touch |"
          },
          {
            "level": 9,
            "name": "Strike Fear",
            "description": "You gain the following Cunning Strike option. Terrify (Cost: 1d6). The target must succeed on a Wisdom saving throw, or it has the Frightened condition for 1 minute. While the target is Frightened in this way, you have Advantage on attack rolls against the target. The Frightened target repeats the save at the end of each of its turns, ending the effect on itself on a success."
          },
          {
            "level": 13,
            "name": "Aura Of Malevolence",
            "description": "You radiate malignant power associated with one of the Dead Three. When you use Bloodthirst and teleport, each creature of your choice within 10 feet of either the space you left or your destination space (your choice) takes damage equal to your Intelligence modifier; the damage type is the same as the damage Resistance granted by your choice in the Dread Allegiance feature. Damage dealt by this feature ignores Resistance."
          },
          {
            "level": 17,
            "name": "Dread Incarnate",
            "description": "You gain the following benefits. Cutthroat. You regain one expended use of Bloodthirst when you finish a Short Rest. Murderous Intent. When you roll for your Sneak Attack damage, you can treat a roll of a 1 or 2 on the die as a 3."
          }
        ]
      },
      {
        "id": "soulknife",
        "name": "Soulknife",
        "features": [
          {
            "level": 3,
            "name": "Psionic Power",
            "description": "You harbor a wellspring of psionic energy within yourself. It is represented by your Psionic Energy Dice, which fuel certain powers you have from this subclass. The Soulknife Energy Dice table shows the number of these dice you have when you reach certain Rogue levels, and the table shows the die size. Table: Soulknife Energy Dice | Rogue Level | Die Size | Number | | --- | --- | --- | | 3 | D6 | 4 | | 5 | D8 | 6 | | 9 | D8 | 8 | | 11 | D10 | 8 | | 13 | D10 | 10 | | 17 | D12 | 12 | Any features in this subclass that use a Psionic Energy Die use only the dice from this subclass. Some of your powers expend a Psionic Energy Die, as specified in the power's description, and you can't use the power if it requires you to use a die when your Psionic Energy Dice are all expended. You regain one of your expended Psionic Energy Dice when you finish a Short Rest, and you regain all of them when you finish a Long Rest. Psi-Bolstered Knack. If you fail an ability check using a skill or tool with which you have proficiency, you can roll one Psionic Energy Die and add the number rolled to the check, potentially turning failure into success. The die is expended only if the roll then succeeds. Psychic Whispers. You can establish telepathic communication between yourself and others. As a Magic action, choose one or more creatures you can see, up to a number of creatures equal to your Proficiency Bonus, and then roll one Psionic Energy Die. For a number of hours equal to the number rolled, the chosen creatures can speak telepathically to you, and you can speak telepathically with them. To send or receive a message (no action required), you and the other creature must be within 1 mile of each other. A creature can end the telepathic connection at any time (no action required)."
          },
          {
            "level": 3,
            "name": "Psychic Blades",
            "description": "You can manifest shimmering blades of psychic energy. Whenever you take the Attack action or make an Opportunity Attack, you can manifest a Psychic Blade in your free hand and make the attack with that blade. The magic blade has the following traits: Weapon Category: Simple Melee Damage on a Hit: 1d6 Psychic plus the ability modifier used for the attack roll Properties: Finesse, Thrown (range 60/120 feet) Mastery: Vex (you can use this property, and it doesn't count against the number of properties you can use with Weapon Mastery) The blade vanishes immediately after it hits or misses its target, and it leaves no mark if it deals damage. After you attack with the blade on your turn, you can make a melee or ranged attack with a second psychic blade as a Bonus Action on the same turn if your other hand is free to create it. The damage die of this bonus attack is 1d4 instead of 1d6."
          },
          {
            "level": 9,
            "name": "Soul Blades",
            "description": "You can now use the following powers with your Psychic Blades. Homing Strikes. If you make an attack roll with your Psychic Blade and miss the target, you can roll one Psionic Energy Die and add the number rolled to the attack roll. If this causes the attack to hit, the die is expended. Psychic Teleportation. As a Bonus Action, you manifest a Psychic Blade, expend one Psionic Energy Die and roll it, and throw the blade at an unoccupied space you can see up to a number of feet away equal to 10 times the number rolled. You then teleport to that space, and the blade vanishes."
          },
          {
            "level": 13,
            "name": "Psychic Veil",
            "description": "You can weave a veil of psychic static to mask yourself. As a Magic action, you gain the Invisible condition for 1 hour or until you dismiss the effect (no action required). This invisibility ends early immediately after you deal damage to a creature or you force a creature to make a saving throw. Once you use this feature, you can't do so again until you finish a Long Rest unless you expend a Psionic Energy Die (no action required) to restore your use of it."
          },
          {
            "level": 17,
            "name": "Rend Mind",
            "description": "You can sweep your Psychic Blades through a creature's mind. When you use you Psychic Blades to deal Sneak Attack damage to a creature, you can force that target to make a Wisdom saving throw (DC 8 plus your Dexterity modifier and Proficiency Bonus). If the save fails, the target has the Stunned condition for 1 minute. The Stunned target repeats the save at the end of each of its turns, ending the effect on itself with a success. Once you use this feature, you can't do so again until you finish a Long Rest unless you expend three Psionic Energy Dice (no action required) to restore your use of it."
          }
        ]
      }
    ]
  },
  {
    "id": "sorcerer",
    "name": "Sorcerer",
    "coreTraits": {
      "Primary Ability": "Charisma",
      "Hit Point Die": "D6 per Sorcerer level",
      "Saving Throw Proficiencies": "Constitution and Charisma",
      "Skill Proficiencies": "Choose 2: Arcana, Deception, Insight, Intimidation, Persua sion, or Religion",
      "Weapon Proficiencies": "Simple weapons",
      "Armor Training": "None",
      "Starting Equipment": "Choose A or B: (A) Spear, 2 Daggers, Arcane Focus (crystal), Dungeoneer's Pack, and 28 GP; or (B) 50 GP"
    },
    "progression": [
      {
        "level": 1,
        "features": [
          "Spellcasting",
          "Innate Sorcery"
        ],
        "extras": {
          "Proficiency Bonus": "+2",
          "Cantrips": "4",
          "Prepared Spells": "2",
          "1": "2"
        }
      },
      {
        "level": 2,
        "features": [
          "Font of Magic",
          "Metamagic"
        ],
        "extras": {
          "Proficiency Bonus": "+2",
          "Sorcery Points": "2",
          "Cantrips": "4",
          "Prepared Spells": "4",
          "1": "3"
        }
      },
      {
        "level": 3,
        "features": [
          "Sorcerer Subclass"
        ],
        "extras": {
          "Proficiency Bonus": "+2",
          "Sorcery Points": "3",
          "Cantrips": "4",
          "Prepared Spells": "6",
          "1": "4",
          "2": "2"
        }
      },
      {
        "level": 4,
        "features": [
          "Ability Score Improvement"
        ],
        "extras": {
          "Proficiency Bonus": "+2",
          "Sorcery Points": "4",
          "Cantrips": "5",
          "Prepared Spells": "7",
          "1": "4",
          "2": "3"
        }
      },
      {
        "level": 5,
        "features": [
          "Sorcerous Restoration"
        ],
        "extras": {
          "Proficiency Bonus": "+3",
          "Sorcery Points": "5",
          "Cantrips": "5",
          "Prepared Spells": "9",
          "1": "4",
          "2": "3",
          "3": "2"
        }
      },
      {
        "level": 6,
        "features": [
          "Subclass feature"
        ],
        "extras": {
          "Proficiency Bonus": "+3",
          "Sorcery Points": "6",
          "Cantrips": "5",
          "Prepared Spells": "10",
          "1": "4",
          "2": "3",
          "3": "3"
        }
      },
      {
        "level": 7,
        "features": [
          "Sorcery Incarnate"
        ],
        "extras": {
          "Proficiency Bonus": "+3",
          "Sorcery Points": "7",
          "Cantrips": "5",
          "Prepared Spells": "11",
          "1": "4",
          "2": "3",
          "3": "3",
          "4": "1"
        }
      },
      {
        "level": 8,
        "features": [
          "Ability Score Improvement"
        ],
        "extras": {
          "Proficiency Bonus": "+3",
          "Sorcery Points": "8",
          "Cantrips": "5",
          "Prepared Spells": "12",
          "1": "4",
          "2": "3",
          "3": "3",
          "4": "2"
        }
      },
      {
        "level": 9,
        "features": [],
        "extras": {
          "Proficiency Bonus": "+4",
          "Sorcery Points": "9",
          "Cantrips": "5",
          "Prepared Spells": "14",
          "1": "4",
          "2": "3",
          "3": "3",
          "4": "3",
          "5": "1"
        }
      },
      {
        "level": 10,
        "features": [
          "Metamagic"
        ],
        "extras": {
          "Proficiency Bonus": "+4",
          "Sorcery Points": "10",
          "Cantrips": "6",
          "Prepared Spells": "15",
          "1": "4",
          "2": "3",
          "3": "3",
          "4": "3",
          "5": "2"
        }
      },
      {
        "level": 11,
        "features": [],
        "extras": {
          "Proficiency Bonus": "+4",
          "Sorcery Points": "11",
          "Cantrips": "6",
          "Prepared Spells": "16",
          "1": "4",
          "2": "3",
          "3": "3",
          "4": "3",
          "5": "2",
          "6": "1"
        }
      },
      {
        "level": 12,
        "features": [
          "Ability Score Improvement"
        ],
        "extras": {
          "Proficiency Bonus": "+4",
          "Sorcery Points": "12",
          "Cantrips": "6",
          "Prepared Spells": "16",
          "1": "4",
          "2": "3",
          "3": "3",
          "4": "3",
          "5": "2",
          "6": "1"
        }
      },
      {
        "level": 13,
        "features": [],
        "extras": {
          "Proficiency Bonus": "+5",
          "Sorcery Points": "13",
          "Cantrips": "6",
          "Prepared Spells": "17",
          "1": "4",
          "2": "3",
          "3": "3",
          "4": "3",
          "5": "2",
          "6": "1",
          "7": "1"
        }
      },
      {
        "level": 14,
        "features": [
          "Subclass feature"
        ],
        "extras": {
          "Proficiency Bonus": "+5",
          "Sorcery Points": "14",
          "Cantrips": "6",
          "Prepared Spells": "17",
          "1": "4",
          "2": "3",
          "3": "3",
          "4": "3",
          "5": "2",
          "6": "1",
          "7": "1"
        }
      },
      {
        "level": 15,
        "features": [],
        "extras": {
          "Proficiency Bonus": "+5",
          "Sorcery Points": "15",
          "Cantrips": "6",
          "Prepared Spells": "18",
          "1": "4",
          "2": "3",
          "3": "3",
          "4": "3",
          "5": "2",
          "6": "1",
          "7": "1",
          "8": "1"
        }
      },
      {
        "level": 16,
        "features": [
          "Ability Score Improvement"
        ],
        "extras": {
          "Proficiency Bonus": "+5",
          "Sorcery Points": "16",
          "Cantrips": "6",
          "Prepared Spells": "18",
          "1": "4",
          "2": "3",
          "3": "3",
          "4": "3",
          "5": "2",
          "6": "1",
          "7": "1",
          "8": "1"
        }
      },
      {
        "level": 17,
        "features": [
          "Metamagic"
        ],
        "extras": {
          "Proficiency Bonus": "+6",
          "Sorcery Points": "17",
          "Cantrips": "6",
          "Prepared Spells": "19",
          "1": "4",
          "2": "3",
          "3": "3",
          "4": "3",
          "5": "2",
          "6": "1",
          "7": "1",
          "8": "1",
          "9": "1"
        }
      },
      {
        "level": 18,
        "features": [
          "Subclass feature"
        ],
        "extras": {
          "Proficiency Bonus": "+6",
          "Sorcery Points": "18",
          "Cantrips": "6",
          "Prepared Spells": "20",
          "1": "4",
          "2": "3",
          "3": "3",
          "4": "3",
          "5": "3",
          "6": "1",
          "7": "1",
          "8": "1",
          "9": "1"
        }
      },
      {
        "level": 19,
        "features": [
          "Epic Boon"
        ],
        "extras": {
          "Proficiency Bonus": "+6",
          "Sorcery Points": "19",
          "Cantrips": "6",
          "Prepared Spells": "21",
          "1": "4",
          "2": "3",
          "3": "3",
          "4": "3",
          "5": "3",
          "6": "2",
          "7": "1",
          "8": "1",
          "9": "1"
        }
      },
      {
        "level": 20,
        "features": [
          "Arcane Apotheosis"
        ],
        "extras": {
          "Proficiency Bonus": "+6",
          "Sorcery Points": "20",
          "Cantrips": "6",
          "Prepared Spells": "22",
          "1": "4",
          "2": "3",
          "3": "3",
          "4": "3",
          "5": "3",
          "6": "2",
          "7": "2",
          "8": "1",
          "9": "1"
        }
      }
    ],
    "features": [
      {
        "level": 1,
        "name": "Spellcasting",
        "description": "Drawing from your innate magic, you can cast spells. See \"Spells\" for the rules on spellcasting. The information below details how you use those rules with Sorcerer spells, which appear in the Sorcerer spell list later in the class's description. Cantrips. You know four Sorcerer cantrips of your choice. *Light*, *Prestidigitation*, *Shocking Grasp*, and *Sorcerous Burst* are recommended. Whenever you gain a Sorcerer level, you can replace one of your cantrips from this feature with another Sorcerer cantrip of your choice. When you reach Sorcerer levels 4 and 10, you learn another Sorcerer cantrip of your choice, as shown in the Cantrips column of the Sorcerer Features table. Spell Slots. The Sorcerer Features table shows how many spell slots you have to cast your level 1+ spells. You regain all expended slots when you finish a Long Rest. Prepared Spells of Level 1+. You prepare the list of level 1+ spells that are available for you to cast with this feature. To start, choose two level 1 Sorcerer spells. *Burning Hands* and *Detect Magic* are recommended. The number of spells on your list increases as you gain Sorcerer levels, as shown in the Prepared Spells column of the Sorcerer Features table. Whenever that number increases, choose additional Sorcerer spells until the number of spells on your list matches the number in the Sorcerer Features table. The chosen spells must be of a level for which you have spell slots. For example, if you're a level 3 Sorcerer, your list of prepared spells can include six Sorcerer spells of level 1 or 2 in any combination. If another Sorcerer feature gives you spells that you always have prepared, those spells don't count against the number of spells you can prepare with this feature, but those spells otherwise count as Sorcerer spells…"
      },
      {
        "level": 1,
        "name": "Innate Sorcery",
        "description": "An event in your past left an indelible mark on you, infusing you with simmering magic. As a Bonus Action, you can unleash that magic for 1 minute, during which you gain the following benefits: - The spell save DC of your Sorcerer spells increases by 1. - You have Advantage on the attack rolls of Sorcerer spells you cast. You can use this feature twice, and you regain all expended uses of it when you finish a Long Rest."
      },
      {
        "level": 2,
        "name": "Font of Magic",
        "description": "You can tap into the wellspring of magic within yourself. This wellspring is represented by Sorcery Points, which allow you to create a variety of magical effects. You have 2 Sorcery Points, and you gain more as you reach higher levels, as shown in the Sorcery Points column of the Sorcerer Features table. You can't have more Sorcery Points than the number shown in the table for your level. You regain all expended Sorcery Points when you finish a Long Rest. You can use your Sorcery Points to fuel the options below, along with other features, such as Metamagic, that use those points. Converting Spell Slots to Sorcery Points. You can expend a spell slot to gain a number of Sorcery Points equal to the slot's level (no action required). Creating Spell Slots. As a Bonus Action, you can transform unexpended Sorcery Points into one spell slot. The Creating Spell Slots table shows the cost of creating a spell slot of a given level, and it lists the minimum Sorcerer level you must be to create a slot. You can create a spell slot no higher than level 5. Any spell slot you create with this feature vanishes when you finish a Long Rest. Table: Creating Spell Slots | Spell Slot Level | Sorcery Point Cost | Min. Sorcerer Level | |------------------|--------------------|---------------------| | 1 | 2 | 2 | | 2 | 3 | 3 | | 3 | 5 | 5 | | 4 | 6 | 7 | | 5 | 7 | 9 |"
      },
      {
        "level": 2,
        "name": "Metamagic",
        "description": "Because your magic flows from within, you can alter your spells to suit your needs; you gain two Metamagic options of your choice from \"Metamagic Options\" later in this class's description. You use the chosen options to temporarily modify spells you cast. To use an option, you must spend the number of Sorcery Points that it costs. You can use only one Metamagic option on a spell when you cast it unless otherwise noted in one of those options. Whenever you gain a Sorcerer level, you can replace one of your Metamagic options with one you don't know. You gain two more options at Sorcerer level 10 and two more at Sorcerer level 17."
      },
      {
        "level": 3,
        "name": "Sorcerer Subclass",
        "description": "You gain a Sorcerer subclass of your choice. The Draconic Sorcery subclass is detailed after this class's description. A subclass is a specialization that grants you features at certain Sorcerer levels. For the rest of your career, you gain each of your subclass's features that are of your Sorcerer level or lower."
      },
      {
        "level": 4,
        "name": "Ability Score Improvement",
        "description": "You gain the Ability Score Improvement feat (see \"Feats\") or another feat of your choice for which you qualify. You gain this feature again at Sorcerer levels 8, 12, and 16."
      },
      {
        "level": 5,
        "name": "Sorcerous Restoration",
        "description": "When you finish a Short Rest, you can regain expended Sorcery Points, but no more than a number equal to half your Sorcerer level (round down). Once you use this feature, you can't do so again until you finish a Long Rest."
      },
      {
        "level": 7,
        "name": "Sorcery Incarnate",
        "description": "If you have no uses of Innate Sorcery left, you can use it if you spend 2 Sorcery Points when you take the Bonus Action to activate it. In addition, while your Innate Sorcery feature is active, you can use up to two of your Metamagic options on each spell you cast."
      },
      {
        "level": 19,
        "name": "Epic Boon",
        "description": "You gain an Epic Boon feat (see \"Feats\") or another feat of your choice for which you qualify. Boon of Dimensional Travel is recommended."
      },
      {
        "level": 20,
        "name": "Arcane Apotheosis",
        "description": "While your Innate Sorcery feature is active, you can use one Metamagic option on each of your turns without spending Sorcery Points on it."
      }
    ],
    "subclasses": [
      {
        "id": "draconic-sorcery",
        "name": "Draconic Sorcery",
        "features": [
          {
            "level": 3,
            "name": "Draconic Resilience",
            "description": "The magic in your body manifests physical traits of your draconic gift. Your Hit Point maximum increases by 3, and it increases by 1 whenever you gain another Sorcerer level. Parts of you are also covered by dragon-like scales. While you aren't wearing armor, your base Armor Class equals 10 plus your Dexterity and Charisma modifiers."
          },
          {
            "level": 3,
            "name": "Draconic Spells",
            "description": "When you reach a Sorcerer level specified in the Draconic Spells table, you thereafter always have the listed spells prepared. Table: Draconic Spells | Sorcerer Level | Spells | |-------------------|--------------------------------------------------------| | 3 | Alter Self, Chromatic Orb, Command, Dragon's Breath | | 5 | Fear, Fly | | 7 | Arcane Eye, Charm Monster | | 9 | Legend Lore, Summon Dragon |"
          },
          {
            "level": 6,
            "name": "Elemental Affinity",
            "description": "Your draconic magic has an affinity with a damage type associated with dragons. Choose one of those types: Acid, Cold, Fire, Lightning, or Poison. You have Resistance to that damage type, and when you cast a spell that deals damage of that type, you can add your Charisma modifier to one damage roll of that spell."
          },
          {
            "level": 14,
            "name": "Dragon Wings",
            "description": "As a Bonus Action, you can cause draconic wings to appear on your back. The wings last for 1 hour or until you dismiss them (no action required). For the duration, you have a Fly Speed of 60 feet. Once you use this feature, you can't use it again until you finish a Long Rest unless you spend 3 Sorcery Points (no action required) to restore your use of it."
          },
          {
            "level": 18,
            "name": "Dragon Companion",
            "description": "You can cast *Summon Dragon* without a Material component. You can also cast it once without a spell slot, and you regain the ability to cast it in this way when you finish a Long Rest. Whenever you start casting the spell, you can modify it so that it doesn't require Concentration. If you do so, the spell's duration becomes 1 minute for that casting. --- ## Additional Subclasses"
          }
        ]
      },
      {
        "id": "aberrant-sorcery",
        "name": "Aberrant Sorcery",
        "features": [
          {
            "level": 3,
            "name": "Psionic Spells",
            "description": "When you reach a Sorcerer level specified in the Psionic Spells table, you thereafter always have the listed spells prepared. Table: Psionic Spells | Sorcerer Level | Spells | | --- | --- | | 3 | Arms of Hadar, Calm Emotions, Detect Thoughts, Dissonant Whispers, Mind Sliver | | 5 | Hunger of Hadar, Sending | | 7 | Evard's Black Tentacles, Summon Aberration | | 9 | Rary's Telepathic Bond, Telekinesis |"
          },
          {
            "level": 3,
            "name": "Telepathic Speech",
            "description": "You can form a telepathic connection between your mind and the mind of another. As a Bonus Action, choose one creature you can see within 30 feet of yourself. You and the chosen creature can communicate telepathically with each other while the two of you are within a number of miles of each other equal to your Charisma modifier (minimum of 1 mile). To understand each other, you each must mentally use a language the other knows. The telepathic connection lasts for a number of minutes equal to your Sorcerer level. It ends early if you use this ability toform a connection with a different creature."
          },
          {
            "level": 6,
            "name": "Psionic Sorcery",
            "description": "When you cast any level 1+ spell from your Psionic Spells feature, you can cast it by expending a spell slot as normal or by spending a number of Sorcery Points equal to the spell’s level. If you cast the spell using Sorcery Points, it requires no Verbal or Somatic components, and it requires no Material components unless they are consumed by the spell or have a cost specified in it."
          },
          {
            "level": 6,
            "name": "Psychic Defenses",
            "description": "You have Resistance to Psychic damage, and you have Advantage on saving throws to avoid or end the Charmed or Frightened condition."
          },
          {
            "level": 14,
            "name": "Revelation In Flesh",
            "description": "You can unleash the aberrant truth hidden within yourself. As a Bonus Action, you can spend 1 Sorcery Point or more to magically alter your body for 10 minutes. For each Sorcery Point you spend, you gain one of the following benefits of your choice, the effects of which last until the alteration ends. Aquatic Adaptation. You gain a Swim Speed equal to twice your Speed, and you can breathe underwater. Gills grow from your neck or flare behind your ears, and your fingers become webbed or you grow wriggling cilia. Glistening Flight. You gain a Fly Speed equal to your Speed, and you can hover. As you fly, your skin glistens with mucus or otherworldly light. See the Invisible. You can see any Invisible creature within 60 feet of yourself that isn’t behind Total Cover. Your eyes also turn black or become writhing sensory tendrils. Wormlike Movement. Your body, along with any equipment you are wearing or carrying, becomes slimy and pliable. You can move through any space as narrow as 1 inch, and you can spend 5 feet of movement to escape from nonmagical restraints or the Grappled condition."
          },
          {
            "level": 18,
            "name": "Warping Implosion",
            "description": "You can unleash a space-warping anomaly. As a Magic action, you teleport to an unoccupied space you can see within 120 feet of yourself. Immediately after you disappear, each creature within 30 feet of the space you left must make a Strength saving throw against your spell save DC. On a failed save, a creature takes 3d10 Force damage and is pulled straight toward the space you left, ending in an unoccupied space as close to your former space as possible. On a successful save, the creature takes half as much damage only. Once you use this feature, you can’t do so again until you finish a Long Rest unless you spend 5 Sorcery Points (no action required) to restore your use of it."
          }
        ]
      },
      {
        "id": "clockwork-sorcery",
        "name": "Clockwork Sorcery",
        "features": [
          {
            "level": 3,
            "name": "Clockwork Spells",
            "description": "When you reach a Sorcerer level specified in the Clockwork Spells table, you thereafter always have the listed spells prepared. Table: Clockwork Spells | Sorcerer Level | Spells | | --- | --- | | 3 | Aid, Alarm, Lesser Restoration, Protection from Evil and Good | | 5 | Dispel Magic, Protection from Energy | | 7 | Freedom of Movement, Summon Construct | | 9 | Greater Restoration, Wall of Force | In addition, consult the Manifestations of Order table and choose or randomly determine a way your connection to order manifests while you are casting any of your Sorcerer spells. Manifestations of Order | 1d6 | Manifestation | | --- | --- | | 1 | Spectral cogwheels hover behind you. | | 2 | The hands of a clock spin in your eyes. | | 3 | Your skin glows with a brassy sheen. | | 4 | Floating equations and geometric objects overlay your body. | | 5 | Your Spellcasting Focus temporarily takes the form of a Tiny clockwork mechanism. | | 6 | The ticking of gears or ringing of a clock can be heard by you and those affected by your magic. |"
          },
          {
            "level": 3,
            "name": "Restore Balance",
            "description": "Your connection to the plane of absolute order allows you to equalize chaotic moments. When a creature you can see within 60 feet of yourself is about to roll a d20 with Advantage or Disadvantage, you can take a Reaction to prevent the roll from being affected by Advantage and Disadvantage. You can use this feature a number of times equal to your Charisma modifier (minimum of once), and you regain all expended uses when you finish a Long Rest."
          },
          {
            "level": 6,
            "name": "Bastion Of Law",
            "description": "You can tap into the grand equation of existence to imbue a creature with a shimmering shield of order. As a Magic action, you can expend 1 to 5 Sorcery Points to create a magical ward around yourself or another creature you can see within 30 feet of yourself. The ward is represented by a number of d8s equal to the number of Sorcery Points spent to create it. When the warded creature takes damage, it can expend a number of those dice, roll them, and reduce the damage taken by the total rolled on those dice. The ward lasts until you finish a Long Rest or until you use this feature again."
          },
          {
            "level": 14,
            "name": "Trance Of Order",
            "description": "You gain the ability to align your consciousness with the endless calculations of Mechanus. As a Bonus Action, you can enter this state for 1 minute. For the duration, attack rolls against you can’t benefit from Advantage, and whenever you make a D20 Test, you can treat a roll of 9 or lower on the d20 as a 10. Once you use this feature, you can’t use it again until you finish a Long Rest unless you spend 5 Sorcery Points (no action required) to restore your use of it."
          },
          {
            "level": 18,
            "name": "Clockwork Cavalcade",
            "description": "You momentarily summon spirits of order to expunge disorder around you. As a Magic action, you summon the spirits in a 30-foot Cube originating from you. The spirits look like modrons or other Constructs of your choice. The spirits are intangible and invulnerable, and they create the effects below within the Cube before vanishing. Once you use this action, you can’t use it again until you finish a Long Rest unless you spend 7 Sorcery Points (no action required) to restore your use of it. Heal. The spirits restore up to 100 Hit Points, divided as you choose among any number of creatures of your choice in the Cube. Repair. Any damaged objects entirely in the Cube are repaired instantly. Dispel. Every spell of level 6 and lower ends on creatures and objects of your choice in the Cube."
          }
        ]
      },
      {
        "id": "wild-magic-sorcery",
        "name": "Wild Magic Sorcery",
        "features": [
          {
            "level": 3,
            "name": "Wild Magic Surge",
            "description": "Your spellcasting can unleash surges of untamed magic. Once per turn, you can roll 1d20 immediately after you cast a Sorcerer spell with a spell slot. If you roll a 20, roll on the Wild Magic Surge table to create a magical effect. If the magical effect is a spell, it is too wild to be affected by your Metamagic."
          },
          {
            "level": 3,
            "name": "Tides Of Chaos",
            "description": "You can manipulate chaos itself to give yourself Advantage on one D20 Test before you roll the d20. Once you do so, you must cast a Sorcerer spell with a spell slot or finish a Long Rest before you can use this feature again. If you do cast a Sorcerer spell with a spell slot before you finish a Long Rest, you automatically roll on the Wild Magic Surge table."
          },
          {
            "level": 6,
            "name": "Bend Luck",
            "description": "You have the ability to twist fate using your wild magic. Immediately after another creature you can see rolls the d20 for a D20 Test, you can take a Reaction and spend 1 Sorcery Point to roll 1d4 and apply the number rolled as a bonus or penalty (your choice) to the d20 roll."
          },
          {
            "level": 14,
            "name": "Controlled Chaos",
            "description": "You gain a modicum of control over the surges of your wild magic. Whenever you roll on the Wild Magic Surge table, you can roll twice and use either number."
          },
          {
            "level": 18,
            "name": "Tamed Surge",
            "description": "Immediately after you cast a Sorcerer spell with a spell slot, you can create an effect of your choice from the Wild Magic Surge table instead of rolling on that table. You can choose any effect in the table except for the final row, and if the chosen effect involves a roll, you must make it. Once you use this feature, you can’t do so again until you finish a Long Rest. Wild Magic Surge | 1d100 | Effect | | --- | --- | | 01-04 | Roll on this table at the start of each of your turns for the next minute, ignoring this result on subsequent rolls. | | 05-08 | A creature that is Friendly toward you appears in a random unoccupied space within 60 feet of you. The creature is under the DM’s control and disappears 1 minute later. Roll 1d4 to determine the creature: on a 1, a Modron Duodrone appears; on a 2, a Flumph appears; on a 3, a Modron Monodrone appears; on a 4, a Unicorn appears. See the Monster Manual for the creature’s stat block. | | 09-12 | For the next minute, you regain 5 Hit Points at the start of each of your turns. | | 13-16 | Creatures have Disadvantage on saving throws against the next spell you cast in the next minute that involves a saving throw. | | 17-20 | You are subjected to an effect that lasts for 1 minute unless its description says otherwise. Roll 1d8 to determine the effect: on a 1, you’re surrounded by faint, ethereal music only you and creatures within 5 feet of you can hear; on a 2, your size increases by one size category; on a 3, you grow a long beard made of feathers that remains until you sneeze, at which point the feathers explode from your face and vanish; on a 4, you must shout when you speak; on a 5, illusory butterflies flutter in the air within 10 feet of you; on a 6, an eye appears on your forehead, granting you Advantage on Wisdom…"
          }
        ]
      }
    ]
  },
  {
    "id": "warlock",
    "name": "Warlock",
    "coreTraits": {
      "Primary Ability": "Charisma",
      "Hit Point Die": "D8 per Warlock level",
      "Saving Throw Proficiencies": "Wisdom and Charisma",
      "Skill Proficiencies": "Choose 2: Arcana, Deception, History, Intimidation, Investigation, Nature, or Religion",
      "Weapon Proficiencies": "Simple weapons",
      "Armor Training": "Light armor",
      "Starting Equipment": "Choose A or B: (A) Leather Armor, Sickle, 2 Daggers, Ar cane Focus (orb), Book (occult lore), Scholar's Pack, and 15 GP; or (B) 100 GP"
    },
    "progression": [
      {
        "level": 1,
        "features": [
          "Eldritch Invocations",
          "Pact Magic"
        ],
        "extras": {
          "Proficiency Bonus": "+2",
          "Eldritch Invocations": "1",
          "Cantrips": "2",
          "Prepared Spells": "2",
          "Spell Slots": "1",
          "Slot Level": "1"
        }
      },
      {
        "level": 2,
        "features": [
          "Magical Cunning"
        ],
        "extras": {
          "Proficiency Bonus": "+2",
          "Eldritch Invocations": "3",
          "Cantrips": "2",
          "Prepared Spells": "3",
          "Spell Slots": "2",
          "Slot Level": "1"
        }
      },
      {
        "level": 3,
        "features": [
          "Warlock Subclass"
        ],
        "extras": {
          "Proficiency Bonus": "+2",
          "Eldritch Invocations": "3",
          "Cantrips": "2",
          "Prepared Spells": "4",
          "Spell Slots": "2",
          "Slot Level": "2"
        }
      },
      {
        "level": 4,
        "features": [
          "Ability Score Improvement"
        ],
        "extras": {
          "Proficiency Bonus": "+2",
          "Eldritch Invocations": "3",
          "Cantrips": "3",
          "Prepared Spells": "5",
          "Spell Slots": "2",
          "Slot Level": "2"
        }
      },
      {
        "level": 5,
        "features": [],
        "extras": {
          "Proficiency Bonus": "+3",
          "Eldritch Invocations": "5",
          "Cantrips": "3",
          "Prepared Spells": "6",
          "Spell Slots": "2",
          "Slot Level": "3"
        }
      },
      {
        "level": 6,
        "features": [
          "Subclass feature"
        ],
        "extras": {
          "Proficiency Bonus": "+3",
          "Eldritch Invocations": "5",
          "Cantrips": "3",
          "Prepared Spells": "7",
          "Spell Slots": "2",
          "Slot Level": "3"
        }
      },
      {
        "level": 7,
        "features": [],
        "extras": {
          "Proficiency Bonus": "+3",
          "Eldritch Invocations": "6",
          "Cantrips": "3",
          "Prepared Spells": "8",
          "Spell Slots": "2",
          "Slot Level": "4"
        }
      },
      {
        "level": 8,
        "features": [
          "Ability Score Improvement"
        ],
        "extras": {
          "Proficiency Bonus": "+3",
          "Eldritch Invocations": "6",
          "Cantrips": "3",
          "Prepared Spells": "9",
          "Spell Slots": "2",
          "Slot Level": "4"
        }
      },
      {
        "level": 9,
        "features": [
          "Contact Patron"
        ],
        "extras": {
          "Proficiency Bonus": "+4",
          "Eldritch Invocations": "7",
          "Cantrips": "3",
          "Prepared Spells": "10",
          "Spell Slots": "2",
          "Slot Level": "5"
        }
      },
      {
        "level": 10,
        "features": [
          "Subclass feature"
        ],
        "extras": {
          "Proficiency Bonus": "+4",
          "Eldritch Invocations": "7",
          "Cantrips": "4",
          "Prepared Spells": "10",
          "Spell Slots": "2",
          "Slot Level": "5"
        }
      },
      {
        "level": 11,
        "features": [
          "Mystic Arcanum (level 6 spell)"
        ],
        "extras": {
          "Proficiency Bonus": "+4",
          "Eldritch Invocations": "7",
          "Cantrips": "4",
          "Prepared Spells": "11",
          "Spell Slots": "3",
          "Slot Level": "5"
        }
      },
      {
        "level": 12,
        "features": [
          "Ability Score Improvement"
        ],
        "extras": {
          "Proficiency Bonus": "+4",
          "Eldritch Invocations": "8",
          "Cantrips": "4",
          "Prepared Spells": "11",
          "Spell Slots": "3",
          "Slot Level": "5"
        }
      },
      {
        "level": 13,
        "features": [
          "Mystic Arcanum (level 7 spell)"
        ],
        "extras": {
          "Proficiency Bonus": "+5",
          "Eldritch Invocations": "8",
          "Cantrips": "4",
          "Prepared Spells": "12",
          "Spell Slots": "3",
          "Slot Level": "5"
        }
      },
      {
        "level": 14,
        "features": [
          "Subclass feature"
        ],
        "extras": {
          "Proficiency Bonus": "+5",
          "Eldritch Invocations": "8",
          "Cantrips": "4",
          "Prepared Spells": "12",
          "Spell Slots": "3",
          "Slot Level": "5"
        }
      },
      {
        "level": 15,
        "features": [
          "Mystic Arcanum (level 8 spell)"
        ],
        "extras": {
          "Proficiency Bonus": "+5",
          "Eldritch Invocations": "9",
          "Cantrips": "4",
          "Prepared Spells": "13",
          "Spell Slots": "3",
          "Slot Level": "5"
        }
      },
      {
        "level": 16,
        "features": [
          "Ability Score Improvement"
        ],
        "extras": {
          "Proficiency Bonus": "+5",
          "Eldritch Invocations": "9",
          "Cantrips": "4",
          "Prepared Spells": "13",
          "Spell Slots": "3",
          "Slot Level": "5"
        }
      },
      {
        "level": 17,
        "features": [
          "Mystic Arcanum (level 9 spell)"
        ],
        "extras": {
          "Proficiency Bonus": "+6",
          "Eldritch Invocations": "9",
          "Cantrips": "4",
          "Prepared Spells": "14",
          "Spell Slots": "4",
          "Slot Level": "5"
        }
      },
      {
        "level": 18,
        "features": [],
        "extras": {
          "Proficiency Bonus": "+6",
          "Eldritch Invocations": "10",
          "Cantrips": "4",
          "Prepared Spells": "14",
          "Spell Slots": "4",
          "Slot Level": "5"
        }
      },
      {
        "level": 19,
        "features": [
          "Epic Boon"
        ],
        "extras": {
          "Proficiency Bonus": "+6",
          "Eldritch Invocations": "10",
          "Cantrips": "4",
          "Prepared Spells": "15",
          "Spell Slots": "4",
          "Slot Level": "5"
        }
      },
      {
        "level": 20,
        "features": [
          "Eldritch Master"
        ],
        "extras": {
          "Proficiency Bonus": "+6",
          "Eldritch Invocations": "10",
          "Cantrips": "4",
          "Prepared Spells": "15",
          "Spell Slots": "4",
          "Slot Level": "5"
        }
      }
    ],
    "features": [
      {
        "level": 1,
        "name": "Eldritch Invocations",
        "description": "You have unearthed Eldritch Invocations, pieces of forbidden knowledge that imbue you with an abiding magical ability or other lessons. You gain one invocation of your choice, such as Pact of the Tome. Invocations are described in the \"Eldritch Invocation Options\" section later in this class's description. Prerequisites. If an invocation has a prerequisite, you must meet it to learn that invocation. For example, if an invocation requires you to be a level 5+ Warlock, you can select the invocation once you reach Warlock level 5. Replacing and Gaining Invocations. Whenever you gain a Warlock level, you can replace one of your invocations with another one for which you qualify. You can't replace an invocation if it's a prerequisite for another invocation that you have. When you gain certain Warlock levels, you gain more invocations of your choice, as shown in the Invocations column of the Warlock Features table. You can't pick the same invocation more than once unless its description says otherwise."
      },
      {
        "level": 1,
        "name": "Pact Magic",
        "description": "Through occult ceremony, you have formed a pact with a mysterious entity to gain magical powers. The entity is a voice in the shadows—its identity unclear—but its boon to you is concrete: the ability to cast spells. See \"Spells\" for the rules on spellcasting. The information below details how you use those rules with Warlock spells, which appear in the Warlock spell list later in the class's description. Cantrips. You know two Warlock cantrips of your choice. *Eldritch Blast* and *Prestidigitation* are recommended. Whenever you gain a Warlock level, you can replace one of your cantrips from this feature with another Warlock cantrip of your choice. When you reach Warlock levels 4 and 10, you learn another Warlock cantrip of your choice, as shown in the Cantrips column of the Warlock Features table. Spell Slots. The Warlock Features table shows how many spell slots you have to cast your Warlock spells of levels 1–5. The table also shows the level of those slots, all of which are the same level. You regain all expended Pact Magic spell slots when you finish a Short or Long Rest. For example, when you're a level 5 Warlock, you have two level 3 spell slots. To cast the level 1 spell *Charm Person*, you must spend one of those slots, and you cast it as a level 3 spell. Prepared Spells of Level 1+. You prepare the list of level 1+ spells that are available for you to cast with this feature. To start, choose two level 1 Warlock spells. *Charm Person* and *Hex* are recommended. The number of spells on your list increases as you gain Warlock levels, as shown in the Prepared Spells column of the Warlock Features table. Whenever that number increases, choose additional Warlock spells until the number of spells on your list matches the number in the table. The chosen spells must be…"
      },
      {
        "level": 2,
        "name": "Magical Cunning",
        "description": "You can perform an esoteric rite for 1 minute. At the end of it, you regain expended Pact Magic spell slots but no more than a number equal to half your maximum (round up). Once you use this feature, you can't do so again until you finish a Long Rest."
      },
      {
        "level": 3,
        "name": "Warlock Subclass",
        "description": "You gain a Warlock subclass of your choice. The Fiend Patron subclass is detailed after this class's description. A subclass is a specialization that grants you features at certain Warlock levels. For the rest of your career, you gain each of your subclass's features that are of your Warlock level or lower."
      },
      {
        "level": 4,
        "name": "Ability Score Improvement",
        "description": "You gain the Ability Score Improvement feat (see \"Feats\") or another feat of your choice for which you qualify. You gain this feature again at Warlock levels 8, 12, and 16."
      },
      {
        "level": 9,
        "name": "Contact Patron",
        "description": "In the past, you usually contacted your patron through intermediaries. Now you can communicate directly; you always have the *Contact Other Plane* spell prepared. With this feature, you can cast the spell without expending a spell slot to contact your patron, and you automatically succeed on the spell's saving throw. Once you cast the spell with this feature, you can't do so in this way again until you finish a Long Rest."
      },
      {
        "level": 11,
        "name": "Mystic Arcanum",
        "description": "Your patron grants you a magical secret called an arcanum. Choose one level 6 Warlock spell as this arcanum. You can cast your arcanum spell once without expending a spell slot, and you must finish a Long Rest before you can cast it in this way again. As shown in the Warlock Features table, you gain another Warlock spell of your choice that can be cast in this way when you reach Warlock levels 13 (level 7 spell), 15 (level 8 spell), and 17 (level 9 spell). You regain all uses of your Mystic Arcanum when you finish a Long Rest. Whenever you gain a Warlock level, you can replace one of your arcanum spells with another Warlock spell of the same level."
      },
      {
        "level": 19,
        "name": "Epic Boon",
        "description": "You gain an Epic Boon feat (see \"Feats\") or another feat of your choice for which you qualify. Boon of Fate is recommended."
      },
      {
        "level": 20,
        "name": "Eldritch Master",
        "description": "When you use your Magical Cunning feature, you regain all your expended Pact Magic spell slots."
      }
    ],
    "subclasses": [
      {
        "id": "fiend-patron",
        "name": "Fiend Patron",
        "features": [
          {
            "level": 3,
            "name": "Dark One's Blessing",
            "description": "When you reduce an enemy to 0 Hit Points, you gain Temporary Hit Points equal to your Charisma modifier plus your Warlock level (minimum of 1 Temporary Hit Point). You also gain this benefit if someone else reduces an enemy within 10 feet of you to 0 Hit Points."
          },
          {
            "level": 3,
            "name": "Fiend Spells",
            "description": "The magic of your patron ensures you always have certain spells ready; when you reach a Warlock level specified in the Fiend Spells table, you thereafter always have the listed spells prepared. Table: Fiend Spells | Warlock Level | Spells | |---------------|---------------------------------------------------| | 3 | Burning Hands, Command, Scorching Ray, Suggestion | | 5 | Fireball, Stinking Cloud | | 7 | Fire Shield, Wall of Fire | | 9 | Geas, Insect Plague |"
          },
          {
            "level": 6,
            "name": "Dark One's Own Luck",
            "description": "You can call on your fiendish patron to alter fate in your favor. When you make an ability check or a saving throw, you can use this feature to add 1d10 to your roll. You can do so after seeing the roll but before any of the roll's effects occur. You can use this feature a number of times equal to your Charisma modifier (minimum of once), but you can use it no more than once per roll. You regain all expended uses when you finish a Long Rest."
          },
          {
            "level": 10,
            "name": "Fiendish Resilience",
            "description": "Choose one damage type, other than Force, whenever you finish a Short or Long Rest. You have Resistance to that damage type until you choose a different one with this feature."
          },
          {
            "level": 14,
            "name": "Hurl Through Hell",
            "description": "Once per turn when you hit a creature with an attack roll, you can try to instantly transport the target through the Lower Planes. The target must succeed on a Charisma saving throw against your spell save DC, or the target disappears and hurtles through a nightmare landscape. The target takes 8d10 Psychic damage if it isn't a Fiend, and it has the Incapacitated condition until the end of your next turn, when it returns to the space it previously occupied or the nearest unoccupied space. Once you use this feature, you can't use it again until you finish a Long Rest unless you expend a Pact Magic spell slot (no action required) to restore your use of it. --- ## Additional Subclasses"
          }
        ]
      },
      {
        "id": "archfey-patron",
        "name": "Archfey Patron",
        "features": [
          {
            "level": 3,
            "name": "Archfey Spells",
            "description": "The magic of your patron ensures you always have certain spells ready; when you reach a Warlock level specified in the Archfey Spells table, you thereafter always have the listed spells prepared. Table: Archfey Spells | Warlock Level | Spells | | --- | --- | | 3 | Calm Emotions, Faerie Fire, Misty Step, Phantasmal Force, Sleep | | 5 | Blink, Plant Growth | | 7 | Dominate Beast, Greater Invisibility | | 9 | Dominate Person, Seeming |"
          },
          {
            "level": 3,
            "name": "Steps Of The Fey",
            "description": "Your patron grants you the ability to move between the boundaries of the planes. You can cast Misty Step without expending a spell slot a number of times equal to your Charisma modifier (minimum of once), and you regain all expended uses when you finish a Long Rest. In addition, whenever you cast that spell, you can choose one of the following additional effects. Refreshing Step. Immediately after you teleport, you or one creature you can see within 10 feet of yourself gains 1d10 Temporary Hit Points. Taunting Step. Creatures within 5 feet of the space you left must succeed on a Wisdom saving throw against your spell save DC or have Disadvantage on attack rolls against creatures other than you until the start of your next turn."
          },
          {
            "level": 6,
            "name": "Misty Escape",
            "description": "You can cast Misty Step as a Reaction in response to taking damage. In addition, the following effects are now among your Steps of the Fey options. Disappearing Step. You have the Invisible condition until the start of your next turn or until immediately after you make an attack roll, deal damage, or cast a spell. Dreadful Step. Creatures within 5 feet of the space you left or the space you appear in (your choice) must succeed on a Wisdom saving throw against your spell save DC or take 2d10 Psychic damage."
          },
          {
            "level": 10,
            "name": "Beguiling Defenses",
            "description": "Your patron teaches you how to guard your mind and body. You are immune to the Charmed condition. In addition, immediately after a creature you can see hits you with an attack roll, you can take a Reaction to reduce the damage you take by half (round down), and you can force the attacker to make a Wisdom saving throw against your spell save DC. On a failed save, the attacker takes Psychic damage equal to the damage you take. Once you use this Reaction, you can’t use it again until you finish a Long Rest unless you expend a Pact Magic spell slot (no action required) to restore your use of it."
          },
          {
            "level": 14,
            "name": "Bewitching Magic",
            "description": "Your patron grants you the ability to weave your magic with teleportation. Immediately after you cast an Enchantment or Illusion spell using an action and a spell slot, you can cast Misty Step as part of the same action and without expending a spell slot."
          }
        ]
      },
      {
        "id": "celestial-patron",
        "name": "Celestial Patron",
        "features": [
          {
            "level": 3,
            "name": "Celestial Spells",
            "description": "The magic of your patron ensures you always have certain spells ready; when you reach a Warlock level specified in the Celestial Spells table, you thereafter always have the listed spells prepared. Table: Celestial Spells | Warlock Level | Spells | | --- | --- | | 3 | Aid, Cure Wounds, Guiding Bolt, Lesser Restoration, Light, Sacred Flame | | 5 | Daylight, Revivify | | 7 | Guardian of Faith, Wall of Fire | | 9 | Greater Restoration, Summon Celestial |"
          },
          {
            "level": 3,
            "name": "Healing Light",
            "description": "You gain the ability to channel celestial energy to heal wounds. You have a pool of d6s tofuel this healing. The number of dice in the pool equals 1 plus your Warlock level. As a Bonus Action, you can heal yourself or one creature you can see within 60 feet of yourself, expending dice from the pool. The maximum number of dice you can expend at once equals your Charisma modifier (minimum of one die). Roll the dice you expend, and restore a number of Hit Points equal to the roll’s total. Your pool regains all expended dice when you finish a Long Rest."
          },
          {
            "level": 6,
            "name": "Radiant Soul",
            "description": "Your link to your patron allows you to serve as a conduit for radiant energy. You have Resistance to Radiant damage. Once per turn, when a spell you cast deals Radiant or Fire damage, you can add your Charisma modifier to that spell’s damage against one of the spell’s targets."
          },
          {
            "level": 10,
            "name": "Celestial Resilience",
            "description": "You gain Temporary Hit Points whenever you use your Magical Cunning feature or finish a Short or Long Rest. These Temporary Hit Points equal your Warlock level plus your Charisma modifier. Additionally, choose up tofive creatures you can see when you gain the points. Those creatures each gain Temporary Hit Points equal to half your Warlock level plus your Charisma modifier."
          },
          {
            "level": 14,
            "name": "Searing Vengeance",
            "description": "When you or an ally within 60 feet of you is about to make a Death Saving Throw, you can unleash radiant energy to save the creature. The creature regains Hit Points equal to half its Hit Point maximum and can end the Prone condition on itself. Each creature of your choice that is within 30 feet of the creature takes Radiant damage equal to 2d8 plus your Charisma modifier, and each has the Blinded condition until the end of the current turn. Once you use this feature, you can’t use it again until you finish a Long Rest."
          }
        ]
      },
      {
        "id": "great-old-one-patron",
        "name": "Great Old One Patron",
        "features": [
          {
            "level": 3,
            "name": "Awakened Mind",
            "description": "You can form a telepathic connection between your mind and the mind of another. As a Bonus Action, choose one creature you can see within 30 feet of yourself. You and the chosen creature can communicate telepathically with each other while the two of you are within a number of miles of each other equal to your Charisma modifier (minimum of 1 mile). To understand each other, you each must mentally use a language the other knows. The telepathic connection lasts for a number of minutes equal to your Warlock level. It ends early if you use this feature to connect with a different creature."
          },
          {
            "level": 3,
            "name": "Great Old One Spells",
            "description": "The magic of your patron ensures you always have certain spells ready; when you reach a Warlock level specified in the Great Old One Spells table, you thereafter always have the listed spells prepared. Table: Great Old One Spells | Warlock Level | Spells | | --- | --- | | 3 | Detect Thoughts, Dissonant Whispers, Phantasmal Force, Tasha's Hideous Laughter | | 5 | Clairvoyance, Hunger of Hadar | | 7 | Confusion, Summon Aberration | | 9 | Modify Memory, Telekinesis |"
          },
          {
            "level": 3,
            "name": "Psychic Spells",
            "description": "When you cast a Warlock spell that deals damage, you can change its damage type to Psychic. In addition, when you cast a Warlock spell that is an Enchantment or Illusion, you can do so without Verbal or Somatic components."
          },
          {
            "level": 6,
            "name": "Clairvoyant Combatant",
            "description": "When you form a telepathic bond with a creature using your Awakened Mind, you can force that creature to make a Wisdom saving throw against your spell save DC. On a failed save, the creature has Disadvantage on attack rolls against you, and you have Advantage on attack rolls against that creature for the duration of the bond. Once you use this feature, you can’t use it again until you finish a Short or Long Rest unless you expend a Pact Magic spell slot (no action required) to restore your use of it."
          },
          {
            "level": 10,
            "name": "Eldritch Hex",
            "description": "Your alien patron grants you a powerful curse. You always have the Hex spell prepared. When you cast Hex and choose an ability, the target also has Disadvantage on saving throws of the chosen ability for the duration of the spell."
          },
          {
            "level": 10,
            "name": "Thought Shield",
            "description": "Your thoughts can’t be read by telepathy or other means unless you allow it. You also have Resistance to Psychic damage, and whenever a creature deals Psychic damage to you, that creature takes the same amount of damage that you take."
          },
          {
            "level": 14,
            "name": "Create Thrall",
            "description": "When you cast Summon Aberration, you can modify it so that it doesn’t require Concentration. If you do so, the spell’s duration becomes 1 minute for that casting, and when summoned, the Aberration has a number of Temporary Hit Points equal to your Warlock level plus your Charisma modifier. In addition, the first time each turn the Aberration hits a creature under the effect of your Hex, the Aberration deals extra Psychic damage to the target equal to the bonus damage of that spell."
          }
        ]
      }
    ]
  },
  {
    "id": "wizard",
    "name": "Wizard",
    "coreTraits": {
      "Primary Ability": "Intelligence",
      "Hit Point Die": "D6 per Wizard level",
      "Saving Throw Proficiencies": "Intelligence and Wisdom",
      "Skill Proficiencies": "Choose 2: Arcana, History, In sight, Investigation, Medicine, Nature, or Religion",
      "Weapon Proficiencies": "Simple weapons",
      "Armor Training": "None",
      "Starting Equipment": "Choose A or B: (A) 2 Daggers, Arcane Focus (Quarterstaff), Robe, Spellbook, Scholar's Pack, and 5 GP; or (B) 55 GP"
    },
    "progression": [
      {
        "level": 1,
        "features": [
          "Spellcasting",
          "Ritual Adept",
          "Arcane Recovery"
        ],
        "extras": {
          "Proficiency Bonus": "+2",
          "Cantrips": "3",
          "Prepared Spells": "4",
          "1": "2"
        }
      },
      {
        "level": 2,
        "features": [
          "Scholar"
        ],
        "extras": {
          "Proficiency Bonus": "+2",
          "Cantrips": "3",
          "Prepared Spells": "5",
          "1": "3"
        }
      },
      {
        "level": 3,
        "features": [
          "Wizard Subclass"
        ],
        "extras": {
          "Proficiency Bonus": "+2",
          "Cantrips": "3",
          "Prepared Spells": "6",
          "1": "4",
          "2": "2"
        }
      },
      {
        "level": 4,
        "features": [
          "Ability Score Improvement"
        ],
        "extras": {
          "Proficiency Bonus": "+2",
          "Cantrips": "4",
          "Prepared Spells": "7",
          "1": "4",
          "2": "3"
        }
      },
      {
        "level": 5,
        "features": [
          "Memorize Spell"
        ],
        "extras": {
          "Proficiency Bonus": "+3",
          "Cantrips": "4",
          "Prepared Spells": "9",
          "1": "4",
          "2": "3",
          "3": "2"
        }
      },
      {
        "level": 6,
        "features": [
          "Subclass feature"
        ],
        "extras": {
          "Proficiency Bonus": "+3",
          "Cantrips": "4",
          "Prepared Spells": "10",
          "1": "4",
          "2": "3",
          "3": "3"
        }
      },
      {
        "level": 7,
        "features": [],
        "extras": {
          "Proficiency Bonus": "+3",
          "Cantrips": "4",
          "Prepared Spells": "11",
          "1": "4",
          "2": "3",
          "3": "3",
          "4": "1"
        }
      },
      {
        "level": 8,
        "features": [
          "Ability Score Improvement"
        ],
        "extras": {
          "Proficiency Bonus": "+3",
          "Cantrips": "4",
          "Prepared Spells": "12",
          "1": "4",
          "2": "3",
          "3": "3",
          "4": "2"
        }
      },
      {
        "level": 9,
        "features": [],
        "extras": {
          "Proficiency Bonus": "+4",
          "Cantrips": "4",
          "Prepared Spells": "14",
          "1": "4",
          "2": "3",
          "3": "3",
          "4": "3",
          "5": "1"
        }
      },
      {
        "level": 10,
        "features": [
          "Subclass feature"
        ],
        "extras": {
          "Proficiency Bonus": "+4",
          "Cantrips": "5",
          "Prepared Spells": "15",
          "1": "4",
          "2": "3",
          "3": "3",
          "4": "3",
          "5": "2"
        }
      },
      {
        "level": 11,
        "features": [],
        "extras": {
          "Proficiency Bonus": "+4",
          "Cantrips": "5",
          "Prepared Spells": "16",
          "1": "4",
          "2": "3",
          "3": "3",
          "4": "3",
          "5": "2",
          "6": "1"
        }
      },
      {
        "level": 12,
        "features": [
          "Ability Score Improvement"
        ],
        "extras": {
          "Proficiency Bonus": "+4",
          "Cantrips": "5",
          "Prepared Spells": "16",
          "1": "4",
          "2": "3",
          "3": "3",
          "4": "3",
          "5": "2",
          "6": "1"
        }
      },
      {
        "level": 13,
        "features": [],
        "extras": {
          "Proficiency Bonus": "+5",
          "Cantrips": "5",
          "Prepared Spells": "17",
          "1": "4",
          "2": "3",
          "3": "3",
          "4": "3",
          "5": "2",
          "6": "1",
          "7": "1"
        }
      },
      {
        "level": 14,
        "features": [
          "Subclass feature"
        ],
        "extras": {
          "Proficiency Bonus": "+5",
          "Cantrips": "5",
          "Prepared Spells": "18",
          "1": "4",
          "2": "3",
          "3": "3",
          "4": "3",
          "5": "2",
          "6": "1",
          "7": "1"
        }
      },
      {
        "level": 15,
        "features": [],
        "extras": {
          "Proficiency Bonus": "+5",
          "Cantrips": "5",
          "Prepared Spells": "19",
          "1": "4",
          "2": "3",
          "3": "3",
          "4": "3",
          "5": "2",
          "6": "1",
          "7": "1",
          "8": "1"
        }
      },
      {
        "level": 16,
        "features": [
          "Ability Score Improvement"
        ],
        "extras": {
          "Proficiency Bonus": "+5",
          "Cantrips": "5",
          "Prepared Spells": "21",
          "1": "4",
          "2": "3",
          "3": "3",
          "4": "3",
          "5": "2",
          "6": "1",
          "7": "1",
          "8": "1"
        }
      },
      {
        "level": 17,
        "features": [],
        "extras": {
          "Proficiency Bonus": "+6",
          "Cantrips": "5",
          "Prepared Spells": "22",
          "1": "4",
          "2": "3",
          "3": "3",
          "4": "3",
          "5": "2",
          "6": "1",
          "7": "1",
          "8": "1",
          "9": "1"
        }
      },
      {
        "level": 18,
        "features": [
          "Spell Mastery"
        ],
        "extras": {
          "Proficiency Bonus": "+6",
          "Cantrips": "5",
          "Prepared Spells": "23",
          "1": "4",
          "2": "3",
          "3": "3",
          "4": "3",
          "5": "3",
          "6": "1",
          "7": "1",
          "8": "1",
          "9": "1"
        }
      },
      {
        "level": 19,
        "features": [
          "Epic Boon"
        ],
        "extras": {
          "Proficiency Bonus": "+6",
          "Cantrips": "5",
          "Prepared Spells": "24",
          "1": "4",
          "2": "3",
          "3": "3",
          "4": "3",
          "5": "3",
          "6": "2",
          "7": "1",
          "8": "1",
          "9": "1"
        }
      },
      {
        "level": 20,
        "features": [
          "Signature Spells"
        ],
        "extras": {
          "Proficiency Bonus": "+6",
          "Cantrips": "5",
          "Prepared Spells": "25",
          "1": "4",
          "2": "3",
          "3": "3",
          "4": "3",
          "5": "3",
          "6": "2",
          "7": "2",
          "8": "1",
          "9": "1"
        }
      }
    ],
    "features": [
      {
        "level": 1,
        "name": "Spellcasting",
        "description": "As a student of arcane magic, you have learned to cast spells. See \"Spells\" for the rules on spellcasting. The information below details how you use those rules with Wizard spells, which appear in the Wizard spell list later in the class's description. Cantrips. You know three Wizard cantrips of your choice. *Light*, *Mage Hand*, and *Ray of Frost* are recommended. Whenever you finish a Long Rest, you can replace one of your cantrips from this feature with another Wizard cantrip of your choice. When you reach Wizard levels 4 and 10, you learn another Wizard cantrip of your choice, as shown in the Cantrips column of the Wizard Features table. Spellbook. Your wizardly apprenticeship culminated in the creation of a unique book: your spellbook. It is a Tiny object that weighs 3 pounds, contains 100 pages, and can be read only by you or someone casting *Identify*. You determine the book's appearance and materials, such as a gilt-edged tome or a collection of vellum bound with twine. The book contains the level 1+ spells you know. It starts with six level 1 Wizard spells of your choice. *Detect Magic*, *Feather Fall*, *Mage Armor*, *Magic Missile*, *Sleep*, and *Thunderwave* are recommended. Whenever you gain a Wizard level after 1, add two Wizard spells of your choice to your spellbook. Each of these spells must be of a level for which you have spell slots, as shown in the Wizard Features table. The spells are the culmination of arcane research you do regularly. Spell Slots. The Wizard Features table shows how many spell slots you have to cast your level 1+ spells. You regain all expended slots when you finish a Long Rest. Prepared Spells of Level 1+. You prepare the list of level 1+ spells that are available for you to cast with this feature. To do so, choose four spells…"
      },
      {
        "level": 1,
        "name": "Ritual Adept",
        "description": "You can cast any spell as a Ritual if that spell has the Ritual tag and the spell is in your spellbook. You needn't have the spell prepared, but you must read from the book to cast a spell in this way."
      },
      {
        "level": 1,
        "name": "Arcane Recovery",
        "description": "You can regain some of your magical energy by studying your spellbook. When you finish a Short Rest, you can choose expended spell slots to recover. The spell slots can have a combined level equal to no more than half your Wizard level (round up), and none of the slots can be level 6 or higher. For example, if you're a level 4 Wizard, you can recover up to two levels' worth of spell slots, regaining either one level 2 spell slot or two level 1 spell slots. Once you use this feature, you can't do so again until you finish a Long Rest."
      },
      {
        "level": 2,
        "name": "Scholar",
        "description": "While studying magic, you also specialized in another field of study. Choose one of the following skills in which you have proficiency: Arcana, History, Investigation, Medicine, Nature, or Religion. You have Expertise in the chosen skill."
      },
      {
        "level": 3,
        "name": "Wizard Subclass",
        "description": "You gain a Wizard subclass of your choice. The Evoker subclass is detailed after this class's description. A subclass is a specialization that grants you features at certain Wizard levels. For the rest of your career, you gain each of your subclass's features that are of your Wizard level or lower. > ### Expanding and Replacing a Spellbook > > The spells you add to your spellbook as you gain levels reflect your ongoing magical research, but you might find other spells during your adventures that you can add to the book. You could discover a Wizard spell on a *Spell Scroll*, for example, and then copy it into your spellbook. > > Copying a Spell into the Book. When you find a level 1+ Wizard spell, you can copy it into your spellbook if it's of a level you can prepare and if you have time to copy it. For each level of the spell, the transcription takes 2 hours and costs 50 GP. Afterward you can prepare the spell like the other spells in your spellbook. > > Copying the Book. You can copy a spell from your spellbook into another book. This is like copying a new spell into your spellbook but faster, since you already know how to cast the spell. You need spend only 1 hour and 10 GP for each level of the copied spell. > > If you lose your spellbook, you can use the same procedure to transcribe the Wizard spells that you have prepared into a new spellbook. Filling out the remainder of the new book requires you to find new spells to do so. For this reason, many wizards keep a backup spellbook."
      },
      {
        "level": 4,
        "name": "Ability Score Improvement",
        "description": "You gain the Ability Score Improvement feat (see \"Feats\") or another feat of your choice for which you qualify. You gain this feature again at Wizard levels 8, 12, and 16."
      },
      {
        "level": 5,
        "name": "Memorize Spell",
        "description": "Whenever you finish a Short Rest, you can study your spellbook and replace one of the level 1+ Wizard spells you have prepared for your Spellcasting feature with another level 1+ spell from the book."
      },
      {
        "level": 18,
        "name": "Spell Mastery",
        "description": "You have achieved such mastery over certain spells that you can cast them at will. Choose a level 1 and a level 2 spell in your spellbook that have a casting time of an action. You always have those spells prepared, and you can cast them at their lowest level without expending a spell slot. To cast either spell at a higher level, you must expend a spell slot. Whenever you finish a Long Rest, you can study your spellbook and replace one of those spells with an eligible spell of the same level from the book."
      },
      {
        "level": 19,
        "name": "Epic Boon",
        "description": "You gain an Epic Boon feat (see \"Feats\") or another feat of your choice for which you qualify. Boon of Spell Recall is recommended."
      },
      {
        "level": 20,
        "name": "Signature Spells",
        "description": "Choose two level 3 spells in your spellbook as your signature spells. You always have these spells prepared, and you can cast each of them once at level 3 without expending a spell slot. When you do so, you can't cast them in this way again until you finish a Short or Long Rest. To cast either spell at a higher level, you must expend a spell slot."
      }
    ],
    "subclasses": [
      {
        "id": "evoker",
        "name": "Evoker",
        "features": [
          {
            "level": 3,
            "name": "Evocation Savant",
            "description": "Choose two Wizard spells from the Evocation school, each of which must be no higher than level 2, and add them to your spellbook for free. In addition, whenever you gain access to a new level of spell slots in this class, you can add one Wizard spell from the Evocation school to your spellbook for free. The chosen spell must be of a level for which you have spell slots."
          },
          {
            "level": 3,
            "name": "Potent Cantrip",
            "description": "Your damaging cantrips affect even creatures that avoid the brunt of the effect. When you cast a cantrip at a creature and you miss with the attack roll or the target succeeds on a saving throw against the cantrip, the target takes half the cantrip's damage (if any) but suffers no additional effect from the cantrip."
          },
          {
            "level": 6,
            "name": "Sculpt Spells",
            "description": "You can create pockets of relative safety within the effects of your evocations. When you cast an Evocation spell that affects other creatures that you can see, you can choose a number of them equal to 1 plus the spell's level. The chosen creatures automatically succeed on their saving throws against the spell, and they take no damage if they would normally take half damage on a successful save."
          },
          {
            "level": 10,
            "name": "Empowered Evocation",
            "description": "Whenever you cast a Wizard spell from the Evocation school, you can add your Intelligence modifier to one damage roll of that spell."
          },
          {
            "level": 14,
            "name": "Overchannel",
            "description": "You can increase the power of your spells. When you cast a Wizard spell with a spell slot of levels 1–5 that deals damage, you can deal maximum damage with that spell on the turn you cast it. The first time you do so, you suffer no adverse effect. If you use this feature again before you finish a Long Rest, you take 2d12 Necrotic damage for each level of the spell slot immediately after you cast it. This damage ignores Resistance and Immunity. Each time you use this feature again before finishing a Long Rest, the Necrotic damage per spell level increases by 1d12. --- ## Additional Subclasses"
          }
        ]
      },
      {
        "id": "abjurer",
        "name": "Abjurer",
        "features": [
          {
            "level": 3,
            "name": "Abjuration Savant",
            "description": "Choose two Wizard spells from the Abjuration school, each of which must be no higher than level 2, and add them to your spellbook for free. In addition, whenever you gain access to a new level of spell slots in this class, you can add one Wizard spell from the Abjuration school to your spellbook for free. The chosen spell must be of a level for which you have spell slots."
          },
          {
            "level": 3,
            "name": "Arcane Ward",
            "description": "You can weave magic around yourself for protection. When you cast an Abjuration spell with a spell slot, you can simultaneously use a strand of the spell's magic to create a magical ward on yourself that lasts until you finish a Long Rest. The ward has a Hit Point maximum equal to twice your Wizard level plus your Intelligence modifier. Whenever you take damage, the ward takes the damage instead, and if you have any Resistances or Vulnerabilities, apply them before reducing the ward’s Hit Points. If the damage reduces the ward to 0 Hit Points, you take any remaining damage. While the ward has 0 Hit Points, it can’t absorb damage, but its magic remains. Whenever you cast an Abjuration spell with a spell slot, the ward regains a number of Hit Points equal to twice the level of the spell slot. Alternatively, as a Bonus Action, you can expend a spell slot, and the ward regains a number of Hit Points equal to twice the level of the spell slot expended. Once you create the ward, you can't create it again until you finish a Long Rest."
          },
          {
            "level": 6,
            "name": "Projected Ward",
            "description": "When a creature that you can see within 30 feet of yourself takes damage, you can take a Reaction to cause your Arcane Ward to absorb that damage. If this damage reduces the ward to 0 Hit Points, the warded creature takes any remaining damage. If that creature has any Resistances or Vulnerabilities, apply them before reducing the ward's Hit Points."
          },
          {
            "level": 10,
            "name": "Spell Breaker",
            "description": "You always have the Counterspell and Dispel Magic spells prepared. In addition, you can cast Dispel Magic as a Bonus Action, and you can add your Proficiency Bonus to its ability check. When you cast either spell with a spell slot, that slot isn't expended if the spell fails to stop a spell."
          },
          {
            "level": 14,
            "name": "Spell Resistance",
            "description": "You have Advantage on saving throws against spells, and you have Resistance to the damage of spells."
          }
        ]
      },
      {
        "id": "bladesinger",
        "name": "Bladesinger",
        "features": [
          {
            "level": 3,
            "name": "Bladesong",
            "description": "As a Bonus Action, you invoke an elven magic called the Bladesong, provided you aren’t wearing armor or using a Shield. The Bladesong lasts for 1 minute and ends early if you have the Incapacitated condition, if you don armor or a Shield, or if you use two hands to make an attack with a weapon. You can dismiss the Bladesong at any time (no action required). While the Bladesong is active, you gain the following benefits. You can invoke the Bladesong a number of times equal to your Intelligence modifier (minimum of once), and you regain all expended uses when you finish a Long Rest. You regain one expended use when you use Arcane Recovery. Agility. You gain a bonus to your AC equal to your Intelligence modifier (minimum of +1), and your Speed increases by 10 feet. In addition, you have Advantage on Dexterity (Acrobatics) checks. Bladework. Whenever you attack with a weapon with which you have proficiency, you can use your Intelligence modifier for the attack and damage rolls instead of using Strength or Dexterity. Focus. When you make a Constitution saving throw to maintain Concentration, you can add your Intelligence modifier to the total."
          },
          {
            "level": 3,
            "name": "Training in War and Song",
            "description": "You gain proficiency with all Melee Martial weapons that don’t have the Two-Handed or Heavy property. You can use a Melee weapon with which you have proficiency as a Spellcasting Focus for your Wizard spells. You also gain proficiency in one of the following skills of your choice: Acrobatics, Athletics, Performance, or Persuasion."
          },
          {
            "level": 6,
            "name": "Extra Attack",
            "description": "You can attack twice, instead of once, whenever you take the Attack action on your turn. Moreover, you can cast one of your Wizard cantrips that has a casting time of an action in place of one of those attacks."
          },
          {
            "level": 10,
            "name": "Song of Defense",
            "description": "When you take damage while your Bladesong is active, you can take a Reaction to expend one spell slot and reduce the damage taken by an amount equal to five times the spell slot’s level."
          },
          {
            "level": 14,
            "name": "Song of Victory",
            "description": "After you cast a spell that has a casting time of an action, you can make one attack with a weapon as a Bonus Action."
          }
        ]
      },
      {
        "id": "diviner",
        "name": "Diviner",
        "features": [
          {
            "level": 3,
            "name": "Divination Savant",
            "description": "Choose two Wizard spells from the Divination school, each of which must be no higher than level 2, and add them to your spellbook for free. In addition, whenever you gain access to a new level of spell slots in this class, you can add one Wizard spell from the Divination school to your spellbook for free. The chosen spell must be of a level for which you have spell slots."
          },
          {
            "level": 3,
            "name": "Portent",
            "description": "Glimpses of the future begin to press on your awareness. Whenever you finish a Long Rest, roll two d20s and record the numbers rolled. You can replace any D20 Test made by you or a creature that you can see with one of these foretelling rolls. You must choose to do so before the roll, and you can replace a roll in this way only once per turn. Each foretelling roll can be used only once. When you finish a Long Rest, you lose any unused foretelling rolls."
          },
          {
            "level": 6,
            "name": "Expert Divination",
            "description": "Casting Divination spells comes so easily to you that it expends only a fraction of your spellcasting efforts. When you cast a Divination spell using a level 2+ spell slot, you regain one expended spell slot. The slot you regain must be of a level lower than the slot you expended and can't be higher than level 5."
          },
          {
            "level": 10,
            "name": "The Third Eye",
            "description": "You can increase your powers of perception. As a Bonus Action, choose one of the following benefits, which lasts until you start a Short or Long Rest. You can't use this feature again until you finish a Short or Long Rest. Darkvision. You gain Darkvision with a range of 120 feet. Greater Comprehension. You can read any language. See Invisibility. You can cast See Invisibility without expending a spell slot."
          },
          {
            "level": 14,
            "name": "Greater Portent",
            "description": "The visions in your dreams intensify and paint a more accurate picture in your mind of what is to come. Roll three d20s for your Portent feature rather than two."
          }
        ]
      },
      {
        "id": "illusionist",
        "name": "Illusionist",
        "features": [
          {
            "level": 3,
            "name": "Illusion Savant",
            "description": "Choose two Wizard spells from the Illusion school, each of which must be no higher than level 2, and add them to your spellbook for free. In addition, whenever you gain access to a new level of spell slots in this class, you can add one Wizard spell from the Illusion school to your spellbook for free. The chosen spell must be of a level for which you have spell slots."
          },
          {
            "level": 3,
            "name": "Improved Illusions",
            "description": "You can cast Illusion spells without providing Verbal components, and if an Illusion spell you cast has a range of 10+ feet, the range increases by 60 feet. You also know the Minor Illusion cantrip. If you already know it, you learn a different Wizard cantrip of your choice. The cantrip doesn’t count against your number of cantrips known. You can create both a sound and an image with a single casting of Minor Illusion, and you can cast it as a Bonus Action."
          },
          {
            "level": 6,
            "name": "Phantasmal Creatures",
            "description": "You always have the Summon Beast and Summon Fey spells prepared. Whenever you cast either spell, you can change its school to Illusion, which causes the summoned creature to appear spectral. You can cast the Illusion version of each spell without expending a spell slot, but casting it without a slot halves the creature’s Hit Points. Once you cast either spell without a spell slot, you must finish a Long Rest before you can cast the spell in that way again."
          },
          {
            "level": 10,
            "name": "Illusory Self",
            "description": "When a creature hits you with an attack roll, you can take a Reaction to interpose an illusory duplicate of yourself between the attacker and yourself. The attack automatically misses you, then the illusion dissipates. Once you use this feature, you can't use it again until you finish a Short or Long Rest. You can also restore your use of it by expending a level 2+ spell slot (no action required)."
          },
          {
            "level": 14,
            "name": "Illusory Reality",
            "description": "You have learned to weave shadow magic into your illusions to give them a semi-reality. When you cast an Illusion spell with a spell slot, you can choose one inanimate, nonmagical object that is part of the illusion and make that object real. You can do this on your turn as a Bonus Action while the spell is ongoing. The object remains real for 1 minute, during which it can't deal damage or give any conditions. For example, you can create an illusion of a bridge over a chasm and then make it real and cross it."
          }
        ]
      }
    ]
  }
  , BLOOD_HUNTER_CLASS
  , ARTIFICER_CLASS
] satisfies CharacterClassInfo[];

export const getClassInfo = (classId?: string) =>
  DND_2024_CLASSES.find((entry) => entry.id === classId);

export const getSubclassInfo = (classId?: string, subclassId?: string) =>
  getClassInfo(classId)?.subclasses.find((entry) => entry.id === subclassId);
