import { useEffect, useRef, useState } from 'react';
import hero from '../../data/hero.json';
import site from '../../data/site.json';
import { Icon } from '../Icon.jsx';
import { QuickStatsModal } from '../QuickStatsModal.jsx';

// Maps hero.strengths (plain label strings) to the same lucide icon used for
// that skill in skills.json, so the marquee tags below don't need their own
// duplicate icon field in hero.json.
const STRENGTH_ICONS = {
  'React.js': 'atom',
  'Next.js': 'triangle',
  TypeScript: 'file-code',
  'Frontend architecture': 'layout-template',
  Performance: 'gauge',
  Accessibility: 'accessibility',
  'API integration': 'plug',
  Security: 'shield-alert',
  Testing: 'test-tube',
};

// Bump this whenever the hero-photo files in public/images are replaced.
// Browsers (and the Vercel CDN) cache /images/hero-photo.* by URL, so
// overwriting the same filename without a version marker can keep serving
// stale bytes after a redeploy until a hard refresh.
const HERO_PHOTO_VERSION = 2;

export function Hero() {
  const [statsOpen, setStatsOpen] = useState(false);
  const heroRightRef = useRef(null);

  // Cursor-follow spotlight behind the photo — desktop/mouse only (skipped
  // entirely on touch devices, where a pointer-move listener wouldn't fire
  // meaningfully anyway). Purely additive: the glow itself is hidden via
  // CSS under reduced-motion, so this effect just becomes a no-op there.
  useEffect(() => {
    const el = heroRightRef.current;
    if (!el || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;
    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty('--cursor-x', `${e.clientX - rect.left}px`);
      el.style.setProperty('--cursor-y', `${e.clientY - rect.top}px`);
    };
    el.addEventListener('mousemove', onMove);
    return () => el.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <section id="home" aria-labelledby="hero-h" style={{ position: 'relative', overflow: 'hidden' }}>
      <div
        aria-hidden="true"
        style={{ position: 'absolute', inset: '-20% -10%', background: 'radial-gradient(circle at 30% 20%, var(--hero-glow, var(--accent-tint)), transparent 55%)', pointerEvents: 'none' }}
      />
      <div className="hero-grid" style={{ position: 'relative', maxWidth: 1180, margin: '0 auto', padding: 'clamp(56px, 10vw, 120px) 20px 80px' }}>
        <div className="hero-left">
          <p
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: '0.78rem', fontFamily: 'var(--font-h)', fontWeight: 600,
              color: 'var(--accent)', background: 'var(--accent-tint)', padding: '7px 14px', borderRadius: 999, width: 'fit-content',
            }}
          >
            <span aria-hidden="true" className="status-dot" style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', display: 'block' }} />
            {hero.availabilityText}
          </p>
          <div className="hero-name-3d">
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <picture>
                <source srcSet={`/images/hero-photo.webp?v=${HERO_PHOTO_VERSION}`} type="image/webp" />
                <img
                  className="hero-avatar-mobile"
                  src={`/images/hero-photo.jpg?v=${HERO_PHOTO_VERSION}`}
                  width={56}
                  height={56}
                  alt={`${hero.name}, ${hero.title}`}
                  loading="eager"
                  fetchPriority="high"
                />
              </picture>
              <h1 id="hero-h" className="hero-name-in hero-name-3d-text font-display" style={{ fontWeight: 600, fontSize: 'clamp(2.4rem, 6vw, 4.2rem)', lineHeight: 1.03, letterSpacing: '-0.01em' }}>
                {hero.name}
              </h1>
            </div>
            <p className="hero-title-badge">
              <Icon name="briefcase" size={14} />
              {hero.title}
              <span className="hero-title-badge-suffix">— {hero.titleSuffix}</span>
            </p>
          </div>
          <p style={{ maxWidth: '56ch', fontSize: '1.05rem', lineHeight: 1.65, color: 'var(--muted)' }}>{hero.summary}</p>
          <div className="strengths-marquee" style={{ marginTop: 4 }}>
            <ul className="strengths-track" aria-label="Core strengths">
              {hero.strengths.map((s) => (
                <li key={s} className="tag" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-h)', fontWeight: 500, fontSize: '0.8rem', color: 'var(--text)', padding: '7px 13px' }}>
                  {STRENGTH_ICONS[s] && <Icon name={STRENGTH_ICONS[s]} size={13} className="tag-icon" />}
                  {s}
                </li>
              ))}
              {hero.strengths.map((s) => (
                <li key={`${s}-dup`} aria-hidden="true" className="tag" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-h)', fontWeight: 500, fontSize: '0.8rem', color: 'var(--text)', padding: '7px 13px' }}>
                  {STRENGTH_ICONS[s] && <Icon name={STRENGTH_ICONS[s]} size={13} className="tag-icon" />}
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 10 }}>
            <a href="#projects" className="btn btn-primary" style={{ minHeight: 46, paddingInline: 22, fontSize: '0.9rem', boxShadow: 'var(--shadow-sm)' }}>
              View my work
              <Icon name="arrow-down-right" size={15} />
            </a>
            <a href={site.resumeUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ minHeight: 46, paddingInline: 22, fontSize: '0.9rem' }}>
              <Icon name="eye" size={15} />
              View Resume
            </a>
            <a href="#contact" className="btn btn-outline" style={{ minHeight: 46, paddingInline: 22, fontSize: '0.9rem' }}>
              <Icon name="mail" size={15} />
              Contact me
            </a>
          </div>
          <button type="button" onClick={() => setStatsOpen(true)} aria-haspopup="dialog" className="hero-stats-chip hero-quick-stats-btn">
            <span aria-hidden="true" className="hero-stats-chip-icon">
              <Icon name="chart-line" size={14} />
            </span>
            <span>
              <strong>{hero.facts[0].value}</strong> · <strong>{hero.facts[1].value}</strong>
              <span className="hero-stats-chip-label"> — quick stats</span>
            </span>
            <Icon name="arrow-right" size={14} className="hero-stats-chip-arrow" />
          </button>
        </div>
        <div className="hero-right" ref={heroRightRef}>
          <span aria-hidden="true" className="hero-cursor-glow" />
          <div className="hero-photo-wrap">
            <span aria-hidden="true" className="hero-photo-grid" />
            <span aria-hidden="true" className="hero-photo-glow" />
            <picture>
              <source srcSet={`/images/hero-photo.webp?v=${HERO_PHOTO_VERSION}`} type="image/webp" />
              <img
                className="hero-photo"
                src={`/images/hero-photo.jpg?v=${HERO_PHOTO_VERSION}`}
                width={340}
                height={425}
                alt={`${hero.name}, ${hero.title}`}
                loading="eager"
                fetchPriority="high"
              />
            </picture>
          </div>
        </div>
      </div>
      {statsOpen && <QuickStatsModal facts={hero.facts} onClose={() => setStatsOpen(false)} />}
    </section>
  );
}
