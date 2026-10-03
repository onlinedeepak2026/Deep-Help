import React, { useState, useMemo } from 'react';
import { ConcreteResult, SavedCalculation } from '../../types';
import {
  Layers,
  Save,
  Printer,
  RotateCcw,
  Info,
  Droplet,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';

interface ConcreteCalculatorProps {
  onSaveCalculation: (calc: SavedCalculation) => void;
  onOpenReport: (reportData: { title: string; module: string; summary: string; details: Record<string, string | number> }) => void;
}

export const ConcreteCalculator: React.FC<ConcreteCalculatorProps> = ({
  onSaveCalculation,
  onOpenReport,
}) => {
  const [grade, setGrade] = useState<'M15' | 'M20' | 'M25' | 'M30' | 'Custom'>('M20');
  const [wetVolume, setWetVolume] = useState<number>(10); // m³
  const [dryFactor, setDryFactor] = useState<number>(1.54);
  const [wcRatio, setWcRatio] = useState<number>(0.5);

  // Custom ratios
  const [customCement, setCustomCement] = useState<number>(1);
  const [customSand, setCustomSand] = useState<number>(1.5);
  const [customAgg, setCustomAgg] = useState<number>(3);

  const [saveSuccess, setSaveSuccess] = useState(false);

  // Nominal ratios: Cement : Sand : Aggregate
  const ratios = useMemo(() => {
    switch (grade) {
      case 'M15':
        return { c: 1, s: 2, a: 4, name: '1 : 2 : 4' };
      case 'M20':
        return { c: 1, s: 1.5, a: 3, name: '1 : 1.5 : 3' };
      case 'M25':
        return { c: 1, s: 1, a: 2, name: '1 : 1 : 2' };
      case 'M30':
        return { c: 1, s: 0.75, a: 1.5, name: '1 : 0.75 : 1.5' };
      case 'Custom':
        return {
          c: customCement > 0 ? customCement : 1,
          s: customSand >= 0 ? customSand : 1,
          a: customAgg >= 0 ? customAgg : 2,
          name: `${customCement} : ${customSand} : ${customAgg}`,
        };
      default:
        return { c: 1, s: 1.5, a: 3, name: '1 : 1.5 : 3' };
    }
  }, [grade, customCement, customSand, customAgg]);

  const results: ConcreteResult = useMemo(() => {
    const totalParts = ratios.c + ratios.s + ratios.a;
    const dryVol = wetVolume * dryFactor;

    // Cement
    const cementVol = (dryVol * ratios.c) / totalParts;
    const cementDensity = 1440; // kg/m³
    const cementKg = cementVol * cementDensity;
    const cementBags = cementKg / 50;

    // Sand
    const sandVolM3 = (dryVol * ratios.s) / totalParts;
    const sandCft = sandVolM3 * 35.3147;
    const sandDensity = 1600; // kg/m³
    const sandKg = sandVolM3 * sandDensity;

    // Aggregate
    const aggVolM3 = (dryVol * ratios.a) / totalParts;
    const aggCft = aggVolM3 * 35.3147;
    const aggDensity = 1500; // kg/m³
    const aggKg = aggVolM3 * aggDensity;

    // Water
    const waterLiters = cementKg * wcRatio;

    return {
      grade,
      nominalRatio: ratios.name,
      wetVolume,
      dryVolume: Number(dryVol.toFixed(2)),
      cementBags: Number(cementBags.toFixed(2)),
      cementKg: Number(cementKg.toFixed(1)),
      sandCubicMeters: Number(sandVolM3.toFixed(2)),
      sandCubicFeet: Number(sandCft.toFixed(1)),
      sandKg: Number(sandKg.toFixed(0)),
      aggregateCubicMeters: Number(aggVolM3.toFixed(2)),
      aggregateCubicFeet: Number(aggCft.toFixed(1)),
      aggregateKg: Number(aggKg.toFixed(0)),
      waterLiters: Number(waterLiters.toFixed(0)),
    };
  }, [grade, ratios, wetVolume, dryFactor, wcRatio]);

  const handleSave = () => {
    const calc: SavedCalculation = {
      id: 'calc-concrete-' + Date.now(),
      timestamp: Date.now(),
      module: 'Concrete Mix Calculator',
      title: `${grade} Mix for ${wetVolume} m³ Concrete`,
      summary: `${results.cementBags} bags Cement, ${results.sandCubicMeters} m³ Sand, ${results.aggregateCubicMeters} m³ Aggregate`,
      details: {
        Grade: results.grade,
        'Nominal Ratio': results.nominalRatio,
        'Wet Volume': `${results.wetVolume} m³`,
        'Dry Volume (Factor 1.54)': `${results.dryVolume} m³`,
        'Cement Quantity': `${results.cementBags} Bags (${results.cementKg} kg)`,
        'Sand Quantity': `${results.sandCubicMeters} m³ (${results.sandCubicFeet} cft)`,
        'Aggregate Quantity': `${results.aggregateCubicMeters} m³ (${results.aggregateCubicFeet} cft)`,
        'Water Required': `${results.waterLiters} Liters`,
        'W/C Ratio': wcRatio,
      },
    };
    onSaveCalculation(calc);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handlePrint = () => {
    onOpenReport({
      title: `Concrete Mix Design Sheet (${results.grade})`,
      module: 'Concrete Mix Calculator',
      summary: `Material estimate for ${results.wetVolume} m³ wet concrete using nominal ratio ${results.nominalRatio}.`,
      details: {
        'Concrete Grade': results.grade,
        'Nominal Mix Ratio': results.nominalRatio,
        'Wet Batch Volume': `${results.wetVolume} m³`,
        'Dry Volume Factor': `${dryFactor}`,
        'Dry Batch Volume': `${results.dryVolume} m³`,
        'Cement (50 kg bags)': `${results.cementBags} Bags`,
        'Cement Total Weight': `${results.cementKg} kg`,
        'Fine Aggregate (Sand)': `${results.sandCubicMeters} m³ (${results.sandCubicFeet} cft / ${results.sandKg} kg)`,
        'Coarse Aggregate': `${results.aggregateCubicMeters} m³ (${results.aggregateCubicFeet} cft / ${results.aggregateKg} kg)`,
        'Water Quantity': `${results.waterLiters} Liters (W/C: ${wcRatio})`,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 dark:bg-amber-500/20 flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Concrete Mix Calculator
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Calculate Cement, Sand, Aggregate & Water for M15, M20, M25, M30 grades according to IS 456.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            id="concrete-save-btn"
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
            id="concrete-pdf-btn"
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-sm"
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
            Mix Specifications
          </h3>

          {/* Concrete Grade Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Select Concrete Grade
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {(['M15', 'M20', 'M25', 'M30', 'Custom'] as const).map((g) => (
                <button
                  key={g}
                  id={`concrete-grade-btn-${g}`}
                  onClick={() => setGrade(g)}
                  className={`py-2 px-1 text-xs font-bold rounded-lg border transition-all ${
                    grade === g
                      ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
            <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>Nominal Proportion (C : S : A):</span>
              <span className="font-mono-calc font-bold text-amber-600 dark:text-amber-400">
                {ratios.name}
              </span>
            </div>
          </div>

          {/* Custom ratio inputs */}
          {grade === 'Custom' && (
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Custom Ratio (Cement : Sand : Coarse Aggregates)
              </span>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400">Cement</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={customCement}
                    onChange={(e) => setCustomCement(parseFloat(e.target.value) || 1)}
                    className="w-full px-2 py-1.5 text-xs rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400">Sand</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={customSand}
                    onChange={(e) => setCustomSand(parseFloat(e.target.value) || 1.5)}
                    className="w-full px-2 py-1.5 text-xs rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400">Aggregate</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={customAgg}
                    onChange={(e) => setCustomAgg(parseFloat(e.target.value) || 3)}
                    className="w-full px-2 py-1.5 text-xs rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Wet Concrete Volume Input */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Wet Concrete Volume (m³)
              </label>
              <span className="text-[11px] text-slate-400 font-mono-calc">
                ≈ {(wetVolume * 35.3147).toFixed(1)} cft
              </span>
            </div>
            <div className="relative">
              <input
                id="concrete-volume-input"
                type="number"
                min="0.1"
                step="0.5"
                value={wetVolume}
                onChange={(e) => setWetVolume(Math.max(0.1, parseFloat(e.target.value) || 1))}
                className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono-calc font-semibold focus:outline-none focus:border-amber-500"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                Cubic Meters
              </span>
            </div>
          </div>

          {/* Dry Volume Factor & Water-Cement Ratio */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                Dry Volume Factor
              </label>
              <input
                type="number"
                step="0.01"
                min="1.4"
                max="1.7"
                value={dryFactor}
                onChange={(e) => setDryFactor(parseFloat(e.target.value) || 1.54)}
                className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono-calc"
              />
              <span className="text-[10px] text-slate-400">Standard: 1.54 (54% increase)</span>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                Water / Cement (W/C)
              </label>
              <input
                type="number"
                step="0.02"
                min="0.4"
                max="0.65"
                value={wcRatio}
                onChange={(e) => setWcRatio(parseFloat(e.target.value) || 0.5)}
                className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono-calc"
              />
              <span className="text-[10px] text-slate-400">IS 456 range: 0.45 - 0.55</span>
            </div>
          </div>

          {/* Mix Ratio Visual Distribution */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5 flex justify-between">
              <span>Volumetric Ingredient Distribution</span>
              <span className="text-amber-500 font-mono-calc">Total Parts: {(ratios.c + ratios.s + ratios.a).toFixed(2)}</span>
            </div>
            <div className="h-3 w-full rounded-full overflow-hidden flex bg-slate-200 dark:bg-slate-700">
              <div
                style={{ width: `${(ratios.c / (ratios.c + ratios.s + ratios.a)) * 100}%` }}
                className="bg-amber-500"
                title="Cement"
              />
              <div
                style={{ width: `${(ratios.s / (ratios.c + ratios.s + ratios.a)) * 100}%` }}
                className="bg-amber-300"
                title="Sand"
              />
              <div
                style={{ width: `${(ratios.a / (ratios.c + ratios.s + ratios.a)) * 100}%` }}
                className="bg-slate-500 dark:bg-slate-400"
                title="Aggregate"
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span className="text-amber-600 font-semibold">● Cement ({((ratios.c / (ratios.c + ratios.s + ratios.a)) * 100).toFixed(0)}%)</span>
              <span className="text-amber-400 font-semibold">● Sand ({((ratios.s / (ratios.c + ratios.s + ratios.a)) * 100).toFixed(0)}%)</span>
              <span className="text-slate-400 font-semibold">● Aggregate ({((ratios.a / (ratios.c + ratios.s + ratios.a)) * 100).toFixed(0)}%)</span>
            </div>
          </div>

          <div className="p-3 bg-amber-500/5 dark:bg-amber-400/5 rounded-xl border border-amber-500/20 text-xs text-slate-600 dark:text-slate-400 flex items-start space-x-2">
            <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              Standard dry volume formula: <strong>Dry Volume = 1.54 × Wet Volume</strong>. Cement density is taken as <strong>1,440 kg/m³</strong> (50 kg per bag).
            </p>
          </div>
        </div>

        {/* Right Output Results Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 1. Cement Card */}
            <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  1. Cement Required
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                  50 kg / bag
                </span>
              </div>
              <div className="flex items-baseline space-x-2 mb-2">
                <span className="text-3xl font-black text-slate-900 dark:text-white font-mono-calc">
                  {results.cementBags}
                </span>
                <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
                  Bags
                </span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-2 flex justify-between font-mono-calc">
                <span>Total Weight:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  {results.cementKg} kg ({(results.cementKg / 1000).toFixed(2)} tonnes)
                </span>
              </div>
            </div>

            {/* 2. Sand Card */}
            <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  2. Sand (Fine Aggregate)
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  Zone II / III
                </span>
              </div>
              <div className="flex items-baseline space-x-2 mb-2">
                <span className="text-3xl font-black text-slate-900 dark:text-white font-mono-calc">
                  {results.sandCubicMeters}
                </span>
                <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
                  m³
                </span>
                <span className="text-xs text-slate-400 font-mono-calc">
                  ({results.sandCubicFeet} cft)
                </span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-2 flex justify-between font-mono-calc">
                <span>Estimated Weight:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  {results.sandKg} kg ({(results.sandKg / 1000).toFixed(2)} tonnes)
                </span>
              </div>
            </div>

            {/* 3. Coarse Aggregate Card */}
            <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  3. Coarse Aggregate
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  10mm - 20mm
                </span>
              </div>
              <div className="flex items-baseline space-x-2 mb-2">
                <span className="text-3xl font-black text-slate-900 dark:text-white font-mono-calc">
                  {results.aggregateCubicMeters}
                </span>
                <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
                  m³
                </span>
                <span className="text-xs text-slate-400 font-mono-calc">
                  ({results.aggregateCubicFeet} cft)
                </span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-2 flex justify-between font-mono-calc">
                <span>Estimated Weight:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  {results.aggregateKg} kg ({(results.aggregateKg / 1000).toFixed(2)} tonnes)
                </span>
              </div>
            </div>

            {/* 4. Water Quantity Card */}
            <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  4. Water Quantity
                </span>
                <div className="flex items-center text-cyan-500 space-x-1">
                  <Droplet className="w-3.5 h-3.5 fill-current" />
                  <span className="text-[10px] font-bold">W/C: {wcRatio}</span>
                </div>
              </div>
              <div className="flex items-baseline space-x-2 mb-2">
                <span className="text-3xl font-black text-cyan-600 dark:text-cyan-400 font-mono-calc">
                  {results.waterLiters}
                </span>
                <span className="text-sm font-bold text-cyan-600 dark:text-cyan-400">
                  Liters
                </span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-2 flex justify-between font-mono-calc">
                <span>Equivalent Volume:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  {(results.waterLiters / 1000).toFixed(2)} m³
                </span>
              </div>
            </div>
          </div>

          {/* Quick Summary Table */}
          <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
              Batch Summary Specification for {results.wetVolume} m³
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="py-2.5 px-3">Material</th>
                    <th className="py-2.5 px-3">Volume (m³)</th>
                    <th className="py-2.5 px-3">Volume (cft)</th>
                    <th className="py-2.5 px-3">Weight (kg)</th>
                    <th className="py-2.5 px-3">Practical Units</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300 font-mono-calc">
                  <tr>
                    <td className="py-2 px-3 font-sans font-bold text-amber-600 dark:text-amber-400">Cement</td>
                    <td className="py-2 px-3">{((results.dryVolume * ratios.c) / (ratios.c + ratios.s + ratios.a)).toFixed(3)}</td>
                    <td className="py-2 px-3">{(((results.dryVolume * ratios.c) / (ratios.c + ratios.s + ratios.a)) * 35.3147).toFixed(1)}</td>
                    <td className="py-2 px-3">{results.cementKg}</td>
                    <td className="py-2 px-3 font-bold text-slate-900 dark:text-white font-sans">{results.cementBags} Bags</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-sans font-bold">Sand</td>
                    <td className="py-2 px-3">{results.sandCubicMeters}</td>
                    <td className="py-2 px-3">{results.sandCubicFeet}</td>
                    <td className="py-2 px-3">{results.sandKg}</td>
                    <td className="py-2 px-3 font-sans">{(results.sandCubicFeet / 100).toFixed(2)} Brass</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-sans font-bold">Aggregate</td>
                    <td className="py-2 px-3">{results.aggregateCubicMeters}</td>
                    <td className="py-2 px-3">{results.aggregateCubicFeet}</td>
                    <td className="py-2 px-3">{results.aggregateKg}</td>
                    <td className="py-2 px-3 font-sans">{(results.aggregateCubicFeet / 100).toFixed(2)} Brass</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-sans font-bold text-cyan-600 dark:text-cyan-400">Water</td>
                    <td className="py-2 px-3">{(results.waterLiters / 1000).toFixed(3)}</td>
                    <td className="py-2 px-3">{((results.waterLiters / 1000) * 35.3147).toFixed(1)}</td>
                    <td className="py-2 px-3">{results.waterLiters}</td>
                    <td className="py-2 px-3 font-sans font-bold text-cyan-600 dark:text-cyan-400">{results.waterLiters} Liters</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
