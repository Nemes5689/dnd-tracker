import { useAlliesStore } from '@/store/alliesStore';
import { useCampaignStore } from '@/store/campaignStore';
import { useCustomMonsterStore } from '@/store/customMonsterStore';
import { useSRDStore } from '@/store/srdStore';
import type { CombatantTokenStyle, Encounter } from '@/types/app';

export function resolveTokenStyles(encounter: Encounter): CombatantTokenStyle[] {
  const styles = new Map(encounter.token_styles?.map((style) => [style.combatant_id, style]));
  const characters = useCampaignStore.getState().campaigns
    .find((campaign) => campaign.id === encounter.campaign_id)?.characters ?? [];
  const allies = useAlliesStore.getState().allies;
  const customMonsters = useCustomMonsterStore.getState().monsters;
  const monsters = useSRDStore.getState().monsters;

  for (const combatant of encounter.combatants) {
    const saved = styles.get(combatant.id);
    if (saved?.avatar) continue;

    const source = combatant.source_type === 'character'
      ? characters.find((item) => item.id === combatant.source_id)
      : combatant.source_type === 'ally'
      ? allies.find((item) => item.id === combatant.source_id)
      : customMonsters.find((item) => item.id === combatant.source_id)
        ?? monsters.find((item) => item.id === combatant.source_id);

    if (source?.avatar) {
      styles.set(combatant.id, { ...saved, combatant_id: combatant.id, avatar: source.avatar });
    }
  }

  return [...styles.values()];
}
