if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Use TrustedScriptURL if available for CSP compliance
    let swUrl = '/sw.js';
    if (window.trustedTypes && trustedTypes.createPolicy) {
      const policy = trustedTypes.createPolicy('sw-register', {
        createScriptURL: (url) => url
      });
      swUrl = policy.createScriptURL(swUrl);
    }
    navigator.serviceWorker.register(swUrl)
      .then((registration) => {
        // Service worker registered successfully
        
        // Check for updates every 24 hours
        setInterval(() => {
          registration.update();
        }, 24 * 60 * 60 * 1000);
      })
      .catch((registrationError) => {
        console.warn('SW registration failed: ', registrationError);
      });
  });
  
  // Listen for service worker updates
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    // Optionally show a notification about app update
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Paper Lanterns Updated', {
        body: 'The app has been updated with new features!',
        icon: '/icons/icon-192.png'
      });
    }
  });
}