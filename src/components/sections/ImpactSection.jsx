import impact from '../../data/impact.json';
import { SectionHeader } from '../SectionHeader.jsx';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver.js';

export function ImpactSection({ reducedMotion }) {
  const [ref, visible] = useIntersectionObserver({ reduced: reducedMotion });
  return (
    <section id="impact" ref={ref} aria-labelledby="impact-h" data-readable="Engineering impact" className={visible ? 'reveal-in' : 'reveal-init'} style={{ borderTop: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: 'clamp(56px,8vw,96px) 20px' }}>
        <SectionHeader eyebrow={impact.eyebrow} title={impact.title} id="impact-h" subtitle={impact.intro} style={{ marginBottom: 36 }} />
        <dl className={`feature-card${visible ? ' card-reveal-in' : ''}`} style={{ padding: 8, margin: 0 }}>
          {impact.items.map((m) => (
            <div key={m.project + m.label} className="flow-row" style={{ gridTemplateColumns: '96px minmax(0,1fr)' }}>
              <dd style={{ margin: 0, fontFamily: 'var(--font-h)', fontWeight: 700, fontSize: '1.15rem', color: 'var(--accent)', lineHeight: 1.15 }}>{m.value}</dd>
              <div>
                <dt style={{ fontFamily: 'var(--font-h)', fontWeight: 600, fontSize: '0.9rem' }}>{m.label}</dt>
                <dd style={{ margin: 0, fontSize: '0.8rem', color: 'var(--muted)' }}>
                  {m.project} — {m.note}
                </dd>
              </div>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
