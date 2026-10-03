import React, { useState, useMemo } from 'react';
import { SavedCalculation } from '../../types';
import {
  Droplets,
  Save,
  Printer,
  CheckCircle2,
  Users,
  Info,
} from 'lucide-react';

interface WaterTankCalculatorProps {
  onSaveCalculation: (calc: SavedCalculation) => void;
  onOpenReport: (reportData: { title: string; module: string; summary: string; details: Record<string, string | number> }) => void;
}

export const WaterTankCalculator: React.FC<WaterTankCalculatorProps> = ({
  onSaveCalculation,
  onOpenReport,
}) => {
  const [shape, setShape] = useState<'rectangular' | 'circular'>('rectangular');

  // Rectangular dimensions (in meters)
  const [length, setLength] = useState<number>(3.0);
  const [width, setWidth] = useState<number>(2.0);
  const [waterDepth, setWaterDepth] = useState<number>(1.8);
  const [freeboard, setFreeboard] = useState<number>(0.3); // 300 mm freeboard

  // Circular dimensions (in meters)
  const [diameter, setDiameter] = useState<number>(2.5);

  // Household sizing
  const [familyMembers, setFamilyMembers] = useState<number>(5);
  const [lpcd, setLpcd] = useState<number>(135); // 135 LPCD as per IS 1172

  const [saveSuccess, setSaveSuccess] = useState(false);

  const results = useMemo(() => {
    let waterVolumeM3 = 0;
    let grossVolumeM3 = 0;
    const totalHeight = waterDepth + freeboard;

    if (shape === 'rectangular') {
      waterVolumeM3 = length * width * waterDepth;
      grossVolumeM3 = length * width * totalHeight;
    } else {
      const radius = diameter / 2;
      waterVolumeM3 = Math.PI * Math.pow(radius, 2) * waterDepth;
      grossVolumeM3 = Math.PI * Math.pow(radius, 2) * totalHeight;
    }

    const capacityLiters = Math.round(waterVolumeM3 * 1000);
    const grossCapacityLiters = Math.round(grossVolumeM3 * 1000);
    const capacityGallons = Math.round(capacityLiters * 0.264172);

    // Days of water autonomy
    const dailyNeed = familyMembers * lpcd;
    const daysAutonomy = dailyNeed > 0 ? (capacityLiters / dailyNeed).toFixed(1) : '0';
    const totalPersonsServedOneDay = dailyNeed > 0 ? Math.floor(capacityLiters / lpcd) : 0;

    return {
      waterVolumeM3: Number(waterVolumeM3.toFixed(3)),
      grossVolumeM3: Number(grossVolumeM3.toFixed(3)),
      capacityLiters,
      grossCapacityLiters,
      capacityGallons,
      totalHeight: Number(totalHeight.toFixed(2)),
      daysAutonomy,
      totalPersonsServedOneDay,
    };
  }, [shape, length, width, waterDepth, freeboard, diameter, familyMembers, lpcd]);

  const handleSave = () => {
    const calc: SavedCalculation = {
      id: 'calc-tank-' + Date.now(),
      timestamp: Date.now(),
      module: 'Water Tank Capacity Calculator',
      title: `${shape === 'rectangular' ? 'Rectangular' : 'Circular'} Tank (${results.capacityLiters.toLocaleString()} Liters)`,
      summary: `Capacity: ${results.capacityLiters.toLocaleString()} L (${results.waterVolumeM3} m³) | ${results.daysAutonomy} days reserve for ${familyMembers} persons`,
      details: {
        'Tank Type': shape === 'rectangular' ? 'Rectangular / Underground Sump' : 'Circular / Cylindrical Tank',
        ...(shape === 'rectangular'
          ? {
              Length: `${length} m`,
              Width: `${width} m`,
            }
          : {
              Diameter: `${diameter} m`,
            }),
        'Water Depth': `${waterDepth} m`,
        Freeboard: `${freeboard} m`,
        'Total Height': `${results.totalHeight} m`,
        'Effective Water Capacity (Liters)': `${results.capacityLiters.toLocaleString()} Liters`,
        'Effective Water Capacity (m³)': `${results.waterVolumeM3} m³`,
        'Capacity in US Gallons': `${results.capacityGallons.toLocaleString()} Gallons`,
        'Gross Volume with Freeboard': `${results.grossVolumeM3} m³ (${results.grossCapacityLiters.toLocaleString()} L)`,
        'Autonomy Duration': `${results.daysAutonomy} Days (for ${familyMembers} people @ ${lpcd} LPCD)`,
      },
    };
    onSaveCalculation(calc);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handlePrint = () => {
    onOpenReport({
      title: 'Water Storage Tank Capacity & Sizing Sheet',
      module: 'Water Tank Capacity Calculator',
      summary: `Volumetric analysis and domestic consumption autonomy for ${results.capacityLiters.toLocaleString()} L storage tank.`,
      details: {
        'Tank Configuration': shape === 'rectangular' ? 'Rectangular Tank' : 'Circular Tank',
        ...(shape === 'rectangular'
          ? {
              'Length (Internal)': `${length} meters`,
              'Breadth (Internal)': `${width} meters`,
            }
          : {
              'Internal Diameter': `${diameter} meters`,
            }),
        'Design Water Depth': `${waterDepth} meters`,
        'Air Freeboard Allowance': `${freeboard} meters`,
        'Total Structural Depth': `${results.totalHeight} meters`,
        'Effective Storage in Liters': `${results.capacityLiters.toLocaleString()} Liters`,
        'Effective Storage in m³': `${results.waterVolumeM3} m³`,
        'Storage in US Gallons': `${results.capacityGallons.toLocaleString()} Gallons`,
        'Gross Tank Enclosure': `${results.grossVolumeM3} m³`,
        'Design Standard': `IS 1172:1993 (${lpcd} LPCD for ${familyMembers} residents)`,
        'Storage Independence': `${results.daysAutonomy} Days of uninterrupted supply`,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-500 dark:bg-cyan-500/20 flex items-center justify-center">
            <Droplets className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Water Tank Capacity Calculator
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Compute water capacity in Liters and Cubic Meters for Rectangular and Circular tanks with freeboard and per-capita demand.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            id="tank-save-btn"
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
                <span>Save Calculation</span>
              </>
            )}
          </button>
          <button
            id="tank-pdf-btn"
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white transition-colors shadow-sm"
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
            Tank Configuration
          </h3>

          {/* Shape Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Select Tank Shape
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                id="tank-shape-rectangular"
                onClick={() => setShape('rectangular')}
                className={`py-2.5 px-3 text-xs font-bold rounded-xl border transition-all ${
                  shape === 'rectangular'
                    ? 'bg-cyan-500 text-white border-cyan-500 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                Rectangular / Sump
              </button>
              <button
                type="button"
                id="tank-shape-circular"
                onClick={() => setShape('circular')}
                className={`py-2.5 px-3 text-xs font-bold rounded-xl border transition-all ${
                  shape === 'circular'
                    ? 'bg-cyan-500 text-white border-cyan-500 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                Circular / Overhead
              </button>
            </div>
          </div>

          {/* Dimensions based on Shape */}
          {shape === 'rectangular' ? (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Tank Length (m)
                </label>
                <input
                  id="tank-length-input"
                  type="number"
                  step="0.1"
                  min="0.5"
                  value={length}
                  onChange={(e) => setLength(Math.max(0.2, parseFloat(e.target.value) || 1))}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono-calc font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Tank Width / Breadth (m)
                </label>
                <input
                  id="tank-width-input"
                  type="number"
                  step="0.1"
                  min="0.5"
                  value={width}
                  onChange={(e) => setWidth(Math.max(0.2, parseFloat(e.target.value) || 1))}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono-calc font-semibold"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Tank Internal Diameter (m)
              </label>
              <input
                id="tank-diameter-input"
                type="number"
                step="0.1"
                min="0.5"
                value={diameter}
                onChange={(e) => setDiameter(Math.max(0.2, parseFloat(e.target.value) || 1))}
                className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono-calc font-semibold"
              />
            </div>
          )}

          {/* Depths */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Water Depth (m)
              </label>
              <input
                id="tank-depth-input"
                type="number"
                step="0.1"
                min="0.2"
                value={waterDepth}
                onChange={(e) => setWaterDepth(Math.max(0.1, parseFloat(e.target.value) || 1))}
                className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono-calc"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Freeboard Clearance (m)
              </label>
              <input
                id="tank-freeboard-input"
                type="number"
                step="0.05"
                min="0.1"
                value={freeboard}
                onChange={(e) => setFreeboard(Math.max(0, parseFloat(e.target.value) || 0.3))}
                className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono-calc"
              />
            </div>
          </div>

          {/* Sizing & Household Section */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Domestic Water Sizing (IS 1172)
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Family Members
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={familyMembers}
                  onChange={(e) => setFamilyMembers(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono-calc"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Per Capita LPCD
                </label>
                <input
                  type="number"
                  min="50"
                  max="300"
                  step="5"
                  value={lpcd}
                  onChange={(e) => setLpcd(Math.max(10, parseInt(e.target.value) || 135))}
                  className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono-calc"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Output & Visual Section */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Capacity Display */}
          <div className="p-6 bg-gradient-to-r from-cyan-600 to-sky-700 text-white rounded-2xl shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-100">
                Effective Storage Capacity
              </span>
              <span className="px-2 py-0.5 rounded text-xs font-extrabold bg-white/20 text-white">
                1 m³ = 1,000 Liters
              </span>
            </div>
            <div className="flex items-baseline space-x-2 mb-2">
              <span className="text-4xl sm:text-5xl font-black font-mono-calc">
                {results.capacityLiters.toLocaleString()}
              </span>
              <span className="text-xl font-bold text-cyan-200">Liters</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 border-t border-cyan-500/40 pt-3 text-xs text-cyan-100 font-mono-calc">
              <div>
                <span className="opacity-80 block text-[10px]">Cubic Meters:</span>
                <span className="font-bold text-white text-sm">{results.waterVolumeM3} m³</span>
              </div>
              <div>
                <span className="opacity-80 block text-[10px]">US Gallons:</span>
                <span className="font-bold text-white text-sm">{results.capacityGallons.toLocaleString()} gal</span>
              </div>
              <div>
                <span className="opacity-80 block text-[10px]">Autonomy Reserve:</span>
                <span className="font-bold text-white text-sm">{results.daysAutonomy} Days</span>
              </div>
            </div>
          </div>

          {/* Dimensional SVG Graphic */}
          <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Sectional Elevation & Water Line</span>
              <span className="text-cyan-600 dark:text-cyan-400 text-xs font-mono-calc">
                Total Depth: {results.totalHeight} m
              </span>
            </h4>

            {/* SVG Tank Profile */}
            <div className="w-full h-44 bg-slate-50 dark:bg-slate-950/60 rounded-xl p-4 border border-slate-200 dark:border-slate-800 flex items-center justify-center">
              <svg viewBox="0 0 400 160" className="w-full h-full max-w-sm">
                {/* Tank outer walls */}
                <rect x="80" y="20" width="240" height="120" rx={shape === 'circular' ? '12' : '4'} fill="none" stroke="currentColor" strokeWidth="3" className="text-slate-400 dark:text-slate-600" />

                {/* Freeboard area (top gap) */}
                <rect x="83" y="23" width="234" height="28" fill="currentColor" className="text-slate-200/50 dark:text-slate-800/40" />
                <text x="200" y="41" textAnchor="middle" fill="currentColor" className="text-[10px] font-bold text-slate-400 font-mono">
                  Freeboard: {freeboard} m
                </text>

                {/* Water Body */}
                <rect x="83" y="52" width="234" height="85" fill="currentColor" className="text-cyan-500/30 dark:text-cyan-500/20" />
                <line x1="83" y1="52" x2="317" y2="52" stroke="#06b6d4" strokeWidth="2" strokeDasharray="4 2" />

                <text x="200" y="95" textAnchor="middle" fill="#0891b2" className="text-[13px] font-extrabold font-mono">
                  {results.capacityLiters.toLocaleString()} Liters
                </text>
                <text x="200" y="112" textAnchor="middle" fill="#0891b2" className="text-[10px] font-semibold font-mono">
                  Effective Depth: {waterDepth} m
                </text>

                {/* Left dimension text */}
                <text x="40" y="85" textAnchor="middle" fill="currentColor" className="text-[10px] text-slate-400 font-mono">
                  {shape === 'rectangular' ? `${length}m × ${width}m` : `Ø ${diameter}m`}
                </text>
              </svg>
            </div>

            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
                <span className="text-slate-400 text-[10px] block">Gross Tank Capacity</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 font-mono-calc">
                  {results.grossCapacityLiters.toLocaleString()} L
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
                <span className="text-slate-400 text-[10px] block">Daily Household Need</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 font-mono-calc">
                  {familyMembers * lpcd} L / day
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 col-span-2 sm:col-span-1">
                <span className="text-slate-400 text-[10px] block">Persons Served for 1 Day</span>
                <span className="font-bold text-cyan-600 dark:text-cyan-400 font-mono-calc">
                  {results.totalPersonsServedOneDay} Persons
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
