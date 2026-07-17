# Diseño: Rebrand BlueDev → Vestra

**Fecha:** 2026-07-17
**Estado:** Aprobado por el usuario

## Objetivo

Renombrar la agencia de **BlueDev** a **Vestra** en todo el sitio: logo, wordmark,
textos, emails y comentarios. El color de marca (celeste) **no cambia** en esta
iteración — el re-teñido a violeta se evaluará por separado.

## Decisiones tomadas (con el usuario)

1. **Logo:** usar el PNG nuevo tal cual (fondo gris sólido incluido), con
   `border-radius` para que se vea como tile prolijo sobre el navy.
2. **Wordmark:** "V" celeste + "estra" blanco (`<span class="highlight">V</span>estra`).
3. **Subtítulo** "SOFTWARE DEVELOPMENT": se elimina de navbar y footer.
4. **Emails:** `@bluedev.com` → `@vestra.com`, unificados en `contacto@vestra.com`
   (hoy el link dice `info@` y el texto `contacto@` — se corrige a uno solo).
5. **Favicon:** ya existe (apunta al logo viejo); se actualiza al logo nuevo.
6. **Color de marca:** fuera de alcance (se verá después).

## Cambios concretos

### Assets
- Renombrar `images/ChatGPT Image 17 jul 2026, 01_29_13.png` →
  `images/logo-vestra.png` (el nombre con espacios/comas rompe URLs).
- Eliminar `images/logo-icon.svg` (632 B) tras quitar sus 3 referencias.

### `index.html`
| Línea | Antes | Después |
|---|---|---|
| 6 | `<link rel="icon" type="image/svg+xml" href="images/logo-icon.svg">` | `type="image/png"` + `href="images/logo-vestra.png"` |
| 8 | `<title>BlueDev — Desarrollo de Software Premium</title>` | `Vestra — Desarrollo de Software Premium` |
| 45 | `<img src="images/logo-icon.svg" alt="BlueDev Logo" ...>` | `logo-vestra.png` + `alt="Vestra Logo"` |
| 47-48 | `Blue<span class="highlight">Dev</span>` + subtítulo | `<span class="highlight">V</span>estra`, sin `.logo-subtitle` |
| 297 | `En <strong>BlueDev</strong> desarrollamos` | `En <strong>Vestra</strong> desarrollamos` |
| 687 | `En BlueDev construimos activos` | `En Vestra construimos activos` |
| 838 | `<img src="images/logo-icon.svg" alt="BlueDev Logo" ...>` | `logo-vestra.png` + `alt="Vestra Logo"` |
| 841-842 | `Blue<span class="highlight">Dev</span>` + subtítulo | `<span class="highlight">V</span>estra`, sin `.logo-subtitle` |
| 848 | `href="mailto:info@bluedev.com"` | `mailto:contacto@vestra.com` |
| 854 | `<span>contacto@bluedev.com</span>` | `contacto@vestra.com` |
| 912 | `© 2025 BlueDev.` | `© 2025 Vestra.` |

### Comentarios (sin efecto visual, por consistencia)
- `js/globe.js:2`: `BlueDev - 3D Holographic Globe` → `Vestra - ...`
- `style/footer.css:50`: comentario que menciona "BlueDev y SOFTWARE DEVELOPMENT"
  → actualizar a "Vestra" (el subtítulo ya no existe; el comentario se ajusta).

## Fuera de alcance

- Re-teñir el sitio del celeste al violeta del logo.
- Renombrar la carpeta/repositorio `BlueDev`.
- Conseguir una versión con fondo transparente del logo (se usa el PNG tal cual).
- Registrar el dominio `vestra.com` (los emails son de presentación).
- La línea duplicada `<link ... map.css>` (index.html:19-20) — bug preexistente,
  no relacionado con el rebrand.

## Verificación

1. `grep -ri 'bluedev\|blue dev' index.html style/ js/` → cero resultados.
2. `grep -rn 'logo-icon.svg'` → cero resultados; el archivo ya no existe.
3. Revisión visual: navbar y footer muestran el logo nuevo + "Vestra",
   sin subtítulo; título de pestaña y favicon actualizados.
