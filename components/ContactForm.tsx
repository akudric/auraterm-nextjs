'use client';
import { useContactSubmission } from '@/lib/contact-submission';
import ContactSuccess from './ContactSuccess';

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

export default function ContactForm({ source }: { source?: string }) {
  const { onSubmit, status, loading, successOpen, closeSuccess } = useContactSubmission(source);

  return (
    <>
      {successOpen && <ContactSuccess onClose={closeSuccess} />}
      {/* Form */}
      <form className="max-w-[480px]" onSubmit={onSubmit}>
        {/* Include the service in the enquiry. */}
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
            disabled={loading}
            className="bg-[#19a1e5] text-slate-50 rounded-lg h-10 px-4 font-bold disabled:opacity-60"
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
