// components/HeroServices.tsx
export default function HeroServices() {
  return (
    <div className="w-full">
      {/* HERO */}
      <section
        className="
          relative overflow-hidden
          w-full
          h-[420px] sm:h-[520px] md:h-[580px]
          flex items-start justify-center
          text-white
        "
        style={{
          backgroundImage: "url('/main-header.png')", // your AC image
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* top-to-bottom gradient so text is readable but AC stays visible */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.15),rgba(0,0,0,0.55))] pointer-events-none" />

        {/* content is centered horizontally, pushed down below the AC */}
        <div className="relative z-10 w-full max-w-[720px] mx-auto px-4">
          <div className="flex flex-col items-center text-center pt-28 sm:pt-32 md:pt-36">
            <h1
              className="
                mb-4 sm:mb-6
                max-w-[38rem] text-balance
                font-extrabold leading-tight tracking-tight
                text-2xl sm:text-4xl md:text-5xl
              "
            >
              Profesionalna ugradnja klimatizacijskih uređaja
              <br className="hidden sm:block" />
              <span className="sm:ml-2">u vaš dom</span>
            </h1>

            <p className="mb-5 text-sm sm:text-base text-white/85 max-w-md">
              Stručna montaža, održavanje i popravci klima uređaja za vaš dom
              ili ured – pouzdano, uredno i na vrijeme.
            </p>

            <div className="grid w-full max-w-[520px] grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {/* Primary */}
              <a
                href="/quote"
                className="
                  inline-flex items-center justify-center gap-2
                  h-12 px-6 rounded-xl
                  bg-[#19a1e5] text-white font-bold leading-tight whitespace-nowrap
                  shadow-[0_6px_20px_rgba(25,161,229,0.35)]
                  transition-transform duration-200
                  hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(25,161,229,0.45)]
                  focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#19a1e5]/30
                  active:translate-y-0
                "
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden
                >
                  <path d="M12 3l9 8h-3v8h-5v-5H11v5H6v-8H3l9-8z" />
                </svg>
                <span>Besplatna procjena</span>
              </a>

              {/* Secondary */}
              <a
                href="/pricing"
                className="
                  inline-flex items-center justify-center gap-2
                  h-12 px-6 rounded-xl
                  bg-white/85 text-[#0e171b] font-bold leading-tight whitespace-nowrap
                  backdrop-blur border border-white/70
                  shadow-[0_6px_20px_rgba(16,24,40,0.12)]
                  transition-transform duration-200
                  hover:bg-white hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(16,24,40,0.18)]
                  focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/40
                  active:translate-y-0
                "
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden
                >
                  <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h10v2H4z" />
                </svg>
                <span>Cjenik</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES (unchanged) */}
      <div className="container py-5">
        <h2 className="text-[#0e171b] text-[22px] font-bold tracking-[-0.015em] px-4 pb-3 pt-5">
          Naše usluge
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 px-4">
          {/* Instalacija */}
          <div className="flex flex-col gap-3 rounded-lg border border-[#d0dfe7] bg-white p-5">
            <div className="flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 256 256"
              >
                <path d="M218.83,103.77l-80-75.48a16,16,0,0,0-21.53,0L37.17,103.77A16,16,0,0,0,32,115.55V208a16,16,0,0,0,16,16H96a16,16,0,0,0,16-16V160h32v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V115.55A16,16,0,0,0,218.83,103.77Z" />
              </svg>
              <h3 className="text-[#0e171b] text-base font-bold">Instalacija</h3>
            </div>
            <p className="text-sm text-gray-600">
              Profesionalna ugradnja klima uređaja u vaš dom ili ured – brzo,
              uredno i sigurno.
            </p>
          </div>

          {/* Održavanje */}
          <div className="flex flex-col gap-3 rounded-lg border border-[#d0dfe7] bg-white p-5">
            <div className="flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 256 256"
              >
                <path d="M226.76,69a8,8,0,0,0-12.84-2.88l-40.3,37.19-17.23-3.7-3.7-17.23,37.19-40.3A8,8,0,0,0,187,29.24,72,72,0,0,0,88,96a72.34,72.34,0,0,0,6,28L33.79,177a32,32,0,0,0,45.26,45.26L131.06,162A72,72,0,0,0,232,96,71.56,71.56,0,0,0,226.76,69Z" />
              </svg>
              <h3 className="text-[#0e171b] text-base font-bold">Održavanje</h3>
            </div>
            <p className="text-sm text-gray-600">
              Redovito čišćenje i servisiranje klima produžuje vijek trajanja i
              osigurava zdrav zrak.
            </p>
          </div>

          {/* Popravci */}
          <div className="flex flex-col gap-3 rounded-lg border border-[#d0dfe7] bg-white p-5">
            <div className="flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 256 256"
              >
                <path d="M228.92,104.55l-19.66-3.28a80.53,80.53,0,0,0-6.72-16.19l11.72-16.43a8,8,0,0,0-1.12-10.48l-23.09-23.1a8,8,0,0,0-10.48-1.12L163.14,45.67a80.53,80.53,0,0,0-16.19-6.72L143.67,19.29A8,8,0,0,0,135.73,12H120.27a8,8,0,0,0-7.94,7.29l-3.28,19.66a80.53,80.53,0,0,0-16.19,6.72L76.43,34.95a8,8,0,0,0-10.48,1.12l-23.1,23.1a8,8,0,0,0-1.12,10.48l11.72,16.43a80.53,80.53,0,0,0-6.72,16.19L27.08,104.55A8,8,0,0,0,20,112.49v15.46a8,8,0,0,0,7.08,7.94l19.66,3.28a80.53,80.53,0,0,0,6.72,16.19L41.74,172.79a8,8,0,0,0,1.12,10.48l23.1,23.1a8,8,0,0,0,10.48,1.12l16.43-11.72a80.53,80.53,0,0,0,16.19,6.72l3.28,19.66a8,8,0,0,0,7.94,7.08h15.46a8,8,0,0,0,7.94-7.08l3.28-19.66a80.53,80.53,0,0,0,16.19-6.72l16.43,11.72a8,8,0,0,0,10.48-1.12l23.09-23.1a8,8,0,0,0,1.12-10.48l-11.72-16.43a80.53,80.53,0,0,0,6.72-16.19l19.66-3.28a8,8,0,0,0,7.08-7.94V112.49A8,8,0,0,0,228.92,104.55ZM128,160a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z" />
              </svg>
              <h3 className="text-[#0e171b] text-base font-bold">Popravci</h3>
            </div>
            <p className="text-sm text-gray-600">
              Pouzdani popravci i zamjena dijelova osiguravaju dugotrajan i
              učinkovit rad vašeg klima uređaja.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
