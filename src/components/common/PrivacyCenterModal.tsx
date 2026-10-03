import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  EyeOff,
  Database,
  Trash2,
  Download,
  CheckCircle2,
  X,
  FileText,
  HardHat,
  Cpu,
  Layers,
  Sparkles,
} from 'lucide-react';
import { safeStorage } from '../../utils/safeStorage';

interface PrivacyCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: 'en' | 'hi';
}

export const PrivacyCenterModal: React.FC<PrivacyCenterModalProps> = ({
  isOpen,
  onClose,
  language = 'hi',
}) => {
  const [incognito, setIncognito] = useState(() => safeStorage.isIncognito());
  const [storageStats, setStorageStats] = useState(() => safeStorage.getUsageEstimate());
  const [clearSuccess, setClearSuccess] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  if (!isOpen) return null;

  const handleToggleIncognito = () => {
    const next = !incognito;
    setIncognito(next);
    safeStorage.setIncognitoMode(next);
  };

  const handleExportData = () => {
    try {
      const dump: Record<string, any> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith('deephelp_')) {
          try {
            dump[k] = JSON.parse(localStorage.getItem(k) || '""');
          } catch {
            dump[k] = localStorage.getItem(k);
          }
        }
      }
      const blob = new Blob([JSON.stringify(dump, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `deephelp_civil_data_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (e) {
      console.error('Export failed', e);
    }
  };

  const handleClearData = () => {
    if (
      window.confirm(
        language === 'hi'
          ? 'क्या आप सचमुच सारा सेव किया गया डेटा (कैलकुलेशन, नोट्स, प्रेफरेंसेज) मिटाना चाहते हैं?'
          : 'Are you sure you want to clear all locally cached calculations and preferences?'
      )
    ) {
      safeStorage.clearAllAppData();
      setStorageStats(safeStorage.getUsageEstimate());
      setClearSuccess(true);
      setTimeout(() => setClearSuccess(false), 3000);
    }
  };

  const isHindi = language === 'hi';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-amber-500/10 via-slate-100 to-transparent dark:from-amber-500/15 dark:via-slate-800/50 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md">
              <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center space-x-2">
                <span>{isHindi ? 'प्राइवेसी एवं डेटा सुरक्षा केंद्र' : 'Privacy & Data Protection Center'}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  DPDP & GDPR Compliant
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isHindi
                  ? 'Er. Deepak Kumar द्वारा 100% सुरक्षित, पारदर्शी और विज्ञापन-मुक्त नीति'
                  : '100% transparent, private, ad-free architecture founded by Er. Deepak Kumar'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Quick Incognito Mode Toggle */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between gap-4">
            <div className="flex items-start space-x-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                <EyeOff className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {isHindi ? 'निजी अध्ययन मोड (Incognito Study Mode)' : 'Incognito Study Mode'}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {isHindi
                    ? 'सक्रिय करने पर आपकी कोई भी गणना या क्विज स्कोर ब्राउज़र हिस्ट्री में सेव नहीं होगी।'
                    : 'When active, no calculations, notes, or quiz attempts will be saved to device storage.'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleToggleIncognito}
              className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                incognito ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  incognito ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Local Device Storage Manager */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Database className="w-4 h-4 text-amber-500" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {isHindi ? 'लोकल डिवाइस स्टोरेज नियंत्रण' : 'Local Device Storage Management'}
                </h4>
              </div>
              <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400">
                {storageStats.usedKb} KB / {storageStats.itemsCount} {isHindi ? 'आइटम्स' : 'items'}
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isHindi
                ? 'आपका सारा डेटा आपके डिवाइस पर ही सुरक्षित रहता है। आप कभी भी अपना डेटा डाउनलोड या डिलीट कर सकते हैं।'
                : 'All your work stays exclusively in your browser. You can export or clear your local cache at any moment.'}
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleExportData}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-amber-500" />
                <span>{exportSuccess ? (isHindi ? 'डाउनलोड पूरा हुआ!' : 'Exported!') : (isHindi ? 'डेटा एक्सपोर्ट करें (JSON)' : 'Export My Data')}</span>
              </button>

              <button
                type="button"
                onClick={handleClearData}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-xs font-bold transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                <span>{clearSuccess ? (isHindi ? 'कैश साफ हो गया!' : 'Cleared!') : (isHindi ? 'कैश साफ करें' : 'Clear Local Cache')}</span>
              </button>
            </div>
          </div>

          {/* Privacy Pillars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 space-y-1">
              <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                <Cpu className="w-4 h-4" />
                <span>{isHindi ? '100% क्लाइंट-साइड कंप्यूटेशन' : '100% On-Device Computation'}</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                {isHindi
                  ? 'सभी कंक्रीट, ब्रिक, बीम और सर्वे फॉर्मूले आपके डिवाइस में ही हल होते हैं, किसी बाहरी सर्वर पर नहीं।'
                  : 'All mathematical and structural formulas execute locally inside your browser.'}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-sky-500/5 dark:bg-sky-500/10 border border-sky-500/20 space-y-1">
              <div className="flex items-center space-x-2 text-sky-600 dark:text-sky-400 font-bold text-xs">
                <Lock className="w-4 h-4" />
                <span>{isHindi ? 'शून्य ट्रैकर एवं शून्य विज्ञापन' : 'Zero Trackers & No Ads'}</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                {isHindi
                  ? 'कोई थर्ड-पार्टी ट्रैकर या विज्ञापनों का दखल नहीं। आपकी पढ़ाई और इंजीनियरिंग कार्य पूरी तरह गोपनीय है।'
                  : 'No behavioral tracking, no third-party ad networks, and no profiling whatsoever.'}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 space-y-1">
              <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400 font-bold text-xs">
                <Layers className="w-4 h-4" />
                <span>{isHindi ? 'अनाम रियल-टाइम पल्स' : 'Anonymous Real-Time Pulse'}</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                {isHindi
                  ? 'लाइव एक्टिव यूजर्स काउंटर केवल कुल संख्या और क्षेत्र (जैसे पटना, दिल्ली) का अनाम अनुमान दिखाता है।'
                  : 'Real-time viewer counter uses anonymous heartbeats with zero personal identifiable information.'}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-purple-500/5 dark:bg-purple-500/10 border border-purple-500/20 space-y-1">
              <div className="flex items-center space-x-2 text-purple-600 dark:text-purple-400 font-bold text-xs">
                <Sparkles className="w-4 h-4" />
                <span>{isHindi ? 'फाउंडर गारंटी' : 'Founder Integrity Guarantee'}</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                {isHindi
                  ? 'Er. Deepak Kumar द्वारा छात्रों और इंजीनियरों की सुविधा के लिए यह पूरा मंच निशुल्क और सुरक्षित बनाया गया है।'
                  : 'Platform created by Er. Deepak Kumar dedicated to empowering civil engineers freely and safely.'}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            {isHindi ? 'डेटा प्रोटेक्शन एक्ट 2023 के तहत सुरक्षित' : 'Compliant with Digital Personal Data Protection Act'}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-sm transition-all cursor-pointer"
          >
            {isHindi ? 'समझ गया / बंद करें' : 'Close Privacy Center'}
          </button>
        </div>
      </div>
    </div>
  );
};
