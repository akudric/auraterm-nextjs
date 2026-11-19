import { regularPlans, multiSplitPlans, addons } from './site-content';

export interface PriceListRow {
  name: string;
  price: number;
  basePrice: number;
  baseDate: string;
  specialSale: boolean;
}

export function servicePriceListRows(): PriceListRow[] {
  return [
    ...regularPlans.map(plan => ({
      name: `Ugradnja klima uređaja ${plan.displayName}`,
      price: plan.price, basePrice: plan.basePrice,
    })),
    ...multiSplitPlans.map(plan => ({
      name: `Multi-split – ${plan.displayName}`,
      price: plan.price, basePrice: plan.basePrice,
    })),
    ...addons.map(item => ({
      name: `${item.ImeUsluge}${item.Jedinica ? ` (${item.Jedinica.toLowerCase()})` : ''}`,
      price: item.cijena, basePrice: item.basePrice,
    })),
  ].map(item => {
    if (item.price === null || !item.basePrice) throw new Error(`Missing current or baseline price: ${item.name}`);
    return {
      name: item.name, price: item.price, basePrice: item.basePrice.price,
      baseDate: item.basePrice.date, specialSale: false,
    };
  });
}

export function servicePriceListCsv(rows: PriceListRow[]): string {
  const dates = new Set(rows.map(row => row.baseDate));
  if (dates.size !== 1) throw new Error('Update the CSV date labels before exporting multiple baseline dates.');
  const [year, month, day] = rows[0].baseDate.split('-');
  const cell = (value: string) => `"${value.replace(/"/g, '""')}"`;
  const amount = (value: number) => {
    if (!Number.isFinite(value) || value < 0) throw new Error('Invalid price');
    return value.toFixed(2).replace('.', ',');
  };
  const header = [
    'Naziv usluge',
    'Maloprodajna cijena usluge (EUR s PDV-om)',
    'Poseban oblik prodaje',
    `Bazna cijena usluge (EUR s PDV-om; ${day}.${month}.${year}.)`,
  ];
  const lines = rows.map(row => [row.name, amount(row.price), row.specialSale ? 'DA' : 'NE', amount(row.basePrice)]);
  // UTF-8 BOM also lets spreadsheet programs recognise Croatian characters.
  return '\uFEFF' + [header, ...lines].map(line => line.map(cell).join(';')).join('\r\n') + '\r\n';
}

export function servicePriceListExcelCsv(rows: PriceListRow[]): string {
  // Excel's direct-open importer honours this separator hint regardless of the
  // Windows list separator. Keep it out of the standard machine-readable CSV.
  return '\uFEFFsep=;\r\n' + servicePriceListCsv(rows).slice(1);
}
