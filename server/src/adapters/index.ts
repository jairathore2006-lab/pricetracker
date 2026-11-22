import { RetailerName, RetailerListing, VariantSpecs, Product } from '../types/index.js';
import { ExtractedProductInfo, RetailerAdapter } from './base.js';
import { evaluateSellerReliability } from '../engine/sellerVerifier.js';
import { matchProductVariants } from '../engine/variantMatcher.js';
import { dataStore } from '../db/storage.js';

class AmazonAdapter implements RetailerAdapter {
  readonly name: RetailerName = 'Amazon';
  readonly domains = ['amazon.in', 'www.amazon.in', 'amzn.in', 'amzn.to'];

  matchesUrl(url: string): boolean {
    return this.domains.some((d) => url.toLowerCase().includes(d));
  }

  async extractFromUrl(url: string): Promise<ExtractedProductInfo> {
    // If URL points to one of our seed or tracked products, match it
    const all = dataStore.getAllProducts();
    for (const p of all) {
      const listing = p.listings.find((l) => l.retailer === 'Amazon');
      if (listing && (url.includes(p.model.toLowerCase()) || url.includes('b0') || url.includes(p.id))) {
        return {
          retailer: 'Amazon',
          url,
          title: listing.productTitle,
          imageUrl: listing.imageUrl,
          currentPrice: listing.currentPrice,
          originalPrice: listing.originalPrice,
          inStock: listing.inStock,
          stockStatus: listing.stockStatus,
          sellerName: listing.seller.name,
          sellerRating: listing.seller.rating,
          sellerReviewCount: listing.seller.reviewCount,
          deliveryCharge: listing.deliveryCharge,
          estimatedDelivery: listing.estimatedDelivery,
          platformFee: listing.platformFee,
          specs: listing.variantSpecs,
        };
      }
    }

    // Generic parse from Amazon URL parameters or slug
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/').filter(Boolean);
    const slug = pathParts[0] ? decodeURIComponent(pathParts[0].replace(/-/g, ' ')) : 'Amazon Product';

    return {
      retailer: 'Amazon',
      url,
      title: slug.charAt(0).toUpperCase() + slug.slice(1),
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
      currentPrice: 49999,
      originalPrice: 59990,
      inStock: true,
      stockStatus: 'In Stock',
      sellerName: 'Appario Retail Private Ltd',
      sellerRating: 4.6,
      sellerReviewCount: 18500,
      deliveryCharge: 0,
      estimatedDelivery: 'Tomorrow, by 2:00 PM',
      platformFee: 5,
      specs: {
        brand: 'Generic',
        model: slug,
      },
    };
  }

  async search(keyword: string): Promise<ExtractedProductInfo[]> {
    return [];
  }
}

class FlipkartAdapter implements RetailerAdapter {
  readonly name: RetailerName = 'Flipkart';
  readonly domains = ['flipkart.com', 'www.flipkart.com', 'dl.flipkart.com'];

  matchesUrl(url: string): boolean {
    return this.domains.some((d) => url.toLowerCase().includes(d));
  }

  async extractFromUrl(url: string): Promise<ExtractedProductInfo> {
    const all = dataStore.getAllProducts();
    for (const p of all) {
      const listing = p.listings.find((l) => l.retailer === 'Flipkart');
      if (listing && (url.includes(p.model.toLowerCase()) || url.includes(p.id))) {
        return {
          retailer: 'Flipkart',
          url,
          title: listing.productTitle,
          imageUrl: listing.imageUrl,
          currentPrice: listing.currentPrice,
          originalPrice: listing.originalPrice,
          inStock: listing.inStock,
          stockStatus: listing.stockStatus,
          sellerName: listing.seller.name,
          sellerRating: listing.seller.rating,
          sellerReviewCount: listing.seller.reviewCount,
          deliveryCharge: listing.deliveryCharge,
          estimatedDelivery: listing.estimatedDelivery,
          platformFee: listing.platformFee,
          specs: listing.variantSpecs,
        };
      }
    }

    const pathParts = new URL(url).pathname.split('/').filter(Boolean);
    const title = pathParts[0] ? decodeURIComponent(pathParts[0].replace(/-/g, ' ')) : 'Flipkart Product';

    return {
      retailer: 'Flipkart',
      url,
      title: title.charAt(0).toUpperCase() + title.slice(1),
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
      currentPrice: 48999,
      originalPrice: 59990,
      inStock: true,
      stockStatus: 'In Stock',
      sellerName: 'RetailNet',
      sellerRating: 4.5,
      sellerReviewCount: 12400,
      deliveryCharge: 49,
      estimatedDelivery: '2 business days',
      platformFee: 9,
      specs: { brand: 'Generic', model: title },
    };
  }

