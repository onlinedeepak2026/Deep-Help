import React from 'react';
import { ActiveTab } from '../types';
import {
  Compass,
  HardHat,
  Ruler,
  Layers,
  Building2,
  CheckCircle2,
  ArrowUpRight,
  Calculator,
  Search,
  UserCheck,
  Eye,
  Heart,
  MessageSquareHeart,
  Star,
  Users,
  Bell,
  Share2,
  Sparkles,
} from 'lucide-react';
import { FounderAvatar } from './FounderAvatar';

interface HeroProps {
  onSelectTab: (tab: ActiveTab) => void;
  onOpenAboutFounder?: () => void;
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
  visitorCount?: number;
  activeOnline?: number;
  totalLikes?: number;
  userHasLiked?: boolean;
  onToggleLike?: () => void;
  onOpenFeedbackModal?: () => void;
  onOpenLiveModal?: () => void;
  onOpenGlobalSearch?: (initialQuery?: string) => void;
  latestNoticeTitle?: string;
  founderPhoto?: string | null;
}

export const Hero: React.FC<HeroProps> = ({
  onSelectTab,
  onOpenAboutFounder,
  searchQuery = '',
  setSearchQuery,
  visitorCount = 18450,
  activeOnline = 28,
  totalLikes = 4892,
  userHasLiked = false,
  onToggleLike,
  onOpenFeedbackModal,
  onOpenLiveModal,
  onOpenGlobalSearch,
  latestNoticeTitle,
  founderPhoto,
}) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white border border-slate-800 shadow-xl mb-10">
      {/* Blueprint grid background effect */}
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:20px_20px]" />

      <div className="relative z-10 px-6 py-10 sm:px-10 sm:py-14 max-w-5xl mx-auto">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
            <HardHat className="w-3.5 h-3.5" />
            <span>Professional Civil Engineering Toolkit</span>
          </div>

          <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>IS 456, IS 10262 & CPWD Standards</span>
          </div>

          {/* Live Visitors Real-time badge */}
          <button
            id="hero-live-visitors-badge"
            type="button"
            onClick={onOpenLiveModal || (() => onSelectTab('community'))}
            className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-colors cursor-pointer"
            title="Live Engineers Online - Click to view real-time live activity"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>{activeOnline} Engineers Live Now</span>
          </button>

          {/* Founder Badge */}
          {onOpenAboutFounder && (
            <button
              id="hero-founder-badge-btn"
              type="button"
              onClick={onOpenAboutFounder}
              className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold transition-colors cursor-pointer"
              title="Click to view Founder details"
            >
              <FounderAvatar
                photoUrl={founderPhoto}
                size="xs"
                showVerifiedBadge={false}
                className="pointer-events-none"
              />
              <span>Founder: Er. Deepak Kumar (Diploma + B.Tech)</span>
            </button>
          )}

          {/* Latest Notice Pill */}
          <button
            id="hero-latest-notice-badge-btn"
            type="button"
            onClick={() => onSelectTab('notices')}
            className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 text-xs font-bold transition-colors cursor-pointer"
            title="Latest Official Notices & Link Share"
          >
            <Bell className="w-3.5 h-3.5 text-rose-400 animate-bounce" />
            <span className="truncate max-w-[200px] sm:max-w-[280px]">
              Notice: {latestNoticeTitle || 'New CASIO fx-991CW Calculator Released!'}
            </span>
            <Share2 className="w-3 h-3 text-amber-400 shrink-0" />
          </button>
        </div>

        {/* Main Title & Tagline */}
        <div className="space-y-3 mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/20">
              <Compass className="w-7 h-7 stroke-[2.2]" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
                Deep Help
              </h1>
              <p className="text-amber-400 text-sm sm:text-base font-semibold tracking-wide uppercase">
                Deep Help - Civil Engineering Hub
              </p>
            </div>
          </div>
          <p className="text-slate-300 text-base sm:text-lg max-w-3xl leading-relaxed pt-2">
            The all-in-one digital companion founded by <strong>Er. Deepak Kumar (Diploma From GP Bhagalpur & B.Tech From Saharsa College of Engineering in Civil)</strong> for site engineers, structural designers, quantity surveyors,
            and civil engineering students. Accurate concrete mixes, brickwork estimates, leveling surveys,
            beam reaction analysis, formula repository, and an interactive quiz master.
          </p>
        </div>

        {/* Universal Omni-Search Bar in Hero */}
        <div className="relative max-w-2xl my-6">
          <div
            id="hero-omni-search-bar"
            onClick={() => onOpenGlobalSearch?.(searchQuery)}
            className="relative flex items-center bg-slate-800/90 hover:bg-slate-800 border-2 border-slate-700/80 hover:border-amber-500/70 rounded-2xl p-2 sm:p-2.5 transition-all shadow-xl cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shrink-0 mr-3 shadow-sm group-hover:scale-105 transition-transform">
              <Search className="w-5 h-5 stroke-[2.3]" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-slate-400 group-hover:text-slate-200 text-xs sm:text-sm font-medium flex items-center justify-between pr-2 truncate">
                <span className="truncate">Search all 30+ tools, subjects, formulas, IS codes, PYQs...</span>
                <kbd className="hidden sm:inline-block px-2 py-0.5 rounded-lg bg-slate-700/90 font-mono text-[10px] font-bold text-amber-400 border border-slate-600 shrink-0 ml-2">
                  Ctrl + K
                </kbd>
              </span>
            </div>
            <button
              type="button"
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-colors hidden sm:block shrink-0 shadow-sm"
            >
              Search Hub
            </button>
          </div>

          {/* Quick Search Chips */}
          <div className="flex flex-wrap items-center gap-1.5 mt-2.5 px-1 text-xs">
            <span className="text-slate-400 font-bold flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Quick:</span>
            </span>
            {['Concrete Mix M20', 'Beam Deflection', 'Euler Buckling', 'IS 456 Clauses', 'SSC JE PYQ', 'Slump Test'].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => onOpenGlobalSearch?.(tag)}
                className="px-2.5 py-1 rounded-lg bg-slate-800/70 hover:bg-amber-500/20 hover:text-amber-300 text-slate-300 border border-slate-700/80 text-[11px] font-semibold transition-colors cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Access Action Pills & Social Actions */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2">
          <button
            id="hero-quick-concrete-btn"
            onClick={() => onSelectTab('concrete')}
            className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold transition-all hover:border-amber-500/50"
          >
            <Layers className="w-4 h-4 text-amber-400" />
            <span>Concrete Mix (M15-M30)</span>
            <ArrowUpRight className="w-3 h-3 text-slate-400" />
          </button>

          <button
            id="hero-quick-brick-btn"
            onClick={() => onSelectTab('brick')}
            className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold transition-all hover:border-amber-500/50"
          >
            <Building2 className="w-4 h-4 text-amber-400" />
            <span>Brick & Mortar</span>
            <ArrowUpRight className="w-3 h-3 text-slate-400" />
          </button>

          <button
            id="hero-quick-survey-btn"
            onClick={() => onSelectTab('survey')}
            className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold transition-all hover:border-amber-500/50"
          >
            <Ruler className="w-4 h-4 text-amber-400" />
            <span>Surveying HI & Rise/Fall</span>
            <ArrowUpRight className="w-3 h-3 text-slate-400" />
          </button>

          <button
            id="hero-quick-quiz-btn"
            onClick={() => onSelectTab('quiz')}
            className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md"
          >
            <Calculator className="w-4 h-4" />
            <span>Take Civil Quiz</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>

          {/* Like Hub Direct Action in Hero */}
          {onToggleLike && (
            <button
              id="hero-like-btn"
              type="button"
              onClick={onToggleLike}
              className={`inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                userHasLiked
                  ? 'bg-rose-500/25 border-rose-500 text-rose-300'
                  : 'bg-slate-800/90 hover:bg-rose-500/20 border-slate-700 text-slate-200 hover:text-rose-300 hover:border-rose-500/40'
              }`}
            >
              <Heart className={`w-4 h-4 ${userHasLiked ? 'fill-rose-400 text-rose-400' : 'text-slate-400'}`} />
              <span>{userHasLiked ? 'Liked' : 'Like'} ({totalLikes.toLocaleString()})</span>
            </button>
          )}

          {/* Feedback Button */}
          {onOpenFeedbackModal && (
            <button
              id="hero-feedback-btn"
              type="button"
              onClick={onOpenFeedbackModal}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-amber-500/20 text-slate-200 hover:text-amber-300 border border-slate-700 hover:border-amber-500/40 text-xs font-bold transition-all cursor-pointer"
            >
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>Feedback / रिव्यू दें</span>
            </button>
          )}
        </div>

        {/* Highlight Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-slate-800/80">
          <div
            onClick={() => onSelectTab('community')}
            className="cursor-pointer group hover:bg-slate-800/40 p-2 rounded-xl transition-colors"
          >
            <div className="text-2xl sm:text-3xl font-black text-sky-400 font-mono-calc flex items-center space-x-1.5">
              <span>{visitorCount.toLocaleString()}</span>
              <Eye className="w-4 h-4 text-sky-400/70" />
            </div>
            <div className="text-xs text-slate-400 font-medium group-hover:text-sky-300 transition-colors">
              Civil Visitors (विज़िटर)
            </div>
          </div>

          <div
            onClick={onToggleLike}
            className="cursor-pointer group hover:bg-slate-800/40 p-2 rounded-xl transition-colors"
          >
            <div className="text-2xl sm:text-3xl font-black text-rose-400 font-mono-calc flex items-center space-x-1.5">
              <span>{totalLikes.toLocaleString()}</span>
              <Heart className="w-4 h-4 text-rose-400 fill-rose-400/40" />
            </div>
            <div className="text-xs text-slate-400 font-medium group-hover:text-rose-300 transition-colors">
              Platform Likes (लाइक्स)
            </div>
          </div>

          <div
            onClick={() => onSelectTab('formula')}
            className="cursor-pointer group hover:bg-slate-800/40 p-2 rounded-xl transition-colors"
          >
            <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono-calc">21</div>
            <div className="text-xs text-slate-400 font-medium group-hover:text-amber-300 transition-colors">
              Disciplines & Formulas
            </div>
          </div>

          <div
            onClick={() => onSelectTab('community')}
            className="cursor-pointer group hover:bg-slate-800/40 p-2 rounded-xl transition-colors"
          >
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono-calc flex items-center space-x-1">
              <span>4.9</span>
              <span className="text-sm text-emerald-400/80">/5 ⭐</span>
            </div>
            <div className="text-xs text-slate-400 font-medium group-hover:text-emerald-300 transition-colors">
              Verified Engineer Rating
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
