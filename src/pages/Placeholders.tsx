import { useSettingsStore } from '@/store/settingsStore';

export function RulesLookupPage() {
  return (
    <div className="p-8">
      <h2 className="mb-2">Rules lookup</h2>
      <p className="text-text-tertiary text-[14px] italic">
        Context-aware rules chat coming soon.
      </p>
    </div>
  );
}

export function SettingsPage() {
  const settings = useSettingsStore();

  return (
    <div className="p-8 max-w-[720px]">
      <h2 className="mb-6">Settings</h2>

      <div
        className="bg-bg-primary mb-4"
        style={{
          padding: '18px 22px',
          border: '0.5px solid var(--color-border-tertiary)',
          borderRadius: 'var(--border-radius-lg)',
        }}
      >
        <div className="text-[14px] font-medium mb-1">AI provider</div>
        <div className="text-[12px] text-text-secondary mb-4">
          Bring your own OpenRouter API key. Your key stays in this browser
          only.
        </div>

        <label className="text-[11px] text-text-tertiary block mb-1">
          OpenRouter API key
        </label>
        <input
          type="password"
          value={settings.openrouter_api_key}
          onChange={(e) => settings.update({ openrouter_api_key: e.target.value })}
          className="w-full font-mono"
          placeholder="sk-or-v1-..."
        />
        <div className="text-[11px] text-text-tertiary mt-1">
          Don't have one?{' '}
          <a
            href="https://openrouter.ai/sign-up"
            target="_blank"
            rel="noreferrer"
            style={{ color: 'var(--color-text-info)' }}
          >
            Get one free at openrouter.ai →
          </a>
        </div>

        <div className="mt-4">
          <label className="text-[11px] text-text-tertiary block mb-1">
            Model
          </label>
          <select
            value={settings.default_model}
            onChange={(e) => settings.update({ default_model: e.target.value })}
            className="w-full"
          >
            <optgroup label="Free models (no credits needed)">
              <option value="openrouter/free">
                openrouter/free — auto-router (recommended)
              </option>
              <option value="meta-llama/llama-3.3-70b-instruct:free">
                Llama 3.3 70B (free) — general purpose
              </option>
              <option value="google/gemma-3-27b-it:free">
                Gemma 3 27B (free) — Google
              </option>
              <option value="z-ai/glm-4.5-air:free">
                GLM 4.5 Air (free) — Z.AI
              </option>
              <option value="qwen/qwen3-next-80b-a3b-instruct:free">
                Qwen3 Next 80B (free)
              </option>
              <option value="nvidia/nemotron-3-nano-30b-a3b:free">
                Nemotron 3 Nano 30B (free) — NVIDIA, fast
              </option>
            </optgroup>
            <optgroup label="Paid models (better quality)">
              <option value="anthropic/claude-haiku-4-5">
                anthropic/claude-haiku-4-5 (~$0.50 / session)
              </option>
              <option value="anthropic/claude-sonnet-4-6">
                anthropic/claude-sonnet-4-6 (~$2-3 / session)
              </option>
              <option value="openai/gpt-4o-mini">
                openai/gpt-4o-mini (~$0.30 / session)
              </option>
            </optgroup>
          </select>
          <div className="text-[11px] text-text-tertiary mt-1">
            "openrouter/free" auto-selects an available free model. Free models
            have rate limits (~20 req/min, 200/day) but cost nothing.
          </div>
        </div>

        <div className="mt-4">
          <label className="text-[11px] text-text-tertiary block mb-1">
            AI response language
          </label>
          <select
            value={settings.ai_language}
            onChange={(e) =>
              settings.update({ ai_language: e.target.value as 'magyar' | 'english' })
            }
            className="w-full"
          >
            <option value="magyar">Magyar</option>
            <option value="english">English</option>
          </select>
          <div className="text-[11px] text-text-tertiary mt-1">
            Tactics suggestions and narration will be in this language.
          </div>
        </div>
      </div>

      <div
        className="bg-bg-primary"
        style={{
          padding: '18px 22px',
          border: '0.5px solid var(--color-border-tertiary)',
          borderRadius: 'var(--border-radius-lg)',
        }}
      >
        <div className="text-[14px] font-medium mb-3">About</div>
        <div className="text-[12px] text-text-secondary leading-relaxed">
          <p className="mb-2">
            Spells, conditions, rules, and equipment data are from the System
            Reference Document 5.2 ("SRD 5.2") by Wizards of the Coast LLC,
            available at{' '}
            <a
              href="https://www.dndbeyond.com/srd"
              target="_blank"
              rel="noreferrer"
              style={{ color: 'var(--color-text-info)' }}
            >
              dndbeyond.com/srd
            </a>
            . The SRD 5.2 is licensed under the{' '}
            <a
              href="https://creativecommons.org/licenses/by/4.0/legalcode"
              target="_blank"
              rel="noreferrer"
              style={{ color: 'var(--color-text-info)' }}
            >
              Creative Commons Attribution 4.0 International License
            </a>
            .
          </p>
          <p>
            Monster statblocks are from the Monster Manual 2024 by Wizards of
            the Coast LLC. This is a private/personal-use tool; statblocks are
            referenced for personal play only and not licensed for redistribution.
          </p>
        </div>
      </div>
    </div>
  );
}
