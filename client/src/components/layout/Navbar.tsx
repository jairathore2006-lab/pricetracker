import React from 'react';
import {
  TrendingDown,
  Search,
  Bell,
  Clock,
  Settings,
  Link2,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { InAppNotification } from '../../types';
import { NotificationCenter } from './NotificationCenter';

interface NavbarProps {
  currentView: 'home' | 'product' | 'alerts' | 'monitor' | 'settings';
  onNavigate: (view: 'home' | 'product' | 'alerts' | 'monitor' | 'settings', productId?: string) => void;
  onOpenUrlModal: () => void;
  notifications: InAppNotification[];
  unreadCount: number;
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onClearAll: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenUrlModal,
  notifications,
  unreadCount,
  onMarkRead,
  onMarkAllRead,
  onClearAll,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand Identity */}
          <div
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 to-indigo-500 flex items-center justify-center text-white shadow-glow group-hover:scale-105 transition-transform duration-200">
              <TrendingDown className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-950 via-slate-900 to-brand-700 bg-clip-text text-transparent">
                  PriceWise
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Live
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 hidden sm:block">
                Shop Smart. Save More.
              </p>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => onNavigate('home')}
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                currentView === 'home'
                  ? 'bg-slate-100 text-brand-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Browse Deals
            </button>

            <button
              onClick={() => onNavigate('alerts')}
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                currentView === 'alerts'
                  ? 'bg-slate-100 text-brand-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Price Alerts
            </button>

            <button
              onClick={() => onNavigate('monitor')}
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                currentView === 'monitor'
                  ? 'bg-slate-100 text-brand-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Price Monitor
            </button>

            <button
              onClick={() => onNavigate('settings')}
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                currentView === 'settings'
                  ? 'bg-slate-100 text-brand-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Settings
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Quick URL paste button */}
            <button
              onClick={onOpenUrlModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-100 text-slate-700 hover:bg-brand-50 hover:text-brand-700 border border-slate-200 transition-all shadow-xs"
              title="Paste product URL to compare"
            >
              <Link2 className="w-3.5 h-3.5 text-brand-600" />
              <span className="hidden sm:inline">Paste URL</span>
            </button>

            {/* Notification Center */}
            <NotificationCenter
              notifications={notifications}
              unreadCount={unreadCount}
              onMarkRead={onMarkRead}
              onMarkAllRead={onMarkAllRead}
              onClearAll={onClearAll}
              onSelectProduct={(productId) => onNavigate('product', productId)}
            />

            {/* Mobile Menu indicator */}
            <button
              onClick={() => onNavigate('settings')}
              className="p-2.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl md:hidden"
              aria-label="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
