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
      smoothTouch: true,
      wheelMultiplier: 0.65, // Reduced for less aggressive scroll impulse
      touchMultiplier: 0.8,
      normalizeWheel: true,
    });

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

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        window.scrollTo(0, y);
        return;
      }

      if (lenis) {
        lenis.scrollTo(y, {
          duration: 1.4,
          easing: function (t) {
            return 1 - Math.pow(1 - t, 4);
          },
        });
        return;
      }

      window.scrollTo({ top: y, behavior: 'smooth' });
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
      // Create horizontal scroll timeline
      let tl = gsap.to(hSections, {
        xPercent: -100 * (hSections.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: horizontalContainer,
          pin: true,
          scrub: 2.5,
          end: () => "+=" + (horizontalWrapper.offsetWidth * 1.5)
        }
      });

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

  console.log('🚀 Software Factory — Enhanced UX Loaded');
});
