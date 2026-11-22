import React, { useState } from 'react';
import {
  Bell,
  CheckCheck,
  Trash2,
  ExternalLink,
  Tag,
  AlertCircle,
  ArrowDownRight,
  Sparkles,
} from 'lucide-react';
import { InAppNotification } from '../../types';
import { formatInr, formatTimeAgo } from '../../lib/utils';

interface NotificationCenterProps {
  notifications: InAppNotification[];
  unreadCount: number;
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onClearAll: () => void;
  onSelectProduct?: (productId: string) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  unreadCount,
  onMarkRead,
  onMarkAllRead,
  onClearAll,
  onSelectProduct,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* Bell Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 text-slate-600 hover:text-brand-600 hover:bg-slate-100 rounded-xl transition-all"
        title="Price Drop Notifications"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-96 max-w-[calc(100vw-2rem)] glass-dropdown rounded-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-brand-600" />
                <h3 className="font-semibold text-slate-900 text-sm">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="bg-brand-50 text-brand-700 text-xs px-2 py-0.5 rounded-full font-medium">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={onMarkAllRead}
                    className="text-xs text-slate-500 hover:text-brand-600 flex items-center gap-1 font-medium transition-colors"
                    title="Mark all as read"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    Read all
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    onClick={onClearAll}
                    className="text-xs text-slate-400 hover:text-rose-600 p-1 rounded transition-colors"
                    title="Clear all notifications"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Notifications List */}
            <div className="mt-2 max-h-[380px] overflow-y-auto space-y-2 pr-1">
              {notifications.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-sm">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  No notifications yet.<br />We will alert you when tracked items drop!
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => {
                      if (!notif.read) onMarkRead(notif.id);
                      if (onSelectProduct && notif.productId) {
                        onSelectProduct(notif.productId);
                        setIsOpen(false);
                      }
                    }}
                    className={`p-3 rounded-xl border transition-all cursor-pointer relative group ${
                      notif.read
                        ? 'bg-white border-slate-100 hover:border-slate-200'
                        : 'bg-brand-50/50 border-brand-200/80 shadow-xs'
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className="shrink-0 mt-0.5">
                        {notif.type === 'target_reached' ? (
                          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                            <ArrowDownRight className="w-4 h-4" />
                          </div>
                        ) : notif.type === 'deal_alert' ? (
                          <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                            <Sparkles className="w-4 h-4" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                            <AlertCircle className="w-4 h-4" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <p className={`text-xs font-semibold truncate ${notif.read ? 'text-slate-800' : 'text-brand-900'}`}>
                            {notif.title}
                          </p>
                          <span className="text-[10px] text-slate-400 shrink-0">
                            {formatTimeAgo(notif.createdAt)}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {notif.message}
                        </p>

                        {/* Price drop tag */}
                        {notif.amountSaved > 0 && (
                          <div className="mt-2 flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                              Saved {formatInr(notif.amountSaved)}
                            </span>
                            <span className="text-[11px] text-slate-500 font-medium">
                              New Price: {formatInr(notif.newPrice)}
                            </span>
                          </div>
                        )}

                        {/* Direct retailer link */}
                        {notif.retailerLink && (
                          <div className="mt-2 flex items-center justify-between pt-1 border-t border-slate-100/60">
                            <span className="text-[10px] text-slate-400 font-medium">
                              On {notif.retailerName}
                            </span>
                            <a
                              href={notif.retailerLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-[11px] text-brand-600 hover:text-brand-700 font-semibold inline-flex items-center gap-1"
                            >
                              View Deal <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    {!notif.read && (
                      <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-brand-600 ring-2 ring-brand-100" />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
