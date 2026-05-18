import type { ScriptDocument } from '../types/script';
import { exportAsJson, exportAsTxt } from '../utils/exportScript';
import { SaveStatus } from './SaveStatus';

export const Toolbar = ({ document, setTitle, onNew, status }: { document: ScriptDocument; setTitle: (v: string)=>void; onNew: ()=>void; status: any }) => (
  <header className="toolbar">
    <input className="title-input" value={document.title} onChange={e => setTitle(e.target.value)} />
    <SaveStatus status={status} />
    <button onClick={onNew}>Nuevo</button>
    <button onClick={() => exportAsTxt(document)}>Exportar TXT</button>
    <button onClick={() => exportAsJson(document)}>Exportar JSON</button>
  </header>
);
