import React from 'react';
import { Link } from 'react-router-dom';
import { FiGlobe, FiGithub, FiTwitter, FiInstagram, FiMail, FiMapPin } from 'react-icons/fi';

const Footer = () => {
  return (
<footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white mt-auto">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    {/* Main Footer Content */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
      {/* Brand Section */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
            <FiGlobe className="text-2xl text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
            GlobeTrip
          </span>
        </div>
        <p className="text-gray-400 text-sm leading-relaxed">
          Your intelligent travel companion for planning unforgettable journeys around the world.
        </p>
        <div className="flex items-center space-x-2 text-gray-400 text-sm">
          <FiMapPin className="flex-shrink-0" />
          <span>Making travel planning simple</span>
        </div>
      </div>

      {/* Quick Links */}
      <div>
        <h3 className="text-lg font-bold mb-4 text-white">Quick Links</h3>
        <ul className="space-y-3">
          <li>
            <Link to="/dashboard" className="text-gray-400 hover:text-green-400 transition-colors duration-200 text-sm flex items-center space-x-2">
              <span className="w-1 h-1 bg-green-500 rounded-full"></span>
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link to="/create-trip" className="text-gray-400 hover:text-green-400 transition-colors duration-200 text-sm flex items-center space-x-2">
              <span className="w-1 h-1 bg-green-500 rounded-full"></span>
              <span>Create Trip</span>
            </Link>
          </li>
          <li>
            <Link to="/my-trips" className="text-gray-400 hover:text-green-400 transition-colors duration-200 text-sm flex items-center space-x-2">
              <span className="w-1 h-1 bg-green-500 rounded-full"></span>
              <span>My Trips</span>
            </Link>
          </li>
          <li>
            <Link to="/profile" className="text-gray-400 hover:text-green-400 transition-colors duration-200 text-sm flex items-center space-x-2">
              <span className="w-1 h-1 bg-green-500 rounded-full"></span>
              <span>Profile</span>
            </Link>
          </li>
        </ul>
      </div>

      {/* Resources */}
      <div>
        <h3 className="text-lg font-bold mb-4 text-white">Resources</h3>
        <ul className="space-y-3">
          <li>
            <Link to="#" className="text-gray-400 hover:text-green-400 transition-colors duration-200 text-sm flex items-center space-x-2">
              <span className="w-1 h-1 bg-green-500 rounded-full"></span>
              <span>Travel Guides</span>
            </Link>
          </li>
          <li>
            <Link to="#" className="text-gray-400 hover:text-green-400 transition-colors duration-200 text-sm flex items-center space-x-2">
              <span className="w-1 h-1 bg-green-500 rounded-full"></span>
              <span>Budget Tips</span>
            </Link>
          </li>
          <li>
            <Link to="#" className="text-gray-400 hover:text-green-400 transition-colors duration-200 text-sm flex items-center space-x-2">
              <span className="w-1 h-1 bg-green-500 rounded-full"></span>
              <span>Destinations</span>
            </Link>
          </li>
          <li>
            <Link to="#" className="text-gray-400 hover:text-green-400 transition-colors duration-200 text-sm flex items-center space-x-2">
              <span className="w-1 h-1 bg-green-500 rounded-full"></span>
              <span>Help Center</span>
            </Link>
          </li>
        </ul>
      </div>

      {/* Connect Section */}
      <div>
        <h3 className="text-lg font-bold mb-4 text-white">Stay Connected</h3>
        <p className="text-gray-400 text-sm mb-4">
          Follow us on social media for travel inspiration and updates.
        </p>
        <div className="flex space-x-3 mb-4">
          <a 
            href="#" 
            className="p-3 bg-gray-800 hover:bg-green-600 rounded-lg transition-all duration-200 hover:scale-110"
            aria-label="GitHub"
          >
            <FiGithub className="text-xl" />
          </a>
          <a 
            href="#" 
            className="p-3 bg-gray-800 hover:bg-green-600 rounded-lg transition-all duration-200 hover:scale-110"
            aria-label="Twitter"
          >
            <FiTwitter className="text-xl" />
          </a>
          <a 
            href="#" 
            className="p-3 bg-gray-800 hover:bg-green-600 rounded-lg transition-all duration-200 hover:scale-110"
            aria-label="Instagram"
          >
            <FiInstagram className="text-xl" />
          </a>
          <a 
            href="mailto:support@globetrotter.com" 
            className="p-3 bg-gray-800 hover:bg-green-600 rounded-lg transition-all duration-200 hover:scale-110"
            aria-label="Email"
          >
            <FiMail className="text-xl" />
          </a>
        </div>
      </div>
    </div>

    {/* Bottom Bar */}
    <div className="pt-8 border-t border-gray-800">
      <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <p className="text-gray-500 text-sm">
          © {new Date().getFullYear()} GlobeTrip. All rights reserved.
        </p>
        <div className="flex space-x-6 text-sm">
          <Link to="#" className="text-gray-500 hover:text-green-400 transition-colors">
            Privacy Policy
          </Link>
          <Link to="#" className="text-gray-500 hover:text-green-400 transition-colors">
            Terms of Service
          </Link>
          <Link to="#" className="text-gray-500 hover:text-green-400 transition-colors">
            Cookie Policy
          </Link>
        </div>
      </div>
    </div>
  </div>
</footer>
  );
};

export default Footer;