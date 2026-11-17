import Stripe from 'npm:stripe@15.4.0';
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';
import { secrets } from 'base44:runtime';
import { getProduct } from '../../shared/stripeProducts.ts';

function rows(result: any): any[] {
  return Array.isArray(result) ? result : result?.items || [];
}

export default async function (req: Request): Promise<Response> {
  const base44 = createClientFromRequest(req);

  try {
    const stripe = new Stripe(secrets.get('STRIPE_SECRET_KEY'));
    const signature = req.headers.get('stripe-signature');
    const rawBody = await req.text();

    if (!signature) {
      console.error('✗ Webhook rejected: missing stripe-signature header');
      return Response.json({ error: 'Missing signature' }, { status: 400 });
    }

    let event: any;
    try {
      event = await stripe.webhooks.constructEventAsync(rawBody, signature, secrets.get('STRIPE_WEBHOOK_SECRET'));
    } catch (error) {
      console.error('✗ Webhook signature verification failed:', error.message);
      return Response.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const grantAccess = async (session: any) => {
      const meta = session.metadata || {};
      if (meta.base44_test_checkout === 'true') {
        console.log(`↷ Skipping Base44 self-test session ${session.id}`);
        return;
      }

      const item = getProduct(meta.product);
      if (!item) {
        console.error(`✗ Unknown product in session ${session.id}: ${meta.product}`);
        return;
      }

      const settled = session.payment_status === 'paid' || session.payment_status === 'no_payment_required';
      if (!settled) {
        console.log(`↷ Session ${session.id} is not settled yet (${session.payment_status})`);
        return;
      }

      if (session.amount_total !== item.amount || session.currency !== item.currency) {
        console.error(`✗ Amount mismatch for ${session.id}: got ${session.amount_total} ${session.currency}, expected ${item.amount} ${item.currency}`);
        return;
      }

      const data = {
        session_id: session.id,
        product: meta.product,
        status: 'paid',
        amount: session.amount_total,
        currency: session.currency,
        verdict_id: meta.verdict_id && meta.verdict_id !== 'none' ? meta.verdict_id : '',
        subscription_id: typeof session.subscription === 'string' ? session.subscription : session.subscription?.id || '',
        customer_email: session.customer_details?.email || '',
      };

      const existing = rows(await base44.asServiceRole.entities.Purchase.filter({ session_id: session.id }));
      if (existing.length > 0) {
        await base44.asServiceRole.entities.Purchase.update(existing[0].id, data);
      } else {
        await base44.asServiceRole.entities.Purchase.create(data);
      }
      console.log(`✓ Paid: ${session.id} → verdict ${data.verdict_id || 'none'}`);
    };

    if (event.type === 'checkout.session.completed') {
      await grantAccess(event.data.object);
    }

    if (event.type === 'checkout.session.async_payment_succeeded') {
      await grantAccess(event.data.object);
    }

    if (event.type === 'customer.subscription.deleted' || event.type === 'customer.subscription.updated') {
      const subscription = event.data.object;
      const status = subscription.status === 'active' || subscription.status === 'trialing' ? 'paid' : 'canceled';
      const existing = rows(await base44.asServiceRole.entities.Purchase.filter({ subscription_id: subscription.id }));
      for (const record of existing) {
        await base44.asServiceRole.entities.Purchase.update(record.id, { status });
      }
      console.log(`✓ Subscription ${subscription.id} → ${status} (${existing.length} record(s))`);
    }

    if (event.type === 'invoice.payment_failed') {
      const invoice = event.data.object;
      console.error(`✗ Payment failed: invoice ${invoice.id}, customer ${invoice.customer}`);
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error('✗ Webhook error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}