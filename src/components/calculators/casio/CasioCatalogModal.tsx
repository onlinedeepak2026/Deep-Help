import React, { useState } from 'react';
import { BookOpen, X, Search, Check, Sparkles, Building2, Sigma } from 'lucide-react';

interface CatalogItem {
  name: string;
  code: string;
  category: 'civil' | 'math' | 'physics' | 'stats';
  desc: string;
}

const CATALOG_ITEMS: CatalogItem[] = [
  // Civil Engineering
  {
    name: 'Steel Rebar Unit Weight',
    code: '(12^2)/162',
    category: 'civil',
    desc: 'D²/162 kg/m for 12mm rebar',
  },
  {
    name: 'Rebar Area (16mm)',
    code: '(π*(16^2))/4',
    category: 'civil',
    desc: 'Cross-sectional area of 16mm rebar (mm²)',
  },
  {
    name: 'RCC Unit Weight',
    code: '25',
    category: 'civil',
    desc: 'Reinforced Concrete density (kN/m³)',
  },
  {
    name: 'PCC Unit Weight',
    code: '24',
    category: 'civil',
    desc: 'Plain Cement Concrete density (kN/m³)',
  },
  {
    name: 'Steel Modulus of Elasticity (Es)',
    code: '2*10^5',
    category: 'civil',
    desc: 'Es = 2 × 10⁵ N/mm² (MPa)',
  },
  {
    name: 'Concrete Modulus (M25 Ec = 5000√fck)',
    code: '5000*√(25)',
    category: 'civil',
    desc: 'IS 456-2000 short term static modulus (MPa)',
  },
  {
    name: 'Structural Steel Density',
    code: '7850',
    category: 'civil',
    desc: 'Steel density 7,850 kg/m³',
  },
  {
    name: 'Standard Acceleration (g)',
    code: '9.81',
    category: 'physics',
    desc: 'g = 9.80665 m/s²',
  },
  {
    name: 'Atmospheric Pressure',
    code: '101.325',
    category: 'physics',
    desc: '1 atm = 101.325 kPa',
  },
  {
    name: 'Water Unit Weight',
    code: '9.81',
    category: 'civil',
    desc: 'γw = 9.81 kN/m³ (1000 kg/m³)',
  },
  // Advanced Math & Stats
  {
    name: 'Permutation 5P2',
    code: '5P2',
    category: 'stats',
    desc: 'Permutation nPr = n! / (n-r)!',
  },
  {
    name: 'Combination 5C2',
    code: '5C2',
    category: 'stats',
    desc: 'Combination nCr = n! / [r!(n-r)!]',
  },
  {
    name: 'Hyperbolic Sine (sinh)',
    code: 'sinh(',
    category: 'math',
    desc: 'Hyperbolic sine function',
  },
  {
    name: 'Hyperbolic Cosine (cosh)',
    code: 'cosh(',
    category: 'math',
    desc: 'Hyperbolic cosine function',
  },
  {
    name: 'Euler Number (e)',
    code: 'e',
    category: 'math',
    desc: 'e ≈ 2.718281828...',
  },
  {
    name: 'Archimedes Constant (π)',
    code: 'π',
    category: 'math',
    desc: 'π ≈ 3.141592653...',
  },
];

interface CasioCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertCode: (code: string) => void;
}

export const CasioCatalogModal: React.FC<CasioCatalogModalProps> = ({
  isOpen,
  onClose,
  onInsertCode,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<'all' | 'civil' | 'math' | 'physics' | 'stats'>('all');

  if (!isOpen) return null;

  const filtered = CATALOG_ITEMS.filter((item) => {
    const matchCat = selectedCat === 'all' || item.category === selectedCat;
    const matchSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.desc.toLowerCase().includes(search.toLowerCase()) ||
      item.code.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                ClassWiz Function &amp; Constant Catalog
              </h3>
              <p className="text-xs text-slate-500">CASIO fx-991CW Built-in Scientific Library</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Search */}
        <div className="p-3 sm:p-4 border-b border-slate-200 dark:border-slate-800 space-y-2.5">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search constants, civil formulas, modulus..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-amber-500 text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none text-xs">
            {[
              { id: 'all', label: 'All Catalog' },
              { id: 'civil', label: 'Civil Engineering' },
              { id: 'physics', label: 'Physics Constants' },
              { id: 'math', label: 'Mathematics' },
              { id: 'stats', label: 'Probability & Stats' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCat(cat.id as any)}
                className={`px-2.5 py-1 rounded-lg font-bold whitespace-nowrap transition-colors ${
                  selectedCat === cat.id
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2">
          {filtered.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                onInsertCode(item.code);
                onClose();
              }}
              className="w-full text-left p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-amber-500/10 border border-slate-200 dark:border-slate-700/80 hover:border-amber-500/40 transition-all flex items-center justify-between group"
            >
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-extrabold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400">
                    {item.name}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold uppercase">
                    {item.category}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{item.desc}</p>
              </div>

              <div className="text-right pl-3">
                <span className="px-2 py-1 rounded-md bg-amber-500/20 text-amber-600 dark:text-amber-300 font-mono text-xs font-bold block">
                  {item.code}
                </span>
                <span className="text-[9px] text-slate-400 mt-0.5 block group-hover:text-amber-500">
                  Click to Insert
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
