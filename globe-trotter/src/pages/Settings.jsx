import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const Settings = () => {
  const { user, darkMode, toggleDarkMode } = useAuth();
  const [formData, setFormData] = useState({
    fullName: user?.displayName || '',
    email: user?.email || '',
    phoneNumber: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    tripReminders: true
  });
  const [profileImage, setProfileImage] = useState(null);
  const fileInputRef = React.useRef(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // Save settings logic here
    alert('Settings saved successfully!');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // Delete account logic here
      alert('Account deletion initiated');
    }
  };

  return (
    <div className={`min-h-screen py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
        : 'bg-gradient-to-br from-green-50 to-white'
    }`}>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className={`rounded-2xl shadow-lg p-6 mb-8 border-l-4 transition-colors duration-300 ${
          darkMode
            ? 'bg-gray-800 border-green-400 text-white'
            : 'bg-white border-green-500'
        }`}>
          <h1 className={`text-3xl font-bold mb-2 ${
            darkMode ? 'text-green-400' : 'text-green-800'
          }`}>Settings</h1>
          <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
            Manage your account and preferences
          </p>
        </div>

        {/* Main Settings Form */}
        <div className={`rounded-2xl shadow-lg p-8 transition-colors duration-300 ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="space-y-8">
            {/* Profile Photo */}
            <div className={`flex flex-col items-center pb-6 border-b ${
              darkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <div className="relative cursor-pointer" onClick={handleImageClick}>
                <div className={`w-32 h-32 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg overflow-hidden ${
                  darkMode
                    ? 'bg-gradient-to-br from-green-600 to-emerald-700'
                    : 'bg-gradient-to-br from-green-500 to-emerald-600'
                }`}>
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    user?.displayName?.charAt(0) || 'U'
                  )}
                </div>
                <button 
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleImageClick();
                  }}
                  className={`absolute bottom-0 right-0 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-colors ${
                    darkMode
                      ? 'bg-gray-700 text-green-400 hover:bg-gray-600'
                      : 'bg-white text-green-600 hover:bg-gray-50'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
              </div>
              <p className={`mt-3 text-sm font-medium ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>Click to upload profile photo</p>
            </div>

            {/* Full Name */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${
                darkMode ? 'text-green-400' : 'text-green-800'
              }`}>
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 focus:border-green-500 text-white'
                    : 'border-green-200 focus:border-green-500'
                }`}
                placeholder="Enter your full name"
              />
            </div>

            {/* Email ID */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${
                darkMode ? 'text-green-400' : 'text-green-800'
              }`}>
                Email ID
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors ${
                  darkMode
                    ? 'bg-gray-800 border-gray-600 text-gray-400'
                    : 'bg-gray-50 border-green-200'
                }`}
                disabled
              />
              <p className={`text-xs mt-1 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>Email cannot be changed</p>
            </div>

            {/* Phone Number */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${
                darkMode ? 'text-green-400' : 'text-green-800'
              }`}>
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 focus:border-green-500 text-white'
                    : 'border-green-200 focus:border-green-500'
                }`}
                placeholder="+1 (555) 123-4567"
              />
            </div>

            {/* Change Password Section */}
            <div className={`pt-6 border-t ${
              darkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <h3 className={`text-lg font-bold mb-4 ${
                darkMode ? 'text-green-400' : 'text-green-800'
              }`}>Change Password</h3>
              
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 focus:border-green-500 text-white'
                        : 'border-green-200 focus:border-green-500'
                    }`}
                    placeholder="Enter current password"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-semibold mb-2 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 focus:border-green-500 text-white'
                        : 'border-green-200 focus:border-green-500'
                    }`}
                    placeholder="Enter new password"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-semibold mb-2 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none transition-colors ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 focus:border-green-500 text-white'
                        : 'border-green-200 focus:border-green-500'
                    }`}
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
            </div>

            {/* Trip Reminder Notifications */}
            <div className={`flex items-center justify-between p-4 rounded-lg border-2 transition-colors ${
              darkMode
                ? 'bg-gray-700 border-gray-600'
                : 'bg-green-50 border-green-200'
            }`}>
              <div>
                <h4 className={`font-semibold ${
                  darkMode ? 'text-green-400' : 'text-green-800'
                }`}>Trip Reminder Notifications</h4>
                <p className={`text-sm ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>Receive notifications about your upcoming trips</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="tripReminders"
                  checked={formData.tripReminders}
                  onChange={handleInputChange}
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-500"></div>
              </label>
            </div>

            {/* Theme Toggle */}
            <div className={`flex items-center justify-between p-4 rounded-lg border-2 transition-colors ${
              darkMode
                ? 'bg-gray-700 border-gray-600'
                : 'bg-white border-green-200'
            }`}>
              <div>
                <h4 className={`font-semibold ${
                  darkMode ? 'text-green-400' : 'text-green-800'
                }`}>Theme</h4>
                <p className={`text-sm ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>{darkMode ? 'Dark Mode' : 'Light Mode'}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={toggleDarkMode}
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-500"></div>
              </label>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Save Changes
            </button>

            {/* Delete Account */}
            <div className={`rounded-xl p-6 border-l-4 border-red-500 transition-colors ${
              darkMode ? 'bg-gray-900' : 'bg-red-50'
            }`}>
              <h3 className="text-xl font-bold text-red-600 mb-2">Delete Account</h3>
              <p className={`mb-4 ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>Permanently delete your account and all data. This action cannot be undone.</p>
              <button 
                onClick={handleDeleteAccount}
                className="bg-red-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-600 transition-colors"
              >
                Delete My Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
