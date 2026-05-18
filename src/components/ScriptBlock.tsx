import type { ScriptBlock as Block } from '../types/script';

export const ScriptBlock = ({ block, active, onFocus, onChange, onKeyDown }: {
  block: Block;
  active: boolean;
  onFocus: () => void;
  onChange: (text: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
}) => (
  <div className={`script-block ${block.type} ${active ? 'active' : ''}`}>
    <span className="block-tag">{block.type}</span>
    <div
      contentEditable
      suppressContentEditableWarning
      className="block-input"
      onFocus={onFocus}
      onInput={e => onChange((e.target as HTMLDivElement).innerText)}
      onKeyDown={onKeyDown}
    >
      {block.text}
    </div>
  </div>
);
