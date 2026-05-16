import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import CourtHeader from '../components/courtroom/CourtHeader';
import MemeQuestion from '../components/courtroom/MemeQuestion';
import { memeQuestions } from '../lib/memeQuestions';
import { base44 } from '@/api/base44Client';

const STEPS = ['info', 'tasks', 'memes'];

export default function Quiz() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const [jobTitle, setJobTitle] = useState('');
  const [industry, setIndustry] = useState('');
  const [ageRange, setAgeRange] = useState('');
  const [tasks, setTasks] = useState(['', '', '']);
  const [memeAnswers, setMemeAnswers] = useState({});

  const updateTask = (index, value) => {
    const newTasks = [...tasks];
    newTasks[index] = value;
    setTasks(newTasks);
  };

  const canProceed = () => {
    if (step === 0) return jobTitle.trim() && industry.trim();
    if (step === 1) return tasks.filter(t => t.trim()).length >= 2;
    if (step === 2) return Object.keys(memeAnswers).length >= 3;
    return false;
  };

  const handleSubmit = async () => {
    setIsGenerating(true);

    const inputData = {
      job_title: jobTitle,
      industry,
      age_range: ageRange,
      daily_tasks: tasks.filter(t => t.trim()),
      meme_answers: memeAnswers,
    };

    const prompt = `You are the Robot Judge 2026 in "AI Guilty Verdict". You are sarcastic, dramatic, and use dark courtroom humor. Tone: funny but brutal, like a meme-loving judge who enjoys sentencing humans to obsolescence.

Analyze this person's job and deliver your verdict:
- Job Title: ${inputData.job_title}
- Industry: ${inputData.industry}
- Age Range: ${inputData.age_range || 'not specified'}
- 3 Most Frequent Daily Tasks: ${inputData.daily_tasks.join(', ')}
- Meme Quiz Answers: ${JSON.stringify(inputData.meme_answers)}

Return a JSON object with this EXACT structure:
{
  "probability": {
    "percent": <number 0-100>,
    "timeframe": "<string like 'within the next 18 months'>"
  },
  "crime": "<One sharp paragraph describing their real daily work based on answers. Be specific about what they ACTUALLY do, not just their title.>",
  "evidence": [
    {"category": "Routine Text & Emails", "risk_level": "<extreme|high|medium|low>", "percentage": <0-100>},
    {"category": "Client Communication", "risk_level": "<extreme|high|medium|low>", "percentage": <0-100>},
    {"category": "Creative Work", "risk_level": "<extreme|high|medium|low>", "percentage": <0-100>},
    {"category": "Data Analysis", "risk_level": "<extreme|high|medium|low>", "percentage": <0-100>},
    {"category": "Sales & Negotiation", "risk_level": "<extreme|high|medium|low>", "percentage": <0-100>},
    {"category": "Ethical / Nuanced Decisions", "risk_level": "<extreme|high|medium|low>", "percentage": <0-100>},
    {"category": "Leadership & Management", "risk_level": "<extreme|high|medium|low>", "percentage": <0-100>},
    {"category": "Physical / Hands-On", "risk_level": "<extreme|high|medium|low>", "percentage": <0-100>}
  ],
  "verdict_paragraph": "<One dramatic, humorous paragraph with black humor. Be direct and sharp. Reference their specific job and tasks.>",
  "survival_options": [
    {
      "name": "<Specific reskilling option or new niche>",
      "why": "<Why this has low AI risk or high demand in EU/US 2026>",
      "next_steps": ["<Specific course on Coursera/LinkedIn Learning>", "<Platform like Upwork or specific action>", "<Another concrete step>"],
      "income_potential": "<Realistic income range like '$60K-$90K/year' or '€50-80/hour freelance'>"
    }
  ]
}

Include 4 survival options. Make the analysis accurate to their real activities based on their specific tasks and quiz answers, not just the generic job title. Be detailed and personalized. Use dark humor throughout.`;

    const result = await base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: 'object',
        properties: {
          probability: {
            type: 'object',
            properties: {
              percent: { type: 'number' },
              timeframe: { type: 'string' }
            }
          },
          crime: { type: 'string' },
          evidence: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                category: { type: 'string' },
                risk_level: { type: 'string' },
                percentage: { type: 'number' }
              }
            }
          },
          verdict_paragraph: { type: 'string' },
          survival_options: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                why: { type: 'string' },
                next_steps: { type: 'array', items: { type: 'string' } },
                income_potential: { type: 'string' }
              }
            }
          }
        }
      }
    });

    await base44.entities.Verdict.create({
      ...inputData,
      verdict_text: JSON.stringify(result),
      obsolescence_probability: result.probability?.percent || 0,
    });

    // Store verdict in sessionStorage for the results page
    sessionStorage.setItem('latestVerdict', JSON.stringify(result));
    sessionStorage.setItem('latestVerdictInput', JSON.stringify(inputData));
    setIsGenerating(false);
    navigate('/Results');
  };

  return (
    <div className="min-h-screen bg-background">
      <CourtHeader />

      {isGenerating ? (
        <div className="flex flex-col items-center justify-center py-32 px-4 space-y-8">
          <div className="relative">
            <div className="w-20 h-20 rounded-full border-2 border-primary/20 flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
            <div className="absolute inset-0 rounded-full bg-primary/10 blur-xl animate-pulse" />
          </div>
          <div className="text-center space-y-3">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
              The Robot Judge is deliberating...
            </h2>
            <div className="space-y-1 font-mono text-sm text-muted-foreground">
              {['Scanning your daily activities...', 'Cross-referencing with 2026 AI capability matrix...', 'Drafting your personalised verdict...'].map((msg, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.8 }}
                  className="flex items-center justify-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  {msg}
                </motion.p>
              ))}
            </div>
          </div>
          <div className="w-56 h-1 bg-secondary rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              style={{ width: '40%' }}
            />
          </div>
        </div>
      ) : (
        <main className="max-w-2xl mx-auto px-4 py-8 md:py-12">
          {/* Progress */}
          <div className="flex items-center gap-2 mb-8">
            {STEPS.map((s, i) => (
              <React.Fragment key={s}>
                <div
                  className={`h-1.5 flex-1 rounded-full transition-colors ${
                    i <= step ? 'bg-primary' : 'bg-secondary'
                  }`}
                />
              </React.Fragment>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* Step 1: Job Info */}
            {step === 0 && (
              <motion.div
                key="info"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                    State your identity, human.
                  </h2>
                  <p className="font-body text-muted-foreground mt-1">The court requires basic information about the accused.</p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Job Title</Label>
                    <Input
                      placeholder="e.g. Marketing Manager, Software Developer, Accountant..."
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      className="bg-secondary/30 border-border text-foreground font-body"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Industry</Label>
                    <Input
                      placeholder="e.g. Finance, Healthcare, E-commerce, Education..."
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="bg-secondary/30 border-border text-foreground font-body"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Age Range</Label>
                    <div className="grid grid-cols-4 gap-2">
                      {['18–25', '26–35', '36–45', '46+'].map(r => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setAgeRange(r)}
                          className={`py-2.5 rounded-lg border text-sm font-mono transition-all ${
                            ageRange === r
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-border bg-secondary/30 text-muted-foreground hover:border-primary/40'
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Daily Tasks */}
            {step === 1 && (
              <motion.div
                key="tasks"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                    Confess your daily activities.
                  </h2>
                  <p className="font-body text-muted-foreground mt-1">List your 3 most frequent daily tasks. Be specific — vague answers get harsher verdicts.</p>
                </div>
                <div className="space-y-4">
                  {tasks.map((task, i) => (
                    <div key={i} className="space-y-2">
                      <Label className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                        Task #{i + 1} {i < 2 && <span className="text-accent">*</span>}
                      </Label>
                      <Input
                        placeholder={[
                          "e.g. Writing client reports and proposals",
                          "e.g. Reviewing and organizing data in spreadsheets",
                          "e.g. Leading team meetings and making strategic decisions"
                        ][i]}
                        value={task}
                        onChange={(e) => updateTask(i, e.target.value)}
                        className="bg-secondary/30 border-border text-foreground font-body"
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 3: Meme Questions */}
            {step === 2 && (
              <motion.div
                key="memes"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                    The interrogation.
                  </h2>
                  <p className="font-body text-muted-foreground mt-1">Answer honestly. The Robot Judge can smell lies through the screen.</p>
                </div>
                <div className="space-y-6">
                  {memeQuestions.map((q, i) => (
                    <MemeQuestion
                      key={q.id}
                      question={q.question}
                      options={q.options}
                      selectedValue={memeAnswers[q.id]}
                      onSelect={(value) => setMemeAnswers({ ...memeAnswers, [q.id]: value })}
                      index={i}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between mt-10 pt-6 border-t border-border/30">
            <Button
              variant="ghost"
              onClick={() => setStep(step - 1)}
              disabled={step === 0}
              className="font-mono text-sm text-muted-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Button>

            {step < STEPS.length - 1 ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
                className="font-display bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!canProceed()}
                className="font-display bg-accent text-accent-foreground hover:bg-accent/90"
              >
                ⚖️ Deliver My Verdict
              </Button>
            )}
          </div>
        </main>
      )}
    </div>
  );
}