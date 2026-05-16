import Stripe from 'npm:stripe@15.4.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

Deno.serve(async (req) => {
  try {
    const { priceId, verdictId, isIframe } = await req.json();

    if (!priceId) {
      return Response.json({ error: 'Price ID required' }, { status: 400 });
    }

    // Block checkout from iframe
    if (isIframe) {
      return Response.json(
        { error: 'Checkout only works from published app. Please open in a new tab.' },
        { status: 400 }
      );
    }

    // Get base URL from request headers
    const origin = req.headers.get('origin') || 'http://localhost:5173';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: priceId.includes('price_1TXcljGS7DKAUUuw9Q2B457k') ? 'subscription' : 'payment',
      success_url: `${origin}/Results?payment=success${verdictId ? `&verdictId=${verdictId}` : ''}`,
      cancel_url: `${origin}/Results?payment=cancelled`,
      metadata: {
        base44_app_id: Deno.env.get('BASE44_APP_ID'),
        verdictId: verdictId || 'none',
      },
    });

    console.log(`✓ Checkout session created: ${session.id} (${priceId})`);
    return Response.json({ sessionId: session.id, sessionUrl: session.url });
  } catch (error) {
    console.error('✗ Checkout error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});