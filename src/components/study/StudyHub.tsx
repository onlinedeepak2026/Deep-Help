import React, { useState } from 'react';
import {
  BookOpen,
  FileText,
  HelpCircle,
  Award,
  Scroll,
  BookMarked,
  Search,
  Printer,
  Bookmark,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Sparkles,
  Filter,
  Layers,
  GraduationCap,
  Download,
  Plus,
  Trash2,
  Image as ImageIcon,
  Maximize2,
  X,
  User,
} from 'lucide-react';
import { ALL_CIVIL_SUBJECTS, CivilSubjectInfo } from '../../data/civilSubjects';
import { CIVIL_STUDY_NOTES, ChapterNote } from '../../data/notesData';
import { CIVIL_PYQS, PYQItem } from '../../data/pyqsData';
import { IS_CODES_LIST, ISCodeItem } from '../../data/isCodesData';
import { FormulaLibrary } from '../FormulaLibrary';
import { QuizManagement } from '../QuizManagement';
import { AddPyqModal } from './AddPyqModal';
import { AddNoteModal } from './AddNoteModal';
import { AcademicUploadsSection } from './AcademicUploadsSection';
import { ownerAuth } from '../../utils/ownerAuth';
import { OwnerAuthModal } from '../common/OwnerAuthModal';
import { Crown, Lock, ShieldCheck, Calculator } from 'lucide-react';

interface StudyHubProps {
  initialSubTab?: 'subjects' | 'notes' | 'pyqs' | 'academic-uploads' | 'quiz' | 'formulas' | 'codes';
  onNavigateToCalculator?: (calcId: string) => void;
}

