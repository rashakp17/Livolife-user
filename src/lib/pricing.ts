/**
 * Turns a variant's stored prices into what the storefront shows.
 *
 * `price` is always what the shopper pays: the offer price when a real one is
 * set, otherwise the actual price. `originalPrice` is the actual price, and is
 * only present when an offer undercuts it — so its presence alone means
 * "show the strike-through and the % off".
 */
export const variantPricing = (
  v?: { price?: number; offerPrice?: number } | null
): { price: number; originalPrice?: number } => {
  const actual = v?.price || 0;
  const offer = v?.offerPrice || 0;
  return offer > 0 && offer < actual
    ? { price: offer, originalPrice: actual }
    : { price: actual };
};

/** Whole-number % the offer takes off the actual price; 0 when there's no offer. */
export const offerPercent = (price: number, originalPrice?: number): number =>
  originalPrice && originalPrice > price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;
