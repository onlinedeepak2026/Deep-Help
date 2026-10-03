import React, { useState, useEffect } from 'react';
import {
  X,
  PlusCircle,
  Link2,
  Tag,
  ShieldCheck,
  Sparkles,
  Key,
  AlertCircle,
  CheckCircle2,
  Crown,
  Lock,
  Unlock,
} from 'lucide-react';
import { Notice } from '../types';
import { ownerAuth } from '../utils/ownerAuth';

interface PostNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddNotice?: (notice: Omit<Notice, 'id' | 'timestamp' | 'views' | 'shares'>) => void;
  onPostNotice?: (notice: Notice) => void;
  founderEmail?: string;
}

export const PostNoticeModal: React.FC<PostNoticeModalProps> = ({
  isOpen,
  onClose,
  onAddNotice,
  onPostNotice,
  founderEmail = 'deepak20061122@gmail.com',
}) => {
  const [isOwner, setIsOwner] = useState(() => ownerAuth.isOwner());
  const [selectedRoleType, setSelectedRoleType] = useState<'student' | 'engineer' | 'faculty' | 'founder'>(
    ownerAuth.isOwner() ? 'founder' : 'student'
  );
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Notice['category']>(ownerAuth.isOwner() ? 'Official' : 'Exam & Job');
  const [content, setContent] = useState('');
  const [link, setLink] = useState('');
  const [linkText, setLinkText] = useState('');
  const [authorName, setAuthorName] = useState(
    ownerAuth.isOwner() ? 'Er. Deepak Kumar' : 'Civil Student / Engineer'
  );
  const [authorRole, setAuthorRole] = useState(
    ownerAuth.isOwner() ? 'Founder (Diploma + B.Tech Civil)' : 'B.Tech / Diploma Civil Student'
  );
  const [isFounderNotice, setIsFounderNotice] = useState(() => ownerAuth.isOwner());
  const [isPinned, setIsPinned] = useState(false);
  const [tagsInput, setTagsInput] = useState('Exam, Notes, Study Group');
  const [passcodeInput, setPasscodeInput] = useState('');
  const [passcodeSuccess, setPasscodeSuccess] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);

  useEffect(() => {
    const handleOwnerChange = (e: any) => {
      const verified = e.detail?.isOwner ?? ownerAuth.isOwner();
      setIsOwner(verified);
      if (verified) {
        setSelectedRoleType('founder');
        setAuthorName('Er. Deepak Kumar');
        setAuthorRole('Founder & Academic Director');
        setIsFounderNotice(true);
      }
    };
    window.addEventListener('deephelp_owner_changed', handleOwnerChange);
    return () => window.removeEventListener('deephelp_owner_changed', handleOwnerChange);
  }, []);

  const handleVerifyPasscode = () => {
    if (!passcodeInput.trim()) {
      setErrorMsg('कृपया फाउंडर पासकोड दर्ज करें (उदा. deepak123)');
      return;
    }
    const res = ownerAuth.verify(passcodeInput);
    if (res.success) {
      setIsOwner(true);
      setSelectedRoleType('founder');
      setAuthorName('Er. Deepak Kumar');
      setAuthorRole('Founder & Academic Director');
      setIsFounderNotice(true);
      setCategory('Official');
      setPasscodeSuccess(res.message);
      setErrorMsg('');
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleRoleSelect = (type: 'student' | 'engineer' | 'faculty' | 'founder') => {
    setSelectedRoleType(type);
    if (type === 'student') {
      setAuthorName('Civil Student');
      setAuthorRole('Civil Engineering Student');
      setIsFounderNotice(false);
      setIsPinned(false);
      if (category === 'Official') setCategory('Exam & Job');
    } else if (type === 'engineer') {
      setAuthorName('Site Engineer');
      setAuthorRole('Site Quality & Execution Engineer');
      setIsFounderNotice(false);
      setIsPinned(false);
      if (category === 'Official') setCategory('Site Guidelines');
    } else if (type === 'faculty') {
      setAuthorName('Prof. Civil Faculty');
      setAuthorRole('Assistant Professor / Lecturer');
      setIsFounderNotice(false);
      setIsPinned(false);
      if (category === 'Official') setCategory('Important');
    } else if (type === 'founder') {
      if (!isOwner) {
        // Prompt for PIN
        setErrorMsg('संकेत: "Er. Deepak (Founder)" के रूप में पोस्ट करने के लिए कृपया नीचे अपना फाउंडर पासकोड दर्ज करें।');
      } else {
        setAuthorName('Er. Deepak Kumar');
        setAuthorRole('Founder (Diploma + B.Tech Civil)');
        setIsFounderNotice(true);
        setCategory('Official');
      }
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Security check: If posting as founder or official or pinned, user MUST be verified owner!
    if ((selectedRoleType === 'founder' || category === 'Official' || isPinned || isFounderNotice) && !ownerAuth.isOwner()) {
      setErrorMsg('सुरक्षा नियम: आधिकारिक बुलेटिन और पिन केवल वेबसाइट एडमिन / फाउंडर (Er. Deepak Kumar) ही शेयर कर सकते हैं। कृपया नीचे फाउंडर पासकोड (deepak123) डालकर सत्यापित करें।');
      return;
    }

    if (!title.trim()) {
      setErrorMsg('कृपया नोटिस का शीर्षक दर्ज करें।');
      return;
    }
    if (!content.trim()) {
      setErrorMsg('कृपया नोटिस का विवरण लिखें।');
      return;
    }

    // Parse tags
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const verifiedAsFounder = isOwner && (selectedRoleType === 'founder' || isFounderNotice);

    // Add notice
    const noticePayload: Omit<Notice, 'id' | 'timestamp' | 'views' | 'shares'> = {
      title: title.trim(),
      category: verifiedAsFounder ? category : category === 'Official' ? 'Exam & Job' : category,
      content: content.trim(),
      link: link.trim() || undefined,
      linkText: linkText.trim() || (link.trim() ? 'Open Notice Link' : undefined),
      authorName: verifiedAsFounder ? 'Er. Deepak Kumar' : authorName.trim() || 'Site Engineer',
      authorRole: verifiedAsFounder ? 'Founder (Deep Help)' : authorRole.trim() || 'Civil Student / Engineer',
      isFounderNotice: verifiedAsFounder,
      isPinned: verifiedAsFounder ? isPinned : false,
      tags: tags.length > 0 ? tags : ['Announcement'],
    };

    if (onAddNotice) {
      onAddNotice(noticePayload);
    } else if (onPostNotice) {
      onPostNotice({
        ...noticePayload,
        id: `notice_${Date.now()}`,
        timestamp: Date.now(),
        views: 1,
        shares: 0,
      });
    }

    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
      onClose();
      // Reset
      setTitle('');
      setContent('');
      setLink('');
      setLinkText('');
      setPasscodeInput('');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-slate-950 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-slate-950/20 backdrop-blur-sm text-white flex items-center justify-center font-bold">
              {isOwner ? <Crown className="w-5 h-5 text-amber-200" /> : <PlusCircle className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-black text-white">Post Notice & Share Link</h3>
                {isOwner && (
                  <span className="px-2 py-0.5 rounded-full bg-slate-950/30 text-amber-200 text-[10px] font-black uppercase tracking-wider">
                    👑 Admin / Founder
                  </span>
                )}
              </div>
              <p className="text-xs text-amber-100 font-medium">
                {isOwner
                  ? 'फाउंडर एक्सेस: आप आधिकारिक नोटिस, लिंक व सर्कुलर पिन कर सकते हैं'
                  : 'छात्र व इंजीनियर फील्ड चर्चा या प्रश्न शेयर कर सकते हैं (आधिकारिक केवल फाउंडर)'}
              </p>
            </div>
          </div>

          <button
            id="close-post-notice-modal"
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-950/20 hover:bg-slate-950/40 text-white transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Owner Status / Unlock Banner */}
          {!isOwner ? (
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center space-x-2 text-amber-800 dark:text-amber-300 font-bold">
                  <Lock className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>क्या आप वेबसाइट ओनर (Er. Deepak Kumar) हैं?</span>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="password"
                  value={passcodeInput}
                  onChange={(e) => setPasscodeInput(e.target.value)}
                  placeholder="Enter Founder PIN (e.g. deepak123)"
                  className="grow px-3 py-1.5 rounded-xl text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
                <button
                  type="button"
                  onClick={handleVerifyPasscode}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shrink-0 cursor-pointer shadow-xs"
                >
                  Verify Admin
                </button>
              </div>
              {passcodeSuccess && (
                <p className="mt-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{passcodeSuccess}</span>
                </p>
              )}
            </div>
          ) : (
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
              <div className="flex items-center space-x-2 font-bold">
                <Crown className="w-4 h-4 text-amber-500" />
                <span>अधिकृत फाउंडर: Er. Deepak Kumar (फुल पब्लिशिंग अधिकार सक्रिय)</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  ownerAuth.logout();
                  setIsOwner(false);
                  setSelectedRoleType('student');
                }}
                className="text-[11px] text-rose-500 underline font-semibold cursor-pointer"
              >
                Logout Admin
              </button>
            </div>
          )}

          {/* Role / Author Selector */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5">
              Posting As (आप किस रूप में शेयर कर रहे हैं?)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'student' as const, label: '🎓 Student', sub: 'सिविल छात्र' },
                { id: 'engineer' as const, label: '👷 Site Engineer', sub: 'इंजीनियर' },
                { id: 'faculty' as const, label: '🏛️ Faculty / Teacher', sub: 'शिक्षक' },
                { id: 'founder' as const, label: '👑 Er. Deepak', sub: isOwner ? 'Verified Admin' : 'Admin (Locked)' },
              ].map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => handleRoleSelect(role.id)}
                  className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                    selectedRoleType === role.id
                      ? 'bg-amber-500 text-slate-950 font-bold border-amber-600 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-amber-400'
                  }`}
                >
                  <div className="text-xs font-bold truncate">{role.label}</div>
                  <div className="text-[10px] opacity-80 truncate">{role.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Notice posted and broadcasted successfully!</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
              Notice Title *
            </label>
            <input
              id="new-notice-title"
              type="text"
              required
              placeholder="e.g. Revised Concrete Mix Chart or Exam Schedule Update"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-500"
            />
          </div>

          {/* Category & Pin Option */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                Category
              </label>
              <select
                id="new-notice-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as Notice['category'])}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-500 cursor-pointer"
              >
                {isOwner && <option value="Official">Official Bulletin (केवल फाउंडर / एडमिन)</option>}
                <option value="Update">App & Tools Update (अपडेट)</option>
                <option value="Exam & Job">Exam & Vacancy (परीक्षा/नौकरी)</option>
                <option value="Site Guidelines">Site Guidelines (साइट गाइडलाइंस)</option>
                <option value="Important">Important Alert (महत्वपूर्ण)</option>
              </select>
            </div>

            <div className="flex items-center space-x-4 pt-6">
              <label
                className={`flex items-center space-x-2 text-xs font-bold ${
                  isOwner ? 'text-slate-700 dark:text-slate-300 cursor-pointer' : 'text-slate-400 cursor-not-allowed opacity-60'
                }`}
                title={!isOwner ? 'केवल फाउंडर पिन कर सकते हैं' : ''}
              >
                <input
                  type="checkbox"
                  disabled={!isOwner}
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-amber-500 h-4 w-4"
                />
                <span>Pin to top {isOwner ? '(पिन करें)' : '(Admin Only)'}</span>
              </label>

              {isOwner && (
                <label className="flex items-center space-x-2 text-xs font-bold text-amber-600 dark:text-amber-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFounderNotice}
                    onChange={(e) => setIsFounderNotice(e.target.checked)}
                    className="rounded text-amber-500 focus:ring-amber-500 h-4 w-4"
                  />
                  <span>👑 Founder Seal</span>
                </label>
              )}
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
              Notice Content / Detail *
            </label>
            <textarea
              id="new-notice-content"
              required
              rows={4}
              placeholder="Explain the update, guidelines, or notice details for engineers and students..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-500 resize-none"
            />
          </div>

          {/* Link Sharing (Founder can share any latest notice link) */}
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-3">
            <div className="flex items-center space-x-2 text-amber-700 dark:text-amber-300">
              <Link2 className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Attach External Link / Document URL (लिंक शेयर करें)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                  Notice Web URL or Document Link
                </label>
                <input
                  id="new-notice-link"
                  type="url"
                  placeholder="https://ssc.gov.in or https://bpsc.bih.nic.in"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs font-mono bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                  Button Call-to-Action Label
                </label>
                <input
                  id="new-notice-link-text"
                  type="text"
                  placeholder="e.g. View Official Notification PDF"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
              Tags (Comma separated)
            </label>
            <input
              id="new-notice-tags"
              type="text"
              placeholder="Exam, CPWD, IS Code, Field Guideline"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-500"
            />
          </div>

          {/* Action CTAs */}
          <div className="pt-3 flex items-center justify-end space-x-3 border-t border-slate-100 dark:border-slate-800">
            <button
              id="cancel-post-notice-btn"
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="submit-post-notice-btn"
              type="submit"
              className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl text-xs font-black bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md transition-all active:scale-95 cursor-pointer"
            >
              {isOwner ? <Crown className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
              <span>{isOwner ? 'Publish Official Notice (पब्लिश करें)' : 'Share Notice / Discussion'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
