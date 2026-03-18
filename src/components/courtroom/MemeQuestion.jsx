import React from 'react';
import { motion } from 'framer-motion';

export default function MemeQuestion({ question, options, selectedValue, onSelect, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="space-y-3"
    >
      <p className="font-body text-sm md:text-base text-foreground font-medium">
        <span className="text-primary font-mono mr-2">§{index + 1}.</span>
        {question}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onSelect(option.value)}
            className={`
              text-left px-4 py-3 rounded-lg border transition-all duration-200 text-sm font-body
              ${selectedValue === option.value
                ? 'border-primary bg-primary/10 text-primary shadow-lg shadow-primary/10'
                : 'border-border bg-secondary/30 text-muted-foreground hover:border-primary/40 hover:bg-secondary/60'
              }
            `}
          >
            <span className="font-mono text-xs mr-2 opacity-60">{option.emoji}</span>
            {option.label}
          </button>
        ))}
      </div>
    </motion.div>
  );
}