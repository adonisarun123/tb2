import React, { useState, useRef, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  onLoad?: () => void;
  onError?: () => void;
  style?: React.CSSProperties;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  onLoad,
  onError,
  style,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState('');
  const imgRef = useRef<HTMLImageElement>(null);

  // Use intersection observer for lazy loading
  const [ref, inView] = useInView({
    threshold: 0.1,
    rootMargin: '50px',
    triggerOnce: true,
  });

  // Load image when in view
  useEffect(() => {
    if (inView && !currentSrc) {
      setCurrentSrc(src);
    }
  }, [inView, src, currentSrc]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Placeholder component
  const Placeholder = () => (
    <div
      className={`bg-gray-200 animate-pulse flex items-center justify-center ${className}`}
      style={{
        width: width || '100%',
        height: height || '200px',
        ...style,
      }}
    >
      <svg
        className="w-10 h-10 text-gray-400"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  );

  // Error fallback
  if (hasError) {
    return <Placeholder />;
  }

  // If not in view, show placeholder
  if (!inView) {
    return (
      <div ref={ref}>
        <Placeholder />
      </div>
    );
  }

  return (
    <div ref={ref} className="relative">
      {!isLoaded && <Placeholder />}
      <img
        ref={imgRef}
        src={currentSrc}
        alt={alt}
        className={`${isLoaded ? 'opacity-100' : 'opacity-0'} ${className} absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-300`}
        style={style}
        width={width}
        height={height}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
      />
    </div>
  );
};

export default LazyImage; 