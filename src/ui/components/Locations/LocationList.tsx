import React, { useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@core/store/hooks';
import { addLocation, updateLocation, deleteLocation } from '@core/store/projectSlice';
import type { Location, LocationType } from '@core/models/types';
import './LocationList.css';

export const LocationList: React.FC = () => {
  const dispatch = useAppDispatch();
  const locations = useAppSelector(state => state.project.locations);
  const [showForm, setShowForm] = useState(false);
  const [editingLocationId, setEditingLocationId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'interior' as LocationType,
    time: 'day' as 'day' | 'night' | 'dusk' | 'dawn',
    weather: '',
  });

  const filteredLocations = useMemo(() => {
    return locations.filter(loc =>
      loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loc.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [locations, searchTerm]);

  const editingLocation = locations.find(l => l.id === editingLocationId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('El nombre de la localización es requerido');
      return;
    }

    if (editingLocationId && editingLocation) {
      dispatch(updateLocation({
        ...editingLocation,
        name: formData.name,
        description: formData.description,
        type: formData.type,
        appearance: {
          time: formData.time as any,
          weather: formData.weather,
        },
      }));
    } else {
      dispatch(addLocation({
        name: formData.name,
        description: formData.description,
        type: formData.type,
        appearance: {
          time: formData.time as any,
          weather: formData.weather,
        },
      }));
    }

    setFormData({
      name: '',
      description: '',
      type: 'interior',
      time: 'day',
      weather: '',
    });
    setEditingLocationId(null);
    setShowForm(false);
  };

  const handleEdit = (location: Location) => {
    setFormData({
      name: location.name,
      description: location.description,
      type: location.type,
      time: location.appearance.time || 'day',
      weather: location.appearance.weather || '',
    });
    setEditingLocationId(location.id);
    setShowForm(true);
  };

  const handleDelete = (locationId: string) => {
    if (window.confirm('¿Eliminar esta localización?')) {
      dispatch(deleteLocation(locationId));
    }
  };

  const getTypeLabel = (type: LocationType) => {
    const typeMap: Record<LocationType, string> = {
      interior: 'Interior',
      exterior: 'Exterior',
      vehicle: 'Vehículo',
      abstract: 'Abstracto',
    };
    return typeMap[type];
  };

  const getTimeLabel = (time: string) => {
    const timeMap: Record<string, string> = {
      day: 'Día',
      night: 'Noche',
      dusk: 'Atardecer',
      dawn: 'Amanecer',
    };
    return timeMap[time] || time;
  };

  return (
    <div className="location-list-panel">
      {/* Header */}
      <div className="panel-header">
        <h2>Localizaciones</h2>
        <button
          className="btn-add-location"
          onClick={() => {
            setEditingLocationId(null);
            setFormData({
              name: '',
              description: '',
              type: 'interior',
              time: 'day',
              weather: '',
            });
            setShowForm(true);
          }}
        >
          + Nueva Localización
        </button>
      </div>

      {/* Search */}
      <div className="search-section">
        <input
          type="text"
          placeholder="Buscar localización..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Locations Grid */}
      {filteredLocations.length === 0 && !showForm ? (
        <div className="empty-state">
          <p>No hay localizaciones creadas</p>
          <small>Crea tu primera localización para comenzar</small>
        </div>
      ) : (
        <div className="locations-grid">
          {filteredLocations.map(location => (
            <div key={location.id} className="location-card">
              <div className="location-header">
                <h3 className="location-name">{location.name}</h3>
                <span className="type-badge">{getTypeLabel(location.type)}</span>
              </div>

              {location.description && (
                <p className="location-description">{location.description}</p>
              )}

              <div className="location-details">
                <span className="detail">
                  <strong>Hora:</strong> {getTimeLabel(location.appearance.time || 'day')}
                </span>
                {location.appearance.weather && (
                  <span className="detail">
                    <strong>Clima:</strong> {location.appearance.weather}
                  </span>
                )}
                <span className="detail">
                  <strong>Escenas:</strong> {location.scenesUsed.length}
                </span>
              </div>

              <div className="location-actions">
                <button
                  className="btn-action edit"
                  onClick={() => handleEdit(location)}
                >
                  ✎ Editar
                </button>
                <button
                  className="btn-action delete"
                  onClick={() => handleDelete(location.id)}
                >
                  ✕ Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="location-form-overlay">
          <div className="location-form-modal">
            <div className="form-header">
              <h2>{editingLocationId ? 'Editar Localización' : 'Nueva Localización'}</h2>
              <button
                className="btn-close"
                onClick={() => {
                  setShowForm(false);
                  setEditingLocationId(null);
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="form-content">
              <div className="form-group">
                <label>Nombre *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Oficina, Parque, Coche"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Tipo</label>
                  <select
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value as LocationType })}
                  >
                    <option value="interior">Interior</option>
                    <option value="exterior">Exterior</option>
                    <option value="vehicle">Vehículo</option>
                    <option value="abstract">Abstracto</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Hora del Día</label>
                  <select
                    value={formData.time}
                    onChange={e => setFormData({ ...formData, time: e.target.value as any })}
                  >
                    <option value="day">Día</option>
                    <option value="night">Noche</option>
                    <option value="dusk">Atardecer</option>
                    <option value="dawn">Amanecer</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Clima</label>
                <input
                  type="text"
                  value={formData.weather}
                  onChange={e => setFormData({ ...formData, weather: e.target.value })}
                  placeholder="Ej: Lluvia, Despejado, Nublado"
                />
              </div>

              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe la localización..."
                  rows={4}
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => {
                    setShowForm(false);
                    setEditingLocationId(null);
                  }}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-submit">
                  {editingLocationId ? 'Guardar Cambios' : 'Crear Localización'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationList;
