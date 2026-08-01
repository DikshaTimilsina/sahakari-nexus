"use client";

import { Search, X } from "lucide-react";
import { useState } from "react";

export function SearchBar() {
  // Stores the text the user types into the input.
  const [query, setQuery] = useState("");

  return (
    <div className="relative max-w-md">
      <label htmlFor="dashboard-search" className="sr-only">
        Search cooperatives
      </label>

      <Search
        aria-hidden="true"
        size={18}
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
      />

      <input
        id="dashboard-search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search cooperatives, reports, or risks..."
        className="w-full rounded-xl border border-slate-700 bg-slate-900 py-3 pl-11 pr-11 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-400/20"
      />

      {query && (
        <button
          type="button"
          onClick={() => setQuery("")}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-md text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}