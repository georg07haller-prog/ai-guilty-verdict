import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Scale, Mail, MessageSquare, Twitter } from 'lucide-react';
import CourtHeader from '../components/courtroom/CourtHeader';
import DeleteAccountModal from '../components/layout/DeleteAccountModal';
import { Button } from '@/components/ui/button';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay, ease: 'easeOut' }
});

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple mailto fallback
    const subject = encodeURIComponent(`Message from ${form.name}`);
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`);
    window.location.href = `mailto:info@ideamart.eu?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="hidden md:block"><CourtHeader /></div>

      <main className="max-w-2xl mx-auto px-4 py-8 md:py-24 pb-24 md:pb-16 space-y-12">

        <motion.div {...fadeUp(0)} className="space-y-4">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-mono tracking-wider">
            <Mail className="w-3.5 h-3.5" />
            CONTACT THE COURT
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-black text-foreground leading-tight">
            Get In <span className="text-gradient-blue">Touch</span>
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Questions, feedback, press enquiries, or just want to tell the Robot Judge it was wrong? We'd love to hear from you.
          </p>
        </motion.div>

        {/* Contact methods */}
        <motion.div {...fadeUp(0.1)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a
            href="mailto:info@ideamart.eu"
            className="flex items-center gap-4 border border-border rounded-2xl p-5 bg-card hover:border-primary/40 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
              <Mail className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Email Us</p>
              <p className="text-xs text-muted-foreground">info@ideamart.eu</p>
            </div>
          </a>

          <a
            href="https://twitter.com/urigGH"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 border border-border rounded-2xl p-5 bg-card hover:border-primary/40 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
              <Twitter className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Twitter / X</p>
              <p className="text-xs text-muted-foreground">@urigGH</p>
            </div>
          </a>
        </motion.div>

        {/* Contact form */}
        <motion.div {...fadeUp(0.2)} className="border border-border rounded-2xl p-7 bg-card space-y-5">
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare className="w-4 h-4 text-primary" />
            <h2 className="font-semibold text-foreground text-sm">Send a Message</h2>
          </div>

          {sent ? (
            <div className="text-center py-8 space-y-2">
              <p className="text-2xl">⚖️</p>
              <p className="font-semibold text-foreground">Message received by the Court.</p>
              <p className="text-sm text-muted-foreground">Your email client should have opened. We'll get back to you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Your name"
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-secondary/30 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Email</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-secondary/30 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Message</label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  placeholder="What's on your mind?"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-secondary/30 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:border-primary/50 transition-colors resize-none"
                />
              </div>
              <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
                Send Message →
              </Button>
            </form>
          )}
        </motion.div>
      </main>

      <footer className="section-divider py-8 px-4 mt-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground font-mono">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-primary" />
            <span>AI Guilty Verdict · Built in Europe · 2026</span>
          </div>
          <div className="flex gap-4 items-center">
            <Link to="/About" className="hover:text-foreground transition-colors">About</Link>
            <Link to="/Contact" className="hover:text-foreground transition-colors">Contact</Link>
            <DeleteAccountModal />
          </div>
        </div>
      </footer>
    </div>
  );
}