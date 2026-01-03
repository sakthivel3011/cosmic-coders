import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FiMenu, FiX, FiUser, FiLogOut, FiGlobe } from 'react-icons/fi';
import './Header.css';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gt-soft sticky top-0 z-40">
      <nav className="container-responsive py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <FiGlobe className="text-3xl text-gt-primary" />
            <span className="text-xl md:text-2xl font-bold text-gt-primary">
              GlobeTrotter
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="desktop-only flex items-center space-x-8">
            {currentUser ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-gt-primary transition">
                  Dashboard
                </Link>
                <Link to="/my-trips" className="text-gray-700 hover:text-gt-primary transition">
                  My Trips
                </Link>
                <Link to="/create-trip" className="btn-primary">
                  Plan New Trip
                </Link>
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-700">
                    <FiUser className="text-xl" />
                    <span className="hidden md:inline">{currentUser.email}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                    <Link to="/profile" className="block px-4 py-3 hover:bg-gt-bg-light">
                      Profile
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-700 hover:text-gt-primary">
                  Login
                </Link>
                <Link to="/signup" className="btn-primary">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="mobile-only text-gray-700 text-2xl"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="mobile-only mt-4 bg-white border rounded-lg shadow-lg p-4 animate-fade-in">
            {currentUser ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-3 pb-3 border-b">
                  <FiUser className="text-xl text-gt-primary" />
                  <span className="font-medium">{currentUser.email}</span>
                </div>
                <Link 
                  to="/dashboard" 
                  className="block py-2 hover:text-gt-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/my-trips" 
                  className="block py-2 hover:text-gt-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Trips
                </Link>
                <Link 
                  to="/create-trip" 
                  className="block py-3 text-center btn-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Plan New Trip
                </Link>
                <Link 
                  to="/profile" 
                  className="block py-2 hover:text-gt-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <button 
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-2 text-red-600"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <Link 
                  to="/login" 
                  className="block py-2 hover:text-gt-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="block py-3 text-center btn-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;