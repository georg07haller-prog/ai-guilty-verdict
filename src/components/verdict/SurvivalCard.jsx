import React from 'react';
import { motion } from 'framer-motion';
import { Shield, ExternalLink } from 'lucide-react';

export default function SurvivalCard({ option, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 + index * 0.15 }}
      className="border border-border rounded-lg p-4 bg-secondary/20 hover:bg-secondary/40 transition-colors"
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Shield className="w-4 h-4 text-primary" />
        </div>
        <div className="space-y-2 flex-1">
          <h4 className="font-display text-base font-bold text-foreground">{option.name}</h4>
          <p className="text-sm text-muted-foreground font-body leading-relaxed">{option.why}</p>
          {option.next_steps && (
            <div className="text-xs text-primary/80 font-mono space-y-1">
              {option.next_steps.map((step, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <ExternalLink className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  <span>{step}</span>
                </div>
              ))}
            </div>
          )}
          {option.income_potential && (
            <div className="text-xs font-mono text-green-400 mt-1">
              💰 {option.income_potential}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}