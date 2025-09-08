import type { Metadata } from 'next';
import { strapiFetch } from '@/lib/strapi';
import HeroServices from '@/components/HeroServices';
import Section from "@/components/Section";
import AboutUs from "@/components/AboutUs";
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactInfo from '@/components/ContactInfo';


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
      <div className="px-4 sm:px-10">
        <div className="max-w-[960px] mx-auto">   {/* <- keeps it centered */}
          <section>
            <h2 className="text-[#0e171b] text-xl sm:text-[22px] font-bold tracking-[-0.015em] pb-3 pt-5">
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
      {/* Contact Info */}
      <ContactInfo/>
      {/* Footer */}
      <Footer />
    </div>
  );
}