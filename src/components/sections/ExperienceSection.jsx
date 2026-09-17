import experience from '../../data/experience.json';
import { SectionHeader } from '../SectionHeader.jsx';
import { ExperienceItem } from '../ExperienceItem.jsx';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver.js';

export function ExperienceSection({ reducedMotion }) {
  const [ref, visible] = useIntersectionObserver({ reduced: reducedMotion });
  return (
    <section id="experience" ref={ref} aria-labelledby="work-h" className={visible ? 'reveal-in' : 'reveal-init'} style={{ borderTop: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: 'clamp(56px,8vw,96px) 20px' }}>
        <SectionHeader eyebrow={experience.eyebrow} title={experience.title} id="work-h" style={{ marginBottom: 40 }} />
        <ol style={{ position: 'relative', display: 'grid' }}>
          <div aria-hidden="true" style={{ position: 'absolute', left: 5, top: 10, bottom: 10, width: 2, background: 'var(--border)' }} />
          {experience.items.map((job) => (
            <ExperienceItem key={job.company} item={job} />
          ))}
        </ol>
      </div>
    </section>
  );
}
