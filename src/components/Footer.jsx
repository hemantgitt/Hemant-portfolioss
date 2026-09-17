import site from '../data/site.json';
import { Icon } from './Icon.jsx';
import { LinkedInIcon } from './LinkedInIcon.jsx';

export function Footer() {
  const year = new Date().getFullYear();

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

  return (
    <footer style={{ background: 'linear-gradient(180deg, transparent, var(--surface2))', borderTop: '1px solid var(--border)', marginTop: 80 }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '60px 20px', display: 'grid', gap: 48, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
        <div style={{ display: 'grid', gap: 12 }}>
          <div>
            <p style={{ margin: '0 0 8px', fontFamily: 'var(--font-h)', fontWeight: 700, fontSize: '1.15rem' }}>{site.name}</p>
            <p style={{ fontFamily: 'var(--font-h)', fontWeight: 500, fontSize: '0.88rem', color: 'var(--accent)' }}>{site.title}</p>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.6 }}>
            React.js • Next.js • TypeScript
            <br />
            Architecture • Performance • Security
          </p>
        </div>
        <div style={{ display: 'grid', gap: 14 }}>
          <p style={{ fontFamily: 'var(--font-h)', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--muted)' }}>Get in touch</p>
          <ul style={{ display: 'grid', gap: 10, fontSize: '0.88rem' }}>
            <li>
              <a href={site.emailHref} style={{ color: 'var(--text)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon name="mail" size={16} />
                Email
              </a>
            </li>
            <li>
              <a href={site.phoneHref} style={{ color: 'var(--text)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon name="phone" size={16} />
                Phone
              </a>
            </li>
            <li>
              <a href={site.linkedinUrl} rel="noopener" style={{ color: 'var(--text)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
                <LinkedInIcon size={16} />
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
        <div style={{ display: 'grid', gap: 14, alignContent: 'start' }}>
          <p style={{ fontFamily: 'var(--font-h)', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--muted)' }}>Documents</p>
          <button type="button" onClick={handlePrintResume} className="btn btn-outline" style={{ width: 'fit-content', fontSize: '0.87rem', padding: '11px 18px' }}>
            <Icon name="printer" size={15} />
            Print Resume
          </button>
          <p style={{ fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.6 }}>
            © {year} {site.name}
            <br />
            Case studies published without
            <br />
            client-confidential detail.
          </p>
        </div>
      </div>
    </footer>
  );
}
