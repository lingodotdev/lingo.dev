#!/usr/bin/env node

/**
 * Centralized Logger Utility
 * Loads logging configuration from config.json and provides consistent logging across the application
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load configuration
const configPath = path.resolve(__dirname, '../config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

// Extract logging configuration
const { colors, levels } = config.logging;

// Create logger functions based on configuration
const createLogger = () => {
  const logger = {};

  Object.entries(levels).forEach(([level, colorKey]) => {
    const colorCode = colors[colorKey];
    const levelName = level.toUpperCase();
    logger[level] = (msg) => console.log(`${colorCode}[${levelName}]${colors.reset} ${msg}`);
  });

  return logger;
};

export const log = createLogger();
export { colors };