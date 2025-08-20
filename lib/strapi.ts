// lib/strapi.ts
import 'server-only';

export const STRAPI_URL = process.env.STRAPI_URL!;      // e.g. http://127.0.0.1:1337
const STRAPI_TOKEN = process.env.STRAPI_TOKEN || '';    // optional if endpoint is public

export async function strapiFetch<T>(
  path: string,
  revalidate?: number,
  tags: string[] = []
): Promise<T> {
  if (!STRAPI_URL) throw new Error('STRAPI_URL not set');

  const res = await fetch(`${STRAPI_URL}${path}`.replace(/(?<!:)\/\/+/, '/'), {
    headers: {
      'Content-Type': 'application/json',
      ...(STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {}),
    },
    next: { revalidate, tags },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Strapi ${res.status}: ${path}\n${body}`);
  }

  return res.json() as Promise<T>;
}

export function mediaUrl(input?: string | null) {
  if (!input) return undefined;
  if (/^https?:\/\//i.test(input)) return input;
  return `${STRAPI_URL}${input}`;
}