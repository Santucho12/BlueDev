// ========================================
// Software Factory — Main Script (Enhanced UX)
// ========================================

document.addEventListener('DOMContentLoaded', function () {

  const hasGsap = typeof window.gsap !== 'undefined';
  const hasScrollTrigger = typeof window.ScrollTrigger !== 'undefined';
  const hasLenis = typeof window.Lenis !== 'undefined';
  let lenis = null;

  // ── Mobile Menu Toggle (improved) ─────
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-right');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      navLinks.classList.toggle('active');
      menuToggle.classList.toggle('active');
    });

    // Close on link click
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
      });
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.navbar')) {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
      }
    });
  }

  // ── Premium Smooth Scroll (Lenis + GSAP ticker) ─────
  if (hasGsap && hasScrollTrigger) {
    window.gsap.registerPlugin(window.ScrollTrigger);
    window.ScrollTrigger.config({ ignoreMobileResize: true });
  }

  if (hasLenis) {
    lenis = new window.Lenis({
      duration: 2.2, // Increased from 1.25 for slower scroll
      lerp: 0.045,   // Decreased from 0.085 for more inertia
      smoothWheel: true,
      syncTouch: true, // en Lenis 1.1.x la opción es syncTouch, no smoothTouch
      wheelMultiplier: 0.65, // Reduced for less aggressive scroll impulse
      touchMultiplier: 0.8,
      normalizeWheel: true,
    });
    window.__lenis = lenis; // expuesto para la intro cinematográfica

    if (hasGsap) {
      window.gsap.ticker.add(function (time) {
        lenis.raf(time * 1000);
      });
      window.gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        lenis.raf(time);
        window.requestAnimationFrame(raf);
      }
      window.requestAnimationFrame(raf);
    }

    if (hasScrollTrigger) {
      lenis.on('scroll', function () {
        window.ScrollTrigger.update();
      });
    }

    // ── Teclado: flechas, PageUp/Down, Espacio, Home/End con scroll SUAVE ──
    // Lenis solo suaviza la rueda/trackpad; el teclado lo maneja el navegador (salto seco).
    // Interceptamos las teclas de scroll y las pasamos por Lenis.
    const smoothEase = function (t) { return 1 - Math.pow(1 - t, 4); };
    window.addEventListener('keydown', function (e) {
      // No secuestrar el teclado cuando se escribe en un campo
      const tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : '';
      if (tag === 'input' || tag === 'textarea' || tag === 'select' || (e.target && e.target.isContentEditable)) {
        return;
      }
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      const viewport = window.innerHeight;
      const maxY = document.documentElement.scrollHeight - viewport;
      const current = window.pageYOffset;
      const lineStep = 90;      // flechas ↑/↓
      const pageStep = viewport * 0.9; // PageUp/Down y Espacio
      let destY = null;

      switch (e.key) {
        case 'ArrowDown':  destY = current + lineStep; break;
        case 'ArrowUp':    destY = current - lineStep; break;
        case 'PageDown':   destY = current + pageStep; break;
        case 'PageUp':     destY = current - pageStep; break;
        case ' ':          destY = current + (e.shiftKey ? -pageStep : pageStep); break; // Espacio / Shift+Espacio
        case 'Home':       destY = 0; break;
        case 'End':        destY = maxY; break;
        default: return;
      }

      e.preventDefault();
      destY = Math.max(0, Math.min(maxY, destY));
      if (typeof lenis.start === 'function') lenis.start();
      lenis.scrollTo(destY, { duration: 0.8, easing: smoothEase });
    }, { passive: false });

    // ── Barra de scroll (arrastre) ──
    // Al arrastrar la barra, el navegador mueve el scroll de forma nativa. Lenis, en su raf,
    // sigue interpolando hacia SU target interno y "pelea" contra el arrastre → se traba.
    // Solución segura: mientras se arrastra la barra, sincronizamos el target de Lenis con
    // la posición nativa usando lenis.resize()/sync sin disparar scrollTo animados.
    // IMPORTANTE: NO llamamos scrollTo dentro del evento 'scroll' (rompe cualquier animación
    // en curso, incl. la de los links del menú). Solo actuamos entre mousedown y mouseup.
    let draggingBar = false;
    let dragRAF = null;

    const isOnScrollbar = function (e) {
      // La scrollbar vertical vive a la derecha del ancho útil (clientWidth).
      return e.clientX >= document.documentElement.clientWidth - 2;
    };

    const syncLenisToNative = function () {
      // Pega la posición interna de Lenis a la del navegador, sin animar.
      if (lenis) {
        if (typeof lenis.scrollTo === 'function') {
          lenis.scrollTo(window.pageYOffset, { immediate: true });
        }
      }
    };

    const dragLoop = function () {
      if (!draggingBar) return;
      syncLenisToNative();
      dragRAF = requestAnimationFrame(dragLoop);
    };

    window.addEventListener('mousedown', function (e) {
      if (e.button === 0 && isOnScrollbar(e)) {
        draggingBar = true;
        dragLoop(); // seguir la barra 1:1 mientras se arrastra (no se traba)
      }
    }, { passive: true });

    window.addEventListener('mouseup', function () {
      if (!draggingBar) return;
      draggingBar = false;
      if (dragRAF) cancelAnimationFrame(dragRAF);
      syncLenisToNative(); // dejar Lenis sincronizado donde se soltó
    }, { passive: true });
  }

  // ── Navbar scroll style (enhanced) ────
  const navbar = document.querySelector('.navbar');
  let lastScroll = 0;

  if (navbar) {
    window.addEventListener('scroll', function () {
      const currentScroll = window.pageYOffset;

      if (currentScroll > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }

      lastScroll = currentScroll;
    }, { passive: true });
  }

  // ── Smooth scroll with navbar offset ──
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href.length <= 1) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();

      const navH = navbar ? navbar.offsetHeight : 0;
      const targetId = href.slice(1);
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // Lenis pudo quedar DETENIDO por la intro (scrollTo entonces salta en seco). Reactivarlo.
      // (NO refrescamos ScrollTrigger acá: hacerlo en cada click interrumpe el scroll en curso
      //  y provoca el bug de "hay que clickear 2-3 veces". El refresh se hace 1 sola vez al load.)
      if (lenis && typeof lenis.start === 'function') lenis.start();

      // Margen de aire entre la navbar y el título de la sección de destino.
      const gap = 28;

      // Calcular el Y ABSOLUTO de destino de forma robusta (no dependemos de la posición
      // visual del elemento, que el pin de GSAP falsea). Un Y numérico fijo hace que el
      // primer click siempre llegue al mismo lugar → sin necesidad de reclickear.
      let destY;
      const hCont = window.__horizontalContainer;
      const hST = window.__horizontalST;
      if (hCont && hST && hCont.contains(target)) {
        // Target dentro del scroll horizontal pinneado → usar el inicio real del pin.
        // El pin fija la sección en el top del viewport cuando scrollY == hST.start, pero
        // el badge/título está algo más abajo por el padding interno. Restamos esa distancia
        // (badge respecto al top del contenedor) para dejar el título cómodo bajo la navbar.
        const badge = target.querySelector('[class*="badge"], .section-title, h2');
        let innerOffset = 0;
        if (badge) {
          innerOffset = badge.getBoundingClientRect().top - hCont.getBoundingClientRect().top;
        }
        destY = hST.start + innerOffset - navH - gap;
      } else {
        // Las secciones tienen padding vertical grande (p.ej. 180px), así que apuntar al
        // borde de la <section> deja el TÍTULO muy abajo con un hueco vacío arriba. En su
        // lugar apuntamos al primer contenido real (badge o, si no hay, el título) para
        // dejarlo cómodo bajo la navbar. Buscamos en orden de prioridad (no de documento).
        let anchorEl = null;
        const sels = [
          '.about-badge', '.services-badge', '.proceso-badge', '.cta-badge',
          '.section-title', 'h2', 'h1'
        ];
        for (let i = 0; i < sels.length && !anchorEl; i++) {
          anchorEl = target.querySelector(sels[i]);
        }
        anchorEl = anchorEl || target;
        // offsetTop acumulado = posición de LAYOUT (ignora los transforms de las animaciones
        // de entrada AOS). getBoundingClientRect incluiría ese transform y el badge quedaría
        // descolgado, porque el elemento se mueve cuando su animación se dispara al llegar.
        let y = 0;
        let node = anchorEl;
        while (node && node !== document.body) {
          y += node.offsetTop || 0;
          node = node.offsetParent;
        }
        destY = y - navH - gap;
      }
      destY = Math.max(0, destY);

      if (targetId === 'inicio') destY = 0;

      // "Comenzar Proyecto" (navbar, hero, como trabajamos, etc.) → SALTO DIRECTO al último
      // CTA (#comenzar), sin scroll animado. Es el único link que teletransporta.
      if (targetId === 'comenzar') {
        if (lenis && typeof lenis.scrollTo === 'function') {
          lenis.scrollTo(destY, { immediate: true });
        } else {
          window.scrollTo(0, destY);
        }
        return;
      }

      // Si el usuario YA está por debajo del inicio de "Servicios", un scroll suave desde
      // tan lejos tardaría mucho → mejor salto DIRECTO (instantáneo) a la sección clickeada.
      // Arriba de Servicios (hero / sobre nosotros) se mantiene la animación suave.
      const serviciosEl = document.getElementById('servicios');
      if (serviciosEl) {
        let serviciosY = 0;
        let sn = serviciosEl;
        while (sn && sn !== document.body) { serviciosY += sn.offsetTop || 0; sn = sn.offsetParent; }
        // margen: consideramos "por debajo" cuando ya pasamos el borde superior de Servicios.
        if (window.pageYOffset >= serviciosY - navH - 4) {
          if (lenis && typeof lenis.scrollTo === 'function') {
            lenis.scrollTo(destY, { immediate: true });
          } else {
            window.scrollTo(0, destY);
          }
          return;
        }
      }

      // El scroll suave de la navegación es una decisión de diseño (no es una animación
      // "decorativa" que reduced-motion deba anular con un salto en seco). Con reduced-motion
      // solo lo hacemos MÁS RÁPIDO, pero seguimos animando para que nunca teletransporte.
      const dur = reduceMotion ? 1.2 : 2.2;
      const ease = function (t) { return 1 - Math.pow(1 - t, 4); };

      if (lenis) {
        lenis.scrollTo(destY, { duration: dur, easing: ease });
        return;
      }
      // Fallback sin Lenis: animación manual con rAF (window.scrollTo({behavior:'smooth'})
      // es ignorado por muchos navegadores cuando reduced-motion está activo).
      const startY = window.pageYOffset;
      const dist = destY - startY;
      const t0 = performance.now();
      const durMs = dur * 1000;
      const step = function (now) {
        const p = Math.min(1, (now - t0) / durMs);
        window.scrollTo(0, startY + dist * ease(p));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  });

  // ── Intersection Observer for AOS ─────
  const observerOptions = {
    threshold: 0.08,
    rootMargin: '0px 0px -60px 0px',
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const delay = entry.target.getAttribute('data-delay') || 0;
        setTimeout(function () {
          entry.target.classList.add('aos-animate');
        }, parseInt(delay));
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('[data-aos]').forEach(function (el) {
    observer.observe(el);
  });

  // ── Auto Reveal + Parallax with ScrollTrigger ─────
  if (hasGsap && hasScrollTrigger) {
    const revealElements = Array.from(document.querySelectorAll('.reveal, .fade-up'));
    revealElements.forEach(function (element) {
      const isFadeUp = element.classList.contains('fade-up');
      window.gsap.fromTo(element,
        {
          y: isFadeUp ? 42 : 26,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1.05,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 88%',
            once: true,
          },
        }
      );
    });

    const parallaxElements = Array.from(document.querySelectorAll('.parallax'));
    parallaxElements.forEach(function (element) {
      const speedValue = parseFloat(element.getAttribute('data-speed') || '0.14');
      const triggerElement = element.closest('section') || element;
      window.gsap.to(element, {
        y: function () {
          return window.innerHeight * speedValue;
        },
        ease: 'none',
        scrollTrigger: {
          trigger: triggerElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2,
        },
      });
    });

    window.ScrollTrigger.refresh();
  }

  // ── Hero word animation (enhanced) ────
  const heroVideo = document.getElementById('hero-bg-video');
  if (heroVideo) {
    heroVideo.playbackRate = 0.8;
  }

  const animatedTitle = document.getElementById('animated-title');
  if (animatedTitle) {
    const words = ['Sistemas internos ', 'Automatizaciones ', 'Sitios web '];
    let idx = 0;
    animatedTitle.style.transition = 'opacity 0.45s cubic-bezier(.4,0,.2,1), transform 0.45s cubic-bezier(.4,0,.2,1)';

    function animateWord() {
      animatedTitle.style.opacity = '0';
      animatedTitle.style.transform = 'translateY(18px)';
      setTimeout(function () {
        animatedTitle.textContent = words[idx];
        animatedTitle.style.opacity = '1';
        animatedTitle.style.transform = 'translateY(0)';
        idx = (idx + 1) % words.length;
      }, 450);
    }

    setTimeout(function () {
      setInterval(animateWord, 2800);
    }, 600);
  }

  // ── Hero cards mobile layout (static bento 2+1) ───────
  const heroCardsContainer = document.querySelector('.hero-services-cards');
  if (heroCardsContainer) {
    heroCardsContainer.classList.remove('is-carousel-mobile');
    heroCardsContainer.querySelectorAll('.hero-service-card').forEach(function (card) {
      card.classList.remove('is-active');
    });

    const indicatorsContainer = document.querySelector('.hero-carousel-indicators');
    if (indicatorsContainer) {
      indicatorsContainer.remove();
    }
  }

  // ── Light follow effect for cards ───
  const serviceCards = Array.from(document.querySelectorAll('.service-card-new'));
  if (serviceCards.length) {
    let ticking = false;

    function updateServiceReadingCard() {
      const viewportCenter = window.innerHeight * 0.5;
      let bestCard = null;
      let bestDistance = Number.POSITIVE_INFINITY;

      serviceCards.forEach(function (card) {
        const rect = card.getBoundingClientRect();
        const isVisible = rect.bottom > window.innerHeight * 0.18 && rect.top < window.innerHeight * 0.82;

        if (!isVisible) return;

        const cardCenter = rect.top + (rect.height / 2);
        const distance = Math.abs(cardCenter - viewportCenter);
        if (distance < bestDistance) {
          bestDistance = distance;
          bestCard = card;
        }
      });

      serviceCards.forEach(function (card) {
        card.classList.toggle('is-reading', card === bestCard);
      });
    }

    function requestServiceCardUpdate() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        updateServiceReadingCard();
        ticking = false;
      });
    }

    updateServiceReadingCard();
    window.addEventListener('scroll', requestServiceCardUpdate, { passive: true });
    window.addEventListener('resize', requestServiceCardUpdate, { passive: true });
  }

  const portfolioCards = Array.from(document.querySelectorAll('.portfolio-item'));
  if (portfolioCards.length) {
    let portfolioTicking = false;

    function updatePortfolioReadingCard() {
      const viewportCenter = window.innerHeight * 0.5;
      let bestCard = null;
      let bestDistance = Number.POSITIVE_INFINITY;

      portfolioCards.forEach(function (card) {
        const rect = card.getBoundingClientRect();
        const isVisible = rect.bottom > window.innerHeight * 0.16 && rect.top < window.innerHeight * 0.84;

        if (!isVisible) return;

        const cardCenter = rect.top + (rect.height / 2);
        const distance = Math.abs(cardCenter - viewportCenter);

        if (distance < bestDistance) {
          bestDistance = distance;
          bestCard = card;
        }
      });

      portfolioCards.forEach(function (card) {
        card.classList.toggle('is-reading', card === bestCard);
      });
    }

    function requestPortfolioCardUpdate() {
      if (portfolioTicking) return;
      portfolioTicking = true;
      window.requestAnimationFrame(function () {
        updatePortfolioReadingCard();
        portfolioTicking = false;
      });
    }

    updatePortfolioReadingCard();
    window.addEventListener('scroll', requestPortfolioCardUpdate, { passive: true });
    window.addEventListener('resize', requestPortfolioCardUpdate, { passive: true });
  }

  document.querySelectorAll('.about-stat-card, .about-info-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mouse-x', `${x}%`);
      card.style.setProperty('--mouse-y', `${y}%`);
    });
  });

  // ── Portfolio item micro-interaction ───

  // ── Counter animation for stats (Only Projects) ───────
  const counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const el = entry.target;
        const text = el.textContent.trim();
        const num = parseInt(text);
        if (!isNaN(num) && num > 0) {
          const suffix = text.replace(String(num), '');
          let current = 0;
          const increment = num / 45;
          const timer = setInterval(function () {
            current += increment;
            if (current >= num) {
              el.textContent = num + suffix;
              clearInterval(timer);
            } else {
              el.textContent = Math.floor(current) + suffix;
            }
          }, 25);
        }
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-proyectos .about-stat-number').forEach(function (el) {
    counterObserver.observe(el);
  });

  // ── Dynamic footer year ───────────────
  const yearSpan = document.getElementById('footer-year');
  if (yearSpan) {
    yearSpan.innerHTML = '&copy; ' + new Date().getFullYear();
  }

  // ── Parallax on hero shapes ───────────
  window.addEventListener('scroll', function () {
    const scrolled = window.pageYOffset;
    document.querySelectorAll('.shape').forEach(function (shape, index) {
      const speed = (index + 1) * 0.08;
      shape.style.transform = 'translateY(' + (scrolled * speed) + 'px)';
    });
  }, { passive: true });

  // ── FAQ Accordion Logic ────────────────
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close all other items
        faqItems.forEach(otherItem => {
          otherItem.classList.remove('active');
        });

        // Toggle current item
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });

  // ── Horizontal Scroll Sections (L-Shape) ──
  if (hasGsap && hasScrollTrigger) {
    const horizontalContainer = document.getElementById('horizontal-scroll-container');
    const horizontalWrapper = document.getElementById('horizontal-scroll-wrapper');
    const hSections = gsap.utils.toArray('.h-section');

    if (horizontalContainer && horizontalWrapper && hSections.length > 0) {
      // Create horizontal scroll timeline — scrub:1 para scroll liviano y natural
      // Distancia real = ancho total del contenido menos una pantalla (soporta secciones de anchos distintos)
      const getScrollDistance = () => horizontalWrapper.scrollWidth - window.innerWidth;

      // Colchones inicial y final: la sección queda quieta y completa antes/después
      // del desplazamiento horizontal → la transición vertical↔lateral es muy suave.
      const startDelay = 120;
      const endDelay = 120;

      let tl = gsap.timeline({
        scrollTrigger: {
          trigger: horizontalContainer,
          pin: true,
          scrub: 1.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          start: "top top",
          end: () => "+=" + (getScrollDistance() * 0.42 + startDelay + endDelay)
        }
      });

      // Exponer el ScrollTrigger + el contenedor para que el smooth-scroll del menú
      // sepa a qué scroll-Y saltar cuando el target está DENTRO del pin horizontal
      // (getBoundingClientRect da la posición visual del pin, no el scroll real → salto/doble-click).
      window.__horizontalST = tl.scrollTrigger;
      window.__horizontalContainer = horizontalContainer;

      // Colchón inicial (quieto) → desplazamiento horizontal con easing suave → colchón final (quieto)
      const total = () => getScrollDistance() * 0.42 + startDelay + endDelay;
      tl.to(horizontalWrapper, { duration: startDelay / total(), x: 0, ease: "none" })
        .to(horizontalWrapper, { duration: 1 - (startDelay + endDelay) / total(), x: () => -getScrollDistance(), ease: "power1.inOut" })
        .to(horizontalWrapper, { duration: endDelay / total(), x: () => -getScrollDistance(), ease: "none" });

      // Handle AOS animations inside the horizontal sections
      hSections.forEach(section => {
        const aosElements = Array.from(section.querySelectorAll('[data-aos]'));
        aosElements.forEach(el => {
          const delay = parseInt(el.getAttribute('data-delay') || '0');
          const isFadeUp = el.classList.contains('fade-up') || el.getAttribute('data-aos') === 'fade-up';
          
          gsap.fromTo(el,
            { 
              opacity: 0, 
              y: isFadeUp ? 40 : 0,
              x: el.getAttribute('data-aos') === 'fade-right' ? -40 : (el.getAttribute('data-aos') === 'fade-left' ? 40 : 0),
              scale: el.getAttribute('data-aos') === 'zoom-in' ? 0.9 : 1
            },
            {
              opacity: 1,
              y: 0,
              x: 0,
              scale: 1,
              duration: 0.8,
              delay: delay / 1000,
              ease: "power3.out",
              scrollTrigger: {
                trigger: el,
                containerAnimation: tl,
                start: "left 85%",
                toggleActions: "play none none none"
              }
            }
          );
          
          // Disable standard AOS for these elements to avoid conflicts
          el.removeAttribute('data-aos');
        });
      });
    }
  }

  // "Sobre Nosotros": badge, título, descripción y cada check aparecen de a uno
  // en cascada suave (misma animación para todo el bloque, de arriba hacia abajo).
  const aboutLeft = document.querySelector('.about-content-left');
  if (aboutLeft) {
    const aboutRevealItems = Array.from(
      aboutLeft.querySelectorAll('.about-reveal, .about-list-modern li')
    );
    if (aboutRevealItems.length) {
      const aboutRevealObserver = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            aboutRevealItems.forEach(function (el, i) {
              setTimeout(function () { el.classList.add('is-in'); }, i * 150);
            });
            obs.disconnect();
          }
        });
      }, { threshold: 0.2, rootMargin: '0px 0px -10% 0px' });
      aboutRevealObserver.observe(aboutRevealItems[0]);
    }
  }

  // ── Refresh ÚNICO de ScrollTrigger tras estabilizar el layout ──
  // El pin del scroll horizontal define su .start (que usan los links del menú). Fuentes,
  // imágenes y la intro cambian la altura del documento; refrescamos cuando todo cargó
  // para que hST.start sea correcto desde el primer click (y NO en cada click).
  if (hasGsap && hasScrollTrigger) {
    const refreshST = function () {
      if (window.ScrollTrigger && typeof window.ScrollTrigger.refresh === 'function') {
        window.ScrollTrigger.refresh();
      }
    };
    window.addEventListener('load', function () {
      refreshST();
      // Reintento tras la intro cinematográfica (que altera el layout unos segundos).
      setTimeout(refreshST, 4200);
    });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(refreshST);
    }
  }

  console.log('🚀 Software Factory — Enhanced UX Loaded');
});
