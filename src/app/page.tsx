// app/page.tsx
import type { Metadata } from 'next';
import { strapiFetch } from '@/lib/strapi';
import ContactForm from '@/components/ContactForm';
import HeroServices from '@/components/HeroServices';
import Section from "@/components/Section";
import AboutUs from "@/components/AboutUs";


// ===== Revalidation =====
export const revalidate = 600; // ISR: 10 minutes

// ===== Metadata =====
export const metadata: Metadata = {
  title: 'AuraTerm',
};

// ===== Helpers for avatar =====
function initials(input?: string) {
  const name = (input || 'Anonymous').trim();
  const parts = name.split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() || '').join('') || 'A';
}
function hashHue(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) % 360;
  }
  return h;
}
function avatarStyle(seed: string) {
  const h = hashHue(seed);
  return {
    backgroundColor: `hsl(${h}, 70%, 45%)`,
    color: 'white',
  };
}
// =================================

type ReviewFlat = {
  id: number;
  name?: string;
  message?: string;
  rating?: number;
  date?: string;
  createdAt?: string;
  publishedAt?: string;
};
type ReviewAttr = { id: number; attributes: ReviewFlat };
type ReviewsResponse = { data: Array<ReviewFlat | ReviewAttr> };

function normReview(item: ReviewFlat | ReviewAttr): Required<ReviewFlat> {
  const a: ReviewFlat = ("attributes" in item ? (item as ReviewAttr).attributes : (item as ReviewFlat)) || {};
  return {
    id: (item as any).id,
    name: a.name ?? "Anonymous",
    message: a.message ?? "",
    rating: typeof a.rating === "number" ? a.rating : 4,
    date: a.date ?? a.publishedAt ?? a.createdAt ?? "",
    createdAt: a.createdAt ?? "",
    publishedAt: a.publishedAt ?? "",
  };
}

function Stars({ rating = 0 }: { rating?: number }) {
  const r = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <div className="flex gap-1 mb-2" aria-label={`Ocjena: ${r}/5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill={i < r ? '#19a1e5' : '#aec8d5'}
          viewBox="0 0 256 256"
        >
          <path d="M239.2,97.29a16,16,0,0,0-13.81-11L166,81.17,142.72,25.81a15.95,15.95,0,0,0-29.44,0L90.07,81.17,30.61,86.32a16,16,0,0,0-9.11,28.06l45.11,39.36L53.1,212.34a16,16,0,0,0,23.84,17.34l51.07-31,51.11,31a16,16,0,0,0,23.84-17.34l-13.51-58.6,45.1-39.36A16,16,0,0,0,239.2,97.29Z" />
        </svg>
      ))}
    </div>
  );
}

function Header() {
  return (
    <header className="border-b border-[#e7eff3] px-4 sm:px-10 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-[#0e171b]">
          <div className="w-5 h-5" aria-hidden>
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <a href="/">
            <h2 className="text-lg font-bold">AuraTerm</h2>
          </a>
        </div>
        <details className="sm:hidden">
          <summary className="list-none cursor-pointer" aria-label="Otvori izbornik">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </summary>
          <nav className="flex flex-col gap-2 mt-4 text-[#0e171b] text-sm font-medium">
            <a href="#">O nama</a>
            <a href="#contact">Kontakt</a>
            <a href="/cijenik" className="font-semibold text-[#19a1e5]">Cijenik</a>
            <a href="/quote" className="btn w-full !h-10 !px-4">Besplatna procjena</a>
          </nav>
        </details>
        <nav className="hidden sm:flex items-center gap-9 text-sm font-medium text-[#0e171b]">
          <a href="#">O nama</a>
          <a href="#contact">Kontakt</a>
          <a href="/cijenik">Cijenik</a>
          <a href="/quote" className="bg-[#19a1e5] text-white font-bold px-4 h-10 rounded-lg inline-flex items-center">Besplatna procjena</a>
        </nav>
      </div>
    </header>
  );
}

export default async function HomePage() {
  const REVIEWS_PATH = process.env.STRAPI_REVIEWS_PATH || "/api/our-reviews";
  const params = new URLSearchParams({
    "sort[0]": "date:desc",
    "pagination[pageSize]": "25",
  });

  let reviews: ReturnType<typeof normReview>[] = [];
  try {
    const data = await strapiFetch<ReviewsResponse>(
      `${REVIEWS_PATH}?${params.toString()}`,
      600,
      ["reviews:list"]
    );
    const items = Array.isArray(data?.data) ? data.data : [];
    reviews = items.map(normReview);

    // Debug (terminal)
    console.log("REVIEWS count:", reviews.length);
  } catch (e) {
    console.error("REVIEWS fetch error:", e);
    reviews = [];
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <Header />

      {/* Hero + Services */}
      <Section>
        <HeroServices />
      </Section>

      {/* O nama sekcija */}
      <Section>
        <AboutUs />
      </Section>

      {/* Reviews */}
      <div className="px-4 md:px-10">
        <div className="max-w-[960px] mx-auto">   {/* <- keeps it centered */}
          <section>
            <h2 className="text-[#0e171b] text-[22px] font-bold tracking-[-0.015em] pb-3 pt-5">
              Recenzije
            </h2>

            {/* remove outer bg that stretches edge-to-edge */}
            <div className="flex flex-col gap-6">
              {reviews.length === 0 ? (
                <p>Nema recenzija.</p>
              ) : (
                reviews.map((r) => {
                  const dateText = r.date ? new Date(r.date).toLocaleDateString("hr-HR") : "";
                  return (
                    <div key={r.id} className="p-4 bg-white rounded shadow">
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className="w-10 h-10 rounded-full grid place-items-center font-semibold select-none"
                          style={avatarStyle(r.name)}
                          aria-hidden="true"
                          title={r.name}
                        >
                          {initials(r.name)}
                        </div>
                        <div>
                          <p className="font-semibold">{r.name}</p>
                          <p className="text-sm text-gray-500">{dateText}</p>
                        </div>
                      </div>
                      <Stars rating={r.rating} />
                      <p className="text-gray-800">{r.message}</p>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </div>
      </div>

        {/* Contact */}
        <Section>
          <h2 className="text-[#0e171b] text-[22px] font-bold tracking-[-0.015em] pb-3">
            Kontaktirajte nas
          </h2>
          <ContactForm />
        </Section>


      {/* Footer */}
      <footer className="flex justify-center">
        <div className="flex max-w-[960px] flex-1 flex-col">
          <footer className="flex flex-col gap-6 px-5 py-10 text-center [container-type:inline-size]">
            <div className="flex flex-wrap items-center justify-center gap-6 @[480px]:flex-row @[480px]:justify-around"></div>
            <div className="flex flex-wrap justify-center gap-4">
              {['TwitterLogo','FacebookLogo','InstagramLogo'].map((k) => (
                <a key={k} href="#">
                  <div className="text-[#4e7f97]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                      <circle cx="128" cy="128" r="96" />
                    </svg>
                  </div>
                </a>
              ))}
            </div>
            <p className="text-[#4e7f97] text-base">
              © {new Date().getFullYear()} AuraTerm. All rights reserved.
            </p>
          </footer>
        </div>
      </footer>
    </div>
  );
}