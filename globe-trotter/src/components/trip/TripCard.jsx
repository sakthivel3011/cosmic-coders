import React from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiCalendar, FiUsers, FiDollarSign } from 'react-icons/fi';
import './TripCard.css';

const TripCard = ({ trip }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="trip-card scale-hover">
      <div className="relative">
        {/* Trip Image/Color Header */}
        <div 
          className="h-40 rounded-t-xl mb-4 bg-gradient-to-r from-gt-primary to-gt-accent flex items-center justify-center"
        >
          <span className="text-white text-xl font-bold">
            {trip.name.substring(0, 2).toUpperCase()}
          </span>
        </div>
        
        {/* Status Badge */}
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

      {/* Trip Info */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2 truncate">
          {trip.name}
        </h3>
        
        <div className="space-y-3 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <FiCalendar className="mr-2 flex-shrink-0" />
            <span>{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <FiMapPin className="mr-2 flex-shrink-0" />
            <span className="truncate">
              {trip.cities?.map(city => city.name).join(', ') || 'No cities added'}
            </span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <FiDollarSign className="mr-2 flex-shrink-0" />
            <span>₹{trip.budget?.toLocaleString() || '0'}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-gray-100">
          <Link 
            to={`/trip/${trip.id}/view`}
            className="btn-secondary flex-1 text-center py-2 text-sm"
          >
            View Details
          </Link>
          <Link 
            to={`/trip/${trip.id}/build`}
            className="bg-gt-accent hover:bg-gt-secondary text-white text-center py-2 px-4 rounded-lg text-sm font-medium transition flex-1"
          >
            Edit Plan
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TripCard;