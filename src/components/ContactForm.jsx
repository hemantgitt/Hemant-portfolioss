import { useRef, useState } from 'react';
import { Icon } from './Icon.jsx';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[\d\s()+-]{7,20}$/;
export const MESSAGE_MAX = 700;

// Kept in sync with api/contact.js's own copy (that one is the source of
// truth server-side) -- duplicated here only so the browser can reject an
// obviously-bad file before spending time base64-encoding and uploading it.
const MAX_FILE_BYTES = 3 * 1024 * 1024; // 3MB, comfortably under Vercel's ~4.5MB request-body cap once base64-inflated
const ACCEPTED_TYPES = {
  'application/pdf': 'PDF',
  'application/msword': 'DOC',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
  'image/png': 'PNG',
  'image/svg+xml': 'SVG',
  'image/webp': 'WEBP',
  'image/jpeg': 'JPG',
};
const ACCEPT_ATTR = '.pdf,.doc,.docx,.png,.svg,.webp,.jpg,.jpeg';

function validate({ name, email, phone, message }) {
  const errors = {};
  if (!name.trim()) errors.name = 'Name is required.';
  if (!email.trim()) errors.email = 'Email is required.';
  else if (!EMAIL_RE.test(email.trim())) errors.email = 'Enter a valid email address.';
  if (!phone.trim()) errors.phone = 'Phone number is required.';
  else if (!PHONE_RE.test(phone.trim())) errors.phone = 'Enter a valid phone number.';
  if (!message.trim()) errors.message = 'Message is required.';
  else if (message.trim().length > MESSAGE_MAX) errors.message = `Keep it under ${MESSAGE_MAX} characters.`;
  return errors;
}

function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1] || '');
    reader.onerror = () => reject(new Error('Could not read the file.'));
    reader.readAsDataURL(file);
  });
}

// Underline style: no box, just a bottom rule -- reads lighter than a boxed
// input and lets the field sit directly on the panel's own background
// (this form is always rendered inside ContactSection's own card panel,
// never bare on the page background).
const FIELD_STYLE = {
  width: '100%', padding: '8px 2px 10px', borderRadius: 0,
  border: 'none', borderBottom: '1.5px solid var(--border-strong)', background: 'transparent', color: 'var(--text)',
  fontFamily: 'var(--font-b)', fontSize: '0.95rem', transition: 'border-color 0.15s ease',
};
const FIELD_CLASS = 'contact-form-field';

