import React, { useState } from 'react';
import { Search } from 'lucide-react';

export default function SearchBox({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    onSearch({ location: query, minPrice: 0, maxPrice: Infinity });
  };

  return (
    <form
      onSubmit={handleSearchSubmit}
      className="w-full max-w-md sm:max-w-lg mx-auto flex items-center justify-between gap-2 bg-white/95 backdrop-blur-xl p-1.5 sm:p-2 pl-3.5 sm:pl-4 rounded-full border border-slate-200/90 shadow-xl"
    >
      <div className="flex items-center gap-2 sm:gap-2.5 flex-1 min-w-0">
        <Search className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 shrink-0" />
        <input
          type="search"
          value={query}
          onChange={event => setQuery(event.target.value)}
          placeholder="Search hostel or location..."
          aria-label="Search for a hostel or location"
          className="w-full bg-transparent py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400"
        />
      </div>
      <button
        type="submit"
        className="px-4 sm:px-6 py-2 sm:py-2.5 bg-[#222761] hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-full shadow-md shadow-indigo-200 transition-all active:scale-95 shrink-0"
      >
        Search
      </button>
    </form>
  );
}
