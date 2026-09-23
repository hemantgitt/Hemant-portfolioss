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

        {/* Narrative left, strengths as a bold accent panel on the right --
            the same solid-gradient-panel language as the "Let's connect"
            contact card, so About reads as a deliberate, premium block
            instead of a plain list-in-a-box or a repeat of Hero's tags. */}
        <div className="split" style={{ display: 'grid', gap: 28, '--sa': '1.3fr', '--sb': '1fr' }}>
          <div className="font-display" style={{ borderLeft: '2px solid var(--accent)', paddingLeft: 22 }}>
            <p className="desk-only" style={{ fontSize: '1.28rem', lineHeight: 1.55, fontWeight: 500, letterSpacing: '-0.005em', margin: 0, maxWidth: '46ch' }}>
              {about.intro}
            </p>
            <p className="mob-only" style={{ fontSize: '1.28rem', lineHeight: 1.55, fontWeight: 500, letterSpacing: '-0.005em', margin: 0 }}>
              {about.introMobile}
            </p>
          </div>
          <div className={`contact-card-info${visible ? ' card-reveal-in' : ''}`} style={{ borderRadius: 20, alignSelf: 'start' }}>
            <span aria-hidden="true" className="contact-card-blob" />
            <ul style={{ position: 'relative', zIndex: 1, display: 'grid', gap: 16 }}>
              {about.focus.map((f) => (
                <li key={f.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span className="contact-card-icon">
                    <Icon name={f.icon} size={15} />
                  </span>
                  <span style={{ fontSize: '0.92rem', fontWeight: 500 }}>{f.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
