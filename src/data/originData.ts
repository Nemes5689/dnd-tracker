import type { BackgroundInfo, SpeciesInfo, FeatInfo } from '@/types/origins';

export const DND_2024_BACKGROUNDS: BackgroundInfo[] = [
  {
    "id": "background-acolyte",
    "name": "Acolyte",
    "source": "Player's Handbook",
    "description": "You devoted yourself to service in a temple, either nestled in a town or secluded in a sacred grove. There you performed rites in honor of a god or pantheon. You served under a priest and studied religion. Thanks to your priest's instruction and your own devotion, you also learned how to channel a modicum of divine power in service to your place of worship and the people who prayed there.",
    "ability_scores": "Intelligence, Wisdom, Charisma",
    "feat": "Magic Initiate (Cleric)",
    "skill_proficiencies": "Insight and Religion",
    "tool_proficiency": "Calligrapher's Supplies",
    "equipment": "Choose A or B: (A) Calligrapher’s Supplies, Book (prayers), Holy Symbol, Parchment (10 sheets), Robe, 8 GP; or (B) 50 GP",
    "is_custom": false
  },
  {
    "id": "background-artisan",
    "name": "Artisan",
    "source": "Player's Handbook",
    "description": "You began mopping floors and scrubbing counters in an artisan’s workshop for a few coppers per day as soon as you were strong enough to carry a bucket. When you were old enough to apprentice, you learned to create basic crafts of your own, as well as how to sweet-talk the occasional demanding customer. Your trade has also given you a keen eye for detail.",
    "ability_scores": "Strength, Dexterity, Intelligence",
    "feat": "Crafter",
    "skill_proficiencies": "Investigation and Persuasion",
    "tool_proficiency": "Choose one kind of Artisan’s Tools",
    "equipment": "Choose A or B: (A) Artisan's Tools (same as above), 2 Pouches, Traveler’s Clothes, 32 GP; or (B) 50 GP",
    "is_custom": false
  },
  {
    "id": "background-charlatan",
    "name": "Charlatan",
    "source": "Player's Handbook",
    "description": "Once you were old enough to order an ale, you soon had a favorite stool in every tavern within ten miles of where you were born. As you traveled the circuit from public house to watering hole, you learned to prey on unfortunates who were in the market for a comforting lie or two—perhaps a sham potion or forged ancestry records.",
    "ability_scores": "Dexterity, Constitution, Charisma",
    "feat": "Skilled",
    "skill_proficiencies": "Deception and Sleight of Hand",
    "tool_proficiency": "Forgery Kit",
    "equipment": "Choose A or B: (A) Forgery Kit, Costume, Fine Clothes, 15 GP; or (B) 50 GP",
    "is_custom": false
  },
  {
    "id": "background-criminal",
    "name": "Criminal",
    "source": "Player's Handbook",
    "description": "You eked out a living in dark alleyways, cutting purses or burgling shops. Perhaps you were part of a small gang of like-minded wrongdoers who looked out for each other. Or maybe you were a lone wolf, fending for yourself against the local thieves' guild and more fearsome lawbreakers.",
    "ability_scores": "Dexterity, Constitution, Intelligence",
    "feat": "Alert",
    "skill_proficiencies": "Sleight of Hand and Stealth",
    "tool_proficiency": "Thieves' Tools",
    "equipment": "Choose A or B: (A) 2 Daggers, Thieves' Tools, Crowbar, 2 Pouches, Traveler's Clothes, 16 GP; or (B) 50 GP",
    "is_custom": false
  },
  {
    "id": "background-entertainer",
    "name": "Entertainer",
    "source": "Player's Handbook",
    "description": "You spent much of your youth following roving fairs and carnivals, performing odd jobs for musicians and acrobats in exchange for lessons. You may have learned how to walk a tightrope, how to play a lute in a distinct style, or how to recite poetry with impeccable diction. To this day, you thrive on applause and long for the stage.",
    "ability_scores": "Strength, Dexterity, Charisma",
    "feat": "Musician",
    "skill_proficiencies": "Acrobatics and Performance",
    "tool_proficiency": "Choose one kind of Musical Instrument",
    "equipment": "Choose A or B: (A) Musical Instrument (same as above), 2 Costumes, Mirror, Perfume, Traveler’s Clothes, 11 GP; or (B) 50 GP",
    "is_custom": false
  },
  {
    "id": "background-farmer",
    "name": "Farmer",
    "source": "Player's Handbook",
    "description": "You grew up close to the land. Years tending animals and cultivating the earth rewarded you with patience and good health. You have a keen appreciation for nature’s bounty alongside a healthy respect for nature's wrath.",
    "ability_scores": "Strength, Constitution, Wisdom",
    "feat": "Tough",
    "skill_proficiencies": "Animal Handling and Nature",
    "tool_proficiency": "Carpenter's Tools",
    "equipment": "Choose A or B: (A) Sickle, Carpenter's Tools, Healer's Kit, Iron Pot, Shovel, Traveler's Clothes, 30 GP; or (B) 50 GP",
    "is_custom": false
  },
  {
    "id": "background-guard",
    "name": "Guard",
    "source": "Player's Handbook",
    "description": "Your feet ache when you remember the countless hours you spent at your post in the tower. You were trained to keep one eye looking outside the wall, watching for marauders sweeping from the nearby forest, and your other eye looking inside the wall, searching for cutpurses and troublemakers.",
    "ability_scores": "Strength, Intelligence, Wisdom",
    "feat": "Alert",
    "skill_proficiencies": "Athletics and Perception",
    "tool_proficiency": "Choose one kind of Gaming Set",
    "equipment": "Choose A or B: (A) Spear, Light Crossbow, 20 Bolts, Gaming Set (same as above), Hooded Lantern, Manacles, Quiver, Traveler’s Clothes, 12 GP; or (B) 50 GP",
    "is_custom": false
  },
  {
    "id": "background-guide",
    "name": "Guide",
    "source": "Player's Handbook",
    "description": "You came of age outdoors, far from settled lands. Your home was anywhere you chose to spread your bedroll. There are wonders in the wilderness— strange monsters, pristine forests and streams, overgrown ruins of great halls once trod by giants— and you learned to fend for yourself as you explored them. From time to time, you guided friendly nature priests who instructed you in the fundamentals of channeling the magic of the wild.",
    "ability_scores": "Dexterity, Constitution, Wisdom",
    "feat": "Magic Initiate (Druid)",
    "skill_proficiencies": "Stealth and Survival",
    "tool_proficiency": "Cartographer's Tools",
    "equipment": "Choose A or B: (A) Shortbow, 20 Arrows, Cartographer’s Tools, Bedroll, Quiver, Tent, Traveler's Clothes, 3 GP; or (B) 50 GP",
    "is_custom": false
  },
  {
    "id": "background-hermit",
    "name": "Hermit",
    "source": "Player's Handbook",
    "description": "You spent your early years secluded in a hut or monastery located well beyond the outskirts of the nearest settlement. In those days, your only companions were the creatures of the forest and those who would occasionally visit to bring news of the outside world and supplies. The solitude allowed you to spend many hours pondering the mysteries of creation.",
    "ability_scores": "Constitution, Wisdom, Charisma",
    "feat": "Healer",
    "skill_proficiencies": "Medicine and Religion",
    "tool_proficiency": "Herbalism Kit",
    "equipment": "Choose A or B: (A) Quarterstaff, Herbalism Kit, Bedroll, Book (philosophy), Lamp, Oil (3 flasks), Traveler's Clothes, 16 GP; or (B) 50 GP",
    "is_custom": false
  },
  {
    "id": "background-merchant",
    "name": "Merchant",
    "source": "Player's Handbook",
    "description": "You were apprenticed to a trader, caravan master, or shopkeeper, learning the fundamentals of commerce. You traveled broadly, and you earned a living by buying and selling the raw materials artisans need to practice their craft or finished works from such crafters. You might have transported goods from one place to another (by ship, wagon, or caravan) or bought them from traveling traders and sold them in your own shop.",
    "ability_scores": "Constitution, Intelligence, Charisma",
    "feat": "Lucky",
    "skill_proficiencies": "Animal Handling and Persuasion",
    "tool_proficiency": "Navigator's Tools",
    "equipment": "Choose A or B: (A) Navigator’s Tools, 2 Pouches, Traveler's Clothes, 22 GP; or (B) 50 GP",
    "is_custom": false
  },
  {
    "id": "background-noble",
    "name": "Noble",
    "source": "Player's Handbook",
    "description": "You were raised in a castle, surrounded by wealth, power, and privilege. Your family of minor aristocrats ensured that you received a first-class education, some of which you appreciated and some of which you resented. Your time in the castle, especially the many hours you spent observing your family at court, also taught you a great deal about leadership.",
    "ability_scores": "Strength, Intelligence, Charisma",
    "feat": "Skilled",
    "skill_proficiencies": "History and Persuasion",
    "tool_proficiency": "Choose one kind of Gaming Set",
    "equipment": "Choose A or B: (A) Gaming Set (same as above), Fine Clothes, Perfume, 29 GP; or (B) 50 GP",
    "is_custom": false
  },
  {
    "id": "background-sage",
    "name": "Sage",
    "source": "Player's Handbook",
    "description": "You spent your formative years traveling between manors and monasteries, performing various odd jobs and services in exchange for access to their libraries. You whiled away many a long evening studying books and scrolls, learning the lore of the multiverse - even the rudiments of magic - and your mind yearns for more.",
    "ability_scores": "Constitution, Intelligence, Wisdom",
    "feat": "Magic Initiate (Wizard)",
    "skill_proficiencies": "Arcana and History",
    "tool_proficiency": "Calligrapher's Supplies",
    "equipment": "Choose A or B: (A) Quarterstaff, Calligrapher's Supplies, Book (history), Parchment (8 sheets), Robe, 8 GP; or (B) 50 GP",
    "is_custom": false
  },
  {
    "id": "background-sailor",
    "name": "Sailor",
    "source": "Player's Handbook",
    "description": "You lived as a seafarer, wind at your back and decks swaying beneath your feet. You've perched on barstools in more ports of call than you can remember, faced mighty storms, and swapped stories with folk who live beneath the waves.",
    "ability_scores": "Strength, Dexterity, Wisdom",
    "feat": "Tavern Brawler",
    "skill_proficiencies": "Acrobatics and Perception",
    "tool_proficiency": "Navigator's Tools",
    "equipment": "Choose A or B: (A) Dagger, Navigator's Tools, Rope, Traveler's Clothes, 20 GP; or (B) 50 GP",
    "is_custom": false
  },
  {
    "id": "background-scribe",
    "name": "Scribe",
    "source": "Player's Handbook",
    "description": "You spent formative years in a scriptorium, a monastery dedicated to the preservation of knowledge, or a government agency, where you learned to write with a clear hand and produce finely written texts. Perhaps you scribed government documents or copied tomes of literature. You might have some skill as a writer of poetry, narrative, or scholarly research. Above all, you have a careful attention to detail, helping you avoid introducing mistakes to the documents you copy and create.",
    "ability_scores": "Dexterity, Intelligence, Wisdom",
    "feat": "Skilled",
    "skill_proficiencies": "Investigation and Perception",
    "tool_proficiency": "Calligrapher's Supplies",
    "equipment": "Choose A or B: (A) Calligrapher’s Supplies, Fine Clothes, Lamp, Oil (3 flasks), Parchment (12 sheets), 23 GP; or (B) 50 GP",
    "is_custom": false
  },
  {
    "id": "background-soldier",
    "name": "Soldier",
    "source": "Player's Handbook",
    "description": "You began training for war as soon as you reached adulthood and carry precious few memories of life before you took up arms. Battle is in your blood. Sometimes you catch yourself reflexively performing the basic fighting exercises you learned first. Eventually, you put that training to use on the battlefield, protecting the realm by waging war.",
    "ability_scores": "Strength, Dexterity, Constitution",
    "feat": "Savage Attacker",
    "skill_proficiencies": "Athletics and Intimidation",
    "tool_proficiency": "Choose one kind of Gaming Set",
    "equipment": "Choose A or B: (A) Spear, Shortbow, 20 Arrows, Gaming Set (same as above), Healer's Kit, Quiver, Traveler’s Clothes, 14 GP; or (B) 50 GP",
    "is_custom": false
  },
  {
    "id": "background-wayfarer",
    "name": "Wayfarer",
    "source": "Player's Handbook",
    "description": "You grew up on the streets surrounded by similarly ill-fated castoffs, a few of them friends and a few of them rivals. You slept where you could and did odd jobs for food. At times, when the hunger became unbearable, you resorted to theft. Still, you never lost your pride and never abandoned hope. Fate is not yet finished with you.",
    "ability_scores": "Dexterity, Wisdom, Charisma",
    "feat": "Lucky",
    "skill_proficiencies": "Insight and Stealth",
    "tool_proficiency": "Thieves' Tools",
    "equipment": "Choose A or B: (A) 2 Daggers, Thieves' Tools, Gaming Set (any), Bedroll, 2 Pouches, Traveler's Clothes, 16 GP; or (B) 50 GP",
    "is_custom": false
  }
];

