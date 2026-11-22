import React, { useState } from 'react';
import {
  ExternalLink,
  ShieldCheck,
  Check,
  AlertTriangle,
  Info,
  Truck,
  Clock,
  Sparkles,
  ArrowUpDown,
  ShoppingBag,
} from 'lucide-react';
import { RetailerListing, VariantSpecs } from '../../types';
import { formatInr } from '../../lib/utils';
import { VariantMatchBadge } from './VariantMatchBadge';
import { VariantDiffInspector } from './VariantDiffInspector';
import { SellerReliabilityCard } from './SellerReliabilityCard';

interface RetailerComparisonTableProps {
  listings: RetailerListing[];
  baseSpecs: VariantSpecs;
}

export const RetailerComparisonTable: React.FC<RetailerComparisonTableProps> = ({
  listings,
  baseSpecs,
}) => {
  const [inspectingListing, setInspectingListing] = useState<RetailerListing | null>(null);
  const [selectedSellerListing, setSelectedSellerListing] = useState<RetailerListing | null>(null);

  // Sort: Lowest verified price first
  const sortedListings = [...listings].sort((a, b) => a.finalPrice - b.finalPrice);

  return (
    <div className="space-y-4">
      {/* Table Header Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>Multi-Retailer Price Comparison</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {listings.length} stores compared
            </span>
          </h3>
          <p className="text-xs text-slate-500">
            Real-time final payable prices including delivery and platform handling fees.
          </p>
        </div>
      </div>

      {/* Comparison Grid / Cards */}
      <div className="space-y-3">
        {sortedListings.map((listing) => {
          const isLowest = listing.isLowestVerifiedPrice;
          const matchResult = listing.variantMatch;

          return (
            <div
              key={listing.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all relative ${
                isLowest
                  ? 'bg-gradient-to-r from-emerald-50/50 via-white to-white border-emerald-300 shadow-md ring-1 ring-emerald-400/30'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              {/* Lowest verified price badge banner */}
              {isLowest && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-bold shadow-xs mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Lowest Verified Total Price</span>
                </div>
              )}

              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                {/* Retailer Info & Product Header */}
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  {/* Retailer Pill */}
                  <div className="shrink-0 text-center">
                    <span className={`inline-block px-3 py-1.5 rounded-xl font-bold text-xs uppercase tracking-wider ${
                      listing.retailer === 'Amazon'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : listing.retailer === 'Flipkart'
                        ? 'bg-blue-100 text-blue-900 border border-blue-300'
                        : listing.retailer === 'Croma'
                        ? 'bg-teal-100 text-teal-900 border border-teal-300'
                        : listing.retailer === 'Reliance Digital'
                        ? 'bg-red-100 text-red-900 border border-red-300'
                        : listing.retailer === 'Vijay Sales'
                        ? 'bg-orange-100 text-orange-900 border border-orange-300'
                        : 'bg-rose-100 text-rose-900 border border-rose-300'
                    }`}>
                      {listing.retailer}
                    </span>
                    <div className="mt-1.5 text-[10px] text-slate-400 font-medium">
                      {listing.inStock ? (
                        <span className="text-emerald-600 font-semibold flex items-center justify-center gap-1">
                          <Check className="w-3 h-3" /> In Stock
                        </span>
                      ) : (
                        <span className="text-rose-500 font-semibold">Out of Stock</span>
                      )}
                    </div>
                  </div>

                  {/* Title & Metadata */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-slate-900 leading-snug line-clamp-2">
                      {listing.productTitle}
                    </h4>

                    {/* Seller details & variant status */}
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      {/* Variant Match badge */}
                      {matchResult && (
                        <VariantMatchBadge
                          match={matchResult}
                          onInspect={() => setInspectingListing(listing)}
                        />
                      )}

                      {/* Seller Info Button */}
                      <button
                        type="button"
                        onClick={() => setSelectedSellerListing(listing)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
                        title="Click to view seller trust & policy"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
                        <span>Seller: {listing.seller.name}</span>
                        {listing.seller.rating > 0 && (
                          <span className="font-bold text-slate-900">
                            ★ {listing.seller.rating}
                          </span>
                        )}
                      </button>
                    </div>

                    {/* Delivery & Logistics notes */}
                    <div className="mt-2.5 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Truck className="w-3.5 h-3.5 text-slate-400" />
                        {listing.deliveryCharge === 0 ? (
                          <span className="text-emerald-600 font-semibold">Free Delivery</span>
                        ) : (
                          <span>Delivery: {formatInr(listing.deliveryCharge)}</span>
                        )}
                      </span>

                      {listing.estimatedDelivery && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>Est: {listing.estimatedDelivery}</span>
                        </span>
                      )}

                      {listing.platformFee > 0 && (
                        <span className="text-slate-400">
                          Platform fee: {formatInr(listing.platformFee)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Pricing & CTA */}
                <div className="flex items-center justify-between lg:justify-end gap-5 w-full lg:w-auto pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100 shrink-0">
                  <div className="text-left lg:text-right">
                    <div className="flex items-baseline gap-2 lg:justify-end">
                      <span className="text-2xl font-black text-slate-950 tracking-tight">
                        {formatInr(listing.finalPrice)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-400 lg:justify-end">
                      <span className="line-through">{formatInr(listing.originalPrice)}</span>
                      <span className="font-bold text-emerald-600">
                        {listing.discountPercent}% OFF
                      </span>
                    </div>

                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Total payable at checkout
                    </p>
                  </div>

                  <a
                    href={listing.productUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-5 py-3 rounded-xl font-bold text-xs sm:text-sm inline-flex items-center gap-1.5 transition-all shadow-sm ${
                      isLowest
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-glow-emerald'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    <span>Go to Store</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Specification Difference Inspector Modal */}
      {inspectingListing && (
        <VariantDiffInspector
          baseSpecs={baseSpecs}
          candidate={inspectingListing}
          onClose={() => setInspectingListing(null)}
        />
      )}

      {/* Seller Trust Details Modal */}
      {selectedSellerListing && (
        <SellerReliabilityCard
          listing={selectedSellerListing}
          onClose={() => setSelectedSellerListing(null)}
        />
      )}
    </div>
  );
};
