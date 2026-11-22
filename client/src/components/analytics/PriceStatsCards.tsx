import React from 'react';
import {
  TrendingDown,
  TrendingUp,
  Award,
  BarChart3,
  DollarSign,
  History,
} from 'lucide-react';
import { HistoricalPriceSummary } from '../../types';
import { formatInr } from '../../lib/utils';

interface PriceStatsCardsProps {
  summary: HistoricalPriceSummary;
}

export const PriceStatsCards: React.FC<PriceStatsCardsProps> = ({ summary }) => {
  const isDrop = summary.percentageChange < 0;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {/* 1. Current Price */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
          Current Best
        </span>
        <div className="mt-1 text-lg sm:text-xl font-extrabold text-slate-900">
          {formatInr(summary.currentPrice)}
        </div>
        <span className="text-[10px] text-slate-400 mt-0.5 block">Live lowest offer</span>
      </div>

      {/* 2. Lowest Recorded */}
      <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 shadow-xs">
        <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
          All-Time Low
        </span>
        <div className="mt-1 text-lg sm:text-xl font-extrabold text-emerald-700">
          {formatInr(summary.lowestPrice)}
        </div>
        <span className="text-[10px] text-emerald-600 mt-0.5 block">Historical best</span>
      </div>

      {/* 3. Average Price */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
          Average Price
        </span>
        <div className="mt-1 text-lg sm:text-xl font-extrabold text-slate-800">
          {formatInr(summary.averagePrice)}
        </div>
        <span className="text-[10px] text-slate-400 mt-0.5 block">Historical benchmark</span>
      </div>

      {/* 4. Highest Recorded */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
          Highest Price
        </span>
        <div className="mt-1 text-lg sm:text-xl font-extrabold text-slate-600">
          {formatInr(summary.highestPrice)}
        </div>
        <span className="text-[10px] text-slate-400 mt-0.5 block">Peak recorded price</span>
      </div>

      {/* 5. Previous Price */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
          Previous Price
        </span>
        <div className="mt-1 text-lg sm:text-xl font-extrabold text-slate-700">
          {formatInr(summary.previousPrice)}
        </div>
        <span className="text-[10px] text-slate-400 mt-0.5 block">Prior check</span>
      </div>

      {/* 6. Percentage Change */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
          Vs Historical Avg
        </span>
        <div
          className={`mt-1 text-lg sm:text-xl font-extrabold flex items-center gap-1 ${
            isDrop ? 'text-emerald-600' : 'text-rose-600'
          }`}
        >
          {isDrop ? (
            <TrendingDown className="w-4 h-4" />
          ) : (
            <TrendingUp className="w-4 h-4" />
          )}
          <span>{Math.abs(summary.percentageChange)}%</span>
        </div>
        <span className="text-[10px] text-slate-400 mt-0.5 block">
          {isDrop ? 'Below normal avg' : 'Above normal avg'}
        </span>
      </div>
    </div>
  );
};
