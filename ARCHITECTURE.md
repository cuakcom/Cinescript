# Cinescript Architecture

## Visión General

Cinescript es una aplicación profesional para escribir guiones de cine inspirada en programas como yWriter, Scrivener y Bibisco. Esta documento describe la arquitectura técnica de la aplicación.

## Stack Tecnológico

- **Frontend:** React 18 + TypeScript
- **State Management:** Redux Toolkit
- **Build Tool:** Vite
- **UI Framework:** React + CSS Modules
- **Desktop:** Tauri 2.0 (futuro)
- **Persistence:** JSON + IndexedDB (futuro)

## Estructura de Carpetas

```
cinescript/
├── src/
│   ├── core/                     # Lógica de negocio
│   │   ├── models/              # TypeScript interfaces
│   │   ├── editor/              # Lógica del editor screenplay
│   │   ├── services/            # Servicios (futuro)
│   │   ├── store/               # Redux slices
│   │   └── utils/               # Utilidades
│   │
│   ├── ui/                       # UI Components
│   │   ├── components/          # Componentes React
│   │   │   ├── Editor/
│   │   │   ├── StructurePanel/
│   │   │   ├── CharactersPanel/
│   │   │   └── LocationsPanel/
│   │   ├── layouts/             # Layouts principales
│   │   └── styles/              # CSS global
│   │
│   ├── main/                     # Tauri main process (futuro)
│   │
│   ├── App.tsx                   # Root component
│   ├── index.tsx                 # Entry point
│   └── index.css                 # Global styles
│
├── src-tauri/                     # Tauri backend (futuro)
├── public/                        # Static assets
├── tests/                         # Tests
├── docs/                          # Documentation
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Modelos de Datos

### Project
Documento raíz que contiene toda la información del guión.

```typescript
interface Project {
  id: string;
  title: string;
  author: string;
  format: 'screenplay' | 'novel';
  chapters: Chapter[];
  characters: Character[];
  locations: Location[];
  metadata: { createdAt, lastModified, version };
}
```

### Chapter & Scene
Estructura jerárquica del proyecto.

```typescript
interface Chapter {
  id: string;
  title: string;
  order: number;
  scenes: Scene[];
}

interface Scene {
  id: string;
  title: string;
  lines: Line[];
  charactersInScene: string[];
  locationsInScene: string[];
  metadata: { wordCount, duration };
}
```

### Line
Una línea individual en el guión con tipo y contenido.

```typescript
type LineType = 'slugline' | 'action' | 'character' | 'dialogue' | 'parenthetical';

interface Line {
  id: string;
  type: LineType;
  content: string;
  characterId?: string;
}
```

### Character
Ficha de personaje con características y relaciones.

```typescript
interface Character {
  id: string;
  name: string;
  description: string;
  role: 'protagonist' | 'antagonist' | 'supporting' | 'extra';
  appearance: { age, gender, physicalTraits, voice };
  backstory: string;
  relationships: Relationship[];
  statistics: { appearances, dialogueLines, screenTime };
}
```

### Location
Localización con relaciones y apariciones.

```typescript
interface Location {
  id: string;
  name: string;
  description: string;
  type: 'interior' | 'exterior' | 'vehicle' | 'abstract';
  appearance: { time, weather };
  scenesUsed: string[];
  relationships: LocationRelationship[];
}
```

## Redux State Shape

```typescript
{
  project: Project,  // El proyecto completo
  ui: {
    activeTab: 'editor' | 'structure' | 'characters' | 'locations' | 'dashboard',
    selectedCharacterId?: string,
    selectedLocationId?: string,
    sidebarExpanded: boolean,
    theme: 'light' | 'dark'
  }
}
```

## Flujo del Editor Screenplay

El editor implementa la lógica estándar de guión cinematográfico:

1. **Inicio:** `Slugline` (encabezado, negrita)
2. **Enter:** → `Action` (descripción de escena)
3. **Tab:** → `Character` (nombre de personaje, negrita, centrado)
4. **Enter:** → `Dialogue` (diálogo del personaje)
5. **Tab:** → `Parenthetical` (acotación, cursiva)
6. **Enter:** → vuelve a `Action`

Implementado en `src/core/editor/ScriptFlow.ts`

## Estilos Cinematográficos

Los márgenes se ajustan a estándares de la industria cinematográfica:

- **Slugline:** 0in margen izquierdo, negrita, mayúsculas
- **Action:** 0in margen izquierdo
- **Character:** 3.7in margen izquierdo, negrita, centrado
- **Dialogue:** 2.5in margen izquierdo, ancho máximo 3.5in
- **Parenthetical:** 3.1in margen izquierdo, cursiva

Fuente: **Courier New** 12pt, espaciado 1.5

## Componentes Principales

### ScriptEditor
Componente principal del editor. Renderiza líneas como divs `contentEditable` con tipos de estilo aplicados. Maneja Enter/Tab para transiciones de tipo automáticas.

### ProjectTree (Futuro)
Árbol jerárquico expandible de capítulos y escenas.

### CharacterPanel (Futuro)
Gestión de personajes, fichas completas, relaciones (grafo visual).

### LocationsPanel (Futuro)
Gestión de localizaciones, relaciones con escenas y personajes.

## Flujo de Desarrollo

### Fase 1: MVP Editor ✅ (Implementado)
- [x] Setup Vite + React + Redux
- [x] Modelos de datos TypeScript
- [x] Componente ScriptEditor
- [x] Lógica flujo screenplay
- [x] Estilos cinematográficos

### Fase 2: Estructura + Gestión
- [ ] Componente ProjectTree
- [ ] CRUD de escenas
- [ ] Indicadores de palabras
- [ ] Búsqueda por escena

### Fase 3: Personajes
- [ ] CharacterForm y CharacterCard
- [ ] Grafo de relaciones (Cytoscape)
- [ ] Auto-detección de personajes
- [ ] Estadísticas de apariciones

### Fase 4: Localizaciones + Dashboard
- [ ] LocationForm y LocationCard
- [ ] Dashboard con estadísticas
- [ ] Exportación PDF/DOCX
- [ ] Timeline visual

### Fase 5: Polish + Tauri
- [ ] Configuración Tauri
- [ ] Build .exe Windows
- [ ] Temas dark/light
- [ ] Accesos directos teclado

## Próximos Pasos

1. **Verificar que todo compila:**
   ```bash
   npm run build
   ```

2. **Ejecutar en desarrollo:**
   ```bash
   npm run dev
   ```

3. **Implementar Fase 2:** ProjectTree y CRUD de escenas

## Convenciones de Código

- **Componentes React:** PascalCase (`ScriptEditor.tsx`)
- **Funciones/variables:** camelCase
- **Tipos/Interfaces:** PascalCase
- **CSS:** BEM-like (`.component-name`, `.component-name__element`)
- **Comentarios:** Solo para WHY, no para WHAT

## Recursos

- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Screenplay Format Reference](https://www.masterclass.com/articles/screenplay-format-guide)
