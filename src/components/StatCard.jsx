import { memo } from 'react';

/** @param {{ label: string, value: string, note: string, delayMs?: number }} props */
function StatCardBase({ label, value, note, delayMs = 0 }) {
  return (
    <div className="feature-card card-reveal-in" style={{ padding: '18px 20px', display: 'grid', gap: 4, animationDelay: `${delayMs}ms` }}>
      <dt style={{ fontSize: '0.7rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--muted)', fontFamily: 'var(--font-h)', fontWeight: 600 }}>
        {label}
      </dt>
      <dd style={{ margin: 0, fontFamily: 'var(--font-h)', fontWeight: 700, fontSize: '1.4rem', letterSpacing: '-0.01em' }}>{value}</dd>
      <dd style={{ margin: 0, fontSize: '0.82rem', color: 'var(--muted)' }}>{note}</dd>
    </div>
  );
}

export const StatCard = memo(StatCardBase);
