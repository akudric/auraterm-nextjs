'use client';

import { useEffect, useState } from 'react';
import PlanCard from './PlanCard';
import PricingPopup from './PricingPopup';
import type { Plan } from '@/types'; // your existing Plan interface

// ==========================
// STRAPI ENDPOINTS – CHANGE THESE IF YOUR API NAMES ARE DIFFERENT
// ==========================
const REGULAR_ENDPOINT = '/api/pricing-options';            // mono / regular
const MULTISPLIT_ENDPOINT = '/api/pricing-option-multi-splits';   // multi-split (change to your real endpoint)
const ADDONS_ENDPOINT = '/api/additional-options';         // dodatni radovi (change to your real endpoint)

// ==========================
// TYPES
// ==========================
type AdditionalExpense = {
  id: number | string;
  ImeUsluge: string;
  Jedinica?: string | null;
  cijena: number | null;
  cijenaDO: number | null;
};

// ==========================
// HELPERS
// ==========================

function normalizeAddon(item: any): AdditionalExpense {
  const attrs = item?.attributes ?? item ?? {};

  const ImeUsluge =
    attrs.ImeUsluge ??
    attrs.imeUsluge ??
    attrs.imeusluge ??
    attrs.ime_usluge ??
    '';

  const Jedinica =
    attrs.Jedinica ??
    attrs.jedinica ??
    attrs.JedinicaUsluge ??
    attrs.jedinica_usluge ??
    null;

  const cijenaRaw =
    attrs.cijena ??
    attrs.Cijena ??
    attrs.cijena_od ??
    attrs.cijenaOd ??
    null;

  const cijenaDORaw =
    attrs.cijenaDO ??
    attrs.cijenado ??
    attrs.cijena_do ??
    attrs.cijenaDo ??
    null;

  const cijena =
    cijenaRaw === null || cijenaRaw === undefined || cijenaRaw === ''
      ? null
      : Number(cijenaRaw);

  const cijenaDO =
    cijenaDORaw === null || cijenaDORaw === undefined || cijenaDORaw === ''
      ? null
      : Number(cijenaDORaw);

  return {
    id: item.id ?? attrs.id,
    ImeUsluge,
    Jedinica,
    cijena,
    cijenaDO,
  };
}

async function fetchPlans(endpoint: string): Promise<Plan[]> {
  const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
  if (!STRAPI_API_URL) {
    console.warn('NEXT_PUBLIC_STRAPI_URL is not defined. Returning []');
    return [];
  }

  const params = new URLSearchParams({
    'sort[0]': 'sort:asc',
    'pagination[pageSize]': '24',
    'fields[0]': 'displayName',
    'fields[1]': 'uidName',
    'fields[2]': 'description',
    'fields[3]': 'price',
    'fields[4]': 'pricesufix',
    'fields[5]': 'isFeatured',
    'fields[6]': 'note',
    'fields[7]': 'features',
  });

  const url = `${STRAPI_API_URL}${endpoint}?${params.toString()}`;

  try {
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error(`HTTP ${res.status} ${url}\n${await res.text()}`);
      return [];
    }

    const json = await res.json();
    return (json?.data ?? []) as Plan[];
  } catch (err) {
    console.error('Failed to fetch pricing plans from', endpoint, err);
    return [];
  }
}

async function fetchAdditionalExpenses(): Promise<AdditionalExpense[]> {
  const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
  if (!STRAPI_API_URL) return [];

  const url = `${STRAPI_API_URL}${ADDONS_ENDPOINT}?pagination[pageSize]=50&sort[0]=id:asc`;

  try {
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
    if (!res.ok) {
      console.error(`HTTP ${res.status} ${url}\n${await res.text()}`);
      return [];
    }
    const json = await res.json();
    return (json?.data ?? []).map((item: any) => normalizeAddon(item));
  } catch (err) {
    console.error('Failed to fetch additional expenses', err);
    return [];
  }
}

// pick a multi-split plan to show in popup (prefer featured → otherwise first)
function pickPreferredMultiSplit(plans: Plan[]): Plan | null {
  if (!plans || plans.length === 0) return null;

  // if it's Strapi-shaped: plans[i].attributes.isFeatured
  const featured = plans.find((p: any) => p?.attributes?.isFeatured || (p as any).isFeatured);
  if (featured) return featured;

  return plans[0];
}

// ==========================
// SIMPLE CARD FOR MULTI-SPLIT (NO BUTTON)
// ==========================
function MultiSplitCard({ plan }: { plan: Plan }) {
  const attrs = (plan as any).attributes ?? plan;
  const name = attrs.displayName ?? 'Multi-split paket';
  const desc = attrs.description ?? '';
  const price = attrs.price ?? null;
  const priceSufix = attrs.pricesufix ?? '';

  return (
    <article className="panel flex flex-col gap-3">
      <header>
        <h3 className="text-lg font-semibold">{name}</h3>
        {desc ? <p className="text-sm text-gray-500 mt-1">{desc}</p> : null}
      </header>
      <div>
        {price !== null && price !== undefined ? (
          <p className="text-2xl font-bold">
            {price} €
            {priceSufix ? <span className="text-sm text-gray-500 ml-1">{priceSufix}</span> : null}
          </p>
        ) : (
          <p className="text-gray-400 text-sm">Cijena na upit</p>
        )}
      </div>
    </article>
  );
}

// ==========================
// COMPONENT
// ==========================
export default function Pricing() {
  const [regularPlans, setRegularPlans] = useState<Plan[]>([]);
  const [multiSplitPlans, setMultiSplitPlans] = useState<Plan[]>([]);
  const [addons, setAddons] = useState<AdditionalExpense[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  useEffect(() => {
    let alive = true;

    Promise.all([
      fetchPlans(REGULAR_ENDPOINT),
      fetchPlans(MULTISPLIT_ENDPOINT),
      fetchAdditionalExpenses(),
    ]).then(([regular, multi, extras]) => {
      if (!alive) return;
      setRegularPlans(regular);
      setMultiSplitPlans(multi);
      setAddons(extras);
    });

    return () => {
      alive = false;
    };
  }, []);

  const handleSelectPlan = (plan: Plan) => setSelectedPlan(plan);
  const handleClosePopup = () => setSelectedPlan(null);

  // preferred multi-split (for the single button)
  const preferredMulti = pickPreferredMultiSplit(multiSplitPlans);

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
          Dodatni radovi i materijal
        </h2>

        <section className="panel addons" id="addons">
          {addons.length > 0 ? (
            addons.map((item) => {
              const hasFrom = item.cijena != null;
              const hasTo = item.cijenaDO != null;

              return (
                <div key={item.id} className="row">
                  <div>
                    <strong>{item.ImeUsluge}</strong>
                    {item.Jedinica ? <div className="meta">{item.Jedinica}</div> : null}
                  </div>
                  <div>
                    <strong>
                      {hasFrom || hasTo ? (
                        <>
                          {hasFrom ? `${item.cijena} €` : null}
                          {hasFrom && hasTo ? ' – ' : null}
                          {hasTo ? `${item.cijenaDO} €` : null}
                        </>
                      ) : (
                        'Na upit'
                      )}
                    </strong>
                  </div>
                </div>
              );
            })
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
              Montaža unutarnje i vanjske jedinice, do 5 m cijevi i kabela, obloga (trunking),
              bušenje i brtvljenje, puštanje u rad te osnovno čišćenje. Spajanje na postojeću
              utičnicu je uključeno; novi osigurač je dodatna usluga.
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