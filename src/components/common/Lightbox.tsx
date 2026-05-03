import { useEffect } from 'react';

interface Props {
  images: string[];
  index: number;
  onClose: () => void;
  onNavigate: (new_index: number) => void;
}

/**
 * Full-screen image viewer overlay. Click outside or press Escape to close.
 * Use arrow keys or on-screen buttons to navigate between images.
 */
export function Lightbox({ images, index, onClose, onNavigate }: Props) {
  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft' && index > 0) {
        onNavigate(index - 1);
      } else if (e.key === 'ArrowRight' && index < images.length - 1) {
        onNavigate(index + 1);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [index, images.length, onClose, onNavigate]);

  if (images.length === 0 || index < 0 || index >= images.length) return null;

  const has_prev = index > 0;
  const has_next = index < images.length - 1;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.92)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 200,
        cursor: 'zoom-out',
      }}
    >
      {/* Top bar with counter and close */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'absolute',
          top: 16,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 24px',
          color: '#fff',
          fontSize: 13,
          pointerEvents: 'none',
        }}
      >
        <span style={{ pointerEvents: 'auto', opacity: 0.7 }}>
          {index + 1} / {images.length}
        </span>
        <button
          onClick={onClose}
          style={{
            pointerEvents: 'auto',
            background: 'rgba(255,255,255,0.15)',
            border: 'none',
            color: '#fff',
            width: 36,
            height: 36,
            borderRadius: 18,
            fontSize: 18,
            cursor: 'pointer',
          }}
          title="Close (Esc)"
        >
          ×
        </button>
      </div>

      {/* Main image */}
      <img
        src={images[index]}
        alt={`Gallery ${index + 1}`}
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '90vw',
          maxHeight: '85vh',
          objectFit: 'contain',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
          borderRadius: 4,
          cursor: 'default',
        }}
      />

      {/* Prev / next buttons */}
      {has_prev && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(index - 1);
          }}
          style={{
            position: 'absolute',
            left: 16,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 48,
            height: 48,
            borderRadius: 24,
            background: 'rgba(255,255,255,0.15)',
            border: 'none',
            color: '#fff',
            fontSize: 24,
            cursor: 'pointer',
          }}
          title="Previous (Arrow Left)"
        >
          ‹
        </button>
      )}

      {has_next && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(index + 1);
          }}
          style={{
            position: 'absolute',
            right: 16,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 48,
            height: 48,
            borderRadius: 24,
            background: 'rgba(255,255,255,0.15)',
            border: 'none',
            color: '#fff',
            fontSize: 24,
            cursor: 'pointer',
          }}
          title="Next (Arrow Right)"
        >
          ›
        </button>
      )}
    </div>
  );
}
