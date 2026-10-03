import React, { useState } from 'react';
import {
  X,
  HardHat,
  GraduationCap,
  Mail,
  ExternalLink,
  Copy,
  Check,
  Award,
  BookCheck,
  Compass,
  Camera,
} from 'lucide-react';
import { FounderAvatar } from './FounderAvatar';

interface AboutFounderModalProps {
  isOpen: boolean;
  onClose: () => void;
  founderPhoto?: string | null;
  onOpenPhotoModal?: () => void;
}

export const AboutFounderModal: React.FC<AboutFounderModalProps> = ({
  isOpen,
  onClose,
  founderPhoto,
  onOpenPhotoModal,
}) => {
  const [copiedEmail, setCopiedEmail] = useState(false);

  if (!isOpen) return null;

  const email = 'deepak2OO61122@gmail.com';
  const facebookUrl = 'https://www.facebook.com/share/1BwLC95KKg/';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8 animate-in fade-in zoom-in duration-200">
        {/* Top Header Background Banner */}
        <div className="relative h-32 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 p-6 flex items-start justify-between text-slate-950">
          <div className="flex items-center space-x-2 bg-slate-950/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold">
            <Compass className="w-3.5 h-3.5" />
            <span>Deep Help - Civil Engineering Hub</span>
          </div>

          <button
            id="close-about-founder-modal"
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-950/20 hover:bg-slate-950/40 text-white transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Avatar & Core Details */}
        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 mb-4">
            <div className="flex items-end space-x-4">
              <FounderAvatar
                photoUrl={founderPhoto}
                size="xl"
                showVerifiedBadge={true}
                showCameraBadge={true}
                onCameraClick={onOpenPhotoModal}
                className="border-4 border-white dark:border-slate-900 rounded-3xl shadow-xl"
              />
              <div className="pb-1">
                <div className="flex items-center space-x-2">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    Er. Deepak Kumar
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400 text-[10px] font-extrabold uppercase tracking-wider border border-amber-500/20">
                    Founder
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center space-x-1.5 mt-0.5">
                  <GraduationCap className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Diploma From GP Bhagalpur & B.Tech From Saharsa College of Engineering in Civil</span>
                </p>
              </div>
            </div>

            {onOpenPhotoModal && (
              <button
                id="modal-change-dp-btn"
                type="button"
                onClick={onOpenPhotoModal}
                className="self-start sm:self-end flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 dark:text-amber-300 text-xs font-bold border border-amber-500/30 transition-colors cursor-pointer"
                title="Upload or Change Founder Profile Photo (FB_IMG_1782824617971.jpg)"
              >
                <Camera className="w-3.5 h-3.5 text-amber-500" />
                <span>Set DP / फोटो लगाएं</span>
              </button>
            )}
          </div>

          {/* Bio & Vision */}
          <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/70 space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center space-x-1.5 text-xs">
                <Award className="w-4 h-4 text-amber-500" />
                <span>About the Founder</span>
              </h4>
              <p className="leading-relaxed">
                Welcome to <strong>Deep Help - Civil Engineering Hub</strong>! As a civil engineer with <strong>Diploma from GP Bhagalpur & B.Tech from Saharsa College of Engineering in Civil</strong>, I established this platform to bridge the gap between complex Indian Standard (IS) codes and practical on-site construction needs.
              </p>
              <p className="leading-relaxed">
                Whether you are calculating concrete proportions according to IS 456 / IS 10262, verifying leveling survey records, estimating building costs, or preparing for site engineering assessments, Deep Help is built to deliver fast, reliable, and standardized results.
              </p>
            </div>

            {/* Direct Contact & Social Links Card */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Contact & Connect
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Email Block */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col justify-between space-y-2">
                  <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400">
                    <Mail className="w-4 h-4 text-amber-500" />
                    <span className="text-[11px] font-bold">Email Us</span>
                  </div>
                  <a
                    href={`mailto:${email}`}
                    className="text-xs font-bold text-slate-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 break-all font-mono-calc"
                  >
                    {email}
                  </a>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="flex items-center justify-center space-x-1 py-1 px-2 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-[11px] font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                  >
                    {copiedEmail ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Email Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                        <span>Copy Email Address</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Facebook Profile Block */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col justify-between space-y-2">
                  <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400">
                    <svg className="w-4 h-4 text-[#1877F2] fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <span className="text-[11px] font-bold">Facebook Profile</span>
                  </div>
                  <span className="text-xs text-slate-600 dark:text-slate-300">
                    Connect on Facebook for civil engineering updates & support.
                  </span>
                  <a
                    id="founder-facebook-link-modal"
                    href={facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-1.5 py-1.5 px-3 rounded-lg bg-[#1877F2] hover:bg-[#166fe5] text-white text-[11px] font-bold shadow-xs transition-colors"
                  >
                    <span>Visit Facebook Profile</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Core Values / Platform Standards */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center space-x-1">
                <BookCheck className="w-3.5 h-3.5 text-amber-500" />
                <span>IS 456, IS 10262, IS 1077, IS 1172</span>
              </span>
              <span>Deep Help © {new Date().getFullYear()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
