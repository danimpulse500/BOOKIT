import React, { useState, useEffect } from 'react';
import SearchBox from '../components/SearchBox';
import ListingCard from '../components/ListingCard';
import { fetchListings, searchListings } from '../services/api';
import { Building2, Inbox, Loader2, Sparkles, ShieldCheck, MapPin } from 'lucide-react';

export default function HomePage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('ALL');

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    setLoading(true);
    try {
      const data = await fetchListings();
      setListings(data);
    } catch (err) {
      console.error("Error loading listings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (params) => {
    setLoading(true);
    try {
      const results = await searchListings(params);
      setListings(results);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredListings = listings.filter(item => {
    if (filterType === 'SELF_CONTAINED') return item.rooms?.toLowerCase().includes('self');
    if (filterType === 'SINGLE_ROOM') return item.rooms?.toLowerCase().includes('single');
    if (filterType === 'UNDER_150K') return (item.displayPrice || item.price) <= 150000;
    if (filterType === 'UNDER_250K') return (item.displayPrice || item.price) <= 250000;
    return true;
  });

  return (
    <div className="space-y-8 sm:space-y-12">

      {/* HERO SECTION */}
      <section className="relative overflow-hidden hero-gradient text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8 rounded-b-[2.5rem] shadow-2xl">
        <div className=""></div>

        <div className="relative max-w-4xl mx-auto text-center space-y-6 animate-fade-in">

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-indigo-200">
            <span>Over 500+ Verified Student Hostels</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Find Student-Friendly <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400">Hostels & Lodges</span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto font-normal">
            Search by location and budget near Unizik, Ifite, Amansea, Aroma, and Permanent Site.
          </p>

          {/* SEARCH BOX COMPONENT */}
          <div className="pt-4">
            <SearchBox onSearch={handleSearch} />
          </div>
        </div>
      </section>

      {/* QUICK CATEGORY FILTERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Available Lodges</h2>
            <p className="text-xs text-slate-500 mt-0.5">Explore affordable student accommodation</p>
          </div>

          {/* Filter Pills (Scrollable on mobile, flex on desktop) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 bg-slate-100 p-1 rounded-full border border-slate-200 text-xs font-semibold text-slate-600 no-scrollbar">
            <button
              onClick={() => setFilterType('ALL')}
              className={`px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all ${filterType === 'ALL' ? 'bg-white text-indigo-600 shadow-sm font-bold' : 'hover:text-slate-900'}`}
            >
              All ({listings.length})
            </button>
            <button
              onClick={() => setFilterType('SELF_CONTAINED')}
              className={`px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all ${filterType === 'SELF_CONTAINED' ? 'bg-white text-indigo-600 shadow-sm font-bold' : 'hover:text-slate-900'}`}
            >
              Self Contained
            </button>
            <button
              onClick={() => setFilterType('SINGLE_ROOM')}
              className={`px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all ${filterType === 'SINGLE_ROOM' ? 'bg-white text-indigo-600 shadow-sm font-bold' : 'hover:text-slate-900'}`}
            >
              Single Rooms
            </button>
            <button
              onClick={() => setFilterType('UNDER_150K')}
              className={`px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all ${filterType === 'UNDER_150K' ? 'bg-white text-indigo-600 shadow-sm font-bold' : 'hover:text-slate-900'}`}
            >
              Under ₦150k
            </button>
          </div>
        </div>

        {/* LISTINGS GRID & STATES */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {[1, 2, 3, 4, 5, 6].map(n => (
              <div key={n} className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 border border-slate-200 shadow-sm space-y-3 sm:space-y-4 animate-pulse">
                <div className="h-32 sm:h-48 bg-slate-200 rounded-xl sm:rounded-2xl"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                <div className="h-7 sm:h-8 bg-slate-200 rounded-xl"></div>
              </div>
            ))}
          </div>
        ) : filteredListings.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {filteredListings.map(listing => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="min-h-[300px] flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center space-y-4">
            <div className="p-4 bg-slate-100 rounded-full text-slate-400">
              <Inbox className="w-10 h-10 sm:w-12 sm:h-12" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-800">No Hostels Found</h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md">
              We couldn't find any hostels matching your exact search criteria. Try adjusting your budget range or clearing location filters.
            </p>
            <button
              onClick={() => handleSearch({ location: '', minPrice: 0, maxPrice: Infinity })}
              className="px-6 py-2.5 bg-indigo-600 text-white text-xs sm:text-sm font-semibold rounded-full hover:bg-indigo-700 transition-all"
            >
              Reset Search Filters
            </button>
          </div>
        )}
      </section>

      {/* WHY CHOOSE BOOKIT BANNER */}
      {/* WHY BOOKIT - AUTO SCROLLING TICKER / SLIDER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 overflow-hidden">
        <div className="border-y border-slate-200 py-6 relative">

          {/* Left/Right Fading Edge Masks for Smooth Visual Blend */}
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          {/* Scrolling Track */}
          <div className="flex gap-12 w-max animate-[marquee_25s_linear_infinite] hover:[animation-play-state:paused]">

            {/* Set 1 */}
            <div className="flex items-center gap-12 shrink-0">
              <div className="flex items-center gap-4 min-w-[280px]">
                <div className="p-2.5 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-600 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-0.5">01 / Verification</div>
                  <h4 className="font-bold text-sm text-slate-900">Verified Campus Agents</h4>
                  <p className="text-xs text-slate-500 leading-tight mt-0.5">Direct connection with authenticated lodge caretakers.</p>
                </div>
              </div>

              <div className="flex items-center gap-4 min-w-[280px]">
                <div className="p-2.5 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-600 shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-0.5">02 / Pricing</div>
                  <h4 className="font-bold text-sm text-slate-900">Transparent Rent Fees</h4>
                  <p className="text-xs text-slate-500 leading-tight mt-0.5">Clear breakdown of 1st year vs subsequent annual rent.</p>
                </div>
              </div>

              <div className="flex items-center gap-4 min-w-[280px]">
                <div className="p-2.5 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-600 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-0.5">03 / Proximity</div>
                  <h4 className="font-bold text-sm text-slate-900">Prime Campus Locations</h4>
                  <p className="text-xs text-slate-500 leading-tight mt-0.5">Walking distance or easy commute to school gates.</p>
                </div>
              </div>
            </div>

            {/* Set 2 (Duplicated for Seamless Infinite Loop) */}
            <div className="flex items-center gap-12 shrink-0">
              <div className="flex items-center gap-4 min-w-[280px]">
                <div className="p-2.5 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-600 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-0.5">01 / Verification</div>
                  <h4 className="font-bold text-sm text-slate-900">Verified Campus Agents</h4>
                  <p className="text-xs text-slate-500 leading-tight mt-0.5">Direct connection with authenticated lodge caretakers.</p>
                </div>
              </div>

              <div className="flex items-center gap-4 min-w-[280px]">
                <div className="p-2.5 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-600 shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-0.5">02 / Pricing</div>
                  <h4 className="font-bold text-sm text-slate-900">Transparent Rent Fees</h4>
                  <p className="text-xs text-slate-500 leading-tight mt-0.5">Clear breakdown of 1st year vs subsequent annual rent.</p>
                </div>
              </div>

              <div className="flex items-center gap-4 min-w-[280px]">
                <div className="p-2.5 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-600 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-0.5">03 / Proximity</div>
                  <h4 className="font-bold text-sm text-slate-900">Prime Campus Locations</h4>
                  <p className="text-xs text-slate-500 leading-tight mt-0.5">Walking distance or easy commute to school gates.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}