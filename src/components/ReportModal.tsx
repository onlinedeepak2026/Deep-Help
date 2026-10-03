import React from 'react';
import { Printer, X, HardHat, FileText, CheckCircle2 } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportData: {
    title: string;
    module: string;
    summary: string;
    details: Record<string, string | number>;
  } | null;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  reportData,
}) => {
  if (!isOpen || !reportData) return null;

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8">
        {/* Modal Action Header (hidden in print) */}
        <div className="no-print p-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-amber-500" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Engineering Calculation Report Preview
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              id="report-print-btn"
              type="button"
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Document */}
        <div className="p-8 sm:p-12 space-y-8 bg-white text-slate-900 print:p-0 print:m-0">
          {/* Letterhead */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                <HardHat className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-slate-900">
                  DEEP HELP
                </h1>
                <p className="text-xs font-bold uppercase tracking-widest text-amber-600">
                  Civil Engineering Hub • Technical Report
                </p>
              </div>
            </div>

            <div className="text-right text-xs text-slate-600 space-y-0.5">
              <div className="font-bold text-slate-900">Date: {currentDate}</div>
              <div>Doc Ref: DH-CE-{Date.now().toString().slice(-6)}</div>
              <div>Status: Verified Calculation</div>
            </div>
          </div>

          {/* Report Title & Summary */}
          <div className="space-y-2">
            <div className="inline-block px-2.5 py-1 rounded bg-slate-100 text-slate-800 text-xs font-bold uppercase tracking-wider">
              {reportData.module}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              {reportData.title}
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              {reportData.summary}
            </p>
          </div>

          {/* Technical Data Table */}
          <div className="border border-slate-300 rounded-xl overflow-hidden">
            <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-300 text-xs font-bold uppercase tracking-wider text-slate-700">
              Computed Parameters & Engineering Quantities
            </div>
            <table className="w-full text-xs">
              <tbody className="divide-y divide-slate-200">
                {Object.entries(reportData.details).map(([key, val], idx) => (
                  <tr
                    key={key}
                    className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}
                  >
                    <td className="py-2.5 px-4 font-semibold text-slate-700 w-1/2">
                      {key}
                    </td>
                    <td className="py-2.5 px-4 font-bold text-slate-900 font-mono">
                      {String(val)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Sign-off & Stamp Section */}
          <div className="pt-8 border-t border-slate-200 grid grid-cols-2 gap-8 text-xs text-slate-600">
            <div>
              <div className="font-bold text-slate-900 mb-1">Standard Reference & Code Compliance</div>
              <p className="text-[11px] leading-relaxed text-slate-500">
                Calculations conform to standard Indian Standard (IS) codes & international civil engineering specifications (IS 456, IS 10262, IS 1077, IS 1172).
              </p>
            </div>
            <div className="text-right flex flex-col justify-end items-end">
              <div className="w-36 border-b border-slate-400 mb-1"></div>
              <span className="font-bold text-slate-800 text-[11px]">Site Engineer / Project In-Charge</span>
              <span className="text-[10px] text-slate-400">Deep Help Technical Verification</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
