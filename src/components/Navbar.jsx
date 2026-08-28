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

  return (
    <div className="flex justify-center mt-8 sticky top-5 z-40">
      <header className="w-[calc(100%-5rem)] bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all duration-200 rounded-[500px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* Brand Logo & Name */}
        <Link to="/" className="flex items-center gap-2.5 group focus:outline-none">
          <img
            src="./bookit-logo.png"
            alt="BookIt Logo"
            className="h-9 w-auto object-contain transition-transform group-hover:scale-105"
          />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors ${isActive('/') ? 'text-gray-800 font-semibold' : 'text-gray-800 hover:text-gray-800'}`}
          >
            Home
          </Link>

          <Link
            to="/contact"
            className={`text-sm font-medium transition-colors ${isActive('/contact') ? 'text-gray-800 font-semibold' : 'text-gray-800 hover:text-gray-800'}`}
          >
            Listing
          </Link>

          <Link
            to="/contact"
            className={`text-sm font-medium transition-colors ${isActive('/contact') ? 'text-gray-800 font-semibold' : 'text-gray-800 hover:text-gray-800'}`}
          >
            Contact
          </Link>

          <Link
            to="/contact"
            className={`text-sm font-medium transition-colors ${isActive('/contact') ? 'text-gray-800 font-semibold' : 'text-gray-800 hover:text-gray-800'}`}
          >
            Become a vendor
          </Link>

          {isAgent && (
            <Link
              to="/post"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-sm font-semibold border border-indigo-200/60 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post Lodge</span>
            </Link>
          )}

          {/* User Auth Section */}
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 rounded-full hover:bg-slate-100 border border-slate-200/80 transition-all focus:outline-none"
              >
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}`}
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full bg-indigo-100 object-cover"
                />
                <div className="text-left hidden lg:block">
                  <p className="text-xs font-semibold text-slate-800 leading-none">{user?.name}</p>
                  <span className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded ${isAgent ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}`}>
                    {user?.role || 'Lodger'}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-500" />
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

                  {isAgent ? (
                    <>
                      <Link
                        to="/post"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-gray-800"
                      >
                        <PlusCircle className="w-4 h-4 text-indigo-500" />
                        <span>Post New Lodge</span>
                      </Link>
                      <Link
                        to="/my-listings"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-gray-800"
                      >
                        <Building className="w-4 h-4 text-indigo-500" />
                        <span>My Listings</span>
                      </Link>
                    </>
                  ) : null}

                  <Link
                    to="/profile"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-gray-800"
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
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-semibold text-white bg-[#222761] hover:bg-indigo-700 px-4 py-2 rounded-full shadow-md shadow-indigo-200 transition-all hover:shadow-indigo-300 active:scale-95"
              >
                Login
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-gray-800 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3 animate-slide-up">
          {isLoggedIn ? (
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl mb-3 border border-slate-200/60">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}`}
                alt="Avatar"
                className="w-10 h-10 rounded-full bg-indigo-100"
              />
              <div>
                <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
                <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded ${isAgent ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}`}>
                  {user?.role}
                </span>
              </div>
            </div>
          ) : null}

          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-indigo-50 hover:text-gray-800 font-medium"
          >
            <Home className="w-5 h-5 text-indigo-500" />
            <span>Home</span>
          </Link>

          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-indigo-50 hover:text-gray-800 font-medium"
          >
            <HelpCircle className="w-5 h-5 text-indigo-500" />
            <span>Contact / Support</span>
          </Link>

          {isLoggedIn ? (
            <>
              {isAgent && (
                <>
                  <Link
                    to="/post"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-indigo-700 bg-indigo-50 font-semibold"
                  >
                    <PlusCircle className="w-5 h-5 text-gray-800" />
                    <span>Post Lodge</span>
                  </Link>
                  <Link
                    to="/my-listings"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-indigo-50 hover:text-gray-800 font-medium"
                  >
                    <Building className="w-5 h-5 text-indigo-500" />
                    <span>My Listings</span>
                  </Link>
                </>
              )}

              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-indigo-50 hover:text-gray-800 font-medium"
              >
                <User className="w-5 h-5 text-indigo-500" />
                <span>Profile</span>
              </Link>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-rose-600 hover:bg-rose-50 font-semibold text-left"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-200 hover:bg-indigo-700"
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