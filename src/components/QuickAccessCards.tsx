import React from 'react';
import { ActiveTab } from '../types';
import {
  Layers,
  Building2,
  Coins,
  ArrowRightLeft,
  Ruler,
  Maximize2,
  Droplets,
  BookOpen,
  HelpCircle,
  Settings2,
  ArrowRight,
  ShieldCheck,
  Calculator,
  Bell,
  Sparkles,
  Compass,
  FileSpreadsheet,
  Briefcase,
  BrainCircuit,
  Columns,
  GraduationCap,
} from 'lucide-react';

interface QuickAccessCardsProps {
  onSelectTab: (tab: ActiveTab) => void;
  searchFilter?: string;
}

export const QuickAccessCards: React.FC<QuickAccessCardsProps> = ({ onSelectTab, searchFilter = '' }) => {
  const cards: {
    id: ActiveTab;
    title: string;
    subtitle: string;
    description: string;
    icon: React.ReactNode;
    features: string[];
    tag: string;
    badgeColor: string;
    isPrimaryHub?: boolean;
  }[] = [
    {
      id: 'study',
      title: 'Study Section',
      subtitle: '20 Subjects, Notes, PYQs & IS Codes',
      description: 'Comprehensive civil engineering syllabus notes (PDF export), previous year question bank with solutions, formula book, and IS codes list.',
      icon: <GraduationCap className="w-6 h-6 text-amber-500" />,
      features: ['All 20 Civil Subjects', 'Downloadable PDF Notes', 'SSC / RRB / GATE PYQs', 'IS 456 / 800 / 1893 List'],
      tag: 'Academic & Exams',
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border-amber-300/40',
      isPrimaryHub: true,
    },
    {
      id: 'calculators',
      title: 'Engineering Calculators Hub',
      subtitle: 'Concrete, Brick, Steel, Mix & Units',
      description: 'Unified calculations center: concrete mix, brickwork, steel weight D²/162, cement-sand-aggregate mixes, and civil unit converters.',
      icon: <Calculator className="w-6 h-6 text-emerald-500" />,
      features: ['Concrete (M15 to M30)', 'Brickwork & Mortar Ratios', 'Steel Bar Weight (kg/m)', 'Instant Unit Conversion'],
      tag: 'Site Quantities',
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-300/40',
      isPrimaryHub: true,
    },
    {
      id: 'design',
      title: 'Design Tools Hub',
      subtitle: 'Beam, Column, Slab, Footing & Rate Analysis',
      description: 'Codal structural design per IS 456:2000 (Limit State Method) and item rate analysis based on CPWD/DSR specifications.',
      icon: <Columns className="w-6 h-6 text-sky-500" />,
      features: ['IS 456 RCC Beam Design', 'Axial Column Sizing', 'One-way & Two-way Slabs', 'Isolated Footing & DSR Rates'],
      tag: 'Structural Design',
      badgeColor: 'bg-sky-100 text-sky-800 dark:bg-sky-950/50 dark:text-sky-300 border-sky-300/40',
      isPrimaryHub: true,
    },
    {
      id: 'estimation',
      title: 'Estimation & Costing',
      subtitle: 'Detailed, Abstract, BOQ & Material Costs',
      description: 'Automated BOQ generator, detailed itemized takeoff with 1.5% water & 10% contractor profit, and current Indian market rates.',
      icon: <FileSpreadsheet className="w-6 h-6 text-indigo-500" />,
      features: ['Detailed Quantity Takeoff', 'Abstract Project Estimate', 'Bill of Quantities (BOQ)', 'Live Material Costing'],
      tag: 'Billing & Tenders',
      badgeColor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-300 border-indigo-300/40',
      isPrimaryHub: true,
    },
    {
      id: 'surveying',
      title: 'Surveying Tools Hub',
      subtitle: 'Levelling, Traverse, Chain & GPS Map',
      description: 'Height of Instrument & Rise-Fall methods with 3 arithmetic checks, closed traverse Bowditch adjustment, chain survey offsets, and GPS coordinates.',
      icon: <Compass className="w-6 h-6 text-purple-500" />,
      features: ['Differential Levelling Checks', 'Traverse Latitude & Departure', 'Chain & Tape Correction', 'GPS Coordinate Converter'],
      tag: 'Field Survey',
      badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-950/50 dark:text-purple-300 border-purple-300/40',
      isPrimaryHub: true,
    },
    {
      id: 'career',
      title: 'Career & Job Alerts',
      subtitle: 'SSC JE, RRB JE, BTSC JE & GATE Civil',
      description: 'Official notifications, exam dates, eligibility criteria, pattern breakdowns, and preparation advice for central and state engineering posts.',
      icon: <Briefcase className="w-6 h-6 text-rose-500" />,
      features: ['SSC JE 2026 Updates', 'RRB JE Technical Syllabus', 'BTSC JE Bihar Vacancies', 'GATE Civil Cutoffs & PSUs'],
      tag: 'Govt & PSU Jobs',
      badgeColor: 'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300 border-rose-300/40',
      isPrimaryHub: true,
    },
    {
      id: 'ai-tools',
      title: 'AI Civil Engineering Hub',
      subtitle: 'Doubt Solver, Plan Explainer & Viva',
      description: 'AI-assisted technical doubt solver with codal citations, architectural plan and structural drawing explainer, and mock interview trainer.',
      icon: <BrainCircuit className="w-6 h-6 text-amber-500" />,
      features: ['Technical AI Doubt Solver', 'Structural Drawing Explainer', 'Lab Viva-Voce Generator', 'Civil Interview Question Prep'],
      tag: 'AI Intelligence',
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border-amber-300/40',
      isPrimaryHub: true,
    },
    {
      id: 'concrete',
      title: 'Concrete Mix Calculator',
      subtitle: 'M15, M20, M25, M30 & Custom',
      description: 'Calculate exact quantities of cement bags, sand, coarse aggregates, and water with dry volume expansion (1.54 factor).',
      icon: <Layers className="w-6 h-6 text-amber-500" />,
      features: ['M15, M20, M25, M30', 'Cement Bags & kg', 'Sand (m³, cft & kg)', 'Water-cement ratio'],
      tag: 'Core Material',
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border-amber-300/40',
    },
    {
      id: 'brick',
      title: 'Brick Calculator',
      subtitle: 'Wall Masonry & Mortar Estimation',
      description: 'Compute total bricks needed with 10% wastage allowance, plus dry mortar, cement bags, and sand required.',
      icon: <Building2 className="w-6 h-6 text-rose-500" />,
      features: ['Wall L × W × H', 'Standard & Modular Bricks', 'Mortar Ratios (1:3 to 1:6)', 'Deductions & Wastage'],
      tag: 'Masonry Works',
      badgeColor: 'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300 border-rose-300/40',
    },
    {
      id: 'cost',
      title: 'Building Cost Estimator',
      subtitle: 'Cost Estimation in Indian Rupees (INR)',
      description: 'Estimate project construction budget per sq.ft or sq.m with structured breakdown of structure, finishing, and labor.',
      icon: <Coins className="w-6 h-6 text-emerald-500" />,
      features: ['Sq.ft & Sq.m Inputs', 'Cost per Unit in INR (₹)', 'Material vs Labor Split', 'Lakhs & Crores Display'],
      tag: 'Financials',
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-300/40',
    },
    {
      id: 'scientific',
      title: 'Scientific Calculator',
      subtitle: 'Trigonometry, Logarithms & Civil Constants',
      description: 'Exam-grade scientific calculator with dual-line LCD, DEG/RAD angle modes, power series, and one-click civil shortcuts (D²/162, πD²/4).',
      icon: <Calculator className="w-6 h-6 text-amber-500" />,
      features: ['DEG & RAD Modes', 'Sin, Cos, Tan & Inverses', 'x², xʸ, √x, ln & log', 'Civil Engineering Shortcuts'],
      tag: 'Computation',
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border-amber-300/40',
    },
    {
      id: 'notices',
      title: 'Notices & Link Share',
      subtitle: 'Official Circulars & Founder Bulletins',
      description: 'Official notifications, site amendments, and announcements from Er. Deepak Kumar with 1-click sharing to WhatsApp & Facebook.',
      icon: <Bell className="w-6 h-6 text-rose-500" />,
      features: ['Founder Notices & Links', '1-Click WhatsApp & FB Share', 'Pinned Announcements', 'External URL & PDF Attachments'],
      tag: 'Official Bulletins',
      badgeColor: 'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300 border-rose-300/40',
    },
  ];

  const filteredCards = cards.filter((card) => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return (
      card.title.toLowerCase().includes(q) ||
      card.subtitle.toLowerCase().includes(q) ||
      card.description.toLowerCase().includes(q) ||
      card.features.some((f) => f.toLowerCase().includes(q)) ||
      card.tag.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Engineering Tool Modules
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Select a specialized module below to begin calculations or manage your study resources.
          </p>
        </div>
        <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg self-start sm:self-auto border border-slate-200 dark:border-slate-700">
          Showing {filteredCards.length} of {cards.length} tools
        </div>
      </div>

      {filteredCards.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
          <Layers className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">No matching module found</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Try searching for &quot;concrete&quot;, &quot;brick&quot;, &quot;beam&quot;, or &quot;quiz&quot;.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCards.map((card) => (
            <div
              key={card.id}
              id={`card-module-${card.id}`}
              onClick={() => onSelectTab(card.id)}
              className="group relative flex flex-col justify-between p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-amber-500/60 dark:hover:border-amber-500/60 shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden"
            >
              {/* Top Accent line on hover */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:scale-105 transition-transform">
                    {card.icon}
                  </div>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${card.badgeColor}`}
                  >
                    {card.tag}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                  {card.subtitle}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mb-4 leading-relaxed">
                  {card.description}
                </p>

                {/* Features checklist */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 mb-5">
                  {card.features.map((f, i) => (
                    <div key={i} className="flex items-center text-[11px] text-slate-600 dark:text-slate-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-2 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 flex items-center justify-between text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400">
                <span>Launch Calculator</span>
                <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
