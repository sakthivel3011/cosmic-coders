import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTrips } from '../hooks/useTrips';
import { FiSearch, FiFilter, FiTrash2, FiEdit, FiEye, FiPlusCircle } from 'react-icons/fi';
import { MdTravelExplore } from 'react-icons/md';
import toast from 'react-hot-toast';

const MyTripsPage = () => {
  const { trips, loading, deleteTrip } = useTrips();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const handleDelete = async (tripId, tripName) => {
    if (window.confirm(`Are you sure you want to delete "${tripName}"?`)) {
      const success = await deleteTrip(tripId);
      if (success) {
        toast.success('Trip deleted successfully');
      } else {
        toast.error('Failed to delete trip');
      }
    }
  };

  const filteredTrips = trips?.filter(trip => {
    const matchesSearch = trip.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trip.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || trip.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-600"></div>
          <p className="text-green-600 font-medium">Loading your trips...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-6 shadow-xl transform hover:scale-110 transition-transform duration-300">
            <MdTravelExplore className="text-white text-4xl" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-green-600 mb-3">
            My Trips
          </h1>
          <p className="text-gray-600 text-lg">
            Manage all your travel plans in one place
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 mb-8 backdrop-blur-lg bg-opacity-95 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative group">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-green-500 transition-colors z-10" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 hover:border-gray-300 bg-gray-50 focus:bg-white"
                placeholder="Search trips by name or description..."
              />
            </div>

            <div className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <FiFilter className="text-white text-sm" />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 hover:border-gray-300 bg-gray-50 focus:bg-white font-medium"
              >
                <option value="all">All Status</option>
                <option value="planning">Planning</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Trips Table */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden backdrop-blur-lg bg-opacity-95 border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-green-50 to-emerald-50 border-b-2 border-green-100">
                  <th className="text-left py-4 px-6 font-bold text-gray-800">Trip Name</th>
                  <th className="text-left py-4 px-6 font-bold text-gray-800">Dates</th>
                  <th className="text-left py-4 px-6 font-bold text-gray-800">Status</th>
                  <th className="text-left py-4 px-6 font-bold text-gray-800">Budget</th>
                  <th className="text-left py-4 px-6 font-bold text-gray-800">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTrips?.length > 0 ? (
                  filteredTrips.map((trip) => (
                    <tr key={trip.id} className="border-b border-gray-100 hover:bg-green-50 transition-colors duration-200">
                      <td className="py-5 px-6">
                        <div>
                          <h3 className="font-semibold text-gray-900">{trip.name}</h3>
                          <p className="text-sm text-gray-500 truncate max-w-xs mt-1">
                            {trip.description || 'No description'}
                          </p>
                        </div>
                      </td>
                      <td className="py-5 px-6 text-gray-700">
                        <div className="text-sm">
                          {new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          <span className="mx-1">-</span>
                          {new Date(trip.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <span className={`px-4 py-2 rounded-full text-xs font-semibold ${
                          trip.status === 'completed' 
                            ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800' 
                            : trip.status === 'ongoing'
                            ? 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800'
                            : 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800'
                        }`}>
                          {trip.status || 'planning'}
                        </span>
                      </td>
                      <td className="py-5 px-6 font-semibold text-gray-900">
                        ₹{trip.budget?.toLocaleString() || '0'}
                      </td>
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-2">
                          <Link 
                            to={`/trip/${trip.id}/view`}
                            className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-110"
                            title="View"
                          >
                            <FiEye size={18} />
                          </Link>
                          <Link 
                            to={`/trip/${trip.id}/build`}
                            className="p-2.5 text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 hover:scale-110"
                            title="Edit"
                          >
                            <FiEdit size={18} />
                          </Link>
                          <button
                            onClick={() => handleDelete(trip.id, trip.name)}
                            className="p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110"
                            title="Delete"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-16 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                          <MdTravelExplore className="text-gray-400 text-3xl" />
                        </div>
                        <p className="text-gray-500 text-lg">
                          No trips found. <Link to="/create-trip" className="text-green-600 hover:text-green-700 font-semibold hover:underline">Create your first trip</Link>
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
          <p className="text-gray-600 font-medium">
            Showing <span className="text-green-600 font-bold">{filteredTrips?.length || 0}</span> of <span className="text-green-600 font-bold">{trips?.length || 0}</span> trips
          </p>
          <Link 
            to="/create-trip" 
            className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <FiPlusCircle className="text-xl group-hover:rotate-90 transition-transform duration-300" />
            Add New Trip
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MyTripsPage;