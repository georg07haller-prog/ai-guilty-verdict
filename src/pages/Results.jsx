import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RotateCcw, Share2 } from 'lucide-react';
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
    if (stored) {
      setVerdictData(JSON.parse(stored));
    }
    if (storedInput) {
      setInputData(JSON.parse(storedInput));
    }
  }, []);

  if (!verdictData) {
    return (
      <div className="min-h-screen bg-background">
        <CourtHeader />
        <div className="flex flex-col items-center justify-center py-32 px-4 space-y-4">
          <p className="font-display text-xl text-foreground">No verdict found.</p>
          <p className="font-body text-muted-foreground">The court has no record of your case.</p>
          <Link to="/Quiz">
            <Button className="font-display bg-primary text-primary-foreground">
              Enter the Courtroom
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleShare = () => {
    const text = `⚖️🤖 AI GUILTY VERDICT\n\nJob: ${inputData?.job_title || 'Unknown'}\nObsolescence Risk: ${verdictData.probability?.percent || 0}%\n\nGet YOUR verdict at AI Guilty Verdict!`;
    if (navigator.share) {
      navigator.share({ title: 'AI Guilty Verdict', text });
    } else {
      navigator.clipboard.writeText(text);
      toast({ title: 'Copied to clipboard!', description: 'Share your verdict with the world.' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <CourtHeader />

      <main className="max-w-2xl mx-auto px-4 py-8 md:py-12">
        {/* Case info bar */}
        {inputData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-wrap gap-2 mb-8 font-mono text-xs text-muted-foreground"
          >
            <span className="px-3 py-1 bg-secondary rounded-full">🏷 {inputData.job_title}</span>
            <span className="px-3 py-1 bg-secondary rounded-full">🏢 {inputData.industry}</span>
          </motion.div>
        )}

        <VerdictDisplay verdictData={verdictData} />

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 mt-10 pt-6 border-t border-border/30">
          <Button
            variant="outline"
            onClick={() => navigate('/Quiz')}
            className="flex-1 font-mono text-sm border-border text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Try Another Job
          </Button>
          <Button
            onClick={handleShare}
            className="flex-1 font-display bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share Your Verdict
          </Button>
        </div>

        <div className="text-center mt-10">
          <p className="font-mono text-xs text-muted-foreground/40">
            Case #{Date.now().toString(36).toUpperCase()} • The Robot Judge has spoken.
          </p>
        </div>
      </main>
    </div>
  );
}