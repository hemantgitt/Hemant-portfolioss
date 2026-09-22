import contact from '../../data/contact.json';
import site from '../../data/site.json';
import { SectionHeader } from '../SectionHeader.jsx';
import { Icon } from '../Icon.jsx';
import { LinkedInIcon } from '../LinkedInIcon.jsx';
import { ContactForm } from '../ContactForm.jsx';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver.js';

const INFO_ROWS = [
  { icon: 'mail', href: () => site.emailHref, text: () => site.email },
  { icon: 'phone', href: () => site.phoneHref, text: () => site.phone },
  { icon: 'linkedin', href: () => site.linkedinUrl, text: () => site.linkedinLabel },
  { icon: 'map-pin', href: null, text: () => site.location },
];

export function ContactSection({ reducedMotion }) {
  const [ref, visible] = useIntersectionObserver({ reduced: reducedMotion });
  return (
    <section id="contact" ref={ref} aria-labelledby="contact-h" data-readable="Contact details" className={visible ? 'reveal-in' : 'reveal-init'} style={{ borderTop: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: 'clamp(56px,8vw,96px) 20px', display: 'grid', gap: 32 }}>
        <div style={{ maxWidth: '60ch' }}>
          <SectionHeader eyebrow={contact.eyebrow} title={contact.title} id="contact-h" style={{ marginBottom: 12 }} />
          <p style={{ lineHeight: 1.6, color: 'var(--muted)' }}>{contact.body}</p>
        </div>

        <div className={`split contact-card${visible ? ' card-reveal-in' : ''}`} style={{ '--sa': '0.82fr', '--sb': '1.18fr', gap: 0, borderRadius: 24, overflow: 'hidden', border: '1px solid var(--border)', ...(visible ? {} : { opacity: 0 }) }}>
          <div className="contact-card-info">
            <span aria-hidden="true" className="contact-card-blob" />
            <div style={{ position: 'relative', zIndex: 1, display: 'grid', gap: 22, alignContent: 'start' }}>
              <div>
                <h3 style={{ margin: '0 0 8px', fontFamily: 'var(--font-h)', fontWeight: 700, fontSize: '1.3rem' }}>Contact information</h3>
                <p style={{ margin: 0, lineHeight: 1.6, opacity: 0.88, fontSize: '0.92rem' }}>{contact.body}</p>
              </div>
              <ul style={{ display: 'grid', gap: 16 }}>
                {INFO_ROWS.map((row) => (
                  <li key={row.icon} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span className="contact-card-icon">{row.icon === 'linkedin' ? <LinkedInIcon size={15} /> : <Icon name={row.icon} size={15} />}</span>
                    {row.href ? (
                      <a href={row.href()} rel={row.icon === 'linkedin' ? 'noopener' : undefined} style={{ color: 'inherit', textDecoration: 'none', fontSize: '0.92rem', fontWeight: 500, wordBreak: 'break-word' }}>
                        {row.text()}
                      </a>
                    ) : (
                      <span style={{ fontSize: '0.92rem', fontWeight: 500 }}>{row.text()}</span>
                    )}
                  </li>
                ))}
              </ul>
              <a href={site.resumeUrl} download={site.resumeDownloadName} className="contact-card-resume-btn">
                <Icon name="download" size={14} />
                Download Resume
              </a>
            </div>
          </div>
          <div className="contact-card-form">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
