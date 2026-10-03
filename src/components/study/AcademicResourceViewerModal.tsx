import React, { useState } from 'react';
import {
  X,
  Download,
  Printer,
  Share2,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  Layers,
  Award,
  Calendar,
  User,
  Trash2,
  ExternalLink,
  BookOpen,
  ZoomIn,
  ZoomOut,
  RotateCw,
} from 'lucide-react';
import { AcademicResource } from '../../types/academic';

interface AcademicResourceViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  resource: AcademicResource | null;
  onDelete?: (id: string) => void;
}

export const AcademicResourceViewerModal: React.FC<AcademicResourceViewerModalProps> = ({
  isOpen,
  onClose,
  resource,
  onDelete,
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen || !resource) return null;

  const handleDownloadFile = () => {
    if (!resource.fileAttachment?.dataUrl) {
      // If no file attachment, generate a clean text file of the notes/solution
      const content = `${resource.title}\nSubject: ${resource.subjectName}\nType: ${resource.type.toUpperCase()}\nSemester: ${resource.semester}\nAuthor: ${resource.authorName || 'Site Engineer'}\n\nDescription:\n${resource.description || ''}\n\nSolutions / Procedures / Notes:\n${resource.solutionText || ''}`;
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${resource.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      return;
    }

    const a = document.createElement('a');
    a.href = resource.fileAttachment.dataUrl;
    a.download = resource.fileAttachment.name || `${resource.title}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: resource.title,
          text: `Check out this Civil Engineering ${resource.type.toUpperCase()} on Deep Help Hub: ${resource.title}`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(
        `${resource.title} - Civil Engineering ${resource.subjectName} (${window.location.href})`
      );
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const isImage = resource.fileAttachment?.mimeType?.startsWith('image/');
  const isPdf = resource.fileAttachment?.mimeType === 'application/pdf';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 transition-all">
      <div
        className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3 min-w-0">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 font-black ${
                resource.type === 'pyq'
                  ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                  : resource.type === 'practical'
                  ? 'bg-sky-500/20 text-sky-600 dark:text-sky-400'
                  : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
              }`}
            >
              {resource.type === 'pyq' && <Award className="w-5 h-5 stroke-[2.3]" />}
              {resource.type === 'practical' && <Layers className="w-5 h-5 stroke-[2.3]" />}
              {resource.type === 'assignment' && <FileText className="w-5 h-5 stroke-[2.3]" />}
              {resource.type === 'notes' && <BookOpen className="w-5 h-5 stroke-[2.3]" />}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-700 dark:text-amber-400">
                  {resource.type === 'pyq'
                    ? 'PYQ Paper'
                    : resource.type === 'practical'
                    ? 'Practical File'
                    : resource.type === 'assignment'
                    ? 'Assignment'
                    : 'Notes'}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {resource.subjectName}
                </span>
                <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                  {resource.semester} {resource.academicYear ? `• ${resource.academicYear}` : ''}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white truncate">
                {resource.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 shrink-0">
            <button
              type="button"
              onClick={handleDownloadFile}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Download File"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Print"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {onDelete && !resource.isPreloaded && (
              <button
                type="button"
                onClick={() => onDelete(resource.id)}
                className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors"
                title="Delete this upload"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {copiedLink && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold text-center">
              ✓ Resource link copied to clipboard!
            </div>
          )}

          {/* Practical Specific Aim & Apparatus */}
          {resource.type === 'practical' && (
            <div className="space-y-4 p-4 rounded-2xl bg-sky-500/5 border border-sky-500/20">
              {resource.experimentNumber && (
                <div className="inline-block px-2.5 py-1 rounded-lg bg-sky-500/20 text-sky-700 dark:text-sky-300 text-xs font-black">
                  {resource.experimentNumber}
                </div>
              )}

              {resource.aim && (
                <div>
                  <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wide mb-1">
                    🎯 Aim / Objective:
                  </h4>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 leading-relaxed">
                    {resource.aim}
                  </p>
                </div>
              )}

              {resource.apparatus && resource.apparatus.length > 0 && (
                <div>
                  <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wide mb-2">
                    🛠️ Apparatus & Tools Required:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {resource.apparatus.map((item, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                      >
                        • {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Description */}
          {resource.description && (
            <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <h4 className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Overview & Guidelines:
              </h4>
              <p className="whitespace-pre-line">{resource.description}</p>
            </div>
          )}

          {/* File Attachment Viewer (PDF or Image) */}
          {resource.fileAttachment && resource.fileAttachment.dataUrl && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center space-x-2">
                  <span>Attached File ({resource.fileAttachment.name})</span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    ({(resource.fileAttachment.size / (1024 * 1024)).toFixed(2)} MB)
                  </span>
                </h4>

                {isImage && (
                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={() => setZoomLevel((z) => Math.min(z + 0.25, 3))}
                      className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                      title="Zoom In"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setZoomLevel((z) => Math.max(z - 0.25, 0.5))}
                      className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setRotation((r) => (r + 90) % 360)}
                      className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                      title="Rotate"
                    >
                      <RotateCw className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {isImage ? (
                <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 overflow-auto max-h-[60vh] flex items-center justify-center">
                  <img
                    src={resource.fileAttachment.dataUrl}
                    alt={resource.title}
                    style={{
                      transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                      transition: 'transform 0.2s ease',
                    }}
                    className="max-w-full rounded-xl object-contain shadow-md"
                  />
                </div>
              ) : isPdf ? (
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden h-[60vh] bg-slate-100 dark:bg-slate-950">
                  <object
                    data={resource.fileAttachment.dataUrl}
                    type="application/pdf"
                    className="w-full h-full"
                  >
                    <div className="p-8 text-center space-y-3">
                      <FileText className="w-12 h-12 mx-auto text-amber-500" />
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                        PDF preview not supported by your browser directly.
                      </p>
                      <button
                        type="button"
                        onClick={handleDownloadFile}
                        className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-md"
                      >
                        Download PDF to View
                      </button>
                    </div>
                  </object>
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-slate-100 dark:bg-slate-800 text-center space-y-2 border border-slate-200 dark:border-slate-700">
                  <FileText className="w-10 h-10 mx-auto text-amber-500" />
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {resource.fileAttachment.name}
                  </p>
                  <button
                    type="button"
                    onClick={handleDownloadFile}
                    className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-md"
                  >
                    Download File
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Solutions / Procedures / Answer Key / Viva Q&A */}
          {resource.solutionText && (
            <div className="space-y-2 p-4 sm:p-5 rounded-2xl bg-amber-500/5 dark:bg-slate-800/60 border border-amber-500/20">
              <h4 className="text-xs font-black text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {resource.type === 'pyq'
                    ? 'Detailed Answer Key & Solved Steps'
                    : resource.type === 'practical'
                    ? 'Observations, Formulas & Viva Voce Q&A'
                    : 'Complete Solution & Tutorial Steps'}
                </span>
              </h4>

              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line overflow-x-auto">
                {resource.solutionText}
              </div>
            </div>
          )}

          {/* Tags & Metadata Footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex flex-wrap gap-1.5">
              {resource.tags.map((t, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                >
                  #{t}
                </span>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>By: {resource.authorName || 'Site Engineer'}</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{new Date(resource.createdAt).toLocaleDateString()}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 flex items-center justify-between">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Deep Help Academic Portal • Verified Civil Content
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleDownloadFile}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-md cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Resource</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
