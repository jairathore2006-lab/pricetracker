import { RetailerName, RetailerListing, VariantSpecs } from '../types/index.js';

export interface ExtractedProductInfo {
  retailer: RetailerName;
  url: string;
  title: string;
  imageUrl: string;
  currentPrice: number;
  originalPrice: number;
  inStock: boolean;
  stockStatus: string;
  sellerName: string;
  sellerRating: number;
  sellerReviewCount: number;
  deliveryCharge: number;
  estimatedDelivery: string;
  platformFee: number;
  specs: VariantSpecs;
}

export interface RetailerAdapter {
  readonly name: RetailerName;
  readonly domains: string[];
  matchesUrl(url: string): boolean;
  extractFromUrl(url: string): Promise<ExtractedProductInfo>;
  search(keyword: string): Promise<ExtractedProductInfo[]>;
}
