import { useState, useRef, useEffect, useMemo } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  blurDataURL?: string;
  priority?: boolean;
  sizes?: string;
  quality?: number;
}

export default function LazyImage({ 
  src, 
  alt, 
  className, 
  placeholder,
  blurDataURL,
  priority = false,
  sizes = '100vw',
  quality = 75
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Generate responsive srcSet
  const srcSet = useMemo(() => {
    const widths = [640, 750, 828, 1080, 1200, 1920];
    return widths.map(w => `${src}?w=${w}&q=${quality} ${w}w`).join(', ');
  }, [src, quality]);

  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '50px 0px'
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  // Preload critical images
  useEffect(() => {
    if (priority && typeof window !== 'undefined') {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    }
  }, [src, priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    setError(false);
  };

  const handleError = () => {
    setError(true);
    setIsLoaded(false);
  };

  return (
    <div 
      className={`relative overflow-hidden ${className}`} 
      ref={imgRef}
      style={{
        background: blurDataURL ? `url(${blurDataURL})` : '#f0f0f0',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {isInView && !error && (
        <img
          src={src}
          srcSet={srcSet}
          sizes={sizes}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          style={{
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      )}
      
      {!isLoaded && !error && placeholder && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-pulse text-gray-400">{placeholder}</div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-gray-400">Failed to load image</div>
        </div>
      )}
    </div>
  );
}
