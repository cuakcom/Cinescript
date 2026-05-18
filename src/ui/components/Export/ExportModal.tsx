import React, { useState } from 'react';
import { useAppSelector } from '@core/store/hooks';
import { ExportService } from '@core/services/ExportService';
import { PdfExportService } from '@core/services/PdfExportService';
import { DocxExportService } from '@core/services/DocxExportService';
import type { Project } from '@core/models/types';
import './ExportModal.css';

interface ExportModalProps {
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ onClose }) => {
  const project = useAppSelector(state => state.project);
  const [exporting, setExporting] = useState(false);

  const handleExport = (format: 'txt' | 'json' | 'csv-characters' | 'csv-scenes' | 'pdf' | 'docx') => {
    setExporting(true);

    setTimeout(() => {
      switch (format) {
        case 'txt': {
          const content = ExportService.exportToTxt(project);
          const filename = `${project.title.replace(/\s+/g, '_')}.txt`;
          ExportService.downloadFile(content, filename, 'text/plain');
          break;
        }
        case 'json': {
          const content = ExportService.exportToJson(project);
          const filename = `${project.title.replace(/\s+/g, '_')}_proyecto.json`;
          ExportService.downloadFile(content, filename, 'application/json');
          break;
        }
        case 'csv-characters': {
          const content = ExportService.exportCharactersCsv(project);
          const filename = `${project.title.replace(/\s+/g, '_')}_personajes.csv`;
          ExportService.downloadFile(content, filename, 'text/csv');
          break;
        }
        case 'csv-scenes': {
          const content = ExportService.exportScenesCsv(project);
          const filename = `${project.title.replace(/\s+/g, '_')}_escenas.csv`;
          ExportService.downloadFile(content, filename, 'text/csv');
          break;
        }
        case 'pdf':
          PdfExportService.exportToPdf(project);
          break;
        case 'docx':
          DocxExportService.exportToDocx(project);
          break;
      }

      setExporting(false);
      onClose();
    }, 300);
  };

  return (
    <div className="export-modal-overlay">
      <div className="export-modal">
        <div className="modal-header">
          <h2>Exportar Proyecto</h2>
          <button className="btn-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-content">
          <p className="subtitle">Selecciona el formato de exportación:</p>

          <div className="export-options">
            <button
              className="export-option"
              onClick={() => handleExport('txt')}
              disabled={exporting}
            >
              <div className="option-icon">📄</div>
              <h3>TXT (Guión)</h3>
              <p>Formato de texto plano con estructura de guión cinematográfico</p>
            </button>

            <button
              className="export-option"
              onClick={() => handleExport('pdf')}
              disabled={exporting}
            >
              <div className="option-icon">📕</div>
              <h3>PDF (Profesional)</h3>
              <p>Documento PDF con formato de guión profesional</p>
            </button>

            <button
              className="export-option"
              onClick={() => handleExport('docx')}
              disabled={exporting}
            >
              <div className="option-icon">📘</div>
              <h3>DOCX (Word)</h3>
              <p>Documento Word editable con estructura de guión</p>
            </button>

            <button
              className="export-option"
              onClick={() => handleExport('json')}
              disabled={exporting}
            >
              <div className="option-icon">📋</div>
              <h3>JSON (Proyecto)</h3>
              <p>Archivo de proyecto completo para importar en Cinescript</p>
            </button>

            <button
              className="export-option"
              onClick={() => handleExport('csv-characters')}
              disabled={exporting}
            >
              <div className="option-icon">👥</div>
              <h3>CSV (Personajes)</h3>
              <p>Estadísticas de personajes para Excel o Sheets</p>
            </button>

            <button
              className="export-option"
              onClick={() => handleExport('csv-scenes')}
              disabled={exporting}
            >
              <div className="option-icon">🎬</div>
              <h3>CSV (Escenas)</h3>
              <p>Estadísticas de escenas para análisis</p>
            </button>
          </div>

          {exporting && (
            <div className="export-progress">
              <div className="spinner"></div>
              <p>Preparando descarga...</p>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-close-modal" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
