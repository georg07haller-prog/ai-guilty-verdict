import { base44 } from '@/api/base44Client';

/**
 * Starts Stripe checkout for a server-catalog product ('verdict' | 'subscription').
 * When the app runs in the builder preview iframe, the checkout tab is opened
 * synchronously from the click so popup blockers keep the user activation.
 */
export async function startCheckout(product, verdictId) {
  const isFramed = window.self !== window.top;
  const checkoutTab = isFramed ? window.open('', '_blank') : null;
  if (isFramed && !checkoutTab) {
    throw new Error('Allow popups to continue to checkout.');
  }
  if (checkoutTab) checkoutTab.opener = null;

  try {
    const response = await base44.functions.invoke('createCheckout', { product, verdictId });
    if (response.data?.error) throw new Error(response.data.error);
    const url = response.data?.url;
    if (!url) throw new Error('Could not start checkout.');

    if (checkoutTab) {
      checkoutTab.location.replace(url);
    } else {
      window.location.assign(url);
    }
  } catch (error) {
    checkoutTab?.close();
    throw error;
  }
}