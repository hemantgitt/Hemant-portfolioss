import contact from '../../data/contact.json';
import site from '../../data/site.json';
import { SectionHeader } from '../SectionHeader.jsx';
import { Icon } from '../Icon.jsx';
import { LinkedInIcon } from '../LinkedInIcon.jsx';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver.js';

export function ContactSection({ reducedMotion }) {
  const [ref, visible] = useIntersectionObserver({ reduced: reducedMotion });
  return (
    <section id="contact" ref={ref} aria-labelledby="contact-h" data-readable="Contact details" className={visible ? 'reveal-in' : 'reveal-init'} style={{ borderTop: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: 'clamp(56px,8vw,96px) 20px', display: 'grid', gap: 24 }}>
        <div style={{ display: 'grid', gap: 18, alignContent: 'start', maxWidth: '60ch' }}>
          <div>
            <SectionHeader eyebrow={contact.eyebrow} title={contact.title} id="contact-h" style={{ marginBottom: 12 }} />
            <p style={{ lineHeight: 1.6, color: 'var(--muted)' }}>{contact.body}</p>
          </div>
          <ul style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
            <li className={`feature-card${visible ? ' card-reveal-in' : ''}`} style={{ padding: '14px 16px', display: 'grid', gap: 6, ...(visible ? { animationDelay: '0ms' } : { opacity: 0 }) }}>
              <span className="icon-chip">
                <Icon name="mail" size={16} />
              </span>
              <a href={site.emailHref} style={{ fontFamily: 'var(--font-h)', fontWeight: 600, fontSize: '0.98rem', wordBreak: 'break-all', textDecoration: 'none', color: 'var(--text)' }}>
                {site.email}
              </a>
            </li>
            <li className={`feature-card${visible ? ' card-reveal-in' : ''}`} style={{ padding: '14px 16px', display: 'grid', gap: 6, ...(visible ? { animationDelay: '60ms' } : { opacity: 0 }) }}>
              <span className="icon-chip">
                <Icon name="phone" size={16} />
              </span>
              <a href={site.phoneHref} style={{ fontFamily: 'var(--font-h)', fontWeight: 600, fontSize: '0.98rem', textDecoration: 'none', color: 'var(--text)' }}>
                {site.phone}
              </a>
            </li>
            <li className={`feature-card${visible ? ' card-reveal-in' : ''}`} style={{ padding: '14px 16px', display: 'grid', gap: 6, ...(visible ? { animationDelay: '120ms' } : { opacity: 0 }) }}>
              <span className="icon-chip">
                <LinkedInIcon size={16} />
              </span>
              <a href={site.linkedinUrl} rel="noopener" style={{ fontFamily: 'var(--font-h)', fontWeight: 600, fontSize: '0.98rem', wordBreak: 'break-all', textDecoration: 'none', color: 'var(--text)' }}>
                {site.linkedinLabel}
              </a>
            </li>
            <li className={`feature-card${visible ? ' card-reveal-in' : ''}`} style={{ padding: '14px 16px', display: 'grid', gap: 6, ...(visible ? { animationDelay: '180ms' } : { opacity: 0 }) }}>
              <span className="icon-chip">
                <Icon name="map-pin" size={16} />
              </span>
              <span style={{ fontFamily: 'var(--font-h)', fontWeight: 600, fontSize: '0.98rem' }}>{site.location}</span>
            </li>
          </ul>
          <a href={site.resumeUrl} download={site.resumeDownloadName} className="btn btn-primary" style={{ minHeight: 46, paddingInline: 20, width: 'fit-content', fontSize: '0.9rem' }}>
            <Icon name="download" size={15} />
            Download Resume
          </a>
        </div>
      </div>
    </section>
  );
}
