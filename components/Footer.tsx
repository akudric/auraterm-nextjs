import React from 'react';

export default function Footer() {
  return (
    <footer className="flex justify-center">
      <div className="flex max-w-[960px] flex-1 flex-col">
        <footer className="flex flex-col gap-6 px-5 py-10 text-center [container-type:inline-size]">
          <nav aria-label="Navigacija u podnožju" className="flex flex-wrap items-center justify-center gap-6 text-[#4e7f97]">
            <a href="/gallery" className="hover:text-[#19a1e5] transition-colors">Galerija</a>
          </nav>

          <p className="text-[#4e7f97] text-base">
            © {new Date().getFullYear()} AuraTerm. All rights reserved.
          </p>
        </footer>
      </div>
    </footer>
  );
}
