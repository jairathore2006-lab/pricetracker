export type RetailerName =
  | 'Amazon'
  | 'Flipkart'
  | 'Croma'
  | 'Reliance Digital'
  | 'Vijay Sales'
  | 'Tata CLiQ';

export type ReliabilityLevel =
  | 'High confidence'
  | 'Moderate confidence'
  | 'Insufficient information';

export type DiscountClassification =
  | 'Genuine Deal'
  | 'Possible Fake Discount'
  | 'Price Above Average'
  | 'Normal Market Price'
  | 'Insufficient Price History';

export type VariantMatchStatus =
  | 'exact'
  | 'likely'
  | 'mismatch';

export interface VariantSpecs {
  brand: string;
  model: string;
  storage?: string;
  ram?: string;
  color?: string;
  processor?: string;
  screenSize?: string;
  generation?: string;
  otherSpecs?: Record<string, string>;
}

export interface SellerInfo {
  name: string;
  rating: number; // 0 to 5
  reviewCount: number;
  isVerified: boolean;
  verificationBadgeText?: string;
  returnPolicy: string;
  warranty: string;
  reliability: ReliabilityLevel;
  reliabilityReason: string;
}

export interface RetailerListing {
  id: string;
  retailer: RetailerName;
  retailerLogo?: string;
  productTitle: string;
  productUrl: string;
  imageUrl: string;
  currentPrice: number;
  originalPrice: number; // MRP
  discountPercent: number;
  seller: SellerInfo;
  inStock: boolean;
  stockStatus: string;
  deliveryCharge: number;
  estimatedDelivery: string;
  platformFee: number;
  finalPrice: number; // currentPrice + deliveryCharge + platformFee
  isLowestVerifiedPrice?: boolean;
  variantSpecs: VariantSpecs;
  variantMatch?: VariantMatchResult;
  lastChecked: string;
}

export interface VariantMatchDifference {
  specification: string;
  expected: string;
  actual: string;
  critical: boolean;
}

export interface VariantMatchResult {
  confidenceScore: number; // 0 - 100
  label: 'Exact Variant Match' | 'Likely Match, Needs Verification' | 'Variant Difference Detected';
  status: VariantMatchStatus;
  differences: VariantMatchDifference[];
  summaryNote: string;
}

export interface PriceHistoryPoint {
  date: string; // YYYY-MM-DD
  price: number;
  retailer: RetailerName | string;
  eventNote?: string;
}

export interface HistoricalPriceSummary {
  highestPrice: number;
  lowestPrice: number;
  averagePrice: number;
  currentPrice: number;
  previousPrice: number;
  percentageChange: number;
  summaryStatement: string;
  hasEnoughData: boolean;
}

export interface DiscountAnalysis {
  classification: DiscountClassification;
  badgeColor: 'emerald' | 'amber' | 'rose' | 'slate' | 'indigo';
  headline: string;
  explanation: string;
  listedMrp: number;
  currentPrice: number;
  historicalAverage: number;
  historicalLowest: number;
  historicalHighest: number;
  realDiscountPercent: number;
  mrpDiscountPercent: number;
  savingsVsAverage: number;
  isAllTimeLow: boolean;
  unusualFluctuationDetected: boolean;
}

export interface Product {
  id: string;
  title: string;
  brand: string;
  model: string;
  category: string;
  imageUrl: string;
  description: string;
  baseSpecs: VariantSpecs;
  listings: RetailerListing[];
  priceHistory: PriceHistoryPoint[];
  historicalSummary: HistoricalPriceSummary;
  discountAnalysis: DiscountAnalysis;
  lastChecked: string;
  createdAt: string;
}

export interface PriceAlert {
  id: string;
  productId: string;
  productTitle: string;
  productImageUrl: string;
  brand: string;
  targetPrice: number;
  currentPrice: number;
  initialPrice: number;
  retailerUrl?: string;
  userEmail?: string;
  active: boolean;
  createdAt: string;
  lastTriggeredAt?: string;
  triggerCount: number;
}

export interface InAppNotification {
  id: string;
  title: string;
  message: string;
  type: 'price_drop' | 'target_reached' | 'deal_alert' | 'system';
  productId: string;
  productTitle: string;
  productImage?: string;
  previousPrice: number;
  newPrice: number;
  amountSaved: number;
  retailerName: RetailerName;
  retailerLink: string;
  read: boolean;
  createdAt: string;
}

export interface ScheduledMonitoringStatus {
  isRunning: boolean;
  checkIntervalMinutes: number;
  lastRunAt: string;
  nextRunAt: string;
  productsMonitoredCount: number;
  totalAlertsTriggered: number;
}
