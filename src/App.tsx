import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  ActiveModule,
  SavedCalculation,
  VisitorStats,
  CommunityComment,
  FeedbackItem,
  Notice,
} from './types';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { QuickAccessCards } from './components/QuickAccessCards';
import { ConcreteCalculator } from './components/calculators/ConcreteCalculator';
import { BrickCalculator } from './components/calculators/BrickCalculator';
import { BuildingCostEstimator } from './components/calculators/BuildingCostEstimator';
import { UnitConverter } from './components/calculators/UnitConverter';
import { SurveyingCalculator } from './components/calculators/SurveyingCalculator';
import { BeamCalculator } from './components/calculators/BeamCalculator';
import { WaterTankCalculator } from './components/calculators/WaterTankCalculator';
import { ScientificCalculator } from './components/calculators/ScientificCalculator';
import { FormulaLibrary } from './components/FormulaLibrary';
import { QuizManagement } from './components/QuizManagement';
import { ReportModal } from './components/ReportModal';
import { SavedCalculationsModal } from './components/SavedCalculationsModal';
import { AboutFounderModal } from './components/AboutFounderModal';
import { FounderCard } from './components/FounderCard';
import { CommunityFeedback } from './components/CommunityFeedback';
import { FeedbackModal } from './components/FeedbackModal';
import { NoticeBoard } from './components/NoticeBoard';
import { PostNoticeModal } from './components/PostNoticeModal';
import { NoticeShareModal } from './components/NoticeShareModal';
import { UploadFounderPhotoModal } from './components/UploadFounderPhotoModal';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { RealtimeLiveModal } from './components/common/RealtimeLiveModal';
import { PrivacyCenterModal } from './components/common/PrivacyCenterModal';
import { FloatingLiveLikeBar } from './components/common/FloatingLiveLikeBar';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { StylishIntroAnimation } from './components/common/StylishIntroAnimation';
import { HighlightedJobNoticeBanner } from './components/common/HighlightedJobNoticeBanner';
import { TopAnimatedToolsShowcase } from './components/home/TopAnimatedToolsShowcase';
import { AcademicEssentialsSpotlight } from './components/home/AcademicEssentialsSpotlight';
import { safeStorage } from './utils/safeStorage';

// Newly Integrated Functional Hubs
import { StudyHub } from './components/study/StudyHub';
import { CalculatorsHub } from './components/calculators/CalculatorsHub';
import { DesignToolsHub } from './components/design/DesignToolsHub';
import { EstimationCostingHub } from './components/estimation/EstimationCostingHub';
import { SurveyingHub } from './components/surveying/SurveyingHub';
import { CareerHub } from './components/career/CareerHub';
import { AIFeaturesHub } from './components/ai/AIFeaturesHub';

import {
  INITIAL_VISITOR_STATS,
  INITIAL_COMMUNITY_COMMENTS,
  INITIAL_FEEDBACK_ITEMS,
} from './data/communityData';
import { INITIAL_NOTICES } from './data/noticesData';
import {
  HardHat,
  ChevronRight,
  ArrowLeft,
  History,
  ShieldCheck,
  BookOpen,
  Award,
  Mail,
  ExternalLink,
  GraduationCap,
  UserCheck,
} from 'lucide-react';

