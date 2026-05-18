import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import type { Project, Chapter, Scene, Character, Location, Line } from '@models/types';

const demoCharacterId1 = uuidv4();
const demoCharacterId2 = uuidv4();
const demoLocationId1 = uuidv4();
const demoSceneId1 = uuidv4();

const initialState: Project = {
  id: uuidv4(),
  title: 'El Detective Perdido',
  author: 'Cinescript',
  format: 'screenplay',
  chapters: [
    {
      id: uuidv4(),
      title: 'Acto I - El Crimen',
      order: 1,
      scenes: [
        {
          id: demoSceneId1,
          title: 'Oficina en la Noche',
          order: 1,
          summary: 'Un detective llega a la escena del crimen en la madrugada',
          lines: [
            {
              id: uuidv4(),
              type: 'slugline',
              content: 'INT. OFICINA POLICÍA - NOCHE',
            },
            {
              id: uuidv4(),
              type: 'action',
              content: 'La lluvia golpea contra las ventanas. El detective JUAN entra por la puerta principal, empapado. Sus ojos cansan de buscar respuestas.',
            },
            {
              id: uuidv4(),
              type: 'character',
              content: 'JUAN',
              characterId: demoCharacterId1,
            },
            {
              id: uuidv4(),
              type: 'dialogue',
              content: '¿Dónde está el expediente? Tiene que estar aquí.',
            },
            {
              id: uuidv4(),
              type: 'parenthetical',
              content: 'observa el escritorio vacío',
            },
            {
              id: uuidv4(),
              type: 'action',
              content: 'Entra SARA, su compañera, con dos tazas de café. Parece preocupada.',
            },
            {
              id: uuidv4(),
              type: 'character',
              content: 'SARA',
              characterId: demoCharacterId2,
            },
            {
              id: uuidv4(),
              type: 'dialogue',
              content: 'El jefe lo pidió hace dos horas. Dijo que era urgente.',
            },
            {
              id: uuidv4(),
              type: 'character',
              content: 'JUAN',
            },
            {
              id: uuidv4(),
              type: 'dialogue',
              content: 'Nada es urgente a las tres de la mañana. Excepto la verdad.',
            },
          ],
          charactersInScene: [demoCharacterId1, demoCharacterId2],
          locationsInScene: [demoLocationId1],
          metadata: { wordCount: 87 },
        },
      ],
    },
  ],
  characters: [
    {
      id: demoCharacterId1,
      name: 'Juan García',
      description: 'Detective veterano, buscador de verdades',
      role: 'protagonist',
      appearance: {
        age: 42,
        gender: 'Masculino',
        physicalTraits: 'Alto, cabello gris en las sienes, cicatriz en la mejilla izquierda, ojos azules penetrantes',
        voice: 'Grave y cansada, habla lentamente como si pensara cada palabra',
      },
      backstory: 'Detective de homicidios con 20 años de experiencia. Su vida es el trabajo. Ha perdido a su familia en el camino, pero no se arrepiente. Cree que cada caso que resuelve evita más tragedias.',
      relationships: [
        {
          targetCharacterId: demoCharacterId2,
          type: 'ally',
          description: 'Compañera de trabajo, confía ciegamente en ella',
          tension: 20,
        },
      ],
      statistics: {
        appearances: 1,
        dialogueLines: 3,
      },
    },
    {
      id: demoCharacterId2,
      name: 'Sara López',
      description: 'Detective joven, con intuición excepcional',
      role: 'supporting',
      appearance: {
        age: 28,
        gender: 'Femenino',
        physicalTraits: 'Estatura media, cabello negro recogido, ojos marrones, sonrisa amable pero desaparece rápido',
        voice: 'Aguda y clara, habla con convicción, rara vez duda',
      },
      backstory: 'Detective nueva en la unidad de homicidios, pero con un currículo impresionante. Es la mano derecha de Juan. Tiene un secreto que oculta incluso a él.',
      relationships: [
        {
          targetCharacterId: demoCharacterId1,
          type: 'mentor',
          description: 'Aprende de Juan cada día',
          tension: 10,
        },
      ],
      statistics: {
        appearances: 1,
        dialogueLines: 2,
      },
    },
  ],
  locations: [
    {
      id: demoLocationId1,
      name: 'Oficina Policía - Sección Homicidios',
      description: 'Una oficina desordenada llena de archivos, escritorios rotos, máquina de café rota. Las paredes son grises, las ventanas grandes miran a la ciudad nocturna. Un lugar donde se resuelven misterios.',
      type: 'interior',
      appearance: {
        time: 'night',
        weather: 'Lluvia fuerte golpea las ventanas',
      },
      scenesUsed: [demoSceneId1],
      relationships: [],
    },
  ],
  metadata: {
    createdAt: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    version: '2.0.0',
  },
};

