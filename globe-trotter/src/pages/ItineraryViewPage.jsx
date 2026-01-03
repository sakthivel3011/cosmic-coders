import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { 
  FiCalendar, FiMapPin, FiClock, FiDollarSign, 
  FiShare2, FiPrinter, FiDownload 
} from 'react-icons/fi';
import { format } from 'date-fns';

const ItineraryViewPage = () => {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const docRef = doc(db, 'trips', tripId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setTrip({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error('Error fetching trip:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [tripId]);

  const calculateTripDuration = () => {
    if (!trip?.startDate || !trip?.endDate) return 0;
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gt-primary"></div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="page-padding text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Trip not found</h2>
        <Link to="/dashboard" className="btn-primary">Go to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="page-padding fade-in">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="heading-primary">{trip.name}</h1>
            <p className="text-gray-600">{trip.description}</p>
          </div>
          <div className="flex gap-3">
            <button onClick={handlePrint} className="btn-secondary flex items-center gap-2">
              <FiPrinter /> Print
            </button>
            <button className="btn-primary flex items-center gap-2">
              <FiShare2 /> Share
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="card-padded">
            <div className="flex items-center gap-3">
              <FiCalendar className="text-gt-primary" />
              <div>
                <p className="text-sm text-gray-600">Duration</p>
                <p className="font-semibold">{calculateTripDuration()} days</p>
              </div>
            </div>
          </div>
          <div className="card-padded">
            <div className="flex items-center gap-3">
              <FiMapPin className="text-gt-primary" />
              <div>
                <p className="text-sm text-gray-600">Cities</p>
                <p className="font-semibold">{trip.cities?.length || 0}</p>
              </div>
            </div>
          </div>
          <div className="card-padded">
            <div className="flex items-center gap-3">
              <FiDollarSign className="text-gt-primary" />
              <div>
                <p className="text-sm text-gray-600">Budget</p>
                <p className="font-semibold">₹{trip.budget?.toLocaleString() || '0'}</p>
              </div>
            </div>
          </div>
          <div className="card-padded">
            <div className="flex items-center gap-3">
              <FiClock className="text-gt-primary" />
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className={`font-semibold capitalize ${
                  trip.status === 'completed' ? 'text-green-600' :
                  trip.status === 'ongoing' ? 'text-blue-600' :
                  'text-yellow-600'
                }`}>
                  {trip.status || 'planning'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {trip.cities?.map((city, cityIndex) => (
          <div key={cityIndex} className="card-padded">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-1">
                  {city.name}
                </h2>
                <p className="text-gray-600">{city.country}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Visit Date</p>
                <p className="font-semibold">
                  {format(new Date(city.visitDate), 'MMM dd, yyyy')}
                </p>
              </div>
            </div>

            {city.activities?.length > 0 ? (
              <div className="space-y-4">
                {city.activities.map((activity, activityIndex) => (
                  <div key={activityIndex} className="activity-card">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-gray-800">{activity.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Time</p>
                          <p className="font-medium">{activity.time}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Cost</p>
                          <p className="font-medium text-gt-primary">₹{activity.cost}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No activities planned for this city</p>
            )}
          </div>
        ))}

        {(!trip.cities || trip.cities.length === 0) && (
          <div className="card-padded text-center">
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Itinerary Yet</h3>
            <p className="text-gray-500 mb-6">Start building your itinerary by adding cities and activities</p>
            <Link to={`/trip/${tripId}/build`} className="btn-primary">
              Build Itinerary
            </Link>
          </div>
        )}
      </div>

      <div className="mt-8 flex justify-between items-center">
        <Link to="/dashboard" className="text-gt-primary hover:underline">
          ← Back to Dashboard
        </Link>
        <Link to={`/trip/${tripId}/budget`} className="btn-primary">
          View Budget Breakdown
        </Link>
      </div>
    </div>
  );
};

export default ItineraryViewPage;