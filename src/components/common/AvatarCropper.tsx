import { useState, useRef, useEffect, useCallback } from 'react';

interface Props {
  /** Source image (data URL or http URL) */
  src: string;
  /** Output size of the cropped square (default 256) */
  output_size?: number;
  /** Color used for the modal overlay outside the crop circle */
  overlay_color?: string;
  /** Title displayed at the top of the modal */
  title?: string;
  /** Called when user confirms with the cropped data URL */
  onSave: (data_url: string) => void;
  /** Called when user cancels */
  onCancel: () => void;
}

/**
 * Interactive avatar cropper. Shows the source image with a circular crop
 * window. The user can:
 *  - scroll wheel: zoom in/out
 *  - drag with mouse: pan the image under the crop circle
 *  - press buttons to reset / fit / save / cancel
 *
 * The cropped output is a 1:1 square JPEG (default 256x256), data URL.
 */
export function AvatarCropper({
  src,
  output_size = 256,
  overlay_color = 'rgba(0, 0, 0, 0.65)',
  title = 'Position the image',
  onSave,
  onCancel,
}: Props) {
  // Display canvas size (the visible cropping area). Fixed for clarity.
  const DISPLAY_SIZE = 360; // diameter of the visible crop circle
  // Margin around the canvas in the modal
  const PADDING = 24;

  // Image natural dimensions (set after load)
  const [natural, set_natural] = useState<{ w: number; h: number } | null>(null);
  // Image loaded successfully
  const [loaded, set_loaded] = useState(false);

  // Crop state: zoom (1 = fit; can go up to 5 or so), and image center offset
  // relative to the crop circle center (in image pixels, scaled by zoom).
  const [zoom, set_zoom] = useState(1);
  const [offset, set_offset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Drag state
  const [dragging, set_dragging] = useState(false);
  const drag_start = useRef<{ x: number; y: number; offset_x: number; offset_y: number } | null>(null);

  const img_ref = useRef<HTMLImageElement | null>(null);

  // When image loads, compute initial fit-to-circle zoom & centering
  const handle_image_load = useCallback(() => {
    const img = img_ref.current;
    if (!img) return;
    set_natural({ w: img.naturalWidth, h: img.naturalHeight });
    set_loaded(true);
    // Reset position
    set_offset({ x: 0, y: 0 });
    // Set zoom to "cover": the smaller side fits the circle exactly
    // (so the circle is fully covered by the image, no gaps)
    const fit_zoom = Math.max(
      DISPLAY_SIZE / img.naturalWidth,
      DISPLAY_SIZE / img.naturalHeight
    );
    set_zoom(fit_zoom);
  }, []);

  // Limit zoom range
  const MIN_ZOOM = natural
    ? Math.min(
        DISPLAY_SIZE / natural.w,
        DISPLAY_SIZE / natural.h
      ) * 0.5 // allow zooming out a bit smaller than the circle
    : 0.1;
  const MAX_ZOOM = 5;

  // ---- Mouse handlers ----
  const handle_wheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.1 : 1 / 1.1;
    set_zoom((z) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z * factor)));
  };

  const handle_mouse_down = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // left click only
    set_dragging(true);
    drag_start.current = {
      x: e.clientX,
      y: e.clientY,
      offset_x: offset.x,
      offset_y: offset.y,
    };
  };

  // Use window-level mouse handlers so dragging works even when cursor leaves
  // the canvas
  useEffect(() => {
    if (!dragging) return;
    const move = (e: MouseEvent) => {
      const start = drag_start.current;
      if (!start) return;
      const dx = e.clientX - start.x;
      const dy = e.clientY - start.y;
      set_offset({
        x: start.offset_x + dx,
        y: start.offset_y + dy,
      });
    };
    const up = () => {
      set_dragging(false);
      drag_start.current = null;
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
  }, [dragging]);

  // Reset to fit
  const handle_reset = () => {
    if (!natural) return;
    set_offset({ x: 0, y: 0 });
    set_zoom(
      Math.max(
        DISPLAY_SIZE / natural.w,
        DISPLAY_SIZE / natural.h
      )
    );
  };

  // ---- Crop & save ----
  const handle_save = () => {
    const img = img_ref.current;
    if (!img || !natural) return;

    // The display state:
    //   - zoom = scale factor applied to the natural image
    //   - offset = image center offset (in display px) from circle center
    //
    // Concretely: a point in the natural image at (px, py) is rendered at
    // display coordinates (centered on circle):
    //   display_x = (px - natural.w/2) * zoom + offset.x
    //   display_y = (py - natural.h/2) * zoom + offset.y
    //
    // The crop circle has radius DISPLAY_SIZE/2 around (0, 0).
    //
    // To produce the output, we need the natural-image bounds that map to
    // the crop area. Inverting:
    //   px = (display_x - offset.x) / zoom + natural.w/2
    //
    // The crop area in display coords is from -DISPLAY_SIZE/2 to +DISPLAY_SIZE/2
    // (both x and y).

    const half_display = DISPLAY_SIZE / 2;
    // Image-coords of the top-left of crop window
    const src_x = (-half_display - offset.x) / zoom + natural.w / 2;
    const src_y = (-half_display - offset.y) / zoom + natural.h / 2;
    const src_size = DISPLAY_SIZE / zoom;

    // Draw to canvas
    const canvas = document.createElement('canvas');
    canvas.width = output_size;
    canvas.height = output_size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // White background (in case of transparent PNGs)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, output_size, output_size);

    ctx.drawImage(
      img,
      src_x,
      src_y,
      src_size,
      src_size,
      0,
      0,
      output_size,
      output_size
    );

    const data_url = canvas.toDataURL('image/jpeg', 0.92);
    onSave(data_url);
  };

  // Computed image render position
  const img_w = natural ? natural.w * zoom : 0;
  const img_h = natural ? natural.h * zoom : 0;
  // CENTER of the image relative to canvas center
  const img_left = -img_w / 2 + offset.x;
  const img_top = -img_h / 2 + offset.y;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 200,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div
        style={{
          background: 'var(--color-background-primary)',
          borderRadius: 'var(--border-radius-md)',
          padding: PADDING,
          maxWidth: '95vw',
          maxHeight: '95vh',
        }}
      >
        <div
          className="flex justify-between items-center mb-3"
          style={{ minWidth: DISPLAY_SIZE }}
        >
          <div className="text-[14px] font-medium">{title}</div>
          <div className="text-[11px] text-text-tertiary">
            scroll to zoom · drag to move
          </div>
        </div>

        {/* The display canvas */}
        <div
          onWheel={handle_wheel}
          onMouseDown={handle_mouse_down}
          style={{
            position: 'relative',
            width: DISPLAY_SIZE,
            height: DISPLAY_SIZE,
            background: '#222',
            borderRadius: 'var(--border-radius-md)',
            overflow: 'hidden',
            cursor: dragging ? 'grabbing' : 'grab',
            userSelect: 'none',
          }}
        >
          {/* The image, positioned with translate */}
          <img
            ref={img_ref}
            src={src}
            onLoad={handle_image_load}
            alt=""
            draggable={false}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: img_w || 'auto',
              height: img_h || 'auto',
              transform: `translate(${img_left}px, ${img_top}px)`,
              maxWidth: 'none',
              maxHeight: 'none',
              pointerEvents: 'none',
              opacity: loaded ? 1 : 0,
              transition: 'opacity 0.2s',
            }}
          />

          {/* Overlay: dark mask outside the circle. Done via SVG mask. */}
          <svg
            width={DISPLAY_SIZE}
            height={DISPLAY_SIZE}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              pointerEvents: 'none',
            }}
          >
            <defs>
              <mask id="crop-circle-mask">
                <rect
                  x="0"
                  y="0"
                  width={DISPLAY_SIZE}
                  height={DISPLAY_SIZE}
                  fill="white"
                />
                <circle
                  cx={DISPLAY_SIZE / 2}
                  cy={DISPLAY_SIZE / 2}
                  r={DISPLAY_SIZE / 2 - 4}
                  fill="black"
                />
              </mask>
            </defs>
            <rect
              x="0"
              y="0"
              width={DISPLAY_SIZE}
              height={DISPLAY_SIZE}
              fill={overlay_color}
              mask="url(#crop-circle-mask)"
            />
            {/* White outline of the crop circle */}
            <circle
              cx={DISPLAY_SIZE / 2}
              cy={DISPLAY_SIZE / 2}
              r={DISPLAY_SIZE / 2 - 4}
              fill="none"
              stroke="rgba(255, 255, 255, 0.7)"
              strokeWidth={1.5}
            />
          </svg>

          {!loaded && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'rgba(255,255,255,0.6)',
                fontSize: 12,
              }}
            >
              Loading image...
            </div>
          )}
        </div>

        {/* Zoom slider for accessibility / fine control */}
        {loaded && natural && (
          <div className="mt-3" style={{ width: DISPLAY_SIZE }}>
            <div className="flex items-center gap-2 text-[11px] text-text-tertiary">
              <span>Zoom</span>
              <input
                type="range"
                min={MIN_ZOOM}
                max={MAX_ZOOM}
                step={0.01}
                value={zoom}
                onChange={(e) => set_zoom(parseFloat(e.target.value))}
                style={{ flex: 1 }}
              />
              <span style={{ fontFamily: 'var(--font-mono)', minWidth: 40, textAlign: 'right' }}>
                {Math.round(zoom * 100)}%
              </span>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div
          className="flex justify-between items-center mt-4"
          style={{ width: DISPLAY_SIZE }}
        >
          <button
            onClick={handle_reset}
            style={{ fontSize: '11px', padding: '5px 10px' }}
            disabled={!loaded}
          >
            Reset
          </button>
          <div className="flex gap-2">
            <button
              onClick={onCancel}
              style={{ fontSize: '12px', padding: '6px 14px' }}
            >
              Cancel
            </button>
            <button
              onClick={handle_save}
              disabled={!loaded}
              className="bg-accent-50 border-accent-300 text-accent-900 font-medium"
              style={{ fontSize: '12px', padding: '6px 16px' }}
            >
              Save avatar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
