# Paleta Unificada 4+4 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reducir todos los colores del sitio a exactamente 4 base + 4 secundarios (celeste, navy, blanco, negro) con el verde WhatsApp como única excepción funcional.

**Architecture:** `style/global/themeSystem.css` es la única fuente de verdad de color. Se reescribe su sección de pigmentos (7 canales RGB de paleta + 1 de WhatsApp) y su capa semántica. Durante la migración se mantiene un bloque temporal de alias deprecados para que el sitio nunca quede roto entre commits; al final se elimina.

**Tech Stack:** CSS vanilla (custom properties), HTML estático, sin framework ni test runner — la verificación es por grep y revisión visual.

**Spec:** `docs/superpowers/specs/2026-07-17-paleta-unificada-design.md`

## Global Constraints

- Los únicos pigmentos permitidos: `#2abaf3`, `#1a9fd4`, `#152945`, `#0b1523`, `#ffffff`, `#0a0a0a`, `#111111` + excepción WhatsApp `#25d366` (canal `37, 211, 102`) y `#128c7e`.
- Toda transparencia se escribe `rgba(var(--x-rgb), alfa)` sobre esos canales. Sin `color-mix`.
- Cero valores de color crudos (hex / rgb / rgba numéricos) fuera de `themeSystem.css`.
- Las variables semánticas existentes (`--text-secondary`, `--color-surface*`, `--bg-*`, `--gradient-*`, `--glass-*`, `--shadow-*`, `--border-*`, `--text-on-light*`) conservan su nombre; solo cambia su valor.
- No cambiar los hex de los 4 colores elegidos. No tocar `js/globe.js` ni `node_modules/`.
- Shell de los comandos: Git Bash desde la raíz del repo.

---

### Task 1: Reescribir la paleta en themeSystem.css (con alias temporales)

**Files:**
- Modify: `style/global/themeSystem.css` (todo el bloque desde el comentario de cabecera hasta la sección SOMBRAS/GRADIENTES inclusive; ESPACIADO y TRANSICIONES quedan intactos)

**Interfaces:**
- Produces: canales `--celeste-rgb`, `--celeste-2-rgb`, `--navy-rgb`, `--navy-2-rgb`, `--white-rgb`, `--black-rgb`, `--black-2-rgb`, `--whatsapp-rgb`; colores `--color-celeste`, `--color-celeste-2`, `--color-navy`, `--color-navy-2`, `--color-white`, `--color-white-2`, `--color-black`, `--color-black-2`, `--color-whatsapp`, `--color-whatsapp-dark`; toda la capa semántica actual redefinida. Task 2 dependerá de `--color-celeste-2`, `--color-white-2`, `--black-rgb`, `--black-2-rgb`, `--bg-overlay-navy`, `--color-whatsapp`.

- [ ] **Step 1: Ver el estado "en rojo" (pigmentos actuales)**

Run:
```bash
grep -oE '#[0-9a-fA-F]{6}\b' style/global/themeSystem.css | sort -u | wc -l
```
Expected: `20` (muchos más que los 8 permitidos; este número baja a 8 al final de la task)

- [ ] **Step 2: Reemplazar la cabecera y todo `:root` hasta GRADIENTES inclusive**

Reemplazar desde la línea 1 hasta la línea del cierre de GRADIENTES (la línea `  --gradient-text: ...`) por el bloque siguiente. Las secciones ESPACIADO Y TAMAÑOS y TRANSICIONES que siguen quedan exactamente como están.

