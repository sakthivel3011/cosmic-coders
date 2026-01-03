import React from 'react';
import { FiGlobe, FiMail, FiTwitter, FiFacebook, FiInstagram } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-white border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <FiGlobe className="text-white" />
              </div>
              <span className="text-xl font-bold text-green-600">GlobeTrip</span>
            </div>
            <p className="text-gray-600 text-sm">
              Plan, share, and discover amazing travel experiences around the world.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="/dashboard" className="hover:text-green-600">Dashboard</a></li>
              <li><a href="/create-trip" className="hover:text-green-600">Create Trip</a></li>
              <li><a href="/my-trips" className="hover:text-green-600">My Trips</a></li>
              <li><a href="/explore" className="hover:text-green-600">Explore</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Support</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-green-600">Help Center</a></li>
              <li><a href="#" className="hover:text-green-600">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-green-600">Terms of Service</a></li>
              <li><a href="#" className="hover:text-green-600">Contact Us</a></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Connect</h3>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-green-600 hover:text-white transition">
                <FiMail />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-green-600 hover:text-white transition">
                <FiTwitter />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-green-600 hover:text-white transition">
                <FiFacebook />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-green-600 hover:text-white transition">
                <FiInstagram />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-6 border-t text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} GlobeTrotter. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
