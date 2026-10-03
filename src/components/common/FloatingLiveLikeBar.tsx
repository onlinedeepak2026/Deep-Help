import React, { useState, useEffect } from 'react';
import {
  Heart,
  Radio,
  ShieldCheck,
  Wifi,
  WifiOff,
  Sparkles,
  ArrowUp,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface FloatingLiveLikeBarProps {
  activeOnline: number;
  totalLikes: number;
  userHasLiked: boolean;
  onToggleLike: () => void;
  onOpenLiveModal: () => void;
  onOpenPrivacyModal: () => void;
  language?: 'en' | 'hi';
}

export const FloatingLiveLikeBar: React.FC<FloatingLiveLikeBarProps> = ({
  activeOnline,
  totalLikes,
  userHasLiked,
  onToggleLike,
  onOpenLiveModal,
  onOpenPrivacyModal,
  language = 'hi',
}) => {
  const [isOnline, setIsOnline] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const isHindi = language === 'hi';

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLike = () => {
    onToggleLike();
    confetti({
      particleCount: 65,
      spread: 60,
      origin: { y: 0.85, x: 0.9 },
    });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <aside aria-label="Live Status & Quick Actions" className="fixed bottom-4 right-4 z-40 flex items-center space-x-2 select-none">
      {/* Offline Alert Indicator if disconnected */}
      {!isOnline && (
        <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-amber-500 text-slate-950 text-xs font-black shadow-lg animate-pulse">
          <WifiOff className="w-3.5 h-3.5" />
          <span>{isHindi ? 'ऑफलाइन मोड (फॉर्मूले सक्रिय)' : 'Offline Mode (Active)'}</span>
        </div>
      )}

      {/* Main Floating Pill Capsule */}
      <div className="flex items-center p-1.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-2xl space-x-1.5">
        {/* Live Active Button */}
        <button
          id="floating-live-btn"
          type="button"
          onClick={onOpenLiveModal}
          className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25 text-xs font-black transition-all cursor-pointer"
          title="Click to view real-time live active engineers"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-mono">{activeOnline}</span>
          <span className="hidden sm:inline">{isHindi ? 'लाइव' : 'Live'}</span>
        </button>

        {/* Real Page Like Button */}
        <button
          id="floating-like-btn"
          type="button"
          onClick={handleLike}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all transform active:scale-95 cursor-pointer ${
            userHasLiked
              ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
              : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30'
          }`}
          title={userHasLiked ? 'Liked! Click to toggle' : 'Like this Website Page'}
        >
          <Heart className={`w-3.5 h-3.5 ${userHasLiked ? 'fill-white' : 'text-rose-500'}`} />
          <span className="font-mono">{totalLikes.toLocaleString()}</span>
        </button>

        {/* Privacy Center Button */}
        <button
          id="floating-privacy-btn"
          type="button"
          onClick={onOpenPrivacyModal}
          className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title="Privacy & Data Protection Center"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
        </button>

        {/* Scroll To Top Button (shown on scroll) */}
        {showScrollTop && (
          <button
            id="floating-scroll-top-btn"
            type="button"
            onClick={scrollToTop}
            className="p-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-sm cursor-pointer"
            title="Scroll to top"
          >
            <ArrowUp className="w-4 h-4 stroke-[2.5]" />
          </button>
        )}
      </div>
    </aside>
  );
};
