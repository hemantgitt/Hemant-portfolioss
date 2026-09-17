import { useEffect, useState } from 'react';

/**
 * True when animations should be suppressed — either because the OS-level
 * `prefers-reduced-motion: reduce` is set, or because `motionOff` (the
 * site's own in-app "Reduce motion" toggle, from useAccessibilityPreferences)
 * is true. Mirrors the original site's `motionOK()` check, inverted.
 *
 * @param {boolean} [motionOff] - the app's own reduce-motion preference
 */
export function useReducedMotion(motionOff = false) {
  const [systemReduced, setSystemReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e) => setSystemReduced(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return systemReduced || motionOff;
}
