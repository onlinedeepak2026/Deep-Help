import React, { useState, useEffect } from 'react';
import {
  Upload,
  Search,
  Filter,
  FileText,
  Layers,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Download,
  Trash2,
  Eye,
  Plus,
  HardDrive,
  RefreshCw,
  FolderDown,
  FolderUp,
  Sparkles,
} from 'lucide-react';
import { ALL_CIVIL_SUBJECTS } from '../../data/civilSubjects';
import { AcademicResource, AcademicResourceType, AcademicStorageStats } from '../../types/academic';
import { unlimitedAcademicStorage } from '../../utils/unlimitedAcademicStorage';
import { UploadAcademicModal } from './UploadAcademicModal';
import { AcademicResourceViewerModal } from './AcademicResourceViewerModal';
import { ownerAuth } from '../../utils/ownerAuth';
import { OwnerAuthModal } from '../common/OwnerAuthModal';
import { Crown, Lock } from 'lucide-react';

export const AcademicUploadsSection: React.FC = () => {
  const [resources, setResources] = useState<AcademicResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<AcademicStorageStats | null>(null);

  // Filters
  const [activeTypeTab, setActiveTypeTab] = useState<'all' | AcademicResourceType | 'my_uploads'>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedSemester, setSelectedSemester] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [viewerResource, setViewerResource] = useState<AcademicResource | null>(null);
  const [uploadDefaultType, setUploadDefaultType] = useState<AcademicResourceType>('pyq');
  const [isOwner, setIsOwner] = useState(() => ownerAuth.isOwner());
  const [isOwnerModalOpen, setIsOwnerModalOpen] = useState(false);

  useEffect(() => {
    const handleOwnerChange = (e: any) => {
      setIsOwner(e.detail?.isOwner ?? ownerAuth.isOwner());
    };
    window.addEventListener('deephelp_owner_changed', handleOwnerChange);
    return () => window.removeEventListener('deephelp_owner_changed', handleOwnerChange);
  }, []);

  const loadResources = async () => {
    setIsLoading(true);
    try {
      const items = await unlimitedAcademicStorage.getAllResources();
      setResources(items);
      const storageStats = await unlimitedAcademicStorage.getStats();
      setStats(storageStats);
    } catch (err) {
      console.error('Failed to load academic resources', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadResources();
  }, []);

  const handleUploadSuccess = (newRes: AcademicResource) => {
    setResources((prev) => [newRes, ...prev]);
    unlimitedAcademicStorage.getStats().then(setStats);
  };

  const handleDeleteResource = async (id: string) => {
    if (!window.confirm('क्या आप वाकई इस दस्तावेज को हटाना चाहते हैं?')) return;
    try {
      await unlimitedAcademicStorage.deleteResource(id);
      setResources((prev) => prev.filter((r) => r.id !== id));
      if (viewerResource?.id === id) {
        setViewerResource(null);
      }
      unlimitedAcademicStorage.getStats().then(setStats);
    } catch (err) {
      console.error('Failed to delete resource', err);
    }
  };

  const handleExportBackup = () => {
    unlimitedAcademicStorage.exportBackup();
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    unlimitedAcademicStorage
      .importBackup(file)
      .then((count) => {
        alert(`सफलतापूर्वक ${count} अकादमिक फाइल्स रीस्टोर हो गईं!`);
        loadResources();
      })
      .catch((err) => {
        alert(`आयात विफल: ${err.message}`);
      });
  };

  // Filter items
  const filteredResources = resources.filter((item) => {
    // Type Filter
    if (activeTypeTab === 'my_uploads') {
      if (item.isPreloaded) return false;
    } else if (activeTypeTab !== 'all') {
      if (item.type !== activeTypeTab) return false;
    }

    // Subject Filter
    if (selectedSubject !== 'all' && item.subjectId !== selectedSubject) {
      return false;
    }

    // Semester Filter
    if (selectedSemester !== 'all' && item.semester !== selectedSemester) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchSubject = item.subjectName.toLowerCase().includes(q);
      const matchDesc = item.description?.toLowerCase().includes(q);
      const matchExam = item.examName?.toLowerCase().includes(q);
      const matchExp = item.experimentNumber?.toLowerCase().includes(q);
      const matchTags = item.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchSubject && !matchDesc && !matchExam && !matchExp && !matchTags) {
        return false;
      }
    }

    return true;
  });

  const semesters = [
    'all',
    'Semester 1',
    'Semester 2',
    'Semester 3',
    'Semester 4',
    'Semester 5',
    'Semester 6',
    'Semester 7',
    'Semester 8',
    'Diploma 1st Year',
    'Diploma 2nd Year',
    'Diploma 3rd Year',
    'Competitive',
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner & Upload Triggers */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/15 via-slate-900/5 to-transparent border border-amber-500/20 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-xs font-black uppercase tracking-wider">
              📑 Subject Academic Vault
            </span>
            <span className="inline-flex items-center space-x-1 text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
              <HardDrive className="w-3.5 h-3.5" />
              <span>Unlimited IndexedDB Storage</span>
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1.5">
            Subject-wise Previous Questions, Practicals & Assignments
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
            अपलोड करें विषयवार पिछले वर्षों के प्रश्न पत्र (PYQs with Solutions), लैब प्रैक्टिकल फाइल्स (Aim, Apparatus & Viva)
            तथा असाइनमेंट शीट्स। असीमित क्षमता (No 5MB crash limit) के साथ सुरक्षित एवं ऑफलाइन उपलब्ध।
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {/* 1. PYQs: Open to All Students & Engineers */}
          <button
            type="button"
            onClick={() => {
              setUploadDefaultType('pyq');
              setIsUploadModalOpen(true);
            }}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>+ Share PYQ (छात्र व इंजीनियर)</span>
          </button>

          {/* 2. Practical & Assignments: Strictly Restricted to Owner */}
          {isOwner ? (
            <button
              type="button"
              onClick={() => {
                setUploadDefaultType('practical');
                setIsUploadModalOpen(true);
              }}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs transition-all shadow-md cursor-pointer"
            >
              <Crown className="w-4 h-4 text-slate-950" />
              <span>+ Upload Practical / Assignment (Er. Deepak)</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsOwnerModalOpen(true)}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors border border-slate-300 dark:border-slate-700 cursor-pointer"
              title="Official practical lab files and assignments can only be shared by Founder Er. Deepak Kumar"
            >
              <Lock className="w-3.5 h-3.5 text-amber-500" />
              <span>+ Lab & Assignments (Owner Only - Er. Deepak Kumar)</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleExportBackup}
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors border border-slate-200 dark:border-slate-700"
            title="Download JSON Backup of all files"
          >
            <FolderDown className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">Backup</span>
          </button>

          <label
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
            title="Restore from JSON Backup"
          >
            <FolderUp className="w-3.5 h-3.5 text-sky-500" />
            <span className="hidden sm:inline">Restore</span>
            <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
          </label>
        </div>
      </div>

      {/* Quick Category Filters */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none border-b border-slate-200 dark:border-slate-800">
        {[
          { id: 'all' as const, label: 'All Resources (सब कुछ)', count: resources.length },
          {
            id: 'pyq' as const,
            label: 'PYQ Papers (प्रश्न पत्र)',
            count: stats?.pyqCount ?? resources.filter((r) => r.type === 'pyq').length,
          },
          {
            id: 'practical' as const,
            label: 'Practical Files (प्रैक्टिकल)',
            count: stats?.practicalCount ?? resources.filter((r) => r.type === 'practical').length,
          },
          {
            id: 'assignment' as const,
            label: 'Assignments (असाइनमेंट)',
            count: stats?.assignmentCount ?? resources.filter((r) => r.type === 'assignment').length,
          },
          {
            id: 'my_uploads' as const,
            label: 'My Uploads (मेरे अपलोड्स)',
            count: resources.filter((r) => !r.isPreloaded).length,
          },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTypeTab(tab.id)}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all flex items-center space-x-1.5 cursor-pointer ${
              activeTypeTab === tab.id
                ? 'bg-amber-500 text-slate-950 shadow-xs font-black'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                activeTypeTab === tab.id
                  ? 'bg-slate-950/20 text-slate-950'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search & Subject Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
        {/* Search */}
        <div className="relative sm:col-span-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by topic, paper, experiment name, or tag..."
            className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Subject Filter */}
        <div>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500"
          >
            <option value="all">All Subjects (सभी विषय)</option>
            {ALL_CIVIL_SUBJECTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Semester Filter */}
        <div>
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500"
          >
            {semesters.map((sem) => (
              <option key={sem} value={sem}>
                {sem === 'all' ? 'All Semesters / Exams' : sem}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Resources Cards Grid */}
      {isLoading ? (
        <div className="py-16 text-center">
          <RefreshCw className="w-8 h-8 mx-auto text-amber-500 animate-spin mb-2" />
          <p className="text-xs text-slate-500">Loading academic resources from unlimited vault...</p>
        </div>
      ) : filteredResources.length === 0 ? (
        <div className="py-16 text-center space-y-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8">
          <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
            <Upload className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-white">
              No academic resources found for current filters
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
              You haven't uploaded or filtered any PYQs, practicals, or assignments here yet. Upload your first document now!
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsUploadModalOpen(true)}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Upload PYQ / Practical File</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResources.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group hover:border-amber-500/40"
            >
              <div>
                {/* Card Top Badges */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      item.type === 'pyq'
                        ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30'
                        : item.type === 'practical'
                        ? 'bg-sky-500/15 text-sky-700 dark:text-sky-400 border border-sky-500/30'
                        : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                    }`}
                  >
                    {item.type === 'pyq' && <Award className="w-3 h-3" />}
                    {item.type === 'practical' && <Layers className="w-3 h-3" />}
                    {item.type === 'assignment' && <FileText className="w-3 h-3" />}
                    <span>{item.type.toUpperCase()}</span>
                  </span>

                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                    {item.semester}
                  </span>
                </div>

                {/* Subject & Sub-Badge */}
                <div className="text-[11px] font-bold text-amber-600 dark:text-amber-400 truncate mb-1">
                  {item.subjectName}
                  {item.academicYear ? ` (${item.academicYear})` : ''}
                </div>

                {/* Title */}
                <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-amber-500 transition-colors">
                  {item.title}
                </h3>

                {/* Description or Aim Snippet */}
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                  {item.aim || item.description || (item.solutionText ? item.solutionText.slice(0, 100) : 'Civil engineering document.')}
                </p>

                {/* Attachment Indicator */}
                <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[11px]">
                  {item.fileAttachment ? (
                    <span className="inline-flex items-center space-x-1 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/70 px-2 py-0.5 rounded-md font-medium">
                      <FileText className="w-3 h-3 text-amber-500" />
                      <span className="truncate max-w-[130px]">{item.fileAttachment.name}</span>
                      <span className="text-slate-400">
                        ({(item.fileAttachment.size / (1024 * 1024)).toFixed(1)}MB)
                      </span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1 text-slate-500 text-[10px]">
                      <span>Text Notes & Solved</span>
                    </span>
                  )}

                  {item.hasSolution && (
                    <span className="inline-flex items-center space-x-1 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md text-[10px] font-bold">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Solved / Key</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setViewerResource(item)}
                  className="flex-1 inline-flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500 text-amber-700 hover:text-slate-950 dark:text-amber-400 dark:hover:text-slate-950 font-bold text-xs transition-all cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View & Read (देखें)</span>
                </button>

                {!item.isPreloaded && (
                  <button
                    type="button"
                    onClick={() => handleDeleteResource(item.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                    title="Delete document"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Storage Vault Footer Indicator */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <HardDrive className="w-4 h-4 text-emerald-500" />
          <span>
            Vault Status: <strong>{resources.length} Academic Files</strong> • Safe Local IndexedDB Storage
            {stats && (
              <span> • {(stats.totalBytes / (1024 * 1024)).toFixed(2)} MB Used</span>
            )}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={loadResources}
            className="hover:text-amber-500 flex items-center space-x-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Vault</span>
          </button>
        </div>
      </div>

      {/* Upload Modal */}
      <UploadAcademicModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={handleUploadSuccess}
        defaultType={uploadDefaultType}
      />

      {/* Viewer Modal */}
      <AcademicResourceViewerModal
        isOpen={Boolean(viewerResource)}
        onClose={() => setViewerResource(null)}
        resource={viewerResource}
        onDelete={handleDeleteResource}
      />

      {/* Owner Authentication Modal */}
      <OwnerAuthModal
        isOpen={isOwnerModalOpen}
        onClose={() => setIsOwnerModalOpen(false)}
        onSuccess={() => {
          setUploadDefaultType('practical');
          setIsUploadModalOpen(true);
        }}
        targetActionName="प्रैक्टिकल व लैब असाइनमेंट अपलोड"
      />
    </div>
  );
};
