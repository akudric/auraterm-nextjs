export interface PlanAttributes {
  displayName: string;
  uidName: string;
  description: string;
  price: number | null;
  pricesufix: string | null;
  isFeatured: boolean;
  note: string | null;
  features: any; // You might want to define a more specific type for features
}

export interface Plan {
  id: number;
  attributes: PlanAttributes;
}
