import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  ExternalLink,
  MessageCircle,
  Mail,
  Send,
  Sparkles,
} from 'lucide-react';
import { Notice } from '../types';

interface NoticeShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  notice: Notice | null;
  onShareSuccess?: (noticeId: string) => void;
}

export const NoticeShareModal: React.FC<NoticeShareModalProps> = ({
  isOpen,
  onClose,
  notice,
  onShareSuccess,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  if (!isOpen || !notice) return null;

  // Build the shareable URL and text
  const shareUrl =
    notice.link && notice.link.startsWith('http')
      ? notice.link
      : `${window.location.origin}${window.location.pathname}#notice-${notice.id}`;

  const shareText = `📢 [Deep Help Notice] ${notice.title}
By: ${notice.authorName} (${notice.authorRole})

${notice.content.slice(0, 200)}...

👉 Check latest civil notice & engineering calculators: ${shareUrl}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    if (onShareSuccess) onShareSuccess(notice.id);
    setTimeout(() => setCopiedLink(false), 2200);
  };

  const handleCopyFullText = () => {
    navigator.clipboard.writeText(shareText);
    setCopiedText(true);
    if (onShareSuccess) onShareSuccess(notice.id);
    setTimeout(() => setCopiedText(false), 2200);
  };

  const handleWhatsAppShare = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    if (onShareSuccess) onShareSuccess(notice.id);
  };

  const handleFacebookShare = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(fbUrl, '_blank', 'noopener,noreferrer');
    if (onShareSuccess) onShareSuccess(notice.id);
  };

  const handleTelegramShare = () => {
    const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(notice.title)}`;
    window.open(tgUrl, '_blank', 'noopener,noreferrer');
    if (onShareSuccess) onShareSuccess(notice.id);
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(`Civil Engineering Notice: ${notice.title}`);
    const body = encodeURIComponent(shareText);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    if (onShareSuccess) onShareSuccess(notice.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8 animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-slate-950 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-slate-950/20 backdrop-blur-sm text-white flex items-center justify-center">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Share Notice & Announcement</h3>
              <p className="text-xs text-amber-100 font-medium">
                Deep Help - Civil Engineering Hub
              </p>
            </div>
          </div>

          <button
            id="close-notice-share-modal"
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-950/20 hover:bg-slate-950/40 text-white transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Notice Preview Card */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                {notice.category}
              </span>
              {notice.isFounderNotice && (
                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 flex items-center space-x-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Founder Notice</span>
                </span>
              )}
            </div>
            <h4 className="text-sm font-black text-slate-900 dark:text-white line-clamp-2">
              {notice.title}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
              {notice.content}
            </p>
          </div>

          {/* Quick Share Platforms */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2.5">
              Share With Fellow Engineers On
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* WhatsApp */}
              <button
                id="share-notice-whatsapp-btn"
                type="button"
                onClick={handleWhatsAppShare}
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 transition-all text-xs font-bold gap-1.5 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <span>WhatsApp</span>
              </button>

              {/* Facebook */}
              <button
                id="share-notice-facebook-btn"
                type="button"
                onClick={handleFacebookShare}
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/25 transition-all text-xs font-bold gap-1.5 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-[#1877F2] text-white flex items-center justify-center shadow-xs">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </div>
                <span>Facebook</span>
              </button>

              {/* Telegram */}
              <button
                id="share-notice-telegram-btn"
                type="button"
                onClick={handleTelegramShare}
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-600 dark:text-sky-400 border border-sky-500/25 transition-all text-xs font-bold gap-1.5 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-[#229ED9] text-white flex items-center justify-center shadow-xs">
                  <Send className="w-4 h-4" />
                </div>
                <span>Telegram</span>
              </button>

              {/* Email */}
              <button
                id="share-notice-email-btn"
                type="button"
                onClick={handleEmailShare}
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-500/10 hover:bg-slate-500/20 text-slate-700 dark:text-slate-300 border border-slate-400/25 transition-all text-xs font-bold gap-1.5 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-slate-700 dark:bg-slate-600 text-white flex items-center justify-center shadow-xs">
                  <Mail className="w-4 h-4" />
                </div>
                <span>Email</span>
              </button>
            </div>
          </div>

          {/* Copy Direct Link */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Direct Notice Link
            </label>
            <div className="flex items-center space-x-2">
              <input
                id="notice-share-link-input"
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 px-3.5 py-2.5 rounded-xl text-xs font-mono bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 focus:outline-hidden select-all"
              />
              <button
                id="copy-notice-link-btn"
                type="button"
                onClick={handleCopyLink}
                className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer shadow-xs ${
                  copiedLink
                    ? 'bg-emerald-500 text-white'
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                }`}
              >
                {copiedLink ? <Check className="w-4 h-4 stroke-[2.5]" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>
          </div>

          {/* Copy Full Announcement Message */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Want to forward full text with link?
            </span>
            <button
              id="copy-notice-full-text-btn"
              type="button"
              onClick={handleCopyFullText}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
            >
              {copiedText ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">Copied Full Post!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-amber-500" />
                  <span>Copy Full Message</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
