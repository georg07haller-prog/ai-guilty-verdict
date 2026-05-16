import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RotateCcw, Share2, Download, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import CourtHeader from '../components/courtroom/CourtHeader';
import VerdictDisplay from '../components/verdict/VerdictDisplay';

export default function Results() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [verdictData, setVerdictData] = useState(null);
  const [inputData, setInputData] = useState(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('latestVerdict');
    const storedInput = sessionStorage.getItem('latestVerdictInput');
    if (stored) setVerdictData(JSON.parse(stored));
    if (storedInput) setInputData(JSON.parse(storedInput));
  }, []);

  if (!verdictData) {
    return (
      <div className="min-h-screen bg-background">
        <CourtHeader />
        <div className="flex flex-col items-center justify-center py-32 px-4 space-y-5 text-center">
          <div className="text-4xl">⚖️</div>
          <p className="font-display text-xl text-foreground">No verdict on record.</p>
          <p className="font-body text-muted-foreground">The court has no file for you. Step inside.</p>
          <Link to="/Quiz">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Enter the Courtroom
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleShare = () => {
    const pct = verdictData.probability?.percent || 0;
    const job = inputData?.job_title || 'my job';
    const text = `⚖️🤖 THE ROBOT JUDGE HAS SPOKEN\n\nJob: ${job}\nObsolescence Risk: ${pct}%\n\n"${verdictData.verdict_paragraph?.slice(0, 120)}..."\n\nGet YOUR verdict → AI Guilty Verdict`;
    if (navigator.share) {
      navigator.share({ title: 'AI Guilty Verdict', text });
    } else {
      navigator.clipboard.writeText(text);
      toast({ title: 'Copied to clipboard!', description: 'Paste it anywhere to share your verdict.' });
    }
  };

  const pct = verdictData.probability?.percent || 0;
  const riskColor = pct >= 75 ? 'text-red-400' : pct >= 45 ? 'text-yellow-400' : 'text-green-400';

  return (
    <div className="min-h-screen bg-background">
      <CourtHeader />

      <main className="max-w-2xl mx-auto px-4 py-8 md:py-12">
        {/* Case badge */}
        {inputData && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-2 mb-8"
          >
            <span className="px-3 py-1.5 bg-secondary rounded-full text-xs font-mono text-muted-foreground border border-border">
              🏷 {inputData.job_title}
            </span>
            <span className="px-3 py-1.5 bg-secondary rounded-full text-xs font-mono text-muted-foreground border border-border">
              🏢 {inputData.industry}
            </span>
            <span className={`px-3 py-1.5 bg-secondary rounded-full text-xs font-mono border border-border ${riskColor}`}>
              ⚠️ {pct}% risk
            </span>
          </motion.div>
        )}

        <VerdictDisplay verdictData={verdictData} />

        {/* Survival Kit CTA — prominent */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-10 p-6 rounded-2xl border-2 border-primary/30 bg-primary/5 text-center space-y-4"
        >
          <div className="text-2xl">🛡️</div>
          <h3 className="font-display text-xl font-bold text-foreground">
            Want a Deeper Survival Kit?
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Upgrade to Pro for 4 fully personalised reskilling paths, specific EU/US income ranges, and a PDF report you can take to your next career conversation.
          </p>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-5 font-semibold">
            Get Full Survival Kit — €9
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <Button
            variant="outline"
            onClick={() => navigate('/Quiz')}
            className="flex-1 border-border text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Try Another Role
          </Button>
          <Button
            onClick={handleShare}
            className="flex-1 bg-secondary text-foreground hover:bg-secondary/80 border border-border"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share Verdict
          </Button>
        </div>

        <div className="text-center mt-10">
          <p className="font-mono text-xs text-muted-foreground/40">
            Case #{Date.now().toString(36).toUpperCase()} · The Robot Judge has spoken · Built in Europe
          </p>
        </div>
      </main>
    </div>
  );
}