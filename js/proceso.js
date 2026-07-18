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
  const line = timeline.querySelector('.proceso-line');
  const nodes = Array.from(timeline.querySelectorAll('.proceso-node'));
  const steps = Array.from(timeline.querySelectorAll('.proceso-step'));

  // Ajusta la línea para que arranque en el centro del primer nodo
  // y termine en el centro del último.
  function positionLine() {
    if (!line || nodes.length < 2) return;
    const tRect = timeline.getBoundingClientRect();
    const firstRect = nodes[0].getBoundingClientRect();
    const lastRect = nodes[nodes.length - 1].getBoundingClientRect();
    const startY = (firstRect.top + firstRect.height / 2) - tRect.top;
    const endY = (lastRect.top + lastRect.height / 2) - tRect.top;
    line.style.top = startY + 'px';
    line.style.bottom = 'auto';
    line.style.height = (endY - startY) + 'px';
  }

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
    nodes.forEach(function (node, i) {
      const nodeRect = node.getBoundingClientRect();
      const nodeCenter = nodeRect.top + nodeRect.height / 2;
      const active = nodeCenter <= center + 4;
      node.classList.toggle('is-active', active);
      if (steps[i]) steps[i].classList.toggle('is-reached', active);
    });
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  function onResize() {
    positionLine();
    onScroll();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize, { passive: true });
  window.addEventListener('load', positionLine);
  positionLine();
  update();
})();
