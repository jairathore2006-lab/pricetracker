import React from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  HelpCircle,
  Sparkles,
  Info,
} from 'lucide-react';
import { DiscountAnalysis } from '../../types';
import { formatInr } from '../../lib/utils';

interface FakeDiscountBannerProps {
  analysis: DiscountAnalysis;
}

export const FakeDiscountBanner: React.FC<FakeDiscountBannerProps> = ({ analysis }) => {
  const isGenuine = analysis.classification === 'Genuine Deal';
  const isFake = analysis.classification === 'Possible Fake Discount';
  const isAbove = analysis.classification === 'Price Above Average';
  const isNormal = analysis.classification === 'Normal Market Price';

  const badgeTheme = isGenuine
    ? {
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-300',
        text: 'text-emerald-950',
        tagBg: 'bg-emerald-600 text-white',
        icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
      }
    : isFake
    ? {
        bg: 'bg-amber-500/10',
        border: 'border-amber-300',
        text: 'text-amber-950',
        tagBg: 'bg-amber-600 text-white',
        icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
      }
    : isAbove
    ? {
        bg: 'bg-rose-500/10',
        border: 'border-rose-300',
        text: 'text-rose-950',
        tagBg: 'bg-rose-600 text-white',
        icon: <TrendingUp className="w-5 h-5 text-rose-600" />,
      }
    : {
        bg: 'bg-indigo-500/10',
        border: 'border-indigo-300',
        text: 'text-indigo-950',
        tagBg: 'bg-indigo-600 text-white',
        icon: <Info className="w-5 h-5 text-indigo-600" />,
      };

  return (
    <div
      className={`p-5 sm:p-6 rounded-3xl border ${badgeTheme.bg} ${badgeTheme.border} ${badgeTheme.text} shadow-xs space-y-4`}
    >
      {/* Banner Top Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          {badgeTheme.icon}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              PriceWise Discount Authenticity Engine
            </span>
            <h4 className="text-base sm:text-lg font-extrabold leading-tight">
              {analysis.headline}
            </h4>
          </div>
        </div>

        {/* Classification Tag */}
        <span
          className={`self-start sm:self-auto px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-xs ${badgeTheme.tagBg}`}
        >
          {analysis.classification}
        </span>
      </div>

      {/* Honest analytical explanation */}
      <p className="text-xs sm:text-sm leading-relaxed opacity-90 font-medium">
        {analysis.explanation}
      </p>

      {/* Numerical Benchmark Comparison Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-200/60 text-xs">
        <div className="p-2.5 rounded-xl bg-white/80 border border-slate-100">
          <span className="text-slate-400 block text-[10px] uppercase font-semibold">
            Printed MRP
          </span>
          <span className="font-bold text-slate-700 text-sm">
            {formatInr(analysis.listedMrp)}
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-white/80 border border-slate-100">
          <span className="text-slate-400 block text-[10px] uppercase font-semibold">
            Historical Average
          </span>
          <span className="font-bold text-slate-700 text-sm">
            {formatInr(analysis.historicalAverage)}
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-white/80 border border-slate-100">
          <span className="text-slate-400 block text-[10px] uppercase font-semibold">
            Lowest Ever
          </span>
          <span className="font-bold text-emerald-700 text-sm">
            {formatInr(analysis.historicalLowest)}
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-white/80 border border-slate-100">
          <span className="text-slate-400 block text-[10px] uppercase font-semibold">
            Real vs Avg Savings
          </span>
          <span
            className={`font-bold text-sm ${
              analysis.savingsVsAverage >= 0 ? 'text-emerald-700' : 'text-rose-600'
            }`}
          >
            {analysis.savingsVsAverage >= 0 ? '+' : ''}
            {formatInr(analysis.savingsVsAverage)}
          </span>
        </div>
      </div>
    </div>
  );
};
