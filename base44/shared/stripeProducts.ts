// Server-owned catalog. Buyers pick a product key, never a price.
export const STRIPE_PRODUCTS = {
  verdict: {
    priceId: 'price_1TXcljGS7DKAUUuwW5kRuF8d',
    mode: 'payment',
    amount: 900,
    currency: 'eur',
    label: 'Full Survival Kit',
  },
  subscription: {
    priceId: 'price_1TXcljGS7DKAUUuw9Q2B457k',
    mode: 'subscription',
    amount: 1900,
    currency: 'eur',
    label: 'Premium Subscription',
  },
};

export function getProduct(key) {
  return Object.prototype.hasOwnProperty.call(STRIPE_PRODUCTS, key) ? STRIPE_PRODUCTS[key] : null;
}