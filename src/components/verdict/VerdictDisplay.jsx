import React from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import EvidenceBar from './EvidenceBar';
import SurvivalCard from './SurvivalCard';
import GavelIcon from '../courtroom/GavelIcon';

export default function VerdictDisplay({ verdictData }) {
  if (!verdictData) return null;

  const { probability, crime, evidence, verdict_paragraph, survival_options } = verdictData;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="text-center space-y-4"
      >
        <GavelIcon className="w-16 h-16 mx-auto" animated />
        <h2 className="font-display text-3xl md:text-4xl font-black text-accent tracking-tight">
          GUILTY AS CHARGED! ⚖️🤖
        </h2>
        <div className="inline-block">
          <div className="relative">
            <div className="absolute inset-0 bg-accent/20 blur-xl rounded-full" />
            <div className="relative bg-card border-2 border-accent/50 rounded-2xl px-8 py-5">
              <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-1">
                Probability of Obsolescence
              </p>
              <p className="font-display text-5xl md:text-6xl font-black text-accent">
                {probability?.percent || 0}%
              </p>
              <p className="font-body text-sm text-muted-foreground mt-1">
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
        className="border border-border rounded-lg p-5 bg-card"
      >
        <h3 className="font-display text-lg font-bold text-primary mb-3 flex items-center gap-2">
          📋 The Crime
        </h3>
        <div className="font-body text-sm md:text-base text-foreground/85 leading-relaxed prose prose-invert max-w-none">
          <ReactMarkdown>{crime || ''}</ReactMarkdown>
        </div>
      </motion.div>

      {/* Evidence */}
      {evidence && evidence.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="border border-border rounded-lg p-5 bg-card"
        >
          <h3 className="font-display text-lg font-bold text-primary mb-4 flex items-center gap-2">
            🔍 Evidence
          </h3>
          <div className="space-y-4">
            {evidence.map((item, i) => (
              <EvidenceBar
                key={i}
                category={item.category}
                riskLevel={item.risk_level}
                percentage={item.percentage}
                delay={0.6 + i * 0.1}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Verdict */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="border-2 border-accent/30 rounded-lg p-5 bg-accent/5"
      >
        <h3 className="font-display text-lg font-bold text-accent mb-3 flex items-center gap-2">
          ⚡ Verdict
        </h3>
        <div className="font-body text-sm md:text-base text-foreground/85 leading-relaxed prose prose-invert max-w-none">
          <ReactMarkdown>{verdict_paragraph || ''}</ReactMarkdown>
        </div>
      </motion.div>

      {/* Survival Kit */}
      {survival_options && survival_options.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="space-y-4"
        >
          <h3 className="font-display text-lg font-bold text-primary flex items-center gap-2">
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