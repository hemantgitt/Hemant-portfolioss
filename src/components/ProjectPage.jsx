import { useEffect } from 'react';
import projects from '../data/projects.json';
import site from '../data/site.json';
import { Icon } from './Icon.jsx';
import { CaseStudyBody } from './CaseStudyBody.jsx';

/** A real, crawlable /projects/:id page for one case study -- same content
 * as CaseStudyModal's overlay (via the shared CaseStudyBody), but with its
 * own URL, <title>, and the portfolio's normal header/footer chrome so it
 * reads as part of the site rather than an orphaned page. Part of the
 * hybrid single-page/multi-page split: the rest of the portfolio stays one
 * scrolling page for immediate recruiter impact, while each project gets
 * its own indexable URL for SEO and deep-linking.
 * @param {{ projectId: string }} props */
export function ProjectPage({ projectId }) {
  const project = projects.items.find((p) => p.id === projectId);

  useEffect(() => {
    if (!project) return undefined;
    const prevTitle = document.title;
    document.title = `${project.name} — Case Study | ${site.name}`;
    return () => {
      document.title = prevTitle;
    };
  }, [project]);

  if (!project) {
    return (
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '96px 20px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-h)', fontWeight: 700, fontSize: '1.6rem', marginBottom: 12 }}>Project not found</h1>
        <a href="/#projects" className="btn btn-primary" style={{ minHeight: 44, paddingInline: 18, fontSize: '0.87rem' }}>
          Back to projects
        </a>
      </div>
    );
  }

  return (
    <main id="main" style={{ maxWidth: 980, margin: '0 auto', padding: 'clamp(32px,6vw,56px) 20px 96px' }}>
      <a href="/#projects" className="icon-btn" style={{ width: 'fit-content', display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 14px', marginBottom: 28, textDecoration: 'none', color: 'var(--text)', fontFamily: 'var(--font-h)', fontWeight: 600, fontSize: '0.85rem' }}>
        <Icon name="arrow-right" size={14} style={{ transform: 'rotate(180deg)' }} />
        Back to projects
      </a>
      <header style={{ marginBottom: 32 }}>
        <p style={{ margin: '0 0 8px', fontSize: '0.72rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--accent)', fontFamily: 'var(--font-h)', fontWeight: 600 }}>
          Case study — {project.category}
        </p>
        <h1 style={{ fontFamily: 'var(--font-h)', fontWeight: 700, fontSize: 'clamp(1.8rem, 5vw, 2.6rem)', letterSpacing: '-0.02em', margin: 0 }}>{project.name}</h1>
      </header>
      <CaseStudyBody project={project} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, borderTop: '1px solid var(--border)', marginTop: 32, paddingTop: 24 }}>
        <a href="/#projects" className="btn btn-outline" style={{ minHeight: 44, paddingInline: 18, fontSize: '0.87rem' }}>
          All projects
        </a>
        <a href="/#contact" className="btn btn-primary" style={{ minHeight: 44, paddingInline: 18, fontSize: '0.87rem' }}>
          Discuss this work
        </a>
      </div>
    </main>
  );
}
