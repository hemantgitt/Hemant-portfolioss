import impact from '../../data/impact.json';
import { SectionHeader } from '../SectionHeader.jsx';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver.js';

export function ImpactSection({ reducedMotion }) {
  const [ref, visible] = useIntersectionObserver({ reduced: reducedMotion });
  return (
    <section id="impact" ref={ref} aria-labelledby="impact-h" data-readable="Engineering impact" className={`desk-only${visible ? ' reveal-in' : ' reveal-init'}`} style={{ borderTop: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: 'clamp(56px,8vw,96px) 20px' }}>
        <SectionHeader eyebrow={impact.eyebrow} title={impact.title} id="impact-h" subtitle={impact.intro} style={{ marginBottom: 36 }} />

        {/* One stat-card grid for every viewport -- single column and
            stacked on mobile, 3 columns on desktop via .grid-auto's own
            breakpoint. Same markup everywhere (no separate mobile/desktop
            DOM), so there's nothing to drift out of sync and nothing
            duplicated for assistive tech to read twice. */}
        <dl className="grid-auto" style={{ margin: 0, gap: 20, '--cols': 'repeat(3, minmax(0,1fr))' }}>
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
    </section>
  );
}
