import skills from '../../data/skills.json';
import { SectionHeader } from '../SectionHeader.jsx';
import { SkillBadge } from '../SkillBadge.jsx';
import { Icon } from '../Icon.jsx';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver.js';

export function SkillsSection({ reducedMotion }) {
  const [ref, visible] = useIntersectionObserver({ reduced: reducedMotion });
  return (
    <section id="skills" ref={ref} aria-labelledby="skills-h" className={visible ? 'reveal-in' : 'reveal-init'} style={{ borderTop: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: 'clamp(56px,8vw,96px) 20px' }}>
        <SectionHeader eyebrow={skills.eyebrow} title={skills.title} id="skills-h" style={{ marginBottom: 36 }} />
        <div style={{ display: 'grid', gap: 28, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          {skills.groups.map((g, i) => (
            <section
              key={g.id}
              aria-labelledby={g.id}
              className={`feature-card${g.id === 'sg-fe' ? ' feature-card--primary' : ''}${visible ? ' card-reveal-in' : ''}`}
              style={visible ? { animationDelay: `${i * 80}ms` } : { opacity: 0 }}
            >
              <h3 id={g.id} style={{ margin: '0 0 14px', fontSize: '0.78rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--muted)', fontFamily: 'var(--font-h)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className="icon-chip">
                  <Icon name={g.icon} size={15} />
                </span>
                {g.name}
              </h3>
              <ul style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                {g.items.map((s) => (
                  <SkillBadge key={s.name} {...s} />
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
