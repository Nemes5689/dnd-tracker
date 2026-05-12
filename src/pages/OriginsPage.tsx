import { useMemo, useState } from 'react';
import { DND_2024_BACKGROUNDS, DND_2024_FEATS, DND_2024_SPECIES } from '@/data/originData';
import { getCombinedBackgrounds, getCombinedFeats, getCombinedSpecies, useOriginHomebrewStore, type CustomBackgroundInput, type CustomFeatInput, type CustomSpeciesInput } from '@/store/originHomebrewStore';
import type { BackgroundInfo, FeatInfo, SpeciesInfo } from '@/types/origins';

type Tab = 'backgrounds' | 'species' | 'feats';
type SourceFilter = 'all' | 'official' | 'custom';

const blankBackground = (): CustomBackgroundInput => ({ name: '', source: 'Custom', description: '', ability_scores: '', feat: '', skill_proficiencies: '', tool_proficiency: '', equipment: '' });
const blankSpecies = (): CustomSpeciesInput => ({ name: '', source: 'Custom', description: '', creature_type: 'Humanoid', size: '', speed: '30 feet', traits: '' });
const blankFeat = (): CustomFeatInput => ({ name: '', source: 'Custom', prerequisite: '', description: '' });

export function OriginsPage() {
  const [tab, setTab] = useState<Tab>('backgrounds');
  const [query, setQuery] = useState('');
  const [source, setSource] = useState<SourceFilter>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editing, setEditing] = useState<BackgroundInfo | SpeciesInfo | FeatInfo | null>(null);
  const [showForm, setShowForm] = useState(false);

  const store = useOriginHomebrewStore();
  const backgrounds = useMemo(() => getCombinedBackgrounds(store.custom_backgrounds), [store.custom_backgrounds]);
  const species = useMemo(() => getCombinedSpecies(store.custom_species), [store.custom_species]);
  const feats = useMemo(() => getCombinedFeats(store.custom_feats), [store.custom_feats]);

  const current = tab === 'backgrounds' ? backgrounds : tab === 'species' ? species : feats;
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return current.filter((item: any) => {
      if (source === 'official' && item.is_custom) return false;
      if (source === 'custom' && !item.is_custom) return false;
      if (!q) return true;
      return JSON.stringify(item).toLowerCase().includes(q);
    });
  }, [current, query, source]);
  const selected = current.find((item) => item.id === selectedId) ?? filtered[0];

  const newItem = () => { setEditing(null); setShowForm(true); };
  const editItem = (item: any) => { if (!item?.is_custom) return; setEditing(item); setShowForm(true); };
  const deleteItem = (item: any) => {
    if (!item?.is_custom) return;
    if (!confirm(`Delete custom ${tab.slice(0, -1)} "${item.name}"?`)) return;
    if (tab === 'backgrounds') store.deleteCustomBackground(item.id);
    if (tab === 'species') store.deleteCustomSpecies(item.id);
    if (tab === 'feats') store.deleteCustomFeat(item.id);
    setSelectedId(null);
  };

  const saveItem = (input: any) => {
    let id = editing?.id;
    if (tab === 'backgrounds') id = editing ? (store.updateCustomBackground(editing.id, input), editing.id) : store.addCustomBackground(input);
    if (tab === 'species') id = editing ? (store.updateCustomSpecies(editing.id, input), editing.id) : store.addCustomSpecies(input);
    if (tab === 'feats') id = editing ? (store.updateCustomFeat(editing.id, input), editing.id) : store.addCustomFeat(input);
    setSelectedId(id ?? null);
    setEditing(null);
    setShowForm(false);
  };

  return (
    <div className="page-padding max-w-7xl mx-auto">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Backgrounds / Species / Feats</h1>
          <p className="text-[13px] text-text-secondary max-w-3xl">Itt böngészhetők a feltöltött D&D 2024 background, species és feat adatok, és itt adhatsz hozzá custom változatokat. Ezek a karaktereknél és a character-like custom lényeknél is választhatók.</p>
          <div className="text-[11px] text-text-tertiary mt-1">Official: {DND_2024_BACKGROUNDS.length} backgrounds · {DND_2024_SPECIES.length} species · {DND_2024_FEATS.length} feats</div>
        </div>
        <button onClick={newItem} className="bg-accent-50 border-accent-300 text-accent-900 font-medium" style={{ padding: '8px 14px', fontSize: 13 }}>+ Add custom {tab.slice(0, -1)}</button>
      </div>

      <div className="flex gap-2 mb-4">
        {(['backgrounds', 'species', 'feats'] as Tab[]).map((name) => <button key={name} onClick={() => { setTab(name); setSelectedId(null); setShowForm(false); }} className={tab === name ? 'bg-accent-50 border-accent-300 text-accent-900' : ''} style={{ padding: '7px 12px', fontSize: 13, textTransform: 'capitalize' }}>{name}</button>)}
      </div>

      {showForm && <OriginForm tab={tab} initial={editing as any} onSubmit={saveItem} onCancel={() => { setShowForm(false); setEditing(null); }} />}

      <div className="grid gap-4" style={{ gridTemplateColumns: 'var(--master-wide) minmax(0, 1fr)' }}>
        <aside className="flex flex-col gap-2" style={{ border: '0.5px solid var(--color-border-tertiary)', borderRadius: 'var(--border-radius-lg)', background: 'var(--color-background-secondary)', padding: 12, alignSelf: 'start', position: 'sticky', top: 16, maxHeight: 'calc(100vh - 40px)' }}>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={`Search ${tab}...`} />
          <select value={source} onChange={(e) => setSource(e.target.value as SourceFilter)}>
            <option value="all">Official + custom</option>
            <option value="official">Official only</option>
            <option value="custom">Custom only</option>
          </select>
          <div className="text-[11px] text-text-tertiary">{filtered.length} matching · {tab === 'backgrounds' ? store.custom_backgrounds.length : tab === 'species' ? store.custom_species.length : store.custom_feats.length} custom</div>
          <div className="overflow-y-auto flex flex-col gap-1 pr-1">
            {filtered.map((item: any) => {
              const active = item.id === selected?.id;
              return <button key={item.id} onClick={() => setSelectedId(item.id)} className="text-left" style={{ padding: '8px 10px', minHeight: 52, borderRadius: 'var(--border-radius-md)', border: active ? '0.5px solid var(--color-border-secondary)' : '0.5px solid transparent', background: active ? 'var(--color-background-primary)' : 'transparent', textDecoration: 'none' }}><div className="text-[13px] font-medium text-text-primary flex justify-between gap-2"><span>{item.name}</span>{item.is_custom && <span className="text-[10px] text-text-info">custom</span>}</div><div className="text-[10px] text-text-tertiary">{item.source}{'prerequisite' in item && item.prerequisite ? ` · ${item.prerequisite}` : ''}</div></button>;
            })}
          </div>
        </aside>
        <main className="min-w-0">
          {selected ? <OriginDetails tab={tab} item={selected as any} onEdit={() => editItem(selected)} onDelete={() => deleteItem(selected)} /> : <div className="text-[13px] text-text-tertiary italic">No item selected.</div>}
        </main>
      </div>
    </div>
  );
}

