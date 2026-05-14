// Zustand store for encounters (active combats)

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Encounter,
  Combatant,
  AppliedCondition,
  BattleMap,
  TokenPosition,
  CombatantTokenStyle,
  MapDrawing,
  SpellSlotState,
  ResourceState,
  ActivatedFeatureState,
} from '@/types/app';
import {
  applyDamage,
  applyHealing,
  applyTempHP,
  resetTurnActions,
  tickConditions,
  addCondition,
  removeCondition,
  sortByInitiative,
} from '@/engine/combat';
import { expireMovementOverrideOnTurnStart } from '@/utils/movement';

interface EncounterStore {
  encounters: Encounter[];

  // CRUD
  createEncounter: (campaign_id: string, name: string) => string;
  deleteEncounter: (id: string) => void;
  renameEncounter: (id: string, new_name: string) => void;
  duplicateEncounter: (id: string) => string;
  // Reset an active encounter back to setup state (clear initiative, hp, log, etc.
  // but keep the combatant roster and maps).
  resetCombat: (id: string) => void;
  // Mark an encounter as completed (preserves all combat state for review).
  endEncounter: (id: string) => void;
  getEncounter: (id: string) => Encounter | undefined;

  // Combatant management
  addCombatant: (encounter_id: string, combatant: Combatant) => void;
  removeCombatant: (encounter_id: string, combatant_id: string) => void;
  updateCombatant: (
    encounter_id: string,
    combatant_id: string,
    patch: Partial<Combatant>
  ) => void;
  // Change a combatant's initiative mid-combat. Re-sorts the turn order
  // and adjusts turn_index so the currently active combatant remains active.
  setInitiative: (
    encounter_id: string,
    combatant_id: string,
    new_initiative: number
  ) => void;

  // Combat actions
  startCombat: (encounter_id: string) => void;
  endTurn: (encounter_id: string) => void;
  damageCombatant: (encounter_id: string, combatant_id: string, amount: number) => void;
  healCombatant: (encounter_id: string, combatant_id: string, amount: number) => void;
  setTempHP: (encounter_id: string, combatant_id: string, amount: number) => void;
  applyConditionToCombatant: (
    encounter_id: string,
    combatant_id: string,
    cond: AppliedCondition
  ) => void;
  removeConditionFromCombatant: (
    encounter_id: string,
    combatant_id: string,
    condition_id: string
  ) => void;

  // Logging
  log: (encounter_id: string, message: string) => void;

  // Battle map management
  addMap: (encounter_id: string, map: Omit<BattleMap, 'id' | 'created_at' | 'tokens'>) => string;
  updateMap: (encounter_id: string, map_id: string, patch: Partial<BattleMap>) => void;
  deleteMap: (encounter_id: string, map_id: string) => void;
  setActiveMap: (encounter_id: string, map_id: string | null) => void;
  setTokenPosition: (
    encounter_id: string,
    map_id: string,
    combatant_id: string,
    x: number,
    y: number
  ) => void;
  setTokenStyle: (
    encounter_id: string,
    style: CombatantTokenStyle
  ) => void;
  addMapDrawing: (
    encounter_id: string,
    map_id: string,
    drawing: MapDrawing
  ) => void;
  updateMapDrawing: (
    encounter_id: string,
    map_id: string,
    drawing_id: string,
    patch: Partial<MapDrawing>
  ) => void;
  deleteMapDrawing: (
    encounter_id: string,
    map_id: string,
    drawing_id: string
  ) => void;
  clearMapDrawings: (encounter_id: string, map_id: string) => void;
  setMapRotation: (
    encounter_id: string,
    map_id: string,
    rotation: number
  ) => void;
  // Spell slot tracking: change a single slot's remaining count
  setSpellSlotRemaining: (
    encounter_id: string,
    combatant_id: string,
    slot_level: number,
    new_remaining: number
  ) => void;
  // Generic resource tracking (Rage, Ki, Sorcery Points, etc.)
  setResourceRemaining: (
    encounter_id: string,
    combatant_id: string,
    resource_id: string,
    new_remaining: number
  ) => void;
  // Activated class features (Action Surge, Channel Divinity, etc.)
  setActivatedFeatureRemaining: (
    encounter_id: string,
    combatant_id: string,
    feature_id: string,
    new_remaining: number
  ) => void;
  // Rest: restores resources based on type
  restCombatant: (
    encounter_id: string,
    combatant_id: string,
    rest_type: 'short' | 'long'
  ) => void;
}

