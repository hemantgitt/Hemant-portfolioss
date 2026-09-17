import { useState } from 'react';
import nav from '../data/nav.json';
import site from '../data/site.json';
import { Icon } from './Icon.jsx';
import { NAV_SUPPRESS_MS } from '../constants/config.js';

/**
 * @param {{
 *   active: string, onNavigate: (id: string, suppressMs: number) => void,
 *   isDark: boolean, onToggleTheme: () => void, onOpenA11yPanel: () => void, panelOpen: boolean,
 * }} props
 */
export function Header({ active, onNavigate, isDark, onToggleTheme, onOpenA11yPanel, panelOpen }) {
  const [menuOpen, setMenuOpen] = useState(false);

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
          <button
            type="button"
            aria-pressed={isDark}
            aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            onClick={onToggleTheme}
            className="icon-btn"
          >
            <Icon name={isDark ? 'sun' : 'moon'} size={16} />
          </button>
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

      <nav className="mob-only" id="mobile-nav" aria-label="Primary mobile" hidden={!menuOpen} style={{ maxWidth: 1180, margin: '8px auto 0', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, boxShadow: 'var(--shadow-md)' }}>
        <ul style={{ padding: 8, display: 'grid', gap: 2 }}>
          {nav.map((item) => (
            <li key={item.href}>
              <a href={item.href} onClick={(e) => handleNavClick(e, item.href)} className="mobile-nav-link">
                {item.label}
              </a>
            </li>
          ))}
          <li style={{ padding: 6 }}>
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
