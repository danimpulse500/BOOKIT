import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { useSaved } from '../context/SavedContext';
import AmenitiesList from './AmenitiesList';
import { MapPin, Heart, Home } from 'lucide-react';

// Fallback high-res Unsplash image scaled down to thumbnail dimensions
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=75';

function ListingCard({ listing }) {
  const { isSaved, toggleSave } = useSaved();
  const saved = isSaved(listing.id);

  const handleHeartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSave(listing.id);
  };

  const formattedPrice = `₦${Number(listing.displayPrice || listing.price || 0).toLocaleString()}`;

  return (
    <Link
      to={`/details/${listing.id}`}
      className="group bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col hover:-translate-y-1 block cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={listing.cover_image_url || DEFAULT_IMAGE}
          alt={listing.title || 'Lodge Image'}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.onerror = null; // Prevents infinite loops if fallback fails
            e.target.src = DEFAULT_IMAGE;
          }}
        />

        {/* Top Badges Overlay */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="inline-flex items-center gap-1 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-slate-800 shadow-sm">
            <Home className="w-3.5 h-3.5 text-indigo-600" />
            {listing.rooms || 'Hostel'}
          </span>

          <button
            type="button"
            onClick={handleHeartClick}
            className="pointer-events-auto p-2.5 rounded-full bg-white/90 backdrop-blur-md hover:bg-white text-slate-400 hover:text-rose-500 shadow-sm transition-all active:scale-90"
            title={saved ? "Remove from saved" : "Save lodge"}
          >
            <Heart className={`w-4 h-4 transition-colors ${saved ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
        </div>

        {/* Price Tag Overlay */}
        <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md text-white px-3.5 py-1.5 rounded-xl font-bold text-sm shadow-md">
          {formattedPrice} <span className="text-[10px] font-normal text-slate-300">/ yr</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center gap-1 text-slate-500 text-xs font-semibold mb-1">
            <MapPin className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
            <span className="truncate">{listing.location}</span>
          </div>

          <h3 className="text-base font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1">
            {listing.title}
          </h3>

          <p className="text-slate-500 text-xs line-clamp-2 mt-1 leading-relaxed">
            {listing.description}
          </p>
        </div>

        {/* Amenities Preview */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <AmenitiesList amenities={(listing.amenities || []).slice(0, 3)} />
        </div>
      </div>
    </Link>
  );
}

// Prevents re-rendering every single card when parent state updates
export default memo(ListingCard);