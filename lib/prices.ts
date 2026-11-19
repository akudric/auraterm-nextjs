import type { BasePrice } from '@/types';

const euro = new Intl.NumberFormat('hr-HR', {
  style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2,
});

export function formatPrice(value: number): string {
  return euro.format(value);
}

export function basePriceLabel(basePrice: BasePrice): string {
  const [year, month, day] = basePrice.date.split('-');
  return `Bazna cijena (${day}.${month}.${year}.): ${formatPrice(basePrice.price)} s PDV-om`;
}
