import React, { useState, useMemo } from 'react';
import { SurveyStation, SavedCalculation } from '../../types';
import {
  Ruler,
  Save,
  Printer,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  BookOpen,
  Info,
} from 'lucide-react';

interface SurveyingCalculatorProps {
  onSaveCalculation: (calc: SavedCalculation) => void;
  onOpenReport: (reportData: { title: string; module: string; summary: string; details: Record<string, string | number> }) => void;
}

export const SurveyingCalculator: React.FC<SurveyingCalculatorProps> = ({
  onSaveCalculation,
  onOpenReport,
}) => {
  const [method, setMethod] = useState<'HI' | 'RiseFall'>('HI');
  const [initialRL, setInitialRL] = useState<number>(100.0); // Benchmark RL
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Stations state
  const [stations, setStations] = useState<SurveyStation[]>([
    {
      id: 'st-1',
      stationName: 'BM 1',
      bs: 1.455,
      is: null,
      fs: null,
      remarks: 'Benchmark on culvert parapet',
    },
    {
      id: 'st-2',
      stationName: 'Station A',
      bs: null,
      is: 2.125,
      fs: null,
      remarks: 'Ground point',
    },
    {
      id: 'st-3',
      stationName: 'Station B (CP 1)',
      bs: 0.985,
      is: null,
      fs: 1.84,
      remarks: 'Change Point 1 on peg',
    },
    {
      id: 'st-4',
      stationName: 'Station C',
      bs: null,
      is: 1.625,
      fs: null,
      remarks: 'Road center',
    },
    {
      id: 'st-5',
      stationName: 'TBM 2',
      bs: null,
      is: null,
      fs: 2.41,
      remarks: 'Closing point',
    },
  ]);

  // Compute Leveling Table based on method
  const computedData = useMemo(() => {
    let currentHI = initialRL + (stations[0]?.bs || 0);
    let currentRL = initialRL;
    let previousStaffReading = stations[0]?.bs ?? 0;

    let sumBS = 0;
    let sumFS = 0;
    let sumRise = 0;
    let sumFall = 0;

    const computedRows = stations.map((st, index) => {
      let hiVal: number | null = null;
      let rlVal: number | null = null;
      let riseVal: number | null = null;
      let fallVal: number | null = null;

      if (st.bs !== null) sumBS += st.bs;
      if (st.fs !== null) sumFS += st.fs;

      const currentReading =
        st.bs !== null && index === 0
          ? st.bs
          : st.is !== null
          ? st.is
          : st.fs !== null
          ? st.fs
          : st.bs ?? 0;

      if (index === 0) {
        // First benchmark station
        rlVal = initialRL;
        if (st.bs !== null) {
          currentHI = initialRL + st.bs;
          hiVal = currentHI;
        }
        previousStaffReading = st.bs ?? 0;
      } else {
        // Intermediate or change stations
        if (method === 'HI') {
          if (st.is !== null) {
            rlVal = currentHI - st.is;
            currentRL = rlVal;
          } else if (st.fs !== null) {
            rlVal = currentHI - st.fs;
            currentRL = rlVal;
            if (st.bs !== null) {
              // It's a change point: new HI = new RL + new BS
              currentHI = currentRL + st.bs;
              hiVal = currentHI;
            }
          }
        } else {
          // Rise & Fall Method
          // Difference = Previous Reading - Current Reading
          const diff = previousStaffReading - currentReading;
          if (diff > 0) {
            riseVal = diff;
            sumRise += diff;
            currentRL += diff;
          } else if (diff < 0) {
            fallVal = Math.abs(diff);
            sumFall += Math.abs(diff);
            currentRL -= Math.abs(diff);
          }
          rlVal = currentRL;

          if (st.bs !== null) {
            // New reading starting for change point
            previousStaffReading = st.bs;
          } else {
            previousStaffReading = currentReading;
          }
        }
      }

      return {
        ...st,
        hi: hiVal !== null ? Number(hiVal.toFixed(3)) : null,
        rise: riseVal !== null ? Number(riseVal.toFixed(3)) : null,
        fall: fallVal !== null ? Number(fallVal.toFixed(3)) : null,
        rl: rlVal !== null ? Number(rlVal.toFixed(3)) : null,
      };
    });

    const firstRL = computedRows[0]?.rl ?? initialRL;
    const lastRL = computedRows[computedRows.length - 1]?.rl ?? initialRL;

    const diffBS_FS = Number((sumBS - sumFS).toFixed(3));
    const diffRise_Fall = Number((sumRise - sumFall).toFixed(3));
    const diffLast_FirstRL = Number((lastRL - firstRL).toFixed(3));

    // Check pass condition
    const check1 = Math.abs(diffBS_FS - diffLast_FirstRL) < 0.005;
    const checkPassed = method === 'HI' ? check1 : check1 && Math.abs(diffRise_Fall - diffLast_FirstRL) < 0.005;

    return {
      rows: computedRows,
      sumBS: Number(sumBS.toFixed(3)),
      sumFS: Number(sumFS.toFixed(3)),
      sumRise: Number(sumRise.toFixed(3)),
      sumFall: Number(sumFall.toFixed(3)),
      firstRL,
      lastRL,
      diffBS_FS,
      diffRise_Fall,
      diffLast_FirstRL,
      checkPassed,
    };
  }, [stations, initialRL, method]);

  // Handle station input changes
  const updateStation = (id: string, field: keyof SurveyStation, val: any) => {
    setStations((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        return {
          ...s,
          [field]: val === '' || isNaN(val) ? (field === 'remarks' || field === 'stationName' ? val : null) : val,
        };
      })
    );
  };

  const addStation = () => {
    const newId = 'st-' + Date.now();
    setStations((prev) => [
      ...prev,
      {
        id: newId,
        stationName: `Station ${prev.length + 1}`,
        bs: null,
        is: 1.5,
        fs: null,
        remarks: '',
      },
    ]);
  };

  const deleteStation = (id: string) => {
    if (stations.length <= 2) return;
    setStations((prev) => prev.filter((s) => s.id !== id));
  };

  const resetSampleData = () => {
    setInitialRL(100.0);
    setStations([
      { id: 'st-1', stationName: 'BM 1', bs: 1.455, is: null, fs: null, remarks: 'Benchmark' },
      { id: 'st-2', stationName: 'Point A', bs: null, is: 2.125, fs: null, remarks: 'Ground' },
      { id: 'st-3', stationName: 'Point B (CP 1)', bs: 0.985, is: null, fs: 1.84, remarks: 'Change Point' },
      { id: 'st-4', stationName: 'Point C', bs: null, is: 1.625, fs: null, remarks: 'Road center' },
      { id: 'st-5', stationName: 'TBM 2', bs: null, is: null, fs: 2.41, remarks: 'Closing' },
    ]);
  };

  const handleSave = () => {
    const calc: SavedCalculation = {
      id: 'calc-survey-' + Date.now(),
      timestamp: Date.now(),
      module: 'Surveying Calculator',
      title: `Leveling Book (${method} Method) - ${stations.length} Stations`,
      summary: `First RL: ${computedData.firstRL} m, Last RL: ${computedData.lastRL} m (Check: ${computedData.checkPassed ? 'PASSED' : 'CHECK FAILS'})`,
      details: {
        Method: method === 'HI' ? 'Height of Instrument (Collimation)' : 'Rise & Fall Method',
        'Initial Benchmark RL': `${initialRL} m`,
        'Total Stations': `${stations.length}`,
        'Sum of Back Sights (ΣBS)': `${computedData.sumBS} m`,
        'Sum of Fore Sights (ΣFS)': `${computedData.sumFS} m`,
        'ΣBS - ΣFS': `${computedData.diffBS_FS} m`,
        'Last RL - First RL': `${computedData.diffLast_FirstRL} m`,
        'Arithmetic Check': computedData.checkPassed ? 'PASSED' : 'DISCREPANCY DETECTED',
      },
    };
    onSaveCalculation(calc);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handlePrint = () => {
    onOpenReport({
      title: `Surveying Leveling Field Sheet (${method} Method)`,
      module: 'Surveying Calculator',
      summary: `Differential leveling observations with automatic arithmetic check verification.`,
      details: {
        'Calculation Method': method === 'HI' ? 'Height of Instrument (HI)' : 'Rise and Fall',
        'Benchmark (Initial RL)': `${initialRL} m`,
        'Sum of BS (ΣBS)': `${computedData.sumBS} m`,
        'Sum of FS (ΣFS)': `${computedData.sumFS} m`,
        'Difference (ΣBS - ΣFS)': `${computedData.diffBS_FS} m`,
        ...(method === 'RiseFall'
          ? {
              'Sum of Rise (ΣRise)': `${computedData.sumRise} m`,
              'Sum of Fall (ΣFall)': `${computedData.sumFall} m`,
              'Difference (ΣRise - ΣFall)': `${computedData.diffRise_Fall} m`,
            }
          : {}),
        'First Station RL': `${computedData.firstRL} m`,
        'Closing Station RL': `${computedData.lastRL} m`,
        'Difference (Last RL - First RL)': `${computedData.diffLast_FirstRL} m`,
        'Arithmetic Check Status': computedData.checkPassed ? 'VERIFIED PASSED' : 'CHECK FAILED',
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-500 dark:bg-indigo-500/20 flex items-center justify-center">
            <Ruler className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Surveying & Leveling Calculator
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Compute Reduced Levels (RL) using Height of Instrument (HI) or Rise & Fall method with automated arithmetic checks.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            id="survey-reset-btn"
            onClick={resetSampleData}
            className="p-2 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
            title="Reset to sample leveling readings"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            id="survey-save-btn"
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
                <span>Save Sheet</span>
              </>
            )}
          </button>
          <button
            id="survey-pdf-btn"
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Method Switcher & Initial RL Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center space-x-3">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
            Method:
          </span>
          <div className="inline-flex rounded-xl p-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <button
              id="survey-method-hi"
              type="button"
              onClick={() => setMethod('HI')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                method === 'HI'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Height of Instrument (HI)
            </button>
            <button
              id="survey-method-risefall"
              type="button"
              onClick={() => setMethod('RiseFall')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                method === 'RiseFall'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Rise & Fall Method
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Benchmark (Initial RL):
          </label>
          <div className="relative w-32">
            <input
              id="survey-benchmark-rl"
              type="number"
              step="0.001"
              value={initialRL}
              onChange={(e) => setInitialRL(parseFloat(e.target.value) || 0)}
              className="w-full px-2.5 py-1.5 text-xs font-mono-calc font-bold rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">
              m
            </span>
          </div>
        </div>
      </div>

      {/* Arithmetic Check Banner */}
      <div
        className={`p-4 rounded-2xl border transition-all ${
          computedData.checkPassed
            ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
            : 'bg-amber-50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            {computedData.checkPassed ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
            )}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider block">
                {computedData.checkPassed
                  ? 'Arithmetic Check Verified (Balanced Leveling Book)'
                  : 'Arithmetic Check Checkpoint'}
              </span>
              <span className="text-[11px] font-mono-calc opacity-90">
                ΣBS - ΣFS = {computedData.diffBS_FS} m |{' '}
                {method === 'RiseFall' && `ΣRise - ΣFall = ${computedData.diffRise_Fall} m | `}
                Last RL - First RL = {computedData.diffLast_FirstRL} m
              </span>
            </div>
          </div>

          <span
            className={`text-xs font-black px-2.5 py-1 rounded-full uppercase tracking-wider self-start sm:self-auto ${
              computedData.checkPassed
                ? 'bg-emerald-200 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-200'
                : 'bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-200'
            }`}
          >
            {computedData.checkPassed ? 'Check Passed' : 'In Progress'}
          </span>
        </div>
      </div>

      {/* Interactive Leveling Field Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Field Leveling Book ({method === 'HI' ? 'Height of Instrument Method' : 'Rise & Fall Method'})
          </h3>
          <button
            id="survey-add-station-btn"
            type="button"
            onClick={addStation}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Station</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-2.5 px-3">Station</th>
                <th className="py-2.5 px-3">BS (m)</th>
                <th className="py-2.5 px-3">IS (m)</th>
                <th className="py-2.5 px-3">FS (m)</th>
                {method === 'HI' ? (
                  <th className="py-2.5 px-3 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300">
                    HI (m)
                  </th>
                ) : (
                  <>
                    <th className="py-2.5 px-3 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300">
                      Rise (m)
                    </th>
                    <th className="py-2.5 px-3 bg-rose-50/50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300">
                      Fall (m)
                    </th>
                  </>
                )}
                <th className="py-2.5 px-3 bg-amber-50/50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300">
                  RL (m)
                </th>
                <th className="py-2.5 px-3">Remarks</th>
                <th className="py-2.5 px-2 text-center w-10">Act</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200 font-mono-calc">
              {computedData.rows.map((st, i) => (
                <tr key={st.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                  {/* Station Name */}
                  <td className="py-2 px-3">
                    <input
                      type="text"
                      value={st.stationName}
                      onChange={(e) => updateStation(st.id, 'stationName', e.target.value)}
                      className="w-24 px-1.5 py-1 text-xs rounded bg-transparent border border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 font-sans font-semibold"
                    />
                  </td>

                  {/* Back Sight (BS) */}
                  <td className="py-2 px-3">
                    <input
                      type="number"
                      step="0.001"
                      placeholder="-"
                      value={st.bs !== null ? st.bs : ''}
                      onChange={(e) =>
                        updateStation(st.id, 'bs', e.target.value === '' ? null : parseFloat(e.target.value))
                      }
                      className="w-20 px-1.5 py-1 text-xs rounded bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 font-mono-calc"
                    />
                  </td>

                  {/* Intermediate Sight (IS) */}
                  <td className="py-2 px-3">
                    <input
                      type="number"
                      step="0.001"
                      placeholder="-"
                      value={st.is !== null ? st.is : ''}
                      onChange={(e) =>
                        updateStation(st.id, 'is', e.target.value === '' ? null : parseFloat(e.target.value))
                      }
                      className="w-20 px-1.5 py-1 text-xs rounded bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 font-mono-calc"
                    />
                  </td>

                  {/* Fore Sight (FS) */}
                  <td className="py-2 px-3">
                    <input
                      type="number"
                      step="0.001"
                      placeholder="-"
                      value={st.fs !== null ? st.fs : ''}
                      onChange={(e) =>
                        updateStation(st.id, 'fs', e.target.value === '' ? null : parseFloat(e.target.value))
                      }
                      className="w-20 px-1.5 py-1 text-xs rounded bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 font-mono-calc"
                    />
                  </td>

                  {/* HI Method: HI */}
                  {method === 'HI' && (
                    <td className="py-2 px-3 font-bold bg-indigo-50/30 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400">
                      {st.hi !== null ? st.hi.toFixed(3) : '-'}
                    </td>
                  )}

                  {/* Rise & Fall Method */}
                  {method === 'RiseFall' && (
                    <>
                      <td className="py-2 px-3 font-bold bg-emerald-50/30 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400">
                        {st.rise !== null ? st.rise.toFixed(3) : '-'}
                      </td>
                      <td className="py-2 px-3 font-bold bg-rose-50/30 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400">
                        {st.fall !== null ? st.fall.toFixed(3) : '-'}
                      </td>
                    </>
                  )}

                  {/* Calculated RL */}
                  <td className="py-2 px-3 font-extrabold bg-amber-50/30 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400">
                    {st.rl !== null ? st.rl.toFixed(3) : '-'}
                  </td>

                  {/* Remarks */}
                  <td className="py-2 px-3">
                    <input
                      type="text"
                      placeholder="Remarks..."
                      value={st.remarks}
                      onChange={(e) => updateStation(st.id, 'remarks', e.target.value)}
                      className="w-full min-w-[120px] px-1.5 py-1 text-xs rounded bg-transparent border border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-indigo-500 font-sans"
                    />
                  </td>

                  {/* Action delete */}
                  <td className="py-2 px-2 text-center">
                    <button
                      type="button"
                      onClick={() => deleteStation(st.id)}
                      disabled={stations.length <= 2}
                      className="p-1 text-slate-400 hover:text-rose-500 disabled:opacity-30"
                      title="Delete station row"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

            {/* Totals Footer Row */}
            <tfoot className="bg-slate-100 dark:bg-slate-800 font-extrabold border-t border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono-calc">
              <tr>
                <td className="py-2.5 px-3 font-sans">Total:</td>
                <td className="py-2.5 px-3">ΣBS = {computedData.sumBS}</td>
                <td className="py-2.5 px-3">-</td>
                <td className="py-2.5 px-3">ΣFS = {computedData.sumFS}</td>
                {method === 'HI' ? (
                  <td className="py-2.5 px-3">-</td>
                ) : (
                  <>
                    <td className="py-2.5 px-3 text-emerald-600 dark:text-emerald-400">
                      ΣRise = {computedData.sumRise}
                    </td>
                    <td className="py-2.5 px-3 text-rose-600 dark:text-rose-400">
                      ΣFall = {computedData.sumFall}
                    </td>
                  </>
                )}
                <td className="py-2.5 px-3 text-amber-600 dark:text-amber-400">
                  Last RL: {computedData.lastRL}
                </td>
                <td colSpan={2} className="py-2.5 px-3 font-sans text-right text-[11px]">
                  Diff: {computedData.diffBS_FS} m
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
