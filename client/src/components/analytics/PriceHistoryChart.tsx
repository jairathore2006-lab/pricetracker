import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Calendar, TrendingDown, Info, Sparkles, AlertCircle } from 'lucide-react';
import { PriceHistoryPoint, HistoricalPriceSummary } from '../../types';
import { formatInr, formatDate } from '../../lib/utils';

interface PriceHistoryChartProps {
  history: PriceHistoryPoint[];
  summary: HistoricalPriceSummary;
}

type TimePeriod = '7d' | '30d' | '90d' | '6m' | '1y';

export const PriceHistoryChart: React.FC<PriceHistoryChartProps> = ({ history, summary }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('90d');

  const periods: { id: TimePeriod; label: string }[] = [
    { id: '7d', label: '7 Days' },
    { id: '30d', label: '30 Days' },
    { id: '90d', label: '90 Days' },
    { id: '6m', label: '6 Months' },
    { id: '1y', label: '1 Year' },
  ];

  // Filter history points based on period
  const filteredData = useMemo(() => {
    if (!history || history.length === 0) return [];

    const now = new Date('2026-11-22T00:00:00Z');
    let daysToKeep = 90;

    switch (selectedPeriod) {
      case '7d':
        daysToKeep = 7;
        break;
      case '30d':
        daysToKeep = 30;
        break;
      case '90d':
        daysToKeep = 90;
        break;
      case '6m':
        daysToKeep = 180;
        break;
      case '1y':
        daysToKeep = 365;
        break;
    }

    const cutoff = new Date(now.getTime() - daysToKeep * 86400000);

    const filtered = history.filter((p) => new Date(p.date) >= cutoff);
    // If filtered has fewer than 2 points, ensure we display at least the available trend
    return filtered.length >= 2 ? filtered : history.slice(-4);
  }, [history, selectedPeriod]);

  // Compute domain bounds for readable chart scaling
  const minPrice = useMemo(() => {
    if (filteredData.length === 0) return 0;
    const min = Math.min(...filteredData.map((d) => d.price));
    return Math.floor(min * 0.95);
  }, [filteredData]);

  const maxPrice = useMemo(() => {
    if (filteredData.length === 0) return 100000;
    const max = Math.max(...filteredData.map((d) => d.price));
    return Math.ceil(max * 1.05);
  }, [filteredData]);

  return (
    <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-brand-600" />
            <h3 className="font-bold text-slate-900 text-base">
              Historical Price Movement
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Tracked selling price fluctuations across verified retailers over time.
          </p>
        </div>

        {/* Period Selector Buttons */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 self-start sm:self-auto">
          {periods.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPeriod(p.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedPeriod === p.id
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Contextual Intelligence Summary Statement */}
      <div className="p-3.5 rounded-2xl bg-brand-50/60 border border-brand-200/80 flex items-start gap-3">
        <Sparkles className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
        <div className="text-xs text-brand-950 leading-relaxed font-medium">
          {summary.summaryStatement}
        </div>
      </div>

      {/* Interactive Recharts Graph */}
      <div className="h-64 sm:h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={filteredData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="date"
              tickFormatter={(val) => formatDate(val).split(' ').slice(0, 2).join(' ')}
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              axisLine={{ stroke: '#e2e8f0' }}
              tickLine={false}
            />
            <YAxis
              domain={[minPrice, maxPrice]}
              tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
              width={48}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as PriceHistoryPoint;
                  return (
                    <div className="bg-slate-950 text-white p-3 rounded-xl shadow-xl border border-slate-800 text-xs space-y-1">
                      <div className="text-[10px] text-slate-400 font-mono">
                        {formatDate(data.date)}
                      </div>
                      <div className="font-extrabold text-base text-emerald-400">
                        {formatInr(data.price)}
                      </div>
                      <div className="text-[11px] text-slate-300 flex items-center justify-between gap-4">
                        <span>Retailer:</span>
                        <span className="font-semibold text-white">{data.retailer}</span>
                      </div>
                      {data.eventNote && (
                        <div className="pt-1 mt-1 border-t border-slate-800 text-[10px] text-amber-300 font-medium">
                          Note: {data.eventNote}
                        </div>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#4f46e5"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#priceGradient)"
              activeDot={{ r: 6, fill: '#4f46e5', stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
