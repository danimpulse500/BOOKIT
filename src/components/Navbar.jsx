import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Menu,
  X,
  User,
  PlusCircle,
  LogOut,
  Home,
  HelpCircle,
  Bookmark,
  Building,
  ChevronDown,
  ShieldAlert
} from 'lucide-react';

export default function Navbar() {
  const { user, isLoggedIn, isAgent, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'D';

  return (
    <div className="flex justify-center mt-3 sm:mt-8 sticky top-3 sm:top-5 z-40 px-2 sm:px-0">
      <header className="relative w-[calc(100%-1.5rem)] sm:w-[calc(100%-3rem)] md:w-[calc(100%-5rem)] bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-sm transition-all duration-200 rounded-full sm:rounded-[500px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">

        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group focus:outline-none shrink-0">
          <img
            src="./bookit-logo.png"
            alt="BookIt Logo"
            className="h-7 sm:h-9 w-auto object-contain transition-transform group-hover:scale-105"
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

          {isAgent ? (
            <>
              <Link
                to="/my-listings"
                className={`text-sm font-medium transition-colors ${isActive('/my-listings') ? 'text-slate-900 font-bold' : 'text-slate-500 hover:text-slate-900'}`}
              >
                My Listings
              </Link>
              <Link
                to="/contact"
                className={`text-sm font-medium transition-colors ${isActive('/contact') ? 'text-slate-900 font-bold' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Contact
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/contact"
                className={`text-sm font-medium transition-colors ${isActive('/contact') ? 'text-slate-900 font-bold' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Contact
              </Link>
              <Link
                to="/contact"
                className={`text-sm font-medium transition-colors ${isActive('/contact') ? 'text-slate-900 font-bold' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Become a vendor
              </Link>
            </>
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

              {/* User Initial Circle Avatar */}
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="w-9 h-9 rounded-full bg-[#F3F4F6] text-slate-700 font-bold flex items-center justify-center border border-slate-200/80 hover:border-slate-300 transition-all focus:outline-none text-sm"
                  title={user?.name || 'User Profile'}
                >
                  {userInitial}
                </button>

                {/* User Dropdown */}
                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 animate-fade-in z-50"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-400">Signed in as</p>
                      <p className="text-sm font-semibold text-slate-800 truncate">{user?.email}</p>
                    </div>

                    {isAgent && (
                      <>
                        <Link
                          to="/post"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-slate-900"
                        >
                          <PlusCircle className="w-4 h-4 text-indigo-500" />
                          <span>Post New Lodge</span>
                        </Link>
                        <Link
                          to="/my-listings"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-slate-900"
                        >
                          <Building className="w-4 h-4 text-indigo-500" />
                          <span>My Listings</span>
                        </Link>
                      </>
                    )}

                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-slate-900"
                    >
                      <User className="w-4 h-4 text-indigo-500" />
                      <span>Profile & Saved</span>
                    </Link>

                    <div className="border-t border-slate-100 my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 text-left font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
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
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}`}
                alt="Avatar"
                className="w-10 h-10 rounded-full bg-indigo-100"
              />
              <div>
                <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
                <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded ${isAgent ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}`}>
                  {user?.role || 'Lodger'}
                </span>
              </div>
            </div>
          ) : null}

          <div className="space-y-1">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 font-medium transition-colors"
            >
              <Home className="w-5 h-5 text-indigo-500" />
              <span>Home</span>
            </Link>

            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 font-medium transition-colors"
            >
              <HelpCircle className="w-5 h-5 text-indigo-500" />
              <span>Contact / Support</span>
            </Link>
          </div>

          {isLoggedIn ? (
            <div className="pt-2 border-t border-slate-100 space-y-1">
              {isAgent && (
                <>
                  <Link
                    to="/post"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-indigo-700 bg-indigo-50 font-semibold transition-colors"
                  >
                    <PlusCircle className="w-5 h-5 text-indigo-600" />
                    <span>Post Lodge</span>
                  </Link>
                  <Link
                    to="/my-listings"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 font-medium transition-colors"
                  >
                    <Building className="w-5 h-5 text-indigo-500" />
                    <span>My Listings</span>
                  </Link>
                </>
              )}

              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 font-medium transition-colors"
              >
                <User className="w-5 h-5 text-indigo-500" />
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
                className="w-full text-center py-2.5 rounded-xl bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-200 hover:bg-indigo-700 transition-colors text-sm"
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