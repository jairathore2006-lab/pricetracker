import React, { useState } from 'react';
import {
  Bell,
  X,
  Target,
  Mail,
  Sparkles,
  ArrowRight,
  TrendingDown,
  CheckCircle2,
} from 'lucide-react';
import { Product } from '../../types';
import { formatInr } from '../../lib/utils';
import { api } from '../../lib/api';

interface SetAlertModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onAlertCreated: () => void;
}

export const SetAlertModal: React.FC<SetAlertModalProps> = ({
  product,
  isOpen,
  onClose,
  onAlertCreated,
}) => {
  const currentLowest = Math.min(...product.listings.map((l) => l.finalPrice));
  const lowestEver = product.historicalSummary.lowestPrice;

  const [targetPrice, setTargetPrice] = useState<number>(
    Math.round(currentLowest * 0.95)
  );
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePreset = (multiplier: number) => {
    setTargetPrice(Math.round(currentLowest * multiplier));
  };

  const handleMatchLowestEver = () => {
    setTargetPrice(lowestEver);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (targetPrice >= currentLowest) {
      alert('Target price should be lower than the current selling price to trigger an alert.');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.createAlert(product.id, targetPrice, email || undefined);
      setSuccessMessage(`Alert activated! We will notify you when price hits ${formatInr(targetPrice)}.`);
      setTimeout(() => {
        onAlertCreated();
        onClose();
      }, 1400);
    } catch (err: any) {
      alert(err.message || 'Failed to create price alert');
    } finally {
      setIsSubmitting(false);
    }
  };

  const savingsAmount = currentLowest - targetPrice;
  const savingsPct = Math.round((savingsAmount / currentLowest) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-600">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Set Price Drop Alert</h3>
              <p className="text-xs text-slate-500">
                Get notified the instant the price drops below your target
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {successMessage ? (
            <div className="py-8 text-center space-y-3 animate-in fade-in">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h4 className="font-bold text-slate-900 text-lg">Alert Successfully Created!</h4>
              <p className="text-xs text-slate-500">{successMessage}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Product preview */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="w-12 h-12 object-cover rounded-xl shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-slate-900 truncate">
                    {product.title}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Current Best: <span className="font-bold text-slate-800">{formatInr(currentLowest)}</span>
                  </p>
                </div>
              </div>

              {/* Target Price Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Desired Purchase Price (INR)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(Number(e.target.value))}
                    max={currentLowest - 1}
                    min={100}
                    required
                    className="w-full pl-8 pr-4 py-3.5 text-lg font-extrabold rounded-xl border border-slate-300 focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100 text-slate-900"
                  />
                </div>

                {savingsAmount > 0 && (
                  <p className="text-xs text-emerald-600 font-semibold mt-1.5 flex items-center gap-1">
                    <TrendingDown className="w-3.5 h-3.5" />
                    Target saves {formatInr(savingsAmount)} ({savingsPct}% drop from current price)
                  </p>
                )}
              </div>

              {/* Quick Presets */}
              <div>
                <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Quick Target Presets:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handlePreset(0.95)}
                    className="p-2 text-xs font-bold rounded-xl border border-slate-200 hover:border-brand-300 hover:bg-brand-50 text-slate-700 transition-colors"
                  >
                    5% Drop
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePreset(0.90)}
                    className="p-2 text-xs font-bold rounded-xl border border-slate-200 hover:border-brand-300 hover:bg-brand-50 text-slate-700 transition-colors"
                  >
                    10% Drop
                  </button>
                  <button
                    type="button"
                    onClick={handleMatchLowestEver}
                    className="p-2 text-xs font-bold rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-colors"
                    title={`Match lowest ever: ${formatInr(lowestEver)}`}
                  >
                    All-Time Low
                  </button>
                </div>
              </div>

              {/* Email Option */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email for Notification (Optional)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com (In-app alert always active)"
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 text-slate-900"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md hover:shadow-glow flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  <span>Activate Alert</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
