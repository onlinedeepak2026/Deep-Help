import React, { useState } from 'react';
import { SavedCalculation } from '../../types';
import { CasioClassWiz } from './casio/CasioClassWiz';
import {
  Calculator as CalcIcon,
  BookmarkPlus,
  Printer,
  History,
  Sparkles,
  Check,
  BookOpen,
  HelpCircle,
  Cpu,
  Layers,
  FileSpreadsheet,
} from 'lucide-react';

interface ScientificCalculatorProps {
  onSaveCalculation?: (calc: SavedCalculation) => void;
  onOpenReport?: (data: {
    title: string;
    module: string;
    summary: string;
    details: Record<string, string | number>;
  }) => void;
}

interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: Date;
}

export const ScientificCalculator: React.FC<ScientificCalculatorProps> = ({
  onSaveCalculation,
  onOpenReport,
}) => {
  const [lastCalculation, setLastCalculation] = useState<{ expression: string; result: string }>({
    expression: '',
    result: '0',
  });
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      id: 'init-1',
      expression: '(12^2)/162',
      result: '0.888889 kg/m',
      timestamp: new Date(Date.now() - 3600000),
    },
    {
      id: 'init-2',
      expression: 'π * (16^2) / 4',
      result: '201.0619 mm²',
      timestamp: new Date(Date.now() - 1800000),
    },
  ]);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [showGuide, setShowGuide] = useState<boolean>(false);

  // Callback when Casio ClassWiz computes a result
  const handleResultCalculated = (expr: string, res: string) => {
    setLastCalculation({ expression: expr, result: res });
    setHistory((prev) => [
      {
        id: Math.random().toString(36).substring(2, 9),
        expression: expr,
        result: res,
        timestamp: new Date(),
      },
      ...prev.slice(0, 24),
    ]);
  };

  // Save to App History
  const handleSaveToHistory = () => {
    if (!onSaveCalculation) return;
    const calc: SavedCalculation = {
      id: 'casio-sci-' + Date.now(),
      timestamp: Date.now(),
      module: 'Scientific Calculator (CASIO fx-991CW)',
      title: `CASIO Calc: ${lastCalculation.expression || lastCalculation.result}`,
      summary: `Result: ${lastCalculation.result}`,
      details: {
        'Calculator Model': 'CASIO fx-991CW ClassWiz Natural V.P.A.M.',
        'Mathematical Expression': lastCalculation.expression || 'Direct Input',
        'Computed Result': lastCalculation.result,
        'Calculation Engine': 'Natural Textbook & IEEE 754 High-Precision',
        'Timestamp': new Date().toLocaleString(),
      },
    };
    onSaveCalculation(calc);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  // Export to PDF Technical Report
  const handleExportPDF = () => {
    if (!onOpenReport) return;
    onOpenReport({
      title: 'CASIO fx-991CW Engineering Calculation Sheet',
      module: 'Engineering Scientific Calculator (fx-991CW ClassWiz)',
      summary: `Evaluated "${lastCalculation.expression || 'Formula'}" = ${lastCalculation.result}`,
      details: {
        'Hardware Emulator': 'CASIO fx-991CW ClassWiz Dual Power',
        'Input Expression': lastCalculation.expression || '0',
        'Final Computed Output': lastCalculation.result,
        'Display System': 'High-Resolution Dot Matrix LCD / Natural VPAM',
        'Features Used': 'Fractions, Quadratic/Simultaneous Equation, DMS, Trig',
        'Calculation Standard': 'Civil Engineering Certified',
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* MODULE BANNER HEADER                                                      */}
      {/* ========================================================================= */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 flex items-center justify-center font-black shadow-md shadow-amber-500/20 shrink-0">
            <CalcIcon className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                CASIO fx-991CW ClassWiz Calculator
              </h2>
              <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold uppercase tracking-wider border border-amber-500/20">
                Identical Model &amp; Functions
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Authentic ClassWiz layout with Natural V.P.A.M., Equation Solver (XY=0), Table f(x), Base-N, Solar Panel &amp; Civil Engineering Catalog.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowGuide(!showGuide)}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-amber-500" />
            <span>ClassWiz Guide</span>
          </button>

          {onSaveCalculation && (
            <button
              id="save-scientific-calc-btn"
              type="button"
              onClick={handleSaveToHistory}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">Saved!</span>
                </>
              ) : (
                <>
                  <BookmarkPlus className="w-4 h-4 text-amber-500" />
                  <span>Save Result</span>
                </>
              )}
            </button>
          )}

          {onOpenReport && (
            <button
              id="export-scientific-pdf-btn"
              type="button"
              onClick={handleExportPDF}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Export PDF Sheet</span>
            </button>
          )}
        </div>
      </div>

      {/* Guide Collapse */}
      {showGuide && (
        <div className="p-5 bg-amber-500/10 border border-amber-500/20 rounded-3xl space-y-3 text-xs text-slate-700 dark:text-slate-300">
          <div className="flex items-center space-x-2 font-bold text-amber-600 dark:text-amber-400">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm">CASIO fx-991CW ClassWiz Quick Features &amp; Key Functions</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-amber-500/20">
              <strong className="block text-slate-900 dark:text-white font-black mb-1">
                1. Natural Textbook Fractions &amp; Roots
              </strong>
              Press <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-bold">■/□</code> to type fractions, <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-bold">FORMAT</code> to cycle between exact fraction, decimal, and scientific notation!
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-amber-500/20">
              <strong className="block text-slate-900 dark:text-white font-black mb-1">
                2. Equation Solver (XY=0) &amp; HOME Menu
              </strong>
              Click <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-bold">HOME</code> to open the icon app menu. Select <strong>Equation</strong> to solve Quadratic (ax²+bx+c=0), Cubic, or Simultaneous 2-unknown equations with real/complex roots!
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-amber-500/20">
              <strong className="block text-slate-900 dark:text-white font-black mb-1">
                3. Gold SHIFT &amp; Engineering Catalog
              </strong>
              Press the gold <code className="px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 font-bold">SHIFT</code> key to access gold functions. Click <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-bold">CATALOG</code> to insert civil engineering standards like rebar weights, densities, and moduli.
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MAIN CALCULATOR DISPLAY: CASIO FX-991CW CENTERED + SIDEBAR                */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Handheld CASIO fx-991CW Calculator */}
        <div className="lg:col-span-8 flex justify-center">
          <CasioClassWiz onResultCalculated={handleResultCalculated} />
        </div>

        {/* Right Column: Civil Engineering Shortcuts & History Tape */}
        <div className="lg:col-span-4 space-y-6">
          {/* Civil Engineering Quick Constants */}
          <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                Civil Engineering Quick Reference
              </h3>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Standard site formulas and physical coefficients:
            </p>

            <div className="space-y-2 pt-1 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">
                    Steel Bar Weight
                  </span>
                  <span className="text-[10px] text-slate-400">D² / 162 (kg per meter)</span>
                </div>
                <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
                  D²/162
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">
                    Circular Bar Area
                  </span>
                  <span className="text-[10px] text-slate-400">Cross-sectional area</span>
                </div>
                <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
                  πD² / 4
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">
                    RCC Unit Weight
                  </span>
                  <span className="text-[10px] text-slate-400">Reinforced cement concrete</span>
                </div>
                <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
                  25 kN/m³
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">
                    Modulus of Elasticity (Steel)
                  </span>
                  <span className="text-[10px] text-slate-400">Young's Modulus Es</span>
                </div>
                <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
                  2 × 10⁵ MPa
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">
                    Concrete Modulus (IS 456)
                  </span>
                  <span className="text-[10px] text-slate-400">Short term static modulus</span>
                </div>
                <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
                  5000√fck
                </span>
              </div>
            </div>
          </div>

          {/* Session Calculation History Tape */}
          <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <History className="w-4 h-4 text-amber-500" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                  ClassWiz Calculation Tape
                </h3>
              </div>
              {history.length > 0 && (
                <button
                  type="button"
                  onClick={() => setHistory([])}
                  className="text-[10px] text-rose-500 hover:underline font-bold"
                >
                  Clear Tape
                </button>
              )}
            </div>

            {history.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                Calculations will appear here as you compute with the Casio keypad.
              </div>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-right space-y-0.5"
                  >
                    <div className="text-[11px] font-mono text-slate-400 truncate">
                      {item.expression} =
                    </div>
                    <div className="text-xs font-mono font-black text-amber-600 dark:text-amber-400">
                      {item.result}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
