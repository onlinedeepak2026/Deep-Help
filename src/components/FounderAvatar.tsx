import React, { useState } from 'react';
import { Camera, Check } from 'lucide-react';

interface FounderAvatarProps {
  photoUrl?: string | null;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  showVerifiedBadge?: boolean;
  showCameraBadge?: boolean;
  onCameraClick?: () => void;
  alt?: string;
}

const sizeClasses = {
  xs: 'w-7 h-7 rounded-lg text-[10px]',
  sm: 'w-9 h-9 rounded-xl text-xs',
  md: 'w-12 h-12 rounded-xl text-sm',
  lg: 'w-16 h-16 sm:w-20 sm:h-20 rounded-2xl text-base',
  xl: 'w-24 h-24 sm:w-28 sm:h-28 rounded-3xl text-lg',
  '2xl': 'w-32 h-32 sm:w-36 sm:h-36 rounded-3xl text-xl',
};

const badgeSizeClasses = {
  xs: 'w-3.5 h-3.5 -bottom-0.5 -right-0.5',
  sm: 'w-4 h-4 -bottom-0.5 -right-0.5',
  md: 'w-5 h-5 -bottom-1 -right-1',
  lg: 'w-6 h-6 -bottom-1 -right-1',
  xl: 'w-7 h-7 -bottom-1 -right-1',
  '2xl': 'w-8 h-8 -bottom-1.5 -right-1.5',
};

export const FounderAvatar: React.FC<FounderAvatarProps> = ({
  photoUrl,
  size = 'lg',
  className = '',
  showVerifiedBadge = true,
  showCameraBadge = false,
  onCameraClick,
  alt = 'Er. Deepak Kumar - Founder',
}) => {
  const [imageError, setImageError] = useState(false);

  // If a photoUrl is supplied and has not errored
  const hasValidPhoto = photoUrl && !imageError;

  return (
    <div className={`relative inline-block shrink-0 group ${className}`}>
      <div
        className={`relative overflow-hidden border-2 border-amber-400/60 dark:border-amber-500/40 shadow-md ${sizeClasses[size]} bg-gradient-to-br from-amber-100 via-amber-200 to-amber-300 dark:from-slate-800 dark:via-slate-850 dark:to-slate-900 flex items-center justify-center`}
      >
        {hasValidPhoto ? (
          <img
            src={photoUrl}
            alt={alt}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          /* High-detail vector illustration representation of Er. Deepak Kumar (in white formal shirt) */
          <svg
            viewBox="0 0 120 120"
            className="w-full h-full text-slate-800 dark:text-slate-200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background subtle gradient fill */}
            <rect width="120" height="120" fill="url(#bgGrad)" />
            <defs>
              <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef3c7" />
                <stop offset="100%" stopColor="#fde68a" />
              </linearGradient>
              <linearGradient id="shirtGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#f1f5f9" />
              </linearGradient>
              <linearGradient id="skinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fcd34d" />
                <stop offset="100%" stopColor="#fbbf24" />
              </linearGradient>
            </defs>

            {/* Shoulders & White Collared Shirt */}
            <path
              d="M15 120 C 20 85, 38 78, 60 78 C 82 78, 100 85, 105 120 Z"
              fill="url(#shirtGrad)"
              stroke="#cbd5e1"
              strokeWidth="1.5"
            />
            {/* Shirt Collar Placket */}
            <path
              d="M52 79 L60 98 L68 79 L64 78 L60 84 L56 78 Z"
              fill="#e2e8f0"
              stroke="#94a3b8"
              strokeWidth="1"
            />
            <line x1="60" y1="98" x2="60" y2="120" stroke="#cbd5e1" strokeWidth="1.5" />
            <circle cx="60" cy="106" r="1.5" fill="#64748b" />
            <circle cx="60" cy="114" r="1.5" fill="#64748b" />

            {/* Neck */}
            <path d="M51 68 L51 82 C 55 86, 65 86, 69 82 L69 68 Z" fill="#f59e0b" />

            {/* Face Contour */}
            <path
              d="M38 48 C 38 72, 48 80, 60 80 C 72 80, 82 72, 82 48 C 82 32, 72 25, 60 25 C 48 25, 38 32, 38 48 Z"
              fill="#fbbf24"
            />

            {/* Styled Hair */}
            <path
              d="M34 42 C 34 26, 44 14, 60 14 C 74 14, 86 22, 86 38 C 86 42, 84 48, 83 49 C 81 41, 79 32, 70 30 C 60 28, 48 31, 40 37 C 37 39, 35 44, 34 42 Z"
              fill="#1e293b"
            />
            {/* Hair Left & Right sideburns */}
            <path d="M37 40 L38 52 L42 46 Z" fill="#1e293b" />
            <path d="M83 40 L82 52 L78 46 Z" fill="#1e293b" />

            {/* Eyebrows */}
            <path d="M46 44 Q 52 41 56 44" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
            <path d="M64 44 Q 68 41 74 44" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />

            {/* Eyes */}
            <ellipse cx="51" cy="49" rx="3" ry="2" fill="#0f172a" />
            <circle cx="50" cy="48" r="0.8" fill="#ffffff" />
            <ellipse cx="69" cy="49" rx="3" ry="2" fill="#0f172a" />
            <circle cx="68" cy="48" r="0.8" fill="#ffffff" />

            {/* Nose */}
            <path d="M60 48 L58 58 L62 58" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" />

            {/* Mustache */}
            <path
              d="M51 64 Q 60 62 69 64 Q 60 66 51 64 Z"
              fill="#1e293b"
            />

            {/* Confident Smile */}
            <path
              d="M54 68 Q 60 72 66 68"
              stroke="#78350f"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        )}

        {/* Hover Camera Action Overlay */}
        {showCameraBadge && onCameraClick && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onCameraClick();
            }}
            className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity duration-200 cursor-pointer"
            title="Change Founder Photo (फोटो बदलें)"
          >
            <Camera className="w-5 h-5 text-amber-300 drop-shadow" />
            <span className="text-[9px] font-black uppercase tracking-wider text-amber-200 mt-0.5">
              Edit DP
            </span>
          </button>
        )}
      </div>

      {/* Verified Civil Engineer Badge */}
      {showVerifiedBadge && (
        <span
          className={`absolute rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 flex items-center justify-center text-white shadow-sm ${badgeSizeClasses[size]}`}
          title="Verified Civil Engineer (Er. Deepak Kumar)"
        >
          <Check className="w-2/3 h-2/3 stroke-[3]" />
        </span>
      )}

      {/* Camera button badge on corner for instant click */}
      {showCameraBadge && onCameraClick && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onCameraClick();
          }}
          className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 border-2 border-white dark:border-slate-900 flex items-center justify-center shadow-md transition-transform hover:scale-110 cursor-pointer"
          title="Upload or Change Founder DP (फोटो बदलें)"
        >
          <Camera className="w-3.5 h-3.5 stroke-[2.5]" />
        </button>
      )}
    </div>
  );
};
