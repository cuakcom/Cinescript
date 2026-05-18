import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel } from 'docx';
import type { Project, Scene, Line } from '@models/types';

export class DocxExportService {
  static exportToDocx(project: Project): void {
    const sections = [
      this.createCoverPage(project),
      ...this.createTableOfContents(project),
      ...this.createScenePages(project),
      ...this.createMetadataPages(project),
    ];

    const doc = new Document({
      sections: [{ children: sections }],
    });

    Packer.toBlob(doc).then(blob => {
      const filename = `${project.title.replace(/\s+/g, '_')}.docx`;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  private static createCoverPage(project: Project): Paragraph[] {
    return [
      new Paragraph({
        text: '',
        spacing: { line: 480 },
      }),
      new Paragraph({
        text: '',
        spacing: { line: 480 },
      }),
      new Paragraph({
        text: '',
        spacing: { line: 480 },
      }),
      new Paragraph({
        text: project.title.toUpperCase(),
        alignment: AlignmentType.CENTER,
        spacing: { line: 240, after: 240 },
        run: new TextRun({
          size: 56,
          bold: true,
          font: 'Courier New',
        }),
      }),
      new Paragraph({
        text: 'A Screenplay',
        alignment: AlignmentType.CENTER,
        spacing: { line: 240, after: 480 },
        run: new TextRun({
          size: 28,
          font: 'Courier New',
        }),
      }),
      ...(project.author
        ? [
            new Paragraph({
              text: `by ${project.author}`,
              alignment: AlignmentType.CENTER,
              spacing: { line: 240, after: 240 },
              run: new TextRun({
                size: 24,
                font: 'Courier New',
              }),
            }),
          ]
        : []),
      new Paragraph({
        text: '',
        pageBreakBefore: true,
      }),
    ];
  }

  private static createTableOfContents(project: Project): Paragraph[] {
    const contents: Paragraph[] = [
      new Paragraph({
        text: 'TABLE OF CONTENTS',
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 240 },
        run: new TextRun({
          bold: true,
          size: 32,
          font: 'Courier New',
        }),
      }),
    ];

    let sceneNumber = 1;
    project.chapters.forEach(chapter => {
      contents.push(
        new Paragraph({
          text: chapter.title.toUpperCase(),
          spacing: { after: 120 },
          run: new TextRun({
            bold: true,
            size: 24,
            font: 'Courier New',
          }),
        })
      );

      chapter.scenes.forEach(scene => {
        contents.push(
          new Paragraph({
            text: `${sceneNumber}. ${scene.title}`,
            spacing: { after: 80, before: 40 },
            indent: { left: 360 },
            run: new TextRun({
              size: 22,
              font: 'Courier New',
            }),
          })
        );
        sceneNumber++;
      });

      contents.push(
        new Paragraph({
          text: '',
          spacing: { after: 120 },
        })
      );
    });

    contents.push(
      new Paragraph({
        text: '',
        pageBreakBefore: true,
      })
    );

    return contents;
  }

  private static createScenePages(project: Project): Paragraph[] {
    const scenes: Paragraph[] = [];

    project.chapters.forEach(chapter => {
      chapter.scenes.forEach(scene => {
        scenes.push(...this.formatScene(scene, chapter.title, project));
      });
    });

    return scenes;
  }

  private static formatScene(scene: Scene, chapterTitle: string, project: Project): Paragraph[] {
    const paragraphs: Paragraph[] = [];

    paragraphs.push(
      new Paragraph({
        text: `${scene.title} (${chapterTitle})`,
        spacing: { after: 80 },
        run: new TextRun({
          bold: true,
          size: 24,
          font: 'Courier New',
        }),
      })
    );

    paragraphs.push(
      new Paragraph({
        text: `${scene.metadata.wordCount} words | ${scene.lines.length} lines`,
        spacing: { after: 120 },
        run: new TextRun({
          size: 20,
          font: 'Courier New',
        }),
      })
    );

    paragraphs.push(
      new Paragraph({
        text: '─'.repeat(80),
        spacing: { after: 120 },
        run: new TextRun({
          size: 20,
          font: 'Courier New',
        }),
      })
    );

    scene.lines.forEach(line => {
      paragraphs.push(this.formatLine(line, project));
    });

    paragraphs.push(
      new Paragraph({
        text: '',
        pageBreakBefore: true,
      })
    );

    return paragraphs;
  }

  private static formatLine(line: Line, project: Project): Paragraph {
    switch (line.type) {
      case 'slugline':
        return new Paragraph({
          text: line.content.toUpperCase(),
          spacing: { after: 120 },
          indent: { left: 360 },
          run: new TextRun({
            bold: true,
            size: 22,
            font: 'Courier New',
          }),
        });

      case 'action':
        return new Paragraph({
          text: line.content,
          spacing: { after: 120 },
          indent: { left: 360 },
          run: new TextRun({
            size: 22,
            font: 'Courier New',
          }),
        });

      case 'character':
        const charName = project.characters.find(c => c.id === line.characterId)?.name || line.content;
        return new Paragraph({
          text: charName.toUpperCase(),
          spacing: { after: 80 },
          alignment: AlignmentType.CENTER,
          run: new TextRun({
            bold: true,
            size: 22,
            font: 'Courier New',
          }),
        });

      case 'dialogue':
        return new Paragraph({
          text: line.content,
          spacing: { after: 120 },
          indent: { left: 720, right: 360 },
          run: new TextRun({
            size: 22,
            font: 'Courier New',
          }),
        });

      case 'parenthetical':
        return new Paragraph({
          text: `(${line.content})`,
          spacing: { after: 80 },
          alignment: AlignmentType.CENTER,
          run: new TextRun({
            italic: true,
            size: 22,
            font: 'Courier New',
          }),
        });

      default:
        return new Paragraph({
          text: line.content,
          spacing: { after: 120 },
          run: new TextRun({
            size: 22,
            font: 'Courier New',
          }),
        });
    }
  }

  private static createMetadataPages(project: Project): Paragraph[] {
    const metadata: Paragraph[] = [];

    // Character list
    metadata.push(
      new Paragraph({
        text: 'CHARACTER LIST',
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 240 },
        run: new TextRun({
          bold: true,
          size: 32,
          font: 'Courier New',
        }),
      })
    );

    project.characters.forEach(char => {
      metadata.push(
        new Paragraph({
          text: `${char.name.toUpperCase()} (${char.role})`,
          spacing: { after: 120 },
          run: new TextRun({
            bold: true,
            size: 24,
            font: 'Courier New',
          }),
        })
      );

      if (char.description) {
        metadata.push(
          new Paragraph({
            text: char.description,
            spacing: { after: 80 },
            indent: { left: 360 },
            run: new TextRun({
              size: 22,
              font: 'Courier New',
            }),
          })
        );
      }

      if (char.appearance.age) {
        metadata.push(
          new Paragraph({
            text: `Age: ${char.appearance.age}`,
            spacing: { after: 80 },
            indent: { left: 360 },
            run: new TextRun({
              size: 22,
              font: 'Courier New',
            }),
          })
        );
      }

      if (char.appearance.physicalTraits) {
        metadata.push(
          new Paragraph({
            text: `Traits: ${char.appearance.physicalTraits}`,
            spacing: { after: 80 },
            indent: { left: 360 },
            run: new TextRun({
              size: 22,
              font: 'Courier New',
            }),
          })
        );
      }

      metadata.push(
        new Paragraph({
          text: `Appearances: ${char.statistics.appearances} | Dialogue Lines: ${char.statistics.dialogueLines}`,
          spacing: { after: 200 },
          indent: { left: 360 },
          run: new TextRun({
            size: 20,
            font: 'Courier New',
          }),
        })
      );
    });

    // Locations
    if (project.locations.length > 0) {
      metadata.push(
        new Paragraph({
          text: '',
          pageBreakBefore: true,
        })
      );

      metadata.push(
        new Paragraph({
          text: 'LOCATIONS',
          heading: HeadingLevel.HEADING_1,
          spacing: { after: 240 },
          run: new TextRun({
            bold: true,
            size: 32,
            font: 'Courier New',
          }),
        })
      );

      project.locations.forEach(location => {
        metadata.push(
          new Paragraph({
            text: `${location.name.toUpperCase()} (${location.type})`,
            spacing: { after: 120 },
            run: new TextRun({
              bold: true,
              size: 24,
              font: 'Courier New',
            }),
          })
        );

        if (location.description) {
          metadata.push(
            new Paragraph({
              text: location.description,
              spacing: { after: 80 },
              indent: { left: 360 },
              run: new TextRun({
                size: 22,
                font: 'Courier New',
              }),
            })
          );
        }

        if (location.appearance.time) {
          metadata.push(
            new Paragraph({
              text: `Time: ${location.appearance.time}`,
              spacing: { after: 80 },
              indent: { left: 360 },
              run: new TextRun({
                size: 22,
                font: 'Courier New',
              }),
            })
          );
        }

        if (location.appearance.weather) {
          metadata.push(
            new Paragraph({
              text: `Weather: ${location.appearance.weather}`,
              spacing: { after: 200 },
              indent: { left: 360 },
              run: new TextRun({
                size: 22,
                font: 'Courier New',
              }),
            })
          );
        }
      });
    }

    return metadata;
  }
}
