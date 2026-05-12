import { useEffect, useMemo, useState } from 'react';
import { useSRDStore, type CustomSpellInput } from '@/store/srdStore';
import type { Spell } from '@/types/srd';

const SCHOOLS = ['Abjuration', 'Conjuration', 'Divination', 'Enchantment', 'Evocation', 'Illusion', 'Necromancy', 'Transmutation'];
const CLASSES = ['Bard', 'Cleric', 'Druid', 'Paladin', 'Ranger', 'Sorcerer', 'Warlock', 'Wizard'];

function formatSpellLevel(level: number) {
  return level === 0 ? 'Cantrip' : `Level ${level}`;
}

function emptySpell(): CustomSpellInput {
  return {
    name: '',
    level: 0,
    school: 'Evocation',
    classes: [],
    casting_time: 'Action',
    ritual: false,
    range: '',
    components: { verbal: true, somatic: false, material: null },
    duration: '',
    concentration: false,
    description: '',
    higher_levels: null,
    cantrip_upgrade: null,
    source: 'Custom',
  };
}

export function SpellsPage() {
  const { loaded, loading, load, spells, custom_spells, addCustomSpell, updateCustomSpell, deleteCustomSpell } = useSRDStore();
  const [query, setQuery] = useState('');
  const [level, setLevel] = useState('all');
  const [classFilter, setClassFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Spell | null>(null);

  useEffect(() => { void load(); }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return spells.filter((spell) => {
      if (level !== 'all' && spell.level !== Number(level)) return false;
      if (classFilter !== 'all' && !spell.classes.some((cls) => cls.toLowerCase() === classFilter.toLowerCase())) return false;
      if (sourceFilter === 'custom' && !spell.is_custom) return false;
      if (sourceFilter === 'official' && spell.is_custom) return false;
      if (!q) return true;
      return (
        spell.name.toLowerCase().includes(q) ||
        spell.school.toLowerCase().includes(q) ||
        spell.classes.some((cls) => cls.toLowerCase().includes(q)) ||
        spell.description.toLowerCase().includes(q)
      );
    });
  }, [spells, query, level, classFilter, sourceFilter]);

  const selected = spells.find((spell) => spell.id === selectedId) ?? filtered[0];

  const startNew = () => {
    setEditing(null);
    setShowForm(true);
  };

  const startEdit = (spell: Spell) => {
    setEditing(spell);
    setShowForm(true);
  };

  const saveSpell = (input: CustomSpellInput) => {
    const id = editing ? editing.id : addCustomSpell(input);
    if (editing) updateCustomSpell(editing.id, input);
    setSelectedId(id);
    setShowForm(false);
    setEditing(null);
  };

  return (
    <div className="page-padding max-w-7xl mx-auto">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Spell Library</h1>
          <p className="text-[13px] text-text-secondary max-w-3xl">
            Itt kereshető az összes spell, és itt adhatsz hozzá custom spelleket. A custom spellek utána a karaktereknél, custom monstereknél és allies/summons spell pickerében is választhatók.
          </p>
        </div>
        <button
          onClick={startNew}
          className="bg-accent-50 border-accent-300 text-accent-900 font-medium"
          style={{ padding: '8px 14px', fontSize: 13 }}
        >
          + Add custom spell
        </button>
      </div>

      {showForm && (
        <SpellForm
          initial={editing ?? undefined}
          onSubmit={saveSpell}
          onCancel={() => { setShowForm(false); setEditing(null); }}
        />
      )}

      <div className="grid gap-4" style={{ gridTemplateColumns: 'var(--master-wide) minmax(0, 1fr)' }}>
        <aside
          className="flex flex-col gap-2"
          style={{
            border: '0.5px solid var(--color-border-tertiary)',
            borderRadius: 'var(--border-radius-lg)',
            background: 'var(--color-background-secondary)',
            padding: 12,
            alignSelf: 'start',
            position: 'sticky',
            top: 16,
            maxHeight: 'calc(100vh - 40px)',
          }}
        >
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search spells..." className="w-full" />
          <div className="grid gap-2" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <select value={level} onChange={(e) => setLevel(e.target.value)}>
              <option value="all">All levels</option>
              {Array.from({ length: 10 }, (_, i) => <option key={i} value={i}>{formatSpellLevel(i)}</option>)}
            </select>
            <select value={classFilter} onChange={(e) => setClassFilter(e.target.value)}>
              <option value="all">All classes</option>
              {CLASSES.map((cls) => <option key={cls} value={cls}>{cls}</option>)}
            </select>
          </div>
          <select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)}>
            <option value="all">Official + custom</option>
            <option value="official">Official only</option>
            <option value="custom">Custom only</option>
          </select>
          <div className="text-[11px] text-text-tertiary">
            {loading && !loaded ? 'Loading…' : `${filtered.length} matching spells · ${custom_spells.length} custom`}
          </div>
          <div className="overflow-y-auto flex flex-col gap-1 pr-1">
            {filtered.map((spell) => {
              const active = spell.id === selected?.id;
              return (
                <button
                  key={spell.id}
                  type="button"
                  onClick={() => setSelectedId(spell.id)}
                  className="text-left"
                  style={{
                    padding: '8px 10px',
                    minHeight: 48,
                    borderRadius: 'var(--border-radius-md)',
                    border: active ? '0.5px solid var(--color-border-secondary)' : '0.5px solid transparent',
                    background: active ? 'var(--color-background-primary)' : 'transparent',
                    textDecoration: 'none',
                  }}
                >
                  <div
                    className="text-[13px] font-medium text-text-primary flex justify-between gap-2"
                    style={{ textDecoration: 'none' }}
                  >
                    <span>{spell.name}</span>
                    {spell.is_custom && <span className="text-[10px] text-text-info">custom</span>}
                  </div>
                  <div
                    className="text-[10px] text-text-tertiary"
                    style={{ textDecoration: 'none', marginTop: 2 }}
                  >
                    {formatSpellLevel(spell.level)} · {spell.school}{spell.classes.length ? ` · ${spell.classes.join(', ')}` : ''}
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        <main className="min-w-0">
          {selected ? (
            <SpellDetails
              spell={selected}
              onEdit={() => selected.is_custom && startEdit(selected)}
              onDelete={() => {
                if (!selected.is_custom) return;
                if (!confirm(`Delete custom spell "${selected.name}"?`)) return;
                deleteCustomSpell(selected.id);
                setSelectedId(null);
              }}
            />
          ) : (
            <div className="text-[13px] text-text-tertiary italic">No spell selected.</div>
          )}
        </main>
      </div>
    </div>
  );
}

function SpellDetails({ spell, onEdit, onDelete }: { spell: Spell; onEdit: () => void; onDelete: () => void }) {
  const comps = [spell.components.verbal ? 'V' : '', spell.components.somatic ? 'S' : '', spell.components.material ? `M (${spell.components.material})` : ''].filter(Boolean).join(', ') || '—';
  return (
    <section style={{ border: '0.5px solid var(--color-border-tertiary)', borderRadius: 'var(--border-radius-lg)', background: 'var(--color-background-primary)', padding: 18 }}>
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <h2 className="text-xl font-semibold mb-1">{spell.name}</h2>
          <div className="text-[12px] text-text-secondary">
            {formatSpellLevel(spell.level)} · {spell.school}{spell.ritual ? ' · Ritual' : ''}{spell.concentration ? ' · Concentration' : ''}{spell.is_custom ? ' · Custom' : ''}
          </div>
        </div>
        {spell.is_custom && (
          <div className="flex gap-2">
            <button onClick={onEdit} style={{ fontSize: 12, padding: '6px 10px' }}>Edit</button>
            <button onClick={onDelete} className="text-danger" style={{ fontSize: 12, padding: '6px 10px' }}>Delete</button>
          </div>
        )}
      </div>
      <div className="grid gap-2 mb-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))' }}>
        <Meta label="Casting time" value={spell.casting_time ?? '—'} />
        <Meta label="Range" value={spell.range ?? '—'} />
        <Meta label="Duration" value={spell.duration ?? '—'} />
        <Meta label="Components" value={comps} />
        <Meta label="Classes" value={spell.classes.join(', ') || '—'} />
        <Meta label="Source" value={spell.source || '—'} />
      </div>
      <TextBlock text={spell.description} />
      {spell.higher_levels && <div className="mt-4"><div className="text-[12px] font-medium mb-1">At higher levels</div><TextBlock text={spell.higher_levels} /></div>}
      {spell.cantrip_upgrade && <div className="mt-4"><div className="text-[12px] font-medium mb-1">Cantrip upgrade</div><TextBlock text={spell.cantrip_upgrade} /></div>}
    </section>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return <div style={{ border: '0.5px solid var(--color-border-tertiary)', borderRadius: 'var(--border-radius-md)', padding: 10, background: 'var(--color-background-secondary)' }}><div className="text-[10px] text-text-tertiary mb-1">{label}</div><div className="text-[12px] text-text-primary">{value}</div></div>;
}

function TextBlock({ text }: { text: string }) {
  return <div className="text-[13px] text-text-secondary whitespace-pre-wrap leading-relaxed">{text || 'No description.'}</div>;
}

function SpellForm({ initial, onSubmit, onCancel }: { initial?: Spell; onSubmit: (input: CustomSpellInput) => void; onCancel: () => void }) {
  const [form, setForm] = useState<CustomSpellInput>(() => initial ? { ...initial, components: { ...initial.components } } : emptySpell());
  const classText = form.classes.join(', ');

  const patch = (next: Partial<CustomSpellInput>) => setForm((current) => ({ ...current, ...next }));
  const patchComponents = (next: Partial<CustomSpellInput['components']>) => setForm((current) => ({ ...current, components: { ...current.components, ...next } }));

  const save = () => {
    if (!form.name.trim()) { alert('Adj nevet a spellnek.'); return; }
    if (!form.description.trim()) { alert('Adj leírást a spellnek.'); return; }
    onSubmit({ ...form, classes: classText.split(',').map((x) => x.trim()).filter(Boolean) });
  };

  return (
    <section className="mb-5" style={{ border: '0.5px solid var(--color-border-secondary)', borderRadius: 'var(--border-radius-lg)', background: 'var(--color-background-primary)', padding: 16 }}>
      <h2 className="text-lg font-semibold mb-3">{initial ? 'Edit custom spell' : 'Add custom spell'}</h2>
      <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <label className="text-[12px]">Name<input className="w-full mt-1" value={form.name} onChange={(e) => patch({ name: e.target.value })} /></label>
        <label className="text-[12px]">Level<select className="w-full mt-1" value={form.level} onChange={(e) => patch({ level: Number(e.target.value) })}>{Array.from({ length: 10 }, (_, i) => <option key={i} value={i}>{formatSpellLevel(i)}</option>)}</select></label>
        <label className="text-[12px]">School<select className="w-full mt-1" value={form.school} onChange={(e) => patch({ school: e.target.value })}>{SCHOOLS.map((s) => <option key={s} value={s}>{s}</option>)}</select></label>
        <label className="text-[12px]">Classes<input className="w-full mt-1" value={classText} onChange={(e) => patch({ classes: e.target.value.split(',').map((x) => x.trim()).filter(Boolean) })} placeholder="Wizard, Sorcerer" /></label>
        <label className="text-[12px]">Casting time<input className="w-full mt-1" value={form.casting_time ?? ''} onChange={(e) => patch({ casting_time: e.target.value })} /></label>
        <label className="text-[12px]">Range<input className="w-full mt-1" value={form.range ?? ''} onChange={(e) => patch({ range: e.target.value })} /></label>
        <label className="text-[12px]">Duration<input className="w-full mt-1" value={form.duration ?? ''} onChange={(e) => patch({ duration: e.target.value })} /></label>
        <label className="text-[12px]">Source<input className="w-full mt-1" value={form.source ?? 'Custom'} onChange={(e) => patch({ source: e.target.value })} /></label>
      </div>
      <div className="flex flex-wrap gap-4 my-3 text-[12px]">
        <label><input type="checkbox" checked={form.ritual} onChange={(e) => patch({ ritual: e.target.checked })} /> Ritual</label>
        <label><input type="checkbox" checked={form.concentration} onChange={(e) => patch({ concentration: e.target.checked })} /> Concentration</label>
        <label><input type="checkbox" checked={form.components.verbal} onChange={(e) => patchComponents({ verbal: e.target.checked })} /> V</label>
        <label><input type="checkbox" checked={form.components.somatic} onChange={(e) => patchComponents({ somatic: e.target.checked })} /> S</label>
      </div>
      <label className="text-[12px] block mb-3">Material component<input className="w-full mt-1" value={form.components.material ?? ''} onChange={(e) => patchComponents({ material: e.target.value })} /></label>
      <label className="text-[12px] block mb-3">Description<textarea className="w-full mt-1" rows={6} value={form.description} onChange={(e) => patch({ description: e.target.value })} /></label>
      <label className="text-[12px] block mb-3">At higher levels<textarea className="w-full mt-1" rows={3} value={form.higher_levels ?? ''} onChange={(e) => patch({ higher_levels: e.target.value })} /></label>
      <label className="text-[12px] block mb-4">Cantrip upgrade<textarea className="w-full mt-1" rows={3} value={form.cantrip_upgrade ?? ''} onChange={(e) => patch({ cantrip_upgrade: e.target.value })} /></label>
      <div className="flex gap-2 justify-end">
        <button onClick={onCancel} style={{ padding: '7px 12px', fontSize: 13 }}>Cancel</button>
        <button onClick={save} className="bg-accent-50 border-accent-300 text-accent-900 font-medium" style={{ padding: '7px 12px', fontSize: 13 }}>Save spell</button>
      </div>
    </section>
  );
}
