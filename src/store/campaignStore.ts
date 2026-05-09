// Zustand store for campaigns, characters, encounters
// Persists to localStorage

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Campaign } from '@/types/app';

interface CampaignStore {
  campaigns: Campaign[];
  active_campaign_id: string | null;

  // Campaign CRUD
  createCampaign: (name: string, description?: string) => string;
  updateCampaign: (id: string, patch: Partial<Campaign>) => void;
  deleteCampaign: (id: string) => void;
  setActiveCampaign: (id: string) => void;

  // Helpers
  getActiveCampaign: () => Campaign | null;
}

export const useCampaignStore = create<CampaignStore>()(
  persist(
    (set, get) => ({
      campaigns: [],
      active_campaign_id: null,

      createCampaign: (name, description = '') => {
        const id = crypto.randomUUID();
        const campaign: Campaign = {
          id,
          name,
          description,
          story_status: '',
          last_session_recap: '',
          next_session_plan: '',
          notes: [],
          characters: [],
          custom_monsters: [],
          encounter_ids: [],
          created_at: Date.now(),
          updated_at: Date.now(),
        };
        set((s) => ({
          campaigns: [...s.campaigns, campaign],
          active_campaign_id: s.active_campaign_id ?? id,
        }));
        return id;
      },

      updateCampaign: (id, patch) =>
        set((s) => ({
          campaigns: s.campaigns.map((c) =>
            c.id === id ? { ...c, ...patch, updated_at: Date.now() } : c
          ),
        })),

      deleteCampaign: (id) =>
        set((s) => ({
          campaigns: s.campaigns.filter((c) => c.id !== id),
          active_campaign_id:
            s.active_campaign_id === id
              ? s.campaigns.find((c) => c.id !== id)?.id ?? null
              : s.active_campaign_id,
        })),

      setActiveCampaign: (id) => set({ active_campaign_id: id }),

      getActiveCampaign: () => {
        const s = get();
        return s.campaigns.find((c) => c.id === s.active_campaign_id) ?? null;
      },
    }),
    {
      name: 'dnd-tracker-campaigns',
    }
  )
);
