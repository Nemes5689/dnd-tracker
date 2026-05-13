import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCampaignStore } from '@/store/campaignStore';
import { useEncounterStore } from '@/store/encounterStore';
import { Lightbox } from '@/components/common/Lightbox';
import { formatBytes, processGalleryImage } from '@/utils/imageUtils';
import type {
  Campaign,
  Encounter,
  Combatant,
  SessionEntry,
  PlotThread,
  CampaignNPC,
  Quest,
  CampaignLocation,
  CampaignFaction,
  NextSessionPlan,
  NextSessionChecklistItem,
} from '@/types/app';

/**
 * Main dashboard. Shows campaign overview, party, in-game calendar,
 * recent sessions, plot threads, NPCs, quests, locations, and quick links
 * to encounters. Each section is a self-contained module.
 */
export function DashboardPage() {
  const { getActiveCampaign, updateCampaign } = useCampaignStore();
  const active = getActiveCampaign();

  if (!active) {
    return (
      <div className="p-8 text-text-secondary">
        Create or select a campaign first (use the sidebar).
      </div>
    );
  }

  const update = (patch: Partial<Campaign>) => {
    updateCampaign(active.id, patch);
  };

  return (
    <div className="page-padding max-w-[1400px]">
      {/* Header: campaign name + description */}
      <CampaignHeader campaign={active} onUpdate={update} />

      {/* Global search: find any named entity and see all its connections */}
      <GlobalSearchModule campaign={active} />

      {/* Top row: party + calendar */}
      <div
        className="grid gap-4 mb-4"
        style={{ gridTemplateColumns: '1fr 1fr' }}
      >
        <PartyModule campaign={active} />
        <CalendarModule campaign={active} onUpdate={update} />
      </div>

      {/* Encounter quick links */}
      <EncountersModule campaign={active} />

      {/* Next session planner */}
      <NextSessionModule campaign={active} onUpdate={update} />

      {/* Sessions journal */}
      <SessionsModule campaign={active} onUpdate={update} />

      {/* World factions */}
      <FactionsModule campaign={active} onUpdate={update} />

      {/* Two-column: plot threads + quests */}
      <div
        className="grid gap-4 mb-4"
        style={{ gridTemplateColumns: '1fr 1fr' }}
      >
        <PlotThreadsModule campaign={active} onUpdate={update} />
        <QuestsModule campaign={active} onUpdate={update} />
      </div>

      {/* Two-column: NPCs + locations */}
      <div
        className="grid gap-4 mb-4"
        style={{ gridTemplateColumns: '1fr 1fr' }}
      >
        <NPCsModule campaign={active} onUpdate={update} />
        <LocationsModule campaign={active} onUpdate={update} />
      </div>
    </div>
  );
}

// ============================================================
// Campaign Header
// ============================================================