```css
/**
 * THEME SYSTEM - Software Factory Landing Page
 * Premium Design System with glassmorphism, mesh gradients, and glow effects
 *
 * ÚNICA FUENTE DE VERDAD DE COLOR — PALETA 4+4
 * El sitio usa exactamente 4 colores base + 4 secundarios (hover/efecto):
 *   CELESTE  --color-celeste  /  --color-celeste-2 (hover)
 *   NAVY     --color-navy     /  --color-navy-2    (profundidad de fondo)
 *   BLANCO   --color-white    /  --color-white-2   (texto secundario, 65%)
 *   NEGRO    --color-black    /  --color-black-2   (superficie elevada)
 * Única excepción: verde WhatsApp (marca de tercero, bloque propio).
 * Toda transparencia se deriva de los canales: rgba(var(--x-rgb), alfa).
 * Ningún otro archivo del proyecto debe contener valores de color crudos.
 */

/* Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Poppins:wght@300;400;500;600;700;800;900&display=swap');

:root {
  /* ========================================
     PALETA 4+4 — CANALES RGB
     Únicos pigmentos del sitio. Cambiarlos re-tiñe toda la web.
     ======================================== */
  --celeste-rgb: 42, 186, 243;    /* CELESTE base    #2abaf3 */
  --celeste-2-rgb: 26, 159, 212;  /* celeste hover   #1a9fd4 */
  --navy-rgb: 21, 41, 69;         /* NAVY base       #152945 */
  --navy-2-rgb: 11, 21, 35;       /* navy profundo   #0b1523 */
  --white-rgb: 255, 255, 255;     /* BLANCO          #ffffff */
  --black-rgb: 10, 10, 10;        /* NEGRO base      #0a0a0a */
  --black-2-rgb: 17, 17, 17;      /* negro elevado   #111111 */

  /* ========================================
     PALETA 4+4 — COLORES
     ======================================== */
  --color-celeste: rgb(var(--celeste-rgb));
  --color-celeste-2: rgb(var(--celeste-2-rgb));
  --color-navy: rgb(var(--navy-rgb));
  --color-navy-2: rgb(var(--navy-2-rgb));
  --color-white: rgb(var(--white-rgb));
  --color-white-2: rgba(var(--white-rgb), 0.65);
  --color-black: rgb(var(--black-rgb));
  --color-black-2: rgb(var(--black-2-rgb));

  /* ========================================
     EXCEPCIÓN FUNCIONAL — WhatsApp (marca de tercero)
     Fuera de la paleta a propósito: el verde oficial es
     reconocible al instante. Cubre también el estado "online".
     ======================================== */
  --whatsapp-rgb: 37, 211, 102;
  --color-whatsapp: rgb(var(--whatsapp-rgb));
  --color-whatsapp-dark: #128c7e; /* hover del botón WA */

  /* ========================================
     CAPA SEMÁNTICA — todo apunta a la paleta
     ======================================== */

  /* Fondos */
  --bg-primary: var(--color-white);
  --bg-secondary: var(--color-white-2);
  --bg-accent: var(--color-celeste);
  --bg-black: var(--color-black);
  --bg-section-dark: var(--color-black);
  --bg-section-alt: var(--color-black);
  --bg-section-navy: radial-gradient(ellipse at center, var(--color-navy) 0%, var(--color-navy-2) 100%);
  --bg-overlay-navy: rgba(var(--navy-2-rgb), 0.4);

  /* Sección clara (servicios) */
  --bg-light: var(--color-white);
  --text-on-light: var(--color-black);
  --text-on-light-secondary: rgba(var(--black-rgb), 0.75);
  --text-on-light-muted: rgba(var(--black-rgb), 0.55);

  /* Superficies y formularios */
  --color-surface: var(--color-black);
  --color-surface-elevated: var(--color-black-2);
  --color-surface-card: rgba(var(--black-2-rgb), 0.7);
  --color-surface-input: var(--color-black-2);
  --color-surface-form: var(--color-black);
  --color-surface-form-light: var(--color-black-2);
  --border-dark: rgba(var(--white-rgb), 0.08);

  /* Glass effect */
  --glass-bg: rgba(var(--white-rgb), 0.03);
  --glass-border: rgba(var(--white-rgb), 0.08);
  --glass-blur: blur(20px);

  /* Acentos celeste */
  --color-cyan-glow: rgba(var(--celeste-rgb), 0.15);
  --color-cyan-soft: rgba(var(--celeste-rgb), 0.08);
  --color-border-subtle: rgba(var(--white-rgb), 0.06);
  --color-border-hover: rgba(var(--celeste-rgb), 0.4);

  /* Textos */
  --text-primary: var(--color-black);
  --text-secondary: var(--color-white-2);
  --text-celeste: var(--color-celeste);
  --text-white: var(--color-white);
  --text-muted: var(--color-white-2);

  /* Bordes */
  --border-light: rgba(var(--navy-rgb), 0.12);
  --border-accent: var(--color-celeste);

  /* Sombras (canal del negro) */
  --shadow-sm: 0 5px 20px rgba(var(--black-rgb), 0.2);
  --shadow-md: 0 10px 40px rgba(var(--black-rgb), 0.3);
  --shadow-lg: 0 20px 60px rgba(var(--black-rgb), 0.4);
  --shadow-celeste: 0 0 30px rgba(var(--celeste-rgb), 0.15);
  --shadow-glow: 0 0 40px rgba(var(--celeste-rgb), 0.2), 0 0 80px rgba(var(--celeste-rgb), 0.05);

  /* Gradientes */
  --gradient-primary: linear-gradient(135deg, var(--color-celeste) 0%, var(--color-celeste-2) 100%);
  --gradient-accent: linear-gradient(135deg, var(--color-celeste-2) 0%, var(--color-celeste) 100%);
  --gradient-shine: linear-gradient(135deg, var(--color-celeste) 0%, var(--color-white) 50%, var(--color-celeste) 100%);
  --gradient-whatsapp: linear-gradient(135deg, var(--color-whatsapp) 0%, var(--color-whatsapp-dark) 100%);
  --gradient-soft: linear-gradient(180deg, var(--color-surface) 0%, rgba(var(--celeste-rgb), 0.04) 100%);
  --gradient-mesh: radial-gradient(ellipse at 20% 50%, rgba(var(--celeste-rgb), 0.06) 0%, transparent 50%),
                   radial-gradient(ellipse at 80% 20%, rgba(var(--celeste-2-rgb), 0.04) 0%, transparent 50%),
                   radial-gradient(ellipse at 50% 80%, rgba(var(--celeste-rgb), 0.03) 0%, transparent 50%);
  --gradient-section-divider: linear-gradient(90deg, transparent, rgba(var(--celeste-rgb), 0.2), transparent);
  --gradient-text: linear-gradient(135deg, var(--color-white) 0%, var(--color-celeste) 100%);

  /* ========================================
     ALIAS DEPRECADOS — TEMPORAL
     Solo para que el sitio no se rompa durante la migración.
     La Task 3 elimina este bloque completo.
     ======================================== */
  --color-gray: var(--color-white-2);
  --color-gray-light: var(--color-white-2);
  --color-gray-mid: rgba(var(--white-rgb), 0.5);
  --color-azul: var(--color-white-2);
  --color-celeste-light: var(--color-celeste-2);
  --color-celeste-dark: var(--color-celeste-2);
  --color-blue-deep: var(--color-celeste-2);
  --color-navy-accent: var(--color-celeste);
  --color-online: var(--color-whatsapp);
  --color-navy-dark: var(--color-navy-2);
  --surface-rgb: var(--black-rgb);
  --surface-elevated-rgb: var(--black-2-rgb);
  --section-dark-rgb: var(--black-rgb);
  --navy-overlay-rgb: var(--navy-2-rgb);
```

