import { usePageScrollProgress } from '../hooks/usePageScrollProgress.js';

export function ScrollProgressBar() {
  const progress = usePageScrollProgress();
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: 4, zIndex: 100,
        transform: `scaleX(${progress})`, transformOrigin: 'left', background: 'var(--accent)',
        transition: 'transform 0.1s linear',
      }}
    />
  );
}
