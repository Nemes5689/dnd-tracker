import { useState } from 'react';
import { getAIProviderConfig, useSettingsStore } from '@/store/settingsStore';
import { chatCompletionBatchWithProvider } from '@/utils/openRouterClient';
import { buildTacticsMessages } from '@/ai/promptBuilder';
import type { Combatant, Encounter } from '@/types/app';
import type { Monster } from '@/types/srd';

interface Props {
  monster: Monster | null;
  combatant: Combatant;
  encounter: Encounter;
}

interface Suggestion {
  raw: string;
  // Parsed sections (best-effort)
  action?: string;
  narration?: string;
  // Was the response parsed into structured sections?
  parsed: boolean;
}

const NUM_SUGGESTIONS = 3;

export function AITacticsTab({ monster, combatant, encounter }: Props) {
  const settings = useSettingsStore();
  const [loading, set_loading] = useState(false);
  const [suggestions, set_suggestions] = useState<Suggestion[]>([]);
  const [error, set_error] = useState<string | null>(null);
  const [show_raw, set_show_raw] = useState(false);

  if (combatant.is_player) {
    return (
      <div className="text-[12px] text-text-tertiary italic p-2">
        AI tactics suggestions are available for monsters and ally/summon statblocks. Player characters decide their own actions.
      </div>
    );
  }

  if (!monster) {
    return (
      <div className="text-[12px] text-text-tertiary italic p-2">
        AI tactics need a statblock. This combatant has no source statblock
        (custom or removed).
      </div>
    );
  }

  const ai_config = getAIProviderConfig(settings);

  if (!ai_config.api_key) {
    return (
      <div
        className="text-[12px] p-3 leading-relaxed"
        style={{
          background: 'var(--color-background-info)',
          border: '0.5px solid var(--color-border-info)',
          borderRadius: 'var(--border-radius-md)',
          color: 'var(--color-text-info)',
        }}
      >
        <strong>AI API key needed.</strong>
        <br />
        Add a key in Settings to enable AI tactics suggestions. OpenRouter, Google AI Studio and custom OpenAI-compatible APIs are supported.
      </div>
    );
  }

  const handleGenerate = async () => {
    set_loading(true);
    set_error(null);
    set_suggestions([]);

    try {
      const messages = buildTacticsMessages({
        monster,
        combatant,
        encounter,
        language: settings.ai_language,
      });

      const requests = Array.from({ length: NUM_SUGGESTIONS }, (_, i) => ({
        model: ai_config.model,
        messages,
        temperature: 0.7 + i * 0.15,
        max_tokens: 500,
      }));

      const responses = await chatCompletionBatchWithProvider(
        ai_config,
        requests
      );

      const parsed = responses.map((r) => parseTacticsResponse(r.text));
      set_suggestions(parsed);

      // Auto-show raw if all responses had parsing issues
      const all_unparsed = parsed.every((p) => !p.parsed);
      if (all_unparsed) {
        set_show_raw(true);
      }
    } catch (err: any) {
      set_error(err.message ?? String(err));
    } finally {
      set_loading(false);
    }
  };

  return (
    <div>
      {suggestions.length === 0 && !loading && !error && (
        <button
          onClick={handleGenerate}
          className="bg-accent-50 border-accent-300 text-accent-900 font-medium w-full"
          style={{ padding: '10px', fontSize: '13px' }}
        >
          🤖 AI Suggest tactics ({NUM_SUGGESTIONS} options)
        </button>
      )}

      {loading && (
        <div className="text-center p-4">
          <div className="text-[12px] text-text-secondary">
            Generating {NUM_SUGGESTIONS} tactics suggestions…
          </div>
          <div className="text-[10px] text-text-tertiary mt-1">
            Using {ai_config.provider} · {ai_config.model}
          </div>
        </div>
      )}

      {error && (
        <div
          className="p-3 mb-2 text-[12px] leading-relaxed"
          style={{
            background: 'var(--color-background-danger)',
            border: '0.5px solid var(--color-border-danger)',
            borderRadius: 'var(--border-radius-md)',
            color: 'var(--color-text-danger)',
          }}
        >
          <strong>Error:</strong> {error}
          <button
            onClick={handleGenerate}
            className="mt-2 block"
            style={{ fontSize: '11px', padding: '4px 10px' }}
          >
            Try again
          </button>
        </div>
      )}

      {suggestions.length > 0 && !loading && (
        <>
          <div className="flex justify-between items-center mb-2">
            <div className="text-[11px] text-text-tertiary">
              Pick a tactic for {combatant.name}:
            </div>
            <button
              onClick={() => set_show_raw(!show_raw)}
              style={{ fontSize: '10px', padding: '2px 8px' }}
              title="Toggle raw / parsed view"
            >
              {show_raw ? 'Show parsed' : 'Show raw'}
            </button>
          </div>
          <div className="flex flex-col gap-2 mb-3">
            {suggestions.map((s, i) => (
              <SuggestionCard
                key={i}
                index={i + 1}
                suggestion={s}
                show_raw={show_raw}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleGenerate}
              style={{ flex: 1, fontSize: '12px', padding: '6px' }}
            >
              🔄 Try again ({NUM_SUGGESTIONS} more)
            </button>
            <button
              onClick={() => set_suggestions([])}
              style={{ fontSize: '12px', padding: '6px 12px' }}
            >
              Clear
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function SuggestionCard({
  index,
  suggestion,
  show_raw,
}: {
  index: number;
  suggestion: Suggestion;
  show_raw: boolean;
}) {
  const has_content = !!(suggestion.raw || suggestion.action || suggestion.narration);

  return (
    <div
      style={{
        padding: '10px 12px',
        background: 'var(--color-background-primary)',
        border: '0.5px solid var(--color-border-tertiary)',
        borderRadius: 'var(--border-radius-md)',
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: '#534AB7',
            color: '#fff',
            fontSize: 11,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {index}
        </div>
        <div className="text-[11px] text-text-tertiary uppercase tracking-wider">
          Option {index}
        </div>
      </div>

      {!has_content ? (
        <div
          className="text-[11px] italic"
          style={{ color: 'var(--color-text-danger)' }}
        >
          (Empty response from AI — try again, or switch to another model in
          Settings.)
        </div>
      ) : show_raw || !suggestion.parsed ? (
        // Show raw text
        <>
          {!suggestion.parsed && (
            <div
              className="text-[10px] mb-2 italic"
              style={{ color: 'var(--color-text-tertiary)' }}
            >
              (Couldn't auto-parse — showing raw response.)
            </div>
          )}
          <div
            className="text-[12px] leading-relaxed"
            style={{ whiteSpace: 'pre-wrap' }}
          >
            {suggestion.raw || '(empty)'}
          </div>
        </>
      ) : (
        // Show parsed view
        <>
          {suggestion.action && (
            <>
              <div className="text-[11px] font-medium text-text-secondary mb-1">
                Action
              </div>
              <div className="text-[12px] leading-relaxed mb-2">
                {suggestion.action}
              </div>
            </>
          )}
          {suggestion.narration && (
            <>
              <div className="text-[11px] font-medium text-text-secondary mb-1">
                Narration
              </div>
              <div
                className="text-[12px] leading-relaxed italic"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {suggestion.narration}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

/**
 * Try to parse the AI's response into action + narration sections.
 *
 * The model is asked to use **Action**: ... and **Narration**: ... (or
 * magyar Akció/Narratíva), but models are unreliable about this format.
 * We try several patterns and fall back to showing raw text.
 */
function parseTacticsResponse(raw: string): Suggestion {
  const text = (raw ?? '').trim();

  if (!text) {
    return { raw: '', parsed: false };
  }

  // Strip leading/trailing markdown noise
  const cleaned = text.replace(/^\s*```[\w]*\n?/, '').replace(/\n?```\s*$/, '');

  // Try to find Action and Narration sections.
  // Match these label patterns:
  //   **Action**:  /  **Action:**  /  ## Action  /  Action:
  //   Same for Akció (HU)
  //   Same for Narration / Narratíva
  const action_label = /(?:\*\*\s*)?(?:##\s*)?(?:Action|Akció|Akci\u00F3)\s*\*?\*?\s*[:.]?\s*\*?\*?/i;
  const narration_label = /(?:\*\*\s*)?(?:##\s*)?(?:Narration|Narratíva|Narrat\u00EDva)\s*\*?\*?\s*[:.]?\s*\*?\*?/i;

  const action_idx = cleaned.search(action_label);
  const narration_idx = cleaned.search(narration_label);

  // Both labels found, in correct order
  if (action_idx !== -1 && narration_idx !== -1 && action_idx < narration_idx) {
    const action_match = cleaned.slice(action_idx).match(action_label);
    const narration_match = cleaned.slice(narration_idx).match(narration_label);
    if (action_match && narration_match) {
      const action_start = action_idx + action_match[0].length;
      const action_text = cleaned.slice(action_start, narration_idx).trim();
      const narration_start = narration_idx + narration_match[0].length;
      const narration_text = cleaned.slice(narration_start).trim();

      return {
        raw: text,
        action: cleanFragment(action_text),
        narration: cleanFragment(narration_text),
        parsed: action_text.length > 0 && narration_text.length > 0,
      };
    }
  }

  // Only Action found
  if (action_idx !== -1 && narration_idx === -1) {
    const action_match = cleaned.slice(action_idx).match(action_label);
    if (action_match) {
      const start = action_idx + action_match[0].length;
      return {
        raw: text,
        action: cleanFragment(cleaned.slice(start).trim()),
        parsed: true,
      };
    }
  }

  // No structured format detected
  return { raw: text, parsed: false };
}

/**
 * Clean a section fragment: strip leading/trailing markdown stars,
 * strip leading dashes/colons, normalise whitespace.
 */
function cleanFragment(s: string): string {
  return s
    .replace(/^[\s\-:*]+/, '')
    .replace(/^\*\*/, '')
    .replace(/\*\*$/, '')
    .trim();
}
