if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
        
        // Check for updates every 24 hours
        setInterval(() => {
          registration.update();
        }, 24 * 60 * 60 * 1000);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
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