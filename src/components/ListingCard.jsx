import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Building2, MapPin, Home, Calendar, RefreshCw } from 'lucide-react';

function ListingCard({ listing = {} }) {
  // Values with dynamic fallbacks
  const title = listing.title || listing.lodge_name || "Staircase at Ifite Up School";
  const location = listing.location_display || listing.location || "El-Shaddai Royal Suite";
  const propertyType = listing.rooms || "Self-Contained";
  const rawEntry = listing.first_price || listing.price;
  const entryRent = rawEntry ? `₦${Number(rawEntry).toLocaleString()}` : "₦350,000";
  const rawRenewal = listing.year_price || listing.renewalPrice;
  const renewalRent = rawRenewal ? `₦${Number(rawRenewal).toLocaleString()}` : "₦280,000";

  return (
    <div className="relative w-full max-w-sm rounded-xl sm:rounded-[32px] overflow-hidden bg-slate-100 shadow-sm hover:shadow-md transition-shadow">
      {/* Background Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-slate-400">
          <Building2 className="w-10 h-10" aria-hidden="true" />
        </div>
        {listing.cover_image_url && (
          <img
            src={listing.cover_image_url}
            alt={title}
            loading="lazy"
            className="relative w-full h-full object-cover object-top"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        )}

        {/* Top Right "View" Button Overlay */}
        <Link
          to={`/details/${listing.id || 1}`}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white/90 hover:bg-white text-black font-semibold px-2.5 py-1 sm:px-6 sm:py-2 rounded-full text-[10px] sm:text-sm shadow-md backdrop-blur-sm transition-all active:scale-95"
        >
          View
        </Link>
      </div>

      {/* Overlapping Floating Card */}
      <div className="relative -mt-8 sm:-mt-16 mx-1.5 sm:mx-3 mb-1.5 sm:mb-3 bg-white rounded-lg sm:rounded-[24px] p-2.5 sm:p-5 shadow-md flex flex-col space-y-1.5 sm:space-y-3">
        {/* Title */}
        <h3 className="text-xs sm:text-xl font-bold text-slate-900 tracking-tight line-clamp-1">
          {title}
        </h3>

        {/* Info Rows */}
        <div className="space-y-1 sm:space-y-2 pt-0.5 text-slate-600 text-[10px] sm:text-sm font-medium">
          {/* Location */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            <MapPin className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-slate-700 shrink-0" />
            <span className="truncate">{location}</span>
          </div>

          {/* Property Type */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            <Home className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-slate-700 shrink-0" />
            <span className="truncate">{propertyType}</span>
          </div>

          {/* Entry Rent */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            <Calendar className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-slate-700 shrink-0" />
            <div className="flex items-center gap-1 truncate">
              <span className="text-slate-500 hidden xs:inline sm:inline">Entry:</span>
              <span className="font-semibold text-slate-800">{entryRent}</span>
            </div>
          </div>

          {/* Renewal Rent */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            <RefreshCw className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-slate-700 shrink-0" />
            <div className="flex items-center gap-1 truncate">
              <span className="text-slate-500 hidden xs:inline sm:inline">Renewal:</span>
              <span className="font-semibold text-slate-800">{renewalRent}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(ListingCard);