// src/app/api/contact/route.ts
import { NextResponse } from "next/server";

const STRAPI_URL = process.env.STRAPI_URL; // e.g. http://127.0.0.1:1337
const STRAPI_CONTACT_PATH = process.env.STRAPI_CONTACT_PATH || "/api/contactform";
const STRAPI_TOKEN = process.env.STRAPI_TOKEN || "";

export async function POST(req: Request) {
  try {
    const payload = await req.json().catch(() => ({}));

    // honeypot
    if (payload?.company_website) {
      return NextResponse.json({ ok: true, spam: true });
    }

    if (!STRAPI_URL) {
      return NextResponse.json(
        { ok: false, message: "Missing STRAPI_URL in .env.local" },
        { status: 500 }
      );
    }

    // Build URL robustly
    const url = new URL(STRAPI_CONTACT_PATH, STRAPI_URL).toString();

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {}),
      },
      // If your Strapi expects { data: payload }, use the wrapped version:
      // body: JSON.stringify({ data: payload }),
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const text = await res.text();
    const type = res.headers.get("content-type") || "application/json";

    if (!res.ok) {
      return new NextResponse(
        text || JSON.stringify({ ok: false, message: `Strapi error ${res.status}` }),
        { status: res.status, headers: { "content-type": type } }
      );
    }

    return new NextResponse(text, { status: 200, headers: { "content-type": type } });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: String(err?.message || err) }, { status: 500 });
  }
}