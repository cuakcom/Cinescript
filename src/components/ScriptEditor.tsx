import React, { useRef } from 'react';
import type { ScriptBlockType, ScriptDocument } from '../types/script';
import { cycleBlockType, nextTypeOnEnter } from '../utils/blockDetection';
import { ScriptBlock } from './ScriptBlock';

export const ScriptEditor = ({ document, activeBlockId, setActiveBlockId, updateBlock, setBlockType, setDocument }: {
  document: ScriptDocument;
  activeBlockId: string;
  setActiveBlockId: (id: string) => void;
  updateBlock: (id: string, text: string) => void;
  setBlockType: (id: string, type: ScriptBlockType) => void;
  setDocument: (doc: ScriptDocument) => void;
}) => {
  const refs = useRef<Record<string, HTMLDivElement | null>>({});

  const insertAfter = (index: number, type: ScriptBlockType) => {
    const block = { id: crypto.randomUUID(), type, text: '' };
    const blocks = [...document.blocks];
    blocks.splice(index + 1, 0, block);
    setDocument({ ...document, blocks, updatedAt: new Date().toISOString() });
    setActiveBlockId(block.id);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, idx: number) => {
    const current = document.blocks[idx];
    if (!current) return;
    if (e.key === 'Enter') {
      e.preventDefault();
      insertAfter(idx, nextTypeOnEnter(current.type));
      return;
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      setBlockType(current.id, cycleBlockType(current.type, e.shiftKey ? -1 : 1));
      return;
    }
    if ((e.ctrlKey || e.metaKey) && /^\d$/.test(e.key)) {
      const map: Record<string, ScriptBlockType> = { '1':'scene_heading','2':'action','3':'character','4':'dialogue','5':'parenthetical','6':'transition','7':'shot','8':'note' };
      const type = map[e.key];
      if (type) {
        e.preventDefault();
        setBlockType(current.id, type);
      }
    }
    if (e.key === 'Backspace' && !current.text && idx > 0) {
      e.preventDefault();
      const blocks = document.blocks.filter(b => b.id !== current.id);
      setDocument({ ...document, blocks, updatedAt: new Date().toISOString() });
      setActiveBlockId(document.blocks[idx - 1].id);
    }
  };

  return <main className="editor-page">
    {document.blocks.map((b, idx) => (
      <ScriptBlock
        key={b.id}
        block={b}
        active={b.id === activeBlockId}
        onFocus={() => setActiveBlockId(b.id)}
        onChange={t => updateBlock(b.id, t)}
        onKeyDown={e => onKeyDown(e, idx)}
      />
    ))}
  </main>;
};