Nota: después de este bloque siguen las secciones `ESPACIADO Y TAMAÑOS` y `TRANSICIONES` tal como están hoy, y el `}` de cierre de `:root`. Los canales viejos `--blue-deep-rgb` y `--navy-border-rgb` NO se conservan ni siquiera como alias (nada externo los usa).

- [ ] **Step 3: Verificar pigmentos**

Run:
```bash
grep -oE '#[0-9a-fA-F]{6}\b' style/global/themeSystem.css | sort -u
```
Expected — exactamente estas 8 líneas (7 aparecen en comentarios de canal + el hex real de WhatsApp dark):
```
#0a0a0a
#0b1523
#111111
#128c7e
#152945
#1a9fd4
#2abaf3
#ffffff
```

Run:
```bash
grep -cE '^\s*--[a-z0-9-]+-rgb:\s*[0-9]' style/global/themeSystem.css
```
Expected: `8` (7 de paleta + WhatsApp; los alias `--surface-rgb: var(...)` no matchean porque no empiezan con dígito)

- [ ] **Step 4: Verificar que no quedaron variables sin definir**

Run:
```bash
grep -rhoE 'var\(--[a-zA-Z0-9-]+' style/ index.html js/ | sed 's/var(//' | sort -u > /tmp/used.txt
grep -hoE '^\s*--[a-zA-Z0-9-]+' style/global/themeSystem.css | tr -d ' ' | sort -u > /tmp/defined.txt
comm -23 /tmp/used.txt /tmp/defined.txt
```
Expected — solo variables de runtime (no son colores):
```
--aos-delay
--mouse-x
--mouse-y
--x-rgb
```
(`--x-rgb` es un falso positivo: aparece en un comentario del theme)

