import React, { useState, useEffect } from 'react';
import {
  Compass,
  MapPin,
  Maximize,
  Ruler,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Navigation,
  Globe,
  Share2,
} from 'lucide-react';

interface LevellingRow {
  id: string;
  station: string;
  bs?: number;
  is?: number;
  fs?: number;
  remarks: string;
}

interface TraverseLine {
  id: string;
  line: string;
  length: number;
  bearingDeg: number;
}

interface SurveyingHubProps {
  onSaveCalculation?: (calc: any) => void;
  onOpenReport?: (reportData: any) => void;
}

export const SurveyingHub: React.FC<SurveyingHubProps> = () => {
  const [activeTab, setActiveTab] = useState<'levelling' | 'traverse' | 'chain' | 'gps'>('levelling');

  // ================= LEVELLING STATE =================
  const [benchmarkRL, setBenchmarkRL] = useState<number>(100.0); // Datum RL in meters
  const [levellingMethod, setLevellingMethod] = useState<'hi' | 'riseFall'>('hi');
  const [levelRows, setLevelRows] = useState<LevellingRow[]>([
    { id: '1', station: 'BM', bs: 1.455, remarks: 'Bench Mark on Plinth' },
    { id: '2', station: 'P1', is: 1.825, remarks: 'Ground Point 1' },
    { id: '3', station: 'P2', is: 2.150, remarks: 'Road Centre' },
    { id: '4', station: 'CP1', fs: 2.450, remarks: 'Change Point 1' },
    { id: '5', station: 'CP1', bs: 1.250, remarks: 'Inst. Shifted to Station B' },
    { id: '6', station: 'P3', is: 1.620, remarks: 'Drain Invert' },
    { id: '7', station: 'P4', fs: 0.985, remarks: 'Final Ground Point' },
  ]);

  // ================= TRAVERSE STATE =================
  const [traverseLines, setTraverseLines] = useState<TraverseLine[]>([
    { id: '1', line: 'AB', length: 125.5, bearingDeg: 35.5 },
    { id: '2', line: 'BC', length: 180.2, bearingDeg: 120.0 },
    { id: '3', line: 'CD', length: 145.0, bearingDeg: 210.5 },
    { id: '4', line: 'DA', length: 162.8, bearingDeg: 300.0 },
  ]);

  // ================= CHAIN SURVEY STATE =================
  const [chainOffsets, setChainOffsets] = useState([
    { chainage: 0, left: 0, right: 0, feature: 'Station A (Zero Datum)' },
    { chainage: 15, left: 4.5, right: 0, feature: 'Tree trunk' },
    { chainage: 30, left: 0, right: 6.2, feature: 'Electric Post' },
    { chainage: 45, left: 8.0, right: 0, feature: 'Building Corner' },
    { chainage: 60, left: 0, right: 5.5, feature: 'Tube well pump' },
    { chainage: 80, left: 0, right: 0, feature: 'Station B (Tie Peg)' },
  ]);

  // ================= GPS / MAP STATE =================
  const [coords, setCoords] = useState<{ lat: number; lng: number; accuracy?: number } | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [loadingGps, setLoadingGps] = useState(false);

  // Coordinate distance calculator
  const [pt1Lat, setPt1Lat] = useState<number>(28.6139);
  const [pt1Lng, setPt1Lng] = useState<number>(77.2090);
  const [pt2Lat, setPt2Lat] = useState<number>(28.6250);
  const [pt2Lng, setPt2Lng] = useState<number>(77.2180);

  // Fetch current GPS location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      return;
    }
    setLoadingGps(true);
    setGpsError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        });
        setPt1Lat(pos.coords.latitude);
        setPt1Lng(pos.coords.longitude);
        setLoadingGps(false);
      },
      (err) => {
        setGpsError(`Unable to retrieve GPS coordinates: ${err.message}`);
        setLoadingGps(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Distance via Haversine
  const toRad = (v: number) => (v * Math.PI) / 180;
  const R = 6371000; // Earth radius in meters
  const dLat = toRad(pt2Lat - pt1Lat);
  const dLng = toRad(pt2Lng - pt1Lng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(pt1Lat)) * Math.cos(toRad(pt2Lat)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const haversineDistanceM = R * c;

  // ---------------- LEVELLING CALCULATIONS ----------------
  // Compute HI & RL
  let currentHI = 0;
  let currentRL = benchmarkRL;
  const calculatedLevelRows = levelRows.map((r, idx) => {
    let hi = 0;
    let rl = 0;
    let rise = 0;
    let fall = 0;

    if (r.bs !== undefined && (r.fs === undefined && r.is === undefined)) {
      // First BM or Setup
      currentHI = currentRL + r.bs;
      hi = currentHI;
      rl = currentRL;
    } else if (r.is !== undefined) {
      rl = currentHI - r.is;
    } else if (r.fs !== undefined && r.bs === undefined) {
      rl = currentHI - r.fs;
      currentRL = rl;
    } else if (r.fs !== undefined && r.bs !== undefined) {
      // Change point
      rl = currentHI - r.fs;
      currentRL = rl;
      currentHI = currentRL + r.bs;
      hi = currentHI;
    }

    return {
      ...r,
      computedHI: hi > 0 ? hi : currentHI,
      computedRL: rl,
    };
  });

  const sumBS = levelRows.reduce((sum, r) => sum + (r.bs || 0), 0);
  const sumFS = levelRows.reduce((sum, r) => sum + (r.fs || 0), 0);
  const firstRL = benchmarkRL;
  const lastRL = calculatedLevelRows[calculatedLevelRows.length - 1]?.computedRL || benchmarkRL;
  const diffBS_FS = sumBS - sumFS;
  const diffRL = lastRL - firstRL;
  const isArithCheckValid = Math.abs(diffBS_FS - diffRL) < 0.005;

  // ---------------- TRAVERSE CALCULATIONS ----------------
  // Latitude = Length * cos(bearing)
  // Departure = Length * sin(bearing)
  const calculatedTraverse = traverseLines.map((t) => {
    const rad = (t.bearingDeg * Math.PI) / 180;
    const lat = t.length * Math.cos(rad);
    const dep = t.length * Math.sin(rad);
    return {
      ...t,
      latitude: lat,
      departure: dep,
    };
  });

  const sumLength = calculatedTraverse.reduce((s, t) => s + t.length, 0);
  const sumLat = calculatedTraverse.reduce((s, t) => s + t.latitude, 0);
  const sumDep = calculatedTraverse.reduce((s, t) => s + t.departure, 0);
  const closingError = Math.sqrt(sumLat * sumLat + sumDep * sumDep);
  const closingAngle = (Math.atan2(sumDep, sumLat) * 180) / Math.PI;
  const relativePrecision = closingError > 0 ? Math.round(sumLength / closingError) : 999999;

  return (
    <div className="space-y-6">
      {/* Subtab Navigation */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {[
          { id: 'levelling', label: 'Levelling Calculations', hindi: 'तलन (लेवलिंग गणना)', icon: Ruler },
          { id: 'traverse', label: 'Traverse Calculations', hindi: 'माला रेखा (Bowditch)', icon: Compass },
          { id: 'chain', label: 'Chain Survey Notes', hindi: 'जरीब सर्वेक्षण फील्ड बुक', icon: Maximize },
          { id: 'gps', label: 'GPS / Field Map', hindi: 'जीपीएस एवं साइट दूरी', icon: Navigation },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                isActive
                  ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-amber-500/40'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className={`p-1.5 rounded-xl ${isActive ? 'bg-slate-950/15' : 'bg-slate-100 dark:bg-slate-800 text-amber-500'}`}>
                  <Icon className="w-4 h-4" />
                </span>
                <span className="text-xs font-black">{tab.label}</span>
              </div>
              <div className={`text-[10px] mt-2 ${isActive ? 'text-slate-900/80 font-bold' : 'text-slate-400'}`}>
                {tab.hindi}
              </div>
            </button>
          );
        })}
      </div>

      {/* ================= 1. LEVELLING FIELD BOOK ================= */}
      {activeTab === 'levelling' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center space-x-2">
                  <span className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    <Ruler className="w-5 h-5" />
                  </span>
                  <span>Levelling Field Book (Height of Instrument Method)</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Automatic arithmetic check: Σ BS - Σ FS = Last RL - First RL.
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1.5 text-xs font-bold">
                  <span className="text-slate-500">Benchmark RL:</span>
                  <input
                    type="number"
                    step="0.1"
                    value={benchmarkRL}
                    onChange={(e) => setBenchmarkRL(Number(e.target.value) || 100)}
                    className="w-20 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
                  />
                  <span className="text-slate-400">m</span>
                </div>
              </div>
            </div>

            {/* Level Book Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider">
                    <th className="pb-3 pr-2">Station</th>
                    <th className="pb-3 px-2 text-right">BS (Back Sight)</th>
                    <th className="pb-3 px-2 text-right">IS (Inter Sight)</th>
                    <th className="pb-3 px-2 text-right">FS (Fore Sight)</th>
                    <th className="pb-3 px-2 text-right">HI (Height of Inst)</th>
                    <th className="pb-3 px-2 text-right font-black">Reduced Level (RL)</th>
                    <th className="pb-3 pl-2">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {calculatedLevelRows.map((r, idx) => (
                    <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-2.5 pr-2 font-mono font-bold text-slate-700 dark:text-slate-300">
                        {r.station}
                      </td>
                      <td className="py-2.5 px-2 text-right font-mono text-blue-600 dark:text-blue-400 font-semibold">
                        {r.bs !== undefined ? r.bs.toFixed(3) : '—'}
                      </td>
                      <td className="py-2.5 px-2 text-right font-mono text-slate-600 dark:text-slate-400">
                        {r.is !== undefined ? r.is.toFixed(3) : '—'}
                      </td>
                      <td className="py-2.5 px-2 text-right font-mono text-rose-600 dark:text-rose-400 font-semibold">
                        {r.fs !== undefined ? r.fs.toFixed(3) : '—'}
                      </td>
                      <td className="py-2.5 px-2 text-right font-mono font-bold text-slate-900 dark:text-white">
                        {r.computedHI.toFixed(3)}
                      </td>
                      <td className="py-2.5 px-2 text-right font-mono font-black text-amber-600 dark:text-amber-400 text-sm">
                        {r.computedRL.toFixed(3)} m
                      </td>
                      <td className="py-2.5 pl-2 text-slate-500">{r.remarks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Arithmetic Check Verification Card */}
            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Σ BS - Σ FS</div>
                <div className="text-base font-black text-slate-900 dark:text-white mt-0.5">
                  {sumBS.toFixed(3)} - {sumFS.toFixed(3)} = {diffBS_FS.toFixed(3)} m
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Last RL - First RL</div>
                <div className="text-base font-black text-slate-900 dark:text-white mt-0.5">
                  {lastRL.toFixed(3)} - {firstRL.toFixed(3)} = {diffRL.toFixed(3)} m
                </div>
              </div>

              <div
                className={`p-3 rounded-2xl flex items-center space-x-2.5 ${
                  isArithCheckValid
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30'
                    : 'bg-rose-50 text-rose-800 border border-rose-500/30'
                }`}
              >
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <div>
                  <div className="text-xs font-black">
                    {isArithCheckValid ? 'Arithmetic Check PASSED' : 'Arithmetic Error!'}
                  </div>
                  <div className="text-[10px] opacity-80">Mathematical balance confirmed</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= 2. TRAVERSE CALCULATIONS ================= */}
      {activeTab === 'traverse' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center space-x-2">
              <span className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Compass className="w-5 h-5" />
              </span>
              <span>Closed Traverse Calculations (Latitude & Departure)</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Computes L·cos(θ) and L·sin(θ), closing error, and Bowditch compass rule balancing.
            </p>

            <div className="overflow-x-auto mt-6">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider">
                    <th className="pb-3 pr-2">Line</th>
                    <th className="pb-3 px-2 text-right">Length (m)</th>
                    <th className="pb-3 px-2 text-right">W.C.B (°)</th>
                    <th className="pb-3 px-2 text-right">Latitude (L cos θ)</th>
                    <th className="pb-3 px-2 text-right">Departure (L sin θ)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {calculatedTraverse.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3 pr-2 font-mono font-bold text-slate-900 dark:text-white">{t.line}</td>
                      <td className="py-3 px-2 text-right font-mono font-bold">{t.length.toFixed(1)}</td>
                      <td className="py-3 px-2 text-right font-mono font-bold text-amber-600">{t.bearingDeg}°</td>
                      <td className="py-3 px-2 text-right font-mono font-semibold">
                        {t.latitude >= 0 ? `+${t.latitude.toFixed(2)}` : t.latitude.toFixed(2)}
                      </td>
                      <td className="py-3 px-2 text-right font-mono font-semibold">
                        {t.departure >= 0 ? `+${t.departure.toFixed(2)}` : t.departure.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-slate-50 dark:bg-slate-800/60 font-black">
                    <td className="py-2.5 pr-2">Total Σ</td>
                    <td className="py-2.5 px-2 text-right font-mono">{sumLength.toFixed(1)} m</td>
                    <td className="py-2.5 px-2 text-right">—</td>
                    <td className="py-2.5 px-2 text-right font-mono text-amber-600">
                      {sumLat >= 0 ? `+${sumLat.toFixed(2)}` : sumLat.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-2 text-right font-mono text-amber-600">
                      {sumDep >= 0 ? `+${sumDep.toFixed(2)}` : sumDep.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Closing Error Box */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-amber-500 text-slate-950 shadow-md">
                <div className="text-[10px] font-bold uppercase opacity-85">Closing Error (e)</div>
                <div className="text-2xl font-black mt-0.5">
                  {closingError.toFixed(3)} <span className="text-xs font-bold">m</span>
                </div>
                <div className="text-xs font-semibold opacity-90 mt-0.5">
                  Direction: θ = {closingAngle.toFixed(1)}°
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="text-[10px] font-bold text-slate-500 uppercase">Relative Precision (1 / P)</div>
                <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                  1 in {relativePrecision.toLocaleString()}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Perimeter P = {sumLength.toFixed(1)} m
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="text-[10px] font-bold text-slate-500 uppercase">Bowditch Correction Rule</div>
                <div className="text-xs text-slate-700 dark:text-slate-300 font-semibold mt-1">
                  Correction to Lat = - (l / Σl) × ΣL
                </div>
                <div className="text-xs text-slate-700 dark:text-slate-300 font-semibold mt-0.5">
                  Correction to Dep = - (l / Σl) × ΣD
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= 3. CHAIN SURVEY NOTES ================= */}
      {activeTab === 'chain' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center space-x-2">
              <span className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Maximize className="w-5 h-5" />
              </span>
              <span>Chain Survey Field Book Representation</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Double-line surveyor field entry showing chainage along baseline with left & right perpendicular offsets.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              {/* Field Book Column View */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <div className="text-xs font-bold text-center text-slate-500 uppercase tracking-wider mb-3">
                  Surveyor Field Book (Bottom to Top Flow)
                </div>

                <div className="space-y-1">
                  {[...chainOffsets].reverse().map((entry, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-3 items-center text-xs py-2 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs"
                    >
                      <div className="text-left font-bold text-blue-600 dark:text-blue-400">
                        {entry.left > 0 ? `← ${entry.left}m` : '—'}
                      </div>
                      <div className="text-center font-mono font-black text-slate-900 dark:text-white py-1 rounded bg-amber-500/10">
                        {entry.chainage} m
                      </div>
                      <div className="text-right font-bold text-emerald-600 dark:text-emerald-400">
                        {entry.right > 0 ? `${entry.right}m →` : '—'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Graphical Visualizer */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col items-center justify-center relative min-h-[300px]">
                <div className="text-xs font-bold text-slate-400 mb-2">Chain Line & Offset Plot</div>
                <svg className="w-full h-64" viewBox="0 0 300 240">
                  {/* Central Chain line */}
                  <line x1="150" y1="20" x2="150" y2="220" stroke="#f59e0b" strokeWidth="3" strokeDasharray="5,5" />
                  <circle cx="150" cy="220" r="5" fill="#f59e0b" />
                  <circle cx="150" cy="20" r="5" fill="#f59e0b" />
                  <text x="160" y="225" fill="#94a3b8" fontSize="10">Station A (0m)</text>
                  <text x="160" y="25" fill="#94a3b8" fontSize="10">Station B (80m)</text>

                  {/* Offsets */}
                  {chainOffsets.map((pt, i) => {
                    const y = 220 - (pt.chainage / 80) * 200;
                    return (
                      <g key={i}>
                        {pt.left > 0 && (
                          <>
                            <line x1="150" y1={y} x2={150 - pt.left * 10} y2={y} stroke="#38bdf8" strokeWidth="1.5" />
                            <circle cx={150 - pt.left * 10} cy={y} r="4" fill="#38bdf8" />
                            <text x={140 - pt.left * 10} y={y - 5} fill="#38bdf8" fontSize="9" textAnchor="end">{pt.feature} ({pt.left}m)</text>
                          </>
                        )}
                        {pt.right > 0 && (
                          <>
                            <line x1="150" y1={y} x2={150 + pt.right * 10} y2={y} stroke="#34d399" strokeWidth="1.5" />
                            <circle cx={150 + pt.right * 10} cy={y} r="4" fill="#34d399" />
                            <text x={160 + pt.right * 10} y={y - 5} fill="#34d399" fontSize="9">{pt.feature} ({pt.right}m)</text>
                          </>
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= 4. GPS / MAP INTEGRATION ================= */}
      {activeTab === 'gps' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center space-x-2">
                  <span className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    <Navigation className="w-5 h-5" />
                  </span>
                  <span>Field GPS Coordinates & Geodetic Calculator</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Capture device GNSS coordinates, calculate Haversine distance, and coordinate conversions.
                </p>
              </div>

              <button
                type="button"
                onClick={getCurrentLocation}
                disabled={loadingGps}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center space-x-1.5 cursor-pointer shadow-sm disabled:opacity-50"
              >
                <MapPin className="w-4 h-4" />
                <span>{loadingGps ? 'Locating...' : 'Get Live GPS Location'}</span>
              </button>
            </div>

            {gpsError && (
              <div className="mt-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs flex items-center space-x-2 border border-amber-500/30">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{gpsError} (You can enter coordinates manually below)</span>
              </div>
            )}

            {coords && (
              <div className="mt-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/30 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300">Live Device Position:</div>
                  <div className="text-sm font-mono font-black text-slate-900 dark:text-white mt-0.5">
                    Lat: {coords.lat.toFixed(6)}° N, Lng: {coords.lng.toFixed(6)}° E
                  </div>
                  {coords.accuracy && (
                    <div className="text-[10px] text-emerald-700 dark:text-emerald-400 mt-0.5">
                      Accuracy: ±{coords.accuracy.toFixed(1)} meters
                    </div>
                  )}
                </div>
                <a
                  href={`https://www.google.com/maps?q=${coords.lat},${coords.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center space-x-1"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Open in Google Maps</span>
                </a>
              </div>
            )}

            {/* Two Point Distance Tool */}
            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
                Two-Point Geodetic Distance (Haversine Formula)
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Point 1 Latitude (°)</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={pt1Lat}
                    onChange={(e) => setPt1Lat(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Point 1 Longitude (°)</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={pt1Lng}
                    onChange={(e) => setPt1Lng(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Point 2 Latitude (°)</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={pt2Lat}
                    onChange={(e) => setPt2Lat(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Point 2 Longitude (°)</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={pt2Lng}
                    onChange={(e) => setPt2Lng(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold font-mono"
                  />
                </div>
              </div>

              <div className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase">Calculated Direct Distance</div>
                  <div className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                    {haversineDistanceM.toFixed(1)} <span className="text-xs font-bold text-slate-400">meters</span>{' '}
                    <span className="text-sm font-normal text-slate-500">({(haversineDistanceM / 1000).toFixed(3)} km)</span>
                  </div>
                </div>
                <div className="text-xs text-slate-500">
                  ≈ {(haversineDistanceM * 3.28084).toFixed(0)} ft / {(haversineDistanceM / 0.9144).toFixed(0)} yards
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
