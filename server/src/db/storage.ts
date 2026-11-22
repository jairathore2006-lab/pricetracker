import { Product, PriceAlert, InAppNotification, RetailerListing } from '../types/index.js';
import { initialProducts } from './seedData.js';
import { supabase, isSupabaseConfigured } from './supabase.js';

class DataStore {
  private products: Map<string, Product> = new Map();
  private alerts: Map<string, PriceAlert> = new Map();
  private notifications: Map<string, InAppNotification> = new Map();
  private recentSearches: string[] = [
    'iPhone 16 128GB Black',
    'Samsung Galaxy S24 Ultra',
    'Sony WH-1000XM5',
    'HP Pavilion 15 Ryzen 5',
    'MacBook Air M3',
  ];

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Load default seed products
    for (const prod of initialProducts) {
      this.products.set(prod.id, prod);
    }

    // Seed initial demo alerts
    const initialAlerts: PriceAlert[] = [
      {
        id: 'alert-1',
        productId: 'prod-iphone-16-128gb',
        productTitle: 'Apple iPhone 16 (128 GB) - Black',
        productImageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80',
        brand: 'Apple',
        targetPrice: 72000,
        currentPrice: 72999,
        initialPrice: 74499,
        active: true,
        createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
        triggerCount: 0,
      },
      {
        id: 'alert-2',
        productId: 'prod-sony-wh1000xm5',
        productTitle: 'Sony WH-1000XM5 Wireless Headphones (Silver)',
        productImageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80',
        brand: 'Sony',
        targetPrice: 27000,
        currentPrice: 26990,
        initialPrice: 28990,
        active: true,
        createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
        lastTriggeredAt: new Date(Date.now() - 2 * 86400000).toISOString(),
        triggerCount: 1,
      },
    ];

    for (const alert of initialAlerts) {
      this.alerts.set(alert.id, alert);
    }

    // Seed initial notifications
    const initialNotifications: InAppNotification[] = [
      {
        id: 'notif-seed-1',
        title: 'Price Drop Triggered: Sony WH-1000XM5',
        message: 'Sony WH-1000XM5 just hit ₹26,990 on Flipkart (target was ₹27,000)! You save ₹2,000 from initial tracked price.',
        type: 'target_reached',
        productId: 'prod-sony-wh1000xm5',
        productTitle: 'Sony WH-1000XM5 Wireless Headphones (Silver)',
        productImage: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80',
        previousPrice: 28990,
        newPrice: 26990,
        amountSaved: 2000,
        retailerName: 'Flipkart',
        retailerLink: 'https://www.flipkart.com/sony-wh-1000xm5-bluetooth-headset/p/itm71c89',
        read: false,
        createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      },
      {
        id: 'notif-seed-2',
        title: 'All-Time Low Record: iPhone 16',
        message: 'iPhone 16 128GB dropped to ₹72,999 on Croma — the lowest price ever recorded on PriceWise!',
        type: 'deal_alert',
        productId: 'prod-iphone-16-128gb',
        productTitle: 'Apple iPhone 16 (128 GB) - Black',
        productImage: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80',
        previousPrice: 76900,
        newPrice: 72999,
        amountSaved: 3901,
        retailerName: 'Croma',
        retailerLink: 'https://www.croma.com/apple-iphone-16-128gb-black/p/308122',
        read: false,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ];

    for (const notif of initialNotifications) {
      this.notifications.set(notif.id, notif);
    }
  }

  // Product methods
  public getAllProducts(): Product[] {
    return Array.from(this.products.values());
  }

  public getProductById(id: string): Product | undefined {
    return this.products.get(id);
  }

  public saveProduct(product: Product): void {
    this.products.set(product.id, product);
  }

  public updateProductLastChecked(productId: string, timestamp: string): void {
    const prod = this.products.get(productId);
    if (prod) {
      prod.lastChecked = timestamp;
      this.products.set(productId, prod);
    }
  }

  public searchProducts(query: string, category?: string, brand?: string): Product[] {
    const q = query.toLowerCase().trim();
    return this.getAllProducts().filter((p) => {
      const matchQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.model.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.baseSpecs.storage && p.baseSpecs.storage.toLowerCase().includes(q)) ||
        (p.baseSpecs.processor && p.baseSpecs.processor.toLowerCase().includes(q)) ||
        p.listings.some((l) => l.productTitle.toLowerCase().includes(q));

      const matchCategory =
        !category || category === 'all' || p.category.toLowerCase() === category.toLowerCase();
      const matchBrand =
        !brand || brand === 'all' || p.brand.toLowerCase() === brand.toLowerCase();

      return matchQuery && matchCategory && matchBrand;
    });
  }

  // Alerts
  public getAllAlerts(): PriceAlert[] {
    return Array.from(this.alerts.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public getActiveAlerts(): PriceAlert[] {
    return this.getAllAlerts().filter((a) => a.active);
  }

  public getAlertById(id: string): PriceAlert | undefined {
    return this.alerts.get(id);
  }

  public saveAlert(alert: PriceAlert): PriceAlert {
    this.alerts.set(alert.id, alert);
    return alert;
  }

  public updateAlert(id: string, updates: Partial<PriceAlert>): PriceAlert | null {
    const alert = this.alerts.get(id);
    if (!alert) return null;
    const updated = { ...alert, ...updates };
    this.alerts.set(id, updated);
    return updated;
  }

  public deleteAlert(id: string): boolean {
    return this.alerts.delete(id);
  }

  public recordAlertTrigger(alertId: string, currentPrice: number): void {
    const alert = this.alerts.get(alertId);
    if (alert) {
      alert.lastTriggeredAt = new Date().toISOString();
      alert.triggerCount += 1;
      alert.currentPrice = currentPrice;
      this.alerts.set(alertId, alert);
    }
  }

  // Notifications
  public getAllNotifications(): InAppNotification[] {
    return Array.from(this.notifications.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public addNotification(notification: InAppNotification): InAppNotification {
    this.notifications.set(notification.id, notification);
    return notification;
  }

  public markNotificationAsRead(id: string): boolean {
    const notif = this.notifications.get(id);
    if (notif) {
      notif.read = true;
      this.notifications.set(id, notif);
      return true;
    }
    return false;
  }

  public markAllNotificationsAsRead(): void {
    for (const notif of this.notifications.values()) {
      notif.read = true;
    }
  }

  public clearNotifications(): void {
    this.notifications.clear();
  }

  // Recent Searches
  public getRecentSearches(): string[] {
    return [...this.recentSearches];
  }

  public addRecentSearch(query: string): void {
    const clean = query.trim();
    if (!clean) return;
    this.recentSearches = [clean, ...this.recentSearches.filter((s) => s.toLowerCase() !== clean.toLowerCase())].slice(0, 8);
  }

  public clearRecentSearches(): void {
    this.recentSearches = [];
  }
}

export const dataStore = new DataStore();
