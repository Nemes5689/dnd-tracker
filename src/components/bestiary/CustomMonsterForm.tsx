import { useState, useRef } from 'react';
import { useCustomMonsterStore } from '@/store/customMonsterStore';
import { useAlliesStore } from '@/store/alliesStore';
import { processAvatarFile, processGalleryImage, formatBytes } from '@/utils/imageUtils';
import type { Monster, MonsterFeature } from '@/types/srd';

interface Props {
  initial?: Partial<Monster>;
  // If editing an existing custom monster (not duplicating)
  edit_id?: string;
  // If true, save to allies store instead of custom monsters store
  ally_mode?: boolean;
  onClose: () => void;
  onSaved?: (id: string) => void;
}

export function CustomMonsterForm({ initial, edit_id, ally_mode, onClose, onSaved }: Props) {
  const { addMonster, updateMonster } = useCustomMonsterStore();
  const { addAlly, updateAlly } = useAlliesStore();

  const [name, set_name] = useState(initial?.name ?? '');
  const [size, set_size] = useState(initial?.size ?? 'Medium');
  const [type_, set_type] = useState(initial?.type ?? 'Humanoid');
  const [alignment, set_alignment] = useState(initial?.alignment ?? 'Neutral');
  const [cr, set_cr] = useState(initial?.cr ?? '1');
  const [hp, set_hp] = useState(String(initial?.hp ?? 10));
  const [ac, set_ac] = useState(String(initial?.ac ?? 12));
  const [speed_walk, set_speed_walk] = useState(
    String(initial?.speed?.walk ?? 30)
  );
  const [init_mod, set_init_mod] = useState(
    String(initial?.initiative?.modifier ?? 0)
  );

  const [str, set_str] = useState(String(initial?.abilities?.str?.score ?? 10));
  const [dex, set_dex] = useState(String(initial?.abilities?.dex?.score ?? 10));
  const [con, set_con] = useState(String(initial?.abilities?.con?.score ?? 10));
  const [int_, set_int] = useState(String(initial?.abilities?.int?.score ?? 10));
  const [wis, set_wis] = useState(String(initial?.abilities?.wis?.score ?? 10));
  const [cha, set_cha] = useState(String(initial?.abilities?.cha?.score ?? 10));

  const [traits, set_traits] = useState<MonsterFeature[]>(
    initial?.traits ?? []
  );
  const [actions, set_actions] = useState<MonsterFeature[]>(
    initial?.actions ?? []
  );
  const [bonus_actions, set_bonus_actions] = useState<MonsterFeature[]>(
    initial?.bonus_actions ?? []
  );
  const [reactions, set_reactions] = useState<MonsterFeature[]>(
    initial?.reactions ?? []
  );
  const [legendary_actions, set_legendary_actions] = useState<MonsterFeature[]>(
    initial?.legendary_actions ?? []
  );

  // Avatar & gallery (only meaningful in ally_mode for now, but type allows it
  // for custom monsters too — we'll wire up the UI for ally_mode only).
  const [avatar, set_avatar] = useState<string | undefined>(initial?.avatar);
  const [gallery, set_gallery] = useState<string[]>(initial?.gallery ?? []);
  const [is_uploading, set_is_uploading] = useState(false);

  const avatar_input_ref = useRef<HTMLInputElement>(null);
  const gallery_input_ref = useRef<HTMLInputElement>(null);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    set_is_uploading(true);
    try {
      const processed = await processAvatarFile(file);
      set_avatar(processed.data_url);
    } catch (err: any) {
      alert(`Failed to load image: ${err.message ?? err}`);
    } finally {
      set_is_uploading(false);
      if (avatar_input_ref.current) avatar_input_ref.current.value = '';
    }
  };

  const handleGalleryAdd = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    set_is_uploading(true);
    try {
      const processed_list: string[] = [];
      for (const file of Array.from(files)) {
        try {
          const processed = await processGalleryImage(file);
          processed_list.push(processed.data_url);
        } catch (err) {
          console.error(`Skipped ${file.name}:`, err);
        }
      }
      set_gallery((prev) => [...prev, ...processed_list]);
    } finally {
      set_is_uploading(false);
      if (gallery_input_ref.current) gallery_input_ref.current.value = '';
    }
  };

  const handleGalleryRemove = (idx: number) => {
    set_gallery((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleGalleryReorder = (idx: number, direction: 'up' | 'down') => {
    set_gallery((prev) => {
      const next = [...prev];
      const target_idx = direction === 'up' ? idx - 1 : idx + 1;
      if (target_idx < 0 || target_idx >= next.length) return prev;
      [next[idx], next[target_idx]] = [next[target_idx], next[idx]];
      return next;
    });
  };

  const ab_mod = (score: number) => Math.floor((score - 10) / 2);

  const handleSubmit = () => {
    if (!name.trim()) {
      alert('Name is required');
      return;
    }
    const hp_n = parseInt(hp, 10) || 1;
    const ac_n = parseInt(ac, 10) || 10;

    const cleanFeatures = (list: MonsterFeature[]) =>
      list.filter((f) => f.name.trim() || f.description.trim());

    const monster_data: any = {
      name: name.trim(),
      size,
      type: type_,
      subtype: null,
      alignment,
      ac: ac_n,
      hp: hp_n,
      hp_formula: null,
      speed: { walk: parseInt(speed_walk, 10) || 30 },
      initiative: { modifier: parseInt(init_mod, 10) || 0, score: null },
      abilities: {
        str: { score: parseInt(str, 10) || 10, modifier: ab_mod(parseInt(str, 10) || 10) },
        dex: { score: parseInt(dex, 10) || 10, modifier: ab_mod(parseInt(dex, 10) || 10) },
        con: { score: parseInt(con, 10) || 10, modifier: ab_mod(parseInt(con, 10) || 10) },
        int: { score: parseInt(int_, 10) || 10, modifier: ab_mod(parseInt(int_, 10) || 10) },
        wis: { score: parseInt(wis, 10) || 10, modifier: ab_mod(parseInt(wis, 10) || 10) },
        cha: { score: parseInt(cha, 10) || 10, modifier: ab_mod(parseInt(cha, 10) || 10) },
      },
      saves: {
        str: ab_mod(parseInt(str, 10) || 10),
        dex: ab_mod(parseInt(dex, 10) || 10),
        con: ab_mod(parseInt(con, 10) || 10),
        int: ab_mod(parseInt(int_, 10) || 10),
        wis: ab_mod(parseInt(wis, 10) || 10),
        cha: ab_mod(parseInt(cha, 10) || 10),
      },
      skills: initial?.skills ?? {},
      senses: initial?.senses ?? {},
      passive_perception: 10 + ab_mod(parseInt(wis, 10) || 10),
      languages: initial?.languages ?? [],
      cr,
      xp: initial?.xp ?? null,
      damage_resistances: initial?.damage_resistances ?? [],
      damage_immunities: initial?.damage_immunities ?? [],
      damage_vulnerabilities: initial?.damage_vulnerabilities ?? [],
      condition_immunities: initial?.condition_immunities ?? [],
      gear: initial?.gear ?? [],
      traits: cleanFeatures(traits),
      actions: cleanFeatures(actions),
      bonus_actions: cleanFeatures(bonus_actions),
      reactions: cleanFeatures(reactions),
      legendary_actions: cleanFeatures(legendary_actions),
      avatar,
      gallery,
    };

    if (edit_id) {
      // Update existing
      if (ally_mode) {
        updateAlly(edit_id, monster_data);
      } else {
        updateMonster(edit_id, monster_data);
      }
      onSaved?.(edit_id);
    } else {
      // Create new
      const id = ally_mode
        ? addAlly({ ...monster_data, id: '' })
        : addMonster({ ...monster_data, id: '' });
      onSaved?.(id);
    }
    onClose();
  };

  const is_editing = !!edit_id;
  const entity_word = ally_mode ? 'ally' : 'monster';
  const title_text = is_editing
    ? `Edit ${ally_mode ? 'ally' : 'custom monster'}`
    : initial?.name
    ? `Customize as ${entity_word}`
    : `Create custom ${entity_word}`;
  const submit_text = is_editing
    ? 'Save changes'
    : initial?.name
    ? `Save as ${entity_word}`
    : `Create ${entity_word}`;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
      }}
      // No onClick handler — clicking the background does NOT close the modal.
      // Only the X button or Cancel closes it.
    >
      <div
        className="bg-bg-primary"
        style={{
          width: '90%',
          maxWidth: '760px',
          maxHeight: '90vh',
          overflowY: 'auto',
          borderRadius: 'var(--border-radius-lg)',
          padding: '24px 28px',
          boxShadow: '0 12px 32px rgba(0,0,0,0.18)',
        }}
      >
        <div className="flex justify-between items-start mb-4">
          <h2>{title_text}</h2>
          <button
            onClick={onClose}
            style={{
              border: 'none',
              background: 'transparent',
              fontSize: '20px',
              cursor: 'pointer',
              padding: 0,
            }}
            title="Close (your changes will be lost)"
          >
            ×
          </button>
        </div>

        {/* Avatar & gallery (works for both ally and custom monster) */}
        <Section title="Appearance">
          <div className="flex items-start gap-4 mb-3">
            {/* Avatar */}
            <div>
              <div className="text-[11px] text-text-tertiary mb-1">Avatar</div>
              <div className="flex items-start gap-2">
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    background: avatar
                      ? `url(${avatar})`
                      : ally_mode
                      ? '#22C55E'
                      : '#DC2626',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    border: ally_mode
                      ? '2px solid #15803D'
                      : '2px solid #7F1D1D',
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
                    ref={avatar_input_ref}
                    onChange={handleAvatarChange}
                    style={{ display: 'none' }}
                  />
                  <button
                    type="button"
                    onClick={() => avatar_input_ref.current?.click()}
                    disabled={is_uploading}
                    style={{ fontSize: '11px', padding: '5px 10px' }}
                  >
                    {avatar ? 'Change' : '+ Upload'}
                  </button>
                  {avatar && (
                    <button
                      type="button"
                      onClick={() => set_avatar(undefined)}
                      style={{
                        fontSize: '11px',
                        padding: '5px 10px',
                        marginLeft: 4,
                        color: 'var(--color-text-tertiary)',
                      }}
                    >
                      Remove
                    </button>
                  )}
                  <div className="text-[10px] text-text-tertiary mt-1">
                    Square crop · max 256×256
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Gallery */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <div className="text-[11px] text-text-tertiary">
                Gallery
                {gallery.length > 0 && (
                  <span className="ml-2">({gallery.length})</span>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                ref={gallery_input_ref}
                onChange={handleGalleryAdd}
                style={{ display: 'none' }}
              />
              <button
                type="button"
                onClick={() => gallery_input_ref.current?.click()}
                disabled={is_uploading}
                style={{ fontSize: '11px', padding: '4px 10px' }}
              >
                {is_uploading ? 'Uploading…' : '+ Add images'}
              </button>
            </div>

            {gallery.length === 0 ? (
              <div
                className="text-[11px] text-text-tertiary italic px-2 py-3"
                style={{
                  background: 'var(--color-background-secondary)',
                  borderRadius: 'var(--border-radius-md)',
                  textAlign: 'center',
                }}
              >
                No gallery images yet. Add concept art, references, or scene
                illustrations.
              </div>
            ) : (
              <div
                className="grid gap-2"
                style={{
                  gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                }}
              >
                {gallery.map((src, idx) => (
                  <div
                    key={idx}
                    style={{
                      position: 'relative',
                      aspectRatio: '4 / 3',
                      background: `url(${src}) center/cover no-repeat`,
                      borderRadius: 'var(--border-radius-md)',
                      border: '0.5px solid var(--color-border-tertiary)',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        display: 'flex',
                        gap: 2,
                      }}
                    >
                      {idx > 0 && (
                        <button
                          type="button"
                          onClick={() => handleGalleryReorder(idx, 'up')}
                          title="Move earlier"
                          style={miniBtn}
                        >
                          ‹
                        </button>
                      )}
                      {idx < gallery.length - 1 && (
                        <button
                          type="button"
                          onClick={() => handleGalleryReorder(idx, 'down')}
                          title="Move later"
                          style={miniBtn}
                        >
                          ›
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleGalleryRemove(idx)}
                        title="Remove"
                        style={{ ...miniBtn, color: '#FECACA' }}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="text-[10px] text-text-tertiary mt-1">
              Up to ~1200px on the longest side · auto-compressed
            </div>
          </div>
        </Section>

        <Section title="Basic info">
          <div
            className="grid gap-2"
            style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr' }}
          >
            <FieldLabel label="Name *">
              <input
                value={name}
                onChange={(e) => set_name(e.target.value)}
                className="w-full"
              />
            </FieldLabel>
            <FieldLabel label="Size">
              <select
                value={size}
                onChange={(e) => set_size(e.target.value)}
                className="w-full"
              >
                {['Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan'].map(
                  (s) => (
                    <option key={s}>{s}</option>
                  )
                )}
              </select>
            </FieldLabel>
            <FieldLabel label="Type">
              <input
                value={type_}
                onChange={(e) => set_type(e.target.value)}
                className="w-full"
              />
            </FieldLabel>
            <FieldLabel label="CR">
              <input
                value={cr}
                onChange={(e) => set_cr(e.target.value)}
                className="w-full"
              />
            </FieldLabel>
          </div>
          <div className="mt-2">
            <FieldLabel label="Alignment">
              <input
                value={alignment}
                onChange={(e) => set_alignment(e.target.value)}
                className="w-full"
              />
            </FieldLabel>
          </div>
        </Section>

        <Section title="Combat stats">
          <div
            className="grid gap-2"
            style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}
          >
            <FieldLabel label="HP">
              <input
                value={hp}
                onChange={(e) => set_hp(e.target.value)}
                className="w-full"
              />
            </FieldLabel>
            <FieldLabel label="AC">
              <input
                value={ac}
                onChange={(e) => set_ac(e.target.value)}
                className="w-full"
              />
            </FieldLabel>
            <FieldLabel label="Speed (ft)">
              <input
                value={speed_walk}
                onChange={(e) => set_speed_walk(e.target.value)}
                className="w-full"
              />
            </FieldLabel>
            <FieldLabel label="Init bonus">
              <input
                value={init_mod}
                onChange={(e) => set_init_mod(e.target.value)}
                className="w-full"
              />
            </FieldLabel>
          </div>
        </Section>

        <Section title="Ability scores">
          <div
            className="grid gap-2"
            style={{ gridTemplateColumns: 'repeat(6, 1fr)' }}
          >
            {[
              ['STR', str, set_str],
              ['DEX', dex, set_dex],
              ['CON', con, set_con],
              ['INT', int_, set_int],
              ['WIS', wis, set_wis],
              ['CHA', cha, set_cha],
            ].map(([label, val, setter]: any) => {
              const score = parseInt(val, 10) || 10;
              const mod = ab_mod(score);
              return (
                <div key={label}>
                  <div className="text-[11px] text-text-tertiary text-center mb-1">
                    {label}
                  </div>
                  <input
                    value={val}
                    onChange={(e) => setter(e.target.value)}
                    className="w-full text-center"
                  />
                  <div className="text-[10px] text-text-tertiary text-center mt-1">
                    {mod >= 0 ? `+${mod}` : mod}
                  </div>
                </div>
              );
            })}
          </div>
        </Section>

        <FeatureSection
          title="Traits"
          subtitle="Passive abilities the creature has"
          features={traits}
          onChange={set_traits}
          add_label="+ Add trait"
          placeholder_name="Pack Tactics"
          placeholder_desc="Has advantage on attacks if an ally is adjacent to the target."
        />

        <FeatureSection
          title="Actions"
          subtitle="Standard actions the creature can take on its turn"
          features={actions}
          onChange={set_actions}
          add_label="+ Add action"
          placeholder_name="Bite"
          placeholder_desc="Melee attack: +5 to hit, reach 5 ft. Hit: 1d8+3 piercing damage."
        />

        <FeatureSection
          title="Bonus actions"
          subtitle="Optional. Actions usable as a bonus action."
          features={bonus_actions}
          onChange={set_bonus_actions}
          add_label="+ Add bonus action"
          placeholder_name="Cunning Action"
          placeholder_desc="Can take Dash, Disengage, or Hide as a bonus action."
        />

        <FeatureSection
          title="Reactions"
          subtitle="Optional. Triggered abilities used outside the creature's turn."
          features={reactions}
          onChange={set_reactions}
          add_label="+ Add reaction"
          placeholder_name="Parry"
          placeholder_desc="When hit by a melee attack, +3 AC against that attack."
        />

        <FeatureSection
          title="Legendary actions"
          subtitle="Optional. For BBEGs and powerful creatures (3 actions per round)."
          features={legendary_actions}
          onChange={set_legendary_actions}
          add_label="+ Add legendary action"
          placeholder_name="Tail Sweep"
          placeholder_desc="Costs 2 actions. Sweeps tail; all creatures within 10 ft must save or be knocked prone."
        />

        <div
          className="flex gap-2 pt-4 mt-4"
          style={{ borderTop: '0.5px solid var(--color-border-tertiary)' }}
        >
          <button
            onClick={handleSubmit}
            className="bg-accent-50 border-accent-300 text-accent-900 font-medium"
            style={{ padding: '10px 20px', fontSize: '13px', flex: 1 }}
          >
            {submit_text}
          </button>
          <button
            onClick={onClose}
            style={{ padding: '10px 20px', fontSize: '13px' }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

const miniBtn: React.CSSProperties = {
  width: 22,
  height: 22,
  borderRadius: 4,
  background: 'rgba(0, 0, 0, 0.6)',
  color: '#fff',
  border: 'none',
  fontSize: 14,
  lineHeight: 1,
  cursor: 'pointer',
  padding: 0,
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-3">
      <div className="text-[12px] font-medium text-text-secondary mb-2">
        {title}
      </div>
      {children}
    </div>
  );
}

function FieldLabel({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-[11px] text-text-tertiary mb-1">{label}</div>
      {children}
    </div>
  );
}

function FeatureSection({
  title,
  subtitle,
  features,
  onChange,
  add_label,
  placeholder_name,
  placeholder_desc,
}: {
  title: string;
  subtitle?: string;
  features: MonsterFeature[];
  onChange: (next: MonsterFeature[]) => void;
  add_label: string;
  placeholder_name?: string;
  placeholder_desc?: string;
}) {
  const handleAdd = () => {
    onChange([...features, { name: '', description: '' }]);
  };

  const handleUpdate = (idx: number, patch: Partial<MonsterFeature>) => {
    onChange(features.map((f, i) => (i === idx ? { ...f, ...patch } : f)));
  };

  const handleRemove = (idx: number) => {
    onChange(features.filter((_, i) => i !== idx));
  };

  return (
    <div className="mb-3">
      <div className="flex justify-between items-baseline mb-2">
        <div>
          <div className="text-[12px] font-medium text-text-secondary">
            {title}
            <span className="text-text-tertiary ml-2 font-normal">
              ({features.length})
            </span>
          </div>
          {subtitle && (
            <div className="text-[11px] text-text-tertiary mt-0.5">
              {subtitle}
            </div>
          )}
        </div>
        <button
          onClick={handleAdd}
          style={{ fontSize: '11px', padding: '4px 10px' }}
        >
          {add_label}
        </button>
      </div>

      {features.length === 0 ? (
        <div className="text-[11px] text-text-tertiary italic px-2 py-1">
          None.
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {features.map((f, idx) => (
            <div
              key={idx}
              style={{
                padding: '10px 12px',
                background: 'var(--color-background-secondary)',
                borderRadius: 'var(--border-radius-md)',
                border: '0.5px solid var(--color-border-tertiary)',
              }}
            >
              <div className="flex gap-2 items-start mb-2">
                <input
                  value={f.name}
                  onChange={(e) =>
                    handleUpdate(idx, { name: e.target.value })
                  }
                  placeholder={placeholder_name ?? 'Feature name'}
                  style={{ flex: 1, fontSize: '12px', height: '28px' }}
                />
                <button
                  onClick={() => handleRemove(idx)}
                  title="Remove"
                  style={{
                    fontSize: '13px',
                    padding: '0 8px',
                    height: '28px',
                    color: 'var(--color-text-tertiary)',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  ×
                </button>
              </div>
              <textarea
                value={f.description}
                onChange={(e) =>
                  handleUpdate(idx, { description: e.target.value })
                }
                placeholder={placeholder_desc ?? 'Description...'}
                style={{
                  width: '100%',
                  fontSize: '12px',
                  minHeight: '50px',
                  resize: 'vertical',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
