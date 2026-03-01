// src/components/Header.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthProvider';

import logo from '../assets/logo.png';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNavDropdownOpen, setIsNavDropdownOpen] = useState(false);

  const profileRef = useRef(null);
  const navRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsNavDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      setIsProfileDropdownOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="bg-white shadow-md py-4 px-5 md:px-8 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          {logo ? (
            <img
              src={logo}
              alt="QuickHire Logo"
              className="h-9 w-auto object-contain"
            />
          ) : (
            <div className="w-9 h-9 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
              QH
            </div>
          )}
          <span className="text-2xl font-bold text-purple-700 tracking-tight hidden sm:block">
            QuickHire
          </span>
        </Link>

        {/* Desktop: full nav + auth */}
        <div className="hidden md:flex items-center gap-10">
          <nav className="flex items-center gap-8">
            <Link
              to="/jobs"
              className="text-gray-700 hover:text-purple-700 font-medium transition-colors duration-200"
            >
              Find Jobs
            </Link>
            <Link
              to="/browse"
              className="text-gray-700 hover:text-purple-700 font-medium transition-colors duration-200"
            >
              Browse Companies
            </Link>
          </nav>

          {/* Desktop Auth */}
          {user ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-3 group transition-all duration-200 hover:scale-105 focus:outline-none"
              >
                <div className="relative">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm ring-2 ring-purple-200 ring-offset-1 transition-all group-hover:ring-purple-400"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 text-purple-700 flex items-center justify-center font-semibold shadow-sm ring-2 ring-purple-200 ring-offset-1 group-hover:ring-purple-400 transition-all">
                      {(user.displayName || user.email || '?')[0].toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="hidden lg:flex flex-col items-start">
                  <span className="font-medium text-gray-800 text-sm group-hover:text-purple-700 transition-colors">
                    {user.displayName || user.email?.split('@')[0]}
                  </span>
                </div>
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-1.5 z-50 overflow-hidden">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-5 py-2.5 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-150"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-purple-700 hover:text-purple-900 font-medium px-4 py-2 transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-5 py-2.5 rounded-lg transition-all shadow-sm hover:shadow"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile: nav dropdown + auth (same as desktop) */}
        <div className="md:hidden flex items-center gap-4">
          {/* Nav Dropdown Trigger */}
          <div className="relative" ref={navRef}>
            <button
              onClick={() => setIsNavDropdownOpen(!isNavDropdownOpen)}
              className="text-gray-700 hover:text-purple-700 focus:outline-none p-2"
              aria-label="Navigation menu"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h7"
                />
              </svg>
            </button>

            {isNavDropdownOpen && (
              <div className="absolute right-0 top-full mt-3 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-3 z-50">
                <Link
                  to="/jobs"
                  className="block px-5 py-3 text-gray-800 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                  onClick={() => setIsNavDropdownOpen(false)}
                >
                  Find Jobs
                </Link>
                <Link
                  to="/browse"
                  className="block px-5 py-3 text-gray-800 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                  onClick={() => setIsNavDropdownOpen(false)}
                >
                  Browse Companies
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Auth - same as desktop */}
          {user ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2 group focus:outline-none"
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="User"
                    className="w-9 h-9 rounded-full object-cover border-2 border-white ring-2 ring-purple-200 ring-offset-1"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-semibold ring-2 ring-purple-200 ring-offset-1">
                    {(user.displayName || user.email || '?')[0].toUpperCase()}
                  </div>
                )}
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-1.5 z-50">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-5 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-purple-700 hover:text-purple-900 font-medium text-sm"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="bg-purple-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-purple-700"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;