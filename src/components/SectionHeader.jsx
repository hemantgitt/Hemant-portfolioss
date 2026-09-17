import { memo } from 'react';

/**
 * @param {{ eyebrow: string, title: string, id: string, subtitle?: string, style?: object }} props
 */
function SectionHeaderBase({ eyebrow, title, id, subtitle, style }) {
  return (
    <div style={{ marginBottom: 10, ...style }}>
      <p
        style={{
          margin: '0 0 10px',
          fontSize: '0.76rem',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--accent)',
          fontFamily: 'var(--font-h)',
          fontWeight: 600,
        }}
      >
        {eyebrow}
      </p>
      <h2
        id={id}
        style={{
          margin: 0,
          fontFamily: 'var(--font-h)',
          fontWeight: 700,
          fontSize: 'clamp(1.7rem, 3.4vw, 2.3rem)',
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
        }}
      >
        {title}
      </h2>
      {subtitle ? (
        <p style={{ margin: '12px 0 0', maxWidth: '66ch', lineHeight: 1.6, color: 'var(--muted)' }}>{subtitle}</p>
      ) : null}
    </div>
  );
}

export const SectionHeader = memo(SectionHeaderBase);
