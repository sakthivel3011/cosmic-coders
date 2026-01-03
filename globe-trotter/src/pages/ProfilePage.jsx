import React, { useState, useEffect } from 'react';

const ProfilePage = () => {
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, USA',
    bio: 'Passionate traveler exploring the world one city at a time. Love adventure, culture, and food experiences. Always planning the next journey!',
    memberSince: 'January 2023'
  });

  const [settings, setSettings] = useState({
    emailNotifications: true,
    publicProfile: false,
    weeklyNewsletter: true,
    activityPrivacy: false
  });

  const [travelPreferences, setTravelPreferences] = useState([
    { id: 1, name: 'Adventure', icon: 'fa-hiking', selected: true },
    { id: 2, name: 'Cultural', icon: 'fa-landmark', selected: true },
    { id: 3, name: 'Food & Dining', icon: 'fa-utensils', selected: true },
    { id: 4, name: 'Relaxation', icon: 'fa-umbrella-beach', selected: false },
    { id: 5, name: 'Shopping', icon: 'fa-shopping-bag', selected: false },
    { id: 6, name: 'Photography', icon: 'fa-camera', selected: true }
  ]);

  const [recentActivities] = useState([
    {
      id: 1,
      icon: 'fa-plus',
      title: 'Created new trip: "Japan Adventure"',
      description: 'Tokyo • Kyoto • Osaka • 14 days',
      time: '2 hours ago'
    },
    {
      id: 2,
      icon: 'fa-edit',
      title: 'Updated profile information',
      description: 'Changed location and travel preferences',
      time: 'Yesterday'
    },
    {
      id: 3,
      icon: 'fa-share-alt',
      title: 'Shared trip "Europe 2024"',
      description: 'Shared with 3 friends via email',
      time: '3 days ago'
    }
  ]);

  const [stats] = useState([
    { id: 1, label: 'Total Trips', value: '12', icon: 'fa-suitcase-rolling', color: 'gt-primary', bgColor: 'gt-soft' },
    { id: 2, label: 'Cities Visited', value: '24', icon: 'fa-globe-americas', color: 'blue-500', bgColor: 'blue-50' },
    { id: 3, label: 'Followers', value: '156', icon: 'fa-users', color: 'purple-500', bgColor: 'purple-50' },
    { id: 4, label: 'Trip Reviews', value: '47', icon: 'fa-star', color: 'yellow-500', bgColor: 'yellow-50' }
  ]);

  // Custom styles
  const styles = {
    gradientBg: {
      background: 'linear-gradient(135deg, #f4fdf6 0%, #e8f5e9 50%, #c8e6c9 100%)',
      minHeight: '100vh'
    },
    profileAvatar: {
      background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)'
    }
  };

  useEffect(() => {
    // Add animation delays on mount
    const elements = document.querySelectorAll('.animate-fade-in, .animate-slide-up');
    elements.forEach((el, index) => {
      el.style.animationDelay = `${index * 0.1}s`;
    });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSettingToggle = (settingName) => {
    setSettings(prev => ({
      ...prev,
      [settingName]: !prev[settingName]
    }));
  };

  const togglePreference = (id) => {
    setTravelPreferences(prev =>
      prev.map(pref =>
        pref.id === id ? { ...pref, selected: !pref.selected } : pref
      )
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Profile updated:', formData);
    // In a real app, you would make an API call here
    alert('Profile updated successfully!');
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      console.log('User logged out');
      // In a real app, you would call your authentication logout function
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      console.log('Account deletion requested');
      // In a real app, you would make an API call to delete account
    }
  };

  const handleExportData = () => {
    console.log('Exporting user data...');
    // In a real app, you would generate and download data
    alert('Data export started. You will receive an email shortly.');
  };

  return (
    <div className="min-h-screen p-4 md:p-6" style={styles.gradientBg}>
      {/* Main Container */}
      <div className="max-w-7xl mx-auto">
        {/* Header with Navigation */}
        <header className="bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.08)] p-4 md:p-6 mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-[#1b5e20] p-3 rounded-lg">
                <i className="fas fa-user-circle text-white text-2xl"></i>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-[#1b5e20]">My Profile</h1>
                <p className="text-gray-600">Manage your account and preferences</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2">
                <i className="fas fa-home"></i>
                <span className="hidden sm:inline">Dashboard</span>
              </button>
              <a href="#edit-form" className="px-4 py-2.5 bg-[#43a047] text-white rounded-xl hover:bg-[#2e7d32] transition-colors flex items-center gap-2">
                <i className="fas fa-edit"></i>
                <span className="hidden sm:inline">Edit Profile</span>
              </a>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-[0_6px_20px_rgba(27,94,32,0.1)] p-6 animate-fade-in">
              {/* Profile Avatar */}
              <div className="text-center mb-8">
                <div className="relative inline-block">
                  <div className="w-32 h-32 rounded-full flex items-center justify-center text-white text-5xl mx-auto shadow-[0_8px_32px_rgba(27,94,32,0.2)]" style={styles.profileAvatar}>
                    <span className="font-bold">JD</span>
                  </div>
                  <button className="absolute bottom-3 right-3 bg-white w-10 h-10 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors">
                    <i className="fas fa-camera text-[#1b5e20]"></i>
                  </button>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mt-4">John Doe</h2>
                <p className="text-gray-600">Travel Enthusiast</p>
                <div className="mt-2">
                  <span className="inline-block px-3 py-1 bg-[#c8e6c9] text-[#1b5e20] rounded-full text-sm font-medium">
                    <i className="fas fa-star mr-1"></i> Pro Member
                  </span>
                </div>
              </div>

              {/* Profile Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-[#e8f5e9] rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                    <i className="fas fa-envelope text-[#43a047]"></i>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{formData.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-[#e8f5e9] rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                    <i className="fas fa-phone text-[#43a047]"></i>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{formData.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-[#e8f5e9] rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                    <i className="fas fa-map-marker-alt text-[#43a047]"></i>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium">{formData.location}</p>
                  </div>
                </div>
              </div>

              {/* Membership Status */}
              <div className="mt-8 p-4 bg-gradient-to-r from-[#1b5e20] to-[#2e7d32] rounded-xl text-white">
                <h3 className="font-bold text-lg mb-2">Membership Status</h3>
                <p className="text-sm opacity-90">Pro Plan • Expires Jun 2024</p>
                <div className="mt-3">
                  <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
                    <div className="bg-white h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span>75% used</span>
                    <span className="cursor-pointer hover:underline">Upgrade</span>
                  </div>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full mt-6 bg-red-50 text-red-600 hover:bg-red-100 font-semibold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-3"
              >
                <i className="fas fa-sign-out-alt"></i>
                Logout Account
              </button>
            </div>
          </div>

          {/* Right Column - Main Content */}
          <div className="lg:col-span-3">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
              {stats.map((stat) => (
                <div
                  key={stat.id}
                  className="bg-gradient-to-b from-white to-[#f9fcf9] rounded-2xl p-5 border-l-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(27,94,32,0.15)]"
                  style={{ borderLeftColor: stat.color === 'gt-primary' ? '#1b5e20' : stat.color }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                      <p className="text-3xl font-bold text-gray-800 mt-2">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-full ${stat.bgColor} flex items-center justify-center`}>
                      <i className={`fas ${stat.icon} text-xl`} style={{ color: stat.color === 'gt-primary' ? '#1b5e20' : stat.color }}></i>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Edit Profile Form */}
            <div id="edit-form" className="bg-white rounded-2xl shadow-[0_6px_20px_rgba(27,94,32,0.1)] p-6 mb-6 md:mb-8 animate-slide-up">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <i className="fas fa-user-edit text-[#43a047]"></i>
                Edit Profile Information
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <div className="relative">
                      <i className="fas fa-user absolute left-3 top-3.5 text-gray-400"></i>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#43a047] focus:border-transparent"
                        placeholder="John"
                      />
                    </div>
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <div className="relative">
                      <i className="fas fa-user absolute left-3 top-3.5 text-gray-400"></i>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#43a047] focus:border-transparent"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <div className="relative">
                      <i className="fas fa-envelope absolute left-3 top-3.5 text-gray-400"></i>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#43a047] focus:border-transparent"
                        placeholder="john@example.com"
                        disabled
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <div className="relative">
                      <i className="fas fa-phone absolute left-3 top-3.5 text-gray-400"></i>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#43a047] focus:border-transparent"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <div className="relative">
                      <i className="fas fa-map-marker-alt absolute left-3 top-3.5 text-gray-400"></i>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#43a047] focus:border-transparent"
                        placeholder="City, Country"
                      />
                    </div>
                  </div>

                  {/* Member Since */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
                    <div className="relative">
                      <i className="fas fa-calendar-alt absolute left-3 top-3.5 text-gray-400"></i>
                      <input
                        type="text"
                        value={formData.memberSince}
                        className="w-full pl-10 pr-4 py-3.5 border border-gray-300 rounded-xl bg-gray-50"
                        disabled
                      />
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#43a047] focus:border-transparent"
                    rows="4"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                {/* Travel Preferences */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Travel Preferences</label>
                  <div className="flex flex-wrap gap-3">
                    {travelPreferences.map((pref) => (
                      <button
                        key={pref.id}
                        type="button"
                        onClick={() => togglePreference(pref.id)}
                        className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-all border ${pref.selected
                            ? 'bg-[#1b5e20] text-white border-[#1b5e20]'
                            : 'bg-gradient-to-b from-[#c8e6c9] to-[#e8f5e9] text-gray-800 border-[#81c784]'
                          } hover:bg-gradient-to-b hover:from-[#81c784] hover:to-[#c8e6c9] hover:text-white hover:border-[#1b5e20]`}
                      >
                        <i className={`fas ${pref.icon} mr-2`}></i>
                        {pref.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Save Button */}
                <div className="pt-6 border-t">
                  <button
                    type="submit"
                    className="bg-[#1b5e20] text-white px-8 py-3.5 rounded-xl hover:bg-[#2e7d32] transition-colors font-semibold flex items-center gap-3"
                  >
                    <i className="fas fa-save"></i>
                    Save Changes
                  </button>
                </div>
              </form>
            </div>

            {/* Account Settings */}
            <div className="bg-white rounded-2xl shadow-[0_6px_20px_rgba(27,94,32,0.1)] p-6 animate-slide-up">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <i className="fas fa-cog text-[#43a047]"></i>
                Account Settings
              </h2>

              <div className="space-y-6">
                {/* Notification Settings */}
                <div className="p-4 border border-gray-200 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">Email Notifications</h3>
                      <p className="text-sm text-gray-600 mt-1">Receive updates about your trips and new features</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.emailNotifications}
                        onChange={() => handleSettingToggle('emailNotifications')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#43a047]"></div>
                    </label>
                  </div>
                </div>

                {/* Public Profile */}
                <div className="p-4 border border-gray-200 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">Public Profile</h3>
                      <p className="text-sm text-gray-600 mt-1">Allow others to view your travel profile and trips</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.publicProfile}
                        onChange={() => handleSettingToggle('publicProfile')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#43a047]"></div>
                    </label>
                  </div>
                </div>

                {/* Newsletter */}
                <div className="p-4 border border-gray-200 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">Weekly Newsletter</h3>
                      <p className="text-sm text-gray-600 mt-1">Get travel tips and destination inspiration</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.weeklyNewsletter}
                        onChange={() => handleSettingToggle('weeklyNewsletter')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#43a047]"></div>
                    </label>
                  </div>
                </div>

                {/* Privacy Settings */}
                <div className="p-4 border border-gray-200 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">Activity Privacy</h3>
                      <p className="text-sm text-gray-600 mt-1">Hide your recent activity from other users</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.activityPrivacy}
                        onChange={() => handleSettingToggle('activityPrivacy')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#43a047]"></div>
                    </label>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="p-6 border-2 border-red-200 bg-red-50 rounded-xl mt-8">
                  <h3 className="font-bold text-red-800 text-lg mb-3 flex items-center gap-2">
                    <i className="fas fa-exclamation-triangle"></i>
                    Danger Zone
                  </h3>
                  <p className="text-red-600 text-sm mb-4">These actions are permanent and cannot be undone</p>
                  <div className="space-y-3">
                    <button
                      onClick={handleExportData}
                      className="w-full sm:w-auto px-6 py-3 border border-red-300 text-red-600 rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                    >
                      <i className="fas fa-download"></i>
                      Export All Data
                    </button>
                    <button
                      onClick={handleDeleteAccount}
                      className="w-full sm:w-auto px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <i className="fas fa-trash-alt"></i>
                      Delete Account
                    </button>
                  </div>
                  <p className="text-xs text-red-500 mt-4">Note: Account deletion will remove all your trips, preferences, and data permanently.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-[0_6px_20px_rgba(27,94,32,0.1)] p-6 mt-6 md:mt-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <i className="fas fa-history text-[#43a047]"></i>
            Recent Activity
          </h2>

          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-[#c8e6c9] flex items-center justify-center">
                  <i className={`fas ${activity.icon} text-[#1b5e20]`}></i>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">{activity.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-2">{activity.time}</p>
                </div>
                <button className="text-[#43a047] hover:text-[#2e7d32]">
                  <i className="fas fa-external-link-alt"></i>
                </button>
              </div>
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center mt-6">
            <button className="text-[#43a047] hover:text-[#2e7d32] font-medium flex items-center justify-center gap-2 mx-auto">
              View All Activity
              <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
       
        @keyframes slideUp {
          from { transform: translateY(10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
       
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
       
        .animate-slide-up {
          animation: slideUp 0.3s ease-out;
        }
       
        ::-webkit-scrollbar {
          width: 8px;
        }
       
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
       
        ::-webkit-scrollbar-thumb {
          background: #c8e6c9;
          border-radius: 10px;
        }
       
        ::-webkit-scrollbar-thumb:hover {
          background: #81c784;
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;