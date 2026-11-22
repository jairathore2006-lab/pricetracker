import React, { useState } from 'react';
import {
  TrendingDown,
  ShieldCheck,
  Sparkles,
  Sliders,
  CheckCircle2,
  ArrowRight,
  Layers,
  Search,
} from 'lucide-react';
import { Product, ScheduledMonitoringStatus } from '../types';
import { SearchBar } from '../components/search/SearchBar';
import { ProductCard } from '../components/product/ProductCard';
import { PriceCheckStatus } from '../components/monitor/PriceCheckStatus';

interface HomePageProps {
  products: Product[];
  onSelectProduct: (productId: string) => void;
  onOpenAlertModal: (product: Product) => void;
  onOpenUrlModal: () => void;
  monitorStatus: ScheduledMonitoringStatus | null;
  onRefreshMonitor: () => void;
  onSearch: (q: string, category?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  products,
  onSelectProduct,
  onOpenAlertModal,
  onOpenUrlModal,
  monitorStatus,
  onRefreshMonitor,
  onSearch,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredProducts = products.filter((p) => {
    if (selectedCategory === 'all') return true;
    return p.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative pt-8 sm:pt-14 pb-8 overflow-hidden text-center">
        {/* Subtle decorative glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-brand-300/20 to-indigo-500/20 blur-3xl -z-10 rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>Smart Shopping Assistant for Indian E-Commerce</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.15]">
            Shop Smart. <span className="text-brand-600">Save More.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Track live prices across Amazon India, Flipkart, Croma, Reliance Digital, Vijay Sales, and Tata CLiQ. We detect fake discounts, verify identical variants, and alert you when prices drop.
          </p>

          {/* Search bar inside Hero */}
          <div className="pt-2 max-w-3xl mx-auto">
            <SearchBar
              onSearch={onSearch}
              onUrlDetected={() => onOpenUrlModal()}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>
        </div>
      </section>

      {/* Feature Highlights Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
              <Sliders className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              Exact Variant Matching
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Never get misled by different storage, RAM tiers, or colors. Our engine assigns confidence scores and isolates mismatches.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              Fake Discount Detection
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              We compare against real historical selling prices rather than inflated MRPs to flag artificial sale prices before you buy.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              Seller Trust & Reliability
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Compare actual merchants, fulfillment authenticity, warranty policies, and ratings — not just generic marketplace titles.
            </p>
          </div>
        </div>
      </section>

      {/* Scheduled Monitor Ticker */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PriceCheckStatus
          status={monitorStatus}
          onStatusUpdated={onRefreshMonitor}
        />
      </section>

      {/* Tracked Products Catalog Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-950">
              Trending Deals & Price Comparison
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Select any item to view live store offers, fake discount analysis, and Recharts historical graphs.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenUrlModal}
              className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-xs transition-colors"
            >
              + Add URL to Track
            </button>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onSelect={onSelectProduct}
              onOpenAlertModal={onOpenAlertModal}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
