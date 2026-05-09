import { useMemo } from 'react';
import { DND_2024_CLASSES, getClassInfo } from '@/data/classData';
import { getCombinedSubclasses, getCombinedSubclassInfo, readPersistedCustomSubclasses, useClassHomebrewStore, type CustomSubclassInfo } from '@/store/classHomebrewStore';
import type { CharacterBuild, CharacterClassSelection } from '@/types/app';

const clampLevel = (value: string | number): number => {
  const parsed = typeof value === 'number' ? value : parseInt(value, 10);
  if (!Number.isFinite(parsed)) return 1;
  return Math.max(1, Math.min(20, parsed));
};

const newClassEntry = (): CharacterClassSelection => ({
  id: crypto.randomUUID(),
  class_id: DND_2024_CLASSES[0]?.id ?? 'fighter',
  level: 1,
});

export function normalizeCharacterBuild(build?: CharacterBuild): CharacterBuild {
  if (!build?.enabled) return { enabled: false, class_levels: [] };
  const class_levels = Array.isArray(build.class_levels)
    ? build.class_levels
        .filter((entry) => entry && typeof entry.class_id === 'string')
        .map((entry) => ({
          id: entry.id || crypto.randomUUID(),
          class_id: entry.class_id,
          level: clampLevel(entry.level),
          subclass_id: entry.subclass_id || undefined,
        }))
    : [];
  return {
    enabled: true,
    class_levels: class_levels.length > 0 ? class_levels : [newClassEntry()],
  };
}

export function formatCharacterBuildSummary(
  build?: CharacterBuild,
  customSubclasses: CustomSubclassInfo[] = readPersistedCustomSubclasses()
): string {
  const normalized = normalizeCharacterBuild(build);
  if (!normalized.enabled || normalized.class_levels.length === 0) return '';
  return normalized.class_levels
    .map((entry) => {
      const info = getClassInfo(entry.class_id);
      const subclass = getCombinedSubclassInfo(entry.class_id, entry.subclass_id, customSubclasses);
      return `${info?.name ?? entry.class_id} ${entry.level}${subclass ? ` (${subclass.name})` : ''}`;
    })
    .join(' / ');
}

export function ClassBuildEditor({
  build,
  onChange,
  title = '2024 class builder',
  description = 'Optional. Use this when the DM wants the sheet to show class/subclass features by level.',
}: {
  build: CharacterBuild;
  onChange: (next: CharacterBuild) => void;
  title?: string;
  description?: string;
}) {
  const normalized = useMemo(() => normalizeCharacterBuild(build), [build]);
  const custom_subclasses = useClassHomebrewStore((state) => state.custom_subclasses);

  const setEnabled = (enabled: boolean) => {
    onChange({
      enabled,
      class_levels: enabled
        ? normalized.class_levels.length > 0
          ? normalized.class_levels
          : [newClassEntry()]
        : [],
    });
  };

  const updateEntry = (id: string, patch: Partial<CharacterClassSelection>) => {
    onChange({
      enabled: true,
      class_levels: normalized.class_levels.map((entry) => {
        if (entry.id !== id) return entry;
        const next = { ...entry, ...patch };
        if (patch.class_id && patch.class_id !== entry.class_id) {
          next.subclass_id = undefined;
        }
        next.level = clampLevel(next.level);
        return next;
      }),
    });
  };

  const addEntry = () => {
    onChange({ enabled: true, class_levels: [...normalized.class_levels, newClassEntry()] });
  };

  const removeEntry = (id: string) => {
    const next = normalized.class_levels.filter((entry) => entry.id !== id);
    onChange({ enabled: true, class_levels: next.length > 0 ? next : [newClassEntry()] });
  };

  const total_level = normalized.class_levels.reduce((sum, entry) => sum + entry.level, 0);

  return (
    <div className="mb-4">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <div className="text-[12px] font-medium text-text-secondary">{title}</div>
          <div className="text-[10px] text-text-tertiary mt-0.5">{description}</div>
        </div>
        <label className="flex items-center gap-2 text-[12px] text-text-secondary" style={{ whiteSpace: 'nowrap' }}>
          <input
            type="checkbox"
            checked={normalized.enabled}
            onChange={(event) => setEnabled(event.target.checked)}
          />
          Use classes
        </label>
      </div>

      {normalized.enabled && (
        <div
          style={{
            border: '0.5px solid var(--color-border-tertiary)',
            borderRadius: 'var(--border-radius-md)',
            background: 'var(--color-background-secondary)',
            padding: 10,
          }}
        >
          <div className="flex justify-between items-center mb-2">
            <div className="text-[11px] text-text-tertiary">Total character level: {total_level}</div>
            <button type="button" onClick={addEntry} style={{ fontSize: 11, padding: '4px 10px' }}>
              + Add multiclass
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {normalized.class_levels.map((entry) => {
              const class_info = getClassInfo(entry.class_id);
              const subclasses = class_info ? getCombinedSubclasses(class_info.id, custom_subclasses) : [];
              return (
                <div
                  key={entry.id}
                  className="grid gap-2 items-end"
                  style={{ gridTemplateColumns: '1.4fr 90px 1.5fr 32px' }}
                >
                  <div>
                    <div className="text-[10px] text-text-tertiary mb-1">Class</div>
                    <select
                      value={entry.class_id}
                      onChange={(event) => updateEntry(entry.id, { class_id: event.target.value })}
                      style={{ width: '100%', boxSizing: 'border-box' }}
                    >
                      {DND_2024_CLASSES.map((cls) => (
                        <option key={cls.id} value={cls.id}>{cls.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <div className="text-[10px] text-text-tertiary mb-1">Level</div>
                    <input
                      value={entry.level}
                      onChange={(event) => updateEntry(entry.id, { level: clampLevel(event.target.value) })}
                      style={{ width: '100%', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <div className="text-[10px] text-text-tertiary mb-1">Subclass</div>
                    <select
                      value={entry.subclass_id ?? ''}
                      onChange={(event) => updateEntry(entry.id, { subclass_id: event.target.value || undefined })}
                      style={{ width: '100%', boxSizing: 'border-box' }}
                    >
                      <option value="">No subclass selected</option>
                      {subclasses.map((sub) => (
                        <option key={sub.id} value={sub.id}>{sub.name}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeEntry(entry.id)}
                    title="Remove this class"
                    style={{ height: 30, padding: 0, color: 'var(--color-text-tertiary)' }}
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
