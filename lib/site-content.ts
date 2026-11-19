import type { Plan, AdditionalExpense, Review } from '@/types';

// Current service prices: Cjenik usluga 2026.docx, confirmed by the owner.
// Owner confirmed these document prices applied on 2026-09-10.
// Multi-split retains the previous net rates with 25% VAT, as requested.
// All price/cijena/basePrice amounts are VAT-inclusive; netPrice excludes VAT.
// Reviews retain the published snapshot captured on 2026-11-19.
export const regularPlans: Plan[] = [
  {
    "id": 17,
    "displayName": "2,5 kW do 3,5 kW",
    "uidName": "standard",
    "description": "Odlično za manje prostore",
    "price": 300,
    "netPrice": 240,
    "basePrice": { "price": 300, "date": "2026-09-10" },
    "isFeatured": true,
    "note": "(tipično za sobe)",
    "features": [
      "Uključuje do 3 metra instalacije (bakrene cijevi,",
      "izolacija, strujni kabeli, odvod kondenzata, nosači",
      "vanjske jedinice), jedan proboj zida, spajanje i",
      "vakuumiranje."
    ]
  },
  {
    "id": 18,
    "displayName": "4,2 kW do 5,5 kW",
    "uidName": "standard-advance",
    "description": "Isti opseg rada, ali je cijena viša zbog većih\ndimenzija i težine uređaja te debljih instalacijskih\ncijevi.",
    "price": 337.50,
    "netPrice": 270,
    "basePrice": { "price": 337.50, "date": "2026-09-10" },
    "isFeatured": false,
    "note": "(tipično za veće prostore)\n\n",
    "features": [
      "Uključuje do 3 metra instalacije (bakrene cijevi,",
      "izolacija, strujni kabeli, odvod kondenzata, nosači",
      "vanjske jedinice), jedan proboj zida, spajanje i",
      "vakuumiranje."
    ]
  },
  {
    "id": 19,
    "displayName": "6,0 kW do 7,0 kW",
    "uidName": "advanced",
    "description": "Uključuje složenije rukovanje i veću potrošnju\nmaterijala.",
    "price": 375,
    "netPrice": 300,
    "basePrice": { "price": 375, "date": "2026-09-10" },
    "isFeatured": false,
    "note": "(tipično za stanove/poslovne prostore)",
    "features": [
      "Uključuje do 3 metra instalacije (bakrene cijevi,",
      "izolacija, strujni kabeli, odvod kondenzata, nosači",
      "vanjske jedinice), jedan proboj zida, spajanje i",
      "vakuumiranje."
    ]
  }
];

export const multiSplitPlans: Plan[] = [
  {
    "id": 7,
    "displayName": "Vanjska jedinica",
    "uidName": null,
    "description": "Uključuje postavljanje i spajanje vanjske  jedinice.",
    "price": 250,
    "netPrice": 200,
    "basePrice": { "price": 250, "date": "2026-09-10" },
    "isFeatured": false,
    "note": "(osnovna cijena)",
    "features": []
  },
  {
    "id": 8,
    "displayName": "Svaka unutarnja jedinica",
    "uidName": null,
    "description": "Cijena za ugradnju svake pojedine unutarnje jedinice (s uključenih npr. 3 metra instalacije po jedinici).",
    "price": 225,
    "netPrice": 180,
    "basePrice": { "price": 225, "date": "2026-09-10" },
    "isFeatured": false,
    "note": "(osnovna cijena)",
    "features": []
  }
];

