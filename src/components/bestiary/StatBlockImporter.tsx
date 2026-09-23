import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useDialogFocus } from '@/hooks/useDialogFocus';
import { useCustomMonsterStore } from '@/store/customMonsterStore';
import { useAlliesStore } from '@/store/alliesStore';
import { useSRDStore } from '@/store/srdStore';
import { FeatureSection } from './CustomMonsterForm';
import { ABILITIES, FEATURE_SECTIONS, TEXT_FIELDS, MAX_STAT_BLOCK_LENGTH, parseStatBlock, validateDraft, draftToMonster, type ImportDraft, type ParseResult, type TextField } from '@/utils/statBlockImport';
import type { Monster } from '@/types/srd';

const labels: Record<TextField, string> = {
  name: 'Name', size: 'Size', type: 'Creature type', alignment: 'Alignment', ac: 'AC', hp: 'HP', hp_formula: 'Hit dice / HP formula',
  speed: 'Movement speeds (keep qualifiers)', initiative: 'Initiative modifier', cr: 'Challenge rating', xp: 'XP',
  passive_perception: 'Passive Perception', saves: 'Saving throws', skills: 'Skills', senses: 'Senses', languages: 'Languages',
  damage_resistances: 'Damage resistances', damage_immunities: 'Damage immunities', damage_vulnerabilities: 'Damage vulnerabilities',
  condition_immunities: 'Condition immunities', gear: 'Gear',
};
const required = new Set(['name', 'size', 'type', 'ac', 'hp', 'speed', 'initiative', 'cr', 'passive_perception']);
const sectionLabel = (key: string) => key.replace(/_/g, ' ').replace(/^./, c => c.toUpperCase());

interface Props {
  destination: 'monster' | 'ally';
  onClose: () => void;
  onSaved: (id: string) => void;
  renderPreview: (monster: Monster) => ReactNode;
}

