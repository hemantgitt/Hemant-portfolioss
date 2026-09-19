import { useCallback, useEffect, useState } from 'react';
import { PREFS_STORAGE_KEY } from '../constants/config.js';

function readStoredPrefs() {
  try {
    return JSON.parse(localStorage.getItem(PREFS_STORAGE_KEY) || 'null');
  } catch {
    return null;
  }
}

/**
 * Dark/light theme state, persisted to localStorage. First-time visitors
 * (no saved preference) always start on `defaultTheme` (dark) regardless of
 * the OS's `prefers-color-scheme` — the site has an explicit in-page toggle,
 * so it doesn't need to guess from system settings. Applies `data-theme` on
 * <html> so CSS custom properties can react to it.
 *
 * Accent color (purple/maroon/teal/emerald) is a separate, independent
 * choice — see useAccentColor.js — so it can be combined freely with
 * either background mode instead of being folded into this value.
 *
 * @param {'dark'|'light'} [defaultTheme]
 */
export function useTheme(defaultTheme = 'dark') {
  const [theme, setTheme] = useState(() => {
    const saved = readStoredPrefs();
    if (saved && saved.theme) return saved.theme;
    return defaultTheme;
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    const saved = readStoredPrefs() || {};
    try {
      localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify({ ...saved, theme }));
    } catch {
      /* localStorage unavailable (private mode, quota) — theme still applies for this session */
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  }, []);

  return { theme, setTheme, toggleTheme, isDark: theme === 'dark' };
}
