import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Sliders } from 'lucide-react';
import { VariantMatchResult } from '../../types';

interface VariantMatchBadgeProps {
  match: VariantMatchResult;
  onInspect?: () => void;
}

export const VariantMatchBadge: React.FC<VariantMatchBadgeProps> = ({ match, onInspect }) => {
  const isExact = match.confidenceScore >= 95;
  const isLikely = match.confidenceScore >= 80 && match.confidenceScore < 95;

  return (
    <div className="inline-flex items-center gap-1.5">
      <button
        type="button"
        onClick={onInspect}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
          isExact
            ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
            : isLikely
            ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
            : 'bg-rose-50 text-rose-800 border-rose-300 hover:bg-rose-100'
        }`}
        title="Click to view specification differences"
      >
        {isExact ? (
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        ) : isLikely ? (
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
        ) : (
          <XCircle className="w-3.5 h-3.5 text-rose-600" />
        )}

        <span>{match.label}</span>
        <span className="text-[10px] opacity-75 font-mono">({match.confidenceScore}%)</span>

        {onInspect && (
          <Sliders className="w-3 h-3 opacity-60 ml-0.5 hover:opacity-100" />
        )}
      </button>
    </div>
  );
};
