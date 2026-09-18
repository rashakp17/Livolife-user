export type Discount = {
  amount: number;
  percentage: number;
};

export type SizeOption = {
  _id: string;
  size: string;
  stock: number;
};

export type ProductVariant = {
  _id: string;
  color: string;
  sizesArray: SizeOption[];
  /** What the shopper pays (the offer price when there is one). */
  price: number;
  /** Actual price before the offer; only set when an offer applies. */
  originalPrice?: number;
  stock: number;
  images: string[];
  isDefault: boolean;
};

export type Product = {
  id: number | string;
  title: string;
  category?: string;
  /** GST percentage; prices elsewhere are tax-exclusive. */
  taxRate?: number;
  description?: string;
  srcUrl: string;
  gallery?: string[];
  /** What the shopper pays (the offer price when there is one). */
  price: number;
  /** Actual price before the offer; only set when an offer applies. */
  originalPrice?: number;
  discount: Discount;
  rating: number;
  variants?: ProductVariant[];
};
