import { useRef, useState } from 'react';
import { useCampaignStore } from '@/store/campaignStore';
import { useSettingsStore } from '@/store/settingsStore';
import {
  describeBackupSize,
  downloadBackup,
  formatBytes,
  readBackupFile,
  restoreBackup,
} from '@/utils/backup';

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
  const activeCampaign = useCampaignStore((s) => s.getActiveCampaign());

  return (
    <div className="p-8 max-w-[720px]">
      <h2 className="mb-6">Settings</h2>


      <BackupRestorePanel campaignName={activeCampaign?.name} />

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
          Choose OpenRouter, Google AI Studio, or any OpenAI-compatible API.
          API keys stay in this browser only.
        </div>

        <label className="text-[11px] text-text-tertiary block mb-1">
          Provider
        </label>
        <select
          value={settings.ai_provider}
          onChange={(e) =>
            settings.update({
              ai_provider: e.target.value as 'openrouter' | 'google-ai-studio' | 'openai-compatible',
            })
          }
          className="w-full"
        >
          <option value="openrouter">OpenRouter</option>
          <option value="google-ai-studio">Google AI Studio / Gemini API</option>
          <option value="openai-compatible">Custom OpenAI-compatible API</option>
        </select>

        {settings.ai_provider === 'openrouter' && (
          <>
            <div className="mt-4">
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
            </div>

            <div className="mt-4">
              <label className="text-[11px] text-text-tertiary block mb-1">
                OpenRouter model
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
                    anthropic/claude-haiku-4-5
                  </option>
                  <option value="anthropic/claude-sonnet-4-6">
                    anthropic/claude-sonnet-4-6
                  </option>
                  <option value="openai/gpt-4o-mini">
                    openai/gpt-4o-mini
                  </option>
                </optgroup>
              </select>
              <div className="text-[11px] text-text-tertiary mt-1">
                "openrouter/free" auto-selects an available free model.
              </div>
            </div>
          </>
        )}

        {settings.ai_provider === 'google-ai-studio' && (
          <>
            <div className="mt-4">
              <label className="text-[11px] text-text-tertiary block mb-1">
                Google AI Studio API key
              </label>
              <input
                type="password"
                value={settings.google_ai_api_key}
                onChange={(e) => settings.update({ google_ai_api_key: e.target.value })}
                className="w-full font-mono"
                placeholder="AIza..."
              />
              <div className="text-[11px] text-text-tertiary mt-1">
                Create a key in Google AI Studio, then paste it here.
              </div>
            </div>
            <div className="mt-4">
              <label className="text-[11px] text-text-tertiary block mb-1">
                Gemini model
              </label>
              <input
                value={settings.google_ai_model}
                onChange={(e) => settings.update({ google_ai_model: e.target.value })}
                className="w-full font-mono"
                placeholder="gemini-1.5-flash"
              />
              <div className="text-[11px] text-text-tertiary mt-1">
                Examples: gemini-1.5-flash, gemini-1.5-pro, gemini-2.0-flash.
              </div>
            </div>
          </>
        )}

        {settings.ai_provider === 'openai-compatible' && (
          <>
            <div className="mt-4">
              <label className="text-[11px] text-text-tertiary block mb-1">
                API key
              </label>
              <input
                type="password"
                value={settings.custom_ai_api_key}
                onChange={(e) => settings.update({ custom_ai_api_key: e.target.value })}
                className="w-full font-mono"
                placeholder="sk-..."
              />
            </div>
            <div className="mt-4">
              <label className="text-[11px] text-text-tertiary block mb-1">
                Base URL
              </label>
              <input
                value={settings.custom_ai_base_url}
                onChange={(e) => settings.update({ custom_ai_base_url: e.target.value })}
                className="w-full font-mono"
                placeholder="https://api.openai.com/v1"
              />
              <div className="text-[11px] text-text-tertiary mt-1">
                For custom providers the app needs both the key and the compatible API base URL. The app appends /chat/completions automatically unless you paste the full endpoint.
              </div>
            </div>
            <div className="mt-4">
              <label className="text-[11px] text-text-tertiary block mb-1">
                Model
              </label>
              <input
                value={settings.custom_ai_model}
                onChange={(e) => settings.update({ custom_ai_model: e.target.value })}
                className="w-full font-mono"
                placeholder="gpt-4o-mini"
              />
            </div>
          </>
        )}

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


function BackupRestorePanel({ campaignName }: { campaignName?: string }) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [status, setStatus] = useState<string>('');
  const [isImporting, setIsImporting] = useState(false);
  const { bytes, keyCount } = describeBackupSize();

  const handleExport = () => {
    downloadBackup(campaignName);
    setStatus('Backup file downloaded. Keep it somewhere safe.');
  };

  const handleImport = async (file: File | undefined) => {
    if (!file) return;
    setIsImporting(true);
    setStatus('');
    try {
      const backup = await readBackupFile(file);
      const count = Object.keys(backup.items).length;
      const ok = window.confirm(
        `Restore this backup from ${new Date(backup.exported_at).toLocaleString()}?\n\n` +
          `It contains ${count} saved data sections. This will replace the current campaigns, dashboard notes, characters, custom monsters, allies, encounters, battle maps, uploaded images, and settings in this browser.`
      );
      if (!ok) return;
      restoreBackup(backup);
      window.alert('Backup restored. The app will reload now.');
      window.location.reload();
    } catch (err) {
      setStatus(err instanceof Error ? err.message : 'Import failed.');
    } finally {
      setIsImporting(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div
      className="bg-bg-primary mb-4"
      style={{
        padding: '18px 22px',
        border: '0.5px solid var(--color-border-tertiary)',
        borderRadius: 'var(--border-radius-lg)',
      }}
    >
      <div className="text-[14px] font-medium mb-1">Backup / restore</div>
      <div className="text-[12px] text-text-secondary mb-4 leading-relaxed">
        Export everything saved in this browser: campaign dashboard content,
        party characters, custom monsters, allies, encounters, combat state,
        battle maps, uploaded portraits/gallery images, token images, and app
        settings. The file can be imported later or moved to another browser.
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <button
          onClick={handleExport}
          className="bg-accent-50 border-accent-300 text-accent-900 font-medium"
          style={{ padding: '7px 14px', fontSize: '12px' }}
        >
          Export full backup
        </button>

        <button
          onClick={() => inputRef.current?.click()}
          disabled={isImporting}
          style={{ padding: '7px 14px', fontSize: '12px' }}
        >
          {isImporting ? 'Importing…' : 'Import backup'}
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(e) => void handleImport(e.target.files?.[0])}
        />
      </div>

      <div className="text-[11px] text-text-tertiary mt-3 leading-relaxed">
        Current backup size: {formatBytes(bytes)} across {keyCount} saved
        sections. Because uploaded images are stored as data URLs, large maps or
        galleries can make this file large. The OpenRouter API key is part of
        settings, so keep exported backups private.
      </div>

      {status && (
        <div className="text-[12px] text-text-secondary mt-3">{status}</div>
      )}
    </div>
  );
}
