import { useSyncExternalStore } from 'react';

// The logo data is ~19KB gzipped of SVG paths, and Skills sits well below the
// fold -- so it's a separate chunk fetched at idle time after first paint
// rather than part of the critical-path bundle. `undefined` = not loaded yet,
// `{}` = load failed (offline etc.), callers then fall back to their own icon.
let icons;
const listeners = new Set();
let started = false;

function publish(next) {
  icons = next;
  listeners.forEach((notify) => notify());
}

function startLoading() {
  if (started) return;
  started = true;
  const load = () =>
    import('../data/brandIcons.js').then((m) => publish(m.BRAND_ICONS)).catch(() => publish({}));
  if ('requestIdleCallback' in window) window.requestIdleCallback(load, { timeout: 4000 });
  else setTimeout(load, 2000);
}

function subscribe(notify) {
  listeners.add(notify);
  startLoading();
  return () => listeners.delete(notify);
}

/**
 * A technology's brand logo. While the logo data is still loading it renders an
 * empty slot of the same size (no layout shift), then fades the logo in; if
 * the slug has no bundled logo, or loading failed, it renders `fallback`.
 * @param {{ slug: string, size?: number, fallback?: import('react').ReactNode }} props
 */
export function BrandIcon({ slug, size = 14, fallback = null }) {
  const loaded = useSyncExternalStore(subscribe, () => icons, () => undefined);
  if (loaded === undefined) return <span aria-hidden="true" style={{ display: 'inline-block', width: size, height: size, flex: 'none' }} />;
  const icon = loaded[slug];
  if (!icon) return fallback;
  return (
    <svg
      className="brand-icon"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      style={{ '--bi-dark': icon.dark, '--bi-light': icon.light, flex: 'none' }}
    >
      <path fill="currentColor" d={icon.path} />
    </svg>
  );
}
