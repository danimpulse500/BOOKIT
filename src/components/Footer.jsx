import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-[#E2E2E4] text-[#1E293B] pt-12 sm:pt-16 pb-8 sm:pb-12 font-sans border-t border-gray-300 mt-8 sm:mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-10 pb-10 sm:pb-16">
          
          {/* Brand & Description Column */}
          <div className="sm:col-span-2 lg:col-span-4 space-y-4 sm:space-y-6">
            <div className="flex items-center space-x-2">
              <img src="./bookit-logo.png" alt="BOOK IT" className="h-8 sm:h-10 w-auto" />
            </div>
            
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-sm">
              Finding and securing verified, student-friendly hostels and self-contain apartments near Unizik, Ifite, Amansea, Aroma, and Permanent Site has never been easier.
            </p>

            {/* Social Media Icons */}
            <div className="flex items-center space-x-3 pt-1">
              <a href="#" className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#1E204A] text-white flex items-center justify-center hover:opacity-90 transition-opacity">
                <FaFacebookF size={13} />
              </a>
              <a href="#" className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#1E204A] text-white flex items-center justify-center hover:opacity-90 transition-opacity">
                <FaTwitter size={13} />
              </a>
              <a href="#" className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#1E204A] text-white flex items-center justify-center hover:opacity-90 transition-opacity">
                <FaInstagram size={13} />
              </a>
              <a href="#" className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#1E204A] text-white flex items-center justify-center hover:opacity-90 transition-opacity">
                <FaLinkedinIn size={13} />
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="lg:col-span-2">
            <h4 className="text-[#1E204A] text-xs font-bold uppercase tracking-wider mb-3 sm:mb-5">Quick Links</h4>
            <ul className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm text-slate-700 font-medium">
              <li><Link to="/" className="hover:text-black transition-colors">Home</Link></li>
              <li><Link to="/listings" className="hover:text-black transition-colors">Search Listings</Link></li>
              <li><Link to="/about" className="hover:text-black transition-colors">About the Platform</Link></li>
              <li><Link to="/host-vendor" className="hover:text-black transition-colors">Become a Host / Vendor</Link></li>
              <li><Link to="/featured" className="hover:text-black transition-colors">Featured Lodges</Link></li>
            </ul>
          </div>

          {/* Booking & Trust Column */}
          <div className="lg:col-span-2">
            <h4 className="text-[#1E204A] text-xs font-bold uppercase tracking-wider mb-3 sm:mb-5">Booking & Trust</h4>
            <ul className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm text-slate-700 font-medium">
              <li><Link to="/reservations-policy" className="hover:text-black transition-colors">Reservations Policy</Link></li>
              <li><Link to="/student-discount" className="hover:text-black transition-colors">Student Discount Program</Link></li>
              <li><Link to="/tenant-verification" className="hover:text-black transition-colors">Tenant Verification</Link></li>
              <li><Link to="/support" className="hover:text-black transition-colors">Help & Support Center</Link></li>
              <li><Link to="/faqs" className="hover:text-black transition-colors">FAQs</Link></li>
            </ul>
          </div>

          {/* Contact Us Column */}
          <div className="lg:col-span-2">
            <h4 className="text-[#1E204A] text-xs font-bold uppercase tracking-wider mb-3 sm:mb-5">Contact Us</h4>
            <ul className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-slate-700 font-medium">
              <li className="flex items-start space-x-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#1E204A] text-white flex items-center justify-center shrink-0">
                  <Mail size={13} />
                </div>
                <a href="mailto:support@bookit.it.com" className="text-xs break-all hover:underline leading-tight pt-1">
                  support@bookit.it.com
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#1E204A] text-white flex items-center justify-center shrink-0">
                  <Phone size={13} />
                </div>
                <span className="text-xs leading-tight pt-1">+234 913 485 0138</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#1E204A] text-white flex items-center justify-center shrink-0">
                  <MapPin size={13} />
                </div>
                <span className="text-xs leading-tight pt-0.5">
                  Ifite Road, Near UNIZIK Gate, Awka, Anambra State
                </span>
              </li>
            </ul>
          </div>

          {/* Stay Updated Column */}
          <div className="sm:col-span-2 lg:col-span-2">
            <h4 className="text-[#1E204A] text-xs font-bold uppercase tracking-wider mb-3 sm:mb-5">Stay Updated</h4>
            <p className="text-xs text-slate-600 mb-3 sm:mb-4 leading-relaxed">
              Subscribe to our newsletter for instant alerts on new student lodge openings and price drops.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="relative flex items-center">
              <input
                type="email"
                placeholder="Enter email address"
                className="w-full bg-[#C8C8CC] text-slate-800 placeholder-slate-500 text-xs rounded-full py-2.5 sm:py-3 pl-4 pr-10 focus:outline-none focus:ring-1 focus:ring-slate-400"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="absolute right-1 w-7 h-7 bg-white text-slate-800 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors shadow-sm"
              >
                <ArrowRight size={14} />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar Divider */}
        <div className="border-t border-slate-300 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-600 font-medium gap-3 sm:gap-4 text-center sm:text-left">
          <p>© 2026 BOOK IT Student Services. All rights reserved.</p>
          <div className="flex items-center space-x-4 sm:space-x-6">
            <Link to="/privacy" className="hover:text-black transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-black transition-colors">Terms of Service</Link>
            <Link to="/sitemap" className="hover:text-black transition-colors">Sitemap</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}