import React, { useState } from 'react';
import { LOCATIONS } from '../services/mockData';
import { Search, MapPin, DollarSign, SlidersHorizontal, X } from 'lucide-react';

export default function SearchBox({ onSearch }) {
  const [location, setLocation] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [mobileModalOpen, setMobileModalOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    onSearch({
      location,
      minPrice: minPrice ? Number(minPrice) : 0,
      maxPrice: maxPrice ? Number(maxPrice) : Infinity
    });
    setMobileModalOpen(false);
  };

  const handleReset = () => {
    setLocation('');
    setMinPrice('');
    setMaxPrice('');
    onSearch({ location: '', minPrice: 0, maxPrice: Infinity });
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* DESKTOP SEARCH BAR */}
      <form 
        onSubmit={handleSearchSubmit} 
        className="hidden md:flex items-center bg-white/95 backdrop-blur-xl p-2.5 rounded-full shadow-xl shadow-indigo-900/10 border border-slate-200/90 hover:border-indigo-300 transition-all duration-300"
      >
        {/* Location Selector */}
        <div className="flex-1 flex items-center gap-2.5 px-4 py-2 border-r border-slate-200">
          <MapPin className="w-5 h-5 text-indigo-600 flex-shrink-0" />
          <div className="flex-1">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Location</label>
            <select 
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="w-full bg-transparent text-sm font-semibold text-slate-800 outline-none cursor-pointer"
            >
              {LOCATIONS.map(loc => (
                <option key={loc.id} value={loc.id}>{loc.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Min Price */}
        <div className="flex-1 flex items-center gap-2.5 px-4 py-2 border-r border-slate-200">
          <DollarSign className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <div className="flex-1">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Min Budget (₦)</label>
            <input 
              type="number" 
              placeholder="e.g. 100,000"
              value={minPrice}
              onChange={e => setMinPrice(e.target.value)}
              className="w-full bg-transparent text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-300"
            />
          </div>
        </div>

        {/* Max Price */}
        <div className="flex-1 flex items-center gap-2.5 px-4 py-2">
          <DollarSign className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <div className="flex-1">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Max Budget (₦)</label>
            <input 
              type="number" 
              placeholder="e.g. 250,000"
              value={maxPrice}
              onChange={e => setMaxPrice(e.target.value)}
              className="w-full bg-transparent text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-300"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pl-2">
          {(location || minPrice || maxPrice) && (
            <button 
              type="button" 
              onClick={handleReset}
              className="p-3 text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors"
            >
              Clear
            </button>
          )}
          <button 
            type="submit"
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-full shadow-lg shadow-indigo-200 transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-95"
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
          </button>
        </div>
      </form>

      {/* MOBILE SEARCH PILL */}
      <div className="md:hidden">
        <button 
          onClick={() => setMobileModalOpen(true)}
          className="w-full flex items-center justify-between bg-white px-5 py-3.5 rounded-full shadow-lg shadow-slate-200 border border-slate-200 text-slate-700 hover:border-indigo-300 transition-all"
        >
          <div className="flex items-center gap-3">
            <Search className="w-5 h-5 text-indigo-600" />
            <div className="text-left">
              <p className="text-xs font-bold text-slate-800">Where are you staying?</p>
              <p className="text-[11px] text-slate-400 truncate">
                {location || 'Any location'} • {minPrice ? `₦${Number(minPrice).toLocaleString()}` : 'Min'} - {maxPrice ? `₦${Number(maxPrice).toLocaleString()}` : 'Max'}
              </p>
            </div>
          </div>
          <div className="p-2 bg-indigo-50 rounded-full text-indigo-600">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
        </button>

        {/* MOBILE SEARCH MODAL */}
        {mobileModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 space-y-5 border border-slate-100 animate-slide-up">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold text-slate-800">Filter Hostels & Lodges</h3>
                <button 
                  onClick={() => setMobileModalOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Preferred Area</label>
                <select 
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {LOCATIONS.map(loc => (
                    <option key={loc.id} value={loc.id}>{loc.label}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Min Price (₦)</label>
                  <input 
                    type="number" 
                    placeholder="Min ₦"
                    value={minPrice}
                    onChange={e => setMinPrice(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Max Price (₦)</label>
                  <input 
                    type="number" 
                    placeholder="Max ₦"
                    value={maxPrice}
                    onChange={e => setMaxPrice(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button 
                  type="button" 
                  onClick={handleReset}
                  className="w-1/3 py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50"
                >
                  Reset
                </button>
                <button 
                  type="button"
                  onClick={handleSearchSubmit}
                  className="w-2/3 py-3 bg-indigo-600 text-white font-semibold rounded-xl text-sm shadow-md shadow-indigo-200 hover:bg-indigo-700"
                >
                  Apply Filter
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
