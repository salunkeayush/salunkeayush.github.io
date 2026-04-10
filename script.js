/* ============================================
   PORTFOLIO — Full Animation Engine
   ============================================ */

(function () {
  'use strict';

  // ── Wait for GSAP ──────────────────────────────────────────────────────────
  function whenGSAPReady(cb) {
    if (window.gsap && window.ScrollTrigger) {
      cb();
    } else {
      document.addEventListener('DOMContentLoaded', function check() {
        const wait = setInterval(() => {
          if (window.gsap && window.ScrollTrigger) {
            clearInterval(wait);
            cb();
          }
        }, 50);
      });
    }
  }

  // ── Custom Cursor ──────────────────────────────────────────────────────────
  function initCursor() {
    const cursor = document.getElementById('cursor');
    if (!cursor || window.matchMedia('(hover: none)').matches) return;

    const dot  = cursor.querySelector('.cursor-dot');
    const ring = cursor.querySelector('.cursor-ring');

    let mx = -100, my = -100;
    let rx = -100, ry = -100;

    document.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.left  = mx + 'px';
      dot.style.top   = my + 'px';
    });

    // Ring lags behind with lerp
    (function lerp() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(lerp);
    })();

    // Hover state
    document.addEventListener('mouseover', (e) => {
      const el = e.target.closest('a, button, .magnetic, .tilt-card, .skill-pill, .project-row');
      cursor.classList.toggle('hovering', !!el);
    });

    document.addEventListener('mousedown', () => cursor.classList.add('clicking'));
    document.addEventListener('mouseup',   () => cursor.classList.remove('clicking'));
    document.addEventListener('mouseleave', () => { mx = -100; my = -100; });
  }

  // ── Particle Canvas ────────────────────────────────────────────────────────
  function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W, H, particles;

    function resize() {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }

    function makeParticle() {
      return {
        x:    Math.random() * W,
        y:    Math.random() * H,
        r:    Math.random() * 1.5 + 0.3,
        dx:   (Math.random() - 0.5) * 0.4,
        dy:   (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.5 + 0.1,
        pulse: Math.random() * Math.PI * 2,
      };
    }

    function initParticleList() {
      particles = Array.from({ length: 80 }, makeParticle);
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        p.pulse += 0.02;
        const a = p.alpha * (0.6 + 0.4 * Math.sin(p.pulse));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(110,86,255,${a})`;
        ctx.fill();

        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;
      });
      requestAnimationFrame(draw);
    }

    window.addEventListener('resize', () => { resize(); initParticleList(); });
    resize();
    initParticleList();
    draw();
  }

  // ── Loader ─────────────────────────────────────────────────────────────────
  function initLoader(onDone) {
    const loader  = document.getElementById('loader');
    const chars   = loader ? loader.querySelectorAll('.loader-char') : [];
    const barFill = document.getElementById('loader-bar-fill');

    if (!loader) { onDone(); return; }

    // Animate chars in
    gsap.to(chars, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.08,
      ease: 'power3.out',
    });

    // Progress bar
    let progress = 0;
    const interval = setInterval(() => {
      progress = Math.min(progress + Math.random() * 18, 100);
      if (barFill) barFill.style.width = progress + '%';
      if (progress >= 100) {
        clearInterval(interval);
        // Fade out loader
        setTimeout(() => {
          gsap.to(loader, {
            opacity: 0,
            duration: 0.7,
            ease: 'power2.inOut',
            onComplete: () => {
              loader.style.display = 'none';
              onDone();
            }
          });
        }, 300);
      }
    }, 80);
  }

  // ── Hero Entrance ──────────────────────────────────────────────────────────
  function initHeroAnimations() {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.to('.hero-label', { opacity: 1, duration: 0.8 }, 0.1)
      .to('.hero-name-word', {
        opacity: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.12,
      }, 0.3)
      .to('.hero-tagline', { opacity: 1, y: 0, duration: 0.7 }, 0.6)
      .to('.hero-metrics',  { opacity: 1, y: 0, duration: 0.7 }, 0.75)
      .to('.hero-scroll',   { opacity: 1, duration: 0.6 }, 0.95);

    // Metric counters
    document.querySelectorAll('.metric[data-count]').forEach(m => {
      const numEl  = m.querySelector('.metric-number');
      const target = parseInt(m.dataset.count, 10);
      gsap.to({ val: 0 }, {
        val: target,
        duration: 2,
        delay: 1.2,
        ease: 'power2.out',
        onUpdate: function () {
          numEl.textContent = Math.round(this.targets()[0].val);
        }
      });
    });
  }

  // ── ScrollTrigger Reveals ──────────────────────────────────────────────────
  function initScrollReveals() {
    gsap.registerPlugin(ScrollTrigger);

    // Text split reveal for headings with class reveal-text
    document.querySelectorAll('.reveal-text').forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
          }
        }
      );
    });

    // Fade-up elements
    document.querySelectorAll('.reveal-up').forEach((el, i) => {
      gsap.fromTo(el,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: (i % 3) * 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none',
          }
        }
      );
    });

    // Section labels
    document.querySelectorAll('.section-label').forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
          }
        }
      );
    });

    // GPA bars
    document.querySelectorAll('.edu-gpa-fill').forEach(bar => {
      const pct = parseFloat(bar.dataset.gpa) || 0;
      gsap.fromTo(bar,
        { width: '0%' },
        {
          width: pct + '%',
          duration: 1.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: bar,
            start: 'top 90%',
          }
        }
      );
    });

    // About cards stagger
    gsap.fromTo('.about-card',
      { opacity: 0, y: 40, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.about-cards',
          start: 'top 80%',
        }
      }
    );

    // Skill groups
    gsap.fromTo('.skill-group',
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.skills-grid',
          start: 'top 80%',
        }
      }
    );

    // Project rows
    gsap.fromTo('.project-row',
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.projects-list',
          start: 'top 80%',
        }
      }
    );

    // Education cards
    gsap.fromTo('.edu-card',
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.edu-cards',
          start: 'top 80%',
        }
      }
    );

    // Contact heading
    gsap.fromTo('.contact-heading',
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.contact-heading',
          start: 'top 85%',
        }
      }
    );

    // Contact links stagger
    gsap.fromTo('.contact-link',
      { opacity: 0, x: -30 },
      {
        opacity: 1,
        x: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.contact-links',
          start: 'top 85%',
        }
      }
    );
  }

  // ── Experience Horizontal Scroll ───────────────────────────────────────────
  function initHorizontalScroll() {
    const wrapper = document.querySelector('.experience-track-wrapper');
    const track   = document.getElementById('experience-track');
    if (!wrapper || !track) return;

    const cards = track.querySelectorAll('.exp-card');
    if (!cards.length) return;

    // Reveal exp cards on approach
    gsap.fromTo(cards,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.experience',
          start: 'top 75%',
        }
      }
    );

    // Horizontal scrub: pin section and slide the track
    gsap.to(track, {
      x: () => -(track.scrollWidth - wrapper.clientWidth) - 48,
      ease: 'none',
      scrollTrigger: {
        trigger: '.experience',
        start: 'top top',
        end: () => `+=${track.scrollWidth - wrapper.clientWidth + 48}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      }
    });
  }

  // ── Tilt Effect ────────────────────────────────────────────────────────────
  function initTilt() {
    document.querySelectorAll('.tilt-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width  / 2;
        const cy = rect.top  + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width  / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);
        gsap.to(card, {
          rotateY:  dx * 8,
          rotateX: -dy * 8,
          duration: 0.4,
          ease: 'power2.out',
          transformPerspective: 800,
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.6,
          ease: 'elastic.out(1, 0.6)',
        });
      });
    });
  }

  // ── Magnetic Elements ──────────────────────────────────────────────────────
  function initMagnetic() {
    document.querySelectorAll('.magnetic').forEach(el => {
      const strength = parseFloat(el.dataset.strength) || 15;

      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width  / 2;
        const cy = rect.top  + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width  / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);
        gsap.to(el, {
          x: dx * strength,
          y: dy * strength,
          duration: 0.4,
          ease: 'power2.out',
        });
      });

      el.addEventListener('mouseleave', () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
      });
    });
  }

  // ── Navigation ─────────────────────────────────────────────────────────────
  function initNav() {
    const nav     = document.getElementById('nav');
    const navMenu = document.getElementById('nav-menu');
    const overlay = document.getElementById('menu-overlay');

    // Scroll blur
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 50);
    });

    // Mobile menu toggle
    if (navMenu && overlay) {
      navMenu.addEventListener('click', () => {
        const isOpen = overlay.classList.toggle('open');
        navMenu.classList.toggle('active', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
      });

      overlay.querySelectorAll('.menu-link').forEach(link => {
        link.addEventListener('click', () => {
          overlay.classList.remove('open');
          navMenu.classList.remove('active');
          document.body.style.overflow = '';
        });
      });
    }

    // Active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY + 120;
      sections.forEach(section => {
        const top    = section.offsetTop;
        const height = section.offsetHeight;
        const id     = section.getAttribute('id');
        const link   = document.querySelector(`.nav-links a[href="#${id}"]`);
        if (link) {
          link.style.color = (scrollY >= top && scrollY < top + height)
            ? 'var(--accent-light)'
            : '';
        }
      });
    });
  }

  // ── Marquee Pause on Hover ─────────────────────────────────────────────────
  function initMarquee() {
    const inner = document.querySelector('.marquee-inner');
    if (!inner) return;
    inner.addEventListener('mouseenter', () => inner.style.animationPlayState = 'paused');
    inner.addEventListener('mouseleave', () => inner.style.animationPlayState = 'running');
  }

  // ── Footer Clock ───────────────────────────────────────────────────────────
  function initFooterClock() {
    const el = document.getElementById('footer-time');
    if (!el) return;
    const update = () => {
      el.textContent = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        timeZoneName: 'short',
      });
    };
    update();
    setInterval(update, 1000);
  }

  // ── Smooth Scroll (nav links) ──────────────────────────────────────────────
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', (e) => {
        const target = document.querySelector(a.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        gsap.to(window, {
          scrollTo: { y: target, offsetY: 72 },
          duration: 1,
          ease: 'power3.inOut',
        });
      });
    });
  }

  // ── Boot ───────────────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    initCursor();
    initParticles();
    initNav();
    initFooterClock();
    initMarquee();

    whenGSAPReady(() => {
      gsap.registerPlugin(ScrollTrigger);

      // Register ScrollToPlugin if available
      if (window.ScrollToPlugin) {
        gsap.registerPlugin(ScrollToPlugin);
        initSmoothScroll();
      }

      initLoader(() => {
        initHeroAnimations();
        initScrollReveals();
        initHorizontalScroll();
        initTilt();
        initMagnetic();
        ScrollTrigger.refresh();
      });
    });
  });

})();
