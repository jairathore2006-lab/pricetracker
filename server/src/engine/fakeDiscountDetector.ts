import { PriceHistoryPoint, DiscountAnalysis, HistoricalPriceSummary } from '../types/index.js';

/**
 * Formats Indian Currency (INR) with commas
 */
function formatInr(val: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(val);
}

/**
 * Calculates historical price summary metrics from price history points
 */
export function calculateHistoricalSummary(
  history: PriceHistoryPoint[],
  currentPrice: number
): HistoricalPriceSummary {
  if (!history || history.length === 0) {
    return {
      highestPrice: currentPrice,
      lowestPrice: currentPrice,
      averagePrice: currentPrice,
      currentPrice,
      previousPrice: currentPrice,
      percentageChange: 0,
      summaryStatement: 'Insufficient historical tracking data available yet.',
      hasEnoughData: false,
    };
  }

  const prices = history.map((p) => p.price);
  const highestPrice = Math.max(...prices, currentPrice);
  const lowestPrice = Math.min(...prices, currentPrice);
  const sum = prices.reduce((acc, curr) => acc + curr, 0);
  const averagePrice = Math.round(sum / prices.length);
  const previousPrice = history.length > 1 ? history[history.length - 2].price : prices[0];

  const percentageChange = Math.round(((currentPrice - averagePrice) / averagePrice) * 100);

  let summaryStatement = '';
  if (percentageChange < -5) {
    summaryStatement = `Good news! This product is currently ${Math.abs(percentageChange)}% cheaper than its historical average of ${formatInr(averagePrice)}.`;
  } else if (percentageChange > 5) {
    summaryStatement = `Caution: The current price is ${percentageChange}% higher than its recorded average of ${formatInr(averagePrice)}. Consider waiting for a price drop.`;
  } else {
    summaryStatement = `Current price is in line with the historical average selling price (${formatInr(averagePrice)}).`;
  }

  return {
    highestPrice,
    lowestPrice,
    averagePrice,
    currentPrice,
    previousPrice,
    percentageChange,
    summaryStatement,
    hasEnoughData: history.length >= 5,
  };
}

/**
 * PriceWise Fake Discount Detection Engine
 *
 * Implements requirement F:
 * - Compares current price against real historical selling prices rather than relying solely on MRP.
 * - Detects:
 *   1. Genuine discounts (selling well below historical average)
 *   2. Inflated original prices (MRP artificially high, product never sells at MRP)
 *   3. Price hikes followed by pseudo-discounts (temporary bump before sale)
 *   4. Prices higher than historical average
 *   5. Unusual price volatility
 *
 * Classifies as:
 * - Genuine Deal
 * - Possible Fake Discount
 * - Price Above Average
 * - Normal Market Price
 * - Insufficient Price History
 */
