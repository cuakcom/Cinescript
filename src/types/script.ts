export type ScriptBlockType =
  | 'scene_heading'
  | 'action'
  | 'character'
  | 'dialogue'
  | 'parenthetical'
  | 'transition'
  | 'shot'
  | 'note';

export interface ScriptBlock {
  id: string;
  type: ScriptBlockType;
  text: string;
  manuallySetType?: boolean;
}

export interface ScriptDocument {
  id: string;
  title: string;
  blocks: ScriptBlock[];
  updatedAt: string;
}

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';
