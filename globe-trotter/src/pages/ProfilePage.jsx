import React, { useEffect } from 'react';

export default function ProfilePage() {
  useEffect(() => {
    // Apply animation delays and chip click behavior after mount
    const elements = document.querySelectorAll('.animate-fade-in, .animate-slide-up');
    elements.forEach((el, index) => {
      // @ts-ignore - style assignment is fine here for simple animation delay
      el.style.animationDelay = `${index * 0.1}s`;
    });

    const chips = Array.from(document.querySelectorAll('.chip'));
    function onClick() {
      this.classList.toggle('bg-gt-primary');
      this.classList.toggle('text-white');
      this.classList.toggle('border-gt-primary');
    };
    chips.forEach((chip) => chip.addEventListener('click', onClick));

    return () => {
      chips.forEach((chip) => chip.removeEventListener('click', onClick));
    };
  }, []);

  return (
    <>
      <style>{`
        .gradient-bg {
            background: linear-gradient(135deg, #f4fdf6 0%, #e8f5e9 50%, #c8e6c9 100%);
        }
        .profile-avatar {
            position: relative;
            background: linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%);
        }
        .stats-card {
            background: linear-gradient(135deg, #ffffff 0%, #f9fcf9 100%);
            border-left: 4px solid;
            transition: all 0.3s ease;
        }
        .stats-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 12px 24px rgba(27, 94, 32, 0.15);
        }
        .chip {
            background: linear-gradient(135deg, #c8e6c9 0%, #e8f5e9 100%);
            border: 1px solid #81c784;
        }
        .chip:hover {
            background: linear-gradient(135deg, #81c784 0%, #c8e6c9 100%);
            color: white;
        }
        .toggle-switch {
            position: relative;
            display: inline-block;
            width: 60px;
            height: 30px;
        }
        .toggle-switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }
        .toggle-slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: .4s;
            border-radius: 34px;
        }
        .toggle-slider:before {
            position: absolute;
            content: "";
            height: 22px;
            width: 22px;
            left: 4px;
            bottom: 4px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
        }
        input:checked + .toggle-slider {
            background-color: #43a047;
        }
        input:checked + .toggle-slider:before {
            transform: translateX(30px);
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

      <div className="gradient-bg min-h-screen p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <header className="bg-white rounded-2xl shadow-gt-soft p-4 md:p-6 mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-gt-primary p-3 rounded-lg">
                  <i className="fas fa-user-circle text-white text-2xl" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gt-primary">My Profile</h1>
                  <p className="text-gray-600">Manage your account and preferences</p>
                </div>
              </div>
              <div className="flex gap-3">
                <a href="#" className="px-4 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2">
                  <i className="fas fa-home" />
                  <span className="hidden sm:inline">Dashboard</span>
                </a>
                <a href="#" className="px-4 py-2.5 bg-gt-accent text-white rounded-xl hover:bg-gt-secondary transition-colors flex items-center gap-2">
                  <i className="fas fa-edit" />
                  <span className="hidden sm:inline">Edit Profile</span>
                </a>
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-gt-card p-6 animate-fade-in">
                <div className="text-center mb-8">
                  <div className="relative inline-block">
                    <div className="profile-avatar w-32 h-32 rounded-full flex items-center justify-center text-white text-5xl mx-auto shadow-gt-avatar">
                      <span className="font-bold">JD</span>
                    </div>
                    <button className="absolute bottom-3 right-3 bg-white w-10 h-10 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors">
                      <i className="fas fa-camera text-gt-primary" />
                    </button>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mt-4">John Doe</h2>
                  <p className="text-gray-600">Travel Enthusiast</p>
                  <div className="mt-2">
                    <span className="inline-block px-3 py-1 bg-gt-soft text-gt-primary rounded-full text-sm font-medium">
                      <i className="fas fa-star mr-1" /> Pro Member
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gt-bg-section rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                      <i className="fas fa-envelope text-gt-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">john.doe@example.com</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gt-bg-section rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                      <i className="fas fa-phone text-gt-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium">+1 (555) 123-4567</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gt-bg-section rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                      <i className="fas fa-map-marker-alt text-gt-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="font-medium">New York, USA</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-gradient-to-r from-gt-primary to-gt-secondary rounded-xl text-white">
                  <h3 className="font-bold text-lg mb-2">Membership Status</h3>
                  <p className="text-sm opacity-90">Pro Plan • Expires Jun 2024</p>
                  <div className="mt-3">
                    <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
                      <div className="bg-white h-2 rounded-full" style={{ width: '75%' }} />
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span>75% used</span>
                      <span>Upgrade</span>
                    </div>
                  </div>
                </div>

                <button className="w-full mt-6 bg-red-50 text-red-600 hover:bg-red-100 font-semibold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-3">
                  <i className="fas fa-sign-out-alt" /> Logout Account
                </button>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
                <div className="stats-card rounded-2xl p-5 border-l-gt-primary">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Trips</p>
                      <p className="text-3xl font-bold text-gray-800 mt-2">12</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-gt-soft flex items-center justify-center">
                      <i className="fas fa-suitcase-rolling text-gt-primary text-xl" />
                    </div>
                  </div>
                </div>

                <div className="stats-card rounded-2xl p-5 border-l-blue-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Cities Visited</p>
                      <p className="text-3xl font-bold text-gray-800 mt-2">24</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                      <i className="fas fa-globe-americas text-blue-500 text-xl" />
                    </div>
                  </div>
                </div>

                <div className="stats-card rounded-2xl p-5 border-l-purple-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Followers</p>
                      <p className="text-3xl font-bold text-gray-800 mt-2">156</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center">
                      <i className="fas fa-users text-purple-500 text-xl" />
                    </div>
                  </div>
                </div>

                <div className="stats-card rounded-2xl p-5 border-l-yellow-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Trip Reviews</p>
                      <p className="text-3xl font-bold text-gray-800 mt-2">47</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center">
                      <i className="fas fa-star text-yellow-500 text-xl" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-gt-card p-6 mb-6 md:mb-8 animate-slide-up">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <i className="fas fa-user-edit text-gt-accent" /> Edit Profile Information
                </h2>

                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                      <div className="relative">
                        <i className="fas fa-user absolute left-3 top-3.5 text-gray-400" />
                        <input type="text" className="w-full pl-10 pr-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gt-accent focus:border-transparent" placeholder="John" defaultValue="John" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                      <div className="relative">
                        <i className="fas fa-user absolute left-3 top-3.5 text-gray-400" />
                        <input type="text" className="w-full pl-10 pr-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gt-accent focus:border-transparent" placeholder="Doe" defaultValue="Doe" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <div className="relative">
                        <i className="fas fa-envelope absolute left-3 top-3.5 text-gray-400" />
                        <input type="email" className="w-full pl-10 pr-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gt-accent focus:border-transparent" placeholder="john@example.com" defaultValue="john.doe@example.com" disabled />
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <div className="relative">
                        <i className="fas fa-phone absolute left-3 top-3.5 text-gray-400" />
                        <input type="tel" className="w-full pl-10 pr-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gt-accent focus:border-transparent" placeholder="+1 (555) 123-4567" defaultValue="+1 (555) 123-4567" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                      <div className="relative">
                        <i className="fas fa-map-marker-alt absolute left-3 top-3.5 text-gray-400" />
                        <input type="text" className="w-full pl-10 pr-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gt-accent focus:border-transparent" placeholder="City, Country" defaultValue="New York, USA" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
                      <div className="relative">
                        <i className="fas fa-calendar-alt absolute left-3 top-3.5 text-gray-400" />
                        <input type="text" className="w-full pl-10 pr-4 py-3.5 border border-gray-300 rounded-xl bg-gray-50" defaultValue="January 2023" disabled />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                    <textarea className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gt-accent focus:border-transparent" rows={4} placeholder="Tell us about yourself...">Passionate traveler exploring the world one city at a time. Love adventure, culture, and food experiences. Always planning the next journey!</textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Travel Preferences</label>
                    <div className="flex flex-wrap gap-3">
                      <span className="chip px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-all">
                        <i className="fas fa-hiking mr-2" />Adventure
                      </span>
                      <span className="chip px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-all">
                        <i className="fas fa-landmark mr-2" />Cultural
                      </span>
                      <span className="chip px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-all">
                        <i className="fas fa-utensils mr-2" />Food & Dining
                      </span>
                      <span className="chip px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-all">
                        <i className="fas fa-umbrella-beach mr-2" />Relaxation
                      </span>
                      <span className="chip px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-all">
                        <i className="fas fa-shopping-bag mr-2" />Shopping
                      </span>
                      <span className="chip px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-all">
                        <i className="fas fa-camera mr-2" />Photography
                      </span>
                    </div>
                  </div>

                  <div className="pt-6 border-t">
                    <button type="submit" className="bg-gt-primary text-white px-8 py-3.5 rounded-xl hover:bg-gt-secondary transition-colors font-semibold flex items-center gap-3">
                      <i className="fas fa-save" /> Save Changes
                    </button>
                  </div>
                </form>
              </div>

              <div className="bg-white rounded-2xl shadow-gt-card p-6 animate-slide-up">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <i className="fas fa-cog text-gt-accent" /> Account Settings
                </h2>

                <div className="space-y-6">
                  <div className="p-4 border border-gray-200 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">Email Notifications</h3>
                        <p className="text-sm text-gray-600 mt-1">Receive updates about your trips and new features</p>
                      </div>
                      <label className="toggle-switch">
                        <input type="checkbox" defaultChecked />
                        <span className="toggle-slider" />
                      </label>
                    </div>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">Public Profile</h3>
                        <p className="text-sm text-gray-600 mt-1">Allow others to view your travel profile and trips</p>
                      </div>
                      <label className="toggle-switch">
                        <input type="checkbox" />
                        <span className="toggle-slider" />
                      </label>
                    </div>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">Weekly Newsletter</h3>
                        <p className="text-sm text-gray-600 mt-1">Get travel tips and destination inspiration</p>
                      </div>
                      <label className="toggle-switch">
                        <input type="checkbox" defaultChecked />
                        <span className="toggle-slider" />
                      </label>
                    </div>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">Activity Privacy</h3>
                        <p className="text-sm text-gray-600 mt-1">Hide your recent activity from other users</p>
                      </div>
                      <label className="toggle-switch">
                        <input type="checkbox" />
                        <span className="toggle-slider" />
                      </label>
                    </div>
                  </div>

                  <div className="p-6 border-2 border-red-200 bg-red-50 rounded-xl mt-8">
                    <h3 className="font-bold text-red-800 text-lg mb-3 flex items-center gap-2">
                      <i className="fas fa-exclamation-triangle" /> Danger Zone
                    </h3>
                    <p className="text-red-600 text-sm mb-4">These actions are permanent and cannot be undone</p>
                    <div className="space-y-3">
                      <button className="w-full sm:w-auto px-6 py-3 border border-red-300 text-red-600 rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
                        <i className="fas fa-download" /> Export All Data
                      </button>
                      <button className="w-full sm:w-auto px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
                        <i className="fas fa-trash-alt" /> Delete Account
                      </button>
                    </div>
                    <p className="text-xs text-red-500 mt-4">Note: Account deletion will remove all your trips, preferences, and data permanently.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-gt-card p-6 mt-6 md:mt-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <i className="fas fa-history text-gt-accent" /> Recent Activity
            </h2>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-gt-soft flex items-center justify-center">
                  <i className="fas fa-plus text-gt-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">Created new trip: "Japan Adventure"</h4>
                  <p className="text-sm text-gray-600 mt-1">Tokyo • Kyoto • Osaka • 14 days</p>
                  <p className="text-xs text-gray-500 mt-2">2 hours ago</p>
                </div>
                <button className="text-gt-accent hover:text-gt-secondary">
                  <i className="fas fa-external-link-alt" />
                </button>
              </div>

              <div className="flex items-start gap-4 p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                  <i className="fas fa-edit text-blue-500" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">Updated profile information</h4>
                  <p className="text-sm text-gray-600 mt-1">Changed location and travel preferences</p>
                  <p className="text-xs text-gray-500 mt-2">Yesterday</p>
                </div>
                <button className="text-gt-accent hover:text-gt-secondary">
                  <i className="fas fa-external-link-alt" />
                </button>
              </div>

              <div className="flex items-start gap-4 p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                  <i className="fas fa-share-alt text-green-500" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">Shared trip "Europe 2024"</h4>
                  <p className="text-sm text-gray-600 mt-1">Shared with 3 friends via email</p>
                  <p className="text-xs text-gray-500 mt-2">3 days ago</p>
                </div>
                <button className="text-gt-accent hover:text-gt-secondary">
                  <i className="fas fa-external-link-alt" />
                </button>
              </div>
            </div>

            <div className="text-center mt-6">
              <button className="text-gt-accent hover:text-gt-secondary font-medium flex items-center justify-center gap-2 mx-auto">
                View All Activity
                <i className="fas fa-arrow-right" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}



