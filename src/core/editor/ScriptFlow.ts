import type { LineType } from '@models/types';

const screenplayFlow: LineType[] = ['slugline', 'action', 'character', 'dialogue', 'parenthetical'];
const novelFlow: LineType[] = ['action'];

export function getNextType(
  currentType: LineType,
  mode: 'screenplay' | 'novel',
  key: 'Enter' | 'Tab'
): LineType {
  const flow = mode === 'screenplay' ? screenplayFlow : novelFlow;

  if (mode === 'novel') {
    return 'action';
  }

  if (key === 'Enter') {
    if (currentType === 'character') {
      return 'dialogue';
    }
    if (currentType === 'dialogue') {
      return 'action';
    }
    if (currentType === 'parenthetical') {
      return 'dialogue';
    }
    const currentIndex = flow.indexOf(currentType);
    return flow[(currentIndex + 1) % flow.length];
  }

  if (key === 'Tab') {
    if (currentType === 'action') {
      return 'character';
    }
    if (currentType === 'dialogue') {
      return 'parenthetical';
    }
    if (currentType === 'parenthetical') {
      return 'dialogue';
    }
    return 'action';
  }

  return currentType;
}

export function getLineClass(type: LineType): string {
  const classMap: Record<LineType, string> = {
    slugline: 'line-slugline',
    action: 'line-action',
    character: 'line-character',
    dialogue: 'line-dialogue',
    parenthetical: 'line-parenthetical',
  };
  return classMap[type];
}

export function getLineLabel(type: LineType): string {
  const labelMap: Record<LineType, string> = {
    slugline: 'Encabezado',
    action: 'Acción',
    character: 'Personaje',
    dialogue: 'Diálogo',
    parenthetical: 'Acotación',
  };
  return labelMap[type];
}
