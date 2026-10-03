import React, { useState, useEffect, useRef } from 'react';
import {
  AngleUnit,
  CasioMode,
  CasioVariables,
  DisplayTheme,
  EquationResult,
  TableRow,
} from './casioTypes';
import {
  evaluateCasioExpression,
  formatResultString,
  solveQuadratic,
  solveSimultaneous2,
  solveCubic,
  convertBaseN,
  generateFunctionTable,
} from './casioEngine';
import { CasioScreen } from './CasioScreen';
import { CasioKeypad } from './CasioKeypad';
import { CasioCatalogModal } from './CasioCatalogModal';
import { CasioSettingsModal } from './CasioSettingsModal';
import { CasioVariablesModal } from './CasioVariablesModal';
import { Volume2, VolumeX, Sparkles, Sun } from 'lucide-react';

interface CasioClassWizProps {
  onResultCalculated?: (expression: string, result: string) => void;
  initialExpression?: string;
}

export const CasioClassWiz: React.FC<CasioClassWizProps> = ({
  onResultCalculated,
  initialExpression,
}) => {
  // Mode & State
  const [mode, setMode] = useState<CasioMode>('calculate');
  const [expression, setExpression] = useState<string>(initialExpression || '');
  const [result, setResult] = useState<string>('0');
  const [lastAnswer, setLastAnswer] = useState<string>('0');
  const [isShift, setIsShift] = useState<boolean>(false);
  const [angleMode, setAngleMode] = useState<AngleUnit>('DEG');
  const [formatMode, setFormatMode] = useState<'standard' | 'fraction' | 'scientific' | 'dms'>(
    'standard'
  );
  const [theme, setTheme] = useState<DisplayTheme>('lcd_green');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Variables & Memory
  const [variables, setVariables] = useState<CasioVariables>({
    A: 0,
    B: 0,
    C: 0,
    D: 0,
    E: 0,
    F: 0,
    x: 0,
    y: 0,
    z: 0,
    M: 0,
    Ans: 0,
  });

  // Equation Mode State
  const [equationType, setEquationType] = useState<'quadratic' | 'cubic' | 'simultaneous2'>(
    'quadratic'
  );
  const [eqInputs, setEqInputs] = useState<Record<string, string>>({
    a: '1',
    b: '-5',
    c: '6',
    a1: '2',
    b1: '3',
    c1: '12',
    a2: '5',
    b2: '-2',
    c2: '11',
    d: '-6',
  });
  const [equationResult, setEquationResult] = useState<EquationResult | null>(null);

  // Table Mode State
  const [tableFunc, setTableFunc] = useState<string>('x^2 - 2*x + 1');
  const [tableStart, setTableStart] = useState<string>('0');
  const [tableEnd, setTableEnd] = useState<string>('5');
  const [tableStep, setTableStep] = useState<string>('1');
  const [tableRows, setTableRows] = useState<TableRow[]>([]);

  // Base-N Mode State
  const [baseNFrom, setBaseNFrom] = useState<10 | 16 | 2 | 8>(10);
  const [baseNResults, setBaseNResults] = useState<{
    dec: string;
    hex: string;
    bin: string;
    oct: string;
  }>({
    dec: '0',
    hex: '0',
    bin: '0',
    oct: '0',
  });

  // Modals
  const [isCatalogOpen, setIsCatalogOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isVariablesOpen, setIsVariablesOpen] = useState<boolean>(false);

  // Subtle keyclick synthesizer using Web Audio API
  const audioCtxRef = useRef<AudioContext | null>(null);
  const playKeyClick = () => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) audioCtxRef.current = new AudioCtx();
      }
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      if (audioCtxRef.current) {
        const osc = audioCtxRef.current.createOscillator();
        const gain = audioCtxRef.current.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(2400, audioCtxRef.current.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, audioCtxRef.current.currentTime + 0.03);
        gain.gain.setValueAtTime(0.04, audioCtxRef.current.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtxRef.current.currentTime + 0.03);
        osc.connect(gain);
        gain.connect(audioCtxRef.current.destination);
        osc.start();
        osc.stop(audioCtxRef.current.currentTime + 0.03);
      }
    } catch {
      // Audio context might be restricted before user gesture
    }
  };

  // Base-N calculation effect
  useEffect(() => {
    if (mode === 'base_n') {
      const conv = convertBaseN(expression || result || '0', baseNFrom);
      setBaseNResults(conv);
    }
  }, [expression, result, baseNFrom, mode]);

  // Handle Calculate Execution (EXE)
  const handleExecute = () => {
    playKeyClick();
    if (mode === 'equation') {
      handleSolveEquation();
      return;
    }
    if (mode === 'table') {
      handleGenerateTable();
      return;
    }

    if (!expression.trim()) return;

    try {
      const val = evaluateCasioExpression(expression, angleMode, variables);
      const formatted = formatResultString(val, formatMode);

      setResult(formatted);
      setLastAnswer(formatted);

      // Update variables
      setVariables((prev) => ({
        ...prev,
        Ans: val,
      }));

      // Turn off shift after execution
      setIsShift(false);

      if (onResultCalculated) {
        onResultCalculated(expression, formatted);
      }
    } catch (e: any) {
      setResult('Math Error');
    }
  };

  // Handle Key Press
  const handleKeyPress = (val: string) => {
    playKeyClick();
    if (mode === 'home_menu') {
      setMode('calculate');
    }
    setExpression((prev) => prev + val);
    // If shift was active, consuming a secondary key clears shift
    if (isShift) {
      setIsShift(false);
    }
  };

  const handleBackspace = () => {
    playKeyClick();
    setExpression((prev) => prev.slice(0, -1));
  };

  const handleClearAll = () => {
    playKeyClick();
    setExpression('');
    setResult('0');
    setIsShift(false);
  };

  // Format toggle (S<=>D cycle)
  const handleFormatCycle = () => {
    playKeyClick();
    const modes: ('standard' | 'fraction' | 'scientific' | 'dms')[] = [
      'standard',
      'fraction',
      'scientific',
      'dms',
    ];
    const currentIndex = modes.indexOf(formatMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setFormatMode(nextMode);

    // Re-format current result if numeric
    const parsed = parseFloat(result.replace(/×10\^/g, 'e'));
    if (!isNaN(parsed)) {
      setResult(formatResultString(parsed, nextMode));
    }
  };

  // Directional arrow navigation
  const handleArrowNav = (dir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | 'OK') => {
    playKeyClick();
    if (mode === 'home_menu' && dir === 'OK') {
      setMode('calculate');
      return;
    }
    if (dir === 'OK') {
      handleExecute();
    }
  };

  // Solve Equation
  const handleSolveEquation = () => {
    playKeyClick();
    try {
      if (equationType === 'quadratic') {
        const a = parseFloat(eqInputs.a || '0');
        const b = parseFloat(eqInputs.b || '0');
        const c = parseFloat(eqInputs.c || '0');
        const res = solveQuadratic(a, b, c);
        setEquationResult(res);
        if (res.roots[0] && onResultCalculated) {
          onResultCalculated(
            `Roots of ${a}x² + ${b}x + ${c} = 0`,
            res.roots.map((r) => `${r.label}=${r.value}`).join(', ')
          );
        }
      } else if (equationType === 'simultaneous2') {
        const a1 = parseFloat(eqInputs.a1 || '0');
        const b1 = parseFloat(eqInputs.b1 || '0');
        const c1 = parseFloat(eqInputs.c1 || '0');
        const a2 = parseFloat(eqInputs.a2 || '0');
        const b2 = parseFloat(eqInputs.b2 || '0');
        const c2 = parseFloat(eqInputs.c2 || '0');
        const res = solveSimultaneous2(a1, b1, c1, a2, b2, c2);
        setEquationResult(res);
        if (res.roots[0] && onResultCalculated) {
          onResultCalculated(
            `Simultaneous (2 unknowns)`,
            res.roots.map((r) => `${r.label}=${r.value}`).join(', ')
          );
        }
      } else if (equationType === 'cubic') {
        const a = parseFloat(eqInputs.a || '0');
        const b = parseFloat(eqInputs.b || '0');
        const c = parseFloat(eqInputs.c || '0');
        const d = parseFloat(eqInputs.d || '0');
        const res = solveCubic(a, b, c, d);
        setEquationResult(res);
        if (res.roots[0] && onResultCalculated) {
          onResultCalculated(
            `Roots of ${a}x³ + ${b}x² + ${c}x + ${d} = 0`,
            res.roots.map((r) => `${r.label}=${r.value}`).join(', ')
          );
        }
      }
    } catch {
      setEquationResult({
        type: equationType,
        roots: [{ label: 'Error', value: 'Invalid equation inputs' }],
      });
    }
  };

  // Generate Table
  const handleGenerateTable = () => {
    playKeyClick();
    try {
      const start = parseFloat(tableStart || '0');
      const end = parseFloat(tableEnd || '5');
      const step = parseFloat(tableStep || '1');
      const rows = generateFunctionTable(tableFunc, start, end, step);
      setTableRows(rows);
    } catch {
      setTableRows([]);
    }
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
        handleKeyPress(e.key);
      } else if (e.key === '+') {
        handleKeyPress('+');
      } else if (e.key === '-') {
        handleKeyPress('−');
      } else if (e.key === '*') {
        handleKeyPress('×');
      } else if (e.key === '/') {
        handleKeyPress('÷');
      } else if (e.key === '(' || e.key === ')') {
        handleKeyPress(e.key);
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleExecute();
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Escape') {
        handleClearAll();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [expression, mode, angleMode, formatMode, isShift]);

  return (
    <div className="flex justify-center w-full">
      {/* Physical Handheld Casing (fx-991CW authentic form factor) */}
      <div
        id="casio-fx991cw-device"
        className="w-full max-w-[440px] bg-gradient-to-b from-[#1c1d22] via-[#141519] to-[#0e0f12] rounded-[40px] p-4 sm:p-5 border-2 border-slate-700/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_15px_rgba(0,0,0,0.5)] relative overflow-hidden"
      >
        {/* Subtle physical casing highlights & texture */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-slate-500/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-2 bg-black/40 rounded-b-[40px]" />

        {/* ========================================================================= */}
        {/* TOP BRAND PANEL & SOLAR CELL (Identical to CASIO fx-991CW)                */}
        {/* ========================================================================= */}
        <div className="flex items-center justify-between pb-3 px-1">
          {/* CASIO fx-991CW Logo */}
          <div>
            <div className="text-white font-sans font-black text-xl tracking-tight leading-none">
              CASIO
            </div>
            <div className="text-[11px] font-bold tracking-wider text-slate-300 font-sans mt-0.5">
              fx-991CW
            </div>
          </div>

          {/* Quick Sound & Theme Controls */}
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1 rounded-md text-slate-400 hover:text-slate-200 transition-colors"
              title={soundEnabled ? 'Mute Key Sound' : 'Enable Key Sound'}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            {/* Solar Cell Panel with dark amber-burgundy photovoltaic lines */}
            <div
              className="w-28 h-8 rounded-lg bg-gradient-to-b from-[#3d1818] via-[#2a1010] to-[#1a0808] border border-amber-900/60 shadow-inner flex items-center justify-center relative overflow-hidden px-1"
              title="Photovoltaic Solar Power Cell"
            >
              {/* Solar cell grid lines */}
              <div className="w-full h-full flex justify-between items-center opacity-30 pointer-events-none">
                <div className="w-px h-full bg-amber-200" />
                <div className="w-px h-full bg-amber-200" />
                <div className="w-px h-full bg-amber-200" />
                <div className="w-px h-full bg-amber-200" />
              </div>
              {/* Glass sheen highlight */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/15 pointer-events-none" />
              <span className="text-[8px] font-black tracking-widest text-amber-500/80 uppercase select-none">
                TWO WAY POWER
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* LCD DOT-MATRIX SCREEN                                                     */}
        {/* ========================================================================= */}
        <CasioScreen
          mode={mode}
          onSelectMode={(m) => {
            playKeyClick();
            setMode(m);
          }}
          expression={expression}
          result={result}
          lastAnswer={lastAnswer}
          isShift={isShift}
          angleMode={angleMode}
          hasMemory={variables.M !== 0}
          formatMode={formatMode}
          theme={theme}
          equationType={equationType}
          onSetEquationType={setEquationType}
          eqInputs={eqInputs}
          onUpdateEqInput={(k, v) => setEqInputs((prev) => ({ ...prev, [k]: v }))}
          onSolveEquation={handleSolveEquation}
          equationResult={equationResult}
          tableFunc={tableFunc}
          onSetTableFunc={setTableFunc}
          tableStart={tableStart}
          onSetTableStart={setTableStart}
          tableEnd={tableEnd}
          onSetTableEnd={setTableEnd}
          tableStep={tableStep}
          onSetTableStep={setTableStep}
          onGenerateTable={handleGenerateTable}
          tableRows={tableRows}
          baseNValue={expression}
          baseNFrom={baseNFrom}
          onSetBaseNFrom={setBaseNFrom}
          baseNResults={baseNResults}
        />

        {/* CLASSWIZ Metallic Engraved Badge */}
        <div className="flex justify-end pt-1.5 pb-1 px-1">
          <span className="text-[10px] font-sans font-black tracking-widest text-slate-400/80 uppercase select-none drop-shadow-sm">
            CLASSWIZ
          </span>
        </div>

        {/* ========================================================================= */}
        {/* CASIO PHYSICAL KEYPAD                                                     */}
        {/* ========================================================================= */}
        <CasioKeypad
          isShift={isShift}
          onToggleShift={() => {
            playKeyClick();
            setIsShift(!isShift);
          }}
          onHomeClick={() => {
            playKeyClick();
            setMode(mode === 'home_menu' ? 'calculate' : 'home_menu');
          }}
          onSettingsClick={() => {
            playKeyClick();
            setIsSettingsOpen(true);
          }}
          onBackClick={() => {
            playKeyClick();
            if (mode !== 'calculate') {
              setMode('calculate');
            } else {
              handleBackspace();
            }
          }}
          onCatalogClick={() => {
            playKeyClick();
            setIsCatalogOpen(true);
          }}
          onToolsClick={() => {
            playKeyClick();
            handleFormatCycle();
          }}
          onVariableClick={() => {
            playKeyClick();
            setIsVariablesOpen(true);
          }}
          onFunctionClick={() => {
            playKeyClick();
            handleKeyPress('f(x)');
          }}
          onFormatClick={handleFormatCycle}
          onKeyPress={handleKeyPress}
          onBackspace={handleBackspace}
          onClearAll={handleClearAll}
          onExecute={handleExecute}
          onArrowNav={handleArrowNav}
        />

        {/* Modals */}
        <CasioCatalogModal
          isOpen={isCatalogOpen}
          onClose={() => setIsCatalogOpen(false)}
          onInsertCode={(code) => {
            handleKeyPress(code);
          }}
        />

        <CasioSettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          angleMode={angleMode}
          onSetAngleMode={setAngleMode}
          theme={theme}
          onSetTheme={setTheme}
        />

        <CasioVariablesModal
          isOpen={isVariablesOpen}
          onClose={() => setIsVariablesOpen(false)}
          variables={variables}
          onUpdateVariable={(k, v) => setVariables((prev) => ({ ...prev, [k]: v }))}
          onInsertVar={(v) => handleKeyPress(v)}
          currentResult={result}
        />
      </div>
    </div>
  );
};
