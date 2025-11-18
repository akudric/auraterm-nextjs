'use client';

import React from 'react';

export default function ContactInfo() {
  return (
    <section aria-label="Kontakt informacije" className="px-4 sm:px-10 py-8">
      <div className="max-w-[960px] mx-auto">
        <h2 className="text-[#0e171b] text-xl sm:text-[22px] font-bold tracking-[-0.015em] pb-3">
          Kontakt
        </h2>

        {/* THE BOX */}
        <div className="contact-info-box bg-white rounded-2xl border border-[#e7eff3] p-5 shadow-[0_6px_20px_rgba(16,24,40,0.06)]">
          <ul className="divide-y divide-[#e7eff3] rounded-xl overflow-hidden">
            {/* Adresa */}
            <li>
              <a
                href="https://www.google.com/maps/place/Ul.+kralja+Zvonimira+1,+47000,+Karlovac"
                target="_blank"
                rel="noopener"
                className="row-link"
              >
                <span className="icon-chip">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 21s-6-4.35-6-10a6 6 0 0 1 12 0c0 5.65-6 10-6 10z" />
                    <circle cx="12" cy="11" r="2" strokeWidth="1.8" />
                  </svg>
                </span>
                <div className="text-col">
                  <p className="label">Adresa</p>
                  <p className="value">Ulica kralja Zvnonimira 1, Karlovac</p>
                </div>
              </a>
            </li>

            {/* Telefon */}
            <li>
              <a href="tel+38599319993" className="row-link">
                <span className="icon-chip">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                    <path strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M22 16.92v2a2 2 0 0 1-2.18 2 19.84 19.84 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.84 19.84 0 0 1 2.09 4.18 2 2 0 0 1 4.06 2h2a2 2 0 0 1 2 1.72c.12.86.32 1.7.58 2.5a2 2 0 0 1-.45 2.11L7.1 9.91a16 16 0 0 0 6 6l1.58-1.09a2 2 0 0 1 2.11-.45c.8.26 1.64.46 2.5.58A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </span>
                <div className="text-col">
                  <p className="label">Telefon</p>
                  <p className="value">+385 99319993</p>
                </div>
              </a>
            </li>

            {/* E-mail */}
            <li>
              <a href="mailto:info@auraterm.hr" className="row-link">
                <span className="icon-chip">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                    <path strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M4 4h16a2 2 0 0 1 2 2v.2l-10 6L2 6.2V6a2 2 0 0 1 2-2z"/>
                    <path strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M22 8l-10 6L2 8"/>
                    <path strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M2 8v8a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8"/>
                  </svg>
                </span>
                <div className="text-col">
                  <p className="label">E-mail</p>
                  <p className="value">info@auraterm.hr</p>
                </div>
              </a>
            </li>
          </ul>

          {/* CTAs */}
          <div className="mt-6 flex flex-wrap gap-2">
            <a
              href="/quote"
              className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-[#19a1e5] text-white font-semibold leading-tight whitespace-nowrap shadow-[0_6px_20px_rgba(25,161,229,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(25,161,229,0.45)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#19a1e5]/30 active:translate-y-0"
            >
              Brza ponuda
            </a>

          </div>
        </div>
      </div>

      {/* 🔒 Hard reset INSIDE THE BOX so SVGs cannot escape/overlap */}
      <style jsx global>{`
        .contact-info-box .row-link {
          display: flex;
          align-items: center;
          gap: 1rem;           /* 16px */
          min-height: 64px;
          padding: 0 0.5rem;   /* 8px */
          border-radius: 0.5rem;
          transition: background-color .25s ease, box-shadow .25s ease, transform .2s ease;
        }
        .contact-info-box .row-link:hover,
        .contact-info-box .row-link:focus-visible {
          background: #f8fbff;
          box-shadow: 0 8px 24px rgba(25,161,229,.08);
          transform: translateX(2px);
          outline: none;
        }

        .contact-info-box .icon-chip {
          flex: none;
          width: 40px;
          height: 40px;
          display: grid;
          place-items: center;
          border-radius: 0.75rem;
          background: #f5fbff;
          color: #19a1e5;                /* svg uses currentColor */
          border: 1px solid #e7eff3;
          overflow: hidden;
          transition: transform .25s ease, background-color .25s ease, border-color .25s ease, color .25s ease;
        }
        .contact-info-box .row-link:hover .icon-chip,
        .contact-info-box .row-link:focus-visible .icon-chip {
          background: #eaf6ff;
          border-color: #19a1e5;
          color: #167fbf;
          transform: scale(1.06);
        }

        /* Hard sizing so icons never overlap */
        .contact-info-box .icon-chip > svg {
          position: static !important;
          display: block !important;
          width: 20px !important;
          height: 20px !important;
          max-width: none !important;
          max-height: none !important;
          transform-origin: 50% 50%;
          transition: transform .25s ease;
        }
        /* small icon motion on hover */
        .contact-info-box .row-link:hover .icon-chip > svg,
        .contact-info-box .row-link:focus-visible .icon-chip > svg {
          transform: translateY(-1px) rotate(-3deg);
        }

        .contact-info-box .text-col { min-width: 0; line-height: 1.2; }
        .contact-info-box .label {
          font-size: 0.75rem;     /* text-xs */
          letter-spacing: 0.06em; /* uppercase tracking */
          text-transform: uppercase;
          color: #6b7f8a;
          margin: 0;
          transition: color .25s ease;
        }
        .contact-info-box .row-link:hover .label,
        .contact-info-box .row-link:focus-visible .label {
          color: #4b5b63;
        }
        .contact-info-box .value {
          color: #0e171b;
          font-weight: 500;
          margin: 0;
          /* underline reveal on hover */
          background-image: linear-gradient(#19a1e5, #19a1e5);
          background-repeat: no-repeat;
          background-position: 0 100%;
          background-size: 0 2px;
          transition: background-size .35s ease;
        }
        .contact-info-box .row-link:hover .value,
        .contact-info-box .row-link:focus-visible .value {
          background-size: 100% 2px;
        }
      `}</style>
    </section>
  );
}