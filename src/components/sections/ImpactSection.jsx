import impact from '../../data/impact.json';
import { SectionHeader } from '../SectionHeader.jsx';
import { ImpactStat } from '../ImpactStat.jsx';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver.js';

export function ImpactSection({ reducedMotion }) {
  const [ref, visible] = useIntersectionObserver({ reduced: reducedMotion });
  return (
    <section id="impact" ref={ref} aria-labelledby="impact-h" data-readable="Engineering impact" className={visible ? 'reveal-in' : 'reveal-init'} style={{ borderTop: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: 'clamp(56px,8vw,96px) 20px' }}>
        <SectionHeader eyebrow={impact.eyebrow} title={impact.title} id="impact-h" subtitle={impact.intro} style={{ marginBottom: 36 }} />
        <ul className="grid-auto" style={{ display: 'grid', gap: 16, '--cols': 'repeat(3,1fr)' }}>
          {impact.items.map((m, i) => (
            <ImpactStat key={m.project + m.label + i} {...m} />
          ))}
        </ul>
      </div>
    </section>
  );
}
