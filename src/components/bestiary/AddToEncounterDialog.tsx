import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { rollD20 } from '@/engine/dice';
import { useDialogFocus } from '@/hooks/useDialogFocus';
import { monsterToCombatant } from '@/pages/CombatPage';
import { useCampaignStore } from '@/store/campaignStore';
import { useEncounterStore } from '@/store/encounterStore';
import type { Monster } from '@/types/srd';

interface Props {
  monster: Monster;
  onClose: () => void;
  onAdded: (result: { id: string; name: string; count: number }) => void;
}

export function AddToEncounterDialog({ monster, onClose, onAdded }: Props) {
  const ref = useDialogFocus(onClose);
  const campaignId = useCampaignStore(state => state.active_campaign_id);
  const encounters = useEncounterStore(state => state.encounters);
  const choices = encounters.filter(encounter => encounter.campaign_id === campaignId && encounter.status !== 'completed');
  const [encounterId, setEncounterId] = useState('');
  const [count, setCount] = useState(1);
  const [error, setError] = useState('');

  function add(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const store = useEncounterStore.getState();
    const encounter = store.getEncounter(encounterId);
    if (!encounter || encounter.campaign_id !== useCampaignStore.getState().active_campaign_id || encounter.status === 'completed') {
      setError('Choose an available encounter in the current campaign.');
      return;
    }
    const related = encounter.combatants.filter(combatant =>
      combatant.source_type === 'monster' && combatant.source_id === monster.id
    );
    const names = new Set(related.map(combatant => combatant.name));
    let index = related.length;
    for (let added = 0; added < count; added++) {
      while (names.has(index === 0 ? monster.name : `${monster.name} #${index + 1}`)) index++;
      const initiative = rollD20(monster.initiative?.modifier ?? 0).total;
      const combatant = monsterToCombatant(monster, index++, initiative);
      names.add(combatant.name);
      store.addCombatant(encounter.id, combatant);
      if (monster.avatar) store.setTokenStyle(encounter.id, { combatant_id: combatant.id, avatar: monster.avatar });
      if (encounter.status === 'active') store.log(encounter.id, `${combatant.name} joined combat (init ${initiative})`);
    }
    onAdded({ id: encounter.id, name: encounter.name, count });
  }

  return (
    <div className="fixed inset-0 z-[99] flex items-center justify-center bg-black/40">
      <div ref={ref} className="combat-dialog bg-bg-primary w-[90%] max-w-md max-h-[80vh] overflow-y-auto rounded-lg p-5 shadow-lg"
        role="dialog" aria-modal="true" aria-labelledby="bestiary-add-heading" tabIndex={-1}>
        <div className="flex justify-between items-start gap-3 mb-3">
          <h2 id="bestiary-add-heading">Add {monster.name} to an encounter</h2>
          <button type="button" onClick={onClose} aria-label="Close dialog">×</button>
        </div>
        {choices.length ? (
          <form className="flex flex-col gap-3" onSubmit={add}>
            <label className="flex flex-col gap-1">
              Encounter
              <select value={encounterId} onChange={event => { setEncounterId(event.target.value); setError(''); }} required>
                <option value="" disabled>Choose an encounter</option>
                {choices.map(encounter => (
                  <option key={encounter.id} value={encounter.id}>{encounter.name} ({encounter.status})</option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1">
              Quantity
              <select value={count} onChange={event => setCount(Number(event.target.value))}>
                <option value={1}>1</option>
                <option value={3}>3</option>
              </select>
            </label>
            {error && <p role="alert" className="text-text-danger">{error}</p>}
            <div className="flex justify-end gap-2">
              <button type="button" onClick={onClose}>Cancel</button>
              <button type="submit" disabled={!choices.some(encounter => encounter.id === encounterId)}
                className="bg-accent-50 border-accent-300 text-accent-900">Add creatures</button>
            </div>
          </form>
        ) : (
          <p>{campaignId ? <><Link className="underline" to="/combat">Create an encounter</Link> in the current campaign first.</>
            : 'Create or select a campaign before adding creatures.'}</p>
        )}
      </div>
    </div>
  );
}
