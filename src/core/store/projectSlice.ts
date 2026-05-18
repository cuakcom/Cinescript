import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import type { Project, Chapter, Scene, Character, Location, Line } from '@models/types';

const initialState: Project = {
  id: uuidv4(),
  title: 'Mi Guion',
  author: '',
  format: 'screenplay',
  chapters: [
    {
      id: uuidv4(),
      title: 'Acto I',
      order: 1,
      scenes: [
        {
          id: uuidv4(),
          title: 'Escena 1',
          order: 1,
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
        },
      ],
    },
  ],
  characters: [],
  locations: [],
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
