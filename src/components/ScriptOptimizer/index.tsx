import React, { useEffect } from 'react';
import { safeRemoveElementsBySelector } from '../../lib/domUtils';

interface Script {
  src: string;
  async?: boolean;
  defer?: boolean;
  id?: string;
  strategy: 'beforeInteractive' | 'afterInteractive' | 'lazyOnload' | 'onUserInteraction';
  onLoad?: () => void;
  attrs?: Record<string, string>;
}

interface ScriptOptimizerProps {
  scripts: Script[];
  debug?: boolean;
}

/**
 * ScriptOptimizer Component
 * 
 * Strategically loads scripts based on priority to optimize Core Web Vitals:
 * - beforeInteractive: Critical scripts loaded immediately
 * - afterInteractive: Scripts loaded after page becomes interactive
 * - lazyOnload: Scripts loaded during browser idle time
 * - onUserInteraction: Scripts loaded only after user interacts with the page
 * 
 * This component helps improve FID (First Input Delay) and TTI (Time to Interactive)
 * by preventing script execution from blocking the main thread during critical rendering.
 */
const ScriptOptimizer: React.FC<ScriptOptimizerProps> = ({ scripts, debug = false }) => {
  useEffect(() => {
    // Track loaded scripts to prevent duplicates
    const loadedScripts = new Set<string>();
    
    // Load immediate scripts (beforeInteractive)
    const immediateScripts = scripts.filter(script => script.strategy === 'beforeInteractive');
    loadScripts(immediateScripts, 'beforeInteractive');
    
    // Load scripts after DOM content loaded (afterInteractive)
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        const afterInteractiveScripts = scripts.filter(script => script.strategy === 'afterInteractive');
        loadScripts(afterInteractiveScripts, 'afterInteractive');
      });
    } else {
      const afterInteractiveScripts = scripts.filter(script => script.strategy === 'afterInteractive');
      loadScripts(afterInteractiveScripts, 'afterInteractive');
    }
    
    // Load scripts during idle time (lazyOnload)
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        const lazyScripts = scripts.filter(script => script.strategy === 'lazyOnload');
        loadScripts(lazyScripts, 'lazyOnload');
      }, { timeout: 5000 });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => {
        const lazyScripts = scripts.filter(script => script.strategy === 'lazyOnload');
        loadScripts(lazyScripts, 'lazyOnload');
      }, 5000);
    }
    
    // Load scripts on user interaction (onUserInteraction)
    const userInteractionEvents = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click'];
    const handleUserInteraction = () => {
      const interactionScripts = scripts.filter(script => script.strategy === 'onUserInteraction');
      loadScripts(interactionScripts, 'onUserInteraction');
      
      // Remove event listeners after first interaction
      userInteractionEvents.forEach(event => {
        window.removeEventListener(event, handleUserInteraction);
      });
    };
    
    userInteractionEvents.forEach(event => {
      window.addEventListener(event, handleUserInteraction, { passive: true, once: true });
    });
    
    // Function to load a group of scripts
    function loadScripts(scriptsToLoad: Script[], strategy: string) {
      // Sort scripts by order of loading
      scriptsToLoad.forEach((script, index) => {
        // Skip if already loaded
        if (loadedScripts.has(script.src)) {
          if (debug) console.log(`[ScriptOptimizer] Skipping already loaded script: ${script.src}`);
          return;
        }
        
        // Stagger loading to prevent network contention
        setTimeout(() => {
          createAndLoadScript(script, strategy);
          loadedScripts.add(script.src);
        }, index * 200); // 200ms delay between each script
      });
    }
    
    // Create and inject script element
    function createAndLoadScript(script: Script, strategy: string) {
      if (debug) console.log(`[ScriptOptimizer] Loading ${strategy} script: ${script.src}`);
      
      const scriptElement = document.createElement('script');
      scriptElement.src = script.src;
      
      // Set attributes
      if (script.async) scriptElement.async = true;
      if (script.defer) scriptElement.defer = true;
      if (script.id) scriptElement.id = script.id;
      
      // Add custom attributes
      if (script.attrs) {
        Object.entries(script.attrs).forEach(([key, value]) => {
          scriptElement.setAttribute(key, value);
        });
      }
      
      // Add debugging attribute
      scriptElement.setAttribute('data-loading-strategy', strategy);
      
      // Add load event handler
      if (script.onLoad) {
        scriptElement.onload = script.onLoad;
      }
      
      // Add error handling
      scriptElement.onerror = (error) => {
        console.error(`[ScriptOptimizer] Failed to load script: ${script.src}`, error);
      };
      
      // Append to document
      document.head.appendChild(scriptElement);
    }
    
    // Cleanup function
    return () => {
      // Remove event listeners
      userInteractionEvents.forEach(event => {
        window.removeEventListener(event, handleUserInteraction);
      });
      
      // Safely remove any script elements with our custom attribute that might cause issues
      safeRemoveElementsBySelector('script[data-loading-strategy]');
    };
  }, [scripts, debug]);
  
  // Component doesn't render anything visible
  return null;
};

export default ScriptOptimizer;