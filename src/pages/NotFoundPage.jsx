import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Compass } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16 space-y-6 animate-fade-in">
      <div className="p-5 bg-indigo-50 rounded-full text-indigo-600">
        <Compass className="w-16 h-16 animate-pulse" />
      </div>
      <h1 className="text-4xl sm:text-6xl font-black text-slate-900">404</h1>
      <h2 className="text-xl font-bold text-slate-700">Page Not Found</h2>
      <p className="text-xs sm:text-sm text-slate-500 max-w-md">
        The page you are looking for does not exist or might have been moved. Return to the home page to continue searching for hostels.
      </p>
      <Link 
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-full shadow-lg shadow-indigo-200 transition-all"
      >
        <Home className="w-4 h-4" />
        <span>Return to Home</span>
      </Link>
    </div>
  );
}
