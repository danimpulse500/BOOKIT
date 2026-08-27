import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSaved } from '../context/SavedContext';
import { fetchListings } from '../services/api';
import ListingCard from '../components/ListingCard';
import { User, ShieldCheck, Heart, LogOut, Mail, Phone, Crown, Building, Inbox, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProfilePage() {
  const { user, isAgent, logout, changePassword, updateProfile } = useAuth();
  const { savedIds } = useSaved();

  const [savedLodges, setSavedLodges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('SAVED');
  const [profileForm, setProfileForm] = useState({ full_name: user?.name || '', phone_number: user?.phone || '' });
  const [passwordForm, setPasswordForm] = useState({ old_password: '', new_password1: '', new_password2: '' });
  const [accountMessage, setAccountMessage] = useState(null);

  useEffect(() => {
    loadSavedLodges();
  }, [savedIds]);

  const loadSavedLodges = async () => {
    setLoading(true);
    try {
      const all = await fetchListings();
      const filtered = all.filter(item => savedIds.includes(item.id));
      setSavedLodges(filtered);
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
    } catch (err) {
      setAccountMessage(err.message || 'Unable to change password.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* USER PROFILE HEADER CARD */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <img 
          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}`} 
          alt="Avatar" 
          className="w-24 h-24 rounded-full bg-white/10 p-1 border-2 border-indigo-400 shadow-lg"
        />

        <div className="flex-1 text-center sm:text-left space-y-2">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold">{user?.name}</h1>
            <span className={`inline-flex items-center gap-1 text-xs font-extrabold px-3 py-1 rounded-full ${isAgent ? 'bg-amber-400 text-amber-950' : 'bg-indigo-500 text-white'}`}>
              {isAgent && <Crown className="w-3.5 h-3.5" />}
              <span>{user?.role || 'Lodger'}</span>
            </span>
          </div>

          <p className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-slate-300">
            <Mail className="w-3.5 h-3.5 text-indigo-400" />
            <span>{user?.email}</span>
          </p>

          <p className="text-xs text-slate-400">
            Member of Book-It Student Accommodation Community
          </p>
        </div>

        <button 
          onClick={logout}
          className="px-4 py-2 bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-semibold rounded-full flex items-center gap-2 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <form onSubmit={handleProfileUpdate} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
          <h2 className="text-lg font-bold text-slate-800">Account details</h2>
          <input required value={profileForm.full_name} onChange={e => setProfileForm({ ...profileForm, full_name: e.target.value })} placeholder="Full name" className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm" />
          <input required value={profileForm.phone_number} onChange={e => setProfileForm({ ...profileForm, phone_number: e.target.value })} placeholder="Phone number" className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm" />
          <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-xl">Save profile</button>
        </form>
        <form onSubmit={handlePasswordChange} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
          <h2 className="text-lg font-bold text-slate-800">Change password</h2>
          {Object.entries(passwordForm).map(([key, value]) => <input key={key} required type="password" value={value} onChange={e => setPasswordForm({ ...passwordForm, [key]: e.target.value })} placeholder={key.replaceAll('_', ' ')} className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm" />)}
          <button className="px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl">Change password</button>
        </form>
      </div>
      {accountMessage && <p role="status" className="text-sm text-indigo-700">{accountMessage}</p>}

      {/* TABBED NAVIGATION */}
      <div className="flex items-center border-b border-slate-200 gap-6 text-sm font-bold">
        <button 
          onClick={() => setActiveTab('SAVED')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-all ${activeTab === 'SAVED' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          <Heart className="w-4 h-4" />
          <span>Saved Lodges ({savedLodges.length})</span>
        </button>

        {isAgent && (
          <Link 
            to="/my-listings"
            className="pb-3 flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors"
          >
            <Building className="w-4 h-4" />
            <span>My Agent Listings</span>
          </Link>
        )}
      </div>

      {/* SAVED LODGES GRID */}
      {loading ? (
        <div className="min-h-[30vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      ) : savedLodges.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedLodges.map(listing => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4 max-w-md mx-auto">
          <Inbox className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No Saved Lodges</h3>
          <p className="text-xs text-slate-500">You haven't bookmarked any lodges yet. Click the heart icon on any property card to save it for later.</p>
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-full hover:bg-indigo-700 shadow-md"
          >
            Browse Hostels
          </Link>
        </div>
      )}

    </div>
  );
}
