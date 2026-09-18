import { useCallback, useEffect, useState } from 'react';
import { PREFS_STORAGE_KEY } from '../constants/config.js';

function readStoredPrefs() {
  try {
    return JSON.parse(localStorage.getItem(PREFS_STORAGE_KEY) || 'null');
  } catch {
    return null;
  }
}

export const ACCENT_COLORS = ['purple', 'maroon', 'teal', 'emerald'];

/**
 * Accent color choice (purple/maroon/teal/emerald), persisted to
 * localStorage alongside the dark/light theme but applied independently as
 * `data-accent` on <html>, so it combines with either background mode
 * instead of being one of the theme's own states.
 *
 * @param {'purple'|'maroon'|'teal'|'emerald'} [defaultAccent]
 */
export function useAccentColor(defaultAccent = 'purple') {
  const [accent, setAccent] = useState(() => {
    const saved = readStoredPrefs();
    return (saved && saved.accent) || defaultAccent;
  });

  useEffect(() => {
    if (accent === 'purple') {
      delete document.documentElement.dataset.accent;
    } else {
      document.documentElement.dataset.accent = accent;
    }
    const saved = readStoredPrefs() || {};
    try {
      localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify({ ...saved, accent }));
    } catch {
      /* localStorage unavailable (private mode, quota) — accent still applies for this session */
    }
  }, [accent]);

  const setAccentColor = useCallback((next) => {
    setAccent(next);
  }, []);

  return { accent, setAccent: setAccentColor };
}
