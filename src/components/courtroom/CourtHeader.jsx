import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Scale, Menu, X } from 'lucide-react';

export default function CourtHeader() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isLanding = location.pathname === '/Landing' || location.pathname === '/';

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/Landing" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <Scale className="w-4 h-4 text-primary" />
          </div>
          <span className="font-display text-base font-bold text-foreground">
            AI Guilty<span className="text-primary"> Verdict</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/Landing" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-body">
            Home
          </Link>
          <Link to="/Quiz" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-body">
            Take the Test
          </Link>
          <Link
            to="/Quiz"
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all glow-blue font-body"
          >
            Get Your Verdict →
          </Link>
        </nav>

        {/* Mobile menu */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-muted-foreground hover:text-foreground">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-md px-4 py-4 space-y-3">
          <Link to="/Landing" onClick={() => setOpen(false)} className="block text-sm text-muted-foreground hover:text-foreground py-2">Home</Link>
          <Link to="/Quiz" onClick={() => setOpen(false)} className="block text-sm text-muted-foreground hover:text-foreground py-2">Take the Test</Link>
          <Link
            to="/Quiz"
            onClick={() => setOpen(false)}
            className="block w-full text-center px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold"
          >
            Get Your Verdict →
          </Link>
        </div>
      )}
    </header>
  );
}