import { memo } from 'react';
import { Icon } from './Icon.jsx';

/**
 * @param {{ project: import('../data/types.js').Project, onOpen: (id: string) => void }} props
 */
function ProjectCardBase({ project, onOpen }) {
  return (
    <li
      className="card-hover"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
    >
      <div
        aria-hidden="true"
        style={{ height: 100, background: project.imageBg, borderBottom: '1px solid var(--border)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <img
          src={project.image}
          alt=""
          width={project.imageWidth}
          height={project.imageHeight}
          loading="lazy"
          decoding="async"
          style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center', padding: '4px 12px', boxSizing: 'border-box', display: 'block' }}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '12px 22px 0' }}>
        <span
          style={{
            fontFamily: 'var(--font-h)', fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.06em', textTransform: 'uppercase',
            color: 'var(--accent)', background: 'var(--surface)', border: '1px solid var(--border)', padding: '6px 12px', borderRadius: 999,
          }}
        >
          {project.category}
        </span>
      </div>
      <div style={{ padding: 22, display: 'grid', gap: 12, alignContent: 'start', flex: 1 }}>
        <h3 style={{ fontFamily: 'var(--font-h)', fontWeight: 700, fontSize: '1.2rem' }}>{project.name}</h3>
        <p style={{ fontSize: '0.92rem', lineHeight: 1.55, color: 'var(--muted)' }}>{project.description}</p>
        <p style={{ fontSize: '0.82rem' }}>
          <span style={{ fontFamily: 'var(--font-h)', fontWeight: 600 }}>Role — </span>
          <span style={{ color: 'var(--muted)' }}>{project.role}</span>
        </p>
        <ul style={{ display: 'grid', gap: 6 }}>
          {project.highlights.map((o) => (
            <li key={o} style={{ display: 'grid', gridTemplateColumns: '14px minmax(0,1fr)', gap: 10, fontSize: '0.85rem', lineHeight: 1.5, color: 'var(--muted)' }}>
              <Icon name="trending-up" size={14} style={{ marginTop: 3, color: 'var(--accent)' }} />
              {o}
            </li>
          ))}
        </ul>
        <ul style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {project.tech.map((t) => (
            <li key={t} className="tag">
              {t}
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => onOpen(project.id)}
          style={{
            justifySelf: 'start', marginTop: 6, display: 'inline-flex', alignItems: 'center', gap: 8, minHeight: 44, paddingInline: 4,
            background: 'none', border: 'none', color: 'var(--accent)', fontFamily: 'var(--font-h)', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer',
          }}
        >
          View case study
          <Icon name="arrow-right" size={16} />
        </button>
      </div>
    </li>
  );
}

export const ProjectCard = memo(ProjectCardBase);
