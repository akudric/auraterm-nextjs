import 'server-only';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export const runtime = 'nodejs';
export const maxDuration = 30;

const mailbox = 'info@auraterm.hr';
const success = () => NextResponse.json({ ok: true });
const failure = (message: string, status: number) => NextResponse.json({ ok: false, message }, { status });

export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) {
    return failure('Zahtjev nije dopušten.', 403);
  }
  if (!request.headers.get('content-type')?.includes('application/json')) {
    return failure('Neispravan format zahtjeva.', 415);
  }

  let incoming: unknown;
  try {
    // Bound the actual body, including requests without a Content-Length header.
    const reader = request.body?.getReader();
    if (!reader) return failure('Zahtjev je prazan.', 400);
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 24_000) {
        await reader.cancel();
        return failure('Poruka je preduga.', 413);
      }
      chunks.push(value);
    }
    incoming = JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    return failure('Neispravan zahtjev.', 400);
  }
  if (!incoming || typeof incoming !== 'object' || Array.isArray(incoming)) {
    return failure('Neispravan zahtjev.', 400);
  }
  const data = incoming as Record<string, unknown>;
  if (typeof data.company_website === 'string' && data.company_website.trim()) return success();

  const limits = { name: 120, email: 254, phone: 60, message: 5000, system_type: 80, source: 200 };
  const fields: Record<string, string> = {};
  for (const [key, limit] of Object.entries(limits)) {
    const value = data[key];
    if (value != null && typeof value !== 'string') return failure('Neispravna polja obrasca.', 400);
    fields[key] = typeof value === 'string' ? value.trim() : '';
    if (fields[key].length > limit || (key !== 'message' && /[\r\n\x00]/.test(fields[key]))) {
      return failure('Provjerite duljinu i sadržaj polja obrasca.', 400);
    }
  }
  const { name, email, phone, message, system_type, source } = fields;
  if (!name || !message || !/^[^\s@<>,;]+@[^\s@<>,;]+\.[^\s@<>,;]+$/.test(email)) {
    return failure('Molimo unesite ime, valjanu email adresu i poruku.', 400);
  }

  const password = process.env.SMTP_PASSWORD;
  const port = Number(process.env.SMTP_PORT || '465');
  if (!password || ![465, 587].includes(port)) {
    return failure('Slanje trenutno nije dostupno. Javite nam se na info@auraterm.hr.', 503);
  }

  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'mail.auraterm.hr',
    port,
    secure: port === 465,
    requireTLS: true,
    auth: { user: process.env.SMTP_USER || mailbox, pass: password },
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 15000,
    disableFileAccess: true,
    disableUrlAccess: true,
  });

  try {
    const result = await transport.sendMail({
      from: { name: 'AuraTerm web', address: mailbox },
      to: mailbox,
      replyTo: { name, address: email },
      subject: source ? `Upit za: ${source}` : 'Upit za besplatnu procjenu',
      text: [
        `Ime: ${name}`,
        `Email: ${email}`,
        `Telefon: ${phone || 'Nije naveden'}`,
        ...(system_type ? [`Tip sustava: ${system_type}`] : []),
        ...(source ? [`Paket / usluga: ${source}`] : []),
        '',
        message,
      ].join('\n'),
    });
    if (!result.accepted?.length) throw new Error('Recipient not accepted');
    return success();
  } catch (error) {
    // Nodemailer wraps TLS errors as ESOCKET. Preserve its underlying code
    // without logging error messages, SMTP responses, credentials or form data.
    const details = error && typeof error === 'object' ? error as Record<string, unknown> : {};
    const diagnosticCode = (value: unknown) =>
      typeof value === 'string' && /^[A-Z][A-Z0-9_]{0,79}$/.test(value) ? value : undefined;
    console.error('Contact email failed:', {
      code: diagnosticCode(details.code) || 'SEND_FAILED',
      originalCode: diagnosticCode(details.originalCode),
      command: diagnosticCode(details.command),
    });
    return failure('Poruka nije poslana. Pokušajte ponovno ili pišite na info@auraterm.hr.', 502);
  } finally {
    transport.close();
  }
}
