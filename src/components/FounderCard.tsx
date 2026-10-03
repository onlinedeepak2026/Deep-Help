import React, { useState } from 'react';
import {
  HardHat,
  GraduationCap,
  Mail,
  ExternalLink,
  Copy,
  Check,
  Award,
  Sparkles,
  Compass,
  Bell,
  Share2,
  Camera,
} from 'lucide-react';
import { FounderAvatar } from './FounderAvatar';

interface FounderCardProps {
  onOpenNotices?: () => void;
  onOpenPostNoticeModal?: () => void;
  founderPhoto?: string | null;
  onOpenPhotoModal?: () => void;
}

export const FounderCard: React.FC<FounderCardProps> = ({
  onOpenNotices,
  onOpenPostNoticeModal,
  founderPhoto,
  onOpenPhotoModal,
}) => {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const email = 'deepak2OO61122@gmail.com';
  const facebookUrl = 'https://www.facebook.com/share/1BwLC95KKg/';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md transition-all">
      {/* Accent top banner */}
      <div className="h-3 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600" />

      <div className="p-6 sm:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-4">
            <FounderAvatar
              photoUrl={founderPhoto}
              size="lg"
              showVerifiedBadge={true}
              showCameraBadge={true}
              onCameraClick={onOpenPhotoModal}
            />

            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                  Founder Profile
                </span>
                <span className="text-xs text-slate-400 flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Deep Help Lead</span>
                </span>
              </div>

              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                Er. Deepak Kumar
              </h3>

              <p className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center space-x-1.5 mt-0.5">
                <GraduationCap className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Diploma From GP Bhagalpur & B.Tech From Saharsa College of Engineering in Civil</span>
              </p>
            </div>
          </div>

          {/* Quick Connect CTA buttons */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <a
              id="founder-email-cta-btn"
              href={`mailto:${email}`}
              className="flex-1 md:flex-none flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 text-xs font-bold transition-colors shadow-sm"
            >
              <Mail className="w-4 h-4 text-amber-400 dark:text-amber-600" />
              <span>Contact via Email</span>
            </a>

            <a
              id="founder-facebook-cta-btn"
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 md:flex-none flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs font-bold transition-colors shadow-sm"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>Facebook Profile</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>

            {/* Founder Post & Share Notice action */}
            {onOpenPostNoticeModal && (
              <button
                id="founder-post-notice-cta-btn"
                type="button"
                onClick={onOpenPostNoticeModal}
                className="flex-1 md:flex-none flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors shadow-sm cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Share Notice & Link</span>
              </button>
            )}

            {onOpenPhotoModal && (
              <button
                id="founder-change-dp-cta-btn"
                type="button"
                onClick={onOpenPhotoModal}
                className="flex-1 md:flex-none flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-bold transition-colors border border-amber-500/30 cursor-pointer"
                title="Upload or Change Founder Profile Photo (FB_IMG_1782824617971.jpg)"
              >
                <Camera className="w-4 h-4 text-amber-500" />
                <span>Set / Change DP</span>
              </button>
            )}

            {onOpenNotices && (
              <button
                id="founder-view-notices-cta-btn"
                type="button"
                onClick={onOpenNotices}
                className="flex-1 md:flex-none flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors border border-slate-300 dark:border-slate-700 cursor-pointer"
              >
                <Bell className="w-4 h-4 text-amber-500" />
                <span>Notice Board</span>
              </button>
            )}
          </div>
        </div>

        {/* Bio & Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6">
          <div className="lg:col-span-7 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Vision & Technical Background
            </h4>
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              <strong>Deep Help - Civil Engineering Hub</strong> was created by <strong>Er. Deepak Kumar (Diploma From GP Bhagalpur & B.Tech From Saharsa College of Engineering in Civil)</strong> to provide an all-in-one, calculation toolkit conforming to standard specifications (IS 456:2000, IS 10262:2019, IS 1077, IS 1172).
            </p>
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              Engineered specifically to streamline on-site estimation, concrete mix batching, brickwork calculations, leveling surveys, and structural checks without tedious manual lookups.
            </p>
          </div>

          <div className="lg:col-span-5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Contact & Social Channels
            </h4>

            {/* Email card */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
              <div className="flex items-center space-x-2.5 overflow-hidden">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <div className="truncate">
                  <span className="text-[10px] text-slate-400 block font-medium">Email Address</span>
                  <a
                    href={`mailto:${email}`}
                    className="text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-amber-500 font-mono-calc truncate block"
                  >
                    {email}
                  </a>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="p-1.5 rounded-lg bg-white dark:bg-slate-700 text-slate-500 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white border border-slate-200 dark:border-slate-600 shrink-0"
                title="Copy Email"
              >
                {copiedEmail ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {/* Facebook Card */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
              <div className="flex items-center space-x-2.5 overflow-hidden">
                <svg className="w-4 h-4 text-[#1877F2] fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <div className="truncate">
                  <span className="text-[10px] text-slate-400 block font-medium">Facebook</span>
                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-[#1877F2] truncate block"
                  >
                    Deepak Kumar Profile
                  </a>
                </div>
              </div>
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg bg-white dark:bg-slate-700 text-slate-500 hover:text-[#1877F2] dark:text-slate-300 border border-slate-200 dark:border-slate-600 shrink-0"
                title="Open Facebook Profile"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
