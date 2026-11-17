import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';
import { secrets } from 'base44:runtime';
import { getProduct } from '../../shared/stripeProducts.ts';

const STRIPE_API = 'https://api.stripe.com/v1';

export default async function (req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const { session_id: sessionId, verdict_id: verdictIdInput } = await req.json().catch(() => ({}));

    if (!sessionId && !verdictIdInput) {
      return Response.json({ error: 'session_id or verdict_id is required' }, { status: 400 });
    }

    let verdictId = verdictIdInput || null;
    let sessionVerdictId = null;
    let unlocked = false;

    // Paid status is proven by Stripe itself, never by the browser.
    if (sessionId && typeof sessionId === 'string' && sessionId.startsWith('cs_')) {
      const res = await fetch(`${STRIPE_API}/checkout/sessions/${encodeURIComponent(sessionId)}`, {
        headers: {
          Authorization: `Bearer ${secrets.get('STRIPE_SECRET_KEY')}`,
          'Stripe-Version': '2025-10-29.clover',
        },
        signal: AbortSignal.timeout(10000),
      });
      const session = await res.json();

      if (res.ok) {
        const meta = session.metadata || {};
        const item = getProduct(meta.product);
        const settled = session.payment_status === 'paid' || session.payment_status === 'no_payment_required';
        const matches = item && session.amount_total === item.amount && session.currency === item.currency;
        sessionVerdictId = meta.verdict_id && meta.verdict_id !== 'none' ? meta.verdict_id : null;

        if (settled && matches && sessionVerdictId && (!verdictId || verdictId === sessionVerdictId)) {
          unlocked = true;
          verdictId = sessionVerdictId;
        } else if (settled && matches && !verdictId) {
          unlocked = true;
        } else if (!settled || !matches) {
          console.error(`✗ Session ${sessionId} not valid for access (${session.payment_status}, ${session.amount_total} ${session.currency})`);
        }
      } else {
        console.error('✗ Could not read Stripe session:', session.error?.message);
      }
    }

    // An unconfirmed payment still opens the verdict — just locked.
    if (!verdictId) verdictId = sessionVerdictId;

    // A signed-in buyer gets the kit they paid for back on any device.
    if (!unlocked && verdictId) {
      const buyerEmail = await base44.auth.me()
        .then((user: any) => (user?.email || '').toLowerCase() || null)
        .catch(() => null);

      if (buyerEmail) {
        try {
          const claimed: any = await base44.asServiceRole.entities.Purchase.filter(
            { verdict_id: verdictId, status: 'paid' },
            { limit: 20 }
          );
          const purchases = Array.isArray(claimed) ? claimed : claimed?.items || [];
          unlocked = purchases.some(
            (purchase: any) => (purchase.customer_email || '').toLowerCase() === buyerEmail
          );
        } catch (error) {
          console.error('✗ Buyer lookup failed:', error.message);
        }
      }
    }

    if (!verdictId) {
      return Response.json({ error: 'No verdict attached to this purchase' }, { status: 404 });
    }

    const record = await base44.asServiceRole.entities.Verdict.get(verdictId)
      .catch((e: any) => (e.status === 404 ? null : Promise.reject(e)));
    if (!record) {
      return Response.json({ error: 'Verdict not found' }, { status: 404 });
    }

    let verdict: any = null;
    try {
      verdict = JSON.parse(record.verdict_text || '{}');
    } catch (error) {
      console.error('✗ Stored verdict is not valid JSON:', error.message);
      return Response.json({ error: 'Verdict data is damaged' }, { status: 500 });
    }

    const totalOptions = Array.isArray(verdict.survival_options) ? verdict.survival_options.length : 0;
    if (!unlocked && Array.isArray(verdict.survival_options)) {
      verdict = { ...verdict, survival_options: verdict.survival_options.slice(0, 1) };
    }

    return Response.json({
      verdict_id: record.id,
      unlocked,
      total_options: totalOptions,
      verdict,
      input: {
        job_title: record.job_title || '',
        industry: record.industry || '',
        daily_tasks: record.daily_tasks || [],
        meme_answers: record.meme_answers || {},
      },
    });
  } catch (error) {
    console.error('✗ getVerdict failed:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}