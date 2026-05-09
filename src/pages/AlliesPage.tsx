import { useEffect, useMemo, useState } from 'react';
import { normalizeAlly, useAlliesStore } from '@/store/alliesStore';
import { useSRDStore } from '@/store/srdStore';
import { useCustomMonsterStore } from '@/store/customMonsterStore';
import { CustomMonsterForm } from '@/components/bestiary/CustomMonsterForm';
import { Lightbox } from '@/components/common/Lightbox';
import { ClassFeaturesPanel } from '@/components/characters/ClassFeaturesPanel';
import { OriginFeaturesPanel, formatOriginSummary } from '@/components/characters/OriginEditor';
import { formatCharacterBuildSummary } from '@/components/characters/ClassBuildEditor';
import type { Monster, MonsterSpeed, Spell } from '@/types/srd';

/**
 * Allies & Summons page. Manages friendly NPC statblocks (animated dead,
 * summoned creatures, town guards joining the party, etc).
 *
 * Visually similar to the Bestiary, but only contains user-created allies
 * and creatures duplicated from the SRD as allies. Allies show up in
 * encounter setup (separate "Add ally" section) and during combat
 * ("+ Add ally" button alongside "+ Add monster").
 */
export function AlliesPage() {
  const { allies, deleteAlly } = useAlliesStore();
  const { loaded, monsters: srd_monsters, load } = useSRDStore();
  const { monsters: custom_monsters } = useCustomMonsterStore();

  const [search, set_search] = useState('');
  const [selected, set_selected] = useState<Monster | null>(null);
  const [show_form, set_show_form] = useState(false);
  const [edit_id, set_edit_id] = useState<string | null>(null);
  const [duplicate_source, set_duplicate_source] = useState<Monster | null>(null);

  // For "duplicate from bestiary" picker
  const [show_srd_picker, set_show_srd_picker] = useState(false);
  const [srd_search, set_srd_search] = useState('');

  useEffect(() => {
    if (!loaded) load();
  }, [loaded, load]);

  // Combined source pool: custom monsters first (more relevant for personal NPCs),
  // then SRD monsters
  const bestiary = useMemo(
    () => [...custom_monsters, ...srd_monsters],
    [custom_monsters, srd_monsters]
  );

  const filtered_allies = useMemo(() => {
    if (!search.trim()) return allies;
    const q = search.toLowerCase();
    return allies.filter((a) => a.name.toLowerCase().includes(q));
  }, [allies, search]);

  const srd_results = useMemo(() => {
    if (!srd_search.trim()) return [];
    const q = srd_search.toLowerCase();
    return bestiary
      .filter((m) => m.name.toLowerCase().includes(q))
      .slice(0, 12);
  }, [bestiary, srd_search]);

  const handleDelete = () => {
    if (!selected) return;
    if (!confirm(`Delete "${selected.name}"?`)) return;
    deleteAlly(selected.id);
    set_selected(null);
  };

  const handleNew = () => {
    set_edit_id(null);
    set_duplicate_source(null);
    set_show_form(true);
  };

  const handleEdit = () => {
    if (!selected) return;
    set_edit_id(selected.id);
    set_duplicate_source(selected);
    set_show_form(true);
  };

  const handleDuplicate = () => {
    if (!selected) return;
    set_edit_id(null);
    set_duplicate_source(selected);
    set_show_form(true);
  };

  const handleDuplicateFromSRD = (m: Monster) => {
    set_edit_id(null);
    set_duplicate_source({ ...m, name: `${m.name} (ally)` });
    set_show_srd_picker(false);
    set_show_form(true);
  };

  return (
    <>
      <div className="flex h-full" style={{ minHeight: 'calc(100vh - 0px)' }}>
        {/* Left: list */}
        <div
          style={{
            width: 320,
            borderRight: '0.5px solid var(--color-border-tertiary)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div className="p-4">
            <h2 className="mb-2">Allies & Summons</h2>
            <div className="text-[11px] text-text-tertiary mb-3">
              Friendly NPCs, summoned creatures, animated dead, etc.
            </div>
            <div className="flex gap-2 mb-2">
              <button
                onClick={handleNew}
                className="bg-accent-50 border-accent-300 text-accent-900 font-medium"
                style={{ padding: '6px 12px', fontSize: '12px', flex: 1 }}
              >
                + New ally
              </button>
              <button
                onClick={() => set_show_srd_picker(true)}
                style={{ padding: '6px 12px', fontSize: '12px' }}
                title="Copy any creature (SRD or custom) as an ally"
              >
                ↩ From bestiary
              </button>
            </div>
            <input
              placeholder="Search..."
              value={search}
              onChange={(e) => set_search(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>

          <div className="flex-1 overflow-y-auto">
            {filtered_allies.length === 0 ? (
              <div className="px-4 text-[12px] text-text-tertiary italic">
                {search.trim()
                  ? 'No matches.'
                  : 'No allies yet. Click "+ New ally" or copy one from the SRD.'}
              </div>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {filtered_allies.map((a) => {
                  const is_selected = selected?.id === a.id;
                  return (
                    <li
                      key={a.id}
                      onClick={() => set_selected(a)}
                      style={{
                        padding: '8px 16px',
                        cursor: 'pointer',
                        background: is_selected
                          ? 'var(--color-background-info)'
                          : 'transparent',
                        borderBottom: '0.5px solid var(--color-border-tertiary)',
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            background: a.avatar
                              ? `url(${a.avatar})`
                              : '#22C55E',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            border: '1.5px solid #15803D',
                            color: '#fff',
                            fontWeight: 700,
                            fontSize: 13,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          {!a.avatar && a.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[13px] font-medium truncate">
                            {a.name}
                          </div>
                          <div className="text-[10px] text-text-tertiary">
                            CR {a.cr} · {a.size} {a.type}
                          </div>
                          {a.statblock_mode === 'character' && (
                            <div className="text-[10px] text-text-info truncate">
                              {[formatCharacterBuildSummary(a.character_build), formatOriginSummary(a.origin_selection)].filter(Boolean).join(' · ') || 'Character-like'}
                            </div>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        {/* Right: detail */}
        <div className="flex-1 overflow-y-auto p-7">
          {selected ? (
            <AllyDetail
              ally={selected}
              onEdit={handleEdit}
              onDuplicate={handleDuplicate}
              onDelete={handleDelete}
            />
          ) : (
            <div className="text-text-tertiary">
              <p className="mb-2">Select an ally from the list, or:</p>
              <ul className="text-[12px] list-disc pl-5">
                <li>Click <strong>+ New ally</strong> to create from scratch</li>
                <li>
                  Click <strong>↩ From bestiary</strong> to copy any creature
                  (SRD or custom) as an ally — great for summons or bringing a
                  recurring NPC into combat as a friend
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {show_form && (
        <CustomMonsterForm
          initial={duplicate_source ?? undefined}
          edit_id={edit_id ?? undefined}
          ally_mode
          onClose={() => {
            set_show_form(false);
            set_duplicate_source(null);
            set_edit_id(null);
          }}
          onSaved={(id) => {
            // Re-load and select the saved ally
            setTimeout(() => {
              const saved = useAlliesStore.getState().allies.find((a) => a.id === id);
              if (saved) set_selected(saved);
            }, 50);
          }}
        />
      )}

      {show_srd_picker && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99,
          }}
          onClick={() => set_show_srd_picker(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-bg-primary"
            style={{
              width: '90%',
              maxWidth: '520px',
              maxHeight: '80vh',
              overflowY: 'auto',
              borderRadius: 'var(--border-radius-lg)',
              padding: '20px 22px',
              boxShadow: '0 12px 32px rgba(0,0,0,0.18)',
            }}
          >
            <div className="flex justify-between items-center mb-3">
              <h2>Pick a creature to copy as ally</h2>
              <button
                onClick={() => set_show_srd_picker(false)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  fontSize: '20px',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                ×
              </button>
            </div>
            <input
              placeholder="Search SRD + custom monsters..."
              value={srd_search}
              onChange={(e) => set_srd_search(e.target.value)}
              autoFocus
              style={{ width: '100%', marginBottom: 12 }}
            />
            {!srd_search.trim() ? (
              <div className="text-[12px] text-text-tertiary italic px-2 py-4 text-center">
                Type to search…
              </div>
            ) : srd_results.length === 0 ? (
              <div className="text-[12px] text-text-tertiary italic px-2 py-4 text-center">
                No matches.
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                {srd_results.map((m) => {
                  const is_custom = m.source === 'Custom';
                  return (
                    <button
                      key={m.id}
                      onClick={() => handleDuplicateFromSRD(m)}
                      style={{
                        padding: '8px 12px',
                        fontSize: '12px',
                        textAlign: 'left',
                        border: '0.5px solid var(--color-border-tertiary)',
                        borderRadius: 'var(--border-radius-md)',
                        background: 'var(--color-background-secondary)',
                        cursor: 'pointer',
                      }}
                    >
                      <div className={`font-medium ${is_custom ? 'italic' : ''}`}>
                        {is_custom && '★ '}
                        {m.name}
                      </div>
                      <div className="text-[10px] text-text-tertiary">
                        CR {m.cr} · HP {m.hp} · AC {m.ac} · {m.size} {m.type}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
            <div
              className="mt-3 pt-2 text-[11px] text-text-tertiary"
              style={{ borderTop: '0.5px solid var(--color-border-tertiary)' }}
            >
              ★ = custom monster · The creature will be copied with "(ally)"
              appended to its name. You can edit anything afterward.
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function AllyDetail({
  ally,
  onEdit,
  onDuplicate,
  onDelete,
}: {
  ally: Monster;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  const [lightbox_index, set_lightbox_index] = useState<number | null>(null);
  const safe_ally = normalizeAlly(ally);
  const gallery = safe_ally.gallery ?? [];
  const { spells } = useSRDStore();

  return (
    <div>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: safe_ally.avatar
                ? `url(${safe_ally.avatar})`
                : '#22C55E',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              border: '2px solid #15803D',
              color: '#fff',
              fontWeight: 700,
              fontSize: 22,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {!safe_ally.avatar && safe_ally.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2>
              {safe_ally.name}
              <span className="text-text-tertiary text-[14px] ml-2 font-normal">
                · ally
              </span>
            </h2>
            <div className="text-[12px] text-text-tertiary">
              {safe_ally.size} {safe_ally.type} · CR {safe_ally.cr}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="bg-accent-50 border-accent-300 text-accent-900"
            style={{ fontSize: '12px', padding: '6px 12px' }}
          >
            Edit
          </button>
          <button
            onClick={onDuplicate}
            style={{ fontSize: '12px', padding: '6px 12px' }}
          >
            Duplicate
          </button>
          <button
            onClick={onDelete}
            style={{
              fontSize: '12px',
              padding: '6px 12px',
              color: 'var(--color-text-danger)',
              borderColor: 'var(--color-border-danger)',
            }}
          >
            Delete
          </button>
        </div>
      </div>

      {safe_ally.statblock_mode === 'character' && (
        <>
          <OriginFeaturesPanel selection={safe_ally.origin_selection} />
          <ClassFeaturesPanel build={safe_ally.character_build} />
        </>
      )}

      {/* Quick stats */}
      <div
        className="grid gap-2 mb-4"
        style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}
      >
        <Stat label="HP" value={String(safe_ally.hp ?? '—')} />
        <Stat label="AC" value={String(safe_ally.ac ?? '—')} />
        <Stat
          label="Speed"
          value={formatSpeed(safe_ally.speed)}
        />
        <Stat
          label="Init"
          value={
            safe_ally.initiative && safe_ally.initiative.modifier !== null
              ? `${safe_ally.initiative.modifier >= 0 ? '+' : ''}${safe_ally.initiative.modifier}`
              : '+0'
          }
        />
      </div>

      {/* Abilities */}
      <div className="mb-4">
        <div className="text-[12px] font-medium text-text-secondary mb-2">
          Ability scores
        </div>
        <div
          className="grid gap-2"
          style={{ gridTemplateColumns: 'repeat(6, minmax(0, 1fr))' }}
        >
          {(['str', 'dex', 'con', 'int', 'wis', 'cha'] as const).map((ab) => {
            const a = safe_ally.abilities[ab];
            return (
              <div
                key={ab}
                style={{
                  padding: '6px 4px',
                  background: 'var(--color-background-primary)',
                  border: '0.5px solid var(--color-border-tertiary)',
                  borderRadius: 'var(--border-radius-md)',
                  textAlign: 'center',
                }}
              >
                <div className="text-[10px] uppercase tracking-wider text-text-tertiary">
                  {ab}
                </div>
                <div className="text-[13px] font-medium">{a.score}</div>
                <div className="text-[11px] text-text-secondary">
                  ({a.modifier >= 0 ? '+' : ''}
                  {a.modifier})
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {safe_ally.spellcasting && (
        <SpellcastingBlock ally={safe_ally} spells={spells} />
      )}

      {/* Traits & actions */}
      {safe_ally.traits.length > 0 && (
        <FeatureBlock title="Traits" features={safe_ally.traits} />
      )}
      {safe_ally.actions.length > 0 && (
        <FeatureBlock title="Actions" features={safe_ally.actions} />
      )}
      {safe_ally.bonus_actions.length > 0 && (
        <FeatureBlock title="Bonus actions" features={safe_ally.bonus_actions} />
      )}
      {safe_ally.reactions.length > 0 && (
        <FeatureBlock title="Reactions" features={safe_ally.reactions} />
      )}
      {safe_ally.legendary_actions.length > 0 && (
        <FeatureBlock title="Legendary actions" features={safe_ally.legendary_actions} />
      )}

      {/* Gallery */}
      {gallery.length > 0 && (
        <div className="mt-6">
          <div className="text-[12px] font-medium text-text-secondary mb-2">
            Gallery
            <span className="text-text-tertiary ml-2 font-normal">
              ({gallery.length})
            </span>
          </div>
          <div
            className="grid gap-2"
            style={{
              gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            }}
          >
            {gallery.map((src, idx) => (
              <button
                key={idx}
                onClick={() => set_lightbox_index(idx)}
                style={{
                  position: 'relative',
                  aspectRatio: '4 / 3',
                  background: `url(${src}) center/cover no-repeat`,
                  borderRadius: 'var(--border-radius-md)',
                  border: '0.5px solid var(--color-border-tertiary)',
                  cursor: 'zoom-in',
                  padding: 0,
                }}
                title={`Open image ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {lightbox_index !== null && (
        <Lightbox
          images={gallery}
          index={lightbox_index}
          onClose={() => set_lightbox_index(null)}
          onNavigate={(new_index) => set_lightbox_index(new_index)}
        />
      )}
    </div>
  );
}


function formatSpellLevel(level: number): string {
  return level === 0 ? 'Cantrip' : `Level ${level}`;
}

function SpellcastingBlock({ ally, spells }: { ally: Monster; spells: Spell[] }) {
  const spellcasting = ally.spellcasting;
  if (!spellcasting) return null;
  const selected = spells
    .filter((spell) => spellcasting.spell_ids.includes(spell.id))
    .sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));
  const attack = spellcasting.attack_bonus;

  return (
    <div className="mb-4">
      <div className="text-[12px] font-medium text-text-secondary mb-2">
        Spellcasting
      </div>
      <div className="text-[12px] text-text-secondary mb-2">
        {spellcasting.ability && <span>Ability {spellcasting.ability.toUpperCase()}</span>}
        {spellcasting.save_dc !== undefined && <span> · Save DC {spellcasting.save_dc}</span>}
        {attack !== undefined && <span> · Spell attack {attack >= 0 ? '+' : ''}{attack}</span>}
        {spellcasting.caster_level !== undefined && <span> · Caster level {spellcasting.caster_level}</span>}
      </div>
      {spellcasting.notes && (
        <div className="text-[12px] text-text-secondary mb-2" style={{ whiteSpace: 'pre-wrap' }}>
          {spellcasting.notes}
        </div>
      )}
      {selected.length > 0 ? (
        <div className="flex flex-col gap-2">
          {selected.map((spell) => (
            <details
              key={spell.id}
              className="text-[12px] text-text-secondary"
              style={{
                padding: '8px 12px',
                background: 'var(--color-background-secondary)',
                borderRadius: 'var(--border-radius-sm)',
              }}
            >
              <summary style={{ cursor: 'pointer' }}>
                <strong className="text-text-primary font-medium">{spell.name}</strong>{' '}
                <span className="text-[10px] text-text-tertiary">
                  — {formatSpellLevel(spell.level)} · {spell.school}
                  {spell.concentration ? ' · Concentration' : ''}
                  {spell.ritual ? ' · Ritual' : ''}
                </span>
              </summary>
              <div className="mt-2 text-[11px] text-text-tertiary">
                {spell.casting_time ?? '—'} · {spell.range ?? '—'} · {spell.duration ?? '—'}
              </div>
              <div className="mt-2 text-[11px] leading-relaxed" style={{ whiteSpace: 'pre-wrap' }}>
                {spell.description}
              </div>
              {spell.higher_levels && (
                <div className="mt-2 text-[11px] leading-relaxed text-text-tertiary">
                  <strong>At higher levels:</strong> {spell.higher_levels}
                </div>
              )}
            </details>
          ))}
        </div>
      ) : (
        <div className="text-[12px] text-text-tertiary italic">No spells selected.</div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        padding: '8px 10px',
        background: 'var(--color-background-secondary)',
        border: '0.5px solid var(--color-border-tertiary)',
        borderRadius: 'var(--border-radius-md)',
      }}
    >
      <div className="text-[10px] text-text-tertiary uppercase tracking-wider">
        {label}
      </div>
      <div className="text-[14px] font-medium">{value}</div>
    </div>
  );
}

function FeatureBlock({
  title,
  features,
}: {
  title: string;
  features: { name: string; description: string }[];
}) {
  return (
    <div className="mb-4">
      <div className="text-[12px] font-medium text-text-secondary mb-2">
        {title}
      </div>
      <div className="flex flex-col gap-2">
        {features.map((f, i) => (
          <div key={i} className="text-[12px] leading-relaxed">
            <strong className="font-medium">{f.name}.</strong> {f.description}
          </div>
        ))}
      </div>
    </div>
  );
}


function formatSpeed(speed: MonsterSpeed | undefined): string {
  if (typeof speed === 'string') return speed.trim() || '—';
  if (!speed) return '—';
  const parts: string[] = [];
  if (speed.walk !== undefined) parts.push(`${speed.walk} ft`);
  for (const [mode, val] of Object.entries(speed)) {
    if (mode === 'walk') continue;
    parts.push(`${mode} ${val} ft`);
  }
  return parts.length > 0 ? parts.join(', ') : '—';
}
