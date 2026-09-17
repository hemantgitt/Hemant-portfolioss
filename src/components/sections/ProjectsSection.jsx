import { useCallback, useState } from 'react';
import projects from '../../data/projects.json';
import { SectionHeader } from '../SectionHeader.jsx';
import { ProjectCard } from '../ProjectCard.jsx';
import { CaseStudyModal } from '../CaseStudyModal.jsx';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver.js';

export function ProjectsSection({ reducedMotion }) {
  const [ref, visible] = useIntersectionObserver({ reduced: reducedMotion });
  const [openId, setOpenId] = useState(null);
  const openProject = useCallback((id) => setOpenId(id), []);
  const closeProject = useCallback(() => setOpenId(null), []);
  const current = projects.items.find((p) => p.id === openId);

  return (
    <section id="projects" ref={ref} aria-labelledby="proj-h" className={visible ? 'reveal-in' : 'reveal-init'} style={{ borderTop: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: 'clamp(56px,8vw,96px) 20px' }}>
        <SectionHeader eyebrow={projects.eyebrow} title={projects.title} id="proj-h" subtitle={projects.intro} style={{ marginBottom: 40 }} />
        <ul style={{ display: 'grid', gap: 20, gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
          {projects.items.map((p) => (
            <ProjectCard key={p.id} project={p} onOpen={openProject} />
          ))}
        </ul>
      </div>
      {current && <CaseStudyModal project={current} onClose={closeProject} />}
    </section>
  );
}
