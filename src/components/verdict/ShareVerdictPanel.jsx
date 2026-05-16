import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Copy, Check, Twitter, MessageCircle, Linkedin, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

export default function ShareVerdictPanel({ verdictData, inputData }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const pct = verdictData?.probability?.percent || 0;
  const job = inputData?.job_title || 'my job';
  const verdict = verdictData?.verdict_paragraph?.slice(0, 140) || '';

  const memeEmoji = pct >= 75 ? '🔴💀' : pct >= 45 ? '🟡😬' : '🟢😌';
  const verdict_label = pct >= 75 ? 'GUILTY — Highly Obsolete' : pct >= 45 ? 'SUSPENDED SENTENCE' : 'ACQUITTED — For Now';

  const shareText = `⚖️🤖 ROBOT JUDGE 2026 HAS SPOKEN

${memeEmoji} Job: ${job}
📊 Obsolescence Risk: ${pct}%
🏷 Verdict: ${verdict_label}

"${verdict}..."

👉 Get YOUR verdict → https://aiguiltyverdict.com`;

  const encodedText = encodeURIComponent(shareText);
  const shortText = encodeURIComponent(`⚖️ Robot Judge 2026 gave me ${pct}% obsolescence risk as ${job} ${memeEmoji}\n\nGet YOUR verdict 👇`);

  const networks = [
    {
      name: 'Twitter / X',
      icon: Twitter,
      color: 'hover:bg-[#1a1a2e] hover:border-[#1d9bf0]/40',
      iconColor: 'text-[#1d9bf0]',
      url: `https://twitter.com/intent/tweet?text=${shortText}&url=${encodeURIComponent('https://aiguiltyverdict.com')}`,
    },
    {
      name: 'Telegram',
      icon: Send,
      color: 'hover:bg-[#1a1a2e] hover:border-[#29a8eb]/40',
      iconColor: 'text-[#29a8eb]',
      url: `https://t.me/share/url?url=${encodeURIComponent('https://aiguiltyverdict.com')}&text=${encodedText}`,
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'hover:bg-[#1a1a2e] hover:border-[#25d366]/40',
      iconColor: 'text-[#25d366]',
      url: `https://wa.me/?text=${encodedText}`,
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'hover:bg-[#1a1a2e] hover:border-[#0a66c2]/40',
      iconColor: 'text-[#0a66c2]',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://aiguiltyverdict.com')}`,
    },
  ];

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareText);
    setCopied(true);
    toast({ title: 'Текст скопирован!', description: 'Вставьте в любую соцсеть.' });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({ title: 'AI Guilty Verdict', text: shareText, url: 'https://aiguiltyverdict.com' });
    } else {
      setOpen(v => !v);
    }
  };

  return (
    <div className="w-full">
      <Button
        onClick={handleNativeShare}
        className="w-full bg-secondary text-foreground hover:bg-secondary/80 border border-border"
      >
        <Share2 className="w-4 h-4 mr-2" />
        Поделиться вердиктом
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="mt-3 border border-border rounded-2xl bg-card p-5 space-y-4"
          >
            <p className="font-mono text-xs text-primary uppercase tracking-widest">Поделиться через</p>

            <div className="grid grid-cols-2 gap-2">
              {networks.map(net => (
                <a
                  key={net.name}
                  href={net.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border border-border bg-secondary/30 transition-all ${net.color}`}
                >
                  <net.icon className={`w-4 h-4 ${net.iconColor}`} />
                  <span className="text-sm text-foreground font-medium">{net.name}</span>
                </a>
              ))}
            </div>

            {/* Preview text */}
            <div className="rounded-xl bg-secondary/20 border border-border p-3 text-xs font-mono text-muted-foreground whitespace-pre-wrap leading-relaxed">
              {shareText.slice(0, 200)}…
            </div>

            <Button
              variant="outline"
              onClick={handleCopy}
              className="w-full border-border text-muted-foreground hover:text-foreground"
            >
              {copied
                ? <><Check className="w-4 h-4 mr-2 text-green-400" /> Скопировано!</>
                : <><Copy className="w-4 h-4 mr-2" /> Скопировать текст</>
              }
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}