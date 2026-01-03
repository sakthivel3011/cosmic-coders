import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  FiHome,
  FiMap,
  FiPlusCircle,
  FiCalendar,
  FiDollarSign,
  FiUser,
  FiSettings,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
  FiGlobe,
  FiTrendingUp,
  FiShare2,
  FiHelpCircle,
  FiMoon,
  FiSun
} from 'react-icons/fi';
import { 
  MdDashboard,
  MdOutlineTravelExplore 
} from 'react-icons/md';
import toast from 'react-hot-toast';

const Sidebar = ({ isMobile = false, onClose }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
      if (isMobile && onClose) onClose();
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
      toast.success('Dark mode enabled');
    } else {
      document.documentElement.classList.remove('dark');
      toast.success('Light mode enabled');
    }
  };

  const navItems = [
    {
      title: 'Dashboard',
      icon: <MdDashboard className="w-5 h-5" />,
      path: '/dashboard',
      badge: null
    },
    {
      title: 'My Trips',
      icon: <FiMap className="w-5 h-5" />,
      path: '/my-trips',
      badge: null
    },
    {
      title: 'Create Trip',
      icon: <FiPlusCircle className="w-5 h-5" />,
      path: '/create-trip',
      badge: 'New',
      variant: 'primary'
    },
    {
      title: 'Itinerary',
      icon: <FiCalendar className="w-5 h-5" />,
      path: '/itinerary',
      badge: null
    },
    {
      title: 'Budget',
      icon: <FiDollarSign className="w-5 h-5" />,
      path: '/budget',
      badge: null
    },
    {
      title: 'Explore',
      icon: <MdOutlineTravelExplore className="w-5 h-5" />,
      path: '/explore',
      badge: 'Hot',
      variant: 'danger'
    },
    {
      title: 'Shared Trips',
      icon: <FiShare2 className="w-5 h-5" />,
      path: '/shared',
      badge: null
    }
  ];

  const bottomItems = [
    {
      title: 'Profile',
      icon: <FiUser className="w-5 h-5" />,
      path: '/profile'
    },
    {
      title: 'Settings',
      icon: <FiSettings className="w-5 h-5" />,
      path: '/settings'
    },
    {
      title: 'Help',
      icon: <FiHelpCircle className="w-5 h-5" />,
      path: '/help'
    }
  ];

  const NavLinkItem = ({ item, onClick }) => (
    <NavLink
      to={item.path}
      onClick={onClick}
      className={({ isActive }) => `
        flex items-center px-4 py-3 my-1 rounded-lg transition-all duration-200
        ${isActive 
          ? 'bg-gt-primary text-white shadow-md' 
          : 'text-gray-700 hover:bg-gt-soft hover:text-gt-primary'
        }
        ${collapsed ? 'justify-center' : ''}
      `}
    >
      <span className="flex-shrink-0">
        {item.icon}
      </span>
      {!collapsed && (
        <>
          <span className="ml-3 font-medium truncate">{item.title}</span>
          {item.badge && (
            <span className={`ml-auto px-2 py-1 text-xs rounded-full ${
              item.variant === 'primary' 
                ? 'bg-blue-100 text-blue-800' 
                : item.variant === 'danger'
                ? 'bg-red-100 text-red-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {item.badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  );

  return (
    <aside className={`
      ${isMobile 
        ? 'fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out bg-white shadow-xl' 
        : 'hidden lg:flex flex-col h-screen sticky top-0'
      }
      ${collapsed ? 'w-20' : 'w-64'}
      bg-white border-r border-gray-200
    `}>
      {/* Logo */}
      <div className={`flex items-center px-4 py-5 border-b ${collapsed ? 'justify-center' : 'justify-between'}`}>
        <div className="flex items-center space-x-3">
          <FiGlobe className="text-2xl text-gt-primary" />
          {!collapsed && (
            <div>
              <h1 className="text-xl font-bold text-gt-primary">GlobeTrotter</h1>
              <p className="text-xs text-gray-500">Travel Planner</p>
            </div>
          )}
        </div>
        
        {!isMobile && !collapsed && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-gray-100"
            title={collapsed ? 'Expand' : 'Collapse'}
          >
            {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
          </button>
        )}
      </div>

      {/* User Profile */}
      <div className={`p-4 border-b ${collapsed ? 'text-center' : ''}`}>
        {currentUser ? (
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3'}`}>
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-gt-primary flex items-center justify-center text-white font-bold">
                {currentUser.email?.charAt(0).toUpperCase() || 'U'}
              </div>
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">
                  {currentUser.displayName || currentUser.email?.split('@')[0] || 'User'}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {currentUser.email}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className={`${collapsed ? 'text-center' : ''}`}>
            <p className="text-sm text-gray-500">Not signed in</p>
            {!collapsed && (
              <button
                onClick={() => navigate('/login')}
                className="mt-2 w-full btn-primary py-2 text-sm"
              >
                Sign In
              </button>
            )}
          </div>
        )}
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <div className="space-y-1">
          {navItems.map((item, index) => (
            <NavLinkItem 
              key={index} 
              item={item}
              onClick={() => isMobile && onClose && onClose()}
            />
          ))}
        </div>

        {/* Divider */}
        <div className={`my-6 ${collapsed ? 'mx-2' : 'mx-4'}`}>
          <div className="border-t border-gray-200"></div>
        </div>

        {/* Bottom Navigation */}
        <div className="space-y-1">
          {bottomItems.map((item, index) => (
            <NavLinkItem 
              key={index} 
              item={item}
              onClick={() => isMobile && onClose && onClose()}
            />
          ))}
        </div>
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-200 space-y-3">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className={`flex items-center w-full px-4 py-3 rounded-lg transition ${
            darkMode 
              ? 'bg-gray-800 text-white' 
              : 'text-gray-700 hover:bg-gray-100'
          } ${collapsed ? 'justify-center' : ''}`}
        >
          {darkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
          {!collapsed && (
            <span className="ml-3 font-medium">
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </span>
          )}
        </button>

        {/* Logout Button */}
        {currentUser && (
          <button
            onClick={handleLogout}
            className={`flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            <FiLogOut className="w-5 h-5" />
            {!collapsed && <span className="ml-3 font-medium">Logout</span>}
          </button>
        )}

        {/* Stats (Only when expanded) */}
        {!collapsed && !isMobile && (
          <div className="pt-3 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-center p-2 bg-gt-bg-section rounded">
                <div className="text-lg font-bold text-gt-primary">12</div>
                <div className="text-xs text-gray-500">Trips</div>
              </div>
              <div className="text-center p-2 bg-gt-bg-section rounded">
                <div className="text-lg font-bold text-gt-primary">₹1.2L</div>
                <div className="text-xs text-gray-500">Saved</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Close Button */}
      {isMobile && (
        <button
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700"
        >
          <FiChevronLeft className="w-6 h-6" />
        </button>
      )}
    </aside>
  );
};

// Mobile Sidebar Wrapper
export const MobileSidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}
      <div className={`
        fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar isMobile onClose={onClose} />
      </div>
    </>
  );
};

export default Sidebar;