export const DND_2024_SPECIES: SpeciesInfo[] = [
  {
    "id": "species-aasimar",
    "name": "Aasimar",
    "source": "Player's Handbook",
    "description": "Aasimar (pronounced AH-sih-mar) are mortals who carry a spark of the Upper Planes within their souls. Whether descended from an angelic being or infused with celestial power, they can fan that spark to bring light, healing, and heavenly fury. Aasimar can arise among any population of mortals. They resemble their parents, but they live for up to 160 years and have features that hint at their celestial heritage, such as metallic freckles, luminous eyes, a halo, or the skin color of an angel (silver, opalescent green, or coppery red). These features start subtle and become obvious when the aasimar learns to reveal their full celestial nature.",
    "creature_type": "Humanoid",
    "size": "Medium (about 4-7 feet tall) or Small (about 2-4 feet tall), chosen when you select this species",
    "speed": "30 feet",
    "traits": "As an Aasimar, you have these special traits.\n\nCelestial Resistance. You have Resistance to Necrotic damage and Radiant damage.\n\nDarkvision. You have Darkvision with a range of 60 feet.\n\nHealing Hands. As a Magic action, you touch a creature and roll a number of d4s equal to your Proficiency Bonus. The creature regains a number of Hit Points equal to the total rolled. Once you use this trait, you can't use it again until you finish a Long Rest.\n\nLight Bearer. You know the Light cantrip. Charisma is your spellcasting ability for it.\n\nCelestial Revelation. When you reach character level 3, you can transform as a Bonus Action using one of the options below (choose the option each time you transform). The transformation lasts for 1 minute or until you end it (no action required). Once you transform, you can’t do so again until you finish a Long Rest.\n\nOnce on each of your turns before the transformation ends, you can deal extra damage to one target when you deal damage to it with an attack or a spell. The extra damage equals your Proficiency Bonus, and the extra damage’s type is either Necrotic for Necrotic Shroud or Radiant for Heavenly Wings and Inner Radiance.\n\nHere are the transformation options:\nHeavenly Wings. Two spectral wings sprout from your back temporarily. Until the transformation ends, you have a Fly Speed equal to your Speed.\n\nInner Radiance. Searing light temporarily radiates from your eyes and mouth. For the duration, you shed Bright Light in a 10-foot radius and Dim Light for an additional 10 feet, and at the end of each of your turns, each creature within 10 feet of you takes Radiant damage equal to your Proficiency Bonus.\n\nNecrotic Shroud. Your eyes briefly become pools of darkness, and flightless wings sprout from your back temporarily. Creatures other than your allies within 10 feet of you must succeed on a Charisma saving throw (DC 8 plus your Charisma modifier and Proficiency Bonus) or have the Frightened condition until the end of your next turn.",
    "is_custom": false
  },
  {
    "id": "species-dragonborn",
    "name": "Dragonborn",
    "source": "Player's Handbook",
    "description": "The ancestors of dragonborn hatched from the eggs of chromatic and metallic dragons. One story holds that these eggs were blessed by the dragon gods Bahamut and Tiamat, who wanted to populate the multiverse with people created in their image. Another story claims that dragons created the first dragonborn without the gods’ blessings. Whatever their origin, dragonborn have made homes for themselves on the Material Plane.\n\nDragonborn look like wingless, bipedal dragons - scaly, bright-eyed, and thick-boned with horns on their heads - and their coloration and other features are reminiscent of their draconic ancestors.",
    "creature_type": "Humanoid",
    "size": "Medium (about 5-7 feet tall)",
    "speed": "30 feet",
    "traits": "As a Dragonborn, you have these special traits.\n\nDraconic Ancestry. Your lineage stems from a dragon progenitor. Choose the kind of dragon from the Draconic Ancestors table. Your choice affects your Breath Weapon and Damage Resistance traits as well as your appearance.\n\nDraconic Ancestors\nDragon\tDamage Type\nBlack\tAcid\nBlue\tLightning\nBrass\tFire\nBronze\tLightning\nCopper\tAcid\nGold\tFire\nGreen\tPoison\nRed\tFire\nSilver\tCold\nWhite\tCold\nBreath Weapon. When you take the Attack action on your turn, you can replace one of your attacks with an exhalation of magical energy in either a 15-foot Cone or a 30-foot Line that is 5 feet wide (choose the shape each time). Each creature in that area must make a Dexterity saving throw (DC 8 plus your Constitution modifier and Proficiency Bonus). On a failed save, a creature takes 1d10 damage of the type determined by your Draconic Ancestry trait. On a successful save, a creature takes half as much damage. This damage increases by 1d10 when you reach character levels 5 (2d10), 11 (3d10), and 17 (4d10).\n\nYou can use this Breath Weapon a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Long Rest.\n\nDamage Resistance. You have Resistance to the damage type determined by your Draconic Ancestry trait.\n\nDarkvision. You have Darkvision with a range of 60 feet.\n\nDraconic Flight. When you reach character level 5, you can channel draconic magic to give yourself temporary flight. As a Bonus Action, you sprout spectral wings on your back that last for 10 minutes or until you retract the wings (no action required) or have the Incapacitated condition. During that time, you have a Fly Speed equal to your Speed. Your wings appear to be made of the same energy as your Breath Weapon. Once you use this trait, you can't use it again until you finish a Long Rest.",
    "is_custom": false
  },
  {
    "id": "species-dwarf",
    "name": "Dwarf",
    "source": "Player's Handbook",
    "description": "Dwarves were raised from the earth in the elder days by a deity of the forge. Called by various names on different worlds - Moradin, Reorx, and others - that god gave dwarves an affinity for stone and metal and for living underground. The god also made them resilient like the mountains, with a life span of about 350 years.\n\nSquat and often bearded, the original dwarves carved cities and strongholds into mountainsides and under the earth. Their oldest legends tell of conflicts with the monsters of mountaintops and the Underdark, whether those monsters were towering giants or subterranean horrors. Inspired by those tales, dwarves of any culture often sing of valorous deeds - especially of the little overcoming the mighty.\n\nOn some worlds in the multiverse, the first settlements of dwarves were built in hills or mountains, and the families who trace their ancestry to those settlements call themselves hill dwarves or mountain dwarves, respectively. The Greyhawk and Dragonlance settings have such communities.",
    "creature_type": "Humanoid",
    "size": "Medium (about 4-5 feet tall)",
    "speed": "30 feet",
    "traits": "As a Dwarf, you have these special traits.\n\nDarkvision. You have Darkvision with a range of 120 feet.\n\nDwarven Resilience. You have Resistance to Poison damage. You also have Advantage on saving throws you make to avoid or end the Poisoned condition.\n\nDwarven Toughness. Your Hit Point maximum increases by 1, and it increases by 1 again whenever you gain a level.\n\nStonecunning. As a Bonus Action, you gain Tremorsense with a range of 60 feet for 10 minutes. You must be on a stone surface or touching a stone surface to use this Tremorsense. The stone can be natural or worked.\n\nYou can use this Bonus Action a number of times equal to your Proficiency Bonus, and you regain all\nexpended uses when you finish a Long Rest.",
    "is_custom": false
  },
  {
    "id": "species-elf",
    "name": "Elf",
    "source": "Player's Handbook",
    "description": "Created by the god Corellon, the first elves could change their forms at will. They lost this ability when Corellon cursed them for plotting with the deity Lolth, who tried and failed to usurp Corellon's dominion. When Lolth was cast into the Abyss, most elves renounced her and earned Corellon’s forgiveness, but that which Corellon had taken from them was lost forever.\n\nNo longer able to shape-shift at will, the elves retreated to the Feywild, where their sorrow was deepened by that plane’s influence. Over time, curiosity led many of them to explore other planes of existence, including worlds in the Material Plane.\n\nElves have pointed ears and lack facial and body hair. They live for around 750 years, and they don't sleep but instead enter a trance when they need to rest. In that state, they remain aware of their surroundings while immersing themselves in memories and meditations.\n\nAn environment subtly transforms elves after they inhabit it for a millennium or more, and it grants them certain kinds of magic. Drow, high elves, and wood elves are examples of elves who have been transformed thus.\n\nDrow\nDrow typically dwell in the Underdark and have been shaped by it. Some drow individuals and societies avoid the Underdark altogether yet carry its magic. In the Eberron setting, for example, drow dwell in rainforests and cyclopean ruins on the continent of Xen'drik.\n\nHigh Elves\nHigh elves have been infused with the magic of crossings between the Feywild and the Material Plane. On some worlds, high elves refer to themselves by other names. For example, they call themselves sun or moon elves in the Forgotten Realms setting, Silvanesti and Qualinesti in the Dragonlance setting, and Aereni in the Eberron setting.\n\nWood Elves\nWood elves carry the magic of primeval forests within themselves. They are known by many other names, including wild elves, green elves, and forest elves. Grugach are reclusive wood elves of the Greyhawk setting, while the Kagonesti and the Tairnadal are wood elves of the Dragonlance and Eberron settings, respectively.",
    "creature_type": "",
    "size": "",
    "speed": "",
    "traits": "",
    "is_custom": false
  },
  {
    "id": "species-lorwyn-shadowmoor",
    "name": "Lorwyn-Shadowmoor",
    "source": "Lorwyn - First Light",
    "description": "Elves in the realm of Lorwyn-Shadowmoor possess black, pupilless eyes; curved horns; legs that end in cloven hooves; and pointed ears. The elves of Lorwyn exhibit stark differences physically as well as culturally from their Shadowmoor counterparts.\n\nIn Lorwyn\nThe horns of Lorwyn elves are stubby like a goat’s or curved like a ram’s, but always ridged. Their pointed ears are long and slender.\n\nIn Lorwyn, elves value beauty above all, though what any given elf deems beautiful can seem arbitrary. Some Lorwyn elves assume authority over the land’s other peoples, using their fallen empire to support their claims.\n\nThese elves blame the fall of their empire on outside threats, especially the Phyrexian invasion. Though the invasion was the empire’s death knell, its people’s self-importance and unwillingness to collaborate with other species had already led to the empire’s decline.\n\nIn Shadowmoor\nShadowmoor elves’ horns are long, wavy, and covered with a rough, thorny texture. Their pointed ears are usually longer than those of their Lorwyn counterparts.\n\nLike Lorwyn elves, Shadowmoor elves protect beauty, though a Shadowmoor elf’s definition of “beautiful” can be abstract. Many of their kind believe beauty is gained or lost in accordance with one’s actions; in particular, they consider heroism and self-sacrifice the highest forms of beauty.\n\nBloomseekers are Shadowmoor elves who study and explore Lorwyn. Each one carries a Reliquary of Twilight. Alongside Safewrights - Shadowmoor elves who venture across their realm in search of beautiful things - Bloomseekers are among the most trusted and revered members of their society.",
    "creature_type": "Humanoid",
    "size": "Medium (about 5-6 feet tall)",
    "speed": "30 feet",
    "traits": "As an Elf, you have these special traits.\n\nDarkvision. You have Darkvision with a range of 60 feet.\n\nElven Lineage. You are part of a lineage that grants you supernatural abilities. Choose a lineage from the Elven Lineages table. You gain the level 1 benefit of that lineage.\n\nWhen you reach character levels 3 and 5, you learn a higher-level spell, as shown on the table. You always have that spell prepared. You can cast it once without a spell slot, and you regain the ability to cast it in that way when you finish a Long Rest. You can also cast the spell using any spell slots you have of the appropriate level.\n\nIntelligence, Wisdom, or Charisma is your spellcasting ability for the spells you cast with this trait (choose the ability when you select the lineage).\n\nFey Ancestry. You have Advantage on saving throws you make to avoid or end the Charmed condition.\n\nKeen Senses. You have proficiency in the Insight, Perception, or Survival skill.\n\nTrance. You don't need to sleep, and magic can't put you to sleep. You can finish a Long Rest in 4 hours if you spend those hours in a trancelike meditation, during which you retain consciousness.\n\nElven Lineages\nLineage\tLevel 1\tLevel 3\tLevel 5\nDrow\tThe range of your Darkvision increases to 120 feet. You also know the Dancing Lights cantrip.\tFaerie Fire\tDarkness\nHigh Elf\tYou know the Prestidigitation cantrip. Whenever you finish a Long Rest, you can replace that cantrip with a different cantrip from the Wizard spell list.\tDetect Magic\tMisty Step\nWood Elf\tYour Speed increases to 35 feet. You also know the Druidcraft cantrip.\tLongstrider\tPass without Trace\nLorwyn Elf\tYou know the Thorn Whip cantrip. Whenever you finish a Long Rest, you can replace that cantrip with a different cantrip from the Druid spell list.\tCommand\tSilence\nShadowmoor Elf\tThe range of your Darkvision increases to 120 feet. You also know the Starry Wisp cantrip.\tHeroism\tGentle Repose",
    "is_custom": false
  },
  {
    "id": "species-gnome",
    "name": "Gnome",
    "source": "Player's Handbook",
    "description": "Gnomes are magical folk created by gods of invention, illusions, and life underground. The earliest gnomes were seldom seen by other folk due to the gnomes' secretive nature and their propensity for living in forests and burrows. What they lacked in size, they made up for in cleverness. They confounded predators with traps and labyrinthine tunnels. They also learned magic from gods like Garl Glittergold, Baervan Wildwanderer, and Baravar Cloakshadow, who visited them in disguise. That magic eventually created the lineages of forest gnomes and rock gnomes.\n\nGnomes are petite folk with big eyes and pointed ears, who live around 425 years. Many gnomes like the feeling of a roof over their head, even if that “roof” is nothing more than a hat.",
    "creature_type": "Humanoid",
    "size": "Small (about 3-4 feet tall)",
    "speed": "30 feet",
    "traits": "As a Gnome, you have these special traits.\n\nDarkvision. You have Darkvision with a range of 60 feet.\n\nGnomish Cunning. You have Advantage on Intelligence, Wisdom, and Charisma saving throws.\n\nGnomish Lineage. You are part of a lineage that grants you supernatural abilities. Choose one of the following options; whichever one you choose, Intelligence, Wisdom, or Charisma is your spellcasting ability for the spells you cast with this trait (choose the ability when you select the lineage):\n\nForest Gnome. You know the Minor Illusion cantrip.\nYou also always have the Speak with Animals spell prepared. You can cast it without a spell slot a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Long Rest. You can also use any spell slots you have to cast the spell.\n\nRock Gnome. You know the Mending and Prestidigitation cantrips. In addition, you can spend 10 minutes casting Prestidigitation to create a Tiny clockwork device (AC 5,1 HP), such as a toy, fire starter, or music box. When you create the device, you determine its function by choosing one effect from Prestidigitation; the device produces that effect whenever you or another creature takes a Bonus Action to activate it with a touch. If the chosen effect has options within it, you choose one of those options for the device when you create it. For example, if you choose the spell's ignite-extinguish effect, you determine whether the device ignites or extinguishes fire; the device doesn't do both. You can have three such devices in existence at a time, and each falls apart 8 hours after its creation or when you dismantle it with a touch as a Utilize action.",
    "is_custom": false
  },
  {
    "id": "species-goliath",
    "name": "Goliath",
    "source": "Player's Handbook",
    "description": "Towering over most folk, goliaths are distant descendants of giants. Each goliath bears the favors of the first giants - favors that manifest in various supernatural boons, including the ability to quickly grow and temporarily approach the height of goliaths’ gigantic kin.\n\nGoliaths have physical characteristics that are reminiscent of the giants in their family lines. For example, some goliaths look like stone giants, while others resemble fire giants. Whatever giants they count as kin, goliaths have forged their own path in the multiverse - unencumbered by the internecine conflicts that have ravaged giantkind for ages - and seek heights above those reached by their ancestors.",
    "creature_type": "Humanoid",
    "size": "Medium (about 7-8 feet tall)",
    "speed": "35 feet",
    "traits": "As a Goliath, you have these special traits.\n\nGiant Ancestry. You are descended from Giants. Choose one of the following benefits - a supernatural boon from your ancestry; you can use the chosen benefit a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Long Rest:\n\nCloud's Jaunt (Cloud Giant). As a Bonus Action, you magically teleport up to 30 feet to an unoccupied space you can see.\nFire's Burn (Fire Giant). When you hit a target with an attack roll and deal damage to it, you can also deal 1d10 Fire damage to that target.\nFrost's Chill (Frost Giant). When you hit a target with an attack roll and deal damage to it, you can also deal 1d6 Cold damage to that target and reduce its Speed by 10 feet until the start of your next turn.\nHill's Tumble (Hill Giant). When you hit a Large or smaller creature with an attack roll and deal damage to it, you can give that target the Prone condition.\nStone's Endurance (Stone Giant). When you take damage, you can take a Reaction to roll 1d12. Add your Constitution modifier to the number rolled and reduce the damage by that total.\nStorm's Thunder (Storm Giant). When you take damage from a creature within 60 feet of you, you can take a Reaction to deal 1d8 Thunder damage to that creature.\nLarge Form. Starting at character level 5, you can change your size to Large as a Bonus Action if you're in a big enough space. This transformation lasts for 10 minutes or until you end it (no action required). For that duration, you have Advantage on Strength checks, and your Speed increases by 10 feet. Once you use this trait, you can't use it again until you finish a Long Rest.\n\nPowerful Build. You have Advantage on any ability check you make to end the Grappled condition. You also count as one size larger when determining your carrying capacity.",
    "is_custom": false
  },
  {
    "id": "species-halfling",
    "name": "Halfling",
    "source": "Player's Handbook",
    "description": "Cherished and guided by gods who value life, home, and hearth, halflings gravitate toward bucolic havens where family and community help shape their lives. That said, many halflings possess a brave and adventurous spirit that leads them on journeys of discovery, affording them the chance to explore a bigger world and make new friends along the way. Their size - similar to that of a human child -helps them pass through crowds unnoticed and slip through tight spaces.\n\nAnyone who has spent time around halflings, particularly halfling adventurers, has likely witnessed the storied “luck of the halflings” in action. When a halfling is in mortal danger, an unseen force seems to intervene on the halfling’s behalf. Many halflings believe in the power of luck, and they attribute their unusual gift to one or more of their benevolent gods, including Yondalla, Brandobaris, and Charmalaine. The same gift might contribute to their robust life spans (about 150 years).\n\nHalfling communities come in all varieties. For every sequestered shire tucked away in an unspoiled part of the world, there's a crime syndicate like the Boromar Clan in the Eberron setting or a territorial mob of halflings like those in the Dark Sun setting.\n\nHalflings who prefer to live underground are sometimes called strongheart halflings or stouts. Nomadic halflings, as well as those who live among humans and other tall folk, are sometimes called lightfoot halflings or tallfellows.",
    "creature_type": "Humanoid",
    "size": "Small (about 2-3 feet tall)",
    "speed": "30 feet",
    "traits": "As a Halfling, you have these special traits.\n\nBrave. You have Advantage on saving throws you make to avoid or end the Frightened condition.\n\nHalfling Nimbleness. You can move through the space of any creature that is a size larger than you, but you can't stop in the same space.\n\nLuck. When you roll a 1 on the d20 of a D20 Test, you can reroll the die, and you must use the new roll.\n\nNaturally Stealthy. You can take the Hide action even when you are obscured only by a creature that is at least one size larger than you.",
    "is_custom": false
  },
  {
    "id": "species-kithkin",
    "name": "Kithkin",
    "source": "Lorwyn - First Light",
    "description": "Kithkin are short folk with stout legs, long arms, and sturdy torsos. Their broad faces; round ears; and large, expressive eyes lend them a vaguely ursine appearance.\n\nMost kithkin are linked by an empathic web that lets them sense the feelings of nearby kithkin. Because of this connection, many kithkin trust each other implicitly.\n\nSome kithkin remove themselves from this empathic web temporarily or even permanently for a variety of reasons, often due to trauma suffered during the Phyrexian invasion. Regardless, kithkin typically believe that betraying their own is a heinous crime.\n\nIn Lorwyn\nLorwyn kithkin live in pastoral villages called clachans and welcome outsiders into their communities. These kithkin collect their cultural heritage in a tome called the Book of Kith and Kin. They also often entertain many superstitions, particularly related to Lorwyn’s incarnations of nature.\n\nIn Shadowmoor\nShadowmoor kithkin are more insular and xenophobic. They mostly live in fortified settlements called douns, where strict customs to preserve the social order. Shadowmoor kithkin leaders keep a close eye on their communities, monitoring for any sign of crime or treason.\n\nPlaying a Kithkin\nUse the Halfling species when creating a kithkin player character. Shadowmoor kithkin have Darkvision with a range of 120 feet.",
    "creature_type": "",
    "size": "",
    "speed": "",
    "traits": "",
    "is_custom": false
  },
  {
    "id": "species-human",
    "name": "Human",
    "source": "Player's Handbook",
    "description": "Found throughout the multiverse, humans are as varied as they are numerous, and they endeavor to achieve as much as they can in the years they are given. Their ambition and resourcefulness are commended, respected, and feared on many worlds.\n\nHumans are as diverse in appearance as the people of Earth, and they have many gods. Scholars dispute the origin of humanity, but one of the earliest known human gatherings is said to have occurred in Sigil, the torus-shaped city at the center of the multiverse and the place where the Common language was born. From there, humans could have spread to every part of the multiverse, bringing the City of Doors' cosmopolitanism with them.",
    "creature_type": "Humanoid",
    "size": "Medium (about 4-7 feet tall) or Small (about 2-4 feet tall), chosen when you select this species",
    "speed": "30 feet",
    "traits": "As a Human, you have these special traits.\n\nResourceful. You gain Heroic Inspiration whenever you finish a Long Rest.\n\nSkillful. You gain proficiency in one skill of your choice.\n\nVersatile. You gain an Origin feat of your choice. Skilled is recommended.",
    "is_custom": false
  },
  {
    "id": "species-orc",
    "name": "Orc",
    "source": "Player's Handbook",
    "description": "Orcs trace their creation to Gruumsh, a powerful god who roamed the wide open spaces of the Material Plane. Gruumsh equipped his children with gifts to help them wander great plains, vast caverns, and churning seas and to face the monsters that lurk there. Even when they turn their devotion to other gods, orcs retain Gruumsh’s gifts: endurance, determination, and the ability to see in darkness.\n\nOrcs are, on average, tall and broad. They have gray skin, ears that are sharply pointed, and prominent lower canines that resemble small tusks. Orc youths on some worlds are told about their ancestors' great travels and travails. Inspired by those tales, many of those orcs wonder when Gruumsh will call on them to match the heroic deeds of old and if they will prove worthy of his favor. Other orcs are happy to leave old tales in the past and find their own way.",
    "creature_type": "Humanoid",
    "size": "Medium (about 6-7 feet tall)",
    "speed": "30 feet",
    "traits": "As an Orc, you have these special traits.\n\nAdrenaline Rush. You can take the Dash action as a Bonus Action. When you do so, you gain a number of Temporary Hit Points equal to your Proficiency Bonus.\n\nYou can use this trait a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Short or Long Rest.\n\nDarkvision. You have Darkvision with a range of 120 feet.\n\nRelentless Endurance. When you are reduced to 0 Hit Points but not killed outright, you can drop to 1 Hit Point instead. Once you use this trait, you can't do so again until you finish a Long Rest.",
    "is_custom": false
  },
  {
    "id": "species-tiefling",
    "name": "Tiefling",
    "source": "Player's Handbook",
    "description": "Tieflings are either born in the Lower Planes or have fiendish ancestors who originated there. A tiefling (pronounced TEE-fling) is linked by blood to a devil, a demon, or some other Fiend. This connection to the Lower Planes is the tiefling's fiendish legacy, which comes with the promise of power yet has no effect on the tiefling's moral outlook.\n\nA tiefling chooses whether to embrace or lament their fiendish legacy. The three legacies are described below.\n\nAbyssal\nThe entropy of the Abyss, the chaos of Pandemonium, and the despair of Carceri call to tieflings who have the abyssal legacy. Horns, fur, tusks, and peculiar scents are common physical features of such tieflings, most of whom have the blood of demons coursing through their veins.\n\nChthonic\nTieflings who have the chthonic legacy feel not only the tug of Carceri but also the greed of Gehenna and the gloom of Hades. Some of these tieflings look cadaverous. Others possess the unearthly beauty of a succubus, or they have physical features in common with a night hag, a yugoloth, or some other Neutral Evil fiendish ancestor.\n\nInfernal\nThe infernal legacy connects tieflings not only to Gehenna but also the Nine Hells and the raging battlefields of Acheron. Horns, spines, tails, golden eyes, and a faint odor of sulfur or smoke are common physical features of such tieflings, most of whom trace their ancestry to devils.",
    "creature_type": "Humanoid",
    "size": "Medium (about 4-7 feet tall) or Small (about 3-4 feet tall), chosen when you select this species",
    "speed": "30 feet",
    "traits": "As a Tiefling, you have the following special traits.\n\nDarkvision. You have Darkvision with a range of 60 feet.\n\nFiendish Legacy. You are the recipient of a legacy that grants you supernatural abilities. Choose a legacy from the Fiendish Legacies table. You gain the level 1 benefit of the chosen legacy.\n\nWhen you reach character levels 3 and 5, you learn a higher-level spell, as shown on the table. You always have that spell prepared. You can cast it once without a spell slot, and you regain the ability to cast it in that way when you finish a Long Rest. You can also cast the spell using any spell slots you have of the appropriate level.\n\nIntelligence, Wisdom, or Charisma is your spellcasting ability for the spells you cast with this trait (choose the ability when you select the legacy).\n\nOtherworldly Presence. You know the Thaumaturgy cantrip. When you cast it with this trait, the spell uses the same spellcasting ability you use for your Fiendish Legacy trait.\n\nFiendish Legacies\nLegacy\tLevel 1\tLevel 3\tLevel 5\nAbyssal\tYou have Resistance to Poison damage. You also know the Poison Spray cantrip.\tRay of Sickness\tHold Person\nChthonic\tYou have Resistance to Necrotic damage. You also know the Chill Touch cantrip.\tFalse Life\tRay of Enfeeblement\nInfernal\tYou have Resistance to Fire damage. You also know the Fire Bolt cantrip.\tHellish Rebuke\tDarkness",
    "is_custom": false
  }
];

