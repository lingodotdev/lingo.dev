/**
 * Debounce Hook
 * Prevents rapid-fire function calls
 */

import { useCallback, useRef } from 'react';

/**
 * Custom hook for debouncing function calls
 * @param callback - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 */
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<number | null>(null);

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout
      timeoutRef.current = window.setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );

  return debouncedCallback;
}

/**
 * Custom hook for throttling function calls
 * Ensures function is called at most once per interval
 */
export function useThrottle<T extends (...args: any[]) => Promise<any>>(
  callback: T,
  limit: number
): T {
  const inThrottle = useRef(false);
  const lastCallRef = useRef<Promise<any> | null>(null);

  const throttledCallback = useCallback(
    async (...args: Parameters<T>) => {
      if (!inThrottle.current) {
        inThrottle.current = true;
        lastCallRef.current = callback(...args);

        setTimeout(() => {
          inThrottle.current = false;
        }, limit);

        return lastCallRef.current;
      } else {
        console.log('⏳ Request throttled - please wait before trying again');
        // Return the last promise to avoid errors
        return lastCallRef.current || Promise.resolve();
      }
    },
    [callback, limit]
  ) as T;

  return throttledCallback;
}
