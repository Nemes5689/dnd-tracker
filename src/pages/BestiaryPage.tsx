import { useEffect, useMemo, useState } from 'react';
import { useSRDStore } from '@/store/srdStore';
import { useCustomMonsterStore } from '@/store/customMonsterStore';
import { CustomMonsterForm } from '@/components/bestiary/CustomMonsterForm';
import { Lightbox } from '@/components/common/Lightbox';
import { ClassFeaturesPanel } from '@/components/characters/ClassFeaturesPanel';
import { OriginFeaturesPanel, formatOriginSummary } from '@/components/characters/OriginEditor';
import { formatCharacterBuildSummary } from '@/components/characters/ClassBuildEditor';
import type { MonsterSpeed, Monster, Spell } from '@/types/srd';

type AbilityKey = 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha';
type NumberRange = { min: string; max: string };

const ABILITIES: AbilityKey[] = ['str', 'dex', 'con', 'int', 'wis', 'cha'];

const DAMAGE_TYPES = [
  'Acid',
  'Bludgeoning',
  'Cold',
  'Fire',
  'Force',
  'Lightning',
  'Necrotic',
  'Piercing',
  'Poison',
  'Psychic',
  'Radiant',
  'Slashing',
  'Thunder',
];

const COMMON_CONDITIONS = [
  'Blinded',
  'Charmed',
  'Deafened',
  'Exhaustion',
  'Frightened',
  'Grappled',
  'Incapacitated',
  'Invisible',
  'Paralyzed',
  'Petrified',
  'Poisoned',
  'Prone',
  'Restrained',
  'Stunned',
  'Unconscious',
];

const SPEED_TYPES = ['walk', 'climb', 'fly', 'swim', 'burrow', 'hover'];
const SENSE_TYPES = ['blindsight', 'darkvision', 'tremorsense', 'truesight'];

const FEATURE_FILTERS = [
  { key: 'multiattack', label: 'Multiattack' },
  { key: 'spellcasting', label: 'Spellcasting' },
  { key: 'legendary-actions', label: 'Legendary Actions' },
  { key: 'bonus-actions', label: 'Bonus Actions' },
  { key: 'reactions', label: 'Reactions' },
  { key: 'legendary-resistance', label: 'Legendary Resistance' },
  { key: 'magic-resistance', label: 'Magic Resistance' },
  { key: 'pack-tactics', label: 'Pack Tactics' },
  { key: 'flyby', label: 'Flyby' },
  { key: 'regeneration', label: 'Regeneration' },
  { key: 'spider-climb', label: 'Spider Climb' },
  { key: 'false-appearance', label: 'False Appearance' },
  { key: 'recharge', label: 'Recharge' },
];

function normalizeText(value: unknown): string {
  return String(value ?? '').trim().toLowerCase();
}

function crToNumber(cr: string | null | undefined): number | null {
  if (!cr || cr === 'Unknown') return null;
  if (cr.includes('/')) {
    const [a, b] = cr.split('/').map(Number);
    if (!Number.isFinite(a) || !Number.isFinite(b) || b === 0) return null;
    return a / b;
  }
  const n = Number(cr);
  return Number.isFinite(n) ? n : null;
}

function rangePass(value: number | null | undefined, range: NumberRange): boolean {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return !range.min && !range.max;
  }
  const min = range.min === '' ? null : Number(range.min);
  const max = range.max === '' ? null : Number(range.max);
  if (min !== null && Number.isFinite(min) && value < min) return false;
  if (max !== null && Number.isFinite(max) && value > max) return false;
  return true;
}

function matchesAnySelected(values: string[], selected: string[]): boolean {
  if (selected.length === 0) return true;
  const normalizedValues = values.map(normalizeText);
  return selected.some((target) => normalizedValues.some((value) => value.includes(normalizeText(target))));
}

function getSpeedModes(speed: MonsterSpeed | undefined): string[] {
  if (!speed || typeof speed === 'string') return [];
  return Object.entries(speed)
    .filter(([, value]) => Number(value) > 0)
    .map(([key]) => key.toLowerCase());
}

function getFeatureText(monster: Monster): string {
  const sections = [
    ...(monster.traits ?? []),
    ...(monster.actions ?? []),
    ...(monster.bonus_actions ?? []),
    ...(monster.reactions ?? []),
    ...(monster.legendary_actions ?? []),
  ];
  return sections.map((f) => `${f.name} ${f.description}`).join(' ').toLowerCase();
}

