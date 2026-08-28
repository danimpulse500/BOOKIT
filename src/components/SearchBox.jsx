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
      className="w-full max-w-lg mx-auto flex items-center gap-2 bg-white/95 backdrop-blur-xl p-2 rounded-full border border-slate-200/90"
    >
      <Search className="w-5 h-5 ml-3 text-indigo-600 flex-shrink-0" />
      <input
        type="search"
        value={query}
        onChange={event => setQuery(event.target.value)}
        placeholder="Search for a hostel or location"
        aria-label="Search for a hostel or location"
        className="flex-1 min-w-0 bg-transparent px-2 py-3 text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400"
      />
      <button
        type="submit"
        className="px-5 py-3 bg-[#222761] hover:bg-indigo-700 text-white font-semibold rounded-full shadow-lg shadow-indigo-200 transition-all active:scale-95"
      >
        Search
      </button>
    </form>
  );
}
