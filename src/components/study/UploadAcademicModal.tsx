import React, { useState, useRef } from 'react';
import {
  Upload,
  X,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Layers,
  Sparkles,
  BookOpen,
  Award,
  Calendar,
  HelpCircle,
} from 'lucide-react';
import { ALL_CIVIL_SUBJECTS } from '../../data/civilSubjects';
import { AcademicResource, AcademicResourceType } from '../../types/academic';
import { unlimitedAcademicStorage } from '../../utils/unlimitedAcademicStorage';
import { ownerAuth } from '../../utils/ownerAuth';
import { OwnerAuthModal } from '../common/OwnerAuthModal';
import { Crown, Lock, Unlock } from 'lucide-react';

interface UploadAcademicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newResource: AcademicResource) => void;
  defaultType?: AcademicResourceType;
  defaultSubjectId?: string;
}

export const UploadAcademicModal: React.FC<UploadAcademicModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  defaultType = 'pyq',
  defaultSubjectId = 'som',
}) => {
  const [resourceType, setResourceType] = useState<AcademicResourceType>(defaultType);
  const [subjectId, setSubjectId] = useState<string>(defaultSubjectId);
  const [customSubjectName, setCustomSubjectName] = useState('');
  const [semester, setSemester] = useState('Semester 4');
  const [title, setTitle] = useState('');
  const [academicYear, setAcademicYear] = useState('2024');

  // PYQ specific
  const [examName, setExamName] = useState('SSC JE Civil');
  const [hasSolution, setHasSolution] = useState(true);

  // Practical specific
  const [experimentNumber, setExperimentNumber] = useState('EXP-01');
  const [aim, setAim] = useState('');
  const [apparatusInput, setApparatusInput] = useState('');

  // Assignment specific
  const [dueDate, setDueDate] = useState('');
  const [assignmentStatus, setAssignmentStatus] = useState<'pending' | 'completed'>('completed');

  // General details
  const [description, setDescription] = useState('');
  const [solutionText, setSolutionText] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['Civil Engineering']);
  const [authorName, setAuthorName] = useState(() => (ownerAuth.isOwner() ? 'Er. Deepak Kumar (Founder)' : 'Site Engineer'));
  const [isOwner, setIsOwner] = useState(() => ownerAuth.isOwner());
  const [isOwnerAuthModalOpen, setIsOwnerAuthModalOpen] = useState(false);
  const [lockedTargetAction, setLockedTargetAction] = useState('प्रैक्टिकल व नोट्स अपलोड');

  // Listen for owner status changes
  React.useEffect(() => {
    const handleOwnerChange = (e: any) => {
      const verified = e.detail?.isOwner ?? ownerAuth.isOwner();
      setIsOwner(verified);
      if (verified) {
        setAuthorName('Er. Deepak Kumar (Founder)');
      }
    };
    window.addEventListener('deephelp_owner_changed', handleOwnerChange);
    return () => window.removeEventListener('deephelp_owner_changed', handleOwnerChange);
  }, []);

  const handleSelectResourceType = (type: AcademicResourceType) => {
    if (type !== 'pyq' && !ownerAuth.isOwner()) {
      setLockedTargetAction(
        type === 'practical'
          ? 'प्रैक्टिकल लैब फाइल्स'
          : type === 'assignment'
          ? 'असाइनमेंट शीट्स'
          : 'आधिकारिक स्टडी नोट्स'
      );
      setIsOwnerAuthModalOpen(true);
      return;
    }
    setResourceType(type);
    if (ownerAuth.isOwner()) {
      setAuthorName('Er. Deepak Kumar (Founder)');
    }
  };

  // File upload state (unlimited via IndexedDB)
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    size: number;
    mimeType: string;
    dataUrl: string;
  } | null>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const dataUrl = event.target?.result as string;
        setSelectedFile({
          name: file.name,
          size: file.size,
          mimeType: file.type || 'application/octet-stream',
          dataUrl,
        });
      } catch (err) {
        setUploadError('Failed to read file. Please try again.');
      }
    };

    reader.onerror = () => {
      setUploadError('Failed to read file from local disk.');
    };

    reader.readAsDataURL(file);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setUploadError('कृपया शीर्षक (Title / Exam / Experiment Name) दर्ज करें।');
      return;
    }

    // Owner protection check: Notes and Lab assignments can ONLY be uploaded by Founder!
    const perm = ownerAuth.canUpload(resourceType);
    if (!perm.allowed) {
      setUploadError(perm.reason || 'केवल वेबसाइट ओनर (Er. Deepak Kumar) ही नोट्स व प्रैक्टिकल अपलोड कर सकते हैं।');
      setLockedTargetAction(
        resourceType === 'practical' ? 'प्रैक्टिकल लैब फाइल्स' : resourceType === 'assignment' ? 'असाइनमेंट शीट्स' : 'स्टडी नोट्स'
      );
      setIsOwnerAuthModalOpen(true);
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      // Find subject name
      const matchedSubject = ALL_CIVIL_SUBJECTS.find((s) => s.id === subjectId);
      const finalSubjectName =
        subjectId === 'custom'
          ? customSubjectName.trim() || 'Custom Civil Subject'
          : matchedSubject?.name || 'Civil Engineering';

      // Parse apparatus
      const apparatusList = apparatusInput
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      const resourceId = `acad_${resourceType}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

      const newResource: AcademicResource = {
        id: resourceId,
        type: resourceType,
        title: title.trim(),
        subjectId,
        subjectName: finalSubjectName,
        semester,
        academicYear,
        examName: resourceType === 'pyq' ? examName : undefined,
        hasSolution: resourceType === 'pyq' ? hasSolution : Boolean(solutionText.trim()),
        experimentNumber: resourceType === 'practical' ? experimentNumber : undefined,
        aim: resourceType === 'practical' ? aim.trim() : undefined,
        apparatus: resourceType === 'practical' ? apparatusList : undefined,
        dueDate: resourceType === 'assignment' ? dueDate : undefined,
        status: resourceType === 'assignment' ? assignmentStatus : undefined,
        description: description.trim(),
        solutionText: solutionText.trim(),
        tags,
        authorName: authorName.trim() || 'Site Engineer',
        createdAt: Date.now(),
        fileAttachment: selectedFile
          ? {
              name: selectedFile.name,
              size: selectedFile.size,
              mimeType: selectedFile.mimeType,
              dataUrl: selectedFile.dataUrl,
            }
          : undefined,
      };

      // Save crash-proof to IndexedDB
      await unlimitedAcademicStorage.saveResource(newResource);

      onSuccess(newResource);
      onClose();
    } catch (err: any) {
      console.error('Failed to save academic resource:', err);
      setUploadError(err?.message || 'Error saving file to unlimited storage. Please retry.');
    } finally {
      setIsUploading(false);
    }
  };

  const semestersList = [
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
    'Competitive (GATE / SSC JE)',
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 transition-all">
      <div
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-xs">
              <Upload className="w-5 h-5 stroke-[2.4]" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center space-x-2">
                <span>Upload Academic Resource</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-black bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                  ∞ Unlimited Storage
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                विषयवार PYQs, प्रैक्टिकल फाइल्स एवं असाइनमेंट बिना किसी सीमा के अपलोड करें
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          {uploadError && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-400 text-xs font-semibold flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{uploadError}</span>
            </div>
          )}

          {/* Founder Verification Banner */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25">
            <div className="flex items-center space-x-2 text-xs">
              <Crown className="w-4 h-4 text-amber-500 shrink-0" />
              <span className="text-slate-800 dark:text-slate-200">
                {isOwner ? (
                  <strong className="text-amber-700 dark:text-amber-400">
                    👑 Founder Mode: Er. Deepak Kumar (असीमित अपलोड अधिकार)
                  </strong>
                ) : (
                  <span>
                    <strong>सुरक्षा नियम:</strong> आधिकारिक नोट्स व लैब असाइनमेंट केवल ओनर (Er. Deepak Kumar) ही शेयर कर सकते हैं।
                  </span>
                )}
              </span>
            </div>

            {!isOwner && (
              <button
                type="button"
                onClick={() => {
                  setLockedTargetAction('नोट्स एवं लैब असाइनमेंट अपलोड');
                  setIsOwnerAuthModalOpen(true);
                }}
                className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] font-black shrink-0 transition-colors shadow-2xs"
              >
                फाउंडर अनलॉक करें
              </button>
            )}
          </div>

          {/* 1. Resource Type Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
              1. Resource Type (श्रेणी चुनें) *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                {
                  id: 'pyq' as const,
                  label: 'PYQ Paper',
                  sub: 'ओपन (सभी छात्र)',
                  icon: <Award className="w-4 h-4 text-amber-500" />,
                  isRestricted: false,
                },
                {
                  id: 'practical' as const,
                  label: 'Practical File',
                  sub: isOwner ? 'लैब मैनुअल' : '🔒 Owner Only',
                  icon: <Layers className="w-4 h-4 text-sky-500" />,
                  isRestricted: !isOwner,
                },
                {
                  id: 'assignment' as const,
                  label: 'Assignment',
                  sub: isOwner ? 'ट्यूटोरियल शीट' : '🔒 Owner Only',
                  icon: <FileText className="w-4 h-4 text-emerald-500" />,
                  isRestricted: !isOwner,
                },
                {
                  id: 'notes' as const,
                  label: 'Study Notes',
                  sub: isOwner ? 'ऑफिशियल नोट्स' : '🔒 Owner Only',
                  icon: <BookOpen className="w-4 h-4 text-purple-500" />,
                  isRestricted: !isOwner,
                },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleSelectResourceType(t.id)}
                  className={`p-2.5 rounded-2xl border text-left transition-all ${
                    resourceType === t.id
                      ? 'bg-amber-500/15 border-amber-500 text-slate-900 dark:text-white font-bold ring-2 ring-amber-500/20'
                      : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-1.5">
                      {t.icon}
                      <span className="text-xs font-bold">{t.label}</span>
                    </div>
                    {t.isRestricted && <Lock className="w-3 h-3 text-amber-500 shrink-0" />}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    {t.sub}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Subject Selection & Semester */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Civil Subject (विषय) *
              </label>
              <select
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500"
              >
                {ALL_CIVIL_SUBJECTS.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
                <option value="custom">+ Other / Custom Subject (अन्य विषय)</option>
              </select>
            </div>

            {subjectId === 'custom' ? (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Custom Subject Name *
                </label>
                <input
                  type="text"
                  value={customSubjectName}
                  onChange={(e) => setCustomSubjectName(e.target.value)}
                  placeholder="e.g. Prestressed Concrete / CAD Lab"
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Semester / Class Level *
                </label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                >
                  {semestersList.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* 3. Title & Academic Year */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Document / Resource Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={
                  resourceType === 'pyq'
                    ? 'e.g. SSC JE 2023 RCC & SOM Question Paper'
                    : resourceType === 'practical'
                    ? 'e.g. Compressive Strength Test of Concrete Cubes'
                    : 'e.g. Singly Reinforced Beam Design Assignment #1'
                }
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Exam / Academic Year
              </label>
              <select
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500"
              >
                {['2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018'].map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 4. Type Specific Fields */}
          {resourceType === 'pyq' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/20">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Exam Name / University Board
                </label>
                <input
                  type="text"
                  value={examName}
                  onChange={(e) => setExamName(e.target.value)}
                  placeholder="e.g. SSC JE, GATE, AKTU, RTU, VTU, GTU"
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center space-x-2 pt-5">
                <input
                  type="checkbox"
                  id="hasSolutionCheck"
                  checked={hasSolution}
                  onChange={(e) => setHasSolution(e.target.checked)}
                  className="w-4 h-4 text-amber-500 rounded border-slate-300 focus:ring-amber-500"
                />
                <label
                  htmlFor="hasSolutionCheck"
                  className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  Includes Answer Key / Detailed Solutions (समाधान सहित)
                </label>
              </div>
            </div>
          )}

          {resourceType === 'practical' && (
            <div className="space-y-3 p-3.5 rounded-2xl bg-sky-500/5 border border-sky-500/20">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Experiment Number
                  </label>
                  <input
                    type="text"
                    value={experimentNumber}
                    onChange={(e) => setExperimentNumber(e.target.value)}
                    placeholder="e.g. EXP-01, LAB-03"
                    className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Experiment Aim / Objective
                  </label>
                  <input
                    type="text"
                    value={aim}
                    onChange={(e) => setAim(e.target.value)}
                    placeholder="e.g. To determine consistency of cement using Vicat apparatus"
                    className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Apparatus Required (One per line)
                </label>
                <textarea
                  value={apparatusInput}
                  onChange={(e) => setApparatusInput(e.target.value)}
                  rows={2}
                  placeholder={`Vicat Apparatus with plunger and needles\nWeighing Balance (1g accuracy)\nMeasuring cylinder & Trowel`}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          )}

          {resourceType === 'assignment' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Submission Due Date
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Assignment Status
                </label>
                <select
                  value={assignmentStatus}
                  onChange={(e) => setAssignmentStatus(e.target.value as 'pending' | 'completed')}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                >
                  <option value="completed">Completed / Solved (पूरा हो चुका)</option>
                  <option value="pending">Pending Submission (जमा करना शेष)</option>
                </select>
              </div>
            </div>
          )}

          {/* 5. File Upload Area (PDF, Images, Docs) with Unlimited Crash-Proof Support */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Attach File / PDF / Image (Unlimited Storage)</span>
              <span className="text-[10px] text-slate-500">Supports PDF, PNG, JPG, DOCX, TXT</span>
            </label>

            {selectedFile ? (
              <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center space-x-3 truncate">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                    {selectedFile.mimeType.includes('image') ? (
                      <ImageIcon className="w-5 h-5" />
                    ) : (
                      <FileText className="w-5 h-5" />
                    )}
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {selectedFile.name}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {selectedFile.mimeType}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors"
                  title="Remove file"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="p-6 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-amber-500 dark:hover:border-amber-500/70 bg-slate-50/50 dark:bg-slate-800/40 text-center cursor-pointer transition-colors group"
              >
                <Upload className="w-8 h-8 mx-auto text-slate-400 group-hover:text-amber-500 mb-2 transition-colors" />
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Click to select file or drag and drop here
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                  Question paper PDF, practical report scan, handwritten notes, or diagrams
                </p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx,.txt"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* 6. Solution / Viva / Notes Text */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {resourceType === 'pyq'
                ? 'Answer Key / Numerical Solutions (वैकल्पिक)'
                : resourceType === 'practical'
                ? 'Procedure, Observations & Viva Questions (वैकल्पिक)'
                : 'Solution / Summary Notes (वैकल्पिक)'}
            </label>
            <textarea
              value={solutionText}
              onChange={(e) => setSolutionText(e.target.value)}
              rows={4}
              placeholder={
                resourceType === 'pyq'
                  ? 'Q1: Formula used: qu = c*Nc + q*Nq + 0.5*gamma*B*Ngamma\nAns: 336 kN/m2'
                  : resourceType === 'practical'
                  ? 'Viva Questions:\n1. What is the standard slump for pumpable concrete? 75-100 mm\n2. Which IS code governs slump test? IS 1199'
                  : 'Key formulas and steps used in this assignment...'
              }
              className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 font-mono"
            />
          </div>

          {/* 7. Tags & Author */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Tags / Keywords
              </label>
              <div className="flex items-center space-x-1.5">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="e.g. SSC JE, IS 456, Solved"
                  className="flex-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="p-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-amber-500 text-slate-700 dark:text-slate-200 hover:text-slate-950 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-wrap gap-1 mt-2">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                  >
                    <span>{t}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(t)}
                      className="text-slate-400 hover:text-rose-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Uploaded By / Author Name
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="e.g. Er. Deepak Kumar / Site Student"
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 flex items-center justify-between">
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            🔒 Safe IndexedDB Engine • Zero Quota Limit
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={isUploading}
              onClick={handleSubmit}
              className="inline-flex items-center space-x-2 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-md disabled:opacity-50 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>{isUploading ? 'Uploading...' : 'Save & Upload File'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Owner Authentication Modal */}
      <OwnerAuthModal
        isOpen={isOwnerAuthModalOpen}
        onClose={() => setIsOwnerAuthModalOpen(false)}
        targetActionName={lockedTargetAction}
        onSuccess={() => {
          setIsOwner(true);
          setAuthorName('Er. Deepak Kumar (Founder)');
        }}
      />
    </div>
  );
};
