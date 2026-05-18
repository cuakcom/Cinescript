import React, { useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@core/store/hooks';
import { deleteCharacter, setSelectedCharacterId } from '@core/store/projectSlice';
import { CharacterForm } from './CharacterForm';
import './CharacterList.css';

export const CharacterList: React.FC = () => {
  const dispatch = useAppDispatch();
  const characters = useAppSelector(state => state.project.characters);
  const selectedCharacterId = useAppSelector(state => state.ui.selectedCharacterId);
  const [showForm, setShowForm] = useState(false);
  const [editingCharacterId, setEditingCharacterId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');

  const filteredCharacters = useMemo(() => {
    return characters.filter(char => {
      const matchesSearch = char.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        char.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = filterRole === 'all' || char.role === filterRole;
      return matchesSearch && matchesRole;
    });
  }, [characters, searchTerm, filterRole]);

  const selectedCharacter = characters.find(c => c.id === editingCharacterId);

  const handleDeleteCharacter = (characterId: string) => {
    if (window.confirm('¿Eliminar este personaje?')) {
      dispatch(deleteCharacter(characterId));
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCharacterId(null);
  };

  const getRoleLabel = (role: string) => {
    const roleMap: Record<string, string> = {
      protagonist: 'Protagonista',
      antagonist: 'Antagonista',
      supporting: 'Secundario',
      extra: 'Extra',
    };
    return roleMap[role] || role;
  };

  return (
    <div className="character-list-panel">
      {/* Header with Add Button */}
      <div className="panel-header">
        <h2>Personajes</h2>
        <button
          className="btn-add-character"
          onClick={() => {
            setEditingCharacterId(null);
            setShowForm(true);
          }}
        >
          + Nuevo Personaje
        </button>
      </div>

      {/* Search and Filter */}
      <div className="search-filter-section">
        <input
          type="text"
          placeholder="Buscar personaje..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <select
          value={filterRole}
          onChange={e => setFilterRole(e.target.value)}
          className="filter-select"
        >
          <option value="all">Todos los roles</option>
          <option value="protagonist">Protagonista</option>
          <option value="antagonist">Antagonista</option>
          <option value="supporting">Secundario</option>
          <option value="extra">Extra</option>
        </select>
      </div>

      {/* Characters List */}
      {filteredCharacters.length === 0 ? (
        <div className="empty-state">
          <p>No hay personajes creados</p>
          <small>Crea tu primer personaje para comenzar</small>
        </div>
      ) : (
        <div className="characters-grid">
          {filteredCharacters.map(character => (
            <div
              key={character.id}
              className={`character-card ${selectedCharacterId === character.id ? 'selected' : ''}`}
              onClick={() => dispatch(setSelectedCharacterId(character.id))}
            >
              <div className="character-header">
                <h3 className="character-name">{character.name}</h3>
                <span className="role-badge">{getRoleLabel(character.role)}</span>
              </div>

              {character.description && (
                <p className="character-description">{character.description}</p>
              )}

              <div className="character-details">
                {character.appearance.age && (
                  <span className="detail-item">
                    <strong>Edad:</strong> {character.appearance.age}
                  </span>
                )}
                {character.appearance.gender && (
                  <span className="detail-item">
                    <strong>Género:</strong> {character.appearance.gender}
                  </span>
                )}
              </div>

              {character.appearance.physicalTraits && (
                <div className="character-traits">
                  <strong>Rasgos:</strong>
                  <p>{character.appearance.physicalTraits}</p>
                </div>
              )}

              <div className="character-stats">
                <span className="stat">
                  <strong>{character.statistics.appearances}</strong> apariciones
                </span>
                <span className="stat">
                  <strong>{character.statistics.dialogueLines}</strong> líneas diálogo
                </span>
              </div>

              <div className="character-actions">
                <button
                  className="btn-action edit"
                  onClick={e => {
                    e.stopPropagation();
                    setEditingCharacterId(character.id);
                    setShowForm(true);
                  }}
                  title="Editar"
                >
                  ✎ Editar
                </button>
                <button
                  className="btn-action delete"
                  onClick={e => {
                    e.stopPropagation();
                    handleDeleteCharacter(character.id);
                  }}
                  title="Eliminar"
                >
                  ✕ Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Character Form Modal */}
      {showForm && (
        <CharacterForm
          character={selectedCharacter}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
};

export default CharacterList;
