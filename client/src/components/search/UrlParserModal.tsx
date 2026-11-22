import React, { useState } from 'react';
import {
  Link2,
  X,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { api } from '../../lib/api';
import { Product } from '../../types';

interface UrlParserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductFound: (product: Product) => void;
  initialUrl?: string;
}

export const UrlParserModal: React.FC<UrlParserModalProps> = ({
  isOpen,
  onClose,
  onProductFound,
  initialUrl = '',
}) => {
  const [url, setUrl] = useState(initialUrl);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExtract = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUrl = url.trim();
    if (!cleanUrl) {
      setError('Please paste a product URL to compare.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await api.extractFromUrl(cleanUrl);
      if (res.product) {
        onProductFound(res.product);
        onClose();
      } else if (res.extracted) {
        // Fallback or newly generated product
        setError(
          `Identified listing on ${res.retailer}. For this newly scanned item, tracking has begun. Please try one of our featured items like iPhone 16 or Samsung S24 Ultra to view instant live comparison.`
        );
      }
    } catch (err: any) {
      setError(
        err.message ||
          'Unsupported or inaccessible product link. Please check the URL and ensure it is from Amazon India, Flipkart, Croma, Reliance Digital, Vijay Sales, or Tata CLiQ.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const sampleUrls = [
    {
      name: 'Amazon India – iPhone 16',
      url: 'https://www.amazon.in/dp/B0DGJDBH6Y',
    },
    {
      name: 'Flipkart – S24 Ultra',
      url: 'https://www.flipkart.com/samsung-galaxy-s24-ultra-5g-titanium-gray-256-gb/p/itmc91',
    },
    {
      name: 'Croma – Sony WH-1000XM5',
      url: 'https://www.croma.com/sony-wh-1000xm5-silver/p/260192',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-600">
              <Link2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Compare by Product URL</h3>
              <p className="text-xs text-slate-500">
                Paste any product link from Amazon, Flipkart, Croma, etc.
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
          <form onSubmit={handleExtract} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Paste Retailer Product Link
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://www.amazon.in/dp/... or https://www.flipkart.com/..."
                  className="w-full px-4 py-3.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100 text-slate-900"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Loading State requirement */}
            {isLoading && (
              <div className="p-6 rounded-2xl bg-brand-50/60 border border-brand-200 text-center animate-in fade-in">
                <Loader2 className="w-8 h-8 text-brand-600 animate-spin mx-auto mb-3" />
                <p className="font-semibold text-brand-900 text-base">
                  Finding the best deals for you...
                </p>
                <p className="text-xs text-brand-700 mt-1">
                  Scanning prices across Amazon, Flipkart, Croma, Reliance Digital, and more.
                </p>
              </div>
            )}

            {/* Error State requirement */}
            {error && !isLoading && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-xs leading-relaxed animate-in fade-in">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold mb-0.5">Could not process product link</p>
                  <p>{error}</p>
                </div>
              </div>
            )}

            {!isLoading && (
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!url.trim()}
                  className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-sm font-semibold shadow-md hover:shadow-glow flex items-center gap-2 transition-all"
                >
                  <span>Extract & Compare</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </form>

          {/* Quick Click Demo URLs */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Or Try A Sample Product Link:
            </p>
            <div className="space-y-1.5">
              {sampleUrls.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setUrl(sample.url)}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-50 hover:bg-brand-50 border border-slate-100 hover:border-brand-200 text-xs text-slate-700 flex items-center justify-between group transition-colors"
                >
                  <span className="font-medium text-slate-800 group-hover:text-brand-700">
                    {sample.name}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono group-hover:text-brand-600">
                    Load link →
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
