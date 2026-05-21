<?php
declare(strict_types=1);

require_once __DIR__ . '/includes/Database.php';
require_once __DIR__ . '/includes/BlockType.php';

use Cinescript\Database;
use Cinescript\BlockType;

// Asegura DB y proyecto por defecto.
$pdo        = Database::pdo();
$proyectoId = (int) ($_GET['proyecto'] ?? 1);

$proyectoStmt = $pdo->prepare('SELECT id, titulo, autor FROM proyectos WHERE id = ?');
$proyectoStmt->execute([$proyectoId]);
$proyecto = $proyectoStmt->fetch();

if ($proyecto === false) {
    $proyectoId = 1;
    $proyectoStmt->execute([$proyectoId]);
    $proyecto = $proyectoStmt->fetch() ?: ['id' => 1, 'titulo' => 'Mi guion', 'autor' => ''];
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cinescript — Editor de guiones</title>
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>

<header class="barra-superior">
    <div class="marca">
        <span class="logo">●</span>
        <strong>Cinescript</strong>
    </div>
    <input
        type="text"
        id="titulo-proyecto"
        class="titulo-proyecto"
        value="<?= htmlspecialchars((string) $proyecto['titulo'], ENT_QUOTES, 'UTF-8') ?>"
        aria-label="Título del guion"
    >
    <div class="acciones">
        <span id="estado-guardado" class="estado">Listo</span>
        <button type="button" id="btn-guardar" class="btn btn-primario">Guardar</button>
    </div>
</header>

<main class="layout">

    <!-- Panel lateral izquierdo: Personajes -->
    <aside class="panel" id="panel-personajes">
        <h2>Personajes</h2>
        <form class="form-rapido" id="form-personaje" autocomplete="off">
            <input type="text" name="nombre" placeholder="Nuevo personaje…" maxlength="64" required>
            <button type="submit" class="btn btn-ghost" title="Añadir personaje">+</button>
        </form>
        <ul id="lista-personajes" class="lista"></ul>
    </aside>

    <!-- Editor central -->
    <section class="editor-zona">
        <div class="leyenda-atajos">
            <span><kbd>Tab</kbd> cambia el tipo de bloque</span>
            <span><kbd>Enter</kbd> salta al siguiente</span>
            <span><kbd>Shift</kbd>+<kbd>Tab</kbd> retrocede el tipo</span>
        </div>

        <div
            id="editor"
            class="editor"
            contenteditable="true"
            spellcheck="true"
            data-proyecto-id="<?= (int) $proyecto['id'] ?>"
            aria-label="Editor de guion"
        ></div>

        <div class="barra-estado">
            <span>Bloque actual: <strong id="tipo-actual">—</strong></span>
            <span id="contador-bloques">0 bloques</span>
        </div>
    </section>

    <!-- Panel lateral derecho: Localizaciones -->
    <aside class="panel" id="panel-localizaciones">
        <h2>Localizaciones</h2>
        <form class="form-rapido" id="form-localizacion" autocomplete="off">
            <select name="tipo" aria-label="Tipo">
                <option value="INT">INT.</option>
                <option value="EXT">EXT.</option>
                <option value="INT/EXT">INT/EXT.</option>
            </select>
            <input type="text" name="nombre" placeholder="Nueva localización…" maxlength="96" required>
            <button type="submit" class="btn btn-ghost" title="Añadir localización">+</button>
        </form>
        <ul id="lista-localizaciones" class="lista"></ul>
    </aside>

</main>

<!-- Configuración inyectada para el JS -->
<script>
    window.CINESCRIPT = Object.freeze({
        proyectoId: <?= (int) $proyecto['id'] ?>,
        endpoints: {
            cargar:         'api/cargar.php',
            guardar:        'api/guardar.php',
            personajes:     'api/personajes.php',
            localizaciones: 'api/localizaciones.php',
        },
        tipos: <?= json_encode(
            array_map(
                static fn (BlockType $b) => ['valor' => $b->value, 'etiqueta' => $b->etiqueta()],
                BlockType::cases()
            ),
            JSON_UNESCAPED_UNICODE
        ) ?>,
    });
</script>
<script src="assets/js/editor.js" defer></script>

</body>
</html>
