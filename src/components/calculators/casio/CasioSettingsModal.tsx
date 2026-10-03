import React from 'react';
import { SlidersHorizontal, X, Check, Monitor, Palette, Volume2 } from 'lucide-react';
import { AngleUnit, DisplayTheme } from './casioTypes';

interface CasioSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  angleMode: AngleUnit;
  onSetAngleMode: (m: AngleUnit) => void;
  theme: DisplayTheme;
  onSetTheme: (t: DisplayTheme) => void;
}

export const CasioSettingsModal: React.FC<CasioSettingsModalProps> = ({
  isOpen,
  onClose,
  angleMode,
  onSetAngleMode,
  theme,
  onSetTheme,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                ClassWiz System Settings
              </h3>
              <p className="text-xs text-slate-500">CASIO fx-991CW Preferences</p>
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

        <div className="p-5 space-y-5">
          {/* Angle Unit Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
              1. Angle Unit (Trigonometry)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'DEG', label: 'Degree (DEG)', desc: '360° circle (default)' },
                { id: 'RAD', label: 'Radian (RAD)', desc: '2π circle for calculus' },
                { id: 'GRA', label: 'Gradian (GRA)', desc: '400 grads circle' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSetAngleMode(item.id as AngleUnit)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    angleMode === item.id
                      ? 'bg-amber-500/10 border-amber-500 text-amber-600 dark:text-amber-400 font-bold ring-1 ring-amber-500'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black">{item.id}</span>
                    {angleMode === item.id && <Check className="w-4 h-4 text-amber-500" />}
                  </div>
                  <span className="text-[10px] opacity-75 block mt-1">{item.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* LCD Screen Display Style */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
              2. ClassWiz LCD Display Theme
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                {
                  id: 'lcd_green',
                  label: 'Paper LCD',
                  desc: 'Authentic physical ClassWiz green tone',
                  color: 'bg-[#cfd9ce] text-[#141c14]',
                },
                {
                  id: 'lcd_dark',
                  label: 'OLED Dark',
                  desc: 'High contrast neon night matrix',
                  color: 'bg-[#0f1412] text-[#9df2a8]',
                },
                {
                  id: 'lcd_blue',
                  label: 'Cool Blue',
                  desc: 'Soft engineering blueprint hue',
                  color: 'bg-[#c6d7e4] text-[#101e28]',
                },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSetTheme(item.id as DisplayTheme)}
                  className={`p-2.5 rounded-2xl border text-left transition-all ${
                    theme === item.id
                      ? 'border-amber-500 ring-2 ring-amber-500/40 font-bold'
                      : 'border-slate-200 dark:border-slate-700 hover:opacity-90'
                  }`}
                >
                  <div
                    className={`w-full h-8 rounded-lg mb-1.5 flex items-center justify-center font-mono text-[10px] font-bold border border-black/10 ${item.color}`}
                  >
                    123.456
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {item.label}
                    </span>
                    {theme === item.id && <Check className="w-3.5 h-3.5 text-amber-500" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shadow"
          >
            Apply &amp; Return to Calculator
          </button>
        </div>
      </div>
    </div>
  );
};