export const addons: AdditionalExpense[] = [
  {
    id: 101,
    ImeUsluge: 'Dodatni dužni metar Cu instalacije – uređaji do 3,5 kW',
    Jedinica: 'Po metru',
    cijena: 35, cijenaDO: 35, netPrice: 28,
    basePrice: { price: 35, date: '2026-09-10' },
  },
  {
    id: 102,
    ImeUsluge: 'Dodatni dužni metar Cu instalacije – uređaji 4,2–5,5 kW',
    Jedinica: 'Po metru',
    cijena: 37.50, cijenaDO: 37.50, netPrice: 30,
    basePrice: { price: 37.50, date: '2026-09-10' },
  },
  {
    id: 103,
    ImeUsluge: 'Dodatni dužni metar Cu instalacije – uređaji 6–7 kW',
    Jedinica: 'Po metru',
    cijena: 42.50, cijenaDO: 42.50, netPrice: 34,
    basePrice: { price: 42.50, date: '2026-09-10' },
  },
  {
    id: 104,
    ImeUsluge: 'Proboj – naknadno',
    Jedinica: 'Po proboju',
    cijena: 18.75, cijenaDO: 18.75, netPrice: 15,
    basePrice: { price: 18.75, date: '2026-09-10' },
  },
  {
    id: 105,
    ImeUsluge: 'Polaganje predinstalacije – uređaji do 4,2 kW',
    Jedinica: 'Po metru',
    cijena: 37.50, cijenaDO: 37.50, netPrice: 30,
    basePrice: { price: 37.50, date: '2026-09-10' },
  },
  {
    id: 106,
    ImeUsluge: 'Polaganje predinstalacije – uređaji 4,2–6 kW',
    Jedinica: 'Po metru',
    cijena: 43.75, cijenaDO: 43.75, netPrice: 35,
    basePrice: { price: 43.75, date: '2026-09-10' },
  },
  {
    id: 107,
    ImeUsluge: 'Polaganje predinstalacije – uređaji 6–7 kW',
    Jedinica: 'Po metru',
    cijena: 46.25, cijenaDO: 46.25, netPrice: 37,
    basePrice: { price: 46.25, date: '2026-09-10' },
  },
  {
    id: 108,
    ImeUsluge: 'Proboj fi 62 do 500 mm dubine',
    Jedinica: 'Po proboju',
    cijena: 18.75, cijenaDO: 18.75, netPrice: 15,
    basePrice: { price: 18.75, date: '2026-09-10' },
  },
  {
    id: 109,
    ImeUsluge: 'Nadopuna radne tvari',
    Jedinica: 'Po 100 g',
    cijena: 18.75, cijenaDO: 18.75, netPrice: 15,
    basePrice: { price: 18.75, date: '2026-09-10' },
  },
  {
    id: 110,
    ImeUsluge: 'Demontaža klima uređaja 2,5–3,5 kW',
    Jedinica: 'Po uređaju',
    cijena: 62.50, cijenaDO: 62.50, netPrice: 50,
    basePrice: { price: 62.50, date: '2026-09-10' },
  },
  {
    id: 111,
    ImeUsluge: 'Demontaža klima uređaja 4,2–5,5 kW',
    Jedinica: 'Po uređaju',
    cijena: 70, cijenaDO: 70, netPrice: 56,
    basePrice: { price: 70, date: '2026-09-10' },
  },
  {
    id: 112,
    ImeUsluge: 'Demontaža klima uređaja 6–7 kW',
    Jedinica: 'Po uređaju',
    cijena: 75, cijenaDO: 75, netPrice: 60,
    basePrice: { price: 75, date: '2026-09-10' },
  },
  {
    id: 113,
    ImeUsluge: 'Servis klima uređaja',
    Jedinica: 'Po uređaju',
    cijena: 62.50, cijenaDO: 62.50, netPrice: 50,
    basePrice: { price: 62.50, date: '2026-09-10' },
  },
];

export const reviews: Review[] = [
  {
    "id": 17,
    "name": "Zdenka B.",
    "date": "2025-09-29",
    "message": " Odradila izvrstan posao,pogotovo gosp. Borisa koji je bio uvijek na usluzi,točan,držao se svih dogovora i sta je u današnje vrijeme važno,čovjek od riječi.Toplo preporucam ovu firmu za ugradnju klima!\n\nOrginalna recenzija:\nhttps://www.trebam.hr/providers/auraterm-jdoo ",
    "rating": 5
  },
  {
    "id": 19,
    "name": "Suzana S.",
    "date": "2025-08-01",
    "message": " Ekipa je odradila servis klime vrhunski – rad je uredan i kvalitetan, cijene fer, a majstor se uvijek javio na poziv i stigao točno kad je dogovoreno. Dao mi je hrpu korisnih savijeti, sve objasnio do detalja i pritom ostao ljubazan i skroz profesionalan, stvarno pouzdani i prilagodljivi\n\nOriginalna recenzija:\nhttps://www.trebam.hr/providers/auraterm-jdoo",
    "rating": 5
  },
  {
    "id": 16,
    "name": "Dubravko V.",
    "date": "2025-07-28",
    "message": "Izvođač se javi brzo nakon objave, izvođenje radova je također dogovoreno i izvršeno jako brzo , profesionalno i kvalitetno! Sve pohvale i preporuke za ovog majstora!\n\nOriginalna recenzije\nhttps://www.trebam.hr/providers/auraterm-jdoo",
    "rating": 5
  }
];
