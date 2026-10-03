import React, { useState, useEffect } from 'react';
import {
  X,
  Camera,
  Upload,
  FileText,
  Trash2,
  Image as ImageIcon,
  User,
  Plus,
  Maximize2,
  Sparkles,
  Share2,
  Check,
} from 'lucide-react';
import { ItemAttachmentData, AttachedNote, AttachedPhoto } from '../../types/attachments';
import {
  getItemAttachments,
  addNoteToItem,
  addPhotoToItem,
  deleteNoteFromItem,
  deletePhotoFromItem,
  compressImageFile,
} from '../../utils/attachmentStorage';

interface ItemPhotoNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetId: string;
  targetType: ItemAttachmentData['targetType'];
  targetTitle: string;
  onShare?: () => void;
  onDataUpdated?: () => void;
}

export const ItemPhotoNoteModal: React.FC<ItemPhotoNoteModalProps> = ({
  isOpen,
  onClose,
  targetId,
  targetType,
  targetTitle,
  onShare,
  onDataUpdated,
}) => {
  const [data, setData] = useState<ItemAttachmentData>({
    targetId,
    targetType,
    targetTitle,
    notes: [],
    photos: [],
  });

  const [activeTab, setActiveTab] = useState<'photos' | 'notes'>('photos');
  const [noteText, setNoteText] = useState('');
  const [noteAuthor, setNoteAuthor] = useState('');
  const [photoCaption, setPhotoCaption] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [selectedPhotoForZoom, setSelectedPhotoForZoom] = useState<AttachedPhoto | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  useEffect(() => {
    if (isOpen && targetId) {
      const current = getItemAttachments(targetId);
      setData(current);
    }
  }, [isOpen, targetId]);

  if (!isOpen) return null;

  const showFeedback = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(''), 3000);
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    setIsUploading(true);
    try {
      const compressedUrl = await compressImageFile(file, 1200, 0.82);
      const updated = addPhotoToItem(
        targetId,
        targetType,
        targetTitle,
        compressedUrl,
        file.name,
        photoCaption || undefined
      );
      setData(updated);
      setPhotoCaption('');
      showFeedback('Photo attached successfully! (असीमित फोटो शेयरिंग सक्रिय)');
      if (onDataUpdated) onDataUpdated();
    } catch (err) {
      console.error(err);
      showFeedback('Error uploading image. Please try another format.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;

    const updated = addNoteToItem(
      targetId,
      targetType,
      targetTitle,
      noteText.trim(),
      noteAuthor.trim() || 'Site Engineer'
    );
    setData(updated);
    setNoteText('');
    showFeedback('Note added successfully! (असीमित नोट्स सेव हो गया)');
    if (onDataUpdated) onDataUpdated();
  };

  const handleDeleteNote = (noteId: string) => {
    const updated = deleteNoteFromItem(targetId, noteId);
    setData(updated);
    if (onDataUpdated) onDataUpdated();
  };

  const handleDeletePhoto = (photoId: string) => {
    const updated = deletePhotoFromItem(targetId, photoId);
    setData(updated);
    if (onDataUpdated) onDataUpdated();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div
        id="item-photo-note-modal-box"
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6 transition-all"
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="space-y-1 pr-6">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500 text-slate-950">
                {targetType === 'formula' ? 'Formula Attachments' : targetType === 'isCode' ? 'IS Code Field Data' : 'Attachments'}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                ∞ Unlimited Notes & Photos
              </span>
            </div>
            <h3 className="text-base font-black text-slate-900 dark:text-white leading-tight">
              {targetTitle}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              साइट फोटो, ड्राइंग स्नैपशॉट एवं व्यक्तिगत नोट्स जोड़ें और शेयर करें।
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {onShare && (
              <button
                type="button"
                id="modal-share-quick-btn"
                onClick={onShare}
                className="p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30 text-xs font-bold flex items-center space-x-1.5 cursor-pointer transition-colors"
                title="Share this item"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Share</span>
              </button>
            )}
            <button
              type="button"
              id="close-photo-note-modal-btn"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedbackMsg && (
          <div className="mx-6 mt-4 p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center space-x-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 pt-3 space-x-4">
          <button
            type="button"
            onClick={() => setActiveTab('photos')}
            className={`pb-3 text-xs font-black transition-all flex items-center space-x-2 border-b-2 cursor-pointer ${
              activeTab === 'photos'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Attached Photos ({data.photos.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('notes')}
            className={`pb-3 text-xs font-black transition-all flex items-center space-x-2 border-b-2 cursor-pointer ${
              activeTab === 'notes'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Personal Notes ({data.notes.length})</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
          {/* TAB 1: PHOTOS */}
          {activeTab === 'photos' && (
            <div className="space-y-5">
              {/* Upload Dropzone */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="p-5 border-2 border-dashed border-amber-500/30 dark:border-amber-500/20 bg-amber-500/5 rounded-2xl text-center hover:border-amber-500/60 transition-colors space-y-3"
              >
                <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <label
                    htmlFor="photo-file-input"
                    className="cursor-pointer text-xs font-black text-amber-700 dark:text-amber-400 hover:underline"
                  >
                    Click to browse photo
                  </label>
                  <span className="text-xs text-slate-500 dark:text-slate-400"> or drag and drop image here</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Supports JPG, PNG, WEBP — Site photos, textbook diagrams, calculation snapshots.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 max-w-md mx-auto">
                  <input
                    type="text"
                    placeholder="Optional photo caption (e.g., Site crack observation)"
                    value={photoCaption}
                    onChange={(e) => setPhotoCaption(e.target.value)}
                    className="w-full text-xs px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium"
                  />
                  <input
                    id="photo-file-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileUpload(e.target.files[0]);
                      }
                    }}
                  />
                </div>

                {isUploading && (
                  <div className="text-xs font-bold text-amber-600 animate-pulse">
                    Compressing and attaching photo...
                  </div>
                )}
              </div>

              {/* Photos Gallery */}
              {data.photos.length === 0 ? (
                <div className="text-center py-8 text-slate-400 space-y-2">
                  <ImageIcon className="w-10 h-10 mx-auto stroke-[1.5]" />
                  <p className="text-xs">No photos attached yet. You can upload unlimited photos!</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {data.photos.map((photo) => (
                    <div
                      key={photo.id}
                      className="group relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shadow-2xs"
                    >
                      <img
                        src={photo.url}
                        alt={photo.caption || photo.name}
                        className="w-full h-32 object-cover transition-transform group-hover:scale-105"
                      />
                      {photo.caption && (
                        <div className="p-2 text-[10px] font-bold text-slate-700 dark:text-slate-200 truncate bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                          {photo.caption}
                        </div>
                      )}
                      {/* Action buttons overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2 p-2">
                        <button
                          type="button"
                          onClick={() => setSelectedPhotoForZoom(photo)}
                          className="p-1.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 shadow-sm"
                          title="Enlarge Photo"
                        >
                          <Maximize2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeletePhoto(photo.id)}
                          className="p-1.5 rounded-xl bg-red-600 text-white hover:bg-red-700 shadow-sm"
                          title="Delete Photo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PERSONAL NOTES */}
          {activeTab === 'notes' && (
            <div className="space-y-5">
              {/* Add Note Form */}
              <form onSubmit={handleAddNote} className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <label className="block text-xs font-black text-slate-700 dark:text-slate-200">
                  Add Personal Engineering Note / Field Hint:
                </label>
                <textarea
                  rows={3}
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Type important formula derivation, site observation, exam memory trick, or codal exception..."
                  className="w-full p-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  required
                />
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                  <div className="relative w-full sm:w-60">
                    <User className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Your Name / Role (Optional)"
                      value={noteAuthor}
                      onChange={(e) => setNoteAuthor(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-black bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors flex items-center justify-center space-x-1.5 cursor-pointer shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Save Note (Unlimited)</span>
                  </button>
                </div>
              </form>

              {/* Notes List */}
              {data.notes.length === 0 ? (
                <div className="text-center py-8 text-slate-400 space-y-2">
                  <FileText className="w-10 h-10 mx-auto stroke-[1.5]" />
                  <p className="text-xs">No personal notes added yet. Add unlimited notes anytime!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {data.notes.map((note) => (
                    <div
                      key={note.id}
                      className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs flex items-start justify-between gap-3"
                    >
                      <div className="space-y-1.5">
                        <p className="text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                          {note.text}
                        </p>
                        <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-medium">
                          <span className="font-bold text-amber-600 dark:text-amber-400">
                            {note.author || 'Site Engineer'}
                          </span>
                          <span>•</span>
                          <span>{new Date(note.addedAt).toLocaleDateString('hi-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteNote(note.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 shrink-0 transition-colors"
                        title="Delete Note"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Saved permanently to your device (Local Storage)</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-black bg-slate-900 text-white dark:bg-white dark:text-slate-950 hover:opacity-90 transition-opacity cursor-pointer"
          >
            Done / पूर्ण
          </button>
        </div>
      </div>

      {/* Lightbox Zoom for Photo */}
      {selectedPhotoForZoom && (
        <div className="fixed inset-0 z-60 bg-black/90 flex flex-col items-center justify-center p-4">
          <button
            type="button"
            onClick={() => setSelectedPhotoForZoom(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={selectedPhotoForZoom.url}
            alt={selectedPhotoForZoom.caption || 'Zoomed Photo'}
            className="max-w-full max-h-[80vh] rounded-2xl object-contain shadow-2xl"
          />
          {selectedPhotoForZoom.caption && (
            <div className="mt-4 px-4 py-2 rounded-xl bg-white/15 text-white text-xs font-bold backdrop-blur-md">
              {selectedPhotoForZoom.caption}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
