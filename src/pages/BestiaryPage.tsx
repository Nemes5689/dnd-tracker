import { useEffect, useMemo, useState } from 'react';
import { useSRDStore } from '@/store/srdStore';
import { useCustomMonsterStore } from '@/store/customMonsterStore';
import { CustomMonsterForm } from '@/components/bestiary/CustomMonsterForm';
import { Lightbox } from '@/components/common/Lightbox';
import { ClassFeaturesPanel } from '@/components/characters/ClassFeaturesPanel';
import { OriginFeaturesPanel, formatOriginSummary } from '@/components/characters/OriginEditor';
import { formatCharacterBuildSummary } from '@/components/characters/ClassBuildEditor';
import type { MonsterSpeed, Monster, Spell } from '@/types/srd';

export function BestiaryPage() {
  const { loaded, loading, monsters: srd_monsters, load } = useSRDStore();
  const { monsters: custom_monsters, deleteMonster } = useCustomMonsterStore();

  const [search, setSearch] = useState('');
  const [crFilter, setCrFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [source_filter, set_source_filter] = useState<'all' | 'srd' | 'custom'>('all');
  const [selected, setSelected] = useState<Monster | null>(null);
  const [show_form, set_show_form] = useState(false);
  const [duplicate_source, set_duplicate_source] = useState<Monster | null>(null);
  const [edit_id, set_edit_id] = useState<string | null>(null);

  useEffect(() => {
    if (!loaded) load();
  }, [loaded, load]);

  const all_monsters: Monster[] = useMemo(
    () => [...custom_monsters, ...srd_monsters],
    [custom_monsters, srd_monsters]
  );

  const allTypes = useMemo(() => {
    const types = new Set<string>();
    all_monsters.forEach((m) => m.type && types.add(m.type));
    return Array.from(types).sort();
  }, [all_monsters]);

  const filtered = useMemo(() => {
    return all_monsters.filter((m) => {
      if (search && !m.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (crFilter !== 'all' && m.cr !== crFilter) return false;
      if (typeFilter !== 'all' && m.type !== typeFilter) return false;
      if (source_filter === 'srd' && m.source === 'Custom') return false;
      if (source_filter === 'custom' && m.source !== 'Custom') return false;
      return true;
    });
  }, [all_monsters, search, crFilter, typeFilter, source_filter]);

  useEffect(() => {
    if (!selected && filtered.length > 0) setSelected(filtered[0]);
    else if (selected && !filtered.find((m) => m.id === selected.id)) {
      setSelected(filtered[0] ?? null);
    }
  }, [filtered, selected]);

  const handleDuplicate = () => {
    if (!selected) return;
    set_edit_id(null);
    set_duplicate_source(selected);
    set_show_form(true);
  };

  const handleEdit = () => {
    if (!selected || selected.source !== 'Custom') return;
    set_edit_id(selected.id);
    set_duplicate_source(selected);
    set_show_form(true);
  };

  const handleDeleteSelected = () => {
    if (!selected || selected.source !== 'Custom') return;
    if (!confirm(`Delete custom monster "${selected.name}"?`)) return;
    deleteMonster(selected.id);
    setSelected(null);
  };

  if (loading) return <div className="p-8 text-text-secondary">Loading SRD data…</div>;
  if (!loaded) return <div className="p-8 text-text-secondary">Initializing…</div>;

  return (
    <>
      <div className="grid h-full" style={{ gridTemplateColumns: '320px 1fr' }}>
        <div className="border-r border-border-tertiary bg-bg-primary p-4 flex flex-col overflow-hidden">
          <div className="flex justify-between items-center mb-3">
            <h2>Bestiary</h2>
            <button
              onClick={() => {
                set_duplicate_source(null);
                set_show_form(true);
              }}
              style={{ fontSize: '12px', padding: '4px 10px' }}
            >
              + Custom
            </button>
          </div>

          <input
            type="text"
            placeholder="Search monsters..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-2"
          />

          <div className="flex gap-1 mb-2">
            {(['all', 'srd', 'custom'] as const).map((src) => {
              const count =
                src === 'all'
                  ? all_monsters.length
                  : src === 'srd'
                  ? srd_monsters.length
                  : custom_monsters.length;
              const active = source_filter === src;
              return (
                <button
                  key={src}
                  onClick={() => set_source_filter(src)}
                  style={{
                    flex: 1,
                    fontSize: '11px',
                    padding: '4px 8px',
                    background: active ? 'var(--color-background-info)' : undefined,
                    borderColor: active ? 'var(--color-border-info)' : undefined,
                    color: active ? 'var(--color-text-info)' : undefined,
                  }}
                >
                  {src === 'all' ? 'All' : src === 'srd' ? 'SRD' : 'Custom'} ({count})
                </button>
              );
            })}
          </div>

          <div className="flex gap-2 mb-3">
            <select
              value={crFilter}
              onChange={(e) => setCrFilter(e.target.value)}
              style={{ fontSize: '11px', height: '28px', flex: 1 }}
            >
              <option value="all">All CR</option>
              {['0', '1/8', '1/4', '1/2', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '12', '15', '17', '20', '24'].map((cr) => (
                <option key={cr} value={cr}>CR {cr}</option>
              ))}
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              style={{ fontSize: '11px', height: '28px', flex: 1 }}
            >
              <option value="all">All types</option>
              {allTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="flex-1 overflow-y-auto -mx-1 px-1">
            <div className="text-[10px] text-text-tertiary mb-1 px-2">
              Showing {filtered.length}
            </div>
            {filtered.map((m) => {
              const isSelected = selected?.id === m.id;
              const is_custom = m.source === 'Custom';
              return (
                <button
                  key={m.id}
                  onClick={() => setSelected(m)}
                  className="w-full text-left mb-1"
                  style={{
                    padding: '10px 12px',
                    borderRadius: 'var(--border-radius-md)',
                    borderLeft: isSelected ? '3px solid #534AB7' : '3px solid transparent',
                    background: isSelected ? 'var(--color-background-secondary)' : 'transparent',
                    border: isSelected ? undefined : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  {/* Avatar — only shown if custom monster has one */}
                  {is_custom && m.avatar && (
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        background: `url(${m.avatar}) center/cover no-repeat`,
                        border: '1.5px solid #7F1D1D',
                        flexShrink: 0,
                      }}
                    />
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="flex justify-between items-baseline">
                      <span className={`text-[13px] ${is_custom ? 'italic' : ''} ${isSelected ? 'font-medium' : ''}`}>
                        {m.name}
                      </span>
                      <span className="text-[11px] text-text-tertiary">CR {m.cr}</span>
                    </div>
                    <div className="text-[11px] text-text-tertiary">
                      {is_custom && !m.avatar && '★ '}
                      {m.size} {m.type}
                      {m.alignment && ` · ${m.alignment}`}
                    </div>
                    {m.statblock_mode === 'character' && (
                      <div className="text-[10px] text-text-info truncate">
                        {[formatCharacterBuildSummary(m.character_build), formatOriginSummary(m.origin_selection)].filter(Boolean).join(' · ') || 'Character-like'}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="overflow-y-auto p-7">
          {selected ? (
            <MonsterDetail
              monster={selected}
              onDuplicate={handleDuplicate}
              onEdit={selected.source === 'Custom' ? handleEdit : undefined}
              onDelete={selected.source === 'Custom' ? handleDeleteSelected : undefined}
            />
          ) : (
            <div>Select a monster</div>
          )}
        </div>
      </div>

      {show_form && (
        <CustomMonsterForm
          initial={duplicate_source ?? undefined}
          edit_id={edit_id ?? undefined}
          onClose={() => {
            set_show_form(false);
            set_duplicate_source(null);
            set_edit_id(null);
          }}
          onSaved={(id) => {
            setTimeout(() => {
              const newMon = useCustomMonsterStore.getState().monsters.find((m) => m.id === id);
              if (newMon) setSelected(newMon);
            }, 50);
          }}
        />
      )}
    </>
  );
}

function MonsterDetail({
  monster,
  onDuplicate,
  onEdit,
  onDelete,
}: {
  monster: Monster;
  onDuplicate: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  const is_custom = monster.source === 'Custom';
  const [lightbox_index, set_lightbox_index] = useState<number | null>(null);
  const gallery = monster.gallery ?? [];
  const { spells } = useSRDStore();

  return (
    <div>
      <div className="flex justify-between items-start mb-1">
        <div className="flex items-center gap-3">
          {/* Avatar — only shown if there's actually an avatar (so SRD entries
              without one don't get a placeholder taking up space) */}
          {monster.avatar && (
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: `url(${monster.avatar}) center/cover no-repeat`,
                border: is_custom
                  ? '2px solid #7F1D1D'
                  : '2px solid var(--color-border-tertiary)',
                flexShrink: 0,
              }}
            />
          )}
          <h2 style={{ margin: 0 }}>
            {monster.name}
            {is_custom && (
              <span className="text-text-tertiary text-[14px] ml-2">
                ★ custom
              </span>
            )}
          </h2>
        </div>
        <div className="flex gap-2">
          {onEdit && (
            <button onClick={onEdit} className="bg-accent-50 border-accent-300 text-accent-900" style={{ fontSize: '12px', padding: '6px 12px' }}>
              Edit
            </button>
          )}
          <button onClick={onDuplicate} style={{ fontSize: '12px', padding: '6px 12px' }}>
            {is_custom ? 'Duplicate' : 'Duplicate as custom'}
          </button>
          {onDelete && (
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
          )}
        </div>
      </div>
      <div className="text-[12px] text-text-secondary mb-4">
        {monster.size} {monster.type}
        {monster.subtype && ` (${monster.subtype})`} · {monster.alignment} · CR {monster.cr}
        {monster.xp && ` (XP ${monster.xp.toLocaleString()})`}
      </div>

      {monster.statblock_mode === 'character' && (
        <>
          <OriginFeaturesPanel selection={monster.origin_selection} />
          <ClassFeaturesPanel build={monster.character_build} />
        </>
      )}

      <div className="grid gap-2 mb-4" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
        {[
          { label: 'HP', value: monster.hp ?? '—' },
          { label: 'AC', value: monster.ac ?? '—' },
          { label: 'Speed', value: formatSpeed(monster.speed) },
          {
            label: 'Init',
            value: monster.initiative && monster.initiative.modifier !== null
              ? `${monster.initiative.modifier >= 0 ? '+' : ''}${monster.initiative.modifier}`
              : '—',
          },
          { label: 'PP', value: monster.passive_perception ?? '—' },
        ].map((s) => (
          <div key={s.label} className="bg-bg-secondary text-center" style={{ padding: '10px', borderRadius: 'var(--border-radius-md)' }}>
            <div className="text-[11px] text-text-secondary">{s.label}</div>
            <div className="text-[14px] font-medium">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-2 mb-4" style={{ gridTemplateColumns: 'repeat(6, 1fr)' }}>
        {(['str', 'dex', 'con', 'int', 'wis', 'cha'] as const).map((ab) => {
          const a = monster.abilities[ab];
          return (
            <div key={ab} className="bg-bg-primary text-center" style={{ padding: '8px', border: '0.5px solid var(--color-border-tertiary)', borderRadius: 'var(--border-radius-md)' }}>
              <div className="text-[10px] text-text-tertiary">{ab.toUpperCase()}</div>
              <div className="text-[13px] font-medium">
                {a.score} ({a.modifier >= 0 ? '+' : ''}{a.modifier})
              </div>
              <div className="text-[10px] text-text-tertiary">
                save {monster.saves[ab] >= 0 ? '+' : ''}{monster.saves[ab]}
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-[12px] leading-7 text-text-secondary mb-4">
        {Object.keys(monster.skills).length > 0 && (
          <div>
            <strong className="text-text-primary font-medium">Skills</strong>{' '}
            {Object.entries(monster.skills).map(([s, b]) => `${s} ${b >= 0 ? '+' : ''}${b}`).join(', ')}
          </div>
        )}
        {monster.damage_resistances.length > 0 && (
          <div><strong className="text-text-primary font-medium">Resistances</strong> {monster.damage_resistances.join(', ')}</div>
        )}
        {monster.damage_immunities.length > 0 && (
          <div><strong className="text-text-primary font-medium">Immunities</strong> {monster.damage_immunities.join(', ')}</div>
        )}
        {Object.keys(monster.senses).length > 0 && (
          <div>
            <strong className="text-text-primary font-medium">Senses</strong>{' '}
            {Object.entries(monster.senses).map(([k, v]) => `${k} ${v} ft`).join(', ')}
            {monster.passive_perception && `; Passive Perception ${monster.passive_perception}`}
          </div>
        )}
        {monster.languages.length > 0 && (
          <div><strong className="text-text-primary font-medium">Languages</strong> {monster.languages.join(', ')}</div>
        )}
      </div>

      {monster.spellcasting && (
        <SpellcastingSection monster={monster} spells={spells} />
      )}

      <FeatureSection title="Traits" features={monster.traits} />
      <FeatureSection title="Actions" features={monster.actions} />
      <FeatureSection title="Bonus Actions" features={monster.bonus_actions} />
      <FeatureSection title="Reactions" features={monster.reactions} />
      <FeatureSection title="Legendary Actions" features={monster.legendary_actions} />

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

function SpellcastingSection({ monster, spells }: { monster: Monster; spells: Spell[] }) {
  const spellcasting = monster.spellcasting;
  if (!spellcasting) return null;
  const selected = spells
    .filter((spell) => spellcasting.spell_ids.includes(spell.id))
    .sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));
  const attack = spellcasting.attack_bonus;

  return (
    <div className="mb-4">
      <h3 className="text-[13px] font-medium mb-2">Spellcasting</h3>
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

function FeatureSection({
  title,
  features,
}: {
  title: string;
  features: { name: string; description: string }[];
}) {
  if (features.length === 0) return null;
  return (
    <div className="mb-4">
      <h3 className="text-[13px] font-medium mb-2">{title}</h3>
      <div className="space-y-2">
        {features.map((f) => (
          <div key={f.name} className="text-[12px] leading-relaxed text-text-secondary">
            <strong className="text-text-primary font-medium">{f.name}.</strong> {f.description}
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
