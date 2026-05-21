/* =========================================================
 * Cinescript — Editor de guiones tipo Celtx
 * Vanilla JS, sin dependencias.
 * ========================================================= */
(function () {
    'use strict';

    const CFG = window.CINESCRIPT;
    if (!CFG) { console.error('CINESCRIPT config no encontrada'); return; }

    /* ------- Tipos de bloque (espejo de PHP BlockType) ------- */
    const TIPOS = ['escena', 'accion', 'personaje', 'dialogo', 'acotacion', 'transicion'];
    const ETIQUETA = Object.fromEntries(CFG.tipos.map(t => [t.valor, t.etiqueta]));

    // Reglas de salto al pulsar Enter (espejo de BlockType::siguienteAlEnter)
    const SIGUIENTE_ENTER = {
        escena:     'accion',
        accion:     'accion',
        personaje:  'dialogo',
        dialogo:    'accion',
        acotacion:  'dialogo',
        transicion: 'escena',
    };

    /* ---------------- Referencias DOM ---------------- */
    const editor       = document.getElementById('editor');
    const titulo       = document.getElementById('titulo-proyecto');
    const btnGuardar   = document.getElementById('btn-guardar');
    const estado       = document.getElementById('estado-guardado');
    const tipoActualEl = document.getElementById('tipo-actual');
    const contadorEl   = document.getElementById('contador-bloques');

    const listaPj      = document.getElementById('lista-personajes');
    const listaLoc     = document.getElementById('lista-localizaciones');
    const formPj       = document.getElementById('form-personaje');
    const formLoc      = document.getElementById('form-localizacion');

    /* ---------------- Estado en memoria ---------------- */
    let timerAutosave = null;
    let guardando = false;
    let sucio = false;

    /* ===================== Inicialización ===================== */
    document.addEventListener('DOMContentLoaded', init);

    async function init() {
        try {
            const data = await api(CFG.endpoints.cargar + '?proyecto_id=' + CFG.proyectoId);
            if (data.bloques && data.bloques.length > 0) {
                renderBloques(data.bloques);
            } else {
                renderBloques([{ tipo: 'escena', contenido: '' }]);
            }
            renderPersonajes(data.personajes || []);
            renderLocalizaciones(data.localizaciones || []);
            setEstado('listo', 'Listo');
        } catch (e) {
            console.error(e);
            renderBloques([{ tipo: 'escena', contenido: '' }]);
            setEstado('error', 'Error al cargar');
        }

        registrarEventos();
        focoEnPrimerBloque();
        actualizarUI();
    }

    /* ===================== Render del DOM del editor ===================== */
    function renderBloques(bloques) {
        editor.innerHTML = '';
        const frag = document.createDocumentFragment();
        for (const b of bloques) {
            frag.appendChild(crearBloque(b.tipo || 'accion', b.contenido || ''));
        }
        editor.appendChild(frag);
        marcarVacios();
    }

    function crearBloque(tipo, contenido) {
        const div = document.createElement('div');
        div.className = 'bloque';
        div.setAttribute('data-tipo', tipo);
        div.setAttribute('data-etiqueta', ETIQUETA[tipo] || tipo);
        // Pintar contenido como texto puro: jamás HTML del usuario.
        div.textContent = contenido;
        return div;
    }

    /* ===================== Helpers de selección y bloques ===================== */
    function bloqueActivo() {
        const sel = window.getSelection();
        if (!sel || sel.rangeCount === 0) return null;
        let nodo = sel.anchorNode;
        while (nodo && nodo !== editor) {
            if (nodo.nodeType === 1 && nodo.classList && nodo.classList.contains('bloque')) {
                return nodo;
            }
            nodo = nodo.parentNode;
        }
        return null;
    }

    function colocarCursorAlFinal(bloque) {
        bloque.focus();
        const range = document.createRange();
        range.selectNodeContents(bloque);
        range.collapse(false);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    }

    function focoEnPrimerBloque() {
        const primero = editor.querySelector('.bloque');
        if (primero) colocarCursorAlFinal(primero);
    }

    function cambiarTipo(bloque, nuevoTipo) {
        if (!TIPOS.includes(nuevoTipo)) return;
        bloque.setAttribute('data-tipo', nuevoTipo);
        bloque.setAttribute('data-etiqueta', ETIQUETA[nuevoTipo] || nuevoTipo);
        marcarVacios();
        actualizarUI();
        marcarSucio();
    }

    function insertarBloqueDespues(referencia, tipo) {
        const nuevo = crearBloque(tipo, '');
        referencia.after(nuevo);
        colocarCursorAlFinal(nuevo);
        marcarVacios();
        actualizarUI();
        marcarSucio();
        return nuevo;
    }

    function rotarConTab(actual, retroceso = false) {
        const i = TIPOS.indexOf(actual);
        if (i === -1) return TIPOS[0];
        const n = TIPOS.length;
        const j = retroceso ? (i - 1 + n) % n : (i + 1) % n;
        return TIPOS[j];
    }

    function marcarVacios() {
        const todos = editor.querySelectorAll('.bloque');
        todos.forEach(b => {
            if (b.textContent.trim() === '') {
                b.setAttribute('data-vacio', '1');
            } else {
                b.removeAttribute('data-vacio');
            }
        });
    }

    /* ===================== Eventos ===================== */
    function registrarEventos() {

        // Manejo de Tab/Enter/Backspace.
        editor.addEventListener('keydown', onKeyDown);

        // Garantizar que siempre haya un .bloque envolviendo el cursor.
        editor.addEventListener('input', onInput);

        // Resaltar bloque activo y refrescar UI.
        editor.addEventListener('click', actualizarUI);
        editor.addEventListener('keyup', actualizarUI);

        // Guardado manual.
        btnGuardar.addEventListener('click', guardar);

        // Cambio de título.
        titulo.addEventListener('input', marcarSucio);
        titulo.addEventListener('change', guardar);

        // Atajo Ctrl/Cmd+S.
        document.addEventListener('keydown', (ev) => {
            if ((ev.ctrlKey || ev.metaKey) && ev.key.toLowerCase() === 's') {
                ev.preventDefault();
                guardar();
            }
        });

        // Formularios laterales.
        formPj.addEventListener('submit', onCrearPersonaje);
        formLoc.addEventListener('submit', onCrearLocalizacion);

        // Aviso si se cierra con cambios sin guardar.
        window.addEventListener('beforeunload', (ev) => {
            if (sucio) {
                ev.preventDefault();
                ev.returnValue = '';
            }
        });
    }

    function onKeyDown(ev) {
        // Tab / Shift+Tab → rota tipo de bloque actual.
        if (ev.key === 'Tab') {
            ev.preventDefault();
            const bl = bloqueActivo();
            if (!bl) return;
            const tipoActual = bl.getAttribute('data-tipo') || 'accion';
            const nuevo = rotarConTab(tipoActual, ev.shiftKey);
            cambiarTipo(bl, nuevo);
            colocarCursorAlFinal(bl);
            return;
        }

        // Enter → crea nuevo bloque del tipo "lógico siguiente".
        if (ev.key === 'Enter' && !ev.shiftKey) {
            ev.preventDefault();
            const bl = bloqueActivo();
            if (!bl) return;
            const tipoActual = bl.getAttribute('data-tipo') || 'accion';
            const tipoSiguiente = SIGUIENTE_ENTER[tipoActual] || 'accion';

            // Si el bloque actual está vacío, en vez de crear otro vacío
            // simplemente cambiamos su tipo (comportamiento Celtx-friendly).
            if (bl.textContent.trim() === '') {
                cambiarTipo(bl, tipoSiguiente);
                colocarCursorAlFinal(bl);
            } else {
                insertarBloqueDespues(bl, tipoSiguiente);
            }
            return;
        }

        // Backspace al inicio de un bloque vacío → eliminarlo y subir.
        if (ev.key === 'Backspace') {
            const bl = bloqueActivo();
            if (!bl) return;
            const sel = window.getSelection();
            const enInicio = sel.anchorOffset === 0 && sel.isCollapsed;
            if (enInicio && bl.textContent === '') {
                const previo = bl.previousElementSibling;
                if (previo && previo.classList.contains('bloque')) {
                    ev.preventDefault();
                    bl.remove();
                    colocarCursorAlFinal(previo);
                    marcarVacios();
                    actualizarUI();
                    marcarSucio();
                }
            }
        }
    }

    function onInput() {
        // Si el editor queda vacío, asegurar un bloque base.
        if (editor.children.length === 0) {
            editor.appendChild(crearBloque('accion', ''));
            focoEnPrimerBloque();
        }
        // Si el cursor está dentro de un nodo de texto suelto (no bloque), envolverlo.
        const sel = window.getSelection();
        if (sel && sel.anchorNode && sel.anchorNode.parentNode === editor &&
            sel.anchorNode.nodeType === 3) {
            const texto = sel.anchorNode.textContent;
            sel.anchorNode.remove();
            const bl = crearBloque('accion', texto);
            editor.appendChild(bl);
            colocarCursorAlFinal(bl);
        }
        marcarVacios();
        actualizarUI();
        marcarSucio();
        autosave();
    }

    /* ===================== UI: bloque activo, contador, etc. ===================== */
    function actualizarUI() {
        editor.querySelectorAll('.bloque.activo').forEach(b => b.classList.remove('activo'));
        const bl = bloqueActivo();
        if (bl) {
            bl.classList.add('activo');
            const t = bl.getAttribute('data-tipo') || 'accion';
            tipoActualEl.textContent = ETIQUETA[t] || t;
        } else {
            tipoActualEl.textContent = '—';
        }
        const n = editor.querySelectorAll('.bloque').length;
        contadorEl.textContent = n + ' ' + (n === 1 ? 'bloque' : 'bloques');
    }

    function setEstado(clase, texto) {
        estado.className = 'estado ' + clase;
        estado.textContent = texto;
    }

    function marcarSucio() {
        sucio = true;
        setEstado('', 'Sin guardar');
    }

    /* ===================== Persistencia ===================== */
    function autosave() {
        if (timerAutosave) clearTimeout(timerAutosave);
        timerAutosave = setTimeout(guardar, 1200);
    }

    async function guardar() {
        if (guardando) return;
        guardando = true;
        setEstado('guardando', 'Guardando…');
        try {
            const bloques = [...editor.querySelectorAll('.bloque')].map(b => ({
                tipo:      b.getAttribute('data-tipo') || 'accion',
                contenido: b.textContent,
            }));
            const res = await api(CFG.endpoints.guardar, {
                method: 'POST',
                body: JSON.stringify({
                    proyecto_id: CFG.proyectoId,
                    titulo:      titulo.value,
                    bloques,
                }),
            });
            if (!res.ok) throw new Error(res.error || 'desconocido');
            sucio = false;
            setEstado('guardado', 'Guardado');
            // Refrescar paneles laterales con los detectados.
            await Promise.all([cargarPersonajes(), cargarLocalizaciones()]);
        } catch (e) {
            console.error(e);
            setEstado('error', 'Error al guardar');
        } finally {
            guardando = false;
        }
    }

    /* ===================== Paneles laterales ===================== */
    async function cargarPersonajes() {
        const r = await api(CFG.endpoints.personajes + '?proyecto_id=' + CFG.proyectoId);
        renderPersonajes(r.personajes || []);
    }

    async function cargarLocalizaciones() {
        const r = await api(CFG.endpoints.localizaciones + '?proyecto_id=' + CFG.proyectoId);
        renderLocalizaciones(r.localizaciones || []);
    }

    function renderPersonajes(items) {
        listaPj.innerHTML = '';
        if (items.length === 0) {
            listaPj.innerHTML = '<li class="vacio">Aún no hay personajes.</li>';
            return;
        }
        for (const p of items) {
            const li = document.createElement('li');
            li.innerHTML =
                '<span class="nombre"></span>' +
                '<button class="borrar" title="Eliminar">✕</button>';
            li.querySelector('.nombre').textContent = p.nombre;
            li.querySelector('.borrar').addEventListener('click',
                () => borrarPersonaje(p.id));
            li.addEventListener('dblclick', () => insertarPersonajeEnEditor(p.nombre));
            listaPj.appendChild(li);
        }
    }

    function renderLocalizaciones(items) {
        listaLoc.innerHTML = '';
        if (items.length === 0) {
            listaLoc.innerHTML = '<li class="vacio">Aún no hay localizaciones.</li>';
            return;
        }
        for (const l of items) {
            const li = document.createElement('li');
            li.innerHTML =
                '<span><span class="meta"></span><span class="nombre"></span></span>' +
                '<button class="borrar" title="Eliminar">✕</button>';
            li.querySelector('.meta').textContent = l.tipo + '. ';
            li.querySelector('.nombre').textContent = l.nombre;
            li.querySelector('.borrar').addEventListener('click',
                () => borrarLocalizacion(l.id));
            li.addEventListener('dblclick', () =>
                insertarEscenaEnEditor(l.tipo, l.nombre));
            listaLoc.appendChild(li);
        }
    }

    async function onCrearPersonaje(ev) {
        ev.preventDefault();
        const fd = new FormData(formPj);
        const nombre = (fd.get('nombre') || '').toString().trim();
        if (!nombre) return;
        await api(CFG.endpoints.personajes, {
            method: 'POST',
            body: JSON.stringify({ proyecto_id: CFG.proyectoId, nombre }),
        });
        formPj.reset();
        await cargarPersonajes();
    }

    async function onCrearLocalizacion(ev) {
        ev.preventDefault();
        const fd = new FormData(formLoc);
        const nombre = (fd.get('nombre') || '').toString().trim();
        const tipo   = (fd.get('tipo')   || 'INT').toString();
        if (!nombre) return;
        await api(CFG.endpoints.localizaciones, {
            method: 'POST',
            body: JSON.stringify({ proyecto_id: CFG.proyectoId, nombre, tipo }),
        });
        formLoc.reset();
        await cargarLocalizaciones();
    }

    async function borrarPersonaje(id) {
        if (!confirm('¿Eliminar este personaje?')) return;
        await api(CFG.endpoints.personajes, {
            method: 'DELETE',
            body: JSON.stringify({ proyecto_id: CFG.proyectoId, id }),
        });
        await cargarPersonajes();
    }

    async function borrarLocalizacion(id) {
        if (!confirm('¿Eliminar esta localización?')) return;
        await api(CFG.endpoints.localizaciones, {
            method: 'DELETE',
            body: JSON.stringify({ proyecto_id: CFG.proyectoId, id }),
        });
        await cargarLocalizaciones();
    }

    /* Doble clic en personaje → inserta como bloque PERSONAJE en el editor. */
    function insertarPersonajeEnEditor(nombre) {
        const bl = bloqueActivo() || editor.lastElementChild;
        if (!bl) return;
        const destino = bl.textContent.trim() === ''
            ? bl
            : insertarBloqueDespues(bl, 'personaje');
        cambiarTipo(destino, 'personaje');
        destino.textContent = nombre.toUpperCase();
        colocarCursorAlFinal(destino);
        // crea ya el bloque de diálogo siguiente.
        insertarBloqueDespues(destino, 'dialogo');
        marcarSucio();
        autosave();
    }

    function insertarEscenaEnEditor(tipo, nombre) {
        const bl = bloqueActivo() || editor.lastElementChild;
        if (!bl) return;
        const destino = bl.textContent.trim() === ''
            ? bl
            : insertarBloqueDespues(bl, 'escena');
        cambiarTipo(destino, 'escena');
        destino.textContent = `${tipo}. ${nombre} - DÍA`;
        colocarCursorAlFinal(destino);
        insertarBloqueDespues(destino, 'accion');
        marcarSucio();
        autosave();
    }

    /* ===================== Fetch helper ===================== */
    async function api(url, opts) {
        const final = Object.assign({
            headers: { 'Content-Type': 'application/json' },
        }, opts || {});
        const res = await fetch(url, final);
        if (!res.ok) {
            let msg = 'HTTP ' + res.status;
            try { const j = await res.json(); if (j.error) msg = j.error; } catch (_) { /* noop */ }
            throw new Error(msg);
        }
        return res.json();
    }

})();
