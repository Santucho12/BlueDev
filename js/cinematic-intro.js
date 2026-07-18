/* ============================================================
   INTRO CINEMATOGRÁFICA — orquestación de tiempos
   Replica el CinematicIntro de MENDO / ConsurWhite:
   - fondo con blur
   - el logo se revela con un wipe de izquierda a derecha
   - obliga a estar en el TOP del hero mientras corre
   - el contenido del hero (menos el fondo/foto) aparece al terminar
   Corre en cada carga de la página.
   ============================================================ */
(function () {
  const overlay = document.getElementById('cinematic-intro');
  if (!overlay) return;

  // Bloquear scroll y clavar el scroll arriba mientras corre la intro
  document.documentElement.classList.add('intro-active');
  document.body.classList.add('intro-active');
  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual';
  }
  const forceTop = function () { window.scrollTo(0, 0); };
  forceTop();
  window.addEventListener('load', forceTop);
  // Reforzar el top durante toda la intro (por si el navegador restaura scroll)
  window.addEventListener('scroll', forceTop, { passive: false });

  // Detener Lenis (scroll suave) si ya existe
  const stopLenis = function () {
    if (window.__lenis && typeof window.__lenis.stop === 'function') {
      window.__lenis.scrollTo(0, { immediate: true });
      window.__lenis.stop();
    }
  };
  const startLenis = function () {
    if (window.__lenis && typeof window.__lenis.start === 'function') {
      window.__lenis.start();
    }
  };
  stopLenis();

  // Doble rAF: pintar el estado oculto primero y luego disparar el wipe
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      overlay.classList.add('revealed');
    });
  });

  // Fade-out del overlay
  const tExit = setTimeout(function () {
    overlay.classList.add('exiting');
  }, 2100);

  // Fin de la intro visual: quitar overlay y revelar el contenido del hero
  const tDone = setTimeout(function () {
    overlay.classList.add('done');
    document.documentElement.classList.add('intro-done'); // dispara la entrada del hero
  }, 2600);

  // Bloqueo de scroll: se mantiene 1,3 s DESPUÉS de terminar la intro cinematográfica
  const tUnlock = setTimeout(function () {
    window.removeEventListener('scroll', forceTop, { passive: false });
    document.documentElement.classList.remove('intro-active');
    document.body.classList.remove('intro-active');
    startLenis();
  }, 2600 + 1300);

  window.addEventListener('pagehide', function () {
    clearTimeout(tExit);
    clearTimeout(tDone);
    clearTimeout(tUnlock);
  });
})();
