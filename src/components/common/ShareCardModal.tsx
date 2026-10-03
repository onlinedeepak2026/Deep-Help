import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  Download,
  ExternalLink,
  MessageCircle,
  Send,
  Sparkles,
} from 'lucide-react';
import { getItemAttachments } from '../../utils/attachmentStorage';

interface ShareCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  category?: string;
  subtitle?: string;
  bodyContent: string;
  formulaOrCode?: string;
  practicalRule?: string;
  targetId?: string;
}

export const ShareCardModal: React.FC<ShareCardModalProps> = ({
  isOpen,
  onClose,
  title,
  category = 'Civil Engineering',
  subtitle,
  bodyContent,
  formulaOrCode,
  practicalRule,
  targetId,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Retrieve any attached notes & photos for this item
  const attachments = targetId ? getItemAttachments(targetId) : null;
  const attachedNotesText = attachments?.notes && attachments.notes.length > 0
    ? '\n\n📝 Personal Field Notes:\n' + attachments.notes.map((n, i) => `${i + 1}. "${n.text}" (${n.author})`).join('\n')
    : '';
  const attachedPhotosCount = attachments?.photos?.length || 0;
  const photoMention = attachedPhotosCount > 0 ? `\n📸 Attached Field Photos: ${attachedPhotosCount} photo(s) saved in Deep Help Hub.` : '';

  // Formatted share text
  const shareText = `📐 *Deep Help - Civil Engineering Hub*\n\n📌 *${title}* [${category}]\n${subtitle ? `_${subtitle}_\n` : ''}${
    formulaOrCode ? `\n⚡ *Formula / Provision:*\n${formulaOrCode}\n` : ''
  }\n📖 *Details:*\n${bodyContent}${
    practicalRule ? `\n\n💡 *Field Rule / Codal Standard:*\n${practicalRule}` : ''
  }${attachedNotesText}${photoMention}\n\n🔗 Access on Deep Help Civil Hub: ${window.location.origin}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleTelegram = () => {
    const url = `https://t.me/share/url?url=${encodeURIComponent(window.location.origin)}&text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: shareText,
        });
      } catch {
        // Fallback to copy
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([shareText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_deephelp_card.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div
        id="share-card-modal-box"
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6 transition-all"
      >
        {/* Header */}
        <div className="p-5 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-xs">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                Share Civil Engineering Card
              </h3>
              <p className="text-[11px] text-slate-400">
                Formula, IS Code, Personal Notes & Photos
              </p>
            </div>
          </div>
          <button
            type="button"
            id="close-share-modal-btn"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preview Card */}
        <div className="p-5 space-y-4">
          <div className="p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-500/5 border border-amber-500/30 dark:border-amber-500/20 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500 text-slate-950">
                {category}
              </span>
              <span className="text-[10px] font-mono text-slate-400">Deep Help HUB</span>
            </div>
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white leading-snug">
              {title}
            </h4>
            {formulaOrCode && (
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-amber-700 dark:text-amber-300">
                {formulaOrCode}
              </div>
            )}
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-4">
              {bodyContent}
            </p>
            {attachedPhotosCount > 0 && (
              <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
                <Sparkles className="w-3 h-3" />
                <span>Includes {attachedPhotosCount} attached photo(s) & personal notes</span>
              </div>
            )}
          </div>

          {/* Share Action Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {/* WhatsApp */}
            <button
              type="button"
              id="share-whatsapp-btn"
              onClick={handleWhatsApp}
              className="p-3 rounded-2xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 flex flex-col items-center justify-center space-y-1.5 cursor-pointer transition-colors"
            >
              <MessageCircle className="w-5 h-5 text-emerald-600" />
              <span className="text-xs font-bold">WhatsApp</span>
            </button>

            {/* Telegram */}
            <button
              type="button"
              id="share-telegram-btn"
              onClick={handleTelegram}
              className="p-3 rounded-2xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-sky-700 dark:text-sky-300 flex flex-col items-center justify-center space-y-1.5 cursor-pointer transition-colors"
            >
              <Send className="w-5 h-5 text-sky-600" />
              <span className="text-xs font-bold">Telegram</span>
            </button>

            {/* Copy Card */}
            <button
              type="button"
              id="share-copy-card-btn"
              onClick={handleCopy}
              className="p-3 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-800 dark:text-amber-300 flex flex-col items-center justify-center space-y-1.5 cursor-pointer transition-colors"
            >
              {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5 text-amber-600" />}
              <span className="text-xs font-bold">{copied ? 'Copied!' : 'Copy Text'}</span>
            </button>

            {/* Download Text */}
            <button
              type="button"
              id="share-download-card-btn"
              onClick={handleDownloadTxt}
              className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 flex flex-col items-center justify-center space-y-1.5 cursor-pointer transition-colors"
            >
              <Download className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              <span className="text-xs font-bold">Download</span>
            </button>
          </div>

          {/* Quick Web Share API button if on Mobile / Supported browser */}
          {'share' in navigator && (
            <button
              type="button"
              id="native-web-share-btn"
              onClick={handleNativeShare}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-black bg-amber-500 text-slate-950 hover:bg-amber-400 flex items-center justify-center space-x-2 transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Share via Device Menu (Apps / Bluetooth / Email)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
