import { useEffect } from 'react';
import { Icon } from './Icon.jsx';
import { useModal } from '../hooks/useModal.js';

/** @param {{ project: import('../data/types.js').Project, onClose: () => void }} props */
export function CaseStudyModal({ project, onClose }) {
  const dialogRef = useModal(true);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const onBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    // The backdrop is a pointer-only convenience for closing; keyboard users
    // close via the Escape handler above or the Close button in the dialog,
    // so it's intentionally not a focusable/keyboard-interactive element.
    <div
      role="presentation"
      style={{ position: 'fixed', inset: 0, zIndex: 80, display: 'flex', justifyContent: 'center', padding: 0, background: 'rgba(6,6,8,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={onBackdrop}
    >
      <div role="dialog" aria-modal="true" aria-labelledby="cs-title" ref={dialogRef} style={{ width: 'min(980px, 100%)', margin: '0 auto', background: 'var(--bg)', overflow: 'auto', maxHeight: '100vh' }}>
        <header style={{ position: 'sticky', top: 0, background: 'color-mix(in srgb, var(--bg) 88%, transparent)', backdropFilter: 'blur(10px)', borderBottom: '1px solid var(--border)', padding: '22px 24px', display: 'flex', alignItems: 'flex-start', gap: 16 }}>
          <div style={{ flex: 1 }}>
            <p style={{ margin: '0 0 6px', fontSize: '0.72rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--accent)', fontFamily: 'var(--font-h)', fontWeight: 600 }}>
              Case study — {project.category}
            </p>
            <h2 id="cs-title" style={{ fontFamily: 'var(--font-h)', fontWeight: 700, fontSize: 'clamp(1.5rem, 4vw, 2.1rem)', letterSpacing: '-0.02em' }}>{project.name}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close case study" className="icon-btn" style={{ width: 38, height: 38, flex: 'none' }}>
            <Icon name="x" size={16} />
          </button>
        </header>
        <div style={{ padding: '24px 24px 72px', display: 'grid', gap: 32 }}>
          <p style={{ fontSize: '1.08rem', lineHeight: 1.6, maxWidth: '70ch', color: 'var(--muted)' }}>{project.description}</p>
          <dl className="grid-auto" style={{ display: 'grid', gap: 12, '--cols': 'repeat(4,1fr)' }}>
            {project.metrics.map((m) => (
              <div key={m.label} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 16 }}>
                <dt style={{ fontSize: '0.68rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--muted)' }}>{m.label}</dt>
                <dd style={{ margin: '6px 0 0', fontFamily: 'var(--font-h)', fontWeight: 700, fontSize: '1.3rem', color: 'var(--accent)' }}>{m.value}</dd>
              </div>
            ))}
          </dl>
          {project.sections.map((sec) => (
            <section key={sec.h} style={{ borderTop: '1px solid var(--border)', paddingTop: 22, display: 'grid', gap: 12 }}>
              <h3 style={{ fontFamily: 'var(--font-h)', fontWeight: 600, fontSize: '1.15rem' }}>{sec.h}</h3>
              <p style={{ lineHeight: 1.65, maxWidth: '74ch', color: 'var(--muted)' }}>{sec.p}</p>
              {sec.bullets.length > 0 && (
                <ul style={{ display: 'grid', gap: 8 }}>
                  {sec.bullets.map((b) => (
                    <li key={b} style={{ display: 'grid', gridTemplateColumns: '14px minmax(0,1fr)', gap: 10, fontSize: '0.94rem', lineHeight: 1.55 }}>
                      <Icon name="check" size={14} style={{ marginTop: 4, color: 'var(--accent)' }} />
                      {b}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, borderTop: '1px solid var(--border)', paddingTop: 24 }}>
            <button type="button" onClick={onClose} className="btn btn-outline" style={{ minHeight: 44, paddingInline: 18, fontSize: '0.87rem' }}>
              Close
            </button>
            <a href="#contact" onClick={onClose} className="btn btn-primary" style={{ minHeight: 44, paddingInline: 18, fontSize: '0.87rem' }}>
              Discuss this work
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