export const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    // Project actions
    loadProject: (state, action: PayloadAction<Project>) => {
      return action.payload;
    },

    updateProjectTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
      state.metadata.lastModified = new Date().toISOString();
    },

    updateProjectAuthor: (state, action: PayloadAction<string>) => {
      state.author = action.payload;
      state.metadata.lastModified = new Date().toISOString();
    },

    // Chapter actions
    addChapter: (state, action: PayloadAction<string>) => {
      const newChapter: Chapter = {
        id: uuidv4(),
        title: action.payload,
        order: state.chapters.length,
        scenes: [],
      };
      state.chapters.push(newChapter);
      state.metadata.lastModified = new Date().toISOString();
    },

    updateChapter: (state, action: PayloadAction<Chapter>) => {
      const index = state.chapters.findIndex(c => c.id === action.payload.id);
      if (index >= 0) {
        state.chapters[index] = action.payload;
        state.metadata.lastModified = new Date().toISOString();
      }
    },

    deleteChapter: (state, action: PayloadAction<string>) => {
      state.chapters = state.chapters.filter(c => c.id !== action.payload);
      state.metadata.lastModified = new Date().toISOString();
    },

    // Scene actions
    addScene: (state, action: PayloadAction<{ chapterId: string; title: string }>) => {
      const chapter = state.chapters.find(c => c.id === action.payload.chapterId);
      if (chapter) {
        const newScene: Scene = {
          id: uuidv4(),
          title: action.payload.title,
          order: chapter.scenes.length,
          summary: '',
          lines: [
            {
              id: uuidv4(),
              type: 'slugline',
              content: 'INT. LOCALIZACIÓN - DÍA',
            },
          ],
          charactersInScene: [],
          locationsInScene: [],
          metadata: { wordCount: 0 },
        };
        chapter.scenes.push(newScene);
        state.metadata.lastModified = new Date().toISOString();
      }
    },

    updateScene: (state, action: PayloadAction<Scene>) => {
      for (const chapter of state.chapters) {
        const sceneIndex = chapter.scenes.findIndex(s => s.id === action.payload.id);
        if (sceneIndex >= 0) {
          chapter.scenes[sceneIndex] = action.payload;
          state.metadata.lastModified = new Date().toISOString();
          return;
        }
      }
    },

    deleteScene: (state, action: PayloadAction<{ chapterId: string; sceneId: string }>) => {
      const chapter = state.chapters.find(c => c.id === action.payload.chapterId);
      if (chapter) {
        chapter.scenes = chapter.scenes.filter(s => s.id !== action.payload.sceneId);
        state.metadata.lastModified = new Date().toISOString();
      }
    },

    // Line actions
    updateSceneLines: (state, action: PayloadAction<{ sceneId: string; lines: Line[] }>) => {
      for (const chapter of state.chapters) {
        const scene = chapter.scenes.find(s => s.id === action.payload.sceneId);
        if (scene) {
          scene.lines = action.payload.lines;
          scene.metadata.wordCount = action.payload.lines.reduce(
            (sum, line) => sum + line.content.split(/\s+/).length,
            0
          );
          state.metadata.lastModified = new Date().toISOString();
          return;
        }
      }
    },

    // Character actions
    addCharacter: (state, action: PayloadAction<Omit<Character, 'id' | 'statistics'>>) => {
      const character: Character = {
        id: uuidv4(),
        ...action.payload,
        statistics: {
          appearances: 0,
          dialogueLines: 0,
        },
      };
      state.characters.push(character);
      state.metadata.lastModified = new Date().toISOString();
    },

    updateCharacter: (state, action: PayloadAction<Character>) => {
      const index = state.characters.findIndex(c => c.id === action.payload.id);
      if (index >= 0) {
        state.characters[index] = action.payload;
        state.metadata.lastModified = new Date().toISOString();
      }
    },

    deleteCharacter: (state, action: PayloadAction<string>) => {
      state.characters = state.characters.filter(c => c.id !== action.payload);
      state.metadata.lastModified = new Date().toISOString();
    },

    // Location actions
    addLocation: (state, action: PayloadAction<Omit<Location, 'id' | 'scenesUsed' | 'relationships'>>) => {
      const location: Location = {
        id: uuidv4(),
        ...action.payload,
        scenesUsed: [],
        relationships: [],
      };
      state.locations.push(location);
      state.metadata.lastModified = new Date().toISOString();
    },

    updateLocation: (state, action: PayloadAction<Location>) => {
      const index = state.locations.findIndex(l => l.id === action.payload.id);
      if (index >= 0) {
        state.locations[index] = action.payload;
        state.metadata.lastModified = new Date().toISOString();
      }
    },

    deleteLocation: (state, action: PayloadAction<string>) => {
      state.locations = state.locations.filter(l => l.id !== action.payload);
      state.metadata.lastModified = new Date().toISOString();
    },
  },
});

export const {
  loadProject,
  updateProjectTitle,
  updateProjectAuthor,
  addChapter,
  updateChapter,
  deleteChapter,
  addScene,
  updateScene,
  deleteScene,
  updateSceneLines,
  addCharacter,
  updateCharacter,
  deleteCharacter,
  addLocation,
  updateLocation,
  deleteLocation,
} = projectSlice.actions;

export default projectSlice.reducer;
