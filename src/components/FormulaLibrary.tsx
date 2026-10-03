import React, { useState, useMemo } from 'react';
import { FORMULAS_DATA } from '../data/formulasData';
import { ALL_CIVIL_SUBJECTS } from '../data/civilSubjects';
import { FormulaItem } from '../types';
import { ItemPhotoNoteModal } from './common/ItemPhotoNoteModal';
import { ShareCardModal } from './common/ShareCardModal';
import { getAllAttachments } from '../utils/attachmentStorage';
import {
  BookOpen,
  Search,
  Copy,
  Check,
  Tag,
  Lightbulb,
  Compass,
  Activity,
  Building2,
  Ruler,
  Layers,
  Layers3,
  Waves,
  Droplets,
  CloudRain,
  Leaf,
  Mountain,
  Truck,
  Box,
  Anchor,
  Coins,
  CalendarCheck,
  Share2,
  Cable,
  Maximize,
  BadgePercent,
  Crosshair,
  Filter,
  Sparkles,
  Calculator,
  Camera,
  FileText,
  Image as ImageIcon,
} from 'lucide-react';

/**
 * Ensures formulas and mathematical symbols are displayed in standard,
 * clean textbook format rather than raw coding/LaTeX syntax.
 */
function toStandardMathFormat(raw: string): string {
  if (!raw) return '';
  return raw
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1 / $2)')
    .replace(/\\times/g, '×')
    .replace(/\\cdot/g, '×')
    .replace(/\\quad/g, '   |   ')
    .replace(/\\;/g, ' | ')
    .replace(/\\pm/g, '±')
    .replace(/\\le/g, '≤')
    .replace(/\\ge/g, '≥')
    .replace(/\\ne/g, '≠')
    .replace(/\\approx/g, '≈')
    .replace(/\\sqrt\{([^}]+)\}/g, '√($1)')
    .replace(/\\sqrt/g, '√')
    .replace(/\\sin/g, 'sin')
    .replace(/\\cos/g, 'cos')
    .replace(/\\tan/g, 'tan')
    .replace(/\\log_\{10\}/g, 'log₁₀')
    .replace(/\\ln/g, 'ln')
    .replace(/\\alpha/g, 'α')
    .replace(/\\beta/g, 'β')
    .replace(/\\gamma_w/g, 'γ_w')
    .replace(/\\gamma/g, 'γ')
    .replace(/\\theta/g, 'θ')
    .replace(/\\phi/g, 'φ')
    .replace(/\\sigma/g, 'σ')
    .replace(/\\tau/g, 'τ')
    .replace(/\\mu/g, 'μ')
    .replace(/\\epsilon/g, 'ε')
    .replace(/\\lambda/g, 'λ')
    .replace(/\\Delta/g, 'Δ')
    .replace(/\\delta/g, 'δ')
    .replace(/\\pi/g, 'π')
    .replace(/\\rho/g, 'ρ')
    .replace(/\\eta/g, 'η')
    .replace(/\\nu/g, 'ν')
    .replace(/\\Sigma/g, 'Σ')
    .replace(/\\sum/g, 'Σ')
    .replace(/\\text\{([^}]+)\}/g, '$1')
    .replace(/_\{([^}]+)\}/g, '_$1')
    .replace(/\^2/g, '²')
    .replace(/\^3/g, '³')
    .replace(/\^4/g, '⁴')
    .replace(/\^n/g, 'ⁿ')
    .replace(/\\/g, ''); // strip any accidental leftover backslash
}

