import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

export default function VerdictHistoryRow({ item, index }) {
  const pct = item.percent || 0;
  const riskColor = pct >= 75 ? 'text-red-400' : pct >= 45 ? 'text-yellow-400' : 'text-green-400';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index, 6) * 0.05 }}
    >
      <Link
        to={`/Results?id=${item.id}`}
        className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/30"
      >
        <div className="w-14 flex-shrink-0 text-center">
          <p className={`font-display text-xl font-black ${riskColor}`}>{pct}%</p>
          <p className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">risk</p>
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-foreground">{item.job_title || 'Unknown role'}</p>
          <p className="truncate text-xs text-muted-foreground">
            {item.industry || 'Industry withheld'}
            {item.created_date ? ` · ${new Date(item.created_date).toLocaleDateString()}` : ''}
          </p>
        </div>
        <ChevronRight className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
      </Link>
    </motion.div>
  );
}