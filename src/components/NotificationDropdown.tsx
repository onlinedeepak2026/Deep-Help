import React, { useState } from 'react';
import {
  Bell,
  X,
  ExternalLink,
  Share2,
  Sparkles,
  ChevronRight,
  Pin,
  CheckCheck,
  Calendar,
} from 'lucide-react';
import { Notice } from '../types';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  notices: Notice[];
  readNoticeIds: string[];
  onMarkAllAsRead: () => void;
  onSelectNotice: (notice: Notice) => void;
  onShareNotice: (notice: Notice) => void;
  onViewAllNotices: () => void;
  onOpenPostNoticeModal?: () => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  isOpen,
  onClose,
  notices,
  readNoticeIds,
  onMarkAllAsRead,
  onSelectNotice,
  onShareNotice,
  onViewAllNotices,
  onOpenPostNoticeModal,
}) => {
  if (!isOpen) return null;

  const unreadCount = notices.filter((n) => !readNoticeIds.includes(n.id)).length;

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

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Popover Content */}
      <div className="absolute right-0 top-12 z-50 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in duration-150">
        {/* Header */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                Notifications & Notices
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {unreadCount > 0 ? `${unreadCount} unread announcements` : 'All notices caught up'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            {unreadCount > 0 && (
              <button
                id="mark-all-notices-read-btn"
                type="button"
                onClick={onMarkAllAsRead}
                className="p-1 rounded-md text-[10px] font-bold text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 transition-colors flex items-center space-x-1"
                title="Mark all as read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark read</span>
              </button>
            )}
            <button
              id="close-notification-dropdown-btn"
              type="button"
              onClick={onClose}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notice List (Limit to 4 in dropdown) */}
        <div className="max-h-[360px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
          {notices.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No notices at the moment.
            </div>
          ) : (
            notices.slice(0, 5).map((notice) => {
              const isUnread = !readNoticeIds.includes(notice.id);
              return (
                <div
                  key={notice.id}
                  className={`p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer relative group ${
                    isUnread
                      ? 'bg-amber-500/[0.04] dark:bg-amber-500/[0.06]'
                      : ''
                  }`}
                  onClick={() => {
                    onSelectNotice(notice);
                    onClose();
                  }}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center space-x-1.5">
                      {notice.isPinned && (
                        <span className="text-[10px] text-amber-500 font-bold flex items-center">
                          <Pin className="w-3 h-3 rotate-45 mr-0.5" />
                          <span>Pinned</span>
                        </span>
                      )}
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {notice.category}
                      </span>
                      {notice.isFounderNotice && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-400">
                          Founder Notice
                        </span>
                      )}
                    </div>

                    <span className="text-[10px] text-slate-400 shrink-0">
                      {formatRelativeTime(notice.timestamp)}
                    </span>
                  </div>

                  <h5
                    className={`text-xs leading-snug line-clamp-2 ${
                      isUnread
                        ? 'font-black text-slate-900 dark:text-white'
                        : 'font-medium text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {notice.title}
                  </h5>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                    {notice.content}
                  </p>

                  <div className="flex items-center justify-between mt-2 pt-1.5 text-[10px] text-slate-400">
                    <span className="font-semibold text-slate-600 dark:text-slate-400">
                      {notice.authorName}
                    </span>

                    <div className="flex items-center space-x-2">
                      {notice.link && (
                        <span className="text-amber-600 dark:text-amber-400 font-bold flex items-center space-x-0.5">
                          <ExternalLink className="w-2.5 h-2.5" />
                          <span>Link attached</span>
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onShareNotice(notice);
                        }}
                        className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-amber-500 transition-colors"
                        title="Share Notice Link"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/90 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
          {onOpenPostNoticeModal && (
            <button
              id="dropdown-post-notice-btn"
              type="button"
              onClick={() => {
                onClose();
                onOpenPostNoticeModal();
              }}
              className="font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center space-x-1 cursor-pointer"
            >
              <Sparkles className="w-3 h-3" />
              <span>Post New Notice</span>
            </button>
          )}

          <button
            id="dropdown-view-all-notices-btn"
            type="button"
            onClick={() => {
              onClose();
              onViewAllNotices();
            }}
            className="font-bold text-slate-700 dark:text-slate-200 hover:text-amber-500 dark:hover:text-amber-400 flex items-center space-x-1 cursor-pointer ml-auto"
          >
            <span>Notice Board</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </>
  );
};
