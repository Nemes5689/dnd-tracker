import { useMemo, useState } from 'react';
import { DND_2024_CLASSES } from '@/data/classData';
import { FeatureDescription } from '@/components/characters/ClassFeaturesPanel';
import { BLOOD_HUNTER_BLOOD_CURSES } from '@/data/bloodHunterClass';
import {
  getCombinedSubclasses,
  getSubclassFeatureLevels,
  useClassHomebrewStore,
  type CustomSubclassFeature,
} from '@/store/classHomebrewStore';

function makeEmptyFeature(level: number): CustomSubclassFeature {
  return { level, name: '', description: '' };
}

function classBadge(text: string) {
  return (
    <span
      className="text-[10px] text-text-tertiary"
      style={{
        border: '0.5px solid var(--color-border-tertiary)',
        borderRadius: '999px',
        padding: '2px 7px',
        background: 'var(--color-background-secondary)',
        whiteSpace: 'nowrap',
      }}
    >
      {text}
    </span>
  );
}

export function ClassesPage() {
  const custom_subclasses = useClassHomebrewStore((state) => state.custom_subclasses);
  const addSubclass = useClassHomebrewStore((state) => state.addSubclass);
  const deleteSubclass = useClassHomebrewStore((state) => state.deleteSubclass);

  const [selected_class_id, set_selected_class_id] = useState(DND_2024_CLASSES[0]?.id ?? 'fighter');
  const [new_class_id, set_new_class_id] = useState(DND_2024_CLASSES[0]?.id ?? 'fighter');
  const [new_name, set_new_name] = useState('');
  const [features, set_features] = useState<CustomSubclassFeature[]>(() => [makeEmptyFeature(getSubclassFeatureLevels(DND_2024_CLASSES[0]?.id ?? 'fighter')[0] ?? 3)]);

  const selected_class = DND_2024_CLASSES.find((entry) => entry.id === selected_class_id) ?? DND_2024_CLASSES[0];
  const selected_subclasses = useMemo(
    () => (selected_class ? getCombinedSubclasses(selected_class.id, custom_subclasses) : []),
    [selected_class, custom_subclasses]
  );
  const add_allowed_levels = getSubclassFeatureLevels(new_class_id);
  const selected_allowed_levels = selected_class ? getSubclassFeatureLevels(selected_class.id) : [];

  const changeNewClass = (classId: string) => {
    const allowed = getSubclassFeatureLevels(classId);
    set_new_class_id(classId);
    set_features([makeEmptyFeature(allowed[0] ?? 3)]);
  };

  const updateFeature = (index: number, patch: Partial<CustomSubclassFeature>) => {
    set_features((current) => current.map((feature, i) => (i === index ? { ...feature, ...patch } : feature)));
  };

  const addFeatureAtLevel = (level: number) => {
    set_features((current) => [...current, makeEmptyFeature(level)]);
  };

  const removeFeature = (index: number) => {
    set_features((current) => {
      const next = current.filter((_, i) => i !== index);
      return next.length > 0 ? next : [makeEmptyFeature(add_allowed_levels[0] ?? 3)];
    });
  };

  const saveSubclass = () => {
    const cleanName = new_name.trim();
    const cleanFeatures = features
      .map((feature) => ({
        level: Number(feature.level),
        name: feature.name.trim(),
        description: feature.description?.trim() ?? '',
      }))
      .filter((feature) => feature.name.length > 0);

    if (!cleanName) {
      alert('Adj nevet az új subclassnak.');
      return;
    }
    if (cleanFeatures.length === 0) {
      alert('Legalább egy subclass képességet adj hozzá.');
      return;
    }

    const id = addSubclass({ class_id: new_class_id, name: cleanName, features: cleanFeatures });
    set_selected_class_id(new_class_id);
    set_new_name('');
    set_features([makeEmptyFeature(add_allowed_levels[0] ?? 3)]);
    setTimeout(() => {
      const element = document.getElementById(`subclass-${id}`);
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 50);
  };

  const groupedNewFeatures = add_allowed_levels.map((level) => ({
    level,
    items: features.map((feature, index) => ({ feature, index })).filter((item) => Number(item.feature.level) === level),
  }));

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Classes & Subclasses</h1>
          <p className="text-[13px] text-text-secondary max-w-3xl">
            Itt lehet átnézni az összes beépített 2024-es classt és subclasst, valamint új homebrew subclasst hozzáadni. Az új subclass képességek csak az adott class normál subclass-feature szintjeire rakhatók.
          </p>
        </div>
        <div className="text-[11px] text-text-tertiary" style={{ whiteSpace: 'nowrap' }}>
          {DND_2024_CLASSES.length} class · {custom_subclasses.length} custom subclass
        </div>
      </div>

      <div className="grid gap-4" style={{ gridTemplateColumns: '260px minmax(0, 1fr)' }}>
        <aside
          className="flex flex-col gap-2"
          style={{
            border: '0.5px solid var(--color-border-tertiary)',
            borderRadius: 'var(--border-radius-lg)',
            background: 'var(--color-background-secondary)',
            padding: 10,
            alignSelf: 'start',
            position: 'sticky',
            top: 16,
          }}
        >
          <div className="text-[11px] font-medium text-text-secondary mb-1">Class list</div>
          {DND_2024_CLASSES.map((cls) => {
            const subclassCount = getCombinedSubclasses(cls.id, custom_subclasses).length;
            const active = cls.id === selected_class_id;
            return (
              <button
                key={cls.id}
                type="button"
                onClick={() => set_selected_class_id(cls.id)}
                className="text-left"
                style={{
                  padding: '8px 10px',
                  borderRadius: 'var(--border-radius-md)',
                  border: active ? '0.5px solid var(--color-border-secondary)' : '0.5px solid transparent',
                  background: active ? 'var(--color-background-primary)' : 'transparent',
                }}
              >
                <div className="text-[13px] font-medium text-text-primary">{cls.name}</div>
                <div className="text-[10px] text-text-tertiary">{subclassCount} subclass · levels {getSubclassFeatureLevels(cls.id).join(', ')}</div>
              </button>
            );
          })}
        </aside>

        <main className="flex flex-col gap-4 min-w-0">
          <section
            style={{
              border: '0.5px solid var(--color-border-tertiary)',
              borderRadius: 'var(--border-radius-lg)',
              background: 'var(--color-background-primary)',
              padding: 16,
            }}
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <h2 className="text-xl font-semibold mb-1">{selected_class?.name}</h2>
                <div className="flex flex-wrap gap-1.5">
                  {selected_allowed_levels.map((level) => classBadge(`Subclass level ${level}`))}
                </div>
              </div>
            </div>

            <div className="grid gap-3 mb-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
              {Object.entries(selected_class?.coreTraits ?? {}).map(([key, value]) => (
                <div
                  key={key}
                  style={{
                    border: '0.5px solid var(--color-border-tertiary)',
                    borderRadius: 'var(--border-radius-md)',
                    padding: 10,
                    background: 'var(--color-background-secondary)',
                  }}
                >
                  <div className="text-[10px] text-text-tertiary mb-1">{key}</div>
                  <div className="text-[12px] text-text-primary">{value}</div>
                </div>
              ))}
            </div>

            <details>
              <summary className="text-[12px] font-medium text-text-secondary" style={{ cursor: 'pointer' }}>
                Class progression table
              </summary>
              <div className="overflow-x-auto mt-2">
                <table className="w-full text-left border-collapse" style={{ border: '0.5px solid var(--color-border-tertiary)' }}>
                  <thead>
                    <tr>
                      <th className="text-[10px]" style={{ padding: 7, borderBottom: '0.5px solid var(--color-border-tertiary)' }}>Level</th>
                      <th className="text-[10px]" style={{ padding: 7, borderBottom: '0.5px solid var(--color-border-tertiary)' }}>Features</th>
                      <th className="text-[10px]" style={{ padding: 7, borderBottom: '0.5px solid var(--color-border-tertiary)' }}>Extras</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(selected_class?.progression ?? []).map((row) => (
                      <tr key={row.level}>
                        <td className="text-[11px]" style={{ padding: 7, borderTop: '0.5px solid var(--color-border-tertiary)', whiteSpace: 'nowrap' }}>{row.level}</td>
                        <td className="text-[11px]" style={{ padding: 7, borderTop: '0.5px solid var(--color-border-tertiary)' }}>{row.features.join(', ') || '—'}</td>
                        <td className="text-[10px] text-text-tertiary" style={{ padding: 7, borderTop: '0.5px solid var(--color-border-tertiary)' }}>
                          {Object.entries(row.extras).map(([key, value]) => `${key}: ${value}`).join(' · ') || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          </section>

          <section
            style={{
              border: '0.5px solid var(--color-border-tertiary)',
              borderRadius: 'var(--border-radius-lg)',
              background: 'var(--color-background-primary)',
              padding: 16,
            }}
          >
            <h2 className="text-lg font-semibold mb-1">Subclasses for {selected_class?.name}</h2>
            <p className="text-[12px] text-text-secondary mb-3">
              A karakter/monster class builder ezekből a subclassokból dolgozik. A custom subclassok azonnal megjelennek a megfelelő class alatt.
            </p>
            <div className="flex flex-col gap-3">
              {selected_subclasses.map((subclass) => {
                const custom = custom_subclasses.find((entry) => entry.id === subclass.id);
                return (
                  <details
                    key={subclass.id}
                    id={`subclass-${subclass.id}`}
                    open={!!custom}
                    style={{
                      border: '0.5px solid var(--color-border-tertiary)',
                      borderRadius: 'var(--border-radius-md)',
                      background: 'var(--color-background-secondary)',
                      padding: 12,
                    }}
                  >
                    <summary className="text-[13px] text-text-primary" style={{ cursor: 'pointer' }}>
                      <span className="font-medium">{subclass.name}</span>
                      <span className="text-text-tertiary"> · {subclass.features.length} feature{subclass.features.length === 1 ? '' : 's'}</span>
                      {custom && <span className="text-text-info"> · custom</span>}
                    </summary>
                    <div className="mt-2 flex flex-col gap-2">
                      {subclass.features.map((feature, index) => (
                        <div key={`${feature.level}-${feature.name}-${index}`}>
                          <div className="text-[12px] font-medium text-text-primary">Level {feature.level}: {feature.name}</div>
                          {feature.description && <FeatureDescription description={feature.description} />}
                        </div>
                      ))}
                      {custom && (
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Delete custom subclass ${custom.name}?`)) deleteSubclass(custom.id);
                          }}
                          className="self-start text-[11px]"
                          style={{ color: 'var(--color-text-danger, #ef4444)', padding: '4px 8px' }}
                        >
                          Delete custom subclass
                        </button>
                      )}
                    </div>
                  </details>
                );
              })}
            </div>
          </section>

          {selected_class?.id === 'blood-hunter' && (
            <section
              style={{
                border: '0.5px solid var(--color-border-tertiary)',
                borderRadius: 'var(--border-radius-lg)',
                background: 'var(--color-background-primary)',
                padding: 16,
              }}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <h2 className="text-lg font-semibold mb-1">Blood Curses</h2>
                  <p className="text-[12px] text-text-secondary">
                    Külön Blood Hunter referenciahely. Itt az összes blood curse külön lenyitható elemként szerepel, prerequisite és amplify résszel együtt.
                  </p>
                </div>
                <div className="text-[11px] text-text-tertiary" style={{ whiteSpace: 'nowrap' }}>
                  {BLOOD_HUNTER_BLOOD_CURSES.length} curses
                </div>
              </div>

              <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
                {BLOOD_HUNTER_BLOOD_CURSES.map((curse) => (
                  <details
                    key={curse.id}
                    style={{
                      border: '0.5px solid var(--color-border-tertiary)',
                      borderRadius: 'var(--border-radius-md)',
                      background: 'var(--color-background-secondary)',
                      padding: 12,
                    }}
                  >
                    <summary className="text-[13px] text-text-primary" style={{ cursor: 'pointer' }}>
                      <span className="font-medium">{curse.name}</span>
                      {curse.prerequisite && <span className="text-text-tertiary"> · {curse.prerequisite}</span>}
                    </summary>
                    <div className="mt-2 text-[11px] text-text-secondary" style={{ lineHeight: 1.45 }}>
                      <p>{curse.description}</p>
                      {curse.amplify && (
                        <p className="mt-2">
                          <strong className="text-text-primary">Amplify.</strong> {curse.amplify}
                        </p>
                      )}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          )}

          <section
            style={{
              border: '0.5px solid var(--color-border-tertiary)',
              borderRadius: 'var(--border-radius-lg)',
              background: 'var(--color-background-primary)',
              padding: 16,
            }}
          >
            <h2 className="text-lg font-semibold mb-1">Add new subclass</h2>
            <p className="text-[12px] text-text-secondary mb-3">
              Először válaszd ki, melyik classhoz tartozik. A képességek szintjei automatikusan a kiválasztott class normál subclass szintjeire vannak korlátozva. Egy szinthez több képességet is felvehetsz a <strong>+ Add another feature at this level</strong> gombbal.
            </p>

            <div className="grid gap-3 mb-4" style={{ gridTemplateColumns: 'minmax(180px, 1fr) minmax(220px, 2fr)' }}>
              <div>
                <div className="text-[10px] text-text-tertiary mb-1">Parent class</div>
                <select value={new_class_id} onChange={(event) => changeNewClass(event.target.value)} style={{ width: '100%' }}>
                  {DND_2024_CLASSES.map((cls) => (
                    <option key={cls.id} value={cls.id}>{cls.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <div className="text-[10px] text-text-tertiary mb-1">Subclass name</div>
                <input value={new_name} onChange={(event) => set_new_name(event.target.value)} placeholder="e.g. School of Storms" style={{ width: '100%', boxSizing: 'border-box' }} />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {groupedNewFeatures.map(({ level, items }) => (
                <div
                  key={level}
                  style={{
                    border: '0.5px solid var(--color-border-tertiary)',
                    borderRadius: 'var(--border-radius-md)',
                    background: 'var(--color-background-secondary)',
                    padding: 12,
                  }}
                >
                  <div className="flex justify-between items-center gap-3 mb-2">
                    <div className="text-[13px] font-medium text-text-primary">Level {level} subclass features</div>
                    <button type="button" onClick={() => addFeatureAtLevel(level)} style={{ fontSize: 11, padding: '4px 9px' }}>
                      + Add another feature at this level
                    </button>
                  </div>

                  {items.length === 0 ? (
                    <div className="text-[11px] text-text-tertiary italic">No feature added at this level yet.</div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {items.map(({ feature, index }) => (
                        <div key={index} className="grid gap-2" style={{ gridTemplateColumns: 'minmax(160px, 1fr) 34px' }}>
                          <div className="flex flex-col gap-2">
                            <input
                              value={feature.name}
                              onChange={(event) => updateFeature(index, { name: event.target.value })}
                              placeholder={`Feature name at level ${level}`}
                              style={{ width: '100%', boxSizing: 'border-box' }}
                            />
                            <textarea
                              value={feature.description ?? ''}
                              onChange={(event) => updateFeature(index, { description: event.target.value })}
                              placeholder="Feature description. Markdown tables copied from rules text can be pasted here."
                              rows={4}
                              style={{ width: '100%', boxSizing: 'border-box', resize: 'vertical' }}
                            />
                          </div>
                          <button type="button" onClick={() => removeFeature(index)} title="Remove feature" style={{ height: 30, padding: 0 }}>×</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-4">
              <button type="button" onClick={saveSubclass} style={{ padding: '8px 14px' }}>
                Save subclass
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
