import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { useEffect, useState, Suspense, lazy } from 'react';

interface ProgressiveContentProps {
  children: React.ReactNode;
  lightContent?: React.ReactNode;
  className?: string;
  preloadResources?: string[];
  criticalResources?: string[];
  adaptiveImages?: boolean;
}

export default function ProgressiveContent({ 
  children, 
  lightContent, 
  className,
  preloadResources = [],
  criticalResources = [],
  adaptiveImages = true
}: ProgressiveContentProps) {
  const { isSlowConnection, isOnline, saveData, bandwidth } = useNetworkStatus();
  const [resourcesLoaded, setResourcesLoaded] = useState(false);

  // Preload critical resources
  useEffect(() => {
    if (!isOnline) return;

    const loadResources = async () => {
      // Preload critical resources immediately
      criticalResources.forEach(url => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = url;
        link.as = url.endsWith('.css') ? 'style' : 
                  url.endsWith('.js') ? 'script' : 'fetch';
        document.head.appendChild(link);
      });

      // Conditionally preload non-critical resources
      if (!isSlowConnection && !saveData) {
        preloadResources.forEach(url => {
          const link = document.createElement('link');
          link.rel = 'prefetch';
          link.href = url;
          document.head.appendChild(link);
        });
      }

      setResourcesLoaded(true);
    };

    loadResources();
  }, [isOnline, isSlowConnection, saveData, preloadResources, criticalResources]);

  // Add adaptive image quality based on network
  useEffect(() => {
    if (adaptiveImages) {
      const quality = bandwidth === 'low' ? 30 : 
                    bandwidth === 'medium' ? 60 : 80;
      
      document.documentElement.style.setProperty('--image-quality', quality.toString());
    }
  }, [bandwidth, adaptiveImages]);

  if (!isOnline) {
    return (
      <div className={`${className} offline-content`}>
        <div className="text-center p-4 bg-gray-100 rounded">
          <h3>You're offline</h3>
          <p>Some content may not be available</p>
        </div>
      </div>
    );
  }

  // Data saver mode - always show light content
  if (saveData && lightContent) {
    return (
      <div className={className}>
        {lightContent}
        <div className="text-xs text-gray-500 mt-2">
          Data saver mode active
        </div>
      </div>
    );
  }

  // Slow connection - show light content with option to load full
  if (isSlowConnection && lightContent) {
    return (
      <div className={className}>
        {lightContent}
        <button 
          onClick={() => setResourcesLoaded(true)}
          className="mt-2 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Load full content
        </button>
      </div>
    );
  }

  // Progressive enhancement based on bandwidth
  const ContentComponent = bandwidth === 'high' ? 
    lazy(() => import('./HighBandwidthContent')) :
    bandwidth === 'medium' ?
    lazy(() => import('./MediumBandwidthContent')) :
    lazy(() => import('./LowBandwidthContent'));

  return (
    <div className={className}>
      <Suspense fallback={
        <div className="animate-pulse bg-gray-200 h-32 rounded"></div>
      }>
        {resourcesLoaded ? (
          <ContentComponent>{children}</ContentComponent>
        ) : (
          lightContent || <div>Loading...</div>
        )}
      </Suspense>
    </div>
  );
}
