import React, { useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { CommunityComment, FeedbackItem, VisitorStats } from '../types';
import { INITIAL_VISITOR_STATS } from '../data/communityData';
import {
  Users,
  Eye,
  Heart,
  MessageSquare,
  Star,
  Send,
  ThumbsUp,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Filter,
  PlusCircle,
  MessageCircle,
  Clock,
  UserCheck,
  Search,
  Share2,
  Mail,
  ExternalLink,
  ChevronDown,
  CornerDownRight,
  TrendingUp,
} from 'lucide-react';

interface CommunityFeedbackProps {
  stats?: VisitorStats;
  visitorStats?: VisitorStats;
  founderEmail?: string;
  onToggleLike: () => void;
  comments?: CommunityComment[];
  onAddComment: (comment: Omit<CommunityComment, 'id' | 'timestamp' | 'likes' | 'userLiked'>) => void;
  onLikeComment: (commentId: string) => void;
  onReplyComment: (commentId: string, reply: { name: string; role: string; content: string }) => void;
  feedbacks?: FeedbackItem[];
  onOpenFeedbackModal: () => void;
  onVoteHelpfulFeedback: (id: string) => void;
}

export const CommunityFeedback: React.FC<CommunityFeedbackProps> = ({
  stats: propsStats,
  visitorStats,
  founderEmail = 'deepak2OO61122@gmail.com',
  onToggleLike,
  comments = [],
  onAddComment,
  onLikeComment,
  onReplyComment,
  feedbacks = [],
  onOpenFeedbackModal,
  onVoteHelpfulFeedback,
}) => {
  // Safe stats with defaults so no property is ever undefined
  const stats: VisitorStats = {
    ...INITIAL_VISITOR_STATS,
    ...(propsStats || visitorStats || {}),
  };
  // Tabs: 'comments' or 'feedbacks' or 'overview'
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'comments' | 'feedbacks'>('overview');

  // Comment input form state
  const [commentName, setCommentName] = useState('');
  const [commentRole, setCommentRole] = useState('Site Engineer');
  const [commentCategory, setCommentCategory] = useState<CommunityComment['category']>('General');
  const [commentText, setCommentText] = useState('');
  const [commentSearch, setCommentSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [commentSort, setCommentSort] = useState<'newest' | 'most-liked'>('newest');

  // Reply state
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyName, setReplyName] = useState('');
  const [replyContent, setReplyContent] = useState('');

  // Like platform handler with celebratory confetti
  const handleLikePlatform = () => {
    onToggleLike();
    if (!stats.userHasLiked) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
      });
    }
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const colors = ['bg-amber-500', 'bg-sky-500', 'bg-emerald-500', 'bg-indigo-500', 'bg-rose-500', 'bg-purple-500'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    onAddComment({
      name: commentName.trim() || 'Fellow Engineer',
      role: commentRole || 'Civil Professional',
      avatarColor: randomColor,
      category: commentCategory,
      content: commentText.trim(),
    });

    confetti({
      particleCount: 50,
      spread: 50,
      origin: { y: 0.8 },
    });

    setCommentText('');
    setCommentName('');
  };

  const handlePostReply = (commentId: string) => {
    if (!replyContent.trim()) return;
    onReplyComment(commentId, {
      name: replyName.trim() || 'Engineer',
      role: 'Community Member',
      content: replyContent.trim(),
    });
    setReplyContent('');
    setReplyName('');
    setReplyingToId(null);
  };

  const filteredComments = useMemo(() => {
    return comments
      .filter((c) => {
        const matchCategory = selectedCategory === 'All' || c.category === selectedCategory;
        if (!matchCategory) return false;
        if (!commentSearch.trim()) return true;
        const q = commentSearch.toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          c.role.toLowerCase().includes(q) ||
          c.content.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        if (commentSort === 'most-liked') {
          return b.likes - a.likes;
        }
        return b.timestamp - a.timestamp;
      });
  }, [comments, selectedCategory, commentSearch, commentSort]);

  // Format relative timestamp
  const getRelativeTime = (timestamp: number) => {
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
    <div className="space-y-8">
      {/* Top Banner: Visitor Meter & Engagement Dashboard */}
      <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-black uppercase tracking-wider">
                <Users className="w-3.5 h-3.5" />
                <span>Live Community & Visitor Metrics</span>
              </span>
              <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping mr-0.5" />
                <span>{stats.activeOnline} Active Engineers Online</span>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Community, Visitors & Engagement Hub
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Track real-time civil engineering visitors, hit like to appreciate the platform, post site questions or discussions, and submit suggestions to <strong>Er. Deepak Kumar</strong>.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* Main Like Button */}
            <button
              id="community-main-like-btn"
              type="button"
              onClick={handleLikePlatform}
              className={`flex items-center space-x-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all shadow-md active:scale-95 cursor-pointer ${
                stats.userHasLiked
                  ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
              }`}
            >
              <Heart
                className={`w-5 h-5 ${stats.userHasLiked ? 'fill-white stroke-white' : 'stroke-[2.5]'}`}
              />
              <span>{stats.userHasLiked ? 'Liked! (पसंद किया)' : 'Like Hub (लाइक करें)'}</span>
              <span className="px-2 py-0.5 rounded-lg bg-black/15 text-xs font-extrabold">
                {stats.totalLikes.toLocaleString()}
              </span>
            </button>

            {/* Give Feedback Modal Trigger */}
            <button
              id="community-give-feedback-btn"
              type="button"
              onClick={onOpenFeedbackModal}
              className="flex items-center space-x-2 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition-all cursor-pointer"
            >
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>Give Feedback / सुझाव</span>
            </button>
          </div>
        </div>

        {/* 4-Key Metrics Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
          {/* Metric 1: Total Visits */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider">Total Visitors</span>
              <Eye className="w-4 h-4 text-sky-500" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {stats.totalVisits.toLocaleString()}
            </div>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1 mt-0.5">
              <TrendingUp className="w-3 h-3" />
              <span>+{stats.todayVisits} engineers today</span>
            </span>
          </div>

          {/* Metric 2: Total Likes */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider">Total Likes</span>
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500/20" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {stats.totalLikes.toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 block font-medium">
              Community Appreciations
            </span>
          </div>

          {/* Metric 3: Calculations Executed */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider">Calcs Performed</span>
              <Sparkles className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {stats.totalCalculations.toLocaleString()}+
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 block font-medium">
              Verified by IS Codes
            </span>
          </div>

          {/* Metric 4: Community Rating */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider">Engineer Rating</span>
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center space-x-1">
              <span>4.9</span>
              <span className="text-xs font-bold text-slate-400">/ 5.0</span>
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 block font-medium">
              Based on {feedbacks.length + 320} reviews
            </span>
          </div>
        </div>
      </div>

      {/* Sub-Tabs: Navigation for Comments vs Feedbacks vs Overview */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-1">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setActiveSubTab('overview')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeSubTab === 'overview'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Community Dashboard</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('comments')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeSubTab === 'comments'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Comments & Discussions</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-900/20 dark:bg-white/20 font-extrabold">
              {comments.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('feedbacks')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeSubTab === 'feedbacks'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Star className="w-4 h-4" />
            <span>User Reviews & Feedbacks</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-900/20 dark:bg-white/20 font-extrabold">
              {feedbacks.length}
            </span>
          </button>
        </div>
      </div>

      {/* VIEW 1: OVERVIEW (Combines Quick Comment + Recent Feedback + Traffic Highlights) */}
      {activeSubTab === 'overview' && (
        <div className="space-y-8">
          {/* Quick Comment Input Box */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MessageCircle className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Post a Comment, Site Question, or Note (कमेंट या सवाल पूछें)
                </h3>
              </div>
              <span className="text-[11px] font-bold text-slate-400">
                Visible to all engineers
              </span>
            </div>

            <form onSubmit={handlePostComment} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Your Name (आपका नाम)"
                  value={commentName}
                  onChange={(e) => setCommentName(e.target.value)}
                  className="px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
                />

                <select
                  value={commentRole}
                  onChange={(e) => setCommentRole(e.target.value)}
                  className="px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Site Engineer">Site Engineer</option>
                  <option value="Civil Engineering Student">Civil Student</option>
                  <option value="Junior Engineer (JE)">Junior Engineer (JE)</option>
                  <option value="Structural Consultant">Structural Consultant</option>
                  <option value="Quantity Surveyor">Quantity Surveyor</option>
                  <option value="Contractor">Civil Contractor</option>
                  <option value="Professor / Teacher">Civil Professor</option>
                </select>

                <select
                  value={commentCategory}
                  onChange={(e) => setCommentCategory(e.target.value as CommunityComment['category'])}
                  className="px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="General">General / सामान्य</option>
                  <option value="Doubt & Question">Doubt & Question / सवाल</option>
                  <option value="Site Experience">Site Experience / अनुभव</option>
                  <option value="Appreciation">Appreciation / प्रशंसा</option>
                  <option value="Exam Prep">Exam Prep / तैयारी</option>
                </select>
              </div>

              <div className="relative">
                <textarea
                  rows={2}
                  required
                  placeholder="Ask a technical civil question, share site mix experience, or express thoughts on Deep Help Hub..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 resize-none"
                />
                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="absolute right-3 bottom-3 inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 transition-all cursor-pointer shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Post Comment</span>
                </button>
              </div>
            </form>
          </div>

          {/* Two Columns: Recent Comments & Verified Feedbacks */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Latest Comments Stream */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4 text-amber-500" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Recent Discussions & Comments ({comments.length})
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveSubTab('comments')}
                  className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
                >
                  View All ({comments.length}) →
                </button>
              </div>

              <div className="space-y-3">
                {comments.slice(0, 3).map((comm) => (
                  <div
                    key={comm.id}
                    className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2.5 shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <div
                          className={`w-8 h-8 rounded-xl ${comm.avatarColor} text-white font-black text-xs flex items-center justify-center shrink-0`}
                        >
                          {comm.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                            {comm.name}
                          </div>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400">
                            {comm.role} • {getRelativeTime(comm.timestamp)}
                          </span>
                        </div>
                      </div>

                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {comm.category}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      {comm.content}
                    </p>

                    <div className="flex items-center justify-between pt-1 text-xs">
                      <button
                        type="button"
                        onClick={() => onLikeComment(comm.id)}
                        className={`inline-flex items-center space-x-1 text-xs font-bold transition-colors ${
                          comm.userLiked
                            ? 'text-rose-600 dark:text-rose-400 font-extrabold'
                            : 'text-slate-500 hover:text-rose-500 dark:text-slate-400'
                        }`}
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>{comm.likes}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveSubTab('comments');
                          setReplyingToId(comm.id);
                        }}
                        className="text-[11px] font-bold text-amber-600 dark:text-amber-400 hover:underline"
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Verified Civil Engineer Feedbacks */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Civil Engineer Reviews & Feedbacks ({feedbacks.length})
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={onOpenFeedbackModal}
                  className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
                >
                  Write Review +
                </button>
              </div>

              <div className="space-y-3">
                {feedbacks.slice(0, 3).map((fb) => (
                  <div
                    key={fb.id}
                    className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2.5 shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">
                          {fb.name}
                        </div>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400">
                          {fb.role}
                        </span>
                      </div>

                      <div className="flex items-center space-x-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3 h-3 ${
                              s <= fb.rating
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-slate-300 dark:text-slate-700'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
                      &quot;{fb.message}&quot;
                    </p>

                    <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                      <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold text-[10px]">
                        {fb.category}
                      </span>
                      <button
                        type="button"
                        onClick={() => onVoteHelpfulFeedback(fb.id)}
                        className="inline-flex items-center space-x-1 text-slate-500 dark:text-slate-400 hover:text-amber-500"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Helpful ({fb.helpfulCount})</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: FULL COMMENTS & DISCUSSIONS */}
      {activeSubTab === 'comments' && (
        <div className="space-y-6">
          {/* Comment Post Form */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-amber-500" />
              <span>Leave a Comment or Site Query</span>
            </h3>

            <form onSubmit={handlePostComment} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Your Name (आपका नाम)"
                  value={commentName}
                  onChange={(e) => setCommentName(e.target.value)}
                  className="px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
                />

                <select
                  value={commentRole}
                  onChange={(e) => setCommentRole(e.target.value)}
                  className="px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Site Engineer">Site Engineer</option>
                  <option value="Civil Engineering Student">Civil Student</option>
                  <option value="Junior Engineer (JE)">Junior Engineer (JE)</option>
                  <option value="Structural Consultant">Structural Consultant</option>
                  <option value="Quantity Surveyor">Quantity Surveyor</option>
                  <option value="Contractor">Civil Contractor</option>
                  <option value="Professor / Teacher">Civil Professor</option>
                </select>

                <select
                  value={commentCategory}
                  onChange={(e) => setCommentCategory(e.target.value as CommunityComment['category'])}
                  className="px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="General">General / सामान्य</option>
                  <option value="Doubt & Question">Doubt & Question / सवाल</option>
                  <option value="Site Experience">Site Experience / अनुभव</option>
                  <option value="Appreciation">Appreciation / प्रशंसा</option>
                  <option value="Exam Prep">Exam Prep / तैयारी</option>
                </select>
              </div>

              <div className="relative">
                <textarea
                  rows={3}
                  required
                  placeholder="Type your comment, engineering observation, question or note..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-full px-4 py-3 text-xs rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 resize-none"
                />
                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="absolute right-3 bottom-3 inline-flex items-center space-x-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 transition-all cursor-pointer shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>Post Comment</span>
                </button>
              </div>
            </form>
          </div>

          {/* Controls Bar: Category Filter, Search, Sort */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {['All', 'General', 'Doubt & Question', 'Site Experience', 'Appreciation', 'Exam Prep'].map(
                (cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      selectedCategory === cat
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                )
              )}
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search comments..."
                  value={commentSearch}
                  onChange={(e) => setCommentSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <select
                value={commentSort}
                onChange={(e) => setCommentSort(e.target.value as 'newest' | 'most-liked')}
                className="text-xs font-bold py-1.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-amber-500"
              >
                <option value="newest">Newest First</option>
                <option value="most-liked">Most Liked</option>
              </select>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {filteredComments.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 space-y-2">
                <MessageSquare className="w-10 h-10 text-slate-400 mx-auto" />
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  No comments found matching your query.
                </p>
                <p className="text-xs text-slate-400">Be the first to share your thoughts!</p>
              </div>
            ) : (
              filteredComments.map((comm) => (
                <div
                  key={comm.id}
                  className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-9 h-9 rounded-xl ${comm.avatarColor} text-white font-black text-sm flex items-center justify-center shrink-0`}
                      >
                        {comm.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                          {comm.name}
                        </div>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {comm.role} • {getRelativeTime(comm.timestamp)}
                        </span>
                      </div>
                    </div>

                    <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {comm.category}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed pl-12">
                    {comm.content}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 pl-12 text-xs">
                    <div className="flex items-center space-x-4">
                      <button
                        type="button"
                        onClick={() => onLikeComment(comm.id)}
                        className={`inline-flex items-center space-x-1.5 text-xs font-bold transition-colors cursor-pointer ${
                          comm.userLiked
                            ? 'text-rose-600 dark:text-rose-400 font-extrabold'
                            : 'text-slate-500 hover:text-rose-500 dark:text-slate-400'
                        }`}
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span>{comm.likes} Helpful</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setReplyingToId(replyingToId === comm.id ? null : comm.id)}
                        className="inline-flex items-center space-x-1 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
                      >
                        <CornerDownRight className="w-3.5 h-3.5" />
                        <span>Reply / जवाब दें</span>
                      </button>
                    </div>

                    <span className="text-[11px] text-slate-400">
                      Civil Community Verified
                    </span>
                  </div>

                  {/* Inline Reply Form */}
                  {replyingToId === comm.id && (
                    <div className="mt-3 pl-12 pt-2 border-t border-dashed border-slate-200 dark:border-slate-800 space-y-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          placeholder="Your Name"
                          value={replyName}
                          onChange={(e) => setReplyName(e.target.value)}
                          className="px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                        />
                        <input
                          type="text"
                          placeholder="Write reply..."
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                        />
                        <button
                          type="button"
                          onClick={() => handlePostReply(comm.id)}
                          className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400"
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Replies List */}
                  {comm.replies && comm.replies.length > 0 && (
                    <div className="pl-12 pt-2 space-y-2">
                      {comm.replies.map((rep) => (
                        <div
                          key={rep.id}
                          className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-1"
                        >
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-bold text-slate-900 dark:text-white">
                              {rep.name}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold">
                              {rep.role}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              • {getRelativeTime(rep.timestamp)}
                            </span>
                          </div>
                          <p className="text-xs text-slate-700 dark:text-slate-300">
                            {rep.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* VIEW 3: USER REVIEWS & FEEDBACKS */}
      {activeSubTab === 'feedbacks' && (
        <div className="space-y-6">
          {/* Call-to-Action to Give Feedback */}
          <div className="p-6 bg-amber-500/10 dark:bg-amber-500/5 rounded-3xl border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center space-x-2">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                <span>How was your experience with Deep Help Hub?</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Rate us and provide direct suggestions to Er. Deepak Kumar to make civil engineering calculations even better.
              </p>
            </div>

            <button
              type="button"
              onClick={onOpenFeedbackModal}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 transition-all shrink-0 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Give Feedback (फीडबैक दें)</span>
            </button>
          </div>

          {/* Feedback Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {feedbacks.map((fb) => (
              <div
                key={fb.id}
                className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white">
                        {fb.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {fb.role}
                      </p>
                    </div>

                    <div className="flex items-center space-x-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= fb.rating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-300 dark:text-slate-700'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
                    &quot;{fb.message}&quot;
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {fb.category}
                  </span>

                  <button
                    type="button"
                    onClick={() => onVoteHelpfulFeedback(fb.id)}
                    className="inline-flex items-center space-x-1 font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Helpful Review ({fb.helpfulCount})</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