export function StatBlockImporter({ destination, onClose, onSaved, renderPreview }: Props) {
  const [source, setSource] = useState('');
  const [result, setResult] = useState<ParseResult | null>(null);
  const [draft, setDraft] = useState<ImportDraft | null>(null);
  const [step, setStep] = useState<'paste' | 'review'>('paste');
  const [message, setMessage] = useState('');
  const [keepNotes, setKeepNotes] = useState(false);
  const [reviewed, setReviewed] = useState(false);
  const [duplicateAccepted, setDuplicateAccepted] = useState(false);
  const saving = useRef(false);
  const [busy, setBusy] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const library = destination === 'ally' ? 'Allies & Summons' : 'Monsters';
  const monsters = useCustomMonsterStore(state => state.monsters);
  const allies = useAlliesStore(state => state.allies);
  const srd = useSRDStore(state => state.monsters);
  const close = () => {
    if (saving.current) return;
    if ((source.trim() || draft) && !window.confirm('Discard this unsaved import? No library records have been changed.')) return;
    onClose();
  };
  const dialogRef = useDialogFocus(close);
  useEffect(() => { if (step === 'review') { heading.current?.focus(); dialogRef.current?.scrollTo({ top: 0 }); } }, [step, dialogRef]);
  const errors = useMemo(() => draft ? validateDraft(draft) : {}, [draft]);
  const duplicate = !!draft && (destination === 'ally' ? allies : [...monsters, ...srd])
    .some(item => item.name.trim().toLocaleLowerCase() === draft.name.trim().toLocaleLowerCase());
  const preview = useMemo(() => {
    if (!draft || Object.keys(errors).length) return null;
    return { ...draftToMonster(draft, true), id: 'unsaved-import-preview' };
  }, [draft, errors]);

  const update = (next: ImportDraft) => {
    setDraft(next); setReviewed(false); setMessage('');
    if (next.name !== draft?.name) setDuplicateAccepted(false);
    if (next.unparsed !== draft?.unparsed) setKeepNotes(false);
  };
  const parse = () => {
    if (draft && !window.confirm('Reparse and replace your current field edits? Cancel keeps your reviewed draft.')) return;
    const parsed = parseStatBlock(source);
    if (parsed.errors.length) { setMessage(parsed.errors.join(' ')); return; }
    setResult(parsed); setDraft(parsed.draft); setReviewed(false); setKeepNotes(false); setDuplicateAccepted(false); setMessage(''); setStep('review');
  };
  const canSave = !!draft && !!preview && reviewed && (!draft.unparsed.trim() || keepNotes) && (!duplicate || duplicateAccepted) && !busy;
  const save = () => {
    if (saving.current || !canSave || !draft) return;
    saving.current = true; setBusy(true);
    const id = `import-${crypto.randomUUID()}`;
    try {
      const creature = { ...draftToMonster(draft, keepNotes), id };
      if (destination === 'ally') useAlliesStore.getState().addAlly(creature);
      else useCustomMonsterStore.getState().addMonster(creature);
    } catch {
      // Zustand updates memory before localStorage. Roll back only our new ID
      // if persistence fails (e.g. quota), leaving all pre-existing rows intact.
      try {
        if (destination === 'ally') useAlliesStore.getState().deleteAlly(id);
        else useCustomMonsterStore.getState().deleteMonster(id);
      } catch { /* storage may still be unavailable; memory rollback already ran */ }
      saving.current = false; setBusy(false);
      setMessage('Could not save this import. Your draft is still here. Check browser storage space and try again.');
      return;
    }
    onSaved(id); onClose();
  };

  return (
    <div className="stat-import-overlay">
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="stat-import-title" tabIndex={-1} className="stat-import combat-dialog">
        <header className="stat-import-header">
          <div><div className="command-eyebrow">Destination: {library} · Unsaved draft</div><h2 id="stat-import-title">Paste stat block</h2></div>
          <button type="button" aria-label="Close importer" onClick={close}>×</button>
        </header>
        <p>One English 5e-style creature at a time. Local parsing only—no uploads or AI service. Review every value before saving.</p>
        {message && <div role="alert" id="import-error" className="import-warning">{message}</div>}
        {step === 'paste' ? (
          <>
            <label htmlFor="stat-import-source">Stat block text</label>
            <textarea id="stat-import-source" rows={14} value={source} aria-describedby={message ? 'import-input-help import-error' : 'import-input-help'}
              aria-invalid={!!message}
              onPaste={event => {
                if (event.clipboardData.getData('text/plain').length > MAX_STAT_BLOCK_LENGTH) {
                  event.preventDefault(); setMessage('Paste rejected: maximum 50,000 characters. Existing text was kept.');
                }
              }}
              onChange={event => {
                if (event.target.value.length > MAX_STAT_BLOCK_LENGTH) { setMessage('Maximum 50,000 characters. Existing text was kept.'); return; }
                setSource(event.target.value); setMessage('');
              }} />
            <p id="import-input-help">{source.length.toLocaleString()} / 50,000 characters. Maximum 2,000 lines and 4,000 characters per line. No images, PDFs, links to fetch, or bulk imports.</p>
            <div className="stat-import-buttons">
              <button type="button" className="command-primary" onClick={parse}>{draft ? 'Reparse text…' : 'Parse stat block'}</button>
              {draft && <button type="button" onClick={() => { setStep('review'); setMessage(''); }}>Return to current draft</button>}
              <button type="button" onClick={close}>Cancel</button>
            </div>
          </>
        ) : draft && result && (
          <>
            <h3 ref={heading} tabIndex={-1}>Review before saving to {library}</h3>
            <p>Blank means unknown—not zero. Ability modifiers are calculated from the scores you review. Required fields include initiative and passive Perception so the library cannot silently supply defaults.</p>
            <details className="import-original"><summary>Original pasted text</summary><pre>{result.original}</pre></details>
            {result.warnings.length > 0 && <div className="import-warning"><strong>Review warnings (from the original parse)</strong><ul>{result.warnings.map(w => <li key={w}>{w}</li>)}</ul></div>}
            <div role="status">{Object.keys(errors).length ? `${Object.keys(errors).length} fields need correction before preview and save.` : 'Required fields are valid. Check the preview and confirm below.'}</div>
            {errors.draft && <p role="alert">{errors.draft}</p>}
            <div className="stat-import-review">
              <section aria-label="Editable extracted fields">
                <div className="stat-import-fields">
                  {TEXT_FIELDS.map(key => (
                    <label key={key} htmlFor={`import-${key}`}>{labels[key]}{required.has(key) ? ' *' : ''}
                      <input id={`import-${key}`} value={draft[key]} aria-required={required.has(key)} aria-invalid={!!errors[key]} aria-describedby={errors[key] ? `import-${key}-error` : undefined}
                        onChange={event => update({ ...draft, [key]: event.target.value })} />
                      {errors[key] && <span id={`import-${key}-error`} className="import-field-error">{errors[key]}</span>}
                    </label>
                  ))}
                </div>
                <fieldset><legend>Ability scores (not modifiers)</legend><div className="stat-import-fields">
                  {ABILITIES.map(key => <label key={key} htmlFor={`import-ability-${key}`}>{key.toUpperCase()} score *
                    <input id={`import-ability-${key}`} inputMode="numeric" value={draft.abilities[key]} aria-required="true" aria-invalid={!!errors[`abilities.${key}`]} aria-describedby={errors[`abilities.${key}`] ? `import-ability-${key}-error` : undefined}
                      onChange={event => update({ ...draft, abilities: { ...draft.abilities, [key]: event.target.value } })} />
                    {errors[`abilities.${key}`] && <span id={`import-ability-${key}-error`} className="import-field-error">{errors[`abilities.${key}`]}</span>}
                  </label>)}
                </div></fieldset>
                {FEATURE_SECTIONS.map(key => <FeatureSection key={key} title={sectionLabel(key)} features={draft[key]} onChange={features => update({ ...draft, [key]: features })} add_label={`+ ${sectionLabel(key)}`} />)}
                <label htmlFor="import-unparsed">Unparsed text / Import notes</label>
                <textarea id="import-unparsed" rows={5} value={draft.unparsed} onChange={event => update({ ...draft, unparsed: event.target.value })} />
                <p>Move uncertain material into the correct fields, or keep it here as an “Import notes” trait. Removing text here is an explicit edit; the original remains available above.</p>
              </section>
              <section className="stat-import-preview" aria-label="Formatted stat-block preview">
                <h3>Preview · {library}</h3>
                <p>Unsaved. Spellcasting remains descriptive text; no spells or attack automation are inferred.</p>
                {preview ? renderPreview(preview) : <p>Complete the highlighted required fields to show the formatted preview. Nothing has been saved.</p>}
              </section>
            </div>
            <footer className="stat-import-footer">
              {!!draft.unparsed.trim() && <label><input type="checkbox" checked={keepNotes} onChange={event => setKeepNotes(event.target.checked)} /> Keep the reviewed unparsed text as an Import notes trait.</label>}
              {duplicate && <div className="import-warning"><strong>A creature with this name already exists in {library}.</strong><label><input type="checkbox" checked={duplicateAccepted} onChange={event => setDuplicateAccepted(event.target.checked)} /> Create a separate new entry anyway; do not overwrite it.</label></div>}
              <label><input type="checkbox" checked={reviewed} onChange={event => setReviewed(event.target.checked)} /> I have reviewed the fields, warnings, and preview. Save a new entry to {library}.</label>
              <div className="stat-import-buttons">
                <button type="button" className="command-primary" disabled={!canSave} onClick={save}>{busy ? 'Saving…' : `Save to ${library}`}</button>
                <button type="button" onClick={() => { setStep('paste'); setMessage(''); }}>Back to pasted text</button>
                <button type="button" onClick={close}>Cancel</button>
              </div>
            </footer>
          </>
        )}
      </div>
    </div>
  );
}
