import { useEffect, useRef, useState } from 'react';
import type { SaveStatus, ScriptDocument } from '../types/script';
import { saveDocument } from '../utils/storage';

export const useAutosave = (document: ScriptDocument, delay = 1000) => {
  const [status, setStatus] = useState<SaveStatus>('idle');
  const timer = useRef<number | null>(null);

  useEffect(() => {
    setStatus('saving');
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      try {
        saveDocument(document);
        setStatus('saved');
      } catch {
        setStatus('error');
      }
    }, delay);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [document, delay]);

  useEffect(() => {
    const onBeforeUnload = () => {
      try { saveDocument(document); } catch { undefined; }
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [document]);

  return status;
};