/** @param {{ id: string, label: string, error?: string, hint?: string, children: (props: object) => React.ReactNode }} props */
function Field({ id, label, error, hint, children }) {
  return (
    <div style={{ display: 'grid', gap: 7 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
        <label htmlFor={id} style={{ fontFamily: 'var(--font-h)', fontWeight: 600, fontSize: '0.78rem', letterSpacing: '0.01em', color: 'var(--muted)' }}>
          {label}
        </label>
        {hint && <span style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>{hint}</span>}
      </div>
      {children({
        id,
        className: FIELD_CLASS,
        style: FIELD_STYLE,
        'aria-invalid': error ? 'true' : undefined,
        'aria-describedby': error ? `${id}-error` : undefined,
      })}
      {error && (
        <p id={`${id}-error`} role="alert" style={{ margin: 0, fontSize: '0.8rem', color: 'var(--danger, #e5484d)' }}>
          {error}
        </p>
      )}
    </div>
  );
}

/** Contact form that POSTs to /api/contact (a Vercel serverless function),
 * which emails the site owner. Keeps its own status state so the
 * surrounding ContactSection doesn't need to know about the request.
 * Unstyled as a card itself -- it's meant to sit inside ContactSection's
 * own panel, which supplies the background/border/padding.
 *
 * Includes a honeypot field ("company") -- visually hidden from sighted
 * users via off-screen positioning (not display:none/aria-hidden, which
 * some bots skip filling on purpose) and skipped from the tab order and
 * screen readers. A human never fills it; a bot's autofill usually does,
 * and the server silently drops anything that comes back with it set. */
export function ContactForm() {
  const [values, setValues] = useState({ name: '', email: '', phone: '', message: '', company: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [statusMessage, setStatusMessage] = useState('');
  const [attachment, setAttachment] = useState(null); // { filename, contentType, data }
  const [attachmentError, setAttachmentError] = useState('');
  const fileInputRef = useRef(null);

  const setField = (field) => (e) => setValues((v) => ({ ...v, [field]: e.target.value }));

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-selecting the same file after removing it
    if (!file) return;
    setAttachmentError('');

    if (!ACCEPTED_TYPES[file.type]) {
      setAttachmentError('Unsupported file type. Use PDF, DOC/DOCX, PNG, SVG, WEBP or JPG.');
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setAttachmentError('File is too large. Max 3MB.');
      return;
    }
    try {
      const data = await readFileAsBase64(file);
      setAttachment({ filename: file.name, contentType: file.type, data });
    } catch {
      setAttachmentError('Could not read the file. Try a different one.');
    }
  };

  const removeAttachment = () => {
    setAttachment(null);
    setAttachmentError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fieldErrors = validate(values);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;

    setStatus('sending');
    setStatusMessage('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, attachment }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Something went wrong. Please try again.');
      setStatus('success');
      setValues({ name: '', email: '', phone: '', message: '', company: '' });
      setAttachment(null);
    } catch (err) {
      setStatus('error');
      setStatusMessage(err.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: 'grid', gap: 24 }}>
      <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}>
        <label htmlFor="contact-company">Company</label>
        <input id="contact-company" name="company" type="text" tabIndex={-1} autoComplete="off" value={values.company} onChange={setField('company')} />
      </div>

      <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
        <Field id="contact-name" label="Your Name" error={errors.name}>
          {(props) => <input {...props} type="text" name="name" autoComplete="name" value={values.name} onChange={setField('name')} disabled={status === 'sending'} required />}
        </Field>
        <Field id="contact-email" label="Your Email" error={errors.email}>
          {(props) => <input {...props} type="email" name="email" autoComplete="email" value={values.email} onChange={setField('email')} disabled={status === 'sending'} required />}
        </Field>
      </div>
      <Field id="contact-phone" label="Your Phone" error={errors.phone}>
        {(props) => <input {...props} type="tel" name="phone" autoComplete="tel" value={values.phone} onChange={setField('phone')} disabled={status === 'sending'} required />}
      </Field>
      <Field id="contact-message" label="Message" hint={`${values.message.length}/${MESSAGE_MAX}`} error={errors.message}>
        {(props) => (
          <textarea
            {...props}
            name="message"
            rows={4}
            maxLength={MESSAGE_MAX}
            placeholder="Write your message here"
            style={{ ...props.style, resize: 'vertical' }}
            value={values.message}
            onChange={setField('message')}
            disabled={status === 'sending'}
            required
          />
        )}
      </Field>

      <div style={{ display: 'grid', gap: 7 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
          <span style={{ fontFamily: 'var(--font-h)', fontWeight: 600, fontSize: '0.78rem', letterSpacing: '0.01em', color: 'var(--muted)' }}>Attachment</span>
          <span style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>Optional · max 3MB</span>
        </div>
        <input ref={fileInputRef} id="contact-attachment" type="file" accept={ACCEPT_ATTR} onChange={handleFileChange} disabled={status === 'sending'} style={{ display: 'none' }} />
        {attachment ? (
          <div className="contact-attachment-chip">
            <Icon name="file-code" size={14} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{attachment.filename}</span>
            <button type="button" onClick={removeAttachment} disabled={status === 'sending'} aria-label="Remove attachment" className="contact-attachment-remove">
              <Icon name="x" size={13} />
            </button>
          </div>
        ) : (
          <button type="button" onClick={() => fileInputRef.current?.click()} disabled={status === 'sending'} className="contact-attachment-btn">
            <Icon name="download" size={14} style={{ transform: 'rotate(180deg)' }} />
            Attach a file
          </button>
        )}
        {attachmentError && (
          <p role="alert" style={{ margin: 0, fontSize: '0.8rem', color: 'var(--danger, #e5484d)' }}>
            {attachmentError}
          </p>
        )}
      </div>

      <div>
        <button type="submit" className="btn btn-primary" disabled={status === 'sending'} style={{ minHeight: 48, paddingInline: 24, fontSize: '0.9rem', width: 'fit-content' }}>
          {status === 'sending' ? (
            <>
              <Icon name="refresh-cw" size={15} className="spin" />
              Sending…
            </>
          ) : (
            <>
              <Icon name="mail" size={15} />
              Send message
            </>
          )}
        </button>
      </div>

      <div aria-live="polite">
        {status === 'success' && (
          <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--success, #22c55e)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon name="check" size={15} />
            Thanks — your message is on its way. I&apos;ll reply soon.
          </p>
        )}
        {status === 'error' && (
          <p role="alert" style={{ margin: 0, fontSize: '0.88rem', color: 'var(--danger, #e5484d)' }}>
            {statusMessage}
          </p>
        )}
      </div>
    </form>
  );
}
