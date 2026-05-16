import React from 'react';
import { motion } from 'framer-motion';

export default function RobotJudge() {
  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      className="relative w-64 h-64 md:w-80 md:h-80"
    >
      {/* Glow behind */}
      <div className="absolute inset-8 rounded-full bg-primary/15 blur-2xl" />

      {/* Main robot SVG */}
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Body */}
        <rect x="55" y="90" width="90" height="80" rx="12" fill="hsl(222 40% 12%)" stroke="hsl(210 100% 56%)" strokeWidth="1.5" />

        {/* Chest panel */}
        <rect x="70" y="105" width="60" height="35" rx="6" fill="hsl(222 47% 8%)" stroke="hsl(210 100% 56% / 0.3)" strokeWidth="1" />
        {/* Chest lights */}
        <circle cx="85" cy="118" r="4" fill="hsl(210 100% 56%)" opacity="0.9" />
        <circle cx="100" cy="118" r="4" fill="hsl(180 100% 50%)" opacity="0.9" />
        <circle cx="115" cy="118" r="4" fill="hsl(263 85% 65%)" opacity="0.9" />
        {/* Chest bar */}
        <rect x="78" y="128" width="44" height="5" rx="2.5" fill="hsl(210 100% 56% / 0.4)" />

        {/* Head */}
        <rect x="60" y="28" width="80" height="68" rx="16" fill="hsl(222 40% 12%)" stroke="hsl(210 100% 56%)" strokeWidth="1.5" />

        {/* Eyes */}
        <rect x="72" y="46" width="22" height="14" rx="4" fill="hsl(210 100% 56% / 0.15)" stroke="hsl(210 100% 56%)" strokeWidth="1" />
        <rect x="106" y="46" width="22" height="14" rx="4" fill="hsl(210 100% 56% / 0.15)" stroke="hsl(210 100% 56%)" strokeWidth="1" />
        {/* Eye glow */}
        <rect x="76" y="50" width="14" height="6" rx="2" fill="hsl(210 100% 56%)" opacity="0.9" />
        <rect x="110" y="50" width="14" height="6" rx="2" fill="hsl(210 100% 56%)" opacity="0.9" />

        {/* Antenna */}
        <line x1="100" y1="28" x2="100" y2="14" stroke="hsl(210 100% 56%)" strokeWidth="2" />
        <circle cx="100" cy="11" r="4" fill="hsl(210 100% 56%)" />
        <circle cx="100" cy="11" r="7" fill="hsl(210 100% 56%)" opacity="0.2" />

        {/* Mouth */}
        <rect x="76" y="70" width="48" height="16" rx="5" fill="hsl(222 47% 8%)" stroke="hsl(210 100% 56% / 0.4)" strokeWidth="1" />
        {/* Mouth pixels */}
        {[80, 87, 94, 101, 108, 115].map((x, i) => (
          <rect key={i} x={x} y="76" width="4" height="4" rx="1" fill={i % 2 === 0 ? "hsl(180 100% 50%)" : "hsl(210 100% 56%)"} opacity="0.8" />
        ))}

        {/* Arms */}
        <rect x="20" y="95" width="35" height="16" rx="8" fill="hsl(222 40% 12%)" stroke="hsl(210 100% 56%)" strokeWidth="1.5" />
        <rect x="145" y="95" width="35" height="16" rx="8" fill="hsl(222 40% 12%)" stroke="hsl(210 100% 56%)" strokeWidth="1.5" />

        {/* Gavel in right hand */}
        <rect x="156" y="86" width="8" height="20" rx="2" fill="hsl(38 92% 60%)" />
        <rect x="152" y="82" width="16" height="9" rx="3" fill="hsl(38 92% 60%)" />

        {/* Legs */}
        <rect x="70" y="170" width="24" height="22" rx="6" fill="hsl(222 40% 12%)" stroke="hsl(210 100% 56%)" strokeWidth="1.5" />
        <rect x="106" y="170" width="24" height="22" rx="6" fill="hsl(222 40% 12%)" stroke="hsl(210 100% 56%)" strokeWidth="1.5" />

        {/* Head badge */}
        <rect x="78" y="18" width="44" height="12" rx="6" fill="hsl(210 100% 56%)" opacity="0.15" stroke="hsl(210 100% 56%)" strokeWidth="1" />
        <text x="100" y="27" textAnchor="middle" fill="hsl(210 100% 56%)" fontSize="6" fontFamily="monospace" fontWeight="bold">JUDGE 2026</text>
      </svg>

      {/* Scan line effect */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none opacity-20">
        <div className="absolute inset-x-0 h-px bg-primary animate-scan" style={{ top: '30%' }} />
      </div>
    </motion.div>
  );
}