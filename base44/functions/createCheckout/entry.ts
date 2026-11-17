import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';
import { secrets } from 'base44:runtime';
import { getProduct } from '../../shared/stripeProducts.ts';

const STRIPE_API = 'https://api.stripe.com/v1';

export default async function (req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const { product = 'verdict', verdictId } = await req.json().catch(() => ({}));

    // Price, currency and mode always come from the server catalog.
    const item = getProduct(product);
    if (!item) {
      console.error(`✗ Unknown product requested: ${product}`);
      return Response.json({ error: 'Unknown product' }, { status: 400 });
    }

    const appUrl = req.headers.get('x-base44-app-url');
    if (!appUrl) {
      console.error('✗ Missing X-Base44-App-Url header — refusing to build return URLs');
      return Response.json({ error: 'Checkout is unavailable right now.' }, { status: 500 });
    }
    const origin = appUrl.replace(/\/+$/, '');
    const appId = secrets.get('BASE44_APP_ID') || '';

    const body = new URLSearchParams();
    body.set('mode', item.mode);
    body.set('line_items[0][price]', item.priceId);
    body.set('line_items[0][quantity]', '1');
    body.set('payment_method_types[]', 'card');
    body.set(
      'success_url',
      item.mode === 'subscription'
        ? `${origin}/Quiz?upgraded=1`
        : `${origin}/Results?payment=success&session_id={CHECKOUT_SESSION_ID}`
    );
    body.set('cancel_url', verdictId ? `${origin}/Results?id=${verdictId}&payment=cancelled` : `${origin}/Results?payment=cancelled`);
    body.set('metadata[base44_app_id]', appId);
    body.set('metadata[product]', product);
    body.set('metadata[verdict_id]', verdictId || 'none');
    if (item.mode === 'subscription') {
      body.set('subscription_data[metadata][base44_app_id]', appId);
      body.set('subscription_data[metadata][product]', product);
      body.set('subscription_data[metadata][verdict_id]', verdictId || 'none');
    }

    const res = await fetch(`${STRIPE_API}/checkout/sessions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secrets.get('STRIPE_SECRET_KEY')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Stripe-Version': '2025-10-29.clover',
        'Idempotency-Key': crypto.randomUUID(),
      },
      body,
      signal: AbortSignal.timeout(15000),
    });
    const session = await res.json();

    if (!res.ok) {
      console.error('✗ Stripe session creation failed:', session.error?.message);
      return Response.json({ error: session.error?.message || 'Stripe error' }, { status: 502 });
    }

    // Persist the pending order server-side before the buyer is redirected.
    await base44.asServiceRole.entities.Purchase.create({
      session_id: session.id,
      product,
      status: 'pending',
      amount: item.amount,
      currency: item.currency,
      verdict_id: verdictId || '',
      subscription_id: '',
      customer_email: '',
    });

    console.log(`✓ Checkout session created: ${session.id} (${product}, ${item.amount} ${item.currency})`);
    return Response.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error('✗ createCheckout failed:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}