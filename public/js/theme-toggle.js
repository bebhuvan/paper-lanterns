// Theme toggle functionality with mobile support
(function() {
  'use strict';
  
  // Initialize theme from localStorage or system preference
  function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
    return theme;
  }
  
  // Toggle theme function
  function toggleTheme() {
    const currentTheme = document.documentElement.dataset.theme || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.dataset.theme = newTheme;
    localStorage.setItem('theme', newTheme);
    
    // Dispatch custom event for other components to listen to
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: newTheme } }));
    
    return newTheme;
  }
  
  // Set up theme toggle button
  function setupThemeToggle() {
    const toggleButton = document.getElementById('theme-toggle');
    
    if (toggleButton) {
      toggleButton.addEventListener('click', function(e) {
        e.preventDefault();
        toggleTheme();
      });
    }
  }
  
  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      initTheme();
      setupThemeToggle();
    });
  } else {
    // DOM is already loaded
    initTheme();
    setupThemeToggle();
  }
  
  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
    if (!localStorage.getItem('theme')) {
      document.documentElement.dataset.theme = e.matches ? 'dark' : 'light';
    }
  });
  
  // Export functions to global scope for debugging
  window.themeUtils = {
    toggle: toggleTheme,
    init: initTheme,
    getCurrent: () => document.documentElement.dataset.theme
  };
})();