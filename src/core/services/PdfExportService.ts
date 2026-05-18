import PDFDocument from 'pdfkit';
import type { Project, Scene, Line, LineType } from '@models/types';

export class PdfExportService {
  /**
   * Export project to professional PDF screenplay format
   */
  static exportToPdf(project: Project): void {
    const doc = new PDFDocument({
      margin: 72, // 1 inch margins (72 points)
      size: 'LETTER',
      info: {
        Title: project.title,
        Author: project.author || 'Cinescript',
      },
    });

    // Generate PDF content
    this.addCoverPage(doc, project);
    this.addTableOfContents(doc, project);

    let pageNumber = 3;

    // Add scenes
    project.chapters.forEach((chapter, chIdx) => {
      chapter.scenes.forEach((scene, scIdx) => {
        pageNumber = this.addScene(doc, scene, chapter.title, pageNumber, project);
      });
    });

    // Add metadata pages
    this.addCharacterList(doc, project, pageNumber);
    this.addLocationList(doc, project);

    // Download
    const filename = `${project.title.replace(/\s+/g, '_')}.pdf`;
    this.downloadPdf(doc, filename);
  }

  /**
   * Add cover page with title and author
   */
  private static addCoverPage(doc: PDFDocument, project: Project): void {
    // Center content vertically
    doc.fontSize(28).font('Helvetica-Bold');
    doc.text(project.title.toUpperCase(), { align: 'center' });

    doc.moveDown(0.5);
    doc.fontSize(14).font('Helvetica');
    doc.text('A Screenplay', { align: 'center' });

    if (project.author) {
      doc.moveDown(2);
      doc.fontSize(12);
      doc.text(`by ${project.author}`, { align: 'center' });
    }

    doc.addPage();
  }

  /**
   * Add table of contents
   */
  private static addTableOfContents(doc: PDFDocument, project: Project): void {
    doc.fontSize(16).font('Helvetica-Bold');
    doc.text('TABLE OF CONTENTS');

    doc.moveDown(0.5);
    doc.fontSize(11).font('Helvetica');

    let sceneNumber = 1;
    project.chapters.forEach(chapter => {
      doc.fontSize(12).font('Helvetica-Bold');
      doc.text(`${chapter.title.toUpperCase()}`);

      doc.fontSize(10).font('Helvetica');
      chapter.scenes.forEach(scene => {
        const pageEstimate = Math.ceil(sceneNumber * 1.5) + 2; // Rough estimate
        doc.text(`  ${sceneNumber}. ${scene.title}`);
        sceneNumber++;
      });

      doc.moveDown(0.3);
    });

    doc.addPage();
  }

  /**
   * Add scene to PDF
   */
  private static addScene(
    doc: PDFDocument,
    scene: Scene,
    chapterTitle: string,
    startPage: number,
    project: Project
  ): number {
    // Scene header
    doc.fontSize(12).font('Helvetica-Bold');
    doc.text(`${scene.title} (${chapterTitle})`);

    doc.moveDown(0.2);
    doc.fontSize(10).font('Helvetica');
    doc.text(`${scene.metadata.wordCount} words | ${scene.lines.length} lines`);

    doc.moveDown(0.3);
    doc.fontSize(1); // Reset separator
    doc.moveTo(doc.page.margins.left, doc.y)
      .lineTo(doc.page.width - doc.page.margins.right, doc.y)
      .stroke();

    doc.moveDown(0.3);

    // Scene lines
    doc.fontSize(11).font('Courier');
    let pageCount = startPage;

    scene.lines.forEach(line => {
      this.addLine(doc, line, project);

      // Page break if needed
      if (doc.y > doc.page.height - 72) {
        doc.addPage();
        pageCount++;
      }
    });

    doc.moveDown(1);
    return pageCount;
  }

  /**
   * Add individual line with proper screenplay formatting
   */
  private static addLine(doc: PDFDocument, line: Line, project: Project): void {
    const pageMargin = 72;
    const contentWidth = doc.page.width - pageMargin * 2;

    switch (line.type) {
      case 'slugline':
        doc.font('Courier-Bold');
        doc.text(line.content.toUpperCase(), {
          width: contentWidth,
          align: 'left',
          underline: false,
        });
        break;

      case 'action':
        doc.font('Courier');
        doc.text(line.content, {
          width: contentWidth,
          align: 'left',
        });
        break;

      case 'character':
        doc.font('Courier-Bold');
        const charName = project.characters.find(c => c.id === line.characterId)?.name ||
          line.content;
        doc.text(charName.toUpperCase(), {
          width: contentWidth,
          align: 'center',
        });
        break;

      case 'dialogue':
        doc.font('Courier');
        const dialogueMargin = 130;
        doc.text(line.content, dialogueMargin, doc.y, {
          width: contentWidth - 100,
          align: 'left',
        });
        break;

      case 'parenthetical':
        doc.font('Courier-Oblique');
        doc.text(`(${line.content})`, {
          width: contentWidth,
          align: 'center',
        });
        break;
    }

    doc.moveDown(0.2);
  }

  /**
   * Add character list
   */
  private static addCharacterList(doc: PDFDocument, project: Project, startPage: number): void {
    doc.addPage();

    doc.fontSize(16).font('Helvetica-Bold');
    doc.text('CHARACTER LIST');

    doc.moveDown(0.5);
    doc.fontSize(11).font('Helvetica');

    project.characters.forEach(char => {
      doc.fontSize(12).font('Helvetica-Bold');
      doc.text(`${char.name.toUpperCase()} (${char.role})`);

      doc.fontSize(10).font('Helvetica');
      if (char.description) {
        doc.text(char.description);
      }
      if (char.appearance.age) {
        doc.text(`Age: ${char.appearance.age}`);
      }
      if (char.appearance.physicalTraits) {
        doc.text(`Traits: ${char.appearance.physicalTraits}`);
      }

      doc.text(`Appearances: ${char.statistics.appearances}`);
      doc.text(`Dialogue Lines: ${char.statistics.dialogueLines}`);

      doc.moveDown(0.3);
    });
  }

  /**
   * Add location list
   */
  private static addLocationList(doc: PDFDocument, project: Project): void {
    if (project.locations.length === 0) return;

    doc.addPage();

    doc.fontSize(16).font('Helvetica-Bold');
    doc.text('LOCATIONS');

    doc.moveDown(0.5);
    doc.fontSize(11).font('Helvetica');

    project.locations.forEach(location => {
      doc.fontSize(12).font('Helvetica-Bold');
      doc.text(`${location.name.toUpperCase()} (${location.type})`);

      doc.fontSize(10).font('Helvetica');
      if (location.description) {
        doc.text(location.description);
      }
      if (location.appearance.time) {
        doc.text(`Time: ${location.appearance.time}`);
      }
      if (location.appearance.weather) {
        doc.text(`Weather: ${location.appearance.weather}`);
      }

      doc.moveDown(0.3);
    });
  }

  /**
   * Download PDF file
   */
  private static downloadPdf(doc: PDFDocument, filename: string): void {
    // In Node/Tauri context, save to file system
    // In browser context, download via blob

    if (typeof window !== 'undefined' && window.document) {
      // Browser environment
      const chunks: Uint8Array[] = [];

      doc.on('data', chunk => {
        chunks.push(chunk);
      });

      doc.on('end', () => {
        const blob = new Blob(chunks, { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });

      doc.end();
    } else {
      // Node.js/Tauri environment - would need file system access
      doc.pipe(require('fs').createWriteStream(filename));
      doc.end();
    }
  }
}