- [ ] **Step 5: Commit**

```bash
git add style/global/themeSystem.css
git commit -m "Paleta 4+4: reescribir pigmentos y capa semántica del theme

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 2: Migrar las 16 referencias externas a variables deprecadas

**Files:**
- Modify: `index.html:268,271,520,544`
- Modify: `style/portfolio.css:154,245,336,351,427`
- Modify: `style/navbar.css:23,80,208`
- Modify: `style/contact.css:234`
- Modify: `style/global/styles.css:117`
- Modify: `style/faq.css:65`
- Modify: `style/map.css:115`

**Interfaces:**
- Consumes: `--color-celeste-2`, `--color-white-2`, `--black-rgb`, `--black-2-rgb`, `--bg-overlay-navy`, `--color-whatsapp`, `--color-celeste`, `--white-rgb` (Task 1)
- Produces: cero usos externos de los alias deprecados (precondición de Task 3)

- [ ] **Step 1: Ver el estado "en rojo" (usos externos de alias)**

Run:
```bash
grep -rnE 'var\(--(color-(gray|gray-light|gray-mid|azul|celeste-light|celeste-dark|blue-deep|navy-accent|online|navy-dark))\)|--(surface-rgb|surface-elevated-rgb|section-dark-rgb|navy-overlay-rgb)' style/ index.html js/ --include='*.css' --include='*.html' --include='*.js' | grep -v themeSystem
```
Expected: 16 líneas (las listadas en Files)

- [ ] **Step 2: Aplicar los 16 reemplazos**

Cada línea muestra ANTES → DESPUÉS (solo cambia el fragmento de color):

`index.html:268`
```html
style="background: var(--color-online);"
→ style="background: var(--color-whatsapp);"
```

`index.html:271`
```html
style="background: var(--color-navy-accent);"
→ style="background: var(--color-celeste);"
```

`index.html:520` y `index.html:544` (dos SVG idénticos de candado NDA)
```html
style="stroke: var(--color-gray-mid); margin-right:7px;"
→ style="stroke: rgba(var(--white-rgb), 0.5); margin-right:7px;"
```

`style/portfolio.css:245` (hover del link — hover de celeste = celeste-2)
```css
.portfolio-link:hover {
  color: var(--color-celeste-light);
→ color: var(--color-celeste-2);
```

`style/portfolio.css:336` (orb decorativo difuminado)
```css
background: var(--color-blue-deep);
→ background: var(--color-celeste-2);
```

`style/portfolio.css:154`
```css
background: linear-gradient(to top, rgba(var(--surface-elevated-rgb), 1), transparent);
→ background: linear-gradient(to top, rgba(var(--black-2-rgb), 1), transparent);
```

`style/portfolio.css:351`
```css
background: rgba(var(--surface-rgb), 0.4);
→ background: rgba(var(--black-rgb), 0.4);
```

`style/portfolio.css:427` (los DOS stops de la misma línea)
```css
background: linear-gradient(rgba(var(--section-dark-rgb), 0.8), rgba(var(--section-dark-rgb), 0.8)) padding-box,
→ background: linear-gradient(rgba(var(--black-rgb), 0.8), rgba(var(--black-rgb), 0.8)) padding-box,
```

`style/navbar.css:80` (subtítulo del logo — texto secundario)
```css
color: var(--color-azul); /* Matching user reference */
→ color: var(--color-white-2);
```

`style/navbar.css:23`
```css
background: rgba(var(--section-dark-rgb), 0.85);
→ background: rgba(var(--black-rgb), 0.85);
```

`style/navbar.css:208`
```css
background: rgba(var(--surface-rgb), 0.98);
→ background: rgba(var(--black-rgb), 0.98);
```

`style/contact.css:234` (borde de input en focus — detalle sutil, blanco 50%)
```css
border-color: var(--color-azul);
→ border-color: rgba(var(--white-rgb), 0.5);
```

`style/global/styles.css:117` (subtítulo de sección — texto secundario)
```css
color: var(--color-gray-light);
→ color: var(--color-white-2);
```

`style/faq.css:65`
```css
background: rgba(var(--surface-rgb), 0.4);
→ background: rgba(var(--black-rgb), 0.4);
```

`style/map.css:115` (ya existe el token semántico exacto)
```css
background: rgba(var(--navy-overlay-rgb), 0.4);
→ background: var(--bg-overlay-navy);
```

- [ ] **Step 3: Verificar que no queda ningún uso externo**

Run (el mismo comando del Step 1):
```bash
grep -rnE 'var\(--(color-(gray|gray-light|gray-mid|azul|celeste-light|celeste-dark|blue-deep|navy-accent|online|navy-dark))\)|--(surface-rgb|surface-elevated-rgb|section-dark-rgb|navy-overlay-rgb)' style/ index.html js/ --include='*.css' --include='*.html' --include='*.js' | grep -v themeSystem
```
Expected: sin salida (exit code 1)

- [ ] **Step 4: Commit**

```bash
git add index.html style/portfolio.css style/navbar.css style/contact.css style/global/styles.css style/faq.css style/map.css
git commit -m "Paleta 4+4: migrar referencias externas a los tokens nuevos

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 3: Eliminar alias deprecados y verificación final

**Files:**
- Modify: `style/global/themeSystem.css` (borrar el bloque ALIAS DEPRECADOS completo)

**Interfaces:**
- Consumes: cero usos externos de alias (Task 2)
- Produces: theme final con exactamente 8 pigmentos + excepción WhatsApp

- [ ] **Step 1: Borrar el bloque ALIAS DEPRECADOS**

Eliminar desde el comentario `/* ========================================\n     ALIAS DEPRECADOS — TEMPORAL` hasta la línea `--navy-overlay-rgb: var(--navy-2-rgb);` inclusive (14 variables + el comentario de sección).

- [ ] **Step 2: Verificación 1 — cero colores crudos fuera del theme**

Run:
```bash
grep -rnE '#[0-9a-fA-F]{3,8}\b|rgba?\(\s*[0-9]' style/ index.html --include='*.css' --include='*.html' | grep -v themeSystem
```
Expected: sin salida (exit code 1)

- [ ] **Step 3: Verificación 2 — cero variables sin definir**

Run:
```bash
grep -rhoE 'var\(--[a-zA-Z0-9-]+' style/ index.html js/ | sed 's/var(//' | sort -u > /tmp/used.txt
grep -hoE '^\s*--[a-zA-Z0-9-]+' style/global/themeSystem.css | tr -d ' ' | sort -u > /tmp/defined.txt
comm -23 /tmp/used.txt /tmp/defined.txt
```
Expected — solo runtime:
```
--aos-delay
--mouse-x
--mouse-y
--x-rgb
```

- [ ] **Step 4: Verificación 3 — exactamente 8 pigmentos + WhatsApp**

Run:
```bash
grep -oE '#[0-9a-fA-F]{6}\b' style/global/themeSystem.css | sort -u
```
Expected: las mismas 8 líneas de Task 1 Step 3 (`#0a0a0a #0b1523 #111111 #128c7e #152945 #1a9fd4 #2abaf3 #ffffff`).

Run:
```bash
grep -c 'DEPRECADOS' style/global/themeSystem.css
```
Expected: `0`

- [ ] **Step 5: Revisión visual**

Abrir `index.html` en el navegador (doble clic o live server) y verificar los cambios esperados del spec:
- Gradiente de botones: celeste → celeste oscuro (ya no azul profundo)
- Brillo del título del hero: blanco (ya no celeste claro)
- Sección servicios: fondo blanco puro
- Formularios de contacto: apenas más oscuros
- Dot "Soporte 24/7": celeste
- Dot "+28 Proyectos": verde WhatsApp
- Botón WhatsApp flotante: sigue verde oficial

- [ ] **Step 6: Commit final**

```bash
git add style/global/themeSystem.css
git commit -m "Paleta 4+4: eliminar alias deprecados — migración completa

El sitio usa exactamente 4 colores base + 4 secundarios (celeste, navy,
blanco, negro) + verde WhatsApp como excepción funcional.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```
