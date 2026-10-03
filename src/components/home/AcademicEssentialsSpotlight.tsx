import React, { useState } from 'react';
import {
  Calculator,
  FileText,
  GraduationCap,
  Sparkles,
  ExternalLink,
  ChevronRight,
  BookOpen,
  Award,
  Layers,
  CheckCircle2,
  HelpCircle,
  Maximize2,
  Download,
  Eye,
  Filter,
  ArrowRight,
  Compass,
  Cpu,
  Clock,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { ActiveTab } from '../../types';
import { PRELOADED_ACADEMIC_RESOURCES } from '../../utils/unlimitedAcademicStorage';
import { AcademicResource } from '../../types/academic';
import { AcademicResourceViewerModal } from '../study/AcademicResourceViewerModal';

interface AcademicEssentialsSpotlightProps {
  onSelectTab: (tab: ActiveTab) => void;
  onOpenStudySubTab: (
    subTab: 'subjects' | 'notes' | 'pyqs' | 'academic-uploads' | 'quiz' | 'formulas' | 'codes'
  ) => void;
}

export const AcademicEssentialsSpotlight: React.FC<AcademicEssentialsSpotlightProps> = ({
  onSelectTab,
  onOpenStudySubTab,
}) => {
  const [activeSpotlightTab, setActiveSpotlightTab] = useState<'calculator' | 'practical' | 'pyq'>(
    'calculator'
  );

  // Quick Calculator State
  const [quickExpression, setQuickExpression] = useState('(16^2)/162');
  const [quickResult, setQuickResult] = useState('1.5802 kg/m');
  const [quickCalcError, setQuickCalcError] = useState<string | null>(null);

  // Practical filter
  const [practicalFilter, setPracticalFilter] = useState<string>('all');
  // PYQ filter
  const [pyqFilter, setPyqFilter] = useState<string>('all');
  // Selected resource for viewer modal
  const [selectedResource, setSelectedResource] = useState<AcademicResource | null>(null);

  // Solved PYQ answer toggle
  const [revealedSolutions, setRevealedSolutions] = useState<Record<string, boolean>>({});

  const toggleSolution = (id: string) => {
    setRevealedSolutions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Safe expression evaluator for quick calculator preview
  const evaluateQuick = (expr: string) => {
    try {
      setQuickCalcError(null);
      // Clean and sanitize expression
      let sanitized = expr
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/\^/g, '**')
        .replace(/π/g, 'Math.PI')
        .replace(/pi/gi, 'Math.PI')
        .replace(/sqrt\(/gi, 'Math.sqrt(')
        .replace(/sin\(/gi, 'Math.sin(')
        .replace(/cos\(/gi, 'Math.cos(')
        .replace(/tan\(/gi, 'Math.tan(');

      // Only allow safe math tokens
      if (!/^[0-9+\-*/().\s,eMathPIsqrtincota*]+$/.test(sanitized)) {
        throw new Error('अमान्य वर्ण (Invalid characters)');
      }

      // eslint-disable-next-line no-eval
      const val = Function(`"use strict"; return (${sanitized})`)();
      if (typeof val === 'number' && !isNaN(val) && isFinite(val)) {
        const formatted = Number(val.toFixed(6)).toString();
        setQuickResult(formatted);
      } else {
        setQuickCalcError('अमान्य गणना');
      }
    } catch {
      setQuickCalcError('सूत्र जांचें (Syntax error)');
    }
  };

  // Quick engineering presets
  const presets = [
    { label: 'Steel 16mm D²/162', expr: '(16^2)/162', note: '1.580 kg/m (Fe500)' },
    { label: 'Limiting Mu Fe415', expr: '0.138 * 25 * 250 * (450^2) / 1000000', note: '174.65 kN·m' },
    { label: 'Column Area 400mm', expr: 'Math.PI * (400^2) / 4', note: '125,664 mm²' },
    { label: 'Neutral Axis Fe415', expr: '0.48 * 450', note: 'xu,max = 216 mm' },
    { label: 'SBC with FOS 3', expr: '900 / 3', note: '300 kN/m²' },
  ];

  // Filtered practicals from preloaded database
  const practicalResources = PRELOADED_ACADEMIC_RESOURCES.filter(
    (r) => r.type === 'practical' || r.type === 'assignment'
  );

  const displayedPracticals = practicalResources.filter((p) => {
    if (practicalFilter === 'all') return true;
    if (practicalFilter === 'practical') return p.type === 'practical';
    if (practicalFilter === 'assignment') return p.type === 'assignment';
    return p.subjectId.toLowerCase().includes(practicalFilter.toLowerCase());
  });

  // Filtered PYQs from preloaded database
  const pyqResources = PRELOADED_ACADEMIC_RESOURCES.filter((r) => r.type === 'pyq');
  const displayedPYQs = pyqResources.filter((q) => {
    if (pyqFilter === 'all') return true;
    if (pyqFilter === 'ssc_je') return q.examName?.toLowerCase().includes('ssc');
    if (pyqFilter === 'gate') return q.examName?.toLowerCase().includes('gate');
    return q.subjectId.toLowerCase().includes(pyqFilter.toLowerCase());
  });

  return (
    <section className="relative overflow-hidden rounded-3xl border-2 border-amber-500/30 dark:border-amber-400/20 bg-gradient-to-br from-white via-amber-50/20 to-slate-50 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-950 shadow-xl transition-all duration-300">
      {/* Background Architectural Grid Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.06]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Decorative Glows */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Banner */}
      <div className="relative px-6 py-6 border-b border-slate-200/80 dark:border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" style={{ animationDuration: '4s' }} />
              ⭐ Highlighted Academic & Site Suite
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              एक ही स्थान पर तीनों मुख्य सुविधाएं
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex flex-wrap items-center gap-2">
            <span>Scientific Calculator</span>
            <span className="text-amber-500">+</span>
            <span>Practical Assignments</span>
            <span className="text-amber-500">+</span>
            <span className="text-amber-600 dark:text-amber-400">Previous Year Questions (PYQ)</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            इंजीनियरिंग गणना, प्रयोगशाला रिकॉर्ड्स/असाइनमेंट और विगत वर्षों के प्रश्न पत्र — त्वरित उपयोग व अभ्यास हेतु।
          </p>
        </div>

        {/* 3 Core Switcher Pills */}
        <div className="flex items-center p-1.5 rounded-2xl bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shrink-0 shadow-inner">
          <button
            type="button"
            onClick={() => setActiveSpotlightTab('calculator')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
              activeSpotlightTab === 'calculator'
                ? 'bg-amber-500 text-slate-950 font-black shadow-md scale-[1.02]'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Scientific Calc</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSpotlightTab('practical')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
              activeSpotlightTab === 'practical'
                ? 'bg-sky-500 text-white font-black shadow-md scale-[1.02]'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Practical & Lab</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSpotlightTab('pyq')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
              activeSpotlightTab === 'pyq'
                ? 'bg-emerald-500 text-slate-950 font-black shadow-md scale-[1.02]'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>PYQ Vault</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Spotlight Body */}
      <div className="p-6">
        {/* ================= TAB 1: SCIENTIFIC CALCULATOR ================= */}
        {activeSpotlightTab === 'calculator' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Left Column: Quick Calculator Interactive Console */}
              <div className="lg:col-span-7 bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center font-black text-sm">
                        fx
                      </span>
                      <div>
                        <h3 className="text-sm font-black text-slate-900 dark:text-white">
                          Quick Engineering Calculator
                        </h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Casio fx-991 ClassWiz Virtual Engine Ready
                        </p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      ⚡ Instant Evaluation
                    </span>
                  </div>

                  {/* Calculator Input & Output Box */}
                  <div className="p-4 rounded-xl bg-slate-950 text-emerald-400 font-mono border border-slate-800 space-y-2 mb-4">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>EXPR [DEG]</span>
                      <span className="text-[10px] text-amber-400">Math Mode</span>
                    </div>
                    <input
                      type="text"
                      value={quickExpression}
                      onChange={(e) => {
                        setQuickExpression(e.target.value);
                        evaluateQuick(e.target.value);
                      }}
                      placeholder="Type expression e.g. (16^2)/162 or sqrt(250)"
                      className="w-full bg-transparent text-white font-mono text-base outline-none border-b border-slate-800 pb-1 focus:border-amber-500"
                    />
                    <div className="flex items-baseline justify-between pt-1">
                      <span className="text-xs text-slate-500 font-sans">Answer:</span>
                      <span className="text-lg font-bold text-emerald-400">
                        {quickCalcError ? (
                          <span className="text-red-400 text-xs font-sans">{quickCalcError}</span>
                        ) : (
                          `= ${quickResult}`
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Quick Civil Engineering Presets */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 block">
                      📌 Popular Civil Engineering Presets (Click to evaluate):
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {presets.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setQuickExpression(preset.expr);
                            evaluateQuick(preset.expr);
                          }}
                          className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-amber-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 text-left transition-colors cursor-pointer group"
                        >
                          <div className="min-w-0 pr-2">
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate group-hover:text-amber-600 dark:group-hover:text-amber-400">
                              {preset.label}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {preset.note}
                            </span>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-500 shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Primary Launch Action */}
                <div className="pt-5 mt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Includes Trigonometry, Complex Numbers, Matrices & Equation Solver.
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectTab('scientific');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer group"
                  >
                    <Calculator className="w-4 h-4" />
                    <span>Open Full Casio ClassWiz fx-991</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>

              {/* Right Column: Key Features & Capabilities of Scientific Calculator */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                    <ShieldCheck className="w-5 h-5 shrink-0" />
                    <h4 className="text-xs font-black uppercase tracking-wider">
                      Advanced Casio Engine Specifications
                    </h4>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>
                        <strong>Natural Textbook Display (MathIO):</strong> Fractions, square roots, powers and integrals formatted like real textbook notation.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>
                        <strong>High-Precision Calculations:</strong> 15-digit internal precision for geotechnical bearing capacity, bending moments, and surveying coordinates.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>
                        <strong>Calculation History & PDF Export:</strong> Every step saved in history with ability to print or export formal calculation sheets.
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Quick Link Card to Study & Formulas */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        Civil Formula Book Ready
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        120+ standard formulas across all 20 civil disciplines
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenStudySubTab('formulas')}
                    className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 hover:border-amber-500 transition-colors cursor-pointer"
                  >
                    View Formulas
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: PRACTICAL ASSIGNMENTS ================= */}
        {activeSpotlightTab === 'practical' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Practical Top Filters & Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Filter Lab:</span>
                {[
                  { id: 'all', label: 'All Lab Manuals' },
                  { id: 'practical', label: '🧪 Practicals' },
                  { id: 'assignment', label: '📝 Assignments' },
                  { id: 'concrete', label: 'Concrete Lab' },
                  { id: 'geotech', label: 'Soil Lab' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPracticalFilter(item.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      practicalFilter === item.id
                        ? 'bg-sky-500 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  onOpenStudySubTab('academic-uploads');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer"
              >
                <span>Browse All Lab Records & Assignments</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Practical Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayedPracticals.slice(0, 6).map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-500/50 hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          item.type === 'practical'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                            : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20'
                        }`}
                      >
                        {item.type === 'practical' ? '🧪 Lab Practical' : '📝 Assignment'}
                      </span>
                      <span className="text-[11px] font-bold text-slate-400">
                        {item.semester}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors line-clamp-2 mb-1.5">
                      {item.title}
                    </h4>

                    {item.aim && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-2 leading-relaxed">
                        <strong className="text-slate-800 dark:text-slate-200">Aim: </strong>
                        {item.aim}
                      </p>
                    )}

                    {item.apparatus && item.apparatus.length > 0 && (
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mb-2">
                        <strong>Apparatus: </strong>
                        <span>{item.apparatus.slice(0, 2).join(', ')}...</span>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1 mb-3">
                      {item.tags.slice(0, 3).map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                    <span className="text-[11px] font-medium text-slate-400">
                      Author: {item.authorName || 'Er. Deepak Kumar'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedResource(item)}
                      className="px-3 py-1.5 rounded-lg bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-900/60 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Record</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Action Footer for Practicals */}
            <div className="p-4 rounded-2xl bg-sky-50/50 dark:bg-slate-900/60 border border-sky-200/60 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center font-black">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Need full viva questions, observation tables, or lab submission files?
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Unlimited IndexedDB storage — upload or view your college assignments anytime offline.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  onOpenStudySubTab('academic-uploads');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <span>Open Practical Section in Study Hub</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= TAB 3: PREVIOUS YEAR QUESTIONS (PYQ) ================= */}
        {activeSpotlightTab === 'pyq' && (
          <div className="space-y-6 animate-fadeIn">
            {/* PYQ Top Filters & Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Exam Filter:</span>
                {[
                  { id: 'all', label: 'All Exams' },
                  { id: 'ssc_je', label: '🏛️ SSC JE' },
                  { id: 'gate', label: '🎓 GATE Civil' },
                  { id: 'rcc', label: 'IS 456 RCC' },
                  { id: 'geotech', label: 'Soil Mechanics' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPyqFilter(item.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      pyqFilter === item.id
                        ? 'bg-emerald-500 text-slate-950 font-black shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  onOpenStudySubTab('academic-uploads');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
              >
                <span>Browse All Question Papers & Solutions</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* PYQ Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayedPYQs.slice(0, 4).map((q) => {
                const isRevealed = Boolean(revealedSolutions[q.id]);

                return (
                  <div
                    key={q.id}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          {q.examName || 'Competitive PYQ'}
                        </span>
                        <span className="text-xs font-bold text-slate-400">
                          Year: {q.academicYear || '2023-2024'}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2 leading-snug">
                        {q.title}
                      </h4>

                      <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">
                        Subject: <span className="text-slate-800 dark:text-slate-200">{q.subjectName}</span>
                      </div>

                      {q.description && (
                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 line-clamp-3 leading-relaxed">
                          {q.description}
                        </p>
                      )}

                      {/* Solution Dropdown / Reveal */}
                      {isRevealed && q.solutionText && (
                        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-emerald-500/30 text-xs font-mono text-slate-800 dark:text-emerald-300 space-y-1.5 mb-3 animate-fadeIn">
                          <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider font-sans flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Step-by-Step Solution & Codal Reference:</span>
                          </div>
                          <div className="whitespace-pre-line leading-relaxed text-[11px]">
                            {q.solutionText}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => toggleSolution(q.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                          isRevealed
                            ? 'bg-amber-500 text-slate-950 font-black'
                            : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20'
                        }`}
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>{isRevealed ? 'Hide Solution' : 'Check Solution & Formula'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedResource(q)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span>Full Paper</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Action Footer for PYQs */}
            <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-slate-900/60 border border-emerald-200/60 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Looking for full question papers with PDF export or college semester exams?
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    SSC JE, RRB JE, GATE Civil, and State Technical Board (SBTE / University) solved papers.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  onOpenStudySubTab('academic-uploads');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <span>Open PYQ Papers Section</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Viewer Modal for clicked resource */}
      <AcademicResourceViewerModal
        isOpen={Boolean(selectedResource)}
        onClose={() => setSelectedResource(null)}
        resource={selectedResource}
      />
    </section>
  );
};
