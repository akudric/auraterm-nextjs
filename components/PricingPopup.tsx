'use client';

import React, { useState, useEffect } from 'react';
import { Plan } from "@/types";

interface PricingPopupProps {
  plan: Plan;
  onClose: () => void;
}

export default function PricingPopup({ plan, onClose }: PricingPopupProps) {
  const p = plan.attributes || plan;
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  useEffect(() => {
    if (!successOpen) return;
    const t = setTimeout(() => {
      setSuccessOpen(false);
      onClose(); // Close the main popup after success modal disappears
    }, 3000);
    return () => clearTimeout(t);
  }, [successOpen, onClose]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const rawMessage = (form.elements.namedItem('message') as HTMLTextAreaElement)?.value || '';

    const payload = {
      name: (form.elements.namedItem('name') as HTMLInputElement)?.value || '',
      email: (form.elements.namedItem('email') as HTMLInputElement)?.value || '',
      phone: (form.elements.namedItem('phone') as HTMLInputElement)?.value || '',
      // 👇 prepend the plan name so it’s visible in Strapi / email
      message: `Upit poslan s opcije: ${p.displayName || 'Nepoznato'}\n\n${rawMessage}`,
      company_website: (form.elements.namedItem('company_website') as HTMLInputElement)?.value || '',
      kind: 'general',
      pagePath: window.location.pathname || '/',
      clientSentAt: new Date().toISOString(),
      selected_plan: p.displayName,
    };

    // honeypot
    if (payload.company_website) {
      setStatus('Hvala!');
      form.reset();
      return;
    }

    if (!payload.name || !payload.email || !payload.message) {
      setStatus('Molimo ispunite ime, email i poruku.');
      return;
    }

    setLoading(true);
    setStatus('Slanje…');

    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: payload }),
      });

      const text = await res.text();
      let json: any = {};
      try { json = JSON.parse(text); } catch {}

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
      {/* Success modal */}
      {successOpen && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-success-title"
        >
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            {/* Circle + check, check absolutely centered */}
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
            <h3
              id="contact-success-title"
              className="text-center text-lg font-bold text-gray-900"
            >
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

      {!successOpen && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4"
          role="dialog"
          aria-modal="true"
          onClick={onClose}
        >
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-center text-lg font-bold text-gray-900">
              Zatražite ponudu za: {p.displayName}
            </h3>
            <form onSubmit={onSubmit} className="flex flex-col gap-6 mt-6">
              <input name="name" type="text" placeholder="Ime i prezime" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" required />
              <input name="email" type="email" placeholder="Email adresa" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" required />
              <input name="phone" type="tel" placeholder="Broj telefona" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" />
              <textarea name="message" placeholder="Opišite Vaš upit" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" rows={5} required></textarea>
              <input
                type="text"
                name="company_website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                style={{ position: 'absolute', left: -10000, width: 1, height: 1, overflow: 'hidden' }}
              />
              <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1" disabled={loading}>
                {loading ? 'Slanje…' : 'Pošalji upit'}
              </button>
            </form>
            <p className="py-2 text-sm text-center" aria-live="polite">{status}</p>
            <div className="mt-6 flex justify-center">
              <button
                onClick={onClose}
                className="btn !px-5 !h-10 bg-gray-200 text-gray-700 rounded-lg font-bold"
              >
                Zatvori
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
