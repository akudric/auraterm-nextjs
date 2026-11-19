'use client';

import { useContactSubmission } from '@/lib/contact-submission';
import ContactSuccess from './ContactSuccess';
import { Plan } from "@/types";

interface PricingPopupProps {
  plan: Plan;
  onClose: () => void;
}

export default function PricingPopup({ plan, onClose }: PricingPopupProps) {
  const p = plan;
  const { onSubmit, status, loading, successOpen, closeSuccess } = useContactSubmission(p.displayName, onClose);

  if (successOpen) return <ContactSuccess onClose={closeSuccess} />;

  return (
    <>

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
              <button type="submit" disabled={loading} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1 disabled:opacity-60">
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
    </>
  );
}
