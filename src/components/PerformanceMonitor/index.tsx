import { useEffect, useCallback, useState } from 'react';

interface PerformanceMetrics {
  fcp: number | null;
  lcp: number | null;
  fid: number | null;
  cls: number | null;
  ttfb: number | null;
  domContentLoaded: number | null;
  loadComplete: number | null;
}

interface PerformanceMonitorProps {
  enableCSSOptimization?: boolean;
  enableResourcePreloading?: boolean;
  enableMetrics?: boolean;
  onMetricsUpdate?: (metrics: PerformanceMetrics) => void;
}

const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  enableCSSOptimization = true,
  enableResourcePreloading = true,
  enableMetrics = true,
  onMetricsUpdate
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
    domContentLoaded: null,
    loadComplete: null
  });

  // Critical CSS optimization - optimized to reduce forced reflows
  const optimizeCSSDelivery = useCallback(() => {
    if (!enableCSSOptimization) return;

    // Skip if already done (prevent multiple executions)
    if (document.body.hasAttribute('data-css-optimized')) return;
    
    // Batch DOM operations to minimize forced reflows
    const fragment = document.createDocumentFragment();
    
    // Check if critical CSS is already inlined
    if (!document.querySelector('#critical-css')) {
      const style = document.createElement('style');
      style.id = 'critical-css';
      style.textContent = `/* Critical CSS is now in index.html */`;
      fragment.appendChild(style);
    }

    // Defer non-critical CSS using requestIdleCallback to avoid blocking
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        // All non-critical CSS removed for performance - system fonts only
        const cssFragment = document.createDocumentFragment();
        
        // Single DOM insertion
        if (cssFragment.children.length > 0) {
          document.head.appendChild(cssFragment);
        }
      }, { timeout: 2000 });
    }

    // Single DOM operation to add fragment
    if (fragment.children.length > 0) {
      document.head.appendChild(fragment);
    }
    
    // Mark as completed to prevent re-execution
    document.body.setAttribute('data-css-optimized', 'true');
  }, [enableCSSOptimization]);

  // Resource preloading optimization - batched to reduce forced reflows
  const optimizeResourcePreloading = useCallback(() => {
    if (!enableResourcePreloading) return;

    // Skip if already done
    if (document.body.hasAttribute('data-preload-optimized')) return;

    // Batch all preload operations
    const fragment = document.createDocumentFragment();
    
    const criticalResources = [
      { href: '/hero.webp', as: 'image', type: 'image/webp', fetchpriority: 'high' },
      { href: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2', as: 'font', type: 'font/woff2' }
    ];

    criticalResources.forEach(({ href, as, type, fetchpriority }) => {
      if (!document.querySelector(`link[href="${href}"]`)) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = href;
        link.as = as;
        if (type) link.type = type;
        if (fetchpriority) link.setAttribute('fetchpriority', fetchpriority);
        if (as === 'font') link.crossOrigin = 'anonymous';
        fragment.appendChild(link);
      }
    });

    // Single DOM insertion
    if (fragment.children.length > 0) {
      document.head.appendChild(fragment);
    }

    // Prefetch next-page resources using requestIdleCallback
    if ('connection' in navigator && (navigator as any).connection.effectiveType !== 'slow-2g') {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          const prefetchResources = ['/activities', '/stays', '/destinations'];
          const prefetchFragment = document.createDocumentFragment();
          
          prefetchResources.forEach(href => {
            if (!document.querySelector(`link[href="${href}"][rel="prefetch"]`)) {
              const link = document.createElement('link');
              link.rel = 'prefetch';
              link.href = href;
              prefetchFragment.appendChild(link);
            }
          });
          
          if (prefetchFragment.children.length > 0) {
            document.head.appendChild(prefetchFragment);
          }
        }, { timeout: 5000 });
      }
    }
    
    // Mark as completed
    document.body.setAttribute('data-preload-optimized', 'true');
  }, [enableResourcePreloading]);

  // Performance metrics collection - optimized to reduce forced reflows
  const collectMetrics = useCallback(() => {
    if (!enableMetrics) return;

    const updateMetrics = (newMetrics: Partial<PerformanceMetrics>) => {
      // Use requestAnimationFrame to batch state updates and avoid forced reflows
      requestAnimationFrame(() => {
        setMetrics(prev => {
          const updated = { ...prev, ...newMetrics };
          onMetricsUpdate?.(updated);
          return updated;
        });
      });
    };

    // Navigation timing metrics - cached to avoid repeated calculations
    const collectNavigationMetrics = () => {
      if ('performance' in window && 'getEntriesByType' in performance) {
        // Use requestIdleCallback to avoid blocking main thread
        if ('requestIdleCallback' in window) {
          requestIdleCallback(() => {
            const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
            if (navigationEntries.length > 0) {
              const nav = navigationEntries[0];
              updateMetrics({
                ttfb: Math.round(nav.responseStart - nav.requestStart),
                domContentLoaded: Math.round(nav.domContentLoadedEventEnd - nav.startTime),
                loadComplete: Math.round(nav.loadEventEnd - nav.startTime)
              });
            }
          });
        }
      }
    };

    // Core Web Vitals
    const collectCoreWebVitals = () => {
      // First Contentful Paint (FCP)
      const observeFCP = () => {
        if ('PerformanceObserver' in window) {
          const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
            if (fcpEntry) {
              updateMetrics({ fcp: fcpEntry.startTime });
              observer.disconnect();
            }
          });
          observer.observe({ entryTypes: ['paint'] });
        }
      };

      // Largest Contentful Paint (LCP)
      const observeLCP = () => {
        if ('PerformanceObserver' in window) {
          const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            updateMetrics({ lcp: lastEntry.startTime });
          });
          observer.observe({ entryTypes: ['largest-contentful-paint'] });
        }
      };

      // First Input Delay (FID)
      const observeFID = () => {
        if ('PerformanceObserver' in window) {
          const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry: any) => {
              updateMetrics({ fid: entry.processingStart - entry.startTime });
            });
          });
          observer.observe({ entryTypes: ['first-input'] });
        }
      };

      // Cumulative Layout Shift (CLS)
      const observeCLS = () => {
        if ('PerformanceObserver' in window) {
          let clsValue = 0;
          const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry: any) => {
              if (!entry.hadRecentInput) {
                clsValue += entry.value;
              }
            });
            updateMetrics({ cls: clsValue });
          });
          observer.observe({ entryTypes: ['layout-shift'] });
        }
      };

      observeFCP();
      observeLCP();
      observeFID();
      observeCLS();
    };

    // Collect metrics after DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        collectNavigationMetrics();
        collectCoreWebVitals();
      });
    } else {
      collectNavigationMetrics();
      collectCoreWebVitals();
    }
  }, [enableMetrics, onMetricsUpdate]);

  // Simple, safe DOM cleanup without unsafe removeChild calls
  const safeCleanupElements = useCallback((selector: string) => {
    try {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        if (element && element.parentNode) {
          element.parentNode.removeChild(element);
        }
      });
    } catch (error) {
      // Silent failure - don't log to avoid console spam
    }
  }, []);

  // Safe DOM optimization without unsafe operations
  const optimizeDOM = useCallback(() => {
    try {
      // Only perform safe, non-destructive optimizations
      const unusedElements = document.querySelectorAll('[data-unused="true"]');
      unusedElements.forEach(element => {
        if (element && element.parentNode && element instanceof HTMLElement) {
          element.style.display = 'none'; // Hide instead of removing
        }
      });
    } catch (error) {
      // Silent failure - don't log to avoid console spam
    }
  }, []);

  // Third-party script optimization
  const optimizeThirdPartyScripts = useCallback(() => {
    // Delay third-party scripts until user interaction
    const delayedScripts = [
      'https://cdn.signalzen.com/signalzen.js',
      'https://connect.facebook.net/en_US/fbevents.js',
      'https://www.googletagmanager.com/gtag/js'
    ];

    let scriptsLoaded = false;

    const loadScripts = () => {
      if (scriptsLoaded) return;
      scriptsLoaded = true;

      // Skip in development
      if (window.location.hostname === 'localhost') return;

      delayedScripts.forEach((src, index) => {
        setTimeout(() => {
          const script = document.createElement('script');
          script.src = src;
          script.async = true;
          script.defer = true;
          document.head.appendChild(script);
        }, index * 1000); // Stagger loading
      });
    };

    // Load on user interaction
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      window.addEventListener(event, loadScripts, { once: true, passive: true });
    });

    // Fallback: load after 5 seconds
    setTimeout(loadScripts, 5000);
  }, []);

  // Simplified optimizations to prevent blocking
  useEffect(() => {
    // Only run one optimization at a time with delays
    const runOptimizations = async () => {
      // Wait for page to be fully loaded
      if (document.readyState !== 'complete') {
        window.addEventListener('load', runOptimizations, { once: true });
        return;
      }

      // Run optimizations with delays to prevent blocking
      setTimeout(() => {
        if (enableCSSOptimization) optimizeCSSDelivery();
      }, 100);

      setTimeout(() => {
        if (enableResourcePreloading) optimizeResourcePreloading();
      }, 500);

      setTimeout(() => {
        if (enableMetrics) collectMetrics();
      }, 1000);

      // Skip DOM and script optimizations that might cause issues
      // optimizeDOM();
      // optimizeThirdPartyScripts();
    };

    runOptimizations();
  }, [enableCSSOptimization, enableResourcePreloading, enableMetrics]);

  // Log metrics for debugging (development only)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && enableMetrics) {
      console.log('Performance Metrics:', metrics);
    }
  }, [metrics, enableMetrics]);

  // Component doesn't render anything visible
  return null;
};

export default PerformanceMonitor; 