import { useRef, useState } from 'react';
import { useCampaignStore } from '@/store/campaignStore';
import { processImageFile } from '@/utils/imageUtils';

type DragState = {
  location_id: string;
};

export function MapPage() {
  const { getActiveCampaign, updateCampaign } = useCampaignStore();
  const campaign = getActiveCampaign();
  const file_input_ref = useRef<HTMLInputElement>(null);
  const map_ref = useRef<HTMLDivElement>(null);
  const [dragging, set_dragging] = useState<DragState | null>(null);
  const [uploading, set_uploading] = useState(false);
  const [selected_location_id, set_selected_location_id] = useState<string | null>(null);
  const [move_mode, set_move_mode] = useState(false);

  if (!campaign) {
    return (
      <div className="p-8 text-text-secondary">
        Create or select a campaign first.
      </div>
    );
  }

  const locations = campaign.locations ?? [];
  const pins = campaign.map_location_pins ?? {};

  const update = (patch: Partial<typeof campaign>) => {
    updateCampaign(campaign.id, patch);
  };

  const set_pin = (location_id: string, x: number, y: number) => {
    update({
      map_location_pins: {
        ...pins,
        [location_id]: {
          x: Math.max(0, Math.min(100, x)),
          y: Math.max(0, Math.min(100, y)),
        },
      },
    });
  };

  const remove_pin = (location_id: string) => {
    const next = { ...pins };
    delete next[location_id];
    update({ map_location_pins: next });
    if (selected_location_id === location_id) set_selected_location_id(null);
  };

  const place_at_event = (location_id: string, event: React.MouseEvent<HTMLDivElement> | React.PointerEvent<HTMLDivElement>) => {
    const box = map_ref.current?.getBoundingClientRect();
    if (!box) return;
    const x = ((event.clientX - box.left) / box.width) * 100;
    const y = ((event.clientY - box.top) / box.height) * 100;
    set_pin(location_id, x, y);
  };

  const handle_map_click = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!move_mode || !selected_location_id) return;
    place_at_event(selected_location_id, event);
  };

  const handle_pointer_move = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!move_mode || !dragging) return;
    place_at_event(dragging.location_id, event);
  };

  const handle_upload = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    set_uploading(true);
    try {
      const image = await processImageFile(file);
      update({ map_image: image.data_url });
    } finally {
      set_uploading(false);
      if (file_input_ref.current) file_input_ref.current.value = '';
    }
  };

  const pinned_locations = locations.filter((loc) => pins[loc.id]);
  const unpinned_locations = locations.filter((loc) => !pins[loc.id]);
  const selected_location = locations.find((loc) => loc.id === selected_location_id) ?? null;
  const selected_pin = selected_location_id ? pins[selected_location_id] : undefined;

  return (
    <div className="p-8 max-w-[1400px]">
      <div className="flex justify-between gap-4 items-start mb-5">
        <div>
          <h1 className="text-[24px] font-semibold mb-1">World Map</h1>
          <p className="text-[13px] text-text-secondary max-w-[760px]">
            Upload your campaign world map and place dashboard locations on it.
            Location pins are simple dots: green means visited, red means not visited yet.
          </p>
        </div>
        <div className="flex gap-2">
          <input
            ref={file_input_ref}
            type="file"
            accept="image/*"
            onChange={(e) => handle_upload(e.target.files)}
            style={{ display: 'none' }}
          />
          <button
            onClick={() => file_input_ref.current?.click()}
            disabled={uploading}
            className="bg-accent-50 border-accent-300 text-accent-900 font-medium"
            style={{ padding: '7px 12px', fontSize: 12 }}
          >
            {uploading ? 'Uploading…' : campaign.map_image ? 'Replace map' : 'Upload map'}
          </button>
          {campaign.map_image && (
            <button
              onClick={() => {
                if (!confirm('Remove the map image? Location pins will be kept.')) return;
                update({ map_image: undefined });
              }}
              style={{ padding: '7px 12px', fontSize: 12 }}
            >
              Remove map
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-4" style={{ gridTemplateColumns: '280px 1fr' }}>
        <aside
          className="bg-bg-primary"
          style={{
            border: '0.5px solid var(--color-border-tertiary)',
            borderRadius: 'var(--border-radius-md)',
            padding: 14,
            alignSelf: 'start',
          }}
        >
          <div className="flex justify-between items-center mb-2">
            <div className="text-[13px] font-medium">Locations</div>
            <button
              type="button"
              onClick={() => set_move_mode((v) => !v)}
              style={{
                fontSize: 11,
                padding: '3px 8px',
                borderRadius: 999,
                background: move_mode ? 'var(--color-background-info)' : 'var(--color-background-secondary)',
                borderColor: move_mode ? 'var(--color-border-info)' : 'var(--color-border-secondary)',
                color: move_mode ? 'var(--color-text-info)' : 'var(--color-text-secondary)',
              }}
              title="Enable this only when you want to place or move pins."
            >
              {move_mode ? 'Move mode: ON' : 'Move mode: OFF'}
            </button>
          </div>

          <div className="flex gap-2 mb-3 text-[11px] text-text-tertiary">
            <span><span style={{ color: '#22C55E' }}>●</span> visited</span>
            <span><span style={{ color: '#EF4444' }}>●</span> not visited</span>
          </div>

          {locations.length === 0 ? (
            <div className="text-[12px] text-text-tertiary">
              No locations yet. Add locations on the Dashboard first.
            </div>
          ) : (
            <>
              <div className="text-[11px] text-text-tertiary mb-2">
                {move_mode
                  ? 'Select a location, then click the map to place it. Existing dots can be dragged only while move mode is on.'
                  : 'Click a dot on the map to show the location name. Turn on move mode to place or move pins.'}
              </div>
              <div className="flex flex-col gap-1 mb-4">
                {locations.map((loc) => {
                  const active = selected_location_id === loc.id;
                  const pin = pins[loc.id];
                  return (
                    <button
                      key={loc.id}
                      type="button"
                      onClick={() => set_selected_location_id(active ? null : loc.id)}
                      style={{
                        textAlign: 'left',
                        padding: '7px 8px',
                        borderRadius: 'var(--border-radius-md)',
                        background: active
                          ? 'var(--color-background-info)'
                          : 'var(--color-background-secondary)',
                        borderColor: active
                          ? 'var(--color-border-info)'
                          : 'var(--color-border-secondary)',
                      }}
                    >
                      <div className="flex justify-between gap-2">
                        <span className="text-[12px] font-medium truncate">
                          <span style={{ color: loc.visited ? '#22C55E' : '#EF4444' }}>●</span>{' '}
                          {loc.name}
                        </span>
                        <span className="text-[10px] text-text-tertiary">
                          {pin ? 'placed' : '—'}
                        </span>
                      </div>
                      {loc.region && (
                        <div className="text-[10px] text-text-tertiary truncate">
                          {loc.region}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="text-[11px] text-text-tertiary mb-1">
                Pinned: {pinned_locations.length} / {locations.length}
              </div>
              {unpinned_locations.length > 0 && (
                <div className="text-[11px] text-text-tertiary">
                  Unplaced: {unpinned_locations.map((l) => l.name).join(', ')}
                </div>
              )}
            </>
          )}
        </aside>

        <section
          className="bg-bg-primary"
          style={{
            border: '0.5px solid var(--color-border-tertiary)',
            borderRadius: 'var(--border-radius-md)',
            padding: 14,
            minHeight: 620,
          }}
        >
          {!campaign.map_image ? (
            <div
              className="flex flex-col items-center justify-center text-center"
              style={{
                minHeight: 560,
                border: '1px dashed var(--color-border-secondary)',
                borderRadius: 'var(--border-radius-md)',
                background: 'var(--color-background-secondary)',
              }}
            >
              <div className="text-[18px] mb-2">No world map uploaded yet</div>
              <div className="text-[13px] text-text-secondary mb-4">
                Upload a JPG, PNG, or WebP map image to start placing locations.
              </div>
              <button
                onClick={() => file_input_ref.current?.click()}
                className="bg-accent-50 border-accent-300 text-accent-900 font-medium"
                style={{ padding: '8px 14px', fontSize: 13 }}
              >
                Upload map
              </button>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-2">
                <div className="text-[12px] text-text-secondary">
                  {move_mode
                    ? selected_location_id
                      ? 'Move mode is on: click the map to place the selected location, or drag existing dots.'
                      : 'Move mode is on: select a location from the left to place it.'
                    : 'Move mode is off: dots cannot be moved accidentally.'}
                </div>
                <div className="text-[11px] text-text-tertiary">
                  Map and pins are included in backup/export.
                </div>
              </div>
              <div
                ref={map_ref}
                onClick={handle_map_click}
                onPointerMove={handle_pointer_move}
                onPointerUp={() => set_dragging(null)}
                onPointerLeave={() => set_dragging(null)}
                style={{
                  position: 'relative',
                  width: '100%',
                  borderRadius: 'var(--border-radius-md)',
                  overflow: 'hidden',
                  border: '0.5px solid var(--color-border-secondary)',
                  background: 'var(--color-background-secondary)',
                  cursor: move_mode && selected_location_id ? 'crosshair' : 'default',
                  userSelect: 'none',
                }}
              >
                <img
                  src={campaign.map_image}
                  alt="Campaign world map"
                  draggable={false}
                  style={{
                    display: 'block',
                    width: '100%',
                    height: 'auto',
                    maxHeight: '76vh',
                    objectFit: 'contain',
                  }}
                />

                {locations.map((loc) => {
                  const pin = pins[loc.id];
                  if (!pin) return null;
                  const active = selected_location_id === loc.id;
                  return (
                    <button
                      key={loc.id}
                      type="button"
                      title={loc.name}
                      onClick={(e) => {
                        e.stopPropagation();
                        set_selected_location_id(active ? null : loc.id);
                      }}
                      onPointerDown={(e) => {
                        e.stopPropagation();
                        if (!move_mode) return;
                        (e.currentTarget as HTMLButtonElement).setPointerCapture(e.pointerId);
                        set_dragging({ location_id: loc.id });
                        set_selected_location_id(loc.id);
                      }}
                      style={{
                        position: 'absolute',
                        left: `${pin.x}%`,
                        top: `${pin.y}%`,
                        transform: 'translate(-50%, -50%)',
                        width: active ? 18 : 14,
                        height: active ? 18 : 14,
                        borderRadius: 999,
                        padding: 0,
                        border: active ? '3px solid white' : '2px solid white',
                        background: loc.visited ? '#22C55E' : '#EF4444',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.45)',
                        cursor: move_mode ? 'grab' : 'pointer',
                      }}
                    />
                  );
                })}

                {selected_location && selected_pin && (
                  <MapPopup
                    location={selected_location}
                    pin={selected_pin}
                    onClose={() => set_selected_location_id(null)}
                    onRemove={() => remove_pin(selected_location.id)}
                    showRemove={move_mode}
                  />
                )}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

function MapPopup({
  location,
  pin,
  onClose,
  onRemove,
  showRemove,
}: {
  location: { id: string; name: string; region?: string; description?: string; visited?: boolean };
  pin: { x: number; y: number };
  onClose: () => void;
  onRemove: () => void;
  showRemove: boolean;
}) {
  const left = Math.min(88, Math.max(12, pin.x));
  const top = Math.min(88, Math.max(8, pin.y));

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        position: 'absolute',
        left: `${left}%`,
        top: `${top}%`,
        transform: 'translate(-50%, -115%)',
        minWidth: 180,
        maxWidth: 280,
        padding: 10,
        borderRadius: 'var(--border-radius-md)',
        background: 'var(--color-background-primary)',
        border: '0.5px solid var(--color-border-secondary)',
        boxShadow: '0 10px 24px rgba(0,0,0,0.25)',
        zIndex: 20,
      }}
    >
      <div className="flex justify-between gap-2 items-start">
        <div>
          <div className="text-[13px] font-semibold">
            <span style={{ color: location.visited ? '#22C55E' : '#EF4444' }}>●</span>{' '}
            {location.name}
          </div>
          {location.region && (
            <div className="text-[11px] text-text-tertiary mt-0.5">{location.region}</div>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          style={{ fontSize: 11, padding: '1px 5px' }}
        >
          ×
        </button>
      </div>

      <div className="text-[11px] text-text-secondary mt-2">
        {location.visited ? 'Party has visited this location.' : 'Party has not visited this location yet.'}
      </div>

      {location.description && (
        <div className="text-[11px] text-text-tertiary mt-2" style={{ maxHeight: 70, overflow: 'auto' }}>
          {location.description}
        </div>
      )}

      {showRemove && (
        <button
          type="button"
          onClick={onRemove}
          style={{ marginTop: 8, padding: '4px 8px', fontSize: 11 }}
        >
          Remove pin
        </button>
      )}
    </div>
  );
}
