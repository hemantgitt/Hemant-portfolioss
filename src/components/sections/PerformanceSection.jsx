import perf from '../../data/performance.json';
import { SectionHeader } from '../SectionHeader.jsx';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver.js';

export function PerformanceSection({ reducedMotion }) {
  const [ref, visible] = useIntersectionObserver({ reduced: reducedMotion });
  return (
    <section id="performance" ref={ref} aria-labelledby="perf-h" data-readable="Performance approach" className={visible ? 'reveal-in' : 'reveal-init'} style={{ borderTop: '1px solid var(--border)' }}>
      <div className="split" style={{ maxWidth: 1180, margin: '0 auto', padding: 'clamp(56px,8vw,96px) 20px', display: 'grid', gap: 36 }}>
        <div>
          <SectionHeader eyebrow={perf.eyebrow} title={perf.title} id="perf-h" style={{ marginBottom: 18 }} />
          <p style={{ margin: '0 0 20px', lineHeight: 1.65, color: 'var(--muted)' }}>{perf.body}</p>
          <ul style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
            {perf.topics.map((t) => (
              <li key={t} className="tag" style={{ fontFamily: 'var(--font-h)', fontWeight: 500 }}>
                {t}
              </li>
            ))}
          </ul>
        </div>
        <figure className="feature-card" style={{ margin: 0, padding: 0, overflow: 'hidden' }}>
          <ol style={{ padding: 8 }}>
            {perf.flow.map((step) => (
              <li key={step.n} style={{ display: 'grid', gridTemplateColumns: '32px minmax(0,1fr)', gap: 14, alignItems: 'start', padding: '12px 12px' }}>
                <span aria-hidden="true" className="icon-chip" style={{ fontFamily: 'var(--font-h)', fontWeight: 700, fontSize: '0.85rem', width: 30, height: 30 }}>
                  {step.n}
                </span>
                <span>
                  <strong style={{ fontFamily: 'var(--font-h)', fontWeight: 600, fontSize: '0.94rem', display: 'block', marginTop: 2 }}>{step.title}</strong>
                  <span style={{ fontSize: '0.84rem', lineHeight: 1.5, color: 'var(--muted)' }}>{step.body}</span>
                </span>
              </li>
            ))}
          </ol>
          <figcaption style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', fontSize: '0.72rem', color: 'var(--muted)' }}>{perf.flowCaption}</figcaption>
        </figure>
      </div>
    </section>
  );
}
