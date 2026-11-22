import React from 'react';
import { TrendingDown, Shield, CheckCircle2, HeartHandshake, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white">
      {/* Retailer trust strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-b border-slate-100">
        <p className="text-center text-xs font-semibold uppercase tracking-wider text-slate-400 mb-6">
          Multi-Retailer Comparison Engine Supported Platforms
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-slate-600 font-semibold text-sm">
          <span className="flex items-center gap-2 hover:text-slate-900 transition-colors">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Amazon India
          </span>
          <span className="flex items-center gap-2 hover:text-slate-900 transition-colors">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Flipkart
          </span>
          <span className="flex items-center gap-2 hover:text-slate-900 transition-colors">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span> Croma
          </span>
          <span className="flex items-center gap-2 hover:text-slate-900 transition-colors">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Reliance Digital
          </span>
          <span className="flex items-center gap-2 hover:text-slate-900 transition-colors">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> Vijay Sales
          </span>
          <span className="flex items-center gap-2 hover:text-slate-900 transition-colors">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Tata CLiQ
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
              <TrendingDown className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-900 text-sm">PriceWise</span>
              <p className="text-xs text-slate-500">Shop Smart. Save More.</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-600" />
              Independent & Unbiased
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-brand-600" />
              Verified Variant Matching
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Fake Discount Detection
            </span>
          </div>

          <p className="text-xs text-slate-400 text-center md:text-right">
            © {new Date().getFullYear()} PriceWise. Consumer-first price intelligence.
          </p>
        </div>
      </div>
    </footer>
  );
};
