/* ============================================================
   HERO SPOTLIGHT — luz bicolor que sigue al cursor (estilo RAVEL)
   Dos glows persiguen al mouse a distinta velocidad:
     --mx  / --my   → celeste (rápido, pegado al cursor) + puntos + wordmark
     --mx2 / --my2  → violeta (lento, rezagado → 2º color en la estela)
   Rastrea el mouse en toda la ventana (incluida la navbar fija).
   ============================================================ */
(function () {
  const hero = document.querySelector('.hero-split');
  const visualPanel = document.querySelector('.hv-panel');
  if (!hero) return;

  const OFF = -9999;
  const EASE_FAST = 0.025;  // violeta (rápido)
  const EASE_SLOW = 0.038; // celeste (lento)
  const EASE_TILT = 0.05; // suavidad inclinación 3D

  let tX = OFF, tY = OFF;   // objetivo (cursor real)
  let fX = OFF, fY = OFF;   // capa rápida (violeta)
  let sX = OFF, sY = OFF;   // capa lenta (celeste)

  // Variables para la inclinación 3D
  let tiltX = 0, tiltY = 0;   // valores actuales
  let targetTiltX = 0, targetTiltY = 0; // valores objetivo

  let active = false;
  let rafId = null;
  let idleTimeout = null;

  // Iniciar fade-in cinematográfico de las luces al cargar
  hero.classList.add('cinematic-ready');
  setTimeout(() => {
    hero.classList.add('cinematic-visible');
  }, 100);

  const resetIdleTimer = function () {
    if (idleTimeout) clearTimeout(idleTimeout);
    hero.classList.remove('lights-idle');

    idleTimeout = setTimeout(() => {
      hero.classList.add('lights-idle');
    }, 2500); // Entra en modo respiración tras 2.5s sin moverse
  };

  const tick = function () {
    // Ease-out pronunciado para el violeta: rápido cuando está lejos, muy lento al llegar
    const dFX = tX - fX;
    const dFY = tY - fY;
    const dist = Math.sqrt(dFX * dFX + dFY * dFY);
    const adaptiveFast = EASE_FAST * Math.min(1 + dist / 180, 3.5);
    fX += dFX * adaptiveFast;
    fY += dFY * adaptiveFast;

    // Centro de la ventana para el celeste (orbes con position:fixed usan coords de viewport)
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const centerX = vw / 2;
    const centerY = vh / 2;

    // Destino del celeste (sTarget) escala un 82%
    const sTargetX = centerX + (tX - centerX) * 0.82;
    const sTargetY = centerY + (tY - centerY) * 0.82;

    sX += (sTargetX - sX) * EASE_SLOW;
    sY += (sTargetY - sY) * EASE_SLOW;

    // Los orbes son position:fixed → usan coordenadas de viewport directamente
    document.documentElement.style.setProperty('--mx', fX + 'px');
    document.documentElement.style.setProperty('--my', fY + 'px');
    document.documentElement.style.setProperty('--mx2', sX + 'px');
    document.documentElement.style.setProperty('--my2', sY + 'px');
    // --mxi/--myi: cursor raw (sin ease) → para el glow del wordmark (reacción instantánea)

    // Inclinación 3D del panel si el cursor está activo
    if (active && visualPanel && tX !== OFF) {
      // Calculamos distancia relativa del cursor al centro en rango [-1, 1]
      const dx = (tX - centerX) / centerX;
      const dy = (tY - centerY) / centerY;

      // Inclinación máxima de 12 grados en Y y 6 en X
      targetTiltY = dx * 12;
      targetTiltX = -dy * 6;
    } else {
      targetTiltX = 0;
      targetTiltY = 0;
    }

    tiltX += (targetTiltX - tiltX) * EASE_TILT;
    tiltY += (targetTiltY - tiltY) * EASE_TILT;

    if (visualPanel) {
      visualPanel.style.setProperty('--rx', tiltX + 'deg');
      visualPanel.style.setProperty('--ry', tiltY + 'deg');
    }

    const settled =
      Math.abs(tX - fX) < 0.5 && Math.abs(tY - fY) < 0.5 &&
      Math.abs(tX - sX) < 0.5 && Math.abs(tY - sY) < 0.5 &&
      Math.abs(targetTiltX - tiltX) < 0.05 && Math.abs(targetTiltY - tiltY) < 0.05;

    if (active || !settled) {
      rafId = requestAnimationFrame(tick);
    } else {
      rafId = null;
    }
  };

  const ensureRunning = function () {
    if (!rafId) rafId = requestAnimationFrame(tick);
  };

  // Rastrear el mouse — coordenadas de VENTANA (globales entre secciones)
  window.addEventListener('pointermove', function (e) {
    // Coordenadas globales del cursor en la ventana
    const cx = e.clientX;
    const cy = e.clientY;

    // Para la máscara del wordmark (usa posición relativa al hero)
    const r = hero.getBoundingClientRect();
    const hx = cx - r.left;
    const hy = cy - r.top;
    hero.style.setProperty('--mxi', hx + 'px');
    hero.style.setProperty('--myi', hy + 'px');

    // tX/tY en coordenadas de ventana para los orbes globales
    tX = cx;
    tY = cy;

    if (!active) {
      fX = sX = tX;
      fY = sY = tY;
    }

    active = true;
    resetIdleTimer();
    ensureRunning();
  }, { passive: true });

  // Apagar cuando el cursor sale
  document.addEventListener('mouseleave', function () {
    active = false;
    tX = OFF; tY = OFF;
    resetIdleTimer();
    ensureRunning();
  });

  const about = document.querySelector('#sobre-nosotros');

  // Oscurecer suavemente el hero y la sección sobre nosotros en scroll
  window.addEventListener('scroll', function () {
    const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;

    // 1. Hero fade
    const heroHeight = hero.offsetHeight || 800;
    const heroOpacity = Math.max(0, 1 - (scrollY / (heroHeight * 0.75)));
    hero.style.opacity = heroOpacity.toFixed(3);

    // 2. Sobre Nosotros fade (se va oscureciendo a medida que se desplaza hacia arriba fuera de la pantalla)
    if (about) {
      const rect = about.getBoundingClientRect();
      const aboutHeight = rect.height || 600;
      if (rect.top < 0) {
        const opacity = Math.max(0, 1 - (Math.abs(rect.top) / (aboutHeight * 0.75)));
        about.style.opacity = opacity.toFixed(3);
      } else {
        about.style.opacity = '1.000';
      }
    }
  }, { passive: true });
})();
