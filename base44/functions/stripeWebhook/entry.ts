import Stripe from 'npm:stripe@15.4.0';
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

Deno.serve(async (req) => {
  try {
    const signature = req.headers.get('stripe-signature');
    const body = await req.text();
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

    // Verify webhook signature
    let event;
    try {
      event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
    } catch (error) {
      console.error('✗ Webhook signature verification failed:', error.message);
      return Response.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Handle events
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      console.log(`✓ Payment successful: ${session.id}`);
      console.log(`  - Customer: ${session.customer_email}`);
      console.log(`  - Amount: ${session.amount_total / 100} ${session.currency.toUpperCase()}`);
      console.log(`  - Verdict ID: ${session.metadata.verdictId}`);

      // Store payment record if needed
      // await base44.entities.Payment.create({...});
    }

    if (event.type === 'customer.subscription.created') {
      const subscription = event.data.object;
      console.log(`✓ Subscription created: ${subscription.id}`);
      console.log(`  - Customer: ${subscription.customer}`);
    }

    if (event.type === 'invoice.payment_failed') {
      const invoice = event.data.object;
      console.error(`✗ Payment failed: ${invoice.id}`);
      console.error(`  - Customer: ${invoice.customer}`);
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error('✗ Webhook error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});