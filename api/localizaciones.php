<?php
declare(strict_types=1);

require_once __DIR__ . '/_bootstrap.php';

use Cinescript\Database;
use Cinescript\Http;

$metodo = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
$pdo    = Database::pdo();

match ($metodo) {
    'GET'    => listar($pdo),
    'POST'   => crear($pdo),
    'DELETE' => borrar($pdo),
    default  => Http::error('Método no permitido', 405),
};

function listar(\PDO $pdo): never
{
    $proyectoId = (int) ($_GET['proyecto_id'] ?? 1);
    $stmt = $pdo->prepare(
        'SELECT id, nombre, tipo FROM localizaciones WHERE proyecto_id = ? ORDER BY nombre COLLATE NOCASE'
    );
    $stmt->execute([$proyectoId]);
    Http::json(['ok' => true, 'localizaciones' => $stmt->fetchAll()]);
}

function crear(\PDO $pdo): never
{
    $body       = Http::readJsonBody();
    $proyectoId = (int) ($body['proyecto_id'] ?? 0);
    $nombre     = mb_strtoupper(trim((string) ($body['nombre'] ?? '')));
    $tipo       = strtoupper(trim((string) ($body['tipo'] ?? 'INT')));

    if ($proyectoId < 1 || $nombre === '') {
        Http::error('proyecto_id y nombre son obligatorios', 422);
    }
    $tipo = match ($tipo) {
        'INT', 'EXT', 'INT/EXT', 'EXT/INT' => $tipo,
        default => 'INT',
    };

    $stmt = $pdo->prepare(
        'INSERT INTO localizaciones (proyecto_id, nombre, tipo) VALUES (?, ?, ?)
         ON CONFLICT(proyecto_id, nombre) DO UPDATE SET tipo = excluded.tipo'
    );
    $stmt->execute([$proyectoId, $nombre, $tipo]);

    Http::json(['ok' => true, 'nombre' => $nombre, 'tipo' => $tipo]);
}

function borrar(\PDO $pdo): never
{
    $body       = Http::readJsonBody();
    $proyectoId = (int) ($body['proyecto_id'] ?? 0);
    $id         = (int) ($body['id'] ?? 0);
    if ($proyectoId < 1 || $id < 1) {
        Http::error('proyecto_id e id son obligatorios', 422);
    }
    $stmt = $pdo->prepare('DELETE FROM localizaciones WHERE id = ? AND proyecto_id = ?');
    $stmt->execute([$id, $proyectoId]);
    Http::json(['ok' => true, 'eliminados' => $stmt->rowCount()]);
}
