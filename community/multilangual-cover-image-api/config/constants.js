/**
 * Application Configuration Constants
 *
 * This file contains all configuration values used throughout the application.
 * Modify these values to adjust caching, rate limiting, and default settings.
 */

// Cache Configuration
export const CACHE_CONFIG = {
  MAX_SIZE: 1000, // Maximum number of cached items
};

// Rate Limiting Configuration
export const RATE_LIMIT_CONFIG = {
  WINDOW_MS: 60000, // Time window in milliseconds (1 minute)
  MAX_REQUESTS: 100, // Maximum requests per window per IP
};

// Default Image Settings
export const DEFAULT_IMAGE = {
  WIDTH: 1200,
  HEIGHT: 630,
  PADDING: 60,
  FONT_WEIGHT: "600",
  FONT_FAMILY: "system-ui, -apple-system, 'Segoe UI', sans-serif",
};

// Theme Presets
export const THEMES = {
  light: {
    bgColor: "#FFFFFF",
    textColor: "#000000",
  },
  dark: {
    bgColor: "#000000",
    textColor: "#FFFFFF",
  },
};

// Validation Constraints
export const VALIDATION_RULES = {
  WIDTH: { MIN: 200, MAX: 4000 },
  HEIGHT: { MIN: 200, MAX: 4000 },
  FONT_SIZE: { MIN: 12, MAX: 200 },
  PADDING: { MIN: 0, MAX: 300 },
  FONT_WEIGHTS: ["300", "400", "500", "600", "700", "800", "900"],
};

// Layout Configurations
// Each layout defines how text should be positioned on the canvas
export const LAYOUTS = {
  center: {
    getPosition: (width, height) => ({
      x: width / 2,
      y: height / 2,
      textAnchor: "middle",
      maxWidth: width * 0.8,
    }),
  },
  top: {
    getPosition: (width, height, padding) => ({
      x: width / 2,
      y: padding + 100,
      textAnchor: "middle",
      maxWidth: width * 0.8,
    }),
  },
  bottom: {
    getPosition: (width, height, padding) => ({
      x: width / 2,
      y: height - padding - 100,
      textAnchor: "middle",
      maxWidth: width * 0.8,
    }),
  },
  left: {
    getPosition: (width, height, padding) => ({
      x: padding + 80,
      y: height / 2,
      textAnchor: "start",
      maxWidth: width * 0.6,
    }),
  },
  right: {
    getPosition: (width, height, padding) => ({
      x: width - padding - 80,
      y: height / 2,
      textAnchor: "end",
      maxWidth: width * 0.6,
    }),
  },
  "top-left": {
    getPosition: (width, height, padding) => ({
      x: padding + 80,
      y: padding + 100,
      textAnchor: "start",
      maxWidth: width * 0.6,
    }),
  },
  "top-right": {
    getPosition: (width, height, padding) => ({
      x: width - padding - 80,
      y: padding + 100,
      textAnchor: "end",
      maxWidth: width * 0.6,
    }),
  },
  "bottom-left": {
    getPosition: (width, height, padding) => ({
      x: padding + 80,
      y: height - padding - 100,
      textAnchor: "start",
      maxWidth: width * 0.6,
    }),
  },
  "bottom-right": {
    getPosition: (width, height, padding) => ({
      x: width - padding - 80,
      y: height - padding - 100,
      textAnchor: "end",
      maxWidth: width * 0.6,
    }),
  },
  split: {
    getPosition: (width, height) => ({
      x: width / 2,
      y: height / 2,
      textAnchor: "middle",
      maxWidth: width * 0.45,
      withDivider: true, // Special flag for split layout
    }),
  },
};
