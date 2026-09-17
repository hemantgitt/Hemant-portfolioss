import { useEffect, useRef, useState } from 'react';

/**
 * Generic scroll-reveal hook: returns a ref to attach to an element and a
 * boolean that flips to true the first time that element enters the
 * viewport, then stays true (one-shot reveal, matching the original site's
 * IntersectionObserver-driven `.om-reveal` animation).
 *
 * Disabled entirely when `reduced` is true, so reduced-motion users get
 * fully-visible content immediately instead of a reveal animation.
 *
 * @param {{ threshold?: number, reduced?: boolean }} [options]
 */
export function useIntersectionObserver({ threshold = 0.06, reduced = false } = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(() => reduced || typeof IntersectionObserver === 'undefined');

  useEffect(() => {
    if (reduced) return undefined;
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, reduced]);

  return [ref, reduced || isVisible];
}
