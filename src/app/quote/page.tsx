'use client';

import Header from '@/components/Header';
import Section from '@/components/Section';
import Footer from '@/components/Footer';
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from 'react';

export default function QuotePage() {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const pathname = usePathname();

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

    // add contextual fields just-in-time
    formData.set('kind', 'general');
    formData.set('pagePath', pathname || '/');
    formData.set('clientSentAt', new Date().toISOString());

    const payload = Object.fromEntries(formData.entries());
    if (!payload['name'] || !payload['email'] || !payload['message']) {
      setStatus('Molimo ispunite ime, email i poruku.');
      return;
    }

    setLoading(true);
    setStatus('Slanje…');

    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
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


      <div className="bg-gray-50 min-h-screen">
        <Header />
        <Section>
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-extrabold text-center mb-6 text-gray-800">Besplatna procjena</h1>
            <p className="text-center text-gray-600 mb-12">Imate pitanje ili želite ponudu? Ispunite obrazac ispod i javit ćemo vam se u najkraćem mogućem roku.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Kontakt informacije</h2>
                <div className="flex items-center mb-4">
                  <svg className="w-6 h-6 mr-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  <p className="text-gray-700">Ulica kralja Zvonimira 1, Karlovac</p>
                </div>
                <div className="flex items-center mb-4">
                  <svg className="w-6 h-6 mr-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                  <p className="text-gray-700">+385 99319993</p>
                </div>
                <div className="flex items-center">
                  <svg className="w-6 h-6 mr-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  <p className="text-gray-700">info@auraterm.hr</p>
                </div>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Zatražite ponudu</h2>
                <form onSubmit={onSubmit} className="flex flex-col gap-6">
                  <input name="name" type="text" placeholder="Ime i prezime" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" required />
                  <input name="email" type="email" placeholder="Email adresa" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" required />
                  <input name="phone" type="tel" placeholder="Broj telefona" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" />
                  <select name="system_type" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition">
                    <option value="">Odaberite tip sustava</option>
                    <option value="hlađenje">Hlađenje</option>
                    <option value="grijanje">Grijanje</option>
                    <option value="ventilacija">Ventilacija</option>
                  </select>
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
              </div>
            </div>
          </div>
        </Section>
        <Footer />
      </div>
    </>
  );
}