import { useEffect, useMemo, useRef, useState } from 'react';
import { useCampaignStore } from '@/store/campaignStore';
import { useSRDStore } from '@/store/srdStore';
import { readFileAsDataURL } from '@/utils/imageUtils';
import { AvatarCropper } from '@/components/common/AvatarCropper';
import { ClassBuildEditor, normalizeCharacterBuild, formatCharacterBuildSummary } from '@/components/characters/ClassBuildEditor';
import { ClassFeaturesPanel } from '@/components/characters/ClassFeaturesPanel';
import { OriginEditor, OriginFeaturesPanel, formatOriginSummary, getBackgroundEquipmentChoiceText, getEffectiveFeatIds, normalizeOriginSelection, parseBackgroundSkills, parseBackgroundTool } from '@/components/characters/OriginEditor';
import type { Character, MovementSpeeds } from '@/types/app';
import { getBackgroundInfo, readPersistedOriginHomebrew } from '@/store/originHomebrewStore';
import { ABILITY_ROLL_KEYS, ABILITY_ROLL_LABELS, formatAbilityRollSet, rollAbilitySet, type AbilityRollKey } from '@/utils/abilityRolls';
import type { Spell } from '@/types/srd';

export function CharactersPage() {
  const { getActiveCampaign, updateCampaign } = useCampaignStore();
  const active = getActiveCampaign();

  const [show_form, set_show_form] = useState(false);
  const [edit_character, set_edit_character] = useState<Character | null>(null);

  if (!active) {
    return (
      <div className="p-8 text-text-secondary">
        Create or select a campaign first (use the sidebar).
      </div>
    );
  }

  const handleSubmit = (character: Character) => {
    if (edit_character) {
      updateCampaign(active.id, {
        characters: active.characters.map((c) =>
          c.id === character.id ? character : c
        ),
      });
    } else {
      updateCampaign(active.id, {
        characters: [...active.characters, character],
      });
    }
    set_show_form(false);
    set_edit_character(null);
  };

  const handleDeleteCharacter = (id: string) => {
    if (!confirm('Delete this character?')) return;
    updateCampaign(active.id, {
      characters: active.characters.filter((c) => c.id !== id),
    });
  };

  const handleEdit = (character: Character) => {
    set_edit_character(character);
    set_show_form(true);
  };

  const handleNew = () => {
    set_edit_character(null);
    set_show_form(true);
  };

  return (
    <div className="page-padding max-w-[1200px]">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-y-3">
        <div>
          <div className="text-[11px] text-text-tertiary mb-1">{active.name}</div>
          <h2>Characters</h2>
        </div>
        {!show_form && (
          <button
            onClick={handleNew}
            className="bg-accent-50 border-accent-300 text-accent-900 font-medium"
            style={{ padding: '8px 14px', fontSize: '13px' }}
          >
            + Add character
          </button>
        )}
      </div>

      {show_form && (
        <CharacterForm
          initial={edit_character ?? undefined}
          onSubmit={handleSubmit}
          onCancel={() => {
            set_show_form(false);
            set_edit_character(null);
          }}
        />
      )}

      {active.characters.length === 0 && !show_form ? (
        <div className="text-text-tertiary text-[13px] italic mt-4">
          No characters yet. Click "+ Add character" to start.
        </div>
      ) : (
        <div
          className="grid gap-3"
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}
        >
          {active.characters.map((c) => (
            <CharacterCard
              key={c.id}
              character={c}
              onEdit={() => handleEdit(c)}
              onDelete={() => handleDeleteCharacter(c.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CharacterCard({
  character,
  onEdit,
  onDelete,
}: {
  character: Character;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const hp_pct = Math.round((character.hp_current / character.hp_max) * 100);
  const hp_color =
    hp_pct > 60 ? '#639922' : hp_pct > 30 ? '#BA7517' : '#A03333';
  const build_summary = formatCharacterBuildSummary(character.character_build);
  const origin_summary = formatOriginSummary(character.origin_selection);

  return (
    <div
      className="bg-bg-primary"
      style={{
        padding: '14px',
        border: '0.5px solid var(--color-border-tertiary)',
        borderRadius: 'var(--border-radius-md)',
      }}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: character.avatar
                ? `url(${character.avatar})`
                : '#3B82F6',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              border: '1.5px solid #1E40AF',
              color: '#fff',
              fontWeight: 700,
              fontSize: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {!character.avatar && character.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="text-[14px] font-medium">{character.name}</div>
            {(build_summary || character.class || character.species) && (
              <div className="text-[11px] text-text-secondary">
                {build_summary || (
                  <>
                    {character.class}
                    {character.level && ` ${character.level}`}
                  </>
                )}
                {(origin_summary || character.species) && ` · ${origin_summary || character.species}`}
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-1">
          <button
            onClick={onEdit}
            style={{
              fontSize: '11px',
              padding: '3px 8px',
              border: 'none',
              background: 'transparent',
              color: 'var(--color-text-secondary)',
              cursor: 'pointer',
            }}
            aria-label="Edit"
            title="Edit"
          >
            ✎
          </button>
          <button
            onClick={onDelete}
            className="text-text-tertiary"
            style={{
              border: 'none',
              background: 'transparent',
              padding: '0 4px',
              fontSize: '14px',
              cursor: 'pointer',
            }}
            aria-label="Delete"
            title="Delete"
          >
            ×
          </button>
        </div>
      </div>
      <div className="flex gap-2 items-center mb-2">
        <div
          style={{
            height: '4px',
            background: 'var(--color-background-secondary)',
            borderRadius: '2px',
            flex: 1,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${hp_pct}%`,
              height: '100%',
              background: hp_color,
            }}
          />
        </div>
        <span className="text-[11px]">
          {character.hp_current}/{character.hp_max}
        </span>
      </div>
      <div className="flex gap-3 text-[11px] text-text-tertiary">
        <span>AC {character.ac}</span>
        <span>
          Init {character.initiative_bonus >= 0 ? '+' : ''}
          {character.initiative_bonus}
        </span>
        <span>Speed {character.speed}ft</span>
      </div>
      {character.spell_ids && character.spell_ids.length > 0 && (
        <div className="mt-2 text-[11px] text-text-info">
          ✦ {character.spell_ids.length} selected spell{character.spell_ids.length === 1 ? '' : 's'}
        </div>
      )}
      <OriginFeaturesPanel selection={character.origin_selection} compact />
      <ClassFeaturesPanel build={character.character_build} compact />
    </div>
  );
}

function CharacterForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial?: Character;
  onSubmit: (c: Character) => void;
  onCancel: () => void;
}) {
  const [name, set_name] = useState(initial?.name ?? '');
  const [class_name, set_class] = useState(initial?.class ?? '');
  const [level, set_level] = useState(initial?.level ? String(initial.level) : '');
  const [species, set_species] = useState(initial?.species ?? '');
  const [origin_selection, set_origin_selection] = useState(() => normalizeOriginSelection(initial?.origin_selection));
  const [hp_max, set_hp_max] = useState(String(initial?.hp_max ?? ''));
  const [hp_current, set_hp_current] = useState(
    String(initial?.hp_current ?? initial?.hp_max ?? '')
  );
  const [ac, set_ac] = useState(String(initial?.ac ?? ''));
  const [speed, set_speed] = useState(String(initial?.movement_speeds?.walk ?? initial?.speed ?? 30));
  const [has_climb_speed, set_has_climb_speed] = useState(initial?.movement_speeds?.climb !== undefined);
  const [climb_speed, set_climb_speed] = useState(initial?.movement_speeds?.climb !== undefined ? String(initial.movement_speeds.climb) : '');
  const [has_swim_speed, set_has_swim_speed] = useState(initial?.movement_speeds?.swim !== undefined);
  const [swim_speed, set_swim_speed] = useState(initial?.movement_speeds?.swim !== undefined ? String(initial.movement_speeds.swim) : '');
  const [has_fly_speed, set_has_fly_speed] = useState(initial?.movement_speeds?.fly !== undefined);
  const [fly_speed, set_fly_speed] = useState(initial?.movement_speeds?.fly !== undefined ? String(initial.movement_speeds.fly) : '');
  const [init, set_init] = useState(String(initial?.initiative_bonus ?? 0));
  const [str, set_str] = useState(String(initial?.abilities?.str ?? 10));
  const [dex, set_dex] = useState(String(initial?.abilities?.dex ?? 10));
  const [con, set_con] = useState(String(initial?.abilities?.con ?? 10));
  const [int_, set_int] = useState(String(initial?.abilities?.int ?? 10));
  const [wis, set_wis] = useState(String(initial?.abilities?.wis ?? 10));
  const [cha, set_cha] = useState(String(initial?.abilities?.cha ?? 10));
  const [ability_roll_summary, set_ability_roll_summary] = useState('');
  const [notes, set_notes] = useState(initial?.notes ?? '');
  const [avatar, set_avatar] = useState<string | undefined>(initial?.avatar);
  const [spell_ids, set_spell_ids] = useState<string[]>(initial?.spell_ids ?? []);
  const [weapons, set_weapons] = useState<NonNullable<Character['weapons']>>(
    initial?.weapons ?? []
  );
  const [character_build, set_character_build] = useState(() =>
    normalizeCharacterBuild(initial?.character_build)
  );
  const [spell_query, set_spell_query] = useState('');
  const [spell_level_filter, set_spell_level_filter] = useState<string>('all');
  const [is_uploading, set_is_uploading] = useState(false);
  const [crop_src, set_crop_src] = useState<string | null>(null);

  const file_input_ref = useRef<HTMLInputElement>(null);
  const { loaded, loading, spells, load } = useSRDStore();

  useEffect(() => {
    load();
  }, [load]);

  const selected_spells = useMemo(() => {
    const ids = new Set(spell_ids);
    return spells
      .filter((spell) => ids.has(spell.id))
      .sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));
  }, [spell_ids, spells]);

  const available_spells = useMemo(() => {
    const query = spell_query.trim().toLowerCase();
    const selected = new Set(spell_ids);
    return spells
      .filter((spell) => {
        if (selected.has(spell.id)) return false;
        if (spell_level_filter !== 'all' && spell.level !== Number(spell_level_filter)) return false;
        if (!query) return true;
        return (
          spell.name.toLowerCase().includes(query) ||
          spell.school.toLowerCase().includes(query) ||
          spell.classes.some((cls) => cls.toLowerCase().includes(query)) ||
          spell.description.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => a.level - b.level || a.name.localeCompare(b.name))
      .slice(0, 80);
  }, [spell_ids, spell_level_filter, spell_query, spells]);

  const addSpell = (spell: Spell) => {
    set_spell_ids((current) =>
      current.includes(spell.id) ? current : [...current, spell.id]
    );
  };

  const removeSpell = (spell_id: string) => {
    set_spell_ids((current) => current.filter((id) => id !== spell_id));
  };

  const ability_setters: Record<AbilityRollKey, (value: string) => void> = {
    str: set_str,
    dex: set_dex,
    con: set_con,
    int: set_int,
    wis: set_wis,
    cha: set_cha,
  };

  const ability_values: Record<AbilityRollKey, string> = {
    str,
    dex,
    con,
    int: int_,
    wis,
    cha,
  };

  const rollAllAbilities = () => {
    const rolls = rollAbilitySet();
    ABILITY_ROLL_KEYS.forEach((key) => ability_setters[key](String(rolls[key].total)));
    set_ability_roll_summary(formatAbilityRollSet(rolls));
  };

  const abilityModifier = (score: number) => Math.floor((score - 10) / 2);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please choose an image file.');
      return;
    }
    set_is_uploading(true);
    try {
      const data_url = await readFileAsDataURL(file);
      // Open the cropper instead of auto-cropping
      set_crop_src(data_url);
    } catch (err: any) {
      alert(`Failed to load image: ${err.message ?? err}`);
    } finally {
      set_is_uploading(false);
      if (file_input_ref.current) file_input_ref.current.value = '';
    }
  };

  const handleSubmit = () => {
    if (!name || !hp_max || !ac) {
      alert('Name, HP, and AC are required');
      return;
    }
    const hp_max_n = parseInt(hp_max, 10);
    const hp_current_n = parseInt(hp_current, 10) || hp_max_n;
    if (origin_selection.background_id) {
      const total_background_bonus = Object.values(origin_selection.background_ability_bonuses ?? {}).reduce((sum, value) => sum + (Number(value) || 0), 0);
      if (total_background_bonus !== 3) {
        alert('A selected background needs exactly 3 assigned ability-score points.');
        return;
      }
      const persistedOriginsForValidation = readPersistedOriginHomebrew();
      const selectedBackground = getBackgroundInfo(origin_selection.background_id, persistedOriginsForValidation.custom_backgrounds);
      if (selectedBackground?.tool_proficiency && /^choose\b/i.test(selectedBackground.tool_proficiency.trim()) && !origin_selection.background_tool_choice?.trim()) {
        alert('Please choose the background tool proficiency.');
        return;
      }
      if (selectedBackground?.equipment && !origin_selection.background_equipment_choice) {
        alert('Please choose starting equipment A or gold B for the selected background.');
        return;
      }
    }
    const persistedOrigins = readPersistedOriginHomebrew();
    const background = getBackgroundInfo(origin_selection.background_id, persistedOrigins.custom_backgrounds);
    const background_skill_proficiencies = parseBackgroundSkills(background);
    const background_tool_proficiencies = parseBackgroundTool(background, origin_selection);
    const background_equipment = getBackgroundEquipmentChoiceText(background, origin_selection.background_equipment_choice);
    const effective_feat_ids = getEffectiveFeatIds(origin_selection);
    const base_walk_speed = parseInt(speed, 10) || 30;
    const movement_speeds: MovementSpeeds = { walk: base_walk_speed };
    if (has_climb_speed) movement_speeds.climb = parseInt(climb_speed, 10) || base_walk_speed;
    if (has_swim_speed) movement_speeds.swim = parseInt(swim_speed, 10) || base_walk_speed;
    if (has_fly_speed) movement_speeds.fly = parseInt(fly_speed, 10) || base_walk_speed;
    const character: Character = {
      id: initial?.id ?? crypto.randomUUID(),
      name,
      type: 'pc',
      class: class_name || undefined,
      level: level ? parseInt(level, 10) : undefined,
      species: species || undefined,
      origin_selection: (origin_selection.background_id || origin_selection.species_id || effective_feat_ids.length > 0) ? { ...origin_selection, feat_ids: effective_feat_ids } : undefined,
      hp_max: hp_max_n,
      hp_current: Math.min(hp_current_n, hp_max_n),
      ac: parseInt(ac, 10),
      speed: base_walk_speed,
      movement_speeds,
      initiative_bonus: parseInt(init, 10) || 0,
      avatar,
      notes: notes || undefined,
      abilities: {
        str: parseInt(str, 10) || 10,
        dex: parseInt(dex, 10) || 10,
        con: parseInt(con, 10) || 10,
        int: parseInt(int_, 10) || 10,
        wis: parseInt(wis, 10) || 10,
        cha: parseInt(cha, 10) || 10,
      },
      save_proficiencies: initial?.save_proficiencies,
      skill_proficiencies: Array.from(new Set([...(initial?.skill_proficiencies ?? []), ...background_skill_proficiencies])),
      tool_proficiencies: Array.from(new Set([...(initial?.tool_proficiencies ?? []), ...background_tool_proficiencies])),
      starting_equipment: background_equipment || initial?.starting_equipment,
      weapons: weapons.length > 0 ? weapons : undefined,
      spell_ids,
      character_build: character_build.enabled ? character_build : undefined,
    };
    onSubmit(character);
  };

  return (
    <div
      className="bg-bg-primary mb-4"
      style={{
        padding: '20px 22px',
        border: '0.5px solid var(--color-border-tertiary)',
        borderRadius: 'var(--border-radius-md)',
        boxSizing: 'border-box',
      }}
    >
      <div className="text-[14px] font-medium mb-4">
        {initial ? `Edit ${initial.name}` : 'Add new character'}
      </div>

      {/* Avatar section */}
      <div className="flex items-center gap-3 mb-5">
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: avatar ? `url(${avatar})` : '#3B82F6',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            border: '2px solid #1E40AF',
            color: '#fff',
            fontWeight: 700,
            fontSize: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {!avatar && (name ? name.charAt(0).toUpperCase() : '?')}
        </div>
        <div>
          <input
            type="file"
            accept="image/*"
            ref={file_input_ref}
            onChange={handleAvatarChange}
            style={{ display: 'none' }}
          />
          <button
            onClick={() => file_input_ref.current?.click()}
            disabled={is_uploading}
            style={{ fontSize: '12px', padding: '6px 12px' }}
          >
            {is_uploading ? 'Uploading…' : avatar ? 'Change avatar' : '+ Upload avatar'}
          </button>
          {avatar && (
            <button
              onClick={() => set_avatar(undefined)}
              style={{
                fontSize: '12px',
                padding: '6px 12px',
                marginLeft: 6,
                color: 'var(--color-text-tertiary)',
              }}
            >
              Remove
            </button>
          )}
          <div className="text-[10px] text-text-tertiary mt-1">
            Square crop · max 256×256 · auto-compressed
          </div>
        </div>
      </div>

      {/* Identity row: 4 fields with labels */}
      <div
        className="grid gap-3 mb-3"
        style={{
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        }}
      >
        <FormField label="Name *" required>
          <input
            value={name}
            onChange={(e) => set_name(e.target.value)}
            placeholder="Character name"
            style={{ width: '100%', boxSizing: 'border-box' }}
          />
        </FormField>
        <FormField label="Class">
          <input
            value={class_name}
            onChange={(e) => set_class(e.target.value)}
            placeholder="e.g. Bard"
            style={{ width: '100%', boxSizing: 'border-box' }}
          />
        </FormField>
        <FormField label="Level">
          <input
            value={level}
            onChange={(e) => set_level(e.target.value)}
            placeholder="1-20"
            style={{ width: '100%', boxSizing: 'border-box' }}
          />
        </FormField>
        <FormField label="Species">
          <input
            value={species}
            onChange={(e) => set_species(e.target.value)}
            placeholder="e.g. Human"
            style={{ width: '100%', boxSizing: 'border-box' }}
          />
        </FormField>
      </div>

      <OriginEditor
        value={origin_selection}
        onChange={set_origin_selection}
      />

      <ClassBuildEditor
        build={character_build}
        onChange={set_character_build}
        title="Optional D&D 2024 class/subclass builder"
        description="Choose main class, subclass, and multiclass levels. Only features unlocked by the selected class level are shown."
      />

      {/* Stats row: 5 fields with labels */}
      <div
        className="grid gap-3 mb-4"
        style={{
          gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
        }}
      >
        <FormField label="HP max *" required>
          <input
            value={hp_max}
            onChange={(e) => set_hp_max(e.target.value)}
            placeholder="60"
            style={{ width: '100%', boxSizing: 'border-box' }}
          />
        </FormField>
        <FormField label="HP current">
          <input
            value={hp_current}
            onChange={(e) => set_hp_current(e.target.value)}
            placeholder="60"
            style={{ width: '100%', boxSizing: 'border-box' }}
          />
        </FormField>
        <FormField label="AC *" required>
          <input
            value={ac}
            onChange={(e) => set_ac(e.target.value)}
            placeholder="15"
            style={{ width: '100%', boxSizing: 'border-box' }}
          />
        </FormField>
        <FormField label="Speed (ft)">
          <input
            value={speed}
            onChange={(e) => set_speed(e.target.value)}
            placeholder="30"
            style={{ width: '100%', boxSizing: 'border-box' }}
          />
        </FormField>
        <div className="md:col-span-2" style={{ gridColumn: '1 / -1' }}>
          <div className="text-[11px] text-text-tertiary mb-2">
            Optional movement modes for battle map range previews
          </div>
          <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
            <MovementModeInput
              label="Climb speed"
              enabled={has_climb_speed}
              value={climb_speed}
              fallback={speed}
              onEnabledChange={set_has_climb_speed}
              onValueChange={set_climb_speed}
            />
            <MovementModeInput
              label="Swim speed"
              enabled={has_swim_speed}
              value={swim_speed}
              fallback={speed}
              onEnabledChange={set_has_swim_speed}
              onValueChange={set_swim_speed}
            />
            <MovementModeInput
              label="Fly speed"
              enabled={has_fly_speed}
              value={fly_speed}
              fallback={speed}
              onEnabledChange={set_has_fly_speed}
              onValueChange={set_fly_speed}
            />
          </div>
        </div>
        <FormField label="Init bonus">
          <input
            value={init}
            onChange={(e) => set_init(e.target.value)}
            placeholder="+2"
            style={{ width: '100%', boxSizing: 'border-box' }}
          />
        </FormField>
      </div>


      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="text-[12px] font-medium text-text-secondary">Ability scores</div>
          <button
            type="button"
            onClick={rollAllAbilities}
            className="bg-accent-50 border-accent-300 text-accent-900 font-medium"
            style={{ padding: '6px 10px', fontSize: '12px' }}
            title="Roll 4d6 for each ability, drop the lowest die, and total the remaining three dice."
          >
            🎲 Roll abilities (4d6 drop lowest)
          </button>
        </div>
        <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))' }}>
          {ABILITY_ROLL_KEYS.map((ability) => {
            const value = ability_values[ability];
            const score = parseInt(value, 10) || 10;
            const mod = abilityModifier(score);
            return (
              <div key={ability}>
                <div className="text-[11px] text-text-tertiary text-center mb-1">
                  {ABILITY_ROLL_LABELS[ability]}
                </div>
                <input
                  value={value}
                  onChange={(e) => ability_setters[ability](e.target.value)}
                  className="w-full text-center"
                />
                <div className="text-[10px] text-text-tertiary text-center mt-1">
                  {mod >= 0 ? `+${mod}` : mod}
                </div>
              </div>
            );
          })}
        </div>
        {ability_roll_summary && (
          <div className="text-[10px] text-text-tertiary mt-2" style={{ lineHeight: 1.45 }}>
            {ability_roll_summary}
          </div>
        )}
      </div>

      <SpellPicker
        loaded={loaded}
        loading={loading}
        query={spell_query}
        onQueryChange={set_spell_query}
        levelFilter={spell_level_filter}
        onLevelFilterChange={set_spell_level_filter}
        selectedSpells={selected_spells}
        availableSpells={available_spells}
        onAdd={addSpell}
        onRemove={removeSpell}
      />

      <OriginFeaturesPanel selection={origin_selection} />
      <ClassFeaturesPanel build={character_build} />

      <WeaponsEditor weapons={weapons} onChange={set_weapons} />

      <FormField label="Capabilities & notes (visible to DM during combat)">
        <textarea
          value={notes}
          onChange={(e) => set_notes(e.target.value)}
          placeholder="Class features, spells known, special abilities..."
          style={{
            width: '100%',
            minHeight: '70px',
            fontSize: '12px',
            resize: 'vertical',
            boxSizing: 'border-box',
          }}
        />
      </FormField>

      <div className="flex gap-2 mt-4">
        <button
          onClick={handleSubmit}
          className="bg-accent-50 border-accent-300 text-accent-900 font-medium"
          style={{ padding: '8px 16px', fontSize: '13px' }}
        >
          {initial ? 'Save changes' : 'Save character'}
        </button>
        <button
          onClick={onCancel}
          style={{ padding: '8px 16px', fontSize: '13px' }}
        >
          Cancel
        </button>
      </div>

      {crop_src && (
        <AvatarCropper
          src={crop_src}
          title="Position the character avatar"
          onSave={(data_url) => {
            set_avatar(data_url);
            set_crop_src(null);
          }}
          onCancel={() => set_crop_src(null)}
        />
      )}
    </div>
  );
}


function formatSpellLevel(level: number): string {
  return level === 0 ? 'Cantrip' : `Level ${level}`;
}

function formatSpellMeta(spell: Spell): string {
  const tags = [formatSpellLevel(spell.level), spell.school];
  if (spell.ritual) tags.push('Ritual');
  if (spell.concentration) tags.push('Concentration');
  if (spell.classes.length > 0) tags.push(spell.classes.join(', '));
  return tags.join(' · ');
}

function SpellPicker({
  loaded,
  loading,
  query,
  onQueryChange,
  levelFilter,
  onLevelFilterChange,
  selectedSpells,
  availableSpells,
  onAdd,
  onRemove,
}: {
  loaded: boolean;
  loading: boolean;
  query: string;
  onQueryChange: (value: string) => void;
  levelFilter: string;
  onLevelFilterChange: (value: string) => void;
  selectedSpells: Spell[];
  availableSpells: Spell[];
  onAdd: (spell: Spell) => void;
  onRemove: (spellId: string) => void;
}) {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="text-[12px] font-medium">Spells</div>
          <div className="text-[10px] text-text-tertiary">
            Pick from the SRD spell list. Search by name, class, school, or text; filter by spell level.
          </div>
        </div>
        <div className="text-[11px] text-text-tertiary">
          {selectedSpells.length} selected
        </div>
      </div>

      {selectedSpells.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {selectedSpells.map((spell) => (
            <button
              key={spell.id}
              type="button"
              onClick={() => onRemove(spell.id)}
              title="Remove spell"
              className="bg-accent-50 border-accent-300 text-accent-900"
              style={{
                padding: '5px 8px',
                fontSize: '11px',
                borderRadius: '999px',
              }}
            >
              {spell.name} <span className="text-text-tertiary">({formatSpellLevel(spell.level)})</span> ×
            </button>
          ))}
        </div>
      )}

      <div
        className="grid gap-2 mb-2"
        style={{ gridTemplateColumns: 'minmax(0, 1fr) 150px' }}
      >
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search spells..."
          style={{ width: '100%', boxSizing: 'border-box' }}
        />
        <select
          value={levelFilter}
          onChange={(e) => onLevelFilterChange(e.target.value)}
          style={{ width: '100%', boxSizing: 'border-box' }}
        >
          <option value="all">All levels</option>
          <option value="0">Cantrips</option>
          {Array.from({ length: 9 }, (_, i) => i + 1).map((level) => (
            <option key={level} value={String(level)}>
              Level {level}
            </option>
          ))}
        </select>
      </div>

      <div
        style={{
          maxHeight: 260,
          overflow: 'auto',
          border: '0.5px solid var(--color-border-tertiary)',
          borderRadius: 'var(--border-radius-md)',
          background: 'var(--color-background-secondary)',
        }}
      >
        {loading && (
          <div className="text-[12px] text-text-tertiary" style={{ padding: 12 }}>
            Loading spells…
          </div>
        )}
        {!loading && !loaded && (
          <div className="text-[12px] text-text-tertiary" style={{ padding: 12 }}>
            Spell list could not be loaded yet.
          </div>
        )}
        {loaded && availableSpells.length === 0 && (
          <div className="text-[12px] text-text-tertiary" style={{ padding: 12 }}>
            No matching spells.
          </div>
        )}
        {availableSpells.map((spell) => (
          <button
            key={spell.id}
            type="button"
            onClick={() => onAdd(spell)}
            style={{
              display: 'block',
              width: '100%',
              textAlign: 'left',
              padding: '9px 12px',
              border: 'none',
              borderBottom: '0.5px solid var(--color-border-tertiary)',
              borderRadius: 0,
              background: 'transparent',
              cursor: 'pointer',
            }}
          >
            <div className="flex justify-between gap-3">
              <span className="text-[12px] font-medium text-text-primary">{spell.name}</span>
              <span className="text-[10px] text-text-tertiary" style={{ whiteSpace: 'nowrap' }}>
                + Add
              </span>
            </div>
            <div className="text-[10px] text-text-tertiary mt-1">
              {formatSpellMeta(spell)}
            </div>
            <div className="text-[11px] text-text-secondary mt-1" style={{ lineHeight: 1.35 }}>
              {spell.casting_time ?? '—'} · {spell.range ?? '—'} · {spell.duration ?? '—'}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}


function MovementModeInput({
  label,
  enabled,
  value,
  fallback,
  onEnabledChange,
  onValueChange,
}: {
  label: string;
  enabled: boolean;
  value: string;
  fallback: string;
  onEnabledChange: (enabled: boolean) => void;
  onValueChange: (value: string) => void;
}) {
  return (
    <label
      className="flex items-center gap-2 text-[11px] text-text-secondary"
      style={{
        padding: '8px',
        border: '0.5px solid var(--color-border-tertiary)',
        borderRadius: 'var(--border-radius-sm)',
      }}
    >
      <input
        type="checkbox"
        checked={enabled}
        onChange={(e) => {
          onEnabledChange(e.target.checked);
          if (e.target.checked && !value.trim()) onValueChange(fallback || '30');
        }}
      />
      <span className="shrink-0">{label}</span>
      <input
        type="number"
        min={0}
        disabled={!enabled}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        placeholder={fallback || '30'}
        style={{ width: 76, marginLeft: 'auto' }}
      />
    </label>
  );
}

/**
 * A labeled form field. Label sits above the input.
 */
function FormField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  // Strip any trailing " *" from the label so we don't double up the asterisk
  const clean_label = label.replace(/\s*\*\s*$/, '');
  return (
    <div style={{ minWidth: 0 }}>
      <label
        style={{
          display: 'block',
          fontSize: '11px',
          color: 'var(--color-text-secondary)',
          marginBottom: '4px',
          fontWeight: 500,
        }}
      >
        {clean_label}
        {required && <span style={{ color: 'var(--color-text-danger)' }}> *</span>}
      </label>
      {children}
    </div>
  );
}

// =============================================================================
// Weapons editor: add / edit / remove weapon attacks for the character
// =============================================================================

function WeaponsEditor({
  weapons,
  onChange,
}: {
  weapons: NonNullable<Character['weapons']>;
  onChange: (weapons: NonNullable<Character['weapons']>) => void;
}) {
  const update = (
    index: number,
    patch: Partial<NonNullable<Character['weapons']>[number]>
  ) => {
    const next = weapons.slice();
    next[index] = { ...next[index], ...patch };
    onChange(next);
  };

  const remove = (index: number) => {
    onChange(weapons.filter((_, i) => i !== index));
  };

  const add = () => {
    onChange([
      ...weapons,
      {
        name: '',
        attack_bonus: 0,
        damage: '1d6',
        damage_type: 'slashing',
      },
    ]);
  };

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <div className="text-[12px] font-medium">Weapon attacks</div>
        <button
          onClick={add}
          type="button"
          style={{ fontSize: 11, padding: '5px 10px' }}
        >
          + Add weapon
        </button>
      </div>

      {weapons.length === 0 ? (
        <div className="text-[11px] text-text-tertiary italic">
          No weapons yet. Click "Add weapon" to define an attack for combat (gets
          clickable Attack / Damage / Crit buttons during fights).
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {weapons.map((w, i) => (
            <div
              key={i}
              className="grid gap-2 items-end"
              style={{
                gridTemplateColumns:
                  'repeat(auto-fit, minmax(110px, 1fr))',
                padding: '10px 12px',
                background: 'var(--color-background-secondary)',
                borderRadius: 'var(--border-radius-md)',
              }}
            >
              <label className="text-[10px] text-text-tertiary">
                Name
                <input
                  value={w.name}
                  onChange={(e) => update(i, { name: e.target.value })}
                  placeholder="Longsword"
                  style={{ width: '100%', boxSizing: 'border-box', marginTop: 2 }}
                />
              </label>
              <label className="text-[10px] text-text-tertiary">
                To hit
                <input
                  type="number"
                  value={w.attack_bonus}
                  onChange={(e) =>
                    update(i, { attack_bonus: parseInt(e.target.value, 10) || 0 })
                  }
                  placeholder="+5"
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    marginTop: 2,
                  }}
                />
              </label>
              <label className="text-[10px] text-text-tertiary">
                Damage
                <input
                  value={w.damage}
                  onChange={(e) => update(i, { damage: e.target.value })}
                  placeholder="1d8+3"
                  style={{ width: '100%', boxSizing: 'border-box', marginTop: 2 }}
                />
              </label>
              <label className="text-[10px] text-text-tertiary">
                Damage type
                <select
                  value={w.damage_type}
                  onChange={(e) => update(i, { damage_type: e.target.value })}
                  style={{ width: '100%', boxSizing: 'border-box', marginTop: 2 }}
                >
                  {[
                    'acid',
                    'bludgeoning',
                    'cold',
                    'fire',
                    'force',
                    'lightning',
                    'necrotic',
                    'piercing',
                    'poison',
                    'psychic',
                    'radiant',
                    'slashing',
                    'thunder',
                  ].map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>
              <button
                onClick={() => remove(i)}
                type="button"
                title="Remove this weapon"
                style={{
                  fontSize: 11,
                  padding: '6px 10px',
                  color: 'var(--color-text-danger)',
                  borderColor: 'var(--color-border-danger)',
                  alignSelf: 'end',
                }}
              >
                Remove
              </button>
            </div>
          ))}

          <div className="text-[10px] text-text-tertiary mt-1">
            Tip: Damage supports compound formulas like <code>1d8+1d6+3</code>{' '}
            (e.g. for Divine Smite or Sneak Attack). During combat, you'll see
            Attack / Damage / Crit buttons that auto-roll these.
          </div>
        </div>
      )}
    </div>
  );
}
