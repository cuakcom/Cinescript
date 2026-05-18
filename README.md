# Cinescript (v0 prototipo)

Prototipo inicial para una app de escritura de guion orientada a Windows con enfoque ligero y alta compatibilidad.

## Decisiones técnicas
- **Tecnología base actual:** HTML/CSS/JS puro para maximizar compatibilidad y ligereza en prototipo.
- **Objetivo de empaquetado Windows en siguiente iteración:** Tauri (ligero) o Electron (máxima compatibilidad).

## Funcionalidad incluida
- Editor con fuente **Courier 12** y márgenes tipo guion.
- Flujo de estilos con Enter/Tab para guion:
  - Inicio: **Cabecera (slugline) en negrita**.
  - Enter: avanza de cabecera a acción.
  - Tab en acción: personaje.
  - Enter en personaje: diálogo.
  - Tab en diálogo: acotación.
- Interruptor de modo **Guion industria / Novela estándar**.
- Paneles de:
  - Estructura (escenas)
  - Personajes
  - Localizaciones
- Exportación a **TXT** y **JSON de proyecto**.

## Pendiente para próxima versión
- Exportación real a **PDF, DOCX y FDX**.
- Fichas completas con campos avanzados y grafo de relaciones.
- Integración opcional con generador local de imágenes (ComfyUI/Stable Diffusion).
- Empaquetado a `.exe` para Windows.

## Ejecutar
Abre `index.html` en un navegador moderno.
