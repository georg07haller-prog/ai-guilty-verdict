import React, { useEffect, useState } from 'react';
import { BarChart3, Loader2, Users } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import CourtHeader from '../components/courtroom/CourtHeader';
import IndustryRiskChart from '@/components/industry/IndustryRiskChart';
import IndustryFrequencyList from '@/components/industry/IndustryFrequencyList';
import ComparisonCard from '@/components/industry/ComparisonCard';
import { getVerdictHistory } from '@/lib/verdictHistory';

export default function IndustryRisk() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [myVerdict] = useState(() => getVerdictHistory()[0] || null);

  useEffect(() => {
    let active = true;
    base44.functions.invoke('getIndustryStats', {})
      .then((response) => {
        if (!active) return;
        if (response.data?.error) throw new Error(response.data.error);
        setStats(response.data);
      })
      .catch((err) => {
        if (active) setError(err.message || 'Could not load the industry benchmarks.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const industries = stats?.industries || [];

  return (
    <div className="min-h-screen bg-background">
      <div className="hidden md:block">
        <CourtHeader />
      </div>

      <main className="mx-auto max-w-2xl px-4 py-8 pb-24 md:py-12">
        <div className="mb-8 space-y-2">
          <p className="font-mono text-xs uppercase tracking-widest text-primary">Court records</p>
          <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">Industry Risk Index</h1>
          <p className="text-sm text-muted-foreground">
            How the Judge has sentenced every field so far — and where you stand next to your peers.
          </p>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center gap-3 py-24">
            <Loader2 className="h-7 w-7 animate-spin text-primary" />
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Reading the court records…</p>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-5 text-sm text-destructive">
            {error}
          </div>
        )}

        {!loading && !error && stats && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Verdicts analysed', value: stats.total_verdicts },
                { label: 'Industries tracked', value: stats.industries_tracked },
                { label: 'Average risk', value: `${stats.average_risk}%` },
              ].map((tile) => (
                <div key={tile.label} className="rounded-2xl border border-border bg-card p-4 text-center">
                  <p className="font-display text-xl font-black text-foreground md:text-2xl">{tile.value}</p>
                  <p className="mt-1 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">{tile.label}</p>
                </div>
              ))}
            </div>

            <ComparisonCard
              industries={industries}
              averageRisk={stats.average_risk}
              myVerdict={myVerdict}
            />

            {industries.length === 0 ? (
              <div className="rounded-2xl border border-border bg-card px-6 py-16 text-center">
                <div className="text-4xl">📊</div>
                <p className="mt-4 font-display text-lg text-foreground">No benchmarks yet.</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  The chart fills up as soon as the first verdicts come in.
                </p>
              </div>
            ) : (
              <>
                <section className="rounded-2xl border border-border bg-card p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    <h2 className="font-semibold text-foreground">Average obsolescence risk by industry</h2>
                  </div>
                  <IndustryRiskChart industries={industries} />
                  <p className="mt-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    Green under 45% · amber 45–74% · red 75%+
                  </p>
                </section>

                <section className="rounded-2xl border border-border bg-card p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <Users className="h-4 w-4 text-accent" />
                    <h2 className="font-semibold text-foreground">Most accused industries</h2>
                  </div>
                  <IndustryFrequencyList industries={industries} highlight={myVerdict?.industry} />
                  <p className="mt-4 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    Verdicts filed · average risk
                  </p>
                </section>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}