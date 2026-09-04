import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Plus } from 'lucide-react';

export default function FloatingAddLodgeBtn() {
  const { isLoggedIn, isAgent } = useAuth();
  const location = useLocation();

  // Only visible if logged in user is an agent
  if (!isLoggedIn || !isAgent) {
    return null;
  }

  // Do not show on the post lodge page itself
  if (location.pathname === '/post') {
    return null;
  }

  return (
    <Link
      to="/post"
      title="Add New Lodge"
      aria-label="Add New Lodge"
      className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 flex items-center justify-center bg-[#222761] hover:bg-[#1a1e4c] text-white shadow-xl shadow-indigo-950/25 active:scale-95 transition-all duration-300 group w-12 h-12 rounded-full sm:w-auto sm:px-5 sm:py-3 sm:rounded-full"
    >
      <Plus className="w-6 h-6 sm:w-5 sm:h-5 stroke-[2.5] transition-transform group-hover:rotate-90 duration-200 shrink-0" />
      <span className="hidden sm:inline font-bold text-sm tracking-tight whitespace-nowrap ml-2">
        Add New Lodge
      </span>
    </Link>
  );
}
