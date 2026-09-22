// Vercel serverless function: POST /api/contact
// Runs server-side only, so RESEND_API_KEY / MY_EMAIL never reach the
// browser bundle -- only referenced here via process.env.
import { Resend } from 'resend';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_LEN = { name: 120, email: 200, message: 4000 };

function validate(body) {
  const { name, email, message } = body || {};
  if (typeof name !== 'string' || !name.trim()) return 'Name is required.';
  if (name.length > MAX_LEN.name) return 'Name is too long.';
  if (typeof email !== 'string' || !EMAIL_RE.test(email.trim())) return 'A valid email is required.';
  if (email.length > MAX_LEN.email) return 'Email is too long.';
  if (typeof message !== 'string' || !message.trim()) return 'Message is required.';
  if (message.length > MAX_LEN.message) return 'Message is too long.';
  return null;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const error = validate(req.body);
  if (error) return res.status(400).json({ error });

  const name = req.body.name.trim();
  const email = req.body.email.trim();
  const message = req.body.message.trim();

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error: sendError } = await resend.emails.send({
      from: 'Portfolio Contact Form <onboarding@resend.dev>',
      to: process.env.MY_EMAIL,
      replyTo: email,
      subject: `New portfolio message from ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    });
    if (sendError) throw new Error(sendError.message || 'Resend failed');
  } catch (err) {
    console.error('Resend error:', err);
    return res.status(502).json({ error: 'Could not send your message right now. Please try again or email directly.' });
  }

  return res.status(200).json({ ok: true });
}
