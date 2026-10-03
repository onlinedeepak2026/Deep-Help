import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  X,
  Crown,
  Sparkles,
  Unlock,
} from 'lucide-react';
import { ownerAuth } from '../../utils/ownerAuth';
import confetti from 'canvas-confetti';

interface OwnerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  targetActionName?: string;
}

export const OwnerAuthModal: React.FC<OwnerAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  targetActionName = 'नोट्स एवं लैब असाइनमेंट अपलोड',
}) => {
  const [passcode, setPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const res = ownerAuth.verify(passcode);
    if (res.success) {
      setSuccessMsg(res.message);
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 1000);
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 transition-all">
      <div
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-slate-950 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-950/20 backdrop-blur-sm text-white flex items-center justify-center font-black">
              <Crown className="w-6 h-6 stroke-[2.3]" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Owner / Founder Access</h3>
              <p className="text-xs text-amber-100 font-medium">
                Er. Deepak Kumar (Founder & Admin)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-950/20 hover:bg-slate-950/40 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300">
            <p className="font-bold flex items-center space-x-1.5 mb-1">
              <Lock className="w-4 h-4 text-amber-500" />
              <span>सुरक्षा नियम: {targetActionName}</span>
            </p>
            <p className="leading-relaxed">
              छात्रों को 100% सटीक अध्ययन सामग्री मिले, इसलिए आधिकारिक <strong>स्टडी नोट्स</strong> और <strong>लैब असाइनमेंट्स</strong> केवल वेबसाइट के ओनर (Er. Deepak Kumar) ही शेयर कर सकते हैं।
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-400 text-xs font-semibold flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                Founder Passcode / पासवर्ड दर्ज करें *
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter Founder PIN (e.g. deepak123)"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm font-semibold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  autoFocus
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                फाउंडर ईमेल: deepak20061122@gmail.com
              </p>
            </div>

            <div className="pt-2 flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                रद्द करें
              </button>

              <button
                type="submit"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-md cursor-pointer"
              >
                <Unlock className="w-4 h-4" />
                <span>Verify & Unlock</span>
              </button>
            </div>
          </form>
        </div>

        {/* Footer Note */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 text-center">
          💡 छात्र सभी नोट्स, प्रैक्टिकल्स और असाइनमेंट्स बिना किसी शुल्क के पढ़ और डाउनलोड कर सकते हैं।
        </div>
      </div>
    </div>
  );
};
