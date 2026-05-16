import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { jsPDF } from 'jspdf';

export default function DownloadVerdictPDF({ verdictData, inputData }) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    if (!verdictData) return;
    setLoading(true);

    try {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const W = 210;
      const pct = verdictData.probability?.percent || 0;
      const job = inputData?.job_title || '—';
      const industry = inputData?.industry || '—';
      const timeframe = verdictData.probability?.timeframe || '';

      // ── Background ──
      doc.setFillColor(8, 12, 28);
      doc.rect(0, 0, W, 297, 'F');

      // ── Header stripe ──
      doc.setFillColor(18, 24, 50);
      doc.rect(0, 0, W, 52, 'F');

      // ── Top accent line ──
      doc.setDrawColor(30, 120, 255);
      doc.setLineWidth(1);
      doc.line(0, 0, W, 0);

      // ── Logo / title ──
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(30, 120, 255);
      doc.text('⚖  AI GUILTY VERDICT', 15, 14);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(100, 120, 160);
      doc.text('ROBOT JUDGE 2026 · OFFICIAL VERDICT DOCUMENT', 15, 20);

      // ── Case info ──
      const caseId = Date.now().toString(36).toUpperCase();
      doc.setFontSize(7);
      doc.setTextColor(80, 100, 140);
      doc.text(`CASE #${caseId}`, W - 15, 14, { align: 'right' });
      doc.text(new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }), W - 15, 20, { align: 'right' });

      // ── GUILTY stamp ──
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(34);
      doc.setTextColor(220, 50, 50);
      doc.text('GUILTY', W / 2, 44, { align: 'center' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(150, 60, 60);
      doc.text('AS CHARGED', W / 2, 51, { align: 'center' });

      // ── Divider ──
      doc.setDrawColor(30, 40, 80);
      doc.setLineWidth(0.4);
      doc.line(15, 56, W - 15, 56);

      // ── Defendant block ──
      let y = 65;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 120, 160);
      doc.text('DEFENDANT', 15, y);
      doc.text('INDUSTRY', W / 2, y);

      y += 5;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(220, 230, 255);
      doc.text(job, 15, y);
      doc.text(industry, W / 2, y);

      // ── Risk score box ──
      y += 12;
      const riskBgR = pct >= 75 ? 80 : pct >= 45 ? 80 : 20;
      const riskBgG = pct >= 75 ? 20 : pct >= 45 ? 60 : 80;
      const riskBgB = pct >= 75 ? 20 : pct >= 45 ? 10 : 40;
      doc.setFillColor(riskBgR, riskBgG, riskBgB);
      doc.roundedRect(15, y, W - 30, 30, 3, 3, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(200, 200, 220);
      doc.text('OBSOLESCENCE RISK SCORE', W / 2, y + 8, { align: 'center' });

      const riskR = pct >= 75 ? 255 : pct >= 45 ? 255 : 80;
      const riskG = pct >= 75 ? 80 : pct >= 45 ? 200 : 220;
      const riskB = pct >= 75 ? 80 : pct >= 45 ? 50 : 120;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(28);
      doc.setTextColor(riskR, riskG, riskB);
      doc.text(`${pct}%`, W / 2, y + 22, { align: 'center' });

      if (timeframe) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(160, 170, 200);
        doc.text(timeframe, W / 2, y + 29, { align: 'center' });
      }

      y += 37;
      doc.setDrawColor(30, 40, 80);
      doc.line(15, y, W - 15, y);

      // ── The Crime ──
      y += 8;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(30, 120, 255);
      doc.text('THE CRIME', 15, y);

      y += 5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(180, 190, 220);
      const crimeText = (verdictData.crime || '').replace(/[*#_`]/g, '');
      const crimeLines = doc.splitTextToSize(crimeText, W - 30);
      const crimeSlice = crimeLines.slice(0, 5);
      doc.text(crimeSlice, 15, y);
      y += crimeSlice.length * 5 + 5;

      // ── Evidence ──
      if (verdictData.evidence && verdictData.evidence.length > 0) {
        doc.setDrawColor(30, 40, 80);
        doc.line(15, y, W - 15, y);
        y += 8;

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(30, 120, 255);
        doc.text('EVIDENCE BREAKDOWN', 15, y);
        y += 5;

        for (const item of verdictData.evidence.slice(0, 5)) {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(7.5);
          doc.setTextColor(160, 170, 200);
          doc.text(`${item.category || ''}`, 15, y);

          const barW = W - 80;
          const barX = 80;
          doc.setFillColor(25, 35, 65);
          doc.roundedRect(barX, y - 3.5, barW, 5, 1, 1, 'F');

          const fillPct = Math.min(item.percentage || 0, 100) / 100;
          const fillR = (item.percentage || 0) >= 75 ? 220 : (item.percentage || 0) >= 45 ? 220 : 50;
          const fillG = (item.percentage || 0) >= 75 ? 60 : (item.percentage || 0) >= 45 ? 160 : 200;
          const fillB = (item.percentage || 0) >= 75 ? 60 : (item.percentage || 0) >= 45 ? 30 : 100;
          doc.setFillColor(fillR, fillG, fillB);
          doc.roundedRect(barX, y - 3.5, barW * fillPct, 5, 1, 1, 'F');

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(7);
          doc.setTextColor(220, 230, 255);
          doc.text(`${item.percentage || 0}%`, W - 13, y, { align: 'right' });

          y += 7;
        }
        y += 2;
      }

      // ── Verdict paragraph ──
      doc.setDrawColor(30, 40, 80);
      doc.line(15, y, W - 15, y);
      y += 8;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(30, 120, 255);
      doc.text('THE VERDICT', 15, y);

      y += 5;
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8.5);
      doc.setTextColor(200, 210, 240);
      const verdictText = (verdictData.verdict_paragraph || '').replace(/[*#_`]/g, '');
      const verdictLines = doc.splitTextToSize(verdictText, W - 30);
      const verdictSlice = verdictLines.slice(0, 7);
      doc.text(verdictSlice, 15, y);
      y += verdictSlice.length * 5;

      // ── Survival options ──
      if (verdictData.survival_options && verdictData.survival_options.length > 0) {
        y += 5;
        doc.setDrawColor(30, 40, 80);
        doc.line(15, y, W - 15, y);
        y += 8;

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(30, 120, 255);
        doc.text('🛡  SURVIVAL KIT — APPEAL OPTIONS', 15, y);
        y += 5;

        for (const [i, opt] of verdictData.survival_options.slice(0, 3).entries()) {
          doc.setFillColor(18, 24, 50);
          const boxH = 10;
          doc.roundedRect(15, y, W - 30, boxH, 2, 2, 'F');

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(7.5);
          doc.setTextColor(30, 120, 255);
          doc.text(`${i + 1}.`, 19, y + 6.5);

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(7.5);
          doc.setTextColor(220, 230, 255);
          doc.text(opt.name || '', 25, y + 6.5);

          if (opt.description) {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(6.5);
            doc.setTextColor(120, 140, 180);
            const desc = doc.splitTextToSize(opt.description, W - 60);
            doc.text(desc[0] || '', 25, y + 11);
          }

          y += 14;
        }
      }

      // ── Footer ──
      doc.setFillColor(12, 16, 36);
      doc.rect(0, 285, W, 12, 'F');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(60, 80, 120);
      doc.text('aiguiltyverdict.com  ·  MadProfessor Laboratory  ·  Built in Europe  ·  All verdicts are final', W / 2, 292, { align: 'center' });

      doc.save(`verdict-${job.toLowerCase().replace(/\s+/g, '-')}-${caseId}.pdf`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={loading}
      variant="outline"
      className="flex-1 border-border text-muted-foreground hover:text-foreground"
    >
      <Download className="w-4 h-4 mr-2" />
      {loading ? 'Создаём PDF...' : 'Скачать вердикт (PDF)'}
    </Button>
  );
}