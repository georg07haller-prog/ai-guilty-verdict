import React, { useCallback } from 'react';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import PullToRefreshIndicator from '@/components/layout/PullToRefreshIndicator';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Scale, Zap, Shield, Brain, ChevronRight, Lock, Star,
  ArrowRight, CheckCircle, Globe, Sparkles, Target, BookOpen, BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import CourtHeader from '../components/courtroom/CourtHeader';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay, ease: 'easeOut' }
});

export default function Landing() {
  const handleRefresh = useCallback(async () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  const { pullDistance, refreshing, onTouchStart, onTouchMove, onTouchEnd } =
    usePullToRefresh(handleRefresh);

  return (
    <div
      className="min-h-screen bg-background overflow-x-hidden"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <PullToRefreshIndicator pullDistance={pullDistance} refreshing={refreshing} />
      <CourtHeader />

      {/* ── TICKER ── */}
      <div className="border-b border-border/40 bg-secondary/30 overflow-hidden py-2">
        <div className="flex animate-ticker whitespace-nowrap" style={{ width: 'max-content' }}>
          {[...Array(2)].map((_, ri) => (
            <span key={ri} className="flex gap-8 pr-8">
              {['⚖️ Robot Judge 2026 is IN SESSION', '🤖 87% of content writers are already nervous', '📊 Your spreadsheets have a replacement incoming', '🧠 Emotional intelligence: the last human moat', '🔴 ChatGPT just read your CV', '🛡️ Survival kits now available'].map((t, i) => (
                <span key={i} className="text-xs font-mono text-muted-foreground px-4">{t}</span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ── HERO ── */}
      <section className="relative min-h-[92vh] flex items-center justify-center bg-grid overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/8 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-accent/8 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Copy */}
            <div className="space-y-7">
              <motion.div {...fadeUp(0)}>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-mono tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  ROBOT JUDGE 2026 · IN SESSION
                </span>
              </motion.div>

              <motion.h1 {...fadeUp(0.1)} className="font-display text-4xl md:text-5xl lg:text-6xl font-black leading-[1.05] text-foreground">
                Robot Judge 2026
                <br />
                <span className="text-gradient-blue">has spoken.</span>
              </motion.h1>

              <motion.h2 {...fadeUp(0.15)} className="font-display text-2xl md:text-3xl font-bold text-foreground/80 leading-snug">
                Is your career <span className="text-destructive">guilty</span>…<br className="hidden md:block" /> or AI-proof?
              </motion.h2>

              <motion.p {...fadeUp(0.2)} className="text-lg text-muted-foreground leading-relaxed max-w-lg">
                Get a brutally honest, meme-infused verdict on your professional future in the age of AI. Laugh at your obsolescence risk — then walk away with a personalized re-skilling <strong className="text-foreground">Survival Kit</strong>.
              </motion.p>

              <motion.div {...fadeUp(0.3)} className="flex flex-col sm:flex-row gap-3">
                <Link to="/Quiz">
                  <Button size="lg" className="w-full sm:w-auto px-8 py-6 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 animate-pulse-glow rounded-xl">
                    <Scale className="w-4 h-4 mr-2" />
                    Get Your Verdict — Free
                  </Button>
                </Link>
                <a href="#how-it-works">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 py-6 text-base border-border text-muted-foreground hover:text-foreground rounded-xl">
                    See How It Works
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </a>
              </motion.div>

              <motion.div {...fadeUp(0.4)} className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground font-mono">
                <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-primary" /> Under 60 seconds</span>
                <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-primary" /> No sign-up required</span>
                <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-primary" /> GDPR compliant</span>
              </motion.div>
            </div>

            {/* Right: Hero Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.93 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="flex justify-center"
            >
              <div className="relative w-full max-w-lg">
                <div className="absolute inset-0 rounded-3xl bg-primary/15 blur-2xl scale-105" />
                <img
                  src="https://media.base44.com/images/public/69bac68abc49423e3d993638/596a3a033_generated_image.png"
                  alt="Robot Judge 2026 courtroom — GUILTY 78% Obsolescence Risk"
                  className="relative w-full rounded-3xl border border-primary/20 shadow-2xl object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-20 md:py-28 section-divider">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div {...fadeUp()} className="text-center mb-14">
            <p className="font-mono text-xs text-primary uppercase tracking-widest mb-3">Simple Process</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              From Suspect to Verdict in 3 Steps
            </h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">No lengthy forms. No jargon. Just honest answers and a very opinionated robot.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                icon: Brain,
                title: 'Quick Onboarding',
                desc: 'Tell the Judge your age, industry, and role. Takes less than 60 seconds. Be honest — it already knows.',
              },
              {
                step: '02',
                icon: Scale,
                title: 'Receive Your Verdict',
                desc: 'Robot Judge 2026 analyses your career and delivers a sharp, meme-worthy verdict with your personal Obsolescence Risk Score.',
              },
              {
                step: '03',
                icon: BookOpen,
                title: 'Get Your Survival Kit',
                desc: 'Receive a custom action plan with relevant skills, courses, and strategies to stay ahead of AI — specific to your role.',
              },
            ].map((item, i) => (
              <motion.div key={item.step} {...fadeUp(i * 0.12)} className="relative border border-border rounded-2xl p-6 bg-card hover:border-primary/30 transition-all group">
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <span className="font-mono text-xs font-bold text-primary">{item.step}</span>
                </div>
                <item.icon className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-foreground text-base mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div {...fadeUp(0.4)} className="text-center mt-10">
            <Link to="/Quiz">
              <Button className="px-8 py-5 text-sm font-semibold bg-primary/10 border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground rounded-xl transition-all">
                Start Now — It's Free <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── WHAT YOU GET ── */}
      <section className="py-20 md:py-28 section-divider bg-secondary/10">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div {...fadeUp()} className="text-center mb-14">
            <p className="font-mono text-xs text-accent uppercase tracking-widest mb-3">Your Report</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              What You'll Walk Away With
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                emoji: '⚖️',
                title: 'Brutal But Fair Verdict',
                desc: "A shareable, meme-ready verdict paragraph written in Robot Judge 2026's signature sarcastic-but-wise tone.",
                badge: 'Free',
                badgeColor: 'bg-primary/10 text-primary border-primary/20',
              },
              {
                emoji: '📊',
                title: 'Obsolescence Risk Score',
                desc: 'A precise 0–100% score showing how likely AI is to heavily transform or replace your role, with a realistic timeframe.',
                badge: 'Free',
                badgeColor: 'bg-primary/10 text-primary border-primary/20',
              },
              {
                emoji: '😂',
                title: 'Meme-Worthy Verdict Card',
                desc: "You'll actually want to share this. Screenshot-ready, provocative, and weirdly accurate.",
                badge: 'Free',
                badgeColor: 'bg-primary/10 text-primary border-primary/20',
              },
              {
                emoji: '🛡️',
                title: 'Re-Skilling Survival Kit',
                desc: 'Custom action plan with specific courses, platforms, income ranges, and why each niche is AI-resistant right now.',
                badge: 'Pro',
                badgeColor: 'bg-accent/10 text-accent border-accent/20',
              },
              {
                emoji: '🔁',
                title: 'Multiple Verdicts',
                desc: 'Generate verdicts with different parameters — explore alternative career paths or see how upskilling changes your score.',
                badge: 'Pro',
                badgeColor: 'bg-accent/10 text-accent border-accent/20',
              },
              {
                emoji: '📜',
                title: 'Verdict History',
                desc: 'Track how your risk score evolves over time as the job market and your skills change.',
                badge: 'Pro',
                badgeColor: 'bg-accent/10 text-accent border-accent/20',
              },
            ].map((item, i) => (
              <motion.div key={item.title} {...fadeUp(i * 0.08)} className="border border-border rounded-2xl p-6 bg-card hover:border-primary/20 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-2xl">{item.emoji}</span>
                  <span className={`text-xs font-mono px-2.5 py-1 rounded-full border ${item.badgeColor}`}>{item.badge}</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY IT MATTERS ── */}
      <section className="py-20 md:py-28 section-divider">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div {...fadeUp()} className="space-y-5">
              <p className="font-mono text-xs text-primary uppercase tracking-widest">Why AI Guilty Verdict?</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground leading-tight">
                Most career advice in 2026<br />
                <span className="text-gradient-blue">is either too polite or too generic.</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                AI Guilty Verdict gives you <strong className="text-foreground">honest feedback with a side of dark humor</strong> — so you can stop guessing and start adapting. Whether you're in tech, marketing, finance, or creative fields — the Judge doesn't sugarcoat reality. But it also gives you a clear path forward.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                By 2026, an estimated <strong className="text-foreground">300 million jobs</strong> globally are being transformed by AI. Most professionals have no idea where they actually stand. This tool gives you a clear, personalised picture in under 60 seconds.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-2">
                {[
                  { value: '300M', label: 'Jobs being transformed' },
                  { value: '60s', label: 'To get your verdict' },
                  { value: '8', label: 'Risk categories analysed' },
                  { value: '4+', label: 'Survival paths provided' },
                ].map((stat) => (
                  <div key={stat.label} className="border border-border rounded-xl p-4 bg-card">
                    <div className="font-display text-2xl font-bold text-primary">{stat.value}</div>
                    <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div {...fadeUp(0.2)} className="space-y-4">
              {[
                { icon: '😅', head: 'You laugh first...', body: 'The verdict is funny. The Robot Judge is dramatic. You screenshot it and send to your group chat.' },
                { icon: '🤔', head: '...then you think', body: 'Halfway through the Survival Kit, you realise the advice is actually solid and specific to your situation.' },
                { icon: '🚀', head: '...then you act', body: 'You leave with 3–5 concrete next steps, real platforms, and realistic income ranges. Not just "learn AI".' },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 p-5 rounded-2xl border border-border bg-card">
                  <span className="text-2xl flex-shrink-0">{item.icon}</span>
                  <div>
                    <p className="font-semibold text-foreground text-sm mb-1">{item.head}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── APP PREVIEW VISUAL ── */}
      <section className="py-20 md:py-28 section-divider bg-secondary/10">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div {...fadeUp()} className="text-center mb-12">
            <p className="font-mono text-xs text-accent uppercase tracking-widest mb-3">See It In Action</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Verdict + Survival Kit, Delivered
            </h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              Your risk score on the left. Your personalised action plan on the right. Everything you need, in one sharp report.
            </p>
          </motion.div>
          <motion.div {...fadeUp(0.15)} className="relative max-w-4xl mx-auto">
            <div className="absolute inset-0 rounded-3xl bg-primary/10 blur-2xl scale-105 pointer-events-none" />
            <img
              src="https://media.base44.com/images/public/69bac68abc49423e3d993638/1a3c1b6ad_generated_image.png"
              alt="AI Guilty Verdict app — verdict screen and re-skilling survival kit"
              className="relative w-full rounded-3xl border border-primary/20 shadow-2xl object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-20 md:py-28 section-divider">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div {...fadeUp()} className="text-center mb-12">
            <p className="font-mono text-xs text-primary uppercase tracking-widest mb-3">Testimonials</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              The Accused Have Spoken
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                quote: "I laughed, then immediately booked a Coursera course. 10/10 wake-up call.",
                name: "Marta K.",
                role: "Marketing Manager, Munich",
                stars: 5,
              },
              {
                quote: "The Robot Judge called me out. Not literally, but it felt personal. The survival kit was actually useful.",
                name: "Tom B.",
                role: "Content Strategist, Amsterdam",
                stars: 5,
              },
              {
                quote: "Got 73% obsolescence risk. Cried for 5 minutes. Then pivoted my freelance positioning. Genuinely helpful.",
                name: "Sophie R.",
                role: "Freelance Designer, Paris",
                stars: 5,
              },
            ].map((t, i) => (
              <motion.div key={i} {...fadeUp(i * 0.1)} className="border border-border rounded-2xl p-6 bg-card">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(t.stars)].map((_, s) => (
                    <Star key={s} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm text-foreground/90 leading-relaxed mb-4 italic">"{t.quote}"</p>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRIVACY & TRUST ── */}
      <section className="py-20 md:py-28 section-divider bg-secondary/10">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div {...fadeUp()} className="text-center mb-12">
            <p className="font-mono text-xs text-primary uppercase tracking-widest mb-3">Privacy First</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Your Career Data Stays Yours
            </h2>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
              We're not the AI you're worried about. Built with European values in mind.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Globe, title: 'Built in Europe', desc: 'Developed and hosted within the EU. Subject to GDPR.' },
              { icon: Lock, title: 'No Data Selling', desc: 'Your inputs are never sold or used to train models.' },
              { icon: Shield, title: 'Privacy-First Design', desc: "Minimal data collection. Only what's needed for your verdict." },
              { icon: CheckCircle, title: 'GDPR Compliant', desc: 'Full transparency on what we store and how to delete it.' },
            ].map((item, i) => (
              <motion.div key={item.title} {...fadeUp(i * 0.1)} className="border border-border rounded-2xl p-5 bg-card text-center">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-3">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-20 md:py-28 section-divider">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div {...fadeUp()} className="text-center mb-14">
            <p className="font-mono text-xs text-primary uppercase tracking-widest mb-3">Pricing</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              One Verdict. Two Depths.
            </h2>
            <p className="text-muted-foreground mt-3">Start free. Go deeper when you're ready.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Free */}
            <motion.div {...fadeUp(0.1)} className="border border-border rounded-2xl p-8 bg-card">
              <div className="mb-6">
                <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-2">Free</p>
                <div className="font-display text-4xl font-bold text-foreground">€0</div>
                <p className="text-sm text-muted-foreground mt-1">Always free, no card needed</p>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  "Limited verdicts",
                  "AI Risk Score (0–100%)",
                  "Evidence breakdown",
                  "Robot Judge's verdict paragraph",
                  "Basic survival recommendations",
                  "Shareable verdict card",
                ].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/Quiz">
                <Button variant="outline" className="w-full border-border text-foreground hover:bg-secondary">
                  Get Free Verdict
                </Button>
              </Link>
            </motion.div>

            {/* Pro */}
            <motion.div {...fadeUp(0.2)} className="relative border-2 border-primary rounded-2xl p-8 bg-card glow-blue overflow-hidden">
              <div className="absolute top-4 right-4">
                <span className="px-2.5 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold font-mono">MOST POPULAR</span>
              </div>
              <div className="mb-6">
                <p className="font-mono text-xs text-primary uppercase tracking-widest mb-2">Premium</p>
                <div className="font-display text-4xl font-bold text-foreground">€9<span className="text-lg text-muted-foreground font-body font-normal">/verdict</span></div>
                <p className="text-sm text-muted-foreground mt-1">Or €19/month for unlimited</p>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  'Everything in Free',
                  'Unlimited verdicts',
                  'Full Personalised Survival Kit (4+ paths)',
                  'Detailed income ranges & platforms',
                  'Verdict history & comparisons',
                  'Priority AI model (Claude Sonnet)',
                  'PDF export of your full report',
                ].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-foreground">
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/Quiz">
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Get Premium Verdict
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/8 blur-3xl rounded-full pointer-events-none" />
        <div className="relative z-10 max-w-2xl mx-auto px-4 text-center">
          <motion.div {...fadeUp()} className="space-y-6">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              THE COURT IS IN SESSION
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-black text-foreground leading-tight">
              Ready to hear what<br />
              <span className="text-gradient-blue">Robot Judge 2026</span><br />
              thinks about your career?
            </h2>
            <p className="text-muted-foreground text-lg max-w-md mx-auto">
              60 seconds. One brutal truth. A personalised plan. The Judge is waiting.
            </p>
            <Link to="/Quiz">
              <Button size="lg" className="px-12 py-6 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 animate-pulse-glow rounded-xl">
                <Scale className="w-5 h-5 mr-2" />
                Get My Verdict Now
              </Button>
            </Link>
            <p className="text-xs text-muted-foreground/60 font-mono">
              No credit card · No account · GDPR compliant · Built in Europe
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="section-divider py-8 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground font-mono">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-primary" />
            <span>AI Guilty Verdict · Built in Europe · 2026</span>
          </div>
          <a href="https://madprofessorlab.ideamart.eu/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors flex items-center gap-1.5">
            🧪 MadProfessor Laboratory
          </a>
          <div className="flex gap-4 flex-wrap justify-center">
            <Link to="/About" className="hover:text-foreground transition-colors">About</Link>
            <Link to="/Contact" className="hover:text-foreground transition-colors">Contact</Link>
            <span>⚖️ All verdicts final</span>
            <span>🔒 Privacy-first</span>
            <span>🇪🇺 GDPR compliant</span>
          </div>
        </div>
      </footer>
    </div>
  );
}