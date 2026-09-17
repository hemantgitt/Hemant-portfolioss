import a11y from '../../data/accessibility.json';
import { SectionHeader } from '../SectionHeader.jsx';
import { Icon } from '../Icon.jsx';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver.js';

/** @param {{ reducedMotion: boolean, onOpenPanel: () => void, onReadAloud: () => void }} props */
export function AccessibilitySection({ reducedMotion, onOpenPanel, onReadAloud }) {
  const [ref, visible] = useIntersectionObserver({ reduced: reducedMotion });
  return (
    <section id="accessibility" ref={ref} aria-labelledby="a11y-h" className={visible ? 'reveal-in' : 'reveal-init'} style={{ borderTop: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: 'clamp(56px,8vw,96px) 20px' }}>
        <SectionHeader eyebrow={a11y.eyebrow} title={a11y.title} id="a11y-h" subtitle={a11y.intro} style={{ marginBottom: 36 }} />
        <div className="split" style={{ display: 'grid', gap: 24, '--sa': '1.15fr', '--sb': '0.85fr' }}>
          <ul className="grid-auto" style={{ display: 'grid', gap: 12, '--cols': 'repeat(3,1fr)' }}>
            {a11y.practices.map((a, i) => (
              <li
                key={a.title}
                className={`feature-card${visible ? ' card-reveal-in' : ''}`}
                style={{ padding: 16, display: 'grid', gap: 6, alignContent: 'start', ...(visible ? { animationDelay: `${i * 50}ms` } : { opacity: 0 }) }}
              >
                <span className="icon-chip">
                  <Icon name={a.icon} size={15} />
                </span>
                <h3 style={{ fontFamily: 'var(--font-h)', fontWeight: 600, fontSize: '0.9rem' }}>{a.title}</h3>
                <p style={{ fontSize: '0.8rem', lineHeight: 1.5, color: 'var(--muted)' }}>{a.body}</p>
              </li>
            ))}
          </ul>
          <div className="feature-card" style={{ padding: 22, display: 'grid', gap: 14, alignContent: 'start' }}>
            <h3 style={{ fontFamily: 'var(--font-h)', fontWeight: 600, fontSize: '1.05rem' }}>{a11y.tryItTitle}</h3>
            <p style={{ fontSize: '0.87rem', lineHeight: 1.55, color: 'var(--muted)' }}>
              Press <kbd>Tab</kbd> to walk the page — every control shows a focus ring. <kbd>Esc</kbd> closes any open dialog or panel, and focus returns to where you left it.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              <button type="button" onClick={onOpenPanel} className="btn btn-primary" style={{ minHeight: 44, paddingInline: 16, fontSize: '0.85rem' }}>
                <Icon name="settings-2" size={15} />
                Accessibility preferences
              </button>
              <button type="button" onClick={onReadAloud} className="btn btn-outline" style={{ minHeight: 44, paddingInline: 16, fontSize: '0.85rem' }}>
                <Icon name="volume-2" size={15} />
                Read the summary aloud
              </button>
            </div>
            <p style={{ fontSize: '0.79rem', color: 'var(--muted)' }}>{a11y.readAloudNote}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
