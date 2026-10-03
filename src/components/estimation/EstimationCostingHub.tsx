import React, { useState } from 'react';
import {
  FileSpreadsheet,
  FileText,
  ClipboardList,
  Coins,
  Plus,
  Trash2,
  Printer,
  RotateCcw,
  Sparkles,
  Download,
  Building,
} from 'lucide-react';

interface MeasurementItem {
  id: string;
  itemNo: string;
  description: string;
  nos: number;
  length: number;
  breadth: number;
  height: number;
  unit: string;
  rate: number;
}

interface EstimationCostingHubProps {
  onSaveCalculation?: (calc: any) => void;
  onOpenReport?: (reportData: any) => void;
}

export const EstimationCostingHub: React.FC<EstimationCostingHubProps> = () => {
  const [activeTab, setActiveTab] = useState<'detailed' | 'abstract' | 'boq' | 'material'>('detailed');

  // Detailed Measurement Sheet Items
  const [items, setItems] = useState<MeasurementItem[]>([
    {
      id: '1',
      itemNo: '1.1',
      description: 'Earthwork excavation in foundation trenches including dressing and ramming',
      nos: 4,
      length: 12.0,
      breadth: 0.9,
      height: 1.0,
      unit: 'm³',
      rate: 280,
    },
    {
      id: '2',
      itemNo: '1.2',
      description: 'Cement concrete 1:4:8 in foundation base bed with 40mm stone ballast',
      nos: 4,
      length: 12.0,
      breadth: 0.9,
      height: 0.15,
      unit: 'm³',
      rate: 4200,
    },
    {
      id: '3',
      itemNo: '1.3',
      description: 'First class brickwork in 1:6 cement mortar in foundation and plinth',
      nos: 4,
      length: 12.0,
      breadth: 0.4,
      height: 0.8,
      unit: 'm³',
      rate: 5800,
    },
    {
      id: '4',
      itemNo: '1.4',
      description: 'Damp Proof Course (DPC) 25mm thick with 1:2:4 cement concrete with water proofing',
      nos: 4,
      length: 12.0,
      breadth: 0.3,
      height: 1.0, // multiplier for m2
      unit: 'm²',
      rate: 340,
    },
    {
      id: '5',
      itemNo: '1.5',
      description: 'First class brickwork in superstructure in 1:6 cement-sand mortar',
      nos: 4,
      length: 12.0,
      breadth: 0.25,
      height: 3.1,
      unit: 'm³',
      rate: 6100,
    },
    {
      id: '6',
      itemNo: '1.6',
      description: 'Reinforced cement concrete M25 in roof slabs, beams and lintels',
      nos: 1,
      length: 12.0,
      breadth: 10.0,
      height: 0.13,
      unit: 'm³',
      rate: 7800,
    },
    {
      id: '7',
      itemNo: '1.7',
      description: '12mm cement plaster 1:4 on interior walls and ceiling with fine sand',
      nos: 8,
      length: 12.0,
      breadth: 3.1,
      height: 1.0,
      unit: 'm²',
      rate: 195,
    },
  ]);

  // Material Calculator Built-up Area
  const [builtUpAreaSqFt, setBuiltUpAreaSqFt] = useState<number>(1000);
  const [numberOfFloors, setNumberOfFloors] = useState<number>(1);
  const [qualityGrade, setQualityGrade] = useState<'Standard' | 'Premium' | 'Luxury'>('Standard');

  // Contractor Tender Margin for BOQ (%)
  const [contractorMarginPercent, setContractorMarginPercent] = useState<number>(2.5); // +2.5% above DSR

  // Add Item
  const addItem = () => {
    const nextNo = (items.length + 1).toString();
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        itemNo: `1.${nextNo}`,
        description: 'New civil measurement item',
        nos: 1,
        length: 5.0,
        breadth: 1.0,
        height: 1.0,
        unit: 'm³',
        rate: 5000,
      },
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length <= 1) return;
    setItems(items.filter((i) => i.id !== id));
  };

  const updateItem = (id: string, field: keyof MeasurementItem, value: any) => {
    setItems(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  };

  // Quantity Calculation: nos * length * breadth * height
  const calculatedItems = items.map((i) => {
    const qty = i.unit === 'm²' ? i.nos * i.length * i.breadth : i.nos * i.length * i.breadth * i.height;
    const amount = qty * i.rate;
    return {
      ...i,
      quantity: qty,
      amount,
    };
  });

  const subtotalEstimate = calculatedItems.reduce((sum, i) => sum + i.amount, 0);
  const contingencyCost = subtotalEstimate * 0.03; // 3%
  const workChargedEst = subtotalEstimate * 0.02; // 2%
  const grandTotalEstimate = subtotalEstimate + contingencyCost + workChargedEst;

  // Tender Value for BOQ
  const tenderGrandTotal = grandTotalEstimate * (1 + contractorMarginPercent / 100);

  // Material Estimation for Built-up Area (thumb rules per sqft built-up)
  const totalArea = builtUpAreaSqFt * numberOfFloors;
  // Thumb rules per sqft of built-up:
  // Cement: ~0.4 to 0.45 bags/sqft
  // Steel: ~3.5 to 4.0 kg/sqft
  // Sand: ~1.8 to 2.0 cft/sqft
  // Aggregate: ~1.4 to 1.6 cft/sqft
  // Bricks: ~20 to 22 bricks/sqft of built-up
  const cementBagsTotal = Math.ceil(totalArea * 0.43);
  const steelKgTotal = Math.round(totalArea * 3.8);
  const steelTonsTotal = (steelKgTotal / 1000).toFixed(2);
  const sandCftTotal = Math.round(totalArea * 1.9);
  const aggCftTotal = Math.round(totalArea * 1.5);
  const bricksTotal = Math.round(totalArea * 21);

  const estimatedMaterialCost =
    cementBagsTotal * 380 +
    steelKgTotal * 68 +
    sandCftTotal * 55 +
    aggCftTotal * 65 +
    bricksTotal * 9.5;

  return (
    <div className="space-y-6">
      {/* Subtab Navigation */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {[
          { id: 'detailed', label: 'Detailed Estimate', hindi: 'विस्तृत प्राक्कलन', icon: FileSpreadsheet },
          { id: 'abstract', label: 'Abstract Estimate', hindi: 'संक्षिप्त लागत विवरण', icon: FileText },
          { id: 'boq', label: 'Bill of Quantity (BOQ)', hindi: 'निविदा अनुसूची (BOQ)', icon: ClipboardList },
          { id: 'material', label: 'Material Cost Calculator', hindi: 'सामग्री लागत गणक', icon: Coins },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                isActive
                  ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-amber-500/40'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className={`p-1.5 rounded-xl ${isActive ? 'bg-slate-950/15' : 'bg-slate-100 dark:bg-slate-800 text-amber-500'}`}>
                  <Icon className="w-4 h-4" />
                </span>
                <span className="text-xs font-black">{tab.label}</span>
              </div>
              <div className={`text-[10px] mt-2 ${isActive ? 'text-slate-900/80 font-bold' : 'text-slate-400'}`}>
                {tab.hindi}
              </div>
            </button>
          );
        })}
      </div>

      {/* ================= 1. DETAILED ESTIMATE ================= */}
      {activeTab === 'detailed' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center space-x-2">
                  <span className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    <FileSpreadsheet className="w-5 h-5" />
                  </span>
                  <span>Detailed Measurement Sheet (विस्तृत मापन पुस्तिका)</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Itemized dimensions (Nos × L × B × H) per standard PWD / CPWD format.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={addItem}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center space-x-1 cursor-pointer transition-colors shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Item</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center space-x-1 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
              </div>
            </div>

            {/* Measurement Table */}
            <div className="overflow-x-auto mt-6">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider">
                    <th className="pb-3 pr-2 w-16">Item No</th>
                    <th className="pb-3 px-2">Particulars of Item</th>
                    <th className="pb-3 px-2 text-center">Nos</th>
                    <th className="pb-3 px-2 text-center">L (m)</th>
                    <th className="pb-3 px-2 text-center">B (m)</th>
                    <th className="pb-3 px-2 text-center">H (m)</th>
                    <th className="pb-3 px-2 text-center">Unit</th>
                    <th className="pb-3 px-2 text-right">Quantity</th>
                    <th className="pb-3 pl-2 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {calculatedItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3 pr-2 font-mono font-bold text-slate-500">
                        <input
                          type="text"
                          value={item.itemNo}
                          onChange={(e) => updateItem(item.id, 'itemNo', e.target.value)}
                          className="w-14 px-1.5 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-center"
                        />
                      </td>
                      <td className="py-3 px-2">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                          className="w-full px-2.5 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                        />
                      </td>
                      <td className="py-3 px-2 text-center">
                        <input
                          type="number"
                          min="1"
                          value={item.nos}
                          onChange={(e) => updateItem(item.id, 'nos', Number(e.target.value) || 1)}
                          className="w-12 px-1 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-center"
                        />
                      </td>
                      <td className="py-3 px-2 text-center">
                        <input
                          type="number"
                          step="0.1"
                          value={item.length}
                          onChange={(e) => updateItem(item.id, 'length', Number(e.target.value) || 0)}
                          className="w-14 px-1 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-center"
                        />
                      </td>
                      <td className="py-3 px-2 text-center">
                        <input
                          type="number"
                          step="0.05"
                          value={item.breadth}
                          onChange={(e) => updateItem(item.id, 'breadth', Number(e.target.value) || 0)}
                          className="w-14 px-1 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-center"
                        />
                      </td>
                      <td className="py-3 px-2 text-center">
                        <input
                          type="number"
                          step="0.05"
                          value={item.height}
                          onChange={(e) => updateItem(item.id, 'height', Number(e.target.value) || 0)}
                          className="w-14 px-1 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-center"
                        />
                      </td>
                      <td className="py-3 px-2 text-center">
                        <select
                          value={item.unit}
                          onChange={(e) => updateItem(item.id, 'unit', e.target.value)}
                          className="px-1.5 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
                        >
                          <option value="m³">m³</option>
                          <option value="m²">m²</option>
                          <option value="m">m</option>
                          <option value="Nos">Nos</option>
                          <option value="Quintal">Quintal</option>
                        </select>
                      </td>
                      <td className="py-3 px-2 text-right font-mono font-black text-slate-900 dark:text-white">
                        {item.quantity.toFixed(2)} {item.unit}
                      </td>
                      <td className="py-3 pl-2 text-center">
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          disabled={items.length <= 1}
                          className="p-1 rounded text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 disabled:opacity-30 cursor-pointer"
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
        </div>
      )}

      {/* ================= 2. ABSTRACT ESTIMATE ================= */}
      {activeTab === 'abstract' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center space-x-2">
                  <span className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    <FileText className="w-5 h-5" />
                  </span>
                  <span>Abstract of Estimated Cost (लागत सार संक्षेप)</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Quantities multiplied with DSR schedule rates + 3% Contingencies + 2% Work-charged establishment.
                </p>
              </div>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center space-x-1 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Abstract</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider">
                    <th className="pb-3 pr-2">Item No</th>
                    <th className="pb-3 px-2">Description</th>
                    <th className="pb-3 px-2 text-right">Quantity</th>
                    <th className="pb-3 px-2 text-center">Unit</th>
                    <th className="pb-3 px-2 text-right">Rate (₹)</th>
                    <th className="pb-3 pl-2 text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {calculatedItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3 pr-2 font-mono font-bold text-slate-500">{item.itemNo}</td>
                      <td className="py-3 px-2 text-slate-700 dark:text-slate-300 font-semibold">{item.description}</td>
                      <td className="py-3 px-2 text-right font-mono font-bold">{item.quantity.toFixed(2)}</td>
                      <td className="py-3 px-2 text-center font-bold text-slate-400">{item.unit}</td>
                      <td className="py-3 px-2 text-right font-mono">
                        <input
                          type="number"
                          value={item.rate}
                          onChange={(e) => updateItem(item.id, 'rate', Number(e.target.value) || 0)}
                          className="w-20 px-1.5 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-right"
                        />
                      </td>
                      <td className="py-3 pl-2 text-right font-mono font-black text-slate-900 dark:text-white">
                        ₹{Math.round(item.amount).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary Breakdown */}
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col items-end space-y-2 text-xs">
              <div className="flex justify-between w-full max-w-sm">
                <span className="text-slate-500 font-bold">Subtotal Amount:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  ₹{Math.round(subtotalEstimate).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between w-full max-w-sm">
                <span className="text-slate-500 font-bold">Add 3% Contingencies:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  ₹{Math.round(contingencyCost).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between w-full max-w-sm">
                <span className="text-slate-500 font-bold">Add 2% Work-Charged Est.:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  ₹{Math.round(workChargedEst).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between w-full max-w-sm pt-2 border-t border-slate-200 dark:border-slate-700 text-sm font-black text-amber-600 dark:text-amber-400">
                <span>Grand Total Estimate:</span>
                <span>₹{Math.round(grandTotalEstimate).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= 3. BOQ (BILL OF QUANTITY) ================= */}
      {activeTab === 'boq' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center space-x-2">
                  <span className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    <ClipboardList className="w-5 h-5" />
                  </span>
                  <span>Tender Schedule & Bill of Quantity (BOQ)</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Ready-to-quote schedule of quantities for government and private construction tenders.
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1.5 text-xs font-bold">
                  <span className="text-slate-500">Contractor Quote:</span>
                  <input
                    type="number"
                    step="0.5"
                    value={contractorMarginPercent}
                    onChange={(e) => setContractorMarginPercent(Number(e.target.value) || 0)}
                    className="w-16 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-center"
                  />
                  <span className="text-slate-500">%</span>
                </div>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center space-x-1 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print BOQ</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider">
                    <th className="pb-3 pr-2">Item No</th>
                    <th className="pb-3 px-2">Schedule Item Description</th>
                    <th className="pb-3 px-2 text-right">Quantity</th>
                    <th className="pb-3 px-2 text-center">Unit</th>
                    <th className="pb-3 px-2 text-right">Estimated Rate</th>
                    <th className="pb-3 px-2 text-right">Dept Amount</th>
                    <th className="pb-3 pl-2 text-right">Quoted Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {calculatedItems.map((item) => {
                    const quotedRate = item.rate * (1 + contractorMarginPercent / 100);
                    return (
                      <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="py-3 pr-2 font-mono font-bold text-slate-500">{item.itemNo}</td>
                        <td className="py-3 px-2 font-semibold text-slate-800 dark:text-slate-200">{item.description}</td>
                        <td className="py-3 px-2 text-right font-mono font-bold">{item.quantity.toFixed(2)}</td>
                        <td className="py-3 px-2 text-center font-bold text-slate-400">{item.unit}</td>
                        <td className="py-3 px-2 text-right font-mono">₹{item.rate.toLocaleString('en-IN')}</td>
                        <td className="py-3 px-2 text-right font-mono font-bold">
                          ₹{Math.round(item.amount).toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 pl-2 text-right font-mono font-black text-amber-600 dark:text-amber-400">
                          ₹{quotedRate.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Total BOQ Box */}
            <div className="mt-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-amber-800 dark:text-amber-300">
                  Departmental Estimated Value: ₹{Math.round(grandTotalEstimate).toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-slate-500">
                  Quoted at {contractorMarginPercent >= 0 ? `+${contractorMarginPercent}% above` : `${contractorMarginPercent}% below`} schedule rates.
                </div>
              </div>
              <div className="text-right">
                <div className="text-[11px] font-bold text-slate-500 uppercase">Tender Quoted Value</div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  ₹{Math.round(tenderGrandTotal).toLocaleString('en-IN')}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= 4. MATERIAL COST CALCULATOR ================= */}
      {activeTab === 'material' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center space-x-2">
              <span className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Coins className="w-5 h-5" />
              </span>
              <span>Project Raw Material Quantity & Cost Breakdown</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Field thumb-rule calculation for residential & commercial building built-up area.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                  Built-Up Area (sq. ft per floor)
                </label>
                <input
                  type="number"
                  min="100"
                  step="50"
                  value={builtUpAreaSqFt}
                  onChange={(e) => setBuiltUpAreaSqFt(Number(e.target.value) || 100)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold"
                />
                <span className="text-[10px] text-slate-400">≈ {(builtUpAreaSqFt / 10.764).toFixed(0)} m²</span>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                  Number of Floors (G + N)
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={numberOfFloors}
                  onChange={(e) => setNumberOfFloors(Number(e.target.value) || 1)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold"
                />
                <span className="text-[10px] text-slate-400">Total Built-Up: {totalArea} sq.ft</span>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                  Construction Quality Grade
                </label>
                <select
                  value={qualityGrade}
                  onChange={(e) => setQualityGrade(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold"
                >
                  <option value="Standard">Standard (₹1,500 - 1,700/sqft)</option>
                  <option value="Premium">Premium (₹1,800 - 2,200/sqft)</option>
                  <option value="Luxury">Luxury (₹2,300+/sqft)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Material Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* Cement */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Cement (सीमेंट)</div>
              <div className="text-xl font-black text-slate-900 dark:text-white mt-1">
                {cementBagsTotal} <span className="text-xs font-bold text-slate-400">Bags</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                ≈ ₹{Math.round(cementBagsTotal * 380).toLocaleString('en-IN')}
              </div>
            </div>

            {/* Steel */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Steel Rebar (सरिया)</div>
              <div className="text-xl font-black text-slate-900 dark:text-white mt-1">
                {steelTonsTotal} <span className="text-xs font-bold text-slate-400">Tons</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                {steelKgTotal} kg (@ ₹68/kg)
              </div>
            </div>

            {/* Sand */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-[10px] font-bold text-slate-400 uppercase">River Sand (बालू)</div>
              <div className="text-xl font-black text-slate-900 dark:text-white mt-1">
                {sandCftTotal} <span className="text-xs font-bold text-slate-400">cft</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                ≈ {(sandCftTotal / 100).toFixed(1)} Brass
              </div>
            </div>

            {/* Aggregate */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Aggregate (गिट्टी)</div>
              <div className="text-xl font-black text-slate-900 dark:text-white mt-1">
                {aggCftTotal} <span className="text-xs font-bold text-slate-400">cft</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                ≈ {(aggCftTotal / 100).toFixed(1)} Brass
              </div>
            </div>

            {/* Bricks */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Red Bricks (ईंटें)</div>
              <div className="text-xl font-black text-slate-900 dark:text-white mt-1">
                {bricksTotal.toLocaleString('en-IN')} <span className="text-xs font-bold text-slate-400">Nos</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                ≈ ₹{Math.round(bricksTotal * 9.5).toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          {/* Grand Budget Banner */}
          <div className="p-6 rounded-3xl bg-amber-500 text-slate-950 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider opacity-85">
                Total Estimated Structural Materials Cost
              </div>
              <div className="text-3xl font-black mt-1">
                ₹{Math.round(estimatedMaterialCost).toLocaleString('en-IN')}
              </div>
              <div className="text-xs font-semibold opacity-90 mt-1">
                For {totalArea} sq. ft built-up area (Civil gray structure materials only)
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/15 backdrop-blur-xs text-xs">
              <div className="font-bold">Approx. Turnkey Finished Cost:</div>
              <div className="text-lg font-black mt-0.5">
                ₹{Math.round(totalArea * (qualityGrade === 'Standard' ? 1650 : qualityGrade === 'Premium' ? 2000 : 2500)).toLocaleString('en-IN')}
              </div>
              <div className="text-[10px] opacity-80 mt-0.5">Includes structure, labor, flooring, plumbing & paints</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
