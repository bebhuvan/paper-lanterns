(function() {
  try {
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.dataset.theme = theme;
  } catch (e) {
    // Fallback to light mode if any error
    document.documentElement.dataset.theme = 'light';
  }
  
  // Handle font loading without inline event handlers
  document.addEventListener('DOMContentLoaded', function() {
    const fontsLink = document.getElementById('fonts-link');
    if (fontsLink) {
      fontsLink.addEventListener('load', function() {
        this.media = 'all';
      });
      // Fallback to load fonts after a delay if load event doesn't fire
      setTimeout(function() {
        fontsLink.media = 'all';
      }, 3000);
    }
  });
})();