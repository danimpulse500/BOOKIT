import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchListingById } from '../services/api';
import { useSaved } from '../context/SavedContext';
import AmenitiesList from '../components/AmenitiesList';
import { 
  MapPin, 
  Heart, 
  PhoneCall, 
  MessageSquare, 
  CheckCircle2, 
  ArrowLeft, 
  Home, 
  Loader2, 
  ShieldCheck,
  Calendar,
  AlertCircle
} from 'lucide-react';

export default function ListingDetailPage() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [activeImage, setActiveImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { isSaved, toggleSave } = useSaved();

  useEffect(() => {
    loadDetails();
  }, [id]);

  const loadDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchListingById(id);
      setListing(data);
      setActiveImage(data.cover_image_url || data.images?.[0]?.image_url || '');
    } catch (err) {
      setError(err.message || "Failed to load listing details");
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

  const saved = isSaved(listing.id);
  const phoneFormatted = (listing.agent_phone || '08000000000').replace(/\s+/g, '');
  const cleanPhone = phoneFormatted.startsWith('0') ? `234${phoneFormatted.slice(1)}` : phoneFormatted;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Back Button & Actions */}
      <div className="flex items-center justify-between">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Hostels</span>
        </Link>

        <button 
          onClick={() => toggleSave(listing.id)}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold transition-all ${saved ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
        >
          <Heart className={`w-4 h-4 ${saved ? 'fill-rose-500 text-rose-500' : ''}`} />
          <span>{saved ? 'Saved' : 'Save Lodge'}</span>
        </button>
      </div>

      {/* Header Info */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-2">
              <Home className="w-3.5 h-3.5" />
              <span>{listing.rooms || 'Self-contained'}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900">{listing.title}</h1>
            <p className="flex items-center gap-1.5 text-slate-500 text-sm font-medium mt-1">
              <MapPin className="w-4 h-4 text-indigo-600" />
              <span>{listing.location}</span>
            </p>
          </div>

          {/* Availability Status Badge */}
          <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${listing.is_available ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
            {listing.is_available ? 'Available for Rent' : 'Occupied'}
          </span>
        </div>
      </div>

      {/* GALLERY & SIDEBAR LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Gallery & Details */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Main Image */}
          <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-md aspect-[16/10]">
            <img 
              src={activeImage} 
              alt={listing.title} 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80';
              }}
            />
          </div>

          {/* Thumbnails */}
          {listing.images && listing.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {listing.images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(img.image_url)}
                  className={`w-20 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${activeImage === img.image_url ? 'border-indigo-600 scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'}`}
                >
                  <img src={img.image_url} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Description Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-slate-800 pb-3 border-b border-slate-100">About this Lodge</h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {listing.description}
            </p>
          </div>

          {/* Amenities Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-slate-800 pb-3 border-b border-slate-100">Lodge Amenities</h2>
            <AmenitiesList amenities={listing.amenities} />
          </div>

          {/* Rules Card */}
          {listing.rules && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
              <h2 className="text-xl font-bold text-slate-800 pb-3 border-b border-slate-100">House Rules & Policy</h2>
              <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-200 text-sm text-amber-900">
                <CheckCircle2 className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed">{listing.rules}</p>
              </div>
            </div>
          )}

        </div>

        {/* SIDEBAR AGENT & PRICE CARDS */}
        <div className="space-y-6">
          
          {/* Price Breakdown Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-lg space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Rent Breakdown</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <span className="text-xs font-medium text-slate-500">1st Year Package</span>
                <span className="text-lg font-extrabold text-indigo-600">
                  ₦{Number(listing.first_price || listing.price).toLocaleString()}
                </span>
              </div>

              {listing.year_price && (
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-slate-500">Subsequent Years</span>
                  <span className="text-sm font-bold text-slate-700">
                    ₦{Number(listing.year_price).toLocaleString()} / yr
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Agent Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-lg text-center space-y-4">
            <div className="relative w-20 h-20 mx-auto">
              <img 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${listing.agent_name}`}
                alt={listing.agent_name}
                className="w-full h-full rounded-full bg-indigo-50 border-4 border-indigo-100 shadow-sm"
              />
              <ShieldCheck className="w-6 h-6 text-indigo-600 absolute bottom-0 right-0 bg-white rounded-full p-0.5" />
            </div>

            <div>
              <h4 className="text-lg font-bold text-slate-800">{listing.agent_name}</h4>
              <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Verified BookIt Agent</p>
            </div>

            <div className="pt-2 space-y-3">
              {/* WhatsApp Button */}
              <a 
                href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hi ${listing.agent_name}, I am interested in viewing "${listing.title}" on Book-It.`)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-2xl shadow-md shadow-emerald-200 transition-all flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-5 h-5" />
                <span>Chat on WhatsApp</span>
              </a>

              {/* Direct Call Button */}
              <a 
                href={`tel:${phoneFormatted}`}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call Agent ({listing.agent_phone})</span>
              </a>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
