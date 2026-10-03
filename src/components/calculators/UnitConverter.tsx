import React, { useState, useMemo } from 'react';
import {
  ArrowRightLeft,
  Copy,
  Check,
  Zap,
  Ruler,
  Maximize2,
  Box,
  Scale,
  Gauge,
} from 'lucide-react';

type UnitCategory = 'length' | 'area' | 'volume' | 'weight' | 'pressure';

interface UnitDefinition {
  id: string;
  name: string;
  symbol: string;
  toBase: number; // multiply by to get base unit
}

export const UnitConverter: React.FC = () => {
  const [category, setCategory] = useState<UnitCategory>('length');
  const [inputValue, setInputValue] = useState<number>(1);
  const [fromUnit, setFromUnit] = useState<string>('m');
  const [toUnit, setToUnit] = useState<string>('ft');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Unit definitions relative to a base unit
  const unitsData: Record<UnitCategory, { base: string; units: UnitDefinition[] }> = {
    length: {
      base: 'm',
      units: [
        { id: 'm', name: 'Meter', symbol: 'm', toBase: 1 },
        { id: 'ft', name: 'Feet', symbol: 'ft', toBase: 0.3048 },
        { id: 'in', name: 'Inch', symbol: 'in', toBase: 0.0254 },
        { id: 'mm', name: 'Millimeter', symbol: 'mm', toBase: 0.001 },
        { id: 'cm', name: 'Centimeter', symbol: 'cm', toBase: 0.01 },
        { id: 'yd', name: 'Yard', symbol: 'yd', toBase: 0.9144 },
        { id: 'km', name: 'Kilometer', symbol: 'km', toBase: 1000 },
        { id: 'mi', name: 'Mile', symbol: 'mi', toBase: 1609.344 },
      ],
    },
    area: {
      base: 'm2',
      units: [
        { id: 'm2', name: 'Square Meter', symbol: 'm²', toBase: 1 },
        { id: 'sqft', name: 'Square Feet', symbol: 'sq.ft', toBase: 0.092903 },
        { id: 'sqyd', name: 'Square Yard (Gaj)', symbol: 'sq.yd', toBase: 0.836127 },
        { id: 'acre', name: 'Acre', symbol: 'acre', toBase: 4046.86 },
        { id: 'hectare', name: 'Hectare', symbol: 'ha', toBase: 10000 },
        { id: 'brass_area', name: 'Brass (Area: 100 sq.ft)', symbol: 'Brass', toBase: 9.2903 },
        { id: 'guntha', name: 'Guntha / Cent', symbol: 'guntha', toBase: 101.17 },
      ],
    },
    volume: {
      base: 'm3',
      units: [
        { id: 'm3', name: 'Cubic Meter', symbol: 'm³', toBase: 1 },
        { id: 'cft', name: 'Cubic Feet (CFT)', symbol: 'cft', toBase: 0.0283168 },
        { id: 'liter', name: 'Liter', symbol: 'L', toBase: 0.001 },
        { id: 'gal_us', name: 'Gallon (US)', symbol: 'gal', toBase: 0.00378541 },
        { id: 'brass_vol', name: 'Brass (Volume: 100 CFT)', symbol: 'Brass', toBase: 2.83168 },
        { id: 'cu_in', name: 'Cubic Inch', symbol: 'cu.in', toBase: 0.000016387 },
      ],
    },
    weight: {
      base: 'kg',
      units: [
        { id: 'kg', name: 'Kilogram', symbol: 'kg', toBase: 1 },
        { id: 'ton', name: 'Metric Ton (Tonne)', symbol: 'MT', toBase: 1000 },
        { id: 'quintal', name: 'Quintal', symbol: 'q', toBase: 100 },
        { id: 'lb', name: 'Pound', symbol: 'lb', toBase: 0.453592 },
        { id: 'kn_mass', name: 'Kilonewton (Force @ 9.81 m/s²)', symbol: 'kN', toBase: 101.9716 },
        { id: 'g', name: 'Gram', symbol: 'g', toBase: 0.001 },
      ],
    },
    pressure: {
      base: 'mpa',
      units: [
        { id: 'mpa', name: 'Megapascal', symbol: 'MPa', toBase: 1 },
        { id: 'n_mm2', name: 'N/mm²', symbol: 'N/mm²', toBase: 1 },
        { id: 'kpa', name: 'Kilopascal', symbol: 'kPa', toBase: 0.001 },
        { id: 'bar', name: 'Bar', symbol: 'bar', toBase: 0.1 },
        { id: 'psi', name: 'Pound / sq.inch (psi)', symbol: 'psi', toBase: 0.00689476 },
        { id: 'kg_cm2', name: 'kg/cm²', symbol: 'kg/cm²', toBase: 0.0980665 },
      ],
    },
  };

  // Change category handler
  const handleCategoryChange = (cat: UnitCategory) => {
    setCategory(cat);
    const catUnits = unitsData[cat].units;
    setFromUnit(catUnits[0].id);
    setToUnit(catUnits[1] ? catUnits[1].id : catUnits[0].id);
  };

  // Convert calculation
  const convertedResult = useMemo(() => {
    const activeUnits = unitsData[category].units;
    const fromDef = activeUnits.find((u) => u.id === fromUnit) || activeUnits[0];
    const toDef = activeUnits.find((u) => u.id === toUnit) || activeUnits[1] || activeUnits[0];

    // value in base unit
    const valueInBase = inputValue * fromDef.toBase;
    // value in target unit
    const finalVal = valueInBase / toDef.toBase;

    return {
      value: finalVal,
      fromDef,
      toDef,
      formatted: Number.isInteger(finalVal)
        ? finalVal.toString()
        : Math.abs(finalVal) < 0.0001
        ? finalVal.toExponential(4)
        : finalVal.toLocaleString('en-US', { maximumFractionDigits: 4 }),
    };
  }, [category, inputValue, fromUnit, toUnit, unitsData]);

  // All conversions table
  const allConversions = useMemo(() => {
    const activeUnits = unitsData[category].units;
    const fromDef = activeUnits.find((u) => u.id === fromUnit) || activeUnits[0];
    const valueInBase = inputValue * fromDef.toBase;

    return activeUnits.map((u) => {
      const val = valueInBase / u.toBase;
      return {
        ...u,
        converted:
          Math.abs(val) < 0.001 && val !== 0
            ? val.toExponential(4)
            : val.toLocaleString('en-US', { maximumFractionDigits: 4 }),
      };
    });
  }, [category, inputValue, fromUnit, unitsData]);

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-500 dark:bg-sky-500/20 flex items-center justify-center">
            <ArrowRightLeft className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Civil Engineering Unit Converter
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              High-precision conversion across Length, Area, Volume, Weight, and Pressure with regional units.
            </p>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700">
        {[
          { id: 'length', label: 'Length', icon: <Ruler className="w-4 h-4" /> },
          { id: 'area', label: 'Area', icon: <Maximize2 className="w-4 h-4" /> },
          { id: 'volume', label: 'Volume', icon: <Box className="w-4 h-4" /> },
          { id: 'weight', label: 'Weight & Mass', icon: <Scale className="w-4 h-4" /> },
          { id: 'pressure', label: 'Pressure / Stress', icon: <Gauge className="w-4 h-4" /> },
        ].map((cat) => (
          <button
            key={cat.id}
            id={`unit-category-${cat.id}`}
            onClick={() => handleCategoryChange(cat.id as UnitCategory)}
            className={`flex-1 min-w-[120px] flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
              category === cat.id
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700'
            }`}
          >
            {cat.icon}
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Converter Controls Card */}
        <div className="lg:col-span-6 space-y-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Direct Converter
          </h3>

          {/* Amount input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Enter Value
            </label>
            <input
              id="converter-value-input"
              type="number"
              step="any"
              value={inputValue}
              onChange={(e) => setInputValue(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-3 text-lg rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono-calc font-bold"
            />
          </div>

          <div className="grid grid-cols-5 gap-2 items-center">
            {/* From Unit */}
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                From
              </label>
              <select
                id="converter-from-select"
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="w-full px-3 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-semibold"
              >
                {unitsData[category].units.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.symbol})
                  </option>
                ))}
              </select>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center pt-5">
              <button
                type="button"
                onClick={handleSwap}
                className="p-2.5 rounded-full bg-slate-100 hover:bg-sky-500 hover:text-white dark:bg-slate-800 dark:hover:bg-sky-500 text-slate-600 dark:text-slate-300 transition-colors shadow-xs"
                title="Swap Units"
              >
                <ArrowRightLeft className="w-4 h-4" />
              </button>
            </div>

            {/* To Unit */}
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                To
              </label>
              <select
                id="converter-to-select"
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="w-full px-3 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-semibold"
              >
                {unitsData[category].units.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Result Card */}
          <div className="p-5 bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800/60 rounded-2xl">
            <div className="flex items-center justify-between text-xs font-bold text-sky-700 dark:text-sky-300 mb-1">
              <span>Conversion Result</span>
              <button
                type="button"
                onClick={() => handleCopy(convertedResult.formatted, 'main-result')}
                className="flex items-center space-x-1 text-[11px] text-sky-600 hover:text-sky-800 dark:text-sky-400"
              >
                {copiedKey === 'main-result' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-mono-calc">
                {convertedResult.formatted}
              </span>
              <span className="text-lg font-bold text-sky-600 dark:text-sky-400">
                {convertedResult.toDef.symbol}
              </span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-mono-calc">
              {inputValue} {convertedResult.fromDef.symbol} = {convertedResult.formatted}{' '}
              {convertedResult.toDef.symbol}
            </div>
          </div>

          {/* Civil Engineering Field Quick Cheat-Sheet */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Civil Site Rule-of-Thumb Equivalencies</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-400 font-mono-calc">
              <div>• 1 Bag Cement = 50 kg (1.226 cft)</div>
              <div>• 1 m³ Water = 1,000 Liters</div>
              <div>• 1 Brass Sand/Agg = 100 cft (2.83 m³)</div>
              <div>• 1 Tonne = 20 Bags Cement</div>
              <div>• 1 MPa = 1 N/mm² = 145.038 psi</div>
              <div>• 1 Acre = 43,560 sq.ft (4047 m²)</div>
            </div>
          </div>
        </div>

        {/* Simultaneous Multi-Unit Output Grid */}
        <div className="lg:col-span-6 space-y-3 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Simultaneous Equivalents for {inputValue} {unitsData[category].units.find((u) => u.id === fromUnit)?.symbol}
            </h3>
            <span className="text-[10px] text-slate-400">All Units in Category</span>
          </div>

          <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
            {allConversions.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    {item.name}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono-calc">
                    Symbol: {item.symbol}
                  </span>
                </div>
                <div className="flex items-center space-x-2 font-mono-calc">
                  <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {item.converted}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(item.converted, item.id)}
                    className="p-1 text-slate-400 hover:text-sky-500"
                    title="Copy value"
                  >
                    {copiedKey === item.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
