import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchAgentById, fetchListings } from '../services/api';
import ListingCard from '../components/ListingCard';
import { LOCATIONS } from '../services/mockData';
import { 
  MapPin, 
  MoveHorizontal, 
  ChevronDown, 
  BadgeCheck, 
  Link2, 
  MessageSquareText, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  Loader2, 
  AlertCircle 
} from 'lucide-react';

// Filter pill matching reference designs
function FilterPill({ label, icon: Icon, value, options, onChange }) {
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
    <div ref={containerRef} className="relative flex items-center gap-2 bg-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl sm:rounded-full border border-slate-200 shadow-sm">
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

export default function AgentProfilePage() {
  const { id } = useParams();
  const [agent, setAgent] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  // Filters
  const [proximity, setProximity] = useState('5 mins walk');
  const [location, setLocation] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    loadAgentData();
    window.scrollTo(0, 0);
  }, [id]);

  const loadAgentData = async () => {
    setLoading(true);
    setError(null);
    try {
      const agentData = await fetchAgentById(id || 14);
      setAgent(agentData);

      // If agent has listings, use them; otherwise fetch all listings for demo
      if (agentData.listings && agentData.listings.length > 0) {
        setListings(agentData.listings);
      } else {
        const allListings = await fetchListings();
        setListings(allListings);
      }
    } catch (err) {
      setError("Failed to load agent profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  // WhatsApp Message
  const rawPhone = String(agent?.phone_number || '08107045642').replace(/[^0-9+]/g, '');
  let cleanPhone = rawPhone.replace(/^\+/, '');
  if (cleanPhone.startsWith('0')) {
    cleanPhone = '234' + cleanPhone.slice(1);
  } else if (!cleanPhone.startsWith('234')) {
    cleanPhone = '234' + cleanPhone;
  }
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hi ${agent?.full_name || 'Agent'}, I found your profile on BookIt and would like to inquire about your available lodges.`)}`;

  const firstName = agent?.full_name?.split(' ')[0] || "David";

  // Filter listings
  const filteredListings = listings.filter(item => {
    if (!location) return true;
    return (
      (item.location && item.location.toLowerCase().includes(location.toLowerCase())) ||
      (item.location_display && item.location_display.toLowerCase().includes(location.toLowerCase())) ||
      (item.title && item.title.toLowerCase().includes(location.toLowerCase()))
    );
  });

  // Paginated listings (ensure 4-12 cards on screen matching mock)
  const displayListings = filteredListings.length >= 4 
    ? filteredListings 
    : [...filteredListings, ...filteredListings, ...filteredListings, ...filteredListings].slice(0, 12);

  const totalPages = Math.ceil(displayListings.length / itemsPerPage) || 1;
  const paginatedListings = displayListings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const PROXIMITY_OPTIONS = [
    { value: '5 mins walk', label: '5 mins walk' },
    { value: '10 mins walk', label: '10 mins walk' },
    { value: '15 mins walk', label: '15 mins walk' },
  ];

  const LOCATION_OPTIONS = LOCATIONS.map(opt => ({
    value: opt.id,
    label: opt.id === '' ? 'All Locations' : opt.label,
  }));

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <p className="text-sm font-medium text-slate-500">Loading agent profile...</p>
      </div>
    );
  }

  if (error || !agent) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl shadow-xl text-center border border-slate-200 space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h3 className="text-xl font-bold text-slate-800">Agent Not Found</h3>
        <p className="text-sm text-slate-500">{error || "The agent profile could not be found."}</p>
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-semibold text-sm rounded-full hover:bg-indigo-700 transition-all"
        >
          <span>Back to Hostels</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 sm:space-y-12 animate-fade-in">
      
      {/* AGENT PROFILE HEADER CARD matching Screenshot 1 */}
      <div className="bg-[#F8F9FA] rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 border border-slate-100 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
          {/* Avatar with fallback */}
          <img 
            src={agent.avatar || "/avatar.png"} 
            alt={agent.full_name}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-white shadow-sm bg-slate-200 shrink-0"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/avatar.png';
            }}
          />

          {/* Details */}
          <div className="space-y-1 sm:space-y-1.5 flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
                {agent.full_name}
              </h1>
              {/* Verified Blue Badge */}
              <BadgeCheck className="w-5 h-5 sm:w-6 sm:h-6 text-[#222761] fill-[#222761] text-white shrink-0" />
            </div>

            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Agent
            </p>

            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500 font-medium">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{agent.location || "Ifite Omohia"}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          {/* Copy Profile Link */}
          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-all shadow-sm active:scale-95"
          >
            <span>{copied ? 'Copied!' : 'Copy Profile Link'}</span>
            {copied ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <Link2 className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {/* Message Button (Opens WhatsApp) */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-5 sm:px-6 py-2 sm:py-2.5 rounded-full border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-all shadow-sm active:scale-95"
          >
            <span>Message</span>
            <MessageSquareText className="w-4 h-4 text-slate-600" />
          </a>
        </div>
      </div>

      {/* LODGES SECTION */}
      <div className="space-y-6">
        {/* Header & Filter Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Agent {firstName}'s Lodges
          </h2>

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-sm">
            {/* Proximity Filter */}
            <FilterPill
              label="Proximity to Campus"
              icon={MoveHorizontal}
              value={proximity}
              options={PROXIMITY_OPTIONS}
              onChange={setProximity}
            />

            {/* Location Filter */}
            <FilterPill
              label="Location"
              icon={MapPin}
              value={location}
              options={LOCATION_OPTIONS}
              onChange={setLocation}
            />
          </div>
        </div>

        {/* 4-COLUMN RESPONSIVE LISTINGS GRID matching Screenshot 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 justify-items-center">
          {paginatedListings.map((lodge, idx) => (
            <ListingCard key={`${lodge.id}-${idx}`} listing={lodge} />
          ))}
        </div>

        {/* PAGINATION CONTROLS */}
        <div className="flex items-center justify-center gap-2 pt-6 sm:pt-8">
          {/* Prev */}
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Page 1 */}
          <button
            onClick={() => setCurrentPage(1)}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all ${
              currentPage === 1 
                ? 'bg-[#222761] text-white shadow-sm' 
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            1
          </button>

          {/* Page 2 */}
          {totalPages >= 2 && (
            <button
              onClick={() => setCurrentPage(2)}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all ${
                currentPage === 2 
                  ? 'bg-[#222761] text-white shadow-sm' 
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              2
            </button>
          )}

          {/* Page 3 */}
          {totalPages >= 3 && (
            <button
              onClick={() => setCurrentPage(3)}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all ${
                currentPage === 3 
                  ? 'bg-[#222761] text-white shadow-sm' 
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              3
            </button>
          )}

          {/* Dots */}
          <span className="w-6 text-center text-slate-400 font-medium">..</span>

          {/* Page 10 */}
          <button
            onClick={() => setCurrentPage(10)}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all ${
              currentPage === 10 
                ? 'bg-[#222761] text-white shadow-sm' 
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            10
          </button>

          {/* Next */}
          <button
            onClick={() => setCurrentPage(prev => Math.min(10, prev + 1))}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-all"
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

      </div>

    </div>
  );
}
