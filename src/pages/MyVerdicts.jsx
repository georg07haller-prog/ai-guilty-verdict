import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Cloud, Loader2, LogIn, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CourtHeader from '../components/courtroom/CourtHeader';
import VerdictHistoryRow from '@/components/verdict/VerdictHistoryRow';
import { getVerdictHistory } from '@/lib/verdictHistory';
import { useAuth } from '@/lib/AuthContext';
import { base44 } from '@/api/base44Client';

const HISTORY_LIMIT = 50;

function toEntry(record) {
  return {
    id: record.id,
    job_title: record.job_title,
    industry: record.industry,
    percent: record.obsolescence_probability || 0,
    created_date: record.created_date,
  };
}

function mergeEntries(local, remote) {
  const byId = new Map();
  [...local, ...remote].forEach((entry) => {
    if (entry?.id && !byId.has(entry.id)) byId.set(entry.id, entry);
  });
  return [...byId.values()].sort(
    (a, b) => new Date(b.created_date || 0) - new Date(a.created_date || 0)
  );
}

export default function MyVerdicts() {
  const { user, isAuthenticated, navigateToLogin } = useAuth();
  const [localVerdicts] = useState(() => getVerdictHistory());
  const [accountVerdicts, setAccountVerdicts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setAccountVerdicts([]);
      return;
    }

    let active = true;
    setLoading(true);
    base44.entities.Verdict.list({ sort: '-created_date', limit: HISTORY_LIMIT })
      .then((result) => {
        if (!active) return;
        const items = Array.isArray(result) ? result : result?.items || [];
        setAccountVerdicts(items.map(toEntry));
      })
      .catch((error) => console.error('Could not load saved verdicts:', error))
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [isAuthenticated]);

  const verdicts = mergeEntries(localVerdicts, accountVerdicts);

  return (
    <div className="min-h-screen bg-background">
      <div className="hidden md:block">
        <CourtHeader />
      </div>

      <main className="mx-auto max-w-2xl px-4 py-8 pb-24 md:py-12">
        <div className="mb-6 space-y-2">
          <p className="font-mono text-xs uppercase tracking-widest text-primary">Your case files</p>
          <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">My Verdicts</h1>
          <p className="text-sm text-muted-foreground">
            {isAuthenticated
              ? 'Every verdict saved to your account, newest first.'
              : 'Every verdict you generated in this browser, newest first.'}
          </p>
        </div>

        {isAuthenticated ? (
          <div className="mb-6 flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
            <Cloud className="h-4 w-4 flex-shrink-0 text-primary" />
            <p className="text-xs text-muted-foreground">
              Synced with <span className="text-foreground">{user?.email}</span> — visible on any device.
            </p>
          </div>
        ) : (
          <div className="mb-6 flex flex-col gap-3 rounded-xl border border-border bg-card px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">
              Verdicts are stored in this browser only. Sign in to keep them on every device.
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={navigateToLogin}
              className="flex-shrink-0 border-border text-foreground hover:bg-secondary"
            >
              <LogIn className="mr-2 h-3.5 w-3.5" />
              Sign in to sync
            </Button>
          </div>
        )}

        {loading && (
          <div className="mb-4 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
            Loading your case files…
          </div>
        )}

        {verdicts.length === 0 && !loading ? (
          <div className="space-y-5 rounded-2xl border border-border bg-card py-16 text-center">
            <div className="text-4xl">📜</div>
            <p className="font-display text-lg text-foreground">The record is empty.</p>
            <p className="mx-auto max-w-xs text-sm text-muted-foreground">
              The Robot Judge has not sentenced anyone here yet.
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
            {verdicts.map((item, index) => (
              <VerdictHistoryRow key={item.id} item={item} index={index} />
            ))}

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