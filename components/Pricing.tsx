'use client';

import { useState } from 'react';
import PlanCard from './PlanCard';
import PricingPopup from './PricingPopup';
import ServicePrice from './ServicePrice';
import type { Plan } from '@/types';
import { regularPlans, multiSplitPlans, addons } from '@/lib/site-content';
import archivedPriceLists from '@/data/price-list-archive.json';

const priceListArchive = archivedPriceLists as { filename: string; publishedAt: string; revision: number }[];

function MultiSplitCard({ plan }: { plan: Plan }) {
  const attrs = plan;
  const name = attrs.displayName ?? 'Multi-split paket';
  const desc = attrs.description ?? '';

  return (
    <article className="panel flex flex-col gap-3">
      <header>
        <h3 className="text-lg font-semibold">{name}</h3>
        {desc ? <p className="text-sm text-gray-500 mt-1">{desc}</p> : null}
      </header>
      <ServicePrice price={plan.price} netPrice={plan.netPrice} basePrice={plan.basePrice} />
    </article>
  );
}

// ==========================
// COMPONENT
// ==========================
export default function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const handleSelectPlan = (plan: Plan) => setSelectedPlan(plan);
  const handleClosePopup = () => setSelectedPlan(null);

  // preferred multi-split (for the single button)
  const preferredMulti = multiSplitPlans.find((plan) => plan.isFeatured) ?? multiSplitPlans[0];

  return (
    <>
      {selectedPlan && <PricingPopup plan={selectedPlan} onClose={handleClosePopup} />}

      {/* HERO */}
      <section className="container" aria-label="Hero odjeljak: cijene ugradnje">
        <div className="hero hero-img-wrapper relative min-h-[280px] sm:min-h-[360px]">
          <picture aria-hidden="true">
            <source media="(max-width: 480px)" srcSet="/cijenik-header.png" />
            <source media="(max-width: 1024px)" srcSet="/cijenik-header.png" />
            <img
              src="/cijenik-header.png"
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
          </picture>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <h1 className="-translate-y-10 text-2xl sm:text-3xl font-bold text-white">
              Popularni paketi ugradnje
            </h1>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-[#19a1e5] text-white font-bold leading-tight whitespace-nowrap shadow-[0_6px_20px_rgba(25,161,229,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(25,161,229,0.45)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#19a1e5]/30 active:translate-y-0"
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Pogledaj pakete
            </button>
          </div>
        </div>
      </section>

      {/* MAIN */}
      <main className="container">
        {/* ----- REGULAR / MONO ----- */}
        <h2 id="pricing" className="section-title">Paketi ugradnje – mono split</h2>
        <p className="text-sm text-gray-700 mb-4">
          Sve maloprodajne cijene uključuju PDV. Bazna cijena prikazuje cijenu koja je vrijedila na navedeni datum.
        </p>
        {priceListArchive.length > 0 && (
          <div className="mb-6 text-sm">
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              <a href="/cjenik-excel.csv" download={priceListArchive[0].filename.replace(/\.csv$/, '_EXCEL.csv')} className="text-sky-700 underline font-semibold">
                Preuzmi cjenik za Excel (CSV)
              </a>
              <a href="/cjenik.csv" download={priceListArchive[0].filename} className="text-sky-700 underline">
                Strojno čitljivi cjenik (CSV)
              </a>
            </div>
            {priceListArchive.length > 1 && (
              <details className="mt-3">
                <summary>Arhiva cjenika</summary>
                <ul className="mt-2 space-y-2">
                  {priceListArchive.slice(1).map(entry => (
                    <li key={entry.filename}><a className="underline" href={`/cjenici/${entry.filename}`} download>{entry.filename}</a></li>
                  ))}
                </ul>
              </details>
            )}
          </div>
        )}

        <section id="pricing-grid-mono" className="grid" aria-live="polite">
          {regularPlans.length > 0 ? (
            regularPlans.map((plan) => (
              <PlanCard key={String(plan.id)} plan={plan} onSelectPlan={handleSelectPlan} />
            ))
          ) : (
            <div className="panel">
              <p>Nije moguće učitati mono-split pakete</p>
            </div>
          )}
        </section>

        {/* ----- MULTI SPLIT ----- */}
        <h2 className="section-title" style={{ marginTop: '32px' }}>
          Paketi ugradnje – multi split
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Ugradnja sustava s jednom vanjskom jedinicom i više unutarnjih jedinica.
        </p>

        <section id="pricing-grid-multi" className="grid" aria-live="polite">
          {multiSplitPlans.length > 0 ? (
            multiSplitPlans.map((plan) => (
              <MultiSplitCard key={`multi-${String(plan.id)}`} plan={plan} />
            ))
          ) : (
            <div className="panel">
              <p>Nije moguće učitati multi-split pakete</p>
            </div>
          )}
        </section>

        {/* Single contact button for multi-split -> opens popup instead of navigating */}
        {preferredMulti && (
          <div className="flex justify-center mt-6">
            <button
              type="button"
              onClick={() => setSelectedPlan(preferredMulti)}
              className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-xl bg-[#19a1e5] text-white font-bold leading-tight whitespace-nowrap shadow-[0_6px_20px_rgba(25,161,229,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(25,161,229,0.45)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#19a1e5]/30 active:translate-y-0"
            >
              Zatraži ponudu za multi-split
            </button>
          </div>
        )}

        {/* ----- DODATNI RADOVI ----- */}
        <h2 className="section-title" style={{ marginTop: '32px' }}>
          Dodatni radovi, materijali i servis
        </h2>

        <section className="panel addons" id="addons">
          {addons.length > 0 ? (
            addons.map((item) => (
                <div key={item.id} className="row">
                  <div>
                    <strong>{item.ImeUsluge}</strong>
                    {item.Jedinica ? <div className="meta">{item.Jedinica}</div> : null}
                  </div>

                  <ServicePrice price={item.cijena} netPrice={item.netPrice} basePrice={item.basePrice} compact />
                </div>
            ))
          ) : (
            <div className="row">
              <div>
                <strong>Dodatne usluge nisu pronađene</strong>
              </div>
            </div>
          )}
        </section>

        {/* ----- FAQ ----- */}
        <h2 className="section-title" style={{ marginTop: '32px' }}>Česta pitanja</h2>
        <section aria-labelledby="faq">
          <details>
            <summary>Što je uključeno u “standardnu” ugradnju?</summary>
            <p>
              Montaža unutarnje i vanjske jedinice, do 3 m cijevi i kabela, obloga (trunking),
              bušenje i brtvljenje, puštanje u rad te osnovno čišćenje. Spajanje na postojeću
              utičnicu je uključeno.
            </p>
          </details>
          <details>
            <summary>Uklanjate li stare uređaje?</summary>
            <p>
              Da. Sigurno pražnjenje rashladnog sredstva i zbrinjavanje nudimo kao dodatnu uslugu u
              skladu s propisima.
            </p>
          </details>
          <details>
            <summary>Koliko brzo možete doći?</summary>
            <p>
              Tipični rok je 3–7 radnih dana. Za hitne slučajeve pitajte za prvi slobodan termin.
            </p>
          </details>
        </section>

        {/* ----- CTA ----- */}
        <section className="panel" style={{ margin: '36px 0' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <h3 style={{ margin: '0 0 6px' }}>Trebate pomoć oko odabira?</h3>
              <p style={{ margin: '0', color: 'var(--muted)' }}>
                Pošaljite nam nekoliko detalja o prostoru i predložit ćemo pravi paket.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <a
                className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-[#19a1e5] text-white font-bold leading-tight whitespace-nowrap shadow-[0_6px_20px_rgba(25,161,229,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(25,161,229,0.45)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#19a1e5]/30 active:translate-y-0"
                href="quote"
              >
                Brza ponuda
              </a>
              <a
                className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-white/85 text-[#0e171b] font-bold leading-tight whitespace-nowrap backdrop-blur border border-white/70 shadow-[0_6px_20px_rgba(16,24,40,0.12)] transition-all duration-200 hover:bg-white hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(16,24,40,0.18)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/40 active:translate-y-0"
                href="/"
              >
                Povratak na početnu
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
