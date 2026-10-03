import React from 'react';
import {
  Home,
  SlidersHorizontal,
  Undo2,
  BookOpen,
  MoreHorizontal,
  Delete,
  ChevronsUpDown,
  Repeat,
  ArrowUp,
  Power,
} from 'lucide-react';

interface CasioKeypadProps {
  isShift: boolean;
  onToggleShift: () => void;
  onHomeClick: () => void;
  onSettingsClick: () => void;
  onBackClick: () => void;
  onCatalogClick: () => void;
  onToolsClick: () => void;
  onVariableClick: () => void;
  onFunctionClick: () => void;
  onFormatClick: () => void;
  onKeyPress: (primaryVal: string, shiftVal?: string) => void;
  onBackspace: () => void;
  onClearAll: () => void;
  onExecute: () => void;
  onArrowNav: (dir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | 'OK') => void;
}

export const CasioKeypad: React.FC<CasioKeypadProps> = ({
  isShift,
  onToggleShift,
  onHomeClick,
  onSettingsClick,
  onBackClick,
  onCatalogClick,
  onToolsClick,
  onVariableClick,
  onFunctionClick,
  onFormatClick,
  onKeyPress,
  onBackspace,
  onClearAll,
  onExecute,
  onArrowNav,
}) => {
  // Helper for pressing a key that respects SHIFT
  const handleKey = (primary: string, shift?: string) => {
    if (isShift && shift) {
      onKeyPress(shift);
    } else {
      onKeyPress(primary);
    }
  };

  return (
    <div id="casio-physical-keypad" className="space-y-2.5 pt-2 select-none">
      {/* ========================================================================= */}
      {/* TOP CONTROL CLUSTER (Directly under screen)                               */}
      {/* ON, HOME, SETTINGS, BACK + D-PAD CROSS + PAGE SCROLL                     */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-12 gap-1.5 items-center px-1">
        {/* Left 4 buttons: ON, HOME, SETTINGS, BACK */}
        <div className="col-span-4 grid grid-cols-2 gap-1.5">
          {/* ON Button */}
          <div className="flex flex-col items-center">
            <span className="text-[8px] font-bold text-slate-400 leading-none mb-0.5">ON</span>
            <button
              id="casio-key-on"
              type="button"
              onClick={onClearAll}
              className="w-10 h-7 sm:w-11 sm:h-8 rounded-full bg-gradient-to-b from-slate-700 to-slate-850 hover:from-slate-600 hover:to-slate-800 text-slate-200 border border-slate-600/60 shadow-md active:scale-95 flex items-center justify-center transition-transform"
              title="Turn ON / Reset"
            >
              <Power className="w-3.5 h-3.5 text-emerald-400" />
            </button>
          </div>

          {/* HOME Button */}
          <div className="flex flex-col items-center">
            <span className="text-[8px] font-bold text-slate-400 leading-none mb-0.5">HOME</span>
            <button
              id="casio-key-home"
              type="button"
              onClick={onHomeClick}
              className="w-10 h-7 sm:w-11 sm:h-8 rounded-full bg-gradient-to-b from-slate-700 to-slate-850 hover:from-slate-600 hover:to-slate-800 text-slate-200 border border-slate-600/60 shadow-md active:scale-95 flex items-center justify-center transition-transform"
              title="Home Menu (Apps)"
            >
              <Home className="w-3.5 h-3.5 text-amber-300" />
            </button>
          </div>

          {/* SETTINGS Button */}
          <div className="flex flex-col items-center">
            <span className="text-[8px] font-bold text-slate-400 leading-none mb-0.5">SETTINGS</span>
            <button
              id="casio-key-settings"
              type="button"
              onClick={onSettingsClick}
              className="w-10 h-7 sm:w-11 sm:h-8 rounded-full bg-gradient-to-b from-slate-700 to-slate-850 hover:from-slate-600 hover:to-slate-800 text-slate-200 border border-slate-600/60 shadow-md active:scale-95 flex items-center justify-center transition-transform"
              title="Calculator Settings (Angle, Format)"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-300" />
            </button>
          </div>

          {/* BACK Button */}
          <div className="flex flex-col items-center">
            <span className="text-[8px] font-bold text-slate-400 leading-none mb-0.5">BACK</span>
            <button
              id="casio-key-back"
              type="button"
              onClick={onBackClick}
              className="w-10 h-7 sm:w-11 sm:h-8 rounded-full bg-gradient-to-b from-slate-700 to-slate-850 hover:from-slate-600 hover:to-slate-800 text-slate-200 border border-slate-600/60 shadow-md active:scale-95 flex items-center justify-center transition-transform"
              title="Back"
            >
              <Undo2 className="w-3.5 h-3.5 text-slate-300" />
            </button>
          </div>
        </div>

        {/* Center: Authentic D-Pad Cross with central OK button */}
        <div className="col-span-5 flex justify-center items-center py-0.5">
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-slate-950 border-2 border-slate-700/80 shadow-inner flex items-center justify-center">
            {/* UP */}
            <button
              type="button"
              onClick={() => onArrowNav('UP')}
              className="absolute top-1 w-7 h-6 flex items-center justify-center text-slate-400 hover:text-white active:scale-90"
              title="Navigate Up"
            >
              <span className="text-[11px] font-black">▲</span>
            </button>

            {/* DOWN */}
            <button
              type="button"
              onClick={() => onArrowNav('DOWN')}
              className="absolute bottom-1 w-7 h-6 flex items-center justify-center text-slate-400 hover:text-white active:scale-90"
              title="Navigate Down"
            >
              <span className="text-[11px] font-black">▼</span>
            </button>

            {/* LEFT */}
            <button
              type="button"
              onClick={() => onArrowNav('LEFT')}
              className="absolute left-1 w-6 h-7 flex items-center justify-center text-slate-400 hover:text-white active:scale-90"
              title="Navigate Left"
            >
              <span className="text-[11px] font-black">◀</span>
            </button>

            {/* RIGHT */}
            <button
              type="button"
              onClick={() => onArrowNav('RIGHT')}
              className="absolute right-1 w-6 h-7 flex items-center justify-center text-slate-400 hover:text-white active:scale-90"
              title="Navigate Right"
            >
              <span className="text-[11px] font-black">▶</span>
            </button>

            {/* Central OK Button */}
            <button
              id="casio-key-ok"
              type="button"
              onClick={() => onArrowNav('OK')}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-b from-slate-700 to-slate-850 hover:from-slate-600 hover:to-slate-800 text-white font-black text-xs border border-slate-500 shadow-md active:scale-90 flex items-center justify-center transition-transform"
              title="Confirm / OK"
            >
              OK
            </button>
          </div>
        </div>

        {/* Right 3 buttons: Page Scroll Double-Arrow Key */}
        <div className="col-span-3 flex flex-col items-center justify-center">
          <span className="text-[8px] font-bold text-slate-400 leading-none mb-0.5">PAGE</span>
          <button
            type="button"
            onClick={() => onArrowNav('DOWN')}
            className="w-10 h-14 sm:w-11 sm:h-16 rounded-2xl bg-gradient-to-b from-slate-700 to-slate-850 hover:from-slate-600 hover:to-slate-800 text-slate-200 border border-slate-600/60 shadow-md active:scale-95 flex flex-col items-center justify-around py-1 transition-transform"
            title="Page Scroll"
          >
            <ChevronsUpDown className="w-5 h-5 text-slate-300" />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECOND ROW: FUNCTION KEYS (SHIFT, VARIABLE, FUNCTION, CATALOG, TOOLS)     */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-5 gap-1.5 px-1 pt-1">
        {/* SHIFT KEY: Gold circular metallic key with arrow */}
        <div className="flex flex-col items-center">
          <span className="text-[8px] font-black text-amber-400 tracking-wider leading-none mb-0.5">
            SHIFT
          </span>
          <button
            id="casio-key-shift"
            type="button"
            onClick={onToggleShift}
            className={`w-full h-8 sm:h-9 rounded-xl font-black text-xs transition-all shadow-md active:scale-95 flex items-center justify-center border ${
              isShift
                ? 'bg-amber-400 text-slate-950 border-amber-300 ring-2 ring-amber-400/50'
                : 'bg-gradient-to-b from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 border-amber-400'
            }`}
            title="Shift / Secondary functions"
          >
            <ArrowUp className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        {/* VARIABLE: [x] */}
        <div className="flex flex-col items-center">
          <span className="text-[8px] font-bold text-slate-400 leading-none mb-0.5">VARIABLE</span>
          <button
            id="casio-key-variable"
            type="button"
            onClick={onVariableClick}
            className="w-full h-8 sm:h-9 rounded-xl bg-gradient-to-b from-slate-700 to-slate-850 hover:from-slate-600 text-slate-200 border border-slate-600 shadow-md active:scale-95 flex items-center justify-center font-mono text-xs font-bold"
            title="Store / Recall Variables (A, B, C, D, E, F, x, y, z)"
          >
            [x]
          </button>
        </div>

        {/* FUNCTION: f(x) */}
        <div className="flex flex-col items-center">
          <span className="text-[8px] font-bold text-slate-400 leading-none mb-0.5">FUNCTION</span>
          <button
            id="casio-key-function"
            type="button"
            onClick={onFunctionClick}
            className="w-full h-8 sm:h-9 rounded-xl bg-gradient-to-b from-slate-700 to-slate-850 hover:from-slate-600 text-slate-200 border border-slate-600 shadow-md active:scale-95 flex items-center justify-center font-serif italic text-xs font-bold"
            title="Function definitions f(x)"
          >
            f(x)
          </button>
        </div>

        {/* CATALOG: Open book icon */}
        <div className="flex flex-col items-center">
          <span className="text-[8px] font-bold text-slate-400 leading-none mb-0.5">CATALOG</span>
          <button
            id="casio-key-catalog"
            type="button"
            onClick={onCatalogClick}
            className="w-full h-8 sm:h-9 rounded-xl bg-gradient-to-b from-slate-700 to-slate-850 hover:from-slate-600 text-slate-200 border border-slate-600 shadow-md active:scale-95 flex items-center justify-center"
            title="Catalog (Civil Engineering, Calculus, Formulas)"
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-300" />
          </button>
        </div>

        {/* TOOLS: ••• */}
        <div className="flex flex-col items-center">
          <span className="text-[8px] font-bold text-slate-400 leading-none mb-0.5">TOOLS</span>
          <button
            id="casio-key-tools"
            type="button"
            onClick={onToolsClick}
            className="w-full h-8 sm:h-9 rounded-xl bg-gradient-to-b from-slate-700 to-slate-850 hover:from-slate-600 text-slate-200 border border-slate-600 shadow-md active:scale-95 flex items-center justify-center"
            title="Tools (Format, Simplify)"
          >
            <MoreHorizontal className="w-4 h-4 text-slate-300" />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SCIENTIFIC FUNCTION ROW 1: x, ■/□, √■, ■^□, x², log_■(□)                  */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-6 gap-1.5 px-1 pt-1">
        {/* Key 1: x (gold QR) */}
        <div className="flex flex-col items-center">
          <span className="text-[8px] font-bold text-amber-400 leading-none mb-0.5">QR</span>
          <button
            type="button"
            onClick={() => handleKey('x', 'x')}
            className="w-full h-8 sm:h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-serif italic text-xs font-bold border border-slate-700 active:scale-95"
          >
            x
          </button>
        </div>

        {/* Key 2: Fraction ■/□ (gold mixed fraction) */}
        <div className="flex flex-col items-center">
          <span className="text-[8px] font-bold text-amber-400 leading-none mb-0.5">■■/□</span>
          <button
            type="button"
            onClick={() => handleKey('/', '/')}
            className="w-full h-8 sm:h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-mono text-[11px] font-bold border border-slate-700 active:scale-95 flex flex-col items-center justify-center leading-none"
          >
            <span>■</span>
            <span className="w-3 h-px bg-slate-300 my-0.5" />
            <span>□</span>
          </button>
        </div>

        {/* Key 3: √■ (gold ³√) */}
        <div className="flex flex-col items-center">
          <span className="text-[8px] font-bold text-amber-400 leading-none mb-0.5">³√■</span>
          <button
            type="button"
            onClick={() => handleKey('√(', '³√(')}
            className="w-full h-8 sm:h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-mono text-xs font-bold border border-slate-700 active:scale-95"
          >
            √■
          </button>
        </div>

        {/* Key 4: ■^□ (gold ■⁻¹) */}
        <div className="flex flex-col items-center">
          <span className="text-[8px] font-bold text-amber-400 leading-none mb-0.5">■⁻¹</span>
          <button
            type="button"
            onClick={() => handleKey('^', '^(-1)')}
            className="w-full h-8 sm:h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-mono text-xs font-bold border border-slate-700 active:scale-95"
          >
            ■<sup>□</sup>
          </button>
        </div>

        {/* Key 5: x² (gold log) */}
        <div className="flex flex-col items-center">
          <span className="text-[8px] font-bold text-amber-400 leading-none mb-0.5">log</span>
          <button
            type="button"
            onClick={() => handleKey('^2', 'log(')}
            className="w-full h-8 sm:h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-mono text-xs font-bold border border-slate-700 active:scale-95"
          >
            x²
          </button>
        </div>

        {/* Key 6: log_■(□) (gold ln) */}
        <div className="flex flex-col items-center">
          <span className="text-[8px] font-bold text-amber-400 leading-none mb-0.5">ln</span>
          <button
            type="button"
            onClick={() => handleKey('log(', 'ln(')}
            className="w-full h-8 sm:h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-mono text-[10px] font-bold border border-slate-700 active:scale-95"
          >
            log<sub>■</sub>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SCIENTIFIC FUNCTION ROW 2: Ans, sin, cos, tan, (, )                       */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-6 gap-1.5 px-1">
        {/* Key 1: Ans (gold PreAns) */}
        <div className="flex flex-col items-center">
          <span className="text-[8px] font-bold text-amber-400 leading-none mb-0.5">PreAns</span>
          <button
            type="button"
            onClick={() => handleKey('Ans', 'Ans')}
            className="w-full h-8 sm:h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs border border-slate-700 active:scale-95"
          >
            Ans
          </button>
        </div>

        {/* Key 2: sin (gold sin⁻¹) */}
        <div className="flex flex-col items-center">
          <span className="text-[8px] font-bold text-amber-400 leading-none mb-0.5">sin⁻¹</span>
          <button
            type="button"
            onClick={() => handleKey('sin(', 'sin⁻¹(')}
            className="w-full h-8 sm:h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs border border-slate-700 active:scale-95"
          >
            sin
          </button>
        </div>

        {/* Key 3: cos (gold cos⁻¹) */}
        <div className="flex flex-col items-center">
          <span className="text-[8px] font-bold text-amber-400 leading-none mb-0.5">cos⁻¹</span>
          <button
            type="button"
            onClick={() => handleKey('cos(', 'cos⁻¹(')}
            className="w-full h-8 sm:h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs border border-slate-700 active:scale-95"
          >
            cos
          </button>
        </div>

        {/* Key 4: tan (gold tan⁻¹) */}
        <div className="flex flex-col items-center">
          <span className="text-[8px] font-bold text-amber-400 leading-none mb-0.5">tan⁻¹</span>
          <button
            type="button"
            onClick={() => handleKey('tan(', 'tan⁻¹(')}
            className="w-full h-8 sm:h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs border border-slate-700 active:scale-95"
          >
            tan
          </button>
        </div>

        {/* Key 5: ( (gold =) */}
        <div className="flex flex-col items-center">
          <span className="text-[8px] font-bold text-amber-400 leading-none mb-0.5">=</span>
          <button
            type="button"
            onClick={() => handleKey('(', '=')}
            className="w-full h-8 sm:h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-sm border border-slate-700 active:scale-95"
          >
            (
          </button>
        </div>

        {/* Key 6: ) (gold ,) */}
        <div className="flex flex-col items-center">
          <span className="text-[8px] font-bold text-amber-400 leading-none mb-0.5">,</span>
          <button
            type="button"
            onClick={() => handleKey(')', ',')}
            className="w-full h-8 sm:h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-sm border border-slate-700 active:scale-95"
          >
            )
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* NUMERIC KEYPAD: 7, 8, 9, DEL, AC                                          */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-5 gap-1.5 px-1 pt-1.5">
        {/* 7 (gold π) */}
        <div className="flex flex-col items-center">
          <span className="text-[8px] font-bold text-amber-400 leading-none mb-0.5">π</span>
          <button
            type="button"
            onClick={() => handleKey('7', 'π')}
            className="w-full h-10 sm:h-11 rounded-xl bg-slate-850 hover:bg-slate-750 text-white font-mono text-base font-bold border border-slate-700 shadow active:scale-95"
          >
            7
          </button>
        </div>

        {/* 8 (gold e) */}
        <div className="flex flex-col items-center">
          <span className="text-[8px] font-bold text-amber-400 leading-none mb-0.5">e</span>
          <button
            type="button"
            onClick={() => handleKey('8', 'e')}
            className="w-full h-10 sm:h-11 rounded-xl bg-slate-850 hover:bg-slate-750 text-white font-mono text-base font-bold border border-slate-700 shadow active:scale-95"
          >
            8
          </button>
        </div>

        {/* 9 (gold i) */}
        <div className="flex flex-col items-center">
          <span className="text-[8px] font-bold text-amber-400 leading-none mb-0.5">i</span>
          <button
            type="button"
            onClick={() => handleKey('9', 'i')}
            className="w-full h-10 sm:h-11 rounded-xl bg-slate-850 hover:bg-slate-750 text-white font-mono text-base font-bold border border-slate-700 shadow active:scale-95"
          >
            9
          </button>
        </div>

        {/* ⌫ DEL (gold INS) */}
        <div className="flex flex-col items-center">
          <span className="text-[8px] font-bold text-amber-400 leading-none mb-0.5">INS</span>
          <button
            type="button"
            onClick={onBackspace}
            className="w-full h-10 sm:h-11 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs border border-slate-600 shadow active:scale-95 flex items-center justify-center"
            title="Delete / Backspace"
          >
            <Delete className="w-4 h-4" />
          </button>
        </div>

        {/* AC All Clear (gold OFF) */}
        <div className="flex flex-col items-center">
          <span className="text-[8px] font-bold text-amber-400 leading-none mb-0.5">OFF</span>
          <button
            type="button"
            onClick={onClearAll}
            className="w-full h-10 sm:h-11 rounded-xl bg-gradient-to-b from-rose-900 to-rose-950 hover:from-rose-800 hover:to-rose-900 text-rose-200 font-black text-xs border border-rose-700 shadow active:scale-95"
            title="All Clear"
          >
            AC
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* NUMERIC KEYPAD: 4, 5, 6, ×, ÷                                             */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-5 gap-1.5 px-1">
        {/* 4 (gold A) */}
        <div className="flex flex-col items-center">
          <span className="text-[8px] font-bold text-amber-400 leading-none mb-0.5">A</span>
          <button
            type="button"
            onClick={() => handleKey('4', 'A')}
            className="w-full h-10 sm:h-11 rounded-xl bg-slate-850 hover:bg-slate-750 text-white font-mono text-base font-bold border border-slate-700 shadow active:scale-95"
          >
            4
          </button>
        </div>

        {/* 5 (gold B) */}
        <div className="flex flex-col items-center">
          <span className="text-[8px] font-bold text-amber-400 leading-none mb-0.5">B</span>
          <button
            type="button"
            onClick={() => handleKey('5', 'B')}
            className="w-full h-10 sm:h-11 rounded-xl bg-slate-850 hover:bg-slate-750 text-white font-mono text-base font-bold border border-slate-700 shadow active:scale-95"
          >
            5
          </button>
        </div>

        {/* 6 (gold C) */}
        <div className="flex flex-col items-center">
          <span className="text-[8px] font-bold text-amber-400 leading-none mb-0.5">C</span>
          <button
            type="button"
            onClick={() => handleKey('6', 'C')}
            className="w-full h-10 sm:h-11 rounded-xl bg-slate-850 hover:bg-slate-750 text-white font-mono text-base font-bold border border-slate-700 shadow active:scale-95"
          >
            6
          </button>
        </div>

        {/* × (gold nPr) */}
        <div className="flex flex-col items-center">
          <span className="text-[8px] font-bold text-amber-400 leading-none mb-0.5">nPr</span>
          <button
            type="button"
            onClick={() => handleKey('×', 'P')}
            className="w-full h-10 sm:h-11 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-mono text-lg font-bold border border-slate-700 shadow active:scale-95"
          >
            ×
          </button>
        </div>

        {/* ÷ (gold nCr) */}
        <div className="flex flex-col items-center">
          <span className="text-[8px] font-bold text-amber-400 leading-none mb-0.5">nCr</span>
          <button
            type="button"
            onClick={() => handleKey('÷', 'C')}
            className="w-full h-10 sm:h-11 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-mono text-lg font-bold border border-slate-700 shadow active:scale-95"
          >
            ÷
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* NUMERIC KEYPAD: 1, 2, 3, +, −                                             */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-5 gap-1.5 px-1">
        {/* 1 (gold D) */}
        <div className="flex flex-col items-center">
          <span className="text-[8px] font-bold text-amber-400 leading-none mb-0.5">D</span>
          <button
            type="button"
            onClick={() => handleKey('1', 'D')}
            className="w-full h-10 sm:h-11 rounded-xl bg-slate-850 hover:bg-slate-750 text-white font-mono text-base font-bold border border-slate-700 shadow active:scale-95"
          >
            1
          </button>
        </div>

        {/* 2 (gold E) */}
        <div className="flex flex-col items-center">
          <span className="text-[8px] font-bold text-amber-400 leading-none mb-0.5">E</span>
          <button
            type="button"
            onClick={() => handleKey('2', 'E')}
            className="w-full h-10 sm:h-11 rounded-xl bg-slate-850 hover:bg-slate-750 text-white font-mono text-base font-bold border border-slate-700 shadow active:scale-95"
          >
            2
          </button>
        </div>

        {/* 3 (gold F) */}
        <div className="flex flex-col items-center">
          <span className="text-[8px] font-bold text-amber-400 leading-none mb-0.5">F</span>
          <button
            type="button"
            onClick={() => handleKey('3', 'F')}
            className="w-full h-10 sm:h-11 rounded-xl bg-slate-850 hover:bg-slate-750 text-white font-mono text-base font-bold border border-slate-700 shadow active:scale-95"
          >
            3
          </button>
        </div>

        {/* + (gold °'") */}
        <div className="flex flex-col items-center">
          <span className="text-[8px] font-bold text-amber-400 leading-none mb-0.5">°′″</span>
          <button
            type="button"
            onClick={() => handleKey('+', '+')}
            className="w-full h-10 sm:h-11 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-mono text-lg font-bold border border-slate-700 shadow active:scale-95"
          >
            +
          </button>
        </div>

        {/* − (gold (-)) */}
        <div className="flex flex-col items-center">
          <span className="text-[8px] font-bold text-amber-400 leading-none mb-0.5">(-)</span>
          <button
            type="button"
            onClick={() => handleKey('−', '−')}
            className="w-full h-10 sm:h-11 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-mono text-lg font-bold border border-slate-700 shadow active:scale-95"
          >
            −
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* NUMERIC KEYPAD BOTTOM: 0, ., ×10ˣ, FORMAT, EXE                            */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-5 gap-1.5 px-1">
        {/* 0 (gold x) */}
        <div className="flex flex-col items-center">
          <span className="text-[8px] font-bold text-amber-400 leading-none mb-0.5">x</span>
          <button
            type="button"
            onClick={() => handleKey('0', 'x')}
            className="w-full h-10 sm:h-11 rounded-xl bg-slate-850 hover:bg-slate-750 text-white font-mono text-base font-bold border border-slate-700 shadow active:scale-95"
          >
            0
          </button>
        </div>

        {/* . (gold y) */}
        <div className="flex flex-col items-center">
          <span className="text-[8px] font-bold text-amber-400 leading-none mb-0.5">y</span>
          <button
            type="button"
            onClick={() => handleKey('.', 'y')}
            className="w-full h-10 sm:h-11 rounded-xl bg-slate-850 hover:bg-slate-750 text-white font-mono text-base font-bold border border-slate-700 shadow active:scale-95"
          >
            .
          </button>
        </div>

        {/* ×10ˣ (gold z) */}
        <div className="flex flex-col items-center">
          <span className="text-[8px] font-bold text-amber-400 leading-none mb-0.5">z</span>
          <button
            type="button"
            onClick={() => handleKey('*10^', 'z')}
            className="w-full h-10 sm:h-11 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs font-bold border border-slate-700 shadow active:scale-95"
            title="Scientific Notation ×10^"
          >
            ×10<sup>x</sup>
          </button>
        </div>

        {/* FORMAT (↻ S<=>D fraction/decimal conversion) */}
        <div className="flex flex-col items-center">
          <span className="text-[8px] font-bold text-amber-400 leading-none mb-0.5">S⇔D</span>
          <button
            id="casio-key-format"
            type="button"
            onClick={onFormatClick}
            className="w-full h-10 sm:h-11 rounded-xl bg-gradient-to-b from-slate-750 to-slate-850 hover:from-slate-700 hover:to-slate-800 text-amber-300 font-bold text-[10px] border border-slate-600 shadow active:scale-95 flex flex-col items-center justify-center leading-tight"
            title="FORMAT / S<=>D: Cycle Fraction, Decimal, Mixed Fraction, DMS"
          >
            <Repeat className="w-3.5 h-3.5 mb-0.5" />
            <span>FORMAT</span>
          </button>
        </div>

        {/* EXE Execute / = (gold ≈) */}
        <div className="flex flex-col items-center">
          <span className="text-[8px] font-bold text-amber-400 leading-none mb-0.5">≈</span>
          <button
            id="casio-key-exe"
            type="button"
            onClick={onExecute}
            className="w-full h-10 sm:h-11 rounded-xl bg-gradient-to-b from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm border border-amber-400 shadow-md shadow-amber-500/20 active:scale-95 flex items-center justify-center"
            title="Execute / Calculate (=)"
          >
            EXE
          </button>
        </div>
      </div>
    </div>
  );
};
