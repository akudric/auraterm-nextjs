'use client';

import React from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="relative z-[100] border-b border-[#e7eff3] px-4 sm:px-10 py-3 bg-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-[#0e171b]">
          <div className="w-5 h-5 pointer-events-none" aria-hidden="true">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
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

        {/* Mobile toggle */}
        <button
          className="sm:hidden"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-nav"
          onClick={() => setIsMenuOpen(v => !v)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Desktop nav (unchanged visually) */}
        <nav className="hidden sm:flex items-center gap-9 text-sm font-medium text-[#0e171b]">
          <a href="/#about-us" className="hover:text-[#19a1e5] transition-colors">O nama</a>
          <a href="/#contact" className="hover:text-[#19a1e5] transition-colors">Kontakt</a>
          <a href="/pricing" className="hover:text-[#19a1e5] transition-colors">Cijenik</a>
          <a href="/quote" className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl bg-[#19a1e5] text-white font-bold leading-tight whitespace-nowrap shadow-[0_6px_20px_rgba(25,161,229,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(25,161,229,0.45)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#19a1e5]/30 active:translate-y-0">
            Besplatna procjena
          </a>
        </nav>
      </div>

      {/* Mobile nav: positioned below bar, same styling as you had */}
      <nav
        id="mobile-nav"
        className={`sm:hidden absolute left-0 right-0 top-full border-t border-[#e7eff3] bg-white text-[#0e171b] text-sm font-medium transition-[opacity,visibility] ${
          isMenuOpen ? 'opacity-100 visible pointer-events-auto' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        <div className="px-4 py-3 flex flex-col gap-2">
          <a href="/#about-us" className="hover:text-[#19a1e5] transition-colors">O nama</a>
          <a href="/#contact" className="hover:text-[#19a1e5] transition-colors">Kontakt</a>
          <a href="/pricing" className="font-semibold text-[#19a1e5] hover:text-blue-700 transition-colors">Cijenik</a>
          <a href="/quote" className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl bg-[#19a1e5] text-white font-bold leading-tight whitespace-nowrap shadow-[0_6px_20px_rgba(25,161,229,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(25,161,229,0.45)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#19a1e5]/30 active:translate-y-0 w-full">Besplatna procjena</a>
        </div>
      </nav>
    </header>
  );
}