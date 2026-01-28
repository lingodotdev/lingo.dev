/**
 * Validation Utilities
 *
 * This module provides functions for validating and sanitizing user input.
 * All validation logic is centralized here for easy maintenance.
 */

import { VALIDATION_RULES, THEMES, LAYOUTS } from "../config/constants.js";

/**
 * Escapes XML special characters to prevent injection attacks
 *
 * @param {string} text - Text to escape
 * @returns {string} - Escaped text safe for XML/SVG
 */
export function escapeXml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Validates if a string is a valid hex color
 *
 * @param {string} color - Color string to validate
 * @returns {boolean} - True if valid hex color
 */
export function isValidHexColor(color) {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
}

/**
 * Validates and sanitizes all request parameters
 *
 * @param {Object} query - Query parameters from request
 * @returns {Object} - Object containing validated params and any errors
 */
export function validateParams(query) {
  const errors = [];
  const params = {};

  // Required: text
  if (
    !query.text ||
    typeof query.text !== "string" ||
    query.text.trim() === ""
  ) {
    errors.push('Missing or invalid "text" parameter');
  } else {
    params.text = query.text.trim();
  }

  // Optional: subtitle
  if (query.subtitle && typeof query.subtitle === "string") {
    params.subtitle = query.subtitle.trim();
  }

  // Optional: language
  params.lang = query.lang || "en";

  // Optional: theme or custom colors
  if (query.theme === "dark") {
    params.bgColor = THEMES.dark.bgColor;
    params.textColor = THEMES.dark.textColor;
  } else {
    params.bgColor = THEMES.light.bgColor;
    params.textColor = THEMES.light.textColor;
  }

  // Custom colors override theme
  if (query.bgColor) {
    if (isValidHexColor(query.bgColor)) {
      params.bgColor = query.bgColor;
    } else {
      errors.push("Invalid bgColor format (use hex: #000000)");
    }
  }

  if (query.textColor) {
    if (isValidHexColor(query.textColor)) {
      params.textColor = query.textColor;
    } else {
      errors.push("Invalid textColor format (use hex: #FFFFFF)");
    }
  }

  // Optional: dimensions
  params.width = parseInt(query.width) || 1200;
  params.height = parseInt(query.height) || 630;

  if (
    params.width < VALIDATION_RULES.WIDTH.MIN ||
    params.width > VALIDATION_RULES.WIDTH.MAX
  ) {
    errors.push(
      `Width must be between ${VALIDATION_RULES.WIDTH.MIN} and ${VALIDATION_RULES.WIDTH.MAX}`,
    );
  }
  if (
    params.height < VALIDATION_RULES.HEIGHT.MIN ||
    params.height > VALIDATION_RULES.HEIGHT.MAX
  ) {
    errors.push(
      `Height must be between ${VALIDATION_RULES.HEIGHT.MIN} and ${VALIDATION_RULES.HEIGHT.MAX}`,
    );
  }

  // Optional: fontSize
  if (query.fontSize) {
    params.fontSize = parseInt(query.fontSize);
    if (
      params.fontSize < VALIDATION_RULES.FONT_SIZE.MIN ||
      params.fontSize > VALIDATION_RULES.FONT_SIZE.MAX
    ) {
      errors.push(
        `fontSize must be between ${VALIDATION_RULES.FONT_SIZE.MIN} and ${VALIDATION_RULES.FONT_SIZE.MAX}`,
      );
    }
  }

  // Optional: fontWeight
  if (
    query.fontWeight &&
    VALIDATION_RULES.FONT_WEIGHTS.includes(query.fontWeight)
  ) {
    params.fontWeight = query.fontWeight;
  }

  // Optional: layout
  if (query.layout && LAYOUTS[query.layout]) {
    params.layout = query.layout;
  }

  // Optional: padding
  if (query.padding) {
    params.padding = parseInt(query.padding);
    if (
      params.padding < VALIDATION_RULES.PADDING.MIN ||
      params.padding > VALIDATION_RULES.PADDING.MAX
    ) {
      errors.push(
        `padding must be between ${VALIDATION_RULES.PADDING.MIN} and ${VALIDATION_RULES.PADDING.MAX}`,
      );
    }
  }

  return { params, errors };
}
