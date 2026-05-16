import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Scale, Brain, Shield, Zap } from 'lucide-react';
import CourtHeader from '../components/courtroom/CourtHeader';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay, ease: 'easeOut' }
});

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <CourtHeader />

      <main className="max-w-3xl mx-auto px-4 py-16 md:py-24 space-y-14">

        <motion.div {...fadeUp(0)} className="space-y-4">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-mono tracking-wider">
            <Scale className="w-3.5 h-3.5" />
            ABOUT THE COURT
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-black text-foreground leading-tight">
            What Is <span className="text-gradient-blue">AI Guilty Verdict?</span>
          </h1>
        </motion.div>

        <motion.div {...fadeUp(0.1)} className="prose prose-invert max-w-none space-y-5 text-muted-foreground leading-relaxed text-base">
          <p>
            <strong className="text-foreground">AI Guilty Verdict</strong> is a satirical yet genuinely useful career assessment tool built for professionals who want to understand — without the corporate spin — exactly how exposed their role is to AI-driven automation. In under two minutes, it produces a personalised obsolescence risk score, a breakdown of your most vulnerable daily tasks, and a concrete Survival Kit to help you stay ahead.
          </p>
          <p>
            The tool is designed for <strong className="text-foreground">knowledge workers across Western Europe and North America</strong> — marketing managers, content strategists, analysts, designers, lawyers, and anyone else quietly wondering whether that new AI tool their boss demoed last Tuesday is coming for their job. Rather than drown you in abstract statistics, AI Guilty Verdict makes the analysis personal, specific, and — yes — a little funny.
          </p>
          <p>
            The experience is delivered through <strong className="text-foreground">Robot Judge 2026</strong>, our opinionated AI character who takes your inputs, weighs the evidence across eight risk categories, and renders a verdict with the gravitas of a courtroom and the wit of a meme page. The result is something you actually want to read — and share.
          </p>
          <p>
            Behind the scenes, the assessments are powered by large language models and grounded in real labour-market research on AI adoption rates across industries. Every Survival Kit recommendation points to specific platforms, realistic income ranges, and skill paths that are genuinely AI-resistant in the current market — not just "learn to prompt better."
          </p>
          <p>
            AI Guilty Verdict is <strong className="text-foreground">built in Europe</strong>, developed with GDPR compliance and a privacy-first architecture. We collect only what is strictly necessary to generate your verdict, we never sell your data, and we never use your inputs to train AI models.
          </p>
          <p>
            The project is maintained by a small independent team of developers and UX designers who believe that the best way to get people to take AI seriously is to make them laugh first — and then hand them a plan.
          </p>
        </motion.div>

        <motion.div {...fadeUp(0.2)} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: Brain, title: 'Honest Assessment', desc: 'No sugarcoating. Real risk scores based on your actual tasks.' },
            { icon: Zap, title: 'Under 2 Minutes', desc: 'Fast, focused, and surprisingly insightful.' },
            { icon: Shield, title: 'Privacy First', desc: 'Built in Europe. GDPR compliant. Your data stays yours.' },
          ].map((item, i) => (
            <div key={i} className="border border-border rounded-2xl p-5 bg-card text-center">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-3">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground text-sm mb-1">{item.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </motion.div>

        <motion.div {...fadeUp(0.3)} className="text-center pt-4">
          <Link to="/Quiz">
            <button className="px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all glow-blue">
              Get My Verdict — Free →
            </button>
          </Link>
        </motion.div>
      </main>

      <footer className="section-divider py-8 px-4 mt-16">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground font-mono">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-primary" />
            <span>AI Guilty Verdict · Built in Europe · 2026</span>
          </div>
          <div className="flex gap-4">
            <Link to="/About" className="hover:text-foreground transition-colors">About</Link>
            <Link to="/Contact" className="hover:text-foreground transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}