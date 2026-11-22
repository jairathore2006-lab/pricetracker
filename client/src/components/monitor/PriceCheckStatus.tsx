import React, { useState } from 'react';
import {
  Clock,
  RefreshCw,
  CheckCircle2,
  Sliders,
  ShieldCheck,
  Activity,
  AlertCircle,
  BellRing,
} from 'lucide-react';
import { ScheduledMonitoringStatus } from '../../types';
import { formatTimeAgo, formatDate } from '../../lib/utils';
import { api } from '../../lib/api';

interface PriceCheckStatusProps {
  status: ScheduledMonitoringStatus | null;
  onStatusUpdated: () => void;
}

export const PriceCheckStatus: React.FC<PriceCheckStatusProps> = ({
  status,
  onStatusUpdated,
}) => {
  const [isChecking, setIsChecking] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isChangingInterval, setIsChangingInterval] = useState(false);

  const intervals = [15, 30, 60, 180, 360];

  const handleTriggerCheck = async () => {
    setIsChecking(true);
    setFeedback(null);
    try {
      const res = await api.triggerPriceCheck();
      setFeedback(res.message);
      onStatusUpdated();
      setTimeout(() => setFeedback(null), 4000);
    } catch (e: any) {
      setFeedback('Failed to execute price check.');
    } finally {
      setIsChecking(false);
    }
  };

  const handleUpdateInterval = async (minutes: number) => {
    try {
      await api.setMonitorInterval(minutes);
      setIsChangingInterval(false);
      onStatusUpdated();
    } catch {
      alert('Could not update monitoring interval.');
    }
  };

  if (!status) return null;

  return (
    <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-base">
                Scheduled Price Monitoring Engine
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Active Scheduler
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Continuously monitors multi-retailer inventory and triggers instant price drop alerts.
            </p>
          </div>
        </div>

        {/* Manual Trigger Button */}
        <button
          onClick={handleTriggerCheck}
          disabled={isChecking}
          className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold text-xs shadow-md hover:shadow-glow flex items-center gap-2 transition-all self-start sm:self-auto shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
          <span>{isChecking ? 'Checking All Retailers...' : 'Check Prices Now'}</span>
        </button>
      </div>

      {feedback && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">
            Last Verified
          </span>
          <span className="font-bold text-slate-800 text-sm mt-0.5 block">
            {formatTimeAgo(status.lastRunAt)}
          </span>
          <span className="text-[10px] text-slate-400">
            {formatDate(status.lastRunAt)}
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">
            Checking Interval
          </span>
          <div className="flex items-center justify-between mt-0.5">
            <span className="font-bold text-slate-800 text-sm">
              Every {status.checkIntervalMinutes} mins
            </span>
            <button
              onClick={() => setIsChangingInterval(!isChangingInterval)}
              className="text-[10px] text-brand-600 hover:underline font-semibold"
            >
              Change
            </button>
          </div>
          <span className="text-[10px] text-slate-400">Automated cycle</span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">
            Monitored Catalog
          </span>
          <span className="font-bold text-slate-800 text-sm mt-0.5 block">
            {status.productsMonitoredCount} Products
          </span>
          <span className="text-[10px] text-slate-400">Multi-retailer sync</span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">
            Alerts Dispatched
          </span>
          <span className="font-bold text-emerald-600 text-sm mt-0.5 block">
            {status.totalAlertsTriggered} Notifications
          </span>
          <span className="text-[10px] text-slate-400">Duplicate-free logs</span>
        </div>
      </div>

      {/* Interval Selector Drawer */}
      {isChangingInterval && (
        <div className="p-4 rounded-2xl bg-brand-50/60 border border-brand-200/80 animate-in fade-in">
          <span className="block text-xs font-bold text-brand-950 mb-2">
            Select Automated Polling Frequency:
          </span>
          <div className="flex flex-wrap gap-2">
            {intervals.map((mins) => (
              <button
                key={mins}
                onClick={() => handleUpdateInterval(mins)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  status.checkIntervalMinutes === mins
                    ? 'bg-brand-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-brand-100 border border-brand-200'
                }`}
              >
                {mins < 60 ? `${mins} minutes` : `${mins / 60} hour(s)`}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
