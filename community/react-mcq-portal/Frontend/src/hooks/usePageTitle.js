import { useEffect } from 'react';

export function usePageTitle(title) {
  useEffect(() => {
    document.title = `${title} - Exam Portal`;
  }, [title]);
}