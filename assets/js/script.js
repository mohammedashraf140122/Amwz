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
  // Animate on Scroll (Enhanced)
  // ============================================
  function initScrollAnimation() {
    if ('IntersectionObserver' in window) {
      const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('animate-in');
              entry.target.style.opacity = '1';
              entry.target.style.transform = 'translateY(0)';
            }, index * 100); // Stagger animation
            animationObserver.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });

      // Add animation to cards
      document.querySelectorAll('.card, .panel-card, .section-block').forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        animationObserver.observe(el);
      });
    }
  }

  // ============================================
  // Button Loading States
  // ============================================
  function initButtonLoading() {
    document.querySelectorAll('form').forEach(form => {
      form.addEventListener('submit', function(e) {
        const submitBtn = form.querySelector('button[type="submit"], .btn-primary[type="submit"]');
        if (submitBtn) {
          submitBtn.classList.add('loading');
          submitBtn.disabled = true;
          const originalText = submitBtn.textContent;
          submitBtn.innerHTML = '<span class="spinner"></span> Sending...';
          
          // Reset after 3 seconds (in real app, reset after actual submission)
          setTimeout(() => {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
          }, 3000);
        }
      });
    });
  }

  // ============================================
  // Enhanced Form Validation with Real-time Feedback
  // ============================================
  function initEnhancedFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
      const fields = form.querySelectorAll('input, textarea, select');
      
      fields.forEach(field => {
        // Real-time validation
        field.addEventListener('blur', function() {
          validateField(this);
        });
        
        field.addEventListener('input', function() {
          if (this.classList.contains('is-invalid')) {
            validateField(this);
          }
        });
      });
    });
    
    function validateField(field) {
      const value = field.value.trim();
      let isValid = true;
      let errorMessage = '';
      
      // Required validation
      if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
      }
      
      // Email validation
      if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          isValid = false;
          errorMessage = 'Please enter a valid email address';
        }
      }
      
      // Phone validation
      if (field.type === 'tel' && value) {
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        if (!phoneRegex.test(value) || value.length < 10) {
          isValid = false;
          errorMessage = 'Please enter a valid phone number';
        }
      }
      
      // Update field state
      if (isValid) {
        field.classList.remove('is-invalid');
        field.classList.add('is-valid');
        removeErrorMessage(field);
      } else {
        field.classList.remove('is-valid');
        field.classList.add('is-invalid');
        showErrorMessage(field, errorMessage);
      }
    }
    
    function showErrorMessage(field, message) {
      removeErrorMessage(field);
      const errorDiv = document.createElement('div');
      errorDiv.className = 'field-error';
      errorDiv.textContent = message;
      field.parentElement.appendChild(errorDiv);
    }
    
    function removeErrorMessage(field) {
      const error = field.parentElement.querySelector('.field-error');
      if (error) error.remove();
    }
  }

  // ============================================
  // Smooth Scroll with Offset for Fixed Header
  // ============================================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '#!') return;
        
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const headerHeight = document.querySelector('.global-header')?.offsetHeight || 0;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // ============================================
  // Performance: Debounce Scroll Events
  // ============================================
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // ============================================
  // Enhanced Header Scroll Effect
  // ============================================
  function initHeaderScroll() {
    const header = document.querySelector('.global-header');
    if (!header) return;

    let lastScroll = 0;
    let ticking = false;
    
    const handleScroll = () => {
      const currentScroll = window.pageYOffset;
      
      if (currentScroll > 100) {
        header.classList.add('scrolled');
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.12)';
        header.style.background = 'rgba(255, 255, 255, 0.98)';
      } else {
        header.classList.remove('scrolled');
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
        header.style.background = 'rgba(255, 255, 255, 0.95)';
      }
      
      // Hide/show header on scroll
      if (currentScroll > lastScroll && currentScroll > 200) {
        header.style.transform = 'translateY(-100%)';
      } else {
        header.style.transform = 'translateY(0)';
      }
      
      lastScroll = currentScroll;
      ticking = false;
    };
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(handleScroll);
        ticking = true;
      }
    }, { passive: true });
  }

  // ============================================
  // Keyboard Navigation Enhancement
  // ============================================
  function initKeyboardNavigation() {
    // Skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 0;
      background: var(--primary-color);
      color: white;
      padding: 8px 16px;
      text-decoration: none;
      z-index: 10000;
      border-radius: 0 0 4px 0;
    `;
    skipLink.addEventListener('focus', function() {
      this.style.top = '0';
    });
    skipLink.addEventListener('blur', function() {
      this.style.top = '-40px';
    });
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main content ID
    const main = document.querySelector('main');
    if (main && !main.id) {
      main.id = 'main-content';
    }
  }

  // ============================================
  // Image Loading with Placeholder
  // ============================================
  function initImageLoading() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (!img.complete) {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
        
        img.addEventListener('load', function() {
          this.style.opacity = '1';
        });
        
        img.addEventListener('error', function() {
          this.style.opacity = '1';
          this.alt = 'Image failed to load';
        });
      }
    });
  }

  // ============================================
  // Initialize All Functions
  // ============================================
  function init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        initKeyboardNavigation();
        initMobileNav();
        initSmoothScroll();
        initFormValidation();
        initEnhancedFormValidation();
        initButtonLoading();
        initHeaderScroll();
        initLazyLoading();
        initImageLoading();
        initScrollAnimation();
      });
    } else {
      initKeyboardNavigation();
      initMobileNav();
      initSmoothScroll();
      initFormValidation();
      initEnhancedFormValidation();
      initButtonLoading();
      initHeaderScroll();
      initLazyLoading();
      initImageLoading();
      initScrollAnimation();
    }
  }

  // Start initialization
  init();

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
