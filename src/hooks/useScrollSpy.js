import { useEffect, useRef, useState } from 'react';
import { BACK_TO_TOP_THRESHOLD_PX, HEADER_OFFSET_PX } from '../constants/config.js';

/**
 * Tracks which section id is currently active (for nav highlighting) and
 * whether the back-to-top button should show, from a single rAF-throttled
 * scroll listener. `suppressUntilRef` lets a nav click temporarily pause
 * active-section tracking (so clicking a link doesn't get overridden by the
 * scroll spy mid-animation) without ever suppressing the back-to-top check.
 */
export function useScrollSpy(sectionIds) {
  const [active, setActive] = useState(sectionIds[0] || '');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const suppressUntilRef = useRef(0);

  useEffect(() => {
    const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);
    if (!sections.length) return undefined;

    const update = () => {
      setShowBackToTop(window.scrollY > BACK_TO_TOP_THRESHOLD_PX);

      if (Date.now() < suppressUntilRef.current) return;

      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      let current = atBottom ? sections[sections.length - 1].id : sections[0].id;
      if (!atBottom) {
        for (const sec of sections) {
          if (sec.getBoundingClientRect().top - HEADER_OFFSET_PX <= 0) current = sec.id;
          else break;
        }
      }
      setActive((prev) => (prev === current ? prev : current));
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        update();
        ticking = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => window.removeEventListener('scroll', onScroll);
  }, [sectionIds]);

  const suppress = (ms) => {
    suppressUntilRef.current = Date.now() + ms;
  };

  return { active, setActive, showBackToTop, suppress };
}
