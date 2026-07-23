/* ===================================================================
   BENCHCODE DEV — MAIN JAVASCRIPT
   Animations, Interactions, Dynamic Features
   =================================================================== */

'use strict';

/* ── Loading Screen ─────────────────────────────────────────────── */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loading-screen');
    if (loader) loader.classList.add('loaded');
  }, 1600);
});

/* ── Dark Mode ──────────────────────────────────────────────────── */
const htmlEl = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');
const iconSun = document.getElementById('icon-sun');
const iconMoon = document.getElementById('icon-moon');

function setTheme(theme) {
  htmlEl.setAttribute('data-theme', theme);
  localStorage.setItem('bc-theme', theme);
  if (theme === 'dark') {
    iconSun.style.display = 'block';
    iconMoon.style.display = 'none';
  } else {
    iconSun.style.display = 'none';
    iconMoon.style.display = 'block';
  }
}

// Init from localStorage
const savedTheme = localStorage.getItem('bc-theme') || 'light';
setTheme(savedTheme);

themeToggle && themeToggle.addEventListener('click', () => {
  const current = htmlEl.getAttribute('data-theme');
  setTheme(current === 'dark' ? 'light' : 'dark');
});

/* ── Scroll Progress Bar ─────────────────────────────────────────── */
const progressBar = document.getElementById('scroll-progress');

function updateScrollProgress() {
  const scrolled = window.scrollY;
  const total = document.body.scrollHeight - window.innerHeight;
  const progress = (scrolled / total) * 100;
  if (progressBar) progressBar.style.width = `${progress}%`;
}

/* ── Sticky Navbar ──────────────────────────────────────────────── */
const navbar = document.getElementById('navbar');

function updateNavbar() {
  if (navbar) {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
}

/* ── Active Nav Link ────────────────────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveLink() {
  const scrollY = window.scrollY + 100;
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionH = section.offsetHeight;
    const sectionId = section.getAttribute('id');
    if (scrollY >= sectionTop && scrollY < sectionTop + sectionH) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

/* ── Back to Top Button ─────────────────────────────────────────── */
const backToTop = document.getElementById('back-to-top');

function updateBackToTop() {
  if (backToTop) {
    if (window.scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }
}

backToTop && backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── Scroll Event Aggregator ────────────────────────────────────── */
window.addEventListener('scroll', () => {
  updateScrollProgress();
  updateNavbar();
  updateActiveLink();
  updateBackToTop();
  updateProcessLine();
}, { passive: true });

/* ── Hamburger Mobile Menu ──────────────────────────────────────── */
const hamburger = document.getElementById('nav-hamburger');
const mobileMenu = document.getElementById('nav-mobile');

hamburger && hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', String(isOpen));
  if (mobileMenu) {
    if (isOpen) {
      mobileMenu.classList.add('open');
    } else {
      mobileMenu.classList.remove('open');
    }
  }
});

// Close mobile menu on link click
mobileMenu && mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger && hamburger.classList.remove('open');
    hamburger && hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('open');
  });
});

/* ── Smooth Scroll for Nav Links ────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--nav-h'), 10) || 72;
      window.scrollTo({
        top: target.offsetTop - navH,
        behavior: 'smooth'
      });
    }
  });
});

/* ── Cursor Glow ────────────────────────────────────────────────── */
const cursorGlow = document.getElementById('cursor-glow');

if (cursorGlow && window.innerWidth > 768) {
  document.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
  });
}

/* ── Magnetic Buttons ───────────────────────────────────────────── */
if (window.innerWidth > 768) {
  document.querySelectorAll('.magnetic-btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px) translateY(-2px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

/* ── Ripple Effect ──────────────────────────────────────────────── */
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  });
});

/* ── Particle Canvas ────────────────────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  const NUM_PARTICLES = 50;

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2.5 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.4 + 0.1;
      this.color = Math.random() > 0.5 ? '30,95,175' : '39,176,132';
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
        this.reset();
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color},${this.opacity})`;
      ctx.fill();
    }
  }

  particles = Array.from({ length: NUM_PARTICLES }, () => new Particle());

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw connection lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(30,95,175,${0.06 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }

  animate();
})();

/* ── Scroll Reveal Animations ───────────────────────────────────── */
(function initReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => observer.observe(el));
})();

/* ── Animated Counters ──────────────────────────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'), 10);
        const duration = 1800;
        const start = performance.now();
        function step(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
          el.textContent = Math.floor(eased * target);
          if (progress < 1) requestAnimationFrame(step);
          else el.textContent = target;
        }
        requestAnimationFrame(step);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();

/* ── Process Timeline Fill ──────────────────────────────────────── */
function updateProcessLine() {
  const timeline = document.querySelector('.process-timeline');
  const fill = document.getElementById('process-line-fill');
  if (!timeline || !fill) return;

  const rect = timeline.getBoundingClientRect();
  const winH = window.innerHeight;
  const scrolled = Math.max(0, winH - rect.top);
  const total = rect.height + winH;
  const percent = Math.min(100, (scrolled / total) * 100 * 2);
  fill.style.height = `${percent}%`;

  // Activate steps on scroll
  document.querySelectorAll('.process-step').forEach((step, i) => {
    const stepRect = step.getBoundingClientRect();
    if (stepRect.top < winH * 0.75) {
      step.classList.add('active');
    }
  });
}

