# 📖 Guía de Usuario - Cinescript v2.0

## Bienvenido a Cinescript

Cinescript es una **aplicación profesional de escritura de guiones cinematográficos** diseñada para escritores que necesitan una herramienta intuitiva y potente.

---

## 🚀 Inicio Rápido

### Acceso a la Aplicación
```
URL: http://localhost:1420
Navegador: Chrome, Firefox, Edge, Safari (moderno)
Requisitos: JavaScript habilitado, conexión local
```

### Interfaz Principal
```
┌─────────────────────────────────────────────────────┐
│  Cinescript │ Mi Película - por Autor  │ Guardar | Exportar │
├──────────────────────────────────────────────────────┤
│ Sidebar │ ✏️ Editor | 📋 Estructura | 👥 Personajes │
│         │ 📍 Localizaciones | 📊 Dashboard          │
│ Estructura │                                         │
│ de Proyecto│     CONTENIDO PRINCIPAL                │
│            │     (depende de tab activo)            │
└────────────────────────────────────────────────────┘
```

---

## 📝 Escribir tu Guión

### El Flujo Automático

Cinescript automáticamente cambia el estilo de escritura según lo que escribas:

```
1. INICIO: Encabezado (SLUGLINE)
   Ejemplo: INT. OFICINA - DÍA
   Estilo: MAYÚSCULAS, negrita

2. Presiona ENTER
   ↓
   Pasa a: ACCIÓN
   Escribe la descripción de la escena

3. Presiona TAB
   ↓
   Pasa a: PERSONAJE
   Escribe el nombre del personaje (en mayúsculas)

4. Presiona ENTER
   ↓
   Pasa a: DIÁLOGO
   Escribe lo que dice el personaje

5. Presiona TAB
   ↓
   Pasa a: ACOTACIÓN
   Escribe instrucciones del actor (entre paréntesis)

6. Presiona ENTER
   ↓
   Vuelve a: ACCIÓN
   El ciclo continúa...
```

### Ejemplo Completo

```
INT. OFICINA - NOCHE
[Presiona ENTER]

La lluvia golpea las ventanas. Juan entra mojado.
[Presiona TAB]

JUAN
[Presiona ENTER]

¿Dónde está el expediente?
[Presiona TAB]

(observa el escritorio)
[Presiona ENTER]

Sara entra con café.
```

---

## 🎬 Gestionar tu Proyecto

### Crear Capítulos y Escenas

**Ir a: Sidebar → Estructura**

1. **Crear Capítulo:**
   - Click en "+ Capítulo"
   - Escribe nombre (ej: "Acto I")
   - Press Enter o Click botón

2. **Crear Escena:**
   - Expande un capítulo (click ▶)
   - Click "+ Escena"
   - Escribe nombre (ej: "Oficina en la noche")
   - Press Enter o Click botón

3. **Editar Títulos:**
   - Click en el título (icono ✎)
   - Edita inline
   - Press Enter o click fuera

4. **Eliminar:**
   - Click en icono ✕
   - Confirma en el diálogo

### Ver tu Estructura

- **Contador de palabras** junto a cada escena
- **Número de capítulos y escenas** expandibles
- **Navegación rápida** entre escenas (click en escena → abre en editor)

---

## 👥 Crear y Gestionar Personajes

**Ir a: Tab → 👥 Personajes**

### Crear Personaje

1. Click **"+ Nuevo Personaje"**
2. Rellena el formulario:
   - **Nombre:** Ej: "Juan García"
   - **Rol:** Protagonista / Antagonista / Secundario / Extra
   - **Descripción:** Breve resumen del personaje
   - **Edad:** Número
   - **Género:** Texto libre
   - **Rasgos Físicos:** Descripción completa
   - **Voz:** Cómo habla (tono, acento, etc)
   - **Trasfondo:** La historia de vida del personaje

3. Click **"Crear Personaje"**

### Buscar y Filtrar

- **Búsqueda:** Escribe en "Buscar personaje..."
- **Filtro por Rol:** Selecciona rol en dropdown
- Combinables: busca + filtra simultáneamente

### Gestionar Relaciones

1. En una tarjeta de personaje, click **"🔗 Relaciones"**
2. Ver relaciones actuales del personaje
3. **Agregar Nueva Relación:**
   - Selecciona otro personaje
   - Tipo de relación:
     - Padre/Madre
     - Hijo/Hija
     - Hermano/Hermana
     - Aliado
     - Enemigo
     - Romántico
     - Mentor
     - Otro
   - **Tensión:** Barra de 0-100%
     - 0 = Neutro, sin conflicto
     - 50 = Moderado
     - 100 = Máximo conflicto
   - **Descripción:** Explica la relación
4. Click **"Agregar Relación"**

### Ver Estadísticas

En cada tarjeta verás:
- **Apariciones:** Cuántas escenas aparece
- **Líneas de Diálogo:** Cuántas líneas habla

---

## 📍 Crear y Gestionar Localizaciones

**Ir a: Tab → 📍 Localizaciones**

### Crear Localización

1. Click **"+ Nueva Localización"**
2. Rellena:
   - **Nombre:** Ej: "Oficina de Policía"
   - **Tipo:** Interior / Exterior / Vehículo / Abstracto
   - **Hora del Día:** Día / Noche / Atardecer / Amanecer
   - **Clima:** Ej: "Lluvia fuerte", "Despejado"
   - **Descripción:** Detalles de la localización