export const StudyHub: React.FC<StudyHubProps> = ({
  initialSubTab = 'subjects',
  onNavigateToCalculator,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<
    'subjects' | 'notes' | 'pyqs' | 'academic-uploads' | 'quiz' | 'formulas' | 'codes'
  >(initialSubTab);

  // Subjects state
  const [subjectSearch, setSubjectSearch] = useState('');

  // Custom User Notes (Stored in localStorage)
  const [customNotes, setCustomNotes] = useState<ChapterNote[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('deephelp_custom_notes') || '[]');
    } catch {
      return [];
    }
  });

  // Custom User PYQs (Stored in localStorage)
  const [customPYQs, setCustomPYQs] = useState<PYQItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('deephelp_custom_pyqs') || '[]');
    } catch {
      return [];
    }
  });

  // Combined Notes and PYQs
  const allNotes = [...customNotes, ...CIVIL_STUDY_NOTES];
  const allPYQs = [...customPYQs, ...CIVIL_PYQS];

  // Notes state
  const [selectedNote, setSelectedNote] = useState<ChapterNote>(allNotes[0]);
  const [noteSearch, setNoteSearch] = useState('');
  const [notesFilterTab, setNotesFilterTab] = useState<'all' | 'custom'>('all');
  const [offlineNotes, setOfflineNotes] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('deephelp_offline_notes') || '[]');
    } catch {
      return [];
    }
  });

  // Modals state
  const [isAddPyqModalOpen, setIsAddPyqModalOpen] = useState(false);
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);
  const [isOwnerAuthModalOpen, setIsOwnerAuthModalOpen] = useState(false);
  const [isOwner, setIsOwner] = useState(() => ownerAuth.isOwner());
  const [lightboxImage, setLightboxImage] = useState<{ url: string; caption?: string } | null>(null);

  React.useEffect(() => {
    const handleOwnerChange = (e: any) => {
      setIsOwner(e.detail?.isOwner ?? ownerAuth.isOwner());
    };
    window.addEventListener('deephelp_owner_changed', handleOwnerChange);
    return () => window.removeEventListener('deephelp_owner_changed', handleOwnerChange);
  }, []);

  // PYQ state
  const [pyqExamFilter, setPyqExamFilter] = useState<string>('All');
  const [pyqSubjectFilter, setPyqSubjectFilter] = useState<string>('All');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showSolution, setShowSolution] = useState<Record<string, boolean>>({});

  // IS Codes state
  const [codeSearch, setCodeSearch] = useState('');
  const [codeCategoryFilter, setCodeCategoryFilter] = useState<string>('All');

  // Add new custom PYQ
  const handleSavePyq = (newPyq: PYQItem) => {
    const updated = [newPyq, ...customPYQs];
    setCustomPYQs(updated);
    try {
      localStorage.setItem('deephelp_custom_pyqs', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save PYQ to localStorage', e);
    }
  };

  // Delete custom PYQ
  const handleDeletePyq = (pyqId: string) => {
    if (!window.confirm('क्या आप वाकई इस प्रश्न को हटाना चाहते हैं?')) return;
    const updated = customPYQs.filter((q) => q.id !== pyqId);
    setCustomPYQs(updated);
    try {
      localStorage.setItem('deephelp_custom_pyqs', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to update PYQ storage', e);
    }
  };

  // Add new custom Note
  const handleSaveNote = (newNote: ChapterNote) => {
    const updated = [newNote, ...customNotes];
    setCustomNotes(updated);
    setSelectedNote(newNote);
    try {
      localStorage.setItem('deephelp_custom_notes', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save Note to localStorage', e);
    }
  };

  // Delete custom Note
  const handleDeleteNote = (noteId: string) => {
    if (!window.confirm('क्या आप वाकई इस व्यक्तिगत नोट को हटाना चाहते हैं?')) return;
    const updated = customNotes.filter((n) => n.id !== noteId);
    setCustomNotes(updated);
    try {
      localStorage.setItem('deephelp_custom_notes', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to update Note storage', e);
    }
    const remaining = [...updated, ...CIVIL_STUDY_NOTES];
    if (remaining.length > 0) {
      setSelectedNote(remaining[0]);
    }
  };

  // Toggle offline note save
  const toggleOfflineNote = (noteId: string) => {
    let updated: string[];
    if (offlineNotes.includes(noteId)) {
      updated = offlineNotes.filter((id) => id !== noteId);
    } else {
      updated = [...offlineNotes, noteId];
    }
    setOfflineNotes(updated);
    try {
      localStorage.setItem('deephelp_offline_notes', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // Filter subjects
  const filteredSubjects = ALL_CIVIL_SUBJECTS.filter((sub) => {
    const term = subjectSearch.toLowerCase();
    return (
      sub.name.toLowerCase().includes(term) ||
      sub.shortName.toLowerCase().includes(term) ||
      sub.description.toLowerCase().includes(term)
    );
  });

  // Filter notes
  const filteredNotes = allNotes.filter((n) => {
    const matchesTab = notesFilterTab === 'all' || (notesFilterTab === 'custom' && n.isCustom);
    const term = noteSearch.toLowerCase();
    const matchesSearch =
      n.subjectName.toLowerCase().includes(term) ||
      n.chapterTitle.toLowerCase().includes(term) ||
      n.chapterTitleHi.includes(noteSearch) ||
      n.tags.some((t) => t.toLowerCase().includes(term));
    return matchesTab && matchesSearch;
  });

  // Filter PYQs
  const filteredPYQs = allPYQs.filter((q) => {
    let matchesExam = false;
    if (pyqExamFilter === 'All') {
      matchesExam = true;
    } else if (pyqExamFilter === 'My PYQs') {
      matchesExam = Boolean(q.isCustom);
    } else {
      matchesExam = q.exam === pyqExamFilter;
    }

    const matchesSub = pyqSubjectFilter === 'All' || q.subject === pyqSubjectFilter;
    return matchesExam && matchesSub;
  });

  // Unique exams & subjects for filters
  const pyqExams = [
    'All',
    'My PYQs',
    'SSC JE',
    'RRB JE',
    'BTSC JE',
    'GATE Civil',
    'State AE/JE',
  ];
  const pyqSubjects = [
    'All',
    ...Array.from(new Set(allPYQs.map((q) => q.subject))),
  ];

  // Filter IS Codes
  const filteredISCodes = IS_CODES_LIST.filter((item) => {
    const matchesSearch =
      item.codeNumber.toLowerCase().includes(codeSearch.toLowerCase()) ||
      item.title.toLowerCase().includes(codeSearch.toLowerCase()) ||
      item.hindiTitle.includes(codeSearch) ||
      item.summary.toLowerCase().includes(codeSearch.toLowerCase());
    const matchesCategory =
      codeCategoryFilter === 'All' || item.category === codeCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  const isCodeCategories = [
    'All',
    'Concrete & RCC',
    'Steel Structures',
    'Soil & Foundation',
    'Earthquake & Wind',
    'Materials & Testing',
    'Surveying & Measurement',
    'Environmental & Plumbing',
    'Highway & Transportation',
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent border border-amber-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-xs font-black uppercase tracking-wider">
              📚 Academic & Exam Portal
            </span>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              IS Codal Compliant • Bilingual
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            Civil Engineering Study Section
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            20 core civil engineering subjects, chapter notes with PDF export & offline storage, 
            past year question papers (PYQs) with explanations, formula book, and the complete IS code directory.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center space-x-3 text-center shrink-0">
          <div className="px-3.5 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="text-lg font-black text-amber-600 dark:text-amber-400">
              {ALL_CIVIL_SUBJECTS.length}
            </div>
            <div className="text-[10px] font-bold text-slate-400">Subjects</div>
          </div>
          <div className="px-3.5 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="text-lg font-black text-amber-600 dark:text-amber-400">
              {CIVIL_PYQS.length}+
            </div>
            <div className="text-[10px] font-bold text-slate-400">PYQs</div>
          </div>
          <div className="px-3.5 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="text-lg font-black text-amber-600 dark:text-amber-400">
              {IS_CODES_LIST.length}
            </div>
            <div className="text-[10px] font-bold text-slate-400">IS Codes</div>
          </div>
        </div>
      </div>

      {/* Primary Sub-Navigation Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none border-b border-slate-200 dark:border-slate-800">
        {[
          { id: 'academic-uploads', label: 'PYQs, Practicals & Assignments (Uploads)', labelHi: 'प्रश्न, प्रैक्टिकल व असाइनमेंट', icon: <Layers className="w-4 h-4 text-amber-500" /> },
          { id: 'subjects', label: 'All Subjects (20)', labelHi: 'सभी विषय', icon: <BookOpen className="w-4 h-4" /> },
          { id: 'notes', label: 'Study Notes & PDF', labelHi: 'नोट्स एवं पीडीएफ', icon: <FileText className="w-4 h-4" /> },
          { id: 'pyqs', label: 'Previous Year Questions', labelHi: 'पिछले वर्षों के प्रश्न', icon: <Award className="w-4 h-4" /> },
          { id: 'quiz', label: 'MCQ Quiz Exam', labelHi: 'क्विज टेस्ट', icon: <HelpCircle className="w-4 h-4" /> },
          { id: 'formulas', label: 'Formula Book', labelHi: 'फॉर्मूला बुक', icon: <BookMarked className="w-4 h-4" /> },
          { id: 'codes', label: 'IS Codes List', labelHi: 'आईएस कोड सूची', icon: <Scroll className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeSubTab === tab.id
                ? 'bg-amber-500 text-slate-950 shadow-sm scale-102 font-black'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-amber-500/40'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ⭐ Dedicated Spotlight Quick Bar: Scientific Calculator + Practical Assignments + PYQ Vault */}
      <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-sky-500/10 to-emerald-500/10 border border-amber-500/30 flex flex-col md:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
            ⭐
          </span>
          <div>
            <h3 className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>Quick Exam & Lab Spotlight</span>
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-normal">
                (Highlighted in One Place)
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Direct access: Scientific Calculator • Practical Assignments • Previous Year Questions
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onNavigateToCalculator?.('scientific')}
            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-xs transition-transform hover:scale-102 cursor-pointer"
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>🧮 Scientific Calculator (fx-991)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('academic-uploads')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-transform hover:scale-102 cursor-pointer ${
              activeSubTab === 'academic-uploads'
                ? 'bg-sky-500 text-white font-black'
                : 'bg-white dark:bg-slate-800 text-sky-700 dark:text-sky-300 border border-sky-300/40 hover:bg-sky-50 dark:hover:bg-slate-700'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>🧪 Practical Assignments</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('pyqs')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-transform hover:scale-102 cursor-pointer ${
              activeSubTab === 'pyqs'
                ? 'bg-emerald-500 text-slate-950 font-black'
                : 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 border border-emerald-300/40 hover:bg-emerald-50 dark:hover:bg-slate-700'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>📜 Solved PYQs</span>
          </button>
        </div>
      </div>

      {/* ================= 0. ACADEMIC UPLOADS (PYQS, PRACTICALS & ASSIGNMENTS) ================= */}
      {activeSubTab === 'academic-uploads' && <AcademicUploadsSection />}

      {/* ================= 1. ALL SUBJECTS DIRECTORY ================= */}
      {activeSubTab === 'subjects' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search civil subjects (SOM, RCC, Soil...)"
                value={subjectSearch}
                onChange={(e) => setSubjectSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-white"
              />
            </div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Showing {filteredSubjects.length} of {ALL_CIVIL_SUBJECTS.length} subjects
            </span>
          </div>

          {/* Subjects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSubjects.map((subject) => (
              <div
                key={subject.id}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-amber-500/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md bg-amber-500/15 text-amber-700 dark:text-amber-300 text-[11px] font-black uppercase font-mono">
                      {subject.shortName}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400">
                      {subject.coreTopicsCount} Core Units
                    </span>
                  </div>

                  <h4 className="text-sm font-black text-slate-900 dark:text-white mt-2 leading-snug">
                    {subject.name}
                  </h4>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                    {subject.description}
                  </p>

                  {/* Standard IS Codes */}
                  {subject.standardCodes && subject.standardCodes.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {subject.standardCodes.map((code, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-mono font-bold text-slate-600 dark:text-slate-300"
                        >
                          {code}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-semibold">
                    Exam Standard
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const matchNote = CIVIL_STUDY_NOTES.find(
                        (n) => n.subjectId === subject.id || n.subjectName.toLowerCase().includes(subject.id)
                      );
                      if (matchNote) {
                        setSelectedNote(matchNote);
                      }
                      setActiveSubTab('notes');
                    }}
                    className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-500 flex items-center space-x-1 cursor-pointer"
                  >
                    <span>Read Notes</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= 2. STUDY NOTES (PDF + OFFLINE) ================= */}
      {activeSubTab === 'notes' && (
        <div className="space-y-6">
          {/* Notes Top Action & Filter Bar */}
          <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setNotesFilterTab('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  notesFilterTab === 'all'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                All Notes ({allNotes.length})
              </button>
              <button
                type="button"
                onClick={() => setNotesFilterTab('custom')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                  notesFilterTab === 'custom'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>My Notes & Photos ({customNotes.length})</span>
              </button>
            </div>

            {isOwner ? (
              <button
                type="button"
                onClick={() => setIsAddNoteModalOpen(true)}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs flex items-center justify-center space-x-2 shadow-sm transition-all cursor-pointer"
              >
                <Crown className="w-4 h-4 text-slate-950" />
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Founder Note (Er. Deepak Kumar)</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsOwnerAuthModalOpen(true)}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center space-x-2 border border-slate-300 dark:border-slate-700 transition-all cursor-pointer"
                title="Official study notes are uploaded by Founder Er. Deepak Kumar"
              >
                <Lock className="w-3.5 h-3.5 text-amber-500" />
                <span>+ Add Note (Owner Only - Er. Deepak Kumar)</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Notes List */}
            <div className="lg:col-span-4 space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter notes by title or tag..."
                  value={noteSearch}
                  onChange={(e) => setNoteSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-white"
                />
              </div>

              {filteredNotes.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                  <FileText className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">
                    {notesFilterTab === 'custom'
                      ? 'आपने अभी तक कोई व्यक्तिगत नोट या चित्र नहीं जोड़ा है।'
                      : 'कोई नोट नहीं मिला।'}
                  </p>
                  {notesFilterTab === 'custom' && (
                    <button
                      type="button"
                      onClick={() => setIsAddNoteModalOpen(true)}
                      className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs cursor-pointer"
                    >
                      + पहला नोट जोड़ें
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-2 max-h-[650px] overflow-y-auto pr-1">
                  {filteredNotes.map((note) => {
                    const isSelected = selectedNote.id === note.id;
                    const isSavedOffline = offlineNotes.includes(note.id);
                    return (
                      <div
                        key={note.id}
                        onClick={() => setSelectedNote(note)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-500 shadow-sm'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-amber-500/40'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-black uppercase text-amber-600 dark:text-amber-400">
                            {note.subjectName}
                          </span>
                          <div className="flex items-center space-x-1.5">
                            {note.isCustom && (
                              <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-800 dark:text-amber-300 text-[9px] font-bold">
                                My Note
                              </span>
                            )}
                            {note.imageUrl && (
                              <span className="px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-600 dark:text-blue-300 text-[9px] font-bold flex items-center space-x-0.5">
                                <ImageIcon className="w-2.5 h-2.5" />
                                <span>Pic</span>
                              </span>
                            )}
                            {isSavedOffline && (
                              <span className="text-[10px] font-bold text-emerald-600 flex items-center space-x-1">
                                <Bookmark className="w-3 h-3 fill-emerald-500" />
                              </span>
                            )}
                          </div>
                        </div>
                        <h4 className="text-xs font-black text-slate-900 dark:text-white leading-snug">
                          {note.chapterTitle}
                        </h4>
                        <div className="text-[11px] font-medium text-slate-500 mt-0.5">
                          {note.chapterTitleHi}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right Column: Note Reader */}
            <div className="lg:col-span-8">
              <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                {/* Note Header & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <div className="flex items-center flex-wrap gap-2">
                      <span className="px-2.5 py-0.5 rounded-lg bg-amber-500 text-slate-950 text-xs font-black">
                        {selectedNote.subjectName}
                      </span>
                      {selectedNote.isCustom && (
                        <span className="px-2 py-0.5 rounded-lg bg-blue-500/20 text-blue-700 dark:text-blue-300 text-xs font-black flex items-center space-x-1">
                          <User className="w-3 h-3" />
                          <span>Self Added Note (व्यक्तिगत नोट)</span>
                        </span>
                      )}
                      <span className="text-xs font-bold text-slate-400">
                        {selectedNote.readingTimeMinutes} min read
                      </span>
                      {selectedNote.isStandardCodeRef && (
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-mono font-bold text-slate-600 dark:text-slate-300">
                          {selectedNote.isStandardCodeRef}
                        </span>
                      )}
                    </div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white mt-2">
                      {selectedNote.chapterTitle}
                    </h2>
                    <div className="text-xs font-bold text-amber-600 dark:text-amber-400 mt-1">
                      {selectedNote.chapterTitleHi}
                    </div>
                  </div>

                  <div className="flex items-center flex-wrap gap-2 shrink-0">
                    {selectedNote.isCustom && (
                      <button
                        type="button"
                        onClick={() => handleDeleteNote(selectedNote.id)}
                        className="px-3 py-2 rounded-xl text-xs font-bold border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition-colors flex items-center space-x-1.5 cursor-pointer"
                        title="Delete this custom note"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => toggleOfflineNote(selectedNote.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center space-x-1.5 cursor-pointer ${
                        offlineNotes.includes(selectedNote.id)
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border-emerald-500/30'
                          : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <Bookmark
                        className={`w-3.5 h-3.5 ${
                          offlineNotes.includes(selectedNote.id) ? 'fill-emerald-500' : ''
                        }`}
                      />
                      <span>
                        {offlineNotes.includes(selectedNote.id) ? 'Saved' : 'Save Offline'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs flex items-center space-x-1.5 cursor-pointer shadow-sm transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print / PDF</span>
                    </button>
                  </div>
                </div>

                {/* Main Chapter Image / Diagram if attached */}
                {selectedNote.imageUrl && (
                  <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-3 space-y-2">
                    <div className="relative group overflow-hidden rounded-2xl max-h-96 flex items-center justify-center bg-slate-950/5 dark:bg-slate-950/40">
                      <img
                        src={selectedNote.imageUrl}
                        alt={selectedNote.imageCaption || selectedNote.chapterTitle}
                        className="w-full max-h-96 object-contain rounded-2xl cursor-pointer hover:scale-[1.01] transition-transform"
                        onClick={() =>
                          setLightboxImage({
                            url: selectedNote.imageUrl!,
                            caption: selectedNote.imageCaption || selectedNote.chapterTitle,
                          })
                        }
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setLightboxImage({
                            url: selectedNote.imageUrl!,
                            caption: selectedNote.imageCaption || selectedNote.chapterTitle,
                          })
                        }
                        className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-bold flex items-center space-x-1 backdrop-blur-sm cursor-pointer shadow-lg"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span>Zoom / बड़ा देखें</span>
                      </button>
                    </div>
                    {selectedNote.imageCaption && (
                      <div className="px-2 text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center space-x-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>{selectedNote.imageCaption}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Summary */}
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                  <div className="text-xs font-bold text-amber-800 dark:text-amber-300">
                    Executive Chapter Summary:
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 font-medium">
                    {selectedNote.summary}
                  </p>
                  {selectedNote.summaryHi && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 italic">
                      {selectedNote.summaryHi}
                    </p>
                  )}
                </div>

                {/* Sections */}
                <div className="space-y-6">
                  {selectedNote.sections.map((sec, sIdx) => (
                    <div key={sIdx} className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                          {sIdx + 1}
                        </span>
                        <div>
                          <h4 className="text-base font-black text-slate-900 dark:text-white">
                            {sec.heading}
                          </h4>
                          {sec.headingHi && (
                            <div className="text-xs font-bold text-amber-600 dark:text-amber-400">
                              {sec.headingHi}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="pl-8 space-y-3">
                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium whitespace-pre-line">
                          {sec.content}
                        </p>
                        {sec.contentHi && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed italic whitespace-pre-line">
                            {sec.contentHi}
                          </p>
                        )}

                        {/* Section Image if present */}
                        {sec.imageUrl && (
                          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 p-2 bg-slate-50 dark:bg-slate-800/40">
                            <img
                              src={sec.imageUrl}
                              alt={sec.imageCaption || sec.heading}
                              className="max-h-72 w-full object-contain rounded-xl cursor-pointer"
                              onClick={() =>
                                setLightboxImage({
                                  url: sec.imageUrl!,
                                  caption: sec.imageCaption || sec.heading,
                                })
                              }
                            />
                            {sec.imageCaption && (
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 px-1 italic">
                                {sec.imageCaption}
                              </p>
                            )}
                          </div>
                        )}

                        {/* Formulas */}
                        {sec.formulas && sec.formulas.length > 0 && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                            {sec.formulas.map((form, fIdx) => (
                              <div
                                key={fIdx}
                                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 space-y-1"
                              >
                                <div className="text-[11px] font-black text-slate-700 dark:text-slate-300">
                                  {form.name}
                                </div>
                                <div className="text-xs font-mono font-black text-amber-600 dark:text-amber-400">
                                  {form.formula}
                                </div>
                                {form.note && (
                                  <div className="text-[10px] text-slate-400 font-medium">
                                    {form.note}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Exam Highlights */}
                        {sec.examHighlights && sec.examHighlights.length > 0 && (
                          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5">
                            <div className="text-[11px] font-black text-slate-900 dark:text-white flex items-center space-x-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                              <span>Important Exam Highlights (SSC / GATE / RRB)</span>
                            </div>
                            <ul className="list-disc list-inside text-xs text-slate-600 dark:text-slate-300 space-y-1 font-medium">
                              {sec.examHighlights.map((hl, hIdx) => (
                                <li key={hIdx}>{hl}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= 3. PREVIOUS YEAR QUESTIONS (PYQS) ================= */}
      {activeSubTab === 'pyqs' && (
        <div className="space-y-4">
          {/* Filters & Action Bar */}
          <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-500 flex items-center space-x-1">
                <Filter className="w-3.5 h-3.5" />
                <span>Exam:</span>
              </span>
              {pyqExams.map((exam) => (
                <button
                  key={exam}
                  type="button"
                  onClick={() => setPyqExamFilter(exam)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    pyqExamFilter === exam
                      ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {exam === 'My PYQs' ? `👤 My PYQs (${customPYQs.length})` : exam}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-500 shrink-0">Subject:</span>
                <select
                  value={pyqSubjectFilter}
                  onChange={(e) => setPyqSubjectFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                >
                  {pyqSubjects.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={() => setIsAddPyqModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs flex items-center space-x-1.5 shadow-sm transition-all cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add PYQ / प्रश्न जोड़ें</span>
              </button>
            </div>
          </div>

          {/* Question List */}
          {filteredPYQs.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <Award className="w-10 h-10 text-slate-400 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-sm font-black text-slate-800 dark:text-white">
                  {pyqExamFilter === 'My PYQs'
                    ? 'आपने अभी तक कोई व्यक्तिगत PYQ प्रश्न नहीं जोड़ा है।'
                    : 'इस फ़िल्टर के साथ कोई प्रश्न नहीं मिला।'}
                </h3>
                <p className="text-xs text-slate-500">
                  आप किसी भी विषय (Concrete, Surveying, RCC, SOM आदि) में अपना प्रश्न जोड़ सकते हैं।
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddPyqModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-black text-xs inline-flex items-center space-x-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ नया प्रश्न अभी जोड़ें</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPYQs.map((q, idx) => {
                const userAns = selectedAnswers[q.id];
                const isAnswered = userAns !== undefined;
                const isCorrect = userAns === q.correctOption;
                const isSolutionOpen = showSolution[q.id];

                return (
                  <div
                    key={q.id}
                    className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-all"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center space-x-2">
                        <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/15 text-amber-700 dark:text-amber-300 text-xs font-black">
                          {q.exam} • {q.year}
                        </span>
                        <span className="text-xs font-bold text-slate-400">{q.subject}</span>
                        {q.isCustom && (
                          <span className="px-2 py-0.5 rounded-md bg-blue-500/15 text-blue-600 dark:text-blue-400 text-[10px] font-bold flex items-center space-x-1">
                            <User className="w-2.5 h-2.5" />
                            <span>My PYQ (मेरा प्रश्न)</span>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-3">
                        <span className="text-xs font-bold text-slate-400">Q #{idx + 1}</span>
                        {q.isCustom && (
                          <button
                            type="button"
                            onClick={() => handleDeletePyq(q.id)}
                            className="p-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-500 text-xs flex items-center space-x-1 cursor-pointer"
                            title="Delete this question"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span className="text-[11px] font-bold">Delete</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Question Text */}
                    <div>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white leading-relaxed">
                        {q.questionEn}
                      </h4>
                      {q.questionHi && (
                        <div className="text-xs font-bold text-amber-600 dark:text-amber-400 mt-1">
                          {q.questionHi}
                        </div>
                      )}
                    </div>

                    {/* Options */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {q.optionsEn.map((opt, oIdx) => {
                        let btnStyle =
                          'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200';
                        if (isAnswered) {
                          if (oIdx === q.correctOption) {
                            btnStyle =
                              'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold';
                          } else if (oIdx === userAns) {
                            btnStyle =
                              'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300';
                          }
                        }

                        return (
                          <button
                            key={oIdx}
                            type="button"
                            disabled={isAnswered}
                            onClick={() => {
                              setSelectedAnswers((prev) => ({ ...prev, [q.id]: oIdx }));
                              setShowSolution((prev) => ({ ...prev, [q.id]: true }));
                            }}
                            className={`p-3 rounded-2xl border text-left text-xs font-semibold transition-all cursor-pointer flex items-center justify-between ${btnStyle}`}
                          >
                            <div className="flex items-center space-x-2">
                              <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-bold flex items-center justify-center shrink-0">
                                {String.fromCharCode(65 + oIdx)}
                              </span>
                              <span>{opt}</span>
                            </div>
                            {isAnswered && oIdx === q.correctOption && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 ml-2" />
                            )}
                            {isAnswered && oIdx === userAns && !isCorrect && (
                              <XCircle className="w-4 h-4 text-rose-500 shrink-0 ml-2" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Solution & Explanation */}
                    {isSolutionOpen && (
                      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 bg-amber-500/5 p-4 rounded-2xl">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                            Correct Answer: Option {String.fromCharCode(65 + q.correctOption)} ({q.optionsEn[q.correctOption]})
                          </span>
                          {q.codeReference && (
                            <span className="text-[10px] font-mono font-bold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded">
                              {q.codeReference}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-700 dark:text-slate-300 font-medium whitespace-pre-line">
                          {q.solutionEn}
                        </p>
                        {q.solutionHi && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 whitespace-pre-line italic">
                            {q.solutionHi}
                          </p>
                        )}
                      </div>
                    )}

                    {!isSolutionOpen && (
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() =>
                            setShowSolution((prev) => ({ ...prev, [q.id]: !prev[q.id] }))
                          }
                          className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
                        >
                          View Detailed Solution
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ================= 4. MCQ QUIZ ================= */}
      {activeSubTab === 'quiz' && (
        <div className="space-y-4">
          <QuizManagement />
        </div>
      )}

      {/* ================= 5. FORMULA BOOK ================= */}
      {activeSubTab === 'formulas' && (
        <div className="space-y-4">
          <FormulaLibrary />
        </div>
      )}

      {/* ================= 6. IS CODES DIRECTORY ================= */}
      {activeSubTab === 'codes' && (
        <div className="space-y-4">
          {/* Search & Category Filter */}
          <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search IS Code (e.g. 456, 800, 1893...)"
                value={codeSearch}
                onChange={(e) => setCodeSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <span className="text-xs font-bold text-slate-500 shrink-0">Category:</span>
              <select
                value={codeCategoryFilter}
                onChange={(e) => setCodeCategoryFilter(e.target.value)}
                className="w-full sm:w-auto px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
              >
                {isCodeCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* IS Codes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredISCodes.map((code) => (
              <div
                key={code.id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-3 py-1 rounded-xl bg-amber-500 text-slate-950 text-xs font-mono font-black">
                      {code.codeNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500 dark:text-slate-400">
                      {code.category}
                    </span>
                  </div>

                  <h3 className="text-sm font-black text-slate-900 dark:text-white leading-snug">
                    {code.title}
                  </h3>
                  <div className="text-xs font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                    {code.hindiTitle}
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 font-medium">
                    {code.summary}
                  </p>

                  {/* Key Clauses */}
                  <div className="mt-4 space-y-2">
                    <div className="text-[11px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Critical Clauses for Field & Exams:
                    </div>
                    {code.keyClauses.map((kc, kIdx) => (
                      <div
                        key={kIdx}
                        className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-700/60"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400">
                            {kc.clauseNumber}
                          </span>
                          <span className="text-[10px] font-bold text-slate-500">
                            {kc.title}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-700 dark:text-slate-300 mt-1">
                          {kc.description}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400 font-medium">
                    {code.practicalApplication}
                  </span>
                  <a
                    href={`https://www.google.com/search?q=${encodeURIComponent(
                      code.codeNumber + ' bureau of indian standards pdf'
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-amber-600 dark:text-amber-400 font-bold hover:underline flex items-center space-x-1"
                  >
                    <span>BIS Reference</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= USER CONTENT MODALS ================= */}

      {/* Add Custom PYQ Modal */}
      <AddPyqModal
        isOpen={isAddPyqModalOpen}
        onClose={() => setIsAddPyqModalOpen(false)}
        onSavePyq={handleSavePyq}
      />

      {/* Add Custom Note with Diagram/Photo Modal */}
      <AddNoteModal
        isOpen={isAddNoteModalOpen}
        onClose={() => setIsAddNoteModalOpen(false)}
        onSaveNote={handleSaveNote}
      />

      {/* Owner Authentication Modal for Notes & Academic Materials */}
      <OwnerAuthModal
        isOpen={isOwnerAuthModalOpen}
        onClose={() => setIsOwnerAuthModalOpen(false)}
        onSuccess={() => setIsAddNoteModalOpen(true)}
        targetActionName="सिविल इंजीनियरिंग नोट्स शेयर व पब्लिश करना"
      />

      {/* Full-Screen Diagram / Photo Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLightboxImage(null)}
              className="absolute -top-12 right-0 p-2 text-white/80 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <img
              src={lightboxImage.url}
              alt={lightboxImage.caption || 'Enlarged photo'}
              className="max-h-[80vh] w-auto max-w-full object-contain rounded-2xl shadow-2xl border border-white/20"
            />

            {lightboxImage.caption && (
              <div className="mt-3 px-4 py-2 rounded-xl bg-slate-900/90 border border-white/10 text-white text-xs font-semibold text-center max-w-lg">
                {lightboxImage.caption}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