function hasFeature(monster: Monster, key: string): boolean {
  const text = getFeatureText(monster);
  if (key === 'multiattack') return (monster.actions ?? []).some((a) => normalizeText(a.name).includes('multiattack'));
  if (key === 'spellcasting') return Boolean(monster.spellcasting) || text.includes('spellcasting') || text.includes('innate spellcasting');
  if (key === 'legendary-actions') return (monster.legendary_actions ?? []).length > 0;
  if (key === 'bonus-actions') return (monster.bonus_actions ?? []).length > 0;
  if (key === 'reactions') return (monster.reactions ?? []).length > 0;
  if (key === 'legendary-resistance') return text.includes('legendary resistance');
  if (key === 'magic-resistance') return text.includes('magic resistance');
  if (key === 'pack-tactics') return text.includes('pack tactics');
  if (key === 'flyby') return text.includes('flyby');
  if (key === 'regeneration') return text.includes('regeneration') || text.includes('regenerate');
  if (key === 'spider-climb') return text.includes('spider climb');
  if (key === 'false-appearance') return text.includes('false appearance');
  if (key === 'recharge') return /recharge\s+\d/i.test(text) || text.includes('recharges after');
  return false;
}

function uniq(values: Array<string | null | undefined>): string[] {
  return Array.from(new Set(values.filter((v): v is string => Boolean(v && v.trim())))).sort((a, b) => a.localeCompare(b));
}

function toggleValue(values: string[], value: string): string[] {
  return values.includes(value) ? values.filter((v) => v !== value) : [...values, value];
}

function FilterChips({
  label,
  options,
  selected,
  onChange,
  maxVisible = 18,
}: {
  label: string;
  options: string[];
  selected: string[];
  onChange: (next: string[]) => void;
  maxVisible?: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? options : options.slice(0, maxVisible);
  if (options.length === 0) return null;
  return (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1">
        <div className="text-[11px] font-medium text-text-secondary">{label}</div>
        {selected.length > 0 && (
          <button
            onClick={() => onChange([])}
            className="text-[10px]"
            style={{ padding: '1px 6px' }}
          >
            Clear
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-1">
        {visible.map((option) => {
          const active = selected.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(toggleValue(selected, option))}
              title={option}
              style={{
                fontSize: '10px',
                padding: '3px 6px',
                borderRadius: '999px',
                background: active ? 'var(--color-background-info)' : 'var(--color-background-secondary)',
                borderColor: active ? 'var(--color-border-info)' : 'var(--color-border-tertiary)',
                color: active ? 'var(--color-text-info)' : undefined,
              }}
            >
              {option}
            </button>
          );
        })}
        {options.length > maxVisible && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            style={{ fontSize: '10px', padding: '3px 6px', borderRadius: '999px' }}
          >
            {expanded ? 'Less' : `+${options.length - maxVisible}`}
          </button>
        )}
      </div>
    </div>
  );
}

function RangeInputs({
  label,
  value,
  onChange,
  placeholderMin = 'min',
  placeholderMax = 'max',
}: {
  label: string;
  value: NumberRange;
  onChange: (next: NumberRange) => void;
  placeholderMin?: string;
  placeholderMax?: string;
}) {
  return (
    <div>
      <div className="text-[11px] font-medium text-text-secondary mb-1">{label}</div>
      <div className="flex gap-1">
        <input
          value={value.min}
          onChange={(e) => onChange({ ...value, min: e.target.value })}
          placeholder={placeholderMin}
          style={{ height: 26, fontSize: '11px', width: '50%' }}
        />
        <input
          value={value.max}
          onChange={(e) => onChange({ ...value, max: e.target.value })}
          placeholder={placeholderMax}
          style={{ height: 26, fontSize: '11px', width: '50%' }}
        />
      </div>
    </div>
  );
}

