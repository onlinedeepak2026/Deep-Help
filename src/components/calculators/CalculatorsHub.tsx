import React, { useState } from 'react';
import {
  Layers,
  Box,
  Building2,
  Scale,
  RefreshCw,
  Calculator,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { ConcreteCalculator } from './ConcreteCalculator';
import { BrickCalculator } from './BrickCalculator';
import { SteelWeightCalculator } from './SteelWeightCalculator';
import { CementSandAggregateCalculator } from './CementSandAggregateCalculator';
import { UnitConverter } from './UnitConverter';

interface CalculatorsHubProps {
  initialSubTab?: 'concrete' | 'brick' | 'steel' | 'mix' | 'converter';
  initialTool?: string;
  onSaveCalculation?: (calc: any) => void;
  onOpenReport?: (reportData: any) => void;
}

export const CalculatorsHub: React.FC<CalculatorsHubProps> = ({
  initialSubTab = 'concrete',
  initialTool,
  onSaveCalculation,
  onOpenReport,
}) => {
  const [activeCalc, setActiveCalc] = useState<'concrete' | 'brick' | 'steel' | 'mix' | 'converter'>(
    (initialTool as any) || initialSubTab
  );

  const calcTabs = [
    {
      id: 'concrete' as const,
      name: 'Concrete Quantity',
      hindiName: 'कंक्रीट मात्रा',
      icon: Box,
      desc: 'IS 456 M5-M25 grades, wet-to-dry 1.54, water-cement ratio',
    },
    {
      id: 'brick' as const,
      name: 'Brickwork Calculator',
      hindiName: 'ईंट चिनाई',
      icon: Building2,
      desc: 'Standard/Modular bricks, mortar ratios 1:3 - 1:6, deductions & wastage',
    },
    {
      id: 'steel' as const,
      name: 'Steel Weight Calculator',
      hindiName: 'सरिया वजन (D²/162)',
      icon: Scale,
      desc: 'D²/162.28 formula, 6mm-32mm rebar cutting schedule, cost & tonnes',
    },
    {
      id: 'mix' as const,
      name: 'Cement, Sand & Aggregate',
      hindiName: 'सीमेंट, बालू एवं गिट्टी',
      icon: Layers,
      desc: 'Wall plastering 12/15/20mm, flooring screed, batching quantities',
    },
    {
      id: 'converter' as const,
      name: 'Civil Unit Converter',
      hindiName: 'यूनिट कन्वर्टर',
      icon: RefreshCw,
      desc: 'm, cm, ft, inch, sqft, bigha, m³, cft, brass, MPa, psi',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Subtab Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {calcTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeCalc === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveCalc(tab.id)}
              className={`p-3.5 rounded-2xl text-left transition-all border cursor-pointer flex flex-col justify-between ${
                isActive
                  ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md scale-[1.02]'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-amber-500/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`p-2 rounded-xl ${
                    isActive
                      ? 'bg-slate-950/15 text-slate-950'
                      : 'bg-slate-100 dark:bg-slate-800 text-amber-600 dark:text-amber-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </span>
                {isActive && (
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-950 text-amber-400">
                    Active
                  </span>
                )}
              </div>
              <div className="mt-2.5">
                <div className="text-xs font-black leading-snug">{tab.name}</div>
                <div
                  className={`text-[10px] font-semibold mt-0.5 ${
                    isActive ? 'text-slate-900/80' : 'text-slate-400'
                  }`}
                >
                  {tab.hindiName}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Render Active Calculator */}
      <div className="transition-all duration-200">
        {activeCalc === 'concrete' && (
          <ConcreteCalculator
            onSaveCalculation={onSaveCalculation || (() => {})}
            onOpenReport={onOpenReport || (() => {})}
          />
        )}
        {activeCalc === 'brick' && (
          <BrickCalculator
            onSaveCalculation={onSaveCalculation || (() => {})}
            onOpenReport={onOpenReport || (() => {})}
          />
        )}
        {activeCalc === 'steel' && <SteelWeightCalculator />}
        {activeCalc === 'mix' && <CementSandAggregateCalculator />}
        {activeCalc === 'converter' && <UnitConverter />}
      </div>
    </div>
  );
};
