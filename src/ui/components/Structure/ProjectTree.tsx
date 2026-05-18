import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@core/store/hooks';
import {
  addChapter,
  addScene,
  updateChapter,
  updateScene,
  deleteChapter,
  deleteScene,
} from '@core/store/projectSlice';
import { setSelectedChapterId } from '@core/store/uiSlice';
import './ProjectTree.css';

interface ProjectTreeProps {
  onSceneSelect: (sceneId: string) => void;
}

export const ProjectTree: React.FC<ProjectTreeProps> = ({ onSceneSelect }) => {
  const dispatch = useAppDispatch();
  const project = useAppSelector(state => state.project);
  const selectedChapterId = useAppSelector(state => state.ui.selectedChapterId);
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());
  const [editingChapterId, setEditingChapterId] = useState<string | null>(null);
  const [editingSceneId, setEditingSceneId] = useState<string | null>(null);
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [newSceneTitle, setNewSceneTitle] = useState('');
  const [editChapterTitle, setEditChapterTitle] = useState('');
  const [editSceneTitle, setEditSceneTitle] = useState('');

  const toggleChapter = (chapterId: string) => {
    const newExpanded = new Set(expandedChapters);
    if (newExpanded.has(chapterId)) {
      newExpanded.delete(chapterId);
    } else {
      newExpanded.add(chapterId);
    }
    setExpandedChapters(newExpanded);
  };

  const handleAddChapter = () => {
    if (newChapterTitle.trim()) {
      dispatch(addChapter(newChapterTitle));
      setNewChapterTitle('');
    }
  };

  const handleAddScene = (chapterId: string) => {
    if (newSceneTitle.trim()) {
      dispatch(addScene({ chapterId, title: newSceneTitle }));
      setNewSceneTitle('');
    }
  };

  const handleUpdateChapter = (chapterId: string) => {
    const chapter = project.chapters.find(c => c.id === chapterId);
    if (chapter && editChapterTitle.trim()) {
      dispatch(updateChapter({ ...chapter, title: editChapterTitle }));
      setEditingChapterId(null);
      setEditChapterTitle('');
    }
  };

  const handleUpdateScene = (chapterId: string, sceneId: string) => {
    const chapter = project.chapters.find(c => c.id === chapterId);
    const scene = chapter?.scenes.find(s => s.id === sceneId);
    if (scene && editSceneTitle.trim()) {
      dispatch(updateScene({ ...scene, title: editSceneTitle }));
      setEditingSceneId(null);
      setEditSceneTitle('');
    }
  };

  const handleDeleteChapter = (chapterId: string) => {
    if (window.confirm('¿Eliminar este capítulo y todas sus escenas?')) {
      dispatch(deleteChapter(chapterId));
    }
  };

  const handleDeleteScene = (chapterId: string, sceneId: string) => {
    if (window.confirm('¿Eliminar esta escena?')) {
      dispatch(deleteScene({ chapterId, sceneId }));
    }
  };

  return (
    <div className="project-tree">
      {/* Add Chapter Section */}
      <div className="add-chapter-section">
        <input
          type="text"
          placeholder="Nuevo capítulo..."
          value={newChapterTitle}
          onChange={e => setNewChapterTitle(e.target.value)}
          onKeyPress={e => {
            if (e.key === 'Enter') {
              handleAddChapter();
            }
          }}
          className="input-field"
        />
        <button onClick={handleAddChapter} className="btn-add">
          + Capítulo
        </button>
      </div>

      {/* Chapters List */}
      <div className="chapters-list">
        {project.chapters.map(chapter => (
          <div key={chapter.id} className="chapter-item">
            <div className="chapter-header">
              <button
                className="toggle-btn"
                onClick={() => toggleChapter(chapter.id)}
              >
                {expandedChapters.has(chapter.id) ? '▼' : '▶'}
              </button>

              {editingChapterId === chapter.id ? (
                <input
                  type="text"
                  value={editChapterTitle}
                  onChange={e => setEditChapterTitle(e.target.value)}
                  onBlur={() => handleUpdateChapter(chapter.id)}
                  onKeyPress={e => {
                    if (e.key === 'Enter') {
                      handleUpdateChapter(chapter.id);
                    }
                  }}
                  autoFocus
                  className="input-edit"
                />
              ) : (
                <div className="chapter-title-container">
                  <span
                    className="chapter-title"
                    onClick={() => {
                      dispatch(setSelectedChapterId(chapter.id));
                      toggleChapter(chapter.id);
                    }}
                  >
                    {chapter.title}
                  </span>
                  <span className="chapter-stats">
                    {chapter.scenes.length} escena{chapter.scenes.length !== 1 ? 's' : ''}
                  </span>
                </div>
              )}

              <div className="chapter-actions">
                <button
                  className="btn-icon"
                  title="Editar"
                  onClick={() => {
                    setEditingChapterId(chapter.id);
                    setEditChapterTitle(chapter.title);
                  }}
                >
                  ✎
                </button>
                <button
                  className="btn-icon"
                  title="Eliminar"
                  onClick={() => handleDeleteChapter(chapter.id)}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Scenes List */}
            {expandedChapters.has(chapter.id) && (
              <div className="scenes-container">
                <div className="add-scene-section">
                  <input
                    type="text"
                    placeholder="Nueva escena..."
                    value={newSceneTitle}
                    onChange={e => setNewSceneTitle(e.target.value)}
                    onKeyPress={e => {
                      if (e.key === 'Enter') {
                        handleAddScene(chapter.id);
                      }
                    }}
                    className="input-field-small"
                  />
                  <button
                    onClick={() => handleAddScene(chapter.id)}
                    className="btn-add-small"
                  >
                    + Escena
                  </button>
                </div>

                <ul className="scenes-list">
                  {chapter.scenes.map(scene => (
                    <li
                      key={scene.id}
                      className="scene-item"
                      onClick={() => onSceneSelect(scene.id)}
                    >
                      {editingSceneId === scene.id ? (
                        <input
                          type="text"
                          value={editSceneTitle}
                          onChange={e => setEditSceneTitle(e.target.value)}
                          onBlur={() => handleUpdateScene(chapter.id, scene.id)}
                          onKeyPress={e => {
                            if (e.key === 'Enter') {
                              handleUpdateScene(chapter.id, scene.id);
                            }
                          }}
                          autoFocus
                          className="input-edit"
                          onClick={e => e.stopPropagation()}
                        />
                      ) : (
                        <div className="scene-info">
                          <span className="scene-title">{scene.title}</span>
                          <span className="scene-meta">
                            {scene.metadata.wordCount} pal. • {scene.lines.length} líneas
                          </span>
                        </div>
                      )}

                      <div className="scene-actions" onClick={e => e.stopPropagation()}>
                        <button
                          className="btn-icon"
                          title="Editar"
                          onClick={() => {
                            setEditingSceneId(scene.id);
                            setEditSceneTitle(scene.title);
                          }}
                        >
                          ✎
                        </button>
                        <button
                          className="btn-icon"
                          title="Eliminar"
                          onClick={() => handleDeleteScene(chapter.id, scene.id)}
                        >
                          ✕
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectTree;
