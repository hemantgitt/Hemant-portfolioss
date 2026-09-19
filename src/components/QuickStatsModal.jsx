import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from './Icon.jsx';
import { StatCard } from './StatCard.jsx';
import { useModal } from '../hooks/useModal.js';

// Matched to hero.json's facts by array position — icon is purely decorative
// (the underlying data has no icon field), so this stays a positional map
// rather than something keyed by label text.
const FACT_ICONS = ['activity', 'globe', 'briefcase', 'users'];

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
        style={{ width: '100%', maxWidth: 600, maxHeight: '85vh', overflow: 'auto', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, boxShadow: 'var(--shadow-lg)' }}
      >
        <div className="quick-stats-header">
          <span aria-hidden="true" className="quick-stats-header-glow" />
          <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <p style={{ fontSize: '0.72rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--accent)', fontFamily: 'var(--font-h)', fontWeight: 600, margin: '0 0 4px' }}>
                At a glance
              </p>
              <h2 id="quick-stats-title" style={{ fontFamily: 'var(--font-h)', fontWeight: 700, fontSize: '1.25rem', margin: 0 }}>
                Quick stats
              </h2>
            </div>
            <button type="button" onClick={onClose} aria-label="Close quick stats" className="icon-btn" style={{ width: 34, height: 34, flex: 'none', position: 'relative' }}>
              <Icon name="x" size={15} />
            </button>
          </div>
        </div>
        <dl className="quick-stats-grid" style={{ display: 'grid', gap: 12, padding: 20 }}>
          {facts.map((f, i) => (
            <StatCard key={f.label} {...f} icon={FACT_ICONS[i]} delayMs={i * 60} />
          ))}
        </dl>
      </div>
    </div>,
    document.body
  );
}
