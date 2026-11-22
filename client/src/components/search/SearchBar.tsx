import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  X,
  Clock,
  ExternalLink,
  Sparkles,
  Link2,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { api } from '../../lib/api';

interface SearchBarProps {
  onSearch: (query: string, category?: string, brand?: string) => void;
  onUrlDetected?: (url: string) => void;
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
  initialQuery?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onUrlDetected,
  selectedCategory = 'all',
  onSelectCategory,
  initialQuery = '',
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'Smartphones', label: 'Smartphones' },
    { id: 'Laptops', label: 'Laptops' },
    { id: 'Audio', label: 'Audio & Sound' },
    { id: 'Home & Kitchen', label: 'Daily Appliances' },
    { id: 'Smart Home', label: 'Smart Home & Air' },
    { id: 'Wearables', label: 'Smartwatches' },
    { id: 'Gaming', label: 'Gaming Consoles' },
  ];

  // Load recent searches
  useEffect(() => {
    api.getRecentSearches().then(setRecentSearches).catch(() => {});
  }, []);

  // Sync initial query
  useEffect(() => {
    if (initialQuery !== undefined) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  // Autocomplete suggestions debounce
  useEffect(() => {
    if (query.trim().length >= 2 && !query.includes('http')) {
      const timer = setTimeout(() => {
        api.getSuggestions(query).then(setSuggestions).catch(() => {});
      }, 200);
      return () => clearTimeout(timer);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExecuteSearch = (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;

    // Detect if user pasted a product URL directly into search
    if (
      trimmed.startsWith('http') ||
      trimmed.includes('amazon.in') ||
      trimmed.includes('flipkart.com') ||
      trimmed.includes('croma.com') ||
      trimmed.includes('reliancedigital.in') ||
      trimmed.includes('vijaysales.com') ||
      trimmed.includes('tatacliq.com')
    ) {
      if (onUrlDetected) {
        onUrlDetected(trimmed);
        setShowDropdown(false);
        return;
      }
    }

    setShowDropdown(false);
    onSearch(trimmed, selectedCategory);
    api.addRecentSearch(trimmed).then(() => {
      api.getRecentSearches().then(setRecentSearches).catch(() => {});
    });
  };

  const handleClearRecent = (e: React.MouseEvent) => {
    e.stopPropagation();
    api.clearRecentSearches().then(() => setRecentSearches([]));
  };

  return (
    <div ref={containerRef} className="w-full relative">
      {/* Category Pills */}
      {onSelectCategory && (
        <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                onSelectCategory(cat.id);
                if (query) onSearch(query, cat.id);
              }}
              className={`text-xs px-3.5 py-1.5 rounded-full font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 text-white shadow-xs font-semibold'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}

      {/* Main Search Bar Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleExecuteSearch(query);
        }}
        className="relative flex items-center shadow-lg shadow-slate-200/60 rounded-2xl bg-white border border-slate-200 focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-100 transition-all"
      >
        <div className="pl-4 pr-2 text-slate-400">
          <Search className="w-5 h-5" />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          placeholder="Search product (e.g. iPhone 16 128GB, Sony WH-1000XM5) or paste retailer URL..."
          className="w-full py-4 text-sm sm:text-base text-slate-900 placeholder-slate-400 bg-transparent focus:outline-none"
        />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setSuggestions([]);
            }}
            className="p-1 mr-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <button
          type="submit"
          className="m-1.5 px-5 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-md hover:shadow-glow transition-all flex items-center gap-1.5 shrink-0"
        >
          <span>Track Deals</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Autocomplete & Recent Search Dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 glass-dropdown rounded-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Autocomplete suggestions */}
          {suggestions.length > 0 && (
            <div className="mb-3">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 py-1">
                Suggested Products
              </p>
              <div className="space-y-0.5">
                {suggestions.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setQuery(item);
                      handleExecuteSearch(item);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-slate-800 hover:bg-brand-50 hover:text-brand-700 rounded-xl flex items-center justify-between group transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-brand-500 opacity-60 group-hover:opacity-100" />
                      {item}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-brand-500" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Recent search history */}
          {recentSearches.length > 0 && (
            <div>
              <div className="flex items-center justify-between px-3 py-1">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Recent Searches
                </p>
                <button
                  type="button"
                  onClick={handleClearRecent}
                  className="text-[11px] text-slate-400 hover:text-rose-600 transition-colors"
                >
                  Clear all
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 p-1 mt-1">
                {recentSearches.map((term, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setQuery(term);
                      handleExecuteSearch(term);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs text-slate-700 transition-colors font-medium"
                  >
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{term}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Direct URL Paste Helper */}
          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between px-3 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <Link2 className="w-3.5 h-3.5 text-brand-500" />
              Tip: Paste any Amazon, Flipkart, or Croma link directly to compare!
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
