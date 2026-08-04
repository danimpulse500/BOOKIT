import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchListings } from '../services/api';
import ListingCard from '../components/ListingCard';
import { Link } from 'react-router-dom';
import { Building, PlusCircle, Loader2, Inbox } from 'lucide-react';

export default function MyListingsPage() {
  const { user } = useAuth();
  const [agentListings, setAgentListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAgentListings();
  }, [user]);

  const loadAgentListings = async () => {
    setLoading(true);
    try {
      const all = await fetchListings();
      const filtered = all.filter(item => 
        item.agent_email === user?.email || 
        item.agent_name?.toLowerCase() === user?.name?.toLowerCase()
      );
      setAgentListings(filtered);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 mb-1">
            <Building className="w-6 h-6" />
            <span className="text-xs font-bold uppercase tracking-wider">My Managed Lodges</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Agent Listings</h1>
        </div>

        <Link 
          to="/post"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-full shadow-lg shadow-indigo-200 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New Lodge</span>
        </Link>
      </div>

      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      ) : agentListings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {agentListings.map(listing => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4 max-w-md mx-auto">
          <Inbox className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No Listings Posted Yet</h3>
          <p className="text-xs text-slate-500">You haven't uploaded any lodge property listings under your agent account yet.</p>
          <Link 
            to="/post"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-full shadow-md hover:bg-indigo-700"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post First Lodge</span>
          </Link>
        </div>
      )}
    </div>
  );
}
