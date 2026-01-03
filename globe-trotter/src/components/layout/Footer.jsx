import React from 'react';
import { Link } from 'react-router-dom';
import { FiGlobe, FiMapPin, FiMail, FiPhone } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

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
            GlobeTrotter
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
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="/dashboard" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="/explore" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm">
                  Explore
                </a>
              </li>
              <li>
                <a href="/profile" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm">
                  Profile
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
              Support
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
              Follow Us
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm">
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm">
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

    {/* Bottom Bar */}
    <div className="pt-8 border-t border-gray-800">
      <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <p className="text-gray-500 text-sm">
          © {new Date().getFullYear()} GlobeTrotter. All rights reserved.
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
