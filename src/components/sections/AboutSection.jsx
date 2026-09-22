import about from '../../data/about.json';
import { SectionHeader } from '../SectionHeader.jsx';
import { Icon } from '../Icon.jsx';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver.js';

export function AboutSection({ reducedMotion }) {
  const [ref, visible] = useIntersectionObserver({ reduced: reducedMotion });
  return (
    <section
      id="about"
      ref={ref}
      aria-labelledby="about-h"
      data-readable="About"
      className={visible ? 'reveal-in' : 'reveal-init'}
      style={{ borderTop: '1px solid var(--border)' }}
    >
      <div className="split" style={{ maxWidth: 1180, margin: '0 auto', padding: 'clamp(56px,8vw,96px) 20px', display: 'grid', gap: 40, '--sa': '0.7fr', '--sb': '1.3fr' }}>
        <SectionHeader eyebrow={about.eyebrow} title={about.title} id="about-h" />

        {/* Narrative left, strengths as a compact row-list card on the
            right -- deliberately not the pill/icon-tag pattern Hero's
            skill tags use, so the two sections read as different content
            with a different shape, not a visual repeat. */}
        <div className="split" style={{ display: 'grid', gap: 28, '--sa': '1.3fr', '--sb': '1fr' }}>
          <div>
            <p className="desk-only" style={{ fontSize: '1.15rem', lineHeight: 1.6, fontFamily: 'var(--font-h)', fontWeight: 500, letterSpacing: '-0.005em', margin: 0 }}>
              {about.intro}
            </p>
            <p className="mob-only" style={{ fontSize: '1.15rem', lineHeight: 1.6, fontFamily: 'var(--font-h)', fontWeight: 500, letterSpacing: '-0.005em', margin: 0 }}>
              {about.introMobile}
            </p>
          </div>
          <div className={`feature-card${visible ? ' card-reveal-in' : ''}`} style={{ padding: 8, alignSelf: 'start' }}>
            {about.focus.map((f) => (
              <div key={f.label} className="flow-row">
                <span className="icon-chip" style={{ width: 32, height: 32 }}>
                  <Icon name={f.icon} size={15} />
                </span>
                <span style={{ fontFamily: 'var(--font-h)', fontWeight: 500, fontSize: '0.88rem', alignSelf: 'center' }}>{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
