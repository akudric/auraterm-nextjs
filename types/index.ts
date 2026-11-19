export interface BasePrice {
  /** VAT-inclusive historical price, confirmed by the business. */
  price: number;
  date: string;
}

export interface Plan {
  id: number;
  displayName: string;
  uidName: string | null;
  description: string;
  price: number | null;
  netPrice: number | null;
  basePrice: BasePrice | null;
  isFeatured: boolean;
  note: string | null;
  features: string[];
}

export interface AdditionalExpense {
  id: number;
  ImeUsluge: string;
  Jedinica: string | null;
  cijena: number | null;
  cijenaDO: number | null;
  netPrice: number | null;
  basePrice: BasePrice | null;
}

export interface Review {
  id: number;
  name: string;
  date: string;
  message: string;
  rating: number;
}
