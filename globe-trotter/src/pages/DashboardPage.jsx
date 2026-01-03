import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTrips } from '../hooks/useTrips';
import { useAuth } from '../hooks/useAuth';
import TripCard from '../components/trip/TripCard';
import { 
  FiPlus, FiCalendar, FiMapPin, FiDollarSign, 
  FiCompass, FiTrendingUp, FiChevronLeft, FiChevronRight 
} from 'react-icons/fi';

const DashboardPage = () => {
  const { trips, loading, getTrips } = useTrips();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalTrips: 0,
    totalBudget: 0,
    totalCities: 0,
  });
  const [showAllPackages, setShowAllPackages] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

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

  // Popular packages data
  const popularPackages = [
    {
      id: 1,
      title: 'India Tour Packages',
      tours: 98,
      image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800',
      category: 'india',
      description: 'Explore incredible India'
    },
    {
      id: 2,
      title: 'International Tour Packages',
      tours: 362,
      image: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=800',
      category: 'international',
      description: 'Discover the world'
    },
    {
      id: 3,
      title: 'Beach Destinations',
      tours: 145,
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
      category: 'beach',
      description: 'Relax on pristine beaches'
    }
  ];

  const handlePackageClick = (pkg) => {
    setSelectedCategory(pkg.category);
    setShowAllPackages(true);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gt-primary"></div>
      </div>
    );
  }

  if (showAllPackages) {
    return (
      <div className="page-padding fade-in">
        <button 
          onClick={() => setShowAllPackages(false)}
          className="mb-6 flex items-center gap-2 text-gt-primary hover:text-gt-primary-dark transition-colors"
        >
          <FiChevronLeft /> Back to Dashboard
        </button>
        <h1 className="heading-primary mb-8">
          {popularPackages.find(p => p.category === selectedCategory)?.title}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Sample package cards */}
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="card-padded hover:shadow-lg transition-shadow cursor-pointer">
              <img 
                src={`https://images.unsplash.com/photo-${1500000000000 + item * 10000}?w=400&h=250&fit=crop`}
                alt={`Package ${item}`}
                className="w-full h-48 object-cover rounded-lg mb-4"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=250&fit=crop';
                }}
              />
              <h3 className="text-xl font-bold mb-2">Amazing Tour Package {item}</h3>
              <p className="text-gt-text-secondary mb-4">7 Days • 6 Nights</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-gt-primary">₹25,999</span>
                <button className="btn-primary">Book Now</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      {/* Hero Section with Welcome */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-2 px-4 shadow-lg">
        <div className="container mx-auto max-w-7xl text-left">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white drop-shadow-md">Welcome to GlobeTrip</h1>
          {user?.displayName && (
            <p className="text-2xl md:text-3xl mb-4">Hello, {user.displayName}! 👋</p>
          )}
          <p className="text-lg md:text-xl text-green-50">
            Plan, organize, and share your travel adventures
          </p>
        </div>
      </div>

      {/* Video Section */}
      <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-green-900/20 via-transparent to-black/30 flex items-center justify-center z-10">
          <div className="text-center text-white px-4">
            <p className="text-xl md:text-2xl mb-4 italic text-green-300 drop-shadow-lg" style={{ fontFamily: 'cursive' }}>
              adventure
            </p>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 text-white drop-shadow-2xl">
              travel, world class
            </h2>
            <p className="text-sm md:text-lg max-w-3xl mx-auto text-green-50 drop-shadow-md">
              The real voyage of discovery consists not in seeking new landscapes, but in having new eyes. 
              Discover it with GTHolidays, the No.1 travel brand in South India
            </p>
          </div>
          <button className="absolute left-8 top-1/2 -translate-y-1/2 bg-white bg-opacity-30 hover:bg-opacity-50 rounded-full p-3 transition-all">
            <FiChevronLeft className="text-white text-2xl" />
          </button>
          <button className="absolute right-8 top-1/2 -translate-y-1/2 bg-white bg-opacity-30 hover:bg-opacity-50 rounded-full p-3 transition-all">
            <FiChevronRight className="text-white text-2xl" />
          </button>
        </div>
        <img 
          src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&h=500&fit=crop"
          alt="Travel Adventure"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Popular Packages Section */}
      <div className="page-padding py-12">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Popular Tour Packages</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {popularPackages.map((pkg) => (
            <div 
              key={pkg.id}
              onClick={() => handlePackageClick(pkg)}
              className="relative group cursor-pointer overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="relative h-80 overflow-hidden">
                <img 
                  src={pkg.image}
                  alt={pkg.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-70"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl md:text-3xl font-bold mb-2">{pkg.title}</h3>
                  <div className="inline-block bg-yellow-400 text-black font-bold px-4 py-2 text-lg">
                    {pkg.tours} TOURS
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats and Your Trips Section */}
      <div className="page-padding">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      </div>

      <div className="mb-8">
        

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
    </div>
  );
};

export default DashboardPage;