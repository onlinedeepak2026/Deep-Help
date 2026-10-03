import React, { useState } from 'react';
import {
  Layers3,
  Calculator,
  RotateCcw,
  Sparkles,
  Info,
  Droplets,
  Package,
} from 'lucide-react';

export const CementSandAggregateCalculator: React.FC = () => {
  const [calcType, setCalcType] = useState<'concrete' | 'plaster' | 'flooring'>('plaster');

  // Plaster inputs
  const [plasterAreaSqM, setPlasterAreaSqM] = useState<number>(100);
  const [plasterThicknessMm, setPlasterThicknessMm] = useState<number>(12); // 12mm internal, 15mm/20mm external
  const [plasterRatio, setPlasterRatio] = useState<string>('1:4'); // 1:3, 1:4, 1:5, 1:6

  // Flooring inputs
  const [flooringAreaSqM, setFlooringAreaSqM] = useState<number>(50);
  const [flooringThicknessMm, setFlooringThicknessMm] = useState<number>(50); // 50mm screed
  const [flooringRatio, setFlooringRatio] = useState<string>('1:2:4');

  // Concrete batching inputs
  const [concreteVolM3, setConcreteVolM3] = useState<number>(10);
  const [concreteMixGrade, setConcreteMixGrade] = useState<string>('M20'); // M15 (1:2:4), M20 (1:1.5:3), M25 (1:1:2)

  // Material unit prices
  const [cementBagPrice, setCementBagPrice] = useState<number>(380);
  const [sandPricePerCft, setSandPricePerCft] = useState<number>(55);
  const [aggPricePerCft, setAggPricePerCft] = useState<number>(65);

  // Plaster calculation:
  // Wet volume = Area * (Thickness / 1000)
  // Add 20% for joints & uneven brick surface
  // Dry volume factor for mortar = 1.33
  const plasterWetVol = plasterAreaSqM * (plasterThicknessMm / 1000);
  const plasterWetVolWithUneven = plasterWetVol * 1.2; // 20% unevenness
  const plasterDryVol = plasterWetVolWithUneven * 1.33; // dry factor

  const [cPartsPlaster, sPartsPlaster] = plasterRatio.split(':').map(Number);
  const totalPartsPlaster = cPartsPlaster + sPartsPlaster;
  const cementVolPlasterM3 = (cPartsPlaster / totalPartsPlaster) * plasterDryVol;
  const sandVolPlasterM3 = (sPartsPlaster / totalPartsPlaster) * plasterDryVol;
  const cementBagsPlaster = (cementVolPlasterM3 * 1440) / 50; // 1440 kg/m3 density of cement, 50kg/bag
  const sandCftPlaster = sandVolPlasterM3 * 35.3147;

  // Concrete calculation:
  // Dry volume factor = 1.54
  const concreteDryVol = concreteVolM3 * 1.54;
  let cR = 1, sR = 1.5, aR = 3;
  if (concreteMixGrade === 'M15') { cR = 1; sR = 2; aR = 4; }
  else if (concreteMixGrade === 'M20') { cR = 1; sR = 1.5; aR = 3; }
  else if (concreteMixGrade === 'M25') { cR = 1; sR = 1; aR = 2; }
  else if (concreteMixGrade === 'M10') { cR = 1; sR = 3; aR = 6; }
  const totalConcParts = cR + sR + aR;
  const concCementM3 = (cR / totalConcParts) * concreteDryVol;
  const concSandM3 = (sR / totalConcParts) * concreteDryVol;
  const concAggM3 = (aR / totalConcParts) * concreteDryVol;
  const concCementBags = (concCementM3 * 1440) / 50;
  const concSandCft = concSandM3 * 35.3147;
  const concAggCft = concAggM3 * 35.3147;

  // Active Output selection
  let finalCementBags = 0;
  let finalSandCft = 0;
  let finalAggCft = 0;

  if (calcType === 'plaster') {
    finalCementBags = cementBagsPlaster;
    finalSandCft = sandCftPlaster;
    finalAggCft = 0;
  } else if (calcType === 'concrete') {
    finalCementBags = concCementBags;
    finalSandCft = concSandCft;
    finalAggCft = concAggCft;
  } else {
    // flooring
    const flooringWetVol = flooringAreaSqM * (flooringThicknessMm / 1000);
    const flooringDryVol = flooringWetVol * 1.54;
    finalCementBags = ((1 / 7) * flooringDryVol * 1440) / 50;
    finalSandCft = (2 / 7) * flooringDryVol * 35.3147;
    finalAggCft = (4 / 7) * flooringDryVol * 35.3147;
  }

  const totalCost =
    finalCementBags * cementBagPrice +
    finalSandCft * sandPricePerCft +
    finalAggCft * aggPricePerCft;

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <Layers3 className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                Cement, Sand & Aggregate Batch Calculator
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Accurate raw materials estimation for Wall Plastering, PCC/RCC Batching, and Floor Screeds.
            </p>
          </div>

          {/* Type Switcher */}
          <div className="inline-flex p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setCalcType('plaster')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                calcType === 'plaster'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Wall Plastering
            </button>
            <button
              type="button"
              onClick={() => setCalcType('concrete')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                calcType === 'concrete'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Concrete (RCC/PCC)
            </button>
            <button
              type="button"
              onClick={() => setCalcType('flooring')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                calcType === 'flooring'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Flooring Screed
            </button>
          </div>
        </div>

        {/* Input Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
          {calcType === 'plaster' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Plaster Wall Area (m²)
                </label>
                <input
                  type="number"
                  min="1"
                  value={plasterAreaSqM}
                  onChange={(e) => setPlasterAreaSqM(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold text-slate-900 dark:text-white"
                />
                <span className="text-[10px] text-slate-400">≈ {(plasterAreaSqM * 10.7639).toFixed(0)} sq.ft</span>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Plaster Thickness
                </label>
                <select
                  value={plasterThicknessMm}
                  onChange={(e) => setPlasterThicknessMm(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold text-slate-900 dark:text-white"
                >
                  <option value={12}>12 mm (Standard Internal Wall)</option>
                  <option value={15}>15 mm (Rough Internal / Ceiling)</option>
                  <option value={20}>20 mm (External Double Coat)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Mortar Mix Ratio (Cement : Sand)
                </label>
                <select
                  value={plasterRatio}
                  onChange={(e) => setPlasterRatio(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold text-slate-900 dark:text-white"
                >
                  <option value="1:3">1:3 (Ceiling & Rich Plaster)</option>
                  <option value="1:4">1:4 (Standard External Plaster)</option>
                  <option value="1:5">1:5 (Standard Internal Plaster)</option>
                  <option value="1:6">1:6 (Economical Internal Wall)</option>
                </select>
              </div>
            </>
          )}

          {calcType === 'concrete' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Wet Concrete Volume (m³)
                </label>
                <input
                  type="number"
                  min="0.1"
                  step="0.5"
                  value={concreteVolM3}
                  onChange={(e) => setConcreteVolM3(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold text-slate-900 dark:text-white"
                />
                <span className="text-[10px] text-slate-400">≈ {(concreteVolM3 * 35.3147).toFixed(1)} cft</span>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Concrete Grade
                </label>
                <select
                  value={concreteMixGrade}
                  onChange={(e) => setConcreteMixGrade(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold text-slate-900 dark:text-white"
                >
                  <option value="M10">M10 (1:3:6) - PCC Base</option>
                  <option value="M15">M15 (1:2:4) - General Plain Concrete</option>
                  <option value="M20">M20 (1:1.5:3) - Standard RCC Structure</option>
                  <option value="M25">M25 (1:1:2) - Heavy RCC / Columns</option>
                </select>
              </div>
              <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/40">
                <div className="text-[11px] font-bold text-blue-800 dark:text-blue-300">
                  Dry Factor: 1.54
                </div>
                <div className="text-[10px] text-blue-700 dark:text-blue-400 mt-0.5">
                  Dry volume required = {(concreteVolM3 * 1.54).toFixed(2)} m³ to fill air voids and compaction shrinkage.
                </div>
              </div>
            </>
          )}

          {calcType === 'flooring' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Floor Area (m²)
                </label>
                <input
                  type="number"
                  min="1"
                  value={flooringAreaSqM}
                  onChange={(e) => setFlooringAreaSqM(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Bedding Thickness (mm)
                </label>
                <input
                  type="number"
                  min="20"
                  max="100"
                  value={flooringThicknessMm}
                  onChange={(e) => setFlooringThicknessMm(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Bedding Mix Ratio
                </label>
                <select
                  value={flooringRatio}
                  onChange={(e) => setFlooringRatio(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold text-slate-900 dark:text-white"
                >
                  <option value="1:2:4">1:2:4 (IPS Flooring / Screed)</option>
                  <option value="1:3:6">1:3:6 (Sub-base lean concrete)</option>
                </select>
              </div>
            </>
          )}
        </div>

        {/* Pricing Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/60">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Cement (₹/bag)</label>
            <input
              type="number"
              value={cementBagPrice}
              onChange={(e) => setCementBagPrice(Number(e.target.value) || 0)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Sand (₹/cft)</label>
            <input
              type="number"
              value={sandPricePerCft}
              onChange={(e) => setSandPricePerCft(Number(e.target.value) || 0)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Aggregate (₹/cft)</label>
            <input
              type="number"
              value={aggPricePerCft}
              onChange={(e) => setAggPricePerCft(Number(e.target.value) || 0)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
            />
          </div>
        </div>
      </div>

      {/* Results Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Cement */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>Cement Bags (सीमेंट बोरी)</span>
            <Package className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white mt-1">
            {Math.ceil(finalCementBags)}{' '}
            <span className="text-sm font-bold text-slate-400">Bags</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Exact: {finalCementBags.toFixed(2)} Bags ({(finalCementBags * 50).toFixed(0)} kg)
          </div>
        </div>

        {/* Sand */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>Sand (रेत / बालू)</span>
            <span className="text-xs font-bold text-amber-500">cft / m³</span>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white mt-1">
            {finalSandCft.toFixed(1)}{' '}
            <span className="text-sm font-bold text-slate-400">cft</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            ≈ {(finalSandCft / 35.3147).toFixed(2)} m³ ({(finalSandCft / 100).toFixed(2)} Brass)
          </div>
        </div>

        {/* Aggregate */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>Aggregate (गिट्टी)</span>
            <span className="text-xs font-bold text-indigo-500">10mm/20mm</span>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white mt-1">
            {finalAggCft > 0 ? finalAggCft.toFixed(1) : '—'}{' '}
            <span className="text-sm font-bold text-slate-400">{finalAggCft > 0 ? 'cft' : 'None'}</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {finalAggCft > 0 ? `≈ ${(finalAggCft / 35.3147).toFixed(2)} m³ (${(finalAggCft / 100).toFixed(2)} Brass)` : 'Not required for plaster'}
          </div>
        </div>

        {/* Total Cost */}
        <div className="p-5 rounded-3xl bg-blue-600 text-white shadow-md">
          <div className="text-[11px] font-bold uppercase tracking-wider opacity-85">
            Total Material Cost
          </div>
          <div className="text-2xl font-black mt-1">
            ₹{Math.round(totalCost).toLocaleString('en-IN')}
          </div>
          <div className="text-xs opacity-90 mt-1">
            Cement: ₹{Math.round(finalCementBags * cementBagPrice).toLocaleString('en-IN')} | Sand: ₹{Math.round(finalSandCft * sandPricePerCft).toLocaleString('en-IN')}
          </div>
        </div>
      </div>
    </div>
  );
};
