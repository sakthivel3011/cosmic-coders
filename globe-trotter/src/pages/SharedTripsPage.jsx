import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../hooks/useAuth';
import { FiShare2, FiMapPin, FiCalendar, FiDollarSign, FiEye } from 'react-icons/fi';

const SharedTripsPage = () => {
  const navigate = useNavigate();
  const { user, darkMode } = useAuth();
  const [sharedTrips, setSharedTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSharedTrips = async () => {
      if (!user) return;

      try {
        const tripsRef = collection(db, 'trips');
        const q = query(tripsRef, where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        
        const trips = [];
        querySnapshot.forEach((doc) => {
          trips.push({ id: doc.id, ...doc.data() });
        });
        
        setSharedTrips(trips);
      } catch (error) {
        console.error('Error fetching shared trips:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSharedTrips();
  }, [user]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        darkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Header */}
      <div className={`border-b ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4 mb-4">
            <div className={`p-3 rounded-xl ${
              darkMode ? 'bg-green-900/30' : 'bg-green-100'
            }`}>
              <FiShare2 className={`text-2xl ${
                darkMode ? 'text-green-400' : 'text-green-600'
              }`} />
            </div>
            <div>
              <h1 className={`text-3xl font-bold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Shared Trips
              </h1>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                View and manage your shared trip links
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {sharedTrips.length === 0 ? (
          <div className={`text-center py-16 rounded-xl ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <FiShare2 className={`text-6xl mx-auto mb-4 ${
              darkMode ? 'text-gray-600' : 'text-gray-300'
            }`} />
            <h3 className={`text-xl font-semibold mb-2 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              No Shared Trips Yet
            </h3>
            <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Create a trip and share it with friends and family
            </p>
            <button
              onClick={() => navigate('/create-trip')}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Create Your First Trip
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sharedTrips.map((trip) => (
              <div
                key={trip.id}
                className={`rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${
                  darkMode ? 'bg-gray-800' : 'bg-white'
                }`}
              >
                {/* Trip Header */}
                <div className="h-32 bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
                  <span className="text-white text-3xl font-bold">
                    {trip.name?.substring(0, 2).toUpperCase() || 'TR'}
                  </span>
                </div>

                {/* Trip Details */}
                <div className="p-5">
                  <h3 className={`text-lg font-bold mb-3 truncate ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {trip.name || 'Untitled Trip'}
                  </h3>

                  <div className="space-y-2 mb-4">
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
                        {trip.cities?.length || trip.destinations?.length || 0} destinations
                      </span>
                    </div>

                    <div className={`flex items-center text-sm ${
                      darkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      <FiDollarSign className="mr-2 flex-shrink-0" />
                      <span>${trip.budget?.toLocaleString() || 'N/A'}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className={`flex gap-2 pt-4 border-t ${
                    darkMode ? 'border-gray-700' : 'border-gray-100'
                  }`}>
                    <button
                      onClick={() => navigate(`/share/${trip.id}`)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
                    >
                      <FiEye />
                      View Share
                    </button>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/share/${trip.id}`);
                        alert('Link copied to clipboard!');
                      }}
                      className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition ${
                        darkMode
                          ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Copy Link
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SharedTripsPage;
