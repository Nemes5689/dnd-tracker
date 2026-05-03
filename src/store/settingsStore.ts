// User settings (API key, preferences)

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
const DEFAULT_MODEL = 'openrouter/free';

// Old model names we've migrated away from. If a user's settings has one
// of these stored from a previous version, we silently upgrade them.
const DEPRECATED_MODELS = new Set([
  'deepseek/deepseek-chat-v3-0324:free',
]);

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      openrouter_api_key: '',
      default_model: DEFAULT_MODEL,
      ai_language: 'magyar',
      auto_roll: true,
      auto_ai_on_monster_turn: false,
      initiative_mode: 'individual',
      show_knowledge_panel: true,
      update: (patch) => set(patch),
    }),
    {
      name: 'dnd-tracker-settings',
      // Migrate old persisted settings: if the stored model name is now
      // deprecated, replace it with the current default.
      migrate: (persisted: any) => {
        if (
          persisted &&
          typeof persisted === 'object' &&
          DEPRECATED_MODELS.has(persisted.default_model)
        ) {
          return { ...persisted, default_model: DEFAULT_MODEL };
        }
        return persisted;
      },
      version: 2,
    }
  )
);
