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

  // ── Light follow effect for cards ───
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
