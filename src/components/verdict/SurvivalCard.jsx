import React from 'react';
import { motion } from 'framer-motion';
import { Shield, ExternalLink, TrendingUp } from 'lucide-react';

export default function SurvivalCard({ option, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.12 }}
      className="border border-border rounded-xl p-5 bg-card hover:border-primary/30 transition-all group"
    >
      <div className="flex items-start gap-4">
        <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-primary/20 transition-colors">
          <span className="font-mono text-sm font-bold text-primary">{index + 1}</span>
        </div>
        <div className="space-y-2.5 flex-1 min-w-0">
          <h4 className="font-semibold text-foreground text-base leading-tight">{option.name}</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{option.why}</p>

          {option.next_steps && option.next_steps.length > 0 && (
            <div className="space-y-1.5 pt-1">
              {option.next_steps.map((step, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-primary/80 font-mono">
                  <ExternalLink className="w-3 h-3 mt-0.5 flex-shrink-0 opacity-70" />
                  <span className="leading-relaxed">{step}</span>
                </div>
              ))}
            </div>
          )}

          {option.income_potential && (
            <div className="flex items-center gap-1.5 mt-2 text-xs font-mono text-green-400 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2 w-fit">
              <TrendingUp className="w-3 h-3" />
              {option.income_potential}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}