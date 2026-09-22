import { useState } from 'react';
import { Icon } from './Icon.jsx';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[\d\s()+-]{7,20}$/;
export const MESSAGE_MAX = 250;

function validate({ name, email, phone, message }) {
  const errors = {};
  if (!name.trim()) errors.name = 'Name is required.';
  if (!email.trim()) errors.email = 'Email is required.';
  else if (!EMAIL_RE.test(email.trim())) errors.email = 'Enter a valid email address.';
  if (phone.trim() && !PHONE_RE.test(phone.trim())) errors.phone = 'Enter a valid phone number.';
  if (!message.trim()) errors.message = 'Message is required.';
  else if (message.trim().length > MESSAGE_MAX) errors.message = `Keep it under ${MESSAGE_MAX} characters.`;
  return errors;
}

const FIELD_STYLE = {
  width: '100%', minHeight: 48, padding: '12px 15px', borderRadius: 10,
  border: '1px solid var(--border)', background: 'var(--surface2)', color: 'var(--text)',
  fontFamily: 'var(--font-b)', fontSize: '0.92rem', transition: 'border-color 0.15s ease, background 0.15s ease',
};
const FIELD_CLASS = 'contact-form-field';

/** @param {{ id: string, label: string, error?: string, hint?: string, children: (props: object) => React.ReactNode }} props */
function Field({ id, label, error, hint, children }) {
  return (
    <div style={{ display: 'grid', gap: 9 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
        <label htmlFor={id} style={{ fontFamily: 'var(--font-h)', fontWeight: 600, fontSize: '0.8rem', letterSpacing: '0.01em', color: 'var(--muted)' }}>
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

  const setField = (field) => (e) => setValues((v) => ({ ...v, [field]: e.target.value }));

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
        body: JSON.stringify(values),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Something went wrong. Please try again.');
      setStatus('success');
      setValues({ name: '', email: '', phone: '', message: '', company: '' });
    } catch (err) {
      setStatus('error');
      setStatusMessage(err.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="feature-card" style={{ padding: 28, display: 'grid', gap: 22, maxWidth: 480 }}>
      <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}>
        <label htmlFor="contact-company">Company</label>
        <input id="contact-company" name="company" type="text" tabIndex={-1} autoComplete="off" value={values.company} onChange={setField('company')} />
      </div>

      <Field id="contact-name" label="Name" error={errors.name}>
        {(props) => <input {...props} type="text" name="name" autoComplete="name" value={values.name} onChange={setField('name')} disabled={status === 'sending'} required />}
      </Field>
      <Field id="contact-email" label="Email" error={errors.email}>
        {(props) => <input {...props} type="email" name="email" autoComplete="email" value={values.email} onChange={setField('email')} disabled={status === 'sending'} required />}
      </Field>
      <Field id="contact-phone" label="Phone" hint="Optional" error={errors.phone}>
        {(props) => <input {...props} type="tel" name="phone" autoComplete="tel" value={values.phone} onChange={setField('phone')} disabled={status === 'sending'} />}
      </Field>
      <Field id="contact-message" label="Message" hint={`${values.message.length}/${MESSAGE_MAX}`} error={errors.message}>
        {(props) => (
          <textarea
            {...props}
            name="message"
            rows={5}
            maxLength={MESSAGE_MAX}
            style={{ ...props.style, resize: 'vertical' }}
            value={values.message}
            onChange={setField('message')}
            disabled={status === 'sending'}
            required
          />
        )}
      </Field>

      <button type="submit" className="btn btn-primary" disabled={status === 'sending'} style={{ minHeight: 46, paddingInline: 20, fontSize: '0.9rem', width: 'fit-content' }}>
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
