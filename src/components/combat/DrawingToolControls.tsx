import type { CSSProperties } from 'react';
import type { DrawingTool } from '@/types/app';

interface DrawingToolControlsProps {
  tool: DrawingTool;
  onToolChange: (tool: DrawingTool) => void;
  lineWidthFt: number;
  onLineWidthChange: (widthFt: number) => void;
  dark?: boolean;
}

const TOOLS: { id: DrawingTool; label: string; title: string }[] = [
  { id: 'freehand', label: 'Freehand', title: 'Szabadkézi rajzolás' },
  { id: 'circle', label: 'Circle', title: 'Kör alakú terület' },
  { id: 'cone', label: 'Cone', title: 'Kúp alakú terület' },
  { id: 'square', label: 'Square / Cube', title: 'Négyzetes vagy kocka alakú terület' },
  { id: 'line', label: 'Line', title: 'Vonal alakú terület' },
];

const controlStyle: CSSProperties = {
  minHeight: 44,
  minWidth: 44,
  padding: '6px 10px',
  border: '1px solid var(--color-border-tertiary)',
  borderRadius: 5,
  fontSize: 12,
  lineHeight: 1.2,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
};

/** Accessible selector for the freehand and D&D area-template drawing modes. */
export function DrawingToolControls({
  tool,
  onToolChange,
  lineWidthFt,
  onLineWidthChange,
  dark = false,
}: DrawingToolControlsProps) {
  return (
    <div
      role="group"
      aria-label="Rajzeszköz kiválasztása"
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 4,
      }}
    >
      {TOOLS.map(({ id, label, title }) => {
        const selected = tool === id;
        return (
          <button
            key={id}
            type="button"
            aria-label={`Rajzeszköz: ${label}`}
            aria-pressed={selected}
            title={`${title} (${label})`}
            onClick={() => onToolChange(id)}
            style={{
              ...controlStyle,
              background: selected
                ? dark ? 'rgba(243, 217, 152, 0.24)' : 'var(--color-background-info)'
                : dark ? 'rgba(255,255,255,0.86)' : 'var(--color-background-primary)',
              color: selected ? 'var(--color-text-info)' : undefined,
              fontWeight: selected ? 600 : 400,
              borderColor: selected ? 'var(--color-border-info)' : 'var(--color-border-tertiary)',
            }}
          >
            {label}
          </button>
        );
      })}

      {tool === 'line' && (
        <label
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            minHeight: 44,
            padding: '2px 5px',
            borderRadius: 5,
            color: dark ? '#fff' : 'var(--color-text-secondary)',
            fontSize: 11,
            whiteSpace: 'nowrap',
          }}
        >
          <span>Vonal szélessége</span>
          <select
            aria-label="Vonal szélessége lábban"
            title="Vonal szélessége (ft)"
            value={lineWidthFt}
            onChange={(event) => onLineWidthChange(Number(event.target.value))}
            style={{
              minHeight: 44,
              padding: '3px 6px',
              border: '1px solid var(--color-border-tertiary)',
              borderRadius: 4,
              background: dark ? 'rgba(255,255,255,0.9)' : 'var(--color-background-primary)',
              color: 'var(--color-text-primary)',
              fontSize: 11,
            }}
          >
            {Array.from({ length: 6 }, (_, index) => (index + 1) * 5).map((feet) => (
              <option key={feet} value={feet}>{feet} ft</option>
            ))}
          </select>
        </label>
      )}
    </div>
  );
}
