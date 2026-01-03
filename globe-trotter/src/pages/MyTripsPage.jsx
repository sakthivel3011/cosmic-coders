import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTrips } from '../hooks/useTrips';
import { FiSearch, FiFilter, FiTrash2, FiEdit, FiEye } from 'react-icons/fi';
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
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gt-primary"></div>
      </div>
    );
  }

  return (
    <div className="page-padding fade-in">
      <div className="mb-8">
        <h1 className="heading-primary">My Trips</h1>
        <p className="text-gray-600">Manage all your travel plans</p>
      </div>

      <div className="card-padded mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
              placeholder="Search trips by name or description..."
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <FiFilter className="mr-2 text-gray-500" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="input-field"
              >
                <option value="all">All Status</option>
                <option value="planning">Planning</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Trip Name</th>
                <th className="text-left py-3 px-4">Dates</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Budget</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTrips?.length > 0 ? (
                filteredTrips.map((trip) => (
                  <tr key={trip.id} className="border-b hover:bg-gt-bg-light">
                    <td className="py-4 px-4">
                      <div>
                        <h3 className="font-medium">{trip.name}</h3>
                        <p className="text-sm text-gray-500 truncate max-w-xs">
                          {trip.description || 'No description'}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        trip.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : trip.status === 'ongoing'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {trip.status || 'planning'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      ₹{trip.budget?.toLocaleString() || '0'}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Link 
                          to={`/trip/${trip.id}/view`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                          title="View"
                        >
                          <FiEye />
                        </Link>
                        <Link 
                          to={`/trip/${trip.id}/build`}
                          className="p-2 text-gt-primary hover:bg-gt-soft rounded"
                          title="Edit"
                        >
                          <FiEdit />
                        </Link>
                        <button
                          onClick={() => handleDelete(trip.id, trip.name)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                          title="Delete"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-500">
                    No trips found. <Link to="/create-trip" className="text-gt-primary hover:underline">Create your first trip</Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <p className="text-gray-600">
          Showing {filteredTrips?.length || 0} of {trips?.length || 0} trips
        </p>
        <Link to="/create-trip" className="btn-primary">
          + Add New Trip
        </Link>
      </div>
    </div>
  );
};

export default MyTripsPage;