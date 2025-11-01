import { readFileSync } from 'fs';
import { join } from 'path';

interface ScriptConfig {
  direction: 'ltr' | 'rtl';
  script: string;
  fontFamily: string;
}

interface I18nScriptConfig {
  languageConfig: {
    [key: string]: ScriptConfig;
  }
}

export function getScriptConfig(locale: string): ScriptConfig | null {
  try {
    const configPath = join(__dirname, '../config/i18n-scripts.json');
    const config = JSON.parse(readFileSync(configPath, 'utf8')) as I18nScriptConfig;
    return config.languageConfig[locale] || null;
  } catch (error) {
    console.error('Error loading script configuration:', error);
    return null;
  }
}

export function getDirectionClass(locale: string): string {
  const config = getScriptConfig(locale);
  return config?.direction || 'ltr';
}

export function getScriptStyle(locale: string): { [key: string]: string } {
  const config = getScriptConfig(locale);
  if (!config) return {};

  return {
    direction: config.direction,
    fontFamily: config.fontFamily,
    ...(config.direction === 'rtl' && {
      textAlign: 'right',
    }),
  };
}

export function wrapWithScriptStyle(content: string, locale: string): string {
  const config = getScriptConfig(locale);
  if (!config) return content;

  const style = `direction: ${config.direction}; font-family: ${config.fontFamily}; ${
    config.direction === 'rtl' ? 'text-align: right;' : ''
  }`;

  return `<div style="${style}">${content}</div>`;
}