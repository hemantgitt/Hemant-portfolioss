import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from './Icon.jsx';
import { StatCard } from './StatCard.jsx';
import { useModal } from '../hooks/useModal.js';

/**
 * Modal for the hero's 4 stat cards (Experience, Domains, Most recent role,
 * Mentoring), which now live only in this modal rather than inline in the
 * hero layout. Follows the same portal + useModal + Escape/backdrop-close
 * pattern as CaseStudyModal, plus a manual Tab focus trap since this dialog
 * needs to keep keyboard focus inside it while open.
 *
 * @param {{ facts: import('../data/types.js').HeroFact[], onClose: () => void }} props
 */
export function QuickStatsModal({ facts, onClose }) {
  const dialogRef = useModal(true);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const focusables = dialogRef.current?.querySelectorAll('button, a[href], [tabindex]:not([tabindex="-1"])');
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose, dialogRef]);

  const onBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  // Portal to document.body for the same reason as CaseStudyModal: escaping
  // any transformed ancestor so the fixed-position backdrop covers the
  // whole viewport rather than just that ancestor's box.
  return createPortal(
    <div
      role="presentation"
      className="quick-stats-backdrop"
      style={{ position: 'fixed', inset: 0, zIndex: 85, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, background: 'rgba(6,6,8,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={onBackdrop}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-stats-title"
        ref={dialogRef}
        className="quick-stats-dialog"
        style={{ width: '100%', maxWidth: 560, maxHeight: '85vh', overflow: 'auto', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, boxShadow: 'var(--shadow-lg)' }}
      >
        <div style={{ position: 'sticky', top: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '18px 20px', borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
          <h2 id="quick-stats-title" style={{ fontFamily: 'var(--font-h)', fontWeight: 700, fontSize: '1.05rem' }}>
            Quick stats
          </h2>
          <button type="button" onClick={onClose} aria-label="Close quick stats" className="icon-btn" style={{ width: 34, height: 34, flex: 'none' }}>
            <Icon name="x" size={15} />
          </button>
        </div>
        <dl className="quick-stats-grid" style={{ display: 'grid', gap: 12, padding: 20 }}>
          {facts.map((f, i) => (
            <StatCard key={f.label} {...f} delayMs={i * 60} />
          ))}
        </dl>
      </div>
    </div>,
    document.body
  );
}
