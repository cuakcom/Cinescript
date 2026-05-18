import { useEffect } from 'react';

export const useKeyboardShortcuts = (handler: (e: KeyboardEvent) => void) => {
  useEffect(() => {
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handler]);
};
