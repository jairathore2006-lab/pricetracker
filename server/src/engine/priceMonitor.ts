import {
  Product,
  PriceAlert,
  InAppNotification,
  ScheduledMonitoringStatus,
} from '../types/index.js';
import { dataStore } from '../db/storage.js';

class PriceMonitoringEngine {
  private intervalMinutes: number = 30;
  private timer: NodeJS.Timeout | null = null;
  private isRunning: boolean = false;
  private lastRunAt: string = new Date().toISOString();
  private totalAlertsTriggered: number = 0;

  constructor() {
    this.startScheduler();
  }

  public getStatus(): ScheduledMonitoringStatus {
    const nextRun = new Date(new Date(this.lastRunAt).getTime() + this.intervalMinutes * 60 * 1000);
    return {
      isRunning: this.isRunning,
      checkIntervalMinutes: this.intervalMinutes,
      lastRunAt: this.lastRunAt,
      nextRunAt: nextRun.toISOString(),
      productsMonitoredCount: dataStore.getAllProducts().length,
      totalAlertsTriggered: this.totalAlertsTriggered,
    };
  }

  public setCheckInterval(minutes: number) {
    this.intervalMinutes = Math.max(1, minutes);
    this.startScheduler();
  }

  public startScheduler() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.isRunning = true;
    this.timer = setInterval(() => {
      this.runPriceCheck('scheduled');
    }, this.intervalMinutes * 60 * 1000);
  }

  public stopScheduler() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.isRunning = false;
  }

  /**
   * Runs price verification across all active products, checks against alerts,
   * updates lastChecked timestamp, and suppresses duplicate notifications
   */
  public async runPriceCheck(reason: 'scheduled' | 'manual'): Promise<{
    checkedCount: number;
    alertsTriggeredCount: number;
    notificationsCreated: InAppNotification[];
  }> {
    const products = dataStore.getAllProducts();
    const alerts = dataStore.getActiveAlerts();
    const nowIso = new Date().toISOString();
    this.lastRunAt = nowIso;

    let alertsTriggeredCount = 0;
    const notificationsCreated: InAppNotification[] = [];

    for (const product of products) {
      // Find lowest current price among listings
      const lowestListing = product.listings.reduce((min, cur) =>
        cur.finalPrice < min.finalPrice ? cur : min, product.listings[0]
      );

      // Check alerts for this product
      const productAlerts = alerts.filter((a) => a.productId === product.id && a.active);

      for (const alert of productAlerts) {
        // Price dropped to or below user's target price
        if (lowestListing.finalPrice <= alert.targetPrice) {
          // Check if already notified recently for this price level to prevent duplicates
          const previousTrigger = alert.lastTriggeredAt;
          const wasTriggeredRecently = previousTrigger && (Date.now() - new Date(previousTrigger).getTime() < 12 * 60 * 60 * 1000);

          if (!wasTriggeredRecently) {
            const amountSaved = alert.initialPrice - lowestListing.finalPrice;

            const notif: InAppNotification = {
              id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
              title: `Price Drop Alert: ${product.title}`,
              message: `Great news! ${product.title} has reached your target of ₹${alert.targetPrice.toLocaleString('en-IN')}. Currently available at ₹${lowestListing.finalPrice.toLocaleString('en-IN')} on ${lowestListing.retailer}!`,
              type: 'target_reached',
              productId: product.id,
              productTitle: product.title,
              productImage: product.imageUrl,
              previousPrice: alert.initialPrice,
              newPrice: lowestListing.finalPrice,
              amountSaved: Math.max(0, amountSaved),
              retailerName: lowestListing.retailer,
              retailerLink: lowestListing.productUrl,
              read: false,
              createdAt: nowIso,
            };

            dataStore.addNotification(notif);
            notificationsCreated.push(notif);
            dataStore.recordAlertTrigger(alert.id, lowestListing.finalPrice);
            alertsTriggeredCount++;
            this.totalAlertsTriggered++;
          }
        }
      }

      // Update product's last checked timestamp
      dataStore.updateProductLastChecked(product.id, nowIso);
    }

    return {
      checkedCount: products.length,
      alertsTriggeredCount,
      notificationsCreated,
    };
  }
}

export const priceMonitor = new PriceMonitoringEngine();
