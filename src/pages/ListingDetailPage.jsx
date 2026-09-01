import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchListingById, fetchListings, parseAmenities } from '../services/api';
import ListingCard from '../components/ListingCard';
import { 
  MapPin, 
  Home, 
  Calendar, 
  RefreshCw, 
  MoveHorizontal,
  Sparkles,
  Share2, 
  Check, 
  Copy, 
  X, 
  Loader2, 
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import { FaWhatsapp, FaTwitter, FaFacebookF } from 'react-icons/fa';

const GALLERY_FALLBACKS = [
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80'
];

export default function ListingDetailPage() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [similarListings, setSimilarListings] = useState([]);
  const [activeImage, setActiveImage] = useState('');
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Share Modal State
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadDetails();
    window.scrollTo(0, 0);
  }, [id]);

  const loadDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchListingById(id);
      setListing(data);
      
      // Setup main image and gallery images (ensure 4 thumbnails)
      const primaryImg = data.cover_image_url || data.images?.[0]?.image_url || GALLERY_FALLBACKS[0];
      setActiveImage(primaryImg);

      let rawImages = (data.images && data.images.length > 0) 
        ? data.images.map(img => typeof img === 'string' ? img : img.image_url) 
        : [primaryImg];

      // Fill up to 4 images if fewer
      GALLERY_FALLBACKS.forEach(fallback => {
        if (rawImages.length < 4 && !rawImages.includes(fallback)) {
          rawImages.push(fallback);
        }
      });
      setGalleryImages(rawImages.slice(0, 4));

      // Fetch similar listings for sidebar
      try {
        const allListings = await fetchListings();
        const filtered = allListings.filter(item => String(item.id) !== String(id)).slice(0, 3);
        setSimilarListings(filtered);
      } catch (err) {
        console.warn("Failed to load similar listings:", err);
      }

    } catch (err) {
      setError(err.message || "Failed to load lodge details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <p className="text-sm font-medium text-slate-500">Loading lodge details...</p>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl shadow-xl text-center border border-slate-200 space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h3 className="text-xl font-bold text-slate-800">Lodge Not Found</h3>
        <p className="text-sm text-slate-500">{error || "The property listing could not be found."}</p>
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-semibold text-sm rounded-full hover:bg-indigo-700 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Hostels</span>
        </Link>
      </div>
    );
  }

  // Values formatted to match reference design
  const title = listing.title || "El-Shaddai Royal Suite";
  const location = listing.location || "El-Shaddai Royal Suite";
  const propertyType = listing.rooms || "Self-Contained";
  const entryRent = listing.first_price || listing.price 
    ? `₦${Number(listing.first_price || listing.price).toLocaleString()}` 
    : "₦350,000";
  const renewalRent = listing.year_price 
    ? `₦${Number(listing.year_price).toLocaleString()}` 
    : "₦280,000";
  const description = listing.description || "A spacious, modern self-contained apartment located steps away from Ifite Down School. Includes 24/7 security, personal balcony, and reliable water supply.";

  // Display Amenities parsed from API
  const displayAmenities = parseAmenities(listing.amenities);

  // Sharable Link with embedded metadata parameters
  const shareUrl = `${window.location.origin}/details/${listing.id}?title=${encodeURIComponent(title)}&image=${encodeURIComponent(activeImage)}&desc=${encodeURIComponent(description)}`;

  // WhatsApp Agent Link (includes full sharable link with lodge title, image, and details)
  const phoneFormatted = (listing.agent_phone || '08000000000').replace(/\s+/g, '');
  const cleanPhone = phoneFormatted.startsWith('0') ? `234${phoneFormatted.slice(1)}` : phoneFormatted;
  const whatsappMessage = `Hi ${listing.agent_name || 'Agent'}, I am interested in booking/viewing "${title}".\n\nProperty Link & Image:\n${shareUrl}`;
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(whatsappMessage)}`;

  // Share handlers
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `${title} - ${description}`,
          url: shareUrl
        });
        return;
      } catch (err) {
        // Fallback to modal if user canceled or failed
      }
    }
    setShareModalOpen(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 animate-fade-in">
      
      {/* 2-Column Main Layout Grid matching design */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        
        {/* LEFT COLUMN: Main Image, Thumbnails, Details, & Action Button */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main Hero Image with Share Overlay */}
          <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden bg-slate-100 shadow-md">
            <img 
              src={activeImage} 
              alt={title}
              className="w-full h-full object-cover object-center transition-all duration-300"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = GALLERY_FALLBACKS[0];
              }}
            />

            {/* Share Button Overlay (Top Right) */}
            <button
              onClick={handleNativeShare}
              className="absolute top-4 right-4 z-20 bg-white/90 hover:bg-white text-slate-800 font-semibold px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm shadow-md backdrop-blur-sm flex items-center gap-2 transition-all active:scale-95"
            >
              <span>Share</span>
              <Share2 className="w-4 h-4 text-slate-700" />
            </button>
          </div>

          {/* 4 Thumbnail Image Gallery */}
          <div className="grid grid-cols-4 gap-3 sm:gap-4">
            {galleryImages.map((imgUrl, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(imgUrl)}
                className={`relative aspect-[4/3] w-full rounded-xl sm:rounded-2xl overflow-hidden border-2 transition-all ${
                  activeImage === imgUrl 
                    ? 'border-indigo-600 shadow-md scale-[0.98]' 
                    : 'border-transparent opacity-85 hover:opacity-100'
                }`}
              >
                <img 
                  src={imgUrl} 
                  alt={`Lodge view ${idx + 1}`} 
                  className="w-full h-full object-cover" 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = GALLERY_FALLBACKS[idx % GALLERY_FALLBACKS.length];
                  }}
                />
              </button>
            ))}
          </div>

          {/* Title & Description */}
          <div className="pt-2 space-y-3">
            <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              {title}
            </h1>
            <p className="text-slate-600 text-xs sm:text-base leading-relaxed max-w-3xl">
              {description}
            </p>
          </div>

          {/* Details / Key Specs List matching reference */}
          <div className="space-y-3 pt-2 text-slate-600 text-xs sm:text-sm font-medium">
            {/* Location */}
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-slate-700 shrink-0" />
              <span>{location}</span>
            </div>

            {/* Property Type */}
            <div className="flex items-center gap-3">
              <Home className="w-5 h-5 text-slate-700 shrink-0" />
              <span>{propertyType}</span>
            </div>

            {/* Entry Rent */}
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-slate-700 shrink-0" />
              <div className="flex items-center gap-1">
                <span className="text-slate-500">Entry rent:</span>
                <span className="font-semibold text-slate-800">{entryRent}</span>
              </div>
            </div>

            {/* Renewal Rent */}
            <div className="flex items-center gap-3">
              <RefreshCw className="w-5 h-5 text-slate-700 shrink-0" />
              <div className="flex items-center gap-1">
                <span className="text-slate-500">Renewal rent:</span>
                <span className="font-semibold text-slate-800">{renewalRent}</span>
              </div>
            </div>

            {/* Proximity to Campus */}
            <div className="flex items-center gap-3">
              <MoveHorizontal className="w-5 h-5 text-slate-700 shrink-0" />
              <div className="flex items-center gap-1">
                <span className="text-slate-500">Proximity to Campus:</span>
                <span className="font-semibold text-slate-800">5 mins walk</span>
              </div>
            </div>

            {/* Amenities */}
            <div className="flex items-start sm:items-center gap-3">
              <Sparkles className="w-5 h-5 text-slate-700 shrink-0 mt-0.5 sm:mt-0" />
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-slate-500">Amenities:</span>
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  {displayAmenities.map((amenity, idx) => (
                    <span 
                      key={idx} 
                      className="px-3 py-1 bg-[#E5E7EB] text-slate-700 text-xs font-semibold rounded-full"
                    >
                      {typeof amenity === 'string' ? amenity : amenity?.name || amenity?.title || amenity}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* WhatsApp CTA Button */}
          <div className="pt-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-[#222761] hover:bg-indigo-900 text-white font-bold rounded-full text-sm sm:text-base shadow-lg shadow-indigo-950/20 active:scale-95 transition-all w-full sm:w-auto text-center"
            >
              <span>Contact Agent On WhatsApp</span>
            </a>
          </div>

        </div>

        {/* RIGHT COLUMN: Similar Lodges */}
        <div className="lg:col-span-4 space-y-6 pt-4 lg:pt-0">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Similar Lodges
          </h2>

          <div className="grid grid-cols-2 lg:grid-cols-1 gap-2.5 sm:gap-6 justify-items-center">
            {similarListings.length > 0 ? (
              similarListings.map(item => (
                <ListingCard key={item.id} listing={item} />
              ))
            ) : (
              // Fallback cards if no API items available
              [1, 2, 3].map(n => (
                <ListingCard 
                  key={n} 
                  listing={{
                    id: n + 10,
                    title: "El-Shaddai Royal Suite",
                    location: "El-Shaddai Royal Suite",
                    rooms: "Self-Contained",
                    price: 350000,
                    renewalPrice: 280000,
                    cover_image_url: GALLERY_FALLBACKS[n % GALLERY_FALLBACKS.length]
                  }} 
                />
              ))
            )}
          </div>
        </div>

      </div>

      {/* SHARE MODAL / DIALOG */}
      {shareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-4 overflow-y-auto bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full mt-12 sm:mt-0 overflow-hidden border border-slate-100 animate-slide-up">
            
            {/* Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-base sm:text-lg">Share This Lodge</h3>
              </div>
              <button 
                onClick={() => setShareModalOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 space-y-5">
              
              {/* Lodge Card Preview inside Modal */}
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <img 
                  src={activeImage} 
                  alt={title} 
                  className="w-16 h-16 rounded-xl object-cover shrink-0" 
                />
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-sm text-slate-800 truncate">{title}</h4>
                  <p className="text-xs text-slate-500 truncate">{location}</p>
                  <p className="text-xs font-bold text-indigo-600 mt-0.5">{entryRent} / yr</p>
                </div>
              </div>

              {/* Sharable Link Input & Copy Button */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-600">Sharable Web Link</label>
                <div className="flex items-center gap-2 bg-slate-100 p-1.5 pl-3 rounded-2xl border border-slate-200">
                  <input 
                    type="text" 
                    readOnly 
                    value={shareUrl}
                    className="flex-1 min-w-0 bg-transparent text-xs font-medium text-slate-700 outline-none truncate"
                  />
                  <button
                    onClick={handleCopyLink}
                    className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      copied 
                        ? 'bg-emerald-600 text-white shadow-sm' 
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Social Media Quick Sharing */}
              <div className="space-y-2 pt-1">
                <span className="block text-xs font-semibold text-slate-600">Share via Social Media</span>
                <div className="grid grid-cols-3 gap-2.5">
                  {/* WhatsApp */}
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out ${title} on BookIt!\n${description}\n\nLink: ${shareUrl}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors text-xs font-semibold"
                  >
                    <FaWhatsapp className="w-5 h-5 text-emerald-600" />
                    <span>WhatsApp</span>
                  </a>

                  {/* Twitter / X */}
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out ${title} on BookIt!`)}&url=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-300 transition-colors text-xs font-semibold"
                  >
                    <FaTwitter className="w-5 h-5 text-sky-500" />
                    <span>Twitter</span>
                  </a>

                  {/* Facebook */}
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200 transition-colors text-xs font-semibold"
                  >
                    <FaFacebookF className="w-5 h-5 text-blue-600" />
                    <span>Facebook</span>
                  </a>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
