import React, { useState, useEffect, useRef } from 'react';
import SearchBox from '../components/SearchBox';
import ListingCard from '../components/ListingCard';
import { fetchListings, searchListings } from '../services/api';
import { Building2, Inbox, Loader2, Sparkles, ShieldCheck, MapPin, MoveHorizontal, ChevronDown } from 'lucide-react';
import { LOCATIONS } from '../services/mockData';

// Custom Styled Dropdown Component
function CustomFilterPill({ label, icon: Icon, value, options, onChange, ariaLabel }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const selectedOption = options.find(opt => opt.value === value) || options[0];

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative flex items-center justify-between sm:justify-start gap-2 bg-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl sm:rounded-full border border-slate-200 shadow-sm">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500 shrink-0" />
        <span className="text-xs sm:text-sm font-normal text-slate-500 whitespace-nowrap">
          {label}
        </span>
      </div>

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 sm:gap-2 bg-slate-50 hover:bg-slate-100 px-3 sm:px-4 py-1 sm:py-1.5 rounded-xl sm:rounded-full border border-slate-200 text-xs sm:text-sm font-bold text-slate-700 focus:outline-none transition-colors"
        aria-label={ariaLabel}
        aria-expanded={isOpen}
      >
        <span className="truncate max-w-[120px] sm:max-w-none">{selectedOption?.label}</span>
        <ChevronDown className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-800 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 sm:w-56 bg-white border border-slate-200 rounded-2xl shadow-2xl py-2 z-50 animate-fade-in">
          {options.map(option => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-xs sm:text-sm font-medium transition-colors ${
                value === option.value
                  ? 'bg-slate-100 font-bold text-slate-900'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

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

  const PROXIMITY_OPTIONS = [
    { value: '5 mins walk', label: '5 mins walk' },
    { value: '10 mins walk', label: '10 mins walk' },
    { value: '15 mins walk', label: '15 mins walk' },
    { value: '20 mins walk', label: '20 mins walk' },
  ];

  const LOCATION_OPTIONS = LOCATIONS.map(opt => ({
    value: opt.id,
    label: opt.id === '' ? 'All Locations' : opt.label,
  }));

  return (
    <div className="space-y-6 sm:space-y-12">

      {/* HERO SECTION */}
      <div className="flex justify-center -mt-14 sm:-mt-20">
        <section className="relative min-h-[380px] sm:min-h-[480px] lg:min-h-[520px] flex flex-col justify-center overflow-hidden bg-[url('/bookit-hero-image.png')] bg-cover bg-center text-white px-4 sm:px-6 lg:px-8 py-10 sm:py-16 rounded-3xl sm:rounded-[2.5rem] w-[calc(100%-1.5rem)] sm:w-[calc(100%-2.5rem)] shadow-xl">
        <div className="absolute inset-0 bg-slate-950/45"></div>

        <div className="relative max-w-4xl mx-auto text-center space-y-4 sm:space-y-6 animate-fade-in">

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Find Student-Friendly Hostels & Lodges
          </h1>

          <p className="text-slate-200 text-xs sm:text-base max-w-xl mx-auto font-normal px-2">
            Search by location and budget near Unizik, Ifite, Amansea, Aroma, and Permanent Site.
          </p>

          <div className="pt-2 sm:pt-4 w-full flex justify-center px-1 sm:px-0">
            <SearchBox onSearch={handleSearch} />
          </div>

        </div>
      </section>
      </div>

      {/* QUICK CATEGORY FILTERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">Available Lodges</h2>
            <p className="text-xs text-slate-500 mt-0.5">Explore affordable student accommodation</p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-sm">
            {/* Proximity Filter */}
            <CustomFilterPill
              label="Proximity to Campus"
              icon={MoveHorizontal}
              value={proximity}
              options={PROXIMITY_OPTIONS}
              onChange={setProximity}
              ariaLabel="Proximity to Campus"
            />

            {/* Location Filter */}
            <CustomFilterPill
              label="Location"
              icon={MapPin}
              value={location}
              options={LOCATION_OPTIONS}
              onChange={selectedLocation => {
                setLocation(selectedLocation);
                handleSearch({ location: selectedLocation, minPrice: 0, maxPrice: Infinity });
              }}
              ariaLabel="Location"
            />
          </div>

        </div>

        {/* LISTINGS GRID & STATES */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6 justify-items-center">
            {[1, 2, 3, 4, 5, 6].map(n => (
              <div key={n} className="w-full max-w-sm bg-white rounded-xl sm:rounded-3xl p-2.5 sm:p-4 border border-slate-200 shadow-sm space-y-2 sm:space-y-4 animate-pulse">
                <div className="h-28 sm:h-48 bg-slate-200 rounded-lg sm:rounded-2xl"></div>
                <div className="h-3 sm:h-4 bg-slate-200 rounded w-3/4"></div>
                <div className="h-2.5 sm:h-3 bg-slate-200 rounded w-1/2"></div>
                <div className="h-6 sm:h-8 bg-slate-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : filteredListings.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6 justify-items-center">
            {filteredListings.map(listing => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="min-h-[260px] sm:min-h-[300px] flex flex-col items-center justify-center bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-6 sm:p-12 text-center space-y-3 sm:space-y-4">
            <div className="p-3.5 sm:p-4 bg-slate-100 rounded-full text-slate-400">
              <Inbox className="w-8 h-8 sm:w-12 sm:h-12" />
            </div>
            <h3 className="text-base sm:text-xl font-bold text-slate-800">No Hostels Found</h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md">
              We couldn't find any hostels matching your exact search criteria. Try adjusting your budget range or clearing location filters.
            </p>
            <button
              onClick={() => handleSearch({ location: '', minPrice: 0, maxPrice: Infinity })}
              className="px-5 sm:px-6 py-2 sm:py-2.5 bg-indigo-600 text-white text-xs sm:text-sm font-semibold rounded-full hover:bg-indigo-700 transition-all"
            >
              Reset Search Filters
            </button>
          </div>
        )}
      </section>

    </div>
  );
}