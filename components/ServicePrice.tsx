import type { BasePrice } from '@/types';
import { basePriceLabel, formatPrice } from '@/lib/prices';

interface ServicePriceProps {
  price: number | null;
  netPrice: number | null;
  basePrice: BasePrice | null;
  compact?: boolean;
}

export default function ServicePrice({ price, netPrice, basePrice, compact = false }: ServicePriceProps) {
  if (price === null) return <p className="text-sm text-gray-600">Cijena na upit</p>;

  return (
    <div className="space-y-1">
      <p className={compact ? 'font-bold' : 'text-2xl font-bold'}>
        {formatPrice(price)} <span className="text-sm font-normal">s PDV-om</span>
      </p>
      {netPrice !== null && <p className="text-sm text-gray-600">{formatPrice(netPrice)} bez PDV-a</p>}
      {basePrice && <p className="text-sm text-gray-700">{basePriceLabel(basePrice)}</p>}
    </div>
  );
}
