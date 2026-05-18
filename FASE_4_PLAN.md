# 🚀 Fase 4 - Plan de Implementación

## Objetivo

Convertir Cinescript en una **aplicación de escritorio profesional** con exportación avanzada, visualizaciones, y empaquetado para Windows.

---

## 📋 Tareas de Fase 4

### A. Exportación Avanzada

#### A1. PDF Export (2-3 días)
```
Tecnología: pdfkit + custom styling
Características:
- Exportar guión con formato profesional
- Portada con título y autor
- Saltos de página automáticos
- Fuente Courier 12pt real
- Márgenes estándar de industria
- Tabla de contenidos automática
- Números de página

Archivos a crear:
- src/core/services/PdfExportService.ts
- Tests para PDF generation

Desafíos:
- Insertar imágenes de personajes (si existen)
- Manejar saltos de página
- Mantener márgenes cinematográficos
```

#### A2. DOCX Export (2-3 días)
```
Tecnología: docx library
Características:
- Exportar a Word profesional
- Fuente y formatos preservados
- Tabla de personajes
- Tabla de localizaciones
- Estructura de capítulos con índices
- Fotos de personajes (si existen)

Archivos a crear:
- src/core/services/DocxExportService.ts
- Plantillas de estilos

Desafíos:
- Insertar tablas complejas
- Mantener consistencia de estilos
- Manejar márgenes
```

---

### B. Visualización Avanzada

#### B1. Grafo de Relaciones (3-4 días)
```
Tecnología: Cytoscape.js
Características:
- Nodos = personajes (color por rol)
- Aristas = relaciones (grosor = tensión)
- Colores de aristas por tipo relación
- Interactivo: arrastrar, zoom, pan
- Click en personaje → mostrar detalles
- Filtrar por tipo de relación

Componentes:
- src/ui/components/Dashboard/RelationshipGraph.tsx
- Estilos Cytoscape personalizados
- Leyenda de colores

Desafíos:
- Renderizar gráficos grandes
- Interactividad suave
- Performance con muchos personajes
```

#### B2. Timeline Visual (2-3 días)
```
Tecnología: Recharts o custom SVG
Características:
- Eje X: Escenas (cronológico)
- Eje Y: Personajes
- Puntos = apariciones
- Líneas = continuidad
- Click = ir a escena
- Filtro por personaje

Archivos:
- src/ui/components/Dashboard/SceneTimeline.tsx
- Timeline styling

Desafíos:
- Muchos personajes = muchas líneas
- Legibilidad con proyectos grandes
```

#### B3. Estadísticas Avanzadas (2 días)
```
Agregar al Dashboard:
- Gráfico: Palabras por capítulo (barras)
- Gráfico: Apariciones por personaje (pie chart)
- Gráfico: Distribución de diálogos (line chart)
- Heatmap: Personajes x Escenas

Tecnología: Recharts

Archivos:
- Actualizar Dashboard.tsx con gráficos
```

---

### C. Aplicación de Escritorio (Windows)

#### C1. Configurar Tauri (2-3 días)
```
Pasos:
1. Inicializar Tauri en proyecto
2. Configurar tauri.conf.json
3. Crear src-tauri/src/main.rs
4. Configurar building para Windows
5. Implementar menubar nativo
6. File dialogs para abrir/guardar

Características:
- Menu File (New, Open, Save, Export)
- Menu Edit (Undo, Redo, Copy, Paste)
- Menu View (Fullscreen, etc)
- Accesos directos del sistema
- Notificaciones del SO

Archivos:
- src-tauri/tauri.conf.json (actualizar)
- src-tauri/src/main.rs (crear)
- src/main/windows/main.ts (crear)
```

#### C2. Persistencia en Disco (2 días)
```
Guardar/Cargar archivos en disco:
- Formato: .cinescript (JSON)
- Dialogs: Open/Save de SO
- File system access via Tauri
- Auto-save cada 30 segundos

Archivos:
- src/core/services/FileService.ts
- Integración en App.tsx
- IPC commands Tauri
```

#### C3. Build Windows (1 día)
```
Crear instalador:
- Executable (.exe)
- Instalador MSI
- Icono personalizado
- Auto-updates (opcional)
- Code signing (opcional pero recomendado)

Comandos:
```
npm run tauri build
```

Output:
- cinescript.exe (portable)
- cinescript-setup.msi (instalable)
```

---

### D. Características Avanzadas Futuras

#### D1. Imágenes de Personajes (Optional)
```
Opción 1: Integración Local
- Subir foto a cada personaje
- Mostrar en fichas y grafo
- Exportar en PDF/DOCX

Opción 2: IA Generativa (Futuro)
- Integración ComfyUI/Stable Diffusion
- Generar imagen basada en descripción
- Guardar en proyecto
```

#### D2. Colaboración (Advanced Future)
```
Real-time editing:
- Yjs + WebSocket
- Sincronización en vivo
- Presencia de usuarios
- Comentarios/sugerencias
- Control de versiones

Cloud backup:
- Firebase/Supabase
- Auto-sync
- Recuperación de versiones
```

#### D3. Importación (Future)
```
Parsear formatos:
- FDX (Final Draft)
- PDF screenplays
- Scripts existentes
- Archivos yWriter
```

