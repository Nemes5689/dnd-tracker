import { useMemo } from 'react';
import { getBackgroundInfo, getCombinedBackgrounds, getCombinedFeats, getCombinedSpecies, getFeatInfo, getSpeciesInfo, readPersistedOriginHomebrew, useOriginHomebrewStore } from '@/store/originHomebrewStore';
import type { BackgroundInfo, CharacterOriginSelection, FeatInfo } from '@/types/origins';

type AbilityKey = 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha';

const ABILITY_LABELS: Record<AbilityKey, string> = {
  str: 'Strength',
  dex: 'Dexterity',
  con: 'Constitution',
  int: 'Intelligence',
  wis: 'Wisdom',
  cha: 'Charisma',
};

const ABILITY_BY_NAME: Record<string, AbilityKey> = Object.fromEntries(
  Object.entries(ABILITY_LABELS).map(([key, value]) => [value.toLowerCase(), key])
) as Record<string, AbilityKey>;

export function parseBackgroundAbilityOptions(background?: BackgroundInfo): AbilityKey[] {
  if (!background?.ability_scores) return [];
  return background.ability_scores
    .split(/,|\bor\b|\band\b/gi)
    .map((part) => ABILITY_BY_NAME[part.trim().toLowerCase()])
    .filter((ability, index, arr): ability is AbilityKey => Boolean(ability) && arr.indexOf(ability) === index);
}

export function parseBackgroundSkills(background?: BackgroundInfo): string[] {
  if (!background?.skill_proficiencies) return [];
  return background.skill_proficiencies
    .replace(/^choose\s+\d+\s*:?\s*/i, '')
    .split(/,|\band\b|\bor\b/gi)
    .map((part) => part.trim())
    .filter(Boolean);
}

export function parseBackgroundTool(background?: BackgroundInfo, selection?: CharacterOriginSelection): string[] {
  if (!background?.tool_proficiency) return [];
  const raw = background.tool_proficiency.trim();
  if (/^choose\b/i.test(raw)) return selection?.background_tool_choice?.trim() ? [selection.background_tool_choice.trim()] : [];
  return [raw];
}

function findFeatByName(name: string, feats: FeatInfo[]): FeatInfo | undefined {
  const normalized = name.trim().toLowerCase();
  if (!normalized) return undefined;
  return feats.find((feat) => feat.name.toLowerCase() === normalized) ?? feats.find((feat) => normalized.startsWith(feat.name.toLowerCase()));
}

export function getBackgroundFeat(background?: BackgroundInfo, custom_feats = readPersistedOriginHomebrew().custom_feats): FeatInfo | undefined {
  if (!background?.feat) return undefined;
  return findFeatByName(background.feat.replace(/\s*\([^)]*\)\s*$/g, ''), getCombinedFeats(custom_feats)) ?? findFeatByName(background.feat, getCombinedFeats(custom_feats));
}

export function getEffectiveFeatIds(selection?: CharacterOriginSelection): string[] {
  const normalized = normalizeOriginSelection(selection);
  const persisted = readPersistedOriginHomebrew();
  const background = getBackgroundInfo(normalized.background_id, persisted.custom_backgrounds);
  const backgroundFeat = getBackgroundFeat(background, persisted.custom_feats);
  return Array.from(new Set([...(normalized.feat_ids ?? []), backgroundFeat?.id].filter(Boolean) as string[]));
}

export function getBackgroundEquipmentChoiceText(background?: BackgroundInfo, choice?: 'A' | 'B'): string {
  if (!background?.equipment || !choice) return '';
  const text = background.equipment;
  const a = text.match(/\(A\)\s*([^;]+?)(?:;\s*or\s*\(B\)|$)/i)?.[1]?.trim();
  const b = text.match(/\(B\)\s*([^;]+)$/i)?.[1]?.trim();
  return choice === 'A' ? (a || text) : (b || text);
}

export function normalizeOriginSelection(selection?: CharacterOriginSelection): CharacterOriginSelection {
  const bonuses: CharacterOriginSelection['background_ability_bonuses'] = {};
  for (const [key, value] of Object.entries(selection?.background_ability_bonuses ?? {})) {
    if (key in ABILITY_LABELS) {
      const amount = Number(value);
      if (Number.isFinite(amount) && amount > 0) bonuses[key as AbilityKey] = Math.min(2, Math.max(0, Math.floor(amount)));
    }
  }
  return {
    background_id: selection?.background_id || undefined,
    species_id: selection?.species_id || undefined,
    feat_ids: Array.isArray(selection?.feat_ids) ? selection.feat_ids.filter(Boolean) : [],
    background_ability_bonuses: Object.keys(bonuses).length ? bonuses : undefined,
    background_tool_choice: selection?.background_tool_choice?.trim() || undefined,
    background_equipment_choice: selection?.background_equipment_choice === 'B' ? 'B' : selection?.background_equipment_choice === 'A' ? 'A' : undefined,
  };
}

