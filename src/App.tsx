import { HashRouter, Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { DashboardPage } from '@/pages/DashboardPage';
import { BestiaryPage } from '@/pages/BestiaryPage';
import { CombatPage } from '@/pages/CombatPage';
import { CharactersPage } from '@/pages/CharactersPage';
import { AlliesPage } from '@/pages/AlliesPage';
import { EncountersPage } from '@/pages/EncountersPage';
import { ClassesPage } from '@/pages/ClassesPage';
import { SpellsPage } from '@/pages/SpellsPage';
import { OriginsPage } from '@/pages/OriginsPage';
import { MapPage } from '@/pages/MapPage';
import { ProjectorView } from '@/pages/ProjectorView';
import {
  RulesLookupPage,
  SettingsPage,
} from '@/pages/Placeholders';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        {/* Projector route - no Layout wrapper, fullscreen */}
        <Route path="/projector" element={<ProjectorView />} />

        {/* Main routes */}
        <Route element={<Layout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/combat" element={<CombatPage />} />
          <Route path="/bestiary" element={<BestiaryPage />} />
          <Route path="/characters" element={<CharactersPage />} />
          <Route path="/classes" element={<ClassesPage />} />
          <Route path="/spells" element={<SpellsPage />} />
          <Route path="/origins" element={<OriginsPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/allies" element={<AlliesPage />} />
          <Route path="/encounters" element={<EncountersPage />} />
          <Route path="/rules" element={<RulesLookupPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
