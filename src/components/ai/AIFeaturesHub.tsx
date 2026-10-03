import React, { useState, useEffect } from 'react';
import {
  Bot,
  BrainCircuit,
  FileQuestion,
  Image as ImageIcon,
  Send,
  Sparkles,
  RotateCcw,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Languages,
  Zap,
  Cpu,
} from 'lucide-react';

export const AIFeaturesHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'doubt' | 'drawing' | 'viva' | 'interview'>('doubt');
  const [copied, setCopied] = useState(false);

  // Doubt Solver State
  const [doubtSubject, setDoubtSubject] = useState('RCC & Concrete Technology');
  const [doubtQuestion, setDoubtQuestion] = useState('');
  const [doubtLanguage, setDoubtLanguage] = useState<'English' | 'Hindi / Hinglish'>('Hindi / Hinglish');
  const [doubtProvider, setDoubtProvider] = useState<'chatgpt' | 'gemini' | 'auto'>('chatgpt');
  const [doubtAnswer, setDoubtAnswer] = useState<string | null>(null);
  const [doubtSource, setDoubtSource] = useState<string | null>(null);
  const [doubtLoading, setDoubtLoading] = useState(false);
  const [doubtError, setDoubtError] = useState<string | null>(null);
  const [chatgptConfigured, setChatgptConfigured] = useState<boolean | null>(null);

  // Check health on mount to detect ChatGPT / Gemini connection status
  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.chatgptConfigured === 'boolean') {
          setChatgptConfigured(data.chatgptConfigured);
        }
      })
      .catch(() => {});
  }, []);

  // Drawing Explain State
  const [drawingType, setDrawingType] = useState('Structural RCC Framing & Beam Detailing');
  const [drawingDesc, setDrawingDesc] = useState('');
  const [drawingResult, setDrawingResult] = useState<string | null>(null);
  const [drawingLoading, setDrawingLoading] = useState(false);

  // Viva Generator State
  const [vivaSubject, setVivaSubject] = useState('Concrete Technology & Testing Lab');
  const [vivaLabExp, setVivaLabExp] = useState('Slump Test & Compaction Factor Test (Workability)');
  const [vivaResult, setVivaResult] = useState<string | null>(null);
  const [vivaLoading, setVivaLoading] = useState(false);

  // Interview Prep State
  const [interviewRole, setInterviewRole] = useState('SSC JE / CPWD Civil Engineer');
  const [interviewExp, setInterviewExp] = useState('Fresher / 0-2 Years');
  const [interviewResult, setInterviewResult] = useState<string | null>(null);
  const [interviewLoading, setInterviewLoading] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Submit Doubt
  const submitDoubt = async (q?: string) => {
    const questionToSend = q || doubtQuestion;
    if (!questionToSend.trim()) return;
    setDoubtLoading(true);
    setDoubtError(null);
    try {
      const res = await fetch('/api/ai/doubt-solver', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: questionToSend,
          subject: doubtSubject,
          language: doubtLanguage,
          provider: doubtProvider,
        }),
      });
      const data = await res.json();
      if (data.answer || data.solution) {
        setDoubtAnswer(data.answer || data.solution);
        setDoubtSource(data.source || (doubtProvider === 'chatgpt' ? 'ChatGPT (GPT-4o)' : 'Gemini'));
      } else {
        const rawErr = data.error || '';
        if (typeof rawErr === 'string' && (rawErr.includes('503') || rawErr.includes('high demand') || rawErr.includes('UNAVAILABLE'))) {
          setDoubtError('AI model is currently experiencing high demand. Automatic backup retry triggered, please click "Retry" below if needed.');
        } else {
          setDoubtError(data.error || 'Failed to get answer from AI server. Please try again.');
        }
      }
    } catch {
      setDoubtError('Failed to reach AI server. Please check connection and try again.');
    } finally {
      setDoubtLoading(false);
    }
  };

  // Submit Drawing
  const submitDrawingExplain = async (desc?: string) => {
    const textToSend = desc || drawingDesc;
    if (!textToSend.trim()) return;
    setDrawingLoading(true);
    try {
      const res = await fetch('/api/ai/drawing-explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planDescription: textToSend,
          drawingType,
        }),
      });
      const data = await res.json();
      setDrawingResult(data.explanation || data.answer || data.solution || 'No explanation generated.');
    } catch {
      setDrawingResult('Failed to analyze drawing plan. Please retry.');
    } finally {
      setDrawingLoading(false);
    }
  };

  // Submit Viva
  const submitViva = async () => {
    setVivaLoading(true);
    try {
      const res = await fetch('/api/ai/viva-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: vivaSubject,
          labExperiment: vivaLabExp,
          academicLevel: 'Diploma & B.Tech Final Year',
        }),
      });
      const data = await res.json();
      if (data.vivaQuestions) {
        setVivaResult(data.vivaQuestions);
      } else if (Array.isArray(data.questions) && data.questions.length > 0) {
        const formatted = data.questions.map((q: any, i: number) => 
          `### Q${i + 1}: ${q.q}\n**Answer:** ${q.a}\n*Reference:* \`${q.code || 'IS Standard'}\`\n`
        ).join('\n---\n\n');
        setVivaResult(formatted);
      } else {
        setVivaResult(data.answer || 'No viva questions received.');
      }
    } catch {
      setVivaResult('Error generating viva questions. Please check connection.');
    } finally {
      setVivaLoading(false);
    }
  };

  // Submit Interview
  const submitInterview = async () => {
    setInterviewLoading(true);
    try {
      const res = await fetch('/api/ai/interview-prep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetRole: interviewRole,
          experienceLevel: interviewExp,
          subjectFocus: 'Site Execution, Quality Control & Codal Standards',
        }),
      });
      const data = await res.json();
      if (data.interviewPrep) {
        setInterviewResult(data.interviewPrep);
      } else if (data.interviewGuide) {
        const g = data.interviewGuide;
        const formatted = `### 🎯 Civil Engineering Interview Guide: ${g.role || interviewRole}\n\n` +
          (g.keySkillsToHighlight ? `#### 🔑 Key Competencies to Highlight:\n${g.keySkillsToHighlight.map((s: string) => `- ${s}`).join('\n')}\n\n---\n\n` : '') +
          (Array.isArray(g.mockQuestions) ? g.mockQuestions.map((q: any, i: number) => `**[${q.round || 'Technical'}] Q${i + 1}: ${q.question}**\n*Model Answer:* ${q.answer}\n`).join('\n') : '');
        setInterviewResult(formatted);
      } else {
        setInterviewResult(data.answer || 'No interview guide received.');
      }
    } catch {
      setInterviewResult('Error generating interview guide.');
    } finally {
      setInterviewLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Unlimited Access Banner */}
      <div className="p-4 rounded-3xl bg-linear-to-r from-amber-500/10 via-emerald-500/10 to-blue-500/10 border border-emerald-500/20 dark:border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black shrink-0 shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-black text-slate-900 dark:text-white">
                All AI Features 100% Free & Unlimited
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500 text-slate-950 uppercase tracking-wider">
                Active
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              कोई सीमा नहीं (Zero Limits) — असीमित डाउट्स, ड्रॉइंग विश्लेषण, वाइवा और इंटरव्यू प्रश्न कभी भी पूछें।
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>असीमित प्रश्न (Unlimited)</span>
          </span>
          <span className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
            <Bot className="w-3.5 h-3.5 text-emerald-500" />
            <span>ChatGPT 4o & Gemini</span>
          </span>
        </div>
      </div>

      {/* Subtab Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {[
          { id: 'doubt', label: 'AI Doubt Solver', hindi: 'डाउट सॉल्वर', icon: BrainCircuit },
          { id: 'drawing', label: 'Drawing / Plan Explain', hindi: 'ड्राइंग एवं प्लान व्याख्या', icon: ImageIcon },
          { id: 'viva', label: 'Viva Generator', hindi: 'वाइवा प्रश्नोत्तरी', icon: FileQuestion },
          { id: 'interview', label: 'Interview Preparation', hindi: 'साक्षात्कार तैयारी', icon: Bot },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                isActive
                  ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-amber-500/40'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className={`p-1.5 rounded-xl ${isActive ? 'bg-slate-950/15' : 'bg-slate-100 dark:bg-slate-800 text-amber-500'}`}>
                  <Icon className="w-4 h-4" />
                </span>
                <span className="text-xs font-black">{tab.label}</span>
              </div>
              <div className={`text-[10px] mt-2 ${isActive ? 'text-slate-900/80 font-bold' : 'text-slate-400'}`}>
                {tab.hindi}
              </div>
            </button>
          );
        })}
      </div>

      {/* ================= 1. AI DOUBT SOLVER ================= */}
      {activeTab === 'doubt' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center space-x-2">
                  <span className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    <BrainCircuit className="w-5 h-5" />
                  </span>
                  <span>Civil Engineering AI Doubt Solver</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Ask any technical doubt, numerical steps, or IS Codal clause in English, Hindi, or Hinglish.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* ChatGPT Connection Status */}
                <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>ChatGPT Connected</span>
                </div>

                {/* Language toggle */}
                <div className="flex items-center space-x-1 text-xs font-bold">
                  <Languages className="w-4 h-4 text-amber-500 shrink-0" />
                  <select
                    value={doubtLanguage}
                    onChange={(e) => setDoubtLanguage(e.target.value as any)}
                    className="px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
                  >
                    <option value="Hindi / Hinglish">Hindi + English (आसान भाषा)</option>
                    <option value="English">English</option>
                  </select>
                </div>
              </div>
            </div>

            {/* AI Engine Selector */}
            <div className="mb-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center space-x-1">
                  <Cpu className="w-3.5 h-3.5 text-amber-500" />
                  <span>AI Engine / मॉडल:</span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium">Select your preferred AI engine</span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setDoubtProvider('chatgpt')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                    doubtProvider === 'chatgpt'
                      ? 'bg-emerald-500 text-slate-950 shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-emerald-400'
                  }`}
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>ChatGPT (OpenAI GPT-4o)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDoubtProvider('gemini')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                    doubtProvider === 'gemini'
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-amber-400'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Google Gemini</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDoubtProvider('auto')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                    doubtProvider === 'auto'
                      ? 'bg-purple-500 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-purple-400'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Auto Dual-Engine</span>
                </button>
              </div>
            </div>

            {/* Quick Preset Questions */}
            <div className="flex flex-wrap gap-2 mb-4">
              {[
                'Why is minimum shear reinforcement provided in beams per IS 456?',
                'Explain difference between Compaction and Consolidation of soil.',
                'What is Bulking of Sand and how does it affect concrete batching?',
                'Derive relation between Bending Moment and Shear Force (dM/dx = V).',
              ].map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setDoubtQuestion(chip);
                    submitDoubt(chip);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 hover:border-amber-500 text-[11px] font-semibold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer text-left"
                >
                  💡 {chip}
                </button>
              ))}
            </div>

            {/* Question Input */}
            <div className="relative">
              <textarea
                rows={3}
                placeholder="Type your Civil Engineering question here... (e.g. How to calculate development length Ld in Fe500?)"
                value={doubtQuestion}
                onChange={(e) => setDoubtQuestion(e.target.value)}
                className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500 resize-none font-medium"
              />
              <div className="mt-3 flex items-center justify-between">
                <select
                  value={doubtSubject}
                  onChange={(e) => setDoubtSubject(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
                >
                  <option value="RCC & Concrete Technology">RCC & Concrete Technology</option>
                  <option value="Soil Mechanics & Foundation">Soil Mechanics & Foundation</option>
                  <option value="Surveying & Geomatics">Surveying & Geomatics</option>
                  <option value="Fluid Mechanics & Hydraulics">Fluid Mechanics & Hydraulics</option>
                  <option value="Strength of Materials (SOM)">Strength of Materials (SOM)</option>
                  <option value="Highway & Transportation">Highway & Transportation</option>
                  <option value="Estimation & Costing">Estimation & Costing</option>
                </select>

                <button
                  type="button"
                  onClick={() => submitDoubt()}
                  disabled={doubtLoading || !doubtQuestion.trim()}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs flex items-center space-x-1.5 cursor-pointer disabled:opacity-50 transition-colors shadow-sm"
                >
                  {doubtLoading ? (
                    <span>Solving...</span>
                  ) : (
                    <>
                      <span>Ask AI Solver</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>

            {doubtError && (
              <div className="mt-4 p-3 rounded-xl bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 text-xs flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{doubtError}</span>
                </div>
                <button
                  type="button"
                  onClick={() => submitDoubt()}
                  className="ml-3 px-3 py-1 rounded-lg bg-rose-200 dark:bg-rose-900/60 hover:bg-rose-300 dark:hover:bg-rose-800 text-rose-900 dark:text-rose-100 font-bold flex items-center space-x-1 cursor-pointer transition-colors shrink-0"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Retry</span>
                </button>
              </div>
            )}

            {/* Answer Display */}
            {doubtAnswer && (
              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center space-x-1.5">
                      <Sparkles className="w-4 h-4" />
                      <span>Deep Help AI Solution</span>
                    </div>

                    {/* Source Attribution Badge */}
                    {doubtSource && (
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-black flex items-center space-x-1 ${
                          doubtSource.toLowerCase().includes('chatgpt')
                            ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                            : doubtSource.toLowerCase().includes('gemini')
                            ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                            : 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30'
                        }`}
                      >
                        {doubtSource.toLowerCase().includes('chatgpt') ? (
                          <>
                            <Bot className="w-3 h-3" />
                            <span>Powered by {doubtSource}</span>
                          </>
                        ) : doubtSource.toLowerCase().includes('gemini') ? (
                          <>
                            <Zap className="w-3 h-3" />
                            <span>Powered by {doubtSource}</span>
                          </>
                        ) : (
                          <>
                            <BookOpen className="w-3 h-3" />
                            <span>Powered by {doubtSource}</span>
                          </>
                        )}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setDoubtAnswer(null)}
                      className="px-2.5 py-1 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold cursor-pointer transition-colors"
                    >
                      Clear
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopy(doubtAnswer)}
                      className="p-1.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer flex items-center space-x-1.5 text-xs font-bold transition-colors"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy Solution'}</span>
                    </button>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed font-sans shadow-xs">
                  {doubtAnswer}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= 2. DRAWING / PLAN EXPLANATION ================= */}
      {activeTab === 'drawing' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center space-x-2">
              <span className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <ImageIcon className="w-5 h-5" />
              </span>
              <span>Civil Drawing & Architectural Plan Explanation</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Decode structural reinforcement schedules, 2BHK/3BHK building layouts, setbacks, and NBC guidelines.
            </p>

            {/* Presets */}
            <div className="mt-4 flex flex-wrap gap-2">
              {[
                {
                  label: '30 × 40 ft 2BHK Plan',
                  text: 'Plot size 30ft width by 40ft depth north facing. Requires 2 bedrooms, hall, kitchen in southeast (Agni kon), staircase external, toilet away from kitchen, front 5ft setback.',
                },
                {
                  label: 'RCC Beam Longitudinal Section',
                  text: 'Beam span 5m, size 250x450mm. Top bars 2-12mm hanger, Bottom bars 3-16mm main bars (1 curtailed at L/7 from support). Stirrups 8mm 2-legged @ 100mm near supports and 150mm at midspan.',
                },
                {
                  label: 'Septic Tank 10 Users',
                  text: 'Septic tank length 2.2m, width 0.9m, liquid depth 1.4m with 0.3m freeboard, inlet and outlet tee pipes, inspection manhole and 50mm vent pipe with mosquito cowl.',
                },
              ].map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setDrawingDesc(p.text);
                    submitDrawingExplain(p.text);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 hover:border-amber-500 text-[11px] font-semibold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                >
                  📐 {p.label}
                </button>
              ))}
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Drawing Category</label>
                <select
                  value={drawingType}
                  onChange={(e) => setDrawingType(e.target.value)}
                  className="w-full sm:w-80 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
                >
                  <option value="Structural RCC Framing & Beam Detailing">Structural RCC Framing & Beam Detailing</option>
                  <option value="Architectural Residential Floor Plan">Architectural Residential Floor Plan</option>
                  <option value="Bar Bending Schedule (BBS)">Bar Bending Schedule (BBS)</option>
                  <option value="Sanitary & Plumbing Layout">Sanitary & Plumbing Layout</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Plan / Drawing Description</label>
                <textarea
                  rows={4}
                  value={drawingDesc}
                  onChange={(e) => setDrawingDesc(e.target.value)}
                  placeholder="Paste or describe drawing notes, dimensions, rebar arrangement, or floor dimensions..."
                  className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500 resize-none font-medium"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => submitDrawingExplain()}
                  disabled={drawingLoading || !drawingDesc.trim()}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs flex items-center space-x-1.5 cursor-pointer disabled:opacity-50 transition-colors"
                >
                  {drawingLoading ? <span>Analyzing Drawing...</span> : <span>Explain Drawing</span>}
                </button>
              </div>
            </div>

            {drawingResult && (
              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {drawingResult}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= 3. VIVA QUESTIONS GENERATOR ================= */}
      {activeTab === 'viva' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center space-x-2">
              <span className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <FileQuestion className="w-5 h-5" />
              </span>
              <span>Civil Engineering Lab Viva Questions Generator</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Generates expected practical examiner viva-voce questions with model answers and standard codal limits.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Subject Lab</label>
                <select
                  value={vivaSubject}
                  onChange={(e) => setVivaSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
                >
                  <option value="Concrete Technology & Testing Lab">Concrete Technology & Testing Lab</option>
                  <option value="Geotechnical / Soil Mechanics Lab">Geotechnical / Soil Mechanics Lab</option>
                  <option value="Surveying & Field Practice Lab">Surveying & Field Practice Lab</option>
                  <option value="Highway Materials Testing Lab">Highway Materials Testing Lab</option>
                  <option value="Fluid Mechanics & Hydraulics Lab">Fluid Mechanics & Hydraulics Lab</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Experiment Name</label>
                <input
                  type="text"
                  value={vivaLabExp}
                  onChange={(e) => setVivaLabExp(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
                />
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={submitViva}
                disabled={vivaLoading}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs flex items-center space-x-1.5 cursor-pointer disabled:opacity-50 transition-colors"
              >
                {vivaLoading ? <span>Generating Questions...</span> : <span>Generate Viva Questions</span>}
              </button>
            </div>

            {vivaResult && (
              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {vivaResult}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= 4. INTERVIEW PREPARATION ================= */}
      {activeTab === 'interview' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center space-x-2">
              <span className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Bot className="w-5 h-5" />
              </span>
              <span>Civil Engineering Job Interview Preparation</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Role-specific technical questions, site scenarios, contractor quality management, and sample answers.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Target Job / Examination</label>
                <select
                  value={interviewRole}
                  onChange={(e) => setInterviewRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
                >
                  <option value="SSC JE / CPWD Civil Engineer">SSC JE / CPWD Junior Engineer</option>
                  <option value="Site Engineer (Residential & Commercial)">Site Execution Engineer</option>
                  <option value="Billing & Quality Control (QC) Engineer">Billing & QC Engineer</option>
                  <option value="State Assistant Engineer (AE PWD)">State AE / SDO Examination</option>
                  <option value="Structural Design Engineer (ETABS / STAAD)">Structural Design Engineer</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Experience Level</label>
                <select
                  value={interviewExp}
                  onChange={(e) => setInterviewExp(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
                >
                  <option value="Fresher (Diploma / B.Tech)">Fresher (Diploma / B.Tech)</option>
                  <option value="1-3 Years Site Experience">1-3 Years Site Experience</option>
                  <option value="3-5+ Years Senior Engineer">3-5+ Years Senior Engineer</option>
                </select>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={submitInterview}
                disabled={interviewLoading}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs flex items-center space-x-1.5 cursor-pointer disabled:opacity-50 transition-colors"
              >
                {interviewLoading ? <span>Generating Prep Guide...</span> : <span>Generate Interview Guide</span>}
              </button>
            </div>

            {interviewResult && (
              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {interviewResult}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
