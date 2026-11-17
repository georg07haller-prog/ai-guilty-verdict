import React from 'react';

export default function IndustryFrequencyList({ industries, highlight }) {
  const maxCount = Math.max(...industries.map((item) => item.count), 1);

  return (
    <ul className="space-y-3">
      {industries.map((item, index) => {
        const isYou = highlight && item.name.toLowerCase() === highlight.toLowerCase();
        return (
          <li key={item.name} className="space-y-1.5">
            <div className="flex items-baseline justify-between gap-3">
              <span className={`truncate text-sm ${isYou ? 'font-semibold text-primary' : 'text-foreground'}`}>
                <span className="mr-2 font-mono text-[10px] text-muted-foreground">{index + 1}.</span>
                {item.name}
                {isYou && <span className="ml-2 font-mono text-[10px] uppercase tracking-wider text-primary">you</span>}
              </span>
              <span className="flex-shrink-0 font-mono text-xs text-muted-foreground">
                {item.count} · {item.avg_risk}%
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className={isYou ? 'h-full rounded-full bg-primary' : 'h-full rounded-full bg-accent/70'}
                style={{ width: `${Math.max(4, (item.count / maxCount) * 100)}%` }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}