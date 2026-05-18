import { useAutosave } from '../hooks/useAutosave';
import { useScriptDocument } from '../hooks/useScriptDocument';
import { createEmptyDocument } from '../utils/storage';
import { BlockTypeSelector } from './BlockTypeSelector';
import { ScriptEditor } from './ScriptEditor';
import { Toolbar } from './Toolbar';

export const EditorPage = () => {
  const { document, activeBlock, activeBlockId, setActiveBlockId, setTitle, updateBlock, setBlockType, setDocument } = useScriptDocument();
  const saveStatus = useAutosave(document, 1000);

  return (
    <div className="screenplay-shell">
      <Toolbar document={document} status={saveStatus} setTitle={setTitle} onNew={() => setDocument(createEmptyDocument())} />
      <div className="editor-controls">
        <BlockTypeSelector value={activeBlock?.type} onChange={(type) => activeBlock && setBlockType(activeBlock.id, type)} />
        <span>Escenas: {document.blocks.filter(b => b.type === 'scene_heading').length}</span>
      </div>
      <ScriptEditor document={document} activeBlockId={activeBlockId} setActiveBlockId={setActiveBlockId} updateBlock={updateBlock} setBlockType={setBlockType} setDocument={setDocument} />
    </div>
  );
};
