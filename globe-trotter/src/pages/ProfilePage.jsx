import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { FiUser, FiMail, FiCamera, FiSave, FiLogOut } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { currentUser, logout } = useAuth();
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    phone: '',
    bio: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        displayName: currentUser.displayName || '',
        email: currentUser.email || '',
        phone: '',
        bio: '',
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Update user profile logic here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  return (
    <div className="page-padding fade-in">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="heading-primary">My Profile</h1>
          <p className="text-gray-600">Manage your account information and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <div className="card-padded">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-32 h-32 rounded-full bg-gt-primary flex items-center justify-center text-white text-4xl mx-auto">
                    {formData.displayName?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <button className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-lg">
                    <FiCamera className="text-gray-600" />
                  </button>
                </div>
                <h2 className="text-xl font-bold text-gray-800">{formData.displayName || 'User'}</h2>
                <p className="text-gray-600">{formData.email}</p>
                <p className="text-sm text-gray-500 mt-2">Member since 2024</p>
              </div>

              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3">
                  <FiUser className="text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Account Type</p>
                    <p className="font-medium">Free Plan</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FiMail className="text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Email Status</p>
                    <p className="font-medium text-green-600">Verified</p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full mt-6 bg-red-50 text-red-600 hover:bg-red-100 font-semibold py-3 px-6 rounded-gt-lg transition-all duration-300 flex items-center justify-center gap-2"
            >
              <FiLogOut /> Logout
            </button>
          </div>

          {/* Right Column - Edit Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="card-padded">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Edit Profile</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="displayName"
                      value={formData.displayName}
                      onChange={handleChange}
                      className="input-field pl-10"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="input-field pl-10"
                      placeholder="john@example.com"
                      disabled
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="+91 9876543210"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    className="input-field min-h-[100px]"
                    placeholder="Tell us about yourself..."
                    rows="4"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Travel Preferences
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {['Adventure', 'Relaxation', 'Cultural', 'Food', 'Shopping', 'Nature'].map((pref) => (
                      <label key={pref} className="flex items-center">
                        <input type="checkbox" className="h-4 w-4 text-gt-primary" />
                        <span className="ml-2 text-sm text-gray-700">{pref}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex items-center justify-center gap-2"
                  >
                    <FiSave /> {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </form>

            {/* Account Settings */}
            <div className="card-padded mt-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Account Settings</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-sm text-gray-600">Receive updates about your trips</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gt-primary"></div>
                  </label>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium">Public Profile</h3>
                    <p className="text-sm text-gray-600">Allow others to view your trips</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gt-primary"></div>
                  </label>
                </div>

                <div className="mt-6">
                  <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                    Delete My Account
                  </button>
                  <p className="text-xs text-gray-500 mt-1">This action cannot be undone</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;