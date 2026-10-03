import React from 'react';
import { SavedCalculation } from '../types';
import { History, X, Trash2, Printer, Calendar, FileText } from 'lucide-react';

interface SavedCalculationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedCalculations: SavedCalculation[];
  onDeleteCalculation: (id: string) => void;
  onClearAll: () => void;
  onOpenReport: (reportData: { title: string; module: string; summary: string; details: Record<string, string | number> }) => void;
}

export const SavedCalculationsModal: React.FC<SavedCalculationsModalProps> = ({
  isOpen,
  onClose,
  savedCalculations,
  onDeleteCalculation,
  onClearAll,
  onOpenReport,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8">
        {/* Header */}
        <div className="p-5 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Saved Calculations History
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {savedCalculations.length} estimate{savedCalculations.length === 1 ? '' : 's'} saved in your browser storage.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {savedCalculations.length > 0 && (
              <button
                type="button"
                onClick={onClearAll}
                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              >
                Clear All
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="p-6 max-h-[480px] overflow-y-auto space-y-3">
          {savedCalculations.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <FileText className="w-12 h-12 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                No saved calculations yet
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Click &quot;Save Calculation&quot; in any module to store estimates for quick review and report generation.
              </p>
            </div>
          ) : (
            savedCalculations.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400">
                      {item.module}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 font-mono-calc">
                    {item.summary}
                  </p>
                </div>

                <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => {
                      onOpenReport({
                        title: item.title,
                        module: item.module,
                        summary: item.summary,
                        details: item.details,
                      });
                      onClose();
                    }}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Report</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteCalculation(item.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
