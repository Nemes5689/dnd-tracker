// Application types: campaigns, characters, encounters
import type { CharacterOriginSelection } from '@/types/origins';


export interface CharacterClassSelection {
  id: string;
  class_id: string;
  level: number;
  subclass_id?: string;
}

export interface CharacterBuild {
  enabled: boolean;
  class_levels: CharacterClassSelection[];
}

export interface Character {
  id: string;
  name: string;
  type: 'pc' | 'npc';
  class?: string;
  level?: number;
  character_build?: CharacterBuild; // optional 2024 class/subclass builder, supports multiclass
  origin_selection?: CharacterOriginSelection; // optional 2024 background/species/feat picker
  species?: string;
  hp_max: number;
  hp_current: number;
  ac: number;
  speed: number;
  initiative_bonus: number;
  avatar?: string; // base64 data URL of character portrait
  abilities?: {
    str: number;
    dex: number;
    con: number;
    int: number;
    wis: number;
    cha: number;
  };
  save_proficiencies?: string[];
  skill_proficiencies?: string[];
  tool_proficiencies?: string[];
  starting_equipment?: string;
  weapons?: {
    name: string;
    attack_bonus: number;
    damage: string;
    damage_type: string;
    mastery?: string;
  }[];
  spell_ids?: string[]; // selected SRD spell IDs known/prepared by this character
  notes?: string;
}

export interface CombatNote {
  id: string;
  title: string;
  content: string;
}

export interface SessionEntry {
  id: string;
  session_number: number;
  real_date: string; // YYYY-MM-DD when the session was played
  in_game_date?: string; // optional: in-game date (free-form)
  title: string;
  summary: string;
  participants: string[]; // PC names who attended
  created_at: number;
}

export interface PlotThread {
  id: string;
  title: string;
  description: string;
  gallery?: string[]; // base64 data URLs for plot/reference images
  status: 'active' | 'resolved' | 'paused';
  npc_ids?: string[];
  location_ids?: string[];
  faction_ids?: string[];
  created_at: number;
}

export interface CampaignNPC {
  id: string;
  name: string;
  role: string; // "ally" / "antagonist" / "merchant" / etc.
  location: string;
  location_ids?: string[];
  quest_ids?: string[];
  plot_thread_ids?: string[];
  faction_ids?: string[];
  description: string;
  notes: string;
  status: 'alive' | 'dead' | 'unknown';
  avatar?: string;
  gallery?: string[]; // base64 data URLs for NPC portraits/reference images
  created_at: number;
}

export interface Quest {
  id: string;
  title: string;
  giver: string; // who gave the quest
  description: string;
  gallery?: string[]; // base64 data URLs for quest/reference images
  status: 'active' | 'completed' | 'failed';
  reward: string;
  location_ids?: string[];
  faction_ids?: string[];
  plot_thread_ids?: string[];
  npc_ids?: string[];
  created_at: number;
}

export interface CampaignLocation {
  id: string;
  name: string;
  region: string;
  description: string;
  gallery?: string[]; // base64 data URLs for location images/maps
  visited: boolean;
  notes: string;
  quest_ids?: string[];
  plot_thread_ids?: string[];
  npc_ids?: string[];
  faction_ids?: string[];
  created_at: number;
}

export interface CampaignFaction {
  id: string;
  name: string;
  type: string; // guild / noble house / cult / kingdom / etc.
  description: string;
  goals: string;
  notes: string;
  status: 'active' | 'hidden' | 'defeated' | 'allied';
  gallery?: string[]; // base64 data URLs for faction symbols/reference images
  location_ids?: string[];
  quest_ids?: string[];
  plot_thread_ids?: string[];
  npc_ids?: string[];
  created_at: number;
}

export interface CampaignCalendar {
  // Free-form in-game date string (e.g. "15th of Mirtul, 1495 DR")
  current_date: string;
  // Optional: time of day
  time_of_day: string; // "morning" / "noon" / "evening" / "night" / custom
  // Optional: weather
  weather: string;
}

export interface NextSessionChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

export interface NextSessionPlan {
  planned_date: string; // YYYY-MM-DD when next session is planned
  goal: string; // one-sentence main goal/event
  notes: string; // free-form prep notes
  encounters_planned: string[]; // encounter IDs OR free-text labels
  npcs_appearing: string[]; // NPC IDs OR free-text names
  plot_beats: string[]; // bullet list of story moments
  rewards_planned: string; // loot, items, level-ups
  checklist: NextSessionChecklistItem[]; // DM prep tasks
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  story_status: string;
  last_session_recap: string;
  next_session_plan: string;
  notes: CombatNote[];
  characters: Character[];
  custom_monsters: string[]; // monster IDs (overrides or additions)
  encounter_ids: string[]; // refs to encounters
  // Dashboard data
  sessions?: SessionEntry[];
  plot_threads?: PlotThread[];
  npcs?: CampaignNPC[];
  quests?: Quest[];
  locations?: CampaignLocation[];
  factions?: CampaignFaction[];
  map_image?: string;
  map_location_pins?: Record<string, { x: number; y: number }>;
  calendar?: CampaignCalendar;
  party_location?: string; // current party location (free-form)
  next_session?: NextSessionPlan; // structured plan for next session
  created_at: number;
  updated_at: number;
}

