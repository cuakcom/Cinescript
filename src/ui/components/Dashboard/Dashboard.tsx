import React, { useMemo } from 'react';
import { useAppSelector } from '@core/store/hooks';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Dashboard.css';

export const Dashboard: React.FC = () => {
  const project = useAppSelector(state => state.project);

  const stats = useMemo(() => {
    let totalWords = 0;
    let totalLines = 0;
    let totalScenes = 0;
    let dialogueLines = 0;

    project.chapters.forEach(chapter => {
      chapter.scenes.forEach(scene => {
        totalWords += scene.metadata.wordCount;
        totalLines += scene.lines.length;
        totalScenes += 1;
        dialogueLines += scene.lines.filter(l => l.type === 'dialogue').length;
      });
    });

    const avgWordsPerScene = totalScenes > 0 ? Math.round(totalWords / totalScenes) : 0;
    const avgLinesPerScene = totalScenes > 0 ? Math.round(totalLines / totalScenes) : 0;
    const estimatedMinutes = Math.round(totalWords / 250); // ~250 words per minute

    return {
      totalWords,
      totalLines,
      totalScenes,
      totalCharacters: project.characters.length,
      totalLocations: project.locations.length,
      dialogueLines,
      avgWordsPerScene,
      avgLinesPerScene,
      estimatedMinutes,
    };
  }, [project]);

  const characterStats = useMemo(() => {
    return project.characters
      .map(char => ({
        name: char.name,
        role: char.role,
        appearances: char.statistics.appearances,
        dialogueLines: char.statistics.dialogueLines,
        relationships: char.relationships.length,
      }))
      .sort((a, b) => b.appearances - a.appearances)
      .slice(0, 10);
  }, [project.characters]);

  const sceneStats = useMemo(() => {
    return project.chapters
      .flatMap(ch =>
        ch.scenes.map(scene => ({
          title: scene.title,
          chapter: ch.title,
          words: scene.metadata.wordCount,
          lines: scene.lines.length,
          characters: scene.charactersInScene.length,
        }))
      )
      .sort((a, b) => b.words - a.words)
      .slice(0, 10);
  }, [project.chapters]);

  const sceneChartData = useMemo(() => {
    return project.chapters
      .flatMap(ch =>
        ch.scenes.map(scene => ({
          name: scene.title.substring(0, 20),
          words: scene.metadata.wordCount,
          chapter: ch.title,
        }))
      )
      .slice(0, 15);
  }, [project.chapters]);

  const characterRoleData = useMemo(() => {
    const roles: Record<string, number> = {
      protagonist: 0,
      antagonist: 0,
      supporting: 0,
      extra: 0,
    };

    project.characters.forEach(char => {
      roles[char.role]++;
    });

    return Object.entries(roles)
      .filter(([_, count]) => count > 0)
      .map(([role, count]) => ({
        name: role.charAt(0).toUpperCase() + role.slice(1),
        value: count,
        role,
      }));
  }, [project.characters]);

  const cumulativeWordsData = useMemo(() => {
    let cumulative = 0;
    return project.chapters
      .flatMap((ch, chIdx) =>
        ch.scenes.map((scene, scIdx) => {
          cumulative += scene.metadata.wordCount;
          return {
            name: `${chIdx + 1}.${scIdx + 1}`,
            cumulative,
            words: scene.metadata.wordCount,
          };
        })
      )
      .slice(0, 30);
  }, [project.chapters]);

  const roleColors: Record<string, string> = {
    protagonist: '#28a745',
    antagonist: '#d9534f',
    supporting: '#007bff',
    extra: '#999',
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      protagonist: '#28a745',
      antagonist: '#d9534f',
      supporting: '#007bff',
      extra: '#999',
    };
    return colors[role] || '#666';
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      protagonist: 'Protagonista',
      antagonist: 'Antagonista',
      supporting: 'Secundario',
      extra: 'Extra',
    };
    return labels[role] || role;
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h1>{project.title}</h1>
        {project.author && <p className="author">por {project.author}</p>}
      </div>

      {/* Key Stats */}
      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.totalWords.toLocaleString()}</div>
          <div className="stat-label">Palabras Totales</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.totalLines}</div>
          <div className="stat-label">Líneas</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.totalScenes}</div>
          <div className="stat-label">Escenas</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.estimatedMinutes}</div>
          <div className="stat-label">Min. Estimados</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.totalCharacters}</div>
          <div className="stat-label">Personajes</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.totalLocations}</div>
          <div className="stat-label">Localizaciones</div>
        </div>
      </section>

      {/* Averages */}
      <section className="averages-section">
        <h2>Promedios</h2>
        <div className="averages-grid">
          <div className="average-card">
            <span className="avg-label">Palabras por Escena</span>
            <span className="avg-value">{stats.avgWordsPerScene}</span>
          </div>
          <div className="average-card">
            <span className="avg-label">Líneas por Escena</span>
            <span className="avg-value">{stats.avgLinesPerScene}</span>
          </div>
          <div className="average-card">
            <span className="avg-label">Líneas de Diálogo</span>
            <span className="avg-value">{stats.dialogueLines}</span>
          </div>
        </div>
      </section>

      {/* Charts Section */}
      <section className="charts-section">
        <h2>Análisis Visual</h2>
        <div className="charts-grid">
          {sceneChartData.length > 0 && (
            <div className="chart-container">
              <h3>Palabras por Escena</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sceneChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="words" fill="#007bff" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {characterRoleData.length > 0 && (
            <div className="chart-container">
              <h3>Distribución por Rol</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={characterRoleData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {characterRoleData.map((entry) => (
                      <Cell key={`cell-${entry.role}`} fill={roleColors[entry.role]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {cumulativeWordsData.length > 0 && (
            <div className="chart-container chart-full-width">
              <h3>Palabras Acumuladas</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={cumulativeWordsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="cumulative" stroke="#28a745" name="Total Acumulado" strokeWidth={2} />
                  <Line type="monotone" dataKey="words" stroke="#ffc107" name="Palabras por Escena" strokeWidth={1} opacity={0.5} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </section>

      {/* Top Characters */}
      {characterStats.length > 0 && (
        <section className="characters-section">
          <h2>Personajes Principales</h2>
          <div className="characters-table">
            <div className="table-header">
              <div className="col-name">Personaje</div>
              <div className="col-role">Rol</div>
              <div className="col-appearances">Apariciones</div>
              <div className="col-dialogue">Diálogos</div>
              <div className="col-relations">Relaciones</div>
            </div>
            {characterStats.map((char, idx) => (
              <div key={idx} className="table-row">
                <div className="col-name">{char.name}</div>
                <div className="col-role">
                  <span
                    className="role-badge"
                    style={{ backgroundColor: getRoleColor(char.role) }}
                  >
                    {getRoleLabel(char.role)}
                  </span>
                </div>
                <div className="col-appearances">{char.appearances}</div>
                <div className="col-dialogue">{char.dialogueLines}</div>
                <div className="col-relations">{char.relationships}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Top Scenes */}
      {sceneStats.length > 0 && (
        <section className="scenes-section">
          <h2>Escenas Más Largas</h2>
          <div className="scenes-list">
            {sceneStats.map((scene, idx) => (
              <div key={idx} className="scene-row">
                <div className="scene-info">
                  <h4>{scene.title}</h4>
                  <p>{scene.chapter}</p>
                </div>
                <div className="scene-stats">
                  <span className="stat-item">
                    <strong>{scene.words}</strong> palabras
                  </span>
                  <span className="stat-item">
                    <strong>{scene.lines}</strong> líneas
                  </span>
                  <span className="stat-item">
                    <strong>{scene.characters}</strong> personajes
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Project Info */}
      <section className="project-info">
        <h2>Información del Proyecto</h2>
        <div className="info-grid">
          <div className="info-item">
            <strong>Formato:</strong>
            <span>{project.format === 'screenplay' ? 'Guión' : 'Novela'}</span>
          </div>
          <div className="info-item">
            <strong>Capítulos:</strong>
            <span>{project.chapters.length}</span>
          </div>
          <div className="info-item">
            <strong>Creado:</strong>
            <span>{new Date(project.metadata.createdAt).toLocaleDateString('es-ES')}</span>
          </div>
          <div className="info-item">
            <strong>Última modificación:</strong>
            <span>{new Date(project.metadata.lastModified).toLocaleDateString('es-ES')}</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
