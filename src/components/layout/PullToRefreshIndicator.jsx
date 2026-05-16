import React from 'react';
import { motion } from 'framer-motion';

const THRESHOLD = 72;

export default function PullToRefreshIndicator({ pullDistance, refreshing }) {
  const progress = Math.min(pullDistance / THRESHOLD, 1);
  const visible = pullDistance > 4 || refreshing;

  if (!visible) return null;

  return (
    <motion.div
      className="md:hidden fixed top-0 left-0 right-0 z-[60] flex justify-center pointer-events-none"
      style={{ paddingTop: 'calc(env(safe-area-inset-top) + 56px)' }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.15 }}
    >
      <motion.div
        className="flex items-center justify-center w-9 h-9 rounded-full bg-card border border-border shadow-lg"
        style={{ translateY: pullDistance * 0.6 - 20 }}
      >
        <motion.div
          className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full"
          animate={refreshing ? { rotate: 360 } : { rotate: progress * 300 }}
          transition={refreshing ? { repeat: Infinity, duration: 0.7, ease: 'linear' } : { duration: 0 }}
        />
      </motion.div>
    </motion.div>
  );
}