import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@core/store/hooks';
import { setActiveTab, setSelectedChapterId } from '@core/store/uiSlice';
import { ScriptEditor } from '@components/Editor/ScriptEditor';
import { ProjectTree } from '@components/Structure/ProjectTree';
import { CharacterList } from '@components/Characters/CharacterList';
import { LocationList } from '@components/Locations/LocationList';
import { Dashboard } from '@components/Dashboard/Dashboard';
import { ExportModal } from '@components/Export/ExportModal';
import './ui/styles/screenplay.css';
import './ui/styles/layout.css';
import './App.css';

function App() {
  const dispatch = useAppDispatch();
  const project = useAppSelector(state => state.project);
  const ui = useAppSelector(state => state.ui);
  const [selectedSceneId, setSelectedSceneId] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);

  const activeTab = ui.activeTab;

  const handleTabChange = (tab: typeof activeTab) => {
    dispatch(setActiveTab(tab));
  };

  // Get first scene to display
  const currentScene = React.useMemo(() => {
    if (!selectedSceneId && project.chapters.length > 0 && project.chapters[0].scenes.length > 0) {
      return project.chapters[0].scenes[0];
    }
    for (const chapter of project.chapters) {
      const scene = chapter.scenes.find(s => s.id === selectedSceneId);
      if (scene) return scene;
    }
    return null;
  }, [project, selectedSceneId]);

  return (
    <div className="app" id="app">
      {/* Header/Title Bar */}
      <header className="header">
        <div className="header-left">
          <h1 className="title">Cinescript</h1>
          <div className="project-info">
            <span className="project-title">{project.title}</span>
            {project.author && <span className="project-author">por {project.author}</span>}
          </div>
        </div>
        <div className="header-right">
          <button className="btn-small" title="Guardar proyecto (Ctrl+S)">Guardar</button>
          <button className="btn-small" onClick={() => setShowExportModal(true)}>📥 Exportar</button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="main-layout">
        {/* Sidebar Navigation */}
        <aside className={`sidebar ${!ui.sidebarExpanded ? 'collapsed' : ''}`}>
          <nav className="structure-tree">
            <div className="tree-header">Estructura</div>
            {project.chapters.map(chapter => (
              <div key={chapter.id} className="chapter-item">
                <div className="chapter-title">{chapter.title}</div>
                <ul className="scenes-list">
                  {chapter.scenes.map(scene => (
                    <li
                      key={scene.id}
                      className={`scene-item ${selectedSceneId === scene.id ? 'active' : ''}`}
                      onClick={() => setSelectedSceneId(scene.id)}
                    >
                      {scene.title}
                      <span className="scene-wordcount">({scene.metadata.wordCount} pal.)</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        {/* Content Area */}
        <div className="content-area">
          {/* Tab Bar */}
          <div className="tab-bar">
            <button
              className={`tab-button ${activeTab === 'editor' ? 'active' : ''}`}
              onClick={() => handleTabChange('editor')}
            >
              ✏️ Editor
            </button>
            <button
              className={`tab-button ${activeTab === 'structure' ? 'active' : ''}`}
              onClick={() => handleTabChange('structure')}
            >
              📋 Estructura
            </button>
            <button
              className={`tab-button ${activeTab === 'characters' ? 'active' : ''}`}
              onClick={() => handleTabChange('characters')}
            >
              👥 Personajes
            </button>
            <button
              className={`tab-button ${activeTab === 'locations' ? 'active' : ''}`}
              onClick={() => handleTabChange('locations')}
            >
              📍 Localizaciones
            </button>
            <button
              className={`tab-button ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => handleTabChange('dashboard')}
            >
              📊 Dashboard
            </button>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === 'editor' && currentScene ? (
              <ScriptEditor sceneId={currentScene.id} />
            ) : null}

            {activeTab === 'structure' && (
              <ProjectTree onSceneSelect={setSelectedSceneId} />
            )}

            {activeTab === 'characters' && (
              <CharacterList />
            )}

            {activeTab === 'locations' && (
              <LocationList />
            )}

            {activeTab === 'dashboard' && (
              <Dashboard />
            )}
          </div>
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <ExportModal onClose={() => setShowExportModal(false)} />
      )}
    </div>
  );
}

export default App;
