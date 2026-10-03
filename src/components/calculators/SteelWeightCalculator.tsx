import React, { useState } from 'react';
import {
  Layers,
  Calculator,
  RotateCcw,
  Printer,
  Plus,
  Trash2,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';

interface RebarRow {
  id: string;
  diameterMm: number;
  lengthMeters: number;
  barCount: number;
  memberType: string;
}

const STANDARD_DIAMETERS = [6, 8, 10, 12, 16, 20, 25, 28, 32];

export const SteelWeightCalculator: React.FC = () => {
  const [steelRows, setSteelRows] = useState<RebarRow[]>([
    { id: '1', diameterMm: 12, lengthMeters: 12, barCount: 10, memberType: 'Beam Main Bars' },
    { id: '2', diameterMm: 8, lengthMeters: 1.2, barCount: 50, memberType: 'Stirrups / Rings' },
    { id: '3', diameterMm: 16, lengthMeters: 12, barCount: 8, memberType: 'Column Vertical Bars' },
  ]);

  const [steelPricePerKg, setSteelPricePerKg] = useState<number>(68); // ₹68/kg average Fe500D
  const [wastagePercent, setWastagePercent] = useState<number>(3); // 3% typical site cutting wastage

  const addRow = () => {
    const newId = Date.now().toString();
    setSteelRows([
      ...steelRows,
      { id: newId, diameterMm: 10, lengthMeters: 6, barCount: 10, memberType: 'Slab / Extra Bars' },
    ]);
  };

  const removeRow = (id: string) => {
    if (steelRows.length <= 1) return;
    setSteelRows(steelRows.filter((r) => r.id !== id));
  };

  const updateRow = (id: string, field: keyof RebarRow, value: any) => {
    setSteelRows(
      steelRows.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const resetRows = () => {
    setSteelRows([
      { id: '1', diameterMm: 12, lengthMeters: 12, barCount: 10, memberType: 'Beam Main Bars' },
      { id: '2', diameterMm: 8, lengthMeters: 1.2, barCount: 50, memberType: 'Stirrups / Rings' },
    ]);
  };

  // Calculations per row: Unit weight = (D^2 / 162.28) kg/m
  const calculatedRows = steelRows.map((row) => {
    const unitWeightKgPerM = (row.diameterMm * row.diameterMm) / 162.28;
    const totalLength = row.lengthMeters * row.barCount;
    const totalWeightKg = totalLength * unitWeightKgPerM;
    return {
      ...row,
      unitWeightKgPerM,
      totalLength,
      totalWeightKg,
    };
  });

  const subtotalWeightKg = calculatedRows.reduce((sum, r) => sum + r.totalWeightKg, 0);
  const wastageWeightKg = (subtotalWeightKg * wastagePercent) / 100;
  const grandTotalWeightKg = subtotalWeightKg + wastageWeightKg;
  const grandTotalQuintals = grandTotalWeightKg / 100;
  const grandTotalTonnes = grandTotalWeightKg / 1000;
  const estimatedCost = grandTotalWeightKg * steelPricePerKg;

  // Diameter wise summary
  const diameterSummary: Record<number, { length: number; weightKg: number }> = {};
  calculatedRows.forEach((r) => {
    if (!diameterSummary[r.diameterMm]) {
      diameterSummary[r.diameterMm] = { length: 0, weightKg: 0 };
    }
    diameterSummary[r.diameterMm].length += r.totalLength;
    diameterSummary[r.diameterMm].weightKg += r.totalWeightKg;
  });

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Layers className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                Steel Weight & Bar Bending Calculator
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Standard IS 1786 formula: Weight = (D² / 162.28) kg/m length with wastage & cost estimation.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={resetRows}
              className="px-3 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center space-x-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3 py-2 rounded-xl text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 flex items-center space-x-1 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Sheet</span>
            </button>
          </div>
        </div>

        {/* Global Settings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Steel Rate (₹ per kg)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-xs text-slate-400">₹</span>
              <input
                type="number"
                min="30"
                max="150"
                value={steelPricePerKg}
                onChange={(e) => setSteelPricePerKg(Number(e.target.value) || 0)}
                className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Cutting Wastage (%)
            </label>
            <input
              type="number"
              min="0"
              max="15"
              step="0.5"
              value={wastagePercent}
              onChange={(e) => setWastagePercent(Number(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold text-slate-900 dark:text-white"
            />
          </div>

          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40">
            <div className="text-[11px] font-bold text-amber-800 dark:text-amber-300 flex items-center space-x-1">
              <HelpCircle className="w-3.5 h-3.5 shrink-0" />
              <span>Standard Full Bar Length: 12 meters (40 ft)</span>
            </div>
            <p className="text-[10px] text-amber-700 dark:text-amber-400/90 mt-0.5">
              Fe500D / Fe550D TMT bars typically bundle 10-12 bars per pack (8mm) or 4-5 bars (16mm).
            </p>
          </div>
        </div>
      </div>

      {/* Schedule Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-black text-slate-900 dark:text-white">
            Rebar Cutting Schedule (सरिया तालिका)
          </h3>
          <button
            type="button"
            onClick={addRow}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center space-x-1 cursor-pointer transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Rebar Row</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                <th className="pb-3 pr-2">Member / Description</th>
                <th className="pb-3 px-2">Diameter (mm)</th>
                <th className="pb-3 px-2">Length (m)</th>
                <th className="pb-3 px-2">No. of Bars</th>
                <th className="pb-3 px-2">Unit Wt (kg/m)</th>
                <th className="pb-3 px-2">Total Length</th>
                <th className="pb-3 px-2 text-right">Total Weight</th>
                <th className="pb-3 pl-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {calculatedRows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                  <td className="py-3 pr-2">
                    <input
                      type="text"
                      value={row.memberType}
                      onChange={(e) => updateRow(row.id, 'memberType', e.target.value)}
                      placeholder="e.g. Beam Top"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
                    />
                  </td>
                  <td className="py-3 px-2">
                    <select
                      value={row.diameterMm}
                      onChange={(e) => updateRow(row.id, 'diameterMm', Number(e.target.value))}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                    >
                      {STANDARD_DIAMETERS.map((d) => (
                        <option key={d} value={d}>
                          Ø {d} mm
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 px-2">
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={row.lengthMeters}
                      onChange={(e) => updateRow(row.id, 'lengthMeters', Number(e.target.value) || 0)}
                      className="w-20 px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                    />
                  </td>
                  <td className="py-3 px-2">
                    <input
                      type="number"
                      min="1"
                      value={row.barCount}
                      onChange={(e) => updateRow(row.id, 'barCount', Number(e.target.value) || 1)}
                      className="w-16 px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                    />
                  </td>
                  <td className="py-3 px-2 font-mono text-slate-600 dark:text-slate-300">
                    {row.unitWeightKgPerM.toFixed(3)} kg
                  </td>
                  <td className="py-3 px-2 font-mono text-slate-700 dark:text-slate-200 font-semibold">
                    {row.totalLength.toFixed(1)} m
                  </td>
                  <td className="py-3 px-2 text-right font-mono font-black text-amber-600 dark:text-amber-400">
                    {row.totalWeightKg.toFixed(2)} kg
                  </td>
                  <td className="py-3 pl-2 text-center">
                    <button
                      type="button"
                      onClick={() => removeRow(row.id)}
                      disabled={steelRows.length <= 1}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 disabled:opacity-30 cursor-pointer"
                      title="Delete Row"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Output Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-amber-500 text-slate-950 shadow-md">
          <div className="text-[11px] font-bold uppercase tracking-wider opacity-85">
            Total Steel Weight (कुल वजन)
          </div>
          <div className="text-2xl font-black mt-1">
            {grandTotalWeightKg.toFixed(1)} <span className="text-sm font-bold">kg</span>
          </div>
          <div className="text-xs font-semibold opacity-90 mt-1">
            = {grandTotalQuintals.toFixed(2)} Quintal / {grandTotalTonnes.toFixed(3)} Ton
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Estimated Cost (अनुमानित लागत)
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            ₹{Math.round(estimatedCost).toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            @ ₹{steelPricePerKg}/kg (inc. {wastagePercent}% wastage)
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Cutting Wastage Weight
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {wastageWeightKg.toFixed(1)} <span className="text-sm font-normal text-slate-400">kg</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Subtotal: {subtotalWeightKg.toFixed(1)} kg
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            12m Standard Rebar Equivalent
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {Math.ceil(calculatedRows.reduce((sum, r) => sum + r.totalLength, 0) / 12)}{' '}
            <span className="text-sm font-normal text-slate-400">Bars</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Total length: {calculatedRows.reduce((sum, r) => sum + r.totalLength, 0).toFixed(1)} m
          </div>
        </div>
      </div>

      {/* Diameter Breakup Pill View */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center space-x-1.5">
          <TrendingUp className="w-4 h-4 text-amber-500" />
          <span>Diameter-wise Procurement Summary (व्यास अनुसार खरीदारी)</span>
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {Object.entries(diameterSummary).map(([dia, data]) => (
            <div
              key={dia}
              className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700"
            >
              <div className="text-xs font-black text-amber-600 dark:text-amber-400">
                Ø {dia} mm
              </div>
              <div className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
                {data.weightKg.toFixed(1)} kg
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                {data.length.toFixed(1)} m ({Math.ceil(data.length / 12)} bars)
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
