import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  Camera,
  CheckCircle2,
  Trash2,
  Image as ImageIcon,
  RotateCcw,
  Sparkles,
  Info,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface UploadFounderPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPhoto: string | null;
  onSavePhoto: (photoDataUrl: string | null) => void;
  onRemovePhoto?: () => void;
}

export const UploadFounderPhotoModal: React.FC<UploadFounderPhotoModalProps> = ({
  isOpen,
  onClose,
  currentPhoto,
  onSavePhoto,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentPhoto);
  const [fileName, setFileName] = useState<string>('');
  const [objectFit, setObjectFit] = useState<'cover' | 'contain'>('cover');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync preview when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setPreviewUrl(currentPhoto);
      setFileName('');
      setZoomLevel(1);
    }
  }, [isOpen, currentPhoto]);

  if (!isOpen) return null;

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('कृपया केवल इमेज फ़ाइल (JPG, PNG, WEBP) चुनें!');
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        // Optimize and compress image onto an offscreen canvas to avoid huge memory/localStorage usage
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 800; // Optimal profile quality
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
            setPreviewUrl(compressedDataUrl);
          } else {
            setPreviewUrl(result);
          }
        };
        img.src = result;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleSave = () => {
    onSavePhoto(previewUrl);
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
    });
    onClose();
  };

  const handleRemovePhoto = () => {
    setPreviewUrl(null);
    setFileName('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-slate-950/15 rounded-xl">
              <Camera className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h3 className="text-base font-black leading-tight">
                Founder Profile Photo (DP)
              </h3>
              <p className="text-[11px] font-bold text-slate-950/80">
                संस्थापक Er. Deepak Kumar की फोटो सेट करें
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-950/20 hover:bg-slate-950/40 text-slate-950 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Info Banner for User */}
          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 flex items-start space-x-3 text-xs text-amber-900 dark:text-amber-200">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1 leading-relaxed">
              <p className="font-bold">
                आपने चैट में अपनी तस्वीर <span className="underline font-mono">FB_IMG_1782824617971.jpg</span> शेयर की है।
              </p>
              <p className="text-[11px] opacity-90">
                नीचे दिए गए बटन से अपने फ़ोन की गैलरी या फ़ाइल्स से वह तस्वीर चुनें। वह तुरंत आपकी प्रोफ़ाइल DP पर लग जाएगी!
              </p>
            </div>
          </div>

          {/* Interactive Preview & Adjustment */}
          <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
            <div className="relative w-36 h-36 rounded-3xl overflow-hidden border-4 border-amber-400 shadow-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Founder DP Preview"
                  className={`w-full h-full object-top transition-transform duration-150 ${
                    objectFit === 'cover' ? 'object-cover' : 'object-contain'
                  }`}
                  style={{ transform: `scale(${zoomLevel})` }}
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="text-center p-3 text-slate-400">
                  <ImageIcon className="w-10 h-10 mx-auto mb-1 opacity-50" />
                  <span className="text-[11px] font-semibold">कोई फोटो नहीं चुनी</span>
                </div>
              )}
            </div>

            {fileName && (
              <span className="mt-2 text-[11px] font-bold text-slate-600 dark:text-slate-400 truncate max-w-[260px]">
                {fileName}
              </span>
            )}

            {/* Adjustments (Fit & Zoom) */}
            {previewUrl && (
              <div className="mt-3 flex items-center space-x-3 text-xs">
                <button
                  type="button"
                  onClick={() => setObjectFit(objectFit === 'cover' ? 'contain' : 'cover')}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-semibold hover:bg-slate-100 transition-colors text-[11px]"
                >
                  Fit: {objectFit === 'cover' ? 'Cover (भरें)' : 'Contain (पूरा)'}
                </button>

                <div className="flex items-center space-x-1.5 text-slate-600 dark:text-slate-300">
                  <span className="text-[11px] font-semibold">Zoom:</span>
                  <input
                    type="range"
                    min="1"
                    max="1.8"
                    step="0.05"
                    value={zoomLevel}
                    onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
                    className="w-20 accent-amber-500 cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Upload Drop Zone / Picker */}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-amber-300 dark:border-amber-700/60 hover:border-amber-500 rounded-2xl p-6 text-center cursor-pointer bg-amber-50/40 dark:bg-slate-850 hover:bg-amber-50/70 transition-all group"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6 stroke-[2.2]" />
              </div>
              <p className="text-sm font-black text-slate-800 dark:text-slate-200">
                फ़ोटो चुनें (Select from Gallery / Device)
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                यहाँ क्लिक करें या फ़ाइल ड्रैग करें (JPG, PNG, WEBP)
              </p>
              <p className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 mt-2">
                📁 FB_IMG_1782824617971.jpg
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
            {previewUrl ? (
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-bold transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Remove (हटाएं)</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={!previewUrl}
                className="flex items-center space-x-2 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-colors shadow-md shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                <span>Save DP (फोटो लगाएं)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