export const FormulaLibrary: React.FC = () => {
  const [activeSubject, setActiveSubject] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Attachment & Share Modals
  const [attachmentsMap, setAttachmentsMap] = useState(getAllAttachments());
  const [activeAttachmentFormula, setActiveAttachmentFormula] = useState<FormulaItem | null>(null);
  const [activeShareFormula, setActiveShareFormula] = useState<FormulaItem | null>(null);

  const refreshAttachments = () => {
    setAttachmentsMap(getAllAttachments());
  };

  // Icon mapping for subjects
  const getSubjectIcon = (iconName: string, className = 'w-4 h-4') => {
    switch (iconName) {
      case 'Compass': return <Compass className={className} />;
      case 'Activity': return <Activity className={className} />;
      case 'Building2': return <Building2 className={className} />;
      case 'Ruler': return <Ruler className={className} />;
      case 'Layers': return <Layers className={className} />;
      case 'Layers3': return <Layers3 className={className} />;
      case 'Waves': return <Waves className={className} />;
      case 'Droplets': return <Droplets className={className} />;
      case 'CloudRain': return <CloudRain className={className} />;
      case 'Leaf': return <Leaf className={className} />;
      case 'Mountain': return <Mountain className={className} />;
      case 'Truck': return <Truck className={className} />;
      case 'Box': return <Box className={className} />;
      case 'Anchor': return <Anchor className={className} />;
      case 'Coins': return <Coins className={className} />;
      case 'CalendarCheck': return <CalendarCheck className={className} />;
      case 'Share2': return <Share2 className={className} />;
      case 'Cable': return <Cable className={className} />;
      case 'Maximize': return <Maximize className={className} />;
      case 'BadgePercent': return <BadgePercent className={className} />;
      case 'Crosshair': return <Crosshair className={className} />;
      default: return <BookOpen className={className} />;
    }
  };

  const filteredFormulas = useMemo(() => {
    return FORMULAS_DATA.filter((item) => {
      const matchSubject = activeSubject === 'All' || item.category === activeSubject;
      if (!matchSubject) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const stdFormula = toStandardMathFormat(item.formula).toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        stdFormula.includes(q) ||
        item.description.toLowerCase().includes(q) ||
        (item.isStandardCode && item.isStandardCode.toLowerCase().includes(q)) ||
        (item.practicalRule && item.practicalRule.toLowerCase().includes(q)) ||
        (item.keyConcepts && item.keyConcepts.some((kc) => kc.toLowerCase().includes(q))) ||
        item.variables.some((v) => toStandardMathFormat(v.symbol).toLowerCase().includes(q) || v.meaning.toLowerCase().includes(q))
      );
    });
  }, [activeSubject, searchQuery]);

  const handleCopy = (formulaText: string, id: string) => {
    const cleanFormula = toStandardMathFormat(formulaText);
    navigator.clipboard.writeText(cleanFormula);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  // Find active subject details
  const currentSubjectObj = useMemo(() => {
    return ALL_CIVIL_SUBJECTS.find((s) => s.name === activeSubject);
  }, [activeSubject]);

  return (
    <div className="space-y-6">
      {/* Module Banner Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-start sm:items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md shadow-amber-500/20 shrink-0">
            <BookOpen className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                Civil Engineering Concepts & Standard Formulas
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 text-[10px] font-extrabold uppercase tracking-wider border border-amber-500/30">
                Standard Textbook Format • 21 Subjects
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Clear, standard mathematical expressions for Indian Standards (IS), IRC, and CPWD civil engineering codes.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full lg:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            id="formula-search-input"
            type="text"
            placeholder="Search concepts, formulas, IS codes, symbols..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
          />
        </div>
      </div>

      {/* Subject Selector Header Bar with Dropdown & Quick Scroll */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-700 dark:text-slate-300">
            <Filter className="w-4 h-4 text-amber-500" />
            <span>Select Civil Engineering Subject (21 Disciplines):</span>
          </div>

          {/* Quick Dropdown Picker */}
          <div className="flex items-center space-x-2">
            <span className="text-[11px] text-slate-400 font-medium">Quick Jump:</span>
            <select
              id="subject-dropdown-select"
              aria-label="Select civil engineering discipline"
              value={activeSubject}
              onChange={(e) => setActiveSubject(e.target.value)}
              className="text-xs font-bold py-1.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-amber-500"
            >
              <option value="All">All 21 Disciplines ({FORMULAS_DATA.length} Concepts)</option>
              {ALL_CIVIL_SUBJECTS.map((sub) => (
                <option key={sub.id} value={sub.name}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Scrollable Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
          <button
            type="button"
            onClick={() => setActiveSubject('All')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeSubject === 'All'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>All 21 Subjects</span>
            <span className="ml-1 text-[10px] px-1.5 py-0.2 bg-slate-900/20 rounded-full font-bold">
              {FORMULAS_DATA.length}
            </span>
          </button>

          {ALL_CIVIL_SUBJECTS.map((sub) => {
            const isCurrent = activeSubject === sub.name;
            return (
              <button
                key={sub.id}
                type="button"
                id={`subject-tab-${sub.id}`}
                onClick={() => setActiveSubject(sub.name)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isCurrent
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                {getSubjectIcon(sub.iconName, 'w-3.5 h-3.5')}
                <span>{sub.shortName}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Subject Description Card */}
      {currentSubjectObj && (
        <div className="p-5 bg-amber-500/10 dark:bg-amber-500/5 rounded-2xl border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-amber-700 dark:text-amber-400 font-extrabold text-sm">
                {currentSubjectObj.name}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-800 dark:text-amber-200">
                Core Engineering Field
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              {currentSubjectObj.description}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 shrink-0">
            {currentSubjectObj.standardCodes.map((code, idx) => (
              <span
                key={idx}
                className="text-[10px] font-bold px-2 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 shadow-2xs"
              >
                {code}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Formulas & Concepts Cards Grid */}
      {filteredFormulas.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 space-y-3">
          <BookOpen className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-200">
            No concepts matched your query
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Try searching for keywords like &quot;Manning&quot;, &quot;Bernoulli&quot;, &quot;BOD&quot;, &quot;Terzaghi&quot;, &quot;Lami&quot;, &quot;IS 456&quot;, or click &quot;All 21 Subjects&quot;.
          </p>
          <button
            type="button"
            onClick={() => {
              setActiveSubject('All');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors inline-block"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredFormulas.map((item) => {
            const cleanFormula = toStandardMathFormat(item.formula);
            return (
              <div
                key={item.id}
                className="flex flex-col justify-between p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-amber-500/40 hover:shadow-md transition-all space-y-4"
              >
                <div className="space-y-3">
                  {/* Header with Category Badge & Standard Code */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {item.category}
                    </span>
                    {item.isStandardCode && (
                      <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 flex items-center space-x-1">
                        <Tag className="w-3 h-3" />
                        <span>{item.isStandardCode}</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                    {item.title}
                  </h3>

                  {/* Standard Formula Presentation Banner (Textbook Format, No Dark Monospace Terminal) */}
                  <div className="relative group p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-500/5 border-2 border-amber-500/30 dark:border-amber-500/20 text-slate-950 dark:text-amber-100 flex items-center justify-between transition-colors">
                    <div className="flex items-center space-x-3 overflow-x-auto pr-8 py-0.5 scrollbar-thin">
                      <div className="w-8 h-8 rounded-xl bg-amber-500/20 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
                        <Calculator className="w-4 h-4" />
                      </div>
                      <div className="text-sm sm:text-base font-bold tracking-tight text-slate-900 dark:text-amber-200 leading-snug select-all">
                        {cleanFormula}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(item.formula, item.id)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 hover:border-amber-500/40 transition-all"
                      title="Copy Standard Formula"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-4 h-4 text-emerald-500 font-bold" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Key Concepts Highlights */}
                  {item.keyConcepts && item.keyConcepts.length > 0 && (
                    <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800/80 space-y-1.5">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center space-x-1">
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <span>Core Principles & Rules:</span>
                      </span>
                      <ul className="space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
                        {item.keyConcepts.map((kc, kidx) => (
                          <li key={kidx} className="flex items-start space-x-1.5">
                            <span className="text-amber-500 font-bold leading-tight">•</span>
                            <span className="leading-snug">{toStandardMathFormat(kc)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Bottom Section: Variables & Practical On-Site Rule */}
                <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  {/* Variables Definition */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Symbols & Units:
                    </span>
                    <div className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                      {item.variables.map((v, idx) => (
                        <div key={idx} className="flex items-baseline space-x-2 text-[11px]">
                          <span className="font-bold text-amber-700 dark:text-amber-400 shrink-0">
                            {toStandardMathFormat(v.symbol)}:
                          </span>
                          <span className="text-slate-600 dark:text-slate-300 leading-tight">
                            {toStandardMathFormat(v.meaning)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Practical Site Rule */}
                  {item.practicalRule && (
                    <div className="p-2.5 rounded-xl bg-amber-500/10 dark:bg-amber-950/20 border border-amber-500/20 text-[11px] text-slate-800 dark:text-amber-200 flex items-start space-x-2">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                      <span className="leading-tight">
                        <strong>Site Application:</strong> {toStandardMathFormat(item.practicalRule)}
                      </span>
                    </div>
                  )}

                  {/* Attached Photos / Notes Preview If Any Exist */}
                  {(() => {
                    const att = attachmentsMap[item.id];
                    const photoCount = att?.photos?.length || 0;
                    const noteCount = att?.notes?.length || 0;
                    if (photoCount === 0 && noteCount === 0) return null;

                    return (
                      <div className="p-2.5 bg-amber-500/5 rounded-2xl border border-amber-500/20 space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-bold text-amber-700 dark:text-amber-400">
                          <span className="flex items-center space-x-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                            <span>Attached: {photoCount} Photo(s), {noteCount} Note(s)</span>
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-600 font-extrabold">
                            Unlimited
                          </span>
                        </div>
                        {photoCount > 0 && (
                          <div className="flex items-center space-x-2 overflow-x-auto py-1">
                            {att.photos.slice(0, 4).map((p) => (
                              <img
                                key={p.id}
                                src={p.url}
                                alt={p.caption || 'Site attachment'}
                                onClick={() => setActiveAttachmentFormula(item)}
                                className="w-12 h-12 rounded-xl object-cover border border-amber-500/30 cursor-pointer hover:opacity-80 shrink-0 transition-opacity"
                                title="Click to view full photo"
                              />
                            ))}
                            {photoCount > 4 && (
                              <button
                                type="button"
                                onClick={() => setActiveAttachmentFormula(item)}
                                className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-700 text-xs font-bold flex items-center justify-center shrink-0"
                              >
                                +{photoCount - 4}
                              </button>
                            )}
                          </div>
                        )}
                        {noteCount > 0 && (
                          <p className="text-[11px] text-slate-600 dark:text-slate-400 italic line-clamp-1">
                            "{att.notes[0].text}"
                          </p>
                        )}
                      </div>
                    );
                  })()}

                  {/* Card Action Controls: Attach Note/Photo & Share */}
                  {(() => {
                    const att = attachmentsMap[item.id];
                    const count = (att?.photos?.length || 0) + (att?.notes?.length || 0);

                    return (
                      <div className="pt-2 flex items-center gap-2">
                        <button
                          type="button"
                          id={`formula-attach-btn-${item.id}`}
                          onClick={() => setActiveAttachmentFormula(item)}
                          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                            count > 0
                              ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/40 hover:bg-amber-500/25'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-amber-500/40'
                          }`}
                        >
                          <Camera className="w-3.5 h-3.5" />
                          <span>Photo & Note {count > 0 ? `(${count})` : ''}</span>
                        </button>
                        <button
                          type="button"
                          id={`formula-share-btn-${item.id}`}
                          onClick={() => setActiveShareFormula(item)}
                          className="py-2 px-3 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors flex items-center space-x-1.5 cursor-pointer shrink-0"
                          title="Share Formula Card"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Share</span>
                        </button>
                      </div>
                    );
                  })()}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Item Photo & Note Modal */}
      {activeAttachmentFormula && (
        <ItemPhotoNoteModal
          isOpen={!!activeAttachmentFormula}
          onClose={() => setActiveAttachmentFormula(null)}
          targetId={activeAttachmentFormula.id}
          targetType="formula"
          targetTitle={activeAttachmentFormula.title}
          onShare={() => {
            const target = activeAttachmentFormula;
            setActiveAttachmentFormula(null);
            setActiveShareFormula(target);
          }}
          onDataUpdated={refreshAttachments}
        />
      )}

      {/* Share Card Modal */}
      {activeShareFormula && (
        <ShareCardModal
          isOpen={!!activeShareFormula}
          onClose={() => setActiveShareFormula(null)}
          targetId={activeShareFormula.id}
          title={activeShareFormula.title}
          category={activeShareFormula.category}
          subtitle={activeShareFormula.isStandardCode}
          formulaOrCode={toStandardMathFormat(activeShareFormula.formula)}
          bodyContent={activeShareFormula.description}
          practicalRule={activeShareFormula.practicalRule}
        />
      )}
    </div>
  );
};
