import expertise from '../../data/expertise.json';
import { SectionHeader } from '../SectionHeader.jsx';
import { Icon } from '../Icon.jsx';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver.js';

export function ExpertiseSection({ reducedMotion }) {
  const [ref, visible] = useIntersectionObserver({ reduced: reducedMotion });
  return (
    <section id="expertise" ref={ref} aria-labelledby="exp-h" className={visible ? 'reveal-in' : 'reveal-init'} style={{ borderTop: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: 'clamp(56px,8vw,96px) 20px' }}>
        <SectionHeader eyebrow={expertise.eyebrow} title={expertise.title} id="exp-h" style={{ marginBottom: 36 }} />
        <ul className="grid-auto" style={{ display: 'grid', gap: 14, '--cols': 'repeat(5,1fr)' }}>
          {expertise.items.map((e) => (
            <li
              key={e.title}
              className="card-hover"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 20, display: 'grid', gap: 10, alignContent: 'start' }}
            >
              <Icon name={e.icon} size={20} style={{ color: 'var(--accent)' }} />
              <h3 style={{ fontFamily: 'var(--font-h)', fontWeight: 600, fontSize: '0.98rem', lineHeight: 1.25 }}>{e.title}</h3>
              <p style={{ fontSize: '0.83rem', lineHeight: 1.5, color: 'var(--muted)' }}>{e.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
