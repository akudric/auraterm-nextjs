// components/HeroServices.tsx
export default function HeroServices() {
    return (
      <div className="container py-5">
        <div className="flex flex-col max-w-[960px] flex-1">
          <div className="[container-type:inline-size]">
            <div className="@[480px]:p-4">
              <div
                className="
                  flex min-h-[480px] flex-col gap-6
                  bg-cover bg-center bg-no-repeat
                  @[480px]:gap-8 @[480px]:rounded-lg
                  items-center justify-center p-4
                "
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 100%),
                    url(https://lh3.googleusercontent.com/aida-public/AB6AXuC3eHs6rmZhOhYqR8kXQESv2xE3pAS1iLu2QPBeBP-CjCXm0oPmFMJ2dPAiYx6RXXcg74Ip6zs0b6RtfHeP6hrey0nJx9pl9VUHyhLK7di-g_QqIJDmXAb5n-7jViX8h42LX0rpzuc9Fzj9mpNgolUbjMiBFsSor-pCHg6hciUcrJAUzHtfbd_UGX3291XkDHSvMuQlBaMDlkVLvUprmU5pYzMhSNWokd3p4gxMjCFaoXBVaBUjUJazyfo8Y5ve9M2JDHO-1szCsEo)
                  `,
                }}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4 transform -translate-y-6 sm:-translate-y-32">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-snug tracking-tight text-center max-w-3xl mx-auto mb-6 drop-shadow-lg">
                        Profesionalna ugradnja klimatizacijskih uređaja<br/>
                        u vaš dom
                    </h1>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full max-w-[520px] mx-auto">
                    {/* Primary */}
                    <a
                        href="/quote"
                        className="
                        inline-flex items-center justify-center gap-2
                        h-12 px-6 rounded-xl
                        bg-[#19a1e5] text-white font-bold leading-tight whitespace-nowrap
                        shadow-[0_6px_20px_rgba(25,161,229,0.35)]
                        transition-all duration-200
                        hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(25,161,229,0.45)]
                        focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#19a1e5]/30
                        active:translate-y-0
                        "
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                            <path d="M12 3l9 8h-3v8h-5v-5H11v5H6v-8H3l9-8z" />
                        </svg>
                        <span>Besplatna procjena</span>
                    </a>

                    {/* Secondary */}
                    <a
                        href="/cijenik"
                        className="
                        inline-flex items-center justify-center gap-2
                        h-12 px-6 rounded-xl
                        bg-white/85 text-[#0e171b] font-bold leading-tight whitespace-nowrap
                        backdrop-blur border border-white/70
                        shadow-[0_6px_20px_rgba(16,24,40,0.12)]
                        transition-all duration-200
                        hover:bg-white hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(16,24,40,0.18)]
                        focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/40
                        active:translate-y-0
                        "
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                            <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h10v2H4z" />
                        </svg>
                        <span>Cijenik</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          {/* Services */}
        <h2 className="text-[#0e171b] text-[22px] font-bold tracking-[-0.015em] px-4 pb-3 pt-5">
        Naše usluge
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 px-4">
        {/* Instalacija */}
        <div className="flex flex-col gap-3 rounded-lg border border-[#d0dfe7] bg-white p-5">
            <div className="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                <path d="M218.83,103.77l-80-75.48a16,16,0,0,0-21.53,0L37.17,103.77A16,16,0,0,0,32,115.55V208a16,16,0,0,0,16,16H96a16,16,0,0,0,16-16V160h32v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V115.55A16,16,0,0,0,218.83,103.77Z" />
            </svg>
            <h3 className="text-[#0e171b] text-base font-bold">Instalacija</h3>
            </div>
            <p className="text-sm text-gray-600">
            Profesionalna ugradnja klima uređaja u vaš dom ili ured – brzo, uredno i sigurno.
            </p>
        </div>

        {/* Održavanje */}
        <div className="flex flex-col gap-3 rounded-lg border border-[#d0dfe7] bg-white p-5">
            <div className="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                <path d="M226.76,69a8,8,0,0,0-12.84-2.88l-40.3,37.19-17.23-3.7-3.7-17.23,37.19-40.3A8,8,0,0,0,187,29.24,72,72,0,0,0,88,96a72.34,72.34,0,0,0,6,28L33.79,177a32,32,0,0,0,45.26,45.26L131.06,162A72,72,0,0,0,232,96,71.56,71.56,0,0,0,226.76,69Z" />
            </svg>
            <h3 className="text-[#0e171b] text-base font-bold">Održavanje</h3>
            </div>
            <p className="text-sm text-gray-600">
            Redovito čišćenje i servisiranje klima produžuje vijek trajanja i osigurava zdrav zrak.
            </p>
        </div>

        {/* Popravci */}
        <div className="flex flex-col gap-3 rounded-lg border border-[#d0dfe7] bg-white p-5">
            <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M128,80a48,48,0,1,0,48,48A48.06,48.06,0,0,0,128,80Z" />
                </svg>
                <h3 className="text-[#0e171b] text-base font-bold">Popravci</h3>
            </div>
            <p className="text-sm text-gray-600">
                Brza i pouzdana dijagnostika te popravci svih vrsta kvarova na klima uređajima.
            </p>
        </div>
    </div>
  </div>
</div>
);
  }