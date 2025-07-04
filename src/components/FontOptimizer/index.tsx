import React, { useEffect } from 'react';

interface FontDefinition {
  family: string;
  weights?: number[];
  styles?: ('normal' | 'italic')[];
  display?: 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
  preload?: boolean;
  unicode?: string;
  variable?: boolean;
  isLocal?: boolean;
  source?: 'google' | 'adobe' | 'custom';
  fallbackFontFamily?: string;
}

interface FontOptimizerProps {
  fonts: FontDefinition[];
  enablePreloading?: boolean;
  enableFallbackFonts?: boolean;
  enableFontStyleOptimization?: boolean;
}

/**
 * FontOptimizer Component
 * 
 * Optimizes font loading to improve Core Web Vitals:
 * - Prevents CLS (Cumulative Layout Shift) by adding font-display:swap strategy
 * - Improves LCP (Largest Contentful Paint) by preloading critical fonts
 * - Prevents invisible text during font loading
 * - Provides system font fallbacks to maintain consistent layout
 * 
 * This component helps avoid layout shifts due to font loading and ensures
 * text is visible during web font loading.
 */
const FontOptimizer: React.FC<FontOptimizerProps> = ({
  fonts,
  enablePreloading = true,
  enableFallbackFonts = true,
  enableFontStyleOptimization = true,
}) => {
  useEffect(() => {
    // Generate preconnect links for font domains
    const addPreconnects = () => {
      const domains = new Set<string>();
      
      // Determine domains to preconnect based on font sources
      fonts.forEach(font => {
        if (font.isLocal) return;
        
        if (font.source === 'google') {
          domains.add('https://fonts.googleapis.com');
          domains.add('https://fonts.gstatic.com');
        } else if (font.source === 'adobe') {
          domains.add('https://use.typekit.net');
        }
      });
      
      // Add preconnect links for each domain
      domains.forEach(domain => {
        if (!document.querySelector(`link[rel="preconnect"][href="${domain}"]`)) {
          const link = document.createElement('link');
          link.rel = 'preconnect';
          link.href = domain;
          link.crossOrigin = 'anonymous';
          document.head.appendChild(link);
        }
      });
    };

    // Preload critical fonts to improve LCP
    const preloadCriticalFonts = () => {
      if (!enablePreloading) return;
      
      const criticalFonts = fonts.filter(font => font.preload);
      
      criticalFonts.forEach(font => {
        if (font.isLocal) return; // Skip local fonts
        
        let fontUrl = '';
        
        // Generate the appropriate font URL based on source
        if (font.source === 'google') {
          // Regular weight and style for simplicity
          const weight = font.weights?.[0] || 400;
          const style = font.styles?.[0] || 'normal';
          fontUrl = `https://fonts.googleapis.com/css2?family=${font.family.replace(/\s+/g, '+')}:wght@${weight}${style === 'italic' ? 'ital' : ''}&display=${font.display || 'swap'}`;
        }
        
        if (fontUrl && !document.querySelector(`link[rel="preload"][href*="${encodeURIComponent(font.family)}"]`)) {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.href = fontUrl;
          link.as = 'font';
          link.type = 'font/woff2';
          link.crossOrigin = 'anonymous';
          document.head.appendChild(link);
        }
      });
    };
    
    // Add CSS for font-display and font-family fallbacks
    const addFontOptimizationStyles = () => {
      if (!enableFontStyleOptimization) return;
      
      const styleElement = document.createElement('style');
      styleElement.id = 'font-optimization-styles';
      
      let css = '';
      
      fonts.forEach(font => {
        // Generate system font fallbacks
        let fallbackFonts = '';
        if (enableFallbackFonts) {
          if (font.fallbackFontFamily) {
            fallbackFonts = font.fallbackFontFamily;
          } else {
            // Default system font fallbacks based on font style
            if (font.family.toLowerCase().includes('serif')) {
              fallbackFonts = 'Georgia, Times New Roman, serif';
            } else if (font.family.toLowerCase().includes('mono')) {
              fallbackFonts = 'Consolas, Monaco, monospace';
            } else {
              fallbackFonts = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif';
            }
          }
        }
        
        // Add CSS rule for this font
        css += `
          /* Font optimization for ${font.family} */
          @font-face {
            font-family: '${font.family}';
            font-display: ${font.display || 'swap'};
            src: local('${font.family}');
          }
          
          .font-${font.family.toLowerCase().replace(/\s+/g, '-')} {
            font-family: '${font.family}', ${fallbackFonts};
          }
        `;
        
        // Size-adjust property for better CLS prevention
        css += `
          /* Size-adjust for preventing CLS */
          @font-face {
            font-family: '${font.family}-fallback';
            size-adjust: 100%;
            src: local('${fallbackFonts.split(',')[0].trim()}');
          }
        `;
      });
      
      styleElement.textContent = css;
      document.head.appendChild(styleElement);
    };
    
    // Apply font loading optimization techniques
    addPreconnects();
    preloadCriticalFonts();
    addFontOptimizationStyles();
    
    // Clean up when component unmounts
    return () => {
      const styleElement = document.getElementById('font-optimization-styles');
      if (styleElement) {
        styleElement.remove();
      }
    };
  }, [fonts, enablePreloading, enableFallbackFonts, enableFontStyleOptimization]);
  
  // Component doesn't render anything visible
  return null;
};

export default FontOptimizer;