import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CourtHeader from '../components/courtroom/CourtHeader';
import { getVerdictHistory } from '@/lib/verdictHistory';

export default function MyVerdicts() {
  const verdicts = getVerdictHistory();

  return (
    <div className="min-h-screen bg-background">
      <div className="hidden md:block">
        <CourtHeader />
      </div>

      <main className="mx-auto max-w-2xl px-4 py-8 pb-24 md:py-12">
        <div className="mb-8 space-y-2">
          <p className="font-mono text-xs uppercase tracking-widest text-primary">Your case files</p>
          <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">My Verdicts</h1>
          <p className="text-sm text-muted-foreground">
            Every verdict you generated in this browser, newest first.
          </p>
        </div>

        {verdicts.length === 0 ? (
          <div className="space-y-5 rounded-2xl border border-border bg-card py-16 text-center">
            <div className="text-4xl">📜</div>
            <p className="font-display text-lg text-foreground">The record is empty.</p>
            <p className="mx-auto max-w-xs text-sm text-muted-foreground">
              The Robot Judge has not sentenced anyone from this browser yet.
            </p>
            <Link to="/Quiz">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Scale className="mr-2 h-4 w-4" />
                Get Your First Verdict
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {verdicts.map((item, index) => {
              const pct = item.percent || 0;
              const riskColor = pct >= 75 ? 'text-red-400' : pct >= 45 ? 'text-yellow-400' : 'text-green-400';
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={`/Results?id=${item.id}`}
                    className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/30"
                  >
                    <div className="w-14 flex-shrink-0 text-center">
                      <p className={`font-display text-xl font-black ${riskColor}`}>{pct}%</p>
                      <p className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">risk</p>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-foreground">{item.job_title || 'Unknown role'}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {item.industry || 'Industry withheld'}
                        {item.created_date ? ` · ${new Date(item.created_date).toLocaleDateString()}` : ''}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                  </Link>
                </motion.div>
              );
            })}

            <Link to="/Quiz">
              <Button
                variant="outline"
                className="mt-4 w-full border-border text-muted-foreground hover:text-foreground"
              >
                <Scale className="mr-2 h-4 w-4" />
                New Verdict
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}