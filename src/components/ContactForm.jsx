import { useState } from 'react';
import { Icon } from './Icon.jsx';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate({ name, email, message }) {
  const errors = {};
  if (!name.trim()) errors.name = 'Name is required.';
  if (!email.trim()) errors.email = 'Email is required.';
  else if (!EMAIL_RE.test(email.trim())) errors.email = 'Enter a valid email address.';
  if (!message.trim()) errors.message = 'Message is required.';
  return errors;
}

const FIELD_STYLE = {
  width: '100%', minHeight: 46, padding: '11px 14px', borderRadius: 10,
  border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)',
  fontFamily: 'var(--font-b)', fontSize: '0.92rem',
};
const FIELD_CLASS = 'contact-form-field';

/** @param {{ id: string, label: string, error?: string, children: (props: object) => React.ReactNode }} props */
function Field({ id, label, error, children }) {
  return (
    <div style={{ display: 'grid', gap: 6 }}>
      <label htmlFor={id} style={{ fontFamily: 'var(--font-h)', fontWeight: 600, fontSize: '0.84rem', color: 'var(--text)' }}>
        {label}
      </label>
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
 * which emails the site owner. Keeps its own status state so
 * the surrounding ContactSection doesn't need to know about the request. */
export function ContactForm() {
  const [values, setValues] = useState({ name: '', email: '', message: '' });
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
      setValues({ name: '', email: '', message: '' });
    } catch (err) {
      setStatus('error');
      setStatusMessage(err.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="feature-card" style={{ padding: 24, display: 'grid', gap: 16, maxWidth: 480 }}>
      <Field id="contact-name" label="Name" error={errors.name}>
        {(props) => <input {...props} type="text" name="name" autoComplete="name" value={values.name} onChange={setField('name')} disabled={status === 'sending'} required />}
      </Field>
      <Field id="contact-email" label="Email" error={errors.email}>
        {(props) => <input {...props} type="email" name="email" autoComplete="email" value={values.email} onChange={setField('email')} disabled={status === 'sending'} required />}
      </Field>
      <Field id="contact-message" label="Message" error={errors.message}>
        {(props) => <textarea {...props} name="message" rows={5} style={{ ...props.style, resize: 'vertical' }} value={values.message} onChange={setField('message')} disabled={status === 'sending'} required />}
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
