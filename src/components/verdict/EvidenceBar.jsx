import React from 'react';
import { motion } from 'framer-motion';

const riskColors = {
  extreme: { bar: 'bg-red-500', text: 'text-red-400', label: '☠️ EXTREME' },
  high: { bar: 'bg-orange-500', text: 'text-orange-400', label: '🔴 HIGH' },
  medium: { bar: 'bg-yellow-500', text: 'text-yellow-400', label: '🟡 MEDIUM' },
  low: { bar: 'bg-green-500', text: 'text-green-400', label: '🟢 LOW' },
};

export default function EvidenceBar({ category, riskLevel, percentage, delay = 0 }) {
  const colors = riskColors[riskLevel] || riskColors.medium;

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center text-sm">
        <span className="font-body text-foreground/80">{category}</span>
        <span className={`font-mono text-xs ${colors.text}`}>{colors.label} — {percentage}%</span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, delay, ease: 'easeOut' }}
          className={`h-full rounded-full ${colors.bar}`}
        />
      </div>
    </div>
  );
}