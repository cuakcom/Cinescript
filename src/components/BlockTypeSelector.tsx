import type { ScriptBlockType } from '../types/script';

const options: ScriptBlockType[] = ['scene_heading','action','character','dialogue','parenthetical','transition','shot','note'];

export const BlockTypeSelector = ({ value, onChange }: { value?: ScriptBlockType; onChange: (type: ScriptBlockType) => void }) => (
  <select value={value} onChange={e => onChange(e.target.value as ScriptBlockType)} className="block-type-selector">
    {options.map(o => <option key={o} value={o}>{o}</option>)}
  </select>
);