export function analyzeDiscount(
  currentPrice: number,
  listedMrp: number,
  history: PriceHistoryPoint[]
): DiscountAnalysis {
  if (!history || history.length < 3) {
    const naiveMrpDiscount = listedMrp > currentPrice
      ? Math.round(((listedMrp - currentPrice) / listedMrp) * 100)
      : 0;

    return {
      classification: 'Insufficient Price History',
      badgeColor: 'slate',
      headline: 'Tracking Started Recently',
      explanation: `We began tracking this product recently. The listed discount is ${naiveMrpDiscount}% against MRP (${formatInr(listedMrp)}), but more historical data is being collected to verify actual savings.`,
      listedMrp,
      currentPrice,
      historicalAverage: currentPrice,
      historicalLowest: currentPrice,
      historicalHighest: currentPrice,
      realDiscountPercent: 0,
      mrpDiscountPercent: naiveMrpDiscount,
      savingsVsAverage: 0,
      isAllTimeLow: false,
      unusualFluctuationDetected: false,
    };
  }

  const prices = history.map((h) => h.price);
  const historicalLowest = Math.min(...prices);
  const historicalHighest = Math.max(...prices);
  const historicalAverage = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);

  const mrpDiscountPercent = listedMrp > currentPrice
    ? Math.round(((listedMrp - currentPrice) / listedMrp) * 100)
    : 0;

  // Real discount is measured against the regular historical average price
  const savingsVsAverage = historicalAverage - currentPrice;
  const realDiscountPercent = Math.round((savingsVsAverage / historicalAverage) * 100);
  const isAllTimeLow = currentPrice <= historicalLowest;

  // Check for artificial inflation (if last recorded price before drop was raised abruptly >15% above 60-day average)
  let unusualFluctuationDetected = false;
  if (history.length >= 4) {
    const recentPrices = history.slice(-4);
    const maxRecent = Math.max(...recentPrices.map(r => r.price));
    if (maxRecent > historicalAverage * 1.15 && currentPrice < maxRecent) {
      unusualFluctuationDetected = true;
    }
  }

  // 1. GENUINE DEAL: Current price is at least 8% lower than historical average, or near all-time low
  if (isAllTimeLow || realDiscountPercent >= 8) {
    return {
      classification: 'Genuine Deal',
      badgeColor: 'emerald',
      headline: isAllTimeLow ? 'All-Time Lowest Recorded Price!' : 'Substantial Verified Discount',
      explanation: isAllTimeLow
        ? `Verified genuine deal: At ${formatInr(currentPrice)}, this matches or beats the lowest price ever recorded (${formatInr(historicalLowest)}). You save ${formatInr(savingsVsAverage)} compared to the ${formatInr(historicalAverage)} typical average.`
        : `This product is genuinely discounted. You are paying ${formatInr(currentPrice)}, which is ${realDiscountPercent}% below its historical average selling price of ${formatInr(historicalAverage)}.`,
      listedMrp,
      currentPrice,
      historicalAverage,
      historicalLowest,
      historicalHighest,
      realDiscountPercent,
      mrpDiscountPercent,
      savingsVsAverage,
      isAllTimeLow,
      unusualFluctuationDetected,
    };
  }

  // 2. POSSIBLE FAKE DISCOUNT: High MRP discount claimed (e.g. 25%+), but current price is within 2% or higher than the typical average
  if (mrpDiscountPercent >= 20 && savingsVsAverage <= (historicalAverage * 0.02)) {
    return {
      classification: 'Possible Fake Discount',
      badgeColor: 'amber',
      headline: 'Misleading MRP Discount Alert',
      explanation: `The displayed ${mrpDiscountPercent}% discount looks attractive, but the current price of ${formatInr(currentPrice)} is virtually identical to its typical market average (${formatInr(historicalAverage)}). The item is rarely sold at its printed MRP of ${formatInr(listedMrp)}.`,
      listedMrp,
      currentPrice,
      historicalAverage,
      historicalLowest,
      historicalHighest,
      realDiscountPercent,
      mrpDiscountPercent,
      savingsVsAverage,
      isAllTimeLow,
      unusualFluctuationDetected,
    };
  }

  // 3. PRICE ABOVE AVERAGE: Current price is higher than historical average by more than 5%
  if (currentPrice > historicalAverage * 1.05) {
    return {
      classification: 'Price Above Average',
      badgeColor: 'rose',
      headline: 'Price is Currently Elevated',
      explanation: `Current price of ${formatInr(currentPrice)} is ${Math.abs(realDiscountPercent)}% higher than the product's regular average of ${formatInr(historicalAverage)}. We recommend setting a price drop alert instead of purchasing right now.`,
      listedMrp,
      currentPrice,
      historicalAverage,
      historicalLowest,
      historicalHighest,
      realDiscountPercent,
      mrpDiscountPercent,
      savingsVsAverage,
      isAllTimeLow: false,
      unusualFluctuationDetected,
    };
  }

  // 4. NORMAL MARKET PRICE
  return {
    classification: 'Normal Market Price',
    badgeColor: 'indigo',
    headline: 'Standard Everyday Retail Price',
    explanation: `At ${formatInr(currentPrice)}, this product is selling at standard market rate, close to its historical average (${formatInr(historicalAverage)}). Lowest recorded was ${formatInr(historicalLowest)}.`,
    listedMrp,
    currentPrice,
    historicalAverage,
    historicalLowest,
    historicalHighest,
    realDiscountPercent,
    mrpDiscountPercent,
    savingsVsAverage,
    isAllTimeLow: false,
    unusualFluctuationDetected,
  };
}
