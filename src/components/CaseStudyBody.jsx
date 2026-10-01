import { Icon } from './Icon.jsx';

/** The actual case-study content (description, metrics, sections) shared
 * between the overlay (CaseStudyModal, opened from the Projects grid) and
 * the standalone page (ProjectPage, a real crawlable /projects/:id URL) --
 * one body, two shells, so there's nothing to keep in sync by hand.
 * @param {{ project: import('../data/types.js').Project }} props */
export function CaseStudyBody({ project }) {
  return (
    <div style={{ display: 'grid', gap: 32 }}>
      <p style={{ fontSize: '1.08rem', lineHeight: 1.6, maxWidth: '70ch', color: 'var(--muted)' }}>{project.description}</p>
      <dl className="grid-auto" style={{ display: 'grid', gap: 12, '--cols': 'repeat(4,1fr)' }}>
        {project.metrics.map((m) => (
          <div key={m.label} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 16 }}>
            <dt style={{ fontSize: '0.68rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--muted)' }}>{m.label}</dt>
            <dd style={{ margin: '6px 0 0', fontFamily: 'var(--font-h)', fontWeight: 700, fontSize: '1.3rem', color: 'var(--accent)' }}>{m.value}</dd>
          </div>
        ))}
      </dl>
      {project.sections.map((sec) => (
        <section key={sec.h} style={{ borderTop: '1px solid var(--border)', paddingTop: 22, display: 'grid', gap: 12 }}>
          <h3 style={{ fontFamily: 'var(--font-h)', fontWeight: 600, fontSize: '1.15rem' }}>{sec.h}</h3>
          <p style={{ lineHeight: 1.65, maxWidth: '74ch', color: 'var(--muted)' }}>{sec.p}</p>
          {sec.bullets.length > 0 && (
            <ul style={{ display: 'grid', gap: 8 }}>
              {sec.bullets.map((b) => (
                <li key={b} style={{ display: 'grid', gridTemplateColumns: '14px minmax(0,1fr)', gap: 10, fontSize: '0.94rem', lineHeight: 1.55 }}>
                  <Icon name="check" size={14} style={{ marginTop: 4, color: 'var(--accent)' }} />
                  {b}
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </div>
  );
}
