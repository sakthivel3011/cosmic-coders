import React from 'react';
import { Link } from 'react-router-dom';
import { FiGlobe, FiGithub, FiTwitter, FiInstagram } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-gt-bg-dark text-white mt-16">
      <div className="container-responsive py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <FiGlobe className="text-3xl" />
              <span className="text-xl font-bold">GlobeTrip</span>
            </div>
            <p className="text-gray-300">
              Plan your perfect journey with our intelligent travel planner.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/dashboard" className="text-gray-300 hover:text-white">Dashboard</Link></li>
              <li><Link to="/create-trip" className="text-gray-300 hover:text-white">Create Trip</Link></li>
              <li><Link to="/my-trips" className="text-gray-300 hover:text-white">My Trips</Link></li>
              <li><Link to="/profile" className="text-gray-300 hover:text-white">Profile</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="#" className="text-gray-300 hover:text-white">Travel Guides</Link></li>
              <li><Link to="#" className="text-gray-300 hover:text-white">Budget Tips</Link></li>
              <li><Link to="#" className="text-gray-300 hover:text-white">Destination Ideas</Link></li>
              <li><Link to="#" className="text-gray-300 hover:text-white">Help Center</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white text-xl"><FiGithub /></a>
              <a href="#" className="text-gray-300 hover:text-white text-xl"><FiTwitter /></a>
              <a href="#" className="text-gray-300 hover:text-white text-xl"><FiInstagram /></a>
            </div>
            <p className="text-gray-300 mt-4 text-sm">
              © {new Date().getFullYear()} GlobeTrotter. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;