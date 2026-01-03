import React from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiCalendar, FiDollarSign, FiShare2 } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';

const TripCard = ({ trip }) => {
  const { darkMode } = useAuth();
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className={`rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 ${
      darkMode ? 'bg-gray-800' : 'bg-white'
    }`}>
      <div className="relative">
        <div className="h-40 rounded-t-xl mb-4 bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
          <span className="text-white text-xl font-bold">
            {trip.name.substring(0, 2).toUpperCase()}
          </span>
        </div>
        
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            trip.status === 'completed' 
              ? 'bg-green-100 text-green-800' 
              : trip.status === 'ongoing'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {trip.status || 'planning'}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className={`text-lg font-bold mb-2 truncate ${
          darkMode ? 'text-white' : 'text-gray-800'
        }`}>
          {trip.name}
        </h3>
        
        <div className="space-y-3 mb-4">
          <div className={`flex items-center text-sm ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            <FiCalendar className="mr-2 flex-shrink-0" />
            <span>{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</span>
          </div>
          
          <div className={`flex items-center text-sm ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            <FiMapPin className="mr-2 flex-shrink-0" />
            <span className="truncate">
              {trip.cities?.map(city => city.name).join(', ') || 'No cities added'}
            </span>
          </div>
          
          <div className={`flex items-center text-sm ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            <FiDollarSign className="mr-2 flex-shrink-0" />
            <span>₹{trip.budget?.toLocaleString() || '0'}</span>
          </div>
        </div>

        <div className={`flex flex-col sm:flex-row gap-2 pt-4 border-t ${
          darkMode ? 'border-gray-700' : 'border-gray-100'
        }`}>
          <Link 
            to={`/trip/${trip.id}/view`}
            className={`flex-1 text-center py-2 text-sm rounded-lg font-medium transition ${
              darkMode 
                ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            View Details
          </Link>
          <Link 
            to={`/trip/${trip.id}/build`}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:shadow-lg text-white text-center py-2 px-4 rounded-lg text-sm font-medium transition flex-1"
          >
            Edit Plan
          </Link>
          <Link 
            to={`/share/${trip.id}`}
            className={`flex items-center justify-center gap-1 py-2 px-4 rounded-lg text-sm font-medium transition ${
              darkMode 
                ? 'bg-green-900 text-green-300 hover:bg-green-800' 
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
            title="Share Trip"
          >
            <FiShare2 className="text-base" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TripCard;