import { getClassInfo } from '@/data/classData';
import { getCombinedSubclassInfo, useClassHomebrewStore, type CustomSubclassInfo } from '@/store/classHomebrewStore';
import { normalizeCharacterBuild, formatCharacterBuildSummary } from './ClassBuildEditor';
import type { CharacterBuild } from '@/types/app';

type FeatureRow = {
  key: string;
  className: string;
  level: number;
  name: string;
  description?: string;
  subclassName?: string;
};

type DescriptionSegment =
  | { type: 'text'; text: string }
  | { type: 'table'; title?: string; headers: string[]; rows: string[][] };

function looksLikeTableTitle(value: string) {
  const text = value.trim();
  if (!text) return false;
  if (text.startsWith('Table:')) return true;
  if (/[.!?]$/.test(text)) return false;
  if (text.length > 80) return false;
  return /^[A-Z0-9][A-Za-z0-9'’(),:/+\- ]+$/.test(text);
}

function isMarkdownSeparator(line: string) {
  const trimmed = line.trim();
  if (!trimmed.includes('|')) return false;
  const cells = trimmed
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => cell.trim())
    .filter(Boolean);
  return cells.length >= 2 && cells.every((cell) => /^:?-{3,}:?$/.test(cell));
}

function parsePipeRow(line: string) {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => cell.trim());
}

function parseDescriptionSegments(description: string): DescriptionSegment[] {
  const lines = description.replace(/\r\n/g, '\n').split('\n');
  const segments: DescriptionSegment[] = [];
  let textBuffer: string[] = [];

  const flushText = () => {
    const text = textBuffer.join('\n').trim();
    if (text) segments.push({ type: 'text', text });
    textBuffer = [];
  };

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const next = lines[i + 1];

    if (next && line.includes('|') && isMarkdownSeparator(next)) {
      flushText();

      let title: string | undefined;
      let headers = parsePipeRow(line);
      if (headers[0]?.startsWith('Table:')) {
        title = headers[0].replace(/^Table:\s*/, '').trim();
        headers = headers.slice(1);
      }

      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        const row = parsePipeRow(lines[i]);
        if (row.length >= headers.length) rows.push(row.slice(0, headers.length));
        i += 1;
      }

      if (headers.length >= 2 && rows.length > 0) {
        segments.push({ type: 'table', title, headers, rows });
      } else {
        textBuffer.push(line, next, ...rows.map((row) => `| ${row.join(' | ')} |`));
      }
      continue;
    }

    textBuffer.push(line);
    i += 1;
  }

  flushText();
  return segments.length ? segments : [{ type: 'text', text: description }];
}

export function FeatureDescription({ description }: { description: string }) {
  const segments = parseDescriptionSegments(description);
  return (
    <div className="text-[11px] text-text-secondary mt-1 flex flex-col gap-2" style={{ lineHeight: 1.45 }}>
      {segments.map((segment, index) => {
        if (segment.type === 'text') {
          return (
            <div key={`text-${index}`} style={{ whiteSpace: 'pre-wrap' }}>
              {segment.text}
            </div>
          );
        }
        return (
          <div key={`table-${index}`} className="overflow-x-auto">
            {segment.title && <div className="text-[10px] font-medium text-text-primary mb-1">{segment.title}</div>}
            <table
              className="w-full text-left border-collapse"
              style={{
                border: '0.5px solid var(--color-border-tertiary)',
                borderRadius: 'var(--border-radius-sm)',
                overflow: 'hidden',
              }}
            >
              <thead>
                <tr>
                  {segment.headers.map((header) => (
                    <th
                      key={header}
                      className="text-[10px] font-medium text-text-primary"
                      style={{
                        padding: '5px 7px',
                        borderBottom: '0.5px solid var(--color-border-tertiary)',
                        background: 'var(--color-background-tertiary)',
                      }}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {segment.rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td
                        key={`${rowIndex}-${cellIndex}`}
                        className="text-[10px] text-text-secondary align-top"
                        style={{
                          padding: '5px 7px',
                          borderTop: rowIndex === 0 ? undefined : '0.5px solid var(--color-border-tertiary)',
                        }}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}

function getVisibleFeatures(build?: CharacterBuild, customSubclasses: CustomSubclassInfo[] = []): FeatureRow[] {
  const normalized = normalizeCharacterBuild(build);
  if (!normalized.enabled) return [];
  const rows: FeatureRow[] = [];
  for (const entry of normalized.class_levels) {
    const class_info = getClassInfo(entry.class_id);
    if (!class_info) continue;
    const detailsByName = new Map(
      class_info.features.map((feature) => [feature.name.toLowerCase(), feature])
    );
    for (const prog of class_info.progression.filter((row) => row.level <= entry.level)) {
      for (const featureName of prog.features) {
        if (/subclass feature/i.test(featureName)) continue;
        const detail = detailsByName.get(featureName.toLowerCase());
        rows.push({
          key: `${entry.id}-${prog.level}-${featureName}`,
          className: class_info.name,
          level: prog.level,
          name: featureName,
          description: detail?.description,
        });
      }
    }
    const subclass = getCombinedSubclassInfo(entry.class_id, entry.subclass_id, customSubclasses);
    if (subclass) {
      for (const feature of subclass.features.filter((feature) => feature.level <= entry.level)) {
        rows.push({
          key: `${entry.id}-${subclass.id}-${feature.level}-${feature.name}`,
          className: class_info.name,
          subclassName: subclass.name,
          level: feature.level,
          name: feature.name,
          description: feature.description,
        });
      }
    }
  }
  return rows.sort((a, b) => a.level - b.level || a.className.localeCompare(b.className) || a.name.localeCompare(b.name));
}

export function ClassFeaturesPanel({
  build,
  compact = false,
  title = 'Class features unlocked',
}: {
  build?: CharacterBuild;
  compact?: boolean;
  title?: string;
}) {
  const custom_subclasses = useClassHomebrewStore((state) => state.custom_subclasses);
  const features = getVisibleFeatures(build, custom_subclasses);
  const summary = formatCharacterBuildSummary(build, custom_subclasses);
  if (!summary) return null;

  return (
    <div
      className="mt-3"
      style={{
        border: '0.5px solid var(--color-border-tertiary)',
        borderRadius: 'var(--border-radius-md)',
        background: 'var(--color-background-secondary)',
        padding: compact ? 8 : 12,
      }}
    >
      <div className="flex justify-between gap-3 mb-2">
        <div>
          <div className="text-[12px] font-medium text-text-secondary">{title}</div>
          <div className="text-[10px] text-text-tertiary mt-0.5">{summary}</div>
        </div>
        <div className="text-[10px] text-text-tertiary" style={{ whiteSpace: 'nowrap' }}>
          {features.length} feature{features.length === 1 ? '' : 's'}
        </div>
      </div>

      {features.length === 0 ? (
        <div className="text-[11px] text-text-tertiary italic">No class features for the selected level yet.</div>
      ) : (
        <div className="flex flex-col gap-2" style={{ maxHeight: compact ? 220 : 360, overflow: 'auto' }}>
          {features.map((feature) => (
            <details key={feature.key} open={!compact}>
              <summary className="text-[11px] text-text-primary" style={{ cursor: 'pointer' }}>
                <span className="font-medium">Level {feature.level}: {feature.name}</span>
                <span className="text-text-tertiary"> · {feature.subclassName ?? feature.className}</span>
              </summary>
              {feature.description && <FeatureDescription description={feature.description} />}
            </details>
          ))}
        </div>
      )}
    </div>
  );
}
