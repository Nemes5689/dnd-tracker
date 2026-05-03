// Loads SRD JSON files at startup

import type { Monster, Spell, Condition, Rule, Equipment } from '@/types/srd';

interface SRDData {
  monsters: Monster[];
  spells: Spell[];
  conditions: Condition[];
  rules: Rule[];
  equipment: Equipment | null;
}

let cache: SRDData | null = null;

// Vite serves files from /public at the root, but with `base` set in vite.config.ts
// the actual path includes the base. import.meta.env.BASE_URL gives us this prefix.
function dataUrl(filename: string): string {
  return `${import.meta.env.BASE_URL}data/${filename}`;
}

export async function loadSRDData(): Promise<SRDData> {
  if (cache) return cache;

  const [monstersR, spellsR, conditionsR, rulesR, equipmentR] = await Promise.all([
    fetch(dataUrl('monsters.json')).then(r => r.json()),
    fetch(dataUrl('spells.json')).then(r => r.json()),
    fetch(dataUrl('conditions.json')).then(r => r.json()),
    fetch(dataUrl('rules.json')).then(r => r.json()),
    fetch(dataUrl('equipment.json')).then(r => r.json()).catch(() => null),
  ]);

  cache = {
    monsters: monstersR.monsters,
    spells: spellsR.spells,
    conditions: conditionsR.conditions,
    rules: rulesR.rules,
    equipment: equipmentR,
  };

  return cache;
}

export function getCachedSRDData(): SRDData | null {
  return cache;
}
