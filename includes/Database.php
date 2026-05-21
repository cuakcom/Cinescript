<?php
declare(strict_types=1);

namespace Cinescript;

use PDO;
use PDOException;
use RuntimeException;

/**
 * Conexión SQLite con PDO. Crea el esquema en el primer arranque.
 * SQLite se elige por portabilidad: cero configuración en Apache.
 */
final class Database
{
    private static ?PDO $pdo = null;

    public static function pdo(): PDO
    {
        if (self::$pdo instanceof PDO) {
            return self::$pdo;
        }

        $dir = dirname(__DIR__) . '/data';
        if (!is_dir($dir) && !mkdir($dir, 0775, true) && !is_dir($dir)) {
            throw new RuntimeException("No se pudo crear el directorio de datos: {$dir}");
        }

        $dbPath = $dir . '/cinescript.sqlite';
        $firstRun = !file_exists($dbPath);

        try {
            $pdo = new PDO('sqlite:' . $dbPath, null, null, [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ]);
            $pdo->exec('PRAGMA foreign_keys = ON');
            $pdo->exec('PRAGMA journal_mode = WAL');
        } catch (PDOException $e) {
            throw new RuntimeException('No se pudo abrir la base de datos: ' . $e->getMessage(), 0, $e);
        }

        self::$pdo = $pdo;

        if ($firstRun) {
            self::migrate();
            self::seed();
        } else {
            self::migrate();
        }

        return self::$pdo;
    }

    private static function migrate(): void
    {
        $pdo = self::$pdo;

        $pdo->exec(<<<'SQL'
            CREATE TABLE IF NOT EXISTS proyectos (
                id           INTEGER PRIMARY KEY AUTOINCREMENT,
                titulo       TEXT NOT NULL,
                autor        TEXT NOT NULL DEFAULT '',
                creado_en    TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                actualizado  TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
        SQL);

        $pdo->exec(<<<'SQL'
            CREATE TABLE IF NOT EXISTS bloques (
                id          INTEGER PRIMARY KEY AUTOINCREMENT,
                proyecto_id INTEGER NOT NULL,
                orden       INTEGER NOT NULL,
                tipo        TEXT NOT NULL,
                contenido   TEXT NOT NULL DEFAULT '',
                FOREIGN KEY (proyecto_id) REFERENCES proyectos(id) ON DELETE CASCADE
            )
        SQL);

        $pdo->exec(<<<'SQL'
            CREATE TABLE IF NOT EXISTS personajes (
                id          INTEGER PRIMARY KEY AUTOINCREMENT,
                proyecto_id INTEGER NOT NULL,
                nombre      TEXT NOT NULL,
                descripcion TEXT NOT NULL DEFAULT '',
                UNIQUE(proyecto_id, nombre),
                FOREIGN KEY (proyecto_id) REFERENCES proyectos(id) ON DELETE CASCADE
            )
        SQL);

        $pdo->exec(<<<'SQL'
            CREATE TABLE IF NOT EXISTS localizaciones (
                id          INTEGER PRIMARY KEY AUTOINCREMENT,
                proyecto_id INTEGER NOT NULL,
                nombre      TEXT NOT NULL,
                tipo        TEXT NOT NULL DEFAULT 'INT',
                UNIQUE(proyecto_id, nombre),
                FOREIGN KEY (proyecto_id) REFERENCES proyectos(id) ON DELETE CASCADE
            )
        SQL);

        $pdo->exec('CREATE INDEX IF NOT EXISTS idx_bloques_proyecto ON bloques(proyecto_id, orden)');
    }

    private static function seed(): void
    {
        $pdo = self::$pdo;
        $pdo->prepare('INSERT INTO proyectos (titulo, autor) VALUES (?, ?)')
            ->execute(['Mi primer guion', '']);
    }
}