---

## 🗓️ Timeline de Fase 4

```
Semana 1:
- Lunes-Miércoles:   PDF Export (3 días)
- Jueves-Viernes:    DOCX Export (2 días)

Semana 2:
- Lunes-Miércoles:   Grafo de Relaciones (3 días)
- Jueves-Viernes:    Timeline Visual (2 días)

Semana 3:
- Lunes-Martes:      Estadísticas Avanzadas (2 días)
- Miércoles-Viernes: Configurar Tauri (3 días)

Semana 4:
- Lunes-Martes:      Persistencia en Disco (2 días)
- Miércoles-Jueves:  Build Windows (1.5 días)
- Viernes:           Testing y Polish (1 día)

Total: ~4 semanas de trabajo
```

---

## 📦 Dependencias a Instalar

```bash
# PDF Export
npm install pdfkit @types/pdfkit

# DOCX Export
npm install docx

# Grafo de Relaciones
npm install cytoscape cytoscape-cose-bilkent

# Tauri
npm install --save-dev @tauri-apps/cli
npm install @tauri-apps/api

# Persistencia
# (Ya incluido en Tauri)

# Testing
npm install --save-dev @testing-library/user-event
```

---

## 🎯 Hitos de Fase 4

### Milestone 1: Export Complete (Semana 1-2)
- ✅ PDF export funcional
- ✅ DOCX export funcional
- ✅ Tests de exportación
- 📦 Build: `npm run build` sin errores

### Milestone 2: Visualización Avanzada (Semana 2-3)
- ✅ Grafo de relaciones interactivo
- ✅ Timeline visual
- ✅ Gráficos de estadísticas
- 📊 Dashboard con toda la info visual

### Milestone 3: Desktop Ready (Semana 3-4)
- ✅ Tauri configurado
- ✅ Menus nativos
- ✅ File open/save
- ✅ Auto-save en disco
- 📦 .exe generado y testado
- ✅ Instalador MSI

### Milestone 4: Release (Semana 4)
- ✅ Testing en Windows 10/11
- ✅ Documentación usuario completa
- ✅ Documentación técnica
- 🚀 Release v2.0 candidato

---

## 🧪 Testing para Fase 4

### Unit Tests
```typescript
// PdfExportService tests
- exportToPdf() con proyecto vacío
- exportToPdf() con guión completo
- exportToPdf() con caracteres especiales
- PDF structure validation

// DocxExportService tests
- exportToDocx()
- Tabla de personajes
- Tabla de localizaciones
- Estilos preservados

// RelationshipGraph tests
- Rendering con 0 personajes
- Rendering con 100+ personajes
- Click handlers
- Filter functionality

// FileService tests
- Save project
- Load project
- File corruption recovery
- Auto-save intervals
```

### Integration Tests
```
- Crear proyecto → exportar PDF → verificar
- Crear personajes → relación → grafo actualiza
- Editar escena → timeline se actualiza
- Auto-save cada 30s
```

### E2E Tests (Tauri)
```
- Abrir aplicación
- Crear nuevo proyecto
- Escribir guión
- Guardar a disco
- Cerrar y reabrir
- Verificar datos persisten
```

---

## 📋 Checklist Final

- [ ] Todas las funcionalidades de Phase 1-3 funcionan
- [ ] Build sin errores
- [ ] Tests pasan (70%+ coverage)
- [ ] Documentación completa
- [ ] Guía de usuario (✅ ya hecha)
- [ ] PDF export tested
- [ ] DOCX export tested
- [ ] Grafo de relaciones renderiza
- [ ] Timeline visual correcto
- [ ] Tauri build limpio
- [ ] .exe ejecutable en Windows
- [ ] Instalador MSI funciona
- [ ] Auto-save verified
- [ ] Dark mode completo
- [ ] Responsive en resoluciones

---

## 💡 Notas Importantes

1. **Performance:** 
   - Grafo con 100+ personajes puede ser lento
   - Considerar virtualización para timeline
   - IndexedDB para caché

2. **Tauri vs Electron:**
   - ✅ Tauri: 4-8 MB vs Electron 400MB
   - ✅ Mejor performance
   - ✅ Tamaño menor
   - ❌ Menos documentación
   - Decisión: Mantener Tauri

3. **Seguridad:**
   - Validar todos los inputs
   - No guardar credenciales
   - CORS setup si cloud sync futuro

4. **Compatibilidad:**
   - Target: Windows 10+
   - Web: Chrome, Firefox, Edge, Safari moderno
   - macOS/Linux: posible en futuro

---

## 🔗 Referencias

- [pdfkit docs](http://pdfkit.org/)
- [docx docs](https://docx.js.org/)
- [Cytoscape.js](https://js.cytoscape.org/)
- [Tauri docs](https://tauri.app/)
- [Recharts](https://recharts.org/)

---

## 🎬 Conclusión

Fase 4 convertirá Cinescript de una **aplicación web** a una **herramienta de escritorio profesional** comparable con Final Draft, Scrivener, y yWriter.

Tiempo estimado: **4-5 semanas** para completar todo.

**¡A escribir guiones!**
