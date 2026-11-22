import React from 'react';
import {
  X,
  ShieldCheck,
  ShieldAlert,
  Star,
  CheckCircle2,
  RotateCcw,
  Award,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { RetailerListing } from '../../types';

interface SellerReliabilityCardProps {
  listing: RetailerListing;
  onClose: () => void;
}

export const SellerReliabilityCard: React.FC<SellerReliabilityCardProps> = ({
  listing,
  onClose,
}) => {
  const seller = listing.seller;

  const isHigh = seller.reliability === 'High confidence';
  const isModerate = seller.reliability === 'Moderate confidence';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/60">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                isHigh
                  ? 'bg-emerald-100 text-emerald-700'
                  : isModerate
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Seller Verification & Reliability
              </h3>
              <p className="text-xs text-slate-500">
                Verified merchant metrics on {listing.retailer}
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

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Seller Name & Rating Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-base">{seller.name}</h4>
                <div className="mt-1 flex items-center gap-2">
                  <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{seller.rating > 0 ? seller.rating.toFixed(1) : 'Unrated'}</span>
                  </div>
                  {seller.reviewCount > 0 && (
                    <span className="text-xs text-slate-500 font-medium">
                      ({seller.reviewCount.toLocaleString('en-IN')} verified reviews)
                    </span>
                  )}
                </div>
              </div>

              {seller.verificationBadgeText && (
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-200 flex items-center gap-1 shrink-0">
                  <Award className="w-3.5 h-3.5 text-brand-600" />
                  {seller.verificationBadgeText}
                </span>
              )}
            </div>
          </div>

          {/* Reliability Indicator Badge */}
          <div
            className={`p-4 rounded-2xl border ${
              isHigh
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                : isModerate
                ? 'bg-amber-50 border-amber-200 text-amber-950'
                : 'bg-slate-50 border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-sm mb-1">
              {isHigh ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : isModerate ? (
                <AlertCircle className="w-4 h-4 text-amber-600" />
              ) : (
                <ShieldAlert className="w-4 h-4 text-slate-500" />
              )}
              <span>Reliability Status: {seller.reliability}</span>
            </div>
            <p className="text-xs opacity-90 leading-relaxed">
              {seller.reliabilityReason}
            </p>
          </div>

          {/* Return Policy & Warranty Guarantee */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
                <RotateCcw className="w-3.5 h-3.5 text-brand-600" />
                <span>Return & Replacement</span>
              </div>
              <p className="text-xs text-slate-600 leading-snug">
                {seller.returnPolicy}
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Manufacturer Warranty</span>
              </div>
              <p className="text-xs text-slate-600 leading-snug">
                {seller.warranty}
              </p>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 text-center">
            PriceWise never fabricates seller ratings or implies verification without authentic retailer evidence.
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <a
            href={listing.productUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-brand-600 hover:text-brand-700 font-semibold inline-flex items-center gap-1"
          >
            Visit listing on {listing.retailer} <ExternalLink className="w-3 h-3" />
          </a>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
