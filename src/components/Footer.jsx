import site from '../data/site.json';
import nav from '../data/nav.json';
import { Icon } from './Icon.jsx';
import { LinkedInIcon } from './LinkedInIcon.jsx';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver.js';

/** @param {{ reducedMotion?: boolean }} props */
export function Footer({ reducedMotion } = {}) {
  const year = new Date().getFullYear();
  const [ref, visible] = useIntersectionObserver({ reduced: reducedMotion, threshold: 0.05 });

  const handlePrintResume = () => {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = site.resumeUrl;
    document.body.appendChild(iframe);
    iframe.onload = () => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      iframe.contentWindow.addEventListener('afterprint', () => iframe.remove());
    };
    // Fallback cleanup in case afterprint never fires (some browsers block it cross-origin).
    setTimeout(() => iframe.remove(), 60000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
  };

  return (
    <footer ref={ref} className="site-footer">
      <span aria-hidden="true" className="site-footer-topline" />
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '64px 20px 28px', position: 'relative' }}>
        <div
          style={{ display: 'grid', gap: 48, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}
          className={visible ? 'reveal-in' : 'reveal-init'}
        >
          <div style={{ display: 'grid', gap: 14 }}>
            <a href="#home" className="logo-scale-hover" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', width: 'fit-content' }}>
              <img src="/logo-main.svg" alt="" width={30} height={30} style={{ display: 'block', flex: 'none' }} />
              <span style={{ fontFamily: 'var(--font-h)', fontWeight: 700, fontSize: '1.05rem', color: 'var(--text)' }}>{site.name}</span>
            </a>
            <p style={{ fontFamily: 'var(--font-h)', fontWeight: 500, fontSize: '0.88rem', color: 'var(--accent)', margin: 0 }}>{site.title}</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.6, margin: 0 }}>
              React.js • Next.js • TypeScript
              <br />
              Architecture • Performance • Security
            </p>
          </div>

          <nav aria-label="Footer" style={{ display: 'grid', gap: 14, alignContent: 'start' }}>
            <p className="site-footer-heading">Quick links</p>
            <ul style={{ display: 'grid', gap: 9, fontSize: '0.87rem' }}>
              {nav.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="site-footer-link">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div style={{ display: 'grid', gap: 14, alignContent: 'start' }}>
            <p className="site-footer-heading">Get in touch</p>
            <ul style={{ display: 'grid', gap: 10 }}>
              <li>
                <a href={site.emailHref} className="site-footer-social">
                  <span className="icon-chip" style={{ width: 30, height: 30 }}>
                    <Icon name="mail" size={14} />
                  </span>
                  Email
                </a>
              </li>
              <li>
                <a href={site.phoneHref} className="site-footer-social">
                  <span className="icon-chip" style={{ width: 30, height: 30 }}>
                    <Icon name="phone" size={14} />
                  </span>
                  Phone
                </a>
              </li>
              <li>
                <a href={site.linkedinUrl} rel="noopener" className="site-footer-social">
                  <span className="icon-chip" style={{ width: 30, height: 30 }}>
                    <LinkedInIcon size={14} />
                  </span>
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>

          <div style={{ display: 'grid', gap: 14, alignContent: 'start' }}>
            <p className="site-footer-heading">Documents</p>
            <button type="button" onClick={handlePrintResume} className="btn btn-outline" style={{ width: 'fit-content', fontSize: '0.87rem', padding: '11px 18px' }}>
              <Icon name="printer" size={15} />
              Print Resume
            </button>
            <p style={{ fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.6, margin: 0 }}>
              Case studies published without
              <br />
              client-confidential detail.
            </p>
          </div>
        </div>

        <div className="site-footer-bottom">
          <p style={{ margin: 0 }}>
            © {year} {site.name}. All rights reserved.
          </p>
          <button type="button" onClick={scrollToTop} className="site-footer-top-btn">
            Back to top
            <Icon name="arrow-up" size={13} />
          </button>
        </div>
      </div>
    </footer>
  );
}
