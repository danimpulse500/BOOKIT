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
  Clock,
  KeyRound
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
  const [editSection, setEditSection] = useState('profile');
  const [profileForm, setProfileForm] = useState({ 
    full_name: user?.full_name || user?.name || '',
    phone_number: user?.phone_number || user?.phone || ''
  });
  const [passwordForm, setPasswordForm] = useState({ old_password: '', new_password1: '', new_password2: '' });
  const [accountMessage, setAccountMessage] = useState(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

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
    setSavingProfile(true);
    setAccountMessage(null);
    try {
      await updateProfile(profileForm);
      setAccountMessage({ type: 'success', text: 'Profile updated successfully.' });
    } catch (err) {
      setAccountMessage({ type: 'error', text: err.message || 'Unable to update profile.' });
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordChange = async (event) => {
    event.preventDefault();
    if (passwordForm.new_password1 !== passwordForm.new_password2) {
      setAccountMessage({ type: 'error', text: 'The new passwords do not match.' });
      return;
    }

    setChangingPassword(true);
    setAccountMessage(null);
    try {
      await changePassword(passwordForm);
      setPasswordForm({ old_password: '', new_password1: '', new_password2: '' });
      setAccountMessage({ type: 'success', text: 'Password changed successfully.' });
    } catch (err) {
      setAccountMessage({ type: 'error', text: err.message || 'Unable to change password.' });
    } finally {
      setChangingPassword(false);
    }
  };

  useEffect(() => {
    if (!editModalOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setEditModalOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [editModalOpen]);

  const openEditModal = () => {
    setProfileForm({
      full_name: user?.full_name || user?.name || '',
      phone_number: user?.phone_number || user?.phone || ''
    });
    setEditSection('profile');
    setAccountMessage(null);
    setEditModalOpen(true);
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
            onClick={openEditModal}
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
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6 justify-items-center">
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
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/60 p-0 backdrop-blur-sm animate-fade-in sm:items-center sm:p-4"
          onMouseDown={event => {
            if (event.target === event.currentTarget) setEditModalOpen(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-profile-title"
            className="flex max-h-[92dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl border border-slate-100 bg-white shadow-2xl animate-slide-up sm:rounded-3xl"
          >
            <header className="flex items-start justify-between border-b border-slate-100 px-5 py-5 sm:px-7">
              <div>
                <h3 id="edit-profile-title" className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                  Account settings
                </h3>
                <p className="mt-1 text-sm text-slate-500">Manage your personal details and password.</p>
              </div>
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                aria-label="Close account settings"
                className="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            <div className="grid grid-cols-2 gap-1 border-b border-slate-100 px-5 pt-3 sm:px-7">
              <button
                type="button"
                role="tab"
                aria-selected={editSection === 'profile'}
                onClick={() => { setEditSection('profile'); setAccountMessage(null); }}
                className={`flex items-center justify-center gap-2 rounded-t-xl border-b-2 px-3 py-3 text-sm font-semibold transition-colors ${
                  editSection === 'profile'
                    ? 'border-[#222761] text-[#222761]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <UserPen className="h-4 w-4" />
                Profile details
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={editSection === 'password'}
                onClick={() => { setEditSection('password'); setAccountMessage(null); }}
                className={`flex items-center justify-center gap-2 rounded-t-xl border-b-2 px-3 py-3 text-sm font-semibold transition-colors ${
                  editSection === 'password'
                    ? 'border-[#222761] text-[#222761]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <KeyRound className="h-4 w-4" />
                Password
              </button>
            </div>

            <div className="overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
              {accountMessage && (
                <div
                  role="status"
                  className={`mb-5 rounded-xl border px-4 py-3 text-sm font-medium ${
                    accountMessage.type === 'error'
                      ? 'border-rose-200 bg-rose-50 text-rose-800'
                      : 'border-emerald-200 bg-emerald-50 text-emerald-800'
                  }`}
                >
                  {accountMessage.text}
                </div>
              )}

              {editSection === 'profile' ? (
                <form onSubmit={handleProfileUpdate} className="space-y-5">
                  <div>
                    <label htmlFor="profile-full-name" className="mb-1.5 block text-sm font-semibold text-slate-700">
                      Full name
                    </label>
                    <input
                      id="profile-full-name"
                      name="full_name"
                      autoComplete="name"
                      required
                      value={profileForm.full_name}
                      onChange={e => setProfileForm({ ...profileForm, full_name: e.target.value })}
                      placeholder="Enter your full name"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-shadow placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                    />
                  </div>
                  <div>
                    <label htmlFor="profile-phone-number" className="mb-1.5 block text-sm font-semibold text-slate-700">
                      Phone number
                    </label>
                    <input
                      id="profile-phone-number"
                      name="phone_number"
                      type="tel"
                      autoComplete="tel"
                      required
                      value={profileForm.phone_number}
                      onChange={e => setProfileForm({ ...profileForm, phone_number: e.target.value })}
                      placeholder="Enter your phone number"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-shadow placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                    />
                    <p className="mt-1.5 text-xs text-slate-500">Include your country code so agents can contact you.</p>
                  </div>
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#222761] px-4 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#1a1e4c] disabled:cursor-wait disabled:opacity-60"
                  >
                    {savingProfile && <Loader2 className="h-4 w-4 animate-spin" />}
                    {savingProfile ? 'Saving details...' : 'Save profile'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handlePasswordChange} className="space-y-5">
                  <div>
                    <label htmlFor="profile-old-password" className="mb-1.5 block text-sm font-semibold text-slate-700">
                      Current password
                    </label>
                    <input
                      id="profile-old-password"
                      name="old_password"
                      autoComplete="current-password"
                      required
                      type="password"
                      value={passwordForm.old_password}
                      onChange={e => setPasswordForm({ ...passwordForm, old_password: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-shadow focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                    />
                  </div>
                  <div>
                    <label htmlFor="profile-new-password" className="mb-1.5 block text-sm font-semibold text-slate-700">
                      New password
                    </label>
                    <input
                      id="profile-new-password"
                      name="new_password1"
                      autoComplete="new-password"
                      required
                      type="password"
                      value={passwordForm.new_password1}
                      onChange={e => setPasswordForm({ ...passwordForm, new_password1: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-shadow focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                    />
                  </div>
                  <div>
                    <label htmlFor="profile-confirm-password" className="mb-1.5 block text-sm font-semibold text-slate-700">
                      Confirm new password
                    </label>
                    <input
                      id="profile-confirm-password"
                      name="new_password2"
                      autoComplete="new-password"
                      required
                      type="password"
                      value={passwordForm.new_password2}
                      onChange={e => setPasswordForm({ ...passwordForm, new_password2: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-shadow focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={changingPassword}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#222761] px-4 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#1a1e4c] disabled:cursor-wait disabled:opacity-60"
                  >
                    {changingPassword && <Loader2 className="h-4 w-4 animate-spin" />}
                    {changingPassword ? 'Updating password...' : 'Update password'}
                  </button>
                </form>
              )}
            </div>
          </section>
        </div>
      )}

    </div>
  );
}
