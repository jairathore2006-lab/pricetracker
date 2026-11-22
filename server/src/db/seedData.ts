import { Product, RetailerListing, PriceHistoryPoint } from '../types/index.js';
import { matchProductVariants } from '../engine/variantMatcher.js';
import { analyzeDiscount, calculateHistoricalSummary } from '../engine/fakeDiscountDetector.js';
import { evaluateSellerReliability } from '../engine/sellerVerifier.js';

export const initialProducts: Product[] = [
  // 1. Apple iPhone 16 128GB Black
  (() => {
    const baseSpecs = {
      brand: 'Apple',
      model: 'iPhone 16',
      storage: '128GB',
      ram: '8GB',
      color: 'Black',
      processor: 'A18 Bionic',
      screenSize: '6.1 inch',
      generation: '16th Gen',
    };

    const priceHistory: PriceHistoryPoint[] = [
      { date: '2026-05-15', price: 79900, retailer: 'Amazon', eventNote: 'Launch MRP' },
      { date: '2026-06-20', price: 79900, retailer: 'Flipkart' },
      { date: '2026-07-10', price: 78990, retailer: 'Croma' },
      { date: '2026-08-01', price: 77990, retailer: 'Reliance Digital' },
      { date: '2026-08-25', price: 76900, retailer: 'Amazon' },
      { date: '2026-09-12', price: 79900, retailer: 'Tata CLiQ', eventNote: 'Price bumped before festive sale' },
      { date: '2026-09-28', price: 74999, retailer: 'Flipkart', eventNote: 'Big Billion Days deal' },
      { date: '2026-10-15', price: 75490, retailer: 'Amazon' },
      { date: '2026-11-01', price: 73999, retailer: 'Vijay Sales', eventNote: 'Flash sale' },
      { date: '2026-11-15', price: 74499, retailer: 'Amazon' },
      { date: '2026-11-20', price: 72999, retailer: 'Croma', eventNote: 'Lowest price recorded' },
      { date: '2026-11-22', price: 73499, retailer: 'Amazon' },
    ];

    const rawListings: Omit<RetailerListing, 'variantMatch' | 'finalPrice'>[] = [
      {
        id: 'iphone16-amz',
        retailer: 'Amazon',
        productTitle: 'Apple iPhone 16 (128 GB) - Black',
        productUrl: 'https://www.amazon.in/dp/B0DGJDBH6Y',
        imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80',
        currentPrice: 73499,
        originalPrice: 79900,
        discountPercent: 8,
        seller: evaluateSellerReliability({
          name: 'Appario Retail Private Ltd',
          rating: 4.6,
          reviewCount: 42190,
          isVerified: true,
          verificationBadgeText: 'Amazon Fulfilled Partner',
          returnPolicy: '7 Days Replacement Policy',
          warranty: '1 Year Apple Manufacturer Warranty',
        }),
        inStock: true,
        stockStatus: 'In Stock',
        deliveryCharge: 0,
        estimatedDelivery: 'Tomorrow, by 11:00 AM',
        platformFee: 5,
        variantSpecs: {
          brand: 'Apple',
          model: 'iPhone 16',
          storage: '128GB',
          ram: '8GB',
          color: 'Black',
          processor: 'A18 Bionic',
          screenSize: '6.1 inch',
          generation: '16th Gen',
        },
        lastChecked: new Date().toISOString(),
      },
      {
        id: 'iphone16-fk',
        retailer: 'Flipkart',
        productTitle: 'Apple iPhone 16 (Black, 128 GB)',
        productUrl: 'https://www.flipkart.com/apple-iphone-16-black-128-gb/p/itmdgj16',
        imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80',
        currentPrice: 73999,
        originalPrice: 79900,
        discountPercent: 7,
        seller: evaluateSellerReliability({
          name: 'RetailNet Official',
          rating: 4.5,
          reviewCount: 31200,
          isVerified: true,
          verificationBadgeText: 'Flipkart Assured',
          returnPolicy: '7 Days Replacement',
          warranty: '1 Year Brand Warranty',
        }),
        inStock: true,
        stockStatus: 'In Stock',
        deliveryCharge: 49,
        estimatedDelivery: '2 days (Express)',
        platformFee: 9,
        variantSpecs: {
          brand: 'Apple',
          model: 'iPhone 16',
          storage: '128GB',
          ram: '8GB',
          color: 'Black',
          processor: 'A18 Bionic',
          screenSize: '6.1 inch',
          generation: '16th Gen',
        },
        lastChecked: new Date().toISOString(),
      },
      {
        id: 'iphone16-crm',
        retailer: 'Croma',
        productTitle: 'Apple iPhone 16 128GB Storage - Black (A3081)',
        productUrl: 'https://www.croma.com/apple-iphone-16-128gb-black/p/308122',
        imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80',
        currentPrice: 72999,
        originalPrice: 79900,
        discountPercent: 9,
        seller: evaluateSellerReliability({
          name: 'Croma Retail (Infiniti Retail Ltd)',
          rating: 4.7,
          reviewCount: 15400,
          isVerified: true,
          verificationBadgeText: 'Tata Enterprise Authorized',
          returnPolicy: '10 Days Returnable in original packing',
          warranty: '1 Year Official Apple Warranty',
        }),
        inStock: true,
        stockStatus: 'In Stock (Store Pickup Available)',
        deliveryCharge: 0,
        estimatedDelivery: 'Tomorrow afternoon',
        platformFee: 0,
        variantSpecs: {
          brand: 'Apple',
          model: 'iPhone 16',
          storage: '128GB',
          ram: '8GB',
          color: 'Black',
          processor: 'A18 Bionic',
          screenSize: '6.1 inch',
          generation: '16th Gen',
        },
        lastChecked: new Date().toISOString(),
      },
      {
        id: 'iphone16-rd',
        retailer: 'Reliance Digital',
        productTitle: 'Apple iPhone 16 128 GB, Black Smartphone',
        productUrl: 'https://www.reliancedigital.in/apple-iphone-16-128-gb-black/p/4944212',
        imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80',
        currentPrice: 73900,
        originalPrice: 79900,
        discountPercent: 8,
        seller: evaluateSellerReliability({
          name: 'Reliance Retail Limited',
          rating: 4.6,
          reviewCount: 9800,
          isVerified: true,
          verificationBadgeText: 'Reliance Direct Assured',
          returnPolicy: '7 Days Returnable',
          warranty: '1 Year Brand Manufacturer Warranty',
        }),
        inStock: true,
        stockStatus: 'In Stock',
        deliveryCharge: 0,
        estimatedDelivery: 'Tomorrow by 6:00 PM',
        platformFee: 0,
        variantSpecs: {
          brand: 'Apple',
          model: 'iPhone 16',
          storage: '128GB',
          ram: '8GB',
          color: 'Black',
          processor: 'A18 Bionic',
          screenSize: '6.1 inch',
          generation: '16th Gen',
        },
        lastChecked: new Date().toISOString(),
      },
      {
        id: 'iphone16-vjs',
        retailer: 'Vijay Sales',
        productTitle: 'Apple iPhone 16 (128GB, Ultramarine Blue)',
        productUrl: 'https://www.vijaysales.com/apple-iphone-16-128gb-blue/p/9931',
        imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80',
        currentPrice: 73999,
        originalPrice: 79900,
        discountPercent: 7,
        seller: evaluateSellerReliability({
          name: 'Vijay Sales Electronics Hub',
          rating: 4.4,
          reviewCount: 4300,
          isVerified: true,
          verificationBadgeText: 'Authorized Premium Partner',
          returnPolicy: '7 Days Replacement',
          warranty: '1 Year Official Warranty',
        }),
        inStock: true,
        stockStatus: 'Only 3 left in stock',
        deliveryCharge: 99,
        estimatedDelivery: '3 to 4 business days',
        platformFee: 0,
        variantSpecs: {
          brand: 'Apple',
          model: 'iPhone 16',
          storage: '128GB',
          ram: '8GB',
          color: 'Ultramarine Blue', // Demonstrates colour cosmetic variation
          processor: 'A18 Bionic',
          screenSize: '6.1 inch',
          generation: '16th Gen',
        },
        lastChecked: new Date().toISOString(),
      },
      {
        id: 'iphone16-tq',
        retailer: 'Tata CLiQ',
        productTitle: 'Apple iPhone 16 (256 GB, Black)',
        productUrl: 'https://www.tatacliq.com/apple-iphone-16-256gb-black/p/mp0000000192',
        imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80',
        currentPrice: 84900,
        originalPrice: 89900,
        discountPercent: 6,
        seller: evaluateSellerReliability({
          name: 'UniOne Gadgets Marketplace',
          rating: 3.9,
          reviewCount: 380,
          isVerified: false,
          returnPolicy: '5 Days Replacement',
          warranty: '1 Year Manufacturer Warranty',
        }),
        inStock: true,
        stockStatus: 'In Stock',
        deliveryCharge: 0,
        estimatedDelivery: '3 days',
        platformFee: 20,
        variantSpecs: {
          brand: 'Apple',
          model: 'iPhone 16',
          storage: '256GB', // Demonstrates storage mismatch detection!
          ram: '8GB',
          color: 'Black',
          processor: 'A18 Bionic',
          screenSize: '6.1 inch',
          generation: '16th Gen',
        },
        lastChecked: new Date().toISOString(),
      },
    ];

    // Compute final prices and variant match scores
    const listings: RetailerListing[] = rawListings.map((listing) => {
      const finalPrice = listing.currentPrice + listing.deliveryCharge + listing.platformFee;
      const variantMatch = matchProductVariants(baseSpecs, listing.variantSpecs);
      return {
        ...listing,
        finalPrice,
        variantMatch,
      };
    });

    // Mark the lowest verified price (considering exact matches)
    const exactMatches = listings.filter((l) => l.variantMatch?.status === 'exact' && l.inStock);
    const lowestFinal = Math.min(...exactMatches.map((l) => l.finalPrice));
    listings.forEach((l) => {
      if (l.finalPrice === lowestFinal && l.variantMatch?.status === 'exact') {
        l.isLowestVerifiedPrice = true;
      }
    });

    const currentBestPrice = Math.min(...listings.map((l) => l.currentPrice));
    const historicalSummary = calculateHistoricalSummary(priceHistory, currentBestPrice);
    const discountAnalysis = analyzeDiscount(currentBestPrice, 79900, priceHistory);

    return {
      id: 'prod-iphone-16-128gb',
      title: 'Apple iPhone 16 (128 GB) - Black',
      brand: 'Apple',
      model: 'iPhone 16',
      category: 'Smartphones',
      imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80',
      description: 'Features Camera Control, 48MP Fusion camera with 2x Telephoto, latest A18 chip with Apple Intelligence, and durable aerospace-grade aluminum enclosure.',
      baseSpecs,
      listings,
      priceHistory,
      historicalSummary,
      discountAnalysis,
      lastChecked: new Date().toISOString(),
      createdAt: '2026-05-15T10:00:00Z',
    };
  })(),

  // 2. Samsung Galaxy S24 Ultra 256GB Titanium Gray
  (() => {
    const baseSpecs = {
      brand: 'Samsung',
      model: 'Galaxy S24 Ultra',
      storage: '256GB',
      ram: '12GB',
      color: 'Titanium Gray',
      processor: 'Snapdragon 8 Gen 3 for Galaxy',
      screenSize: '6.8 inch Dynamic AMOLED 2X',
      generation: '2024 Flagship',
    };

    const priceHistory: PriceHistoryPoint[] = [
      { date: '2026-03-01', price: 129999, retailer: 'Amazon', eventNote: 'Launch Price' },
      { date: '2026-04-15', price: 129999, retailer: 'Croma' },
      { date: '2026-05-20', price: 124999, retailer: 'Flipkart' },
      { date: '2026-07-05', price: 119999, retailer: 'Reliance Digital' },
      { date: '2026-08-10', price: 114999, retailer: 'Amazon', eventNote: 'Prime Day Drop' },
      { date: '2026-09-01', price: 124999, retailer: 'Flipkart', eventNote: 'Temporary price hike before festival' },
      { date: '2026-10-10', price: 109999, retailer: 'Amazon', eventNote: 'Diwali Special Offer' },
      { date: '2026-11-01', price: 112999, retailer: 'Vijay Sales' },
      { date: '2026-11-18', price: 108999, retailer: 'Croma', eventNote: 'All-time low price' },
      { date: '2026-11-22', price: 109999, retailer: 'Amazon' },
    ];

    const rawListings: Omit<RetailerListing, 'variantMatch' | 'finalPrice'>[] = [
      {
        id: 's24u-amz',
        retailer: 'Amazon',
        productTitle: 'Samsung Galaxy S24 Ultra 5G (Titanium Gray, 12GB, 256GB Storage)',
        productUrl: 'https://www.amazon.in/dp/B0CS5XW9G9',
        imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80',
        currentPrice: 109999,
        originalPrice: 134999,
        discountPercent: 19,
        seller: evaluateSellerReliability({
          name: 'STPL Exclusive Online Store',
          rating: 4.8,
          reviewCount: 28400,
          isVerified: true,
          verificationBadgeText: 'Samsung Authorized Enterprise',
          returnPolicy: '7 Days Service Center Replacement',
          warranty: '1 Year Manufacturer Warranty for Phone & 6 Months for In-Box Accessories',
        }),
        inStock: true,
        stockStatus: 'In Stock',
        deliveryCharge: 0,
        estimatedDelivery: 'Tomorrow, by 1:00 PM',
        platformFee: 0,
        variantSpecs: baseSpecs,
        lastChecked: new Date().toISOString(),
      },
      {
        id: 's24u-fk',
        retailer: 'Flipkart',
        productTitle: 'SAMSUNG Galaxy S24 Ultra 5G (Titanium Gray, 256 GB) (12 GB RAM)',
        productUrl: 'https://www.flipkart.com/samsung-galaxy-s24-ultra-5g-titanium-gray-256-gb/p/itmc91',
        imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80',
        currentPrice: 111999,
        originalPrice: 134999,
        discountPercent: 17,
        seller: evaluateSellerReliability({
          name: 'IndiFlashMart Retail',
          rating: 4.4,
          reviewCount: 14200,
          isVerified: true,
          verificationBadgeText: 'Flipkart Assured',
          returnPolicy: '7 Days Replacement',
          warranty: '1 Year Brand Warranty',
        }),
        inStock: true,
        stockStatus: 'In Stock',
        deliveryCharge: 0,
        estimatedDelivery: '2 business days',
        platformFee: 15,
        variantSpecs: baseSpecs,
        lastChecked: new Date().toISOString(),
      },
      {
        id: 's24u-crm',
        retailer: 'Croma',
        productTitle: 'Samsung Galaxy S24 Ultra 5G (12GB RAM, 256GB, Titanium Gray)',
        productUrl: 'https://www.croma.com/samsung-galaxy-s24-ultra-5g-12gb-ram-256gb-titanium-gray/p/304192',
        imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80',
        currentPrice: 108999,
        originalPrice: 134999,
        discountPercent: 19,
        seller: evaluateSellerReliability({
          name: 'Croma Retail',
          rating: 4.7,
          reviewCount: 18900,
          isVerified: true,
          verificationBadgeText: 'Tata Authenticity Guaranteed',
          returnPolicy: '10 Days Returnable',
          warranty: '1 Year Comprehensive Samsung Warranty',
        }),
        inStock: true,
        stockStatus: 'In Stock (Instant Store Pickup)',
        deliveryCharge: 0,
        estimatedDelivery: 'Same Day Delivery available in select pincodes',
        platformFee: 0,
        variantSpecs: baseSpecs,
        lastChecked: new Date().toISOString(),
      },
      {
        id: 's24u-rd',
        retailer: 'Reliance Digital',
        productTitle: 'Samsung S24 Ultra 5G 256GB Titanium Gray Smartphone',
        productUrl: 'https://www.reliancedigital.in/samsung-s24-ultra-5g-256gb/p/4938210',
        imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80',
        currentPrice: 110499,
        originalPrice: 134999,
        discountPercent: 18,
        seller: evaluateSellerReliability({
          name: 'Reliance Retail',
          rating: 4.6,
          reviewCount: 8900,
          isVerified: true,
          returnPolicy: '7 Days Replacement',
          warranty: '1 Year Brand Warranty',
        }),
        inStock: true,
        stockStatus: 'In Stock',
        deliveryCharge: 0,
        estimatedDelivery: 'Tomorrow afternoon',
        platformFee: 0,
        variantSpecs: baseSpecs,
        lastChecked: new Date().toISOString(),
      },
      {
        id: 's24u-tq',
        retailer: 'Tata CLiQ',
        productTitle: 'Samsung Galaxy S24 Ultra 5G 512GB (Titanium Black)',
        productUrl: 'https://www.tatacliq.com/samsung-galaxy-s24-ultra-512gb/p/mp0000000188',
        imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80',
        currentPrice: 124999,
        originalPrice: 144999,
        discountPercent: 14,
        seller: evaluateSellerReliability({
          name: 'GlobalTech Retailers',
          rating: 3.8,
          reviewCount: 420,
          isVerified: false,
          returnPolicy: '7 Days Returnable',
          warranty: '1 Year Manufacturer Warranty',
        }),
        inStock: true,
        stockStatus: 'In Stock',
        deliveryCharge: 50,
        estimatedDelivery: '3 to 5 business days',
        platformFee: 10,
        variantSpecs: {
          ...baseSpecs,
          storage: '512GB', // Storage variant difference!
          color: 'Titanium Black',
        },
        lastChecked: new Date().toISOString(),
      },
    ];

    const listings: RetailerListing[] = rawListings.map((l) => ({
      ...l,
      finalPrice: l.currentPrice + l.deliveryCharge + l.platformFee,
      variantMatch: matchProductVariants(baseSpecs, l.variantSpecs),
    }));

    const exactMatches = listings.filter((l) => l.variantMatch?.status === 'exact' && l.inStock);
    const lowestFinal = Math.min(...exactMatches.map((l) => l.finalPrice));
    listings.forEach((l) => {
      if (l.finalPrice === lowestFinal && l.variantMatch?.status === 'exact') {
        l.isLowestVerifiedPrice = true;
      }
    });

    const currentBestPrice = Math.min(...listings.map((l) => l.currentPrice));
    const historicalSummary = calculateHistoricalSummary(priceHistory, currentBestPrice);
    const discountAnalysis = analyzeDiscount(currentBestPrice, 134999, priceHistory);

    return {
      id: 'prod-samsung-s24-ultra',
      title: 'Samsung Galaxy S24 Ultra 256GB Titanium Gray',
      brand: 'Samsung',
      model: 'Galaxy S24 Ultra',
      category: 'Smartphones',
      imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80',
      description: 'Galaxy AI is here. Epic camera with 200MP sensor, built-in S Pen, titanium frame, and anti-reflective Corning Gorilla Armor display.',
      baseSpecs,
      listings,
      priceHistory,
      historicalSummary,
      discountAnalysis,
      lastChecked: new Date().toISOString(),
      createdAt: '2026-03-01T10:00:00Z',
    };
  })(),

  // 3. Sony WH-1000XM5 Wireless Headphones
  (() => {
    const baseSpecs = {
      brand: 'Sony',
      model: 'WH-1000XM5',
      color: 'Silver',
      processor: 'Integrated Processor V1 & QN1',
      generation: '5th Generation',
    };

    const priceHistory: PriceHistoryPoint[] = [
      { date: '2026-04-10', price: 34990, retailer: 'Amazon' },
      { date: '2026-05-18', price: 31990, retailer: 'Croma' },
      { date: '2026-06-25', price: 29990, retailer: 'Flipkart' },
      { date: '2026-07-30', price: 34990, retailer: 'Amazon', eventNote: 'MRP reset' },
      { date: '2026-08-20', price: 28990, retailer: 'Reliance Digital', eventNote: 'Freedom Sale' },
      { date: '2026-09-15', price: 29990, retailer: 'Amazon' },
      { date: '2026-10-05', price: 26990, retailer: 'Amazon', eventNote: 'Festival Special' },
      { date: '2026-11-01', price: 29990, retailer: 'Vijay Sales' },
      { date: '2026-11-20', price: 26990, retailer: 'Flipkart', eventNote: 'Flash Deal' },
      { date: '2026-11-22', price: 27490, retailer: 'Amazon' },
    ];

    const rawListings: Omit<RetailerListing, 'variantMatch' | 'finalPrice'>[] = [
      {
        id: 'sony-xm5-amz',
        retailer: 'Amazon',
        productTitle: 'Sony WH-1000XM5 Wireless Industry Leading Noise Canceling Headphones - Silver',
        productUrl: 'https://www.amazon.in/dp/B09XSDC12C',
        imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80',
        currentPrice: 27490,
        originalPrice: 34990,
        discountPercent: 21,
        seller: evaluateSellerReliability({
          name: 'Appario Retail Private Ltd',
          rating: 4.6,
          reviewCount: 38400,
          isVerified: true,
          verificationBadgeText: 'Amazon Fulfilled',
          returnPolicy: '7 Days Replacement',
          warranty: '1 Year Sony India Domestic Warranty',
        }),
        inStock: true,
        stockStatus: 'In Stock',
        deliveryCharge: 0,
        estimatedDelivery: 'Tomorrow, by 2:00 PM',
        platformFee: 5,
        variantSpecs: baseSpecs,
        lastChecked: new Date().toISOString(),
      },
      {
        id: 'sony-xm5-fk',
        retailer: 'Flipkart',
        productTitle: 'SONY WH-1000XM5 Bluetooth Headset (Silver, On the Ear)',
        productUrl: 'https://www.flipkart.com/sony-wh-1000xm5-bluetooth-headset/p/itm71c89',
        imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80',
        currentPrice: 26990,
        originalPrice: 34990,
        discountPercent: 23,
        seller: evaluateSellerReliability({
          name: 'RetailNet Audio Flagship',
          rating: 4.5,
          reviewCount: 16700,
          isVerified: true,
          verificationBadgeText: 'Flipkart Assured',
          returnPolicy: '7 Days Replacement',
          warranty: '1 Year Brand Warranty',
        }),
        inStock: true,
        stockStatus: 'In Stock',
        deliveryCharge: 40,
        estimatedDelivery: 'In 2 days',
        platformFee: 9,
        variantSpecs: baseSpecs,
        lastChecked: new Date().toISOString(),
      },
      {
        id: 'sony-xm5-crm',
        retailer: 'Croma',
        productTitle: 'Sony WH-1000XM5 Over-Ear Active Noise Cancellation Headphones (Silver)',
        productUrl: 'https://www.croma.com/sony-wh-1000xm5-silver/p/260192',
        imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80',
        currentPrice: 28990,
        originalPrice: 34990,
        discountPercent: 17,
        seller: evaluateSellerReliability({
          name: 'Croma Retail',
          rating: 4.7,
          reviewCount: 9400,
          isVerified: true,
          verificationBadgeText: 'Tata Enterprise',
          returnPolicy: '10 Days Returnable',
          warranty: '1 Year Sony Warranty',
        }),
        inStock: true,
        stockStatus: 'In Stock',
        deliveryCharge: 0,
        estimatedDelivery: 'Tomorrow',
        platformFee: 0,
        variantSpecs: baseSpecs,
        lastChecked: new Date().toISOString(),
      },
      {
        id: 'sony-xm5-rd',
        retailer: 'Reliance Digital',
        productTitle: 'Sony WH-1000XM4 Noise Cancelling Headphones - Black',
        productUrl: 'https://www.reliancedigital.in/sony-wh-1000xm4/p/491901',
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
        currentPrice: 21990,
        originalPrice: 29990,
        discountPercent: 27,
        seller: evaluateSellerReliability({
          name: 'Reliance Retail',
          rating: 4.6,
          reviewCount: 11000,
          isVerified: true,
          returnPolicy: '7 Days Replacement',
          warranty: '1 Year Warranty',
        }),
        inStock: true,
        stockStatus: 'In Stock',
        deliveryCharge: 0,
        estimatedDelivery: 'Tomorrow',
        platformFee: 0,
        variantSpecs: {
          brand: 'Sony',
          model: 'WH-1000XM4', // Generation mismatch! (XM4 vs XM5)
          color: 'Black',
          processor: 'QN1',
          generation: '4th Generation',
        },
        lastChecked: new Date().toISOString(),
      },
    ];

    const listings: RetailerListing[] = rawListings.map((l) => ({
      ...l,
      finalPrice: l.currentPrice + l.deliveryCharge + l.platformFee,
      variantMatch: matchProductVariants(baseSpecs, l.variantSpecs),
    }));

    const exactMatches = listings.filter((l) => l.variantMatch?.status === 'exact' && l.inStock);
    const lowestFinal = Math.min(...exactMatches.map((l) => l.finalPrice));
    listings.forEach((l) => {
      if (l.finalPrice === lowestFinal && l.variantMatch?.status === 'exact') {
        l.isLowestVerifiedPrice = true;
      }
    });

    const currentBestPrice = Math.min(...listings.map((l) => l.currentPrice));
    const historicalSummary = calculateHistoricalSummary(priceHistory, currentBestPrice);
    const discountAnalysis = analyzeDiscount(currentBestPrice, 34990, priceHistory);

    return {
      id: 'prod-sony-wh1000xm5',
      title: 'Sony WH-1000XM5 Wireless Headphones (Silver)',
      brand: 'Sony',
      model: 'WH-1000XM5',
      category: 'Audio',
      imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80',
      description: 'Industry-leading noise cancellation optimized to your environment. 30-hour battery life, 2 processors controlling 8 microphones, and ultra-comfortable lightweight design.',
      baseSpecs,
      listings,
      priceHistory,
      historicalSummary,
      discountAnalysis,
      lastChecked: new Date().toISOString(),
      createdAt: '2026-04-10T10:00:00Z',
    };
  })(),

  // 4. HP Pavilion 15 Ryzen 5 (16GB/512GB SSD)
  (() => {
    const baseSpecs = {
      brand: 'HP',
      model: 'Pavilion 15-eh',
      storage: '512GB',
      ram: '16GB',
      color: 'Natural Silver',
      processor: 'AMD Ryzen 5 7530U',
      screenSize: '15.6 inch FHD IPS',
      generation: '7000 Series',
    };

    const priceHistory: PriceHistoryPoint[] = [
      { date: '2026-05-01', price: 62990, retailer: 'HP Store' },
      { date: '2026-06-15', price: 58990, retailer: 'Amazon' },
      { date: '2026-07-20', price: 56990, retailer: 'Flipkart' },
      { date: '2026-08-15', price: 59990, retailer: 'Croma', eventNote: 'Price reset' },
      { date: '2026-09-10', price: 54990, retailer: 'Reliance Digital' },
      { date: '2026-10-01', price: 53990, retailer: 'Amazon', eventNote: 'Great Indian Festival' },
      { date: '2026-11-10', price: 52990, retailer: 'Flipkart', eventNote: 'Lowest price recorded' },
      { date: '2026-11-22', price: 53490, retailer: 'Amazon' },
    ];

    const rawListings: Omit<RetailerListing, 'variantMatch' | 'finalPrice'>[] = [
      {
        id: 'hp-pav-amz',
        retailer: 'Amazon',
        productTitle: 'HP Pavilion 15, AMD Ryzen 5 7530U (16GB RAM/512GB SSD/FHD 15.6") - Natural Silver',
        productUrl: 'https://www.amazon.in/dp/B0BT4G6H5W',
        imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80',
        currentPrice: 53490,
        originalPrice: 68990,
        discountPercent: 22,
        seller: evaluateSellerReliability({
          name: 'Appario Retail Private Ltd',
          rating: 4.6,
          reviewCount: 22000,
          isVerified: true,
          verificationBadgeText: 'Amazon Fulfilled',
          returnPolicy: '7 Days Replacement',
          warranty: '1 Year Onsite HP Manufacturer Warranty',
        }),
        inStock: true,
        stockStatus: 'In Stock',
        deliveryCharge: 0,
        estimatedDelivery: 'Tomorrow, by 5:00 PM',
        platformFee: 5,
        variantSpecs: baseSpecs,
        lastChecked: new Date().toISOString(),
      },
      {
        id: 'hp-pav-fk',
        retailer: 'Flipkart',
        productTitle: 'HP Pavilion AMD Ryzen 5 Hexa Core 7530U (16 GB/512 GB SSD/Windows 11 Home) 15-eh3024AU',
        productUrl: 'https://www.flipkart.com/hp-pavilion-amd-ryzen-5-hexa-core-7530u-16-gb-512-gb-ssd/p/itm19b0',
        imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80',
        currentPrice: 52990,
        originalPrice: 68990,
        discountPercent: 23,
        seller: evaluateSellerReliability({
          name: 'SVPeripherals Official',
          rating: 4.4,
          reviewCount: 9400,
          isVerified: true,
          verificationBadgeText: 'Flipkart Assured',
          returnPolicy: '7 Days Replacement in original condition',
          warranty: '1 Year Onsite Warranty',
        }),
        inStock: true,
        stockStatus: 'In Stock',
        deliveryCharge: 0,
        estimatedDelivery: 'In 2 days',
        platformFee: 9,
        variantSpecs: baseSpecs,
        lastChecked: new Date().toISOString(),
      },
      {
        id: 'hp-pav-crm',
        retailer: 'Croma',
        productTitle: 'HP 15s AMD Ryzen 5 (8GB RAM/512GB SSD) 15.6" Silver',
        productUrl: 'https://www.croma.com/hp-15s-ryzen5-8gb-512gb/p/27192',
        imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80',
        currentPrice: 46990,
        originalPrice: 59990,
        discountPercent: 22,
        seller: evaluateSellerReliability({
          name: 'Croma Retail',
          rating: 4.7,
          reviewCount: 6500,
          isVerified: true,
          verificationBadgeText: 'Tata Authenticity Guaranteed',
          returnPolicy: '10 Days Returnable',
          warranty: '1 Year HP Warranty',
        }),
        inStock: true,
        stockStatus: 'In Stock',
        deliveryCharge: 0,
        estimatedDelivery: 'Tomorrow',
        platformFee: 0,
        variantSpecs: {
          brand: 'HP',
          model: '15s (Budget Series)', // Different model series and 8GB RAM!
          storage: '512GB',
          ram: '8GB',
          color: 'Silver',
          processor: 'AMD Ryzen 5 5500U',
          screenSize: '15.6 inch',
          generation: '5000 Series',
        },
        lastChecked: new Date().toISOString(),
      },
      {
        id: 'hp-pav-rd',
        retailer: 'Reliance Digital',
        productTitle: 'HP Pavilion 15 Ryzen 5 (16GB RAM/512GB SSD) Natural Silver Laptop',
        productUrl: 'https://www.reliancedigital.in/hp-pavilion-15-ryzen-5/p/49219',
        imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80',
        currentPrice: 54990,
        originalPrice: 68990,
        discountPercent: 20,
        seller: evaluateSellerReliability({
          name: 'Reliance Retail',
          rating: 4.5,
          reviewCount: 3800,
          isVerified: true,
          returnPolicy: '7 Days Returnable',
          warranty: '1 Year Brand Warranty',
        }),
        inStock: true,
        stockStatus: 'In Stock',
        deliveryCharge: 0,
        estimatedDelivery: 'Tomorrow',
        platformFee: 0,
        variantSpecs: baseSpecs,
        lastChecked: new Date().toISOString(),
      },
    ];

    const listings: RetailerListing[] = rawListings.map((l) => ({
      ...l,
      finalPrice: l.currentPrice + l.deliveryCharge + l.platformFee,
      variantMatch: matchProductVariants(baseSpecs, l.variantSpecs),
    }));

    const exactMatches = listings.filter((l) => l.variantMatch?.status === 'exact' && l.inStock);
    const lowestFinal = Math.min(...exactMatches.map((l) => l.finalPrice));
    listings.forEach((l) => {
      if (l.finalPrice === lowestFinal && l.variantMatch?.status === 'exact') {
        l.isLowestVerifiedPrice = true;
      }
    });

    const currentBestPrice = Math.min(...listings.map((l) => l.currentPrice));
    const historicalSummary = calculateHistoricalSummary(priceHistory, currentBestPrice);
    const discountAnalysis = analyzeDiscount(currentBestPrice, 68990, priceHistory);

    return {
      id: 'prod-hp-pavilion-15-ryzen5',
      title: 'HP Pavilion 15 Ryzen 5 (16GB / 512GB SSD) Natural Silver',
      brand: 'HP',
      model: 'Pavilion 15-eh',
      category: 'Laptops',
      imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80',
      description: 'Power through work and multitasking with AMD Ryzen 5 7530U 6-core processor, crisp 15.6" micro-edge FHD display, Audio by B&O, and HP Fast Charge.',
      baseSpecs,
      listings,
      priceHistory,
      historicalSummary,
      discountAnalysis,
      lastChecked: new Date().toISOString(),
      createdAt: '2026-05-01T10:00:00Z',
    };
  })(),

  // 5. Apple MacBook Air 13-inch M3 (8GB RAM / 256GB SSD) - Midnight
  (() => {
    const baseSpecs = {
      brand: 'Apple',
      model: 'MacBook Air 13-inch M3',
      storage: '256GB',
      ram: '8GB',
      color: 'Midnight',
      processor: 'Apple M3 Chip (8-core CPU, 8-core GPU)',
      screenSize: '13.6 inch Liquid Retina',
      generation: 'M3 2024',
    };

    const priceHistory: PriceHistoryPoint[] = [
      { date: '2026-06-01', price: 114900, retailer: 'Apple' },
      { date: '2026-07-15', price: 109900, retailer: 'Amazon' },
      { date: '2026-08-20', price: 104990, retailer: 'Flipkart' },
      { date: '2026-09-25', price: 106900, retailer: 'Croma' },
      { date: '2026-10-15', price: 98990, retailer: 'Amazon', eventNote: 'Festival Student Offer' },
      { date: '2026-11-05', price: 101900, retailer: 'Reliance Digital' },
      { date: '2026-11-20', price: 97990, retailer: 'Croma', eventNote: 'Lowest price recorded' },
      { date: '2026-11-22', price: 98490, retailer: 'Amazon' },
    ];

    const rawListings: Omit<RetailerListing, 'variantMatch' | 'finalPrice'>[] = [
      {
        id: 'mac-m3-amz',
        retailer: 'Amazon',
        productTitle: 'Apple 2024 MacBook Air 13" Laptop with M3 chip: 13.6-inch Liquid Retina Display, 8GB Unified Memory, 256GB SSD Storage, Midnight',
        productUrl: 'https://www.amazon.in/dp/B0CX23NSXW',
        imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
        currentPrice: 98490,
        originalPrice: 114900,
        discountPercent: 14,
        seller: evaluateSellerReliability({
          name: 'Appario Retail Private Ltd',
          rating: 4.6,
          reviewCount: 39000,
          isVerified: true,
          verificationBadgeText: 'Amazon Fulfilled',
          returnPolicy: '7 Days Replacement',
          warranty: '1 Year Apple Manufacturer Warranty',
        }),
        inStock: true,
        stockStatus: 'In Stock',
        deliveryCharge: 0,
        estimatedDelivery: 'Tomorrow, by 12:00 PM',
        platformFee: 0,
        variantSpecs: baseSpecs,
        lastChecked: new Date().toISOString(),
      },
      {
        id: 'mac-m3-crm',
        retailer: 'Croma',
        productTitle: 'Apple MacBook Air 13 M3 8GB 256GB Midnight (MRXV3HN/A)',
        productUrl: 'https://www.croma.com/apple-macbook-air-m3-midnight/p/305281',
        imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
        currentPrice: 97990,
        originalPrice: 114900,
        discountPercent: 15,
        seller: evaluateSellerReliability({
          name: 'Croma Retail',
          rating: 4.7,
          reviewCount: 14000,
          isVerified: true,
          verificationBadgeText: 'Apple Authorised Reseller',
          returnPolicy: '10 Days Returnable in original seal',
          warranty: '1 Year Apple Warranty',
        }),
        inStock: true,
        stockStatus: 'In Stock (Store Pickup Available)',
        deliveryCharge: 0,
        estimatedDelivery: 'Tomorrow afternoon',
        platformFee: 0,
        variantSpecs: baseSpecs,
        lastChecked: new Date().toISOString(),
      },
      {
        id: 'mac-m3-fk',
        retailer: 'Flipkart',
        productTitle: 'Apple MacBook Air M3 - (8 GB/256 GB SSD/macOS Sonoma) MRXV3HN/A  (13.6 Inch, Midnight)',
        productUrl: 'https://www.flipkart.com/apple-macbook-air-m3/p/itmd8129',
        imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
        currentPrice: 99490,
        originalPrice: 114900,
        discountPercent: 13,
        seller: evaluateSellerReliability({
          name: 'RetailNet',
          rating: 4.5,
          reviewCount: 22000,
          isVerified: true,
          verificationBadgeText: 'Flipkart Assured',
          returnPolicy: '7 Days Replacement',
          warranty: '1 Year Brand Warranty',
        }),
        inStock: true,
        stockStatus: 'In Stock',
        deliveryCharge: 0,
        estimatedDelivery: 'In 2 days',
        platformFee: 15,
        variantSpecs: baseSpecs,
        lastChecked: new Date().toISOString(),
      },
      {
        id: 'mac-m3-rd',
        retailer: 'Reliance Digital',
        productTitle: 'Apple MacBook Air 13 M3 8GB 512GB Midnight',
        productUrl: 'https://www.reliancedigital.in/apple-macbook-air-m3-512gb/p/494191',
        imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
        currentPrice: 117900,
        originalPrice: 134900,
        discountPercent: 12,
        seller: evaluateSellerReliability({
          name: 'Reliance Digital Official',
          rating: 4.6,
          reviewCount: 7800,
          isVerified: true,
          returnPolicy: '7 Days Replacement',
          warranty: '1 Year Brand Warranty',
        }),
        inStock: true,
        stockStatus: 'In Stock',
        deliveryCharge: 0,
        estimatedDelivery: 'Tomorrow',
        platformFee: 0,
        variantSpecs: {
          ...baseSpecs,
          storage: '512GB', // Storage mismatch
        },
        lastChecked: new Date().toISOString(),
      },
    ];

    const listings: RetailerListing[] = rawListings.map((l) => ({
      ...l,
      finalPrice: l.currentPrice + l.deliveryCharge + l.platformFee,
      variantMatch: matchProductVariants(baseSpecs, l.variantSpecs),
    }));

    const exactMatches = listings.filter((l) => l.variantMatch?.status === 'exact' && l.inStock);
    const lowestFinal = Math.min(...exactMatches.map((l) => l.finalPrice));
    listings.forEach((l) => {
      if (l.finalPrice === lowestFinal && l.variantMatch?.status === 'exact') {
        l.isLowestVerifiedPrice = true;
      }
    });

    const currentBestPrice = Math.min(...listings.map((l) => l.currentPrice));
    const historicalSummary = calculateHistoricalSummary(priceHistory, currentBestPrice);
    const discountAnalysis = analyzeDiscount(currentBestPrice, 114900, priceHistory);

    return {
      id: 'prod-macbook-air-m3',
      title: 'Apple MacBook Air 13-inch M3 (8GB / 256GB) Midnight',
      brand: 'Apple',
      model: 'MacBook Air 13-inch M3',
      category: 'Laptops',
      imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
      description: 'Strikingly thin design, up to 18 hours of battery life, gorgeous Liquid Retina display, MagSafe 3 charging, and dual external display support.',
      baseSpecs,
      listings,
      priceHistory,
      historicalSummary,
      discountAnalysis,
      lastChecked: new Date().toISOString(),
      createdAt: '2026-06-01T10:00:00Z',
    };
  })(),

  // 6. Apple Watch Series 10 (GPS 46mm) Jet Black Aluminum
  (() => {
    const baseSpecs = {
      brand: 'Apple',
      model: 'Watch Series 10',
      storage: '64GB',
      color: 'Jet Black',
      screenSize: '46mm Wide-angle OLED',
      processor: 'S10 SiP',
      generation: 'Series 10 (2024)',
    };

    const priceHistory: PriceHistoryPoint[] = [
      { date: '2026-09-20', price: 49900, retailer: 'Amazon', eventNote: 'Launch MRP' },
      { date: '2026-10-05', price: 48990, retailer: 'Croma' },
      { date: '2026-10-25', price: 47990, retailer: 'Flipkart' },
      { date: '2026-11-10', price: 46990, retailer: 'Amazon', eventNote: 'Lowest price recorded' },
      { date: '2026-11-22', price: 46990, retailer: 'Amazon' },
    ];

    const rawListings: Omit<RetailerListing, 'variantMatch' | 'finalPrice'>[] = [
      {
        id: 'aw-s10-amz',
        retailer: 'Amazon',
        productTitle: 'Apple Watch Series 10 [GPS 46mm] Smartwatch with Jet Black Aluminium Case',
        productUrl: 'https://www.amazon.in/dp/B0DGJ9BXYZ',
        imageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=600&q=80',
        currentPrice: 46990,
        originalPrice: 49900,
        discountPercent: 6,
        seller: evaluateSellerReliability({
          name: 'Appario Retail Private Ltd',
          rating: 4.6,
          reviewCount: 31000,
          isVerified: true,
          verificationBadgeText: 'Amazon Fulfilled',
          returnPolicy: '7 Days Replacement',
          warranty: '1 Year Apple Manufacturer Warranty',
        }),
        inStock: true,
        stockStatus: 'In Stock',
        deliveryCharge: 0,
        estimatedDelivery: 'Tomorrow, by 1:00 PM',
        platformFee: 5,
        variantSpecs: baseSpecs,
        lastChecked: new Date().toISOString(),
      },
      {
        id: 'aw-s10-crm',
        retailer: 'Croma',
        productTitle: 'Apple Watch Series 10 GPS 46mm Jet Black Aluminium Case with Black Sport Band',
        productUrl: 'https://www.croma.com/apple-watch-series-10-46mm-jet-black/p/308901',
        imageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=600&q=80',
        currentPrice: 47490,
        originalPrice: 49900,
        discountPercent: 5,
        seller: evaluateSellerReliability({
          name: 'Croma Retail',
          rating: 4.7,
          reviewCount: 12000,
          isVerified: true,
          verificationBadgeText: 'Apple Authorised Reseller',
          returnPolicy: '10 Days Returnable in original packing',
          warranty: '1 Year Apple Warranty',
        }),
        inStock: true,
        stockStatus: 'In Stock',
        deliveryCharge: 0,
        estimatedDelivery: 'Tomorrow afternoon',
        platformFee: 0,
        variantSpecs: baseSpecs,
        lastChecked: new Date().toISOString(),
      },
      {
        id: 'aw-s10-fk',
        retailer: 'Flipkart',
        productTitle: 'Apple Watch Series 10 GPS 42mm (Jet Black Aluminum, S/M)',
        productUrl: 'https://www.flipkart.com/apple-watch-series-10-42mm/p/itm10291',
        imageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=600&q=80',
        currentPrice: 44990,
        originalPrice: 46900,
        discountPercent: 4,
        seller: evaluateSellerReliability({
          name: 'RetailNet Smart Gadgets',
          rating: 4.5,
          reviewCount: 19000,
          isVerified: true,
          verificationBadgeText: 'Flipkart Assured',
          returnPolicy: '7 Days Replacement',
          warranty: '1 Year Brand Warranty',
        }),
        inStock: true,
        stockStatus: 'In Stock',
        deliveryCharge: 40,
        estimatedDelivery: '2 business days',
        platformFee: 9,
        variantSpecs: {
          ...baseSpecs,
          screenSize: '42mm (Smaller dial variant)', // Size difference detected!
        },
        lastChecked: new Date().toISOString(),
      },
      {
        id: 'aw-s10-rd',
        retailer: 'Reliance Digital',
        productTitle: 'Apple Watch Series 10 GPS 46 mm Jet Black Aluminium Case',
        productUrl: 'https://www.reliancedigital.in/apple-watch-series-10-46mm/p/4944910',
        imageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=600&q=80',
        currentPrice: 47990,
        originalPrice: 49900,
        discountPercent: 4,
        seller: evaluateSellerReliability({
          name: 'Reliance Retail',
          rating: 4.6,
          reviewCount: 7800,
          isVerified: true,
          returnPolicy: '7 Days Returnable',
          warranty: '1 Year Official Warranty',
        }),
        inStock: true,
        stockStatus: 'In Stock',
        deliveryCharge: 0,
        estimatedDelivery: 'Tomorrow',
        platformFee: 0,
        variantSpecs: baseSpecs,
        lastChecked: new Date().toISOString(),
      },
    ];

    const listings: RetailerListing[] = rawListings.map((l) => ({
      ...l,
      finalPrice: l.currentPrice + l.deliveryCharge + l.platformFee,
      variantMatch: matchProductVariants(baseSpecs, l.variantSpecs),
    }));

    const exactMatches = listings.filter((l) => l.variantMatch?.status === 'exact' && l.inStock);
    const lowestFinal = Math.min(...exactMatches.map((l) => l.finalPrice));
    listings.forEach((l) => {
      if (l.finalPrice === lowestFinal && l.variantMatch?.status === 'exact') {
        l.isLowestVerifiedPrice = true;
      }
    });

    const currentBestPrice = Math.min(...listings.map((l) => l.currentPrice));
    const historicalSummary = calculateHistoricalSummary(priceHistory, currentBestPrice);
    const discountAnalysis = analyzeDiscount(currentBestPrice, 49900, priceHistory);

    return {
      id: 'prod-apple-watch-s10',
      title: 'Apple Watch Series 10 [GPS 46mm] Jet Black Aluminum',
      brand: 'Apple',
      model: 'Watch Series 10',
      category: 'Wearables',
      imageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=600&q=80',
      description: 'Thinnest Apple Watch ever with the biggest display yet. Breakthrough health metrics, sleep apnea notifications, faster charging, and depth gauge for water activities.',
      baseSpecs,
      listings,
      priceHistory,
      historicalSummary,
      discountAnalysis,
      lastChecked: new Date().toISOString(),
      createdAt: '2026-09-20T10:00:00Z',
    };
  })(),

  // 7. Philips Digital Air Fryer HD9252 (Daily Kitchen Electronic)
  (() => {
    const baseSpecs = {
      brand: 'Philips',
      model: 'HD9252/90 Digital',
      storage: '4.1 Litre',
      color: 'Black',
      processor: 'Rapid Air Technology (1400W)',
      generation: 'Essential Series',
      otherSpecs: { 'Cooking Presets': '7 Touchscreen Presets', 'Coating': 'Non-stick Dishwasher Safe' },
    };

    const priceHistory: PriceHistoryPoint[] = [
      { date: '2026-06-01', price: 11995, retailer: 'Philips' },
      { date: '2026-07-15', price: 8499, retailer: 'Amazon' },
      { date: '2026-08-20', price: 7999, retailer: 'Flipkart' },
      { date: '2026-09-10', price: 8999, retailer: 'Croma', eventNote: 'Price reset' },
      { date: '2026-10-05', price: 6999, retailer: 'Amazon', eventNote: 'Great Indian Festival' },
      { date: '2026-11-01', price: 7499, retailer: 'Reliance Digital' },
      { date: '2026-11-18', price: 6799, retailer: 'Vijay Sales', eventNote: 'Lowest price recorded' },
      { date: '2026-11-22', price: 6999, retailer: 'Amazon' },
    ];

    const rawListings: Omit<RetailerListing, 'variantMatch' | 'finalPrice'>[] = [
      {
        id: 'philips-af-amz',
        retailer: 'Amazon',
        productTitle: 'Philips Digital Air Fryer HD9252/90 with Touch Panel, 4.1 Litre, Rapid Air Technology, 1400W',
        productUrl: 'https://www.amazon.in/dp/B0922W6X9V',
        imageUrl: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=600&q=80',
        currentPrice: 6999,
        originalPrice: 11995,
        discountPercent: 42,
        seller: evaluateSellerReliability({
          name: 'Appario Retail Private Ltd',
          rating: 4.6,
          reviewCount: 26000,
          isVerified: true,
          verificationBadgeText: 'Amazon Fulfilled',
          returnPolicy: '7 Days Replacement',
          warranty: '2 Year Philips Worldwide Warranty',
        }),
        inStock: true,
        stockStatus: 'In Stock',
        deliveryCharge: 0,
        estimatedDelivery: 'Tomorrow, by 11:00 AM',
        platformFee: 0,
        variantSpecs: baseSpecs,
        lastChecked: new Date().toISOString(),
      },
      {
        id: 'philips-af-fk',
        retailer: 'Flipkart',
        productTitle: 'PHILIPS HD9252/90 4.1 L Air Fryer (Black)',
        productUrl: 'https://www.flipkart.com/philips-hd9252-90-air-fryer/p/itme9102',
        imageUrl: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=600&q=80',
        currentPrice: 7199,
        originalPrice: 11995,
        discountPercent: 40,
        seller: evaluateSellerReliability({
          name: 'RetailNet Appliances',
          rating: 4.5,
          reviewCount: 14000,
          isVerified: true,
          verificationBadgeText: 'Flipkart Assured',
          returnPolicy: '7 Days Replacement',
          warranty: '2 Years Manufacturer Warranty',
        }),
        inStock: true,
        stockStatus: 'In Stock',
        deliveryCharge: 0,
        estimatedDelivery: '2 business days',
        platformFee: 9,
        variantSpecs: baseSpecs,
        lastChecked: new Date().toISOString(),
      },
      {
        id: 'philips-af-crm',
        retailer: 'Croma',
        productTitle: 'Philips Essential 4.1 Litre Digital Air Fryer (HD9252/90, Black)',
        productUrl: 'https://www.croma.com/philips-hd9252-90-digital-air-fryer/p/241902',
        imageUrl: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=600&q=80',
        currentPrice: 7299,
        originalPrice: 11995,
        discountPercent: 39,
        seller: evaluateSellerReliability({
          name: 'Croma Retail',
          rating: 4.7,
          reviewCount: 8900,
          isVerified: true,
          verificationBadgeText: 'Tata Enterprise',
          returnPolicy: '10 Days Returnable',
          warranty: '2 Years Comprehensive Warranty',
        }),
        inStock: true,
        stockStatus: 'In Stock (Store Pickup Available)',
        deliveryCharge: 0,
        estimatedDelivery: 'Tomorrow',
        platformFee: 0,
        variantSpecs: baseSpecs,
        lastChecked: new Date().toISOString(),
      },
      {
        id: 'philips-af-vjs',
        retailer: 'Vijay Sales',
        productTitle: 'Philips HD9252 4.1L Digital Airfryer (Black)',
        productUrl: 'https://www.vijaysales.com/philips-hd9252-air-fryer/p/18291',
        imageUrl: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=600&q=80',
        currentPrice: 6799,
        originalPrice: 11995,
        discountPercent: 43,
        seller: evaluateSellerReliability({
          name: 'Vijay Sales Electronics Hub',
          rating: 4.4,
          reviewCount: 3400,
          isVerified: true,
          verificationBadgeText: 'Authorized Partner',
          returnPolicy: '7 Days Replacement',
          warranty: '2 Year Official Warranty',
        }),
        inStock: true,
        stockStatus: 'In Stock',
        deliveryCharge: 0,
        estimatedDelivery: '3 to 4 business days',
        platformFee: 0,
        variantSpecs: baseSpecs,
        lastChecked: new Date().toISOString(),
      },
    ];

    const listings: RetailerListing[] = rawListings.map((l) => ({
      ...l,
      finalPrice: l.currentPrice + l.deliveryCharge + l.platformFee,
      variantMatch: matchProductVariants(baseSpecs, l.variantSpecs),
    }));

    const exactMatches = listings.filter((l) => l.variantMatch?.status === 'exact' && l.inStock);
    const lowestFinal = Math.min(...exactMatches.map((l) => l.finalPrice));
    listings.forEach((l) => {
      if (l.finalPrice === lowestFinal && l.variantMatch?.status === 'exact') {
        l.isLowestVerifiedPrice = true;
      }
    });

    const currentBestPrice = Math.min(...listings.map((l) => l.currentPrice));
    const historicalSummary = calculateHistoricalSummary(priceHistory, currentBestPrice);
    const discountAnalysis = analyzeDiscount(currentBestPrice, 11995, priceHistory);

    return {
      id: 'prod-philips-airfryer-hd9252',
      title: 'Philips Digital Air Fryer HD9252/90 (4.1 Litre / 1400W)',
      brand: 'Philips',
      model: 'HD9252/90 Digital',
      category: 'Home & Kitchen',
      imageUrl: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=600&q=80',
      description: 'Healthy frying with Rapid Air technology. 90% less fat, easy touch screen with 7 presets, keep-warm function, and dishwasher safe removable parts.',
      baseSpecs,
      listings,
      priceHistory,
      historicalSummary,
      discountAnalysis,
      lastChecked: new Date().toISOString(),
      createdAt: '2026-06-01T10:00:00Z',
    };
  })(),

  // 8. Dyson Purifier Cool Gen1 (TP10) HEPA Air Purifier (Smart Home)
  (() => {
    const baseSpecs = {
      brand: 'Dyson',
      model: 'Purifier Cool Gen1 TP10',
      color: 'White/Silver',
      processor: 'Air Multiplier & HEPA H13 Filtration',
      generation: 'Gen1 (2024)',
      otherSpecs: { 'Coverage': 'Up to 600 sq ft', 'Oscillation': '350 degrees' },
    };

    const priceHistory: PriceHistoryPoint[] = [
      { date: '2026-05-10', price: 39900, retailer: 'Dyson' },
      { date: '2026-06-20', price: 34900, retailer: 'Amazon' },
      { date: '2026-08-15', price: 32900, retailer: 'Croma', eventNote: 'Monsoon Clean Air Sale' },
      { date: '2026-09-25', price: 39900, retailer: 'Flipkart', eventNote: 'Price reset before festival' },
      { date: '2026-10-15', price: 29900, retailer: 'Amazon', eventNote: 'Festival Deal' },
      { date: '2026-11-10', price: 29900, retailer: 'Croma' },
      { date: '2026-11-22', price: 30490, retailer: 'Amazon' },
    ];

    const rawListings: Omit<RetailerListing, 'variantMatch' | 'finalPrice'>[] = [
      {
        id: 'dyson-tp10-amz',
        retailer: 'Amazon',
        productTitle: 'Dyson Purifier Cool Gen1 TP10 - HEPA Air Purifier and Bladeless Fan (White/Silver)',
        productUrl: 'https://www.amazon.in/dp/B0CQT2L4P9',
        imageUrl: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=600&q=80',
        currentPrice: 30490,
        originalPrice: 39900,
        discountPercent: 24,
        seller: evaluateSellerReliability({
          name: 'Appario Retail Private Ltd',
          rating: 4.6,
          reviewCount: 18000,
          isVerified: true,
          verificationBadgeText: 'Amazon Fulfilled',
          returnPolicy: '7 Days Replacement',
          warranty: '2 Year Official Dyson Warranty',
        }),
        inStock: true,
        stockStatus: 'In Stock',
        deliveryCharge: 0,
        estimatedDelivery: 'Tomorrow, by 12:00 PM',
        platformFee: 0,
        variantSpecs: baseSpecs,
        lastChecked: new Date().toISOString(),
      },
      {
        id: 'dyson-tp10-crm',
        retailer: 'Croma',
        productTitle: 'Dyson Purifier Cool Gen1 (TP10) Air Purifier with HEPA H13 Filter (White/Silver)',
        productUrl: 'https://www.croma.com/dyson-tp10-air-purifier/p/304910',
        imageUrl: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=600&q=80',
        currentPrice: 29900,
        originalPrice: 39900,
        discountPercent: 25,
        seller: evaluateSellerReliability({
          name: 'Croma Retail',
          rating: 4.7,
          reviewCount: 9200,
          isVerified: true,
          verificationBadgeText: 'Dyson Authorized Partner',
          returnPolicy: '10 Days Returnable in original packing',
          warranty: '2 Years Manufacturer Warranty',
        }),
        inStock: true,
        stockStatus: 'In Stock (Store Pickup Available)',
        deliveryCharge: 0,
        estimatedDelivery: 'Tomorrow afternoon',
        platformFee: 0,
        variantSpecs: baseSpecs,
        lastChecked: new Date().toISOString(),
      },
      {
        id: 'dyson-tp10-rd',
        retailer: 'Reliance Digital',
        productTitle: 'Dyson Purifier Cool Gen1 TP10 Bladeless Air Purifier Fan',
        productUrl: 'https://www.reliancedigital.in/dyson-tp10/p/493902',
        imageUrl: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=600&q=80',
        currentPrice: 31490,
        originalPrice: 39900,
        discountPercent: 21,
        seller: evaluateSellerReliability({
          name: 'Reliance Retail',
          rating: 4.6,
          reviewCount: 5400,
          isVerified: true,
          returnPolicy: '7 Days Replacement',
          warranty: '2 Years Dyson Warranty',
        }),
        inStock: true,
        stockStatus: 'In Stock',
        deliveryCharge: 0,
        estimatedDelivery: 'Tomorrow',
        platformFee: 0,
        variantSpecs: baseSpecs,
        lastChecked: new Date().toISOString(),
      },
    ];

    const listings: RetailerListing[] = rawListings.map((l) => ({
      ...l,
      finalPrice: l.currentPrice + l.deliveryCharge + l.platformFee,
      variantMatch: matchProductVariants(baseSpecs, l.variantSpecs),
    }));

    const exactMatches = listings.filter((l) => l.variantMatch?.status === 'exact' && l.inStock);
    const lowestFinal = Math.min(...exactMatches.map((l) => l.finalPrice));
    listings.forEach((l) => {
      if (l.finalPrice === lowestFinal && l.variantMatch?.status === 'exact') {
        l.isLowestVerifiedPrice = true;
      }
    });

    const currentBestPrice = Math.min(...listings.map((l) => l.currentPrice));
    const historicalSummary = calculateHistoricalSummary(priceHistory, currentBestPrice);
    const discountAnalysis = analyzeDiscount(currentBestPrice, 39900, priceHistory);

    return {
      id: 'prod-dyson-purifier-tp10',
      title: 'Dyson Purifier Cool Gen1 (TP10) HEPA Air Purifier',
      brand: 'Dyson',
      model: 'Purifier Cool Gen1 TP10',
      category: 'Smart Home',
      imageUrl: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=600&q=80',
      description: 'Automatically senses, captures and traps pollutants for cleaner air. Fully sealed to HEPA H13 standard, removing 99.95% of ultrafine particles.',
      baseSpecs,
      listings,
      priceHistory,
      historicalSummary,
      discountAnalysis,
      lastChecked: new Date().toISOString(),
      createdAt: '2026-05-10T10:00:00Z',
    };
  })(),

  // 9. Sony PlayStation 5 Slim Disc Edition 1TB SSD (Gaming)
  (() => {
    const baseSpecs = {
      brand: 'Sony',
      model: 'PlayStation 5 Slim',
      storage: '1TB SSD',
      ram: '16GB GDDR6',
      color: 'White',
      processor: 'Custom AMD Zen 2 (8-core/16-thread)',
      generation: 'Slim (CFI-2000)',
      otherSpecs: { 'Optical Drive': 'Ultra HD Blu-ray Disc Drive', 'Resolution': 'Up to 4K 120Hz' },
    };

    const priceHistory: PriceHistoryPoint[] = [
      { date: '2026-04-01', price: 54990, retailer: 'Sony' },
      { date: '2026-05-15', price: 54990, retailer: 'Amazon' },
      { date: '2026-06-25', price: 49990, retailer: 'Flipkart', eventNote: 'Summer Gaming Fest' },
      { date: '2026-08-10', price: 54990, retailer: 'Croma', eventNote: 'Price reset' },
      { date: '2026-09-28', price: 47990, retailer: 'Amazon', eventNote: 'Festival Special' },
      { date: '2026-11-05', price: 49990, retailer: 'Vijay Sales' },
      { date: '2026-11-20', price: 47490, retailer: 'Flipkart', eventNote: 'Lowest price recorded' },
      { date: '2026-11-22', price: 47990, retailer: 'Amazon' },
    ];

    const rawListings: Omit<RetailerListing, 'variantMatch' | 'finalPrice'>[] = [
      {
        id: 'ps5-slim-amz',
        retailer: 'Amazon',
        productTitle: 'Sony PlayStation 5 Slim Console (Disc Edition) - 1TB SSD',
        productUrl: 'https://www.amazon.in/dp/B0CY5Q2S5L',
        imageUrl: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=600&q=80',
        currentPrice: 47990,
        originalPrice: 54990,
        discountPercent: 13,
        seller: evaluateSellerReliability({
          name: 'Electronic Bazaar Store Official',
          rating: 4.7,
          reviewCount: 19400,
          isVerified: true,
          verificationBadgeText: 'Sony Authorised Retailer',
          returnPolicy: '7 Days Replacement',
          warranty: '1 Year Sony India Domestic Warranty',
        }),
        inStock: true,
        stockStatus: 'In Stock',
        deliveryCharge: 0,
        estimatedDelivery: 'Tomorrow, by 1:00 PM',
        platformFee: 5,
        variantSpecs: baseSpecs,
        lastChecked: new Date().toISOString(),
      },
      {
        id: 'ps5-slim-fk',
        retailer: 'Flipkart',
        productTitle: 'SONY PlayStation 5 Slim 1024 GB (White)',
        productUrl: 'https://www.flipkart.com/sony-playstation-5-slim-1024-gb/p/itm7e192',
        imageUrl: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=600&q=80',
        currentPrice: 47490,
        originalPrice: 54990,
        discountPercent: 14,
        seller: evaluateSellerReliability({
          name: 'RetailNet Gaming Store',
          rating: 4.6,
          reviewCount: 16000,
          isVerified: true,
          verificationBadgeText: 'Flipkart Assured',
          returnPolicy: '7 Days Replacement in original seal',
          warranty: '1 Year Brand Warranty',
        }),
        inStock: true,
        stockStatus: 'In Stock',
        deliveryCharge: 0,
        estimatedDelivery: 'In 2 days',
        platformFee: 9,
        variantSpecs: baseSpecs,
        lastChecked: new Date().toISOString(),
      },
      {
        id: 'ps5-slim-crm',
        retailer: 'Croma',
        productTitle: 'Sony PlayStation 5 Slim Digital Edition (1TB SSD, White)',
        productUrl: 'https://www.croma.com/sony-ps5-slim-digital/p/305891',
        imageUrl: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=600&q=80',
        currentPrice: 39990,
        originalPrice: 44990,
        discountPercent: 11,
        seller: evaluateSellerReliability({
          name: 'Croma Retail',
          rating: 4.7,
          reviewCount: 11000,
          isVerified: true,
          verificationBadgeText: 'Tata Enterprise',
          returnPolicy: '10 Days Returnable',
          warranty: '1 Year Sony Warranty',
        }),
        inStock: true,
        stockStatus: 'In Stock',
        deliveryCharge: 0,
        estimatedDelivery: 'Tomorrow',
        platformFee: 0,
        variantSpecs: {
          ...baseSpecs,
          model: 'PlayStation 5 Slim Digital (No Disc Drive)', // Variant difference detected!
          otherSpecs: { 'Optical Drive': 'None (Digital Only)' },
        },
        lastChecked: new Date().toISOString(),
      },
      {
        id: 'ps5-slim-rd',
        retailer: 'Reliance Digital',
        productTitle: 'Sony PlayStation 5 Slim Console with Disc Drive 1TB',
        productUrl: 'https://www.reliancedigital.in/sony-ps5-slim-disc/p/494291',
        imageUrl: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=600&q=80',
        currentPrice: 48990,
        originalPrice: 54990,
        discountPercent: 11,
        seller: evaluateSellerReliability({
          name: 'Reliance Retail',
          rating: 4.6,
          reviewCount: 7500,
          isVerified: true,
          returnPolicy: '7 Days Replacement',
          warranty: '1 Year Official Warranty',
        }),
        inStock: true,
        stockStatus: 'In Stock',
        deliveryCharge: 0,
        estimatedDelivery: 'Tomorrow',
        platformFee: 0,
        variantSpecs: baseSpecs,
        lastChecked: new Date().toISOString(),
      },
    ];

    const listings: RetailerListing[] = rawListings.map((l) => ({
      ...l,
      finalPrice: l.currentPrice + l.deliveryCharge + l.platformFee,
      variantMatch: matchProductVariants(baseSpecs, l.variantSpecs),
    }));

    const exactMatches = listings.filter((l) => l.variantMatch?.status === 'exact' && l.inStock);
    const lowestFinal = Math.min(...exactMatches.map((l) => l.finalPrice));
    listings.forEach((l) => {
      if (l.finalPrice === lowestFinal && l.variantMatch?.status === 'exact') {
        l.isLowestVerifiedPrice = true;
      }
    });

    const currentBestPrice = Math.min(...listings.map((l) => l.currentPrice));
    const historicalSummary = calculateHistoricalSummary(priceHistory, currentBestPrice);
    const discountAnalysis = analyzeDiscount(currentBestPrice, 54990, priceHistory);

    return {
      id: 'prod-sony-ps5-slim',
      title: 'Sony PlayStation 5 Slim (Disc Edition 1TB SSD)',
      brand: 'Sony',
      model: 'PlayStation 5 Slim',
      category: 'Gaming',
      imageUrl: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=600&q=80',
      description: 'The PS5 Slim packs powerful gaming tech inside a sleek and compact console design with 1TB SSD storage, ray tracing, haptic feedback, and 4K-TV gaming.',
      baseSpecs,
      listings,
      priceHistory,
      historicalSummary,
      discountAnalysis,
      lastChecked: new Date().toISOString(),
      createdAt: '2026-04-01T10:00:00Z',
    };
  })(),
];