export function BestiaryPage() {
  const { loaded, loading, monsters: srd_monsters, load } = useSRDStore();
  const { monsters: custom_monsters, deleteMonster } = useCustomMonsterStore();

  const [search, setSearch] = useState('');
  const [source_filter, set_source_filter] = useState<'all' | 'srd' | 'custom'>('all');
  const [selected, setSelected] = useState<Monster | null>(null);
  const [show_form, set_show_form] = useState(false);
  const [duplicate_source, set_duplicate_source] = useState<Monster | null>(null);
  const [edit_id, set_edit_id] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [crRange, setCrRange] = useState<NumberRange>({ min: '', max: '' });
  const [acRange, setAcRange] = useState<NumberRange>({ min: '', max: '' });
  const [hpRange, setHpRange] = useState<NumberRange>({ min: '', max: '' });
  const [ppRange, setPpRange] = useState<NumberRange>({ min: '', max: '' });
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [selectedResistances, setSelectedResistances] = useState<string[]>([]);
  const [selectedImmunities, setSelectedImmunities] = useState<string[]>([]);
  const [selectedVulnerabilities, setSelectedVulnerabilities] = useState<string[]>([]);
  const [selectedConditionImmunities, setSelectedConditionImmunities] = useState<string[]>([]);
  const [selectedSpeedModes, setSelectedSpeedModes] = useState<string[]>([]);
  const [selectedSenseTypes, setSelectedSenseTypes] = useState<string[]>([]);
  const [selectedSaves, setSelectedSaves] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  useEffect(() => {
    if (!loaded) load();
  }, [loaded, load]);

  const all_monsters: Monster[] = useMemo(
    () => [...custom_monsters, ...srd_monsters],
    [custom_monsters, srd_monsters]
  );

  const filterOptions = useMemo(() => {
    const types = uniq(all_monsters.map((m) => m.type));
    const sizes = uniq(all_monsters.map((m) => m.size));
    const sources = uniq(all_monsters.map((m) => m.source));
    const resistances = uniq([...DAMAGE_TYPES, ...all_monsters.flatMap((m) => m.damage_resistances ?? [])]);
    const immunities = uniq([...DAMAGE_TYPES, ...all_monsters.flatMap((m) => m.damage_immunities ?? [])]);
    const vulnerabilities = uniq([...DAMAGE_TYPES, ...all_monsters.flatMap((m) => m.damage_vulnerabilities ?? [])]);
    const conditionImmunities = uniq([...COMMON_CONDITIONS, ...all_monsters.flatMap((m) => m.condition_immunities ?? [])]);
    const speeds = uniq([...SPEED_TYPES, ...all_monsters.flatMap((m) => getSpeedModes(m.speed))]);
    const senses = uniq([...SENSE_TYPES, ...all_monsters.flatMap((m) => Object.keys(m.senses ?? {}))]);
    const skills = uniq(all_monsters.flatMap((m) => Object.keys(m.skills ?? {}))).map((s) => s.replace(/_/g, ' '));
    return { types, sizes, sources, resistances, immunities, vulnerabilities, conditionImmunities, speeds, senses, skills };
  }, [all_monsters]);

  const hasAdvancedFilters =
    crRange.min || crRange.max || acRange.min || acRange.max || hpRange.min || hpRange.max ||
    ppRange.min || ppRange.max || selectedTypes.length || selectedSizes.length || selectedSources.length ||
    selectedResistances.length || selectedImmunities.length || selectedVulnerabilities.length ||
    selectedConditionImmunities.length || selectedSpeedModes.length || selectedSenseTypes.length ||
    selectedSaves.length || selectedSkills.length || selectedFeatures.length;

  const resetAdvancedFilters = () => {
    setCrRange({ min: '', max: '' });
    setAcRange({ min: '', max: '' });
    setHpRange({ min: '', max: '' });
    setPpRange({ min: '', max: '' });
    setSelectedTypes([]);
    setSelectedSizes([]);
    setSelectedSources([]);
    setSelectedResistances([]);
    setSelectedImmunities([]);
    setSelectedVulnerabilities([]);
    setSelectedConditionImmunities([]);
    setSelectedSpeedModes([]);
    setSelectedSenseTypes([]);
    setSelectedSaves([]);
    setSelectedSkills([]);
    setSelectedFeatures([]);
  };

  const filtered = useMemo(() => {
    return all_monsters.filter((m) => {
      if (search && !m.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (source_filter === 'srd' && m.source === 'Custom') return false;
      if (source_filter === 'custom' && m.source !== 'Custom') return false;

      if (!rangePass(crToNumber(m.cr), crRange)) return false;
      if (!rangePass(m.ac, acRange)) return false;
      if (!rangePass(m.hp, hpRange)) return false;
      if (!rangePass(m.passive_perception, ppRange)) return false;

      if (!matchesAnySelected(m.type ? [m.type] : [], selectedTypes)) return false;
      if (!matchesAnySelected(m.size ? [m.size] : [], selectedSizes)) return false;
      if (!matchesAnySelected(m.source ? [m.source] : [], selectedSources)) return false;
      if (!matchesAnySelected(m.damage_resistances ?? [], selectedResistances)) return false;
      if (!matchesAnySelected(m.damage_immunities ?? [], selectedImmunities)) return false;
      if (!matchesAnySelected(m.damage_vulnerabilities ?? [], selectedVulnerabilities)) return false;
      if (!matchesAnySelected(m.condition_immunities ?? [], selectedConditionImmunities)) return false;
      if (!matchesAnySelected(getSpeedModes(m.speed), selectedSpeedModes)) return false;
      if (!matchesAnySelected(Object.keys(m.senses ?? {}), selectedSenseTypes)) return false;

      if (selectedSaves.length > 0) {
        const saveKeys = Object.keys(m.saves ?? {}).map((key) => key.toLowerCase());
        if (!selectedSaves.some((ab) => saveKeys.includes(ab))) return false;
      }
      if (selectedSkills.length > 0) {
        const skillKeys = Object.keys(m.skills ?? {}).map((key) => key.replace(/_/g, ' ').toLowerCase());
        if (!selectedSkills.some((skill) => skillKeys.includes(skill.toLowerCase()))) return false;
      }
      if (selectedFeatures.length > 0 && !selectedFeatures.every((key) => hasFeature(m, key))) return false;
      return true;
    });
  }, [
    all_monsters,
    search,
    source_filter,
    crRange,
    acRange,
    hpRange,
    ppRange,
    selectedTypes,
    selectedSizes,
    selectedSources,
    selectedResistances,
    selectedImmunities,
    selectedVulnerabilities,
    selectedConditionImmunities,
    selectedSpeedModes,
    selectedSenseTypes,
    selectedSaves,
    selectedSkills,
    selectedFeatures,
  ]);

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
      <div className="grid h-full" style={{ gridTemplateColumns: '340px 1fr' }}>
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
            <button
              onClick={() => setShowAdvanced((v) => !v)}
              style={{
                flex: 1,
                fontSize: '12px',
                padding: '6px 10px',
                background: showAdvanced || hasAdvancedFilters ? 'var(--color-background-info)' : undefined,
                borderColor: showAdvanced || hasAdvancedFilters ? 'var(--color-border-info)' : undefined,
                color: showAdvanced || hasAdvancedFilters ? 'var(--color-text-info)' : undefined,
              }}
            >
              {showAdvanced ? 'Hide filters' : 'Advanced filters'}{hasAdvancedFilters ? ' • active' : ''}
            </button>
            <button onClick={resetAdvancedFilters} disabled={!hasAdvancedFilters} style={{ fontSize: '12px', padding: '6px 10px' }}>
              Reset
            </button>
          </div>

          {showAdvanced && (
            <div
              className="mb-3 overflow-y-auto"
              style={{
                maxHeight: '42vh',
                paddingRight: 4,
                borderBottom: '1px solid var(--color-border-tertiary)',
              }}
            >
              <div className="grid grid-cols-2 gap-2 mb-3">
                <RangeInputs label="CR" value={crRange} onChange={setCrRange} placeholderMin="min" placeholderMax="max" />
                <RangeInputs label="AC" value={acRange} onChange={setAcRange} />
                <RangeInputs label="HP" value={hpRange} onChange={setHpRange} />
                <RangeInputs label="Passive Perception" value={ppRange} onChange={setPpRange} />
              </div>

              <FilterChips label="Type" options={filterOptions.types} selected={selectedTypes} onChange={setSelectedTypes} maxVisible={14} />
              <FilterChips label="Size" options={filterOptions.sizes} selected={selectedSizes} onChange={setSelectedSizes} maxVisible={10} />
              <FilterChips label="Book / Source" options={filterOptions.sources} selected={selectedSources} onChange={setSelectedSources} maxVisible={10} />
              <FilterChips label="Damage Resistance" options={filterOptions.resistances} selected={selectedResistances} onChange={setSelectedResistances} maxVisible={12} />
              <FilterChips label="Damage Immunity" options={filterOptions.immunities} selected={selectedImmunities} onChange={setSelectedImmunities} maxVisible={12} />
              <FilterChips label="Damage Vulnerability" options={filterOptions.vulnerabilities} selected={selectedVulnerabilities} onChange={setSelectedVulnerabilities} maxVisible={12} />
              <FilterChips label="Condition Immunity" options={filterOptions.conditionImmunities} selected={selectedConditionImmunities} onChange={setSelectedConditionImmunities} maxVisible={14} />
              <FilterChips label="Speed Type" options={filterOptions.speeds} selected={selectedSpeedModes} onChange={setSelectedSpeedModes} maxVisible={12} />
              <FilterChips label="Senses" options={filterOptions.senses} selected={selectedSenseTypes} onChange={setSelectedSenseTypes} maxVisible={12} />
              <FilterChips label="Has Save" options={ABILITIES} selected={selectedSaves} onChange={setSelectedSaves} maxVisible={6} />
              <FilterChips label="Has Skill" options={filterOptions.skills} selected={selectedSkills} onChange={setSelectedSkills} maxVisible={12} />
              <FilterChips
                label="Traits / Actions"
                options={FEATURE_FILTERS.map((f) => f.key)}
                selected={selectedFeatures}
                onChange={setSelectedFeatures}
                maxVisible={13}
              />
            </div>
          )}

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
        {ABILITIES.map((ab) => {
          const a = monster.abilities[ab];
          const save = monster.saves?.[ab];
          return (
            <div key={ab} className="bg-bg-primary text-center" style={{ padding: '8px', border: '0.5px solid var(--color-border-tertiary)', borderRadius: 'var(--border-radius-md)' }}>
              <div className="text-[10px] text-text-tertiary">{ab.toUpperCase()}</div>
              <div className="text-[13px] font-medium">
                {a.score} ({a.modifier >= 0 ? '+' : ''}{a.modifier})
              </div>
              <div className="text-[10px] text-text-tertiary">
                {typeof save === 'number' ? `save ${save >= 0 ? '+' : ''}${save}` : 'save —'}
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-[12px] leading-7 text-text-secondary mb-4">
        {Object.keys(monster.skills ?? {}).length > 0 && (
          <div>
            <strong className="text-text-primary font-medium">Skills</strong>{' '}
            {Object.entries(monster.skills).map(([s, b]) => `${s.replace(/_/g, ' ')} ${b >= 0 ? '+' : ''}${b}`).join(', ')}
          </div>
        )}
        {(monster.damage_resistances ?? []).length > 0 && (
          <div><strong className="text-text-primary font-medium">Damage Resistances</strong> {monster.damage_resistances.join(', ')}</div>
        )}
        {(monster.damage_immunities ?? []).length > 0 && (
          <div><strong className="text-text-primary font-medium">Damage Immunities</strong> {monster.damage_immunities.join(', ')}</div>
        )}
        {(monster.damage_vulnerabilities ?? []).length > 0 && (
          <div><strong className="text-text-primary font-medium">Damage Vulnerabilities</strong> {monster.damage_vulnerabilities.join(', ')}</div>
        )}
        {(monster.condition_immunities ?? []).length > 0 && (
          <div><strong className="text-text-primary font-medium">Condition Immunities</strong> {monster.condition_immunities.join(', ')}</div>
        )}
        {Object.keys(monster.senses ?? {}).length > 0 && (
          <div>
            <strong className="text-text-primary font-medium">Senses</strong>{' '}
            {formatSenses(monster)}
            {monster.passive_perception && `; Passive Perception ${monster.passive_perception}`}
          </div>
        )}
        {(monster.languages ?? []).length > 0 && (
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

function formatSenses(monster: Monster): string {
  const notes = (monster as Monster & { senses_notes?: Record<string, string> }).senses_notes ?? {};
  return Object.entries(monster.senses ?? {})
    .map(([key, value]) => `${key} ${value} ft${notes[key] ? ` ${notes[key]}` : ''}`)
    .join(', ');
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
