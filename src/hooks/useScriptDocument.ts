import { useMemo, useState } from 'react';
import type { ScriptBlockType, ScriptDocument } from '../types/script';
import { detectBlockType, normalizeText } from '../utils/blockDetection';
import { createEmptyDocument, loadDocument } from '../utils/storage';

export const useScriptDocument = () => {
  const [document, setDocument] = useState<ScriptDocument>(() => loadDocument() ?? createEmptyDocument());
  const [activeBlockId, setActiveBlockId] = useState(document.blocks[0]?.id ?? '');

  const activeBlock = useMemo(() => document.blocks.find(b => b.id === activeBlockId), [activeBlockId, document.blocks]);

  const touch = (next: ScriptDocument) => setDocument({ ...next, updatedAt: new Date().toISOString() });

  const setTitle = (title: string) => touch({ ...document, title });

  const updateBlock = (id: string, text: string) => {
    const idx = document.blocks.findIndex(b => b.id === id);
    if (idx < 0) return;
    const current = document.blocks[idx];
    const prev = idx > 0 ? document.blocks[idx - 1] : undefined;
    const detected = !current.manuallySetType ? detectBlockType(text, prev) : null;
    const nextType = detected ?? current.type;
    const nextBlocks = [...document.blocks];
    nextBlocks[idx] = { ...current, text: normalizeText(nextType, text), type: nextType };
    touch({ ...document, blocks: nextBlocks });
  };

  const setBlockType = (id: string, type: ScriptBlockType) => {
    touch({ ...document, blocks: document.blocks.map(b => b.id === id ? { ...b, type, manuallySetType: true, text: normalizeText(type, b.text) } : b) });
  };

  return { document, activeBlockId, activeBlock, setActiveBlockId, setTitle, updateBlock, setBlockType, setDocument };
};
