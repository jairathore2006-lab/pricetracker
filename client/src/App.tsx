import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { AlertsPage } from './pages/AlertsPage';
import { SettingsPage } from './pages/SettingsPage';
import { UrlParserModal } from './components/search/UrlParserModal';
import { SetAlertModal } from './components/alerts/SetAlertModal';
import { PriceCheckStatus } from './components/monitor/PriceCheckStatus';
import { Product, PriceAlert, InAppNotification, ScheduledMonitoringStatus } from './types';
import { api } from './lib/api';

export function App() {
  const [currentView, setCurrentView] = useState<'home' | 'product' | 'alerts' | 'monitor' | 'settings'>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [notifications, setNotifications] = useState<InAppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [monitorStatus, setMonitorStatus] = useState<ScheduledMonitoringStatus | null>(null);

  const [isUrlModalOpen, setIsUrlModalOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertProduct, setAlertProduct] = useState<Product | null>(null);

  const [loading, setLoading] = useState(true);

  // Load initial data
  const loadInitialData = async () => {
    try {
      const [prodRes, alertsRes, notifRes, statusRes] = await Promise.all([
        api.getProducts(),
        api.getAlerts(),
        api.getNotifications(),
        api.getMonitorStatus(),
      ]);

      setProducts(prodRes.products || []);
      setAlerts(alertsRes || []);
      setNotifications(notifRes.notifications || []);
      setUnreadCount(notifRes.unreadCount || 0);
      setMonitorStatus(statusRes || null);
    } catch (err) {
      console.error('Failed to load initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();

    // Auto refresh notifications every 30 seconds
    const interval = setInterval(() => {
      api.getNotifications().then((n) => {
        setNotifications(n.notifications);
        setUnreadCount(n.unreadCount);
      }).catch(() => {});
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Handle navigation
  const handleNavigate = (view: 'home' | 'product' | 'alerts' | 'monitor' | 'settings', productId?: string) => {
    if (view === 'product' && productId) {
      setSelectedProductId(productId);
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Search
  const handleSearch = async (query: string, category?: string) => {
    try {
      const res = await api.getProducts({ q: query, category });
      setProducts(res.products || []);
      setCurrentView('home');
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  // Notification actions
  const handleMarkRead = async (id: string) => {
    await api.markNotificationRead(id);
    const updated = await api.getNotifications();
    setNotifications(updated.notifications);
    setUnreadCount(updated.unreadCount);
  };

  const handleMarkAllRead = async () => {
    await api.markAllNotificationsRead();
    const updated = await api.getNotifications();
    setNotifications(updated.notifications);
    setUnreadCount(updated.unreadCount);
  };

  const handleClearNotifications = async () => {
    await api.clearNotifications();
    setNotifications([]);
    setUnreadCount(0);
  };

  // Find currently viewed product
  const currentProduct = selectedProductId
    ? products.find((p) => p.id === selectedProductId)
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Global Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenUrlModal={() => setIsUrlModalOpen(true)}
        notifications={notifications}
        unreadCount={unreadCount}
        onMarkRead={handleMarkRead}
        onMarkAllRead={handleMarkAllRead}
        onClearAll={handleClearNotifications}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {loading ? (
          <div className="py-24 text-center">
            <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-600">
              Loading PriceWise deals & price feeds...
            </p>
          </div>
        ) : currentView === 'product' && currentProduct ? (
          <ProductDetailPage
            product={currentProduct}
            onBack={() => handleNavigate('home')}
            onRefreshProduct={loadInitialData}
          />
        ) : currentView === 'alerts' ? (
          <AlertsPage
            alerts={alerts}
            onRefreshAlerts={() => api.getAlerts().then(setAlerts)}
            onSelectProduct={(id) => handleNavigate('product', id)}
            onBack={() => handleNavigate('home')}
          />
        ) : currentView === 'monitor' ? (
          <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
            <h2 className="text-2xl font-black text-slate-950">
              Real-Time Price Monitoring Center
            </h2>
            <PriceCheckStatus
              status={monitorStatus}
              onStatusUpdated={loadInitialData}
            />
          </div>
        ) : currentView === 'settings' ? (
          <SettingsPage />
        ) : (
          <HomePage
            products={products}
            onSelectProduct={(id) => handleNavigate('product', id)}
            onOpenAlertModal={(prod) => {
              setAlertProduct(prod);
              setIsAlertModalOpen(true);
            }}
            onOpenUrlModal={() => setIsUrlModalOpen(true)}
            monitorStatus={monitorStatus}
            onRefreshMonitor={loadInitialData}
            onSearch={handleSearch}
          />
        )}
      </main>

      {/* Global Footer */}
      <Footer />

      {/* URL Parser Modal */}
      <UrlParserModal
        isOpen={isUrlModalOpen}
        onClose={() => setIsUrlModalOpen(false)}
        onProductFound={(prod) => {
          setSelectedProductId(prod.id);
          setCurrentView('product');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Quick Set Alert Modal */}
      {alertProduct && (
        <SetAlertModal
          product={alertProduct}
          isOpen={isAlertModalOpen}
          onClose={() => {
            setIsAlertModalOpen(false);
            setAlertProduct(null);
          }}
          onAlertCreated={loadInitialData}
        />
      )}
    </div>
  );
}

export default App;
