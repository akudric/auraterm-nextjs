'use client';

import { useEffect, useState } from 'react';
import PlanCard from './PlanCard';
import PricingPopup from './PricingPopup';
import type { Plan } from '@/types'; // <-- your Plan interface

async function getPricingPlans(): Promise<Plan[]> {
  const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
  const STRAPI_PRICES_API_CALL = '/api/pricing-options';

  if (!STRAPI_API_URL) {
    console.warn('NEXT_PUBLIC_STRAPI_URL is not defined. Returning []');
    return [];
  }

  const params = new URLSearchParams({
    'sort[0]': 'sort:asc',
    'pagination[pageSize]': '12',
    'fields[0]': 'displayName',
    'fields[1]': 'uidName',
    'fields[2]': 'description',
    'fields[3]': 'price',
    'fields[4]': 'pricesufix',
    'fields[5]': 'isFeatured',
    'fields[6]': 'note',
    'fields[7]': 'features',
  });

  const url = `${STRAPI_API_URL}${STRAPI_PRICES_API_CALL}?${params.toString()}`;

  try {
    const res = await fetch(url, { headers: { 'Content-Type': 'application/json' }, cache: 'no-store' });
    if (!res.ok) {
      console.error(`HTTP ${res.status} ${url}\n${await res.text()}`);
      return [];
    }
    const data = await res.json();
    // If your Plan type matches Strapi items directly:
    return (data?.data ?? []) as Plan[];

    // If your Plan is a flattened UI type, map here instead.
  } catch (error: unknown) {
    console.error('Failed to fetch pricing plans:', error instanceof Error ? error.message : error);
    return [];
  }
}

export default function Pricing() {
  // ✅ TYPE YOUR STATE
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  useEffect(() => {
    let alive = true;
    getPricingPlans().then((list) => {
      if (alive) setPlans(list);
    });
    return () => {
      alive = false;
    };
  }, []);

  const handleSelectPlan = (plan: Plan) => setSelectedPlan(plan);
  const handleClosePopup = () => setSelectedPlan(null);

  return (
    <>
      {selectedPlan && <PricingPopup plan={selectedPlan} onClose={handleClosePopup} />}

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

      <main className="container">
        <h2 id="pricing" className="section-title">Paketi ugradnje</h2>

        <section id="pricing-grid" className="grid" aria-live="polite">
          {plans.length > 0 ? (
            plans.map((plan) => (
              <PlanCard key={String(plan.id)} plan={plan} onSelectPlan={handleSelectPlan} />
            ))
          ) : (
            <div className="panel">
              <p>Error loading packages</p>
            </div>
          )}
        </section>

        <h2 className="section-title" style={{ marginTop: '32px' }}>Dodatne usluge</h2>
        <section className="panel addons" id="addons">
          <div className="row">
            <div>
              <strong>Kondenzat pumpa</strong>
              <div className="meta">Kada gravitacijski odvod nije moguć (uključena ugradnja)</div>
            </div>
            <div><strong>€79</strong></div>
          </div>
          <div className="row">
            <div>
              <strong>Dodatni metar instalacije</strong>
              <div className="meta">Cijevi + kabel, cijena po metru</div>
            </div>
            <div><strong>€18/m</strong></div>
          </div>
          <div className="row">
            <div>
              <strong>Nosač vanjske jedinice</strong>
              <div className="meta">Pocinčani, s antivibracijskim podloškama</div>
            </div>
            <div><strong>€59</strong></div>
          </div>
        </section>

        <h2 className="section-title" style={{ marginTop: '32px' }}>Česta pitanja</h2>
        <section aria-labelledby="faq">
          <details>
            <summary>Što je uključeno u “standardnu” ugradnju?</summary>
            <p>Montaža unutarnje i vanjske jedinice, do 5 m cijevi i kabela, obloga (trunking), bušenje i brtvljenje, puštanje u rad te osnovno čišćenje. Spajanje na postojeću utičnicu je uključeno; novi osigurač je dodatna usluga.</p>
          </details>
          <details>
            <summary>Uklanjate li stare uređaje?</summary>
            <p>Da. Sigurno pražnjenje rashladnog sredstva i zbrinjavanje nudimo kao dodatnu uslugu u skladu s propisima.</p>
          </details>
          <details>
            <summary>Koliko brzo možete doći?</summary>
            <p>Tipični rok je 3–7 radnih dana. Za hitne slučajeve pitajte za prvi slobodan termin.</p>
          </details>
        </section>

        <section className="panel" style={{ margin: '36px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
            <div>
              <h3 style={{ margin: '0 0 6px' }}>Trebate pomoć oko odabira?</h3>
              <p style={{ margin: '0', color: 'var(--muted)' }}>Pošaljite nam nekoliko detalja o prostoru i predložit ćemo pravi paket.</p>
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <a className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-[#19a1e5] text-white font-bold leading-tight whitespace-nowrap shadow-[0_6px_20px_rgba(25,161,229,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(25,161,229,0.45)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#19a1e5]/30 active:translate-y-0" href="quote.html">Brza ponuda</a>
              <a className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-white/85 text-[#0e171b] font-bold leading-tight whitespace-nowrap backdrop-blur border border-white/70 shadow-[0_6px_20px_rgba(16,24,40,0.12)] transition-all duration-200 hover:bg-white hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(16,24,40,0.18)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/40 active:translate-y-0" href="/">Povratak na početnu</a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
