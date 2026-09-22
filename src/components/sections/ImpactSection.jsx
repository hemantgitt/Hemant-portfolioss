import impact from '../../data/impact.json';
import { SectionHeader } from '../SectionHeader.jsx';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver.js';

export function ImpactSection({ reducedMotion }) {
  const [ref, visible] = useIntersectionObserver({ reduced: reducedMotion });
  return (
    <section id="impact" ref={ref} aria-labelledby="impact-h" data-readable="Engineering impact" className={visible ? 'reveal-in' : 'reveal-init'} style={{ borderTop: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: 'clamp(56px,8vw,96px) 20px' }}>
        <SectionHeader eyebrow={impact.eyebrow} title={impact.title} id="impact-h" subtitle={impact.intro} style={{ marginBottom: 36 }} />

        {/* Mobile: one card, a compact row per figure -- keeps the section
            short on a narrow screen instead of six separate tall cards. */}
        <dl className="feature-card mob-only" style={{ padding: 8, margin: 0 }}>
          {impact.items.map((m) => (
            <div key={m.project + m.label} className="flow-row impact-row">
              <dd className="impact-value" style={{ margin: 0, fontFamily: 'var(--font-h)', fontWeight: 700, fontSize: '1.15rem', color: 'var(--accent)', lineHeight: 1.15 }}>{m.value}</dd>
              <div className="impact-detail">
                <dt style={{ margin: 0, fontFamily: 'var(--font-h)', fontWeight: 600, fontSize: '0.9rem' }}>{m.label}</dt>
                <dd style={{ margin: 0, fontSize: '0.8rem', color: 'var(--muted)' }}>
                  {m.project} — {m.note}
                </dd>
              </div>
            </div>
          ))}
        </dl>

        {/* Desktop: a single-column list left a lot of dead horizontal
            space unused on a wide viewport. A stat-card grid (same
            feature-card language as Skills/Projects) fills that width
            with real content and gives each figure its own hover glow. */}
        <div className="desk-only">
          <dl style={{ margin: 0, display: 'grid', gap: 20, gridTemplateColumns: 'repeat(3, minmax(0,1fr))' }}>
            {impact.items.map((m, i) => (
              <div
                key={m.project + m.label}
                className={`feature-card${visible ? ' card-reveal-in' : ''}`}
                style={visible ? { animationDelay: `${i * 60}ms` } : { opacity: 0 }}
              >
                <dd style={{ margin: '0 0 10px', fontFamily: 'var(--font-h)', fontWeight: 700, fontSize: '1.9rem', color: 'var(--accent)', lineHeight: 1.05 }}>{m.value}</dd>
                <dt style={{ margin: '0 0 6px', fontFamily: 'var(--font-h)', fontWeight: 600, fontSize: '0.95rem' }}>{m.label}</dt>
                <dd style={{ margin: 0, fontSize: '0.82rem', color: 'var(--muted)', lineHeight: 1.5 }}>
                  {m.project} — {m.note}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
