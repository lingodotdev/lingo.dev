interface PerformanceMetrics {
  lcp: number;
  fid: number;
  cls: number;
  fcp: number;
  ttfb: number;
  loadTime: number;
  domContentLoaded: number;
  resourceCount: number;
  transferSize: number;
}

class PerformanceMonitor {
  private metrics: Partial<PerformanceMetrics> = {};
  private observers: PerformanceObserver[] = [];

  constructor() {
    this.initializeObservers();
    this.measureNavigationTiming();
    this.measureResourceTiming();
  }

  private initializeObservers() {
    // Core Web Vitals
    const vitalsObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        switch (entry.entryType) {
          case 'largest-contentful-paint':
            this.metrics.lcp = entry.startTime;
            this.reportMetric('LCP', entry.startTime);
            break;
          case 'first-input':
            const fidEntry = entry as PerformanceEventTiming;
            this.metrics.fid = fidEntry.processingStart - fidEntry.startTime;
            this.reportMetric('FID', this.metrics.fid);
            break;
          case 'layout-shift':
            if (!(entry as any).hadRecentInput) {
              this.metrics.cls = (this.metrics.cls || 0) + (entry as any).value;
              this.reportMetric('CLS', this.metrics.cls);
            }
            break;
        }
      });
    });

    vitalsObserver.observe({ 
      entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] 
    });
    this.observers.push(vitalsObserver);

    // Paint timing
    const paintObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          this.metrics.fcp = entry.startTime;
          this.reportMetric('FCP', entry.startTime);
        }
      });
    });

    paintObserver.observe({ entryTypes: ['paint'] });
    this.observers.push(paintObserver);

    // Long tasks
    const longTaskObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        this.reportMetric('Long Task', entry.duration, {
          startTime: entry.startTime,
          attribution: (entry as any).attribution
        });
      });
    });

    try {
      longTaskObserver.observe({ entryTypes: ['longtask'] });
      this.observers.push(longTaskObserver);
    } catch (e) {
      // Long task API not supported
    }
  }

  private measureNavigationTiming() {
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (navigation) {
        this.metrics.ttfb = navigation.responseStart - navigation.requestStart;
        this.metrics.domContentLoaded = navigation.domContentLoadedEventEnd - navigation.navigationStart;
        this.metrics.loadTime = navigation.loadEventEnd - navigation.navigationStart;

        this.reportMetric('TTFB', this.metrics.ttfb);
        this.reportMetric('DOM Content Loaded', this.metrics.domContentLoaded);
        this.reportMetric('Load Time', this.metrics.loadTime);
      }
    });
  }

  private measureResourceTiming() {
    window.addEventListener('load', () => {
      const resources = performance.getEntriesByType('resource');
      
      this.metrics.resourceCount = resources.length;
      this.metrics.transferSize = resources.reduce((total, resource) => {
        return total + ((resource as any).transferSize || 0);
      }, 0);

      this.reportMetric('Resource Count', this.metrics.resourceCount);
      this.reportMetric('Transfer Size', this.metrics.transferSize);

      // Identify slow resources
      const slowResources = resources.filter(resource => resource.duration > 1000);
      if (slowResources.length > 0) {
        this.reportMetric('Slow Resources', slowResources.length, {
          resources: slowResources.map(r => ({ name: r.name, duration: r.duration }))
        });
      }
    });
  }

  private reportMetric(name: string, value: number, extra?: any) {
    // Send to analytics service
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'performance_metric', {
        metric_name: name,
        metric_value: Math.round(value),
        ...extra
      });
    }

    // Console logging for development
    if (process.env.NODE_ENV === 'development') {
      console.log(`Performance: ${name} = ${Math.round(value)}ms`, extra);
    }

    // Send to custom analytics endpoint
    this.sendToAnalytics(name, value, extra);
  }

  private async sendToAnalytics(name: string, value: number, extra?: any) {
    try {
      await fetch('/api/analytics/performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          metric: name,
          value: Math.round(value),
          timestamp: Date.now(),
          url: window.location.href,
          userAgent: navigator.userAgent,
          connection: (navigator as any).connection?.effectiveType,
          ...extra
        })
      });
    } catch (error) {
      // Fail silently for analytics
    }
  }

  public getMetrics(): Partial<PerformanceMetrics> {
    return { ...this.metrics };
  }

  public destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Singleton instance
let performanceMonitor: PerformanceMonitor | null = null;

export function initPerformanceMonitoring() {
  if (typeof window === 'undefined') return;
  
  if (!performanceMonitor) {
    performanceMonitor = new PerformanceMonitor();
  }
  
  return performanceMonitor;
}

export function getPerformanceMetrics() {
  return performanceMonitor?.getMetrics() || {};
}

// Auto-initialize
if (typeof window !== 'undefined') {
  // Wait for page to be interactive
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPerformanceMonitoring);
  } else {
    initPerformanceMonitoring();
  }
}
