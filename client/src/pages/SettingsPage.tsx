import React, { useState, useEffect } from 'react';
import {
  Database,
  CheckCircle2,
  AlertCircle,
  Clock,
  Bell,
  Puzzle,
  Save,
  RotateCcw,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { getStoredSupabaseConfig, saveSupabaseConfig } from '../lib/supabase';
import { api } from '../lib/api';

export const SettingsPage: React.FC = () => {
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [intervalMinutes, setIntervalMinutes] = useState(30);

  useEffect(() => {
    const config = getStoredSupabaseConfig();
    setSupabaseUrl(config.url);
    setSupabaseKey(config.anonKey);

    api.getMonitorStatus().then((s) => {
      if (s) setIntervalMinutes(s.checkIntervalMinutes);
    }).catch(() => {});
  }, []);

  const handleSaveSupabase = (e: React.FormEvent) => {
    e.preventDefault();
    saveSupabaseConfig(supabaseUrl.trim(), supabaseKey.trim());
    setSaveStatus('Supabase configuration saved locally!');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleSaveInterval = async (minutes: number) => {
    setIntervalMinutes(minutes);
    try {
      await api.setMonitorInterval(minutes);
      setSaveStatus(`Monitoring frequency updated to every ${minutes} minutes.`);
      setTimeout(() => setSaveStatus(null), 3000);
    } catch {}
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8 pb-20">
      <div>
        <h2 className="text-2xl font-black text-slate-950">Application Settings</h2>
        <p className="text-xs text-slate-500 mt-1">
          Manage Supabase connection, price check intervals, and Chrome extension integration.
        </p>
      </div>

      {saveStatus && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveStatus}</span>
        </div>
      )}

      {/* Supabase Database & Auth Configuration */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-600">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              Supabase PostgreSQL & Auth Integration
            </h3>
            <p className="text-xs text-slate-500">
              Connect your own Supabase project for remote persistence and authentication.
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-emerald-950 text-xs leading-relaxed">
          <span className="font-bold">Zero-Setup Mode Active: </span>
          PriceWise runs seamlessly out-of-the-box using high-performance local memory and storage cache. Adding Supabase credentials is completely optional.
        </div>

        <form onSubmit={handleSaveSupabase} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Supabase Project URL
            </label>
            <input
              type="text"
              value={supabaseUrl}
              onChange={(e) => setSupabaseUrl(e.target.value)}
              placeholder="https://xyzcompany.supabase.co"
              className="w-full px-4 py-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Supabase Anon Key
            </label>
            <input
              type="password"
              value={supabaseKey}
              onChange={(e) => setSupabaseKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full px-4 py-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 text-slate-900 font-mono"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Supabase Credentials</span>
            </button>
          </div>
        </form>
      </div>

      {/* Monitoring Scheduler Settings */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              Price Check Engine Frequency
            </h3>
            <p className="text-xs text-slate-500">
              Set how often the backend verifies live prices across all retailer APIs and scrapers.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {[15, 30, 60, 180, 360].map((mins) => (
            <button
              key={mins}
              onClick={() => handleSaveInterval(mins)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                intervalMinutes === mins
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {mins < 60 ? `Every ${mins} mins` : `Every ${mins / 60} hour(s)`}
            </button>
          ))}
        </div>
      </div>

      {/* Chrome Extension Module */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
            <Puzzle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              PriceWise Chrome Extension (Manifest V3)
            </h3>
            <p className="text-xs text-slate-500">
              Get instant price comparison directly while browsing Amazon.in and Flipkart.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs text-slate-600">
          <p className="font-semibold text-slate-900">How to load the extension in Google Chrome:</p>
          <ol className="list-decimal list-inside space-y-1 pl-1">
            <li>Open Google Chrome and navigate to <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-800">chrome://extensions</code></li>
            <li>Enable <strong>Developer mode</strong> using the toggle in the top right corner.</li>
            <li>Click <strong>Load unpacked</strong>.</li>
            <li>Select the <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-800">mini project/extension</code> directory.</li>
          </ol>
        </div>
      </div>
    </div>
  );
};
