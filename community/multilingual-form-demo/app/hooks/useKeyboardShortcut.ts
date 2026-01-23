// hooks/useKeyboardShortcut.ts
import { useEffect, useCallback } from 'react';

export function useKeyboardShortcut(key: string, callback: () => void, deps: React.DependencyList = []) {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const memoizedCallback = useCallback(callback, deps);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.altKey || e.metaKey) && e.key.toLowerCase() === key.toLowerCase()) {
                e.preventDefault();
                memoizedCallback();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [key, memoizedCallback]);
}