3. Click **"Crear Localización"**

### Búsqueda

- Usa la barra de búsqueda para encontrar localizaciones

### Ver Información

En cada tarjeta verás:
- Tipo de localización (color-coded)
- Hora y clima
- Número de escenas donde aparece

---

## 📊 Dashboard - Análisis de tu Proyecto

**Ir a: Tab → 📊 Dashboard**

Ver estadísticas completas:

### Estadísticas Clave
- **Palabras Totales:** Total de palabras en el guión
- **Líneas:** Total de líneas de diálogo/acción
- **Escenas:** Número de escenas
- **Personajes:** Número de personajes creados
- **Localizaciones:** Número de localizaciones
- **Minutos Estimados:** Duración aproximada en minutos

### Promedios
- **Palabras por Escena:** Promedio de palabras
- **Líneas por Escena:** Promedio de líneas
- **Líneas de Diálogo:** Total de diálogos

### Personajes Principales
Tabla ordenada por apariciones:
- **Personaje:** Nombre
- **Rol:** Tipo (color-coded)
- **Apariciones:** Número de escenas
- **Diálogos:** Número de líneas de diálogo
- **Relaciones:** Número de relaciones

### Escenas Más Largas
Lista de top 10 escenas por palabras:
- **Escena:** Título y capítulo
- **Palabras:** Total de palabras
- **Líneas:** Total de líneas
- **Personajes:** Cuántos aparecen

### Información del Proyecto
- **Formato:** Guión o Novela
- **Capítulos:** Total de capítulos
- **Creado:** Fecha de creación
- **Última Modificación:** Cuándo se editó por última vez

---

## 💾 Exportar tu Proyecto

**Click botón: 📥 Exportar en header**

### Opciones de Exportación

#### 1. **TXT - Guión**
- Formato de texto plano
- Estructura cinematográfica
- Listo para imprimir
- Usa Courier 12pt (estándar industria)

#### 2. **JSON - Proyecto**
- Archivo completo del proyecto
- Importable en Cinescript
- Contiene: estructura, personajes, localizaciones
- Útil para backup y compartir

#### 3. **CSV - Personajes**
- Hoja de cálculo de personajes
- Abre en Excel, Sheets, etc
- Columnas: Nombre, Rol, Apariciones, Diálogos, Relaciones
- Útil para análisis

#### 4. **CSV - Escenas**
- Hoja de cálculo de escenas
- Abre en Excel, Sheets, etc
- Columnas: Capítulo, Escena, Palabras, Líneas, Personajes, Localizaciones
- Útil para planificación

---

## 🎨 Consejos de Uso

### Escritura Efectiva

1. **Usa el flujo automático:**
   - No luches contra los estilos
   - Deja que Enter/Tab guíen tu escritura
   - Es más rápido

2. **Nombra bien tus escenas:**
   - "Oficina en la noche" es mejor que "Escena 1"
   - Ayuda a navegar rápido

3. **Rellena fichas de personajes:**
   - Aunque sea mini-descripción
   - Te ayuda a escribir consistentemente
   - Facilita exportación

4. **Crea localizaciones:**
   - Aunque sea descriptiva
   - Añade autenticidad
   - Útil para análisis

### Gestión de Proyecto

1. **Revisa el Dashboard regularmente:**
   - Monitorea progreso
   - Identifica personajes poco usados
   - Verifica balance de escenas

2. **Usa Relaciones:**
   - Define dinámicas personaje-a-personaje
   - Tension alta = conflicto interesante
   - Ayuda a planificar arcos

3. **Exporta regularmente:**
   - JSON como backup
   - TXT para revisar
   - CSV para análisis

---

## ⌨️ Atajos Teclado (Próximamente)

```
Ctrl+S      → Guardar (planeado)
Ctrl+E      → Exportar (planeado)
Ctrl+N      → Nueva Escena (planeado)
Tab         → Siguiente estilo (implementado)
Shift+Tab   → Estilo anterior (planeado)
```

---

## 🐛 Solucionar Problemas

### La aplicación va lenta
- Refresca la página (F5)
- Cierra otras pestañas
- Reinicia el servidor

### Los cambios no se guardan
- Verificar que no haya errores en consola (F12)
- Recarga la página
- Exporta JSON como backup

### Los estilos no cambian con Enter/Tab
- Posiciónate al final de la línea
- Asegúrate de estar en el editor
- Los estilos cambian línea por línea, no inline

---

## 📞 Soporte

Para problemas o sugerencias:
- Revisa la consola del navegador (F12)
- Busca en la documentación de arquitectura (ARCHITECTURE.md)
- Reporta errores con descripción clara

---

## 🔄 Próximas Características (Fase 4+)

- ✅ PDF Export (próximo)
- ✅ DOCX Export (próximo)
- ✅ Imágenes de personajes (IA)
- ✅ Grafo visual de relaciones
- ✅ Timeline interactivo
- ✅ Empaquetado Windows (.exe)
- ✅ Sincronización en la nube

---

**¡Feliz escritura! 🎬**

Cinescript - Donde los guiones cobran vida
