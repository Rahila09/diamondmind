/* ═══════════════════════════════════════════════════════
   DIAMOND MIND GIRLS FOUNDATION — script.js
   Features: Sticky nav, mobile menu, scroll animations,
             impact counter, form handling, smooth scroll
═══════════════════════════════════════════════════════ */

'use strict';

/* ─── UTILITIES ──────────────────────────────────────── */

/**
 * Run callback when DOM is ready
 */
function onReady(fn) {
  if (document.readyState !== 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

/**
 * Debounce a function
 */
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

/* ─── STICKY NAVBAR ──────────────────────────────────── */

function initStickyNav() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const scrollThreshold = 60;

  function updateNav() {
    if (window.scrollY > scrollThreshold) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav(); // run on load
}

/* ─── MOBILE MENU ────────────────────────────────────── */

function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (!hamburger || !navLinks) return;

  // Create overlay element
  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  document.body.appendChild(overlay);

  function openMenu() {
    hamburger.classList.add('active');
    navLinks.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    hamburger.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    hamburger.setAttribute('aria-expanded', 'false');
  }

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.contains('active');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close when overlay clicked
  overlay.addEventListener('click', closeMenu);

  // Close when a nav link is clicked
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && hamburger.classList.contains('active')) {
      closeMenu();
    }
  });
}

/* ─── SCROLL REVEAL ANIMATIONS ───────────────────────── */

function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.12,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // only animate once
      }
    });
  }, observerOptions);

  revealEls.forEach(el => observer.observe(el));
}

/* ─── IMPACT COUNTER ANIMATION ───────────────────────── */

function initImpactCounters() {
  const counters = document.querySelectorAll('.impact-number[data-target]');
  if (!counters.length) return;

  let hasAnimated = false;

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        counters.forEach(counter => animateCounter(counter));
        observer.disconnect();
      }
    });
  }, observerOptions);

  // Observe the impact section
  const impactSection = document.getElementById('impact');
  if (impactSection) observer.observe(impactSection);

  /**
   * Animate a single counter from 0 to its target value
   */
  function animateCounter(el) {
    const target  = parseInt(el.getAttribute('data-target'), 10);
    const duration = 2000; // ms
    const startTime = performance.now();

    // Use easeOutCubic for a natural deceleration
    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function updateCounter(currentTime) {
      const elapsed  = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = easeOutCubic(progress);
      const current  = Math.round(eased * target);

      el.textContent = current.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        el.textContent = target.toLocaleString(); // ensure exact final value
      }
    }

    requestAnimationFrame(updateCounter);
  }
}

/* ─── ACTIVE NAV LINK (SCROLL SPY) ──────────────────── */

function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  function updateActiveLink() {
    let currentSection = '';
    const scrollPos = window.scrollY + 120; // offset for navbar height

    sections.forEach(section => {
      if (scrollPos >= section.offsetTop) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href && href === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', debounce(updateActiveLink, 50), { passive: true });
}

/* ─── SMOOTH SCROLL OFFSET ───────────────────────────── */
/**
 * Override default anchor scroll to account for fixed navbar height
 */
function initSmoothScrollOffset() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();

      const navbarHeight = document.getElementById('navbar')?.offsetHeight || 72;
      const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - navbarHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });
    });
  });
}

/* ─── CONTACT FORM ───────────────────────────────────── */

function initContactForm() {
  const form     = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Basic validation
    const name    = form.querySelector('#name')?.value.trim();
    const email   = form.querySelector('#email')?.value.trim();
    const message = form.querySelector('#message')?.value.trim();

    if (!name || !email) {
      showNote('Please fill in your name and email.', 'error');
      return;
    }

    if (!isValidEmail(email)) {
      showNote('Please enter a valid email address.', 'error');
      return;
    }

    // Simulate submission (replace this block with your actual form submission logic)
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled = true;

    setTimeout(() => {
      // SUCCESS state
      showNote('✓ Thank you! We\'ll be in touch with you shortly.', 'success');
      form.reset();
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }, 1500);

    /* ─────────────────────────────────────────────────────────
       TO CONNECT A REAL BACKEND OR SERVICE (e.g. Formspree):
       Replace the setTimeout block above with a fetch() call:

       const formData = new FormData(form);
       fetch('https://formspree.io/f/YOUR_FORM_ID', {
         method: 'POST',
         body: formData,
         headers: { 'Accept': 'application/json' }
       })
       .then(res => {
         if (res.ok) {
           showNote('✓ Thank you! We will be in touch shortly.', 'success');
           form.reset();
         } else {
           showNote('Something went wrong. Please try again.', 'error');
         }
       })
       .catch(() => showNote('Network error. Please try again.', 'error'))
       .finally(() => {
         submitBtn.textContent = originalText;
         submitBtn.disabled = false;
       });
    ───────────────────────────────────────────────────────── */
  });

  function showNote(message, type) {
    formNote.textContent = message;
    formNote.className = `form-note ${type}`;
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}

/* ─── HERO PARALLAX (subtle) ─────────────────────────── */

function initHeroParallax() {
  const heroImgs = document.querySelectorAll('.hero-img');
  if (!heroImgs.length) return;

  // Only run on non-reduced-motion, non-mobile
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  if (prefersReduced || isMobile) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const offset = scrollY * 0.2;

    heroImgs.forEach((img, i) => {
      // Alternate direction for split panels
      const direction = i % 2 === 0 ? 1 : -1;
      img.style.transform = `translateY(${direction * offset * 0.3}px) scale(1.03)`;
    });
  }, { passive: true });
}

/* ─── TIMELINE DOT ACTIVE STATE ──────────────────────── */

function initTimelineScroll() {
  const timelineItems = document.querySelectorAll('.timeline-item');
  if (!timelineItems.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const dot = entry.target.querySelector('.timeline-dot');
      if (dot) {
        if (entry.isIntersecting) {
          dot.style.boxShadow = '0 0 0 8px rgba(232,201,107,0.15)';
        } else {
          dot.style.boxShadow = 'none';
        }
      }
    });
  }, { threshold: 0.6 });

  timelineItems.forEach(item => observer.observe(item));
}

/* ─── REVENUE BAR ANIMATION ──────────────────────────── */

function initRevenueBar() {
  const revenueBar = document.querySelector('.revenue-bar');
  if (!revenueBar) return;

  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        const fills = revenueBar.querySelectorAll('.revenue-bar__fill');
        fills.forEach(fill => {
          fill.style.transition = 'flex 1.2s cubic-bezier(0.16, 1, 0.3, 1)';
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.5 });

  observer.observe(revenueBar);
}

/* ─── ACTIVE NAV LINK STYLES (CSS supplement) ────────── */
// Inject active link style dynamically to keep CSS clean
function injectActiveLinkStyle() {
  const style = document.createElement('style');
  style.textContent = `
    .nav-link.active {
      color: var(--color-gold) !important;
    }
  `;
  document.head.appendChild(style);
}

/* ─── BOOT ───────────────────────────────────────────── */

onReady(() => {
  initStickyNav();
  initMobileMenu();
  initScrollReveal();
  initImpactCounters();
  initScrollSpy();
  initSmoothScrollOffset();
  initContactForm();
  initHeroParallax();
  initTimelineScroll();
  initRevenueBar();
  injectActiveLinkStyle();

  // Log build info (remove before production)
  console.log('%c◆ Diamond Mind Girls Foundation', 'color: #e8c96b; font-size: 14px; font-weight: bold;');
  console.log('%cWebsite initialized successfully.', 'color: #888; font-size: 11px;');
});
