export interface BackgroundInfo {
  id: string;
  name: string;
  source: string;
  description: string;
  ability_scores: string;
  feat: string;
  skill_proficiencies: string;
  tool_proficiency: string;
  equipment: string;
  is_custom?: boolean;
}

export interface SpeciesInfo {
  id: string;
  name: string;
  source: string;
  description: string;
  creature_type: string;
  size: string;
  speed: string;
  traits: string;
  is_custom?: boolean;
}

export interface FeatInfo {
  id: string;
  name: string;
  source: string;
  prerequisite: string;
  description: string;
  is_custom?: boolean;
}

export interface CharacterOriginSelection {
  background_id?: string;
  species_id?: string;
  feat_ids?: string[];
  /** Background ability-score allocation. Keys use dnd ability abbreviations: str, dex, con, int, wis, cha. */
  background_ability_bonuses?: Partial<Record<'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha', number>>;
  /** Player choice for backgrounds that say "choose one kind of..." tool proficiency. */
  background_tool_choice?: string;
  /** Starting equipment choice from the background. A = equipment/tools package, B = gold package. */
  background_equipment_choice?: 'A' | 'B';
}
