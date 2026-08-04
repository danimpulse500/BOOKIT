import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSaved } from '../context/SavedContext';
import { fetchListings } from '../services/api';
import ListingCard from '../components/ListingCard';
import { User, ShieldCheck, Heart, LogOut, Mail, Phone, Crown, Building, Inbox, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProfilePage() {
  const { user, isAgent, logout } = useAuth();
  const { savedIds } = useSaved();

  const [savedLodges, setSavedLodges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('SAVED');

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
