<?php
declare(strict_types=1);

namespace Cinescript;

use JsonException;

/**
 * Utilidades HTTP/JSON para los endpoints de la API.
 */
final class Http
{
    public static function json(mixed $payload, int $status = 200): never
    {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        header('Cache-Control: no-store');
        echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    public static function error(string $mensaje, int $status = 400): never
    {
        self::json(['ok' => false, 'error' => $mensaje], $status);
    }

    public static function requireMethod(string $metodo): void
    {
        if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== strtoupper($metodo)) {
            self::error('Método no permitido. Se esperaba ' . $metodo, 405);
        }
    }

    /**
     * Lee el cuerpo de la petición como JSON y devuelve un array asociativo.
     */
    public static function readJsonBody(): array
    {
        $raw = file_get_contents('php://input') ?: '';
        if ($raw === '') {
            return [];
        }
        try {
            $data = json_decode($raw, true, 32, JSON_THROW_ON_ERROR);
        } catch (JsonException $e) {
            self::error('JSON inválido: ' . $e->getMessage(), 400);
        }
        return is_array($data) ? $data : [];
    }
}
