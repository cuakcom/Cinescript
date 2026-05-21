<?php
declare(strict_types=1);

require_once __DIR__ . '/_bootstrap.php';

use Cinescript\Database;
use Cinescript\Http;

Http::requireMethod('GET');

$proyectoId = (int) ($_GET['proyecto_id'] ?? 1);
if ($proyectoId < 1) {
    Http::error('proyecto_id inválido', 422);
}

$pdo = Database::pdo();

$proyectoStmt = $pdo->prepare('SELECT id, titulo, autor, actualizado FROM proyectos WHERE id = ?');
$proyectoStmt->execute([$proyectoId]);
$proyecto = $proyectoStmt->fetch();

if ($proyecto === false) {
    Http::error('Proyecto no encontrado', 404);
}

$bloquesStmt = $pdo->prepare(
    'SELECT id, orden, tipo, contenido FROM bloques WHERE proyecto_id = ? ORDER BY orden ASC'
);
$bloquesStmt->execute([$proyectoId]);
$bloques = $bloquesStmt->fetchAll();

$personajesStmt = $pdo->prepare(
    'SELECT id, nombre, descripcion FROM personajes WHERE proyecto_id = ? ORDER BY nombre COLLATE NOCASE'
);
$personajesStmt->execute([$proyectoId]);
$personajes = $personajesStmt->fetchAll();

$locsStmt = $pdo->prepare(
    'SELECT id, nombre, tipo FROM localizaciones WHERE proyecto_id = ? ORDER BY nombre COLLATE NOCASE'
);
$locsStmt->execute([$proyectoId]);
$localizaciones = $locsStmt->fetchAll();

Http::json([
    'ok'             => true,
    'proyecto'       => $proyecto,
    'bloques'        => $bloques,
    'personajes'     => $personajes,
    'localizaciones' => $localizaciones,
]);
