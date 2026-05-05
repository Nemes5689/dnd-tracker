import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEncounterStore } from '@/store/encounterStore';
import { useCampaignStore } from '@/store/campaignStore';
import type { Encounter, CombatStatus } from '@/types/app';

/**
 * Saved encounters list. Lets the DM see all encounters in the active
 * campaign, continue them, rename, duplicate, reset, or delete.
 */
export function EncountersPage() {
  const navigate = useNavigate();
  const {
    encounters,
    createEncounter,
    deleteEncounter,
    renameEncounter,
    duplicateEncounter,
    resetCombat,
  } = useEncounterStore();
  const { getActiveCampaign } = useCampaignStore();
  const campaign = getActiveCampaign();

  const [filter, set_filter] = useState<'all' | CombatStatus>('all');

  if (!campaign) {
    return (
      <div className="p-8 text-text-secondary">
        Create or select a campaign first (use the sidebar).
      </div>
    );
  }

  // Encounters belonging to the active campaign, sorted by most recently updated
  const my_encounters = encounters
    .filter((e) => e.campaign_id === campaign.id)
    .filter((e) => filter === 'all' || e.status === filter)
    .sort((a, b) => b.updated_at - a.updated_at);

  const total = encounters.filter((e) => e.campaign_id === campaign.id).length;
  const counts = {
    planned: encounters.filter((e) => e.campaign_id === campaign.id && e.status === 'planned').length,
    active: encounters.filter((e) => e.campaign_id === campaign.id && e.status === 'active').length,
    completed: encounters.filter((e) => e.campaign_id === campaign.id && e.status === 'completed').length,
  };

  const handleNew = () => {
    const name = prompt('Encounter name:', 'New encounter');
    if (!name) return;
    const id = createEncounter(campaign.id, name.trim());
    // Open the new encounter in combat page setup
    navigate(`/combat?encounter=${id}`);
  };

  const handleContinue = (encounter: Encounter) => {
    navigate(`/combat?encounter=${encounter.id}`);
  };

  const handleRename = (encounter: Encounter) => {
    const new_name = prompt('Rename encounter:', encounter.name);
    if (!new_name || new_name.trim() === encounter.name) return;
    renameEncounter(encounter.id, new_name.trim());
  };

  const handleDuplicate = (encounter: Encounter) => {
    const new_id = duplicateEncounter(encounter.id);
    navigate(`/combat?encounter=${new_id}`);
  };

  const handleReset = (encounter: Encounter) => {
    if (
      !confirm(
        `Reset combat for "${encounter.name}"? This restores HP, clears initiative, conditions and log. The combatant roster stays.`
      )
    )
      return;
    resetCombat(encounter.id);
  };

  const handleReplay = (encounter: Encounter) => {
    if (
      !confirm(
        `Replay "${encounter.name}"? HP, initiative, conditions, and log will reset. The same combatants will fight again.`
      )
    )
      return;
    resetCombat(encounter.id);
    navigate(`/combat?encounter=${encounter.id}`);
  };

  const handleDelete = (encounter: Encounter) => {
    if (!confirm(`Delete "${encounter.name}"? This cannot be undone.`)) return;
    deleteEncounter(encounter.id);
  };

  return (
    <div className="p-8 max-w-[900px]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="text-[11px] text-text-tertiary mb-1">{campaign.name}</div>
          <h2>Encounters</h2>
          <div className="text-[12px] text-text-tertiary mt-1">
            {total} total · {counts.planned} planned · {counts.active} active · {counts.completed} completed
          </div>
        </div>
        <button
          onClick={handleNew}
          className="bg-accent-50 border-accent-300 text-accent-900 font-medium"
          style={{ padding: '8px 14px', fontSize: '13px' }}
        >
          + New encounter
        </button>
      </div>

      {/* Filter tabs */}
      {total > 0 && (
        <div
          className="flex gap-1 mb-4"
          style={{ borderBottom: '0.5px solid var(--color-border-tertiary)' }}
        >
          <FilterTab active={filter === 'all'} onClick={() => set_filter('all')}>
            All ({total})
          </FilterTab>
          <FilterTab
            active={filter === 'planned'}
            onClick={() => set_filter('planned')}
          >
            Planned ({counts.planned})
          </FilterTab>
          <FilterTab
            active={filter === 'active'}
            onClick={() => set_filter('active')}
          >
            Active ({counts.active})
          </FilterTab>
          <FilterTab
            active={filter === 'completed'}
            onClick={() => set_filter('completed')}
          >
            Completed ({counts.completed})
          </FilterTab>
        </div>
      )}

      {my_encounters.length === 0 ? (
        <div
          className="text-text-tertiary text-[13px] italic"
          style={{
            padding: '40px 20px',
            background: 'var(--color-background-secondary)',
            borderRadius: 'var(--border-radius-md)',
            textAlign: 'center',
          }}
        >
          {total === 0
            ? 'No encounters yet. Click "+ New encounter" to start.'
            : `No ${filter} encounters.`}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {my_encounters.map((e) => (
            <EncounterCard
              key={e.id}
              encounter={e}
              onContinue={() => handleContinue(e)}
              onReplay={() => handleReplay(e)}
              onRename={() => handleRename(e)}
              onDuplicate={() => handleDuplicate(e)}
              onReset={() => handleReset(e)}
              onDelete={() => handleDelete(e)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterTab({
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
        padding: '6px 14px',
        fontSize: '12px',
        background: 'transparent',
        border: 'none',
        borderBottom: active
          ? '2px solid var(--color-text-primary)'
          : '2px solid transparent',
        marginBottom: '-0.5px',
        color: active
          ? 'var(--color-text-primary)'
          : 'var(--color-text-tertiary)',
        fontWeight: active ? 500 : 400,
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  );
}

function EncounterCard({
  encounter,
  onContinue,
  onReplay,
  onRename,
  onDuplicate,
  onReset,
  onDelete,
}: {
  encounter: Encounter;
  onContinue: () => void;
  onReplay: () => void;
  onRename: () => void;
  onDuplicate: () => void;
  onReset: () => void;
  onDelete: () => void;
}) {
  const pcs = encounter.combatants.filter((c) => c.is_player).length;
  const allies = encounter.combatants.filter((c) => c.is_ally).length;
  const monsters = encounter.combatants.filter(
    (c) => !c.is_player && !c.is_ally
  ).length;

  const updated = new Date(encounter.updated_at);
  const now = Date.now();
  const ago_ms = now - encounter.updated_at;
  const ago_str =
    ago_ms < 60_000
      ? 'just now'
      : ago_ms < 3_600_000
      ? `${Math.floor(ago_ms / 60_000)}m ago`
      : ago_ms < 86_400_000
      ? `${Math.floor(ago_ms / 3_600_000)}h ago`
      : ago_ms < 7 * 86_400_000
      ? `${Math.floor(ago_ms / 86_400_000)}d ago`
      : updated.toLocaleDateString();

  return (
    <div
      className="bg-bg-primary"
      style={{
        padding: '14px 16px',
        border: '0.5px solid var(--color-border-tertiary)',
        borderRadius: 'var(--border-radius-md)',
      }}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <div className="text-[14px] font-medium">{encounter.name}</div>
            <StatusBadge status={encounter.status} />
            {encounter.status === 'active' && encounter.round > 0 && (
              <span
                className="text-[10px]"
                style={{
                  padding: '1px 6px',
                  borderRadius: 4,
                  background: 'var(--color-background-info)',
                  color: 'var(--color-text-info)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                round {encounter.round}
              </span>
            )}
          </div>
          <div className="text-[11px] text-text-tertiary">
            {encounter.combatants.length === 0 ? (
              <span className="italic">empty roster</span>
            ) : (
              <>
                {pcs > 0 && (
                  <span>
                    <span style={{ color: '#3B82F6' }}>●</span> {pcs} PC
                    {pcs > 1 ? 's' : ''}
                  </span>
                )}
                {allies > 0 && (
                  <span style={{ marginLeft: pcs > 0 ? 8 : 0 }}>
                    <span style={{ color: '#22C55E' }}>●</span> {allies}{' '}
                    all{allies > 1 ? 'ies' : 'y'}
                  </span>
                )}
                {monsters > 0 && (
                  <span style={{ marginLeft: pcs > 0 || allies > 0 ? 8 : 0 }}>
                    <span style={{ color: '#DC2626' }}>●</span> {monsters}{' '}
                    monster{monsters > 1 ? 's' : ''}
                  </span>
                )}
                <span className="ml-3">· {ago_str}</span>
              </>
            )}
          </div>
        </div>
        <div className="flex gap-1 flex-shrink-0">
          <button
            onClick={onContinue}
            className="bg-accent-50 border-accent-300 text-accent-900 font-medium"
            style={{ fontSize: '12px', padding: '5px 12px' }}
          >
            {encounter.status === 'planned'
              ? 'Open'
              : encounter.status === 'active'
              ? 'Continue'
              : 'View'}
          </button>
          {encounter.status === 'completed' && (
            <button
              onClick={onReplay}
              style={{
                fontSize: '12px',
                padding: '5px 12px',
                background: '#FEF3C7',
                borderColor: '#F59E0B',
                color: '#78350F',
                fontWeight: 500,
              }}
              title="Reset HP, init, conditions and start fresh with the same combatants"
            >
              ↻ Replay
            </button>
          )}
          <MoreMenu
            onRename={onRename}
            onDuplicate={onDuplicate}
            onReset={encounter.status !== 'planned' ? onReset : undefined}
            onDelete={onDelete}
          />
        </div>
      </div>

      {/* Quick combatant peek */}
      {encounter.combatants.length > 0 && (
        <div
          className="flex gap-1 flex-wrap mt-2 pt-2"
          style={{ borderTop: '0.5px solid var(--color-border-tertiary)' }}
        >
          {encounter.combatants.slice(0, 12).map((c) => {
            const color = c.is_player
              ? '#3B82F6'
              : c.is_ally
              ? '#22C55E'
              : '#DC2626';
            return (
              <span
                key={c.id}
                title={c.name}
                style={{
                  fontSize: 10,
                  padding: '2px 6px',
                  borderRadius: 8,
                  background: 'var(--color-background-secondary)',
                  borderLeft: `3px solid ${color}`,
                }}
              >
                {c.name}
              </span>
            );
          })}
          {encounter.combatants.length > 12 && (
            <span
              className="text-[10px] text-text-tertiary"
              style={{ alignSelf: 'center' }}
            >
              +{encounter.combatants.length - 12} more
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: CombatStatus }) {
  const config = {
    planned: { label: 'Planned', bg: '#E5E7EB', color: '#374151' },
    active: { label: '● Active', bg: '#DCFCE7', color: '#166534' },
    completed: { label: 'Completed', bg: '#DBEAFE', color: '#1E40AF' },
  }[status];

  return (
    <span
      style={{
        fontSize: 10,
        padding: '2px 8px',
        borderRadius: 4,
        background: config.bg,
        color: config.color,
        fontWeight: 500,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
      }}
    >
      {config.label}
    </span>
  );
}

/**
 * "..." button that pops a small menu with rename/duplicate/reset/delete.
 */
function MoreMenu({
  onRename,
  onDuplicate,
  onReset,
  onDelete,
}: {
  onRename: () => void;
  onDuplicate: () => void;
  onReset?: () => void;
  onDelete: () => void;
}) {
  const [open, set_open] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => set_open(!open)}
        style={{
          fontSize: '14px',
          padding: '5px 8px',
          lineHeight: 1,
        }}
        title="More actions"
      >
        ⋯
      </button>
      {open && (
        <>
          {/* Backdrop to close on outside click */}
          <div
            onClick={() => set_open(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 50,
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: 4,
              padding: '4px',
              background: 'var(--color-background-primary)',
              border: '0.5px solid var(--color-border-tertiary)',
              borderRadius: 'var(--border-radius-md)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
              zIndex: 51,
              minWidth: 140,
            }}
          >
            <MenuItem
              onClick={() => {
                set_open(false);
                onRename();
              }}
            >
              Rename
            </MenuItem>
            <MenuItem
              onClick={() => {
                set_open(false);
                onDuplicate();
              }}
            >
              Duplicate
            </MenuItem>
            {onReset && (
              <MenuItem
                onClick={() => {
                  set_open(false);
                  onReset();
                }}
              >
                Reset combat
              </MenuItem>
            )}
            <MenuItem
              danger
              onClick={() => {
                set_open(false);
                onDelete();
              }}
            >
              Delete
            </MenuItem>
          </div>
        </>
      )}
    </div>
  );
}

function MenuItem({
  children,
  onClick,
  danger,
}: {
  children: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'block',
        width: '100%',
        textAlign: 'left',
        padding: '6px 12px',
        background: 'transparent',
        border: 'none',
        borderRadius: 4,
        fontSize: 12,
        cursor: 'pointer',
        color: danger ? 'var(--color-text-danger)' : undefined,
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.background = 'var(--color-background-secondary)')
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.background = 'transparent')
      }
    >
      {children}
    </button>
  );
}
