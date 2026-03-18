import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Scale, Zap, Shield, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CourtHeader from '../components/courtroom/CourtHeader';
import GavelIcon from '../components/courtroom/GavelIcon';

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <CourtHeader />

      <main className="max-w-3xl mx-auto px-4 py-12 md:py-20">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6"
        >
          <GavelIcon className="w-20 h-20 mx-auto" />

          <h1 className="font-display text-4xl md:text-6xl font-black text-foreground leading-tight">
            Will AI
            <span className="text-accent"> Replace </span>
            You?
          </h1>

          <p className="font-body text-lg md:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
            The Robot Judge will review your case, analyze your daily work, and deliver a brutally honest verdict on your career's AI-proof status.
          </p>

          <div className="pt-4">
            <Link to="/Quiz">
              <Button
                size="lg"
                className="font-display text-lg px-10 py-6 bg-primary text-primary-foreground hover:bg-primary/90 animate-pulse-glow rounded-xl"
              >
                <Scale className="w-5 h-5 mr-2" />
                ENTER THE COURTROOM
              </Button>
            </Link>
          </div>

          <p className="font-mono text-xs text-muted-foreground/60 tracking-wider">
            ⏱ Takes 2 minutes • 100% brutally honest • Survival kit included
          </p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-16"
        >
          {[
            {
              icon: AlertTriangle,
              title: 'AI Risk Score',
              desc: 'Get your personalized obsolescence probability based on real task analysis',
            },
            {
              icon: Zap,
              title: 'Evidence Breakdown',
              desc: 'See which parts of your job are most vulnerable to AI replacement',
            },
            {
              icon: Shield,
              title: 'Survival Kit',
              desc: 'Concrete reskilling paths with courses, platforms & income potential',
            },
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.15 }}
              className="border border-border rounded-lg p-5 bg-card hover:border-primary/30 transition-colors"
            >
              <feature.icon className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-display text-base font-bold text-foreground mb-1">{feature.title}</h3>
              <p className="font-body text-sm text-muted-foreground">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer note */}
        <div className="text-center mt-16 pt-8 border-t border-border/30">
          <p className="font-mono text-xs text-muted-foreground/50">
            ⚖️ All verdicts are final. The Robot Judge shows no mercy. ⚖️
          </p>
        </div>
      </main>
    </div>
  );
}