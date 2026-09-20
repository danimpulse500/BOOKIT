import React, { useState, useEffect, useRef } from 'react';
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
  ArrowLeft,
  MessageSquareText,
  Play,
  Video
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
  const [activeMedia, setActiveMedia] = useState(null); // { type: 'image' | 'video', url, poster }
  const [mediaTabs, setMediaTabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

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

      // Build unified media list: video first (if present), then images
      const images = (data.images && data.images.length > 0)
        ? data.images.map(img => (typeof img === 'string' ? img : img.image_url)).filter(Boolean)
        : [];

      const primaryImg = data.cover_image_url || images[0] || GALLERY_FALLBACKS[0];

      const tabs = [];

      // 1) Video first
      if (data.video_url) {
        tabs.push({
          type: 'video',
          url: data.video_url,
          poster: primaryImg,
        });
      }

      // 2) Images next (cover + gallery)
      const seen = new Set();
      const pushImage = (url) => {
        if (url && !seen.has(url)) {
          seen.add(url);
          tabs.push({ type: 'image', url });
        }
      };
      if (data.cover_image_url) pushImage(data.cover_image_url);
      images.forEach(pushImage);

      // 3) Fill with fallbacks up to 4 tabs
      GALLERY_FALLBACKS.forEach(fb => {
        if (tabs.length < 4) pushImage(fb);
      });

      setMediaTabs(tabs.slice(0, 4));

      // Set initial active media: video first if available
      const initial = tabs[0] || { type: 'image', url: GALLERY_FALLBACKS[0] };
      setActiveMedia(initial);
      setIsPlaying(false);

      // Fetch similar listings
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

  // ---- Field mapping matched to your JSON ----
  const title = listing.lodge_name || "Untitled Lodge";
  const location = listing.location_display || listing.location || "Unknown Location";
  const propertyType = listing.room_type
    ? listing.room_type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    : "Self-Contained";
  const entryRent = listing.first_price
    ? `₦${Number(listing.first_price).toLocaleString()}`
    : "Price on request";
  const renewalRent = listing.year_price
    ? `₦${Number(listing.year_price).toLocaleString()}`
    : "N/A";
  const description = listing.description || "No description provided.";

  const displayAmenities = parseAmenities(listing.amenities);

  // Sharable link — use activeMedia url only if it's an image; fallback to cover
  const shareImage = activeMedia?.type === 'image'
    ? activeMedia.url
    : (listing.cover_image_url || GALLERY_FALLBACKS[0]);
  const shareUrl = `${window.location.origin}/details/${listing.id}?title=${encodeURIComponent(title)}&image=${encodeURIComponent(shareImage)}&desc=${encodeURIComponent(description)}`;

  // Agent profile details
  const agentDetail = listing.agent_detail || {};
  const agentName = listing.agent_name || agentDetail.full_name || agentDetail.username || "Agent";
  const agentId = listing.agent || agentDetail.id || listing.id;
  const agentPhone = listing.agent_phone || agentDetail.phone_number || listing.contact_phone || "";
  const agentEmail = listing.agent_email || agentDetail.email || listing.contact_email || "";
  const agencyName = listing.agency || agentDetail.agency_name || null;
  const agentSubtitle = agencyName || listing.location_display || listing.location || "";
  const agentAvatar = listing.agent_avatar || agentDetail.avatar || "/avatar.png";

  // WhatsApp link
  const rawPhone = String(agentPhone).replace(/[^0-9+]/g, '');
  let cleanPhone = rawPhone.replace(/^\+/, '');
  if (cleanPhone.startsWith('0')) {
    cleanPhone = '234' + cleanPhone.slice(1);
  } else if (cleanPhone && !cleanPhone.startsWith('234')) {
    cleanPhone = '234' + cleanPhone;
  }
  const whatsappMessage = `Hi ${agentName}, I am interested in booking/viewing "${title}".\n\nProperty Link:\n${shareUrl}`;
  const whatsappUrl = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(whatsappMessage)}`
    : `mailto:${agentEmail}?subject=${encodeURIComponent('Inquiry: ' + title)}&body=${encodeURIComponent(whatsappMessage)}`;

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
        // Fallback to modal
      }
    }
    setShareModalOpen(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  // Tab click handler — resets video play state
  const handleTabClick = (tab) => {
    setActiveMedia(tab);
    setIsPlaying(false);
  };

  // Video play toggle
  const handlePlayVideo = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 animate-fade-in">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main Hero — Image OR Video */}
          <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden bg-slate-900 shadow-md">
            {activeMedia?.type === 'video' ? (
              <>
                <video
                  ref={videoRef}
                  src={activeMedia.url}
                  poster={activeMedia.poster}
                  className="w-full h-full object-cover object-center"
                  controls={isPlaying}
                  playsInline
                  preload="metadata"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => setIsPlaying(false)}
                />
                {!isPlaying && (
                  <button
                    onClick={handlePlayVideo}
                    aria-label="Play video"
                    className="absolute inset-0 z-10 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors group"
                  >
                    <span className="flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/95 group-hover:bg-white shadow-2xl ring-4 ring-white/30 transition-transform active:scale-95">
                      <Play className="w-9 h-9 sm:w-10 sm:h-10 text-[#222761] fill-[#222761] translate-x-0.5" />
                    </span>
                  </button>
                )}
              </>
            ) : (
              <img 
                src={activeMedia?.url || GALLERY_FALLBACKS[0]} 
                alt={title}
                className="w-full h-full object-cover object-center transition-all duration-300"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = GALLERY_FALLBACKS[0];
                }}
              />
            )}

            {/* Share Button Overlay */}
            <button
              onClick={handleNativeShare}
              className="absolute top-4 right-4 z-20 bg-white/90 hover:bg-white text-slate-800 font-semibold px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm shadow-md backdrop-blur-sm flex items-center gap-2 transition-all active:scale-95"
            >
              <span>Share</span>
              <Share2 className="w-4 h-4 text-slate-700" />
            </button>
          </div>

          {/* Media Tabs Gallery (images + video) */}
          <div className="grid grid-cols-4 gap-3 sm:gap-4">
            {mediaTabs.map((tab, idx) => {
              const isActive = activeMedia?.url === tab.url;
              return (
                <button
                  key={idx}
                  onClick={() => handleTabClick(tab)}
                  className={`relative aspect-[4/3] w-full rounded-xl sm:rounded-2xl overflow-hidden border-2 transition-all ${
                    isActive 
                      ? 'border-indigo-600 shadow-md scale-[0.98]' 
                      : 'border-transparent opacity-85 hover:opacity-100'
                  }`}
                >
                  <img 
                    src={tab.type === 'video' ? tab.poster : tab.url} 
                    alt={tab.type === 'video' ? `Video ${idx + 1}` : `Lodge view ${idx + 1}`}
                    className="w-full h-full object-cover" 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = GALLERY_FALLBACKS[idx % GALLERY_FALLBACKS.length];
                    }}
                  />
                  {tab.type === 'video' && (
                    <span className="absolute inset-0 flex items-center justify-center bg-black/35">
                      <span className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 shadow-md">
                        <Play className="w-4 h-4 sm:w-5 sm:h-5 text-[#222761] fill-[#222761] translate-x-0.5" />
                      </span>
                    </span>
                  )}
                </button>
              );
            })}
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

          {/* Details / Key Specs */}
          <div className="space-y-3 pt-2 text-slate-600 text-xs sm:text-sm font-medium">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-slate-700 shrink-0" />
              <span>{location}</span>
            </div>

            <div className="flex items-center gap-3">
              <Home className="w-5 h-5 text-slate-700 shrink-0" />
              <span>{propertyType}</span>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-slate-700 shrink-0" />
              <div className="flex items-center gap-1">
                <span className="text-slate-500">Entry rent:</span>
                <span className="font-semibold text-slate-800">{entryRent}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <RefreshCw className="w-5 h-5 text-slate-700 shrink-0" />
              <div className="flex items-center gap-1">
                <span className="text-slate-500">Renewal rent:</span>
                <span className="font-semibold text-slate-800">{renewalRent}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MoveHorizontal className="w-5 h-5 text-slate-700 shrink-0" />
              <div className="flex items-center gap-1">
                <span className="text-slate-500">Proximity to Campus:</span>
                <span className="font-semibold text-slate-800">5 mins walk</span>
              </div>
            </div>

            {displayAmenities.length > 0 && (
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
            )}
          </div>

          {/* Agent Profile Section */}
          <div className="pt-3 sm:pt-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <img 
                src={agentAvatar} 
                alt={agentName}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover shrink-0 border border-slate-200 shadow-sm"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/avatar.png';
                }}
              />
              <div className="min-w-0">
                <h4 className="font-bold text-slate-900 text-sm sm:text-base tracking-tight truncate leading-snug">
                  {agentName}
                </h4>
                <p className="text-xs sm:text-sm text-slate-500 font-medium truncate">
                  {agentSubtitle}
                </p>
              </div>
            </div>

            <Link
              to={`/agent/${agentId}`}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-medium transition-all shadow-sm active:scale-95 shrink-0"
            >
              <span>View Profile</span>
              <MessageSquareText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-600" />
            </Link>
          </div>

          {/* WhatsApp CTA */}
          <div className="pt-2 sm:pt-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 bg-[#222761] hover:bg-[#1a1e4c] text-white font-bold rounded-2xl sm:rounded-full text-sm sm:text-base shadow-lg shadow-indigo-950/20 active:scale-95 transition-all w-full sm:w-auto text-center"
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
              [1, 2, 3].map(n => (
                <ListingCard 
                  key={n} 
                  listing={{
                    id: n + 10,
                    lodge_name: "El-Shaddai Royal Suite",
                    location_display: "Ifite Anambra",
                    room_type: "SELF_CONTAINED",
                    first_price: 350000,
                    year_price: 280000,
                    cover_image_url: GALLERY_FALLBACKS[n % GALLERY_FALLBACKS.length]
                  }} 
                />
              ))
            )}
          </div>
        </div>

      </div>

      {/* SHARE MODAL */}
      {shareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-4 overflow-y-auto bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full mt-12 sm:mt-0 overflow-hidden border border-slate-100 animate-slide-up">
            
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

            <div className="p-6 space-y-5">
              
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <img 
                  src={shareImage} 
                  alt={title} 
                  className="w-16 h-16 rounded-xl object-cover shrink-0" 
                />
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-sm text-slate-800 truncate">{title}</h4>
                  <p className="text-xs text-slate-500 truncate">{location}</p>
                  <p className="text-xs font-bold text-indigo-600 mt-0.5">{entryRent} / yr</p>
                </div>
              </div>

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

              <div className="space-y-2 pt-1">
                <span className="block text-xs font-semibold text-slate-600">Share via Social Media</span>
                <div className="grid grid-cols-3 gap-2.5">
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out ${title} on BookIt!\n${description}\n\nLink: ${shareUrl}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors text-xs font-semibold"
                  >
                    <FaWhatsapp className="w-5 h-5 text-emerald-600" />
                    <span>WhatsApp</span>
                  </a>

                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out ${title} on BookIt!`)}&url=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-300 transition-colors text-xs font-semibold"
                  >
                    <FaTwitter className="w-5 h-5 text-sky-500" />
                    <span>Twitter</span>
                  </a>

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