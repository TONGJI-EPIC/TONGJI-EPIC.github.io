/**
 * EPIC Lab - Main JavaScript
 * Handles: navigation, language switching, mobile menu, utilities
 */

(function () {
  'use strict';

  /* ==========================================
     Language Switching
     ========================================== */
  const DEFAULT_LANG = 'zh';
  let currentLang = localStorage.getItem('epic-lang') || DEFAULT_LANG;

  function setLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;
    localStorage.setItem('epic-lang', lang);

    // Update toggle button text
    const btn = document.getElementById('langSwitch');
    if (btn) {
      btn.textContent = lang === 'zh' ? 'EN' : '中';
      btn.setAttribute('title', lang === 'zh' ? 'Switch to English' : '切换到中文');
    }

    // Toggle visibility of all lang-tagged elements
    document.querySelectorAll('[data-lang]').forEach(el => {
      if (el.dataset.lang === lang) {
        el.classList.remove('hidden');
      } else {
        el.classList.add('hidden');
      }
    });

    // Dispatch event for other scripts
    window.dispatchEvent(new CustomEvent('languagechange', { detail: { lang } }));
  }

  function toggleLanguage() {
    setLanguage(currentLang === 'zh' ? 'en' : 'zh');
  }

  /* ==========================================
     Mobile Menu
     ========================================== */
  function initMobileMenu() {
    const btn = document.getElementById('mobileMenuBtn');
    const links = document.getElementById('navbarLinks');
    if (!btn || !links) return;

    function renderMenuState(isOpen) {
      btn.innerHTML = isOpen
        ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
        : '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
      btn.setAttribute('aria-expanded', String(isOpen));
      btn.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    }

    btn.addEventListener('click', () => {
      links.classList.toggle('mobile-open');
      renderMenuState(links.classList.contains('mobile-open'));
    });

    // Close menu when clicking a link
    links.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        links.classList.remove('mobile-open');
        renderMenuState(false);
      });
    });
  }

  /* ==========================================
     Navbar scroll effect
     ========================================== */
  function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      if (currentScroll > 10) {
        navbar.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
      } else {
        navbar.style.boxShadow = 'none';
      }
      lastScroll = currentScroll;
    });
  }

  /* ==========================================
     Intersection Observer for fade-in animations
     ========================================== */
  function initScrollAnimations() {
    // Disable animations in headless/testing environments or when hash is #noanim
    if (navigator.webdriver || window.matchMedia('(prefers-reduced-motion: reduce)').matches || location.hash === '#noanim') {
      document.querySelectorAll('.card, .team-card, .activity-item, .pub-item').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.card, .team-card, .activity-item, .pub-item').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      observer.observe(el);
    });

    // Add the animate-in style dynamically
    const style = document.createElement('style');
    style.textContent = '.animate-in { opacity: 1 !important; transform: translateY(0) !important; }';
    document.head.appendChild(style);
  }

  /* ==========================================
     Initialize on DOM ready
     ========================================== */
  function init() {
    // Language switcher
    const langBtn = document.getElementById('langSwitch');
    if (langBtn) {
      langBtn.addEventListener('click', toggleLanguage);
    }

    // Set initial language
    setLanguage(currentLang);

    // Mobile menu
    initMobileMenu();

    // Navbar scroll
    initNavbarScroll();

    // Scroll animations
    if ('IntersectionObserver' in window) {
      initScrollAnimations();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose for other scripts
  window.EPIC = { setLanguage, toggleLanguage, currentLang: () => currentLang };
})();
