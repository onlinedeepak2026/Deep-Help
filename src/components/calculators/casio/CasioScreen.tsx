import React from 'react';
import { AngleUnit, CasioMode, DisplayTheme, EquationResult, TableRow } from './casioTypes';
import {
  Calculator,
  Table,
  Equal,
  FileSpreadsheet,
  Binary,
  Compass,
  Sun,
  ChevronRight,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';

interface CasioScreenProps {
  mode: CasioMode;
  onSelectMode: (m: CasioMode) => void;
  expression: string;
  result: string;
  lastAnswer: string;
  isShift: boolean;
  angleMode: AngleUnit;
  hasMemory: boolean;
  formatMode: 'standard' | 'fraction' | 'scientific' | 'dms';
  theme: DisplayTheme;
  // Equation mode props
  equationType: 'quadratic' | 'cubic' | 'simultaneous2';
  onSetEquationType: (type: 'quadratic' | 'cubic' | 'simultaneous2') => void;
  eqInputs: Record<string, string>;
  onUpdateEqInput: (key: string, val: string) => void;
  onSolveEquation: () => void;
  equationResult: EquationResult | null;
  // Table mode props
  tableFunc: string;
  onSetTableFunc: (f: string) => void;
  tableStart: string;
  onSetTableStart: (v: string) => void;
  tableEnd: string;
  onSetTableEnd: (v: string) => void;
  tableStep: string;
  onSetTableStep: (v: string) => void;
  onGenerateTable: () => void;
  tableRows: TableRow[];
  // Base-N props
  baseNValue: string;
  baseNFrom: 10 | 16 | 2 | 8;
  onSetBaseNFrom: (b: 10 | 16 | 2 | 8) => void;
  baseNResults: { dec: string; hex: string; bin: string; oct: string };
}

export const CasioScreen: React.FC<CasioScreenProps> = ({
  mode,
  onSelectMode,
  expression,
  result,
  lastAnswer,
  isShift,
  angleMode,
  hasMemory,
  formatMode,
  theme,
  equationType,
  onSetEquationType,
  eqInputs,
  onUpdateEqInput,
  onSolveEquation,
  equationResult,
  tableFunc,
  onSetTableFunc,
  tableStart,
  onSetTableStart,
  tableEnd,
  onSetTableEnd,
  tableStep,
  onSetTableStep,
  onGenerateTable,
  tableRows,
  baseNValue,
  baseNFrom,
  onSetBaseNFrom,
  baseNResults,
}) => {
  // Theme styling definitions for authentic LCD look
  const getThemeStyles = () => {
    switch (theme) {
      case 'lcd_green':
        return {
          container: 'bg-[#d2dcd0] text-[#141c14] border-[#9aa998]',
          header: 'border-[#b5c4b3] text-[#334233]',
          screenInner: 'bg-[#cfd9ce]',
          accent: 'text-[#141c14]',
          subtext: 'text-[#3f503e]',
          pill: 'bg-[#b6c6b3] text-[#1a241a]',
          pillActive: 'bg-[#2b3a2a] text-[#d2dcd0]',
          gridHover: 'hover:bg-[#c2d0bf]',
          selectedGrid: 'bg-[#2b3a2a] text-[#d2dcd0]',
        };
      case 'lcd_blue':
        return {
          container: 'bg-[#cddce8] text-[#101e28] border-[#9db3c5]',
          header: 'border-[#b1c7d8] text-[#2c4355]',
          screenInner: 'bg-[#c6d7e4]',
          accent: 'text-[#101e28]',
          subtext: 'text-[#354f65]',
          pill: 'bg-[#b0c7d8] text-[#13222e]',
          pillActive: 'bg-[#1e3447] text-[#cddce8]',
          gridHover: 'hover:bg-[#b8cee0]',
          selectedGrid: 'bg-[#1e3447] text-[#cddce8]',
        };
      case 'lcd_dark':
      default:
        return {
          container: 'bg-[#0f1412] text-[#9df2a8] border-[#1e2a22]',
          header: 'border-[#1b261e] text-[#699a70]',
          screenInner: 'bg-[#0b0f0d]',
          accent: 'text-[#b6ffbf]',
          subtext: 'text-[#58825e]',
          pill: 'bg-[#18231b] text-[#86bf8e]',
          pillActive: 'bg-[#28402d] text-[#b6ffbf]',
          gridHover: 'hover:bg-[#1a261d]',
          selectedGrid: 'bg-[#28402d] text-[#b6ffbf]',
        };
    }
  };

  const st = getThemeStyles();

  return (
    <div
      id="casio-lcd-screen-container"
      className={`rounded-2xl p-3 sm:p-4 border-2 shadow-inner font-mono select-none flex flex-col justify-between min-h-[220px] sm:min-h-[250px] relative transition-colors duration-150 ${st.container}`}
    >
      {/* Top Status & Annunciator Bar */}
      <div
        className={`flex items-center justify-between text-[10px] sm:text-[11px] pb-1.5 border-b font-bold tracking-wider ${st.header}`}
      >
        <div className="flex items-center space-x-2">
          {/* Angle Mode */}
          <span className={`px-1 rounded ${st.pill}`}>{angleMode}</span>

          {/* Shift annunciator */}
          {isShift ? (
            <span className="px-1.5 py-0.2 rounded bg-amber-500 text-slate-950 font-black animate-pulse">
              S
            </span>
          ) : (
            <span className="opacity-25">S</span>
          )}

          {/* Memory annunciator */}
          {hasMemory ? (
            <span className="px-1 rounded bg-sky-600 text-white font-black">M</span>
          ) : (
            <span className="opacity-25">M</span>
          )}

          {/* Natural Textbook Display active */}
          <span className={`px-1 rounded ${st.pill}`}>Math</span>

          {/* Format indicator */}
          {formatMode !== 'standard' && (
            <span className="px-1 rounded bg-amber-600/80 text-white text-[9px] uppercase">
              {formatMode}
            </span>
          )}
        </div>

        {/* Right solar & mode indicator */}
        <div className="flex items-center space-x-2">
          <span className="text-[10px] uppercase font-bold tracking-tight">
            {mode === 'home_menu'
              ? 'MENU'
              : mode === 'calculate'
              ? 'CALC'
              : mode === 'equation'
              ? 'EQN'
              : mode === 'table'
              ? 'TABLE'
              : mode === 'base_n'
              ? 'BASE-N'
              : 'SHEET'}
          </span>
          <div className="flex items-center text-[10px] opacity-80" title="Solar Cell Powered">
            <Sun className="w-3 h-3 text-amber-500 mr-0.5" />
            <span className="text-[9px]">SOLAR</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. HOME ICON MENU (Exactly matching CASIO ClassWiz fx-991CW screen)       */}
      {/* ========================================================================= */}
      {mode === 'home_menu' && (
        <div className="py-2 space-y-2.5">
          <div className="text-[11px] font-bold tracking-wide uppercase flex items-center justify-between border-b pb-1 opacity-80">
            <span>ClassWiz App Icons</span>
            <span className="text-[9px]">Select an App &amp; Press OK / Click</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {/* Calculate */}
            <button
              type="button"
              onClick={() => onSelectMode('calculate')}
              className={`p-2 rounded-xl text-center border transition-all cursor-pointer flex flex-col items-center justify-center ${st.gridHover}`}
            >
              <div className="w-8 h-8 rounded-lg bg-black/10 dark:bg-white/10 flex items-center justify-center mb-1">
                <Calculator className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold leading-tight">Calculate</span>
              <span className="text-[9px] opacity-70">Natural VPAM</span>
            </button>

            {/* Equation XY=0 */}
            <button
              type="button"
              onClick={() => onSelectMode('equation')}
              className={`p-2 rounded-xl text-center border transition-all cursor-pointer flex flex-col items-center justify-center ${st.gridHover}`}
            >
              <div className="w-8 h-8 rounded-lg bg-black/10 dark:bg-white/10 flex items-center justify-center mb-1 font-bold text-xs">
                XY=0
              </div>
              <span className="text-xs font-bold leading-tight">Equation</span>
              <span className="text-[9px] opacity-70">Poly &amp; Sim</span>
            </button>

            {/* Table f(x) */}
            <button
              type="button"
              onClick={() => onSelectMode('table')}
              className={`p-2 rounded-xl text-center border transition-all cursor-pointer flex flex-col items-center justify-center ${st.gridHover}`}
            >
              <div className="w-8 h-8 rounded-lg bg-black/10 dark:bg-white/10 flex items-center justify-center mb-1 font-bold text-xs">
                f(x)
              </div>
              <span className="text-xs font-bold leading-tight">Table</span>
              <span className="text-[9px] opacity-70">Function Range</span>
            </button>

            {/* Base-N 2 8 10 16 */}
            <button
              type="button"
              onClick={() => onSelectMode('base_n')}
              className={`p-2 rounded-xl text-center border transition-all cursor-pointer flex flex-col items-center justify-center ${st.gridHover}`}
            >
              <div className="w-8 h-8 rounded-lg bg-black/10 dark:bg-white/10 flex items-center justify-center mb-1 font-bold text-[10px]">
                2 8 10 16
              </div>
              <span className="text-xs font-bold leading-tight">Base-N</span>
              <span className="text-[9px] opacity-70">Hex/Dec/Bin/Oct</span>
            </button>

            {/* Spreadsheet */}
            <button
              type="button"
              onClick={() => onSelectMode('spreadsheet')}
              className={`p-2 rounded-xl text-center border transition-all cursor-pointer flex flex-col items-center justify-center ${st.gridHover}`}
            >
              <div className="w-8 h-8 rounded-lg bg-black/10 dark:bg-white/10 flex items-center justify-center mb-1">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold leading-tight">Spreadsheet</span>
              <span className="text-[9px] opacity-70">Quantity Sheet</span>
            </button>

            {/* Complex */}
            <button
              type="button"
              onClick={() => onSelectMode('calculate')}
              className={`p-2 rounded-xl text-center border transition-all cursor-pointer flex flex-col items-center justify-center ${st.gridHover}`}
            >
              <div className="w-8 h-8 rounded-lg bg-black/10 dark:bg-white/10 flex items-center justify-center mb-1 font-bold text-xs">
                i∠
              </div>
              <span className="text-xs font-bold leading-tight">Complex</span>
              <span className="text-[9px] opacity-70">Polar &amp; Rect</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. NATURAL CALCULATE DISPLAY                                              */}
      {/* ========================================================================= */}
      {mode === 'calculate' && (
        <div className="flex-1 flex flex-col justify-between py-2">
          {/* Natural Expression Input Area */}
          <div className="min-h-[50px] overflow-x-auto whitespace-nowrap scrollbar-none py-1.5 flex flex-col justify-center">
            <div className="text-xs sm:text-sm font-semibold opacity-90 tracking-wide font-mono">
              {expression ? (
                <span className="inline-flex items-center space-x-1">
                  <span>{expression}</span>
                  <span className="inline-block w-1.5 h-3.5 bg-current animate-pulse ml-0.5" />
                </span>
              ) : (
                <span className="opacity-40 italic">0 (Ready for calculation)</span>
              )}
            </div>
          </div>

          {/* Result Output Line */}
          <div className="pt-2 border-t border-black/10 dark:border-white/10 flex items-end justify-between">
            <div className="text-[10px] opacity-60 font-sans">
              Ans: <span className="font-mono font-bold">{lastAnswer}</span>
            </div>

            <div className="text-right">
              <div className="text-2xl sm:text-3xl font-black tracking-tight font-mono break-all leading-none">
                {result}
              </div>
              <div className="text-[9px] opacity-60 mt-1 uppercase font-semibold">
                [FORMAT: {formatMode.toUpperCase()}]
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. EQUATION SOLVER (XY=0)                                                 */}
      {/* ========================================================================= */}
      {mode === 'equation' && (
        <div className="py-2 space-y-2 flex-1 flex flex-col justify-between">
          <div>
            {/* Equation Sub-type selection */}
            <div className="flex items-center space-x-1.5 pb-2 text-[10px] border-b border-black/10 dark:border-white/10">
              <button
                type="button"
                onClick={() => onSetEquationType('quadratic')}
                className={`px-2 py-1 rounded font-bold ${
                  equationType === 'quadratic' ? st.pillActive : st.pill
                }`}
              >
                ax² + bx + c = 0
              </button>
              <button
                type="button"
                onClick={() => onSetEquationType('simultaneous2')}
                className={`px-2 py-1 rounded font-bold ${
                  equationType === 'simultaneous2' ? st.pillActive : st.pill
                }`}
              >
                Simultaneous (2 Unknowns)
              </button>
              <button
                type="button"
                onClick={() => onSetEquationType('cubic')}
                className={`px-2 py-1 rounded font-bold ${
                  equationType === 'cubic' ? st.pillActive : st.pill
                }`}
              >
                ax³ + bx² + cx + d = 0
              </button>
            </div>

            {/* Inputs based on type */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-2 text-[11px]">
              {equationType === 'quadratic' && (
                <>
                  <div className="flex items-center space-x-1">
                    <span className="font-bold">a:</span>
                    <input
                      type="text"
                      value={eqInputs.a ?? '1'}
                      onChange={(e) => onUpdateEqInput('a', e.target.value)}
                      className="w-14 px-1.5 py-0.5 rounded border border-black/20 dark:border-white/20 bg-transparent text-center font-bold"
                    />
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="font-bold">b:</span>
                    <input
                      type="text"
                      value={eqInputs.b ?? '-5'}
                      onChange={(e) => onUpdateEqInput('b', e.target.value)}
                      className="w-14 px-1.5 py-0.5 rounded border border-black/20 dark:border-white/20 bg-transparent text-center font-bold"
                    />
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="font-bold">c:</span>
                    <input
                      type="text"
                      value={eqInputs.c ?? '6'}
                      onChange={(e) => onUpdateEqInput('c', e.target.value)}
                      className="w-14 px-1.5 py-0.5 rounded border border-black/20 dark:border-white/20 bg-transparent text-center font-bold"
                    />
                  </div>
                </>
              )}

              {equationType === 'simultaneous2' && (
                <div className="col-span-full grid grid-cols-3 gap-1.5 text-[10px]">
                  <div className="col-span-full text-[9px] font-bold opacity-75">
                    Row 1: a₁x + b₁y = c₁ &nbsp;|&nbsp; Row 2: a₂x + b₂y = c₂
                  </div>
                  <input
                    placeholder="a₁"
                    value={eqInputs.a1 ?? '2'}
                    onChange={(e) => onUpdateEqInput('a1', e.target.value)}
                    className="p-1 rounded border border-black/20 dark:border-white/20 bg-transparent text-center"
                  />
                  <input
                    placeholder="b₁"
                    value={eqInputs.b1 ?? '3'}
                    onChange={(e) => onUpdateEqInput('b1', e.target.value)}
                    className="p-1 rounded border border-black/20 dark:border-white/20 bg-transparent text-center"
                  />
                  <input
                    placeholder="c₁"
                    value={eqInputs.c1 ?? '12'}
                    onChange={(e) => onUpdateEqInput('c1', e.target.value)}
                    className="p-1 rounded border border-black/20 dark:border-white/20 bg-transparent text-center"
                  />
                  <input
                    placeholder="a₂"
                    value={eqInputs.a2 ?? '5'}
                    onChange={(e) => onUpdateEqInput('a2', e.target.value)}
                    className="p-1 rounded border border-black/20 dark:border-white/20 bg-transparent text-center"
                  />
                  <input
                    placeholder="b₂"
                    value={eqInputs.b2 ?? '-2'}
                    onChange={(e) => onUpdateEqInput('b2', e.target.value)}
                    className="p-1 rounded border border-black/20 dark:border-white/20 bg-transparent text-center"
                  />
                  <input
                    placeholder="c₂"
                    value={eqInputs.c2 ?? '11'}
                    onChange={(e) => onUpdateEqInput('c2', e.target.value)}
                    className="p-1 rounded border border-black/20 dark:border-white/20 bg-transparent text-center"
                  />
                </div>
              )}

              {equationType === 'cubic' && (
                <>
                  <div className="flex items-center space-x-1">
                    <span className="font-bold">a:</span>
                    <input
                      type="text"
                      value={eqInputs.a ?? '1'}
                      onChange={(e) => onUpdateEqInput('a', e.target.value)}
                      className="w-12 px-1 py-0.5 rounded border border-black/20 dark:border-white/20 bg-transparent text-center font-bold"
                    />
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="font-bold">b:</span>
                    <input
                      type="text"
                      value={eqInputs.b ?? '-6'}
                      onChange={(e) => onUpdateEqInput('b', e.target.value)}
                      className="w-12 px-1 py-0.5 rounded border border-black/20 dark:border-white/20 bg-transparent text-center font-bold"
                    />
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="font-bold">c:</span>
                    <input
                      type="text"
                      value={eqInputs.c ?? '11'}
                      onChange={(e) => onUpdateEqInput('c', e.target.value)}
                      className="w-12 px-1 py-0.5 rounded border border-black/20 dark:border-white/20 bg-transparent text-center font-bold"
                    />
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="font-bold">d:</span>
                    <input
                      type="text"
                      value={eqInputs.d ?? '-6'}
                      onChange={(e) => onUpdateEqInput('d', e.target.value)}
                      className="w-12 px-1 py-0.5 rounded border border-black/20 dark:border-white/20 bg-transparent text-center font-bold"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="mt-2">
              <button
                type="button"
                onClick={onSolveEquation}
                className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center space-x-1"
              >
                <span>[EXE] Solve Roots</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Roots Result Output */}
          {equationResult && (
            <div className="p-2 rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs">
              <div className="font-bold flex items-center justify-between border-b pb-1 mb-1 text-[10px] opacity-75">
                <span>Calculated Roots</span>
                <span>{equationResult.details}</span>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                {equationResult.roots.map((r, idx) => (
                  <div key={idx} className="font-bold">
                    <span className="opacity-70">{r.label} = </span>
                    <span className="font-mono text-sm">{r.value}</span>
                  </div>
                ))}
              </div>
              {equationResult.extrema && equationResult.extrema.length > 0 && (
                <div className="mt-1 pt-1 border-t border-dashed text-[10px] opacity-80 flex items-center space-x-3">
                  {equationResult.extrema.map((ex, i) => (
                    <span key={i}>
                      {ex.label}: <strong className="font-mono">{ex.value}</strong>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. TABLE MODE (f(x))                                                      */}
      {/* ========================================================================= */}
      {mode === 'table' && (
        <div className="py-1.5 space-y-2 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-xs">
              <span className="font-bold">f(x) =</span>
              <input
                type="text"
                value={tableFunc}
                onChange={(e) => onSetTableFunc(e.target.value)}
                placeholder="e.g. x^2 - 2*x + 1"
                className="flex-1 px-2 py-0.5 rounded border border-black/20 dark:border-white/20 bg-transparent font-mono"
              />
            </div>

            <div className="grid grid-cols-4 gap-1.5 mt-2 text-[10px]">
              <div>
                <span className="block opacity-70">Start</span>
                <input
                  type="text"
                  value={tableStart}
                  onChange={(e) => onSetTableStart(e.target.value)}
                  className="w-full p-1 rounded border border-black/20 dark:border-white/20 bg-transparent font-bold text-center"
                />
              </div>
              <div>
                <span className="block opacity-70">End</span>
                <input
                  type="text"
                  value={tableEnd}
                  onChange={(e) => onSetTableEnd(e.target.value)}
                  className="w-full p-1 rounded border border-black/20 dark:border-white/20 bg-transparent font-bold text-center"
                />
              </div>
              <div>
                <span className="block opacity-70">Step</span>
                <input
                  type="text"
                  value={tableStep}
                  onChange={(e) => onSetTableStep(e.target.value)}
                  className="w-full p-1 rounded border border-black/20 dark:border-white/20 bg-transparent font-bold text-center"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={onGenerateTable}
                  className="w-full py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px]"
                >
                  Generate
                </button>
              </div>
            </div>
          </div>

          {/* Table display */}
          <div className="max-h-[110px] overflow-y-auto border rounded p-1 bg-black/5 dark:bg-white/5 text-[10px]">
            <table className="w-full text-left font-mono">
              <thead>
                <tr className="border-b">
                  <th className="py-0.5 px-1">#</th>
                  <th className="py-0.5 px-1">x</th>
                  <th className="py-0.5 px-1">f(x)</th>
                </tr>
              </thead>
              <tbody>
                {tableRows.length > 0 ? (
                  tableRows.map((r, i) => (
                    <tr key={i} className="border-b border-black/5 dark:border-white/5">
                      <td className="py-0.5 px-1 opacity-60">{i + 1}</td>
                      <td className="py-0.5 px-1 font-bold">{r.x}</td>
                      <td className="py-0.5 px-1 font-bold text-emerald-700 dark:text-emerald-300">
                        {r.fx}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="py-2 text-center opacity-60">
                      Press "Generate" to calculate table
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. BASE-N MODE (2 8 10 16)                                                */}
      {/* ========================================================================= */}
      {mode === 'base_n' && (
        <div className="py-2 space-y-2 flex-1 flex flex-col justify-between">
          <div className="flex items-center space-x-2 text-xs">
            <span className="font-bold">Input Base:</span>
            <div className="flex space-x-1">
              {[
                { label: 'Dec', b: 10 },
                { label: 'Hex', b: 16 },
                { label: 'Bin', b: 2 },
                { label: 'Oct', b: 8 },
              ].map((item) => (
                <button
                  key={item.b}
                  type="button"
                  onClick={() => onSetBaseNFrom(item.b as any)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    baseNFrom === item.b ? st.pillActive : st.pill
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Simultaneous Base outputs */}
          <div className="grid grid-cols-2 gap-2 text-xs font-mono p-2 rounded-lg bg-black/5 dark:bg-white/5 border">
            <div>
              <span className="text-[10px] opacity-60 block">DEC (Decimal):</span>
              <strong className="text-sm">{baseNResults.dec}</strong>
            </div>
            <div>
              <span className="text-[10px] opacity-60 block">HEX (Hexadecimal):</span>
              <strong className="text-sm">{baseNResults.hex}</strong>
            </div>
            <div className="col-span-2">
              <span className="text-[10px] opacity-60 block">BIN (Binary):</span>
              <strong className="text-xs break-all tracking-wider font-bold">
                {baseNResults.bin}
              </strong>
            </div>
            <div>
              <span className="text-[10px] opacity-60 block">OCT (Octal):</span>
              <strong className="text-sm">{baseNResults.oct}</strong>
            </div>
          </div>

          <div className="text-[9px] opacity-60 text-right">
            Type decimal or switch bases to convert live
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. SPREADSHEET MODE                                                       */}
      {/* ========================================================================= */}
      {mode === 'spreadsheet' && (
        <div className="py-1 space-y-1.5 flex-1 flex flex-col justify-between text-[10px]">
          <div className="font-bold flex items-center justify-between border-b pb-1">
            <span>Civil Quantity Spreadsheet (L × B × H = Vol)</span>
            <span className="text-[9px] opacity-70">Auto-calculated</span>
          </div>

          <div className="grid grid-cols-4 gap-1 font-mono">
            <div className="font-bold p-1 bg-black/5 dark:bg-white/5 rounded text-center">
              Length (m)
            </div>
            <div className="font-bold p-1 bg-black/5 dark:bg-white/5 rounded text-center">
              Width (m)
            </div>
            <div className="font-bold p-1 bg-black/5 dark:bg-white/5 rounded text-center">
              Depth (m)
            </div>
            <div className="font-bold p-1 bg-emerald-500/20 rounded text-center text-emerald-700 dark:text-emerald-300">
              Volume (m³)
            </div>

            {/* Row 1: Footing */}
            <div className="p-1 border rounded text-center">3.50</div>
            <div className="p-1 border rounded text-center">2.00</div>
            <div className="p-1 border rounded text-center">0.45</div>
            <div className="p-1 border rounded text-center font-bold">3.15 m³</div>

            {/* Row 2: Slab */}
            <div className="p-1 border rounded text-center">12.00</div>
            <div className="p-1 border rounded text-center">8.50</div>
            <div className="p-1 border rounded text-center">0.15</div>
            <div className="p-1 border rounded text-center font-bold">15.30 m³</div>

            {/* Row 3: Column */}
            <div className="p-1 border rounded text-center">0.30</div>
            <div className="p-1 border rounded text-center">0.45</div>
            <div className="p-1 border rounded text-center">3.20</div>
            <div className="p-1 border rounded text-center font-bold">0.43 m³</div>
          </div>

          <div className="text-[9px] opacity-70 text-right">
            Concrete Total: <strong>18.88 m³</strong> (~434 bags cement for M20)
          </div>
        </div>
      )}
    </div>
  );
};
