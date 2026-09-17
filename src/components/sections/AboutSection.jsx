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
        <div style={{ display: 'grid', gap: 20 }}>
          <p style={{ fontSize: '1.15rem', lineHeight: 1.6, fontFamily: 'var(--font-h)', fontWeight: 500, letterSpacing: '-0.005em' }}>{about.intro}</p>
          <ul style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginTop: 8 }}>
            {about.focus.map((f) => (
              <li key={f.label} style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-h)', fontWeight: 500, fontSize: '0.86rem', padding: '12px 14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
                <Icon name={f.icon} size={16} style={{ color: 'var(--accent)', flex: 'none' }} />
                {f.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
