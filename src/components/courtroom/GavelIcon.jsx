import React from 'react';

export default function GavelIcon({ className = "w-12 h-12", animated = false }) {
  return (
    <div className={`inline-flex items-center justify-center ${animated ? 'animate-gavel-slam' : ''}`}>
      <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="26" y="8" width="12" height="24" rx="3" fill="hsl(var(--primary))" opacity="0.9" />
        <rect x="22" y="6" width="20" height="8" rx="4" fill="hsl(var(--primary))" />
        <rect x="30" y="32" width="4" height="20" rx="2" fill="hsl(var(--muted-foreground))" />
        <ellipse cx="32" cy="54" rx="14" ry="4" fill="hsl(var(--primary))" opacity="0.3" />
        <rect x="18" y="52" width="28" height="6" rx="3" fill="hsl(var(--primary))" opacity="0.7" />
      </svg>
    </div>
  );
}