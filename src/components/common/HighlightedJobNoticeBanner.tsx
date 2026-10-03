import React, { useState, useEffect } from 'react';
import {
  Bell,
  Landmark,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Clock,
  Building2,
  CheckCircle2,
} from 'lucide-react';
import { AUTOMATED_GOVT_JOBS, GovtJobNotice } from '../../data/govtJobsData';

interface HighlightedJobNoticeBannerProps {
  onOpenJobsTab: () => void;
  onOpenNoticesTab: () => void;
}

export const HighlightedJobNoticeBanner: React.FC<HighlightedJobNoticeBannerProps> = ({
  onOpenJobsTab,
  onOpenNoticesTab,
}) => {
  const [currentJobIndex, setCurrentJobIndex] = useState(0);

  // Filter hot / active jobs
  const featuredJobs = AUTOMATED_GOVT_JOBS.slice(0, 8);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentJobIndex((prev) => (prev + 1) % featuredJobs.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [featuredJobs.length]);

  const activeJob: GovtJobNotice = featuredJobs[currentJobIndex] || featuredJobs[0];

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 border-2 border-amber-500/50 shadow-md p-3 sm:p-4 transition-all">
      {/* Subtle pulsing background glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Live Alert Label & Cycling Job Info */}
        <div className="flex items-start sm:items-center space-x-3 overflow-hidden">
          {/* Animated Pulsing Icon */}
          <div className="relative shrink-0 mt-0.5 sm:mt-0">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md shadow-amber-500/30">
              <Landmark className="w-5 h-5 stroke-[2.3]" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500" />
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center space-x-1 text-[11px] font-black uppercase tracking-wider text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                <span>Live Govt Recruitment Alert</span>
              </span>

              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 hidden sm:inline">
                • 24/7 Automated Department Feed
              </span>
            </div>

            {/* Cycling Job Details */}
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
              <span className="font-extrabold text-slate-900 dark:text-white truncate">
                🏛️ {activeJob.department}:
              </span>
              <span className="font-semibold text-amber-700 dark:text-amber-300 truncate">
                {activeJob.title}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-extrabold text-[11px]">
                {activeJob.totalVacancies.toLocaleString()} Posts ({activeJob.eligibility})
              </span>
            </div>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center space-x-2 shrink-0 self-end md:self-center">
          <button
            type="button"
            onClick={onOpenJobsTab}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <span>View All Govt Vacancies</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>

          <button
            type="button"
            onClick={onOpenNoticesTab}
            className="inline-flex items-center space-x-1 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors cursor-pointer"
            title="Notice Board"
          >
            <Bell className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">Notice Board</span>
          </button>
        </div>
      </div>
    </div>
  );
};
