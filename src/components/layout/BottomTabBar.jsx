import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Scale, Info } from 'lucide-react';

const tabs = [
  { label: 'Home', icon: Home, path: '/Landing' },
  { label: 'Take Test', icon: Scale, path: '/Quiz' },
  { label: 'About', icon: Info, path: '/About' },
];

export default function BottomTabBar() {
  const location = useLocation();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-t border-border flex items-stretch"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {tabs.map(({ label, icon: Icon, path }) => {
        const active = location.pathname === path || (path === '/Landing' && location.pathname === '/');
        return (
          <Link
            key={path}
            to={path}
            className="flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-colors select-none"
            style={{ WebkitTapHighlightColor: 'transparent', userSelect: 'none' }}
          >
            <Icon
              className={`w-5 h-5 transition-colors ${active ? 'text-primary' : 'text-muted-foreground'}`}
            />
            <span
              className={`text-[10px] font-mono tracking-wide transition-colors ${active ? 'text-primary' : 'text-muted-foreground'}`}
            >
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}