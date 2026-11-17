import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { Download, Loader2 } from 'lucide-react';

// The share card is rendered as a PNG, so colours are literal here on purpose.
const COLORS = {
  bg: '#070a13',
  surface: '#0c111d',
  border: '#1b2232',
  text: '#f1f5f9',
  muted: '#7588a3',
  blue: '#1f8fff',
};

export default function VerdictShareCard({ verdictData, inputData }) {
  const cardRef = useRef(null);
  const [saving, setSaving] = useState(false);

  const pct = verdictData?.probability?.percent || 0;
  const riskColor = pct >= 75 ? '#f87171' : pct >= 45 ? '#facc15' : '#4ade80';
  const label = pct >= 75 ? 'GUILTY — HIGHLY OBSOLETE' : pct >= 45 ? 'SUSPENDED SENTENCE' : 'ACQUITTED — FOR NOW';
  const quote = (verdictData?.verdict_paragraph || '').replace(/[*#]/g, '').slice(0, 240);

  const handleSave = async () => {
    if (!cardRef.current) return;
    setSaving(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: COLORS.bg,
        scale: 2,
        logging: false,
        useCORS: true,
      });
      const link = document.createElement('a');
      link.download = `ai-guilty-verdict-${pct}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <button
        onClick={handleSave}
        disabled={saving}
        className="flex w-full items-center justify-center gap-2 rounded-md border border-border px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
      >
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
        {saving ? 'Готовим картинку…' : 'Скачать картинку'}
      </button>

      <div style={{ position: 'fixed', left: '-10000px', top: 0, pointerEvents: 'none' }} aria-hidden="true">
        <div
          ref={cardRef}
          style={{
            width: '1080px',
            height: '1350px',
            boxSizing: 'border-box',
            padding: '80px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: COLORS.bg,
            backgroundImage: 'radial-gradient(circle at 85% 0%, rgba(31,143,255,0.20), transparent 55%)',
            color: COLORS.text,
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '18px',
                  border: `1px solid ${COLORS.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '30px',
                }}
              >
                ⚖️
              </div>
              <div
                style={{
                  fontSize: '20px',
                  letterSpacing: '5px',
                  textTransform: 'uppercase',
                  color: COLORS.blue,
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                AI Guilty Verdict
              </div>
            </div>

            <div style={{ marginTop: '60px' }}>
              <div
                style={{
                  fontSize: '20px',
                  letterSpacing: '6px',
                  textTransform: 'uppercase',
                  color: COLORS.muted,
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                Case file
              </div>
              <div
                style={{
                  marginTop: '12px',
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '74px',
                  fontWeight: 900,
                  lineHeight: 1.05,
                }}
              >
                {inputData?.job_title || 'Anonymous Defendant'}
              </div>
              <div style={{ marginTop: '14px', fontSize: '28px', color: COLORS.muted }}>
                {inputData?.industry || 'Industry withheld'}
              </div>
            </div>

            <div style={{ marginTop: '44px', display: 'flex', alignItems: 'flex-end', gap: '26px' }}>
              <div
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '210px',
                  fontWeight: 900,
                  lineHeight: 0.9,
                  color: riskColor,
                }}
              >
                {pct}%
              </div>
              <div style={{ paddingBottom: '26px', maxWidth: '400px' }}>
                <div
                  style={{
                    fontSize: '18px',
                    letterSpacing: '3px',
                    textTransform: 'uppercase',
                    color: COLORS.muted,
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  Probability of obsolescence
                </div>
                <div style={{ marginTop: '10px', fontSize: '22px' }}>
                  {verdictData?.probability?.timeframe || 'within the next 18 months'}
                </div>
                <div
                  style={{
                    marginTop: '18px',
                    display: 'inline-block',
                    padding: '10px 18px',
                    borderRadius: '999px',
                    border: `1px solid ${riskColor}`,
                    color: riskColor,
                    fontSize: '17px',
                    letterSpacing: '2px',
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  {label}
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: '40px',
                padding: '36px',
                backgroundColor: COLORS.surface,
                border: `1px solid ${COLORS.border}`,
                borderRadius: '28px',
                fontSize: '29px',
                lineHeight: 1.45,
                color: '#dbe4f0',
              }}
            >
              “{quote}…”
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: `1px solid ${COLORS.border}`,
              paddingTop: '28px',
              fontSize: '20px',
              letterSpacing: '2px',
              color: COLORS.muted,
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            <span>ROBOT JUDGE 2026</span>
            <span>{window.location.host}</span>
          </div>
        </div>
      </div>
    </>
  );
}