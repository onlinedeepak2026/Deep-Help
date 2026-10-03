import React, { useState, useMemo } from 'react';
import { PointLoad, UdlLoad, SavedCalculation } from '../../types';
import {
  Maximize2,
  Save,
  Printer,
  Plus,
  Trash2,
  CheckCircle2,
  Info,
} from 'lucide-react';

interface BeamCalculatorProps {
  onSaveCalculation: (calc: SavedCalculation) => void;
  onOpenReport: (reportData: { title: string; module: string; summary: string; details: Record<string, string | number> }) => void;
}

export const BeamCalculator: React.FC<BeamCalculatorProps> = ({
  onSaveCalculation,
  onOpenReport,
}) => {
  const [span, setSpan] = useState<number>(6.0); // meters

  // Point loads array
  const [pointLoads, setPointLoads] = useState<PointLoad[]>([
    { id: 'p1', distance: 2.0, magnitude: 20 }, // 20 kN at 2m
    { id: 'p2', distance: 4.5, magnitude: 15 }, // 15 kN at 4.5m
  ]);

  // UDL load
  const [udl, setUdl] = useState<UdlLoad>({
    id: 'udl1',
    start: 0,
    end: 6.0,
    load: 10, // 10 kN/m
  });

  const [hasUdl, setHasUdl] = useState<boolean>(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Compute statics: Ra, Rb, and Max Moment
  const results = useMemo(() => {
    let momentAboutA = 0;
    let totalVerticalLoad = 0;

    // Point loads contribution
    pointLoads.forEach((pl) => {
      const dist = Math.min(span, Math.max(0, pl.distance));
      momentAboutA += pl.magnitude * dist;
      totalVerticalLoad += pl.magnitude;
    });

    // UDL contribution
    if (hasUdl && udl.load > 0) {
      const start = Math.max(0, Math.min(span, udl.start));
      const end = Math.max(start, Math.min(span, udl.end));
      const udlLength = end - start;
      const udlTotal = udl.load * udlLength;
      const udlCentroid = (start + end) / 2;

      momentAboutA += udlTotal * udlCentroid;
      totalVerticalLoad += udlTotal;
    }

    // Reactions:
    // ΣMA = 0 => Rb * span - momentAboutA = 0 => Rb = momentAboutA / span
    const rb = span > 0 ? momentAboutA / span : 0;
    const ra = totalVerticalLoad - rb;

    // Sample bending moment across span to find M_max
    const samplePoints = 120;
    let maxMoment = 0;
    let maxMomentPos = 0;
    const momentPoints: { x: number; v: number; m: number }[] = [];

    for (let i = 0; i <= samplePoints; i++) {
      const x = (span * i) / samplePoints;
      // Shear Force V(x) = Ra - sum(loads to the left of x)
      let vx = ra;
      // Bending Moment M(x) = Ra * x - sum(loads to the left * (x - load_pos))
      let mx = ra * x;

      pointLoads.forEach((pl) => {
        if (x >= pl.distance) {
          vx -= pl.magnitude;
          mx -= pl.magnitude * (x - pl.distance);
        }
      });

      if (hasUdl && udl.load > 0) {
        const uStart = Math.max(0, Math.min(span, udl.start));
        const uEnd = Math.max(uStart, Math.min(span, udl.end));
        if (x > uStart) {
          const loadedLength = Math.min(x, uEnd) - uStart;
          if (loadedLength > 0) {
            const loadPortion = udl.load * loadedLength;
            const centroidDist = x - (uStart + loadedLength / 2);
            vx -= loadPortion;
            mx -= loadPortion * centroidDist;
          }
        }
      }

      momentPoints.push({ x, v: vx, m: mx });

      if (Math.abs(mx) > Math.abs(maxMoment)) {
        maxMoment = mx;
        maxMomentPos = x;
      }
    }

    return {
      ra: Number(ra.toFixed(2)),
      rb: Number(rb.toFixed(2)),
      totalLoad: Number(totalVerticalLoad.toFixed(2)),
      maxMoment: Number(maxMoment.toFixed(2)),
      maxMomentPos: Number(maxMomentPos.toFixed(2)),
      momentPoints,
    };
  }, [span, pointLoads, udl, hasUdl]);

  const addPointLoad = () => {
    const newDist = Number((span / 2).toFixed(1));
    setPointLoads((prev) => [
      ...prev,
      {
        id: 'p-' + Date.now(),
        distance: newDist,
        magnitude: 10,
      },
    ]);
  };

  const removePointLoad = (id: string) => {
    setPointLoads((prev) => prev.filter((p) => p.id !== id));
  };

  const updatePointLoad = (id: string, field: 'distance' | 'magnitude', val: number) => {
    setPointLoads((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: val } : p))
    );
  };

  const handleSave = () => {
    const calc: SavedCalculation = {
      id: 'calc-beam-' + Date.now(),
      timestamp: Date.now(),
      module: 'Beam Load Calculator',
      title: `Simply Supported Beam (${span}m Span)`,
      summary: `Reactions: Ra = ${results.ra} kN, Rb = ${results.rb} kN | Max M = ${results.maxMoment} kN·m @ ${results.maxMomentPos}m`,
      details: {
        'Beam Span (L)': `${span} meters`,
        'Total Vertical Load': `${results.totalLoad} kN`,
        'Support Reaction Ra (Left)': `${results.ra} kN`,
        'Support Reaction Rb (Right)': `${results.rb} kN`,
        'Max Bending Moment (Mmax)': `${results.maxMoment} kN·m`,
        'Location of Max Moment': `${results.maxMomentPos} m from Left Support`,
        'Point Loads': pointLoads.map((p) => `${p.magnitude} kN @ ${p.distance}m`).join('; ') || 'None',
        'UDL Load': hasUdl ? `${udl.load} kN/m from ${udl.start}m to ${udl.end}m` : 'None',
      },
    };
    onSaveCalculation(calc);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handlePrint = () => {
    onOpenReport({
      title: 'Beam Reaction & Structural Analysis Report',
      module: 'Beam Load Calculator',
      summary: `Statics determination of reactions and bending moment for simply supported beam of ${span}m.`,
      details: {
        'Span Length': `${span} meters`,
        'Support Type': 'Simply Supported (Pin Support at A, Roller Support at B)',
        'Left Reaction Ra': `${results.ra} kN (Upward)`,
        'Right Reaction Rb': `${results.rb} kN (Upward)`,
        'Total Applied Downward Load': `${results.totalLoad} kN`,
        'Maximum Bending Moment': `${results.maxMoment} kN·m`,
        'Position of Max Moment': `${results.maxMomentPos} m from Support A`,
        'Point Loads Applied': pointLoads.map((p) => `${p.magnitude} kN at ${p.distance}m`).join(', ') || 'None',
        'Uniformly Distributed Load': hasUdl ? `${udl.load} kN/m (from ${udl.start}m to ${udl.end}m)` : 'None',
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-500 dark:bg-purple-500/20 flex items-center justify-center">
            <Maximize2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Beam Load & Reaction Calculator
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Calculate reaction forces Ra & Rb, maximum bending moment, and shear force for simply supported beams under Point and UDL loads.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            id="beam-save-btn"
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
            id="beam-pdf-btn"
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white transition-colors shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Controls Column */}
        <div className="lg:col-span-5 space-y-5 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Beam Geometry & Load Inputs
          </h3>

          {/* Span Length */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Beam Span Length (L)
              </label>
              <span className="text-[11px] text-slate-400 font-mono-calc">
                ≈ {(span * 3.28084).toFixed(1)} ft
              </span>
            </div>
            <div className="relative">
              <input
                id="beam-span-input"
                type="number"
                min="1"
                step="0.5"
                value={span}
                onChange={(e) => {
                  const s = Math.max(1, parseFloat(e.target.value) || 1);
                  setSpan(s);
                  setUdl((prev) => ({ ...prev, end: s }));
                }}
                className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono-calc font-semibold"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                Meters
              </span>
            </div>
          </div>

          {/* Point Loads Section */}
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Point Loads (Concentrated Loads)
              </label>
              <button
                type="button"
                onClick={addPointLoad}
                className="flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/60 dark:hover:bg-purple-900 text-purple-700 dark:text-purple-300 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Point Load</span>
              </button>
            </div>

            {pointLoads.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No point loads added yet.</p>
            ) : (
              <div className="space-y-2">
                {pointLoads.map((pl, idx) => (
                  <div
                    key={pl.id}
                    className="flex items-center space-x-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700"
                  >
                    <span className="w-5 h-5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[10px] font-bold flex items-center justify-center shrink-0">
                      P{idx + 1}
                    </span>
                    <div className="flex-1">
                      <label className="text-[10px] text-slate-400 block">Load (kN)</label>
                      <input
                        type="number"
                        step="1"
                        value={pl.magnitude}
                        onChange={(e) =>
                          updatePointLoad(pl.id, 'magnitude', parseFloat(e.target.value) || 0)
                        }
                        className="w-full px-2 py-1 text-xs rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white font-mono-calc"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-[10px] text-slate-400 block">From A (m)</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max={span}
                        value={pl.distance}
                        onChange={(e) =>
                          updatePointLoad(
                            pl.id,
                            'distance',
                            Math.min(span, Math.max(0, parseFloat(e.target.value) || 0))
                          )
                        }
                        className="w-full px-2 py-1 text-xs rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white font-mono-calc"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removePointLoad(pl.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 self-end"
                      title="Remove load"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* UDL Section */}
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Uniformly Distributed Load (UDL)
              </label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasUdl}
                  onChange={(e) => setHasUdl(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600" />
              </label>
            </div>

            {hasUdl && (
              <div className="p-3 bg-slate-50 dark:bg-slate-800/70 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                <div>
                  <label className="text-[10px] text-slate-400">UDL Intensity (w in kN/m)</label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    value={udl.load}
                    onChange={(e) => setUdl({ ...udl, load: parseFloat(e.target.value) || 0 })}
                    className="w-full px-2 py-1.5 text-xs rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white font-mono-calc"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400">Start (m from A)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max={span}
                      value={udl.start}
                      onChange={(e) =>
                        setUdl({
                          ...udl,
                          start: Math.max(0, Math.min(span, parseFloat(e.target.value) || 0)),
                        })
                      }
                      className="w-full px-2 py-1.5 text-xs rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white font-mono-calc"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400">End (m from A)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max={span}
                      value={udl.end}
                      onChange={(e) =>
                        setUdl({
                          ...udl,
                          end: Math.max(0, Math.min(span, parseFloat(e.target.value) || span)),
                        })
                      }
                      className="w-full px-2 py-1.5 text-xs rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white font-mono-calc"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Output & Interactive Beam Visualizer */}
        <div className="lg:col-span-7 space-y-4">
          {/* Reaction Results Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Left Reaction (Ra)
              </span>
              <div className="flex items-baseline space-x-1 mt-1">
                <span className="text-2xl font-black text-purple-600 dark:text-purple-400 font-mono-calc">
                  {results.ra}
                </span>
                <span className="text-xs font-bold text-slate-500">kN</span>
              </div>
              <span className="text-[10px] text-slate-400">Support A (Pin)</span>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Right Reaction (Rb)
              </span>
              <div className="flex items-baseline space-x-1 mt-1">
                <span className="text-2xl font-black text-purple-600 dark:text-purple-400 font-mono-calc">
                  {results.rb}
                </span>
                <span className="text-xs font-bold text-slate-500">kN</span>
              </div>
              <span className="text-[10px] text-slate-400">Support B (Roller)</span>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm col-span-2 sm:col-span-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Max Bending Moment
              </span>
              <div className="flex items-baseline space-x-1 mt-1">
                <span className="text-2xl font-black text-amber-500 font-mono-calc">
                  {results.maxMoment}
                </span>
                <span className="text-xs font-bold text-slate-500">kN·m</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono-calc">
                at x = {results.maxMomentPos} m
              </span>
            </div>
          </div>

          {/* Interactive Beam SVG Diagram */}
          <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Interactive Beam Loading Diagram</span>
              <span className="text-purple-600 dark:text-purple-400 text-xs font-mono-calc">
                Total Load: {results.totalLoad} kN
              </span>
            </h4>

            {/* SVG Visualizer */}
            <div className="w-full bg-slate-50 dark:bg-slate-950/60 rounded-xl p-4 border border-slate-200 dark:border-slate-800 overflow-x-auto">
              <svg viewBox="0 0 600 240" className="w-full h-auto min-w-[500px]">
                {/* Coordinate mapping: X=60 to X=540 is span */}
                {/* Base Beam Line */}
                <line x1="60" y1="130" x2="540" y2="130" stroke="currentColor" strokeWidth="8" className="text-slate-700 dark:text-slate-300" strokeLinecap="round" />

                {/* Left Support A (Pin Triangle) */}
                <polygon points="60,134 50,154 70,154" fill="currentColor" className="text-purple-600" />
                <line x1="45" y1="156" x2="75" y2="156" stroke="currentColor" strokeWidth="2" className="text-purple-600" />
                <text x="60" y="172" textAnchor="middle" className="text-[12px] font-extrabold fill-slate-700 dark:fill-slate-300 font-sans">
                  A (Ra = {results.ra} kN)
                </text>

                {/* Right Support B (Roller Circles) */}
                <polygon points="540,134 530,150 550,150" fill="currentColor" className="text-purple-600" />
                <circle cx="535" cy="154" r="3" fill="currentColor" className="text-purple-600" />
                <circle cx="545" cy="154" r="3" fill="currentColor" className="text-purple-600" />
                <line x1="525" y1="158" x2="555" y2="158" stroke="currentColor" strokeWidth="2" className="text-purple-600" />
                <text x="540" y="172" textAnchor="middle" className="text-[12px] font-extrabold fill-slate-700 dark:fill-slate-300 font-sans">
                  B (Rb = {results.rb} kN)
                </text>

                {/* UDL Render (if active) */}
                {hasUdl && udl.load > 0 && (
                  (() => {
                    const uX1 = 60 + (Math.max(0, Math.min(span, udl.start)) / span) * 480;
                    const uX2 = 60 + (Math.max(0, Math.min(span, udl.end)) / span) * 480;
                    const uWidth = Math.max(10, uX2 - uX1);
                    return (
                      <g>
                        <rect
                          x={uX1}
                          y="90"
                          width={uWidth}
                          height="36"
                          fill="currentColor"
                          className="text-amber-500/20 dark:text-amber-400/20"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeDasharray="3 3"
                        />
                        {/* Downward tiny arrows across UDL */}
                        {Array.from({ length: Math.max(2, Math.floor(uWidth / 35)) }).map((_, idx, arr) => {
                          const arrowX = uX1 + (idx + 0.5) * (uWidth / arr.length);
                          return (
                            <g key={idx}>
                              <line x1={arrowX} y1="92" x2={arrowX} y2="124" stroke="#f59e0b" strokeWidth="2" />
                              <polygon points={`${arrowX},126 ${arrowX - 3},120 ${arrowX + 3},120`} fill="#f59e0b" />
                            </g>
                          );
                        })}
                        <text
                          x={uX1 + uWidth / 2}
                          y="82"
                          textAnchor="middle"
                          fill="#f59e0b"
                          className="text-[11px] font-bold font-mono"
                        >
                          w = {udl.load} kN/m
                        </text>
                      </g>
                    );
                  })()
                )}

                {/* Point Loads Downward Arrows */}
                {pointLoads.map((pl, idx) => {
                  const pX = 60 + (Math.min(span, Math.max(0, pl.distance)) / span) * 480;
                  return (
                    <g key={pl.id}>
                      <line x1={pX} y1="40" x2={pX} y2="122" stroke="#a855f7" strokeWidth="3" />
                      <polygon points={`${pX},126 ${pX - 5},114 ${pX + 5},114`} fill="#a855f7" />
                      <text
                        x={pX}
                        y="34"
                        textAnchor="middle"
                        fill="#a855f7"
                        className="text-[11px] font-bold font-mono"
                      >
                        P{idx + 1}: {pl.magnitude} kN
                      </text>
                      <text
                        x={pX}
                        y="200"
                        textAnchor="middle"
                        fill="currentColor"
                        className="text-[10px] text-slate-400 font-mono"
                      >
                        {pl.distance}m
                      </text>
                    </g>
                  );
                })}

                {/* Span Dimension Line */}
                <line x1="60" y1="215" x2="540" y2="215" stroke="currentColor" strokeWidth="1" className="text-slate-400" />
                <line x1="60" y1="210" x2="60" y2="220" stroke="currentColor" strokeWidth="1" className="text-slate-400" />
                <line x1="540" y1="210" x2="540" y2="220" stroke="currentColor" strokeWidth="1" className="text-slate-400" />
                <text x="300" y="230" textAnchor="middle" fill="currentColor" className="text-[12px] font-bold text-slate-600 dark:text-slate-300 font-mono">
                  Span L = {span} meters
                </text>
              </svg>
            </div>

            <div className="mt-4 p-3 bg-purple-500/5 dark:bg-purple-400/5 rounded-xl border border-purple-500/20 text-xs text-slate-600 dark:text-slate-400 flex items-start space-x-2">
              <Info className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed">
                Calculated using fundamental equilibrium equations of statics: <strong>ΣFy = 0</strong> and <strong>ΣMA = 0</strong>. Point loads and partial or full UDL distributed loads are accounted for.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
