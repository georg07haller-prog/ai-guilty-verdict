import React from 'react';
import { ArrowRight, CheckCircle, Loader2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SurvivalCard from './SurvivalCard';
import LockedSurvivalCard from './LockedSurvivalCard';

export default function SurvivalKitSection({
  options = [],
  lockedCount = 0,
  unlocked = false,
  onUnlock,
  unlocking = false,
}) {
  if (!options || options.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-foreground font-mono">
          🛡️ Appeal Options — Survival Kit
        </h3>
        <span className="rounded-full border border-border bg-secondary/40 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {unlocked ? 'Full access' : '1 of 4 free'}
        </span>
      </div>

      <div className="space-y-3">
        {options.map((option, i) => (
          <SurvivalCard key={i} option={option} index={i} />
        ))}
        {!unlocked &&
          Array.from({ length: lockedCount }).map((_, i) => (
            <LockedSurvivalCard key={`locked-${i}`} index={options.length + i} />
          ))}
      </div>

      {!unlocked && (
        <div className="space-y-4 rounded-2xl border-2 border-primary/30 bg-primary/5 p-6 text-center">
          <div className="flex justify-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/30 bg-primary/10">
              <Lock className="h-5 w-5 text-primary" />
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="font-display text-lg font-bold text-foreground">
              Unlock the other {Math.max(lockedCount, 0) || ''} paths
            </h4>
            <p className="mx-auto max-w-sm text-sm text-muted-foreground">
              Full Survival Kit: every reskilling path, specific courses and platforms, and realistic EU/US income ranges.
            </p>
          </div>
          <ul className="mx-auto w-fit space-y-1.5 text-left text-sm text-foreground/80">
            {['All personalised reskilling paths', 'Concrete courses & platforms to start', 'Realistic income potential per path'].map((line) => (
              <li key={line} className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 flex-shrink-0 text-primary" />
                {line}
              </li>
            ))}
          </ul>
          <Button
            onClick={onUnlock}
            disabled={unlocking}
            className="w-full bg-primary px-8 py-5 font-semibold text-primary-foreground hover:bg-primary/90"
          >
            {unlocking ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Opening checkout…
              </>
            ) : (
              <>
                Unlock Full Survival Kit — €9
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
          <p className="font-mono text-[10px] text-muted-foreground/70">One-time payment · Unlocks this verdict forever</p>
        </div>
      )}
    </div>
  );
}