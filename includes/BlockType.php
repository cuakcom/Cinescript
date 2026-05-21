<?php
declare(strict_types=1);

namespace Cinescript;

/**
 * Tipos de bloque del guion. El orden del enum define la rotación con Tab.
 */
enum BlockType: string
{
    case Escena     = 'escena';
    case Accion     = 'accion';
    case Personaje  = 'personaje';
    case Dialogo    = 'dialogo';
    case Acotacion  = 'acotacion';
    case Transicion = 'transicion';

    /**
     * Etiqueta legible para UI.
     */
    public function etiqueta(): string
    {
        return match ($this) {
            self::Escena     => 'Escena',
            self::Accion     => 'Acción',
            self::Personaje  => 'Personaje',
            self::Dialogo    => 'Diálogo',
            self::Acotacion  => 'Acotación',
            self::Transicion => 'Transición',
        };
    }

    /**
     * Bloque siguiente al pulsar Enter (regla Celtx).
     */
    public function siguienteAlEnter(): self
    {
        return match ($this) {
            self::Escena     => self::Accion,
            self::Accion     => self::Accion,
            self::Personaje  => self::Dialogo,
            self::Dialogo    => self::Accion,
            self::Acotacion  => self::Dialogo,
            self::Transicion => self::Escena,
        };
    }

    /**
     * Rotación cíclica al pulsar Tab.
     */
    public function siguienteAlTab(): self
    {
        return match ($this) {
            self::Escena     => self::Accion,
            self::Accion     => self::Personaje,
            self::Personaje  => self::Dialogo,
            self::Dialogo    => self::Acotacion,
            self::Acotacion  => self::Transicion,
            self::Transicion => self::Escena,
        };
    }
}
