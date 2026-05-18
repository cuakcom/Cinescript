import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@core/store/hooks';
import { updateCharacter } from '@core/store/projectSlice';
import type { Character, Relationship, RelationshipType } from '@core/models/types';
import './CharacterRelationships.css';

interface CharacterRelationshipsProps {
  character: Character;
  allCharacters: Character[];
  onClose: () => void;
}

export const CharacterRelationships: React.FC<CharacterRelationshipsProps> = ({
  character,
  allCharacters,
  onClose,
}) => {
  const dispatch = useAppDispatch();
  const [newRelation, setNewRelation] = useState({
    targetCharacterId: '',
    type: 'ally' as RelationshipType,
    description: '',
    tension: 50,
  });

  const otherCharacters = allCharacters.filter(c => c.id !== character.id);

  const handleAddRelationship = () => {
    if (!newRelation.targetCharacterId.trim()) {
      alert('Selecciona un personaje');
      return;
    }

    const existingIndex = character.relationships.findIndex(
      r => r.targetCharacterId === newRelation.targetCharacterId
    );

    let updatedRelationships = [...character.relationships];
    if (existingIndex >= 0) {
      updatedRelationships[existingIndex] = newRelation;
    } else {
      updatedRelationships.push(newRelation);
    }

    dispatch(updateCharacter({ ...character, relationships: updatedRelationships }));

    setNewRelation({
      targetCharacterId: '',
      type: 'ally',
      description: '',
      tension: 50,
    });
  };

  const handleDeleteRelationship = (targetCharacterId: string) => {
    const updatedRelationships = character.relationships.filter(
      r => r.targetCharacterId !== targetCharacterId
    );
    dispatch(updateCharacter({ ...character, relationships: updatedRelationships }));
  };

  const getRelationshipLabel = (type: RelationshipType) => {
    const labels: Record<RelationshipType, string> = {
      parent: 'Padre/Madre',
      child: 'Hijo/Hija',
      sibling: 'Hermano/Hermana',
      ally: 'Aliado',
      enemy: 'Enemigo',
      romantic: 'Romántico',
      mentor: 'Mentor',
      other: 'Otro',
    };
    return labels[type];
  };

  const getTargetCharacterName = (id: string) => {
    return allCharacters.find(c => c.id === id)?.name || 'Desconocido';
  };

  return (
    <div className="relationships-modal-overlay">
      <div className="relationships-modal">
        <div className="modal-header">
          <h2>Relaciones de {character.name}</h2>
          <button className="btn-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-content">
          {/* Existing Relationships */}
          <section className="relationships-section">
            <h3>Relaciones Actuales</h3>
            {character.relationships.length === 0 ? (
              <p className="empty-message">Sin relaciones definidas</p>
            ) : (
              <div className="relationships-list">
                {character.relationships.map(rel => (
                  <div key={rel.targetCharacterId} className="relationship-item">
                    <div className="relationship-info">
                      <strong>{getTargetCharacterName(rel.targetCharacterId)}</strong>
                      <span className="rel-type">{getRelationshipLabel(rel.type)}</span>
                      {rel.description && <p className="rel-description">{rel.description}</p>}
                      <div className="tension-meter">
                        <label>Tensión: {rel.tension}%</label>
                        <div className="tension-bar">
                          <div
                            className="tension-fill"
                            style={{ width: `${rel.tension}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteRelationship(rel.targetCharacterId)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Add New Relationship */}
          <section className="add-relationship-section">
            <h3>Agregar Nueva Relación</h3>
            <div className="form-group">
              <label>Personaje</label>
              <select
                value={newRelation.targetCharacterId}
                onChange={e =>
                  setNewRelation({ ...newRelation, targetCharacterId: e.target.value })
                }
              >
                <option value="">Seleccionar personaje...</option>
                {otherCharacters.map(char => (
                  <option key={char.id} value={char.id}>
                    {char.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Tipo de Relación</label>
              <select
                value={newRelation.type}
                onChange={e =>
                  setNewRelation({ ...newRelation, type: e.target.value as RelationshipType })
                }
              >
                <option value="ally">Aliado</option>
                <option value="enemy">Enemigo</option>
                <option value="romantic">Romántico</option>
                <option value="mentor">Mentor</option>
                <option value="parent">Padre/Madre</option>
                <option value="child">Hijo/Hija</option>
                <option value="sibling">Hermano/Hermana</option>
                <option value="other">Otro</option>
              </select>
            </div>

            <div className="form-group">
              <label>Tensión: {newRelation.tension}%</label>
              <input
                type="range"
                min="0"
                max="100"
                value={newRelation.tension}
                onChange={e =>
                  setNewRelation({ ...newRelation, tension: parseInt(e.target.value) })
                }
              />
            </div>

            <div className="form-group">
              <label>Descripción</label>
              <textarea
                value={newRelation.description}
                onChange={e =>
                  setNewRelation({ ...newRelation, description: e.target.value })
                }
                placeholder="Describe la naturaleza de la relación..."
                rows={3}
              />
            </div>

            <button className="btn-add-rel" onClick={handleAddRelationship}>
              Agregar Relación
            </button>
          </section>
        </div>

        <div className="modal-actions">
          <button className="btn-close-modal" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CharacterRelationships;
