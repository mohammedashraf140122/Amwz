/**
 * AMZW Consulting Group - Main JavaScript
 * Handles navigation, form validation, and interactive features
 */

(function() {
  'use strict';

  // ============================================
  // Mobile Navigation Toggle
  // ============================================
  function initMobileNav() {
    // Create mobile menu button if it doesn't exist
    const header = document.querySelector('.global-header');
    if (!header) return;

    const headerGrid = document.querySelector('.header-grid');
    if (!headerGrid) return;

    const navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;

    // Check if mobile button already exists
    if (document.querySelector('.mobile-menu-toggle')) return;

    // Create mobile menu button
    const mobileBtn = document.createElement('button');
    mobileBtn.className = 'mobile-menu-toggle';
    mobileBtn.innerHTML = '<span></span><span></span><span></span>';
    mobileBtn.setAttribute('aria-label', 'Toggle navigation');
    mobileBtn.setAttribute('type', 'button');
    mobileBtn.style.cssText = `
      display: none;
      flex-direction: column;
      gap: 4px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 8px;
      z-index: 1001;
    `;
    
    mobileBtn.querySelectorAll('span').forEach(span => {
      span.style.cssText = `
        width: 25px;
        height: 3px;
        background: #1a1a2e;
        transition: all 0.3s ease;
        display: block;
        border-radius: 2px;
      `;
    });

    // Insert after nav-actions or before nav-links
    const navActions = document.querySelector('.nav-actions');
    if (navActions && navActions.nextSibling) {
      headerGrid.insertBefore(mobileBtn, navActions.nextSibling);
    } else {
      headerGrid.appendChild(mobileBtn);
    }

    // Toggle menu on click
    mobileBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      navLinks.classList.toggle('mobile-menu-open');
      this.classList.toggle('active');
    });

    // Close menu when clicking on a link
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', function() {
        navLinks.classList.remove('mobile-menu-open');
        mobileBtn.classList.remove('active');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!header.contains(e.target) && navLinks.classList.contains('mobile-menu-open')) {
        navLinks.classList.remove('mobile-menu-open');
        mobileBtn.classList.remove('active');
      }
    });

    // Show/hide mobile button based on screen size
    function checkScreenSize() {
      if (window.innerWidth <= 768) {
        mobileBtn.style.display = 'flex';
      } else {
        mobileBtn.style.display = 'none';
        navLinks.classList.remove('mobile-menu-open');
        mobileBtn.classList.remove('active');
      }
    }

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
  }

  // ============================================
  // Smooth Scrolling
  // ============================================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  // ============================================
  // Form Validation
  // ============================================
  function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
      form.addEventListener('submit', function(e) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
          if (!field.value.trim()) {
            isValid = false;
            field.classList.add('is-invalid');
            
            // Remove invalid class on input
            field.addEventListener('input', function() {
              this.classList.remove('is-invalid');
            }, { once: true });
          } else {
            field.classList.remove('is-invalid');
          }
        });

        // Email validation
        const emailFields = form.querySelectorAll('input[type="email"]');
        emailFields.forEach(field => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (field.value && !emailRegex.test(field.value)) {
            isValid = false;
            field.classList.add('is-invalid');
          }
        });

        if (!isValid) {
          e.preventDefault();
          // Show error message
          const errorMsg = document.createElement('div');
          errorMsg.className = 'alert alert-danger mt-3';
          errorMsg.textContent = 'Please fill in all required fields correctly.';
          errorMsg.style.cssText = `
            padding: 12px;
            background: #f8d7da;
            color: #721c24;
            border-radius: 8px;
            margin-top: 1rem;
          `;
          
          const existingError = form.querySelector('.alert-danger');
          if (existingError) existingError.remove();
          
          form.appendChild(errorMsg);
          
          // Remove error message after 5 seconds
          setTimeout(() => {
            errorMsg.remove();
          }, 5000);
        }
      });
    });
  }

  // ============================================
  // Header Scroll Effect
  // ============================================
  function initHeaderScroll() {
    const header = document.querySelector('.global-header');
    if (!header) return;

    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
      const currentScroll = window.pageYOffset;
      
      if (currentScroll > 100) {
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
      } else {
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
      }
      
      lastScroll = currentScroll;
    });
  }

  // ============================================
  // Lazy Loading Images
  // ============================================
  function initLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            observer.unobserve(img);
          }
        });
      });

      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }

  // ============================================
  // Animate on Scroll
  // ============================================
  function initScrollAnimation() {
    if ('IntersectionObserver' in window) {
      const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }
        });
      }, {
        threshold: 0.1
      });

      // Add animation to cards
      document.querySelectorAll('.card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        animationObserver.observe(card);
      });
    }
  }

  // ============================================
  // Initialize All Functions
  // ============================================
  function init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        initMobileNav();
        initSmoothScroll();
        initFormValidation();
        initHeaderScroll();
        initLazyLoading();
        initScrollAnimation();
      });
    } else {
      initMobileNav();
      initSmoothScroll();
      initFormValidation();
      initHeaderScroll();
      initLazyLoading();
      initScrollAnimation();
    }
  }

  // Start initialization
  init();

})();
