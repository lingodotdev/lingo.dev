import { useState, useEffect, useCallback } from 'react';

interface NetworkStatus {
  isOnline: boolean;
  effectiveType: '2g' | '3g' | '4g' | 'slow-2g' | 'unknown';
  downlink: number;
  rtt: number;
  saveData: boolean;
  isSlowConnection: boolean;
  bandwidth: 'low' | 'medium' | 'high';
}

interface NetworkConnection extends EventTarget {
  effectiveType: '2g' | '3g' | '4g' | 'slow-2g';
  downlink: number;
  rtt: number;
  saveData: boolean;
}

declare global {
  interface Navigator {
    connection?: NetworkConnection;
    mozConnection?: NetworkConnection;
    webkitConnection?: NetworkConnection;
  }
}

export function useNetworkStatus(): NetworkStatus {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isOnline: true,
    effectiveType: '4g',
    downlink: 10,
    rtt: 100,
    saveData: false,
    isSlowConnection: false,
    bandwidth: 'high',
  });

  const getBandwidthCategory = useCallback((downlink: number, effectiveType: string): 'low' | 'medium' | 'high' => {
    if (effectiveType === '2g' || effectiveType === 'slow-2g' || downlink < 1.5) return 'low';
    if (effectiveType === '3g' || downlink < 5) return 'medium';
    return 'high';
  }, []);

  const updateNetworkStatus = useCallback(() => {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const isOnline = navigator.onLine;
    
    if (connection) {
      const effectiveType = connection.effectiveType || '4g';
      const downlink = connection.downlink || 10;
      const rtt = connection.rtt || 100;
      const saveData = connection.saveData || false;
      const isSlowConnection = effectiveType === '2g' || effectiveType === 'slow-2g' || downlink < 1.5;
      const bandwidth = getBandwidthCategory(downlink, effectiveType);

      setNetworkStatus({
        isOnline,
        effectiveType,
        downlink,
        rtt,
        saveData,
        isSlowConnection,
        bandwidth,
      });
    } else {
      setNetworkStatus(prev => ({
        ...prev,
        isOnline,
      }));
    }
  }, [getBandwidthCategory]);

  useEffect(() => {
    updateNetworkStatus();
    
    const handleOnline = () => updateNetworkStatus();
    const handleOffline = () => updateNetworkStatus();
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection) {
      connection.addEventListener('change', updateNetworkStatus);
    }

    // Periodic bandwidth test
    const bandwidthTest = setInterval(() => {
      if (navigator.onLine) {
        measureBandwidth().then(speed => {
          setNetworkStatus(prev => ({
            ...prev,
            downlink: speed,
            bandwidth: getBandwidthCategory(speed, prev.effectiveType),
            isSlowConnection: speed < 1.5,
          }));
        });
      }
    }, 30000); // Test every 30 seconds

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (connection) {
        connection.removeEventListener('change', updateNetworkStatus);
      }
      clearInterval(bandwidthTest);
    };
  }, [updateNetworkStatus, getBandwidthCategory]);

  return networkStatus;
}

async function measureBandwidth(): Promise<number> {
  try {
    const startTime = performance.now();
    const response = await fetch('/api/bandwidth-test?size=100kb', { 
      cache: 'no-cache' 
    });
    const endTime = performance.now();
    
    if (response.ok) {
      const sizeInBits = 100 * 1024 * 8; // 100KB in bits
      const durationInSeconds = (endTime - startTime) / 1000;
      const speedMbps = (sizeInBits / durationInSeconds) / (1024 * 1024);
      return speedMbps;
    }
  } catch (error) {
    console.warn('Bandwidth test failed:', error);
  }
  
  return 10; // Default fallback
}
