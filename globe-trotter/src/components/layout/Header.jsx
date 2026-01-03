import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  FiMenu, FiX, FiUser, FiLogOut, FiGlobe, FiMap, FiPlusCircle,
  FiCalendar, FiDollarSign, FiShare2, FiSettings
} from 'react-icons/fi';
import { MdDashboard, MdOutlineTravelExplore } from 'react-icons/md';
import toast from 'react-hot-toast';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Logout failed');
      console.error('Logout failed:', error);
    }
  };

  const navItems = [
    { title: 'Dashboard', icon: <MdDashboard />, path: '/dashboard' },
    { title: 'Create Trip', icon: <FiPlusCircle />, path: '/create-trip', badge: 'New' },
    { title: 'Explore', icon: <MdOutlineTravelExplore />, path: '/explore', badge: 'Hot' },
    { title: 'Shared Trips', icon: <FiShare2 />, path: '/shared' }
  ];

  return (
    <header className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
      <nav className="w-full px-4 sm:px-6 lg:px-8"> 
        <div className="flex items-center h-16">
          {/* Logo - Full Left */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0 mr-8">
            <FiGlobe className="text-3xl text-gt-primary" />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gt-primary">GlobeTrip</span>
              <span className="text-xs text-gray-500">Travel Planner</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          {user ? (
            <div className="hidden lg:flex items-center space-x-1 flex-1 justify-between">
              <div className="flex items-center space-x-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) => `
                      flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all
                      ${isActive 
                        ? 'bg-gt-primary text-white shadow-sm' 
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gt-primary'
                      }
                    `}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.title}</span>
                    {item.badge && (
                      <span className={`ml-1 px-2 py-0.5 text-xs rounded-full ${
                        item.badge === 'New' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                ))}
              </div>
              
              {/* Profile Dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition">
                  <FiUser className="text-xl text-gray-700" />
                  <span className="text-sm font-medium text-gray-700">Profile</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900 truncate">{user?.email}</p>
                    <p className="text-xs text-green-600">Signed in</p>
                  </div>
                  <Link to="/profile" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-gray-700">
                    <FiUser /> Profile
                  </Link>
                  <Link to="/settings" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-gray-700">
                    <FiSettings /> Settings
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-b-lg"
                  >
                    <FiLogOut /> Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="hidden lg:flex items-center space-x-4">
              <Link to="/login" className="px-4 py-2 text-gray-700 hover:text-gt-primary font-medium">
                Sign In
              </Link>
              <Link to="/signup" className="px-6 py-2 bg-gt-primary text-white rounded-lg hover:bg-gt-secondary transition">
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-gray-700 text-2xl p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 bg-white border-t border-gray-200 shadow-lg">
            {user ? (
              <div className="px-4 py-3 space-y-2">
                <div className="flex items-center gap-3 pb-3 border-b border-gray-200 mb-2">
                  <FiUser className="text-xl text-gt-primary" />
                  <div>
                    <p className="font-medium text-gray-900">{user?.email}</p>
                    <p className="text-xs text-green-600">Signed in</p>
                  </div>
                </div>
                
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) => `
                      flex items-center gap-3 px-3 py-2 rounded-lg
                      ${isActive ? 'bg-gt-primary text-white' : 'text-gray-700 hover:bg-gray-100'}
                    `}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium">{item.title}</span>
                    {item.badge && (
                      <span className={`ml-auto px-2 py-0.5 text-xs rounded-full ${
                        item.badge === 'New' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                ))}
                
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <Link 
                    to="/profile" 
                    className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FiUser className="text-lg" />
                    <span className="font-medium">Profile</span>
                  </Link>
                  <Link 
                    to="/settings" 
                    className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FiSettings className="text-lg" />
                    <span className="font-medium">Settings</span>
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <FiLogOut className="text-lg" />
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="px-4 py-3 space-y-3">
                <Link 
                  to="/login" 
                  className="block w-full py-2 px-4 text-center text-gray-700 hover:text-gt-primary font-medium border border-gray-300 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link 
                  to="/signup" 
                  className="block w-full py-2 px-4 text-center bg-gt-primary text-white rounded-lg hover:bg-gt-secondary transition"
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