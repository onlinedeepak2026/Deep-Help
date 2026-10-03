import React, { useState, useEffect } from 'react';
import {
  Compass,
  Sparkles,
  Award,
  HardHat,
  GraduationCap,
  ShieldCheck,
  Zap,
  ArrowRight,
  Landmark,
  Layers,
  ChevronRight,
} from 'lucide-react';

interface StylishIntroAnimationProps {
  onComplete: () => void;
  forceShow?: boolean;
}

export const StylishIntroAnimation: React.FC<StylishIntroAnimationProps> = ({
  onComplete,
  forceShow = false,
}) => {
  const [stage, setStage] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [isExiting, setIsExiting] = useState<boolean>(false);

  useEffect(() => {
    // If not forced and already shown in this session, skip
    if (!forceShow) {
      try {
        const seen = sessionStorage.getItem('deephelp_intro_seen');
        if (seen === 'true') {
          onComplete();
          return;
        }
      } catch {
        // Safe fallback
      }
    }

    // Sequence stages
    const t1 = setTimeout(() => setStage(1), 100);  // Compass & Grid Reveal
    const t2 = setTimeout(() => setStage(2), 500);  // Brand Name & 3D Logo Reveal
    const t3 = setTimeout(() => setStage(3), 1100); // Founder & Education Reveal
    const t4 = setTimeout(() => setStage(4), 1700); // Capabilities Tags

    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2.5;
      });
    }, 55);

    // Auto dismiss after 2.8s
    const exitTimer = setTimeout(() => {
      handleDismiss();
    }, 2800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(exitTimer);
      clearInterval(progressInterval);
    };
  }, [forceShow]);

  const handleDismiss = () => {
    setIsExiting(true);
    try {
      sessionStorage.setItem('deephelp_intro_seen', 'true');
    } catch {
      // Safe fallback
    }
    setTimeout(() => {
      onComplete();
    }, 450);
  };

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950 text-white overflow-hidden transition-all duration-500 ${
        isExiting ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Blueprint Architectural Grid Background */}
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(245, 158, 11, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(245, 158, 11, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Radial Gold Glow Spotlight */}
      <div className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-amber-500/20 via-orange-500/15 to-transparent blur-3xl pointer-events-none animate-pulse" />

      {/* Top Controls: Skip Intro Button */}
      <div className="absolute top-6 right-6 z-20">
        <button
          type="button"
          onClick={handleDismiss}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold text-amber-200 backdrop-blur-md transition-all cursor-pointer shadow-lg active:scale-95"
        >
          <span>Skip Intro</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Intro Showcase Card */}
      <div className="relative z-10 max-w-xl w-full mx-4 p-8 text-center flex flex-col items-center">
        {/* Animated Compass Emblem */}
        <div
          className={`relative mb-6 transition-all duration-700 transform ${
            stage >= 1 ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-75 translate-y-4'
          }`}
        >
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 text-slate-950 flex items-center justify-center shadow-2xl shadow-amber-500/40 ring-4 ring-amber-400/30">
            <Compass className="w-14 h-14 sm:w-16 sm:h-16 stroke-[2.2] animate-spin-slow" />
          </div>

          {/* Glowing Badge */}
          <div className="absolute -bottom-2.5 -right-2 px-2.5 py-0.5 rounded-full bg-slate-900 border border-amber-400 text-amber-300 text-[10px] font-black uppercase tracking-wider shadow-md">
            IS Codal Pro
          </div>
        </div>

        {/* Brand Name Typography */}
        <div
          className={`space-y-2 transition-all duration-700 transform ${
            stage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight bg-gradient-to-r from-white via-amber-100 to-amber-400 bg-clip-text text-transparent drop-shadow-sm">
            DEEP HELP
          </h1>
          <p className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-amber-400/90">
            The Ultimate Civil Engineering Digital Hub
          </p>
        </div>

        {/* Founder & Academic Credentials (Requested by User) */}
        <div
          className={`mt-5 p-4 rounded-2xl bg-slate-900/80 border border-amber-500/30 backdrop-blur-md max-w-md w-full transition-all duration-700 transform ${
            stage >= 3 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
          }`}
        >
          <div className="flex items-center justify-center space-x-2 text-amber-400 text-xs font-black uppercase tracking-wider mb-1">
            <HardHat className="w-4 h-4" />
            <span>Founded by Er. Deepak Kumar</span>
          </div>

          <div className="flex items-center justify-center space-x-1.5 text-xs font-bold text-slate-200">
            <GraduationCap className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-amber-100 text-center text-[12px] leading-tight font-semibold">
              Diploma From GP Bhagalpur & B.Tech From Saharsa College of Engineering in Civil
            </span>
          </div>
        </div>

        {/* Feature Pills */}
        <div
          className={`flex flex-wrap items-center justify-center gap-2 mt-4 text-[11px] font-bold text-slate-300 transition-all duration-700 transform ${
            stage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
        >
          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-emerald-300 flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>30+ Civil Tools</span>
          </span>
          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sky-300 flex items-center space-x-1">
            <Landmark className="w-3.5 h-3.5" />
            <span>Automated Govt Job Feeds</span>
          </span>
          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-amber-300 flex items-center space-x-1">
            <Zap className="w-3.5 h-3.5" />
            <span>100% Crash-Proof Smooth</span>
          </span>
        </div>

        {/* Progress Loading Bar */}
        <div className="w-48 sm:w-64 mt-6">
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-300 rounded-full transition-all duration-100 ease-out shadow-lg shadow-amber-500/50"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold mt-1.5 px-1">
            <span>Loading Engineering Modules...</span>
            <span className="text-amber-400 font-mono">{Math.round(progress)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
