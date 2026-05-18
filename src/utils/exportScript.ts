import type { ScriptDocument } from '../types/script';

const download = (filename: string, content: string, mime: string) => {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

export const exportAsJson = (doc: ScriptDocument) => {
  download(`${doc.title || 'guion'}.json`, JSON.stringify(doc, null, 2), 'application/json');
};

export const exportAsTxt = (doc: ScriptDocument) => {
  const txt = doc.blocks.map(b => b.text).join('\n\n');
  download(`${doc.title || 'guion'}.txt`, txt, 'text/plain');
};
