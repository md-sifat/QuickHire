import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthProvider';

import logo from '../assets/logo.png'; 

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      setIsDropdownOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="bg-white shadow-md py-4 px-5 md:px-8 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        <div className="flex items-center gap-8 md:gap-12">
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

          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
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
        </div>

        {/* Right side: Auth section */}
        <div className="flex items-center">
          {user ? (
            // Logged in - stylish profile trigger
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-3 group transition-all duration-200 hover:scale-105 focus:outline-none"
              >
                {/* Avatar with stylish border/ring */}
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

                <div className="hidden sm:flex flex-col items-start">
                  <span className="font-medium text-gray-800 text-sm group-hover:text-purple-700 transition-colors">
                    {user.displayName || user.email?.split('@')[0]}
                  </span>
                  {/* <span className="text-xs text-gray-500">Account</span> */}
                </div>
              </button>

              {isDropdownOpen && (
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
      </div>
    </header>
  );
};

export default Header;