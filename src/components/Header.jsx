import { useEffect, useRef, useState } from 'react';
import nav from '../data/nav.json';
import site from '../data/site.json';
import { Icon } from './Icon.jsx';
import { useModal } from '../hooks/useModal.js';
import { NAV_SUPPRESS_MS } from '../constants/config.js';

const ACCENT_SWATCHES = [
  { key: 'purple', label: 'Purple', color: '#6e5bf0' },
  { key: 'maroon', label: 'Maroon', color: '#d1435f' },
  { key: 'teal', label: 'Teal', color: '#14b8a6' },
  { key: 'emerald', label: 'Emerald', color: '#10b981' },
];

/**
 * @param {{
 *   active: string, onNavigate: (id: string, suppressMs: number) => void,
 *   isDark: boolean, onToggleTheme: () => void,
 *   accent: 'purple'|'maroon'|'teal'|'emerald', onSetAccent: (accent: string) => void,
 *   onOpenA11yPanel: () => void, panelOpen: boolean,
 * }} props
 */
export function Header({ active, onNavigate, isDark, onToggleTheme, accent = 'purple', onSetAccent, onOpenA11yPanel, panelOpen }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const mobileNavRef = useModal(menuOpen);
  const [appearanceOpen, setAppearanceOpen] = useState(false);
  const appearanceRef = useRef(null);
  const appearanceTriggerRef = useRef(null);

  useEffect(() => {
    if (!appearanceOpen) return undefined;
    const onDocClick = (e) => {
      if (appearanceRef.current?.contains(e.target) || appearanceTriggerRef.current?.contains(e.target)) return;
      setAppearanceOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setAppearanceOpen(false);
        appearanceTriggerRef.current?.focus();
      }
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [appearanceOpen]);

  const pickAccent = (key) => {
    onSetAccent(key);
  };

  const handleNavClick = (e, href) => {
    const id = href.slice(1);
    if (menuOpen) {
      e.preventDefault();
      history.pushState(null, '', '#' + id);
      setMenuOpen(false);
      onNavigate(id, NAV_SUPPRESS_MS);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          document.getElementById(id)?.scrollIntoView({ behavior: isDark === undefined ? 'auto' : 'smooth', block: 'start' });
        });
      });
    } else {
      onNavigate(id, NAV_SUPPRESS_MS);
    }
  };

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 60, padding: '14px 20px 0' }}>
      <div
        style={{
          maxWidth: 1180, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16,
          background: 'color-mix(in srgb, var(--bg) 72%, transparent)', backdropFilter: 'blur(16px)',
          border: '1px solid var(--border)', borderRadius: 16, padding: '10px 10px 10px 18px',
        }}
      >
        <a
          href="#home"
          onClick={(e) => handleNavClick(e, '#home')}
          style={{ fontFamily: 'var(--font-h)', fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.01em', textDecoration: 'none', color: 'var(--text)', marginRight: 'auto', lineHeight: 1.3 }}
        >
          {site.logoInitials}{' '}
          <span style={{ color: 'var(--accent)', fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{site.logoTag}</span>
        </a>

        <nav className="desk-only" aria-label="Primary">
          <ul style={{ display: 'flex', flexWrap: 'wrap', gap: 22 }}>
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  aria-current={active === item.href.slice(1) ? 'true' : undefined}
                  className="nav-link"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ position: 'relative' }}>
            <button
              ref={appearanceTriggerRef}
              type="button"
              aria-haspopup="dialog"
              aria-expanded={appearanceOpen}
              aria-label="Appearance settings (theme and accent color)"
              title="Appearance"
              onClick={() => setAppearanceOpen((v) => !v)}
              className="icon-btn"
            >
              <Icon name="settings-2" size={16} />
            </button>
            {appearanceOpen && (
              <div
                ref={appearanceRef}
                role="dialog"
                aria-label="Appearance settings"
                style={{
                  position: 'absolute', top: 'calc(100% + 8px)', right: 0, zIndex: 80, width: 'min(220px, calc(100vw - 40px))',
                  background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12,
                  boxShadow: 'var(--shadow-lg)', padding: 14, display: 'grid', gap: 12,
                }}
              >
                <div>
                  <p style={{ fontSize: '0.72rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--muted)', margin: '0 0 8px' }}>Theme</p>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      type="button"
                      aria-pressed={!isDark}
                      onClick={() => isDark && onToggleTheme()}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, flex: 1, minHeight: 38, borderRadius: 8, cursor: 'pointer',
                        fontFamily: 'var(--font-h)', fontWeight: 500, fontSize: '0.82rem',
                        border: `1px solid ${!isDark ? 'var(--accent)' : 'var(--border)'}`,
                        background: !isDark ? 'var(--accent)' : 'transparent',
                        color: !isDark ? '#fff' : 'var(--text)',
                      }}
                    >
                      <Icon name="sun" size={14} />
                      Light
                    </button>
                    <button
                      type="button"
                      aria-pressed={isDark}
                      onClick={() => !isDark && onToggleTheme()}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, flex: 1, minHeight: 38, borderRadius: 8, cursor: 'pointer',
                        fontFamily: 'var(--font-h)', fontWeight: 500, fontSize: '0.82rem',
                        border: `1px solid ${isDark ? 'var(--accent)' : 'var(--border)'}`,
                        background: isDark ? 'var(--accent)' : 'transparent',
                        color: isDark ? '#fff' : 'var(--text)',
                      }}
                    >
                      <Icon name="moon" size={14} />
                      Dark
                    </button>
                  </div>
                </div>
                <div>
                  <p style={{ fontSize: '0.72rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--muted)', margin: '0 0 8px' }}>Accent color</p>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {ACCENT_SWATCHES.map((a) => {
                      const active = accent === a.key;
                      return (
                        <button
                          key={a.key}
                          type="button"
                          aria-pressed={active}
                          aria-label={a.label}
                          title={a.label}
                          onClick={() => pickAccent(a.key)}
                          style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 38, width: 38, borderRadius: 8, cursor: 'pointer',
                            border: `1px solid ${active ? a.color : 'var(--border)'}`,
                            background: 'transparent',
                            boxShadow: active ? `0 0 0 2px color-mix(in srgb, ${a.color} 35%, transparent)` : 'none',
                          }}
                        >
                          <span aria-hidden="true" style={{ width: 16, height: 16, borderRadius: '50%', background: a.color }} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
          <button
            type="button"
            aria-expanded={panelOpen}
            aria-controls="a11y-panel"
            aria-label="Accessibility preferences"
            title="Accessibility preferences"
            onClick={onOpenA11yPanel}
            className="icon-btn"
          >
            <Icon name="accessibility" size={16} />
          </button>
          <a
            className="btn btn-primary desk-flex"
            href={site.resumeUrl}
            download={site.resumeDownloadName}
            style={{ fontSize: '0.84rem', padding: '10px 16px', color: 'var(--accent-contrast)' }}
          >
            <Icon name="download" size={14} />
            Resume
          </a>
          <button
            className="mob-only icon-btn"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <Icon name={menuOpen ? 'x' : 'menu'} size={17} />
          </button>
        </div>
      </div>

      <nav
        ref={mobileNavRef}
        className="mob-only"
        id="mobile-nav"
        aria-label="Primary mobile"
        hidden={!menuOpen}
        style={{ maxWidth: 1180, margin: '8px auto 0', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, boxShadow: 'var(--shadow-md)' }}
      >
        <ul style={{ padding: 8, display: 'grid' }}>
          {nav.map((item, i) => (
            <li key={item.href} style={{ borderTop: i === 0 ? 'none' : '1px solid var(--border)' }}>
              <a href={item.href} onClick={(e) => handleNavClick(e, item.href)} className="mobile-nav-link">
                {item.label}
              </a>
            </li>
          ))}
          <li style={{ padding: 6, borderTop: '1px solid var(--border)' }}>
            <a
              href={site.resumeUrl}
              download={site.resumeDownloadName}
              onClick={() => setMenuOpen(false)}
              className="btn btn-primary"
              style={{ justifyContent: 'center', minHeight: 44, width: '100%' }}
            >
              <Icon name="download" size={14} />
              Download Resume
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
