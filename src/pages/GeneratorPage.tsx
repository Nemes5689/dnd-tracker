import { useState } from 'react';

const generators = [
  { id: 'all', name: 'All generators', path: '', description: 'Choose a local session-planning tool.' },
  { id: 'realm', name: 'Realm', path: 'perilous-shores/', description: 'Create a regional map for your next adventure.' },
  { id: 'city', name: 'City', path: 'city-generator/', description: 'Generate a medieval fantasy city.' },
  { id: 'village', name: 'Village', path: 'village-generator/', description: 'Create a village for your party to explore.' },
  { id: 'cave', name: 'Cave / Glade', path: 'cave-generator/', description: 'Generate a cave or wilderness location.' },
  { id: 'dungeon', name: 'Dungeon', path: 'one-page-dungeon/', description: 'Create a one-page dungeon for your session.' },
  { id: 'dwelling', name: 'Dwelling', path: 'dwellings/', description: 'Generate a dwelling and its floor plan.' },
];

export function GeneratorPage() {
  const [selectedId, setSelectedId] = useState('all');
  const [reloadKey, setReloadKey] = useState(0);
  const selected = generators.find((generator) => generator.id === selectedId) ?? generators[0];
  const url = `${import.meta.env.BASE_URL}generators/watabou/${selected.path}index.html`;
  const originalUrl = `https://watabou.github.io/${selected.path}`;

  return (
    <div className="generator-page">
      <header className="generator-header">
        <div>
          <h1>Generator</h1>
          <p className="text-text-secondary">Maps and locations for your next session, powered by Watabou’s Procgen Arcana.</p>
        </div>
        <a href={originalUrl} target="_blank" rel="noopener noreferrer" className="generator-external-link">
          Visit original ↗
        </a>
      </header>

      <div className="generator-toolbar">
        <label htmlFor="generator-tool">Tool</label>
        <select id="generator-tool" value={selectedId} onChange={(event) => setSelectedId(event.target.value)}>
          {generators.map((generator) => (
            <option key={generator.id} value={generator.id}>{generator.name}</option>
          ))}
        </select>
        <span className="text-text-secondary">{selected.description}</span>
        <button type="button" onClick={() => setReloadKey((key) => key + 1)}>Reload tool</button>
      </div>

      <p className="text-text-tertiary text-[12px]">
        Tools run locally and work offline while the app is running. Switching or reloading tools resets the current view; export your work from the tool first.
        {selected.id === 'city' && ' City emblems use an external service and are unavailable in this offline copy.'}
      </p>

      <iframe
        key={`${selected.id}-${reloadKey}`}
        src={url}
        title={`Watabou — ${selected.name}`}
        className="generator-frame"
        sandbox="allow-scripts allow-same-origin allow-downloads allow-popups allow-popups-to-escape-sandbox allow-forms allow-modals"
        allow="fullscreen"
        referrerPolicy="no-referrer"
      />

      <p className="text-text-tertiary text-[12px]">
        Tools by <a href="https://watabou.github.io/" target="_blank" rel="noopener noreferrer">Oleg Dolya / Watabou</a>.
        {' '}Export generated maps using the tool’s own controls to keep them for your campaign.
      </p>
    </div>
  );
}
