import React, { useState } from 'react';
import {
  ArrowLeft,
  Bell,
  RefreshCw,
  Share2,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Sliders,
  CheckCircle2,
  Clock,
  Layers,
  Check,
} from 'lucide-react';
import { Product } from '../types';
import { formatInr, formatTimeAgo, formatDate } from '../lib/utils';
import { RetailerComparisonTable } from '../components/comparison/RetailerComparisonTable';
import { PriceHistoryChart } from '../components/analytics/PriceHistoryChart';
import { FakeDiscountBanner } from '../components/analytics/FakeDiscountBanner';
import { PriceStatsCards } from '../components/analytics/PriceStatsCards';
import { SetAlertModal } from '../components/alerts/SetAlertModal';
import { api } from '../lib/api';

interface ProductDetailPageProps {
  product: Product;
  onBack: () => void;
  onRefreshProduct: () => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  onBack,
  onRefreshProduct,
}) => {
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const bestListing = product.listings.reduce((min, cur) =>
    cur.finalPrice < min.finalPrice ? cur : min, product.listings[0]
  );

  const handleRefreshPrices = async () => {
    setIsRefreshing(true);
    try {
      await api.triggerPriceCheck();
      onRefreshProduct();
    } catch {
      alert('Could not refresh prices.');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-brand-600 transition-colors self-start"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Browse Deals</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Last verified timestamp & manual refresh */}
          <span className="text-xs text-slate-500 flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Checked {formatTimeAgo(product.lastChecked)}</span>
          </span>

          <button
            onClick={handleRefreshPrices}
            disabled={isRefreshing}
            className="p-2 text-slate-600 hover:text-brand-600 hover:bg-white rounded-xl border border-slate-200 transition-colors"
            title="Refresh prices from retailers now"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-brand-600' : ''}`} />
          </button>

          <button
            onClick={handleShare}
            className="p-2 text-slate-600 hover:text-brand-600 hover:bg-white rounded-xl border border-slate-200 transition-colors relative"
            title="Share comparison link"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Product Hero Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Image & Specifications */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-50 relative group">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 flex gap-2">
                <span className="px-3 py-1 rounded-xl bg-slate-900/90 backdrop-blur-md text-white text-xs font-bold">
                  {product.brand}
                </span>
                <span className="px-3 py-1 rounded-xl bg-white/90 backdrop-blur-md text-slate-800 text-xs font-bold">
                  {product.category}
                </span>
              </div>
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-950 leading-snug">
                {product.title}
              </h1>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Target Specs Summary Table */}
            <div>
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                Target Product Specifications
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {product.baseSpecs.storage && (
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-semibold block">Storage</span>
                    <span className="font-bold text-slate-800">{product.baseSpecs.storage}</span>
                  </div>
                )}
                {product.baseSpecs.ram && (
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-semibold block">RAM</span>
                    <span className="font-bold text-slate-800">{product.baseSpecs.ram}</span>
                  </div>
                )}
                {product.baseSpecs.processor && (
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-semibold block">Processor</span>
                    <span className="font-bold text-slate-800">{product.baseSpecs.processor}</span>
                  </div>
                )}
                {product.baseSpecs.color && (
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-semibold block">Color</span>
                    <span className="font-bold text-slate-800">{product.baseSpecs.color}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Set Alert Trigger button */}
            <button
              onClick={() => setIsAlertModalOpen(true)}
              className="w-full py-3.5 px-4 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md hover:shadow-glow flex items-center justify-center gap-2 transition-all"
            >
              <Bell className="w-4 h-4" />
              <span>Set Custom Price Drop Alert</span>
            </button>
          </div>
        </div>

        {/* Right Column: Multi-Retailer Comparison Table & Quick Summary */}
        <div className="lg:col-span-7 space-y-6">
          {/* Multi-retailer Comparison component */}
          <RetailerComparisonTable
            listings={product.listings}
            baseSpecs={product.baseSpecs}
          />
        </div>
      </div>

      {/* Fake Discount Detection Banner (Requirement F) */}
      <div>
        <FakeDiscountBanner analysis={product.discountAnalysis} />
      </div>

      {/* Historical Summary Metric Cards (Requirement E) */}
      <div>
        <PriceStatsCards summary={product.historicalSummary} />
      </div>

      {/* Recharts Historical Price Graph (Requirement E) */}
      <div>
        <PriceHistoryChart
          history={product.priceHistory}
          summary={product.historicalSummary}
        />
      </div>

      {/* Set Alert Modal */}
      <SetAlertModal
        product={product}
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        onAlertCreated={() => {
          onRefreshProduct();
        }}
      />
    </div>
  );
};
