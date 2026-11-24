'use client';

import React from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const pathname = usePathname();

  return (
    <header className="relative z-[100] border-b border-[#e7eff3] px-4 sm:px-10 py-3 bg-white">
      <div className="flex items-center justify-between">
        {/* Brand */}
        <a href="/" className="flex items-center gap-3 text-[#0e171b]">
          {/* Larger, not rounded/spherical */}
          <Image
            src="/nav_pic.png"
            alt="AuraTerm"
            width={180}            // intrinsic size (any reasonable values)
            height={48}
            priority
            className="h-10 sm:h-12 w-auto object-contain"
          />
          <h2 className="text-lg font-bold">AuraTerm</h2>
        </a>

        {/* Mobile toggle */}
        <button
          type="button"
          className="md:hidden"
          aria-label={isMenuOpen ? 'Zatvori izbornik' : 'Otvori izbornik'}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-nav"
          onClick={() => setIsMenuOpen(v => !v)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Desktop nav */}
        <nav aria-label="Glavna navigacija" className="hidden md:flex items-center gap-5 lg:gap-9 text-sm font-medium text-[#0e171b]">
          <a href="/#about-us" className="hover:text-[#19a1e5] transition-colors">O nama</a>
          <a href="/#kontakt" className="hover:text-[#19a1e5] transition-colors">Kontakt</a>
          <a href="/pricing" className="hover:text-[#19a1e5] transition-colors">Cjenik</a>
          <a href="/gallery" aria-current={pathname === '/gallery' ? 'page' : undefined} className="hover:text-[#19a1e5] aria-[current=page]:text-[#19a1e5] transition-colors">Galerija</a>
          <a href="/quote" className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl bg-[#19a1e5] text-white font-bold leading-tight whitespace-nowrap shadow-[0_6px_20px_rgba(25,161,229,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(25,161,229,0.45)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#19a1e5]/30 active:translate-y-0">
            Besplatna procjena
          </a>
        </nav>
      </div>

      {/* Mobile nav */}
      <nav
        id="mobile-nav"
        aria-label="Mobilna navigacija"
        onClick={event => { if ((event.target as HTMLElement).closest('a')) setIsMenuOpen(false); }}
        className={`md:hidden absolute left-0 right-0 top-full border-t border-[#e7eff3] bg-white text-[#0e171b] text-sm font-medium transition-[opacity,visibility] ${
          isMenuOpen ? 'opacity-100 visible pointer-events-auto' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        <div className="px-4 py-3 flex flex-col gap-2">
          <a href="/#about-us" className="hover:text-[#19a1e5] transition-colors">O nama</a>
          <a href="/#kontakt" className="hover:text-[#19a1e5] transition-colors">Kontakt</a>
          <a href="/pricing" className="font-semibold text-[#19a1e5] hover:text-blue-700 transition-colors">Cjenik</a>
          <a href="/gallery" aria-current={pathname === '/gallery' ? 'page' : undefined} className="hover:text-[#19a1e5] aria-[current=page]:text-[#19a1e5] transition-colors">Galerija</a>
          <a href="/quote" className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl bg-[#19a1e5] text-white font-bold leading-tight whitespace-nowrap shadow-[0_6px_20px_rgba(25,161,229,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(25,161,229,0.45)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#19a1e5]/30 active:translate-y-0 w-full">Besplatna procjena</a>
        </div>
      </nav>
    </header>
  );
}