function OriginDetails({ tab, item, onEdit, onDelete }: { tab: Tab; item: any; onEdit: () => void; onDelete: () => void }) {
  return <section style={{ border: '0.5px solid var(--color-border-tertiary)', borderRadius: 'var(--border-radius-lg)', background: 'var(--color-background-primary)', padding: 18 }}>
    <div className="flex items-start justify-between gap-4 mb-3"><div><h2 className="text-xl font-semibold mb-1">{item.name}</h2><div className="text-[12px] text-text-secondary">{item.source}{item.is_custom ? ' · Custom' : ''}</div></div>{item.is_custom && <div className="flex gap-2"><button onClick={onEdit} style={{ fontSize: 12, padding: '6px 10px' }}>Edit</button><button onClick={onDelete} className="text-danger" style={{ fontSize: 12, padding: '6px 10px' }}>Delete</button></div>}</div>
    {tab === 'backgrounds' && <div className="grid gap-2 mb-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))' }}><Meta label="Ability scores" value={item.ability_scores} /><Meta label="Feat" value={item.feat} /><Meta label="Skills" value={item.skill_proficiencies} /><Meta label="Tool" value={item.tool_proficiency} /><Meta label="Equipment" value={item.equipment} /></div>}
    {tab === 'species' && <div className="grid gap-2 mb-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))' }}><Meta label="Creature type" value={item.creature_type} /><Meta label="Size" value={item.size} /><Meta label="Speed" value={item.speed} /></div>}
    {tab === 'feats' && item.prerequisite && <div className="mb-4"><Meta label="Prerequisite" value={item.prerequisite} /></div>}
    <RichText text={[item.description, item.traits].filter(Boolean).join('\n\n')} />
  </section>;
}

function Meta({ label, value }: { label: string; value?: string }) { return <div style={{ border: '0.5px solid var(--color-border-tertiary)', borderRadius: 'var(--border-radius-md)', padding: 10, background: 'var(--color-background-secondary)' }}><div className="text-[10px] text-text-tertiary mb-1">{label}</div><div className="text-[12px] text-text-primary whitespace-pre-wrap">{value || '—'}</div></div>; }

type RichTextPart =
  | { type: 'paragraph'; text: string }
  | { type: 'table'; title?: string; rows: string[][] };

function splitTableRow(line: string): string[] | null {
  const trimmed = line.trim();
  if (!trimmed) return null;
  if (trimmed.includes('\t')) return trimmed.split('\t').map((cell) => cell.trim()).filter(Boolean);
  if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
    const cells = trimmed.slice(1, -1).split('|').map((cell) => cell.trim());
    const isSeparator = cells.every((cell) => /^:?-{3,}:?$/.test(cell));
    return isSeparator ? [] : cells;
  }
  return null;
}

function parseRichText(text: string): RichTextPart[] {
  const lines = text.replace(/\r/g, '').split('\n');
  const parts: RichTextPart[] = [];
  let paragraph: string[] = [];

  const flushParagraph = () => {
    const value = paragraph.join('\n').trim();
    if (value) parts.push({ type: 'paragraph', text: value });
    paragraph = [];
  };

  for (let i = 0; i < lines.length;) {
    const line = lines[i];
    const currentRow = splitTableRow(line);
    const nextRow = i + 1 < lines.length ? splitTableRow(lines[i + 1]) : null;

    const isTitleBeforeTable = !currentRow && line.trim() && nextRow && nextRow.length > 0;
    const startsTable = currentRow && currentRow.length > 0;

    if (isTitleBeforeTable || startsTable) {
      flushParagraph();
      const title = isTitleBeforeTable ? line.trim() : undefined;
      if (isTitleBeforeTable) i += 1;

      const rows: string[][] = [];
      while (i < lines.length) {
        const row = splitTableRow(lines[i]);
        if (!row) break;
        if (row.length > 0) rows.push(row);
        i += 1;
      }
      if (rows.length > 0) parts.push({ type: 'table', title, rows });
      continue;
    }

    if (!line.trim()) flushParagraph();
    else paragraph.push(line);
    i += 1;
  }

  flushParagraph();
  return parts;
}

function RichText({ text }: { text: string }) {
  const parts = parseRichText(text);
  return <div className="flex flex-col gap-3">{parts.map((part, idx) => {
    if (part.type === 'table') {
      const [header, ...body] = part.rows;
      return <div key={idx} className="overflow-x-auto">
        {part.title && <div className="text-[13px] font-semibold text-text-primary mb-2">{part.title}</div>}
        <table className="w-full text-[12px]" style={{ borderCollapse: 'collapse', minWidth: part.rows[0]?.length > 3 ? 620 : undefined }}>
          <thead>
            <tr>{header.map((cell, c) => <th key={c} className="text-left text-text-primary" style={{ border: '0.5px solid var(--color-border-tertiary)', padding: '7px 9px', background: 'var(--color-background-secondary)', fontWeight: 650, verticalAlign: 'top' }}>{cell}</th>)}</tr>
          </thead>
          <tbody>
            {body.map((row, r) => <tr key={r}>{header.map((_, c) => <td key={c} className="text-text-secondary" style={{ border: '0.5px solid var(--color-border-tertiary)', padding: '7px 9px', verticalAlign: 'top', whiteSpace: 'pre-wrap' }}>{row[c] || ''}</td>)}</tr>)}
          </tbody>
        </table>
      </div>;
    }
    return <div key={idx} className="text-[13px] text-text-secondary whitespace-pre-wrap leading-relaxed">{part.text}</div>;
  })}</div>;
}

function OriginForm({ tab, initial, onSubmit, onCancel }: { tab: Tab; initial?: any; onSubmit: (input: any) => void; onCancel: () => void }) {
  const [background, setBackground] = useState<CustomBackgroundInput>(() => initial && tab === 'backgrounds' ? initial : blankBackground());
  const [species, setSpecies] = useState<CustomSpeciesInput>(() => initial && tab === 'species' ? initial : blankSpecies());
  const [feat, setFeat] = useState<CustomFeatInput>(() => initial && tab === 'feats' ? initial : blankFeat());
  const save = () => {
    const input = tab === 'backgrounds' ? background : tab === 'species' ? species : feat;
    if (!input.name.trim()) { alert('Adj nevet.'); return; }
    onSubmit(input);
  };
  const title = `${initial ? 'Edit' : 'Add custom'} ${tab.slice(0, -1)}`;
  return <section className="mb-5" style={{ border: '0.5px solid var(--color-border-secondary)', borderRadius: 'var(--border-radius-lg)', background: 'var(--color-background-primary)', padding: 16 }}><h2 className="text-lg font-semibold mb-3">{title}</h2>
    {tab === 'backgrounds' && <div><div className="grid gap-3 mb-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>{(['name','source','ability_scores','feat','skill_proficiencies','tool_proficiency'] as const).map((key) => <label key={key} className="text-[12px]">{labelize(key)}<input className="w-full mt-1" value={(background as any)[key] ?? ''} onChange={(e) => setBackground((f) => ({ ...f, [key]: e.target.value }))} /></label>)}</div><label className="text-[12px] block mb-3">Equipment<textarea className="w-full mt-1" rows={2} value={background.equipment} onChange={(e) => setBackground((f) => ({ ...f, equipment: e.target.value }))} /></label><label className="text-[12px] block mb-3">Description<textarea className="w-full mt-1" rows={6} value={background.description} onChange={(e) => setBackground((f) => ({ ...f, description: e.target.value }))} /></label></div>}
    {tab === 'species' && <div><div className="grid gap-3 mb-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>{(['name','source','creature_type','size','speed'] as const).map((key) => <label key={key} className="text-[12px]">{labelize(key)}<input className="w-full mt-1" value={(species as any)[key] ?? ''} onChange={(e) => setSpecies((f) => ({ ...f, [key]: e.target.value }))} /></label>)}</div><label className="text-[12px] block mb-3">Description<textarea className="w-full mt-1" rows={5} value={species.description} onChange={(e) => setSpecies((f) => ({ ...f, description: e.target.value }))} /></label><label className="text-[12px] block mb-3">Traits<textarea className="w-full mt-1" rows={8} value={species.traits} onChange={(e) => setSpecies((f) => ({ ...f, traits: e.target.value }))} /></label></div>}
    {tab === 'feats' && <div><div className="grid gap-3 mb-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>{(['name','source','prerequisite'] as const).map((key) => <label key={key} className="text-[12px]">{labelize(key)}<input className="w-full mt-1" value={(feat as any)[key] ?? ''} onChange={(e) => setFeat((f) => ({ ...f, [key]: e.target.value }))} /></label>)}</div><label className="text-[12px] block mb-3">Description<textarea className="w-full mt-1" rows={10} value={feat.description} onChange={(e) => setFeat((f) => ({ ...f, description: e.target.value }))} /></label></div>}
    <div className="flex gap-2 justify-end"><button onClick={onCancel} style={{ padding: '7px 12px', fontSize: 13 }}>Cancel</button><button onClick={save} className="bg-accent-50 border-accent-300 text-accent-900 font-medium" style={{ padding: '7px 12px', fontSize: 13 }}>Save</button></div>
  </section>;
}

function labelize(value: string) { return value.replace(/_/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase()); }