export const useEncounterStore = create<EncounterStore>()(
  persist(
    (set, get) => ({
      encounters: [],

      createEncounter: (campaign_id, name) => {
        const id = crypto.randomUUID();
        const encounter: Encounter = {
          id,
          campaign_id,
          name,
          status: 'planned',
          combatants: [],
          round: 0,
          turn_index: 0,
          log: [],
          created_at: Date.now(),
          updated_at: Date.now(),
        };
        set((s) => ({ encounters: [...s.encounters, encounter] }));
        return id;
      },

      deleteEncounter: (id) =>
        set((s) => ({ encounters: s.encounters.filter((e) => e.id !== id) })),

      renameEncounter: (id, new_name) =>
        set((s) => ({
          encounters: s.encounters.map((e) =>
            e.id === id ? { ...e, name: new_name, updated_at: Date.now() } : e
          ),
        })),

      duplicateEncounter: (id) => {
        const original = get().encounters.find((e) => e.id === id);
        if (!original) return id;
        const new_id = crypto.randomUUID();
        // Reset combatants to fresh state for the duplicate (full HP, no conditions, no init)
        const fresh_combatants = original.combatants.map((c) => ({
          ...c,
          id: crypto.randomUUID(), // new unique IDs
          hp_current: c.hp_max,
          hp_temp: 0,
          initiative: 0,
          conditions: [],
          action_used: false,
          bonus_action_used: false,
          reaction_used: false,
          movement_used: 0,
        }));
        const copy: Encounter = {
          ...original,
          id: new_id,
          name: `${original.name} (copy)`,
          status: 'planned',
          round: 1,
          turn_index: 0,
          combatants: fresh_combatants,
          log: [],
          token_styles: [], // tokens get fresh ids, so old styles are stale
          maps: [],
          active_map_id: null,
          created_at: Date.now(),
          updated_at: Date.now(),
        };
        set((s) => ({ encounters: [...s.encounters, copy] }));
        return new_id;
      },

      resetCombat: (id) =>
        set((s) => ({
          encounters: s.encounters.map((e) => {
            if (e.id !== id) return e;
            return {
              ...e,
              status: 'planned',
              round: 1,
              turn_index: 0,
              combatants: e.combatants.map((c) => ({
                ...c,
                hp_current: c.hp_max,
                hp_temp: 0,
                initiative: 0,
                conditions: [],
                action_used: false,
                bonus_action_used: false,
                reaction_used: false,
                movement_used: 0,
              })),
              log: [],
              updated_at: Date.now(),
            };
          }),
        })),

      endEncounter: (id) =>
        set((s) => ({
          encounters: s.encounters.map((e) => {
            if (e.id !== id) return e;
            return {
              ...e,
              status: 'completed',
              log: [
                ...e.log,
                {
                  round: e.round,
                  message: '— Encounter ended —',
                  timestamp: Date.now(),
                },
              ],
              updated_at: Date.now(),
            };
          }),
        })),

      getEncounter: (id) => get().encounters.find((e) => e.id === id),

      addCombatant: (encounter_id, combatant) =>
        set((s) => ({
          encounters: s.encounters.map((e) =>
            e.id === encounter_id
              ? {
                  ...e,
                  combatants: [...e.combatants, combatant],
                  updated_at: Date.now(),
                }
              : e
          ),
        })),

      removeCombatant: (encounter_id, combatant_id) =>
        set((s) => ({
          encounters: s.encounters.map((e) =>
            e.id === encounter_id
              ? {
                  ...e,
                  combatants: e.combatants.filter((c) => c.id !== combatant_id),
                  updated_at: Date.now(),
                }
              : e
          ),
        })),

      updateCombatant: (encounter_id, combatant_id, patch) =>
        set((s) => ({
          encounters: s.encounters.map((e) =>
            e.id === encounter_id
              ? {
                  ...e,
                  combatants: e.combatants.map((c) =>
                    c.id === combatant_id ? { ...c, ...patch } : c
                  ),
                  updated_at: Date.now(),
                }
              : e
          ),
        })),

      // Change a combatant's initiative mid-combat. Re-sorts the turn order
      // and shifts turn_index so the currently-active combatant stays active.
      // Also logs the change.
      setInitiative: (encounter_id, combatant_id, new_initiative) =>
        set((s) => ({
          encounters: s.encounters.map((e) => {
            if (e.id !== encounter_id) return e;

            // Find the combatant being modified and the current active one
            const target = e.combatants.find((c) => c.id === combatant_id);
            if (!target) return e;
            const old_initiative = target.initiative;
            if (old_initiative === new_initiative) return e;

            const active_id = e.combatants[e.turn_index]?.id;

            // Update initiative
            const updated = e.combatants.map((c) =>
              c.id === combatant_id ? { ...c, initiative: new_initiative } : c
            );

            // Re-sort by initiative (highest first), preserving relative order
            // of ties via stable sort
            const sorted = [...updated].sort(
              (a, b) => b.initiative - a.initiative
            );

            // Find the new turn_index for the previously-active combatant
            let new_turn_index = active_id
              ? sorted.findIndex((c) => c.id === active_id)
              : 0;
            if (new_turn_index < 0) new_turn_index = 0;

            const delta = new_initiative - old_initiative;
            const sign = delta > 0 ? '+' : '';

            return {
              ...e,
              combatants: sorted,
              turn_index: new_turn_index,
              log: [
                ...e.log,
                {
                  round: e.round,
                  message: `${target.name}: initiative ${old_initiative} → ${new_initiative} (${sign}${delta})`,
                  timestamp: Date.now(),
                },
              ],
              updated_at: Date.now(),
            };
          }),
        })),

      startCombat: (encounter_id) =>
        set((s) => ({
          encounters: s.encounters.map((e) => {
            if (e.id !== encounter_id) return e;
            // Sort combatants by initiative
            const sorted = sortByInitiative(e.combatants);
            return {
              ...e,
              status: 'active' as const,
              combatants: sorted.map(resetTurnActions),
              round: 1,
              turn_index: 0,
              log: [
                ...e.log,
                {
                  round: 1,
                  message: 'Combat started',
                  timestamp: Date.now(),
                },
              ],
              updated_at: Date.now(),
            };
          }),
        })),

      endTurn: (encounter_id) =>
        set((s) => ({
          encounters: s.encounters.map((e) => {
            if (e.id !== encounter_id) return e;
            // Tick down conditions on the combatant whose turn ends
            const current = e.combatants[e.turn_index];
            let updated_combatants = e.combatants;
            const new_log = [...e.log];

            if (current) {
              const { combatant, expired } = tickConditions(current);
              updated_combatants = e.combatants.map((c) =>
                c.id === combatant.id ? combatant : c
              );
              for (const exp of expired) {
                new_log.push({
                  round: e.round,
                  message: `${current.name}: condition "${exp.condition_id}" expired`,
                  timestamp: Date.now(),
                });
              }
            }

            // Advance to next combatant
            let next_index = e.turn_index + 1;
            let next_round = e.round;
            if (next_index >= updated_combatants.length) {
              next_index = 0;
              next_round = e.round + 1;
              new_log.push({
                round: next_round,
                message: `Round ${next_round} begins`,
                timestamp: Date.now(),
              });
            }

            // Reset action economy for the new active combatant, then tick any
            // temporary current-speed override that expires on that combatant's turn start.
            const next = updated_combatants[next_index];
            if (next) {
              const reset_next = resetTurnActions(next);
              const { combatant: speed_checked_next, expired: expired_speed_override } =
                expireMovementOverrideOnTurnStart(reset_next);
              updated_combatants = updated_combatants.map((c) =>
                c.id === next.id ? speed_checked_next : c
              );
              if (expired_speed_override) {
                new_log.push({
                  round: next_round,
                  message: `${next.name}: temporary speed override expired`,
                  timestamp: Date.now(),
                });
              }
            }

            return {
              ...e,
              combatants: updated_combatants,
              turn_index: next_index,
              round: next_round,
              log: new_log,
              updated_at: Date.now(),
            };
          }),
        })),

      damageCombatant: (encounter_id, combatant_id, amount) =>
        set((s) => ({
          encounters: s.encounters.map((e) => {
            if (e.id !== encounter_id) return e;
            const target = e.combatants.find((c) => c.id === combatant_id);
            if (!target) return e;
            return {
              ...e,
              combatants: e.combatants.map((c) =>
                c.id === combatant_id ? applyDamage(c, amount) : c
              ),
              log: [
                ...e.log,
                {
                  round: e.round,
                  message: `${target.name} took ${amount} damage`,
                  timestamp: Date.now(),
                },
              ],
              updated_at: Date.now(),
            };
          }),
        })),

      healCombatant: (encounter_id, combatant_id, amount) =>
        set((s) => ({
          encounters: s.encounters.map((e) => {
            if (e.id !== encounter_id) return e;
            const target = e.combatants.find((c) => c.id === combatant_id);
            if (!target) return e;
            return {
              ...e,
              combatants: e.combatants.map((c) =>
                c.id === combatant_id ? applyHealing(c, amount) : c
              ),
              log: [
                ...e.log,
                {
                  round: e.round,
                  message: `${target.name} healed ${amount} HP`,
                  timestamp: Date.now(),
                },
              ],
              updated_at: Date.now(),
            };
          }),
        })),

      setTempHP: (encounter_id, combatant_id, amount) =>
        set((s) => ({
          encounters: s.encounters.map((e) =>
            e.id === encounter_id
              ? {
                  ...e,
                  combatants: e.combatants.map((c) =>
                    c.id === combatant_id ? applyTempHP(c, amount) : c
                  ),
                  updated_at: Date.now(),
                }
              : e
          ),
        })),

      applyConditionToCombatant: (encounter_id, combatant_id, cond) =>
        set((s) => ({
          encounters: s.encounters.map((e) => {
            if (e.id !== encounter_id) return e;
            const target = e.combatants.find((c) => c.id === combatant_id);
            if (!target) return e;
            return {
              ...e,
              combatants: e.combatants.map((c) =>
                c.id === combatant_id ? addCondition(c, cond) : c
              ),
              log: [
                ...e.log,
                {
                  round: e.round,
                  message: `${target.name} gained condition "${cond.condition_id}"`,
                  timestamp: Date.now(),
                },
              ],
              updated_at: Date.now(),
            };
          }),
        })),

      removeConditionFromCombatant: (encounter_id, combatant_id, condition_id) =>
        set((s) => ({
          encounters: s.encounters.map((e) =>
            e.id === encounter_id
              ? {
                  ...e,
                  combatants: e.combatants.map((c) =>
                    c.id === combatant_id ? removeCondition(c, condition_id) : c
                  ),
                  updated_at: Date.now(),
                }
              : e
          ),
        })),

      log: (encounter_id, message) =>
        set((s) => ({
          encounters: s.encounters.map((e) =>
            e.id === encounter_id
              ? {
                  ...e,
                  log: [
                    ...e.log,
                    { round: e.round, message, timestamp: Date.now() },
                  ],
                  updated_at: Date.now(),
                }
              : e
          ),
        })),

      addMap: (encounter_id, map) => {
        const id = crypto.randomUUID();
        const new_map: BattleMap = {
          id,
          tokens: [],
          created_at: Date.now(),
          ...map,
        };
        set((s) => ({
          encounters: s.encounters.map((e) =>
            e.id === encounter_id
              ? {
                  ...e,
                  maps: [...(e.maps ?? []), new_map],
                  // If no active map, make this the active one
                  active_map_id: e.active_map_id ?? id,
                  updated_at: Date.now(),
                }
              : e
          ),
        }));
        return id;
      },

      updateMap: (encounter_id, map_id, patch) =>
        set((s) => ({
          encounters: s.encounters.map((e) =>
            e.id === encounter_id
              ? {
                  ...e,
                  maps: (e.maps ?? []).map((m) =>
                    m.id === map_id ? { ...m, ...patch } : m
                  ),
                  updated_at: Date.now(),
                }
              : e
          ),
        })),

      deleteMap: (encounter_id, map_id) =>
        set((s) => ({
          encounters: s.encounters.map((e) => {
            if (e.id !== encounter_id) return e;
            const new_maps = (e.maps ?? []).filter((m) => m.id !== map_id);
            return {
              ...e,
              maps: new_maps,
              active_map_id:
                e.active_map_id === map_id
                  ? new_maps[0]?.id ?? null
                  : e.active_map_id,
              updated_at: Date.now(),
            };
          }),
        })),

      setActiveMap: (encounter_id, map_id) =>
        set((s) => ({
          encounters: s.encounters.map((e) =>
            e.id === encounter_id
              ? { ...e, active_map_id: map_id, updated_at: Date.now() }
              : e
          ),
        })),

      setTokenPosition: (encounter_id, map_id, combatant_id, x, y) =>
        set((s) => ({
          encounters: s.encounters.map((e) => {
            if (e.id !== encounter_id) return e;
            return {
              ...e,
              maps: (e.maps ?? []).map((m) => {
                if (m.id !== map_id) return m;
                const existing = m.tokens.find(
                  (t) => t.combatant_id === combatant_id
                );
                let new_tokens: TokenPosition[];
                if (existing) {
                  new_tokens = m.tokens.map((t) =>
                    t.combatant_id === combatant_id ? { ...t, x, y } : t
                  );
                } else {
                  new_tokens = [...m.tokens, { combatant_id, x, y }];
                }
                return { ...m, tokens: new_tokens };
              }),
              updated_at: Date.now(),
            };
          }),
        })),

      setTokenStyle: (encounter_id, style) =>
        set((s) => ({
          encounters: s.encounters.map((e) => {
            if (e.id !== encounter_id) return e;
            const existing = (e.token_styles ?? []).find(
              (ts) => ts.combatant_id === style.combatant_id
            );
            const new_styles = existing
              ? (e.token_styles ?? []).map((ts) =>
                  ts.combatant_id === style.combatant_id ? style : ts
                )
              : [...(e.token_styles ?? []), style];
            return { ...e, token_styles: new_styles, updated_at: Date.now() };
          }),
        })),

      addMapDrawing: (encounter_id, map_id, drawing) =>
        set((s) => ({
          encounters: s.encounters.map((e) => {
            if (e.id !== encounter_id) return e;
            return {
              ...e,
              maps: (e.maps ?? []).map((m) =>
                m.id === map_id
                  ? { ...m, drawings: [...(m.drawings ?? []), drawing] }
                  : m
              ),
              updated_at: Date.now(),
            };
          }),
        })),

      updateMapDrawing: (encounter_id, map_id, drawing_id, patch) =>
        set((s) => ({
          encounters: s.encounters.map((e) => {
            if (e.id !== encounter_id) return e;
            return {
              ...e,
              maps: (e.maps ?? []).map((m) =>
                m.id === map_id
                  ? {
                      ...m,
                      drawings: (m.drawings ?? []).map((d) =>
                        d.id === drawing_id ? { ...d, ...patch } : d
                      ),
                    }
                  : m
              ),
              updated_at: Date.now(),
            };
          }),
        })),

      deleteMapDrawing: (encounter_id, map_id, drawing_id) =>
        set((s) => ({
          encounters: s.encounters.map((e) => {
            if (e.id !== encounter_id) return e;
            return {
              ...e,
              maps: (e.maps ?? []).map((m) =>
                m.id === map_id
                  ? {
                      ...m,
                      drawings: (m.drawings ?? []).filter(
                        (d) => d.id !== drawing_id
                      ),
                    }
                  : m
              ),
              updated_at: Date.now(),
            };
          }),
        })),

      clearMapDrawings: (encounter_id, map_id) =>
        set((s) => ({
          encounters: s.encounters.map((e) => {
            if (e.id !== encounter_id) return e;
            return {
              ...e,
              maps: (e.maps ?? []).map((m) =>
                m.id === map_id ? { ...m, drawings: [] } : m
              ),
              updated_at: Date.now(),
            };
          }),
        })),

      setMapRotation: (encounter_id, map_id, rotation) =>
        set((s) => ({
          encounters: s.encounters.map((e) => {
            if (e.id !== encounter_id) return e;
            // Normalize to 0..359
            const normalized = ((rotation % 360) + 360) % 360;
            return {
              ...e,
              maps: (e.maps ?? []).map((m) =>
                m.id === map_id ? { ...m, rotation: normalized } : m
              ),
              updated_at: Date.now(),
            };
          }),
        })),

      setSpellSlotRemaining: (encounter_id, combatant_id, slot_level, new_remaining) =>
        set((s) => ({
          encounters: s.encounters.map((e) => {
            if (e.id !== encounter_id) return e;
            const target = e.combatants.find((c) => c.id === combatant_id);
            if (!target?.spell_slots_remaining) return e;
            const slot = target.spell_slots_remaining.find((sl) => sl.level === slot_level);
            if (!slot) return e;
            const clamped = Math.max(0, Math.min(slot.total, new_remaining));
            if (clamped === slot.remaining) return e;
            const direction = clamped < slot.remaining ? 'spent' : 'restored';
            return {
              ...e,
              combatants: e.combatants.map((c) =>
                c.id === combatant_id
                  ? {
                      ...c,
                      spell_slots_remaining: c.spell_slots_remaining!.map((sl) =>
                        sl.level === slot_level
                          ? { ...sl, remaining: clamped }
                          : sl
                      ),
                    }
                  : c
              ),
              log: [
                ...e.log,
                {
                  round: e.round,
                  message: `${target.name} ${direction} a level ${slot_level} spell slot (${clamped}/${slot.total})`,
                  timestamp: Date.now(),
                },
              ],
              updated_at: Date.now(),
            };
          }),
        })),

      setResourceRemaining: (encounter_id, combatant_id, resource_id, new_remaining) =>
        set((s) => ({
          encounters: s.encounters.map((e) => {
            if (e.id !== encounter_id) return e;
            const target = e.combatants.find((c) => c.id === combatant_id);
            if (!target?.resources_remaining) return e;
            const res = target.resources_remaining.find((r) => r.id === resource_id);
            if (!res) return e;
            const clamped = Math.max(0, Math.min(res.total, new_remaining));
            if (clamped === res.remaining) return e;
            const direction = clamped < res.remaining ? 'spent' : 'restored';
            return {
              ...e,
              combatants: e.combatants.map((c) =>
                c.id === combatant_id
                  ? {
                      ...c,
                      resources_remaining: c.resources_remaining!.map((r) =>
                        r.id === resource_id ? { ...r, remaining: clamped } : r
                      ),
                    }
                  : c
              ),
              log: [
                ...e.log,
                {
                  round: e.round,
                  message: `${target.name} ${direction} ${res.name} (${clamped}/${res.total})`,
                  timestamp: Date.now(),
                },
              ],
              updated_at: Date.now(),
            };
          }),
        })),

      setActivatedFeatureRemaining: (encounter_id, combatant_id, feature_id, new_remaining) =>
        set((s) => ({
          encounters: s.encounters.map((e) => {
            if (e.id !== encounter_id) return e;
            const target = e.combatants.find((c) => c.id === combatant_id);
            if (!target?.activated_features_remaining) return e;
            const feat = target.activated_features_remaining.find((f) => f.id === feature_id);
            if (!feat) return e;
            const clamped = Math.max(0, Math.min(feat.total, new_remaining));
            if (clamped === feat.remaining) return e;
            const direction = clamped < feat.remaining ? 'used' : 'restored';
            return {
              ...e,
              combatants: e.combatants.map((c) =>
                c.id === combatant_id
                  ? {
                      ...c,
                      activated_features_remaining: c.activated_features_remaining!.map((f) =>
                        f.id === feature_id ? { ...f, remaining: clamped } : f
                      ),
                    }
                  : c
              ),
              log: [
                ...e.log,
                {
                  round: e.round,
                  message: `${target.name} ${direction} ${feat.name} (${clamped}/${feat.total})`,
                  timestamp: Date.now(),
                },
              ],
              updated_at: Date.now(),
            };
          }),
        })),

      restCombatant: (encounter_id, combatant_id, rest_type) =>
        set((s) => ({
          encounters: s.encounters.map((e) => {
            if (e.id !== encounter_id) return e;
            const target = e.combatants.find((c) => c.id === combatant_id);
            if (!target) return e;
            const restored_resources = (target.resources_remaining ?? []).map(
              (r) => {
                const should_restore =
                  rest_type === 'long'
                    ? r.recharge === 'long_rest' ||
                      r.recharge === 'short_rest' ||
                      r.recharge === 'turn'
                    : r.recharge === 'short_rest' || r.recharge === 'turn';
                return should_restore ? { ...r, remaining: r.total } : r;
              }
            );
            const restored_features = (target.activated_features_remaining ?? []).map(
              (f) => {
                const should_restore =
                  rest_type === 'long'
                    ? f.recharge === 'long_rest' ||
                      f.recharge === 'short_rest' ||
                      f.recharge === 'turn'
                    : f.recharge === 'short_rest' || f.recharge === 'turn';
                return should_restore ? { ...f, remaining: f.total } : f;
              }
            );
            const restored_slots =
              rest_type === 'long'
                ? (target.spell_slots_remaining ?? []).map((sl) => ({
                    ...sl,
                    remaining: sl.total,
                  }))
                : target.spell_slots_remaining;
            const new_hp =
              rest_type === 'long' ? target.hp_max : target.hp_current;
            return {
              ...e,
              combatants: e.combatants.map((c) =>
                c.id === combatant_id
                  ? {
                      ...c,
                      hp_current: new_hp,
                      resources_remaining: restored_resources,
                      activated_features_remaining: restored_features,
                      spell_slots_remaining: restored_slots,
                    }
                  : c
              ),
              log: [
                ...e.log,
                {
                  round: e.round,
                  message: `${target.name} finished a ${rest_type} rest`,
                  timestamp: Date.now(),
                },
              ],
              updated_at: Date.now(),
            };
          }),
        })),
    }),
    {
      name: 'dnd-tracker-encounters',
    }
  )
);
