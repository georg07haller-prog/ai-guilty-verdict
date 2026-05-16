import React from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import EvidenceBar from './EvidenceBar';
import SurvivalCard from './SurvivalCard';

export default function VerdictDisplay({ verdictData }) {
  if (!verdictData) return null;

  const { probability, crime, evidence, verdict_paragraph, survival_options } = verdictData;
  const pct = probability?.percent || 0;
  const ringColor = pct >= 75 ? 'border-red-500/50' : pct >= 45 ? 'border-yellow-500/50' : 'border-green-500/50';
  const glowColor = pct >= 75 ? 'bg-red-500/10' : pct >= 45 ? 'bg-yellow-500/10' : 'bg-green-500/10';
  const textColor = pct >= 75 ? 'text-red-400' : pct >= 45 ? 'text-yellow-400' : 'text-green-400';

  return (
    <div className="space-y-6">
      {/* GUILTY header + score */}
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
        className="text-center space-y-5"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-red-500/30 bg-red-500/10">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="font-mono text-xs text-red-400 uppercase tracking-widest">Verdict Delivered</span>
        </div>

        <h2 className="font-display text-3xl md:text-4xl font-black text-foreground tracking-tight">
          GUILTY AS CHARGED! ⚖️🤖
        </h2>

        {/* Score ring */}
        <div className="inline-block">
          <div className="relative">
            <div className={`absolute inset-0 rounded-2xl blur-xl ${glowColor}`} />
            <div className={`relative bg-card border-2 ${ringColor} rounded-2xl px-10 py-6`}>
              <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-1">
                Probability of Obsolescence
              </p>
              <p className={`font-display text-6xl md:text-7xl font-black ${textColor}`}>
                {pct}%
              </p>
              <p className="font-body text-sm text-muted-foreground mt-2">
                {probability?.timeframe || 'within the next 18 months'}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* The Crime */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="border border-border rounded-xl p-5 bg-card"
      >
        <h3 className="font-semibold text-primary text-sm uppercase tracking-wider font-mono mb-3 flex items-center gap-2">
          📋 The Crime
        </h3>
        <div className="text-sm md:text-base text-foreground/85 leading-relaxed prose prose-invert prose-sm max-w-none">
          <ReactMarkdown>{crime || ''}</ReactMarkdown>
        </div>
      </motion.div>

      {/* Evidence */}
      {evidence && evidence.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="border border-border rounded-xl p-5 bg-card"
        >
          <h3 className="font-semibold text-primary text-sm uppercase tracking-wider font-mono mb-4 flex items-center gap-2">
            🔍 Evidence Breakdown
          </h3>
          <div className="space-y-4">
            {evidence.map((item, i) => (
              <EvidenceBar
                key={i}
                category={item.category}
                riskLevel={item.risk_level}
                percentage={item.percentage}
                delay={0.55 + i * 0.07}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Verdict paragraph */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="border border-primary/20 rounded-xl p-5 bg-primary/5"
      >
        <h3 className="font-semibold text-primary text-sm uppercase tracking-wider font-mono mb-3 flex items-center gap-2">
          ⚡ The Verdict
        </h3>
        <div className="text-sm md:text-base text-foreground/90 leading-relaxed prose prose-invert prose-sm max-w-none">
          <ReactMarkdown>{verdict_paragraph || ''}</ReactMarkdown>
        </div>
      </motion.div>

      {/* Survival Kit */}
      {survival_options && survival_options.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="space-y-4"
        >
          <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider font-mono flex items-center gap-2">
            🛡️ Appeal Options — Survival Kit
          </h3>
          <div className="space-y-3">
            {survival_options.map((option, i) => (
              <SurvivalCard key={i} option={option} index={i} />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}