// Combat-related types
export type CombatStatus = 'planned' | 'active' | 'completed';

export interface AppliedCondition {
  condition_id: string;
  source?: string; // who applied it
  duration_type: 'fixed' | 'save_ends' | 'manual';
  duration_rounds?: number;
  save_ability?: string;
  save_dc?: number;
  remaining_rounds?: number;
  level?: number; // for Exhaustion (1-6)
}

export interface Combatant {
  id: string;
  name: string;
  source_type: 'character' | 'monster' | 'ally';
  source_id: string; // character id or monster slug
  hp_max: number;
  hp_current: number;
  hp_temp: number;
  ac: number;
  initiative: number;
  conditions: AppliedCondition[];
  is_player: boolean;
  is_ally?: boolean; // friendly NPC / summon (not a player, but on the players' side)
  size?: string; // Tiny/Small/Medium/Large/Huge/Gargantuan (for token grid size)
  // Action economy (resets per turn)
  action_used: boolean;
  bonus_action_used: boolean;
  reaction_used: boolean;
  movement_used: number; // feet
  // Combat modifiers (DM toggles)
  has_flanking: boolean;
  cover: 'none' | 'half' | 'three-quarters' | 'total';
}

export interface Encounter {
  id: string;
  campaign_id: string;
  name: string;
  status: CombatStatus;
  combatants: Combatant[];
  round: number;
  turn_index: number; // index into initiative order
  log: { round: number; message: string; timestamp: number }[];
  ai_knowledge?: Record<string, MonsterKnowledge>; // keyed by monster type
  maps?: BattleMap[]; // battle maps for this encounter
  active_map_id?: string | null; // currently displayed map
  token_styles?: CombatantTokenStyle[]; // per-combatant visual styles
  created_at: number;
  updated_at: number;
}

export interface MonsterKnowledge {
  // What this monster type collectively knows
  per_target: Record<string, TargetKnowledge>; // keyed by target combatant id
}

export interface TargetKnowledge {
  ac_min: number | null; // known AC lower bound
  ac_max: number | null; // known AC upper bound
  class_revealed: boolean;
  observed_class?: string;
  observed_actions: string[];
  notes: string[];
}

// Settings
export interface Settings {
  openrouter_api_key: string;
  default_model: string;
  ai_language: 'magyar' | 'english';
  auto_roll: boolean;
  auto_ai_on_monster_turn: boolean;
  initiative_mode: 'individual' | 'group';
  show_knowledge_panel: boolean;
}

// Battle map types
export interface TokenPosition {
  combatant_id: string;
  x: number; // grid column (0-indexed)
  y: number; // grid row (0-indexed)
}

export type EffectType =
  | 'fire'
  | 'smoke'
  | 'poison'
  | 'ice'
  | 'lightning'
  | 'web'
  | 'acid'
  | 'holy'
  | 'necrotic';

export interface MapDrawing {
  id: string;
  // Stroke points in image-pixel coordinates (relative to the map image,
  // NOT the screen). This way, zoom and pan don't move the drawing.
  points: { x: number; y: number }[];
  color: string; // CSS color (hex) for the stroke
  stroke_width: number; // pixels (in image space)
  // True if the user drew a closed shape (last point near first point).
  // Closed shapes can have an effect applied.
  is_closed: boolean;
  // Optional effect type. When set, the shape is filled with the effect's
  // visual style (animated CSS / SVG).
  effect?: EffectType;
  created_at: number;
}

export interface BattleMap {
  id: string;
  name: string;
  image_data: string; // base64 data URL of the map image
  image_width: number; // natural pixel size
  image_height: number;
  grid_size: number; // pixels per grid square (configurable)
  grid_offset_x: number; // grid origin offset in pixels
  grid_offset_y: number;
  show_grid: boolean;
  tokens: TokenPosition[];
  drawings?: MapDrawing[]; // freehand strokes / shapes with effects
  created_at: number;
}

export interface CombatantTokenStyle {
  combatant_id: string;
  color?: string; // background color of the token (default by player/monster)
  avatar?: string; // optional base64 image
  initial?: string; // single letter for the token (default: first letter of name)
}