export function formatAbilityBonuses(selection?: CharacterOriginSelection): string {
  const bonuses = normalizeOriginSelection(selection).background_ability_bonuses ?? {};
  return (Object.entries(bonuses) as [AbilityKey, number][])
    .filter(([, amount]) => amount > 0)
    .map(([ability, amount]) => `${ABILITY_LABELS[ability]} +${amount}`)
    .join(', ');
}

export function formatOriginSummary(selection?: CharacterOriginSelection): string {
  const normalized = normalizeOriginSelection(selection);
  const persisted = readPersistedOriginHomebrew();
  const background = getBackgroundInfo(normalized.background_id, persisted.custom_backgrounds);
  const species = getSpeciesInfo(normalized.species_id, persisted.custom_species);
  const parts = [species?.name, background?.name].filter(Boolean);
  return parts.join(' · ');
}

export function OriginEditor({
  value,
  onChange,
  title = 'Background, species & feats',
  description = 'Optional. Pick from the imported 2024 lists or custom entries from the Backgrounds / Species / Feats page.',
}: {
  value: CharacterOriginSelection;
  onChange: (next: CharacterOriginSelection) => void;
  title?: string;
  description?: string;
}) {
  const custom_backgrounds = useOriginHomebrewStore((state) => state.custom_backgrounds);
  const custom_species = useOriginHomebrewStore((state) => state.custom_species);
  const custom_feats = useOriginHomebrewStore((state) => state.custom_feats);
  const backgrounds = useMemo(() => getCombinedBackgrounds(custom_backgrounds), [custom_backgrounds]);
  const species = useMemo(() => getCombinedSpecies(custom_species), [custom_species]);
  const feats = useMemo(() => getCombinedFeats(custom_feats), [custom_feats]);
  const normalized = normalizeOriginSelection(value);
  const selectedFeatIds = new Set(normalized.feat_ids ?? []);
  const selectedBackground = backgrounds.find((item) => item.id === normalized.background_id);
  const backgroundFeat = getBackgroundFeat(selectedBackground, custom_feats);
  const abilityOptions = parseBackgroundAbilityOptions(selectedBackground);
  const backgroundSkills = parseBackgroundSkills(selectedBackground);
  const toolNeedsChoice = Boolean(selectedBackground?.tool_proficiency && /^choose\b/i.test(selectedBackground.tool_proficiency.trim()));
  const abilityBonuses = normalized.background_ability_bonuses ?? {};
  const abilityTotal = Object.values(abilityBonuses).reduce((sum, amount) => sum + (Number(amount) || 0), 0);

  const patch = (next: Partial<CharacterOriginSelection>) => onChange(normalizeOriginSelection({ ...normalized, ...next }));
  const toggleFeat = (id: string) => {
    const next = new Set(selectedFeatIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    patch({ feat_ids: Array.from(next) });
  };
  const setAbilityBonus = (ability: AbilityKey, amount: number) => {
    const next = { ...(normalized.background_ability_bonuses ?? {}) };
    if (amount <= 0) delete next[ability];
    else next[ability] = Math.min(2, Math.max(0, amount));
    patch({ background_ability_bonuses: next });
  };

  return (
    <div className="mb-4" style={{ border: '0.5px solid var(--color-border-tertiary)', borderRadius: 'var(--border-radius-md)', background: 'var(--color-background-secondary)', padding: 10 }}>
      <div className="mb-2">
        <div className="text-[12px] font-medium text-text-secondary">{title}</div>
        <div className="text-[10px] text-text-tertiary mt-0.5">{description}</div>
      </div>
      <div className="grid gap-2 mb-3" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <label className="text-[11px] text-text-secondary">Species
          <select className="w-full mt-1" value={normalized.species_id ?? ''} onChange={(e) => patch({ species_id: e.target.value || undefined })}>
            <option value="">No species selected</option>
            {species.map((item) => <option key={item.id} value={item.id}>{item.name}{item.is_custom ? ' (custom)' : ''}</option>)}
          </select>
        </label>
        <label className="text-[11px] text-text-secondary">Background
          <select className="w-full mt-1" value={normalized.background_id ?? ''} onChange={(e) => patch({ background_id: e.target.value || undefined, background_ability_bonuses: undefined, background_tool_choice: undefined, background_equipment_choice: undefined })}>
            <option value="">No background selected</option>
            {backgrounds.map((item) => <option key={item.id} value={item.id}>{item.name}{item.is_custom ? ' (custom)' : ''}</option>)}
          </select>
        </label>
      </div>

      {selectedBackground && (
        <div className="mb-3" style={{ border: '0.5px solid var(--color-border-tertiary)', borderRadius: 'var(--border-radius-md)', background: 'var(--color-background-primary)', padding: 10 }}>
          <div className="text-[12px] font-medium mb-1">Background choices: {selectedBackground.name}</div>
          {abilityOptions.length > 0 && (
            <div className="mb-3">
              <div className="text-[11px] text-text-secondary mb-1">Ability score increases — distribute 3 points among: {abilityOptions.map((a) => ABILITY_LABELS[a]).join(', ')} <span className={abilityTotal === 3 ? 'text-text-info' : 'text-text-danger'}>({abilityTotal}/3)</span></div>
              <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.min(3, abilityOptions.length)}, minmax(0, 1fr))` }}>
                {abilityOptions.map((ability) => (
                  <label key={ability} className="text-[10px] text-text-tertiary">{ABILITY_LABELS[ability]}
                    <select className="w-full mt-1" value={abilityBonuses[ability] ?? 0} onChange={(e) => setAbilityBonus(ability, Number(e.target.value))}>
                      <option value={0}>+0</option>
                      <option value={1}>+1</option>
                      <option value={2}>+2</option>
                    </select>
                  </label>
                ))}
              </div>
              {abilityTotal !== 3 && <div className="text-[10px] text-text-danger mt-1">The background should assign exactly 3 total ability points.</div>}
            </div>
          )}
          {backgroundFeat && (
            <div className="text-[11px] text-text-secondary mb-2">Automatic background feat: <span className="font-medium text-text-primary">{backgroundFeat.name}</span></div>
          )}
          {backgroundSkills.length > 0 && (
            <div className="text-[11px] text-text-secondary mb-2">Automatic skill proficiencies: <span className="font-medium text-text-primary">{backgroundSkills.join(', ')}</span></div>
          )}
          {selectedBackground.tool_proficiency && (
            toolNeedsChoice ? (
              <label className="text-[11px] text-text-secondary block mb-2">Tool proficiency choice
                <input className="w-full mt-1" value={normalized.background_tool_choice ?? ''} onChange={(e) => patch({ background_tool_choice: e.target.value })} placeholder={selectedBackground.tool_proficiency} />
              </label>
            ) : (
              <div className="text-[11px] text-text-secondary mb-2">Automatic tool proficiency: <span className="font-medium text-text-primary">{selectedBackground.tool_proficiency}</span></div>
            )
          )}
          {selectedBackground.equipment && (
            <div>
              <div className="text-[11px] text-text-secondary mb-1">Starting equipment choice</div>
              <div className="grid gap-2" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <label className="text-[11px] text-text-secondary flex gap-2 items-start"><input type="radio" checked={normalized.background_equipment_choice === 'A'} onChange={() => patch({ background_equipment_choice: 'A' })} /> <span><span className="font-medium">A: Equipment/tools</span><br /><span className="text-[10px] text-text-tertiary">{getBackgroundEquipmentChoiceText(selectedBackground, 'A') || 'Equipment package'}</span></span></label>
                <label className="text-[11px] text-text-secondary flex gap-2 items-start"><input type="radio" checked={normalized.background_equipment_choice === 'B'} onChange={() => patch({ background_equipment_choice: 'B' })} /> <span><span className="font-medium">B: Gold</span><br /><span className="text-[10px] text-text-tertiary">{getBackgroundEquipmentChoiceText(selectedBackground, 'B') || 'Gold package'}</span></span></label>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="text-[11px] text-text-secondary mb-1">Additional feats</div>
      <div style={{ maxHeight: 180, overflow: 'auto', border: '0.5px solid var(--color-border-tertiary)', borderRadius: 'var(--border-radius-md)', background: 'var(--color-background-primary)' }}>
        {feats.map((feat) => {
          const isBackgroundFeat = feat.id === backgroundFeat?.id;
          return (
            <label key={feat.id} className="flex items-start gap-2" style={{ padding: '7px 9px', borderBottom: '0.5px solid var(--color-border-tertiary)', opacity: isBackgroundFeat ? 0.75 : 1 }}>
              <input type="checkbox" checked={selectedFeatIds.has(feat.id) || isBackgroundFeat} disabled={isBackgroundFeat} onChange={() => toggleFeat(feat.id)} style={{ marginTop: 2 }} />
              <span>
                <span className="text-[12px] text-text-primary">{feat.name}</span>
                {feat.prerequisite && <span className="text-[10px] text-text-tertiary"> · {feat.prerequisite}</span>}
                {feat.is_custom && <span className="text-[10px] text-text-info"> · custom</span>}
                {isBackgroundFeat && <span className="text-[10px] text-text-info"> · from background</span>}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

export function OriginFeaturesPanel({ selection, compact = false }: { selection?: CharacterOriginSelection; compact?: boolean }) {
  const normalized = normalizeOriginSelection(selection);
  if (!normalized.background_id && !normalized.species_id && (!normalized.feat_ids || normalized.feat_ids.length === 0)) return null;
  const persisted = readPersistedOriginHomebrew();
  const background = getBackgroundInfo(normalized.background_id, persisted.custom_backgrounds);
  const species = getSpeciesInfo(normalized.species_id, persisted.custom_species);
  const feats = getEffectiveFeatIds(normalized).map((id) => getFeatInfo(id, persisted.custom_feats)).filter(Boolean) as FeatInfo[];
  const backgroundSkills = parseBackgroundSkills(background);
  const backgroundTools = parseBackgroundTool(background, normalized);
  const equipment = getBackgroundEquipmentChoiceText(background, normalized.background_equipment_choice);
  const abilitySummary = formatAbilityBonuses(normalized);
  return (
    <div className={compact ? 'mt-2' : 'mb-4'} style={{ border: compact ? 'none' : '0.5px solid var(--color-border-tertiary)', borderRadius: 'var(--border-radius-md)', background: compact ? 'transparent' : 'var(--color-background-secondary)', padding: compact ? 0 : 10 }}>
      {!compact && <div className="text-[12px] font-medium mb-2">Selected background / species / feats</div>}
      <div className="flex flex-wrap gap-1">
        {species && <Chip label={`Species: ${species.name}`} />}
        {background && <Chip label={`Background: ${background.name}`} />}
        {abilitySummary && <Chip label={`Ability bonuses: ${abilitySummary}`} />}
        {backgroundSkills.map((skill) => <Chip key={skill} label={`Skill: ${skill}`} />)}
        {backgroundTools.map((tool) => <Chip key={tool} label={`Tool: ${tool}`} />)}
        {equipment && <Chip label={`Starting equipment: ${normalized.background_equipment_choice}`} />}
        {feats.map((feat) => <Chip key={feat.id} label={`Feat: ${feat.name}`} />)}
      </div>
      {!compact && (
        <div className="mt-3 flex flex-col gap-3">
          {species && <OriginDetail title={species.name} body={[species.description, species.traits].filter(Boolean).join('\n\n')} />}
          {background && <OriginDetail title={background.name} body={background.description} meta={[background.ability_scores && `Ability scores: ${background.ability_scores}`, abilitySummary && `Chosen: ${abilitySummary}`, background.feat && `Feat: ${background.feat}`, backgroundSkills.length > 0 && `Skills: ${backgroundSkills.join(', ')}`, backgroundTools.length > 0 && `Tool: ${backgroundTools.join(', ')}`, equipment && `Equipment: ${equipment}`].filter(Boolean).join(' · ')} />}
          {feats.map((feat) => <OriginDetail key={feat.id} title={feat.name} body={feat.description} meta={feat.prerequisite ? `Prerequisite: ${feat.prerequisite}` : ''} />)}
        </div>
      )}
    </div>
  );
}

function Chip({ label }: { label: string }) {
  return <span className="text-[10px]" style={{ border: '0.5px solid var(--color-border-tertiary)', borderRadius: 999, padding: '3px 7px', background: 'var(--color-background-primary)' }}>{label}</span>;
}

function OriginDetail({ title, meta, body }: { title: string; meta?: string; body: string }) {
  return <div><div className="text-[12px] font-medium">{title}</div>{meta && <div className="text-[10px] text-text-tertiary mb-1">{meta}</div>}<div className="text-[12px] text-text-secondary whitespace-pre-wrap leading-relaxed">{body}</div></div>;
}
