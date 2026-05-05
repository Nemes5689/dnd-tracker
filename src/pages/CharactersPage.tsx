import { useState, useRef } from 'react';
import { useCampaignStore } from '@/store/campaignStore';
import { readFileAsDataURL } from '@/utils/imageUtils';
import { AvatarCropper } from '@/components/common/AvatarCropper';
import type { Character } from '@/types/app';

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
    <div className="p-8 max-w-[900px]">
      <div className="flex justify-between items-center mb-6">
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
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}
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
            {(character.class || character.species) && (
              <div className="text-[11px] text-text-secondary">
                {character.class}
                {character.level && ` ${character.level}`}
                {character.species && ` · ${character.species}`}
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
  const [hp_max, set_hp_max] = useState(String(initial?.hp_max ?? ''));
  const [hp_current, set_hp_current] = useState(
    String(initial?.hp_current ?? initial?.hp_max ?? '')
  );
  const [ac, set_ac] = useState(String(initial?.ac ?? ''));
  const [speed, set_speed] = useState(String(initial?.speed ?? 30));
  const [init, set_init] = useState(String(initial?.initiative_bonus ?? 0));
  const [notes, set_notes] = useState(initial?.notes ?? '');
  const [avatar, set_avatar] = useState<string | undefined>(initial?.avatar);
  const [is_uploading, set_is_uploading] = useState(false);
  const [crop_src, set_crop_src] = useState<string | null>(null);

  const file_input_ref = useRef<HTMLInputElement>(null);

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
    const character: Character = {
      id: initial?.id ?? crypto.randomUUID(),
      name,
      type: 'pc',
      class: class_name || undefined,
      level: level ? parseInt(level, 10) : undefined,
      species: species || undefined,
      hp_max: hp_max_n,
      hp_current: Math.min(hp_current_n, hp_max_n),
      ac: parseInt(ac, 10),
      speed: parseInt(speed, 10) || 30,
      initiative_bonus: parseInt(init, 10) || 0,
      avatar,
      notes: notes || undefined,
      abilities: initial?.abilities,
      save_proficiencies: initial?.save_proficiencies,
      weapons: initial?.weapons,
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
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
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

      {/* Stats row: 5 fields with labels */}
      <div
        className="grid gap-3 mb-4"
        style={{
          gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
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
        <FormField label="Init bonus">
          <input
            value={init}
            onChange={(e) => set_init(e.target.value)}
            placeholder="+2"
            style={{ width: '100%', boxSizing: 'border-box' }}
          />
        </FormField>
      </div>

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