function CampaignHeader({
  campaign,
  onUpdate,
}: {
  campaign: Campaign;
  onUpdate: (patch: Partial<Campaign>) => void;
}) {
  const [editing, set_editing] = useState(false);
  const [name, set_name] = useState(campaign.name);
  const [desc, set_desc] = useState(campaign.description);

  const save = () => {
    onUpdate({ name: name.trim() || campaign.name, description: desc.trim() });
    set_editing(false);
  };

  if (editing) {
    return (
      <div className="mb-6">
        <input
          value={name}
          onChange={(e) => set_name(e.target.value)}
          placeholder="Campaign name"
          style={{
            width: '100%',
            fontSize: '22px',
            fontWeight: 500,
            marginBottom: 8,
          }}
        />
        <textarea
          value={desc}
          onChange={(e) => set_desc(e.target.value)}
          placeholder="A short description of the campaign..."
          style={{
            width: '100%',
            minHeight: 60,
            fontSize: '13px',
            resize: 'vertical',
            boxSizing: 'border-box',
          }}
        />
        <div className="flex gap-2 mt-2">
          <button
            onClick={save}
            className="bg-accent-50 border-accent-300 text-accent-900 font-medium"
            style={{ padding: '6px 14px', fontSize: '12px' }}
          >
            Save
          </button>
          <button
            onClick={() => {
              set_name(campaign.name);
              set_desc(campaign.description);
              set_editing(false);
            }}
            style={{ padding: '6px 14px', fontSize: '12px' }}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h2 style={{ marginBottom: 4 }}>{campaign.name}</h2>
          {campaign.description ? (
            <p className="text-[13px] text-text-secondary leading-relaxed">
              {campaign.description}
            </p>
          ) : (
            <p className="text-[13px] text-text-tertiary italic">
              No description. Click Edit to add one.
            </p>
          )}
        </div>
        <button
          onClick={() => set_editing(true)}
          style={{ fontSize: '12px', padding: '5px 10px' }}
          title="Edit campaign"
        >
          ✎ Edit
        </button>
      </div>
    </div>
  );
}

// ============================================================
// Party Module
// ============================================================

function PartyModule({ campaign }: { campaign: Campaign }) {
  const navigate = useNavigate();
  const characters = campaign.characters;

  return (
    <Module title="Party" right={<span className="text-[11px] text-text-tertiary">{characters.length} {characters.length === 1 ? 'character' : 'characters'}</span>}>
      {characters.length === 0 ? (
        <EmptyState
          message="No characters yet."
          actionLabel="Manage characters"
          onAction={() => navigate('/characters')}
        />
      ) : (
        <div className="flex flex-col gap-2">
          {characters.map((c) => {
            const hp_pct = c.hp_max > 0 ? (c.hp_current / c.hp_max) * 100 : 0;
            const hp_color =
              hp_pct > 60 ? '#22C55E' : hp_pct > 30 ? '#F59E0B' : '#EF4444';
            return (
              <div
                key={c.id}
                className="flex items-center gap-3"
                style={{
                  padding: '8px 10px',
                  background: 'var(--color-background-secondary)',
                  borderRadius: 'var(--border-radius-md)',
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: c.avatar
                      ? `url(${c.avatar}) center/cover no-repeat`
                      : '#3B82F6',
                    border: '1.5px solid #1E40AF',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: 13,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {!c.avatar && c.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium">{c.name}</div>
                  <div className="text-[11px] text-text-tertiary">
                    {c.class}
                    {c.level && ` ${c.level}`}
                    {c.species && ` · ${c.species}`}
                  </div>
                </div>
                <div style={{ minWidth: 100 }}>
                  <div className="flex justify-between text-[10px] text-text-tertiary mb-1">
                    <span>HP</span>
                    <span>{c.hp_current}/{c.hp_max}</span>
                  </div>
                  <div
                    style={{
                      height: 4,
                      background: 'var(--color-background-tertiary)',
                      borderRadius: 2,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${Math.max(0, hp_pct)}%`,
                        height: '100%',
                        background: hp_color,
                      }}
                    />
                  </div>
                </div>
                <div className="text-[11px] text-text-tertiary" style={{ minWidth: 60 }}>
                  AC {c.ac}
                </div>
              </div>
            );
          })}
          <button
            onClick={() => navigate('/characters')}
            style={{ fontSize: '11px', padding: '5px 10px', alignSelf: 'flex-start' }}
          >
            Manage party →
          </button>
        </div>
      )}
    </Module>
  );
}

// ============================================================
// Calendar / Time Module
// ============================================================

function CalendarModule({
  campaign,
  onUpdate,
}: {
  campaign: Campaign;
  onUpdate: (patch: Partial<Campaign>) => void;
}) {
  const cal = campaign.calendar ?? {
    current_date: '',
    time_of_day: '',
    weather: '',
  };
  const [editing, set_editing] = useState(false);
  const [date, set_date] = useState(cal.current_date);
  const [time_of_day, set_tod] = useState(cal.time_of_day);
  const [weather, set_weather] = useState(cal.weather);
  const [location, set_location] = useState(campaign.party_location ?? '');

  const save = () => {
    onUpdate({
      calendar: {
        current_date: date.trim(),
        time_of_day: time_of_day.trim(),
        weather: weather.trim(),
      },
      party_location: location.trim(),
    });
    set_editing(false);
  };

  return (
    <Module
      title="Where & When"
      right={
        <button
          onClick={() => set_editing(!editing)}
          style={{ fontSize: '11px', padding: '3px 8px' }}
        >
          {editing ? 'Cancel' : '✎ Edit'}
        </button>
      }
    >
      {editing ? (
        <div className="flex flex-col gap-2">
          <FieldLabel label="In-game date">
            <input
              value={date}
              onChange={(e) => set_date(e.target.value)}
              placeholder="e.g. 15th of Mirtul, 1495 DR"
              style={{ width: '100%' }}
            />
          </FieldLabel>
          <div className="grid gap-2" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <FieldLabel label="Time of day">
              <input
                value={time_of_day}
                onChange={(e) => set_tod(e.target.value)}
                placeholder="morning / dusk / midnight..."
                style={{ width: '100%' }}
              />
            </FieldLabel>
            <FieldLabel label="Weather">
              <input
                value={weather}
                onChange={(e) => set_weather(e.target.value)}
                placeholder="clear / raining / blizzard..."
                style={{ width: '100%' }}
              />
            </FieldLabel>
          </div>
          <FieldLabel label="Party location">
            <input
              value={location}
              onChange={(e) => set_location(e.target.value)}
              placeholder="e.g. Phandalin, The Sword Coast"
              style={{ width: '100%' }}
            />
          </FieldLabel>
          <button
            onClick={save}
            className="bg-accent-50 border-accent-300 text-accent-900 font-medium"
            style={{ padding: '6px 14px', fontSize: '12px', alignSelf: 'flex-start' }}
          >
            Save
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <DataRow
            label="Date"
            value={cal.current_date || <span className="italic text-text-tertiary">not set</span>}
          />
          <DataRow
            label="Time"
            value={cal.time_of_day || <span className="italic text-text-tertiary">not set</span>}
          />
          <DataRow
            label="Weather"
            value={cal.weather || <span className="italic text-text-tertiary">not set</span>}
          />
          <DataRow
            label="Location"
            value={
              campaign.party_location || (
                <span className="italic text-text-tertiary">unknown</span>
              )
            }
          />
        </div>
      )}
    </Module>
  );
}

// ============================================================
// Encounters Quick Links
// ============================================================

function EncountersModule({ campaign }: { campaign: Campaign }) {
  const navigate = useNavigate();
  const { encounters } = useEncounterStore();
  const my_encounters = encounters
    .filter((e) => e.campaign_id === campaign.id)
    .sort((a, b) => b.updated_at - a.updated_at);

  const active_count = my_encounters.filter((e) => e.status === 'active').length;
  const recent = my_encounters.slice(0, 3);

  return (
    <Module
      title="Encounters"
      right={
        <span className="text-[11px] text-text-tertiary">
          {my_encounters.length} total
          {active_count > 0 && ` · ${active_count} active`}
        </span>
      }
    >
      {recent.length === 0 ? (
        <EmptyState
          message="No encounters yet."
          actionLabel="Create encounter"
          onAction={() => navigate('/encounters')}
        />
      ) : (
        <div className="flex flex-col gap-2">
          {recent.map((e) => (
            <button
              key={e.id}
              onClick={() => navigate(`/combat?encounter=${e.id}`)}
              style={{
                padding: '8px 12px',
                background: 'var(--color-background-secondary)',
                borderRadius: 'var(--border-radius-md)',
                border: 'none',
                textAlign: 'left',
                cursor: 'pointer',
              }}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-[13px] font-medium">{e.name}</div>
                  <div className="text-[10px] text-text-tertiary">
                    {e.combatants.length} combatants
                    {e.status === 'active' && ` · round ${e.round}`}
                  </div>
                </div>
                <span
                  style={{
                    fontSize: 9,
                    padding: '2px 6px',
                    borderRadius: 4,
                    background:
                      e.status === 'active'
                        ? '#DCFCE7'
                        : e.status === 'completed'
                        ? '#DBEAFE'
                        : '#E5E7EB',
                    color:
                      e.status === 'active'
                        ? '#166534'
                        : e.status === 'completed'
                        ? '#1E40AF'
                        : '#374151',
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                    fontWeight: 500,
                  }}
                >
                  {e.status}
                </span>
              </div>
            </button>
          ))}
          <button
            onClick={() => navigate('/encounters')}
            style={{ fontSize: '11px', padding: '5px 10px', alignSelf: 'flex-start' }}
          >
            View all encounters →
          </button>
        </div>
      )}
    </Module>
  );
}

// ============================================================
// Sessions Journal
// ============================================================

// ============================================================
// Next Session Plan
// ============================================================

function NextSessionModule({
  campaign,
  onUpdate,
}: {
  campaign: Campaign;
  onUpdate: (patch: Partial<Campaign>) => void;
}) {
  const navigate = useNavigate();
  const { encounters } = useEncounterStore();
  const empty_plan: NextSessionPlan = {
    planned_date: '',
    goal: '',
    notes: '',
    encounters_planned: [],
    npcs_appearing: [],
    plot_beats: [],
    rewards_planned: '',
    checklist: [],
  };
  const plan = campaign.next_session ?? empty_plan;

  const [editing, set_editing] = useState(false);

  // Local draft state for editing
  const [planned_date, set_planned_date] = useState(plan.planned_date);
  const [goal, set_goal] = useState(plan.goal);
  const [notes, set_notes] = useState(plan.notes);
  const [encounters_planned, set_enc] = useState<string[]>(plan.encounters_planned);
  const [npcs_appearing, set_npcs] = useState<string[]>(plan.npcs_appearing);
  const [plot_beats, set_beats] = useState<string[]>(plan.plot_beats);
  const [rewards_planned, set_rewards] = useState(plan.rewards_planned);
  const [checklist, set_checklist] = useState<NextSessionChecklistItem[]>(
    plan.checklist
  );

  const start_edit = () => {
    set_planned_date(plan.planned_date);
    set_goal(plan.goal);
    set_notes(plan.notes);
    set_enc(plan.encounters_planned);
    set_npcs(plan.npcs_appearing);
    set_beats(plan.plot_beats);
    set_rewards(plan.rewards_planned);
    set_checklist(plan.checklist);
    set_editing(true);
  };

  const save = () => {
    onUpdate({
      next_session: {
        planned_date: planned_date.trim(),
        goal: goal.trim(),
        notes: notes.trim(),
        encounters_planned: encounters_planned.filter((s) => s.trim()),
        npcs_appearing: npcs_appearing.filter((s) => s.trim()),
        plot_beats: plot_beats.filter((s) => s.trim()),
        rewards_planned: rewards_planned.trim(),
        checklist: checklist.filter((c) => c.text.trim()),
      },
    });
    set_editing(false);
  };

  const clear_plan = () => {
    if (!confirm('Clear the next session plan? This cannot be undone.')) return;
    onUpdate({ next_session: empty_plan });
    set_editing(false);
  };

  const promote_to_journal = () => {
    if (!plan.goal.trim() && !plan.notes.trim()) {
      alert('The plan is empty. Add a goal or notes first.');
      return;
    }
    if (
      !confirm(
        'Convert this plan into a session journal entry? The plan will be cleared and a new session entry will be created in the journal.'
      )
    )
      return;

    const next_number =
      (campaign.sessions ?? []).length === 0
        ? 1
        : Math.max(...(campaign.sessions ?? []).map((s) => s.session_number)) + 1;

    const new_entry: SessionEntry = {
      id: crypto.randomUUID(),
      session_number: next_number,
      real_date: plan.planned_date || new Date().toISOString().slice(0, 10),
      in_game_date: '',
      title: plan.goal,
      summary: [
        plan.notes,
        plan.plot_beats.length > 0 ? `\nPlot beats:\n- ${plan.plot_beats.join('\n- ')}` : '',
        plan.rewards_planned ? `\nRewards: ${plan.rewards_planned}` : '',
      ]
        .filter(Boolean)
        .join('\n'),
      participants: campaign.characters.map((c) => c.name),
      created_at: Date.now(),
    };

    onUpdate({
      sessions: [...(campaign.sessions ?? []), new_entry],
      next_session: empty_plan,
    });
  };

  const has_content =
    plan.planned_date ||
    plan.goal ||
    plan.notes ||
    plan.encounters_planned.length > 0 ||
    plan.npcs_appearing.length > 0 ||
    plan.plot_beats.length > 0 ||
    plan.rewards_planned ||
    plan.checklist.length > 0;

  const planned_encounters_resolved = plan.encounters_planned.map((id_or_name) => {
    const e = encounters.find((x) => x.id === id_or_name);
    return e ? { kind: 'ref' as const, encounter: e } : { kind: 'text' as const, text: id_or_name };
  });

  const npcs = campaign.npcs ?? [];
  const planned_npcs_resolved = plan.npcs_appearing.map((id_or_name) => {
    const n = npcs.find((x) => x.id === id_or_name);
    return n ? { kind: 'ref' as const, npc: n } : { kind: 'text' as const, text: id_or_name };
  });

  if (editing) {
    return (
      <Module
        title="Next Session Plan"
        right={
          <div className="flex gap-1">
            <button
              onClick={save}
              className="bg-accent-50 border-accent-300 text-accent-900 font-medium"
              style={{ fontSize: '11px', padding: '4px 12px' }}
            >
              Save
            </button>
            <button
              onClick={() => set_editing(false)}
              style={{ fontSize: '11px', padding: '4px 10px' }}
            >
              Cancel
            </button>
          </div>
        }
      >
        <div className="grid gap-2 mb-3" style={{ gridTemplateColumns: '160px 1fr' }}>
          <FieldLabel label="Planned date">
            <input
              type="date"
              value={planned_date}
              onChange={(e) => set_planned_date(e.target.value)}
              style={{ width: '100%' }}
            />
          </FieldLabel>
          <FieldLabel label="Main goal / hook">
            <input
              value={goal}
              onChange={(e) => set_goal(e.target.value)}
              placeholder="e.g. Party meets Sildar at the Stonehill Inn"
              style={{ width: '100%' }}
            />
          </FieldLabel>
        </div>

        <FieldLabel label="Prep notes (mood, setup, opening scene...)">
          <textarea
            value={notes}
            onChange={(e) => set_notes(e.target.value)}
            placeholder="What kind of session is this? Combat-heavy? Roleplay? Mystery? What's the opening scene?"
            style={{
              width: '100%',
              minHeight: 70,
              fontSize: '12px',
              resize: 'vertical',
              boxSizing: 'border-box',
            }}
          />
        </FieldLabel>

        {/* Encounters */}
        <div className="mt-3">
          <div className="text-[11px] text-text-secondary mb-1 font-medium">
            Encounters planned
          </div>
          <BulletEditor
            items={encounters_planned}
            onChange={set_enc}
            placeholder="Type encounter name or pick from below"
            picker={{
              label: 'My encounters:',
              options: encounters
                .filter((e) => e.campaign_id === campaign.id)
                .map((e) => ({ id: e.id, label: `${e.name} (${e.combatants.length} combatants)` })),
            }}
          />
        </div>

        {/* NPCs */}
        <div className="mt-3">
          <div className="text-[11px] text-text-secondary mb-1 font-medium">
            NPCs appearing
          </div>
          <BulletEditor
            items={npcs_appearing}
            onChange={set_npcs}
            placeholder="Type NPC name or pick from below"
            picker={
              npcs.length > 0
                ? {
                    label: 'My NPCs:',
                    options: npcs.map((n) => ({
                      id: n.id,
                      label: n.role ? `${n.name} (${n.role})` : n.name,
                    })),
                  }
                : undefined
            }
          />
        </div>

        {/* Plot beats */}
        <div className="mt-3">
          <div className="text-[11px] text-text-secondary mb-1 font-medium">
            Plot beats / story moments
          </div>
          <BulletEditor
            items={plot_beats}
            onChange={set_beats}
            placeholder="e.g. Reveal that the mayor is corrupt"
          />
        </div>

        {/* Rewards */}
        <div className="mt-3">
          <FieldLabel label="Rewards planned (loot, magic items, level-up)">
            <input
              value={rewards_planned}
              onChange={(e) => set_rewards(e.target.value)}
              placeholder="e.g. 200 gp, Cloak of Elvenkind, level 4"
              style={{ width: '100%' }}
            />
          </FieldLabel>
        </div>

        {/* Checklist */}
        <div className="mt-3">
          <div className="text-[11px] text-text-secondary mb-1 font-medium">
            Prep checklist
          </div>
          <ChecklistEditor items={checklist} onChange={set_checklist} />
        </div>

        {has_content && (
          <button
            onClick={clear_plan}
            style={{
              fontSize: '11px',
              padding: '4px 10px',
              marginTop: 12,
              color: 'var(--color-text-tertiary)',
            }}
          >
            Clear entire plan
          </button>
        )}
      </Module>
    );
  }

  // ====== Read-only view ======
  return (
    <Module
      title="Next Session Plan"
      right={
        <div className="flex gap-1">
          {has_content && (
            <button
              onClick={promote_to_journal}
              style={{ fontSize: '11px', padding: '4px 10px' }}
              title="When the session is over, convert this plan to a journal entry"
            >
              ✓ Mark played
            </button>
          )}
          <button
            onClick={start_edit}
            style={{ fontSize: '11px', padding: '4px 10px' }}
          >
            {has_content ? '✎ Edit' : '+ Plan next session'}
          </button>
        </div>
      }
    >
      {!has_content ? (
        <EmptyState message="No plan yet. Click '+ Plan next session' to start." />
      ) : (
        <div className="flex flex-col gap-3">
          {/* Date + goal */}
          {(plan.planned_date || plan.goal) && (
            <div className="flex gap-3 items-baseline flex-wrap">
              {plan.planned_date && (
                <span
                  style={{
                    fontSize: 11,
                    padding: '3px 10px',
                    background: 'var(--color-background-info)',
                    color: 'var(--color-text-info)',
                    borderRadius: 4,
                    fontWeight: 500,
                  }}
                >
                  📅 {plan.planned_date}
                </span>
              )}
              {plan.goal && (
                <div className="text-[14px] font-medium flex-1">{plan.goal}</div>
              )}
            </div>
          )}

          {/* Notes */}
          {plan.notes && (
            <div
              className="text-[12px] leading-relaxed"
              style={{
                whiteSpace: 'pre-wrap',
                padding: '10px 12px',
                background: 'var(--color-background-secondary)',
                borderRadius: 'var(--border-radius-md)',
              }}
            >
              {plan.notes}
            </div>
          )}

          {/* Two-column lists */}
          <div className="grid gap-3" style={{ gridTemplateColumns: '1fr 1fr' }}>
            {/* Encounters */}
            {plan.encounters_planned.length > 0 && (
              <div>
                <div className="text-[11px] font-medium text-text-secondary mb-1">
                  Encounters
                </div>
                <div className="flex flex-col gap-1">
                  {planned_encounters_resolved.map((it, idx) =>
                    it.kind === 'ref' ? (
                      <button
                        key={idx}
                        onClick={() => navigate(`/combat?encounter=${it.encounter.id}`)}
                        style={{
                          padding: '5px 10px',
                          background: 'var(--color-background-secondary)',
                          borderRadius: 4,
                          fontSize: 11,
                          textAlign: 'left',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        ⚔ {it.encounter.name}
                        <span className="text-text-tertiary ml-2">
                          ({it.encounter.combatants.length} combatants)
                        </span>
                      </button>
                    ) : (
                      <div
                        key={idx}
                        style={{
                          padding: '5px 10px',
                          background: 'var(--color-background-secondary)',
                          borderRadius: 4,
                          fontSize: 11,
                        }}
                      >
                        ⚔ {it.text}
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {/* NPCs */}
            {plan.npcs_appearing.length > 0 && (
              <div>
                <div className="text-[11px] font-medium text-text-secondary mb-1">
                  NPCs appearing
                </div>
                <div className="flex flex-col gap-1">
                  {planned_npcs_resolved.map((it, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '5px 10px',
                        background: 'var(--color-background-secondary)',
                        borderRadius: 4,
                        fontSize: 11,
                      }}
                    >
                      {it.kind === 'ref' ? (
                        <>
                          👤 <span className="font-medium">{it.npc.name}</span>
                          {it.npc.role && (
                            <span className="text-text-tertiary ml-1">
                              · {it.npc.role}
                            </span>
                          )}
                        </>
                      ) : (
                        <>👤 {it.text}</>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Plot beats */}
          {plan.plot_beats.length > 0 && (
            <div>
              <div className="text-[11px] font-medium text-text-secondary mb-1">
                Plot beats
              </div>
              <ul className="flex flex-col gap-1" style={{ margin: 0, paddingLeft: 18 }}>
                {plan.plot_beats.map((b, idx) => (
                  <li key={idx} className="text-[12px] leading-relaxed">
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Rewards */}
          {plan.rewards_planned && (
            <div className="text-[12px]">
              <span className="text-text-tertiary">Rewards: </span>
              {plan.rewards_planned}
            </div>
          )}

          {/* Checklist */}
          {plan.checklist.length > 0 && (
            <div>
              <div className="text-[11px] font-medium text-text-secondary mb-1">
                Prep checklist
                <span className="text-text-tertiary ml-2 font-normal">
                  ({plan.checklist.filter((c) => c.done).length}/{plan.checklist.length})
                </span>
              </div>
              <div className="flex flex-col gap-1">
                {plan.checklist.map((item) => (
                  <label
                    key={item.id}
                    className="flex items-center gap-2 text-[12px]"
                    style={{ cursor: 'pointer' }}
                  >
                    <input
                      type="checkbox"
                      checked={item.done}
                      onChange={() => {
                        onUpdate({
                          next_session: {
                            ...plan,
                            checklist: plan.checklist.map((c) =>
                              c.id === item.id ? { ...c, done: !c.done } : c
                            ),
                          },
                        });
                      }}
                    />
                    <span
                      style={{
                        textDecoration: item.done ? 'line-through' : 'none',
                        color: item.done
                          ? 'var(--color-text-tertiary)'
                          : undefined,
                      }}
                    >
                      {item.text}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Module>
  );
}

/**
 * Editable bullet list. Each item can be a free-text or a chosen option from
 * an optional picker (e.g. existing encounters or NPCs).
 */
function BulletEditor({
  items,
  onChange,
  placeholder,
  picker,
}: {
  items: string[];
  onChange: (next: string[]) => void;
  placeholder: string;
  picker?: { label: string; options: { id: string; label: string }[] };
}) {
  const [draft, set_draft] = useState('');

  const add = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    if (items.includes(trimmed)) return;
    onChange([...items, trimmed]);
  };

  return (
    <div>
      <div className="flex flex-col gap-1 mb-2">
        {items.map((it, idx) => {
          const matched = picker?.options.find((o) => o.id === it);
          const display = matched ? matched.label : it;
          return (
            <div
              key={idx}
              className="flex justify-between items-center"
              style={{
                padding: '4px 10px',
                background: 'var(--color-background-secondary)',
                borderRadius: 4,
                fontSize: 11,
              }}
            >
              <span className="truncate">{display}</span>
              <button
                onClick={() => onChange(items.filter((_, i) => i !== idx))}
                style={{
                  fontSize: 11,
                  padding: '0 4px',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--color-text-tertiary)',
                  cursor: 'pointer',
                }}
              >
                ×
              </button>
            </div>
          );
        })}
      </div>
      <div className="flex gap-1">
        <input
          value={draft}
          onChange={(e) => set_draft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              add(draft);
              set_draft('');
            }
          }}
          placeholder={placeholder}
          style={{ flex: 1, fontSize: 11, height: 26, minWidth: 0 }}
        />
        <button
          onClick={() => {
            add(draft);
            set_draft('');
          }}
          style={{ fontSize: 11, padding: '0 10px', flexShrink: 0 }}
        >
          + Add
        </button>
      </div>
      {picker && picker.options.length > 0 && (
        <div className="mt-2">
          <div className="text-[10px] text-text-tertiary mb-1">{picker.label}</div>
          <div className="flex gap-1 flex-wrap">
            {picker.options.map((opt) => {
              const sel = items.includes(opt.id);
              return (
                <button
                  key={opt.id}
                  onClick={() => {
                    if (sel) {
                      onChange(items.filter((x) => x !== opt.id));
                    } else {
                      onChange([...items, opt.id]);
                    }
                  }}
                  style={{
                    fontSize: 10,
                    padding: '3px 8px',
                    background: sel
                      ? 'var(--color-background-info)'
                      : 'var(--color-background-secondary)',
                    border: sel
                      ? '0.5px solid var(--color-border-info)'
                      : '0.5px solid var(--color-border-tertiary)',
                    color: sel ? 'var(--color-text-info)' : undefined,
                    fontWeight: sel ? 500 : 400,
                    borderRadius: 12,
                    cursor: 'pointer',
                  }}
                >
                  {sel ? '✓ ' : '+ '}
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Editable checklist with done toggles.
 */
function ChecklistEditor({
  items,
  onChange,
}: {
  items: NextSessionChecklistItem[];
  onChange: (next: NextSessionChecklistItem[]) => void;
}) {
  const [draft, set_draft] = useState('');

  const add = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onChange([
      ...items,
      { id: crypto.randomUUID(), text: trimmed, done: false },
    ]);
    set_draft('');
  };

  return (
    <div>
      <div className="flex flex-col gap-1 mb-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-2"
            style={{
              padding: '4px 10px',
              background: 'var(--color-background-secondary)',
              borderRadius: 4,
              fontSize: 11,
            }}
          >
            <input
              type="checkbox"
              checked={item.done}
              onChange={() =>
                onChange(
                  items.map((x) =>
                    x.id === item.id ? { ...x, done: !x.done } : x
                  )
                )
              }
            />
            <input
              value={item.text}
              onChange={(e) =>
                onChange(
                  items.map((x) =>
                    x.id === item.id ? { ...x, text: e.target.value } : x
                  )
                )
              }
              style={{
                flex: 1,
                fontSize: 11,
                height: 22,
                background: 'transparent',
                border: 'none',
                padding: 0,
                textDecoration: item.done ? 'line-through' : 'none',
                color: item.done ? 'var(--color-text-tertiary)' : undefined,
                minWidth: 0,
              }}
            />
            <button
              onClick={() => onChange(items.filter((x) => x.id !== item.id))}
              style={{
                fontSize: 11,
                padding: '0 4px',
                background: 'transparent',
                border: 'none',
                color: 'var(--color-text-tertiary)',
                cursor: 'pointer',
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <div className="flex gap-1">
        <input
          value={draft}
          onChange={(e) => set_draft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') add();
          }}
          placeholder="e.g. Print maps, prepare handouts..."
          style={{ flex: 1, fontSize: 11, height: 26, minWidth: 0 }}
        />
        <button
          onClick={add}
          style={{ fontSize: 11, padding: '0 10px', flexShrink: 0 }}
        >
          + Task
        </button>
      </div>
    </div>
  );
}

function SessionsModule({
  campaign,
  onUpdate,
}: {
  campaign: Campaign;
  onUpdate: (patch: Partial<Campaign>) => void;
}) {
  const sessions = campaign.sessions ?? [];
  const [show_form, set_show_form] = useState(false);
  const [editing_id, set_editing_id] = useState<string | null>(null);
  const [expanded_id, set_expanded_id] = useState<string | null>(null);

  const next_session_number =
    sessions.length === 0
      ? 1
      : Math.max(...sessions.map((s) => s.session_number)) + 1;

  const save = (entry: SessionEntry) => {
    const next = editing_id
      ? sessions.map((s) => (s.id === entry.id ? entry : s))
      : [...sessions, entry];
    onUpdate({ sessions: next });
    set_show_form(false);
    set_editing_id(null);
  };

  const remove = (id: string) => {
    if (!confirm('Delete this session?')) return;
    onUpdate({ sessions: sessions.filter((s) => s.id !== id) });
  };

  const editing = editing_id ? sessions.find((s) => s.id === editing_id) : null;
  const sorted = [...sessions].sort((a, b) => b.session_number - a.session_number);

  return (
    <Module
      title="Session Journal"
      right={
        <button
          onClick={() => {
            set_editing_id(null);
            set_show_form(true);
          }}
          style={{ fontSize: '11px', padding: '4px 10px' }}
        >
          + New session
        </button>
      }
    >
      {show_form && (
        <SessionForm
          initial={editing ?? undefined}
          default_number={next_session_number}
          party={campaign.characters.map((c) => c.name)}
          onSave={save}
          onCancel={() => {
            set_show_form(false);
            set_editing_id(null);
          }}
        />
      )}

      {sorted.length === 0 && !show_form ? (
        <EmptyState message="No sessions logged yet." />
      ) : (
        <div className="flex flex-col gap-2">
          {sorted.map((s) => {
            const expanded = expanded_id === s.id;
            return (
              <div
                key={s.id}
                style={{
                  padding: '10px 12px',
                  background: 'var(--color-background-secondary)',
                  borderRadius: 'var(--border-radius-md)',
                  border: '0.5px solid var(--color-border-tertiary)',
                }}
              >
                <div
                  className="flex justify-between items-start cursor-pointer"
                  onClick={() => set_expanded_id(expanded ? null : s.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-text-tertiary">
                        #{s.session_number}
                      </span>
                      <span className="text-[13px] font-medium">{s.title || 'Untitled session'}</span>
                    </div>
                    <div className="text-[11px] text-text-tertiary mt-1">
                      {s.real_date}
                      {s.in_game_date && ` · ${s.in_game_date}`}
                      {s.participants.length > 0 && ` · ${s.participants.join(', ')}`}
                    </div>
                  </div>
                  <span className="text-[11px] text-text-tertiary">
                    {expanded ? '▾' : '▸'}
                  </span>
                </div>
                {expanded && (
                  <>
                    <div
                      className="text-[12px] leading-relaxed mt-3 pt-3"
                      style={{
                        whiteSpace: 'pre-wrap',
                        borderTop: '0.5px solid var(--color-border-tertiary)',
                      }}
                    >
                      {s.summary || (
                        <span className="italic text-text-tertiary">No summary written.</span>
                      )}
                    </div>
                    <div className="flex gap-1 mt-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          set_editing_id(s.id);
                          set_show_form(true);
                        }}
                        style={{ fontSize: '10px', padding: '3px 8px' }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          remove(s.id);
                        }}
                        style={{
                          fontSize: '10px',
                          padding: '3px 8px',
                          color: 'var(--color-text-danger)',
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Module>
  );
}

function SessionForm({
  initial,
  default_number,
  party,
  onSave,
  onCancel,
}: {
  initial?: SessionEntry;
  default_number: number;
  party: string[];
  onSave: (entry: SessionEntry) => void;
  onCancel: () => void;
}) {
  const [number, set_number] = useState(String(initial?.session_number ?? default_number));
  const [real_date, set_real_date] = useState(
    initial?.real_date ?? new Date().toISOString().slice(0, 10)
  );
  const [in_game_date, set_in_game_date] = useState(initial?.in_game_date ?? '');
  const [title, set_title] = useState(initial?.title ?? '');
  const [summary, set_summary] = useState(initial?.summary ?? '');
  const [participants, set_participants] = useState<string[]>(
    initial?.participants ?? [...party]
  );

  const toggle_participant = (name: string) => {
    set_participants((p) =>
      p.includes(name) ? p.filter((x) => x !== name) : [...p, name]
    );
  };

  const handleSave = () => {
    onSave({
      id: initial?.id ?? crypto.randomUUID(),
      session_number: parseInt(number, 10) || default_number,
      real_date,
      in_game_date: in_game_date.trim() || undefined,
      title: title.trim(),
      summary: summary.trim(),
      participants,
      created_at: initial?.created_at ?? Date.now(),
    });
  };

  return (
    <div
      className="mb-3"
      style={{
        padding: '12px 14px',
        background: 'var(--color-background-primary)',
        border: '1px solid var(--color-border-info)',
        borderRadius: 'var(--border-radius-md)',
      }}
    >
      <div className="text-[13px] font-medium mb-3">
        {initial ? `Edit session #${initial.session_number}` : 'New session'}
      </div>
      <div
        className="grid gap-2 mb-2"
        style={{ gridTemplateColumns: '80px 1fr 1fr' }}
      >
        <FieldLabel label="Session #">
          <input
            type="number"
            value={number}
            onChange={(e) => set_number(e.target.value)}
            style={{ width: '100%' }}
          />
        </FieldLabel>
        <FieldLabel label="Real date">
          <input
            type="date"
            value={real_date}
            onChange={(e) => set_real_date(e.target.value)}
            style={{ width: '100%' }}
          />
        </FieldLabel>
        <FieldLabel label="In-game date (optional)">
          <input
            value={in_game_date}
            onChange={(e) => set_in_game_date(e.target.value)}
            placeholder="e.g. 14 Mirtul"
            style={{ width: '100%' }}
          />
        </FieldLabel>
      </div>
      <FieldLabel label="Title">
        <input
          value={title}
          onChange={(e) => set_title(e.target.value)}
          placeholder="e.g. Goblin ambush at Triboar Trail"
          style={{ width: '100%', marginBottom: 8 }}
        />
      </FieldLabel>
      {party.length > 0 && (
        <div className="mb-2">
          <div className="text-[11px] text-text-tertiary mb-1">Who attended</div>
          <div className="flex gap-1 flex-wrap">
            {party.map((name) => {
              const sel = participants.includes(name);
              return (
                <button
                  key={name}
                  onClick={() => toggle_participant(name)}
                  style={{
                    fontSize: 11,
                    padding: '3px 10px',
                    background: sel
                      ? 'var(--color-background-info)'
                      : 'var(--color-background-secondary)',
                    border: sel
                      ? '0.5px solid var(--color-border-info)'
                      : '0.5px solid var(--color-border-tertiary)',
                    color: sel ? 'var(--color-text-info)' : undefined,
                    fontWeight: sel ? 500 : 400,
                    borderRadius: 12,
                    cursor: 'pointer',
                  }}
                >
                  {sel ? '✓ ' : ''}
                  {name}
                </button>
              );
            })}
          </div>
        </div>
      )}
      <FieldLabel label="Summary (what happened)">
        <textarea
          value={summary}
          onChange={(e) => set_summary(e.target.value)}
          placeholder="Brief recap — encounters, plot beats, key moments..."
          style={{
            width: '100%',
            minHeight: 100,
            fontSize: '12px',
            resize: 'vertical',
            boxSizing: 'border-box',
          }}
        />
      </FieldLabel>
      <div className="flex gap-2 mt-3">
        <button
          onClick={handleSave}
          className="bg-accent-50 border-accent-300 text-accent-900 font-medium"
          style={{ padding: '6px 14px', fontSize: '12px' }}
        >
          {initial ? 'Save changes' : 'Save session'}
        </button>
        <button onClick={onCancel} style={{ padding: '6px 14px', fontSize: '12px' }}>
          Cancel
        </button>
      </div>
    </div>
  );
}



type RelationshipOption = {
  id: string;
  label: string;
};

function RelationshipPicker({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: RelationshipOption[];
  selected: string[];
  onChange: (ids: string[]) => void;
}) {
  const safe_selected = selected ?? [];
  const toggle = (id: string) => {
    onChange(
      safe_selected.includes(id)
        ? safe_selected.filter((x) => x !== id)
        : [...safe_selected, id]
    );
  };

  return (
    <FieldLabel label={label}>
      {options.length === 0 ? (
        <div className="text-[11px] text-text-tertiary mb-2">
          Nothing to link yet.
        </div>
      ) : (
        <div className="flex flex-wrap gap-1 mb-2">
          {options.map((option) => {
            const active = safe_selected.includes(option.id);
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => toggle(option.id)}
                style={{
                  fontSize: 11,
                  padding: '3px 8px',
                  borderRadius: 999,
                  background: active
                    ? 'var(--color-background-info)'
                    : 'var(--color-background-secondary)',
                  borderColor: active
                    ? 'var(--color-border-info)'
                    : 'var(--color-border-secondary)',
                  color: active
                    ? 'var(--color-text-info)'
                    : 'var(--color-text-secondary)',
                }}
              >
                {active ? '✓ ' : '+ '}
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </FieldLabel>
  );
}

function RelatedLinks({
  groups,
}: {
  groups: Array<{
    label: string;
    ids?: string[];
    items: Array<{ id: string; [key: string]: any }>;
    getLabel: (item: { id: string; [key: string]: any }) => string;
  }>;
}) {
  const visible = groups
    .map((group) => {
      const names = (group.ids ?? [])
        .map((id) => group.items.find((item) => item.id === id))
        .filter((item): item is { id: string; [key: string]: any } => Boolean(item))
        .map(group.getLabel);
      return { label: group.label, names };
    })
    .filter((group) => group.names.length > 0);

  if (visible.length === 0) return null;

  return (
    <div className="flex flex-col gap-1 mt-2">
      {visible.map((group) => (
        <div key={group.label} className="flex flex-wrap gap-1 items-center">
          <span className="text-[10px] text-text-tertiary">{group.label}:</span>
          {group.names.map((name) => (
            <span
              key={`${group.label}-${name}`}
              style={{
                fontSize: 10,
                padding: '1px 6px',
                borderRadius: 999,
                background: 'var(--color-background-primary)',
                border: '0.5px solid var(--color-border-secondary)',
                color: 'var(--color-text-secondary)',
              }}
            >
              {name}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}


// ============================================================
// Dashboard image helpers
// ============================================================

function DashboardImageGallery({ images }: { images?: string[] }) {
  const [lightbox_index, set_lightbox_index] = useState<number | null>(null);
  const safe_images = (images ?? []).filter(Boolean);

  if (safe_images.length === 0) return null;

  return (
    <>
      <div className="flex gap-1 mt-2 flex-wrap">
        {safe_images.slice(0, 6).map((src, idx) => (
          <button
            key={`${src.slice(0, 32)}-${idx}`}
            type="button"
            onClick={() => set_lightbox_index(idx)}
            title={`Open image ${idx + 1}`}
            style={{
              width: 54,
              height: 54,
              padding: 0,
              overflow: 'hidden',
              borderRadius: 6,
              border: '0.5px solid var(--color-border-secondary)',
              background: 'var(--color-background-primary)',
              cursor: 'pointer',
            }}
          >
            <img
              src={src}
              alt="Dashboard reference"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </button>
        ))}
        {safe_images.length > 6 && (
          <button
            type="button"
            onClick={() => set_lightbox_index(6)}
            style={{
              width: 54,
              height: 54,
              fontSize: 11,
              borderRadius: 6,
              color: 'var(--color-text-secondary)',
            }}
          >
            +{safe_images.length - 6}
          </button>
        )}
      </div>
      {lightbox_index !== null && (
        <Lightbox
          images={safe_images}
          index={lightbox_index}
          onClose={() => set_lightbox_index(null)}
          onNavigate={set_lightbox_index}
        />
      )}
    </>
  );
}

function DashboardGalleryInput({
  label = 'Images',
  images,
  onChange,
}: {
  label?: string;
  images: string[];
  onChange: (images: string[]) => void;
}) {
  const input_ref = useRef<HTMLInputElement>(null);
  const [is_uploading, set_is_uploading] = useState(false);
  const [lightbox_index, set_lightbox_index] = useState<number | null>(null);

  const handle_upload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const image_files = Array.from(files).filter((file) => file.type.startsWith('image/'));
    if (image_files.length === 0) {
      alert('Please choose image files.');
      return;
    }

    set_is_uploading(true);
    try {
      const processed = await Promise.all(image_files.map((file) => processGalleryImage(file)));
      onChange([...images, ...processed.map((img) => img.data_url)]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      alert(`Failed to load image: ${msg}`);
    } finally {
      set_is_uploading(false);
      if (input_ref.current) input_ref.current.value = '';
    }
  };

  const remove_image = (idx: number) => {
    onChange(images.filter((_, i) => i !== idx));
  };

  const move_image = (idx: number, direction: -1 | 1) => {
    const target = idx + direction;
    if (target < 0 || target >= images.length) return;
    const next = [...images];
    [next[idx], next[target]] = [next[target], next[idx]];
    onChange(next);
  };

  return (
    <FieldLabel label={label}>
      <div
        style={{
          padding: 8,
          border: '0.5px dashed var(--color-border-secondary)',
          borderRadius: 'var(--border-radius-md)',
          background: 'var(--color-background-primary)',
        }}
      >
        <input
          ref={input_ref}
          type="file"
          accept="image/*"
          multiple
          style={{ display: 'none' }}
          onChange={(e) => void handle_upload(e.target.files)}
        />
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => input_ref.current?.click()}
            disabled={is_uploading}
            style={{ fontSize: 11, padding: '4px 10px' }}
          >
            {is_uploading ? 'Uploading…' : '+ Add images'}
          </button>
          {images.length > 0 && (
            <span className="text-[11px] text-text-tertiary">
              {images.length} image{images.length === 1 ? '' : 's'} · {formatBytes(images.join('').length)}
            </span>
          )}
        </div>

        {images.length > 0 && (
          <div className="grid gap-2 mt-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(74px, 1fr))' }}>
            {images.map((src, idx) => (
              <div
                key={`${src.slice(0, 32)}-${idx}`}
                style={{
                  border: '0.5px solid var(--color-border-secondary)',
                  borderRadius: 6,
                  overflow: 'hidden',
                  background: 'var(--color-background-secondary)',
                }}
              >
                <button
                  type="button"
                  onClick={() => set_lightbox_index(idx)}
                  style={{ width: '100%', height: 74, padding: 0, border: 'none', display: 'block' }}
                  title={`Open image ${idx + 1}`}
                >
                  <img
                    src={src}
                    alt={`Reference ${idx + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </button>
                <div className="flex justify-between" style={{ padding: 3 }}>
                  <button type="button" onClick={() => move_image(idx, -1)} disabled={idx === 0} style={{ fontSize: 10, padding: '1px 4px' }}>↑</button>
                  <button type="button" onClick={() => move_image(idx, 1)} disabled={idx === images.length - 1} style={{ fontSize: 10, padding: '1px 4px' }}>↓</button>
                  <button type="button" onClick={() => remove_image(idx)} style={{ fontSize: 10, padding: '1px 4px', color: 'var(--color-text-tertiary)' }}>×</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {lightbox_index !== null && (
        <Lightbox
          images={images}
          index={lightbox_index}
          onClose={() => set_lightbox_index(null)}
          onNavigate={set_lightbox_index}
        />
      )}
    </FieldLabel>
  );
}


// ============================================================
// Factions
// ============================================================

function FactionsModule({
  campaign,
  onUpdate,
}: {
  campaign: Campaign;
  onUpdate: (patch: Partial<Campaign>) => void;
}) {
  const factions = campaign.factions ?? [];
  const [show_form, set_show_form] = useState(false);
  const [editing, set_editing] = useState<CampaignFaction | null>(null);
  const [filter, set_filter] = useState<'all' | CampaignFaction['status']>('all');

  const save = (faction: CampaignFaction) => {
    const next = editing
      ? factions.map((x) => (x.id === faction.id ? faction : x))
      : [...factions, faction];
    onUpdate({ factions: next });
    set_show_form(false);
    set_editing(null);
  };

  const remove = (id: string) => {
    if (!confirm('Delete this faction?')) return;
    onUpdate({ factions: factions.filter((f) => f.id !== id) });
  };

  const filtered = factions.filter((f) => filter === 'all' || f.status === filter);

  return (
    <Module
      title="Factions"
      right={
        <button
          onClick={() => {
            set_editing(null);
            set_show_form(true);
          }}
          style={{ fontSize: '11px', padding: '4px 10px' }}
        >
          + Add
        </button>
      }
    >
      {show_form && (
        <FactionForm
          campaign={campaign}
          initial={editing ?? undefined}
          onSave={save}
          onCancel={() => {
            set_show_form(false);
            set_editing(null);
          }}
        />
      )}
      {factions.length === 0 && !show_form ? (
        <EmptyState message="No factions tracked yet." />
      ) : (
        <>
          {factions.length > 3 && (
            <div className="flex gap-1 mb-2 flex-wrap">
              {(['all', 'active', 'hidden', 'allied', 'defeated'] as const).map((s) => (
                <FilterChip key={s} active={filter === s} onClick={() => set_filter(s)}>
                  {s === 'all' ? `All (${factions.length})` : s}
                </FilterChip>
              ))}
            </div>
          )}
          <div className="flex flex-col gap-1">
            {filtered.map((f) => (
              <div
                key={f.id}
                style={{
                  padding: '8px 10px',
                  background: 'var(--color-background-secondary)',
                  borderRadius: 'var(--border-radius-md)',
                  opacity: f.status === 'defeated' ? 0.55 : 1,
                }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <FactionStatusBadge status={f.status} />
                      <span className="text-[12px] font-medium">{f.name}</span>
                      {f.type && (
                        <span className="text-[10px] text-text-tertiary italic">
                          ({f.type})
                        </span>
                      )}
                    </div>
                    {f.description && (
                      <div className="text-[11px] text-text-secondary leading-relaxed">
                        {f.description}
                      </div>
                    )}
                    {f.goals && (
                      <div className="text-[11px] text-text-tertiary mt-1">
                        Goals: {f.goals}
                      </div>
                    )}
                    <RelatedLinks
                      groups={[
                        { label: 'Locations', ids: f.location_ids, items: campaign.locations ?? [], getLabel: (l) => l.name },
                        { label: 'Quests', ids: f.quest_ids, items: campaign.quests ?? [], getLabel: (q) => q.title },
                        { label: 'Plot threads', ids: f.plot_thread_ids, items: campaign.plot_threads ?? [], getLabel: (t) => t.title },
                        { label: 'NPCs', ids: f.npc_ids, items: campaign.npcs ?? [], getLabel: (n) => n.name },
                      ]}
                    />
                    <DashboardImageGallery images={f.gallery} />
                    {f.notes && (
                      <div className="text-[11px] text-text-tertiary mt-1 italic" style={{ whiteSpace: 'pre-wrap' }}>
                        {f.notes}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        set_editing(f);
                        set_show_form(true);
                      }}
                      style={{ fontSize: 11, padding: '2px 6px' }}
                    >
                      ✎
                    </button>
                    <button
                      onClick={() => remove(f.id)}
                      style={{ fontSize: 11, padding: '2px 6px', color: 'var(--color-text-tertiary)' }}
                    >
                      ×
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </Module>
  );
}

function FactionStatusBadge({ status }: { status: CampaignFaction['status'] }) {
  const config = {
    active: { label: 'Active', bg: '#DCFCE7', color: '#166534' },
    hidden: { label: 'Hidden', bg: '#E5E7EB', color: '#374151' },
    allied: { label: 'Allied', bg: '#DBEAFE', color: '#1E40AF' },
    defeated: { label: 'Defeated', bg: '#FEE2E2', color: '#991B1B' },
  }[status];
  return (
    <span
      style={{
        fontSize: 9,
        padding: '1px 6px',
        borderRadius: 3,
        background: config.bg,
        color: config.color,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        fontWeight: 500,
      }}
    >
      {config.label}
    </span>
  );
}

function FactionForm({
  campaign,
  initial,
  onSave,
  onCancel,
}: {
  campaign: Campaign;
  initial?: CampaignFaction;
  onSave: (f: CampaignFaction) => void;
  onCancel: () => void;
}) {
  const [name, set_name] = useState(initial?.name ?? '');
  const [type, set_type] = useState(initial?.type ?? '');
  const [description, set_description] = useState(initial?.description ?? '');
  const [goals, set_goals] = useState(initial?.goals ?? '');
  const [notes, set_notes] = useState(initial?.notes ?? '');
  const [gallery, set_gallery] = useState<string[]>(initial?.gallery ?? []);
  const [location_ids, set_location_ids] = useState<string[]>(initial?.location_ids ?? []);
  const [quest_ids, set_quest_ids] = useState<string[]>(initial?.quest_ids ?? []);
  const [plot_thread_ids, set_plot_thread_ids] = useState<string[]>(initial?.plot_thread_ids ?? []);
  const [npc_ids, set_npc_ids] = useState<string[]>(initial?.npc_ids ?? []);
  const [status, set_status] = useState<CampaignFaction['status']>(initial?.status ?? 'active');

  return (
    <div className="mb-3" style={inlineFormStyle}>
      <div className="grid gap-2 mb-2" style={{ gridTemplateColumns: '2fr 1fr' }}>
        <FieldLabel label="Faction name">
          <input
            value={name}
            onChange={(e) => set_name(e.target.value)}
            placeholder="e.g. The Harpers"
            style={{ width: '100%' }}
            autoFocus
          />
        </FieldLabel>
        <FieldLabel label="Type">
          <input
            value={type}
            onChange={(e) => set_type(e.target.value)}
            placeholder="guild / cult / kingdom..."
            style={{ width: '100%' }}
          />
        </FieldLabel>
      </div>
      <FieldLabel label="Description">
        <textarea
          value={description}
          onChange={(e) => set_description(e.target.value)}
          placeholder="Who they are, what they control, how the party knows them..."
          style={{ width: '100%', minHeight: 55, fontSize: '12px', resize: 'vertical', boxSizing: 'border-box' }}
        />
      </FieldLabel>
      <FieldLabel label="Goals">
        <input
          value={goals}
          onChange={(e) => set_goals(e.target.value)}
          placeholder="What does this faction want?"
          style={{ width: '100%', marginBottom: 8 }}
        />
      </FieldLabel>
      <DashboardGalleryInput label="Faction symbols / images" images={gallery} onChange={set_gallery} />
      <RelationshipPicker
        label="Linked locations"
        options={(campaign.locations ?? []).map((l) => ({ id: l.id, label: l.name }))}
        selected={location_ids}
        onChange={set_location_ids}
      />
      <RelationshipPicker
        label="Linked quests"
        options={(campaign.quests ?? []).map((q) => ({ id: q.id, label: q.title }))}
        selected={quest_ids}
        onChange={set_quest_ids}
      />
      <RelationshipPicker
        label="Linked plot threads"
        options={(campaign.plot_threads ?? []).map((t) => ({ id: t.id, label: t.title }))}
        selected={plot_thread_ids}
        onChange={set_plot_thread_ids}
      />
      <RelationshipPicker
        label="Linked NPCs"
        options={(campaign.npcs ?? []).map((n) => ({ id: n.id, label: n.name }))}
        selected={npc_ids}
        onChange={set_npc_ids}
      />
      <FieldLabel label="DM notes">
        <textarea
          value={notes}
          onChange={(e) => set_notes(e.target.value)}
          placeholder="Secrets, leaders, rivals, resources..."
          style={{ width: '100%', minHeight: 45, fontSize: '12px', resize: 'vertical', boxSizing: 'border-box' }}
        />
      </FieldLabel>
      <div className="flex gap-2 items-center mt-2 flex-wrap">
        <span className="text-[11px] text-text-tertiary">Status:</span>
        {(['active', 'hidden', 'allied', 'defeated'] as const).map((s) => (
          <button
            key={s}
            onClick={() => set_status(s)}
            style={{
              fontSize: 11,
              padding: '3px 10px',
              background: status === s ? 'var(--color-background-info)' : 'transparent',
              borderColor: status === s ? 'var(--color-border-info)' : undefined,
              color: status === s ? 'var(--color-text-info)' : undefined,
              fontWeight: status === s ? 500 : 400,
            }}
          >
            {s}
          </button>
        ))}
      </div>
      <div className="flex gap-2 mt-3">
        <button
          onClick={() => {
            if (!name.trim()) return;
            onSave({
              id: initial?.id ?? crypto.randomUUID(),
              name: name.trim(),
              type: type.trim(),
              description: description.trim(),
              goals: goals.trim(),
              notes: notes.trim(),
              status,
              gallery,
              location_ids,
              quest_ids,
              plot_thread_ids,
              npc_ids,
              created_at: initial?.created_at ?? Date.now(),
            });
          }}
          className="bg-accent-50 border-accent-300 text-accent-900 font-medium"
          style={{ padding: '5px 12px', fontSize: '12px' }}
        >
          Save
        </button>
        <button onClick={onCancel} style={{ padding: '5px 12px', fontSize: '12px' }}>
          Cancel
        </button>
      </div>
    </div>
  );
}


// ============================================================
// Plot Threads
// ============================================================

function PlotThreadsModule({
  campaign,
  onUpdate,
}: {
  campaign: Campaign;
  onUpdate: (patch: Partial<Campaign>) => void;
}) {
  const threads = campaign.plot_threads ?? [];
  const [show_form, set_show_form] = useState(false);
  const [editing, set_editing] = useState<PlotThread | null>(null);

  const save = (t: PlotThread) => {
    const next = editing
      ? threads.map((x) => (x.id === t.id ? t : x))
      : [...threads, t];
    onUpdate({ plot_threads: next });
    set_show_form(false);
    set_editing(null);
  };

  const remove = (id: string) => {
    if (!confirm('Delete this plot thread?')) return;
    onUpdate({ plot_threads: threads.filter((t) => t.id !== id) });
  };

  const update_status = (t: PlotThread, status: PlotThread['status']) => {
    onUpdate({
      plot_threads: threads.map((x) => (x.id === t.id ? { ...x, status } : x)),
    });
  };

  return (
    <Module
      title="Plot Threads"
      right={
        <button
          onClick={() => {
            set_editing(null);
            set_show_form(true);
          }}
          style={{ fontSize: '11px', padding: '4px 10px' }}
        >
          + Add
        </button>
      }
    >
      {show_form && (
        <PlotThreadForm
          campaign={campaign}
          initial={editing ?? undefined}
          onSave={save}
          onCancel={() => {
            set_show_form(false);
            set_editing(null);
          }}
        />
      )}
      {threads.length === 0 && !show_form ? (
        <EmptyState message="No plot threads yet." />
      ) : (
        <div className="flex flex-col gap-1">
          {threads.map((t) => (
            <div
              key={t.id}
              style={{
                padding: '8px 10px',
                background: 'var(--color-background-secondary)',
                borderRadius: 'var(--border-radius-md)',
                opacity: t.status === 'resolved' ? 0.55 : 1,
              }}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <PlotStatusBadge status={t.status} />
                    <span className="text-[12px] font-medium">{t.title}</span>
                  </div>
                  {t.description && (
                    <div className="text-[11px] text-text-secondary leading-relaxed">
                      {t.description}
                    </div>
                  )}
                  <RelatedLinks
                    groups={[
                      { label: 'NPCs', ids: t.npc_ids, items: campaign.npcs ?? [], getLabel: (n) => n.name },
                      { label: 'Locations', ids: t.location_ids, items: campaign.locations ?? [], getLabel: (l) => l.name },
                      { label: 'Factions', ids: t.faction_ids, items: campaign.factions ?? [], getLabel: (f) => f.name },
                    ]}
                  />
                  <DashboardImageGallery images={t.gallery} />
                </div>
                <div className="flex gap-1">
                  {t.status !== 'resolved' && (
                    <button
                      onClick={() => update_status(t, 'resolved')}
                      title="Mark resolved"
                      style={{ fontSize: 11, padding: '2px 6px' }}
                    >
                      ✓
                    </button>
                  )}
                  <button
                    onClick={() => {
                      set_editing(t);
                      set_show_form(true);
                    }}
                    style={{ fontSize: 11, padding: '2px 6px' }}
                  >
                    ✎
                  </button>
                  <button
                    onClick={() => remove(t.id)}
                    style={{
                      fontSize: 11,
                      padding: '2px 6px',
                      color: 'var(--color-text-tertiary)',
                    }}
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Module>
  );
}

function PlotStatusBadge({ status }: { status: PlotThread['status'] }) {
  const config = {
    active: { label: 'Active', bg: '#DCFCE7', color: '#166534' },
    paused: { label: 'Paused', bg: '#E5E7EB', color: '#374151' },
    resolved: { label: 'Resolved', bg: '#DBEAFE', color: '#1E40AF' },
  }[status];
  return (
    <span
      style={{
        fontSize: 9,
        padding: '1px 6px',
        borderRadius: 3,
        background: config.bg,
        color: config.color,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        fontWeight: 500,
      }}
    >
      {config.label}
    </span>
  );
}

function PlotThreadForm({
  campaign,
  initial,
  onSave,
  onCancel,
}: {
  campaign: Campaign;
  initial?: PlotThread;
  onSave: (t: PlotThread) => void;
  onCancel: () => void;
}) {
  const [title, set_title] = useState(initial?.title ?? '');
  const [description, set_description] = useState(initial?.description ?? '');
  const [gallery, set_gallery] = useState<string[]>(initial?.gallery ?? []);
  const [npc_ids, set_npc_ids] = useState<string[]>(initial?.npc_ids ?? []);
  const [location_ids, set_location_ids] = useState<string[]>(initial?.location_ids ?? []);
  const [faction_ids, set_faction_ids] = useState<string[]>(initial?.faction_ids ?? []);
  const [status, set_status] = useState<PlotThread['status']>(
    initial?.status ?? 'active'
  );

  return (
    <div className="mb-3" style={inlineFormStyle}>
      <FieldLabel label="Title">
        <input
          value={title}
          onChange={(e) => set_title(e.target.value)}
          placeholder="e.g. Find the lost mine of Phandelver"
          style={{ width: '100%', marginBottom: 8 }}
          autoFocus
        />
      </FieldLabel>
      <FieldLabel label="Description">
        <textarea
          value={description}
          onChange={(e) => set_description(e.target.value)}
          placeholder="What's the situation, who's involved, what's the goal..."
          style={{
            width: '100%',
            minHeight: 60,
            fontSize: '12px',
            resize: 'vertical',
            boxSizing: 'border-box',
          }}
        />
      </FieldLabel>
      <DashboardGalleryInput label="Plot images / references" images={gallery} onChange={set_gallery} />
      <RelationshipPicker
        label="Linked NPCs"
        options={(campaign.npcs ?? []).map((n) => ({ id: n.id, label: n.name }))}
        selected={npc_ids}
        onChange={set_npc_ids}
      />
      <RelationshipPicker
        label="Linked locations"
        options={(campaign.locations ?? []).map((l) => ({ id: l.id, label: l.name }))}
        selected={location_ids}
        onChange={set_location_ids}
      />
      <RelationshipPicker
        label="Linked factions"
        options={(campaign.factions ?? []).map((f) => ({ id: f.id, label: f.name }))}
        selected={faction_ids}
        onChange={set_faction_ids}
      />
      <div className="flex gap-2 items-center mt-2">
        <span className="text-[11px] text-text-tertiary">Status:</span>
        {(['active', 'paused', 'resolved'] as const).map((s) => (
          <button
            key={s}
            onClick={() => set_status(s)}
            style={{
              fontSize: 11,
              padding: '3px 10px',
              background:
                status === s ? 'var(--color-background-info)' : 'transparent',
              borderColor:
                status === s ? 'var(--color-border-info)' : undefined,
              color: status === s ? 'var(--color-text-info)' : undefined,
              fontWeight: status === s ? 500 : 400,
            }}
          >
            {s}
          </button>
        ))}
      </div>
      <div className="flex gap-2 mt-3">
        <button
          onClick={() => {
            if (!title.trim()) return;
            onSave({
              id: initial?.id ?? crypto.randomUUID(),
              title: title.trim(),
              description: description.trim(),
              gallery,
              npc_ids,
              location_ids,
              faction_ids,
              status,
              created_at: initial?.created_at ?? Date.now(),
            });
          }}
          className="bg-accent-50 border-accent-300 text-accent-900 font-medium"
          style={{ padding: '5px 12px', fontSize: '12px' }}
        >
          Save
        </button>
        <button onClick={onCancel} style={{ padding: '5px 12px', fontSize: '12px' }}>
          Cancel
        </button>
      </div>
    </div>
  );
}

// ============================================================
// Quests
// ============================================================

function QuestsModule({
  campaign,
  onUpdate,
}: {
  campaign: Campaign;
  onUpdate: (patch: Partial<Campaign>) => void;
}) {
  const quests = campaign.quests ?? [];
  const [show_form, set_show_form] = useState(false);
  const [editing, set_editing] = useState<Quest | null>(null);

  const save = (q: Quest) => {
    const next = editing
      ? quests.map((x) => (x.id === q.id ? q : x))
      : [...quests, q];
    onUpdate({ quests: next });
    set_show_form(false);
    set_editing(null);
  };

  const remove = (id: string) => {
    if (!confirm('Delete this quest?')) return;
    onUpdate({ quests: quests.filter((q) => q.id !== id) });
  };

  const update_status = (q: Quest, status: Quest['status']) => {
    onUpdate({
      quests: quests.map((x) => (x.id === q.id ? { ...x, status } : x)),
    });
  };

  const active = quests.filter((q) => q.status === 'active');
  const completed = quests.filter((q) => q.status === 'completed');
  const failed = quests.filter((q) => q.status === 'failed');

  return (
    <Module
      title="Quests"
      right={
        <button
          onClick={() => {
            set_editing(null);
            set_show_form(true);
          }}
          style={{ fontSize: '11px', padding: '4px 10px' }}
        >
          + Add
        </button>
      }
    >
      {show_form && (
        <QuestForm
          campaign={campaign}
          initial={editing ?? undefined}
          onSave={save}
          onCancel={() => {
            set_show_form(false);
            set_editing(null);
          }}
        />
      )}
      {quests.length === 0 && !show_form ? (
        <EmptyState message="No quests yet." />
      ) : (
        <div className="flex flex-col gap-1">
          {[...active, ...completed, ...failed].map((q) => (
            <div
              key={q.id}
              style={{
                padding: '8px 10px',
                background: 'var(--color-background-secondary)',
                borderRadius: 'var(--border-radius-md)',
                opacity: q.status === 'active' ? 1 : 0.55,
              }}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <QuestStatusBadge status={q.status} />
                    <span className="text-[12px] font-medium">{q.title}</span>
                  </div>
                  {q.giver && (
                    <div className="text-[11px] text-text-tertiary">
                      from {q.giver}
                    </div>
                  )}
                  {q.description && (
                    <div className="text-[11px] text-text-secondary leading-relaxed mt-1">
                      {q.description}
                    </div>
                  )}
                  <RelatedLinks
                    groups={[
                      { label: 'Locations', ids: q.location_ids, items: campaign.locations ?? [], getLabel: (l) => l.name },
                      { label: 'Factions', ids: q.faction_ids, items: campaign.factions ?? [], getLabel: (f) => f.name },
                      { label: 'Plot threads', ids: q.plot_thread_ids, items: campaign.plot_threads ?? [], getLabel: (t) => t.title },
                      { label: 'NPCs', ids: q.npc_ids, items: campaign.npcs ?? [], getLabel: (n) => n.name },
                    ]}
                  />
                  <DashboardImageGallery images={q.gallery} />
                  {q.reward && q.status === 'active' && (
                    <div className="text-[11px] text-text-tertiary mt-1">
                      Reward: {q.reward}
                    </div>
                  )}
                </div>
                <div className="flex gap-1">
                  {q.status === 'active' && (
                    <>
                      <button
                        onClick={() => update_status(q, 'completed')}
                        title="Mark completed"
                        style={{ fontSize: 11, padding: '2px 6px', color: '#166534' }}
                      >
                        ✓
                      </button>
                      <button
                        onClick={() => update_status(q, 'failed')}
                        title="Mark failed"
                        style={{ fontSize: 11, padding: '2px 6px', color: '#7F1D1D' }}
                      >
                        ✗
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => {
                      set_editing(q);
                      set_show_form(true);
                    }}
                    style={{ fontSize: 11, padding: '2px 6px' }}
                  >
                    ✎
                  </button>
                  <button
                    onClick={() => remove(q.id)}
                    style={{
                      fontSize: 11,
                      padding: '2px 6px',
                      color: 'var(--color-text-tertiary)',
                    }}
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Module>
  );
}

function QuestStatusBadge({ status }: { status: Quest['status'] }) {
  const config = {
    active: { label: 'Active', bg: '#FEF3C7', color: '#92400E' },
    completed: { label: '✓ Done', bg: '#DCFCE7', color: '#166534' },
    failed: { label: '✗ Failed', bg: '#FECACA', color: '#7F1D1D' },
  }[status];
  return (
    <span
      style={{
        fontSize: 9,
        padding: '1px 6px',
        borderRadius: 3,
        background: config.bg,
        color: config.color,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        fontWeight: 500,
      }}
    >
      {config.label}
    </span>
  );
}

function QuestForm({
  campaign,
  initial,
  onSave,
  onCancel,
}: {
  campaign: Campaign;
  initial?: Quest;
  onSave: (q: Quest) => void;
  onCancel: () => void;
}) {
  const [title, set_title] = useState(initial?.title ?? '');
  const [giver, set_giver] = useState(initial?.giver ?? '');
  const [description, set_description] = useState(initial?.description ?? '');
  const [gallery, set_gallery] = useState<string[]>(initial?.gallery ?? []);
  const [location_ids, set_location_ids] = useState<string[]>(initial?.location_ids ?? []);
  const [faction_ids, set_faction_ids] = useState<string[]>(initial?.faction_ids ?? []);
  const [plot_thread_ids, set_plot_thread_ids] = useState<string[]>(initial?.plot_thread_ids ?? []);
  const [npc_ids, set_npc_ids] = useState<string[]>(initial?.npc_ids ?? []);
  const [reward, set_reward] = useState(initial?.reward ?? '');
  const [status, set_status] = useState<Quest['status']>(initial?.status ?? 'active');

  return (
    <div className="mb-3" style={inlineFormStyle}>
      <div className="grid gap-2 mb-2" style={{ gridTemplateColumns: '2fr 1fr' }}>
        <FieldLabel label="Quest title">
          <input
            value={title}
            onChange={(e) => set_title(e.target.value)}
            placeholder="e.g. Clear the goblin lair"
            style={{ width: '100%' }}
            autoFocus
          />
        </FieldLabel>
        <FieldLabel label="Giver">
          <input
            value={giver}
            onChange={(e) => set_giver(e.target.value)}
            placeholder="who?"
            style={{ width: '100%' }}
          />
        </FieldLabel>
      </div>
      <FieldLabel label="Description">
        <textarea
          value={description}
          onChange={(e) => set_description(e.target.value)}
          placeholder="Details, where, conditions for success..."
          style={{
            width: '100%',
            minHeight: 50,
            fontSize: '12px',
            resize: 'vertical',
            boxSizing: 'border-box',
          }}
        />
      </FieldLabel>
      <DashboardGalleryInput label="Quest images / references" images={gallery} onChange={set_gallery} />
      <RelationshipPicker
        label="Linked locations"
        options={(campaign.locations ?? []).map((l) => ({ id: l.id, label: l.name }))}
        selected={location_ids}
        onChange={set_location_ids}
      />
      <RelationshipPicker
        label="Linked factions"
        options={(campaign.factions ?? []).map((f) => ({ id: f.id, label: f.name }))}
        selected={faction_ids}
        onChange={set_faction_ids}
      />
      <RelationshipPicker
        label="Linked plot threads"
        options={(campaign.plot_threads ?? []).map((t) => ({ id: t.id, label: t.title }))}
        selected={plot_thread_ids}
        onChange={set_plot_thread_ids}
      />
      <RelationshipPicker
        label="Linked NPCs"
        options={(campaign.npcs ?? []).map((n) => ({ id: n.id, label: n.name }))}
        selected={npc_ids}
        onChange={set_npc_ids}
      />
      <FieldLabel label="Reward">
        <input
          value={reward}
          onChange={(e) => set_reward(e.target.value)}
          placeholder="e.g. 100 gp + Cloak of Elvenkind"
          style={{ width: '100%', marginBottom: 8 }}
        />
      </FieldLabel>
      <div className="flex gap-2 items-center mt-2">
        <span className="text-[11px] text-text-tertiary">Status:</span>
        {(['active', 'completed', 'failed'] as const).map((s) => (
          <button
            key={s}
            onClick={() => set_status(s)}
            style={{
              fontSize: 11,
              padding: '3px 10px',
              background:
                status === s ? 'var(--color-background-info)' : 'transparent',
              borderColor:
                status === s ? 'var(--color-border-info)' : undefined,
              color: status === s ? 'var(--color-text-info)' : undefined,
              fontWeight: status === s ? 500 : 400,
            }}
          >
            {s}
          </button>
        ))}
      </div>
      <div className="flex gap-2 mt-3">
        <button
          onClick={() => {
            if (!title.trim()) return;
            onSave({
              id: initial?.id ?? crypto.randomUUID(),
              title: title.trim(),
              giver: giver.trim(),
              description: description.trim(),
              gallery,
              status,
              reward: reward.trim(),
              location_ids,
              faction_ids,
              plot_thread_ids,
              npc_ids,
              created_at: initial?.created_at ?? Date.now(),
            });
          }}
          className="bg-accent-50 border-accent-300 text-accent-900 font-medium"
          style={{ padding: '5px 12px', fontSize: '12px' }}
        >
          Save
        </button>
        <button onClick={onCancel} style={{ padding: '5px 12px', fontSize: '12px' }}>
          Cancel
        </button>
      </div>
    </div>
  );
}

// ============================================================
// NPCs
// ============================================================

function NPCsModule({
  campaign,
  onUpdate,
}: {
  campaign: Campaign;
  onUpdate: (patch: Partial<Campaign>) => void;
}) {
  const npcs = campaign.npcs ?? [];
  const [show_form, set_show_form] = useState(false);
  const [editing, set_editing] = useState<CampaignNPC | null>(null);
  const [filter, set_filter] = useState<'all' | CampaignNPC['status']>('all');

  const save = (n: CampaignNPC) => {
    const next = editing ? npcs.map((x) => (x.id === n.id ? n : x)) : [...npcs, n];
    onUpdate({ npcs: next });
    set_show_form(false);
    set_editing(null);
  };

  const remove = (id: string) => {
    if (!confirm('Delete this NPC?')) return;
    onUpdate({ npcs: npcs.filter((n) => n.id !== id) });
  };

  const filtered = npcs.filter((n) => filter === 'all' || n.status === filter);

  return (
    <Module
      title="NPCs"
      right={
        <button
          onClick={() => {
            set_editing(null);
            set_show_form(true);
          }}
          style={{ fontSize: '11px', padding: '4px 10px' }}
        >
          + Add
        </button>
      }
    >
      {show_form && (
        <NPCForm
          campaign={campaign}
          initial={editing ?? undefined}
          onSave={save}
          onCancel={() => {
            set_show_form(false);
            set_editing(null);
          }}
        />
      )}
      {npcs.length === 0 && !show_form ? (
        <EmptyState message="No NPCs tracked yet." />
      ) : (
        <>
          {npcs.length > 3 && (
            <div className="flex gap-1 mb-2">
              <FilterChip active={filter === 'all'} onClick={() => set_filter('all')}>
                All ({npcs.length})
              </FilterChip>
              <FilterChip
                active={filter === 'alive'}
                onClick={() => set_filter('alive')}
              >
                Alive
              </FilterChip>
              <FilterChip
                active={filter === 'dead'}
                onClick={() => set_filter('dead')}
              >
                Dead
              </FilterChip>
              <FilterChip
                active={filter === 'unknown'}
                onClick={() => set_filter('unknown')}
              >
                ?
              </FilterChip>
            </div>
          )}
          <div className="flex flex-col gap-1">
            {filtered.map((n) => (
              <div
                key={n.id}
                style={{
                  padding: '8px 10px',
                  background: 'var(--color-background-secondary)',
                  borderRadius: 'var(--border-radius-md)',
                  opacity: n.status === 'dead' ? 0.55 : 1,
                }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[12px] font-medium">
                        {n.name}
                        {n.status === 'dead' && (
                          <span className="text-text-tertiary ml-1">†</span>
                        )}
                      </span>
                      {n.role && (
                        <span className="text-[10px] text-text-tertiary italic">
                          ({n.role})
                        </span>
                      )}
                    </div>
                    {n.location && (
                      <div className="text-[11px] text-text-tertiary">
                        📍 {n.location}
                      </div>
                    )}
                    {n.description && (
                      <div className="text-[11px] text-text-secondary mt-1 leading-relaxed">
                        {n.description}
                      </div>
                    )}
                    <RelatedLinks
                      groups={[
                        { label: 'Locations', ids: n.location_ids, items: campaign.locations ?? [], getLabel: (l) => l.name },
                        { label: 'Quests', ids: n.quest_ids, items: campaign.quests ?? [], getLabel: (q) => q.title },
                        { label: 'Plot threads', ids: n.plot_thread_ids, items: campaign.plot_threads ?? [], getLabel: (t) => t.title },
                        { label: 'Factions', ids: n.faction_ids, items: campaign.factions ?? [], getLabel: (f) => f.name },
                      ]}
                    />
                    <DashboardImageGallery images={n.gallery ?? (n.avatar ? [n.avatar] : [])} />
                    {n.notes && (
                      <div
                        className="text-[11px] text-text-tertiary mt-1 italic"
                        style={{ whiteSpace: 'pre-wrap' }}
                      >
                        {n.notes}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        set_editing(n);
                        set_show_form(true);
                      }}
                      style={{ fontSize: 11, padding: '2px 6px' }}
                    >
                      ✎
                    </button>
                    <button
                      onClick={() => remove(n.id)}
                      style={{
                        fontSize: 11,
                        padding: '2px 6px',
                        color: 'var(--color-text-tertiary)',
                      }}
                    >
                      ×
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </Module>
  );
}

function NPCForm({
  campaign,
  initial,
  onSave,
  onCancel,
}: {
  campaign: Campaign;
  initial?: CampaignNPC;
  onSave: (n: CampaignNPC) => void;
  onCancel: () => void;
}) {
  const [name, set_name] = useState(initial?.name ?? '');
  const [role, set_role] = useState(initial?.role ?? '');
  const [location, set_location] = useState(initial?.location ?? '');
  const [description, set_description] = useState(initial?.description ?? '');
  const [notes, set_notes] = useState(initial?.notes ?? '');
  const [gallery, set_gallery] = useState<string[]>(initial?.gallery ?? (initial?.avatar ? [initial.avatar] : []));
  const [location_ids, set_location_ids] = useState<string[]>(initial?.location_ids ?? []);
  const [quest_ids, set_quest_ids] = useState<string[]>(initial?.quest_ids ?? []);
  const [plot_thread_ids, set_plot_thread_ids] = useState<string[]>(initial?.plot_thread_ids ?? []);
  const [faction_ids, set_faction_ids] = useState<string[]>(initial?.faction_ids ?? []);
  const [status, set_status] = useState<CampaignNPC['status']>(
    initial?.status ?? 'alive'
  );

  return (
    <div className="mb-3" style={inlineFormStyle}>
      <div className="grid gap-2 mb-2" style={{ gridTemplateColumns: '2fr 1fr' }}>
        <FieldLabel label="Name">
          <input
            value={name}
            onChange={(e) => set_name(e.target.value)}
            placeholder="e.g. Sildar Hallwinter"
            style={{ width: '100%' }}
            autoFocus
          />
        </FieldLabel>
        <FieldLabel label="Role">
          <input
            value={role}
            onChange={(e) => set_role(e.target.value)}
            placeholder="ally / villain / merchant..."
            style={{ width: '100%' }}
          />
        </FieldLabel>
      </div>
      <FieldLabel label="Location (where they're usually found)">
        <input
          value={location}
          onChange={(e) => set_location(e.target.value)}
          placeholder="e.g. Phandalin"
          style={{ width: '100%', marginBottom: 8 }}
        />
      </FieldLabel>
      <DashboardGalleryInput label="NPC portrait / images" images={gallery} onChange={set_gallery} />
      <RelationshipPicker
        label="Linked locations"
        options={(campaign.locations ?? []).map((l) => ({ id: l.id, label: l.name }))}
        selected={location_ids}
        onChange={set_location_ids}
      />
      <RelationshipPicker
        label="Linked quests"
        options={(campaign.quests ?? []).map((q) => ({ id: q.id, label: q.title }))}
        selected={quest_ids}
        onChange={set_quest_ids}
      />
      <RelationshipPicker
        label="Linked plot threads"
        options={(campaign.plot_threads ?? []).map((t) => ({ id: t.id, label: t.title }))}
        selected={plot_thread_ids}
        onChange={set_plot_thread_ids}
      />
      <RelationshipPicker
        label="Linked factions"
        options={(campaign.factions ?? []).map((f) => ({ id: f.id, label: f.name }))}
        selected={faction_ids}
        onChange={set_faction_ids}
      />
      <FieldLabel label="Description (appearance, personality)">
        <textarea
          value={description}
          onChange={(e) => set_description(e.target.value)}
          placeholder="Tall, grey-bearded human in plate armor..."
          style={{
            width: '100%',
            minHeight: 50,
            fontSize: '12px',
            resize: 'vertical',
            boxSizing: 'border-box',
          }}
        />
      </FieldLabel>
      <FieldLabel label="DM notes (secrets, motivations)">
        <textarea
          value={notes}
          onChange={(e) => set_notes(e.target.value)}
          placeholder="Hidden agenda, plot relevance, dialogue cues..."
          style={{
            width: '100%',
            minHeight: 40,
            fontSize: '12px',
            resize: 'vertical',
            boxSizing: 'border-box',
          }}
        />
      </FieldLabel>
      <div className="flex gap-2 items-center mt-2">
        <span className="text-[11px] text-text-tertiary">Status:</span>
        {(['alive', 'dead', 'unknown'] as const).map((s) => (
          <button
            key={s}
            onClick={() => set_status(s)}
            style={{
              fontSize: 11,
              padding: '3px 10px',
              background:
                status === s ? 'var(--color-background-info)' : 'transparent',
              borderColor:
                status === s ? 'var(--color-border-info)' : undefined,
              color: status === s ? 'var(--color-text-info)' : undefined,
              fontWeight: status === s ? 500 : 400,
            }}
          >
            {s}
          </button>
        ))}
      </div>
      <div className="flex gap-2 mt-3">
        <button
          onClick={() => {
            if (!name.trim()) return;
            onSave({
              id: initial?.id ?? crypto.randomUUID(),
              name: name.trim(),
              role: role.trim(),
              location: location.trim(),
              location_ids,
              quest_ids,
              plot_thread_ids,
              faction_ids,
              description: description.trim(),
              notes: notes.trim(),
              status,
              avatar: gallery[0],
              gallery,
              created_at: initial?.created_at ?? Date.now(),
            });
          }}
          className="bg-accent-50 border-accent-300 text-accent-900 font-medium"
          style={{ padding: '5px 12px', fontSize: '12px' }}
        >
          Save
        </button>
        <button onClick={onCancel} style={{ padding: '5px 12px', fontSize: '12px' }}>
          Cancel
        </button>
      </div>
    </div>
  );
}

// ============================================================
// Locations
// ============================================================

function LocationsModule({
  campaign,
  onUpdate,
}: {
  campaign: Campaign;
  onUpdate: (patch: Partial<Campaign>) => void;
}) {
  const locations = campaign.locations ?? [];
  const [show_form, set_show_form] = useState(false);
  const [editing, set_editing] = useState<CampaignLocation | null>(null);

  const save = (loc: CampaignLocation) => {
    const next = editing
      ? locations.map((x) => (x.id === loc.id ? loc : x))
      : [...locations, loc];
    onUpdate({ locations: next });
    set_show_form(false);
    set_editing(null);
  };

  const remove = (id: string) => {
    if (!confirm('Delete this location?')) return;
    onUpdate({ locations: locations.filter((l) => l.id !== id) });
  };

  const toggle_visited = (loc: CampaignLocation) => {
    onUpdate({
      locations: locations.map((l) =>
        l.id === loc.id ? { ...l, visited: !l.visited } : l
      ),
    });
  };

  return (
    <Module
      title="Locations"
      right={
        <button
          onClick={() => {
            set_editing(null);
            set_show_form(true);
          }}
          style={{ fontSize: '11px', padding: '4px 10px' }}
        >
          + Add
        </button>
      }
    >
      {show_form && (
        <LocationForm
          campaign={campaign}
          initial={editing ?? undefined}
          onSave={save}
          onCancel={() => {
            set_show_form(false);
            set_editing(null);
          }}
        />
      )}
      {locations.length === 0 && !show_form ? (
        <EmptyState message="No locations tracked yet." />
      ) : (
        <div className="flex flex-col gap-1">
          {locations.map((l) => (
            <div
              key={l.id}
              style={{
                padding: '8px 10px',
                background: 'var(--color-background-secondary)',
                borderRadius: 'var(--border-radius-md)',
                opacity: l.visited ? 1 : 0.7,
              }}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <button
                      onClick={() => toggle_visited(l)}
                      title={l.visited ? 'Visited' : 'Not yet visited'}
                      style={{
                        fontSize: 12,
                        padding: 0,
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: l.visited ? '#22C55E' : 'var(--color-text-tertiary)',
                      }}
                    >
                      {l.visited ? '✓' : '○'}
                    </button>
                    <span className="text-[12px] font-medium">{l.name}</span>
                    {l.region && (
                      <span className="text-[10px] text-text-tertiary italic">
                        ({l.region})
                      </span>
                    )}
                  </div>
                  {l.description && (
                    <div className="text-[11px] text-text-secondary leading-relaxed">
                      {l.description}
                    </div>
                  )}
                  <RelatedLinks
                    groups={[
                      { label: 'Quests', ids: l.quest_ids, items: campaign.quests ?? [], getLabel: (q) => q.title },
                      { label: 'Plot threads', ids: l.plot_thread_ids, items: campaign.plot_threads ?? [], getLabel: (t) => t.title },
                      { label: 'NPCs', ids: l.npc_ids, items: campaign.npcs ?? [], getLabel: (n) => n.name },
                      { label: 'Factions', ids: l.faction_ids, items: campaign.factions ?? [], getLabel: (f) => f.name },
                    ]}
                  />
                  <DashboardImageGallery images={l.gallery} />
                  {l.notes && (
                    <div className="text-[11px] text-text-tertiary mt-1 italic">
                      {l.notes}
                    </div>
                  )}
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => {
                      set_editing(l);
                      set_show_form(true);
                    }}
                    style={{ fontSize: 11, padding: '2px 6px' }}
                  >
                    ✎
                  </button>
                  <button
                    onClick={() => remove(l.id)}
                    style={{
                      fontSize: 11,
                      padding: '2px 6px',
                      color: 'var(--color-text-tertiary)',
                    }}
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Module>
  );
}

function LocationForm({
  campaign,
  initial,
  onSave,
  onCancel,
}: {
  campaign: Campaign;
  initial?: CampaignLocation;
  onSave: (l: CampaignLocation) => void;
  onCancel: () => void;
}) {
  const [name, set_name] = useState(initial?.name ?? '');
  const [region, set_region] = useState(initial?.region ?? '');
  const [description, set_description] = useState(initial?.description ?? '');
  const [gallery, set_gallery] = useState<string[]>(initial?.gallery ?? []);
  const [notes, set_notes] = useState(initial?.notes ?? '');
  const [quest_ids, set_quest_ids] = useState<string[]>(initial?.quest_ids ?? []);
  const [plot_thread_ids, set_plot_thread_ids] = useState<string[]>(initial?.plot_thread_ids ?? []);
  const [npc_ids, set_npc_ids] = useState<string[]>(initial?.npc_ids ?? []);
  const [faction_ids, set_faction_ids] = useState<string[]>(initial?.faction_ids ?? []);
  const [visited, set_visited] = useState(initial?.visited ?? false);

  return (
    <div className="mb-3" style={inlineFormStyle}>
      <div className="grid gap-2 mb-2" style={{ gridTemplateColumns: '2fr 1fr' }}>
        <FieldLabel label="Name">
          <input
            value={name}
            onChange={(e) => set_name(e.target.value)}
            placeholder="e.g. Wave Echo Cave"
            style={{ width: '100%' }}
            autoFocus
          />
        </FieldLabel>
        <FieldLabel label="Region">
          <input
            value={region}
            onChange={(e) => set_region(e.target.value)}
            placeholder="e.g. Sword Coast"
            style={{ width: '100%' }}
          />
        </FieldLabel>
      </div>
      <FieldLabel label="Description">
        <textarea
          value={description}
          onChange={(e) => set_description(e.target.value)}
          placeholder="What it looks like, who lives there..."
          style={{
            width: '100%',
            minHeight: 50,
            fontSize: '12px',
            resize: 'vertical',
            boxSizing: 'border-box',
          }}
        />
      </FieldLabel>
      <DashboardGalleryInput label="Location images / maps" images={gallery} onChange={set_gallery} />
      <RelationshipPicker
        label="Linked quests"
        options={(campaign.quests ?? []).map((q) => ({ id: q.id, label: q.title }))}
        selected={quest_ids}
        onChange={set_quest_ids}
      />
      <RelationshipPicker
        label="Linked plot threads"
        options={(campaign.plot_threads ?? []).map((t) => ({ id: t.id, label: t.title }))}
        selected={plot_thread_ids}
        onChange={set_plot_thread_ids}
      />
      <RelationshipPicker
        label="Linked NPCs"
        options={(campaign.npcs ?? []).map((n) => ({ id: n.id, label: n.name }))}
        selected={npc_ids}
        onChange={set_npc_ids}
      />
      <RelationshipPicker
        label="Linked factions"
        options={(campaign.factions ?? []).map((f) => ({ id: f.id, label: f.name }))}
        selected={faction_ids}
        onChange={set_faction_ids}
      />
      <FieldLabel label="Notes (secrets, hooks)">
        <textarea
          value={notes}
          onChange={(e) => set_notes(e.target.value)}
          placeholder="Hidden info, plot connections..."
          style={{
            width: '100%',
            minHeight: 40,
            fontSize: '12px',
            resize: 'vertical',
            boxSizing: 'border-box',
          }}
        />
      </FieldLabel>
      <label className="flex items-center gap-2 mt-2 text-[12px]" style={{ cursor: 'pointer' }}>
        <input
          type="checkbox"
          checked={visited}
          onChange={(e) => set_visited(e.target.checked)}
        />
        Party has visited this place
      </label>
      <div className="flex gap-2 mt-3">
        <button
          onClick={() => {
            if (!name.trim()) return;
            onSave({
              id: initial?.id ?? crypto.randomUUID(),
              name: name.trim(),
              region: region.trim(),
              description: description.trim(),
              gallery,
              notes: notes.trim(),
              quest_ids,
              plot_thread_ids,
              npc_ids,
              faction_ids,
              visited,
              created_at: initial?.created_at ?? Date.now(),
            });
          }}
          className="bg-accent-50 border-accent-300 text-accent-900 font-medium"
          style={{ padding: '5px 12px', fontSize: '12px' }}
        >
          Save
        </button>
        <button onClick={onCancel} style={{ padding: '5px 12px', fontSize: '12px' }}>
          Cancel
        </button>
      </div>
    </div>
  );
}

// ============================================================
// Shared UI helpers
// ============================================================

function Module({
  title,
  right,
  children,
}: {
  title: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div
      className="bg-bg-primary mb-4"
      style={{
        padding: '14px 16px',
        border: '0.5px solid var(--color-border-tertiary)',
        borderRadius: 'var(--border-radius-md)',
      }}
    >
      <div className="flex justify-between items-center mb-3">
        <div className="text-[13px] font-medium">{title}</div>
        {right}
      </div>
      {children}
    </div>
  );
}

function EmptyState({
  message,
  actionLabel,
  onAction,
}: {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div
      className="text-text-tertiary text-[12px] italic"
      style={{
        padding: '16px 12px',
        background: 'var(--color-background-secondary)',
        borderRadius: 'var(--border-radius-md)',
        textAlign: 'center',
      }}
    >
      {message}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="block mx-auto mt-2"
          style={{ fontSize: 11, padding: '4px 10px' }}
        >
          {actionLabel} →
        </button>
      )}
    </div>
  );
}

function FieldLabel({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ minWidth: 0 }}>
      <label
        style={{
          display: 'block',
          fontSize: '11px',
          color: 'var(--color-text-secondary)',
          marginBottom: 4,
          fontWeight: 500,
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function DataRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex justify-between items-baseline gap-3">
      <span className="text-[11px] text-text-tertiary uppercase tracking-wider">
        {label}
      </span>
      <span className="text-[13px] text-right">{value}</span>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        fontSize: 11,
        padding: '3px 8px',
        background: active ? 'var(--color-background-info)' : 'transparent',
        border: active
          ? '0.5px solid var(--color-border-info)'
          : '0.5px solid var(--color-border-tertiary)',
        color: active ? 'var(--color-text-info)' : undefined,
        borderRadius: 12,
        fontWeight: active ? 500 : 400,
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  );
}

const inlineFormStyle: React.CSSProperties = {
  padding: '10px 12px',
  background: 'var(--color-background-primary)',
  border: '1px solid var(--color-border-info)',
  borderRadius: 'var(--border-radius-md)',
};

// ============================================================
// Global Search: find any named entity and show its connections
// ============================================================

type SearchEntityKind =
  | 'npc'
  | 'quest'
  | 'location'
  | 'faction'
  | 'plot_thread'
  | 'character'
  | 'encounter'
  | 'session';

interface SearchEntity {
  kind: SearchEntityKind;
  id: string;
  name: string;
  detail?: string; // small subtitle (role, region, status, etc.)
}

const KIND_META: Record<SearchEntityKind, { label: string; emoji: string }> = {
  npc: { label: 'NPC', emoji: '🧑' },
  quest: { label: 'Quest', emoji: '⚔️' },
  location: { label: 'Location', emoji: '📍' },
  faction: { label: 'Faction', emoji: '🛡️' },
  plot_thread: { label: 'Plot thread', emoji: '🧵' },
  character: { label: 'Character', emoji: '🧙' },
  encounter: { label: 'Encounter', emoji: '🎯' },
  session: { label: 'Session', emoji: '📖' },
};

function GlobalSearchModule({ campaign }: { campaign: Campaign }) {
  const navigate = useNavigate();
  const { encounters } = useEncounterStore();
  const [query, set_query] = useState('');
  const [selected_id, set_selected_id] = useState<string | null>(null);

  // Build the searchable index from all named campaign entities.
  const all_entities: SearchEntity[] = [
    ...(campaign.characters ?? []).map((c) => ({
      kind: 'character' as const,
      id: `character:${c.id}`,
      name: c.name,
      detail: [c.class, c.level && `Lv${c.level}`, c.species]
        .filter(Boolean)
        .join(' · '),
    })),
    ...(campaign.npcs ?? []).map((n) => ({
      kind: 'npc' as const,
      id: `npc:${n.id}`,
      name: n.name,
      detail: [n.role, n.location].filter(Boolean).join(' · '),
    })),
    ...(campaign.locations ?? []).map((l) => ({
      kind: 'location' as const,
      id: `location:${l.id}`,
      name: l.name,
      detail: l.region,
    })),
    ...(campaign.quests ?? []).map((q) => ({
      kind: 'quest' as const,
      id: `quest:${q.id}`,
      name: q.title,
      detail: [q.giver && `from ${q.giver}`, q.status]
        .filter(Boolean)
        .join(' · '),
    })),
    ...(campaign.factions ?? []).map((f) => ({
      kind: 'faction' as const,
      id: `faction:${f.id}`,
      name: f.name,
      detail: [f.type, f.status].filter(Boolean).join(' · '),
    })),
    ...(campaign.plot_threads ?? []).map((p) => ({
      kind: 'plot_thread' as const,
      id: `plot_thread:${p.id}`,
      name: p.title,
      detail: p.status,
    })),
    ...(campaign.sessions ?? []).map((s) => ({
      kind: 'session' as const,
      id: `session:${s.id}`,
      name: `Session ${s.session_number}: ${s.title || '(untitled)'}`,
      detail: s.real_date,
    })),
    ...encounters
      .filter((e) => e.campaign_id === campaign.id)
      .map((e) => ({
        kind: 'encounter' as const,
        id: `encounter:${e.id}`,
        name: e.name,
        detail: `${e.combatants.length} combatants · ${e.status}`,
      })),
  ];

  const filtered = (() => {
    if (!query.trim()) return all_entities.slice(0, 50);
    const q = query.toLowerCase();
    return all_entities
      .filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.detail?.toLowerCase().includes(q)
      )
      .slice(0, 50);
  })();

  const selected = selected_id
    ? all_entities.find((e) => e.id === selected_id) ?? null
    : null;

  return (
    <div
      className="bg-bg-primary mb-4"
      style={{
        padding: '16px 20px',
        border: '0.5px solid var(--color-border-tertiary)',
        borderRadius: 'var(--border-radius-md)',
      }}
    >
      <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
        <div>
          <h3 className="text-[14px] font-medium">🔍 Global search</h3>
          <div className="text-[11px] text-text-tertiary">
            Find any NPC, location, quest, faction, plot thread, character,
            encounter, or session — see what's connected.
          </div>
        </div>
        <input
          value={query}
          onChange={(e) => set_query(e.target.value)}
          placeholder="Type to search…"
          style={{
            width: 280,
            maxWidth: '100%',
            boxSizing: 'border-box',
          }}
        />
      </div>

      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: 'minmax(220px, 280px) minmax(0, 1fr)' }}
      >
        {/* Left: filtered results list */}
        <div
          style={{
            border: '0.5px solid var(--color-border-tertiary)',
            borderRadius: 'var(--border-radius-md)',
            background: 'var(--color-background-secondary)',
            maxHeight: 320,
            overflowY: 'auto',
            padding: 4,
          }}
        >
          {filtered.length === 0 ? (
            <div className="text-[11px] text-text-tertiary italic p-3">
              No matches.
            </div>
          ) : (
            filtered.map((e) => {
              const meta = KIND_META[e.kind];
              const is_sel = e.id === selected_id;
              return (
                <button
                  key={e.id}
                  onClick={() => set_selected_id(e.id)}
                  className="text-left w-full"
                  style={{
                    padding: '6px 8px',
                    background: is_sel
                      ? 'var(--color-background-info)'
                      : 'transparent',
                    border: is_sel
                      ? '0.5px solid var(--color-border-info)'
                      : '0.5px solid transparent',
                    borderRadius: 'var(--border-radius-sm)',
                    minHeight: 0,
                    display: 'block',
                    textDecoration: 'none',
                    marginBottom: 2,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: 13, lineHeight: 1 }}>
                      {meta.emoji}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] font-medium truncate">
                        {e.name}
                      </div>
                      <div className="text-[10px] text-text-tertiary truncate">
                        {meta.label}
                        {e.detail && ` · ${e.detail}`}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Right: selected detail with connections */}
        <div
          style={{
            border: '0.5px solid var(--color-border-tertiary)',
            borderRadius: 'var(--border-radius-md)',
            background: 'var(--color-background-secondary)',
            padding: 14,
            minHeight: 200,
          }}
        >
          {!selected ? (
            <div className="text-[12px] text-text-tertiary italic">
              Pick an entity on the left to see its full details and everything
              connected to it.
            </div>
          ) : (
            <SearchResultDetails
              entity={selected}
              campaign={campaign}
              encounters={encounters.filter(
                (e) => e.campaign_id === campaign.id
              )}
              onNavigate={(target) => {
                navigate(target);
              }}
              onSelectEntity={(id) => set_selected_id(id)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function SearchResultDetails({
  entity,
  campaign,
  encounters,
  onNavigate,
  onSelectEntity,
}: {
  entity: SearchEntity;
  campaign: Campaign;
  encounters: Encounter[];
  onNavigate: (path: string) => void;
  onSelectEntity: (id: string) => void;
}) {
  const meta = KIND_META[entity.kind];
  const raw_id = entity.id.split(':')[1];

  // ---------------------------------------------------------------
  // Helper to render a "linked entity" pill (clickable to re-select)
  // ---------------------------------------------------------------
  const Pill = ({
    kind,
    id,
    name,
  }: {
    kind: SearchEntityKind;
    id: string;
    name: string;
  }) => (
    <button
      onClick={() => onSelectEntity(`${kind}:${id}`)}
      style={{
        fontSize: 11,
        padding: '3px 9px',
        background: 'var(--color-background-info)',
        color: 'var(--color-text-info)',
        border: '0.5px solid var(--color-border-info)',
        borderRadius: 12,
        minHeight: 0,
        textDecoration: 'none',
        cursor: 'pointer',
      }}
    >
      {KIND_META[kind].emoji} {name}
    </button>
  );

  // ---------------------------------------------------------------
  // Resolve referenced entities by their ID arrays (returns valid entities)
  // ---------------------------------------------------------------
  const resolveNPCs = (ids?: string[]) =>
    (ids ?? [])
      .map((id) => (campaign.npcs ?? []).find((x) => x.id === id))
      .filter((x): x is NonNullable<typeof x> => x != null);
  const resolveLocations = (ids?: string[]) =>
    (ids ?? [])
      .map((id) => (campaign.locations ?? []).find((x) => x.id === id))
      .filter((x): x is NonNullable<typeof x> => x != null);
  const resolveQuests = (ids?: string[]) =>
    (ids ?? [])
      .map((id) => (campaign.quests ?? []).find((x) => x.id === id))
      .filter((x): x is NonNullable<typeof x> => x != null);
  const resolveFactions = (ids?: string[]) =>
    (ids ?? [])
      .map((id) => (campaign.factions ?? []).find((x) => x.id === id))
      .filter((x): x is NonNullable<typeof x> => x != null);
  const resolvePlotThreads = (ids?: string[]) =>
    (ids ?? [])
      .map((id) => (campaign.plot_threads ?? []).find((x) => x.id === id))
      .filter((x): x is NonNullable<typeof x> => x != null);

  // ---------------------------------------------------------------
  // Render layout: title + description + sections of connections
  // ---------------------------------------------------------------
  const renderConnections = (sections: Array<{
    title: string;
    items: { kind: SearchEntityKind; id: string; name: string }[];
  }>) => (
    <>
      {sections.map(
        ({ title, items }) =>
          items.length > 0 && (
            <div key={title} className="mb-2">
              <div className="text-[11px] font-medium text-text-secondary mb-1">
                {title} ({items.length})
              </div>
              <div className="flex flex-wrap gap-1">
                {items.map((item) => (
                  <Pill key={`${item.kind}:${item.id}`} {...item} />
                ))}
              </div>
            </div>
          )
      )}
    </>
  );

  // ---------------------------------------------------------------
  // Kind-specific rendering
  // ---------------------------------------------------------------
  let body: React.ReactNode = null;

  if (entity.kind === 'npc') {
    const npc = (campaign.npcs ?? []).find((n) => n.id === raw_id);
    if (npc) {
      const sessions_with =
        (campaign.sessions ?? []).filter((s) =>
          s.participants?.some((p) =>
            p.toLowerCase().includes(npc.name.toLowerCase())
          )
        ) ?? [];
      body = (
        <div>
          {npc.description && (
            <p className="text-[12px] mb-3" style={{ whiteSpace: 'pre-wrap' }}>
              {npc.description}
            </p>
          )}
          {npc.notes && (
            <p className="text-[11px] text-text-secondary mb-3" style={{ whiteSpace: 'pre-wrap' }}>
              <strong>Notes:</strong> {npc.notes}
            </p>
          )}
          {renderConnections([
            {
              title: 'Locations',
              items: resolveLocations(npc.location_ids).map((l) => ({
                kind: 'location',
                id: l.id,
                name: l.name,
              })),
            },
            {
              title: 'Quests',
              items: resolveQuests(npc.quest_ids).map((q) => ({
                kind: 'quest',
                id: q.id,
                name: q.title,
              })),
            },
            {
              title: 'Factions',
              items: resolveFactions(npc.faction_ids).map((f) => ({
                kind: 'faction',
                id: f.id,
                name: f.name,
              })),
            },
            {
              title: 'Plot threads',
              items: resolvePlotThreads(npc.plot_thread_ids).map((p) => ({
                kind: 'plot_thread',
                id: p.id,
                name: p.title,
              })),
            },
            {
              title: 'Appears in sessions',
              items: sessions_with.map((s) => ({
                kind: 'session' as const,
                id: s.id,
                name: `S${s.session_number}: ${s.title || 'untitled'}`,
              })),
            },
          ])}
        </div>
      );
    }
  } else if (entity.kind === 'location') {
    const loc = (campaign.locations ?? []).find((l) => l.id === raw_id);
    if (loc) {
      // Also find NPCs whose `location` text matches by name
      const npcs_text_match = (campaign.npcs ?? []).filter((n) =>
        n.location?.toLowerCase().includes(loc.name.toLowerCase())
      );
      const npcs_id_match = resolveNPCs(loc.npc_ids);
      const npcs_combined = Array.from(
        new Map([...npcs_id_match, ...npcs_text_match].map((n) => [n.id, n])).values()
      );
      body = (
        <div>
          {loc.description && (
            <p className="text-[12px] mb-3" style={{ whiteSpace: 'pre-wrap' }}>
              {loc.description}
            </p>
          )}
          {loc.notes && (
            <p className="text-[11px] text-text-secondary mb-3" style={{ whiteSpace: 'pre-wrap' }}>
              <strong>Notes:</strong> {loc.notes}
            </p>
          )}
          {renderConnections([
            {
              title: 'NPCs here',
              items: npcs_combined.map((n) => ({
                kind: 'npc' as const,
                id: n.id,
                name: n.name,
              })),
            },
            {
              title: 'Quests',
              items: resolveQuests(loc.quest_ids).map((q) => ({
                kind: 'quest' as const,
                id: q.id,
                name: q.title,
              })),
            },
            {
              title: 'Factions',
              items: resolveFactions(loc.faction_ids).map((f) => ({
                kind: 'faction' as const,
                id: f.id,
                name: f.name,
              })),
            },
            {
              title: 'Plot threads',
              items: resolvePlotThreads(loc.plot_thread_ids).map((p) => ({
                kind: 'plot_thread' as const,
                id: p.id,
                name: p.title,
              })),
            },
          ])}
        </div>
      );
    }
  } else if (entity.kind === 'quest') {
    const q = (campaign.quests ?? []).find((x) => x.id === raw_id);
    if (q) {
      body = (
        <div>
          {q.giver && (
            <div className="text-[11px] text-text-secondary mb-2">
              Given by: <strong className="text-text-primary">{q.giver}</strong>
            </div>
          )}
          {q.description && (
            <p className="text-[12px] mb-3" style={{ whiteSpace: 'pre-wrap' }}>
              {q.description}
            </p>
          )}
          {q.reward && (
            <p className="text-[11px] text-text-secondary mb-3">
              <strong>Reward:</strong> {q.reward}
            </p>
          )}
          {renderConnections([
            {
              title: 'NPCs involved',
              items: resolveNPCs(q.npc_ids).map((n) => ({
                kind: 'npc' as const,
                id: n.id,
                name: n.name,
              })),
            },
            {
              title: 'Locations',
              items: resolveLocations(q.location_ids).map((l) => ({
                kind: 'location' as const,
                id: l.id,
                name: l.name,
              })),
            },
            {
              title: 'Factions',
              items: resolveFactions(q.faction_ids).map((f) => ({
                kind: 'faction' as const,
                id: f.id,
                name: f.name,
              })),
            },
            {
              title: 'Plot threads',
              items: resolvePlotThreads(q.plot_thread_ids).map((p) => ({
                kind: 'plot_thread' as const,
                id: p.id,
                name: p.title,
              })),
            },
          ])}
        </div>
      );
    }
  } else if (entity.kind === 'faction') {
    const f = (campaign.factions ?? []).find((x) => x.id === raw_id);
    if (f) {
      body = (
        <div>
          {f.description && (
            <p className="text-[12px] mb-3" style={{ whiteSpace: 'pre-wrap' }}>
              {f.description}
            </p>
          )}
          {f.goals && (
            <p className="text-[11px] text-text-secondary mb-2">
              <strong>Goals:</strong> {f.goals}
            </p>
          )}
          {f.notes && (
            <p className="text-[11px] text-text-secondary mb-3" style={{ whiteSpace: 'pre-wrap' }}>
              <strong>Notes:</strong> {f.notes}
            </p>
          )}
          {renderConnections([
            {
              title: 'NPCs',
              items: resolveNPCs(f.npc_ids).map((n) => ({
                kind: 'npc' as const,
                id: n.id,
                name: n.name,
              })),
            },
            {
              title: 'Locations',
              items: resolveLocations(f.location_ids).map((l) => ({
                kind: 'location' as const,
                id: l.id,
                name: l.name,
              })),
            },
            {
              title: 'Quests',
              items: resolveQuests(f.quest_ids).map((q) => ({
                kind: 'quest' as const,
                id: q.id,
                name: q.title,
              })),
            },
            {
              title: 'Plot threads',
              items: resolvePlotThreads(f.plot_thread_ids).map((p) => ({
                kind: 'plot_thread' as const,
                id: p.id,
                name: p.title,
              })),
            },
          ])}
        </div>
      );
    }
  } else if (entity.kind === 'plot_thread') {
    const p = (campaign.plot_threads ?? []).find((x) => x.id === raw_id);
    if (p) {
      body = (
        <div>
          {p.description && (
            <p className="text-[12px] mb-3" style={{ whiteSpace: 'pre-wrap' }}>
              {p.description}
            </p>
          )}
          {renderConnections([
            {
              title: 'NPCs',
              items: resolveNPCs(p.npc_ids).map((n) => ({
                kind: 'npc' as const,
                id: n.id,
                name: n.name,
              })),
            },
            {
              title: 'Locations',
              items: resolveLocations(p.location_ids).map((l) => ({
                kind: 'location' as const,
                id: l.id,
                name: l.name,
              })),
            },
            {
              title: 'Factions',
              items: resolveFactions(p.faction_ids).map((f) => ({
                kind: 'faction' as const,
                id: f.id,
                name: f.name,
              })),
            },
          ])}
        </div>
      );
    }
  } else if (entity.kind === 'character') {
    const c = (campaign.characters ?? []).find((x) => x.id === raw_id);
    if (c) {
      // Find sessions this character attended (by name match)
      const sessions_with = (campaign.sessions ?? []).filter((s) =>
        s.participants?.some((p) =>
          p.toLowerCase().includes(c.name.toLowerCase())
        )
      );
      const encounter_appearances = encounters.filter((e) =>
        e.combatants.some((cb: Combatant) => cb.source_id === c.id)
      );
      body = (
        <div>
          <div className="text-[11px] text-text-secondary mb-3">
            {[c.class, c.level && `Level ${c.level}`, c.species]
              .filter(Boolean)
              .join(' · ') || 'Player character'}
          </div>
          {c.notes && (
            <p className="text-[11px] text-text-secondary mb-3" style={{ whiteSpace: 'pre-wrap' }}>
              <strong>Notes:</strong> {c.notes}
            </p>
          )}
          {renderConnections([
            {
              title: 'Sessions attended',
              items: sessions_with.map((s) => ({
                kind: 'session' as const,
                id: s.id,
                name: `S${s.session_number}: ${s.title || 'untitled'}`,
              })),
            },
            {
              title: 'Encounters',
              items: encounter_appearances.map((e) => ({
                kind: 'encounter' as const,
                id: e.id,
                name: e.name,
              })),
            },
          ])}
          <div className="mt-3">
            <button
              onClick={() => onNavigate('/characters')}
              style={{ fontSize: 11, padding: '5px 12px' }}
            >
              Open in Characters →
            </button>
          </div>
        </div>
      );
    }
  } else if (entity.kind === 'encounter') {
    const e = encounters.find((x) => x.id === raw_id);
    if (e) {
      const characters = e.combatants
        .filter((cb: Combatant) => cb.source_type === 'character')
        .map((cb: Combatant) => (campaign.characters ?? []).find((c) => c.id === cb.source_id))
        .filter((x): x is NonNullable<typeof x> => x != null);
      body = (
        <div>
          <div className="text-[11px] text-text-secondary mb-3">
            {e.combatants.length} combatants · status:{' '}
            <strong className="text-text-primary">{e.status}</strong>
            {e.round > 0 && <> · round {e.round}</>}
          </div>
          {renderConnections([
            {
              title: 'Characters in this encounter',
              items: characters.map((c) => ({
                kind: 'character' as const,
                id: c.id,
                name: c.name,
              })),
            },
          ])}
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => onNavigate(`/combat?encounter=${e.id}`)}
              className="bg-accent-50 border-accent-300 text-accent-900 font-medium"
              style={{ fontSize: 11, padding: '5px 12px' }}
            >
              Open encounter →
            </button>
            <button
              onClick={() => onNavigate('/encounters')}
              style={{ fontSize: 11, padding: '5px 12px' }}
            >
              All encounters
            </button>
          </div>
        </div>
      );
    }
  } else if (entity.kind === 'session') {
    const s = (campaign.sessions ?? []).find((x) => x.id === raw_id);
    if (s) {
      // PCs that attended
      const attendees: { kind: SearchEntityKind; id: string; name: string }[] =
        (s.participants ?? [])
          .map((name) => {
            const c = (campaign.characters ?? []).find(
              (x) => x.name.toLowerCase() === name.toLowerCase()
            );
            return c
              ? { kind: 'character' as const, id: c.id, name: c.name }
              : null;
          })
          .filter((x): x is NonNullable<typeof x> => x != null);
      body = (
        <div>
          <div className="text-[11px] text-text-secondary mb-2">
            Real date: <strong>{s.real_date}</strong>
            {s.in_game_date && <> · In-game: <strong>{s.in_game_date}</strong></>}
          </div>
          {s.summary && (
            <p className="text-[12px] mb-3" style={{ whiteSpace: 'pre-wrap' }}>
              {s.summary}
            </p>
          )}
          {renderConnections([
            {
              title: 'Player characters who attended',
              items: attendees,
            },
          ])}
          {(s.participants ?? []).length > 0 && (
            <div className="text-[11px] text-text-tertiary mt-2">
              All participants (raw): {s.participants.join(', ')}
            </div>
          )}
        </div>
      );
    }
  }

  if (!body) {
    body = (
      <div className="text-[12px] text-text-tertiary italic">
        Entity not found.
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <span style={{ fontSize: 18 }}>{meta.emoji}</span>
        <h4 className="text-[15px] font-medium">{entity.name}</h4>
        <span
          className="text-[10px]"
          style={{
            padding: '1px 8px',
            background: 'var(--color-background-info)',
            color: 'var(--color-text-info)',
            borderRadius: 10,
            fontWeight: 500,
          }}
        >
          {meta.label}
        </span>
      </div>
      {body}
    </div>
  );
}
