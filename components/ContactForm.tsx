'use client';

import { useEffect, useState } from 'react';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end gap-2 sm:gap-4 px-0 py-2 sm:py-3">
      <label className="flex flex-col min-w-40 flex-1">
        <p className="pb-2">{label}</p>
        {children}
      </label>
    </div>
  );
}

// 👇 new: accept `source`
export default function ContactForm({ source }: { source?: string }) {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  // Auto-close the success modal after 3s
  useEffect(() => {
    if (!successOpen) return;
    const t = setTimeout(() => setSuccessOpen(false), 3000);
    return () => clearTimeout(t);
  }, [successOpen]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    // honeypot
    if (String(formData.get('company_website') || '')) {
      setStatus('Hvala!');
      form.reset();
      return;
    }

    const payload = Object.fromEntries(formData.entries());

    // still enforce these
    if (!payload['name'] || !payload['email'] || !payload['message']) {
      setStatus('Molimo ispunite ime, email i poruku.');
      return;
    }

    // Build absolute URL from public env (NO fallback)
    const base = process.env.NEXT_PUBLIC_STRAPI_URL;
    const path = process.env.NEXT_PUBLIC_STRAPI_CONTACT_PATH || '/api/contactform';
    const apiUrl = base ? new URL(path, base).toString() : process.env.NEXT_PUBLIC_CONTACTFORM_URL;

    if (!apiUrl) {
      setStatus('Greška: NEXT_PUBLIC_STRAPI_URL nije postavljen.');
      return;
    }

    setLoading(true);
    setStatus('Slanje…');

    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // If Strapi expects { data: payload }, change to: JSON.stringify({ data: payload })
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      let json: any = {};
      try {
        json = JSON.parse(text);
      } catch {}

      if (!res.ok) {
        const msg = json?.error || json?.message || `Neuspješno slanje (status ${res.status}).`;
        throw new Error(msg);
      }

      setStatus('Poslano! Javit ćemo se uskoro.');
      (e.target as HTMLFormElement).reset();
      setSuccessOpen(true);
    } catch (err: any) {
      setStatus(err?.message || 'Greška u mreži. Pokušajte ponovno.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {successOpen && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-success-title"
        >
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <div className="relative mx-auto mb-4 h-12 w-12">
              <div className="absolute inset-0 rounded-full bg-emerald-100" />
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 text-emerald-600 m-0 p-0"
              >
                <path
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20 6L9 17l-5-5"
                />
              </svg>
            </div>
            <h3 id="contact-success-title" className="text-center text-lg font-bold text-gray-900">
              Poruka je poslana
            </h3>
            <p className="mt-1 text-center text-sm text-gray-600">
              Hvala! Javit ćemo se uskoro.
            </p>
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setSuccessOpen(false)}
                className="btn !px-5 !h-10 bg-[#19a1e5] text-white rounded-lg font-bold"
              >
                Zatvori
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <form className="max-w-[480px]" onSubmit={onSubmit}>
        {/* 👇 this is what makes Strapi know where it came from */}
        {source ? <input type="hidden" name="source" value={source} /> : null}

        <Field label="Ime">
          <input
            name="name"
            placeholder="Vaše ime"
            className="form-input w-full rounded-lg border bg-slate-50 h-12 sm:h-14 p-3 sm:p-[15px]"
            required
          />
        </Field>
        <Field label="Email">
          <input
            name="email"
            type="email"
            placeholder="Vaš Email"
            className="form-input w-full rounded-lg border bg-slate-50 h-12 sm:h-14 p-3 sm:p-[15px]"
            required
          />
        </Field>
        <Field label="Broj mobitela">
          <input
            name="phone"
            placeholder="Vaš broj mobitela"
            className="form-input w-full rounded-lg border bg-slate-50 h-12 sm:h-14 p-3 sm:p-[15px]"
          />
        </Field>
        <Field label="Poruka">
          <textarea
            name="message"
            // 👇 auto-hint the operator what it’s about
            defaultValue={source ? `Upit za: ${source}\n` : ''}
            placeholder="Vaša poruka"
            className="form-input w-full rounded-lg border bg-slate-50 min-h-32 sm:min-h-36 p-3 sm:p-[15px]"
            required
          />
        </Field>

        {/* Honeypot */}
        <input
          type="text"
          name="company_website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          style={{ position: 'absolute', left: -10000, width: 1, height: 1, overflow: 'hidden' }}
        />

        <div className="flex py-3">
          <button
            type="submit"
            className="bg-[#19a1e5] text-slate-50 rounded-lg h-10 px-4 font-bold disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Slanje…' : 'Pošalji'}
          </button>
        </div>
        <p className="py-2 text-sm" aria-live="polite">
          {status}
        </p>
      </form>
    </>
  );
}