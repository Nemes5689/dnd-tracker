const BACKUP_FORMAT = 'dnd-tracker-full-backup';
const BACKUP_VERSION = 1;

export const BACKUP_STORAGE_KEYS = [
  'dnd-tracker-campaigns',
  'dnd-tracker-encounters',
  'dnd-tracker-custom-monsters',
  'dnd-tracker-allies',
  'dnd-tracker-settings',
  'dnd-tracker-projector-bus',
] as const;

export interface BackupFile {
  format: typeof BACKUP_FORMAT;
  version: typeof BACKUP_VERSION;
  exported_at: string;
  app: {
    name: string;
    storage: 'localStorage';
  };
  items: Record<string, string>;
}

function safeFilenamePart(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
}

export function collectBackup(): BackupFile {
  const items: Record<string, string> = {};

  for (const key of BACKUP_STORAGE_KEYS) {
    const value = localStorage.getItem(key);
    if (value !== null) {
      items[key] = value;
    }
  }

  // Future-proofing: include any later dnd-tracker localStorage key that was
  // not listed above, without accidentally exporting unrelated site data.
  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    if (!key || !key.startsWith('dnd-tracker-') || key in items) continue;
    const value = localStorage.getItem(key);
    if (value !== null) {
      items[key] = value;
    }
  }

  return {
    format: BACKUP_FORMAT,
    version: BACKUP_VERSION,
    exported_at: new Date().toISOString(),
    app: {
      name: 'D&D 2024 Combat Tracker',
      storage: 'localStorage',
    },
    items,
  };
}

export function downloadBackup(label?: string) {
  const backup = collectBackup();
  const json = JSON.stringify(backup, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const date = new Date().toISOString().slice(0, 10);
  const suffix = label ? `-${safeFilenamePart(label)}` : '';
  a.href = url;
  a.download = `dnd-tracker-backup-${date}${suffix}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function describeBackupSize() {
  const backup = collectBackup();
  const bytes = new Blob([JSON.stringify(backup)]).size;
  const keyCount = Object.keys(backup.items).length;
  return { bytes, keyCount };
}

export async function readBackupFile(file: File): Promise<BackupFile> {
  const text = await file.text();
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error('This is not a valid JSON backup file.');
  }

  if (!parsed || typeof parsed !== 'object') {
    throw new Error('The backup file is empty or invalid.');
  }

  const candidate = parsed as Partial<BackupFile>;
  if (candidate.format !== BACKUP_FORMAT || candidate.version !== BACKUP_VERSION) {
    throw new Error('This backup was not created by this D&D tracker version.');
  }

  if (!candidate.items || typeof candidate.items !== 'object') {
    throw new Error('The backup file does not contain saved app data.');
  }

  for (const [key, value] of Object.entries(candidate.items)) {
    if (!key.startsWith('dnd-tracker-')) {
      throw new Error(`Unsafe storage key in backup: ${key}`);
    }
    if (typeof value !== 'string') {
      throw new Error(`Invalid value for storage key: ${key}`);
    }
    // Make sure persisted Zustand JSON is syntactically valid before writing it.
    // Projector messages may also be JSON strings, so this validates all keys.
    try {
      JSON.parse(value);
    } catch {
      throw new Error(`Invalid JSON data under storage key: ${key}`);
    }
  }

  return candidate as BackupFile;
}

export function restoreBackup(backup: BackupFile) {
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    if (key?.startsWith('dnd-tracker-')) {
      keysToRemove.push(key);
    }
  }

  for (const key of keysToRemove) {
    localStorage.removeItem(key);
  }

  for (const [key, value] of Object.entries(backup.items)) {
    localStorage.setItem(key, value);
  }
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(2)} MB`;
}
