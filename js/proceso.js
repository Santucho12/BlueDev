/* ============================================================
   PROCESO / TIMELINE — efectos de scroll (vanilla)
   Replica el comportamiento de ClientWorkflow (ConsurWhite):
   - línea de progreso que se rellena de arriba a abajo con el scroll
   - nodos que se "activan" cuando el progreso los alcanza
   - contenido zigzag con fade-in al entrar en viewport
   ============================================================ */
(function () {
  const timeline = document.getElementById('procesoTimeline');
  if (!timeline) return;

  const progress = document.getElementById('procesoLineProgress');
  const nodes = Array.from(timeline.querySelectorAll('.proceso-node'));
  const steps = Array.from(timeline.querySelectorAll('.proceso-step'));

  // Fade-in del contenido por paso
  const io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25, rootMargin: '0px 0px -8% 0px' });
  steps.forEach(function (s) { io.observe(s); });

  // Progreso de la línea + activación de nodos, atado al scroll
  let ticking = false;

  function update() {
    ticking = false;
    const rect = timeline.getBoundingClientRect();
    const vh = window.innerHeight;

    // Progreso: 0 cuando el top del timeline llega al centro del viewport,
    // 1 cuando el bottom llega al centro. (mismo criterio start/end center de la ref)
    const center = vh / 2;
    const total = rect.height;
    let p = (center - rect.top) / total;
    p = Math.max(0, Math.min(1, p));

    progress.style.transform = 'scaleY(' + p + ')';

    // Activar nodos cuya posición vertical ya fue alcanzada por el progreso
    nodes.forEach(function (node) {
      const nodeRect = node.getBoundingClientRect();
      const nodeCenter = nodeRect.top + nodeRect.height / 2;
      if (nodeCenter <= center + 4) {
        node.classList.add('is-active');
      } else {
        node.classList.remove('is-active');
      }
    });
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();
})();
