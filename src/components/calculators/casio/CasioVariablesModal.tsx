import React, { useState } from 'react';
import { X, Check, Save, Variable, ArrowRight } from 'lucide-react';
import { CasioVariables } from './casioTypes';

interface CasioVariablesModalProps {
  isOpen: boolean;
  onClose: () => void;
  variables: CasioVariables;
  onUpdateVariable: (key: keyof CasioVariables, val: number) => void;
  onInsertVar: (name: string) => void;
  currentResult: string;
}

export const CasioVariablesModal: React.FC<CasioVariablesModalProps> = ({
  isOpen,
  onClose,
  variables,
  onUpdateVariable,
  onInsertVar,
  currentResult,
}) => {
  const [editingVar, setEditingVar] = useState<keyof CasioVariables | null>(null);
  const [editVal, setEditVal] = useState<string>('');

  if (!isOpen) return null;

  const varKeys: (keyof CasioVariables)[] = ['A', 'B', 'C', 'D', 'E', 'F', 'x', 'y', 'z', 'M', 'Ans'];

  const handleSaveEdit = (k: keyof CasioVariables) => {
    const parsed = parseFloat(editVal);
    if (!isNaN(parsed)) {
      onUpdateVariable(k, parsed);
    }
    setEditingVar(null);
  };

  const handleStoreAnsTo = (k: keyof CasioVariables) => {
    const parsed = parseFloat(currentResult);
    if (!isNaN(parsed)) {
      onUpdateVariable(k, parsed);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <Variable className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Variable Memory Buffer [x]
              </h3>
              <p className="text-xs text-slate-500">Store &amp; Recall Variables</p>
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

        <div className="p-4 sm:p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-amber-700 dark:text-amber-300 block">
                Current Calc Result
              </span>
              <span className="text-sm font-mono font-black text-slate-900 dark:text-white">
                {currentResult}
              </span>
            </div>
            <span className="text-[10px] text-amber-600 dark:text-amber-400">
              Click [Store] on any variable below
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {varKeys.map((k) => (
              <div
                key={k}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between"
              >
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-md bg-slate-200 dark:bg-slate-700 font-mono font-black text-xs flex items-center justify-center text-slate-800 dark:text-slate-200">
                    {k}
                  </span>
                  {editingVar === k ? (
                    <input
                      type="text"
                      value={editVal}
                      onChange={(e) => setEditVal(e.target.value)}
                      className="w-20 px-1 py-0.5 text-xs font-mono rounded border bg-white dark:bg-slate-900"
                      autoFocus
                    />
                  ) : (
                    <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[80px]">
                      {variables[k]}
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-1">
                  {editingVar === k ? (
                    <button
                      type="button"
                      onClick={() => handleSaveEdit(k)}
                      className="p-1 rounded hover:bg-emerald-500/20 text-emerald-600"
                      title="Save"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          onInsertVar(String(k));
                          onClose();
                        }}
                        className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-700 dark:text-amber-300"
                        title="Insert into equation"
                      >
                        Insert
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStoreAnsTo(k)}
                        className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200"
                        title="Store current result into variable"
                      >
                        Store
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
