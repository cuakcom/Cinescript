import React, { useState } from 'react';
import { useAppDispatch } from '@core/store/hooks';
import { addCharacter, updateCharacter } from '@core/store/projectSlice';
import type { Character, CharacterRole } from '@core/models/types';
import './CharacterForm.css';

interface CharacterFormProps {
  character?: Character;
  onClose: () => void;
}

export const CharacterForm: React.FC<CharacterFormProps> = ({ character, onClose }) => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    name: character?.name || '',
    description: character?.description || '',
    role: (character?.role || 'supporting') as CharacterRole,
    age: character?.appearance.age || '',
    gender: character?.appearance.gender || '',
    physicalTraits: character?.appearance.physicalTraits || '',
    voice: character?.appearance.voice || '',
    backstory: character?.backstory || '',
  });

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('El nombre del personaje es requerido');
      return;
    }

    const charData = {
      name: formData.name,
      description: formData.description,
      role: formData.role,
      appearance: {
        age: formData.age ? parseInt(formData.age) : undefined,
        gender: formData.gender,
        physicalTraits: formData.physicalTraits,
        voice: formData.voice,
      },
      backstory: formData.backstory,
      relationships: character?.relationships || [],
    };

    if (character) {
      dispatch(updateCharacter({ ...character, ...charData }));
    } else {
      dispatch(addCharacter(charData));
    }

    onClose();
  };

  return (
    <div className="character-form-overlay">
      <div className="character-form-modal">
        <div className="form-header">
          <h2>{character ? 'Editar Personaje' : 'Nuevo Personaje'}</h2>
          <button className="btn-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="form-content">
          {/* Basic Info */}
          <section className="form-section">
            <h3>Información Básica</h3>

            <div className="form-group">
              <label>Nombre *</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => handleChange('name', e.target.value)}
                placeholder="Ej: Juan García"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Rol</label>
                <select
                  value={formData.role}
                  onChange={e => handleChange('role', e.target.value)}
                >
                  <option value="protagonist">Protagonista</option>
                  <option value="antagonist">Antagonista</option>
                  <option value="supporting">Secundario</option>
                  <option value="extra">Extra</option>
                </select>
              </div>

              <div className="form-group">
                <label>Descripción Corta</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={e => handleChange('description', e.target.value)}
                  placeholder="Ej: Ingeniero de 30 años"
                />
              </div>
            </div>
          </section>

          {/* Physical Appearance */}
          <section className="form-section">
            <h3>Apariencia Física</h3>

            <div className="form-row">
              <div className="form-group">
                <label>Edad</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={e => handleChange('age', e.target.value)}
                  placeholder="Ej: 30"
                  min="1"
                  max="150"
                />
              </div>

              <div className="form-group">
                <label>Género</label>
                <input
                  type="text"
                  value={formData.gender}
                  onChange={e => handleChange('gender', e.target.value)}
                  placeholder="Ej: Masculino"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Rasgos Físicos</label>
              <textarea
                value={formData.physicalTraits}
                onChange={e => handleChange('physicalTraits', e.target.value)}
                placeholder="Ej: Alto, cabello oscuro, cicatriz en la mejilla izquierda"
                rows={3}
              />
            </div>

            <div className="form-group">
              <label>Voz / Forma de Hablar</label>
              <textarea
                value={formData.voice}
                onChange={e => handleChange('voice', e.target.value)}
                placeholder="Ej: Voz grave, acento madrileño, habla lentamente"
                rows={2}
              />
            </div>
          </section>

          {/* Backstory */}
          <section className="form-section">
            <h3>Trasfondo</h3>
            <div className="form-group">
              <label>Historia del Personaje</label>
              <textarea
                value={formData.backstory}
                onChange={e => handleChange('backstory', e.target.value)}
                placeholder="Cuéntanos la historia de este personaje..."
                rows={5}
              />
            </div>
          </section>

          {/* Form Actions */}
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-submit">
              {character ? 'Guardar Cambios' : 'Crear Personaje'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CharacterForm;
