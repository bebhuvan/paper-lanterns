(function() {
  try {
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.dataset.theme = theme;
  } catch (e) {
    // Fallback to light mode if any error
    document.documentElement.dataset.theme = 'light';
  }
})();