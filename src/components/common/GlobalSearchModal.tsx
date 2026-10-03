import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search,
  X,
  Calculator,
  BookOpen,
  Scroll,
  Layers,
  Award,
  ArrowRight,
  Sparkles,
  Command,
  History,
  Tag,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { ALL_SEARCHABLE_ITEMS, SearchableItem } from '../../data/allToolsAndTopics';
import { ActiveModule } from '../../types';
import { safeStorage } from '../../utils/safeStorage';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: ActiveModule, subTab?: string) => void;
  initialQuery?: string;
}

const RECENT_SEARCHES_KEY = 'deephelp_recent_searches';

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  initialQuery = '',
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    return safeStorage.getJSON<string[]>(RECENT_SEARCHES_KEY, [
      'Concrete Mix M20',
      'Terzaghi formula',
      'IS 456 clauses',
      'Beam reactions',
      'SSC JE PYQ',
    ]);
  });

  useEffect(() => {
    if (isOpen) {
      if (initialQuery) {
        setQuery(initialQuery);
      }
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 50);
    }
  }, [isOpen, initialQuery]);

  const categories = [
    { id: 'all', label: 'All Items (सब कुछ)' },
    { id: 'calculator', label: 'Calculators (कैलकुलेटर)' },
    { id: 'tool', label: 'Design Tools (टूल्स)' },
    { id: 'subject', label: 'Subjects (विषय)' },
    { id: 'formula', label: 'Formulas (फॉर्मूला)' },
    { id: 'code', label: 'IS Codes (आईएस कोड)' },
    { id: 'academic', label: 'PYQ & Practicals (अकादमिक)' },
  ];

  // Filtering
  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ALL_SEARCHABLE_ITEMS.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'calculator' && item.category !== 'calculator') return false;
        if (selectedCategory === 'tool' && item.category !== 'tool') return false;
        if (selectedCategory === 'subject' && item.category !== 'subject') return false;
        if (selectedCategory === 'formula' && item.category !== 'formula') return false;
        if (selectedCategory === 'code' && item.category !== 'code') return false;
        if (selectedCategory === 'academic' && item.category !== 'academic') return false;
      }

      if (!q) return true;

      // Text search
      return (
        item.title.toLowerCase().includes(q) ||
        item.titleHi.includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.keywords.some((k) => k.toLowerCase().includes(q)) ||
        (item.badge && item.badge.toLowerCase().includes(q)) ||
        (item.formulaSnippet && item.formulaSnippet.toLowerCase().includes(q))
      );
    });
  }, [query, selectedCategory]);

  // Reset selectedIndex on filter changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query, selectedCategory]);

  const handleSelectItem = (item: SearchableItem) => {
    // Save to recents
    if (query.trim()) {
      const updated = [query.trim(), ...recentSearches.filter((s) => s.toLowerCase() !== query.trim().toLowerCase())].slice(0, 8);
      setRecentSearches(updated);
      safeStorage.setJSON(RECENT_SEARCHES_KEY, updated);
    }

    onNavigate(item.targetTab, item.subTab);
    onClose();
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredItems.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredItems.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelectItem(filteredItems[selectedIndex]);
      }
    }
  };

  const getCategoryIcon = (category: SearchableItem['category']) => {
    switch (category) {
      case 'calculator':
        return <Calculator className="w-4 h-4 text-amber-500" />;
      case 'tool':
        return <Layers className="w-4 h-4 text-sky-500" />;
      case 'subject':
        return <BookOpen className="w-4 h-4 text-emerald-500" />;
      case 'formula':
        return <Sparkles className="w-4 h-4 text-purple-500" />;
      case 'code':
        return <Scroll className="w-4 h-4 text-rose-500" />;
      case 'academic':
        return <Award className="w-4 h-4 text-indigo-500" />;
      default:
        return <Search className="w-4 h-4 text-slate-500" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-start justify-center p-3 sm:p-4 md:p-6 transition-all">
      <div
        className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-4 sm:my-8 animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[88vh]"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
              <Search className="w-5 h-5 stroke-[2.3]" />
            </div>

            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search all tools, topics, formulas, IS codes, PYQs... (e.g. M20, Euler, IS 456)"
                className="w-full bg-white dark:bg-slate-800/90 text-slate-900 dark:text-white px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-sm sm:text-base font-medium placeholder-slate-400 shadow-2xs"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none pt-3 pb-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700/80'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search Results / Suggestions List */}
        <div
          ref={resultsContainerRef}
          className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 divide-y divide-slate-100 dark:divide-slate-800/60"
        >
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                <Search className="w-6 h-6" />
              </div>
              <div className="text-sm font-bold text-slate-700 dark:text-slate-200">
                No matching civil engineering tool or topic found
              </div>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Try searching for "concrete", "rebar", "beam", "footing", "terzaghi", "IS 456", or "practical".
              </p>
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectItem(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`p-3.5 rounded-2xl cursor-pointer transition-all flex items-start justify-between gap-3 group ${
                    isSelected
                      ? 'bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/40 shadow-xs'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-transparent'
                  }`}
                >
                  <div className="flex items-start space-x-3 flex-1 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950 border-amber-400'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {getCategoryIcon(item.category)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 mb-1">
                        <span className="text-xs px-2 py-0.5 rounded-md font-bold bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {item.categoryLabel}
                        </span>
                        {item.badge && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                            {item.badge}
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-[11px] font-medium text-amber-600 dark:text-amber-400/90 mb-1">
                        {item.titleHi}
                      </p>

                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>

                      {item.formulaSnippet && (
                        <div className="mt-2 inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 font-mono text-[11px] font-bold text-slate-800 dark:text-amber-300 border border-slate-200 dark:border-slate-700">
                          <span className="text-amber-500 font-sans">Formula:</span>
                          <span>{item.formulaSnippet}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center pt-2">
                    <div
                      className={`p-2 rounded-xl transition-all ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950 scale-105 shadow-xs'
                          : 'text-slate-400 group-hover:text-amber-500'
                      }`}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts & Recent quick chips */}
        <div className="p-3.5 sm:p-4 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            <span className="font-bold flex items-center space-x-1 text-slate-700 dark:text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Quick:</span>
            </span>
            {['M20 concrete', 'Beam deflection', 'Terzaghi formula', 'IS 456', 'Slump test', 'SSC JE PYQ'].map(
              (chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setQuery(chip)}
                  className="px-2 py-0.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400 border border-slate-200 dark:border-slate-700 text-[11px] font-medium transition-colors"
                >
                  {chip}
                </button>
              )
            )}
          </div>

          <div className="hidden md:flex items-center space-x-3 shrink-0 text-[11px]">
            <span className="inline-flex items-center space-x-1">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-[10px] font-bold text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
                ↑↓
              </kbd>
              <span>to navigate</span>
            </span>
            <span className="inline-flex items-center space-x-1">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-[10px] font-bold text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
                ↵
              </kbd>
              <span>to select</span>
            </span>
            <span className="inline-flex items-center space-x-1">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-[10px] font-bold text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
                esc
              </kbd>
              <span>to close</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
