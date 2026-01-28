/**
 * SVG Generator Service
 *
 * Generates SVG cover images with customizable layouts and styling.
 * Handles text wrapping, positioning, and decorative elements.
 */

import { escapeXml } from "../utils/validation.js";
import { LAYOUTS, DEFAULT_IMAGE } from "../config/constants.js";

/**
 * SvgGenerator class creates SVG images based on configuration
 */
export class SvgGenerator {
  /**
   * Wraps text into multiple lines based on max width
   *
   * @param {string} text - Text to wrap
   * @param {number} maxCharsPerLine - Maximum characters per line
   * @returns {string[]} - Array of text lines
   */
  wrapText(text, maxCharsPerLine = 40) {
    const words = text.split(" ");
    const lines = [];
    let currentLine = "";

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      if (testLine.length <= maxCharsPerLine) {
        currentLine = testLine;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) lines.push(currentLine);

    return lines;
  }

  /**
   * Generates SVG text elements with proper positioning
   *
   * @param {Object} config - Text configuration
   * @returns {string} - SVG text elements
   */
  generateTextElements(config) {
    const {
      text,
      subtitle,
      x,
      y,
      fontSize,
      fontWeight,
      textAnchor,
      fill,
      fontFamily,
      maxWidth,
      lineHeight = 1.3,
    } = config;

    // Wrap text into multiple lines
    const lines = this.wrapText(text, Math.floor(maxWidth / (fontSize * 0.6)));
    const totalHeight = lines.length * fontSize * lineHeight;
    const startY = y - totalHeight / 2 + fontSize / 2;

    let svgText = "";

    // Generate main text lines
    lines.forEach((line, index) => {
      const lineY = startY + index * fontSize * lineHeight;
      svgText += `
  <text
    x="${x}"
    y="${lineY}"
    font-family="${fontFamily}"
    font-size="${fontSize}"
    font-weight="${fontWeight}"
    text-anchor="${textAnchor}"
    fill="${fill}"
  >${escapeXml(line)}</text>`;
    });

    // Add subtitle if provided
    if (subtitle) {
      const subtitleY =
        startY + lines.length * fontSize * lineHeight + fontSize * 0.8;
      const subtitleFontSize = fontSize * 0.5;
      svgText += `
  <text
    x="${x}"
    y="${subtitleY}"
    font-family="${fontFamily}"
    font-size="${subtitleFontSize}"
    font-weight="400"
    text-anchor="${textAnchor}"
    fill="${fill}"
    opacity="0.7"
  >${escapeXml(subtitle)}</text>`;
    }

    return svgText;
  }

  /**
   * Calculates optimal font size based on text length
   *
   * @param {string} text - Text to size
   * @param {number} customFontSize - Custom font size if provided
   * @returns {number} - Calculated font size
   */
  calculateFontSize(text, customFontSize) {
    if (customFontSize) {
      return customFontSize;
    }

    // Auto-size based on text length
    if (text.length > 80) {
      return 36;
    } else if (text.length > 50) {
      return 44;
    } else {
      return 56;
    }
  }

  /**
   * Generates complete SVG cover image
   *
   * @param {Object} options - Image generation options
   * @returns {string} - Complete SVG markup
   */
  generate(options) {
    const {
      text,
      subtitle = "",
      width = DEFAULT_IMAGE.WIDTH,
      height = DEFAULT_IMAGE.HEIGHT,
      bgColor = "#FFFFFF",
      textColor = "#000000",
      fontSize: customFontSize,
      fontWeight = DEFAULT_IMAGE.FONT_WEIGHT,
      layout = "center",
      padding = DEFAULT_IMAGE.PADDING,
      fontFamily = DEFAULT_IMAGE.FONT_FAMILY,
    } = options;

    // Calculate font size
    const fontSize = this.calculateFontSize(text, customFontSize);

    // Get layout configuration
    const layoutConfig = LAYOUTS[layout] || LAYOUTS.center;
    const position = layoutConfig.getPosition(width, height, padding);

    let decorativeElements = "";

    // Add divider for split layout
    if (position.withDivider) {
      decorativeElements = `
  <line
    x1="${width / 2}"
    y1="${padding}"
    x2="${width / 2}"
    y2="${height - padding}"
    stroke="${textColor}"
    stroke-width="2"
    opacity="0.2"
  />`;
    }

    // Generate text elements
    const textElements = this.generateTextElements({
      text,
      subtitle,
      x: position.x,
      y: position.y,
      fontSize,
      fontWeight,
      textAnchor: position.textAnchor,
      fill: textColor,
      fontFamily,
      maxWidth: position.maxWidth,
    });

    // Assemble complete SVG
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="${width}" height="${height}" fill="${bgColor}"/>
  ${decorativeElements}
  <!-- Text -->
  ${textElements}
</svg>`;
  }
}
