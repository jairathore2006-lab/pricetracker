import React from 'react';
import { ArrowLeft, Bell } from 'lucide-react';
import { PriceAlert } from '../types';
import { AlertManager } from '../components/alerts/AlertManager';

interface AlertsPageProps {
  alerts: PriceAlert[];
  onRefreshAlerts: () => void;
  onSelectProduct: (productId: string) => void;
  onBack: () => void;
}

export const AlertsPage: React.FC<AlertsPageProps> = ({
  alerts,
  onRefreshAlerts,
  onSelectProduct,
  onBack,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-brand-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Browse Deals</span>
      </button>

      <AlertManager
        alerts={alerts}
        onRefresh={onRefreshAlerts}
        onSelectProduct={onSelectProduct}
      />
    </div>
  );
};
