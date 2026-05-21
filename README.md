# Cinescript

Editor de guiones auto-alojado al estilo **Celtx**, escrito en **PHP 8.3** y **JavaScript vainilla**.
Pensado para desplegar tal cual en cualquier servidor Apache.

> Tab cambia el tipo de bloque · Enter salta al siguiente lógico. Sin ratón.

## 1. Requisitos

- PHP **8.3+** con extensiones `pdo_sqlite` y `mbstring` (vienen por defecto en la mayoría de distribuciones).
- Apache 2.4+. No requiere `mod_rewrite`.
- Permisos de escritura sobre `data/` (para la base SQLite).

## 2. Despliegue

Copia el repositorio al `DocumentRoot` de Apache (o un VirtualHost):

```bash
cp -r Cinescript/ /var/www/cinescript/
chown -R www-data:www-data /var/www/cinescript/data
```

Visita `http://tu-servidor/cinescript/`. La base SQLite se crea automáticamente
en `data/cinescript.sqlite` en el primer arranque.

Para desarrollo rápido sin Apache:

```bash
php -S 0.0.0.0:8080 -t .
```

## 3. Arquitectura

```
Cinescript/
├── index.php                  # Página principal (HTML + bootstrap)
├── api/
│   ├── _bootstrap.php         # Carga clases comunes
│   ├── cargar.php             # GET  -> proyecto + bloques + sidebars
│   ├── guardar.php            # POST -> sustituye bloques del proyecto
│   ├── personajes.php         # GET/POST/DELETE
│   └── localizaciones.php     # GET/POST/DELETE
├── assets/
│   ├── css/style.css          # Layout y estilos Celtx-like
│   └── js/editor.js           # Lógica de teclado + fetch
├── includes/
│   ├── Database.php           # PDO SQLite, migraciones automáticas
│   ├── Http.php               # Helpers JSON/HTTP
│   └── BlockType.php          # Enum tipado de tipos de bloque
└── data/                      # SQLite (creada en runtime, no versionada)
```

## 4. Atajos de teclado

| Tecla              | Acción                                                   |
| ------------------ | -------------------------------------------------------- |
| **Tab**            | Rota el tipo del bloque actual (Escena → Acción → …)     |
| **Shift + Tab**    | Rotación en sentido inverso                              |
| **Enter**          | Crea bloque siguiente según el tipo actual               |
| **Backspace** al inicio de un bloque vacío | Elimina el bloque y vuelve al anterior       |
| **Ctrl/Cmd + S**   | Guarda manualmente                                       |

Reglas de salto al pulsar **Enter** (idénticas a Celtx):

```
Escena      → Acción
Acción      → Acción
Personaje   → Diálogo
Diálogo     → Acción
Acotación   → Diálogo
Transición  → Escena
```

## 5. Paneles laterales

- **Personajes**: lista única por nombre. Se autoindexan los nombres tecleados
  en bloques de tipo `Personaje`. Doble clic inserta `PERSONAJE` + `Diálogo` en
  el cursor.
- **Localizaciones**: extrae automáticamente de bloques de `Escena` que sigan
  el patrón `INT./EXT. NOMBRE - MOMENTO`. Doble clic inserta una escena nueva.

## 6. Seguridad

- Todas las consultas SQL son `prepared statements` con PDO.
- `data/` e `includes/` quedan bloqueados a peticiones HTTP vía `.htaccess`.
- El contenido del editor se persiste y renderiza como texto plano (nunca HTML).
- Validación estricta del tipo de bloque con `enum` PHP 8.3.
