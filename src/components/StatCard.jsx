import { memo } from 'react';

/** @param {{ label: string, value: string, note: string }} props */
function StatCardBase({ label, value, note }) {
  return (
    <div
      className="card-hover"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '18px 20px', display: 'grid', gap: 4 }}
    >
      <dt style={{ fontSize: '0.7rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--muted)', fontFamily: 'var(--font-h)', fontWeight: 600 }}>
        {label}
      </dt>
      <dd style={{ margin: 0, fontFamily: 'var(--font-h)', fontWeight: 700, fontSize: '1.4rem', letterSpacing: '-0.01em' }}>{value}</dd>
      <dd style={{ margin: 0, fontSize: '0.82rem', color: 'var(--muted)' }}>{note}</dd>
    </div>
  );
}

export const StatCard = memo(StatCardBase);
