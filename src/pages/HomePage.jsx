import React, { useState, useEffect } from 'react';
import SearchBox from '../components/SearchBox';
import ListingCard from '../components/ListingCard';
import { fetchListings, searchListings } from '../services/api';
import { Building2, Inbox, Loader2, Sparkles, ShieldCheck, MapPin, MoveHorizontal, ChevronDown } from 'lucide-react';
import { LOCATIONS } from '../services/mockData';

export default function HomePage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('ALL');
  const [location, setLocation] = useState('');
  const [proximity, setProximity] = useState('5 mins walk');

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
      <div className="flex justify-center -mt-20">
        <section className="relative min-h-[460px] sm:min-h-[520px] flex flex-col justify-center overflow-hidden bg-[url('/bookit-hero-image.png')] bg-cover bg-center text-white px-4 sm:px-6 lg:px-8 rounded-[2.5rem] w-[calc(100%-2.5rem)]">
        <div className="absolute inset-0 bg-slate-950/45"></div>

        <div className="relative max-w-4xl mx-auto text-center space-y-6 animate-fade-in">

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
            Find Student-Friendly Hostels & Lodges
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto font-normal">
            Search by location and budget near Unizik, Ifite, Amansea, Aroma, and Permanent Site.
          </p>

          <div className="pt-4">
            <SearchBox onSearch={handleSearch} />
          </div>

        </div>
      </section>
      </div>

      {/* QUICK CATEGORY FILTERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Available Lodges</h2>
            <p className="text-xs text-slate-500 mt-0.5">Explore affordable student accommodation</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
            <label className="flex items-center gap-3 bg-white px-4 py-2 rounded-full border border-slate-200">
              <MoveHorizontal className="w-5 h-5 text-slate-500" />
              <span className="text-xs text-slate-400 whitespace-nowrap">Proximity to Campus</span>
              <span className="h-8 border-l border-slate-200"></span>
              <span className="relative flex items-center">
                <select
                  value={proximity}
                  onChange={event => setProximity(event.target.value)}
                  className="appearance-none bg-transparent pr-6 text-sm font-semibold text-slate-700 outline-none cursor-pointer"
                  aria-label="Proximity to Campus"
                >
                  <option>5 mins walk</option>
                  <option>10 mins walk</option>
                  <option>15 mins walk</option>
                  <option>20 mins walk</option>
                </select>
                <ChevronDown className="absolute right-0 w-4 h-4 text-slate-700 pointer-events-none" />
              </span>
            </label>

            <label className="flex items-center gap-3 bg-white px-4 py-2 rounded-full border border-slate-200">
              <MapPin className="w-5 h-5 text-slate-500" />
              <span className="text-xs text-slate-400 whitespace-nowrap">Location</span>
              <span className="h-8 border-l border-slate-200"></span>
              <span className="relative flex items-center">
                <select
                  value={location}
                  onChange={event => {
                    const selectedLocation = event.target.value;
                    setLocation(selectedLocation);
                    handleSearch({ location: selectedLocation, minPrice: 0, maxPrice: Infinity });
                  }}
                  className="appearance-none bg-transparent pr-6 text-sm font-semibold text-slate-700 outline-none cursor-pointer"
                  aria-label="Location"
                >
                  {LOCATIONS.map(option => (
                    <option key={option.id} value={option.id}>
                      {option.id === '' ? 'All Locations' : option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-0 w-4 h-4 text-slate-700 pointer-events-none" />
              </span>
            </label>
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

    </div>
  );
}