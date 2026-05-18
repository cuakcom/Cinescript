import type { ScriptBlock, ScriptBlockType } from '../types/script';

const SCENE_RE = /^(INT\.|EXT\.|INT\/EXT\.|I\/E\.)/i;
const TRANSITION_RE = /(TO:|CORTE A:|CUT TO:|FADE OUT:|FADE IN:)$/i;

export const BLOCK_TYPE_CYCLE: ScriptBlockType[] = [
  'action','character','dialogue','parenthetical','transition','scene_heading','shot','note'
];

export const nextTypeOnEnter = (type: ScriptBlockType): ScriptBlockType => {
  switch (type) {
    case 'scene_heading': return 'action';
    case 'character': return 'dialogue';
    case 'dialogue': return 'dialogue';
    case 'parenthetical': return 'dialogue';
    case 'transition': return 'scene_heading';
    default: return 'action';
  }
};

export const normalizeText = (type: ScriptBlockType, text: string): string => {
  if (['scene_heading','character','transition','shot'].includes(type)) return text.toUpperCase();
  if (type === 'parenthetical' && text && !text.startsWith('(')) return `(${text}`;
  return text;
};

export const detectBlockType = (text: string, previous?: ScriptBlock): ScriptBlockType | null => {
  const trimmed = text.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith('(')) return 'parenthetical';
  if (SCENE_RE.test(trimmed)) return 'scene_heading';
  if (TRANSITION_RE.test(trimmed)) return 'transition';
  const isUpper = trimmed === trimmed.toUpperCase();
  const words = trimmed.split(/\s+/).length;
  if (isUpper && words <= 4 && (previous?.type === 'action' || previous?.type === 'scene_heading')) return 'character';
  return null;
};

export const cycleBlockType = (current: ScriptBlockType, direction: 1 | -1): ScriptBlockType => {
  const idx = BLOCK_TYPE_CYCLE.indexOf(current);
  const next = (idx + direction + BLOCK_TYPE_CYCLE.length) % BLOCK_TYPE_CYCLE.length;
  return BLOCK_TYPE_CYCLE[next];
};
