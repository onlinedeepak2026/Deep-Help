import React, { useState, useRef } from 'react';
import {
  X,
  PlusCircle,
  BookOpen,
  Image as ImageIcon,
  Upload,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Layers,
  FileText,
  Bookmark,
} from 'lucide-react';
import { ALL_CIVIL_SUBJECTS } from '../../data/civilSubjects';
import { ChapterNote } from '../../data/notesData';
import { ownerAuth } from '../../utils/ownerAuth';
import { OwnerAuthModal } from '../common/OwnerAuthModal';
import { Crown, Lock } from 'lucide-react';

interface AddNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveNote: (newNote: ChapterNote) => void;
}

export const AddNoteModal: React.FC<AddNoteModalProps> = ({
  isOpen,
  onClose,
  onSaveNote,
}) => {
  const [subjectId, setSubjectId] = useState<string>('rcc-design');
  const [customSubjectName, setCustomSubjectName] = useState<string>('');
  const [chapterTitle, setChapterTitle] = useState<string>('');
  const [chapterTitleHi, setChapterTitleHi] = useState<string>('');
  const [readingTimeMinutes, setReadingTimeMinutes] = useState<number>(10);
  const [isStandardCodeRef, setIsStandardCodeRef] = useState<string>('');
  const [tagsInput, setTagsInput] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  const [summaryHi, setSummaryHi] = useState<string>('');

  // Primary Image / Diagram Upload
  const [imageUrl, setImageUrl] = useState<string>('');
  const [imageCaption, setImageCaption] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Section details
  const [sectionHeading, setSectionHeading] = useState<string>('Core Concepts & Notes');
  const [sectionHeadingHi, setSectionHeadingHi] = useState<string>('मुख्य सिद्धांत एवं नोट्स');
  const [sectionContent, setSectionContent] = useState<string>('');
  const [sectionContentHi, setSectionContentHi] = useState<string>('');

  // Formulas list
  const [formulas, setFormulas] = useState<{ name: string; formula: string; note: string }[]>([
    { name: '', formula: '', note: '' },
  ]);

  // Exam highlights
  const [examHighlightsInput, setExamHighlightsInput] = useState<string>('');

  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isOwner, setIsOwner] = useState(() => ownerAuth.isOwner());
  const [isOwnerAuthModalOpen, setIsOwnerAuthModalOpen] = useState(false);

  React.useEffect(() => {
    const handleOwnerChange = (e: any) => {
      setIsOwner(e.detail?.isOwner ?? ownerAuth.isOwner());
    };
    window.addEventListener('deephelp_owner_changed', handleOwnerChange);
    return () => window.removeEventListener('deephelp_owner_changed', handleOwnerChange);
  }, []);

  if (!isOpen) return null;

  // Process and compress image file via HTML5 Canvas
  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('कृपया केवल इमेज फ़ाइल (JPG, PNG, WEBP) चुनें!');
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        // Compress image using canvas to ensure lightweight localStorage persistence
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 1200;
          let width = img.width;
          let height = img.height;

          if (width > height && width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressed = canvas.toDataURL('image/jpeg', 0.82);
            setImageUrl(compressed);
          } else {
            setImageUrl(result);
          }
        };
        img.src = result;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processImageFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleAddFormula = () => {
    setFormulas((prev) => [...prev, { name: '', formula: '', note: '' }]);
  };

  const handleFormulaChange = (
    index: number,
    field: 'name' | 'formula' | 'note',
    value: string
  ) => {
    const updated = [...formulas];
    updated[index][field] = value;
    setFormulas(updated);
  };

  const handleRemoveFormula = (index: number) => {
    setFormulas((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Owner protection: Official Notes can ONLY be published by Founder Er. Deepak Kumar!
    if (!ownerAuth.isOwner()) {
      setErrorMsg('सुरक्षा अलर्ट: आधिकारिक नोट्स केवल वेबसाइट के ओनर (Er. Deepak Kumar) ही शेयर कर सकते हैं।');
      setIsOwnerAuthModalOpen(true);
      return;
    }

    let subjectName = '';
    if (subjectId === 'custom') {
      if (!customSubjectName.trim()) {
        setErrorMsg('कृपया विषय का नाम (Subject Name) दर्ज करें.');
        return;
      }
      subjectName = customSubjectName.trim();
    } else {
      const match = ALL_CIVIL_SUBJECTS.find((s) => s.id === subjectId);
      subjectName = match ? match.name : subjectId;
    }

    if (!chapterTitle.trim()) {
      setErrorMsg('कृपया नोट्स का शीर्षक (Chapter / Topic Title) दर्ज करें.');
      return;
    }
    if (!summary.trim()) {
      setErrorMsg('कृपया नोट्स का संक्षिप्त सारांश (Summary) दर्ज करें.');
      return;
    }
    if (!sectionContent.trim()) {
      setErrorMsg('कृपया मुख्य नोट्स सामग्री (Detailed Content) दर्ज करें.');
      return;
    }

    // Filter valid formulas
    const validFormulas = formulas.filter((f) => f.name.trim() && f.formula.trim());

    // Parse exam highlights
    const examHighlights = examHighlightsInput
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    // Tags
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const newNote: ChapterNote = {
      id: `custom-note-${Date.now()}`,
      subjectId,
      subjectName,
      chapterTitle: chapterTitle.trim(),
      chapterTitleHi: chapterTitleHi.trim() || chapterTitle.trim(),
      readingTimeMinutes: Math.max(1, readingTimeMinutes || 5),
      tags: tags.length > 0 ? tags : [subjectName, 'Self Notes'],
      summary: summary.trim(),
      summaryHi: summaryHi.trim() || summary.trim(),
      imageUrl: imageUrl || undefined,
      imageCaption: imageCaption.trim() || undefined,
      isStandardCodeRef: isStandardCodeRef.trim() || 'Custom Reference',
      isCustom: true,
      createdAt: new Date().toISOString(),
      sections: [
        {
          heading: sectionHeading.trim() || 'Key Notes & Theory',
          headingHi: sectionHeadingHi.trim() || 'प्रमुख नोट्स एवं सिद्धांत',
          content: sectionContent.trim(),
          contentHi: sectionContentHi.trim() || sectionContent.trim(),
          formulas: validFormulas.length > 0 ? validFormulas : undefined,
          examHighlights:
            examHighlights.length > 0
              ? examHighlights
              : ['Self-created revision note for Civil Engineering competitive exams.'],
          imageUrl: imageUrl || undefined,
          imageCaption: imageCaption.trim() || undefined,
        },
      ],
    };

    onSaveNote(newNote);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-6">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                Add Study Note with Picture / डायग्राम
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                किसी भी विषय में अपना व्यक्तिगत हस्तलिखित/किताबी नोट व फ़ोटो जोड़ें
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

          {/* Subject & Code Ref Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">
                Select Civil Subject (विषय चुनें) *
              </label>
              <select
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-500"
              >
                {ALL_CIVIL_SUBJECTS.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
                <option value="custom">Other / Custom Subject (अन्य कोई भी विषय)</option>
              </select>

              {subjectId === 'custom' && (
                <input
                  type="text"
                  placeholder="Enter custom subject name (e.g. Tunnel Engineering, Prestressed Concrete)"
                  value={customSubjectName}
                  onChange={(e) => setCustomSubjectName(e.target.value)}
                  className="mt-2 w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
                />
              )}
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">
                IS Code / Book Ref (वैकल्पिक)
              </label>
              <input
                type="text"
                placeholder="e.g. IS 456, IS 800"
                value={isStandardCodeRef}
                onChange={(e) => setIsStandardCodeRef(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Chapter / Topic Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">
                Chapter / Topic Title (English) *
              </label>
              <input
                type="text"
                placeholder="e.g. Slump Test & Workability Factors"
                value={chapterTitle}
                onChange={(e) => setChapterTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
                Topic Title in Hindi (हिंदी शीर्षक - वैकल्पिक)
              </label>
              <input
                type="text"
                placeholder="e.g. स्लम्प परीक्षण एवं सुकार्यता के कारक"
                value={chapterTitleHi}
                onChange={(e) => setChapterTitleHi(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Reading Time & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">
                Estimated Reading Time (Min)
              </label>
              <input
                type="number"
                min={1}
                max={120}
                value={readingTimeMinutes}
                onChange={(e) => setReadingTimeMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">
                Tags (कॉमा द्वारा अलग करें)
              </label>
              <input
                type="text"
                placeholder="e.g. IS 1199, Workability, Concrete, SSC JE"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Picture / Diagram Upload Area */}
          <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ImageIcon className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-black text-slate-900 dark:text-white">
                  Add Picture / Structural Diagram / Notes Photo (चित्र जोड़ें)
                </span>
              </div>
              <span className="text-[10px] font-bold text-slate-400">
                JPG, PNG, WebP • Auto-optimized
              </span>
            </div>

            {!imageUrl ? (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-amber-400/50 dark:border-amber-500/30 rounded-2xl p-5 text-center cursor-pointer hover:bg-amber-500/10 transition-colors"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Upload className="w-8 h-8 text-amber-500 mx-auto mb-2 opacity-80" />
                <p className="text-xs font-black text-slate-800 dark:text-slate-200">
                  Click to Browse or Drag & Drop Photo Here
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  किताब का डायग्राम, हाथ से बना रेखाचित्र या साइट फोटो अपलोड करें
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 max-h-60 flex items-center justify-center">
                  <img
                    src={imageUrl}
                    alt="Note preview"
                    className="max-h-60 w-auto object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImageUrl('');
                      setFileName('');
                    }}
                    className="absolute top-2 right-2 p-1.5 rounded-xl bg-rose-600 text-white shadow-md hover:bg-rose-700 transition-colors cursor-pointer"
                    title="Remove Photo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                    Image Caption / Diagram Title (चित्र का विवरण):
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Fig 1: Standard Slump Cone Dimensions (Height 300mm, Top 100mm, Base 200mm)"
                    value={imageCaption}
                    onChange={(e) => setImageCaption(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Executive Summary */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">
                Executive Chapter Summary (English) *
              </label>
              <textarea
                rows={2}
                placeholder="Brief 2-3 sentence overview of this note..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
                Executive Summary in Hindi (हिंदी सारांश - वैकल्पिक)
              </label>
              <textarea
                rows={2}
                placeholder="संक्षिप्त सारांश हिंदी में..."
                value={summaryHi}
                onChange={(e) => setSummaryHi(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-500"
              />
            </div>
          </div>

          {/* Detailed Content */}
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">
                  Section Heading (English)
                </label>
                <input
                  type="text"
                  value={sectionHeading}
                  onChange={(e) => setSectionHeading(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
                  Section Heading (Hindi)
                </label>
                <input
                  type="text"
                  value={sectionHeadingHi}
                  onChange={(e) => setSectionHeadingHi(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">
                Detailed Note Content (विस्तृत नोट्स सामग्री) *
              </label>
              <textarea
                rows={5}
                placeholder="Write your complete theory, points, steps, specifications, codal values..."
                value={sectionContent}
                onChange={(e) => setSectionContent(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
                Detailed Note Content in Hindi (हिंदी सामग्री - वैकल्पिक)
              </label>
              <textarea
                rows={3}
                placeholder="विस्तृत नोट्स हिंदी में (वैकल्पिक)..."
                value={sectionContentHi}
                onChange={(e) => setSectionContentHi(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-500"
              />
            </div>
          </div>

          {/* Formulas Builder */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-slate-700 dark:text-slate-300">
                Key Formulas (महत्वपूर्ण सूत्र)
              </label>
              <button
                type="button"
                onClick={handleAddFormula}
                className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center space-x-1 cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add Formula (+ सूत्र जोड़ें)</span>
              </button>
            </div>

            {formulas.map((form, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500">
                    Formula #{idx + 1}
                  </span>
                  {formulas.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveFormula(idx)}
                      className="text-rose-500 hover:text-rose-600 text-xs cursor-pointer"
                    >
                      Delete
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Formula Name (e.g. Slump Ratio)"
                    value={form.name}
                    onChange={(e) => handleFormulaChange(idx, 'name', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="Formula (e.g. h = h1 - h2)"
                    value={form.formula}
                    onChange={(e) => handleFormulaChange(idx, 'formula', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono font-bold text-amber-600 dark:text-amber-400"
                  />
                  <input
                    type="text"
                    placeholder="Note / Unit"
                    value={form.note}
                    onChange={(e) => handleFormulaChange(idx, 'note', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Exam Highlights */}
          <div>
            <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">
              Exam Highlights / Key Takeaways (प्रत्येक पंक्ति में एक मुख्य बिंदु):
            </label>
            <textarea
              rows={3}
              placeholder={'• True slump occurs in general concrete\n• Shear slump indicates lack of cohesion\n• Recommended slump for pumpable concrete is 75-100 mm'}
              value={examHighlightsInput}
              onChange={(e) => setExamHighlightsInput(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
            />
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
              <span>Save Note & Picture (नोट सुरक्षित करें)</span>
            </button>
          </div>
        </form>
      </div>

      {/* Owner Auth Modal */}
      <OwnerAuthModal
        isOpen={isOwnerAuthModalOpen}
        onClose={() => setIsOwnerAuthModalOpen(false)}
        targetActionName="आधिकारिक स्टडी नोट्स का प्रकाशन"
        onSuccess={() => {
          setIsOwner(true);
        }}
      />
    </div>
  );
};
