"use client";

import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";

const cooperatives: string[] = [
  "Himal Savings",
  "Everest Cooperative",
  "Janata Multipurpose",
  "Lumbini Agriculture",
  "ABC Saving",
  "Shree Cooperative",
  "Pokhara Savings",
];

export function SearchBar() {
  const [query, setQuery] = useState<string>("");
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  const normalizedQuery = query.trim().toLowerCase();

  const suggestions = useMemo(() => {
    if (!normalizedQuery) return [];
    return cooperatives.filter((name) =>
      name.toLowerCase().includes(normalizedQuery)
    );
  }, [normalizedQuery]);

  const handleSelect = (name: string) => {
    setQuery(name);              // keep selected name in input
    setShowSuggestions(false);   // hide dropdown immediately
  };

  const clearSearch = () => {
    setQuery("");
    setShowSuggestions(false);
  };

  const showNotFound =
    normalizedQuery.length > 0 && suggestions.length === 0;

  return (
    <div className="relative w-full max-w-md z-50">
      <label htmlFor="dashboard-search" className="sr-only">
        Search cooperatives
      </label>

      {/* Search Icon */}
      <Search
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
      />

      {/* Input */}
      <input
        id="dashboard-search"
        type="text"
        autoComplete="off"
        spellCheck={false}
        value={query}
        placeholder="Search cooperatives..."
        onChange={(e) => {
          setQuery(e.target.value);
          setShowSuggestions(true);
        }}
        onFocus={() => setShowSuggestions(true)}
        className="
          w-full h-12 rounded-xl border border-slate-700 bg-slate-900
          pl-11 pr-11 text-sm text-white placeholder:text-slate-500
          outline-none transition focus:border-cyan-400
          focus:ring-2 focus:ring-cyan-400/20
        "
      />

      {/* Clear Button */}
      {query && (
        <button
          type="button"
          onClick={clearSearch}
          aria-label="Clear Search"
          className="
            absolute right-3 top-1/2 -translate-y-1/2 flex h-7 w-7
            items-center justify-center rounded-md text-cyan-400
            transition hover:bg-slate-800 hover:text-cyan-300
          "
        >
          <X size={16} strokeWidth={2.5} />
        </button>
      )}

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <ul
          className="
            absolute left-0 right-0 top-full mt-1 z-50 overflow-hidden
            rounded-xl border border-slate-700 bg-slate-900 shadow-xl
          "
        >
          {suggestions.map((item) => (
            <li key={item}>
              <button
                type="button"
                onMouseDown={() => handleSelect(item)} // fires before blur
                className="
                  w-full px-4 py-3 text-left text-sm text-white
                  transition hover:bg-slate-800
                "
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Not Found */}
      {showNotFound && (
        <p className="absolute -bottom-6 left-0 text-sm text-amber-400">
          No cooperative matched your search.
        </p>
      )}
    </div>
  );
}
