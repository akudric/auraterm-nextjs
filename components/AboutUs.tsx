import { Wrench, ThermometerSun, ShieldCheck } from "lucide-react";

export default function AboutUs() {
  return (
    <section id="about-us" className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl p-6 sm:p-10 my-12 sm:my-16">
      <h2 className="text-3xl font-bold text-center mb-10 text-gray-900">
        O nama
      </h2>

      <ul className="space-y-8 text-gray-700 leading-relaxed">
        <li className="flex items-start gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#19a1e5]/10">
            <Wrench className="w-6 h-6 text-[#19a1e5]" />
          </div>
          <p className="text-base sm:text-lg">
            <strong>AuraTerm</strong> je tvrtka posvećena stvaranju ugodnog i
            zdravog životnog prostora kroz stručnu <strong>ugradnju</strong>,
            <strong> održavanje</strong> i <strong>popravak</strong>{" "}
            klimatizacijskih uređaja. Naš tim kombinira iskustvo, znanje i
            modernu tehnologiju kako bi vaša klima radila bez greške tijekom
            cijele godine.
          </p>
        </li>

        <li className="flex items-start gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#19a1e5]/10">
            <ThermometerSun className="w-6 h-6 text-[#19a1e5]" />
          </div>
          <p className="text-base sm:text-lg">
            Vjerujemo da <strong>kvalitetna klima</strong> nije luksuz, već
            nužnost za zdravlje i dobrobit svake obitelji i poslovnog prostora.
            Zato nudimo <strong>personalizirana rješenja</strong> prilagođena
            vašem prostoru, potrebama i budžetu – jer svatko zaslužuje
            savršenu klimu.
          </p>
        </li>

        <li className="flex items-start gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#19a1e5]/10">
            <ShieldCheck className="w-6 h-6 text-[#19a1e5]" />
          </div>
          <p className="text-base sm:text-lg">
            Naš cilj je <strong>dugoročno povjerenje</strong>. Kroz transparentan
            rad, brzu reakciju i vrhunsku kvalitetu usluge osiguravamo da vaša
            klima uvijek radi besprijekorno. S nama ste sigurni da ulažete u
            trajnu vrijednost i pouzdanog partnera.
          </p>
        </li>
      </ul>
    </section>
  );
}