import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, Scale } from 'lucide-react';

const PAGE_TITLES = {
  '/Landing': null,       // landing uses CourtHeader
  '/Quiz': 'Courtroom',
  '/Results': 'Your Verdict',
  '/About': 'About',
  '/Contact': 'Contact',
};

const CHILD_ROUTES = ['/Quiz', '/Results'];

export default function MobileHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const title = PAGE_TITLES[location.pathname];
  const isChild = CHILD_ROUTES.includes(location.pathname);

  // Don't show on Landing — CourtHeader handles it
  if (!title) return null;

  return (
    <header
      className="md:hidden sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border/40 flex items-center px-4 gap-3"
      style={{
        minHeight: '3.5rem',
        paddingTop: 'calc(env(safe-area-inset-top) + 0.5rem)',
        paddingBottom: '0.5rem',
      }}
    >
      {isChild && (
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground transition-colors select-none"
          style={{ userSelect: 'none', WebkitTapHighlightColor: 'transparent' }}
          aria-label="Go back"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}
      {!isChild && (
        <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Scale className="w-3.5 h-3.5 text-primary" />
        </div>
      )}
      <span className="font-display font-bold text-base text-foreground truncate">{title}</span>
    </header>
  );
}