# Diseño: Paleta unificada 4+4

**Fecha:** 2026-07-17
**Estado:** Aprobado por el usuario

## Objetivo

Reducir todos los colores del sitio a exactamente **4 colores base + 4 secundarios**
(la variante hover/efecto de cada base), más una única excepción funcional para
WhatsApp. Toda transparencia se deriva de esos mismos pigmentos vía
`rgba(var(--x-rgb), alfa)` y no cuenta como color nuevo.

## Decisiones tomadas (con el usuario)

1. **Los 4 base:** Celeste, Navy, Blanco, Negro (la identidad actual del sitio).
2. **Verde WhatsApp:** queda como *excepción funcional* fuera de la paleta
   (marca de tercero, reconocible = más clics). Cubre también el estado "online".
3. **Hover del celeste:** hacia más oscuro (`#1a9fd4`), comportamiento clásico
   de botón.
4. **Enfoque A (estricto):** solo 8 pigmentos reales + alfas. Sin `color-mix`,
   sin renombrados cosméticos. Se aceptan cambios visuales sutiles.

## La paleta

| Color | Base | Secundario (hover/efecto) | Canal RGB |
|---|---|---|---|
| Celeste | `#2abaf3` | `#1a9fd4` (celeste-2) | `--celeste-rgb` / `--celeste-2-rgb` |
| Navy | `#152945` | `#0b1523` (navy-2) | `--navy-rgb` / `--navy-2-rgb` |
| Blanco | `#ffffff` | blanco al 65% (blanco-2, texto secundario) | `--white-rgb` |
| Negro | `#0a0a0a` | `#111111` (negro-2, superficies elevadas) | `--black-rgb` / `--black-2-rgb` |

**Excepción funcional (bloque separado y comentado en el theme):**
WhatsApp `#25d366`, hover `#128c7e` (`--whatsapp-rgb`).

Se conservan los nombres de canal ya referenciados en todo el sitio
(`--white-rgb`, `--black-rgb`, `--celeste-rgb`); se agregan
`--celeste-2-rgb`, `--navy-rgb`, `--navy-2-rgb`, `--black-2-rgb`.

## Mapa de reasignación

| Valor actual | Nuevo valor |
|---|---|
| Grises `#6b7280`, `#9ca3af`, `#888888`, `#94a3b8` | texto secundario/muted → blanco al 65%; detalles sutiles (SVGs, labels chicos) → blanco al 50% |
| Celeste claro `#60d5fa` (`--gradient-shine`, brillo del título) | brillo con blanco: celeste → blanco → celeste |
| Azul profundo `#1a6fd1` (`--gradient-primary`) | celeste → celeste-2 |
| Navy accent `#0a47a1` (feature-dot "Soporte 24/7" en index.html) | celeste |
| Verde online `#00e676` | verde WhatsApp `#25d366` |
| Superficies form `#181818`, `#101214`, `#1a1d22`, `#222222` | negro-2 y blanco con alfa |
| Fondos `#050505` (`--bg-section-dark`), `#080808` (`--bg-section-alt`) | negro `#0a0a0a` |
| Sección clara `#fbfbfd` / textos `#1d1d1f`, `#424245`, `#86868b` | blanco de fondo / negro y negro con alfa (75% / 55%) |
| `--border-light: rgba(0,51,102,.1)` | navy con alfa |
| `--navy-overlay-rgb: 10,20,40` | navy-2 con alfa |
| Sombras `rgba(0,0,0,x)` (`--black-rgb` actual) | canal del negro `10,10,10` (visualmente idéntico) |

Canales que mueren: `--blue-deep-rgb`, `--navy-border-rgb`, `--surface-rgb`,
`--surface-elevated-rgb`, `--section-dark-rgb`, `--navy-overlay-rgb`.

## Alcance

- **`style/global/themeSystem.css`**: reescritura de la sección de pigmentos +
  actualización de la capa semántica. Las variables semánticas
  (`--text-secondary`, `--color-surface`, `--gradient-primary`, etc.)
  **conservan su nombre**; solo cambia su valor interno.
- **Regla de nombres:** las variables con nombre de *pigmento* que ya no
  existe **mueren** y sus usos externos se actualizan (~9 referencias):
  `--color-azul`, `--color-gray-mid`, `--color-gray-light`,
  `--color-celeste-light`, `--color-blue-deep`, `--color-navy-accent`,
  `--color-online`. Las variables con nombre *semántico*
  (`--color-surface-input`, `--color-surface-form`,
  `--color-surface-form-light`, `--border-dark`, `--bg-light`,
  `--text-on-light*`, `--text-muted`, etc.) se conservan redefinidas
  sobre la paleta; sus usos externos no se tocan. `--color-gray` y
  `--color-gray-light` mueren también (0–1 usos externos).
  Los tokens de la sección clara (`--bg-light`, `--text-on-light*`) se
  conservan como capa semántica, redefinidos para apuntar a pigmentos de
  la paleta (blanco / negro con alfa); no se tocan sus usos externos.
- **`js/globe.js`**: sin cambios (lee `--color-celeste`, `--color-white`,
  `--white-rgb`, que siguen existiendo).

## Verificación

1. Grep: cero colores crudos (hex/rgb/rgba numéricos) fuera de `themeSystem.css`.
2. Grep: cero `var(--x)` sin definir (excluyendo runtime: `--aos-delay`,
   `--mouse-x`, `--mouse-y`).
3. En `themeSystem.css`: exactamente 8 pigmentos de paleta + 2 de WhatsApp.
4. Revisión visual del usuario. Cambios perceptibles esperados:
   gradiente de botones (pierde el azul profundo), brillo del título
   (blanco en vez de celeste claro), fondo de servicios apenas más blanco,
   formularios apenas más oscuros, dot "Soporte 24/7" celeste.

## Fuera de alcance

- Cambiar los valores hex de los 4 colores elegidos (re-teñir la marca).
- Tema claro/oscuro alternativo.
- Tocar dependencias de `node_modules`.
