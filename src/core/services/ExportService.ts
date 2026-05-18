import type { Project, LineType } from '@core/models/types';

export class ExportService {
  /**
   * Export project to TXT format
   */
  static exportToTxt(project: Project): string {
    let content = '';

    // Header
    content += `${project.title.toUpperCase()}\n`;
    if (project.author) {
      content += `por ${project.author}\n`;
    }
    content += '\n' + '='.repeat(60) + '\n\n';

    // Content
    project.chapters.forEach((chapter, chIdx) => {
      content += `ACT ${chIdx + 1}: ${chapter.title.toUpperCase()}\n`;
      content += '-'.repeat(60) + '\n\n';

      chapter.scenes.forEach((scene, scIdx) => {
        content += `SCENE ${chIdx + 1}.${scIdx + 1}: ${scene.title}\n\n`;

        scene.lines.forEach(line => {
          content += this.formatLineForExport(line.type, line.content) + '\n';
        });

        content += '\n';
      });

      content += '\n';
    });

    return content;
  }

  /**
   * Export project to JSON format
   */
  static exportToJson(project: Project): string {
    return JSON.stringify(project, null, 2);
  }

  /**
   * Export project to CSV (character statistics)
   */
  static exportCharactersCsv(project: Project): string {
    let csv = 'Personaje,Rol,Apariciones,Líneas Diálogo,Relaciones\n';

    project.characters.forEach(char => {
      const name = `"${char.name.replace(/"/g, '""')}"`;
      const role = char.role;
      const appearances = char.statistics.appearances;
      const dialogueLines = char.statistics.dialogueLines;
      const relationships = char.relationships.length;

      csv += `${name},${role},${appearances},${dialogueLines},${relationships}\n`;
    });

    return csv;
  }

  /**
   * Export project to CSV (scene statistics)
   */
  static exportScenesCsv(project: Project): string {
    let csv = 'Capítulo,Escena,Palabras,Líneas,Personajes,Localizaciones\n';

    project.chapters.forEach(chapter => {
      chapter.scenes.forEach(scene => {
        const chapterName = `"${chapter.title.replace(/"/g, '""')}"`;
        const sceneName = `"${scene.title.replace(/"/g, '""')}"`;
        const words = scene.metadata.wordCount;
        const lines = scene.lines.length;
        const characters = scene.charactersInScene.length;
        const locations = scene.locationsInScene.length;

        csv += `${chapterName},${sceneName},${words},${lines},${characters},${locations}\n`;
      });
    });

    return csv;
  }

  /**
   * Download file helper
   */
  static downloadFile(content: string, filename: string, mimeType: string = 'text/plain') {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Format line for export
   */
  private static formatLineForExport(type: LineType, content: string): string {
    const padding = (content: string, leftMargin: number, maxWidth?: number) => {
      const indent = ' '.repeat(leftMargin);
      if (maxWidth) {
        // Wrap text if needed
        const words = content.split(' ');
        const lines: string[] = [];
        let currentLine = '';

        words.forEach(word => {
          if ((currentLine + word).length <= maxWidth) {
            currentLine += (currentLine ? ' ' : '') + word;
          } else {
            if (currentLine) lines.push(currentLine);
            currentLine = word;
          }
        });
        if (currentLine) lines.push(currentLine);

        return lines.map((line, idx) => {
          const margin = idx === 0 ? indent : ' '.repeat(leftMargin);
          return margin + line;
        }).join('\n');
      }
      return indent + content;
    };

    switch (type) {
      case 'slugline':
        return padding(content.toUpperCase(), 0);
      case 'action':
        return padding(content, 0);
      case 'character':
        return padding(content.toUpperCase(), 20);
      case 'dialogue':
        return padding(content, 10, 40);
      case 'parenthetical':
        return padding(`(${content})`, 15, 35);
      default:
        return content;
    }
  }
}
