import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DND_2024_CLASSES, type ClassFeatureInfo, type SubclassInfo } from '@/data/classData';

export interface CustomSubclassFeature extends ClassFeatureInfo {}

export interface CustomSubclassInfo extends SubclassInfo {
  id: string;
  class_id: string;
  name: string;
  features: CustomSubclassFeature[];
  is_custom: true;
  created_at: number;
  updated_at: number;
}

interface ClassHomebrewStore {
  custom_subclasses: CustomSubclassInfo[];
  addSubclass: (input: { class_id: string; name: string; features: CustomSubclassFeature[] }) => string;
  updateSubclass: (id: string, patch: Partial<Omit<CustomSubclassInfo, 'id' | 'is_custom' | 'created_at'>>) => void;
  deleteSubclass: (id: string) => void;
}

export function slugifySubclassName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
}

export function getSubclassFeatureLevels(classId: string): number[] {
  const classInfo = DND_2024_CLASSES.find((entry) => entry.id === classId);
  if (!classInfo) return [3, 6, 10, 14];
  const levels = classInfo.progression
    .filter((row) => row.features.some((feature) => /subclass/i.test(feature)))
    .map((row) => row.level);
  return Array.from(new Set(levels)).sort((a, b) => a - b);
}

function normalizeFeatures(classId: string, features: CustomSubclassFeature[]): CustomSubclassFeature[] {
  const allowed = new Set(getSubclassFeatureLevels(classId));
  return (Array.isArray(features) ? features : [])
    .filter((feature) => feature && typeof feature.name === 'string')
    .map((feature) => ({
      level: allowed.has(Number(feature.level)) ? Number(feature.level) : getSubclassFeatureLevels(classId)[0] ?? 3,
      name: feature.name.trim(),
      description: typeof feature.description === 'string' ? feature.description : '',
    }))
    .filter((feature) => feature.name.length > 0)
    .sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));
}

export function readPersistedCustomSubclasses(): CustomSubclassInfo[] {
  if (typeof localStorage === 'undefined') return [];
  try {
    const raw = localStorage.getItem('dnd-tracker-class-homebrew');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    const items = parsed?.state?.custom_subclasses;
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}

export function getCombinedSubclasses(classId: string, customSubclasses: CustomSubclassInfo[] = readPersistedCustomSubclasses()): SubclassInfo[] {
  const classInfo = DND_2024_CLASSES.find((entry) => entry.id === classId);
  const builtIn = classInfo?.subclasses ?? [];
  const custom = customSubclasses
    .filter((sub) => sub.class_id === classId)
    .map((sub) => ({ id: sub.id, name: `${sub.name} (custom)`, features: sub.features }));
  return [...builtIn, ...custom];
}

export function getCombinedSubclassInfo(
  classId?: string,
  subclassId?: string,
  customSubclasses: CustomSubclassInfo[] = readPersistedCustomSubclasses()
): SubclassInfo | undefined {
  if (!classId || !subclassId) return undefined;
  return getCombinedSubclasses(classId, customSubclasses).find((entry) => entry.id === subclassId);
}

export const useClassHomebrewStore = create<ClassHomebrewStore>()(
  persist(
    (set) => ({
      custom_subclasses: [],
      addSubclass: (input) => {
        const idBase = slugifySubclassName(input.name) || 'custom-subclass';
        const id = `custom-${input.class_id}-${idBase}-${crypto.randomUUID().slice(0, 6)}`;
        const now = Date.now();
        const subclass: CustomSubclassInfo = {
          id,
          class_id: input.class_id,
          name: input.name.trim() || 'Unnamed subclass',
          features: normalizeFeatures(input.class_id, input.features),
          is_custom: true,
          created_at: now,
          updated_at: now,
        };
        set((state) => ({ custom_subclasses: [...state.custom_subclasses, subclass] }));
        return id;
      },
      updateSubclass: (id, patch) =>
        set((state) => ({
          custom_subclasses: state.custom_subclasses.map((sub) => {
            if (sub.id !== id) return sub;
            const class_id = patch.class_id ?? sub.class_id;
            return {
              ...sub,
              ...patch,
              class_id,
              name: (patch.name ?? sub.name).trim() || 'Unnamed subclass',
              features: normalizeFeatures(class_id, patch.features ?? sub.features),
              updated_at: Date.now(),
              is_custom: true,
            };
          }),
        })),
      deleteSubclass: (id) =>
        set((state) => ({ custom_subclasses: state.custom_subclasses.filter((sub) => sub.id !== id) })),
    }),
    {
      name: 'dnd-tracker-class-homebrew',
      version: 1,
      merge: (persistedState: any, currentState) => ({
        ...currentState,
        ...persistedState,
        custom_subclasses: Array.isArray(persistedState?.custom_subclasses)
          ? persistedState.custom_subclasses
          : Array.isArray(persistedState?.state?.custom_subclasses)
            ? persistedState.state.custom_subclasses
            : currentState.custom_subclasses,
      }),
    }
  )
);
