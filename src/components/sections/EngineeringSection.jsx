import eng from '../../data/engineering.json';
import { SectionHeader } from '../SectionHeader.jsx';
import { Icon } from '../Icon.jsx';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver.js';

const ROWS = ['security', 'testing', 'ai'];

export function EngineeringSection({ reducedMotion }) {
  const [ref, visible] = useIntersectionObserver({ reduced: reducedMotion });
  return (
    <section id="engineering" ref={ref} aria-labelledby="eng-h" className={visible ? 'reveal-in' : 'reveal-init'} style={{ borderTop: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: 'clamp(56px,8vw,96px) 20px' }}>
        <SectionHeader eyebrow={eng.eyebrow} title={eng.title} id="eng-h" style={{ marginBottom: 36 }} />
        <div className={`feature-card${visible ? ' card-reveal-in' : ''}`} style={{ padding: 8 }}>
          <ul>
            {ROWS.map((key) => (
              <li key={key} className="flow-row">
                <span aria-hidden="true" className="icon-chip" style={{ width: 32, height: 32 }}>
                  <Icon name={eng[key].icon} size={15} />
                </span>
                <span>
                  <strong style={{ fontFamily: 'var(--font-h)', fontWeight: 600, fontSize: '0.94rem', display: 'block', marginTop: 2 }}>{eng[key].title}</strong>
                  <span style={{ fontSize: '0.85rem', lineHeight: 1.5, color: 'var(--muted)' }}>{eng[key].body}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
