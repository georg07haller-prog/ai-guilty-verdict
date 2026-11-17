import React, { useCallback, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import PullToRefreshIndicator from '@/components/layout/PullToRefreshIndicator';
import { motion } from 'framer-motion';
import { AlertCircle, History, Loader2, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import CourtHeader from '../components/courtroom/CourtHeader';
import VerdictDisplay from '../components/verdict/VerdictDisplay';
import DownloadVerdictPDF from '../components/verdict/DownloadVerdictPDF';
import ShareVerdictPanel from '../components/verdict/ShareVerdictPanel';
import { startCheckout } from '@/lib/checkout';
import { getUnlockToken, saveUnlockToken } from '@/lib/verdictHistory';
import { track } from '@/lib/analytics';

export default function Results() {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const sessionIdParam = query.get('session_id');
  const idParam = query.get('id');
  const paymentParam = query.get('payment');

  const [verdictData, setVerdictData] = useState(null);
  const [inputData, setInputData] = useState(null);
  const [verdictId, setVerdictId] = useState(null);
  const [unlocked, setUnlocked] = useState(false);
  const [lockedCount, setLockedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [unlocking, setUnlocking] = useState(false);
  const [notice, setNotice] = useState('');

  const applyStored = useCallback(() => {
    const storedVerdict = sessionStorage.getItem('latestVerdict');
    if (!storedVerdict) return false;

    let parsed;
    try {
      parsed = JSON.parse(storedVerdict);
    } catch {
      return false;
    }
    const storedInput = sessionStorage.getItem('latestVerdictInput');
    const totalOptions = Number(sessionStorage.getItem('latestVerdictOptionCount') || 0);

    setVerdictData(parsed);
    setInputData(storedInput ? JSON.parse(storedInput) : null);
    setVerdictId(sessionStorage.getItem('latestVerdictId') || null);
    setLockedCount(Math.max(0, (totalOptions || parsed.survival_options?.length || 0) - (parsed.survival_options?.length || 0)));
    setUnlocked(false);
    return true;
  }, []);

  const loadFromServer = useCallback(async ({ sessionId, verdictId: requestedId }) => {
    const payload = sessionId
      ? { session_id: sessionId }
      : { verdict_id: requestedId, session_id: getUnlockToken(requestedId) || undefined };

    const response = await base44.functions.invoke('getVerdict', payload);
    if (response.data?.error) throw new Error(response.data.error);
    const data = response.data;

    setVerdictData(data.verdict);
    setInputData(data.input);
    setVerdictId(data.verdict_id);
    setUnlocked(!!data.unlocked);
    setLockedCount(Math.max(0, (data.total_options || 0) - (data.verdict?.survival_options?.length || 0)));

    if (sessionId && data.unlocked) {
      saveUnlockToken(data.verdict_id, sessionId);
      window.history.replaceState({}, '', `/Results?id=${data.verdict_id}`);
      track('verdict_unlocked', { verdict_id: data.verdict_id });
    }
  }, []);

  const load = useCallback(async () => {
    try {
      if (sessionIdParam) {
        await loadFromServer({ sessionId: sessionIdParam });
      } else if (idParam) {
        await loadFromServer({ verdictId: idParam });
      } else {
        applyStored();
      }
    } catch (error) {
      console.error('Could not load verdict:', error);
      setNotice(error.message || 'Could not load this verdict.');
      applyStored();
    } finally {
      setLoading(false);
    }
  }, [sessionIdParam, idParam, loadFromServer, applyStored]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (paymentParam === 'cancelled') {
      setNotice('Payment cancelled — your free verdict is still here.');
    }
  }, [paymentParam]);

  const { pullDistance, refreshing, onTouchStart, onTouchMove, onTouchEnd } = usePullToRefresh(async () => {
    await load();
  });

  const handleUnlock = async () => {
    setUnlocking(true);
    setNotice('');
    track('unlock_clicked', { verdict_id: verdictId });
    try {
      await startCheckout('verdict', verdictId);
    } catch (error) {
      console.error('Checkout error:', error);
      setNotice(error.message || 'Could not start checkout.');
      setUnlocking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="hidden md:block">
          <CourtHeader />
        </div>
        <div className="flex flex-col items-center justify-center space-y-4 py-32 px-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Opening the case file…</p>
        </div>
      </div>
    );
  }

  if (!verdictData) {
    return (
      <div className="min-h-screen bg-background">
        <div className="hidden md:block">
          <CourtHeader />
        </div>
        <div className="flex flex-col items-center justify-center space-y-5 px-4 py-32 text-center">
          <div className="text-4xl">⚖️</div>
          <p className="font-display text-xl text-foreground">No verdict on record.</p>
          <p className="font-body text-muted-foreground">
            {notice || 'The court has no file for you. Step inside.'}
          </p>
          <Link to="/Quiz">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Enter the Courtroom</Button>
          </Link>
        </div>
      </div>
    );
  }

  const pct = verdictData.probability?.percent || 0;
  const riskColor = pct >= 75 ? 'text-red-400' : pct >= 45 ? 'text-yellow-400' : 'text-green-400';

  return (
    <div
      className="min-h-screen bg-background"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <PullToRefreshIndicator pullDistance={pullDistance} refreshing={refreshing} />
      <div className="hidden md:block">
        <CourtHeader />
      </div>

      <main className="mx-auto max-w-2xl px-4 py-8 pb-24 md:py-12 md:pb-12">
        {inputData && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex flex-wrap gap-2"
          >
            <span className="rounded-full border border-border bg-secondary px-3 py-1.5 font-mono text-xs text-muted-foreground">
              🏷 {inputData.job_title}
            </span>
            <span className="rounded-full border border-border bg-secondary px-3 py-1.5 font-mono text-xs text-muted-foreground">
              🏢 {inputData.industry}
            </span>
            <span className={`rounded-full border border-border bg-secondary px-3 py-1.5 font-mono text-xs ${riskColor}`}>
              ⚠️ {pct}% risk
            </span>
            {unlocked && (
              <span className="rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1.5 font-mono text-xs text-green-400">
                ✓ Kit unlocked
              </span>
            )}
          </motion.div>
        )}

        {notice && (
          <div className="mb-6 flex items-start gap-2 rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-3 text-sm text-yellow-200">
            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <span>{notice}</span>
          </div>
        )}

        <VerdictDisplay
          verdictData={verdictData}
          unlocked={unlocked}
          lockedCount={lockedCount}
          onUnlock={handleUnlock}
          unlocking={unlocking}
        />

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button
            variant="outline"
            onClick={() => navigate('/Quiz')}
            className="flex-1 border-border text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Try Another Role
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/Quiz')}
            className="flex-1 border-yellow-500/40 text-yellow-400 hover:bg-yellow-500/10 hover:text-yellow-300"
          >
            ⚖️ File an Appeal
          </Button>
          <DownloadVerdictPDF verdictData={verdictData} inputData={inputData} />
        </div>

        <div className="mt-3">
          <ShareVerdictPanel verdictData={verdictData} inputData={inputData} verdictId={verdictId} />
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/MyVerdicts"
            className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <History className="h-3.5 w-3.5" />
            My verdicts
          </Link>
        </div>

        <div className="mt-8 text-center">
          <p className="font-mono text-xs text-muted-foreground/40">
            Case #{Date.now().toString(36).toUpperCase()} · The Robot Judge has spoken · Built in Europe
          </p>
        </div>
      </main>
    </div>
  );
}