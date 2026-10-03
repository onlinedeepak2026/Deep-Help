import React, { useState, useMemo } from 'react';
import { SavedCalculation } from '../../types';
import {
  Building2,
  Save,
  Printer,
  CheckCircle2,
  Info,
  Maximize,
} from 'lucide-react';

interface BrickCalculatorProps {
  onSaveCalculation: (calc: SavedCalculation) => void;
  onOpenReport: (reportData: { title: string; module: string; summary: string; details: Record<string, string | number> }) => void;
}

export const BrickCalculator: React.FC<BrickCalculatorProps> = ({
  onSaveCalculation,
  onOpenReport,
}) => {
  const [wallLength, setWallLength] = useState<number>(10); // meters
  const [wallWidth, setWallWidth] = useState<number>(0.2); // meters (200mm = 9 inch wall)
  const [wallHeight, setWallHeight] = useState<number>(3); // meters
  const [brickType, setBrickType] = useState<'modular' | 'traditional'>('modular');
  const [mortarRatio, setMortarRatio] = useState<'1:3' | '1:4' | '1:5' | '1:6'>('1:5');
  const [wastagePercent, setWastagePercent] = useState<number>(5);
  const [deductionsM3, setDeductionsM3] = useState<number>(0); // e.g. doors & windows opening
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Brick dimensions in meters
  // Modular: without mortar 0.19 x 0.09 x 0.09 m; with mortar 0.20 x 0.10 x 0.10 m
  // Traditional: without mortar 0.23 x 0.115 x 0.075 m; with mortar 0.24 x 0.125 x 0.085 m
  const brickSpec = useMemo(() => {
    if (brickType === 'modular') {
      return {
        name: 'Standard Modular Brick (19 × 9 × 9 cm)',
        volWithMortar: 0.20 * 0.10 * 0.10, // 0.002 m3
        volWithoutMortar: 0.19 * 0.09 * 0.09, // 0.001539 m3
        dimText: '190 × 90 × 90 mm',
        jointText: '10 mm Mortar Joints',
      };
    } else {
      return {
        name: 'Traditional Standard (23 × 11.5 × 7.5 cm)',
        volWithMortar: 0.24 * 0.125 * 0.085, // 0.00255 m3
        volWithoutMortar: 0.23 * 0.115 * 0.075, // 0.00198375 m3
        dimText: '230 × 115 × 75 mm (9" × 4.5" × 3")',
        jointText: '10 mm Mortar Joints',
      };
    }
  }, [brickType]);

  const mortarParts = useMemo(() => {
    switch (mortarRatio) {
      case '1:3':
        return { c: 1, s: 3, total: 4 };
      case '1:4':
        return { c: 1, s: 4, total: 5 };
      case '1:5':
        return { c: 1, s: 5, total: 6 };
      case '1:6':
        return { c: 1, s: 6, total: 7 };
    }
  }, [mortarRatio]);

  const results = useMemo(() => {
    const grossVolume = wallLength * wallWidth * wallHeight;
    const netVolume = Math.max(0.1, grossVolume - deductionsM3);

    // Number of bricks needed
    const theoreticalBricks = Math.ceil(netVolume / brickSpec.volWithMortar);
    const totalBricksWithWastage = Math.ceil(
      theoreticalBricks * (1 + wastagePercent / 100)
    );

    // Actual volume occupied by pure bricks without mortar
    const brickOnlyVolume = theoreticalBricks * brickSpec.volWithoutMortar;
    // Wet mortar volume
    const wetMortarVol = Math.max(0, netVolume - brickOnlyVolume);
    // Dry mortar volume (Factor 1.33 for voids in dry sand and shrinkage)
    const dryMortarVol = wetMortarVol * 1.33;

    // Cement
    const cementVol = (dryMortarVol * mortarParts.c) / mortarParts.total;
    const cementKg = cementVol * 1440; // 1440 kg/m3
    const cementBags = cementKg / 50;

    // Sand
    const sandVolM3 = (dryMortarVol * mortarParts.s) / mortarParts.total;
    const sandCft = sandVolM3 * 35.3147;
    const sandKg = sandVolM3 * 1600;

    return {
      grossVolume: Number(grossVolume.toFixed(2)),
      netVolume: Number(netVolume.toFixed(2)),
      theoreticalBricks,
      totalBricksWithWastage,
      wetMortarVol: Number(wetMortarVol.toFixed(3)),
      dryMortarVol: Number(dryMortarVol.toFixed(3)),
      cementBags: Number(cementBags.toFixed(2)),
      cementKg: Number(cementKg.toFixed(1)),
      sandVolM3: Number(sandVolM3.toFixed(2)),
      sandCft: Number(sandCft.toFixed(1)),
      sandKg: Number(sandKg.toFixed(0)),
    };
  }, [
    wallLength,
    wallWidth,
    wallHeight,
    deductionsM3,
    brickSpec,
    wastagePercent,
    mortarParts,
  ]);

  const handleSave = () => {
    const calc: SavedCalculation = {
      id: 'calc-brick-' + Date.now(),
      timestamp: Date.now(),
      module: 'Brick Calculator',
      title: `Brickwork for Wall (${wallLength}m × ${wallWidth}m × ${wallHeight}m)`,
      summary: `${results.totalBricksWithWastage} Bricks, ${results.cementBags} bags Cement, ${results.sandCft} cft Sand`,
      details: {
        'Wall Dimensions': `${wallLength}m (L) × ${wallWidth}m (W) × ${wallHeight}m (H)`,
        'Wall Volume': `${results.netVolume} m³`,
        'Brick Standard': brickSpec.name,
        'Mortar Ratio': mortarRatio,
        'Total Bricks (incl. wastage)': `${results.totalBricksWithWastage} Nos`,
        'Theoretical Bricks': `${results.theoreticalBricks} Nos`,
        'Dry Mortar Volume': `${results.dryMortarVol} m³`,
        'Cement Required': `${results.cementBags} Bags (${results.cementKg} kg)`,
        'Sand Required': `${results.sandVolM3} m³ (${results.sandCft} cft)`,
      },
    };
    onSaveCalculation(calc);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handlePrint = () => {
    onOpenReport({
      title: 'Brick Masonry Estimation Report',
      module: 'Brick Calculator',
      summary: `Detailed bill of materials for ${results.netVolume} m³ brick masonry wall using ${brickSpec.name}.`,
      details: {
        'Wall Length': `${wallLength} meters`,
        'Wall Thickness': `${wallWidth} meters`,
        'Wall Height': `${wallHeight} meters`,
        'Net Masonry Volume': `${results.netVolume} m³`,
        'Selected Brick Type': brickSpec.name,
        'Mortar Proportion': mortarRatio,
        'Wastage Allowance': `${wastagePercent}%`,
        'Total Bricks Required': `${results.totalBricksWithWastage} Units`,
        'Cement (50 kg bags)': `${results.cementBags} Bags`,
        'Sand Volume': `${results.sandVolM3} m³ (${results.sandCft} cft)`,
        'Estimated Sand Weight': `${results.sandKg} kg`,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-500 dark:bg-rose-500/20 flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Brick & Mortar Calculator
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Calculate total bricks, dry mortar volume, cement bags, and sand requirements for masonry walls.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            id="brick-save-btn"
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
            id="brick-pdf-btn"
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-rose-500 hover:bg-rose-600 text-white transition-colors shadow-sm"
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
            Wall & Brick Specifications
          </h3>

          {/* Wall Dimensions */}
          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Wall Length (m)
                </label>
                <span className="text-[11px] text-slate-400 font-mono-calc">
                  ≈ {(wallLength * 3.28084).toFixed(1)} ft
                </span>
              </div>
              <input
                id="brick-wall-length"
                type="number"
                min="0.5"
                step="0.5"
                value={wallLength}
                onChange={(e) => setWallLength(Math.max(0.1, parseFloat(e.target.value) || 1))}
                className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono-calc"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Wall Thickness / Width (m)
                </label>
                <span className="text-[11px] text-slate-400 font-mono-calc">
                  {wallWidth === 0.1 ? '4" (Single brick)' : wallWidth === 0.2 ? '9" (Double brick)' : `${(wallWidth * 39.37).toFixed(1)} inches`}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => setWallWidth(0.1)}
                  className={`py-1.5 px-2 text-xs font-semibold rounded border transition-colors ${
                    wallWidth === 0.1
                      ? 'bg-rose-500 text-white border-rose-500'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  0.1 m (4&quot;)
                </button>
                <button
                  type="button"
                  onClick={() => setWallWidth(0.2)}
                  className={`py-1.5 px-2 text-xs font-semibold rounded border transition-colors ${
                    wallWidth === 0.2
                      ? 'bg-rose-500 text-white border-rose-500'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  0.2 m (9&quot;)
                </button>
                <button
                  type="button"
                  onClick={() => setWallWidth(0.3)}
                  className={`py-1.5 px-2 text-xs font-semibold rounded border transition-colors ${
                    wallWidth === 0.3
                      ? 'bg-rose-500 text-white border-rose-500'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  0.3 m (14&quot;)
                </button>
              </div>
              <input
                id="brick-wall-width"
                type="number"
                min="0.05"
                step="0.05"
                value={wallWidth}
                onChange={(e) => setWallWidth(Math.max(0.05, parseFloat(e.target.value) || 0.1))}
                className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono-calc"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Wall Height (m)
                </label>
                <span className="text-[11px] text-slate-400 font-mono-calc">
                  ≈ {(wallHeight * 3.28084).toFixed(1)} ft
                </span>
              </div>
              <input
                id="brick-wall-height"
                type="number"
                min="0.5"
                step="0.5"
                value={wallHeight}
                onChange={(e) => setWallHeight(Math.max(0.1, parseFloat(e.target.value) || 1))}
                className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono-calc"
              />
            </div>
          </div>

          {/* Brick Type Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Brick Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setBrickType('modular')}
                className={`p-2.5 text-left rounded-xl border text-xs transition-all ${
                  brickType === 'modular'
                    ? 'border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-300'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="font-bold">Standard Modular</div>
                <div className="text-[10px] text-slate-400">190 × 90 × 90 mm</div>
              </button>
              <button
                type="button"
                onClick={() => setBrickType('traditional')}
                className={`p-2.5 text-left rounded-xl border text-xs transition-all ${
                  brickType === 'traditional'
                    ? 'border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-300'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="font-bold">Traditional / Non-mod</div>
                <div className="text-[10px] text-slate-400">230 × 115 × 75 mm</div>
              </button>
            </div>
          </div>

          {/* Mortar Ratio */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Mortar Ratio (Cement : Sand)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['1:3', '1:4', '1:5', '1:6'] as const).map((ratio) => (
                <button
                  key={ratio}
                  type="button"
                  onClick={() => setMortarRatio(ratio)}
                  className={`py-2 px-1 text-xs font-bold rounded-lg border transition-all ${
                    mortarRatio === ratio
                      ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {ratio}
                </button>
              ))}
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Common practice: 1:4 for 4&quot; partition walls, 1:6 for 9&quot; main walls
            </span>
          </div>

          {/* Wastage and Openings Deduction */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                Wastage Allowance (%)
              </label>
              <input
                type="number"
                min="0"
                max="20"
                step="1"
                value={wastagePercent}
                onChange={(e) => setWastagePercent(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono-calc"
              />
              <span className="text-[10px] text-slate-400">Typical: 5% - 10%</span>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                Openings Deduction (m³)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={deductionsM3}
                onChange={(e) => setDeductionsM3(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono-calc"
              />
              <span className="text-[10px] text-slate-400">Doors/windows volume</span>
            </div>
          </div>

          <div className="p-3 bg-rose-500/5 dark:bg-rose-400/5 rounded-xl border border-rose-500/20 text-xs text-slate-600 dark:text-slate-400 flex items-start space-x-2">
            <Info className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              Standard CPWD norm: 1 m³ of brickwork requires approximately <strong>500 modular bricks</strong>. Dry volume of mortar is taken as <strong>33% higher (1.33 factor)</strong> than wet mortar.
            </p>
          </div>
        </div>

        {/* Right Output Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 1. Total Bricks */}
            <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Total Bricks Required
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                  +{wastagePercent}% Wastage
                </span>
              </div>
              <div className="flex items-baseline space-x-2 mb-2">
                <span className="text-3xl sm:text-4xl font-black text-rose-600 dark:text-rose-400 font-mono-calc">
                  {results.totalBricksWithWastage}
                </span>
                <span className="text-sm font-bold text-slate-500 dark:text-slate-400">
                  Bricks
                </span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-2 flex justify-between font-mono-calc">
                <span>Theoretical Count:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  {results.theoreticalBricks} Bricks
                </span>
              </div>
            </div>

            {/* 2. Wall Net Volume */}
            <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Net Masonry Volume
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  Wall Volume
                </span>
              </div>
              <div className="flex items-baseline space-x-2 mb-2">
                <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-mono-calc">
                  {results.netVolume}
                </span>
                <span className="text-sm font-bold text-rose-600 dark:text-rose-400">
                  m³
                </span>
                <span className="text-xs text-slate-400 font-mono-calc">
                  ({(results.netVolume * 35.3147).toFixed(1)} cft)
                </span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-2 flex justify-between font-mono-calc">
                <span>Gross Volume:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  {results.grossVolume} m³
                </span>
              </div>
            </div>

            {/* 3. Cement for Mortar */}
            <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Mortar Cement
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  Ratio {mortarRatio}
                </span>
              </div>
              <div className="flex items-baseline space-x-2 mb-2">
                <span className="text-3xl font-black text-slate-900 dark:text-white font-mono-calc">
                  {results.cementBags}
                </span>
                <span className="text-sm font-bold text-rose-600 dark:text-rose-400">
                  Bags
                </span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-2 flex justify-between font-mono-calc">
                <span>Cement Mass:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  {results.cementKg} kg
                </span>
              </div>
            </div>

            {/* 4. Sand for Mortar */}
            <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Mortar Sand
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  Fine Sand
                </span>
              </div>
              <div className="flex items-baseline space-x-2 mb-2">
                <span className="text-3xl font-black text-slate-900 dark:text-white font-mono-calc">
                  {results.sandCft}
                </span>
                <span className="text-sm font-bold text-rose-600 dark:text-rose-400">
                  cft
                </span>
                <span className="text-xs text-slate-400 font-mono-calc">
                  ({results.sandVolM3} m³)
                </span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-2 flex justify-between font-mono-calc">
                <span>Estimated Weight:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  {results.sandKg} kg ({(results.sandCft / 100).toFixed(2)} Brass)
                </span>
              </div>
            </div>
          </div>

          {/* Visual Wall Section Preview */}
          <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>Wall Elevation & Masonry Course Layout</span>
              <span className="text-rose-500 text-[11px] font-mono-calc font-semibold">
                {wallLength}m × {wallHeight}m ({wallWidth}m thick)
              </span>
            </h4>

            {/* SVG Brick Pattern */}
            <div className="w-full h-32 bg-slate-100 dark:bg-slate-800/80 rounded-xl overflow-hidden relative flex items-center justify-center border border-slate-200 dark:border-slate-700">
              <svg className="w-full h-full opacity-60 dark:opacity-40" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern
                    id="brick-pattern"
                    width="40"
                    height="20"
                    patternUnits="userSpaceOnUse"
                  >
                    <rect width="40" height="20" fill="none" stroke="currentColor" strokeWidth="1" className="text-rose-400 dark:text-rose-600" />
                    <line x1="20" y1="0" x2="20" y2="10" stroke="currentColor" strokeWidth="1" className="text-rose-400 dark:text-rose-600" />
                    <line x1="0" y1="10" x2="40" y2="10" stroke="currentColor" strokeWidth="1" className="text-rose-400 dark:text-rose-600" />
                    <line x1="0" y1="20" x2="40" y2="20" stroke="currentColor" strokeWidth="1" className="text-rose-400 dark:text-rose-600" />
                    <line x1="40" y1="10" x2="40" y2="20" stroke="currentColor" strokeWidth="1" className="text-rose-400 dark:text-rose-600" />
                    <line x1="10" y1="10" x2="10" y2="20" stroke="currentColor" strokeWidth="1" className="text-rose-400 dark:text-rose-600" />
                    <line x1="30" y1="10" x2="30" y2="20" stroke="currentColor" strokeWidth="1" className="text-rose-400 dark:text-rose-600" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#brick-pattern)" />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/30 backdrop-blur-[1px] p-2 text-center text-white">
                <span className="text-xs font-extrabold uppercase tracking-wide drop-shadow">
                  Stretcher Bond Course View
                </span>
                <span className="text-[11px] font-mono-calc opacity-90">
                  {brickSpec.name} • {mortarRatio} Mortar
                </span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                <span className="text-slate-400 text-[10px] block">Bricks / m³</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 font-mono-calc">
                  {Math.round(results.theoreticalBricks / results.netVolume)} Nos
                </span>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                <span className="text-slate-400 text-[10px] block">Wet Mortar</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 font-mono-calc">
                  {results.wetMortarVol} m³
                </span>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                <span className="text-slate-400 text-[10px] block">Dry Mortar</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 font-mono-calc">
                  {results.dryMortarVol} m³
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
