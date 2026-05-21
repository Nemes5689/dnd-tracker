// User settings (API keys, AI provider, preferences)

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Settings } from '@/types/app';

interface SettingsStore extends Settings {
  update: (patch: Partial<Settings>) => void;
}

// The default free model. We use openrouter/free which is OpenRouter's
// auto-router for free models — it picks an available free model
// automatically, so we don't have to track when individual model names
// get deprecated.
const DEFAULT_OPENROUTER_MODEL = 'openrouter/free';
const DEFAULT_GOOGLE_MODEL = 'gemini-1.5-flash';
const DEFAULT_CUSTOM_MODEL = 'gpt-4o-mini';

// Old model names we've migrated away from. If a user's settings has one
// of these stored from a previous version, we silently upgrade them.
const DEPRECATED_MODELS = new Set([
  'deepseek/deepseek-chat-v3-0324:free',
]);

const DEFAULT_SETTINGS: Omit<SettingsStore, 'update'> = {
  ai_provider: 'openrouter',
  openrouter_api_key: '',
  google_ai_api_key: '',
  custom_ai_api_key: '',
  custom_ai_base_url: '',
  default_model: DEFAULT_OPENROUTER_MODEL,
  google_ai_model: DEFAULT_GOOGLE_MODEL,
  custom_ai_model: DEFAULT_CUSTOM_MODEL,
  ai_language: 'magyar',
  auto_roll: true,
  auto_ai_on_monster_turn: false,
  initiative_mode: 'individual',
  show_knowledge_panel: true,
};

export function getAIProviderConfig(settings: Settings) {
  if (settings.ai_provider === 'google-ai-studio') {
    return {
      provider: 'google-ai-studio' as const,
      api_key: settings.google_ai_api_key,
      model: settings.google_ai_model || DEFAULT_GOOGLE_MODEL,
    };
  }

  if (settings.ai_provider === 'openai-compatible') {
    return {
      provider: 'openai-compatible' as const,
      api_key: settings.custom_ai_api_key,
      model: settings.custom_ai_model || DEFAULT_CUSTOM_MODEL,
      custom_base_url: settings.custom_ai_base_url,
    };
  }

  return {
    provider: 'openrouter' as const,
    api_key: settings.openrouter_api_key,
    model: settings.default_model || DEFAULT_OPENROUTER_MODEL,
  };
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,
      update: (patch) => set(patch),
    }),
    {
      name: 'dnd-tracker-settings',
      // Migrate old persisted settings: if the stored model name is now
      // deprecated, replace it with the current default. Also backfill new
      // provider-specific fields added after the first OpenRouter-only version.
      migrate: (persisted: any) => {
        const merged = { ...DEFAULT_SETTINGS, ...(persisted ?? {}) } as Settings;
        if (DEPRECATED_MODELS.has(merged.default_model)) {
          merged.default_model = DEFAULT_OPENROUTER_MODEL;
        }
        return merged;
      },
      version: 3,
    }
  )
);
