// src/app/api/quote/route.ts
import { NextResponse } from "next/server";

const STRAPI_URL = process.env.STRAPI_URL!;
const STRAPI_CONTACT_PATH = process.env.STRAPI_CONTACT_PATH || "/api/contactform/submit"; // ensure /submit
const STRAPI_TOKEN = process.env.STRAPI_TOKEN || "";

export async function POST(req: Request) {
  console.log("Request received at /api/quote");
  try {
    const incoming = await req.json().catch(() => ({} as any));

    // Normalize shape for Strapi: wrap only if needed
    const hasData = incoming && typeof incoming === "object" && "data" in incoming;
    const data = hasData ? incoming.data : incoming;           // <— your actual form fields
    const bodyForStrapi = hasData ? incoming : { data };       // <— what we will forward

    console.log("Payload:", bodyForStrapi);

    // honeypot (check the normalized fields)
    if (data?.company_website) {
      console.log("Honeypot triggered");
      return NextResponse.json({ ok: true, spam: true });
    }

    if (!STRAPI_URL) {
      console.error("Missing STRAPI_URL in .env.local");
      return NextResponse.json(
        { ok: false, message: "Missing STRAPI_URL in .env.local" },
        { status: 500 }
      );
    }

    const url = new URL(STRAPI_CONTACT_PATH, STRAPI_URL).toString();
    console.log("Forwarding request to:", url);

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {}),
      },
      body: JSON.stringify(bodyForStrapi),  // <— no double-wrap
      cache: "no-store",
    });

    const text = await res.text();
    const type = res.headers.get("content-type") || "application/json";
    console.log("Response from Strapi:", res.status, text);

    if (!res.ok) {
      return new NextResponse(
        text || JSON.stringify({ ok: false, message: `Strapi error ${res.status}` }),
        { status: res.status, headers: { "content-type": type } }
      );
    }

    return new NextResponse(text, { status: 200, headers: { "content-type": type } });
  } catch (err: any) {
    console.error("Error in /api/quote:", err);
    return NextResponse.json({ ok: false, message: String(err?.message || err) }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json({ ok: true }, { status: 200 });
}