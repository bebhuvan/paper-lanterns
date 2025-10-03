// Mobile menu toggle functionality
(function() {
  'use strict';

  function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.getElementById('navMenu');

    if (!menuBtn || !navMenu) {
      console.warn('[Mobile Menu] Button or menu not found');
      return;
    }

    console.log('[Mobile Menu] Initialized successfully');

    // Toggle menu on button click
    menuBtn.addEventListener('click', function(e) {
      e.stopPropagation(); // Prevent event from bubbling
      const isOpen = navMenu.classList.contains('mobile-open');

      if (isOpen) {
        navMenu.classList.remove('mobile-open');
        menuBtn.setAttribute('aria-expanded', 'false');
      } else {
        navMenu.classList.add('mobile-open');
        menuBtn.setAttribute('aria-expanded', 'true');
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
      const isClickInsideNav = event.target.closest('.nav-container');
      const isOpen = navMenu.classList.contains('mobile-open');

      if (!isClickInsideNav && isOpen) {
        navMenu.classList.remove('mobile-open');
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    });

    // Close menu when clicking on a link
    const navLinks = navMenu.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        navMenu.classList.remove('mobile-open');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileMenu);
  } else {
    initMobileMenu();
  }
})();
