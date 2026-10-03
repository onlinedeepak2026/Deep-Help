import React, { useState } from 'react';
import { ActiveTab } from '../../types';
import {
  Calculator,
  Columns,
  FileSpreadsheet,
  Compass,
  GraduationCap,
  Sparkles,
  Bot,
  ArrowRight,
  Layers,
  CheckCircle2,
  Zap,
  Building2,
  HardHat,
  Ruler,
  Droplets,
  Coins,
  ShieldCheck,
  Maximize2,
  ExternalLink,
} from 'lucide-react';

interface ToolItem {
  id: ActiveTab;
  name: string;
  category: 'calculators' | 'design' | 'estimation' | 'surveying' | 'study' | 'ai';
  tagline: string;
  codeStandard: string;
  badge: string;
  iconBg: string;
  textColor: string;
  glowColor: string;
  stats: string;
  icon: React.ReactNode;
}

interface TopAnimatedToolsShowcaseProps {
  onSelectTab: (tab: ActiveTab) => void;
}

export const TopAnimatedToolsShowcase: React.FC<TopAnimatedToolsShowcaseProps> = ({ onSelectTab }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [launchingToolId, setLaunchingToolId] = useState<string | null>(null);

  const tools: ToolItem[] = [
    // 1. Calculators
    {
      id: 'concrete',
      name: 'Concrete Mix Calculator',
      category: 'calculators',
      tagline: 'M15, M20, M25 batch proportions & dry volume calculation',
      codeStandard: 'IS 10262:2019',
      badge: 'Popular',
      iconBg: 'from-emerald-500 to-teal-600',
      textColor: 'text-emerald-500',
      glowColor: 'hover:border-emerald-500/60 hover:shadow-emerald-500/10',
      stats: 'Cement, Sand, Aggregates & Water',
      icon: <Droplets className="w-5 h-5 text-white" />,
    },
    {
      id: 'steel',
      name: 'Steel Weight & Rebar Sizing',
      category: 'calculators',
      tagline: 'Standard D²/162 formula with bend & hook allowance',
      codeStandard: 'IS 1786:2008',
      badge: 'Site Essential',
      iconBg: 'from-sky-500 to-blue-600',
      textColor: 'text-sky-500',
      glowColor: 'hover:border-sky-500/60 hover:shadow-sky-500/10',
      stats: '8mm to 36mm Fe500 / Fe550',
      icon: <Calculator className="w-5 h-5 text-white" />,
    },
    {
      id: 'brick',
      name: 'Brickwork & Mortar Estimator',
      category: 'calculators',
      tagline: 'Modular bricks, dry mortar allowance & cement bag count',
      codeStandard: 'IS 1077 / 2212',
      badge: 'Masonry',
      iconBg: 'from-orange-500 to-amber-600',
      textColor: 'text-orange-500',
      glowColor: 'hover:border-orange-500/60 hover:shadow-orange-500/10',
      stats: '1:3, 1:4, 1:6 Mix Ratios',
      icon: <Building2 className="w-5 h-5 text-white" />,
    },
    {
      id: 'mix',
      name: 'Cement, Sand & Aggregate Mix',
      category: 'calculators',
      tagline: 'Combined volumetric batching with bulkage factor',
      codeStandard: 'IS 456 & 383',
      badge: 'Quantities',
      iconBg: 'from-teal-500 to-emerald-600',
      textColor: 'text-teal-500',
      glowColor: 'hover:border-teal-500/60 hover:shadow-teal-500/10',
      stats: 'Per m³ / Brass Analysis',
      icon: <Layers className="w-5 h-5 text-white" />,
    },
    {
      id: 'unit',
      name: 'Civil Engineering Unit Converter',
      category: 'calculators',
      tagline: 'Feet-inches to meters, brass, sq.ft, kN/m², and psi',
      codeStandard: 'Metric & Imperial',
      badge: 'Universal',
      iconBg: 'from-blue-500 to-indigo-600',
      textColor: 'text-blue-500',
      glowColor: 'hover:border-blue-500/60 hover:shadow-blue-500/10',
      stats: 'Length, Area, Volume & Stress',
      icon: <Ruler className="w-5 h-5 text-white" />,
    },
    {
      id: 'scientific',
      name: 'Scientific Calculator (fx-991)',
      category: 'calculators',
      tagline: 'Casio fx-991 ClassWiz natural display with history & civil presets',
      codeStandard: 'Casio ClassWiz fx-991',
      badge: '⭐ Highlighted',
      iconBg: 'from-amber-500 to-yellow-600',
      textColor: 'text-amber-500',
      glowColor: 'hover:border-amber-500/60 hover:shadow-amber-500/10 ring-1 ring-amber-500/40',
      stats: 'Trigonometry, Roots, Memory & History',
      icon: <Calculator className="w-5 h-5 text-white" />,
    },

    // 2. Structural & Design
    {
      id: 'design',
      name: 'RCC Beam & Cantilever Design',
      category: 'design',
      tagline: 'Limit state flexure, shear stirrups & development length',
      codeStandard: 'IS 456:2000 Cl. 38',
      badge: 'LSM Codal',
      iconBg: 'from-amber-500 to-yellow-600',
      textColor: 'text-amber-500',
      glowColor: 'hover:border-amber-500/60 hover:shadow-amber-500/10',
      stats: 'Mu,lim, Ast, Shear Rebar',
      icon: <Columns className="w-5 h-5 text-white" />,
    },
    {
      id: 'column',
      name: 'Column Sizing & Axial Capacity',
      category: 'design',
      tagline: 'Short & slender column checks per IS 456 clause 39',
      codeStandard: 'IS 456:2000 Cl. 39',
      badge: 'Compression',
      iconBg: 'from-indigo-500 to-purple-600',
      textColor: 'text-indigo-500',
      glowColor: 'hover:border-indigo-500/60 hover:shadow-indigo-500/10',
      stats: 'Pu Capacity & Longitudinal Bars',
      icon: <Maximize2 className="w-5 h-5 text-white" />,
    },
    {
      id: 'slab',
      name: 'One-Way & Two-Way Slab Design',
      category: 'design',
      tagline: 'Rankine-Grashoff coefficients, deflection span/depth check',
      codeStandard: 'IS 456 LSM Table 26',
      badge: 'Floor Slabs',
      iconBg: 'from-rose-500 to-pink-600',
      textColor: 'text-rose-500',
      glowColor: 'hover:border-rose-500/60 hover:shadow-rose-500/10',
      stats: 'Short & Long Span Moments',
      icon: <Layers className="w-5 h-5 text-white" />,
    },
    {
      id: 'footing',
      name: 'Isolated Footing & Soil Bearing',
      category: 'design',
      tagline: 'Area calculation, one-way shear, and two-way punching check',
      codeStandard: 'IS 456:2000 Cl. 34',
      badge: 'Foundation',
      iconBg: 'from-purple-500 to-violet-600',
      textColor: 'text-purple-500',
      glowColor: 'hover:border-purple-500/60 hover:shadow-purple-500/10',
      stats: 'Safe Bearing Capacity Check',
      icon: <Building2 className="w-5 h-5 text-white" />,
    },
    {
      id: 'rate',
      name: 'Rate Analysis & CPWD DSR Rates',
      category: 'design',
      tagline: 'Cost breakdown of material, labour, tools & 10% contractor profit',
      codeStandard: 'CPWD DSR Specifications',
      badge: 'Tendering',
      iconBg: 'from-amber-600 to-orange-700',
      textColor: 'text-amber-600',
      glowColor: 'hover:border-amber-600/60 hover:shadow-amber-600/10',
      stats: 'Item Unit Rates & Analysis',
      icon: <Coins className="w-5 h-5 text-white" />,
    },

    // 3. Estimation & BOQ
    {
      id: 'estimation',
      name: 'Detailed Estimation & BOQ Hub',
      category: 'estimation',
      tagline: 'Itemized quantity takeoff, abstract estimate & billing sheets',
      codeStandard: 'CPWD / PWD Standard',
      badge: 'Billing Pro',
      iconBg: 'from-indigo-600 to-blue-700',
      textColor: 'text-indigo-500',
      glowColor: 'hover:border-indigo-500/60 hover:shadow-indigo-500/10',
      stats: 'Automated Bill of Quantities',
      icon: <FileSpreadsheet className="w-5 h-5 text-white" />,
    },

    // 4. Surveying & Levelling
    {
      id: 'surveying',
      name: 'Auto-Level Survey & RL Reduction',
      category: 'surveying',
      tagline: 'Height of Instrument & Rise-Fall methods with 3 arithmetic checks',
      codeStandard: 'Field Survey Standard',
      badge: 'Leveling',
      iconBg: 'from-cyan-500 to-teal-600',
      textColor: 'text-cyan-500',
      glowColor: 'hover:border-cyan-500/60 hover:shadow-cyan-500/10',
      stats: 'BS, IS, FS & Reduced Levels',
      icon: <Compass className="w-5 h-5 text-white" />,
    },

    // 5. Study & Standards
    {
      id: 'study',
      name: '20 Civil Subjects & Lecture Notes',
      category: 'study',
      tagline: 'Complete syllabus with downloadable PDF notes and diagram vault',
      codeStandard: 'AICTE / B.Tech / Diploma',
      badge: 'Academic Vault',
      iconBg: 'from-amber-500 to-orange-600',
      textColor: 'text-amber-500',
      glowColor: 'hover:border-amber-500/60 hover:shadow-amber-500/10',
      stats: 'SOM, RCC, Geotech, Surveying',
      icon: <GraduationCap className="w-5 h-5 text-white" />,
    },
    {
      id: 'formula',
      name: 'Civil Engineering Formula Book',
      category: 'study',
      tagline: '120+ quick-reference formulas across 10 civil disciplines',
      codeStandard: 'Exam & Site Reference',
      badge: 'Quick Solver',
      iconBg: 'from-fuchsia-500 to-pink-600',
      textColor: 'text-fuchsia-500',
      glowColor: 'hover:border-fuchsia-500/60 hover:shadow-fuchsia-500/10',
      stats: 'Formulas, Units & Examples',
      icon: <Sparkles className="w-5 h-5 text-white" />,
    },
    {
      id: 'quiz',
      name: 'Live Assessment & MCQ Exam Bank',
      category: 'study',
      tagline: 'Timed mock quizzes with immediate answers, explanations & scorecards',
      codeStandard: 'SSC JE / RRB JE / GATE',
      badge: 'Exam Practice',
      iconBg: 'from-emerald-500 to-teal-600',
      textColor: 'text-emerald-500',
      glowColor: 'hover:border-emerald-500/60 hover:shadow-emerald-500/10',
      stats: '500+ Objective Questions',
      icon: <CheckCircle2 className="w-5 h-5 text-white" />,
    },
    {
      id: 'academic-uploads',
      name: 'Practical & Lab Assignments',
      category: 'study',
      tagline: 'Concrete slump, sieve, Proctor compaction, SFD/BMD & Viva questions',
      codeStandard: 'IS Lab Standards',
      badge: '⭐ Highlighted',
      iconBg: 'from-sky-500 to-blue-600',
      textColor: 'text-sky-500',
      glowColor: 'hover:border-sky-500/60 hover:shadow-sky-500/10 ring-1 ring-sky-500/40',
      stats: '50+ Lab Experiments & Viva Q&A',
      icon: <FileSpreadsheet className="w-5 h-5 text-white" />,
    },
    {
      id: 'pyqs',
      name: 'Previous Year Questions (PYQs)',
      category: 'study',
      tagline: 'SSC JE, GATE, B.Tech & Diploma exam papers with IS codal solutions',
      codeStandard: 'IS 456 / Exam Solutions',
      badge: '⭐ Highlighted',
      iconBg: 'from-emerald-500 to-teal-600',
      textColor: 'text-emerald-500',
      glowColor: 'hover:border-emerald-500/60 hover:shadow-emerald-500/10 ring-1 ring-emerald-500/40',
      stats: '200+ Solved Questions & Keys',
      icon: <GraduationCap className="w-5 h-5 text-white" />,
    },

    // 6. Civil AI
    {
      id: 'ai-tools',
      name: 'Civil AI Doubt Solver & Explainer',
      category: 'ai',
      tagline: 'Ask numerical doubts, explain structural drawings, or generate viva prep',
      codeStandard: 'Powered by Gemini & AI',
      badge: 'AI Powered',
      iconBg: 'from-violet-600 to-purple-700',
      textColor: 'text-violet-500',
      glowColor: 'hover:border-violet-500/60 hover:shadow-violet-500/10',
      stats: 'Instant Hindi + English Solutions',
      icon: <Bot className="w-5 h-5 text-white" />,
    },
  ];

  const categories = [
    { id: 'all', label: '⚡ All Tools (सभी टूल्स)', count: tools.length },
    { id: 'calculators', label: '📐 Site Calculators', count: tools.filter((t) => t.category === 'calculators').length },
    { id: 'design', label: '🏗️ Structural & RCC', count: tools.filter((t) => t.category === 'design').length },
    { id: 'estimation', label: '📊 Estimation & BOQ', count: tools.filter((t) => t.category === 'estimation').length },
    { id: 'surveying', label: '🔭 Surveying & Level', count: tools.filter((t) => t.category === 'surveying').length },
    { id: 'study', label: '📚 Study & Notes', count: tools.filter((t) => t.category === 'study').length },
    { id: 'ai', label: '🤖 Civil AI Solver', count: tools.filter((t) => t.category === 'ai').length },
  ];

  const filteredTools =
    selectedCategory === 'all'
      ? tools
      : tools.filter((t) => t.category === selectedCategory);

  const handleLaunchTool = (toolId: ActiveTab) => {
    setLaunchingToolId(toolId);
    // Smooth tactile launch feeling
    setTimeout(() => {
      onSelectTab(toolId);
      setLaunchingToolId(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 280);
  };

  return (
    <div className="space-y-4">
      {/* Top Header & Interactive Category Bar */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 text-xs font-black uppercase tracking-wider border border-amber-500/30">
                Top Command Center
              </span>
              <span className="text-xs font-bold text-slate-400">
                • 100% Codal Verified Calculators
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
              Civil Engineering Tools & Calculators
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Select any engineering tool below to launch with instant codal calculation and PDF export.
            </p>
          </div>

          {/* Quick Counter */}
          <div className="flex items-center space-x-2 shrink-0">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-2xl bg-amber-500 text-slate-950 text-xs font-black shadow-md shadow-amber-500/20">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>{tools.length} Real-Time Tools</span>
            </span>
          </div>
        </div>

        {/* Filter Category Segmented Buttons */}
        <div className="flex items-center space-x-2 overflow-x-auto pt-4 pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center space-x-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-black shadow-md scale-[1.02]'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              <span>{cat.label}</span>
              <span className="text-[10px] opacity-75 font-mono">({cat.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Animated Tools Grid with Customized Physics Hover */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredTools.map((tool) => {
          const isLaunching = launchingToolId === tool.id;

          return (
            <div
              key={tool.id}
              id={`tool-card-${tool.id}`}
              onClick={() => handleLaunchTool(tool.id)}
              className={`group relative overflow-hidden rounded-3xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-all duration-200 cursor-pointer shadow-xs hover:shadow-xl hover:-translate-y-1.5 ${tool.glowColor} ${
                isLaunching ? 'scale-95 ring-2 ring-amber-500' : ''
              }`}
            >
              {/* Top Row: Icon + Badge */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div
                  className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${tool.iconBg} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-200`}
                >
                  {tool.icon}
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {tool.badge}
                  </span>
                  <span className="text-[9px] font-semibold text-amber-600 dark:text-amber-400 font-mono">
                    {tool.codeStandard}
                  </span>
                </div>
              </div>

              {/* Title & Tagline */}
              <h3 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-1">
                {tool.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                {tool.tagline}
              </p>

              {/* Footer Meta & Launch Action */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 truncate max-w-[140px]">
                  {tool.stats}
                </span>

                <div className="inline-flex items-center space-x-1 text-xs font-black text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition-transform">
                  <span>{isLaunching ? 'Opening...' : 'Launch'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Launching Loading Bar Overlay */}
              {isLaunching && (
                <div className="absolute inset-0 bg-amber-500/10 dark:bg-amber-500/20 backdrop-blur-2xs flex items-center justify-center">
                  <div className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center space-x-2 shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    <span>Loading {tool.name}...</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
