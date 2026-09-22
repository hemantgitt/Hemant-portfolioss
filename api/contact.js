// Vercel serverless function: POST /api/contact
// Runs server-side only, so RESEND_API_KEY / MY_EMAIL never reach the
// browser bundle -- only referenced here via process.env.
import { Resend } from 'resend';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[\d\s()+-]{7,20}$/;
const MESSAGE_MAX = 250;
const MAX_LEN = { name: 120, email: 200 };

function validate(body) {
  const { name, email, phone, message } = body || {};
  if (typeof name !== 'string' || !name.trim()) return 'Name is required.';
  if (name.length > MAX_LEN.name) return 'Name is too long.';
  if (typeof email !== 'string' || !EMAIL_RE.test(email.trim())) return 'A valid email is required.';
  if (email.length > MAX_LEN.email) return 'Email is too long.';
  if (typeof phone === 'string' && phone.trim() && !PHONE_RE.test(phone.trim())) return 'Enter a valid phone number.';
  if (typeof message !== 'string' || !message.trim()) return 'Message is required.';
  if (message.trim().length > MESSAGE_MAX) return `Message must be under ${MESSAGE_MAX} characters.`;
  return null;
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

function buildEmailHtml({ name, email, phone, message }) {
  const row = (label, value) =>
    value
      ? `<tr><td style="padding:10px 0;border-top:1px solid #232330;color:#98989f;font-size:13px;width:90px;vertical-align:top;">${label}</td><td style="padding:10px 0;border-top:1px solid #232330;color:#f3f3f6;font-size:14px;">${value}</td></tr>`
      : '';
  return `<div style="background:#0a0a0d;padding:32px 16px;font-family:-apple-system,Segoe UI,Roboto,sans-serif;">
  <div style="max-width:480px;margin:0 auto;background:#131317;border:1px solid #232330;border-radius:14px;overflow:hidden;">
    <div style="background:#6e5bf0;padding:18px 24px;">
      <p style="margin:0;color:#fff;font-weight:700;font-size:15px;">New message from your portfolio</p>
    </div>
    <div style="padding:20px 24px;">
      <table role="presentation" style="width:100%;border-collapse:collapse;">
        ${row('Name', escapeHtml(name))}
        ${row('Email', `<a href="mailto:${escapeHtml(email)}" style="color:#a496ff;text-decoration:none;">${escapeHtml(email)}</a>`)}
        ${row('Phone', phone ? escapeHtml(phone) : '')}
      </table>
      <p style="margin:18px 0 6px;color:#98989f;font-size:13px;">Message</p>
      <p style="margin:0;color:#f3f3f6;font-size:14px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(message)}</p>
    </div>
  </div>
</div>`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  // Honeypot: a real visitor never fills this off-screen field, so a
  // non-empty value means the request almost certainly came from a bot.
  // Respond as if it worked so the bot doesn't learn to try a different
  // field -- this is silent, not an error the visitor's form would show.
  if (req.body?.company) return res.status(200).json({ ok: true });

  const error = validate(req.body);
  if (error) return res.status(400).json({ error });

  const name = req.body.name.trim();
  const email = req.body.email.trim();
  const phone = typeof req.body.phone === 'string' ? req.body.phone.trim() : '';
  const message = req.body.message.trim();

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error: sendError } = await resend.emails.send({
      from: 'Hemant Jha Portfolio <onboarding@resend.dev>',
      to: process.env.MY_EMAIL,
      replyTo: email,
      subject: `New message from ${name}`,
      html: buildEmailHtml({ name, email, phone, message }),
      text: `Name: ${name}\nEmail: ${email}${phone ? `\nPhone: ${phone}` : ''}\n\n${message}`,
    });
    if (sendError) throw new Error(sendError.message || 'Resend failed');
  } catch (err) {
    console.error('Resend error:', err);
    return res.status(502).json({ error: 'Could not send your message right now. Please try again or email directly.' });
  }

  return res.status(200).json({ ok: true });
}
