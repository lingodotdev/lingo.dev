import { useMemo } from 'react';
import { getScriptConfig, getScriptStyle } from '../utils/scriptConfig';

export function useScriptStyle(locale: string) {
  return useMemo(() => {
    const config = getScriptConfig(locale);
    const style = getScriptStyle(locale);

    return {
      config,
      style,
      isRTL: config?.direction === 'rtl',
      hasSpecialScript: Boolean(config?.script && config.script !== 'latin'),
    };
  }, [locale]);
}

export function useScriptDirection(locale: string) {
  return useMemo(() => {
    const config = getScriptConfig(locale);
    return config?.direction || 'ltr';
  }, [locale]);
}