// ========================================
// Software Factory — Main Script (Enhanced UX)
// ========================================

document.addEventListener('DOMContentLoaded', function () {

  // ── Mobile Menu Toggle (improved) ─────
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

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

      let extraOffset = 10;
      if (targetId === 'sobre-nosotros') extraOffset = 0;
      if (targetId === 'servicios') extraOffset = window.innerWidth <= 768 ? 100 : 120;
      if (targetId === 'portfolio' && this.closest('.navbar')) extraOffset = 20;

      const y = target.getBoundingClientRect().top + window.pageYOffset - navH - extraOffset;

      // Smooth easing scroll
      const startY = window.pageYOffset;
      const diff = y - startY;
      const duration = 900;
      let startTime = null;

      function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
      }

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        window.scrollTo(0, startY + diff * easeOutCubic(progress));
        if (progress < 1) window.requestAnimationFrame(step);
      }

      window.requestAnimationFrame(step);
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

  // ── Hero service selector (mobile editorial mode) ───────
  const heroCardsContainer = document.querySelector('.hero-services-cards');
  if (heroCardsContainer) {
    const heroCards = Array.from(heroCardsContainer.querySelectorAll('.hero-service-card'));
    let activeHeroCardIndex = 0;
    let selectorContainer = document.querySelector('.hero-service-selector');
    const selectorButtons = [];

    function isMobileViewport() {
      return window.innerWidth <= 768;
    }

    function buildHeroServiceSelector() {
      if (selectorContainer || !heroCardsContainer.parentNode) return;

      selectorContainer = document.createElement('div');
      selectorContainer.className = 'hero-service-selector';

      heroCards.forEach(function (card, index) {
        const title = (card.querySelector('h4') && card.querySelector('h4').textContent
          ? card.querySelector('h4').textContent.trim()
          : 'Servicio ' + (index + 1));

        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'hero-service-slot';
        button.textContent = title;
        button.setAttribute('aria-label', 'Ver ' + title);
        button.addEventListener('click', function () {
          activeHeroCardIndex = index;
          setActiveHeroCard(activeHeroCardIndex);
        });

        selectorButtons.push(button);
        selectorContainer.appendChild(button);
      });

      heroCardsContainer.parentNode.insertBefore(selectorContainer, heroCardsContainer);
    }

    function syncHeroCardsMode() {
      if (heroCards.length === 0) return;

      if (isMobileViewport()) {
        buildHeroServiceSelector();
        heroCardsContainer.classList.add('is-selector-mobile');
        if (selectorContainer) {
          selectorContainer.classList.add('is-visible');
        }
        if (!heroCards.some(function (card) { return card.classList.contains('is-active'); })) {
          activeHeroCardIndex = 0;
          setActiveHeroCard(activeHeroCardIndex);
        }
        return;
      }

      heroCardsContainer.classList.remove('is-selector-mobile');
      if (selectorContainer) {
        selectorContainer.classList.remove('is-visible');
      }
      heroCards.forEach(function (card) {
        card.classList.remove('is-active');
        card.removeAttribute('hidden');
      });
      selectorButtons.forEach(function (button) {
        button.classList.remove('is-active');
      });
    }

    function setActiveHeroCard(index) {
      heroCards.forEach(function (card, cardIndex) {
        const isActive = cardIndex === index;
        card.classList.toggle('is-active', isActive);
        if (isMobileViewport()) {
          if (isActive) {
            card.removeAttribute('hidden');
          } else {
            card.setAttribute('hidden', 'hidden');
          }
        }
      });

      selectorButtons.forEach(function (button, buttonIndex) {
        button.classList.toggle('is-active', buttonIndex === index);
      });
    }

    syncHeroCardsMode();
    window.addEventListener('resize', syncHeroCardsMode, { passive: true });
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

  console.log('🚀 Software Factory — Enhanced UX Loaded');
});
