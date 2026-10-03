import React, { useState } from 'react';
import {
  Compass,
  Square,
  Columns,
  Maximize2,
  Receipt,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Printer,
  ChevronRight,
  Info,
} from 'lucide-react';

interface DesignToolsHubProps {
  initialTool?: 'beam' | 'column' | 'slab' | 'footing' | 'rate';
  onSaveCalculation?: (calc: any) => void;
  onOpenReport?: (reportData: any) => void;
}

export const DesignToolsHub: React.FC<DesignToolsHubProps> = ({
  initialTool = 'beam',
}) => {
  const [activeTool, setActiveTool] = useState<'beam' | 'column' | 'slab' | 'footing' | 'rate'>(initialTool);

  // ================= BEAM DESIGN STATE =================
  const [beamSpan, setBeamSpan] = useState<number>(5.0); // m
  const [beamWidth, setBeamWidth] = useState<number>(250); // mm
  const [beamDepth, setBeamDepth] = useState<number>(450); // mm
  const [beamCover, setBeamCover] = useState<number>(25); // mm
  const [beamLiveLoad, setBeamLiveLoad] = useState<number>(15); // kN/m
  const [beamDeadLoad, setBeamDeadLoad] = useState<number>(10); // kN/m (excluding self weight)
  const [beamFck, setBeamFck] = useState<number>(25); // M25
  const [beamFy, setBeamFy] = useState<number>(500); // Fe500

  // ================= COLUMN DESIGN STATE =================
  const [colLoadPu, setColLoadPu] = useState<number>(1200); // Factored axial load kN
  const [colLengthL, setColLengthL] = useState<number>(3.0); // m
  const [colWidthB, setColWidthB] = useState<number>(300); // mm
  const [colDepthD, setColDepthD] = useState<number>(450); // mm
  const [colFck, setColFck] = useState<number>(25);
  const [colFy, setColFy] = useState<number>(500);

  // ================= SLAB DESIGN STATE =================
  const [slabLx, setSlabLx] = useState<number>(3.5); // shorter span m
  const [slabLy, setSlabLy] = useState<number>(5.0); // longer span m
  const [slabLiveLoad, setSlabLiveLoad] = useState<number>(3.0); // kN/m2
  const [slabFloorFinish, setSlabFloorFinish] = useState<number>(1.0); // kN/m2
  const [slabFck, setSlabFck] = useState<number>(20);
  const [slabFy, setSlabFy] = useState<number>(415);

  // ================= FOOTING DESIGN STATE =================
  const [footingColLoad, setFootingColLoad] = useState<number>(800); // Service load kN
  const [footingSbc, setFootingSbc] = useState<number>(200); // kN/m2 SBC of soil
  const [footingColB, setFootingColB] = useState<number>(300); // mm
  const [footingColD, setFootingColD] = useState<number>(400); // mm
  const [footingFck, setFootingFck] = useState<number>(25);
  const [footingFy, setFootingFy] = useState<number>(500);

  // ================= RATE ANALYSIS STATE =================
  const [rateItem, setRateItem] = useState<'rcc' | 'brickwork' | 'plaster'>('rcc');
  const [cementRate, setCementRate] = useState<number>(380); // ₹/bag
  const [sandRate, setSandRate] = useState<number>(55); // ₹/cft
  const [aggRate, setAggRate] = useState<number>(65); // ₹/cft
  const [brickRate, setBrickRate] = useState<number>(9.5); // ₹/brick
  const [masonWage, setMasonWage] = useState<number>(900); // ₹/day
  const [laborWage, setLaborWage] = useState<number>(550); // ₹/day

  // ------------------ BEAM CALCULATIONS (IS 456:2000) ------------------
  const effDepth = beamDepth - beamCover; // mm
  const selfWeightPerM = (beamWidth / 1000) * (beamDepth / 1000) * 25; // 25 kN/m3 RCC
  const totalServiceLoad = beamLiveLoad + beamDeadLoad + selfWeightPerM;
  const factoredLoadWu = 1.5 * totalServiceLoad; // kN/m
  const factoredMomentMu = (factoredLoadWu * beamSpan * beamSpan) / 8; // kNm
  const factoredShearVu = (factoredLoadWu * beamSpan) / 2; // kN

  const qLim = beamFy === 250 ? 0.148 : beamFy === 415 ? 0.138 : 0.133;
  const muLim = (qLim * beamFck * beamWidth * effDepth * effDepth) / 1e6; // kNm
  const isDoubly = factoredMomentMu > muLim;

  // Ast calculation (singly reinforced)
  const term = 1 - (4.6 * factoredMomentMu * 1e6) / (beamFck * beamWidth * effDepth * effDepth);
  const astRequired = term > 0
    ? (0.5 * beamFck * beamWidth * effDepth * (1 - Math.sqrt(term))) / beamFy
    : (0.04 * beamWidth * effDepth); // cap at 4%
  const minAst = (0.85 * beamWidth * effDepth) / beamFy;
  const finalAst = Math.max(astRequired, minAst);
  // Bar suggestions (using 16mm or 20mm)
  const area16 = (Math.PI / 4) * 16 * 16;
  const bars16Count = Math.ceil(finalAst / area16);

  // ------------------ COLUMN CALCULATIONS (IS 456:2000) ------------------
  const colAg = colWidthB * colDepthD; // mm2
  const emin = Math.max(20, (colLengthL * 1000) / 500 + colDepthD / 30);
  const isEminSafe = emin <= 0.05 * colDepthD;
  // Pu = 0.4*fck*Ac + 0.67*fy*Asc => Pu*1000 = 0.4*fck*(Ag - Asc) + 0.67*fy*Asc
  // Pu*1000 = 0.4*fck*Ag + Asc * (0.67*fy - 0.4*fck)
  const numerator = colLoadPu * 1000 - 0.4 * colFck * colAg;
  const denominator = 0.67 * colFy - 0.4 * colFck;
  let ascRequired = numerator > 0 ? numerator / denominator : (0.008 * colAg);
  const minAsc = 0.008 * colAg; // 0.8%
  const maxAsc = 0.04 * colAg; // 4.0%
  ascRequired = Math.max(ascRequired, minAsc);
  const colPt = (ascRequired / colAg) * 100;
  const colBars16 = Math.max(4, Math.ceil(ascRequired / area16));

  // ------------------ SLAB CALCULATIONS (IS 456:2000) ------------------
  const slabRatio = slabLy / slabLx;
  const isOneWay = slabRatio >= 2.0;
  // Estimated thickness D: Span / 28 for simply supported
  const estimatedSlabD = Math.max(125, Math.ceil((slabLx * 1000) / 28 / 5) * 5); // mm
  const slabSelfWeight = (estimatedSlabD / 1000) * 25; // kN/m2
  const totalSlabLoad = slabLiveLoad + slabFloorFinish + slabSelfWeight;
  const factoredSlabLoad = 1.5 * totalSlabLoad;
  // Shorter span moment
  const slabMu = isOneWay
    ? (factoredSlabLoad * slabLx * slabLx) / 8
    : 0.075 * factoredSlabLoad * slabLx * slabLx; // average 2-way moment coefficient
  const slabEffD = estimatedSlabD - 20; // 20mm cover
  const slabAstReq = (0.5 * slabFck * 1000 * slabEffD * (1 - Math.sqrt(Math.max(0, 1 - (4.6 * slabMu * 1e6) / (slabFck * 1000 * slabEffD * slabEffD))))) / slabFy;
  const slabMinAst = (0.12 / 100) * 1000 * estimatedSlabD; // 0.12% for Fe415/500
  const finalSlabAst = Math.max(slabAstReq, slabMinAst);
  // Spacing with 10mm bar
  const area10 = (Math.PI / 4) * 10 * 10;
  const mainBarSpacing = Math.min(300, 3 * slabEffD, Math.floor((area10 * 1000) / finalSlabAst));

  // ------------------ FOOTING CALCULATIONS (IS 456:2000) ------------------
  const totalFootingLoad = footingColLoad * 1.1; // 10% self weight
  const footingAreaReq = totalFootingLoad / footingSbc; // m2
  const footingSide = Math.ceil(Math.sqrt(footingAreaReq) * 10) / 10; // round up to 0.1m
  const actualArea = footingSide * footingSide;
  const netUpwardSoilPressure = (1.5 * footingColLoad) / actualArea; // kN/m2 factored
  const projection = (footingSide * 1000 - footingColD) / 2; // mm
  const footingMu = (netUpwardSoilPressure * (projection / 1000) * (projection / 1000) * footingSide) / 2; // kNm
  // Depth from flexure
  const footingReqD = Math.ceil(Math.sqrt((footingMu * 1e6) / (0.138 * footingFck * (footingSide * 1000))));
  const finalFootingTotalDepth = Math.max(350, footingReqD + 50); // 50mm cover
  const footingEffD = finalFootingTotalDepth - 50;
  const footingAst = (0.5 * footingFck * (footingSide * 1000) * footingEffD * (1 - Math.sqrt(Math.max(0, 1 - (4.6 * footingMu * 1e6) / (footingFck * (footingSide * 1000) * footingEffD * footingEffD))))) / footingFy;

  // ------------------ RATE ANALYSIS CALCULATIONS ------------------
  let rateAnalysisData = {
    title: 'RCC M20 (1:1.5:3) for 1 m³ (Including Shuttering & Labor)',
    materials: [
      { name: 'Cement (8.4 bags @ ₹' + cementRate + ')', cost: 8.4 * cementRate },
      { name: 'Sand (15.5 cft @ ₹' + sandRate + ')', cost: 15.5 * sandRate },
      { name: 'Coarse Aggregate 20mm (31 cft @ ₹' + aggRate + ')', cost: 31 * aggRate },
      { name: 'Steel Reinforcement (80 kg @ ₹68/kg)', cost: 80 * 68 },
      { name: 'Shuttering Allowance (Plywood & Props)', cost: 1200 },
    ],
    labor: [
      { name: 'Head Mason (0.1 @ ₹' + masonWage + ')', cost: 0.1 * masonWage },
      { name: 'Mason (0.6 @ ₹' + masonWage + ')', cost: 0.6 * masonWage },
      { name: 'Beldar / Laborer (2.5 @ ₹' + laborWage + ')', cost: 2.5 * laborWage },
      { name: 'Bhisti / Curing Water (0.5 @ ₹' + laborWage + ')', cost: 0.5 * laborWage },
    ]
  };

  if (rateItem === 'brickwork') {
    rateAnalysisData = {
      title: 'Brickwork in Cement Mortar 1:6 for 1 m³ (First Class Bricks)',
      materials: [
        { name: 'Bricks (500 Nos @ ₹' + brickRate + ')', cost: 500 * brickRate },
        { name: 'Cement (1.35 bags @ ₹' + cementRate + ')', cost: 1.35 * cementRate },
        { name: 'Sand (10.6 cft @ ₹' + sandRate + ')', cost: 10.6 * sandRate },
        { name: 'Scaffolding & Sundries', cost: 250 },
      ],
      labor: [
        { name: 'Head Mason (0.1 @ ₹' + masonWage + ')', cost: 0.1 * masonWage },
        { name: 'Mason (0.8 @ ₹' + masonWage + ')', cost: 0.8 * masonWage },
        { name: 'Beldar (1.4 @ ₹' + laborWage + ')', cost: 1.4 * laborWage },
        { name: 'Bhisti (0.4 @ ₹' + laborWage + ')', cost: 0.4 * laborWage },
      ]
    };
  } else if (rateItem === 'plaster') {
    rateAnalysisData = {
      title: '12mm Cement Plaster 1:4 for 10 m² Area',
      materials: [
        { name: 'Cement (1.08 bags @ ₹' + cementRate + ')', cost: 1.08 * cementRate },
        { name: 'Screened Sand (5.5 cft @ ₹' + sandRate + ')', cost: 5.5 * sandRate },
        { name: 'Scaffolding & Sundries', cost: 150 },
      ],
      labor: [
        { name: 'Mason (0.8 @ ₹' + masonWage + ')', cost: 0.8 * masonWage },
        { name: 'Beldar (1.0 @ ₹' + laborWage + ')', cost: 1.0 * laborWage },
        { name: 'Bhisti (0.5 @ ₹' + laborWage + ')', cost: 0.5 * laborWage },
      ]
    };
  }

  const matSubtotal = rateAnalysisData.materials.reduce((sum, item) => sum + item.cost, 0);
  const labSubtotal = rateAnalysisData.labor.reduce((sum, item) => sum + item.cost, 0);
  const primeCost = matSubtotal + labSubtotal;
  const waterCharges = primeCost * 0.015; // 1.5%
  const contractorProfit = (primeCost + waterCharges) * 0.10; // 10%
  const grandTotalRate = primeCost + waterCharges + contractorProfit;

  return (
    <div className="space-y-6">
      {/* Subtab Navigation */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {[
          { id: 'beam', label: 'Beam Design', hindi: 'बीम डिजाइन', icon: Maximize2 },
          { id: 'column', label: 'Column Design', hindi: 'कॉलम डिजाइन', icon: Columns },
          { id: 'slab', label: 'Slab Design', hindi: 'स्लैब डिजाइन', icon: Square },
          { id: 'footing', label: 'Footing Design', hindi: 'नींव (Footing)', icon: Compass },
          { id: 'rate', label: 'Rate Analysis', hindi: 'दर विश्लेषण (DSR)', icon: Receipt },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeTool === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTool(item.id as any)}
              className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                isActive
                  ? 'bg-amber-500 text-slate-950 border-amber-500 font-black shadow-md'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-amber-500/40'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Icon className="w-4 h-4" />
                <span className="text-xs font-bold">{item.label}</span>
              </div>
              <div className={`text-[10px] mt-1 ${isActive ? 'text-slate-900/80' : 'text-slate-400'}`}>
                {item.hindi}
              </div>
            </button>
          );
        })}
      </div>

      {/* ================= 1. BEAM DESIGN ================= */}
      {activeTool === 'beam' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center space-x-2">
              <span className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Maximize2 className="w-5 h-5" />
              </span>
              <span>IS 456:2000 Limit State Beam Design</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Computes factored moments, limiting moment Mu,lim, tension rebar Ast, and bar schedules.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Clear Span L (m)</label>
                <input
                  type="number"
                  step="0.1"
                  value={beamSpan}
                  onChange={(e) => setBeamSpan(Number(e.target.value) || 1)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Width b (mm)</label>
                <input
                  type="number"
                  step="25"
                  value={beamWidth}
                  onChange={(e) => setBeamWidth(Number(e.target.value) || 200)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Total Depth D (mm)</label>
                <input
                  type="number"
                  step="25"
                  value={beamDepth}
                  onChange={(e) => setBeamDepth(Number(e.target.value) || 300)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Live Load (kN/m)</label>
                <input
                  type="number"
                  value={beamLiveLoad}
                  onChange={(e) => setBeamLiveLoad(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Concrete Grade</label>
                <select
                  value={beamFck}
                  onChange={(e) => setBeamFck(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold"
                >
                  <option value={20}>M20 (fck = 20 MPa)</option>
                  <option value={25}>M25 (fck = 25 MPa)</option>
                  <option value={30}>M30 (fck = 30 MPa)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Steel Grade</label>
                <select
                  value={beamFy}
                  onChange={(e) => setBeamFy(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold"
                >
                  <option value={415}>Fe 415</option>
                  <option value={500}>Fe 500</option>
                  <option value={550}>Fe 550D</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Dead Load (kN/m)</label>
                <input
                  type="number"
                  value={beamDeadLoad}
                  onChange={(e) => setBeamDeadLoad(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold"
                />
              </div>
            </div>
          </div>

          {/* Beam Output Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-[11px] font-bold text-slate-500 uppercase">Factored Moment (Mu)</div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {factoredMomentMu.toFixed(2)} <span className="text-sm font-normal text-slate-400">kN·m</span>
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Factored load wu: {factoredLoadWu.toFixed(2)} kN/m
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-[11px] font-bold text-slate-500 uppercase">Limiting Moment (Mu,lim)</div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {muLim.toFixed(2)} <span className="text-sm font-normal text-slate-400">kN·m</span>
              </div>
              <div className={`text-xs font-bold mt-1 ${isDoubly ? 'text-rose-500' : 'text-emerald-500'}`}>
                {isDoubly ? 'Requires Doubly Reinforced' : 'Singly Reinforced (Safe)'}
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-amber-500 text-slate-950 shadow-md">
              <div className="text-[11px] font-bold uppercase tracking-wider opacity-85">Required Tension Steel (Ast)</div>
              <div className="text-2xl font-black mt-1">
                {Math.round(finalAst)} <span className="text-sm font-bold">mm²</span>
              </div>
              <div className="text-xs font-semibold mt-1">
                Provide: {bars16Count} Nos × 16mm Ø bars ({Math.round(bars16Count * area16)} mm²)
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-[11px] font-bold text-slate-500 uppercase">Shear Stirrups (2-Legged 8mm)</div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                @ {Math.min(300, Math.floor(0.75 * effDepth))} mm <span className="text-sm font-normal text-slate-400">c/c</span>
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Max Shear Vu: {factoredShearVu.toFixed(1)} kN
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= 2. COLUMN DESIGN ================= */}
      {activeTool === 'column' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center space-x-2">
              <span className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Columns className="w-5 h-5" />
              </span>
              <span>IS 456:2000 Short Axial Column Design</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Computes gross area, required vertical reinforcement Asc, minimum eccentricity check, and lateral ties.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Factored Axial Load Pu (kN)</label>
                <input
                  type="number"
                  value={colLoadPu}
                  onChange={(e) => setColLoadPu(Number(e.target.value) || 100)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Width b (mm)</label>
                <input
                  type="number"
                  value={colWidthB}
                  onChange={(e) => setColWidthB(Number(e.target.value) || 200)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Depth D (mm)</label>
                <input
                  type="number"
                  value={colDepthD}
                  onChange={(e) => setColDepthD(Number(e.target.value) || 200)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Unsupported Length L (m)</label>
                <input
                  type="number"
                  step="0.1"
                  value={colLengthL}
                  onChange={(e) => setColLengthL(Number(e.target.value) || 1)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-amber-500 text-slate-950 shadow-md">
              <div className="text-[11px] font-bold uppercase opacity-85">Longitudinal Steel (Asc)</div>
              <div className="text-2xl font-black mt-1">
                {Math.round(ascRequired)} <span className="text-sm font-bold">mm²</span>
              </div>
              <div className="text-xs font-semibold mt-1">
                Provide: {colBars16} Nos × 16mm Ø ({colPt.toFixed(2)}% steel)
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-[11px] font-bold text-slate-500 uppercase">Min Eccentricity (emin)</div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {emin.toFixed(1)} <span className="text-sm font-normal text-slate-400">mm</span>
              </div>
              <div className={`text-xs font-bold mt-1 ${isEminSafe ? 'text-emerald-500' : 'text-rose-500'}`}>
                {isEminSafe ? 'Safe (emin ≤ 0.05D)' : 'Biaxial Bending Exists'}
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-[11px] font-bold text-slate-500 uppercase">Lateral Ties (छल्ले)</div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                8mm Ø @ {Math.min(colWidthB, 16 * 16, 300)} mm
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Pitch = min(b, 16·dia, 300mm)
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-[11px] font-bold text-slate-500 uppercase">Gross Area (Ag)</div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {(colAg / 1000).toFixed(0)}k <span className="text-sm font-normal text-slate-400">mm²</span>
              </div>
              <div className="text-xs text-slate-500 mt-1">
                {colWidthB} × {colDepthD} mm rectangular
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= 3. SLAB DESIGN ================= */}
      {activeTool === 'slab' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center space-x-2">
              <span className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Square className="w-5 h-5" />
              </span>
              <span>IS 456:2000 Slab Design (One-Way & Two-Way)</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Checks aspect ratio Ly/Lx, estimates deflection thickness, and computes main and distribution rebar spacing.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Shorter Span Lx (m)</label>
                <input
                  type="number"
                  step="0.1"
                  value={slabLx}
                  onChange={(e) => setSlabLx(Number(e.target.value) || 1)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Longer Span Ly (m)</label>
                <input
                  type="number"
                  step="0.1"
                  value={slabLy}
                  onChange={(e) => setSlabLy(Number(e.target.value) || 1)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Live Load (kN/m²)</label>
                <input
                  type="number"
                  value={slabLiveLoad}
                  onChange={(e) => setSlabLiveLoad(Number(e.target.value) || 1)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Floor Finish (kN/m²)</label>
                <input
                  type="number"
                  value={slabFloorFinish}
                  onChange={(e) => setSlabFloorFinish(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-[11px] font-bold text-slate-500 uppercase">Slab Behavior (Ly / Lx)</div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {slabRatio.toFixed(2)}
              </div>
              <div className="text-xs font-bold text-amber-500 mt-1">
                {isOneWay ? 'One-Way Slab (Ly/Lx ≥ 2)' : 'Two-Way Slab (Ly/Lx < 2)'}
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-[11px] font-bold text-slate-500 uppercase">Slab Thickness (D)</div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {estimatedSlabD} <span className="text-sm font-normal text-slate-400">mm</span>
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Effective depth d = {slabEffD} mm
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-amber-500 text-slate-950 shadow-md">
              <div className="text-[11px] font-bold uppercase opacity-85">Main Reinforcement</div>
              <div className="text-2xl font-black mt-1">
                10mm Ø @ {mainBarSpacing} mm
              </div>
              <div className="text-xs font-semibold mt-1">
                Ast required: {Math.round(finalSlabAst)} mm²/m width
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-[11px] font-bold text-slate-500 uppercase">Distribution Steel</div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                8mm Ø @ {Math.min(200, Math.floor(((Math.PI / 4) * 64 * 1000) / slabMinAst))} mm
              </div>
              <div className="text-xs text-slate-500 mt-1">
                0.12% gross area ({Math.round(slabMinAst)} mm²/m)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= 4. FOOTING DESIGN ================= */}
      {activeTool === 'footing' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center space-x-2">
              <span className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Compass className="w-5 h-5" />
              </span>
              <span>Isolated Pad Footing Design</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Computes footing size based on Safe Bearing Capacity (SBC), net upward soil pressure, and flexural bottom mesh.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Column Load (kN)</label>
                <input
                  type="number"
                  value={footingColLoad}
                  onChange={(e) => setFootingColLoad(Number(e.target.value) || 100)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Soil SBC (kN/m²)</label>
                <input
                  type="number"
                  value={footingSbc}
                  onChange={(e) => setFootingSbc(Number(e.target.value) || 50)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Col Width (mm)</label>
                <input
                  type="number"
                  value={footingColB}
                  onChange={(e) => setFootingColB(Number(e.target.value) || 200)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Col Depth (mm)</label>
                <input
                  type="number"
                  value={footingColD}
                  onChange={(e) => setFootingColD(Number(e.target.value) || 200)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-amber-500 text-slate-950 shadow-md">
              <div className="text-[11px] font-bold uppercase opacity-85">Footing Plan Size (B × B)</div>
              <div className="text-2xl font-black mt-1">
                {footingSide.toFixed(1)} × {footingSide.toFixed(1)} <span className="text-sm font-bold">m</span>
              </div>
              <div className="text-xs font-semibold mt-1">
                Area: {actualArea.toFixed(2)} m² (Required: {footingAreaReq.toFixed(2)} m²)
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-[11px] font-bold text-slate-500 uppercase">Total Depth (D)</div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {finalFootingTotalDepth} <span className="text-sm font-normal text-slate-400">mm</span>
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Eff depth: {footingEffD} mm (50mm cover)
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-[11px] font-bold text-slate-500 uppercase">Bottom Mesh Rebar</div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                12mm Ø @ 150 mm
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Both ways bottom mesh (Ast: {Math.round(footingAst)} mm²)
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-[11px] font-bold text-slate-500 uppercase">Upward Pressure (qup)</div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {netUpwardSoilPressure.toFixed(1)} <span className="text-sm font-normal text-slate-400">kN/m²</span>
              </div>
              <div className="text-xs text-emerald-500 font-bold mt-1">
                Safe within soil capacity
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= 5. RATE ANALYSIS ================= */}
      {activeTool === 'rate' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center space-x-2">
                  <span className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    <Receipt className="w-5 h-5" />
                  </span>
                  <span>DSR Standard Rate Analysis</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  CPWD / State DSR methodology: Materials + Labor + 1.5% Water Charge + 10% Contractor Profit.
                </p>
              </div>

              {/* Item selection */}
              <div className="inline-flex p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setRateItem('rcc')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                    rateItem === 'rcc'
                      ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  RCC M20 (1 m³)
                </button>
                <button
                  type="button"
                  onClick={() => setRateItem('brickwork')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                    rateItem === 'brickwork'
                      ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Brickwork 1:6 (1 m³)
                </button>
                <button
                  type="button"
                  onClick={() => setRateItem('plaster')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                    rateItem === 'plaster'
                      ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Plaster 12mm (10 m²)
                </button>
              </div>
            </div>

            {/* Editable Unit Rates */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Cement (₹/bag)</label>
                <input
                  type="number"
                  value={cementRate}
                  onChange={(e) => setCementRate(Number(e.target.value) || 0)}
                  className="w-full px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Sand (₹/cft)</label>
                <input
                  type="number"
                  value={sandRate}
                  onChange={(e) => setSandRate(Number(e.target.value) || 0)}
                  className="w-full px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Agg (₹/cft)</label>
                <input
                  type="number"
                  value={aggRate}
                  onChange={(e) => setAggRate(Number(e.target.value) || 0)}
                  className="w-full px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Brick (₹/each)</label>
                <input
                  type="number"
                  step="0.5"
                  value={brickRate}
                  onChange={(e) => setBrickRate(Number(e.target.value) || 0)}
                  className="w-full px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Mason (₹/day)</label>
                <input
                  type="number"
                  value={masonWage}
                  onChange={(e) => setMasonWage(Number(e.target.value) || 0)}
                  className="w-full px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Laborer (₹/day)</label>
                <input
                  type="number"
                  value={laborWage}
                  onChange={(e) => setLaborWage(Number(e.target.value) || 0)}
                  className="w-full px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                />
              </div>
            </div>
          </div>

          {/* Breakdown Sheets */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h4 className="text-base font-black text-slate-900 dark:text-white mb-4">
              {rateAnalysisData.title}
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Materials */}
              <div>
                <div className="text-xs font-bold uppercase text-slate-400 mb-2">1. Materials Cost</div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {rateAnalysisData.materials.map((m, idx) => (
                    <div key={idx} className="py-2 flex items-center justify-between text-xs">
                      <span className="text-slate-700 dark:text-slate-300 font-semibold">{m.name}</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">
                        ₹{Math.round(m.cost).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                  <div className="py-2 flex items-center justify-between text-xs font-black text-amber-600">
                    <span>Materials Subtotal</span>
                    <span>₹{Math.round(matSubtotal).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Labor */}
              <div>
                <div className="text-xs font-bold uppercase text-slate-400 mb-2">2. Labor & Machinery Cost</div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {rateAnalysisData.labor.map((l, idx) => (
                    <div key={idx} className="py-2 flex items-center justify-between text-xs">
                      <span className="text-slate-700 dark:text-slate-300 font-semibold">{l.name}</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">
                        ₹{Math.round(l.cost).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                  <div className="py-2 flex items-center justify-between text-xs font-black text-amber-600">
                    <span>Labor Subtotal</span>
                    <span>₹{Math.round(labSubtotal).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Total CPWD Summary Box */}
            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Prime Cost (Mat + Lab)</div>
                <div className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
                  ₹{Math.round(primeCost).toLocaleString('en-IN')}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Water Charge (1.5%)</div>
                <div className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
                  ₹{Math.round(waterCharges).toLocaleString('en-IN')}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Contractor Profit (10%)</div>
                <div className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
                  ₹{Math.round(contractorProfit).toLocaleString('en-IN')}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-amber-500 text-slate-950 font-black">
                <div className="text-[10px] uppercase opacity-85">Final Analyzed Rate</div>
                <div className="text-base mt-0.5">
                  ₹{Math.round(grandTotalRate).toLocaleString('en-IN')}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
