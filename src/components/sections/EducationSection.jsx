import edu from '../../data/education.json';
import { SectionHeader } from '../SectionHeader.jsx';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver.js';

export function EducationSection({ reducedMotion }) {
  const [ref, visible] = useIntersectionObserver({ reduced: reducedMotion });
  return (
    <section id="education" ref={ref} aria-labelledby="edu-h" className={visible ? 'reveal-in' : 'reveal-init'} style={{ borderTop: '1px solid var(--border)' }}>
      <div className="split" style={{ maxWidth: 1180, margin: '0 auto', padding: 'clamp(56px,8vw,96px) 20px', display: 'grid', gap: 36, '--sa': '0.6fr', '--sb': '1.4fr' }}>
        <SectionHeader eyebrow={edu.eyebrow} title={edu.title} id="edu-h" />
        <div style={{ display: 'grid', gap: 16 }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 20 }}>
            <h3 style={{ margin: '0 0 4px', fontFamily: 'var(--font-h)', fontWeight: 600, fontSize: '1.1rem' }}>{edu.degree.title}</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--muted)' }}>{edu.degree.note}</p>
          </div>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 20 }}>
            <h3 style={{ margin: '0 0 4px', fontFamily: 'var(--font-h)', fontWeight: 600, fontSize: '1.1rem' }}>{edu.certification.title}</h3>
            <p style={{ margin: '0 0 14px', fontSize: '0.88rem', color: 'var(--muted)' }}>{edu.certification.note}</p>
            <ul style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {edu.certification.topics.map((t) => (
                <li key={t} className="tag">{t}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
