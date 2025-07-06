import { useEffect } from 'react';

const ServiceWorkerRegistration = () => {
  useEffect(() => {
    // Only register service worker in production
    if (import.meta.env.PROD && 'serviceWorker' in navigator) {
      registerServiceWorker();
    }
  }, []);

  const registerServiceWorker = async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });

      registration.addEventListener('updatefound', () => {
        const installingWorker = registration.installing;
        if (installingWorker) {
          installingWorker.addEventListener('statechange', () => {
            if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content is available, notify user
              if (import.meta.env.DEV) {
                console.log('New service worker content available');
              }
              
              // You can show a notification to user about update
              showUpdateNotification();
            }
          });
        }
      });

      // Check for updates every 5 minutes
      setInterval(() => {
        registration.update();
      }, 5 * 60 * 1000);

      console.log('Service Worker registered successfully:', registration);

      // Send performance metrics to service worker
      if (registration.active) {
        sendPerformanceMetrics(registration.active);
      }

    } catch (error) {
      console.log('Service Worker registration failed:', error);
    }
  };

  const showUpdateNotification = () => {
    // Create a simple, safe notification without unsafe DOM operations
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded shadow-lg z-50';
    notification.textContent = 'App updated! Refresh to see changes.';
    notification.style.zIndex = '9999';
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds with safe cleanup
    setTimeout(() => {
      try {
        if (notification && notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      } catch (error) {
        // Silent failure - notification cleanup failed
      }
    }, 5000);
  };

  const sendPerformanceMetrics = (serviceWorker: ServiceWorker) => {
    // Collect and send performance metrics
    if ('performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (navigation) {
        const metrics = {
          ttfb: navigation.responseStart - navigation.fetchStart,
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
          loadComplete: navigation.loadEventEnd - navigation.fetchStart,
          timestamp: Date.now()
        };

        serviceWorker.postMessage({
          type: 'PERFORMANCE_METRICS',
          metrics
        });
      }
    }
  };

  return null;
};

export default ServiceWorkerRegistration; 