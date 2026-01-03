import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTrips } from '../hooks/useTrips';
import TripCard from '../components/trip/TripCard';
import { 
  FiPlus, FiCalendar, FiMapPin, FiDollarSign, 
  FiCompass, FiTrendingUp 
} from 'react-icons/fi';

const DashboardPage = () => {
  const { trips, loading, getTrips } = useTrips();
  const [stats, setStats] = useState({
    totalTrips: 0,
    totalBudget: 0,
    totalCities: 0,
  });

  useEffect(() => {
    getTrips();
  }, []);

  useEffect(() => {
    if (trips) {
      const totalTrips = trips.length;
      const totalBudget = trips.reduce((sum, trip) => sum + (trip.budget || 0), 0);
      const totalCities = trips.reduce((sum, trip) => sum + (trip.cities?.length || 0), 0);
      
      setStats({ totalTrips, totalBudget, totalCities });
    }
  }, [trips]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gt-primary"></div>
      </div>
    );
  }

  return (
    <div className="page-padding fade-in">
      <div className="mb-8 md:mb-12">
        <h1 className="heading-primary">Welcome to GlobeTrotter</h1>
        <p className="text-lg text-gt-text-secondary">
          Plan, organize, and share your travel adventures
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card-padded">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gt-text-muted">Total Trips</p>
              <h3 className="text-2xl font-bold text-gt-primary">{stats.totalTrips}</h3>
            </div>
            <FiCalendar className="text-3xl text-gt-accent" />
          </div>
        </div>

        <div className="card-padded">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gt-text-muted">Total Budget</p>
              <h3 className="text-2xl font-bold text-gt-primary">
                ₹{stats.totalBudget.toLocaleString()}
              </h3>
            </div>
            <FiDollarSign className="text-3xl text-gt-accent" />
          </div>
        </div>

        <div className="card-padded">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gt-text-muted">Cities Visited</p>
              <h3 className="text-2xl font-bold text-gt-primary">{stats.totalCities}</h3>
            </div>
            <FiMapPin className="text-3xl text-gt-accent" />
          </div>
        </div>

        <div className="card-padded">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gt-text-muted">Planning</p>
              <h3 className="text-2xl font-bold text-gt-primary">
                {trips?.filter(t => t.status === 'planning').length || 0}
              </h3>
            </div>
            <FiCompass className="text-3xl text-gt-accent" />
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="heading-secondary">Your Trips</h2>
          <Link to="/create-trip" className="btn-primary flex items-center gap-2">
            <FiPlus /> Plan New Trip
          </Link>
        </div>

        {trips && trips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        ) : (
          <div className="card-padded text-center">
            <FiCompass className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Trips Yet</h3>
            <p className="text-gray-500 mb-6">Start planning your first adventure!</p>
            <Link to="/create-trip" className="btn-primary inline-flex items-center gap-2">
              <FiPlus /> Create Your First Trip
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;