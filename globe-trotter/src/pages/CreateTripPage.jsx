import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTrips } from '../hooks/useTrips';
import { FiCalendar, FiMap, FiDollarSign, FiGlobe, FiFileText, FiCheckCircle, FiArrowRight, FiUsers, FiPhone } from 'react-icons/fi';
import { MdFlightTakeoff } from 'react-icons/md';
import toast from 'react-hot-toast';

const CreateTripPage = () => {
  const [tripName, setTripName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('');
  const [members, setMembers] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [vacationType, setVacationType] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  
  const startDateRef = useRef(null);
  const endDateRef = useRef(null);
  
  const { createTrip } = useTrips();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const tripData = {
        name: tripName,
        startDate,
        endDate,
        budget: parseInt(budget) || 0,
        members: parseInt(members) || 1,
        phoneNumber,
        vacationType,
        description,
        status: 'planning',
        cities: [],
        activities: [],
        createdAt: new Date().toISOString()
      };
      
      const tripId = await createTrip(tripData);
      if (tripId) {
        toast.success('Trip created successfully!');
        navigate(`/trip/${tripId}/build`);
      }
    } catch (error) {
      toast.error('Failed to create trip');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-6 shadow-xl transform hover:scale-110 transition-transform duration-300">
            <MdFlightTakeoff className="text-white text-4xl" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 bg-clip-text text-transparent mb-3">
            Plan Your Next Adventure
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Create a new trip and start your journey towards unforgettable memories
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 backdrop-blur-lg bg-opacity-95 border border-gray-100 space-y-8 transform hover:shadow-3xl transition-all duration-300">
          {/* Trip Name */}
          <div className="group">
            <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center mr-3 shadow-md group-hover:scale-110 transition-transform">
                <FiGlobe className="text-white text-sm" />
              </div>
              Trip Name *
            </label>
            <input
              type="text"
              value={tripName}
              onChange={(e) => setTripName(e.target.value)}
              className="w-full px-5 py-4 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 hover:border-gray-300 bg-gray-50 focus:bg-white placeholder-gray-400"
              placeholder="e.g., Europe Summer Vacation 2024"
              required
            />
          </div>
          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="group">
              <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center mr-3 shadow-md group-hover:scale-110 transition-transform">
                  <FiCalendar className="text-white text-sm" />
                </div>
                Start Date *
              </label>
              <div className="relative">
                <FiCalendar 
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-500 group-hover:text-green-600 transition-colors cursor-pointer" 
                  onClick={() => startDateRef.current?.showPicker()}
                />
                <input
                  ref={startDateRef}
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 hover:border-gray-300 bg-white text-green-600 font-medium"
                  style={{ colorScheme: 'light' }}
                  required
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center mr-3 shadow-md group-hover:scale-110 transition-transform">
                  <FiCalendar className="text-white text-sm" />
                </div>
                End Date *
              </label>
              <div className="relative">
                <FiCalendar 
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-500 group-hover:text-green-600 transition-colors cursor-pointer" 
                  onClick={() => endDateRef.current?.showPicker()}
                />
                <input
                  ref={endDateRef}
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 hover:border-gray-300 bg-white text-green-600 font-medium"
                  style={{ colorScheme: 'light' }}
                  required
                />
              </div>
            </div>
          </div>
          {/* Budget */}
          <div className="group">
            <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center mr-3 shadow-md group-hover:scale-110 transition-transform">
                <FiDollarSign className="text-white text-sm" />
              </div>
              Estimated Budget (₹)
            </label>
            <div className="relative">
              <FiDollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-green-500 transition-colors" />
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full pl-12 pr-16 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 hover:border-gray-300 bg-gray-50 focus:bg-white placeholder-gray-400 text-lg"
                placeholder="50000"
                min="0"
              />
            </div>
          </div>
          {/* Number of Persons */}
          <div className="group">
            <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center mr-3 shadow-md group-hover:scale-110 transition-transform">
                <FiUsers className="text-white text-sm" />
              </div>
              Number of Persons
            </label>
            <div className="relative">
              <FiUsers className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-green-500 transition-colors" />
              <input
                type="number"
                value={members}
                onChange={(e) => setMembers(e.target.value)}
                className="w-full pl-12 pr-16 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 hover:border-gray-300 bg-gray-50 focus:bg-white placeholder-gray-400 text-lg"
                placeholder="2"
                min="1"
              />
            </div>
          </div>
          
          {/* Phone Number */}
          <div className="group">
            <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center mr-3 shadow-md group-hover:scale-110 transition-transform">
                <FiPhone className="text-white text-sm" />
              </div>
              Phone Number
            </label>
            <div className="relative">
              <FiPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-green-500 transition-colors" />
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 hover:border-gray-300 bg-gray-50 focus:bg-white placeholder-gray-400 text-lg"
                placeholder="+91 9876543210"
              />
            </div>
          </div>
          
          {/* Vacation Type */}
          <div className="group">
            <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center mr-3 shadow-md group-hover:scale-110 transition-transform">
                <FiMap className="text-white text-sm" />
              </div>
              Vacation Type
            </label>
            <div className="relative">
              <FiMap className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-500 group-hover:text-green-600 transition-colors" />
              <select
                value={vacationType}
                onChange={(e) => setVacationType(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 hover:border-gray-300 bg-white text-green-600 font-medium text-lg appearance-none cursor-pointer"
                style={{
                  colorScheme: 'light'
                }}
              >
                <option value="" className="text-gray-400">Select vacation type</option>
                <option value="honeymoon" className="text-green-600 bg-white">Honeymoon</option>
                <option value="friends-trip" className="text-green-600 bg-white">Friends Trip</option>
                <option value="family-trip" className="text-green-600 bg-white">Family Trip</option>
                <option value="corporate-trip" className="text-green-600 bg-white">Corporate Trip</option>
              </select>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Description */}
          <div className="group">
            <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center mr-3 shadow-md group-hover:scale-110 transition-transform">
                <FiFileText className="text-white text-sm" />
              </div>
              Description
              <span className="ml-2 text-xs font-normal text-gray-500">(Optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 hover:border-gray-300 bg-gray-50 focus:bg-white placeholder-gray-400 resize-none"
              placeholder="Describe your trip plans, destinations, activities you want to do..."
              rows="4"
            />
            <div className="mt-2 text-right text-xs text-gray-500">
              {description.length} characters
            </div>
          </div>
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t-2 border-gray-100">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 group relative overflow-hidden bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
            >
              <span className="relative z-10 flex items-center">
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Your Trip...
                  </>
                ) : (
                  <>
                    Create Trip & Start Planning
                    <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-700 via-green-600 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex-1 bg-gray-100 text-gray-700 font-semibold py-4 px-8 rounded-xl border-2 border-gray-200 hover:bg-gray-200 hover:border-gray-300 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
            >
              Cancel
            </button>
          </div>
        </form>

        {/* Tips Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100 transform hover:-translate-y-2 duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center mb-4 shadow-md">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Set Clear Goals</h3>
            <p className="text-sm text-gray-600">Define what you want to achieve and experience on this trip.</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100 transform hover:-translate-y-2 duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-700 rounded-xl flex items-center justify-center mb-4 shadow-md">
              <span className="text-2xl">💰</span>
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Budget Wisely</h3>
            <p className="text-sm text-gray-600">Add 10-15% buffer for unexpected expenses and spontaneous fun.</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100 transform hover:-translate-y-2 duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-600 rounded-xl flex items-center justify-center mb-4 shadow-md">
              <span className="text-2xl">📝</span>
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Plan Ahead</h3>
            <p className="text-sm text-gray-600">Book accommodations and activities early for better deals.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTripPage;