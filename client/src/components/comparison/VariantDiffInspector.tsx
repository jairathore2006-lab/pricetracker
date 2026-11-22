import React from 'react';
import { X, CheckCircle2, AlertTriangle, XCircle, Sliders, ArrowRight } from 'lucide-react';
import { RetailerListing, VariantSpecs } from '../../types';

interface VariantDiffInspectorProps {
  baseSpecs: VariantSpecs;
  candidate: RetailerListing;
  onClose: () => void;
}

export const VariantDiffInspector: React.FC<VariantDiffInspectorProps> = ({
  baseSpecs,
  candidate,
  onClose,
}) => {
  const match = candidate.variantMatch;
  if (!match) return null;

  const candidateSpecs = candidate.variantSpecs;

  const specRows = [
    { label: 'Brand', base: baseSpecs.brand, cand: candidateSpecs.brand },
    { label: 'Model', base: baseSpecs.model, cand: candidateSpecs.model },
    { label: 'Storage', base: baseSpecs.storage, cand: candidateSpecs.storage },
    { label: 'RAM', base: baseSpecs.ram, cand: candidateSpecs.ram },
    { label: 'Colour', base: baseSpecs.color, cand: candidateSpecs.color },
    { label: 'Processor', base: baseSpecs.processor, cand: candidateSpecs.processor },
    { label: 'Screen / Size', base: baseSpecs.screenSize, cand: candidateSpecs.screenSize },
    { label: 'Generation', base: baseSpecs.generation, cand: candidateSpecs.generation },
  ].filter((row) => row.base || row.cand);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/60">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
              match.confidenceScore >= 95
                ? 'bg-emerald-100 text-emerald-700'
                : match.confidenceScore >= 80
                ? 'bg-amber-100 text-amber-700'
                : 'bg-rose-100 text-rose-700'
            }`}>
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Variant Difference Inspector
              </h3>
              <p className="text-xs text-slate-500">
                Comparing target product vs {candidate.retailer} listing
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Match Score Summary Banner */}
          <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
            match.confidenceScore >= 95
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : match.confidenceScore >= 80
              ? 'bg-amber-50 border-amber-200 text-amber-900'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}>
            <div className="mt-0.5">
              {match.confidenceScore >= 95 ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              ) : match.confidenceScore >= 80 ? (
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-600" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm">{match.label}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/80 font-mono font-bold">
                  {match.confidenceScore}% Confidence
                </span>
              </div>
              <p className="text-xs mt-1 leading-relaxed opacity-90">
                {match.summaryNote}
              </p>
            </div>
          </div>

          {/* Side by side spec comparison table */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Hardware & Specification Alignment
            </h4>
            <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100">
              <div className="grid grid-cols-3 bg-slate-50/80 px-4 py-2.5 text-xs font-bold text-slate-500">
                <div>Specification</div>
                <div>Target Product</div>
                <div>{candidate.retailer} Listing</div>
              </div>

              {specRows.map((row, idx) => {
                const isMismatch =
                  row.base &&
                  row.cand &&
                  row.base.toLowerCase().replace(/[^a-z0-9]/g, '') !==
                    row.cand.toLowerCase().replace(/[^a-z0-9]/g, '');

                return (
                  <div
                    key={idx}
                    className={`grid grid-cols-3 px-4 py-3 text-xs items-center transition-colors ${
                      isMismatch ? 'bg-rose-50/40' : 'hover:bg-slate-50/40'
                    }`}
                  >
                    <div className="font-semibold text-slate-700 flex items-center gap-1.5">
                      {isMismatch ? (
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      )}
                      <span>{row.label}</span>
                    </div>

                    <div className="text-slate-900 font-medium">
                      {row.base || <span className="text-slate-300">—</span>}
                    </div>

                    <div className={isMismatch ? 'font-bold text-rose-700' : 'text-slate-900 font-medium'}>
                      {row.cand || <span className="text-slate-300">—</span>}
                      {isMismatch && (
                        <span className="block text-[10px] text-rose-500 font-normal">
                          Differs from target
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Guidance note */}
          <p className="text-[11px] text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
            PriceWise automatically inspects model numbers, storage increments, RAM tiers, and generation markers to ensure you are comparing true identical goods across sellers.
          </p>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
