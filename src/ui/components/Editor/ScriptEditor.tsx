import React, { useRef, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { updateSceneLines } from '@store/projectSlice';
import { getNextType, getLineClass, getLineLabel } from '@core/editor/ScriptFlow';
import type { Line, LineType } from '@models/types';
import './ScriptEditor.css';

interface ScriptEditorProps {
  sceneId: string;
}

export const ScriptEditor: React.FC<ScriptEditorProps> = ({ sceneId }) => {
  const dispatch = useAppDispatch();
  const editorRef = useRef<HTMLDivElement>(null);
  const [currentType, setCurrentType] = useState<LineType>('slugline');

  const project = useAppSelector(state => state.project);
  const format = useAppSelector(state => state.project.format);

  const scene = React.useMemo(() => {
    for (const chapter of project.chapters) {
      const foundScene = chapter.scenes.find(s => s.id === sceneId);
      if (foundScene) return foundScene;
    }
    return null;
  }, [project, sceneId]);

  useEffect(() => {
    if (!editorRef.current) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const sel = window.getSelection();
      if (!sel || !sel.rangeCount) return;

      const anchorNode = sel.anchorNode;
      const parentEl =
        anchorNode?.nodeType === Node.TEXT_NODE ? anchorNode.parentElement : (anchorNode as Element);
      const line = parentEl?.closest('.line') as HTMLElement;

      if (!line) return;

      const lineType = (line.dataset.type as LineType) || 'action';

      if (e.key === 'Enter') {
        e.preventDefault();
        const nextType = getNextType(lineType, format, 'Enter');
        createNewLine(nextType);
      } else if (e.key === 'Tab') {
        e.preventDefault();
        const nextType = getNextType(lineType, format, 'Tab');
        line.dataset.type = nextType;
        line.className = `line ${getLineClass(nextType)}`;
        setCurrentType(nextType);
      }
    };

    editorRef.current.addEventListener('keydown', handleKeyDown);
    return () => editorRef.current?.removeEventListener('keydown', handleKeyDown);
  }, [format]);

  const createNewLine = (type: LineType) => {
    if (!scene) return;

    const newLine: Line = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      content: '',
    };

    const updatedLines = [...scene.lines, newLine];
    dispatch(updateSceneLines({ sceneId, lines: updatedLines }));
    setCurrentType(type);

    setTimeout(() => {
      const lines = editorRef.current?.querySelectorAll('.line');
      if (lines && lines.length > 0) {
        const lastLine = lines[lines.length - 1] as HTMLElement;
        lastLine.focus();
        const range = document.createRange();
        range.selectNodeContents(lastLine);
        range.collapse(false);
        const sel = window.getSelection();
        if (sel) {
          sel.removeAllRanges();
          sel.addRange(range);
        }
      }
    }, 0);
  };

  const handleLineUpdate = (lineId: string, newContent: string) => {
    if (!scene) return;

    const updatedLines = scene.lines.map(line =>
      line.id === lineId ? { ...line, content: newContent } : line
    );

    dispatch(updateSceneLines({ sceneId, lines: updatedLines }));
  };

  const handleLineBlur = (lineId: string, lineEl: HTMLElement) => {
    const content = lineEl.textContent || '';
    handleLineUpdate(lineId, content);
  };

  if (!scene) {
    return <div className="script-editor empty">No scene selected</div>;
  }

  return (
    <div ref={editorRef} className="screenplay-editor" data-testid="script-editor">
      {scene.lines.map(line => (
        <div
          key={line.id}
          className={`line ${getLineClass(line.type)}`}
          data-type={line.type}
          data-line-id={line.id}
          contentEditable
          suppressContentEditableWarning
          onBlur={e => handleLineBlur(line.id, e.currentTarget)}
          data-placeholder={getLineLabel(line.type)}
        >
          {line.content}
        </div>
      ))}
    </div>
  );
};

export default ScriptEditor;
