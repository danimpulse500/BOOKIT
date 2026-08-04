import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand Info */}
        <div className="space-y-4 md:col-span-2">
          <img src="/logo.png" alt="BookIt" className="h-8 w-auto brightness-200 invert" />
          <p className="text-slate-400 text-sm max-w-md leading-relaxed">
            Book-It is the #1 student housing platform simplifying hostel discovery, verified agent bookings, and affordable lodge search across campus locations.
          </p>
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Book-It. All rights reserved. Student housing made easy.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">Quick Links</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/" className="hover:text-indigo-400 transition-colors">Find Hostels</Link></li>
            <li><Link to="/contact" className="hover:text-indigo-400 transition-colors">Contact Support</Link></li>
            <li><Link to="/signup" className="hover:text-indigo-400 transition-colors">Register as Agent</Link></li>
            <li><Link to="/login" className="hover:text-indigo-400 transition-colors">Account Login</Link></li>
          </ul>
        </div>

        {/* Popular Locations */}
        <div>
          <h4 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">Campus Zones</h4>
          <ul className="space-y-2.5 text-sm text-slate-400">
            <li>Ifite & Ifite-Up</li>
            <li>Amansea Campus Road</li>
            <li>Temp Site & Aroma</li>
            <li>Unizik Gate & Okpuno</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
