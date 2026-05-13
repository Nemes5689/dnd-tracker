import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCampaignStore } from '@/store/campaignStore';
import { useEncounterStore } from '@/store/encounterStore';
import { useSRDStore } from '@/store/srdStore';
import { rollD20 } from '@/engine/dice';
import { CombatView } from '@/components/combat/CombatView';
import { EncounterSetup } from '@/components/combat/EncounterSetup';
import type { Combatant } from '@/types/app';

export function CombatPage() {
  const { getActiveCampaign, updateCampaign } = useCampaignStore();
  const active = getActiveCampaign();
  const { encounters, createEncounter, deleteEncounter, startCombat } =
    useEncounterStore();
  const { loaded, load } = useSRDStore();
  const [search_params, set_search_params] = useSearchParams();

  useEffect(() => {
    if (!loaded) load();
  }, [loaded, load]);

  // Currently selected encounter (for setup or active combat)
  const [active_id, set_active_id] = useState<string | null>(null);

  // If a ?encounter=... query param is present, open that encounter
  // (the Encounters page navigates here with this param).
  useEffect(() => {
    const param = search_params.get('encounter');
    if (param) {
      set_active_id(param);
      // Clear the query param so refreshing/back doesn't re-open it
      const next = new URLSearchParams(search_params);
      next.delete('encounter');
      set_search_params(next, { replace: true });
    }
  }, [search_params, set_search_params]);

  if (!active) {
    return (
      <div className="p-8 text-text-secondary">
        Create or select a campaign first (use the sidebar).
      </div>
    );
  }

  // Filter encounters to this campaign
  const campaign_encounters = encounters.filter(
    (e) => e.campaign_id === active.id
  );

  // The encounter we're working with
  const current_encounter = active_id
    ? encounters.find((e) => e.id === active_id)
    : null;

  // If we have an active encounter, route to the right view
  if (current_encounter) {
    if (current_encounter.status === 'active') {
      return (
        <CombatView
          encounter={current_encounter}
          onExit={() => set_active_id(null)}
        />
      );
    }
    return (
      <EncounterSetup
        encounter={current_encounter}
        campaign={active}
        onStart={() => startCombat(current_encounter.id)}
        onExit={() => set_active_id(null)}
      />
    );
  }

  // Otherwise: encounter list view
  const handleNewEncounter = () => {
    const name = prompt('Encounter name?', 'New encounter');
    if (!name) return;
    const id = createEncounter(active.id, name);
    // Add the new encounter to the campaign's list
    updateCampaign(active.id, {
      encounter_ids: [...active.encounter_ids, id],
    });
    set_active_id(id);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this encounter?')) return;
    deleteEncounter(id);
    updateCampaign(active.id, {
      encounter_ids: active.encounter_ids.filter((eid) => eid !== id),
    });
  };

  return (
    <div className="p-8 max-w-[900px]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="text-[11px] text-text-tertiary mb-1">
            {active.name}
          </div>
          <h2>Encounters</h2>
        </div>
        <button
          onClick={handleNewEncounter}
          className="bg-accent-50 border-accent-300 text-accent-900 font-medium"
          style={{ padding: '8px 14px', fontSize: '13px' }}
        >
          + New encounter
        </button>
      </div>

      {campaign_encounters.length === 0 ? (
        <div className="text-text-tertiary text-[13px] italic mt-4">
          No encounters yet. Click "+ New encounter" to start a combat.
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {campaign_encounters.map((e) => (
            <div
              key={e.id}
              className="bg-bg-primary flex justify-between items-center"
              style={{
                padding: '12px 14px',
                border:
                  e.status === 'active'
                    ? '0.5px solid var(--color-border-secondary)'
                    : '0.5px solid var(--color-border-tertiary)',
                borderRadius: 'var(--border-radius-md)',
              }}
            >
              <div>
                <div className="text-[13px] font-medium mb-1">{e.name}</div>
                <div className="text-[11px] text-text-tertiary">
                  {e.status === 'active'
                    ? `In progress · round ${e.round} · ${e.combatants.length} combatants`
                    : e.status === 'completed'
                    ? `Completed · ${e.combatants.length} combatants`
                    : `Planned · ${e.combatants.length} combatants`}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => set_active_id(e.id)}
                  className={
                    e.status === 'active'
                      ? 'bg-accent-50 border-accent-300 text-accent-900 font-medium'
                      : ''
                  }
                  style={{ padding: '6px 12px', fontSize: '12px' }}
                >
                  {e.status === 'active' ? 'Continue' : 'Open'}
                </button>
                <button
                  onClick={() => handleDelete(e.id)}
                  style={{
                    padding: '6px 10px',
                    fontSize: '12px',
                    color: 'var(--color-text-danger)',
                    borderColor: 'var(--color-border-danger)',
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Helper function used by EncounterSetup
export function rollInitiativeFor(modifier: number): number {
  return rollD20(modifier).total;
}


function movementSpeedsFromMonsterSpeed(
  speed: import('@/types/srd').MonsterSpeed | undefined
): Combatant['movement_speeds'] {
  if (!speed) return { walk: 30 };
  if (typeof speed === 'string') {
    const speeds: NonNullable<Combatant['movement_speeds']> = {};
    const re = /(?:(walk|climb|swim|fly|burrow)\s*)?(\d+)\s*ft/gi;
    let match: RegExpExecArray | null;
    while ((match = re.exec(speed))) {
      const mode = (match[1]?.toLowerCase() ?? 'walk') as keyof NonNullable<Combatant['movement_speeds']>;
      speeds[mode] = parseInt(match[2], 10);
    }
    return Object.keys(speeds).length ? speeds : { walk: 30 };
  }
  return { ...speed };
}

// Helper to convert a character into a Combatant
export function characterToCombatant(
  character: import('@/types/app').Character,
  initiative: number
): Combatant {
  return {
    id: crypto.randomUUID(),
    name: character.name,
    source_type: 'character',
    source_id: character.id,
    hp_max: character.hp_max,
    hp_current: character.hp_current,
    hp_temp: 0,
    ac: character.ac,
    initiative,
    conditions: [],
    is_player: character.type === 'pc',
    action_used: false,
    bonus_action_used: false,
    reaction_used: false,
    movement_used: 0,
    movement_speeds: { walk: character.speed || 30 },
    has_flanking: false,
    cover: 'none',
    spell_slots_remaining: character.spellcasting?.slots.map((s) => ({ ...s })),
    resources_remaining: character.resources?.map((r) => ({ ...r })),
    activated_features_remaining: character.activated_features?.map((f) => ({ ...f })),
  };
}

// Helper to convert a monster into a Combatant
export function monsterToCombatant(
  monster: import('@/types/srd').Monster,
  index: number,
  initiative: number
): Combatant {
  // If multiple of the same monster, suffix with #1, #2, etc.
  const display_name = index > 0 ? `${monster.name} #${index + 1}` : monster.name;
  return {
    id: crypto.randomUUID(),
    name: display_name,
    source_type: 'monster',
    source_id: monster.id,
    hp_max: monster.hp ?? 1,
    hp_current: monster.hp ?? 1,
    hp_temp: 0,
    ac: monster.ac ?? 10,
    initiative,
    conditions: [],
    is_player: false,
    size: monster.size ?? 'Medium',
    action_used: false,
    bonus_action_used: false,
    reaction_used: false,
    movement_used: 0,
    movement_speeds: movementSpeedsFromMonsterSpeed(monster.speed),
    has_flanking: false,
    cover: 'none',
    spell_slots_remaining: monster.spellcasting?.slots?.map((s) => ({ ...s })),
    resources_remaining: monster.resources?.map((r) => ({ ...r })),
    activated_features_remaining: monster.activated_features?.map((f) => ({ ...f })),
  };
}

/**
 * Convert an ally statblock into a Combatant. Same as monsterToCombatant
 * but with is_ally=true and source_type='ally', so combat code can render
 * different colors and apply different visibility rules.
 */
export function allyToCombatant(
  ally: import('@/types/srd').Monster,
  index: number,
  initiative: number
): Combatant {
  const display_name = index > 0 ? `${ally.name} #${index + 1}` : ally.name;
  return {
    id: crypto.randomUUID(),
    name: display_name,
    source_type: 'ally',
    source_id: ally.id,
    hp_max: ally.hp ?? 1,
    hp_current: ally.hp ?? 1,
    hp_temp: 0,
    ac: ally.ac ?? 10,
    initiative,
    conditions: [],
    is_player: false,
    is_ally: true,
    size: ally.size ?? 'Medium',
    action_used: false,
    bonus_action_used: false,
    reaction_used: false,
    movement_used: 0,
    movement_speeds: movementSpeedsFromMonsterSpeed(ally.speed),
    has_flanking: false,
    cover: 'none',
    spell_slots_remaining: ally.spellcasting?.slots?.map((s) => ({ ...s })),
    resources_remaining: ally.resources?.map((r) => ({ ...r })),
    activated_features_remaining: ally.activated_features?.map((f) => ({ ...f })),
  };
}