  async search(keyword: string): Promise<ExtractedProductInfo[]> {
    return [];
  }
}

class CromaAdapter implements RetailerAdapter {
  readonly name: RetailerName = 'Croma';
  readonly domains = ['croma.com', 'www.croma.com'];

  matchesUrl(url: string): boolean {
    return this.domains.some((d) => url.toLowerCase().includes(d));
  }

  async extractFromUrl(url: string): Promise<ExtractedProductInfo> {
    const all = dataStore.getAllProducts();
    for (const p of all) {
      const listing = p.listings.find((l) => l.retailer === 'Croma');
      if (listing && (url.includes(p.model.toLowerCase()) || url.includes(p.id))) {
        return {
          retailer: 'Croma',
          url,
          title: listing.productTitle,
          imageUrl: listing.imageUrl,
          currentPrice: listing.currentPrice,
          originalPrice: listing.originalPrice,
          inStock: listing.inStock,
          stockStatus: listing.stockStatus,
          sellerName: listing.seller.name,
          sellerRating: listing.seller.rating,
          sellerReviewCount: listing.seller.reviewCount,
          deliveryCharge: listing.deliveryCharge,
          estimatedDelivery: listing.estimatedDelivery,
          platformFee: listing.platformFee,
          specs: listing.variantSpecs,
        };
      }
    }

    return {
      retailer: 'Croma',
      url,
      title: 'Croma Retail Verified Product',
      imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80',
      currentPrice: 49490,
      originalPrice: 59990,
      inStock: true,
      stockStatus: 'In Stock (Store Pickup Available)',
      sellerName: 'Croma Retail (Tata Enterprise)',
      sellerRating: 4.7,
      sellerReviewCount: 16000,
      deliveryCharge: 0,
      estimatedDelivery: 'Tomorrow afternoon',
      platformFee: 0,
      specs: { brand: 'Generic', model: 'Electronics' },
    };
  }

  async search(keyword: string): Promise<ExtractedProductInfo[]> {
    return [];
  }
}

class RelianceAdapter implements RetailerAdapter {
  readonly name: RetailerName = 'Reliance Digital';
  readonly domains = ['reliancedigital.in', 'www.reliancedigital.in'];

  matchesUrl(url: string): boolean {
    return this.domains.some((d) => url.toLowerCase().includes(d));
  }

  async extractFromUrl(url: string): Promise<ExtractedProductInfo> {
    return {
      retailer: 'Reliance Digital',
      url,
      title: 'Reliance Digital Product',
      imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80',
      currentPrice: 49990,
      originalPrice: 59990,
      inStock: true,
      stockStatus: 'In Stock',
      sellerName: 'Reliance Retail',
      sellerRating: 4.6,
      sellerReviewCount: 9200,
      deliveryCharge: 0,
      estimatedDelivery: 'Tomorrow',
      platformFee: 0,
      specs: { brand: 'Generic', model: 'Device' },
    };
  }

  async search(keyword: string): Promise<ExtractedProductInfo[]> {
    return [];
  }
}

class VijaySalesAdapter implements RetailerAdapter {
  readonly name: RetailerName = 'Vijay Sales';
  readonly domains = ['vijaysales.com', 'www.vijaysales.com'];

  matchesUrl(url: string): boolean {
    return this.domains.some((d) => url.toLowerCase().includes(d));
  }

