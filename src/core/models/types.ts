// Line Types
export type LineType = 'slugline' | 'action' | 'character' | 'dialogue' | 'parenthetical';

export interface Line {
  id: string;
  type: LineType;
  content: string;
  characterId?: string;
  timestamp?: number;
}

// Character Types
export type CharacterRole = 'protagonist' | 'antagonist' | 'supporting' | 'extra';
export type RelationshipType = 'parent' | 'child' | 'sibling' | 'ally' | 'enemy' | 'romantic' | 'mentor' | 'other';

export interface Relationship {
  targetCharacterId: string;
  type: RelationshipType;
  description?: string;
  tension: number; // 0-100
}

export interface Character {
  id: string;
  name: string;
  description: string;
  role: CharacterRole;
  appearance: {
    age?: number;
    gender?: string;
    physicalTraits?: string;
    voice?: string;
  };
  backstory: string;
  relationships: Relationship[];
  statistics: {
    firstAppearance?: string;
    appearances: number;
    dialogueLines: number;
    screenTime?: number;
  };
}

// Location Types
export type LocationType = 'interior' | 'exterior' | 'vehicle' | 'abstract';
export type TimeOfDay = 'day' | 'night' | 'dusk' | 'dawn';
export type LocationRelationType = 'adjacent' | 'connected' | 'distant';

export interface LocationRelationship {
  targetLocationId: string;
  type: LocationRelationType;
  distance?: string;
}

export interface Location {
  id: string;
  name: string;
  description: string;
  type: LocationType;
  appearance: {
    time?: TimeOfDay;
    weather?: string;
  };
  scenesUsed: string[];
  relationships: LocationRelationship[];
}

// Scene Types
export interface Scene {
  id: string;
  title: string;
  order: number;
  summary?: string;
  lines: Line[];
  charactersInScene: string[];
  locationsInScene: string[];
  metadata: {
    wordCount: number;
    duration?: number;
  };
}

// Chapter Types
export interface Chapter {
  id: string;
  title: string;
  order: number;
  scenes: Scene[];
}

// Project Types
export type ProjectFormat = 'screenplay' | 'novel';

export interface ProjectMetadata {
  createdAt: string;
  lastModified: string;
  version: string;
}

export interface Project {
  id: string;
  title: string;
  author: string;
  format: ProjectFormat;
  chapters: Chapter[];
  characters: Character[];
  locations: Location[];
  metadata: ProjectMetadata;
}

// Redux State Types
export interface EditorState {
  currentSceneId?: string;
  currentLineIndex?: number;
  isSaved: boolean;
  lastSaved?: string;
}

export interface UIState {
  activeTab: 'editor' | 'structure' | 'characters' | 'relationships' | 'locations' | 'dashboard';
  selectedCharacterId?: string;
  selectedLocationId?: string;
  selectedChapterId?: string;
  sidebarExpanded: boolean;
  theme: 'light' | 'dark';
}
