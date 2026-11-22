import { Product, PriceAlert, InAppNotification, ScheduledMonitoringStatus } from '../types';

const API_BASE = '/api';

export const api = {
  // Products
  async getProducts(params?: { q?: string; category?: string; brand?: string }): Promise<{
    success: boolean;
    products: Product[];
    count: number;
  }> {
    const searchParams = new URLSearchParams();
    if (params?.q) searchParams.set('q', params.q);
    if (params?.category) searchParams.set('category', params.category);
    if (params?.brand) searchParams.set('brand', params.brand);

    const res = await fetch(`${API_BASE}/products?${searchParams.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  },

  async getProductById(id: string): Promise<Product> {
    const res = await fetch(`${API_BASE}/products/${id}`);
    if (!res.ok) throw new Error('Product not found');
    const data = await res.json();
    return data.product;
  },

  async getSuggestions(query: string): Promise<string[]> {
    if (!query || query.length < 2) return [];
    const res = await fetch(`${API_BASE}/products/suggestions?q=${encodeURIComponent(query)}`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.suggestions || [];
  },

  async getRecentSearches(): Promise<string[]> {
    try {
      const res = await fetch(`${API_BASE}/products/recent-searches`);
      if (!res.ok) return [];
      const data = await res.json();
      return data.recentSearches || [];
    } catch {
      return [];
    }
  },

  async addRecentSearch(query: string): Promise<void> {
    try {
      await fetch(`${API_BASE}/products/recent-searches`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
    } catch {}
  },

  async clearRecentSearches(): Promise<void> {
    try {
      await fetch(`${API_BASE}/products/recent-searches`, { method: 'DELETE' });
    } catch {}
  },

  async extractFromUrl(url: string): Promise<{
    success: boolean;
    retailer: string;
    product?: Product;
    extracted?: any;
    error?: string;
  }> {
    const res = await fetch(`${API_BASE}/products/extract-url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Unable to extract product from this URL');
    }
    return data;
  },

  // Alerts
  async getAlerts(): Promise<PriceAlert[]> {
    const res = await fetch(`${API_BASE}/alerts`);
    if (!res.ok) throw new Error('Failed to fetch alerts');
    const data = await res.json();
    return data.alerts || [];
  },

  async createAlert(productId: string, targetPrice: number, userEmail?: string): Promise<PriceAlert> {
    const res = await fetch(`${API_BASE}/alerts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, targetPrice, userEmail }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create alert');
    return data.alert;
  },

  async updateAlert(id: string, updates: Partial<PriceAlert>): Promise<PriceAlert> {
    const res = await fetch(`${API_BASE}/alerts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update alert');
    return data.alert;
  },

  async deleteAlert(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/alerts/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete alert');
  },

  // Notifications
  async getNotifications(): Promise<{ notifications: InAppNotification[]; unreadCount: number }> {
    const res = await fetch(`${API_BASE}/notifications`);
    if (!res.ok) return { notifications: [], unreadCount: 0 };
    return res.json();
  },

  async markNotificationRead(id: string): Promise<void> {
    await fetch(`${API_BASE}/notifications/${id}/read`, { method: 'PUT' });
  },

  async markAllNotificationsRead(): Promise<void> {
    await fetch(`${API_BASE}/notifications/read-all`, { method: 'PUT' });
  },

  async clearNotifications(): Promise<void> {
    await fetch(`${API_BASE}/notifications`, { method: 'DELETE' });
  },

  // Monitor
  async getMonitorStatus(): Promise<ScheduledMonitoringStatus> {
    const res = await fetch(`${API_BASE}/monitor/status`);
    if (!res.ok) throw new Error('Failed to get monitor status');
    const data = await res.json();
    return data.status;
  },

  async triggerPriceCheck(): Promise<{ message: string; result: any; status: ScheduledMonitoringStatus }> {
    const res = await fetch(`${API_BASE}/monitor/trigger`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to trigger check');
    return res.json();
  },

  async setMonitorInterval(intervalMinutes: number): Promise<ScheduledMonitoringStatus> {
    const res = await fetch(`${API_BASE}/monitor/interval`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ intervalMinutes }),
    });
    const data = await res.json();
    return data.status;
  },
};
