import { useEffect, useRef, useState } from 'react';

/**
 * Tracks scroll progress (0–1) of an element through the viewport: 0 when
 * the element's top has just reached the bottom of the viewport, 1 when its
 * bottom has reached the top. Updates on scroll via requestAnimationFrame,
 * using a passive listener to avoid blocking the scroll thread.
 *
 * Disabled when `reduced` is true — progress is computed once and left
 * static instead of animated.
 *
 * @param {{ reduced?: boolean }} [options]
 */
export function useScrollProgress({ reduced = false } = {}) {
  const ref = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const compute = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const total = rect.height + vh;
      const covered = vh - rect.top;
      const p = total > 0 ? covered / total : 0;
      setProgress(Math.min(1, Math.max(0, p)));
    };

    compute();
    if (reduced) return undefined;

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        compute();
        ticking = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [reduced]);

  return [ref, progress];
}
