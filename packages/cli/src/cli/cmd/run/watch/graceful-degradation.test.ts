import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  GracefulDegradationManager,
  DegradationLevel,
} from "./graceful-degradation";
import { RecoverableError, ErrorSeverity } from "./error-recovery";
import { WatchConfiguration } from "./types";

describe("GracefulDegradationManager", () => {
  let degradationManager: GracefulDegradationManager;
  let mockConfig: WatchConfiguration;

  beforeEach(() => {
    degradationManager = new GracefulDegradationManager();
    mockConfig = {
      patterns: {
        include: ["**/*.json"],
        exclude: ["node_modules/**"],
      },
      debounce: {
        delay: 5000,
        maxWait: 30000,
      },
      monitoring: {
        enableProgressIndicators: true,
        enableNotifications: true,
        logLevel: "verbose",
      },
      performance: {
        batchSize: 50,
        rateLimitDelay: 100,
      },
    };
  });

  describe("Degradation Level Evaluation", () => {
    it("should remain at normal level with no errors", () => {
      const errors: RecoverableError[] = [];
      const systemMetrics = {
        memoryUsage: 0.5,
        cpuUsage: 0.3,
        fileDescriptors: 100,
        watchedFiles: 50,
      };

      const decision = degradationManager.evaluateDegradation(
        errors,
        systemMetrics,
      );
      expect(decision.shouldDegrade).toBe(false);
      expect(decision.targetLevel).toBe(DegradationLevel.NORMAL);
    });

    it("should degrade to reduced level with moderate errors", () => {
      const errors: RecoverableError[] = [
        {
          type: "file_system",
          message: "File access error 1",
          recoverable: true,
          category: "file_system" as any,
          severity: ErrorSeverity.HIGH,
          retryCount: 1,
          lastRetryAt: new Date(),
        },
        {
          type: "file_system",
          message: "File access error 2",
          recoverable: true,
          category: "file_system" as any,
          severity: ErrorSeverity.HIGH,
          retryCount: 1,
          lastRetryAt: new Date(),
        },
        {
          type: "file_system",
          message: "File access error 3",
          recoverable: true,
          category: "file_system" as any,
          severity: ErrorSeverity.HIGH,
          retryCount: 1,
          lastRetryAt: new Date(),
        },
      ];

      const systemMetrics = {
        memoryUsage: 0.7,
        cpuUsage: 0.6,
        fileDescriptors: 500,
        watchedFiles: 200,
      };

      const decision = degradationManager.evaluateDegradation(
        errors,
        systemMetrics,
      );
      expect(decision.shouldDegrade).toBe(true);
      expect(decision.targetLevel).toBe(DegradationLevel.REDUCED);
    });

    it("should degrade to minimal level with high error count", () => {
      const errors: RecoverableError[] = Array.from({ length: 15 }, (_, i) => ({
        type: "file_system",
        message: `Error ${i}`,
        recoverable: true,
        category: "file_system" as any,
        severity: ErrorSeverity.MEDIUM,
        retryCount: 1,
        lastRetryAt: new Date(),
      }));

      const systemMetrics = {
        memoryUsage: 0.8,
        cpuUsage: 0.7,
        fileDescriptors: 800,
        watchedFiles: 500,
      };

      const decision = degradationManager.evaluateDegradation(
        errors,
        systemMetrics,
      );
      expect(decision.shouldDegrade).toBe(true);
      expect(decision.targetLevel).toBe(DegradationLevel.MINIMAL);
    });

    it("should degrade to emergency level with critical errors", () => {
      const errors: RecoverableError[] = [
        {
          type: "file_system",
          message: "Critical system error",
          recoverable: true,
          category: "resource" as any,
          severity: ErrorSeverity.CRITICAL,
          retryCount: 1,
          lastRetryAt: new Date(),
        },
      ];

      const systemMetrics = {
        memoryUsage: 0.95,
        cpuUsage: 0.9,
        fileDescriptors: 1000,
        watchedFiles: 1000,
      };

      const decision = degradationManager.evaluateDegradation(
        errors,
        systemMetrics,
      );
      expect(decision.shouldDegrade).toBe(true);
      expect(decision.targetLevel).toBe(DegradationLevel.EMERGENCY);
    });
  });

  describe("Configuration Degradation", () => {
    it("should create reduced configuration correctly", async () => {
      const degradedConfig = await degradationManager.applyDegradation(
        DegradationLevel.REDUCED,
        mockConfig,
        "Test degradation",
      );

      expect(degradedConfig.degradationLevel).toBe(DegradationLevel.REDUCED);
      expect(degradedConfig.monitoring.enableNotifications).toBe(false);
      expect(degradedConfig.performance.batchSize).toBeLessThanOrEqual(25);
      expect(degradedConfig.performance.rateLimitDelay).toBeGreaterThanOrEqual(
        200,
      );
      expect(degradedConfig.debounce.delay).toBeGreaterThanOrEqual(3000);
    });

    it("should create minimal configuration correctly", async () => {
      const degradedConfig = await degradationManager.applyDegradation(
        DegradationLevel.MINIMAL,
        mockConfig,
        "Test minimal degradation",
      );

      expect(degradedConfig.degradationLevel).toBe(DegradationLevel.MINIMAL);
      expect(degradedConfig.monitoring.enableNotifications).toBe(false);
      expect(degradedConfig.monitoring.enableProgressIndicators).toBe(false);
      expect(degradedConfig.monitoring.logLevel).toBe("minimal");
      expect(degradedConfig.performance.batchSize).toBeLessThanOrEqual(10);
      expect(degradedConfig.performance.rateLimitDelay).toBeGreaterThanOrEqual(
        500,
      );
      expect(degradedConfig.debounce.delay).toBeGreaterThanOrEqual(5000);
    });

    it("should create emergency configuration correctly", async () => {
      const degradedConfig = await degradationManager.applyDegradation(
        DegradationLevel.EMERGENCY,
        mockConfig,
        "Test emergency degradation",
      );

      expect(degradedConfig.degradationLevel).toBe(DegradationLevel.EMERGENCY);
      expect(degradedConfig.monitoring.enableNotifications).toBe(false);
      expect(degradedConfig.monitoring.enableProgressIndicators).toBe(false);
      expect(degradedConfig.monitoring.logLevel).toBe("silent");
      expect(degradedConfig.performance.batchSize).toBe(5);
      expect(degradedConfig.performance.rateLimitDelay).toBe(1000);
      expect(degradedConfig.debounce.delay).toBe(10000);
      expect(degradedConfig.debounce.maxWait).toBe(30000);
      expect(degradedConfig.disabledFeatures).toContain("notifications");
      expect(degradedConfig.disabledFeatures).toContain("progress_indicators");
      expect(degradedConfig.disabledFeatures).toContain("verbose_logging");
    });
  });

  describe("Feature Flags", () => {
    it("should enable all features at normal level", () => {
      expect(
        degradationManager.isFeatureEnabled("enableProgressIndicators"),
      ).toBe(true);
      expect(degradationManager.isFeatureEnabled("enableNotifications")).toBe(
        true,
      );
      expect(degradationManager.isFeatureEnabled("enableDetailedLogging")).toBe(
        true,
      );
      expect(
        degradationManager.isFeatureEnabled("enablePatternExpansion"),
      ).toBe(true);
      expect(
        degradationManager.isFeatureEnabled("enableAdvancedDebouncing"),
      ).toBe(true);
      expect(
        degradationManager.isFeatureEnabled("enableStatisticsTracking"),
      ).toBe(true);
      expect(
        degradationManager.isFeatureEnabled("enablePerformanceMonitoring"),
      ).toBe(true);
    });

    it("should disable notifications at reduced level", async () => {
      await degradationManager.applyDegradation(
        DegradationLevel.REDUCED,
        mockConfig,
        "Test",
      );

      expect(degradationManager.isFeatureEnabled("enableNotifications")).toBe(
        false,
      );
      expect(
        degradationManager.isFeatureEnabled("enableProgressIndicators"),
      ).toBe(true);
      expect(degradationManager.isFeatureEnabled("enableDetailedLogging")).toBe(
        true,
      );
    });

    it("should disable multiple features at minimal level", async () => {
      await degradationManager.applyDegradation(
        DegradationLevel.MINIMAL,
        mockConfig,
        "Test",
      );

      expect(degradationManager.isFeatureEnabled("enableNotifications")).toBe(
        false,
      );
      expect(
        degradationManager.isFeatureEnabled("enableProgressIndicators"),
      ).toBe(false);
      expect(degradationManager.isFeatureEnabled("enableDetailedLogging")).toBe(
        false,
      );
      expect(
        degradationManager.isFeatureEnabled("enablePatternExpansion"),
      ).toBe(true);
    });

    it("should disable most features at emergency level", async () => {
      await degradationManager.applyDegradation(
        DegradationLevel.EMERGENCY,
        mockConfig,
        "Test",
      );

      expect(degradationManager.isFeatureEnabled("enableNotifications")).toBe(
        false,
      );
      expect(
        degradationManager.isFeatureEnabled("enableProgressIndicators"),
      ).toBe(false);
      expect(degradationManager.isFeatureEnabled("enableDetailedLogging")).toBe(
        false,
      );
      expect(
        degradationManager.isFeatureEnabled("enablePatternExpansion"),
      ).toBe(false);
      expect(
        degradationManager.isFeatureEnabled("enableAdvancedDebouncing"),
      ).toBe(false);
      expect(
        degradationManager.isFeatureEnabled("enableStatisticsTracking"),
      ).toBe(false);
      expect(
        degradationManager.isFeatureEnabled("enablePerformanceMonitoring"),
      ).toBe(false);
    });
  });

  describe("Recovery Logic", () => {
    it("should allow recovery to better level when errors decrease", async () => {
      // First degrade to minimal
      await degradationManager.applyDegradation(
        DegradationLevel.MINIMAL,
        mockConfig,
        "High error count",
      );

      expect(degradationManager.getCurrentLevel()).toBe(
        DegradationLevel.MINIMAL,
      );

      // Now test recovery with fewer errors
      const fewErrors: RecoverableError[] = [
        {
          type: "file_system",
          message: "Minor error",
          recoverable: true,
          category: "file_system" as any,
          severity: ErrorSeverity.LOW,
          retryCount: 1,
          lastRetryAt: new Date(),
        },
      ];

      const goodSystemMetrics = {
        memoryUsage: 0.4,
        cpuUsage: 0.3,
        fileDescriptors: 100,
        watchedFiles: 50,
      };

      const decision = degradationManager.evaluateDegradation(
        fewErrors,
        goodSystemMetrics,
      );
      expect(decision.shouldDegrade).toBe(true);
      expect(decision.targetLevel).toBe(DegradationLevel.REDUCED);
      expect(decision.reason).toContain("recovering");
    });

    it("should reset to normal operation", async () => {
      // First degrade
      await degradationManager.applyDegradation(
        DegradationLevel.EMERGENCY,
        mockConfig,
        "Test degradation",
      );

      expect(degradationManager.getCurrentLevel()).toBe(
        DegradationLevel.EMERGENCY,
      );

      // Reset to normal
      await degradationManager.resetToNormal();

      expect(degradationManager.getCurrentLevel()).toBe(
        DegradationLevel.NORMAL,
      );
      expect(degradationManager.getDegradedConfiguration()).toBeNull();
      expect(degradationManager.isFeatureEnabled("enableNotifications")).toBe(
        true,
      );
    });
  });

  describe("Health Status", () => {
    it("should report healthy status at normal level", () => {
      const health = degradationManager.getHealthStatus();
      expect(health.status).toBe("healthy");
      expect(health.message).toContain("operational");
    });

    it("should report degraded status at reduced level", async () => {
      await degradationManager.applyDegradation(
        DegradationLevel.REDUCED,
        mockConfig,
        "Test",
      );

      const health = degradationManager.getHealthStatus();
      expect(health.status).toBe("degraded");
      expect(health.message).toContain("reduced functionality");
    });

    it("should report impaired status at minimal level", async () => {
      await degradationManager.applyDegradation(
        DegradationLevel.MINIMAL,
        mockConfig,
        "Test",
      );

      const health = degradationManager.getHealthStatus();
      expect(health.status).toBe("impaired");
      expect(health.message).toContain("minimal functionality");
    });

    it("should report critical status at emergency level", async () => {
      await degradationManager.applyDegradation(
        DegradationLevel.EMERGENCY,
        mockConfig,
        "Test",
      );

      const health = degradationManager.getHealthStatus();
      expect(health.status).toBe("critical");
      expect(health.message).toContain("Emergency mode");
    });
  });

  describe("Degradation History", () => {
    it("should track degradation history", async () => {
      const initialHistory = degradationManager.getDegradationHistory();
      expect(initialHistory).toHaveLength(0);

      await degradationManager.applyDegradation(
        DegradationLevel.REDUCED,
        mockConfig,
        "First degradation",
      );

      await degradationManager.applyDegradation(
        DegradationLevel.MINIMAL,
        mockConfig,
        "Second degradation",
      );

      const history = degradationManager.getDegradationHistory();
      expect(history).toHaveLength(2);
      expect(history[0].fromLevel).toBe(DegradationLevel.NORMAL);
      expect(history[0].toLevel).toBe(DegradationLevel.REDUCED);
      expect(history[0].reason).toBe("First degradation");
      expect(history[1].fromLevel).toBe(DegradationLevel.REDUCED);
      expect(history[1].toLevel).toBe(DegradationLevel.MINIMAL);
      expect(history[1].reason).toBe("Second degradation");
    });

    it("should track recovery in history", async () => {
      await degradationManager.applyDegradation(
        DegradationLevel.MINIMAL,
        mockConfig,
        "Test degradation",
      );

      await degradationManager.resetToNormal();

      const history = degradationManager.getDegradationHistory();
      expect(history).toHaveLength(2);
      expect(history[1].fromLevel).toBe(DegradationLevel.MINIMAL);
      expect(history[1].toLevel).toBe(DegradationLevel.NORMAL);
      expect(history[1].triggeredBy).toBe("manual");
    });
  });

  describe("Resource Limits", () => {
    it("should apply appropriate resource limits for each level", async () => {
      const levels = [
        DegradationLevel.NORMAL,
        DegradationLevel.REDUCED,
        DegradationLevel.MINIMAL,
        DegradationLevel.EMERGENCY,
      ];

      for (const level of levels) {
        await degradationManager.applyDegradation(level, mockConfig, "Test");
        const config = degradationManager.getDegradedConfiguration();

        expect(config).toBeDefined();
        expect(config!.reducedLimits.maxWatchedFiles).toBeGreaterThan(0);
        expect(config!.reducedLimits.maxRetries).toBeGreaterThan(0);
        expect(config!.reducedLimits.debounceDelay).toBeGreaterThan(0);
        expect(config!.reducedLimits.batchSize).toBeGreaterThan(0);

        // Emergency should have the most restrictive limits
        if (level === DegradationLevel.EMERGENCY) {
          expect(config!.reducedLimits.maxWatchedFiles).toBe(50);
          expect(config!.reducedLimits.maxRetries).toBe(1);
          expect(config!.reducedLimits.batchSize).toBe(5);
        }
      }
    });
  });
});
