import React, { useState, useMemo } from 'react';
import { SavedCalculation } from '../../types';
import {
  Coins,
  Save,
  Printer,
  CheckCircle2,
  TrendingUp,
  Percent,
  CheckSquare,
  HelpCircle,
} from 'lucide-react';

interface BuildingCostEstimatorProps {
  onSaveCalculation: (calc: SavedCalculation) => void;
  onOpenReport: (reportData: { title: string; module: string; summary: string; details: Record<string, string | number> }) => void;
}

export const BuildingCostEstimator: React.FC<BuildingCostEstimatorProps> = ({
  onSaveCalculation,
  onOpenReport,
}) => {
  const [area, setArea] = useState<number>(1500); // area
  const [unit, setUnit] = useState<'sqft' | 'sqm'>('sqft');
  const [costPerSqft, setCostPerSqft] = useState<number>(1850); // INR per sq.ft
  const [floors, setFloors] = useState<number>(1);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Conversion: 1 sqm = 10.7639 sqft
  const areaInSqft = useMemo(() => {
    return unit === 'sqft' ? area : area * 10.7639;
  }, [area, unit]);

  const areaInSqm = useMemo(() => {
    return unit === 'sqm' ? area : area / 10.7639;
  }, [area, unit]);

  const costPerSqm = useMemo(() => {
    return Math.round(costPerSqft * 10.7639);
  }, [costPerSqft]);

  const totalCost = useMemo(() => {
    return Math.round(areaInSqft * costPerSqft * floors);
  }, [areaInSqft, costPerSqft, floors]);

  // Breakdown percentages
  const breakdown = useMemo(() => {
    const structural = Math.round(totalCost * 0.48); // 48% Civil Core Structure
    const finishing = Math.round(totalCost * 0.24); // 24% Finishing, Flooring & Paint
    const mep = Math.round(totalCost * 0.14); // 14% Electrical & Plumbing
    const openings = Math.round(totalCost * 0.08); // 8% Doors, Windows, Fabrication
    const contingency = totalCost - (structural + finishing + mep + openings); // ~6% Approvals & Contingency

    // Material vs Labor split
    const materials = Math.round(totalCost * 0.65);
    const labor = totalCost - materials;

    return {
      structural,
      finishing,
      mep,
      openings,
      contingency,
      materials,
      labor,
    };
  }, [totalCost]);

  // Indian Rupee number formatting (Lakhs & Crores)
  const formatINR = (val: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatLakhCrore = (val: number): string => {
    if (val >= 10000000) {
      return `₹ ${(val / 10000000).toFixed(2)} Crores`;
    } else if (val >= 100000) {
      return `₹ ${(val / 100000).toFixed(2)} Lakhs`;
    }
    return `₹ ${val.toLocaleString('en-IN')}`;
  };

  const setQualityPreset = (rate: number) => {
    setCostPerSqft(rate);
  };

  const handleSave = () => {
    const calc: SavedCalculation = {
      id: 'calc-cost-' + Date.now(),
      timestamp: Date.now(),
      module: 'Building Cost Estimator',
      title: `Cost Estimate for ${area} ${unit} (${floors} Floor${floors > 1 ? 's' : ''})`,
      summary: `Total: ${formatLakhCrore(totalCost)} @ ₹${costPerSqft}/sq.ft`,
      details: {
        'Built-up Area': `${area} ${unit} (≈ ${Math.round(areaInSqft)} sq.ft / ${Math.round(areaInSqm)} sq.m)`,
        Floors: `${floors}`,
        'Rate per Sq.ft': `₹ ${costPerSqft}`,
        'Rate per Sq.m': `₹ ${costPerSqm}`,
        'Total Project Cost': formatINR(totalCost),
        'Structure (RCC & Masonry)': formatINR(breakdown.structural),
        'Finishing & Paints': formatINR(breakdown.finishing),
        'MEP Plumbing & Electric': formatINR(breakdown.mep),
        'Doors & Windows': formatINR(breakdown.openings),
        'Contingency & Design': formatINR(breakdown.contingency),
        'Materials Budget (65%)': formatINR(breakdown.materials),
        'Labor Budget (35%)': formatINR(breakdown.labor),
      },
    };
    onSaveCalculation(calc);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handlePrint = () => {
    onOpenReport({
      title: 'Building Construction Cost Estimate',
      module: 'Building Cost Estimator',
      summary: `Comprehensive budget estimate for ${Math.round(areaInSqft)} sq.ft residential/commercial construction in INR.`,
      details: {
        'Plot / Built-up Area': `${area} ${unit}`,
        'Total Built-up Area (Sq.ft)': `${Math.round(areaInSqft * floors)} sq.ft`,
        'Total Built-up Area (Sq.m)': `${Math.round(areaInSqm * floors)} sq.m`,
        'Number of Storeys': `${floors}`,
        'Construction Rate per Sq.ft': `₹ ${costPerSqft}`,
        'Construction Rate per Sq.m': `₹ ${costPerSqm}`,
        'Total Estimated Cost': formatINR(totalCost),
        'Formatted (Lakhs/Crores)': formatLakhCrore(totalCost),
        'Structural Frame Work': `${formatINR(breakdown.structural)} (48%)`,
        'Finishing, Flooring & Painting': `${formatINR(breakdown.finishing)} (24%)`,
        'MEP (Plumbing & Electrical)': `${formatINR(breakdown.mep)} (14%)`,
        'Doors, Windows & Woodwork': `${formatINR(breakdown.openings)} (8%)`,
        'Approvals & Contingency': `${formatINR(breakdown.contingency)} (6%)`,
        'Material Cost Share': `${formatINR(breakdown.materials)} (65%)`,
        'Labor & Contractor Share': `${formatINR(breakdown.labor)} (35%)`,
      },
    });
  };

  // Milestone schedule
  const stages = [
    { name: '1. Foundation & Substructure', pct: 15, cost: totalCost * 0.15 },
    { name: '2. Plinth Beam & Ground Slab', pct: 15, cost: totalCost * 0.15 },
    { name: '3. Columns & Roof Slab Casting', pct: 20, cost: totalCost * 0.20 },
    { name: '4. Brickwork & Internal Plaster', pct: 18, cost: totalCost * 0.18 },
    { name: '5. Electrical & Plumbing Rough-in', pct: 12, cost: totalCost * 0.12 },
    { name: '6. Flooring & Tiling', pct: 10, cost: totalCost * 0.10 },
    { name: '7. Painting, Fixtures & Handover', pct: 10, cost: totalCost * 0.10 },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20 flex items-center justify-center">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Building Cost Estimator (INR)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Calculate construction project costs in Indian Rupees with area-based rates, material-labor split and stage milestones.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            id="cost-save-btn"
            onClick={handleSave}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors"
          >
            {saveSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400">Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-slate-500" />
                <span>Save Estimate</span>
              </>
            )}
          </button>
          <button
            id="cost-pdf-btn"
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs Column */}
        <div className="lg:col-span-5 space-y-5 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Project Parameters
          </h3>

          {/* Area Input & Unit Selector */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Built-Up Area
              </label>
              <div className="inline-flex rounded-lg p-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setUnit('sqft')}
                  className={`px-2 py-0.5 text-xs font-bold rounded ${
                    unit === 'sqft'
                      ? 'bg-emerald-500 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Sq.ft
                </button>
                <button
                  type="button"
                  onClick={() => setUnit('sqm')}
                  className={`px-2 py-0.5 text-xs font-bold rounded ${
                    unit === 'sqm'
                      ? 'bg-emerald-500 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Sq.m
                </button>
              </div>
            </div>
            <div className="relative">
              <input
                id="cost-area-input"
                type="number"
                min="50"
                step="50"
                value={area}
                onChange={(e) => setArea(Math.max(10, parseFloat(e.target.value) || 100))}
                className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono-calc font-semibold"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                {unit === 'sqft' ? 'Square Feet' : 'Square Meters'}
              </span>
            </div>
            <div className="mt-1 flex justify-between text-[11px] text-slate-400 font-mono-calc">
              <span>Equivalent: {Math.round(areaInSqft)} sq.ft</span>
              <span>{Math.round(areaInSqm)} sq.m</span>
            </div>
          </div>

          {/* Number of Floors */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Number of Floors / Storeys
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((fl) => (
                <button
                  key={fl}
                  type="button"
                  onClick={() => setFloors(fl)}
                  className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                    floors === fl
                      ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {fl === 1 ? 'Ground Only (G)' : `G + ${fl - 1}`}
                </button>
              ))}
            </div>
          </div>

          {/* Cost per Sq.ft & Sq.m */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Rate per Sq.ft (INR)
              </label>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-mono-calc font-bold">
                ≈ ₹ {costPerSqm.toLocaleString('en-IN')}/sq.m
              </span>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                ₹
              </span>
              <input
                id="cost-rate-input"
                type="number"
                min="800"
                step="50"
                value={costPerSqft}
                onChange={(e) => setCostPerSqft(Math.max(500, parseFloat(e.target.value) || 1000))}
                className="w-full pl-8 pr-4 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono-calc font-semibold"
              />
            </div>
          </div>

          {/* Specification Presets */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Standard Finish Presets
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setQualityPreset(1500)}
                className={`p-2 rounded-xl text-left border text-xs transition-all ${
                  costPerSqft === 1500
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                <div className="font-bold">Basic / Budget</div>
                <div className="text-[10px] text-slate-400">₹1,400 - ₹1,600</div>
              </button>
              <button
                type="button"
                onClick={() => setQualityPreset(1850)}
                className={`p-2 rounded-xl text-left border text-xs transition-all ${
                  costPerSqft === 1850
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                <div className="font-bold">Standard</div>
                <div className="text-[10px] text-slate-400">₹1,800 - ₹2,200</div>
              </button>
              <button
                type="button"
                onClick={() => setQualityPreset(2800)}
                className={`p-2 rounded-xl text-left border text-xs transition-all ${
                  costPerSqft === 2800
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                <div className="font-bold">Premium</div>
                <div className="text-[10px] text-slate-400">₹2,500 - ₹3,500</div>
              </button>
            </div>
          </div>

          {/* Material vs Labor Split Bar */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">
              <span>Estimated Cost Distribution</span>
              <span className="font-mono-calc">65% Material / 35% Labor</span>
            </div>
            <div className="h-3 w-full rounded-full overflow-hidden flex bg-slate-200 dark:bg-slate-700">
              <div style={{ width: '65%' }} className="bg-emerald-500" title="Materials (65%)" />
              <div style={{ width: '35%' }} className="bg-amber-400" title="Labor & Machinery (35%)" />
            </div>
            <div className="flex justify-between text-[11px] text-slate-500 mt-1 font-mono-calc">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                Materials: {formatINR(breakdown.materials)}
              </span>
              <span className="text-amber-600 dark:text-amber-400 font-bold">
                Labor: {formatINR(breakdown.labor)}
              </span>
            </div>
          </div>
        </div>

        {/* Right Output Results Column */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Total Cost Banner */}
          <div className="p-6 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl shadow-lg relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-100">
                Total Estimated Construction Cost
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-white/20 text-white">
                INR (₹)
              </span>
            </div>
            <div className="text-3xl sm:text-5xl font-black font-mono-calc tracking-tight mb-2">
              {formatLakhCrore(totalCost)}
            </div>
            <div className="text-sm font-semibold text-emerald-100 flex items-center justify-between border-t border-emerald-500/40 pt-3">
              <span>Exact Figures:</span>
              <span className="font-mono-calc font-bold text-white text-base">
                {formatINR(totalCost)}
              </span>
            </div>
          </div>

          {/* Component Breakdown Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block uppercase">
                RCC & Structure (48%)
              </span>
              <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-mono-calc block mt-1">
                {formatINR(breakdown.structural)}
              </span>
              <span className="text-[10px] text-slate-400">Cement, steel, sand, agg</span>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block uppercase">
                Finishing & Flooring (24%)
              </span>
              <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-mono-calc block mt-1">
                {formatINR(breakdown.finishing)}
              </span>
              <span className="text-[10px] text-slate-400">Tiles, plastering, paint</span>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block uppercase">
                MEP Services (14%)
              </span>
              <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-mono-calc block mt-1">
                {formatINR(breakdown.mep)}
              </span>
              <span className="text-[10px] text-slate-400">Plumbing & electrical</span>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block uppercase">
                Doors & Windows (8%)
              </span>
              <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-mono-calc block mt-1">
                {formatINR(breakdown.openings)}
              </span>
              <span className="text-[10px] text-slate-400">Woodwork, grills & glass</span>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm col-span-2 sm:col-span-2">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block uppercase">
                Contingency & Design (6%)
              </span>
              <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-mono-calc block mt-1">
                {formatINR(breakdown.contingency)}
              </span>
              <span className="text-[10px] text-slate-400">Municipal permits, architect & unforeseen costs</span>
            </div>
          </div>

          {/* Construction Stage Cashflow Milestone Schedule */}
          <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>Stage-Wise Payment Milestone Schedule</span>
              <span className="text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                7 Milestone Phases
              </span>
            </h4>
            <div className="space-y-2 text-xs">
              {stages.map((st, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60"
                >
                  <div className="flex items-center space-x-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {st.name}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 font-mono-calc">
                    <span className="text-slate-400 text-[11px]">{st.pct}%</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {formatINR(Math.round(st.cost))}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
