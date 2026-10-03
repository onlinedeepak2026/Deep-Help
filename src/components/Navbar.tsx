import React, { useState } from 'react';
import { ActiveTab, Notice } from '../types';
import {
  Compass,
  Layers,
  Building2,
  Coins,
  ArrowRightLeft,
  Ruler,
  Maximize2,
  Droplets,
  BookOpen,
  HelpCircle,
  Sun,
  Moon,
  BookmarkCheck,
  Search,
  Menu,
  X,
  Printer,
  UserCheck,
  Calculator,
  Heart,
  MessageSquareHeart,
  Users,
  Eye,
  Bell,
  Share2,
  GraduationCap,
  Briefcase,
  BrainCircuit,
  Columns,
  FileSpreadsheet,
  Languages,
} from 'lucide-react';
import { NotificationDropdown } from './NotificationDropdown';
import { FounderAvatar } from './FounderAvatar';
import { ShieldCheck, Radio, Sparkles } from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  onSelectTab?: (tab: ActiveTab) => void;
  setActiveTab?: (tab: ActiveTab) => void;
  darkMode: boolean;
  onToggleDarkMode?: () => void;
  setDarkMode?: (val: boolean | ((prev: boolean) => boolean)) => void;
  savedCount: number;
  onOpenHistory?: () => void;
  onOpenSaved?: () => void;
  onOpenReportModal?: () => void;
  onOpenAboutFounder?: () => void;
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
  visitorCount?: number;
  activeOnline?: number;
  likesCount?: number;
  userHasLiked?: boolean;
  onToggleLike?: () => void;
  onOpenFeedbackModal?: () => void;
  onOpenLiveModal?: () => void;
  onOpenPrivacyModal?: () => void;
  onOpenGlobalSearch?: () => void;
  notices?: Notice[];
  readNoticeIds?: string[];
  onMarkAllNoticesAsRead?: () => void;
  onOpenNoticeShareModal?: (notice: Notice) => void;
  onOpenPostNoticeModal?: () => void;
  founderPhoto?: string | null;
  language?: 'en' | 'hi';
  onToggleLanguage?: () => void;
  onReplayIntro?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  setActiveTab,
  darkMode,
  onToggleDarkMode,
  setDarkMode,
  savedCount,
  onOpenHistory,
  onOpenSaved,
  onOpenReportModal,
  onOpenAboutFounder,
  searchQuery = '',
  setSearchQuery,
  visitorCount = 18450,
  activeOnline = 28,
  likesCount = 4892,
  userHasLiked = false,
  onToggleLike,
  onOpenFeedbackModal,
  onOpenLiveModal,
  onOpenPrivacyModal,
  onOpenGlobalSearch,
  onReplayIntro,
  notices = [],
  readNoticeIds = [],
  onMarkAllNoticesAsRead,
  onOpenNoticeShareModal,
  onOpenPostNoticeModal,
  founderPhoto,
  language = 'en',
  onToggleLanguage,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const unreadNoticesCount = notices.filter((n) => !readNoticeIds.includes(n.id)).length;

  const changeTab = (tab: ActiveTab) => {
    if (onSelectTab) onSelectTab(tab);
    else if (setActiveTab) setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  const toggleDark = () => {
    if (onToggleDarkMode) onToggleDarkMode();
    else if (setDarkMode) setDarkMode((prev) => !prev);
  };

  const openHistoryDrawer = () => {
    if (onOpenHistory) onOpenHistory();
    else if (onOpenSaved) onOpenSaved();
  };

  const navItems: { id: ActiveTab; label: string; labelHi: string; icon: React.ReactNode }[] = [
    { id: 'study', label: 'Study Section', labelHi: 'स्टडी सेक्शन', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'calculators', label: 'Calculators', labelHi: 'कैलकुलेटर', icon: <Calculator className="w-4 h-4" /> },
    { id: 'design', label: 'Design Tools', labelHi: 'डिज़ाइन टूल्स', icon: <Columns className="w-4 h-4" /> },
    { id: 'estimation', label: 'Estimation', labelHi: 'इस्टीमेशन', icon: <FileSpreadsheet className="w-4 h-4" /> },
    { id: 'surveying', label: 'Surveying', labelHi: 'सर्वेइंग', icon: <Ruler className="w-4 h-4" /> },
    { id: 'career', label: 'Career & Jobs', labelHi: 'कैरियर एवं जॉब्स', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'ai-tools', label: 'AI Civil Hub', labelHi: 'एआई हब', icon: <BrainCircuit className="w-4 h-4" /> },
    { id: 'notices', label: 'Notices', labelHi: 'नोटिस', icon: <Bell className="w-4 h-4" /> },
    { id: 'community', label: 'Community', labelHi: 'कम्युनिटी', icon: <Users className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div
            id="brand-logo-btn"
            onClick={() => changeTab('home')}
            className="flex items-center space-x-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-sm group-hover:scale-105 transition-transform">
              <Compass className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-1.5">
                <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
                  Deep Help
                </span>
                <span className="text-xs px-1.5 py-0.5 rounded font-semibold bg-amber-500/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400 border border-amber-500/20">
                  HUB
                </span>
                <span className="hidden sm:inline-flex items-center space-x-1 text-[10px] px-2 py-0.5 rounded-full font-black bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>∞ 100% Unlimited</span>
                </span>
              </div>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 hidden sm:inline leading-none">
                Deep Help - Civil Engineering Hub (All Features Free & Unlimited)
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-1 overflow-x-auto scrollbar-none py-1">
            <button
              id="nav-tab-home"
              onClick={() => changeTab('home')}
              className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all shrink-0 ${
                activeTab === 'home'
                  ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {language === 'hi' ? 'डैशबोर्ड' : 'Dashboard'}
            </button>
            {navItems.map((item) => {
              const isSelected =
                activeTab === item.id ||
                (item.id === 'calculators' &&
                  ['concrete', 'brick', 'steel', 'mix', 'cost', 'unit', 'converter', 'tank', 'scientific', 'calculator'].includes(activeTab)) ||
                (item.id === 'design' && ['beam', 'column', 'slab', 'footing'].includes(activeTab)) ||
                (item.id === 'study' && ['formula', 'formulas', 'quiz', 'quiz-manage'].includes(activeTab)) ||
                (item.id === 'surveying' && ['survey', 'surveying'].includes(activeTab));

              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => changeTab(item.id)}
                  className={`flex items-center space-x-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {item.icon}
                  <span>{language === 'hi' ? item.labelHi : item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            {/* Universal Omni-Search Trigger Button */}
            {onOpenGlobalSearch && (
              <button
                id="nav-global-search-btn"
                type="button"
                onClick={onOpenGlobalSearch}
                className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 transition-all cursor-pointer shadow-2xs group"
                title="Search all tools, formulas, topics, IS codes, PYQs (Ctrl+K)"
              >
                <Search className="w-3.5 h-3.5 text-amber-500 group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline">Search</span>
                <kbd className="hidden xl:inline-block px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-700 font-mono text-[10px] text-slate-500 dark:text-slate-400">
                  Ctrl+K
                </kbd>
              </button>
            )}

            {/* Language Toggle */}
            {onToggleLanguage && (
              <button
                id="language-toggle-btn"
                type="button"
                onClick={onToggleLanguage}
                className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-black bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer"
                title="Switch Language / भाषा बदलें (Hindi / English)"
              >
                <Languages className="w-3.5 h-3.5 text-amber-500" />
                <span>{language === 'hi' ? 'हिंदी' : 'English'}</span>
              </button>
            )}

            {/* Live Active Engineers Pill */}
            <button
              id="nav-live-active-pill"
              type="button"
              onClick={onOpenLiveModal || (() => changeTab('community'))}
              className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-black bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 transition-all cursor-pointer shadow-2xs"
              title="Click to view real-time live active engineers / लाइव एक्टिव इंजीनियर्स"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-mono">{activeOnline}</span>
              <span className="hidden sm:inline font-bold">Live</span>
            </button>

            {/* Live Visitor Pill */}
            <button
              id="nav-visitor-pill"
              type="button"
              onClick={() => changeTab('community')}
              className="hidden 2xl:inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/80 hover:border-amber-500/50 transition-colors"
              title="Live Visitors & Civil Engineering Community Hub"
            >
              <Eye className="w-3.5 h-3.5 text-sky-500" />
              <span>{visitorCount.toLocaleString()} visits</span>
            </button>

            {/* Like Platform Button */}
            {onToggleLike && (
              <button
                id="nav-like-hub-btn"
                type="button"
                onClick={onToggleLike}
                className={`inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer ${
                  userHasLiked
                    ? 'bg-rose-500/15 hover:bg-rose-500/25 text-rose-600 dark:text-rose-400 border border-rose-500/30 ring-1 ring-rose-500/20'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700'
                }`}
                title={userHasLiked ? 'Liked! Click to toggle' : 'Like Deep Help Hub'}
              >
                <Heart
                  className={`w-3.5 h-3.5 ${
                    userHasLiked ? 'fill-rose-500 text-rose-500' : 'text-slate-500 dark:text-slate-400'
                  }`}
                />
                <span className="font-mono">{likesCount.toLocaleString()}</span>
              </button>
            )}

            {/* Privacy Center Button */}
            {onOpenPrivacyModal && (
              <button
                id="nav-privacy-btn"
                type="button"
                onClick={onOpenPrivacyModal}
                className="hidden lg:inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer"
                title="Privacy & Data Protection Center / गोपनीयता नीति"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span className="hidden xl:inline">Privacy</span>
              </button>
            )}

            {/* Give Feedback Button */}
            {onOpenFeedbackModal && (
              <button
                id="nav-feedback-btn"
                type="button"
                onClick={onOpenFeedbackModal}
                className="hidden sm:inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30 transition-all shadow-2xs"
                title="Give Feedback & Review / सुझाव दें"
              >
                <MessageSquareHeart className="w-3.5 h-3.5 text-amber-500" />
                <span>Feedback</span>
              </button>
            )}

            {/* Replay Intro Button */}
            {onReplayIntro && (
              <button
                id="nav-replay-intro-btn"
                type="button"
                onClick={onReplayIntro}
                className="hidden xl:inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30 transition-all cursor-pointer shadow-2xs"
                title="Replay Stylish Introduction Animation / परिचय एनिमेशन देखें"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Intro</span>
              </button>
            )}

            {/* About Founder Button */}
            <button
              id="nav-about-founder-btn"
              type="button"
              onClick={onOpenAboutFounder}
              className="flex items-center space-x-2 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30 transition-all shadow-2xs"
              title="About Founder: Er. Deepak Kumar"
            >
              <FounderAvatar
                photoUrl={founderPhoto}
                size="xs"
                showVerifiedBadge={false}
                className="pointer-events-none"
              />
              <span className="hidden sm:inline">Er. Deepak</span>
              <span className="sm:hidden">Founder</span>
            </button>

            {/* PDF Report Export Button */}
            {onOpenReportModal && (
              <button
                id="global-pdf-report-btn"
                onClick={onOpenReportModal}
                className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition-colors"
                title="Export Printable PDF Report"
              >
                <Printer className="w-3.5 h-3.5 text-amber-500" />
                <span>Report</span>
              </button>
            )}

            {/* Bell Notification Button with live badge & popover dropdown */}
            <div className="relative">
              <button
                id="nav-notification-bell-btn"
                type="button"
                onClick={() => setNotificationOpen(!notificationOpen)}
                className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Notifications & Latest Civil Notices"
                aria-label="View notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNoticesCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center animate-pulse">
                    {unreadNoticesCount}
                  </span>
                )}
              </button>

              <NotificationDropdown
                isOpen={notificationOpen}
                onClose={() => setNotificationOpen(false)}
                notices={notices}
                readNoticeIds={readNoticeIds}
                onMarkAllAsRead={() => {
                  if (onMarkAllNoticesAsRead) onMarkAllNoticesAsRead();
                }}
                onSelectNotice={(notice) => {
                  changeTab('notices');
                }}
                onShareNotice={(notice) => {
                  if (onOpenNoticeShareModal) onOpenNoticeShareModal(notice);
                }}
                onViewAllNotices={() => {
                  changeTab('notices');
                }}
                onOpenPostNoticeModal={onOpenPostNoticeModal}
              />
            </div>

            {/* Saved Calculations Drawer Button */}
            <button
              id="saved-calculations-btn"
              onClick={openHistoryDrawer}
              className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Saved Calculations History"
              aria-label="Saved Calculations"
            >
              <BookmarkCheck className="w-5 h-5" />
              {savedCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-amber-500 text-slate-950 text-[10px] font-bold rounded-full flex items-center justify-center">
                  {savedCount}
                </span>
              )}
            </button>

            {/* Dark Mode Toggle */}
            <button
              id="dark-mode-toggle-btn"
              onClick={toggleDark}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Secondary navigation strip on tablets / desktops for remaining items */}
        <div className="hidden md:flex lg:hidden items-center space-x-1 py-1.5 border-t border-slate-100 dark:border-slate-800 overflow-x-auto scrollbar-none">
          <button
            onClick={() => changeTab('home')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md ${
              activeTab === 'home' ? 'bg-amber-500 text-slate-950' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Home
          </button>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => changeTab(item.id)}
              className={`flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold rounded-md shrink-0 ${
                activeTab === item.id ? 'bg-amber-500 text-slate-950' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-2 pb-6 space-y-1 shadow-xl">
          {/* Mobile Language Switcher */}
          {onToggleLanguage && (
            <div className="p-2 mb-2 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center space-x-1.5">
                <Languages className="w-4 h-4 text-amber-500" />
                <span>भाषा / Language</span>
              </span>
              <button
                type="button"
                onClick={onToggleLanguage}
                className="px-3 py-1 rounded-lg bg-amber-500 text-slate-950 font-black text-xs cursor-pointer shadow-xs"
              >
                {language === 'hi' ? 'हिंदी (सक्रिय)' : 'English (Active)'}
              </button>
            </div>
          )}

          <button
            id="mobile-nav-home"
            onClick={() => changeTab('home')}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === 'home'
                ? 'bg-amber-500 text-slate-950 font-black'
                : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Compass className="w-5 h-5" />
            <span>{language === 'hi' ? 'डैशबोर्ड (होम)' : 'Dashboard'}</span>
          </button>

          {navItems.map((item) => (
            <button
              key={item.id}
              id={`mobile-nav-${item.id}`}
              onClick={() => changeTab(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                activeTab === item.id
                  ? 'bg-amber-500 text-slate-950 font-black'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {item.icon}
              <div className="flex flex-col text-left">
                <span>{language === 'hi' ? item.labelHi : item.label}</span>
                <span className="text-[10px] text-slate-400 font-medium">
                  {language === 'hi' ? item.label : item.labelHi}
                </span>
              </div>
            </button>
          ))}

          {/* About Founder & Feedback in Mobile Drawer */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
            {/* Universal Search in Mobile Drawer */}
            {onOpenGlobalSearch && (
              <button
                id="mobile-global-search-btn"
                type="button"
                onClick={() => {
                  onOpenGlobalSearch();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between py-2.5 px-3 rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 text-xs font-bold cursor-pointer"
              >
                <span className="flex items-center space-x-2">
                  <Search className="w-4 h-4 text-amber-500" />
                  <span>Search All Tools, Topics & PYQs</span>
                </span>
                <span className="font-mono text-[10px] bg-amber-500 text-slate-950 px-2 py-0.5 rounded-md font-black">
                  Ctrl+K
                </span>
              </button>
            )}

            {/* Live Active Button in Mobile */}
            <button
              id="mobile-live-active-btn"
              type="button"
              onClick={() => {
                if (onOpenLiveModal) onOpenLiveModal();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between py-2.5 px-3 rounded-xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 text-xs font-bold cursor-pointer"
            >
              <span className="flex items-center space-x-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>{language === 'hi' ? 'लाइव एक्टिव इंजीनियर्स' : 'Live Active Engineers'}</span>
              </span>
              <span className="font-mono bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full text-[10px] font-black">
                {activeOnline} Online
              </span>
            </button>

            {onReplayIntro && (
              <button
                type="button"
                onClick={() => {
                  onReplayIntro();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 text-xs font-bold cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Play Introduction Animation / परिचय एनिमेशन</span>
              </button>
            )}

            <div className="grid grid-cols-2 gap-2">
              <button
                id="mobile-feedback-btn"
                type="button"
                onClick={() => {
                  if (onOpenFeedbackModal) onOpenFeedbackModal();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 text-xs font-bold"
              >
                <MessageSquareHeart className="w-4 h-4 text-amber-500" />
                <span>Give Feedback</span>
              </button>

              <button
                id="mobile-like-btn"
                type="button"
                onClick={() => {
                  if (onToggleLike) onToggleLike();
                }}
                className={`flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                  userHasLiked
                    ? 'bg-rose-500/15 text-rose-600 border-rose-500/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                <Heart className={`w-4 h-4 ${userHasLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span>{likesCount} Likes</span>
              </button>
            </div>

            <button
              id="mobile-about-founder-btn"
              type="button"
              onClick={() => {
                if (onOpenAboutFounder) onOpenAboutFounder();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center space-x-2.5 py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold"
            >
              <FounderAvatar
                photoUrl={founderPhoto}
                size="xs"
                showVerifiedBadge={false}
                className="pointer-events-none"
              />
              <span>About Founder: Er. Deepak Kumar</span>
            </button>

            <div className="flex justify-between space-x-2">
              {onOpenReportModal && (
                <button
                  id="mobile-pdf-btn"
                  onClick={() => {
                    onOpenReportModal();
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 flex items-center justify-center space-x-1.5 py-2 px-3 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold"
                >
                  <Printer className="w-4 h-4 text-amber-500" />
                  <span>PDF Report</span>
                </button>
              )}
              <button
                id="mobile-saved-btn"
                onClick={() => {
                  openHistoryDrawer();
                  setMobileMenuOpen(false);
                }}
                className="flex-1 flex items-center justify-center space-x-1.5 py-2 px-3 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold"
              >
                <BookmarkCheck className="w-4 h-4 text-amber-500" />
                <span>Saved ({savedCount})</span>
              </button>
            </div>

            {onOpenPrivacyModal && (
              <button
                id="mobile-privacy-btn"
                type="button"
                onClick={() => {
                  onOpenPrivacyModal();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-700 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Privacy & Data Protection Center</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
