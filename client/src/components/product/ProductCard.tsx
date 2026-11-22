import React from 'react';
import {
  TrendingDown,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { Product } from '../../types';
import { formatInr } from '../../lib/utils';

interface ProductCardProps {
  product: Product;
  onSelect: (productId: string) => void;
  onOpenAlertModal?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onOpenAlertModal,
}) => {
  // Find lowest price listing
  const bestListing = product.listings.reduce((min, cur) =>
    cur.finalPrice < min.finalPrice ? cur : min, product.listings[0]
  );

  const discountAnalysis = product.discountAnalysis;
  const isGenuine = discountAnalysis.classification === 'Genuine Deal';
  const isFakeDiscount = discountAnalysis.classification === 'Possible Fake Discount';

  return (
    <div
      onClick={() => onSelect(product.id)}
      className="group rounded-3xl bg-white border border-slate-200/90 hover:border-brand-300 hover:shadow-xl hover:shadow-brand-100/40 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
    >
      {/* Image Preview & Badges */}
      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Brand Pill */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="px-2.5 py-1 rounded-xl bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold shadow-xs">
            {product.brand}
          </span>
          <span className="px-2.5 py-1 rounded-xl bg-white/90 backdrop-blur-md text-slate-800 text-[11px] font-semibold shadow-xs">
            {product.category}
          </span>
        </div>

        {/* Fake Discount or Genuine Deal tag */}
        <div className="absolute top-3 right-3">
          {isGenuine ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-600 text-white text-[10px] font-extrabold shadow-sm">
              <Sparkles className="w-3 h-3" />
              Genuine Deal
            </span>
          ) : isFakeDiscount ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500 text-white text-[10px] font-extrabold shadow-sm">
              Fake Discount Risk
            </span>
          ) : null}
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-2 group-hover:text-brand-600 transition-colors">
            {product.title}
          </h3>

          {/* Quick Specs chips */}
          <div className="mt-2.5 flex flex-wrap gap-1.5 text-[11px] text-slate-500">
            {product.baseSpecs.storage && (
              <span className="px-2 py-0.5 rounded-md bg-slate-100 font-medium">
                {product.baseSpecs.storage}
              </span>
            )}
            {product.baseSpecs.ram && (
              <span className="px-2 py-0.5 rounded-md bg-slate-100 font-medium">
                {product.baseSpecs.ram} RAM
              </span>
            )}
            {product.baseSpecs.color && (
              <span className="px-2 py-0.5 rounded-md bg-slate-100 font-medium">
                {product.baseSpecs.color}
              </span>
            )}
          </div>
        </div>

        {/* Pricing & Retailer Highlight */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Lowest offer on</span>
            <span className="font-bold text-slate-700">{bestListing.retailer}</span>
          </div>

          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-slate-950">
                {formatInr(bestListing.finalPrice)}
              </span>
              {bestListing.originalPrice > bestListing.finalPrice && (
                <span className="text-xs text-slate-400 line-through">
                  {formatInr(bestListing.originalPrice)}
                </span>
              )}
            </div>

            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              {bestListing.discountPercent}% OFF
            </span>
          </div>

          {/* CTA Row */}
          <div className="mt-4 flex items-center justify-between gap-2">
            <span className="text-xs text-brand-600 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Compare {product.listings.length} Stores <ArrowRight className="w-3.5 h-3.5" />
            </span>

            {onOpenAlertModal && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenAlertModal(product);
                }}
                className="text-[11px] font-semibold text-slate-500 hover:text-brand-600 px-2.5 py-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Set Alert
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
