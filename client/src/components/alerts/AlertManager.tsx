import React, { useState } from 'react';
import {
  Bell,
  Trash2,
  Pause,
  Play,
  Edit2,
  Check,
  X,
  ExternalLink,
  Clock,
  Sparkles,
  TrendingDown,
  AlertCircle,
} from 'lucide-react';
import { PriceAlert } from '../../types';
import { formatInr, formatDate, formatTimeAgo } from '../../lib/utils';
import { api } from '../../lib/api';

interface AlertManagerProps {
  alerts: PriceAlert[];
  onRefresh: () => void;
  onSelectProduct?: (productId: string) => void;
}

export const AlertManager: React.FC<AlertManagerProps> = ({
  alerts,
  onRefresh,
  onSelectProduct,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTarget, setNewTarget] = useState<number>(0);

  const handleToggleActive = async (targetAlert: PriceAlert) => {
    try {
      await api.updateAlert(targetAlert.id, { active: !targetAlert.active });
      onRefresh();
    } catch (e) {
      window.alert('Could not update alert status.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this price alert?')) {
      try {
        await api.deleteAlert(id);
        onRefresh();
      } catch (e) {
        window.alert('Could not delete alert.');
      }
    }
  };

  const handleSaveEdit = async (id: string) => {
    if (newTarget <= 0) return;
    try {
      await api.updateAlert(id, { targetPrice: newTarget });
      setEditingId(null);
      onRefresh();
    } catch (e) {
      window.alert('Could not update target price.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Your Price Drop Alerts</h2>
          <p className="text-xs text-slate-500">
            Active tracking triggers monitoring 6 major Indian electronics retailers.
          </p>
        </div>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
          {alerts.length} Total Alerts
        </span>
      </div>

      {alerts.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
          <Bell className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">No Active Price Alerts</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Browse products or search for any smartphone, laptop, or headphones and click "Set Price Drop Alert" to start tracking.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {alerts.map((alertItem) => {
            const isReached = alertItem.currentPrice <= alertItem.targetPrice;
            const isEditing = editingId === alertItem.id;

            return (
              <div
                key={alertItem.id}
                className={`p-5 rounded-3xl border transition-all ${
                  isReached
                    ? 'bg-gradient-to-br from-emerald-50/70 to-white border-emerald-300 shadow-md ring-1 ring-emerald-400/30'
                    : alertItem.active
                    ? 'bg-white border-slate-200 shadow-xs'
                    : 'bg-slate-50/80 border-slate-200 opacity-60'
                }`}
              >
                {/* Product Head */}
                <div className="flex items-start gap-4">
                  <img
                    src={alertItem.productImageUrl}
                    alt={alertItem.productTitle}
                    className="w-16 h-16 object-cover rounded-2xl shrink-0 cursor-pointer hover:opacity-90"
                    onClick={() => onSelectProduct && onSelectProduct(alertItem.productId)}
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md">
                        {alertItem.brand}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {formatTimeAgo(alertItem.createdAt)}
                      </span>
                    </div>

                    <h4
                      onClick={() => onSelectProduct && onSelectProduct(alertItem.productId)}
                      className="font-bold text-sm text-slate-900 mt-1 line-clamp-1 hover:text-brand-600 cursor-pointer transition-colors"
                    >
                      {alertItem.productTitle}
                    </h4>

                    {/* Price Status */}
                    <div className="mt-3 flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <div>
                        <span className="text-[10px] text-slate-400 font-semibold block">
                          Current Price
                        </span>
                        <span className="text-sm font-extrabold text-slate-900">
                          {formatInr(alertItem.currentPrice)}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 font-semibold block">
                          Target Alert Price
                        </span>
                        {isEditing ? (
                          <div className="flex items-center gap-1 mt-0.5">
                            <input
                              type="number"
                              value={newTarget}
                              onChange={(e) => setNewTarget(Number(e.target.value))}
                              className="w-24 px-2 py-1 text-xs border rounded-md font-bold"
                              autoFocus
                            />
                            <button
                              onClick={() => handleSaveEdit(alertItem.id)}
                              className="p-1 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                            >
                              <Check className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="p-1 bg-slate-200 text-slate-700 rounded hover:bg-slate-300"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-sm font-extrabold text-brand-700">
                            {formatInr(alertItem.targetPrice)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Trigger Milestone banner */}
                    {isReached && (
                      <div className="mt-2.5 p-2 rounded-xl bg-emerald-100/70 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Target price reached! Check current retailer offers.</span>
                      </div>
                    )}

                    {/* Control Actions */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(alertItem)}
                          className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors ${
                            alertItem.active
                              ? 'text-slate-600 hover:bg-slate-100'
                              : 'text-amber-600 bg-amber-50 hover:bg-amber-100'
                          }`}
                          title={alertItem.active ? 'Pause Alert' : 'Resume Alert'}
                        >
                          {alertItem.active ? (
                            <>
                              <Pause className="w-3.5 h-3.5" />
                              <span>Active</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3.5 h-3.5" />
                              <span>Paused</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setEditingId(alertItem.id);
                            setNewTarget(alertItem.targetPrice);
                          }}
                          className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
                          title="Edit target price"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(alertItem.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors"
                          title="Delete alert"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {onSelectProduct && (
                        <button
                          type="button"
                          onClick={() => onSelectProduct(alertItem.productId)}
                          className="text-xs text-brand-600 hover:text-brand-700 font-bold inline-flex items-center gap-1"
                        >
                          View Comparisons →
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
