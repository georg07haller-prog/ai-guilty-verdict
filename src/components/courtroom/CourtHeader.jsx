import React from 'react';
import { Scale } from 'lucide-react';

export default function CourtHeader() {
  return (
    <header className="relative py-6 px-4 border-b border-border/50">
      <div className="max-w-4xl mx-auto flex items-center justify-center gap-3">
        <Scale className="w-6 h-6 text-primary" />
        <h1 className="font-display text-xl md:text-2xl font-bold tracking-wide text-primary">
          AI GUILTY VERDICT
        </h1>
        <Scale className="w-6 h-6 text-primary" />
      </div>
      <p className="text-center text-muted-foreground text-xs font-mono mt-1 tracking-widest uppercase">
        The Court of Artificial Intelligence • Est. 2026
      </p>
    </header>
  );
}