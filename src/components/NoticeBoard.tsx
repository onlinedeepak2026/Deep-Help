import React, { useState, useMemo, useEffect } from 'react';
import {
  Bell,
  Share2,
  ExternalLink,
  Pin,
  Sparkles,
  PlusCircle,
  Search,
  Filter,
  Eye,
  Calendar,
  UserCheck,
  CheckCheck,
  ChevronRight,
  HardHat,
  MessageCircle,
  Crown,
  Lock,
  Landmark,
  Building2,
  CheckCircle2,
  Radio,
  FileText,
} from 'lucide-react';
import { Notice } from '../types';
import { FounderAvatar } from './FounderAvatar';
import { AUTOMATED_GOVT_JOBS, GovtJobNotice } from '../data/govtJobsData';
import { ownerAuth } from '../utils/ownerAuth';
import { OwnerAuthModal } from './common/OwnerAuthModal';

interface NoticeBoardProps {
  notices: Notice[];
  readNoticeIds: string[];
  onMarkAsRead: (noticeId: string) => void;
  onMarkAllAsRead: () => void;
  onOpenShareModal: (notice: Notice) => void;
  onOpenPostNoticeModal: () => void;
  onOpenAboutFounder: () => void;
  founderPhoto?: string | null;
}

export const NoticeBoard: React.FC<NoticeBoardProps> = ({
  notices,
  readNoticeIds,
  onMarkAsRead,
  onMarkAllAsRead,
  onOpenShareModal,
  onOpenPostNoticeModal,
  onOpenAboutFounder,
  founderPhoto,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [onlyFounderNotices, setOnlyFounderNotices] = useState(false);
  const [activeNoticeDetail, setActiveNoticeDetail] = useState<Notice | null>(null);
  const [isOwner, setIsOwner] = useState(() => ownerAuth.isOwner());
  const [isOwnerAuthModalOpen, setIsOwnerAuthModalOpen] = useState(false);

  useEffect(() => {
    const handleOwnerChange = (e: any) => {
      setIsOwner(e.detail?.isOwner ?? ownerAuth.isOwner());
    };
    window.addEventListener('deephelp_owner_changed', handleOwnerChange);
    return () => window.removeEventListener('deephelp_owner_changed', handleOwnerChange);
  }, []);

  const categories = [
    'All',
    'Official',
    'Auto Govt Jobs',
    'Update',
    'Exam & Job',
    'Site Guidelines',
    'Important',
  ];

  const combinedNotices = useMemo(() => {
    // Automated Govt Department Recruitment Notices from all central, state, railway, PSU, metro departments
    const autoGovtNotices: Notice[] = AUTOMATED_GOVT_JOBS.map((j) => ({
      id: `auto_${j.id}`,
      title: `[Live Govt Recruitment] ${j.department}: ${j.title}`,
      category: 'Exam & Job',
      content: `Official Civil Engineering Vacancies: ${j.totalVacancies.toLocaleString()} Posts (${j.eligibility}). Pay Scale: ${j.salary}. Exam Schedule: ${j.examDate}. Key Highlights: ${j.keyHighlights.join(' • ')}. Application Deadline: ${j.applicationDeadline}.`,
      link: j.applyOnlineUrl,
      linkText: 'Apply on Official Govt Portal',
      isPinned: j.isHot,
      authorName: j.department,
      authorRole: `Automated Govt Department Feed (${j.departmentType})`,
      isFounderNotice: false,
      timestamp: j.publishedAt,
      tags: [j.departmentType, j.eligibility, j.state || 'Pan India', 'Govt Jobs', 'Civil Recruitment'],
      views: 1820 + (j.totalVacancies % 400),
      shares: 114 + (j.totalVacancies % 80),
    }));

    return [...notices, ...autoGovtNotices];
  }, [notices]);

  const filteredNotices = useMemo(() => {
    return combinedNotices
      .filter((item) => {
        if (selectedCategory === 'Auto Govt Jobs') {
          if (!item.id.startsWith('auto_')) return false;
        } else if (selectedCategory !== 'All' && item.category !== selectedCategory) {
          return false;
        }

        const matchesFounder = !onlyFounderNotices || item.isFounderNotice;
        const matchesSearch =
          !searchQuery.trim() ||
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.tags && item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

        return matchesFounder && matchesSearch;
      })
      .sort((a, b) => {
        // Pinned first, then timestamp descending
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return b.timestamp - a.timestamp;
      });
  }, [combinedNotices, selectedCategory, onlyFounderNotices, searchQuery]);

  const unreadCount = notices.filter((n) => !readNoticeIds.includes(n.id)).length;

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatRelativeTime = (timestamp: number) => {
    const diffSeconds = Math.floor((Date.now() - timestamp) / 1000);
    if (diffSeconds < 60) return 'Just now';
    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const getCategoryBadgeClass = (category: Notice['category']) => {
    switch (category) {
      case 'Official':
        return 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30';
      case 'Important':
        return 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30';
      case 'Exam & Job':
        return 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30';
      case 'Site Guidelines':
        return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30';
      case 'Update':
      default:
        return 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Automated Banner with Admin & Govt Status */}
      <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-black uppercase tracking-wider">
                <Bell className="w-3.5 h-3.5" />
                <span>Notice & Circular Board</span>
              </span>

              {/* Automatic Govt Department Sync Indicator */}
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-black">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>📡 Auto Govt Job Feeds ({AUTOMATED_GOVT_JOBS.length}+ Active)</span>
              </span>

              {/* Admin / Owner Status Badge */}
              {isOwner ? (
                <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 text-xs font-black shadow-xs">
                  <Crown className="w-3.5 h-3.5" />
                  <span>Admin Verified (Er. Deepak Kumar)</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsOwnerAuthModalOpen(true)}
                  className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer"
                  title="Click to authenticate as Admin"
                >
                  <Lock className="w-3 h-3 text-amber-500" />
                  <span>Admin Login</span>
                </button>
              )}

              {unreadCount > 0 && (
                <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold border border-rose-500/20">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping mr-0.5" />
                  <span>{unreadCount} New Notices</span>
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Official Notices, Govt Jobs & Circular Board
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              सभी सरकारी विभागों (CPWD, RRB, BTSC, BPSC, UPPSC, RSMSSB, DDA, NBCC) की नौकरियां स्वतः अपडेट होती हैं।
              आधिकारिक नोटिस व सर्कुलर केवल <strong>वेबसाइट के ओनर (Er. Deepak Kumar)</strong> द्वारा जारी किए जाते हैं।
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {unreadCount > 0 && (
              <button
                id="board-mark-all-read-btn"
                type="button"
                onClick={onMarkAllAsRead}
                className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer"
              >
                <CheckCheck className="w-4 h-4 text-emerald-500" />
                <span>Mark All Read</span>
              </button>
            )}

            {/* Post Notice Trigger */}
            <button
              id="board-post-notice-btn"
              type="button"
              onClick={onOpenPostNoticeModal}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all shadow-md active:scale-95 cursor-pointer"
            >
              {isOwner ? <Crown className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
              <span>{isOwner ? '👑 Publish Official Notice' : '+ Share Notice / Query'}</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
          {/* Category Tabs */}
          <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                {cat === 'Auto Govt Jobs' ? '🏛️ Auto Govt Jobs (सरकारी नौकरियां)' : cat}
              </button>
            ))}
          </div>

          {/* Search & Founder Filter Toggle */}
          <div className="flex items-center space-x-2.5 w-full sm:w-auto">
            <button
              id="filter-only-founder-btn"
              type="button"
              onClick={() => setOnlyFounderNotices(!onlyFounderNotices)}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 border ${
                onlyFounderNotices
                  ? 'bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-500/40'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Founder Only</span>
            </button>

            <div className="relative flex-1 sm:w-60">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="notice-search-input"
                type="text"
                placeholder="Search notices, depts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Notices Feed */}
      <div className="grid grid-cols-1 gap-4">
        {filteredNotices.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <Bell className="w-10 h-10 text-slate-400 mx-auto mb-3 stroke-[1.5]" />
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              No notices match your criteria
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Try changing the category or clearing the search box.
            </p>
          </div>
        ) : (
          filteredNotices.map((notice) => {
            const isUnread = !readNoticeIds.includes(notice.id);
            const isAutoGovt = notice.id.startsWith('auto_');

            return (
              <div
                key={notice.id}
                id={`notice-card-${notice.id}`}
                className={`relative overflow-hidden rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border transition-all p-5 sm:p-6 shadow-xs hover:shadow-md ${
                  notice.isPinned
                    ? 'border-amber-500/40 dark:border-amber-500/30 ring-1 ring-amber-500/20'
                    : isAutoGovt
                    ? 'border-emerald-500/30 hover:border-emerald-500/50'
                    : 'border-slate-200 dark:border-slate-800'
                } ${isUnread ? 'bg-amber-500/[0.02] dark:bg-amber-500/[0.03]' : ''}`}
                onClick={() => onMarkAsRead(notice.id)}
              >
                {/* Notice Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {notice.isPinned && (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500 text-slate-950 shadow-xs">
                        <Pin className="w-3 h-3 rotate-45" />
                        <span>Pinned Notice</span>
                      </span>
                    )}

                    {isAutoGovt ? (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                        <Landmark className="w-3 h-3" />
                        <span>🏛️ Auto Govt Feed: Live</span>
                      </span>
                    ) : (
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${getCategoryBadgeClass(
                          notice.category
                        )}`}
                      >
                        {notice.category}
                      </span>
                    )}

                    {notice.isFounderNotice && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenAboutFounder();
                        }}
                        className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500/15 text-amber-700 dark:text-amber-400 hover:bg-amber-500/25 border border-amber-500/30 transition-colors"
                        title="Click to view Founder profile"
                      >
                        <HardHat className="w-3 h-3 text-amber-500" />
                        <span>👑 Founder Er. Deepak Kumar</span>
                      </button>
                    )}

                    {isUnread && (
                      <span className="w-2 h-2 rounded-full bg-amber-500" title="Unread Notice" />
                    )}
                  </div>

                  <div className="flex items-center space-x-2 text-xs text-slate-400">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{formatDate(notice.timestamp)}</span>
                    </span>
                    <span>•</span>
                    <span>{formatRelativeTime(notice.timestamp)}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-snug">
                  {notice.title}
                </h3>

                {/* Content */}
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed whitespace-pre-line">
                  {notice.content}
                </p>

                {/* Link Attachment Callout */}
                {notice.link && (
                  <div className={`mt-4 p-3.5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isAutoGovt
                      ? 'bg-emerald-500/10 dark:bg-emerald-500/[0.08] border-emerald-500/30'
                      : 'bg-amber-500/10 dark:bg-amber-500/[0.08] border-amber-500/30'
                  }`}>
                    <div className="flex items-center space-x-2 text-xs text-slate-700 dark:text-slate-300">
                      {isAutoGovt ? (
                        <Landmark className="w-4 h-4 text-emerald-500 shrink-0" />
                      ) : (
                        <ExternalLink className="w-4 h-4 text-amber-500 shrink-0" />
                      )}
                      <span className="font-semibold break-all">
                        {notice.linkText || notice.link}
                      </span>
                    </div>

                    <a
                      id={`notice-open-link-${notice.id}`}
                      href={notice.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className={`inline-flex items-center justify-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-black shadow-xs transition-all shrink-0 cursor-pointer ${
                        isAutoGovt
                          ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                          : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                      }`}
                    >
                      <span>{isAutoGovt ? 'Apply on Official Govt Portal' : 'Open Link / PDF'}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}

                {/* Tags */}
                {notice.tags && notice.tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 mt-4">
                    {notice.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Bottom Author & Share Action Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center space-x-2.5">
                    {notice.isFounderNotice ? (
                      <FounderAvatar
                        photoUrl={founderPhoto}
                        size="xs"
                        showVerifiedBadge={false}
                        className="w-8 h-8 rounded-xl"
                      />
                    ) : isAutoGovt ? (
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                        <Building2 className="w-4 h-4" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xs">
                        {notice.authorName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center space-x-1">
                        <span>{notice.authorName}</span>
                        {notice.isFounderNotice && (
                          <span className="text-[10px] text-amber-500 font-bold">(Founder)</span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium">
                        {notice.authorRole}
                      </div>
                    </div>
                  </div>

                  {/* Share Notice Button with link */}
                  <div className="flex items-center space-x-2">
                    <button
                      id={`share-notice-btn-${notice.id}`}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenShareModal(notice);
                      }}
                      className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 transition-all cursor-pointer"
                      title="Share this notice & link"
                    >
                      <Share2 className="w-3.5 h-3.5 text-amber-500" />
                      <span>Share Notice (शेयर करें)</span>
                      {notice.shares && notice.shares > 0 ? (
                        <span className="text-[10px] text-slate-400 font-medium ml-1">
                          ({notice.shares})
                        </span>
                      ) : null}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Owner Auth Modal */}
      <OwnerAuthModal
        isOpen={isOwnerAuthModalOpen}
        onClose={() => setIsOwnerAuthModalOpen(false)}
        targetActionName="आधिकारिक नोटिस व सर्कुलर जारी करना"
      />
    </div>
  );
};