const STORAGE_CALCS_KEY = 'deephelp_saved_calculations';
const STORAGE_DARK_KEY = 'deephelp_dark_mode';
const STORAGE_LANGUAGE_KEY = 'deephelp_language_mode';
const STORAGE_VISITOR_STATS_KEY = 'deephelp_visitor_stats_v1';
const STORAGE_COMMENTS_KEY = 'deephelp_community_comments_v1';
const STORAGE_FEEDBACKS_KEY = 'deephelp_feedbacks_v1';
const STORAGE_NOTICES_KEY = 'deephelp_notices_v1';
const STORAGE_READ_NOTICES_KEY = 'deephelp_read_notices_v1';
const STORAGE_FOUNDER_PHOTO_KEY = 'deephelp_founder_dp_v1';
const SESSION_VISIT_COUNTED_KEY = 'deephelp_session_visit_counted';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveModule>('home');
  const [language, setLanguage] = useState<'en' | 'hi'>(() => {
    return (safeStorage.getItem(STORAGE_LANGUAGE_KEY) as 'en' | 'hi') || 'hi';
  });

  const handleToggleLanguage = () => {
    setLanguage((prev) => {
      const next = prev === 'en' ? 'hi' : 'en';
      safeStorage.setItem(STORAGE_LANGUAGE_KEY, next);
      return next;
    });
  };
  const [founderPhoto, setFounderPhoto] = useState<string | null>(() => {
    return safeStorage.getItem(STORAGE_FOUNDER_PHOTO_KEY) || null;
  });
  const [isUploadPhotoModalOpen, setIsUploadPhotoModalOpen] = useState(false);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = safeStorage.getItem(STORAGE_DARK_KEY);
    if (saved !== null) {
      try {
        return JSON.parse(saved);
      } catch {
        return false;
      }
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [savedCalculations, setSavedCalculations] = useState<SavedCalculation[]>(() => {
    return safeStorage.getJSON<SavedCalculation[]>(STORAGE_CALCS_KEY, []);
  });

  // Client ID for Real-Time Live Sessions & Likes
  const [clientId] = useState<string>(() => {
    let cid = safeStorage.getItem('deephelp_client_id');
    if (!cid) {
      cid = 'eng_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 7);
      safeStorage.setItem('deephelp_client_id', cid);
    }
    return cid;
  });

  // Real-Time Live Modals State
  const [isLiveModalOpen, setIsLiveModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  // Universal Omni-Search State
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchModalInitialQuery, setSearchModalInitialQuery] = useState('');
  const [studyInitialSubTab, setStudyInitialSubTab] = useState<
    'subjects' | 'notes' | 'pyqs' | 'academic-uploads' | 'quiz' | 'formulas' | 'codes'
  >('academic-uploads');

  // Stylish Introduction Animation State
  const [showIntroAnimation, setShowIntroAnimation] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('deephelp_intro_seen') !== 'true';
    } catch {
      return true;
    }
  });

  const [activeBreakdown, setActiveBreakdown] = useState({
    calculators: 12,
    study: 9,
    design: 6,
    ai: 5,
    surveying: 3,
  });
  const [userCity, setUserCity] = useState('India');
  const [recentLiveActivities, setRecentLiveActivities] = useState<string[]>([]);

  // Visitor, Likes, Comments, and Feedback State
  const [visitorStats, setVisitorStats] = useState<VisitorStats>(() => {
    return safeStorage.getJSON<VisitorStats>(STORAGE_VISITOR_STATS_KEY, INITIAL_VISITOR_STATS);
  });

  const [communityComments, setCommunityComments] = useState<CommunityComment[]>(() => {
    return safeStorage.getJSON<CommunityComment[]>(STORAGE_COMMENTS_KEY, INITIAL_COMMUNITY_COMMENTS);
  });

  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>(() => {
    return safeStorage.getJSON<FeedbackItem[]>(STORAGE_FEEDBACKS_KEY, INITIAL_FEEDBACK_ITEMS);
  });

  // Notices & Notifications State
  const [notices, setNotices] = useState<Notice[]>(() => {
    return safeStorage.getJSON<Notice[]>(STORAGE_NOTICES_KEY, INITIAL_NOTICES);
  });

  const [readNoticeIds, setReadNoticeIds] = useState<string[]>(() => {
    return safeStorage.getJSON<string[]>(STORAGE_READ_NOTICES_KEY, []);
  });

  // Notice Modals State
  const [isPostNoticeOpen, setIsPostNoticeOpen] = useState(false);
  const [selectedShareNotice, setSelectedShareNotice] = useState<Notice | null>(null);

  // Report Modal State
  const [reportModalData, setReportModalData] = useState<{
    title: string;
    module: string;
    summary: string;
    details: Record<string, string | number>;
  } | null>(null);
  const [isReportOpen, setIsReportOpen] = useState(false);

  // History Modal State
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // About Founder Modal State
  const [isAboutFounderOpen, setIsAboutFounderOpen] = useState(false);

  // Feedback Modal State
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  // Real-Time Heartbeat Ping Effect (Keeps active user counter 100% live and accurate)
  useEffect(() => {
    let isMounted = true;
    const sendPing = async () => {
      try {
        const res = await fetch('/api/realtime/ping', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ clientId, activeTab }),
        });
        if (res.ok && isMounted) {
          const data = await res.json();
          if (data.activeOnline) {
            setVisitorStats((prev) => ({
              ...prev,
              activeOnline: data.activeOnline,
              totalLikes: typeof data.totalLikes === 'number' ? data.totalLikes : prev.totalLikes,
              totalVisits: typeof data.totalVisits === 'number' ? data.totalVisits : prev.totalVisits,
              userHasLiked: typeof data.userHasLiked === 'boolean' ? data.userHasLiked : prev.userHasLiked,
            }));
          }
          if (data.activeBreakdown) setActiveBreakdown(data.activeBreakdown);
          if (data.yourCity) setUserCity(data.yourCity);
          if (data.recentActivities) setRecentLiveActivities(data.recentActivities);
        }
      } catch {
        // Fallback silently if offline; safe storage handles data
      }
    };

    sendPing();
    const interval = setInterval(sendPing, 12000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [clientId, activeTab]);

  // Session visit tracking & initial local visit count
  useEffect(() => {
    try {
      const alreadyCounted = sessionStorage.getItem(SESSION_VISIT_COUNTED_KEY);
      if (!alreadyCounted) {
        sessionStorage.setItem(SESSION_VISIT_COUNTED_KEY, 'true');
        setVisitorStats((prev) => {
          const updated: VisitorStats = {
            ...prev,
            totalVisits: prev.totalVisits + 1,
            todayVisits: prev.todayVisits + 1,
          };
          safeStorage.setJSON(STORAGE_VISITOR_STATS_KEY, updated);
          return updated;
        });
      }
    } catch {
      // ignore
    }
  }, []);

  // Dark Mode side effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    safeStorage.setItem(STORAGE_DARK_KEY, JSON.stringify(darkMode));
  }, [darkMode]);

  // Saved calculations persistence
  useEffect(() => {
    safeStorage.setJSON(STORAGE_CALCS_KEY, savedCalculations);
  }, [savedCalculations]);

  // Notices persistence
  useEffect(() => {
    safeStorage.setJSON(STORAGE_NOTICES_KEY, notices);
  }, [notices]);

  // Read Notice IDs persistence
  useEffect(() => {
    safeStorage.setJSON(STORAGE_READ_NOTICES_KEY, readNoticeIds);
  }, [readNoticeIds]);

  // Global Ctrl+K / Cmd+K shortcut for Universal Omni-Search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Universal Search Navigation Handler
  const handleSearchNavigate = (tab: ActiveModule, subTab?: string) => {
    if (tab === 'study' && subTab) {
      setStudyInitialSubTab(subTab as any);
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Notice Handlers
  const handleMarkNoticeAsRead = (id: string) => {
    setReadNoticeIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const handleMarkAllNoticesAsRead = () => {
    const allIds = notices.map((n) => n.id);
    setReadNoticeIds(allIds);
  };

  const handleCreateNotice = (newNotice: Notice) => {
    setNotices((prev) => [newNotice, ...prev]);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
    });
  };

  const handleDeleteNotice = (id: string) => {
    setNotices((prev) => prev.filter((n) => n.id !== id));
  };

  const handleTogglePinNotice = (id: string) => {
    setNotices((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isPinned: !n.isPinned } : n))
    );
  };

  // Founder Photo Handlers
  const handleSaveFounderPhoto = (photoDataUrl: string) => {
    setFounderPhoto(photoDataUrl);
    safeStorage.setItem(STORAGE_FOUNDER_PHOTO_KEY, photoDataUrl);
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  const handleRemoveFounderPhoto = () => {
    setFounderPhoto(null);
    safeStorage.removeItem(STORAGE_FOUNDER_PHOTO_KEY);
  };

  // Handle Real-Time Like on Deep Help Platform
  const handleToggleLike = async () => {
    const willBeLiked = !visitorStats.userHasLiked;
    const newLikes = willBeLiked
      ? visitorStats.totalLikes + 1
      : Math.max(0, visitorStats.totalLikes - 1);

    setVisitorStats((prev) => {
      const updated: VisitorStats = {
        ...prev,
        userHasLiked: willBeLiked,
        totalLikes: newLikes,
      };
      safeStorage.setJSON(STORAGE_VISITOR_STATS_KEY, updated);
      return updated;
    });

    if (willBeLiked) {
      confetti({
        particleCount: 75,
        spread: 65,
        origin: { y: 0.65 },
      });
    }

    try {
      const res = await fetch('/api/realtime/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId, liked: willBeLiked }),
      });
      if (res.ok) {
        const data = await res.json();
        if (typeof data.totalLikes === 'number') {
          setVisitorStats((prev) => ({
            ...prev,
            totalLikes: data.totalLikes,
            userHasLiked: data.userHasLiked,
          }));
        }
      }
    } catch {
      // Offline fallback already updated in local state
    }
  };

  // Add Community Comment
  const handleAddComment = (
    comment: Omit<CommunityComment, 'id' | 'timestamp' | 'likes' | 'userLiked'>
  ) => {
    const newComment: CommunityComment = {
      ...comment,
      id: 'comm-' + Date.now(),
      timestamp: Date.now(),
      likes: 1,
      userLiked: true,
    };
    setCommunityComments((prev) => {
      const updated = [newComment, ...prev];
      try {
        localStorage.setItem(STORAGE_COMMENTS_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  // Like comment
  const handleLikeComment = (commentId: string) => {
    setCommunityComments((prev) => {
      const updated = prev.map((c) => {
        if (c.id === commentId) {
          const newLiked = !c.userLiked;
          return {
            ...c,
            userLiked: newLiked,
            likes: newLiked ? c.likes + 1 : Math.max(0, c.likes - 1),
          };
        }
        return c;
      });
      try {
        localStorage.setItem(STORAGE_COMMENTS_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  // Reply comment
  const handleReplyComment = (
    commentId: string,
    reply: { name: string; role: string; content: string }
  ) => {
    setCommunityComments((prev) => {
      const updated = prev.map((c) => {
        if (c.id === commentId) {
          const replies = c.replies || [];
          return {
            ...c,
            replies: [
              ...replies,
              {
                id: 'rep-' + Date.now(),
                name: reply.name,
                role: reply.role,
                content: reply.content,
                timestamp: Date.now(),
              },
            ],
          };
        }
        return c;
      });
      try {
        localStorage.setItem(STORAGE_COMMENTS_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  // Submit feedback
  const handleSubmitFeedback = (
    item: Omit<FeedbackItem, 'id' | 'timestamp' | 'helpfulCount'>
  ) => {
    const newItem: FeedbackItem = {
      ...item,
      id: 'fb-' + Date.now(),
      timestamp: Date.now(),
      helpfulCount: 1,
      userVotedHelpful: true,
    };
    setFeedbackItems((prev) => {
      const updated = [newItem, ...prev];
      try {
        localStorage.setItem(STORAGE_FEEDBACKS_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  // Vote helpful on feedback
  const handleVoteHelpfulFeedback = (id: string) => {
    setFeedbackItems((prev) => {
      const updated = prev.map((f) => {
        if (f.id === id) {
          const voted = !f.userVotedHelpful;
          return {
            ...f,
            userVotedHelpful: voted,
            helpfulCount: voted ? f.helpfulCount + 1 : Math.max(0, f.helpfulCount - 1),
          };
        }
        return f;
      });
      try {
        localStorage.setItem(STORAGE_FEEDBACKS_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const handleSaveCalculation = (calc: SavedCalculation) => {
    setSavedCalculations((prev) => [calc, ...prev.filter((c) => c.id !== calc.id)]);
    setVisitorStats((prev) => {
      const updated = { ...prev, totalCalculations: prev.totalCalculations + 1 };
      try {
        localStorage.setItem(STORAGE_VISITOR_STATS_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const handleDeleteCalculation = (id: string) => {
    setSavedCalculations((prev) => prev.filter((c) => c.id !== id));
  };

  const handleClearAllCalculations = () => {
    if (confirm('Are you sure you want to clear all saved calculation history?')) {
      setSavedCalculations([]);
    }
  };

  const handleOpenReport = (data: {
    title: string;
    module: string;
    summary: string;
    details: Record<string, string | number>;
  }) => {
    setReportModalData(data);
    setIsReportOpen(true);
  };

  // Module Title Dictionary for breadcrumbs
  const moduleTitles: Record<ActiveModule, string> = {
    home: 'Dashboard',
    study: 'Civil Engineering Study Section (Notes, PYQs & Codes)',
    calculators: 'Engineering Calculators Hub',
    concrete: 'Concrete Mix Calculator',
    brick: 'Brick Masonry Calculator',
    steel: 'Steel Bar Weight Calculator (D²/162)',
    mix: 'Cement, Sand & Aggregate Calculator',
    cost: 'Building Cost Estimator',
    rate: 'Item Rate Analysis & CPWD DSR Rates',
    unit: 'Unit Converter',
    converter: 'Unit Converter',
    design: 'Structural Design & Rate Analysis Tools',
    beam: 'Beam Load & Reactions Calculator',
    column: 'RCC Column Axial Capacity & Sizing',
    slab: 'One-Way & Two-Way Slab Design',
    footing: 'Isolated Shallow Footing Design',
    estimation: 'Estimation, BOQ & Costing Center',
    survey: 'Surveying & Leveling Calculator',
    surveying: 'Surveying Tools Hub (Levelling, Traverse, Chain, GPS)',
    career: 'Career Updates & Job Notifications (SSC JE, RRB, GATE)',
    'ai-tools': 'Deep Help Civil Engineering AI Suite',
    tank: 'Water Tank Capacity Calculator',
    formula: 'Formula Library',
    formulas: 'Formula Library',
    quiz: 'Quiz & Question Management System',
    'quiz-manage': 'Quiz & Question Management System',
    scientific: 'Engineering Scientific Calculator',
    calculator: 'Engineering Scientific Calculator',
    'academic-uploads': 'Academic & Lab Uploads (PYQs, Practicals & Assignments)',
    pyqs: 'Previous Year Questions (PYQ Bank & Solutions)',
    practicals: 'Civil Engineering Lab Practicals & Assignments',
    about: 'About Me - Founder Profile',
    founder: 'About Me - Founder Profile',
    community: 'Community, Visitors & Engagement Hub',
    feedback: 'Civil Engineer Feedback & Reviews',
    notices: 'Official Notices, Circulars & Link Share',
  };

  const founderEmail = 'deepak2OO61122@gmail.com';
  const founderFacebook = 'https://www.facebook.com/share/1BwLC95KKg/';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Stylish Introduction Animation Overlay */}
      {showIntroAnimation && (
        <StylishIntroAnimation
          onComplete={() => setShowIntroAnimation(false)}
        />
      )}

      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode((prev) => !prev)}
        savedCount={savedCalculations.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenAboutFounder={() => setIsAboutFounderOpen(true)}
        visitorCount={visitorStats.totalVisits}
        activeOnline={visitorStats.activeOnline}
        likesCount={visitorStats.totalLikes}
        userHasLiked={visitorStats.userHasLiked}
        onToggleLike={handleToggleLike}
        onOpenFeedbackModal={() => setIsFeedbackModalOpen(true)}
        onOpenLiveModal={() => setIsLiveModalOpen(true)}
        onOpenPrivacyModal={() => setIsPrivacyModalOpen(true)}
        onOpenGlobalSearch={() => {
          setSearchModalInitialQuery('');
          setIsSearchModalOpen(true);
        }}
        onReplayIntro={() => setShowIntroAnimation(true)}
        notices={notices}
        readNoticeIds={readNoticeIds}
        onMarkAllNoticesAsRead={handleMarkAllNoticesAsRead}
        onOpenNoticeShareModal={(n) => setSelectedShareNotice(n)}
        onOpenPostNoticeModal={() => setIsPostNoticeOpen(true)}
        founderPhoto={founderPhoto}
        language={language}
        onToggleLanguage={handleToggleLanguage}
      />

      {/* Main Container with ErrorBoundary Protection */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ErrorBoundary fallbackTitle="Deep Help Civil Module Shield">
        {/* Module Sub-header / Breadcrumb (when not on Home) */}
        {activeTab !== 'home' && (
          <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3 p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <button
                type="button"
                onClick={() => setActiveTab('home')}
                className="flex items-center space-x-1 text-slate-700 hover:text-amber-600 dark:text-slate-300 dark:hover:text-amber-400 font-bold transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Home</span>
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-900 dark:text-white font-bold">
                {moduleTitles[activeTab]}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setIsFeedbackModalOpen(true)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30 transition-colors"
              >
                <span>Give Feedback</span>
              </button>

              <button
                type="button"
                onClick={() => setIsAboutFounderOpen(true)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
              >
                <UserCheck className="w-3.5 h-3.5 text-amber-500" />
                <span>Founder Info</span>
              </button>

              <button
                type="button"
                onClick={() => setIsHistoryOpen(true)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
              >
                <History className="w-3.5 h-3.5" />
                <span>History ({savedCalculations.length})</span>
              </button>
            </div>
          </div>
        )}

        {/* View Switcher */}
        {activeTab === 'home' && (
          <div className="space-y-8">
            {/* 1. Highlighted Live Govt Job Notice Alert Banner (at very top) */}
            <HighlightedJobNoticeBanner
              onOpenJobsTab={() => setActiveTab('career')}
              onOpenNoticesTab={() => setActiveTab('notices')}
            />

            {/* 2. Top Animated Tools Showcase (All Tools at the TOP with advanced animations!) */}
            <TopAnimatedToolsShowcase onSelectTab={setActiveTab} />

            {/* 3. ⭐ HIGHLIGHTED: Scientific Calculator + Practical Assignments + Previous Year Questions (ALL IN ONE PLACE) */}
            <AcademicEssentialsSpotlight
              onSelectTab={setActiveTab}
              onOpenStudySubTab={(subTab) => {
                setStudyInitialSubTab(subTab);
                setActiveTab('study');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* 4. Hero Section with Universal Omni-Search & Quick Access */}
            <Hero
              onSelectTab={setActiveTab}
              onOpenAboutFounder={() => setIsAboutFounderOpen(true)}
              visitorCount={visitorStats.totalVisits}
              activeOnline={visitorStats.activeOnline}
              totalLikes={visitorStats.totalLikes}
              userHasLiked={visitorStats.userHasLiked}
              onToggleLike={handleToggleLike}
              onOpenFeedbackModal={() => setIsFeedbackModalOpen(true)}
              onOpenLiveModal={() => setIsLiveModalOpen(true)}
              onOpenGlobalSearch={(q) => {
                setSearchModalInitialQuery(q || '');
                setIsSearchModalOpen(true);
              }}
              latestNoticeTitle={notices[0]?.title}
              founderPhoto={founderPhoto}
            />

            {/* 4. Quick Access Category Hubs */}
            <QuickAccessCards onSelectTab={setActiveTab} />

            {/* 5. Hub Key Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-start space-x-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                    Standard IS Code Verification
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Designed according to IS 456:2000, IS 10262:2019, IS 1077, and IS 1172 for dependable site accuracy.
                  </p>
                </div>
              </div>

              <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-start space-x-4">
                <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center shrink-0">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                    Instant PDF Report Export
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Generate professional engineering quantity sheets and calculation notes formatted for client presentations.
                  </p>
                </div>
              </div>

              <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-start space-x-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                    Site Exam Assessment Engine
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Practice with timed MCQs, detailed solutions, and full question bank CRUD persisted in your browser.
                  </p>
                </div>
              </div>
            </div>

            {/* 6. Live Community, Visitors & Feedback Hub on Homepage */}
            <div className="pt-2">
              <CommunityFeedback
                stats={visitorStats}
                visitorStats={visitorStats}
                comments={communityComments}
                feedbacks={feedbackItems}
                onToggleLike={handleToggleLike}
                onAddComment={handleAddComment}
                onLikeComment={handleLikeComment}
                onReplyComment={handleReplyComment}
                onOpenFeedbackModal={() => setIsFeedbackModalOpen(true)}
                onVoteHelpfulFeedback={handleVoteHelpfulFeedback}
                founderEmail={founderEmail}
              />
            </div>

            {/* 7. Owner / Founder Information at the BOTTOM of Homepage */}
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                  👑 Founder Profile & Credentials
                </span>
                <span className="text-xs font-bold text-slate-400">
                  • Deep Help Leadership
                </span>
              </div>
              <FounderCard
                onOpenNotices={() => setActiveTab('notices')}
                onOpenPostNoticeModal={() => setIsPostNoticeOpen(true)}
                founderPhoto={founderPhoto}
                onOpenPhotoModal={() => setIsUploadPhotoModalOpen(true)}
              />
            </div>
          </div>
        )}

        {/* Dedicated Community & Feedback Tab */}
        {(activeTab === 'community' || activeTab === 'feedback') && (
          <CommunityFeedback
            stats={visitorStats}
            visitorStats={visitorStats}
            comments={communityComments}
            feedbacks={feedbackItems}
            onToggleLike={handleToggleLike}
            onAddComment={handleAddComment}
            onLikeComment={handleLikeComment}
            onReplyComment={handleReplyComment}
            onOpenFeedbackModal={() => setIsFeedbackModalOpen(true)}
            onVoteHelpfulFeedback={handleVoteHelpfulFeedback}
            founderEmail={founderEmail}
          />
        )}

        {/* Dedicated About Me / Founder Tab */}
        {(activeTab === 'about' || activeTab === 'founder') && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <FounderCard
              onOpenNotices={() => setActiveTab('notices')}
              onOpenPostNoticeModal={() => setIsPostNoticeOpen(true)}
              founderPhoto={founderPhoto}
              onOpenPhotoModal={() => setIsUploadPhotoModalOpen(true)}
            />
          </div>
        )}

        {/* ================= FUNCTIONAL HUBS ================= */}
        {/* 1. Study Section Hub with PYQs and Practical Uploads */}
        {(activeTab === 'study' ||
          activeTab === 'pyqs' ||
          activeTab === 'academic-uploads' ||
          activeTab === 'practicals') && (
          <StudyHub
            initialSubTab={
              activeTab === 'pyqs'
                ? 'pyqs'
                : activeTab === 'practicals' || activeTab === 'academic-uploads'
                ? 'academic-uploads'
                : studyInitialSubTab
            }
            onNavigateToCalculator={(calcId) => {
              setActiveTab(calcId as any);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* 2. Engineering Calculators Hub */}
        {(activeTab === 'calculators' || activeTab === 'steel' || activeTab === 'mix') && (
          <CalculatorsHub
            initialTool={
              activeTab === 'steel'
                ? 'steel'
                : activeTab === 'mix'
                ? 'csa'
                : undefined
            }
            onSaveCalculation={handleSaveCalculation}
            onOpenReport={handleOpenReport}
          />
        )}

        {/* 3. Design Tools Hub */}
        {(activeTab === 'design' ||
          activeTab === 'column' ||
          activeTab === 'slab' ||
          activeTab === 'footing' ||
          activeTab === 'rate') && (
          <DesignToolsHub
            initialTool={
              activeTab === 'column'
                ? 'column'
                : activeTab === 'slab'
                ? 'slab'
                : activeTab === 'footing'
                ? 'footing'
                : activeTab === 'rate'
                ? 'rate'
                : undefined
            }
            onSaveCalculation={handleSaveCalculation}
            onOpenReport={handleOpenReport}
          />
        )}

        {/* 4. Estimation & Costing Hub */}
        {activeTab === 'estimation' && (
          <EstimationCostingHub
            onSaveCalculation={handleSaveCalculation}
            onOpenReport={handleOpenReport}
          />
        )}

        {/* 5. Surveying Tools Hub */}
        {(activeTab === 'survey' || activeTab === 'surveying') && (
          <SurveyingHub
            onSaveCalculation={handleSaveCalculation}
            onOpenReport={handleOpenReport}
          />
        )}

        {/* 6. Career & Exam Alerts Hub */}
        {activeTab === 'career' && <CareerHub />}

        {/* 7. AI Features Hub */}
        {activeTab === 'ai-tools' && <AIFeaturesHub />}

        {/* ================= DIRECT MODULE ROUTES ================= */}
        {activeTab === 'concrete' && (
          <ConcreteCalculator
            onSaveCalculation={handleSaveCalculation}
            onOpenReport={handleOpenReport}
          />
        )}

        {activeTab === 'brick' && (
          <BrickCalculator
            onSaveCalculation={handleSaveCalculation}
            onOpenReport={handleOpenReport}
          />
        )}

        {activeTab === 'cost' && (
          <BuildingCostEstimator
            onSaveCalculation={handleSaveCalculation}
            onOpenReport={handleOpenReport}
          />
        )}

        {(activeTab === 'unit' || activeTab === 'converter') && <UnitConverter />}

        {activeTab === 'beam' && (
          <BeamCalculator
            onSaveCalculation={handleSaveCalculation}
            onOpenReport={handleOpenReport}
          />
        )}

        {activeTab === 'tank' && (
          <WaterTankCalculator
            onSaveCalculation={handleSaveCalculation}
            onOpenReport={handleOpenReport}
          />
        )}

        {(activeTab === 'scientific' || activeTab === 'calculator') && (
          <ScientificCalculator
            onSaveCalculation={handleSaveCalculation}
            onOpenReport={handleOpenReport}
          />
        )}

        {(activeTab === 'formula' || activeTab === 'formulas') && <FormulaLibrary />}

        {(activeTab === 'quiz' || activeTab === 'quiz-manage') && <QuizManagement />}

        {/* Dedicated Notice Board & Circulars Tab */}
        {activeTab === 'notices' && (
          <NoticeBoard
            notices={notices}
            readNoticeIds={readNoticeIds}
            onMarkAsRead={handleMarkNoticeAsRead}
            onMarkAllAsRead={handleMarkAllNoticesAsRead}
            onOpenShareModal={(notice) => setSelectedShareNotice(notice)}
            onOpenPostNoticeModal={() => setIsPostNoticeOpen(true)}
            onOpenAboutFounder={() => setIsAboutFounderOpen(true)}
            founderPhoto={founderPhoto}
          />
        )}
        </ErrorBoundary>

        {/* Floating Real-Time Status & Like Capsule */}
        <FloatingLiveLikeBar
          activeOnline={visitorStats.activeOnline}
          totalLikes={visitorStats.totalLikes}
          userHasLiked={visitorStats.userHasLiked}
          onToggleLike={handleToggleLike}
          onOpenLiveModal={() => setIsLiveModalOpen(true)}
          onOpenPrivacyModal={() => setIsPrivacyModalOpen(true)}
          language={language}
        />
      </main>

      {/* Footer with Founder & Contact Information */}
      <footer className="no-print mt-12 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Brand column */}
            <div className="md:col-span-4 space-y-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                  <HardHat className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <span className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Deep Help
                  </span>
                  <span className="text-xs text-amber-600 dark:text-amber-400 block font-bold">
                    Deep Help - Civil Engineering Hub
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Standardized, responsive computational toolkit for civil engineers, site managers, quantity surveyors, and engineering aspirants.
              </p>
              <div className="text-[11px] text-slate-400">
                Adheres to IS 456:2000, IS 10262:2019, IS 1077, and IS 1172 standards.
              </div>
            </div>

            {/* Founder & Contact Details Column */}
            <div className="md:col-span-5 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <UserCheck className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    Founder Information
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAboutFounderOpen(true)}
                  className="text-[11px] font-bold text-amber-600 dark:text-amber-400 hover:underline"
                >
                  View Full Profile →
                </button>
              </div>

              <div>
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  Er. Deepak Kumar
                </h4>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center space-x-1 mt-0.5">
                  <GraduationCap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>Diploma From GP Bhagalpur & B.Tech From Saharsa College of Engineering in Civil</span>
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
                <div className="flex items-center space-x-1.5 text-slate-600 dark:text-slate-300">
                  <Mail className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <a
                    href={`mailto:${founderEmail}`}
                    className="font-mono-calc font-semibold hover:text-amber-500"
                  >
                    {founderEmail}
                  </a>
                </div>

                <a
                  id="footer-facebook-link"
                  href={founderFacebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 font-bold text-[#1877F2] hover:underline"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span>Facebook Profile</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Quick Links Column */}
            <div className="md:col-span-3 space-y-2 text-xs">
              <span className="font-bold uppercase tracking-wider text-slate-400 block text-[11px]">
                Engineering Modules
              </span>
              <div className="grid grid-cols-2 gap-1.5 text-slate-600 dark:text-slate-400">
                <button
                  type="button"
                  onClick={() => setActiveTab('concrete')}
                  className="text-left hover:text-amber-500 transition-colors"
                >
                  Concrete Mix
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('brick')}
                  className="text-left hover:text-amber-500 transition-colors"
                >
                  Brick Masonry
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('cost')}
                  className="text-left hover:text-amber-500 transition-colors"
                >
                  Cost Estimator
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('unit')}
                  className="text-left hover:text-amber-500 transition-colors"
                >
                  Unit Converter
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('survey')}
                  className="text-left hover:text-amber-500 transition-colors"
                >
                  Surveying Book
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('beam')}
                  className="text-left hover:text-amber-500 transition-colors"
                >
                  Beam Reactions
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('tank')}
                  className="text-left hover:text-amber-500 transition-colors"
                >
                  Water Tank
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('scientific')}
                  className="text-left hover:text-amber-500 transition-colors"
                >
                  Scientific Calc
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('quiz')}
                  className="text-left hover:text-amber-500 transition-colors"
                >
                  Civil Quiz
                </button>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span>© {new Date().getFullYear()} <strong>Deep Help - Civil Engineering Hub</strong>. Founded by <strong>Er. Deepak Kumar</strong>.</span>
              <button
                type="button"
                onClick={() => setIsLiveModalOpen(true)}
                className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 hover:bg-emerald-500/20 transition-colors cursor-pointer"
                title="View Real-Time Live Engineers"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{visitorStats.activeOnline} Active Live Now</span>
              </button>
            </div>
            <div className="flex items-center space-x-3 text-[11px]">
              <button
                type="button"
                onClick={() => setIsPrivacyModalOpen(true)}
                className="hover:text-amber-500 flex items-center space-x-1 cursor-pointer font-bold text-slate-700 dark:text-slate-300"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 inline" />
                <span>Privacy & Data Policy</span>
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => setIsAboutFounderOpen(true)}
                className="hover:text-amber-500 cursor-pointer"
              >
                About Me / Founder
              </button>
              <span>•</span>
              <a href={`mailto:${founderEmail}`} className="hover:text-amber-500">
                Contact Support
              </a>
              <span>•</span>
              <a
                href={founderFacebook}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-amber-500"
              >
                Facebook
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Report Modal */}
      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        reportData={reportModalData}
      />

      {/* History Modal */}
      <SavedCalculationsModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        savedCalculations={savedCalculations}
        onDeleteCalculation={handleDeleteCalculation}
        onClearAll={handleClearAllCalculations}
        onOpenReport={handleOpenReport}
      />

      {/* About Founder Modal */}
      <AboutFounderModal
        isOpen={isAboutFounderOpen}
        onClose={() => setIsAboutFounderOpen(false)}
        founderPhoto={founderPhoto}
        onOpenPhotoModal={() => setIsUploadPhotoModalOpen(true)}
      />

      {/* Upload / Change Founder Photo Modal */}
      <UploadFounderPhotoModal
        isOpen={isUploadPhotoModalOpen}
        onClose={() => setIsUploadPhotoModalOpen(false)}
        currentPhoto={founderPhoto}
        onSavePhoto={handleSaveFounderPhoto}
        onRemovePhoto={handleRemoveFounderPhoto}
      />

      {/* Community Feedback & Review Modal */}
      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        onSubmitFeedback={handleSubmitFeedback}
        founderEmail={founderEmail}
      />

      {/* Founder Post Notice & Link Modal */}
      <PostNoticeModal
        isOpen={isPostNoticeOpen}
        onClose={() => setIsPostNoticeOpen(false)}
        onPostNotice={handleCreateNotice}
        founderEmail={founderEmail}
      />

      {/* Notice Share Modal (WhatsApp, FB, Telegram, Email, Copy Link) */}
      <NoticeShareModal
        isOpen={selectedShareNotice !== null}
        onClose={() => setSelectedShareNotice(null)}
        notice={selectedShareNotice}
      />

      {/* Real-Time Live Active Engineers Viewer Modal */}
      <RealtimeLiveModal
        isOpen={isLiveModalOpen}
        onClose={() => setIsLiveModalOpen(false)}
        activeOnline={visitorStats.activeOnline}
        activeBreakdown={activeBreakdown}
        totalLikes={visitorStats.totalLikes}
        userHasLiked={visitorStats.userHasLiked}
        onToggleLike={handleToggleLike}
        totalVisits={visitorStats.totalVisits}
        yourCity={userCity}
        recentActivities={recentLiveActivities}
        language={language}
      />

      {/* Privacy & Data Protection Center Modal */}
      <PrivacyCenterModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        language={language}
      />

      {/* Universal Omni-Search Modal (All Tools, Topics, Formulas, IS Codes & PYQs) */}
      <GlobalSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onNavigate={handleSearchNavigate}
        initialQuery={searchModalInitialQuery}
      />
    </div>
  );
}
