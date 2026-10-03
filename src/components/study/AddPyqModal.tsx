import React, { useState } from 'react';
import {
  X,
  PlusCircle,
  HelpCircle,
  CheckCircle2,
  BookOpen,
  Award,
  FileCheck,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { ALL_CIVIL_SUBJECTS } from '../../data/civilSubjects';
import { PYQItem } from '../../data/pyqsData';

interface AddPyqModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePyq: (newPyq: PYQItem) => void;
}

export const AddPyqModal: React.FC<AddPyqModalProps> = ({
  isOpen,
  onClose,
  onSavePyq,
}) => {
  const [exam, setExam] = useState<string>('SSC JE');
  const [customExam, setCustomExam] = useState<string>('');
  const [year, setYear] = useState<string>('2024');
  const [subject, setSubject] = useState<string>('RCC Design');
  const [customSubject, setCustomSubject] = useState<string>('');
  const [topic, setTopic] = useState<string>('');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');

  // Question texts
  const [questionEn, setQuestionEn] = useState<string>('');
  const [questionHi, setQuestionHi] = useState<string>('');

  // 4 Options
  const [optionsEn, setOptionsEn] = useState<string[]>(['', '', '', '']);
  const [optionsHi, setOptionsHi] = useState<string[]>(['', '', '', '']);
  const [correctOption, setCorrectOption] = useState<number>(0);

  // Solution
  const [solutionEn, setSolutionEn] = useState<string>('');
  const [solutionHi, setSolutionHi] = useState<string>('');
  const [codeReference, setCodeReference] = useState<string>('');

  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen) return null;

  const handleOptionEnChange = (index: number, val: string) => {
    const updated = [...optionsEn];
    updated[index] = val;
    setOptionsEn(updated);
  };

  const handleOptionHiChange = (index: number, val: string) => {
    const updated = [...optionsHi];
    updated[index] = val;
    setOptionsHi(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const finalExam = exam === 'Other' ? customExam.trim() : exam;
    const finalSubject = subject === 'Other' ? customSubject.trim() : subject;

    if (!finalExam) {
      setErrorMsg('कृपया परीक्षा का नाम चुनें या दर्ज करें (Please specify Exam name).');
      return;
    }
    if (!finalSubject) {
      setErrorMsg('कृपया विषय (Subject) चुनें या दर्ज करें.');
      return;
    }
    if (!questionEn.trim()) {
      setErrorMsg('कृपया प्रश्न (Question) अवश्य दर्ज करें.');
      return;
    }
    if (optionsEn.some((opt) => !opt.trim())) {
      setErrorMsg('कृपया चारों विकल्प (Options A, B, C, D) अनिवार्य रूप से भरें.');
      return;
    }
    if (!solutionEn.trim()) {
      setErrorMsg('कृपया सही उत्तर का स्पष्टीकरण/समाधान (Solution/Explanation) दर्ज करें.');
      return;
    }

    const newPyq: PYQItem = {
      id: `custom-pyq-${Date.now()}`,
      exam: finalExam,
      year: year.trim() || 'Custom',
      subject: finalSubject,
      topic: topic.trim() || 'General Civil Engineering',
      difficulty,
      questionEn: questionEn.trim(),
      questionHi: questionHi.trim() || questionEn.trim(),
      optionsEn: optionsEn.map((o) => o.trim()),
      optionsHi: optionsHi.map((o, idx) => o.trim() || optionsEn[idx].trim()),
      correctOption,
      solutionEn: solutionEn.trim(),
      solutionHi: solutionHi.trim() || solutionEn.trim(),
      codeReference: codeReference.trim() || undefined,
      isCustom: true,
      createdAt: new Date().toISOString(),
    };

    onSavePyq(newPyq);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-6">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-xs">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                Add Previous Year Question (PYQ)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                अपना खुद का प्रश्न और व्याख्या किसी भी सिविल इंजीनियरिंग विषय में जोड़ें
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-800 dark:text-rose-300 text-xs font-bold flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Exam, Year & Subject Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Exam */}
            <div>
              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">
                Target Exam / परीक्षा *
              </label>
              <select
                value={exam}
                onChange={(e) => setExam(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-500"
              >
                <option value="SSC JE">SSC JE (Staff Selection Commission)</option>
                <option value="RRB JE">RRB JE (Railway Recruitment Board)</option>
                <option value="BTSC JE">BTSC JE (Bihar Technical Commission)</option>
                <option value="GATE Civil">GATE Civil Engineering</option>
                <option value="State AE/JE">State AE/JE (State PSCs)</option>
                <option value="Other">Other / Custom Exam Name</option>
              </select>
              {exam === 'Other' && (
                <input
                  type="text"
                  placeholder="Enter exam name (e.g. BPSC AE, UPSSSC)"
                  value={customExam}
                  onChange={(e) => setCustomExam(e.target.value)}
                  className="mt-1.5 w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
                />
              )}
            </div>

            {/* Year / Shift */}
            <div>
              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">
                Year / Shift (वर्ष) *
              </label>
              <input
                type="text"
                placeholder="e.g. 2024 Shift-1, 2023 Mains"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-500"
              />
            </div>

            {/* Subject */}
            <div>
              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">
                Subject (विषय) *
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-500"
              >
                {ALL_CIVIL_SUBJECTS.map((sub) => (
                  <option key={sub.id} value={sub.name}>
                    {sub.name}
                  </option>
                ))}
                <option value="Other">Other / Custom Subject (अन्य विषय)</option>
              </select>
              {subject === 'Other' && (
                <input
                  type="text"
                  placeholder="Type subject name"
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  className="mt-1.5 w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
                />
              )}
            </div>
          </div>

          {/* Topic & Difficulty */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">
                Chapter / Topic (अध्याय/टॉपिक)
              </label>
              <input
                type="text"
                placeholder="e.g. Limit State Beams, Tacheometry, Slump Test"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">
                Difficulty Level (कठिनाई स्तर)
              </label>
              <div className="flex space-x-2">
                {(['Easy', 'Medium', 'Hard'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setDifficulty(lvl)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      difficulty === lvl
                        ? 'bg-amber-500 text-slate-950 shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Question Text in English & Hindi */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">
                Question Text in English (प्रश्न अंग्रेजी में) *
              </label>
              <textarea
                rows={2}
                placeholder="Enter the complete question in English..."
                value={questionEn}
                onChange={(e) => setQuestionEn(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
                Question Text in Hindi (प्रश्न हिंदी में - वैकल्पिक / Optional)
              </label>
              <textarea
                rows={2}
                placeholder="प्रश्न को हिंदी में लिखें (वैकल्पिक)..."
                value={questionHi}
                onChange={(e) => setQuestionHi(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-500"
              />
            </div>
          </div>

          {/* 4 Options */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-slate-700 dark:text-slate-300">
                Four Options (चारों विकल्प) & Correct Answer *
              </label>
              <span className="text-[11px] text-amber-600 dark:text-amber-400 font-bold">
                रेडियो बटन दबाकर सही विकल्प चुनें
              </span>
            </div>

            <div className="space-y-2">
              {[0, 1, 2, 3].map((idx) => {
                const label = String.fromCharCode(65 + idx);
                const isSelected = correctOption === idx;

                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-2xl border transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20'
                        : 'border-slate-200 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-1.5">
                      <button
                        type="button"
                        onClick={() => setCorrectOption(idx)}
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-emerald-500 text-white shadow-xs'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {label}
                      </button>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Option {label} {isSelected && '(Correct Answer ✓)'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-9">
                      <input
                        type="text"
                        placeholder={`Option ${label} (English)`}
                        value={optionsEn[idx]}
                        onChange={(e) => handleOptionEnChange(idx, e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
                      />
                      <input
                        type="text"
                        placeholder={`Option ${label} (हिंदी - optional)`}
                        value={optionsHi[idx]}
                        onChange={(e) => handleOptionHiChange(idx, e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Solution & Codal Reference */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">
                Detailed Solution / Explanation (English) *
              </label>
              <textarea
                rows={3}
                placeholder="Explain the solution step-by-step or mention formula derived..."
                value={solutionEn}
                onChange={(e) => setSolutionEn(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
                Detailed Solution in Hindi (हिंदी व्याख्या - वैकल्पिक)
              </label>
              <textarea
                rows={2}
                placeholder="हिंदी में विस्तारपूर्वक व्याख्या लिखें (वैकल्पिक)..."
                value={solutionHi}
                onChange={(e) => setSolutionHi(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">
                IS Code / Reference Book Clause (कोड रेफरेंस)
              </label>
              <input
                type="text"
                placeholder="e.g. IS 456:2000 Clause 38.1 / Punmia Vol 1"
                value={codeReference}
                onChange={(e) => setCodeReference(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              Cancel (रद्द करें)
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs flex items-center space-x-2 shadow-sm transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save PYQ (प्रश्न सुरक्षित करें)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
