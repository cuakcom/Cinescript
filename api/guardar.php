<?php
declare(strict_types=1);

require_once __DIR__ . '/_bootstrap.php';

use Cinescript\BlockType;
use Cinescript\Database;
use Cinescript\Http;

Http::requireMethod('POST');

$payload = Http::readJsonBody();

$proyectoId = (int) ($payload['proyecto_id'] ?? 0);
$bloques    = $payload['bloques']    ?? null;
$titulo     = isset($payload['titulo']) ? trim((string) $payload['titulo']) : null;

if ($proyectoId < 1) {
    Http::error('proyecto_id inválido', 422);
}
if (!is_array($bloques)) {
    Http::error('Se esperaba un array de bloques', 422);
}

$tiposValidos = array_map(static fn (BlockType $b) => $b->value, BlockType::cases());

$normalizados = [];
foreach ($bloques as $i => $bloque) {
    if (!is_array($bloque)) {
        Http::error("Bloque #{$i} mal formado", 422);
    }
    $tipo = (string) ($bloque['tipo'] ?? '');
    if (!in_array($tipo, $tiposValidos, true)) {
        Http::error("Tipo de bloque desconocido en #{$i}: {$tipo}", 422);
    }
    $contenido = (string) ($bloque['contenido'] ?? '');
    $normalizados[] = [
        'orden'     => $i,
        'tipo'      => $tipo,
        'contenido' => $contenido,
    ];
}

$pdo = Database::pdo();
$pdo->beginTransaction();

try {
    $existe = $pdo->prepare('SELECT 1 FROM proyectos WHERE id = ?');
    $existe->execute([$proyectoId]);
    if ($existe->fetchColumn() === false) {
        $pdo->rollBack();
        Http::error('Proyecto no encontrado', 404);
    }

    if ($titulo !== null && $titulo !== '') {
        $pdo->prepare('UPDATE proyectos SET titulo = ?, actualizado = CURRENT_TIMESTAMP WHERE id = ?')
            ->execute([$titulo, $proyectoId]);
    } else {
        $pdo->prepare('UPDATE proyectos SET actualizado = CURRENT_TIMESTAMP WHERE id = ?')
            ->execute([$proyectoId]);
    }

    $pdo->prepare('DELETE FROM bloques WHERE proyecto_id = ?')->execute([$proyectoId]);

    $insert = $pdo->prepare(
        'INSERT INTO bloques (proyecto_id, orden, tipo, contenido) VALUES (?, ?, ?, ?)'
    );
    foreach ($normalizados as $b) {
        $insert->execute([$proyectoId, $b['orden'], $b['tipo'], $b['contenido']]);
    }

    // Auto-indexación: personajes y localizaciones detectados.
    $personajesDetectados   = [];
    $localizacionesDetectadas = [];
    foreach ($normalizados as $b) {
        $texto = trim($b['contenido']);
        if ($texto === '') {
            continue;
        }
        if ($b['tipo'] === BlockType::Personaje->value) {
            $nombre = mb_strtoupper($texto);
            $personajesDetectados[$nombre] = true;
        } elseif ($b['tipo'] === BlockType::Escena->value) {
            // Convención Celtx: "INT./EXT. NOMBRE - MOMENTO"
            if (preg_match('/^\s*(INT\.?\/EXT\.?|INT\.?|EXT\.?|EXT\.?\/INT\.?)\s+(.+?)(\s*[-–]\s*.+)?$/iu', $texto, $m)) {
                $prefijo = strtoupper((string) $m[1]);
                $nombre  = mb_strtoupper(trim((string) $m[2]));
                $tipoLoc = str_contains($prefijo, 'EXT') ? 'EXT' : 'INT';
                if ($nombre !== '') {
                    $localizacionesDetectadas[$nombre] = $tipoLoc;
                }
            }
        }
    }

    $insertPj = $pdo->prepare(
        'INSERT OR IGNORE INTO personajes (proyecto_id, nombre) VALUES (?, ?)'
    );
    foreach (array_keys($personajesDetectados) as $nombre) {
        $insertPj->execute([$proyectoId, $nombre]);
    }

    $insertLoc = $pdo->prepare(
        'INSERT OR IGNORE INTO localizaciones (proyecto_id, nombre, tipo) VALUES (?, ?, ?)'
    );
    foreach ($localizacionesDetectadas as $nombre => $tipoLoc) {
        $insertLoc->execute([$proyectoId, $nombre, $tipoLoc]);
    }

    $pdo->commit();
} catch (\Throwable $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    Http::error('Error al guardar: ' . $e->getMessage(), 500);
}

Http::json([
    'ok'             => true,
    'guardados'      => count($normalizados),
    'personajes'     => array_keys($personajesDetectados),
    'localizaciones' => array_keys($localizacionesDetectadas),
]);
