import React from 'react';
import { Lock } from 'lucide-react';

export default function LockedSurvivalCard({ index }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-card p-5">
      <div className="pointer-events-none select-none space-y-2.5 blur-[6px]" aria-hidden="true">
        <div className="flex items-start gap-4">
          <div className="h-9 w-9 flex-shrink-0 rounded-xl border border-primary/20 bg-primary/10" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-2/3 rounded bg-foreground/25" />
            <div className="h-3 w-full rounded bg-foreground/15" />
            <div className="h-3 w-5/6 rounded bg-foreground/15" />
            <div className="h-3 w-3/5 rounded bg-foreground/15" />
          </div>
        </div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center bg-background/40">
        <div className="flex items-center gap-2 rounded-full border border-primary/30 bg-background/80 px-3 py-1.5">
          <Lock className="h-3.5 w-3.5 text-primary" />
          <span className="font-mono text-xs text-primary">Path {index + 1} locked</span>
        </div>
      </div>
    </div>
  );
}