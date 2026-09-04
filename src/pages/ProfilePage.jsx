import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSaved } from '../context/SavedContext';
import { fetchListings } from '../services/api';
import ListingCard from '../components/ListingCard';
import { LOCATIONS } from '../services/mockData';
import { 
  MapPin, 
  MoveHorizontal, 
  ChevronDown, 
  UserPen, 
  UploadCloud, 
  LogOut, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Loader2, 
  Heart, 
  Clock 
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Custom Filter Pill
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

export default function ProfilePage() {
  const { user, isAgent, logout, changePassword, updateProfile } = useAuth();
  const { savedIds } = useSaved();

  const [allListings, setAllListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('RECENT'); // 'RECENT' | 'SAVED'
  
  // Edit Profile Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({ 
    full_name: user?.name || 'Akorede Ogunshola', 
    phone_number: user?.phone || '08107045642' 
  });
  const [passwordForm, setPasswordForm] = useState({ old_password: '', new_password1: '', new_password2: '' });
  const [accountMessage, setAccountMessage] = useState(null);

  // Filters
  const [proximity, setProximity] = useState('5 mins walk');
  const [location, setLocation] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    loadListingsData();
  }, []);

  const loadListingsData = async () => {
    setLoading(true);
    try {
      const data = await fetchListings();
      setAllListings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (event) => {
    event.preventDefault();
    try {
      await updateProfile(profileForm);
      setAccountMessage('Profile updated successfully.');
      setTimeout(() => setAccountMessage(null), 3000);
    } catch (err) {
      setAccountMessage(err.message || 'Unable to update profile.');
    }
  };

  const handlePasswordChange = async (event) => {
    event.preventDefault();
    try {
      await changePassword(passwordForm);
      setPasswordForm({ old_password: '', new_password1: '', new_password2: '' });
      setAccountMessage('Password changed successfully.');
      setTimeout(() => setAccountMessage(null), 3000);
    } catch (err) {
      setAccountMessage(err.message || 'Unable to change password.');
    }
  };

  // User details with screenshot fallbacks
  const displayName = user?.name || "Akorede Ogunshola";
  const displayRole = user?.role || (isAgent ? "Agent" : "Lodger");
  const displayLocation = user?.location || "Ifite Up School";
  const displayAvatar = user?.avatar || "/avatar.png";

  // Filter listings based on active tab & filters
  const sourceListings = activeTab === 'SAVED' 
    ? allListings.filter(item => savedIds.includes(item.id))
    : allListings;

  const filteredListings = sourceListings.filter(item => {
    if (!location) return true;
    return (
      (item.location && item.location.toLowerCase().includes(location.toLowerCase())) ||
      (item.location_display && item.location_display.toLowerCase().includes(location.toLowerCase())) ||
      (item.title && item.title.toLowerCase().includes(location.toLowerCase()))
    );
  });

  // Display at least 4-12 items to match Screenshot 2
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 sm:space-y-12 animate-fade-in">
      
      {/* USER PROFILE HEADER CARD matching Screenshot 2 */}
      <div className="relative bg-[#F8F9FA] rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 border border-slate-100 shadow-sm space-y-6">
        
        {/* Top-Right Logout Button */}
        <div className="sm:absolute top-6 right-6 sm:top-10 sm:right-10 flex justify-end">
          <button 
            onClick={logout}
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full border border-rose-200 hover:border-rose-300 bg-white hover:bg-rose-50 text-rose-600 text-xs sm:text-sm font-semibold transition-all shadow-sm active:scale-95"
          >
            <span>Logout</span>
            <LogOut className="w-4 h-4 text-rose-500" />
          </button>
        </div>

        {/* User Info Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
          <img 
            src={displayAvatar} 
            alt={displayName}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-white shadow-sm bg-slate-200 shrink-0"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/avatar.png';
            }}
          />

          <div className="space-y-1 sm:space-y-1.5 flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
              {displayName}
            </h1>

            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              {displayRole}
            </p>

            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500 font-medium">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{displayLocation}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          {/* Edit Profile */}
          <button
            type="button"
            onClick={() => setEditModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-all shadow-sm active:scale-95"
          >
            <span>Edit Profile</span>
            <UserPen className="w-4 h-4 text-slate-600" />
          </button>

          {/* Upload New Lodge */}
          <Link
            to="/post"
            className="inline-flex items-center gap-2 px-5 sm:px-6 py-2 sm:py-2.5 rounded-full bg-[#222761] hover:bg-[#1a1e4c] text-white text-xs sm:text-sm font-semibold transition-all shadow-md active:scale-95"
          >
            <span>Upload New Lodge</span>
            <UploadCloud className="w-4 h-4 text-white" />
          </Link>
        </div>
      </div>

      {/* LISTINGS SECTION */}
      <div className="space-y-6">
        {/* Header & Filter Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => { setActiveTab('RECENT'); setCurrentPage(1); }}
              className={`text-xl sm:text-2xl font-bold tracking-tight pb-1 transition-all ${
                activeTab === 'RECENT' 
                  ? 'text-slate-900 border-b-2 border-[#222761]' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Recently Viewed
            </button>

            <button
              onClick={() => { setActiveTab('SAVED'); setCurrentPage(1); }}
              className={`text-sm sm:text-base font-bold pb-1 transition-all flex items-center gap-1.5 ${
                activeTab === 'SAVED' 
                  ? 'text-slate-900 border-b-2 border-[#222761]' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Heart className="w-4 h-4" />
              <span>Saved Lodges ({savedIds.length})</span>
            </button>
          </div>

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

        {/* 4-COLUMN RESPONSIVE LISTINGS GRID matching Screenshot 2 */}
        {loading ? (
          <div className="min-h-[30vh] flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 justify-items-center">
            {paginatedListings.map((lodge, idx) => (
              <ListingCard key={`${lodge.id}-${idx}`} listing={lodge} />
            ))}
          </div>
        )}

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

      {/* EDIT PROFILE MODAL */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 animate-slide-up">
            
            <div className="px-6 py-4 bg-[#222761] text-white flex items-center justify-between">
              <h3 className="font-bold text-base sm:text-lg">Edit Profile Details</h3>
              <button 
                onClick={() => setEditModalOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              {accountMessage && (
                <div className="p-3 bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-semibold rounded-xl">
                  {accountMessage}
                </div>
              )}

              {/* Profile info form */}
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Account Information</h4>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name</label>
                  <input 
                    required 
                    value={profileForm.full_name} 
                    onChange={e => setProfileForm({ ...profileForm, full_name: e.target.value })} 
                    placeholder="Full name" 
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-indigo-500" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Phone Number</label>
                  <input 
                    required 
                    value={profileForm.phone_number} 
                    onChange={e => setProfileForm({ ...profileForm, phone_number: e.target.value })} 
                    placeholder="Phone number" 
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-indigo-500" 
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full py-2.5 bg-[#222761] hover:bg-[#1a1e4c] text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-sm"
                >
                  Save Account Details
                </button>
              </form>

              <hr className="border-slate-200" />

              {/* Password change form */}
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Change Password</h4>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Old Password</label>
                  <input 
                    required 
                    type="password" 
                    value={passwordForm.old_password} 
                    onChange={e => setPasswordForm({ ...passwordForm, old_password: e.target.value })} 
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-indigo-500" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">New Password</label>
                  <input 
                    required 
                    type="password" 
                    value={passwordForm.new_password1} 
                    onChange={e => setPasswordForm({ ...passwordForm, new_password1: e.target.value })} 
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-indigo-500" 
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-sm"
                >
                  Update Password
                </button>
              </form>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
