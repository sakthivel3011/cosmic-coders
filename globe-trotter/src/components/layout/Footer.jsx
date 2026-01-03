import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Globe Trotter
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Plan your trips, track your budget, and explore the world with ease.
            </p>
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
        <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
          <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
            &copy; {currentYear} Globe Trotter. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
