import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';

const MAX_INDUSTRIES = 12;
const NAME_MAX_LENGTH = 40;

/**
 * Anonymous industry benchmark: how many verdicts each field has, and its
 * average obsolescence risk. No personal data leaves the server.
 */
export default async function (req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);

    const [total, aggregate] = await Promise.all([
      base44.asServiceRole.entities.Verdict.count({}),
      base44.asServiceRole.entities.Verdict.aggregate({
        groupBy: 'industry',
        avg: ['obsolescence_probability'],
      }),
    ]);

    const rows: any[] = Array.isArray(aggregate?.rows) ? aggregate.rows : [];
    const merged = new Map<string, { name: string; count: number; riskSum: number }>();

    let riskSum = 0;
    let riskCount = 0;

    for (const row of rows) {
      const count = Number(row.count) || 0;
      const risk = Number(row.avg_obsolescence_probability) || 0;

      riskSum += risk * count;
      riskCount += count;

      // Free-text answers can be junk — only readable field names are charted.
      const name = String(row.industry || '').replace(/\s+/g, ' ').trim();
      if (name.length < 2 || name.length > NAME_MAX_LENGTH) continue;

      const key = name.toLowerCase();
      const entry = merged.get(key) || { name, count: 0, riskSum: 0 };
      entry.count += count;
      entry.riskSum += risk * count;
      merged.set(key, entry);
    }

    const industries = [...merged.values()]
      .map((entry) => ({
        name: entry.name,
        count: entry.count,
        avg_risk: Math.round((entry.riskSum / entry.count) * 10) / 10,
      }))
      .sort((a, b) => b.count - a.count || b.avg_risk - a.avg_risk)
      .slice(0, MAX_INDUSTRIES);

    return Response.json({
      total_verdicts: total,
      industries_tracked: merged.size,
      average_risk: riskCount ? Math.round((riskSum / riskCount) * 10) / 10 : 0,
      industries,
    });
  } catch (error) {
    console.error('✗ getIndustryStats failed:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}