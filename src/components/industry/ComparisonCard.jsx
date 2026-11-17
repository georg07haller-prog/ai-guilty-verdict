import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ComparisonCard({ industries, averageRisk, myVerdict }) {
  if (!myVerdict) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6">
        <p className="font-mono text-[10px] uppercase tracking-widest text-primary">Your standing</p>
        <p className="mt-2 font-display text-lg text-foreground">You have no verdict on record yet.</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Take the test and the Judge will place your risk score next to your industry's average.
        </p>
        <Link to="/Quiz">
          <Button className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90">
            <Scale className="mr-2 h-4 w-4" />
            Get Your Verdict
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </div>
    );
  }

  const match = industries.find(
    (item) => item.name.toLowerCase() === String(myVerdict.industry || '').toLowerCase()
  );
  const mine = myVerdict.percent || 0;

  return (
    <div className="rounded-2xl border border-primary/25 bg-primary/5 p-6">
      <p className="font-mono text-[10px] uppercase tracking-widest text-primary">Your standing</p>
      <p className="mt-2 font-display text-lg text-foreground">
        {myVerdict.industry || 'Your field'} · {mine}% risk
      </p>

      {match ? (
        <>
          <p className="mt-2 text-sm text-muted-foreground">
            The {match.name} average is <span className="text-foreground">{match.avg_risk}%</span> across{' '}
            {match.count} verdict{match.count === 1 ? '' : 's'}. You are{' '}
            <span className={mine > match.avg_risk ? 'text-destructive' : 'text-green-400'}>
              {Math.abs(Math.round((mine - match.avg_risk) * 10) / 10)} points{' '}
              {mine > match.avg_risk ? 'riskier' : 'safer'}
            </span>{' '}
            than your peers.
          </p>
          <p className="mt-3 font-mono text-xs text-muted-foreground">
            All industries average: {averageRisk}%
          </p>
        </>
      ) : (
        <p className="mt-2 text-sm text-muted-foreground">
          Not enough verdicts from your field yet to build a benchmark. Every industry average:{' '}
          <span className="text-foreground">{averageRisk}%</span>.
        </p>
      )}
    </div>
  );
}