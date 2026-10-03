import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Calendar,
  ExternalLink,
  GraduationCap,
  Award,
  Search,
  Bell,
  Sparkles,
  ChevronRight,
  BookOpen,
  Filter,
  RefreshCw,
  Building2,
  CheckCircle2,
  Clock,
  Landmark,
  Radio,
  FileText,
  ShieldCheck,
  TrendingUp,
  MapPin,
} from 'lucide-react';
import { AUTOMATED_GOVT_JOBS, GovtJobNotice } from '../../data/govtJobsData';

export const CareerHub: React.FC = () => {
  const [jobs, setJobs] = useState<GovtJobNotice[]>(AUTOMATED_GOVT_JOBS);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedEligibility, setSelectedEligibility] = useState<string>('All');
  const [selectedState, setSelectedState] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeJob, setActiveJob] = useState<GovtJobNotice>(AUTOMATED_GOVT_JOBS[0]);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('Just now');
  const [syncMessage, setSyncMessage] = useState<string>('');
  const [autoSyncTimer, setAutoSyncTimer] = useState<number>(45);

  // Auto-fetch live feeds from server on load
  const fetchLiveJobFeeds = async (showNotice = false) => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/jobs/live-feed');
      if (res.ok) {
        const data = await res.json();
        if (data.jobs && Array.isArray(data.jobs) && data.jobs.length > 0) {
          setJobs(data.jobs);
          if (!activeJob) setActiveJob(data.jobs[0]);
        }
      }
      setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      if (showNotice) {
        setSyncMessage('✓ सभी सरकारी विभागों (CPWD, RRB, BTSC, BPSC, UPPSC, RSMSSB, DDA, NBCC) की लाइव भर्तियां स्वतः सिंक हो गईं!');
        setTimeout(() => setSyncMessage(''), 4500);
      }
    } catch (err) {
      // Graceful offline fallback to comprehensive pre-loaded govt jobs
      setJobs(AUTOMATED_GOVT_JOBS);
    } finally {
      setIsSyncing(false);
      setAutoSyncTimer(45);
    }
  };

  useEffect(() => {
    fetchLiveJobFeeds(false);
  }, []);

  // Periodic auto-sync countdown ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setAutoSyncTimer((prev) => {
        if (prev <= 1) {
          fetchLiveJobFeeds(false);
          return 45;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleManualSync = () => {
    fetchLiveJobFeeds(true);
  };

  const categories = [
    { id: 'All', label: 'All Govt Depts (सभी विभाग)' },
    { id: 'Central', label: 'Central Govt (CPWD / MES / BRO / DDA)' },
    { id: 'Railway', label: 'Railways & Freight (RRB JE / DFCCIL)' },
    { id: 'State', label: 'State PSCs (BPSC / BTSC / UPPSC / RSMSSB)' },
    { id: 'PSU', label: 'PSUs (NBCC / NTPC / RITES / NHPC)' },
    { id: 'Metro', label: 'Metro Rail (DMRC / UPMRC / BMRCL)' },
  ];

  const states = [
    'All',
    'Pan India',
    'Bihar',
    'Uttar Pradesh',
    'Rajasthan',
    'Madhya Pradesh',
    'Delhi',
    'Maharashtra',
    'Jharkhand',
    'Haryana',
  ];

  const filteredJobs = jobs.filter((job) => {
    // Category Filter
    if (selectedCategory !== 'All' && job.departmentType !== selectedCategory) {
      return false;
    }

    // Eligibility Filter
    if (selectedEligibility !== 'All') {
      if (selectedEligibility === 'Diploma' && !job.eligibility.includes('Diploma')) return false;
      if (selectedEligibility === 'B.Tech' && !job.eligibility.includes('B.Tech')) return false;
    }

    // State Filter
    if (selectedState !== 'All') {
      if (selectedState === 'Pan India' && job.state) return false;
      if (selectedState !== 'Pan India' && job.state !== selectedState) return false;
    }

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = job.title.toLowerCase().includes(q) || job.titleHi.includes(q);
      const matchDept = job.department.toLowerCase().includes(q);
      const matchPost = job.postName.toLowerCase().includes(q);
      const matchState = job.state?.toLowerCase().includes(q);
      const matchHighlights = job.keyHighlights.some((h) => h.toLowerCase().includes(q));
      if (!matchTitle && !matchDept && !matchPost && !matchState && !matchHighlights) {
        return false;
      }
    }

    return true;
  });

  const getDeptBadgeColor = (type: GovtJobNotice['departmentType']) => {
    switch (type) {
      case 'Central':
        return 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30';
      case 'Railway':
        return 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-400 border-indigo-500/30';
      case 'State':
        return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30';
      case 'PSU':
        return 'bg-sky-500/15 text-sky-700 dark:text-sky-400 border-sky-500/30';
      case 'Metro':
        return 'bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/30';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Automated Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-transparent border border-amber-500/30 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="p-1.5 px-2.5 rounded-full bg-amber-500 text-slate-950 text-xs font-black uppercase flex items-center space-x-1.5">
              <Landmark className="w-3.5 h-3.5" />
              <span>Government Civil Recruitment Portal</span>
            </span>

            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 text-xs font-black border border-emerald-500/30 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>📡 Automatic 24/7 Govt Portal Sync: Active</span>
            </span>

            <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              Auto-refresh in {autoSyncTimer}s
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-2">
            Automatic Civil Engineering Government Job Notifications
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
            सभी सरकारी विभागों (CPWD, MES, BRO, RRB JE, DFCCIL, State PWD, Irrigation, BPSC, BTSC, UPPSC, UPSSSC, RSMSSB, NBCC, NHAI, DMRC) की
            आधिकारिक सिविल इंजीनियरिंग नियुक्तियां, पद संख्या, योग्यता एवं आवेदन लिंक स्वतः लाइव अपडेट होते हैं।
          </p>
        </div>

        {/* Live Sync CTA */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 shrink-0">
          <div className="text-[11px] text-slate-500 dark:text-slate-400 text-right">
            <span>Last Sync: <strong>{lastSyncTime}</strong></span>
          </div>

          <button
            type="button"
            onClick={handleManualSync}
            disabled={isSyncing}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-md active:scale-95 disabled:opacity-60 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Auto-Sync Govt Feeds (सिंक करें)'}</span>
          </button>
        </div>
      </div>

      {syncMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{syncMessage}</span>
        </div>
      )}

      {/* Filter Bar: Categories, State, Eligibility & Search */}
      <div className="space-y-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by department, post, state, or exam..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            {/* State Filter */}
            <div className="flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-hidden cursor-pointer"
              >
                {states.map((st) => (
                  <option key={st} value={st}>
                    {st === 'All' ? 'All States (सभी राज्य)' : st}
                  </option>
                ))}
              </select>
            </div>

            {/* Eligibility Filter */}
            <div className="flex items-center space-x-1 w-full md:w-auto">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0 mr-1">
                योग्यता:
              </span>
              {['All', 'Diploma', 'B.Tech'].map((el) => (
                <button
                  key={el}
                  type="button"
                  onClick={() => setSelectedEligibility(el)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedEligibility === el
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-black shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {el === 'All' ? 'All' : el}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Department Type Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none pt-2 border-t border-slate-100 dark:border-slate-800">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Left Jobs List + Right Detail Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Job Cards */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 px-1">
            <span>Showing {filteredJobs.length} Live Department Vacancies</span>
            <span className="text-emerald-600 dark:text-emerald-400">● 100% Direct Official Govt Portals</span>
          </div>

          {filteredJobs.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
              <Briefcase className="w-10 h-10 mx-auto text-slate-400 mb-2" />
              <p className="text-sm font-bold text-slate-800 dark:text-white">
                No government recruitment matches current filter
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedEligibility('All');
                  setSelectedState('All');
                  setSearchQuery('');
                }}
                className="mt-3 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="space-y-3 max-h-[780px] overflow-y-auto pr-1">
              {filteredJobs.map((job) => {
                const isSelected = activeJob.id === job.id;
                return (
                  <div
                    key={job.id}
                    onClick={() => setActiveJob(job)}
                    className={`p-4 rounded-3xl border transition-all cursor-pointer relative overflow-hidden group ${
                      isSelected
                        ? 'bg-white dark:bg-slate-900 border-amber-500 shadow-md ring-2 ring-amber-500/20'
                        : 'bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 hover:border-amber-400'
                    }`}
                  >
                    {/* Top Badges */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span
                        className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${getDeptBadgeColor(
                          job.departmentType
                        )}`}
                      >
                        {job.departmentType} {job.state ? `• ${job.state}` : ''}
                      </span>

                      {job.isHot && (
                        <span className="text-[10px] font-black text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20 flex items-center space-x-1">
                          <TrendingUp className="w-3 h-3" />
                          <span>Mega Recruitment</span>
                        </span>
                      )}
                    </div>

                    {/* Department Name */}
                    <div className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center space-x-1">
                      <Building2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span className="truncate">{job.department}</span>
                    </div>

                    {/* Job Title */}
                    <h3 className="text-sm font-black text-slate-900 dark:text-white mt-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-2">
                      {job.title}
                    </h3>

                    {/* Meta row: Vacancies & Eligibility */}
                    <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[11px] font-bold">
                      <span className="text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                        👥 {job.totalVacancies.toLocaleString()} Posts
                      </span>
                      <span className="text-sky-700 dark:text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-md">
                        🎓 {job.eligibility}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400 ml-auto flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{job.applicationDeadline}</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Detailed Notice Breakdown */}
        <div className="lg:col-span-7">
          {activeJob ? (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 sticky top-24">
              {/* Header */}
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span
                    className={`text-xs font-black uppercase px-3 py-1 rounded-full border ${getDeptBadgeColor(
                      activeJob.departmentType
                    )}`}
                  >
                    {activeJob.departmentType} Government • {activeJob.state || 'Pan India'}
                  </span>

                  <span className="text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-500/15 px-3 py-1 rounded-full border border-amber-500/30">
                    Status: {activeJob.status}
                  </span>
                </div>

                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  {activeJob.title}
                </h2>
                <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold mt-0.5">
                  {activeJob.titleHi}
                </p>
                <div className="text-xs font-bold text-slate-600 dark:text-slate-400 mt-1 flex items-center space-x-1.5">
                  <Building2 className="w-4 h-4 text-amber-500" />
                  <span>{activeJob.department}</span>
                </div>
              </div>

              {/* Quick Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Total Vacancies
                  </div>
                  <div className="text-base font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {activeJob.totalVacancies.toLocaleString()}
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Qualification
                  </div>
                  <div className="text-xs font-black text-sky-600 dark:text-sky-400 mt-0.5 truncate">
                    {activeJob.eligibility}
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Deadline
                  </div>
                  <div className="text-xs font-black text-rose-600 dark:text-rose-400 mt-0.5 truncate">
                    {activeJob.applicationDeadline}
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Exam Schedule
                  </div>
                  <div className="text-xs font-black text-purple-600 dark:text-purple-400 mt-0.5 truncate">
                    {activeJob.examDate}
                  </div>
                </div>
              </div>

              {/* Salary & Pay Details */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Official Pay Scale & Allowances (वेतनमान)
                </div>
                <div className="text-sm font-black text-slate-900 dark:text-white">
                  {activeJob.salary}
                </div>
              </div>

              {/* Key Department Highlights */}
              <div className="space-y-2">
                <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-500" />
                  <span>Department Vacancy Breakup & Highlights:</span>
                </h4>
                <div className="space-y-1.5">
                  {activeJob.keyHighlights.map((hl, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800 flex items-start space-x-2"
                    >
                      <span className="text-amber-500 font-bold">•</span>
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons: Official Link & Direct Apply */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-3">
                <a
                  href={activeJob.applyOnlineUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:flex-1 inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-md cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Apply on Official Govt Portal (आवेदन करें)</span>
                </a>

                <a
                  href={activeJob.officialNotificationUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors border border-slate-200 dark:border-slate-700"
                >
                  <FileText className="w-4 h-4 text-amber-500" />
                  <span>Official Circular</span>
                </a>
              </div>

              {/* Founder Study Guidance Note */}
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-slate-700 dark:text-slate-300 flex items-start space-x-3">
                <ShieldCheck className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-700 dark:text-amber-400">
                    Er. Deepak Kumar's Preparation Advice:
                  </strong>
                  <p className="mt-0.5 text-[11px] leading-relaxed">
                    Make sure to practice Concrete Mix IS 10262, RCC IS 456 clauses, and Surveying leveling numericals directly in our Study Section & Formula Book. All previous year question papers for this exam are available in the PYQ tab.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
              <p className="text-xs text-slate-400">Select any government notification to view details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
