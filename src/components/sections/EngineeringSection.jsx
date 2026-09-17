import eng from '../../data/engineering.json';
import { SectionHeader } from '../SectionHeader.jsx';
import { Icon } from '../Icon.jsx';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver.js';

export function EngineeringSection({ reducedMotion }) {
  const [ref, visible] = useIntersectionObserver({ reduced: reducedMotion });
  return (
    <section id="engineering" ref={ref} aria-labelledby="eng-h" className={visible ? 'reveal-in' : 'reveal-init'} style={{ borderTop: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: 'clamp(56px,8vw,96px) 20px' }}>
        <SectionHeader eyebrow={eng.eyebrow} title={eng.title} id="eng-h" style={{ marginBottom: 36 }} />
        <div className="grid-auto" style={{ display: 'grid', gap: 16, '--cols': 'repeat(3,1fr)' }}>
          <section
            aria-labelledby="sec-h"
            className={`feature-card${visible ? ' card-reveal-in' : ''}`}
            style={{ padding: 22, display: 'grid', gap: 14, alignContent: 'start', ...(visible ? { animationDelay: '0ms' } : { opacity: 0 }) }}
          >
            <h3 id="sec-h" style={{ fontFamily: 'var(--font-h)', fontWeight: 600, fontSize: '1.08rem', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="icon-chip">
                <Icon name={eng.security.icon} size={16} />
              </span>
              {eng.security.title}
            </h3>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.55, color: 'var(--muted)' }}>{eng.security.body}</p>
            <ul style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {eng.security.tags.map((t) => (
                <li key={t} className="tag">{t}</li>
              ))}
            </ul>
            <p style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{eng.security.footnote}</p>
          </section>

          <section
            aria-labelledby="test-h"
            className={`feature-card${visible ? ' card-reveal-in' : ''}`}
            style={{ padding: 22, display: 'grid', gap: 14, alignContent: 'start', ...(visible ? { animationDelay: '80ms' } : { opacity: 0 }) }}
          >
            <h3 id="test-h" style={{ fontFamily: 'var(--font-h)', fontWeight: 600, fontSize: '1.08rem', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="icon-chip">
                <Icon name={eng.testing.icon} size={16} />
              </span>
              {eng.testing.title}
            </h3>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.55, color: 'var(--muted)' }}>{eng.testing.body}</p>
            <div role="img" aria-label={`Documented statement coverage on booking and payment paths: ${eng.testing.coveragePercent} percent`} style={{ display: 'grid', gap: 6 }}>
              <div style={{ height: 10, background: 'var(--surface2)', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ width: `${eng.testing.coveragePercent}%`, height: '100%', background: 'var(--accent)', borderRadius: 999 }} />
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{eng.testing.coverageLabel}</p>
            </div>
            <ul style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {eng.testing.tags.map((t) => (
                <li key={t} className="tag">{t}</li>
              ))}
            </ul>
          </section>

          <section
            aria-labelledby="ai-h"
            className={`feature-card${visible ? ' card-reveal-in' : ''}`}
            style={{ padding: 22, display: 'grid', gap: 14, alignContent: 'start', ...(visible ? { animationDelay: '160ms' } : { opacity: 0 }) }}
          >
            <h3 id="ai-h" style={{ fontFamily: 'var(--font-h)', fontWeight: 600, fontSize: '1.08rem', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="icon-chip">
                <Icon name={eng.ai.icon} size={16} />
              </span>
              {eng.ai.title}
            </h3>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.55, color: 'var(--muted)' }}>{eng.ai.body}</p>
            <ul style={{ display: 'grid', gap: 7 }}>
              {eng.ai.reviewPoints.map((r) => (
                <li key={r} style={{ display: 'grid', gridTemplateColumns: '14px minmax(0,1fr)', gap: 9, fontSize: '0.85rem', lineHeight: 1.45, color: 'var(--muted)' }}>
                  <Icon name="search-check" size={14} style={{ marginTop: 2, color: 'var(--accent)' }} />
                  {r}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </section>
  );
}
