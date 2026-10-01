import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from './Icon.jsx';
import { CaseStudyBody } from './CaseStudyBody.jsx';
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

  // Rendered via a portal into document.body rather than in place: this
  // modal is mounted inside sections that have a CSS `transform` animation
  // (the scroll-reveal effect), and any ancestor with a transform becomes
  // the containing block for `position: fixed` descendants — which broke
  // the backdrop, making it cover only part of that ancestor's box instead
  // of the full viewport. Escaping to body sidesteps that entirely.
  return createPortal(
    <div role="presentation" style={{ position: 'fixed', inset: 0, zIndex: 80 }}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cs-title"
        ref={dialogRef}
        className="case-study-panel"
        style={{ position: 'absolute', inset: 0, background: 'var(--bg)', overflowY: 'auto' }}
      >
        {/* Hero banner: the project's own logo/mark blown up on an
            accent-tinted field, the same bold-panel language the Contact
            and About sections use, so opening a case study feels like a
            deliberate "cover", not a plain box of text. */}
        <div style={{ position: 'relative', background: project.imageBg, overflow: 'hidden', borderBottom: '1px solid var(--border)' }}>
          <div
            aria-hidden="true"
            style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, color-mix(in srgb, var(--accent) 18%, transparent), transparent 55%, color-mix(in srgb, var(--bg) 92%, transparent) 96%)' }}
          />
          <div style={{ position: 'relative', maxWidth: 1180, margin: '0 auto', padding: 'clamp(70px,10vw,110px) 24px 28px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <img
              src={project.image}
              alt=""
              width={project.imageWidth}
              height={project.imageHeight}
              className="case-study-banner-img"
              style={{ maxWidth: 220, maxHeight: 110, width: 'auto', height: 'auto', objectFit: 'contain', marginBottom: 20, filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.35))' }}
            />
            <p style={{ margin: '0 0 10px', fontSize: '0.74rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent)', fontFamily: 'var(--font-h)', fontWeight: 700, background: 'var(--accent-tint)', padding: '6px 14px', borderRadius: 999 }}>
              Case study — {project.category}
            </p>
            <h2 id="cs-title" style={{ margin: 0, fontFamily: 'var(--font-h)', fontWeight: 700, fontSize: 'clamp(1.8rem, 5vw, 3rem)', letterSpacing: '-0.02em' }}>
              {project.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close case study"
            className="icon-btn"
            style={{ position: 'absolute', top: 18, right: 18, width: 40, height: 40, background: 'color-mix(in srgb, var(--bg) 55%, transparent)', backdropFilter: 'blur(8px)' }}
          >
            <Icon name="x" size={17} />
          </button>
        </div>

        <div style={{ maxWidth: 820, margin: '0 auto', padding: '40px 24px 80px', display: 'grid', gap: 32 }}>
          <CaseStudyBody project={project} />
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
    </div>,
    document.body
  );
}
