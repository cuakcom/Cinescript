import type { ScriptDocument } from '../types/script';

const STORAGE_KEY = 'script-document';

export const loadDocument = (): ScriptDocument | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const saveDocument = (doc: ScriptDocument) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(doc));
};

export const createEmptyDocument = (): ScriptDocument => ({
  id: `script-${crypto.randomUUID()}`,
  title: 'Mi guion',
  updatedAt: new Date().toISOString(),
  blocks: [{ id: crypto.randomUUID(), type: 'scene_heading', text: '' }],
});
