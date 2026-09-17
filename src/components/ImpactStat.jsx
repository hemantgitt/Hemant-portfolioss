import { memo } from 'react';

/** @param {import('../data/types.js').ImpactStat & { visible?: boolean, delayMs?: number }} props */
function ImpactStatBase({ project, value, label, note, visible, delayMs = 0 }) {
  return (
    <li
      className={`feature-card${visible ? ' card-reveal-in' : ''}`}
      style={{ padding: 22, display: 'grid', gap: 8, alignContent: 'start', ...(visible ? { animationDelay: `${delayMs}ms` } : { opacity: 0 }) }}
    >
      <p style={{ fontSize: '0.7rem', letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: 'var(--font-h)', fontWeight: 600, color: 'var(--muted)' }}>{project}</p>
      <p style={{ fontFamily: 'var(--font-h)', fontWeight: 700, fontSize: 'clamp(1.7rem, 3vw, 2.2rem)', lineHeight: 1, letterSpacing: '-0.02em', color: 'var(--accent)' }}>{value}</p>
      <h3 style={{ fontSize: '0.96rem', fontFamily: 'var(--font-h)', fontWeight: 600 }}>{label}</h3>
      <p style={{ fontSize: '0.83rem', lineHeight: 1.5, color: 'var(--muted)' }}>{note}</p>
    </li>
  );
}

export const ImpactStat = memo(ImpactStatBase);
