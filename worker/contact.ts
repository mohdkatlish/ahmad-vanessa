import { EmailMessage } from 'cloudflare:email';
import { createMimeMessage, Mailbox } from 'mimetext';

const LIMITS = { name: 400, email: 400, subject: 400, message: 2000 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Result = { ok: true } | { ok: false; error: string; status: number };

export async function handleContact(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405, headers: { Allow: 'POST' } });
  }

  const wantsJson = (request.headers.get('Accept') ?? '').includes('application/json');
  const result = await processForm(request, env);

  if (wantsJson) {
    return Response.json(result.ok ? { ok: true } : { ok: false, error: result.error }, {
      status: result.ok ? 200 : result.status,
    });
  }

  const target = result.ok ? '/kontakt/danke/' : '/kontakt/?fehler=1#formular';
  return Response.redirect(new URL(target, request.url).toString(), 303);
}

async function processForm(request: Request, env: Env): Promise<Result> {
  const origin = request.headers.get('Origin');
  const allowed = env.ALLOWED_ORIGINS.split(',').map((o) => o.trim());
  const sameOrigin = origin === new URL(request.url).origin;
  if (origin && !sameOrigin && !allowed.includes(origin)) {
    return { ok: false, error: 'Ungültige Herkunft.', status: 403 };
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return { ok: false, error: 'Ungültige Anfrage.', status: 400 };
  }

  // Honeypot: real visitors never see or fill this field. Pretend success for bots.
  if (String(form.get('website') ?? '').trim() !== '') {
    return { ok: true };
  }

  const field = (key: keyof typeof LIMITS) => String(form.get(key) ?? '').trim();
  const data = {
    name: field('name'),
    email: field('email'),
    subject: field('subject'),
    message: field('message'),
  };

  if (!data.name || !data.email || !data.subject || !data.message) {
    return { ok: false, error: 'Bitte füllen Sie alle Felder aus.', status: 422 };
  }
  if (!EMAIL_RE.test(data.email)) {
    return { ok: false, error: 'Bitte geben Sie eine gültige E-Mail-Adresse an.', status: 422 };
  }
  for (const key of Object.keys(LIMITS) as (keyof typeof LIMITS)[]) {
    if (data[key].length > LIMITS[key]) {
      return { ok: false, error: 'Eine Eingabe ist zu lang.', status: 422 };
    }
  }

  const token = String(form.get('cf-turnstile-response') ?? '');
  const human = await verifyTurnstile(token, request.headers.get('CF-Connecting-IP'), env.TURNSTILE_SECRET);
  if (!human) {
    return { ok: false, error: 'Die Spam-Prüfung ist fehlgeschlagen. Bitte versuchen Sie es erneut.', status: 403 };
  }

  try {
    await sendMail(env, data);
  } catch (err) {
    console.error('send_email failed', err);
    return { ok: false, error: 'Die Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es später erneut.', status: 502 };
  }

  return { ok: true };
}

async function verifyTurnstile(token: string, ip: string | null, secret: string): Promise<boolean> {
  if (!token || !secret) return false;
  const body = new FormData();
  body.append('secret', secret);
  body.append('response', token);
  if (ip) body.append('remoteip', ip);

  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body });
  const outcome = (await res.json()) as { success?: boolean };
  return outcome.success === true;
}

async function sendMail(env: Env, data: { name: string; email: string; subject: string; message: string }) {
  const msg = createMimeMessage();
  msg.setSender({ name: 'Kontaktformular ahmad-vanessa.com', addr: env.MAIL_FROM });
  msg.setRecipient(env.MAIL_TO);
  msg.setHeader('Reply-To', new Mailbox({ name: data.name.replace(/[\r\n"<>]/g, ''), addr: data.email }));
  msg.setSubject(`[Kontakt] ${data.subject.replace(/[\r\n]/g, ' ')}`);
  msg.addMessage({
    contentType: 'text/plain',
    data: `Name: ${data.name}\nE-Mail: ${data.email}\nBetreff: ${data.subject}\n\n${data.message}\n`,
  });

  await env.CONTACT_EMAIL.send(new EmailMessage(env.MAIL_FROM, env.MAIL_TO, msg.asRaw()));
}
