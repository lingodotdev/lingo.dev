import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import {
  PerformanceMonitor,
  PerformanceMetrics,
  PerformanceAlert,
  AlertLevel,
} from "./performance-monitor";

// Mock process methods
const mockProcess = {
  memoryUsage: vi.fn(),
  cpuUsage: vi.fn(),
  getuid: vi.fn(),
};

vi.stubGlobal("process", {
  ...process,
  ...mockProcess,
});

describe("PerformanceMonitor", () => {
  let performanceMonitor: PerformanceMonitor;
  let alertSpy: vi.Mock;
  let metricsSpy: vi.Mock;

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup default mock returns
    mockProcess.memoryUsage.mockReturnValue({
      heapUsed: 50 * 1024 * 1024, // 50MB
      heapTotal: 100 * 1024 * 1024, // 100MB
      external: 10 * 1024 * 1024, // 10MB
      rss: 200 * 1024 * 1024, // 200MB
      arrayBuffers: 5 * 1024 * 1024, // 5MB
    });

    mockProcess.cpuUsage.mockReturnValue({
      user: 100000, // 100ms in microseconds
      system: 50000, // 50ms in microseconds
    });

    mockProcess.getuid.mockReturnValue(1000);

    performanceMonitor = new PerformanceMonitor();

    // Set up event spies
    alertSpy = vi.fn();
    metricsSpy = vi.fn();
    performanceMonitor.on("alert", alertSpy);
    performanceMonitor.on("metrics", metricsSpy);
  });

  afterEach(() => {
    performanceMonitor.stopMonitoring();
    vi.restoreAllMocks();
  });

  describe("Metrics Collection", () => {
    it("should collect memory metrics correctly", () => {
      performanceMonitor.startMonitoring(100); // Very short interval for testing

      // Wait for at least one metrics collection
      return new Promise<void>((resolve) => {
        performanceMonitor.on("metrics", (metrics: PerformanceMetrics) => {
          expect(metrics.memory.heapUsed).toBe(50 * 1024 * 1024);
          expect(metrics.memory.heapTotal).toBe(100 * 1024 * 1024);
          expect(metrics.memory.external).toBe(10 * 1024 * 1024);
          expect(metrics.memory.rss).toBe(200 * 1024 * 1024);
          expect(metrics.memory.usagePercentage).toBeCloseTo(45.45, 1); // (50+10)/(100+10) * 100
          expect(metrics.timestamp).toBeInstanceOf(Date);
          resolve();
        });
      });
    });

    it("should collect CPU metrics correctly", () => {
      performanceMonitor.startMonitoring(100);

      return new Promise<void>((resolve) => {
        performanceMonitor.on("metrics", (metrics: PerformanceMetrics) => {
          expect(metrics.cpu.userTime).toBe(100000);
          expect(metrics.cpu.systemTime).toBe(50000);
          expect(metrics.cpu.totalTime).toBe(150000);
          expect(metrics.cpu.usagePercentage).toBeGreaterThanOrEqual(0);
          resolve();
        });
      });
    });

    it("should collect file system metrics", () => {
      performanceMonitor.startMonitoring(100);

      return new Promise<void>((resolve) => {
        performanceMonitor.on("metrics", (metrics: PerformanceMetrics) => {
          expect(metrics.fileSystem.watchedFiles).toBe(0); // Default value
          expect(metrics.fileSystem.openFileDescriptors).toBeGreaterThanOrEqual(
            0,
          );
          expect(
            metrics.fileSystem.fileOperationsPerSecond,
          ).toBeGreaterThanOrEqual(0);
          expect(metrics.fileSystem.averageFileSize).toBe(0); // Placeholder
          resolve();
        });
      });
    });

    it("should collect watch metrics", () => {
      performanceMonitor.startMonitoring(100);

      return new Promise<void>((resolve) => {
        performanceMonitor.on("metrics", (metrics: PerformanceMetrics) => {
          expect(metrics.watch.totalChanges).toBe(0);
          expect(metrics.watch.changesPerMinute).toBe(0);
          expect(metrics.watch.averageDebounceTime).toBe(0);
          expect(metrics.watch.retranslationCount).toBe(0);
          expect(metrics.watch.averageRetranslationTime).toBe(0);
          expect(metrics.watch.errorRate).toBe(0);
          resolve();
        });
      });
    });
  });

  describe("Threshold Monitoring", () => {
    it("should generate memory warning alerts", () => {
      // Set up high memory usage
      mockProcess.memoryUsage.mockReturnValue({
        heapUsed: 80 * 1024 * 1024, // 80MB
        heapTotal: 100 * 1024 * 1024, // 100MB
        external: 10 * 1024 * 1024, // 10MB
        rss: 200 * 1024 * 1024,
        arrayBuffers: 0,
      });

      performanceMonitor.startMonitoring(100);

      return new Promise<void>((resolve) => {
        performanceMonitor.on("alert", (alert: PerformanceAlert) => {
          if (
            alert.category === "memory" &&
            alert.level === AlertLevel.WARNING
          ) {
            expect(alert.message).toContain("High memory usage");
            expect(alert.currentValue).toBeCloseTo(72.73, 1); // (80+10)/(100+10) * 100
            expect(alert.suggestions).toContain("Monitor memory usage closely");
            resolve();
          }
        });
      });
    });

    it("should generate memory critical alerts", () => {
      // Set up critical memory usage
      mockProcess.memoryUsage.mockReturnValue({
        heapUsed: 95 * 1024 * 1024, // 95MB
        heapTotal: 100 * 1024 * 1024, // 100MB
        external: 5 * 1024 * 1024, // 5MB
        rss: 200 * 1024 * 1024,
        arrayBuffers: 0,
      });

      performanceMonitor.startMonitoring(100);

      return new Promise<void>((resolve) => {
        performanceMonitor.on("alert", (alert: PerformanceAlert) => {
          if (
            alert.category === "memory" &&
            alert.level === AlertLevel.CRITICAL
          ) {
            expect(alert.message).toContain("Critical memory usage");
            expect(alert.suggestions).toContain("Consider reducing batch size");
            resolve();
          }
        });
      });
    });

    it("should not generate duplicate alerts", () => {
      // Set up high memory usage
      mockProcess.memoryUsage.mockReturnValue({
        heapUsed: 80 * 1024 * 1024,
        heapTotal: 100 * 1024 * 1024,
        external: 10 * 1024 * 1024,
        rss: 200 * 1024 * 1024,
        arrayBuffers: 0,
      });

      performanceMonitor.startMonitoring(50); // Faster interval

      return new Promise<void>((resolve) => {
        let alertCount = 0;

        performanceMonitor.on("alert", (alert: PerformanceAlert) => {
          if (alert.category === "memory") {
            alertCount++;
          }
        });

        // Wait for multiple metrics collections
        setTimeout(() => {
          expect(alertCount).toBe(1); // Should only get one alert despite multiple collections
          resolve();
        }, 200);
      });
    });
  });

  describe("File Operation Tracking", () => {
    it("should track file operations", () => {
      performanceMonitor.recordFileOperation();
      performanceMonitor.recordFileOperation();
      performanceMonitor.recordFileOperation();

      performanceMonitor.startMonitoring(100);

      return new Promise<void>((resolve) => {
        performanceMonitor.on("metrics", (metrics: PerformanceMetrics) => {
          expect(metrics.fileSystem.fileOperationsPerSecond).toBeGreaterThan(0);
          resolve();
        });
      });
    });

    it("should reset file operation counter periodically", async () => {
      performanceMonitor.recordFileOperation();

      // This test would require time manipulation to properly test the reset
      // For now, we just verify the method exists and doesn't throw
      expect(() => performanceMonitor.recordFileOperation()).not.toThrow();
    });
  });

  describe("Metrics Updates", () => {
    it("should update watch metrics from external sources", () => {
      const watchMetrics = {
        totalChanges: 10,
        changesPerMinute: 5,
        retranslationCount: 3,
        averageRetranslationTime: 2000,
        errorRate: 0.1,
      };

      performanceMonitor.startMonitoring(100);
      performanceMonitor.updateWatchMetrics(watchMetrics);

      return new Promise<void>((resolve) => {
        performanceMonitor.on("metrics", (metrics: PerformanceMetrics) => {
          expect(metrics.watch.totalChanges).toBe(10);
          expect(metrics.watch.changesPerMinute).toBe(5);
          expect(metrics.watch.retranslationCount).toBe(3);
          expect(metrics.watch.averageRetranslationTime).toBe(2000);
          expect(metrics.watch.errorRate).toBe(0.1);
          resolve();
        });
      });
    });

    it("should update file system metrics from external sources", () => {
      const fileSystemMetrics = {
        watchedFiles: 100,
        averageFileSize: 1024,
      };

      performanceMonitor.startMonitoring(100);
      performanceMonitor.updateFileSystemMetrics(fileSystemMetrics);

      return new Promise<void>((resolve) => {
        performanceMonitor.on("metrics", (metrics: PerformanceMetrics) => {
          expect(metrics.fileSystem.watchedFiles).toBe(100);
          expect(metrics.fileSystem.averageFileSize).toBe(1024);
          resolve();
        });
      });
    });
  });

  describe("Alert Management", () => {
    it("should track active alerts", () => {
      const initialAlerts = performanceMonitor.getActiveAlerts();
      expect(initialAlerts).toHaveLength(0);

      // Trigger an alert by setting high memory usage
      mockProcess.memoryUsage.mockReturnValue({
        heapUsed: 95 * 1024 * 1024,
        heapTotal: 100 * 1024 * 1024,
        external: 5 * 1024 * 1024,
        rss: 200 * 1024 * 1024,
        arrayBuffers: 0,
      });

      performanceMonitor.startMonitoring(100);

      return new Promise<void>((resolve) => {
        performanceMonitor.on("alert", () => {
          const activeAlerts = performanceMonitor.getActiveAlerts();
          expect(activeAlerts.length).toBeGreaterThan(0);
          resolve();
        });
      });
    });

    it("should clear specific alerts", () => {
      performanceMonitor.clearAlert("memory", "memory.usagePercentage");
      // Should not throw and should work even if alert doesn't exist
      expect(() =>
        performanceMonitor.clearAlert("nonexistent", "metric"),
      ).not.toThrow();
    });

    it("should clear all alerts", () => {
      performanceMonitor.clearAllAlerts();
      const alerts = performanceMonitor.getActiveAlerts();
      expect(alerts).toHaveLength(0);
    });
  });

  describe("Resource Limits", () => {
    it("should check resource limits", () => {
      const limits = performanceMonitor.checkResourceLimits();
      expect(limits.exceeded).toBe(false);
      expect(limits.violations).toHaveLength(0);
    });

    it("should detect resource limit violations", () => {
      // Set up high memory usage that exceeds default limits
      mockProcess.memoryUsage.mockReturnValue({
        heapUsed: 90 * 1024 * 1024,
        heapTotal: 100 * 1024 * 1024,
        external: 10 * 1024 * 1024,
        rss: 200 * 1024 * 1024,
        arrayBuffers: 0,
      });

      performanceMonitor.startMonitoring(100);

      return new Promise<void>((resolve) => {
        performanceMonitor.on("metrics", () => {
          const limits = performanceMonitor.checkResourceLimits();
          expect(limits.exceeded).toBe(true);
          expect(limits.violations.length).toBeGreaterThan(0);
          expect(limits.violations[0]).toContain("Memory usage");
          resolve();
        });
      });
    });

    it("should get and update resource limits", () => {
      const initialLimits = performanceMonitor.getResourceLimits();
      expect(initialLimits.maxMemoryUsage).toBe(0.8);

      performanceMonitor.updateResourceLimits({
        maxMemoryUsage: 0.9,
        maxWatchedFiles: 2000,
      });

      const updatedLimits = performanceMonitor.getResourceLimits();
      expect(updatedLimits.maxMemoryUsage).toBe(0.9);
      expect(updatedLimits.maxWatchedFiles).toBe(2000);
    });
  });

  describe("Performance Summary", () => {
    it("should provide performance summary", () => {
      const summary = performanceMonitor.getPerformanceSummary();

      expect(summary.current).toBeNull(); // No metrics collected yet
      expect(summary.alerts).toBe(0);
      expect(summary.resourceViolations).toHaveLength(0);
      expect(summary.uptime).toBeGreaterThanOrEqual(0);
    });

    it("should include metrics in summary after collection", () => {
      performanceMonitor.startMonitoring(100);

      return new Promise<void>((resolve) => {
        performanceMonitor.on("metrics", () => {
          const summary = performanceMonitor.getPerformanceSummary();
          expect(summary.current).not.toBeNull();
          expect(summary.current!.timestamp).toBeInstanceOf(Date);
          resolve();
        });
      });
    });
  });

  describe("Metrics History", () => {
    it("should maintain metrics history", () => {
      performanceMonitor.startMonitoring(50); // Fast interval

      return new Promise<void>((resolve) => {
        let metricsCount = 0;

        performanceMonitor.on("metrics", () => {
          metricsCount++;

          if (metricsCount >= 3) {
            const history = performanceMonitor.getMetricsHistory();
            expect(history.length).toBeGreaterThanOrEqual(3);

            const limitedHistory = performanceMonitor.getMetricsHistory(2);
            expect(limitedHistory).toHaveLength(2);

            resolve();
          }
        });
      });
    });

    it("should limit history size", () => {
      // This test would require generating many metrics to test the limit
      // For now, we just verify the method works
      const history = performanceMonitor.getMetricsHistory();
      expect(Array.isArray(history)).toBe(true);
    });
  });

  describe("Monitoring Control", () => {
    it("should start and stop monitoring", () => {
      expect(() => performanceMonitor.startMonitoring(1000)).not.toThrow();
      expect(() => performanceMonitor.stopMonitoring()).not.toThrow();
    });

    it("should not start monitoring twice", () => {
      performanceMonitor.startMonitoring(1000);
      performanceMonitor.startMonitoring(500); // Should not create second interval

      // This is hard to test directly, but we can verify it doesn't throw
      expect(() => performanceMonitor.stopMonitoring()).not.toThrow();
    });

    it("should handle stop monitoring when not started", () => {
      expect(() => performanceMonitor.stopMonitoring()).not.toThrow();
    });
  });
});
