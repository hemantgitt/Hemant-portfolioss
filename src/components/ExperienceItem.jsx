import { memo } from 'react';
import { Icon } from './Icon.jsx';

/** @param {{ item: import('../data/types.js').ExperienceEntry, isActive?: boolean }} props */
function ExperienceItemBase({ item, isActive }) {
  return (
    <li style={{ position: 'relative', padding: '28px 0 28px 32px', display: 'grid', gap: 14 }}>
      <span
        aria-hidden="true"
        className={`exp-dot${isActive ? ' is-active' : ''}`}
        style={{ position: 'absolute', left: 0, top: 34, width: 12, height: 12, borderRadius: '50%', background: isActive ? 'var(--accent)' : 'var(--muted)', boxShadow: '0 0 0 4px var(--bg)' }}
      />
      <div className="split" style={{ display: 'grid', gap: 6, '--sa': '0.32fr', '--sb': '0.68fr' }}>
        <div style={{ display: 'grid', gap: 4, alignContent: 'start' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--muted)', fontFamily: 'var(--font-h)', fontWeight: 600 }}>{item.meta}</p>
        </div>
        <div style={{ display: 'grid', gap: 4 }}>
          <h3 style={{ fontFamily: 'var(--font-h)', fontWeight: 700, fontSize: '1.25rem' }}>{item.company}</h3>
          <p style={{ margin: '0 0 6px', fontFamily: 'var(--font-h)', fontWeight: 500, fontSize: '0.92rem', color: 'var(--accent)' }}>{item.title}</p>
          <ul style={{ display: 'grid', gap: 8 }}>
            {item.points.map((pt) => (
              <li key={pt} style={{ display: 'grid', gridTemplateColumns: '14px minmax(0,1fr)', gap: 10, lineHeight: 1.55, fontSize: '0.95rem', color: 'var(--muted)' }}>
                <Icon name="check" size={14} style={{ marginTop: 4, color: 'var(--accent)' }} />
                <span style={{ color: 'var(--text)' }}>{pt}</span>
              </li>
            ))}
          </ul>
          <ul style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
            {item.projects.map((p) => (
              <li key={p} style={{ fontSize: '0.76rem', fontFamily: 'var(--font-h)', fontWeight: 500, color: 'var(--accent)', background: 'var(--accent-tint)', padding: '5px 11px', borderRadius: 999 }}>
                {p}
              </li>
            ))}
          </ul>
          {item.tech && (
            <ul style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 2 }}>
              {item.tech.map((t) => (
                <li key={t} className="tag" style={{ fontSize: '0.76rem' }}>
                  {t}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </li>
  );
}

export const ExperienceItem = memo(ExperienceItemBase);
