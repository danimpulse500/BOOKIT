import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Menu,
  X,
  User,
  PlusCircle,
  LogOut,
  Home,
  HelpCircle
} from 'lucide-react';

export default function Navbar() {
  const { user, isLoggedIn, isAgent, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const userDropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    }
    if (userDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userDropdownOpen]);

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex justify-center mt-3 sm:mt-8 sticky top-3 sm:top-5 z-40 px-2 sm:px-0">
      <header className="relative w-[calc(100%-1.5rem)] sm:w-[calc(100%-3rem)] md:w-[calc(100%-5rem)] bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-sm transition-all duration-200 rounded-full sm:rounded-[500px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">

        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group focus:outline-none shrink-0">
          <img
            src="/bookit-logo.png"
            alt="BookIt Logo"
            className="h-7 sm:h-9 w-auto object-contain transition-transform group-hover:scale-105"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/logo.png';
            }}
          />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className={`text-sm font-semibold transition-colors ${isActive('/') ? 'text-slate-900 font-bold' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Home
          </Link>

          <Link
            to="/contact"
            className={`text-sm font-medium transition-colors ${isActive('/contact') ? 'text-slate-900 font-bold' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Contact
          </Link>

          {!isAgent && (
            <Link
              to="/contact"
              className={`text-sm font-medium transition-colors ${isActive('/contact') ? 'text-slate-900 font-bold' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Become a vendor
            </Link>
          )}

          {/* User & Action Section */}
          {isLoggedIn ? (
            <div className="flex items-center gap-3 ml-2">
              {isAgent && (
                <Link
                  to="/post"
                  className="px-6 py-2 rounded-full bg-[#1E204A] hover:bg-indigo-900 text-white text-sm font-medium shadow-sm transition-all active:scale-95 whitespace-nowrap"
                >
                  Post Lodge
                </Link>
              )}

              {/* User Avatar Circle */}
              <div className="relative" ref={userDropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-slate-200/80 hover:border-slate-300 transition-all focus:outline-none active:scale-95 shadow-sm bg-slate-100 flex items-center justify-center shrink-0"
                  title={user?.name || 'User Profile'}
                  aria-expanded={userDropdownOpen}
                >
                  <img
                    src="/avatar.png"
                    alt={user?.name || 'User Profile'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/avatar.png';
                    }}
                  />
                </button>

                {/* User Dropdown matching mobile drawer style */}
                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-3 w-72 bg-white rounded-3xl shadow-2xl border border-slate-200 p-4 space-y-3 animate-slide-up z-50"
                  >
                    {/* User Info Card */}
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200/60">
                      <img
                        src="/avatar.png"
                        alt={user?.name || 'User'}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-sm shrink-0 bg-white"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/avatar.png';
                        }}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-slate-900 truncate">{user?.name || 'My Account'}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${isAgent ? 'bg-amber-100 text-amber-800' : 'bg-indigo-100 text-indigo-800'}`}>
                            {user?.role || (isAgent ? 'Agent' : 'Lodger')}
                          </span>
                          <span className="text-[11px] text-slate-400 truncate">{user?.email}</span>
                        </div>
                      </div>
                    </div>

                    {/* Navigation Items */}
                    <div className="space-y-1">
                      <Link
                        to="/"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 font-medium transition-colors text-sm"
                      >
                        <Home className="w-4 h-4 text-slate-500" />
                        <span>Home</span>
                      </Link>

                      <Link
                        to="/contact"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 font-medium transition-colors text-sm"
                      >
                        <HelpCircle className="w-4 h-4 text-slate-500" />
                        <span>Contact</span>
                      </Link>
                    </div>

                    <div className="pt-2 border-t border-slate-100 space-y-1">
                      {isAgent && (
                        <Link
                          to="/post"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 font-medium transition-colors text-sm"
                        >
                          <PlusCircle className="w-4 h-4 text-slate-500" />
                          <span>Post Lodge</span>
                        </Link>
                      )}

                      <Link
                        to="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 font-medium transition-colors text-sm"
                      >
                        <User className="w-4 h-4 text-slate-500" />
                        <span>Profile</span>
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-rose-600 hover:bg-rose-50 font-semibold text-left transition-colors text-sm"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-semibold text-white bg-[#1E204A] hover:bg-indigo-900 px-6 py-2 rounded-full shadow-md transition-all active:scale-95"
              >
                Login
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation Menu"
          className="md:hidden p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 focus:outline-none transition-colors"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 shadow-xl rounded-3xl p-4 space-y-3 z-50 animate-slide-up">
          {isLoggedIn ? (
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200/60">
              <img
                src="/avatar.png"
                alt={user?.name || 'User'}
                className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-sm shrink-0 bg-white"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/avatar.png';
                }}
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-slate-900 truncate">{user?.name || 'My Account'}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${isAgent ? 'bg-amber-100 text-amber-800' : 'bg-indigo-100 text-indigo-800'}`}>
                    {user?.role || (isAgent ? 'Agent' : 'Lodger')}
                  </span>
                  <span className="text-[11px] text-slate-400 truncate">{user?.email}</span>
                </div>
              </div>
            </div>
          ) : null}

          <div className="space-y-1">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 font-medium transition-colors"
            >
              <Home className="w-5 h-5" />
              <span>Home</span>
            </Link>

            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 font-medium transition-colors"
            >
              <HelpCircle className="w-5 h-5" />
              <span>Contact</span>
            </Link>
          </div>

          {isLoggedIn ? (
            <div className="pt-2 border-t border-slate-100 space-y-1">
              {isAgent && (
                <>
                  {/* <Link
                    to="/post"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[#1E204A] bg-indigo-50 font-semibold transition-colors"
                  >
                    <PlusCircle className="w-5 h-5 text-[#1E204A]" />
                    <span>Post Lodge</span>
                  </Link> */}
                  {/* <Link
                    to="/my-listings"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 font-medium transition-colors"
                  >
                    <Building className="w-5 h-5" />
                    <span>My Listings</span>
                  </Link> */}
                </>
              )}

              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 font-medium transition-colors"
              >
                <User className="w-5 h-5" />
                <span>Profile</span>
              </Link>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-rose-600 hover:bg-rose-50 font-semibold text-left transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-colors text-sm"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl bg-[#1E204A] text-white font-semibold hover:bg-indigo-700 transition-colors text-sm"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
      </header>
    </div>
  );
}