  async extractFromUrl(url: string): Promise<ExtractedProductInfo> {
    return {
      retailer: 'Vijay Sales',
      url,
      title: 'Vijay Sales Verified Item',
      imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
      currentPrice: 49790,
      originalPrice: 59990,
      inStock: true,
      stockStatus: 'In Stock',
      sellerName: 'Vijay Sales Electronics Hub',
      sellerRating: 4.4,
      sellerReviewCount: 5100,
      deliveryCharge: 99,
      estimatedDelivery: '3 to 4 business days',
      platformFee: 0,
      specs: { brand: 'Generic', model: 'Item' },
    };
  }

  async search(keyword: string): Promise<ExtractedProductInfo[]> {
    return [];
  }
}

class TataCliqAdapter implements RetailerAdapter {
  readonly name: RetailerName = 'Tata CLiQ';
  readonly domains = ['tatacliq.com', 'www.tatacliq.com'];

  matchesUrl(url: string): boolean {
    return this.domains.some((d) => url.toLowerCase().includes(d));
  }

  async extractFromUrl(url: string): Promise<ExtractedProductInfo> {
    return {
      retailer: 'Tata CLiQ',
      url,
      title: 'Tata CLiQ Product',
      imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80',
      currentPrice: 50490,
      originalPrice: 59990,
      inStock: true,
      stockStatus: 'In Stock',
      sellerName: 'UniOne Gadgets Marketplace',
      sellerRating: 3.9,
      sellerReviewCount: 420,
      deliveryCharge: 0,
      estimatedDelivery: '3 days',
      platformFee: 20,
      specs: { brand: 'Generic', model: 'Tech' },
    };
  }

  async search(keyword: string): Promise<ExtractedProductInfo[]> {
    return [];
  }
}

export class RetailerRegistry {
  private adapters: RetailerAdapter[] = [
    new AmazonAdapter(),
    new FlipkartAdapter(),
    new CromaAdapter(),
    new RelianceAdapter(),
    new VijaySalesAdapter(),
    new TataCliqAdapter(),
  ];

  public getSupportedRetailers(): RetailerName[] {
    return this.adapters.map((a) => a.name);
  }

  public detectRetailerFromUrl(url: string): RetailerAdapter | null {
    if (!url || typeof url !== 'string') return null;
    try {
      const parsedUrl = new URL(url.startsWith('http') ? url : `https://${url}`);
      for (const adapter of this.adapters) {
        if (adapter.matchesUrl(parsedUrl.hostname) || adapter.matchesUrl(url)) {
          return adapter;
        }
      }
    } catch {
      // If URL parsing fails, check substring
      for (const adapter of this.adapters) {
        if (adapter.matchesUrl(url)) return adapter;
      }
    }
    return null;
  }

  public async extractFromUrl(url: string): Promise<{
    retailer: RetailerName;
    product: Product | null;
    rawExtracted: ExtractedProductInfo;
  }> {
    const adapter = this.detectRetailerFromUrl(url);
    if (!adapter) {
      throw new Error(
        'Unsupported retailer URL. PriceWise supports Amazon India, Flipkart, Croma, Reliance Digital, Vijay Sales, and Tata CLiQ.'
      );
    }

    const rawExtracted = await adapter.extractFromUrl(url);

    // Check if this URL or product title matches an existing tracked product
    const allProducts = dataStore.getAllProducts();
    let matchedProduct: Product | null = null;

    for (const p of allProducts) {
      // Check direct listing URL match
      if (p.listings.some((l) => l.productUrl.toLowerCase().includes(url.toLowerCase()) || url.toLowerCase().includes(l.productUrl.toLowerCase()))) {
        matchedProduct = p;
        break;
      }
      // Check title match
      if (p.title.toLowerCase().includes(rawExtracted.title.toLowerCase()) || rawExtracted.title.toLowerCase().includes(p.model.toLowerCase())) {
        matchedProduct = p;
        break;
      }
    }

    return {
      retailer: adapter.name,
      product: matchedProduct,
      rawExtracted,
    };
  }
}

export const retailerRegistry = new RetailerRegistry();