export const DND_2024_FEATS: FeatInfo[] = [
  {
    "id": "feat-observant",
    "name": "Observant",
    "source": "Player's Handbook",
    "prerequisite": "Level 4+, Intelligence or Wisdom 13+",
    "description": "You gain the following benefits.\n\nAbility Score Increase. Increase your Intelligence or Wisdom score by 1, to a maximum of 20.\n\nKeen Observer. Choose one of the following skills: Insight, Investigation, or Perception. If you lack proficiency with the chosen skill, you gain proficiency in it, and if you already have proficiency in it, you gain Expertise in it.\n\nQuick Search. You can take the Search action as a Bonus Action.",
    "is_custom": false
  },
  {
    "id": "feat-piercer",
    "name": "Piercer",
    "source": "Player's Handbook",
    "prerequisite": "Level 4+",
    "description": "You gain the following benefits.\n\nAbility Score Increase. Increase your Strength or Dexterity by 1, to a maximum of 20.\n\nPuncture. Once per turn, when you hit a creature with an attack that deals Piercing damage, you can reroll one of the attack’s damage dice, and you must use the new roll.\n\nEnhanced Critical. When you score a Critical Hit that deals Piercing damage to a creature, you can roll one additional damage die when determining the extra Piercing damage the target takes.",
    "is_custom": false
  },
  {
    "id": "feat-poisoner",
    "name": "Poisoner",
    "source": "Player's Handbook",
    "prerequisite": "Level 4+",
    "description": "You gain the following benefits.\n\nAbility Score Increase. Increase your Dexterity or Intelligence score by 1, to a maximum of 20.\n\nPotent Poison. When you make a damage roll that deals Poison damage, it ignores Resistance to Poison damage.\n\nBrew Poison. You gain proficiency with the Poisoner’s Kit. With 1 hour of work using such a kit and expending 50 GP worth of materials, you can create a number of poison doses equal to your Proficiency Bonus. As a Bonus Action, you can apply a poison dose to a weapon or piece of ammunition. Once applied, the poison retains its potency for 1 minute or until you deal damage with the poisoned item, whichever is shorter. When a creature takes damage from the poisoned item, that creature must succeed on a Constitution saving throw (DC 8 plus the modifier of the ability increased by this feat and your Proficiency Bonus) or take 2d8 Poison damage and have the Poisoned condition until the end of your next turn.",
    "is_custom": false
  },
  {
    "id": "feat-polearm-master",
    "name": "Polearm Master",
    "source": "Player's Handbook",
    "prerequisite": "Level 4+, Strength or Dexterity 13+)",
    "description": "You gain the following benefits.\n\nAbility Score Increase. Increase your Dexterity or Strength score by 1, to a maximum of 20.\n\nPole Strike. Immediately after you take the Attack action and attack with a Quarterstaff, a Spear, or a weapon that has the Heavy and Reach properties, you can use a Bonus Action to make a melee attack with the opposite end of the weapon. The weapon deals Bludgeoning damage, and the weapon’s damage die for this attack is a d4.\n\nReactive Strike. While you're holding a Quarterstaff, a Spear, or a weapon that has the Heavy and Reach properties, you can take a Reaction to make one melee attack against a creature that enters the reach you have with that weapon.",
    "is_custom": false
  },
  {
    "id": "feat-resilient",
    "name": "Resilient",
    "source": "Player's Handbook",
    "prerequisite": "Level 4+",
    "description": "You gain the following benefits.\n\nAbility Score Increase. Choose one ability in which you lack saving throw proficiency. Increase the chosen ability score by 1, to a maximum of 20.\n\nSaving Throw Proficiency. You gain saving throw proficiency with the chosen ability.",
    "is_custom": false
  },
  {
    "id": "feat-ritual-caster",
    "name": "Ritual Caster",
    "source": "Player's Handbook",
    "prerequisite": "Level 4+, Intelligence, Wisdom, or Charisma 13+",
    "description": "You gain the following benefits.\n\nAbility Score Increase. Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20.\n\nRitual Spells. Choose a number of level 1 spells equal to your Proficiency Bonus that have the Ritual tag. You always have those spells prepared, and you can cast them with any spell slots you have. The spells’ spellcasting ability is the ability increased by this feat. Whenever your Proficiency Bonus increases thereafter, you can add an additional level 1 spell with the Ritual tag to the spells always prepared with this feature.\n\nQuick Ritual. With this benefit, you can cast a Ritual spell that you have prepared using its regular casting time rather than the extended time for a Ritual. Doing so doesn't require a spell slot. Once you cast the spell in this way, you can't use this benefit again until you finish a Long Rest.",
    "is_custom": false
  },
  {
    "id": "feat-sentinel",
    "name": "Sentinel",
    "source": "Player's Handbook",
    "prerequisite": "Level 4+, Strength or Dexterity 13+",
    "description": "You gain the following benefits.\n\nAbility Score Increase. Increase your Strength or Dexterity score by 1, to a maximum of 20.\n\nGuardian. Immediately after a creature within 5 feet of you takes the Disengage action or hits a target other than you with an attack, you can make an Opportunity Attack against that creature.\n\nHalt. When you hit a creature with an Opportunity Attack, the creature’s Speed becomes 0 for the rest of the current turn.",
    "is_custom": false
  },
  {
    "id": "feat-shadow-touched",
    "name": "Shadow Touched",
    "source": "Player's Handbook",
    "prerequisite": "Level 4+",
    "description": "Your exposure to the Shadowfell's magic grants you the following benefits.\n\nAbility Score Increase. Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20.\n\nShadow Magic. Choose one level 1 spell from the Illusion or Necromancy school of magic. You always have that spell and the Invisibility spell prepared. You can cast each of these spells without expending a spell slot. Once you cast either spell in this way, you can't cast that spell in this way again until you finish a Long Rest. You can also cast these spells using spell slots you have of the appropriate level. The spells’ spellcasting ability is the ability increased by this feat.",
    "is_custom": false
  },
  {
    "id": "feat-sharpshooter",
    "name": "Sharpshooter",
    "source": "Player's Handbook",
    "prerequisite": "Level 4+, Dexterity 13+",
    "description": "You gain the following benefits.\n\nAbility Score Increase. Increase your Dexterity score by 1, to a maximum of 20.\n\nBypass Cover. Your ranged attacks with weapons ignore Half Cover and Three-Quarters Cover.\n\nFiring in Melee. Being within 5 feet of an enemy doesn’t impose Disadvantage on your attack rolls with Ranged weapons.\n\nLong Shots. Attacking at long range doesn't impose Disadvantage on your attack rolls with Ranged weapons.",
    "is_custom": false
  },
  {
    "id": "feat-shield-master",
    "name": "Shield Master",
    "source": "Player's Handbook",
    "prerequisite": "Level 4+, Shield Training",
    "description": "You gain the following benefits.\n\nAbility Score Increase. Increase your Strength score by 1, to a maximum of 20.\n\nShield Bash. If you attack a creature within 5 feet of you as part of the Attack action and hit with a Melee weapon, you can immediately bash the target with your Shield if it's equipped, forcing the target to make a Strength saving throw (DC 8 plus your Strength modifier and Proficiency Bonus). On a failed save, you either push the target 5 feet from you or cause it to have the Prone condition (your choice). You can use this benefit only once on each of your turns.\n\nInterpose Shield. If you're subjected to an effect that allows you to make a Dexterity saving throw to take only half damage, you can take a Reaction to take no damage if you succeed on the saving throw and are holding a Shield.",
    "is_custom": false
  },
  {
    "id": "feat-skill-expert",
    "name": "Skill Expert",
    "source": "Player's Handbook",
    "prerequisite": "Level 4+",
    "description": "You gain the following benefits.\n\nAbility Score Increase. Increase one ability score of your choice by 1, to a maximum of 20.\n\nSkill Proficiency. You gain proficiency in one skill of your choice.\n\nExpertise. Choose one skill in which you have proficiency but lack Expertise. You gain Expertise with that skill.",
    "is_custom": false
  },
  {
    "id": "feat-skulker",
    "name": "Skulker",
    "source": "Player's Handbook",
    "prerequisite": "Level 4+, Dexterity 13+",
    "description": "You gain the following benefits.\n\nAbility Score Increase. Increase your Dexterity score by 1, to a maximum of 20.\n\nBlindsight. You have Blindsight with a range of 10 feet.\n\nFog of War. You exploit the distractions of battle, gaining Advantage on any Dexterity (Stealth) check you make as part of the Hide action during combat.\n\nSniper. If you make an attack roll while hidden and the roll misses, making the attack roll doesn’t reveal your location.",
    "is_custom": false
  },
  {
    "id": "feat-slasher",
    "name": "Slasher",
    "source": "Player's Handbook",
    "prerequisite": "Level 4+",
    "description": "You gain the following benefits.\n\nAbility Score Increase. Increase your Strength or Dexterity score by 1, to a maximum of 20.\n\nHamstring. Once per turn when you hit a creature with an attack that deals Slashing damage, you can reduce the Speed of that creature by 10 feet until the start of your next turn.\n\nEnhanced Critical. When you score a Critical Hit that deals Slashing damage to a creature, it has Disadvantage on attack rolls until the start of your next turn.",
    "is_custom": false
  },
  {
    "id": "feat-speedy",
    "name": "Speedy",
    "source": "Player's Handbook",
    "prerequisite": "Level 4+, Dexterity or Constitution 13+",
    "description": "You gain the following benefits.\n\nAbility Score Increase. Increase your Dexterity or Constitution score by 1, to a maximum of 20.\n\nSpeed Increase. Your Speed increases by 10 feet.\n\nDash over Difficult Terrain. When you take the Dash action on your turn, Difficult Terrain doesn't cost you extra movement for the rest of that turn.\n\nAgile Movement. Opportunity Attacks have Disadvantage against you.",
    "is_custom": false
  },
  {
    "id": "feat-spell-sniper",
    "name": "Spell Sniper",
    "source": "Player's Handbook",
    "prerequisite": "Level 4+, Spellcasting or Pact Magic Feature",
    "description": "You gain the following benefits.\n\nAbility Score Increase. Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20.\n\nBypass Cover. Your attack rolls for spells ignore Half Cover and Three-Quarters Cover.\n\nCasting in Melee. Being within 5 feet of an enemy doesn’t impose Disadvantage on your attack rolls with spells.\n\nIncreased Range. When you cast a spell that has a range of at least 10 feet and requires you to make an attack roll, you can increase the spell's range by 60 feet.",
    "is_custom": false
  },
  {
    "id": "feat-telekinetic",
    "name": "Telekinetic",
    "source": "Player's Handbook",
    "prerequisite": "Level 4+",
    "description": "You gain the following benefits.\n\nAbility Score Increase. Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20.\n\nMinor Telekinesis. You learn the Mage Hand spell. You can cast it without Verbal or Somatic components, you can make the spectral hand Invisible, and its range and the distance it can be away from you both increase by 30 feet when you cast it. The spell’s spellcasting ability is the ability increased by this feat.\n\nTelekinetic Shove. As a Bonus Action, you can telekinetically shove one creature you can see within 30 feet of yourself. When you do so, the target must succeed on a Strength saving throw (DC 8 plus the ability modifier of the score increased by this feat and your Proficiency Bonus) or be moved 5 feet toward or away from you.",
    "is_custom": false
  },
  {
    "id": "feat-telepathic",
    "name": "Telepathic",
    "source": "Player's Handbook",
    "prerequisite": "Level 4+",
    "description": "You gain the following benefits.\n\nAbility Score Increase. Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20.\n\nTelepathic Utterance. You can speak telepathically to any creature you can see within 60 feet of yourself. Your telepathic utterances are in a language you know, and the creature understands you only if it knows that language. Your communication doesn't give the creature the ability to respond to you telepathically.\n\nDetect Thoughts. You always have the Detect Thoughts spell prepared. You can cast it without a spell slot or spell components, and you must finish a Long Rest before you can cast it in this way again. You can also cast it using spell slots you have of the appropriate level. Your spellcasting ability for the spell is the ability increased by this feat.",
    "is_custom": false
  },
  {
    "id": "feat-war-caster",
    "name": "War Caster",
    "source": "Player's Handbook",
    "prerequisite": "Level 4+, Spellcasting or Pact Magic Feature",
    "description": "You gain the following benefits.\n\nAbility Score Increase. Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20.\n\nConcentration. You have Advantage on Constitution saving throws that you make to maintain Concentration.\n\nReactive Spell. When a creature provokes an Opportunity Attack from you by leaving your reach, you can take a Reaction to cast a spell at the creature rather than making an Opportunity Attack. The spell must have a casting time of one action and must target only that creature.\n\nSomatic Components. You can perform the Somatic components of spells even when you have weapons or a Shield in one or both hands.",
    "is_custom": false
  },
  {
    "id": "feat-weapon-master",
    "name": "Weapon Master",
    "source": "Player's Handbook",
    "prerequisite": "Level 4+",
    "description": "You gain the following benefits.\n\nAbility Score Increase. Increase your Strength or Dexterity score by 1, to a maximum of 20.\n\nMastery Property. Your training with weapons allows you to use the mastery property of one kind of Simple or Martial weapon of your choice, provided you have proficiency with it. Whenever you finish a Long Rest, you can change the kind of weapon to another eligible kind.",
    "is_custom": false
  },
  {
    "id": "feat-alert",
    "name": "Alert",
    "source": "Player's Handbook",
    "prerequisite": "",
    "description": "You gain the following benefits.\n\nInitiative Proficiency. When you roll Initiative, you can add your Proficiency Bonus to the roll.\n\nInitiative Swap. Immediately after you roll Initiative, you can swap your Initiative with the Initiative of one willing ally in the same combat. You can't make this swap if you or the ally has the Incapacitated condition.",
    "is_custom": false
  },
  {
    "id": "feat-crafter",
    "name": "Crafter",
    "source": "Player's Handbook",
    "prerequisite": "",
    "description": "You gain the following benefits.\n\nTool Proficiency. You gain proficiency with three different Artisan's Tools of your choice from the Fast Crafting table.\n\nDiscount. Whenever you buy a nonmagical item, you receive a 20 percent discount on it.\n\nFast Crafting. When you finish a Long Rest, you can craft one piece of gear from the Fast Crafting table, provided you have the Artisan's Tools associated with that item and have proficiency with those tools. The item lasts until you finish another Long Rest, at which point the item falls apart.\n\nFast Crafting\nArtisan's Tools\tCrafted Gear\nCarpenter's Tools\tLadder, Torch\nLeatherworker's Tools\tCase, Pouch\nMason's Tools\tBlock and Tackle\nPotter's Tools\tJug, Lamp\nSmith's Tools\tBall Bearings, Bucket, Caltrops, Grappling Hook, Iron Pot\nTinker's Tools\tBell, Shovel, Tinder Box\nWeaver's Tools\tBasket, Rope, Net, Tent\nWoodcarver's Tools\tClub, Greatclub, Quarterstaff",
    "is_custom": false
  },
  {
    "id": "feat-healer",
    "name": "Healer",
    "source": "Player's Handbook",
    "prerequisite": "",
    "description": "You gain the following benefits.\n\nBattle Medic. If you have a Healer's Kit, you can expend one use of it and tend to a creature within 5 feet of yourself as a Utilize action. That creature can expend one of its Hit Point Dice, and you then roll that die. The creature regains a number of Hit Points equal to the roll plus your Proficiency Bonus.\n\nHealing Rerolls. Whenever you roll a die to determine the number of Hit Points you restore with a spell or with this feat's Battle Medic benefit, you can reroll the die if it rolls a 1, and you must use the new roll.",
    "is_custom": false
  },
  {
    "id": "feat-lucky",
    "name": "Lucky",
    "source": "Player's Handbook",
    "prerequisite": "",
    "description": "You gain the following benefits.\n\nLuck Points. You have a number of Luck Points equal to your Proficiency Bonus and can spend the points on the benefits below. You regain your expended Luck Points when you finish a Long Rest.\n\nAdvantage. When you roll a d20 for a D20 Test, you can spend 1 Luck Point to give yourself Advantage on the roll.\n\nDisadvantage. When a creature rolls a d20 for an attack roll against you, you can spend 1 Luck Point to impose Disadvantage on that roll.",
    "is_custom": false
  },
  {
    "id": "feat-magic-initiate",
    "name": "Magic Initiate",
    "source": "Player's Handbook",
    "prerequisite": "",
    "description": "You gain the following benefits.\n\nTwo Cantrips. You learn two cantrips of your choice from the Cleric, Druid, or Wizard spell list. Intelligence, Wisdom, or Charisma is your spellcasting ability for this feat's spells (choose when you select this feat).\n\nLevel 1 Spell. Choose a level 1 spell from the same list you selected for this feat's cantrips. You always have that spell prepared. You can cast it once without a spell slot, and you regain the ability to cast it in that way when you finish a Long Rest. You can also cast the spell using any spell slots you have.\n\nSpell Change. Whenever you gain a new level, you can replace one of the spells you chose for this feat with a different spell of the same level from the chosen spell list.\n\nRepeatable. You can take this feat more than once, but you must choose a different spell list each time.",
    "is_custom": false
  },
  {
    "id": "feat-musician",
    "name": "Musician",
    "source": "Player's Handbook",
    "prerequisite": "",
    "description": "You gain the following benefits.\n\nInstrument Training. You gain proficiency with three Musical Instruments of your choice.\n\nEncouraging Song. As you finish a Short or Long Rest, you can play a song on a Musical Instrument with which you have proficiency and give Heroic Inspiration to allies who hear the song. The number of allies you can affect in this way equals your Proficiency Bonus.",
    "is_custom": false
  },
  {
    "id": "feat-savage-attacker",
    "name": "Savage Attacker",
    "source": "Player's Handbook",
    "prerequisite": "",
    "description": "You've trained to deal particularly damaging strikes. Once per turn when you hit a target with a weapon, you can roll the weapon's damage dice twice and use either roll against the target.",
    "is_custom": false
  },
  {
    "id": "feat-skilled",
    "name": "Skilled",
    "source": "Player's Handbook",
    "prerequisite": "",
    "description": "You gain proficiency in any combination of three skills or tools of your choice.\n\nRepeatable. You can take this feat more than once.",
    "is_custom": false
  },
  {
    "id": "feat-tavern-brawler",
    "name": "Tavern Brawler",
    "source": "Player's Handbook",
    "prerequisite": "",
    "description": "You gain the following benefits.\n\nEnhanced Unarmed Strike. When you hit with your Unarmed Strike and deal damage, you can deal Bludgeoning damage equal to 1d4 plus your Strength modifier instead of the normal damage of an Unarmed Strike.\n\nDamage Rerolls. Whenever you roll a damage die for your Unarmed Strike, you can reroll the die if it rolls a 1, and you must use the new roll.\n\nImprovised Weaponry. You have proficiency with improvised weapons.\n\nPush. When you hit a creature with an Unarmed Strike as part of the Attack action on your turn, you can deal damage to the target and also push it 5 feet away from you. You can use this benefit only once per turn.",
    "is_custom": false
  },
  {
    "id": "feat-tough",
    "name": "Tough",
    "source": "Player's Handbook",
    "prerequisite": "",
    "description": "Your Hit Point maximum increases by an amount equal to twice your character level when you gain this feat. Whenever you gain a character level thereafter, your Hit Point maximum increases by an additional 2 Hit Points.",
    "is_custom": false
  },
  {
    "id": "feat-ability-score-improvement",
    "name": "Ability Score Improvement",
    "source": "Player's Handbook",
    "prerequisite": "Level 4+",
    "description": "Increase one ability score of your choice by 2, or increase two ability scores of your choice by 1. This feat can't increase an ability score above 20.\n\nRepeatable. You can take this feat more than once.",
    "is_custom": false
  },
  {
    "id": "feat-actor",
    "name": "Actor",
    "source": "Player's Handbook",
    "prerequisite": "Level 4+, Charisma 13+",
    "description": "You gain the following benefits.\n\nAbility Score Increase. Increase your Charisma score by 1, to a maximum of 20.\n\nImpersonation. While you're disguised as a real or fictional person, you have Advantage on Charisma (Deception or Performance) checks to convince others that you are that person.\n\nMimicry. You can mimic the sounds of other creatures, including speech. A creature that hears the mimicry must succeed on a Wisdom (Insight) check to determine the effect is faked (DC 8 plus your Charisma modifier and Proficiency Bonus).",
    "is_custom": false
  },
  {
    "id": "feat-athlete",
    "name": "Athlete",
    "source": "Player's Handbook",
    "prerequisite": "Level 4+, Strength or Dexterity 13+",
    "description": "You gain the following benefits.\n\nAbility Score Increase. Increase your Strength or Dexterity score by 1, to a maximum of 20.\n\nClimb Speed. You gain a Climb Speed equal to your Speed.\n\nHop Up. When you have the Prone condition, you can right yourself with only 5 feet of movement.\n\nJumping. You can make a running Long or High Jump after moving only 5 feet.",
    "is_custom": false
  },
  {
    "id": "feat-charger",
    "name": "Charger",
    "source": "Player's Handbook",
    "prerequisite": "Level 4+, Strength or Dexterity 13+",
    "description": "You gain the following benefits.\n\nAbility Score Increase. Increase your Strength or Dexterity score by 1, to a maximum of 20.\n\nImproved Dash. When you take the Dash action, your Speed increases by 10 feet for that action.\n\nCharge Attack. If you move at least 10 feet in a straight line toward a target immediately before hitting it with a melee attack roll as part of the Attack action, choose one of the following effects: gain a 1d8 bonus to the attack's damage roll, or push the target up to 10 feet away if it is no more than one size larger than you. You can use this benefit only once on each of your turns.",
    "is_custom": false
  },
  {
    "id": "feat-chef",
    "name": "Chef",
    "source": "Player's Handbook",
    "prerequisite": "Level 4+",
    "description": "You gain the following benefits.\n\nAbility Score Increase. Increase your Constitution or Wisdom score by 1, to a maximum of 20.\n\nCook's Utensils. You gain proficiency with Cook's Utensils if you don't already have it.\n\nReplenishing Meal. As part of a Short Rest, you can cook special food if you have ingredients and Cook's Utensils on hand. You can prepare enough of this food for a number of creatures equal to 4 plus your Proficiency Bonus. At the end of the Short Rest, any creature who eats the food and spends one or more Hit Dice to regain Hit Points regains an extra 1d8 Hit Points.\n\nBolstering Treats. With 1 hour of work or when you finish a Long Rest, you can cook a number of treats equal to your Proficiency Bonus if you have ingredients and Cook's Utensils on hand. These special treats last 8 hours after being made. A creature can use a Bonus Action to eat one of those treats. to gain a number of Temporary Hit Points equal to your Proficiency Bonus.",
    "is_custom": false
  },
  {
    "id": "feat-crossbow-expert",
    "name": "Crossbow Expert",
    "source": "Player's Handbook",
    "prerequisite": "Level 4+, Dexterity 13+",
    "description": "You gain the following benefits.\n\nAbility Score Increase. Increase your Dexterity score by 1, to a maximum of 20.\n\nIgnore Loading. You ignore the Loading property of the Hand Crossbow, Heavy Crossbow, and Light Crossbow (all called crossbows elsewhere in this feat). If you're holding one of them, you can load a piece of ammunition into it even if you lack a free hand.\n\nFiring in Melee. Being within 5 feet of an enemy doesn't impose Disadvantage on your attack rolls with crossbows.\n\nDual Wielding. When you make the extra attack of the Light property, you can add your ability modifier to the damage of the extra attack if that attack is with a crossbow that has the Light property and you aren't already adding that modifier to the damage.",
    "is_custom": false
  },
  {
    "id": "feat-crusher",
    "name": "Crusher",
    "source": "Player's Handbook",
    "prerequisite": "Level 4+",
    "description": "You gain the following benefits.\n\nAbility Score Increase. Increase your Strength or Constitution score by 1, to a maximum of 20.\n\nPush. Once per turn, when you hit a creature with an attack that deals Bludgeoning damage, you can move it 5 feet to an unoccupied space if the target is no more than one size larger than you.\n\nEnhanced Critical. When you score a Critical Hit that deals Bludgeoning damage to a creature, attack rolls against that creature have Advantage until the start of your next turn.",
    "is_custom": false
  },
  {
    "id": "feat-defensive-duelist",
    "name": "Defensive Duelist",
    "source": "Player's Handbook",
    "prerequisite": "Level 4+, Dexterity 13+",
    "description": "You gain the following benefits.\n\nAbility Score Increase. Increase your Dexterity score by 1, to a maximum of 20.\n\nParry. If you're holding a Finesse weapon and another creature hits you with a melee attack, you can take a Reaction to add your Proficiency Bonus to your Armor Class, potentially causing the attack to miss you. You gain this bonus to your AC against melee attacks until the start of your next turn.",
    "is_custom": false
  },
  {
    "id": "feat-dual-wielder",
    "name": "Dual Wielder",
    "source": "Player's Handbook",
    "prerequisite": "Level 4+, Strength or Dexterity 13+",
    "description": "You gain the following benefits.\n\nAbility Score Increase. Increase your Strength or Dexterity score by 1, to a maximum of 20.\n\nEnhanced Dual Wielding. When you take the Attack action on your turn and attack with a weapon that has the Light property, you can make one extra attack as a Bonus Action later on the same turn with a different weapon, which must be a Melee weapon that lacks the Two-Handed property. You don't add your ability modifier to the extra attack's damage unless that modifier is negative.\n\nQuick Draw. You can draw or stow two weapons that lack the Two-Handed property when you would normally be able to draw or stow only one.",
    "is_custom": false
  },
  {
    "id": "feat-durable",
    "name": "Durable",
    "source": "Player's Handbook",
    "prerequisite": "Level 4+",
    "description": "You gain the following benefits.\n\nAbility Score Increase. Increase your Constitution score by 1, to a maximum of 20.\n\nDefy Death. You have Advantage on Death Saving Throws.\n\nSpeedy Recovery. As a Bonus Action, you can expend one of your Hit Point Dice, roll the die, and regain a number of Hit Points equal to the roll.",
    "is_custom": false
  },
  {
    "id": "feat-elemental-adept",
    "name": "Elemental Adept",
    "source": "Player's Handbook",
    "prerequisite": "Level 4+, Spellcasting or Pact Magic Feature",
    "description": "You gain the following benefits.\n\nAbility Score Increase. Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20.\n\nEnergy Mastery. Choose one of the following damage types: Acid, Cold, Fire, Lightning, or Thunder. Spells you cast ignore Resistance to damage of the chosen type. In addition, when you roll damage for a spell you cast that deals damage of that type, you can treat any 1 on a damage die as a 2.\n\nRepeatable. You can take this feat more than once, but you must choose a different damage type each time for Energy Mastery.",
    "is_custom": false
  },
  {
    "id": "feat-fey-touched",
    "name": "Fey Touched",
    "source": "Player's Handbook",
    "prerequisite": "Level 4+",
    "description": "Your exposure to the Feywild's magic grants you the following benefits.\n\nAbility Score Increase. Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 20.\n\nFey Magic. Choose one level 1 spell from the Divination or Enchantment school of magic. You always have that spell and the Misty Step spell prepared. You can cast each of these spells without expending a spell slot. Once you cast either spell in this way, you can't cast that spell in this way again until you finish a Long Rest. You can also cast these spells using spell slots you have of the appropriate level. The spells' spellcasting ability is the ability increased by this feat.",
    "is_custom": false
  },
  {
    "id": "feat-grappler",
    "name": "Grappler",
    "source": "Player's Handbook",
    "prerequisite": "Level 4+, Strength or Dexterity 13+",
    "description": "You gain the following benefits.\n\nAbility Score Increase. Increase your Strength or Dexterity score by 1, to a maximum of 20.\n\nPunch and Grab. When you hit a creature with an Unarmed Strike as part of the Attack action on your turn, you can use both the Damage and the Grapple option. You can use this benefit only once per turn.\n\nAttack Advantage. You have Advantage on attack rolls against a creature Grappled by you.\n\nFast Wrestler. You don’t have to spend extra movement to move a creature Grappled by you if the creature is your size or smaller.",
    "is_custom": false
  },
  {
    "id": "feat-great-weapon-master",
    "name": "Great Weapon Master",
    "source": "Player's Handbook",
    "prerequisite": "Level 4+, Strength 13+",
    "description": "You gain the following benefits.\n\nAbility Score Increase. Increase your Strength score by 1, to a maximum of 20.\n\nHeavy Weapon Mastery. When you hit a creature with a weapon that has the Heavy property as part of the Attack action on your turn, you can cause the weapon to deal extra damage to the target. The extra damage equals your Proficiency Bonus.\n\nHew. Immediately after you score a Critical Hit with a Melee weapon or reduce a creature to 0 Hit Points with one, you can make one attack with the same weapon as a Bonus Action.",
    "is_custom": false
  },
  {
    "id": "feat-heavily-armored",
    "name": "Heavily Armored",
    "source": "Player's Handbook",
    "prerequisite": "Level 4+, Medium Armor Training",
    "description": "You gain the following benefits.\n\nAbility Score Increase. Increase your Constitution or Strength score by 1, to a maximum of 20.\n\nArmor Training. You gain training with Heavy armor.",
    "is_custom": false
  },
  {
    "id": "feat-heavy-armor-master",
    "name": "Heavy Armor Master",
    "source": "Player's Handbook",
    "prerequisite": "Level 4+, Heavy Armor Training",
    "description": "You gain the following benefits.\n\nAbility Score Increase. Increase your Constitution or Strength score by 1, to a maximum of 20.\n\nDamage Reduction. When you're hit by an attack while you're wearing Heavy armor, any Bludgeoning, Piercing, and Slashing damage dealt to you by that attack is reduced by an amount equal to your Proficiency Bonus.",
    "is_custom": false
  },
  {
    "id": "feat-inspiring-leader",
    "name": "Inspiring Leader",
    "source": "Player's Handbook",
    "prerequisite": "Level 4+, Wisdom or Charisma 13+",
    "description": "You gain the following benefits.\n\nAbility Score Increase. Increase your Wisdom or Charisma score by 1, to a maximum of 20.\n\nBolstering Performance. When you finish a Short or Long Rest, you can give an inspiring performance: a speech, song, or dance. When you do so, choose up to six allies (which can include yourself) within 30 feet of yourself who witness the performance. The chosen creatures each gain Temporary Hit Points equal to your character level plus the modifier of the ability you increased with this feat.",
    "is_custom": false
  },
  {
    "id": "feat-keen-mind",
    "name": "Keen Mind",
    "source": "Player's Handbook",
    "prerequisite": "Level 4+, Intelligence 13+",
    "description": "You gain the following benefits.\n\nAbility Score Increase. Increase your Intelligence score by 1, to a maximum of 20.\n\nLore Knowledge. Choose one of the following skills: Arcana, History, Investigation, Nature, or Religion. If you lack proficiency in the chosen skill, you gain proficiency in it, and if you already have proficiency in it, you gain Expertise in it.\n\nQuick Study. You can take the Study action as a Bonus Action.",
    "is_custom": false
  },
  {
    "id": "feat-lightly-armored",
    "name": "Lightly Armored",
    "source": "Player's Handbook",
    "prerequisite": "Level 4+",
    "description": "You gain the following benefits.\n\nAbility Score Increase. Increase your Strength or Dexterity score by 1, to a maximum of 20.\n\nArmor Training. You gain training with Light armor and Shields.",
    "is_custom": false
  },
  {
    "id": "feat-mage-slayer",
    "name": "Mage Slayer",
    "source": "Player's Handbook",
    "prerequisite": "Level 4+",
    "description": "You gain the following benefits.\n\nAbility Score Increase. Increase your Strength or Dexterity score by 1, to a maximum of 20.\n\nConcentration Breaker. When you damage a creature that is concentrating, it has Disadvantage on the saving throw it makes to maintain Concentration.\n\nGuarded Mind. If you fail an Intelligence, a Wisdom, or a Charisma saving throw, you can cause yourself to succeed instead. Once you use this benefit, you can't use it again until you finish a Short or Long Rest.",
    "is_custom": false
  },
  {
    "id": "feat-martial-weapon-training",
    "name": "Martial Weapon Training",
    "source": "Player's Handbook",
    "prerequisite": "Level 4+",
    "description": "You gain the following benefits.\n\nAbility Score Increase. Increase your Strength or Dexterity score by 1, to a maximum of 20.\n\nWeapon Proficiency. You gain proficiency with Martial weapons.",
    "is_custom": false
  },
  {
    "id": "feat-medium-armor-master",
    "name": "Medium Armor Master",
    "source": "Player's Handbook",
    "prerequisite": "Level 4+, Medium Armor Training",
    "description": "You gain the following benefits.\n\nAbility Score Increase. Increase your Strength or Dexterity score by 1, to a maximum of 20.\n\nDexterous Wearer. While you're wearing Medium armor, you can add 3, rather than 2, to your AC if you have a Dexterity score of 16 or higher.",
    "is_custom": false
  },
  {
    "id": "feat-moderately-armored",
    "name": "Moderately Armored",
    "source": "Player's Handbook",
    "prerequisite": "Level 4+, Light Armor Training",
    "description": "You gain the following benefits.\n\nAbility Score Increase. Increase your Strength or Dexterity score by 1, to a maximum of 20.\n\nArmor Training. You gain training with Medium armor.",
    "is_custom": false
  },
  {
    "id": "feat-mounted-combatant",
    "name": "Mounted Combatant",
    "source": "Player's Handbook",
    "prerequisite": "Level 4+",
    "description": "You gain the following benefits.\n\nAbility Score Increase. Increase your Strength, Dexterity, or Wisdom score by 1, to a maximum of 20.\n\nMounted Strike. While mounted, you have Advantage on attack rolls against any unmounted creature within 5 feet of your mount that is at least one size smaller than the mount.\n\nLeap Aside. If your mount is subjected to an effect that allows it to make a Dexterity saving throw to take only half damage, it instead takes no damage if it succeeds on the saving throw and only half damage if it fails. For your mount to gain this benefit, you must be riding it, and neither of you can have the Incapacitated condition.\n\nVeer. While mounted, you can force an attack that hits your mount to hit you instead if you don't have the Incapacitated condition.",
    "is_custom": false
  },
  {
    "id": "feat-archery",
    "name": "Archery",
    "source": "Player's Handbook",
    "prerequisite": "Fighting Style Feature",
    "description": "You gain a +2 bonus to attack rolls you make with Ranged weapons.",
    "is_custom": false
  },
  {
    "id": "feat-blind-fighting",
    "name": "Blind Fighting",
    "source": "Player's Handbook",
    "prerequisite": "Fighting Style Feature",
    "description": "You have Blindsight with a range of 10 feet.",
    "is_custom": false
  },
  {
    "id": "feat-defense",
    "name": "Defense",
    "source": "Player's Handbook",
    "prerequisite": "Fighting Style Feature",
    "description": "While you're wearing Light, Medium, or Heavy armor, you gain a +1 bonus to Armor Class.",
    "is_custom": false
  },
  {
    "id": "feat-dueling",
    "name": "Dueling",
    "source": "Player's Handbook",
    "prerequisite": "Fighting Style Feature",
    "description": "When you're holding a Melee weapon in one hand and no other weapons, you gain a +2 bonus to damage rolls with that weapon.",
    "is_custom": false
  },
  {
    "id": "feat-great-weapon-fighting",
    "name": "Great Weapon Fighting",
    "source": "Player's Handbook",
    "prerequisite": "Fighting Style Feature",
    "description": "When you roll damage for an attack you make with a Melee weapon that you are holding with two hands, you can treat any 1 or 2 on a damage die as a 3. The weapon must have the Two-Handed or Versatile property to gain this benefit.",
    "is_custom": false
  },
  {
    "id": "feat-interception",
    "name": "Interception",
    "source": "Player's Handbook",
    "prerequisite": "Fighting Style Feature",
    "description": "When a creature you can see hits another creature within 5 feet of you with an attack roll, you can take a Reaction to reduce the damage dealt to the target by 1d10 plus your Proficiency Bonus. You must be holding a Shield or a Simple or Martial weapon to use this Reaction.",
    "is_custom": false
  },
  {
    "id": "feat-protection",
    "name": "Protection",
    "source": "Player's Handbook",
    "prerequisite": "Fighting Style Feature",
    "description": "When a creature you can see attacks a target other than you that is within 5 feet of you, you can take a Reaction to interpose your Shield if you're holding one. You impose Disadvantage on the triggering attack roll and all other attack rolls against the target until the start of your next turn if you remain within 5 feet of the target.",
    "is_custom": false
  },
  {
    "id": "feat-thrown-weapon-fighting",
    "name": "Thrown Weapon Fighting",
    "source": "Player's Handbook",
    "prerequisite": "Fighting Style Feature",
    "description": "When you hit with a ranged attack roll using a weapon that has the Thrown property, you gain a +2 bonus to the damage roll.",
    "is_custom": false
  },
  {
    "id": "feat-two-weapon-fighting",
    "name": "Two Weapon Fighting",
    "source": "Player's Handbook",
    "prerequisite": "Fighting Style Feature",
    "description": "When you make an extra attack as a result of using a weapon that has the Light property, you can add your ability modifier to the damage of that attack if you aren't already adding it to the damage.",
    "is_custom": false
  },
  {
    "id": "feat-unarmed-fighting",
    "name": "Unarmed Fighting",
    "source": "Player's Handbook",
    "prerequisite": "Fighting Style Feature",
    "description": "When you hit with your Unarmed Strike and deal damage, you can deal Bludgeoning damage equal to 1d6 plus your Strength modifier instead of the normal damage of an Unarmed Strike. If you aren't holding any weapons or a Shield when you make the attack roll, the d6 becomes a d8.\n\nAt the start of each of your turns, you can deal 1d4 Bludgeoning damage to one creature Grappled by you.",
    "is_custom": false
  }
];
