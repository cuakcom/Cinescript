import type { SaveStatus as SaveStatusType } from '../types/script';

export const SaveStatus = ({ status }: { status: SaveStatusType }) => {
  const labels: Record<SaveStatusType, string> = {
    idle: 'Listo',
    saving: 'Guardando…',
    saved: 'Guardado',
    error: 'Error al guardar',
  };
  return <span className="save-status">{labels[status]}</span>;
};
