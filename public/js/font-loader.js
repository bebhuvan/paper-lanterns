// Font loading handler
(function() {
  'use strict';
  
  document.addEventListener('DOMContentLoaded', function() {
    const fontsLink = document.getElementById('fonts-link');
    if (fontsLink) {
      // Load fonts after page content
      fontsLink.addEventListener('load', function() {
        this.media = 'all';
      });
      
      // Immediate load for better UX
      fontsLink.media = 'all';
    }
  });
})();