/* ── FAQ Accordion ──────────────────────────────────────────────── */
(function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    btn && btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all
      faqItems.forEach(fi => {
        fi.classList.remove('open');
        const fa = fi.querySelector('.faq-question');
        fa && fa.setAttribute('aria-expanded', 'false');
      });

      // Toggle current
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
})();

/* ── Portfolio Filter ───────────────────────────────────────────── */
(function initPortfolioFilter() {
  const filters = document.querySelectorAll('.portfolio-filter');
  const cards = document.querySelectorAll('.portfolio-card');

  filters.forEach(filter => {
    filter.addEventListener('click', () => {
      // Update active filter
      filters.forEach(f => {
        f.classList.remove('active');
        f.setAttribute('aria-selected', 'false');
      });
      filter.classList.add('active');
      filter.setAttribute('aria-selected', 'true');

      const category = filter.getAttribute('data-filter');

      cards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (category === 'all' || cardCat === category) {
          card.style.display = '';
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95) translateY(10px)';
          requestAnimationFrame(() => {
            card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
            card.style.opacity = '1';
            card.style.transform = '';
          });
        } else {
          card.style.transition = 'opacity 0.2s ease';
          card.style.opacity = '0';
          setTimeout(() => { card.style.display = 'none'; }, 220);
        }
      });
    });
  });
})();

/* ── Service Card Hover Depth ───────────────────────────────────── */
(function initServiceCards() {
  if (window.innerWidth <= 768) return;
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-6px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ── Number Scroll Parallax (Hero Stats) ────────────────────────── */
(function initParallax() {
  if (window.innerWidth <= 768) return;
  const floatCards = document.querySelectorAll('.hero-float-card');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    floatCards.forEach((card, i) => {
      const speed = (i + 1) * 0.03;
      const offset = scrollY * speed;
      card.style.transform = card.classList.contains('card-3')
        ? `translateX(${-offset}px) translateY(-50%)`
        : `translateY(${-offset}px)`;
    });
  }, { passive: true });
})();

/* ── Intersection observer for process steps ────────────────────── */
(function initProcessObserver() {
  const steps = document.querySelectorAll('.process-step');
  if (!steps.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.3 });

  steps.forEach(step => observer.observe(step));
})();

/* ── Tech Badge Hover Animation ─────────────────────────────────── */
(function initTechBadges() {
  const badges = document.querySelectorAll('.tech-badge');
  badges.forEach((badge, i) => {
    badge.style.animationDelay = `${i * 0.05}s`;
    badge.addEventListener('mouseenter', () => {
      badge.style.transform = 'translateY(-3px) scale(1.05)';
    });
    badge.addEventListener('mouseleave', () => {
      badge.style.transform = '';
    });
  });
})();

/* ── Stat Card Count Trigger ────────────────────────────────────── */
(function initStatCards() {
  const statCards = document.querySelectorAll('.stat-card');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.3 });

  statCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'all 0.5s ease';
    observer.observe(card);
  });
})();

/* ── Hero gradient animation trigger ────────────────────────────── */
(function initHeroGradient() {
  const heroTitle = document.querySelector('.hero-title');
  if (!heroTitle) return;
  setTimeout(() => {
    heroTitle.style.opacity = '1';
  }, 200);
})();

/* ── Keyboard Accessibility Trap Prevention ─────────────────────── */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const hamburger = document.getElementById('nav-hamburger');
    const mobileMenu = document.getElementById('nav-mobile');
    if (hamburger && hamburger.classList.contains('open')) {
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu && mobileMenu.classList.remove('open');
    }
    document.querySelectorAll('.faq-item.open').forEach(item => {
      item.classList.remove('open');
      item.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
    });
  }
});

/* ── Service tag hover interactivity ────────────────────────────── */
(function initServiceTagInteraction() {
  document.querySelectorAll('.service-tag').forEach(tag => {
    tag.addEventListener('click', () => {
      tag.style.transform = 'scale(0.95)';
      setTimeout(() => { tag.style.transform = ''; }, 150);
    });
  });
})();

/* ── Footer year auto update ────────────────────────────────────── */
(function updateFooterYear() {
  const yearEls = document.querySelectorAll('.footer-year');
  yearEls.forEach(el => {
    el.textContent = new Date().getFullYear();
  });
})();

/* ── Prefers reduced motion ─────────────────────────────────────── */
(function respectMotionPreference() {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (mq.matches) {
    document.documentElement.style.setProperty('--dur-fast', '0ms');
    document.documentElement.style.setProperty('--dur-base', '0ms');
    document.documentElement.style.setProperty('--dur-slow', '0ms');
  }
})();

/* ── Window resize handler ──────────────────────────────────────── */
window.addEventListener('resize', () => {
  // Close mobile menu on resize to desktop
  if (window.innerWidth > 1024) {
    const hamburger = document.getElementById('nav-hamburger');
    const mobileMenu = document.getElementById('nav-mobile');
    hamburger && hamburger.classList.remove('open');
    hamburger && hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu && mobileMenu.classList.remove('open');
  }
}, { passive: true });

/* ── Initialize on DOM ready ────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  updateNavbar();
  updateBackToTop();
  updateScrollProgress();
});
